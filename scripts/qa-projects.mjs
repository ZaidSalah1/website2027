import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";

const browser = await chromium.launch({ headless: true, executablePath: "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe" });
await mkdir("artifacts/projects", { recursive: true });

const desktop = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
desktop.on("console", (msg) => { if (msg.type() === "error") errors.push(msg.text()); });
desktop.on("pageerror", (error) => errors.push(error.message));
await desktop.goto("http://127.0.0.1:3001", { waitUntil: "networkidle" });
await desktop.waitForTimeout(1200);
const trigger = await desktop.evaluate(() => {
  const gsapState = window;
  const sections = [...document.querySelectorAll(".project-panel")].map((el) => el.getBoundingClientRect().width);
  const spacer = document.querySelector(".pin-spacer");
  return {
    projectTop: document.querySelector(".projects-stage")?.getBoundingClientRect().top + scrollY,
    spacerHeight: spacer?.getBoundingClientRect().height,
    panelWidths: sections,
    trackWidth: document.querySelector(".projects-track")?.scrollWidth,
    docHeight: document.documentElement.scrollHeight,
    viewport: [innerWidth, innerHeight],
    hasGsap: Boolean(gsapState),
  };
});

const start = Number(trigger.projectTop);
const distance = Number(trigger.spacerHeight) - 900;
await desktop.evaluate((y) => scrollTo({ top: y, behavior: "instant" }), start + 20);
await desktop.waitForTimeout(500);
const transformBeforeWheel = await desktop.locator(".projects-track").evaluate((el) => getComputedStyle(el).transform);
await desktop.mouse.wheel(0, 900);
await desktop.waitForTimeout(900);
const transformAfterWheel = await desktop.locator(".projects-track").evaluate((el) => getComputedStyle(el).transform);
const points = [
  { name: "entry", y: start + 20 },
  { name: "middle", y: start + distance * .5 },
  { name: "final", y: start + distance - 20 },
  { name: "outro", y: start + distance + 700 },
];
for (const point of points) {
  await desktop.evaluate((y) => scrollTo({ top: y, behavior: "instant" }), point.y);
  await desktop.waitForTimeout(1100);
  await desktop.screenshot({ path: `artifacts/projects/desktop-${point.name}.png` });
}
const desktopResult = await desktop.evaluate(() => ({
  horizontalOverflow: document.documentElement.scrollWidth - innerWidth,
  pinned: getComputedStyle(document.querySelector(".projects-stage")).position,
  currentTransform: getComputedStyle(document.querySelector(".projects-track")).transform,
  progress: getComputedStyle(document.querySelector(".projects-section")).getPropertyValue("--projects-progress"),
}));

const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
await mobile.goto("http://127.0.0.1:3001", { waitUntil: "networkidle" });
await mobile.waitForTimeout(700);
const mobileTop = await mobile.locator(".projects-prelude").evaluate((el) => el.getBoundingClientRect().top + scrollY);
await mobile.evaluate((y) => scrollTo({ top: y, behavior: "instant" }), mobileTop);
await mobile.waitForTimeout(500);
await mobile.screenshot({ path: "artifacts/projects/mobile-intro.png", fullPage: false });
await mobile.locator(".project-panel").nth(0).scrollIntoViewIfNeeded();
await mobile.waitForTimeout(500);
await mobile.screenshot({ path: "artifacts/projects/mobile-project.png", fullPage: false });
const mobileResult = await mobile.evaluate(() => ({
  horizontalOverflow: document.documentElement.scrollWidth - innerWidth,
  pinSpacerCount: document.querySelectorAll(".pin-spacer").length,
  trackTransform: getComputedStyle(document.querySelector(".projects-track")).transform,
  panels: [...document.querySelectorAll(".project-panel")].map((el) => ({ width: el.getBoundingClientRect().width, height: el.getBoundingClientRect().height })),
}));

console.log(JSON.stringify({ trigger, distance, wheelTest: { transformBeforeWheel, transformAfterWheel, moved: transformBeforeWheel !== transformAfterWheel }, desktopResult, mobileResult, errors }, null, 2));
await browser.close();
