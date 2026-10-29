"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  Flame,
  CheckCircle2,
  Lightbulb,
  Trophy,
  BarChart3,
  Clock,
  Camera,
  Target,
  Share2,
  Flag,
  Palette,
  Compass,
  Rocket,
  ShieldCheck,
  Heart,
  Briefcase,
  Smile,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Brush,
  Users,
  Image as ImageIcon,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// ─── 8-WEEK ROADMAP DATA (EXTRACTED DIRECTLY FROM REFERENCE UI) ───
interface RoadmapWeek {
  week: number;
  days: string;
  title: string;
  themeColor: string;
  badgeBg: string;
  badgeText: string;
  borderColor: string;
  lightBg: string;
  pillBg: string;
  pillText: string;
  bullets: string[];
  outcome: string;
  outcomeIcon: React.ComponentType<{ className?: string }>;
  yOffset: string; // Stagger: odd up, even down
}

const ROADMAP_WEEKS: RoadmapWeek[] = [
  {
    week: 1,
    days: "Days 1–7",
    title: "Start with Clarity",
    themeColor: "#e11d48", // Rose
    badgeBg: "bg-rose-500",
    badgeText: "text-rose-600",
    borderColor: "border-rose-200 hover:border-rose-400",
    lightBg: "bg-rose-50/70",
    pillBg: "bg-rose-100",
    pillText: "text-rose-700",
    bullets: [
      "Understand what resin art is and the opportunities",
      "Learn about tools, materials and safe working practices",
      "Set up your workspace",
      "Build the right mindset to stay consistent",
    ],
    outcome:
      "By the end of this week, you will feel confident to begin your resin journey and know exactly how to start.",
    outcomeIcon: Lightbulb,
    yOffset: "lg:-translate-y-4", // Higher
  },
  {
    week: 2,
    days: "Days 8–14",
    title: "Build Your Confidence",
    themeColor: "#ea580c", // Warm Orange
    badgeBg: "bg-orange-500",
    badgeText: "text-orange-600",
    borderColor: "border-orange-200 hover:border-orange-400",
    lightBg: "bg-orange-50/70",
    pillBg: "bg-orange-100",
    pillText: "text-orange-700",
    bullets: [
      "Learn basic techniques",
      "Practise with guided exercises",
      "Get comfortable with the process",
      "Join the community and share your first creation",
    ],
    outcome:
      "By the end of this week, you will have created your first resin piece and feel more confident in your skills.",
    outcomeIcon: Trophy,
    yOffset: "lg:translate-y-6", // Lower
  },
  {
    week: 3,
    days: "Days 15–21",
    title: "Develop Your Skills",
    themeColor: "#7c3aed", // Purple
    badgeBg: "bg-purple-600",
    badgeText: "text-purple-600",
    borderColor: "border-purple-200 hover:border-purple-400",
    lightBg: "bg-purple-50/70",
    pillBg: "bg-purple-100",
    pillText: "text-purple-700",
    bullets: [
      "Learn new techniques and improve your finishing",
      "Understand colour combinations and design principles",
      "Get expert feedback",
      "Overcome common mistakes with the Resin Rescue Clinic",
    ],
    outcome:
      "By the end of this week, you will be able to create better quality pieces and see visible improvement in your work.",
    outcomeIcon: BarChart3,
    yOffset: "lg:-translate-y-4", // Higher
  },
  {
    week: 4,
    days: "Days 22–30",
    title: "Find Your Creative Style",
    themeColor: "#059669", // Emerald / Jade
    badgeBg: "bg-emerald-600",
    badgeText: "text-emerald-600",
    borderColor: "border-emerald-200 hover:border-emerald-400",
    lightBg: "bg-emerald-50/70",
    pillBg: "bg-emerald-100",
    pillText: "text-emerald-700",
    bullets: [
      "Experiment with different styles and finishes",
      "Explore what you enjoy creating",
      "Identify your unique colour palette and preferences",
      "Start building a small collection of your work",
    ],
    outcome:
      "By the end of this week, you will have a clearer idea of your creative style and the kind of products you love to create.",
    outcomeIcon: Clock,
    yOffset: "lg:translate-y-6", // Lower
  },
  {
    week: 5,
    days: "Days 31–37",
    title: "Create Your Portfolio",
    themeColor: "#6366f1", // Indigo
    badgeBg: "bg-indigo-600",
    badgeText: "text-indigo-600",
    borderColor: "border-indigo-200 hover:border-indigo-400",
    lightBg: "bg-indigo-50/70",
    pillBg: "bg-indigo-100",
    pillText: "text-indigo-700",
    bullets: [
      "Focus on creating your best pieces",
      "Learn finishing and presentation tips",
      "Understand how to photograph your work",
      "Build a simple portfolio of your creations",
    ],
    outcome:
      "By the end of this week, you will have a set of quality photos and a portfolio to showcase your work.",
    outcomeIcon: Camera,
    yOffset: "lg:-translate-y-4", // Higher
  },
  {
    week: 6,
    days: "Days 38–45",
    title: "Build Your Brand Identity",
    themeColor: "#0284c7", // Sky Blue
    badgeBg: "bg-sky-600",
    badgeText: "text-sky-600",
    borderColor: "border-sky-200 hover:border-sky-400",
    lightBg: "bg-sky-50/70",
    pillBg: "bg-sky-100",
    pillText: "text-sky-700",
    bullets: [
      "Choose or refine your brand name",
      "Create your brand story",
      "Learn how to present your work consistently",
      "Understand basic pricing and costing",
      "Get guidance on packaging and presentation",
    ],
    outcome:
      "By the end of this week, you will have the foundation of your creative brand and know how to price your work with confidence.",
    outcomeIcon: Target,
    yOffset: "lg:translate-y-6", // Lower
  },
  {
    week: 7,
    days: "Days 46–52",
    title: "Get Visible Online",
    themeColor: "#e11d48", // Coral / Crimson
    badgeBg: "bg-rose-600",
    badgeText: "text-rose-600",
    borderColor: "border-rose-200 hover:border-rose-400",
    lightBg: "bg-rose-50/70",
    pillBg: "bg-rose-100",
    pillText: "text-rose-700",
    bullets: [
      "Learn how to create engaging content",
      "Understand simple and effective social media strategies",
      "Learn to communicate the value of your work",
      "Practise creating posts and reels with guidance",
    ],
    outcome:
      "By the end of this week, you will be ready to showcase your work online and attract your ideal audience.",
    outcomeIcon: Share2,
    yOffset: "lg:-translate-y-4", // Higher
  },
  {
    week: 8,
    days: "Days 53–60",
    title: "Take Your Next Step",
    themeColor: "#10b981", // Mint / Emerald
    badgeBg: "bg-emerald-600",
    badgeText: "text-emerald-600",
    borderColor: "border-emerald-200 hover:border-emerald-400",
    lightBg: "bg-emerald-50/70",
    pillBg: "bg-emerald-100",
    pillText: "text-emerald-700",
    bullets: [
      "Create a final collection of your best work",
      "Learn how to handle enquiries and present your products",
      "Prepare your action plan for selling or conducting workshops",
      "Celebrate your journey and set your next goals",
    ],
    outcome:
      "By the end of this week, you will be ready to take your next step as a confident resin artist — with a portfolio, a brand foundation and a plan.",
    outcomeIcon: Flag,
    yOffset: "lg:translate-y-6", // Lower
  },
];

// ─── BOTTOM SUMMARY PILLARS ───
const SUMMARY_PILLARS = [
  {
    title: "Practical Resin Skills",
    subtitle: "you can use with confidence",
    icon: Brush,
    iconColor: "text-rose-600",
    bg: "bg-rose-50",
  },
  {
    title: "A Portfolio",
    subtitle: "of beautiful creations",
    icon: ImageIcon,
    iconColor: "text-amber-600",
    bg: "bg-amber-50",
  },
  {
    title: "A Unique Creative Identity",
    subtitle: "and brand foundation",
    icon: Sparkles,
    iconColor: "text-purple-600",
    bg: "bg-purple-50",
  },
  {
    title: "Marketing Readiness",
    subtitle: "to showcase your work online",
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

export default function ArtOThonSec({ sprintImages }: { sprintImages?: string[] }) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const cardsPinWrapperRef = useRef<HTMLDivElement | null>(null);
  const trackContainerRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  // ─── GSAP HORIZONTAL SCROLL TRIGGER ───
  useEffect(() => {
    if (typeof window === "undefined") return;

    gsap.registerPlugin(ScrollTrigger);

    const cardsWrapper = cardsPinWrapperRef.current;
    const track = trackRef.current;
    if (!cardsWrapper || !track) return;

    // Only apply horizontal scroll on desktop/tablet where pinning feels natural
    const mm = gsap.matchMedia();

    mm.add("(min-width: 1024px)", () => {
      const getScrollAmount = () => {
        const cards = track.querySelectorAll(".roadmap-card");
        if (!cards.length) return 2600;
        const firstCard = cards[0] as HTMLElement;
        const lastCard = cards[cards.length - 1] as HTMLElement;

        // Total distance from first card to last card right edge
        const totalSpan = (lastCard.offsetLeft + lastCard.offsetWidth) - firstCard.offsetLeft;

        // Target: Week 8 right edge ends at least 260px inside the right screen edge
        const availableWidth = window.innerWidth - firstCard.offsetLeft;
        const needed = totalSpan - availableWidth + 260;
        return Math.max(0, needed);
      };

      const pauseDistance = 600; // Extra scroll distance to hold the section sticky while viewing the last card

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: cardsWrapper,
          start: "top 70px",
          end: () => `+=${getScrollAmount() + pauseDistance}`,
          pin: true,
          scrub: 0.8, // Smooth scrub without stutter or lag
          invalidateOnRefresh: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            setScrollProgress(Math.round(self.progress * 100));
          },
        },
      });

      // Phase 1: Translate track horizontally so Week 8 comes 100% into view
      tl.to(track, {
        x: () => -getScrollAmount(),
        ease: "none",
        duration: 1,
      });

      // Phase 2: Hold section sticky so the user can comfortably see and read the last card
      tl.to({}, { duration: 0.35 });

      return () => {
        tl.kill();
      };
    });

    return () => {
      mm.revert();
    };
  }, []);

  // Manual scroll buttons for tablet / mobile fallback (snaps 1 card at a time)
  const scrollTrack = (direction: "left" | "right") => {
    if (!trackContainerRef.current) return;
    const container = trackContainerRef.current;
    const card = container.querySelector(".roadmap-card") as HTMLElement;
    const step = card ? card.offsetWidth + 16 : 320;
    container.scrollBy({ left: direction === "left" ? -step : step, behavior: "smooth" });
  };

  return (
    <section
      ref={sectionRef}
      id="artothon"
      className="artothon-sec relative z-20 py-16 sm:py-20 lg:py-24 text-neutral-950 overflow-hidden"
      style={{
        backgroundColor: "#ffffff",
        backgroundImage: "radial-gradient(circle, #e2ded4 1.5px, transparent 1.5px)",
        backgroundSize: "24px 24px",
        backgroundAttachment: "fixed",
      }}
    >
      {/* ─── TOP CLOUDY WAVE (PRESERVED) ─── */}
      <div
        className="artothon-cloud-wave-top absolute -top-[27px] sm:-top-[31px] left-0 right-0 w-full h-[28px] sm:h-[32px] pointer-events-none z-40"
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

      {/* ─── MAIN CONTENT CONTAINER ─── */}
      <div ref={containerRef} className="container mx-auto px-4 sm:px-6 lg:px-10 2xl:px-12">
        {/* ─── HEADER: TITLE, BADGE & INSPIRATIONAL QUOTE ─── */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-10 sm:mb-14">
          <div className="max-w-3xl">
            <p className="flex items-center gap-2 text-xs sm:text-base lg:text-xs font-semibold uppercase tracking-[0.18em] text-[#942008]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#942008]" aria-hidden="true" />
              Action-First Learning • 60-Day Transformation
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-neutral-950 sm:text-5xl lg:text-5xl leading-tight">
              Your 60-Day{" "}
              <span className="text-[#942008] font-serif italic">Transformation</span> Roadmap
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-neutral-600 sm:text-xl lg:text-base">
              A step-by-step journey to become a confident resin artist and build the foundation for your creative business.
            </p>
          </div>

          {/* Inspirational Script Badge + Mobile/Tablet Controls on Far Right */}
          <div className="flex items-center justify-between w-full lg:w-auto gap-4 self-stretch lg:self-end">
            <div className="inline-flex flex-col items-start bg-rose-50/80 border border-rose-200/80 rounded-2xl px-4 sm:px-5 py-2.5 sm:py-3 shadow-sm">
              <span className="text-[11px] sm:text-xs font-black tracking-wider uppercase text-rose-500">
                Don&apos;t Just Learn.
              </span>
              <span className="text-xs sm:text-base font-bold text-rose-800 flex items-center gap-1.5 mt-0.5">
                Create. Grow. Become. ❤️
              </span>
            </div>

            {/* Mobile/Tablet scroll helper controls positioned at the far right end */}
            <div className="flex items-center gap-2.5 lg:hidden ml-auto">
              <button
                type="button"
                onClick={() => scrollTrack("left")}
                className="w-10 h-10 rounded-full bg-white border border-neutral-300 shadow-md flex items-center justify-center text-neutral-800 hover:bg-neutral-50 active:scale-95 transition"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => scrollTrack("right")}
                className="w-10 h-10 rounded-full bg-white border border-neutral-300 shadow-md flex items-center justify-center text-neutral-800 hover:bg-neutral-50 active:scale-95 transition"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* ─── CARDS PIN WRAPPER (DESKTOP PIN TRIGGER) ─── */}
        <div ref={cardsPinWrapperRef} className="cards-pin-wrapper relative py-2">
          {/* ─── HORIZONTAL SCROLL TRACK (8 WEEK ROADMAP CARDS) ─── */}
          <div
            ref={trackContainerRef}
            className="relative overflow-x-auto lg:overflow-visible pb-6 lg:pb-0 scrollbar-none snap-x snap-mandatory scroll-smooth px-8 sm:px-14 lg:px-0"
          >
            <div
              ref={trackRef}
              className="flex items-center gap-4 sm:gap-6 lg:gap-8 will-change-transform pt-4 pb-8 lg:pb-12 pr-12 sm:pr-20 lg:pr-36"
            >
              {ROADMAP_WEEKS.map((item, idx) => {
                const OutcomeIcon = item.outcomeIcon;
                return (
                  <React.Fragment key={item.week}>
                    {/* Individual Week Card */}
                    <div
                      className={`roadmap-card w-[78vw] sm:w-[65vw] max-w-[340px] lg:w-[350px] shrink-0 snap-center bg-white rounded-[24px] border border-neutral-200/90 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between p-5 sm:p-6 lg:p-7 relative group ${item.yOffset} ${item.borderColor}`}
                      style={{
                        minHeight: "490px",
                      }}
                    >
                      {/* Top Row: Week Number Circle + Days Range Pill */}
                      <div>
                        <div className="flex items-center justify-between gap-3 mb-4 sm:mb-5">
                          <div
                            className={`w-9 h-9 rounded-full ${item.badgeBg} text-white font-black text-sm flex items-center justify-center shadow-md`}
                          >
                            {item.week}
                          </div>
                          <span
                            className={`px-3.5 py-1 rounded-full text-xs font-bold tracking-wide ${item.pillBg} ${item.pillText}`}
                          >
                            {item.days}
                          </span>
                        </div>

                        {/* Week Label & Title */}
                        <p className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                          Week {item.week}
                        </p>
                        <h3 className="mt-1 text-base sm:text-lg lg:text-xl font-black text-neutral-900 tracking-tight leading-snug">
                          {item.title}
                        </h3>

                        {/* 4 Detailed Bullets */}
                        <ul className="mt-4 sm:mt-5 space-y-2.5 sm:space-y-3">
                          {item.bullets.map((bullet, bIdx) => (
                            <li key={bIdx} className="flex items-start gap-2.5">
                              <CheckCircle2
                                className={`w-4 h-4 shrink-0 mt-0.5 ${item.badgeText}`}
                              />
                              <span className="text-xs sm:text-sm text-neutral-700 leading-snug font-normal">
                                {bullet}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Bottom Milestone Outcome Box */}
                      <div
                        className={`mt-5 sm:mt-6 rounded-2xl p-3.5 sm:p-4 border border-neutral-200/70 ${item.lightBg} flex items-start gap-3`}
                      >
                        <OutcomeIcon className={`w-5 h-5 shrink-0 mt-0.5 ${item.badgeText}`} />
                        <p className="text-xs font-medium text-neutral-800 leading-relaxed">
                          {item.outcome}
                        </p>
                      </div>
                    </div>

                    {/* Horizontal Connector Arrow (Shown between cards) */}
                    {idx < ROADMAP_WEEKS.length - 1 && (
                      <div className="hidden lg:flex items-center justify-center shrink-0 text-orange-400/80">
                        <ArrowRight className="w-6 h-6 animate-pulse" />
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </div>

        {/* ─── BOTTOM BANNER: BY DAY 60, YOU WILL HAVE... ─── */}
        <div className="mt-8 sm:mt-12 bg-white/95 border border-neutral-200 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-xl backdrop-blur-sm">
          <div className="flex flex-col lg:flex-row lg:items-center gap-8 lg:gap-12">
            {/* Left Header Box */}
            <div className="lg:w-1/4 shrink-0 flex items-center gap-4 border-b lg:border-b-0 lg:border-r border-neutral-200 pb-6 lg:pb-0 lg:pr-8">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#942008] to-orange-600 flex items-center justify-center text-white shadow-lg shrink-0">
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
            <div className="lg:w-3/4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {SUMMARY_PILLARS.map((pillar, pIdx) => {
                const PillarIcon = pillar.icon;
                return (
                  <div
                    key={pIdx}
                    className="flex flex-col items-center text-center p-3 sm:p-4 rounded-2xl hover:bg-neutral-50 transition border border-transparent hover:border-neutral-200"
                  >
                    <div
                      className={`w-11 h-11 rounded-full ${pillar.bg} flex items-center justify-center ${pillar.iconColor} mb-2.5 shadow-sm`}
                    >
                      <PillarIcon className="w-5 h-5" />
                    </div>
                    <p className="text-xs font-bold text-neutral-900 leading-tight">
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
        </div>

        {/* ─── CALL TO ACTION BUTTON ─── */}
        <div className="mt-10 sm:mt-12 text-center">
          <Link
            href="/webinar"
            className="inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 text-xs sm:text-sm font-bold uppercase tracking-wider text-white shadow-lg transition duration-300 hover:scale-105 active:scale-95"
            style={{
              backgroundColor: "#942008",
            }}
          >
            Start Your 60-Day Transformation
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* ─── PREVIOUS ART-O-THON UI (COMMENTED OUT AS REQUESTED) ─── */}
      {/*
      <div className="nav-width page-rise">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-50">
          <div>
            <p className="flex items-center gap-2 text-xs sm:text-base lg:text-xs font-semibold uppercase tracking-[0.18em] text-[#942008]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#942008]" aria-hidden="true" />
              Action-First Learning
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-neutral-950 sm:text-5xl lg:text-5xl">
              ART-O-THON: Don't Just Learn.
              <span className="mt-1 block text-[#942008]">Create.</span>
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-neutral-600 sm:text-xl lg:text-base">
              Learning becomes powerful when you put it into action. ART-O-THON is designed to turn learning into consistent creation through daily challenges, missions and milestone submissions.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-neutral-600 sm:text-xl lg:text-base">
              Every creation becomes a step forward. Every completed challenge becomes proof of your progress. And every milestone gives you another reason to celebrate how far you've come.
            </p>
            <div className="mt-7 flex flex-col gap-5 sm:flex-row sm:items-center">
              <Link
                href="/webinar"
                className="artothon-btn inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3 text-xs font-bold uppercase tracking-wider transition sm:w-auto"
              >
                Join Challenge
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>
          </div>

          <div className="artothon-visual relative mx-auto w-full max-w-[740px] ">
            <span className="artothon-blob artothon-blob-back" aria-hidden="true" />
            <div className="artothon-photo">
              <img
                src="/images/artothon/plate.jpg"
                alt=""
                className="h-full w-full object-cover"
              />
            </div>

            <div className="artothon-float rounded-[1.75rem] p-5 sm:p-6 ">
              <div className="flex items-start justify-between gap-3 ">
                <div className="min-w-0 pr-1">
                  <p className="artothon-kicker text-[10px] font-semibold uppercase tracking-[0.16em]">90-Day</p>
                  <p className="artothon-sprint-title mt-1 text-[1.65rem] font-black leading-[1.05]">Creation Sprint</p>
                  <p className="artothon-copy mt-3 text-xs leading-relaxed">
                    daily challenges, missions and milestone submissions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      */}
      {/* ─── END PREVIOUS ART-O-THON UI ─── */}
    </section>
  );
}
