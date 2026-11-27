import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { capabilities, capabilityImages } from "@/content/site";

const N = capabilities.length;
/** Pinned section: vertical scroll drives a tilted horizontal reel (styled after the Anubi featured reel). */
export function CapabilityReel() {
  const secRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const barRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    let last = -1;
    const update = () => {
      const sec = secRef.current;
      if (!sec) return;
      const r = sec.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height - window.innerHeight)));
      const a = p * (N - 1);
      const mobile = window.innerWidth < 780;
      const w = Math.min(window.innerWidth * (mobile ? 0.66 : 0.32), 540);
      cardRefs.current.forEach((el, i) => {
        if (!el) return;
        const d = i - a, ad = Math.abs(d);
        const x = d * w * 1.06 + (mobile ? 0 : w * 0.18) - w / 2;
        const scale = 1 - 0.14 * Math.min(ad, 1.5);
        el.style.transform = `translate3d(${x}px, ${d * 6}px, ${-Math.min(ad, 2) * 80}px) rotateY(${d * -16}deg) rotateZ(${d * 2.2}deg) scale(${scale})`;
        el.style.opacity = String(d < 0 ? Math.max(0, 1 + d * 1.2) : Math.max(0.0, 1 - ad * 0.25));
        el.style.zIndex = String(100 - Math.round(ad * 10));
        const cap = el.querySelector<HTMLElement>(".cap-caption");
        if (cap) cap.style.opacity = String(Math.max(0, 1 - ad * 1.6));
      });
      if (barRef.current) barRef.current.style.transform = `scaleX(${p})`;
      const idx = Math.round(a);
      if (idx !== last) { last = idx; setActive(idx); }
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => { window.removeEventListener("scroll", update); window.removeEventListener("resize", update); };
  }, []);

  // One scroll = one capability: while the reel is pinned, each wheel/trackpad gesture glides to exactly the next
  // (or previous) card. Before the first and after the last card the page scrolls normally.
  useEffect(() => {
    type Lenis = { scrollTo: (y: number, o: { duration: number; easing: (t: number) => number; lock?: boolean; force?: boolean }) => void };
    let busyUntil = 0, lastWheel = 0, cur = -1, used = false;
    const ease = (t: number) => 1 - Math.pow(1 - t, 4);
    const onWheel = (e: WheelEvent) => {
      const sec = secRef.current;
      const now = performance.now();
      if (now - lastWheel > 160) used = false;                     // a new gesture (not the tail of the last one)
      lastWheel = now;
      if (!sec || Math.abs(e.deltaY) < 2) return;
      const vh = window.innerHeight;
      const r = sec.getBoundingClientRect();
      if (r.top > 1 || r.bottom < vh - 1) return;                 // not pinned: normal scrolling
      const range = r.height - vh, step = range / (N - 1);
      const p = Math.min(1, Math.max(0, -r.top / Math.max(1, range)));
      const at = p * (N - 1), dir = e.deltaY > 0 ? 1 : -1;
      const idx = Math.round(at);
      // mid-glide, a new gesture continues on from the card we are heading to
      const from = now < busyUntil && cur >= 0 ? cur : null;
      const target = from != null ? from + dir : Math.abs(at - idx) > 0.08 ? (dir > 0 ? Math.ceil(at) : Math.floor(at)) : idx + dir;
      if (target < 0 || target > N - 1) return;                    // past either end: let the page carry on
      e.preventDefault(); e.stopImmediatePropagation();
      if (used) return;                                            // exactly one card per gesture
      used = true; busyUntil = now + 520; cur = target;
      const top = window.scrollY + r.top + target * step;
      const lenis = (window as unknown as { __lenis?: Lenis }).__lenis;
      if (lenis) lenis.scrollTo(top, { duration: 0.55, easing: ease, force: true });
      else window.scrollTo({ top, behavior: "smooth" });
    };
    window.addEventListener("wheel", onWheel, { passive: false, capture: true });
    return () => window.removeEventListener("wheel", onWheel, { capture: true } as EventListenerOptions);
  }, []);

  return (
    <section ref={secRef} id="services" className="cap" aria-labelledby="cap-heading" style={{ height: `${N * 90 + 40}svh` }}>
      <div className="cap-pin">
        <h2 id="cap-heading" className="cap-title">Our Capabilities</h2>
        {capabilities.map(([title, text, tags], i) => (
          <article key={title} ref={(el) => { cardRefs.current[i] = el; }} className="cap-card">
            <Link to="/services">
              <div className="cap-poster"><img src={capabilityImages[i]} alt={title} width="1200" height="675" decoding="async" /></div>
              <div className="cap-caption">
                <div>
                  <h3>{title}</h3>
                  <p className="cap-text">{text}</p>
                  <p className="cap-meta">{tags.split(" · ").map((t) => <span key={t}>{t}</span>)}</p>
                </div>
                <span className="cap-open" aria-hidden="true">↗</span>
              </div>
            </Link>
          </article>
        ))}
        <div className="cap-count"><span>{String(active + 1).padStart(2, "0")}</span><span className="cap-bar"><i ref={barRef} /></span><span className="cap-total">{String(N).padStart(2, "0")}</span></div>
      </div>
    </section>
  );
}
