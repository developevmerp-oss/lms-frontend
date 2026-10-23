"use client";

import React from "react";
import { X } from "lucide-react";

export interface SoundFamiliarData {
  eyebrow?: string;
  heading: string;
  subheading: string;
  items: string[];
  turn?: string;
}

interface SoundFamiliarSectionProps {
  data?: SoundFamiliarData;
}

const DEFAULT_DATA: SoundFamiliarData = {
  eyebrow: "SOUND FAMILIAR?",
  heading: "If any of this is true right now, this Masterclass is for you",
  subheading: "Most talented artists aren't stuck because they lack ability. They're stuck because nothing is joined up.",
  items: [
    "You jump between random tutorials and still don't know what to learn next.",
    "You know some resin art, but you lack confidence and a signature style.",
    "You struggle to get consistent orders or customers.",
    "You don't know how to price, brand or market your work.",
    "You want to start but feel overwhelmed and don't know where to begin.",
    "You're doing it all alone, with no community or feedback."
  ],
  turn: "None of that means you're behind. It usually means you're missing one structure — Mastery, Mindset and Monetization together. That's exactly what we cover."
};

export default function SoundFamiliarSection({ data = DEFAULT_DATA }: SoundFamiliarSectionProps) {
  const { eyebrow, heading, subheading, items, turn } = data;

  return (
    <section
      id="sound-familiar"
      className="relative w-full bg-[#FFFFFF] py-14 sm:py-20 lg:py-24"
    >
      <style jsx>{`
        @keyframes soundFamiliarSpin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .sound-familiar-clipped-box {
          --chamfer: 30px;
          clip-path: polygon(
            0 0,
            calc(100% - var(--chamfer)) 0,
            100% var(--chamfer),
            100% 100%,
            var(--chamfer) 100%,
            0 calc(100% - var(--chamfer))
          );
        }

        @media (min-width: 640px) {
          .sound-familiar-clipped-box {
            --chamfer: 48px;
          }
        }

        @media (min-width: 1024px) {
          .sound-familiar-clipped-box {
            --chamfer: 68px;
          }
        }

        .sound-familiar-icon-spin {
          display: inline-flex;
          transform-origin: center;
          transition: transform 0.4s ease-in-out;
        }

        .sound-familiar-point-card:hover .sound-familiar-icon-spin {
          animation: soundFamiliarSpin 1.2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
      `}</style>

      <div className="container mx-auto px-4 px-5 sm:px-10 lg:px-10 2xl:px-0">
        {/* Outer border wrapper with chamfered clip-path and subtle palette gradient border */}
        <div
          className="sound-familiar-clipped-box relative p-[1.5px] transition-all duration-300"
          style={{
            background:
              "linear-gradient(135deg, rgba(232, 106, 36, 0.35) 0%, #F4E9DF 45%, rgba(185, 79, 27, 0.3) 100%)",
            filter: "drop-shadow(0 20px 35px rgba(36, 33, 31, 0.05))",
          }}
        >
          {/* Inner container box with clip-path and Soft Background (#FAF7F4) */}
          <div
            className="sound-familiar-clipped-box  relative bg-[#FAF7F4] px-5 py-10 sm:px-10 sm:py-14 lg:px-14 lg:py-16"
          >
            {/* Header Content */}
            <div className="mx-auto mb-10 max-w-3xl text-center sm:mb-12">
              {eyebrow && (
                <span className="mb-4 inline-flex items-center rounded-full border border-[#E86A24]/30 bg-[#F4E9DF]/80 px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#B94F1B] shadow-xs">
                  {eyebrow}
                </span>
              )}
              <h2 className="mb-4 font-serif text-2xl font-semibold leading-tight tracking-tight text-[#292522] sm:text-3xl md:text-4xl lg:text-5xl">
                {heading}
              </h2>
              <p className="mx-auto max-w-2xl text-sm leading-relaxed text-[#77716C] sm:text-base">
                {subheading}
              </p>
            </div>

            {/* Point Boxes: Clean White Background with Brand Palette hover */}
            <div className=" nav-width mb-8 grid grid-cols-1 gap-3.5 sm:gap-4 lg:grid-cols-2">
              {items.map((item, idx) => (
                <div
                  key={idx}
                  className="sound-familiar-point-card group relative flex items-center gap-3.5 overflow-hidden rounded-xl border border-[#F4E9DF] border-l-[4px] border-l-[#E86A24]/70 bg-[#ffffff] p-3.5 shadow-[0_4px_16px_-4px_rgba(41,37,34,0.06)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#E86A24]/50 hover:border-l-[#B94F1B] hover:shadow-[0_12px_28px_-8px_rgba(232,106,36,0.16)] sm:gap-4 sm:rounded-2xl sm:p-4.5"
                >
                  {/* Icon Box: Soft palette container that turns into Primary Orange (#E86A24) with white icon on hover */}
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#E86A24]/25 bg-[#FAF7F4] transition-all duration-300 group-hover:border-[#E86A24] group-hover:bg-[#E86A24] group-hover:shadow-[0_4px_12px_rgba(232,106,36,0.3)] sm:h-10 sm:w-10 sm:rounded-xl">
                    <span className="sound-familiar-icon-spin text-[#E86A24] transition-colors duration-300 group-hover:text-white">
                      <X className="size-4 stroke-[2.5] sm:size-4.5" />
                    </span>
                  </div>

                  {/* Point Text */}
                  <p className="text-xs font-normal leading-snug text-[#292522] sm:text-sm sm:leading-relaxed">
                    {item}
                  </p>
                </div>
              ))}
            </div>

            {/* Bottom Closing Text ("turn") */}
            {turn && (
              <div className="mx-auto max-w-3xl border-t border-[#F4E9DF] pt-6 text-center sm:pt-8">
                <p className="text-xs leading-relaxed text-[#77716C] sm:text-sm md:text-base">
                  {turn}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
