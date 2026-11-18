"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { StudentNav } from "@/components/layout/StudentNav";
import {
  Sparkles,
  Check,
  Lock,
  Crown,
  ChevronRight,
  X,
  Zap,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { API_BASE_URL } from "@/config/api";
import { getLevelCode } from "@/components/layout/StudentNav";
import { TierPurchaseModal } from "@/components/membership/TierPurchaseModal";

const DEFAULT_REWARD_IMAGES = [
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=300&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=300&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=300&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=300&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=300&auto=format&fit=crop",
];

const getRewardImage = (reward: any, index: number = 0) => {
  if (reward?.imageUrl && typeof reward.imageUrl === "string" && reward.imageUrl.trim() !== "") {
    return reward.imageUrl;
  }
  return DEFAULT_REWARD_IMAGES[index % DEFAULT_REWARD_IMAGES.length];
};

export default function StudentRewards() {
  const { user, token, logout } = useAuth();
  const [rewards, setRewards] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({ points: 0, notifications: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [isRedeeming, setIsRedeeming] = useState<string | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [selectedUpgradeTier, setSelectedUpgradeTier] = useState("L3");

  // Tab filter: "all" | "unlocked" | "current" | "locked"
  const [activeFilter, setActiveFilter] = useState<"all" | "unlocked" | "current" | "locked">("all");

  // Selected reward for "View Details" modal
  const [selectedReward, setSelectedReward] = useState<any | null>(null);

  const fetchData = async () => {
    if (!token) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      // Nav Stats & User Balance
      const statsRes = await fetch(`${API_BASE_URL}/dashboard/student`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const statsData = await statsRes.json();
      if (statsData && !statsData.message) {
        setStats({
          points: statsData.points ?? 0,
          notifications: statsData.notifications ?? [],
          membershipLevel: statsData.membershipLevel,
          rank: statsData.rank,
          currentTier: statsData.currentTier,
          ...statsData,
        });
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
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  const handleRedeem = async (rewardId: string, cost: number) => {
    if ((stats.points || 0) < cost) {
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
      alert(data.message || "Reward redeemed successfully!");
      setSelectedReward(null);
      await fetchData(); // Refresh stats to update balance
    } catch (err) {
      console.error(err);
    } finally {
      setIsRedeeming(null);
    }
  };

  const candidateLevels = [
    stats?.membershipLevel,
    user?.membershipLevel,
    stats?.currentTier?.code,
    stats?.currentTier?.name,
    user?.level,
    user?.rank,
    stats?.rank,
  ].filter(Boolean);

  let effectiveLevel = candidateLevels[0] || "";
  for (const cand of candidateLevels) {
    if (getLevelCode(cand, stats.points || 0) !== "GENERAL") {
      effectiveLevel = cand;
      break;
    }
  }

  const studentLevelCode = getLevelCode(effectiveLevel, stats.points || 0);
  const isGeneral = studentLevelCode === "GENERAL";
  const isL3 = studentLevelCode === "L3" || studentLevelCode === "L3+";

  const getLevelName = () => {
    if (isGeneral) return "General Member";
    if (effectiveLevel) return effectiveLevel;
    if (stats?.membershipLevel) return stats.membershipLevel;
    if (user?.membershipLevel) return user.membershipLevel;
    if (stats?.rank) return stats.rank;
    if (stats?.currentTier?.name) {
      return `${stats.currentTier.name} (${stats.currentTier.code})`;
    }
    return "Fast Track (L0)";
  };

  const userPoints = stats.points || 0;

  // Sort rewards by pointCost ascending
  const sortedRewards = [...rewards].sort((a, b) => a.pointCost - b.pointCost);

  // Only rewards where user actually has enough points are unlocked!
  const unlockedRewards = sortedRewards.filter(r => userPoints >= r.pointCost);

  // Current reward is the highest reward unlocked ONLY IF user has unlocked at least one
  // If user has 0 points or hasn't reached first reward, currentRewardId is null!
  const currentRewardId = unlockedRewards.length > 0 
    ? unlockedRewards[unlockedRewards.length - 1].id 
    : null;

  // Next target reward to unlock (first reward with pointCost > userPoints)
  const nextReward = sortedRewards.find(r => r.pointCost > userPoints) || null;
  const nextRewardTarget = nextReward ? nextReward.pointCost : (sortedRewards[sortedRewards.length - 1]?.pointCost || 1);
  const remainingXP = nextReward ? Math.max(0, nextReward.pointCost - userPoints) : 0;
  const progressPercent = nextReward
    ? Math.min(100, Math.max(0, Math.round((userPoints / nextReward.pointCost) * 100)))
    : 100;

  // Counts for tabs matching reference image
  const unlockedCount = unlockedRewards.length;
  const lockedCount = sortedRewards.filter(r => userPoints < r.pointCost).length;
  const currentCount = currentRewardId ? 1 : 0;

  // Filter rewards based on active tab
  const filteredRewards = sortedRewards.filter(r => {
    const isUnlocked = userPoints >= r.pointCost;
    const isCurrent = isUnlocked && r.id === currentRewardId;
    if (activeFilter === "unlocked") return isUnlocked;
    if (activeFilter === "current") return isCurrent;
    if (activeFilter === "locked") return !isUnlocked;
    return true; // "all"
  });

  // Detailed info calculations for selected reward in modal
  const selectedRewardIndex = selectedReward 
    ? sortedRewards.findIndex(r => r.id === selectedReward.id)
    : 0;
  const selectedRewardImage = selectedReward 
    ? getRewardImage(selectedReward, selectedRewardIndex >= 0 ? selectedRewardIndex : 0)
    : "";
  const isSelectedUnlocked = selectedReward ? userPoints >= selectedReward.pointCost : false;
  const isSelectedCurrent = isSelectedUnlocked && selectedReward?.id === currentRewardId;
  const modalProgressPercent = selectedReward
    ? Math.min(100, Math.max(0, Math.round((userPoints / (selectedReward.pointCost || 1)) * 100)))
    : 0;
  const modalRemainingXP = selectedReward
    ? Math.max(0, selectedReward.pointCost - userPoints)
    : 0;

  return (
    <div
      className="min-h-screen bg-[#faf8f5] text-stone-900 flex flex-col transition-colors lg:pl-[284px]"
      style={{
        backgroundColor: "#faf8f5",
        backgroundImage: "radial-gradient(circle, #e2ded4 1.5px, transparent 1.5px)",
        backgroundSize: "24px 24px",
        backgroundAttachment: "fixed",
      }}
    >
      <StudentNav 
        user={user || stats} 
        level={getLevelName()} 
        points={stats.points} 
        logout={logout} 
        notifications={stats.notifications}
      />

      <main className="w-full px-4 sm:px-5 lg:px-5 py-5 sm:py-6">
        {isLoading ? (
          /* Shimmer Loading Skeleton matching the page layout */
          <div className="w-full space-y-6 sm:space-y-8 animate-pulse">
            {/* Header Skeleton */}
            <div className="space-y-2">
              <div className="h-8 sm:h-10 w-40 bg-stone-200/80 rounded-2xl" />
              <div className="h-4 sm:h-5 w-80 sm:w-96 max-w-full bg-stone-200/60 rounded-xl" />
            </div>

            {/* Top Progress Banner Card Skeleton */}
            <div className="bg-white/95 border border-[#ecdccb] rounded-2xl sm:rounded-3xl p-4 sm:p-5 lg:p-6 shadow-[0_10px_30px_-12px_rgba(90,55,20,0.08)]">
              <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 lg:gap-6">
                {/* Left */}
                <div className="flex items-center gap-3 sm:gap-4 shrink-0">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-stone-200/80 shrink-0" />
                  <div className="space-y-1.5">
                    <div className="h-3.5 w-16 bg-stone-200/60 rounded" />
                    <div className="h-6 w-28 bg-stone-200/80 rounded-lg" />
                  </div>
                </div>

                {/* Divider */}
                <div className="hidden lg:block w-px h-12 bg-stone-200 self-center" />

                {/* Middle */}
                <div className="flex-1 min-w-[200px] space-y-2.5">
                  <div className="flex justify-between items-center">
                    <div className="h-4 w-40 bg-stone-200/60 rounded" />
                    <div className="h-4 w-24 bg-stone-200/60 rounded" />
                  </div>
                  <div className="h-3 sm:h-3.5 bg-stone-200/70 rounded-full" />
                </div>

                {/* Divider */}
                <div className="hidden lg:block w-px h-12 bg-stone-200 self-center" />

                {/* Right */}
                <div className="flex items-center gap-3 sm:gap-3.5 shrink-0 p-2.5 sm:p-0">
                  <div className="w-16 h-14 sm:w-20 sm:h-16 rounded-2xl bg-stone-200/80 shrink-0" />
                  <div className="space-y-1.5">
                    <div className="h-3 w-16 bg-stone-200/60 rounded" />
                    <div className="h-4 w-28 bg-stone-200/80 rounded" />
                    <div className="h-4 w-20 bg-stone-200/60 rounded-md" />
                  </div>
                </div>
              </div>
            </div>

            {/* Filter Pills Skeleton */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
              <div className="h-8 sm:h-9 w-28 rounded-full bg-stone-200/80" />
              <div className="h-8 sm:h-9 w-24 rounded-full bg-stone-200/60" />
              <div className="h-8 sm:h-9 w-24 rounded-full bg-stone-200/60" />
              <div className="h-8 sm:h-9 w-24 rounded-full bg-stone-200/60" />
            </div>

            {/* Table Skeleton */}
            <div className="w-full bg-white rounded-2xl sm:rounded-3xl border border-stone-200/80 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.05)] overflow-hidden">
              <div className="overflow-x-auto">
                <div className="min-w-[620px] lg:min-w-0">
                  {/* Header Skeleton */}
                  <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-b border-stone-100">
                    <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0 pr-4">
                      <div className="w-16 sm:w-20 shrink-0">
                        <div className="h-4 w-14 bg-stone-200/60 rounded" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="h-4 w-16 bg-stone-200/60 rounded" />
                      </div>
                    </div>
                    <div className="flex items-center gap-3 sm:gap-4 lg:gap-6 shrink-0">
                      <div className="w-24 sm:w-28">
                        <div className="h-4 w-20 bg-stone-200/60 rounded" />
                      </div>
                      <div className="w-32 sm:w-36">
                        <div className="h-4 w-16 bg-stone-200/60 rounded" />
                      </div>
                      <div className="w-28 sm:w-30" />
                    </div>
                  </div>

                  {/* Rows Skeleton */}
                  <div className="divide-y divide-stone-100/80">
                    {[1, 2, 3, 4, 5].map((item) => (
                      <div key={item} className="flex items-center justify-between py-3.5 sm:py-4 px-4 sm:px-6">
                        <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0 pr-4">
                          <div className="w-16 sm:w-20 shrink-0">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-stone-200/80" />
                          </div>
                          <div className="min-w-0 flex-1 space-y-1.5">
                            <div className="h-4 w-36 sm:w-48 bg-stone-200/80 rounded" />
                            <div className="h-3 w-48 sm:w-72 max-w-full bg-stone-200/50 rounded" />
                          </div>
                        </div>
                        <div className="flex items-center gap-3 sm:gap-4 lg:gap-6 shrink-0">
                          <div className="w-24 sm:w-28">
                            <div className="h-4 w-16 sm:w-20 bg-stone-200/80 rounded" />
                          </div>
                          <div className="w-32 sm:w-36">
                            <div className="h-6 sm:h-7 w-20 sm:w-24 rounded-full bg-stone-200/70" />
                          </div>
                          <div className="w-28 sm:w-30 flex justify-end">
                            <div className="h-7 sm:h-8 w-24 rounded-xl bg-stone-200/50" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : isGeneral ? (
          <div className="py-12 px-4 max-w-2xl mx-auto text-center space-y-6">
            <div className="w-16 h-16 rounded-3xl bg-[#fde5d6] border-2 border-[#f5ded0] flex items-center justify-center text-[#942008] mx-auto shadow-2xl">
              <Lock size={32} />
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-stone-900">
              Rewards Store is Locked for General Members
            </h1>
            <p className="text-stone-600 text-xs sm:text-sm md:text-base leading-relaxed">
              General members cannot redeem physical merch or mentoring calls without active Level enrollment. Upgrade to Fast Track (Level 0) or above to unlock the Rewards Store and earn XP.
            </p>
            <button
              onClick={() => {
                setSelectedUpgradeTier("L0");
                setShowUpgradeModal(true);
              }}
              className="px-8 py-3.5 bg-gradient-to-r from-[#942008] via-[#c4431d] to-[#ea580c] text-white font-black rounded-xl text-xs sm:text-sm shadow-xl flex items-center gap-2 mx-auto hover:scale-105 transition-all cursor-pointer"
            >
              <Zap size={16} />
              Unlock Fast Track (₹499)
            </button>
          </div>
        ) : (
          <>
            {/* Header: Left aligned matching reference image #2 */}
            <header className="mb-6 sm:mb-8 text-left">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-stone-900 tracking-tight mb-1.5 sm:mb-2">
                Rewards
              </h1>
              <p className="text-stone-500 text-xs sm:text-sm md:text-base font-normal">
                Earn XP through learning, creating and participating — and unlock exciting rewards.
              </p>
            </header>

            {/* Top Progress Card / Banner matching reference image #2 */}
            <div className="bg-white/95 border border-[#ecdccb] rounded-2xl sm:rounded-3xl p-4 sm:p-5 lg:p-6 shadow-[0_10px_30px_-12px_rgba(90,55,20,0.08)] mb-6 sm:mb-8">
              <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 lg:gap-6">
                {/* 1. Left Section: Your XP */}
                <div className="flex items-center gap-3 sm:gap-4 shrink-0">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#fde5d6] border border-[#f5ded0] flex items-center justify-center shrink-0">
                    <Sparkles className="w-6 h-6 text-[#c4431d]" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-semibold text-stone-500">Your XP</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-black text-stone-900 tracking-tight">
                      {userPoints.toLocaleString()} XP
                    </p>
                  </div>
                </div>

                {/* Divider for large screens */}
                <div className="hidden lg:block w-px h-12 bg-stone-200 self-center" />

                {/* 2. Middle Section: Progress to Next Reward */}
                <div className="flex-1 min-w-[200px]">
                  <p className="text-xs sm:text-sm font-semibold text-stone-700 mb-2">
                    Progress to Next Reward
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-3 sm:h-3.5 bg-stone-100 rounded-full overflow-hidden p-0.5 border border-stone-200">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#942008] via-[#c4431d] to-[#ea580c] transition-all duration-500"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                    <span className="font-bold text-stone-800 text-xs sm:text-sm shrink-0 font-mono">
                      {userPoints.toLocaleString()} / {nextRewardTarget.toLocaleString()} XP
                    </span>
                  </div>
                </div>

                {/* Divider for large screens */}
                <div className="hidden lg:block w-px h-12 bg-stone-200 self-center" />

                {/* 3. Right Section: Next Reward Preview */}
                <div className="flex items-center gap-3 sm:gap-3.5 shrink-0 bg-[#faf8f5] sm:bg-transparent p-2.5 sm:p-0 rounded-xl sm:rounded-none border sm:border-0 border-stone-200/80">
                  <img
                    src={nextReward ? getRewardImage(nextReward, 3) : DEFAULT_REWARD_IMAGES[0]}
                    alt={nextReward?.title || "Next Reward"}
                    className="w-16 h-13 sm:w-20 sm:h-16 rounded-2xl object-cover bg-stone-100 border border-stone-200 shrink-0 shadow-2xs"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = DEFAULT_REWARD_IMAGES[0];
                    }}
                  />
                  <div className="min-w-0">
                    <p className="text-[0.6875rem] sm:text-xs font-semibold text-stone-400">Next Reward</p>
                    <p className="text-xs sm:text-sm font-bold text-stone-900 truncate max-w-[130px] sm:max-w-[160px]">
                      {nextReward?.title || "All Unlocked"}
                    </p>
                    {remainingXP > 0 ? (
                      <div className="inline-block bg-[#FFF2EB] border border-[#FDDCC9] px-2 py-0.5 rounded-md text-[0.6875rem] sm:text-xs font-bold text-[#C4431D] mt-0.5">
                        in {remainingXP.toLocaleString()} XP
                      </div>
                    ) : (
                      <div className="inline-block bg-[#EAF7EE] border border-[#D1F0D9] px-2 py-0.5 rounded-md text-[0.6875rem] sm:text-xs font-bold text-emerald-600 mt-0.5">
                        Unlocked!
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* L3 Diamond Club Exclusive Redemption Notice */}
            {!isL3 && (
              <div className="mb-6 sm:mb-8 p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-[#fde5d6]/70 border border-[#f5ded0] text-stone-900 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#fde5d6] border border-[#f5ded0] flex items-center justify-center text-[#c4431d] shrink-0">
                    <Crown size={20} />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-black text-[#942008]">
                      💎 Merch Store Redemption is Exclusive to Level 3 (Diamond Club)
                    </h4>
                    <p className="text-[0.6875rem] sm:text-xs text-stone-600 mt-0.5">
                      You are actively earning XP! Physical merch and mentoring redemptions unlock when you upgrade to Level 3 (Diamond Club).
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSelectedUpgradeTier("L3");
                    setShowUpgradeModal(true);
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-[#942008] via-[#c4431d] to-[#ea580c] hover:opacity-95 text-white font-bold rounded-xl text-xs shadow-md flex items-center gap-1.5 shrink-0 transition-all cursor-pointer whitespace-nowrap"
                >
                  <Sparkles size={14} /> Upgrade to L3
                </button>
              </div>
            )}

            {/* Filter Tabs / Pills matching reference image #2 */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 mb-5 sm:mb-6">
              <button
                type="button"
                onClick={() => setActiveFilter("all")}
                className={`rounded-full px-4 sm:px-5 py-1.5 sm:py-2 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  activeFilter === "all"
                    ? "bg-[#94381E] text-white shadow-xs"
                    : "bg-white hover:bg-stone-50 border border-stone-200/80 text-stone-700"
                }`}
              >
                All Rewards ({sortedRewards.length})
              </button>

              <button
                type="button"
                onClick={() => setActiveFilter("unlocked")}
                className={`rounded-full px-4 sm:px-5 py-1.5 sm:py-2 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  activeFilter === "unlocked"
                    ? "bg-[#94381E] text-white shadow-xs"
                    : "bg-white hover:bg-stone-50 border border-stone-200/80 text-stone-700"
                }`}
              >
                Unlocked ({unlockedCount})
              </button>

              <button
                type="button"
                onClick={() => setActiveFilter("current")}
                className={`rounded-full px-4 sm:px-5 py-1.5 sm:py-2 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  activeFilter === "current"
                    ? "bg-[#94381E] text-white shadow-xs"
                    : "bg-white hover:bg-stone-50 border border-stone-200/80 text-stone-700"
                }`}
              >
                Current ({currentCount})
              </button>

              <button
                type="button"
                onClick={() => setActiveFilter("locked")}
                className={`rounded-full px-4 sm:px-5 py-1.5 sm:py-2 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  activeFilter === "locked"
                    ? "bg-[#94381E] text-white shadow-xs"
                    : "bg-white hover:bg-stone-50 border border-stone-200/80 text-stone-700"
                }`}
              >
                Locked ({lockedCount})
              </button>
            </div>

            {/* Rewards Table matching reference image #2 */}
            <div className="w-full bg-white rounded-2xl sm:rounded-3xl border border-stone-200/80 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.05)] overflow-hidden">
              <div className="overflow-x-auto">
                <div className="min-w-[620px] lg:min-w-0">
                  {/* Table Header */}
                  <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-b border-stone-100 text-stone-700 text-xs sm:text-sm font-bold">
                    <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0 pr-4">
                      <div className="w-16 sm:w-20 shrink-0 text-left">Reward</div>
                      <div className="min-w-0 flex-1 text-left">Details</div>
                    </div>
                    <div className="flex items-center gap-3 sm:gap-4 lg:gap-6 shrink-0">
                      <div className="w-24 sm:w-28 text-left">XP Required</div>
                      <div className="w-32 sm:w-36 text-left">Status</div>
                      <div className="w-28 sm:w-30 text-right"></div>
                    </div>
                  </div>

                  {/* Table Rows */}
                  <div>
                    {filteredRewards.length === 0 ? (
                      <div className="py-16 text-center text-stone-400 font-medium text-xs sm:text-sm md:text-base">
                        No rewards found in this filter.
                      </div>
                    ) : (
                      filteredRewards.map((reward, index) => {
                        const isUnlocked = userPoints >= reward.pointCost;
                        const isCurrent = isUnlocked && reward.id === currentRewardId;

                        return (
                          <motion.div
                            key={reward.id || index}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: index * 0.04 }}
                            onClick={() => setSelectedReward(reward)}
                            className={`flex items-center justify-between py-3.5 sm:py-4 px-4 sm:px-6 transition-colors cursor-pointer ${
                              isCurrent
                                ? "bg-[#FFF5ED] border-l-4 border-l-[#C4431D] my-0.5"
                                : "border-b border-stone-100/80 last:border-b-0 hover:bg-stone-50/70"
                            }`}
                          >
                            {/* 1. Left Section: Thumbnail Image + Details */}
                            <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0 pr-4">
                              <div className="w-16 sm:w-20 shrink-0">
                                <img
                                  src={getRewardImage(reward, index)}
                                  alt={reward.title}
                                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover bg-stone-100 border border-stone-200/80 shadow-xs shrink-0"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src =
                                      DEFAULT_REWARD_IMAGES[index % DEFAULT_REWARD_IMAGES.length];
                                  }}
                                />
                              </div>

                              <div className="min-w-0 flex-1">
                                <p className="font-bold text-stone-900 text-xs sm:text-sm md:text-base truncate">
                                  {reward.title}
                                </p>
                                <p className="text-stone-500 text-[0.6875rem] sm:text-xs md:text-sm line-clamp-1 mt-0.5">
                                  {reward.description}
                                </p>
                              </div>
                            </div>

                            {/* 2. Right Section: XP Required + Status + View Details Button */}
                            <div className="flex items-center gap-3 sm:gap-4 lg:gap-6 shrink-0">
                              {/* XP Required */}
                              <div className="w-24 sm:w-28 text-left font-bold text-xs sm:text-sm md:text-base text-stone-900">
                                {reward.pointCost.toLocaleString()} XP
                              </div>

                              {/* Status Badge */}
                              <div className="w-32 sm:w-36 text-left">
                                {isCurrent ? (
                                  <span className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-[0.6875rem] sm:text-xs font-bold bg-[#FFEADB] text-[#C4431D] border border-[#FDD7BD] whitespace-nowrap">
                                    <Crown size={12} className="fill-[#C4431D]" /> Current Reward
                                  </span>
                                ) : isUnlocked ? (
                                  <span className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-[0.6875rem] sm:text-xs font-bold bg-[#EAF7EE] text-[#22863A] border border-[#D1F0D9] whitespace-nowrap">
                                    <Check size={12} className="stroke-[3]" /> Unlocked
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-[0.6875rem] sm:text-xs font-bold bg-stone-100 text-stone-500 border border-stone-200 whitespace-nowrap">
                                    <Lock size={12} /> Locked
                                  </span>
                                )}
                              </div>

                              {/* Action: View Details Button */}
                              <div className="w-28 sm:w-30 flex justify-end">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedReward(reward);
                                  }}
                                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-stone-200 hover:border-stone-300 bg-white hover:bg-stone-50 text-stone-800 text-xs sm:text-sm font-semibold transition-colors cursor-pointer shadow-2xs whitespace-nowrap"
                                >
                                  View Details <ChevronRight size={14} className="text-stone-400" />
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Reward Details & Claim Modal */}
        <AnimatePresence>
          {selectedReward && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 backdrop-blur-xs">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-3xl border border-[#ecdccb] shadow-2xl max-w-lg w-full overflow-hidden max-h-[92vh] flex flex-col"
              >
                {/* Modal Header Image */}
                <div className="relative h-44 sm:h-52 bg-stone-100 overflow-hidden shrink-0">
                  <img
                    src={selectedRewardImage}
                    alt={selectedReward.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = DEFAULT_REWARD_IMAGES[0];
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setSelectedReward(null)}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-colors cursor-pointer shadow-md"
                  >
                    <X size={16} />
                  </button>

                  {/* Badges on image */}
                  <div className="absolute bottom-3 left-3 flex items-center gap-2">
                    <span className="bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-stone-900 border border-stone-200 shadow-sm">
                      {selectedReward.pointCost.toLocaleString()} XP
                    </span>
                    {isSelectedCurrent ? (
                      <span className="inline-flex items-center gap-1 bg-[#FFEADB] text-[#C4431D] border border-[#FDD7BD] px-2.5 py-1 rounded-full text-xs font-bold shadow-sm">
                        <Crown size={12} className="fill-[#C4431D]" /> Current Reward
                      </span>
                    ) : isSelectedUnlocked ? (
                      <span className="inline-flex items-center gap-1 bg-[#EAF7EE] text-[#22863A] border border-[#D1F0D9] px-2.5 py-1 rounded-full text-xs font-bold shadow-sm">
                        <Check size={12} className="stroke-[3]" /> Unlocked
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 bg-stone-900/70 text-white px-2.5 py-1 rounded-full text-xs font-bold backdrop-blur-sm shadow-sm">
                        <Lock size={12} /> Locked
                      </span>
                    )}
                  </div>
                </div>

                {/* Modal Scrollable Body */}
                <div className="p-4 sm:p-6 space-y-4 overflow-y-auto">
                  {/* Title & Description */}
                  <div>
                    <h3 className="text-lg sm:text-xl font-black text-stone-900 tracking-tight">
                      {selectedReward.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-stone-600 mt-1.5 leading-relaxed">
                      {selectedReward.description}
                    </p>
                  </div>

                  {/* Status & Balance Detail Cards */}
                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="p-3 rounded-2xl bg-[#faf8f5] border border-stone-200">
                      <p className="text-[0.6875rem] sm:text-xs text-stone-500 font-semibold">XP Required</p>
                      <p className="text-sm sm:text-base font-black text-stone-900 mt-0.5">
                        {selectedReward.pointCost.toLocaleString()} XP
                      </p>
                    </div>

                    <div className="p-3 rounded-2xl bg-[#faf8f5] border border-stone-200">
                      <p className="text-[0.6875rem] sm:text-xs text-stone-500 font-semibold">Your Balance</p>
                      <p className="text-sm sm:text-base font-black text-[#c4431d] mt-0.5">
                        {userPoints.toLocaleString()} XP
                      </p>
                    </div>
                  </div>

                  {/* Progress towards this specific reward */}
                  <div className="p-3.5 rounded-2xl bg-[#faf8f5] border border-stone-200 space-y-2">
                    <div className="flex items-center justify-between text-xs sm:text-sm font-semibold text-stone-700">
                      <span>Reward Progress</span>
                      <span className="font-bold text-stone-900 font-mono">
                        {userPoints.toLocaleString()} / {selectedReward.pointCost.toLocaleString()} XP ({modalProgressPercent}%)
                      </span>
                    </div>
                    <div className="h-2.5 sm:h-3 bg-stone-100 rounded-full overflow-hidden p-0.5 border border-stone-200">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#942008] via-[#c4431d] to-[#ea580c] transition-all duration-500"
                        style={{ width: `${modalProgressPercent}%` }}
                      />
                    </div>
                    {isSelectedUnlocked ? (
                      <p className="text-[0.6875rem] sm:text-xs font-semibold text-emerald-700 flex items-center gap-1 mt-1">
                        <Check size={12} className="stroke-[3]" /> You have enough XP to claim this reward!
                      </p>
                    ) : (
                      <p className="text-[0.6875rem] sm:text-xs font-semibold text-stone-500 mt-1">
                        You need <span className="font-bold text-[#c4431d]">{modalRemainingXP.toLocaleString()} more XP</span> to unlock this reward.
                      </p>
                    )}
                  </div>

                  {/* Level 3 Diamond Requirement Notice if not L3 */}
                  {!isL3 && (
                    <div className="p-3 sm:p-3.5 rounded-2xl bg-[#fde5d6]/70 border border-[#f5ded0] text-stone-900 space-y-1">
                      <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#942008]">
                        <Crown size={14} className="text-[#c4431d]" /> L3 Diamond Club Exclusive
                      </div>
                      <p className="text-[0.6875rem] sm:text-xs text-stone-600 leading-relaxed">
                        Redeeming physical merch and 1-on-1 mentoring sessions is unlocked exclusively for Diamond Club (Level 3) members.
                      </p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="pt-1">
                    {isL3 ? (
                      <button
                        type="button"
                        onClick={() => handleRedeem(selectedReward.id, selectedReward.pointCost)}
                        disabled={userPoints < selectedReward.pointCost || isRedeeming === selectedReward.id}
                        className={`w-full py-3.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
                          userPoints >= selectedReward.pointCost
                            ? "bg-gradient-to-r from-[#942008] via-[#c4431d] to-[#ea580c] hover:opacity-95 text-white shadow-md shadow-[#c4431d]/20"
                            : "bg-stone-100 text-stone-400 cursor-not-allowed"
                        }`}
                      >
                        {isRedeeming === selectedReward.id
                          ? "Redeeming..."
                          : userPoints >= selectedReward.pointCost
                          ? "Claim Reward"
                          : `Need ${modalRemainingXP.toLocaleString()} more XP`}
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedReward(null);
                          setSelectedUpgradeTier("L3");
                          setShowUpgradeModal(true);
                        }}
                        className="w-full py-3.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 bg-gradient-to-r from-[#942008] via-[#c4431d] to-[#ea580c] hover:opacity-95 text-white shadow-md shadow-[#c4431d]/20 cursor-pointer"
                      >
                        <Crown size={16} /> Upgrade to L3 Diamond to Redeem
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

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
