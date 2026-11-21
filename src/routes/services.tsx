import { createFileRoute } from "@tanstack/react-router";
import { divisions } from "@/content/site";
import { BoxButton, orangeH, PageHero, PillButton, sec } from "@/components/site/ui";

export const Route = createFileRoute("/services")({
  head: () => ({ meta: [
    { title: "Digital Services | Web Development, Branding & Marketing | My3" },
    { name: "description", content: "Website development, branding, performance marketing, digital marketing and technology & automation services from My3 Digital." },
    { property: "og:title", content: "Digital Services | Web Development, Branding & Marketing | My3" },
    { property: "og:description", content: "One partner. Every possibility in digital." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Services,
});

function Services() {
  return (
    <main>
      <PageHero eyebrow="Our Expertise" title="One Partner. Every Possibility in Digital.">
        <p>From building your digital foundation to establishing your brand and accelerating its growth, we bring together the expertise, technology and creative thinking your business needs to move forward.</p>
        <p>Our services are designed to work independently or together, creating a connected digital ecosystem around your business.</p>
        <div className="pt-4"><PillButton to="/contact">Discuss Your Requirements</PillButton></div>
      </PageHero>

      {divisions.map((d, n) => (
        <section key={d.slug} id={d.slug} className={`${sec} border-t border-border`}>
          <p className="font-label text-xs uppercase text-muted-foreground">Division 0{n + 1} · {d.eyebrow}</p>
          <h2 className={`${orangeH} mt-4 text-[44px] md:text-[90px]`}>{d.title}</h2>
          <p className="mt-6 max-w-[1100px] text-[22px] leading-tight md:text-[34px]">{d.heading}</p>
          <div className="mt-8 grid gap-6 md:grid-cols-2">{d.intro.map((p) => <p key={p}>{p}</p>)}</div>
          <div className="mt-12 grid gap-2 md:grid-cols-2">
            {d.items.map(([t, x]) => (
              <article key={t} className="flex min-h-[220px] flex-col justify-between bg-panel p-6">
                <h3 className="max-w-[340px] text-[24px] leading-tight tracking-[-0.02em]">{t}</h3>
                <p className="ml-auto max-w-[340px] text-sm">{x}</p>
              </article>
            ))}
          </div>
          {d.extra && <p className="mt-8 font-display text-sm text-muted-foreground">Technology &amp; Platforms: {d.extra}</p>}
          <div className="mt-10"><BoxButton to="/contact">{d.cta}</BoxButton></div>
        </section>
      ))}

      <section className="px-6 py-40 text-center md:px-10">
        <p className="font-display text-[32px] tracking-[-0.04em] text-primary md:text-[66px]">Better Together.</p>
        <h2 className="mt-6 text-[50px] leading-[0.95] md:text-[110px]">Stronger by Design.</h2>
        <p className="mx-auto mt-8 max-w-[760px]">A brand identity can establish the foundation for a website. A well-developed website can support performance marketing. Strategic advertising can generate enquiries, while automation can help manage them efficiently. At My3 Digital, we look at the entire journey.</p>
      </section>

      <section className="px-6 pb-40 text-center md:px-10">
        <h2 className="mx-auto max-w-[1100px] text-[36px] leading-tight md:text-[60px]">Have a Vision? Let's Build the Right Strategy Around It.</h2>
        <p className="mx-auto mt-6 max-w-[640px]">Tell us what you're looking to achieve. Our team will help identify the right approach, capabilities and execution plan for your business.</p>
        <div className="mt-10"><PillButton to="/contact">Discuss Your Project</PillButton></div>
      </section>
    </main>
  );
}
