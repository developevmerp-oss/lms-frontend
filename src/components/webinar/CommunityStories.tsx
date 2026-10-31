"use client";

import React from "react";

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
    bg: "#FFF5EA",
    mark: "#C03C17",
    plus: "#C03C17",
    tape: "#D8C5A8",
    textColor: "#292524",
    nameColor: "#1c1917",
    roleColor: "#78716c",
    dividerColor: "rgba(0,0,0,0.08)",
  },
  {
    bg: "#B83A17",
    mark: "#FFFFFF",
    plus: "#8B230E",
    tape: "#7D230B",
    textColor: "#FFFFFF",
    nameColor: "#FFFFFF",
    roleColor: "#FED7AA",
    dividerColor: "rgba(255,255,255,0.25)",
  },
  {
    bg: "#FFF5EA",
    mark: "#C03C17",
    plus: "#C03C17",
    tape: "#D8C5A8",
    textColor: "#292524",
    nameColor: "#1c1917",
    roleColor: "#78716c",
    dividerColor: "rgba(0,0,0,0.08)",
  },
  {
    bg: "#701405",
    mark: "#FFFFFF",
    plus: "#4A0B02",
    tape: "#4A0B02",
    textColor: "#FFFFFF",
    nameColor: "#FFFFFF",
    roleColor: "#FECACA",
    dividerColor: "rgba(255,255,255,0.25)",
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

export default function CommunityStories({ section }: { section: CommunitySectionData }) {
  const items = section.items;

  // Split heading into 2 clean lines in bold black color
  const headingWords = section.heading.split(" ");
  const line1 = headingWords.slice(0, 5).join(" "); // "Women like you are turning"
  const line2 = headingWords.slice(5).join(" "); // "creativity into confidence"

  return (
    <section
      id="community"
      className="relative w-full overflow-hidden py-14 sm:py-18 lg:py-24"
      style={{
        backgroundColor: "#ffffff",
        backgroundImage: "radial-gradient(circle, #e2ded4 1.5px, transparent 1.5px)",
        backgroundSize: "24px 24px",
        backgroundAttachment: "fixed",
      }}
      aria-label={section.heading}
    >
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* ─── HEADER AREA WITH DOODLES ─── */}
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
          <p className="mb-3 text-sm sm:text-base md:text-base lg:text-sm font-semibold uppercase tracking-[0.18em] text-[#942008]">
            {section.eyebrow || "STUDENT STORIES"}
          </p>

          {/* Heading: Exactly 2 lines in bold BLACK color */}
          <h2 className="text-3xl sm:text-5xl lg:text-[3.25rem] font-black leading-[1.15] tracking-tight text-neutral-950">
            {line1} <br />
            <span className="text-[#942008]">{line2}</span>
          </h2>

          {/* Subheading */}
          <p className="mx-auto mt-4 max-w-2xl text-sm sm:text-xl lg:text-lg text-neutral-600 leading-relaxed">
            {section.subheading}
          </p>
        </div>

        {/* ─── STAGE AREA: FULLY VISIBLE 4 CARDS (STACKED ON MOBILE, 2X2 GRID ON TABLET, 4 COLUMNS ON DESKTOP) ─── */}
        <div className="relative">

          {/* Doodle 3: 3-line burst to the left of Card 1 */}
          <ThreeLineBurst
            className="pointer-events-none absolute -left-3 top-10 hidden size-8 text-[#C4A574] sm:block sm:size-9"
            style={{ transform: "rotate(-50deg)" }}
          />

          {/* Doodle 4: Hand-drawn Solo Heart between cards */}
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

          {/* Responsive Grid: 1 col on mobile, 2 cols on tablet (showing all 4 cards!), 4 cols on desktop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7 sm:gap-6 lg:gap-5 max-w-sm sm:max-w-none mx-auto pt-2 pb-6 px-1">
            {items.map((item, idx) => {
              const look = LOOKS[idx % LOOKS.length];
              const tilt = TILTS[idx % TILTS.length];

              return (
                <article
                  key={`${item.name}-${idx}`}
                  className="group relative flex flex-col justify-between rounded-[22px] p-6 sm:p-6 lg:p-6 shadow-[0_10px_25px_-8px_rgba(60,40,20,0.1)] transition-all duration-300 hover:rotate-0 hover:scale-[1.02] hover:shadow-[0_18px_36px_-10px_rgba(60,40,20,0.15)] min-h-[220px]"
                  style={{
                    backgroundColor: look.bg,
                    transform: `rotate(${tilt}deg)`,
                  }}
                >
                  {/* Crisp Authentic Washi Tape */}
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

                    {/* Quote Text */}
                    <p
                      style={{ color: look.textColor }}
                      className="text-sm sm:text-lg lg:text-base leading-relaxed"
                    >
                      &ldquo;{item.quote}&rdquo;
                    </p>
                  </div>

                  {/* Card Foot */}
                  <div
                    style={{ borderColor: look.dividerColor }}
                    className="mt-4 flex items-end justify-between border-t pt-3.5 sm:mt-5 sm:pt-4"
                  >
                    <div>
                      <h4
                        style={{ color: look.nameColor }}
                        className="text-base sm:text-xl lg:text-lg font-bold"
                      >
                        {item.name}
                      </h4>
                      <p
                        style={{ color: look.roleColor }}
                        className="text-xs sm:text-lg lg:text-sm"
                      >
                        {item.role}
                      </p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}