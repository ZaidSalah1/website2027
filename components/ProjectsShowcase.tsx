"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useProjectDetails } from "./ProjectDetailsProvider";
import GlitchProjectImage from "./GlitchProjectImage";
import { projectHeroMedia, type ProjectHeroMedia } from "../data/projectHeroMedia";

type Project = { id?: string; index: string; name: string; type: string; statement: string; tags: string[]; tone: "acid" | "blue" | "mono"; ambient?: "drevr"; heroMedia?: ProjectHeroMedia };

const projects: Project[] = [
  { id: "seha-plus", index: "01", name: "SEHA PLUS", type: "DIGITAL HEALTH / PRODUCT SYSTEM", statement: "A focused healthcare experience designed around clarity, trust, and faster access to care.", tags: ["PRODUCT", "MOBILE", "HEALTHCARE"], tone: "acid", heroMedia: projectHeroMedia["seha-plus"] },
  { id: "drevr", index: "02", name: "DREVR", type: "MOBILITY / REAL-TIME PLATFORM", statement: "A real-time mobility product connecting people, routes, and decisions in one continuous flow.", tags: ["MOBILE", "REAL-TIME", "PLATFORM"], tone: "blue", ambient: "drevr", heroMedia: projectHeroMedia.drevr },
  { index: "03", name: "SYSTEMS", type: "SELECTED ENGINEERING / MORE TO COME", statement: "Interfaces are only the surface. The work extends into resilient APIs, operations, and product infrastructure.", tags: ["BACKEND", "DEVOPS", "ARCHITECTURE"], tone: "mono" },
];

function ProductVisual({ project }: { project: Project }) {
  const title = project.index === "01" ? "YOUR HEALTH" : project.index === "02" ? "YOUR ROUTE" : "YOUR SYSTEM";
  return (
    <div className={`product-visual product-visual--${project.tone}`} aria-hidden="true">
      <div className="visual-top"><span>{project.name}</span><i /><i /><i /></div>
      <div className="visual-canvas">
        <div className="visual-orbit" />
        {project.heroMedia ? (
          <GlitchProjectImage media={project.heroMedia} alt={`${project.name} application showcase`} sizes="(max-width: 900px) 94vw, 58vw" className="project-showcase-image" />
        ) : (<>
        <div className="visual-phone">
          <div className="phone-island" /><div className="phone-title">{title}</div>
          <div className="phone-card phone-card--large" /><div className="phone-row"><span /><span /></div>
          <div className="phone-action">{project.index === "03" ? "DEPLOY" : "CONTINUE"} <b>↗</b></div>
        </div>
        <div className="visual-data data-a"><small>STATUS</small><strong>ACTIVE</strong></div>
        <div className="visual-data data-b"><small>SIGNAL</small><strong>99.9</strong></div>
        <div className="visual-cross">+</div>
        </>)}
      </div>
      <div className="visual-footer"><span>CASE / {project.index}</span><span>ZAID.SYSTEMS®</span></div>
    </div>
  );
}

export default function ProjectsShowcase() {
  const { openProject } = useProjectDetails();
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ ignoreMobileResize: true });
    const context = gsap.context(() => {
      const media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference)", () => {
        const syncViewport = () => root.current?.style.setProperty("--story-viewport", `${stage.current?.clientWidth ?? window.innerWidth}px`);
        syncViewport();
        const distance = () => {
          const panels = track.current?.querySelectorAll<HTMLElement>(".project-panel");
          const last = panels?.[panels.length - 1];
          return Math.max(0, (last?.offsetLeft ?? 0) + (last?.offsetWidth ?? 0) - (stage.current?.clientWidth ?? window.innerWidth));
        };
        const travelShare = 0.88;
        const timeline = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            id: "projects-horizontal", trigger: stage.current, start: "top top", end: () => `+=${distance() / travelShare}`,
            pin: true, pinSpacing: true, scrub: 1.05, anticipatePin: 1, invalidateOnRefresh: true,
            onRefreshInit: syncViewport,
            onUpdate: (self) => root.current?.style.setProperty("--projects-progress", `${self.progress}`),
          },
        });
        timeline
          .fromTo(".projects-stage-chrome, .projects-stage-footer", { opacity: 0.35 }, { opacity: 1, duration: 0.06, ease: "power1.out" })
          .fromTo(".project-panel:first-child .project-copy, .project-panel:first-child .project-art", { scale: 0.985 }, { scale: 1, duration: 0.06, ease: "power1.out" }, 0)
          .to(track.current, { x: () => -distance(), duration: travelShare, ease: "none" }, 0.06)
          .to(".project-panel:last-child .project-copy, .project-panel:last-child .project-art", { y: -8, duration: 0.06, ease: "power1.inOut" }, 0.94)
          .to(".projects-stage-chrome, .projects-stage-footer", { opacity: 0.42, duration: 0.06, ease: "power1.inOut" }, 0.94);
        gsap.utils.toArray<HTMLElement>(".project-panel").forEach((panel) => {
          gsap.fromTo(panel.querySelectorAll("[data-project-reveal]"), { y: 36, opacity: 0.25 }, {
            y: 0, opacity: 1, stagger: 0.06, ease: "power2.out",
            scrollTrigger: { trigger: panel, containerAnimation: timeline, start: "left 78%", end: "left 48%", scrub: true },
          });
        });
        return () => { root.current?.style.removeProperty("--projects-progress"); root.current?.style.removeProperty("--story-viewport"); };
      });
      return () => media.revert();
    }, root);
    return () => context.revert();
  }, []);

  return (
    <section ref={root} id="hero-end" className="projects-section" aria-labelledby="projects-heading">
      <div className="projects-prelude" id="projects">
        <div><p>02 / SELECTED WORK</p><span>SCROLL-DRIVEN PRODUCT STORIES</span></div>
        <h2 id="projects-heading">BUILT TO<br /><em>MOVE.</em></h2>
        <p className="prelude-copy">A selection of products shaped from first principles—where interface, engineering, and real-world use move as one system.</p>
        <div className="axis-cue" aria-hidden="true">VERTICAL <span>↓</span> HORIZONTAL <span>→</span></div>
      </div>

      <div ref={stage} className="projects-stage">
        <div className="projects-stage-chrome" aria-hidden="true"><span>SELECTED WORK / 2026</span><span className="stage-progress"><i /></span><span>03 PROJECT SYSTEMS</span></div>
        <div ref={track} className="projects-track" role="region" aria-label="Projects. Continue scrolling vertically to move through the project stories." tabIndex={0}>
          {projects.map((project) => (
            <article className={`project-panel project-panel--${project.tone}${project.ambient ? ` project-panel--${project.ambient}` : ""}`} key={project.name} role="group" aria-label={`Project ${project.index} of ${projects.length}: ${project.name}`}>
              <div className="project-copy">
                <div className="project-kicker" data-project-reveal><span>{project.index}</span>{project.type}</div>
                <h3 data-project-reveal>{project.name}</h3><p data-project-reveal>{project.statement}</p>
                <div className="project-tags" data-project-reveal>{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
                {project.id && <button className="project-explore" type="button" data-project-reveal onClick={(event) => openProject(project.id!, event.currentTarget)}>EXPLORE PROJECT <span>↗</span></button>}
                <div className="project-index" aria-hidden="true">{project.index}</div>
              </div>
              <div className="project-art" data-project-reveal><ProductVisual project={project} /></div>
            </article>
          ))}
        </div>
        <div className="projects-stage-footer" aria-hidden="true"><span>USE VERTICAL SCROLL</span><b>→</b><span>AXIS / X</span></div>
      </div>

    </section>
  );
}
