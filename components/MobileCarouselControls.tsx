"use client";

import { RefObject, useEffect, useRef, useState } from "react";

type Props = {
  trackRef: RefObject<HTMLDivElement | null>;
  count: number;
  label: string;
  itemSelector: string;
};

export default function MobileCarouselControls({ trackRef, count, label, itemSelector }: Props) {
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);

  useEffect(() => {
    const media = matchMedia("(max-width: 900px)");
    let cleanup = () => {};
    const setup = () => {
      cleanup();
      const track = trackRef.current;
      if (!media.matches || !track) return;
      let frame = 0;
      const update = () => {
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(() => {
          const items = [...track.querySelectorAll<HTMLElement>(itemSelector)];
          const center = track.scrollLeft + track.clientWidth / 2;
          let closest = 0;
          items.forEach((item, index) => {
            const itemCenter = item.offsetLeft + item.offsetWidth / 2;
            if (Math.abs(itemCenter - center) < Math.abs((items[closest]?.offsetLeft ?? 0) + (items[closest]?.offsetWidth ?? 0) / 2 - center)) closest = index;
          });
          activeRef.current = closest;
          setActive(closest);
        });
      };
      const keydown = (event: KeyboardEvent) => {
        if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
        event.preventDefault();
        const next = Math.max(0, Math.min(count - 1, activeRef.current + (event.key === "ArrowRight" ? 1 : -1)));
        scrollTo(next);
      };
      track.addEventListener("scroll", update, { passive: true });
      track.addEventListener("keydown", keydown);
      const observer = new ResizeObserver(update);
      observer.observe(track);
      update();
      cleanup = () => {
        cancelAnimationFrame(frame);
        observer.disconnect();
        track.removeEventListener("scroll", update);
        track.removeEventListener("keydown", keydown);
      };
    };
    const scrollTo = (index: number) => {
      const track = trackRef.current;
      const item = track?.querySelectorAll<HTMLElement>(itemSelector)[index];
      if (!track || !item) return;
      track.scrollTo({ left: item.offsetLeft - parseFloat(getComputedStyle(track).paddingLeft || "0"), behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    };
    setup();
    media.addEventListener("change", setup);
    return () => { cleanup(); media.removeEventListener("change", setup); };
  }, [count, itemSelector, trackRef]);

  const goTo = (index: number) => {
    const track = trackRef.current;
    const item = track?.querySelectorAll<HTMLElement>(itemSelector)[index];
    if (!track || !item) return;
    track.scrollTo({ left: item.offsetLeft - parseFloat(getComputedStyle(track).paddingLeft || "0"), behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  };

  return (
    <div className="mobile-carousel-controls" aria-label={`${label} carousel controls`}>
      <span className="mobile-swipe-hint">SWIPE <b>↔</b></span>
      <div className="mobile-carousel-dots">
        {Array.from({ length: count }, (_, index) => <button type="button" key={index} className={active === index ? "is-active" : ""} aria-label={`Show ${label} ${index + 1}`} aria-current={active === index ? "true" : undefined} onClick={() => goTo(index)}><i /></button>)}
      </div>
      <span className="mobile-carousel-count"><b>{String(active + 1).padStart(2, "0")}</b> / {String(count).padStart(2, "0")}</span>
    </div>
  );
}
