"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface PhilosophyStep {
  label?: string;
  badge?: string;
  tabName?: string;
  title: string;
  myth?: string;
  body: string;
  image?: string;
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

const DEFAULT_CARD_IMAGES = [
  "/images/secrets/secret-1-mastery.jpg",
  "/images/secrets/secret-2-mindset.jpg",
  "/images/secrets/secret-3-monetization.jpg",
];

const DEFAULT_DATA: PhilosophyData = {
  eyebrow: "MY PHILOSOPHY",
  heading: "Mastery → Mindset → Monetization",
  subheading: "Three steps, in this order. Skip one and the whole journey stalls.",
  steps: [
    {
      label: "STEP 1",
      badge: "MASTERY",
      tabName: "Mastery",
      title: "Learn the right techniques in the right sequence",
      myth: "Most people believe more tutorials will eventually add up.",
      body: "You'll see why random tutorials create confusion, and how structured learning accelerates progress — technique sequencing, premium skill development, a portfolio-building mindset and moving beyond random projects.",
      image: "/images/secrets/secret-1-mastery.jpg",
    },
    {
      label: "STEP 2",
      badge: "MINDSET",
      tabName: "Mindset",
      title: "Become confident enough to own your creativity",
      myth: "Most people believe their work isn't good enough to be seen yet.",
      body: "You'll learn how to move past fear of creating, comparison, the \"my work isn't good enough\" loop, fear of showing your work, and confusion about your artistic identity.",
      image: "/images/secrets/secret-2-mindset.jpg",
    },
    {
      label: "STEP 3",
      badge: "MONETIZATION",
      tabName: "Monetization",
      title: "Turn your art into a real opportunity",
      myth: "Most people believe business skills come much later.",
      body: "You'll understand the foundations of product selection, pricing, branding, marketing, customer attraction, community support and a practical business roadmap.",
      image: "/images/secrets/secret-3-monetization.jpg",
    },
  ],
  closing:
    "Because skill without confidence stays hidden. Confidence without a business roadmap stays stuck. And business without mastery becomes difficult to sustain.",
};

export default function WebinarPhilosophy({
  data = DEFAULT_DATA,
}: WebinarPhilosophyProps) {
  const { eyebrow, heading, subheading, steps, closing } = data;
  const sectionRef = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

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

  const currentStep = steps[activeIndex] || steps[0];
  const currentImage =
    currentStep?.image ||
    DEFAULT_CARD_IMAGES[activeIndex % DEFAULT_CARD_IMAGES.length];

  return (
    <section
      ref={sectionRef}
      id="philosophy"
      className="relative w-full overflow-hidden bg-[#24211F] pt-20 pb-16 sm:pt-28 sm:pb-20 lg:py-28"
    >
      {/* Dynamic Keyframe Animations for Corner Decor */}
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

      {/* ─── TOP-LEFT DECORATIVE RESIN ART (Scaled modestly on mobile so it doesn't overlap title) ─── */}
      <div className="animate-decor-left pointer-events-none absolute left-0 top-0 z-0 select-none">
        <img
          src="/images/philosophy/philosophy-decor-top-left.png"
          alt=""
          className="h-auto w-[110px] sm:w-[170px] md:w-[260px] lg:w-[420px] xl:w-[480px] 2xl:w-[530px] object-contain opacity-70 sm:opacity-85 lg:opacity-90 transition-opacity duration-300"
        />
      </div>

      {/* ─── TOP-RIGHT DECORATIVE RESIN ART ─── */}
      <div className="animate-decor-right pointer-events-none absolute right-0 top-0 z-0 select-none">
        <img
          src="/images/philosophy/philosophy-decor-top-right.png"
          alt=""
          className="h-auto w-[110px] sm:w-[170px] md:w-[260px] lg:w-[420px] xl:w-[480px] 2xl:w-[530px] object-contain opacity-70 sm:opacity-85 lg:opacity-90 transition-opacity duration-300"
        />
      </div>

      {/* ─── MAIN CONTENT CONTAINER (Z-10 to stay safely above corner decor) ─── */}
      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Top Eyebrow Divider */}
        <div
          className={`mb-6 sm:mb-8 flex items-center gap-4 transition-all duration-700 ease-out ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
        >
          {eyebrow && (
            <span className="shrink-0 text-xs sm:text-base lg:text-xs font-semibold uppercase tracking-[0.18em] text-[#ea580c]">
              {eyebrow}
            </span>
          )}
          <div className="h-[1px] flex-1 bg-white/15" />
        </div>

        {/* ─── MOBILE & TABLET FLOW HEADING (< lg): Cleanly shows flow title and description below corner flower ─── */}
        <div
          className={`block lg:hidden mb-8 sm:mb-10 transition-all duration-700 ease-out ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
        >
          <h2 className="mb-3 text-3xl sm:text-5xl font-black leading-tight tracking-tight text-white">
            Mastery → Mindset → <span className="text-[#ea580c]">Monetization</span>
          </h2>
          <p className="max-w-2xl text-sm sm:text-xl font-normal leading-relaxed text-[#F4E9DF]/80">
            {subheading}
          </p>
        </div>

        {/* ─── DESKTOP TOP ROW: Heading and Subheading placed on Right (matching reference desktop) ─── */}
        <div
          className={`hidden lg:grid grid-cols-12 gap-12 xl:gap-16 mb-6 transition-all duration-700 ease-out ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
        >
          <div className="col-span-5" />
          <div className="col-span-7">
            <h2 className="mb-3 text-3xl sm:text-5xl lg:text-5xl font-black leading-tight tracking-tight text-white">
              Mastery → Mindset → <span className="text-[#ea580c]">Monetization</span>
            </h2>
            <p className="max-w-xl text-sm sm:text-xl lg:text-base font-normal leading-relaxed text-[#F4E9DF]/80">
              {subheading}
            </p>
          </div>
        </div>

        {/* ─── MOBILE & TABLET VIEW (< lg): DIRECTLY SHOW ALL 3 CARDS STACKED ─── */}
        <div className="block lg:hidden space-y-6 sm:space-y-8">
          {steps.map((step, idx) => {
            const stepImg = step.image || DEFAULT_CARD_IMAGES[idx % DEFAULT_CARD_IMAGES.length];
            return (
              <div
                key={idx}
                className="rounded-[24px] sm:rounded-[30px] border border-white/10 bg-[#1C1917]/95 p-5 sm:p-7 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.6)] backdrop-blur-md"
              >
                {/* Card Top: Step number & count */}
                <div className="flex items-center justify-between pb-3 text-xs sm:text-base font-bold tracking-[0.18em] text-[#ea580c]">
                  <span>{step.label || `STEP ${idx + 1}`}</span>
                  <span className="text-white/40">0{idx + 1} / 03</span>
                </div>

                {/* Card Image */}
                <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden border border-white/10 bg-black/40 my-1">
                  <img
                    src={stepImg}
                    alt={step.title}
                    className="h-full w-full object-cover"
                  />
                  <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                </div>

                {/* Card Content */}
                <div className="pt-4">
                  <span className="inline-block text-xs sm:text-base font-bold uppercase tracking-[0.16em] text-[#ea580c] mb-1">
                    {step.badge || step.tabName}
                  </span>
                  <h3 className="mb-2 text-xl sm:text-2xl font-bold tracking-tight text-white leading-snug">
                    {step.title}
                  </h3>
                  {step.myth && (
                    <p className="mb-2.5 text-xs sm:text-base font-semibold italic text-[#ea580c]/95 leading-relaxed">
                      {step.myth}
                    </p>
                  )}
                  <p className="text-xs sm:text-base font-normal leading-relaxed text-[#F4E9DF]/80">
                    {step.body}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* ─── DESKTOP 2-COLUMN SHOWCASE (lg:grid): Left Big Card + Right Interactive Points (PERMANENTLY HEIGHT-LOCKED) ─── */}
        <div
          className={`hidden lg:grid grid-cols-12 gap-12 xl:gap-16 items-stretch transition-opacity duration-700 ease-out ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          {/* Left Column: Big Interactive Card with strictly locked height */}
          <div className="col-span-5 flex flex-col min-h-[560px] h-[560px]">
            <div className="group relative flex h-full flex-col justify-between overflow-hidden rounded-[32px] border border-white/10 bg-[#1C1917]/95 p-6 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] backdrop-blur-md">
              {/* Dynamic glass sweep sheen when card changes */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  initial={{ x: "-120%", opacity: 0.8 }}
                  animate={{ x: "220%", opacity: 0 }}
                  transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
                  className="pointer-events-none absolute inset-0 z-30 -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                />
              </AnimatePresence>

              {/* Top Header of Card */}
              <div className="relative z-10 flex shrink-0 items-center justify-between pb-3 text-xs sm:text-base lg:text-xs font-bold tracking-[0.18em] text-[#ea580c]">
                <span>{currentStep.label || `STEP ${activeIndex + 1}`}</span>
                <span className="text-white/40">0{activeIndex + 1} / 03</span>
              </div>

              {/* Big Rounded Image with Fixed Aspect Ratio CSS Grid */}
              <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-black/40 grid grid-cols-1 grid-rows-1">
                {steps.map((step, idx) => {
                  const isCurrent = idx === activeIndex;
                  const stepImg = step.image || DEFAULT_CARD_IMAGES[idx % DEFAULT_CARD_IMAGES.length];
                  return (
                    <img
                      key={idx}
                      src={stepImg}
                      alt={step.title}
                      className={`col-start-1 row-start-1 h-full w-full object-cover transition-opacity duration-500 ease-out ${
                        isCurrent ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
                      }`}
                    />
                  );
                })}
                <div className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
              </div>

              {/* Card Details: Height strictly locked across all steps using CSS Grid stack (0px shift) */}
              <div className="relative pt-4 pb-1 grid grid-cols-1 grid-rows-1 min-h-[220px] h-[220px]">
                {steps.map((step, idx) => {
                  const isCurrent = idx === activeIndex;
                  return (
                    <div
                      key={idx}
                      className={`col-start-1 row-start-1 flex flex-col justify-start transition-all duration-500 ease-out ${
                        isCurrent
                          ? "opacity-100 translate-y-0 pointer-events-auto z-10"
                          : "opacity-0 translate-y-2 pointer-events-none z-0 invisible"
                      }`}
                      aria-hidden={!isCurrent}
                    >
                      <span className="inline-block text-xs sm:text-base lg:text-xs font-bold uppercase tracking-[0.16em] text-[#ea580c] mb-1">
                        {step.badge || step.tabName}
                      </span>
                      <h3 className="mb-2 text-lg sm:text-2xl lg:text-xl font-bold tracking-tight text-white leading-snug">
                        {step.title}
                      </h3>
                      {step.myth && (
                        <p className="mb-2 text-xs sm:text-base lg:text-sm font-semibold italic text-[#ea580c]/90 leading-relaxed">
                          {step.myth}
                        </p>
                      )}
                      <p className="text-xs sm:text-base lg:text-sm font-normal leading-relaxed text-[#F4E9DF]/80">
                        {step.body}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: The 3 Interactive Points (Locked to exact 560px matching left card) */}
          <div className="col-span-7 flex flex-col justify-between min-h-[560px] h-[560px]">
            <div className="flex h-full flex-col justify-between">
              {steps.map((step, idx) => {
                const isActive = idx === activeIndex;

                return (
                  <div
                    key={idx}
                    onMouseEnter={() => setActiveIndex(idx)}
                    onClick={() => setActiveIndex(idx)}
                    className="group relative flex flex-1 flex-col justify-center cursor-pointer py-6 sm:py-8 lg:py-9 select-none"
                  >
                    {/* Title Content */}
                    <div className="flex items-center">
                      {/* 4-Point Star Sparkle Icon with smooth luxurious easing */}
                      <div
                        className={`shrink-0 flex items-center justify-center transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                          isActive
                            ? "w-6 sm:w-8 md:w-9 opacity-100 scale-100 rotate-0 mr-2.5 sm:mr-3.5"
                            : "w-0 opacity-0 scale-0 -rotate-90 mr-0 overflow-hidden"
                        }`}
                      >
                        <svg
                          viewBox="0 0 24 24"
                          className="w-5 h-5 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white fill-current shrink-0 filter drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]"
                          aria-hidden="true"
                        >
                          <path d="M12 2C12 7.52 7.52 12 2 12C7.52 12 12 16.48 12 22C12 16.48 16.48 12 22 12C16.48 12 12 7.52 12 2Z" />
                        </svg>
                      </div>

                      {/* Title Text */}
                      <span
                        className={`text-3xl sm:text-5xl lg:text-5xl font-black tracking-tight transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                          isActive
                            ? "text-white"
                            : "text-white/20 group-hover:text-white/40"
                        }`}
                      >
                        {step.tabName || step.badge || step.title}
                      </span>
                    </div>

                    {/* Base Inactive Border Line */}
                    <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-white/15" />

                    {/* Active Highlight Line */}
                    <div
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-white pointer-events-none transition-transform duration-750 ease-[cubic-bezier(0.16,1,0.3,1)]"
                      style={{
                        transformOrigin: "left",
                        transform: isActive ? "scaleX(1)" : "scaleX(0)",
                      }}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ─── BOTTOM CLOSING TEXT ─── */}
        {closing && (
          <p
            className={`mx-auto mt-12 sm:mt-16 max-w-2xl text-center text-sm sm:text-xl lg:text-base font-normal leading-relaxed text-[#F4E9DF]/75 transition-all duration-700 delay-300 ease-out ${
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
