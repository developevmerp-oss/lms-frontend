"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";
import { Target } from "lucide-react";

export const SkillMastery = ({ skills }: { skills: any }) => {
  // Radar data with labels matching Image 4
  const dynamicData = [
    {
      subject: "Skill Mastery",
      score: skills?.skillMastery || skills?.resinBasics || 70,
      fullMark: 100,
    },
    {
      subject: "Consistency",
      score: skills?.consistency || skills?.mixing || 75,
      fullMark: 100,
    },
    {
      subject: "Creative Excellence",
      score: skills?.creativeExcellence || skills?.creativity || 80,
      fullMark: 100,
    },
    {
      subject: "Growth & Action",
      score: skills?.implementationGrowth || skills?.colourTheory || 65,
      fullMark: 100,
    },
    {
      subject: "Business Progress",
      score: skills?.businessProgress || skills?.finishing || 60,
      fullMark: 100,
    },
    {
      subject: "Leadership",
      score: skills?.communityLeadership || skills?.professionalQuality || 65,
      fullMark: 100,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="bg-white/95 border border-[#ecdccb] p-5 sm:p-6 rounded-3xl h-full shadow-[0_10px_30px_-12px_rgba(90,55,20,0.08)] flex flex-col justify-between"
    >
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-1">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#ffedd5] to-[#fed7aa] border border-[#fb923c]/40 flex items-center justify-center text-[#ea580c] shadow-xs shrink-0">
          <Target size={17} className="text-[#ea580c]" />
        </div>
        <h2 className="text-base sm:text-lg font-extrabold text-stone-900 tracking-tight">6-Point Skill Mastery</h2>
      </div>

      {/* Radar Matrix Chart */}
      <div className="w-full h-[180px] sm:h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="62%" data={dynamicData}>
            <defs>
              <linearGradient id="skillMasteryOrange" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ff5722" stopOpacity={0.6} />
                <stop offset="100%" stopColor="#ea580c" stopOpacity={0.3} />
              </linearGradient>
            </defs>
            <PolarGrid stroke="#e5ded6" strokeWidth={1} />
            <PolarAngleAxis
              dataKey="subject"
              tick={{ fill: "#44403c", fontSize: 9.5, fontWeight: 600 }}
            />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
            <Radar
              name="Skills"
              dataKey="score"
              stroke="#ea580c"
              strokeWidth={2.5}
              fill="url(#skillMasteryOrange)"
              dot={{ r: 3.5, fill: "#ea580c", stroke: "#ffffff", strokeWidth: 1.5 }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};
