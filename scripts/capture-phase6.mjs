import { chromium } from "playwright";
const browser=await chromium.launch({headless:true,executablePath:"C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"});
const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});const page=await context.newPage();
await page.goto("http://127.0.0.1:3001",{waitUntil:"networkidle"});await page.waitForTimeout(600);
for(const [selector,path] of [[".projects-stage","artifacts/phase6/mobile-projects.png"],[".build-stage","artifacts/phase6/mobile-behind-build.png"]]){
  const top=await page.locator(selector).evaluate(el=>el.getBoundingClientRect().top+scrollY);await page.evaluate(y=>scrollTo(0,y),top);await page.waitForTimeout(500);await page.evaluate(()=>document.activeElement instanceof HTMLElement&&document.activeElement.blur());await page.screenshot({path});
}
await browser.close();
