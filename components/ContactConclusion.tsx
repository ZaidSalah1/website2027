"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight, Download, Mail } from "lucide-react";
import { SiGithub } from "react-icons/si";
import { FaLinkedinIn } from "react-icons/fa6";

const navigation = [
  ["HOME", "#"], ["PROJECTS", "#projects"], ["PROCESS", "#behind-build"], ["SKILLS", "#skills"], ["CONTACT", "#contact"],
];
const socials = [
  { label:"LINKEDIN", eyebrow:"PROFESSIONAL NETWORK", href:null, icon:FaLinkedinIn },
  { label:"GITHUB", eyebrow:"CODE & PROJECTS", href:"https://github.com/ZaidSalah1", icon:SiGithub },
  { label:"EMAIL", eyebrow:"DIRECT CONTACT", href:null, icon:Mail },
];
const technologies = ["REACT", "REACT NATIVE", "TYPESCRIPT", "NODE.JS", "POSTGRESQL", "NEXT.JS"];
const resumeHref: string | null = null;

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
          .fromTo(".contact-role-ghost", { xPercent: -2 }, { xPercent: 2, ease: "none" })
          .fromTo(".contact-portrait", { y: 20 }, { y: -14, ease: "none" }, 0)
          .fromTo(".contact-menu", { y: 8 }, { y: -6, ease: "none" }, 0)
          .fromTo(".contact-socials", { y: -6 }, { y: 8, ease: "none" }, 0);
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
          <div><p>PRODUCT ENGINEER / PORTFOLIO</p><h2 className="contact-name" id="contact-heading">ZAID <span>SALAH</span></h2></div>
          {resumeHref
            ? <a className="contact-resume" href={resumeHref} download><Download aria-hidden="true"/> DOWNLOAD RESUME <ArrowUpRight aria-hidden="true"/></a>
            : <span className="contact-resume is-disabled" aria-disabled="true"><Download aria-hidden="true"/> DOWNLOAD RESUME</span>}
        </header>

        <div className="contact-role-ghost" aria-hidden="true">LET&apos;S BUILD</div>
        <div className="contact-center">
          <nav className="contact-menu" aria-label="Footer navigation">
            <p>NAVIGATION / INDEX</p>
            <ul>{navigation.map(([label,href],index)=><li key={label}><a href={href}><small>0{index+1}</small><span>{label}</span><b><ArrowUpRight aria-hidden="true"/></b></a></li>)}</ul>
          </nav>

          <div className="contact-portrait">
            <div className="portrait-halo" aria-hidden="true" />
            <Image src="/zaid-portrait.png" alt="Zaid Salah wearing a light gray suit" fill sizes="(max-width: 760px) 72vw, 31vw" className="contact-portrait-image" />
          </div>

          <nav className="contact-socials" aria-label="Social links">
            <p>CONNECT / SOCIAL</p>
            <ul>{socials.map(({label,eyebrow,href,icon:Icon})=><li key={label}><a href={href ?? "#"} className={href ? undefined : "is-disabled"} aria-disabled={href ? undefined : "true"} onClick={href ? undefined : (event)=>event.preventDefault()} target={href?.startsWith("http")?"_blank":undefined} rel={href?.startsWith("http")?"noreferrer":undefined}><Icon aria-hidden="true"/><span><small>{eyebrow}</small>{label}</span><b><ArrowUpRight aria-hidden="true"/></b></a></li>)}</ul>
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
