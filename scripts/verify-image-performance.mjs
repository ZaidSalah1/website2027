import { chromium } from "playwright";

const profiles = [
  { name: "Normal", latency: 0, down: -1, up: -1 },
  { name: "Slow 4G", latency: 80, down: 4_000_000 / 8, up: 3_000_000 / 8 },
  { name: "Fast 3G", latency: 150, down: 1_600_000 / 8, up: 750_000 / 8 },
];
const browser = await chromium.launch({ headless: true });
const results = [];

for (const profile of profiles) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, serviceWorkers: "block" });
  const page = await context.newPage();
  const client = await context.newCDPSession(page);
  await client.send("Network.enable");
  if (profile.down > 0) await client.send("Network.emulateNetworkConditions", { offline: false, latency: profile.latency, downloadThroughput: profile.down, uploadThroughput: profile.up });
  const failures = [];
  page.on("requestfailed", request => failures.push(`${request.url()} :: ${request.failure()?.errorText}`));
  page.on("response", response => { if (response.status() >= 400) failures.push(`${response.status()} ${response.url()}`); });
  const started = performance.now();
  await page.goto("http://127.0.0.1:3002", { waitUntil: "domcontentloaded", timeout: 60_000 });
  await page.locator("#projects").scrollIntoViewIfNeeded();
  await page.locator("#hero-end .glitch-current.is-ready").first().waitFor({ state: "visible", timeout: 60_000 });
  const readyMs = Math.round(performance.now() - started);
  const initialLoaded = await page.locator("img.glitch-current").evaluateAll(images => images.filter(image => image.complete && image.naturalWidth > 0).length);
  let blankSamples = 0;
  for (let sample = 0; sample < 160; sample++) {
    const visible = await page.locator("#hero-end .glitch-project-image").first().evaluate(root => {
      const layers = [...root.querySelectorAll("img")];
      return layers.some(image => image.complete && image.naturalWidth > 0 && Number.parseFloat(getComputedStyle(image).opacity) > .35);
    });
    if (!visible) blankSamples++;
    await page.waitForTimeout(25);
  }
  const projectLoaded = await page.locator("img.glitch-current").evaluateAll(images => images.filter(image => image.complete && image.naturalWidth > 0).length);
  results.push({ profile: profile.name, firstProjectReadyMs: readyMs, blankSamples, sampleCount: 160, optimizedImagesLoadedAtProjects: initialLoaded, optimizedImagesLoadedAfterGlitchWindow: projectLoaded, failures });
  await context.close();
}

await browser.close();
console.log(JSON.stringify(results, null, 2));
