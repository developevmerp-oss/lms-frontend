"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { StudentNav } from "@/components/layout/StudentNav";
import { ProfileSkeleton } from "@/components/ui/SkeletonLoader";
import { API_BASE_URL } from "@/config/api";
import {
  Trophy,
  Medal,
  CheckCircle2,
  Check,
  Lock,
  Zap,
  Sparkles,
  Flame,
  Star,
  Target,
} from "lucide-react";
import { ProfileUpdateModal } from "@/components/profile/ProfileUpdateModal";

interface LevelTier {
  id?: string;
  code: string;
  name: string;
  minPoints: number;
  maxPoints: number | null;
  icon: string;
  badgeColor?: string;
  order: number;
  description?: string;
}

export default function StudentProfile() {
  const { user, token, logout, refreshUser } = useAuth();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [stats, setStats] = useState<any>({
    points: 0,
    streak: 0,
    badges: [],
    milestones: [],
    skills: null,
    courses: [],
    levelTiers: [],
    currentTier: null,
    notifications: []
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchStats = () => {
    if (!token) return;
    setIsLoading(true);
    fetch(`${API_BASE_URL}/dashboard/student`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && !data.message) {
          setStats(data);
        }
      })
      .catch((err) => console.error("Error fetching student profile stats:", err))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchStats();
  }, [token]);

  const defaultDescriptions: Record<string, string> = {
    L0: "Foundations, chemistry, and first creations",
    L1: "Core techniques, first client sale, and portfolio building",
    L2: "High-ticket geode clocks, bridal preservation, and consistent revenue",
    L3: "Scale beyond ₹50K/month, furniture river tables, and corporate orders",
    "L3+": "Offline city workshops, mentorship, and signature brand empire"
  };

  const defaultNames: Record<string, string> = {
    L0: "Fast Track: Resin FastStart Bundle",
    L1: "Silver Membership: Explore Membership",
    L2: "Gold Membership: Master Membership",
    L3: "Diamond Membership: Renaissance Certification",
    "L3+": "Masters Club: Artistry Pinnacle"
  };

  const levelTiers: LevelTier[] = (stats.levelTiers && stats.levelTiers.length > 0
    ? stats.levelTiers
    : [
        { code: "L0", name: "Fast Track: Resin FastStart Bundle", minPoints: 0, maxPoints: 499, icon: "⚡", order: 0, description: "Foundations, chemistry, and first creations" },
        { code: "L1", name: "Silver Membership: Explore Membership", minPoints: 500, maxPoints: 4999, icon: "🥈", order: 1, description: "Core techniques, first client sale, and portfolio building" },
        { code: "L2", name: "Gold Membership: Master Membership", minPoints: 5000, maxPoints: 9999, icon: "🏆", order: 2, description: "High-ticket geode clocks, bridal preservation, and consistent revenue" },
        { code: "L3", name: "Diamond Membership: Renaissance Certification", minPoints: 10000, maxPoints: 49999, icon: "💎", order: 3, description: "Scale beyond ₹50K/month, furniture river tables, and corporate orders" },
        { code: "L3+", name: "Masters Club: Artistry Pinnacle", minPoints: 50000, maxPoints: null, icon: "👑", order: 4, description: "Offline city workshops, mentorship, and signature brand empire" }
      ]
  ).map((tier: LevelTier) => ({
    ...tier,
    name: tier.name && tier.name !== "Fast Start" ? tier.name : (defaultNames[tier.code] || tier.name),
    description: tier.description || defaultDescriptions[tier.code] || ""
  }));

  const currentPoints = stats.points || 0;
  const rawLevel = (user?.membershipLevel || stats.membershipLevel || stats.currentTier?.code || "").toUpperCase();
  const isGeneral = !rawLevel || rawLevel === "GENERAL" || rawLevel.includes("GENERAL");

  const TIER_ORDER_MAP: Record<string, number> = {
    GENERAL: -1,
    L0: 0,
    L1: 1,
    L2: 2,
    L3: 3,
    "L3+": 4,
  };

  const getStudentLevelCode = () => {
    if (isGeneral) return "GENERAL";
    if (rawLevel.includes("L3+") || rawLevel.includes("MASTERS")) return "L3+";
    if (rawLevel.includes("L3") || rawLevel.includes("DIAMOND") || rawLevel.includes("RENAISSANCE")) return "L3";
    if (rawLevel.includes("L2") || rawLevel.includes("GOLD")) return "L2";
    if (rawLevel.includes("L1") || rawLevel.includes("SILVER")) return "L1";
    if (rawLevel.includes("L0") || rawLevel.includes("FAST START") || rawLevel.includes("FAST TRACK") || rawLevel.includes("BRONZE")) return "L0";
    return "GENERAL";
  };

  const studentLevelCode = getStudentLevelCode();
  const studentLevelOrder = TIER_ORDER_MAP[studentLevelCode] ?? -1;

  const currentTier = isGeneral
    ? { code: "GENERAL", name: "General Member", icon: "🌱", minPoints: 0, maxPoints: null, order: -1 }
    : (stats.currentTier || levelTiers.find((t) => t.code === studentLevelCode) || levelTiers[0]);

  const getLevelStatus = (tier: LevelTier, index: number) => {
    const tierCode = (tier.code || "").toUpperCase();
    const tierOrder = tier.order !== undefined ? tier.order : (TIER_ORDER_MAP[tierCode] ?? index);

    if (studentLevelOrder === -1) {
      return "locked";
    }

    if (tierOrder < studentLevelOrder) {
      return "completed";
    }
    if (tierOrder === studentLevelOrder) {
      return "current";
    }
    return "locked";
  };

  const completedLevelsCount = levelTiers.filter((t, idx) => getLevelStatus(t, idx) === "completed").length;

  return (
    <div
      className="min-h-screen bg-[#faf8f5] text-stone-900 transition-colors lg:pl-64"
      style={{
        backgroundColor: "#faf8f5",
        backgroundImage: "radial-gradient(circle, #e2ded4 1.5px, transparent 1.5px)",
        backgroundSize: "24px 24px",
        backgroundAttachment: "fixed",
      }}
    >
      <ProfileUpdateModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onSuccess={() => { refreshUser(); fetchStats(); }}
      />

      <StudentNav
        user={user}
        level={isGeneral ? "General Member" : (user?.membershipLevel || (currentTier ? `${currentTier.name} (${currentTier.code})` : "Fast Track: Resin FastStart Bundle (L0)"))}
        points={currentPoints}
        logout={logout}
        notifications={stats.notifications}
      />

      <main className="w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Page Header - Moved to Top Bar per user instruction */}
        {/*
        <header className="mb-4 sm:mb-6">
          <div className="flex items-center gap-1.5 text-xs text-stone-500 mb-1 font-medium">
            <span>Account</span>
            <span className="text-stone-300">/</span>
            <span className="text-stone-700 font-medium">My Profile</span>
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-stone-900 tracking-tight">
            My Profile
          </h1>
          <p className="text-stone-500 text-xs sm:text-sm mt-0.5">
            Manage your personal details, membership credentials, and learning milestones.
          </p>
        </header>
        */}

        {isLoading ? (
          <ProfileSkeleton />
        ) : (
          <>
          {/* Single unified card container matching Reference Image 3 */}
        <div className="bg-white/95 border border-[#ecdccb] shadow-[0_10px_30px_-12px_rgba(90,55,20,0.08)] rounded-3xl p-4 sm:p-6 lg:p-7 relative overflow-hidden">
          {/* Subtle peach warm ambient glow in top right */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#fde5d6]/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />

          <div className="relative z-10 space-y-4 sm:space-y-5 lg:space-y-6">
            
            {/* ======================================================== */}
            {/* SECTION 1: PROFILE INFO & TOP STATS                      */}
            {/* ======================================================== */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 lg:gap-8">
              
              {/* Left: Avatar + Bio + Edit Trigger */}
              <div className="flex items-center gap-3 sm:gap-4">
                <div
                  onClick={() => setIsProfileModalOpen(true)}
                  className="w-12 h-12 sm:w-14 sm:h-14 lg:w-14 lg:h-14 rounded-2xl bg-[#fde5d6]/70 border border-[#f5ded0] flex items-center justify-center text-2xl sm:text-3xl shrink-0 group relative cursor-pointer shadow-sm overflow-hidden"
                  title="Click to change profile picture"
                >
                  {user?.avatarUrl ? (
                    <img src={user.avatarUrl} alt={user?.name} className="w-full h-full object-cover" />
                  ) : (
                    <span>{isGeneral ? "🌱" : (currentTier?.icon || "👑")}</span>
                  )}
                  <div className="absolute inset-0 bg-[#faf8f5]/80 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-xs font-bold text-stone-900">
                    Change 📷
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
                    <h2 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
                      {user?.name || "Student Artist"}
                    </h2>
                    {isGeneral ? (
                      <span className="px-2.5 py-0.5 rounded-full bg-stone-100 border border-stone-200 text-stone-600 text-xs sm:text-xs font-bold inline-flex items-center gap-1">
                        <span>🌱</span>
                        General Member
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full bg-[#fde5d6]/70 border border-[#f5ded0] text-[#942008] text-xs sm:text-xs font-bold inline-flex items-center gap-1.5">
                        <span>{currentTier?.icon || "👑"}</span>
                        <span>{currentTier?.name || "Masters Club: Artistry Pinnacle"} ({currentTier?.code || "L3+"})</span>
                      </span>
                    )}
                  </div>

                  <p className="text-stone-400 text-xs mt-0.5 font-normal">{user?.email || "shreyatast@mailinator.com"}</p>

                  <div className="flex items-center gap-2 sm:gap-3 mt-1.5 flex-wrap">
                    <button
                      onClick={() => setIsProfileModalOpen(true)}
                      className="px-3 py-1 bg-gradient-to-r from-[#942008] via-[#c4431d] to-[#ea580c] hover:opacity-95 text-white font-bold text-xs sm:text-xs rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                    >
                      Edit Profile & Photo ⚙️
                    </button>
                    {(user?.city || "Mumbai") && (
                      <span className="text-xs text-stone-500 font-medium">📍 {user?.city || "Mumbai"}</span>
                    )}
                    {(user?.phone || "9429626153") && (
                      <span className="text-xs text-stone-500 font-medium">📞 {user?.phone || "9429626153"}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Right: Plain Stats (borderless, minimalist, matching Image 3) */}
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-stone-200/50 sm:border-t-0 sm:pt-0 sm:flex sm:flex-row sm:items-center sm:gap-5 lg:gap-8 lg:ml-auto">
                <div className="text-left sm:text-center">
                  <span className="text-xs sm:text-xs text-stone-400 font-medium block">Total XP</span>
                  <span className="text-sm sm:text-base lg:text-lg font-black text-amber-500 flex items-center gap-1 font-mono">
                    <Star size={14} className="text-amber-500 fill-amber-500" />
                    {currentPoints.toLocaleString()}
                  </span>
                </div>

                <div className="text-left sm:text-center">
                  <span className="text-xs sm:text-xs text-stone-400 font-medium block">Login Streak</span>
                  <span className="text-sm sm:text-base lg:text-lg font-black text-stone-900 flex items-center gap-1 font-mono">
                    <Flame size={14} className="text-[#c4431d] fill-[#c4431d]" />
                    {stats.streak || 1}d
                  </span>
                </div>

                <div className="text-left sm:text-center">
                  <span className="text-xs sm:text-xs text-stone-400 font-medium block">Badges</span>
                  <span className="text-sm sm:text-base lg:text-lg font-black text-stone-900 flex items-center gap-1 font-mono">
                    <Medal size={14} className="text-amber-500" />
                    {(stats.badges || []).length || 1}
                  </span>
                </div>

                <div className="text-left sm:text-center">
                  <span className="text-xs sm:text-xs text-stone-400 font-medium block">Levels Cleared</span>
                  <span className="text-sm sm:text-base lg:text-lg font-black text-emerald-500 flex items-center gap-1 font-mono">
                    <CheckCircle2 size={14} className="text-emerald-500" />
                    {completedLevelsCount} / {levelTiers.length}
                  </span>
                </div>
              </div>

            </div>

            {/* Divider Line */}
            <div className="border-b border-stone-200/80" />

            {/* ======================================================== */}
            {/* SECTION 2: ARTPRENEUR CAREER LEVELS & PROGRESS           */}
            {/* ======================================================== */}
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-2">
                <div>
                  <h2 className="text-base sm:text-lg font-black text-stone-900 flex items-center gap-2">
                    <Trophy className="text-[#942008] shrink-0" size={19} />
                    Artpreneur Career Levels & Progress
                  </h2>
                  <p className="text-xs sm:text-xs text-stone-400 mt-0.5">
                    Track all completed tiers, your active level milestone, and the upcoming tiers to unlock.
                  </p>
                </div>
                <span className="px-3 py-1 rounded-xl bg-stone-100/80 border border-stone-200/80 text-xs sm:text-xs font-semibold text-stone-600 shrink-0 self-start sm:self-auto mt-1 sm:mt-0">
                  {completedLevelsCount} of {levelTiers.length} Levels Completed
                </span>
              </div>

              <div className="space-y-1 sm:space-y-1.5 mt-2">
                {levelTiers.map((tier, idx) => {
                  const status = getLevelStatus(tier, idx);
                  const isCurrent = status === "current";
                  const isCompleted = status === "completed";

                  let progressPercent = 0;
                  if (isCompleted) {
                    progressPercent = 100;
                  } else if (isCurrent) {
                    const range = (tier.maxPoints || (tier.minPoints + 5000)) - tier.minPoints;
                    const earnedInTier = Math.max(0, currentPoints - tier.minPoints);
                    progressPercent = Math.min(100, Math.round((earnedInTier / range) * 100));
                  }

                  return (
                    <div
                      key={tier.id || tier.code || idx}
                      className={`transition-colors duration-200 rounded-xl px-2.5 sm:px-3.5 py-2 sm:py-2.5 ${
                        isCurrent
                          ? "bg-[#fff2ea] border border-[#f5ded0]"
                          : "border border-transparent hover:bg-stone-50/60"
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
                        
                        {/* Left: Icon + Code + Title & Subtitle */}
                        <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
                          <span className="text-base sm:text-lg shrink-0 w-6 text-center">
                            {tier.icon}
                          </span>

                          <span className="text-xs font-black font-mono text-stone-900 bg-stone-100/90 px-2 py-0.5 rounded-md shrink-0">
                            {tier.code}
                          </span>

                          <div className="min-w-0">
                            <h3 className="text-xs sm:text-sm font-bold text-stone-900 leading-tight truncate">
                              {tier.name}
                            </h3>
                            <p className="text-xs sm:text-xs text-stone-400 truncate mt-0.5">
                              {tier.description}
                            </p>
                          </div>
                        </div>

                        {/* Middle: Status indicator (matching Image 3: text with checkmark or lightning) */}
                        <div className="shrink-0 flex items-center">
                          {isCompleted && (
                            <span className="text-xs sm:text-xs font-black text-[#c4431d] flex items-center gap-1">
                              <Check size={13} strokeWidth={3} className="text-[#c4431d]" />
                              COMPLETED
                            </span>
                          )}
                          {isCurrent && (
                            <span className="text-xs sm:text-xs font-black text-[#c4431d] flex items-center gap-1">
                              <Zap size={13} className="fill-[#c4431d] text-[#c4431d]" />
                              CURRENT LEVEL ({progressPercent}%)
                            </span>
                          )}
                          {status === "locked" && (
                            <span className="text-xs sm:text-xs font-bold text-stone-400 flex items-center gap-1">
                              <Lock size={12} />
                              LOCKED
                            </span>
                          )}
                        </div>

                        {/* Right: XP Requirements & Progress Bar */}
                        <div className="w-full sm:w-48 lg:w-56 shrink-0 text-left sm:text-right">
                          <div className="flex justify-between sm:justify-end gap-1.5 items-baseline text-xs sm:text-xs mb-1">
                            <span className="text-stone-400 text-xs sm:text-xs">XP Target:</span>
                            <span className="font-mono font-bold text-stone-900 text-xs sm:text-xs">
                              {tier.minPoints.toLocaleString()} {tier.maxPoints ? `→ ${tier.maxPoints.toLocaleString()} XP` : "+ XP"}
                            </span>
                          </div>

                          <div className={`w-full h-1.5 sm:h-2 rounded-full overflow-hidden ${isCurrent ? "bg-white/90" : "bg-stone-100"}`}>
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${
                                isCompleted
                                  ? "bg-[#c4431d]"
                                  : isCurrent
                                  ? "bg-gradient-to-r from-[#942008] via-[#c4431d] to-[#ea580c]"
                                  : "bg-stone-200"
                              }`}
                              style={{ width: `${progressPercent}%` }}
                            />
                          </div>
                        </div>

                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Divider Line */}
            <div className="border-b border-stone-200/80" />

            {/* ======================================================== */}
            {/* SECTION 3: BADGES & AWARDS COLLECTION                    */}
            {/* ======================================================== */}
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-3">
                <div>
                  <h2 className="text-base sm:text-lg font-black text-stone-900 flex items-center gap-2">
                    <Medal className="text-amber-500 shrink-0" size={19} />
                    Badges & Awards Collection
                  </h2>
                  <p className="text-xs sm:text-xs text-stone-400 mt-0.5">
                    Official achievement badges awarded for master projects, milestones, and streak records.
                  </p>
                </div>
                <span className="px-3 py-1 rounded-xl bg-[#fde5d6]/70 border border-[#f5ded0] text-xs sm:text-xs font-bold text-[#942008] shrink-0 self-start sm:self-auto mt-1 sm:mt-0">
                  {(stats.badges || []).length || 1} Badges Earned
                </span>
              </div>

              {/* Horizontal badge cards matching Image 3 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {((stats.badges && stats.badges.length > 0)
                  ? stats.badges
                  : [
                      {
                        id: "badge-1",
                        name: "First Resin Pour",
                        description: "Completed and submitted first practical resin artwork",
                        icon: "🎨"
                      }
                    ]
                ).map((badge: any, i: number) => (
                  <div
                    key={badge.id || i}
                    className="bg-[#fff8f5] border border-[#f5ded0] rounded-2xl p-3 sm:p-3.5 flex items-center justify-between gap-3 shadow-none hover:border-[#ecdccb] transition-all"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-white border border-[#f5ded0] flex items-center justify-center text-xl sm:text-2xl shrink-0 shadow-sm">
                        {badge.icon || "🎨"}
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs sm:text-sm font-bold text-stone-900 leading-tight truncate">
                          {badge.name}
                        </h4>
                        <p className="text-xs sm:text-xs text-stone-400 mt-0.5 line-clamp-1">
                          {badge.description || "Official verified achievement"}
                        </p>
                      </div>
                    </div>

                    <span className="px-2.5 py-0.5 rounded-full bg-[#fde5d6]/70 border border-[#f5ded0] text-xs font-bold text-[#c4431d] flex items-center gap-1 shrink-0">
                      <Check size={11} strokeWidth={3} />
                      Unlocked
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Divider Line */}
            <div className="border-b border-stone-200/80" />

            {/* ======================================================== */}
            {/* SECTION 4: MILESTONES CHECKLIST & TECHNICAL SKILLS       */}
            {/* ======================================================== */}
            <div className="flex flex-col sm:grid sm:grid-cols-2 gap-5 sm:gap-6 lg:gap-8 pt-1">
              
              {/* Left Column: Career Milestones Checklist */}
              <div>
                <h3 className="text-sm sm:text-base font-black text-stone-900 mb-2.5 flex items-center gap-2">
                  <Target className="text-[#c4431d] shrink-0" size={18} />
                  Career Milestones Checklist
                </h3>

                <div className="space-y-1 sm:space-y-1.5">
                  {((stats.milestones && stats.milestones.length > 0)
                    ? stats.milestones
                    : [
                        { id: 1, name: "Winner", completed: true },
                        { id: 2, name: "1st order form client", completed: false },
                        { id: 3, name: "complete resing tray", completed: false },
                        { id: 4, name: "powder technique", completed: false }
                      ]
                  ).map((m: any, i: number) => {
                    const isCompleted = !!m.completed;
                    return (
                      <div
                        key={m.id || i}
                        className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors ${
                          isCompleted
                            ? "bg-[#fde5d6]/40 border border-[#f5ded0]/60"
                            : "border border-transparent hover:bg-stone-50/50"
                        }`}
                      >
                        <span className="flex items-center gap-2 min-w-0">
                          {isCompleted ? (
                            <Lock size={14} className="text-[#c4431d] shrink-0" />
                          ) : (
                            <Lock size={14} className="text-stone-400 shrink-0" />
                          )}
                          <span className={`truncate ${isCompleted ? "text-[#942008] font-bold text-xs sm:text-sm" : "text-stone-700 font-medium text-xs sm:text-sm"}`}>
                            {m.name}
                          </span>
                        </span>

                        <span
                          className={`text-xs sm:text-xs px-2.5 py-0.5 rounded-full shrink-0 ${
                            isCompleted
                              ? "bg-[#fde5d6] text-[#942008] border border-[#f5ded0] font-bold"
                              : "bg-stone-100 text-stone-400 font-medium"
                          }`}
                        >
                          {isCompleted ? "Achieved" : "In Progress"}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: Technical Skill Scores */}
              <div>
                <h3 className="text-sm sm:text-base font-black text-stone-900 mb-2.5 flex items-center gap-2">
                  <Sparkles className="text-amber-500 shrink-0" size={18} />
                  Technical Skill Scores
                </h3>

                <div className="space-y-2.5 sm:space-y-3">
                  {[
                    { name: "Resin Mixing & Ratios", score: stats.skills?.mixing ?? 85 },
                    { name: "Color Theory & Gradients", score: stats.skills?.colourTheory ?? 78 },
                    { name: "Wave Foam & Cell Formation", score: stats.skills?.creativity ?? 1 },
                    { name: "Bevel Sanding & Polishing", score: stats.skills?.finishing ?? 1 },
                    { name: "Commercial Product Quality", score: stats.skills?.professionalQuality ?? 1 },
                  ].map((skill, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-xs font-bold mb-1">
                        <span className="text-stone-700 font-medium text-xs sm:text-sm">{skill.name}</span>
                        <span className="text-amber-500 font-mono font-bold text-xs sm:text-sm">{skill.score}%</span>
                      </div>
                      <div className="w-full h-1.5 sm:h-2 bg-stone-200/80 rounded-full overflow-hidden relative">
                        <div
                          className="h-full bg-gradient-to-r from-[#942008] via-[#c4431d] to-[#ea580c] rounded-full transition-all duration-500"
                          style={{
                            width: `${skill.score}%`,
                            minWidth: skill.score > 0 ? "6px" : "0px",
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        </div>
        </>
        )}
      </main>
    </div>
  );
}
