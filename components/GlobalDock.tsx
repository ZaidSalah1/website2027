"use client";

import { useEffect, useState } from "react";
import { BriefcaseBusiness, Cpu, Home, Mail, Workflow, type LucideIcon } from "lucide-react";

const destinations: ReadonlyArray<{ id: string; label: string; icon: LucideIcon }> = [
  { id: "home", label: "HOME", icon: Home },
  { id: "projects", label: "WORK", icon: BriefcaseBusiness },
  { id: "skills", label: "SKILLS", icon: Cpu },
  { id: "behind-build", label: "PROCESS", icon: Workflow },
  { id: "contact", label: "CONTACT", icon: Mail },
];

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
    <nav className="dock global-dock" aria-label="Primary navigation" style={{ "--dock-active": destinations.findIndex((item) => item.id === active) } as React.CSSProperties}>
      <span className="dock-active-pill" aria-hidden="true" />
      {destinations.map((destination) => {
        const Icon = destination.icon;
        const isActive = active === destination.id;
        return (
          <a
            key={destination.id}
            className={isActive ? "active" : undefined}
            href={`#${destination.id}`}
            aria-current={isActive ? "location" : undefined}
            aria-label={`Go to ${destination.label.toLowerCase()}`}
          >
            <Icon className="dock-icon" size={14} strokeWidth={1.75} aria-hidden="true" />
            <span className="dock-label">{destination.label}</span>
          </a>
        );
      })}
    </nav>
  );
}
