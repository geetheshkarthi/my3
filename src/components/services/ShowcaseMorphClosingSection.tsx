import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Bot,
  ChevronRight,
  Globe,
  Layers,
  Palette,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { approach, contact, process } from "@/content/site";
import { ensureGsapRegistered, gsap, scrollToSectionId } from "./gsapMotion";
import {
  bentoEditorialArticles,
  pillarOfferings,
  serviceCatalogCards,
} from "./servicesData";

type ShowcaseMorphClosingSectionProps = {
  reduceMotion: boolean;
  onSelectDivision: (slug: string) => void;
};

const DOCK_CAPABILITIES = [
  { id: "svc-web", label: "Websites", Icon: Globe, slug: "website-development" },
  { id: "svc-uiux", label: "UI/UX", Icon: Layers, slug: "website-development" },
  { id: "svc-brand", label: "Branding", Icon: Palette, slug: "branding-creative" },
  { id: "svc-ads", label: "Paid Ads", Icon: Target, slug: "performance-marketing" },
  { id: "svc-seo", label: "SEO", Icon: TrendingUp, slug: "digital-marketing" },
  { id: "svc-crm", label: "AI & CRM", Icon: Bot, slug: "technology-automation" },
];

const PHYSICS_BADGES = [
  "Websites",
  "UI/UX Design",
  "Branding",
  "Google Ads",
  "Meta Ads",
  "Technical SEO",
  "CRM Automation",
  "AI Chatbots",
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
  const [dockActiveIdx, setDockActiveIdx] = useState(0);
  const [hoveredDockIdx, setHoveredDockIdx] = useState<number | null>(null);

  const featuredDockItem = DOCK_CAPABILITIES[dockActiveIdx] ?? DOCK_CAPABILITIES[0]!;
  const featuredCard =
    serviceCatalogCards.find((c) => c.id === featuredDockItem.id) ?? serviceCatalogCards[0]!;

  // Remaining 14 cards placed asymmetrically around the tall centered Portrait Card
  const surroundingMosaicCards = serviceCatalogCards
    .filter((c) => c.id !== featuredCard.id)
    .slice(0, 12);
  const leftMosaicCards = surroundingMosaicCards.slice(0, 6);
  const rightMosaicCards = surroundingMosaicCards.slice(6, 12);

  // Scroll Carousel helper
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

  // GSAP Orchestration for Stage 3: Bento + Banner->PortraitCard & Mosaic + Pillars + Closing
  useEffect(() => {
    if (reduceMotion) return;
    ensureGsapRegistered();

    const rootEl = mosaicStageRef.current?.parentElement;
    if (!rootEl) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // 1. Editorial Bento Dual-Column Stagger & Clip Reveal (Section 14)
      if (bentoRef.current) {
        const leftCards = gsap.utils.toArray<HTMLElement>(".bento-left-card", bentoRef.current);
        const rightCards = gsap.utils.toArray<HTMLElement>(".bento-right-card", bentoRef.current);

        gsap.fromTo(
          [...leftCards, ...rightCards],
          { y: 42, opacity: 0, clipPath: "inset(8% 0% 0% 0% round 18px)" },
          {
            y: 0,
            opacity: 1,
            clipPath: "inset(0% 0% 0% 0% round 18px)",
            stagger: 0.1,
            duration: 0.75,
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
              { y: 36 },
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

      // 2. Shared-Element Transformation: Icon Dock + Wide Banner -> Portrait Hero Card & Mosaic (Section 16 & 17)
      mm.add("(min-width: 900px) and (min-height: 580px)", () => {
        const stage = mosaicStageRef.current;
        const pinEl = mosaicPinRef.current;
        const bannerCard = bannerCardRef.current;
        const centerSlot = portraitSlotRef.current;
        if (!stage || !pinEl || !bannerCard || !centerSlot) return;

        const dockWrap = pinEl.querySelector<HTMLElement>(".dock-bar-wrap");
        const mosaicTiles = gsap.utils.toArray<HTMLElement>(".mosaic-surround-tile", pinEl);

        // Set initial wide banner state anchored centered directly beneath dock
        const setInitialBanner = () => {
          const w = pinEl.clientWidth || 1440;
          const h = pinEl.clientHeight || 900;
          gsap.set(bannerCard, {
            x: 0,
            y: Math.min(84, h * 0.085),
            width: Math.min(960, w * 0.74),
            height: Math.min(340, h * 0.39),
            borderRadius: "24px",
            scale: 1,
          });
        };

        setInitialBanner();
        gsap.set(mosaicTiles, { opacity: 0, scale: 0.84 });

        const computeCenterSlotDelta = () => {
          const pinRect = pinEl.getBoundingClientRect();
          const slotRect = centerSlot.getBoundingClientRect();
          return {
            x: slotRect.left + slotRect.width / 2 - (pinRect.left + pinRect.width / 2),
            y: slotRect.top + slotRect.height / 2 - (pinRect.top + pinRect.height / 2),
            width: slotRect.width,
            height: slotRect.height,
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

        // 0.00 -> 0.25: Dock moves smoothly upward out; Wide Banner begins expanding centrally
        tl.to(
          dockWrap,
          { y: -90, opacity: 0, duration: 0.25, ease: "power2.in" },
          0
        )
          // 0.14 -> 0.68: Exact Banner contracts width, increases relative height into the tall Portrait Featured Card!
          .fromTo(
            bannerCard,
            {
              x: 0,
              y: () => Math.min(84, (pinEl.clientHeight || 900) * 0.085),
              width: () => Math.min(960, (pinEl.clientWidth || 1440) * 0.74),
              height: () => Math.min(340, (pinEl.clientHeight || 900) * 0.39),
              borderRadius: "24px",
              scale: 1,
            },
            {
              x: () => computeCenterSlotDelta().x,
              y: () => computeCenterSlotDelta().y,
              width: () => computeCenterSlotDelta().width,
              height: () => computeCenterSlotDelta().height,
              borderRadius: "22px",
              duration: 0.56,
              ease: "power3.inOut",
            },
            0.14
          )
          // 0.36 -> 0.76: 12 surrounding mosaic tiles emerge cleanly on both flanks
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
          );
      });

      // 3. Three Real My3 Pillar Cascade Split Section (Section 18)
      if (pillarsRef.current) {
        const cards = gsap.utils.toArray<HTMLElement>(".pillar-cascade-card", pillarsRef.current);
        gsap.fromTo(
          cards,
          {
            y: (i: number) => 44 + i * 16,
            rotation: (i: number) => -3 + i * 2.5,
            opacity: 0,
          },
          {
            y: 0,
            rotation: 0,
            opacity: 1,
            stagger: 0.12,
            duration: 0.75,
            ease: "power3.out",
            scrollTrigger: {
              trigger: pillarsRef.current,
              start: "top 78%",
              once: true,
            },
          }
        );
      }

      // 4. Closing CTA Cards Reveal (Section 20)
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

  // Calm Bounded Matter.js Physics Pills inside Deep-Blue Kinetic Band (Wheel pass-through safe!)
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

        const width = container.clientWidth || 1000;
        const height = container.clientHeight || 190;

        const engine = Matter.Engine.create({
          gravity: { x: 0, y: 0.42, scale: 0.001 },
        });

        const walls = [
          Matter.Bodies.rectangle(width / 2, height + 24, width + 100, 48, { isStatic: true }),
          Matter.Bodies.rectangle(width / 2, -24, width + 100, 48, { isStatic: true }),
          Matter.Bodies.rectangle(-24, height / 2, 48, height + 100, { isStatic: true }),
          Matter.Bodies.rectangle(width + 24, height / 2, 48, height + 100, { isStatic: true }),
        ];

        const pillNodes = Array.from(
          container.querySelectorAll<HTMLElement>(".physics-pill-node")
        );
        const bodies = pillNodes.map((node, i) => {
          const w = node.offsetWidth || 128;
          const h = node.offsetHeight || 40;
          const cols = Math.max(4, Math.floor(width / 160));
          const col = i % cols;
          const row = Math.floor(i / cols);
          const x = ((col + 0.5) / cols) * width;
          const y = 32 + row * 48;
          return Matter.Bodies.rectangle(x, y, w, h, {
            restitution: 0.45,
            friction: 0.25,
            frictionAir: 0.03,
            chamfer: { radius: 18 },
            angle: (i % 2 === 0 ? -1 : 1) * 0.05,
          });
        });

        Matter.World.add(engine.world, [...walls, ...bodies]);

        const mouse = Matter.Mouse.create(container);
        // Remove Matter's wheel hijacking so page smooth scrolling never jams
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
          constraint: { stiffness: 0.18, render: { visible: false } },
        });
        Matter.World.add(engine.world, mouseConstraint);

        let running = false;
        const step = () => {
          if (stopped || !running) return;
          Matter.Engine.update(engine, 1000 / 60);
          bodies.forEach((body, idx) => {
            const el = pillNodes[idx];
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
          { threshold: 0.05 }
        );
        observer.observe(container);

        cleanupMatter = () => {
          running = false;
          cancelAnimationFrame(rafId);
          Matter.World.clear(engine.world, false);
          Matter.Engine.clear(engine);
        };
      } catch {
        // Fallback: CSS flex layout handles pills cleanly
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
      {/* SECTION 14: STAGGERED 2-COLUMN EDITORIAL BENTO (Reference 00:23.8–00:28.3) */}
      <section
        ref={bentoRef}
        data-reel-scene="bento"
        className="relative z-10 mx-auto max-w-[1440px] px-5 py-20 sm:px-8 md:px-14 lg:px-20 lg:py-28"
        aria-label="Execution Methodology and Editorial Showcase"
      >
        <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">
              How We Work · Approach &amp; Process
            </span>
            <h2 className="mt-2 max-w-[18ch] text-[clamp(2rem,3.8vw,3.5rem)] font-semibold leading-[1.03] tracking-[-0.02em] text-white">
              Strategy, Craft &amp; Execution Under One Roof
            </h2>
          </div>
          <p className="max-w-[42ch] text-sm leading-relaxed text-[#A3ACBC]">
            Grounded in business research, structured UX, and continuous conversion testing across
            every launch.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:gap-8">
          {/* Left Column */}
          <div className="flex flex-col gap-6 lg:gap-8">
            {/* Wide Bento Card 1 */}
            <article className="bento-left-card overflow-hidden rounded-2xl border border-white/10 bg-[#10141D]">
              <div className="aspect-[16/10] overflow-hidden">
                <img
                  src={bentoEditorialArticles[0]?.image ?? "/insights/premium-websites-that-convert.jpg"}
                  alt={approach[0]![0]}
                  className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
              <div className="p-6">
                <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-blue-400">
                  01 · {approach[0]![0]}
                </span>
                <h3 className="mt-2 text-xl font-semibold text-white">
                  {bentoEditorialArticles[0]?.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#A3ACBC]">{approach[0]![1]}</p>
              </div>
            </article>

            {/* Portrait-leaning Bento Card 2 */}
            <article className="bento-left-card overflow-hidden rounded-2xl border border-white/10 bg-[#10141D]">
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={
                    bentoEditorialArticles[2]?.image ??
                    "/insights/website-branding-and-marketing-working-together.jpg"
                  }
                  alt={process[1]![0]}
                  className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
              <div className="p-6">
                <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-blue-400">
                  02 · {process[1]![0]} &amp; {approach[2]![0]}
                </span>
                <h3 className="mt-2 text-xl font-semibold text-white">{approach[2]![0]}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#A3ACBC]">{approach[2]![1]}</p>
              </div>
            </article>
          </div>

          {/* Right Offset Staggered Column */}
          <div className="bento-right-col flex flex-col gap-6 md:mt-16 lg:gap-8">
            <article className="bento-right-card overflow-hidden rounded-2xl border border-white/10 bg-[#10141D]">
              <div className="aspect-[4/4.3] overflow-hidden">
                <img
                  src="/insights/when-to-redesign-your-website.jpg"
                  alt={approach[1]![0]}
                  className="h-full w-full object-cover object-center transition-transform duration-700 hover:scale-105"
                />
              </div>
              <div className="p-6">
                <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-blue-400">
                  03 · {approach[1]![0]}
                </span>
                <h3 className="mt-2 text-xl font-semibold text-white">
                  {bentoEditorialArticles[1]?.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#A3ACBC]">{approach[1]![1]}</p>
              </div>
            </article>

            <article className="bento-right-card overflow-hidden rounded-2xl border border-blue-400/20 bg-gradient-to-br from-[#10141D] to-[#142B4A]/45 p-7">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-blue-300">
                  04 · {process[4]![0]} &amp; {approach[4]![0]}
                </span>
                <Sparkles aria-hidden="true" className="size-4 text-blue-400" />
              </div>
              <h3 className="text-2xl font-semibold text-white">{approach[4]![0]}</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-300">{approach[4]![1]}</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {process.map(([stepName]) => (
                  <span
                    key={stepName}
                    className="rounded-full border border-white/15 bg-[#080B12]/70 px-3 py-1 text-xs font-medium text-slate-200"
                  >
                    {stepName}
                  </span>
                ))}
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* SECTION 15: HORIZONTAL SERVICE CATEGORY CAROUSEL (Reference 00:28.3–00:30.8) */}
      <section
        ref={carouselSectionRef}
        data-reel-scene="carousel"
        className="relative z-10 border-y border-white/8 bg-[#0B0F19]/80 py-18 lg:py-24"
        aria-label="Service Tracks Horizontal Showcase"
      >
        <div className="mx-auto mb-8 flex max-w-[1440px] flex-wrap items-end justify-between gap-4 px-5 sm:px-8 md:px-14 lg:px-20">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">
              Focused Disciplines
            </span>
            <h2 className="mt-2 text-[clamp(1.85rem,3.2vw,3rem)] font-semibold tracking-[-0.03em] text-white">
              Capability Tracks
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden h-1.5 w-28 overflow-hidden rounded-full bg-white/10 sm:block">
              <div
                className="h-full rounded-full bg-blue-500 transition-all duration-300"
                style={{ width: `${((carouselIndex + 1) / CAROUSEL_ITEMS.length) * 100}%` }}
              />
            </div>
            <button
              type="button"
              aria-label="Previous capability card"
              onClick={() => scrollCarouselBy(-1)}
              className="flex size-10 items-center justify-center rounded-full border border-white/15 bg-[#10141D] text-white transition hover:border-blue-400/50 hover:bg-[#142B4A]"
            >
              <ArrowLeft aria-hidden="true" className="size-4" />
            </button>
            <button
              type="button"
              aria-label="Next capability card"
              onClick={() => scrollCarouselBy(1)}
              className="flex size-10 items-center justify-center rounded-full border border-white/15 bg-[#10141D] text-white transition hover:border-blue-400/50 hover:bg-[#142B4A]"
            >
              <ArrowRight aria-hidden="true" className="size-4" />
            </button>
          </div>
        </div>

        <div
          ref={carouselTrackRef}
          className="no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-2 sm:px-8 md:px-14 lg:px-20"
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
              className="group relative w-[275px] shrink-0 snap-start overflow-hidden rounded-2xl border border-white/12 bg-[#10141D] text-left transition hover:border-blue-400/45 sm:w-[320px]"
            >
              <div className="aspect-[16/11] overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between text-[11px] font-medium uppercase tracking-wider text-blue-400">
                  <span>{item.category}</span>
                  <span>{item.handle}</span>
                </div>
                <h3 className="mt-1.5 text-lg font-semibold text-white">{item.title}</h3>
                <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-[#A3ACBC]">
                  {item.subtitle}
                </p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* SECTION 16 & 17: INTERACTIVE DOCK -> SHARED-ELEMENT WIDE BANNER TO PORTRAIT CARD & 12-TILE MOSAIC (Reference 00:30.8–00:34.6) */}
      <section
        ref={mosaicStageRef}
        data-reel-scene="mosaic"
        className="relative z-10 w-full min-[900px]:min-h-[255vh]"
        aria-label="Interactive Capability Dock and Visual Service Mosaic"
      >
        <div className="w-full">
          <div
            ref={mosaicPinRef}
            className="relative flex w-full flex-col items-center justify-center overflow-hidden px-5 py-16 sm:px-8 md:px-14 lg:px-20 min-[900px]:h-screen min-[900px]:pt-[88px] min-[900px]:pb-8"
          >
          {/* Section 16 Interactive MacOS-Inspired Dock (Exits cleanly as Banner expands into Mosaic) */}
          <div className="dock-bar-wrap relative z-30 mb-8 flex flex-col items-center min-[900px]:absolute min-[900px]:top-[104px]">
            <span className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-blue-400">
              Select Core Pillar · Click to Preview Featured Showcase
            </span>
            <div className="flex items-center gap-2 rounded-2xl border border-white/15 bg-[#10141D]/95 p-2 shadow-2xl backdrop-blur-lg sm:gap-3">
              {DOCK_CAPABILITIES.map(({ id, label, Icon }, idx) => {
                const isSelected = dockActiveIdx === idx;
                const dist = hoveredDockIdx === null ? (isSelected ? 0 : 2) : Math.abs(hoveredDockIdx - idx);
                const scale = dist === 0 ? 1.18 : dist === 1 ? 1.07 : 1;
                return (
                  <button
                    key={id}
                    type="button"
                    aria-label={`Feature ${label}`}
                    onMouseEnter={() => setHoveredDockIdx(idx)}
                    onMouseLeave={() => setHoveredDockIdx(null)}
                    onClick={() => setDockActiveIdx(idx)}
                    style={{ transform: reduceMotion ? undefined : `scale(${scale})` }}
                    className={`flex flex-col items-center justify-center rounded-xl px-3 py-2 transition-all duration-200 focus-visible:outline-2 focus-visible:outline-blue-400 ${
                      isSelected
                        ? "bg-[#2456A4] text-white shadow-lg shadow-blue-950/60"
                        : "bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <Icon aria-hidden="true" className="size-5" />
                    <span className="mt-1 hidden text-[10px] font-medium sm:block">{label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Mosaic Layout Target Scaffolding on Desktop: 6 Left Tiles + Center Portrait Slot + 6 Right Tiles */}
          <div className="relative z-10 hidden w-full max-w-[1380px] grid-cols-[1fr_minmax(220px,270px)_1fr] items-center gap-4 min-[900px]:grid lg:gap-5">
            {/* Left 2x3 Mosaic Cluster (6 tiles) */}
            <div className="grid grid-cols-3 gap-3.5 lg:gap-4">
              {leftMosaicCards.map((tile) => (
                <button
                  key={tile.id}
                  type="button"
                  onClick={() => {
                    onSelectDivision(tile.slug);
                    scrollToSectionId("divisions-directory");
                  }}
                  className="mosaic-surround-tile group relative aspect-[4/4.2] overflow-hidden rounded-2xl border border-white/12 bg-[#10141D] text-left shadow-lg transition hover:border-blue-400/50"
                >
                  <img
                    src={tile.image}
                    alt={tile.title}
                    style={{ objectPosition: tile.focalPosition ?? "center" }}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#080B12]/90 via-transparent to-transparent" />
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 p-2.5">
                    <span className="block truncate text-[11px] font-semibold text-white">
                      {tile.title}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            {/* Center Tall Portrait Slot (Destination of the Wide Rounded Banner transformation!) */}
            <div
              ref={portraitSlotRef}
              aria-hidden="true"
              className="aspect-[3/4.15] w-full rounded-[22px] border border-transparent"
            />

            {/* Right 2x3 Mosaic Cluster (6 tiles) */}
            <div className="grid grid-cols-3 gap-3.5 lg:gap-4">
              {rightMosaicCards.map((tile) => (
                <button
                  key={tile.id}
                  type="button"
                  onClick={() => {
                    onSelectDivision(tile.slug);
                    scrollToSectionId("divisions-directory");
                  }}
                  className="mosaic-surround-tile group relative aspect-[4/4.2] overflow-hidden rounded-2xl border border-white/12 bg-[#10141D] text-left shadow-lg transition hover:border-blue-400/50"
                >
                  <img
                    src={tile.image}
                    alt={tile.title}
                    style={{ objectPosition: tile.focalPosition ?? "center" }}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#080B12]/90 via-transparent to-transparent" />
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 p-2.5">
                    <span className="block truncate text-[11px] font-semibold text-white">
                      {tile.title}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* THE SHARED TRANSFORMING ELEMENT: Starts as Wide Rounded Banner -> Contracts Width & Deepens Into Tall Centered Portrait Card */}
          <div className="pointer-events-none absolute inset-0 hidden items-center justify-center min-[900px]:flex">
            <button
              ref={bannerCardRef}
              type="button"
              onClick={() => {
                onSelectDivision(featuredCard.slug);
                scrollToSectionId("divisions-directory");
              }}
              aria-label={`Explore ${featuredCard.title}`}
              className="group pointer-events-auto relative z-20 overflow-hidden rounded-[22px] border border-blue-400/35 bg-[#10141D] text-left shadow-[0_32px_90px_-16px_rgba(20,43,74,0.85)] transition-[border-color] duration-300 hover:border-blue-400 focus-visible:outline-2 focus-visible:outline-blue-300"
            >
              <img
                src={featuredCard.image}
                alt={featuredCard.title}
                style={{ objectPosition: featuredCard.focalPosition ?? "center" }}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#080B12] via-[#080B12]/25 to-transparent" />
              <span className="absolute top-3.5 left-3.5 rounded-full border border-blue-400/35 bg-[#142B4A]/90 px-3 py-1 text-[11px] font-semibold text-blue-100 backdrop-blur-md">
                {featuredCard.handle}
              </span>
              <div className="pointer-events-none absolute inset-x-0 bottom-0 p-4 sm:p-5">
                <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-blue-300">
                  {featuredCard.category}
                </span>
                <h3 className="mt-1 text-lg font-semibold leading-tight text-white sm:text-xl">
                  {featuredCard.title}
                </h3>
                <p className="mt-1 line-clamp-2 text-xs text-slate-300">{featuredCard.subtitle}</p>
              </div>
            </button>
          </div>

          {/* Featured Card & Compact Grid Fallback below Dock on Mobile (< 900px) */}
          <div className="mt-2 w-full space-y-4 min-[900px]:hidden">
            <button
              type="button"
              onClick={() => {
                onSelectDivision(featuredCard.slug);
                scrollToSectionId("divisions-directory");
              }}
              className="relative h-[250px] w-full overflow-hidden rounded-2xl border border-blue-400/35 bg-[#10141D] text-left shadow-xl"
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
              {surroundingMosaicCards.slice(0, 6).map((tile) => (
                <button
                  key={tile.id}
                  type="button"
                  onClick={() => {
                    onSelectDivision(tile.slug);
                    scrollToSectionId("divisions-directory");
                  }}
                  className="relative aspect-[4/3.6] overflow-hidden rounded-xl border border-white/10 bg-[#10141D] text-left"
                >
                  <img src={tile.image} alt={tile.title} className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#080B12]/90 via-transparent to-transparent" />
                  <span className="absolute inset-x-2.5 bottom-2.5 truncate text-xs font-semibold text-white">
                    {tile.title}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
        </div>
      </section>

      {/* SECTION 18: 3 REAL MY3 PILLAR OFFERINGS SPLIT SECTION (Zero invented pricing!) (Reference 00:34.6–00:37.3) */}
      <section
        ref={pillarsRef}
        data-reel-scene="tiers"
        className="relative z-10 mx-auto max-w-[1440px] px-5 py-20 sm:px-8 md:px-14 lg:px-20 lg:py-28"
        aria-label="Three Core Agency Pillars"
      >
        <div className="grid items-center gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">
              How My3 Partners With You
            </span>
            <h2 className="mt-3 max-w-[15ch] text-[clamp(2rem,3.6vw,3.4rem)] font-semibold leading-[1.03] tracking-[-0.03em] text-white">
              Focused Pillars. Measurable Scope.
            </h2>
            <p className="mt-4 max-w-[42ch] text-sm leading-relaxed text-[#A3ACBC] sm:text-base">
              Engage My3 Digital for a dedicated website architecture, a complete brand overhaul, or
              an integrated acquisition and CRM automation engine — tailored transparently to project
              scope.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-[#2456A4] px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-600"
              >
                Discuss Your Scope
                <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-3 lg:col-span-7">
            {pillarOfferings.map((pillar) => (
              <button
                key={pillar.index}
                type="button"
                onClick={() => {
                  onSelectDivision(pillar.divisionSlug);
                  scrollToSectionId("divisions-directory");
                }}
                className="pillar-cascade-card group flex flex-col justify-between rounded-2xl border border-blue-400/20 bg-gradient-to-b from-[#142B4A]/55 to-[#10141D] p-6 text-left shadow-2xl transition hover:border-blue-400/55"
              >
                <div>
                  <div className="mb-4 flex items-center justify-between">
                    <span className="font-mono text-xs font-semibold text-blue-300">
                      Pillar {pillar.index}
                    </span>
                    <ChevronRight
                      aria-hidden="true"
                      className="size-4 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-blue-300"
                    />
                  </div>
                  <span className="text-[11px] font-medium uppercase tracking-wider text-blue-400">
                    {pillar.eyebrow}
                  </span>
                  <h3 className="mt-1.5 text-xl font-semibold text-white">{pillar.title}</h3>
                  <p className="mt-3 text-xs leading-relaxed text-[#A3ACBC]">{pillar.summary}</p>
                </div>

                <div className="mt-6 border-t border-white/10 pt-3.5 text-[11px] font-medium text-blue-200/90">
                  {pillar.scope}
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 19 & 20: DEEP-BLUE KINETIC WATERMARK + PHYSICS FLOOR + DUAL CTA CARDS (Reference 00:37.3–00:43) */}
      <section
        ref={closingRef}
        data-reel-scene="closing"
        className="relative z-10 mx-auto max-w-[1440px] px-5 pb-24 sm:px-8 md:px-14 lg:px-20"
        aria-label="Kinetic Capabilities Showcase and Project Call To Action"
      >
        {/* Deep-Blue Kinetic Marquee with Subtle Watermark & Bounded Interactive Physics Badges */}
        <div className="relative overflow-hidden rounded-3xl border border-blue-400/25 bg-gradient-to-b from-[#102242] to-[#081226] py-14 shadow-[0_36px_100px_-24px_rgba(14,32,68,0.75)]">
          {/* Very Subtle Watermark Typography */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 select-none text-center text-[clamp(4.5rem,13vw,11rem)] font-bold tracking-tighter text-white opacity-[0.045]"
          >
            MY3 DIGITAL
          </div>

          {/* Crisp Foreground Kinetic Headline Stream */}
          <div className="relative z-10 overflow-hidden py-4">
            <div
              className="flex w-max items-center gap-10"
              style={{
                animation: reduceMotion ? "none" : "marquee-scroll 28s linear infinite",
              }}
            >
              {[0, 1, 2, 3].map((dup) => (
                <div key={dup} className="flex items-center gap-8">
                  <span className="text-[clamp(2rem,4vw,3.4rem)] font-semibold tracking-[-0.03em] text-white">
                    One partner. Every possibility in digital.
                  </span>
                  <span className="inline-flex size-10 items-center justify-center rounded-full border border-blue-400/35 bg-[#2456A4]/50 text-blue-200">
                    <Sparkles aria-hidden="true" className="size-4" />
                  </span>
                  <span className="text-[clamp(1.75rem,3.4vw,2.9rem)] font-semibold tracking-[-0.03em] text-blue-300">
                    Strategy · Design · Engineering · Growth
                  </span>
                  <span className="inline-flex size-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white">
                    <Layers aria-hidden="true" className="size-4" />
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Calm Interactive Bounded Physics Badges */}
          <div
            ref={kineticBoxRef}
            className="relative z-10 mx-auto mt-6 h-[170px] w-full max-w-[1140px] px-4 select-none"
          >
            {PHYSICS_BADGES.map((label) => (
              <div
                key={label}
                className={`${
                  reduceMotion
                    ? "m-1.5 inline-flex"
                    : "physics-pill-node absolute top-0 left-0 cursor-grab active:cursor-grabbing"
                } items-center rounded-full border border-blue-300/30 bg-[#142B4A]/90 px-4 py-2 text-xs font-semibold text-white shadow-lg backdrop-blur-sm`}
              >
                {label}
              </div>
            ))}
          </div>
        </div>

        {/* Section 20: Dual Contrasting Closing CTA Cards */}
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <Link
            to="/contact"
            className="closing-cta-card group flex flex-col justify-between rounded-3xl border border-blue-400/30 bg-gradient-to-br from-[#142B4A] to-[#2456A4] p-8 text-white shadow-2xl transition hover:border-blue-300/60 sm:p-10"
          >
            <div className="flex items-center justify-between">
              <span className="rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider">
                Start a Conversation
              </span>
              <ArrowUpRight
                aria-hidden="true"
                className="size-6 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
              />
            </div>
            <div className="mt-10">
              <h3 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                Launch Your Next Digital Initiative
              </h3>
              <p className="mt-2 max-w-[44ch] text-sm leading-relaxed text-blue-100/90">
                Connect with our Hyderabad or Bangalore teams ({contact.phone}) for tailored project
                architecture and growth planning.
              </p>
            </div>
          </Link>

          <Link
            to="/work"
            className="closing-cta-card group flex flex-col justify-between rounded-3xl border border-white/12 bg-[#10141D] p-8 text-white shadow-2xl transition hover:border-blue-400/45 sm:p-10"
          >
            <div className="flex items-center justify-between">
              <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-blue-300">
                Selected Client Launches
              </span>
              <ArrowUpRight
                aria-hidden="true"
                className="size-6 text-blue-400 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
              />
            </div>
            <div className="mt-10">
              <h3 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                Explore Our Website &amp; Digital Portfolio
              </h3>
              <p className="mt-2 max-w-[44ch] text-sm leading-relaxed text-[#A3ACBC]">
                Review live digital experiences crafted for brands across technology, commerce, real
                estate, healthcare, and enterprise.
              </p>
            </div>
          </Link>
        </div>
      </section>
    </>
  );
}
