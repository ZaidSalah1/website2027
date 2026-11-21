import { chromium } from "playwright";

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const failures = [];
page.on("response", response => { if (response.status() >= 400) failures.push(`${response.status()} ${response.url()}`); });
await page.goto("http://127.0.0.1:3002", { waitUntil: "networkidle" });
await page.locator("#hero-end .project-panel").first().scrollIntoViewIfNeeded();
await page.locator("#hero-end .glitch-current.is-ready").first().waitFor({ state: "visible" });
const result = await page.locator("#hero-end .glitch-project-image").first().evaluate(root => ({
  containerBackground: getComputedStyle(root).backgroundColor,
  placeholderOpacity: getComputedStyle(root.querySelector(".glitch-placeholder")).opacity,
  currentDecoded: root.querySelector(".glitch-current").complete && root.querySelector(".glitch-current").naturalWidth > 0,
}));
await page.locator("#hero-end .project-panel").first().screenshot({ path: "project-alpha-check.png" });
let blankFrames = 0;
for (let index = 0; index < 160; index++) {
  const visible = await page.locator("#hero-end .glitch-project-image").first().evaluate(root => [...root.querySelectorAll("img")].some(image => image.complete && image.naturalWidth > 0 && Number.parseFloat(getComputedStyle(image).opacity) > .35));
  if (!visible) blankFrames++;
  await page.waitForTimeout(25);
}
console.log(JSON.stringify({ ...result, blankFrames, samples: 160, failures }, null, 2));
await browser.close();
