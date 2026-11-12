import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";

const output = "artifacts/reference";
await mkdir(output, { recursive: true });
const browser = await chromium.launch({
  headless: true,
  executablePath: "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
});
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
await page.goto("https://venkateshrapolu.vercel.app/", { waitUntil: "networkidle", timeout: 120000 });
await page.waitForTimeout(3000);

const initial = await page.evaluate(() => ({
  title: document.title,
  height: document.documentElement.scrollHeight,
  viewport: [innerWidth, innerHeight],
  bodyOverflow: getComputedStyle(document.body).overflow,
  headings: [...document.querySelectorAll("h1,h2,h3")].map((el) => el.textContent?.trim()).filter(Boolean),
  sections: [...document.querySelectorAll("section")].map((el, index) => {
    const r = el.getBoundingClientRect();
    return { index, id: el.id, className: el.className, top: r.top + scrollY, height: r.height };
  }),
}));

const samples = [];
const max = initial.height - 900;
const step = 450;
for (let y = 0, i = 0; y <= max; y += step, i++) {
  await page.evaluate((target) => window.scrollTo({ top: target, behavior: "instant" }), y);
  await page.waitForTimeout(180);
  samples.push(await page.evaluate(() => {
    const atCenter = document.elementFromPoint(innerWidth / 2, innerHeight / 2);
    const fixed = [...document.querySelectorAll("body *")].filter((el) => {
      const p = getComputedStyle(el).position;
      return p === "fixed" || p === "sticky";
    }).slice(0, 30).map((el) => ({ tag: el.tagName, id: el.id, className: el.className, position: getComputedStyle(el).position }));
    return {
      y: scrollY,
      center: atCenter ? { tag: atCenter.tagName, text: atCenter.textContent?.trim().slice(0, 100), className: atCenter.className } : null,
      fixed,
      bodyBg: getComputedStyle(document.body).backgroundColor,
    };
  }));
  if (i % 3 === 0) await page.screenshot({ path: `${output}/scroll-${String(i).padStart(2, "0")}.png` });
}

await page.evaluate(() => window.scrollTo(0, 0));
await page.screenshot({ path: `${output}/full-page.png`, fullPage: true });
process.stdout.write(JSON.stringify({ initial, samples }, null, 2));
await browser.close();
