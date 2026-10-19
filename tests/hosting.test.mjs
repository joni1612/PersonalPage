import assert from "node:assert/strict";
import { test } from "node:test";
import { cacheControl } from "../scripts/hosting.mjs";

test("local preview cache policies distinguish versioned assets from documents", () => {
  assert.equal(cacheControl("/assets/main-abcd.js"), "public, max-age=31536000, immutable");
  assert.equal(cacheControl("/projects/index.html"), "no-cache");
  assert.equal(cacheControl("/robots.txt"), "public, max-age=3600, must-revalidate");
  assert.equal(cacheControl("/images/optimized/cover-512.avif"), "public, max-age=86400, must-revalidate");
});
