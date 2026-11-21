import sharp from "sharp";
import { mkdir, stat, writeFile } from "node:fs/promises";
import { dirname } from "node:path";

const jobs = [
  ["imgs/seha1.png", "imgs/optimized/seha-plus/patient/seha1.webp", 2560],
  ["imgs/seha2.png", "imgs/optimized/seha-plus/facility/seha2.webp", 2560],
  ["imgs/seha3.png", "imgs/optimized/seha-plus/patient/seha3.webp", 2560],
  ["imgs/seha4.png", "imgs/optimized/seha-plus/doctor/seha4.webp", 2560],
  ["imgs/drevr1.png", "imgs/optimized/drevr/passenger/drevr1.webp", 2560],
  ["imgs/drevr2.png", "imgs/optimized/drevr/driver/drevr2.webp", 2560],
  ["imgs/dashboard1.png", "imgs/optimized/dashboards/dashboard1.webp", 2560],
  ["imgs/dashboard2.png", "imgs/optimized/dashboards/dashboard2.webp", 2560],
  ["imgs/athkar1.png", "imgs/optimized/athkar/athkar1.webp", 2560],
  ["imgs/athkar2.png", "imgs/optimized/athkar/athkar2.webp", 2560],
  ["imgs/foodApo.png", "imgs/optimized/restaurant/foodApo.webp", 2560],
  ["imgs/foodApo1.png", "imgs/optimized/restaurant/foodApo1.webp", 2560],
  ["imgs/store1.png", "imgs/optimized/ecommerce/store1.webp", 2560],
  ["imgs/store2.png", "imgs/optimized/ecommerce/store2.webp", 2560],
  ["imgs/carRental.png", "imgs/optimized/car-rental/carRental.webp", 2560],
  ["imgs/carRental1.png", "imgs/optimized/car-rental/carRental1.webp", 2560],
  ["imgs/carRentWeb1.png", "imgs/optimized/car-rental/carRentWeb1.webp", 2560],
  ["imgs/carRentWeb2.png", "imgs/optimized/car-rental/carRentWeb2.webp", 2560],
  ...[2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((n) => [
    `imgs/optimized/seha-plus/patient/legacy/patient${n}.png`,
    `imgs/optimized/seha-plus/patient/patient${n}.webp`, 2560,
  ]),
  ...[1, 2, 3, 4].map((n) => [
    `imgs/optimized/seha-plus/doctor/legacy/dr${n}.png`,
    `imgs/optimized/seha-plus/doctor/dr${n}.webp`, 2560,
  ]),
  ...[2, 3, 4, 6, 7].map((n) => [
    `imgs/optimized/seha-plus/facility/legacy/facility${n}.png`,
    `imgs/optimized/seha-plus/facility/facility${n}.webp`, 2560,
  ]),
  ...[3, 5, 6, 7, 8, 9].map((n) => [
    `imgs/optimized/drevr/passenger/legacy/drevr${n}.png`,
    `imgs/optimized/drevr/passenger/drevr${n}.webp`, 2560,
  ]),
  ...[22, 222].map((n) => [
    `imgs/optimized/drevr/driver/legacy/drevr${n}.png`,
    `imgs/optimized/drevr/driver/drevr${n}.webp`, 2560,
  ]),
  ["public/imgs/walletUIUX.png", "public/imgs/optimized/uiux/walletUIUX.webp", 1800],
  ["public/imgs/cryptoUIUX.png", "public/imgs/optimized/uiux/cryptoUIUX.webp", 1800],
  ["public/imgs/carUIUX.png", "public/imgs/optimized/uiux/carUIUX.webp", 1800],
];

const report = [];

async function convert(source, destination, maxDimension) {
  await mkdir(dirname(destination), { recursive: true });
  const before = await stat(source);
  const input = sharp(source, { failOn: "warning" });
  const sourceMetadata = await input.metadata();
  await input
    .resize({ width: maxDimension, height: maxDimension, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 90, alphaQuality: 100, smartSubsample: true, effort: 5 })
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
    alphaPreserved: Boolean(sourceMetadata.hasAlpha) === Boolean(outputMetadata.hasAlpha),
  });
}

for (const [source, destination, maxDimension] of jobs) {
  await convert(source, destination, maxDimension);
}

await mkdir("docs", { recursive: true });
await writeFile("docs/image-optimization-report.json", `${JSON.stringify(report, null, 2)}\n`);
console.table(report);
