import { Link, useRouterState, type LinkProps } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { academyUrl, contact, nav } from "@/content/site";
import { policies } from "@/content/policies";

const logo = { url: "/logo-mark.png" };

export const orangeH = "font-display font-normal leading-none tracking-[-0.04em] text-primary";
export const sec = "px-6 py-40 md:px-10";
export const tilts = ["-rotate-3", "rotate-0", "rotate-2", "-rotate-2", "rotate-0", "rotate-3", "-rotate-1", "rotate-1"];

const pillCls = "group inline-flex items-center gap-3 rounded-full bg-secondary py-1.5 pl-1.5 pr-5 font-display text-[15px] font-medium text-secondary-foreground transition-transform duration-300 ease-brand hover:scale-105";
const pillDot = <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">→</span>;
export function PillButton({ to, href, children }: { to?: LinkProps["to"]; href?: string; children: ReactNode }) {
  if (to) return <Link to={to} className={pillCls}>{pillDot}{children}</Link>;
  return <a href={href} className={pillCls}>{pillDot}{children}</a>;
}
const boxCls = "inline-flex items-stretch border border-foreground font-label text-xs uppercase transition-colors duration-300 ease-brand hover:bg-foreground hover:text-background";
export function BoxButton({ to, href, children }: { to?: LinkProps["to"]; href?: string; children: ReactNode }) {
  const inner = <><span className="px-4 py-3">{children}</span><span className="flex items-center border-l border-current px-3">→</span></>;
  return to ? <Link to={to} className={boxCls}>{inner}</Link> : <a href={href} className={boxCls}>{inner}</a>;
}

/** Tilted outlined cards that stack on top of each other while scrolling. */
export function StackCards({ items, top = 30 }: { items: { title: string; text?: string }[]; top?: number }) {
  return (
    <div className="flex flex-col items-center gap-[40vh] pb-[20vh]">
      {items.map((it, i) => (
        <div key={it.title} style={{ top: `calc(${top}vh + ${i * 10}px)` }} className={`sticky w-full max-w-[700px] border-2 border-foreground bg-background px-10 py-10 text-center ${tilts[i % tilts.length]}`}>
          <h3 className="text-[36px] font-medium leading-[1] md:text-[64px]">{it.title}</h3>
          {it.text && <p className="mx-auto mt-5 max-w-[520px] text-base">{it.text}</p>}
        </div>
      ))}
    </div>
  );
}

/** Heading that stays centred and blurs as content scrolls over it. */
export function BlurHeading({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [blur, setBlur] = useState(0);
  const [rise, setRise] = useState(1);
  useEffect(() => {
    const on = () => {
      const el = ref.current?.parentElement; if (!el) return;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const pad = parseFloat(getComputedStyle(el).paddingTop) || 0;
      setBlur(Math.min(1, Math.max(0, -(r.top + pad) / (vh * 0.6))) * 12);
      const top = ref.current!.getBoundingClientRect().top;
      setRise(Math.min(1, Math.max(0, (top - vh * 0.35) / (vh * 0.5))));
    };
    on(); window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <div ref={ref} data-blur-managed className="pointer-events-none sticky top-[35vh] z-0 h-[40vh]">
      <h2 style={{ filter: `blur(${blur}px)`, opacity: (1 - blur / 30) * (1 - rise), transform: `translateY(${rise * 14}vh)` }} className={`${orangeH} text-center text-[60px] transition-[filter] duration-100 md:text-[160px]`}>{children}</h2>
    </div>
  );
}

export function PageHero({ title, children }: { eyebrow?: string; title: ReactNode; children?: ReactNode }) {
  return (
    <section className="px-6 pb-24 pt-44 md:px-10">
      <h1 className="max-w-[1300px] text-[12vw] font-normal leading-[0.95] tracking-[-0.04em] md:text-[7vw]">{title}</h1>
      {children && <div className="mt-10 max-w-[760px] space-y-4 text-lg">{children}</div>}
    </section>
  );
}

/** Switches between the default dark theme and a light (white) theme; the choice is remembered. */
export function ThemeToggle({ className = "" }: { className?: string }) {
  const [light, setLight] = useState(false);
  useEffect(() => { setLight(document.documentElement.getAttribute("data-theme") === "light"); }, []);
  const toggle = () => {
    const next = !light;
    setLight(next);
    if (next) document.documentElement.setAttribute("data-theme", "light"); else document.documentElement.removeAttribute("data-theme");
    try { localStorage.setItem("my3-theme", next ? "light" : "dark"); } catch { /* ignore */ }
  };
  return (
    <button type="button" onClick={toggle} aria-label={light ? "Switch to dark theme" : "Switch to white theme"} title={light ? "Dark theme" : "White theme"} className={`flex h-10 w-10 items-center justify-center rounded-full border border-foreground/30 text-lg transition-colors hover:bg-foreground hover:text-background ${className}`}>
      {light ? "☾" : "☀"}
    </button>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (st) => st.location.pathname });
  const [overHero, setOverHero] = useState(false);
  useEffect(() => {
    const on = () => setOverHero(pathname === "/" && window.scrollY < window.innerHeight * 1.1);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, [pathname]);
  return (
    <>
      {/* Over the dark spaceship hero the header stays dark, so the light theme never paints a white band across it */}
      <header className={`${overHero ? "theme-dark-scope" : ""} fixed inset-x-0 top-0 z-50 flex items-center justify-between bg-gradient-to-b from-background to-transparent px-6 py-5 md:px-10`}>
        <Link to="/" aria-label="My3 Digital home"><img src={logo.url} alt="My3 Digital" className="h-11 w-auto md:h-14" /></Link>
        <nav className="hidden items-center gap-7 font-display text-[15px] font-medium lg:flex">
          {nav.map((n) => (
            <Link key={n.to} to={n.to} activeOptions={{ exact: n.to === "/" }} activeProps={{ className: "text-primary" }} className="transition-colors duration-300 ease-brand hover:text-primary">{n.label}</Link>
          ))}
          <a href={academyUrl} target="_blank" rel="noopener noreferrer" className="rounded-full bg-primary px-5 py-2.5 text-primary-foreground transition-transform duration-300 ease-brand hover:scale-105">Academy</a>
          <ThemeToggle />
        </nav>
        <button onClick={() => setOpen(true)} aria-label="Open menu" className="flex w-10 flex-col gap-2 lg:hidden"><span className="h-px w-full bg-strong" /><span className="h-px w-full bg-strong" /></button>
      </header>
      {open && (
        <div className="fixed inset-0 z-[60] flex flex-col bg-background px-6 py-6">
          <div className="flex items-center justify-between">
            <img src={logo.url} alt="My3 Digital" className="h-10 w-auto" />
            <button onClick={() => setOpen(false)} aria-label="Close menu" className="font-display text-3xl">×</button>
          </div>
          <nav className="mt-16 flex flex-col gap-5">
            {nav.map((n) => <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="font-display text-5xl tracking-[-0.04em] hover:text-primary">{n.label}</Link>)}
            <a href={academyUrl} target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)} className="font-display text-5xl tracking-[-0.04em] text-primary">Academy ↗</a>
            <ThemeToggle className="mt-4" />
          </nav>
        </div>
      )}
    </>
  );
}

export function Footer() {
  return (
    <footer className="bg-panel pb-6 pt-20">
      <div className="grid gap-10 px-6 md:grid-cols-5 md:px-10">
        <div className="md:col-span-2">
          <img src="/logo.png" alt="My3 Digital" className="h-12 w-auto" />
          <p className="mt-4 font-display text-2xl tracking-[-0.02em]">Digital Excellence. Engineered for Growth.</p>
          <p className="mt-3 max-w-md text-sm text-muted-foreground">A multidisciplinary digital agency building exceptional websites, distinctive brands and intelligent growth solutions for ambitious businesses.</p>
        </div>
        <div>
          <p className="font-label text-xs uppercase text-muted-foreground">Explore</p>
          <ul className="mt-4 space-y-2 font-display text-sm">{nav.map((n) => <li key={n.to}><Link to={n.to} className="hover:text-primary">{n.label}</Link></li>)}</ul>
        </div>
        <div>
          <p className="font-label text-xs uppercase text-muted-foreground">Policies</p>
          <ul className="mt-4 space-y-2 font-display text-sm">{policies.map((p) => <li key={p.slug}><Link to="/policies/$slug" params={{ slug: p.slug }} className="hover:text-primary">{p.short}</Link></li>)}</ul>
        </div>
        <div>
          <p className="font-label text-xs uppercase text-muted-foreground">Get in Touch</p>
          <ul className="mt-4 space-y-2 font-display text-sm">
            <li><a href={`mailto:${contact.email}`} className="hover:text-primary">{contact.email}</a></li>
            <li><a href={contact.phoneHref} className="hover:text-primary">{contact.phone}</a></li>
            <li>Hyderabad · Bangalore · India</li>
          </ul>
        </div>
      </div>
      <div className="mt-16 overflow-hidden">
        <div className="marquee flex w-max whitespace-nowrap font-display text-[160px] font-medium leading-none tracking-[-0.04em] md:text-[260px]">
          {Array.from({ length: 4 }).map((_, i) => <span key={i} className="pr-10">MY3 DIGITAL</span>)}
        </div>
      </div>
      <p className="mt-6 px-6 font-label text-xs uppercase text-muted-foreground md:px-10">© 2026 My3 Digital. All Rights Reserved.</p>
    </footer>
  );
}

/** Site-wide scroll motion: section headings blur in from below and blur out as they leave the top. */
export function ScrollFX() {
  useEffect(() => {
    let raf = 0;
    const run = () => {
      raf = 0;
      const vh = window.innerHeight;
      document.querySelectorAll<HTMLElement>("main h2:not([data-noblur]), main h1").forEach((el) => {
        if (el.closest("[data-blur-managed]")) return;
        const r = el.getBoundingClientRect();
        const enter = Math.max(0, (r.top - vh * 0.75) / (vh * 0.25)); // 0 once 75% up the screen
        const leave = Math.max(0, (vh * 0.15 - r.bottom) / (vh * 0.3));
        const b = Math.min(1, Math.max(enter, leave)) * 14;
        el.style.filter = b > 0.2 ? `blur(${b.toFixed(1)}px)` : "";
        el.style.opacity = String(1 - b / 28);
      });
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(run); };
    run();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    const t = setInterval(run, 800); // catch route changes / late content
    return () => { window.removeEventListener("scroll", on); window.removeEventListener("resize", on); clearInterval(t); cancelAnimationFrame(raf); };
  }, []);
  return null;
}
