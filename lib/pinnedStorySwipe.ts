import gsap from "gsap";
import type { ScrollTrigger } from "gsap/ScrollTrigger";

const threshold = 8;
const edgeInset = 24;
const releaseWindow = 75;
const maxCoast = 72;
const interactive = "a, button, input, select, textarea, label, summary, [contenteditable], [role='button'], [data-lenis-prevent]";

export function bindPinnedStorySwipe(stage: HTMLElement, trigger: ScrollTrigger, scrollPerPixel: number) {
  const phone = matchMedia("(hover: none) and (pointer: coarse)");
  const phoneViewport = matchMedia("(max-width: 500px)");
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  let gesture: {
    id: number; x: number; y: number; scroll: number; horizontal: boolean;
    lastMove: number; velocity: number;
  } | undefined;
  let frame = 0;
  let coast: gsap.core.Tween | undefined;
  let lastScroll = 0;

  const clampScroll = (value: number) => Math.min(trigger.end, Math.max(trigger.start, value));
  const canMove = () => trigger.isActive && document.body.dataset.projectModalOpen !== "true";
  const writeScroll = (value: number) => {
    lastScroll = Math.round(clampScroll(value));
    if (window.scrollY !== lastScroll) window.scrollTo({ top: lastScroll, behavior: "instant" });
  };

  const stop = () => {
    gesture = undefined;
    cancelAnimationFrame(frame);
    frame = 0;
    coast?.kill();
    coast = undefined;
    stage.removeEventListener("touchmove", move);
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
    if (!gesture.horizontal) {
      const dy = Math.abs(gesture.y - touch.clientY);
      if (Math.max(Math.abs(dx), dy) < threshold) return;
      if (Math.abs(dx) <= dy * 1.2) {
        stop();
        return;
      }
      gesture.horizontal = true;
      gesture.scroll = window.scrollY;
      lastScroll = window.scrollY;
      window.addEventListener("scroll", followFinger, { passive: true });
    }

    const next = clampScroll(gesture.scroll + dx * scrollPerPixel);
    const now = performance.now();
    const elapsed = now - gesture.lastMove;
    const velocity = (next - gesture.scroll) / Math.max(8, elapsed);
    gesture.velocity = elapsed > releaseWindow || velocity * gesture.velocity <= 0
      ? velocity
      : gesture.velocity * .35 + velocity * .65;
    gesture.lastMove = now;
    gesture.x = touch.clientX;
    if (next === gesture.scroll) return;
    event.preventDefault();
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
    if (!drag?.horizontal || !canMove()) {
      stop();
      return;
    }
    cancelAnimationFrame(frame);
    frame = 0;
    gesture = undefined;
    stage.removeEventListener("touchmove", move);
    writeScroll(drag.scroll);

    const age = performance.now() - drag.lastMove;
    const velocity = drag.velocity * Math.max(0, 1 - age / releaseWindow);
    const extra = Math.sign(velocity) * Math.min(maxCoast, Math.abs(velocity) * 60);
    const target = clampScroll(window.scrollY + extra);
    if (reducedMotion.matches || Math.abs(target - window.scrollY) < 8 || !canMove()) {
      frame = requestAnimationFrame(stop);
      return;
    }

    window.addEventListener("touchstart", stop, { capture: true, passive: true });
    window.addEventListener("wheel", stop, { capture: true, passive: true });
    window.addEventListener("keydown", stop, true);
    const position = { y: window.scrollY };
    coast = gsap.to(position, {
      y: target,
      duration: .1 + .08 * Math.min(1, Math.abs(extra) / maxCoast),
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
    if (!canMove() || event.touches.length !== 1 ||
        (event.target instanceof Element && event.target.closest(interactive))) return;

    const touch = event.touches[0];
    if (touch.clientX < edgeInset || touch.clientX > window.innerWidth - edgeInset) return;
    gesture = {
      id: touch.identifier, x: touch.clientX, y: touch.clientY, scroll: window.scrollY,
      horizontal: false, lastMove: performance.now(), velocity: 0,
    };
    stage.addEventListener("touchmove", move, { passive: false });
  };

  const detach = () => {
    stop();
    stage.classList.remove("has-story-swipe");
    stage.removeEventListener("touchstart", start);
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
