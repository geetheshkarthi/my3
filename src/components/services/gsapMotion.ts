import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Flip } from "gsap/Flip";

let registered = false;

/**
 * Registers GSAP ScrollTrigger & Flip safely on the browser client only
 * (guards TanStack Start SSR execution in Node).
 */
export function ensureGsapRegistered(): typeof gsap | null {
  if (typeof window === "undefined") return null;
  if (!registered) {
    gsap.registerPlugin(ScrollTrigger, Flip);
    ScrollTrigger.config({ ignoreMobileResize: true });
    registered = true;
  }
  return gsap;
}

export { gsap, ScrollTrigger, Flip };

/**
 * Smoothly scrolls to an element ID via Lenis if active, or falls back to native scroll.
 */
export function scrollToSectionId(id: string) {
  if (typeof window === "undefined") return;
  const el = document.getElementById(id);
  if (!el) return;
  const lenis = (window as Window & { __my3Lenis?: { scrollTo: (t: HTMLElement | number, o?: object) => void } })
    .__my3Lenis;
  if (lenis) {
    lenis.scrollTo(el, { offset: -86, duration: 1.1 });
  } else {
    const top = el.getBoundingClientRect().top + window.scrollY - 86;
    window.scrollTo({ top, behavior: "smooth" });
  }
}
