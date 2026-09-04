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
import { Trophy, Sparkles } from "lucide-react";

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

  const getLevelName = () => {
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
