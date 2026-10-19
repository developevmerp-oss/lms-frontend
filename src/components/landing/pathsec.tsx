"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Brush, Layers, Palette, TrendingUp } from "lucide-react";

const STAGES = [
  {
    num: "01",
    stage: "Stage 01",
    percent: "25% Path",
    title: "Skill → Creation",
    text: "Learn the right techniques and develop the confidence to create professional-grade resin art from zero.",
    milestone: "First 3 Practical Pours",
    tone: "path-tone-1",
    color: "#f97316",
    accent: "path-accent-1",
    icon: Brush,
  },
  {
    num: "02",
    stage: "Stage 02",
    percent: "50% Path",
    title: "Creation → Signature",
    text: "Discover your creative strengths and develop a distinct style that feels uniquely and unmistakably yours.",
    milestone: "Signature Color Palette",
    tone: "path-tone-2",
    color: "#7c3aed",
    accent: "path-accent-2",
    icon: Palette,
  },
  {
    num: "03",
    stage: "Stage 03",
    percent: "75% Path",
    title: "Signature → Portfolio",
    text: "Build a collection of creations that represents your skills and helps you showcase your work with total confidence.",
    milestone: "Commercial Artwork Catalog",
    tone: "path-tone-3",
    color: "#0f766e",
    accent: "path-accent-3",
    icon: Layers,
  },
  {
    num: "04",
    stage: "Stage 04",
    percent: "100% Path",
    title: "Portfolio → Income",
    text: "Learn how to position, present and monetize your creations so your skill becomes an income-generating business.",
    milestone: "Consistent Paying Clients",
    tone: "path-tone-4",
    color: "#059669",
    accent: "path-accent-4",
    icon: TrendingUp,
  },
];

/*
function PathCard({
  item,
  index,
  inView,
}: {
  item: (typeof STAGES)[number];
  index: number;
  inView: boolean;
}) {
  return (
    <article className="path-card relative flex h-full flex-col overflow-hidden rounded-2xl px-5 pb-5 pt-4">
      <motion.span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-1.5 origin-left"
        style={{ backgroundColor: item.color }}
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ delay: 0.25 + index * 0.16, duration: 0.6, ease: "easeOut" }}
      />
      <div className="relative flex items-center gap-3">
        <span className="path-num text-[2rem] font-semibold leading-none tracking-tight text-gray-700">{item.num}</span>
        <span className="path-stage-word text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-700">Stage</span>
        <span className="path-percent ml-auto text-[11px] font-semibold">{item.percent}</span>
      </div>
      <h3 className="path-title mt-4 text-base font-bold leading-snug">{item.title}</h3>
      <p className="path-copy mt-2 text-sm leading-relaxed">{item.text}</p>
      <div className="mt-auto pt-5">
        <p className={`path-mile-label text-[11px] font-bold uppercase tracking-[0.14em] ${item.tone}`}>Milestone</p>
        <p className="path-mile mt-1 text-sm leading-snug">{item.milestone}</p>
      </div>
    </article>
  );
}
*/

function PathCard({
  item,
  index,
  inView,
}: {
  item: (typeof STAGES)[number];
  index: number;
  inView: boolean;
}) {
  const Icon = item.icon;
  return (
    <article className="path-card flex h-full flex-col rounded-2xl px-5 py-5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className={`path-option-num text-3xl font-semibold leading-none ${item.accent}`}>{item.num}</span>
          <span aria-hidden="true" className="h-8 w-px bg-neutral-200" />
          <div>
            <p className="path-stage-word text-[10px] font-semibold uppercase tracking-[0.14em]">Stage</p>
            <p className="path-percent mt-0.5 text-[11px] font-semibold">{item.percent}</p>
          </div>
        </div>
        <span className={`path-option-icon ${item.accent} flex h-11 w-11 items-center justify-center rounded-full`}>
          <Icon size={18} aria-hidden="true" />
        </span>
      </div>
      <h3 className="path-title mt-5 text-lg font-bold leading-snug">{item.title}</h3>
      <motion.span
        aria-hidden="true"
        className={`path-option-line ${item.accent} mt-2 block h-0.5 w-8 origin-left rounded-full`}
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ delay: 0.25 + index * 0.16, duration: 0.45, ease: "easeOut" }}
      />
      <p className="path-copy mt-3 text-sm leading-relaxed">{item.text}</p>
      <div className="mt-auto pt-4">
        <p className={`path-mile-label text-[11px] font-bold uppercase tracking-[0.14em] ${item.accent}`}>Milestone</p>
        <p className="path-mile mt-1 text-sm leading-snug">{item.milestone}</p>
      </div>
    </article>
  );
}

export default function PathSec() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.35 });

  return (
    <section
      id="path"
      ref={sectionRef}
      className="path-sec relative z-10 flex items-center bg-white py-16 text-neutral-950 sm:py-20  lg:overflow-hidden lg:py-0"
    >
      <div className="container mx-auto w-full px-5 sm:px-10 lg:px-10 2xl:px-0">
        <motion.div
          className="mx-auto max-w-3xl text-center"
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <p className="path-kicker text-xs font-semibold uppercase tracking-[0.18em]">
            The Strategic Framework
          </p>
          <h2 className="path-heading mt-3 text-3xl font-black tracking-tight sm:text-4xl lg:text-[2.6rem] lg:leading-tight">
            You Don't Need Another Hobby.{" "}
            <span className="path-accent sm:block">You Need a Path.</span>
          </h2>
          <p className="path-copy mx-auto mt-4 max-w-2xl text-sm leading-relaxed sm:text-base">
            A structured journey can help you turn scattered learning into meaningful progress.
          </p>
        </motion.div>

        <div className="mx-auto mt-8 grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 lg:mt-10 lg:grid-cols-4 lg:gap-8">
          {STAGES.map((item, index) => (
            <motion.div
              key={item.stage}
              className="flex"
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
              transition={{ delay: 0.12 + index * 0.16, duration: 0.55, ease: "easeOut" }}
            >
              <PathCard item={item} index={index} inView={inView} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
