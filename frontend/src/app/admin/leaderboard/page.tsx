"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { AdminNav } from "@/components/layout/AdminNav";
import { Trophy, Flame, Star, Crown } from "lucide-react";
import { API_BASE_URL } from "@/config/api";
import { getLevelCode } from "@/components/layout/StudentNav";

export default function AdminLeaderboard() {
  const { token, user, logout } = useAuth();
  const [students, setStudents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [levelTiers, setLevelTiers] = useState<any[]>([]);

  useEffect(() => {
    if (!token) return;
    
    // Fetch leaderboard students
    fetch(`${API_BASE_URL}/leaderboard`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setStudents(data);
        setIsLoading(false);
      })
      .catch(err => { console.error(err); setIsLoading(false); });

    // Fetch dynamic level tiers from database
    fetch(`${API_BASE_URL}/admin/levels`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setLevelTiers(data);
        } else {
          fetch(`${API_BASE_URL}/dashboard/levels`)
            .then(r => r.json())
            .then(pubData => { if (Array.isArray(pubData)) setLevelTiers(pubData); })
            .catch(() => {});
        }
      })
      .catch(() => {
        fetch(`${API_BASE_URL}/dashboard/levels`)
          .then(r => r.json())
          .then(pubData => { if (Array.isArray(pubData)) setLevelTiers(pubData); })
          .catch(() => {});
      });
  }, [token]);

  const getStudentLevelBadge = (student: any) => {
    const candidate = (student.membershipLevel || student.rank || "").trim();
    const code = getLevelCode(candidate, student.points || 0);

    // Try finding matching level tier dynamically from DB
    const dbTier = levelTiers.find(
      (t: any) =>
        (t.code && t.code.toUpperCase() === code) ||
        (t.name && candidate.toUpperCase().includes(t.name.toUpperCase())) ||
        (t.code && candidate.toUpperCase().includes(t.code.toUpperCase()))
    );

    if (dbTier) {
      const colorMap: Record<string, string> = {
        purple: "text-purple-300 border-purple-500/40 bg-purple-500/10",
        cyan: "text-cyan-300 border-cyan-500/40 bg-cyan-500/10",
        yellow: "text-yellow-300 border-yellow-500/40 bg-yellow-500/10",
        amber: "text-yellow-300 border-yellow-500/40 bg-yellow-500/10",
        slate: "text-slate-200 border-slate-500/40 bg-slate-500/10",
        emerald: "text-emerald-300 border-emerald-500/40 bg-emerald-500/10",
        orange: "text-orange-300 border-orange-500/40 bg-orange-500/10",
      };
      const color = colorMap[dbTier.badgeColor] || "text-orange-300 border-orange-500/40 bg-orange-500/10";
      return {
        label: `${dbTier.name} (${dbTier.code})`,
        color,
      };
    }

    if (code === "L3+" || code.includes("L3+")) {
      return { label: student.rank || "Masters Club (L3+)", color: "text-purple-300 border-purple-500/40 bg-purple-500/10" };
    }
    if (code === "L3") {
      return { label: student.rank || "Diamond Club (L3)", color: "text-cyan-300 border-cyan-500/40 bg-cyan-500/10" };
    }
    if (code === "L2") {
      return { label: student.rank || "Gold Member (L2)", color: "text-yellow-300 border-yellow-500/40 bg-yellow-500/10" };
    }
    if (code === "L1") {
      return { label: student.rank || "Silver Member (L1)", color: "text-slate-200 border-slate-500/40 bg-slate-500/10" };
    }
    if (code === "L0") {
      return { label: student.rank || "Fast Track (L0)", color: "text-orange-300 border-orange-500/40 bg-orange-500/10" };
    }
    return { label: candidate || "General Member", color: "text-slate-400 border-slate-700 bg-slate-800/40" };
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <AdminNav user={user} logout={logout} />

      <main className="max-w-[1400px] mx-auto p-8">
        <header className="mb-12">
          <h1 className="text-3xl font-bold text-white">Platform Leaderboard</h1>
          <p className="text-slate-400 mt-2">Monitor top performing students across the Ravishing Art Hub ecosystem.</p>
        </header>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
          {/* Header Row */}
          <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-slate-800/50 border-b border-slate-800 text-xs font-bold text-slate-400 uppercase tracking-wider">
            <div className="col-span-1 text-center">Rank</div>
            <div className="col-span-5">Artist</div>
            <div className="col-span-2 text-center">Level</div>
            <div className="col-span-2 text-center">Streak</div>
            <div className="col-span-2 text-center">Points</div>
          </div>
          
          {isLoading ? (
            <div className="p-16 text-center text-slate-500">Loading rankings...</div>
          ) : students.length === 0 ? (
            <div className="p-16 text-center text-slate-500">No students ranked yet.</div>
          ) : (
            <div className="divide-y divide-slate-800">
              {students.map((student, index) => {
                const levelInfo = getStudentLevelBadge(student);
                const isTop3 = index < 3;
                return (
                  <div 
                    key={student.id} 
                    className={`grid grid-cols-12 gap-4 px-6 py-5 items-center transition-colors hover:bg-slate-800/50 ${
                      index === 0 ? 'bg-orange-500/5 border-l-2 border-orange-500' : ''
                    }`}
                  >
                    {/* Rank */}
                    <div className="col-span-1 flex items-center justify-center">
                      {index === 0 && <Crown size={24} className="text-orange-400" aria-label="1st Place" />}
                      {index === 1 && <Trophy size={22} className="text-slate-300" aria-label="2nd Place" />}
                      {index === 2 && <Trophy size={22} className="text-amber-600" aria-label="3rd Place" />}
                      {index > 2 && <span className="text-slate-500 font-bold text-sm">#{index + 1}</span>}
                    </div>
                    
                    {/* Artist */}
                    <div className="col-span-5 flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 border ${
                        isTop3 
                          ? 'bg-orange-500/20 border-orange-500/50 text-orange-400' 
                          : 'bg-slate-800 border-slate-700 text-white'
                      }`}>
                        {student.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-white">{student.name}</p>
                        <p className="text-xs text-slate-500">{student.city || 'Ravishing Artist'}</p>
                      </div>
                    </div>

                    {/* Level */}
                    <div className="col-span-2 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${levelInfo.color}`}>
                        <Star size={12} />
                        {levelInfo.label}
                      </span>
                    </div>

                    {/* Streak */}
                    <div className="col-span-2 text-center font-semibold text-orange-400 flex items-center justify-center gap-1">
                      <Flame size={16} className="text-orange-500" />
                      {student.streak || 0} days
                    </div>

                    {/* Points */}
                    <div className="col-span-2 text-center">
                      <span className="font-black text-white">{(student.points || 0).toLocaleString()}</span>
                      <span className="text-slate-500 text-xs ml-1">XP</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
