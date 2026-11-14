"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const Signal = ({ label, value }: { label: string; value: string }) => (
  <div className="signal-row"><span>{label}</span><i aria-hidden="true" /><b>{value}</b></div>
);

export default function Hero() {
  const root = useRef<HTMLElement>(null);

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
        <a className="monogram" href="#" aria-label="Zaid, home" data-intro="chrome">Z<span>/</span></a>
        <div className="availability" data-intro="chrome"><i /> AVAILABLE FOR SELECT PROJECTS</div>
        <div className="role" data-intro="chrome">FULL-STACK PRODUCT ENGINEER<br /><span>PALESTINE / REMOTE</span></div>
      </header>

      <div className="back-word" data-layer="back" aria-hidden="true">ENGINEER</div>
      <div className="name-lockup" id="hero-title">
        <div className="title-mask" data-layer="title"><h1 data-intro="title">ZAID SALAH</h1></div>
        <div className="hero-manifesto" aria-label="Engineering digital products">
          <span data-text="ENGINEERING">ENGINEERING</span>
          <span data-text="DIGITAL PRODUCTS">DIGITAL PRODUCTS</span>
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

      <aside className="telemetry panel" data-intro="panel" data-parallax="ui">
        <div className="panel-label">PRODUCT PATH / END-TO-END <span>••</span></div>
        <strong>FROM IDEA<br />TO DEPLOYMENT</strong>
        <p>Designing useful systems across mobile, web, and backend.</p>
        <div className="process-rail" aria-hidden="true"><i /><i /><i /></div>
      </aside>

      <aside className="capabilities panel" data-intro="panel" data-parallax="ui">
        <div className="panel-label">SPECIALTIES / 03 <em>↗</em></div>
        <Signal label="PRODUCT ENGINEERING" value="01" />
        <Signal label="MOBILE EXPERIENCES" value="02" />
        <Signal label="SCALABLE SYSTEMS" value="03" />
      </aside>

      <a className="cta" href="#hero-end" data-intro="panel">EXPLORE SELECTED WORK <span>↘</span></a>
      <div className="side-index" aria-hidden="true">00<br /><span>—</span><br />01</div>
      <div className="scroll-cue" data-intro="chrome"><span>SCROLL TO INITIATE</span><i /></div>

    </section>
  );
}
