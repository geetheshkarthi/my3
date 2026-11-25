import { createFileRoute } from "@tanstack/react-router";
import { values } from "@/content/site";
import { orangeH, PageHero, PillButton, sec, StackCards } from "@/components/site/ui";

export const Route = createFileRoute("/about")({
  head: () => ({ meta: [
    { title: "About My3 Digital | Our Story, Team & Approach" },
    { name: "description", content: "The story, philosophy, mission, vision and values behind My3 Digital — a multidisciplinary digital agency in Hyderabad and Bangalore." },
    { property: "og:title", content: "About My3 Digital | Our Story, Team & Approach" },
    { property: "og:description", content: "We believe better digital experiences build better businesses." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: About,
});

function About() {
  return (
    <main>
      <PageHero eyebrow="About My3 Digital" title="We Believe Better Digital Experiences Build Better Businesses." />

      <section className="px-6 text-center md:px-10">
        <p className="font-display text-[32px] tracking-[-0.04em] text-primary md:text-[66px]">What Drives Us</p>
        <h2 className="mx-auto mt-6 max-w-[1200px] text-[40px] leading-[0.95] md:text-[90px]">Creativity Gives It Direction. Technology Gives It Possibility. Strategy Gives It Purpose.</h2>
        <p className="mx-auto mt-8 max-w-[720px]">A beautiful website without functionality is incomplete. Marketing without a clear strategy is inefficient. And a brand without a distinct identity struggles to stand apart. That's why we approach every engagement with a broader perspective.</p>
      </section>

      <section className="grid gap-2 px-6 py-40 md:grid-cols-2 md:px-10">
        {[["Our Mission", "To empower businesses with exceptional digital experiences, meaningful brand identities and intelligent growth solutions that create lasting value."], ["Our Vision", "To become a trusted global digital partner recognised for creative excellence, technological innovation and the ability to turn ambitious ideas into meaningful outcomes."]].map(([t, d]) => (
          <article key={t} className="flex min-h-[340px] flex-col justify-between bg-panel p-6">
            <h3 className="text-[40px] leading-tight tracking-[-0.02em] text-primary">{t}</h3>
            <p className="ml-auto max-w-[420px] text-lg">{d}</p>
          </article>
        ))}
      </section>

      <section className="px-6 text-center md:px-10">
        <p className="font-label text-xs uppercase text-muted-foreground">What We Stand For</p>
        <h2 className={`${orangeH} mb-16 mt-4 text-[50px] md:text-[110px]`}>Our Values</h2>
        <StackCards items={values.map(([t, d]) => ({ title: t, text: d }))} />
      </section>

      <section className="grid gap-12 px-6 pb-40 md:grid-cols-2 md:px-10">
        <div>
          <p className="font-display text-2xl">Our Expertise</p>
          <h2 className={`${orangeH} text-[50px] md:text-[100px]`}>Different Minds. One Shared Direction.</h2>
        </div>
        <ul className="md:ml-auto md:w-[500px]">
          {["Strategic thinkers who understand business objectives.", "Designers who transform ideas into distinctive visual experiences.", "Developers who build functional, scalable digital solutions.", "Marketing professionals who understand audiences, platforms and performance.", "Creative professionals who bring brands to life through content and communication."].map((t, i) => (
            <li key={t} className="flex gap-3 border-b border-border py-4 font-display text-xl"><span className="text-xs">0{i + 1}</span>{t}</li>
          ))}
        </ul>
      </section>

      <section className="px-6 pb-40 text-center md:px-10">
        <h2 className="mx-auto max-w-[1100px] text-[36px] leading-tight md:text-[60px]">We Are Just Getting Started. Let's build what's next.</h2>
        <div className="mt-10"><PillButton to="/contact">Work With Us</PillButton></div>
      </section>
    </main>
  );
}
