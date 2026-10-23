"use client";

import React, { useEffect, useState, type TouchEvent } from "react";

export type CommunityStory = {
  quote: string;
  name: string;
  role: string;
};

export type CommunitySectionData = {
  eyebrow: string;
  heading: string;
  subheading: string;
  items: CommunityStory[];
};

const LOOKS = [
  {
    bg: "#FFF8ED",
    mark: "#C4A574",
    plus: "#C4A26A",
    tape: "#D8C5A8",
  },
  {
    bg: "#FFF0F1",
    mark: "#E7A3AB",
    plus: "#E08B96",
    tape: "#F0C8CE",
  },
  {
    bg: "#EDF8EE",
    mark: "#7EAE86",
    plus: "#6A9B72",
    tape: "#CDE3D1",
  },
  {
    bg: "#F2EEFF",
    mark: "#A894E0",
    plus: "#7E68C4",
    tape: "#D6CEEE",
  },
];

const TILTS = [-2.5, 2, -2.5, 2];

/* ─── EXACT DOODLE SVGs (MATCHING REFERENCE DESIGN) ─── */

/** 1. Hand-drawn 3-line burst doodle (`\ | /`) */
function ThreeLineBurst({
  className = "",
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      viewBox="0 0 36 32"
      fill="none"
      className={className}
      style={style}
      aria-hidden="true"
    >
      <path
        d="M8 6 C12 12 15 18 17 24"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="M18 4 C20 12 21 18 21 26"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="M28 8 C25 14 24 20 23 26"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** 2. Hand-drawn outline Heart with 3 radiating sparks off its top-right */
function HeartWithRays({
  className = "",
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      viewBox="0 0 46 42"
      fill="none"
      className={className}
      style={style}
      aria-hidden="true"
    >
      <path
        d="M19 33 C11 25.5 3.5 19 5 12 C6.5 6 13 6.5 19 13.5 C25 6.5 31.5 6 33 12 C34.5 19 27 25.5 19 33 Z"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M35 7 L39 4" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M38 12 L43 11" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M37 17 L41 19" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

/** 3. Solo Hand-drawn Outline Heart between cards */
function SoloHeart({
  className = "",
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      viewBox="0 0 28 26"
      fill="none"
      className={className}
      style={style}
      aria-hidden="true"
    >
      <path
        d="M14 23 C7.5 17 2 12.5 3 7.5 C4 3.5 9.5 3.8 14 9.5 C18.5 3.8 24 3.5 25 7.5 C26 12.5 20.5 17 14 23 Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** 4. Hand-drawn 4-Point OUTLINE Sparkle Star (Not filled) */
function StarSparkle({
  className = "",
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      className={className}
      style={style}
      aria-hidden="true"
    >
      <path
        d="M16 2.5 C16 9.5 18 13.5 28 16 C18 18.5 16 22.5 16 29.5 C16 22.5 14 18.5 4 16 C14 13.5 16 9.5 16 2.5 Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <circle cx="28" cy="7" r="1.4" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <circle cx="6" cy="25" r="1.2" stroke="currentColor" strokeWidth="1.3" fill="none" />
    </svg>
  );
}

/** 5. Stylized Double Quote Glyph */
function QuoteGlyph({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M4 14c0-4 2.5-8 7-10l1.5 2C9 7.5 7.5 10 7.5 12h4.5v10H4V14zm14 0c0-4 2.5-8 7-10l1.5 2C23 7.5 21.5 10 21.5 12h4.5v10H18V14z" />
    </svg>
  );
}

function visibleCount(width: number) {
  if (width < 768) return 1;
  if (width < 1024) return 2;
  if (width < 1280) return 3;
  return 4;
}

export default function CommunityStories({ section }: { section: CommunitySectionData }) {
  const items = section.items;
  const [perView, setPerView] = useState(4);
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState<number | null>(null);

  const maxIndex = Math.max(0, items.length - perView);

  useEffect(() => {
    const apply = () => {
      const next = visibleCount(window.innerWidth);
      setPerView(next);
      setIndex((current) => Math.min(current, Math.max(0, items.length - next)));
    };
    apply();
    window.addEventListener("resize", apply);
    return () => window.removeEventListener("resize", apply);
  }, [items.length]);

  const go = (direction: number) => {
    setIndex((current) => Math.min(maxIndex, Math.max(0, current + direction)));
  };

  const onTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    const start = Number(event.currentTarget.dataset.x || 0);
    const startY = Number(event.currentTarget.dataset.y || 0);
    const dx = event.changedTouches[0].clientX - start;
    const dy = event.changedTouches[0].clientY - startY;
    if (Math.abs(dx) < 48 || Math.abs(dx) < Math.abs(dy)) return;
    go(dx < 0 ? 1 : -1);
  };

  // Split heading into 2 clean lines in bold black color
  const headingWords = section.heading.split(" ");
  const line1 = headingWords.slice(0, 5).join(" "); // "Women like you are turning"
  const line2 = headingWords.slice(5).join(" "); // "creativity into confidence"

  return (
    <section
      id="community"
      className="relative w-full overflow-hidden bg-[#FFFFFF] py-14 sm:py-18 lg:py-22"
      aria-label={section.heading}
    >
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* ─── HEADER AREA WITH DOODLES (NO ARROW BUTTONS) ─── */}
        <div className="relative mx-auto mb-10 max-w-4xl text-center sm:mb-14">

          {/* Doodle 1: 3-line burst on top-left of heading */}
          <ThreeLineBurst
            className="pointer-events-none absolute -top-4 left-4 size-7 text-[#C4A574] sm:-top-5 sm:left-12 sm:size-9 md:left-20 lg:left-28"
            style={{ transform: "rotate(-25deg)" }}
          />

          {/* Doodle 2: Heart with 3 rays on top-right of heading */}
          <HeartWithRays
            className="pointer-events-none absolute -top-3 right-4 size-8 text-[#B94F1B] sm:-top-5 sm:right-12 sm:size-10 md:right-20 lg:right-28"
            style={{ transform: "rotate(12deg)" }}
          />

          {/* Eyebrow */}
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#A69B8F] sm:text-xs">
            {section.eyebrow || "STUDENT STORIES"}
          </p>

          {/* Heading: Exactly 2 lines in bold BLACK color */}
          <h2 className="font-serif text-3xl font-extrabold leading-[1.18] tracking-tight text-[#171c24] sm:text-4xl md:text-5xl lg:text-[46px]">
            {line1} <br />
            <span>{line2}</span>
          </h2>

          {/* Subheading */}
          <p className="mx-auto mt-3.5 max-w-2xl text-xs leading-relaxed text-[#77716C] sm:text-sm md:text-base">
            {section.subheading}
          </p>
        </div>

        {/* ─── STAGE AREA WITH CARDS AND DOODLES ─── */}
        <div className="relative">

          {/* Doodle 3: 3-line burst to the left of Card 1 */}
          <ThreeLineBurst
            className="pointer-events-none absolute -left-3 top-10 hidden size-8 text-[#C4A574] sm:block sm:size-9"
            style={{ transform: "rotate(-50deg)" }}
          />

          {/* Doodle 4: Hand-drawn Solo Heart between Card 1 and Card 2 */}
          <SoloHeart
            className="pointer-events-none absolute top-32 z-20 hidden size-6 text-[#292522]/70 md:block lg:left-[24%]"
            style={{ transform: "rotate(-15deg)" }}
          />

          {/* Doodle 5: 3-line burst on top of Card 2 / Card 3 gap */}
          <ThreeLineBurst
            className="pointer-events-none absolute -top-4 z-20 hidden size-7 text-[#292522]/80 lg:left-[70%] lg:block"
            style={{ transform: "rotate(30deg)" }}
          />

          {/* Doodle 6: 4-point OUTLINE Sparkle Star to the right of Card 4 */}
          <StarSparkle
            className="pointer-events-none absolute -right-3 bottom-14 hidden size-7 text-[#292522]/75 sm:block sm:size-8"
          />

          {/* ─── MOBILE VIEW: ALL TESTIMONIAL CARDS SHOWN ONE BY ONE ─── */}
          <div className="flex flex-col gap-10 md:hidden max-w-sm sm:max-w-md mx-auto pt-2 pb-6 px-1">
            {items.map((item, idx) => {
              const look = LOOKS[idx % LOOKS.length];
              const expanded = open === idx;
              // Gentle alternated tilt for playful authentic sticky-note feel
              const mobTilt = idx % 2 === 0 ? -1.2 : 1.2;

              return (
                <article
                  key={`mob-${item.name}-${idx}`}
                  className="group relative flex flex-col justify-between rounded-[20px] p-5 sm:p-6 shadow-[0_10px_25px_-8px_rgba(60,40,20,0.1)] transition-all duration-300 hover:rotate-0 hover:scale-[1.01]"
                  style={{
                    backgroundColor: look.bg,
                    transform: `rotate(${mobTilt}deg)`,
                  }}
                >
                  {/* Crisp Authentic Washi Tape */}
                  <span
                    className="pointer-events-none absolute -top-2.5 left-1/2 h-3.5 w-14 -translate-x-1/2 -rotate-6 rounded-[1px] shadow-[0_1px_2px_rgba(0,0,0,0.12)] border-t border-b border-black/5"
                    style={{
                      backgroundColor: look.tape,
                    }}
                    aria-hidden="true"
                  />

                  {/* Card Content Top */}
                  <div>
                    <div style={{ color: look.mark }} className="mb-2.5">
                      <QuoteGlyph className="h-5 w-7" />
                    </div>

                    <p
                      className={`text-xs leading-relaxed text-[#3a342e] sm:text-[13px] ${expanded ? "block" : "line-clamp-5"
                        }`}
                    >
                      &ldquo;{item.quote}&rdquo;
                    </p>
                  </div>

                  {/* Card Foot */}
                  <div className="mt-4 flex items-end justify-between border-t border-stone-900/10 pt-3.5">
                    <div>
                      <h4 className="text-sm font-bold text-[#171c24]">
                        {item.name}
                      </h4>
                      <p className="text-[11px] text-[#8a8178]">{item.role}</p>
                    </div>

                    {/* <button
                      type="button"
                      aria-expanded={expanded}
                      aria-label={
                        expanded
                          ? `Collapse review from ${item.name}`
                          : `Expand review from ${item.name}`
                      }
                      onClick={() => setOpen(expanded ? null : idx)}
                      style={{ backgroundColor: look.plus }}
                      className={`flex h-7 w-7 cursor-pointer items-center justify-center rounded-full text-white shadow-xs transition-transform duration-300 ${
                        expanded ? "rotate-45" : "hover:scale-110"
                      }`}
                    >
                      <svg
                        viewBox="0 0 16 16"
                        className="size-3"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      >
                        <path d="M8 3.2v9.6M3.2 8h9.6" />
                      </svg>
                    </button> */}
                  </div>
                </article>
              );
            })}
          </div>

          {/* ─── DESKTOP & TABLET VIEW: 4-COLUMN CAROUSEL / GRID ─── */}
          <div
            className="hidden md:block w-full overflow-hidden pb-6 pt-3"
            data-x="0"
            data-y="0"
            onTouchStart={(event) => {
              event.currentTarget.dataset.x = String(event.touches[0].clientX);
              event.currentTarget.dataset.y = String(event.touches[0].clientY);
            }}
            onTouchEnd={onTouchEnd}
          >
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{
                width: `${(items.length / perView) * 100}%`,
                transform: `translate3d(-${index * (100 / items.length)}%, 0, 0)`,
              }}
            >
              {items.map((item, idx) => {
                const look = LOOKS[idx % LOOKS.length];
                const expanded = open === idx;
                const tilt = TILTS[idx % TILTS.length];

                return (
                  <div
                    key={`${item.name}-${idx}`}
                    className="px-2.5 sm:px-3"
                    style={{ width: `${100 / items.length}%` }}
                  >
                    {/* Compact Sticky Note Review Card with natural height (no excessive gap) */}
                    <article
                      className="group relative flex flex-col justify-between rounded-[20px] p-5 sm:p-6 shadow-[0_10px_25px_-8px_rgba(60,40,20,0.1)] transition-all duration-300 hover:rotate-0 hover:scale-[1.02] hover:shadow-[0_18px_36px_-10px_rgba(60,40,20,0.15)]"
                      style={{
                        backgroundColor: look.bg,
                        transform: `rotate(${tilt}deg)`,
                      }}
                    >
                      {/* Crisp Authentic Washi Tape (Exact like 1st Reference Image, unblurred) */}
                      <span
                        className="pointer-events-none absolute -top-2.5 left-1/2 h-3.5 w-14 -translate-x-1/2 -rotate-6 rounded-[1px] shadow-[0_1px_2px_rgba(0,0,0,0.12)] border-t border-b border-black/5 sm:-top-3 sm:h-4 sm:w-16"
                        style={{
                          backgroundColor: look.tape,
                        }}
                        aria-hidden="true"
                      />

                      {/* Card Content Top */}
                      <div>
                        {/* Stylized Double Quote Glyph */}
                        <div style={{ color: look.mark }} className="mb-2.5">
                          <QuoteGlyph className="h-5 w-7" />
                        </div>

                        {/* Quote Text (Snug natural spacing) */}
                        <p
                          className={`text-xs leading-relaxed text-[#3a342e] sm:text-[13px] ${expanded ? "block" : "line-clamp-5"
                            }`}
                        >
                          &ldquo;{item.quote}&rdquo;
                        </p>
                      </div>

                      {/* Card Foot: Snug spacing without excessive void */}
                      <div className="mt-4 flex items-end justify-between border-t border-stone-900/10 pt-3.5 sm:mt-5 sm:pt-4">
                        <div>
                          <h4 className="text-sm font-bold text-[#171c24] sm:text-[14.5px]">
                            {item.name}
                          </h4>
                          <p className="text-[11px] text-[#8a8178] sm:text-xs">{item.role}</p>
                        </div>

                        {/* Circular Action Button with Plus Icon */}
                        {/* <button
                          type="button"
                          aria-expanded={expanded}
                          aria-label={
                            expanded
                              ? `Collapse review from ${item.name}`
                              : `Expand review from ${item.name}`
                          }
                          onClick={() => setOpen(expanded ? null : idx)}
                          style={{ backgroundColor: look.plus }}
                          className={`flex h-7 w-7 cursor-pointer items-center justify-center rounded-full text-white shadow-xs transition-transform duration-300 sm:h-8 sm:w-8 ${
                            expanded ? "rotate-45" : "hover:scale-110"
                          }`}
                        >
                          <svg
                            viewBox="0 0 16 16"
                            className="size-3 sm:size-3.5"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                          >
                            <path d="M8 3.2v9.6M3.2 8h9.6" />
                          </svg>
                        </button> */}
                      </div>
                    </article>
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
