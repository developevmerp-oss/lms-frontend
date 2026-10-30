"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Brush, CircleCheck, Layers, Palette, TrendingUp } from "lucide-react";

const PILLARS = [
  {
    index: "01",
    title: "Master Resin Art Techniques",
    text: "Understand the fundamentals and advanced techniques required to create beautiful, professional-quality resin artwork—from chemistry and bubble-free mixing to ocean lacing and geode crystal inlays.",
    outcomes: ["Bubble-Free Chemistry", "Ocean Foam & Waves", "Geode Crystal Inlays"],
    icon: Brush,
    image: "/images/student-art/art-8.jpg",
  },
  {
    index: "02",
    title: "Develop Your Signature Style",
    text: "Move beyond copying others and discover the colours, techniques, compositions and products that make your work instantly recognizable in the market.",
    outcomes: ["Color Psychology", "Distinct Compositions", "Signature Identity"],
    icon: Palette,
    image: "/images/student-art/art-13.jpg",
  },
  {
    index: "03",
    title: "Build a Portfolio You Are Proud Of",
    text: "Create meaningful, commercial-grade projects that demonstrate your ability and give you something tangible to showcase to clients, interior designers, and collectors.",
    outcomes: ["Commercial Finishes", "Client Lookbooks", "High-End Packaging"],
    icon: Layers,
    image: "/images/student-art/art-4.jpg",
  },
  {
    index: "04",
    title: "Learn How To Monetize Your Skill",
    text: "Understand how to turn your creations into products, orders, high-ticket custom commissions, workshop opportunities and sustainable monthly income.",
    outcomes: ["Commission Pricing", "Client Acquisition", "Repeat Order Flywheel"],
    icon: TrendingUp,
    image: "/images/student-art/art-19.jpg",
  },
];

export default function CurriculumSec() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.25 });
  const [active, setActive] = useState(0);
  const item = PILLARS[active];
  const ActiveIcon = item.icon;

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % PILLARS.length);
    }, 4000);
    return () => window.clearInterval(timer);
  }, [active]);

  return (
    <section
      id="curriculum"
      ref={sectionRef}
      className="curriculum-sec relative z-20 py-16 text-neutral-950 sm:py-20 lg:py-24 overflow-visible"
      style={{
        backgroundColor: "#ffffff",
        backgroundImage: "radial-gradient(circle, #e2ded4 1.5px, transparent 1.5px)",
        backgroundSize: "24px 24px",
        backgroundAttachment: "fixed",
      }}
    >
      {/* ─── TOP CLOUDY WAVE (MATCHING MENTOR SECTION TOP) ─── */}
      <div
        className="curriculum-cloud-wave-top absolute -top-[27px] sm:-top-[31px] left-0 right-0 w-full h-[28px] sm:h-[32px] pointer-events-none z-40"
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
      <div className="nav-width">
        <motion.div
          className="mx-auto max-w-3xl text-center"
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <p className="text-xs sm:text-base lg:text-xs font-semibold uppercase tracking-[0.18em] text-[#942008]">
            Curriculum + Outcomes
          </p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-neutral-950 sm:text-5xl lg:text-5xl">
            What You'll Learn + <span className="text-[#942008]">What You'll Create</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-neutral-600 sm:text-xl lg:text-base">
            This isn't just about watching lessons. You'll learn the techniques, practice them through real creations and gradually build a portfolio that demonstrates your growth.
          </p>
        </motion.div>

        <div className="curriculum-stage mt-10 grid items-center gap-8 sm:mt-12 lg:mt-16 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-6">
          <div className="order-2 min-w-0 lg:order-1 grid grid-cols-1 grid-rows-1">
            {PILLARS.map((pillar, index) => {
              const isCurrent = index === active;
              const PillarIcon = pillar.icon;
              return (
                <div
                  key={pillar.title}
                  className={`col-start-1 row-start-1 flex flex-col justify-center transition-all duration-500 ease-out ${isCurrent
                      ? "opacity-100 translate-y-0 pointer-events-auto z-10"
                      : "opacity-0 translate-y-1 pointer-events-none z-0 invisible"
                    }`}
                  aria-hidden={!isCurrent}
                >
                  <p className="curriculum-index text-xs sm:text-base lg:text-xs font-semibold tracking-[0.16em]">
                    {pillar.index}
                  </p>
                  <div className="mt-3 flex items-start gap-3">
                    <span className="curriculum-panel-icon mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl">
                      <PillarIcon size={18} aria-hidden="true" />
                    </span>
                    <h3 className="curriculum-title text-2xl font-bold leading-snug sm:text-3xl text-neutral-950">
                      {pillar.title}
                    </h3>
                  </div>
                  <p className="curriculum-copy mt-3 text-sm leading-relaxed sm:text-lg lg:text-base text-neutral-600">
                    {pillar.text}
                  </p>
                  <ul className="mt-6 grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
                    {pillar.outcomes.map((outcome) => (
                      <li key={outcome} className="curriculum-outcome flex items-center gap-2.5 text-sm sm:text-lg lg:text-sm text-neutral-800">
                        <CircleCheck size={18} aria-hidden="true" className="curriculum-check shrink-0 text-[#942008]" />
                        <span>{outcome}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          <div className="curriculum-cover order-1 lg:order-2" aria-hidden="false">
            {PILLARS.map((pillar, index) => {
              let diff = index - active;
              if (diff > PILLARS.length / 2) diff -= PILLARS.length;
              if (diff < -PILLARS.length / 2) diff += PILLARS.length;
              const distance = Math.abs(diff);
              return (
                <button
                  key={pillar.title}
                  type="button"
                  onClick={() => setActive(index)}
                  aria-label={pillar.title}
                  className="curriculum-slide"
                  style={{
                    transform: `translate(-50%, -50%) translateX(${diff * 52}%) scale(${diff === 0 ? 1 : 0.82}) rotateY(${diff * -28}deg)`,
                    zIndex: 10 - distance,
                    opacity: distance > 1 ? 0 : 1,
                    pointerEvents: distance > 1 ? "none" : "auto",
                  }}
                >
                  <img src={pillar.image} alt="" className="h-full w-full object-cover" />
                  <span className="curriculum-slide-label">{pillar.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/*
        <div className="mt-10 flex flex-col gap-6 sm:mt-12 lg:mt-16 lg:flex-row lg:items-stretch lg:gap-0">
          <div
            role="tablist"
            aria-label="What you'll learn"
            className="curriculum-nav flex flex-col gap-4 lg:w-[320px] lg:shrink-0 lg:pr-8"
          >
            {PILLARS.map((pillar, index) => {
              const Icon = pillar.icon;
              const selected = index === active;
              return (
                <button
                  key={pillar.title}
                  type="button"
                  role="tab"
                  id={`curriculum-tab-${pillar.index}`}
                  aria-selected={selected}
                  aria-controls="curriculum-panel"
                  onClick={() => setActive(index)}
                  className={`curriculum-tab inline-flex w-fit max-w-full items-center gap-2.5 rounded-full px-4 py-2.5 text-left text-sm font-semibold leading-snug ${selected ? "curriculum-tab-active" : ""}`}
                >
                  <Icon size={16} aria-hidden="true" className="shrink-0" />
                  <span>{pillar.title}</span>
                </button>
              );
            })}
          </div>

          <div
            role="tabpanel"
            id="curriculum-panel"
            aria-labelledby={`curriculum-tab-${item.index}`}
            className="curriculum-panel min-w-0 flex-1 rounded-[1.75rem] px-5 py-7 sm:px-8 sm:py-9 lg:rounded-l-none lg:rounded-r-[2rem] lg:px-10 lg:py-12"
          >
            <p className="curriculum-index text-xs font-semibold tracking-[0.16em]">{item.index}</p>
            <div className="mt-3 flex items-start gap-3">
              <span className="curriculum-panel-icon mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl lg:hidden">
                <ActiveIcon size={18} aria-hidden="true" />
              </span>
              <h3 className="curriculum-title text-xl font-bold leading-snug sm:text-2xl">{item.title}</h3>
            </div>
            <p className="curriculum-copy mt-3 text-sm leading-relaxed sm:text-base">{item.text}</p>
            <ul className="mt-6 grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
              {item.outcomes.map((outcome) => (
                <li key={outcome} className="curriculum-outcome flex items-center gap-2.5 text-sm sm:text-[15px]">
                  <CircleCheck size={18} aria-hidden="true" className="curriculum-check shrink-0" />
                  <span>{outcome}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        */}
      </div>
      {/* ─── BOTTOM CLOUDY WAVE (MATCHING MENTOR SECTION BOTTOM) ─── */}
      <div
        className="curriculum-cloud-wave-bottom absolute -bottom-[27px] sm:-bottom-[31px] left-0 right-0 w-full h-[28px] sm:h-[32px] pointer-events-none z-40"
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
          filter: "drop-shadow(0 4px 6px rgba(0, 0, 0, 0.08))",
        }}
        aria-hidden="true"
      />
    </section>
  );
}
