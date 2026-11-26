import { Link } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import type { Website } from "@/content/site";

/** Website preview card: the video plays while on screen; clicking opens the project's case-study page. */
export function WebsiteCard({ site, className = "" }: { site: Website; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e?.isIntersecting) el.play().catch(() => {}); else el.pause(); }, { rootMargin: "100px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Link to="/work/$slug" params={{ slug: site.slug }} aria-label={`${site.title} case study`} className={`group block w-full max-w-[600px] ${className}`}>
      <div className="overflow-hidden">
        <video ref={ref} src={site.video} poster={site.poster} muted loop playsInline preload="none" className="aspect-[3/2] w-full object-cover transition-transform duration-300 ease-brand group-hover:scale-105" />
      </div>
      <div className="grid grid-cols-[1fr_auto] items-center gap-x-3 gap-y-1 px-1 py-4 md:grid-cols-[1fr_2fr_auto] md:px-6 md:py-5">
        <span className="col-span-2 text-xs text-primary md:col-span-1">{site.category}</span><span className="font-display text-2xl">{site.title}</span><span className="text-primary">↗</span>
      </div>
    </Link>
  );
}
