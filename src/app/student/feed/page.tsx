"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { StudentNav } from "@/components/layout/StudentNav";
import { WinWall } from "@/components/dashboard/WinWall";
import { Trophy, Sparkles, Flame, MessageSquare, Award } from "lucide-react";
import { API_BASE_URL } from "@/config/api";

export default function StudentFeedPage() {
  const { user, logout, token } = useAuth();
  const [wins, setWins] = useState<any[]>([]);
  const [badges, setBadges] = useState<any[]>([]);
  const [userStats, setUserStats] = useState({ points: 0, notifications: [] });
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    if (!token) return;
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const [dashRes, winsRes, badgesRes] = await Promise.all([
        fetch(`${API_BASE_URL}/dashboard/student`, { headers }).then((r) => r.json()),
        fetch(`${API_BASE_URL}/dashboard/community-wins`, { headers }).then((r) => r.json()),
        fetch(`${API_BASE_URL}/dashboard/badges`, { headers }).then((r) => r.json()),
      ]);

      if (dashRes && !dashRes.message) {
        setUserStats({
          points: dashRes.points || 0,
          notifications: dashRes.notifications || [],
        });
      }
      if (Array.isArray(winsRes)) setWins(winsRes);
      else if (winsRes?.data && Array.isArray(winsRes.data)) setWins(winsRes.data);
      if (Array.isArray(badgesRes)) setBadges(badgesRes);

    } catch (err) {
      console.error("Error fetching feed data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  const getLevelName = () => user?.membershipLevel || user?.rank || "L0 Fast Track";

  const defaultBadges = [
    { name: "First Resin Pour", icon: "🎨", pointsRequired: 100 },
    { name: "First Client Sale", icon: "💰", pointsRequired: 200 },
    { name: "Streak Champion", icon: "🔥", pointsRequired: 300 },
    { name: "Art-o-thon Finisher", icon: "🏆", pointsRequired: 500 },
  ];

  const displayBadges = (badges && badges.length > 0 ? badges : defaultBadges).slice(0, 4);

  return (
    <div
      className="min-h-screen bg-[#faf8f5] text-stone-900 flex flex-col font-sans transition-colors lg:pl-[284px]"
      style={{
        backgroundColor: "#faf8f5",
        backgroundImage: "radial-gradient(circle, #e2ded4 1.5px, transparent 1.5px)",
        backgroundSize: "24px 24px",
        backgroundAttachment: "fixed",
      }}
    >
      <StudentNav
        user={user}
        level={getLevelName()}
        points={userStats.points}
        logout={logout}
        notifications={userStats.notifications}
      />

      <main className="flex-1 w-full px-4 sm:px-5 lg:px-5 py-5 sm:py-6">
        <header className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-extrabold text-stone-900 tracking-tight flex items-center gap-2.5">
            <Sparkles className="text-[#c4431d]" size={28} /> Sisterhood Community Feed
          </h1>
          <p className="text-stone-500 text-xs sm:text-sm mt-1">
            Live sisterhood sales, resin artwork showcases, student milestones, and mentor updates.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main Community Feed (8 Cols) */}
          <div className="lg:col-span-8">
            <WinWall communityWins={wins} onWinAdded={fetchData} membershipLevel={user?.membershipLevel} />
          </div>

          {/* Right Side: Badges Spotlight & Diamond Gamification (4 Cols - Sticky) */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
            {/* Student Badges Spotlight Card (Exact match to Reference Image 2) */}
            <div className="bg-white rounded-3xl border border-[#ecdccb]/80 p-5 sm:p-6 shadow-[0_4px_20px_-4px_rgba(90,55,20,0.05)]">
              <h3 className="text-base font-bold text-stone-900 flex items-center gap-2 mb-1.5">
                <Trophy className="text-[#c4431d]" size={18} /> Student Badges Spotlight
              </h3>
              <p className="text-xs text-stone-500 mb-4 leading-relaxed">
                Earn badges by completing courses, sales milestones, and Art-o-Thon challenges.
              </p>
              <div className="flex flex-col gap-2.5">
                {displayBadges.map((b: any, idx: number) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3.5 rounded-2xl bg-[#faf8f5]/80 hover:bg-[#f6f2ed] transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-xl shrink-0">{b.icon || "🏆"}</span>
                      <span className="text-xs sm:text-sm font-bold text-stone-900 truncate">
                        {b.name}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-[#c4431d] shrink-0 font-mono">
                      {b.pointsRequired || 100} XP
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Diamond Club Gamification Card */}
            <div className="bg-white rounded-3xl border border-[#ecdccb]/80 p-5 sm:p-6 shadow-[0_4px_20px_-4px_rgba(90,55,20,0.05)] space-y-2">
              <h4 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                <Flame className="text-[#c4431d]" size={16} /> Diamond Club Gamification
              </h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Level 3 (L3 Diamond Club) members earn <strong className="text-[#c4431d] font-bold">+15 XP</strong> for feed posts, <strong className="text-[#c4431d] font-bold">+30 XP</strong> for win wall sales shares, and <strong className="text-[#c4431d] font-bold">+5 XP</strong> for comments.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
