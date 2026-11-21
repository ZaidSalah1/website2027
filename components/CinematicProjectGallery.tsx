"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { visibleSoftwareProjects } from "../data/softwareProjects";
import { useProjectDetails } from "./ProjectDetailsProvider";
import GlitchProjectImage, { preloadProjectImage } from "./GlitchProjectImage";

export default function CinematicProjectGallery() {
  const { openProject } = useProjectDetails();
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const [loadedMedia, setLoadedMedia] = useState(() => new Set([0]));

  useEffect(() => {
    if (!root.current) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      void preloadProjectImage(visibleSoftwareProjects[0].heroMedia.images[0], "(max-width: 800px) 92vw, 58vw").then(() => {
        if (!visibleSoftwareProjects[1]) return;
        setLoadedMedia((current) => new Set(current).add(1));
        return preloadProjectImage(visibleSoftwareProjects[1].heroMedia.images[0], "(max-width: 800px) 92vw, 58vw");
      });
      observer.disconnect();
    }, { rootMargin: "160% 0px" });
    observer.observe(root.current);
    return () => observer.disconnect();
  }, []);

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
            onUpdate: (self) => {
              stage.current?.style.setProperty("--cinema-progress", `${self.progress}`);
              const position = self.progress * (panels.length - 1);
              const activeIndex = Math.min(panels.length - 1, Math.round(position));
              panels.forEach((panel, panelIndex) => panel.dataset.projectActive = panelIndex === activeIndex ? "true" : "false");
              const nextIndex = Math.min(panels.length - 1, Math.ceil(position + .55));
              setLoadedMedia((current) => current.has(nextIndex) ? current : new Set(current).add(nextIndex));
              void preloadProjectImage(visibleSoftwareProjects[nextIndex].heroMedia.images[0], "(max-width: 800px) 92vw, 58vw");
            },
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
          panels.forEach((panel) => panel.removeAttribute("data-project-active"));
          timeline.scrollTrigger?.kill();
        };
      });
      return () => media.revert();
    }, root);
    return () => context.revert();
  }, []);

  return (
    <section ref={root} id="cinema-gallery" className="cinema-gallery" aria-labelledby="cinema-gallery-title">
      <h2 id="cinema-gallery-title" className="sr-only">Cinematic software project gallery</h2>
      <div ref={stage} className="cinema-gallery-stage">
          <div className="cinema-gallery-progress" aria-hidden="true"><span>01</span><i><b /></i><span>{String(visibleSoftwareProjects.length).padStart(2, "0")}</span></div>
          {visibleSoftwareProjects.map((project, index) => (
            <article
              key={project.id}
              className={`cinema-project cinema-project--${project.id}`}
              data-cinema-project
              data-project-active={index === 0 ? "true" : "false"}
              style={{ "--project-accent": project.accent, "--project-ambient": project.ambient, zIndex: index + 1 } as React.CSSProperties}
            >
              <div className="cinema-project-chrome" aria-hidden="true"><span>PROJECT / {String(index + 1).padStart(2, "0")}</span><i/><span>{project.temporary ? "DEVELOPMENT PREVIEW" : "PUBLISHED"}</span></div>
              <div className="cinema-project-copy">
                <p>{project.category}<small>{project.name}</small></p>
                <h3>{project.displayTitle}</h3>
                <div className="cinema-project-description"><span>{String(index + 1).padStart(2, "0")}</span><p>{project.description}</p></div>
                <div className="cinema-project-tags">{project.technologies.map((tag) => <span key={tag}>{tag}</span>)}</div>
                <button className="cinema-project-explore" type="button" onClick={(event) => openProject(project.id, event.currentTarget)}>EXPLORE PROJECT <span>↗</span></button>
              </div>
              <figure className="cinema-project-media">
                <div className="cinema-project-orbit" aria-hidden="true" />
                <GlitchProjectImage media={project.heroMedia} alt={`${project.displayTitle} project artwork`} sizes="(max-width: 800px) 92vw, 58vw" className="cinema-project-image" enabled={loadedMedia.has(index)} />
                {project.temporary && <figcaption>TEMPORARY LABEL / ORIGINAL ASSET</figcaption>}
              </figure>
              <div className="cinema-project-index" aria-hidden="true">{String(index + 1).padStart(2, "0")}</div>
            </article>
          ))}
      </div>
    </section>
  );
}
