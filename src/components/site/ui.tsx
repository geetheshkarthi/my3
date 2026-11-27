import { Link, useRouterState, type LinkProps } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { academyUrl, contact, nav } from "@/content/site";
import { policies } from "@/content/policies";

const logo = { url: "/logo-mark.png" };

export const orangeH = "font-display font-normal leading-none tracking-[-0.04em] text-primary";
export const sec = "px-6 py-20 md:py-40 md:px-10";
export const tilts = ["-rotate-3", "rotate-0", "rotate-2", "-rotate-2", "rotate-0", "rotate-3", "-rotate-1", "rotate-1"];

// Pill button: the blue dot spreads across the whole pill and the arrow slides to the right on hover / focus / press
const pillCls = "group relative inline-flex items-center overflow-hidden rounded-full bg-secondary py-1.5 pl-[3.25rem] pr-[3.25rem] font-display text-[15px] font-medium text-secondary-foreground transition-transform duration-300 ease-brand hover:scale-[1.03] active:scale-[0.98]";
function PillInner({ children }: { children: ReactNode }) {
  return (
    <>
      <span aria-hidden className="absolute bottom-1.5 left-1.5 top-1.5 w-8 rounded-full bg-primary transition-[width] duration-500 ease-brand group-hover:w-[calc(100%-0.75rem)] group-focus-visible:w-[calc(100%-0.75rem)] group-active:w-[calc(100%-0.75rem)]" />
      <span aria-hidden className="absolute bottom-1.5 left-1.5 top-1.5 flex w-8 items-center justify-center text-primary-foreground transition-[left] duration-500 ease-brand group-hover:left-[calc(100%-2.375rem)] group-focus-visible:left-[calc(100%-2.375rem)] group-active:left-[calc(100%-2.375rem)]">→</span>
      <span className="relative z-10 transition-colors duration-500 group-hover:text-primary-foreground group-focus-visible:text-primary-foreground group-active:text-primary-foreground">{children}</span>
    </>
  );
}
export function PillButton({ to, href, children }: { to?: LinkProps["to"]; href?: string; children: ReactNode }) {
  if (to) return <Link to={to} className={pillCls}><PillInner>{children}</PillInner></Link>;
  return <a href={href} className={pillCls}><PillInner>{children}</PillInner></a>;
}
const boxCls = "inline-flex items-stretch border border-foreground font-label text-xs uppercase transition-colors duration-300 ease-brand hover:bg-foreground hover:text-background";
export function BoxButton({ to, href, children }: { to?: LinkProps["to"]; href?: string; children: ReactNode }) {
  const inner = <><span className="px-4 py-3">{children}</span><span className="flex items-center border-l border-current px-3">→</span></>;
  return to ? <Link to={to} className={boxCls}>{inner}</Link> : <a href={href} className={boxCls}>{inner}</a>;
}

/** Tilted outlined cards that stack on top of each other while scrolling. */
export function StackCards({ items, top = 30 }: { items: { title: string; text?: string }[]; top?: number }) {
  return (
    <div className="flex flex-col items-center gap-[22vh] md:gap-[40vh] pb-[10vh] md:pb-[20vh]">
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
    <section className="px-6 pb-12 md:pb-24 pt-32 md:pt-44 md:px-10">
      <h1 className="max-w-[1300px] text-[12vw] font-normal leading-[0.95] tracking-[-0.04em] md:text-[7vw]">{title}</h1>
      {children && <div className="mt-10 max-w-[760px] space-y-4 text-lg">{children}</div>}
    </section>
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
      <header className={`${overHero ? "theme-dark-scope" : ""} fixed inset-x-0 top-0 z-50 flex items-center justify-between bg-gradient-to-b from-background to-transparent px-6 pb-5 pt-[max(1.25rem,env(safe-area-inset-top))] md:px-10`}>
        <Link to="/" aria-label="My3 Digital home"><img src={logo.url} alt="My3 Digital" className="h-11 w-auto md:h-14" /></Link>
        <nav className="hidden items-center gap-7 font-display text-[15px] font-medium lg:flex">
          {nav.map((n) => (
            <Link key={n.to} to={n.to} activeOptions={{ exact: n.to === "/" }} activeProps={{ className: "text-primary" }} className="transition-colors duration-300 ease-brand hover:text-primary">{n.label}</Link>
          ))}
          <a href={academyUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-stretch border border-foreground font-label text-xs uppercase transition-colors duration-300 ease-brand hover:border-[#d2042d] hover:bg-[#d2042d] hover:text-white"><span className="px-4 py-3">Academy</span><span className="flex items-center border-l border-current px-3">→</span></a>
        </nav>
        <button onClick={() => setOpen(true)} aria-label="Open menu" className="-my-3 flex w-11 flex-col gap-2 py-3 lg:hidden"><span className="h-px w-full bg-strong" /><span className="h-px w-full bg-strong" /></button>
      </header>
      {open && (
        <div data-lenis-prevent className="fixed inset-0 z-[60] flex flex-col overflow-y-auto bg-background px-6 py-6">
          <div className="flex items-center justify-between">
            <img src={logo.url} alt="My3 Digital" className="h-10 w-auto" />
            <button onClick={() => setOpen(false)} aria-label="Close menu" className="font-display text-3xl">×</button>
          </div>
          <nav className="mt-16 flex flex-col gap-5">
            {nav.map((n) => <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="font-display text-5xl tracking-[-0.04em] hover:text-primary">{n.label}</Link>)}
            <a href={academyUrl} target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)} className="font-display text-5xl tracking-[-0.04em] text-primary">Academy ↗</a>
          </nav>
        </div>
      )}
    </>
  );
}

export function Footer() {
  return (
    <footer className="bg-panel pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-20">
      <div className="grid grid-cols-2 gap-x-6 gap-y-10 px-6 md:grid-cols-5 md:gap-10 md:px-10">
        <div className="col-span-2">
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
        <div className="col-span-2 md:col-span-1">
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
