import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { contact } from "@/content/site";
import { orangeH, PageHero, sec } from "@/components/site/ui";

export const Route = createFileRoute("/contact")({
  head: () => ({ meta: [
    { title: "Contact My3 Digital | Start Your Digital Project" },
    { name: "description", content: "Tell us about your website, branding, marketing or technology project. My3 Digital — Hyderabad & Bangalore." },
    { property: "og:title", content: "Contact My3 Digital | Start Your Digital Project" },
    { property: "og:description", content: "Have something in mind? Let's make it happen." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Contact,
});

const services = ["Website Development", "E-commerce Development", "Branding & Creative", "Digital Marketing", "Performance Marketing", "SEO", "Personal Branding", "Technology & Automation", "Multiple Services", "Other"];
const budgets = ["Below ₹50,000", "₹50,000 – ₹1,00,000", "₹1,00,000 – ₹2,00,000", "₹2,00,000 – ₹5,00,000", "₹5,00,000+", "Open to discussion"];
const field = "w-full border border-foreground/60 bg-background px-4 py-3 text-sm outline-none focus:border-primary";

function Contact() {
  const [sent, setSent] = useState(false);
  return (
    <main>
      <PageHero eyebrow="Let's Connect" title="Have Something in Mind? Let's Make It Happen." />

      <section id="enquiry" className={sec}>
        <h2 className={`${orangeH} text-[44px] md:text-[90px]`}>Tell Us What You're Looking to Build.</h2>
        <p className="mt-6 max-w-[640px]">We'd like to understand your requirements so we can connect you with the right team.</p>
        {sent ? (
          <p className="mt-12 bg-panel p-8 font-display text-2xl">Thank you — your email app has opened with your enquiry. Send it and our team will be in touch.</p>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const d = new FormData(e.currentTarget);
              const body = ["name", "email", "phone", "company", "service", "budget", "message"].map((k) => `${k}: ${d.get(k) ?? ""}`).join("\n");
              window.location.href = `mailto:${contact.email}?subject=${encodeURIComponent("Project Enquiry — " + d.get("name"))}&body=${encodeURIComponent(body)}`;
              setSent(true);
            }}
            className="mt-12 grid max-w-[900px] gap-4 md:grid-cols-2"
          >
            <input name="name" required placeholder="Full Name *" className={field} />
            <input name="email" type="email" required placeholder="Business Email *" className={field} />
            <input name="phone" required placeholder="Phone Number *" className={field} />
            <input name="company" placeholder="Company / Brand Name" className={field} />
            <select name="service" required defaultValue="" className={field}><option value="" disabled>What are you looking for? *</option>{services.map((s) => <option key={s}>{s}</option>)}</select>
            <select name="budget" defaultValue="" className={field}><option value="" disabled>Estimated Project Budget</option>{budgets.map((s) => <option key={s}>{s}</option>)}</select>
            <textarea name="message" rows={5} placeholder="Tell Us About Your Project" className={`${field} md:col-span-2`} />
            <button className="w-fit border border-foreground px-6 py-3 font-label text-xs uppercase hover:bg-foreground hover:text-background">Send enquiry →</button>
          </form>
        )}
      </section>

      <section className="grid gap-2 px-6 pb-20 md:grid-cols-4 md:px-10 md:pb-40">
        {[["Email", contact.email, `mailto:${contact.email}`], ["Phone", contact.phone, contact.phoneHref], ["Hyderabad", contact.hyderabad, ""], ["Bangalore", contact.bangalore, ""]].map(([t, v, h]) => (
          <div key={t} className="flex min-h-[120px] md:min-h-[200px] flex-col justify-between bg-panel p-6">
            <p className="font-label text-xs uppercase text-primary">{t}</p>
            {h ? <a href={h} className="font-display text-xl hover:text-primary">{v}</a> : <p className="font-display text-xl">{v}</p>}
          </div>
        ))}
      </section>

      <section className="grid gap-12 px-6 pb-20 md:pb-40 md:grid-cols-2 md:px-10">
        <div><p className="font-display text-2xl">What happens next?</p><h2 className={`${orangeH} text-[50px] md:text-[100px]`}>A Simple Start to Something Great.</h2></div>
        <div className="md:ml-auto md:w-[500px]">
          {[["We Receive Your Enquiry", "Share your requirements through our project enquiry form."], ["We Understand Your Requirements", "Our team reviews your brief and connects with you to understand your objectives."], ["We Discuss the Right Approach", "We identify the scope, possibilities, timelines and suitable solutions for your project."], ["We Move Forward", "Once everything is aligned, we take the next steps towards bringing your project to life."]].map(([t, d], i) => (
            <div key={t} className="border-b border-border py-6"><div className="flex items-center gap-3"><span className="text-xs">0{i + 1}</span><span className="font-display text-2xl">{t}</span></div><p className="mt-2 pl-7 text-sm text-muted-foreground">{d}</p></div>
          ))}
        </div>
      </section>

      <section className="px-6 pb-20 md:pb-40 text-center md:px-10">
        <h2 className="mx-auto max-w-[1100px] text-[36px] leading-tight md:text-[60px]">Let's Create Something Worth Remembering.</h2>
        <p className="mt-4">The right digital partner can make all the difference. Let's start with a conversation.</p>
      </section>
    </main>
  );
}
