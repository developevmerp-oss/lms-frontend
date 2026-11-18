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
      <div className="flex items-center gap-2 mb-1">
        <div className="w-7 h-7 rounded-lg bg-[#fff2ea] flex items-center justify-center text-[#e86034] shrink-0">
          <Target size={16} />
        </div>
        <h2 className="text-base sm:text-lg font-bold text-stone-900">6-Point Skill Mastery</h2>
      </div>

      {/* Radar Matrix Chart */}
      <div className="w-full h-[180px] sm:h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="62%" data={dynamicData}>
            <PolarGrid stroke="#f2eee9" />
            <PolarAngleAxis
              dataKey="subject"
              tick={{ fill: "#57534e", fontSize: 9, fontWeight: 500 }}
            />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
            <Radar
              name="Skills"
              dataKey="score"
              stroke="#e86034"
              strokeWidth={1.5}
              fill="#fbdcd0"
              fillOpacity={0.5}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};
