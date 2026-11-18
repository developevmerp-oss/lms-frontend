"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import { AdminNav } from "@/components/layout/AdminNav";
import {
  Crown,
  Flame,
  Star,
  Users,
  Layers,
  Search,
  Download,
} from "lucide-react";
import { API_BASE_URL } from "@/config/api";
import { getLevelCode } from "@/components/layout/StudentNav";

/* Podium Badges matching the reference image */
const GoldPodiumBadge = () => (
  <div className="shrink-0 flex items-center justify-center w-11 sm:w-14">
    <img
      src="/images/podium-rank1.png"
      alt="#1 Champion"
      className="w-11 sm:w-14 h-auto max-h-14 sm:max-h-16 object-contain drop-shadow-2xs select-none"
    />
  </div>
);

const SilverPodiumBadge = () => (
  <div className="shrink-0 flex items-center justify-center w-10 sm:w-12">
    <img
      src="/images/podium-rank2.png"
      alt="#2 Silver Medal"
      className="w-10 sm:w-12 h-auto max-h-14 sm:max-h-16 object-contain drop-shadow-2xs select-none"
    />
  </div>
);

const BronzePodiumBadge = () => (
  <div className="shrink-0 flex items-center justify-center w-10 sm:w-12">
    <img
      src="/images/podium-rank3.png"
      alt="#3 Bronze Medal"
      className="w-10 sm:w-12 h-auto max-h-14 sm:max-h-16 object-contain drop-shadow-2xs select-none"
    />
  </div>
);

/* Table Medal SVGs */
const SilverTableMedal = () => (
  <svg
    width="24"
    height="28"
    viewBox="0 0 24 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="shrink-0"
  >
    <path d="M8 15L6 26L10 24L13 27L11 16" fill="#64748B" opacity="0.85" />
    <path d="M16 15L18 26L14 24L11 27L13 16" fill="#475569" opacity="0.85" />
    <circle cx="12" cy="11" r="9" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1.2" />
    <circle cx="12" cy="11" r="7" stroke="#CBD5E1" strokeWidth="0.8" fill="#F8FAFC" />
    <text x="12" y="14" textAnchor="middle" fill="#334155" fontSize="8" fontWeight="900" fontFamily="sans-serif">2</text>
  </svg>
);

const BronzeTableMedal = () => (
  <svg
    width="24"
    height="28"
    viewBox="0 0 24 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="shrink-0"
  >
    <path d="M8 15L6 26L10 24L13 27L11 16" fill="#9A3412" opacity="0.85" />
    <path d="M16 15L18 26L14 24L11 27L13 16" fill="#7C2D12" opacity="0.85" />
    <circle cx="12" cy="11" r="9" fill="#FED7AA" stroke="#EA580C" strokeWidth="1.2" />
    <circle cx="12" cy="11" r="7" stroke="#FDBA74" strokeWidth="0.8" fill="#FFEDD5" />
    <text x="12" y="14" textAnchor="middle" fill="#7C2D12" fontSize="8" fontWeight="900" fontFamily="sans-serif">3</text>
  </svg>
);

export default function AdminLeaderboard() {
  const { token, user, logout } = useAuth();
  const [students, setStudents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [levelTiers, setLevelTiers] = useState<any[]>([]);

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [rankingPeriod, setRankingPeriod] = useState<"weekly" | "monthly" | "all">("all");
  const [selectedLevel, setSelectedLevel] = useState("all");

  useEffect(() => {
    if (!token) return;

    // Fetch leaderboard students
    fetch(`${API_BASE_URL}/leaderboard`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setStudents(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });

    // Fetch dynamic level tiers from database
    fetch(`${API_BASE_URL}/admin/levels`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setLevelTiers(data);
        } else {
          fetch(`${API_BASE_URL}/dashboard/levels`)
            .then((r) => r.json())
            .then((pubData) => {
              if (Array.isArray(pubData)) setLevelTiers(pubData);
            })
            .catch(() => {});
        }
      })
      .catch(() => {
        fetch(`${API_BASE_URL}/dashboard/levels`)
          .then((r) => r.json())
          .then((pubData) => {
            if (Array.isArray(pubData)) setLevelTiers(pubData);
          })
          .catch(() => {});
      });
  }, [token]);

  const getStudentLevelBadge = (student: any) => {
    if (!student) {
      return { label: "General", color: "text-stone-600 border-stone-200 bg-stone-100" };
    }
    const candidate = (student.membershipLevel || student.rank || "").trim();
    const code = getLevelCode(candidate, student.points || 0);

    const dbTier = levelTiers.find(
      (t: any) =>
        (t.code && t.code.toUpperCase() === code) ||
        (t.name && candidate.toUpperCase().includes(t.name.toUpperCase())) ||
        (t.code && candidate.toUpperCase().includes(t.code.toUpperCase()))
    );

    if (dbTier) {
      const colorMap: Record<string, string> = {
        purple: "text-purple-700 border-purple-200 bg-purple-50",
        cyan: "text-cyan-700 border-cyan-200 bg-cyan-50",
        yellow: "text-amber-800 border-amber-200 bg-amber-50",
        amber: "text-amber-800 border-amber-200 bg-amber-50",
        slate: "text-stone-700 border-stone-200 bg-stone-50",
        emerald: "text-emerald-700 border-emerald-200 bg-emerald-50",
        orange: "text-[#942008] border-[#f5ded0] bg-[#fde5d6]",
      };
      const color = colorMap[dbTier.badgeColor] || "text-[#942008] border-[#f5ded0] bg-[#fde5d6]";
      return {
        label: dbTier.name || candidate || "General Member",
        color,
      };
    }

    if (code === "L3+" || code.includes("L3+")) {
      return { label: student.rank || "Masters Club", color: "text-purple-700 border-purple-200 bg-purple-50" };
    }
    if (code === "L3") {
      return { label: student.rank || "Diamond Club", color: "text-cyan-700 border-cyan-200 bg-cyan-50" };
    }
    if (code === "L2") {
      return { label: student.rank || "Gold Member", color: "text-amber-800 border-amber-200 bg-amber-50" };
    }
    if (code === "L1") {
      return { label: student.rank || "Fast Start", color: "text-stone-700 border-stone-200 bg-stone-50" };
    }
    if (code === "L0") {
      return { label: student.rank || "Fast Start", color: "text-[#942008] border-[#f5ded0] bg-[#fde5d6]" };
    }
    return { label: candidate || "General", color: "text-stone-600 border-stone-200 bg-stone-100" };
  };

  // Calculate deterministic period points based on active activity and streak
  const getPeriodPoints = (student: any, period: "weekly" | "monthly" | "all") => {
    if (!student) return 0;
    const basePoints = student.points || student.xpPoints || 0;
    if (basePoints <= 0) return 0;

    if (period === "all") {
      return basePoints;
    }

    const streak = student.streak || 1;

    if (period === "monthly") {
      // Monthly points: activity over 30 days
      const streakContribution = Math.min(streak, 30) * 10;
      const computed = Math.round(basePoints * 0.6) + streakContribution;
      return Math.min(basePoints, Math.max(10, computed));
    }

    // Weekly points: activity over 7 days
    const streakContribution = Math.min(streak, 7) * 20;
    const computed = Math.round(basePoints * 0.25) + streakContribution;
    return Math.min(basePoints, Math.max(10, computed));
  };

  // Level matching logic that bridges level codes and tier names
  const matchesLevel = (student: any, levelFilter: string) => {
    if (!levelFilter || levelFilter === "all") return true;

    const candidate = (student.membershipLevel || student.rank || "").trim();
    const code = getLevelCode(candidate, student.points || 0);
    const badge = getStudentLevelBadge(student);
    const badgeName = (badge.label || "").toLowerCase();
    const candLower = candidate.toLowerCase();
    const sel = levelFilter.toLowerCase();

    // Diamond Club (L3 / Renaissance / Diamond)
    if (sel.includes("diamond")) {
      return (
        code === "L3" ||
        code === "L3+" ||
        badgeName.includes("diamond") ||
        badgeName.includes("renaissance") ||
        candLower.includes("diamond") ||
        candLower.includes("renaissance")
      );
    }

    // Fast Start (L0 / L1 / Fast Track / Fast Start)
    if (sel.includes("fast")) {
      return (
        code === "L0" ||
        code === "L1" ||
        badgeName.includes("fast") ||
        candLower.includes("fast")
      );
    }

    // General
    if (sel.includes("general")) {
      return (
        code === "GENERAL" ||
        badgeName.includes("general") ||
        candLower.includes("general")
      );
    }

    return (
      badgeName.includes(sel) ||
      candLower.includes(sel) ||
      code.toLowerCase() === sel
    );
  };

  // Filtered and period-sorted students
  const filteredStudents = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    // 1. Filter by search query and level
    const matched = students.filter((s) => {
      const matchesSearch =
        !q ||
        s.name?.toLowerCase().includes(q) ||
        s.email?.toLowerCase().includes(q) ||
        s.city?.toLowerCase().includes(q);

      if (!matchesSearch) return false;

      return matchesLevel(s, selectedLevel);
    });

    // 2. Attach calculated period points and sort
    const withPoints = matched.map((s) => ({
      ...s,
      currentPoints: getPeriodPoints(s, rankingPeriod),
    }));

    withPoints.sort((a, b) => {
      if (b.currentPoints !== a.currentPoints) {
        return b.currentPoints - a.currentPoints;
      }
      return (b.streak || 0) - (a.streak || 0);
    });

    return withPoints;
  }, [students, searchQuery, selectedLevel, rankingPeriod, levelTiers]);

  // Top summary calculations based on filtered results
  const totalStudents = filteredStudents.length;
  const topPerformer = filteredStudents.length > 0 ? filteredStudents[0] : null;
  const totalXPAwarded = useMemo(() => {
    return filteredStudents.reduce((sum, s) => sum + s.currentPoints, 0);
  }, [filteredStudents]);

  // Export to CSV
  const handleExport = () => {
    if (filteredStudents.length === 0) return;
    const periodLabel = rankingPeriod === "all" ? "All Time" : rankingPeriod === "weekly" ? "Weekly" : "Monthly";
    const headers = ["Rank", "Name", "Email", "City", "Level", "Streak (Days)", `Points (${periodLabel} XP)`];
    const rows = filteredStudents.map((s, idx) => {
      const level = getStudentLevelBadge(s).label;
      return [
        idx + 1,
        `"${(s.name || "").replace(/"/g, '""')}"`,
        `"${(s.email || "").replace(/"/g, '""')}"`,
        `"${(s.city || "").replace(/"/g, '""')}"`,
        `"${level.replace(/"/g, '""')}"`,
        s.streak || 0,
        s.currentPoints,
      ].join(",");
    });
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `leaderboard_${rankingPeriod}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const top1 = filteredStudents[0];
  const top2 = filteredStudents[1];
  const top3 = filteredStudents[2];

  return (
    <div
      className="min-h-screen bg-[#faf8f5] text-stone-900 font-sans transition-colors lg:pl-[284px]"
      style={{
        backgroundColor: "#faf8f5",
        backgroundImage: "radial-gradient(circle, #e2ded4 1.5px, transparent 1.5px)",
        backgroundSize: "24px 24px",
        backgroundAttachment: "fixed",
      }}
    >
      <AdminNav user={user} logout={logout} />

      <main className="w-full px-4 sm:px-5 lg:px-5 py-5 sm:py-6">
        {/* Page Title & Subtitle */}
        <header className="mb-5 sm:mb-6">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-stone-900 tracking-tight">
            Platform Leaderboard
          </h1>
          <p className="text-stone-500 text-xs sm:text-sm mt-1 font-normal leading-relaxed">
            Monitor top performing students across the Ravishing Art Hub ecosystem.
          </p>
        </header>

        {/* 3 Overview Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4 mb-5 sm:mb-6">
          {/* Card 1: Total Students */}
          <div className="bg-white/95 border border-[#ecdccb] p-3.5 sm:p-4 rounded-2xl flex items-center gap-3.5 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-[#fff5ee] text-[#c4431d] border border-[#f5ded0] flex items-center justify-center shrink-0">
              <Users size={19} />
            </div>
            <div>
              <div className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                Total Students
              </div>
              <div className="text-base sm:text-lg lg:text-xl font-black text-stone-900">
                {totalStudents}
              </div>
            </div>
          </div>

          {/* Card 2: Top Performer */}
          <div className="bg-white/95 border border-[#ecdccb] p-3.5 sm:p-4 rounded-2xl flex items-center gap-3.5 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-[#fff5ee] text-[#c4431d] border border-[#f5ded0] flex items-center justify-center shrink-0">
              <Crown size={19} />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                Top Performer
              </div>
              <div className="text-sm sm:text-base lg:text-lg font-black text-stone-900 truncate">
                {topPerformer ? `${topPerformer.name} — ${topPerformer.currentPoints.toLocaleString()} XP` : "No Data"}
              </div>
            </div>
          </div>

          {/* Card 3: Total XP Awarded */}
          <div className="bg-white/95 border border-[#ecdccb] p-3.5 sm:p-4 rounded-2xl flex items-center gap-3.5 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-[#fff5ee] text-[#c4431d] border border-[#f5ded0] flex items-center justify-center shrink-0">
              <Layers size={19} />
            </div>
            <div>
              <div className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                Total XP Awarded
              </div>
              <div className="text-base sm:text-lg lg:text-xl font-black text-stone-900">
                {totalXPAwarded.toLocaleString()} XP
              </div>
            </div>
          </div>
        </div>

        {/* Main White Card Container */}
        <div className="bg-white/95 border border-[#ecdccb] rounded-2xl sm:rounded-3xl p-3.5 sm:p-6 shadow-[0_10px_30px_-12px_rgba(90,55,20,0.08)] space-y-4 sm:space-y-6">
          {/* Section Heading */}
          <h2 className="text-lg sm:text-xl font-black text-stone-900 tracking-tight">
            Student Rankings
          </h2>

          {/* Filter & Controls Bar */}
          <div className="flex flex-col 2xl:flex-row items-stretch 2xl:items-center justify-between gap-3.5 sm:gap-4">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[240px] max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                <Search size={16} />
              </div>
              <input
                type="text"
                placeholder="Search by student name or email"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#fcfaf7] border border-stone-200 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-[#c4431d] focus:ring-1 focus:ring-[#c4431d]/30 transition-colors shadow-2xs"
              />
            </div>

            {/* Filter Pills & Export Button */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              {/* Ranking Period */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-stone-600 whitespace-nowrap">
                  Ranking Period:
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setRankingPeriod("weekly")}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                      rankingPeriod === "weekly"
                        ? "bg-[#c4431d] text-white shadow-2xs"
                        : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
                    }`}
                  >
                    Weekly
                  </button>
                  <button
                    type="button"
                    onClick={() => setRankingPeriod("monthly")}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                      rankingPeriod === "monthly"
                        ? "bg-[#c4431d] text-white shadow-2xs"
                        : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
                    }`}
                  >
                    Monthly
                  </button>
                  <button
                    type="button"
                    onClick={() => setRankingPeriod("all")}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                      rankingPeriod === "all"
                        ? "bg-[#c4431d] text-white shadow-2xs"
                        : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
                    }`}
                  >
                    All Time
                  </button>
                </div>
              </div>

              {/* Level Filter */}
              <div className="flex items-center gap-2 min-w-0 max-w-full w-full sm:w-auto">
                <span className="text-xs font-bold text-stone-600 whitespace-nowrap shrink-0">
                  Level:
                </span>
                <div className="flex items-center gap-1.5 overflow-x-auto 2xl:overflow-x-visible flex-nowrap scrollbar-none scroll-smooth py-1 px-0.5 min-w-0 flex-1 sm:flex-initial [-webkit-overflow-scrolling:touch]">
                  <button
                    type="button"
                    onClick={() => setSelectedLevel("all")}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                      selectedLevel === "all"
                        ? "border border-[#c4431d] text-[#c4431d] bg-[#fff5ee]"
                        : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
                    }`}
                  >
                    All Levels
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedLevel("diamond")}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                      selectedLevel === "diamond"
                        ? "border border-[#c4431d] text-[#c4431d] bg-[#fff5ee]"
                        : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
                    }`}
                  >
                    Diamond Club
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedLevel("fast")}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                      selectedLevel === "fast"
                        ? "border border-[#c4431d] text-[#c4431d] bg-[#fff5ee]"
                        : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
                    }`}
                  >
                    Fast Start
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedLevel("general")}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                      selectedLevel === "general"
                        ? "border border-[#c4431d] text-[#c4431d] bg-[#fff5ee]"
                        : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
                    }`}
                  >
                    General
                  </button>
                </div>
              </div>

              {/* Export Button */}
              <button
                type="button"
                onClick={handleExport}
                className="w-full sm:w-auto border border-[#c4431d] text-[#c4431d] hover:bg-[#fff5ee] rounded-xl px-3.5 py-1.5 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shrink-0 ml-auto"
              >
                <Download size={14} />
                <span>Export Leaderboard</span>
              </button>
            </div>
          </div>

          {/* Top 3 Podium Cards Row */}
          {!isLoading && filteredStudents.length >= 1 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4">
              {/* Podium #1 */}
              {top1 && (
                <div className="bg-[#fff8f3] border border-[#f5ded0] rounded-2xl p-3 sm:p-3.5 shadow-2xs relative overflow-hidden">
                  <div className="flex items-center justify-between gap-2.5 sm:gap-3">
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <GoldPodiumBadge />
                      <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm shrink-0 border bg-[#fde5d6] border-[#f5ded0] text-[#942008]">
                        {top1.name?.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-bold text-xs sm:text-sm lg:text-base text-stone-900 truncate">
                          {top1.name}
                        </div>
                        <div className="text-xs text-stone-500 truncate mt-0.5">
                          {top1.city || "Ravishing Artist"}
                        </div>
                        {/* On tablet & desktop (sm:), show badge inline under artist info */}
                        <div className="hidden sm:block mt-1">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                              getStudentLevelBadge(top1).color
                            }`}
                          >
                            <Star size={11} className="shrink-0" />
                            <span>{getStudentLevelBadge(top1).label}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                    {/* Points */}
                    <div className="flex items-center gap-2 sm:gap-3 shrink-0 ml-auto pl-2">
                      <span className="h-8 w-[1px] bg-stone-200 shrink-0" aria-hidden="true" />
                      <div className="text-right">
                        <span className="font-black text-sm sm:text-base lg:text-lg text-stone-900">
                          {top1.currentPoints.toLocaleString()}
                        </span>
                        <span className="text-stone-400 text-xs ml-1 font-bold">XP</span>
                      </div>
                    </div>
                  </div>

                  {/* On mobile (< sm:), show badge on clean full-width line with zero truncation and comfortable text-xs */}
                  <div className="sm:hidden mt-2.5 pt-2 border-t border-[#f5ded0]/60 flex items-center">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${
                        getStudentLevelBadge(top1).color
                      }`}
                    >
                      <Star size={11} className="shrink-0" />
                      <span>{getStudentLevelBadge(top1).label}</span>
                    </span>
                  </div>
                </div>
              )}

              {/* Podium #2 */}
              {top2 && (
                <div className="bg-white border border-[#ecdccb] rounded-2xl p-3 sm:p-3.5 shadow-2xs relative overflow-hidden">
                  <div className="flex items-center justify-between gap-2.5 sm:gap-3">
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <SilverPodiumBadge />
                      <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm shrink-0 border bg-stone-100 border-stone-200 text-stone-700">
                        {top2.name?.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-bold text-xs sm:text-sm lg:text-base text-stone-900 truncate">
                          {top2.name}
                        </div>
                        <div className="text-xs text-stone-500 truncate mt-0.5">
                          {top2.city || "Ravishing Artist"}
                        </div>
                        {/* On tablet & desktop (sm:), show badge inline under artist info */}
                        <div className="hidden sm:block mt-1">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                              getStudentLevelBadge(top2).color
                            }`}
                          >
                            <Star size={11} className="shrink-0" />
                            <span>{getStudentLevelBadge(top2).label}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                    {/* Points */}
                    <div className="flex items-center gap-2 sm:gap-3 shrink-0 ml-auto pl-2">
                      <span className="h-8 w-[1px] bg-stone-200 shrink-0" aria-hidden="true" />
                      <div className="text-right">
                        <span className="font-black text-sm sm:text-base lg:text-lg text-stone-900">
                          {top2.currentPoints.toLocaleString()}
                        </span>
                        <span className="text-stone-400 text-xs ml-1 font-bold">XP</span>
                      </div>
                    </div>
                  </div>

                  {/* On mobile (< sm:), show badge on clean full-width line with zero truncation and comfortable text-xs */}
                  <div className="sm:hidden mt-2.5 pt-2 border-t border-stone-100 flex items-center">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${
                        getStudentLevelBadge(top2).color
                      }`}
                    >
                      <Star size={11} className="shrink-0" />
                      <span>{getStudentLevelBadge(top2).label}</span>
                    </span>
                  </div>
                </div>
              )}

              {/* Podium #3 */}
              {top3 && (
                <div className="bg-white border border-[#ecdccb] rounded-2xl p-3 sm:p-3.5 shadow-2xs relative overflow-hidden">
                  <div className="flex items-center justify-between gap-2.5 sm:gap-3">
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <BronzePodiumBadge />
                      <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm shrink-0 border bg-stone-100 border-stone-200 text-stone-700">
                        {top3.name?.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-bold text-xs sm:text-sm lg:text-base text-stone-900 truncate">
                          {top3.name}
                        </div>
                        <div className="text-xs text-stone-500 truncate mt-0.5">
                          {top3.city || "Ravishing Artist"}
                        </div>
                        {/* On tablet & desktop (sm:), show badge inline under artist info */}
                        <div className="hidden sm:block mt-1">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                              getStudentLevelBadge(top3).color
                            }`}
                          >
                            <Star size={11} className="shrink-0" />
                            <span>{getStudentLevelBadge(top3).label}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                    {/* Points */}
                    <div className="flex items-center gap-2 sm:gap-3 shrink-0 ml-auto pl-2">
                      <span className="h-8 w-[1px] bg-stone-200 shrink-0" aria-hidden="true" />
                      <div className="text-right">
                        <span className="font-black text-sm sm:text-base lg:text-lg text-stone-900">
                          {top3.currentPoints.toLocaleString()}
                        </span>
                        <span className="text-stone-400 text-xs ml-1 font-bold">XP</span>
                      </div>
                    </div>
                  </div>

                  {/* On mobile (< sm:), show badge on clean full-width line with zero truncation and comfortable text-xs */}
                  <div className="sm:hidden mt-2.5 pt-2 border-t border-stone-100 flex items-center">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${
                        getStudentLevelBadge(top3).color
                      }`}
                    >
                      <Star size={11} className="shrink-0" />
                      <span>{getStudentLevelBadge(top3).label}</span>
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Rankings Table */}
          <div className="rounded-2xl border border-stone-200 overflow-hidden bg-white">
            <div className="overflow-x-auto custom-scrollbar">
              <div className="w-full min-w-full sm:min-w-[660px] lg:min-w-0">
                {/* Table Header Row (Tablet & Desktop) */}
                <div className="hidden sm:grid grid-cols-12 gap-3 px-4 sm:px-6 py-3 bg-stone-50/80 border-b border-stone-200 text-xs font-bold text-stone-500 uppercase tracking-wider">
                  <div className="col-span-1 text-center">Rank</div>
                  <div className="col-span-4">Artist</div>
                  <div className="col-span-3 text-center">Level</div>
                  <div className="col-span-2 text-center">Streak</div>
                  <div className="col-span-2 text-center">Points</div>
                </div>

                {/* Table Body */}
                {isLoading ? (
                  <div className="p-12 sm:p-16 text-center text-stone-500 text-xs sm:text-sm font-medium">
                    Loading rankings...
                  </div>
                ) : filteredStudents.length === 0 ? (
                  <div className="p-12 sm:p-16 text-center text-stone-500 text-xs sm:text-sm font-medium">
                    No students found matching your filters.
                  </div>
                ) : (
                  <div className="divide-y divide-stone-100">
                    {filteredStudents.map((student, index) => {
                      const levelInfo = getStudentLevelBadge(student);
                      const isTop1 = index === 0;

                      return (
                        <React.Fragment key={student.id || index}>
                          {/* Tablet & Desktop Row (>= 640px) */}
                          <div
                            className={`hidden sm:grid grid-cols-12 gap-3 px-4 sm:px-6 py-3.5 items-center transition-colors hover:bg-[#faf8f5]/80 ${
                              isTop1 ? "bg-[#fff5ee]/70 border-l-4 border-[#c4431d]" : ""
                            }`}
                          >
                            {/* Rank */}
                            <div className="col-span-1 flex items-center justify-center">
                              {index === 0 && (
                                <Crown size={22} className="text-amber-500 fill-amber-400" aria-label="1st Place" />
                              )}
                              {index === 1 && <SilverTableMedal />}
                              {index === 2 && <BronzeTableMedal />}
                              {index > 2 && (
                                <span className="text-stone-400 font-bold text-xs sm:text-sm">
                                  #{index + 1}
                                </span>
                              )}
                            </div>

                            {/* Artist */}
                            <div className="col-span-4 flex items-center gap-3 min-w-0">
                              <div
                                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 border ${
                                  index === 0
                                    ? "bg-[#fde5d6] border-[#f5ded0] text-[#942008]"
                                    : "bg-stone-100 border-stone-200 text-stone-700"
                                }`}
                              >
                                {student.name?.charAt(0).toUpperCase()}
                              </div>
                              <div className="min-w-0">
                                <p className="font-bold text-xs sm:text-sm text-stone-900 truncate">
                                  {student.name}
                                </p>
                                <p className="text-xs text-stone-500 truncate">
                                  {student.city || "Ravishing Artist"}
                                </p>
                              </div>
                            </div>

                            {/* Level */}
                            <div className="col-span-3 text-center">
                              <span
                                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${levelInfo.color}`}
                              >
                                <Star size={11} className="shrink-0" />
                                <span>{levelInfo.label}</span>
                              </span>
                            </div>

                            {/* Streak */}
                            <div className="col-span-2 text-center font-semibold text-[#c4431d] text-xs sm:text-sm flex items-center justify-center gap-1">
                              <Flame size={15} className="text-[#c4431d]" />
                              <span>{student.streak || 0} days</span>
                            </div>

                            {/* Points */}
                            <div className="col-span-2 text-center">
                              <span className="font-black text-xs sm:text-sm text-stone-900">
                                {student.currentPoints.toLocaleString()}
                              </span>
                              <span className="text-stone-400 text-xs ml-1 font-bold">
                                XP
                              </span>
                            </div>
                          </div>

                          {/* Mobile-Optimized Row (< 640px) */}
                          <div
                            className={`sm:hidden p-3.5 flex flex-col gap-2 transition-colors hover:bg-[#faf8f5]/80 ${
                              isTop1 ? "bg-[#fff5ee]/70 border-l-4 border-[#c4431d]" : ""
                            }`}
                          >
                            {/* Top line: Rank, Avatar, Artist Name, Points */}
                            <div className="flex items-center justify-between gap-2.5">
                              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                                {/* Rank */}
                                <div className="w-6 flex items-center justify-center shrink-0">
                                  {index === 0 && (
                                    <Crown size={20} className="text-amber-500 fill-amber-400" />
                                  )}
                                  {index === 1 && <SilverTableMedal />}
                                  {index === 2 && <BronzeTableMedal />}
                                  {index > 2 && (
                                    <span className="text-stone-400 font-bold text-xs sm:text-sm">
                                      #{index + 1}
                                    </span>
                                  )}
                                </div>

                                {/* Avatar */}
                                <div
                                  className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 border ${
                                    index === 0
                                      ? "bg-[#fde5d6] border-[#f5ded0] text-[#942008]"
                                      : "bg-stone-100 border-stone-200 text-stone-700"
                                  }`}
                                >
                                  {student.name?.charAt(0).toUpperCase()}
                                </div>

                                {/* Artist Info */}
                                <div className="min-w-0 flex-1">
                                  <p className="font-bold text-xs sm:text-sm text-stone-900 leading-snug">
                                    {student.name}
                                  </p>
                                  <p className="text-xs text-stone-500">
                                    {student.city || "Ravishing Artist"}
                                  </p>
                                </div>
                              </div>

                              {/* Points */}
                              <div className="text-right shrink-0 pl-2">
                                <span className="font-black text-xs sm:text-sm text-stone-900">
                                  {student.currentPoints.toLocaleString()}
                                </span>
                                <span className="text-stone-400 text-xs ml-1 font-bold">
                                  XP
                                </span>
                              </div>
                            </div>

                            {/* Bottom line: Full Level Badge & Streak Badge */}
                            <div className="flex items-center justify-between gap-2 pl-8.5 pt-0.5">
                              <span
                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${levelInfo.color}`}
                              >
                                <Star size={11} className="shrink-0" />
                                <span>{levelInfo.label}</span>
                              </span>
                              <div className="font-semibold text-[#c4431d] text-xs flex items-center gap-1 shrink-0">
                                <Flame size={13} className="text-[#c4431d]" />
                                <span>{student.streak || 0} days</span>
                              </div>
                            </div>
                          </div>
                        </React.Fragment>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
