"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const nikeVideoSource: string | null = null;

const designProjects = [
  { index: "02", name: "CHRONIQUE", category: "WATCH SHOPPING APPLICATION CONCEPT", copy: "A premium commerce concept that places product character, material detail, and calm navigation at the center of the experience.", image: "/imgs/walletUIUX.png", accent: "#d9a27f", layout: "watch" },
  { index: "03", name: "CRIMSON WALLET", category: "CRYPTOCURRENCY WALLET CONCEPT", copy: "A focused wallet interface exploring balance visibility, transaction history, and confident financial navigation.", image: "/imgs/cryptoUIUX.png", accent: "#ff5b3d", layout: "crypto" },
  { index: "04", name: "CARLUX", category: "LUXURY AUTOMOTIVE BROWSING CONCEPT", copy: "An editorial automotive interface designed around cinematic product imagery and a restrained path through performance and detail.", image: "/imgs/carUIUX.png", accent: "#d7a36d", layout: "car" },
];

export default function DesignExhibition() {
  const root = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const context = gsap.context(() => {
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.fromTo(".beyond-code-title span", { yPercent: 110 }, { yPercent: 0, stagger: .08, ease: "power3.out", scrollTrigger: { trigger: ".beyond-code", start: "top 72%", end: "top 30%", scrub: 1 } });
      gsap.utils.toArray<HTMLElement>("[data-design-project]").forEach((project) => {
        gsap.fromTo(project.querySelector(".design-project-copy"), { y: 54, opacity: 0 }, { y: 0, opacity: 1, ease: "power3.out", scrollTrigger: { trigger: project, start: "top 78%", end: "top 46%", scrub: 1 } });
        gsap.fromTo(project.querySelector(".design-project-media"), { yPercent: 8, scale: .95 }, { yPercent: -3, scale: 1, ease: "none", scrollTrigger: { trigger: project, start: "top bottom", end: "bottom top", scrub: 1.15 } });
      });
    }, root);
    return () => context.revert();
  }, []);

  useEffect(() => {
    if (!video.current || !nikeVideoSource) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !reduced) video.current?.play().catch(() => setPlaying(false));
      else video.current?.pause();
    }, { threshold: .55 });
    observer.observe(video.current);
    return () => observer.disconnect();
  }, []);

  const toggleVideo = () => {
    if (!video.current) return;
    if (video.current.paused) video.current.play().catch(() => setPlaying(false));
    else video.current.pause();
  };

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
          {nikeVideoSource ? (
            <video ref={video} src={nikeVideoSource} muted loop playsInline preload="none" onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)}>Your browser does not support embedded video.</video>
          ) : (
            <div className="nike-video-placeholder" role="img" aria-label="Nike concept video asset pending">
              <span>NIKE / MOTION CONCEPT</span><b>MP4</b><p>ORIGINAL VIDEO ASSET PENDING</p>
            </div>
          )}
          <div className="nike-frame-corners" aria-hidden="true"><i/><i/><i/><i/></div>
        </div>
        <div className="nike-stage-copy"><div><p>PRODUCT INTERFACE / RECORDED MOTION</p><h3 id="nike-title">NIKE<br/><span>CONCEPT.</span></h3></div><p>The exhibition stage is prepared for the original animation. No substitute interaction or recreated design is being presented.</p></div>
        <button className="nike-video-control" type="button" onClick={toggleVideo} disabled={!nikeVideoSource} aria-label={nikeVideoSource ? (playing ? "Pause Nike concept video" : "Play Nike concept video") : "Nike video unavailable"}>{nikeVideoSource ? (playing ? "PAUSE" : "PLAY / REPLAY") : "VIDEO PENDING"}<span>{nikeVideoSource ? "▶" : "—"}</span></button>
      </article>

      <div className="design-projects">
        {designProjects.map((project) => (
          <article key={project.name} className={`design-project design-project--${project.layout}`} data-design-project style={{ "--design-accent": project.accent } as React.CSSProperties}>
            <div className="design-project-copy"><p>{project.index} / {project.category}</p><h3>{project.name}</h3><span>{project.copy}</span><small>ORIGINAL MOCKUP ASSET</small></div>
            <figure className="design-project-media"><div className="design-media-light" aria-hidden="true"/><Image src={project.image} alt={`${project.name} interface concept mockups`} fill sizes="(max-width: 800px) 92vw, 52vw" className="design-project-image"/></figure>
            <div className="design-project-number" aria-hidden="true">{project.index}</div>
          </article>
        ))}
      </div>
    </section>
  );
}
