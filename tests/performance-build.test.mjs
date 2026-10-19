import assert from "node:assert/strict";
import { readdir, readFile, stat } from "node:fs/promises";
import { test } from "node:test";
import { JSDOM } from "jsdom";

test("screenshots and portrait provide smaller responsive modern images with intrinsic dimensions", async () => {
  for (const path of ["", "/intervalsicu", "/tempostudio"]) {
    const document = new JSDOM(await readFile(`dist${path}/index.html`, "utf8")).window.document;
    for (const image of document.querySelectorAll("main img")) {
      assert.ok(Number(image.width) > 0 && Number(image.height) > 0);
      assert.ok(image.alt.length > 20);
      const picture = image.closest("picture");
      assert.ok(picture);
      for (const type of ["image/avif", "image/webp"]) {
        const source = picture.querySelector(`source[type="${type}"]`);
        assert.ok(source.sizes);
        const candidates = source.srcset.split(",").map(value => value.trim().split(" "));
        assert.ok(candidates.length >= 3);
        for (const [file, width] of candidates) {
          assert.match(width, /^\d+w$/);
          assert.ok((await stat(`dist${file}`)).size > 0);
        }
      }
    }
    assert.equal(document.querySelector("main img").getAttribute("fetchpriority"), "high");
  }
  assert.ok((await stat("dist/images/optimized/tempostudio/cover-512.avif")).size < 100_000);
});

test("route code is split and only Latin WOFF2 fonts are emitted", async () => {
  const manifest = JSON.parse(await readFile("dist/.vite/manifest.json", "utf8"));
  const entry = manifest["index.html"];
  assert.ok(entry.dynamicImports.length >= 7);
  const entryScript = await readFile(`dist/${entry.file}`, "utf8");
  assert.doesNotMatch(entryScript, /Keychain items can survive uninstall/);
  const fonts = (await readdir("dist/assets")).filter(file => /\.woff2?$/.test(file));
  assert.ok(fonts.length > 0 && fonts.length <= 7);
  for (const font of fonts) assert.match(font, /-latin-.*\.woff2$/);
  const total = (await Promise.all(fonts.map(file => stat(`dist/assets/${file}`)))).reduce((sum, file) => sum + file.size, 0);
  assert.ok(total < 150_000);
});
