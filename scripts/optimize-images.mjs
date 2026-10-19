import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import sharp from "sharp";

const output = "public/images/optimized";
await mkdir(output, { recursive: true });
const inputs = [{ source: "src/assets/portrait.jpg", name: "portrait", widths: [480, 900, 1600] }];
for (const app of ["intervalsicu", "tempostudio"]) {
  await mkdir(`${output}/${app}`, { recursive: true });
  for (const file of await readdir(`public/images/${app}`)) {
    if (file.endsWith(".png")) inputs.push({ source: `public/images/${app}/${file}`, name: `${app}/${file.slice(0, -4)}`, widths: [256, 512, 768] });
  }
}
const fingerprint = createHash("sha256").update("avif-55-effort4-webp82-v1" + sharp.versions.sharp);
for (const input of inputs) fingerprint.update(await readFile(input.source));
const digest = fingerprint.digest("hex");
let cached = "";
try { cached = await readFile(`${output}/.fingerprint`, "utf8"); } catch {}
if (cached !== digest) {
  for (const input of inputs) {
    for (const width of input.widths) {
      await Promise.all([
        sharp(input.source).resize({ width, withoutEnlargement: true }).avif({ quality: 55, effort: 4 }).toFile(`${output}/${input.name}-${width}.avif`),
        sharp(input.source).resize({ width, withoutEnlargement: true }).webp({ quality: 82 }).toFile(`${output}/${input.name}-${width}.webp`),
      ]);
    }
  }
  await writeFile(`${output}/.fingerprint`, digest);
}

await mkdir("public/images/social", { recursive: true });
for (const [name, label, first, second, subtitle] of [
  ["portfolio", "JONATHAN GRIESINGER", "Fullstack", "Developer", "React · TypeScript · Node.js · AWS"],
  ["intervalsicu", "AN INDEPENDENT IOS COMPANION", "Your training.", "A little closer.", "Intervals ICU Companion · Jonathan Griesinger"],
  ["tempostudio", "TEMPO STUDIO", "Your effort.", "Ready to share.", "Native video editing · Routes · Activity stats"],
]) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><rect width="1200" height="630" fill="#faf7f0"/><rect x="64" y="70" width="70" height="7" fill="#a54827"/><text x="64" y="134" font-family="sans-serif" font-size="23" letter-spacing="3" fill="#a54827">${label}</text><text x="60" y="270" font-family="serif" font-size="92" fill="#302a24">${first}</text><text x="60" y="370" font-family="serif" font-size="92" fill="#302a24">${second}</text><path d="M64 445H1136" stroke="#d9d0c3"/><text x="64" y="505" font-family="sans-serif" font-size="27" fill="#554c42">${subtitle}</text><text x="64" y="574" font-family="sans-serif" font-size="21" fill="#554c42">jonathangriesinger.de</text><circle cx="1090" cy="100" r="29" fill="#a54827"/></svg>`;
  await sharp(Buffer.from(svg)).jpeg({ quality: 90 }).toFile(`public/images/social/${name}.jpg`);
}
console.log("Responsive AVIF/WebP images and social previews are ready.");
