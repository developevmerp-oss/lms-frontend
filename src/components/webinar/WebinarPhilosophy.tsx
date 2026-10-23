"use client";

import React, { useEffect, useRef, useState } from "react";

export interface PhilosophyStep {
  label: string;
  title: string;
  body: string;
}

export interface PhilosophyData {
  eyebrow?: string;
  heading: string;
  subheading: string;
  steps: PhilosophyStep[];
  closing?: string;
}

interface WebinarPhilosophyProps {
  data?: PhilosophyData;
}

const DEFAULT_DATA: PhilosophyData = {
  eyebrow: "MY PHILOSOPHY",
  heading: "Mastery → Mindset → Monetization",
  subheading: "Three steps, in this order. Skip one and the whole journey stalls.",
  steps: [
    {
      label: "STEP 1",
      title: "Master",
      body: "Build premium skills in the right sequence so you know what to learn, practice and create next.",
    },
    {
      label: "STEP 2",
      title: "Mindset",
      body: "Build the confidence to create, share, receive feedback and believe your work deserves to be seen.",
    },
    {
      label: "STEP 3",
      title: "Monetization",
      body: "Learn how to connect your skills with pricing, branding, marketing and a business model.",
    },
  ],
  closing:
    "Because skill without confidence stays hidden. Confidence without a business roadmap stays stuck. And business without mastery becomes difficult to sustain.",
};

export default function WebinarPhilosophy({ data = DEFAULT_DATA }: WebinarPhilosophyProps) {
  const { eyebrow, heading, subheading, steps, closing } = data;
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
      id="philosophy"
      className="relative w-full overflow-hidden bg-[#24211F] py-16 sm:py-20 lg:py-28"
    >
      {/* Dynamic Keyframe Animations */}
      <style jsx>{`
        @keyframes decorFloatLeft {
          0%,
          100% {
            transform: translate(0, 0) rotate(0deg);
          }
          50% {
            transform: translate(-4px, -8px) rotate(-1deg);
          }
        }

        @keyframes decorFloatRight {
          0%,
          100% {
            transform: translate(0, 0) rotate(0deg);
          }
          50% {
            transform: translate(4px, -7px) rotate(1deg);
          }
        }

        .animate-decor-left {
          animation: decorFloatLeft 9s ease-in-out infinite;
        }

        .animate-decor-right {
          animation: decorFloatRight 10s ease-in-out infinite;
        }
      `}</style>

      {/* Ambient background lighting gradient */}
      <div
        className="pointer-events-none absolute inset-0 select-none opacity-40"
        style={{
          background:
            "radial-gradient(ellipse 65% 50% at 50% 25%, rgba(232, 106, 36, 0.15) 0%, rgba(36, 33, 31, 0) 75%)",
        }}
      />

      {/* ─── 4th/5th Image: TOP-LEFT DECORATIVE RESIN ART ─── */}
      <div className="animate-decor-left pointer-events-none absolute left-0 top-0 z-0 select-none">
        <img
          src="/images/philosophy/philosophy-decor-top-left.png"
          alt=""
          className="h-auto w-[180px] object-contain opacity-90 transition-opacity duration-300 sm:w-[260px] md:w-[340px] lg:w-[420px] xl:w-[480px] 2xl:w-[530px]"
        />
      </div>

      {/* ─── 4th Image: TOP-RIGHT DECORATIVE RESIN ART ─── */}
      <div className="animate-decor-right pointer-events-none absolute right-0 top-0 z-0 select-none">
        <img
          src="/images/philosophy/philosophy-decor-top-right.png"
          alt=""
          className="h-auto w-[180px] object-contain opacity-90 transition-opacity duration-300 sm:w-[260px] md:w-[340px] lg:w-[420px] xl:w-[480px] 2xl:w-[530px]"
        />
      </div>

      {/* ─── MAIN CONTENT CONTAINER (Z-10 to stay safely above corner decor) ─── */}
      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header Block */}
        <div
          className={`mx-auto mb-12 max-w-3xl text-center transition-all duration-700 ease-out sm:mb-16 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
        >
          {eyebrow && (
            <div className="mb-4 inline-flex items-center">
              <span className="rounded-full border border-[#E86A24]/60 bg-[#24211F]/80 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#F4E9DF] shadow-[0_4px_16px_rgba(0,0,0,0.3)] backdrop-blur-md">
                {eyebrow}
              </span>
            </div>
          )}

          <h2 className="mb-4 font-serif text-2xl font-normal leading-tight tracking-tight text-[#FFFFFF] sm:text-3xl md:text-4xl lg:text-5xl xl:text-[52px]">
            {heading}
          </h2>

          <p className="mx-auto max-w-2xl text-xs font-light leading-relaxed text-[#F4E9DF]/85 sm:text-sm md:text-base">
            {subheading}
          </p>
        </div>

        {/* ─── CARDS GRID: Staggered entry animation on scroll, 1 col on Mobile/Tablet, 3 col on Desktop ─── */}
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-4 sm:gap-5 lg:max-w-none lg:grid-cols-3 lg:gap-6 xl:gap-7">
          {steps.map((step, idx) => (
            <div
              key={idx}
              style={{
                transitionDelay: isVisible ? `${idx * 180}ms` : "0ms",
              }}
              className={`group relative flex flex-col justify-between overflow-hidden rounded-[24px] border border-[#F4E9DF]/40 bg-[#FAF7F4] p-6 shadow-[0_20px_45px_-12px_rgba(0,0,0,0.55),0_0_0_1px_rgba(244,233,223,0.12)] transition-all duration-700 ease-out hover:-translate-y-2.5 hover:border-[#E86A24]/70 hover:shadow-[0_28px_60px_-15px_rgba(232,106,36,0.32),0_0_0_1px_rgba(232,106,36,0.4)] sm:rounded-[28px] sm:p-7 lg:rounded-[32px] lg:p-8 ${
                isVisible
                  ? "translate-y-0 scale-100 opacity-100"
                  : "translate-y-12 scale-95 opacity-0"
              }`}
            >
              {/* Subtle glass reflection sweep on card hover */}
              <div className="pointer-events-none absolute -inset-full top-0 block -skew-x-12 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 transition-all duration-1000 group-hover:inset-full group-hover:opacity-100" />

              <div>
                {/* Step Label in Primary Orange */}
                <span className="mb-1 block text-xs font-extrabold uppercase tracking-[0.18em] text-[#E86A24] sm:text-[13px]">
                  {step.label}
                </span>

                {/* Step Title in elegant serif Primary Text */}
                <h3 className="mb-3 font-serif text-2xl font-bold tracking-tight text-[#292522] transition-colors duration-300 group-hover:text-[#B94F1B] sm:text-3xl">
                  {step.title}
                </h3>

                {/* Step Description in Muted Text */}
                <p className="text-xs font-normal leading-relaxed text-[#77716C] sm:text-sm lg:text-[14.5px]">
                  {step.body}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* ─── BOTTOM CLOSING TEXT ─── */}
        {closing && (
          <p
            className={`mx-auto mt-10 max-w-2xl text-center text-xs font-light leading-relaxed text-[#F4E9DF]/75 transition-all duration-700 delay-500 ease-out sm:mt-14 sm:text-sm md:text-base ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
            }`}
          >
            {closing}
          </p>
        )}
      </div>
    </section>
  );
}
