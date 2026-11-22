"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Braces, Database, PanelsTopLeft, ServerCog } from "lucide-react";
import { skillGroups, skills, type SkillGroup } from "../data/skills";

const categoryMeta: Record<SkillGroup, { index: string; description: string; icon: typeof PanelsTopLeft }> = {
  "Frontend & Mobile": { index: "01", description: "Interfaces and cross-platform product experiences.", icon: PanelsTopLeft },
  "Backend & APIs": { index: "02", description: "Application services, authentication, and real-time systems.", icon: Braces },
  "Database & Services": { index: "03", description: "Persistent data, cloud services, and notification delivery.", icon: Database },
  "Tools & Infrastructure": { index: "04", description: "Source control, servers, and production operations.", icon: ServerCog },
};

function TechnologyCategory({ group }: { group: SkillGroup }) {
  const meta = categoryMeta[group];
  const CategoryIcon = meta.icon;
  const groupSkills = skills.filter((skill) => skill.group === group);

  return (
    <article className="matrix-category" data-matrix-category tabIndex={0}>
      <header className="matrix-category-head">
        <span className="matrix-category-icon" aria-hidden="true"><CategoryIcon /></span>
        <div><small>{meta.index} / CAPABILITY</small><h3>{group}</h3></div>
      </header>
      <p className="matrix-category-copy">{meta.description}</p>
      <div className="matrix-technologies" role="list" aria-label={`${group} technologies`}>
        {groupSkills.map((skill) => {
          const Icon = skill.icon;
          return (
            <div className="matrix-technology" role="listitem" key={skill.name} title={skill.use}>
              <span className="matrix-technology-logo" style={{ "--technology-color": skill.tone } as CSSProperties} aria-hidden="true"><Icon /></span>
              <span>{skill.name}</span>
            </div>
          );
        })}
      </div>
    </article>
  );
}

export default function TechMatrix() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const context = gsap.context(() => {
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.from("[data-matrix-category]", {
        y: 30,
        opacity: 0,
        stagger: 0.08,
        duration: 0.65,
        ease: "power3.out",
        scrollTrigger: { id: "tech-matrix-reveal", trigger: ".matrix-categories", start: "top 84%", once: true },
      });
    }, root);
    return () => context.revert();
  }, []);

  return (
    <section ref={root} id="skills" className="tech-matrix" aria-labelledby="tech-heading">
      <div className="tech-heading">
        <p>05 / SYSTEM ARCHITECTURE</p>
        <h2 id="tech-heading">TECH <span>MATRIX</span></h2>
        <div><p>Technologies selected to build clear, reliable products across web, mobile, backend, and production systems.</p><small>FOUR CONNECTED CAPABILITIES</small></div>
      </div>
      <div className="matrix-categories">{skillGroups.map((group) => <TechnologyCategory group={group} key={group} />)}</div>
      <div className="phase-stop"><span>PHASE 5 / COMPLETE</span><p>Product systems, selected with intent.</p></div>
    </section>
  );
}
