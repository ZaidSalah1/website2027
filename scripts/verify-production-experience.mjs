import { chromium } from "playwright";

const browser = await chromium.launch({ headless: true });
const results = [];

for (const viewport of [{ name: "desktop", width: 1440, height: 900, mobile: false }, { name: "mobile", width: 390, height: 844, mobile: true }]) {
  const context = await browser.newContext({ viewport, hasTouch: viewport.mobile, isMobile: viewport.mobile, serviceWorkers: "block" });
  const page = await context.newPage();
  const failures = [];
  const errors = [];
  page.on("requestfailed", request => { if (!request.url().endsWith("nike.mp4")) failures.push(request.url()); });
  page.on("response", response => { if (response.status() >= 400) failures.push(`${response.status()} ${response.url()}`); });
  page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
  const started = Date.now();
  await page.goto("http://127.0.0.1:3002", { waitUntil: "domcontentloaded" });
  await page.locator("#site-preloader").waitFor({ state: "visible" });
  await page.locator("#site-preloader").waitFor({ state: "detached", timeout: 10_000 });
  const preloaderMs = Date.now() - started;
  const heroReady = await page.locator("[data-critical-asset='hero-portrait']").evaluate(image => image.complete && image.naturalWidth > 0);
  const fontsReady = await page.evaluate(() => document.fonts.status);
  const initiallyLoadedProjectImages = await page.locator("img.glitch-current").evaluateAll(images => images.filter(image => image.complete && image.naturalWidth > 0).length);

  const transparency = await page.locator("#cinema-gallery .glitch-project-image").first().evaluate(element => ({
    container: getComputedStyle(element).backgroundColor,
    placeholder: getComputedStyle(element.querySelector(".glitch-placeholder")).backgroundColor,
  }));

  const scrollTest = async (selector) => {
    await page.locator(selector).scrollIntoViewIfNeeded();
    await page.waitForTimeout(350);
    const trackSelector = selector.includes("projects") ? ".projects-track" : ".build-track";
    const samples = [];
    for (let index = 0; index < 6; index++) {
      if (viewport.mobile) {
        const client = await context.newCDPSession(page);
        await client.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: 190, y: 650, radiusX: 5, radiusY: 5, force: 1 }] });
        for (let step = 1; step <= 7; step++) {
          await client.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: 190, y: 650 - step * 68, radiusX: 5, radiusY: 5, force: 1 }] });
          await page.waitForTimeout(16);
        }
        await client.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
        await client.detach();
      } else {
        await page.mouse.wheel(0, 420);
      }
      await page.waitForTimeout(180);
      samples.push(await page.locator(trackSelector).evaluate(track => ({ scrollY, transform: getComputedStyle(track).transform })));
    }
    const xValues = samples.map(sample => {
      const match = sample.transform.match(/matrix(?:3d)?\((.+)\)/);
      if (!match) return 0;
      const values = match[1].split(",").map(Number);
      return values.length === 16 ? values[12] : values[4];
    });
    return { samples, xValues, movedHorizontally: Math.min(...xValues) < -20, verticalAdvanced: samples.at(-1).scrollY > samples[0].scrollY, monotonic: xValues.every((value, index) => index === 0 || value <= xValues[index - 1] + 2) };
  };

  const projects = await scrollTest(".projects-stage");
  const process = await scrollTest(".build-stage");
  results.push({ viewport: viewport.name, preloaderMs, heroReady, fontsReady, initiallyLoadedProjectImages, transparency, projects, process, failures, errors, horizontalOverflow: await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth) });
  await context.close();
}

await browser.close();
console.log(JSON.stringify(results, null, 2));
