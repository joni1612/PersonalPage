import assert from "node:assert/strict";
import { test } from "node:test";
import { uploadPrerenderedPages } from "../scripts/deploy-pages.mjs";

test("publishes nested prerendered pages at clean S3 keys using only object uploads", () => {
  const calls = [];
  uploadPrerenderedPages("portfolio-bucket", ["/", "/projects", "/projects/rag-doc-chat", "/tempostudio/privacy"], (...args) => calls.push(args));
  assert.deepEqual(calls, ["/projects", "/projects/rag-doc-chat", "/tempostudio/privacy"].map(path => [
    "aws",
    ["s3", "cp", `dist${path}/index.html`, `s3://portfolio-bucket${path}`, "--content-type", "text/html; charset=utf-8"],
    { stdio: "inherit" },
  ]));
});

test("a missing bucket fails before any upload is attempted", () => {
  const calls = [];
  assert.throws(() => uploadPrerenderedPages(undefined, ["/projects"], (...args) => calls.push(args)), /bucket/i);
  assert.deepEqual(calls, []);
});
