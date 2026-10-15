// Real files, not mocked image imports: catch missing simulator exports before shipping.
// @vitest-environment node
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("public demo screenshots", () => {
  for (const name of ["today", "trends", "pace", "calendar"]) {
    it(`${name} is a real portrait PNG with the dimensions declared by the page`, () => {
      const file = readFileSync(new URL(`../public/images/intervalsicu/${name}.png`, import.meta.url));
      expect(file.subarray(0, 8).toString("hex")).toBe("89504e470d0a1a0a");
      expect(file.readUInt32BE(16)).toBe(1206);
      expect(file.readUInt32BE(20)).toBe(2622);
    });
  }
});
