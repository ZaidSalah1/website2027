import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";

const out = "artifacts/phase10";
await mkdir(out, { recursive: true });
const browser = await chromium.launch({ headless: true });

async function cinemaPosition(page, progress) {
  return page.evaluate((progress) => {
    const stage = document.querySelector(".cinema-gallery-stage");
    const spacer = stage?.parentElement?.classList.contains("pin-spacer") ? stage.parentElement : stage;
    const rect = spacer?.getBoundingClientRect();
    const start = (rect?.top ?? 0) + scrollY;
    const range = Math.max(0, (spacer?.scrollHeight ?? innerHeight) - innerHeight);
    scrollTo(0, start + range * progress);
    return { start, range, target: start + range * progress };
  }, progress);
}

async function runDesktop() {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const errors = [];
  page.on("console", (message) => message.type() === "error" && errors.push(message.text()));
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("http://127.0.0.1:3002", { waitUntil: "networkidle" });
  await cinemaPosition(page, 0);
  await page.waitForTimeout(1600);
  const restaurant = page.locator(".cinema-project").nth(0).locator(".glitch-project-image");
  const boundsBefore = await restaurant.boundingBox();
  await page.screenshot({ path: `${out}/glitch-01-stable-before.png` });

  let glitchSeen = false;
  const deadline = Date.now() + 6000;
  while (Date.now() < deadline && !glitchSeen) {
    glitchSeen = await restaurant.evaluate((node) => [...node.querySelectorAll(".glitch-slice")].some((slice) => Number(getComputedStyle(slice).opacity) > .05));
    if (!glitchSeen) await page.waitForTimeout(16);
  }
  if (glitchSeen) await page.screenshot({ path: `${out}/glitch-02-transition.png` });
  await page.waitForFunction(() => document.querySelector(".cinema-project .glitch-project-image")?.getAttribute("data-image-index") === "1", undefined, { timeout: 3000 });
  await page.waitForTimeout(350);
  const boundsAfter = await restaurant.boundingBox();
  await page.screenshot({ path: `${out}/glitch-03-stable-after.png` });
  const stableIndex = await restaurant.getAttribute("data-image-index");
  await page.locator(".cinema-project").nth(0).locator(".cinema-project-explore").click();
  await page.locator(".project-modal").waitFor({ state: "visible" });
  await page.waitForTimeout(5200);
  const modalPauseIndex = await restaurant.getAttribute("data-image-index");
  await page.keyboard.press("Escape");
  await page.locator(".project-modal").waitFor({ state: "detached" });

  await cinemaPosition(page, 1);
  await page.waitForTimeout(1600);
  await page.waitForTimeout(5200);
  const inactiveIndex = await restaurant.getAttribute("data-image-index");
  const athkarPanel = page.locator(".cinema-project").nth(3);
  const athkar = await athkarPanel.evaluate((panel) => ({ title: panel.querySelector("h3")?.textContent, active: panel.getAttribute("data-project-active"), transition: panel.querySelector(".glitch-project-image")?.getAttribute("data-transition"), image: panel.querySelector("img")?.getAttribute("src") }));
  await page.screenshot({ path: `${out}/athkar-gallery-1440.png` });
  await athkarPanel.locator(".cinema-project-explore").click();
  await page.locator(".project-modal").waitFor({ state: "visible" });
  await page.waitForTimeout(450);
  const athkarModalTitle = await page.locator("#project-modal-title").textContent();
  await page.screenshot({ path: `${out}/athkar-modal-1440.png` });
  await page.keyboard.press("Escape");
  await page.locator(".project-modal").waitFor({ state: "detached" });

  await cinemaPosition(page, 0);
  await page.waitForTimeout(1600);
  const resumeStart = await restaurant.getAttribute("data-image-index");
  await page.waitForTimeout(5200);
  const resumeEnd = await restaurant.getAttribute("data-image-index");
  const overflow = await page.evaluate(() => ({ viewport: innerWidth, document: document.documentElement.scrollWidth }));
  await page.close();
  return { glitchSeen, stableIndex, modalPauseIndex, inactiveIndex, boundsBefore, boundsAfter, sameBounds: JSON.stringify(boundsBefore) === JSON.stringify(boundsAfter), athkar, athkarModalTitle, resumeStart, resumeEnd, overflow, errors };
}

async function runMobile(width, height) {
  const page = await browser.newPage({ viewport: { width, height }, hasTouch: true });
  const errors = [];
  page.on("console", (message) => message.type() === "error" && errors.push(message.text()));
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("http://127.0.0.1:3002", { waitUntil: "networkidle" });
  await cinemaPosition(page, 1);
  await page.waitForTimeout(1600);
  if (width === 390) await page.screenshot({ path: `${out}/athkar-gallery-390.png` });
  const result = await page.evaluate(() => ({ overflow: [innerWidth, document.documentElement.scrollWidth], athkarTitle: document.querySelectorAll(".cinema-project h3")[3]?.textContent, active: document.querySelectorAll(".cinema-project")[3]?.getAttribute("data-project-active") }));
  result.errors = errors;
  await page.close();
  return result;
}

async function runReducedMotion() {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce" });
  await page.goto("http://127.0.0.1:3002", { waitUntil: "networkidle" });
  await cinemaPosition(page, 0);
  await page.waitForTimeout(5500);
  const result = await page.locator(".cinema-project").nth(0).locator(".glitch-project-image").evaluate((node) => ({ index: node.getAttribute("data-image-index"), transition: node.getAttribute("data-transition"), slices: [...node.querySelectorAll(".glitch-slice")].map((slice) => getComputedStyle(slice).opacity) }));
  await page.close();
  return result;
}

const mode = process.env.VERIFY_MODE || "desktop";
const result = mode === "desktop" ? { desktop: await runDesktop() }
  : mode === "reduced" ? { reducedMotion: await runReducedMotion() }
  : mode === "375" ? { mobile375: await runMobile(375, 812) }
  : mode === "390" ? { mobile390: await runMobile(390, 844) }
  : mode === "768" ? { tablet768: await runMobile(768, 1024) }
  : { tablet1024: await runMobile(1024, 768) };
console.log(JSON.stringify(result, null, 2));
await browser.close();
