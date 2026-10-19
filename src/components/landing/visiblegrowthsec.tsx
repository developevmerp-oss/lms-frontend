"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  GraduationCap,
  Palette,
  BadgeCheck,
  Coins,
  Award,
  Crown
} from "lucide-react";

const values = [
  {
    title: "Learn",
    icon: GraduationCap,
    bg: "bg-sky-100",
    stroke: "#1DA1F2",
  },
  {
    title: "Create",
    icon: Palette,
    bg: "bg-green-100",
    stroke: "#34C759",
  },
  {
    title: "Complete",
    icon: BadgeCheck,
    bg: "bg-violet-100",
    stroke: "#8B5CF6",
  },
  {
    title: "Earn Points",
    icon: Coins,
    bg: "bg-yellow-100",
    stroke: "#EAB308",
  },
  {
    title: "Unlock Milestones",
    icon: Award,
    bg: "bg-emerald-100",
    stroke: "#10B981",
  },
  {
    title: "Earn Recognition",
    icon: Crown,
    bg: "bg-rose-100",
    stroke: "#F43F5E",
  },
];

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.18,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 50,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: "easeOut",
    },
  },
};

export default function VisibleGrowthSec() {
  return (
    <section className="visible-growth-sec relative z-10 w-full bg-white pb-20 text-neutral-950 overflow-hidden">
      <div className="container mx-auto px-5 sm:px-10 lg:px-10 2xl:px-0">
        <div className="max-w-7xl mx-auto">
          {/* heading */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, amount: 0.2 }}
            className="max-w-4xl mx-auto text-center"
          >
            <span className="text-xs font-semibold uppercase tracking-widest text-neutral-400 block mb-2">
              Gamified Progress Tracking
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-neutral-950 tracking-tight leading-tight">
              Your Growth Should Be Visible.
            </h2>

            <p className="mt-4 text-sm sm:text-base md:text-lg leading-relaxed text-neutral-500 max-w-3xl mx-auto">
              Every creation, challenge, milestone and achievement should tell a story of how far you've come. Instead of wondering whether you're progressing, you'll have tangible milestones that help you see, measure and celebrate your growth.
            </p>
          </motion.div>

          {/* desktop */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="hidden lg:grid grid-cols-6 gap-0 mt-20 items-start"
          >
            {values.map((item, index) => {
              const Icon = item.icon;
              const isTopArc = index % 2 === 1;
              const isLast = index === values.length - 1;

              return (
                <motion.div
                  key={item.title}
                  variants={itemVariants}
                  className="relative flex flex-col items-center"
                >
                  {/* main visual row */}
                  <div className="relative w-full flex items-center justify-center h-[150px]">
                    {/* left connector */}
                    {index !== 0 && (
                      <div
                        className="absolute left-0 top-1/2 -translate-y-1/2 h-[2px] w-[calc(50%-68px)]"
                        style={{ backgroundColor: item.stroke }}
                      />
                    )}

                    {/* right connector */}
                    {!isLast && (
                      <div
                        className="absolute right-0 top-1/2 -translate-y-1/2 h-[2px] w-[calc(50%-68px)]"
                        style={{ backgroundColor: item.stroke }}
                      />
                    )}

                    {/* side dots */}
                    {index !== 0 && (
                      <div
                        className="absolute left-[calc(50%-68px)] top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full border bg-white"
                        style={{ borderColor: item.stroke }}
                      />
                    )}

                    {!isLast && (
                      <div
                        className="absolute right-[calc(50%-68px)] top-1/2 translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full border bg-white"
                        style={{ borderColor: item.stroke }}
                      />
                    )}

                    {/* arc */}
                    <div
                      className={`absolute left-1/2 -translate-x-1/2 w-[138px] h-[68px] border-[2px] ${isTopArc
                        ? "bottom-1/2 border-b-0 rounded-t-full"
                        : "top-1/2 border-t-0 rounded-b-full"
                        }`}
                      style={{ borderColor: item.stroke }}
                    />

                    {/* circle */}
                    <div
                      className={`relative z-10 w-[110px] h-[110px] rounded-full ${item.bg} flex items-center justify-center shadow-sm`}
                    >
                      <Icon
                        className="w-11 h-11 text-gray-800"
                        strokeWidth={1.8}
                      />
                    </div>
                  </div>

                  {/* title */}
                  <h3 className="mt-6 text-center text-[18px] font-semibold text-gray-900 leading-snug max-w-[170px] min-h-[56px]">
                    {item.title}
                  </h3>
                </motion.div>
              );
            })}
          </motion.div>

          {/* mobile / tablet */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="lg:hidden mt-14 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
          >
            {values.map((item) => {
              const Icon = item.icon;

              return (
                <motion.div
                  key={item.title}
                  variants={itemVariants}
                  className="rounded-3xl border border-neutral-100 bg-white p-6 text-center shadow-sm"
                >
                  <div
                    className={`mx-auto w-20 h-20 rounded-full ${item.bg} flex items-center justify-center`}
                  >
                    <Icon className="w-9 h-9 text-gray-800" strokeWidth={1.8} />
                  </div>

                  <h3 className="mt-4 text-lg sm:text-xl lg:text-lg font-semibold text-gray-900">
                    {item.title}
                  </h3>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Highlight Sentence Banner (Exact UI from 3rd reference image) */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true, amount: 0.2 }}
            className="mt-14 sm:mt-18 rounded-3xl bg-slate-50 px-5 py-8 text-center sm:px-8 border border-slate-100"
          >
            <p className="text-lg font-bold leading-snug text-neutral-950 sm:text-2xl">
              ✨ Your journey becomes something you can{" "}
              <span className="text-[#a08b78]">see, track and be proud of.</span>
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
