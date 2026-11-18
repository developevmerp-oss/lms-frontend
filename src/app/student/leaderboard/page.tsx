"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { StudentNav } from "@/components/layout/StudentNav";
import { motion } from "framer-motion";

import { API_BASE_URL } from "@/config/api";
import { getLevelCode } from "@/components/layout/StudentNav";

/* Fallback avatar portraits for students without avatars */
const DEFAULT_AVATARS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=200&auto=format&fit=crop",
];

const getAvatarSrc = (student: any, index: number) => {
  if (student?.avatarUrl && typeof student.avatarUrl === "string" && student.avatarUrl.trim() !== "") {
    return student.avatarUrl;
  }
  return DEFAULT_AVATARS[index % DEFAULT_AVATARS.length];
};

/* Golden crown matching reference image #2 */
const GoldenCrown = () => (
  <svg
    viewBox="0 0 60 42"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-8 h-6 sm:w-11 sm:h-8 md:w-14 md:h-10 drop-shadow-md select-none"
  >
    <defs>
      <linearGradient id="goldCrownGradient" x1="50%" y1="0%" x2="50%" y2="100%">
        <stop offset="0%" stopColor="#FDE047" />
        <stop offset="45%" stopColor="#F59E0B" />
        <stop offset="100%" stopColor="#D97706" />
      </linearGradient>
    </defs>
    {/* 5 balls on tips */}
    <circle cx="6" cy="16" r="2.8" fill="url(#goldCrownGradient)" />
    <circle cx="17.5" cy="9" r="3" fill="url(#goldCrownGradient)" />
    <circle cx="30" cy="4" r="3.5" fill="url(#goldCrownGradient)" />
    <circle cx="42.5" cy="9" r="3" fill="url(#goldCrownGradient)" />
    <circle cx="54" cy="16" r="2.8" fill="url(#goldCrownGradient)" />
    {/* Crown body */}
    <path
      d="M6 18 L13 28 L17.5 11 L24 27 L30 6 L36 27 L42.5 11 L47 28 L54 18 L51 34 C39 37.5 21 37.5 9 34 Z"
      fill="url(#goldCrownGradient)"
    />
    {/* Crown bottom trim band */}
    <path
      d="M9 34 C21 37.5 39 37.5 51 34 C50 36.5 49 37 47 38 C37 40.5 23 40.5 13 38 C11 37 10 36.5 9 34 Z"
      fill="url(#goldCrownGradient)"
      opacity="0.9"
    />
  </svg>
);

export default function StudentLeaderboard() {
  const { user, token, logout } = useAuth();
  const [students, setStudents] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({ points: 0, notifications: [] });

  useEffect(() => {
    if (!token) return;

    // Fetch Nav Stats
    fetch(`${API_BASE_URL}/dashboard/student`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data && !data.message) {
          setStats({
            points: data.points ?? 0,
            notifications: data.notifications ?? [],
            membershipLevel: data.membershipLevel,
            rank: data.rank,
            currentTier: data.currentTier,
            ...data,
          });
        }
      })
      .catch(err => console.error("Error fetching stats", err));

    // Fetch Leaderboard
    fetch(`${API_BASE_URL}/leaderboard`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setStudents(data);
      })
      .catch(err => console.error(err));
  }, [token]);

  const candidateLevels = [
    stats?.membershipLevel,
    user?.membershipLevel,
    stats?.currentTier?.code,
    stats?.currentTier?.name,
    user?.level,
    user?.rank,
    stats?.rank,
  ].filter(Boolean);

  let effectiveLevel = candidateLevels[0] || "";
  for (const cand of candidateLevels) {
    if (getLevelCode(cand, stats.points || 0) !== "GENERAL") {
      effectiveLevel = cand;
      break;
    }
  }

  const studentLevelCode = getLevelCode(effectiveLevel, stats.points || 0);
  const isGeneral = studentLevelCode === "GENERAL";

  const getLevelName = () => {
    if (isGeneral) return "General Member";
    if (effectiveLevel) return effectiveLevel;
    if (stats?.membershipLevel) return stats.membershipLevel;
    if (user?.membershipLevel) return user.membershipLevel;
    if (stats?.rank) return stats.rank;
    if (stats?.currentTier?.name) {
      return `${stats.currentTier.name} (${stats.currentTier.code})`;
    }
    return "Fast Track (L0)";
  };

  const top3 = students.slice(0, 3);
  const rest = students.slice(3);

  const top1 = top3[0];
  const top2 = top3[1];
  const top3rd = top3[2];

  return (
    <div
      className="min-h-screen bg-[#faf8f5] text-stone-900 flex flex-col transition-colors lg:pl-[284px]"
      style={{
        backgroundColor: "#faf8f5",
        backgroundImage: "radial-gradient(circle, #e2ded4 1.5px, transparent 1.5px)",
        backgroundSize: "24px 24px",
        backgroundAttachment: "fixed",
      }}
    >
      <StudentNav 
        user={user || stats} 
        level={getLevelName()} 
        points={stats.points} 
        logout={logout} 
        notifications={stats.notifications}
      />

      <main className="w-full px-4 sm:px-5 lg:px-5 py-5 sm:py-6">
        {/* Header: Left aligned, no trophy icon, responsive typography */}
        <header className="mb-6 sm:mb-8 text-left">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-stone-900 tracking-tight mb-1.5 sm:mb-2">
            Global Leaderboard
          </h1>
          <p className="text-stone-500 text-xs sm:text-sm md:text-base font-normal">
            Compete with artists worldwide and earn your spot at the top.
          </p>
        </header>

        {/* Top 3 Podium Cards - matching reference image #2 */}
        {top3.length > 0 && (
          <div className="flex justify-center items-end gap-2.5 sm:gap-6 md:gap-8 mb-10 sm:mb-14 pt-8 sm:pt-12">
            {/* 2nd Place (Left) */}
            {top2 && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="w-1/3 max-w-[240px] flex flex-col items-center"
              >
                {/* Avatar + Badge */}
                <div className="relative -mb-8 sm:-mb-12 md:-mb-14 z-10">
                  <div className="w-16 h-16 sm:w-22 sm:h-22 md:w-26 md:h-26 rounded-full border-3 sm:border-4 border-white shadow-md overflow-hidden bg-stone-100">
                    <img
                      src={getAvatarSrc(top2, 1)}
                      alt={top2.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = DEFAULT_AVATARS[1];
                      }}
                    />
                  </div>
                  <div className="absolute -bottom-2 sm:-bottom-2.5 left-1/2 -translate-x-1/2 bg-gradient-to-b from-[#A0AEC0] to-[#718096] text-white w-5 h-5 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center font-black text-[0.6875rem] sm:text-xs md:text-sm border-2 border-white shadow-sm z-20">
                    2
                  </div>
                </div>

                {/* Card Box */}
                <div className="w-full bg-white rounded-2xl sm:rounded-3xl border border-stone-200/80 pt-10 sm:pt-14 md:pt-16 pb-4 sm:pb-6 px-1.5 sm:px-3 md:px-4 text-center shadow-xs">
                  <p className="font-bold text-stone-900 text-xs sm:text-sm md:text-base lg:text-lg truncate w-full">
                    {top2.name}
                  </p>
                  <p className="font-semibold text-stone-700 text-[0.6875rem] sm:text-xs md:text-sm mt-1 sm:mt-1.5">
                    {top2.streak || 1} Days
                  </p>
                  <p className="font-bold text-stone-900 text-[0.6875rem] sm:text-xs md:text-sm mt-0.5 sm:mt-1">
                    {(top2.points || 0).toLocaleString()} XP
                  </p>
                </div>
              </motion.div>
            )}

            {/* 1st Place (Center - Elevated & Champion Gold) */}
            {top1 && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="w-1/3 max-w-[260px] flex flex-col items-center z-10"
              >
                {/* Avatar + Crown + Badge */}
                <div className="relative -mb-10 sm:-mb-14 md:-mb-16 z-20">
                  {/* Golden Crown */}
                  <div className="absolute -top-6 sm:-top-8 md:-top-10 left-1/2 -translate-x-1/2 z-30">
                    <GoldenCrown />
                  </div>

                  {/* Avatar Circle */}
                  <div className="w-20 h-20 sm:w-26 sm:h-26 md:w-32 md:h-32 rounded-full border-3 sm:border-4 border-[#FBBF24] shadow-lg shadow-amber-300/30 overflow-hidden bg-stone-100">
                    <img
                      src={getAvatarSrc(top1, 0)}
                      alt={top1.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = DEFAULT_AVATARS[0];
                      }}
                    />
                  </div>

                  {/* 1 Badge */}
                  <div className="absolute -bottom-2.5 sm:-bottom-3 left-1/2 -translate-x-1/2 bg-gradient-to-b from-[#FBBF24] to-[#F59E0B] text-white w-6 h-6 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center font-black text-xs sm:text-sm md:text-base border-2 border-white shadow-sm z-30">
                    1
                  </div>
                </div>

                {/* Card Box */}
                <div className="w-full bg-gradient-to-b from-[#FFFDF7] via-[#FFF9EE] to-[#FFF3E3] rounded-2xl sm:rounded-3xl border border-[#FDE68A] pt-12 sm:pt-16 md:pt-18 pb-5 sm:pb-7 px-2 sm:px-3 md:px-4 text-center shadow-md shadow-amber-900/5">
                  <p className="font-bold text-stone-900 text-xs sm:text-base md:text-lg lg:text-xl truncate w-full">
                    {top1.name}
                  </p>
                  <p className="font-semibold text-stone-700 text-[0.6875rem] sm:text-xs md:text-sm mt-1 sm:mt-1.5">
                    {top1.streak || 1} Days
                  </p>
                  <p className="font-bold text-stone-900 text-xs sm:text-sm md:text-base mt-0.5 sm:mt-1">
                    {(top1.points || 0).toLocaleString()} XP
                  </p>
                </div>
              </motion.div>
            )}

            {/* 3rd Place (Right) */}
            {top3rd && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="w-1/3 max-w-[240px] flex flex-col items-center"
              >
                {/* Avatar + Badge */}
                <div className="relative -mb-8 sm:-mb-12 md:-mb-14 z-10">
                  <div className="w-16 h-16 sm:w-22 sm:h-22 md:w-26 md:h-26 rounded-full border-3 sm:border-4 border-[#D97706]/40 shadow-md overflow-hidden bg-stone-100">
                    <img
                      src={getAvatarSrc(top3rd, 2)}
                      alt={top3rd.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = DEFAULT_AVATARS[2];
                      }}
                    />
                  </div>
                  <div className="absolute -bottom-2 sm:-bottom-2.5 left-1/2 -translate-x-1/2 bg-gradient-to-b from-[#D97706] to-[#B45309] text-white w-5 h-5 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center font-black text-[0.6875rem] sm:text-xs md:text-sm border-2 border-white shadow-sm z-20">
                    3
                  </div>
                </div>

                {/* Card Box */}
                <div className="w-full bg-white rounded-2xl sm:rounded-3xl border border-stone-200/80 pt-10 sm:pt-14 md:pt-16 pb-4 sm:pb-6 px-1.5 sm:px-3 md:px-4 text-center shadow-xs">
                  <p className="font-bold text-stone-900 text-xs sm:text-sm md:text-base lg:text-lg truncate w-full">
                    {top3rd.name}
                  </p>
                  <p className="font-semibold text-stone-700 text-[0.6875rem] sm:text-xs md:text-sm mt-1 sm:mt-1.5">
                    {top3rd.streak || 1} Days
                  </p>
                  <p className="font-bold text-stone-900 text-[0.6875rem] sm:text-xs md:text-sm mt-0.5 sm:mt-1">
                    {(top3rd.points || 0).toLocaleString()} XP
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        )}

        {/* Student List Table - matching reference image #3 */}
        <div className="w-full bg-white rounded-2xl sm:rounded-3xl border border-stone-200/80 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.05)] p-3 sm:p-5 md:p-6 lg:p-8">
          {/* Table Header */}
          <div className="grid grid-cols-12 items-center px-2.5 sm:px-4 pb-3 sm:pb-4 border-b border-stone-100 text-stone-700 text-xs sm:text-sm font-bold">
            <div className="col-span-2 sm:col-span-1 text-left">Rank</div>
            <div className="col-span-4 sm:col-span-4 md:col-span-4 text-left pl-1 sm:pl-2">Student</div>
            <div className="col-span-3 sm:col-span-4 md:col-span-4 text-center">Streak</div>
            <div className="col-span-3 sm:col-span-3 md:col-span-3 text-right pr-2 sm:pr-4">XP</div>
          </div>

          {/* Table Body */}
          <div className="pt-1">
            {students.length === 0 ? (
              <div className="py-16 text-center text-stone-400 font-medium text-xs sm:text-sm md:text-base">
                Loading rankings...
              </div>
            ) : rest.length === 0 ? (
              <div className="py-12 text-center text-stone-400 font-medium text-xs sm:text-sm md:text-base">
                No other artists in the rankings yet.
              </div>
            ) : (
              rest.map((student, index) => {
                const isMe = student.id === user?.id || (Boolean(user?.email) && student.email === user?.email);
                const rankNumber = index + 4;
                const formattedRank = String(rankNumber).padStart(2, "0");
                const displayName = isMe ? "You" : student.name;

                return (
                  <motion.div
                    key={student.id || index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.03 }}
                    className={`grid grid-cols-12 items-center py-3 sm:py-3.5 md:py-4 px-2.5 sm:px-4 transition-colors ${
                      isMe
                        ? "bg-[#FFF6EF] rounded-xl sm:rounded-2xl border border-[#FDE6D2]/60 my-1 text-[#C4431D]"
                        : "border-b border-stone-100/80 last:border-b-0 hover:bg-stone-50/70"
                    }`}
                  >
                    {/* Rank (e.g. 04, 05, 08) */}
                    <div
                      className={`col-span-2 sm:col-span-1 text-left font-bold text-xs sm:text-sm md:text-base shrink-0 ${
                        isMe ? "text-[#C4431D]" : "text-stone-900"
                      }`}
                    >
                      {formattedRank}
                    </div>

                    {/* Student (Avatar + Name) */}
                    <div className="col-span-4 sm:col-span-4 md:col-span-4 flex items-center gap-2 sm:gap-3.5 pl-1 sm:pl-2 min-w-0">
                      <img
                        src={getAvatarSrc(student, rankNumber - 1)}
                        alt={displayName}
                        className="w-7 h-7 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full object-cover shrink-0 bg-stone-100"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            DEFAULT_AVATARS[(rankNumber - 1) % DEFAULT_AVATARS.length];
                        }}
                      />
                      <span
                        className={`font-semibold text-xs sm:text-sm md:text-base truncate ${
                          isMe ? "text-[#C4431D] font-bold" : "text-stone-900"
                        }`}
                      >
                        {displayName}
                      </span>
                    </div>

                    {/* Streak (e.g. 28 Days, 12 Days) */}
                    <div
                      className={`col-span-3 sm:col-span-4 md:col-span-4 text-center text-xs sm:text-sm md:text-base shrink-0 ${
                        isMe ? "text-[#C4431D] font-semibold" : "text-stone-700 font-medium sm:font-semibold"
                      }`}
                    >
                      {student.streak || 1} Days
                    </div>

                    {/* XP (e.g. 7,980 XP, 5,980 XP) */}
                    <div
                      className={`col-span-3 sm:col-span-3 md:col-span-3 text-right pr-2 sm:pr-4 font-bold text-xs sm:text-sm md:text-base shrink-0 ${
                        isMe ? "text-[#C4431D]" : "text-stone-900"
                      }`}
                    >
                      {(student.points || 0).toLocaleString()} XP
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>
      </main>
    </div>
  );
}