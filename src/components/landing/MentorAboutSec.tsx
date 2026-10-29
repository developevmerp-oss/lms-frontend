"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, Briefcase, Gem, GraduationCap, Package, Play, ShieldCheck, Sparkles, Star, Trophy, Users } from "lucide-react";

const ACCENT = "#e36b32";

// ─── ANIMATED COUNT UP COMPONENT ───
function CountUp({
  target,
  suffix = "",
  decimals = 0,
}: {
  target: number;
  suffix?: string;
  decimals?: number;
}) {
  const [count, setCount] = useState(target);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const duration = 1200;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // easeOutExpo curve
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = easeProgress * target;
      setCount(current);

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setCount(target);
      }
    };

    const frameId = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(frameId);
  }, [target]);

  return (
    <span>
      {decimals > 0 ? count.toFixed(decimals) : Math.round(count)}
      {suffix}
    </span>
  );
}

// ─── AWARDS LIST DATA (NO YEARS / TAGS PER USER INSTRUCTION) ───
const AWARDS = [
  {
    title: "Hall of Fame Award",
    subtitle: "Hall of Fame Felicitation 2022–23",
  },
  {
    title: "Diamond Club Felicitation",
    subtitle: "Diamond Club Top Mentor Award",
  },
  {
    title: "Published Author",
    subtitle: 'Authored in "I Can Coach" Book',
  },
  {
    title: "Live Interactive Coaching",
    subtitle: "Weekly Live Sessions & Personal Feedback",
  },
];

// ─── RECOGNITION BRANDS ───
const ENDORSEMENTS = [
  { name: "FREEDOM RETREAT", color: "bg-[#18181b] text-white" },
  { name: "I CAN COACH", color: "bg-[#8b230d] text-white" },
  { name: "RAVISHING ART HUB", color: "bg-[#c4431d] text-white" },
  { name: "GOOGLE 5.0 ★", color: "bg-[#1f2937] text-[#fbbf24]" },
  { name: "DIAMOND CLUB", color: "bg-[#0f172a] text-[#38bdf8]" },
];

const FEATURES = [
  { icon: Briefcase, label: "6+ Years Professional Experience" },
  { icon: Trophy, label: "Nationally Recognized Art Coach" },
  { icon: Users, label: "Step-by-Step Business Frameworks" },
  { icon: Gem, label: "Hands-On Lifetime Community" },
];

const STATS = [
  { icon: GraduationCap, value: "54K+", label: "Students" },
  { icon: Package, value: "8K+", label: "Orders" },
  { icon: Star, value: "5.0 ★", label: "Google" },
];

const ACCOLADES = [
  {
    image: "/images/mentor/hall-of-fame-award.jpg",
    alt: "Vrajangna Patel Hall of Fame Award",
    badge: "Hall of Fame Award",
    icon: Trophy,
    title: "Hall of Fame Felicitation 2022–23",
    tag: "Freedom Retreat",
    text: "Awarded national stage recognition by India's leading coach Siddharth Rajsekar at Freedom Retreat for establishing one of the country's most vibrant and student-centric creative academies.",
    position: "object-top",
  },
  {
    image: "/images/mentor/diamond-award.jpg",
    alt: "Vrajangna Patel Diamond Awards",
    badge: "Diamond Club Felicitation",
    icon: Gem,
    title: "Diamond Club Top Mentor Award",
    tag: "Elite Recognition",
    text: "Felicitated with the Diamond status for impacting thousands of households by teaching high-margin resin craft, floral preservation, and order fulfillment systems.",
    position: "object-top",
  },
  {
    image: "/images/mentor/author-feature.jpg",
    alt: "Vrajangna Patel Published Author",
    badge: "Published Author",
    icon: BookOpen,
    title: 'Authored in "I Can Coach" Book',
    tag: "Published Work",
    text: "Featured alongside top educators nationwide, detailing her transformation from crafting at a small kitchen table to operating a premier art academy and mentoring 54,000+ creators.",
    position: "object-center",
  },
  {
    image: "/images/mentor/live-workshop.jpg",
    alt: "Vrajangna Patel Live Workshop Mentorship",
    badge: "Live Interactive Coaching",
    icon: Users,
    title: "Weekly Live Sessions & Personal Feedback",
    tag: "Hands-on Support",
    text: "Every student receives real-time guidance, artwork critique, formula troubleshooting, and client pricing blueprints directly in our interactive live workshops and community calls.",
    position: "object-top",
  },
];

export default function MentorAboutSec() {
  const sectionRef = useRef<HTMLElement>(null);


  // ─── 4 AWARDS TIMELINE DATA (EXACT 4 CARDS AS PER USER SPECIFICATION) ───
  const AWARDS_TIMELINE = [
    {
      step: "01",
      badge: "HALL OF FAME AWARD",
      tag: "Freedom Retreat",
      title: "Hall of Fame Felicitation 2022–23",
      text: "Awarded national stage recognition by India's leading coach Siddharth Rajsekar at Freedom Retreat for establishing one of the country's most vibrant and student-centric creative academies.",
      image: "/images/mentor/hall-of-fame-award.jpg",
      icon: Trophy,
      highlight: "National Stage Felicitation",
    },
    {
      step: "02",
      badge: "DIAMOND CLUB FELICITATION",
      tag: "Elite Recognition",
      title: "Diamond Club Top Mentor Award",
      text: "Felicitated with the Diamond status for impacting thousands of households by teaching high-margin resin craft, floral preservation, and order fulfillment systems.",
      image: "/images/mentor/diamond-award.jpg",
      icon: Gem,
      highlight: "Elite Mentor Status",
    },
    {
      step: "03",
      badge: "PUBLISHED AUTHOR",
      tag: "Published Work",
      title: 'Authored in "I Can Coach" Book',
      text: "Featured alongside top educators nationwide, detailing her transformation from crafting at a small kitchen table to operating a premier art academy and mentoring 54,000+ creators.",
      image: "/images/mentor/author-feature.jpg",
      icon: BookOpen,
      highlight: "National Bestseller Feature",
    },
    {
      step: "04",
      badge: "LIVE INTERACTIVE COACHING",
      tag: "Hands-on Support",
      title: "Weekly Live Sessions & Personal Feedback",
      text: "Every student receives real-time guidance, artwork critique, formula troubleshooting, and client pricing blueprints directly in our interactive live workshops and community calls.",
      image: "/images/mentor/live-workshop.jpg",
      icon: Users,
      highlight: "Real-time Live Workshops",
    },
  ];

  // ─── SMOOTH SCROLL PROGRESS AND EXACT POINT-TOUCH HIGHLIGHT TRACKING ───
  const desktopTimelineRef = useRef<HTMLDivElement>(null);
  const fillLineRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeSteps, setActiveSteps] = useState([false, false, false, false]);
  const [rowCenters, setRowCenters] = useState<number[]>([0, 0, 0, 0]);
  const [trackTop, setTrackTop] = useState(0);
  const [trackHeight, setTrackHeight] = useState(0);

  // Measure row centers relative to desktopTimelineRef container
  useEffect(() => {
    const measure = () => {
      const container = desktopTimelineRef.current;
      if (!container) return;

      const centers: number[] = [];
      for (let i = 0; i < 4; i++) {
        const row = rowRefs.current[i];
        if (row) {
          // offsetTop + offsetHeight / 2 is relative to desktopTimelineRef
          const center = row.offsetTop + row.offsetHeight / 2;
          centers.push(center);
        } else {
          centers.push(0);
        }
      }

      if (centers.length === 4 && centers[0] > 0) {
        // Line starts 70px above Step 01, flowing down into Step 01 (matching Orbit reference)
        const top = Math.max(0, centers[0] - 70);
        const end = centers[3];
        setTrackTop(top);
        setTrackHeight(Math.max(10, end - top));
        setRowCenters(centers);
      }
    };

    measure();
    window.addEventListener("resize", measure);

    // ResizeObserver ensures accuracy as images load
    let ro: ResizeObserver | null = null;
    if (desktopTimelineRef.current && typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(() => {
        measure();
      });
      ro.observe(desktopTimelineRef.current);
    }

    const t1 = setTimeout(measure, 300);
    const t2 = setTimeout(measure, 1000);

    return () => {
      window.removeEventListener("resize", measure);
      if (ro) ro.disconnect();
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  // Butter-smooth 60fps/120fps direct-DOM scroll listener: line smoothly proceeds and point highlights exactly when touched
  useEffect(() => {
    let rafId: number | null = null;

    const handleScroll = () => {
      if (rafId !== null) return;
      rafId = window.requestAnimationFrame(() => {
        rafId = null;
        const container = desktopTimelineRef.current;
        if (!container || rowCenters.length < 4 || trackHeight <= 0) return;

        const cRect = container.getBoundingClientRect();
        const vh = window.innerHeight;
        // Natural reading trigger line at 58% down viewport
        const triggerY = vh * 0.58;
        const currentContainerY = triggerY - cRect.top;

        // Progress line fill distance from trackTop
        const filled = Math.max(0, Math.min(trackHeight, currentContainerY - trackTop));

        // Directly update the visual progress line for 0-latency smooth 60fps/120fps motion
        if (fillLineRef.current) {
          fillLineRef.current.style.height = `${filled}px`;
        }

        // Exact tip Y position of the advancing colored line
        const fillTipY = trackTop + filled;

        // Exact touch trigger: point i highlights right when the line physically touches its center
        const nextActive = [false, false, false, false];
        for (let i = 0; i < 4; i++) {
          if (fillTipY >= rowCenters[i] - 2) {
            nextActive[i] = true;
          }
        }

        setActiveSteps((prev) => {
          if (
            prev[0] !== nextActive[0] ||
            prev[1] !== nextActive[1] ||
            prev[2] !== nextActive[2] ||
            prev[3] !== nextActive[3]
          ) {
            return nextActive;
          }
          return prev;
        });
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafId !== null) window.cancelAnimationFrame(rafId);
    };
  }, [trackTop, trackHeight, rowCenters]);

  return (
    <section
      id="mentor"
      ref={sectionRef}
      className="relative z-30 scroll-mt-24 pt-16 sm:pt-20 lg:pt-24 pb-0 bg-white text-stone-900 overflow-x-clip overflow-y-visible lg:-mt-[100vh] shadow-[0_-20px_50px_rgba(0,0,0,0.08)]"
      style={{
        backgroundColor: "#ffffff",
        backgroundImage: "radial-gradient(circle, #e2ded4 1.5px, transparent 1.5px)",
        backgroundSize: "24px 24px",
        backgroundAttachment: "fixed",
      }}
    >
      {/* ─── TOP CLOUDY WAVE (MATCHING 2ND REFERENCE IMAGE) ─── */}
      <div
        className="mentor-cloud-wave-top absolute -top-[27px] sm:-top-[31px] left-0 right-0 w-full h-[28px] sm:h-[32px] pointer-events-none z-20"
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

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ─── HEADER: MEET VRAJANGNA + SUBTITLE ─── */}
        <div className="text-center mb-10 sm:mb-14">
          <div className="inline-flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
            <span className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-neutral-900 uppercase">
              MEET
            </span>
            <div className="relative inline-flex items-center px-4 py-1 sm:px-6 sm:py-1.5 bg-[#171717] text-[#cbf530] font-black text-2xl sm:text-4xl lg:text-5xl rounded-2xl -rotate-2 shadow-xl border-2 border-neutral-900 tracking-wide select-none">
              VRAJANGNA
              {/* Overlapping Orange Verified Checkmark Badge */}
              <div className="absolute -top-3.5 -right-3.5 sm:-top-4 sm:-right-4 w-8 h-8 sm:w-11 sm:h-11 z-10 drop-shadow-md flex items-center justify-center">
                <img
                  src="/images/mentor/verified-badge.png"
                  alt="Verified Badge"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </div>
          <p
            className="text-xl sm:text-2xl lg:text-3xl font-bold italic text-[#df5522] mt-2 sm:mt-3 tracking-wide"
            style={{ fontFamily: "var(--font-script), cursive, sans-serif" }}
          >
            Founder & Resin Art Business Coach
          </p>
        </div>

        {/* ─── MAIN GRID: TALL SCALLOPED PHOTO (LEFT) + STATS & AWARDS (RIGHT) ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-end">
          {/* ─── LEFT COLUMN: TALLER SCALLOPED PHOTO + ROTATING BADGE + BADGE ON RIGHT ─── */}
          <div className="lg:col-span-5 flex flex-col items-center">
            {/* Scalloped Photo Container with Increased Height */}
            <div className="relative w-full max-w-[380px] sm:max-w-[420px] lg:max-w-[450px] aspect-[4/5.2]">
              {/* "Now tell us about yourself" pill badge on the image at top-right */}
              <div className="absolute -top-3.5 right-3 sm:-top-4 sm:right-5 z-20 flex flex-col items-end pointer-events-none drop-shadow-md">
                <div className="bg-white border border-stone-800 text-stone-900 text-xs sm:text-sm font-bold px-3.5 py-1.5 sm:px-4 sm:py-1.5 rounded-full shadow-sm whitespace-nowrap">
                  Now tell us about yourself
                </div>
                {/* Bubble tip pointing down towards photo */}
                <div className="w-2.5 h-2.5 bg-white border-r border-b border-stone-800 rotate-45 -mt-1.5 mr-5 shadow-sm" />
              </div>

              {/* Scalloped Masked Image with Increased Height (viewBox 0 0 450 580) */}
              <svg
                viewBox="0 0 450 580"
                className="w-full h-full drop-shadow-2xl overflow-visible"
              >
                <defs>
                  <mask id="scallop-photo-mask">
                    {/* Base rounded square */}
                    <rect x="24" y="24" width="402" height="532" rx="30" fill="white" />
                    {/* Top scallops */}
                    {[45, 85, 125, 165, 205, 245, 285, 325, 365, 405].map((cx, i) => (
                      <circle key={`top-${i}`} cx={cx} cy="24" r="18" fill="white" />
                    ))}
                    {/* Bottom scallops */}
                    {[45, 85, 125, 165, 205, 245, 285, 325, 365, 405].map((cx, i) => (
                      <circle key={`bot-${i}`} cx={cx} cy="556" r="18" fill="white" />
                    ))}
                    {/* Left scallops */}
                    {[55, 100, 145, 190, 235, 280, 325, 370, 415, 460, 505].map((cy, i) => (
                      <circle key={`left-${i}`} cx="24" cy={cy} r="18" fill="white" />
                    ))}
                    {/* Right scallops */}
                    {[55, 100, 145, 190, 235, 280, 325, 370, 415, 460, 505].map((cy, i) => (
                      <circle key={`right-${i}`} cx="426" cy={cy} r="18" fill="white" />
                    ))}
                  </mask>
                </defs>
                <image
                  href="/images/mentor/vrajangna-portrait.jpg"
                  x="0"
                  y="0"
                  width="450"
                  height="580"
                  preserveAspectRatio="xMidYMid slice"
                  mask="url(#scallop-photo-mask)"
                />
              </svg>

              {/* Continuously Rotating Trophy Badge at Bottom Right */}
              <div
                className="absolute -bottom-4 -right-4 sm:-bottom-5 sm:-right-5 w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 z-20 pointer-events-none drop-shadow-xl"
                style={{
                  animation: "spin 12s linear infinite",
                }}
              >
                <img
                  src="/images/mentor/trophy-badge.png"
                  alt="Accredited Mentor Trophy"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </div>

          {/* ─── RIGHT COLUMN: LITTLE BOTTOM TO IMAGE (lg:pt-12 lg:self-end) ─── */}
          <div className="lg:col-span-7 flex flex-col gap-7 lg:pt-12 lg:self-end">
            {/* ─── 4 STAT CARDS WITH COUNT-UP ANIMATION ─── */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 lg:gap-3.5">
              {/* Card 1: 6+ Years */}
              <div className="relative overflow-hidden rounded-2xl bg-[#c33d18] text-white p-4 sm:p-5 flex flex-col justify-between shadow-md min-h-[9rem] sm:min-h-[10rem] group transition-transform duration-300 hover:-translate-y-1">
                <div>
                  <div className="text-3xl sm:text-4xl lg:text-[2.65rem] font-black tracking-tight leading-none">
                    <CountUp target={6} suffix="+" />
                  </div>
                </div>
                <p className="text-sm sm:text-lg lg:text-sm font-semibold text-white/95 leading-snug mt-3">
                  Years of Professional Experience
                </p>
                {/* Krackerz Signature Cutout Corner */}
                <div className="absolute -bottom-3.5 -right-3.5 w-7 h-7 rounded-full bg-white" />
              </div>

              {/* Card 2: 54K+ Students */}
              <div className="relative overflow-hidden rounded-2xl bg-[#b53310] text-white p-4 sm:p-5 flex flex-col justify-between shadow-md min-h-[9rem] sm:min-h-[10rem] group transition-transform duration-300 hover:-translate-y-1">
                <div>
                  <div className="text-3xl sm:text-4xl lg:text-[2.65rem] font-black tracking-tight leading-none">
                    <CountUp target={54} suffix="K+" />
                  </div>
                </div>
                <p className="text-sm sm:text-lg lg:text-sm font-semibold text-white/95 leading-snug mt-3">
                  Students Mentored Nationwide
                </p>
                {/* Krackerz Signature Cutout Corner */}
                <div className="absolute -bottom-3.5 -right-3.5 w-7 h-7 rounded-full bg-white" />
              </div>

              {/* Card 3: 8K+ Orders */}
              <div className="relative overflow-hidden rounded-2xl bg-[#942008] text-white p-4 sm:p-5 flex flex-col justify-between shadow-md min-h-[9rem] sm:min-h-[10rem] group transition-transform duration-300 hover:-translate-y-1">
                <div>
                  <div className="text-3xl sm:text-4xl lg:text-[2.65rem] font-black tracking-tight leading-none">
                    <CountUp target={8} suffix="K+" />
                  </div>
                </div>
                <p className="text-sm sm:text-lg lg:text-sm font-semibold text-white/95 leading-snug mt-3">
                  Art &amp; Craft Orders Delivered
                </p>
                {/* Krackerz Signature Cutout Corner */}
                <div className="absolute -bottom-3.5 -right-3.5 w-7 h-7 rounded-full bg-white" />
              </div>

              {/* Card 4: 5.0 ★ Google */}
              <div className="relative overflow-hidden rounded-2xl bg-[#701405] text-white p-4 sm:p-5 flex flex-col justify-between shadow-md min-h-[9rem] sm:min-h-[10rem] group transition-transform duration-300 hover:-translate-y-1">
                <div>
                  <div className="text-3xl sm:text-4xl lg:text-[2.65rem] font-black tracking-tight leading-none text-[#fef08a]">
                    <CountUp target={5.0} decimals={1} suffix=" ★" />
                  </div>
                </div>
                <p className="text-sm sm:text-lg lg:text-sm font-semibold text-white/95 leading-snug mt-3">
                  Google Verified Rating
                </p>
                {/* Krackerz Signature Cutout Corner */}
                <div className="absolute -bottom-3.5 -right-3.5 w-7 h-7 rounded-full bg-white" />
              </div>
            </div>

            {/* ─── MENTOR QUOTE, MISSION & 3 LIGHT-COLORED BOXES ─── */}
            <div className="flex flex-col pt-1">
              <blockquote>
                <p
                  className="text-lg sm:text-2xl lg:text-2xl font-bold italic leading-snug text-stone-900 tracking-tight"
                  style={{ fontFamily: '"Iowan Old Style", Palatino, "Palatino Linotype", Georgia, serif' }}
                >
                  “Every woman deserves the opportunity to create an identity beyond the roles she plays for everyone else.”
                </p>
                <cite className="mt-2.5 sm:mt-3 block text-sm sm:text-lg lg:text-base font-bold not-italic text-[#df5522] tracking-wide">
                  — Vrajangna Patel, Lead Mentor
                </cite>
              </blockquote>

              {/* Bottom Border */}
              <div className="border-b border-stone-300/80 my-4 sm:my-5" />

              {/* Mission Paragraph */}
              <p className="text-sm sm:text-lg lg:text-base leading-relaxed text-stone-700 font-medium">
                My goal isn&apos;t just to teach you how to make Resin Art. My goal is to help you believe that your creativity can become something meaningful, valuable and truly yours — whether you want to start a side-income or build a recognized premium brand.
              </p>

              {/* Gap & 3 Light Colored Boxes */}
              <div className="mt-5 sm:mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Box 1: Nationally Recognized Art Coach */}
                <div className="relative overflow-hidden rounded-2xl bg-[#fff7f2] border border-[#f5ded0] p-3.5 sm:p-4 flex items-center sm:flex-col sm:items-center sm:justify-center sm:text-center gap-2.5 sm:gap-3 shadow-[0_2px_8px_rgba(45,30,15,0.04)] min-h-[3.75rem] sm:min-h-[5.25rem] group transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
                  <span className="flex h-7 w-7 sm:h-10 sm:w-10 lg:h-8 lg:w-8 shrink-0 items-center justify-center rounded-full bg-[#fde5d6] text-[#c33d18] font-black text-xs sm:text-lg lg:text-sm">
                    01
                  </span>
                  <span className="text-sm sm:text-lg lg:text-[0.82rem] font-bold text-stone-800 leading-snug tracking-tight">
                    Nationally Recognized Art Coach
                  </span>
                  {/* Subtle Cutout Corner */}
                  <div className="absolute -bottom-2 -right-2 w-4 h-4 rounded-full bg-white border border-[#f5ded0]" />
                </div>

                {/* Box 2: Step-by-Step Business Frameworks */}
                <div className="relative overflow-hidden rounded-2xl bg-[#faf7f2] border border-[#ebe2d7] p-3.5 sm:p-4 flex items-center sm:flex-col sm:items-center sm:justify-center sm:text-center gap-2.5 sm:gap-3 shadow-[0_2px_8px_rgba(45,30,15,0.04)] min-h-[3.75rem] sm:min-h-[5.25rem] group transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
                  <span className="flex h-7 w-7 sm:h-10 sm:w-10 lg:h-8 lg:w-8 shrink-0 items-center justify-center rounded-full bg-[#eee5d8] text-[#78350f] font-black text-xs sm:text-lg lg:text-sm">
                    02
                  </span>
                  <span className="text-sm sm:text-lg lg:text-[0.82rem] font-bold text-stone-800 leading-snug tracking-tight">
                    Step-by-Step Business Frameworks
                  </span>
                  {/* Subtle Cutout Corner */}
                  <div className="absolute -bottom-2 -right-2 w-4 h-4 rounded-full bg-white border border-[#ebe2d7]" />
                </div>

                {/* Box 3: Hands-On Lifetime Community */}
                <div className="relative overflow-hidden rounded-2xl bg-[#fff4f4] border border-[#f8dada] p-3.5 sm:p-4 flex items-center sm:flex-col sm:items-center sm:justify-center sm:text-center gap-2.5 sm:gap-3 shadow-[0_2px_8px_rgba(45,30,15,0.04)] min-h-[3.75rem] sm:min-h-[5.25rem] group transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
                  <span className="flex h-7 w-7 sm:h-10 sm:w-10 lg:h-8 lg:w-8 shrink-0 items-center justify-center rounded-full bg-[#fcdcdc] text-[#942008] font-black text-xs sm:text-lg lg:text-sm">
                    03
                  </span>
                  <span className="text-sm sm:text-lg lg:text-[0.82rem] font-bold text-stone-800 leading-snug tracking-tight">
                    Hands-On Lifetime Community
                  </span>
                  {/* Subtle Cutout Corner */}
                  <div className="absolute -bottom-2 -right-2 w-4 h-4 rounded-full bg-white border border-[#f8dada]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── MENTOR AWARDS & RECOGNITION TIMELINE (WHITE BG + NON-SCROLLING DOT PATTERN) ─── */}
      <div
        id="milestones-timeline"
        className="relative w-full pt-16 sm:pt-24 lg:pt-28 pb-20 sm:pb-32 text-neutral-950 select-none overflow-hidden"
        style={{
          backgroundColor: "#ffffff",
          backgroundImage: "radial-gradient(circle, #e2ded4 1.5px, transparent 1.5px)",
          backgroundSize: "24px 24px",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="container mx-auto px-5 sm:px-10 lg:px-10 2xl:px-0 relative z-10">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-20">
            <span className="mb-4 inline-flex items-center text-xs sm:text-base lg:text-xs font-semibold uppercase tracking-[0.18em] text-[#942008]">
              National Honors &amp; Felicitations
            </span>
            <h3 className="mt-3 text-3xl sm:text-5xl lg:text-5xl font-black tracking-tight text-neutral-950 leading-tight">
              Milestones Built On <span className="text-[#942008]">Real Mentorship</span>
            </h3>
            <p className="mx-auto mt-4 max-w-2xl text-sm sm:text-xl lg:text-base text-neutral-600 leading-relaxed font-normal">
              Step-by-step excellence recognized across national platforms, mentoring thousands of creators into independent artists.
            </p>
          </div>

          {/* ─── DESKTOP TIMELINE (md and above): WIDE, CLEAN ALTERNATING CARDS WITH CENTER PROGRESS LINE ─── */}
          <div ref={desktopTimelineRef} className="hidden lg:block relative max-w-6xl mx-auto mt-12 sm:mt-16 lg:mt-20">
            {/* Central Vertical Progress Track (Starts 70px above Step 01, ends at Step 04) */}
            <div
              className="absolute left-1/2 -translate-x-1/2 pointer-events-none z-10"
              style={{
                top: trackTop > 0 ? `${trackTop}px` : "40px",
                height: trackHeight > 0 ? `${trackHeight}px` : "calc(100% - 120px)",
                width: "2px",
              }}
            >
              {/* Base Inactive Gray Line (Crisp, clearly visible neutral line matching Orbit reference) */}
              <div className="w-full h-full bg-neutral-300 rounded-full" />
              {/* Active Theme Color Fill Line (Runs smoothly downwards as you scroll) */}
              <div
                ref={fillLineRef}
                className="absolute top-0 left-0 w-full bg-gradient-to-b from-[#942008] to-[#ea580c] rounded-full will-change-[height] shadow-[0_0_10px_rgba(234,88,12,0.7)]"
                style={{
                  height: "0px",
                }}
              />
            </div>

            {/* 4 Alternating Card Rows with Generous Spacing and Zero Overlap */}
            <div className="flex flex-col space-y-24 lg:space-y-32">
              {AWARDS_TIMELINE.map((item, idx) => {
                const isReached = activeSteps[idx];
                const isEven = idx % 2 === 0; // Row 0 & 2: Content Left, Image Right | Row 1 & 3: Image Left, Content Right
                const Icon = item.icon;

                return (
                  <div
                    key={item.step}
                    ref={(el) => {
                      rowRefs.current[idx] = el;
                    }}
                    className="relative grid grid-cols-2 items-center min-h-[280px]"
                  >
                    {/* ──── LEFT COLUMN ──── */}
                    {isEven ? (
                      /* Text Content on Left: Generous padding (pr-20 to pr-32) leaves pristine gap for rotated step number */
                      <div className={`flex flex-col items-end text-right pr-20 md:pr-24 lg:pr-32 transition-all duration-500 ${isReached ? "opacity-100" : "opacity-50"
                        }`}>
                        <span className="inline-flex items-center gap-1.5 text-xs sm:text-base lg:text-xs font-semibold uppercase tracking-[0.18em] text-[#942008] mb-2.5">
                          <Icon size={14} className="text-[#942008]" />
                          {item.badge}
                        </span>
                        <h4 className="text-xl sm:text-3xl lg:text-2xl font-black text-neutral-950 leading-snug tracking-tight">
                          {item.title}
                        </h4>
                        <p className="text-xs sm:text-base lg:text-sm font-semibold text-[#ea580c] mt-1.5">{item.tag}</p>
                        <p className="mt-3 text-xs sm:text-base lg:text-base leading-relaxed text-neutral-600 font-normal max-w-md">
                          {item.text}
                        </p>
                        <div className="mt-4 inline-flex items-center gap-1.5 text-xs sm:text-base lg:text-sm font-semibold text-neutral-700">
                          <Star size={14} className="fill-[#ea580c] text-[#ea580c]" />
                          <span>{item.highlight}</span>
                        </div>
                      </div>
                    ) : (
                      /* Image on Left: Connects seamlessly to horizontal line on its right border */
                      <div className={`flex justify-end pr-20 md:pr-24 lg:pr-32 transition-all duration-500 ${isReached ? "opacity-100 scale-100" : "opacity-60 scale-98"
                        }`}>
                        <div className="relative aspect-[16/11] w-full max-w-md lg:max-w-lg rounded-2xl sm:rounded-3xl overflow-hidden border border-[#eadfd4] bg-white shadow-[0_16px_36px_-12px_rgba(90,55,20,0.14)] group transition-all duration-300 hover:shadow-[0_22px_45px_-12px_rgba(234,88,12,0.2)]">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                          />
                        </div>
                      </div>
                    )}

                    {/* ──── CENTER NODE & CONNECTOR BRANCH & STEP NUMBER ──── */}
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20 flex items-center justify-center">
                      {/* Horizontal Connector Line: Connects outer circle edge (18px) directly to image border */}
                      <div
                        className={`absolute top-1/2 -translate-y-1/2 h-[2px] transition-colors duration-300 ease-out ${isEven
                          ? "left-[18px] w-[62px] md:w-[78px] lg:w-[110px]"
                          : "right-[18px] w-[62px] md:w-[78px] lg:w-[110px]"
                          } ${isReached ? "bg-[#ea580c]" : "bg-neutral-300"
                          }`}
                      />

                      {/* Rotated Step Number: ALWAYS sits on text side in the generous whitespace between circle and text */}
                      <span
                        className={`absolute top-1/2 -translate-y-1/2 select-none font-black text-2xl sm:text-4xl lg:text-3xl tracking-wider transition-all duration-300 -rotate-90 ${isEven
                          ? "right-9 sm:right-11"
                          : "left-9 sm:left-11"
                          } ${isReached
                            ? "text-[#942008] scale-105"
                            : "text-neutral-400 scale-95"
                          }`}
                      >
                        {item.step}
                      </span>

                      {/* Outer Circle Ring (Transparent Orange Border & Fill when reached) */}
                      <div
                        className={`relative z-20 w-9 h-9 rounded-full border-2 transition-all duration-300 ease-out flex items-center justify-center ${isReached
                          ? "border-[#ea580c] bg-[#ea580c]/20 shadow-[0_0_16px_rgba(234,88,12,0.45)] scale-110"
                          : "border-neutral-300 bg-white shadow-none scale-100"
                          }`}
                      >
                        {/* Inner Filled Point */}
                        <div
                          className={`w-4 h-4 rounded-full transition-all duration-300 ease-out ${isReached
                            ? "bg-[#ea580c]"
                            : "bg-neutral-300"
                            }`}
                        />
                      </div>
                    </div>

                    {/* ──── RIGHT COLUMN ──── */}
                    {isEven ? (
                      /* Image on Right: Connects seamlessly to horizontal line on its left border */
                      <div className={`flex justify-start pl-20 md:pl-24 lg:pl-32 transition-all duration-500 ${isReached ? "opacity-100 scale-100" : "opacity-60 scale-98"
                        }`}>
                        <div className="relative aspect-[16/11] w-full max-w-md lg:max-w-lg rounded-2xl sm:rounded-3xl overflow-hidden border border-[#eadfd4] bg-white shadow-[0_16px_36px_-12px_rgba(90,55,20,0.14)] group transition-all duration-300 hover:shadow-[0_22px_45px_-12px_rgba(234,88,12,0.2)]">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                          />
                        </div>
                      </div>
                    ) : (
                      /* Text Content on Right: Generous padding (pl-20 to pl-32) leaves pristine gap for rotated step number */
                      <div className={`flex flex-col items-start text-left pl-20 md:pl-24 lg:pl-32 transition-all duration-500 ${isReached ? "opacity-100" : "opacity-50"
                        }`}>
                        <span className="inline-flex items-center gap-1.5 text-xs sm:text-base lg:text-xs font-semibold uppercase tracking-[0.18em] text-[#942008] mb-2.5">
                          <Icon size={14} className="text-[#942008]" />
                          {item.badge}
                        </span>
                        <h4 className="text-xl sm:text-3xl lg:text-2xl font-black text-neutral-950 leading-snug tracking-tight">
                          {item.title}
                        </h4>
                        <p className="text-xs sm:text-base lg:text-sm font-semibold text-[#ea580c] mt-1.5">{item.tag}</p>
                        <p className="mt-3 text-xs sm:text-base lg:text-base leading-relaxed text-neutral-600 font-normal max-w-md">
                          {item.text}
                        </p>
                        <div className="mt-4 inline-flex items-center gap-1.5 text-xs sm:text-base lg:text-sm font-semibold text-neutral-700">
                          <Star size={14} className="fill-[#ea580c] text-[#ea580c]" />
                          <span>{item.highlight}</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* ─── MOBILE TIMELINE (< md): CLEAN STACKED CARDS WITH STEP BADGES (MATCHING REFERENCE MOBILE) ─── */}
          <div className="lg:hidden flex flex-col space-y-8 sm:space-y-10 mt-10">
            {AWARDS_TIMELINE.map((item, idx) => {
              const isReached = activeSteps[idx];
              const Icon = item.icon;

              return (
                <div
                  key={item.step}
                  className="rounded-2xl sm:rounded-3xl bg-white border border-[#eadfd4] p-4 sm:p-6 shadow-[0_16px_36px_-12px_rgba(90,55,20,0.12)] transition-all duration-300"
                >
                  {/* Top Image with Floating Step Badge */}
                  <div className="relative aspect-[16/10] w-full rounded-xl sm:rounded-2xl overflow-hidden mb-4 sm:mb-5 border border-[#eadfd4] bg-stone-50">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover object-top"
                    />

                    {/* Floating Pill Badge (Matching Reference Mobile Screen) */}
                    {/* <div className="absolute top-3 left-3 inline-flex items-center gap-2 rounded-full bg-white/95 backdrop-blur-md px-3 py-1.5 border border-[#eadfd4] text-xs sm:text-sm font-bold text-neutral-800 shadow-sm">
                      <div
                        className={`w-2.5 h-2.5 rounded-full border transition-all duration-300 ${
                          isReached
                            ? "bg-[#ea580c] border-[#ea580c] shadow-[0_0_8px_#ea580c]"
                            : "bg-[#d1d5db] border-[#9ca3af]"
                        }`}
                      />
                      <span>Step {item.step}</span>
                    </div> */}
                  </div>

                  {/* Text Details Below Image */}
                  <div>
                    <span className="text-xs sm:text-base lg:text-xs font-semibold uppercase tracking-[0.18em] text-[#942008] block mb-1">
                      {item.badge}
                    </span>
                    <h4 className="text-lg sm:text-2xl font-black text-neutral-950 leading-snug tracking-tight">
                      {item.title}
                    </h4>
                    <p className="text-sm sm:text-lg font-semibold text-[#ea580c] mt-1">{item.tag}</p>
                    <p className="mt-2.5 text-base sm:text-lg text-neutral-600 leading-relaxed font-normal">
                      {item.text}
                    </p>
                    <div className="mt-3.5 pt-3 border-t border-stone-200 flex items-center justify-between text-[0.8rem] sm:text-base text-neutral-700 font-semibold">
                      <span className="flex items-center gap-1.5">
                        <Star size={13} className="fill-[#ea580c] text-[#ea580c]" />
                        {item.highlight}
                      </span>
                      <span className="text-[0.8rem] sm:text-base text-neutral-500 font-medium">Verified Mentor</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ─── BOTTOM CLOUDY WAVE TRANSITION (WHITE WITH FIXED DOT BACKGROUND) ─── */}
      <div
        className="mentor-cloud-wave-bottom absolute -bottom-[27px] sm:-bottom-[31px] left-0 right-0 w-full h-[28px] sm:h-[32px] pointer-events-none z-20"
        style={{
          backgroundColor: "#ffffff",
          backgroundImage: "radial-gradient(circle, #e2ded4 1.5px, transparent 1.5px)",
          backgroundSize: "24px 24px",
          backgroundAttachment: "fixed",
          WebkitMaskImage: "radial-gradient(circle at 50% 0%, #000 32px, transparent 32.5px)",
          maskImage: "radial-gradient(circle at 50% 0%, #000 32px, transparent 32.5px)",
          WebkitMaskSize: "64px 32px",
          maskSize: "64px 32px",
          WebkitMaskRepeat: "repeat-x",
          maskRepeat: "repeat-x",
          WebkitMaskPosition: "center top",
          maskPosition: "center top",
          filter: "drop-shadow(0 3px 4px rgba(0, 0, 0, 0.04))",
        }}
        aria-hidden="true"
      />
    </section>
  );
}

