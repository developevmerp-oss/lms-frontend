'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Flame,
  Headphones,
  Target,
  Mic,
  Edit3,
  Users,
  Sparkles,
  Check,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { API_BASE_URL } from '@/config/api';

interface RoutineItem {
  id: string;
  letter: string;
  title: string;
  subtitle: string;
  icon: React.ElementType;
}

const ROUTINE_ITEMS_CONFIG: RoutineItem[] = [
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
    icon: Users,
  },
  {
    id: 'connect_within',
    letter: 'F',
    title: 'Connect Within',
    subtitle: 'Meditate for 15–30 min for creative clarity',
    icon: Sparkles,
  },
];

export const DailyRoutineChecklist = ({
  streak = 0,
  onCompleteRoutine,
}: {
  streak?: number;
  onCompleteRoutine?: () => void;
}) => {
  const { token } = useAuth();
  const todayDateStr = new Date().toISOString().split('T')[0];
  const todayKey = `routine_${todayDateStr}`;
  const todayClaimedKey = `routine_claimed_${todayDateStr}`;

  const [completedItems, setCompletedItems] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(todayKey);
        if (saved) {
          return JSON.parse(saved);
        }
      } catch {
        // ignore storage parse errors
      }
    }
    return [];
  });

  // Once all habits are checked in a day, user is locked from checking multiple times
  const [isDayDone, setIsDayDone] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      try {
        if (localStorage.getItem(todayClaimedKey) === 'true') return true;
        const saved = localStorage.getItem(todayKey);
        if (saved && JSON.parse(saved).length === ROUTINE_ITEMS_CONFIG.length) {
          return true;
        }
      } catch {
        // ignore
      }
    }
    return false;
  });

  const [isSyncing, setIsSyncing] = useState(false);
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  const syncRoutineWithBackend = async (habits: string[]) => {
    if (!token) return;
    setIsSyncing(true);
    try {
      const res = await fetch(`${API_BASE_URL}/dashboard/student/routine`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          completedHabits: habits,
          date: todayDateStr,
        }),
      });
      const data = await res.json();
      if (data.success && onCompleteRoutine) {
        onCompleteRoutine();
      }
    } catch (err) {
      console.error('Error syncing routine with database:', err);
    } finally {
      setIsSyncing(false);
    }
  };

  const toggleItem = (id: string) => {
    // If today is already fully completed, do not allow multiple toggling
    if (isDayDone) return;

    let next: string[];
    if (completedItems.includes(id)) {
      next = completedItems.filter((i) => i !== id);
    } else {
      next = [...completedItems, id];
    }
    setCompletedItems(next);
    try {
      localStorage.setItem(todayKey, JSON.stringify(next));
    } catch {
      // ignore storage errors
    }

    // When all habits are completed for the day: lock for today and sync XP once
    if (next.length === ROUTINE_ITEMS_CONFIG.length) {
      setIsDayDone(true);
      try {
        localStorage.setItem(todayClaimedKey, 'true');
      } catch {
        // ignore
      }
      syncRoutineWithBackend(next);
    }
  };

  const progressPercent = Math.round(
    (completedItems.length / ROUTINE_ITEMS_CONFIG.length) * 100
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white/95 border border-[#ecdccb] p-5 sm:p-6 rounded-3xl h-full shadow-[0_10px_30px_-12px_rgba(90,55,20,0.08)] flex flex-col justify-between"
    >
      <div>
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <div className="flex items-center gap-1.5">
              <Flame size={18} className="text-[#e86034] shrink-0" />
              <h2 className="text-base sm:text-lg font-bold text-stone-900 leading-tight">
                Daily Habit Streak
              </h2>
            </div>
            <p className="text-[11px] sm:text-xs text-stone-500 mt-0.5 leading-snug">
              Complete your 6 habits daily to build consistency.
            </p>
          </div>

          {/* Right badge: Flame + Days count */}
          <div className="flex flex-col items-center justify-center shrink-0">
            <Flame size={16} className="text-[#e86034]" />
            <span className="text-[11px] sm:text-xs font-black text-stone-900 leading-tight">
              {streak || 0} Days
            </span>
          </div>
        </div>

        {/* Progress Bar & Text */}
        <div className="space-y-1.5 mt-2.5">
          <div className="flex justify-between text-[11px] sm:text-xs font-semibold text-stone-600">
            <span>
              {completedItems.length} of {ROUTINE_ITEMS_CONFIG.length} Habits Completed
            </span>
            <span className="text-stone-900 font-bold">{progressPercent}%</span>
          </div>
          <div className="w-full bg-[#f4eee6] rounded-full h-1.5 sm:h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#942008] via-[#c4431d] to-[#ea580c] h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* 6 Habit Cards with Icon, Title, and Checklist button below title */}
        <div className="mt-3.5 sm:mt-4">
          <div className="grid grid-cols-6 gap-1.5 sm:gap-2 items-start">
            {ROUTINE_ITEMS_CONFIG.map((item) => {
              const isDone = completedItems.includes(item.id);
              const Icon = item.icon;

              return (
                <div
                  key={item.id}
                  className="relative flex flex-col items-center"
                  onMouseEnter={() => setActiveTooltip(item.id)}
                  onMouseLeave={() => setActiveTooltip(null)}
                >
                  {/* Top Habit Icon Button (Toggle on click) */}
                  <button
                    type="button"
                    onClick={() => toggleItem(item.id)}
                    disabled={isDayDone || isSyncing}
                    className={`w-10 h-10 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center transition-all shadow-2xs cursor-pointer ${
                      isDone
                        ? 'bg-[#e86034] text-white border border-[#d24e23] scale-105'
                        : 'bg-[#fff4ed] text-[#e86034] border border-[#fcdcd0] hover:bg-[#ffe8dc] hover:scale-105'
                    } ${isDayDone ? 'cursor-default' : ''}`}
                    title={
                      isDayDone
                        ? 'Completed for today (locked)'
                        : isDone
                        ? '✓ Completed (Click to undo)'
                        : `Click to complete ${item.title}`
                    }
                  >
                    {isDone ? (
                      <Check size={18} strokeWidth={3} />
                    ) : (
                      <Icon size={18} />
                    )}
                  </button>

                  {/* Habit Title */}
                  <span
                    className={`text-[9px] sm:text-[10px] font-bold text-center leading-tight mt-1.5 line-clamp-2 px-0.5 transition-colors ${
                      isDone ? 'text-[#c4431d]' : 'text-stone-700'
                    }`}
                    title={item.title}
                  >
                    {item.title}
                  </span>

                  {/* Hover Tooltip showing habit details */}
                  {activeTooltip === item.id && (
                    <div className="absolute bottom-full mb-2 z-30 pointer-events-none w-44 p-2 rounded-xl bg-stone-900 text-white text-[10px] shadow-xl text-center animate-in fade-in zoom-in-95 duration-150">
                      <p className="font-bold text-[#fde5d6]">
                        {item.title}
                      </p>
                      <p className="text-stone-300 mt-0.5 leading-tight text-[9px]">
                        {item.subtitle}
                      </p>
                      <p className="text-[#fbdcd0] font-semibold mt-1">
                        {isDayDone
                          ? '✓ Completed today (Locked)'
                          : isDone
                          ? '✓ Done for today'
                          : '○ Click icon to mark done'}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Footer Status: single check notice when completed today */}
      <div className="mt-3 pt-2.5 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
        {isDayDone ? (
          <span className="flex items-center gap-1 font-bold text-emerald-600">
            <CheckCircle2 size={13} />
            <span>All 6 habits completed today! (+10 XP claimed)</span>
          </span>
        ) : (
          <span className="flex items-center gap-1 font-medium text-stone-400">
            <span className="text-emerald-500 font-bold">✓</span> Complete all 6 daily for streak
          </span>
        )}
        <span className="text-[#e86034] font-bold">
          {isDayDone ? 'Completed' : '+10 XP / day'}
        </span>
      </div>
    </motion.div>
  );
};
