"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';

export const AiMentor = ({ skills }: { skills?: any }) => {
  // Logic to find lowest skill for AI recommendation
  let lowestSkill = "Finishing";
  if (skills) {
    const skillMap: any = {
      "Resin Basics": skills.resinBasics || 0,
      "Mixing": skills.mixing || 0,
      "Colour Theory": skills.colourTheory || 0,
      "Finishing": skills.finishing || 0,
      "Creativity": skills.creativity || 0,
      "Professional Quality": skills.professionalQuality || 0,
    };
    
    // Find the skill with the lowest score
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.9 }}
      className="bg-gradient-to-r from-orange-500/10 to-pink-500/10 border border-orange-500/20 p-6 md:p-8 rounded-3xl relative overflow-hidden"
    >
      <div className="absolute -top-10 -right-10 text-orange-500/10 rotate-12 pointer-events-none">
        <Sparkles size={120} />
      </div>

      <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
        <div className="w-16 h-16 rounded-2xl bg-orange-500 flex items-center justify-center shrink-0 shadow-lg shadow-orange-500/30">
          <Sparkles size={32} className="text-white" />
        </div>
        
        <div className="flex-1 text-center md:text-left">
          <h3 className="text-sm font-bold text-orange-400 uppercase tracking-widest mb-1">Next Recommended Mission</h3>
          <h2 className="text-2xl font-bold text-white mb-2">Focus on {lowestSkill}</h2>
          <p className="text-slate-300 max-w-2xl">
            Based on your recent portfolio reviews, your {lowestSkill} score is currently your biggest opportunity for growth. 
            I recommend starting the dedicated mission to level this up and balance your Skill Mastery Radar!
          </p>
        </div>

        <button className="bg-white text-slate-900 font-bold px-8 py-3 rounded-xl hover:bg-slate-200 transition-colors flex items-center gap-2 shrink-0 group shadow-lg">
          Start Mission <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </motion.div>
  );
};
