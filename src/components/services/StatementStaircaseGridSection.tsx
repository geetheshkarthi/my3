import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BarChart3,
  Bot,
  Check,
  Code2,
  Globe,
  Layers,
  Palette,
  Sparkles,
  Target,
  TrendingUp,
  Workflow,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { divisions, stats } from "@/content/site";
import { ensureGsapRegistered, gsap, scrollToSectionId } from "./gsapMotion";
import {
  capabilityImages,
  divisionTabLabels,
  sectorGridCards,
  serviceCatalogCards,
  stageTwoSharedCards,
} from "./servicesData";

type StatementStaircaseGridSectionProps = {
  reduceMotion: boolean;
  activeTab: string;
  onSelectDivision: (slug: string) => void;
};

type StatementToken =
  | { type: "word"; text: string }
  | { type: "icon"; label: string; kind: "web" | "brand" | "automation" };

const STATEMENT_TOKENS: StatementToken[] = [
  { type: "word", text: "Whether" },
  { type: "word", text: "you" },
  { type: "word", text: "need" },
  { type: "word", text: "a" },
  { type: "word", text: "conversion-ready" },
  { type: "word", text: "website," },
  { type: "icon", label: "Website Development", kind: "web" },
  { type: "word", text: "a" },
  { type: "word", text: "distinctive" },
  { type: "word", text: "brand" },
  { type: "word", text: "identity," },
  { type: "icon", label: "Brand Strategy", kind: "brand" },
  { type: "word", text: "or" },
  { type: "word", text: "intelligent" },
  { type: "word", text: "growth" },
  { type: "word", text: "and" },
  { type: "word", text: "CRM" },
  { type: "word", text: "automation" },
  { type: "icon", label: "AI & CRM Automation", kind: "automation" },
  { type: "word", text: "—" },
  { type: "word", text: "My3" },
  { type: "word", text: "connects" },
  { type: "word", text: "strategy," },
  { type: "word", text: "craft," },
  { type: "word", text: "and" },
  { type: "word", text: "scale." },
];

const VISION_ICONS = [
  { Icon: Globe, label: "Web Platforms" },
  { Icon: Palette, label: "Visual Identity" },
  { Icon: Target, label: "Paid Acquisition" },
  { Icon: TrendingUp, label: "Search Authority" },
  { Icon: Bot, label: "AI Chatbots" },
  { Icon: Workflow, label: "CRM Automation" },
  { Icon: Layers, label: "Design Systems" },
  { Icon: BarChart3, label: "Growth Reporting" },
];

const WAVE_TOP = serviceCatalogCards.slice(0, 7);
const WAVE_BOTTOM = serviceCatalogCards.slice(7, 14);

export function StatementStaircaseGridSection({
  reduceMotion,
  activeTab,
  onSelectDivision,
}: StatementStaircaseGridSectionProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const stagePinRef = useRef<HTMLDivElement>(null);
  const wavesSectionRef = useRef<HTMLElement>(null);
  const waveTopRef = useRef<HTMLDivElement>(null);
  const waveBottomRef = useRef<HTMLDivElement>(null);

  const [folderTab, setFolderTab] = useState<"divisions" | "industries">("divisions");

  const activeDivision = divisions.find((d) => d.slug === activeTab) ?? divisions[0]!;
  const [hoveredDeliverable, setHoveredDeliverable] = useState<string>(activeDivision.items[0]![0]);

  useEffect(() => {
    setHoveredDeliverable(activeDivision.items[0]![0]);
  }, [activeDivision.slug]);

  // GSAP Pinned Stage 2 + Sinusoidal Opposing Waves
  useEffect(() => {
    if (reduceMotion) return;
    ensureGsapRegistered();

    const stage = stageRef.current;
    const pinEl = stagePinRef.current;
    if (!stage || !pinEl) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // 1. Desktop Shared-Element Morph: Statement Word Scrub + Central Stack -> Diagonal Staircase -> Right Folder 3x2 Grid
      mm.add("(min-width: 900px) and (min-height: 580px)", () => {
        const statementWrap = pinEl.querySelector<HTMLElement>(".st2-statement-wrap");
        const words = gsap.utils.toArray<HTMLElement>(".st2-scrub-word", pinEl);
        const inlineIcons = gsap.utils.toArray<HTMLElement>(".st2-inline-icon", pinEl);
        const stairBadges = gsap.utils.toArray<HTMLElement>(".st2-stair-badge", pinEl);
        const visionWrap = pinEl.querySelector<HTMLElement>(".st2-vision-wrap");
        const visionStagger = gsap.utils.toArray<HTMLElement>(".st2-vision-stagger", pinEl);
        const visionIconNodes = gsap.utils.toArray<HTMLElement>(".st2-vision-icon", pinEl);
        const folderChrome = pinEl.querySelector<HTMLElement>(".st2-folder-chrome");
        const gridSlots = gsap.utils.toArray<HTMLElement>(".st2-grid-slot", pinEl);
        const sharedCards = gsap.utils.toArray<HTMLElement>(".st2-shared-card", pinEl);

        // Initial resting geometry of the 6 cards at center (tight compact stack over central statement)
        const resetCardMetrics = () => {
          const w = pinEl.clientWidth || 1440;
          const h = pinEl.clientHeight || 900;
          const stackW = Math.min(168, Math.max(128, w * 0.115));
          const stackH = stackW * 1.18;
          sharedCards.forEach((card, i) => {
            const spec = stageTwoSharedCards[i]!;
            gsap.set(card, {
              x: (i - 2.5) * 4,
              y: Math.min(64, h * 0.065) + (i - 2.5) * -2,
              width: stackW,
              height: stackH,
              rotation: spec.stackRotate,
              scale: 1 - Math.abs(i - 2.5) * 0.02,
              opacity: 0.94,
              zIndex: 30 + (i === 2 || i === 3 ? 6 : 5 - Math.abs(i - 2.5)),
            });
          });
        };

        resetCardMetrics();
        gsap.set(words, { color: "#4E586B" });
        gsap.set(inlineIcons, { scale: 0.72, opacity: 0.35 });
        gsap.set(stairBadges, { scale: 0.75, opacity: 0 });
        gsap.set(visionWrap, { opacity: 0, pointerEvents: "none" });
        gsap.set(visionStagger, { y: 24, opacity: 0 });
        gsap.set(visionIconNodes, { scale: 0.65, opacity: 0 });
        gsap.set(folderChrome, { opacity: 0 });

        const computeSlotTarget = (index: number) => {
          const slot = gridSlots[index];
          if (!slot) return { x: 0, y: 0, width: 180, height: 150 };
          const pinRect = pinEl.getBoundingClientRect();
          const slotRect = slot.getBoundingClientRect();
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
            scrub: 0.75,
            pin: pinEl,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        // Sub-phase A (0.00 -> 0.32): Word-by-word muted slate -> full white scrub + subtle central deck rotation
        tl.to(
          words,
          {
            color: "#FFFFFF",
            stagger: 0.009,
            duration: 0.06,
            ease: "none",
          },
          0.02
        )
          .to(
            inlineIcons,
            {
              scale: 1,
              opacity: 1,
              stagger: 0.05,
              duration: 0.08,
              ease: "back.out(1.6)",
            },
            0.08
          )
          .to(
            sharedCards,
            {
              rotation: (i: number) => stageTwoSharedCards[i]!.stackRotate * 1.45,
              y: (i: number) => 24 + (i - 2.5) * 4,
              duration: 0.28,
              ease: "sine.inOut",
            },
            0.04
          )

          // Sub-phase B (0.32 -> 0.62): Statement lifts out; 6 shared cards unfold into Diagonal Staircase
          .to(
            statementWrap,
            { y: -80, opacity: 0, duration: 0.16, ease: "power2.in" },
            0.30
          )
          .to(
            sharedCards,
            {
              x: (i: number) => {
                const w = pinEl.clientWidth || 1440;
                const span = Math.min(440, w * 0.34);
                return -span + (i / 5) * (span * 2);
              },
              y: (i: number) => {
                const h = pinEl.clientHeight || 900;
                const vSpan = Math.min(145, h * 0.165);
                return -vSpan + (i / 5) * (vSpan * 2);
              },
              width: () => Math.min(206, Math.max(152, (pinEl.clientWidth || 1440) * 0.142)),
              height: () => Math.min(206, Math.max(152, (pinEl.clientWidth || 1440) * 0.142)) * 1.08,
              rotation: (i: number) => stageTwoSharedCards[i]!.stairRotate,
              scale: 1,
              opacity: 1,
              zIndex: (i: number) => 22 + i,
              duration: 0.26,
              ease: "power3.inOut",
            },
            0.33
          )
          .to(
            stairBadges,
            { scale: 1, opacity: 1, stagger: 0.04, duration: 0.14, ease: "back.out(1.5)" },
            0.46
          )

          // Sub-phase C (0.62 -> 1.00): Shared-Element Staircase-to-Grid (3x2 Folder) Transformation
          .to(
            stairBadges,
            { scale: 0.78, opacity: 0, duration: 0.1, ease: "power1.in" },
            0.60
          )
          .to(
            folderChrome,
            { opacity: 1, duration: 0.18, ease: "power2.out" },
            0.65
          )
          .to(
            sharedCards,
            {
              x: (i: number) => computeSlotTarget(i).x,
              y: (i: number) => computeSlotTarget(i).y,
              width: (i: number) => computeSlotTarget(i).width,
              height: (i: number) => computeSlotTarget(i).height,
              rotation: 0,
              scale: 1,
              zIndex: 35,
              duration: 0.28,
              stagger: { each: 0.014, from: "start" },
              ease: "power3.inOut",
            },
            0.64
          )
          .to(
            visionWrap,
            { opacity: 1, pointerEvents: "auto", duration: 0.05 },
            0.68
          )
          .to(
            visionStagger,
            { y: 0, opacity: 1, stagger: 0.05, duration: 0.2, ease: "power3.out" },
            0.70
          )
          .to(
            visionIconNodes,
            { scale: 1, opacity: 1, stagger: 0.025, duration: 0.18, ease: "back.out(1.5)" },
            0.78
          );
      });

      // 2. Sinusoidal Counter-Scrolling Curved Wave Gallery (Section 13)
      if (wavesSectionRef.current && waveTopRef.current && waveBottomRef.current) {
        const topCards = gsap.utils.toArray<HTMLElement>(".wave-top-card", waveTopRef.current);
        const bottomCards = gsap.utils.toArray<HTMLElement>(".wave-bottom-card", waveBottomRef.current);

        const applyWaveCurve = (progress: number) => {
          const amp = 20;
          topCards.forEach((card, i) => {
            const phase = i * 0.85 + progress * Math.PI * 1.4;
            gsap.set(card, {
              y: Math.sin(phase) * amp,
              rotation: Math.cos(phase) * 4.5,
            });
          });
          bottomCards.forEach((card, i) => {
            const phase = i * 0.85 - progress * Math.PI * 1.4 + Math.PI * 0.6;
            gsap.set(card, {
              y: Math.sin(phase) * amp,
              rotation: Math.cos(phase) * -4.5,
            });
          });
        };

        applyWaveCurve(0);

        gsap.to(waveTopRef.current, {
          xPercent: -12,
          ease: "none",
          scrollTrigger: {
            trigger: wavesSectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.55,
            onUpdate: (self) => applyWaveCurve(self.progress),
          },
        });

        gsap.fromTo(
          waveBottomRef.current,
          { xPercent: -12 },
          {
            xPercent: 0,
            ease: "none",
            scrollTrigger: {
              trigger: wavesSectionRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.55,
            },
          }
        );

        const centerNodes = gsap.utils.toArray<HTMLElement>(".wave-center-reveal", wavesSectionRef.current);
        gsap.fromTo(
          centerNodes,
          { y: 24, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.08,
            duration: 0.7,
            ease: "power3.out",
            scrollTrigger: {
              trigger: wavesSectionRef.current,
              start: "top 72%",
              once: true,
            },
          }
        );
      }
    }, stage.parentElement ?? stage);

    return () => ctx.revert();
  }, [reduceMotion]);

  return (
    <>
      {/* SECTION 10, 11 & 12: UNIFIED PINNED STATEMENT WORD-SCRUB -> DIAGONAL STAIRCASE -> 3x2 FOLDER GRID */}
      <section
        ref={stageRef}
        data-reel-scene="ecosystem"
        className="relative z-10 w-full min-[900px]:min-h-[340vh]"
        aria-label="Digital Ecosystem and Capability Architecture"
      >
        <div className="w-full">
          <div
            ref={stagePinRef}
            className="relative flex w-full items-center justify-center overflow-hidden px-5 py-16 sm:px-8 md:px-14 lg:px-20 min-[900px]:h-screen min-[900px]:pt-[88px] min-[900px]:pb-8"
          >
          {/* Layer A: Centered Muted->White Scroll Statement (Visible in phase 0..0.34, static block on mobile) */}
          <div className="st2-statement-wrap pointer-events-none relative z-10 mx-auto max-w-4xl text-center min-[900px]:-mt-24">
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-[#142B4A]/50 px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-blue-200">
              <Sparkles aria-hidden="true" className="size-3 text-blue-400" />
              Integrated Digital Delivery
            </span>
            <p className="text-[clamp(1.6rem,3.3vw,3.1rem)] font-semibold leading-[1.2] tracking-[-0.025em] text-[#4E586B]">
              {STATEMENT_TOKENS.map((tok, idx) =>
                tok.type === "word" ? (
                  <span
                    key={idx}
                    className={`st2-scrub-word inline-block mr-[0.24em] ${
                      reduceMotion ? "text-white" : ""
                    }`}
                  >
                    {tok.text}
                  </span>
                ) : (
                  <span
                    key={idx}
                    aria-label={tok.label}
                    className="st2-inline-icon mr-[0.24em] inline-flex size-8 items-center justify-center rounded-lg border border-blue-400/35 bg-[#142B4A] align-middle text-blue-300 shadow-sm sm:size-10"
                  >
                    {tok.kind === "web" && <Code2 aria-hidden="true" className="size-4 sm:size-5" />}
                    {tok.kind === "brand" && <Palette aria-hidden="true" className="size-4 sm:size-5" />}
                    {tok.kind === "automation" && <Bot aria-hidden="true" className="size-4 sm:size-5" />}
                  </span>
                )
              )}
            </p>
          </div>

          {/* Floating Staircase Labels (Visible during Diagonal Staircase mid-phase) */}
          <span className="st2-stair-badge pointer-events-none absolute top-[18%] left-[12%] z-30 hidden rounded-full border border-blue-400/30 bg-[#142B4A]/95 px-3 py-1 text-xs font-medium text-blue-100 shadow-lg backdrop-blur-md min-[900px]:inline-flex">
            @webcraft
          </span>
          <span className="st2-stair-badge pointer-events-none absolute top-[38%] left-[44%] z-30 hidden rounded-full border border-white/15 bg-[#10141D]/95 px-3 py-1 text-xs font-medium text-slate-200 shadow-lg backdrop-blur-md min-[900px]:inline-flex">
            @paidmedia
          </span>
          <span className="st2-stair-badge pointer-events-none absolute right-[10%] bottom-[22%] z-30 hidden rounded-full border border-blue-400/30 bg-[#142B4A]/95 px-3 py-1 text-xs font-medium text-blue-100 shadow-lg backdrop-blur-md min-[900px]:inline-flex">
            @automation
          </span>

          {/* Layer C Structural Columns (Left Vision + Right Folder Grid Slots) */}
          <div className="pointer-events-none absolute inset-x-0 top-[88px] bottom-8 z-20 mx-auto hidden max-w-[1440px] items-center justify-between gap-10 px-8 md:px-14 lg:px-20 min-[900px]:flex">
            {/* Left Column: Vision Copy + Vector Icons */}
            <div className="st2-vision-wrap w-[41%]">
              <span className="st2-vision-stagger mb-3 inline-block text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">
                Our Vision &amp; Architecture
              </span>
              <h2 className="st2-vision-stagger max-w-[14ch] text-[clamp(2rem,3.4vw,3.3rem)] font-semibold leading-[1.03] tracking-[-0.02em] text-white">
                Built as one digital system.
              </h2>
              <p className="st2-vision-stagger mt-4 max-w-[40ch] text-sm leading-relaxed text-[#A3ACBC] lg:text-base">
                Instead of disconnected freelancers and silos, every website, brand identity, paid
                campaign, and AI workflow reinforces the same business outcome.
              </p>

              {/* Floating Staggered Outline Icons */}
              <div className="mt-8 grid max-w-[360px] grid-cols-4 gap-3">
                {VISION_ICONS.map(({ Icon, label }) => (
                  <div
                    key={label}
                    title={label}
                    className="st2-vision-icon flex h-12 w-12 items-center justify-center rounded-xl border border-blue-400/20 bg-[#10141D]/90 text-blue-300 shadow-sm"
                  >
                    <Icon aria-hidden="true" className="size-5 stroke-[1.7]" />
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Stepped Folder Chrome + 3x2 Alignment Target Grid Slots */}
            <div className="st2-folder-chrome pointer-events-auto relative w-[55%] rounded-2xl border border-blue-400/25 bg-[#10141D]/95 p-5 shadow-[0_32px_90px_-24px_rgba(8,18,40,0.8)]">
              {/* Folder Top Header with Interactive Tab Selector */}
              <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-3.5">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setFolderTab("divisions")}
                    className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                      folderTab === "divisions"
                        ? "bg-[#2456A4] text-white"
                        : "bg-white/5 text-slate-400 hover:text-white"
                    }`}
                  >
                    Core Service Pillars
                  </button>
                  <button
                    type="button"
                    onClick={() => setFolderTab("industries")}
                    className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                      folderTab === "industries"
                        ? "bg-[#2456A4] text-white"
                        : "bg-white/5 text-slate-400 hover:text-white"
                    }`}
                  >
                    Industries Served
                  </button>
                </div>
                <span className="font-mono text-[11px] uppercase tracking-widest text-[#7F8AA0]">
                  {folderTab === "divisions" ? "06 Capabilities" : "06 Sectors"}
                </span>
              </div>

              {/* 3x2 Target Coordinate Slots (Exact morph destination of the 6 shared cards) */}
              <div className="relative grid grid-cols-3 grid-rows-2 gap-3.5">
                {stageTwoSharedCards.map((slotItem, idx) => (
                  <div
                    key={slotItem.id}
                    aria-hidden={folderTab === "divisions"}
                    className="st2-grid-slot aspect-[4/3.6] w-full rounded-xl border border-white/5 bg-[#080B12]/40"
                  >
                    {folderTab === "industries" && (
                      <button
                        type="button"
                        onClick={() => {
                          onSelectDivision(sectorGridCards[idx]!.slug);
                          scrollToSectionId("divisions-directory");
                        }}
                        className="group relative z-40 h-full w-full overflow-hidden rounded-xl border border-blue-400/25 bg-[#080B12] text-left focus-visible:outline-2 focus-visible:outline-blue-400"
                      >
                        <img
                          src={sectorGridCards[idx]!.image}
                          alt={sectorGridCards[idx]!.title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#080B12]/90 via-[#080B12]/20 to-transparent" />
                        <div className="absolute inset-x-0 bottom-0 p-2.5">
                          <span className="block text-[10px] font-medium uppercase tracking-wider text-blue-300">
                            {sectorGridCards[idx]!.metric}
                          </span>
                          <span className="block truncate text-xs font-semibold text-white">
                            {sectorGridCards[idx]!.title}
                          </span>
                        </div>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* The 6 ACTUAL SHARED DOM CARDS (Stack Center -> Diagonal Staircase -> Folder 3x2 Cells) */}
          <div className="pointer-events-none absolute inset-0 hidden items-center justify-center min-[900px]:flex">
            {stageTwoSharedCards.map((card) => (
              <button
                key={card.id}
                type="button"
                onClick={() => {
                  onSelectDivision(card.slug);
                  scrollToSectionId("divisions-directory");
                }}
                aria-label={`${card.title} (${card.metric})`}
                className={`st2-shared-card group pointer-events-auto absolute overflow-hidden rounded-xl border border-white/15 bg-[#10141D] text-left shadow-[0_20px_50px_-14px_rgba(0,0,0,0.8)] transition-[border-color,opacity] duration-300 hover:border-blue-400/60 focus-visible:outline-2 focus-visible:outline-blue-400 ${
                  folderTab === "industries" ? "!pointer-events-none !opacity-0" : ""
                }`}
              >
                <img
                  src={card.image}
                  alt={card.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#080B12]/90 via-[#080B12]/25 to-transparent" />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 p-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-blue-300">
                      {card.handle}
                    </span>
                    <span className="rounded-full bg-[#142B4A]/90 px-2 py-0.5 text-[10px] font-medium text-blue-100">
                      {card.metric}
                    </span>
                  </div>
                  <span className="mt-0.5 block truncate text-xs font-semibold text-white">
                    {card.title}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
        </div>

        {/* Mobile / Reduced Motion Clean Fallback for Stage 2 */}
        <div className="mx-auto max-w-6xl px-5 pb-12 sm:px-8 min-[900px]:hidden">
          <div className="mb-8 rounded-2xl border border-white/10 bg-[#10141D] p-5">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">
              Our Vision &amp; Architecture
            </span>
            <h2 className="mt-2 text-2xl font-semibold text-white">
              Built as one digital system.
            </h2>
            <p className="mt-2 text-sm text-[#A3ACBC]">
              Every website, visual identity, performance campaign, and AI automation connects to
              drive real commercial growth.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {stageTwoSharedCards.map((card) => (
              <button
                key={card.id}
                type="button"
                onClick={() => {
                  onSelectDivision(card.slug);
                  scrollToSectionId("divisions-directory");
                }}
                className="relative aspect-[4/3.5] overflow-hidden rounded-xl border border-white/10 bg-[#10141D] text-left"
              >
                <img src={card.image} alt={card.title} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#080B12]/90 via-transparent to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-2.5">
                  <span className="block text-[10px] text-blue-300">{card.metric}</span>
                  <span className="block truncate text-xs font-semibold text-white">{card.title}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* FULL INTERACTIVE 5-DIVISION / 37-DELIVERABLE DIRECTORY */}
      <section
        id="divisions-directory"
        data-reel-scene="directory"
        className="relative z-10 mx-auto max-w-[1440px] px-5 py-18 sm:px-8 md:px-14 lg:px-20 lg:py-24"
        aria-label="Complete 37 Services and Deliverables Directory"
      >
        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">
              Complete Scope · 37 Deliverables
            </span>
            <h2 className="mt-2 text-[clamp(1.9rem,3.4vw,3.1rem)] font-semibold leading-[1.04] tracking-[-0.03em] text-white">
              Explore Every Service Division
            </h2>
          </div>

          <div
            role="tablist"
            aria-label="Select a My3 Digital service division"
            className="flex flex-wrap gap-2"
          >
            {divisions.map((div) => {
              const isSelected = div.slug === activeDivision.slug;
              return (
                <button
                  key={div.slug}
                  role="tab"
                  aria-selected={isSelected}
                  type="button"
                  onClick={() => onSelectDivision(div.slug)}
                  className={`rounded-full px-4 py-2 text-xs font-semibold transition focus-visible:outline-2 focus-visible:outline-blue-400 ${
                    isSelected
                      ? "bg-[#2456A4] text-white shadow-md shadow-blue-950/60"
                      : "border border-white/12 bg-[#10141D] text-slate-300 hover:border-blue-400/40 hover:text-white"
                  }`}
                >
                  {divisionTabLabels[div.slug] ?? div.short} ({div.items.length})
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid gap-8 rounded-2xl border border-white/10 bg-[#10141D]/95 p-6 shadow-2xl md:p-8 lg:grid-cols-12">
          {/* Deliverable List */}
          <div className="lg:col-span-7">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
              <div>
                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-400">
                  {activeDivision.eyebrow}
                </span>
                <h3 className="mt-1 text-xl font-semibold text-white sm:text-2xl">
                  {activeDivision.heading}
                </h3>
              </div>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-[#2456A4] px-4 py-2 text-xs font-semibold text-white transition hover:bg-blue-600"
              >
                {activeDivision.cta}
                <ArrowRight aria-hidden="true" className="size-3.5" />
              </Link>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {activeDivision.items.map(([itemTitle, itemDesc]) => {
                const isActiveItem = hoveredDeliverable === itemTitle;
                return (
                  <button
                    key={itemTitle}
                    type="button"
                    onMouseEnter={() => setHoveredDeliverable(itemTitle)}
                    onFocus={() => setHoveredDeliverable(itemTitle)}
                    onClick={() => setHoveredDeliverable(itemTitle)}
                    className={`group flex flex-col justify-between rounded-xl border p-4 text-left transition ${
                      isActiveItem
                        ? "border-blue-400/50 bg-[#142B4A]/45"
                        : "border-white/8 bg-[#0B0F19]/80 hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-sm font-semibold text-white">{itemTitle}</span>
                      <Check
                        aria-hidden="true"
                        className={`size-4 shrink-0 ${
                          isActiveItem ? "text-blue-400" : "text-slate-500"
                        }`}
                      />
                    </div>
                    <p className="mt-1.5 text-xs leading-relaxed text-[#A3ACBC]">{itemDesc}</p>
                  </button>
                );
              })}
            </div>
            {activeDivision.extra && (
              <p className="mt-4 text-xs font-medium text-blue-300/90">{activeDivision.extra}</p>
            )}
          </div>

          {/* Visual Deliverable Preview */}
          <div className="flex flex-col justify-between rounded-2xl border border-white/10 bg-[#080B12] p-5 lg:col-span-5">
            <div>
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-white/10">
                <img
                  src={
                    capabilityImages[hoveredDeliverable] ??
                    "/insights/premium-websites-that-convert.jpg"
                  }
                  alt={hoveredDeliverable}
                  className="h-full w-full object-cover transition-all duration-500"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#080B12]/80 via-transparent to-transparent" />
                <span className="absolute bottom-3 left-3 rounded-full border border-blue-400/30 bg-[#142B4A]/90 px-3 py-1 text-xs font-medium text-blue-100 backdrop-blur-md">
                  {hoveredDeliverable}
                </span>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-[#A3ACBC]">
                {activeDivision.intro[0]}
              </p>
              {activeDivision.intro[1] && (
                <p className="mt-2 text-xs leading-relaxed text-[#7F8AA0]">
                  {activeDivision.intro[1]}
                </p>
              )}
            </div>

            <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4 text-xs text-slate-300">
              <span>{activeDivision.items.length} Specialized Deliverables</span>
              <Link
                to="/contact"
                className="font-semibold text-blue-400 transition hover:text-blue-300"
              >
                Request Scope &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 13: COUNTER-SCROLLING SINUSOIDAL CURVED WAVE GALLERY (Reference 00:20.5–00:23.8) */}
      <section
        ref={wavesSectionRef}
        data-reel-scene="waves"
        className="relative z-10 overflow-hidden py-20 lg:py-28"
        aria-label="Capabilities wave showcase and real company benchmarks"
      >
        {/* Top Sinusoidal Track */}
        <div ref={waveTopRef} className="mb-10 flex w-max gap-5 will-change-transform px-6">
          {[...WAVE_TOP, ...WAVE_TOP].map((item, idx) => (
            <button
              key={`top-${item.id}-${idx}`}
              type="button"
              onClick={() => {
                onSelectDivision(item.slug);
                scrollToSectionId("divisions-directory");
              }}
              className="wave-top-card group relative h-[156px] w-[205px] shrink-0 overflow-hidden rounded-2xl border border-white/12 bg-[#10141D] text-left shadow-xl sm:h-[176px] sm:w-[230px]"
            >
              <img
                src={item.image}
                alt={item.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#080B12]/90 via-[#080B12]/15 to-transparent" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 p-3">
                <span className="block text-[10px] font-medium uppercase tracking-wider text-blue-300">
                  {item.handle}
                </span>
                <span className="block truncate text-xs font-semibold text-white">
                  {item.title}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Centered Focal Editorial Area + Real My3 Stats */}
        <div className="mx-auto my-8 max-w-4xl px-5 text-center sm:px-8">
          <span className="wave-center-reveal inline-block text-xs font-semibold uppercase tracking-[0.22em] text-blue-400">
            Proven Track Record
          </span>
          <h2 className="wave-center-reveal mx-auto mt-3 max-w-[16ch] text-[clamp(2rem,4vw,3.6rem)] font-semibold leading-[1.03] tracking-[-0.03em] text-white">
            Built for Ambitious Businesses
          </h2>
          <p className="wave-center-reveal mx-auto mt-3 max-w-[50ch] text-sm leading-relaxed text-[#A3ACBC] sm:text-base">
            From high-converting corporate web platforms to performance acquisition and AI workflows,
            My3 executes with accountability.
          </p>

          <div className="wave-center-reveal mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {stats.map(([label, num, suffix]) => (
              <div
                key={label}
                className="rounded-2xl border border-white/10 bg-[#10141D]/90 px-4 py-4"
              >
                <div className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                  {num}
                  <span className="text-blue-400">{suffix}</span>
                </div>
                <div className="mt-1 text-[11px] leading-snug text-[#8C96A9]">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Opposing Sinusoidal Track */}
        <div ref={waveBottomRef} className="mt-10 flex w-max gap-5 will-change-transform px-6">
          {[...WAVE_BOTTOM, ...WAVE_BOTTOM].map((item, idx) => (
            <button
              key={`bot-${item.id}-${idx}`}
              type="button"
              onClick={() => {
                onSelectDivision(item.slug);
                scrollToSectionId("divisions-directory");
              }}
              className="wave-bottom-card group relative h-[156px] w-[205px] shrink-0 overflow-hidden rounded-2xl border border-white/12 bg-[#10141D] text-left shadow-xl sm:h-[176px] sm:w-[230px]"
            >
              <img
                src={item.image}
                alt={item.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#080B12]/90 via-[#080B12]/15 to-transparent" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 p-3">
                <span className="block text-[10px] font-medium uppercase tracking-wider text-blue-300">
                  {item.handle}
                </span>
                <span className="block truncate text-xs font-semibold text-white">
                  {item.title}
                </span>
              </div>
            </button>
          ))}
        </div>
      </section>
    </>
  );
}
