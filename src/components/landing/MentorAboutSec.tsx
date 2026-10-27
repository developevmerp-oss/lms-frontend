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
  isStarted,
}: {
  target: number;
  suffix?: string;
  decimals?: number;
  isStarted: boolean;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isStarted) return;
    let startTimestamp: number | null = null;
    const duration = 1800;

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
  }, [isStarted, target]);

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
  const [isCounterStarted, setIsCounterStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsCounterStarted(true);
          }
        });
      },
      { threshold: 0.25 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);
  return (
    <section
      id="mentor"
      ref={sectionRef}
      className="relative z-30 scroll-mt-24 py-16 sm:py-20 lg:py-24 bg-white text-stone-900 overflow-x-clip overflow-y-visible lg:-mt-[100vh]"
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

      {/* ─── BOTTOM CLOUDY WAVE (MATCHING 2ND REFERENCE IMAGE) ─── */}
      <div
        className="mentor-cloud-wave-bottom absolute -bottom-[27px] sm:-bottom-[31px] left-0 right-0 w-full h-[28px] sm:h-[32px] pointer-events-none z-20"
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
          filter: "drop-shadow(0 3px 4px rgba(0, 0, 0, 0.04))",
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
              <div className="relative overflow-hidden rounded-2xl bg-[#c33d18] text-white p-4 sm:p-5 flex flex-col justify-between shadow-md min-h-[145px] sm:min-h-[160px] group transition-transform duration-300 hover:-translate-y-1">
                <div>
                  <div className="text-3xl sm:text-4xl lg:text-[42px] font-black tracking-tight leading-none">
                    <CountUp target={6} suffix="+" isStarted={isCounterStarted} />
                  </div>
                </div>
                <p className="text-xs sm:text-[13px] font-semibold text-white/95 leading-snug mt-3">
                  Years of Professional Experience
                </p>
                {/* Krackerz Signature Cutout Corner */}
                <div className="absolute -bottom-3.5 -right-3.5 w-7 h-7 rounded-full bg-white" />
              </div>

              {/* Card 2: 54K+ Students */}
              <div className="relative overflow-hidden rounded-2xl bg-[#b53310] text-white p-4 sm:p-5 flex flex-col justify-between shadow-md min-h-[145px] sm:min-h-[160px] group transition-transform duration-300 hover:-translate-y-1">
                <div>
                  <div className="text-3xl sm:text-4xl lg:text-[42px] font-black tracking-tight leading-none">
                    <CountUp target={54} suffix="K+" isStarted={isCounterStarted} />
                  </div>
                </div>
                <p className="text-xs sm:text-[13px] font-semibold text-white/95 leading-snug mt-3">
                  Students Mentored Nationwide
                </p>
                {/* Krackerz Signature Cutout Corner */}
                <div className="absolute -bottom-3.5 -right-3.5 w-7 h-7 rounded-full bg-white" />
              </div>

              {/* Card 3: 8K+ Orders */}
              <div className="relative overflow-hidden rounded-2xl bg-[#942008] text-white p-4 sm:p-5 flex flex-col justify-between shadow-md min-h-[145px] sm:min-h-[160px] group transition-transform duration-300 hover:-translate-y-1">
                <div>
                  <div className="text-3xl sm:text-4xl lg:text-[42px] font-black tracking-tight leading-none">
                    <CountUp target={8} suffix="K+" isStarted={isCounterStarted} />
                  </div>
                </div>
                <p className="text-xs sm:text-[13px] font-semibold text-white/95 leading-snug mt-3">
                  Art &amp; Craft Orders Delivered
                </p>
                {/* Krackerz Signature Cutout Corner */}
                <div className="absolute -bottom-3.5 -right-3.5 w-7 h-7 rounded-full bg-white" />
              </div>

              {/* Card 4: 5.0 ★ Google */}
              <div className="relative overflow-hidden rounded-2xl bg-[#701405] text-white p-4 sm:p-5 flex flex-col justify-between shadow-md min-h-[145px] sm:min-h-[160px] group transition-transform duration-300 hover:-translate-y-1">
                <div>
                  <div className="text-3xl sm:text-4xl lg:text-[42px] font-black tracking-tight leading-none text-[#fef08a]">
                    <CountUp target={5.0} decimals={1} suffix=" ★" isStarted={isCounterStarted} />
                  </div>
                </div>
                <p className="text-xs sm:text-[13px] font-semibold text-white/95 leading-snug mt-3">
                  Google Verified Rating
                </p>
                {/* Krackerz Signature Cutout Corner */}
                <div className="absolute -bottom-3.5 -right-3.5 w-7 h-7 rounded-full bg-white" />
              </div>
            </div>

            {/* ─── AWARDS LIST (WITHOUT YEARS PER INSTRUCTION) ─── */}
            <div className="border-t border-stone-300/80 divide-y divide-stone-300/80">
              {AWARDS.map((award, idx) => (
                <div
                  key={idx}
                  className="py-3.5 sm:py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-6 transition-colors hover:bg-stone-50/80 px-2 rounded-lg"
                >
                  <div className="font-bold text-stone-900 text-sm sm:text-base sm:w-1/2">
                    {award.title}
                  </div>
                  <div className="text-stone-700 text-xs sm:text-sm sm:w-1/2 sm:text-right">
                    {award.subtitle}
                  </div>
                </div>
              ))}
            </div>

            {/* ─── ENDORSEMENTS / PARTNERS STRIP ─── */}
            <div className="pt-2 flex flex-col sm:flex-row sm:items-center gap-3">
              <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider shrink-0">
                Recognized &amp; Felicitated by:
              </span>
              <div className="flex flex-wrap items-center gap-2">
                {ENDORSEMENTS.map((end, i) => (
                  <span
                    key={i}
                    className={`text-[10px] sm:text-[11px] font-extrabold px-2.5 py-1 rounded-md tracking-wider shadow-sm uppercase ${end.color}`}
                  >
                    {end.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ─── PREVIOUS MENTOR UI (COMMENTED OUT AS PER USER INSTRUCTION) ───────── */}
      {/* ========================================================================= */}
      {/*
      <div className="nav-width relative">
        <div className="coach-rise mx-auto max-w-3xl text-center">
          <p className="inline-flex items-center justify-center gap-2 text-[11px] font-semibold tracking-[0.22em] uppercase" style={{ color: ACCENT }}>
            <Sparkles size={13} />
            Proven Track Record &amp; Coaching
          </p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-stone-950 sm:text-4xl lg:text-5xl">
            Meet Vrajangna — Your Resin Art &amp; <span className="whitespace-nowrap" style={{ color: ACCENT }}>Business Coach</span>
          </h2>
        </div>

        <div className="coach-rise mt-10 grid grid-cols-1 items-stretch gap-4 sm:mt-12 lg:grid-cols-[minmax(16.5rem,21rem)_1fr] lg:gap-5">
          <figure className="group relative m-0 h-[26rem] overflow-hidden rounded-[1.75rem] shadow-[0_24px_50px_-36px_rgba(140,60,20,0.55)] sm:h-[30rem] lg:h-auto lg:min-h-full">
            <img
              src="/images/mentor/vrajangna-portrait.jpg"
              alt="Vrajangna Patel - Resin Art & Business Coach"
              className="coach-photo absolute inset-0 h-full w-full object-cover object-[center_18%]"
            />
            <figcaption className="absolute inset-x-3 bottom-3 rounded-2xl bg-white px-3.5 py-3 text-stone-950 shadow-[0_12px_30px_-16px_rgba(20,10,5,0.45)] sm:inset-x-4 sm:bottom-4">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <div className="truncate text-base font-bold text-stone-950">Vrajangna Patel</div>
                    <ShieldCheck size={15} className="shrink-0" style={{ color: ACCENT }} />
                  </div>
                  <div className="mt-0.5 text-[12px] font-medium text-stone-500">Founder &amp; Resin Art Business Coach</div>
                </div>
                <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[#fff1e8] px-2.5 py-1 text-[10px] font-bold tracking-wide uppercase" style={{ color: ACCENT }}>
                  <Star size={11} className="fill-current" />
                  Mentor
                </span>
              </div>
            </figcaption>
          </figure>

          <div className="flex flex-col rounded-[1.75rem] border border-[#f3d3bf] bg-white px-5 py-6 shadow-[0_24px_50px_-36px_rgba(140,60,20,0.35)] sm:px-7 sm:py-7 lg:px-8 lg:py-8">
            <blockquote>
              <p
                className="text-[1.15rem] leading-snug text-stone-800 sm:text-[1.35rem]"
                style={{ fontFamily: '"Iowan Old Style", Palatino, "Palatino Linotype", Georgia, serif' }}
              >
                “ Every woman deserves the opportunity to create an identity beyond the roles she plays for everyone else.
              </p>
              <cite className="mt-3 block text-[12px] font-semibold not-italic" style={{ color: ACCENT }}>
                — Vrajangna Patel, Lead Mentor
              </cite>
            </blockquote>

            <div className="mt-5 space-y-3 text-sm leading-relaxed text-stone-600 sm:text-[15px]">
              <p>
                I&apos;m Vrajangna Patel, founder of Ravishing Art Hub and a dedicated Resin Art Business Coach. Over the past 6+ years, I&apos;ve transformed my passion for resin craft into an award-winning creative enterprise — and guided over <strong className="font-semibold text-stone-950">54,000+ creators</strong> across India and abroad.
              </p>
              <p>
                My goal isn&apos;t just to teach you how to make Resin Art. My goal is to help you believe that your creativity can become something meaningful, valuable and truly yours — whether you want to start a side-income or build a recognized premium brand.
              </p>
            </div>

            <ul className="mt-5 grid grid-cols-1 gap-x-6 gap-y-2.5 sm:grid-cols-2">
              {FEATURES.map((feature) => (
                <li key={feature.label} className="flex items-center gap-2.5">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#fff1e8]" style={{ color: ACCENT }}>
                    <feature.icon size={15} strokeWidth={1.8} />
                  </span>
                  <span className="text-[13px] leading-snug font-medium text-stone-700">{feature.label}</span>
                </li>
              ))}
            </ul>

            <div className="mt-6 flex flex-col gap-4 border-t border-[#f6e4d6] pt-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="grid flex-1 grid-cols-3 gap-2 sm:max-w-sm">
                {STATS.map((stat) => (
                  <div key={stat.label}>
                    <div className="text-lg font-bold tracking-tight text-stone-950 sm:text-xl">{stat.value}</div>
                    <div className="text-[10px] font-medium tracking-wide text-stone-500 uppercase">{stat.label}</div>
                  </div>
                ))}
              </div>
              <Link
                href="/webinar"
                className="group inline-flex shrink-0 items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-bold text-white shadow-[0_14px_28px_-16px_rgba(227,107,50,0.95)] transition-transform duration-300 hover:-translate-y-0.5 active:translate-y-0"
                style={{ backgroundColor: ACCENT }}
              >
                <Play size={14} className="fill-white" />
                <span>Join Live Masterclass</span>
                <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>

        <ol className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
          {ACCOLADES.map((item, index) => (
            <li key={item.title} className="h-full">
              <article
                className="coach-rise group grid h-full grid-cols-1 overflow-hidden rounded-[1.5rem] border border-[#f3d3bf] bg-white shadow-[0_16px_36px_-28px_rgba(120,60,20,0.4)] transition-shadow duration-300 hover:shadow-[0_20px_36px_-22px_rgba(160,70,20,0.35)] sm:grid-cols-[10.5rem_1fr]"
              >
                <div className="relative h-56 overflow-hidden sm:h-auto sm:min-h-[12.5rem]">
                  <img src={item.image} alt={item.alt} className={`coach-photo absolute inset-0 h-full w-full object-cover ${item.position}`} />
                  <span className="absolute top-3 left-3 inline-flex h-7 min-w-7 items-center justify-center rounded-full bg-white px-2 text-[11px] font-bold text-stone-800 shadow-sm">
                    0{index + 1}
                  </span>
                </div>
                <div className="flex flex-1 flex-col justify-center p-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-wide uppercase" style={{ color: ACCENT }}>
                      <item.icon size={13} />
                      {item.badge}
                    </span>
                    <span className="rounded-full bg-[#fff1e8] px-2.5 py-0.5 text-[11px] font-semibold text-stone-600">{item.tag}</span>
                  </div>
                  <h3 className="mt-2 text-lg font-bold leading-snug text-stone-950">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-stone-500">{item.text}</p>
                </div>
              </article>
            </li>
          ))}
        </ol>
      </div>
      */}
    </section>
  );
}

