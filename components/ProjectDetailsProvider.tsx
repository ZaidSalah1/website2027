"use client";
import Image from "next/image";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
  type TouchEvent,
} from "react";
import { createPortal } from "react-dom";
import {
  FaApple,
  FaArrowUpRightFromSquare,
  FaGithub,
  FaGooglePlay,
} from "react-icons/fa6";
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Monitor,
  Smartphone,
} from "lucide-react";
import {
  getProjectDetails,
  type ProjectAction,
  type ProjectDetails,
  type ProjectScreenshot,
} from "../data/projectDetails";

type TabId = "screens" | "overview" | "engineering" | "try-it";
const Context = createContext<{
  openProject: (id: string, trigger?: HTMLElement | null) => void;
} | null>(null);
export const useProjectDetails = () => {
  const value = useContext(Context);
  if (!value)
    throw new Error(
      "useProjectDetails must be used inside ProjectDetailsProvider",
    );
  return value;
};

export default function ProjectDetailsProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [project, setProject] = useState<ProjectDetails | null>(null);
  const [closing, setClosing] = useState(false);
  const triggerRef = useRef<HTMLElement | null>(null);
  const scrollRef = useRef(0);
  const openProject = useCallback(
    (id: string, trigger?: HTMLElement | null) => {
      const details = getProjectDetails(id);
      if (!details) return;
      triggerRef.current =
        trigger ?? (document.activeElement as HTMLElement | null);
      scrollRef.current = scrollY;
      setClosing(false);
      setProject(details);
    },
    [],
  );
  const closeProject = useCallback(() => {
    setClosing(true);
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    setTimeout(
      () => {
        setProject(null);
        setClosing(false);
        requestAnimationFrame(() =>
          triggerRef.current?.focus({ preventScroll: true }),
        );
      },
      reduced ? 0 : 220,
    );
  }, []);
  useEffect(() => {
    if (!project) return;
    const body = document.body;
    const previous = {
      position: body.style.position,
      top: body.style.top,
      left: body.style.left,
      right: body.style.right,
      width: body.style.width,
      overflow: body.style.overflow,
    };
    const y = scrollRef.current;
    Object.assign(body.style, {
      position: "fixed",
      top: `-${y}px`,
      left: "0",
      right: "0",
      width: "100%",
      overflow: "hidden",
    });
    body.dataset.projectModalOpen = "true";
    return () => {
      body.dataset.projectModalRestoreY = String(y);
      Object.assign(body.style, previous);
      window.scrollTo({ top: y, left: 0, behavior: "instant" });
      delete body.dataset.projectModalOpen;
      window.dispatchEvent(
        new CustomEvent<number>("project-modal-restore", { detail: y }),
      );
    };
  }, [project]);
  const value = useMemo(() => ({ openProject }), [openProject]);
  return (
    <Context.Provider value={value}>
      {children}
      {project &&
        createPortal(
          <Modal project={project} closing={closing} onClose={closeProject} />,
          document.body,
        )}
    </Context.Provider>
  );
}

function Modal({
  project,
  closing,
  onClose,
}: {
  project: ProjectDetails;
  closing: boolean;
  onClose: () => void;
}) {
  const [tab, setTab] = useState<TabId>("screens");
  const [groupId, setGroupId] = useState(project.screenshotGroups[0]?.id ?? "");
  const [index, setIndex] = useState(0);
  const [viewer, setViewer] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const navigationRequest = useRef(0);
  const group =
    project.screenshotGroups.find((item) => item.id === groupId) ??
    project.screenshotGroups[0];
  const screenshots = group?.screenshots ?? [];
  const tabs: TabId[] = ["screens", "overview", "engineering", "try-it"];
  const selectGroup = useCallback((id: string) => {
    navigationRequest.current += 1;
    setIndex(0);
    setViewer(false);
    setZoomed(false);
    setGroupId(id);
  }, []);
  const selectIndex = useCallback(
    (next: number) => {
      if (!screenshots.length) return;
      const normalized = (next + screenshots.length) % screenshots.length;
      const request = ++navigationRequest.current;
      const carousel = carouselRef.current;
      const slide = carousel?.children[normalized] as HTMLElement | undefined;
      const reveal = () => {
        if (request !== navigationRequest.current) return;
        setIndex(normalized);
        if (!carousel || !slide) return;
        const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
        carousel.dataset.programmaticUntil = String(
          performance.now() + (reduced ? 50 : 700),
        );
        const left =
          slide.offsetLeft - (carousel.clientWidth - slide.offsetWidth) / 2;
        carousel.scrollTo({ left, behavior: reduced ? "auto" : "smooth" });
      };
      const image = slide?.querySelector<HTMLImageElement>(
        ".screen-slide-image",
      );
      if (!image) {
        reveal();
        return;
      }
      image.loading = "eager";
      if (image.complete && image.naturalWidth > 0) {
        void image
          .decode()
          .catch(() => undefined)
          .finally(reveal);
        return;
      }
      const settle = () =>
        void image
          .decode()
          .catch(() => undefined)
          .finally(reveal);
      image.addEventListener("load", settle, { once: true });
      image.addEventListener("error", reveal, { once: true });
    },
    [screenshots.length],
  );
  useEffect(() => {
    contentRef.current?.scrollTo({ top: 0, behavior: "instant" });
  }, [tab]);
  useEffect(() => {
    carouselRef.current?.scrollTo({ left: 0, behavior: "auto" });
  }, [groupId]);
  useEffect(() => {
    if (tab !== "screens" || !screenshots.length) return;
    const count = screenshots.length;
    const positions = [(index - 1 + count) % count, index, (index + 1) % count];
    const frame = requestAnimationFrame(() => {
      const images = carouselRef.current?.querySelectorAll<HTMLImageElement>(
        ".screen-slide-image",
      );
      positions.forEach((position) => {
        const image = images?.[position];
        if (image) void image.decode().catch(() => undefined);
      });
    });
    return () => cancelAnimationFrame(frame);
  }, [index, screenshots, tab]);
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const focusable = () =>
      [
        ...dialog.querySelectorAll<HTMLElement>(
          'button,[href],[tabindex]:not([tabindex="-1"])',
        ),
      ].filter((node) => !node.hasAttribute("disabled"));
    requestAnimationFrame(() => focusable()[0]?.focus());
    const key = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        if (viewer) {
          setViewer(false);
          setZoomed(false);
        } else onClose();
        return;
      }
      if (
        (event.key === "ArrowRight" || event.key === "ArrowLeft") &&
        (tab === "screens" || viewer) &&
        !event.defaultPrevented &&
        !(event.target as HTMLElement)?.closest(".project-modal-tabs")
      ) {
        event.preventDefault();
        selectIndex(index + (event.key === "ArrowRight" ? 1 : -1));
        return;
      }
      if (event.key !== "Tab") return;
      const nodes = focusable();
      if (!nodes.length) return;
      const first = nodes[0],
        last = nodes.at(-1)!;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", key);
    return () => document.removeEventListener("keydown", key);
  }, [index, onClose, selectIndex, tab, viewer]);
  const tabKey = (event: KeyboardEvent<HTMLButtonElement>, current: number) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const next =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? tabs.length - 1
          : (current + (event.key === "ArrowRight" ? 1 : -1) + tabs.length) %
            tabs.length;
    setTab(tabs[next]);
    dialogRef.current
      ?.querySelectorAll<HTMLElement>('[role="tab"]')
      [next]?.focus();
  };
  return (
    <div className={`project-modal-layer${closing ? " is-closing" : ""}`}>
      <button
        className="project-modal-backdrop"
        aria-label="Close project details"
        onClick={onClose}
      />
      <div
        ref={dialogRef}
        className="project-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-modal-title"
        style={{ "--detail-accent": project.accent } as React.CSSProperties}
      >
        <header className="project-modal-header">
          <div>
            <p>{project.category}</p>
            <h2 id="project-modal-title">{project.title}</h2>
            <span>{project.description}</span>
          </div>
          <button
            className="project-modal-close"
            type="button"
            onClick={onClose}
            aria-label="Close project details"
          >
            <span>CLOSE</span>×
          </button>
        </header>
        <nav
          className="project-modal-tabs"
          role="tablist"
          aria-label="Project detail sections"
        >
          {tabs.map((item, position) => (
            <button
              key={item}
              role="tab"
              aria-selected={tab === item}
              tabIndex={tab === item ? 0 : -1}
              onClick={() => setTab(item)}
              onKeyDown={(event) => tabKey(event, position)}
            >
              {item === "try-it" ? "TRY IT" : item.toUpperCase()}
            </button>
          ))}
        </nav>
        <div ref={contentRef} className="project-modal-content">
          {tab === "screens" && (
          <Screens
            key={groupId}
              project={project}
              screenshots={screenshots}
              groupId={groupId}
              index={index}
              carouselRef={carouselRef}
            onGroup={selectGroup}
              onIndex={selectIndex}
              onVisibleIndex={setIndex}
              onViewer={() => setViewer(true)}
            />
          )}{" "}
          {tab === "overview" && <Overview project={project} />}{" "}
          {tab === "engineering" && <Engineering project={project} />}{" "}
          {tab === "try-it" && <TryIt project={project} />}
        </div>
        <footer className="project-modal-footer">
          <span>PROJECT EXHIBITION / {project.id.toUpperCase()}</span>
          <span>ESC TO CLOSE</span>
        </footer>
        {viewer && screenshots[index] && (
          <Viewer
            screenshot={screenshots[index]}
            index={index}
            count={screenshots.length}
            zoomed={zoomed}
            onZoom={() => setZoomed((value) => !value)}
            onClose={() => {
              setViewer(false);
              setZoomed(false);
            }}
            onMove={selectIndex}
          />
        )}
      </div>
    </div>
  );
}

function Screens({
  project,
  screenshots,
  groupId,
  index,
  carouselRef,
  onGroup,
  onIndex,
  onVisibleIndex,
  onViewer,
}: {
  project: ProjectDetails;
  screenshots: ProjectScreenshot[];
  groupId: string;
  index: number;
  carouselRef: React.RefObject<HTMLDivElement | null>;
  onGroup: (id: string) => void;
  onIndex: (index: number) => void;
  onVisibleIndex: (index: number) => void;
  onViewer: () => void;
}) {
  const scrollTimer = useRef<number | null>(null);
  useEffect(
    () => () => {
      if (scrollTimer.current) window.clearTimeout(scrollTimer.current);
    },
    [],
  );
  if (!screenshots.length) return null;
  const syncScroll = (node: HTMLDivElement) => {
    if (scrollTimer.current) window.clearTimeout(scrollTimer.current);
    scrollTimer.current = window.setTimeout(() => {
      if (performance.now() < Number(node.dataset.programmaticUntil ?? 0))
        return;
      const center = node.scrollLeft + node.clientWidth / 2;
      let closest = 0;
      let distance = Number.POSITIVE_INFINITY;
      [...node.children].forEach((child, position) => {
        const slide = child as HTMLElement;
        const nextDistance = Math.abs(
          slide.offsetLeft + slide.offsetWidth / 2 - center,
        );
        if (nextDistance < distance) {
          closest = position;
          distance = nextDistance;
        }
      });
      if (closest !== index) onVisibleIndex(closest);
    }, 90);
  };
  const adjacent = (position: number) =>
    screenshots.length < 3 ||
    Math.min(
      Math.abs(position - index),
      screenshots.length - Math.abs(position - index),
    ) <= 1;
  return (
    <section className="project-screens" aria-label={`${project.title} images`}>
      {project.screenshotGroups.length > 1 && (
        <div
          className="screen-groups"
          role="list"
          aria-label={`${project.title} product views`}
        >
          {project.screenshotGroups.map((group) => (
            <button
              type="button"
              role="listitem"
              key={group.id}
              className={groupId === group.id ? "active" : ""}
              aria-pressed={groupId === group.id}
              onClick={() => onGroup(group.id)}
            >
              <span className="screen-group-icon">
                <GroupIcon id={group.id} />
              </span>
              <span>{group.label}</span>
            </button>
          ))}
        </div>
      )}
      <div className={`screen-stage${screenshots.length === 1 ? " is-single" : ""}`}>
        {screenshots.length > 1 && (
          <button
            type="button"
            className="screen-arrow screen-arrow--prev"
            onClick={(event) => {
              event.stopPropagation();
              onIndex(index - 1);
            }}
            aria-label="Previous image"
          >
            <ChevronLeft aria-hidden="true" />
          </button>
        )}
        <div
          ref={carouselRef}
          className="screen-carousel"
          onClick={(event) => event.stopPropagation()}
          onScroll={(event) => syncScroll(event.currentTarget)}
        >
          {screenshots.map((screen, position) => {
            const ratio = screen.src.width / screen.src.height;
            const shape = ratio >= 1.65 ? "wide" : ratio < 0.8 ? "tall" : "balanced";
            return (
              <button
                type="button"
                key={`${groupId}-${screen.src.src}-${position}`}
                className={`screen-slide screen-slide--${shape}${index === position ? " is-active" : ""}`}
                onClick={(event) => {
                  event.stopPropagation();
                  onIndex(position);
                  onViewer();
                }}
                aria-label={`Open image ${position + 1} of ${screenshots.length}`}
              >
                <Image
                  src={screen.src}
                  alt={screen.alt}
                  fill
                  sizes="(max-width: 800px) 92vw, 82vw"
                  className="screen-slide-image"
                  placeholder="blur"
                  loading={adjacent(position) ? "eager" : "lazy"}
                  fetchPriority={adjacent(position) ? "high" : "auto"}
                  onLoad={(event) =>
                    event.currentTarget.classList.add("is-ready")
                  }
                />
              </button>
            );
          })}
        </div>
        {screenshots.length > 1 && (
          <button
            type="button"
            className="screen-arrow screen-arrow--next"
            onClick={(event) => {
              event.stopPropagation();
              onIndex(index + 1);
            }}
            aria-label="Next image"
          >
            <ChevronRight aria-hidden="true" />
          </button>
        )}
      </div>
      <div className="screen-meta-row">
        <Actions actions={project.access.actions} compact />
        <div
          className="screen-counter"
          aria-label={`Image ${index + 1} of ${screenshots.length}`}
        >
          <span className="screen-counter-current">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="screen-counter-separator" aria-hidden="true">
            /
          </span>
          <span className="screen-counter-total">
            {String(screenshots.length).padStart(2, "0")}
          </span>
          {screenshots.length > 1 && (
            <div className="screen-pagination">
              {screenshots.map((screen, position) => (
                <button
                  type="button"
                  key={`${groupId}-${screen.src.src}-${position}-indicator`}
                  className={index === position ? "active" : ""}
                  onClick={() => onIndex(position)}
                  aria-label={`Show image ${position + 1}`}
                  aria-current={index === position ? "true" : undefined}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
function GroupIcon({ id }: { id: string }) {
  return id === "facility" || id.includes("admin") ? (
    <Monitor aria-hidden="true" />
  ) : (
    <Smartphone aria-hidden="true" />
  );
}

function Overview({ project }: { project: ProjectDetails }) {
  return (
    <section className="project-overview">
      <article className="overview-lead">
        <p>01 — THE PRODUCT</p>
        <h3>{project.summary}</h3>
        <small>{project.type}</small>
      </article>
      <article>
        <p>02 — MY ROLE</p>
        <div>{project.role}</div>
      </article>
      <article>
        <p>03 — KEY FEATURES</p>
        <div className="feature-groups">
          {project.featureGroups.map((group) => (
            <section key={group.label}>
              <b>{group.label}</b>
              <ul>
                {group.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </article>
      <article className="overview-scope">
        <p>04 — PLATFORM SCOPE</p>
        <div className="system-list">
          {project.systems.map((system) => (
            <section key={system.name}>
              <b>{system.name}</b>
              <span>{system.description}</span>
            </section>
          ))}
        </div>
      </article>
      <article>
        <p>05 — PROJECT STATUS</p>
        <div>{project.status}</div>
      </article>
    </section>
  );
}

function Engineering({ project }: { project: ProjectDetails }) {
  return (
    <section className="project-engineering">
      {project.technologies && (
        <article className="engineering-stack">
          <p>TECH STACK</p>
          {Object.entries(project.technologies).map(([group, items]) => (
            <div className="technology-row" key={group}>
              <span>{group}</span>
              <ul>
                {items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </article>
      )}
      {project.architecture?.length && (
        <article className="engineering-architecture">
          <p>SYSTEM ARCHITECTURE</p>
          <div>
            {project.architecture.map((node, index) => (
              <span key={node}>
                {node}
                {index < project.architecture!.length - 1 && (
                  <i aria-hidden="true">→</i>
                )}
              </span>
            ))}
          </div>
        </article>
      )}
      {project.engineeringHighlights?.length && (
        <article className="engineering-highlights">
          <p>ENGINEERING HIGHLIGHTS</p>
          <ol>
            {project.engineeringHighlights.map((item) => (
              <li key={item.title}>
                <b>{item.title}</b>
                <span>{item.description}</span>
              </li>
            ))}
          </ol>
        </article>
      )}
      {project.challenges?.length && (
        <article>
          <p>CHALLENGES & SOLUTIONS</p>
          {project.challenges.map((item) => (
            <div className="challenge-row" key={item.challenge}>
              <b>{item.challenge}</b>
              <span>{item.approach}</span>
            </div>
          ))}
        </article>
      )}
      {project.integrations?.length && (
        <article>
          <p>INTEGRATIONS</p>
          <ul className="integration-list">
            {project.integrations.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      )}
    </section>
  );
}

function TryIt({ project }: { project: ProjectDetails }) {
  return (
    <section
      className="project-access"
      aria-labelledby="project-access-heading"
    >
      <span className="project-access-status">{project.access.status}</span>
      <div>
        <p>PROJECT ACCESS</p>
        <h3 id="project-access-heading">{project.access.heading}</h3>
        <p>{project.access.description}</p>
        {project.access.releaseTarget && (
          <strong>{project.access.releaseTarget}</strong>
        )}
      </div>
      <Actions actions={project.access.actions} />
      {project.access.note && <small>{project.access.note}</small>}
    </section>
  );
}
function Actions({
  actions,
  compact = false,
}: {
  actions: ProjectAction[];
  compact?: boolean;
}) {
  const displayed = compact
    ? actions.filter(
        (action) => action.state === "available" && Boolean(action.href),
      )
    : actions;
  if (!displayed.length) return null;
  return (
    <div
      className={`project-actions${compact ? " project-actions--compact" : ""}`}
    >
      {displayed.map((action) => {
        const store =
          action.kind === "appStore" || action.kind === "googlePlay";
        if (store)
          return (
            <StoreBadge key={action.kind + action.label} action={action} />
          );
        return action.href && action.state === "available" ? (
          <a
            key={action.kind + action.label}
            className={`project-action project-action--${action.kind}`}
            href={action.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${action.label} (opens in a new tab)`}
          >
            <Icon kind={action.kind} />
            <span>
              <small>
                {action.kind === "website"
                  ? "Official website"
                  : "Open project"}
              </small>
              {action.label}
            </span>
            <FaArrowUpRightFromSquare
              aria-hidden="true"
              className="project-action-external"
            />
          </a>
        ) : (
          <span
            key={action.kind + action.label}
            className={`project-action project-action--${action.kind} is-${action.state}`}
            aria-disabled="true"
            title={action.note}
          >
            <Icon kind={action.kind} />
            <span>
              <small>
                {action.state === "coming-soon"
                  ? "Coming soon"
                  : "Link unavailable"}
              </small>
              {action.label}
            </span>
          </span>
        );
      })}
    </div>
  );
}
function StoreBadge({ action }: { action: ProjectAction }) {
  const apple = action.kind === "appStore";
  const available = action.state === "available" && Boolean(action.href);
  const content = (
    <>
      <span className="store-market-badge__icon" aria-hidden="true">
        {apple ? <FaApple /> : <FaGooglePlay />}
      </span>
      <span className="store-market-badge__copy">
        <small>{apple ? "Download on the" : "GET IT ON"}</small>
        <strong>{apple ? "App Store" : "Google Play"}</strong>
        {!available && (
          <em>
            {action.state === "coming-soon"
              ? "Coming soon"
              : "Link unavailable"}
          </em>
        )}
      </span>
    </>
  );
  return available ? (
    <a
      className={`store-market-badge store-market-badge--${apple ? "apple" : "google"}`}
      href={action.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${apple ? "Download on the App Store" : "Get it on Google Play"} (opens in a new tab)`}
    >
      {content}
    </a>
  ) : (
    <span
      className={`store-market-badge store-market-badge--${apple ? "apple" : "google"} is-disabled`}
      aria-disabled="true"
      title={action.note}
    >
      {content}
    </span>
  );
}
function Icon({ kind }: { kind: ProjectAction["kind"] }) {
  if (kind === "appStore")
    return (
      <i aria-hidden="true">
        <FaApple />
      </i>
    );
  if (kind === "googlePlay")
    return (
      <i aria-hidden="true">
        <FaGooglePlay />
      </i>
    );
  if (kind === "github")
    return (
      <i aria-hidden="true">
        <FaGithub />
      </i>
    );
  if (kind === "demo" || kind === "website")
    return (
      <i aria-hidden="true">
        <ExternalLink />
      </i>
    );
  return (
    <i aria-hidden="true">
      <FaArrowUpRightFromSquare />
    </i>
  );
}

function Viewer({
  screenshot,
  index,
  count,
  zoomed,
  onZoom,
  onClose,
  onMove,
}: {
  screenshot: ProjectScreenshot;
  index: number;
  count: number;
  zoomed: boolean;
  onZoom: () => void;
  onClose: () => void;
  onMove: (index: number) => void;
}) {
  const touch = useRef<number | null>(null);
  const start = (event: TouchEvent) => {
    touch.current = event.touches[0]?.clientX ?? null;
  };
  const end = (event: TouchEvent) => {
    if (touch.current === null) return;
    const delta =
      (event.changedTouches[0]?.clientX ?? touch.current) - touch.current;
    if (Math.abs(delta) > 48) onMove(index + (delta < 0 ? 1 : -1));
    touch.current = null;
  };
  return (
    <div
      className="project-image-viewer"
      role="dialog"
      aria-modal="true"
      aria-label="Expanded project image"
      onClick={(event) => event.stopPropagation()}
    >
      <header>
        <span>
          {String(index + 1).padStart(2, "0")} /{" "}
          {String(count).padStart(2, "0")}
        </span>
        <div>
          <button type="button" onClick={onZoom}>
            {zoomed ? "FIT" : "ZOOM"}
          </button>
          <button type="button" onClick={onClose}>
            CLOSE ×
          </button>
        </div>
      </header>
      <div
        className={`viewer-image${zoomed ? " is-zoomed" : ""}`}
        onClick={onZoom}
        onTouchStart={start}
        onTouchEnd={end}
      >
        <Image
          src={screenshot.src}
          alt={screenshot.alt}
          fill
          sizes="100vw"
          className="viewer-img"
          placeholder="blur"
          onLoad={(event) => event.currentTarget.classList.add("is-ready")}
        />
      </div>
      {count > 1 && (
        <>
          <button
            type="button"
            className="viewer-arrow viewer-arrow--prev"
            onClick={() => onMove(index - 1)}
            aria-label="Previous image"
          >
            <ChevronLeft aria-hidden="true" />
          </button>
          <button
            type="button"
            className="viewer-arrow viewer-arrow--next"
            onClick={() => onMove(index + 1)}
            aria-label="Next image"
          >
            <ChevronRight aria-hidden="true" />
          </button>
        </>
      )}
    </div>
  );
}
