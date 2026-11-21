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
  const [showDropdown, setShowDropdown] = useState(false);
  const [todayChecked, setTodayChecked] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("habit_today_checked_" + new Date().toDateString());
        if (stored !== null) return stored === "true";
      } catch (_) { }
    }
    return true;
  });

  const handleToggleToday = () => {
    const next = !todayChecked;
    setTodayChecked(next);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("habit_today_checked_" + new Date().toDateString(), String(next));
      } catch (_) { }
    }
  };

  const formatMMDDYYYY = (d: Date) => {
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${mm}-${dd}-${yyyy}`;
  };

  // Membership Levels Config for targeted search
  const MEMBERSHIP_LEVELS = [
    { code: "L0", tag: "L0", name: "Fast Track: Resin FastStart Bundle", sub: "Foundations, chemistry, and first creations" },
    { code: "L1", tag: "L1", name: "Silver Membership: Explore Membership", sub: "Core techniques, first client sale, and portfolio building" },
    { code: "L2", tag: "L2", name: "Gold Membership: Master Membership", sub: "High-ticket geode clocks, bridal preservation, and consistent revenue" },
    { code: "L3", tag: "L3", name: "Diamond Membership: Renaissance Certification", sub: "Scale beyond ₹50K/month, furniture river tables, and corporate orders" },
  ];

  // Determine display name (e.g., "Shreya")
  const rawName = user?.name && user.name.trim().toLowerCase() !== "admin" ? user.name.trim() : "Shreya";
  const firstName = rawName.split(" ")[0];
  const displayName = firstName.charAt(0).toUpperCase() + firstName.slice(1);
  const userInitial = displayName.charAt(0).toUpperCase();

  // Normalize level code (e.g., "L0")
  const levelCode = currentTier?.code || (level && level.includes("L") ? level.match(/L\d\+?/)?.[0] : "L0") || "L0";

  // Days of week configuration: Mon - Sun matching Image 4
  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  // Compute dates for each day in the current week (Mon - Sun)
  const weekDaysWithDates = (() => {
    const now = new Date();
    // In JS getDay(): 0 is Sunday, 1 is Monday ... 6 is Saturday
    // Convert to Monday = 0, ..., Sunday = 6
    const currentDayIndex = (now.getDay() + 6) % 7;
    const monday = new Date(now);
    monday.setDate(now.getDate() - currentDayIndex);

    return daysOfWeek.map((dayName, idx) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + idx);
      const isToday = d.toDateString() === now.toDateString();
      return {
        day: dayName,
        dateNum: d.getDate(),
        fullDate: d.toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
        isToday,
      };
    });
  })();

  // Filter membership levels based on search query
  const filteredLevels = MEMBERSHIP_LEVELS.filter((lvl) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      lvl.code.toLowerCase().includes(q) ||
      lvl.name.toLowerCase().includes(q) ||
      lvl.sub.toLowerCase().includes(q)
    );
  });

  const navigateToLevel = (code: string) => {
    setSearchQuery("");
    setShowDropdown(false);
    router.push(`/student/courses?level=${code}&search=${encodeURIComponent(code)}`);
  };

  // Search submit handler: user only searches level membership card name
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim().toLowerCase();
    if (!q) return;

    const matched = MEMBERSHIP_LEVELS.find(
      (lvl) =>
        lvl.code.toLowerCase() === q ||
        lvl.name.toLowerCase().includes(q) ||
        lvl.sub.toLowerCase().includes(q) ||
        q.includes(lvl.code.toLowerCase())
    ) || filteredLevels[0] || MEMBERSHIP_LEVELS[0];

    navigateToLevel(matched.code);
  };

  const unreadCount = notifications.filter((n) => !n.isRead && !n.read).length;

  return (
    <div className="space-y-4 md:space-y-5">
      {/* Top Bar: Welcome Greeting on Left, Search + Bell + Avatar on Right */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left: Greeting & Subtitle */}
        <div>
          {/*
          <div className="flex items-center gap-1.5 text-xs text-stone-500 mb-1 font-medium">
            <span>Student Hub</span>
            <span className="text-stone-300">/</span>
            <span className="text-stone-700 font-medium">Dashboard</span>
          </div>
          */}
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-stone-900 tracking-tight">
            Welcome back, {displayName}
            {/* <span className="text-xl sm:text-2xl animate-pulse">👋</span> */}
          </h1>
          {/*
          <p className="text-stone-500 text-xs sm:text-sm mt-0.5">
            Continue your resin art journey and create something amazing today.
          </p>
          */}
        </div>

        {/* Right: Search + Bell + Avatar (Desktop & Tablet) */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          {/* Search Bar: Level Membership Card Search */}
          <div className="relative">
            <form onSubmit={handleSearchSubmit} className="relative">
              <Search
                size={15}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none"
              />
              <input
                type="text"
                value={searchQuery}
                onFocus={() => setShowDropdown(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowDropdown(true);
                }}
                placeholder="Search level membership (L0, L1, L2, L3)..."
                className="w-52 sm:w-60 md:w-68 lg:w-80 bg-white/95 border border-[#ecdccb] rounded-2xl pl-9 pr-3.5 py-2 text-xs sm:text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:border-[#c4431d] shadow-[0_4px_12px_-4px_rgba(90,55,20,0.05)] transition-all"
              />
            </form>

            {/* Level Membership Autocomplete Dropdown */}
            {showDropdown && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setShowDropdown(false)}
                />
                <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-[#ecdccb] rounded-2xl shadow-xl z-40 p-2 space-y-1 animate-in fade-in duration-150 max-h-64 overflow-y-auto custom-scrollbar">
                  <div className="px-2.5 py-1 text-xs font-bold text-stone-400 uppercase tracking-wider">
                    Membership Level Cards
                  </div>
                  {filteredLevels.length === 0 ? (
                    <div className="px-3 py-2 text-xs text-stone-400 text-center">
                      No matching level found. Try L0, L1, L2, or L3.
                    </div>
                  ) : (
                    filteredLevels.map((lvl) => (
                      <button
                        key={lvl.code}
                        type="button"
                        onClick={() => navigateToLevel(lvl.code)}
                        className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#fff5ee] transition-colors flex items-center justify-between group cursor-pointer"
                      >
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="px-1.5 py-0.5 rounded-md text-xs font-black bg-[#fde5d6] text-[#942008] border border-[#f5ded0]">
                              {lvl.tag}
                            </span>
                            <span className="text-xs font-bold text-stone-800 group-hover:text-[#c4431d] transition-colors">
                              {lvl.name}
                            </span>
                          </div>
                          <p className="text-xs text-stone-400 mt-0.5 pl-6">
                            {lvl.sub}
                          </p>
                        </div>
                        <span className="text-xs font-bold text-[#c4431d] opacity-0 group-hover:opacity-100 transition-opacity">
                          Go to Course →
                        </span>
                      </button>
                    ))
                  )}
                </div>
              </>
            )}
          </div>

          {/*
          // Notifications Bell & Profile Avatar commented out from dashboard page per user request (already available in top bar)
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
          */}
        </div>
      </div>

      {/* Row 1: 4 Cards (All cards unified in one size and height) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 md:gap-5 items-stretch">
        {/* Card 1: Current Level */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-white/95 border border-[#ecdccb] rounded-2xl p-4 sm:p-4.5 h-full min-h-[108px] sm:min-h-[114px] shadow-[0_8px_20px_-10px_rgba(90,55,20,0.06)] flex items-center gap-3.5"
        >
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-[#fff2ea] border border-[#fbdcd0] flex items-center justify-center text-[#c4431d] shrink-0 shadow-2xs">
            <Layers size={22} />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-stone-500 font-medium">Current Level</p>
            <p className="text-base sm:text-lg font-black text-stone-900 tracking-tight truncate mt-0.5">
              {levelCode}
            </p>
          </div>
        </motion.div>

        {/* Card 2: Total XP */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/95 border border-[#ecdccb] rounded-2xl p-4 sm:p-4.5 h-full min-h-[108px] sm:min-h-[114px] shadow-[0_8px_20px_-10px_rgba(90,55,20,0.06)] flex items-center gap-3.5"
        >
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-[#fff2ea] border border-[#fbdcd0] flex items-center justify-center text-[#c4431d] shrink-0 shadow-2xs">
            <Star size={22} className="fill-[#c4431d]/20" />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-stone-500 font-medium">Total XP</p>
            <p className="text-base sm:text-lg font-black text-stone-900 tracking-tight truncate mt-0.5">
              {(xp || 0).toLocaleString()} XP
            </p>
          </div>
        </motion.div>

        {/* Card 3: Streak with Today's Date */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white/95 border border-[#ecdccb] rounded-2xl p-4 sm:p-4.5 h-full min-h-[108px] sm:min-h-[114px] shadow-[0_8px_20px_-10px_rgba(90,55,20,0.06)] flex items-center gap-3.5"
        >
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-[#fff2ea] border border-[#fbdcd0] flex items-center justify-center text-[#c4431d] shrink-0 shadow-2xs">
            <Flame size={22} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between">
              <p className="text-xs text-stone-500 font-medium">Streak</p>
              <span className="text-xs text-[#c4431d] font-bold bg-[#fff2ea] px-1.5 py-0.5 rounded border border-[#fbdcd0]">
                Today
              </span>
            </div>
            <p className="text-base sm:text-lg font-black text-stone-900 tracking-tight truncate mt-0.5">
              {streak || 0} Days
            </p>
            <p className="text-xs text-stone-500 font-medium mt-0.5 truncate">
              {new Date().toLocaleDateString("en-IN", {
                weekday: "short",
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </p>
          </div>
        </motion.div>

        {/* Card 4: Mon - Sun Days of Week Tracker with Top Right mm-dd-yyyy Date */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/95 border border-[#ecdccb] rounded-2xl p-4 sm:p-4.5 h-full min-h-[108px] sm:min-h-[114px] shadow-[0_8px_20px_-10px_rgba(90,55,20,0.06)] flex flex-col justify-between"
        >
          {/* Card Top: Activity Label on Left, mm-dd-yyyy Date on Right */}
          <div className="flex items-center justify-between mb-2 sm:mb-2.5">
            <p className="text-xs text-stone-500 font-medium">Activity</p>
            <span className="text-xs font-bold text-[#c4431d] bg-[#fff2ea] px-2 py-0.5 rounded-md border border-[#fbdcd0] font-mono">
              {formatMMDDYYYY(new Date())}
            </span>
          </div>

          {/* Row of 7 Days: Mon - Sun */}
          <div className="flex items-center justify-between gap-1">
            {weekDaysWithDates.map((item, i) => {
              const currentDayIndex = (new Date().getDay() + 6) % 7;
              const isPastDay = i < currentDayIndex;
              const isToday = item.isToday;

              const isCompleted = isToday
                ? todayChecked
                : (weekStatus && weekStatus[i]?.status === "completed") ||
                  (streak > 0 && isPastDay) ||
                  isPastDay;

              return (
                <div
                  key={item.day}
                  onClick={isToday ? handleToggleToday : undefined}
                  className={`flex flex-col items-center gap-1.5 flex-1 min-w-0 ${
                    isToday ? "cursor-pointer select-none group" : "cursor-default"
                  }`}
                  title={
                    isToday
                      ? `Today (${formatMMDDYYYY(new Date())}) - Click to toggle`
                      : `${item.day}`
                  }
                >
                  <span
                    className={`text-[0.6875rem] font-bold text-center truncate ${
                      isToday ? "text-[#c4431d]" : "text-stone-400"
                    }`}
                  >
                    {item.day}
                  </span>
                  <div
                    className={`w-5 h-5 sm:w-5.5 sm:h-5.5 rounded-full flex items-center justify-center transition-all ${
                      isCompleted
                        ? "bg-[#e86034] text-white shadow-2xs"
                        : "border border-stone-300 bg-transparent"
                    } ${
                      isToday
                        ? "ring-2 ring-[#c4431d]/30 group-hover:scale-110 active:scale-95 cursor-pointer"
                        : "opacity-80"
                    }`}
                  >
                    {isCompleted && <Check size={11} strokeWidth={3} />}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
