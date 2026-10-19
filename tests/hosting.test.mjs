import assert from "node:assert/strict";
import { test } from "node:test";
import { runInNewContext } from "node:vm";
import { createCloudFrontFunction, cacheControl, cloudFrontErrors, configureDistribution } from "../scripts/hosting.mjs";

test("edge routing rewrites only known pages and preserves missing asset requests", () => {
  const context = {};
  runInNewContext(createCloudFrontFunction(["/", "/projects", "/tempostudio/privacy"]), context);
  for (const [uri, expected] of [["/", "/index.html"], ["/projects", "/projects/index.html"], ["/tempostudio/privacy", "/tempostudio/privacy/index.html"], ["/missing", "/missing"], ["/assets/missing.js", "/assets/missing.js"], ["/robots.txt", "/robots.txt"]]) {
    assert.equal(context.handler({ request: { uri, querystring: {} } }).uri, expected);
  }
  const redirect = context.handler({ request: { uri: "/projects/", querystring: { source: { value: "profile" } } } });
  assert.equal(redirect.statusCode, 308);
  assert.equal(redirect.headers.location.value, "/projects?source=profile");
  const encoded = context.handler({ request: { uri: "/projects/index.html", querystring: { q: { value: "React%20%26%20TypeScript" }, tag: { multiValue: [{ value: "a" }, { value: "b" }] } } } });
  assert.equal(encoded.headers.location.value, "/projects?q=React%20%26%20TypeScript&tag=a&tag=b");
});

test("CDN configuration preserves unrelated settings and rejects an existing routing function", () => {
  const existing = { DefaultCacheBehavior: { Compress: true, FunctionAssociations: { Quantity: 1, Items: [{ EventType: "viewer-response", FunctionARN: "response-function" }] } }, CustomErrorResponses: { Quantity: 1, Items: [{ ErrorCode: 500, ErrorCachingMinTTL: 10 }] }, Comment: "keep this" };
  const configured = configureDistribution(existing, "static-routes");
  assert.equal(configured.Comment, "keep this");
  assert.equal(configured.DefaultCacheBehavior.Compress, true);
  assert.equal(configured.CustomErrorResponses.Items[0].ErrorCode, 500);
  assert.equal(configured.DefaultCacheBehavior.FunctionAssociations.Quantity, 2);
  assert.equal(existing.DefaultCacheBehavior.FunctionAssociations.Quantity, 1);
  assert.deepEqual(configureDistribution(configured, "static-routes"), configured);
  assert.throws(() => configureDistribution(configured, "other-function"), /existing viewer-request/);
});

test("origin errors stay 404 and cache policies distinguish versioned assets from documents", () => {
  assert.deepEqual(cloudFrontErrors.map(error => [error.ErrorCode, error.ResponseCode, error.ResponsePagePath]), [[403, "404", "/404.html"], [404, "404", "/404.html"]]);
  assert.equal(cacheControl("/assets/main-abcd.js"), "public, max-age=31536000, immutable");
  assert.equal(cacheControl("/projects/index.html"), "no-cache");
  assert.equal(cacheControl("/robots.txt"), "public, max-age=3600, must-revalidate");
  assert.equal(cacheControl("/images/optimized/cover-512.avif"), "public, max-age=86400, must-revalidate");
});
