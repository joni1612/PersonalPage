import { execFileSync } from "node:child_process";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { createCloudFrontFunction, configureDistribution } from "./hosting.mjs";

const distributionId = process.env.CLOUDFRONT_DISTRIBUTION_ID;
if (!distributionId) throw new Error("Set CLOUDFRONT_DISTRIBUTION_ID to the website distribution ID.");
const functionName = `personal-page-routes-${distributionId}`;
const apply = process.argv.includes("--apply");
function aws(...args) {
  return JSON.parse(execFileSync("aws", ["cloudfront", ...args, "--output", "json", "--no-cli-pager"], { encoding: "utf8" }));
}
const distribution = aws("get-distribution-config", "--id", distributionId);
const paths = JSON.parse(await readFile("dist/routes.json", "utf8"));
await mkdir(".prerender", { recursive: true });
const codeFile = ".prerender/cloudfront-function.js";
await writeFile(codeFile, createCloudFrontFunction(paths));
if (!distribution.DistributionConfig.Origins.Items.length) throw new Error("Distribution has no origins.");
const arnPrefix = aws("get-distribution", "--id", distributionId).Distribution.ARN.split(":distribution/")[0];
const functionArn = `${arnPrefix}:function/${functionName}`;
const config = configureDistribution(distribution.DistributionConfig, functionArn);
const configFile = ".prerender/distribution-config.json";
await writeFile(configFile, JSON.stringify(config, null, 2));
if (!apply) {
  console.log(`Prepared ${codeFile} and ${configFile}. Run with --apply to publish and associate the function.`);
} else {
  const functions = aws("list-functions", "--stage", "DEVELOPMENT").FunctionList.Items ?? [];
  const existing = functions.find(item => item.Name === functionName);
  const functionConfig = JSON.stringify({ Comment: "Known static page routing for the personal website", Runtime: "cloudfront-js-2.0" });
  const updated = existing
    ? aws("update-function", "--name", functionName, "--if-match", aws("describe-function", "--name", functionName).ETag, "--function-config", functionConfig, "--function-code", `fileb://${codeFile}`)
    : aws("create-function", "--name", functionName, "--function-config", functionConfig, "--function-code", `fileb://${codeFile}`);
  aws("publish-function", "--name", functionName, "--if-match", updated.ETag);
  aws("update-distribution", "--id", distributionId, "--if-match", distribution.ETag, "--distribution-config", `file://${configFile}`);
  console.log("Published static routing and 404 configuration. CloudFront propagation may take several minutes.");
}
