"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Brush, CircleCheck, Layers, Palette, TrendingUp } from "lucide-react";

const PILLARS = [
  {
    index: "01",
    title: "Master Resin Art Techniques",
    text: "Understand the fundamentals and advanced techniques required to create beautiful, professional-quality resin artwork—from chemistry and bubble-free mixing to ocean lacing and geode crystal inlays.",
    outcomes: ["Bubble-Free Chemistry", "Ocean Foam & Waves", "Geode Crystal Inlays"],
    icon: Brush,
  },
  {
    index: "02",
    title: "Develop Your Signature Style",
    text: "Move beyond copying others and discover the colours, techniques, compositions and products that make your work instantly recognizable in the market.",
    outcomes: ["Color Psychology", "Distinct Compositions", "Signature Identity"],
    icon: Palette,
  },
  {
    index: "03",
    title: "Build a Portfolio You Are Proud Of",
    text: "Create meaningful, commercial-grade projects that demonstrate your ability and give you something tangible to showcase to clients, interior designers, and collectors.",
    outcomes: ["Commercial Finishes", "Client Lookbooks", "High-End Packaging"],
    icon: Layers,
  },
  {
    index: "04",
    title: "Learn How To Monetize Your Skill",
    text: "Understand how to turn your creations into products, orders, high-ticket custom commissions, workshop opportunities and sustainable monthly income.",
    outcomes: ["Commission Pricing", "Client Acquisition", "Repeat Order Flywheel"],
    icon: TrendingUp,
  },
];

export default function CurriculumSec() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.25 });
  const [active, setActive] = useState(0);
  const item = PILLARS[active];
  const ActiveIcon = item.icon;

  return (
    <section
      id="curriculum"
      ref={sectionRef}
      className="curriculum-sec relative z-10 bg-white py-16 text-neutral-950 sm:py-20"
    >
      <div className="container mx-auto px-5 sm:px-10 lg:px-10 2xl:px-0">
        <motion.div
          className="mx-auto max-w-3xl text-center"
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <p className="curriculum-kicker text-xs font-semibold uppercase tracking-[0.18em]">
            Curriculum + Outcomes
          </p>
          <h2 className="curriculum-heading mt-3 text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
            What You'll Learn + What You'll Create
          </h2>
          <p className="curriculum-copy mx-auto mt-4 max-w-2xl text-sm leading-relaxed sm:text-base">
            This isn't just about watching lessons. You'll learn the techniques, practice them through real creations and gradually build a portfolio that demonstrates your growth.
          </p>
        </motion.div>

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
      </div>
    </section>
  );
}
