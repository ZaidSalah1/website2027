type Story = { timeline: gsap.core.Timeline; panelCount: number; travelStart: number; travelDuration: number };
type Travel = { first: number; last: number; spacing: number };
const stories = new Set<Story>();

function findTravel(from: number, to: number): Travel | undefined {
  const direction = Math.sign(to - from);
  if (!direction) return;
  let closest: Travel | undefined;
  for (const { timeline, panelCount, travelStart, travelDuration } of stories) {
    const trigger = timeline.scrollTrigger;
    if (!trigger) continue;
    const scale = (trigger.end - trigger.start) / timeline.duration();
    if (!(scale > 0)) continue;
    const first = trigger.start + travelStart * scale;
    const last = first + travelDuration * scale;
    // Start outside the band, or from inside it. A fresh outward gesture from
    // an aligned end panel stays native and can pass into the next section.
    const crosses = direction > 0 ? from < last - 2 && to >= first : from > first + 2 && to <= last;
    if (!crosses) continue;
    if (!closest || (direction > 0 ? first < closest.first : last > closest.last)) {
      closest = { first, last, spacing: (last - first) / (panelCount - 1) };
    }
  }
  return closest;
}

function travelLimit(travel: Travel, from: number, direction: number) {
  const origin = Math.max(travel.first, Math.min(travel.last, from));
  const available = direction > 0 ? travel.last - origin : origin - travel.first;
  return { origin, budget: Math.min(available, travel.spacing * 1.2) };
}

export function createStoryWheelLimiter() {
  let burst: { from: number; direction: number; time: number; fast: boolean } | undefined;
  return (delta: number, target: number, now: number) => {
    const direction = Math.sign(delta);
    if (!direction) return delta;
    const elapsed = burst ? now - burst.time : Infinity;
    if (!burst || now - burst.time > 160 || direction !== burst.direction) {
      burst = { from: target, direction, time: now, fast: false };
    }
    burst.time = now;
    const proposed = target + delta;
    // Ordinary continuous input can cross any number of panels. Only carry
    // the travel budget through a burst once its deltas indicate a fast fling.
    if (!burst.fast && Math.abs(delta) / Math.max(20, Math.min(55, elapsed)) < 2.5) {
      burst.from = target;
      return delta;
    }
    burst.fast = true;
    const travel = findTravel(burst.from, proposed);
    if (!travel) return delta;
    const { origin, budget } = travelLimit(travel, burst.from, direction);
    if (budget < travel.spacing * .65 && (proposed - origin) * direction < travel.spacing * .88) return delta;
    const used = (target - origin) * direction;
    const remaining = budget - used;
    const tail = Math.min(budget * .25, travel.spacing * .24);
    const free = Math.max(0, remaining - tail);
    if (Math.abs(delta) <= free) return delta;
    if (remaining <= 1) return 0;
    // Ease down the last portion of a large burst while retaining Lenis's
    // existing wheel interpolation and accepting smaller deltas unchanged.
    const incoming = Math.abs(delta) - free;
    const available = remaining - free;
    const damped = available * -Math.expm1(-incoming / available);
    return direction * (free + damped);
  };
}

export function registerPinnedStoryMomentum(story: Story) {
  stories.add(story);
  return () => { stories.delete(story); };
}
