"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Flame, 
  Check,
  Headphones, 
  Target, 
  Mic, 
  Edit3, 
  Share2, 
  HeartHandshake
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { API_BASE_URL } from '@/config/api';

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

export const DailyRoutineChecklist = ({
  streak = 0,
  onCompleteRoutine
}: {
  streak?: number;
  onCompleteRoutine?: () => void;
}) => {
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
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/95 border border-[#ecdccb] rounded-3xl p-5 sm:p-7 shadow-[0_10px_30px_-12px_rgba(90,55,20,0.08)] space-y-4 sm:space-y-5"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-stone-100 pb-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-stone-900 flex items-center gap-2">
            <Flame size={20} className="text-[#942008] fill-[#c4431d]" />
            Daily Habits Streak
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Complete your 6-step creative ritual to keep your streak &amp; earn XP
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <div className="bg-[#faf8f5] border border-stone-200/80 px-3.5 py-1.5 rounded-xl text-center">
            <span className="text-[0.65rem] text-stone-400 font-bold block uppercase tracking-wider">
              Current Streak
            </span>
            <span className="text-xs sm:text-sm font-black text-[#942008] flex items-center justify-center gap-1">
              🔥 {streak} Days
            </span>
          </div>
          <div className="bg-[#faf8f5] border border-stone-200/80 px-3.5 py-1.5 rounded-xl text-center">
            <span className="text-[0.65rem] text-stone-400 font-bold block uppercase tracking-wider">
              XP Reward
            </span>
            <span className="text-xs sm:text-sm font-black text-emerald-600">
              +10 XP
            </span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs font-semibold text-stone-500">
          <span>{completedItems.length} of {ROUTINE_ITEMS_CONFIG.length} Habits Completed</span>
          <span className="text-[#942008] font-bold">{progressPercent}%</span>
        </div>
        <div className="w-full bg-stone-100 rounded-full h-2 overflow-hidden border border-stone-200/50">
          <div
            className="bg-gradient-to-r from-[#942008] via-[#c4431d] to-[#ea580c] h-full rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* 2-column Habit Checklist */}
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
                  ? 'bg-emerald-50/70 border-emerald-300 text-stone-900 shadow-xs'
                  : 'bg-[#faf8f5]/70 border-stone-200/80 hover:border-[#c4431d]/30 text-stone-700'
              }`}
            >
              <div className="mt-0.5 shrink-0">
                {isDone ? (
                  <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs">
                    <Check size={13} strokeWidth={3} />
                  </div>
                ) : (
                  <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border border-stone-300 bg-white flex items-center justify-center text-[0.65rem] sm:text-xs font-bold text-stone-500">
                    {item.letter}
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <Icon size={14} className={isDone ? 'text-emerald-600' : 'text-[#942008] shrink-0'} />
                  <p className={`text-xs sm:text-sm font-bold leading-tight ${isDone ? 'text-stone-900' : 'text-stone-800'}`}>
                    {item.title}
                  </p>
                </div>
                <p className="text-[0.7rem] sm:text-xs text-stone-500 mt-0.5 leading-snug">
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
          className="bg-emerald-50 border border-emerald-200 text-emerald-950 p-4 rounded-2xl flex items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">🎉</span>
            <div>
              <p className="text-xs sm:text-sm font-bold text-stone-900">All 6 Daily Habits Completed!</p>
              <p className="text-[0.7rem] sm:text-xs text-emerald-700">
                {syncFeedback || "+10 XP recorded in database and added to your leaderboard standing!"}
              </p>
            </div>
          </div>
          <span className="bg-emerald-500 text-white font-bold text-xs px-3 py-1 rounded-full whitespace-nowrap">
            {isSyncing ? "Saving..." : "Streak Active"}
          </span>
        </motion.div>
      )}
    </motion.div>
  );
};
