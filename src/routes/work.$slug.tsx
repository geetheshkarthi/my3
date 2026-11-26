import { createFileRoute, notFound } from "@tanstack/react-router";
import { img, projects } from "@/content/site";
import { BoxButton, orangeH, PageHero, PillButton } from "@/components/site/ui";

export const Route = createFileRoute("/work/$slug")({
  loader: ({ params }) => {
    const project = projects.find((p) => p.slug === params.slug);
    if (!project) throw notFound();
    return { project };
  },
  head: ({ loaderData }) => {
    const p = loaderData?.project;
    const t = p ? `${p.name} — ${p.category} | My3 Digital` : "Project | My3 Digital";
    return { meta: [
      { title: t }, { name: "description", content: p?.summary ?? "A My3 Digital project." },
      { property: "og:title", content: t }, { property: "og:description", content: p?.summary ?? "" },
      { property: "og:type", content: "article" }, { name: "twitter:card", content: "summary_large_image" },
      ...(p ? [{ property: "og:image", content: img(p.image) }, { name: "twitter:image", content: img(p.image) }] : []),
    ] };
  },
  component: ProjectPage,
});

function ProjectPage() {
  const { project: p } = Route.useLoaderData();
  return (
    <main>
      <PageHero eyebrow={p.category} title={p.name}><p>{p.summary}</p></PageHero>
      <section className="px-6 md:px-10"><img src={img(p.image, 1800)} alt={p.name} className="w-full object-cover" /></section>
      <section className="grid gap-12 px-6 py-20 md:py-40 md:grid-cols-2 md:px-10">
        <h2 className={`${orangeH} text-[50px] md:text-[100px]`}>Scope</h2>
        <ul className="md:ml-auto md:w-[500px]">{p.scope.map((s, i) => <li key={s} className="flex gap-3 border-b border-border py-4 font-display text-xl"><span className="text-xs">0{i + 1}</span>{s}</li>)}</ul>
      </section>
      <section className="px-6 pb-20 md:pb-40 text-center md:px-10">
        <div className="flex justify-center gap-4"><PillButton to="/contact">Start a Project</PillButton><BoxButton to="/work">All projects</BoxButton></div>
      </section>
    </main>
  );
}
