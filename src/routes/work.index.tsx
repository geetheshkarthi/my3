import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { websites } from "@/content/site";

export const Route = createFileRoute("/work/")({
  head: () => ({ meta: [
    { title: "Our Work | Selected Projects | My3 Digital" },
    { name: "description", content: "Selected website, e-commerce, branding, digital marketing and interactive projects by My3 Digital." },
    { property: "og:title", content: "Our Work | My3 Digital" },
    { property: "og:description", content: "Ideas brought to life. Businesses moved forward." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Work,
});

const titleCase = (s: string) => s.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());

/** Text split into words (like Splitting.js), so each word can carry its own outline / fill effects. */
function Words({ text }: { text: string }) {
  const parts = text.split(" ");
  return <>{parts.map((w, i) => <span key={i}><span className="word" data-word={w}>{w}</span>{i < parts.length - 1 ? " " : ""}</span>)}</>;
}

function Work() {
  const root = useRef<HTMLDivElement>(null);
  const cursor = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [active, setActive] = useState(false);
  const [cursorOn, setCursorOn] = useState(false);
  const [overSite, setOverSite] = useState(false);
  const [current, setCurrent] = useState<number | null>(null);

  // start the entrance animations
  useEffect(() => { const t = requestAnimationFrame(() => setLoaded(true)); return () => cancelAnimationFrame(t); }, []);

  // scroll progress: page (title) and each panel (start: top at screen bottom, end: bottom at 25% of the screen)
  useEffect(() => {
    const el = root.current; if (!el) return;
    const panels = Array.from(el.querySelectorAll<HTMLElement>(".panel"));
    let raf = 0;
    const update = () => {
      raf = 0;
      const vh = window.innerHeight;
      const r = el.getBoundingClientRect();
      const page = -r.top / (r.height / 2);                 // 0 at the top of the page
      el.style.setProperty("--progress", String(Math.min(1, Math.max(0, page))));
      for (const p of panels) {
        const b = p.getBoundingClientRect();
        const prog = (vh - b.top) / (vh - vh * 0.25 + b.height);
        p.style.setProperty("--progress", String(Math.min(1, Math.max(0, prog))));
      }
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => { window.removeEventListener("scroll", on); window.removeEventListener("resize", on); cancelAnimationFrame(raf); };
  }, []);

  // trailing circle cursor (mouse only): replaces the normal arrow everywhere on this page
  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const html = document.documentElement;
    html.classList.add("wk-nocursor");
    const show = () => setCursorOn(true);
    const hide = (e: MouseEvent) => { if (!e.relatedTarget) setCursorOn(false); };
    window.addEventListener("mousemove", show);
    document.addEventListener("mouseout", hide);
    return () => { html.classList.remove("wk-nocursor"); window.removeEventListener("mousemove", show); document.removeEventListener("mouseout", hide); };
  }, []);
  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const c = cursor.current; if (!c) return;
    const pos = { x: innerWidth / 2, y: innerHeight / 2 }, mouse = { ...pos };
    const move = (e: MouseEvent) => { mouse.x = e.clientX; mouse.y = e.clientY; };
    let raf = 0;
    const loop = () => {
      pos.x += (mouse.x - pos.x) * 0.35; pos.y += (mouse.y - pos.y) * 0.35;
      c.style.transform = `translate(${pos.x}px, ${pos.y}px) translate(-50%, -50%)`;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("mousemove", move); raf = requestAnimationFrame(loop);
    return () => { window.removeEventListener("mousemove", move); cancelAnimationFrame(raf); };
  }, []);

  // Esc closes the open project; the page underneath doesn't scroll while it is open
  useEffect(() => {
    const key = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    window.addEventListener("keydown", key);
    document.documentElement.style.overflow = active ? "hidden" : "";
    return () => { window.removeEventListener("keydown", key); document.documentElement.style.overflow = ""; };
  }, [active]);

  const open = (i: number) => { setCurrent(i); setActive(true); setOverSite(false); };
  const close = () => { setActive(false); setTimeout(() => setCurrent((c) => (document.querySelector(".wk.active") ? c : null)), 2000); };
  const site = current != null ? websites[current] : null;

  return (
    <div ref={root} className={`wk ${loaded ? "loaded" : ""} ${active ? "active" : ""}`}>
      <div className="wk-wrap">
        <h1><Words text="Our Work" /></h1>
        <p className="subhead">My3 Digital</p>
        {websites.map((w, i) => (
          <div key={w.slug} className={`panel ${i % 2 ? "even" : ""}`} data-n={i + 1} style={{ "--progress": 0 } as CSSProperties}>
            <h2><Words text={titleCase(w.title)} /></h2>
            <div className="thumb">
              <p>{w.category.replace(/ & /g, " • ")}</p>
              <div
                className="inner"
                role="button"
                tabIndex={0}
                aria-label={`Open ${titleCase(w.title)}`}
                onClick={() => open(i)}
                onKeyDown={(e) => { if (e.key === "Enter") open(i); }}
                onMouseEnter={() => setOverSite(true)}
                onMouseMove={() => setOverSite(true)}
                onMouseLeave={() => setOverSite(false)}
              >
                <img loading="lazy" src={w.poster} alt={`${titleCase(w.title)} website`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* the opened project slides in from the right */}
      <div className="wk-frame" data-lenis-prevent aria-hidden={!active}>
        <button type="button" className="wk-back inline-flex items-stretch border border-foreground bg-background font-label text-xs uppercase text-foreground transition-colors duration-300 ease-brand hover:border-primary hover:bg-primary hover:text-primary-foreground" onClick={close}><span className="flex items-center border-r border-current px-3">←</span><span className="px-4 py-3">Go back</span></button>
        <div className="frame-wrap">
          <div className="frame-container">
            {site && <video key={site.video} src={site.video} poster={site.poster} autoPlay muted loop playsInline />}
            {site && (
              <Link className="penlink" to="/work/$slug" params={{ slug: site.slug }}>
                <strong>{titleCase(site.title)} — view the case study <span>&rarr;</span></strong>
              </Link>
            )}
          </div>
        </div>
      </div>

      <div ref={cursor} className={`wk-cursor ${cursorOn ? "on" : ""} ${overSite && !active ? "active" : ""}`}><span className="view">VIEW</span></div>

    </div>
  );
}
