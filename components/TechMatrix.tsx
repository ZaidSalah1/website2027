"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { skillGroups, skills } from "../data/skills";

function SkillCard({ code, name, use, index }: { code: string; name: string; use: string; index: number }) {
  return (
    <article className="skill-card" tabIndex={0} data-skill-card>
      <div className="skill-card-top"><span className="skill-icon">{code}</span><small>SYS.{String(index + 1).padStart(2, "0")}</small></div>
      <div><h3>{name}</h3><p>{use}</p></div>
      <div className="skill-signal"><span>SYSTEM / READY</span><i /></div>
    </article>
  );
}

function CompactSkillGroups() {
  return <div className="tech-compact" aria-label="Technology groups">
    {skillGroups.map((group, groupIndex) => <section className="tech-compact-group" data-compact-skill-group key={group}>
      <div className="tech-compact-title"><span>0{groupIndex + 1}</span><h3>{group}</h3></div>
      <div className="tech-compact-items">
        {skills.filter((skill) => skill.group === group).map((skill) => {
          const Icon = skill.icon;
          return <div className="tech-compact-item" key={skill.name} tabIndex={0} title={skill.use}>
            <Icon aria-hidden="true" />
            <span>{skill.name}</span>
          </div>;
        })}
      </div>
    </section>)}
  </div>;
}

export default function TechMatrix() {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const context = gsap.context(() => {
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const media = gsap.matchMedia();
      media.add("(min-width: 1025px)", () => gsap.from("[data-skill-card]", {
          y: 42, opacity: 0, stagger: 0.055, duration: 0.7, ease: "power3.out",
          scrollTrigger: { id: "tech-matrix-reveal", trigger: ".tech-grid", start: "top 82%", once: true },
        }));
      media.add("(max-width: 1024px)", () => gsap.from("[data-compact-skill-group]", {
          y: 24, opacity: 0, stagger: 0.09, duration: 0.55, ease: "power2.out",
          scrollTrigger: { id: "tech-compact-reveal", trigger: ".tech-compact", start: "top 86%", once: true },
        }));
      return () => media.revert();
    }, root);
    return () => context.revert();
  }, []);

  return (
    <section ref={root} id="skills" className="tech-matrix" aria-labelledby="tech-heading">
      <div className="tech-heading">
        <p>05 / SYSTEM ARCHITECTURE</p>
        <h2 id="tech-heading">TECH <span>MATRIX</span></h2>
        <div><p>Technologies selected to build clear, reliable products across web, mobile, and backend systems.</p><small>FOCUS EACH MODULE TO INSPECT</small></div>
      </div>
      <div className="tech-grid">{skills.map(({ code, name, use }, index) => <SkillCard code={code} name={name} use={use} index={index} key={name} />)}</div>
      <CompactSkillGroups />
      <div className="phase-stop"><span>PHASE 5 / COMPLETE</span><p>Product systems, selected with intent.</p></div>
    </section>
  );
}
