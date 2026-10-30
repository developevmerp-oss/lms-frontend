"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Trophy,
  Brush,
  Heart,
  Sparkles,
  Share2,
  BarChart3,
  Compass,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// ─── 8-WEEK ROADMAP DATA: HIGH-IMPACT ZOOM VIEW (900 x 2060 VIEWBOX) ───
interface RoadmapPoint {
  week: number;
  line1: string;
  line2: string;
  themeColor: string;
  tipX: number;
  tipY: number;
  bulbX: number;
  isRight: boolean;
  titleX: number;
}

const ROADMAP_POINTS: RoadmapPoint[] = [
  {
    week: 1,
    line1: "START WITH",
    line2: "CLARITY",
    themeColor: "#f43f5e", // Rose Pink (Pin 1)
    tipX: 660,
    tipY: 200,
    bulbX: 712,
    isRight: true,
    titleX: 280,
  },
  {
    week: 2,
    line1: "BUILD YOUR",
    line2: "CONFIDENCE",
    themeColor: "#ea580c", // Vibrant Orange (Pin 2)
    tipX: 240,
    tipY: 420,
    bulbX: 188,
    isRight: false,
    titleX: 620,
  },
  {
    week: 3,
    line1: "DEVELOP",
    line2: "YOUR SKILLS",
    themeColor: "#8b5cf6", // Purple / Lavender (Pin 3)
    tipX: 660,
    tipY: 640,
    bulbX: 712,
    isRight: true,
    titleX: 280,
  },
  {
    week: 4,
    line1: "FIND YOUR",
    line2: "CREATIVE STYLE",
    themeColor: "#06b6d4", // Teal / Cyan (Pin 4)
    tipX: 240,
    tipY: 860,
    bulbX: 188,
    isRight: false,
    titleX: 620,
  },
  {
    week: 5,
    line1: "CREATE YOUR",
    line2: "PORTFOLIO",
    themeColor: "#ef4444", // Bright Red (Pin 5)
    tipX: 660,
    tipY: 1080,
    bulbX: 712,
    isRight: true,
    titleX: 280,
  },
  {
    week: 6,
    line1: "BUILD YOUR",
    line2: "BRAND IDENTITY",
    themeColor: "#0284c7", // Sky Blue (Pin 6)
    tipX: 240,
    tipY: 1300,
    bulbX: 188,
    isRight: false,
    titleX: 620,
  },
  {
    week: 7,
    line1: "GET VISIBLE",
    line2: "ONLINE",
    themeColor: "#fb7185", // Coral Pink (Pin 7)
    tipX: 660,
    tipY: 1520,
    bulbX: 712,
    isRight: true,
    titleX: 280,
  },
  {
    week: 8,
    line1: "TAKE YOUR",
    line2: "NEXT STEP",
    themeColor: "#10b981", // Emerald Green (Pin 8 - Graduation Milestone)
    tipX: 240,
    tipY: 1740,
    bulbX: 188,
    isRight: false,
    titleX: 620,
  },
];

// ─── 3RD IMAGE PART: SUMMARY PILLARS (100% PRESERVED) ───
const SUMMARY_PILLARS = [
  {
    title: "Practical Resin Skills",
    subtitle: "you can use with confidence",
    icon: Brush,
    iconColor: "text-rose-600",
    bg: "bg-rose-50",
  },
  {
    title: "Complete Art Pieces",
    subtitle: "ready to display or sell",
    icon: Sparkles,
    iconColor: "text-amber-600",
    bg: "bg-amber-50",
  },
  {
    title: "Active Portfolio",
    subtitle: "showcasing your unique voice",
    icon: Trophy,
    iconColor: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    title: "Social Media Presence",
    subtitle: "attracting genuine buyers",
    icon: Share2,
    iconColor: "text-sky-600",
    bg: "bg-sky-50",
  },
  {
    title: "Business Clarity",
    subtitle: "and first steps towards sales",
    icon: BarChart3,
    iconColor: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    title: "Confidence, Friendships",
    subtitle: "and ongoing support from community",
    icon: Heart,
    iconColor: "text-rose-500",
    bg: "bg-rose-50",
  },
];

// ─── WIDE SWEEPING SERPENTINE ROAD SVG PATH: EXACT MATCH TO ZOOM VIEW (900 x 2060) ───
// Center X: 450, Right Apex: 620, Left Apex: 280
const ROAD_SVG_PATH =
  "M 450 70 " +
  "C 450 120, 620 130, 620 200 " +
  "C 620 310, 280 310, 280 420 " +
  "C 280 530, 620 530, 620 640 " +
  "C 620 750, 280 750, 280 860 " +
  "C 280 970, 620 970, 620 1080 " +
  "C 620 1190, 280 1190, 280 1300 " +
  "C 280 1410, 620 1410, 620 1520 " +
  "C 620 1630, 280 1630, 280 1740 " +
  "C 280 1840, 450 1850, 450 1920 " +
  "L 450 1960";

export default function ArtOThonSec({ sprintImages }: { sprintImages?: string[] }) {
  const pinSectionRef = useRef<HTMLDivElement | null>(null);
  const roadElRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    gsap.registerPlugin(ScrollTrigger);

    const pinSection = pinSectionRef.current;
    const roadEl = roadElRef.current;
    if (!pinSection || !roadEl) return;

    const ctx = gsap.context(() => {
      // 1. Initial State: Empty road on arrival (points & arrow hidden)
      for (let i = 0; i < 8; i++) {
        gsap.set(`#roadmap-node-${i}`, {
          opacity: 0,
          scale: 0.15,
        });
      }
      gsap.set("#roadmap-end-arrow", {
        opacity: 0,
        scale: 0.15,
      });

      // Exact travel distance calculation from physical width & SVG aspect ratio
      const getTravelDist = () => {
        const roadW = roadEl.offsetWidth || Math.min(920, window.innerWidth * 0.94);
        const roadH = roadEl.offsetHeight || Math.round(roadW * (2060 / 900));
        const viewH = window.innerHeight || 800;
        return Math.max(0, roadH - viewH + 90);
      };

      // 2. Master timeline intrinsically linked with ScrollTrigger.pin: true
      const masterTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: pinSection,
          start: "top top",
          end: "+=2600", // Smooth scroll distance for comfortable travel
          pin: true,
          pinSpacing: true, // Holds space so next sections DO NOT overlap
          scrub: 0.5,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // 3. Smooth vertical camera pan: Road moves UPWARD as user scrolls
      masterTimeline.to(
        roadEl,
        {
          y: () => -getTravelDist(),
          ease: "none",
          duration: 1,
        },
        0
      );

      // 4. Milestone points POP OUT one by one with spring bounce (back.out) on scrolling
      const stepTimes = [0.05, 0.16, 0.28, 0.40, 0.52, 0.64, 0.76, 0.86];
      for (let i = 0; i < 8; i++) {
        const pt = ROADMAP_POINTS[i];
        const time = stepTimes[i];
        const origin = `${pt.bulbX}px ${pt.tipY}px`;

        masterTimeline.fromTo(
          `#roadmap-node-${i}`,
          {
            opacity: 0,
            scale: 0.15,
            transformOrigin: origin,
          },
          {
            opacity: 1,
            scale: 1,
            duration: 0.08,
            ease: "back.out(2.5)", // Energetic spring popout animation
          },
          time
        );
      }

      // 5. Destination End Arrow (▼) pops out right below Point 8
      masterTimeline.fromTo(
        "#roadmap-end-arrow",
        {
          opacity: 0,
          scale: 0.15,
          transformOrigin: "450px 1985px",
        },
        {
          opacity: 1,
          scale: 1,
          duration: 0.06,
          ease: "back.out(2)",
        },
        0.90
      );

      // 6. Resting hold so Point 8 & the completed road stay in view before unpinning
      masterTimeline.to({}, { duration: 0.08 }, 0.92);
    }, pinSection);

    // Refresh ScrollTrigger at multiple intervals as images & dynamic content load
    const refreshTimer1 = setTimeout(() => ScrollTrigger.refresh(), 200);
    const refreshTimer2 = setTimeout(() => ScrollTrigger.refresh(), 700);
    const refreshTimer3 = setTimeout(() => ScrollTrigger.refresh(), 1500);

    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener("resize", onResize);

    return () => {
      clearTimeout(refreshTimer1);
      clearTimeout(refreshTimer2);
      clearTimeout(refreshTimer3);
      window.removeEventListener("resize", onResize);
      ctx.revert(); // 100% cleans up pin-spacers and resets DOM!
    };
  }, []);

  return (
    <>
      {/* ─── TOP CLOUDY WAVE (PRESERVED) ─── */}
      <div
        className="artothon-cloud-wave-top relative w-full h-[28px] sm:h-[32px] pointer-events-none z-40 -mb-[2px]"
        style={{
          backgroundColor: "#ffffff",
          backgroundImage: "radial-gradient(circle, #e2ded4 1.5px, transparent 1.5px)",
          backgroundSize: "24px 24px",
          backgroundAttachment: "fixed",
          WebkitMaskImage: "radial-gradient(circle at 50% 100%, #000 32px, transparent 32.5px)",
          maskImage: "radial-gradient(circle at 50% 100%, #000 32px, transparent 32.5px)",
          WebkitMaskSize: "64px 32px",
          maskSize: "64px 32px",
          WebkitMaskRepeat: "repeat-x",
          maskRepeat: "repeat-x",
          WebkitMaskPosition: "center bottom",
          maskPosition: "center bottom",
          filter: "drop-shadow(0 -3px 4px rgba(0, 0, 0, 0.04))",
        }}
        aria-hidden="true"
      />

      {/* ══════════════════════════════════════════════════════════════════════════
          1. SECTION HEADER (PADDING MATCHING ALL ABOVE SECTIONS)
          Top & bottom padding: py-16 sm:py-20 lg:py-24 matching DimensionsSec,
          CurriculumSec, and PathSec. Max-width max-w-7xl matching the site theme.
          Scrolls naturally upwards out of view as the user scrolls down.
      ══════════════════════════════════════════════════════════════════════════ */}
      <div
        id="artothon"
        className="artothon-header-sec relative w-full py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 z-20 text-neutral-950"
        style={{
          backgroundColor: "#ffffff",
          backgroundImage: "radial-gradient(circle, #e2ded4 1.5px, transparent 1.5px)",
          backgroundSize: "24px 24px",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="max-w-3xl">
              <p className="flex items-center gap-2 text-xs sm:text-xs font-semibold uppercase tracking-[0.18em] text-[#942008]">
                <span className="h-2 w-2 rounded-full bg-[#942008] animate-pulse" aria-hidden="true" />
                Action-First Learning • 60-Day Transformation
              </p>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-neutral-950 sm:text-5xl lg:text-5xl leading-tight">
                Your 60-Day{" "}
                <span className="text-[#942008] font-serif italic">Transformation</span> Roadmap
              </h2>
              <p className="mt-4 text-sm sm:text-base text-neutral-600 leading-relaxed max-w-2xl">
                A step-by-step journey to become a confident resin artist and build the foundation for your creative business.
              </p>
            </div>

            {/* Pink Quote Badge (from reference image) */}
            <div className="flex items-center gap-3 self-start lg:self-auto shrink-0">
              <div className="inline-flex items-center gap-2 bg-rose-50/90 border border-rose-200/90 rounded-full px-5 py-2.5 shadow-sm select-none">
                <span className="text-xs font-black tracking-wider uppercase text-rose-500">
                  Don&apos;t Just Learn.
                </span>
                <span className="text-xs sm:text-sm font-bold text-rose-800 flex items-center gap-1">
                  Create. Grow. Become. ❤️
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════════
          2. STICKY ROADMAP SECTION (h-screen Zoom View)
          Pinned from top:0 via GSAP ScrollTrigger.
          Shows the road in ZOOM VIEW.
          As user scrolls, road translates UPWARD, revealing points 1 to 8 with
          energetic popout animations!
      ══════════════════════════════════════════════════════════════════════════ */}
      <section
        id="artothon-road-section"
        ref={pinSectionRef}
        className="artothon-road-sec relative z-30 w-full h-screen max-h-screen overflow-hidden select-none flex flex-col items-center justify-start text-neutral-950"
        style={{
          backgroundColor: "#ffffff",
          backgroundImage: "radial-gradient(circle, #e2ded4 1.5px, transparent 1.5px)",
          backgroundSize: "24px 24px",
          backgroundAttachment: "fixed",
        }}
      >
        {/* Subtle Journey Guide Tag (from reference image) */}
        <div className="absolute top-4 z-30 flex items-center gap-1.5 bg-neutral-900/90 text-white text-[11px] sm:text-xs font-bold uppercase tracking-wider px-4 py-1.5 rounded-full shadow-lg backdrop-blur-sm pointer-events-none">
          <Compass className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: "12s" }} />
          <span>Scroll to Travel the Road</span>
        </div>

        {/* Road Canvas Stage: Zoom View Container matching Image 4 */}
        <div className="relative w-full flex-1 flex justify-center overflow-hidden">
          <div
            ref={roadElRef}
            className="relative w-[min(920px,94vw)] will-change-transform flex items-center justify-center pt-2 pb-20"
          >
            <svg
              className="w-full h-auto overflow-visible select-none drop-shadow-sm"
              viewBox="0 0 900 2060"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                {/* 3D Drop Shadow for Road Highway Depth */}
                <filter id="road-shadow" x="-20%" y="-10%" width="140%" height="120%">
                  <feDropShadow dx="0" dy="14" stdDeviation="12" floodColor="#000000" floodOpacity="0.15" />
                </filter>
                {/* Teardrop Pin Shadow */}
                <filter id="pin-shadow" x="-30%" y="-30%" width="160%" height="160%">
                  <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#000000" floodOpacity="0.25" />
                </filter>
              </defs>

              {/* 1. Outer White Curbs / Border */}
              <path
                d={ROAD_SVG_PATH}
                stroke="#ffffff"
                strokeWidth="78"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                filter="url(#road-shadow)"
              />

              {/* 2. Asphalt Road Bed */}
              <path
                d={ROAD_SVG_PATH}
                stroke="#18181b"
                strokeWidth="64"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />

              {/* 3. Dashed White Center Lane */}
              <path
                d={ROAD_SVG_PATH}
                stroke="#ffffff"
                strokeWidth="4"
                strokeDasharray="16 16"
                strokeLinecap="round"
                fill="none"
              />

              {/* 4. Destination End Road Arrow (▼) matching reference image */}
              <g id="roadmap-end-arrow">
                <polygon
                  points="408,1960 492,1960 450,2015"
                  fill="#18181b"
                  stroke="#ffffff"
                  strokeWidth="4.5"
                  filter="url(#pin-shadow)"
                />
                <line
                  x1="450"
                  y1="1960"
                  x2="450"
                  y2="1990"
                  stroke="#ffffff"
                  strokeWidth="4"
                  strokeDasharray="6 6"
                />
              </g>

              {/* 5. All 8 Milestone Nodes: Teardrop Pin + Number Badge + Bold Title in Curve */}
              {ROADMAP_POINTS.map((pt, idx) => {
                const isRight = pt.isRight;

                return (
                  <g
                    key={pt.week}
                    id={`roadmap-node-${idx}`}
                    className="origin-center"
                  >
                    {/* A. TEARDROP LOCATION MARKER PIN */}
                    {isRight ? (
                      // Pin on RIGHT pointing LEFT into road apex at (tipX, tipY)
                      <g>
                        <path
                          d={`M ${pt.tipX} ${pt.tipY} 
                             C ${pt.tipX + 16} ${pt.tipY - 18}, ${pt.tipX + 28} ${pt.tipY - 26}, ${pt.bulbX} ${pt.tipY - 26} 
                             A 26 26 0 1 1 ${pt.bulbX} ${pt.tipY + 26} 
                             C ${pt.tipX + 28} ${pt.tipY + 26}, ${pt.tipX + 16} ${pt.tipY + 18}, ${pt.tipX} ${pt.tipY} Z`}
                          fill={pt.themeColor}
                          stroke="#ffffff"
                          strokeWidth="3.5"
                          filter="url(#pin-shadow)"
                        />
                        {/* White inner disc */}
                        <circle cx={pt.bulbX} cy={pt.tipY} r="16" fill="#ffffff" />
                        {/* Bold Number inside location icon */}
                        <text
                          x={pt.bulbX}
                          y={pt.tipY + 7}
                          textAnchor="middle"
                          fill="#18181b"
                          fontWeight="900"
                          fontSize="20"
                          fontFamily="system-ui, -apple-system, sans-serif"
                        >
                          {pt.week}
                        </text>
                      </g>
                    ) : (
                      // Pin on LEFT pointing RIGHT into road apex at (tipX, tipY)
                      <g>
                        <path
                          d={`M ${pt.tipX} ${pt.tipY} 
                             C ${pt.tipX - 16} ${pt.tipY - 18}, ${pt.tipX - 28} ${pt.tipY - 26}, ${pt.bulbX} ${pt.tipY - 26} 
                             A 26 26 0 1 0 ${pt.bulbX} ${pt.tipY + 26} 
                             C ${pt.tipX - 28} ${pt.tipY + 26}, ${pt.tipX - 16} ${pt.tipY + 18}, ${pt.tipX} ${pt.tipY} Z`}
                          fill={pt.themeColor}
                          stroke="#ffffff"
                          strokeWidth="3.5"
                          filter="url(#pin-shadow)"
                        />
                        {/* White inner disc */}
                        <circle cx={pt.bulbX} cy={pt.tipY} r="16" fill="#ffffff" />
                        {/* Bold Number inside location icon */}
                        <text
                          x={pt.bulbX}
                          y={pt.tipY + 7}
                          textAnchor="middle"
                          fill="#18181b"
                          fontWeight="900"
                          fontSize="20"
                          fontFamily="system-ui, -apple-system, sans-serif"
                        >
                          {pt.week}
                        </text>
                      </g>
                    )}

                    {/* B. BOLD CARD TITLE IN CURVE (POPS OUT ON SCROLL) */}
                    <g>
                      <text
                        x={pt.titleX}
                        y={pt.tipY - 10}
                        textAnchor="middle"
                        fill="#09090b"
                        fontWeight="900"
                        fontSize="22"
                        letterSpacing="0.04em"
                        fontFamily="system-ui, -apple-system, sans-serif"
                      >
                        <tspan x={pt.titleX} dy="0">
                          {pt.line1}
                        </tspan>
                        <tspan x={pt.titleX} dy="28">
                          {pt.line2}
                        </tspan>
                      </text>
                    </g>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════════
          3. BY DAY 60 CELEBRATION BLOCK (PADDING MATCHING ALL ABOVE SECTIONS)
          py-16 sm:py-20 lg:py-24 and max-w-7xl matching all landing sections.
      ══════════════════════════════════════════════════════════════════════════ */}
      <section
        id="artothon-celebration"
        className="artothon-celebration-sec relative z-20 w-full py-16 sm:py-20 lg:py-24 text-neutral-950 overflow-hidden"
        style={{
          backgroundColor: "#ffffff",
          backgroundImage: "radial-gradient(circle, #e2ded4 1.5px, transparent 1.5px)",
          backgroundSize: "24px 24px",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="bg-white/95 backdrop-blur-md border border-[#eadfd4] hover:border-orange-300 transition-all rounded-3xl p-6 sm:p-8 lg:p-10 shadow-[0_20px_50px_-15px_rgba(45,30,15,0.08),0_4px_12px_-2px_rgba(45,30,15,0.03)]">
            <div className="flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-10">

              {/* Left Header Box */}
              <div className="lg:w-1/4 shrink-0 flex items-center gap-4 border-b lg:border-b-0 lg:border-r border-neutral-200 pb-5 lg:pb-0 lg:pr-8">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#942008] to-orange-600 flex items-center justify-center text-white shadow-lg shadow-orange-600/20 shrink-0">
                  <Trophy className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-[#942008]">
                    Transformation Achieved
                  </p>
                  <h4 className="text-xl sm:text-2xl font-black text-neutral-900 leading-tight mt-0.5">
                    By Day 60, You Will Have...
                  </h4>
                </div>
              </div>

              {/* Right: 6 Outcome Badges Grid */}
              <div className="lg:w-3/4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
                {SUMMARY_PILLARS.map((pillar, pIdx) => {
                  const PillarIcon = pillar.icon;
                  return (
                    <div
                      key={pIdx}
                      className="flex flex-col items-center text-center p-3.5 rounded-2xl bg-stone-50 hover:bg-orange-50/50 transition border border-stone-200/80 hover:border-orange-200 shadow-sm"
                    >
                      <div
                        className={`w-11 h-11 rounded-full ${pillar.bg} flex items-center justify-center ${pillar.iconColor} mb-2 shadow-sm`}
                      >
                        <PillarIcon className="w-5 h-5" />
                      </div>
                      <p className="text-xs lg:text-sm font-bold text-neutral-900 leading-tight">
                        {pillar.title}
                      </p>
                      <p className="text-[11px] text-neutral-500 leading-tight mt-1">
                        {pillar.subtitle}
                      </p>
                    </div>
                  );
                })}
              </div>

            </div>

            {/* Call to Action Button */}
            <div className="mt-8 text-center">
              <Link
                href="/webinar"
                className="inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 text-xs sm:text-sm font-bold uppercase tracking-wider text-white shadow-xl shadow-[#942008]/20 transition duration-300 hover:scale-105 active:scale-95 cursor-pointer"
                style={{
                  backgroundColor: "#942008",
                  backgroundImage: "linear-gradient(to right, #942008, #ea580c)",
                }}
              >
                Start Your 60-Day Transformation
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 
        Previous horizontal scrolling cards and outcomes kept for reference
      */}
    </>
  );
}
