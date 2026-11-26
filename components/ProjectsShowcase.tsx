"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { bindPinnedStorySwipe } from "../lib/pinnedStorySwipe";
import { bindPinnedStoryMagnet } from "../lib/pinnedStoryMagnet";
import { useProjectDetails } from "./ProjectDetailsProvider";
import GlitchProjectImage, { preloadProjectImage } from "./GlitchProjectImage";
import { projectHeroMedia, type ProjectHeroMedia } from "../data/projectHeroMedia";

type Project = { id?: string; index: string; name: string; type: string; statement: string; tags: string[]; tone: "acid" | "blue" | "mono"; ambient?: "drevr" | "dashboards"; heroMedia?: ProjectHeroMedia };

const projects: Project[] = [
  { id: "seha-plus", index: "01", name: "SEHA PLUS", type: "DIGITAL HEALTH / PRODUCT SYSTEM", statement: "A focused healthcare experience designed around clarity, trust, and faster access to care.", tags: ["PRODUCT", "MOBILE", "HEALTHCARE"], tone: "acid", heroMedia: projectHeroMedia["seha-plus"] },
  { id: "drevr", index: "02", name: "DREVR", type: "MOBILITY / REAL-TIME PLATFORM", statement: "A real-time mobility product connecting people, routes, and decisions in one continuous flow.", tags: ["MOBILE", "REAL-TIME", "PLATFORM"], tone: "blue", ambient: "drevr", heroMedia: projectHeroMedia.drevr },
  { id: "dashboard-systems", index: "03", name: "DASHBOARD SYSTEMS", type: "FULL-STACK / ADMIN PLATFORMS", statement: "Custom administration platforms designed for analytics, product management, order workflows, and operational control.", tags: ["SAAS", "DASHBOARDS", "FULL-STACK"], tone: "mono", ambient: "dashboards", heroMedia: projectHeroMedia["dashboard-systems"] },
];

function ProductVisual({ project, critical, enabled }: { project: Project; critical: boolean; enabled: boolean }) {
  const visual = useRef<HTMLDivElement>(null);
  const title = project.index === "01" ? "YOUR HEALTH" : project.index === "02" ? "YOUR ROUTE" : "YOUR SYSTEM";

  useEffect(() => {
    if (project.ambient !== "dashboards" || !visual.current) return;
    const panel = visual.current.closest<HTMLElement>(".project-panel--dashboards");
    const image = visual.current.querySelector<HTMLElement>(".glitch-project-image");
    if (!panel || !image) return;
    const syncAmbient = () => panel.dataset.dashboardTone = image.dataset.imageIndex === "1" ? "amber" : "violet";
    syncAmbient();
    const observer = new MutationObserver(syncAmbient);
    observer.observe(image, { attributes: true, attributeFilter: ["data-image-index"] });
    return () => observer.disconnect();
  }, [enabled, project.ambient]);

  return (
    <div ref={visual} className={`product-visual product-visual--${project.tone}`} aria-hidden="true">
      <div className="visual-top"><span>{project.name}</span><i /><i /><i /></div>
      <div className="visual-canvas">
        <div className="visual-orbit" />
        {project.heroMedia ? (
          <GlitchProjectImage media={project.heroMedia} alt={`${project.name} application showcase`} sizes="(max-width: 900px) 94vw, 58vw" className="project-showcase-image" critical={critical} enabled={enabled} />
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
  const prelude = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [loadedMedia, setLoadedMedia] = useState(() => new Set([0]));

  useEffect(() => {
    if (!root.current) return;
    let cancelled = false;
    const waitForIdle = () => new Promise<void>((resolve) => {
      if ("requestIdleCallback" in window) window.requestIdleCallback(() => resolve(), { timeout: 900 });
      else globalThis.setTimeout(resolve, 120);
    });
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      void (async () => {
        const sizes = "(max-width: 900px) 94vw, 58vw";
        for (let projectIndex = 0; projectIndex < projects.length; projectIndex += 1) {
          const heroMedia = projects[projectIndex].heroMedia;
          if (!heroMedia) continue;
          const imagesToWarm = heroMedia.images.slice(0, Math.min(2, heroMedia.images.length));
          for (const image of imagesToWarm) {
            await preloadProjectImage(image, sizes);
            if (cancelled) return;
          }
          setLoadedMedia((current) => new Set(current).add(projectIndex));
          await waitForIdle();
          if (cancelled) return;
        }
      })();
      observer.disconnect();
    }, { rootMargin: "150% 0px 150% 0px" });
    observer.observe(root.current);
    return () => { cancelled = true; observer.disconnect(); };
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ ignoreMobileResize: true });
    const context = gsap.context(() => {
      const media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference)", () => {
        const intro = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            id: "projects-prelude-transition",
            trigger: prelude.current,
            start: "top 84%",
            end: "bottom 10%",
            scrub: window.matchMedia("(max-width: 639px)").matches ? .22 : .45,
            invalidateOnRefresh: true,
          },
        });
        intro
          .fromTo("[data-prelude-word]", { yPercent: 76, opacity: 0 }, { yPercent: 0, opacity: 1, duration: .28, stagger: .055, ease: "power2.out" }, 0)
          .fromTo(".prelude-copy, .projects-direction", { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: .24, stagger: .045, ease: "power2.out" }, .08)
          .to(".prelude-built", { x: () => window.innerWidth < 640 ? -10 : -30, scale: .97, opacity: .72, duration: .36, ease: "power1.inOut" }, .4)
          .to(".prelude-move", { x: () => window.innerWidth < 640 ? 12 : 38, scale: 1.025, duration: .36, ease: "power1.inOut" }, .4)
          .fromTo(".projects-direction-line", { scaleX: 0 }, { scaleX: 1, duration: .34, ease: "power2.inOut" }, .42)
          .to(".projects-direction-arrow", { rotate: -90, color: "var(--project-accent)", duration: .28, ease: "power2.inOut" }, .5)
          .to(".projects-direction-label--vertical", { opacity: .35, duration: .2 }, .55)
          .to(".projects-direction-label--horizontal", { opacity: 1, duration: .2 }, .55)
          .to(".projects-prelude h2, .prelude-copy", { y: -12, opacity: .24, duration: .22, ease: "power1.in" }, .78);

        const syncViewport = () => root.current?.style.setProperty("--story-viewport", `${stage.current?.clientWidth ?? window.innerWidth}px`);
        syncViewport();
        const panels = gsap.utils.toArray<HTMLElement>(".project-panel");
        const distance = () => {
          const last = panels?.[panels.length - 1];
          return Math.max(0, (last?.offsetLeft ?? 0) + (last?.offsetWidth ?? 0) - (stage.current?.clientWidth ?? window.innerWidth));
        };
        const travelShare = 0.88;
        const mobile = window.matchMedia("(max-width: 900px)").matches;
        let activeIndex = -1;
        const setActiveProject = (nextIndex: number) => {
          if (nextIndex === activeIndex) return;
          activeIndex = nextIndex;
          panels.forEach((panel, index) => {
            panel.dataset.projectActive = index === activeIndex ? "true" : "false";
            panel.dataset.storyDistance = String(Math.abs(index - activeIndex));
          });
        };
        setActiveProject(0);
        const onScrollStart = () => mobile && stage.current?.classList.add("is-story-scrolling");
        const onScrollEnd = () => stage.current?.classList.remove("is-story-scrolling");
        ScrollTrigger.addEventListener("scrollStart", onScrollStart);
        ScrollTrigger.addEventListener("scrollEnd", onScrollEnd);
        const timeline = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            id: "projects-horizontal", trigger: stage.current, start: "top top", end: () => `+=${distance() / travelShare}`,
            pin: true, pinSpacing: true, scrub: mobile ? .32 : .65, anticipatePin: mobile ? .5 : 1, invalidateOnRefresh: true,
            onRefreshInit: syncViewport,
            onUpdate: (self) => {
              const horizontalProgress = gsap.utils.clamp(0, 1, (self.progress - 0.06) / travelShare);
              setActiveProject(Math.round(horizontalProgress * Math.max(0, panels.length - 1)));
            },
          },
        });
        timeline
          .fromTo(".projects-stage-chrome, .projects-stage-footer", { opacity: 0.35 }, { opacity: 1, duration: 0.06, ease: "power1.out" })
          .fromTo(".project-panel:first-child .project-copy, .project-panel:first-child .project-art", { scale: 0.985 }, { scale: 1, duration: 0.06, ease: "power1.out" }, 0)
          .fromTo(".stage-progress i", { scaleX: 0 }, { scaleX: 1, duration: travelShare, ease: "none" }, 0.06)
          .to(track.current, { x: () => -distance(), duration: travelShare, ease: "none", force3D: true }, 0.06)
          .to(".project-panel:last-child .project-copy, .project-panel:last-child .project-art", { y: -8, duration: 0.06, ease: "power1.inOut" }, 0.94)
          .to(".projects-stage-chrome, .projects-stage-footer", { opacity: 0.42, duration: 0.06, ease: "power1.inOut" }, 0.94);
        panels.forEach((panel) => {
          gsap.fromTo(panel.querySelectorAll("[data-project-reveal]"), { y: 36, opacity: 0.25 }, {
            y: 0, opacity: 1, stagger: 0.06, ease: "power2.out",
            scrollTrigger: { trigger: panel, containerAnimation: timeline, start: "left 78%", end: "left 48%", scrub: true },
          });
        });
        const removeSwipe = stage.current && timeline.scrollTrigger
          ? bindPinnedStorySwipe(stage.current, timeline.scrollTrigger, 1 / timeline.duration())
          : undefined;
        const removeMagnet = bindPinnedStoryMagnet(timeline, panels.length, .06, travelShare);
        return () => {
          removeMagnet?.();
          removeSwipe?.();
          ScrollTrigger.removeEventListener("scrollStart", onScrollStart);
          ScrollTrigger.removeEventListener("scrollEnd", onScrollEnd);
          stage.current?.classList.remove("is-story-scrolling");
          root.current?.style.removeProperty("--story-viewport");
        };
      });
      return () => media.revert();
    }, root);
    return () => context.revert();
  }, []);

  return (
    <section ref={root} id="hero-end" className="projects-section" aria-labelledby="projects-heading">
      <div ref={prelude} className="projects-prelude" id="projects">
        <div><p>02 / SELECTED WORK</p><span>SCROLL-DRIVEN PRODUCT STORIES</span></div>
        <h2 id="projects-heading" aria-label="Built to move"><span className="prelude-line"><span className="prelude-built" data-prelude-word>BUILT TO</span></span><span className="prelude-line"><em className="prelude-move" data-prelude-word>MOVE.</em></span></h2>
        <p className="prelude-copy">A selection of products shaped from first principles—where interface, engineering, and real-world use move as one system.</p>
        <div className="axis-cue" aria-hidden="true">VERTICAL <span>↓</span> HORIZONTAL <span>→</span></div>
        <div className="projects-direction" aria-hidden="true"><span className="projects-direction-label--vertical">VERTICAL FLOW</span><i className="projects-direction-line" /><b className="projects-direction-arrow">&#8595;</b><span className="projects-direction-label--horizontal">HORIZONTAL STORY</span></div>
      </div>

      <div ref={stage} className="projects-stage">
        <div className="projects-stage-chrome" aria-hidden="true"><span>SELECTED WORK / 2026</span><span className="stage-progress"><i /></span><span>03 PROJECT SYSTEMS</span></div>
        <div ref={track} className="projects-track" role="region" aria-label="Projects. Continue scrolling vertically to move through the project stories." tabIndex={0}>
          {projects.map((project, projectIndex) => (
            <article className={`project-panel project-panel--${project.tone}${project.ambient ? ` project-panel--${project.ambient}` : ""}`} data-project-active={projectIndex === 0 ? "true" : "false"} data-dashboard-tone={project.ambient === "dashboards" ? "violet" : undefined} key={project.name} role="group" aria-label={`Project ${project.index} of ${projects.length}: ${project.name}`}>
              <div className="project-copy">
                <div className="project-kicker" data-project-reveal><span>{project.index}</span>{project.type}</div>
                <h3 data-project-reveal>{project.name}</h3><p data-project-reveal>{project.statement}</p>
                <div className="project-tags" data-project-reveal>{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
                {project.id && <button className="project-explore" type="button" data-project-reveal onClick={(event) => openProject(project.id!, event.currentTarget)}>EXPLORE PROJECT <span>↗</span></button>}
                <div className="project-index" aria-hidden="true">{project.index}</div>
              </div>
              <div className="project-art" data-project-reveal><ProductVisual project={project} critical={false} enabled={loadedMedia.has(projectIndex)} /></div>
            </article>
          ))}
        </div>
        <div className="projects-stage-footer" aria-hidden="true"><span>USE VERTICAL SCROLL</span><b>→</b><span>AXIS / X</span></div>
      </div>

    </section>
  );
}
