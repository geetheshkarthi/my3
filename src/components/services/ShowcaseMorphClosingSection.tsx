import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Bot,
  Briefcase,
  Code2,
  Compass,
  FolderOpen,
  Globe,
  Layers,
  Palette,
  PenTool,
  Rocket,
  Sparkles,
  Target,
  TrendingUp,
  Workflow,
  Zap,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { approach, contact, pillars, process } from "@/content/site";
import { ensureGsapRegistered, gsap, scrollToSectionId } from "./gsapMotion";
import { pillarOfferings, serviceCatalogCards } from "./servicesData";

type ShowcaseMorphClosingSectionProps = {
  reduceMotion: boolean;
  onSelectDivision: (slug: string) => void;
};

// 7 Stepped Dock Icons matching F0744 (center highlighted brand anchor)
const DOCK_CAPABILITIES = [
  { id: "svc-custom", label: "Custom Web", Icon: Code2 },
  { id: "svc-uiux", label: "UI/UX", Icon: Layers },
  { id: "svc-brand", label: "Branding", Icon: Palette },
  { id: "svc-web", label: "Core Web", Icon: Sparkles, primary: true },
  { id: "svc-ads", label: "Paid Ads", Icon: Target },
  { id: "svc-seo", label: "SEO", Icon: TrendingUp },
  { id: "svc-crm", label: "AI & CRM", Icon: Bot },
];

// 9 White Circular Line-Icon Tokens dropping & settling inside Cobalt Marquee (matching F0900–F0948)
const MARQUEE_ICON_TOKENS = [
  { Icon: Globe, label: "Web Platforms" },
  { Icon: Layers, label: "UI Systems" },
  { Icon: Palette, label: "Brand Craft" },
  { Icon: PenTool, label: "Creative Direction" },
  { Icon: Target, label: "Paid Media" },
  { Icon: TrendingUp, label: "Search SEO" },
  { Icon: Bot, label: "AI Chatbots" },
  { Icon: Workflow, label: "Automation" },
  { Icon: Rocket, label: "Launch & Scale" },
];

const CAROUSEL_ITEMS = serviceCatalogCards.slice(0, 8);

export function ShowcaseMorphClosingSection({
  reduceMotion,
  onSelectDivision,
}: ShowcaseMorphClosingSectionProps) {
  const bentoRef = useRef<HTMLElement>(null);
  const carouselSectionRef = useRef<HTMLElement>(null);
  const carouselTrackRef = useRef<HTMLDivElement>(null);

  const mosaicStageRef = useRef<HTMLDivElement>(null);
  const mosaicPinRef = useRef<HTMLDivElement>(null);
  const bannerCardRef = useRef<HTMLButtonElement>(null);
  const portraitSlotRef = useRef<HTMLDivElement>(null);

  const pillarsRef = useRef<HTMLElement>(null);
  const kineticBoxRef = useRef<HTMLDivElement>(null);
  const closingRef = useRef<HTMLElement>(null);

  const [carouselIndex, setCarouselIndex] = useState(0);
  const [dockActiveIdx, setDockActiveIdx] = useState(3);
  const [hoveredDockIdx, setHoveredDockIdx] = useState<number | null>(null);
  const [bookmarked, setBookmarked] = useState(false);

  const featuredDockItem = DOCK_CAPABILITIES[dockActiveIdx] ?? DOCK_CAPABILITIES[3]!;
  const featuredCard =
    serviceCatalogCards.find((c) => c.id === featuredDockItem.id) ?? serviceCatalogCards[0]!;

  // Distribute all 14 remaining service tiles into exact 5x3 grid columns (matching F0792)
  const remainingTiles = serviceCatalogCards.filter((c) => c.id !== featuredCard.id).slice(0, 14);
  const col1 = remainingTiles.slice(0, 3);
  const col2 = remainingTiles.slice(3, 6);
  const col3Top = remainingTiles[6];
  const col3Bottom = remainingTiles[7];
  const col4 = remainingTiles.slice(8, 11);
  const col5 = remainingTiles.slice(11, 14);

  const scrollCarouselBy = (dir: -1 | 1) => {
    const nextIdx = Math.max(0, Math.min(CAROUSEL_ITEMS.length - 1, carouselIndex + dir));
    setCarouselIndex(nextIdx);
    const track = carouselTrackRef.current;
    if (!track) return;
    const cardEl = track.children[nextIdx] as HTMLElement | undefined;
    if (cardEl) {
      track.scrollTo({
        left: cardEl.offsetLeft - 24,
        behavior: reduceMotion ? "auto" : "smooth",
      });
    }
  };

  useEffect(() => {
    if (reduceMotion) return;
    ensureGsapRegistered();

    const rootEl = mosaicStageRef.current?.parentElement;
    if (!rootEl) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // 1. Motion Study 05 (F0600–F0636): Staggered Asymmetric Editorial Bento
      if (bentoRef.current) {
        const leftCards = gsap.utils.toArray<HTMLElement>(".bento-left-card", bentoRef.current);
        const rightCards = gsap.utils.toArray<HTMLElement>(".bento-right-card", bentoRef.current);

        gsap.fromTo(
          [...leftCards, ...rightCards],
          { y: 42, opacity: 0, clipPath: "inset(8% 0% 0% 0% round 20px)" },
          {
            y: 0,
            opacity: 1,
            clipPath: "inset(0% 0% 0% 0% round 20px)",
            stagger: 0.1,
            duration: 0.72,
            ease: "power3.out",
            scrollTrigger: {
              trigger: bentoRef.current,
              start: "top 80%",
              once: true,
            },
          }
        );

        mm.add("(min-width: 900px)", () => {
          const rightCol = bentoRef.current?.querySelector<HTMLElement>(".bento-right-col");
          if (rightCol) {
            gsap.fromTo(
              rightCol,
              { y: 38 },
              {
                y: -28,
                ease: "none",
                scrollTrigger: {
                  trigger: bentoRef.current,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: 0.65,
                },
              }
            );
          }
        });
      }

      // 2. Motion Study 05 & 06 (F0744 -> F0792): Stepped Dock + Wide Banner -> Tall Portrait Hero + 5x3 Background Mosaic
      mm.add("(min-width: 900px) and (min-height: 580px)", () => {
        const stage = mosaicStageRef.current;
        const pinEl = mosaicPinRef.current;
        const bannerCard = bannerCardRef.current;
        const centerSlot = portraitSlotRef.current;
        if (!stage || !pinEl || !bannerCard || !centerSlot) return;

        const dockWrap = pinEl.querySelector<HTMLElement>(".dock-bar-wrap");
        const portraitBadges = gsap.utils.toArray<HTMLElement>(".portrait-overlay-badge", bannerCard);
        const mosaicTiles = gsap.utils.toArray<HTMLElement>(".mosaic-surround-tile", pinEl);

        gsap.set(portraitBadges, { opacity: 0, y: 10 });
        gsap.set(mosaicTiles, { opacity: 0, scale: 0.85 });

        // Raised center portrait card overlaps middle 2+ rows cleanly inside viewport matching F0792
        const computeCenterSlotDelta = () => {
          const pinRect = pinEl.getBoundingClientRect();
          const slotRect = centerSlot.getBoundingClientRect();
          const targetW = Math.min(290, Math.max(205, slotRect.width * 1.3));
          const targetH = Math.min(400, Math.max(280, slotRect.height * 1.98));
          return {
            x: slotRect.left + slotRect.width / 2 - (pinRect.left + pinRect.width / 2),
            y: slotRect.top + slotRect.height / 2 - (pinRect.top + pinRect.height / 2),
            width: targetW,
            height: targetH,
          };
        };

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: stage,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.72,
            pin: pinEl,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        // 0.00 -> 0.25 (F0744->F0768): Icon dock lifts off top
        tl.to(dockWrap, { y: -96, opacity: 0, duration: 0.25, ease: "power2.in" }, 0)
          // 0.14 -> 0.66 (F0768->F0792): Exact Wide Banner contracts width & deepens vertically into raised Portrait Card
          .fromTo(
            bannerCard,
            {
              x: 0,
              y: () => Math.min(92, (pinEl.clientHeight || 900) * 0.095),
              width: () => Math.min(980, (pinEl.clientWidth || 1440) * 0.74),
              height: () => Math.min(340, (pinEl.clientHeight || 900) * 0.39),
              borderRadius: "24px",
              scale: 1,
            },
            {
              x: () => computeCenterSlotDelta().x,
              y: () => computeCenterSlotDelta().y,
              width: () => computeCenterSlotDelta().width,
              height: () => computeCenterSlotDelta().height,
              borderRadius: "24px",
              duration: 0.54,
              ease: "power3.inOut",
            },
            0.14
          )
          // 0.36 -> 0.74: All 14 surrounding tiles in the 5x3 grid stagger outward from center behind the raised Portrait Card
          .to(
            mosaicTiles,
            {
              opacity: 1,
              scale: 1,
              stagger: { amount: 0.24, from: "center" },
              duration: 0.34,
              ease: "power3.out",
            },
            0.36
          )
          // 0.48 -> 0.72: Portrait overlays (@handle bubble, top-right badge, bottom pill) appear once upright
          .to(
            portraitBadges,
            { opacity: 1, y: 0, stagger: 0.05, duration: 0.2, ease: "power2.out" },
            0.48
          );
      });

      // 3. Motion Study 07 (F0864): 3 Tilted Square-ish Offering Cards with Highlighted Center
      if (pillarsRef.current) {
        const cards = gsap.utils.toArray<HTMLElement>(".pillar-cascade-card", pillarsRef.current);
        gsap.fromTo(
          cards,
          { y: 42, opacity: 0, scale: 0.94 },
          {
            y: 0,
            opacity: 1,
            scale: (i: number) => (i === 1 ? 1.07 : 0.97),
            rotation: (i: number) => (i === 0 ? -3 : i === 2 ? 3 : 0),
            stagger: 0.1,
            duration: 0.72,
            ease: "power3.out",
            scrollTrigger: {
              trigger: pillarsRef.current,
              start: "top 78%",
              once: true,
            },
          }
        );
      }

      // 4. Motion Study 08 (F0972): Contrasting Closing CTAs Reveal
      if (closingRef.current) {
        const ctaCards = gsap.utils.toArray<HTMLElement>(".closing-cta-card", closingRef.current);
        gsap.fromTo(
          ctaCards,
          { y: 36, opacity: 0, scale: 0.97 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            stagger: 0.12,
            duration: 0.7,
            ease: "power3.out",
            scrollTrigger: {
              trigger: closingRef.current,
              start: "top 82%",
              once: true,
            },
          }
        );
      }
    }, rootEl);

    return () => ctx.revert();
  }, [reduceMotion]);

  // Motion Study 07 (F0900 -> F0948): Circular White Icon Tokens dropping & settling inside Deep Cobalt Marquee
  useEffect(() => {
    if (reduceMotion || typeof window === "undefined") return;
    const container = kineticBoxRef.current;
    if (!container) return;

    let stopped = false;
    let rafId = 0;
    let observer: IntersectionObserver | null = null;
    let cleanupMatter: (() => void) | null = null;

    const initPhysics = async () => {
      try {
        const Matter = await import("matter-js");
        if (stopped || !container) return;

        const width = container.clientWidth || 1060;
        const height = container.clientHeight || 200;

        const engine = Matter.Engine.create({
          gravity: { x: 0, y: 0.48, scale: 0.001 },
        });

        const walls = [
          Matter.Bodies.rectangle(width / 2, height + 24, width + 100, 48, { isStatic: true }),
          Matter.Bodies.rectangle(width / 2, -60, width + 100, 48, { isStatic: true }),
          Matter.Bodies.rectangle(-24, height / 2, 48, height + 160, { isStatic: true }),
          Matter.Bodies.rectangle(width + 24, height / 2, 48, height + 160, { isStatic: true }),
        ];

        const tokenNodes = Array.from(container.querySelectorAll<HTMLElement>(".physics-token-node"));
        const bodies = tokenNodes.map((node, i) => {
          const radius = (node.offsetWidth || 54) / 2;
          // Drop from left/upper cluster matching F0900 -> spread smoothly across floor matching F0948
          const x = Math.min(width - 40, Math.max(40, (width * 0.08) + i * (width * 0.095)));
          const y = 18 + (i % 3) * 26;
          return Matter.Bodies.circle(x, y, radius, {
            restitution: 0.52,
            friction: 0.16,
            frictionAir: 0.025,
            density: 0.002,
          });
        });

        Matter.World.add(engine.world, [...walls, ...bodies]);

        const mouse = Matter.Mouse.create(container);
        const mAny = mouse as unknown as {
          mousewheel?: EventListener;
          element?: HTMLElement;
        };
        if (mAny.element && mAny.mousewheel) {
          mAny.element.removeEventListener("mousewheel", mAny.mousewheel);
          mAny.element.removeEventListener("DOMMouseScroll", mAny.mousewheel);
        }

        const mouseConstraint = Matter.MouseConstraint.create(engine, {
          mouse,
          constraint: { stiffness: 0.2, render: { visible: false } },
        });
        Matter.World.add(engine.world, mouseConstraint);

        let running = false;
        const step = () => {
          if (stopped || !running) return;
          Matter.Engine.update(engine, 1000 / 60);
          bodies.forEach((body, idx) => {
            const el = tokenNodes[idx];
            if (el) {
              el.style.transform = `translate3d(${body.position.x - el.offsetWidth / 2}px, ${
                body.position.y - el.offsetHeight / 2
              }px, 0) rotate(${body.angle}rad)`;
            }
          });
          rafId = requestAnimationFrame(step);
        };

        observer = new IntersectionObserver(
          ([entry]) => {
            if (!entry) return;
            if (entry.isIntersecting && !running) {
              running = true;
              rafId = requestAnimationFrame(step);
            } else if (!entry.isIntersecting && running) {
              running = false;
              cancelAnimationFrame(rafId);
            }
          },
          { threshold: 0.08 }
        );
        observer.observe(container);

        cleanupMatter = () => {
          running = false;
          cancelAnimationFrame(rafId);
          Matter.World.clear(engine.world, false);
          Matter.Engine.clear(engine);
        };
      } catch {
        // Static flex fallback works automatically
      }
    };

    void initPhysics();

    return () => {
      stopped = true;
      cancelAnimationFrame(rafId);
      observer?.disconnect();
      cleanupMatter?.();
    };
  }, [reduceMotion]);

  return (
    <>
      {/* MOTION STUDY 05 (F0576->F0636): TWO-COLUMN ASYMMETRIC STAGGERED EDITORIAL BENTO */}
      <section
        ref={bentoRef}
        data-reel-scene="bento"
        className="relative z-10 mx-auto max-w-[1440px] px-5 py-20 sm:px-8 md:px-14 lg:px-20 lg:py-28"
        aria-label="Methodology and Editorial Showcase"
      >
        <div className="mb-14 text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[#7F8AA0]">
            HOW MY3 <span className="text-blue-400">EXECUTES</span>
          </span>
          <h2 className="mx-auto mt-2 max-w-[16ch] text-[clamp(2.1rem,4.1vw,3.9rem)] font-semibold leading-[1.03] tracking-[-0.02em] text-white">
            Every system built for growth
          </h2>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:gap-10">
          {/* Left Column (Cards 1 & 3) */}
          <div className="flex flex-col gap-8 lg:gap-10">
            {/* Card 1: Stacked Mini Fan + Floating @webcraft Pill + Action CTA (F0600 Top-Left) */}
            <article className="bento-left-card flex flex-col justify-between rounded-[22px] border border-white/12 bg-[#10141D] p-6 sm:p-7">
              <div className="relative mb-6 flex h-[230px] items-center justify-center overflow-hidden rounded-2xl bg-[#080B12] p-4">
                <button
                  type="button"
                  onClick={() => {
                    onSelectDivision("website-development");
                    scrollToSectionId("divisions-directory");
                  }}
                  className="absolute top-3.5 left-3.5 z-20 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-[#10141D]/90 px-3 py-1 text-[11px] font-medium text-white backdrop-blur-md transition hover:border-blue-400"
                >
                  <Zap aria-hidden="true" className="size-3 text-blue-400" />
                  Division 01 · Web
                </button>

                {/* 3-card stacked mini fan matching F0600 */}
                <div className="relative flex items-center justify-center">
                  <div className="h-[135px] w-[105px] -translate-x-7 -rotate-12 overflow-hidden rounded-xl border border-white/15 shadow-lg">
                    <img
                      src="/insights/when-to-redesign-your-website.jpg"
                      alt="UX Wireframe Planning"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="relative z-10 h-[145px] w-[115px] overflow-hidden rounded-xl border border-blue-400/35 shadow-2xl">
                    <img
                      src="/insights/premium-websites-that-convert.jpg"
                      alt="Corporate Website Engineering"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="h-[135px] w-[105px] translate-x-7 rotate-12 overflow-hidden rounded-xl border border-white/15 shadow-lg">
                    <img
                      src="/insights/shopify-vs-wordpress-which-is-better.jpg"
                      alt="E-Commerce Platforms"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <span className="absolute -top-3 -right-8 z-20 rounded-full bg-[#2456A4] px-2.5 py-0.5 text-[11px] font-semibold text-white shadow-lg">
                    @webcraft
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white sm:text-2xl">{approach[0]![0]}</h3>
                <p className="mt-2 max-w-[42ch] text-sm leading-relaxed text-[#A3ACBC]">
                  {approach[0]![1]}
                </p>
                <button
                  type="button"
                  onClick={() => scrollToSectionId("divisions-directory")}
                  className="mt-5 inline-flex items-center rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold text-white transition hover:border-blue-400 hover:bg-[#142B4A]"
                >
                  How it works
                </button>
              </div>
            </article>

            {/* Card 3: Wide Photography Showcase (F0636 Bottom-Left) */}
            <article className="bento-left-card flex flex-col justify-between rounded-[22px] border border-white/12 bg-[#10141D] p-6 sm:p-7">
              <div className="mb-6 aspect-[16/10] overflow-hidden rounded-2xl border border-white/10">
                <img
                  src="/insights/website-branding-and-marketing-working-together.jpg"
                  alt={approach[2]![0]}
                  className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white sm:text-2xl">{approach[2]![0]}</h3>
                <p className="mt-2 max-w-[42ch] text-sm leading-relaxed text-[#A3ACBC]">
                  {approach[2]![1]}
                </p>
                <Link
                  to="/contact"
                  className="mt-5 inline-flex items-center rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold text-white transition hover:border-blue-400 hover:bg-[#142B4A]"
                >
                  Start with My3
                </Link>
              </div>
            </article>
          </div>

          {/* Right Offset Column (Cards 2 & 4 staggered down cleanly matching F0600 / F0636) */}
          <div className="bento-right-col flex flex-col gap-8 md:mt-16 lg:gap-10">
            {/* Card 2: Saturated Cobalt / Sapphire Brand Visual Panel matching F0600 Top-Right */}
            <article className="bento-right-card flex flex-col justify-between rounded-[22px] border border-blue-400/25 bg-[#10141D] p-6 sm:p-7">
              <div className="relative mb-6 flex h-[245px] items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-[#1E40AF] via-[#2456A4] to-[#0D2149]">
                {/* Abstract Geometric Aperture + Brand Focus */}
                <div className="relative flex items-center justify-center">
                  <div className="absolute size-44 rounded-full border border-white/15" />
                  <div className="absolute size-32 rounded-full border border-white/25" />
                  <div className="flex size-20 items-center justify-center rounded-full bg-white text-[#080B12] shadow-2xl">
                    <Compass aria-hidden="true" className="size-9 stroke-[1.75]" />
                  </div>
                </div>
                <span className="pointer-events-none absolute right-5 bottom-4 font-mono text-[11px] tracking-widest text-blue-200/80">
                  BRAND · STRATEGY
                </span>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white sm:text-2xl">{approach[1]![0]}</h3>
                <p className="mt-2 max-w-[42ch] text-sm leading-relaxed text-[#A3ACBC]">
                  {approach[1]![1]}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    onSelectDivision("branding-creative");
                    scrollToSectionId("divisions-directory");
                  }}
                  className="mt-5 inline-flex items-center rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold text-white transition hover:border-blue-400 hover:bg-[#142B4A]"
                >
                  Read more
                </button>
              </div>
            </article>

            {/* Card 4: Light/Elevated Container w/ Tall Dark Typographic UI Card matching F0636 Bottom-Right */}
            <article className="bento-right-card relative flex flex-col justify-between overflow-hidden rounded-[22px] border border-white/12 bg-[#141A26] p-6 sm:p-7">
              <div className="flex items-center justify-between pb-4">
                <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-blue-400">
                  Delivery Cadence
                </span>
                <span className="flex size-8 items-center justify-center rounded-full bg-white text-[#080B12] shadow">
                  <BarChart3 aria-hidden="true" className="size-4" />
                </span>
              </div>

              <div className="mx-auto my-2 w-full max-w-[300px] rounded-2xl border border-white/10 bg-[#080B12] p-6 text-center shadow-2xl">
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#7F8AA0]">
                  5-Phase Workflow
                </span>
                <div className="mt-4 space-y-2">
                  {process.map(([stepName], i) => (
                    <div
                      key={stepName}
                      className={`font-display text-lg tracking-tight ${
                        i === 2
                          ? "text-white font-semibold text-xl"
                          : i === 1 || i === 3
                            ? "text-slate-400"
                            : "text-slate-600"
                      }`}
                    >
                      {stepName}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 text-center">
                <p className="text-xs text-[#A3ACBC]">{approach[4]![1]}</p>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* MOTION STUDY 05 (F0708): SPLIT HEADING LEFT + 4 SQUARE TILES CAROUSEL & THIN PROGRESS TRACK RIGHT */}
      <section
        ref={carouselSectionRef}
        data-reel-scene="carousel"
        className="relative z-10 mx-auto max-w-[1440px] px-5 py-20 sm:px-8 md:px-14 lg:px-20 lg:py-24"
        aria-label="Service Tracks Horizontal Showcase"
      >
        <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
          {/* Left Column: Eyebrow + 2-Line Headline + Paragraph + Bottom-Left Prev/Next (F0708) */}
          <div className="flex flex-col justify-between lg:col-span-4 lg:h-full">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">
                Core <span className="text-[#7F8AA0]">Disciplines</span>
              </span>
              <h2 className="mt-2 text-[clamp(2rem,3.4vw,3.3rem)] font-semibold leading-[1.03] tracking-[-0.02em] text-white">
                Services built <span className="text-[#7F8AA0]">for Scale</span>
              </h2>
              <p className="mt-4 max-w-[34ch] text-xs leading-relaxed text-[#A3ACBC] sm:text-sm">
                Explore each practice area — from corporate web platforms and brand design to
                performance ads and AI workflows.
              </p>
            </div>

            <div className="mt-8 flex items-center gap-2.5 lg:mt-16">
              <button
                type="button"
                aria-label="Previous capability card"
                onClick={() => scrollCarouselBy(-1)}
                className="flex size-9 items-center justify-center rounded-full border border-white/15 bg-[#10141D] text-white transition hover:border-blue-400 hover:bg-[#142B4A]"
              >
                <ArrowLeft aria-hidden="true" className="size-4" />
              </button>
              <button
                type="button"
                aria-label="Next capability card"
                onClick={() => scrollCarouselBy(1)}
                className="flex size-9 items-center justify-center rounded-full border border-white/15 bg-[#10141D] text-white transition hover:border-blue-400 hover:bg-[#142B4A]"
              >
                <ArrowRight aria-hidden="true" className="size-4" />
              </button>
            </div>
          </div>

          {/* Right Column: Top-Right Pill + Clean Square Tile Strip + Thin Progress Indicator (F0708) */}
          <div className="lg:col-span-8">
            <div className="mb-5 flex justify-end">
              <button
                type="button"
                onClick={() => scrollToSectionId("divisions-directory")}
                className="inline-flex items-center rounded-full bg-[#2456A4] px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-blue-600"
              >
                View All 37
              </button>
            </div>

            <div
              ref={carouselTrackRef}
              className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2"
            >
              {CAROUSEL_ITEMS.map((item, idx) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setCarouselIndex(idx);
                    onSelectDivision(item.slug);
                    scrollToSectionId("divisions-directory");
                  }}
                  className="group w-[190px] shrink-0 snap-start text-left sm:w-[215px]"
                >
                  <div className="aspect-square overflow-hidden rounded-2xl border border-white/12 bg-[#10141D]">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <h3 className="mt-2.5 truncate text-xs font-semibold text-white transition-colors group-hover:text-blue-400 sm:text-sm">
                    {item.title}
                  </h3>
                </button>
              ))}
            </div>

            <div className="mt-5 h-[2px] w-full overflow-hidden rounded-full bg-white/12">
              <div
                className="h-full rounded-full bg-blue-400 transition-all duration-300"
                style={{ width: `${((carouselIndex + 1) / CAROUSEL_ITEMS.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* MOTION STUDY 05 & 06 (F0744 -> F0792): STEPPED ICON DOCK + WIDE BANNER TO PORTRAIT HERO & 5x3 MOSAIC */}
      <section
        ref={mosaicStageRef}
        data-reel-scene="mosaic"
        className="relative z-10 w-full min-[900px]:min-h-[255vh]"
        aria-label="Interactive Capability Dock and 15-Tile Visual Mosaic"
      >
        <div className="w-full">
          <div
            ref={mosaicPinRef}
            className="relative flex w-full flex-col items-center justify-center overflow-hidden px-5 py-16 sm:px-8 md:px-14 lg:px-20 min-[900px]:h-screen min-[900px]:pt-[88px] min-[900px]:pb-8"
          >
            {/* Interactive Stepped 7-Tile Icon Dock matching F0744 */}
            <div className="dock-bar-wrap relative z-30 mb-8 flex flex-col items-center min-[900px]:absolute min-[900px]:top-[112px]">
              <div className="flex items-end gap-2 rounded-2xl border border-white/15 bg-[#10141D]/95 px-3 py-2.5 shadow-2xl backdrop-blur-lg sm:gap-2.5">
                {DOCK_CAPABILITIES.map(({ id, label, Icon, primary }, idx) => {
                  const isSelected = dockActiveIdx === idx;
                  const dist =
                    hoveredDockIdx === null ? Math.abs(3 - idx) : Math.abs(hoveredDockIdx - idx);
                  const stepScale = dist === 0 ? 1.24 : dist === 1 ? 1.08 : dist === 2 ? 0.96 : 0.88;
                  return (
                    <button
                      key={id}
                      type="button"
                      aria-label={`Feature ${label}`}
                      onMouseEnter={() => setHoveredDockIdx(idx)}
                      onMouseLeave={() => setHoveredDockIdx(null)}
                      onClick={() => setDockActiveIdx(idx)}
                      style={{ transform: reduceMotion ? undefined : `scale(${stepScale})` }}
                      className={`relative flex size-10 origin-bottom items-center justify-center rounded-xl transition-all duration-200 focus-visible:outline-2 focus-visible:outline-blue-400 sm:size-11 ${
                        isSelected || primary
                          ? "bg-[#2456A4] text-white shadow-lg shadow-blue-950/60"
                          : "bg-white/8 text-slate-300 hover:bg-white/15 hover:text-white"
                      }`}
                    >
                      <Icon aria-hidden="true" className="size-4.5 sm:size-5" />
                      {isSelected && (
                        <span
                          aria-hidden="true"
                          className="absolute -bottom-2 size-1 rounded-full bg-blue-300"
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* TRUE 5-COLUMN x 3-ROW MOSAIC GRID (14 surrounding tiles + Center Row 2 anchor for F0792!) */}
            <div className="relative z-10 hidden w-full max-w-[1160px] grid-cols-5 items-center gap-3.5 min-[900px]:grid lg:gap-4">
              {/* Col 1 (3 tiles) */}
              <div className="flex flex-col gap-3.5 lg:gap-4">
                {col1.map((tile) => (
                  <MosaicTile key={tile.id} tile={tile} onSelect={onSelectDivision} />
                ))}
              </div>
              {/* Col 2 (3 tiles) */}
              <div className="flex flex-col gap-3.5 lg:gap-4">
                {col2.map((tile) => (
                  <MosaicTile key={tile.id} tile={tile} onSelect={onSelectDivision} />
                ))}
              </div>
              {/* Col 3 (Top peeking tile + Center Hero Portrait Anchor + Bottom peeking tile!) */}
              <div className="flex flex-col gap-3.5 lg:gap-4">
                {col3Top && <MosaicTile tile={col3Top} onSelect={onSelectDivision} />}
                <div
                  ref={portraitSlotRef}
                  aria-hidden="true"
                  className="h-[clamp(112px,20vh,186px)] w-full rounded-[22px] border border-transparent"
                />
                {col3Bottom && <MosaicTile tile={col3Bottom} onSelect={onSelectDivision} />}
              </div>
              {/* Col 4 (3 tiles) */}
              <div className="flex flex-col gap-3.5 lg:gap-4">
                {col4.map((tile) => (
                  <MosaicTile key={tile.id} tile={tile} onSelect={onSelectDivision} />
                ))}
              </div>
              {/* Col 5 (3 tiles) */}
              <div className="flex flex-col gap-3.5 lg:gap-4">
                {col5.map((tile) => (
                  <MosaicTile key={tile.id} tile={tile} onSelect={onSelectDivision} />
                ))}
              </div>
            </div>

            {/* SHARED TRANSFORMING ELEMENT: Wide Banner (F0768) -> Tall Raised Center Portrait Card (F0792) */}
            <div className="pointer-events-none absolute inset-0 hidden items-center justify-center min-[900px]:flex">
              <button
                ref={bannerCardRef}
                type="button"
                onClick={() => {
                  onSelectDivision(featuredCard.slug);
                  scrollToSectionId("divisions-directory");
                }}
                aria-label={`Explore ${featuredCard.title}`}
                className="group pointer-events-auto relative z-30 overflow-hidden rounded-[24px] border border-blue-400/40 bg-[#10141D] text-left shadow-[0_36px_96px_-18px_rgba(8,18,40,0.92)] transition-[border-color] duration-300 hover:border-blue-400 focus-visible:outline-2 focus-visible:outline-blue-300"
              >
                <img
                  src={featuredCard.image}
                  alt={featuredCard.title}
                  style={{ objectPosition: featuredCard.focalPosition ?? "center" }}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#080B12]/90 via-[#080B12]/15 to-transparent" />

                {/* Floating @handle speech bubble matching F0792 */}
                <span className="portrait-overlay-badge pointer-events-none absolute top-14 left-4 rounded-full bg-[#2456A4] px-3 py-1 text-xs font-semibold text-white shadow-xl -rotate-6">
                  {featuredCard.handle}
                </span>

                {/* Top-right interactive light badge matching F0792 ("Like" -> "Save / Highlight") */}
                <span
                  role="button"
                  tabIndex={-1}
                  onClick={(e) => {
                    e.stopPropagation();
                    setBookmarked((b) => !b);
                  }}
                  className="portrait-overlay-badge absolute top-4 right-4 inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-[#080B12] shadow-lg"
                >
                  {bookmarked ? "★ Saved" : "● Explore"}
                </span>

                {/* Bottom creator/category attribution row matching F0792 */}
                <div className="portrait-overlay-badge pointer-events-none absolute inset-x-0 bottom-0 flex items-center gap-2.5 p-4">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-white/25 bg-[#142B4A] text-blue-200">
                    <Sparkles aria-hidden="true" className="size-3.5" />
                  </span>
                  <div className="min-w-0">
                    <span className="block truncate text-sm font-semibold text-white">
                      {featuredCard.title}
                    </span>
                    <span className="block truncate text-[11px] text-slate-300">
                      {featuredCard.category} · My3 Digital
                    </span>
                  </div>
                </div>
              </button>
            </div>

            {/* Mobile Fallback below Dock (< 900px) */}
            <div className="mt-2 w-full space-y-4 min-[900px]:hidden">
              <button
                type="button"
                onClick={() => {
                  onSelectDivision(featuredCard.slug);
                  scrollToSectionId("divisions-directory");
                }}
                className="relative h-[240px] w-full overflow-hidden rounded-2xl border border-blue-400/35 bg-[#10141D] text-left shadow-xl"
              >
                <img src={featuredCard.image} alt={featuredCard.title} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#080B12] via-[#080B12]/25 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-blue-300">
                    {featuredCard.category}
                  </span>
                  <h3 className="mt-1 text-lg font-semibold text-white">{featuredCard.title}</h3>
                </div>
              </button>
              <div className="grid w-full grid-cols-2 gap-3 sm:grid-cols-3">
                {remainingTiles.slice(0, 6).map((tile) => (
                  <MosaicTile key={tile.id} tile={tile} onSelect={onSelectDivision} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MOTION STUDY 07 (F0864): SERVICE PILLARS SPLIT WITH 3 OVERLAPPING TILTED CARDS (Zero Fake Prices) */}
      <section
        ref={pillarsRef}
        data-reel-scene="tiers"
        className="relative z-10 mx-auto max-w-[1440px] px-5 py-20 sm:px-8 md:px-14 lg:px-20 lg:py-28"
        aria-label="Core Agency Pillars"
      >
        <div className="grid items-center gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="mb-4 flex size-9 items-center justify-center rounded-full border border-white/15 bg-[#10141D] text-blue-300">
              <FolderOpen aria-hidden="true" className="size-4" />
            </div>
            <h2 className="max-w-[14ch] text-[clamp(2rem,3.6vw,3.4rem)] font-semibold leading-[1.03] tracking-[-0.02em] text-white">
              Service Pillars
            </h2>
            <p className="mt-3 max-w-[38ch] text-sm leading-relaxed text-[#A3ACBC]">
              {pillars[0]![2]} Tailored cleanly across every engagement scope — websites, brand
              identity, growth, and automation.
            </p>
            <div className="mt-6">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-[#10141D] px-5 py-2.5 text-xs font-semibold text-white transition hover:border-blue-400 hover:bg-[#142B4A]"
              >
                Request Custom Scope
                <ArrowRight aria-hidden="true" className="size-3.5" />
              </Link>
            </div>
          </div>

          {/* 3 Overlapping Tilted Square Cards matching F0864 (Center Emphasized in Signature Blue) */}
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:col-span-7 lg:gap-0">
            {pillarOfferings.map((pillar, idx) => {
              const isCenter = idx === 1;
              return (
                <button
                  key={pillar.index}
                  type="button"
                  onClick={() => {
                    onSelectDivision(pillar.divisionSlug);
                    scrollToSectionId("divisions-directory");
                  }}
                  className={`pillar-cascade-card relative flex min-h-[225px] w-full flex-col justify-between rounded-2xl p-5 text-left transition sm:w-[215px] ${
                    isCenter
                      ? "z-20 bg-[#2456A4] text-white shadow-[0_28px_64px_-12px_rgba(36,86,164,0.65)] sm:-mx-2 border border-blue-300/35"
                      : "z-10 border border-white/12 bg-[#141B29] text-white shadow-xl hover:border-blue-400/50"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span
                      className={`text-[11px] font-semibold uppercase tracking-wider ${
                        isCenter ? "text-blue-100" : "text-blue-400"
                      }`}
                    >
                      Pillar {pillar.index}
                    </span>
                    {isCenter && (
                      <span
                        style={{ color: "#080B12" }}
                        className="rounded-full bg-white px-2.5 py-0.5 text-[10px] font-bold text-slate-950"
                      >
                        Core Focus
                      </span>
                    )}
                  </div>

                  <div className="my-3">
                    <h3 className="text-lg font-semibold leading-snug text-white">{pillar.title}</h3>
                    <p
                      className={`mt-2 line-clamp-3 text-xs leading-relaxed ${
                        isCenter ? "text-blue-100/90" : "text-[#A3ACBC]"
                      }`}
                    >
                      {pillar.summary}
                    </p>
                  </div>

                  <div
                    className={`border-t pt-2.5 text-[10px] font-medium ${
                      isCenter
                        ? "border-white/25 text-blue-100"
                        : "border-white/10 text-[#7F8AA0]"
                    }`}
                  >
                    {pillar.scope}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* MOTION STUDY 07 & 08 (F0900->F1020): KINETIC ICON-DROP MARQUEE + TWO CONTRASTING CTA CARDS */}
      <section
        ref={closingRef}
        data-reel-scene="closing"
        className="relative z-10 mx-auto max-w-[1440px] px-5 pb-24 sm:px-8 md:px-14 lg:px-20"
        aria-label="Kinetic Marquee and Closing Call to Action"
      >
        {/* Cobalt Rounded Showcase Panel matching F0900–F0948 */}
        <div className="relative overflow-hidden rounded-[28px] border border-blue-400/30 bg-gradient-to-br from-[#1C4796] via-[#2456A4] to-[#11264D] pt-10 pb-8 shadow-[0_36px_100px_-24px_rgba(14,32,68,0.8)]">
          {/* Oversized Subtle Background Watermark Ring/Text */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-10 -bottom-16 select-none text-[14rem] font-bold leading-none text-white opacity-[0.06]"
          >
            MY3
          </div>

          {/* Top Horizontal Marquee Strip with INLINE Thumbnail Cards matching F0948 */}
          <div className="relative z-10 overflow-hidden py-3">
            <div
              className="flex w-max items-center gap-6"
              style={{
                animation: reduceMotion ? "none" : "marquee-scroll 26s linear infinite",
              }}
            >
              {[0, 1, 2].map((dup) => (
                <div key={dup} className="flex items-center gap-6">
                  <span className="text-[clamp(1.9rem,3.6vw,3.1rem)] font-semibold tracking-[-0.025em] text-white">
                    One partner
                  </span>
                  <img
                    src="/insights/premium-websites-that-convert.jpg"
                    alt=""
                    aria-hidden="true"
                    className="h-11 w-9 rounded-lg border border-white/25 object-cover shadow-md sm:h-14 sm:w-11"
                  />
                  <span className="text-[clamp(1.9rem,3.6vw,3.1rem)] font-semibold tracking-[-0.025em] text-white">
                    Every possibility in digital
                  </span>
                  <img
                    src="/insights/why-your-business-needs-more-than-a-logo.jpg"
                    alt=""
                    aria-hidden="true"
                    className="h-11 w-9 rounded-lg border border-white/25 object-cover shadow-md sm:h-14 sm:w-11"
                  />
                  <span className="text-[clamp(1.9rem,3.6vw,3.1rem)] font-semibold tracking-[-0.025em] text-blue-100">
                    Strategy to Scale
                  </span>
                  <img
                    src="/insights/meta-ads-vs-google-ads.jpg"
                    alt=""
                    aria-hidden="true"
                    className="h-11 w-9 rounded-lg border border-white/25 object-cover shadow-md sm:h-14 sm:w-11"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* 9 Circular White Line-Icon Tokens settling across bottom floor via Matter.js (F0900->F0948) */}
          <div
            ref={kineticBoxRef}
            className="relative z-10 mx-auto mt-6 h-[195px] w-full max-w-[1160px] px-4 select-none"
          >
            {MARQUEE_ICON_TOKENS.map(({ Icon, label }) => (
              <div
                key={label}
                title={label}
                aria-label={label}
                className={`${
                  reduceMotion
                    ? "m-2 inline-flex"
                    : "physics-token-node absolute top-0 left-0 cursor-grab active:cursor-grabbing"
                } flex size-[54px] items-center justify-center rounded-full border border-blue-200/40 bg-white text-[#080B12] shadow-xl sm:size-[60px]`}
              >
                <Icon aria-hidden="true" className="size-5 stroke-[1.75]" />
              </div>
            ))}
          </div>
        </div>

        {/* MOTION STUDY 08 (F0960 -> F0972): Two Contrasting Closing CTA Cards */}
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {/* Left Card: Expressive Full-Bleed Visual + White Text Overlay + White Pill CTA */}
          <Link
            to="/contact"
            className="closing-cta-card group relative flex min-h-[380px] flex-col justify-end overflow-hidden rounded-[24px] border border-blue-400/25 bg-[#10141D] p-8 text-white shadow-2xl sm:p-10"
          >
            <img
              src="/insights/website-branding-and-marketing-working-together.jpg"
              alt="Collaborate with My3 Digital"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#080B12] via-[#080B12]/65 to-[#142B4A]/45" />

            <div className="relative z-10 max-w-md">
              <span className="mb-4 inline-flex size-9 items-center justify-center rounded-full border border-white/30 bg-white/10 backdrop-blur-md">
                <PenTool aria-hidden="true" className="size-4 text-white" />
              </span>
              <h3 className="text-3xl font-semibold leading-tight tracking-[-0.02em] text-white sm:text-4xl">
                Connect with
                <br />
                our team
              </h3>
              <p className="mt-3 text-xs leading-relaxed text-slate-200 sm:text-sm">
                Reach out to our Hyderabad or Bangalore studio ({contact.phone}) to scope your next
                digital initiative.
              </p>
              <span className="mt-6 inline-flex items-center rounded-full bg-white px-5 py-2.5 text-xs font-semibold text-[#080B12] transition group-hover:bg-blue-100">
                Let&apos;s Meet
              </span>
            </div>
          </Link>

          {/* Right Card: High-Contrast Light Architectural Surface + Dark Typography & Dark Pill CTA (F0972) */}
          <Link
            to="/work"
            className="closing-cta-card group relative flex min-h-[380px] flex-col justify-end overflow-hidden rounded-[24px] border border-white/20 bg-[#EEF2F8] p-8 text-[#080B12] shadow-2xl sm:p-10"
          >
            <div className="pointer-events-none absolute top-0 right-0 h-[66%] w-[64%] overflow-hidden rounded-bl-[140px] opacity-90">
              <img
                src="/insights/3d-interactive-websites-future-of-web-design.jpg"
                alt="My3 Digital Portfolio"
                className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#EEF2F8] via-[#EEF2F8]/30 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#EEF2F8] via-transparent to-transparent" />
            </div>

            <div className="relative z-10 max-w-md">
              <span className="mb-4 inline-flex size-9 items-center justify-center rounded-full border border-[#080B12]/15 bg-white shadow-sm">
                <Briefcase aria-hidden="true" className="size-4 text-[#080B12]" />
              </span>
              <h3
                style={{ color: "#080B12" }}
                className="text-3xl font-semibold leading-tight tracking-[-0.02em] text-slate-950 sm:text-4xl"
              >
                Archive of
                <br />
                launched work
              </h3>
              <p className="mt-3 text-xs leading-relaxed text-slate-600 sm:text-sm">
                Explore live corporate websites, custom interfaces, and brand launches delivered by
                My3 Digital.
              </p>
              <span className="mt-6 inline-flex items-center rounded-full bg-[#080B12] px-5 py-2.5 text-xs font-semibold text-white transition group-hover:bg-[#2456A4]">
                Archives
              </span>
            </div>
          </Link>
        </div>
      </section>
    </>
  );
}

function MosaicTile({
  tile,
  onSelect,
}: {
  tile: (typeof serviceCatalogCards)[number];
  onSelect: (slug: string) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => {
        onSelect(tile.slug);
        scrollToSectionId("divisions-directory");
      }}
      className="mosaic-surround-tile group relative h-[clamp(112px,20vh,186px)] w-full overflow-hidden rounded-2xl border border-white/12 bg-[#10141D] text-left shadow-lg transition hover:border-blue-400/55"
    >
      <img
        src={tile.image}
        alt={tile.title}
        style={{ objectPosition: tile.focalPosition ?? "center" }}
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#080B12]/85 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 p-2.5 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <span className="block truncate text-[11px] font-semibold text-white">{tile.title}</span>
      </div>
    </button>
  );
}
