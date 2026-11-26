import gsap from "gsap";
import type { ScrollTrigger } from "gsap/ScrollTrigger";

const threshold = 8;
const edgeInset = 24;
const releaseWindow = 75;
const maxCoast = 72;
const tapTarget = "a, button, label, summary, [role='button']";
const nativeControl = "input, select, textarea, [contenteditable], [data-lenis-prevent]";

export function bindPinnedStorySwipe(
  stage: HTMLElement,
  trigger: ScrollTrigger,
  scrollPerPixel: number,
  panelCount: number,
  travelStart: number,
  travelDuration: number,
) {
  const phone = matchMedia("(hover: none) and (pointer: coarse)");
  const phoneViewport = matchMedia("(max-width: 500px)");
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  let gesture: {
    id: number; x: number; y: number; scroll: number; origin: number;
    axis: "horizontal" | "vertical" | undefined; tapTarget: boolean;
    lastMove: number; velocity: number;
  } | undefined;
  let frame = 0;
  let coast: gsap.core.Tween | undefined;
  let lastScroll = 0;

  const clampScroll = (value: number) => Math.min(trigger.end, Math.max(trigger.start, value));
  const canMove = () => document.body.dataset.projectModalOpen !== "true";
  const writeScroll = (value: number) => {
    lastScroll = Math.round(Math.max(0, value));
    if (window.scrollY !== lastScroll) window.scrollTo({ top: lastScroll, behavior: "instant" });
  };

  const stop = () => {
    gesture = undefined;
    cancelAnimationFrame(frame);
    frame = 0;
    coast?.kill();
    coast = undefined;
    window.removeEventListener("scroll", followFinger);
    window.removeEventListener("touchstart", stop, true);
    window.removeEventListener("wheel", stop, true);
    window.removeEventListener("keydown", stop, true);
  };

  function followFinger() {
    if (Math.abs(window.scrollY - lastScroll) > 2) {
      stop();
      return;
    }
    trigger.getTween()?.progress(1);
  }

  function move(event: TouchEvent) {
    if (!gesture) return;
    if (!canMove() || event.touches.length !== 1 || !event.cancelable) {
      stop();
      return;
    }

    const touch = event.touches[0];
    if (touch.identifier !== gesture.id) {
      stop();
      return;
    }
    const dx = gesture.x - touch.clientX;
    const dy = gesture.y - touch.clientY;
    if (!gesture.axis) {
      if (!dx && !dy) return;
      const horizontal = Math.abs(dx) > Math.abs(dy) * 1.2;
      if (horizontal && (!trigger.isActive || gesture.tapTarget)) {
        stop();
        return;
      }
      const y = gesture.origin;
      const scale = (trigger.end - trigger.start) * scrollPerPixel;
      const first = trigger.start + travelStart * scale;
      const last = first + travelDuration * scale;
      // Outward swipes at the end panels use the browser's normal page scroll.
      if (!horizontal && (!dy || (dy < 0 && y <= first + 2) || (dy > 0 && y >= last - 2))) {
        stop();
        return;
      }
      // Claim the first moving event. Once native pan begins, its release
      // momentum cannot reliably be taken over by a later scroll listener.
      event.preventDefault();
      if (Math.max(Math.abs(dx), Math.abs(dy)) < threshold) return;
      gesture.axis = horizontal ? "horizontal" : "vertical";
      gesture.scroll = window.scrollY;
      lastScroll = window.scrollY;
      window.addEventListener("scroll", followFinger, { passive: true });
    }

    const horizontal = gesture.axis === "horizontal";
    const requested = gesture.scroll + (horizontal ? dx * scrollPerPixel : dy);
    // Vertical travel under the finger remains free, even through a pin edge.
    const next = horizontal ? clampScroll(requested) : requested;
    const now = performance.now();
    const elapsed = now - gesture.lastMove;
    const velocity = (next - gesture.scroll) / Math.max(8, elapsed);
    gesture.velocity = elapsed > releaseWindow || velocity * gesture.velocity <= 0
      ? velocity
      : gesture.velocity * .35 + velocity * .65;
    gesture.lastMove = now;
    gesture.x = touch.clientX;
    gesture.y = touch.clientY;
    event.preventDefault();
    if (next === gesture.scroll) return;
    gesture.scroll = next;
    // Coalesce touch samples into one write per paint without delaying reversals.
    if (!frame) frame = requestAnimationFrame(() => {
      frame = 0;
      if (gesture && canMove()) writeScroll(gesture.scroll);
      else stop();
    });
  }

  const release = () => {
    const drag = gesture;
    if (!drag?.axis || !canMove()) {
      stop();
      return;
    }
    cancelAnimationFrame(frame);
    frame = 0;
    gesture = undefined;
    writeScroll(drag.scroll);

    const age = performance.now() - drag.lastMove;
    const velocity = drag.velocity * Math.max(0, 1 - age / releaseWindow);
    const horizontal = drag.axis === "horizontal";
    const panelSpacing = (trigger.end - trigger.start) * scrollPerPixel * travelDuration / (panelCount - 1);
    const traveled = Math.max(0, (drag.scroll - drag.origin) * Math.sign(velocity));
    const allowance = Math.max(0, Math.min(panelSpacing * .42, panelSpacing * 1.12 - traveled));
    const distance = horizontal
      ? Math.min(maxCoast, Math.abs(velocity) * 60)
      : allowance > 0 ? allowance * -Math.expm1(-Math.abs(velocity) * 120 / allowance) : 0;
    const target = clampScroll(window.scrollY + Math.sign(velocity) * distance);
    if (reducedMotion.matches || !trigger.isActive || Math.abs(target - window.scrollY) < 8 || !canMove()) {
      frame = requestAnimationFrame(stop);
      return;
    }

    window.addEventListener("touchstart", stop, { capture: true, passive: true });
    window.addEventListener("wheel", stop, { capture: true, passive: true });
    window.addEventListener("keydown", stop, true);
    const position = { y: window.scrollY };
    coast = gsap.to(position, {
      y: target,
      duration: horizontal
        ? .1 + .08 * Math.min(1, distance / maxCoast)
        : .13 + .13 * Math.min(1, distance / (panelSpacing * .42)),
      ease: "power2.out",
      onUpdate: () => {
        if (canMove() && !reducedMotion.matches) writeScroll(position.y);
        else stop();
      },
      onComplete: () => { frame = requestAnimationFrame(stop); },
    });
  };

  const start = (event: TouchEvent) => {
    stop();
    const target = event.target instanceof Element ? event.target : null;
    if (!canMove() || event.touches.length !== 1 || target?.closest(nativeControl)) return;

    const touch = event.touches[0];
    if (touch.clientX < edgeInset || touch.clientX > window.innerWidth - edgeInset) return;
    const origin = window.scrollY;
    if (origin < trigger.start - innerHeight || origin > trigger.end + innerHeight) return;
    gesture = {
      id: touch.identifier, x: touch.clientX, y: touch.clientY, scroll: origin, origin,
      axis: undefined, tapTarget: Boolean(target?.closest(tapTarget)), lastMove: performance.now(), velocity: 0,
    };
  };

  const detach = () => {
    stop();
    stage.classList.remove("has-story-swipe");
    stage.removeEventListener("touchstart", start);
    stage.removeEventListener("touchmove", move);
    stage.removeEventListener("touchend", release);
    stage.removeEventListener("touchcancel", stop);
  };

  const sync = () => {
    detach();
    const phoneScreen = Math.min(screen.width, screen.height) <= 500;
    // Narrow Chromium Responsive previews can retain the desktop screen size.
    const responsiveTouchPreview = phoneViewport.matches && navigator.maxTouchPoints === 1;
    if (!phone.matches || (!phoneScreen && !responsiveTouchPreview)) return;
    stage.classList.add("has-story-swipe");
    stage.addEventListener("touchstart", start, { passive: true });
    stage.addEventListener("touchmove", move, { passive: false });
    stage.addEventListener("touchend", release, { passive: true });
    stage.addEventListener("touchcancel", stop, { passive: true });
  };

  sync();
  phone.addEventListener("change", sync);
  phoneViewport.addEventListener("change", sync);
  return () => {
    phone.removeEventListener("change", sync);
    phoneViewport.removeEventListener("change", sync);
    detach();
  };
}
