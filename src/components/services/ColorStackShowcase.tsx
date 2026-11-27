import { Link } from "@tanstack/react-router";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  ensureGsapRegistered,
  gsap,
  ScrollTrigger,
  scrollToSectionId,
} from "./gsapMotion";
import { capabilityImages, colorStackDivisions } from "./colorStackData";

type ColorStackShowcaseProps = {
  reduceMotion: boolean;
};

type SelectedCapability = {
  divisionIndex: number;
  itemIndex: number;
};

/**
 * Rest stacking pose for a card situated `rel` steps ahead of the active center card.
 * With transformOrigin="center center", scale(0.96) + y=38 yields a clear +26px colored
 * card edge peeking visibly below the active card across laptop and mobile viewports.
 */
function stackPose(rel: number, isCompact: boolean) {
  if (rel <= 0) {
    return { y: 0, scale: 1, rotateX: 0, opacity: 1, brightness: 1 };
  }
  if (rel === 1) {
    return {
      y: isCompact ? 30 : 38,
      scale: 0.96,
      rotateX: 0,
      opacity: 1,
      brightness: 0.92,
    };
  }
  if (rel === 2) {
    return {
      y: isCompact ? 54 : 68,
      scale: 0.92,
      rotateX: 0,
      opacity: 0.96,
      brightness: 0.8,
    };
  }
  return {
    y: isCompact ? 76 : 96,
    scale: 0.88,
    rotateX: 0,
    opacity: 0,
    brightness: 0.72,
  };
}

export function ColorStackShowcase({ reduceMotion }: ColorStackShowcaseProps) {
  const stackTriggerRef = useRef<HTMLDivElement>(null);
  const stackPinRef = useRef<HTMLDivElement>(null);
  const stInstanceRef = useRef<ScrollTrigger | null>(null);

  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [selectedCapability, setSelectedCapability] =
    useState<SelectedCapability | null>(null);

  /** Scrolls directly so card `targetIndex` lands dead-center in the pinned stacking stage. */
  const jumpToDivisionCard = (targetIndex: number) => {
    const st = stInstanceRef.current;
    if (st) {
      const totalTransitions = Math.max(1, colorStackDivisions.length - 1);
      const targetProgress = Math.min(
        1,
        Math.max(0, targetIndex / totalTransitions)
      );
      const destination = st.start + (st.end - st.start) * targetProgress;
      window.scrollTo({
        top: destination,
        behavior: reduceMotion ? "instant" : "smooth",
      });
    }
  };

  // GSAP ScrollTrigger center-pinned peeking card stack across ALL screen sizes (mobile, split-screen, laptop, desktop)
  useEffect(() => {
    const triggerEl = stackTriggerRef.current;
    const pinEl = stackPinRef.current;
    if (!triggerEl || !pinEl) return;

    ensureGsapRegistered();
    const cards = gsap.utils.toArray<HTMLElement>(".center-deck-card", pinEl);

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          isCompact: "(max-width: 639px)",
          isWide: "(min-width: 640px)",
        },
        (context) => {
          const isCompact = Boolean(context.conditions?.["isCompact"]);
          const count = cards.length;
          const steps = count - 1;

          const applyInitialPoses = () => {
            cards.forEach((card, i) => {
              const pose = stackPose(i, isCompact);
              card.style.pointerEvents = i === 0 ? "auto" : "none";
              gsap.set(card, {
                x: 0,
                y: pose.y,
                scale: pose.scale,
                rotateX: 0,
                opacity: pose.opacity,
                filter: `brightness(${pose.brightness})`,
                zIndex: 60 - i * 10,
                transformPerspective: 1400,
                transformOrigin: "center center",
              });
            });
          };

          applyInitialPoses();

          if (reduceMotion) return;

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: triggerEl,
              start: "top top",
              end: "bottom bottom",
              scrub: 0.5,
              pin: pinEl,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              onUpdate: (self) => {
                stInstanceRef.current = self;
                const idx = Math.min(
                  steps,
                  Math.max(0, Math.round(self.progress * steps))
                );
                setActiveCardIndex(idx);
                cards.forEach((c, ci) => {
                  c.style.pointerEvents = ci === idx ? "auto" : "none";
                });
              },
            },
          });

          stInstanceRef.current = tl.scrollTrigger ?? null;

          // Sequentially lift exiting card up with 3D peel and clean fade before reaching the navbar, while the card directly beneath rises cleanly from below
          for (let step = 0; step < steps; step++) {
            const exitingCard = cards[step];
            const t = step;

            if (exitingCard) {
              tl.to(
                exitingCard,
                {
                  y: () => -Math.min(520, (pinEl.clientHeight || 900) * 0.58),
                  scale: 0.9,
                  rotateX: -14,
                  filter: "brightness(0.75)",
                  duration: 0.56,
                  ease: "power2.in",
                },
                t
              ).to(
                exitingCard,
                {
                  opacity: 0,
                  duration: 0.34,
                  ease: "power2.inOut",
                },
                t + 0.16
              );
            }

            for (let j = step + 1; j < count; j++) {
              const cardBelow = cards[j];
              if (!cardBelow) continue;
              const nextPose = stackPose(j - (step + 1), isCompact);
              tl.to(
                cardBelow,
                {
                  y: nextPose.y,
                  scale: nextPose.scale,
                  rotateX: 0,
                  opacity: nextPose.opacity,
                  filter: `brightness(${nextPose.brightness})`,
                  duration: 0.68,
                  ease: "power3.out",
                },
                t + 0.04
              );
            }
          }

          // Final settled dwell so Card 05 holds steady at track end
          tl.to({}, { duration: 0.28 }, steps - 1 + 0.72);
        }
      );
    }, triggerEl);

    return () => {
      stInstanceRef.current = null;
      ctx.revert();
    };
  }, [reduceMotion]);

  // Modal keyboard controls (Escape to close, ArrowLeft / ArrowRight to step within division)
  useEffect(() => {
    if (!selectedCapability) return;

    const div = colorStackDivisions[selectedCapability.divisionIndex];
    const total = div?.items.length ?? 0;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedCapability(null);
      } else if (e.key === "ArrowRight" && total > 1) {
        setSelectedCapability((prev) =>
          prev
            ? {
                ...prev,
                itemIndex: (prev.itemIndex + 1) % total,
              }
            : null
        );
      } else if (e.key === "ArrowLeft" && total > 1) {
        setSelectedCapability((prev) =>
          prev
            ? {
                ...prev,
                itemIndex: (prev.itemIndex - 1 + total) % total,
              }
            : null
        );
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedCapability]);

  const activeModalDiv = selectedCapability
    ? colorStackDivisions[selectedCapability.divisionIndex]
    : undefined;
  const activeModalEntry =
    activeModalDiv && selectedCapability
      ? activeModalDiv.items[selectedCapability.itemIndex]
      : undefined;

  return (
    <div className="relative bg-black">
      {/* Slim Left Fixed Index Rail for Quick Jump on Large Screens */}
      <aside
        aria-label="Division Quick Navigation"
        className="fixed left-5 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-center gap-2.5 rounded-full border border-white/10 bg-black/85 p-2 shadow-2xl backdrop-blur-xl 2xl:flex"
      >
        {colorStackDivisions.map((div, idx) => {
          const isActive = activeCardIndex === idx;
          return (
            <button
              key={div.slug}
              type="button"
              aria-label={`View Division ${div.theme.index}: ${div.short}`}
              onClick={() => jumpToDivisionCard(idx)}
              style={{ backgroundColor: div.theme.cardBg }}
              className={`group relative flex size-10 items-center justify-center rounded-full text-xs font-bold text-white transition-all duration-300 hover:scale-110 focus-visible:outline-2 focus-visible:outline-white ${
                isActive
                  ? "scale-110 ring-2 ring-white ring-offset-2 ring-offset-black"
                  : "opacity-80 hover:opacity-100"
              }`}
            >
              <span>{div.theme.index}</span>
              <span className="pointer-events-none absolute left-14 whitespace-nowrap rounded-lg border border-white/15 bg-[#0A0E17] px-3 py-1.5 text-xs font-medium text-white opacity-0 shadow-xl transition-opacity group-hover:opacity-100">
                {div.theme.index} · {div.short}
              </span>
            </button>
          );
        })}
      </aside>

      {/* INTRODUCTION HERO ON PURE BLACK (#000000) WITH GENEROUS GAP BEFORE STACKED CARDS */}
      <section
        data-reel-scene="hero"
        aria-label="Our Expertise"
        className="relative mx-auto max-w-[1320px] bg-black px-4 pt-28 pb-16 sm:px-8 sm:pt-36 sm:pb-24 md:px-14 lg:px-20 lg:pt-40 lg:pb-28"
      >
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-[#0D0F14] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-slate-200">
            <span
              className="size-2 rounded-full bg-[#D2FF1F]"
              aria-hidden="true"
            />
            Our Expertise
          </div>

          <h1 className="mt-5 text-[clamp(2.35rem,6vw,5.25rem)] font-bold leading-[0.96] tracking-[-0.035em] text-white">
            One Partner. Every Possibility in Digital.
          </h1>

          <p className="mt-6 max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base md:text-lg">
            Website development, branding, performance marketing, digital
            marketing and technology &amp; automation services from My3 Digital.
          </p>

          <div className="mt-8 flex w-full flex-col items-stretch justify-center gap-3 sm:w-auto sm:flex-row sm:items-center">
            <Link
              to="/contact"
              style={{ color: "#080B12" }}
              className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-white px-7 py-3 text-sm font-bold text-slate-950 shadow-[0_0_28px_rgba(255,255,255,0.16)] transition hover:bg-[#D2FF1F]"
            >
              <span>Discuss Your Requirements</span>
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
            <button
              type="button"
              onClick={() => scrollToSectionId("divisions")}
              className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full border border-white/15 bg-[#0D0F14] px-6 py-3 text-sm font-semibold text-white transition hover:border-white/40"
            >
              <span>Explore 5 Divisions</span>
              <ArrowDown aria-hidden="true" className="size-4 text-[#D2FF1F]" />
            </button>
          </div>
        </div>
      </section>

      {/* UNIVERSAL ANIMATED PEEKING CARD STACK (Mobile, Tablet/Split-Window, Laptop, Desktop) */}
      <section
        id="divisions"
        ref={stackTriggerRef}
        aria-label="Interactive Centered Colored Service Cards"
        className="min-h-[400vh] bg-black"
      >
        <div
          ref={stackPinRef}
          className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-black px-3.5 pt-[94px] pb-6 sm:px-8 sm:pt-[112px] sm:pb-6"
        >
          {/* Centered Card Stack Container (Clear gap below fixed navbar + visible bottom peeks) */}
          <div className="relative h-[min(545px,calc(100vh-195px))] w-full max-w-[1000px] sm:h-[min(520px,calc(100vh-215px))] lg:h-[min(535px,calc(100vh-215px))]">
            {colorStackDivisions.map((div, idx) => {
              const isCreamTray = div.theme.trayVariant === "cream";
              const isEspresso = div.theme.cardBg === "#5C412B";

              return (
                <article
                  key={div.slug}
                  id={`card-${div.slug}`}
                  style={{
                    backgroundColor: div.theme.cardBg,
                    color: isEspresso ? "#F6F1E6" : "#FFFFFF",
                  }}
                  className="center-deck-card absolute inset-0 flex flex-col justify-between overflow-hidden rounded-[24px] border border-white/18 p-4 shadow-[0_34px_96px_-18px_rgba(0,0,0,0.92)] sm:rounded-[30px] sm:p-5 lg:p-6"
                >
                  {/* Header Strip */}
                  <div className="shrink-0">
                    <div className="flex items-center justify-between gap-3">
                      <span className="truncate rounded-full bg-black/28 px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-white/95 sm:px-3 sm:text-[11px] sm:tracking-[0.14em]">
                        Division {div.theme.index} · {div.eyebrow}
                      </span>
                      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                        <span
                          style={{ color: div.theme.badgeTextColor }}
                          className="rounded-full bg-black/50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider sm:px-3 sm:text-[11px]"
                        >
                          {div.items.length} Services
                        </span>
                        <span className="font-mono text-xs font-bold text-white/80 sm:text-sm">
                          ({div.theme.index})
                        </span>
                      </div>
                    </div>

                    <h2
                      style={{ color: isEspresso ? "#F6F1E6" : "#FFFFFF" }}
                      className="mt-2 text-[clamp(1.25rem,2.4vw,2.2rem)] font-bold leading-[1.06] tracking-[-0.025em] sm:mt-2"
                    >
                      {div.title}
                    </h2>
                    <p
                      style={{ color: isEspresso ? "#F6F1E6" : "#FFFFFF" }}
                      className="mt-1 line-clamp-1 max-w-3xl text-[11px] font-medium leading-snug opacity-90 sm:line-clamp-2 sm:text-xs lg:text-[13px]"
                    >
                      {div.heading} — {div.intro[0]}
                    </p>
                  </div>

                  {/* Inner Tray: Studio Photo + Interactive Click-to-Popup Service Pills */}
                  <div
                    className={`my-2 flex min-h-0 flex-1 flex-col justify-between overflow-hidden rounded-2xl p-2.5 shadow-xl sm:my-2.5 sm:grid sm:grid-cols-12 sm:items-stretch sm:gap-4 sm:p-3 ${
                      isCreamTray
                        ? "bg-[#F6F1E6] text-[#080B12]"
                        : "border border-white/15 bg-black/32 text-white backdrop-blur-md"
                    }`}
                  >
                    {/* Compact Mobile Header Row with Studio Thumbnail */}
                    <div className="mb-1.5 flex shrink-0 items-center gap-2.5 sm:hidden">
                      <img
                        src={div.theme.heroImage}
                        alt={div.title}
                        className="h-11 w-20 shrink-0 rounded-lg object-cover shadow"
                      />
                      <div className="min-w-0 flex-1">
                        <div
                          className={`truncate text-xs font-bold ${
                            isCreamTray ? "text-slate-950" : "text-white"
                          }`}
                        >
                          {div.short}
                        </div>
                        <div
                          className={`truncate text-[10px] font-medium ${
                            isCreamTray ? "text-[#4024D6]" : "text-[#D2FF1F]"
                          }`}
                        >
                          Tap any item below to view photo &amp; details
                        </div>
                      </div>
                    </div>

                    {/* Tablet/Desktop Left Studio Showcase Photo */}
                    <div className="relative hidden min-h-0 overflow-hidden rounded-xl bg-black sm:col-span-5 sm:block">
                      <img
                        src={div.theme.heroImage}
                        alt={div.title}
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                      />
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent" />
                      <div className="pointer-events-none absolute inset-x-3 bottom-3 flex items-center justify-between gap-2">
                        <span className="truncate text-xs font-bold text-white">
                          {div.short}
                        </span>
                        <span
                          style={{ color: "#080B12" }}
                          className="shrink-0 rounded-full bg-[#D2FF1F] px-2.5 py-0.5 text-[10px] font-bold text-slate-950"
                        >
                          Click item &rarr;
                        </span>
                      </div>
                    </div>

                    {/* Clickable Service Pills Column (1-col on phone, 2-col on tablet/desktop) */}
                    <div className="flex min-h-0 flex-1 flex-col justify-between sm:col-span-7">
                      <div className="grid grid-cols-1 gap-1 sm:grid-cols-2 sm:gap-1.5">
                        {div.items.map(([itemTitle], itemIdx) => (
                          <button
                            key={itemTitle}
                            type="button"
                            onClick={() =>
                              setSelectedCapability({
                                divisionIndex: idx,
                                itemIndex: itemIdx,
                              })
                            }
                            className={`group flex min-h-[28px] items-center justify-between gap-2 rounded-lg px-2.5 py-1 text-left transition sm:min-h-[34px] sm:rounded-xl sm:py-1.5 ${
                              isCreamTray
                                ? "bg-white text-slate-950 shadow-sm hover:bg-indigo-50 hover:ring-1 hover:ring-[#4024D6]/35"
                                : "border border-white/10 bg-black/55 text-white hover:border-white/40 hover:bg-black/75"
                            }`}
                          >
                            <span className="flex min-w-0 items-center gap-2">
                              <Check
                                aria-hidden="true"
                                className={`size-3.5 shrink-0 ${
                                  isCreamTray
                                    ? "text-[#4024D6]"
                                    : "text-[#D2FF1F]"
                                }`}
                              />
                              <span
                                style={{
                                  color: isCreamTray ? "#080B12" : "#FFFFFF",
                                }}
                                className="truncate text-[11px] font-semibold leading-tight sm:line-clamp-2 sm:whitespace-normal sm:text-xs"
                              >
                                {itemTitle}
                              </span>
                            </span>
                            <ArrowUpRight
                              aria-hidden="true"
                              className={`size-3.5 shrink-0 opacity-50 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100 ${
                                isCreamTray ? "text-[#4024D6]" : "text-white"
                              }`}
                            />
                          </button>
                        ))}
                      </div>

                      {div.extra ? (
                        <p
                          className={`mt-1.5 hidden truncate font-mono text-[11px] leading-snug sm:block ${
                            isCreamTray ? "text-slate-700" : "text-slate-300"
                          }`}
                        >
                          {div.extra}
                        </p>
                      ) : (
                        <p
                          className={`mt-1.5 hidden line-clamp-2 text-[11px] leading-snug sm:block ${
                            isCreamTray ? "text-slate-700" : "text-slate-300"
                          }`}
                        >
                          {div.intro[1]}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Card Footer Bar */}
                  <div className="flex shrink-0 items-center justify-between gap-3 border-t border-white/20 pt-2 sm:pt-3">
                    <Link
                      to="/contact"
                      style={{ color: div.theme.ctaTextColor }}
                      className="inline-flex min-h-[38px] items-center gap-2 rounded-full bg-white px-4 py-1.5 text-xs font-bold shadow-lg transition hover:bg-[#F6F1E6] sm:min-h-[42px] sm:px-5 sm:py-2 sm:text-sm"
                    >
                      <span>{div.cta}</span>
                      <ArrowRight aria-hidden="true" className="size-4" />
                    </Link>

                    <div className="flex items-center gap-1.5" aria-hidden="true">
                      {colorStackDivisions.map((_, dotIdx) => (
                        <span
                          key={dotIdx}
                          className={`h-1.5 rounded-full transition-all ${
                            idx === dotIdx ? "w-5 bg-white" : "w-1.5 bg-white/35"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          <p className="mt-12 font-mono text-[10px] uppercase tracking-[0.18em] text-slate-400 sm:mt-14 sm:text-[11px] sm:tracking-[0.2em]">
            Card 0{activeCardIndex + 1} / 0{colorStackDivisions.length} · Scroll
            cards · Tap any item
          </p>
        </div>
      </section>

      {/* POPUP MODAL DISPLAYING SELECTED SERVICE PHOTO & FULL DESCRIPTION */}
      {selectedCapability && activeModalDiv && activeModalEntry && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="capability-modal-title"
          onClick={() => setSelectedCapability(null)}
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black/82 p-4 backdrop-blur-md sm:p-6"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ borderColor: `${activeModalDiv.theme.cardBg}88` }}
            className="relative w-full max-w-2xl overflow-hidden rounded-[28px] border bg-[#0A0C12] shadow-[0_40px_120px_rgba(0,0,0,0.95)]"
          >
            {/* Visual Picture Frame */}
            <div className="relative aspect-[16/9] w-full overflow-hidden bg-black">
              <img
                src={
                  capabilityImages[activeModalEntry[0]] ??
                  activeModalDiv.theme.heroImage
                }
                alt={activeModalEntry[0]}
                className="h-full w-full object-cover"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0A0C12] via-black/25 to-black/35" />

              <div className="absolute top-3.5 right-3.5 left-3.5 flex items-center justify-between gap-2 sm:top-4 sm:right-4 sm:left-4">
                <span
                  style={{ backgroundColor: activeModalDiv.theme.cardBg }}
                  className="rounded-full px-3 py-1 font-mono text-[11px] font-bold text-white shadow-lg"
                >
                  Division {activeModalDiv.theme.index} ·{" "}
                  {activeModalDiv.theme.index}.0
                  {selectedCapability.itemIndex + 1}
                </span>

                <button
                  type="button"
                  aria-label="Close service details popup"
                  onClick={() => setSelectedCapability(null)}
                  className="inline-flex size-10 items-center justify-center rounded-full border border-white/25 bg-black/75 text-white backdrop-blur-md transition hover:bg-white hover:text-black focus-visible:outline-2 focus-visible:outline-white"
                >
                  <X aria-hidden="true" className="size-4" />
                </button>
              </div>
            </div>

            {/* Description & Division Navigation */}
            <div className="p-5 sm:p-7">
              <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                {activeModalDiv.title}
              </p>
              <h3
                id="capability-modal-title"
                className="mt-1.5 text-xl font-bold leading-snug text-white sm:text-3xl"
              >
                {activeModalEntry[0]}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-200 sm:text-base">
                {activeModalEntry[1]}
              </p>

              {activeModalDiv.extra && (
                <p className="mt-3 rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-xs leading-relaxed text-slate-300">
                  {activeModalDiv.extra}
                </p>
              )}

              <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    aria-label="Previous item in division"
                    onClick={() => {
                      const total = activeModalDiv.items.length;
                      setSelectedCapability((prev) =>
                        prev
                          ? {
                              ...prev,
                              itemIndex: (prev.itemIndex - 1 + total) % total,
                            }
                          : null
                      );
                    }}
                    className="inline-flex min-h-[40px] items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.05] px-3.5 py-1.5 text-xs font-semibold text-white transition hover:bg-white/15"
                  >
                    <ArrowLeft aria-hidden="true" className="size-3.5" />
                    <span>Prev</span>
                  </button>
                  <button
                    type="button"
                    aria-label="Next item in division"
                    onClick={() => {
                      const total = activeModalDiv.items.length;
                      setSelectedCapability((prev) =>
                        prev
                          ? {
                              ...prev,
                              itemIndex: (prev.itemIndex + 1) % total,
                            }
                          : null
                      );
                    }}
                    className="inline-flex min-h-[40px] items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.05] px-3.5 py-1.5 text-xs font-semibold text-white transition hover:bg-white/15"
                  >
                    <span>Next</span>
                    <ArrowRight aria-hidden="true" className="size-3.5" />
                  </button>
                </div>

                <Link
                  to="/contact"
                  onClick={() => setSelectedCapability(null)}
                  style={{ backgroundColor: activeModalDiv.theme.cardBg }}
                  className="inline-flex min-h-[42px] items-center gap-2 rounded-full px-5 py-2 text-xs font-bold text-white shadow-lg transition hover:brightness-110 sm:text-sm"
                >
                  <span>{activeModalDiv.cta}</span>
                  <ArrowRight aria-hidden="true" className="size-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
