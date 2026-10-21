"use client";

import React from "react";
import { ArrowRight } from "lucide-react";

export type MentorSectionData = {
  eyebrow?: string;
  name: string;
  role: string;
  bio: string[];
  quote?: string;
  credentials: string[];
};

interface WebinarMentorProps {
  section: MentorSectionData;
  onKnowMore?: () => void;
}

export default function WebinarMentor({ section, onKnowMore }: WebinarMentorProps) {
  // Calligraphy quote as in the reference design
  const quoteText =
    section.quote && section.quote.includes("express yourself")
      ? section.quote
      : "Art is not just what you create, it’s how you express yourself.";

  return (
    <section className="relative w-full overflow-hidden">
      {/* ─── DESKTOP VIEW (lg+): Full-width Panoramic Banner with Pixel-Perfect Circle Fitting ─── */}
      <div className="relative hidden w-full lg:block">
        {/* Full-width Panoramic Banner Canvas (1024 x 384 aspect ratio) */}
        <div className="relative mx-auto w-full max-w-[1920px]">
          <img
            src="/images/mentor/mentor-banner-bg.png"
            alt=""
            className="block h-auto w-full select-none pointer-events-none"
          />

          {/* 1. OWNER PORTRAIT: Positioned precisely into the painted gold circle design */}
          <div
            className="absolute overflow-hidden rounded-full shadow-[0_8px_25px_-5px_rgba(184,134,72,0.45)]"
            style={{
              left: "20.65%",
              top: "45.2%",
              transform: "translate(-50%, -50%)",
              width: "20.3%",
              height: "54.2%",
            }}
          >
            <img
              src="/images/mentor/vrajangna-portrait.jpg"
              alt={section.name}
              className="h-full w-full object-cover object-top scale-105"
            />
          </div>

          {/* 2. CENTER CONTENT: Positioned precisely over the center canvas */}
          <div
            className="absolute flex flex-col justify-center space-y-1.5 xl:space-y-2.5 2xl:space-y-3 "
            style={{
              left: "40.5%",
              width: "38.5%",
              top: "50%",
              transform: "translateY(-50%)",
            }}
          >
            {/* Eyebrow Pill */}
            <div>
              <span className="inline-flex items-center rounded-full bg-[#f0e9df] px-3 py-0.5 text-[10px] xl:text-[11px] font-semibold uppercase tracking-[0.16em] text-stone-600">
                {section.eyebrow || "YOUR MENTOR"}
              </span>
            </div>

            {/* Heading: "Meet Vrajangna Patel" with webinar theme accent color */}
            <h2 className="font-serif text-2xl xl:text-3xl 2xl:text-4xl font-bold tracking-tight text-stone-900 leading-[1.12]">
              Meet <span className="text-[#c45a28]">{section.name}</span>
            </h2>

            {/* Subtitle */}
            <p className="flex flex-wrap items-center gap-1.5 text-[11px] xl:text-xs 2xl:text-sm font-medium text-stone-600">
              <span>Resin Art Business Coach</span>
              <span className="text-[#c45a28] font-bold">•</span>
              <span>Founder, Ravishing Art Hub</span>
            </p>

            {/* Bio Paragraphs */}
            <div className="space-y-1 xl:space-y-1.5 text-[10.5px] xl:text-xs 2xl:text-[13px] leading-snug xl:leading-relaxed text-stone-700">
              {section.bio?.map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>

            {/* "Know More →" Button with webinar theme orange gradient */}
            <div className="pt-0.5 xl:pt-1">
              <button
                type="button"
                onClick={onKnowMore}
                className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-5 py-1.5 xl:px-6 xl:py-2 text-[11px] xl:text-xs font-semibold shadow-md shadow-orange-500/20 transition-all duration-200 cursor-pointer active:scale-95"
              >
                <span>Know More</span>
                <ArrowRight size={13} className="stroke-[2.2]" />
              </button>
            </div>

            {/* Badges / Credentials with webinar theme styling */}
            <div className="flex flex-wrap items-center gap-1.5 xl:gap-2 pt-0.5">
              {section.credentials?.map((cred, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 rounded-full bg-[#fff6f0] border border-[#eadfd4] px-2.5 py-0.5 text-[10px] xl:text-[11px] font-medium text-stone-700 shadow-2xs"
                >
                  <span className="flex h-3 w-3 shrink-0 items-center justify-center rounded-full bg-[#c45a28] text-white text-[7.5px] font-bold">
                    ✓
                  </span>
                  <span>{cred}</span>
                </span>
              ))}
            </div>
          </div>

          {/* 3. RIGHT CONTENT: Calligraphy Quote positioned over the peach watercolor brush */}
          {/* <div
            className="absolute flex flex-col justify-center text-right"
            style={{
              left: "75.5%",
              width: "20.5%",
              top: "50%",
              transform: "translateY(-50%)",
            }}
          >
            <blockquote className="font-script text-xl xl:text-2xl 2xl:text-[1.75rem] leading-[1.22] text-[#2c2621]">
              “{quoteText}”
            </blockquote>
            <p className="font-script text-sm xl:text-base 2xl:text-lg text-stone-700 mt-1 xl:mt-2">
              — {section.name}
            </p>
          </div> */}
        </div>
      </div>

      {/* ─── MOBILE / TABLET VIEW (<lg): Fluid & Fully Responsive with Matching Theme ─── */}
      <div className="relative block w-full px-4 sm:px-6 lg:hidden">
        <div className="relative overflow-hidden rounded-3xl border border-[#eadfd4] bg-[#fbf8f2] shadow-[0_16px_40px_-20px_rgba(90,55,20,0.25)] p-6 sm:p-8">
          {/* Background image covering mobile card */}
          <img
            src="/images/mentor/mentor-banner-bg.png"
            alt=""
            className="absolute inset-0 h-full w-full object-cover object-left opacity-35 pointer-events-none select-none"
          />

          <div className="relative z-10 space-y-5">
            {/* Owner Portrait inside Circular Gold Ring */}
            <div className="flex justify-center">
              <div className="h-40 w-40 sm:h-48 sm:w-48 overflow-hidden rounded-full border-4 border-[#d8b87d] shadow-xl">
                <img
                  src="/images/mentor/vrajangna-portrait.jpg"
                  alt={section.name}
                  className="h-full w-full object-cover object-top scale-105"
                />
              </div>
            </div>

            {/* Header info */}
            <div className="text-center sm:text-left space-y-2">
              <span className="inline-flex items-center rounded-full bg-[#f0e9df] px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-stone-600">
                {section.eyebrow || "YOUR MENTOR"}
              </span>

              <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-stone-900">
                Meet <span className="text-[#c45a28]">{section.name}</span>
              </h2>

              <p className="text-xs sm:text-sm font-medium text-stone-600">
                Resin Art Business Coach • Founder, Ravishing Art Hub
              </p>
            </div>

            {/* Bio text */}
            <div className="space-y-2 text-xs sm:text-sm leading-relaxed text-stone-700">
              {section.bio?.map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>

            {/* Button */}
            <div className="pt-1">
              <button
                type="button"
                onClick={onKnowMore}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-6 py-2.5 text-xs sm:text-sm font-semibold shadow-md shadow-orange-500/20 transition-all cursor-pointer"
              >
                <span>Know More</span>
                <ArrowRight size={14} className="stroke-[2.2]" />
              </button>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2 pt-2">
              {section.credentials?.map((cred, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#fff6f0] border border-[#eadfd4] px-3 py-1 text-xs font-medium text-stone-700 shadow-2xs"
                >
                  <span className="flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full bg-[#c45a28] text-white text-[8px] font-bold">
                    ✓
                  </span>
                  <span>{cred}</span>
                </span>
              ))}
            </div>

            {/* Calligraphy Quote */}
            {/* <div className="border-t border-[#eadfd4] pt-4 text-center sm:text-right">
              <blockquote className="font-script text-xl sm:text-2xl text-[#2c2621] leading-snug">
                “{quoteText}”
              </blockquote>
              <p className="font-script text-sm sm:text-base text-stone-600 mt-1">
                — {section.name}
              </p>
            </div> */}
          </div>
        </div>
      </div>
    </section>
  );
}
