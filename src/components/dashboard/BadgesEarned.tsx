"use client";

import React from "react";
import { motion } from "framer-motion";
import { Award, Trophy } from "lucide-react";

interface BadgesEarnedProps {
  badges?: any[];
}

export const BadgesEarned = ({ badges = [] }: BadgesEarnedProps) => {
  const displayedBadges = badges || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.45 }}
      className="bg-white/95 border border-[#ecdccb] p-5 sm:p-6 rounded-3xl h-full shadow-[0_10px_30px_-12px_rgba(90,55,20,0.08)] flex flex-col justify-between"
    >
      <div>
        {/* Header */}
        <div className="flex items-center justify-between gap-2 mb-2 sm:mb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#fff2ea] flex items-center justify-center text-[#e86034] shrink-0">
              <Award size={16} />
            </div>
            <h2 className="text-sm sm:text-base font-bold text-stone-900">Badges Earned</h2>
          </div>
          <span className="text-[11px] text-stone-400 font-medium shrink-0">
            {displayedBadges.length} badge{displayedBadges.length !== 1 ? "s" : ""} collected
          </span>
        </div>

        {/* Content */}
        {displayedBadges.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-4 text-center">
            {/* Star Burst Icon matching Image 4 */}
            <div className="w-12 h-12 flex items-center justify-center text-[#e86034] mb-1">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                {/* Circular dashed/solid rings */}
                <circle
                  cx="20"
                  cy="20"
                  r="13"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeDasharray="2.5 2.5"
                />
                <circle cx="20" cy="20" r="9" stroke="currentColor" strokeWidth="1.5" />
                {/* 5-pointed star */}
                <path
                  d="M 20 15 L 21.2 18.5 L 24.8 18.5 L 21.9 20.6 L 23 24 L 20 22 L 17 24 L 18.1 20.6 L 15.2 18.5 L 18.8 18.5 Z"
                  fill="currentColor"
                />
                {/* Radiating sunburst ticks */}
                <line x1="20" y1="2" x2="20" y2="4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="20" y1="35.5" x2="20" y2="38" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="2" y1="20" x2="4.5" y2="20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="35.5" y1="20" x2="38" y2="20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>

            <h3 className="text-xs sm:text-sm font-bold text-stone-800">No badges yet.</h3>
            <p className="text-[11px] text-stone-400 max-w-[200px] mt-0.5 leading-snug">
              Keep learning, stay consistent, and earn your first badge!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2 pt-1">
            {displayedBadges.slice(0, 2).map((badge, i) => (
              <div
                key={i}
                className="flex flex-col items-center justify-center p-2 rounded-xl bg-[#faf8f5] border border-stone-200/80 text-center"
              >
                <div className="text-xl mb-1">{badge.icon || "🏅"}</div>
                <span className="text-[11px] font-bold text-stone-900 line-clamp-1">
                  {badge.name || "Achievement"}
                </span>
                <span className="text-[9px] text-[#e86034] font-bold mt-0.5">✓ Earned</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default BadgesEarned;

