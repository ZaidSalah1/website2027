import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";

const browser = await chromium.launch({ headless: true, executablePath: "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe" });
await mkdir("artifacts/idea-blueprint", { recursive: true });
const errors = [];
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
page.on("console", message => message.type() === "error" && errors.push(message.text()));
page.on("pageerror", error => errors.push(error.message));
await page.goto("http://127.0.0.1:3001", { waitUntil: "networkidle" });
await page.waitForTimeout(700);
const geometry = await page.evaluate(() => {
  const stage = document.querySelector(".build-stage");
  const spacer = stage.parentElement?.classList.contains("pin-spacer") ? stage.parentElement : null;
  return { top: stage.getBoundingClientRect().top + scrollY, height: stage.getBoundingClientRect().height, spacer: spacer?.getBoundingClientRect().height ?? 0 };
});
const distance = geometry.spacer - geometry.height;
await page.evaluate(y => scrollTo({ top: y, behavior: "instant" }), geometry.top + distance * .045);
await page.waitForTimeout(1000);
await page.screenshot({ path: "artifacts/idea-blueprint/desktop-full.png" });
await page.locator(".idea-scene").screenshot({ path: "artifacts/idea-blueprint/desktop-closeup.png" });
await page.locator(".sheet-b").screenshot({ path: "artifacts/idea-blueprint/connect-closeup.png" });
await page.locator(".sheet-c").screenshot({ path: "artifacts/idea-blueprint/resolve-closeup.png" });
const before = await page.locator(".build-track").evaluate(el => new DOMMatrixReadOnly(getComputedStyle(el).transform).m41);
await page.mouse.wheel(0, 850); await page.waitForTimeout(700);
const forward = await page.locator(".build-track").evaluate(el => new DOMMatrixReadOnly(getComputedStyle(el).transform).m41);
await page.mouse.wheel(0, -850); await page.waitForTimeout(700);
const reverse = await page.locator(".build-track").evaluate(el => new DOMMatrixReadOnly(getComputedStyle(el).transform).m41);
const desktop = await page.evaluate(() => ({
  overflow: document.documentElement.scrollWidth - innerWidth,
  cards: [...document.querySelectorAll(".idea-sheet")].map(el => { const r=el.getBoundingClientRect(); return {w:Math.round(r.width),h:Math.round(r.height),left:Math.round(r.left),top:Math.round(r.top)} }),
  notes: [...document.querySelectorAll(".sticky-note p")].map(el => ({ text:el.textContent, size:getComputedStyle(el).fontSize, visible:el.getBoundingClientRect().width>0 })),
  paths: [...document.querySelectorAll(".connector-live")].map(el => getComputedStyle(el).strokeDashoffset),
  pinSpacers: document.querySelectorAll(".pin-spacer").length
}));

const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
await mobile.goto("http://127.0.0.1:3001", { waitUntil: "networkidle" }); await mobile.waitForTimeout(500);
await mobile.locator(".build-chapter--idea").scrollIntoViewIfNeeded(); await mobile.waitForTimeout(500);
await mobile.screenshot({ path: "artifacts/idea-blueprint/mobile.png" });
const mobileResult = await mobile.evaluate(() => ({
  overflow: document.documentElement.scrollWidth - innerWidth,
  pinned: document.querySelector(".build-stage")?.parentElement?.classList.contains("pin-spacer"),
  snap: getComputedStyle(document.querySelector(".build-track")).scrollSnapType,
  scene: (()=>{const r=document.querySelector(".idea-scene").getBoundingClientRect();return {w:Math.round(r.width),h:Math.round(r.height)}})(),
  clipped: [...document.querySelectorAll(".idea-sheet")].some(el => {const r=el.getBoundingClientRect(),s=document.querySelector(".idea-scene").getBoundingClientRect();return r.left<s.left-1||r.right>s.right+1||r.top<s.top-1||r.bottom>s.bottom+1})
}));

const reduced = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
await reduced.goto("http://127.0.0.1:3001", { waitUntil: "networkidle" }); await reduced.waitForTimeout(400);
const reducedResult = await reduced.evaluate(() => ({ visible:[...document.querySelectorAll(".idea-sheet")].every(el=>getComputedStyle(el).opacity==="1"), pinSpacers:document.querySelectorAll(".pin-spacer").length }));
console.log(JSON.stringify({ motion:{before,forward,reverse,forwardWorks:forward<before,reverseWorks:reverse>forward},desktop,mobileResult,reducedResult,errors }, null, 2));
await browser.close();
