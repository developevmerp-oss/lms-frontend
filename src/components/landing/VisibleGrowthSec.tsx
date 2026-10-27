"use client";

import React, { useEffect, useRef, useState } from "react";
import { BookOpen, Brush, CheckCircle2, ChevronLeft, ChevronRight, Flag, Gift, Sparkles, Trophy } from "lucide-react";

interface GrowthStep {
  number: string;
  phase: string;
  titlePrimary: string;
  titleAccent: string;
  description: string;
  tags: string[];
  image: string;
  alt: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

const STEPS: GrowthStep[] = [
  {
    number: "01",
    phase: "PHASE 01 · FOUNDATIONS",
    titlePrimary: "Learn",
    titleAccent: "Explore",
    description:
      "Explore techniques at your own pace.",
    tags: ["Foundations", "Techniques", "Video Modules", "Safety Protocols"],
    image: "/images/growth/growth-step-1.png",
    alt: "Resin Art Learning and Techniques",
    icon: BookOpen,
  },
  {
    number: "02",
    phase: "PHASE 02 · CREATION",
    titlePrimary: "Create",
    titleAccent: "Practice",
    description:
      "Practice and bring your ideas to life.",
    tags: ["Hands-on Pours", "Pigments & Flow", "Geode Textures", "Color Theory"],
    image: "/images/growth/growth-step-2.png",
    alt: "Hands-on Resin Art Creation",
    icon: Brush,
  },
  {
    number: "03",
    phase: "PHASE 03 · COMPLETION",
    titlePrimary: "Complete",
    titleAccent: "Refine",
    description:
      "Finish projects and challenges.",
    tags: ["Guided Projects", "Quality Check", "Personal Critique", "Portfolio Ready"],
    image: "/images/growth/growth-step-3.png",
    alt: "Project Completion and Portfolio",
    icon: CheckCircle2,
  },
  {
    number: "04",
    phase: "PHASE 04 · RECOGNITION",
    titlePrimary: "Earn",
    titleAccent: "Celebrate",
    description:
      "Get rewarded for your progres.",
    tags: ["Gamified Points", "Milestones", "Accredited Certificate", "Community Honors"],
    image: "/images/growth/growth-step-4.png",
    alt: "Milestone Rewards and Recognition",
    icon: Gift,
  },
  {
    number: "05",
    phase: "PHASE 05 · MILESTONES",
    titlePrimary: "Unlock Milestones",
    titleAccent: "Milestones",
    description:
      "Reach new levels and opportunities.",
    tags: ["Level Progression", "Milestone Badges", "New Opportunities", "Skills Unlock"],
    image: "/images/growth/growth-step-5.png",
    alt: "Unlock Milestones and Opportunities",
    icon: Flag,
  },
  {
    number: "06",
    phase: "PHASE 06 · RECOGNITION",
    titlePrimary: "Earn Recognition",
    titleAccent: "Recognition",
    description:
      "Showcase your journey and be proud of how far you've come.",
    tags: ["Showcase Art", "Hall of Fame", "Accredited Honors", "Community Pride"],
    image: "/images/growth/growth-step-6.png",
    alt: "Earn Recognition and Honors",
    icon: Trophy,
  },
];

export default function VisibleGrowthSec() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [activeStep, setActiveStep] = useState(0);

  // Smooth scroll progress listener for sticky desktop timeline
  useEffect(() => {
    let frameId: number;

    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const travel = containerRef.current.offsetHeight - window.innerHeight;

      if (travel <= 0) return;

      const scrolled = -rect.top;
      const rawProgress = Math.min(Math.max(scrolled / travel, 0), 1);

      setProgress(rawProgress);

      // Determine active step index
      const stepIndex = Math.min(
        Math.floor(rawProgress * STEPS.length),
        STEPS.length - 1
      );
      setActiveStep(stepIndex);
    };

    const onScroll = () => {
      cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(handleScroll);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    handleScroll();

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // Smooth jump to clicked step
  const scrollToStep = (index: number) => {
    if (!containerRef.current) return;
    const containerTop = containerRef.current.getBoundingClientRect().top + window.scrollY;
    const travel = containerRef.current.offsetHeight - window.innerHeight;
    const targetScroll = containerTop + (index / (STEPS.length - 1)) * travel;

    window.scrollTo({
      top: targetScroll,
      behavior: "smooth",
    });
  };

  const current = STEPS[activeStep];

  // ─── GEOMETRY FOR THE HALF-CIRCLE ROTATING ARC (ANCHORED TO SCREEN LEFT EDGE) ───
  // Center is off-screen to the left (-220px) so only the right crescent (half-circle) is visible on screen!
  // At angle 0, apex is at x = -220 + 420 = 200px from the left edge.
  const cx = -350;
  const cy = 290;
  const radius = 420;
  const angleStepDeg = 24; // spacing between node centers in degrees

  // Continuous rotation angle dynamically calculated based on STEPS.length
  // Brings each step to the active apex and completes rotation when the last step is reached
  const maxRotationProgress = STEPS.length > 1 ? (STEPS.length - 1) / STEPS.length : 1;
  const rotationRatio = maxRotationProgress > 0
    ? Math.min(progress / maxRotationProgress, 1)
    : 0;
  const continuousRotationDeg = rotationRatio * (STEPS.length - 1) * angleStepDeg;

  return (
    <section
      id="growth"
      className="relative z-20 text-stone-900 overflow-x-clip overflow-y-visible"
      style={{
        backgroundColor: "#ffffff",
        backgroundImage: "radial-gradient(circle, #e2ded4 1.5px, transparent 1.5px)",
        backgroundSize: "24px 24px",
        backgroundAttachment: "fixed",
      }}
    >
      {/* ─── TOP CLOUDY WAVE (MATCHING MENTOR SECTION TOP) ─── */}
      <div
        className="growth-cloud-wave-top absolute -top-[27px] sm:-top-[31px] left-0 right-0 w-full h-[28px] sm:h-[32px] pointer-events-none z-20"
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
          filter: "drop-shadow(0 -3px 4px rgba(0, 0, 0, 0.03))",
        }}
        aria-hidden="true"
      />

      {/* ========================================================================= */}
      {/* ─── DESKTOP VIEW: STICKY INTERACTIVE HALF-CIRCLE ARC (LG+) ────────────── */}
      {/* ========================================================================= */}
      <div
        ref={containerRef}
        className="hidden lg:block relative w-full"
        style={{ height: `${STEPS.length * 65 + 40}vh` }}
      >
        <div
          className="growth-sticky-stage sticky top-0 h-screen w-full flex flex-col justify-between py-10 lg:py-12 overflow-hidden select-none"
          style={{
            backgroundColor: "#ffffff",
            backgroundImage: "radial-gradient(circle, #e2ded4 1.5px, transparent 1.5px)",
            backgroundSize: "24px 24px",
            backgroundAttachment: "fixed",
          }}
        >
          {/* ─── TOP: SECTION TITLE & SUBTITLE (PINNED IN STICKY STAGE) ─── */}
          <div className="pt-2 text-center px-4 max-w-4xl mx-auto relative z-10 shrink-0">
            <div className="inline-flex items-center justify-center gap-3 text-[11px] font-bold uppercase tracking-[0.25em] text-[#df5522]">
              <span className="h-px w-8 bg-[#df5522]/40" />
              <Sparkles size={13} className="text-[#df5522]" />
              Gamified Progress Tracking
              <span className="h-px w-8 bg-[#df5522]/40" />
            </div>

            <h2 className="mt-2.5 font-serif text-3xl sm:text-4xl lg:text-[46px] font-medium tracking-tight text-stone-950">
              Your Growth{" "}
              <span className="italic font-normal text-[#df5522]">Should Be</span>{" "}
              Visible.
            </h2>

            <p className="mt-2 max-w-2xl mx-auto text-xs sm:text-sm leading-relaxed text-stone-600">
              Every creation, challenge, milestone and achievement should tell a story of how far you&apos;ve come.
              Instead of wondering whether you&apos;re progressing, you&apos;ll have tangible milestones that help you
              see, measure and celebrate your growth.
            </p>
          </div>

          {/* ─── MAIN STAGE ROW: HALF CIRCLE (LEFT) + CONTENT + 3D IMAGE (WITH MORE GAP) ─── */}
          <div className="relative w-full max-w-[1440px] mx-auto px-6 lg:px-12 xl:px-16 flex-1 flex items-center justify-between min-h-[500px]">
            {/* ─── LEFT: HALF CIRCLE ROTATING ARC & NUMBERED NODES (ANCHORED TO LEFT) ─── */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[240px] h-[580px] pointer-events-none select-none z-20 overflow-visible">
              {/* Background Arc Curve Line (SVG) - Half Circle extending from screen left */}
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
                viewBox="0 0 240 580"
              >
                {/* Outer decorative dashed path */}
                <circle
                  cx={cx}
                  cy={cy}
                  r={radius}
                  fill="none"
                  stroke="#fed7aa"
                  strokeWidth="2"
                  strokeDasharray="5 5"
                  opacity="0.6"
                />
                {/* Main smooth guide arc */}
                <circle
                  cx={cx}
                  cy={cy}
                  r={radius}
                  fill="none"
                  stroke="#fed7aa"
                  strokeWidth="1.8"
                />
              </svg>

              {/* Numbered Nodes Placed along the Half-Circle Arc */}
              {STEPS.map((step, idx) => {
                const baseAngleDeg = idx * angleStepDeg;
                const currentAngleDeg = baseAngleDeg - continuousRotationDeg;
                const currentAngleRad = (currentAngleDeg * Math.PI) / 180;

                // Node (x, y) coordinates relative to arc container (rounded to 2 decimals to match SSR and client)
                const nodeX = Number((cx + radius * Math.cos(currentAngleRad)).toFixed(2));
                const nodeY = Number((cy - radius * Math.sin(currentAngleRad)).toFixed(2));

                const isActive = activeStep === idx;
                const isPassed = activeStep > idx;

                return (
                  <button
                    key={step.number}
                    type="button"
                    suppressHydrationWarning
                    onClick={() => scrollToStep(idx)}
                    className="absolute group transition-transform duration-300 focus:outline-none pointer-events-auto"
                    style={{
                      left: `${nodeX}px`,
                      top: `${nodeY}px`,
                      transform: "translate(-50%, -50%)",
                      zIndex: isActive ? 35 : 25,
                    }}
                    aria-label={`Jump to ${step.phase}`}
                  >
                    {isActive ? (
                      /* Active Node: Glowing Orange Filled Circle */
                      <div className="relative flex items-center justify-center">
                        <div className="absolute -inset-2.5 rounded-full bg-[#df5522]/20 animate-pulse pointer-events-none" />
                        <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#c4431d] via-[#df5522] to-[#ea580c] text-white font-serif font-bold text-lg flex items-center justify-center shadow-[0_10px_24px_rgba(223,85,34,0.45)] ring-4 ring-white transition-all duration-300">
                          {step.number}
                        </div>
                      </div>
                    ) : isPassed ? (
                      /* Passed Node: Completed orange accent */
                      <div className="w-11 h-11 rounded-full border-2 border-[#df5522] text-[#df5522] font-serif font-bold text-xs flex items-center justify-center shadow-xs hover:scale-110 transition-all duration-200 bg-white">
                        {step.number}
                      </div>
                    ) : (
                      /* Upcoming Node: Subtle soft ring with number */
                      <div className="w-11 h-11 rounded-full border border-stone-300 bg-white/95 text-stone-700 font-serif font-semibold text-xs flex items-center justify-center shadow-xs hover:border-[#df5522] hover:text-[#df5522] hover:scale-105 transition-all duration-200">
                        {step.number}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* ─── CENTER-LEFT: PHASE TITLE, DESCRIPTION & TAG PILLS ─── */}
            <div className="z-10 w-full  ml-[240px] lg:ml-[200px] xl:ml-[200px]">
              <div
                key={`text-${activeStep}`}
                className="transition-all duration-500 ease-out animate-fadeIn"
              >
                {/* Overline Phase Tag */}
                <span className="text-xs font-bold tracking-[0.22em] text-[#df5522] uppercase block mb-2.5">
                  {current.phase}
                </span>

                {/* Main Large Display Title */}
                <h3 className="font-serif text-3xl sm:text-4xl lg:text-[46px] font-medium leading-[1.1] tracking-tight text-stone-900 mb-4">
                  <span>{current.titlePrimary} </span>
                  {/* <span className="text-[#df5522] italic font-normal">
                    {current.titleAccent}
                  </span> */}
                </h3>

                {/* Description */}
                <p className="text-stone-600 text-sm lg:text-[15px] leading-relaxed mb-6 max-w-md">
                  {current.description}
                </p>

                {/* Tag Pills */}
                {/* <div className="flex flex-wrap items-center gap-2">
                  {current.tags.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="px-3 py-1 rounded-full border border-stone-200/90 bg-white text-xs font-medium text-stone-700 tracking-wide shadow-2xs hover:border-[#df5522]/40 transition-colors"
                    >
                      {tag}
                    </span>
                  ))}
                </div> */}

                {/* Interactive Clickable Stepper Indicator */}
                {/* <div className="mt-7 flex items-center gap-2">
                  {STEPS.map((s, i) => (
                    <button
                      key={s.number}
                      onClick={() => scrollToStep(i)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${activeStep === i
                          ? "w-8 bg-[#df5522]"
                          : "w-2 bg-stone-300 hover:bg-stone-400"
                        }`}
                      aria-label={`Go to step ${s.number}`}
                    />
                  ))}
                  <span className="text-xs font-semibold text-stone-500 ml-2">
                    0{activeStep + 1} / 0{STEPS.length}
                  </span>
                </div> */}
              </div>
            </div>

            {/* ─── RIGHT: 3D ILLUSTRATION WITH GENEROUS GAP FROM CONTENT ─── */}
            <div className="z-10 w-[360px] lg:w-[420px] xl:w-[500px] h-[500px] shrink-0 flex items-center justify-center relative select-none mr-2 lg:mr-10 xl:-mr-20 ml-auto">
              {/* Soft Ambient Radial Glow Behind 3D Graphic */}
              <div className="absolute w-72 h-72 rounded-full bg-[#df5522]/12 blur-3xl pointer-events-none" />

              {STEPS.map((step, idx) => {
                const isCurrent = activeStep === idx;
                return (
                  <div
                    key={step.number}
                    className={`absolute inset-0 flex items-center justify-center transition-all duration-600 ease-out ${isCurrent
                      ? "opacity-100 scale-100 pointer-events-auto"
                      : "opacity-0 scale-95 pointer-events-none"
                      }`}
                  >
                    <img
                      src={step.image}
                      alt={step.alt}
                      className="max-h-[360px] max-w-[420px] w-auto h-auto object-contain drop-shadow-[0_20px_30px_rgba(223,85,34,0.18)] transition-transform duration-700"
                    // style={{
                    //   animation: isCurrent ? "growth-float 6s ease-in-out infinite" : "none",
                    // }}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom subtle spacing */}
          <div className="h-2 shrink-0" />
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ─── TABLET & MOBILE VIEW: CLEAN INTERACTIVE STEPPER (< LG) ────────────── */}
      {/* ========================================================================= */}
      <div className="lg:hidden px-4 pb-20 max-w-xl mx-auto relative z-10">
        {/* Step Tabs Row */}
        <div className="grid grid-cols-6 gap-1.5 mb-8 bg-stone-100/90 p-1.5 rounded-2xl">
          {STEPS.map((step, idx) => {
            const isTabActive = activeStep === idx;
            return (
              <button
                key={step.number}
                type="button"
                onClick={() => setActiveStep(idx)}
                className={`py-2 px-1 rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center gap-0.5 ${isTabActive
                  ? "bg-white text-[#df5522] shadow-sm font-black"
                  : "text-stone-600 hover:text-stone-900"
                  }`}
              >
                <span>{step.number}</span>
                <span className="text-[10px] truncate max-w-full font-medium">
                  {step.titlePrimary.replace("&", "").trim()}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active Step Content Card */}
        <div className="bg-white border border-stone-200/80 rounded-3xl p-6 sm:p-8 shadow-sm text-center flex flex-col items-center">
          {/* 3D Image */}
          <div className="w-full max-w-[280px] aspect-square flex items-center justify-center mb-6">
            <img
              src={current.image}
              alt={current.alt}
              className="max-h-[240px] w-auto object-contain drop-shadow-[0_15px_25px_rgba(223,85,34,0.18)]"
            />
          </div>

          <span className="text-xs font-bold tracking-widest text-[#df5522] uppercase mb-2">
            {current.phase}
          </span>

          <h3 className="font-serif text-3xl font-medium text-stone-950 mb-3">
            {current.titlePrimary}{" "}
            <span className="text-[#df5522] italic">{current.titleAccent}</span>
          </h3>

          <p className="text-stone-600 text-sm leading-relaxed mb-5">
            {current.description}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
            {current.tags.map((tag, tIdx) => (
              <span
                key={tIdx}
                className="px-3 py-1 rounded-full border border-stone-200 bg-stone-50 text-xs font-medium text-stone-700"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Prev / Next controls */}
          <div className="flex items-center justify-between w-full pt-4 border-t border-stone-200">
            <button
              type="button"
              onClick={() => setActiveStep((prev) => Math.max(prev - 1, 0))}
              disabled={activeStep === 0}
              className="inline-flex items-center gap-1 text-xs font-bold text-stone-700 disabled:opacity-30 hover:text-[#df5522]"
            >
              <ChevronLeft size={16} /> Prev
            </button>
            <span className="text-xs font-semibold text-stone-500">
              {activeStep + 1} of {STEPS.length}
            </span>
            <button
              type="button"
              onClick={() => setActiveStep((prev) => Math.min(prev + 1, STEPS.length - 1))}
              disabled={activeStep === STEPS.length - 1}
              className="inline-flex items-center gap-1 text-xs font-bold text-stone-700 disabled:opacity-30 hover:text-[#df5522]"
            >
              Next <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
