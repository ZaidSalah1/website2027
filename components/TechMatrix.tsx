"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const skills = [
  ["RE", "React", "INTERFACE SYSTEMS"], ["RN", "React Native", "CROSS-PLATFORM MOBILE"],
  ["TS", "TypeScript", "TYPED APPLICATIONS"], ["NO", "Node.js", "SERVER RUNTIMES"],
  ["NX", "Next.js", "FULL-STACK WEB"], ["EX", "Expo", "MOBILE DELIVERY"],
  ["MO", "MongoDB", "DOCUMENT DATA"], ["PG", "PostgreSQL", "RELATIONAL DATA"],
  ["PR", "Prisma", "DATA TOOLING"], ["FB", "Firebase", "AUTH & REAL-TIME"],
  ["DO", "Docker", "CONTAINER WORKFLOWS"], ["GS", "GSAP", "MOTION SYSTEMS"],
  ["TW", "Tailwind CSS", "DESIGN SYSTEMS"], ["GI", "Git / GitHub", "VERSION CONTROL"],
];

function SkillCard({ code, name, use, index }: { code: string; name: string; use: string; index: number }) {
  return (
    <article className="skill-card" tabIndex={0} data-skill-card>
      <div className="skill-card-top"><span className="skill-icon">{code}</span><small>SYS.{String(index + 1).padStart(2, "0")}</small></div>
      <div><h3>{name}</h3><p>{use}</p></div>
      <div className="skill-signal"><span>SYSTEM / READY</span><i /></div>
    </article>
  );
}

export default function TechMatrix() {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const context = gsap.context(() => {
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.from("[data-skill-card]", {
        y: 42, opacity: 0, stagger: 0.055, duration: 0.7, ease: "power3.out",
        scrollTrigger: { id: "tech-matrix-reveal", trigger: ".tech-grid", start: "top 82%", once: true },
      });
    }, root);
    return () => context.revert();
  }, []);

  return (
    <section ref={root} id="skills" className="tech-matrix" aria-labelledby="tech-heading">
      <div className="tech-heading">
        <p>04 / SYSTEM ARCHITECTURE</p>
        <h2 id="tech-heading">TECH <span>MATRIX</span></h2>
        <div><p>Technologies selected to build clear, reliable products across web, mobile, and backend systems.</p><small>FOCUS EACH MODULE TO INSPECT</small></div>
      </div>
      <div className="tech-grid">{skills.map(([code, name, use], index) => <SkillCard code={code} name={name} use={use} index={index} key={name} />)}</div>
      <div className="phase-stop"><span>PHASE 3 / COMPLETE</span><p>Journey and Contact intentionally held for approval.</p></div>
    </section>
  );
}
