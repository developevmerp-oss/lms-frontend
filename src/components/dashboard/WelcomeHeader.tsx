"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, Flame, Target, Trophy, Star } from 'lucide-react';

interface WelcomeHeaderProps {
  user: any;
  level: string;
  xp: number;
  streak: number;
  progress: number;
  nextGoal?: string;
}

export const WelcomeHeader = ({ user, level, xp, streak, progress, nextGoal }: WelcomeHeaderProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-3xl relative overflow-hidden shadow-xl"
    >
      {/* Decorative background circle */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
      
      <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-6">
        <div>
          <h1 className="text-2xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-500 mb-2">
            Welcome back, {user?.name || "Sarah"} 👋
          </h1>
          <p className="text-gray-300 text-sm md:text-lg flex items-center gap-2 flex-wrap">
            You are in <span className="font-bold text-teal-400 flex items-center gap-1"><Sparkles size={16}/> {level || '🌱 Explore Membership'}</span>
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="bg-slate-800/50 p-3 md:p-4 rounded-2xl border border-slate-700 min-w-[100px]">
            <p className="text-gray-400 text-xs md:text-sm mb-1">Current Level</p>
            <div className="flex items-center gap-2">
              <Trophy size={16} className="text-orange-400" />
              <p className="font-bold text-sm md:text-lg text-white">{level}</p>
            </div>
          </div>

          <div className="bg-slate-800/50 p-3 md:p-4 rounded-2xl border border-slate-700 min-w-[100px]">
            <p className="text-gray-400 text-xs md:text-sm mb-1">Total XP</p>
            <div className="flex items-center gap-2">
              <Star size={16} className="text-yellow-400" />
              <p className="font-bold text-sm md:text-lg text-white">{xp.toLocaleString()} XP</p>
            </div>
          </div>

          <div className="bg-slate-800/50 p-3 md:p-4 rounded-2xl border border-slate-700 flex-1 md:flex-none">
            <div className="flex justify-between items-center mb-2">
              <p className="text-gray-400 text-xs md:text-sm">Streak</p>
              <div className="flex items-center gap-1 bg-orange-500/10 px-2 py-0.5 rounded-full border border-orange-500/20">
                <Flame size={12} className="text-orange-500" />
                <span className="text-orange-400 font-bold text-xs">{streak}d</span>
              </div>
            </div>
            <div className="flex gap-1 mt-2">
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => {
                const isActive = i < Math.min(streak, 7);
                return (
                  <div key={i} className="flex flex-col items-center gap-1">
                    <div className={`w-5 h-5 md:w-6 md:h-6 rounded-md flex items-center justify-center text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-orange-500 text-white shadow-[0_0_10px_rgba(249,115,22,0.4)]'
                        : 'bg-slate-900 text-slate-600 border border-slate-700'
                    }`}>
                      {isActive ? <Flame size={10} className="text-white" /> : day}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="mt-5 md:mt-8 border-t border-slate-700/50 pt-4 md:pt-6">
        <div className="flex justify-between text-xs md:text-sm mb-2 font-semibold flex-wrap gap-1">
          <span className="text-orange-400 truncate max-w-[60%]">{nextGoal || 'Next Goal: Complete pending missions'}</span>
          <span className="text-white">{progress}% Progress</span>
        </div>
        <div className="w-full h-2 md:h-3 bg-slate-800 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, delay: 0.5 }}
            className="h-full bg-gradient-to-r from-orange-500 to-yellow-400 rounded-full"
          ></motion.div>
        </div>
      </div>
    </motion.div>
  );
};
