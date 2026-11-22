"use client";

import { useEffect, useState } from "react";

const MINIMUM_MS = 2500;
const FALLBACK_MS = 7000;

export default function SitePreloader() {
  const [exiting, setExiting] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [progress, setProgress] = useState(8);

  useEffect(() => {
    let finished = false;
    let completionTimer = 0;
    let hiddenTimer = 0;
    document.documentElement.dataset.preloading = "true";

    const markReady = (value: number) => {
      if (!finished) setProgress((current) => Math.max(current, value));
    };

    const waitForHero = async () => {
      const portrait = document.querySelector<HTMLImageElement>("[data-critical-asset='hero-portrait']");
      if (portrait) {
        if (!portrait.complete || portrait.naturalWidth === 0) {
          await new Promise<void>((resolve) => {
            const done = () => resolve();
            portrait.addEventListener("load", done, { once: true });
            portrait.addEventListener("error", done, { once: true });
          });
        }
        if (portrait.complete && portrait.naturalWidth > 0) await portrait.decode().catch(() => undefined);
      }
    };

    const heroReady = waitForHero().then(() => markReady(88));
    const fontsReady = (document.fonts?.ready ?? Promise.resolve()).then(() => markReady(62));
    const interfaceReady = new Promise<void>((resolve) =>
      requestAnimationFrame(() => requestAnimationFrame(() => {
        markReady(32);
        resolve();
      })),
    );
    const readiness = Promise.all([heroReady, fontsReady, interfaceReady]);
    const fallback = new Promise<void>((resolve) => window.setTimeout(resolve, FALLBACK_MS));
    const minimum = new Promise<void>((resolve) => window.setTimeout(resolve, MINIMUM_MS));

    Promise.all([Promise.race([readiness, fallback]), minimum]).then(() => {
      finished = true;
      setProgress(100);
      completionTimer = window.setTimeout(() => {
        setExiting(true);
        delete document.documentElement.dataset.preloading;
        window.dispatchEvent(new CustomEvent("portfolio:ready"));
        requestAnimationFrame(() => window.dispatchEvent(new Event("resize")));
        hiddenTimer = window.setTimeout(() => setHidden(true), 720);
      }, 120);
    });

    return () => {
      finished = true;
      window.clearTimeout(completionTimer);
      window.clearTimeout(hiddenTimer);
      delete document.documentElement.dataset.preloading;
    };
  }, []);

  if (hidden) return null;
  return (
    <div id="site-preloader" className={`site-preloader${exiting ? " is-exiting" : ""}`} role="status" aria-live="polite" aria-label="Preparing portfolio">
      <div className="preloader-grid" aria-hidden="true" />
      <div className="preloader-orbit" aria-hidden="true"><i /><i /></div>
      <div className="preloader-content">
        <span className="preloader-kicker">PORTFOLIO / INITIALIZING</span>
        <div className="preloader-name"><strong>ZAID</strong><strong>SALAH</strong></div>
        <div className="preloader-status"><span>OBSIDIAN INTERFACE</span><b>{String(Math.round(progress)).padStart(3, "0")}%</b></div>
        <div className="preloader-rail" role="progressbar" aria-label="Portfolio loading progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress)}><i style={{ transform: `scaleX(${progress / 100})` }} /></div>
      </div>
    </div>
  );
}
