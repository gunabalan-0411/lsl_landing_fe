// "What we do": one looping scene per practice, plus the sticky stage that follows the list as it scrolls.
import { bump, clamp, cls, ease, easeOut, env, inr, lerp, put, seg, spring, text, type SceneFactory } from "./motion";

const $ = (r: ParentNode, s: string) => r.querySelector<HTMLElement>(s);
const $$ = (r: ParentNode, s: string) => [...r.querySelectorAll<HTMLElement>(s)];
const cubic = (p: number[], k: number): [number, number] => {
  const u = 1 - k;
  const a = u * u * u, b = 3 * u * u * k, c = 3 * u * k * k, d = k * k * k;
  return [a * p[0] + b * p[2] + c * p[4] + d * p[6], a * p[1] + b * p[3] + c * p[5] + d * p[7]];
};

type Rect = [number, number, number, number];
const mix = (a: Rect, b: Rect, k: number): Rect => [lerp(a[0], b[0], k), lerp(a[1], b[1], k), lerp(a[2], b[2], k), lerp(a[3], b[3], k)];
const place = (el: HTMLElement | null, r: Rect) => {
  if (!el) return;
  el.style.left = `${r[0].toFixed(3)}em`;
  el.style.top = `${r[1].toFixed(3)}em`;
  el.style.width = `${r[2].toFixed(3)}em`;
  el.style.height = `${r[3].toFixed(3)}em`;
};

/** Web: a page assembles, the cursor clicks its button, then it reflows to a phone and back. */
const svWeb: SceneFactory = (root) => {
  const win = $(root, ".w-win");
  const url = $(root, ".w-url-t");
  const blocks: Record<string, HTMLElement | null> = { h: $(root, ".w-h"), s: $(root, ".w-s"), btn: $(root, ".w-btn"), img: $(root, ".w-img") };
  const cards = $$(root, ".w-card");
  const chips = $$(root, ".sv-chip");
  const cursor = $(root, ".w-cursor");
  const ripple = $(root, ".w-ripple");
  const WIN: Record<"d" | "m", Rect> = { d: [3, 2.2, 30, 19.6], m: [12, 2.2, 12, 19.6] };
  const D: Record<string, Rect> = {
    h: [1.6, 4.0, 14, 1.6], s: [1.6, 6.2, 10.5, 0.75], btn: [1.6, 7.7, 5, 1.6], img: [17.6, 3.4, 10.8, 6.6],
    c0: [1.6, 11.4, 8.27, 6.6], c1: [10.87, 11.4, 8.27, 6.6], c2: [20.13, 11.4, 8.27, 6.6],
  };
  const M: Record<string, Rect> = {
    h: [1, 3.6, 10, 1.3], s: [1, 5.3, 7.6, 0.65], btn: [1, 6.5, 4.6, 1.5], img: [1, 8.6, 10, 4.2],
    c0: [1, 13.4, 10, 2.6], c1: [1, 16.4, 10, 2.6], c2: [1, 19.4, 10, 2.6],
  };
  const URL = "yourbrand.com";
  const btn: [number, number] = [3 + 1.6 + 2.5, 2.2 + 7.7 + 0.8];
  const intro = 1.4;
  const loop = 9;
  return {
    intro,
    loop,
    poster: intro + 4.5,
    render(t) {
      const lt = t - intro;
      const k = ease(seg(lt, 2.5, 3.3)) - ease(seg(lt, 6.4, 7.2));
      place(win, mix(WIN.d, WIN.m, k));
      const ws = spring(t - 0.05, 11, 0.8);
      put(win, { y: (1 - ws) * 1.5, s: lerp(0.94, 1, ws), o: clamp(ws * 1.6) });
      text(url, URL.slice(0, Math.floor(clamp((t - 0.35) / 0.7) * URL.length)));
      ["h", "s", "btn", "img"].forEach((n, i) => {
        place(blocks[n], mix(D[n], M[n], k));
        const s = spring(t - 0.45 - i * 0.1, 13, 0.75);
        put(blocks[n], { s: lerp(0.7, 1, s) * (n === "btn" ? 1 - 0.12 * bump(lt, 1.35, 0.25) : 1), o: clamp(s * 1.6) });
      });
      cards.forEach((el, i) => {
        place(el, mix(D[`c${i}`], M[`c${i}`], k));
        const s = spring(t - 0.8 - i * 0.1, 13, 0.75);
        put(el, { y: (1 - s) * 0.8, o: clamp(s * 1.6) });
      });
      const cIn = ease(seg(lt, 0.2, 1.2));
      const cOut = ease(seg(lt, 1.8, 2.4));
      put(cursor, {
        x: lerp(lerp(31, btn[0], cIn), 35, cOut),
        y: lerp(lerp(22, btn[1], cIn), 26, cOut),
        s: 1 - 0.15 * bump(lt, 1.3, 0.25),
        o: lt > 0.1 && lt < 2.4 ? 1 : 0,
      });
      const rp = seg(lt, 1.38, 2.0);
      put(ripple, { x: btn[0], y: btn[1], s: lerp(0.3, 1.7, easeOut(rp)), o: rp > 0 && rp < 1 ? 1 - rp : 0 });
      chips.forEach((c, i) => {
        const s = env(lt, 3.4 + i * 0.18, 6.0, 0.3, 14, 0.65);
        put(c, { y: (1 - clamp(s)) * 0.6, s: lerp(0.6, 1, s), o: clamp(s * 1.6) });
      });
    },
  };
};

/** Agentic AI: a request comes in, the agent calls its tools one by one, and reports back. */
const svAi: SceneFactory = (root) => {
  const user = $(root, ".ai-user");
  const agent = $(root, ".ai-agent");
  const think = $$(root, ".ai-think i");
  const line = $(root, ".ai-line");
  const tools = $$(root, ".ai-tool");
  const spins = tools.map((el) => $(el, ".ai-spin"));
  const oks = tools.map((el) => $(el, ".ai-ok"));
  const res = tools.map((el) => $(el, ".ai-res"));
  const ans = $(root, ".ai-ans");
  const ansT = $(root, ".ai-ans-t");
  const A = ansT?.textContent || "";
  return {
    intro: 0.01,
    loop: 9.6,
    poster: 7.4,
    render(t) {
      const out = ease(seg(t, 8.9, 9.4));
      const us = spring(t - 0.15, 13, 0.72);
      put(user, { x: (1 - us) * 2, s: lerp(0.85, 1, us), o: clamp(us * 1.6) * (1 - out), blur: out * 6 });
      const as = spring(t - 0.75, 13, 0.8);
      put(agent, { x: (1 - as) * -1, o: clamp(as * 1.6) * (1 - out) });
      const thinking = t > 0.8 && t < 5.3;
      think.forEach((d, i) => put(d, { y: -0.3 * Math.max(0, Math.sin(t * 7 - i * 0.9)), o: thinking ? 1 : 0 }));
      put(line, { sy: ease(seg(t, 1.3, 5.0)), o: 1 - out });
      tools.forEach((el, i) => {
        const a = 1.4 + i * 1.25;
        const s = spring(t - a, 13, 0.78);
        put(el, { x: (1 - s) * 1.5, o: clamp(s * 1.6) * (1 - out) });
        const done = t >= a + 0.8;
        if (spins[i]) {
          spins[i]!.style.transform = `rotate(${((t * 540) % 360).toFixed(1)}deg)`;
          spins[i]!.style.opacity = done ? "0" : "1";
        }
        put(oks[i], { s: done ? spring(t - a - 0.8, 16, 0.55) : 0 });
        put(res[i], { x: (1 - easeOut(seg(t, a + 0.85, a + 1.2))) * 0.6, o: seg(t, a + 0.85, a + 1.1) });
      });
      const aa = spring(t - 5.4, 12, 0.75);
      put(ans, { y: (1 - clamp(aa)) * 0.8, s: lerp(0.85, 1, aa), o: clamp(aa * 1.6) * (1 - out) });
      text(ansT, A.slice(0, Math.floor(clamp((t - 5.5) / 1.3) * A.length)));
    },
  };
};

/** Data science: actuals pop in, the trend draws, the forecast band opens into the future. */
const svDs: SceneFactory = (root) => {
  const card = $(root, ".d-card");
  const pts = $$(root, ".d-pt");
  const trend = $(root, ".d-trend");
  const clip = root.querySelector<SVGRectElement>(".d-clip");
  const kpi = $(root, ".d-kpi");
  const tags = $$(root, ".d-tags span");
  const intro = 0.6;
  const loop = 9;
  return {
    intro,
    loop,
    poster: intro + 6,
    render(t) {
      const cs = spring(t - 0.02, 11, 0.85);
      put(card, { y: (1 - cs) * 1.2, o: clamp(cs * 1.6) });
      const lt = t - intro;
      const out = ease(seg(lt, 8.2, 8.7));
      pts.forEach((p, i) => {
        const s = spring(lt - 0.2 - i * 0.12, 15, 0.6);
        p.setAttribute("r", (0.36 * clamp(s, 0, 1.4)).toFixed(3));
        p.style.opacity = (clamp(s * 2) * (1 - out)).toFixed(3);
      });
      if (trend) trend.style.strokeDashoffset = (1 - ease(seg(lt, 2.0, 3.0)) * (1 - out)).toFixed(4);
      clip?.setAttribute("width", (10 * ease(seg(lt, 3.2, 4.4)) * (1 - out)).toFixed(3));
      const ks = env(lt, 4.5, 8.1, 0.3, 14, 0.6);
      put(kpi, { y: (1 - clamp(ks)) * 0.6, s: lerp(0.6, 1, ks), o: clamp(ks * 1.6) });
      tags.forEach((g, i) => {
        const s = spring(lt - 4.8 - i * 0.15, 13, 0.75);
        put(g, { y: (1 - clamp(s)) * 0.5, o: clamp(s * 1.5) * (1 - out) });
      });
    },
  };
};

/** Data engineering: sources stream records through a transform into the warehouse. */
const svDe: SceneFactory = (root) => {
  const srcs = $$(root, ".e-src");
  const x = $(root, ".e-x");
  const wh = $(root, ".e-wh");
  const gear = $(root, ".e-gear");
  const chks = $$(root, ".e-chk");
  const count = $(root, ".e-count");
  const dots = $$(root, ".e-dot");
  const edges = [
    [10.8, 4.7, 12.4, 4.7, 12.2, 12, 13.6, 12],
    [10.8, 12, 12.2, 12, 12.2, 12, 13.6, 12],
    [10.8, 19.3, 12.4, 19.3, 12.2, 12, 13.6, 12],
    [22.4, 12, 23.6, 12, 24.4, 12, 25.6, 12],
  ];
  const lanes = [
    { edge: 0, off: 0 },
    { edge: 1, off: 0.33 },
    { edge: 2, off: 0.66 },
    { edge: 3, off: 0.15 },
    { edge: 3, off: 0.65 },
  ];
  const intro = 1.0;
  const loop = 8;
  return {
    intro,
    loop,
    poster: intro + 5,
    render(t) {
      srcs.forEach((el, i) => {
        const s = spring(t - 0.05 - i * 0.1, 12, 0.75);
        put(el, { x: (1 - s) * -1.5, o: clamp(s * 1.6) });
      });
      const xs = spring(t - 0.4, 12, 0.7);
      put(x, { s: lerp(0.8, 1, xs), o: clamp(xs * 1.6) });
      const ws = spring(t - 0.6, 12, 0.7);
      put(wh, { x: (1 - ws) * 1.5, o: clamp(ws * 1.6) });

      const lt = t - intro;
      if (gear) gear.style.transform = `rotate(${((lt * 90) % 360).toFixed(1)}deg)`;
      chks.forEach((c, i) => cls(c, "is-on", lt >= 0.6 + i * 0.5 && lt < 7.4));
      const fade = 1 - seg(lt, 7.3, 7.7);
      text(count, inr(lt < 7.7 ? 12480 * easeOut(seg(lt, 0.6, 6.4)) : 0));
      put(count, { o: lt < 7.7 ? fade : seg(lt, 7.75, 7.95) });
      const flow = seg(lt, 0.3, 0.6) * (1 - seg(lt, 7.3, 7.7));
      dots.forEach((d, i) => {
        const lane = lanes[i];
        const k = (((lt / 2 + lane.off) % 1) + 1) % 1;
        const [px, py] = cubic(edges[lane.edge], k);
        put(d, { x: px, y: py, o: Math.sin(Math.PI * k) * flow });
      });
    },
  };
};

/** Automation: a daily trigger fires and a token runs the workflow, ticking each step, then reports. */
const svAuto: SceneFactory = (root) => {
  const trig = $(root, ".u-trig");
  const hand = $(root, ".u-hand");
  const steps = $$(root, ".u-step");
  const on = $(root, ".u-line-on");
  const token = $(root, ".u-token");
  const toast = $(root, ".u-toast");
  const X0 = 4.15;
  const stops = [3.65, 9.25, 13.85, 18.45];
  const ticks = [1.1, 2.1, 3.1];
  const tokenY = (t: number) => {
    let y = stops[0];
    [0.6, 1.6, 2.6].forEach((a, i) => (y += ease(seg(t, a, a + 0.5)) * (stops[i + 1] - stops[i])));
    return y;
  };
  const intro = 0.8;
  const loop = 8;
  return {
    intro,
    loop,
    poster: intro + 5,
    render(t) {
      const ts = spring(t - 0.05, 12, 0.7);
      put(trig, { s: lerp(0.85, 1, ts) * (1 + 0.06 * bump(t - intro, 0.25, 0.3)), o: clamp(ts * 1.6) });
      steps.forEach((el, i) => {
        const s = spring(t - 0.2 - i * 0.12, 12, 0.78);
        put(el, { x: (1 - s) * -1.2, o: clamp(s * 1.6) });
      });

      const lt = t - intro;
      put(hand, { r: 180 + (lt / loop) * 720 });
      const y = tokenY(lt);
      const fly = ease(seg(lt, 3.4, 3.9));
      put(token, {
        x: lerp(X0, 22.6, fly),
        y: lerp(y, 10.6, fly),
        s: 1 + 0.4 * bump(lt, 3.4, 0.5),
        o: lt > 0.15 && lt < 3.95 ? clamp((lt - 0.15) * 5) : 0,
      });
      const reset = seg(lt, 7.3, 7.8);
      put(on, { sy: clamp((y - 5.5) / 12.2) * (1 - reset) });
      steps.forEach((el, i) => cls(el, "is-done", lt >= ticks[i] && lt < 7.4));
      steps.forEach((el, i) => {
        const b = bump(lt, ticks[i], 0.3);
        if (b > 0) put(el, { s: 1 + 0.04 * b });
      });
      const tv = env(lt, 3.9, 7.2, 0.35, 13, 0.7);
      put(toast, { x: (1 - clamp(tv)) * 1.5, s: lerp(0.85, 1, tv), o: clamp(tv * 1.5) });
    },
  };
};

export const serviceScenes: Record<string, SceneFactory> = {
  "sv-web": svWeb,
  "sv-ai": svAi,
  "sv-ds": svDs,
  "sv-de": svDe,
  "sv-auto": svAuto,
};

/** The sticky stage shows (and plays) only the practice whose text sits in the middle of the viewport. */
export function initServices() {
  const items = [...document.querySelectorAll<HTMLElement>(".sv-item")];
  const layers = [...document.querySelectorAll<HTMLElement>(".sv-layer")];
  const count = document.querySelector(".sv-count");
  const label = document.querySelector(".sv-label");
  const bar = document.querySelector<HTMLElement>(".sv-bar");
  if (!items.length || !layers.length) return;
  bar?.style.setProperty("--p", String(1 / items.length));
  let active = 0;
  const set = (i: number) => {
    if (i === active) return;
    active = i;
    items.forEach((el, j) => el.classList.toggle("is-active", j === i));
    layers.forEach((el, j) => {
      el.classList.toggle("is-active", j === i);
      const art = el.querySelector<HTMLElement>("[data-scene]");
      if (!art) return;
      if (j === i) art.removeAttribute("data-paused");
      else art.setAttribute("data-paused", "");
    });
    if (count) count.textContent = String(i + 1).padStart(2, "0");
    if (label) label.textContent = items[i].dataset.title || "";
    bar?.style.setProperty("--p", String((i + 1) / items.length));
  };
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => e.isIntersecting && set(Number((e.target as HTMLElement).dataset.i))),
    { rootMargin: "-48% 0px -48% 0px" },
  );
  items.forEach((el) => io.observe(el));
}
