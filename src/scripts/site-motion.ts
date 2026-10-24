// Page-level motion from the premium-frontend-ui skill: smooth scroll, a nav that hides on the way down,
// headlines that resolve word by word out of a blur, magnetic CTAs and the footer wordmark reveal.
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { clamp, ease } from "./motion";

const idle = (fn: () => void, timeout = 1500) =>
  "requestIdleCallback" in window ? requestIdleCallback(fn, { timeout }) : setTimeout(fn, 200);

/** Runs `fn` at most once per animation frame, however often the event fires. */
const perFrame = (fn: () => void) => {
  let queued = false;
  return () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      fn();
    });
  };
};

export function initSiteMotion() {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;

  // Smooth scrolling and the hero orb start once the first screen is up, never during it.
  if (!reduce) idle(() => new Lenis({ autoRaf: true, lerp: 0.11, anchors: { offset: -72 } }));
  const loadOrb = () =>
    idle(() => {
      const s = document.createElement("script");
      s.src = "/thinking-orb.js";
      document.head.append(s);
    }, 800);
  if (document.readyState === "complete") loadOrb();
  else addEventListener("load", loadOrb, { once: true });

  // Looping CSS animations (grids, blobs, marquee) pause whenever their section is off screen.
  const pausers = new IntersectionObserver((entries) =>
    entries.forEach((e) => e.target.classList.toggle("is-paused", !e.isIntersecting)),
  );
  document.querySelectorAll("[data-pause]").forEach((el) => pausers.observe(el));

  // Nav: hide while scrolling down, reveal on the way back up.
  const nav = document.querySelector<HTMLElement>("[data-nav]");
  let lastY = -1;
  addEventListener(
    "scroll",
    () => {
      const y = scrollY;
      if (lastY < 0) lastY = y;
      if (nav) nav.classList.toggle("is-hidden", y > 160 && y > lastY + 2);
      if (nav && y < lastY - 2) nav.classList.remove("is-hidden");
      lastY = y;
    },
    { passive: true },
  );

  // Headlines: wrap each word so it can resolve out of a blur, staggered, when it scrolls into view.
  const split = document.querySelectorAll<HTMLElement>("[data-split]");
  split.forEach((el) => {
    let i = 0;
    const walk = (node: Node) => {
      [...node.childNodes].forEach((child) => {
        if (child.nodeType === Node.TEXT_NODE) {
          const frag = document.createDocumentFragment();
          (child.textContent || "").split(/(\s+)/).forEach((part) => {
            if (!part) return;
            if (/^\s+$/.test(part)) return frag.append(part);
            const w = document.createElement("span");
            w.className = "sw-word";
            w.style.setProperty("--i", String(i++));
            w.textContent = part;
            frag.append(w);
          });
          child.replaceWith(frag);
        } else if (child.nodeType === Node.ELEMENT_NODE) {
          walk(child);
        }
      });
    };
    walk(el);
  });
  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add("is-in");
        io.unobserve(e.target);
      }),
    { threshold: 0.4 },
  );
  split.forEach((el) => io.observe(el));

  // Magnetic CTAs: pulled a little toward the pointer (uses `translate`, so hover transforms still apply).
  if (fine && !reduce) {
    document.querySelectorAll<HTMLElement>("[data-magnetic]").forEach((el) => {
      el.addEventListener("pointermove", (ev) => {
        const r = el.getBoundingClientRect();
        const dx = ev.clientX - (r.left + r.width / 2);
        const dy = ev.clientY - (r.top + r.height / 2);
        el.style.translate = `${(dx * 0.22).toFixed(1)}px ${(dy * 0.3).toFixed(1)}px`;
      });
      el.addEventListener("pointerleave", () => (el.style.translate = ""));
    });
  }

  // Industries: the headline's last word rotates, and the tile it names lights up with it.
  const rot = document.querySelector<HTMLElement>("[data-rotator]");
  if (rot && !reduce) {
    const words = [...rot.children] as HTMLElement[];
    const tiles = [...document.querySelectorAll<HTMLElement>("[data-rotator-target] [data-i]")];
    let cur = 0;
    let timer = 0;
    const show = (n: number) => {
      words.forEach((w, j) => {
        w.classList.toggle("is-on", j === n);
        w.classList.toggle("is-out", j === cur && j !== n);
      });
      tiles.forEach((el, j) => el.classList.toggle("is-hot", j === n));
      cur = n;
    };
    new IntersectionObserver(([e]) => {
      clearInterval(timer);
      if (e.isIntersecting) {
        show(cur);
        timer = window.setInterval(() => show((cur + 1) % words.length), 2200);
      } else {
        tiles.forEach((el) => el.classList.remove("is-hot"));
      }
    }).observe(rot.closest("section") || rot);
  }

  // Cards with a spotlight that follows the pointer.
  if (fine) {
    document.querySelectorAll<HTMLElement>("[data-spot]").forEach((el) => {
      el.addEventListener("pointermove", (ev) => {
        const r = el.getBoundingClientRect();
        el.style.setProperty("--mx", `${(ev.clientX - r.left).toFixed(0)}px`);
        el.style.setProperty("--my", `${(ev.clientY - r.top).toFixed(0)}px`);
      });
    });
  }

  // Technology: the layers separate as the section scrolls in; the highlight cycles unless a row is hovered.
  const scene = document.querySelector<HTMLElement>("[data-stack-scroll]");
  if (scene) {
    const stack = scene.querySelector<HTMLElement>(".tk-stack");
    const planes = [...scene.querySelectorAll<HTMLElement>(".tk-plane")];
    const rows = [...document.querySelectorAll<HTMLElement>(".tk-row")];
    let hot = -1;
    let hovering = false;
    let timer = 0;
    const setHot = (n: number) => {
      hot = n;
      planes.forEach((el) => el.classList.toggle("is-hot", Number(el.dataset.i) === n));
      rows.forEach((el) => el.classList.toggle("is-hot", Number(el.dataset.i) === n));
    };
    rows.forEach((r) => {
      r.addEventListener("pointerenter", () => {
        hovering = true;
        setHot(Number(r.dataset.i));
      });
      r.addEventListener("pointerleave", () => (hovering = false));
    });
    const spread = perFrame(() => {
      if (!stack) return;
      const r = scene.getBoundingClientRect();
      const k = reduce ? 1 : ease(clamp(((innerHeight - r.top) / (innerHeight + r.height) - 0.12) / 0.4));
      const gap = 14 + 76 * k;
      stack.style.setProperty("--gap", `${gap.toFixed(1)}px`);
      stack.style.setProperty("--rz", `${(-52 + 12 * k).toFixed(2)}deg`);
      stack.style.setProperty("--ty", `${(gap * 1.25).toFixed(1)}px`);
    });
    new IntersectionObserver(([e]) => {
      clearInterval(timer);
      if (e.isIntersecting) {
        addEventListener("scroll", spread, { passive: true });
        if (hot < 0) setHot(0);
        if (!reduce) timer = window.setInterval(() => !hovering && setHot((hot + 1) % planes.length), 2400);
      } else {
        removeEventListener("scroll", spread);
      }
      spread();
    }).observe(scene);
  }

  // Footer wordmark: rises into place as the page reaches its end (transform + opacity only, so it stays cheap).
  const mark = document.querySelector<HTMLElement>("[data-wordmark]");
  if (mark && !reduce) {
    const update = perFrame(() => {
      const r = (mark.parentElement || mark).getBoundingClientRect();
      const p = ease(clamp((innerHeight - r.top) / r.height));
      mark.style.opacity = (0.15 + 0.85 * p).toFixed(3);
      mark.style.transform = `translateY(${((1 - p) * 34).toFixed(1)}%) scale(${(0.94 + 0.06 * p).toFixed(4)})`;
    });
    new IntersectionObserver(([e]) => {
      if (e.isIntersecting) addEventListener("scroll", update, { passive: true });
      else removeEventListener("scroll", update);
      update();
    }).observe(mark);
  }
}
