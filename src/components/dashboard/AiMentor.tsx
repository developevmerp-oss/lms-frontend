"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

interface AiMentorProps {
  skills?: Record<string, number | undefined> | null;
}

export const AiMentor = ({ skills }: AiMentorProps) => {
  // Logic to find lowest skill for recommendation (exact previous logic)
  let lowestSkill = "Resin Basics";
  if (skills) {
    const skillMap: Record<string, number> = {
      "Resin Basics": skills.resinBasics ?? skills.skillMastery ?? 75,
      "Mixing": skills.mixing ?? skills.consistency ?? 80,
      "Colour Theory": skills.colourTheory ?? skills.creativeExcellence ?? 85,
      "Finishing": skills.finishing ?? skills.growthAction ?? 70,
      "Creativity": skills.creativity ?? skills.businessProgress ?? 65,
      "Professional Quality": skills.professionalQuality ?? skills.leadership ?? 70,
    };

    let minScore = 101;
    for (const [key, value] of Object.entries(skillMap)) {
      if ((value as number) < minScore) {
        minScore = value as number;
        lowestSkill = key;
      }
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.55 }}
      className="bg-white/95 border border-[#ecdccb] p-5 sm:p-6 rounded-3xl relative overflow-hidden shadow-[0_10px_30px_-12px_rgba(90,55,20,0.08)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-6"
    >
      {/* Subtle background star decoration */}
      <div className="absolute -right-4 -bottom-4 text-[#c4431d]/5 rotate-12 pointer-events-none select-none">
        <Sparkles size={110} />
      </div>

      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-3.5 sm:gap-4 flex-1">
        {/* Rounded square icon */}
        <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-[#942008] via-[#c4431d] to-[#ea580c] flex items-center justify-center shrink-0 shadow-md shadow-[#c4431d]/20 text-white">
          <Sparkles size={22} />
        </div>

        {/* Title block */}
        <div className="shrink-0">
          <p className="text-xs sm:text-xs font-bold text-stone-400 uppercase tracking-wider mb-0.5">
            NEXT RECOMMENDED MISSION
          </p>
          <h2 className="text-base sm:text-lg font-black text-stone-900 leading-tight">
            Focus on {lowestSkill}
          </h2>
        </div>

        {/* Divider for desktop */}
        <div className="hidden xl:block w-px h-10 bg-stone-200/80 mx-2 shrink-0" />

        {/* Description */}
        <p className="text-xs sm:text-sm text-stone-600 max-w-2xl leading-relaxed flex-1">
          Based on your recent portfolio reviews, your {lowestSkill} score is currently your biggest opportunity for growth. I recommend starting the dedicated mission to level this up and balance your Skill Mastery Radar!
        </p>
      </div>

      {/* Action Button */}
      <div className="relative z-10 w-full md:w-auto shrink-0">
        <Link
          href="/student/courses"
          className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#942008] via-[#c4431d] to-[#ea580c] hover:opacity-95 text-white font-bold text-xs sm:text-sm shadow-md shadow-[#c4431d]/25 flex items-center justify-center gap-1.5 transition-all hover:scale-[1.02] cursor-pointer"
        >
          <span>Start Mission</span>
          <ArrowRight size={14} />
        </Link>
      </div>
    </motion.div>
  );
};
