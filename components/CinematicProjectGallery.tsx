"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { visibleSoftwareProjects } from "../data/softwareProjects";

export default function CinematicProjectGallery() {
  const root = useRef<HTMLElement>(null);
  const story = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const context = gsap.context(() => {
      const media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference)", () => {
        const panels = gsap.utils.toArray<HTMLElement>("[data-cinema-project]");
        if (panels.length < 2) return;
        gsap.set(panels.slice(1), { clipPath: "inset(100% 0 0 0 round 2rem)" });
        gsap.set(panels.slice(1).map((panel) => panel.querySelector(".cinema-project-copy")), { opacity: 0, y: 44 });
        const timeline = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            id: "cinematic-project-gallery",
            trigger: story.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 1.05,
            invalidateOnRefresh: true,
          },
        });
        timeline.to({}, { duration: .28 });
        panels.slice(1).forEach((panel, index) => {
          const previous = panels[index];
          timeline
            .to(previous.querySelector(".cinema-project-copy"), { opacity: 0, y: -36, duration: .22, ease: "power2.in" })
            .fromTo(previous.querySelector(".cinema-project-media"), { scale: 1 }, { scale: .94, opacity: .34, duration: .35, ease: "power2.inOut" }, "<")
            .to(panel, { clipPath: "inset(0% 0 0 0 round 0rem)", duration: .48, ease: "power3.inOut" }, "-=.12")
            .fromTo(panel.querySelector(".cinema-project-media"), { scale: 1.09, yPercent: 4 }, { scale: 1, yPercent: 0, duration: .48, ease: "power3.out" }, "<")
            .to(panel.querySelector(".cinema-project-copy"), { opacity: 1, y: 0, duration: .3, ease: "power2.out" }, "-=.22")
            .to({}, { duration: .2 });
        });
        timeline.to({}, { duration: .22 });
        return () => timeline.scrollTrigger?.kill();
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
      <div ref={story} className="cinema-gallery-story" style={{ "--cinema-count": visibleSoftwareProjects.length } as React.CSSProperties}>
        <div className="cinema-gallery-stage">
          {visibleSoftwareProjects.map((project, index) => (
            <article
              key={project.id}
              className="cinema-project"
              data-cinema-project
              style={{ "--project-accent": project.accent, "--project-ambient": project.ambient, zIndex: index + 1 } as React.CSSProperties}
            >
              <div className="cinema-project-chrome" aria-hidden="true"><span>PROJECT / {String(index + 1).padStart(2, "0")}</span><i/><span>{project.temporary ? "DEVELOPMENT PREVIEW" : "PUBLISHED"}</span></div>
              <div className="cinema-project-copy">
                <p>{project.category}</p>
                <h3>{project.name}</h3>
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
      </div>
    </section>
  );
}
