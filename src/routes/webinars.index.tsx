import { createFileRoute, Link } from "@tanstack/react-router";
import { img, webinars } from "@/content/site";
import { orangeH, PageHero, StackCards } from "@/components/site/ui";

export const Route = createFileRoute("/webinars/")({
  head: () => ({ meta: [
    { title: "Upcoming Webinars | My3 Digital" },
    { name: "description", content: "Join My3 Digital webinars on premium websites, performance marketing and automation. Register and pay online." },
    { property: "og:title", content: "Upcoming Webinars | My3 Digital" },
    { property: "og:description", content: "Practical sessions on web, marketing and technology from the My3 team." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Webinars,
});

export const priceLabel = (p: number) => (p === 0 ? "Free" : `₹${p.toLocaleString("en-IN")}`);

function Webinars() {
  return (
    <main>
      <PageHero eyebrow="My3 Webinars" title="Learn From the Team Behind the Work.">
        <p>Live, practical sessions on web development, digital marketing, branding and technology — designed to help businesses make better digital decisions.</p>
      </PageHero>
      <section className="px-6 md:px-10">
        <h2 className={`${orangeH} mb-12 text-[50px] md:text-[110px]`}>Upcoming Webinars</h2>
        <div className="grid gap-2 md:grid-cols-3">
          {webinars.map((w) => (
            <Link key={w.slug} to="/webinars/$slug" params={{ slug: w.slug }} className="group block bg-panel">
              <div className="overflow-hidden"><img src={img(w.image, 900)} alt="" loading="lazy" className="aspect-[4/3] w-full object-cover transition-transform duration-300 ease-brand group-hover:scale-105" /></div>
              <div className="p-6">
                <div className="flex justify-between font-label text-xs uppercase"><span className="text-primary">{w.date} · {w.time}</span><span>{priceLabel(w.price)}</span></div>
                <h3 className="mt-3 text-2xl leading-tight group-hover:text-primary">{w.title}</h3>
                <p className="mt-3 text-sm text-muted-foreground">{w.summary}</p>
                <p className="mt-6 font-label text-xs uppercase">View details &amp; register →</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
      <section className="px-6 py-20 md:py-40 text-center md:px-10">
        <p className="font-display text-[32px] tracking-[-0.04em] text-primary md:text-[66px]">Why attend</p>
        <div className="mt-16"><StackCards items={[{ title: "Practical, not theoretical", text: "Real examples from projects across industries." }, { title: "Live Q&A", text: "Ask the team questions about your own business." }, { title: "Session resources", text: "Slides and checklists shared after every webinar." }]} /></div>
      </section>
    </main>
  );
}
