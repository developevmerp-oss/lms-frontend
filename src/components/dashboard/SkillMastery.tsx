"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { Award } from 'lucide-react';

const mockData = [
  { subject: 'Resin Basics', A: 90, fullMark: 100 },
  { subject: 'Mixing', A: 85, fullMark: 100 },
  { subject: 'Colour Theory', A: 70, fullMark: 100 },
  { subject: 'Finishing', A: 60, fullMark: 100 },
  { subject: 'Creativity', A: 95, fullMark: 100 },
  { subject: 'Professional Quality', A: 50, fullMark: 100 },
];

export const SkillMastery = ({ skills }: { skills: any }) => {
  // Use real database values, fallback to default score if null/undefined
  const dynamicData = [
    { subject: '🎨 Skill Mastery', A: skills?.skillMastery || skills?.resinBasics || 75, fullMark: 100 },
    { subject: '🎯 Consistency', A: skills?.consistency || skills?.mixing || 80, fullMark: 100 },
    { subject: '✨ Creative Excellence', A: skills?.creativeExcellence || skills?.creativity || 85, fullMark: 100 },
    { subject: '📈 Growth & Action', A: skills?.implementationGrowth || skills?.colourTheory || 70, fullMark: 100 },
    { subject: '💼 Business Progress', A: skills?.businessProgress || skills?.finishing || 65, fullMark: 100 },
    { subject: '🤝 Leadership', A: skills?.communityLeadership || skills?.professionalQuality || 70, fullMark: 100 },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.1 }}
      className="bg-slate-900 border border-slate-800 p-6 rounded-3xl h-full flex flex-col shadow-xl"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Award className="text-orange-500" />
          <h2 className="text-lg font-bold text-white">6-Point Skill Mastery</h2>
        </div>
        <span className="text-[10px] bg-orange-500/10 text-orange-400 border border-orange-500/20 px-2 py-0.5 rounded-full font-bold">
          Radar Matrix
        </span>
      </div>
      
      <div className="flex-1 min-h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="60%" data={dynamicData}>
            <PolarGrid stroke="rgba(255,255,255,0.1)" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: '#d1d5db', fontSize: 11 }} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
            <Radar
              name="Skills"
              dataKey="A"
              stroke="#f97316"
              fill="#f97316"
              fillOpacity={0.45}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
      <p className="text-center text-[11px] text-slate-500 mt-2">Verified mentor critique scores</p>
    </motion.div>
  );
};
