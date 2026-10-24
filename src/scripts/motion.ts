// Tiny deterministic motion engine for the showcase cards.
// Follows the explainer-engaging page contract: every card renders a pure function of time,
// render(t), built from springs and eased keyframes, so any frame is correct on its own.

export const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
export const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
/** 0..1 progress of t through [a, b]. */
export const seg = (t: number, a: number, b: number) => clamp((t - a) / (b - a));
export const ease = (x: number) => ((x = clamp(x)), x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
export const easeOut = (x: number) => 1 - Math.pow(1 - clamp(x), 3);
export const easeIn = (x: number) => Math.pow(clamp(x), 3);

/** Damped spring step response 0 -> 1. w = speed (8 slow, 14 normal, 22 snappy), z = damping (1 = no overshoot). */
export function spring(t: number, w = 14, z = 0.82) {
  if (t <= 0) return 0;
  if (z >= 1) return 1 - Math.exp(-w * t) * (1 + w * t);
  const wd = w * Math.sqrt(1 - z * z);
  return 1 - Math.exp(-z * w * t) * (Math.cos(wd * t) + ((z * w) / wd) * Math.sin(wd * t));
}

/** A single 0 -> 1 -> 0 pulse starting at `a`, `d` seconds long (taps, landings, swells). */
export const bump = (t: number, a: number, d = 0.3) => Math.sin(Math.PI * seg(t, a, a + d));

/** Springs in at `a`, eases out over `out` seconds from `b`. Returns 0..~1.1. */
export const env = (t: number, a: number, b = Infinity, out = 0.35, w = 14, z = 0.78) =>
  spring(t - a, w, z) * (b === Infinity ? 1 : 1 - ease(seg(t, b, b + out)));

/** Eased keyframes: kf([[t0, v0], [t1, v1, easeFn?], ...])(t). */
type Key = [number, number, ((x: number) => number)?];
export const kf = (keys: Key[]) => (t: number) => {
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) {
    const [a, va] = keys[i - 1];
    const [b, vb, e = ease] = keys[i];
    if (t <= b) return lerp(va, vb, e((t - a) / (b - a)));
  }
  return keys[keys.length - 1][1];
};

/** Seeded generator (mulberry32), never Math.random, so loops replay identically. */
export const rng = (s: number) => () => {
  s = (s + 0x6d2b79f5) | 0;
  s = Math.imul(s ^ (s >>> 15), 1 | s);
  s ^= s + Math.imul(s ^ (s >>> 7), 61 | s);
  return ((s ^ (s >>> 14)) >>> 0) / 4294967296;
};

/** Point on a quadratic Bézier arc from a to b, lifted by `lift` at the middle. */
export function arc(a: [number, number], b: [number, number], k: number, lift = 4): [number, number] {
  const cx = (a[0] + b[0]) / 2;
  const cy = Math.min(a[1], b[1]) - lift;
  const u = 1 - k;
  return [u * u * a[0] + 2 * u * k * cx + k * k * b[0], u * u * a[1] + 2 * u * k * cy + k * k * b[1]];
}

/** Indian digit grouping, e.g. 12500 -> "12,500", 485000 -> "4,85,000". */
export const inr = (n: number) => Math.round(n).toLocaleString("en-IN");

/** Write a transform + opacity in em units. Skips work when nothing changed. */
export function put(
  el: Element | null | undefined,
  o: { x?: number; y?: number; s?: number; sx?: number; sy?: number; r?: number; o?: number; blur?: number },
) {
  if (!el) return;
  const st = (el as HTMLElement).style;
  const sx = o.sx ?? o.s ?? 1;
  const sy = o.sy ?? o.s ?? 1;
  const tf = `translate(${(o.x ?? 0).toFixed(3)}em, ${(o.y ?? 0).toFixed(3)}em) scale(${sx.toFixed(4)}, ${sy.toFixed(4)}) rotate(${(o.r ?? 0).toFixed(2)}deg)`;
  if (st.transform !== tf) st.transform = tf;
  const op = String(clamp(o.o ?? 1).toFixed(3));
  if (st.opacity !== op) st.opacity = op;
  const f = o.blur && o.blur > 0.01 ? `blur(${o.blur.toFixed(2)}px)` : "";
  if (st.filter !== f) st.filter = f;
}

export const text = (el: Element | null | undefined, s: string) => {
  if (el && el.textContent !== s) el.textContent = s;
};

export const cls = (el: Element | null | undefined, name: string, on: boolean) => {
  if (el && el.classList.contains(name) !== on) el.classList.toggle(name, on);
};

export interface Scene {
  /** Seconds of the one-time "grow in" before the loop. */
  intro: number;
  /** Length of the loop that follows the intro. Its last frame must match its first. */
  loop: number;
  /** A representative frame, shown when the viewer prefers reduced motion. */
  poster: number;
  render(t: number): void;
}
export type SceneFactory = (root: HTMLElement) => Scene;

interface Item {
  el: HTMLElement;
  scene: Scene;
  t: number;
  on: boolean;
  stopped: boolean;
}

/**
 * Mounts every [data-scene] element. A scene plays only while it is on screen, and replays its
 * intro each time it comes back into view (the cards "grow" again, as in the reference).
 */
export function runScenes(factories: Record<string, SceneFactory>) {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const items: Item[] = [];
  document.querySelectorAll<HTMLElement>("[data-scene]").forEach((el) => {
    const make = factories[el.dataset.scene || ""];
    if (!make) return;
    const scene = make(el);
    items.push({ el, scene, t: 0, on: false, stopped: false });
    scene.render(reduce ? scene.poster : 0);
  });

  const api = {
    /** Freeze a scene (e.g. when its card starts playing a video). */
    stop(el: HTMLElement) {
      const it = items.find((i) => i.el === el);
      if (it) it.stopped = true;
    },
  };
  if (reduce || !items.length) return api;

  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        const it = items.find((i) => i.el === e.target);
        if (!it) continue;
        if (e.isIntersecting && !it.on) {
          it.on = true;
          it.t = 0;
        } else if (!e.isIntersecting) {
          it.on = false;
        }
      }
    },
    { threshold: 0.2 },
  );
  items.forEach((i) => io.observe(i.el));

  let last = performance.now();
  const frame = (now: number) => {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    for (const it of items) {
      if (!it.on || it.stopped) continue;
      it.t += dt;
      const { intro, loop } = it.scene;
      it.scene.render(it.t < intro ? it.t : intro + ((it.t - intro) % loop));
    }
    requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
  return api;
}
