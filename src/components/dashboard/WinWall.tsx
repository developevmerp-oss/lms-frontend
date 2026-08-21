"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Flame, Sparkles, TrendingUp, Award, Plus, CheckCircle2, ChevronRight } from 'lucide-react';

interface WinItem {
  id: string;
  studentName: string;
  studentLevel: string;
  title: string;
  amount?: string;
  badge?: string;
  timeAgo: string;
}

const DEFAULT_WINS: WinItem[] = [
  {
    id: '1',
    studentName: 'Pooja Varma',
    studentLevel: 'L2 Gold',
    title: 'Closed 2 Bridal Preservation Orders',
    amount: '₹24,000',
    badge: '🏆 HOF Club',
    timeAgo: '2h ago',
  },
  {
    id: '2',
    studentName: 'Aarav Mehta',
    studentLevel: 'L1 Silver',
    title: 'Sold 3D Amethyst Geode Wall Clock',
    amount: '₹8,500',
    badge: '🥈 Art-o-thon',
    timeAgo: '4h ago',
  },
  {
    id: '3',
    studentName: 'Kavita Dave',
    studentLevel: 'L3 Diamond',
    title: 'Delivered Custom Ocean Dining Table',
    amount: '₹68,000',
    badge: '👑 Pinnacle Award',
    timeAgo: '1d ago',
  },
  {
    id: '4',
    studentName: 'Ritu Sen',
    studentLevel: 'L0 FastTrack',
    title: 'Completed Level 0 Action Missions',
    badge: '⭐ Starter Star',
    timeAgo: '1d ago',
  }
];

export const WinWall = ({ communityWins = [], onShareWin }: { communityWins?: any[]; onShareWin?: () => void }) => {
  const displayWins: WinItem[] = communityWins && communityWins.length > 0
    ? communityWins.map((w, idx) => ({
        id: w.id || String(idx),
        studentName: w.userName || w.studentName || 'Fellow Artist',
        studentLevel: w.level || 'L1 Member',
        title: w.title || w.caption || 'Achieved a new breakthrough!',
        amount: w.amount ? `₹${Number(w.amount).toLocaleString('en-IN')}` : undefined,
        badge: w.badge || '✨ Win',
        timeAgo: w.timeAgo || 'Recently',
      }))
    : DEFAULT_WINS;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between h-full space-y-4"
    >
      <div>
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Trophy size={16} />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-1.5">
                Community Win Wall
              </h2>
              <p className="text-[11px] text-slate-400">Live student sales &amp; milestones</p>
            </div>
          </div>

          <span className="text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded-full animate-pulse">
            ● Live
          </span>
        </div>

        {/* Wins Feed */}
        <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
          {displayWins.map((win) => (
            <div
              key={win.id}
              className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800/80 hover:border-slate-700 transition-colors flex items-center justify-between gap-3 text-xs"
            >
              <div className="flex-1 min-w-0 space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white truncate">{win.studentName}</span>
                  <span className="text-[10px] text-slate-500 font-semibold">{win.studentLevel}</span>
                </div>
                <p className="text-slate-300 text-[11px] truncate">{win.title}</p>
                <span className="text-[9px] text-slate-500">{win.timeAgo}</span>
              </div>

              <div className="text-right shrink-0">
                {win.amount && (
                  <p className="font-black text-emerald-400 text-xs">{win.amount}</p>
                )}
                <span className="inline-block text-[9px] font-bold bg-orange-500/10 text-orange-400 border border-orange-500/20 px-2 py-0.5 rounded-full mt-0.5">
                  {win.badge}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Share Your Win Action */}
      <button
        onClick={onShareWin}
        className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-black text-xs transition-all shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2 cursor-pointer"
      >
        <Plus size={14} /> Post Your Win &amp; Earn +20 XP
      </button>
    </motion.div>
  );
};
