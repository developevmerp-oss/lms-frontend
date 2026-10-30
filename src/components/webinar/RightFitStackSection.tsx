"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Lightbulb,
  Palette,
  Home,
  Briefcase,
  TrendingUp,
  Store,
} from "lucide-react";

export type RightFitItem = {
  title: string;
  body: string;
  image?: string;
};

export type RightFitData = {
  eyebrow?: string;
  heading?: string;
  subheading?: string;
  items: RightFitItem[];
};

interface RightFitStackSectionProps {
  data?: RightFitData;
}

const CARD_ICONS = [
  Lightbulb,    // 1. The Passionate Beginner
  Palette,      // 2. The Aspiring Artist
  Home,         // 3. The Homemaker Ready for Her Own Identity
  Briefcase,    // 4. The Working Professional
  TrendingUp,   // 5. The Existing Resin Artist
  Store,        // 6. The Creative Entrepreneur
];

const DEFAULT_ITEMS: RightFitItem[] = [
  {
    title: "The Passionate Beginner",
    body: "You have always wanted to create beautiful resin art but need a structured path.",
  },
  {
    title: "The Aspiring Artist",
    body: "You want to move beyond hobby-level work and develop premium skills.",
  },
  {
    title: "The Homemaker Ready for Her Own Identity",
    body: "You want something that belongs to you — creatively and financially.",
  },
  {
    title: "The Working Professional",
    body: "You want to build a creative income stream alongside your existing work.",
  },
  {
    title: "The Existing Resin Artist",
    body: "You know the basics but want better skills, stronger positioning and more consistent opportunities.",
  },
  {
    title: "The Creative Entrepreneur",
    body: "You want to turn your creative expertise into a structured business.",
  },
];

export default function RightFitStackSection({ data }: RightFitStackSectionProps) {
  const items = data?.items && data.items.length > 0 ? data.items : DEFAULT_ITEMS;
  const eyebrow = data?.eyebrow || "RIGHT FIT?";
  const heading = data?.heading || "This Masterclass is for you if…";
  const subheading =
    data?.subheading ||
    "Six women walk into this session. You'll recognise yourself in one of them.";

  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="right-fit"
      className="relative w-full overflow-hidden text-neutral-950 py-16 sm:py-20 lg:py-28"
      style={{
        backgroundColor: "#732115",
        backgroundImage: "linear-gradient(145deg, #782417 0%, #681d12 100%)",
      }}
    >
      {/* ─── DELICATE GOLDEN FLOWING CONTOUR ACCENT (BOTTOM-RIGHT) ─── */}
      <svg
        className="absolute bottom-0 right-0 w-72 sm:w-[460px] h-72 sm:h-[460px] pointer-events-none opacity-30 select-none"
        viewBox="0 0 400 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M 30 400 Q 230 350 340 160 Q 390 60 400 0"
          stroke="#f2d2b6"
          strokeWidth="1.2"
          fill="none"
        />
        <path
          d="M 90 400 Q 270 370 370 210 Q 395 130 400 60"
          stroke="#f2d2b6"
          strokeWidth="1.2"
          fill="none"
        />
        <path
          d="M 160 400 Q 310 380 400 270"
          stroke="#f2d2b6"
          strokeWidth="1.2"
          fill="none"
        />
      </svg>

      {/* ─── SOFT CORNER BOTANICAL GLOW (TOP-RIGHT) ─── */}
      <div
        className="absolute -top-16 -right-16 w-80 sm:w-96 h-80 sm:h-96 pointer-events-none opacity-15 rounded-full blur-3xl select-none"
        style={{
          background: "radial-gradient(circle, #fde4ce 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">

          {/* ══════════ LEFT COLUMN: ARCH PHOTO SHOWCASE WITH FLOATING BADGES ══════════ */}
          <div
            className={`lg:col-span-5 flex justify-center transition-all duration-700 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
          >
            <div className="relative w-full max-w-[360px] sm:max-w-[420px] lg:max-w-[440px]">

              {/* Floating Badge 1: Torn Paper / Brush Sticker (Top-Left) */}
              <div
                className={`absolute -top-4 -left-3 sm:-top-5 sm:-left-5 z-20 -rotate-6 bg-[#fceddf] border border-[#f5d9c7] shadow-xl rounded-2xl px-4 sm:px-5 py-2.5 sm:py-3 max-w-[170px] sm:max-w-[190px] transition-all duration-700 delay-300 ease-out select-none ${isVisible ? "scale-100 opacity-100" : "scale-75 opacity-0"
                  }`}
              >
                <p className="font-serif italic font-bold text-xs sm:text-sm text-[#9c3623] leading-tight">
                  Different People
                </p>
                <p className="font-serif italic font-bold text-xs sm:text-sm text-[#9c3623] leading-tight mt-0.5 flex items-center gap-1">
                  Same Creative Dream <span className="text-sm">♡</span>
                </p>
              </div>

              {/* Main Arched Photo Container */}
              <div
                className="relative w-full aspect-[4/5.3] overflow-hidden shadow-2xl border-2 border-[#963725]/60 bg-[#5c180e]"
                style={{
                  borderRadius: "14rem 14rem 2rem 2rem",
                }}
              >
                <img
                  src="/images/webinar/rightfit-artist.jpg"
                  alt="Resin Artist at work"
                  className="w-full h-full object-cover object-[center_30%]"
                  loading="lazy"
                />
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(115,33,21,0.02) 60%, rgba(100,25,15,0.45) 100%)",
                  }}
                />
              </div>

              {/* Floating Badge 2: Botanical Circle (Bottom-Right) */}
              <div
                className={`absolute -bottom-5 -right-3 sm:-bottom-7 sm:-right-6 z-20 w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-[#fceddf] shadow-2xl overflow-hidden flex items-center justify-end pr-3 sm:pr-4 transition-all duration-700 delay-400 ease-out select-none ${isVisible ? "scale-100 opacity-100" : "scale-75 opacity-0"
                  }`}
              >
                {/* Botanical circular disc image scaled to clip any black corners */}
                <img
                  src="/images/webinar/rightfit-badge.png"
                  alt="Botanical branch"
                  className="absolute inset-0 w-full h-full object-cover scale-110 pointer-events-none"
                />
                {/* Vertical text on the right side of the badge */}
                <div className="relative z-10 flex flex-col text-[8px] sm:text-[10px] font-bold tracking-[0.2em] text-[#732115] uppercase leading-tight font-serif text-left">
                  <span>Create</span>
                  <span>Learn</span>
                  <span>Grow</span>
                  <span>Belong</span>
                  <span className="text-xs sm:text-sm text-[#9c3623]">♡</span>
                </div>
              </div>

            </div>
          </div>

          {/* ══════════ RIGHT COLUMN: HEADER & 6 CARDS IN 2 COLUMNS ══════════ */}
          <div className="lg:col-span-7">

            {/* Header Content */}
            <div
              className={`transition-all duration-700 delay-150 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                }`}
            >
              {/* Eyebrow with gold rule */}
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xs sm:text-sm font-semibold uppercase tracking-[0.22em] text-[#e8c8b4]">
                  {eyebrow}
                </span>
                <span className="h-[1px] w-14 sm:w-20 bg-[#e8c8b4]/60" aria-hidden="true" />
              </div>

              {/* Headline - Previous title rendered in the elegant serif styling */}
              <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-serif text-white leading-[1.15] tracking-tight">
                {heading.includes("Masterclass is for you") ? (
                  <>
                    This{" "}
                    <span className="text-[#fcdbc3] italic font-normal inline-block">
                      Masterclass is for you
                    </span>{" "}
                    if…
                  </>
                ) : (
                  heading
                )}
              </h2>

              {/* Subheadline - Previous description */}
              <p className="mt-3 text-sm sm:text-base lg:text-base text-[#f5ded0]/90 leading-relaxed max-w-2xl font-normal">
                {subheading}
              </p>
            </div>

            {/* 6 Cards Grid (2 cols on tablet/desktop, 1 col on mobile) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 mt-7 sm:mt-9">
              {items.slice(0, 6).map((item, idx) => {
                const IconComponent = CARD_ICONS[idx % CARD_ICONS.length];
                const delayMs = 200 + idx * 75;

                return (
                  <div
                    key={idx}
                    style={{ transitionDelay: `${delayMs}ms` }}
                    className={`rounded-2xl border border-[#eddcd0] bg-white p-4 sm:p-5 shadow-[0_8px_20px_-6px_rgba(40,10,5,0.18)] hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex items-start gap-3.5 sm:gap-4 group ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
                      }`}
                  >
                    {/* Soft peach circular icon */}
                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#fce8de] group-hover:bg-[#fbdcd0] flex items-center justify-center shrink-0 text-[#a33520] transition-colors shadow-sm">
                      <IconComponent className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={1.8} />
                    </div>

                    {/* Card Title & Description */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-serif font-bold text-neutral-900 text-sm sm:text-base leading-snug">
                        {item.title}
                      </h3>
                      <p className="text-neutral-600 text-xs sm:text-[13px] leading-relaxed mt-1 font-normal">
                        {item.body}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
