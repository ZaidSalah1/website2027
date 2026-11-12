"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function ReadyTransition() {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const context = gsap.context(() => {
      const media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.timeline({
          scrollTrigger: {
            id: "ready-transition", trigger: root.current, start: "top top", end: "bottom bottom",
            pin: stage.current, pinSpacing: false, scrub: 1, anticipatePin: 1, invalidateOnRefresh: true,
          },
        })
          .fromTo(".ready-stage", { clipPath: "inset(3% 2% 3% 2% round 2.5rem)" }, { clipPath: "inset(0% 0% 0% 0% round 0rem)", duration: 0.18, ease: "power2.out" })
          .fromTo(".ready-word", { scale: 0.78, letterSpacing: "-.11em" }, { scale: 1, letterSpacing: "-.08em", duration: 0.24, ease: "power2.out" }, 0)
          .fromTo(".ready-meta", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.16, ease: "power2.out" }, 0.05)
          .to(".ready-word", { scale: 1.035, duration: 0.48, ease: "power1.inOut" }, 0.24)
          .to(".ready-word", { scale: 1.07, yPercent: -4, duration: 0.28, ease: "power1.inOut" }, 0.72)
          .to(".ready-meta", { opacity: 0.25, y: -10, duration: 0.22 }, 0.78)
          .to(".ready-stage", { clipPath: "inset(0% 0% 7% 0% round 0 0 2.5rem 2.5rem)", duration: 0.18, ease: "power1.in" }, 0.82);
      });
      return () => media.revert();
    }, root);
    return () => context.revert();
  }, []);

  return (
    <section ref={root} className="ready-transition" aria-labelledby="ready-title">
      <div ref={stage} className="ready-stage">
        <div className="ready-meta ready-meta--top"><span>03 / SYSTEM CHECK</span><span>NEXT: TECH MATRIX</span></div>
        <div className="ready-center">
          <p className="ready-meta">WHAT&apos;S NEXT?</p>
          <h2 className="ready-word" id="ready-title">READY?</h2>
          <p className="ready-meta ready-sub">LET&apos;S BUILD THE FUTURE.</p>
        </div>
        <div className="ready-meta ready-meta--bottom"><span>SCROLL / CONTINUE</span><span>↓</span></div>
      </div>
    </section>
  );
}
