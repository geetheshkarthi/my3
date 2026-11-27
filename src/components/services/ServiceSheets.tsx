import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { colorStackDivisions } from "./colorStackData";

/** Short labels for the floating pill nav at the bottom of the screen. */
const PILL = ["Websites", "Branding", "Performance", "Marketing", "Technology"];

/**
 * Services as a pile of full-screen sheets: each one pins to the top while the next
 * slides up over it (rounded top edge), and the sheet underneath dims and shrinks a little.
 * A small pill at the bottom shows which service you are on and how far through it you are.
 */
export function ServiceSheets() {
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(-1);
  const [open, setOpen] = useState<string | null>(null);

  useEffect(() => {
    const el = root.current; if (!el) return;
    const sheets = Array.from(el.querySelectorAll<HTMLElement>(".svs-sheet"));
    const divs = sheets.filter((s) => s.dataset["div"] != null);
    const fills = Array.from(el.querySelectorAll<HTMLElement>(".svs-pill-fill"));
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;

    // where each sheet sits in the page when not pinned (offsetTop of a pinned sheet is its pinned spot)
    const flowTops = () => {
      let y = el.getBoundingClientRect().top + window.scrollY;
      return sheets.map((s) => { const t = y; y += s.offsetHeight; return t; });
    };

    // a sheet taller than the screen pins once its bottom reaches the bottom of the screen
    const pin = () => {
      const vh = window.innerHeight;
      for (const s of sheets) s.style.top = `${Math.min(0, vh - s.offsetHeight)}px`;
    };

    const update = () => {
      raf = 0;
      const vh = window.innerHeight;
      // dim + shrink each sheet as the next one covers it
      sheets.forEach((s, i) => {
        const next = sheets[i + 1];
        const c = next ? Math.min(1, Math.max(0, 1 - next.getBoundingClientRect().top / vh)) : 0;
        s.style.setProperty("--cover", reduce ? "0" : c.toFixed(4));
      });
      // which service is on screen, and how far through it we are
      const y = window.scrollY;
      const tops = flowTops();
      const starts = divs.map((d) => tops[sheets.indexOf(d)]!);
      const end = el.offsetTop + el.offsetHeight - vh;
      let a = -1;
      starts.forEach((s, i) => { if (y >= s - vh * 0.5) a = i; });
      const last = el.getBoundingClientRect().bottom < vh * 0.6;
      setActive(last ? -1 : a);
      fills.forEach((f, i) => {
        const from = starts[i]!, to = i + 1 < starts.length ? starts[i + 1]! : end;
        const p = Math.min(1, Math.max(0, (y - from + vh * 0.5) / Math.max(1, to - from + vh * 0.5)));
        f.style.transform = `scaleX(${p})`;
      });
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(update); };
    const relayout = () => { pin(); on(); };

    relayout();
    const ro = new ResizeObserver(relayout);
    sheets.forEach((s) => ro.observe(s));
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", relayout);
    return () => { ro.disconnect(); window.removeEventListener("scroll", on); window.removeEventListener("resize", relayout); cancelAnimationFrame(raf); };
  }, []);

  const jump = (i: number) => {
    const el = root.current; if (!el) return;
    const sheets = Array.from(el.querySelectorAll<HTMLElement>(".svs-sheet"));
    let y = el.getBoundingClientRect().top + window.scrollY;
    for (const s of sheets) { if (s.dataset["div"] === String(i)) break; y += s.offsetHeight; }
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  return (
    <div ref={root} className="svs">
      {/* hero: huge words with a picture tucked between them */}
      <section className="svs-sheet svs-hero" style={{ zIndex: 1 }}>
        <div className="svs-body">
          <h1 className="svs-hero-title" aria-label="One Partner. Every Possibility in Digital.">
            {["One Partner.", "Every"].map((w, i) => <span key={w} className="svs-line" style={{ "--i": i } as CSSProperties}><span>{w}</span></span>)}
            <span className="svs-line svs-chip" style={{ "--i": 2 } as CSSProperties}><span><img src="/services-media/stitch-card-3.jpg" alt="" /></span></span>
            {["Possibility", "in Digital."].map((w, i) => <span key={w} className="svs-line" style={{ "--i": i + 3 } as CSSProperties}><span>{w}</span></span>)}
          </h1>
        </div>
        <div className="svs-shade" />
      </section>

      {/* one sheet per division */}
      <div id="divisions" />
      {colorStackDivisions.map((d, i) => (
        <section key={d.slug} id={d.slug} data-div={i} className={`svs-sheet ${i % 2 ? "alt" : ""}`} style={{ zIndex: i + 3 }}>
          <div className="svs-body">
            <h2 className="svs-title"><span className="svs-num">{d.theme.index}</span> {d.short}</h2>
            <div className="svs-grid">
              <figure className="svs-img"><img loading="lazy" src={d.theme.heroImage} alt={d.short} /></figure>
              <div className="svs-copy">
                <p className="svs-lead">{d.intro[0]}</p>
                <ul className="svs-list">
                  {d.items.map(([name, text]) => {
                    const key = `${d.slug}:${name}`, isOpen = open === key;
                    return (
                      <li key={name} className={isOpen ? "open" : ""}>
                        <button type="button" onClick={() => setOpen(isOpen ? null : key)} aria-expanded={isOpen}>
                          <span>{name}</span><span className="svs-arrow" aria-hidden="true">→</span>
                        </button>
                        <div className="svs-more"><p>{text}</p></div>
                      </li>
                    );
                  })}
                </ul>
                <Link to="/contact" className="svs-cta svs-cta-sm group">
                  <span className="svs-cta-box">→</span>
                  <span>{d.cta}</span>
                </Link>
              </div>
            </div>
          </div>
          <div className="svs-shade" />
        </section>
      ))}

      <nav className={`svs-pill ${active >= 0 ? "on" : ""}`} aria-label="Services">
        {PILL.map((label, i) => (
          <button key={label} type="button" onClick={() => jump(i)} className={i === active ? "cur" : ""} aria-label={label} aria-current={i === active}>
            <span className="svs-pill-fill" />
            <span className="svs-pill-label">{label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
