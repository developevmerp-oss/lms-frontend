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
  Info,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { API_BASE_URL, getImageUrl } from "@/config/api";
import { getLevelCode } from "@/components/layout/StudentNav";
import { TierPurchaseModal } from "@/components/membership/TierPurchaseModal";

const DEFAULT_REWARD_IMAGES = [
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=400&auto=format&fit=crop",
];

const getRewardImage = (reward: any, index: number = 0) => {
  if (reward?.imageUrl && typeof reward.imageUrl === "string" && reward.imageUrl.trim() !== "") {
    return getImageUrl(reward.imageUrl);
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
      className="min-h-screen bg-[#faf8f5] text-stone-900 flex flex-col transition-colors lg:pl-64"
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

      <main className="w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 relative z-10">
        {isLoading ? (
          /* Shimmer Loading Skeleton matching the page layout */
          <div className="w-full space-y-6 sm:space-y-8">
            {/* Header Skeleton */}
            <div className="space-y-2">
              <div className="h-6 w-28 shimmer-box rounded-full" />
              <div className="h-8 sm:h-10 w-44 shimmer-box rounded-2xl" />
              <div className="h-4 sm:h-5 w-80 sm:w-96 max-w-full shimmer-box rounded-xl" />
            </div>

            {/* Top Progress Banner Skeleton */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200/80 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.04)]">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6">
                <div className="space-y-1.5 shrink-0">
                  <div className="h-3 w-20 shimmer-box rounded" />
                  <div className="h-7 w-28 shimmer-box rounded-lg" />
                </div>
                <div className="w-full sm:flex-1 sm:px-4 lg:px-6">
                  <div className="h-3.5 shimmer-box rounded-full" />
                </div>
                <div className="space-y-1.5 shrink-0 sm:text-right">
                  <div className="h-3 w-16 shimmer-box rounded sm:ml-auto" />
                  <div className="h-5 w-24 shimmer-box rounded sm:ml-auto" />
                </div>
              </div>
            </div>

            {/* Filter Pills Skeleton */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <div className="h-9 w-28 rounded-full shimmer-box" />
              <div className="h-9 w-24 rounded-full shimmer-box" />
              <div className="h-9 w-24 rounded-full shimmer-box" />
              <div className="h-9 w-24 rounded-full shimmer-box" />
            </div>

            {/* Grid Skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-3.5">
              {[1, 2, 3, 4, 5].map((item) => (
                <div
                  key={item}
                  className="bg-white rounded-3xl p-3.5 sm:p-4 lg:p-4 border border-stone-200/80 flex flex-col items-center justify-between min-h-[290px] space-y-3"
                >
                  <div className="w-full flex justify-end">
                    <div className="w-4 h-4 rounded-full shimmer-box" />
                  </div>
                  <div className="w-36 h-36 sm:w-44 sm:h-44 lg:w-40 lg:h-40 xl:w-44 xl:h-44 max-w-full aspect-square rounded-2xl shimmer-box mx-auto" />
                  <div className="space-y-1.5 w-full flex flex-col items-center">
                    <div className="h-5 w-20 shimmer-box rounded" />
                    <div className="h-4 w-32 shimmer-box rounded" />
                  </div>
                  <div className="h-7 w-24 rounded-full shimmer-box" />
                </div>
              ))}
            </div>
          </div>
        ) : isGeneral ? (
          <div className="py-12 px-4 max-w-2xl mx-auto text-center space-y-6">
            <div className="w-16 h-16 rounded-3xl bg-[#fde5d6] border-2 border-[#f5ded0] flex items-center justify-center text-[#942008] mx-auto shadow-2xl">
              <Lock size={32} />
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-center gap-1.5 text-xs text-stone-500 mb-1 font-medium">
                <span>Student Hub</span>
                <span className="text-stone-300">/</span>
                <span className="text-stone-700 font-medium">Rewards Store</span>
              </div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-stone-900 tracking-tight">
                Rewards Store is Locked for General Members
              </h1>
              <p className="text-stone-500 text-xs sm:text-sm mt-0.5 leading-relaxed">
                General members cannot redeem physical merch or mentoring calls without active Level enrollment. Upgrade to Fast Track (Level 0) or above to unlock the Rewards Store and earn XP.
              </p>
            </div>
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
            {/* Header: Left aligned with standard breadcrumb */}
            {/*
            <header className="mb-6 text-left">
              <div className="flex items-center gap-1.5 text-xs text-stone-500 mb-1 font-medium">
                <span>Gamification &amp; Recognition</span>
                <span className="text-stone-300">/</span>
                <span className="text-stone-700 font-medium">Rewards Store</span>
              </div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-stone-900 tracking-tight">
                Rewards Store
              </h1>
              <p className="text-stone-500 text-xs sm:text-sm mt-0.5">
                Earn XP through learning, creating and participating — and unlock exciting rewards.
              </p>
            </header>
            */}

            {/* Top Progress Card / Banner matching reference image */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200/80 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.03)] mb-6 sm:mb-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6">
                {/* 1. Left: Your Progress */}
                <div className="shrink-0">
                  <p className="text-xs font-semibold text-stone-500">Your Progress</p>
                  <p className="text-2xl sm:text-3xl lg:text-3xl font-black text-[#3d1a16] tracking-tight mt-0.5">
                    {userPoints.toLocaleString()} XP
                  </p>
                </div>

                {/* 2. Middle: Smooth Progress Bar */}
                <div className="w-full sm:flex-1 min-w-[160px] sm:px-4 lg:px-6">
                  <div className="w-full h-3 sm:h-3.5 bg-stone-100 rounded-full overflow-hidden p-0.5 border border-stone-200/80">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#942008] via-[#c4431d] to-[#d97706] transition-all duration-500"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* 3. Right: Next Reward */}
                <div className="shrink-0 sm:text-right">
                  <p className="text-xs font-semibold text-stone-500">Next Reward</p>
                  <p className="text-sm sm:text-base font-black text-[#3d1a16] mt-0.5">
                    {remainingXP > 0 ? (
                      <>
                        in <span className="font-extrabold">{remainingXP.toLocaleString()} XP</span>
                      </>
                    ) : (
                      <span className="text-emerald-600 font-extrabold">All Unlocked!</span>
                    )}
                  </p>
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

            {/* Filter Tabs / Pills matching reference image */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-6 sm:mb-8">
              <button
                type="button"
                onClick={() => setActiveFilter("all")}
                className={`rounded-full px-5 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  activeFilter === "all"
                    ? "bg-[#94381E] text-white shadow-xs"
                    : "bg-white hover:bg-stone-50 border border-stone-200/80 text-stone-700 font-medium"
                }`}
              >
                All Rewards
              </button>

              <button
                type="button"
                onClick={() => setActiveFilter("unlocked")}
                className={`rounded-full px-5 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  activeFilter === "unlocked"
                    ? "bg-[#94381E] text-white shadow-xs"
                    : "bg-white hover:bg-stone-50 border border-stone-200/80 text-stone-700 font-medium"
                }`}
              >
                Unlocked
              </button>

              <button
                type="button"
                onClick={() => setActiveFilter("current")}
                className={`rounded-full px-5 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  activeFilter === "current"
                    ? "bg-[#94381E] text-white shadow-xs"
                    : "bg-white hover:bg-stone-50 border border-stone-200/80 text-stone-700 font-medium"
                }`}
              >
                Current
              </button>

              <button
                type="button"
                onClick={() => setActiveFilter("locked")}
                className={`rounded-full px-5 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  activeFilter === "locked"
                    ? "bg-[#94381E] text-white shadow-xs"
                    : "bg-white hover:bg-stone-50 border border-stone-200/80 text-stone-700 font-medium"
                }`}
              >
                Locked
              </button>
            </div>

            {/* Rewards Cards Grid matching reference image */}
            {filteredRewards.length === 0 ? (
              <div className="py-16 text-center bg-white rounded-3xl border border-stone-200/80 text-stone-400 font-medium text-xs sm:text-sm md:text-base shadow-xs">
                No rewards found in this filter.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-3.5">
                {filteredRewards.map((reward, index) => {
                  const isUnlocked = userPoints >= reward.pointCost;
                  const isCurrent = isUnlocked && reward.id === currentRewardId;

                  return (
                    <motion.div
                      key={reward.id || index}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.04 }}
                      onClick={() => setSelectedReward(reward)}
                      className={`group relative rounded-3xl p-3 sm:p-4 lg:p-3 xl:p-4 flex flex-col justify-between transition-all duration-300 cursor-pointer ${
                        isCurrent
                          ? "bg-[#fef0e2] border-2 border-[#fbc29d] shadow-[0_10px_28px_-8px_rgba(209,103,62,0.14)] hover:scale-[1.02]"
                          : "bg-white border border-stone-200/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] hover:border-stone-300 hover:shadow-md hover:scale-[1.01]"
                      }`}
                    >
                      {/* Top Header Row in Card: Current Reward Pill & Info Icon */}
                      <div className="w-full flex items-center justify-between min-h-[1.75rem] mb-1">
                        {isCurrent ? (
                          <span className="bg-[#d1673e] text-white text-[0.6875rem] sm:text-xs font-bold px-3 sm:px-3.5 py-1 rounded-full shadow-xs">
                            Current Reward
                          </span>
                        ) : (
                          <div />
                        )}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedReward(reward);
                          }}
                          className={`transition-colors cursor-pointer p-1 rounded-full hover:bg-black/5 ml-auto ${
                            isCurrent ? "text-[#5a150d] hover:text-[#870402]" : "text-stone-400 hover:text-stone-700"
                          }`}
                          title="View Details"
                          aria-label={`View details for ${reward.title}`}
                        >
                          <Info size={17} />
                        </button>
                      </div>

                      {/* Product Image Area: Same size, height & rounded edges like current reward card */}
                      <div className="w-full flex-1 flex items-center justify-center py-2 sm:py-3">
                        <div className="w-36 h-36 sm:w-44 sm:h-44 lg:w-40 lg:h-40 xl:w-44 xl:h-44 max-w-full aspect-square rounded-2xl overflow-hidden shrink-0 flex items-center justify-center mx-auto bg-stone-100">
                          <img
                            src={getRewardImage(reward, index)}
                            alt={reward.title}
                            className="w-full h-full object-cover rounded-2xl transition-transform duration-300 group-hover:scale-105"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                DEFAULT_REWARD_IMAGES[index % DEFAULT_REWARD_IMAGES.length];
                            }}
                          />
                        </div>
                      </div>

                      {/* Card Content: XP + Title */}
                      <div className="mt-2 text-center w-full">
                        <p className="text-base sm:text-lg lg:text-xl font-black text-[#870402] tracking-tight">
                          {reward.pointCost.toLocaleString()} XP
                        </p>
                        <p className="text-xs sm:text-[0.8125rem] font-bold text-stone-900 line-clamp-2 mt-1 min-h-[2.25rem] flex items-center justify-center px-1">
                          {reward.title}
                        </p>
                      </div>

                      {/* Bottom Status Pill matching Reference Colors */}
                      <div className="mt-3 sm:mt-4 w-full flex justify-center">
                        {isUnlocked ? (
                          <span className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 rounded-full text-[0.6875rem] sm:text-xs font-bold bg-[#e0edc8] text-[#084f06]">
                            <Check size={13} className="stroke-[3] text-[#084f06]" /> Unlocked
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 rounded-full text-[0.6875rem] sm:text-xs font-semibold bg-[#f5f5f4] text-stone-500 border border-stone-200/80">
                            <Lock size={11} /> Locked
                          </span>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
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
