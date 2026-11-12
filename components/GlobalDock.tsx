"use client";

import { useEffect, useState } from "react";

const destinations = [
  { id: "home", label: "HOME", short: "H" },
  { id: "projects", label: "WORK", short: "W" },
  { id: "skills", label: "SKILLS", short: "S" },
  { id: "behind-build", label: "PROCESS", short: "P" },
  { id: "contact", label: "CONTACT", short: "C" },
] as const;

export default function GlobalDock() {
  const [active, setActive] = useState<string>("home");

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const marker = window.innerHeight * 0.48;
      let next: string = destinations[0].id;
      for (const destination of destinations) {
        const section = document.getElementById(destination.id);
        if (section && section.getBoundingClientRect().top <= marker) next = destination.id;
      }
      setActive((current) => current === next ? current : next);
    };
    const queueUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", queueUpdate, { passive: true });
    window.addEventListener("resize", queueUpdate);
    return () => {
      window.removeEventListener("scroll", queueUpdate);
      window.removeEventListener("resize", queueUpdate);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <nav className="dock global-dock" aria-label="Primary navigation">
      {destinations.map((destination, index) => (
        <a
          key={destination.id}
          className={active === destination.id ? "active" : undefined}
          href={`#${destination.id}`}
          aria-current={active === destination.id ? "location" : undefined}
          aria-label={`Go to ${destination.label.toLowerCase()}`}
        >
          <span className="dock-index" aria-hidden="true">0{index + 1}</span>
          <span className="dock-label">{destination.label}</span>
          <span className="dock-short" aria-hidden="true">{destination.short}</span>
        </a>
      ))}
      <span className="dock-status" aria-hidden="true">{String(destinations.findIndex((item) => item.id === active) + 1).padStart(2, "0")} / 05</span>
    </nav>
  );
}
