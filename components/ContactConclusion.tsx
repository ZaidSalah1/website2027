"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const navigation = [
  ["HOME", "#"], ["ABOUT", "#behind-build"], ["SKILLS", "#skills"], ["PROJECTS", "#projects"], ["CONTACT", "#contact"],
];
const socials = [
  ["LINKEDIN", "https://www.linkedin.com/in/your-username"],
  ["GITHUB", "https://github.com/your-username"],
  ["EMAIL", "mailto:your.email@example.com"],
];
const technologies = ["REACT", "REACT NATIVE", "TYPESCRIPT", "NODE.JS", "POSTGRESQL", "NEXT.JS"];

export default function ContactConclusion() {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const context = gsap.context(() => {
      const media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.timeline({ scrollTrigger: { id: "contact-reveal", trigger: root.current, start: "top 92%", end: "top 12%", scrub: 1, invalidateOnRefresh: true } })
          .fromTo(".contact-panel", { clipPath: "inset(7% 1.5% 0% 1.5% round 3.2rem)" }, { clipPath: "inset(0% 0% 0% 0% round 2.8rem)", ease: "power2.out" })
          .fromTo(".contact-name, .contact-resume", { y: 24, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.05, ease: "power2.out" }, 0.05)
          .fromTo(".contact-menu li, .contact-socials li", { y: 28, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.035, ease: "power2.out" }, 0.12)
          .fromTo(".contact-portrait", { yPercent: 12, scale: 0.97 }, { yPercent: 0, scale: 1, ease: "power2.out" }, 0.08);
        gsap.timeline({ scrollTrigger: { id: "contact-depth", trigger: root.current, start: "top bottom", end: "bottom bottom", scrub: 1.1 } })
          .fromTo(".contact-role-ghost", { xPercent: -4 }, { xPercent: 4, ease: "none" })
          .fromTo(".contact-portrait", { y: 24 }, { y: -18, ease: "none" }, 0)
          .fromTo(".contact-menu", { y: 12 }, { y: -8, ease: "none" }, 0)
          .fromTo(".contact-socials", { y: -8 }, { y: 12, ease: "none" }, 0);
      });
      return () => media.revert();
    }, root);
    return () => context.revert();
  }, []);

  const marquee = [...technologies, ...technologies];
  return (
    <section ref={root} id="contact" className="contact-conclusion" aria-labelledby="contact-heading">
      <div className="contact-panel">
        <div className="contact-notch" aria-hidden="true" />
        <div className="contact-line-art" aria-hidden="true"><i/><i/><i/></div>
        <header className="contact-panel-top">
          <h2 className="contact-name" id="contact-heading">ZAID<br/><span>SALAH</span></h2>
          <a className="contact-resume" href="#" aria-disabled="true" onClick={(event)=>event.preventDefault()}><span>▤</span> DOWNLOAD RESUME <small>PLACEHOLDER</small><b>↗</b></a>
        </header>

        <div className="contact-role-ghost" aria-hidden="true">SOFTWARE ENGINEER</div>
        <div className="contact-center">
          <nav className="contact-menu" aria-label="Footer navigation">
            <p>LINKS / MENU</p>
            <ul>{navigation.map(([label,href])=><li key={label}><a href={href}>{label}<span>↗</span></a></li>)}</ul>
          </nav>

          <div className="contact-portrait">
            <div className="portrait-halo" aria-hidden="true" />
            <Image src="/zaid-portrait.png" alt="Zaid Salah wearing a light gray suit" fill sizes="(max-width: 760px) 72vw, 31vw" className="contact-portrait-image" />
          </div>

          <nav className="contact-socials" aria-label="Social links">
            <p>CONNECT / SOCIAL</p>
            <ul>{socials.map(([label,href])=><li key={label}><a href={href} target={label==="EMAIL"?undefined:"_blank"} rel={label==="EMAIL"?undefined:"noreferrer"}><span>{label}</span><small>PLACEHOLDER</small><b>↗</b></a></li>)}</ul>
          </nav>
        </div>

        <div className="contact-marquee" aria-label={`Technologies: ${technologies.join(", ")}`}>
          <div className="contact-marquee-track" aria-hidden="true">{marquee.map((tech,index)=><span key={`${tech}-${index}`}><i>✦</i>{tech}</span>)}</div>
        </div>
      </div>

      <footer className="site-footer">
        <p>© 2026 ZAID SALAH. BUILT WITH INTENT.</p>
        <a href="#">BACK TO TOP ↑</a>
        <span>PALESTINE / REMOTE</span>
      </footer>
    </section>
  );
}
