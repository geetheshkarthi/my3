import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { websites } from "@/content/site";

export const Route = createFileRoute("/work/$slug")({
  loader: ({ params }) => {
    const index = websites.findIndex((w) => w.slug === params.slug);
    if (index < 0) throw notFound();
    return { index };
  },
  head: ({ loaderData }) => {
    const w = loaderData ? websites[loaderData.index] : undefined;
    const t = w ? `${titleCase(w.title)} — ${w.category} | My3 Digital` : "Project | My3 Digital";
    return { meta: [
      { title: t }, { name: "description", content: w?.about ?? "A website by My3 Digital." },
      { property: "og:title", content: t }, { property: "og:description", content: w?.about ?? "" },
      { property: "og:type", content: "article" },
    ] };
  },
  component: WorkCaseStudy,
});

function titleCase(s: string) {
  return s.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}

/** Expandable row: label on the left, + / − button on the right. */
function Section({ title, open, onToggle, children }: { title: string; open: boolean; onToggle: () => void; children: ReactNode }) {
  return (
    <div className="border-b border-border">
      <button type="button" onClick={onToggle} aria-expanded={open} className="flex w-full items-center justify-between gap-4 py-5 text-left">
        <span className="font-display text-lg uppercase tracking-[0.02em]">{title}</span>
        <span aria-hidden className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-background text-xl transition-transform duration-300 ${open ? "rotate-45" : ""}`}>+</span>
      </button>
      <div className={`grid transition-[grid-template-rows] duration-500 ease-brand ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
        <div className="overflow-hidden">
          <div className="pb-6 text-base text-muted-foreground md:text-[17px]">{children}</div>
        </div>
      </div>
    </div>
  );
}

function WorkCaseStudy() {
  const { index } = Route.useLoaderData();
  const w = websites[index]!;
  const [open, setOpen] = useState<string>("Introduction");
  const toggle = (k: string) => setOpen((o) => (o === k ? "" : k));

  return (
    <main className="lg:grid lg:h-[100svh] lg:grid-cols-[minmax(380px,30%)_1fr]">
      {/* Left: name, story, visit link */}
      <aside className="flex flex-col bg-panel px-6 pb-10 pt-28 [scrollbar-width:none] md:px-10 lg:overflow-y-auto lg:pt-32 [&::-webkit-scrollbar]:hidden" data-lenis-prevent>
        <Link to="/work" className="font-label text-xs uppercase text-muted-foreground hover:text-primary">← All work</Link>
        <h1 className="mt-6 font-display text-[44px] font-normal leading-[0.95] tracking-[-0.03em] md:text-[56px]">{titleCase(w.title)}</h1>
        <p className="mt-3 font-label text-xs uppercase text-primary">{w.category}</p>

        <div className="mt-10">
          <Section title="Introduction" open={open === "Introduction"} onToggle={() => toggle("Introduction")}>
            <p>{w.about}</p>
          </Section>
          <Section title="Challenge" open={open === "Challenge"} onToggle={() => toggle("Challenge")}>
            <p>{w.brief}</p>
          </Section>
          <Section title="Solution" open={open === "Solution"} onToggle={() => toggle("Solution")}>
            <ul className="list-disc space-y-2 pl-5">{w.did.map((d) => <li key={d}>{d}</li>)}</ul>
          </Section>
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-3 lg:mt-auto lg:pt-10">
          <a href={w.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-primary px-6 py-3 font-display text-[15px] font-medium text-primary-foreground transition-transform hover:scale-105">
            Visit website ↗
          </a>
        </div>
      </aside>

      {/* Right: the site video in a tilted tablet frame */}
      <section className="theme-dark-scope relative flex min-h-[70svh] items-center justify-center overflow-hidden bg-background lg:min-h-0">
        <div aria-hidden className="absolute -right-[10%] top-[-20%] h-[70%] w-[55%] rotate-[28deg] bg-primary/90" />
        <div aria-hidden className="absolute bottom-[-25%] left-[18%] h-[60%] w-[40%] -rotate-[32deg] bg-primary/80" />
        <div className="relative w-[88%] max-w-[1100px] -rotate-[8deg] rounded-[28px] bg-[#111] p-[1.4%] shadow-[0_40px_120px_-30px_rgba(0,0,0,0.9)] ring-1 ring-white/15 md:rounded-[40px]">
          <video key={w.video} src={w.video} poster={w.poster} autoPlay muted loop playsInline className="aspect-[16/10] w-full rounded-[20px] object-cover md:rounded-[30px]" />
        </div>
      </section>
    </main>
  );
}
