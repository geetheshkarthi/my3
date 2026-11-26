import { useEffect } from "react";

/**
 * Smooth, eased wheel/trackpad scrolling (Apple-style) for desktops, using Lenis.
 * - Touch devices (iPhone, Android) keep their native momentum scrolling.
 * - Skipped when the visitor prefers reduced motion.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    let raf = 0;
    let lenis: { raf: (t: number) => void; destroy: () => void } | null = null;
    let disposed = false;

    (async () => {
      const { default: Lenis } = await import("lenis");
      if (disposed) return;
      lenis = new Lenis({
        duration: 1.25,
        easing: (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)), // expo-out, like apple.com
        smoothWheel: true,
        wheelMultiplier: 0.9,
      });
      const loop = (time: number) => { lenis?.raf(time); raf = requestAnimationFrame(loop); };
      raf = requestAnimationFrame(loop);
    })();

    return () => { disposed = true; cancelAnimationFrame(raf); lenis?.destroy(); };
  }, []);

  return null;
}
