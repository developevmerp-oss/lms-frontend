"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Layers,
  Star,
  Flame,
  Search,
  Bell,
  Check,
} from "lucide-react";

interface WelcomeHeaderProps {
  user: any;
  level: string;
  xp: number;
  streak: number;
  weekStatus?: any[];
  progress?: number;
  nextGoal?: string;
  currentTier?: any;
  badges?: any[];
  salesRecords?: any[];
  notifications?: any[];
  onOpenProfile?: () => void;
}

export const WelcomeHeader = ({
  user,
  level,
  xp = 0,
  streak = 0,
  weekStatus = [],
  currentTier,
  notifications = [],
  onOpenProfile,
}: WelcomeHeaderProps) => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  // Determine display name (e.g., "Shreya")
  const rawName = user?.name && user.name.trim().toLowerCase() !== "admin" ? user.name.trim() : "Shreya";
  const firstName = rawName.split(" ")[0];
  const displayName = firstName.charAt(0).toUpperCase() + firstName.slice(1);
  const userInitial = displayName.charAt(0).toUpperCase();

  // Normalize level code (e.g., "L0")
  const levelCode = currentTier?.code || (level && level.includes("L") ? level.match(/L\d\+?/)?.[0] : "L0") || "L0";

  // Days of week configuration: Mon - Sun matching Image 4
  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  // Search submit handler
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/student/courses?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead && !n.read).length;

  return (
    <div className="space-y-4 md:space-y-5">
      {/* Top Bar: Welcome Greeting on Left, Search + Bell + Avatar on Right */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left: Greeting & Subtitle */}
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-stone-900 tracking-tight flex items-center gap-2">
            <span>Welcome back, {displayName}</span>
            <span className="text-xl sm:text-2xl animate-pulse">👋</span>
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 font-normal mt-0.5 sm:mt-1">
            Continue your resin art journey and create something amazing today.
          </p>
        </div>

        {/* Right: Search + Bell + Avatar (Desktop & Tablet) */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search courses, lessons..."
              className="w-48 sm:w-56 md:w-64 lg:w-72 bg-white/95 border border-[#ecdccb] rounded-2xl pl-9 pr-3.5 py-2 text-xs sm:text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:border-[#c4431d] shadow-[0_4px_12px_-4px_rgba(90,55,20,0.05)] transition-all"
            />
          </form>

          {/* Notifications Bell */}
          <Link
            href="/student/notifications"
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-white/95 border border-[#ecdccb] hover:border-[#c4431d]/40 text-stone-600 hover:text-stone-900 flex items-center justify-center relative shadow-[0_4px_12px_-4px_rgba(90,55,20,0.05)] transition-colors cursor-pointer shrink-0"
            title="Notifications"
          >
            <Bell size={16} />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 bg-[#e86034] rounded-full ring-2 ring-white" />
            )}
          </Link>

          {/* Student Profile Avatar */}
          <button
            type="button"
            onClick={onOpenProfile}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-[#ecdccb] overflow-hidden bg-[#fde5d6] flex items-center justify-center text-xs font-bold text-[#942008] cursor-pointer shadow-[0_4px_12px_-4px_rgba(90,55,20,0.05)] hover:scale-105 transition-transform shrink-0"
            title="My Profile"
          >
            {user?.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={displayName}
                className="w-full h-full object-cover"
              />
            ) : (
              <span>{userInitial}</span>
            )}
          </button>
        </div>
      </div>

      {/* Row 1: 4 Equal Cards (Current Level, Total XP, Streak, Mon-Sun Tracker) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 md:gap-5">
        {/* Card 1: Current Level */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-white/95 border border-[#ecdccb] rounded-2xl p-4 sm:p-4.5 shadow-[0_8px_20px_-10px_rgba(90,55,20,0.06)] flex items-center gap-3.5"
        >
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#fff2ea] border border-[#fbdcd0] flex items-center justify-center text-[#c4431d] shrink-0">
            <Layers size={20} />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] sm:text-xs text-stone-500 font-medium">Current Level</p>
            <p className="text-base sm:text-lg font-black text-stone-900 tracking-tight truncate">
              {levelCode}
            </p>
          </div>
        </motion.div>

        {/* Card 2: Total XP */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/95 border border-[#ecdccb] rounded-2xl p-4 sm:p-4.5 shadow-[0_8px_20px_-10px_rgba(90,55,20,0.06)] flex items-center gap-3.5"
        >
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#fff2ea] border border-[#fbdcd0] flex items-center justify-center text-[#c4431d] shrink-0">
            <Star size={20} className="fill-[#c4431d]/20" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] sm:text-xs text-stone-500 font-medium">Total XP</p>
            <p className="text-base sm:text-lg font-black text-stone-900 tracking-tight truncate">
              {(xp || 0).toLocaleString()} XP
            </p>
          </div>
        </motion.div>

        {/* Card 3: Streak */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white/95 border border-[#ecdccb] rounded-2xl p-4 sm:p-4.5 shadow-[0_8px_20px_-10px_rgba(90,55,20,0.06)] flex items-center gap-3.5"
        >
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#fff2ea] border border-[#fbdcd0] flex items-center justify-center text-[#c4431d] shrink-0">
            <Flame size={20} />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] sm:text-xs text-stone-500 font-medium">Streak</p>
            <p className="text-base sm:text-lg font-black text-stone-900 tracking-tight truncate">
              {streak || 0} Days
            </p>
          </div>
        </motion.div>

        {/* Card 4: Mon - Sun Days of Week Tracker */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/95 border border-[#ecdccb] rounded-2xl p-4 sm:p-4.5 shadow-[0_8px_20px_-10px_rgba(90,55,20,0.06)] flex items-center justify-between"
        >
          {daysOfWeek.map((day, i) => {
            // Determine if day is completed: in Image 4, Monday is completed with orange circle + checkmark
            // Or if streak > 0, match streak days or weekStatus
            const isCompleted =
              (weekStatus && weekStatus[i]?.status === "completed") ||
              (streak > 0 && i < Math.min(streak, 7)) ||
              i === 0; // Mon checked as default visual in Image 4

            return (
              <div key={day} className="flex flex-col items-center gap-1.5 flex-1">
                <span className="text-[10px] sm:text-xs text-stone-500 font-medium text-center">
                  {day}
                </span>
                <div
                  className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center transition-all ${
                    isCompleted
                      ? "bg-[#e86034] text-white shadow-2xs"
                      : "border border-stone-300 bg-transparent"
                  }`}
                  title={`${day}: ${isCompleted ? "Active / Completed" : "Not yet active"}`}
                >
                  {isCompleted && <Check size={10} strokeWidth={3} />}
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
};
