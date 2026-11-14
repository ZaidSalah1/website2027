import { chromium } from "playwright";

const browser = await chromium.launch({ headless: true });
const results = [];
for (const viewport of [{ name: "desktop", width: 1440, height: 900 }, { name: "mobile", width: 390, height: 844 }]) {
  const page = await browser.newPage({ viewport });
  const failures = [];
  const errors = [];
  page.on("response", response => { if (response.status() >= 400) failures.push(`${response.status()} ${response.url()}`); });
  page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
  await page.goto("http://127.0.0.1:3002", { waitUntil: "domcontentloaded" });
  await page.locator("#site-preloader").waitFor({ state: "detached", timeout: 10_000 });
  await page.locator(".cinema-gallery-stage").scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  const checks = [];
  for (let step = 0; step < 10; step++) {
    const active = page.locator("[data-cinema-project][data-project-active='true']");
    const state = await active.evaluate(panel => {
      const image = panel.querySelector(".glitch-current");
      const media = panel.querySelector(".glitch-project-image");
      return { id: panel.className, pending: media?.classList.contains("is-pending"), decoded: image instanceof HTMLImageElement && image.complete && image.naturalWidth > 0, background: media ? getComputedStyle(media).backgroundColor : "missing" };
    });
    checks.push(state);
    await page.mouse.wheel(0, 360);
    await page.waitForTimeout(220);
  }
  await page.locator(".design-gallery-grid").scrollIntoViewIfNeeded();
  await page.waitForTimeout(700);
  const designDecoded = await page.locator(".design-gallery-image").evaluateAll(images => images.map(image => image.complete && image.naturalWidth > 0));
  results.push({ viewport: viewport.name, checks, allDecoded: checks.every(check => check.decoded && !check.pending), allTransparent: checks.every(check => check.background === "rgba(0, 0, 0, 0)"), designDecoded, failures, errors });
  await page.close();
}
await browser.close();
console.log(JSON.stringify(results, null, 2));
