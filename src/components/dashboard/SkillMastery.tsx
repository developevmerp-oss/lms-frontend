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
  // Use real database values, fallback to 10 if null/undefined
  const dynamicData = [
    { subject: 'Resin Basics', A: skills?.resinBasics || 10, fullMark: 100 },
    { subject: 'Mixing', A: skills?.mixing || 10, fullMark: 100 },
    { subject: 'Colour Theory', A: skills?.colourTheory || 10, fullMark: 100 },
    { subject: 'Finishing', A: skills?.finishing || 10, fullMark: 100 },
    { subject: 'Creativity', A: skills?.creativity || 10, fullMark: 100 },
    { subject: 'Pro Quality', A: skills?.professionalQuality || 10, fullMark: 100 },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.1 }}
      className="bg-slate-900 border border-slate-800 p-6 rounded-3xl h-full flex flex-col shadow-xl"
    >
      <div className="flex items-center gap-2 mb-4">
        <Award className="text-orange-500" />
        <h2 className="text-xl font-bold text-white">Skill Mastery</h2>
      </div>
      
      <div className="flex-1 min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="60%" data={dynamicData}>
            <PolarGrid stroke="rgba(255,255,255,0.1)" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: '#d1d5db', fontSize: 12 }} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
            <Radar
              name="Skills"
              dataKey="A"
              stroke="#f97316"
              fill="#f97316"
              fillOpacity={0.5}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
      <p className="text-center text-xs text-slate-500 mt-2">Mentor validated scores</p>
    </motion.div>
  );
};
