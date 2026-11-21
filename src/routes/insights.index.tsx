import { createFileRoute, Link } from "@tanstack/react-router";
import { articles, img } from "@/content/site";
import { BoxButton, orangeH, PageHero } from "@/components/site/ui";

export const Route = createFileRoute("/insights/")({
  head: () => ({ meta: [
    { title: "My3 Insights | Web Design, Technology & Digital Marketing" },
    { name: "description", content: "Insights on digital experiences, emerging technologies, brand building and marketing strategies from My3 Digital." },
    { property: "og:title", content: "My3 Insights" },
    { property: "og:description", content: "Ideas that inform. Perspectives that move businesses forward." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Insights,
});

function Insights() {
  const [featured, ...rest] = articles;
  if (!featured) return null;
  return (
    <main>
      <PageHero eyebrow="My3 Insights" title="Ideas That Inform. Perspectives That Move Businesses Forward.">
        <p>Explore insights on digital experiences, emerging technologies, brand building and marketing strategies. We share practical knowledge to help businesses make better digital decisions.</p>
      </PageHero>
      <section className="px-6 md:px-10">
        <Link to="/insights/$slug" params={{ slug: featured.slug }} className="group grid items-center gap-10 bg-panel p-6 md:grid-cols-2 md:p-10">
          <img src={img(featured.image, 1000)} alt="" className="aspect-[4/3] w-full object-cover" />
          <div>
            <p className="font-label text-xs uppercase text-primary">Featured Insight · {featured.category}</p>
            <h2 className="mt-4 text-[32px] leading-tight md:text-[48px] group-hover:text-primary">{featured.title}</h2>
            <p className="mt-4 text-muted-foreground">{featured.excerpt}</p>
            <p className="mt-6 font-label text-xs uppercase">Read the article →</p>
          </div>
        </Link>
      </section>
      <section className="px-6 py-40 md:px-10">
        <h2 className={`${orangeH} text-right text-[50px] md:text-[110px]`}>Explore Our Latest Thinking.</h2>
        <div className="mt-12 grid gap-2 md:grid-cols-3">
          {rest.map((a) => (
            <Link key={a.slug} to="/insights/$slug" params={{ slug: a.slug }} className="group block">
              <img src={img(a.image, 736)} alt="" loading="lazy" className="h-[300px] w-full object-cover" />
              <div className="mt-2 bg-panel p-4">
                <p className="font-label text-xs uppercase text-primary">{a.category}</p>
                <h3 className="mt-2 font-display text-lg font-normal tracking-normal transition-colors duration-300 ease-brand group-hover:text-primary">{a.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{a.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
      <section className="px-6 pb-40 text-center md:px-10">
        <h2 className="text-[36px] leading-tight md:text-[60px]">Stay Ahead of What's Next.</h2>
        <p className="mx-auto mt-4 max-w-[560px]">Thoughtful insights on technology, design and digital growth, delivered straight to your inbox.</p>
        <form onSubmit={(e) => { e.preventDefault(); const f = e.currentTarget; const em = new FormData(f).get("email"); window.location.href = `mailto:info@my3digital.com?subject=Subscribe to My3 Insights&body=Please subscribe ${em}`; }} className="mx-auto mt-8 flex max-w-[520px] gap-2">
          <input name="email" type="email" required placeholder="Your email address" className="flex-1 border border-foreground bg-background px-4 py-3 text-sm outline-none focus:border-primary" />
          <button className="border border-foreground px-4 font-label text-xs uppercase hover:bg-foreground hover:text-background">Subscribe to Insights</button>
        </form>
        <p className="mt-3 text-xs text-muted-foreground">We respect your inbox. Only relevant insights and occasional updates.</p>
        <div className="mt-10"><BoxButton to="/contact">Start a project</BoxButton></div>
      </section>
    </main>
  );
}
