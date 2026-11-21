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
      className="bg-white/95 border border-[#ecdccb] p-6 sm:p-7 rounded-3xl h-full min-h-[300px] sm:min-h-[340px] shadow-[0_10px_30px_-12px_rgba(90,55,20,0.08)] flex flex-col justify-between"
    >
      <div>
        {/* Header */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#fff2ea] flex items-center justify-center text-[#e86034] shrink-0 shadow-2xs">
              <Award size={18} />
            </div>
            <h2 className="text-base sm:text-lg font-bold text-stone-900">Badges Earned</h2>
          </div>
          <span className="text-xs sm:text-sm text-stone-400 font-semibold shrink-0">
            {displayedBadges.length} badge{displayedBadges.length !== 1 ? "s" : ""} collected
          </span>
        </div>

        {/* Content */}
        {displayedBadges.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            {/* Star Burst Icon matching Image 4 */}
            <div className="w-16 h-16 flex items-center justify-center text-[#e86034] mb-2">
              <svg width="48" height="48" viewBox="0 0 40 40" fill="none">
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

            <h3 className="text-sm sm:text-base font-bold text-stone-800">No badges yet.</h3>
            <p className="text-xs sm:text-sm text-stone-400 max-w-[220px] mt-1 leading-snug">
              Keep learning, stay consistent, and earn your first badge!
            </p>
          </div>
        ) : displayedBadges.length === 1 ? (
          <div className="pt-2">
            {displayedBadges.map((badge, i) => (
              <div
                key={i}
                className="flex items-center gap-4 p-4 sm:p-5 rounded-2xl bg-[#faf8f5] border border-[#ecdccb] shadow-xs"
              >
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white shadow-xs border border-[#f5ded0] flex items-center justify-center text-3xl shrink-0">
                  {badge.icon || "🎨"}
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-sm sm:text-base font-bold text-stone-900 block truncate">
                    {badge.name || "Achievement"}
                  </span>
                  <span className="text-xs sm:text-sm text-stone-500 block truncate mt-1">
                    {badge.description || "Official milestone achievement"}
                  </span>
                </div>
                <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#fde5d6] text-[#c4431d] text-xs sm:text-sm font-bold shrink-0">
                  ✓ Earned
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 pt-2">
            {displayedBadges.slice(0, 4).map((badge, i) => (
              <div
                key={i}
                className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-[#faf8f5] border border-[#ecdccb] text-center"
              >
                <div className="w-12 h-12 rounded-xl bg-white shadow-xs border border-[#f5ded0] flex items-center justify-center text-2xl mb-2">
                  {badge.icon || "🏅"}
                </div>
                <span className="text-xs sm:text-sm font-bold text-stone-900 line-clamp-1 w-full px-1">
                  {badge.name || "Achievement"}
                </span>
                <span className="text-xs text-[#c4431d] font-bold mt-1 bg-[#fde5d6]/70 px-2 py-0.5 rounded-full">
                  ✓ Earned
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default BadgesEarned;

