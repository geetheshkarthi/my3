import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { policies } from "@/content/policies";
import { PageHero } from "@/components/site/ui";

export const Route = createFileRoute("/policies/$slug")({
  loader: ({ params }) => {
    const policy = policies.find((p) => p.slug === params.slug);
    if (!policy) throw notFound();
    return { policy };
  },
  head: ({ loaderData }) => {
    const p = loaderData?.policy;
    const t = p ? `${p.title} | My3 Digital` : "Policy | My3 Digital";
    return { meta: [{ title: t }, { name: "description", content: p?.summary ?? "" }, { property: "og:title", content: t }, { property: "og:description", content: p?.summary ?? "" }] };
  },
  component: PolicyPage,
});

/** Renders a block: bullet list when every line starts with "• ", otherwise a paragraph that keeps line breaks. */
function Block({ text }: { text: string }) {
  const lines = text.split("\n");
  if (lines.every((l) => l.startsWith("• "))) {
    return <ul className="list-disc space-y-1.5 pl-6">{lines.map((l) => <li key={l}>{l.slice(2)}</li>)}</ul>;
  }
  return <p className="whitespace-pre-line">{text}</p>;
}

function PolicyPage() {
  const { policy: p } = Route.useLoaderData();
  const [intro = "", ...sections] = p.content.split(/^## /m).map((s: string) => s.trim());
  const others = policies.filter((x) => x.slug !== p.slug);
  return (
    <main>
      <PageHero eyebrow="Legal" title={p.title}>
        <p>Effective Date: {p.effective}</p>
      </PageHero>
      <section className="px-6 pb-20 md:pb-32 md:px-10">
        <div className="mx-auto max-w-[820px] space-y-10 text-lg text-muted-foreground">
          <div className="space-y-4">{intro.split(/\n\n+/).map((b: string, i: number) => <Block key={i} text={b} />)}</div>
          {sections.map((sec: string) => {
            const i = sec.indexOf("\n");
            const heading = sec.slice(0, i).trim();
            const body = sec.slice(i + 1).trim();
            return (
              <section key={heading}>
                <h2 className="text-[26px] leading-tight text-foreground md:text-[34px]">{heading}</h2>
                <div className="mt-4 space-y-4">{body.split(/\n\n+/).map((b, k) => <Block key={k} text={b} />)}</div>
              </section>
            );
          })}
        </div>
        <div className="mx-auto mt-20 max-w-[820px] border-t border-border pt-8">
          <p className="font-label text-xs uppercase text-muted-foreground">Other policies</p>
          <ul className="mt-4 flex flex-wrap gap-x-8 gap-y-2 font-display text-lg">
            {others.map((o) => <li key={o.slug}><Link to="/policies/$slug" params={{ slug: o.slug }} className="hover:text-primary">{o.short}</Link></li>)}
          </ul>
        </div>
      </section>
    </main>
  );
}
