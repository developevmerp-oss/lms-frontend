"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Flame, 
  CheckCircle2, 
  Circle, 
  Sparkles, 
  Headphones, 
  Target, 
  Mic, 
  Edit3, 
  Share2, 
  HeartHandshake,
  Check
} from 'lucide-react';

interface RoutineItem {
  id: string;
  letter: string;
  title: string;
  subtitle: string;
  icon: any;
  completed: boolean;
}

const ROUTINE_ITEMS_CONFIG: Omit<RoutineItem, 'completed'>[] = [
  {
    id: 'mindset',
    letter: 'A',
    title: 'Mindset Mastery',
    subtitle: 'Listen to "The Strangest Secret" audio',
    icon: Headphones,
  },
  {
    id: 'goal_card',
    letter: 'B',
    title: 'Goal Card Intention',
    subtitle: 'Read your goal card with deep emotion & intention',
    icon: Target,
  },
  {
    id: 'affirmations',
    letter: 'C',
    title: 'Voice Affirmations',
    subtitle: 'Listen to affirmations in your own voice',
    icon: Mic,
  },
  {
    id: 'write_goals',
    letter: 'D',
    title: 'Write 20 Goals Daily',
    subtitle: 'Write two pages of goals (10 per page)',
    icon: Edit3,
  },
  {
    id: 'social_media',
    letter: 'E',
    title: 'Social Media Action',
    subtitle: 'Post a story, reel, shorts, or video of your art',
    icon: Share2,
  },
  {
    id: 'connect_within',
    letter: 'F',
    title: 'Connect Within',
    subtitle: 'Meditate for 15–30 min for creative clarity',
    icon: HeartHandshake,
  },
];

import { useAuth } from '@/context/AuthContext';
import { API_BASE_URL } from '@/config/api';

export const DailyRoutineChecklist = ({ streak = 0, onCompleteRoutine }: { streak?: number; onCompleteRoutine?: () => void }) => {
  const { token } = useAuth();
  const todayKey = `routine_${new Date().toISOString().split('T')[0]}`;
  const [completedItems, setCompletedItems] = useState<string[]>([]);
  const [isCompletedAll, setIsCompletedAll] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(todayKey);
        if (saved) {
          const parsed = JSON.parse(saved);
          setCompletedItems(parsed);
          if (parsed.length === ROUTINE_ITEMS_CONFIG.length) {
            setIsCompletedAll(true);
          }
        }
      } catch (_) {}
    }
  }, [todayKey]);

  const syncRoutineWithBackend = async (habits: string[]) => {
    if (!token) return;
    setIsSyncing(true);
    try {
      const res = await fetch(`${API_BASE_URL}/dashboard/student/routine`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ completedHabits: habits, date: new Date().toISOString().split('T')[0] })
      });
      const data = await res.json();
      if (data.success) {
        setSyncFeedback(data.message || '+10 XP recorded in database!');
        if (onCompleteRoutine) onCompleteRoutine();
      }
    } catch (err) {
      console.error('Error syncing routine with database:', err);
    } finally {
      setIsSyncing(false);
    }
  };

  const toggleItem = (id: string) => {
    let next: string[];
    if (completedItems.includes(id)) {
      next = completedItems.filter(i => i !== id);
    } else {
      next = [...completedItems, id];
    }
    setCompletedItems(next);
    try {
      localStorage.setItem(todayKey, JSON.stringify(next));
    } catch (_) {}

    if (next.length === ROUTINE_ITEMS_CONFIG.length) {
      setIsCompletedAll(true);
      syncRoutineWithBackend(next);
    } else {
      setIsCompletedAll(false);
      setSyncFeedback(null);
    }
  };

  const progressPercent = Math.round((completedItems.length / ROUTINE_ITEMS_CONFIG.length) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-7 shadow-xl space-y-5"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-orange-500/10 text-orange-400 text-xs font-bold px-3 py-1 rounded-full border border-orange-500/20 mb-1">
            <Flame size={14} className="fill-orange-400" /> Daily Habits Streak
          </div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            Today's Focus: 6-Step Daily Routine
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-slate-950 border border-slate-800 px-3.5 py-1.5 rounded-xl text-center">
            <span className="text-[10px] text-slate-500 font-bold block uppercase">Current Streak</span>
            <span className="text-base font-black text-orange-400 flex items-center justify-center gap-1">
              🔥 {streak} Days
            </span>
          </div>
          <div className="bg-slate-950 border border-slate-800 px-3.5 py-1.5 rounded-xl text-center">
            <span className="text-[10px] text-slate-500 font-bold block uppercase">XP Reward</span>
            <span className="text-base font-black text-emerald-400">+10 XP</span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs font-semibold text-slate-400">
          <span>{completedItems.length} of {ROUTINE_ITEMS_CONFIG.length} Habits Completed</span>
          <span className="text-orange-400">{progressPercent}%</span>
        </div>
        <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
          <div
            className="bg-gradient-to-r from-orange-500 to-amber-400 h-full rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Checklist */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {ROUTINE_ITEMS_CONFIG.map((item) => {
          const isDone = completedItems.includes(item.id);
          const Icon = item.icon;

          return (
            <div
              key={item.id}
              onClick={() => toggleItem(item.id)}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 select-none ${
                isDone
                  ? 'bg-emerald-500/10 border-emerald-500/40 text-slate-200 shadow-md'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="mt-0.5 shrink-0">
                {isDone ? (
                  <div className="w-5 h-5 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center shadow-md">
                    <Check size={13} strokeWidth={3} />
                  </div>
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-500">
                    {item.letter}
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <Icon size={14} className={isDone ? 'text-emerald-400' : 'text-orange-400'} />
                  <p className={`text-xs font-bold leading-tight ${isDone ? 'text-white' : 'text-slate-300'}`}>
                    {item.title}
                  </p>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                  {item.subtitle}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {isCompletedAll && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-emerald-500/20 via-teal-500/10 to-slate-900 border border-emerald-500/40 p-4 rounded-2xl flex items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">🎉</span>
            <div>
              <p className="text-sm font-bold text-white">All 6 Daily Habits Completed!</p>
              <p className="text-xs text-emerald-400">
                {syncFeedback || "+10 XP recorded in database and added to your leaderboard standing!"}
              </p>
            </div>
          </div>
          <span className="bg-emerald-500 text-slate-950 font-black text-xs px-3 py-1 rounded-full">
            {isSyncing ? "Saving to DB..." : "Streak Kept Active"}
          </span>
        </motion.div>
      )}
    </motion.div>
  );
};
