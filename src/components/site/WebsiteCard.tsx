import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { Website } from "@/content/site";

/** Website preview card: the video plays while on screen; clicking opens the story of the project. */
export function WebsiteCard({ site, className = "" }: { site: Website; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e?.isIntersecting) el.play().catch(() => {}); else el.pause(); }, { rootMargin: "100px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} aria-label={`About ${site.title}`} className={`group block w-full max-w-[600px] text-left ${className}`}>
        <div className="overflow-hidden">
          <video ref={ref} src={site.video} poster={site.poster} muted loop playsInline preload="none" className="aspect-[3/2] w-full object-cover transition-transform duration-300 ease-brand group-hover:scale-105" />
        </div>
        <div className="grid grid-cols-[1fr_auto] items-center gap-x-3 gap-y-1 px-1 py-4 md:grid-cols-[1fr_2fr_auto] md:px-6 md:py-5">
          <span className="col-span-2 text-xs text-primary md:col-span-1">{site.category}</span><span className="font-display text-2xl">{site.title}</span><span className="text-primary">↗</span>
        </div>
      </button>
      {open && <WebsiteDialog site={site} onClose={() => setOpen(false)} />}
    </>
  );
}

function WebsiteDialog({ site, onClose }: { site: Website; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, [onClose]);

  return createPortal(
    <div data-lenis-prevent className="theme-dark-scope fixed inset-0 z-[80] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md" onClick={onClose} role="dialog" aria-modal="true" aria-label={site.title}>
      <div className="max-h-[92vh] w-full max-w-[1000px] overflow-y-auto rounded-2xl bg-background text-foreground" onClick={(e) => e.stopPropagation()}>
        <div className="relative">
          <video src={site.video} poster={site.poster} autoPlay muted loop playsInline className="aspect-video w-full rounded-t-2xl object-cover" />
          <button type="button" onClick={onClose} aria-label="Close" className="absolute right-3 top-3 rounded-full bg-black/60 px-4 py-2 font-label text-xs uppercase text-white backdrop-blur hover:bg-black/80">✕ Close</button>
        </div>
        <div className="grid gap-8 p-6 md:grid-cols-[1.1fr_1fr] md:p-10">
          <div>
            <p className="font-label text-xs uppercase text-primary">{site.category}</p>
            <h3 className="mt-2 font-display text-4xl leading-none tracking-[-0.03em] md:text-5xl">{site.title}</h3>
            <h4 className="mt-6 font-label text-xs uppercase text-muted-foreground">What it is</h4>
            <p className="mt-2 text-lg">{site.about}</p>
            <h4 className="mt-6 font-label text-xs uppercase text-muted-foreground">Why it was needed</h4>
            <p className="mt-2 text-lg">{site.brief}</p>
          </div>
          <div>
            <h4 className="font-label text-xs uppercase text-muted-foreground">What we did</h4>
            <ul className="mt-2 list-disc space-y-2 pl-5 text-lg">{site.did.map((d) => <li key={d}>{d}</li>)}</ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href={site.url} target="_blank" rel="noopener noreferrer" className="rounded-full bg-primary px-6 py-3 font-display text-[15px] font-medium text-primary-foreground transition-transform hover:scale-105">Visit website ↗</a>
              <Link to="/work" onClick={onClose} className="rounded-full border border-foreground/30 px-6 py-3 font-display text-[15px] font-medium hover:bg-foreground hover:text-background">See all our work</Link>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
