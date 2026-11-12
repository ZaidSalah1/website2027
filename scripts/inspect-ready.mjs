import { chromium } from "playwright";
const browser = await chromium.launch({ headless: true, executablePath: "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe" });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://127.0.0.1:3001", { waitUntil: "networkidle" });
await page.waitForTimeout(500);
const top = await page.locator(".ready-transition").evaluate((el) => el.getBoundingClientRect().top + scrollY);
for (const offset of [0, 180, 360, 540, 720]) {
  await page.evaluate((y) => scrollTo(0, y), top + offset);
  await page.waitForTimeout(700);
  const state = await page.locator(".ready-stage").evaluate((el) => ({ rect: el.getBoundingClientRect().toJSON(), clip: getComputedStyle(el).clipPath, transform: getComputedStyle(el).transform }));
  console.log(JSON.stringify({ offset, state }));
}
await browser.close();
