import { createFileRoute, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { img, webinars } from "@/content/site";
import { BoxButton, orangeH } from "@/components/site/ui";

export const Route = createFileRoute("/webinars/$slug")({
  loader: ({ params }) => {
    const webinar = webinars.find((w) => w.slug === params.slug);
    if (!webinar) throw notFound();
    return { webinar };
  },
  head: ({ loaderData }) => {
    const w = loaderData?.webinar;
    const t = w ? `${w.title} | My3 Webinars` : "Webinar | My3 Digital";
    return { meta: [
      { title: t }, { name: "description", content: w?.summary ?? "" },
      { property: "og:title", content: t }, { property: "og:description", content: w?.summary ?? "" },
      { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
      ...(w ? [{ property: "og:image", content: img(w.image) }, { name: "twitter:image", content: img(w.image) }] : []),
    ] };
  },
  component: WebinarPage,
});

const field = "w-full border border-foreground/60 bg-background px-4 py-3 text-sm outline-none focus:border-primary";
const price = (p: number) => (p === 0 ? "Free" : `₹${p.toLocaleString("en-IN")}`);

function WebinarPage() {
  const { webinar: w } = Route.useLoaderData();
  const [done, setDone] = useState(false);
  return (
    <main>
      <section className="grid gap-10 px-6 pb-24 pt-44 md:grid-cols-2 md:px-10">
        <div>
          <p className="font-label text-xs uppercase text-primary">● Webinar · {w.date} · {w.time}</p>
          <h1 className="mt-6 text-[10vw] font-normal leading-[0.95] tracking-[-0.04em] md:text-[4.5vw]">{w.title}</h1>
          <p className="mt-8 text-lg">{w.summary}</p>
          <dl className="mt-8 grid grid-cols-2 gap-2">
            {[["Date", w.date], ["Time", w.time], ["Duration", w.duration], ["Fee", price(w.price)], ["Host", w.host], ["Format", "Live online"]].map(([k, v]) => (
              <div key={k} className="bg-panel p-4"><dt className="font-label text-xs uppercase text-muted-foreground">{k}</dt><dd className="mt-1 font-display text-lg">{v}</dd></div>
            ))}
          </dl>
        </div>
        <img src={img(w.image, 1200)} alt="" className="aspect-[4/5] w-full object-cover" />
      </section>

      <section className="grid gap-12 px-6 py-24 md:grid-cols-2 md:px-10">
        <div><p className="font-display text-2xl">What you'll learn</p><h2 className={`${orangeH} text-[50px] md:text-[90px]`}>Agenda</h2><p className="mt-6 text-muted-foreground">Who it's for: {w.audience}</p></div>
        <ul className="md:ml-auto md:w-[500px]">{w.agenda.map((a, i) => <li key={a} className="flex gap-3 border-b border-border py-4 font-display text-xl"><span className="text-xs">0{i + 1}</span>{a}</li>)}</ul>
      </section>

      <section id="register" className="px-6 pb-40 md:px-10">
        <div className="mx-auto max-w-[760px] border-2 border-foreground p-8 md:p-12">
          <h2 className="text-[36px] leading-tight md:text-[56px]">Register for this webinar</h2>
          <p className="mt-2 font-display text-xl text-primary">{price(w.price)}</p>
          {done ? (
            <p className="mt-8 bg-panel p-6 font-display text-xl">Thank you — your registration has been received. We'll email your joining link{w.price ? " and payment details" : ""}.</p>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); setDone(true); }} className="mt-8 grid gap-4">
              <input name="name" required placeholder="Full Name *" className={field} />
              <input name="email" type="email" required placeholder="Email *" className={field} />
              <input name="phone" required placeholder="Phone Number *" className={field} />
              <input name="company" placeholder="Company / Brand Name" className={field} />
              <button className="w-fit border border-foreground px-6 py-3 font-label text-xs uppercase hover:bg-foreground hover:text-background">{w.price ? `Register & pay ${price(w.price)} →` : "Register free →"}</button>
            </form>
          )}
        </div>
        <div className="mt-10 text-center"><BoxButton to="/webinars">All webinars</BoxButton></div>
      </section>
    </main>
  );
}
