"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import MobileCarouselControls from "./MobileCarouselControls";

type Chapter = { index: string; eyebrow: string; title: string; copy: string; scene: "idea" | "experience" | "engine" | "launch" };

const chapters: Chapter[] = [
  { index: "01", eyebrow: "DISCOVER / DEFINE", title: "THE IDEA", copy: "Start with the real problem. Strip away assumptions. Shape a practical path from need to useful software.", scene: "idea" },
  { index: "02", eyebrow: "DESIGN / INTERACT", title: "THE EXPERIENCE", copy: "Turn intent into an interface that feels clear, responsive, and natural across web and mobile.", scene: "experience" },
  { index: "03", eyebrow: "CONNECT / ORCHESTRATE", title: "THE ENGINE", copy: "Build the systems beneath the surface—data, APIs, identity, integrations, and real-time movement.", scene: "engine" },
  { index: "04", eyebrow: "VERIFY / RELEASE", title: "THE LAUNCH", copy: "Bring every layer together, verify the product, and move it from development into the hands of real users.", scene: "launch" },
];

function IdeaScene() {
  return <div className="build-scene idea-scene" aria-hidden="true">
    <div className="idea-sheet sheet-a"><span>PROBLEM / 01</span><i /><i /><i /><b>?</b></div>
    <div className="idea-sheet sheet-b"><span>FLOW / 02</span><div className="sketch-flow"><i /><em /><i /></div></div>
    <div className="idea-sheet sheet-c"><span>SOLUTION / 03</span><div className="sketch-ui"><i /><i /><i /></div></div>
    <svg className="idea-connectors" viewBox="0 0 800 560"><path d="M90 160 C280 40 350 350 710 140"/><path d="M80 410 C310 510 460 210 730 440"/></svg>
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
  const nodes = [["CLIENT","12%","43%"],["API","39%","20%"],["AUTH","40%","67%"],["DATA","70%","25%"],["EVENTS","73%","66%"],["INTEGRATION","88%","45%"]];
  return <div className="build-scene engine-scene" aria-hidden="true">
    <svg className="engine-lines" viewBox="0 0 1000 600"><path d="M120 260 L390 130 L700 150 L880 270"/><path d="M120 260 L400 400 L730 395 L880 270"/><path d="M390 130 L400 400"/><circle className="data-pulse pulse-a" r="5"/><circle className="data-pulse pulse-b" r="5"/></svg>
    {nodes.map(([name,left,top],i)=><div className={`engine-node node-${i}`} style={{left,top}} key={name}><small>0{i+1}</small><strong>{name}</strong><span>{i===0?"REQUEST":i===5?"RESPONSE":"CONNECTED"}</span></div>)}
    <div className="engine-status"><i/> SYSTEM FLOW / ACTIVE</div>
  </div>;
}

function LaunchScene() {
  return <div className="build-scene launch-scene" aria-hidden="true">
    <div className="launch-rings"><i/><i/><i/><span>LIVE</span></div>
    <div className="launch-terminal"><div><i/><i/><i/><span>RELEASE PIPELINE</span></div><p><b>01</b> BUILD <em>COMPLETE</em></p><p><b>02</b> VERIFY <em>COMPLETE</em></p><p><b>03</b> RELEASE <em>LIVE</em></p></div>
    <div className="launch-signal"><span>PRODUCT STATUS</span><strong>DEPLOYED</strong><i/></div>
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
    const context = gsap.context(() => {
      const media = gsap.matchMedia();
      media.add("(min-width: 901px) and (prefers-reduced-motion: no-preference)", () => {
        const distance = () => Math.max(0,(track.current?.scrollWidth ?? 0)-innerWidth); const travelShare=.9;
        const timeline=gsap.timeline({ defaults:{ease:"none"}, scrollTrigger:{ id:"behind-build-horizontal", trigger:stage.current, start:"top top", end:()=>`+=${distance()/travelShare}`, pin:true, pinSpacing:true, scrub:1.05, anticipatePin:1, invalidateOnRefresh:true, onUpdate:self=>root.current?.style.setProperty("--build-progress",`${self.progress}`) }});
        timeline.fromTo(".build-stage-chrome,.build-stage-footer",{opacity:.3},{opacity:1,duration:.05,ease:"power1.out"})
          .fromTo(".build-chapter:first-child .build-copy,.build-chapter:first-child .build-visual",{scale:.987},{scale:1,duration:.05,ease:"power1.out"},0)
          .to(track.current,{x:()=>-distance(),duration:travelShare},.05)
          .to(".build-chapter:last-child .build-copy,.build-chapter:last-child .build-visual",{y:-8,duration:.05,ease:"power1.inOut"},.95)
          .to(".build-stage-chrome,.build-stage-footer",{opacity:.38,duration:.05},.95);
        gsap.utils.toArray<HTMLElement>(".build-chapter").forEach(panel=>{
          gsap.fromTo(panel.querySelectorAll("[data-build-reveal]"),{y:40,opacity:.2},{y:0,opacity:1,stagger:.06,ease:"power2.out",scrollTrigger:{trigger:panel,containerAnimation:timeline,start:"left 80%",end:"left 48%",scrub:true}});
          const front=panel.querySelectorAll("[data-build-depth='front']"); const back=panel.querySelectorAll("[data-build-depth='back']");
          if(front.length) gsap.fromTo(front,{x:45},{x:-25,scrollTrigger:{trigger:panel,containerAnimation:timeline,start:"left right",end:"right left",scrub:true}});
          if(back.length) gsap.fromTo(back,{x:-25},{x:20,scrollTrigger:{trigger:panel,containerAnimation:timeline,start:"left right",end:"right left",scrub:true}});
        });
        return()=>root.current?.style.removeProperty("--build-progress");
      }); return()=>media.revert();
    },root); return()=>context.revert();
  },[]);

  return <section ref={root} id="behind-build" className="behind-build" aria-labelledby="build-heading">
    <div className="build-prelude"><div><p>05 / PROCESS</p><span>SECOND HORIZONTAL CHAPTER</span></div><h2 id="build-heading">BEHIND<br/><em>THE BUILD.</em></h2><p>Four connected stages. One end-to-end mindset—from the first question to a product people can use.</p><div className="build-axis">VERTICAL <span>↓</span> HORIZONTAL <span>→</span></div></div>
    <div ref={stage} className="build-stage">
      <div className="build-stage-chrome" aria-hidden="true"><span>BEHIND THE BUILD / 04</span><span className="build-progress"><i/></span><span>IDEA → LAUNCH</span></div>
      <MobileCarouselControls trackRef={track} count={chapters.length} label="chapter" itemSelector=".build-chapter" />
      <div ref={track} className="build-track" role="region" aria-label="Behind the Build chapters. Swipe horizontally or use left and right arrow keys." tabIndex={0}>{chapters.map(chapter=><BuildChapter chapter={chapter} key={chapter.index}/>)}</div>
      <div className="build-stage-footer" aria-hidden="true"><span>USE VERTICAL SCROLL</span><b>→</b><span>PROCESS / X</span></div>
    </div>
    <div className="build-review-stop"><p>END-TO-END / COMPLETE</p><h2>FROM IDEA<br/><span>TO IMPACT.</span></h2><small>NEXT / LET&apos;S CONNECT</small></div>
  </section>;
}
