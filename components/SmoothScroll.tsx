"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

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

    const create = () => {
      destroy();
      if (!media.matches || navigator.maxTouchPoints > 0) return;

      lenis = new Lenis({
        lerp: 0.16,
        smoothWheel: true,
        syncTouch: false,
        wheelMultiplier: 0.92,
        overscroll: false,
        anchors: { duration: 0.78, easing: EASE_OUT_QUART },
        stopInertiaOnNavigate: true,
        respectReducedMotion: true,
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
          lenis.start();
          lenis.scrollTo(window.scrollY, { immediate: true, force: true });
          readyFrame = requestAnimationFrame(() => ScrollTrigger.refresh());
        }
      };

      mutationObserver = new MutationObserver(syncLock);
      mutationObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-preloading"] });
      mutationObserver.observe(document.body, { attributes: true, attributeFilter: ["data-project-modal-open"] });
      syncLock();
    };

    create();
    media.addEventListener("change", create);
    return () => {
      media.removeEventListener("change", create);
      if (readyFrame) cancelAnimationFrame(readyFrame);
      destroy();
    };
  }, []);

  return null;
}
