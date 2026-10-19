"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Brush, Layers, Palette, TrendingUp } from "lucide-react";

const PILLARS = [
  {
    index: "01",
    title: "Master Resin Art Techniques",
    text: "Understand the fundamentals and advanced techniques required to create beautiful, professional-quality resin artwork—from chemistry and bubble-free mixing to ocean lacing and geode crystal inlays.",
    outcomes: ["Bubble-Free Chemistry", "Ocean Foam & Waves", "Geode Crystal Inlays"],
    icon: Brush,
    tint: "curriculum-tint-1",
  },
  {
    index: "02",
    title: "Develop Your Signature Style",
    text: "Move beyond copying others and discover the colours, techniques, compositions and products that make your work instantly recognizable in the market.",
    outcomes: ["Color Psychology", "Distinct Compositions", "Signature Identity"],
    icon: Palette,
    tint: "curriculum-tint-2",
  },
  {
    index: "03",
    title: "Build a Portfolio You Are Proud Of",
    text: "Create meaningful, commercial-grade projects that demonstrate your ability and give you something tangible to showcase to clients, interior designers, and collectors.",
    outcomes: ["Commercial Finishes", "Client Lookbooks", "High-End Packaging"],
    icon: Layers,
    tint: "curriculum-tint-3",
  },
  {
    index: "04",
    title: "Learn How To Monetize Your Skill",
    text: "Understand how to turn your creations into products, orders, high-ticket custom commissions, workshop opportunities and sustainable monthly income.",
    outcomes: ["Commission Pricing", "Client Acquisition", "Repeat Order Flywheel"],
    icon: TrendingUp,
    tint: "curriculum-tint-4",
  },
];

export default function CurriculumSec() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.25 });

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

        <div className="mx-auto mt-10 grid max-w-5xl grid-cols-1 gap-5 sm:mt-12 md:grid-cols-2 md:gap-6">
          {PILLARS.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.article
                key={item.title}
                className="curriculum-card flex h-full flex-col rounded-[1.75rem] p-6 sm:p-7"
                initial={{ opacity: 0, y: 28 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
                transition={{ delay: 0.12 + index * 0.12, duration: 0.5, ease: "easeOut" }}
              >
                <div className="flex items-center justify-between">
                  <span className="curriculum-index text-sm font-semibold tracking-[0.16em]">{item.index}</span>
                  <span className={`curriculum-icon ${item.tint} flex h-11 w-11 items-center justify-center rounded-2xl`}>
                    <Icon size={20} aria-hidden="true" />
                  </span>
                </div>
                <h3 className="curriculum-title mt-5 text-xl font-bold leading-snug">{item.title}</h3>
                <p className="curriculum-copy mt-2 text-sm leading-relaxed">{item.text}</p>
                <div className="mt-auto flex flex-wrap gap-2 border-t border-neutral-100 pt-4">
                  {item.outcomes.map((outcome) => (
                    <span key={outcome} className="curriculum-chip inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium">
                      <span className="curriculum-check" aria-hidden="true">✓</span>
                      {outcome}
                    </span>
                  ))}
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
