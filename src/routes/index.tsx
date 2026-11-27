import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { IndustryStrip } from "@/components/site/IndustryStrip";
import { CapabilityReel } from "@/components/site/CapabilityReel";
import { WebsiteCard } from "@/components/site/WebsiteCard";
import { HeroCanvas } from "@/components/site/HeroCanvas";
import { approach, articles, capabilities, hero, img, industries, industryImages, pillars, process, stats, websites } from "@/content/site";
import { BlurHeading, BoxButton, orangeH, PillButton, tilts } from "@/components/site/ui";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "My3 Digital | Premium Web Development & Digital Marketing Agency" },
      { name: "description", content: "My3 Digital is a digital agency specialising in premium website development, e-commerce, branding, performance marketing, SEO and intelligent automation. Build your digital future with us." },
      { property: "og:title", content: "My3 Digital — Digital Excellence. Engineered for Growth." },
      { property: "og:description", content: "Premium websites, distinctive brands and intelligent growth strategies for ambitious businesses." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});


// Cards rise from the bottom in a repeating middle -> left -> right order
const portPos = ["mx-auto", "mx-auto md:mx-0 md:mr-auto", "mx-auto md:mx-0 md:ml-auto"];

function Index() {
  const heroRef = useRef<HTMLElement>(null);
  const restRef = useRef<HTMLDivElement>(null);
  // Content after the hero slides up over the video, translucent at first and fully opaque once the scrub completes.
  useEffect(() => {
    const update = () => {
      const hero = heroRef.current, rest = restRef.current;
      if (!hero || !rest) return;
      const p = Math.min(1, Math.max(0, -hero.getBoundingClientRect().top / Math.max(1, hero.offsetHeight - window.innerHeight)));
      rest.style.backgroundColor = `color-mix(in oklab, var(--background) ${Math.round(Math.min(1, Math.max(0, (p - 0.55) / 0.45)) * 100)}%, transparent)`;
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => { window.removeEventListener("scroll", update); window.removeEventListener("resize", update); };
  }, []);
  return (
    <main>
      {/* Hero */}
      <section ref={heroRef} className="theme-dark-scope relative h-[220svh]">
        <div className="sticky top-0 h-[100svh] min-h-[640px] overflow-hidden px-6 md:px-10">
          <HeroCanvas sectionRef={heroRef} />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/50 via-black/10 to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-background to-transparent" />
        </div>
          <div className="absolute inset-x-6 top-0 z-10 flex h-[100svh] min-h-[640px] flex-col justify-end pb-10 md:inset-x-10">
            <p style={{ animationDelay: "0.1s" }} className="hero-rise font-label text-xs uppercase tracking-widest text-primary md:text-sm">{hero.eyebrow}</p>
            <h1 style={{ animationDelay: "0.25s" }} className="hero-rise mt-4 text-[9.4vw] font-normal leading-[0.95] tracking-[-0.04em] md:text-[5.5vw]"><span className="whitespace-nowrap">Digital Excellence.</span><br />Engineered for Growth.</h1>
          </div>
      </section>

      <div ref={restRef} className="relative z-20 -mt-[100svh] pt-1" style={{ backgroundColor: "transparent" }}>
      {/* Numbers */}
      <section className="mx-6 mt-16 grid gap-2 border border-border p-2 md:mx-10 md:grid-cols-5">
        {stats.map(([l, v, s, span]) => (
          <div key={l} className={`bg-panel/60 p-6 backdrop-blur-sm ${span}`}>
            <p className="border-b border-border pb-3 text-sm">{l}</p>
            <div className="mt-4 font-display text-[64px] font-normal leading-none tracking-[-0.04em] text-strong md:text-[100px]">{v}<span className="text-primary">{s}</span></div>
          </div>
        ))}
      </section>

      {/* Who we are */}
      <section className="px-6 pt-20 md:pt-40 md:px-10">
        <h2 className={`${orangeH} text-[50px] md:text-[100px]`}>Who We Are…</h2>
        <p className="max-w-[1360px] text-[24px] leading-tight md:text-[40px]">Beyond Digital Presence. Into Digital Possibility. At My3 Digital, we combine strategy, design, technology and marketing to build digital ecosystems that work for your business.</p>
        <div className="mt-6"><BoxButton to="/about">Discover My3 Digital</BoxButton></div>
      </section>

      <section className="px-6 py-20 md:py-40 text-center md:px-10">
        <h2 className="mx-auto max-w-[1000px] font-sans text-[40px] font-medium leading-[1.05] tracking-[-0.03em] md:text-[80px]">Everything Your Business Needs to Grow Digitally.</h2>
        <p className="mx-auto mt-6 max-w-[640px]">We bring together the disciplines that shape how modern businesses are discovered, experienced and remembered.</p>
      </section>

      {/* Capabilities */}
      <CapabilityReel />

      {/* Work */}
      <section id="work" className="px-6 pt-[25vh] md:pt-[40vh] md:px-10">
        <BlurHeading>Our Work</BlurHeading>
        <div className="relative z-10 mt-[20vh] md:mt-[35vh] flex flex-col gap-16 md:gap-32">
          {websites.slice(0, 6).map((w, i) => <WebsiteCard key={w.title} site={w} className={portPos[i % portPos.length] ?? ""} />)}
        </div>
        <div className="mt-12 md:mt-24 text-center"><Link to="/work" className="inline-flex items-center gap-3 rounded-full bg-panel py-2 pl-2 pr-6 font-mono text-xs uppercase leading-tight ring-1 ring-border"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">+</span>Explore our<br />portfolio</Link></div>
      </section>

      {/* Approach: heading pins, cards rise from the bottom and pile up */}
      <section className="px-6 text-center md:px-10">
        <div>
        <div className="sticky top-16 z-0 flex flex-col items-center pt-8">
          <p className="font-display text-[32px] tracking-[-0.04em] text-primary md:text-[66px]">The My3 Approach</p>
          <h2 className="mt-6 text-[50px] leading-[0.95] md:text-[120px]">We Think Beyond Deliverables.</h2>
          <p className="mx-auto mt-8 max-w-[720px]">A website is more than a design. A campaign is more than an advertisement. And a brand is more than a logo.</p>
        </div>
        <div className="relative z-10 mt-[30vh] md:mt-[45vh] flex flex-col items-center gap-[30vh] md:gap-[45vh] pb-[10vh]">
          {approach.map(([t, d], i) => (
            <blockquote key={t} style={{ top: `calc(54vh + ${i * 14}px)` }} className={`sticky w-full max-w-[700px] border-2 border-foreground bg-background px-10 py-8 ${tilts[i]}`}>
              <p className="font-display text-[28px] font-medium leading-[1.05] tracking-[-0.04em] md:text-[48px]">“{t}”</p>
              <p className="mt-4">{d}</p>
            </blockquote>
          ))}
        </div>
        </div>
        <div className="relative z-10 pb-20 md:pb-40"><PillButton to="/contact">Start a Conversation</PillButton></div>
      </section>

      {/* Industries + gallery */}
      <section className="text-center">
        <span className="inline-flex items-center gap-2 rounded-md bg-secondary px-3 py-1.5 text-xs text-secondary-foreground">◎ Industries</span>
        <h2 className="mx-auto mt-6 max-w-[1300px] px-6 font-display text-[34px] leading-tight tracking-[-0.02em] text-primary md:text-[64px]">Different Industries. Distinct Digital Needs.</h2>
        <p className="mx-auto mt-5 max-w-[760px] px-6 text-base md:text-xl">We work with businesses across industries, understanding that every market has its own audience, challenges and opportunities.</p>
        <p className="mx-auto mt-5 max-w-[1100px] px-6 font-display text-base text-muted-foreground md:text-lg">{industries.join(" · ")}</p>
        <IndustryStrip />
        <div className="mt-10"><PillButton to="/work">View Our Work</PillButton></div>
      </section>

      {/* Process */}
      <section className="grid gap-12 px-6 py-20 md:py-40 md:grid-cols-[1fr_33vw] md:px-10">
        <div className="md:sticky md:top-24 md:self-start">
          <p className="font-display text-2xl">How We Work</p>
          <h2 className={`${orangeH} text-[60px] md:text-[120px]`}>A Thoughtful Process.</h2>
          <p className="mt-6 font-display text-2xl">Exceptional Execution.</p>
        </div>
        <div>
          {process.map(([t, d], i) => (
            <div key={t} className="border-b border-border py-6">
              <div className="flex items-center gap-3"><span className="text-xs">0{i + 1}</span><span className="flex-1 font-display text-2xl">{t}</span></div>
              <p className="mt-2 pl-7 text-sm text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-6 text-center md:px-10">
        <h2 className={`${orangeH} mx-auto max-w-[1300px] text-[40px] md:text-[66px]`}>Built on Trust. Strengthened by Partnerships.</h2>
        <p className="mx-auto mt-6 max-w-[640px]">Great work is not just about what we create. It is also about the relationships we build along the way.</p>
        <div className="mt-8"><PillButton to="/contact">Discuss Your Project</PillButton></div>
      </section>

      {/* Pillars */}
      <section className="px-6 py-20 md:py-40 md:px-10">
        <h2 className={`${orangeH} mb-16 text-[60px] md:ml-[5%] md:text-[120px]`}>Why My3<br />Digital?</h2>
        <div className="grid gap-2 md:grid-cols-2">
          {pillars.map(([t, s, d]) => (
            <article key={t} className="flex min-h-[120px] md:min-h-[200px] md:min-h-[340px] flex-col justify-between bg-panel p-6">
              <div><h3 className="max-w-[300px] text-[26px] leading-tight tracking-[-0.02em]">{t}</h3><p className="mt-2 font-label text-xs uppercase text-primary">{s}</p></div>
              <p className="ml-auto max-w-[300px] text-sm">{d}</p>
            </article>
          ))}
        </div>
        <div className="mt-16 text-center"><PillButton to="/services">Explore Our Services</PillButton></div>
      </section>

      {/* Insights */}
      <section id="blogs" className="px-6 md:px-10">
        <p className="font-display text-lg">The thinking behind the work — perspectives on digital, design &amp; growth.</p>
        <h2 className={`${orangeH} text-right text-[60px] md:text-[120px]`}>My3 Insights</h2>
        <div className="mt-12 grid gap-2 md:grid-cols-3">
          {articles.slice(0, 3).map((a) => (
            <Link key={a.slug} to="/insights/$slug" params={{ slug: a.slug }} className="group flex h-full flex-col">
              <img src={img(a.image, 736)} alt="" loading="lazy" className="h-[300px] w-full object-cover" />
              <h3 className="mt-2 flex flex-1 items-center justify-center bg-panel p-4 text-center font-display text-sm font-normal tracking-normal transition-colors duration-300 ease-brand group-hover:text-primary">{a.title}</h3>
            </Link>
          ))}
        </div>
        <div className="mt-8 text-right"><BoxButton to="/insights">Explore all insights</BoxButton></div>
      </section>

      {/* Final CTA */}
      <section className="px-6 text-center md:px-10">
        <h2 className="mx-auto max-w-[1100px] text-[36px] leading-tight md:text-[60px]">Your Next Big Move Starts Here. Let's create something that moves your business forward.</h2>
        <div className="mt-10 flex justify-center gap-4"><BoxButton to="/contact">Start a Conversation</BoxButton><BoxButton to="/contact">Discuss Your Project</BoxButton></div>
      </section>

      </div>
    </main>
  );
}
