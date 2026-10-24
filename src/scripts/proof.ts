// The proof transition: scroll progress through the pinned section (0 -> 1) drives every element,
// so the title builds as you scroll down and unbuilds as you scroll back up.
import { clamp, ease, easeOut, lerp, seg } from "./motion";

export function initProof() {
  const sec = document.querySelector<HTMLElement>("[data-proof]");
  if (!sec || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  sec.classList.add("is-live");

  const q = <T extends Element = HTMLElement>(s: string) => sec.querySelector<T>(s) as unknown as HTMLElement;
  const inner = q(".pr-inner");
  const eye = q(".pr-eye");
  const l1 = q(".pr-l1");
  const words = [...sec.querySelectorAll<HTMLElement>(".pr-l1 span")];
  const l2 = q(".pr-l2 span");
  const prods = [...sec.querySelectorAll<HTMLElement>(".pr-prod")];
  const sub = q(".pr-sub");
  const cue = q(".pr-cue");
  const glow = q(".pr-glow");
  const grid = q(".pr-grid");
  const floats = [...sec.querySelectorAll<HTMLElement>(".pr-float")];
  const from = [
    [-90, -40],
    [90, -30],
    [-80, 40],
    [100, 30],
  ];

  // How far to push the block down so line one sits dead centre before the rest arrives.
  let centre = 0;
  const measure = () => {
    centre = inner.offsetHeight / 2 - (l1.offsetTop + l1.offsetHeight / 2);
  };

  const set = (el: HTMLElement, o: number, tf = "", blur = 0) => {
    el.style.opacity = clamp(o).toFixed(3);
    el.style.transform = tf;
    el.style.filter = blur > 0.05 ? `blur(${blur.toFixed(1)}px)` : "";
  };

  const render = (p: number) => {
    const s1 = ease(seg(p, 0.3, 0.46));
    const exit = ease(seg(p, 0.9, 1));
    inner.style.transform = `translateY(${(centre * (1 - s1)).toFixed(1)}px) scale(${(1 + 0.06 * exit).toFixed(4)})`;
    inner.style.opacity = (1 - 0.9 * exit).toFixed(3);

    const e = easeOut(seg(p, 0, 0.07));
    set(eye, e, `translateY(${((1 - e) * 12).toFixed(1)}px)`);
    words.forEach((w, i) => {
      const k = easeOut(seg(p, 0.03 + i * 0.035, 0.14 + i * 0.035));
      set(w, k, `translateY(${((1 - k) * 0.4).toFixed(3)}em)`, (1 - k) * 14);
    });
    l1.style.opacity = (1 - 0.4 * s1).toFixed(3);

    const k2 = easeOut(seg(p, 0.34, 0.54));
    set(l2, k2, `scale(${lerp(1.35, 1, k2).toFixed(4)})`, (1 - k2) * 22);

    prods.forEach((el, i) => {
      const k = easeOut(seg(p, 0.52 + i * 0.04, 0.62 + i * 0.04));
      set(el, k, `translateY(${((1 - k) * 18).toFixed(1)}px) scale(${lerp(0.9, 1, k).toFixed(4)})`);
    });
    const ks = easeOut(seg(p, 0.6, 0.7));
    set(sub, ks, `translateY(${((1 - ks) * 14).toFixed(1)}px)`);
    set(cue, easeOut(seg(p, 0.68, 0.76)));

    floats.forEach((f, i) => {
      const k = easeOut(seg(p, 0.4 + i * 0.05, 0.56 + i * 0.05));
      const drift = (p - 0.65) * 70 * (i % 2 ? 1 : -1);
      set(f, k * (1 - exit), `translate(${((1 - k) * from[i][0]).toFixed(1)}px, ${((1 - k) * from[i][1] + drift).toFixed(1)}px)`, (1 - k) * 8);
    });
    glow.style.transform = `scale(${lerp(0.55, 1.1, ease(p)).toFixed(4)})`;
    glow.style.opacity = (0.45 + 0.55 * seg(p, 0.3, 0.6)).toFixed(3);
    grid.style.transform = `translateY(${(-p * 90).toFixed(1)}px)`;
  };

  let raf = 0;
  const update = () => {
    raf = 0;
    const r = sec.getBoundingClientRect();
    render(clamp(-r.top / Math.max(1, r.height - innerHeight)));
  };
  const queue = () => {
    if (!raf) raf = requestAnimationFrame(update);
  };
  addEventListener("scroll", queue, { passive: true });
  addEventListener("resize", () => {
    measure();
    queue();
  });
  requestAnimationFrame(() => {
    measure();
    update();
  });
  document.fonts?.ready.then(() => {
    measure();
    queue();
  });
}
