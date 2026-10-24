// Loads each section's motion code only when the visitor scrolls near it, top to bottom,
// so the first screen never waits on the scenes further down the page.
import { mountScenes } from "./motion";

const idle = (fn: () => void) =>
  "requestIdleCallback" in window ? requestIdleCallback(fn, { timeout: 1200 }) : setTimeout(fn, 150);

function whenNear(el: Element, run: () => void, margin = "900px 0px") {
  const io = new IntersectionObserver(
    (entries) => {
      if (!entries.some((e) => e.isIntersecting)) return;
      io.disconnect();
      idle(run);
    },
    { rootMargin: margin },
  );
  io.observe(el);
}

export function initScenes() {
  const services = document.querySelector<HTMLElement>("#services");
  if (services)
    whenNear(services, async () => {
      const m = await import("./services");
      mountScenes(services, m.serviceScenes);
      m.initServices();
    });

  const work = document.querySelector<HTMLElement>("#work");
  if (work)
    whenNear(work, async () => {
      // The Tamil subset fonts are only needed by the showcase cards.
      const href = work.dataset.fonts;
      if (href) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = href;
        document.head.append(link);
      }
      const m = await import("./showcase");
      m.wireVideos(mountScenes(work, m.showcaseScenes));
    });
}
