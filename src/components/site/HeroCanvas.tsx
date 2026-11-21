import { useEffect, useRef } from "react";

const TOTAL = 54;
const src = (i: number) => `/hero-frames/frame_${String(i + 1).padStart(3, "0")}.webp`;

/** Scroll-scrubbed spaceship frame player. `progress` is read from the parent section's scroll position. */
export function HeroCanvas({ sectionRef }: { sectionRef: React.RefObject<HTMLElement | null> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const frames: HTMLImageElement[] = Array.from({ length: TOTAL }, (_, i) => {
      const im = new Image();
      im.src = src(i);
      return im;
    });
    let target = 0, current = 0, mx = 0, my = 0, tx = 0, ty = 0, raf = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
    };
    const onScroll = () => {
      const el = sectionRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height - window.innerHeight)));
      target = p * (TOTAL - 1);
    };
    const onMove = (e: MouseEvent) => {
      tx = e.clientX / window.innerWidth - 0.5;
      ty = e.clientY / window.innerHeight - 0.5;
    };
    const draw = () => {
      current += (target - current) * 0.08;
      mx += (tx - mx) * 0.06;
      my += (ty - my) * 0.06;
      const img = frames[Math.min(TOTAL - 1, Math.max(0, Math.round(current)))];
      if (img?.complete && img.naturalWidth) {
        const cw = canvas.width, ch = canvas.height;
        const s = Math.max(cw / img.naturalWidth, ch / img.naturalHeight) * 1.05;
        const w = img.naturalWidth * s, h = img.naturalHeight * s;
        ctx.clearRect(0, 0, cw, ch);
        const x = (cw - w) / 2 + mx * 28, y = (ch - h) / 2 + my * 28;
        ctx.drawImage(img, x, y, w, h);
        // Blank out the sparkle/"Vico" watermark baked into the bottom-right of every frame.
        const g = ctx.createRadialGradient(x + w, y + h, w * 0.14, x + w, y + h, w * 0.28);
        g.addColorStop(0, "rgba(0,0,0,1)");
        g.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = g;
        ctx.fillRect(x + w * 0.6, y + h * 0.6, w * 0.4, h * 0.4);
      }
      raf = requestAnimationFrame(draw);
    };

    resize(); onScroll();
    window.addEventListener("resize", resize);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onMove);
    };
  }, [sectionRef]);

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />;
}
