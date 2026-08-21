"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Flame,
  Trophy,
  Star,
  Zap,
  Award,
  Crown,
  Gem,
  Palette,
  ShieldAlert,
  Compass
} from 'lucide-react';

interface WelcomeHeaderProps {
  user: any;
  level: string;
  xp: number;
  streak: number;
  progress: number;
  nextGoal?: string;
  currentTier?: any;
  badges?: any[];
  salesRecords?: any[];
}

// Helper to get achievement badge symbol (Point 4: Starter, Art-o-thon Finisher, HOF, Artistry Pinnacle Award)
const getAchievementBadge = (xp: number = 0, badges: any[] = [], totalRevenue: number = 0) => {
  if (totalRevenue >= 500000 || badges.some((b: any) => b.name?.toLowerCase().includes('pinnacle'))) {
    return { symbol: '👑', name: 'Artistry Pinnacle Award', color: 'text-amber-300', bg: 'bg-amber-500/20 border-amber-400/50' };
  }
  if (totalRevenue >= 100000 || badges.some((b: any) => b.name?.toLowerCase().includes('hof') || b.name?.toLowerCase().includes('hall of fame'))) {
    return { symbol: '🏆', name: 'Hall Of Fame (HOF)', color: 'text-yellow-300', bg: 'bg-yellow-500/20 border-yellow-400/50' };
  }
  if (xp >= 200 || badges.some((b: any) => b.name?.toLowerCase().includes('art-o-thon') || b.name?.toLowerCase().includes('finisher'))) {
    return { symbol: '🥈', name: 'Art-o-thon Finisher', color: 'text-slate-200', bg: 'bg-slate-400/20 border-slate-400/50' };
  }
  return { symbol: '🥉', name: 'Starter', color: 'text-orange-300', bg: 'bg-orange-500/20 border-orange-400/50' };
};

// Helper to get level-specific aesthetic, icons, colors, and badge
const getLevelBadgeConfig = (levelStr: string = '', currentTier?: any) => {
  if (currentTier) {
    const color = currentTier.badgeColor || 'emerald';
    const colorMap: Record<string, any> = {
      emerald: { textColor: 'text-emerald-300', badgeBg: 'bg-emerald-500/20', borderColor: 'border-emerald-500/40', glowShadow: 'shadow-[0_0_12px_rgba(16,185,129,0.25)]', gradient: 'from-emerald-400 to-teal-300', pillBg: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30' },
      slate: { textColor: 'text-slate-200', badgeBg: 'bg-slate-400/20', borderColor: 'border-slate-400/40', glowShadow: 'shadow-[0_0_12px_rgba(203,213,225,0.25)]', gradient: 'from-slate-200 to-slate-400', pillBg: 'bg-slate-500/10 text-slate-300 border-slate-500/30' },
      amber: { textColor: 'text-amber-300', badgeBg: 'bg-amber-500/20', borderColor: 'border-amber-400/40', glowShadow: 'shadow-[0_0_15px_rgba(245,158,11,0.35)]', gradient: 'from-amber-400 to-yellow-300', pillBg: 'bg-amber-500/10 text-amber-300 border-amber-500/30' },
      cyan: { textColor: 'text-cyan-300', badgeBg: 'bg-cyan-500/20', borderColor: 'border-cyan-400/40', glowShadow: 'shadow-[0_0_15px_rgba(6,182,212,0.35)]', gradient: 'from-cyan-400 to-blue-400', pillBg: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30' },
      purple: { textColor: 'text-purple-300', badgeBg: 'bg-purple-500/20', borderColor: 'border-purple-400/50', glowShadow: 'shadow-[0_0_15px_rgba(168,85,247,0.4)]', gradient: 'from-purple-400 via-pink-400 to-amber-300', pillBg: 'bg-purple-500/10 text-purple-300 border-purple-500/30' },
      rose: { textColor: 'text-rose-300', badgeBg: 'bg-rose-500/20', borderColor: 'border-rose-400/40', glowShadow: 'shadow-[0_0_12px_rgba(244,63,94,0.3)]', gradient: 'from-rose-400 to-pink-400', pillBg: 'bg-rose-500/10 text-rose-300 border-rose-500/30' },
      blue: { textColor: 'text-blue-300', badgeBg: 'bg-blue-500/20', borderColor: 'border-blue-400/40', glowShadow: 'shadow-[0_0_12px_rgba(59,130,246,0.3)]', gradient: 'from-blue-400 to-cyan-300', pillBg: 'bg-blue-500/10 text-blue-300 border-blue-500/30' },
    };

    const c = colorMap[color] || colorMap.emerald;
    return {
      name: currentTier.name || 'Level',
      code: currentTier.code || 'L0',
      icon: currentTier.icon || '⚡',
      isCustomIcon: true,
      ...c
    };
  }

  const normalized = (levelStr || '').toLowerCase();

  if (normalized.includes('diamond') || normalized.includes('l3') && !normalized.includes('+')) {
    return {
      name: 'Diamond Club',
      code: 'L3',
      icon: '💎',
      textColor: 'text-cyan-300',
      badgeBg: 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20',
      borderColor: 'border-cyan-400/40',
      glowShadow: 'shadow-[0_0_15px_rgba(6,182,212,0.35)]',
      gradient: 'from-cyan-400 to-blue-400',
      pillBg: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30'
    };
  }
  
  if (normalized.includes('master') || normalized.includes('l3+')) {
    return {
      name: 'Masters Club',
      code: 'L3+',
      icon: '👑',
      textColor: 'text-purple-300',
      badgeBg: 'bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-amber-500/20',
      borderColor: 'border-purple-400/50',
      glowShadow: 'shadow-[0_0_15px_rgba(168,85,247,0.4)]',
      gradient: 'from-purple-400 via-pink-400 to-amber-300',
      pillBg: 'bg-purple-500/10 text-purple-300 border-purple-500/30'
    };
  }

  if (normalized.includes('gold') || normalized.includes('l2')) {
    return {
      name: 'Gold Member',
      code: 'L2',
      icon: '🏆',
      textColor: 'text-amber-300',
      badgeBg: 'bg-gradient-to-r from-amber-500/20 to-yellow-500/20',
      borderColor: 'border-amber-400/40',
      glowShadow: 'shadow-[0_0_15px_rgba(245,158,11,0.35)]',
      gradient: 'from-amber-400 to-yellow-300',
      pillBg: 'bg-amber-500/10 text-amber-300 border-amber-500/30'
    };
  }

  if (normalized.includes('silver') || normalized.includes('l1')) {
    return {
      name: 'Silver Member',
      code: 'L1',
      icon: '🥈',
      textColor: 'text-slate-300',
      badgeBg: 'bg-slate-500/20',
      borderColor: 'border-slate-400/40',
      glowShadow: 'shadow-[0_0_15px_rgba(148,163,184,0.35)]',
      gradient: 'from-slate-300 to-slate-400',
      pillBg: 'bg-slate-500/10 text-slate-300 border-slate-500/30'
    };
  }

  // Default / L0 Fast Start
  return {
    name: 'Fast Start',
    code: 'L0',
    icon: '⚡',
    textColor: 'text-emerald-300',
    badgeBg: 'bg-emerald-500/20',
    borderColor: 'border-emerald-500/40',
    glowShadow: 'shadow-[0_0_12px_rgba(16,185,129,0.25)]',
    gradient: 'from-emerald-400 to-teal-300',
    pillBg: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
  };
};

export const WelcomeHeader = ({ user, level, xp, streak, progress, nextGoal, currentTier, badges = [], salesRecords = [] }: WelcomeHeaderProps) => {
  const badgeConfig = getLevelBadgeConfig(level, currentTier);
  const totalRevenue = salesRecords.reduce((sum: number, s: any) => sum + (Number(s.amount) || 0), 0);
  const achievement = getAchievementBadge(xp, badges, totalRevenue);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-3xl relative overflow-hidden shadow-xl"
    >
      {/* Decorative background circle */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
      
      <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-6">
        <div>
          {/* Header Title with Dynamic Level Icon and Achievement Symbol */}
          <div className="flex items-center gap-3 flex-wrap mb-2">
            <h1 className="text-2xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-400 to-pink-500">
              Welcome back, {user?.name || "Student"}
            </h1>

            {/* Achievement Symbol Badge (Starter / Art-o-thon / HOF / Pinnacle) */}
            <div 
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-2xl border ${achievement.bg} text-xs font-bold ${achievement.color} shadow-md backdrop-blur-md`}
              title={`Achievement Award: ${achievement.name}`}
            >
              <span className="text-sm">{achievement.symbol}</span>
              <span className="hidden sm:inline">{achievement.name}</span>
            </div>
            
            {/* Dynamic Level Icon only - Links to Student Profile */}
            <Link href="/student/profile" title="View all completed levels & achievements">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className={`inline-flex items-center justify-center w-10 h-10 rounded-2xl border ${badgeConfig.borderColor} ${badgeConfig.badgeBg} ${badgeConfig.glowShadow} backdrop-blur-md hover:scale-110 transition-transform cursor-pointer`}
              >
                <span className="text-xl leading-none">{badgeConfig.icon}</span>
              </motion.div>
            </Link>
          </div>

          <p className="text-gray-300 text-sm md:text-lg flex items-center gap-2 flex-wrap">
            You are in{" "}
            <Link
              href="/student/profile"
              className={`font-bold ${badgeConfig.textColor} flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg ${badgeConfig.pillBg} border hover:scale-105 transition-transform`}
              title="Click to view all completed levels & awards"
            >
              <span>{badgeConfig.icon}</span>
              {level || badgeConfig.name}
            </Link>
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          {/* Current Level Card with dynamic icon */}
          <Link href="/student/profile" className={`bg-slate-800/60 p-3 md:p-4 rounded-2xl border ${badgeConfig.borderColor} min-w-[120px] backdrop-blur-sm hover:border-orange-500/40 transition-colors block`}>
            <p className="text-gray-400 text-xs md:text-sm mb-1">Current Level</p>
            <div className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${badgeConfig.gradient} flex items-center justify-center text-slate-950 text-sm shadow-md`}>
                <span>{badgeConfig.icon}</span>
              </div>
              <p className="font-bold text-sm md:text-base text-white">{level || badgeConfig.name}</p>
            </div>
          </Link>



          {/* Total XP Card */}
          <div className="bg-slate-800/50 p-3 md:p-4 rounded-2xl border border-slate-700 min-w-[100px]">
            <p className="text-gray-400 text-xs md:text-sm mb-1">Total XP</p>
            <div className="flex items-center gap-2">
              <Star size={16} className="text-yellow-400 fill-yellow-400/20" />
              <p className="font-bold text-sm md:text-lg text-white">{(xp || 0).toLocaleString()} XP</p>
            </div>
          </div>

          {/* Streak Card */}
          <div className="bg-slate-800/50 p-3 md:p-4 rounded-2xl border border-slate-700 flex-1 md:flex-none">
            <div className="flex justify-between items-center mb-2">
              <p className="text-gray-400 text-xs md:text-sm">Streak</p>
              <div className="flex items-center gap-1 bg-orange-500/10 px-2 py-0.5 rounded-full border border-orange-500/20">
                <Flame size={12} className="text-orange-500 fill-orange-500/30" />
                <span className="text-orange-400 font-bold text-xs">{streak || 0}d</span>
              </div>
            </div>
            <div className="flex gap-1 mt-2">
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => {
                const isActive = i < Math.min(streak || 0, 7);
                return (
                  <div key={i} className="flex flex-col items-center gap-1">
                    <div className={`w-5 h-5 md:w-6 md:h-6 rounded-md flex items-center justify-center text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-orange-500 text-white shadow-[0_0_10px_rgba(249,115,22,0.4)]'
                        : 'bg-slate-900 text-slate-600 border border-slate-700'
                    }`}>
                      {isActive ? <Flame size={10} className="text-white fill-white" /> : day}
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

