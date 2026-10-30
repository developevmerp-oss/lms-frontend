"use client";

import React, { useState } from "react";
import { ArrowRight } from "lucide-react";

export interface SoundFamiliarData {
  eyebrow?: string;
  heading: string;
  subheading: string;
  items: string[];
  turn?: string;
}

interface SoundFamiliarSectionProps {
  data?: SoundFamiliarData;
  onScrollToRegister?: () => void;
}

const DEFAULT_DATA: SoundFamiliarData = {
  eyebrow: "SOUND FAMILIAR?",
  heading: "If any of this is true right now, this Masterclass is for you",
  subheading:
    "Most talented artists aren't stuck because they lack ability. They're stuck because nothing is joined up.",
  items: [
    "You jump between random tutorials and still don't know what to learn next.",
    "You know some resin art, but you lack confidence and a signature style.",
    "You struggle to get consistent orders or customers.",
    "You don't know how to price, brand or market your work.",
    "You want to start but feel overwhelmed and don't know where to begin.",
    "You're doing it all alone, with no community or feedback.",
  ],
  turn:
    "None of that means you're behind. It usually means you're missing one structure — Mastery, Mindset and Monetization together. That's exactly what we cover.",
};

function parseItem(item: string): { title: string; subtitle: string } {
  if (item.includes("and still don't know")) {
    return {
      title: "You jump between random tutorials",
      subtitle: "and still don't know what to learn next.",
    };
  }
  if (item.includes("but you lack confidence")) {
    return {
      title: "You know some resin art",
      subtitle: "but you lack confidence and a signature style.",
    };
  }
  if (item.includes("orders or customers")) {
    return {
      title: "You struggle to get consistent",
      subtitle: "orders or customers.",
    };
  }
  if (item.includes("brand or market your work")) {
    return {
      title: "You don't know how to price,",
      subtitle: "brand or market your work.",
    };
  }
  if (item.includes("and don't know where to begin")) {
    return {
      title: "You want to start but feel overwhelmed",
      subtitle: "and don't know where to begin.",
    };
  }
  if (item.includes("with no community or feedback")) {
    return {
      title: "You're doing it all alone,",
      subtitle: "with no community or feedback.",
    };
  }

  // Fallback for custom strings
  const commaIdx = item.indexOf(",");
  if (commaIdx !== -1 && commaIdx < item.length - 8) {
    return {
      title: item.slice(0, commaIdx + 1).trim(),
      subtitle: item.slice(commaIdx + 1).trim(),
    };
  }
  return { title: item, subtitle: "" };
}

export default function SoundFamiliarSection({
  data = DEFAULT_DATA,
  onScrollToRegister,
}: SoundFamiliarSectionProps) {
  const { eyebrow, heading, subheading, items, turn } = data;
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const handleRedirect = () => {
    if (onScrollToRegister) {
      onScrollToRegister();
    } else {
      const registerElement = document.getElementById("register");
      if (registerElement) {
        registerElement.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <section
      id="sound-familiar"
      className="relative w-full py-20 sm:py-28 lg:py-32 overflow-hidden text-neutral-950"
      style={{
        backgroundColor: "#ffffff",
        backgroundImage: "radial-gradient(circle, #e2ded4 1.5px, transparent 1.5px)",
        backgroundSize: "24px 24px",
        backgroundAttachment: "fixed",
      }}
    >
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

      {/* ─── FULL-WIDTH CONTENT CONTAINER ─── */}
      <div className="mx-auto container px-5 sm:px-10 lg:px-10 2xl:px-0 relative z-10">
        {/* Previous Centered Header with Original Badge, Title & Description */}
        <div className="mx-auto mb-12 max-w-3xl text-center sm:mb-16">
          {eyebrow && (
            <span className="mb-4 inline-flex items-center text-xs sm:text-base lg:text-xs font-semibold uppercase tracking-[0.18em] text-[#942008]">
              {eyebrow}
            </span>
          )}
          <h2 className="mb-4 text-3xl sm:text-5xl lg:text-5xl font-black tracking-tight text-neutral-950">
            If any of this is true right now, this <span className="text-[#942008]">Masterclass is for you</span>
          </h2>
          {subheading && (
            <p className="mx-auto max-w-2xl text-sm sm:text-xl lg:text-base text-neutral-600 leading-relaxed">
              {subheading}
            </p>
          )}
        </div>

        {/* ─── FULL-WIDTH LIST OF POINTS WITH LIQUID FILL HOVER ─── */}
        <div className="flex flex-col border-t border-stone-200/90">
          {items.map((item, idx) => {
            const { title, subtitle } = parseItem(item);
            const isHovered = hoveredIdx === idx;
            const formattedNumber = String(idx + 1).padStart(2, "0");

            return (
              <div
                key={idx}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                onTouchStart={() => setHoveredIdx(idx)}
                onClick={handleRedirect}
                className="group relative flex items-center justify-between py-6 sm:py-7 lg:py-8 px-4 sm:px-6 cursor-pointer select-none border-b border-stone-200/90 transition-all duration-300"
              >
                {/* ──── LIQUID FILL BACKGROUND: Bottom-to-Top in Light Orange Shade ──── */}
                <div
                  className="absolute inset-x-2 inset-y-1.5 z-0 pointer-events-none rounded-xl sm:rounded-2xl overflow-hidden"
                >
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-[#FFEADB] via-[#FFF3EA] to-[#FFF9F5] border border-[#F3D3C0]/80 rounded-xl sm:rounded-2xl shadow-[0_8px_24px_-6px_rgba(200,101,59,0.12)] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                    style={{
                      transformOrigin: "bottom",
                      transform: isHovered ? "scaleY(1)" : "scaleY(0)",
                    }}
                  />
                </div>

                {/* Left Number */}
                <span
                  className={`relative z-10 text-xs sm:text-base lg:text-sm font-mono font-medium shrink-0 w-10 sm:w-16 transition-colors duration-400 ${
                    isHovered ? "text-[#C8653B] font-semibold" : "text-stone-400"
                  }`}
                >
                  {formattedNumber}
                </span>

                {/* Center / Title and Subtitle Content */}
                <div className="relative z-10 flex flex-col flex-1 px-4 sm:px-8">
                  <span
                    className={`text-base sm:text-xl lg:text-lg font-bold tracking-tight transition-colors duration-400 leading-snug ${
                      isHovered ? "text-[#C8653B]" : "text-stone-900"
                    }`}
                  >
                    {title}
                  </span>
                  {subtitle && (
                    <span
                      className={`text-xs sm:text-base lg:text-sm font-normal mt-1 transition-colors duration-400 ${
                        isHovered ? "text-stone-700" : "text-stone-500"
                      }`}
                    >
                      {subtitle}
                    </span>
                  )}
                </div>

                {/* Far Right Arrow: Clicking redirects to webinar register form */}
                <div
                  role="button"
                  tabIndex={0}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRedirect();
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleRedirect();
                    }
                  }}
                  className="relative z-10 shrink-0 p-2 text-stone-400 group-hover:text-[#C8653B] transition-colors duration-300"
                  title="Register for Masterclass"
                >
                  <ArrowRight
                    className={`w-5 h-5 sm:w-6 sm:h-6 transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      isHovered
                        ? "text-[#C8653B] translate-x-2"
                        : "text-stone-400"
                    }`}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* ─── BOTTOM CLOSING TEXT ("turn") ─── */}
        {turn && (
          <div className="mt-12 sm:mt-16 text-center max-w-2xl mx-auto">
            <p className="text-sm sm:text-xl lg:text-base font-normal leading-relaxed text-stone-600">
              {turn}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
