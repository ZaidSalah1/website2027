import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";

const baseURL = "http://127.0.0.1:3002";
const output = "artifacts/phase8-final";
await mkdir(output, { recursive: true });

const browser = await chromium.launch({ headless: true });
const results = [];

async function inspect(width, height) {
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1, reducedMotion: process.env.VERIFY_REDUCED ? "reduce" : "no-preference" });
  const errors = [];
  page.on("console", (message) => message.type() === "error" && errors.push(message.text()));
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(baseURL, { waitUntil: "networkidle" });
  await page.waitForTimeout(700);

  const baseline = await page.evaluate(() => ({
    width: innerWidth,
    scrollWidth: document.documentElement.scrollWidth,
    systemsInFocus: document.body.innerText.includes("SYSTEMS IN FOCUS"),
    projectCount: document.querySelectorAll(".cinema-project").length,
    designCount: document.querySelectorAll(".design-gallery-item").length,
    videoControls: document.querySelector(".nike-video-frame button") !== null,
  }));

  const stage = page.locator(".cinema-gallery-stage");
  await stage.scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  const pin = await page.evaluate(() => {
    const element = document.querySelector(".cinema-gallery-stage");
    const spacer = element?.parentElement?.classList.contains("pin-spacer") ? element.parentElement : element;
    const rect = spacer?.getBoundingClientRect();
    return { start: (rect?.top ?? 0) + scrollY, range: Math.max(0, (spacer?.scrollHeight ?? innerHeight) - innerHeight) };
  });

  const frames = [];
  for (const progress of [0, 0.25, 0.5, 0.75, 1, 0.5]) {
    await page.evaluate(({ start, range, progress }) => scrollTo(0, start + range * progress), { ...pin, progress });
    await page.waitForTimeout(700);
    frames.push(await page.evaluate((progress) => {
      const visible = [...document.querySelectorAll(".cinema-project")].map((node) => {
        const style = getComputedStyle(node);
        return { title: node.querySelector("h3")?.textContent?.trim(), clipPath: style.clipPath, visibility: style.visibility };
      });
      const stageRect = document.querySelector(".cinema-gallery-stage")?.getBoundingClientRect();
      return { progress, scrollY, stageTop: Math.round(stageRect?.top ?? -1), visible };
    }, progress));
    if (width === 1440 && [0, 0.5, 1].includes(progress) && frames.filter((frame) => frame.progress === progress).length === 1) {
      await page.screenshot({ path: `${output}/software-${progress === 0 ? "restaurant" : progress === 0.5 ? "commerce" : "rental"}-1440.png` });
    }
  }

  const geometry = await page.evaluate(() => [...document.querySelectorAll(".cinema-project")].map((panel) => {
    const copy = panel.querySelector(".cinema-project-copy")?.getBoundingClientRect();
    const media = panel.querySelector(".cinema-project-media")?.getBoundingClientRect();
    return { copy: copy && [copy.x, copy.y, copy.width, copy.height].map(Math.round), media: media && [media.x, media.y, media.width, media.height].map(Math.round) };
  }));

  const nike = page.locator(".nike-stage");
  await nike.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1200);
  const video = await page.evaluate(() => {
    const node = document.querySelector(".nike-video-frame video");
    return node ? { paused: node.paused, muted: node.muted, loop: node.loop, readyState: node.readyState, currentTime: node.currentTime, natural: [node.videoWidth, node.videoHeight] } : null;
  });
  if (width === 1440 || width === 390) await page.screenshot({ path: `${output}/nike-${width}.png` });

  const designs = page.locator(".design-gallery-grid");
  await designs.scrollIntoViewIfNeeded();
  await page.waitForTimeout(700);
  const videoOffscreenPaused = await page.evaluate(() => document.querySelector(".nike-video-frame video")?.paused ?? null);
  if (width === 1440 || width === 390) await page.screenshot({ path: `${output}/ui-gallery-${width}.png`, fullPage: false });

  if (width === 390) {
    await page.evaluate(() => document.querySelector(".cinema-gallery-stage")?.scrollIntoView());
    await page.waitForTimeout(500);
    await page.screenshot({ path: `${output}/software-mobile-390.png` });
  }

  results.push({ width, height, baseline, pin, frames, geometry, video, videoOffscreenPaused, errors });
  await page.close();
}

const allViewports = [[375, 812], [390, 844], [430, 932], [768, 1024], [1024, 768], [1440, 1000]];
const requestedWidth = Number(process.env.VERIFY_WIDTH || 0);
for (const [width, height] of allViewports.filter(([width]) => !requestedWidth || width === requestedWidth)) {
  console.log(`VERIFYING ${width}x${height}`);
  try {
    await inspect(width, height);
  } catch (error) {
    console.error(`FAILED ${width}x${height}`, error);
    results.push({ width, height, failure: String(error) });
  }
}

if (process.env.VERIFY_SUMMARY) {
  console.log(JSON.stringify(results.map((result) => ({
    width: result.width,
    baseline: result.baseline,
    pin: result.pin,
    reverseFrame: result.frames?.at(-1),
    video: result.video,
    videoOffscreenPaused: result.videoOffscreenPaused,
    errors: result.errors,
    failure: result.failure,
  })), null, 2));
} else {
  console.log(JSON.stringify(results, null, 2));
}
await browser.close();
