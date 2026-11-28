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
      const w = Math.min(window.innerWidth * (mobile ? 0.84 : 0.32), 540);
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
