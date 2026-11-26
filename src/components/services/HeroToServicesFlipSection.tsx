import { Link } from "@tanstack/react-router";
import { ArrowRight, ChevronDown, ChevronLeft, ChevronRight, ChevronUp } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { divisions, industries } from "@/content/site";
import { ensureGsapRegistered, gsap, scrollToSectionId } from "./gsapMotion";
import { heroServiceCards, platformCapabilities, serviceSpotlights } from "./servicesData";

type HeroToServicesFlipSectionProps = {
  reduceMotion: boolean;
  onSelectDivision: (slug: string) => void;
};

const HERO_LINE_1 = ["Digital", "systems", "to", "display"];
const HERO_LINE_2 = ["your", "brand", "at", "scale."];

function SpeechBubble({
  label,
  tone = "blue",
  className = "",
}: {
  label: string;
  tone?: "blue" | "dark";
  className?: string;
}) {
  const bg = tone === "blue" ? "bg-[#2456A4] text-white" : "bg-[#142B4A] text-blue-100 border border-blue-300/30";
  const tail = tone === "blue" ? "bg-[#2456A4]" : "bg-[#142B4A]";
  return (
    <span
      className={`relative inline-flex items-center rounded-full px-3.5 py-1 text-xs font-semibold shadow-lg ${bg} ${className}`}
    >
      {label}
      <span
        aria-hidden="true"
        className={`absolute -bottom-1 left-1/2 size-2 -translate-x-1/2 rotate-45 ${tail}`}
      />
    </span>
  );
}

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
  const [trustMode, setTrustMode] = useState<"platforms" | "industries">("platforms");
  const [replayNonce, setReplayNonce] = useState(0);

  const currentSpotlight = serviceSpotlights[activeSpotlight] ?? serviceSpotlights[0]!;

  // GSAP Entrance (F0012 -> F0048) + Pinned Shared-Element Morph (F0096 -> F0156 -> F0168) + Spotlight Parallax (F0204)
  useEffect(() => {
    if (reduceMotion) return;
    ensureGsapRegistered();

    const stage = heroStageRef.current;
    const pinEl = heroPinRef.current;
    if (!stage || !pinEl) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      const heroWords = gsap.utils.toArray<HTMLElement>(".hero-word", pinEl);
      const heroMeta = gsap.utils.toArray<HTMLElement>(".hero-entrance-meta", pinEl);
      const heroPills = gsap.utils.toArray<HTMLElement>(".hero-float-pill", pinEl);
      const cards = gsap.utils.toArray<HTMLElement>(".hero-shared-card", pinEl);
      const cardIntros = gsap.utils.toArray<HTMLElement>(".hero-card-intro", pinEl);
      const floatInners = gsap.utils.toArray<HTMLElement>(".hero-card-float", pinEl);

      const centerIndex = 3;
      const centerIntro = cardIntros[centerIndex];
      const wingIntros = cardIntros.filter((_, idx) => idx !== centerIndex);

      const getFanGeometry = () => {
        const w = pinEl.clientWidth || window.innerWidth;
        const h = pinEl.clientHeight || window.innerHeight;
        const isDesktop = w >= 900 && h >= 580;
        const cardW = isDesktop ? Math.min(186, Math.max(134, w * 0.13)) : Math.min(116, w * 0.25);
        const cardH = cardW * 1.06; // Near-square 1:1.06 matching F0048 / F0156
        const spreadStep = isDesktop ? Math.min(116, (w * 0.68) / 6) : Math.min(44, w * 0.1);
        return { w, h, isDesktop, cardW, cardH, spreadStep };
      };

      const applyRestFanState = () => {
        const { cardW, cardH, spreadStep } = getFanGeometry();
        cards.forEach((card, i) => {
          const item = heroServiceCards[i]!;
          const centerOffset = i - centerIndex;
          gsap.set(card, {
            width: cardW,
            height: cardH,
            x: centerOffset * spreadStep,
            y: item.heroY,
            rotation: item.heroRotate,
            scale: 1 - Math.abs(centerOffset) * 0.02,
            zIndex: 25 - Math.abs(centerOffset),
          });
        });
      };

      applyRestFanState();

      // Stage 1 Entrance matches F0012 -> F0024 -> F0036 -> F0048:
      // 1) Center card turns toward viewer while headline words stagger in
      // 2) Wing cards expand symmetrically outward from behind center card
      // 3) Speech-bubble pills, body copy, and pill CTAs settle
      const introTl = gsap.timeline({ defaults: { ease: "power3.out" } });

      gsap.set(heroWords, { y: 18, opacity: 0.2, filter: "blur(6px)" });
      if (centerIntro) {
        gsap.set(centerIntro, { opacity: 0, scale: 0.84, rotation: -14, y: 18 });
      }
      gsap.set(wingIntros, {
        opacity: 0,
        scale: 0.84,
        x: (idx: number) => {
          const origIdx = idx >= centerIndex ? idx + 1 : idx;
          return -(origIdx - centerIndex) * getFanGeometry().spreadStep;
        },
        y: 12,
        rotation: (idx: number) => {
          const origIdx = idx >= centerIndex ? idx + 1 : idx;
          return -heroServiceCards[origIdx]!.heroRotate;
        },
      });
      gsap.set(heroPills, { opacity: 0, scale: 0.65, y: 10 });
      gsap.set(heroMeta, { opacity: 0, y: 14, filter: "blur(4px)" });

      introTl
        .to(
          heroWords,
          { y: 0, opacity: 1, filter: "blur(0px)", duration: 0.55, stagger: 0.06 },
          0.05
        )
        .to(
          centerIntro ?? [],
          { opacity: 1, scale: 1, rotation: 0, y: 0, duration: 0.62, ease: "back.out(1.2)" },
          0.08
        )
        .to(
          wingIntros,
          {
            opacity: 1,
            scale: 1,
            x: 0,
            y: 0,
            rotation: 0,
            duration: 0.78,
            stagger: { each: 0.05, from: "center" },
            ease: "expo.out",
          },
          0.56
        )
        .to(
          heroPills,
          { opacity: 1, scale: 1, y: 0, duration: 0.45, stagger: 0.1, ease: "back.out(1.6)" },
          1.12
        )
        .to(
          heroMeta,
          { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.52, stagger: 0.08 },
          1.05
        );

      // Gentle breathing float separated cleanly inside `.hero-card-float`
      floatInners.forEach((inner, i) => {
        gsap.to(inner, {
          y: i % 2 === 0 ? -4 : 4,
          duration: 3.2 + (i % 3) * 0.45,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: 1.4 + i * 0.15,
        });
      });

      // Desktop / Laptop Pinned Transition (F0048 -> F0096 Compact Deck -> F0108 Glide -> F0156 Lower-Right Cascade)
      mm.add("(min-width: 900px) and (min-height: 580px)", () => {
        const heroCopyGroup = pinEl.querySelector<HTMLElement>(".hero-copy-group");
        const heroCtaGroup = pinEl.querySelector<HTMLElement>(".hero-cta-group");
        const overviewPanel = pinEl.querySelector<HTMLElement>(".overview-left-panel");
        const overviewEyebrow = pinEl.querySelector<HTMLElement>(".overview-eyebrow");
        const overviewWords = gsap.utils.toArray<HTMLElement>(".overview-word", pinEl);
        const overviewMeta = gsap.utils.toArray<HTMLElement>(".overview-meta", pinEl);
        const overviewBadges = gsap.utils.toArray<HTMLElement>(".overview-float-badge", pinEl);
        const overviewArrows = pinEl.querySelector<HTMLElement>(".overview-step-nav");

        gsap.set(overviewPanel, { opacity: 0, pointerEvents: "none" });
        gsap.set(overviewEyebrow, { opacity: 0, y: 12 });
        gsap.set(overviewWords, { opacity: 0.15, y: 16 });
        gsap.set(overviewMeta, { opacity: 0, y: 16 });
        gsap.set(overviewBadges, { opacity: 0, scale: 0.72 });
        if (overviewArrows) gsap.set(overviewArrows, { opacity: 0, x: 12 });

        const scrollTl = gsap.timeline({
          scrollTrigger: {
            trigger: stage,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.68,
            pin: pinEl,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onEnter: () => introTl.progress(1),
          },
        });

        // Phase 1 (0.00 -> 0.34): Hero copy rises out; 7 fanned cards collapse tightly into F0096 single stack
        scrollTl
          .to(heroCopyGroup, { y: -96, opacity: 0, duration: 0.28, ease: "power2.in" }, 0)
          .to(heroCtaGroup, { y: -64, opacity: 0, duration: 0.24, ease: "power2.in" }, 0)
          .to(heroPills, { scale: 0.72, opacity: 0, duration: 0.2 }, 0)
          .fromTo(
            cards,
            {
              x: (i: number) => (i - centerIndex) * getFanGeometry().spreadStep,
              y: (i: number) => heroServiceCards[i]!.heroY,
              rotation: (i: number) => heroServiceCards[i]!.heroRotate,
              scale: (i: number) => 1 - Math.abs(i - centerIndex) * 0.02,
            },
            {
              x: (i: number) => (i - centerIndex) * 2.5,
              y: (i: number) => (i === centerIndex ? 14 : 14 + (i - centerIndex) * 1.5),
              rotation: (i: number) => (i === centerIndex ? 0 : (i % 2 === 0 ? -2 : 2)),
              scale: (i: number) => (i === centerIndex ? 1.04 : 0.94 - Math.abs(i - centerIndex) * 0.015),
              duration: 0.34,
              ease: "power2.inOut",
            },
            0
          )

          // Phase 2 (0.38 -> 0.58): Compact stack shifts downward-right while Overview left eyebrow + words reveal (F0108)
          .to(
            cards,
            {
              x: (i: number) => Math.min(205, (pinEl.clientWidth || 1440) * 0.145) + (i - centerIndex) * 18,
              y: (i: number) => Math.min(115, (pinEl.clientHeight || 900) * 0.13) + (i - centerIndex) * 4,
              rotation: (i: number) => (i - centerIndex) * 1.2,
              duration: 0.2,
              ease: "power2.inOut",
            },
            0.38
          )
          .to(overviewPanel, { opacity: 1, pointerEvents: "auto", duration: 0.04 }, 0.4)
          .to(overviewEyebrow, { opacity: 1, y: 0, duration: 0.16 }, 0.4)
          .to(
            overviewWords,
            { opacity: 1, y: 0, stagger: 0.025, duration: 0.16, ease: "power2.out" },
            0.44
          )

          // Phase 3 (0.58 -> 1.00): Cards open wide into Lower-Right Descending Cascade matching F0120 / F0156!
          .to(
            cards,
            {
              x: (i: number) => {
                const w = pinEl.clientWidth || 1440;
                // Spread horizontally across lower-right portion (0 -> ~46% of viewport width)
                const startX = -w * 0.015;
                const step = Math.min(116, w * 0.082);
                return startX + i * step;
              },
              y: (i: number) => {
                const h = pinEl.clientHeight || 900;
                const baseY = h * 0.125;
                const waveY = [10, 44, 22, 68, 48, 86, 66][i] ?? 40;
                return baseY + waveY;
              },
              rotation: (i: number) => [-3, 2, -2, 3, -1, 4, -2][i] ?? 0,
              scale: (i: number) => (i === 2 || i === 3 ? 1.02 : 0.96),
              zIndex: (i: number) => 20 + i,
              duration: 0.4,
              ease: "power3.out",
            },
            0.58
          )
          .to(overviewMeta, { opacity: 1, y: 0, stagger: 0.06, duration: 0.22, ease: "power3.out" }, 0.62)
          .to(
            overviewBadges,
            { opacity: 1, scale: 1, stagger: 0.07, duration: 0.18, ease: "back.out(1.6)" },
            0.74
          )
          .to(overviewArrows ?? [], { opacity: 1, x: 0, duration: 0.18 }, 0.78);
      });

      // Spotlight Banner Reveal + Parallax (F0204)
      if (spotlightSectionRef.current && spotlightFrameRef.current && spotlightImgRef.current) {
        const spotHeading = gsap.utils.toArray<HTMLElement>(".spotlight-reveal", spotlightSectionRef.current);
        gsap.fromTo(
          spotHeading,
          { y: 24, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.06,
            duration: 0.65,
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
          { y: 48, scale: 0.94, opacity: 0.3, clipPath: "inset(6% 4% 6% 4% round 22px)" },
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
          { yPercent: -6, scale: 1.09 },
          {
            yPercent: 6,
            scale: 1.05,
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

      // Quiet Trust Strip Reveal (F0276)
      if (platformsRef.current) {
        const platItems = gsap.utils.toArray<HTMLElement>(".platform-reveal", platformsRef.current);
        gsap.fromTo(
          platItems,
          { y: 22, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.07,
            duration: 0.6,
            ease: "power3.out",
            scrollTrigger: {
              trigger: platformsRef.current,
              start: "top 84%",
              once: true,
            },
          }
        );
      }
    }, stage.parentElement ?? stage);

    return () => ctx.revert();
  }, [reduceMotion, replayNonce]);

  const stepSpotlight = (dir: -1 | 1) => {
    const next = (activeSpotlight + dir + serviceSpotlights.length) % serviceSpotlights.length;
    if (!reduceMotion && spotlightOverlayRef.current) {
      gsap.fromTo(
        spotlightOverlayRef.current,
        { clipPath: dir > 0 ? "inset(0 100% 0 0)" : "inset(0 0 0 100%)" },
        {
          clipPath: "inset(0 0% 0 0%)",
          duration: 0.25,
          ease: "power2.inOut",
          onComplete: () => {
            setActiveSpotlight(next);
            gsap.to(spotlightOverlayRef.current, {
              clipPath: dir > 0 ? "inset(0 0% 0 100%)" : "inset(0 100% 0 0%)",
              duration: 0.35,
              ease: "power2.out",
            });
          },
        }
      );
    } else {
      setActiveSpotlight(next);
    }
  };

  return (
    <>
      {/* MOTION STUDY 01 & 02: HERO FAN -> COMPACT DECK -> LOWER-RIGHT SERVICES CASCADE */}
      <section
        id="hero-stage"
        ref={heroStageRef}
        data-reel-scene="hero"
        className="relative z-10 w-full min-[900px]:min-h-[245vh]"
        aria-label="Digital Services Hero and Overview"
      >
        <div className="w-full">
          <div
            ref={heroPinRef}
            className="relative flex w-full flex-col justify-between overflow-hidden px-5 pt-[96px] pb-12 sm:px-8 md:px-14 lg:px-20 min-[900px]:h-screen min-[900px]:pt-[102px] min-[900px]:pb-10"
          >
            {/* Hidden trigger for ServicesReel */}
            <button
              type="button"
              aria-label="Replay opening card animation"
              className="sr-only"
              onClick={() => setReplayNonce((n) => n + 1)}
            />

            {/* Clean Two-Line Centered Hero Headline matching F0000 / F0048 (Zero clutter pill above H1) */}
            <div className="hero-copy-group relative z-20 mx-auto max-w-4xl text-center">
              <h1 className="mx-auto text-[clamp(2.45rem,4.9vw,4.7rem)] font-semibold leading-[0.98] tracking-[-0.025em] text-white">
                <span className="block">
                  {HERO_LINE_1.map((word, idx) => (
                    <span key={idx} className="hero-word inline-block mr-[0.23em] last:mr-0">
                      {word}
                    </span>
                  ))}
                </span>
                <span className="block">
                  {HERO_LINE_2.map((word, idx) => (
                    <span key={idx} className="hero-word inline-block mr-[0.23em] last:mr-0">
                      {word}
                    </span>
                  ))}
                </span>
              </h1>
            </div>

            {/* Central Visual Arena + Morphing 7 Cards + Overview Left Column */}
            <div className="relative z-10 my-3 flex min-h-[250px] w-full flex-1 items-center justify-center sm:min-h-[290px]">
              <div className="pointer-events-none relative mx-auto flex h-full w-full max-w-[1260px] items-center justify-center">
                {/* Hero Floating Speech Bubbles matching F0048 */}
                <div className="hero-float-pill absolute top-1 left-[20%] z-30 hidden md:block">
                  <SpeechBubble label="@webcraft" tone="blue" />
                </div>
                <div className="hero-float-pill absolute right-[17%] bottom-2 z-30 hidden md:block">
                  <SpeechBubble label="@automation" tone="dark" />
                </div>

                {/* Overview Floating Speech Bubbles matching F0156 */}
                <div className="overview-float-badge absolute top-[38%] left-[53%] z-30 hidden min-[900px]:block">
                  <SpeechBubble label="@uiux" tone="blue" />
                </div>
                <div className="overview-float-badge absolute top-[45%] right-[12%] z-30 hidden min-[900px]:block">
                  <SpeechBubble label="@commerce" tone="dark" />
                </div>

                {/* 7 Shared Cards: Single Tilted Card -> 7-Card Fan -> Tight Stack -> Lower-Right Cascade */}
                {heroServiceCards.map((card, i) => (
                  <button
                    key={card.id}
                    type="button"
                    onClick={() => {
                      onSelectDivision(card.slug);
                      scrollToSectionId("divisions-directory");
                    }}
                    aria-label={`${card.title} (${card.category}) — explore division`}
                    style={{
                      transformOrigin: "center bottom",
                      ...(reduceMotion
                        ? {
                            transform: `translate3d(${(i - 3) * 86}px, ${card.heroY}px, 0) rotate(${card.heroRotate}deg)`,
                            zIndex: 25 - Math.abs(i - 3),
                          }
                        : undefined),
                    }}
                    className="hero-shared-card group pointer-events-auto absolute h-[140px] w-[132px] rounded-2xl focus-visible:outline-2 focus-visible:outline-blue-400 cursor-pointer sm:h-[164px] sm:w-[154px] min-[900px]:h-[192px] min-[900px]:w-[180px]"
                  >
                    <div className="hero-card-intro h-full w-full">
                      <div className="hero-card-float relative h-full w-full overflow-hidden rounded-2xl border border-white/15 bg-[#10141D] shadow-[0_24px_48px_-14px_rgba(0,0,0,0.78)] transition-[border-color,box-shadow] duration-300 group-hover:border-blue-400/65">
                        <img
                          src={card.image}
                          alt={card.title}
                          loading="eager"
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        {/* Clean vibrant borderless look at rest matching F0048/F0156; title reveals cleanly on hover/focus */}
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#080B12]/85 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100" />
                        <div className="pointer-events-none absolute inset-x-0 bottom-0 p-2.5 text-left opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                          <span className="block text-[10px] font-medium uppercase tracking-wider text-blue-300">
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

              {/* Left Overview Panel matching F0156 composition (Eyebrow + 3-line bold accent title + copy + dual pills) */}
              <div className="overview-left-panel pointer-events-none absolute inset-y-0 left-0 z-20 hidden w-[46%] flex-col justify-center pr-6 min-[900px]:flex">
                <span className="overview-eyebrow mb-3 inline-block text-xs font-semibold uppercase tracking-[0.2em] text-[#7F8AA0]">
                  {divisions[0]!.eyebrow}
                </span>
                <h2 className="max-w-[14ch] text-[clamp(2.25rem,3.9vw,3.85rem)] font-semibold leading-[1.01] tracking-[-0.025em] text-white">
                  <span className="overview-word inline-block mr-[0.22em]">Design,</span>
                  <span className="overview-word inline-block mr-[0.22em]">Build,</span>
                  <span className="overview-word inline-block mr-[0.22em] text-blue-400">&amp;</span>
                  <span className="overview-word inline-block mr-[0.22em] text-blue-400">scale</span>
                  <span className="overview-word inline-block mr-[0.22em] text-blue-400">websites</span>
                  <span className="overview-word inline-block mr-[0.22em]">that</span>
                  <span className="overview-word inline-block">convert.</span>
                </h2>
                <p className="overview-meta mt-4 max-w-[40ch] text-sm leading-relaxed text-[#A3ACBC] lg:text-base">
                  {divisions[0]!.intro[0]}
                </p>
                <div className="overview-meta mt-6 flex flex-wrap items-center gap-3">
                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-2 rounded-full bg-[#2456A4] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-600 focus-visible:outline-2 focus-visible:outline-blue-300"
                  >
                    Start Website Project
                    <ArrowRight aria-hidden="true" className="size-4" />
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      onSelectDivision("website-development");
                      scrollToSectionId("divisions-directory");
                    }}
                    className="inline-flex items-center rounded-full border border-white/15 bg-[#10141D] px-5 py-2.5 text-sm font-medium text-slate-200 transition hover:border-blue-400/45 hover:text-white"
                  >
                    View 8 Deliverables
                  </button>
                </div>
              </div>

              {/* Right-margin up/down step buttons matching F0156 */}
              <div className="overview-step-nav pointer-events-auto absolute right-0 top-1/2 z-30 hidden -translate-y-1/2 flex-col gap-1.5 min-[900px]:flex">
                <button
                  type="button"
                  aria-label="Scroll to hero"
                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                  className="flex size-8 items-center justify-center rounded-full border border-white/12 bg-[#10141D]/90 text-slate-300 transition hover:border-blue-400/50 hover:text-white"
                >
                  <ChevronUp aria-hidden="true" className="size-4" />
                </button>
                <button
                  type="button"
                  aria-label="Scroll to spotlight showcase"
                  onClick={() => scrollToSectionId("spotlight-stage")}
                  className="flex size-8 items-center justify-center rounded-full border border-white/12 bg-[#10141D]/90 text-slate-300 transition hover:border-blue-400/50 hover:text-white"
                >
                  <ChevronDown aria-hidden="true" className="size-4" />
                </button>
              </div>
            </div>

            {/* Hero Bottom Description + Compact Pill CTAs matching F0048 */}
            <div className="hero-cta-group hero-entrance-meta relative z-20 mx-auto max-w-xl text-center">
              <p className="mx-auto mb-5 max-w-[44ch] text-sm leading-relaxed text-[#A3ACBC] sm:text-base">
                Websites, branding, paid acquisition, SEO &amp; automation engineered under one roof
                for ambitious businesses.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => scrollToSectionId("divisions-directory")}
                  className="inline-flex items-center gap-2 rounded-full bg-[#2456A4] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-950/50 transition hover:bg-blue-600 focus-visible:outline-2 focus-visible:outline-blue-300"
                >
                  Explore Services
                </button>
                <Link
                  to="/contact"
                  className="inline-flex items-center rounded-full px-5 py-3 text-sm font-medium text-slate-300 transition hover:text-white"
                >
                  Read more &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile / Reduced Motion Fallback */}
        <div className="px-5 py-10 sm:px-8 min-[900px]:hidden">
          <span className="mb-2 inline-block text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">
            {divisions[0]!.eyebrow}
          </span>
          <h2 className="text-3xl font-semibold leading-tight text-white">
            Design, Build, &amp; <span className="text-blue-400">scale websites</span> that convert.
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[#A3ACBC]">{divisions[0]!.intro[0]}</p>
        </div>
      </section>

      {/* FEATURED BANNER (F0204: Clean Eyebrow, Dual-Tone Left Heading, Wide Rounded Visual w/ Corner Pills & Controls) */}
      <section
        id="spotlight-stage"
        ref={spotlightSectionRef}
        data-reel-scene="spotlight"
        className="relative z-10 mx-auto max-w-[1440px] px-5 py-20 sm:px-8 md:px-14 lg:px-20 lg:py-24"
        aria-label="Featured Digital Execution Banner"
      >
        <div className="mb-7 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <span className="spotlight-reveal mb-2 inline-block text-xs font-semibold uppercase tracking-[0.2em] text-[#7F8AA0]">
              {currentSpotlight.divisionLabel}
            </span>
            <h2 className="spotlight-reveal max-w-[15ch] text-[clamp(2.2rem,4vw,3.9rem)] font-semibold leading-[1.02] tracking-[-0.025em] text-white">
              Full-Spectrum <span className="text-[#7F8AA0]">digital execution.</span>
            </h2>
          </div>

          <div
            role="tablist"
            aria-label="Switch featured division banner"
            className="spotlight-reveal flex flex-wrap gap-2"
          >
            {serviceSpotlights.map((spot, idx) => (
              <button
                key={spot.slug}
                role="tab"
                aria-selected={idx === activeSpotlight}
                type="button"
                onClick={() => stepSpotlight(idx - activeSpotlight as -1 | 1)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition ${
                  idx === activeSpotlight
                    ? "bg-[#2456A4] text-white"
                    : "border border-white/12 bg-[#10141D] text-slate-300 hover:border-blue-400/40 hover:text-white"
                }`}
              >
                0{idx + 1} · {spot.tag.replace("@", "")}
              </button>
            ))}
          </div>
        </div>

        {/* Wide Rounded Visual Banner matching F0204 */}
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
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#080B12]/70 via-transparent to-[#080B12]/25" />

            {/* Shutter curtain */}
            <div
              ref={spotlightOverlayRef}
              aria-hidden="true"
              style={{ clipPath: "inset(0 100% 0 0)" }}
              className="pointer-events-none absolute inset-0 z-20 bg-[#142B4A]"
            />

            {/* Top-left Dual Capsule Brand Mark matching F0204 */}
            <div className="absolute top-5 left-5 z-10 flex flex-col gap-1" aria-hidden="true">
              <span className="h-5 w-4 rounded-sm rounded-br-md bg-white/95 shadow" />
              <span className="h-5 w-4 rounded-sm rounded-tr-md bg-[#2456A4] shadow" />
            </div>

            {/* Top-right Pagination Indicators matching F0204 */}
            <div className="absolute top-5 right-5 z-10 flex items-center gap-1.5" aria-hidden="true">
              {serviceSpotlights.map((spot, idx) => (
                <span
                  key={spot.slug}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx === activeSpotlight ? "w-5 bg-white" : "w-1.5 bg-white/40"
                  }`}
                />
              ))}
            </div>

            {/* Bottom-left Compact White Pill CTA matching F0204 ("Watch" -> Explore Division) */}
            <button
              type="button"
              onClick={() => {
                onSelectDivision(currentSpotlight.slug);
                scrollToSectionId("divisions-directory");
              }}
              className="absolute bottom-5 left-5 z-10 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2 text-xs font-semibold text-[#080B12] shadow-xl transition hover:bg-blue-100 focus-visible:outline-2 focus-visible:outline-blue-400 sm:text-sm"
            >
              {currentSpotlight.title.split(".")[0]} &rarr;
            </button>

            {/* Bottom-right Functional Carousel Arrows matching F0204 */}
            <div className="absolute right-5 bottom-5 z-10 flex items-center gap-2">
              <button
                type="button"
                aria-label="Previous spotlight division"
                onClick={() => stepSpotlight(-1)}
                className="flex size-9 items-center justify-center rounded-full bg-white/90 text-[#080B12] shadow-lg transition hover:bg-white"
              >
                <ChevronLeft aria-hidden="true" className="size-4" />
              </button>
              <button
                type="button"
                aria-label="Next spotlight division"
                onClick={() => stepSpotlight(1)}
                className="flex size-9 items-center justify-center rounded-full bg-white/90 text-[#080B12] shadow-lg transition hover:bg-white"
              >
                <ChevronRight aria-hidden="true" className="size-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* QUIET TRUST & STACK STRIP (F0276: Minimalist Headline + Controls + Muted Horizontal Strip) */}
      <section
        ref={platformsRef}
        data-reel-scene="platforms"
        className="relative z-10 py-14 lg:py-20"
        aria-label="Core platforms and industries served"
      >
        <div className="mx-auto mb-10 flex max-w-[1440px] flex-wrap items-end justify-between gap-4 px-5 sm:px-8 md:px-14 lg:px-20">
          <div className="platform-reveal">
            <h2 className="text-[clamp(1.75rem,3vw,2.75rem)] font-semibold leading-tight tracking-[-0.02em] text-white">
              Trusted across <span className="text-[#7F8AA0]">channels.</span>
            </h2>
            <p className="mt-1.5 max-w-[54ch] text-xs leading-relaxed text-[#8C96A9] sm:text-sm">
              500+ websites delivered by 25+ specialists across Hyderabad &amp; Bangalore using modern
              web, paid acquisition, and CRM stacks.
            </p>
          </div>

          <div className="platform-reveal flex items-center gap-2">
            <button
              type="button"
              aria-label="Show core platforms"
              onClick={() => setTrustMode("platforms")}
              className={`flex size-8 items-center justify-center rounded-full border text-xs transition ${
                trustMode === "platforms"
                  ? "border-blue-400 bg-[#142B4A] text-white"
                  : "border-white/12 text-slate-400 hover:text-white"
              }`}
            >
              <ChevronLeft aria-hidden="true" className="size-4" />
            </button>
            <button
              type="button"
              aria-label="Show industries served"
              onClick={() => setTrustMode("industries")}
              className={`flex size-8 items-center justify-center rounded-full border text-xs transition ${
                trustMode === "industries"
                  ? "border-blue-400 bg-[#142B4A] text-white"
                  : "border-white/12 text-slate-400 hover:text-white"
              }`}
            >
              <ChevronRight aria-hidden="true" className="size-4" />
            </button>
          </div>
        </div>

        {/* Muted Minimal Horizontal Track matching F0276 */}
        <div className="platform-reveal edge-mask-x overflow-hidden">
          <div
            className="flex w-max items-center gap-12 py-2"
            style={{
              animation: reduceMotion ? "none" : "marquee-scroll 34s linear infinite",
            }}
          >
            {trustMode === "platforms"
              ? [...platformCapabilities, ...platformCapabilities].map((item, idx) => (
                  <div
                    key={`${item.name}-${idx}`}
                    className="flex items-center gap-2.5 text-slate-400/75 transition hover:text-slate-200"
                  >
                    <span className="size-2 rounded-full bg-blue-500/45" aria-hidden="true" />
                    <span className="font-mono text-sm font-semibold tracking-[0.12em]">
                      {item.name}
                    </span>
                  </div>
                ))
              : [...industries, ...industries].map((sector, idx) => (
                  <div
                    key={`${sector}-${idx}`}
                    className="flex items-center gap-2.5 text-slate-400/75 transition hover:text-slate-200"
                  >
                    <span className="size-2 rounded-full bg-blue-500/45" aria-hidden="true" />
                    <span className="font-sans text-sm font-semibold tracking-wide uppercase">
                      {sector}
                    </span>
                  </div>
                ))}
          </div>
        </div>
      </section>
    </>
  );
}
