"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Flame,
  Star,
  X
} from 'lucide-react';

interface WelcomeHeaderProps {
  user: any;
  level: string;
  xp: number;
  streak: number;
  weekStatus?: any[];
  progress: number;
  nextGoal?: string;
  currentTier?: any;
  badges?: any[];
  salesRecords?: any[];
}

// Helper to get achievement badge symbol (Starter, Art-o-thon Finisher, HOF, Artistry Pinnacle Award)
const getAchievementBadge = (xp: number = 0, badges: any[] = [], totalRevenue: number = 0) => {
  if (totalRevenue >= 500000 || badges.some((b: any) => b.name?.toLowerCase().includes('pinnacle'))) {
    return { symbol: '👑', name: 'Artistry Pinnacle Award', color: 'text-amber-800', bg: 'bg-amber-50 border-amber-200' };
  }
  if (totalRevenue >= 100000 || badges.some((b: any) => b.name?.toLowerCase().includes('hof') || b.name?.toLowerCase().includes('hall of fame'))) {
    return { symbol: '🏆', name: 'Hall Of Fame (HOF)', color: 'text-yellow-800', bg: 'bg-yellow-50 border-yellow-200' };
  }
  if (xp >= 200 || badges.some((b: any) => b.name?.toLowerCase().includes('art-o-thon') || b.name?.toLowerCase().includes('finisher'))) {
    return { symbol: '🥈', name: 'Art-o-thon Finisher', color: 'text-stone-800', bg: 'bg-stone-100 border-stone-300' };
  }
  return { symbol: '🥉', name: 'Starter', color: 'text-amber-800', bg: 'bg-amber-50/80 border-amber-200' };
};

// Helper to get level-specific aesthetic, icons, colors, and badge
const getLevelBadgeConfig = (levelStr: string = '', currentTier?: any) => {
  if (currentTier) {
    return {
      name: currentTier.name || 'Level',
      code: currentTier.code || 'L0',
      icon: currentTier.icon || '⚡',
    };
  }

  const normalized = (levelStr || '').toLowerCase();

  if (normalized.includes('diamond') || normalized.includes('renaissance') || (normalized.includes('l3') && !normalized.includes('+'))) {
    return {
      name: 'Diamond Club',
      code: 'L3',
      icon: '💎',
    };
  }
  
  if (normalized.includes('master') || normalized.includes('l3+')) {
    return {
      name: 'Masters Club',
      code: 'L3+',
      icon: '👑',
    };
  }

  if (normalized.includes('gold') || normalized.includes('l2')) {
    return {
      name: 'Gold Member',
      code: 'L2',
      icon: '🏆',
    };
  }

  if (normalized.includes('silver') || normalized.includes('l1')) {
    return {
      name: 'Silver Member',
      code: 'L1',
      icon: '🥈',
    };
  }

  // Default / L0 Fast Start
  return {
    name: 'Fast Start',
    code: 'L0',
    icon: '⚡',
  };
};

export const WelcomeHeader = ({
  user,
  level,
  xp,
  streak,
  weekStatus = [],
  progress,
  nextGoal,
  currentTier,
  badges = [],
  salesRecords = []
}: WelcomeHeaderProps) => {
  const badgeConfig = getLevelBadgeConfig(level, currentTier);
  const totalRevenue = salesRecords.reduce((sum: number, s: any) => sum + (Number(s.amount) || 0), 0);
  const achievement = getAchievementBadge(xp, badges, totalRevenue);

  const defaultDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const daysToRender = weekStatus && weekStatus.length === 7
    ? weekStatus
    : defaultDays.map((dayName, i) => ({
        dayName,
        status: i < Math.min(streak || 0, 7) ? 'completed' : i === 0 ? 'missed' : 'future',
        isToday: i === Math.min(streak || 0, 6)
      }));

  const displayName = user?.name ? user.name.split(' ')[0] : 'Diya';

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/95 border border-[#ecdccb] p-5 sm:p-7 rounded-3xl relative overflow-hidden shadow-[0_10px_30px_-12px_rgba(90,55,20,0.08)] flex flex-col justify-between h-full"
    >
      {/* Decorative ambient background blur */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#c4431d]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />

      <div className="relative z-10 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-5">
        {/* Left: Greeting & Badges */}
        <div>
          <div className="flex items-center gap-2.5 flex-wrap mb-2">
            <h1 className="text-2xl sm:text-3xl font-black text-stone-900 leading-tight">
              Welcome back, {displayName}
            </h1>

            {/* Achievement Award Badge */}
            <div
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-2xl border ${achievement.bg} text-xs font-bold ${achievement.color} shadow-xs`}
              title={`Achievement: ${achievement.name}`}
            >
              <span>{achievement.symbol}</span>
              <span>{achievement.name}</span>
            </div>

            {/* Level Icon Button */}
            <Link
              href="/student/profile"
              title="View all completed levels"
              className="inline-flex items-center justify-center w-8 h-8 rounded-xl border border-sky-200 bg-sky-50 text-sky-800 hover:scale-105 transition-transform cursor-pointer"
            >
              <span className="text-sm">{badgeConfig.icon}</span>
            </Link>
          </div>

          <p className="text-stone-600 text-xs sm:text-sm flex items-center gap-2 flex-wrap">
            <span>You are in</span>
            <Link
              href="/student/profile"
              className="font-bold text-sky-800 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-sky-50 border border-sky-200 hover:scale-105 transition-transform text-xs"
              title="Click to view level profile"
            >
              <span>{badgeConfig.icon}</span>
              <span>{level || badgeConfig.name}</span>
            </Link>
          </p>
        </div>

        {/* Right: Current Level, Total XP & Streak Box Row */}
        <div className="flex flex-wrap items-stretch gap-2.5 sm:gap-3 w-full xl:w-auto">
          {/* Current Level */}
          <Link
            href="/student/profile"
            className="bg-[#faf8f5] p-3 rounded-2xl border border-stone-200/80 hover:border-[#c4431d]/40 transition-colors flex-1 sm:flex-none min-w-[105px] cursor-pointer"
            title="View Level details"
          >
            <p className="text-[0.65rem] sm:text-xs text-stone-400 font-semibold mb-1">Current Level</p>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-sky-100 text-sky-800 flex items-center justify-center text-xs shadow-xs">
                <span>{badgeConfig.icon}</span>
              </div>
              <span className="text-xs sm:text-sm font-black text-stone-900">{level || badgeConfig.name}</span>
            </div>
          </Link>

          {/* Total XP */}
          <div className="bg-[#faf8f5] p-3 rounded-2xl border border-stone-200/80 flex-1 sm:flex-none min-w-[95px]">
            <p className="text-[0.65rem] sm:text-xs text-stone-400 font-semibold mb-1">Total XP</p>
            <div className="flex items-center gap-1.5">
              <Star size={15} className="text-amber-400 fill-amber-400/30" />
              <span className="text-xs sm:text-sm font-black text-stone-900">{(xp || 0).toLocaleString()} XP</span>
            </div>
          </div>

          {/* Streak */}
          <div className="bg-[#faf8f5] p-3 rounded-2xl border border-stone-200/80 flex-1 sm:flex-none min-w-[170px]">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-[0.65rem] sm:text-xs text-stone-400 font-semibold">Streak</span>
              <span className="inline-flex items-center gap-1 bg-[#fde5d6] text-[#942008] border border-[#f5ded0] text-[0.65rem] sm:text-xs font-bold px-2 py-0.5 rounded-full">
                🔥 {streak || 0}d
              </span>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center">
              {daysToRender.map((dayItem: any, i: number) => {
                const { dayName, status, isToday } = dayItem;

                let square = null;
                let dayTextColor = "text-stone-400";

                if (status === 'completed') {
                  dayTextColor = "text-[#c4431d]";
                  square = (
                    <div
                      title={`${dayName} - Completed`}
                      className="w-5 h-5 sm:w-6 sm:h-6 mx-auto rounded-md flex items-center justify-center bg-gradient-to-br from-[#942008] via-[#c4431d] to-[#ea580c] text-white shadow-xs"
                    >
                      <Flame size={11} className="fill-white" />
                    </div>
                  );
                } else if (status === 'missed') {
                  dayTextColor = "text-rose-400";
                  square = (
                    <div
                      title={`${dayName} - Missed`}
                      className="w-5 h-5 sm:w-6 sm:h-6 mx-auto rounded-md flex items-center justify-center bg-rose-50 border border-rose-200 text-rose-500"
                    >
                      <X size={10} strokeWidth={3} />
                    </div>
                  );
                } else if (status === 'today_pending' || isToday) {
                  dayTextColor = "text-amber-600";
                  square = (
                    <div
                      title={`${dayName} - Today`}
                      className="w-5 h-5 sm:w-6 sm:h-6 mx-auto rounded-md flex items-center justify-center bg-amber-50 border border-amber-300 text-amber-700 text-[0.65rem] font-bold animate-pulse"
                    >
                      {dayName}
                    </div>
                  );
                } else {
                  square = (
                    <div
                      title={`${dayName} - Upcoming`}
                      className="w-5 h-5 sm:w-6 sm:h-6 mx-auto rounded-md flex items-center justify-center bg-stone-100 border border-stone-200/60 text-stone-400 text-[0.65rem] font-bold"
                    >
                      {dayName}
                    </div>
                  );
                }

                return (
                  <div key={i} className="flex flex-col items-center gap-0.5">
                    {square}
                    <span className={`text-[0.6rem] font-bold ${dayTextColor}`}>{dayName}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Progress Bar */}
      <div className="mt-5 pt-3.5 border-t border-stone-100 relative z-10">
        <div className="flex justify-between items-center text-xs font-semibold mb-1.5 flex-wrap gap-1">
          <span className="text-[#c4431d] font-bold truncate max-w-[65%]">
            {nextGoal || 'Complete pending missions'}
          </span>
          <span className="text-stone-900 font-bold">{progress}% Progress</span>
        </div>
        <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden border border-stone-200/50">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="h-full bg-gradient-to-r from-[#942008] via-[#c4431d] to-[#ea580c] rounded-full"
          />
        </div>
      </div>
    </motion.div>
  );
};
