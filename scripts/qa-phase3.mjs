import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";

const browser = await chromium.launch({ headless: true, executablePath: "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe" });
await mkdir("artifacts/phase3", { recursive: true });

async function transformX(page) {
  return page.locator(".projects-track").evaluate((el) => new DOMMatrixReadOnly(getComputedStyle(el).transform).m41);
}

const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on("console", (msg) => { if (msg.type() === "error") errors.push(msg.text()); });
page.on("pageerror", (error) => errors.push(error.message));
await page.goto("http://127.0.0.1:3001", { waitUntil: "networkidle" });
await page.waitForTimeout(1000);

const geometry = await page.evaluate(() => {
  const stage = document.querySelector(".projects-stage");
  const spacer = stage?.parentElement?.classList.contains("pin-spacer") ? stage.parentElement : null;
  return {
    stageTop: stage.getBoundingClientRect().top + scrollY,
    spacerHeight: spacer?.getBoundingClientRect().height ?? 0,
    stageHeight: stage.getBoundingClientRect().height,
    readyTop: document.querySelector(".ready-transition").getBoundingClientRect().top + scrollY,
    techTop: document.querySelector(".tech-matrix").getBoundingClientRect().top + scrollY,
    documentHeight: document.documentElement.scrollHeight,
  };
});
const pinDistance = geometry.spacerHeight - geometry.stageHeight;

await page.evaluate((y) => scrollTo({ top: y, behavior: "instant" }), geometry.stageTop - 100);
await page.waitForTimeout(400);
const beforePin = await transformX(page);
for (let i = 0; i < 10; i++) { await page.mouse.wheel(0, 18); await page.waitForTimeout(35); }
await page.waitForTimeout(700);
const settledEntry = await transformX(page);
await page.screenshot({ path: "artifacts/phase3/projects-entry.png" });

await page.mouse.wheel(0, 1350);
await page.waitForTimeout(1000);
const forwardMid = await transformX(page);
await page.mouse.wheel(0, -520);
await page.waitForTimeout(1000);
const reverseMid = await transformX(page);
await page.mouse.wheel(0, 2600);
await page.waitForTimeout(1200);
const nearExit = await transformX(page);
await page.screenshot({ path: "artifacts/phase3/projects-exit.png" });

await page.evaluate((y) => scrollTo({ top: y, behavior: "instant" }), geometry.readyTop + 360);
await page.waitForTimeout(900);
await page.screenshot({ path: "artifacts/phase3/ready.png" });
await page.evaluate((y) => scrollTo({ top: y, behavior: "instant" }), geometry.techTop + 160);
await page.waitForTimeout(1000);
await page.screenshot({ path: "artifacts/phase3/tech-matrix.png" });

const desktop = await page.evaluate(() => ({
  scrollWidth: document.documentElement.scrollWidth,
  innerWidth,
  horizontalOverflow: document.documentElement.scrollWidth - innerWidth,
  pinSpacers: document.querySelectorAll(".pin-spacer").length,
  skillCount: document.querySelectorAll(".skill-card").length,
  readyHeight: document.querySelector(".ready-transition").getBoundingClientRect().height,
}));

const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
await mobile.goto("http://127.0.0.1:3001", { waitUntil: "networkidle" });
await mobile.waitForTimeout(700);
await mobile.locator(".ready-stage").scrollIntoViewIfNeeded();
await mobile.waitForTimeout(400);
await mobile.screenshot({ path: "artifacts/phase3/mobile-ready.png" });
await mobile.locator(".tech-matrix").scrollIntoViewIfNeeded();
await mobile.waitForTimeout(700);
await mobile.screenshot({ path: "artifacts/phase3/mobile-tech.png" });
const mobileResult = await mobile.evaluate(() => ({
  horizontalOverflow: document.documentElement.scrollWidth - innerWidth,
  pinSpacers: document.querySelectorAll(".pin-spacer").length,
  projectTrack: getComputedStyle(document.querySelector(".projects-track")).transform,
  skillColumns: getComputedStyle(document.querySelector(".tech-grid")).gridTemplateColumns,
}));

const reduced = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
await reduced.goto("http://127.0.0.1:3001", { waitUntil: "networkidle" });
await reduced.waitForTimeout(500);
const reducedResult = await reduced.evaluate(() => ({
  pinSpacers: document.querySelectorAll(".pin-spacer").length,
  projectTrack: getComputedStyle(document.querySelector(".projects-track")).transform,
  readyPosition: getComputedStyle(document.querySelector(".ready-stage")).position,
  horizontalOverflow: document.documentElement.scrollWidth - innerWidth,
}));

console.log(JSON.stringify({ geometry, pinDistance, motion: { beforePin, settledEntry, forwardMid, reverseMid, nearExit, reversesNaturally: reverseMid > forwardMid }, desktop, mobileResult, reducedResult, errors }, null, 2));
await browser.close();
