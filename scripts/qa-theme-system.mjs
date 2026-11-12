import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";

const browser=await chromium.launch({headless:true,executablePath:"C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"});
await mkdir("artifacts/theme-system",{recursive:true});
const errors=[];
const page=await browser.newPage({viewport:{width:1440,height:900}});
page.on("console",m=>m.type()==="error"&&errors.push(m.text()));page.on("pageerror",e=>errors.push(e.message));
await page.goto("http://127.0.0.1:3001",{waitUntil:"networkidle"});await page.waitForTimeout(1500);
await page.screenshot({path:"artifacts/theme-system/obsidian-hero-desktop.png"});

const shotElement=async(selector,path)=>{await page.locator(selector).scrollIntoViewIfNeeded();await page.waitForTimeout(700);await page.locator(selector).screenshot({path});};
await shotElement(".ready-stage","artifacts/theme-system/obsidian-ready-desktop.png");
const buildGeometry=await page.evaluate(()=>{const stage=document.querySelector(".build-stage"),spacer=stage.parentElement?.classList.contains("pin-spacer")?stage.parentElement:null;return{top:stage.getBoundingClientRect().top+scrollY,height:stage.getBoundingClientRect().height,spacer:spacer?.getBoundingClientRect().height??0}});
await page.evaluate(({top,height,spacer})=>scrollTo({top:top+(spacer-height)*.045,behavior:"instant"}),buildGeometry);await page.waitForTimeout(900);
await page.locator(".build-stage").screenshot({path:"artifacts/theme-system/obsidian-behind-build-desktop.png"});
await shotElement(".contact-panel","artifacts/theme-system/obsidian-contact-desktop.png");

const obsidian=await page.evaluate(()=>{const root=getComputedStyle(document.documentElement);const lime="200, 255, 39";const properties=["color","backgroundColor","borderTopColor","borderRightColor","borderBottomColor","borderLeftColor","fill","stroke","boxShadow","textShadow"];const leakage=[...document.querySelectorAll("*")].flatMap(el=>{const style=getComputedStyle(el);const hits=properties.filter(key=>String(style[key]).includes(lime));return hits.length?[`${el.tagName.toLowerCase()}.${el.className}`,...hits]:[]});return{theme:document.documentElement.dataset.theme,accent:root.getPropertyValue("--color-accent").trim(),background:root.getPropertyValue("--color-background").trim(),ready:getComputedStyle(document.querySelector(".ready-stage")).backgroundImage,contact:getComputedStyle(document.querySelector(".contact-panel")).backgroundImage,overflow:document.documentElement.scrollWidth-innerWidth,pins:document.querySelectorAll(".pin-spacer").length,limeLeakage:leakage}});

await page.evaluate(()=>{document.documentElement.dataset.theme="original-lime";scrollTo({top:0,behavior:"instant"})});await page.waitForTimeout(600);
await page.screenshot({path:"artifacts/theme-system/original-lime-restored.png"});
const original=await page.evaluate(()=>{const root=getComputedStyle(document.documentElement);return{theme:document.documentElement.dataset.theme,accent:root.getPropertyValue("--color-accent").trim(),legacyAccent:root.getPropertyValue("--lime").trim(),background:root.getPropertyValue("--color-background").trim(),hero:getComputedStyle(document.querySelector(".hero")).backgroundColor,overflow:document.documentElement.scrollWidth-innerWidth,pins:document.querySelectorAll(".pin-spacer").length}});
await page.evaluate(()=>document.documentElement.dataset.theme="obsidian-blue");

const mobile=await browser.newPage({viewport:{width:390,height:844}});await mobile.goto("http://127.0.0.1:3001",{waitUntil:"networkidle"});await mobile.waitForTimeout(600);
await mobile.screenshot({path:"artifacts/theme-system/obsidian-hero-mobile.png"});
await mobile.locator(".build-chapter--idea").scrollIntoViewIfNeeded();await mobile.waitForTimeout(450);await mobile.screenshot({path:"artifacts/theme-system/obsidian-behind-build-mobile.png"});
await mobile.locator(".contact-panel").scrollIntoViewIfNeeded();await mobile.waitForTimeout(450);await mobile.screenshot({path:"artifacts/theme-system/obsidian-contact-mobile.png"});
const mobileResult=await mobile.evaluate(()=>({theme:document.documentElement.dataset.theme,overflow:document.documentElement.scrollWidth-innerWidth,projectPin:document.querySelector(".projects-stage")?.parentElement?.classList.contains("pin-spacer"),buildPin:document.querySelector(".build-stage")?.parentElement?.classList.contains("pin-spacer"),projectSnap:getComputedStyle(document.querySelector(".projects-track")).scrollSnapType,buildSnap:getComputedStyle(document.querySelector(".build-track")).scrollSnapType}));
console.log(JSON.stringify({obsidian,original,mobileResult,errors},null,2));
await browser.close();
