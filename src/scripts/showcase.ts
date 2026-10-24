// Choreography for the showcase cards. Each scene is a pure function of time (see motion.ts):
// an intro that "grows" the card's interface in, then a seamless loop that tells one product moment.
import { arc, bump, clamp, cls, ease, easeOut, env, inr, lerp, put, runScenes, seg, spring, text, type SceneFactory } from "./motion";

const $ = (r: ParentNode, s: string) => r.querySelector<HTMLElement>(s);
const $$ = (r: ParentNode, s: string) => [...r.querySelectorAll<HTMLElement>(s)];
const TAU = Math.PI * 2;
const scaleY = (el: Element, k: number) => ((el as HTMLElement).style.transform = `scaleY(${clamp(k, 0, 2).toFixed(3)})`);
const blink = (el: HTMLElement | null, on: boolean) => el && (el.style.opacity = on ? "1" : "0");
const chars = (s: string) => Array.from(s);

/* ------------------------------------------------------------------ PACO AI */

/** Screens flick in, collapse into the voice pill, a question is asked, the answer card grows out of it. */
const pacoAsk: SceneFactory = (root) => {
  const tiles = $$(root, ".pa-tile");
  const centres = tiles.map((el) => [parseFloat(el.style.left) + 3.7, parseFloat(el.style.top) + 2.8]);
  const pill = $(root, ".pa-pill")!;
  const wave = $(root, ".pa-wave");
  const bars = $$(root, ".pa-wave i");
  const q = $(root, ".pa-q");
  const qt = $(root, ".pa-q-t");
  const caret = $(root, ".pa-q .sc-caret");
  const ans = $(root, ".pa-ans");
  const num = $(root, ".pa-num");
  const due = $(root, ".pa-due");
  const chip = $(root, ".pa-chip");
  const Q = "How much fee is pending?";
  const intro = 2.4;
  const loop = 7.2;
  return {
    intro,
    loop,
    poster: intro + 4.8,
    render(t) {
      tiles.forEach((el, i) => {
        const a = 0.1 + i * 0.19;
        const k = ease(seg(t, 1.45 + i * 0.03, 2.05));
        const [cx, cy] = centres[i];
        put(el, {
          x: (18 - cx) * k,
          y: (6.85 - cy) * k,
          s: env(t, a, Infinity, 0.3, 15, 0.7) * (1 - 0.8 * k),
          r: (i % 2 ? 4 : -4) * (1 - spring(t - a, 10, 0.8)),
          o: clamp((t - a) * 6) * (1 - k),
        });
      });

      const lt = t - intro;
      const born = spring(t - 1.9, 14, 0.68);
      const w =
        lt < 0
          ? lerp(3.7, 17, spring(t - 2.0, 12, 0.85))
          : 17 + 9 * (ease(seg(lt, 1.2, 1.6)) - ease(seg(lt, 6.25, 6.85)));
      pill.style.width = `${w.toFixed(3)}em`;
      pill.style.left = `${(18 - w / 2).toFixed(3)}em`;
      put(pill, { s: lerp(0.4, 1, born), o: clamp(born * 1.5) });

      const listen = lt < 0 ? clamp((t - 2.05) / 0.3) : 1 - ease(seg(lt, 1.15, 1.4)) + ease(seg(lt, 6.6, 7.0));
      put(wave, { o: listen, blur: (1 - listen) * 6 });
      const u = lt / loop;
      bars.forEach((b, i) =>
        scaleY(b, 0.22 + 0.78 * Math.abs(Math.sin(TAU * u * 11 + i * 0.7) * Math.sin(TAU * u * 5 + i * 1.9))),
      );

      const qOn = seg(lt, 1.3, 1.45) * (1 - ease(seg(lt, 6.0, 6.4)));
      const n = Math.floor(clamp((lt - 1.45) / 1.25) * Q.length);
      text(qt, Q.slice(0, n));
      put(q, { o: qOn, blur: (1 - qOn) * 6 });
      blink(caret, n < Q.length || Math.floor(lt * 2.4) % 2 === 0);

      const aIn = spring(lt - 2.95, 12, 0.74);
      const aOut = ease(seg(lt, 5.9, 6.35));
      put(ans, { y: (1 - aIn) * -3 + aOut * 1, sx: lerp(0.86, 1, aIn), sy: lerp(0.45, 1, aIn), o: clamp(aIn * 1.6) * (1 - aOut), blur: aOut * 8 });
      text(num, inr(12500 * easeOut(seg(lt, 3.05, 3.85))));
      put(due, { y: (1 - easeOut(seg(lt, 3.5, 3.95))) * 0.6, o: seg(lt, 3.5, 3.8) });
      put(chip, { s: env(lt, 4.25, Infinity, 0.3, 15, 0.6), o: clamp((lt - 4.25) * 6) });
    },
  };
};

/** Roles orbit the PACO mark; each in turn signs in, is detected, and only their topic lights up. */
const pacoRoles: SceneFactory = (root) => {
  const nodes = $$(root, ".pr-node");
  const hub = $(root, ".pr-hub");
  const [r1, r2, ping] = $$(root, ".pr-ring");
  const beamA = $(root, ".pr-beam-a")!;
  const beamB = $(root, ".pr-beam-b")!;
  const badge = $(root, ".pr-badge")!;
  const bName = $(root, ".pr-name");
  const bRole = $(root, ".pr-role-l");
  const roles = [
    { node: 0, topic: 1, name: "Priya", role: "Parent", c: "#0288d1" },
    { node: 2, topic: 3, name: "Kavitha", role: "Teacher", c: "#dc2626" },
    { node: 4, topic: 5, name: "Senthil", role: "Principal", c: "#059669" },
  ];
  const line = (el: HTMLElement, x1: number, y1: number, x2: number, y2: number, c: string, on: boolean, t: number) => {
    el.setAttribute("x1", x1.toFixed(3));
    el.setAttribute("y1", y1.toFixed(3));
    el.setAttribute("x2", x2.toFixed(3));
    el.setAttribute("y2", y2.toFixed(3));
    el.style.stroke = c;
    el.style.opacity = on ? "1" : "0";
    el.style.strokeDashoffset = (-t * 0.9).toFixed(3);
  };
  const N = nodes.length;
  const intro = 1.4;
  const loop = 18; // one full revolution, two rounds of the three roles
  return {
    intro,
    loop,
    poster: intro + 1.7,
    render(t) {
      const grow = spring(t - 0.1, 8, 0.86);
      const ang = (t / loop) * TAU - Math.PI / 2;
      put(hub, { s: spring(t, 12, 0.6) });
      [r1, r2].forEach((r, k) => {
        const ph = (((t * 0.45 + k * 0.5) % 1) + 1) % 1;
        put(r, { s: lerp(0.9, 2.3, ph), o: (1 - ph) * 0.32 * grow });
      });

      const lt = t - intro;
      const lm = lt < 0 ? -1 : lt % loop;
      const p = lm < 0 ? -1 : Math.floor(lm / 3);
      const pt = lm < 0 ? -1 : lm - p * 3;
      const R = p < 0 ? null : roles[p % 3];

      const pos: [number, number][] = [];
      nodes.forEach((el, i) => {
        const th = ang + (i / N) * TAU;
        const x = Math.cos(th) * 10.6 * grow;
        const y = Math.sin(th) * 7.7 * grow;
        pos.push([18 + x, 12 + y]);
        const isRole = !!R && i === R.node;
        const isTopic = !!R && i === R.topic;
        cls(el, "is-on", (isRole && pt > 0.15 && pt < 2.75) || (isTopic && pt > 1.0 && pt < 2.75));
        const hl = isRole ? env(pt, 0.15, 2.6, 0.3, 14, 0.6) : isTopic ? env(pt, 1.0, 2.6, 0.3, 14, 0.6) : 0;
        const a = 0.2 + i * 0.07;
        put(el, { x, y, s: env(t, a, Infinity, 0.3, 13, 0.7) * (1 + 0.14 * hl), o: clamp((t - a) * 5) });
      });

      if (R) {
        const [nx, ny] = pos[R.node];
        const [tx, ty] = pos[R.topic];
        const out = ease(seg(pt, 2.45, 2.85));
        const a = ease(seg(pt, 0.1, 0.5));
        line(beamA, lerp(nx, 18, out), lerp(ny, 12, out), lerp(nx, 18, a), lerp(ny, 12, a), R.c, a > 0 && out < 1, lt);
        const b = ease(seg(pt, 0.75, 1.15));
        line(beamB, lerp(18, tx, out), lerp(12, ty, out), lerp(18, tx, b), lerp(12, ty, b), "var(--acc)", b > 0 && out < 1, lt);
        const pk = seg(pt, 0.5, 1.3);
        put(ping, { s: lerp(1, 2.5, easeOut(pk)), o: pk > 0 && pk < 1 ? (1 - pk) * 0.8 : 0 });
        const bv = env(pt, 0.5, 2.6, 0.3, 13, 0.7);
        text(bName, R.name);
        text(bRole, R.role);
        badge.style.setProperty("--c", R.c);
        put(badge, { s: lerp(0.85, 1, bv), o: clamp(bv * 1.4), blur: (1 - clamp(bv)) * 4 });
      } else {
        beamA.style.opacity = "0";
        beamB.style.opacity = "0";
        put(ping, { o: 0 });
        put(badge, { o: 0 });
      }
    },
  };
};

/** The same question and answer flip between English and Tamil behind a short blur. */
const pacoLang: SceneFactory = (root) => {
  const toggle = $(root, ".pl-toggle");
  const thumb = $(root, ".pl-thumb");
  const en = $(root, ".pl-en");
  const ta = $(root, ".pl-ta");
  const q = $(root, ".pl-q");
  const ans = $(root, ".pl-ans");
  const rows = $$(root, ".pl-row");
  const swEn = $$(root, ".sw-en");
  const swTa = $$(root, ".sw-ta");
  const mini = $$(root, ".pl-q .pl-mini i");
  const intro = 1.3;
  const loop = 8.4;
  return {
    intro,
    loop,
    poster: intro + 5.5,
    render(t) {
      const lt = t - intro;
      const L = ease(seg(lt, 3.8, 4.2)) - ease(seg(lt, 8.0, 8.4));
      const swap = bump(lt, 3.75, 0.5) + bump(lt, 7.95, 0.5);

      const ts = spring(t - 0.05, 13, 0.7);
      put(toggle, { s: lerp(0.6, 1, ts), o: clamp(ts * 1.5) });
      put(thumb, { x: L * 6.2 });
      cls(en, "on", L < 0.5);
      cls(ta, "on", L >= 0.5);

      const qs = spring(t - 0.3, 12, 0.78);
      put(q, { x: (1 - qs) * 3, s: 1 + 0.04 * swap, o: clamp(qs * 1.4) });
      const as = spring(t - 0.55, 11, 0.8);
      put(ans, { y: (1 - as) * 2, s: 1 - 0.025 * swap, o: clamp(as * 1.4) });
      rows.forEach((r, i) => {
        const rs = spring(t - 0.8 - i * 0.12, 13, 0.8);
        put(r, { x: (1 - rs) * -1.2 + Math.sin(Math.PI * clamp(swap)) * 0.15 * (i + 1), o: clamp(rs * 1.4) });
      });

      const a = clamp(L * 2);
      const b = clamp(L * 2 - 1);
      swEn.forEach((e) => put(e, { o: 1 - a, blur: a * 7 }));
      swTa.forEach((e) => put(e, { o: b, blur: (1 - b) * 7 }));

      const amp = 0.25 + 0.75 * clamp(swap + (1 - seg(t, 0.6, 1.4)) * seg(t, 0.3, 0.5));
      const u = lt / loop;
      mini.forEach((m, i) => scaleY(m, 0.3 + amp * 0.7 * Math.abs(Math.sin(TAU * u * 9 + i * 1.3))));
    },
  };
};

/** The principal asks for the day's rundown; four tiles pop in on the beat and count up. */
const pacoRundown: SceneFactory = (root) => {
  const who = $(root, ".pp-who");
  const q = $(root, ".pp-q");
  const qt = $(root, ".pp-q-t");
  const caret = $(root, ".pp-q .sc-caret");
  const ai = $(root, ".pp-ai");
  const mini = $$(root, ".pp-ai .pl-mini i");
  const tiles = $$(root, ".pp-tile");
  const nums = tiles.map((el) => $(el, ".pp-n"));
  const targets = nums.map((n) => Number(n?.dataset.n || 0));
  const foot = $(root, ".pp-foot");
  const Q = "Give me today's rundown.";
  const intro = 0.8;
  const loop = 9;
  return {
    intro,
    loop,
    poster: intro + 5.2,
    render(t) {
      const ws = spring(t - 0.05, 12, 0.75);
      put(who, { s: lerp(0.8, 1, ws), o: clamp(ws * 1.5) });
      put(foot, { o: clamp(t - 0.3) * 0.9 });

      const lt = t - intro;
      const qIn = spring(lt - 0.1, 13, 0.75);
      const qOut = ease(seg(lt, 7.9, 8.4));
      const n = Math.floor(clamp((lt - 0.25) / 1.1) * Q.length);
      text(qt, Q.slice(0, n));
      put(q, { s: lerp(0.85, 1, qIn), o: clamp(qIn * 1.5) * (1 - qOut), blur: qOut * 6 });
      blink(caret, lt > 0 && n < Q.length);

      put(ai, { x: (1 - easeOut(seg(lt, 1.45, 1.8))) * -0.8, o: clamp((lt - 1.45) * 4) * (1 - qOut) });
      const speak = seg(lt, 1.5, 1.7) * (1 - seg(lt, 3.9, 4.3));
      mini.forEach((m, i) => scaleY(m, 0.3 + 0.7 * speak * Math.abs(Math.sin(lt * 8 + i * 1.1) * Math.cos(lt * 3.1 + i))));

      tiles.forEach((el, i) => {
        const a = 1.9 + i * 0.42;
        const s = spring(lt - a, 12, 0.7);
        const out = ease(seg(lt, 7.8 + i * 0.06, 8.3 + i * 0.06));
        put(el, { y: (1 - s) * 1.6 + out * 1.2, s: lerp(0.86, 1, s), o: clamp(s * 1.6) * (1 - out) });
        text(nums[i], String(Math.round(targets[i] * easeOut(seg(lt, a, a + 0.7)))));
      });
    },
  };
};

/** Film poster: the PACO AI lockup builds, the input pill types its promise, answer chips float. */
const pacoFilm: SceneFactory = (root) => {
  const b1 = $(root, ".pf-blob1");
  const b2 = $(root, ".pf-blob2");
  const mark = $(root, ".pf-mark");
  const bars = $$(root, ".pf-mark .bar");
  const word = $(root, ".pf-word")!;
  const aiPill = $(root, ".pf-ai");
  const input = $(root, ".pf-input")!;
  const tt = $(root, ".pf-tt");
  const caret = $(root, ".pf-input .sc-caret");
  const chipEls = $$(root, ".pf-chip");
  const T = chars("Ask in English or தமிழ்");
  const intro = 2.2;
  const loop = 8;
  return {
    intro,
    loop,
    poster: intro + 3,
    render(t) {
      const lt = t - intro;
      const u = lt / loop;
      put(b1, { x: Math.sin(TAU * u) * 3, y: Math.cos(TAU * u) * 2, o: clamp(t * 2) });
      put(b2, { x: Math.cos(TAU * u) * 3, y: -Math.sin(TAU * u) * 2, o: clamp(t * 2) });

      const ms = spring(t - 0.1, 11, 0.6);
      put(mark, { s: ms, r: (1 - ms) * -25, o: clamp(ms * 2) });
      const settle = seg(t, 1.2, 2.2);
      bars.forEach((b, i) => {
        const rise = spring(t - 0.35 - i * 0.09, 14, 0.55);
        scaleY(b, rise * lerp(1, 0.72 + 0.28 * Math.sin(TAU * u * 4 + i * 1.4), settle));
      });
      const wk = easeOut(seg(t, 0.45, 1.15));
      word.style.clipPath = `inset(-10% ${((1 - wk) * 100).toFixed(2)}% -10% 0)`;
      put(word, { x: (1 - wk) * -1.5 });
      const as = spring(t - 1.0, 13, 0.6);
      put(aiPill, { s: as, o: clamp(as * 2) });

      const w = lerp(4.4, 28, spring(t - 1.3, 10, 0.85));
      input.style.width = `${w.toFixed(3)}em`;
      input.style.left = `${(32 - w / 2).toFixed(3)}em`;
      put(input, { o: clamp((t - 1.3) * 4) });

      chipEls.forEach((c, i) => {
        const cs = spring(t - 1.5 - i * 0.15, 12, 0.7);
        put(c, { y: (1 - cs) * 1.5 + Math.sin(TAU * u * 2 + i * 1.7) * 0.45, s: lerp(0.8, 1, cs), o: clamp(cs * 1.4) });
      });

      const len = T.length;
      const n =
        lt < 0.3 ? 0 : lt < 2.0 ? Math.floor(((lt - 0.3) / 1.7) * len) : lt < 5.6 ? len : lt < 6.4 ? Math.floor((1 - (lt - 5.6) / 0.8) * len) : 0;
      text(tt, T.slice(0, n).join(""));
      blink(caret, (n > 0 && n < len) || Math.floor(t * 2.2) % 2 === 0);
    },
  };
};

/* ------------------------------------------------------------------ TickBook */

/** A reading glass moves down a handwritten Tamil page; each line lifts off and lands as a ticked row. */
const tbPage: SceneFactory = (root) => {
  const page = $(root, ".tp-page");
  const table = $(root, ".tp-table");
  const lens = $(root, ".tp-lens")!;
  const lines = $$(root, ".tp-line");
  const rows = $$(root, ".tp-row");
  const ticks = rows.map((r) => $(r, ".tp-tick"));
  const brk = $$(root, ".tp-brk");
  const fly = $(root, ".tb-fly");
  const tot = $(root, ".tp-tot");
  const ok = $(root, ".tp-ok");
  const labels = ["Muthu ₹500", "Selvaraj ₹300", "Lakshmi N ₹200", "Ravi ₹500", "Kalyani ₹1,500"];
  const amounts = [500, 300, 200, 500, 1500];
  const lineY = (i: number) => 2.85 + i * 2.6;
  const A = (i: number) => 0.45 + i * 1.15; // when the glass arrives on line i (5 = the total line)
  const intro = 1.0;
  const loop = 10.4;
  return {
    intro,
    loop,
    poster: intro + 7.2,
    render(t) {
      const sp = spring(t - 0.05, 10, 0.72);
      put(page, { y: (1 - sp) * -3, r: -2 + (1 - sp) * -6, o: clamp(sp * 2) });
      const st = spring(t - 0.35, 11, 0.85);
      put(table, { x: (1 - st) * 2.5, o: clamp(st * 1.6) });

      const lt = t - intro;
      let ly = lineY(0);
      let swell = 0;
      for (let i = 1; i <= 5; i++) ly += ease(seg(lt, A(i) - 0.32, A(i))) * 2.6;
      for (let i = 0; i <= 5; i++) swell += bump(lt, A(i) - 0.05, 0.35);
      ly -= ease(seg(lt, 9.4, 9.9)) * 13;
      lens.style.top = `${ly.toFixed(3)}em`;
      put(lens, { sx: 1 + 0.02 * swell, sy: 1 + 0.14 * swell, o: seg(lt, 0.05, 0.35) * (1 - seg(lt, A(5) + 0.9, A(5) + 1.25)) });

      lines.forEach((el, i) => {
        const hl = env(lt, A(i) - 0.05, A(i) + 0.75, 0.3, 14, 0.6);
        cls(el, "is-read", i < 5 && lt >= A(i) && lt < 9.3);
        const fade = i === 5 ? 0.55 * seg(lt, A(5) + 0.4, A(5) + 0.7) * (1 - seg(lt, 9.3, 9.8)) : 0;
        put(el, { s: 1 + 0.09 * hl, o: 1 - fade });
      });
      [3, 4, 5].forEach((li, k) => {
        const s = spring(lt - A(li) - 0.1, 14, 0.7);
        put(brk[k], { s: lerp(1.6, 1, s), o: clamp(s * 1.5) * (1 - seg(lt, 9.2, 9.6)) });
      });

      let flying = false;
      for (let i = 0; i < 5; i++) {
        const a = A(i) + 0.25;
        if (lt < a - 0.12 || lt > a + 0.62) continue;
        const k = seg(lt, a, a + 0.6);
        const [x, y] = arc([5.8, 1.4 + lineY(i) + 1.0], [22.9, 1.4 + 4.15 + i * 2.95 + 1.35], ease(k), 2.5);
        const pop = spring(lt - (a - 0.12), 16, 0.7);
        text(fly, labels[i]);
        put(fly, { x: x - 3, y: y - 0.9, s: lerp(0.6, 1, pop) * (1 - 0.25 * seg(k, 0.85, 1)), o: clamp(pop * 2) * (1 - seg(k, 0.9, 1)) });
        flying = true;
      }
      if (!flying) put(fly, { o: 0 });

      let sum = 0;
      rows.forEach((r, i) => {
        const a = A(i) + 0.82;
        const s = spring(lt - a, 13, 0.72);
        const out = ease(seg(lt, 9.2 + i * 0.05, 9.6 + i * 0.05));
        put(r, { x: (1 - s) * 1.4, o: clamp(s * 1.6) * (1 - out) });
        put(ticks[i], { s: env(lt, a + 0.15, Infinity, 0.3, 16, 0.55) });
        sum += amounts[i] * easeOut(seg(lt, a, a + 0.5));
      });
      text(tot, `₹${inr(sum * (1 - seg(lt, 9.2, 9.6)))}`);
      put(ok, { o: seg(lt, A(4) + 1.2, A(4) + 1.5) * (1 - seg(lt, 9.2, 9.6)) });
    },
  };
};

/** Voice entry: the owner speaks, words land in HEARD, chips arc into customer cards; one tap applies UPI. */
const tbVoice: SceneFactory = (root) => {
  const phone = $(root, ".tv-phone");
  const mic = $(root, ".tv-mic");
  const rings = $$(root, ".tv-ring");
  const eq = $$(root, ".tv-eq i");
  const heard = $(root, ".tv-heard-t");
  const head = $(root, ".tv-head");
  const cards = $$(root, ".tv-card");
  const amts = cards.map((c) => $(c, ".tv-amt"));
  const modes = cards.map((c) => $(c, ".tv-mode"));
  const paids = cards.map((c) => $(c, ".tv-paid"));
  const dd = $(root, ".tv-dd");
  const ddTop = $(root, ".tv-dd div");
  const upi = $(root, ".tv-upi");
  const apply = $(root, ".tv-apply");
  const sync = $(root, ".tv-sync");
  const fly = $(root, ".tb-fly");
  const slot = (i: number): [number, number] => [[22.4, 4.7], [32.4, 4.7], [22.4, 13.2], [32.4, 13.2]][i] as [number, number];
  const from: [number, number] = [7.6, 15.9];
  const said = [
    { text: "Murugan five hundred", a: 0.4, b: 1.4 },
    { text: "Kannan two hundred", a: 3.1, b: 4.0 },
    { text: "Selvi three hundred online", a: 6.4, b: 7.5 },
  ];
  const flights = [
    { label: "Murugan ₹500", kind: "", form: 1.55, go: 1.8, land: 2.4, to: slot(0) },
    { label: "Kannan ₹200 ?", kind: "is-amb", form: 4.15, go: 4.4, land: 5.0, to: [25.1, 12.0] as [number, number], hold: 6.0, drop: 6.35, to2: slot(2) },
    { label: "Selvi ₹300 ONLINE", kind: "is-sky", form: 7.6, go: 7.85, land: 8.45, to: slot(1) },
  ];
  const intro = 0.9;
  const loop = 11;
  return {
    intro,
    loop,
    poster: intro + 9.6,
    render(t) {
      const ps = spring(t - 0.02, 10, 0.75);
      put(phone, { x: (1 - ps) * -3, r: (1 - ps) * -8, o: clamp(ps * 2) });
      put(head, { o: clamp((t - 0.2) * 3) });
      const us = spring(t - 0.6, 12, 0.8);
      put(upi, { y: (1 - us) * 1.2, o: clamp(us * 1.5) });

      const lt = t - intro;
      const live = seg(lt, 0.15, 0.4) * (1 - seg(lt, 10.0, 10.5));
      put(mic, { s: 1 - 0.12 * bump(lt, 0.1, 0.3) });
      rings.forEach((r, k) => {
        const ph = (((lt * 0.75 + k / 3) % 1) + 1) % 1;
        put(r, { s: lerp(1, 2.05, ph), o: (1 - ph) * 0.5 * live });
      });

      let speak = 0;
      let cur = -1;
      said.forEach((s, k) => {
        speak = Math.max(speak, seg(lt, s.a - 0.05, s.a + 0.1) * (1 - seg(lt, s.b, s.b + 0.2)));
        if (lt >= s.a - 0.1) cur = k;
      });
      if (lt > 10.2) cur = -1;
      eq.forEach((e, i) => scaleY(e, 0.28 + 0.72 * speak * Math.abs(Math.sin(lt * 9 + i * 1.3) * Math.cos(lt * 4.3 + i))));
      if (cur < 0) text(heard, "Waiting for speech…");
      else {
        const s = said[cur];
        text(heard, s.text.slice(0, Math.floor(clamp((lt - s.a) / (s.b - s.a)) * s.text.length)));
      }
      put(heard, { o: cur < 0 ? 0.5 : 1 });

      let flying = false;
      for (const f of flights) {
        const end = f.drop ?? f.land;
        if (lt < f.form || lt > end + 0.05) continue;
        let p: [number, number];
        if (lt < f.go) p = from;
        else if (lt < f.land) p = arc(from, f.to, ease(seg(lt, f.go, f.land)), 3);
        else if (f.hold && lt < f.hold) p = [f.to[0], f.to[1] + Math.sin((lt - f.land) * 7) * 0.12];
        else if (f.drop && f.to2) p = arc(f.to, f.to2, ease(seg(lt, f.hold!, f.drop)), 0.6);
        else p = f.to;
        const pop = spring(lt - f.form, 16, 0.65);
        text(fly, f.label);
        cls(fly, "is-amb", f.kind === "is-amb" && lt < (f.hold ?? 99));
        cls(fly, "is-sky", f.kind === "is-sky");
        put(fly, { x: p[0] - 3.2, y: p[1] - 0.85, s: lerp(0.5, 1, pop), o: clamp(pop * 2) * (1 - seg(lt, end - 0.08, end + 0.05)) });
        flying = true;
      }
      if (!flying) put(fly, { o: 0 });

      const kept = lt < 10.6;
      const fade = 1 - seg(lt, 10.1, 10.5);
      const landed = [2.4, 8.45, 6.35, Infinity];
      const values = ["500", "300", "200", ""];
      cards.forEach((c, i) => {
        const cs = spring(t - 0.25 - i * 0.09, 12, 0.75);
        put(c, { y: (1 - cs) * 1.5, s: lerp(0.9, 1, cs) * (1 + 0.06 * bump(lt, landed[i], 0.35)), o: clamp(cs * 1.5) });
        const has = kept && lt >= landed[i];
        text(amts[i], has ? values[i] : "");
        put(amts[i], { s: has ? lerp(1.3, 1, spring(lt - landed[i], 16, 0.6)) : 1, o: fade });
      });
      const paidAt = [2.4, 9.35, 6.35, Infinity];
      paids.forEach((el, i) => {
        const on = kept && lt >= paidAt[i];
        cls(el, "is-paid", on);
        text(el, on ? "Paid ✓" : "Paid");
      });
      const onl = kept && lt >= 8.45;
      cls(modes[1], "is-onl", onl);
      text(modes[1], onl ? "ONLINE" : "CASH");
      cls(cards[2], "is-cand", lt >= 5.0 && lt < 6.3);
      cls(cards[3], "is-cand", lt >= 5.0 && lt < 6.3);

      const dv = env(lt, 5.05, 6.05, 0.25, 15, 0.7);
      put(dd, { sy: lerp(0.6, 1, dv), o: clamp(dv * 1.5) });
      cls(ddTop, "is-on", lt > 5.55);
      put(ddTop, { s: 1 - 0.06 * bump(lt, 5.75, 0.25) });

      put(apply, { s: 1 - 0.14 * bump(lt, 8.7, 0.25) });
      const sk = seg(lt, 8.85, 9.35);
      put(sync, { x: lerp(32.2, 30.0, ease(sk)), y: lerp(21.7, 8.0, ease(sk)), o: sk > 0 && sk < 1 ? 1 : 0 });
    },
  };
};

/** Bank credits fall in; beams carry each one to its customer row, which turns ONL and ticks. */
const tbUpi: SceneFactory = (root) => {
  const credits = $$(root, ".tu-credit");
  const sts = credits.map((c) => $(c, ".tu-st"));
  const upis = sts.map((s) => s?.textContent || "");
  const rows = $$(root, ".tu-row");
  const chips = rows.map((r) => $(r, ".tu-chip"));
  const labels = $$(root, ".tu-label");
  const paths = $$(root, ".tu-beams path");
  const P = paths.map((p) => (p.dataset.p || "").split(" ").map(Number));
  const dot = $(root, ".tu-dot");
  const sum = $(root, ".tu-sum");
  const nEl = $(root, ".tu-n");
  const totEl = $(root, ".tu-total");
  const cubic = (p: number[], k: number): [number, number] => {
    const u = 1 - k;
    const a = u * u * u, b = 3 * u * u * k, c = 3 * u * k * k, d = k * k * k;
    return [a * p[0] + b * p[2] + c * p[4] + d * p[6], a * p[1] + b * p[3] + c * p[5] + d * p[7]];
  };
  const M = [
    { path: 0, credit: 0, row: 1, who: "Ravi #18" },
    { path: 1, credit: 1, row: 0, who: "Selvi K #11" },
    { path: 2, credit: 3, row: 2, who: "Priya R #22" },
  ];
  const intro = 1.0;
  const loop = 9.4;
  return {
    intro,
    loop,
    poster: intro + 6.8,
    render(t) {
      labels.forEach((l, i) => put(l, { o: clamp((t - 0.05 - i * 0.15) * 3) }));
      credits.forEach((c, i) => {
        const s = spring(t - 0.12 - i * 0.11, 12, 0.72);
        put(c, { y: (1 - s) * -2.2, o: clamp(s * 1.6) });
      });

      const lt = t - intro;
      const back = ease(seg(lt, 8.3, 8.8));
      const rowBump = rows.map(() => 0);
      let dotOn = false;
      M.forEach((m, k) => {
        const a = 0.45 + k * 1.55;
        const path = paths[m.path];
        path.style.strokeDashoffset = (1 - ease(seg(lt, a, a + 0.45)) * (1 - back)).toFixed(4);
        path.style.opacity = lt >= a + 1.0 ? "0.45" : "1";
        const tk = seg(lt, a + 0.4, a + 0.95);
        if (tk > 0 && tk < 1) {
          const [x, y] = cubic(P[m.path], ease(tk));
          put(dot, { x, y, o: 1 });
          dotOn = true;
        }
        const ok = lt >= a + 0.95 && lt < 8.5;
        cls(rows[m.row], "is-ok", ok);
        text(chips[m.row], ok ? "ONL ✓" : "UPI?");
        text(sts[m.credit], ok ? `✓ ${m.who}` : upis[m.credit]);
        rowBump[m.row] = bump(lt, a + 0.95, 0.35);
      });
      if (!dotOn) put(dot, { o: 0 });
      const un = lt >= 5.3 && lt < 8.5;
      cls(credits[2], "is-un", un);
      text(sts[2], un ? "Unmapped" : upis[2]);

      rows.forEach((r, j) => {
        const s = spring(t - 0.45 - j * 0.11, 12, 0.8);
        put(r, { x: (1 - s) * 2, s: 1 + 0.05 * rowBump[j], o: clamp(s * 1.6) });
      });
      const ss = env(lt, 5.8, 8.2, 0.4, 12, 0.75);
      put(sum, { y: (1 - clamp(ss)) * 1, s: lerp(0.9, 1, ss), o: clamp(ss * 1.5) });
      text(nEl, String(Math.round(3 * easeOut(seg(lt, 5.85, 6.4)))));
      text(totEl, `₹${inr(2800 * easeOut(seg(lt, 5.85, 6.6)))}`);
    },
  };
};

/** Next morning: the night's three questions flip, one per bar, into their answers. */
const tbAnswers: SceneFactory = (root) => {
  const sun = $(root, ".ta-sun");
  const label = $(root, ".ta-label");
  const flips = $$(root, ".ta-flip");
  const ins = flips.map((f) => $(f, ".ta-in")!);
  const rowsPer = flips.map((f) => $$(f, ".ta-r, .ta-owe"));
  const strips = $$(root, ".ta-strip");
  const delta = $(root, ".ta-delta");
  const F = [0.7, 3.3, 5.9];
  const intro = 1.0;
  const loop = 12.4;
  return {
    intro,
    loop,
    poster: intro + 9.2,
    render(t) {
      const lt = t - intro;
      const ss = spring(t - 0.05, 6, 0.95);
      put(sun, { y: (1 - ss) * 6, s: 1 + 0.04 * Math.sin((TAU * lt * 2) / loop), o: clamp(ss * 1.2) });
      put(label, { o: clamp((t - 0.3) * 3) });

      flips.forEach((f, k) => {
        const ds = spring(t - 0.15 - k * 0.12, 12, 0.75);
        const fl = spring(lt - F[k], 11, 0.72) - spring(lt - (10.6 + k * 0.22), 12, 0.82);
        ins[k].style.transform = `rotateX(${(180 * fl).toFixed(2)}deg)`;
        put(f, { y: (1 - ds) * -1.5, s: lerp(0.94, 1, ds) * (1 + 0.035 * Math.sin(Math.PI * clamp(fl))), o: clamp(ds * 1.6) });
        rowsPer[k].forEach((r, j) => {
          const rs = spring(lt - F[k] - 0.4 - j * 0.12, 13, 0.8) * (1 - seg(lt, 10.4, 10.7));
          put(r, { x: (1 - clamp(rs)) * 1.2, o: clamp(rs * 1.5) });
        });
      });

      const owed = easeOut(seg(lt, F[2] + 0.7, F[2] + 1.7)) * (1 - seg(lt, 11.0, 11.6));
      put(strips[0], { y: -(9 - owed) });
      put(strips[1], { y: -5 * owed });
      const dv = env(lt, F[2] + 1.6, 10.4, 0.3, 14, 0.6);
      put(delta, { s: lerp(0.6, 1, dv), o: clamp(dv * 1.5) });
    },
  };
};

/** Film poster: the ledger-check tile draws itself, the wordmark rises letter by letter. */
const tbFilm: SceneFactory = (root) => {
  const glow = $(root, ".tf-glow");
  const tile = $(root, ".tf-tile");
  const strokes = $$(root, ".tf-s");
  const letters = $$(root, ".tf-word span");
  const words = $$(root, ".tf-tag span");
  const scrap = $(root, ".tf-scrap");
  const chipEls = $$(root, ".tf-chip");
  const draw = [
    [0.45, 0.8],
    [0.62, 0.97],
    [0.95, 1.35],
    [1.2, 1.45],
  ];
  const intro = 2.6;
  const loop = 6;
  return {
    intro,
    loop,
    poster: intro + 1,
    render(t) {
      const lt = t - intro;
      const u = lt / loop;
      put(glow, { x: Math.sin(TAU * u) * 2, y: Math.cos(TAU * u) * 1, o: clamp(t * 1.5) });
      const ts = spring(t - 0.1, 11, 0.62);
      put(tile, { s: ts * (1 + 0.06 * bump(lt, 3.0, 0.45)), r: (1 - ts) * -18, o: clamp(ts * 2) });
      strokes.forEach((p, i) => (p.style.strokeDashoffset = (1 - ease(seg(t, draw[i][0], draw[i][1]))).toFixed(4)));
      letters.forEach((l, i) => {
        const s = spring(t - 0.95 - i * 0.055, 13, 0.72);
        put(l, { y: (1 - s) * 0.5 - 0.06 * bump(lt, 3.05 + i * 0.04, 0.35), o: clamp(s * 1.6), blur: (1 - clamp(s)) * 5 });
      });
      words.forEach((w, i) => {
        const s = spring(t - 1.7 - i * 0.13, 11, 0.8);
        put(w, { y: (1 - s) * 0.4, o: clamp(s * 1.5), blur: (1 - clamp(s)) * 8 });
      });
      const sc = spring(t - 1.4, 10, 0.75);
      put(scrap, { y: (1 - sc) * 2 + Math.sin(TAU * u + 1) * 0.4, r: -7 + Math.sin(TAU * u) * 1.2, o: clamp(sc * 1.5) });
      chipEls.forEach((c, i) => {
        const cs = spring(t - 1.6 - i * 0.15, 12, 0.7);
        put(c, { y: (1 - cs) * 1.5 + Math.sin(TAU * u + i * 2.1) * 0.45, s: lerp(0.8, 1, cs), o: clamp(cs * 1.4) });
      });
    },
  };
};

export function initShowcase() {
  const scenes = runScenes({
    "paco-ask": pacoAsk,
    "paco-roles": pacoRoles,
    "paco-lang": pacoLang,
    "paco-rundown": pacoRundown,
    "paco-film": pacoFilm,
    "tb-page": tbPage,
    "tb-voice": tbVoice,
    "tb-upi": tbUpi,
    "tb-answers": tbAnswers,
    "tb-film": tbFilm,
  });

  // The wide card in each group swaps its motion poster for the YouTube film when clicked.
  document.querySelectorAll<HTMLElement>(".sc-video").forEach((card) => {
    const stage = card.querySelector<HTMLElement>(".sc-stage");
    const art = card.querySelector<HTMLElement>("[data-scene]");
    if (!stage) return;
    stage.addEventListener("click", () => {
      if (card.classList.contains("is-playing")) return;
      if (art) scenes.stop(art);
      const iframe = document.createElement("iframe");
      iframe.src = `https://www.youtube-nocookie.com/embed/${card.dataset.video}?autoplay=1&rel=0&modestbranding=1&playsinline=1`;
      iframe.title = card.dataset.title || "Product film";
      iframe.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen";
      iframe.allowFullscreen = true;
      iframe.referrerPolicy = "strict-origin-when-cross-origin";
      stage.replaceChildren(iframe);
      card.classList.add("is-playing");
    });
  });
}
