import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";

const out = "artifacts/phase9";
await mkdir(out, { recursive: true });
const browser = await chromium.launch({ headless: true });
const results = [];

async function pinPosition(page, selector, progress = 0) {
  return page.evaluate(({ selector, progress }) => {
    const stage = document.querySelector(selector);
    const spacer = stage?.parentElement?.classList.contains("pin-spacer") ? stage.parentElement : stage;
    const rect = spacer?.getBoundingClientRect();
    const start = (rect?.top ?? 0) + scrollY;
    const range = Math.max(0, (spacer?.scrollHeight ?? innerHeight) - innerHeight);
    scrollTo(0, start + range * progress);
    return { start, range, target: start + range * progress };
  }, { selector, progress });
}

async function run(width, height, reducedMotion = "no-preference") {
  const page = await browser.newPage({ viewport: { width, height }, reducedMotion, hasTouch: width <= 768 });
  const errors = [];
  page.on("console", (message) => message.type() === "error" && errors.push(message.text()));
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("http://127.0.0.1:3002", { waitUntil: "networkidle" });
  await page.waitForTimeout(700);

  const sehaPin = await pinPosition(page, ".projects-stage", .02);
  await page.waitForTimeout(900);
  const sehaTrigger = page.locator(".project-panel").nth(0).locator(".project-explore");
  const before = await page.evaluate(() => scrollY);
  await sehaTrigger.click();
  await page.locator(".project-modal").waitFor({ state: "visible" });
  await page.waitForTimeout(reducedMotion === "reduce" ? 50 : 500);
  const opened = await page.evaluate(() => ({ bodyPosition: document.body.style.position, title: document.querySelector("#project-modal-title")?.textContent, active: document.activeElement?.getAttribute("aria-label") }));
  await page.getByRole("tab", { name: "SCREENS" }).focus();
  await page.keyboard.press("ArrowRight");
  const keyboardTab = await page.getByRole("tab", { name: "OVERVIEW" }).getAttribute("aria-selected");
  await page.keyboard.press("ArrowLeft");
  await page.locator(".project-modal-close").focus();
  await page.keyboard.press("Shift+Tab");
  const focusTrapped = await page.evaluate(() => Boolean(document.activeElement?.closest(".project-modal")));
  if (width === 1440) await page.screenshot({ path: `${out}/desktop-screens.png` });
  if (width === 390) await page.screenshot({ path: `${out}/mobile-screens.png` });

  await page.getByRole("tab", { name: "OVERVIEW" }).click();
  if (width === 1440) await page.screenshot({ path: `${out}/desktop-overview.png` });
  await page.getByRole("tab", { name: "ENGINEERING" }).click();
  if (width === 1440) await page.screenshot({ path: `${out}/desktop-engineering.png` });
  await page.getByRole("tab", { name: "SCREENS" }).click();
  await page.locator(".screen-slide").click();
  await page.locator(".project-image-viewer").waitFor({ state: "visible" });
  await page.waitForTimeout(reducedMotion === "reduce" ? 50 : 350);
  if (width === 1440) await page.screenshot({ path: `${out}/desktop-viewer.png` });
  await page.keyboard.press("Escape");
  await page.locator(".project-image-viewer").waitFor({ state: "detached" });
  await page.keyboard.press("Escape");
  await page.locator(".project-modal").waitFor({ state: "detached" });
  await page.waitForTimeout(100);
  const after = await page.evaluate(() => ({ y: scrollY, bodyPosition: document.body.style.position, focused: document.activeElement?.className ?? "", overflow: [innerWidth, document.documentElement.scrollWidth] }));

  await pinPosition(page, ".projects-stage", .5);
  await page.waitForTimeout(900);
  await page.locator(".project-panel").nth(1).locator(".project-explore").click();
  const drevrTitle = await page.locator("#project-modal-title").textContent();
  await page.locator(".project-modal-close").click();
  await page.locator(".project-modal").waitFor({ state: "detached" });

  const cinemaPin = await pinPosition(page, ".cinema-gallery-stage", 0);
  await page.waitForTimeout(900);
  await page.locator(".cinema-project").nth(0).locator(".cinema-project-explore").click();
  const cinemaTitle = await page.locator("#project-modal-title").textContent();
  await page.locator(".project-modal-close").click();
  await page.locator(".project-modal").waitFor({ state: "detached" });
  await page.evaluate(({ target }) => scrollTo(0, target + 260), cinemaPin);
  await page.waitForTimeout(300);
  await page.evaluate(({ target }) => scrollTo(0, target + 40), cinemaPin);
  await page.waitForTimeout(500);
  const reverse = await page.evaluate(() => ({ top: Math.round(document.querySelector(".cinema-gallery-stage")?.getBoundingClientRect().top ?? -1), clip: getComputedStyle(document.querySelectorAll(".cinema-project")[1]).clipPath }));

  results.push({ width, height, reducedMotion, sehaPin, before, opened, keyboardTab, focusTrapped, after, drevrTitle, cinemaTitle, reverse, errors });
  await page.close();
}

const requestedWidth = Number(process.env.VERIFY_WIDTH || 0);
const requestedReduced = process.env.VERIFY_REDUCED === "1";
for (const [width, height] of [[375, 812], [390, 844], [768, 1024], [1024, 768], [1440, 1000]].filter(([width]) => !requestedWidth || width === requestedWidth)) {
  console.log(`VERIFYING ${width}x${height}`);
  try { await run(width, height, requestedReduced ? "reduce" : "no-preference"); }
  catch (error) { console.error(`FAILED ${width}`, error); results.push({ width, height, failure: String(error) }); }
}
console.log(JSON.stringify(results, null, 2));
await browser.close();
