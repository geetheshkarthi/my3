import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { articles, divisions, img } from "@/content/site";
import { BoxButton, PillButton } from "@/components/site/ui";

export const Route = createFileRoute("/insights/$slug")({
  loader: ({ params }) => {
    const article = articles.find((a) => a.slug === params.slug);
    if (!article) throw notFound();
    return { article };
  },
  head: ({ loaderData }) => {
    const a = loaderData?.article;
    const t = a ? `${a.title} | My3 Insights` : "Insight | My3 Digital";
    return { meta: [
      { title: t }, { name: "description", content: a?.excerpt ?? "" },
      { property: "og:title", content: t }, { property: "og:description", content: a?.excerpt ?? "" },
      { property: "og:type", content: "article" }, { name: "twitter:card", content: "summary_large_image" },
      ...(a ? [{ property: "og:image", content: img(a.image) }, { name: "twitter:image", content: img(a.image) }] : []),
    ] };
  },
  component: ArticlePage,
});

function ArticlePage() {
  const { article: a } = Route.useLoaderData();
  const service = divisions.find((d) => d.slug === a.service);
  const related = articles.filter((x) => x.slug !== a.slug && x.category === a.category).concat(articles.filter((x) => x.slug !== a.slug)).slice(0, 3);
  return (
    <main>
      <article className="px-6 pb-24 pt-44 md:px-10">
        <p className="font-label text-xs uppercase text-primary">{a.category}</p>
        <h1 className="mt-6 max-w-[1200px] text-[10vw] font-normal leading-[0.95] tracking-[-0.04em] md:text-[5.5vw]">{a.title}</h1>
        <p className="mt-6 font-label text-xs uppercase text-muted-foreground">My3 Digital Team · {a.date} · {a.read}</p>
        <img src={img(a.image, 1600)} alt="" className="mt-12 max-h-[620px] w-full object-cover" />
        <div className="mx-auto mt-16 max-w-[760px] space-y-12">
          {a.body.map(([h, p]) => (
            <section key={h}>
              <h2 className="text-[30px] leading-tight md:text-[40px]">{h}</h2>
              <div className="mt-4 space-y-4 text-lg text-muted-foreground">
                {p.split(/\n\n+/).map((blk, i) => {
                  const lines = blk.split("\n");
                  return lines.every((l) => l.startsWith("• "))
                    ? <ul key={i} className="list-disc space-y-1 pl-6">{lines.map((l) => <li key={l}>{l.slice(2)}</li>)}</ul>
                    : <p key={i}>{blk}</p>;
                })}
              </div>
            </section>
          ))}
          {service && (
            <div className="bg-panel p-6">
              <p className="font-label text-xs uppercase text-primary">Related My3 service</p>
              <p className="mt-2 font-display text-2xl">{service.title}</p>
              <div className="mt-4"><BoxButton to="/services">{a.cta}</BoxButton></div>
            </div>
          )}
        </div>
      </article>
      <section className="px-6 pb-24 md:px-10">
        <h2 className="text-[36px] md:text-[56px]">Related Articles</h2>
        <div className="mt-8 grid gap-2 md:grid-cols-3">
          {related.map((r) => (
            <Link key={r.slug} to="/insights/$slug" params={{ slug: r.slug }} className="group bg-panel p-4">
              <p className="font-label text-xs uppercase text-primary">{r.category}</p>
              <h3 className="mt-2 font-display text-lg font-normal tracking-normal group-hover:text-primary">{r.title}</h3>
            </Link>
          ))}
        </div>
      </section>
      <section className="px-6 pb-40 text-center md:px-10">
        <h2 className="mx-auto max-w-[1000px] text-[36px] leading-tight md:text-[56px]">Have a project in mind? Let's make it happen.</h2>
        <div className="mt-8"><PillButton to="/contact">Start a Project</PillButton></div>
      </section>
    </main>
  );
}
