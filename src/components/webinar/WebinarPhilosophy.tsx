"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface PhilosophyStep {
  label: string;
  title: string;
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
      className="relative w-full overflow-hidden bg-[#24211F] py-16 sm:py-20 lg:py-28"
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

      {/* ─── TOP-LEFT DECORATIVE RESIN ART ─── */}
      <div className="animate-decor-left pointer-events-none absolute left-0 top-0 z-0 select-none">
        <img
          src="/images/philosophy/philosophy-decor-top-left.png"
          alt=""
          className="h-auto w-[180px] object-contain opacity-90 transition-opacity duration-300 sm:w-[260px] md:w-[340px] lg:w-[420px] xl:w-[480px] 2xl:w-[530px]"
        />
      </div>

      {/* ─── TOP-RIGHT DECORATIVE RESIN ART ─── */}
      <div className="animate-decor-right pointer-events-none absolute right-0 top-0 z-0 select-none">
        <img
          src="/images/philosophy/philosophy-decor-top-right.png"
          alt=""
          className="h-auto w-[180px] object-contain opacity-90 transition-opacity duration-300 sm:w-[260px] md:w-[340px] lg:w-[420px] xl:w-[480px] 2xl:w-[530px]"
        />
      </div>

      {/* ─── MAIN CONTENT CONTAINER (Z-10 to stay safely above corner decor) ─── */}
      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Top Header Line with Eyebrow matching Reference Design */}
        <div
          className={`mb-8 sm:mb-10 flex items-center gap-4 transition-all duration-700 ease-out ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
        >
          {eyebrow && (
            <span className="shrink-0 text-[11px] sm:text-xs font-bold uppercase tracking-[0.22em] text-[#E86A24]">
              {eyebrow}
            </span>
          )}
          <div className="h-[1px] flex-1 bg-white/15" />
        </div>

        {/* ─── TOP ROW: Heading and Subheading placed on Right (matching reference) ─── */}
        <div
          className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16 mb-4 sm:mb-6 transition-all duration-700 ease-out ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
        >
          <div className="hidden lg:block lg:col-span-5" />
          <div className="lg:col-span-7">
            <h2 className="mb-3 font-serif text-2xl font-normal leading-tight tracking-tight text-white sm:text-3xl md:text-4xl lg:text-[44px]">
              {heading}
            </h2>
            <p className="max-w-xl text-xs font-light leading-relaxed text-[#F4E9DF]/80 sm:text-sm md:text-base">
              {subheading}
            </p>
          </div>
        </div>

        {/* ─── 2-COLUMN SHOWCASE: Left Card matches the Exact Height of the 3 Points ─── */}
        <div
          className={`grid grid-cols-1 gap-8 sm:gap-10 lg:grid-cols-12 lg:gap-12 xl:gap-16 lg:items-stretch transition-all duration-700 ease-out ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          {/* ──── LEFT COLUMN: THE BIG CARD (Same height as the 3 points) ──── */}
          <div className="order-2 lg:order-1 lg:col-span-5 flex flex-col">
            <div className="group relative flex h-full flex-col justify-between overflow-hidden rounded-[26px] border border-white/10 bg-[#1C1917]/95 p-5 sm:p-6 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] backdrop-blur-md transition-all duration-700 sm:rounded-[32px]">
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

              {/* Step indicator header */}
              <div className="mb-3.5 flex items-center justify-between px-1">
                <span className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#E86A24]">
                  {currentStep.label}
                </span>
                <span className="text-[11px] font-mono tracking-widest text-[#F4E9DF]/40">
                  0{activeIndex + 1} / 0{steps.length}
                </span>
              </div>

              {/* Large Card Image with smooth focus-reveal & dissolve animation */}
              <div className="relative aspect-[4/3] sm:aspect-[16/11] lg:aspect-auto lg:flex-1 lg:min-h-[240px] w-full overflow-hidden rounded-[20px] bg-stone-900/60 sm:rounded-[24px]">
                <AnimatePresence mode="popLayout">
                  <motion.img
                    key={activeIndex}
                    src={currentImage}
                    alt={currentStep.title}
                    initial={{ opacity: 0, scale: 1.1, filter: "blur(6px)" }}
                    animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                    exit={{ opacity: 0, scale: 0.95, filter: "blur(4px)" }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                </AnimatePresence>
                {/* Subtle dark gradient overlay at bottom of image */}
                <div className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
              </div>

              {/* Card Details: Smooth slide-up & fade transition on step change */}
              <div className="relative pt-5 pb-1 min-h-[110px] sm:min-h-[120px] overflow-hidden">
                <AnimatePresence mode="popLayout">
                  <motion.div
                    key={activeIndex}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <h3 className="mb-2 font-serif text-2xl font-bold tracking-tight text-white sm:text-3xl">
                      {currentStep.title}
                    </h3>
                    <p className="text-xs font-normal leading-relaxed text-[#F4E9DF]/75 sm:text-sm">
                      {currentStep.body}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* ──── RIGHT COLUMN: THE 3 POINTS (Equal height to Left Card) ──── */}
          <div className="order-1 lg:order-2 lg:col-span-7 flex flex-col justify-between">
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
                        className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                          isActive
                            ? "text-white"
                            : "text-white/20 group-hover:text-white/40"
                        }`}
                      >
                        {step.title}
                      </span>
                    </div>

                    {/* Base Inactive Border Line */}
                    <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-white/15" />

                    {/* Active Highlight Line: Left-to-Right Progress on Enter, Right-to-Left Retraction on Exit */}
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
            className={`mx-auto mt-12 sm:mt-16 max-w-2xl text-center text-xs font-light leading-relaxed text-[#F4E9DF]/75 transition-all duration-700 delay-300 ease-out sm:text-sm md:text-base ${
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
