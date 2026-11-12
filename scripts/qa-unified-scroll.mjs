import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";

const browser=await chromium.launch({headless:true,executablePath:"C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"});
await mkdir("artifacts/unified-scroll",{recursive:true});
const cases=[
  {width:375,height:812,label:"mobile-375"},{width:390,height:844,label:"mobile-390"},{width:430,height:932,label:"mobile-430"},
  {width:768,height:1024,label:"tablet-768"},{width:820,height:1180,label:"tablet-820"},{width:1024,height:1366,label:"tablet-1024"},
  {width:844,height:390,label:"phone-landscape"},{width:1024,height:768,label:"tablet-landscape"},{width:1440,height:900,label:"desktop-1440"}
];
const results=[];const errors=[];
const transformX=async(page,selector)=>page.locator(selector).evaluate(el=>new DOMMatrixReadOnly(getComputedStyle(el).transform).m41);
const geometry=async(page,stageSelector,trackSelector)=>page.evaluate(({stageSelector,trackSelector})=>{const stage=document.querySelector(stageSelector),track=document.querySelector(trackSelector),spacer=stage.parentElement?.classList.contains("pin-spacer")?stage.parentElement:null;return{top:(spacer??stage).getBoundingClientRect().top+scrollY,stageHeight:stage.getBoundingClientRect().height,spacerHeight:spacer?.getBoundingClientRect().height??0,trackWidth:track.scrollWidth,pinned:Boolean(spacer),snap:getComputedStyle(track).scrollSnapType,overflowX:getComputedStyle(track).overflowX,touchAction:getComputedStyle(track).touchAction}}, {stageSelector,trackSelector});

for(const item of cases){
  const page=await browser.newPage({viewport:{width:item.width,height:item.height},hasTouch:item.width<1200,isMobile:item.width<600});
  page.on("console",m=>m.type()==="error"&&errors.push(`${item.label}: ${m.text()}`));page.on("pageerror",e=>errors.push(`${item.label}: ${e.message}`));
  await page.goto("http://127.0.0.1:3001",{waitUntil:"networkidle"});await page.waitForTimeout(550);
  const project=await geometry(page,".projects-stage",".projects-track");const build=await geometry(page,".build-stage",".build-track");
  const projectDistance=project.spacerHeight-project.stageHeight;const buildDistance=build.spacerHeight-build.stageHeight;
  await page.evaluate(y=>scrollTo({top:y,behavior:"instant"}),project.top+projectDistance*.55);await page.waitForTimeout(900);const projectForward=await transformX(page,".projects-track");
  await page.evaluate(y=>scrollTo({top:y,behavior:"instant"}),project.top+projectDistance*.25);await page.waitForTimeout(900);const projectReverse=await transformX(page,".projects-track");
  await page.evaluate(y=>scrollTo({top:y,behavior:"instant"}),build.top+buildDistance*.55);await page.waitForTimeout(900);const buildForward=await transformX(page,".build-track");
  await page.evaluate(y=>scrollTo({top:y,behavior:"instant"}),build.top+buildDistance*.25);await page.waitForTimeout(900);const buildReverse=await transformX(page,".build-track");
  await page.evaluate(y=>scrollTo({top:y,behavior:"instant"}),project.top+project.spacerHeight+40);await page.waitForTimeout(350);const released=await page.locator(".projects-stage").evaluate(el=>el.getBoundingClientRect().bottom<innerHeight*.25);
  const pageState=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth-innerWidth,pinSpacers:document.querySelectorAll(".pin-spacer").length,controls:document.querySelectorAll(".mobile-carousel-controls").length}));
  if([390,820,1440].includes(item.width)){
    await page.evaluate(y=>scrollTo({top:y,behavior:"instant"}),project.top+projectDistance*.48);await page.waitForTimeout(450);
    await page.screenshot({path:`artifacts/unified-scroll/${item.label}-projects.png`});
    await page.evaluate(y=>scrollTo({top:y,behavior:"instant"}),build.top+buildDistance*.38);await page.waitForTimeout(450);
    await page.screenshot({path:`artifacts/unified-scroll/${item.label}-behind-build.png`});
  }
  results.push({label:item.label,project,build,projectForward,projectReverse,buildForward,buildReverse,forwardProjects:projectForward<0,reverseProjects:projectReverse>projectForward,forwardBuild:buildForward<0,reverseBuild:buildReverse>buildForward,released,...pageState});
  await page.close();
}

const touchResults=[];
for(const {width,height,label} of [{width:390,height:844,label:"phone-touch"},{width:820,height:1180,label:"tablet-touch"}]){
  const page=await browser.newPage({viewport:{width,height},hasTouch:true,isMobile:width<600});await page.goto("http://127.0.0.1:3001",{waitUntil:"networkidle"});await page.waitForTimeout(500);
  const project=await geometry(page,".projects-stage",".projects-track");await page.evaluate(y=>scrollTo({top:y,behavior:"instant"}),project.top+20);await page.waitForTimeout(300);
  const before={scroll:await page.evaluate(()=>scrollY),x:await transformX(page,".projects-track")};const cdp=await page.context().newCDPSession(page);
  const x=Math.round(width*.5),start=Math.round(height*.78),end=Math.round(height*.24);
  await cdp.send("Input.dispatchTouchEvent",{type:"touchStart",touchPoints:[{x,y:start}]});
  for(let i=1;i<=8;i++){const y=Math.round(start+(end-start)*(i/8));await cdp.send("Input.dispatchTouchEvent",{type:"touchMove",touchPoints:[{x,y}]});await page.waitForTimeout(18)}
  await cdp.send("Input.dispatchTouchEvent",{type:"touchEnd",touchPoints:[]});await page.waitForTimeout(800);
  const after={scroll:await page.evaluate(()=>scrollY),x:await transformX(page,".projects-track")};touchResults.push({label,before,after,verticalScrollAdvanced:after.scroll>before.scroll,horizontalTrackAdvanced:after.x<before.x});await page.close();
}

const reduced=await browser.newPage({viewport:{width:390,height:844},reducedMotion:"reduce"});await reduced.goto("http://127.0.0.1:3001",{waitUntil:"networkidle"});await reduced.waitForTimeout(400);const reducedResult=await reduced.evaluate(()=>({pins:document.querySelectorAll(".pin-spacer").length,projectDisplay:getComputedStyle(document.querySelector(".projects-track")).display,buildDisplay:getComputedStyle(document.querySelector(".build-track")).display,overflow:document.documentElement.scrollWidth-innerWidth}));await reduced.close();
console.log(JSON.stringify({results,touchResults,reducedResult,errors},null,2));await browser.close();
