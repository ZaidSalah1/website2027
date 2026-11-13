"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { visibleSoftwareProjects } from "../data/softwareProjects";

export default function CinematicProjectGallery() {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const context = gsap.context(() => {
      const media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference)", () => {
        const panels = gsap.utils.toArray<HTMLElement>("[data-cinema-project]");
        if (panels.length < 2) return;
        gsap.set(panels.slice(1), { clipPath: "inset(100% 0 0 0)" });
        gsap.set(panels.slice(1).map((panel) => panel.querySelector(".cinema-project-copy")), { opacity: 0, y: 44 });
        gsap.set(panels.slice(1).map((panel) => panel.querySelector(".cinema-project-media")), { scale: 1.08, yPercent: 5 });
        const scrollPerProject = () => window.innerHeight * (window.innerWidth <= 900 ? .72 : .78);
        const timeline = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            id: "cinematic-project-gallery",
            trigger: stage.current,
            start: "top top",
            end: () => `+=${Math.max(1, panels.length - 1) * scrollPerProject()}`,
            pin: true,
            pinSpacing: true,
            scrub: .82,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => stage.current?.style.setProperty("--cinema-progress", `${self.progress}`),
          },
        });
        panels.slice(1).forEach((panel, index) => {
          const previous = panels[index];
          timeline
            .to(panel, { clipPath: "inset(0% 0 0 0)", duration: .7, ease: "power3.inOut" })
            .to(previous.querySelector(".cinema-project-media"), { scale: .91, opacity: .18, duration: .7, ease: "power2.inOut" }, "<")
            .to(previous.querySelector(".cinema-project-copy"), { opacity: 0, y: -28, duration: .26, ease: "power2.in" }, "<+.06")
            .to(panel.querySelector(".cinema-project-media"), { scale: 1, yPercent: 0, duration: .65, ease: "power3.out" }, "<+.05")
            .to(panel.querySelector(".cinema-project-copy"), { opacity: 1, y: 0, duration: .3, ease: "power2.out" }, "<+.22")
            .to({}, { duration: .18 });
        });
        return () => {
          stage.current?.style.removeProperty("--cinema-progress");
          timeline.scrollTrigger?.kill();
        };
      });
      return () => media.revert();
    }, root);
    return () => context.revert();
  }, []);

  return (
    <section ref={root} id="cinema-gallery" className="cinema-gallery" aria-labelledby="cinema-gallery-title">
      <header className="cinema-gallery-intro">
        <div><span>03 / SOFTWARE EXHIBITION</span><span>NATIVE VERTICAL STORY</span></div>
        <h2 id="cinema-gallery-title">SYSTEMS IN<br/><em>FOCUS.</em></h2>
        <p>One stage. A changing point of view. Existing product artwork is given room to lead while final case-study details remain deliberately unclaimed.</p>
      </header>
      <div ref={stage} className="cinema-gallery-stage">
          <div className="cinema-gallery-progress" aria-hidden="true"><span>01</span><i><b /></i><span>{String(visibleSoftwareProjects.length).padStart(2, "0")}</span></div>
          {visibleSoftwareProjects.map((project, index) => (
            <article
              key={project.id}
              className={`cinema-project cinema-project--${project.id}`}
              data-cinema-project
              style={{ "--project-accent": project.accent, "--project-ambient": project.ambient, zIndex: index + 1 } as React.CSSProperties}
            >
              <div className="cinema-project-chrome" aria-hidden="true"><span>PROJECT / {String(index + 1).padStart(2, "0")}</span><i/><span>{project.temporary ? "DEVELOPMENT PREVIEW" : "PUBLISHED"}</span></div>
              <div className="cinema-project-copy">
                <p>{project.category}<small>{project.name}</small></p>
                <h3>{project.displayTitle}</h3>
                <div className="cinema-project-description"><span>{String(index + 1).padStart(2, "0")}</span><p>{project.description}</p></div>
                <div className="cinema-project-tags">{project.technologies.map((tag) => <span key={tag}>{tag}</span>)}</div>
              </div>
              <figure className="cinema-project-media">
                <div className="cinema-project-orbit" aria-hidden="true" />
                <Image src={project.mainMedia} alt={`${project.name} temporary project artwork`} fill sizes="(max-width: 800px) 92vw, 58vw" className="cinema-project-image" />
                {project.temporary && <figcaption>TEMPORARY LABEL / ORIGINAL ASSET</figcaption>}
              </figure>
              <div className="cinema-project-index" aria-hidden="true">{String(index + 1).padStart(2, "0")}</div>
            </article>
          ))}
      </div>
    </section>
  );
}
