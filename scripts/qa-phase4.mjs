import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";

const browser=await chromium.launch({headless:true,executablePath:"C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"});
await mkdir("artifacts/phase4",{recursive:true});
const page=await browser.newPage({viewport:{width:1440,height:900}}); const errors=[];
page.on("console",m=>{if(m.type()==="error")errors.push(m.text())}); page.on("pageerror",e=>errors.push(e.message));
await page.goto("http://127.0.0.1:3001",{waitUntil:"networkidle"}); await page.waitForTimeout(1000);
const geometry=await page.evaluate(()=>{
  const stage=document.querySelector(".build-stage"), spacer=stage.parentElement?.classList.contains("pin-spacer")?stage.parentElement:null;
  const projectStage=document.querySelector(".projects-stage");
  return {stageTop:stage.getBoundingClientRect().top+scrollY,stageHeight:stage.getBoundingClientRect().height,spacerHeight:spacer?.getBoundingClientRect().height??0,trackWidth:document.querySelector(".build-track").scrollWidth,projectTrackWidth:document.querySelector(".projects-track").scrollWidth,docHeight:document.documentElement.scrollHeight,pinSpacers:document.querySelectorAll(".pin-spacer").length,projectStageTop:projectStage.getBoundingClientRect().top+scrollY};
});
const pinDistance=geometry.spacerHeight-geometry.stageHeight;
const stops=[0.035,.35,.65,.965];
const names=["01-idea","02-experience","03-engine","04-launch"];
for(let i=0;i<stops.length;i++){
  await page.evaluate(y=>scrollTo({top:y,behavior:"instant"}),geometry.stageTop+pinDistance*stops[i]); await page.waitForTimeout(1000);
  await page.screenshot({path:`artifacts/phase4/${names[i]}.png`});
}
await page.evaluate(y=>scrollTo(0,y),geometry.stageTop+pinDistance*.52); await page.waitForTimeout(700);
const forward=await page.locator(".build-track").evaluate(el=>new DOMMatrixReadOnly(getComputedStyle(el).transform).m41);
await page.mouse.wheel(0,-650); await page.waitForTimeout(1000);
const reverse=await page.locator(".build-track").evaluate(el=>new DOMMatrixReadOnly(getComputedStyle(el).transform).m41);
await page.mouse.wheel(0,1200); await page.waitForTimeout(1000);
const resumed=await page.locator(".build-track").evaluate(el=>new DOMMatrixReadOnly(getComputedStyle(el).transform).m41);
const desktop=await page.evaluate(()=>({horizontalOverflow:document.documentElement.scrollWidth-innerWidth,projectTransform:getComputedStyle(document.querySelector(".projects-track")).transform,buildTransform:getComputedStyle(document.querySelector(".build-track")).transform,chapters:document.querySelectorAll(".build-chapter").length}));

const mobile=await browser.newPage({viewport:{width:390,height:844}}); await mobile.goto("http://127.0.0.1:3001",{waitUntil:"networkidle"}); await mobile.waitForTimeout(700);
for(let i=0;i<4;i++){await mobile.locator(".build-chapter").nth(i).scrollIntoViewIfNeeded();await mobile.waitForTimeout(350);if(i===0||i===3)await mobile.screenshot({path:`artifacts/phase4/mobile-${names[i]}.png`});}
const mobileResult=await mobile.evaluate(()=>({horizontalOverflow:document.documentElement.scrollWidth-innerWidth,buildTransform:getComputedStyle(document.querySelector(".build-track")).transform,buildPinSpacer:Boolean(document.querySelector(".build-stage")?.parentElement?.classList.contains("pin-spacer")),chapterWidths:[...document.querySelectorAll(".build-chapter")].map(el=>el.getBoundingClientRect().width)}));
const reduced=await browser.newPage({viewport:{width:1440,height:900},reducedMotion:"reduce"});await reduced.goto("http://127.0.0.1:3001",{waitUntil:"networkidle"});await reduced.waitForTimeout(500);
const reducedResult=await reduced.evaluate(()=>({pinSpacers:document.querySelectorAll(".pin-spacer").length,buildTransform:getComputedStyle(document.querySelector(".build-track")).transform,horizontalOverflow:document.documentElement.scrollWidth-innerWidth}));
console.log(JSON.stringify({geometry,pinDistance,motion:{forward,reverse,resumed,reverses:reverse>forward,resumes:resumed<reverse},desktop,mobileResult,reducedResult,errors},null,2));
await browser.close();
