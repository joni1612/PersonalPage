// @vitest-environment node
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("Tempo Studio real screenshots",()=>{
  for(const name of ["timeline","activity","style","branding","cover"]) {
    it(`${name} exists at its declared native size`,()=>{
      const file=readFileSync(new URL(`../public/images/tempostudio/${name}.png`,import.meta.url));
      expect(file.subarray(0,8).toString("hex")).toBe("89504e470d0a1a0a");
      expect(file.readUInt32BE(16)).toBe(1206);expect(file.readUInt32BE(20)).toBe(2622);
    });
  }
});
