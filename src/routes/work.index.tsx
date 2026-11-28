import { createFileRoute } from "@tanstack/react-router";
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
  // the open project shows its image first; the arrow button slides to its video
  const [showVideo, setShowVideo] = useState(false);
  const detailVideo = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = detailVideo.current; if (!v) return;
    if (showVideo) { v.currentTime = 0; v.play().catch(() => {}); } else v.pause();
  }, [showVideo]);
  const [current, setCurrent] = useState<number | null>(null);
  const [intro, setIntro] = useState(true);

  // the 3D ribbon plays first; when it finishes, it is swapped for this page, which then loads in as usual
  useEffect(() => {
    const on = (e: MessageEvent) => {
      if (e.origin !== window.location.origin || (e.data as { type?: string } | null)?.type !== "my3-ribbon-done") return;
      window.scrollTo(0, 0);
      setIntro(false);
      // swallow the rest of that scroll gesture so the page opens at the top, as on a normal load
      const hold = (ev: Event) => { ev.preventDefault(); ev.stopPropagation(); };
      const opts = { capture: true, passive: false } as const;
      window.addEventListener("wheel", hold, opts);
      window.addEventListener("touchmove", hold, opts);
      setTimeout(() => {
        window.removeEventListener("wheel", hold, opts);
        window.removeEventListener("touchmove", hold, opts);
        window.scrollTo(0, 0);
      }, 1400);
    };
    window.addEventListener("message", on);
    return () => window.removeEventListener("message", on);
  }, []);

  // start the entrance animations (once the ribbon is done)
  useEffect(() => {
    if (intro) return;
    const t = requestAnimationFrame(() => setLoaded(true));
    return () => cancelAnimationFrame(t);
  }, [intro]);

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
  }, [intro]);

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

  const open = (i: number) => { setCurrent(i); setShowVideo(false); setActive(true); setOverSite(false); };
  const close = () => { setActive(false); setTimeout(() => setCurrent((c) => (document.querySelector(".wk.active") ? c : null)), 2000); };
  const site = current != null ? websites[current] : null;

  return (
    <>
    {/* the 3D video ribbon plays first, on its own; when it ends, the projects page loads in its place */}
    {intro && (
      <section className="wk-intro" onMouseEnter={() => setCursorOn(false)}>
        <iframe src="/work-showcase/index.html?intro" title="My3 Digital — selected websites" allow="autoplay; fullscreen" />
      </section>
    )}
    <div ref={root} className={`wk ${loaded ? "loaded" : ""} ${active ? "active" : ""}`} hidden={intro}>
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
                <div className="slides">
                  <img loading="lazy" src={w.image} alt={`${titleCase(w.title)} website`} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* the opened project slides in from the right */}
      <div className="wk-frame" data-lenis-prevent aria-hidden={!active}>
        <button type="button" className="wk-back inline-flex items-stretch border border-foreground bg-background font-label text-xs uppercase text-foreground transition-colors duration-300 ease-brand hover:border-primary hover:bg-primary hover:text-primary-foreground" onClick={close}><span className="flex items-center border-r border-current px-3">←</span><span className="px-4 py-3">Go back</span></button>
        <div className="wk-detail" data-lenis-prevent>
          {site && (
            <div className="wk-detail-in" key={site.slug}>
              <div className="wk-detail-head">
                <h2 className="wk-detail-title">{site.title}</h2>
                <a href={site.url} target="_blank" rel="noopener noreferrer" className="wk-visit inline-flex items-stretch border border-foreground font-label text-xs uppercase text-foreground transition-colors duration-300 ease-brand hover:bg-foreground hover:text-background">
                <span className="px-4 py-3">Visit website</span><span className="flex items-center border-l border-current px-3">↗</span>
              </a>
              </div>
              <div className="wk-media">
                <div className="wk-video">
                  <div className={`slides ${showVideo ? "on" : ""}`}>
                    <img src={site.image} alt={`${titleCase(site.title)} website`} />
                    <video ref={detailVideo} src={site.video} muted loop playsInline preload="metadata" aria-hidden={!showVideo} />
                  </div>
                </div>
                <button
                  type="button"
                  className="wk-next flex h-12 w-12 shrink-0 items-center justify-center border border-foreground bg-background text-lg text-foreground transition-colors duration-300 ease-brand hover:bg-foreground hover:text-background"
                  onClick={() => setShowVideo((v) => !v)}
                  aria-label={showVideo ? "Show the website image" : "Play the website video"}
                >
                  {showVideo ? "←" : "→"}
                </button>
              </div>
              <div className="wk-facts">
                {([["Project Overview", site.overview], ["Design Approach", site.design], ["Technologies Used", site.tech], ["Project Outcome", site.outcome]] as const).map(([label, text]) => (
                  <div key={label} className="wk-fact">
                    <h3>{label}</h3>
                    <p>{text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div ref={cursor} className={`wk-cursor ${cursorOn ? "on" : ""} ${overSite && !active ? "active" : ""}`}><span className="view">VIEW</span></div>

    </div>
    </>
  );
}
