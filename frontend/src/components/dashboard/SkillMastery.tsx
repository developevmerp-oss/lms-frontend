"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { Award, ArrowRight } from 'lucide-react';

export const SkillMastery = ({ skills }: { skills: any }) => {
  // Dynamic radar matrix data with colored indicators matching reference
  const dynamicData = [
    { subject: '🟣 Skill Mastery', A: skills?.skillMastery || skills?.resinBasics || 75, fullMark: 100 },
    { subject: '🔴 Consistency', A: skills?.consistency || skills?.mixing || 80, fullMark: 100 },
    { subject: '🟠 Creative Excellence', A: skills?.creativeExcellence || skills?.creativity || 85, fullMark: 100 },
    { subject: '🟣 Growth & Action', A: skills?.implementationGrowth || skills?.colourTheory || 70, fullMark: 100 },
    { subject: '🟤 Business Progress', A: skills?.businessProgress || skills?.finishing || 65, fullMark: 100 },
    { subject: '🟡 Leadership', A: skills?.communityLeadership || skills?.professionalQuality || 70, fullMark: 100 },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.1 }}
      className="bg-white/95 border border-[#ecdccb] p-5 sm:p-6 rounded-3xl h-full flex flex-col justify-between shadow-[0_10px_30px_-12px_rgba(90,55,20,0.08)]"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Award className="text-[#c4431d]" size={18} />
          <h2 className="text-base sm:text-lg font-bold text-stone-900">6-Point Skill Mastery</h2>
        </div>
        <span className="text-[0.65rem] sm:text-xs bg-[#fde5d6] text-[#942008] border border-[#f5ded0] px-2.5 py-0.5 rounded-full font-bold">
          Radar Matrix
        </span>
      </div>
      
      <div className="flex-1 min-h-[220px] sm:min-h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="62%" data={dynamicData}>
            <PolarGrid stroke="#e7e5e4" strokeDasharray="3 3" />
            <PolarAngleAxis
              dataKey="subject"
              tick={{ fill: '#44403c', fontSize: 10, fontWeight: 600 }}
            />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
            <Radar
              name="Skills"
              dataKey="A"
              stroke="#c4431d"
              strokeWidth={1.5}
              fill="#c4431d"
              fillOpacity={0.35}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <p className="text-center text-xs text-stone-500 font-medium hover:text-[#c4431d] transition-colors flex items-center justify-center gap-1 cursor-pointer pt-1">
        Verified mentor critique scores →
      </p>
    </motion.div>
  );
};
