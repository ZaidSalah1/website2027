# Cinematic Portfolio — Experience Analysis and Architecture

## Scope

This document separates direct observations from planned adaptations. The Hero is approved and frozen. The current implementation milestone is **Projects Showcase only**.

## Verified observations

Observed in Microsoft Edge at 1440 × 900 on 2026-11-12, using a full-document browser pass and scroll samples every 450px.

- The reference is a normal vertical document, not a globally horizontal site.
- It uses persistent fixed chrome, a layered viewport-scale Hero, a long pinned Journey sequence, a full-screen lime interruption, and natural-flow grids and cards.
- Its current Projects section is vertically stacked. Horizontal project storytelling is therefore our deliberate adaptation rather than a claimed reference behavior.
- The visual system combines oversized condensed typography, tiny monospaced labels, fine borders, near-black surfaces, sparse lime accents, and generous negative space.
- The supplied screenshots confirm a dark-first direction and deliberate alternation between dense dark scenes and flat lime transitions.

## Assumptions to confirm later

- Working name is `ZAID`; working role is `FULL-STACK PRODUCT ENGINEER`.
- Seha Plus and Drevr are the first two case-study chapters. Final metrics, links, screenshots, and detailed copy still need supplied facts.
- Motion uses native vertical scrolling plus GSAP ScrollTrigger. No global smooth-scroll library will be added unless testing proves it necessary.

## Full scroll architecture

The page remains a normal vertical document. Horizontal movement exists only inside explicit desktop storytelling chapters, and multiple such chapters alternate with ordinary vertical sections.

1. **Hero — natural vertical entry (approved / frozen)**
   - 100svh layered stage with an unpinned scroll exit.

2. **Projects Showcase — horizontal chapter (current milestone)**
   - A natural vertical prelude introduces the section before pinning begins.
   - Desktop pins one 100svh stage and translates a measured horizontal track.
   - Seha Plus, Drevr, and a final systems chapter each occupy a viewport-scale panel.
   - Scroll distance is derived from actual track overflow, not fixed magic numbers.
   - A natural vertical outro restores the document axis after unpinning.
   - Mobile and reduced-motion modes render the same content as a normal vertical stack.

3. **READY? — vertical cinematic transition**
   - Full-screen lime interruption in normal document flow with a short local reveal timeline.

4. **Tech Matrix — natural vertical browsing**
   - Responsive grid with lightweight focus/hover responses and no pinning.

5. **Career / Journey — second independent horizontal chapter**
   - Its own wrapper, track measurement, ScrollTrigger ID, pin duration, and cleanup.
   - Timeline phases advance chronologically while vertical wheel/touch input remains native.
   - Mobile becomes a vertical timeline rather than a compressed horizontal canvas.

6. **Selected proof / principles — natural vertical section, only if content warrants it**

7. **Contact — natural vertical close**
   - Large lime invitation followed by a concise footer.

Additional horizontal chapters may be added only when they improve narrative comprehension. No global horizontal scroller will be introduced.

## Horizontal section contract

Every horizontal chapter must:

- own a unique root, stage, and track ref;
- create a namespaced `gsap.context()` / `gsap.matchMedia()` lifecycle;
- calculate `scrollWidth - viewportWidth` during refresh;
- use a local ScrollTrigger with pinning, scrubbing, anticipation, invalidation, and pin spacing;
- reserve vertical entry and exit space so axis changes never feel abrupt;
- keep the browser’s native vertical input and avoid global scroll interception;
- use local progress UI rather than a global scroll proxy;
- revert its media-query context and kill all owned triggers on unmount;
- disable pinning for mobile and reduced motion;
- preserve semantic reading order when JavaScript is disabled.

## Component boundaries

- `Hero`: approved Hero and its isolated animation lifecycle.
- `HorizontalChapter`: reusable measured pin/track lifecycle contract for multiple independent sections.
- `ProjectsShowcase`: first concrete horizontal chapter and its local progress system.
- `ProjectPanel`: content-only reusable project chapter.
- `CareerJourney`: later, separate horizontal chapter with its own timeline instance.
- `ReadyTransition`, `TechMatrix`, `Contact`: independently testable vertical sections.

## Performance and stability rules

- Animate transforms, opacity, clip-path, and CSS custom properties only.
- Recalculate after fonts and images settle; invalidate measurements on refresh.
- Use `clamp()` and layout tokens instead of viewport-specific pixel patches.
- Disable pinning below the desktop breakpoint and honor `prefers-reduced-motion`.
- Preserve focus states and semantic source order.
- Avoid global scroll interception and multiple smooth-scrolling systems.

## Milestones

1. Reference audit and architecture — complete.
2. Hero implementation and browser QA — approved and frozen.
3. Projects Showcase horizontal chapter — current milestone.
4. READY? vertical transition.
5. Tech Matrix vertical section.
6. Career / Journey second independent horizontal chapter.
7. Supporting proof and Contact vertical close.
8. Whole-page transition tuning, cross-browser QA, accessibility, and performance polish.
