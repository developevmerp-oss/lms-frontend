"use client";

import React, { useEffect, useRef, useState } from "react";
import { ArrowRight, Users, MonitorPlay, Trophy, BookOpen } from "lucide-react";

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
  const sectionRef = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="mentor"
      className="relative w-full overflow-hidden py-16 sm:py-20 lg:py-28"
      style={{
        backgroundColor: "#ffffff",
        backgroundImage: "radial-gradient(circle, #e2ded4 1.5px, transparent 1.5px)",
        backgroundSize: "24px 24px",
        backgroundAttachment: "fixed",
      }}
    >
      {/* ─── TOP RIGHT GEODE RESIN CORNER ARTWORK ─── */}
      <div
        className={`pointer-events-none absolute right-0 top-0 z-0 select-none transition-all duration-1000 ease-out ${isVisible ? "translate-x-0 translate-y-0 opacity-90" : "translate-x-12 -translate-y-12 opacity-0"
          }`}
      >
        <img
          src="/images/mentor/mentor-decor-top-right.png"
          alt=""
          className="h-auto w-[200px] object-contain sm:w-[320px] md:w-[420px] lg:w-[500px] xl:w-[580px] 2xl:w-[640px]"
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-14 xl:gap-16">

          {/* ─── LEFT COLUMN: 3D RECTANGULAR OWNER IMAGE WITH STATIC BOTANICAL DECOR ─── */}
          <div
            className={`flex justify-center transition-all duration-800 ease-out lg:col-span-5 lg:justify-start ${isVisible ? "translate-x-0 opacity-100" : "-translate-x-12 opacity-0"
              }`}
          >
            <div className="relative [perspective:1000px]">
              {/* 3D Owner Portrait Card */}
              <div
                className="group relative z-10 aspect-[4/5] w-[260px] overflow-hidden rounded-[24px] bg-[#f7f2ea] shadow-[0_12px_35px_-8px_rgba(36,33,31,0.14),0_28px_65px_-18px_rgba(0,0,0,0.22),0_0_0_1px_rgba(255,255,255,0.85)_inset,0_0_0_1px_rgba(234,223,212,0.7)] transition-all duration-500 ease-out hover:rotate-0 hover:scale-[1.02] hover:shadow-[0_16px_40px_-8px_rgba(232,106,36,0.2),0_32px_75px_-16px_rgba(0,0,0,0.28)] sm:w-[310px] sm:rounded-[30px] md:w-[350px] lg:w-[370px]"
                style={{
                  transform: "rotateY(-2.5deg) rotateX(1.5deg)",
                  transformStyle: "preserve-3d",
                }}
              >
                <img
                  src="/images/mentor/vrajangna-portrait.jpg"
                  alt={section.name}
                  className="h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                />

                {/* 3D Light Reflection sheen on hover */}
                <div className="pointer-events-none absolute -inset-full top-0 block -skew-x-12 bg-gradient-to-r from-transparent via-white/25 to-transparent opacity-0 transition-all duration-1000 group-hover:inset-full group-hover:opacity-100" />

                {/* Subtle base vignette for realistic grounding */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-stone-900/15 via-transparent to-transparent" />
              </div>

              {/* Anchored Botanical Dried Flower & Resin Brooch (Bottom-Left, Static / Non-floating) */}
              <div
                className={`pointer-events-none absolute -bottom-3 -left-10 z-20 select-none transition-all duration-700 delay-200 ease-out sm:-bottom-5 sm:-left-14 md:-left-16 lg:-left-16 ${isVisible ? "scale-100 opacity-100" : "scale-90 opacity-0"
                  }`}
              >
              </div>
            </div>
          </div>

          {/* ─── RIGHT COLUMN: CONTENT, BIO, CTA & 4 CREDENTIAL STATS ─── */}
          <div className="lg:col-span-7">

            {/* Eyebrow Pill */}
            <div
              className={`mb-3 transition-all duration-700 delay-100 ease-out ${isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
                }`}
            >
              <span className="inline-flex items-center text-sm sm:text-base md:text-base lg:text-sm font-semibold uppercase tracking-[0.18em] text-[#942008]">
                {section.eyebrow || "YOUR MENTOR"}
              </span>
            </div>

            {/* Heading: "Meet Vrajangna Patel" with Primary Orange highlight */}
            <h2
              className={`mb-2 text-3xl sm:text-5xl lg:text-[3.25rem] font-black tracking-tight text-neutral-950 leading-tight transition-all duration-700 delay-150 ease-out ${isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
                }`}
            >
              Meet <span className="text-[#942008]">{section.name}</span>
            </h2>

            {/* Role / Subtitle */}
            <p
              className={`mb-5 flex flex-wrap items-center gap-1.5 text-sm sm:text-base md:text-base lg:text-base font-semibold text-neutral-600 transition-all duration-700 delay-200 ease-out ${isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
                }`}
            >
              <span>Resin Art Business Coach</span>
              <span className="font-bold text-[#942008]">•</span>
              <span>Founder, Ravishing Art Hub</span>
            </p>

            {/* Bio Paragraphs */}
            <div
              className={`mb-6 space-y-3 text-sm sm:text-base md:text-base lg:text-base leading-relaxed text-neutral-600 transition-all duration-700 delay-250 ease-out ${isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
                }`}
            >
              {section.bio?.map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>

            {/* "Know More →" CTA Button */}
            <div
              className={`mb-8 transition-all duration-700 delay-300 ease-out ${isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
                }`}
            >
              <button
                type="button"
                onClick={onKnowMore}
                className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#E86A24] to-[#B94F1B] px-7 py-2.5 text-sm sm:text-base md:text-base lg:text-base font-semibold text-white shadow-lg shadow-[#E86A24]/20 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-[#E86A24]/35 active:scale-95 sm:py-3 cursor-pointer"
              >
                <span>Know More</span>
                <ArrowRight size={14} className="stroke-[2.2] transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </div>

            {/* ─── 4 CREDENTIAL / STAT BADGES (Staggered Animation on Scroll) ─── */}
            <div className="grid grid-cols-2 gap-4 border-t border-[#F4E9DF] pt-6 sm:grid-cols-4 sm:gap-3 lg:gap-4">

              {/* Stat 1: 10+ years of coaching */}
              <div
                className={`flex items-center gap-2.5 transition-all duration-700 delay-350 ease-out ${isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                  }`}
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#eadfd4] bg-[#fff6f0] text-[#E86A24] shadow-xs">
                  <Users className="size-4.5 stroke-[2]" />
                </div>
                <div>
                  <div className="text-sm sm:text-base md:text-base lg:text-base font-bold text-neutral-950">10+ years</div>
                  <div className="text-xs sm:text-sm md:text-sm lg:text-sm leading-tight text-neutral-500">of coaching</div>
                </div>
              </div>

              {/* Stat 2: 54,000+ webinar attendees */}
              <div
                className={`flex items-center gap-2.5 transition-all duration-700 delay-450 ease-out ${isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                  }`}
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#eadfd4] bg-[#fff6f0] text-[#E86A24] shadow-xs">
                  <MonitorPlay className="size-4.5 stroke-[2]" />
                </div>
                <div>
                  <div className="text-sm sm:text-base md:text-base lg:text-base font-bold text-neutral-950">54,000+</div>
                  <div className="text-xs sm:text-sm md:text-sm lg:text-sm leading-tight text-neutral-500">webinar attendees</div>
                </div>
              </div>

              {/* Stat 3: Hall of Fame Award */}
              <div
                className={`flex items-center gap-2.5 transition-all duration-700 delay-550 ease-out ${isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                  }`}
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#eadfd4] bg-[#fff6f0] text-[#E86A24] shadow-xs">
                  <Trophy className="size-4.5 stroke-[2]" />
                </div>
                <div>
                  <div className="text-sm sm:text-base md:text-base lg:text-base font-bold text-neutral-950">Hall of Fame Award</div>
                  <div className="text-xs sm:text-sm md:text-sm lg:text-sm leading-tight text-neutral-500">from Siddharth Rajsekar, 2022</div>
                </div>
              </div>

              {/* Stat 4: Co-author */}
              <div
                className={`flex items-center gap-2.5 transition-all duration-700 delay-650 ease-out ${isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                  }`}
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#eadfd4] bg-[#fff6f0] text-[#E86A24] shadow-xs">
                  <BookOpen className="size-4.5 stroke-[2]" />
                </div>
                <div>
                  <div className="text-sm sm:text-base md:text-base lg:text-base font-bold text-neutral-950">Co-author</div>
                  <div className="text-xs sm:text-sm md:text-sm lg:text-sm leading-tight text-neutral-500">I Can Coach & Featured in Sylph Magazine</div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}