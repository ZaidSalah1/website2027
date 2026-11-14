import { chromium } from "playwright";

const browser = await chromium.launch({ headless: true });
const results = [];
for (const viewport of [{ name: "desktop", width: 1440, height: 900 }, { name: "mobile", width: 320, height: 700 }]) {
  const page = await browser.newPage({ viewport });
  const errors = [];
  page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
  await page.goto("http://127.0.0.1:3002", { waitUntil: "networkidle" });
  const dock = page.locator(".global-dock");
  const links = dock.locator("a");
  const before = await dock.boundingBox();
  const labelsVisible = await dock.locator(".dock-label").evaluateAll(labels => labels.every(label => {
    const style = getComputedStyle(label);
    return style.display !== "none" && label.getBoundingClientRect().width > 0;
  }));
  await page.screenshot({ path: `dock-${viewport.name}.png` });
  await links.nth(2).click();
  await page.waitForTimeout(500);
  const after = await dock.boundingBox();
  const active = await dock.locator("a.active .dock-label").textContent();
  const horizontalOverflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  results.push({ viewport, itemCount: await links.count(), labelsVisible, active, fixedPositionDelta: Math.round(Math.abs((before?.y ?? 0) - (after?.y ?? 0))), horizontalOverflow, errors });
  await page.close();
}
await browser.close();
console.log(JSON.stringify(results, null, 2));
