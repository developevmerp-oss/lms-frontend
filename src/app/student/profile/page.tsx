"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { StudentNav } from "@/components/layout/StudentNav";
import { API_BASE_URL } from "@/config/api";
import {
  Trophy,
  Medal,
  Award,
  CheckCircle2,
  Lock,
  Zap,
  Sparkles,
  Flame,
  Star,
  Target,
  ArrowRight,
  TrendingUp,
  User,
  Shield,
  BookOpen,
  Calendar,
  Layers
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

import { ProfileUpdateModal } from "@/components/profile/ProfileUpdateModal";

interface LevelTier {
  id?: string;
  code: string;
  name: string;
  minPoints: number;
  maxPoints: number | null;
  icon: string;
  badgeColor: string;
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

  const levelTiers: LevelTier[] = stats.levelTiers && stats.levelTiers.length > 0
    ? stats.levelTiers
    : [
        { code: 'L0', name: 'Fast Start', minPoints: 0, maxPoints: 499, icon: '⚡', badgeColor: 'emerald', order: 0, description: 'Resin fundamentals, safety & first 5 art pieces' },
        { code: 'L1', name: 'Silver Member', minPoints: 500, maxPoints: 4999, icon: '🥈', badgeColor: 'slate', order: 1, description: 'Core art techniques, custom orders & first client sale' },
        { code: 'L2', name: 'Gold Member', minPoints: 5000, maxPoints: 9999, icon: '🏆', badgeColor: 'amber', order: 2, description: 'Consistent ₹25K–₹50K monthly revenue & luxury wall clocks' },
        { code: 'L3', name: 'Diamond Club', minPoints: 10000, maxPoints: 49999, icon: '💎', badgeColor: 'cyan', order: 3, description: 'Scale beyond ₹50K/month & bulk corporate art contracts' },
        { code: 'L3+', name: 'Masters Club', minPoints: 50000, maxPoints: null, icon: '👑', badgeColor: 'purple', order: 4, description: 'Offline city workshops & signature resin empire brand' }
      ];

  const currentPoints = stats.points || 0;
  const rawLevel = (user?.membershipLevel || stats.membershipLevel || stats.currentTier?.code || '').toUpperCase();
  const isGeneral = !rawLevel || rawLevel === 'GENERAL' || rawLevel.includes('GENERAL');

  const TIER_ORDER_MAP: Record<string, number> = {
    GENERAL: -1,
    L0: 0,
    L1: 1,
    L2: 2,
    L3: 3,
    "L3+": 4,
  };

  const getStudentLevelCode = () => {
    if (isGeneral) return 'GENERAL';
    if (rawLevel.includes('L3+') || rawLevel.includes('MASTERS')) return 'L3+';
    if (rawLevel.includes('L3') || rawLevel.includes('DIAMOND') || rawLevel.includes('RENAISSANCE')) return 'L3';
    if (rawLevel.includes('L2') || rawLevel.includes('GOLD')) return 'L2';
    if (rawLevel.includes('L1') || rawLevel.includes('SILVER')) return 'L1';
    if (rawLevel.includes('L0') || rawLevel.includes('FAST START') || rawLevel.includes('FAST TRACK') || rawLevel.includes('BRONZE')) return 'L0';
    return 'GENERAL';
  };

  const studentLevelCode = getStudentLevelCode();
  const studentLevelOrder = TIER_ORDER_MAP[studentLevelCode] ?? -1;

  const currentTier = isGeneral
    ? { code: 'GENERAL', name: 'General Member', icon: '🌱', minPoints: 0, maxPoints: null, badgeColor: 'slate', order: -1 }
    : (stats.currentTier || levelTiers[0]);

  // Helper to determine status of each level
  const getLevelStatus = (tier: LevelTier, index: number) => {
    const tierCode = (tier.code || '').toUpperCase();
    const tierOrder = tier.order !== undefined ? tier.order : (TIER_ORDER_MAP[tierCode] ?? index);

    if (studentLevelOrder === -1) {
      // General member: all curriculum tiers are locked
      return 'locked';
    }

    if (tierOrder < studentLevelOrder) {
      return 'completed'; // Prerequisite tier cleared
    }
    if (tierOrder === studentLevelOrder) {
      return 'current'; // Currently active membership tier
    }
    return 'locked'; // Higher tier to unlock
  };

  const completedLevelsCount = levelTiers.filter((t, idx) => getLevelStatus(t, idx) === 'completed').length;

  const colorClasses: Record<string, { bg: string; text: string; border: string; glow: string }> = {
    emerald: { bg: 'bg-emerald-500', text: 'text-emerald-400', border: 'border-emerald-500/40', glow: 'shadow-emerald-500/20' },
    slate: { bg: 'bg-slate-400', text: 'text-slate-300', border: 'border-slate-400/40', glow: 'shadow-slate-400/20' },
    amber: { bg: 'bg-amber-500', text: 'text-amber-400', border: 'border-amber-500/40', glow: 'shadow-amber-500/20' },
    cyan: { bg: 'bg-cyan-500', text: 'text-cyan-400', border: 'border-cyan-500/40', glow: 'shadow-cyan-500/20' },
    purple: { bg: 'bg-purple-500', text: 'text-purple-400', border: 'border-purple-500/40', glow: 'shadow-purple-500/20' },
    rose: { bg: 'bg-rose-500', text: 'text-rose-400', border: 'border-rose-500/40', glow: 'shadow-rose-500/20' },
    blue: { bg: 'bg-blue-500', text: 'text-blue-400', border: 'border-blue-500/40', glow: 'shadow-blue-500/20' },
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <ProfileUpdateModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onSuccess={() => { refreshUser(); fetchStats(); }}
      />

      <StudentNav
        user={user}
        level={isGeneral ? 'General Member' : (user?.membershipLevel || (currentTier ? `${currentTier.name} (${currentTier.code})` : 'Fast Start (L0)'))}
        points={currentPoints}
        logout={logout}
        notifications={stats.notifications}
      />

      <main className="max-w-[1400px] mx-auto p-4 md:p-8 space-y-8">
        
        {/* Profile Banner */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            
            {/* Left: Avatar + Bio + Edit Trigger */}
            <div className="flex items-center gap-5">
              <div
                onClick={() => setIsProfileModalOpen(true)}
                className="w-20 h-20 md:w-24 md:h-24 rounded-3xl overflow-hidden border-2 border-orange-500/60 shadow-xl shadow-orange-500/20 shrink-0 bg-slate-800 flex items-center justify-center text-4xl cursor-pointer group relative"
                title="Click to change profile picture"
              >
                {user?.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user?.name} className="w-full h-full object-cover" />
                ) : (
                  <span>{isGeneral ? '🌱' : (currentTier?.icon || '🎨')}</span>
                )}
                <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-xs font-bold text-white">
                  Change 📷
                </div>
              </div>

              <div>
                <div className="flex items-center gap-3 flex-wrap mb-1">
                  <h1 className="text-2xl md:text-3xl font-extrabold text-white">
                    {user?.name || "Student Artist"}
                  </h1>
                  {isGeneral ? (
                    <span className="px-3 py-1 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 text-xs font-black flex items-center gap-1.5 shadow-sm">
                      <span>🌱</span>
                      General Member
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-black flex items-center gap-1.5 shadow-sm">
                      <span>{currentTier?.icon || '⚡'}</span>
                      {currentTier?.name} ({currentTier?.code})
                    </span>
                  )}
                </div>
                <p className="text-slate-400 text-sm">{user?.email}</p>
                <div className="flex items-center gap-3 mt-2 flex-wrap">
                  <button
                    onClick={() => setIsProfileModalOpen(true)}
                    className="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-slate-950 font-black text-xs rounded-xl transition-all shadow-md shadow-orange-500/20 flex items-center gap-1.5"
                  >
                    Edit Profile & Photo ⚙️
                  </button>
                  {user?.city && (
                    <span className="text-xs text-slate-400">📍 {user.city}</span>
                  )}
                  {user?.phone && (
                    <span className="text-xs text-slate-400">📞 {user.phone}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Quick Stats Cards */}
            <div className="flex flex-wrap gap-3 w-full md:w-auto">
              <div className="bg-slate-950/80 border border-slate-800 px-5 py-3.5 rounded-2xl min-w-[110px] text-center flex-1 md:flex-initial">
                <span className="text-xs text-slate-400 font-bold block mb-0.5">Total XP</span>
                <span className="text-xl font-black text-amber-400 font-mono flex items-center justify-center gap-1">
                  <Star size={16} className="text-amber-400 fill-amber-400" />
                  {currentPoints.toLocaleString()}
                </span>
              </div>


              <div className="bg-slate-950/80 border border-slate-800 px-5 py-3.5 rounded-2xl min-w-[110px] text-center flex-1 md:flex-initial">
                <span className="text-xs text-slate-400 font-bold block mb-0.5">Login Streak</span>
                <span className="text-xl font-black text-orange-400 flex items-center justify-center gap-1">
                  <Flame size={16} className="text-orange-500 fill-orange-500" />
                  {stats.streak || 0}d
                </span>
              </div>

              <div className="bg-slate-950/80 border border-slate-800 px-5 py-3.5 rounded-2xl min-w-[110px] text-center flex-1 md:flex-initial">
                <span className="text-xs text-slate-400 font-bold block mb-0.5">Badges</span>
                <span className="text-xl font-black text-white flex items-center justify-center gap-1">
                  <Medal size={16} className="text-yellow-400" />
                  {(stats.badges || []).length}
                </span>
              </div>

              <div className="bg-slate-950/80 border border-slate-800 px-5 py-3.5 rounded-2xl min-w-[110px] text-center flex-1 md:flex-initial">
                <span className="text-xs text-slate-400 font-bold block mb-0.5">Levels Cleared</span>
                <span className="text-xl font-black text-emerald-400 flex items-center justify-center gap-1">
                  <CheckCircle2 size={16} className="text-emerald-400" />
                  {completedLevelsCount} / {levelTiers.length}
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* ======================================================== */}
        {/* SECTION 1: ALL COMPLETED & UPCOMING LEVELS ROADMAP       */}
        {/* ======================================================== */}
        <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-6 pb-4 border-b border-slate-800">
            <div>
              <h2 className="text-xl md:text-2xl font-black text-white flex items-center gap-2.5">
                <Trophy className="text-orange-400" size={24} />
                Artpreneur Career Levels & Progress
              </h2>
              <p className="text-xs md:text-sm text-slate-400 mt-1">
                Track all completed tiers, your active level milestone, and the upcoming tiers to unlock.
              </p>
            </div>
            <span className="px-3.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold text-slate-300">
              {completedLevelsCount} of {levelTiers.length} Levels Completed
            </span>
          </div>

          <div className="space-y-4">
            {levelTiers.map((tier, idx) => {
              const status = getLevelStatus(tier, idx);
              const theme = colorClasses[tier.badgeColor] || colorClasses.emerald;

              // Calculate XP progress inside current tier
              let progressPercent = 0;
              if (status === 'completed') {
                progressPercent = 100;
              } else if (status === 'current') {
                const range = (tier.maxPoints || (tier.minPoints + 5000)) - tier.minPoints;
                const earnedInTier = Math.max(0, currentPoints - tier.minPoints);
                progressPercent = Math.min(100, Math.round((earnedInTier / range) * 100));
              }

              return (
                <div
                  key={tier.id || idx}
                  className={`p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden ${
                    status === 'completed'
                      ? 'bg-emerald-950/20 border-emerald-500/30'
                      : status === 'current'
                      ? 'bg-orange-500/10 border-orange-500/40 shadow-lg shadow-orange-500/5 ring-1 ring-orange-500/20'
                      : 'bg-slate-950/50 border-slate-800/80 opacity-60'
                  }`}
                >
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    
                    {/* Left: Badge Icon + Name + Description */}
                    <div className="flex items-center gap-4 min-w-0">
                      <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center text-2xl shadow-inner shrink-0 ${
                        status === 'completed'
                          ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                          : status === 'current'
                          ? 'bg-orange-500/20 border-orange-500/40 text-orange-300 scale-105'
                          : 'bg-slate-900 border-slate-800 text-slate-500'
                      }`}>
                        {tier.icon}
                      </div>

                      <div>
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <span className="text-xs font-black px-2.5 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-white font-mono">
                            {tier.code}
                          </span>
                          <h3 className="text-lg font-black text-white">{tier.name}</h3>
                          
                          {/* Status Badge */}
                          {status === 'completed' && (
                            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-black flex items-center gap-1">
                              <CheckCircle2 size={12} /> COMPLETED
                            </span>
                          )}
                          {status === 'current' && (
                            <span className="px-2.5 py-0.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30 text-xs font-black flex items-center gap-1 animate-pulse">
                              <Zap size={12} /> CURRENT LEVEL ({progressPercent}%)
                            </span>
                          )}
                          {status === 'locked' && (
                            <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400 text-xs font-bold flex items-center gap-1">
                              <Lock size={12} /> LOCKED
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-slate-400 mt-1 max-w-xl">
                          {tier.description || `Required XP: ${tier.minPoints.toLocaleString()} XP`}
                        </p>
                      </div>
                    </div>

                    {/* Right: XP Requirements & Progress Bar */}
                    <div className="w-full md:w-64 shrink-0 text-left md:text-right">
                      <div className="flex justify-between md:justify-end gap-2 items-baseline text-xs mb-1.5">
                        <span className="text-slate-400 font-medium">XP Target:</span>
                        <span className="font-mono font-bold text-white">
                          {tier.minPoints.toLocaleString()} {tier.maxPoints ? `→ ${tier.maxPoints.toLocaleString()} XP` : '+ XP'}
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            status === 'completed'
                              ? 'bg-emerald-400'
                              : status === 'current'
                              ? 'bg-gradient-to-r from-orange-500 to-amber-400'
                              : 'bg-slate-700'
                          }`}
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>

                      {status === 'current' && tier.maxPoints && (
                        <span className="text-[11px] text-orange-400/90 font-mono mt-1 block">
                          {(tier.maxPoints - currentPoints + 1).toLocaleString()} XP needed for next tier
                        </span>
                      )}
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ======================================================== */}
        {/* SECTION 2: ALL BADGES & ACHIEVEMENTS EARNED              */}
        {/* ======================================================== */}
        <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-800">
            <div>
              <h2 className="text-xl md:text-2xl font-black text-white flex items-center gap-2.5">
                <Medal className="text-yellow-400" size={24} />
                Badges & Awards Collection
              </h2>
              <p className="text-xs md:text-sm text-slate-400 mt-1">
                Official achievement badges awarded for master projects, milestones, and streak records.
              </p>
            </div>
            <span className="px-3.5 py-1.5 rounded-xl bg-orange-500/10 border border-orange-500/20 text-xs font-black text-orange-400">
              {(stats.badges || []).length} Badges Earned
            </span>
          </div>

          {(stats.badges || []).length === 0 ? (
            <div className="p-12 bg-slate-950/50 border border-slate-800 rounded-2xl text-center">
              <Trophy size={40} className="text-slate-700 mx-auto mb-3" />
              <p className="text-slate-400 font-bold">No badges unlocked yet</p>
              <p className="text-slate-600 text-xs mt-1">Complete workshop assignments and milestone sales to earn verified badges!</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {(stats.badges || []).map((badge: any, i: number) => (
                <div
                  key={badge.id || i}
                  className="bg-gradient-to-b from-orange-500/10 to-amber-500/5 border border-orange-500/30 rounded-2xl p-4 text-center hover:scale-105 transition-all shadow-lg flex flex-col items-center justify-between"
                >
                  <div>
                    <div className="w-14 h-14 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-3xl mx-auto mb-3 shadow-inner">
                      {badge.icon || '🏅'}
                    </div>
                    <h4 className="text-sm font-black text-white leading-tight mb-1">{badge.name}</h4>
                    {badge.description && (
                      <p className="text-[11px] text-slate-400 leading-snug line-clamp-2">{badge.description}</p>
                    )}
                  </div>
                  <span className="mt-3 text-[10px] font-black px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    ✓ Unlocked
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ======================================================== */}
        {/* SECTION 3: COMPLETED MILESTONES & SKILLS MASTERY         */}
        {/* ======================================================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Milestones Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
            <h3 className="text-lg font-black text-white mb-4 flex items-center gap-2">
              <Target className="text-orange-400" size={20} />
              Career Milestones Checklist
            </h3>
            
            <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
              {(stats.milestones || []).length === 0 ? (
                <p className="text-xs text-slate-500">No milestones assigned yet.</p>
              ) : (
                stats.milestones.map((m: any, i: number) => (
                  <div
                    key={m.id || i}
                    className={`p-3 rounded-xl border flex items-center justify-between text-xs font-bold ${
                      m.completed
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      {m.completed ? <CheckCircle2 size={15} className="text-emerald-400" /> : <Lock size={14} className="text-slate-600" />}
                      {m.name}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${m.completed ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-500'}`}>
                      {m.completed ? 'Achieved' : 'In Progress'}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Skills Mastery Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
            <h3 className="text-lg font-black text-white mb-4 flex items-center gap-2">
              <Sparkles className="text-amber-400" size={20} />
              Technical Skill Scores
            </h3>

            <div className="space-y-3">
              {[
                { name: 'Resin Mixing & Ratios', score: stats.skills?.mixing || 85 },
                { name: 'Color Theory & Gradients', score: stats.skills?.colourTheory || 78 },
                { name: 'Wave Foam & Cell Formation', score: stats.skills?.creativity || 82 },
                { name: 'Bevel Sanding & Polishing', score: stats.skills?.finishing || 90 },
                { name: 'Commercial Product Quality', score: stats.skills?.professionalQuality || 80 },
              ].map((skill, i) => (
                <div key={i}>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-slate-300">{skill.name}</span>
                    <span className="text-amber-400 font-mono">{skill.score}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-orange-500 to-amber-400 rounded-full"
                      style={{ width: `${skill.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </main>
    </div>
  );
}
