"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { StudentNav } from "@/components/layout/StudentNav";
import { Gift, Star, ShieldAlert, Sparkles, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { API_BASE_URL } from "@/config/api";

export default function StudentRewards() {
  const { user, token, logout } = useAuth();
  const [rewards, setRewards] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({ points: 0, notifications: [] });
  const [isRedeeming, setIsRedeeming] = useState<string | null>(null);

  const fetchData = async () => {
    if (!token) return;
    try {
      // Nav Stats & User Balance
      const statsRes = await fetch(`${API_BASE_URL}/dashboard/student`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const statsData = await statsRes.json();
      if (statsData && !statsData.message) {
        setStats({ points: statsData.points, notifications: statsData.notifications });
      }

      // Rewards Store
      const rewRes = await fetch(`${API_BASE_URL}/rewards`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const rewData = await rewRes.json();
      if (Array.isArray(rewData) && rewData.length > 0) {
        setRewards(rewData);
      } else {
        // Fallback static data if backend is empty
        setRewards([
          { id: "1", title: "Digital Certificate", description: "Official Art Concept Certificate of Completion", pointCost: 500 },
          { id: "2", title: "1-on-1 Mentoring", description: "30 minute portfolio review with a master artist", pointCost: 3000 },
          { id: "3", title: "Premium Brushes", description: "Exclusive digital brush pack for Procreate", pointCost: 1500 },
        ]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  const handleRedeem = async (rewardId: string, cost: number) => {
    if (stats.points < cost) {
      alert("Not enough points!");
      return;
    }
    
    setIsRedeeming(rewardId);
    try {
      const res = await fetch(`${API_BASE_URL}/rewards/${rewardId}/redeem`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      alert(data.message);
      await fetchData(); // Refresh stats to update balance
    } catch (err) {
      console.error(err);
    } finally {
      setIsRedeeming(null);
    }
  };

  const getLevelName = (points: number) => {
    if (points < 500) return "Fast Start (L0)";
    if (points < 5000) return "Silver Member (L1)";
    if (points < 10000) return "Gold Member (L2)";
    if (points < 50000) return "Diamond Club (L3)";
    return "Masters Club (L3+)";
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      <StudentNav 
        user={user} 
        level={getLevelName(stats.points)} 
        points={stats.points} 
        logout={logout} 
        notifications={stats.notifications}
      />

      <main className="flex-1 max-w-[1400px] mx-auto w-full p-4 md:p-8">
        <header className="mb-8 md:mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 md:gap-6">
          <div>
            <h1 className="text-2xl md:text-5xl font-black text-white flex items-center gap-3 md:gap-4 mb-3 md:mb-4">
              <Gift className="text-pink-500" size={32} /> Rewards Store
            </h1>
            <p className="text-slate-400 text-sm md:text-lg max-w-xl">Trade your hard-earned XP points for exclusive perks, discounts, and mentoring sessions.</p>
          </div>
          
          <div className="w-full md:w-auto bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 px-6 md:px-8 py-4 rounded-3xl shadow-xl flex items-center gap-4 md:gap-5">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-pink-500/20 rounded-2xl flex items-center justify-center">
              <Star size={22} className="text-pink-400" />
            </div>
            <div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Available XP</p>
              <p className="text-2xl md:text-3xl font-black text-white">{stats.points.toLocaleString()} <span className="text-pink-400 text-lg md:text-xl">pts</span></p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rewards.map((reward, idx) => {
            const canAfford = stats.points >= reward.pointCost;
            
            return (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                key={reward.id} 
                className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl flex flex-col hover:border-slate-700 transition-colors group relative"
              >
                {!canAfford && (
                  <div className="absolute top-4 right-4 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-800 flex items-center gap-1.5 z-10">
                    <AlertCircle size={14} className="text-slate-400" />
                    <span className="text-xs font-bold text-slate-300">Need {(reward.pointCost - stats.points).toLocaleString()} more</span>
                  </div>
                )}
                
                <div className="h-40 bg-slate-800 relative flex items-center justify-center overflow-hidden">
                  {reward.imageUrl ? (
                    <img src={reward.imageUrl} alt={reward.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity group-hover:scale-105 duration-500" />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-pink-900/40 to-purple-900/40" />
                  )}
                  <Gift size={48} className="text-white/20 absolute z-0" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />
                </div>
                
                <div className="p-6 flex flex-col flex-1 relative z-10 -mt-8">
                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 mb-4 shadow-lg flex items-center justify-between">
                    <span className="text-slate-400 font-bold text-sm">Cost</span>
                    <span className="text-xl font-black text-pink-400 flex items-center gap-1"><Sparkles size={16} /> {reward.pointCost.toLocaleString()} XP</span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-2">{reward.title}</h3>
                  <p className="text-slate-400 text-sm mb-6 flex-1">{reward.description}</p>
                  
                  <button
                    onClick={() => handleRedeem(reward.id, reward.pointCost)}
                    disabled={!canAfford || isRedeeming === reward.id}
                    className={`w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                      canAfford 
                        ? "bg-pink-500 hover:bg-pink-600 text-white shadow-lg shadow-pink-500/20" 
                        : "bg-slate-800 text-slate-500 cursor-not-allowed"
                    }`}
                  >
                    {isRedeeming === reward.id ? "Redeeming..." : canAfford ? "Claim Reward" : "Not Enough XP"}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
