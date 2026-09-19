"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { StudentNav } from "@/components/layout/StudentNav";
import { Gift, Star, ShieldAlert, Sparkles, AlertCircle, Lock, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { API_BASE_URL } from "@/config/api";
import { getLevelCode } from "@/components/layout/StudentNav";
import { TierPurchaseModal } from "@/components/membership/TierPurchaseModal";

export default function StudentRewards() {
  const { user, token, logout } = useAuth();
  const [rewards, setRewards] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({ points: 0, notifications: [] });
  const [isRedeeming, setIsRedeeming] = useState<string | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [selectedUpgradeTier, setSelectedUpgradeTier] = useState("L3");

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
          { id: "1", title: "30 min 1-on-1 Mentoring Call", description: "Private 1-on-1 strategy & portfolio review session with Vrajangna Patel (Prior booking required).", pointCost: 1500 },
          { id: "2", title: "Custom Artistry Journal with Pen", description: "Premium hardcover resin artist planner & goal tracking journal with signature metallic gel pen.", pointCost: 2000 },
          { id: "3", title: "Ravishing Art Physical Merch Kit", description: "Complete 9-Piece Merch Bundle: Badge/Fridge Magnet, Goal Card, Lanyard Keychain, A5 Customized Notebook (80 pgs), Corrugated Box, Logo Pen, 8x4 Voucher, Appreciation Card & Silicone Wrist Band.", pointCost: 3000 },
          { id: "4", title: "15% Off Discount Voucher", description: "Redeem 15% discount on any advanced masterclass course or live offline workshop ticket.", pointCost: 5000 },
          { id: "5", title: "50% OFF Live Ticket + Physical Renaissance Certificate", description: "50% discount on live event ticket + physical printed Renaissance Master Certification awarded live on stage.", pointCost: 10000 },
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

  const effectiveLevel = user?.membershipLevel || user?.rank || "";
  const studentLevelCode = getLevelCode(effectiveLevel, stats.points || 0);
  const isGeneral = studentLevelCode === "GENERAL";

  const uLvl = (user?.membershipLevel || stats?.membershipLevel || user?.rank || "").toUpperCase();
  const isL3 = uLvl.includes("L3") || uLvl.includes("DIAMOND") || uLvl.includes("RENAISSANCE") || uLvl.includes("MASTERS");

  const getLevelName = (points: number) => {
    if (isGeneral) return "General Member";
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
        {isGeneral ? (
          <div className="py-12 px-4 max-w-2xl mx-auto text-center space-y-6">
            <div className="w-16 h-16 rounded-3xl bg-pink-500/20 border-2 border-pink-500/40 flex items-center justify-center text-pink-400 mx-auto shadow-2xl">
              <Lock size={32} />
            </div>
            <h1 className="text-3xl font-black text-white">Rewards Store is Locked for General Members</h1>
            <p className="text-slate-300 text-sm leading-relaxed">
              General members cannot redeem physical merch or mentoring calls without active Level enrollment. Upgrade to Fast Track (Level 0) or above to unlock the Rewards Store and earn XP.
            </p>
            <button
              onClick={() => {
                setSelectedUpgradeTier("L0");
                setShowUpgradeModal(true);
              }}
              className="px-8 py-3.5 bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-black rounded-xl text-sm shadow-xl flex items-center gap-2 mx-auto hover:scale-105 transition-all cursor-pointer"
            >
              <Zap size={16} />
              Unlock Fast Track (₹499)
            </button>
          </div>
        ) : (
        <>
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

        {/* L3 Diamond Club Exclusive Redemption Notice */}
        {!isL3 && (
          <div className="mb-8 p-4 md:p-5 rounded-3xl bg-gradient-to-r from-cyan-950/80 to-slate-900 border border-cyan-500/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0">
                <Sparkles size={20} />
              </div>
              <div>
                <h4 className="text-sm font-black text-cyan-300">💎 Merch Store Redemption is Exclusive to Level 3 (Diamond Club)</h4>
                <p className="text-xs text-slate-300 mt-0.5">
                  You are actively earning and accumulating XP across your courses, live classes, daily routines, and community wins! Merch Store redemptions unlock when you upgrade to Level 3 (Diamond Club).
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setSelectedUpgradeTier("L3");
                setShowUpgradeModal(true);
              }}
              className="px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black rounded-xl text-xs shadow-lg flex items-center gap-1.5 shrink-0 transition-all cursor-pointer whitespace-nowrap"
            >
              <Sparkles size={14} /> Upgrade to L3
            </button>
          </div>
        )}

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
                  
                  {isL3 ? (
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
                  ) : (
                    <button
                      onClick={() => {
                        setSelectedUpgradeTier("L3");
                        setShowUpgradeModal(true);
                      }}
                      className="w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 shadow-lg shadow-orange-500/20 cursor-pointer"
                    >
                      <Lock size={16} /> L3 Diamond Exclusive to Redeem
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
        </>
        )}

        <TierPurchaseModal
          isOpen={showUpgradeModal}
          onClose={() => setShowUpgradeModal(false)}
          preselectedTier={selectedUpgradeTier}
          onSuccess={() => {
            setShowUpgradeModal(false);
            fetchData();
          }}
        />
      </main>
    </div>
  );
}
