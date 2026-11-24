"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";

type Chapter = { index: string; eyebrow: string; title: string; copy: string; scene: "idea" | "experience" | "engine" | "launch" };

const chapters: Chapter[] = [
  { index: "01", eyebrow: "DISCOVER / DEFINE", title: "THE IDEA", copy: "Start with the real problem. Strip away assumptions. Shape a practical path from need to useful software.", scene: "idea" },
  { index: "02", eyebrow: "DESIGN / INTERACT", title: "THE EXPERIENCE", copy: "Turn intent into an interface that feels clear, responsive, and natural across web and mobile.", scene: "experience" },
  { index: "03", eyebrow: "CONNECT / ORCHESTRATE", title: "THE ENGINE", copy: "Build the systems beneath the surface—data, APIs, identity, integrations, and real-time movement.", scene: "engine" },
  { index: "04", eyebrow: "VERIFY / RELEASE", title: "THE LAUNCH", copy: "Bring every layer into alignment, confirm the final release, and activate a product ready for the real world.", scene: "launch" },
];

function IdeaScene() {
  return <div className="build-scene idea-scene" aria-hidden="true">
    <div className="idea-grid-orbit orbit-a" /><div className="idea-grid-orbit orbit-b" />
    <svg className="idea-connectors" viewBox="0 0 1000 700" preserveAspectRatio="none">
      <defs><marker id="idea-arrow" viewBox="0 0 12 12" refX="10" refY="6" markerWidth="9" markerHeight="9" orient="auto"><path d="M1 1 11 6 1 11 3.5 6z" /></marker></defs>
      <path className="connector-ghost" d="M420 210 C465 174 510 172 548 198" /><path className="connector-live connector-one" pathLength="1" d="M420 210 C465 174 510 172 548 198" markerEnd="url(#idea-arrow)" />
      <path className="connector-ghost" d="M780 322 C782 344 744 351 690 360" /><path className="connector-live connector-two" pathLength="1" d="M780 322 C782 344 744 351 690 360" markerEnd="url(#idea-arrow)" />
      <path className="connector-branch" d="M454 177 L454 115 L526 115" />
      <circle className="connector-node node-one" cx="420" cy="210" r="5"/><circle className="connector-node node-two" cx="780" cy="322" r="5"/><circle className="connector-node node-three" cx="690" cy="360" r="4"/>
    </svg>
    <div className="path-index path-index-one"><b>01</b><i>→</i><b>02</b></div><div className="path-index path-index-two"><b>02</b><i>→</i><b>03</b></div>
    <section className="idea-sheet sheet-a">
      <header><span>01 / DISCOVER</span><b>PROBLEM</b></header>
      <div className="sticky-board"><article className="sticky-note sticky-one"><i>01</i><p>What&apos;s frustrating today?</p><b /></article><article className="sticky-note sticky-two"><i>02</i><p>What do users need?</p><b /></article><article className="sticky-note sticky-three"><i>03</i><p>What&apos;s the real goal?</p><b /></article></div>
      <footer><i /> LISTEN / QUESTION / DEFINE</footer>
    </section>
    <section className="idea-sheet sheet-b">
      <header><span>02 / CONNECT</span><b>FLOW</b></header>
      <div className="flow-board">{[["DISCOVER","01"],["INTERACT","02"],["COMPLETE","03"]].map(([label,index],i)=><div className={`flow-state flow-state-${i+1}`} key={label}><div className="flow-window"><em>{i===0?"?":i===1?"↗":"✓"}</em><i/><span/><span/><b>{i===0?"DEFINE":i===1?"CHOOSE":"READY"}</b></div><small>{index} / {label}</small></div>)}<svg viewBox="0 0 600 120" preserveAspectRatio="none"><defs><marker id="flow-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 10 5 0 10z"/></marker></defs><path className="flow-path flow-path-one" pathLength="1" d="M155 62 C190 18 220 18 255 61" markerEnd="url(#flow-arrow)"/><path className="flow-path flow-path-two" pathLength="1" d="M350 61 C385 104 420 104 453 61" markerEnd="url(#flow-arrow)"/><circle cx="206" cy="31" r="4"/><circle cx="402" cy="91" r="4"/></svg></div>
      <footer><i /> INTENT BECOMES INTERACTION</footer>
    </section>
    <section className="idea-sheet sheet-c">
      <header><span>03 / RESOLVE</span><b>SOLUTION</b></header>
      <div className="solution-board"><div className="solution-ui"><div className="solution-nav"><i/><span/><span/></div><div className="solution-layout"><aside><i/><i/><i/></aside><main><b/><span/><span/><div><i/><i/></div></main></div></div><svg viewBox="0 0 250 160"><path className="solution-path" pathLength="1" d="M12 42 H53 V16 H95 M53 42 V58 H95 M53 58 V101 H95 M53 101 V144 H95"/><circle cx="12" cy="42" r="4"/><circle cx="95" cy="16" r="4"/><circle cx="95" cy="58" r="4"/><circle cx="95" cy="101" r="4"/><circle cx="95" cy="144" r="4"/></svg><div className="component-tree"><span>APP SHELL</span><i>HEADER</i><i>CONTENT</i><i>STATE</i><i>ACTION</i></div></div>
      <footer><span className="ready-label"><i>✓</i> READY TO BUILD</span><b>STRUCTURE / VERIFIED</b></footer>
    </section>
    <div className="idea-note">IDEA → SYSTEM</div>
  </div>;
}

function ExperienceScene() {
  return <div className="build-scene experience-scene" aria-hidden="true">
    <div className="experience-desktop" data-build-depth="back"><div className="window-bar"><i/><i/><i/></div><div className="window-layout"><aside/><main><b/><span/><span/><div/></main></div></div>
    <div className="experience-phone phone-left" data-build-depth="front"><i/><b>01</b><span/><span/><button>START</button></div>
    <div className="experience-phone phone-right" data-build-depth="front"><i/><b>02</b><div/><span/><button>NEXT</button></div>
    <div className="experience-label label-web">WEB / RESPONSIVE</div><div className="experience-label label-mobile">MOBILE / NATIVE</div>
  </div>;
}

function EngineScene() {
  const scene = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!scene.current) return;
    gsap.registerPlugin(MotionPathPlugin);
    const context = gsap.context(() => {
      const media = gsap.matchMedia();
      const setup = (suffix: "desktop" | "mobile") => {
        const timeline = gsap.timeline({ paused:true, repeat:-1, repeatDelay:.75 });
        const path = (name:string) => `.engine-path--${name}-${suffix}`;
        const travel = (signal:string, route:string, duration:number) => timeline
          .set(signal,{opacity:1})
          .to(signal,{duration,ease:"power1.inOut",motionPath:{path:path(route),align:path(route),alignOrigin:[.5,.5]}},">")
          .set(signal,{opacity:0});

        travel(".engine-signal--primary","request",.72);
        timeline.to(".engine-backend",{borderColor:"rgba(101,156,255,.82)",boxShadow:"0 0 2.4rem rgba(76,139,237,.18)",duration:.28,yoyo:true,repeat:1},">");
        travel(".engine-signal--data","data-out",.58);
        timeline.to(".engine-database",{borderColor:"rgba(101,156,255,.72)",duration:.2,yoyo:true,repeat:1},"<.32");
        travel(".engine-signal--data","data-return",.58);
        travel(".engine-signal--service","integration",.68);
        timeline.to(".engine-external",{borderColor:"rgba(101,156,255,.68)",duration:.2,yoyo:true,repeat:1},"<.4");
        travel(".engine-signal--primary","response",.72);
        travel(".engine-signal--event","realtime",.58);
        timeline.to(".engine-realtime",{borderColor:"rgba(82,205,211,.72)",duration:.2,yoyo:true,repeat:1},"<.36");
        travel(".engine-signal--event","events",.72);

        const sync = (entry?:IntersectionObserverEntry) => {
          const visible = entry ? entry.isIntersecting : Boolean(scene.current && scene.current.getBoundingClientRect().right > 0 && scene.current.getBoundingClientRect().left < innerWidth);
          if (visible && !document.hidden && !ScrollTrigger.isScrolling()) timeline.play(); else timeline.pause();
        };
        const observer = new IntersectionObserver(([entry])=>sync(entry),{threshold:.28});
        observer.observe(scene.current!);
        const visibility = () => sync();
        document.addEventListener("visibilitychange",visibility);
        ScrollTrigger.addEventListener("scrollStart",visibility);ScrollTrigger.addEventListener("scrollEnd",visibility);
        return()=>{observer.disconnect();document.removeEventListener("visibilitychange",visibility);ScrollTrigger.removeEventListener("scrollStart",visibility);ScrollTrigger.removeEventListener("scrollEnd",visibility);timeline.kill()};
      };
      media.add("(min-width:901px) and (prefers-reduced-motion:no-preference)",()=>setup("desktop"));
      media.add("(max-width:900px) and (prefers-reduced-motion:no-preference)",()=>setup("mobile"));
      return()=>media.revert();
    },scene);
    return()=>context.revert();
  },[]);

  return <div ref={scene} className="build-scene engine-scene" role="img" aria-labelledby="engine-diagram-title engine-diagram-description">
    <span id="engine-diagram-title" className="sr-only">Client and server system architecture</span>
    <span id="engine-diagram-description" className="sr-only">Web and mobile clients send HTTPS requests to a backend API. The backend validates identity, applies business logic, reads and writes data, calls external services, returns responses, and delivers bidirectional real-time events.</span>
    <div className="engine-grid" aria-hidden="true" />
    <svg className="engine-connectors engine-connectors--desktop" viewBox="0 0 1000 600" aria-hidden="true">
      <defs><marker id="engine-arrow-blue" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 10 5 0 10z"/></marker><marker id="engine-arrow-cyan" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 10 5 0 10z"/></marker></defs>
      <path className="engine-path engine-path--request-desktop" d="M245 238 H350" markerEnd="url(#engine-arrow-blue)"/><path className="engine-path engine-path--response-desktop engine-path--response" d="M350 286 H245" markerEnd="url(#engine-arrow-blue)"/>
      <path className="engine-path engine-path--events-desktop engine-path--events" d="M350 350 H245" markerEnd="url(#engine-arrow-cyan)"/><path className="engine-path engine-path--event-return" d="M245 366 H350" markerEnd="url(#engine-arrow-cyan)"/>
      <path className="engine-path engine-path--data-out-desktop" d="M625 205 L735 157" markerEnd="url(#engine-arrow-blue)"/><path className="engine-path engine-path--data-return-desktop engine-path--response" d="M735 196 L625 238" markerEnd="url(#engine-arrow-blue)"/>
      <path className="engine-path engine-path--realtime-desktop engine-path--events" d="M625 321 H735" markerEnd="url(#engine-arrow-cyan)"/><path className="engine-path engine-path--event-return" d="M735 339 H625" markerEnd="url(#engine-arrow-cyan)"/>
      <path className="engine-path engine-path--integration-desktop" d="M625 397 L735 475" markerEnd="url(#engine-arrow-blue)"/>
      <g className="engine-route-labels"><text x="270" y="225">REQUEST</text><text x="270" y="307">RESPONSE</text><text x="272" y="342">EVENTS</text><text x="650" y="166">READ / WRITE</text><text x="655" y="310">REAL-TIME</text><text x="654" y="440">INTEGRATION</text></g>
      <circle className="engine-signal engine-signal--primary" r="5"/><circle className="engine-signal engine-signal--data" r="5"/><circle className="engine-signal engine-signal--service" r="5"/><circle className="engine-signal engine-signal--event" r="5"/>
    </svg>
    <svg className="engine-connectors engine-connectors--mobile" viewBox="0 0 600 820" aria-hidden="true">
      <defs><marker id="engine-arrow-mobile" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 10 5 0 10z"/></marker><marker id="engine-arrow-mobile-cyan" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 10 5 0 10z"/></marker></defs>
      <path className="engine-path engine-path--request-mobile" d="M272 185 V264" markerEnd="url(#engine-arrow-mobile)"/><path className="engine-path engine-path--response-mobile engine-path--response" d="M328 264 V185" markerEnd="url(#engine-arrow-mobile)"/>
      <path className="engine-path engine-path--events-mobile engine-path--events" d="M365 264 V185" markerEnd="url(#engine-arrow-mobile-cyan)"/><path className="engine-path engine-path--event-return" d="M398 185 V264" markerEnd="url(#engine-arrow-mobile-cyan)"/>
      <path className="engine-path engine-path--data-out-mobile" d="M245 500 L118 618" markerEnd="url(#engine-arrow-mobile)"/><path className="engine-path engine-path--data-return-mobile engine-path--response" d="M150 636 L274 520" markerEnd="url(#engine-arrow-mobile)"/>
      <path className="engine-path engine-path--realtime-mobile engine-path--events" d="M300 520 V620" markerEnd="url(#engine-arrow-mobile-cyan)"/><path className="engine-path engine-path--event-return" d="M328 620 V520" markerEnd="url(#engine-arrow-mobile-cyan)"/>
      <path className="engine-path engine-path--integration-mobile" d="M355 500 L482 618" markerEnd="url(#engine-arrow-mobile)"/>
      <g className="engine-route-labels"><text x="182" y="230">REQUEST / RESPONSE</text><text x="71" y="573">READ / WRITE</text><text x="250" y="576">EVENTS</text><text x="420" y="573">INTEGRATION</text></g>
      <circle className="engine-signal engine-signal--primary" r="5"/><circle className="engine-signal engine-signal--data" r="5"/><circle className="engine-signal engine-signal--service" r="5"/><circle className="engine-signal engine-signal--event" r="5"/>
    </svg>
    <section className="engine-layer engine-clients"><header><small>01 / CLIENT APPLICATIONS</small><b>INTERFACE LAYER</b></header><div><span>WEB APPLICATION</span><span>MOBILE APPLICATION</span></div><p>HTTPS requests · responses · live updates</p></section>
    <section className="engine-layer engine-backend"><header><small>02 / CENTRAL ORCHESTRATION</small><b>BACKEND API</b></header><div className="engine-modules"><span><i>AUTH</i>Identity / access</span><span><i>VALIDATION</i>Request integrity</span><span><i>LOGIC</i>Product rules</span></div><p>RECEIVE → VERIFY → PROCESS → COORDINATE</p></section>
    <section className="engine-layer engine-service engine-database"><header><small>03 / DATA</small><b>DATABASE</b></header><p>Persistent reads / writes</p></section>
    <section className="engine-layer engine-service engine-realtime"><header><small>04 / LIVE</small><b>REAL-TIME EVENTS</b></header><p>Socket.IO / WebSocket</p></section>
    <section className="engine-layer engine-service engine-external"><header><small>05 / PROVIDERS</small><b>EXTERNAL SERVICES</b></header><p>Payments · notifications · APIs</p></section>
    <div className="engine-status"><i/> ARCHITECTURE / ACTIVE</div>
  </div>;
}

function LaunchScene() {
  const scene = useRef<HTMLDivElement>(null);
  useEffect(()=>{
    if(!scene.current)return;
    const context=gsap.context(()=>{
      if(matchMedia("(prefers-reduced-motion:reduce)").matches)return;
      const timeline=gsap.timeline({paused:true,repeat:-1,repeatDelay:1.1});
      const routes=["a","b","c"];
      timeline.set(".launch-input-signal",{opacity:1});
      routes.forEach((route,index)=>timeline.to(`.launch-signal--${route}`,{duration:.9,ease:"power1.inOut",motionPath:{path:`.launch-route--${route}`,align:`.launch-route--${route}`,alignOrigin:[.5,.5]}},index===0?0:index*.08));
      timeline.set(".launch-input-signal",{opacity:0},1)
        .to(".launch-core",{borderColor:"rgba(108,166,255,.92)",boxShadow:"0 0 2.6rem rgba(72,138,235,.2),inset 0 0 2rem rgba(72,138,235,.06)",duration:.34,yoyo:true,repeat:1},.9)
        .fromTo(".launch-core-progress i",{scaleX:0},{scaleX:1,duration:.58,ease:"power2.out"},1)
        .set(".launch-output-signal",{opacity:1},1.45)
        .to(".launch-output-signal",{duration:.92,ease:"power2.inOut",motionPath:{path:".launch-route--release",align:".launch-route--release",alignOrigin:[.5,.5]}},1.45)
        .to(".launch-confirmation",{borderColor:"rgba(105,165,255,.78)",color:"#e8f2ff",duration:.25,yoyo:true,repeat:1},2.05)
        .set(".launch-output-signal",{opacity:0},2.4);
      const sync=(entry?:IntersectionObserverEntry)=>{const visible=entry?entry.isIntersecting:Boolean(scene.current&&scene.current.getBoundingClientRect().right>0&&scene.current.getBoundingClientRect().left<innerWidth);if(visible&&!document.hidden&&!ScrollTrigger.isScrolling())timeline.play();else timeline.pause()};
      const observer=new IntersectionObserver(([entry])=>sync(entry),{threshold:.28});observer.observe(scene.current!);
      const visibility=()=>sync();document.addEventListener("visibilitychange",visibility);ScrollTrigger.addEventListener("scrollStart",visibility);ScrollTrigger.addEventListener("scrollEnd",visibility);
      return()=>{observer.disconnect();document.removeEventListener("visibilitychange",visibility);ScrollTrigger.removeEventListener("scrollStart",visibility);ScrollTrigger.removeEventListener("scrollEnd",visibility);timeline.kill()};
    },scene);return()=>context.revert();
  },[]);
  return <div ref={scene} className="build-scene launch-scene" role="img" aria-labelledby="launch-visual-title launch-visual-description">
    <span id="launch-visual-title" className="sr-only">Final release activation</span><span id="launch-visual-description" className="sr-only">Build, verification, and system signals converge into a final release core before a confirmed launch signal is sent.</span>
    <div className="launch-grid" aria-hidden="true"/>
    <svg className="launch-network" viewBox="0 0 1000 600" aria-hidden="true">
      <defs><marker id="launch-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 10 5 0 10z"/></marker></defs>
      <path className="launch-route launch-route--a" d="M78 145 H275 L445 270" markerEnd="url(#launch-arrow)"/><path className="launch-route launch-route--b" d="M78 300 H445" markerEnd="url(#launch-arrow)"/><path className="launch-route launch-route--c" d="M78 455 H275 L445 330" markerEnd="url(#launch-arrow)"/><path className="launch-route launch-route--release" d="M555 300 H920" markerEnd="url(#launch-arrow)"/>
      <path className="launch-guide" d="M275 118 V482 M720 270 V330"/><circle className="launch-input-signal launch-signal--a" r="5"/><circle className="launch-input-signal launch-signal--b" r="5"/><circle className="launch-input-signal launch-signal--c" r="5"/><circle className="launch-output-signal" r="6"/>
    </svg>
    <div className="launch-inputs"><span><i/>BUILD COMPLETE</span><span><i/>QUALITY VERIFIED</span><span><i/>SYSTEMS ALIGNED</span></div>
    <section className="launch-core"><header><span>FINAL RELEASE</span><b>04</b></header><strong>ACTIVATED</strong><div className="launch-core-progress"><i/></div><footer><span>BUILD</span><span>VERIFY</span><span>RELEASE</span></footer></section>
    <div className="launch-confirmation"><span>GO-LIVE</span><strong>LAUNCH CONFIRMED</strong><small>PRODUCT / READY</small></div>
    <div className="launch-meta"><span>ALL SYSTEMS / ALIGNED</span><span>RELEASE CHANNEL / STABLE</span></div>
  </div>;
}

const scenes = { idea: IdeaScene, experience: ExperienceScene, engine: EngineScene, launch: LaunchScene };

function BuildChapter({ chapter }: { chapter: Chapter }) {
  const Scene = scenes[chapter.scene];
  return <article className={`build-chapter build-chapter--${chapter.scene}`}>
    <div className="build-copy">
      <div className="build-kicker" data-build-reveal><span>{chapter.index}</span>{chapter.eyebrow}</div>
      <h3 data-build-reveal>{chapter.title}</h3><p data-build-reveal>{chapter.copy}</p>
      <div className="build-chapter-number" aria-hidden="true">{chapter.index}</div>
    </div>
    <div className="build-visual" data-build-reveal><Scene /></div>
  </article>;
}

export default function BehindTheBuild() {
  const root = useRef<HTMLElement>(null); const stage = useRef<HTMLDivElement>(null); const track = useRef<HTMLDivElement>(null);
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ ignoreMobileResize: true });
    const context = gsap.context(() => {
      const media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference)", () => {
        const syncViewport=()=>root.current?.style.setProperty("--story-viewport",`${stage.current?.clientWidth??innerWidth}px`);
        syncViewport();
        const panels=gsap.utils.toArray<HTMLElement>(".build-chapter");
        const distance=()=>{const last=panels[panels.length-1];return Math.max(0,(last?.offsetLeft??0)+(last?.offsetWidth??0)-(stage.current?.clientWidth??innerWidth))}; const travelShare=.9; const mobile=matchMedia("(max-width:900px)").matches;
        let activeIndex=-1;
        const setActiveChapter=(nextIndex:number)=>{if(nextIndex===activeIndex)return;activeIndex=nextIndex;panels.forEach((panel,index)=>{panel.dataset.buildActive=index===activeIndex?"true":"false";panel.dataset.storyDistance=String(Math.abs(index-activeIndex))})};
        setActiveChapter(0);
        const onScrollStart=()=>mobile&&stage.current?.classList.add("is-story-scrolling");
        const onScrollEnd=()=>stage.current?.classList.remove("is-story-scrolling");
        ScrollTrigger.addEventListener("scrollStart",onScrollStart);ScrollTrigger.addEventListener("scrollEnd",onScrollEnd);
        const timeline=gsap.timeline({ defaults:{ease:"none"}, scrollTrigger:{ id:"behind-build-horizontal", trigger:stage.current, start:"top top", end:()=>`+=${distance()/travelShare}`, pin:true, pinSpacing:true, scrub:mobile?.32:.65, anticipatePin:mobile?.5:1, invalidateOnRefresh:true, onRefreshInit:syncViewport,onUpdate:self=>setActiveChapter(Math.round(gsap.utils.clamp(0,1,(self.progress-.05)/travelShare)*Math.max(0,panels.length-1))) }});
        timeline.fromTo(".build-stage-chrome,.build-stage-footer",{opacity:.3},{opacity:1,duration:.05,ease:"power1.out"})
          .fromTo(".build-chapter:first-child .build-copy,.build-chapter:first-child .build-visual",{scale:.987},{scale:1,duration:.05,ease:"power1.out"},0)
          .fromTo(".build-progress i",{scaleX:0},{scaleX:1,duration:travelShare},.05)
          .to(track.current,{x:()=>-distance(),duration:travelShare,force3D:true},.05)
          .to(".build-chapter:last-child .build-copy,.build-chapter:last-child .build-visual",{y:-8,duration:.05,ease:"power1.inOut"},.95)
          .to(".build-stage-chrome,.build-stage-footer",{opacity:.38,duration:.05},.95);
        panels.forEach((panel,index)=>{
          const front=panel.querySelectorAll("[data-build-depth='front']"); const back=panel.querySelectorAll("[data-build-depth='back']");
          if(mobile){
            const position=.05+(index/Math.max(1,panels.length))*travelShare;
            timeline.fromTo(panel.querySelectorAll("[data-build-reveal]"),{y:40,opacity:.2},{y:0,opacity:1,stagger:.06,ease:"power2.out",duration:.14},position);
            if(front.length)timeline.fromTo(front,{x:45},{x:-25,duration:.2,ease:"none"},position);
            if(back.length)timeline.fromTo(back,{x:-25},{x:20,duration:.2,ease:"none"},position);
          }else{
            gsap.fromTo(panel.querySelectorAll("[data-build-reveal]"),{y:40,opacity:.2},{y:0,opacity:1,stagger:.06,ease:"power2.out",scrollTrigger:{trigger:panel,containerAnimation:timeline,start:"left 80%",end:"left 48%",scrub:true}});
            if(front.length) gsap.fromTo(front,{x:45},{x:-25,scrollTrigger:{trigger:panel,containerAnimation:timeline,start:"left right",end:"right left",scrub:true}});
            if(back.length) gsap.fromTo(back,{x:-25},{x:20,scrollTrigger:{trigger:panel,containerAnimation:timeline,start:"left right",end:"right left",scrub:true}});
          }
        });
        const ideaTimeline=gsap.timeline(mobile?{}:{scrollTrigger:{trigger:".build-chapter--idea",containerAnimation:timeline,start:"left 94%",end:"right 92%",scrub:true}});
        ideaTimeline.fromTo(".sheet-a",{y:24,rotate:-7,opacity:0},{y:0,rotate:-3.5,opacity:1,duration:.18,ease:"power2.out"})
          .fromTo(".sticky-note",{y:18,scale:.88,rotate:0,opacity:0},{y:0,scale:1,opacity:1,stagger:.045,duration:.18,ease:"power2.out"},.06)
          .fromTo(".connector-one",{strokeDashoffset:1},{strokeDashoffset:0,duration:.16},.21)
          .fromTo(".node-one",{scale:0,transformOrigin:"center"},{scale:1,duration:.06},.3)
          .fromTo(".sheet-b",{y:20,rotate:6,opacity:0},{y:0,rotate:2.8,opacity:1,duration:.16,ease:"power2.out"},.29)
          .fromTo(".flow-state",{y:12,opacity:0},{y:0,opacity:1,stagger:.065,duration:.12,ease:"power2.out"},.36)
          .fromTo(".flow-path",{strokeDashoffset:1},{strokeDashoffset:0,stagger:.075,duration:.12},.41)
          .fromTo(".connector-two",{strokeDashoffset:1},{strokeDashoffset:0,duration:.15},.56)
          .fromTo(".sheet-c",{y:28,rotate:-3,opacity:0},{y:0,rotate:-.8,opacity:1,duration:.17,ease:"power2.out"},.63)
          .fromTo(".solution-path",{strokeDashoffset:1},{strokeDashoffset:0,duration:.12},.7)
          .fromTo(".solution-ui,.component-tree",{y:10,opacity:0},{y:0,opacity:1,stagger:.05,duration:.13,ease:"power2.out"},.72)
          .fromTo(".ready-label",{scale:.9,opacity:0},{scale:1,opacity:1,duration:.12,ease:"power2.out"},.84)
          .fromTo(".idea-note",{opacity:0},{opacity:1,duration:.1},.9);
        if(mobile){ideaTimeline.duration(.14);timeline.add(ideaTimeline,.055)}
        return()=>{ScrollTrigger.removeEventListener("scrollStart",onScrollStart);ScrollTrigger.removeEventListener("scrollEnd",onScrollEnd);stage.current?.classList.remove("is-story-scrolling");root.current?.style.removeProperty("--story-viewport")};
      }); return()=>media.revert();
    },root); return()=>context.revert();
  },[]);

  return <section ref={root} id="behind-build" className="behind-build" aria-labelledby="build-heading">
    <div className="build-prelude"><div><p>04 / PROCESS</p><span>SECOND HORIZONTAL CHAPTER</span></div><h2 id="build-heading">BEHIND<br/><em>THE BUILD.</em></h2><p>Four connected stages. One end-to-end mindset—from the first question to a product people can use.</p><div className="build-axis">VERTICAL <span>↓</span> HORIZONTAL <span>→</span></div></div>
    <div ref={stage} className="build-stage">
      <div className="build-stage-chrome" aria-hidden="true"><span>BEHIND THE BUILD / 04</span><span className="build-progress"><i/></span><span>IDEA → LAUNCH</span></div>
      <div ref={track} className="build-track" role="region" aria-label="Behind the Build chapters. Continue scrolling vertically to move through the process." tabIndex={0}>{chapters.map(chapter=><BuildChapter chapter={chapter} key={chapter.index}/>)}</div>
      <div className="build-stage-footer" aria-hidden="true"><span>USE VERTICAL SCROLL</span><b>→</b><span>PROCESS / X</span></div>
    </div>
  </section>;
}
