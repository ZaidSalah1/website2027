import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";

await mkdir("artifacts/project-images", { recursive: true });
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const errors = [];
page.on("console", (message) => message.type() === "error" && errors.push(message.text()));
page.on("pageerror", (error) => errors.push(error.message));
await page.goto("http://127.0.0.1:3002", { waitUntil: "networkidle" });
await page.waitForTimeout(600);

const pin = await page.evaluate(() => {
  const stage = document.querySelector(".projects-stage");
  const spacer = stage?.parentElement?.classList.contains("pin-spacer") ? stage.parentElement : stage;
  const rect = spacer?.getBoundingClientRect();
  return { start: (rect?.top ?? 0) + scrollY, range: Math.max(0, (spacer?.scrollHeight ?? innerHeight) - innerHeight) };
});

for (const [name, progress] of [["seha-plus", 0.02], ["drevr", 0.5]]) {
  await page.evaluate(({ start, range, progress }) => scrollTo(0, start + range * progress), { ...pin, progress });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: `artifacts/project-images/${name}-1440.png` });
}

const images = await page.evaluate(() => [...document.querySelectorAll(".project-showcase-image")].map((image) => ({
  alt: image.getAttribute("alt"),
  src: image.getAttribute("src"),
  loaded: image.complete && image.naturalWidth > 0,
  natural: [image.naturalWidth, image.naturalHeight],
})));
const overflow = await page.evaluate(() => ({ viewport: innerWidth, document: document.documentElement.scrollWidth }));
console.log(JSON.stringify({ pin, images, errors, overflow }, null, 2));
await browser.close();
