"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

import { StudentNav } from "@/components/layout/StudentNav";
import { WelcomeHeader } from "@/components/dashboard/WelcomeHeader";
import { LearningProgress } from "@/components/dashboard/LearningProgress";
import { SkillMastery } from "@/components/dashboard/SkillMastery";
import { CoursesAndBadges } from "@/components/dashboard/CoursesAndBadges";
import { PortfolioGallery } from "@/components/dashboard/PortfolioGallery";
import { BusinessMilestones } from "@/components/dashboard/BusinessMilestones";
import { SalesAndCommunity } from "@/components/dashboard/SalesAndCommunity";
import { AiMentor } from "@/components/dashboard/AiMentor";
import { RewardsStore } from "@/components/dashboard/RewardsStore";
import { WinWall } from "@/components/dashboard/WinWall";
import { DailyRoutineChecklist } from "@/components/dashboard/DailyRoutineChecklist";
import { DashboardSkeleton } from "@/components/ui/SkeletonLoader";
import { Trophy, Sparkles, Lock, ArrowRight, Zap, BookOpen } from "lucide-react";
import Link from "next/link";
import { getLevelCode } from "@/components/layout/StudentNav";
import { TierPurchaseModal } from "@/components/membership/TierPurchaseModal";

import { API_BASE_URL } from "@/config/api";

const CACHE_KEY = 'student_dashboard_cache';
const CACHE_TTL = 30 * 1000; // 30 seconds

export default function StudentDashboard() {
  const { user, token, logout } = useAuth();
  const [stats, setStats] = useState<any>({
    points: 0,
    streak: 0,
    skills: null,
    badges: [],
    portfolios: [],
    milestones: [],
    salesRecords: [],
    courses: []
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchStats = (silent = false) => {
    if (!token) return;
    if (!silent) setIsLoading(true);
    fetch(`${API_BASE_URL}/dashboard/student`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data && !data.message) {
          setStats(data);
          // Cache in sessionStorage for instant re-loads
          try {
            sessionStorage.setItem(CACHE_KEY, JSON.stringify({ data, ts: Date.now() }));
          } catch (_) {}
        }
      })
      .catch(err => console.error("Error fetching student stats:", err))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    if (!token) return;
    // Try to load from cache first for instant display
    try {
      const cached = sessionStorage.getItem(CACHE_KEY);
      if (cached) {
        const { data, ts } = JSON.parse(cached);
        if (Date.now() - ts < CACHE_TTL) {
          setStats(data);
          setIsLoading(false);
          fetchStats(true); // silent background refresh
          return;
        }
      }
    } catch (_) {}
    fetchStats();
  }, [token]);

  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const effectiveLevel = user?.membershipLevel || stats.membershipLevel || user?.rank || stats.rank || "";
  const studentLevelCode = getLevelCode(effectiveLevel, stats.points || 0);
  const isGeneral = studentLevelCode === "GENERAL";

  const getLevelName = () => {
    if (isGeneral) return "General Member";
    if (user?.membershipLevel) return user.membershipLevel;
    if (stats.membershipLevel) return stats.membershipLevel;
    if (stats.rank) return stats.rank;
    if (stats.currentTier?.name) {
      return `${stats.currentTier.name} (${stats.currentTier.code})`;
    }
    return "Fast Track (L0)";
  };

  // Calculate dynamic progress based on enrolled course
  const enrolledCourse = stats.courses?.find((c: any) => c.UserCourse?.status === 'enrolled');
  const dynamicProgress = enrolledCourse?.UserCourse?.progress || 0;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      
      <StudentNav 
        user={user} 
        level={getLevelName()} 
        points={stats.points} 
        logout={logout} 
        notifications={stats.notifications}
      />

      <main className="max-w-[1400px] mx-auto p-3 md:p-4 lg:p-8 space-y-4 md:space-y-6">
        {isLoading ? (
          <DashboardSkeleton />
        ) : isGeneral ? (
          <div className="py-12 px-4 max-w-3xl mx-auto text-center space-y-8 animate-in fade-in zoom-in-95 duration-300">
            <div className="w-20 h-20 rounded-3xl bg-orange-500/20 border-2 border-orange-500/40 flex items-center justify-center text-orange-400 mx-auto shadow-2xl shadow-orange-500/30">
              <Lock size={40} />
            </div>

            <div className="space-y-3">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-bold uppercase tracking-wider">
                <Sparkles size={13} /> Level 0 Fast Track Required
              </span>
              <h1 className="text-3xl md:text-5xl font-black text-white leading-tight">
                Dashboard Locked for General Members
              </h1>
              <p className="text-slate-300 text-sm md:text-base leading-relaxed max-w-xl mx-auto">
                You are currently registered as a <strong className="text-white">General Member</strong>. Your personal dashboard, 6-step daily habits routine, progress tracking, and gamified rewards unlock when you enroll in <strong className="text-orange-400">Fast Track (Level 0)</strong> or higher!
              </p>
            </div>

            {/* Value Preview Box */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 md:p-8 text-left space-y-4 shadow-xl">
              <h3 className="text-sm font-black uppercase tracking-wider text-orange-400">
                What Unlocks with Fast Track (Level 0):
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300">
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-emerald-400">✓</span> 4 Essential Video Masterclasses
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-emerald-400">✓</span> Daily Routine &amp; Habit Checklist
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-emerald-400">✓</span> XP Points &amp; Badge Milestones
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-emerald-400">✓</span> Full Student Overview Analytics
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => setShowUpgradeModal(true)}
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-black rounded-2xl text-base shadow-xl shadow-orange-500/25 flex items-center justify-center gap-2 hover:scale-105 transition-all cursor-pointer"
              >
                <Zap size={18} />
                Unlock Fast Track (₹499)
              </button>
              <Link
                href="/student/feed"
                className="w-full sm:w-auto px-6 py-4 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white font-bold rounded-2xl text-base transition-all flex items-center justify-center gap-2"
              >
                <Sparkles size={16} className="text-orange-400" />
                Go to Community Feed
              </Link>
            </div>

            <TierPurchaseModal
              isOpen={showUpgradeModal}
              onClose={() => setShowUpgradeModal(false)}
              preselectedTier="L0"
              onSuccess={() => {
                setShowUpgradeModal(false);
                fetchStats();
              }}
            />
          </div>
        ) : (<>
          {/* Header & Badges Showcase Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 items-stretch">
            <div className="lg:col-span-8 flex flex-col">
              <WelcomeHeader 
                user={user} 
                level={getLevelName()} 
                xp={stats.points} 
                streak={stats.streak} 
                weekStatus={stats.weekStatus}
                progress={dynamicProgress} 
                nextGoal={stats.nextGoal}
                currentTier={stats.currentTier}
                badges={stats.badges}
                salesRecords={stats.salesRecords}
              />
            </div>
            <div className="lg:col-span-4 flex flex-col">
              <SkillMastery skills={stats.skills} />
            </div>
          </div>

          {/* Today's Focus: 6-Step Daily Habits & Routine */}
          <DailyRoutineChecklist streak={stats.streak} onCompleteRoutine={fetchStats} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
            <div className="lg:col-span-2">
              <LearningProgress courses={stats.courses} nextGoal={stats.nextGoal} />
            </div>
            <div className="lg:col-span-1">
              <BusinessMilestones milestones={stats.milestones} />
            </div>
          </div>

          <CoursesAndBadges badges={stats.badges} courses={stats.courses} allCourses={stats.allCourses} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            <PortfolioGallery portfolios={stats.portfolios} />
            <SalesAndCommunity sales={stats.salesRecords} communityWins={stats.communityWins} onInteract={fetchStats} />
          </div>

          <RewardsStore currentPoints={stats.points} onRedeem={fetchStats} />

          <AiMentor skills={stats.skills} />
        </>)}
        </main>
    </div>
  );
}
