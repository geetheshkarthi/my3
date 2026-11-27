import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ColorStackShowcase } from "@/components/services/ColorStackShowcase";
import {
  ensureGsapRegistered,
  ScrollTrigger,
} from "@/components/services/gsapMotion";
import { SubPartsAndProcessSection } from "@/components/services/SubPartsAndProcessSection";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      {
        title:
          "Digital Services | Web Development, Branding & Marketing | My3 Digital",
      },
      {
        name: "description",
        content:
          "Website development, branding, performance marketing, digital marketing and technology & automation services from My3 Digital.",
      },
      {
        property: "og:title",
        content:
          "Digital Services | Web Development, Branding & Marketing | My3 Digital",
      },
      {
        property: "og:description",
        content: "One partner. Every possibility in digital.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  const [reduceMotion, setReduceMotion] = useState(false);

  // Sync user reduced-motion OS preference cleanly on the client
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduceMotion(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  // Recompute ScrollTrigger positions after fonts/images settle (Lenis runs globally via SmoothScroll)
  useEffect(() => {
    if (typeof window === "undefined") return;
    ensureGsapRegistered();

    const refresh = () => ScrollTrigger.refresh();
    const timer = window.setTimeout(refresh, 160);
    window.addEventListener("load", refresh);
    document.fonts?.ready?.then(refresh).catch(() => undefined);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("load", refresh);
    };
  }, []);

  return (
    <main
      data-blur-managed="true"
      className="services-motion-page relative min-h-screen overflow-x-clip bg-black font-sans text-slate-100 selection:bg-[#D2FF1F] selection:text-black"
    >
      <ColorStackShowcase reduceMotion={reduceMotion} />
      <SubPartsAndProcessSection reduceMotion={reduceMotion} />
    </main>
  );
}
