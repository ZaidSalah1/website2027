import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";

const browser = await chromium.launch({ headless: true, executablePath: "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe" });
await mkdir("artifacts/hero", { recursive: true });

for (const test of [
  { name: "desktop", width: 1440, height: 900 },
  { name: "mobile", width: 390, height: 844 },
]) {
  const page = await browser.newPage({ viewport: { width: test.width, height: test.height }, deviceScaleFactor: 1 });
  const errors = [];
  page.on("console", (msg) => { if (msg.type() === "error") errors.push(msg.text()); });
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("http://127.0.0.1:3000", { waitUntil: "networkidle" });
  await page.waitForTimeout(1800);
  await page.screenshot({ path: `artifacts/hero/${test.name}.png` });
  await page.mouse.wheel(0, Math.round(test.height * .72));
  await page.waitForTimeout(700);
  await page.screenshot({ path: `artifacts/hero/${test.name}-scroll.png` });
  const metrics = await page.evaluate(() => ({
    viewport: [innerWidth, innerHeight],
    scrollY,
    documentHeight: document.documentElement.scrollHeight,
    horizontalOverflow: document.documentElement.scrollWidth - innerWidth,
    hero: document.querySelector(".hero")?.getBoundingClientRect().toJSON(),
    portrait: document.querySelector(".portrait-wrap")?.getBoundingClientRect().toJSON(),
    h1: document.querySelector("h1")?.textContent,
  }));
  console.log(JSON.stringify({ test: test.name, metrics, errors }));
  await page.close();
}
await browser.close();
