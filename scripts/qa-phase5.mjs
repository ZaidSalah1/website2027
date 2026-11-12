import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";

const browser=await chromium.launch({headless:true,executablePath:"C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"});
await mkdir("artifacts/phase5",{recursive:true});
const page=await browser.newPage({viewport:{width:1440,height:900}});const errors=[];
page.on("console",m=>{if(m.type()==="error")errors.push(m.text())});page.on("pageerror",e=>errors.push(e.message));
await page.goto("http://127.0.0.1:3001",{waitUntil:"networkidle"});await page.waitForTimeout(1000);
const geometry=await page.evaluate(()=>Object.fromEntries([".hero",".projects-stage",".ready-transition",".tech-matrix",".build-stage",".contact-conclusion"].map(selector=>[selector,document.querySelector(selector).getBoundingClientRect().top+scrollY])));

await page.evaluate(y=>scrollTo(0,y),geometry[".contact-conclusion"]-280);await page.waitForTimeout(800);await page.screenshot({path:"artifacts/phase5/desktop-transition.png"});
await page.evaluate(y=>scrollTo(0,y),geometry[".contact-conclusion"]+180);await page.waitForTimeout(900);await page.screenshot({path:"artifacts/phase5/desktop-contact.png"});
await page.evaluate(()=>scrollTo(0,document.documentElement.scrollHeight));await page.waitForTimeout(900);await page.screenshot({path:"artifacts/phase5/desktop-footer.png"});

const desktop=await page.evaluate(()=>({documentHeight:document.documentElement.scrollHeight,horizontalOverflow:document.documentElement.scrollWidth-innerWidth,pinSpacers:document.querySelectorAll(".pin-spacer").length,projectTransform:getComputedStyle(document.querySelector(".projects-track")).transform,buildTransform:getComputedStyle(document.querySelector(".build-track")).transform,contactParentPinned:document.querySelector(".contact-conclusion").parentElement?.classList.contains("pin-spacer"),portraitBox:document.querySelector(".contact-portrait").getBoundingClientRect().toJSON(),links:[...document.querySelectorAll(".contact-links a")].map(a=>({text:a.textContent.trim(),href:a.getAttribute("href")}))}));

// Revisit both horizontal chapters in reverse order to ensure their timelines remain independent.
await page.evaluate(y=>scrollTo(0,y),geometry[".build-stage"]+800);await page.waitForTimeout(700);const buildA=await page.locator(".build-track").evaluate(el=>getComputedStyle(el).transform);
await page.mouse.wheel(0,-500);await page.waitForTimeout(800);const buildB=await page.locator(".build-track").evaluate(el=>getComputedStyle(el).transform);
await page.evaluate(y=>scrollTo(0,y),geometry[".projects-stage"]+800);await page.waitForTimeout(700);const projectA=await page.locator(".projects-track").evaluate(el=>getComputedStyle(el).transform);
await page.mouse.wheel(0,-400);await page.waitForTimeout(800);const projectB=await page.locator(".projects-track").evaluate(el=>getComputedStyle(el).transform);

const mobile=await browser.newPage({viewport:{width:390,height:844}});await mobile.goto("http://127.0.0.1:3001",{waitUntil:"networkidle"});await mobile.waitForTimeout(700);
await mobile.locator(".contact-conclusion").scrollIntoViewIfNeeded();await mobile.waitForTimeout(800);await mobile.screenshot({path:"artifacts/phase5/mobile-contact.png"});
await mobile.evaluate(()=>scrollTo(0,document.documentElement.scrollHeight));await mobile.waitForTimeout(600);await mobile.screenshot({path:"artifacts/phase5/mobile-footer.png"});
const mobileResult=await mobile.evaluate(()=>({horizontalOverflow:document.documentElement.scrollWidth-innerWidth,projectTransform:getComputedStyle(document.querySelector(".projects-track")).transform,buildTransform:getComputedStyle(document.querySelector(".build-track")).transform,contactHeight:document.querySelector(".contact-conclusion").getBoundingClientRect().height}));

const reduced=await browser.newPage({viewport:{width:1440,height:900},reducedMotion:"reduce"});await reduced.goto("http://127.0.0.1:3001",{waitUntil:"networkidle"});await reduced.waitForTimeout(500);const reducedResult=await reduced.evaluate(()=>({pinSpacers:document.querySelectorAll(".pin-spacer").length,horizontalOverflow:document.documentElement.scrollWidth-innerWidth,contactClip:getComputedStyle(document.querySelector(".contact-panel")).clipPath}));
console.log(JSON.stringify({geometry,desktop,reverseChecks:{buildA,buildB,projectA,projectB},mobileResult,reducedResult,errors},null,2));await browser.close();
