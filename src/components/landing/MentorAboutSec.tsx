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
  const showcaseTrackRef = useRef<HTMLDivElement>(null);
  const cardElementsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const activeCardIndexRef = useRef(0);

  // ─── 4 ACCREDITATION & HONORS CARDS SPECIFIED BY USER (NO NUMBERS ON CARDS) ───
  const DIAGONAL_CARDS = [
    {
      id: 1,
      tabLabel: "Hall of Award",
      badge: "HALL OF AWARD",
      title: "Hall of Fame Felicitation 2022–23",
      tag: "Freedom Retreat",
      text: "Awarded national stage recognition by India's leading coach Siddharth Rajsekar at Freedom Retreat for establishing one of the country's most vibrant and student-centric creative academies.",
      image: "/images/mentor/hall-of-fame-award.jpg",
      icon: Trophy,
      highlight: "National Stage Felicitation",
    },
    {
      id: 2,
      tabLabel: "Diamond Club",
      badge: "DIMOND CLUB FELICLITATION",
      title: "Diamond Club Top Mentor Award",
      tag: "Elite Recognition",
      text: "Felicitated with the Diamond status for impacting thousands of households by teaching high-margin resin craft, floral preservation, and order fulfillment systems.",
      image: "/images/mentor/diamond-award.jpg",
      icon: Gem,
      highlight: "Elite Mentor Status",
    },
    {
      id: 3,
      tabLabel: "Published Author",
      badge: "PUBLISHED AUTHOR",
      title: 'Authored in "I Can Coach" Book',
      tag: "Published Work",
      text: "Featured alongside top educators nationwide, detailing her transformation from crafting at a small kitchen table to operating a premier art academy and mentoring 54,000+ creators.",
      image: "/images/mentor/author-feature.jpg",
      icon: BookOpen,
      highlight: "National Bestseller Feature",
    },
    {
      id: 4,
      tabLabel: "Live Coaching",
      badge: "LIVE INTERACTIVE COACHING",
      title: "Weekly Live Sessions & Personal Feedback",
      tag: "Hands-on Support",
      text: "Every student receives real-time guidance, artwork critique, formula troubleshooting, and client pricing blueprints directly in our interactive live workshops and community calls.",
      image: "/images/mentor/live-workshop.jpg",
      icon: Users,
      highlight: "Real-time Live Workshops",
    },
  ];

  // ─── BUTTER-SMOOTH, ZERO-JITTER GPU SCROLL LOGIC ───
  useEffect(() => {
    let ticking = false;

    const updateShowcase = () => {
      const track = showcaseTrackRef.current;
      if (!track) return;

      const rect = track.getBoundingClientRect();
      const totalScrollable = track.offsetHeight - window.innerHeight;
      if (totalScrollable <= 0) return;

      const currentScroll = -rect.top;
      const progress = Math.max(0, Math.min(1, currentScroll / totalScrollable));

      const winW = window.innerWidth;
      const winH = window.innerHeight;

      // Responsive diagonal travel vector
      let stepX = 620;
      let stepY = 340;
      const isMobile = winW < 640;
      const isTablet = winW >= 640 && winW <= 1024;
      const isMobileOrTablet = winW <= 1024;

      if (isMobile) {
        stepX = winW * 0.75;
        stepY = winH * 0.32;
      } else if (isTablet) {
        stepX = winW * 0.72;
        stepY = winH * 0.36;
      } else {
        stepX = Math.min(winW * 0.46, 660);
        stepY = Math.min(winH * 0.38, 360);
      }

      const centers = [0.08, 0.36, 0.64, 0.92];
      const delta = 0.28;

      let nearestIdx = 0;
      let minDiff = 999;

      cardElementsRef.current.forEach((cardEl, i) => {
        if (!cardEl) return;
        const u = (progress - centers[i]) / delta;
        const diff = Math.abs(progress - centers[i]);
        if (diff < minDiff) {
          minDiff = diff;
          nearestIdx = i;
        }

        // Diagonal displacement:
        // u < 0 -> bottom-left (x < 0, y > 0)
        // u = 0 -> center (x = 0, y = 0)
        // u > 0 -> top-right (x > 0, y < 0)
        const x = u * stepX;
        const y = -u * stepY;

        // Smooth rotation:
        // When card is around center: strictly 0deg (completely upright & unrotated).
        // On mobile & tablet: smoothly un-rotates to 0deg at center, tilts gently as it enters from bottom-left / exits to top-right.
        let rot = 0;
        const centerFlatZone = 0.18;
        const fullTiltZone = 0.75;
        const maxTilt = isMobile ? 5.0 : isTablet ? 5.5 : 7.0;

        if (Math.abs(u) > centerFlatZone) {
          const t = Math.min(1, (Math.abs(u) - centerFlatZone) / (fullTiltZone - centerFlatZone));
          const smoothT = t * t * (3 - 2 * t);
          rot = Math.sign(u) * smoothT * maxTilt;
        }

        // Scale: Center focal card is 1.0
        const scale = Math.max(isMobileOrTablet ? 0.88 : 0.85, Math.min(1.0, 1.0 - Math.abs(u) * 0.10));

        // Opacity:
        // On both mobile and tablet view: single card focused experience.
        // Wide cubic S-curve easing ensures cards glide in and out smoothly without any sudden pop or abrupt cutoff.
        let opacity = 1.0;
        if (isMobileOrTablet) {
          if (Math.abs(u) <= 0.18) {
            opacity = 1.0;
          } else if (Math.abs(u) <= 0.78) {
            const t = (Math.abs(u) - 0.18) / (0.78 - 0.18);
            const smoothFade = t * t * (3 - 2 * t);
            opacity = Math.max(0, 1.0 - smoothFade);
          } else {
            opacity = 0;
          }
        } else {
          // Desktop widescreen multi-card experience
          if (Math.abs(u) > 0.85) {
            opacity = Math.max(0, 1.0 - (Math.abs(u) - 0.85) * 1.6);
          }
        }

        // Stacking order: active center card is always on top
        const zIndex = Math.max(1, Math.round(30 - Math.abs(u) * 10));

        cardEl.style.transform = `translate3d(calc(-50% + ${x.toFixed(1)}px), calc(-50% + ${y.toFixed(1)}px), 0px) scale(${scale.toFixed(3)}) rotate(${rot.toFixed(2)}deg)`;
        cardEl.style.opacity = opacity.toFixed(3);
        cardEl.style.zIndex = String(zIndex);
        cardEl.style.visibility = opacity <= 0.005 ? "hidden" : "visible";
        cardEl.style.pointerEvents = Math.abs(u) < (isMobileOrTablet ? 0.30 : 0.40) ? "auto" : "none";
      });

      if (nearestIdx !== activeCardIndexRef.current) {
        activeCardIndexRef.current = nearestIdx;
        setActiveCardIndex(nearestIdx);
      }
    };

    const onScrollOrResize = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateShowcase();
          ticking = false;
        });
        ticking = true;
      }
    };

    // Initial position on mount
    updateShowcase();

    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
    };
  }, []);

  const scrollToCard = (index: number) => {
    const track = showcaseTrackRef.current;
    if (!track) return;
    const centers = [0.08, 0.36, 0.64, 0.92];
    const totalScrollable = track.offsetHeight - window.innerHeight;
    const trackTop = track.getBoundingClientRect().top + window.scrollY;
    const targetScroll = trackTop + centers[index] * totalScrollable;
    window.scrollTo({
      top: targetScroll,
      behavior: "smooth",
    });
  };

  return (
    <section
      id="mentor"
      ref={sectionRef}
      className="relative z-30 scroll-mt-24 pt-16 sm:pt-20 lg:pt-24 pb-0 bg-white text-stone-900 overflow-x-clip overflow-y-visible lg:-mt-[100vh] shadow-[0_-20px_50px_rgba(0,0,0,0.08)]"
      style={{
        backgroundColor: "#ffffff",
        backgroundImage: "radial-gradient(circle, #e2ded4 1.5px, transparent 1.5px)",
        backgroundSize: "24px 24px",
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

      {/* ─── STICKY DIAGONAL SCROLL SHOWCASE (DARK SECTION AS PER REFERENCE FRAMER IMAGES) ─── */}
      <div
        ref={showcaseTrackRef}
        className="relative w-full h-[360vh] mt-16 sm:mt-24"
        style={{
          backgroundColor: "#0a0a0a",
        }}
      >
        {/* Sticky Viewport */}
        <div className="sticky top-0 h-screen w-full overflow-hidden bg-[#0a0a0a] flex flex-col justify-between py-3 sm:py-8 select-none">
          {/* Subtle Warm Amber Glow Behind Focal Area */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[42rem] h-[42rem] rounded-full pointer-events-none opacity-20 blur-3xl"
            style={{
              background: "radial-gradient(circle, #e36b32 0%, rgba(227,107,50,0) 70%)",
            }}
          />

          {/* ========================================================================= */}
          {/* ─── TITLE AND TAB OPTION (COMMENTED OUT AS PER USER INSTRUCTION) ─────── */}
          {/* ========================================================================= */}
          {/*
          <div className="relative z-40 max-w-5xl mx-auto px-4 sm:px-6 w-full text-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 border border-white/15 text-[#e36b32] text-xs font-black tracking-widest uppercase shadow-sm">
              <Sparkles size={13} />
              <span>National Honors &amp; Felicitations</span>
            </div>

            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight mt-2.5">
              Milestones Built On Real Mentorship
            </h3>

            <div className="mt-3.5 sm:mt-4 flex items-center justify-center gap-2 sm:gap-2.5 flex-wrap">
              {DIAGONAL_CARDS.map((card, idx) => {
                const isActive = activeCardIndex === idx;
                const Icon = card.icon;
                return (
                  <button
                    key={card.id}
                    type="button"
                    onClick={() => scrollToCard(idx)}
                    className={`group inline-flex items-center gap-2 px-4 py-1.5 sm:px-5 sm:py-2 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 cursor-pointer ${
                      isActive
                        ? "bg-[#171717] text-[#cbf530] border-2 border-stone-900 shadow-lg scale-105"
                        : "bg-white/95 text-stone-700 border border-stone-300 hover:bg-stone-50 hover:text-stone-950 shadow-sm"
                    }`}
                  >
                    <Icon size={14} className={isActive ? "text-[#cbf530]" : "text-[#e36b32]"} />
                    <span>{card.tabLabel}</span>
                  </button>
                );
              })}
            </div>
          </div>
          */}

          {/* Spacer to keep vertical balance when title/tabs are commented */}
          <div className="h-2 sm:h-8" aria-hidden="true" />

          {/* Center Stage: Medium Sized Cards Traveling Diagonally from Bottom-Left to Top-Right */}
          <div className="relative flex-1 w-full flex items-center justify-center overflow-visible">
            {DIAGONAL_CARDS.map((card, idx) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.id}
                  ref={(el) => {
                    cardElementsRef.current[idx] = el;
                  }}
                  className="absolute top-1/2 left-1/2 w-[86vw] max-w-[20.5rem] xs:max-w-[21.5rem] sm:max-w-none sm:w-[24.5rem] md:w-[26.5rem] lg:w-[29.5rem] xl:w-[31rem] h-[28rem] xs:h-[29.5rem] sm:h-[33.5rem] md:h-[35rem] lg:h-[38rem] rounded-[1.5rem] sm:rounded-[2rem] bg-[#161412] border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.85)] sm:shadow-[0_25px_65px_rgba(0,0,0,0.85)] overflow-hidden flex flex-col will-change-transform cursor-pointer transition-shadow duration-300 hover:border-[#e36b32]/50 hover:shadow-[0_30px_75px_rgba(227,107,50,0.25)]"
                  style={{
                    transform: "translate3d(-50%, -50%, 0px)",
                  }}
                  onClick={() => scrollToCard(idx)}
                >
                  {/* Photo Container */}
                  <div className="relative h-[12.5rem] xs:h-[13.5rem] sm:h-[17rem] md:h-[18rem] lg:h-[20.5rem] w-full overflow-hidden bg-stone-900 shrink-0">
                    <img
                      src={card.image}
                      alt={card.title}
                      className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    {/* Dark Scrim Transition */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#161412] via-transparent to-black/35" />

                    {/* Floating Tag Pill (No Number per User Instruction) */}
                    <div className="absolute top-3 right-3 sm:top-4 sm:right-4 pointer-events-none">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-black/65 backdrop-blur-md px-2.5 py-1 sm:px-3.5 sm:py-1.5 border border-white/20 text-white/95 font-bold text-[0.7rem] sm:text-xs md:text-sm tracking-wide shadow-md">
                        <Icon size={13} className="text-[#e36b32]" />
                        {card.tag}
                      </span>
                    </div>
                  </div>

                  {/* Card Body Container */}
                  <div className="p-3.5 xs:p-4 sm:p-5 lg:p-6 flex flex-col justify-between flex-1 bg-[#161412]">
                    <div>
                      {/* Category Kicker */}
                      <span className="text-[0.65rem] xs:text-[0.7rem] sm:text-xs md:text-sm font-black tracking-widest text-[#e36b32] uppercase block">
                        {card.badge}
                      </span>

                      {/* Main Title / Subtitle */}
                      <h4 className="text-base xs:text-lg sm:text-xl lg:text-[1.4rem] font-black text-white leading-snug tracking-tight mt-1 sm:mt-1.5">
                        {card.title}
                      </h4>

                      {/* Description Paragraph */}
                      <p className="text-[0.75rem] xs:text-[0.8rem] sm:text-[0.85rem] lg:text-[0.9rem] text-stone-300 font-normal leading-relaxed mt-2 sm:mt-2.5">
                        {card.text}
                      </p>
                    </div>

                    {/* Footer Row */}
                    <div className="pt-2.5 sm:pt-3 border-t border-white/10 flex items-center justify-between text-stone-400 text-[0.7rem] xs:text-[0.75rem] sm:text-xs md:text-sm">
                      <span className="font-bold text-stone-200 flex items-center gap-1.5">
                        <Star size={13} className="fill-[#e36b32] text-[#e36b32]" />
                        {card.highlight}
                      </span>
                      {/* <span className="font-medium text-stone-400">
                        {card.tag}
                      </span> */}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Scroll Prompt Bar */}
          <div className="relative z-40 text-center text-stone-500 text-xs sm:text-sm flex items-center justify-center gap-2 font-medium">
            <span className="w-2 h-2 rounded-full bg-[#e36b32] animate-ping" />
            <span>Scroll down to explore milestones</span>
          </div>
        </div>
      </div>

      {/* ─── BOTTOM CLOUDY WAVE TRANSITION ─── */}
      <div
        className="mentor-cloud-wave-bottom absolute -bottom-[27px] sm:-bottom-[31px] left-0 right-0 w-full h-[28px] sm:h-[32px] pointer-events-none z-20"
        style={{
          backgroundColor: "#0a0a0a",
          backgroundImage: "none",
          WebkitMaskImage: "radial-gradient(circle at 50% 0%, #000 32px, transparent 32.5px)",
          maskImage: "radial-gradient(circle at 50% 0%, #000 32px, transparent 32.5px)",
          WebkitMaskSize: "64px 32px",
          maskSize: "64px 32px",
          WebkitMaskRepeat: "repeat-x",
          maskRepeat: "repeat-x",
          WebkitMaskPosition: "center top",
          maskPosition: "center top",
          filter: "drop-shadow(0 3px 4px rgba(0, 0, 0, 0.3))",
        }}
        aria-hidden="true"
      />
    </section>
  );
}

