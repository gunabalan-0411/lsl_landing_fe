// Page-level motion from the premium-frontend-ui skill: smooth scroll, a nav that hides on the way down,
// headlines that resolve word by word out of a blur, magnetic CTAs and the footer wordmark reveal.
import Lenis from "lenis";
import "lenis/dist/lenis.css";

export function initSiteMotion() {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;

  if (!reduce) new Lenis({ autoRaf: true, lerp: 0.11, anchors: { offset: -72 } });

  // Nav: hide while scrolling down, reveal on the way back up.
  const nav = document.querySelector<HTMLElement>("[data-nav]");
  let lastY = scrollY;
  addEventListener(
    "scroll",
    () => {
      const y = scrollY;
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

  // Footer wordmark: resolves from a heavy blur as the page reaches its end.
  const mark = document.querySelector<HTMLElement>("[data-wordmark]");
  if (mark && !reduce) {
    const update = () => {
      const r = (mark.parentElement || mark).getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (innerHeight - r.top) / r.height));
      mark.style.filter = `blur(${((1 - p) * 18).toFixed(1)}px)`;
      mark.style.opacity = (0.25 + 0.75 * p).toFixed(3);
      mark.style.transform = `translateY(${((1 - p) * 30).toFixed(1)}%)`;
    };
    const vis = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) addEventListener("scroll", update, { passive: true });
      else removeEventListener("scroll", update);
      update();
    });
    vis.observe(mark);
  }
}
