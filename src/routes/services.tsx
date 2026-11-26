import { createFileRoute } from "@tanstack/react-router";
import Lenis from "lenis";
import { useEffect, useRef, useState } from "react";
import { ensureGsapRegistered, gsap, ScrollTrigger } from "@/components/services/gsapMotion";
import { HeroToServicesFlipSection } from "@/components/services/HeroToServicesFlipSection";
import { ServicesReel } from "@/components/services/ServicesReel";
import { ShowcaseMorphClosingSection } from "@/components/services/ShowcaseMorphClosingSection";
import { StatementStaircaseGridSection } from "@/components/services/StatementStaircaseGridSection";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Digital Services | Web Development, Branding & Marketing | My3 Digital" },
      {
        name: "description",
        content:
          "Website development, branding, performance marketing, digital marketing and technology & automation services from My3 Digital.",
      },
      { property: "og:title", content: "Digital Services | Web Development, Branding & Marketing | My3 Digital" },
      { property: "og:description", content: "One partner. Every possibility in digital." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ServicesMotionShowcase,
});

function ServicesMotionShowcase() {
  const [activeTab, setActiveTab] = useState<string>("website-development");
  const [reduceMotion, setReduceMotion] = useState(false);
  const [reelPlaying, setReelPlaying] = useState(false);

  const mainRef = useRef<HTMLElement>(null);
  const ambientRef = useRef<HTMLDivElement>(null);

  // Sync user reduced-motion OS preference safely client-side
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduceMotion(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  // Synchronize Lenis smooth scrolling + GSAP ScrollTrigger & subtle ambient radial shift
  useEffect(() => {
    if (typeof window === "undefined") return;
    ensureGsapRegistered();

    const ambientEl = ambientRef.current;
    const mainEl = mainRef.current;

    const ambientTrigger =
      ambientEl && mainEl && !reduceMotion
        ? ScrollTrigger.create({
            trigger: mainEl,
            start: "top top",
            end: "bottom bottom",
            onUpdate: (self) => {
              const p = self.progress;
              const x = p < 0.5 ? 35 + p * 60 : 65 - (p - 0.5) * 46;
              const y = 18 + p * 60;
              ambientEl.style.background = `radial-gradient(680px circle at ${x.toFixed(1)}% ${y.toFixed(1)}%, rgba(36, 86, 164, 0.075), transparent 72%)`;
            },
          })
        : null;

    if (reduceMotion || reelPlaying) {
      return () => {
        ambientTrigger?.kill();
      };
    }

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    const win = window as Window & { __my3Lenis?: Lenis };
    win.__my3Lenis = lenis;

    lenis.on("scroll", ScrollTrigger.update);
    const onTick = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      ambientTrigger?.kill();
      gsap.ticker.remove(onTick);
      delete win.__my3Lenis;
      lenis.destroy();
    };
  }, [reduceMotion, reelPlaying]);

  return (
    <main
      ref={mainRef}
      data-blur-managed="true"
      className="services-motion-page relative min-h-screen overflow-x-clip bg-black font-sans text-slate-100 selection:bg-[#2456A4]/40 selection:text-white"
    >
      {/* Scroll-harmonized deep cobalt/sapphire ambient glow */}
      <div
        ref={ambientRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-700"
        style={{
          background: "radial-gradient(680px circle at 35% 18%, rgba(36, 86, 164, 0.075), transparent 72%)",
        }}
      />

      {!reduceMotion && <ServicesReel playing={reelPlaying} setPlaying={setReelPlaying} />}

      <HeroToServicesFlipSection
        reduceMotion={reduceMotion}
        onSelectDivision={setActiveTab}
      />

      <StatementStaircaseGridSection
        reduceMotion={reduceMotion}
        activeTab={activeTab}
        onSelectDivision={setActiveTab}
      />

      <ShowcaseMorphClosingSection
        reduceMotion={reduceMotion}
        onSelectDivision={setActiveTab}
      />
    </main>
  );
}
