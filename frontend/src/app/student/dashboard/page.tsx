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

import { API_BASE_URL } from "@/config/api";

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

  const fetchStats = () => {
    if (!token) return;
    fetch(`${API_BASE_URL}/dashboard/student`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data && !data.message) {
          setStats(data);
        }
      })
      .catch(err => console.error("Error fetching student stats:", err));
  };

  useEffect(() => {
    fetchStats();
  }, [token]);

  const getLevelName = (points: number) => {
    if (points < 500) return "Fast Start (L0)";
    if (points < 5000) return "Silver Member (L1)";
    if (points < 10000) return "Gold Member (L2)";
    if (points < 50000) return "Diamond Club (L3)";
    return "Masters Club (L3+)";
  };

  // Calculate dynamic progress based on enrolled course
  const enrolledCourse = stats.courses?.find((c: any) => c.UserCourse?.status === 'enrolled');
  const dynamicProgress = enrolledCourse?.UserCourse?.progress || 0;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      
      <StudentNav 
        user={user} 
        level={getLevelName(stats.points)} 
        points={stats.points} 
        logout={logout} 
        notifications={stats.notifications}
      />

      <main className="max-w-[1400px] mx-auto p-3 md:p-4 lg:p-8 space-y-4 md:space-y-6">
          
          <WelcomeHeader 
            user={user} 
            level={getLevelName(stats.points)} 
            xp={stats.points} 
            streak={stats.streak} 
            progress={dynamicProgress} 
            nextGoal={stats.nextGoal}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
            <div className="lg:col-span-2">
              <LearningProgress courses={stats.courses} nextGoal={stats.nextGoal} />
            </div>
            <div className="lg:col-span-1">
              <SkillMastery skills={stats.skills} />
            </div>
          </div>

          <CoursesAndBadges badges={stats.badges} courses={stats.courses} allCourses={stats.allCourses} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            <PortfolioGallery portfolios={stats.portfolios} />
            <BusinessMilestones milestones={stats.milestones} />
          </div>

          <SalesAndCommunity sales={stats.salesRecords} communityWins={stats.communityWins} onInteract={fetchStats} />
          
          <RewardsStore currentPoints={stats.points} onRedeem={fetchStats} />

          <AiMentor skills={stats.skills} />

        </main>
    </div>
  );
}
