"use client";

import React, { useEffect, useRef } from "react";

export type RightFitItem = {
  title: string;
  body: string;
  image?: string;
};

export type RightFitData = {
  eyebrow: string;
  heading: string;
  subheading: string;
  items: RightFitItem[];
};

const DEFAULT_IMAGES = [
  "/images/student-art/real-art-1.jpg",
  "/images/student-art/real-art-2.jpg",
  "/images/student-art/real-art-3.jpg",
  "/images/student-art/real-art-7.jpg",
  "/images/student-art/real-art-8.jpg",
  "/images/student-art/real-art-17.jpg",
];

function clamp01(value: number) {
  return Math.min(Math.max(value, 0), 1);
}

function easeOutCubic(value: number) {
  return 1 - (1 - value) ** 3;
}

function segment(progress: number, start: number, end: number) {
  return easeOutCubic(clamp01((progress - start) / (end - start)));
}

interface RightFitStackSectionProps {
  data: RightFitData;
}

export default function RightFitStackSection({ data }: RightFitStackSectionProps) {
  const { eyebrow, heading, subheading, items } = data;
  const pinRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const pin = pinRef.current;
    if (!pin) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    let frame = 0;
    const update = () => {
      const travel = pin.offsetHeight - window.innerHeight;
      if (travel <= 0) return;
      const scrolled = Math.min(Math.max(-pin.getBoundingClientRect().top, 0), travel);
      const progress = scrolled / travel;

      const vh = window.innerHeight;
      const stageRect = stageRef.current?.getBoundingClientRect();
      const restingTop = stageRect ? stageRect.top : 220;
      const enterDistance = Math.max(vh - restingTop + 80, 750);

      const count = items.length;
      if (count <= 1) return;

      // 5 transitions for 6 cards (indices 1 to count - 1)
      const slotDuration = 0.16;
      const slotGap = 0.03;
      const totalSlot = slotDuration + slotGap;

      for (let i = 1; i < count; i++) {
        const cardNode = cardRefs.current[i];
        if (!cardNode) continue;

        const start = 0.04 + (i - 1) * totalSlot;
        const end = start + slotDuration;
        const seg = segment(progress, start, end);
        const shift = (1 - seg) * enterDistance;

        cardNode.style.transform = `translate3d(0, ${shift.toFixed(2)}px, 0)`;
      }
    };

    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [items.length]);

  return (
    <section id="right-fit" className="relative w-full text-neutral-950">
      {/* ─── TOP CLOUDY WAVE ─── */}
      <div
        className="absolute -top-[27px] sm:-top-[31px] left-0 right-0 w-full h-[28px] sm:h-[32px] pointer-events-none z-20"
        style={{
          backgroundColor: "#ffffff",
          backgroundImage: "radial-gradient(circle, #e2ded4 1.5px, transparent 1.5px)",
          backgroundSize: "24px 24px",
          WebkitMaskImage: "radial-gradient(circle at 50% 100%, #000 32px, transparent 32.5px)",
          maskImage: "radial-gradient(circle at 50% 100%, #000 32px, transparent 32.5px)",
          WebkitMaskSize: "64px 32px",
          maskSize: "64px 32px",
          WebkitMaskRepeat: "repeat-x",
          maskRepeat: "repeat-x",
          WebkitMaskPosition: "center bottom",
          maskPosition: "center bottom",
          filter: "drop-shadow(0 -3px 4px rgba(0, 0, 0, 0.03))",
        }}
        aria-hidden="true"
      />

      {/* ─── BOTTOM CLOUDY WAVE ─── */}
      <div
        className="absolute -bottom-[27px] sm:-bottom-[31px] left-0 right-0 w-full h-[28px] sm:h-[32px] pointer-events-none z-20"
        style={{
          backgroundColor: "#ffffff",
          backgroundImage: "radial-gradient(circle, #e2ded4 1.5px, transparent 1.5px)",
          backgroundSize: "24px 24px",
          WebkitMaskImage: "radial-gradient(circle at 50% 0%, #000 32px, transparent 32.5px)",
          maskImage: "radial-gradient(circle at 50% 0%, #000 32px, transparent 32.5px)",
          WebkitMaskSize: "64px 32px",
          maskSize: "64px 32px",
          WebkitMaskRepeat: "repeat-x",
          maskRepeat: "repeat-x",
          WebkitMaskPosition: "center top",
          maskPosition: "center top",
          filter: "drop-shadow(0 3px 4px rgba(0, 0, 0, 0.03))",
        }}
        aria-hidden="true"
      />

      {/* ─── MOBILE VIEW (< lg): Responsive card list ─── */}
      <div
        className="nav-width relative z-[1] py-16 sm:py-20 lg:hidden px-4 sm:px-6"
        style={{
          backgroundColor: "#ffffff",
          backgroundImage: "radial-gradient(circle, #e2ded4 1.5px, transparent 1.5px)",
          backgroundSize: "24px 24px",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          {eyebrow && (
            <span className="mb-4 inline-flex items-center text-xs sm:text-base lg:text-xs font-semibold uppercase tracking-[0.18em] text-[#942008]">
              {eyebrow}
            </span>
          )}
          <h2 className="mb-4 text-3xl sm:text-5xl lg:text-5xl font-black tracking-tight text-neutral-950">
            This <span className="text-[#942008]">Masterclass is for you</span> if…
          </h2>
          <p className="text-sm sm:text-xl lg:text-base text-neutral-600 leading-relaxed max-w-xl mx-auto">
            {subheading}
          </p>
        </div>

        <div className="flex flex-col gap-6">
          {items.map((item, idx) => {
            const imageSrc = item.image || DEFAULT_IMAGES[idx % DEFAULT_IMAGES.length];
            return (
              <article
                key={idx}
                className="relative rounded-2xl border border-[#eadfd4] bg-white p-5 sm:p-6 shadow-[0_16px_36px_-12px_rgba(90,55,20,0.12)] overflow-hidden"
              >
                {/* Number in Top Right Side */}
                <span className="absolute top-4 right-5 font-serif text-4xl sm:text-5xl font-light text-[#c56a45]/30 select-none">
                  {idx + 1}
                </span>

                {/* Pure Clean Image (No content inside) */}
                <div className="relative mb-4 overflow-hidden rounded-xl border border-[#eadfd4]/90 bg-[#faf6f0] aspect-[16/10]">
                  <img
                    src={imageSrc}
                    alt={item.title}
                    className="h-full w-full object-cover object-center"
                    loading="lazy"
                  />
                </div>

                {/* Title & Description */}
                <h3 className="text-base sm:text-xl lg:text-lg font-bold tracking-tight text-neutral-950 mb-2 pr-12">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-base lg:text-sm text-neutral-600 leading-relaxed">
                  {item.body}
                </p>
              </article>
            );
          })}
        </div>
      </div>

      {/* ─── DESKTOP VIEW (lg+): Stack Card Scroll Effect like selfreflactionsec ─── */}
      <div ref={pinRef} className="rightfit-pin hidden lg:block"
        style={{
          backgroundColor: "#ffffff",
          backgroundImage: "radial-gradient(circle, #e2ded4 1.5px, transparent 1.5px)",
          backgroundSize: "24px 24px",
          backgroundAttachment: "fixed",
        }}>
        <div className="rightfit-pin-sticky">
          <div className="nav-width w-full relative z-10 px-6 lg:px-8">
            
            {/* Header */}
            <div className="text-center max-w-3xl mx-auto mb-8 lg:mb-10">
              {eyebrow && (
                <span className="mb-4 inline-flex items-center text-xs sm:text-base lg:text-xs font-semibold uppercase tracking-[0.18em] text-[#942008]">
                  {eyebrow}
                </span>
              )}
              <h2 className="mb-4 text-3xl sm:text-5xl lg:text-5xl font-black tracking-tight text-neutral-950">
                This <span className="text-[#942008]">Masterclass is for you</span> if…
              </h2>
              <p className="text-sm sm:text-xl lg:text-base text-neutral-600 leading-relaxed max-w-2xl mx-auto">
                {subheading}
              </p>
            </div>

            {/* Stack Stage */}
            <div ref={stageRef} className="relative mx-auto max-w-5xl">
              <div className="rightfit-stack-cards-wrap">
                {items.map((item, idx) => {
                  const imageSrc = item.image || DEFAULT_IMAGES[idx % DEFAULT_IMAGES.length];
                  const isStacked = idx > 0;

                  return (
                    <article
                      key={idx}
                      ref={(node) => {
                        cardRefs.current[idx] = node;
                      }}
                      className={`rightfit-stack-card${isStacked ? " is-stacked" : ""}`}
                      style={{
                        zIndex: idx + 1,
                      }}
                    >
                      <div className="relative w-full rounded-[2.25rem] border border-[#eadfd4] bg-white p-7 lg:p-9  overflow-hidden">
                        
                        {/* ─── Number in Top Right Side ─── */}
                        <div className="absolute top-6 right-8 lg:top-8 lg:right-10 pointer-events-none select-none z-10">
                          <span className="font-serif text-5xl lg:text-6xl font-light text-[#c56a45]/35 tracking-tight leading-none">
                            {idx + 1}
                          </span>
                        </div>

                        <div className="grid grid-cols-12 gap-8 lg:gap-12 items-center">
                          {/* ─── Pure Clean Image (No content inside) ─── */}
                          <div className="col-span-6">
                            <div className="relative overflow-hidden rounded-2xl border border-[#eadfd4]/90 bg-[#faf6f0] aspect-[16/11]">
                              <img
                                src={imageSrc}
                                alt={item.title}
                                className="h-full w-full object-cover object-center"
                                loading="lazy"
                              />
                            </div>
                          </div>

                          {/* ─── Only Title and Description ─── */}
                          <div className="col-span-6 flex flex-col justify-center pr-16 lg:pr-20">
                            <h3 className="text-xl sm:text-3xl lg:text-2xl font-bold tracking-tight text-neutral-950 mb-3 sm:mb-4">
                              {item.title}
                            </h3>
                            <p className="text-sm sm:text-xl lg:text-base text-neutral-600 leading-relaxed">
                              {item.body}
                            </p>
                          </div>
                        </div>

                      </div>
                    </article>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
