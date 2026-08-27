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
        fetch(`${API_BASE_URL}/admin/community-wins`, { headers }).then((r) => r.json()),
        fetch(`${API_BASE_URL}/admin/badges`, { headers }).then((r) => r.json()),
      ]);

      if (dashRes && !dashRes.message) {
        setUserStats({
          points: dashRes.points || 0,
          notifications: dashRes.notifications || [],
        });
      }
      if (Array.isArray(winsRes)) setWins(winsRes);
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

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col font-sans">
      <StudentNav
        user={user}
        level={getLevelName()}
        points={userStats.points}
        logout={logout}
        notifications={userStats.notifications}
      />

      <main className="flex-1 max-w-[1400px] mx-auto w-full p-4 md:p-8">
        <header className="mb-6 md:mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-4xl font-black text-white flex items-center gap-3">
              <Sparkles className="text-orange-400" size={32} /> Sisterhood Community Feed
            </h1>
            <p className="text-slate-400 text-sm md:text-base mt-1">
              Live sisterhood sales, resin artwork showcases, student milestones, and mentor updates.
            </p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main Community Feed (8 Cols) */}
          <div className="lg:col-span-8">
            <WinWall communityWins={wins} onWinAdded={fetchData} />
          </div>

          {/* Right Side: Badges Spotlight & Diamond Gamification (4 Cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
              <h3 className="text-base font-bold text-white flex items-center gap-2 mb-2">
                <Trophy className="text-amber-400" size={20} /> Student Badges Spotlight
              </h3>
              <p className="text-xs text-slate-400 mb-5">
                Earn badges by completing courses, sales milestones, and Art-o-Thon challenges.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {(badges && badges.length > 0
                  ? badges
                  : [
                      { name: "First Resin Pour", icon: "🎨", pointsRequired: 100 },
                      { name: "First Client Sale", icon: "💰", pointsRequired: 500 },
                      { name: "Art-o-thon finisher", icon: "💎", pointsRequired: 500 },
                      { name: "HOF Creator", icon: "👑", pointsRequired: 1000 },
                    ]
                )
                  .slice(0, 4)
                  .map((b: any, idx: number) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800/80 flex flex-col items-center text-center hover:border-slate-700 transition-colors"
                    >
                      <span className="text-3xl mb-1.5">{b.icon || "🏆"}</span>
                      <span className="text-xs font-bold text-white truncate w-full">{b.name}</span>
                      <span className="text-[10px] text-amber-400 font-semibold mt-0.5">
                        {b.pointsRequired || 100} XP
                      </span>
                    </div>
                  ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <Flame className="text-orange-400" size={16} /> Diamond Club Gamification
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Level 3 (L3 Diamond Club) members earn <span className="text-amber-400 font-bold">+15 XP</span> for feed posts, <span className="text-amber-400 font-bold">+30 XP</span> for win wall sales shares, and <span className="text-amber-400 font-bold">+5 XP</span> for comments.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
