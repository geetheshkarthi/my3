import { useEffect, useRef, useState } from "react";
import { Pause, Play, RotateCcw } from "lucide-react";

const duration = 42;
const landmarks = [
  [0, "hero", 0], [2.5, "hero", 0], [5.8, "hero", 0.56],
  [8, "spotlight", 0], [10, "spotlight", 0.22], [12, "platforms", 0],
  [13.5, "ecosystem", 0.08], [16.2, "ecosystem", 0.36], [19.2, "ecosystem", 0.65],
  [21, "waves", 0], [22.5, "waves", 0.16],
  [24.5, "bento", 0], [27, "bento", 0.42],
  [28.5, "carousel", 0], [30, "carousel", 0.18],
  [31.2, "mosaic", 0.04], [33.8, "mosaic", 0.52],
  [36, "tiers", 0.05], [38.2, "closing", 0], [40.2, "closing", 0.45],
  [42, "end", 0],
] as const;

function measureTimeline() {
  const bottom = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
  let previous = 0;
  return landmarks.map(([time, scene, offset]) => {
    const element = document.querySelector<HTMLElement>('[data-reel-scene="' + scene + '"]');
    const destination = scene === "end" ? bottom : element
      ? element.getBoundingClientRect().top + window.scrollY - 88 + element.offsetHeight * offset
      : previous;
    previous = Math.max(previous, Math.min(bottom, destination));
    return { time, top: previous };
  });
}

export function ServicesReel({ playing, setPlaying }: {
  playing: boolean;
  setPlaying: (playing: boolean) => void;
}) {
  const elapsed = useRef(0);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (!playing) return;
    let timeline = measureTimeline();
    let frame = 0;
    let start: number | undefined;
    const initialTime = elapsed.current;

    function tick(now: number) {
      start ??= now;
      const time = Math.min(duration, initialTime + (now - start) / 1000);
      const index = timeline.findIndex((point) => point.time >= time);
      const next = timeline[Math.max(0, index)]!;
      const previous = timeline[Math.max(0, index - 1)]!;
      const progress = next.time === previous.time ? 0 : (time - previous.time) / (next.time - previous.time);
      const eased = progress * progress * (3 - 2 * progress);
      window.scrollTo({ top: previous.top + (next.top - previous.top) * eased, behavior: "instant" });
      elapsed.current = time;
      setSeconds(Math.floor(time));
      if (time < duration) frame = requestAnimationFrame(tick);
      else setPlaying(false);
    }

    const pause = () => setPlaying(false);
    const keyboard = (event: KeyboardEvent) => {
      if (["Escape", "ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End"].includes(event.key)) pause();
    };
    const resize = () => { timeline = measureTimeline(); };

    frame = requestAnimationFrame(tick);
    window.addEventListener("resize", resize);
    window.addEventListener("wheel", pause, { passive: true });
    window.addEventListener("touchmove", pause, { passive: true });
    window.addEventListener("keydown", keyboard);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("wheel", pause);
      window.removeEventListener("touchmove", pause);
      window.removeEventListener("keydown", keyboard);
    };
  }, [playing, setPlaying]);

  function restart() {
    elapsed.current = 0;
    setSeconds(0);
    window.scrollTo({ top: 0, behavior: "instant" });
    document.querySelector<HTMLButtonElement>('[aria-label="Replay opening card animation"]')?.click();
  }

  function toggle() {
    if (!playing && (elapsed.current === 0 || elapsed.current >= duration)) restart();
    setPlaying(!playing);
  }

  return (
    <aside aria-label="Services motion reel" className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-2xl border border-blue-300/20 bg-[#10141D]/95 p-2 text-white shadow-2xl backdrop-blur-lg sm:bottom-6 sm:right-6">
      <button type="button" onClick={toggle} className="inline-flex items-center gap-2 rounded-xl bg-[#2456A4] px-3 py-2 text-sm font-semibold hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-blue-300">
        {playing ? <Pause aria-hidden="true" className="size-4" /> : <Play aria-hidden="true" className="size-4" />}
        {playing ? "Pause reel" : seconds > 0 && seconds < duration ? "Resume reel" : "Play 42-second reel"}
      </button>
      {seconds > 0 && (
        <>
          <progress aria-label="Reel progress" value={seconds} max={duration} className="h-1.5 w-12 accent-blue-400 sm:w-20" />
          <button type="button" aria-label="Reset reel to the start" onClick={() => { setPlaying(false); restart(); }} className="grid size-9 place-items-center rounded-xl hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-blue-300">
            <RotateCcw aria-hidden="true" className="size-4" />
          </button>
        </>
      )}
    </aside>
  );
}
