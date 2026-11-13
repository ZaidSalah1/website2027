"use client";

import Image from "next/image";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { getProjectDetails, type ProjectDetails, type ProjectScreenshot } from "../data/projectDetails";

type TabId = "screens" | "overview" | "engineering";
type ProjectDetailsContextValue = { openProject: (id: string, trigger?: HTMLElement | null) => void };
const ProjectDetailsContext = createContext<ProjectDetailsContextValue | null>(null);

export const useProjectDetails = () => {
  const value = useContext(ProjectDetailsContext);
  if (!value) throw new Error("useProjectDetails must be used inside ProjectDetailsProvider");
  return value;
};

export default function ProjectDetailsProvider({ children }: { children: ReactNode }) {
  const [project, setProject] = useState<ProjectDetails | null>(null);
  const [closing, setClosing] = useState(false);
  const triggerRef = useRef<HTMLElement | null>(null);
  const scrollRef = useRef(0);

  const openProject = useCallback((id: string, trigger?: HTMLElement | null) => {
    const details = getProjectDetails(id);
    if (!details) return;
    triggerRef.current = trigger ?? document.activeElement as HTMLElement | null;
    scrollRef.current = window.scrollY;
    setClosing(false);
    setProject(details);
  }, []);

  const closeProject = useCallback(() => {
    setClosing(true);
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.setTimeout(() => {
      setProject(null);
      setClosing(false);
      requestAnimationFrame(() => triggerRef.current?.focus({ preventScroll: true }));
    }, reduced ? 0 : 220);
  }, []);

  useEffect(() => {
    if (!project) return;
    const body = document.body;
    const previous = { position: body.style.position, top: body.style.top, left: body.style.left, right: body.style.right, width: body.style.width, overflow: body.style.overflow };
    const y = scrollRef.current;
    body.style.position = "fixed";
    body.style.top = `-${y}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.width = "100%";
    body.style.overflow = "hidden";
    body.dataset.projectModalOpen = "true";
    return () => {
      delete body.dataset.projectModalOpen;
      Object.assign(body.style, previous);
      window.scrollTo({ top: y, left: 0, behavior: "instant" });
    };
  }, [project]);

  const value = useMemo(() => ({ openProject }), [openProject]);
  return <ProjectDetailsContext.Provider value={value}>{children}{project && createPortal(<ProjectDetailsModal project={project} closing={closing} onClose={closeProject} />, document.body)}</ProjectDetailsContext.Provider>;
}

function ProjectDetailsModal({ project, closing, onClose }: { project: ProjectDetails; closing: boolean; onClose: () => void }) {
  const [tab, setTab] = useState<TabId>("screens");
  const [groupId, setGroupId] = useState(project.screenshotGroups?.[0]?.id ?? "");
  const [index, setIndex] = useState(0);
  const [viewer, setViewer] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const activeGroup = project.screenshotGroups?.find((group) => group.id === groupId) ?? project.screenshotGroups?.[0];
  const screenshots = activeGroup?.screenshots ?? [];
  const hasEngineering = Boolean(project.technologies || project.engineeringHighlights?.length || project.challenges?.length);
  const tabs: TabId[] = ["screens", "overview", "engineering"];

  const selectIndex = useCallback((next: number) => {
    if (!screenshots.length) return;
    const normalized = (next + screenshots.length) % screenshots.length;
    setIndex(normalized);
    carouselRef.current?.children[normalized]?.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", inline: "center", block: "nearest" });
  }, [screenshots.length]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const focusable = () => [...dialog.querySelectorAll<HTMLElement>('button,[href],[tabindex]:not([tabindex="-1"])')].filter((node) => !node.hasAttribute("disabled"));
    requestAnimationFrame(() => focusable()[0]?.focus());
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") { if (viewer) { setViewer(false); setZoomed(false); } else onClose(); return; }
      if ((event.key === "ArrowRight" || event.key === "ArrowLeft") && (tab === "screens" || viewer)) selectIndex(index + (event.key === "ArrowRight" ? 1 : -1));
      if (event.key !== "Tab") return;
      const nodes = focusable();
      if (!nodes.length) return;
      const first = nodes[0], last = nodes[nodes.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [index, onClose, selectIndex, tab, viewer]);

  const onTabKey = (event: KeyboardEvent<HTMLButtonElement>, current: number) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : (current + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
    setTab(tabs[next]);
    dialogRef.current?.querySelectorAll<HTMLElement>('[role="tab"]')[next]?.focus();
  };

  return <div className={`project-modal-layer${closing ? " is-closing" : ""}`}>
    <button className="project-modal-backdrop" aria-label="Close project details" onClick={onClose} />
    <div ref={dialogRef} className="project-modal" role="dialog" aria-modal="true" aria-labelledby="project-modal-title" style={{ "--detail-accent": project.accent } as React.CSSProperties}>
      <header className="project-modal-header">
        <div><p>{project.category}</p><h2 id="project-modal-title">{project.title}</h2><span>{project.description}</span></div>
        <button className="project-modal-close" type="button" onClick={onClose} aria-label="Close project details"><span>CLOSE</span>×</button>
      </header>
      <nav className="project-modal-tabs" role="tablist" aria-label="Project detail sections">
        {tabs.map((item, position) => <button key={item} role="tab" aria-selected={tab === item} tabIndex={tab === item ? 0 : -1} onClick={() => setTab(item)} onKeyDown={(event) => onTabKey(event, position)}>{item.toUpperCase()}</button>)}
      </nav>
      <div className="project-modal-content">
        {tab === "screens" && <ScreensTab project={project} screenshots={screenshots} groupId={groupId} index={index} carouselRef={carouselRef} onGroup={(id) => { setGroupId(id); setIndex(0); }} onIndex={selectIndex} onViewer={() => setViewer(true)} />}
        {tab === "overview" && <OverviewTab project={project} />}
        {tab === "engineering" && <EngineeringTab project={project} verified={hasEngineering} />}
      </div>
      <footer className="project-modal-footer"><span>PROJECT EXHIBITION / {project.id.toUpperCase()}</span><span>ESC TO CLOSE</span></footer>
      {viewer && screenshots[index] && <ImageViewer screenshot={screenshots[index]} index={index} count={screenshots.length} zoomed={zoomed} onZoom={() => setZoomed((value) => !value)} onClose={() => { setViewer(false); setZoomed(false); }} onMove={selectIndex} />}
    </div>
  </div>;
}

function ScreensTab({ project, screenshots, groupId, index, carouselRef, onGroup, onIndex, onViewer }: { project: ProjectDetails; screenshots: ProjectScreenshot[]; groupId: string; index: number; carouselRef: React.RefObject<HTMLDivElement | null>; onGroup: (id: string) => void; onIndex: (index: number) => void; onViewer: () => void }) {
  if (!screenshots.length) return <EmptyState title="Screens are being prepared" body="No verified product screenshots are available for this project yet." />;
  return <section className="project-screens" aria-label={`${project.title} images`}>
    {(project.screenshotGroups?.length ?? 0) > 1 && <div className="screen-groups">{project.screenshotGroups?.map((group) => <button key={group.id} className={groupId === group.id ? "active" : ""} onClick={() => onGroup(group.id)}>{group.label}</button>)}</div>}
    <div className="screen-stage">
      <button className="screen-arrow screen-arrow--prev" onClick={() => onIndex(index - 1)} disabled={screenshots.length < 2} aria-label="Previous image">←</button>
      <div ref={carouselRef} className="screen-carousel" onScroll={(event) => { const node = event.currentTarget; const closest = Math.round(node.scrollLeft / Math.max(1, node.clientWidth * .82)); if (closest !== index && closest < screenshots.length) onIndex(closest); }}>
        {screenshots.map((screen, position) => <button key={`${screen.alt}-${position}`} className="screen-slide" onClick={() => { onIndex(position); onViewer(); }} aria-label={`Open image ${position + 1} of ${screenshots.length}`}>
          <Image src={screen.src} alt={screen.alt} fill sizes="(max-width: 800px) 92vw, 72vw" className="screen-slide-image" placeholder="blur" loading={position === 0 ? "eager" : "lazy"} />
          <span>{screen.kind === "presentation" ? "PRESENTATION ARTWORK" : "ORIGINAL SCREENSHOT"}{screen.caption ? ` / ${screen.caption}` : ""}</span>
        </button>)}
      </div>
      <button className="screen-arrow screen-arrow--next" onClick={() => onIndex(index + 1)} disabled={screenshots.length < 2} aria-label="Next image">→</button>
    </div>
    <div className="screen-counter"><span>{String(index + 1).padStart(2, "0")}</span><i>{screenshots.map((_, position) => <b key={position} className={index === position ? "active" : ""} />)}</i><span>{String(screenshots.length).padStart(2, "0")}</span></div>
  </section>;
}

function OverviewTab({ project }: { project: ProjectDetails }) {
  const links = Object.entries(project.links ?? {}).filter((entry): entry is [string, string] => Boolean(entry[1]));
  return <section className="project-overview">
    <article className="overview-lead"><p>PROJECT SUMMARY</p><h3>{project.summary}</h3></article>
    {project.role && <article><p>MY ROLE</p><div>{project.role}</div></article>}
    {project.features?.length && <article><p>KEY FEATURES</p><ul>{project.features.map((feature) => <li key={feature}>{feature}</li>)}</ul></article>}
    {project.systems?.length && <article><p>PROJECT SCOPE</p><ul>{project.systems.map((system) => <li key={system}>{system}</li>)}</ul></article>}
    {links.length > 0 && <article><p>AVAILABILITY</p><div className="project-links">{links.map(([label, href]) => <a key={label} href={href} target="_blank" rel="noreferrer">{label} ↗</a>)}</div></article>}
    {!project.role && <div className="project-verification-note">Role and contribution details are awaiting confirmation before publication.</div>}
  </section>;
}

function EngineeringTab({ project, verified }: { project: ProjectDetails; verified: boolean }) {
  if (!verified) return <EmptyState title="Technical details pending verification" body="The project-specific stack, architecture, and engineering responsibilities have not been confirmed from source material, so they are intentionally not published here." />;
  return <section className="project-engineering">
    {project.technologies && <article><p>TECHNOLOGY STACK</p>{Object.entries(project.technologies).map(([group, technologies]) => <div className="technology-row" key={group}><span>{group}</span><ul>{technologies.map((technology) => <li key={technology}>{technology}</li>)}</ul></div>)}</article>}
    {project.engineeringHighlights?.length && <article><p>ENGINEERING HIGHLIGHTS</p><ol>{project.engineeringHighlights.map((highlight) => <li key={highlight}>{highlight}</li>)}</ol></article>}
    {project.challenges?.length && <article><p>TECHNICAL CHALLENGES</p>{project.challenges.map((item) => <div className="challenge-row" key={item.challenge}><b>{item.challenge}</b><span>{item.approach}</span>{item.outcome && <small>{item.outcome}</small>}</div>)}</article>}
  </section>;
}

function EmptyState({ title, body }: { title: string; body: string }) { return <section className="project-empty"><span>VERIFIED CONTENT ONLY</span><h3>{title}</h3><p>{body}</p></section>; }

function ImageViewer({ screenshot, index, count, zoomed, onZoom, onClose, onMove }: { screenshot: ProjectScreenshot; index: number; count: number; zoomed: boolean; onZoom: () => void; onClose: () => void; onMove: (index: number) => void }) {
  return <div className="project-image-viewer" role="dialog" aria-modal="true" aria-label="Expanded project image">
    <header><span>{String(index + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}</span><div><button onClick={onZoom}>{zoomed ? "FIT" : "ZOOM"}</button><button onClick={onClose}>CLOSE ×</button></div></header>
    <div className={`viewer-image${zoomed ? " is-zoomed" : ""}`} onClick={onZoom}><Image src={screenshot.src} alt={screenshot.alt} fill sizes="100vw" className="viewer-img" placeholder="blur" /></div>
    {count > 1 && <><button className="viewer-arrow viewer-arrow--prev" onClick={() => onMove(index - 1)} aria-label="Previous image">←</button><button className="viewer-arrow viewer-arrow--next" onClick={() => onMove(index + 1)} aria-label="Next image">→</button></>}
  </div>;
}
