import { Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { contact, process, stats } from "@/content/site";
import { ensureGsapRegistered, gsap } from "./gsapMotion";
import { fannedPrinciples } from "./colorStackData";

type SubPartsAndProcessSectionProps = {
  reduceMotion: boolean;
};

export function SubPartsAndProcessSection({
  reduceMotion,
}: SubPartsAndProcessSectionProps) {
  const closingMixRef = useRef<HTMLElement>(null);
  const [mobileSwipeIdx, setMobileSwipeIdx] = useState(0);

  useEffect(() => {
    if (reduceMotion) return;
    ensureGsapRegistered();

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      if (closingMixRef.current) {
        const cards = gsap.utils.toArray<HTMLElement>(
          ".fanned-principle-card",
          closingMixRef.current
        );
        mm.add("(min-width: 900px)", () => {
          gsap.fromTo(
            cards,
            { y: 52, opacity: 0, scale: 0.92, rotation: 0 },
            {
              y: 0,
              opacity: 1,
              scale: 1,
              rotation: (i: number) => fannedPrinciples[i]?.palette.rotate ?? 0,
              stagger: 0.08,
              duration: 0.72,
              ease: "power3.out",
              scrollTrigger: {
                trigger: closingMixRef.current,
                start: "top 75%",
                once: true,
              },
            }
          );
        });
      }
    });

    return () => ctx.revert();
  }, [reduceMotion]);

  return (
    <section
      ref={closingMixRef}
      data-reel-scene="closing"
      className="relative z-10 overflow-x-clip border-t border-white/10 bg-black py-16 sm:py-24"
      aria-label="Our Approach and Process"
    >
      <div className="mx-auto max-w-[1320px] px-4 sm:px-8 md:px-14 lg:px-20">
        <div className="mx-auto max-w-3xl text-center">
          <span className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">
            Better Together.
          </span>
          <h2 className="mt-2 text-[clamp(2.2rem,5vw,4.5rem)] font-bold leading-[0.98] tracking-[-0.03em] text-white">
            Stronger by Design.
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-slate-300 sm:text-base">
            A brand identity can establish the foundation for a website. A
            well-developed website can support performance marketing. Strategic
            advertising can generate enquiries, while automation can help manage
            them efficiently. At My3 Digital, we look at the entire journey.
          </p>
        </div>

        {/* DESKTOP: Fanned Multi-Tone Principle Cards */}
        <div className="mt-14 hidden gap-4 lg:grid lg:grid-cols-5">
          {fannedPrinciples.map((card) => (
            <article
              key={card.index}
              style={{
                backgroundColor: card.palette.bg,
                color: card.palette.text,
                transform: reduceMotion
                  ? `rotate(${card.palette.rotate}deg)`
                  : undefined,
              }}
              className="fanned-principle-card flex min-h-[290px] flex-col justify-between rounded-3xl border border-white/15 p-6 shadow-2xl transition-transform duration-300 hover:-translate-y-2 hover:rotate-0"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span
                    style={{
                      backgroundColor: card.palette.tagBg,
                      color: card.palette.tagText,
                    }}
                    className="rounded-full px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase"
                  >
                    {card.phaseName}
                  </span>
                  <span className="font-mono text-xs font-bold opacity-60">
                    {card.index}
                  </span>
                </div>
                <h3
                  style={{ color: card.palette.text }}
                  className="mt-5 text-lg font-bold leading-snug"
                >
                  {card.title}
                </h3>
                <p
                  style={{ color: card.palette.muted }}
                  className="mt-2.5 text-xs leading-relaxed"
                >
                  {card.copy}
                </p>
              </div>

              <div className="border-t border-current/15 pt-3 text-[11px] font-medium opacity-85">
                {card.phase}
              </div>
            </article>
          ))}
        </div>

        {/* MOBILE / TABLET (< lg): Swipeable Multi-Tone Principle Deck */}
        <div className="mt-10 lg:hidden">
          <div
            onScroll={(e) => {
              const el = e.currentTarget;
              const w = el.scrollWidth - el.clientWidth;
              if (w > 0) {
                setMobileSwipeIdx(
                  Math.round(
                    (el.scrollLeft / w) * (fannedPrinciples.length - 1)
                  )
                );
              }
            }}
            className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-3.5 overflow-x-auto px-4 pb-2"
          >
            {fannedPrinciples.map((card) => (
              <article
                key={card.index}
                style={{
                  backgroundColor: card.palette.bg,
                  color: card.palette.text,
                }}
                className="flex min-h-[235px] w-[76vw] max-w-[300px] shrink-0 snap-center flex-col justify-between rounded-[24px] border border-white/15 p-5 shadow-xl"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span
                      style={{
                        backgroundColor: card.palette.tagBg,
                        color: card.palette.tagText,
                      }}
                      className="rounded-full px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase"
                    >
                      {card.phaseName}
                    </span>
                    <span className="font-mono text-xs font-bold opacity-60">
                      {card.index}
                    </span>
                  </div>
                  <h3
                    style={{ color: card.palette.text }}
                    className="mt-4 text-base font-bold leading-snug"
                  >
                    {card.title}
                  </h3>
                  <p
                    style={{ color: card.palette.muted }}
                    className="mt-2 text-xs leading-relaxed"
                  >
                    {card.copy}
                  </p>
                </div>

                <div className="border-t border-current/15 pt-2.5 text-[11px] font-medium opacity-85">
                  {card.phase}
                </div>
              </article>
            ))}
          </div>

          <div
            className="mt-3 flex items-center justify-center gap-1.5"
            aria-hidden="true"
          >
            {fannedPrinciples.map((card, i) => (
              <span
                key={card.index}
                className={`h-1.5 rounded-full transition-all ${
                  mobileSwipeIdx === i
                    ? "w-5 bg-[#D2FF1F]"
                    : "w-1.5 bg-white/25"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Verified Stats Bar */}
        <div className="mt-12 grid grid-cols-2 gap-3 rounded-2xl border border-white/10 bg-[#0A0B10] p-5 sm:p-6 md:grid-cols-4">
          {stats.map(([label, num, suffix]) => (
            <div key={label} className="text-center md:text-left">
              <div className="text-2xl font-bold text-white sm:text-3xl">
                {num}
                {suffix}
              </div>
              <div className="mt-0.5 text-xs text-slate-400">{label}</div>
            </div>
          ))}
        </div>

        {/* 5-Step Delivery Process Pill Flow */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-300">
          {process.map(([stepName], i) => (
            <span key={stepName} className="inline-flex items-center gap-2">
              <span className="rounded-full border border-white/12 bg-[#0D0F14] px-3 py-1 font-medium text-white">
                0{i + 1} · {stepName}
              </span>
              {i < process.length - 1 && (
                <span aria-hidden="true" className="text-slate-600">
                  &rarr;
                </span>
              )}
            </span>
          ))}
        </div>

        {/* FINAL CLOSING CTA ON PURE BLACK CANVAS */}
        <div className="mt-16 rounded-[28px] border border-white/12 bg-[#08090D] p-7 text-center sm:p-12 lg:p-16">
          <div className="mx-auto max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-black px-3.5 py-1 text-xs font-medium text-slate-300">
              <Sparkles aria-hidden="true" className="size-3.5 text-[#D2FF1F]" />
              <span>
                Hyderabad &amp; Bangalore · {contact.phone}
              </span>
            </div>
            <h2 className="mt-5 text-[clamp(1.85rem,4vw,3.5rem)] font-bold leading-[1.06] tracking-[-0.025em] text-white">
              Have a Vision? Let&apos;s Build the Right Strategy Around It.
            </h2>
            <p className="mx-auto mt-4 max-w-[54ch] text-sm leading-relaxed text-slate-300 sm:text-base">
              Tell us what you&apos;re looking to achieve. Our team will help
              identify the right approach, capabilities and execution plan for
              your business.
            </p>

            <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
              <Link
                to="/contact"
                style={{ color: "#080B12" }}
                className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-white px-7 py-3 text-sm font-bold text-slate-950 transition hover:bg-[#D2FF1F]"
              >
                <span>Discuss Your Project</span>
                <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
              <Link
                to="/work"
                className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full border border-white/15 bg-black px-7 py-3 text-sm font-semibold text-white transition hover:border-white/40"
              >
                <span>Our Work</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
