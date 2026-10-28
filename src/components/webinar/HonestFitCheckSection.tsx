"use client";

import React, { useEffect, useRef, useState } from "react";
import { Check, X } from "lucide-react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

export interface HonestFitCheckData {
  eyebrow?: string;
  heading: string;
  subheading: string;
  forHeading: string;
  notForHeading: string;
  forItems: string[];
  notForItems: string[];
}

interface HonestFitCheckSectionProps {
  data?: HonestFitCheckData;
}

const DEFAULT_DATA: HonestFitCheckData = {
  eyebrow: "HONEST FIT CHECK",
  heading: "Who should attend — and who should skip it",
  subheading:
    "Being explicit about fit raises show-up rate. I'd rather you spend 90 minutes well than spend them at all.",
  forHeading: "You SHOULD attend if…",
  notForHeading: "This is NOT for you if…",
  forItems: [
    "You want to seriously explore monetizing your creative skill.",
    "You are willing to learn rather than only collect tutorials.",
    "You want to build confidence and a unique identity.",
    "You want a structured resin learning roadmap.",
    "You want to understand how art can become a business.",
    "You are willing to take action after the Masterclass.",
  ],
  notForItems: [
    "You only want free tutorials with no intention of applying them.",
    "You are looking for instant or guaranteed income.",
    "You do not want to practice or improve your skills.",
    "You expect someone else to build the business for you.",
    "You are not interested in turning creativity into a serious opportunity.",
  ],
};

function getCardPath(w: number, h: number): string {
  if (!w || !h) return "";
  const cut = w < 480 ? 68 : w < 640 ? 76 : 85;
  const s = cut / 4;
  const r = s * 0.74;
  const radius = w < 640 ? 24 : 32;

  return `
    M ${radius} 0
    L ${w - cut} 0
    A ${r} ${r} 0 0 0 ${w - cut + s} ${s}
    A ${r} ${r} 0 0 0 ${w - cut + s * 2} ${s * 2}
    A ${r} ${r} 0 0 0 ${w - cut + s * 3} ${s * 3}
    A ${r} ${r} 0 0 0 ${w} ${cut}
    L ${w} ${h - radius}
    A ${radius} ${radius} 0 0 1 ${w - radius} ${h}
    L ${radius} ${h}
    A ${radius} ${radius} 0 0 1 0 ${h - radius}
    L 0 ${radius}
    A ${radius} ${radius} 0 0 1 ${radius} 0
    Z
  `;
}

export default function HonestFitCheckSection({
  data = DEFAULT_DATA,
}: HonestFitCheckSectionProps) {
  const {
    eyebrow,
    heading,
    subheading,
    forHeading,
    notForHeading,
    forItems,
    notForItems,
  } = data;

  const sectionRef = useRef<HTMLElement | null>(null);
  const leftRef = useRef<HTMLDivElement | null>(null);
  const rightRef = useRef<HTMLDivElement | null>(null);
  const [leftSize, setLeftSize] = useState({ w: 600, h: 500 });
  const [rightSize, setRightSize] = useState({ w: 600, h: 500 });
  const [isMobile, setIsMobile] = useState(false);

  // Measure card sizes and equalize their height and width
  useEffect(() => {
    const updateSizes = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);

      const leftW = leftRef.current?.offsetWidth || 600;
      const rightW = rightRef.current?.offsetWidth || 600;
      const leftH = leftRef.current?.offsetHeight || 500;
      const rightH = rightRef.current?.offsetHeight || 500;

      const uniformW = Math.max(leftW, rightW);
      const uniformH = Math.max(leftH, rightH, mobile ? 440 : 510);

      setLeftSize({ w: uniformW, h: uniformH });
      setRightSize({ w: uniformW, h: uniformH });
    };

    updateSizes();

    const ro = new ResizeObserver(updateSizes);
    if (leftRef.current) ro.observe(leftRef.current);
    if (rightRef.current) ro.observe(rightRef.current);

    window.addEventListener("resize", updateSizes);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", updateSizes);
    };
  }, []);

  // ─── SCROLL-LINKED CARDS COMING DOWN FROM TOP OF SECTION ───
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "center 48%"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 85,
    damping: 22,
    restDelta: 0.001,
  });

  // Cards come from high up at the top of the section with tilt
  const yLeft = useTransform(smoothProgress, [0, 1], [isMobile ? -130 : -250, 0]);
  const rotateLeft = useTransform(smoothProgress, [0, 1], [isMobile ? -5 : -8, 0]);

  const yRight = useTransform(smoothProgress, [0, 1], [isMobile ? -130 : -250, 0]);
  const rotateRight = useTransform(smoothProgress, [0, 1], [isMobile ? 5 : 8, 0]);

  // Synchronized uniform size so both cards have the exact same height and width
  const sharedWidth = Math.max(leftSize.w, rightSize.w);
  const sharedHeight = Math.max(leftSize.h, rightSize.h, isMobile ? 440 : 510);
  const sharedCardPath = getCardPath(sharedWidth, sharedHeight);

  return (
    <section
      ref={sectionRef}
      id="honest-fit"
      className="relative w-full py-24 sm:py-28 lg:py-36 overflow-x-clip text-neutral-950"
      style={{
        backgroundColor: "#ffffff",
        backgroundImage: "radial-gradient(circle, #e2ded4 1.5px, transparent 1.5px)",
        backgroundSize: "24px 24px",
      }}
    >
      {/* ─── DYNAMIC SVG CLIP-PATHS FOR EXACT SMOOTH CIRCULAR SCALLOP BITES ─── */}
      <svg
        width="0"
        height="0"
        className="absolute pointer-events-none"
        aria-hidden="true"
      >
        <defs>
          <clipPath id="scallop-clip-left">
            <path d={sharedCardPath} />
          </clipPath>
          <clipPath id="scallop-clip-right">
            <path d={sharedCardPath} />
          </clipPath>
        </defs>
      </svg>

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

      {/* ─── WIDE CONTENT CONTAINER ─── */}
      <div className="mx-auto w-full max-w-[1360px] px-4 sm:px-8 lg:px-12 xl:px-14 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-20">
          {eyebrow && (
            <span className="mb-4 inline-flex items-center rounded-full border border-[#f3d3c0] bg-[#fff6f0] px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#c45a28] shadow-xs">
              {eyebrow}
            </span>
          )}
          <h2 className="mb-4 font-serif text-3xl font-medium tracking-tight text-stone-950 sm:text-4xl lg:text-[46px]">
            {heading}
          </h2>
          {subheading && (
            <p className="text-stone-500 text-sm sm:text-base font-light leading-relaxed max-w-2xl mx-auto">
              {subheading}
            </p>
          )}
        </div>

        {/* ─── 2-CARD SHOWCASE: EQUAL HEIGHT & WIDTH, GLIDING FROM TOP OF SECTION ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 xl:gap-14 items-stretch">
          
          {/* ──── LEFT CARD WRAPPER WITH PLACEHOLDER SLOT ──── */}
          <div className="relative flex flex-col h-full">
            {/* Background Placeholder Slot with exact same shape & height */}
            <div
              style={{
                clipPath: sharedWidth ? "url(#scallop-clip-left)" : undefined,
                WebkitClipPath: sharedWidth ? "url(#scallop-clip-left)" : undefined,
                minHeight: isMobile ? 440 : 510,
              }}
              className="absolute inset-0 h-full w-full bg-[#EDE6DC]/75 border border-[#E0D7CB]/60 pointer-events-none"
              aria-hidden="true"
            />

            {/* Scroll-animated Card: Left Card (You SHOULD attend if...) */}
            <motion.div
              ref={leftRef}
              style={{
                y: yLeft,
                rotate: rotateLeft,
                clipPath: sharedWidth ? "url(#scallop-clip-left)" : undefined,
                WebkitClipPath: sharedWidth ? "url(#scallop-clip-left)" : undefined,
                transformOrigin: "center center",
                minHeight: isMobile ? 440 : 510,
              }}
              className="relative z-10 flex-1 flex flex-col justify-between h-full bg-[#C63616] py-8 sm:py-9 lg:py-10 px-7 sm:px-9 lg:px-11 transition-shadow duration-300 shadow-[0_24px_50px_-15px_rgba(198,54,22,0.35)] hover:brightness-105"
            >
              <div>
                {/* Card Title matching reference design */}
                <h3 className="font-serif text-2xl sm:text-3xl lg:text-[32px] font-bold text-white tracking-tight leading-tight mb-6 sm:mb-8 pr-20 sm:pr-24">
                  <span>You SHOULD</span>
                  <span className="block mt-1">attend if...</span>
                </h3>

                {/* Items List */}
                <ul className="space-y-3.5 sm:space-y-4">
                  {forItems.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3.5 sm:gap-4">
                      {/* Circle Badge with Checkmark */}
                      <div className="w-6 h-6 sm:w-6.5 sm:h-6.5 rounded-full bg-[#FDF3E7] flex items-center justify-center shrink-0 mt-0.5 shadow-xs transition-transform duration-300 hover:scale-105">
                        <Check className="w-3.5 h-3.5 text-[#C63616] stroke-[3]" />
                      </div>
                      {/* Item Text */}
                      <span className="text-white text-sm sm:text-lg lg:text-lg font-normal leading-relaxed">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>

          {/* ──── RIGHT CARD WRAPPER WITH PLACEHOLDER SLOT ──── */}
          <div className="relative flex flex-col h-full">
            {/* Background Placeholder Slot with exact same shape & height */}
            <div
              style={{
                clipPath: sharedWidth ? "url(#scallop-clip-right)" : undefined,
                WebkitClipPath: sharedWidth ? "url(#scallop-clip-right)" : undefined,
                minHeight: isMobile ? 440 : 510,
              }}
              className="absolute inset-0 h-full w-full bg-[#EDE6DC]/75 border border-[#E0D7CB]/60 pointer-events-none"
              aria-hidden="true"
            />

            {/* Scroll-animated Card: Right Card (This is NOT for you if...) */}
            <motion.div
              ref={rightRef}
              style={{
                y: yRight,
                rotate: rotateRight,
                clipPath: sharedWidth ? "url(#scallop-clip-right)" : undefined,
                WebkitClipPath: sharedWidth ? "url(#scallop-clip-right)" : undefined,
                transformOrigin: "center center",
                minHeight: isMobile ? 440 : 510,
              }}
              className="relative z-10 flex-1 flex flex-col justify-between h-full bg-[#8B230E] py-8 sm:py-9 lg:py-10 px-7 sm:px-9 lg:px-11 transition-shadow duration-300 shadow-[0_24px_50px_-15px_rgba(139,35,14,0.35)] hover:brightness-105"
            >
              <div>
                {/* Card Title matching reference design */}
                <h3 className="font-serif text-2xl sm:text-3xl lg:text-[32px] font-bold text-white tracking-tight leading-tight mb-6 sm:mb-8 pr-20 sm:pr-24">
                  <span>This is NOT</span>
                  <span className="block mt-1">for you if...</span>
                </h3>

                {/* Items List */}
                <ul className="space-y-3.5 sm:space-y-4">
                  {notForItems.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3.5 sm:gap-4">
                      {/* Circle Badge with Cross */}
                      <div className="w-6 h-6 sm:w-6.5 sm:h-6.5 rounded-full bg-[#FDF3E7] flex items-center justify-center shrink-0 mt-0.5 shadow-xs transition-transform duration-300 hover:scale-105">
                        <X className="w-3.5 h-3.5 text-[#8B230E] stroke-[3]" />
                      </div>
                      {/* Item Text */}
                      <span className="text-white text-sm sm:text-lg lg:text-lg font-normal leading-relaxed">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
