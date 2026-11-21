"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CircleCheck, Database, Monitor, Rocket, Server, Smartphone } from "lucide-react";
import { expertiseCategories } from "../data/skills";

const expertiseIcons = [Smartphone, Monitor, Server, Database] as const;
const expertiseDuration = 5000;
const journeyDuration = 5000;

const journeyStages = [
  { index:"01", name:"DISCOVER", description:"Define needs and user flows.", visual:"discover" },
  { index:"02", name:"ARCHITECT", description:"Connect systems and data.", visual:"architect" },
  { index:"03", name:"BUILD", description:"Implement, integrate, test.", visual:"build" },
  { index:"04", name:"LAUNCH", description:"Release the product live.", visual:"launch" },
] as const;

function JourneyVisual({ type }: { type: typeof journeyStages[number]["visual"] }) {
  if (type === "discover") return <div className="journey-scene simple-discover" aria-hidden="true">
    <section><header><i /><strong>PRODUCT BRIEF</strong><span>01</span></header><p><b>✓</b>Understand user needs</p><p><b>✓</b>Define core requirements</p><p><b>✓</b>Shape product scope</p></section>
  </div>;

  if (type === "architect") return <div className="journey-scene simple-architect" aria-hidden="true">
    <div><section><Smartphone /><strong>APP</strong></section><i>→</i><section><Server /><strong>API</strong></section><i>→</i><section><Database /><strong>DATABASE</strong></section><b /></div>
  </div>;

  if (type === "build") return <div className="journey-scene simple-build" aria-hidden="true">
    <section><header><i /><i /><i /><strong>app.tsx</strong></header><code><em>const</em> app = build()</code><code><em>await</em> api.connect()</code><code><em>return</em> &lt;App /&gt;</code></section>
    <i>→</i>
    <section><header>PREVIEW <b>●</b></header><div><strong /><span /><span /><button>READY</button></div></section>
  </div>;

  return <div className="journey-scene simple-launch" aria-hidden="true">
    <div className="launch-orbit"><Rocket /><i /><i /></div>
    <section><CircleCheck /><strong>DEPLOYED</strong><span><i /> LIVE</span></section>
    <footer><span>BUILD</span><i /><span>VERIFY</span><i /><span>RELEASE</span></footer>
  </div>;
}

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const journeyCard = useRef<HTMLElement>(null);
  const resetJourneyTimer = useRef<() => void>(() => undefined);
  const expertiseCard = useRef<HTMLElement>(null);
  const resetExpertiseTimer = useRef<() => void>(() => undefined);
  const [journeyIndex, setJourneyIndex] = useState(0);
  const [journeyCycle, setJourneyCycle] = useState(0);
  const [expertiseIndex, setExpertiseIndex] = useState(0);
  const [expertiseCycle, setExpertiseCycle] = useState(0);

  useEffect(() => {
    const card = journeyCard.current;
    if (!card || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let intersecting = true;
    let hovered = false;
    let remaining = journeyDuration;
    let startedAt = 0;
    let timer = 0;
    const canRun = () => intersecting && !hovered && document.visibilityState === "visible";
    const clear = () => {
      if (!timer) return;
      window.clearTimeout(timer);
      timer = 0;
      remaining = Math.max(80, remaining - (performance.now() - startedAt));
    };
    const schedule = () => {
      if (!canRun() || timer) return;
      card.classList.remove("journey-paused");
      startedAt = performance.now();
      timer = window.setTimeout(() => {
        timer = 0;
        remaining = journeyDuration;
        setJourneyIndex((current) => (current + 1) % journeyStages.length);
        setJourneyCycle((current) => current + 1);
        schedule();
      }, remaining);
    };
    const sync = () => {
      if (canRun()) schedule();
      else { clear(); card.classList.add("journey-paused"); }
    };
    const restart = () => { clear(); remaining = journeyDuration; sync(); };
    const enter = (event: PointerEvent) => { if (event.pointerType !== "touch") { hovered = true; sync(); } };
    const leave = (event: PointerEvent) => { if (event.pointerType !== "touch") { hovered = false; sync(); } };
    const observer = new IntersectionObserver(([entry]) => { intersecting = entry.isIntersecting; sync(); }, { threshold: .18 });
    resetJourneyTimer.current = restart;
    observer.observe(card);
    card.addEventListener("pointerenter", enter);
    card.addEventListener("pointerleave", leave);
    document.addEventListener("visibilitychange", sync);
    sync();
    return () => {
      clear();
      observer.disconnect();
      card.removeEventListener("pointerenter", enter);
      card.removeEventListener("pointerleave", leave);
      document.removeEventListener("visibilitychange", sync);
      card.classList.remove("journey-paused");
      resetJourneyTimer.current = () => undefined;
    };
  }, []);

  useEffect(() => {
    const card = expertiseCard.current;
    if (!card || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let isVisible = true;
    let isHovered = false;
    let remaining = expertiseDuration;
    let startedAt = 0;
    let timer = 0;
    const canRun = () => isVisible && !isHovered && document.visibilityState === "visible";
    const stop = () => {
      if (!timer) return;
      window.clearTimeout(timer);
      timer = 0;
      remaining = Math.max(80, remaining - (performance.now() - startedAt));
    };
    const schedule = () => {
      if (!canRun() || timer) return;
      card.classList.remove("expertise-paused");
      startedAt = performance.now();
      timer = window.setTimeout(() => {
        timer = 0;
        remaining = expertiseDuration;
        setExpertiseIndex((current) => (current + 1) % expertiseCategories.length);
        setExpertiseCycle((current) => current + 1);
        schedule();
      }, remaining);
    };
    const sync = () => {
      if (canRun()) schedule();
      else {
        stop();
        card.classList.add("expertise-paused");
      }
    };
    const restart = () => {
      stop();
      remaining = expertiseDuration;
      sync();
    };
    const enter = (event: PointerEvent) => { if (event.pointerType !== "touch") { isHovered = true; sync(); } };
    const leave = (event: PointerEvent) => { if (event.pointerType !== "touch") { isHovered = false; sync(); } };
    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      sync();
    }, { threshold: .12 });

    resetExpertiseTimer.current = restart;
    observer.observe(card);
    card.addEventListener("pointerenter", enter);
    card.addEventListener("pointerleave", leave);
    document.addEventListener("visibilitychange", sync);
    sync();

    return () => {
      stop();
      observer.disconnect();
      card.removeEventListener("pointerenter", enter);
      card.removeEventListener("pointerleave", leave);
      document.removeEventListener("visibilitychange", sync);
      card.classList.remove("expertise-paused");
      resetExpertiseTimer.current = () => undefined;
    };
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const context = gsap.context(() => {
      if (reduce) return;
      const playIntro = () => {
        const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
        intro
          .from("[data-intro='chrome']", { opacity: 0, y: -12, duration: .6, stagger: .08 })
          .from("[data-intro='title']", { yPercent: 105, duration: 1.05, stagger: .09 }, "-=.22")
          .from("[data-intro='portrait']", { yPercent: 12, opacity: 0, scale: .96, duration: 1.15 }, "-=.85")
          .from("[data-intro='panel']", { opacity: 0, y: 24, duration: .72, stagger: .12 }, "-=.55");
      };
      if (document.getElementById("site-preloader")) window.addEventListener("portfolio:ready", playIntro, { once: true });
      else playIntro();

      gsap.timeline({
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: .7 },
      })
        .to("[data-layer='back']", { yPercent: 18, opacity: .15 }, 0)
        .to("[data-layer='title']", { yPercent: -8, opacity: .3 }, 0)
        .to("[data-intro='portrait']", { yPercent: 8, scale: 1.035 }, 0)
        .to("[data-intro='panel']", { yPercent: -10, opacity: 0 }, 0);

      const move = (event: PointerEvent) => {
        if (event.pointerType === "touch") return;
        const x = (event.clientX / innerWidth - .5) * 2;
        const y = (event.clientY / innerHeight - .5) * 2;
        gsap.to("[data-parallax='portrait']", { x: x * 9, y: y * 5, duration: .8, ease: "power2.out" });
        gsap.to("[data-parallax='ui']", { x: x * -7, y: y * -4, duration: .9, ease: "power2.out" });
      };
      window.addEventListener("pointermove", move);
      return () => { window.removeEventListener("pointermove", move); window.removeEventListener("portfolio:ready", playIntro); };
    }, root);
    return () => context.revert();
  }, []);

  return (
    <section ref={root} id="home" className="hero" aria-labelledby="hero-title">
      <div className="hero-grid" aria-hidden="true" />
      <div className="orb" aria-hidden="true" />
      <header className="topbar">
        <a className="hero-status" href="#contact" data-intro="chrome"><i /><span>OPEN TO OPPORTUNITIES</span><small>ZAID / 01</small></a>
        <div className="role" data-intro="chrome">PRODUCT ENGINEERING / 2026</div>
      </header>

      <div className="back-word" data-layer="back" aria-hidden="true">ENGINEER</div>
      <div className="name-lockup" id="hero-title">
        <div className="title-mask" data-layer="title"><h1 data-intro="title">ZAID SALAH</h1></div>
        <div className="hero-manifesto" aria-label="Full-stack developer">
          <span data-text="FULL-STACK">FULL-STACK</span>
          <span data-text="DEVELOPER.">DEVELOPER.</span>
        </div>
      </div>

      <div className="portrait-wrap" data-intro="portrait" data-parallax="portrait">
        <Image
          className="portrait-image"
          src="/zaid-portrait.png"
          alt="Zaid wearing a light gray suit"
          fill
          priority
          sizes="(max-width: 800px) 90vw, 43vw"
          data-critical-asset="hero-portrait"
        />
      </div>

      <aside ref={journeyCard} className="telemetry panel" data-intro="panel" data-parallax="ui">
        <div className="panel-label">BUILD JOURNEY / AUTO <span>{String(journeyIndex + 1).padStart(2, "0")} / 04</span></div>
        <div className="journey-stages">
          {journeyStages.map((stage, index) => <article className={`journey-stage${journeyIndex === index ? " is-active" : ""}`} aria-hidden={journeyIndex !== index} key={stage.name}>
            <JourneyVisual type={stage.visual} />
            <div className="journey-stage-copy"><strong>{stage.index} / {stage.name}</strong><small>{stage.description}</small></div>
          </article>)}
        </div>
        <div className="journey-progress" role="tablist" aria-label="Product build stages">{journeyStages.map((stage, index) => {
          const active = journeyIndex === index;
          const select = () => {
            setJourneyIndex(index);
            setJourneyCycle((current) => current + 1);
            resetJourneyTimer.current();
          };
          return <button type="button" role="tab" aria-selected={active} aria-label={`Show ${stage.name.toLowerCase()} stage`} tabIndex={active ? 0 : -1} className={active ? "is-active" : ""} onClick={select} onKeyDown={(event) => {
            const keys = ["ArrowLeft", "ArrowRight", "Home", "End"];
            if (!keys.includes(event.key)) return;
            event.preventDefault();
            const next = event.key === "Home" ? 0 : event.key === "End" ? journeyStages.length - 1 : (index + (event.key === "ArrowRight" ? 1 : -1) + journeyStages.length) % journeyStages.length;
            setJourneyIndex(next);
            setJourneyCycle((current) => current + 1);
            resetJourneyTimer.current();
            event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>("button")[next]?.focus();
          }} key={stage.name}><span>{stage.index}</span><i>{active && <b key={journeyCycle} />}</i></button>;
        })}</div>
      </aside>

      <aside ref={expertiseCard} className="capabilities panel" data-intro="panel" data-parallax="ui">
        <div className="panel-label">EXPERTISE / 04 <span>{String(expertiseIndex + 1).padStart(2, "0")} / 04</span></div>
        <div className="expertise-content" id="hero-expertise-panel" role="tabpanel" aria-label={`${expertiseCategories[expertiseIndex].label} technologies`} key={`${expertiseCategories[expertiseIndex].id}-${expertiseCycle}`}>
          <strong>{expertiseCategories[expertiseIndex].label}</strong>
          <div>{expertiseCategories[expertiseIndex].technologies.map((technology) => <span className="expertise-skill" key={technology}>{technology}</span>)}</div>
        </div>
        <div className="expertise-scenes" role="tablist" aria-label="Expertise scenes">{expertiseCategories.map((category, index) => {
          const Icon = expertiseIcons[index];
          const active = expertiseIndex === index;
          const select = () => {
            setExpertiseIndex(index);
            setExpertiseCycle((current) => current + 1);
            resetExpertiseTimer.current();
          };
          return <button
            type="button"
            role="tab"
            aria-selected={active}
            aria-controls="hero-expertise-panel"
            tabIndex={active ? 0 : -1}
            className={active ? "is-active" : ""}
            onClick={select}
            onKeyDown={(event) => {
              const keys = ["ArrowLeft", "ArrowRight", "Home", "End"];
              if (!keys.includes(event.key)) return;
              event.preventDefault();
              const next = event.key === "Home" ? 0 : event.key === "End" ? expertiseCategories.length - 1 : (index + (event.key === "ArrowRight" ? 1 : -1) + expertiseCategories.length) % expertiseCategories.length;
              const buttons = event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>("button");
              setExpertiseIndex(next);
              setExpertiseCycle((current) => current + 1);
              resetExpertiseTimer.current();
              buttons?.[next]?.focus();
            }}
            key={category.id}
          ><span><Icon aria-hidden="true" /><b>{category.short}</b></span><i aria-hidden="true">{active && <em key={expertiseCycle} />}</i></button>;
        })}</div>
      </aside>

      <a className="cta" href="#hero-end" data-intro="panel">EXPLORE SELECTED WORK <span>↘</span></a>
      <div className="side-index" aria-hidden="true">00<br /><span>—</span><br />01</div>
      <div className="scroll-cue" data-intro="chrome"><span>SCROLL TO INITIATE</span><i /></div>

    </section>
  );
}
