import { useEffect, useRef } from "react";
import { industries, industryImages } from "@/content/site";

const TRAVEL = 190; // px each row slides over the whole scroll (~2 inches)
const items = industries.map((name, i) => ({ name, src: industryImages[i] }));
const rows = [items, [...items.slice(4), ...items.slice(0, 4)]];

/** Two full-width rows of large rounded photos that nudge sideways only while the page scrolls. */
export function IndustryStrip() {
  const boxRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const update = () => {
      const box = boxRef.current;
      if (!box) return;
      const r = box.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = Math.min(1, Math.max(0, (vh - r.top) / (vh + r.height)));
      const x = p * TRAVEL;
      if (rowRefs.current[0]) rowRefs.current[0].style.transform = `translateX(${-40 - x}px)`;
      if (rowRefs.current[1]) rowRefs.current[1].style.transform = `translateX(${-300 + x}px)`;
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => { window.removeEventListener("scroll", update); window.removeEventListener("resize", update); };
  }, []);

  return (
    <div ref={boxRef} className="mt-16 flex flex-col gap-8 overflow-hidden">
      {rows.map((row, r) => (
        <div key={r} ref={(el) => { rowRefs.current[r] = el; }} className="flex w-max gap-8 will-change-transform">
          {[...row, ...row].map((g, i) => (
            <div key={i} className="h-[200px] w-[300px] shrink-0 overflow-hidden rounded-[22px] md:h-[312px] md:w-[422px]">
              <img src={g.src} alt={g.name} loading="lazy" className="h-full w-full object-cover" />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
