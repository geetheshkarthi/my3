import { Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight, Layers, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { divisions } from "@/content/site";
import { ensureGsapRegistered, gsap, scrollToSectionId } from "./gsapMotion";
import {
  divisionTabLabels,
  heroServiceCards,
  platformCapabilities,
  serviceSpotlights,
} from "./servicesData";

type HeroToServicesFlipSectionProps = {
  reduceMotion: boolean;
  onSelectDivision: (slug: string) => void;
};

const HERO_HEADLINE_WORDS = ["Digital", "systems", "built", "to", "convert", "and", "scale."];

export function HeroToServicesFlipSection({
  reduceMotion,
  onSelectDivision,
}: HeroToServicesFlipSectionProps) {
  const heroStageRef = useRef<HTMLDivElement>(null);
  const heroPinRef = useRef<HTMLDivElement>(null);
  const spotlightSectionRef = useRef<HTMLElement>(null);
  const spotlightFrameRef = useRef<HTMLDivElement>(null);
  const spotlightImgRef = useRef<HTMLImageElement>(null);
  const spotlightOverlayRef = useRef<HTMLDivElement>(null);
  const platformsRef = useRef<HTMLElement>(null);

  const [activeSpotlight, setActiveSpotlight] = useState(0);
  const [replayNonce, setReplayNonce] = useState(0);

  const currentSpotlight = serviceSpotlights[activeSpotlight] ?? serviceSpotlights[0]!;

  // GSAP Entrance + Pinned Shared-Element Hero -> Overview + Spotlight Parallax
  useEffect(() => {
    if (reduceMotion) return;
    ensureGsapRegistered();

    const stage = heroStageRef.current;
    const pinEl = heroPinRef.current;
    if (!stage || !pinEl) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // 1. Entrance animation on inner `.hero-card-intro` (separated cleanly from outer `.hero-shared-card` scroll transforms)
      const heroWords = gsap.utils.toArray<HTMLElement>(".hero-word", pinEl);
      const heroMeta = gsap.utils.toArray<HTMLElement>(".hero-entrance-meta", pinEl);
      const heroPills = gsap.utils.toArray<HTMLElement>(".hero-float-pill", pinEl);
      const cards = gsap.utils.toArray<HTMLElement>(".hero-shared-card", pinEl);
      const cardIntros = gsap.utils.toArray<HTMLElement>(".hero-card-intro", pinEl);
      const floatInners = gsap.utils.toArray<HTMLElement>(".hero-card-float", pinEl);

      // Compute viewport-safe spread radius
      const getFanGeometry = () => {
        const w = pinEl.clientWidth || window.innerWidth;
        const h = pinEl.clientHeight || window.innerHeight;
        const isDesktop = w >= 900 && h >= 580;
        const cardW = isDesktop ? Math.min(182, Math.max(132, w * 0.125)) : Math.min(118, w * 0.25);
        const cardH = cardW * 1.24;
        const spreadStep = isDesktop ? Math.min(118, (w * 0.72) / 6) : Math.min(46, w * 0.105);
        return { w, h, isDesktop, cardW, cardH, spreadStep };
      };

      const applyRestFanState = () => {
        const { cardW, cardH, spreadStep } = getFanGeometry();
        cards.forEach((card, i) => {
          const item = heroServiceCards[i]!;
          const centerOffset = i - 3;
          gsap.set(card, {
            width: cardW,
            height: cardH,
            x: centerOffset * spreadStep,
            y: item.heroY,
            rotation: item.heroRotate,
            scale: 1 - Math.abs(centerOffset) * 0.025,
            zIndex: 20 - Math.abs(centerOffset),
          });
        });
      };

      applyRestFanState();

      // Inner `.hero-card-intro` starts visually offset back to center stack, then fans out to (0, 0)
      const introTl = gsap.timeline({ defaults: { ease: "power3.out" } });
      introTl
        .fromTo(
          heroWords,
          { y: 28, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.62, stagger: 0.05 },
          0.06
        )
        .fromTo(
          cardIntros,
          {
            opacity: 0,
            scale: 0.86,
            x: (i: number) => -(i - 3) * getFanGeometry().spreadStep * 0.85,
            y: 38,
            rotation: (i: number) => -heroServiceCards[i]!.heroRotate * 0.85,
          },
          {
            opacity: 1,
            scale: 1,
            x: 0,
            y: 0,
            rotation: 0,
            duration: 0.9,
            stagger: { each: 0.04, from: "center" },
            ease: "expo.out",
          },
          0.18
        )
        .fromTo(
          heroPills,
          { opacity: 0, scale: 0.85, y: 12 },
          { opacity: 1, scale: 1, y: 0, duration: 0.5, stagger: 0.1 },
          0.65
        )
        .fromTo(
          heroMeta,
          { y: 16, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.55, stagger: 0.08 },
          0.56
        );

      // Subtle continuous idle float on innermost wrapper
      floatInners.forEach((inner, i) => {
        gsap.to(inner, {
          y: i % 2 === 0 ? -4 : 4,
          duration: 3.1 + (i % 3) * 0.45,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: i * 0.18,
        });
      });

      // 2. Desktop / Laptop Pinned Shared-Element Morph: Hero Fan -> Compact Deck -> Right Descending Diagonal
      mm.add("(min-width: 900px) and (min-height: 580px)", () => {
        const heroCopyGroup = pinEl.querySelector<HTMLElement>(".hero-copy-group");
        const heroCtaGroup = pinEl.querySelector<HTMLElement>(".hero-cta-group");
        const overviewPanel = pinEl.querySelector<HTMLElement>(".overview-left-panel");
        const overviewItems = gsap.utils.toArray<HTMLElement>(".overview-stagger", pinEl);
        const overviewBadges = gsap.utils.toArray<HTMLElement>(".overview-float-badge", pinEl);

        gsap.set(overviewPanel, { opacity: 0, pointerEvents: "none" });
        gsap.set(overviewItems, { y: 26, opacity: 0 });
        gsap.set(overviewBadges, { scale: 0.82, opacity: 0 });

        const scrollTl = gsap.timeline({
          scrollTrigger: {
            trigger: stage,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.72,
            pin: pinEl,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onEnter: () => introTl.progress(1),
          },
        });

        // Phase A (0.0 -> 0.36): Hero copy exits up; 7 fanned cards pull tightly into center compact deck
        scrollTl
          .to(
            heroCopyGroup,
            { y: -88, opacity: 0, ease: "power2.in", duration: 0.32 },
            0
          )
          .to(
            heroCtaGroup,
            { y: -56, opacity: 0, ease: "power2.in", duration: 0.28 },
            0
          )
          .to(
            heroPills,
            { scale: 0.8, opacity: 0, duration: 0.22 },
            0
          )
          .fromTo(
            cards,
            {
              x: (i: number) => (i - 3) * getFanGeometry().spreadStep,
              y: (i: number) => heroServiceCards[i]!.heroY,
              rotation: (i: number) => heroServiceCards[i]!.heroRotate,
              scale: (i: number) => 1 - Math.abs(i - 3) * 0.025,
            },
            {
              x: (i: number) => (i - 3) * 3,
              y: (i: number) => -Math.abs(i - 3) * 2 + (i - 3) * 1.5,
              rotation: (i: number) => ((i % 2 === 0 ? -1 : 1) * (3 - Math.abs(i - 3)) * 1.1),
              scale: (i: number) => (i === 3 ? 1.02 : 0.94 - Math.abs(i - 3) * 0.015),
              duration: 0.36,
              ease: "power2.inOut",
            },
            0
          )
          // Phase B (0.36 -> 0.62): Compact deck glides rightward across viewport
          .to(
            cards,
            {
              x: (i: number) => {
                const { w } = getFanGeometry();
                const rightAnchor = Math.min(280, w * 0.205);
                return rightAnchor + (i - 3) * 4;
              },
              y: (i: number) => -24 + (i - 3) * 2,
              rotation: (i: number) => (i - 3) * 1.4,
              duration: 0.26,
              ease: "power2.inOut",
            },
            0.36
          )
          // Enable left overview panel container & stagger eyebrow + headline in during glide
          .to(
            overviewPanel,
            { opacity: 1, pointerEvents: "auto", duration: 0.08 },
            0.44
          )
          .to(
            overviewItems.slice(0, 2),
            { y: 0, opacity: 1, stagger: 0.06, duration: 0.22, ease: "power3.out" },
            0.48
          )
          // Phase C (0.62 -> 1.0): Deck fans out along right-hand descending diagonal arc
          .to(
            cards,
            {
              x: (i: number) => {
                const { w } = getFanGeometry();
                const rightAnchor = Math.min(265, w * 0.195);
                // Descending staircase/arc spanning cleanly inside right half
                return rightAnchor + (i - 3) * Math.min(46, w * 0.032);
              },
              y: (i: number) => (i - 3) * 34 - 8,
              rotation: (i: number) => -10 + i * 3.4,
              scale: (i: number) => 0.88 + (i === 3 || i === 4 ? 0.14 : i * 0.015),
              duration: 0.38,
              ease: "power3.out",
            },
            0.62
          )
          .to(
            overviewItems.slice(2),
            { y: 0, opacity: 1, stagger: 0.07, duration: 0.24, ease: "power3.out" },
            0.66
          )
          .to(
            overviewBadges,
            { scale: 1, opacity: 1, stagger: 0.06, duration: 0.2, ease: "back.out(1.4)" },
            0.76
          );
      });

      // 3. Featured Spotlight Reveal & Scroll Parallax (Section 8)
      if (spotlightSectionRef.current && spotlightFrameRef.current && spotlightImgRef.current) {
        const spotHeading = gsap.utils.toArray<HTMLElement>(".spotlight-reveal", spotlightSectionRef.current);
        gsap.fromTo(
          spotHeading,
          { y: 26, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.07,
            duration: 0.7,
            ease: "power3.out",
            scrollTrigger: {
              trigger: spotlightSectionRef.current,
              start: "top 82%",
              once: true,
            },
          }
        );

        gsap.fromTo(
          spotlightFrameRef.current,
          {
            y: 52,
            scale: 0.94,
            opacity: 0.25,
            clipPath: "inset(6% 4% 6% 4% round 22px)",
          },
          {
            y: 0,
            scale: 1,
            opacity: 1,
            clipPath: "inset(0% 0% 0% 0% round 20px)",
            ease: "power2.out",
            scrollTrigger: {
              trigger: spotlightFrameRef.current,
              start: "top 92%",
              end: "top 34%",
              scrub: 0.6,
            },
          }
        );

        gsap.fromTo(
          spotlightImgRef.current,
          { yPercent: -6, scale: 1.1 },
          {
            yPercent: 6,
            scale: 1.06,
            ease: "none",
            scrollTrigger: {
              trigger: spotlightFrameRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      }

      // 4. Platforms & Credibility Band Reveal (Section 9)
      if (platformsRef.current) {
        const platItems = gsap.utils.toArray<HTMLElement>(".platform-reveal", platformsRef.current);
        gsap.fromTo(
          platItems,
          { y: 24, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.08,
            duration: 0.65,
            ease: "power3.out",
            scrollTrigger: {
              trigger: platformsRef.current,
              start: "top 85%",
              once: true,
            },
          }
        );
      }
    }, stage.parentElement ?? stage);

    return () => ctx.revert();
  }, [reduceMotion, replayNonce]);

  const handleSelectSpotlight = (idx: number) => {
    if (idx === activeSpotlight) return;
    if (!reduceMotion && spotlightOverlayRef.current) {
      gsap.fromTo(
        spotlightOverlayRef.current,
        { clipPath: "inset(0 100% 0 0)" },
        {
          clipPath: "inset(0 0% 0 0)",
          duration: 0.28,
          ease: "power2.inOut",
          onComplete: () => {
            setActiveSpotlight(idx);
            gsap.to(spotlightOverlayRef.current, {
              clipPath: "inset(0 0% 0 100%)",
              duration: 0.38,
              ease: "power2.out",
            });
          },
        }
      );
    } else {
      setActiveSpotlight(idx);
    }
  };

  return (
    <>
      {/* SECTION 6 & 7: PINNED SHARED-ELEMENT HERO FAN -> COMPACT DECK -> RIGHT DESCENDING DIAGONAL OVERVIEW */}
      <section
        ref={heroStageRef}
        data-reel-scene="hero"
        className="relative z-10 w-full min-[900px]:min-h-[245vh]"
        aria-label="Digital Services Overview"
      >
        <div className="w-full">
          <div
            ref={heroPinRef}
            className="relative flex w-full flex-col justify-between overflow-hidden px-5 pt-[88px] pb-12 sm:px-8 md:px-14 lg:px-20 min-[900px]:h-screen min-[900px]:pt-[92px] min-[900px]:pb-10"
          >
          {/* Hidden hook for ServicesReel restart */}
          <button
            type="button"
            aria-label="Replay opening card animation"
            className="sr-only"
            onClick={() => setReplayNonce((n) => n + 1)}
          />

          {/* Centered Hero Headline */}
          <div className="hero-copy-group relative z-20 mx-auto max-w-4xl text-center">
            <div className="hero-entrance-meta mb-3 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-[#142B4A]/55 px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-blue-200">
              <Sparkles aria-hidden="true" className="size-3 text-blue-400" />
              5 Divisions · 37 Deliverables · Strategy to Execution
            </div>
            <h1 className="mx-auto max-w-[15ch] text-[clamp(2.35rem,4.7vw,4.55rem)] font-semibold leading-[0.98] tracking-[-0.02em] text-white">
              {HERO_HEADLINE_WORDS.map((word, idx) => (
                <span key={idx} className="hero-word inline-block mr-[0.24em] last:mr-0">
                  {word}
                </span>
              ))}
            </h1>
          </div>

          {/* Center / Shared-Element 7-Card Visual Arena */}
          <div className="relative z-10 my-4 flex min-h-[260px] w-full flex-1 items-center justify-center sm:min-h-[300px]">
            {/* Floating Hero Handles around fan */}
            <div className="pointer-events-none relative mx-auto flex h-full w-full max-w-[1060px] items-center justify-center">
              <span className="hero-float-pill absolute top-2 left-[14%] z-30 hidden rounded-full border border-blue-400/30 bg-[#142B4A]/90 px-3 py-1 text-xs font-medium text-blue-100 shadow-lg backdrop-blur-md md:inline-flex">
                @webcraft
              </span>
              <span className="hero-float-pill absolute right-[13%] bottom-4 z-30 hidden rounded-full border border-blue-400/30 bg-[#10141D]/90 px-3 py-1 text-xs font-medium text-blue-200 shadow-lg backdrop-blur-md md:inline-flex">
                @automation
              </span>

              {/* Overview phase floating handles attached beside descending diagonal */}
              <span className="overview-float-badge absolute top-[14%] right-[25%] z-30 hidden rounded-full border border-blue-400/30 bg-[#142B4A]/95 px-3 py-1 text-[11px] font-semibold text-blue-100 shadow-lg backdrop-blur-md min-[900px]:inline-flex">
                @webcraft
              </span>
              <span className="overview-float-badge absolute right-[8%] bottom-[16%] z-30 hidden rounded-full border border-white/15 bg-[#10141D]/95 px-3 py-1 text-[11px] font-medium text-slate-200 shadow-lg backdrop-blur-md min-[900px]:inline-flex">
                @uiux · 500+ Built
              </span>

              {/* The 7 Shared Cards (Fanned Center -> Compact Deck -> Descending Diagonal Right) */}
              {heroServiceCards.map((card, i) => (
                <button
                  key={card.id}
                  type="button"
                  onClick={() => {
                    onSelectDivision(card.slug);
                    scrollToSectionId("divisions-directory");
                  }}
                  aria-label={`${card.title} (${card.category}) — view capabilities`}
                  style={{
                    transformOrigin: "center bottom",
                    ...(reduceMotion
                      ? {
                          transform: `translate3d(${(i - 3) * 86}px, ${card.heroY}px, 0) rotate(${card.heroRotate}deg)`,
                          zIndex: 20 - Math.abs(i - 3),
                        }
                      : undefined),
                  }}
                  className="hero-shared-card group absolute w-[124px] h-[156px] sm:w-[144px] sm:h-[180px] min-[900px]:w-[164px] min-[900px]:h-[205px] rounded-2xl focus-visible:outline-2 focus-visible:outline-blue-400 cursor-pointer"
                >
                  <div className="hero-card-intro h-full w-full">
                    <div className="hero-card-float relative h-full w-full overflow-hidden rounded-2xl border border-white/15 bg-[#10141D] shadow-[0_22px_48px_-14px_rgba(0,0,0,0.75)] transition-[border-color,box-shadow] duration-300 group-hover:border-blue-400/60 group-hover:shadow-[0_24px_56px_-10px_rgba(36,86,164,0.45)]">
                      <img
                        src={card.image}
                        alt={card.title}
                        loading="eager"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#080B12]/90 via-[#080B12]/20 to-transparent" />
                      <div className="pointer-events-none absolute inset-x-0 bottom-0 p-2.5 text-left">
                        <span className="block text-[10px] font-medium uppercase tracking-wider text-blue-300/90">
                          {card.handle}
                        </span>
                        <span className="block truncate text-xs font-semibold text-white">
                          {card.title}
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Overview Left Panel (Reveals cleanly in second half of Stage 1 scroll, sits below Hero on mobile) */}
            <div className="overview-left-panel pointer-events-none absolute inset-y-0 left-0 z-20 hidden w-[46%] flex-col justify-center pr-6 min-[900px]:flex">
              <span className="overview-stagger mb-3 inline-flex w-fit items-center gap-2 rounded-full border border-blue-400/25 bg-[#142B4A]/65 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-blue-200">
                <Layers aria-hidden="true" className="size-3.5 text-blue-400" />
                {divisions[0]!.eyebrow}
              </span>
              <h2 className="overview-stagger max-w-[14ch] text-[clamp(2.1rem,3.6vw,3.45rem)] font-semibold leading-[1.02] tracking-[-0.02em] text-white">
                {divisions[0]!.heading}
              </h2>
              <p className="overview-stagger mt-4 max-w-[44ch] text-base leading-relaxed text-[#A3ACBC]">
                {divisions[0]!.intro[0]}
              </p>
              <div className="overview-stagger mt-6 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    onSelectDivision("website-development");
                    scrollToSectionId("divisions-directory");
                  }}
                  className="inline-flex items-center gap-2 rounded-full bg-[#2456A4] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-600 focus-visible:outline-2 focus-visible:outline-blue-300"
                >
                  Explore 8 Web Deliverables
                  <ArrowRight aria-hidden="true" className="size-4" />
                </button>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-[#10141D] px-5 py-2.5 text-sm font-medium text-slate-200 transition hover:border-blue-400/45 hover:text-white"
                >
                  Book Consultation
                  <ArrowUpRight aria-hidden="true" className="size-4 text-blue-400" />
                </Link>
              </div>
            </div>
          </div>

          {/* Hero Supporting Copy + Compact Pill CTAs */}
          <div className="hero-cta-group hero-entrance-meta relative z-20 mx-auto max-w-xl text-center">
            <p className="mx-auto mb-5 max-w-[46ch] text-sm leading-relaxed text-[#A3ACBC] sm:text-base">
              Websites, branding, paid acquisition, organic visibility &amp; intelligent automation —
              engineered together under one unified partner.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => scrollToSectionId("divisions-directory")}
                className="inline-flex items-center gap-2 rounded-full bg-[#2456A4] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-950/50 transition hover:bg-blue-600 focus-visible:outline-2 focus-visible:outline-blue-300"
              >
                Explore All 37 Services
                <ArrowRight aria-hidden="true" className="size-4" />
              </button>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-[#10141D]/85 px-6 py-3 text-sm font-medium text-slate-200 transition hover:border-blue-400/50 hover:text-white"
              >
                Start a Project
                <ArrowUpRight aria-hidden="true" className="size-4 text-blue-400" />
              </Link>
            </div>
          </div>
        </div>
        </div>

        {/* Mobile / Compact Viewport Overview Fallback (shown only below 900px or when reduced motion) */}
        <div className="px-5 py-12 sm:px-8 min-[900px]:hidden">
          <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-400/25 bg-[#142B4A]/65 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-blue-200">
            {divisions[0]!.eyebrow}
          </span>
          <h2 className="text-3xl font-semibold leading-tight tracking-tight text-white">
            {divisions[0]!.heading}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[#A3ACBC]">{divisions[0]!.intro[0]}</p>
        </div>
      </section>

      {/* SECTION 8: FEATURED VISUAL SPOTLIGHT (Reference 00:07–00:10.5) */}
      <section
        ref={spotlightSectionRef}
        data-reel-scene="spotlight"
        className="relative z-10 mx-auto max-w-[1440px] px-5 py-20 sm:px-8 md:px-14 lg:px-20 lg:py-28"
        aria-label="Featured Digital Execution Spotlight"
      >
        <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <span className="spotlight-reveal mb-2 inline-block text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">
              {currentSpotlight.divisionLabel}
            </span>
            <h2 className="spotlight-reveal max-w-[18ch] text-[clamp(2rem,3.8vw,3.6rem)] font-semibold leading-[1.03] tracking-[-0.02em] text-white">
              {currentSpotlight.title}
            </h2>
          </div>

          {/* Interactive 5-Division Shutter Controls */}
          <div
            role="tablist"
            aria-label="Switch featured service division"
            className="spotlight-reveal flex flex-wrap gap-2"
          >
            {serviceSpotlights.map((spot, idx) => {
              const selected = idx === activeSpotlight;
              return (
                <button
                  key={spot.slug}
                  role="tab"
                  aria-selected={selected}
                  type="button"
                  onClick={() => handleSelectSpotlight(idx)}
                  className={`rounded-full px-4 py-2 text-xs font-medium transition focus-visible:outline-2 focus-visible:outline-blue-400 ${
                    selected
                      ? "bg-[#2456A4] text-white shadow-md shadow-blue-950/50"
                      : "border border-white/12 bg-[#10141D] text-slate-300 hover:border-blue-400/40 hover:text-white"
                  }`}
                >
                  {divisionTabLabels[spot.slug] ?? spot.category}
                </button>
              );
            })}
          </div>
        </div>

        {/* Wide Rounded Showcase Banner with Scroll Parallax + Shutter Wipe */}
        <div
          ref={spotlightFrameRef}
          className="relative overflow-hidden rounded-[22px] border border-blue-400/20 bg-[#10141D] shadow-[0_32px_90px_-24px_rgba(14,32,68,0.65)]"
        >
          <div className="relative aspect-[16/9] max-h-[58vh] w-full overflow-hidden">
            <img
              ref={spotlightImgRef}
              src={currentSpotlight.image}
              alt={currentSpotlight.title}
              className="h-full w-full object-cover will-change-transform"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#080B12] via-[#080B12]/35 to-transparent" />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#080B12]/80 via-transparent to-transparent" />

            {/* Deep-blue shutter curtain used for interactive division switches */}
            <div
              ref={spotlightOverlayRef}
              aria-hidden="true"
              style={{ clipPath: "inset(0 100% 0 0)" }}
              className="pointer-events-none absolute inset-0 z-20 bg-[#142B4A]"
            />

            {/* Floating Division Info inside banner */}
            <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col gap-4 p-6 sm:p-8 md:flex-row md:items-end md:justify-between">
              <div className="max-w-xl">
                <div className="mb-2 flex items-center gap-2.5">
                  <span className="rounded-full border border-blue-400/35 bg-[#142B4A]/90 px-3 py-1 text-xs font-medium text-blue-100 backdrop-blur-md">
                    {currentSpotlight.tag}
                  </span>
                  <span className="text-xs font-medium text-slate-300">
                    {currentSpotlight.category}
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-slate-200 sm:text-base">
                  {currentSpotlight.desc}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  onSelectDivision(currentSpotlight.slug);
                  scrollToSectionId("divisions-directory");
                }}
                className="inline-flex w-fit shrink-0 items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-[#080B12] transition hover:bg-blue-100 focus-visible:outline-2 focus-visible:outline-blue-400"
              >
                {currentSpotlight.cta}
                <ArrowRight aria-hidden="true" className="size-4" />
              </button>
            </div>
          </div>

          {/* Minimal indicator strip */}
          <div className="flex items-center justify-between border-t border-white/10 px-6 py-3.5 text-xs text-[#A3ACBC]">
            <span>
              Division 0{activeSpotlight + 1} / 0{serviceSpotlights.length}
            </span>
            <div className="flex items-center gap-1.5" aria-hidden="true">
              {serviceSpotlights.map((spot, idx) => (
                <span
                  key={spot.slug}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx === activeSpotlight ? "w-7 bg-blue-400" : "w-1.5 bg-white/20"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 9: TRUST, FACTS & CAPABILITY ECOSYSTEM MARQUEE (Reference 00:10.5–00:13) */}
      <section
        ref={platformsRef}
        data-reel-scene="platforms"
        className="relative z-10 border-y border-white/8 bg-[#0B0F19]/90 py-14 lg:py-18"
        aria-label="Core platforms and delivery ecosystem"
      >
        <div className="mx-auto mb-8 flex max-w-[1440px] flex-col gap-4 px-5 sm:px-8 md:flex-row md:items-center md:justify-between md:px-14 lg:px-20">
          <div className="platform-reveal">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">
              Platform &amp; Channel Stack
            </span>
            <p className="mt-1 text-sm text-[#A3ACBC]">
              Proven technologies deployed across websites, paid acquisition, SEO, and automation.
            </p>
          </div>
          <div className="platform-reveal flex flex-wrap gap-2 text-xs text-slate-300">
            <span className="rounded-full border border-white/10 bg-[#10141D] px-3 py-1.5">
              500+ Websites Delivered
            </span>
            <span className="rounded-full border border-white/10 bg-[#10141D] px-3 py-1.5">
              25+ Specialists
            </span>
            <span className="rounded-full border border-white/10 bg-[#10141D] px-3 py-1.5">
              Hyderabad &amp; Bangalore
            </span>
          </div>
        </div>

        {/* Muted Clean Horizontal Marquee */}
        <div className="platform-reveal edge-mask-x overflow-hidden">
          <div
            className="flex w-max items-center gap-6 py-2"
            style={{
              animation: reduceMotion ? "none" : "marquee-scroll 34s linear infinite",
            }}
          >
            {[...platformCapabilities, ...platformCapabilities].map((item, idx) => (
              <div
                key={`${item.name}-${idx}`}
                className="flex items-center gap-3 rounded-full border border-white/10 bg-[#10141D]/80 px-5 py-2.5 text-slate-300 transition hover:border-blue-400/35 hover:text-white"
              >
                <span className="font-mono text-xs font-semibold tracking-[0.14em] text-white">
                  {item.name}
                </span>
                <span className="text-[11px] text-[#7F8AA0]">· {item.role}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
