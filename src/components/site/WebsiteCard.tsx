import { Link } from "@tanstack/react-router";
import { useEffect, useRef } from "react";

/** Website preview card: the video plays only while it is on screen. */
export function WebsiteCard({ title, category, video, poster, className = "" }: { title: string; category: string; video: string; poster: string; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e?.isIntersecting) el.play().catch(() => {}); else el.pause(); }, { rootMargin: "100px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <Link to="/work" className={`group block w-full max-w-[600px] ${className}`}>
      <div className="overflow-hidden">
        <video ref={ref} src={video} poster={poster} muted loop playsInline preload="none" className="aspect-[3/2] w-full object-cover transition-transform duration-300 ease-brand group-hover:scale-105" />
      </div>
      <div className="grid grid-cols-[1fr_2fr_auto] items-center px-6 py-5">
        <span className="text-xs text-primary">{category}</span><span className="font-display text-2xl">{title}</span><span className="text-primary">↗</span>
      </div>
    </Link>
  );
}
