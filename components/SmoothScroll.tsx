"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { createStoryWheelLimiter } from "../lib/pinnedStoryMomentum";

const EASE_OUT_QUART = (value: number) => 1 - Math.pow(1 - value, 4);

export default function SmoothScroll() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const media = window.matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
    let lenis: Lenis | null = null;
    let mutationObserver: MutationObserver | null = null;
    let readyFrame = 0;

    const destroy = () => {
      if (!lenis) return;
      mutationObserver?.disconnect();
      mutationObserver = null;
      gsap.ticker.remove(tick);
      lenis.off("scroll", ScrollTrigger.update);
      lenis.destroy();
      lenis = null;
      gsap.ticker.lagSmoothing(500, 33);
      document.documentElement.classList.remove("has-premium-scroll");
    };

    const tick = (time: number) => lenis?.raf(time * 1000);

    const restoreModalPosition = (event: Event) => {
      const restoreY = (event as CustomEvent<number>).detail;
      if (!Number.isFinite(restoreY)) return;
      window.scrollTo({ top: restoreY, left: 0, behavior: "instant" });
      if (!lenis) return;
      lenis.start();
      lenis.scrollTo(restoreY, { immediate: true, force: true });
      delete document.body.dataset.projectModalRestoreY;
      if (readyFrame) cancelAnimationFrame(readyFrame);
      readyFrame = requestAnimationFrame(() => {
        ScrollTrigger.refresh();
        window.scrollTo({ top: restoreY, left: 0, behavior: "instant" });
        lenis?.scrollTo(restoreY, { immediate: true, force: true });
      });
    };

    const create = () => {
      destroy();
      if (!media.matches || navigator.maxTouchPoints > 0) return;

      const limitStoryWheel = createStoryWheelLimiter();
      lenis = new Lenis({
        lerp: 0.16,
        smoothWheel: true,
        syncTouch: false,
        wheelMultiplier: 0.92,
        overscroll: false,
        anchors: { duration: 0.78, easing: EASE_OUT_QUART },
        stopInertiaOnNavigate: true,
        respectReducedMotion: true,
        virtualScroll: (data) => {
          if (lenis && data.event.type === "wheel" && !(data.event as WheelEvent).ctrlKey &&
              document.body.dataset.projectModalOpen !== "true") {
            const delta = limitStoryWheel(data.deltaY, lenis.targetScroll, performance.now());
            if (data.deltaY && delta === 0 && !data.deltaX) {
              if (data.event.cancelable) data.event.preventDefault();
              return false;
            }
            data.deltaY = delta;
          }
          return true;
        },
        prevent: (node) => Boolean(node.closest(".project-modal-layer, .project-image-viewer, .screen-carousel, [data-lenis-prevent]")),
      });

      document.documentElement.classList.add("has-premium-scroll");
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);

      const syncLock = () => {
        if (!lenis) return;
        const locked = document.documentElement.dataset.preloading === "true" || document.body.dataset.projectModalOpen === "true";
        if (locked) lenis.stop();
        else {
          const restoreValue = document.body.dataset.projectModalRestoreY;
          const restoreY = restoreValue === undefined ? window.scrollY : Number(restoreValue);
          lenis.start();
          if (Number.isFinite(restoreY)) {
            window.scrollTo({ top: restoreY, left: 0, behavior: "instant" });
            lenis.scrollTo(restoreY, { immediate: true, force: true });
          }
          delete document.body.dataset.projectModalRestoreY;
          readyFrame = requestAnimationFrame(() => {
            ScrollTrigger.refresh();
            if (Number.isFinite(restoreY)) {
              lenis?.scrollTo(restoreY, { immediate: true, force: true });
            }
          });
        }
      };

      mutationObserver = new MutationObserver(syncLock);
      mutationObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-preloading"] });
      mutationObserver.observe(document.body, { attributes: true, attributeFilter: ["data-project-modal-open"] });
      syncLock();
    };

    create();
    window.addEventListener("project-modal-restore", restoreModalPosition);
    media.addEventListener("change", create);
    return () => {
      window.removeEventListener("project-modal-restore", restoreModalPosition);
      media.removeEventListener("change", create);
      if (readyFrame) cancelAnimationFrame(readyFrame);
      destroy();
    };
  }, []);

  return null;
}
