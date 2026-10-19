import { execFileSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";

export function uploadPrerenderedPages(bucket, paths, run = execFileSync) {
  if (!bucket) throw new Error("Provide the S3 bucket name.");
  for (const path of paths) {
    if (path === "/") continue;
    run("aws", ["s3", "cp", `dist${path}/index.html`, `s3://${bucket}${path}`, "--content-type", "text/html; charset=utf-8"], { stdio: "inherit" });
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const paths = JSON.parse(await readFile("dist/routes.json", "utf8"));
  uploadPrerenderedPages(process.argv[2], paths);
}
