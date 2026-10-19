export const cloudFrontErrors = [403, 404].map(ErrorCode => ({
  ErrorCode,
  ResponsePagePath: "/404.html",
  ResponseCode: "404",
  ErrorCachingMinTTL: 0,
}));

export function cacheControl(path) {
  if (path.startsWith("/assets/")) return "public, max-age=31536000, immutable";
  if (path === "/robots.txt" || path === "/sitemap.xml") return "public, max-age=3600, must-revalidate";
  if (path.startsWith("/images/")) return "public, max-age=86400, must-revalidate";
  return "no-cache";
}

export function createCloudFrontFunction(paths) {
  return `function handler(event) {
    var request = event.request;
    var paths = ${JSON.stringify(paths)};
    var clean = request.uri.replace(/\\/index\\.html$/, "").replace(/\\/+$/, "") || "/";
    if (paths.indexOf(clean) !== -1) {
      if (request.uri !== clean) {
        var query = [];
        Object.keys(request.querystring || {}).forEach(function(key) {
          var item = request.querystring[key];
          (item.multiValue || [item]).forEach(function(value) { query.push(key + "=" + value.value); });
        });
        return { statusCode: 308, statusDescription: "Permanent Redirect", headers: { location: { value: clean + (query.length ? "?" + query.join("&") : "") } } };
      }
      request.uri = clean === "/" ? "/index.html" : clean + "/index.html";
    }
    return request;
  }`;
}

export function configureDistribution(existing, functionArn) {
  const config = structuredClone(existing);
  const behavior = config.DefaultCacheBehavior;
  behavior.Compress = true;
  const associations = behavior.FunctionAssociations?.Items ?? [];
  if (associations.some(item => item.EventType === "viewer-request" && item.FunctionARN !== functionArn) ||
      (behavior.LambdaFunctionAssociations?.Items ?? []).some(item => item.EventType === "viewer-request")) {
    throw new Error("An existing viewer-request function must be integrated before deploying static routing.");
  }
  const functions = [...associations.filter(item => item.EventType !== "viewer-request"), { EventType: "viewer-request", FunctionARN: functionArn }];
  behavior.FunctionAssociations = { Quantity: functions.length, Items: functions };
  const errors = [...(config.CustomErrorResponses?.Items ?? []).filter(item => ![403, 404].includes(item.ErrorCode)), ...cloudFrontErrors];
  config.CustomErrorResponses = { Quantity: errors.length, Items: errors };
  config.DefaultRootObject = "index.html";
  return config;
}
