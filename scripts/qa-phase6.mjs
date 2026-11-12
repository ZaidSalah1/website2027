import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";

const browser=await chromium.launch({headless:true,executablePath:"C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"});
await mkdir("artifacts/phase6",{recursive:true});

async function touchDrag(session,start,end,steps=10){
  await session.send("Input.dispatchTouchEvent",{type:"touchStart",touchPoints:[{x:start.x,y:start.y,id:1,radiusX:4,radiusY:4,force:1}]});
  for(let i=1;i<=steps;i++){const t=i/steps;await session.send("Input.dispatchTouchEvent",{type:"touchMove",touchPoints:[{x:start.x+(end.x-start.x)*t,y:start.y+(end.y-start.y)*t,id:1,radiusX:4,radiusY:4,force:1}]});await new Promise(r=>setTimeout(r,18));}
  await session.send("Input.dispatchTouchEvent",{type:"touchEnd",touchPoints:[]});
}

const widths=[320,375,390,430,768];const results=[];
for(const width of widths){
  const height=width===768?1024:844;
  const context=await browser.newContext({viewport:{width,height},isMobile:true,hasTouch:true,deviceScaleFactor:1});
  const page=await context.newPage();const session=await context.newCDPSession(page);const errors=[];
  page.on("console",m=>{if(m.type()==="error")errors.push(m.text())});page.on("pageerror",e=>errors.push(e.message));
  await page.goto("http://127.0.0.1:3001",{waitUntil:"networkidle"});await page.waitForTimeout(600);

  const projectTrack=page.locator(".projects-track");await projectTrack.scrollIntoViewIfNeeded();await page.waitForTimeout(350);const projectBox=await projectTrack.boundingBox();
  const pageYBeforeDiagonal=await page.evaluate(()=>scrollY);const projectBefore=await projectTrack.evaluate(el=>el.scrollLeft);
  await touchDrag(session,{x:width-35,y:projectBox.y+Math.min(projectBox.height*.45,height*.45)},{x:45,y:projectBox.y+Math.min(projectBox.height*.45,height*.45)+38});await page.waitForTimeout(700);
  const projectAfter=await projectTrack.evaluate(el=>el.scrollLeft);const pageYAfterDiagonal=await page.evaluate(()=>scrollY);
  await touchDrag(session,{x:55,y:projectBox.y+Math.min(projectBox.height*.45,height*.45)},{x:width-35,y:projectBox.y+Math.min(projectBox.height*.45,height*.45)});await page.waitForTimeout(650);const projectReverse=await projectTrack.evaluate(el=>el.scrollLeft);
  await projectTrack.focus();await page.keyboard.press("ArrowRight");await page.waitForTimeout(650);const projectKeyboard=await projectTrack.evaluate(el=>el.scrollLeft);
  const verticalStart=await page.evaluate(()=>scrollY);await touchDrag(session,{x:width/2,y:Math.min(height-100,projectBox.y+projectBox.height*.7)},{x:width/2-8,y:Math.max(90,projectBox.y+80)});await page.waitForTimeout(650);const verticalEnd=await page.evaluate(()=>scrollY);

  const buildTrack=page.locator(".build-track");await buildTrack.scrollIntoViewIfNeeded();await page.waitForTimeout(400);const buildBox=await buildTrack.boundingBox();const buildBefore=await buildTrack.evaluate(el=>el.scrollLeft);
  await touchDrag(session,{x:width-35,y:Math.min(height-120,buildBox.y+buildBox.height*.45)},{x:45,y:Math.min(height-120,buildBox.y+buildBox.height*.45)+30});await page.waitForTimeout(700);const buildAfter=await buildTrack.evaluate(el=>el.scrollLeft);
  await touchDrag(session,{x:55,y:Math.min(height-120,buildBox.y+buildBox.height*.45)},{x:width-35,y:Math.min(height-120,buildBox.y+buildBox.height*.45)});await page.waitForTimeout(650);const buildReverse=await buildTrack.evaluate(el=>el.scrollLeft);
  await buildTrack.focus();await page.keyboard.press("ArrowRight");await page.waitForTimeout(650);const buildKeyboard=await buildTrack.evaluate(el=>el.scrollLeft);

  if(width===390){await projectTrack.scrollIntoViewIfNeeded();await page.waitForTimeout(400);await page.screenshot({path:"artifacts/phase6/mobile-projects.png"});await buildTrack.scrollIntoViewIfNeeded();await page.waitForTimeout(400);await page.screenshot({path:"artifacts/phase6/mobile-behind-build.png"});}
  const layout=await page.evaluate(()=>({horizontalOverflow:document.documentElement.scrollWidth-innerWidth,projectSnap:getComputedStyle(document.querySelector(".projects-track")).scrollSnapType,buildSnap:getComputedStyle(document.querySelector(".build-track")).scrollSnapType,projectPin:document.querySelector(".projects-stage")?.parentElement?.classList.contains("pin-spacer"),buildPin:document.querySelector(".build-stage")?.parentElement?.classList.contains("pin-spacer"),projectActive:document.querySelector(".projects-stage .mobile-carousel-dots button[aria-current='true']")?.getAttribute("aria-label"),buildActive:document.querySelector(".build-stage .mobile-carousel-dots button[aria-current='true']")?.getAttribute("aria-label"),touchAction:getComputedStyle(document.querySelector(".projects-track")).touchAction,docHeight:document.documentElement.scrollHeight}));
  results.push({width,height,project:{before:projectBefore,after:projectAfter,reverse:projectReverse,keyboard:projectKeyboard,diagonalPageDelta:pageYAfterDiagonal-pageYBeforeDiagonal,verticalPageDelta:verticalEnd-verticalStart},build:{before:buildBefore,after:buildAfter,reverse:buildReverse,keyboard:buildKeyboard},layout,errors});await context.close();
}

const desktop=await browser.newPage({viewport:{width:1440,height:900}});await desktop.goto("http://127.0.0.1:3001",{waitUntil:"networkidle"});await desktop.waitForTimeout(700);const desktopResult=await desktop.evaluate(()=>({horizontalOverflow:document.documentElement.scrollWidth-innerWidth,pinSpacers:document.querySelectorAll(".pin-spacer").length,projectTrackWidth:document.querySelector(".projects-track").scrollWidth,buildTrackWidth:document.querySelector(".build-track").scrollWidth,controlsDisplay:getComputedStyle(document.querySelector(".mobile-carousel-controls")).display}));
console.log(JSON.stringify({results,desktopResult},null,2));await browser.close();
