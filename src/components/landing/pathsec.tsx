"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight, Brush, Layers, Palette, TrendingUp } from "lucide-react";

const STAGES = [
  {
    num: "01",
    stage: "Stage 01",
    percent: "25% Path",
    title: "Skill → Creation",
    text: "Learn the right techniques and develop the confidence to create professional-grade resin art from zero.",
    milestone: "First 3 Practical Pours",
    image: "/images/already-have/no-studio.jpg",
    imageAlt: "Resin workspace with a teal and gold tray in progress",
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
    image: "/images/masterclass/board.jpg",
    imageAlt: "Teal, white, and gold resin ocean board",
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
    image: "/images/landing/growth-create.jpg",
    imageAlt: "Floral resin tray being finished with gold leaf",
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
    image: "/images/artothon/plate.jpg",
    imageAlt: "Amber and white resin plate with gold leaf",
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

/*
Current Strategic Framework card UI — kept, not removed.

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
        {/* <span className={`path-option-icon ${item.accent} flex h-11 w-11 items-center justify-center rounded-full`}>
          <Icon size={18} aria-hidden="true" />
        </span> * /}
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
*/

function PathCard({ item }: { item: (typeof STAGES)[number] }) {
  return (
    <article className="path-expand-card" tabIndex={0}>
      <div className="path-expand-body">
        <div className="path-expand-numrow">
          <span className="path-expand-num">{item.num}</span>
          <span className="path-expand-dash" aria-hidden="true" />
        </div>
        <h3 className="path-expand-title">{item.title}</h3>
        <p className="path-expand-text">{item.text}</p>
        <div className="path-expand-foot">
          <p className="path-expand-more">
            More
            <ArrowRight size={15} strokeWidth={1.75} aria-hidden="true" />
          </p>
          <div className="path-expand-mile">
            <div className="path-expand-mile-inner">
              <p className="path-expand-mile-label">Milestone</p>
              <p className="path-expand-mile-value">{item.milestone}</p>
            </div>
          </div>
        </div>
        <svg className="path-expand-blob" viewBox="0 0 160 120" aria-hidden="true">
          <path
            fill="currentColor"
            d="M28 108C6 92 2 62 18 40C34 16 68 14 92 28C116 42 132 18 150 36C166 52 154 86 132 102C110 118 72 122 48 112C36 106 38 116 28 108Z"
          />
        </svg>
        <span className="path-expand-go" aria-hidden="true">
          <ArrowRight size={16} strokeWidth={2} />
        </span>
      </div>
      <div className="path-expand-media">
        <img src={item.image} alt={item.imageAlt} className="path-expand-photo" />
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
      className="path-sec relative z-10 bg-white text-neutral-950"
    >
      <div className="nav-width">
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

        {/* Current Strategic Framework card layout
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:mt-10 lg:grid-cols-4 lg:gap-8">
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
        */}

        <svg className="path-expand-defs" aria-hidden="true">
          <defs>
            <clipPath id="path-organic-clip" clipPathUnits="objectBoundingBox">
              <path d="M0.08,0.07 C0.26,0.01 0.58,0.00 0.84,0.05 C0.98,0.09 1.00,0.22 0.99,0.42 C0.98,0.64 1.00,0.82 0.90,0.93 C0.74,1.00 0.40,0.99 0.18,0.94 C0.02,0.89 0.00,0.72 0.02,0.50 C0.04,0.26 0.00,0.12 0.08,0.07 Z" />
            </clipPath>
          </defs>
        </svg>

        <div className="path-expand-row">
          {STAGES.map((item, index) => (
            <motion.div
              key={item.stage}
              className="path-expand-slot"
              initial={{ opacity: 0, y: 28 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
              transition={{ delay: 0.12 + index * 0.16, duration: 0.55, ease: "easeOut" }}
            >
              <PathCard item={item} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
