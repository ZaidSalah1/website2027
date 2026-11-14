"use client";

import Image, { getImageProps } from "next/image";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import type { ProjectHeroMedia } from "../data/projectHeroMedia";

const preloadCache = new Map<string, Promise<void>>();

export function preloadProjectImage(source: ProjectHeroMedia["images"][number], sizes: string) {
  if (typeof window === "undefined") return Promise.resolve();
  const key = `${source.src}|${sizes}`;
  const cached = preloadCache.get(key);
  if (cached) return cached;
  const promise = new Promise<void>((resolve) => {
    const { props } = getImageProps({ src: source, alt: "", fill: true, sizes });
    const image = new window.Image();
    image.decoding = "async";
    image.sizes = props.sizes ?? sizes;
    if (props.srcSet) image.srcset = props.srcSet;
    image.src = props.src;
    image.onload = () => image.decode().catch(() => undefined).finally(resolve);
    image.onerror = () => resolve();
  });
  preloadCache.set(key, promise);
  return promise;
}

export default function GlitchProjectImage({ media, alt, className, sizes, critical = false, enabled = true }: { media: ProjectHeroMedia; alt: string; className: string; sizes: string; critical?: boolean; enabled?: boolean }) {
  const root = useRef<HTMLDivElement>(null);
  const currentRef = useRef(0);
  const timerRef = useRef<number | null>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const transitioningRef = useRef(false);
  const intersectingRef = useRef(false);
  const [current, setCurrent] = useState(0);
  const [incoming, setIncoming] = useState(media.images.length > 1 ? 1 : 0);
  const [currentReady, setCurrentReady] = useState(false);
  const animated = media.transition === "glitch" && media.images.length > 1;

  useEffect(() => {
    currentRef.current = 0;
    setCurrent(0);
    setIncoming(media.images.length > 1 ? 1 : 0);
    setCurrentReady(false);
  }, [media]);

  useEffect(() => {
    if (!enabled || !animated || !root.current || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const element = root.current;
    const projectPanel = element.closest<HTMLElement>("[data-project-active]");

    const clearTimer = () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
      timerRef.current = null;
    };
    const eligible = () => intersectingRef.current && document.visibilityState === "visible" && document.body.dataset.projectModalOpen !== "true" && (!projectPanel || projectPanel.dataset.projectActive === "true");
    const schedule = () => {
      clearTimer();
      if (!eligible() || transitioningRef.current) return;
      timerRef.current = window.setTimeout(transition, media.intervalMs ?? 4500);
    };
    const transition = async () => {
      if (!eligible() || transitioningRef.current) { schedule(); return; }
      transitioningRef.current = true;
      const next = (currentRef.current + 1) % media.images.length;
      setIncoming(next);
      await new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
      const decodedLayers = [...(root.current?.querySelectorAll<HTMLImageElement>(".glitch-incoming, .glitch-slice") ?? [])];
      try {
        await Promise.all(decodedLayers.map((image) => image.decode()));
      } catch {
        transitioningRef.current = false;
        schedule();
        return;
      }
      requestAnimationFrame(() => {
        if (!root.current || !eligible()) { transitioningRef.current = false; schedule(); return; }
        const currentLayer = root.current.querySelector<HTMLElement>(".glitch-current");
        const incomingLayer = root.current.querySelector<HTMLElement>(".glitch-incoming");
        const slices = root.current.querySelectorAll<HTMLElement>(".glitch-slice");
        gsap.set(incomingLayer, { opacity: 0, x: 0 });
        gsap.set(slices, { opacity: 0, x: 0 });
        timelineRef.current = gsap.timeline({
          onComplete: () => {
            currentRef.current = next;
            setCurrent(next);
            setIncoming((next + 1) % media.images.length);
            requestAnimationFrame(() => {
              gsap.set(currentLayer, { opacity: 1, x: 0, filter: "none" });
              gsap.set(incomingLayer, { opacity: 0, x: 0 });
              gsap.set(slices, { opacity: 0, x: 0 });
              transitioningRef.current = false;
              schedule();
            });
          },
        })
          .to(currentLayer, { x: -2, filter: "drop-shadow(3px 0 rgba(255,70,110,.55)) drop-shadow(-3px 0 rgba(57,205,255,.55))", duration: .08, ease: "steps(2)" })
          .set(slices, { opacity: .9 }, .07)
          .to(slices[0], { x: 7, duration: .09, ease: "steps(3)" }, .07)
          .to(slices[1], { x: -6, duration: .11, ease: "steps(3)" }, .08)
          .to(slices[2], { x: 4, duration: .08, ease: "steps(2)" }, .11)
          .set(incomingLayer, { opacity: 1 }, .19)
          .to(currentLayer, { opacity: 0, x: 2, duration: .11, ease: "power1.in" }, .19)
          .to(slices, { x: 0, opacity: 0, duration: .16, stagger: .025, ease: "power2.out" }, .25)
          .to(incomingLayer, { x: 0, filter: "none", duration: .12, ease: "power2.out" }, .29);
      });
    };
    const cancelTransition = () => {
      timelineRef.current?.kill();
      timelineRef.current = null;
      gsap.set(element.querySelector(".glitch-current"), { opacity: 1, x: 0, filter: "none" });
      gsap.set(element.querySelector(".glitch-incoming"), { opacity: 0, x: 0, filter: "none" });
      gsap.set(element.querySelectorAll(".glitch-slice"), { opacity: 0, x: 0 });
      transitioningRef.current = false;
    };
    const sync = () => { if (eligible()) schedule(); else { clearTimer(); cancelTransition(); } };
    const observer = new IntersectionObserver(([entry]) => { intersectingRef.current = entry.isIntersecting; sync(); }, { threshold: .35 });
    observer.observe(element);
    const mutation = new MutationObserver(sync);
    if (projectPanel) mutation.observe(projectPanel, { attributes: true, attributeFilter: ["data-project-active"] });
    mutation.observe(document.body, { attributes: true, attributeFilter: ["data-project-modal-open"] });
    document.addEventListener("visibilitychange", sync);
    return () => {
      clearTimer();
      observer.disconnect();
      mutation.disconnect();
      document.removeEventListener("visibilitychange", sync);
      timelineRef.current?.kill();
    };
  }, [animated, enabled, media]);

  if (!enabled) return <div className="glitch-project-image is-pending" data-transition={animated ? "glitch" : "static"} data-image-index="pending"><span className="glitch-placeholder" aria-hidden="true" /></div>;

  const currentImage = media.images[current] ?? media.images[0];
  const incomingImage = media.images[incoming] ?? currentImage;
  return <div ref={root} className={`glitch-project-image${currentReady ? " is-ready" : " is-loading"}`} data-transition={animated ? "glitch" : "static"} data-image-index={current}>
    <span className="glitch-placeholder" aria-hidden="true" />
    <Image src={currentImage} alt={alt} fill sizes={sizes} className={`${className} glitch-current${currentReady ? " is-ready" : ""}`} placeholder="empty" loading={critical ? "eager" : "lazy"} fetchPriority={critical ? "high" : "auto"} decoding="async" onLoad={(event) => event.currentTarget.decode().catch(() => undefined).finally(() => setCurrentReady(true))} />
    {animated && <>
      <Image src={incomingImage} alt="" aria-hidden fill sizes={sizes} className={`${className} glitch-incoming`} placeholder="empty" loading="lazy" decoding="async" />
      {["top", "middle", "bottom"].map((slice) => <Image key={slice} src={incomingImage} alt="" aria-hidden fill sizes={sizes} className={`${className} glitch-slice glitch-slice--${slice}`} placeholder="empty" loading="lazy" decoding="async" />)}
    </>}
  </div>;
}
