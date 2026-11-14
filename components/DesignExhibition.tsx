"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { preloadProjectImage } from "./GlitchProjectImage";

const nikeVideoSource = "/imgs/nike.mp4";

const designProjects = [
  { index: "02", name: "WATCH APP DESIGN", image: "/imgs/optimized/walletUIUX.webp", accent: "#d9a27f", layout: "watch" },
  { index: "03", name: "CRYPTO WALLET DESIGN", image: "/imgs/optimized/cryptoUIUX.webp", accent: "#ff5b3d", layout: "crypto" },
  { index: "04", name: "CAR APP DESIGN", image: "/imgs/optimized/carUIUX.webp", accent: "#d7a36d", layout: "car" },
];

export default function DesignExhibition() {
  const root = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [videoFailed, setVideoFailed] = useState(false);

  useEffect(() => {
    if (!root.current) return;
    let cancelled = false;
    const gallery = root.current.querySelector(".design-gallery-grid");
    if (!gallery) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      void (async () => {
        for (const project of designProjects) {
          if (cancelled) return;
          await preloadProjectImage(project.image, "(max-width: 800px) 92vw, 48vw");
        }
      })();
      observer.disconnect();
    }, { rootMargin: "120% 0px" });
    observer.observe(gallery);
    return () => { cancelled = true; observer.disconnect(); };
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const context = gsap.context(() => {
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.fromTo(".beyond-code-title span", { yPercent: 110 }, { yPercent: 0, stagger: .08, ease: "power3.out", scrollTrigger: { trigger: ".beyond-code", start: "top 72%", end: "top 30%", scrub: 1 } });
      gsap.fromTo(".nike-video-frame", { y: 44, opacity: 0, scale: .975 }, { y: 0, opacity: 1, scale: 1, ease: "power3.out", scrollTrigger: { trigger: ".nike-stage", start: "top 72%", end: "top 36%", scrub: .9 } });
      gsap.fromTo("[data-design-project]", { y: 48, opacity: 0, scale: .98 }, { y: 0, opacity: 1, scale: 1, stagger: .12, ease: "power3.out", scrollTrigger: { trigger: ".design-gallery-grid", start: "top 82%", end: "top 42%", scrub: .85 } });
      gsap.utils.toArray<HTMLElement>("[data-design-project]").forEach((project) => {
        gsap.fromTo(project.querySelector(".design-gallery-image"), { yPercent: 4, scale: 1.025 }, { yPercent: -3, scale: 1, ease: "none", scrollTrigger: { trigger: project, start: "top bottom", end: "bottom top", scrub: 1 } });
      });
    }, root);
    return () => context.revert();
  }, []);

  useEffect(() => {
    if (!video.current) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !reduced) video.current?.play().catch(() => setVideoFailed(true));
      else video.current?.pause();
    }, { threshold: .55 });
    observer.observe(video.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={root} id="design-exhibition" className="design-exhibition" aria-labelledby="beyond-code-title">
      <header className="beyond-code">
        <p>04 / INTERFACE STUDIES</p>
        <h2 className="beyond-code-title" id="beyond-code-title"><span>BEYOND</span><span>THE CODE.</span></h2>
        <div><span>UI / UX EXHIBITION</span><p>Exploring interfaces, interactions, and visual experiences.</p></div>
      </header>

      <article className="nike-stage" aria-labelledby="nike-title">
        <div className="nike-stage-head"><span>01 / FEATURED MOTION STUDY</span><span>VIDEO EXHIBITION</span></div>
        <div className="nike-video-frame">
          <video ref={video} src={nikeVideoSource} muted loop playsInline preload="metadata" aria-label="Nike interface animation concept" onError={() => setVideoFailed(true)}>Your browser does not support embedded video.</video>
          {videoFailed && <p className="nike-video-fallback" role="status">The Nike concept video could not be played in this browser.</p>}
        </div>
        <div className="nike-stage-copy"><div><p>01 / RECORDED MOTION CONCEPT</p><h3 id="nike-title">NIKE <span>INTERFACE.</span></h3></div><p>Original animation / autoplaying silently when visible.</p></div>
      </article>

      <div className="design-gallery-grid" aria-label="UI and UX design concepts">
        {designProjects.map((project) => (
          <article key={project.name} className={`design-gallery-item design-gallery-item--${project.layout}`} data-design-project style={{ "--design-accent": project.accent } as React.CSSProperties}>
            <header><span>{project.index}</span><h3>{project.name}</h3><small>UI / UX CONCEPT</small></header>
            <figure><div className="design-gallery-light" aria-hidden="true"/><Image src={project.image} alt={`${project.name} original interface mockups`} fill sizes="(max-width: 800px) 92vw, 48vw" className="design-gallery-image" loading="lazy" placeholder="empty" onLoad={(event) => event.currentTarget.classList.add("is-ready")}/></figure>
          </article>
        ))}
      </div>
    </section>
  );
}
