"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { StudentNav } from "@/components/layout/StudentNav";
import { Trophy, Flame, Crown, Medal, Award } from "lucide-react";
import { motion } from "framer-motion";

import { API_BASE_URL } from "@/config/api";

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
          setStats({ points: data.points, notifications: data.notifications });
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

  const getLevelName = (points: number) => {
    if (points < 500) return "Fast Start (L0)";
    if (points < 5000) return "Silver Member (L1)";
    if (points < 10000) return "Gold Member (L2)";
    if (points < 50000) return "Diamond Club (L3)";
    return "Masters Club (L3+)";
  };

  const top3 = students.slice(0, 3);
  const rest = students.slice(3);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      <StudentNav 
        user={user} 
        level={getLevelName(stats.points)} 
        points={stats.points} 
        logout={logout} 
        notifications={stats.notifications}
      />

      <main className="flex-1 max-w-[1000px] mx-auto w-full p-4 md:p-8">
        <header className="mb-12 text-center">
          <h1 className="text-3xl md:text-5xl font-black text-white flex justify-center items-center gap-4 mb-4">
            <Trophy className="text-yellow-400" size={40} /> Global Leaderboard
          </h1>
          <p className="text-slate-400 text-lg">Compete with artists worldwide and earn your spot at the top.</p>
        </header>

        {/* Top 3 Podium */}
        {top3.length > 0 && (
          <div className="flex justify-center items-end gap-2 sm:gap-6 mb-16 h-64">
            {/* 2nd Place */}
            {top3[1] && (
              <motion.div 
                initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="w-1/3 max-w-[180px] flex flex-col items-center"
              >
                <div className="relative mb-4">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-slate-300 overflow-hidden relative z-10">
                    <img src={top3[1].avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop"} alt={top3[1].name} className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-slate-300 text-slate-950 w-8 h-8 rounded-full flex items-center justify-center font-black border-2 border-slate-950 z-20">2</div>
                </div>
                <div className="w-full h-32 bg-gradient-to-t from-slate-800 to-slate-800/50 rounded-t-3xl border border-slate-700 flex flex-col items-center pt-6 px-2 text-center">
                  <p className="font-bold text-white text-sm sm:text-base truncate w-full">{top3[1].name}</p>
                  <p className="text-slate-400 font-black text-xs sm:text-sm mt-1">{top3[1].points.toLocaleString()} XP</p>
                </div>
              </motion.div>
            )}

            {/* 1st Place */}
            {top3[0] && (
              <motion.div 
                initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="w-1/3 max-w-[200px] flex flex-col items-center"
              >
                <div className="relative mb-4">
                  <Crown className="absolute -top-8 left-1/2 -translate-x-1/2 text-yellow-400 z-20" size={32} />
                  <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full border-4 border-yellow-400 overflow-hidden relative z-10 shadow-[0_0_30px_rgba(250,204,21,0.3)]">
                    <img src={top3[0].avatarUrl || "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=150&auto=format&fit=crop"} alt={top3[0].name} className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-yellow-400 text-yellow-950 w-10 h-10 rounded-full flex items-center justify-center font-black border-4 border-slate-950 z-20 shadow-lg">1</div>
                </div>
                <div className="w-full h-40 bg-gradient-to-t from-yellow-500/20 to-slate-800 rounded-t-3xl border border-yellow-500/30 flex flex-col items-center pt-8 px-2 text-center shadow-[0_-10px_40px_rgba(250,204,21,0.1)]">
                  <p className="font-black text-white text-base sm:text-lg truncate w-full">{top3[0].name}</p>
                  <p className="text-yellow-400 font-black text-sm mt-1">{top3[0].points.toLocaleString()} XP</p>
                </div>
              </motion.div>
            )}

            {/* 3rd Place */}
            {top3[2] && (
              <motion.div 
                initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                className="w-1/3 max-w-[180px] flex flex-col items-center"
              >
                <div className="relative mb-4">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-orange-600 overflow-hidden relative z-10">
                    <img src={top3[2].avatarUrl || "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=150&auto=format&fit=crop"} alt={top3[2].name} className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-orange-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-black border-2 border-slate-950 z-20">3</div>
                </div>
                <div className="w-full h-24 bg-gradient-to-t from-slate-800 to-slate-800/40 rounded-t-3xl border border-slate-700 flex flex-col items-center pt-5 px-2 text-center">
                  <p className="font-bold text-white text-sm sm:text-base truncate w-full">{top3[2].name}</p>
                  <p className="text-slate-400 font-black text-xs sm:text-sm mt-1">{top3[2].points.toLocaleString()} XP</p>
                </div>
              </motion.div>
            )}
          </div>
        )}

        {/* Rest of Leaderboard */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
          <div className="grid grid-cols-10 sm:grid-cols-12 gap-2 px-4 md:px-6 py-4 bg-slate-800/50 border-b border-slate-800 text-xs font-bold text-slate-400 uppercase tracking-wider">
            <div className="col-span-2 text-center">Rank</div>
            <div className="col-span-5 sm:col-span-6">Artist</div>
            <div className="hidden sm:block col-span-2 text-center">Streak</div>
            <div className="col-span-3 sm:col-span-2 text-right">Points</div>
          </div>
          
          <div className="divide-y divide-slate-800/50">
            {students.length === 0 && (
              <div className="p-16 text-center text-slate-500 font-medium">Loading rankings...</div>
            )}
            {rest.map((student, index) => {
              const isMe = student.id === user?.id;
              const rank = index + 4;
              return (
                <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: index * 0.05 }}
                  key={student.id}
                  className={`grid grid-cols-10 sm:grid-cols-12 gap-2 px-4 md:px-6 py-4 items-center hover:bg-slate-800/30 transition-colors ${isMe ? 'bg-blue-500/10 hover:bg-blue-500/20' : ''}`}
                >
                  <div className="col-span-2 flex justify-center">
                    <span className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-black text-xs sm:text-sm ${isMe ? 'bg-blue-500 text-white' : 'text-slate-500 bg-slate-800'}`}>
                      {rank}
                    </span>
                  </div>

                  <div className="col-span-5 sm:col-span-6 flex items-center gap-2 sm:gap-4 min-w-0">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center font-bold text-white shadow-inner shrink-0 text-xs sm:text-sm">
                      {student.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-white flex items-center gap-1 sm:gap-2 text-sm sm:text-base">
                        <span className="truncate max-w-[80px] sm:max-w-none">{student.name}</span>
                        {isMe && <span className="text-[9px] uppercase tracking-wider bg-blue-500 text-white px-1.5 py-0.5 rounded-full shrink-0">You</span>}
                      </div>
                      <p className="text-xs text-slate-500 truncate">{student.membershipLevel}</p>
                    </div>
                  </div>

                  <div className="hidden sm:flex col-span-2 justify-center">
                    <div className="flex items-center gap-1.5 px-2 sm:px-3 py-1 rounded-full bg-slate-950 border border-slate-800">
                      <Flame size={12} className="text-orange-500" />
                      <span className="font-bold text-slate-300 text-xs sm:text-sm">{student.streak}</span>
                    </div>
                  </div>

                  <div className="col-span-3 sm:col-span-2 text-right">
                    <span className="font-black text-white text-sm sm:text-base tracking-tight">{student.points.toLocaleString()} <span className="text-[10px] text-slate-500 font-semibold">XP</span></span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
