"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, GraduationCap, Heart, Palette, Sparkles } from "lucide-react";

type Artwork = {
  title: string;
  image: string;
};

const ACCENT = "#e36b32";

const STATS = [
  { value: "500+", label: "Students Transformed", icon: GraduationCap },
  { value: "1000+", label: "Beautiful Creations", icon: Palette },
  { value: "95%", label: "Feel More Confident", icon: Heart },
];

type CoverSpread = { stride: number; width: number; height: number; depth: number };

function measureCover(): CoverSpread {
  const viewport = window.innerWidth;
  if (viewport < 640) return { stride: 168, width: 220, height: 268, depth: 1 };
  if (viewport < 1024) return { stride: 172, width: 228, height: 276, depth: 2 };
  if (viewport < 1280) return { stride: 178, width: 220, height: 270, depth: 3 };
  if (viewport < 1536) return { stride: 206, width: 252, height: 300, depth: 3 };
  return { stride: 222, width: 272, height: 320, depth: 3 };
}

function coverScale(offset: number) {
  const distance = Math.abs(offset);
  if (distance === 0) return 1;
  if (distance === 1) return 0.93;
  if (distance === 2) return 0.82;
  if (distance === 3) return 0.7;
  return 0.58;
}

function coverOpacity(offset: number, depth: number) {
  const distance = Math.abs(offset);
  if (distance > depth) return 0;
  if (distance === depth) return 0.72;
  return 1;
}

export default function RealTransformationsSec({
  rowOne,
  rowTwo,
}: {
  rowOne: Artwork[];
  rowTwo: Artwork[];
}) {
  const artworks = useMemo(() => [...rowOne, ...rowTwo], [rowOne, rowTwo]);
  const count = artworks.length;
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [spread, setSpread] = useState<CoverSpread>({ stride: 178, width: 220, height: 270, depth: 3 });

  useEffect(() => {
    const apply = () => setSpread(measureCover());
    apply();
    window.addEventListener("resize", apply);
    return () => window.removeEventListener("resize", apply);
  }, []);

  useEffect(() => {
    if (!count || paused) return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) return;
    const timer = window.setInterval(() => {
      setActive((index) => (index + 1) % count);
    }, 4200);
    return () => window.clearInterval(timer);
  }, [count, paused]);

  const step = (delta: number) => {
    if (!count) return;
    setActive((index) => (index + delta + count) % count);
  };

  const slots = Array.from({ length: spread.depth * 2 + 3 }, (_, index) => index - (spread.depth + 1));
  const dotCount = Math.min(5, count);
  const dots = Array.from({ length: dotCount }, (_, index) => {
    const start = active - Math.floor(dotCount / 2);
    return (start + index + count) % count;
  });

  return (
    <section
      id="real-transformations"
      className="relative z-20 overflow-visible py-16 sm:py-20 lg:py-24"
      style={{
        backgroundColor: "#ffffff",
        backgroundImage: "radial-gradient(circle, #e2ded4 1.5px, transparent 1.5px)",
        backgroundSize: "24px 24px",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="pointer-events-none absolute -left-24 top-8 h-72 w-72 rounded-full bg-[#fde4d2] blur-3xl" />
      <div className="pointer-events-none absolute -right-16 top-0 h-80 w-80 rounded-full bg-[#fff0e4] blur-3xl" />
      <div className="pointer-events-none absolute bottom-16 left-1/2 h-56 w-[36rem] -translate-x-1/2 rounded-full bg-[#ffe8d8]/80 blur-3xl" />

      <img
        src="/images/landing/transformations-flowers.png"
        alt=""
        className="pointer-events-none absolute top-1 left-0 hidden h-28 w-auto select-none object-contain object-left-top lg:block xl:h-36 2xl:h-44"
      />
      <img
        src="/images/landing/transformations-heart.png"
        alt=""
        className="pointer-events-none absolute top-0 right-0 hidden h-32 w-auto select-none object-contain object-right-top lg:block xl:h-40 2xl:h-48"
      />

      <div className="nav-width relative z-10 text-center">
        <div className="flex items-center justify-center gap-4 text-[11px] font-semibold uppercase tracking-[0.28em]" style={{ color: ACCENT }}>
          <span className="h-px w-10 bg-[#f0b48a]" />
          Real Transformations
          <span className="h-px w-10 bg-[#f0b48a]" />
        </div>

        <h2
          className="mx-auto mt-5 max-w-5xl text-[1.85rem] leading-[1.15] font-semibold tracking-tight text-stone-950 sm:text-[2.45rem] lg:text-[2.9rem] lg:whitespace-nowrap"
          style={{ fontFamily: '"Iowan Old Style", Palatino, "Palatino Linotype", Georgia, serif' }}
        >
          From “I Can't” To{" "}
          <span className="italic whitespace-nowrap" style={{ color: ACCENT }}>
            “I Created This.”
          </span>
        </h2>

        <p className="mx-auto mt-5 max-w-3xl text-sm leading-relaxed text-stone-500 sm:text-base">
          Every student begins somewhere. Some begin with zero experience. Some begin with self-doubt. Some begin after years of putting their creativity aside. But with the right guidance, practice and community, they start creating things they once thought were impossible.
        </p>

        <div className="mx-auto mt-6 inline-flex max-w-3xl items-center justify-center gap-2 rounded-full border border-[#f6d7c4] bg-[#fff4ec] px-4 py-2 text-center text-[13px] leading-snug sm:max-w-none sm:px-5 sm:text-sm" style={{ color: ACCENT }}>
          <Sparkles size={14} className="shrink-0" />
          <span>The transformation isn't just in what their hands can create. It's in what they start believing about themselves.</span>
        </div>
      </div>

      <div
        className="nav-width relative mt-12"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onPointerDown={(event) => {
          if ((event.target as HTMLElement).closest("button")) return;
          event.currentTarget.dataset.swipe = String(event.clientX);
        }}
        onPointerUp={(event) => {
          const start = Number(event.currentTarget.dataset.swipe || "");
          delete event.currentTarget.dataset.swipe;
          if (!start) return;
          const delta = event.clientX - start;
          if (delta > 48) step(-1);
          else if (delta < -48) step(1);
        }}
      >
        <div id="creation-slider" className="relative h-[22.5rem] sm:h-[23.5rem] lg:h-[24rem] xl:h-[27.5rem]">
          <button
            type="button"
            aria-label="Previous creation"
            onClick={() => step(-1)}
            className="absolute top-1/2 left-2 z-30 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-stone-500 shadow-[0_8px_24px_-10px_rgba(80,40,10,0.45)] ring-1 ring-orange-100 transition hover:text-stone-800 sm:left-4"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            type="button"
            aria-label="Next creation"
            onClick={() => step(1)}
            className="absolute top-1/2 right-2 z-30 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-stone-500 shadow-[0_8px_24px_-10px_rgba(80,40,10,0.45)] ring-1 ring-orange-100 transition hover:text-stone-800 sm:right-4"
          >
            <ChevronRight size={20} />
          </button>
          {count > 0 &&
            slots.map((offset) => {
              const index = (active + offset + count) % count;
              const art = artworks[index];
              const isCenter = offset === 0;
              const distance = Math.abs(offset);
              return (
                <button
                  key={count > spread.depth * 2 ? index : `${offset}-${index}`}
                  type="button"
                  aria-label={art.title}
                  onClick={() => {
                    if (!isCenter) setActive(index);
                  }}
                  className="absolute top-1/2 left-1/2 overflow-hidden bg-white motion-reduce:transition-none"
                  style={{
                    width: isCenter ? Math.round(spread.width * 1.26) : spread.width,
                    height: isCenter ? Math.round(spread.height * 1.24) : spread.height,
                    zIndex: 20 - distance,
                    opacity: coverOpacity(offset, spread.depth),
                    pointerEvents: distance > spread.depth ? "none" : "auto",
                    borderRadius: isCenter ? 24 : 18,
                    boxShadow: isCenter
                      ? "0 22px 40px -18px rgba(110, 52, 16, 0.5)"
                      : "0 14px 28px -18px rgba(70, 36, 10, 0.38)",
                    transform: `translate(-50%, -50%) translateX(${offset * spread.stride}px) scale(${coverScale(offset)})`,
                    transition:
                      "transform 760ms cubic-bezier(0.22, 1, 0.36, 1), width 760ms cubic-bezier(0.22, 1, 0.36, 1), height 760ms cubic-bezier(0.22, 1, 0.36, 1), opacity 760ms ease, box-shadow 760ms ease, border-radius 760ms ease",
                  }}
                >
                  <img
                    src={art.image}
                    alt={art.title}
                    draggable={false}
                    className="absolute object-cover object-center"
                    style={{
                      top: isCenter ? 7 : 0,
                      left: isCenter ? 7 : 0,
                      width: isCenter ? "calc(100% - 14px)" : "100%",
                      height: isCenter ? "calc(100% - 14px)" : "100%",
                      borderRadius: isCenter ? 17 : 18,
                    }}
                  />
                </button>
              );
            })}
        </div>

        <div className="mt-6 flex items-center justify-center gap-2">
          {dots.map((index) => {
            const isActive = index === active;
            return (
              <button
                key={index}
                type="button"
                aria-label={`Show creation ${index + 1}`}
                onClick={() => setActive(index)}
                className={`h-1.5 rounded-full transition-all duration-300 ${isActive ? "w-5" : "w-1.5 bg-[#f0c2a4]"}`}
                style={isActive ? { backgroundColor: ACCENT } : undefined}
              />
            );
          })}
        </div>
      </div>

      <div className="nav-width relative mt-10">
        <div className="flex flex-col divide-y divide-[#f3e0d2] rounded-[1.75rem] border border-[#f6e4d6] bg-white/80 shadow-[0_16px_40px_-28px_rgba(180,90,30,0.7)] sm:flex-row sm:divide-x sm:divide-y-0 sm:rounded-full">
          {STATS.map((stat) => (
            <div key={stat.label} className="flex flex-1 items-center justify-center gap-3 px-5 py-3.5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#fff1e8]" style={{ color: ACCENT }}>
                <stat.icon size={20} strokeWidth={1.7} />
              </span>
              <span className="text-left leading-tight">
                <span className="block text-lg font-bold" style={{ color: ACCENT }}>
                  {stat.value}
                </span>
                <span className="block text-xs text-stone-400">{stat.label}</span>
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ─── BOTTOM CLOUDY WAVE ─── */}
      <div
        className="real-transformations-cloud-wave-bottom absolute -bottom-[27px] sm:-bottom-[31px] left-0 right-0 w-full h-[28px] sm:h-[32px] pointer-events-none z-40"
        style={{
          backgroundColor: "#ffffff",
          backgroundImage: "radial-gradient(circle, #e2ded4 1.5px, transparent 1.5px)",
          backgroundSize: "24px 24px",
          backgroundAttachment: "fixed",
          WebkitMaskImage: "radial-gradient(circle at 50% 0%, #000 32px, transparent 32.5px)",
          maskImage: "radial-gradient(circle at 50% 0%, #000 32px, transparent 32.5px)",
          WebkitMaskSize: "64px 32px",
          maskSize: "64px 32px",
          WebkitMaskRepeat: "repeat-x",
          maskRepeat: "repeat-x",
          WebkitMaskPosition: "center top",
          maskPosition: "center top",
          filter: "drop-shadow(0 4px 6px rgba(0, 0, 0, 0.08))",
        }}
        aria-hidden="true"
      />
    </section>
  );
}
