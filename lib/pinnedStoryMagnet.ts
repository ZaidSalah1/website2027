import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const magneticRange = .4;
const settleCheckMs = 40;
const interruptEvents = ["wheel", "touchstart", "pointerdown", "keydown"] as const;

export function bindPinnedStoryMagnet(
  timeline: gsap.core.Timeline,
  panelCount: number,
  travelStart: number,
  travelDuration: number,
) {
  if (!timeline.scrollTrigger || panelCount < 2) return;
  const trigger: ScrollTrigger = timeline.scrollTrigger;
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  let tween: gsap.core.Tween | undefined;
  let settleTimer = 0;
  let settleDeadline = 0;
  let completionFrame = 0;
  let lastWrite = 0;
  let restoreUntil = 0;
  let interruptedAt = -Infinity;

  const blocked = () => reducedMotion.matches || document.hidden ||
    document.body.dataset.projectModalOpen === "true" || performance.now() < restoreUntil;

  function cancel() {
    window.clearTimeout(settleTimer);
    settleTimer = 0;
    cancelAnimationFrame(completionFrame);
    completionFrame = 0;
    tween?.kill();
    tween = undefined;
    for (const type of interruptEvents) window.removeEventListener(type, interrupt, true);
    window.removeEventListener("scroll", syncTrack);
  }

  function interrupt() {
    interruptedAt = window.scrollY;
    cancel();
  }

  function syncTrack() {
    if (Math.abs(window.scrollY - lastWrite) > 2) {
      cancel();
      return;
    }
    // The magnet supplies the easing. Avoid adding scrub lag on top of it.
    trigger.getTween()?.progress(1);
  }

  function settle() {
    if (tween || blocked() || !trigger.isActive) return;
    const duration = timeline.duration();
    const pinDistance = trigger.end - trigger.start;
    if (!duration || pinDistance <= 0) return;
    const y = window.scrollY;
    if (Math.abs(y - interruptedAt) <= 2) return;
    interruptedAt = -Infinity;
    const panelSpacing = pinDistance * travelDuration / duration / (panelCount - 1);
    const firstStop = trigger.start + pinDistance * travelStart / duration;
    const panelPosition = (y - firstStop) / panelSpacing;
    if (panelPosition < 0 || panelPosition > panelCount - 1) return;
    const nearest = Math.round(panelPosition);
    const gap = Math.abs(panelPosition - nearest);
    // Scroll offsets are quantized, so allow half a CSS pixel at the cutoff.
    if (gap * panelSpacing > magneticRange * panelSpacing + .5) return;
    // Let users pull away from either edge without being drawn back into the pin.
    if ((nearest === 0 && trigger.direction > 0) ||
        (nearest === panelCount - 1 && trigger.direction < 0)) return;
    const target = Math.round(firstStop + nearest * panelSpacing);
    if (Math.abs(target - y) <= 1) return;

    for (const type of interruptEvents) window.addEventListener(type, interrupt, { capture: true, passive: true });
    const scrubGap = Math.abs(timeline.totalProgress() - trigger.progress) * pinDistance;
    // ScrollTrigger can report idle while Lenis is still easing, or while the
    // desktop scrub is following the last scroll position.
    if (ScrollTrigger.isScrolling() || document.documentElement.classList.contains("lenis-smooth") || scrubGap > 2) {
      if (performance.now() >= settleDeadline) {
        cancel();
        return;
      }
      settleTimer = window.setTimeout(checkSettled, settleCheckMs);
      return;
    }

    lastWrite = y;
    window.addEventListener("scroll", syncTrack, { passive: true });
    const position = { y };
    tween = gsap.to(position, {
      y: target,
      duration: .24 + .2 * Math.min(1, gap / magneticRange),
      ease: "sine.inOut",
      onUpdate: () => {
        if (blocked() || !trigger.isActive) {
          cancel();
          return;
        }
        const next = Math.round(position.y);
        if (next === lastWrite) return;
        lastWrite = next;
        window.scrollTo({ top: next, behavior: "instant" });
      },
      onComplete: () => { completionFrame = requestAnimationFrame(cancel); },
    });
  }

  function checkSettled() {
    // Remove the waiting listeners if the scroll position left the eligible
    // range. settle() reattaches them only while waiting or animating.
    cancel();
    settle();
  }

  function onScrollEnd() {
    if (tween || settleTimer) return;
    settleDeadline = performance.now() + 1600;
    settle();
  }

  const onModalRestore = () => {
    restoreUntil = performance.now() + 500;
    cancel();
  };
  ScrollTrigger.addEventListener("scrollEnd", onScrollEnd);
  ScrollTrigger.addEventListener("refreshInit", cancel);
  window.addEventListener("project-modal-restore", onModalRestore);
  return () => {
    cancel();
    ScrollTrigger.removeEventListener("scrollEnd", onScrollEnd);
    ScrollTrigger.removeEventListener("refreshInit", cancel);
    window.removeEventListener("project-modal-restore", onModalRestore);
  };
}
