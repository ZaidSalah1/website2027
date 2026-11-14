import sharp from "sharp";
import { mkdir, stat, writeFile } from "node:fs/promises";
import { basename, join } from "node:path";

const projectImages = [
  "seha1.png", "seha2.png", "seha3.png", "seha22.png", "drevr1.png",
  "athkar1.png", "athkar2.png", "foodApo.png", "foodApo1.png",
  "store1.png", "store2.png", "carRental.png", "carRental1.png",
];
const designImages = ["walletUIUX.png", "cryptoUIUX.png", "carUIUX.png"];
const report = [];

async function convert(source, destination, maxDimension) {
  const before = await stat(source);
  const input = sharp(source, { failOn: "warning" });
  const sourceMetadata = await input.metadata();
  await input
    .resize({ width: maxDimension, height: maxDimension, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 88, alphaQuality: 100, smartSubsample: true, effort: 5 })
    .toFile(destination);
  const after = await stat(destination);
  const outputMetadata = await sharp(destination).metadata();
  report.push({
    source: source.replaceAll("\\", "/"),
    output: destination.replaceAll("\\", "/"),
    beforeBytes: before.size,
    afterBytes: after.size,
    reductionPercent: Number(((1 - after.size / before.size) * 100).toFixed(1)),
    beforeDimensions: `${sourceMetadata.width}x${sourceMetadata.height}`,
    afterDimensions: `${outputMetadata.width}x${outputMetadata.height}`,
  });
}

await mkdir("imgs/optimized", { recursive: true });
for (const filename of projectImages) {
  await convert(join("imgs", filename), join("imgs", "optimized", basename(filename, ".png") + ".webp"), 2560);
}
await mkdir("public/imgs/optimized", { recursive: true });
for (const filename of designImages) {
  await convert(join("public", "imgs", filename), join("public", "imgs", "optimized", basename(filename, ".png") + ".webp"), 1800);
}
await mkdir("docs", { recursive: true });
await writeFile("docs/image-optimization-report.json", JSON.stringify(report, null, 2) + "\n");
console.table(report);
