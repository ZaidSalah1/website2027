import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";

const baseURL = "http://127.0.0.1:3002";
const out = "artifacts/production-audit";
await mkdir(out, { recursive: true });
const browser = await chromium.launch({ headless: true });

async function pinPosition(page, selector, progress = 0) {
  return page.evaluate(({ selector, progress }) => {
    const stage = document.querySelector(selector);
    const spacer = stage?.parentElement?.classList.contains("pin-spacer") ? stage.parentElement : stage;
    const rect = spacer?.getBoundingClientRect();
    const start = (rect?.top ?? 0) + scrollY;
    const range = Math.max(0, (spacer?.scrollHeight ?? innerHeight) - innerHeight);
    scrollTo(0, start + range * progress);
    return { start, range, y: start + range * progress };
  }, { selector, progress });
}

async function testViewport(width, height) {
  const page = await browser.newPage({ viewport: { width, height }, hasTouch: width <= 768, isMobile: width <= 430 });
  const consoleErrors = [], pageErrors = [], failedRequests = [], badResponses = [], chunks = new Set(), mediaResponses = [];
  page.on("console", message => message.type() === "error" && consoleErrors.push(message.text()));
  page.on("pageerror", error => pageErrors.push(error.message));
  page.on("requestfailed", request => failedRequests.push({ url: request.url(), error: request.failure()?.errorText }));
  page.on("response", response => {
    const url = response.url();
    if (url.includes("/_next/static/")) chunks.add(`${response.status()} ${url}`);
    if (/\.(png|jpe?g|webp|svg|mp4|woff2?|ttf)(\?|$)/i.test(url) || url.includes("/_next/image")) mediaResponses.push({ status: response.status(), url });
    if (response.status() >= 400) badResponses.push({ status: response.status(), url });
  });
  await page.goto(baseURL, { waitUntil: "networkidle" });
  await page.waitForTimeout(700);
  const hydrationText = consoleErrors.filter(text => /hydrat|server rendered|didn't match/i.test(text));

  const projectsA = await pinPosition(page, ".projects-stage", .15); await page.waitForTimeout(350);
  const projectTransformA = await page.locator(".projects-track").evaluate(el => getComputedStyle(el).transform);
  await pinPosition(page, ".projects-stage", .72); await page.waitForTimeout(500);
  const projectTransformB = await page.locator(".projects-track").evaluate(el => getComputedStyle(el).transform);
  await pinPosition(page, ".projects-stage", .02); await page.waitForTimeout(500);
  const glitch = page.locator(".project-panel").first().locator(".glitch-project-image");
  const glitchBefore = await glitch.getAttribute("data-image-index"); await page.waitForTimeout(3300); const glitchAfter = await glitch.getAttribute("data-image-index");
  const scrollBeforeModal = await page.evaluate(() => scrollY);
  await page.locator(".project-panel").first().locator(".project-explore").click(); await page.locator(".project-modal").waitFor(); await page.waitForTimeout(400);
  const modalTitle = await page.locator("#project-modal-title").innerText(); await page.keyboard.press("Escape"); await page.locator(".project-modal").waitFor({ state: "detached" });
  const scrollAfterModal = await page.evaluate(() => scrollY);

  await pinPosition(page, ".cinema-gallery-stage", .72); await page.waitForTimeout(600);
  const cinema = await page.evaluate(() => ({ pinnedTop: Math.round(document.querySelector(".cinema-gallery-stage")?.getBoundingClientRect().top ?? -999), active: [...document.querySelectorAll("[data-cinema-project]")].findIndex(el => el.getAttribute("data-project-active") === "true"), clips: [...document.querySelectorAll("[data-cinema-project]")].map(el => getComputedStyle(el).clipPath) }));
  const buildA = await pinPosition(page, ".build-stage", .15); await page.waitForTimeout(1500);
  const buildTransformA = await page.locator(".build-track").evaluate(el => getComputedStyle(el).transform);
  await pinPosition(page, ".build-stage", .72); await page.waitForTimeout(1800);
  const buildTransformB = await page.locator(".build-track").evaluate(el => getComputedStyle(el).transform);

  await page.locator(".nike-stage").scrollIntoViewIfNeeded(); await page.waitForTimeout(1800);
  const video = await page.locator(".nike-video-frame video").evaluate(el => ({ readyState: el.readyState, currentTime: el.currentTime, paused: el.paused, networkState: el.networkState }));
  await page.evaluate(async () => { for (let y = 0; y < document.documentElement.scrollHeight; y += Math.max(500, innerHeight * .7)) { scrollTo(0, y); await new Promise(resolve => setTimeout(resolve, 35)); } });
  await page.waitForTimeout(1000);
  const layout = await page.evaluate(() => ({ overflow: document.documentElement.scrollWidth - innerWidth, pinSpacers: document.querySelectorAll(".pin-spacer").length, images: [...document.images].map(image => ({ src: image.currentSrc || image.src, complete: image.complete, width: image.naturalWidth })).filter(image => !image.complete || !image.width) }));
  if (width === 1440) await page.screenshot({ path: `${out}/production-desktop.png`, fullPage: false });
  if (width === 390) await page.screenshot({ path: `${out}/production-mobile.png`, fullPage: false });
  await page.close();
  return { width, height, projects: { range: projectsA.range, moved: projectTransformA !== projectTransformB, projectTransformA, projectTransformB }, behindBuild: { range: buildA.range, moved: buildTransformA !== buildTransformB, buildTransformA, buildTransformB }, cinema, glitch: { before: glitchBefore, after: glitchAfter, changed: glitchBefore !== glitchAfter }, modal: { title: modalTitle, before: scrollBeforeModal, after: scrollAfterModal, restored: Math.abs(scrollBeforeModal - scrollAfterModal) < 2 }, video, layout, network: { chunks: [...chunks].length, media: mediaResponses.length, failedRequests, badResponses }, hydrationText, consoleErrors, pageErrors };
}

const publicAssets = ["/zaid-portrait.png", "/imgs/nike.mp4", "/imgs/walletUIUX.png", "/imgs/cryptoUIUX.png", "/imgs/carUIUX.png", "/icon.svg"];
const assetChecks = [];
const request = await browser.newPage();
for (const path of publicAssets) { const response = await request.request.get(`${baseURL}${path}`); assetChecks.push({ path, status: response.status(), contentType: response.headers()["content-type"], bytes: (await response.body()).length }); }
await request.close();
const report = { assetChecks, viewports: [await testViewport(1440, 1000), await testViewport(390, 844)] };
await writeFile(`${out}/report.json`, JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
await browser.close();
