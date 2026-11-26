import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BarChart3,
  Bot,
  Check,
  Code2,
  Eye,
  Globe,
  Layers,
  Palette,
  PenTool,
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
  | { type: "word"; text: string; highlight?: boolean }
  | { type: "icon"; label: string; kind: "web" | "brand" | "automation" };

// Compact 3-line sentence matching Motion Study 03 (F0312–F0348)
const STATEMENT_TOKENS: StatementToken[] = [
  { type: "word", text: "Whether" },
  { type: "word", text: "you're" },
  { type: "word", text: "launching" },
  { type: "word", text: "a" },
  { type: "word", text: "conversion" },
  { type: "word", text: "site" },
  { type: "word", text: "/" },
  { type: "word", text: "or" },
  { type: "word", text: "scaling" },
  { type: "word", text: "a" },
  { type: "word", text: "connected", highlight: true },
  { type: "word", text: "brand" },
  { type: "icon", label: "Brand & Creative", kind: "brand" },
  { type: "word", text: "My3" },
  { type: "word", text: "unites" },
  { type: "word", text: "strategy," },
  { type: "icon", label: "Web & Tech", kind: "web" },
  { type: "word", text: "media" },
  { type: "icon", label: "CRM Automation", kind: "automation" },
  { type: "word", text: "&" },
  { type: "word", text: "scale." },
];

// Organic 7 circular floating icon discs matching F0456 cluster geometry
const VISION_CLOUD_ICONS = [
  { Icon: Globe, label: "Web Platforms", left: "14%", top: "4%" },
  { Icon: PenTool, label: "Brand Identity", left: "0%", top: "38%" },
  { Icon: Palette, label: "Design Systems", left: "24%", top: "36%" },
  { Icon: Target, label: "Paid Acquisition", left: "52%", top: "42%" },
  { Icon: Workflow, label: "CRM Automation", left: "80%", top: "30%" },
  { Icon: Layers, label: "Architecture", left: "40%", top: "74%" },
  { Icon: TrendingUp, label: "Search Growth", left: "72%", top: "76%" },
];

const WAVE_TOP = serviceCatalogCards.slice(0, 10);
const WAVE_BOTTOM = serviceCatalogCards.slice(5, 15);

function MiniSpeechPill({
  label,
  tone = "dark",
  className = "",
}: {
  label: string;
  tone?: "blue" | "dark" | "gold";
  className?: string;
}) {
  const palette =
    tone === "blue"
      ? "bg-[#2456A4] text-white"
      : tone === "gold"
        ? "bg-[#3B82F6] text-white"
        : "bg-[#10141D] text-slate-200 border border-white/15";
  const tail =
    tone === "blue" ? "bg-[#2456A4]" : tone === "gold" ? "bg-[#3B82F6]" : "bg-[#10141D]";
  return (
    <span
      className={`relative inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold shadow-xl ${palette} ${className}`}
    >
      {label}
      <span
        aria-hidden="true"
        className={`absolute -bottom-1 left-1/2 size-2 -translate-x-1/2 rotate-45 ${tail}`}
      />
    </span>
  );
}

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

  // GSAP Pinned Stage 2 (F0312->F0456) + Dramatic Parabolic Curved Gallery (F0504->F0540)
  useEffect(() => {
    if (reduceMotion) return;
    ensureGsapRegistered();

    const stage = stageRef.current;
    const pinEl = stagePinRef.current;
    if (!stage || !pinEl) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // Desktop Pinned Shared-Element Morph: Statement Stack -> Diagonal Staircase + Summary Overlay -> Stepped Folder 3x2 Grid
      mm.add("(min-width: 900px) and (min-height: 580px)", () => {
        const statementWrap = pinEl.querySelector<HTMLElement>(".st2-statement-wrap");
        const words = gsap.utils.toArray<HTMLElement>(".st2-scrub-word", pinEl);
        const highlightWords = gsap.utils.toArray<HTMLElement>(".st2-highlight-word", pinEl);
        const inlineIcons = gsap.utils.toArray<HTMLElement>(".st2-inline-icon", pinEl);
        const dockThree = pinEl.querySelector<HTMLElement>(".st2-bottom-three");
        const stackPills = gsap.utils.toArray<HTMLElement>(".st2-stack-pill", pinEl);
        const stairSummaryCard = pinEl.querySelector<HTMLElement>(".st2-stair-summary");
        const stairBadges = gsap.utils.toArray<HTMLElement>(".st2-stair-badge", pinEl);
        const visionWrap = pinEl.querySelector<HTMLElement>(".st2-vision-wrap");
        const visionStagger = gsap.utils.toArray<HTMLElement>(".st2-vision-stagger", pinEl);
        const visionIconNodes = gsap.utils.toArray<HTMLElement>(".st2-vision-icon", pinEl);
        const folderChrome = pinEl.querySelector<HTMLElement>(".st2-folder-chrome");
        const gridSlots = gsap.utils.toArray<HTMLElement>(".st2-grid-slot", pinEl);
        const sharedCards = gsap.utils.toArray<HTMLElement>(".st2-shared-card", pinEl);

        const resetCardMetrics = () => {
          const w = pinEl.clientWidth || 1440;
          const h = pinEl.clientHeight || 900;
          const stackW = Math.min(182, Math.max(138, w * 0.125));
          const stackH = stackW * 1.24; // 4:5 portrait matching F0348 & F0396
          sharedCards.forEach((card, i) => {
            const spec = stageTwoSharedCards[i]!;
            const isFront = i === 5;
            gsap.set(card, {
              x: (i - 2.5) * 3,
              y: -h * 0.015 - i * 4,
              width: stackW,
              height: stackH,
              rotation: isFront ? -6 : spec.stackRotate * 0.45,
              scale: isFront ? 1.04 : 0.96 - (5 - i) * 0.015,
              opacity: 1,
              zIndex: 25 + i,
            });
          });
        };

        resetCardMetrics();
        gsap.set(words, { color: "#4E586B" });
        gsap.set(highlightWords, { color: "#4E586B" });
        gsap.set(inlineIcons, { scale: 0.72, opacity: 0.35 });
        if (dockThree) gsap.set(dockThree, { opacity: 0, y: 12, scale: 0.88 });
        gsap.set(stackPills, { opacity: 0, scale: 0.75 });
        if (stairSummaryCard) gsap.set(stairSummaryCard, { opacity: 0, scale: 0.88, y: 16 });
        gsap.set(stairBadges, { scale: 0.75, opacity: 0 });
        gsap.set(visionWrap, { opacity: 0, pointerEvents: "none" });
        gsap.set(visionStagger, { y: 20, opacity: 0 });
        gsap.set(visionIconNodes, { scale: 0.55, opacity: 0 });
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

        // Sub-phase A (0.00 -> 0.32, F0312->F0348): Word contrast scrub + rotating tilted front card + speech bubbles & bottom 3-icon row
        tl.to(words, { color: "#FFFFFF", stagger: 0.009, duration: 0.06, ease: "none" }, 0.02)
          .to(highlightWords, { color: "#60A5FA", stagger: 0.01, duration: 0.07, ease: "none" }, 0.09)
          .to(inlineIcons, { scale: 1, opacity: 1, stagger: 0.04, duration: 0.07, ease: "back.out(1.6)" }, 0.07)
          .to(stackPills, { opacity: 1, scale: 1, stagger: 0.04, duration: 0.1, ease: "back.out(1.5)" }, 0.06)
          .to(dockThree ?? [], { opacity: 1, y: 0, scale: 1, duration: 0.12, ease: "power2.out" }, 0.14)
          .to(
            sharedCards,
            {
              rotation: (i: number) => (i === 5 ? 9 : stageTwoSharedCards[i]!.stackRotate * 1.25),
              y: (i: number) => -(pinEl.clientHeight || 900) * 0.02 - i * 3,
              duration: 0.28,
              ease: "sine.inOut",
            },
            0.04
          )

          // Sub-phase B (0.32 -> 0.62, F0372->F0396): Sentence rises up; deck opens into Portrait Diagonal Staircase + Summary Floating Card
          .to(statementWrap, { y: -110, opacity: 0, duration: 0.15, ease: "power2.in" }, 0.30)
          .to(stackPills, { opacity: 0, scale: 0.75, duration: 0.09 }, 0.30)
          .to(dockThree ?? [], { opacity: 0, y: -36, duration: 0.1 }, 0.31)
          .to(
            sharedCards,
            {
              x: (i: number) => {
                const w = pinEl.clientWidth || 1440;
                const span = Math.min(450, w * 0.345);
                return -span + (i / 5) * (span * 2);
              },
              y: (i: number) => {
                const h = pinEl.clientHeight || 900;
                const vSpan = Math.min(148, h * 0.168);
                return -vSpan + (i / 5) * (vSpan * 2);
              },
              width: () => Math.min(204, Math.max(150, (pinEl.clientWidth || 1440) * 0.14)),
              height: () => Math.min(204, Math.max(150, (pinEl.clientWidth || 1440) * 0.14)) * 1.24,
              rotation: (i: number) => [-3, 1.5, -2.5, 2, -2, 4][i] ?? 0,
              scale: 1,
              zIndex: (i: number) => 22 + i,
              duration: 0.25,
              ease: "power3.inOut",
            },
            0.33
          )
          .to(
            stairSummaryCard ?? [],
            { opacity: 1, scale: 1, y: 0, duration: 0.14, ease: "back.out(1.3)" },
            0.45
          )
          .to(
            stairBadges,
            { scale: 1, opacity: 1, duration: 0.12, ease: "back.out(1.5)" },
            0.47
          )

          // Sub-phase C (0.62 -> 1.00, F0420->F0456): Staircase glides into exact 3x2 Folder Grid + Vision & Asymmetric 7-Icon Cloud Left
          .to(stairSummaryCard ?? [], { opacity: 0, scale: 0.85, duration: 0.09 }, 0.60)
          .to(stairBadges, { scale: 0.75, opacity: 0, duration: 0.09 }, 0.60)
          .to(folderChrome, { opacity: 1, duration: 0.18, ease: "power2.out" }, 0.65)
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
          .to(visionWrap, { opacity: 1, pointerEvents: "auto", duration: 0.05 }, 0.68)
          .to(visionStagger, { y: 0, opacity: 1, stagger: 0.05, duration: 0.19, ease: "power3.out" }, 0.70)
          .to(
            visionIconNodes,
            { scale: 1, opacity: 1, stagger: 0.03, duration: 0.18, ease: "back.out(1.6)" },
            0.78
          );
      });

      // Motion Study 04 Final Showcase (F0504 -> F0540): Opposing Parabolic Curved Image Gallery framing central text
      if (wavesSectionRef.current && waveTopRef.current && waveBottomRef.current) {
        const topCards = gsap.utils.toArray<HTMLElement>(".wave-top-card", waveTopRef.current);
        const bottomCards = gsap.utils.toArray<HTMLElement>(".wave-bottom-card", waveBottomRef.current);

        const applyParabolicArc = (trackEl: HTMLElement | null, cards: HTMLElement[], invert: boolean) => {
          if (!trackEl || !wavesSectionRef.current) return;
          const viewCenter = window.innerWidth / 2;
          const halfSpan = Math.max(420, window.innerWidth * 0.56);
          cards.forEach((card) => {
            const rect = card.getBoundingClientRect();
            const cardCenter = rect.left + rect.width / 2;
            const norm = Math.max(-1.2, Math.min(1.2, (cardCenter - viewCenter) / halfSpan));
            // Parabolic dome on top (center highest = -42px, edges +28px) and inverse bowl on bottom (center lowest = +42px, edges -28px)
            const parabola = norm * norm;
            const y = invert ? 42 - parabola * 66 : -42 + parabola * 66;
            const rot = invert ? norm * -7 : norm * 7;
            gsap.set(card, { y, rotation: rot });
          });
        };

        const updateAllArcs = () => {
          applyParabolicArc(waveTopRef.current, topCards, false);
          applyParabolicArc(waveBottomRef.current, bottomCards, true);
        };

        updateAllArcs();

        gsap.to(waveTopRef.current, {
          xPercent: -14,
          ease: "none",
          scrollTrigger: {
            trigger: wavesSectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.55,
            onUpdate: updateAllArcs,
          },
        });

        gsap.fromTo(
          waveBottomRef.current,
          { xPercent: -14 },
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
      {/* MOTION STUDY 03 & 04: STATEMENT WORD SCRUB -> DIAGONAL STAIRCASE -> STEPPED FOLDER 3x2 GRID */}
      <section
        ref={stageRef}
        data-reel-scene="ecosystem"
        className="relative z-10 w-full min-[900px]:min-h-[340vh]"
        aria-label="Digital Ecosystem and Capability Architecture"
      >
        <div className="w-full">
          <div
            ref={stagePinRef}
            className="relative flex w-full flex-col items-center justify-center overflow-hidden px-5 py-16 sm:px-8 md:px-14 lg:px-20 min-[900px]:h-screen min-[900px]:pt-[88px] min-[900px]:pb-8"
          >
            {/* Layer A: Compact 3-line Muted->Contrast Scrub Sentence + Bottom 3-Icon Cluster (F0312->F0348) */}
            <div className="st2-statement-wrap pointer-events-none relative z-10 mx-auto max-w-4xl text-center">
              <p className="text-[clamp(1.65rem,3.3vw,3.15rem)] font-semibold leading-[1.2] tracking-[-0.02em] text-[#4E586B]">
                {STATEMENT_TOKENS.map((tok, idx) =>
                  tok.type === "word" ? (
                    <span
                      key={idx}
                      className={`inline-block mr-[0.23em] ${
                        tok.highlight
                          ? `st2-highlight-word ${reduceMotion ? "text-blue-400" : ""}`
                          : `st2-scrub-word ${reduceMotion ? "text-white" : ""}`
                      }`}
                    >
                      {tok.text}
                    </span>
                  ) : (
                    <span
                      key={idx}
                      aria-label={tok.label}
                      className="st2-inline-icon mr-[0.23em] inline-flex size-8 items-center justify-center rounded-lg border border-blue-400/35 bg-[#142B4A] align-middle text-blue-300 shadow-sm sm:size-10"
                    >
                      {tok.kind === "web" && <Code2 aria-hidden="true" className="size-4 sm:size-5" />}
                      {tok.kind === "brand" && <Palette aria-hidden="true" className="size-4 sm:size-5" />}
                      {tok.kind === "automation" && <Bot aria-hidden="true" className="size-4 sm:size-5" />}
                    </span>
                  )
                )}
              </p>

              {/* Bottom Centered 3 Micro Icons matching F0348 */}
              <div className="st2-bottom-three mt-8 inline-flex items-center gap-3">
                {[
                  { Icon: Code2, key: "web" },
                  { Icon: Layers, key: "sys" },
                  { Icon: BarChart3, key: "ads" },
                ].map(({ Icon, key }) => (
                  <span
                    key={key}
                    className="flex size-9 items-center justify-center rounded-xl border border-white/15 bg-[#10141D] text-blue-300 shadow-md"
                  >
                    <Icon aria-hidden="true" className="size-4" />
                  </span>
                ))}
              </div>
            </div>

            {/* Central Stack Speech Bubbles matching F0336 / F0348 */}
            <div className="st2-stack-pill pointer-events-none absolute top-[34%] left-[25%] z-30 hidden min-[900px]:block">
              <MiniSpeechPill label="@webcraft" tone="dark" />
            </div>
            <div className="st2-stack-pill pointer-events-none absolute right-[24%] top-[36%] z-30 hidden min-[900px]:block">
              <MiniSpeechPill label="@growth" tone="blue" />
            </div>

            {/* Diagonal Staircase Speech Bubble + Floating Editorial Card matching F0396 */}
            <div className="st2-stair-badge pointer-events-none absolute top-[28%] left-[57%] z-30 hidden min-[900px]:block">
              <MiniSpeechPill label="@paidmedia" tone="gold" />
            </div>
            <div className="st2-stair-summary pointer-events-none absolute top-[29%] left-[22%] z-40 hidden w-[235px] rounded-2xl border border-blue-300/30 bg-white/95 p-4 text-left text-slate-950 shadow-2xl min-[900px]:block">
              <div className="flex items-start justify-between gap-2">
                <h3
                  style={{ color: "#080B12" }}
                  className="text-sm font-bold leading-snug text-slate-950"
                >
                  Where Strategy Meets Conversion
                </h3>
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#080B12] text-white">
                  <Sparkles aria-hidden="true" className="size-3" />
                </span>
              </div>
              <p className="mt-2.5 text-[11px] leading-relaxed text-slate-700">
                5 interconnected divisions spanning websites, brand identity, performance ads &amp; AI.
              </p>
            </div>

            {/* Layer C Structural Columns (Vision + 7 Organic Icon Cloud Left & Stepped Folder Grid Right matching F0456) */}
            <div className="pointer-events-none absolute inset-x-0 top-[88px] bottom-8 z-20 mx-auto hidden max-w-[1440px] items-center justify-between gap-10 px-8 md:px-14 lg:px-20 min-[900px]:flex">
              {/* Left Column: Micro Icon + Two-Tone Heading + Copy + Organic 7-Icon Cloud */}
              <div className="st2-vision-wrap w-[42%]">
                <div className="st2-vision-stagger mb-5 flex size-8 items-center justify-center rounded-full border border-white/15 bg-[#10141D] text-blue-300">
                  <Eye aria-hidden="true" className="size-4" />
                </div>
                <h2 className="st2-vision-stagger max-w-[14ch] text-[clamp(2.1rem,3.6vw,3.5rem)] font-semibold leading-[1.03] tracking-[-0.02em] text-white">
                  Our vision <span className="block text-[#7F8AA0]">for digital scale.</span>
                </h2>
                <p className="st2-vision-stagger mt-3.5 max-w-[38ch] text-xs leading-relaxed text-[#A3ACBC] lg:text-sm">
                  Every asset, interface, campaign and automation pipeline aligns toward compounding
                  commercial growth.
                </p>

                {/* Organic Floating Cloud of 7 Circular Vector Icon Discs matching F0456 */}
                <div className="relative mt-8 h-[165px] w-full max-w-[330px]">
                  {VISION_CLOUD_ICONS.map(({ Icon, label, left, top }) => (
                    <div
                      key={label}
                      title={label}
                      style={{ left, top }}
                      className="st2-vision-icon absolute flex size-12 items-center justify-center rounded-full border border-white/15 bg-[#10141D]/95 text-slate-200 shadow-[0_12px_28px_-8px_rgba(0,0,0,0.7)]"
                    >
                      <Icon aria-hidden="true" className="size-4.5 stroke-[1.65]" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Stepped Tabbed Folder Container matching F0456 */}
              <div className="st2-folder-chrome pointer-events-auto relative w-[54%] overflow-hidden rounded-[22px] border border-blue-400/25 bg-[#141B29] shadow-[0_32px_90px_-24px_rgba(8,18,40,0.85)]">
                {/* Upper Lighter Tab Band + Right Action Pill */}
                <div className="flex items-center justify-between px-6 pt-4 pb-3">
                  <button
                    type="button"
                    onClick={() => setFolderTab("industries")}
                    className={`text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-blue-400 ${
                      folderTab === "industries"
                        ? "text-blue-400 underline underline-offset-4"
                        : "text-slate-300 hover:text-white"
                    }`}
                  >
                    Industries Served (6)
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollToSectionId("divisions-directory")}
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-[#080B12]/70 px-3.5 py-1 text-xs font-medium text-white transition hover:border-blue-400/50"
                  >
                    + Explore All 37
                  </button>
                </div>

                {/* Stepped Dark Tab Neck Overlapping Folder Body (F0456 cutout style) */}
                <div className="relative bg-[#080B12] pt-3 pb-4 px-4 rounded-t-[18px] border-t border-white/10">
                  <div className="mb-3 flex items-center justify-between px-2">
                    <button
                      type="button"
                      onClick={() => setFolderTab("divisions")}
                      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold transition focus-visible:outline-2 focus-visible:outline-blue-400 ${
                        folderTab === "divisions"
                          ? "bg-[#2456A4] text-white"
                          : "bg-white/5 text-slate-300 hover:text-white"
                      }`}
                    >
                      Core Service Pillars
                    </button>
                    <span className="font-mono text-[11px] uppercase tracking-wider text-[#7F8AA0]">
                      {folderTab === "divisions" ? "06 Capabilities" : "06 Industries"}
                    </span>
                  </div>

                  {/* 3x2 Target Coordinate Slots */}
                  <div className="relative grid grid-cols-3 grid-rows-2 gap-3">
                    {stageTwoSharedCards.map((slotItem, idx) => (
                      <div
                        key={slotItem.id}
                        aria-hidden={folderTab === "divisions"}
                        className="st2-grid-slot aspect-[4/3.6] w-full rounded-xl border border-white/5 bg-[#0D1320]"
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
            </div>

            {/* THE 6 SHARED DOM CARDS (Center Stack -> Diagonal Staircase -> Exact 3x2 Folder Grid) */}
            <div className="pointer-events-none absolute inset-0 hidden items-center justify-center min-[900px]:flex">
              {stageTwoSharedCards.map((card, i) => (
                <button
                  key={card.id}
                  type="button"
                  onClick={() => {
                    onSelectDivision(card.slug);
                    scrollToSectionId("divisions-directory");
                  }}
                  aria-label={`${card.title} (${card.metric})`}
                  className={`st2-shared-card group pointer-events-auto absolute overflow-hidden rounded-xl border ${
                    i === 5 ? "border-blue-400/50" : "border-white/15"
                  } bg-[#10141D] text-left shadow-[0_22px_52px_-14px_rgba(0,0,0,0.82)] transition-[border-color,opacity] duration-300 hover:border-blue-400 focus-visible:outline-2 focus-visible:outline-blue-400 ${
                    folderTab === "industries" ? "!pointer-events-none !opacity-0" : ""
                  }`}
                >
                  <img
                    src={card.image}
                    alt={card.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Vivid top cobalt sheen on Card 5 in stack/staircase, fading cleanly on hover */}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#080B12]/90 via-[#080B12]/15 to-transparent" />
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 p-2.5">
                    <span className="block text-[10px] font-semibold uppercase tracking-wider text-blue-300">
                      {card.handle}
                    </span>
                    <span className="mt-0.5 block truncate text-xs font-semibold text-white">
                      {card.title}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile / Reduced Motion Clean Fallback */}
        <div className="mx-auto max-w-6xl px-5 pb-12 sm:px-8 min-[900px]:hidden">
          <div className="mb-6 rounded-2xl border border-white/10 bg-[#10141D] p-5">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">
              Our Vision
            </span>
            <h2 className="mt-2 text-2xl font-semibold text-white">
              Our vision <span className="text-[#7F8AA0]">for digital scale.</span>
            </h2>
            <p className="mt-2 text-sm text-[#A3ACBC]">
              Every website, brand identity, paid campaign, and AI workflow aligns toward growth.
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
                className="relative aspect-[4/3.6] overflow-hidden rounded-xl border border-white/10 bg-[#10141D] text-left"
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

      {/* COMPLETE 5-DIVISION / 37-DELIVERABLE DIRECTORY */}
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
            <h2 className="mt-2 text-[clamp(1.9rem,3.4vw,3.1rem)] font-semibold leading-[1.04] tracking-[-0.02em] text-white">
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

      {/* MOTION STUDY 04 ENDING (F0504 -> F0540): OPPOSING PARABOLIC CURVED GALLERY BOWL */}
      <section
        ref={wavesSectionRef}
        data-reel-scene="waves"
        className="relative z-10 overflow-hidden py-24 lg:py-32"
        aria-label="Capabilities curved gallery showcase"
      >
        {/* Top Convex Arc Row — Clean Square Visual Cards (F0540) */}
        <div ref={waveTopRef} className="mb-14 flex w-max gap-5 px-8 will-change-transform">
          {[...WAVE_TOP, ...WAVE_TOP].map((item, idx) => (
            <button
              key={`top-${item.id}-${idx}`}
              type="button"
              aria-label={`${item.title} — ${item.category}`}
              onClick={() => {
                onSelectDivision(item.slug);
                scrollToSectionId("divisions-directory");
              }}
              className="wave-top-card group relative size-[112px] shrink-0 overflow-hidden rounded-2xl border border-white/15 bg-[#10141D] shadow-xl transition hover:border-blue-400 sm:size-[128px]"
            >
              <img
                src={item.image}
                alt={item.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-108"
              />
            </button>
          ))}
        </div>

        {/* Centered Focal Copy + Icon inside the Elliptical Opening matching F0540 */}
        <div className="mx-auto my-6 max-w-2xl px-5 text-center sm:px-8">
          <div className="wave-center-reveal mx-auto mb-4 flex size-9 items-center justify-center rounded-full border border-white/15 bg-[#10141D] text-blue-300">
            <Layers aria-hidden="true" className="size-4" />
          </div>
          <h2 className="wave-center-reveal mx-auto max-w-[14ch] text-[clamp(2.1rem,4.3vw,3.9rem)] font-semibold leading-[1.03] tracking-[-0.025em] text-white">
            Built for ambitious businesses
          </h2>
          <p className="wave-center-reveal mx-auto mt-3 max-w-[44ch] text-xs leading-relaxed text-[#A3ACBC] sm:text-sm">
            Websites, brand systems, paid acquisition, and intelligent automation united by one team.
          </p>
          <div className="wave-center-reveal mt-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-medium text-blue-200/90">
            {stats.map(([label, num, suffix]) => (
              <span key={label}>
                <strong className="font-semibold text-white">
                  {num}
                  {suffix}
                </strong>{" "}
                <span className="text-[#8C96A9]">{label.split(" — ")[0]}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Bottom Concave Arc Row — Clean Square Visual Cards (F0540) */}
        <div ref={waveBottomRef} className="mt-14 flex w-max gap-5 px-8 will-change-transform">
          {[...WAVE_BOTTOM, ...WAVE_BOTTOM].map((item, idx) => (
            <button
              key={`bot-${item.id}-${idx}`}
              type="button"
              aria-label={`${item.title} — ${item.category}`}
              onClick={() => {
                onSelectDivision(item.slug);
                scrollToSectionId("divisions-directory");
              }}
              className="wave-bottom-card group relative size-[112px] shrink-0 overflow-hidden rounded-2xl border border-white/15 bg-[#10141D] shadow-xl transition hover:border-blue-400 sm:size-[128px]"
            >
              <img
                src={item.image}
                alt={item.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-108"
              />
            </button>
          ))}
        </div>
      </section>
    </>
  );
}
