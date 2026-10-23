"use client";

import React from "react";
import {
  Compass,
  ShieldCheck,
  Palette,
  TrendingUp,
  Crown,
  IndianRupee,
  Sparkles,
  LucideIcon,
} from "lucide-react";

export interface WhatChangesItem {
  title: string;
  body: string;
}

export interface WhatChangesData {
  eyebrow?: string;
  heading: string;
  subheading: string;
  items: WhatChangesItem[];
}

interface WhatChangesSectionProps {
  data?: WhatChangesData;
}

const DEFAULT_DATA: WhatChangesData = {
  eyebrow: "WHAT CHANGES",
  heading: "Imagine what changes when you put these three secrets together",
  subheading:
    "This is what women tell me shifts first once mastery, mindset and monetization finally line up.",
  items: [
    {
      title: "Clarity",
      body: "Know what to learn and what to do next, instead of collecting tutorials you never finish.",
    },
    {
      title: "Confidence",
      body: "Create and share your work without constantly questioning whether it's good enough.",
    },
    {
      title: "Signature identity",
      body: "Begin developing a recognizable portfolio and a clear artistic direction of your own.",
    },
    {
      title: "Business direction",
      body: "Know how your creativity can connect to real customers and real revenue.",
    },
    {
      title: "Premium positioning",
      body: "Move from \"I make resin products\" toward \"I have a distinctive creative brand\".",
    },
    {
      title: "Financial possibility",
      body: "Build toward a ₹3 lakh/month business goal and, over time, aim beyond it. A roadmap ambition — not a guaranteed income claim.",
    },
  ],
};

const ICONS_BY_TITLE: Record<string, LucideIcon> = {
  "Clarity": Compass,
  "Confidence": ShieldCheck,
  "Signature identity": Palette,
  "Business direction": TrendingUp,
  "Premium positioning": Crown,
  "Financial possibility": IndianRupee,
};

export default function WhatChangesSection({ data = DEFAULT_DATA }: WhatChangesSectionProps) {
  const { eyebrow, heading, subheading, items } = data;

  return (
    <section
      id="what-changes"
      className="relative w-full bg-[#FAF7F4] py-14 sm:py-20 lg:py-24"
    >
      <div className="nav-width mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto mb-12 max-w-3xl text-center sm:mb-16">
          {eyebrow && (
            <span className="mb-4 inline-flex items-center rounded-full border border-[#E86A24]/30 bg-[#F4E9DF]/80 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#B94F1B] shadow-xs">
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

        {/* Responsive Grid: 1 col on mobile, 2 col on tablet, 3 col on desktop */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6 lg:gap-7">
          {items.map((item, idx) => {
            const Icon = ICONS_BY_TITLE[item.title] || Sparkles;

            return (
              <div
                key={idx}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-[#F4E9DF] bg-[#FFFFFF] p-6 shadow-[0_4px_24px_-6px_rgba(36,33,31,0.06)] transition-all duration-300 hover:-translate-y-1.5 hover:border-[#E86A24]/40 hover:shadow-[0_18px_40px_-12px_rgba(232,106,36,0.18)] sm:rounded-3xl sm:p-7 lg:p-8"
              >
                {/* Content Block */}
                <div>
                  {/* Icon Box: Rounded squircle container matching reference design */}
                  <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-[#E86A24]/20 bg-[#FAF7F4] text-[#E86A24] transition-all duration-300 group-hover:scale-105 group-hover:border-[#E86A24]/40 group-hover:bg-[#F4E9DF]/80 group-hover:text-[#B94F1B] sm:h-14 sm:w-14">
                    <Icon className="size-5 stroke-[2.2] sm:size-6" />
                  </div>

                  {/* Card Title */}
                  <h3 className="text-base font-bold tracking-tight text-[#292522] transition-colors duration-300 group-hover:text-[#B94F1B] sm:text-lg">
                    {item.title}
                  </h3>

                  {/* Card Body */}
                  <p className="mt-2.5 text-xs leading-relaxed text-[#77716C] sm:text-sm">
                    {item.body}
                  </p>
                </div>

                {/* Bottom Side Progress Line: Smooth expanding animation only on hover */}
                <div className="mt-6 pt-2">
                  <div className="h-[3.5px] w-full overflow-hidden rounded-full bg-transparent">
                    <div className="h-full w-0 rounded-full bg-gradient-to-r from-[#E86A24] via-[#E86A24] to-[#B94F1B] transition-all duration-500 ease-out group-hover:w-full" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
