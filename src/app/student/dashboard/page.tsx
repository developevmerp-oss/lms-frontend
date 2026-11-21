"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

import { StudentNav, getLevelCode } from "@/components/layout/StudentNav";
import { WelcomeHeader } from "@/components/dashboard/WelcomeHeader";
import { LearningProgress } from "@/components/dashboard/LearningProgress";
import { SkillMastery } from "@/components/dashboard/SkillMastery";
import { DailyRoutineChecklist } from "@/components/dashboard/DailyRoutineChecklist";
import { MyCourses } from "@/components/dashboard/MyCourses";
import { TodayFocus } from "@/components/dashboard/TodayFocus";
import { PortfolioGallery } from "@/components/dashboard/PortfolioGallery";
import { SalesAndCommunity } from "@/components/dashboard/SalesAndCommunity";
import { BadgesEarned } from "@/components/dashboard/BadgesEarned";
import { RewardsStore } from "@/components/dashboard/RewardsStore";
import { AiMentor } from "@/components/dashboard/AiMentor";
import { DashboardSkeleton } from "@/components/ui/SkeletonLoader";
import { ProfileUpdateModal } from "@/components/profile/ProfileUpdateModal";
import { Sparkles, Lock, Zap, CreditCard, Calendar, AlertCircle } from "lucide-react";
import Link from "next/link";
import { TierPurchaseModal } from "@/components/membership/TierPurchaseModal";
import { getComputedTierPricing } from "@/utils/tierPricing";
import { processRazorpayPayment } from "@/utils/razorpay";

import { API_BASE_URL } from "@/config/api";

const CACHE_KEY = "student_dashboard_cache";
const CACHE_TTL = 30 * 1000; // 30 seconds

export default function StudentDashboard() {
  const { user, token, logout } = useAuth();
  const [installmentPlans, setInstallmentPlans] = useState<any[]>([]);
  const [payingPlanId, setPayingPlanId] = useState<string | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [stats, setStats] = useState<any>({
    points: 0,
    streak: 0,
    skills: null,
    badges: [],
    portfolios: [],
    milestones: [],
    salesRecords: [],
    courses: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchStats = (silent = false) => {
    if (!token) return;
    if (!silent) setIsLoading(true);
    fetch(`${API_BASE_URL}/dashboard/student`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && !data.message) {
          setStats(data);
          if (Array.isArray(data.levelTiers) && data.levelTiers.length > 0) {
            setLiveTiers(data.levelTiers);
            try {
              sessionStorage.setItem("cached_level_tiers", JSON.stringify(data.levelTiers));
            } catch (_) { }
          }
          try {
            sessionStorage.setItem(CACHE_KEY, JSON.stringify({ data, ts: Date.now() }));
          } catch (_) { }
        }
      })
      .catch((err) => console.error("Error fetching student stats:", err))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    if (!token) return;
    try {
      const cached = sessionStorage.getItem(CACHE_KEY);
      if (cached) {
        const { data, ts } = JSON.parse(cached);
        if (Date.now() - ts < CACHE_TTL) {
          setStats(data);
          setIsLoading(false);
          fetchStats(true);
          return;
        }
      }
    } catch (_) { }
    fetchStats();
    fetchInstallments();
  }, [token]);

  const fetchInstallments = () => {
    if (!token) return;
    fetch(`${API_BASE_URL}/payments/my-installments`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.plans)) {
          setInstallmentPlans(data.plans);
        }
      })
      .catch((err) => console.error("Error fetching student installments:", err));
  };

  const handlePayNextInstallment = (plan: any) => {
    setPayingPlanId(plan.id);
    processRazorpayPayment({
      amount: Number(plan.installmentAmount),
      tierCode: plan.tierCode || "L3",
      tierName: plan.tierName || "Level 3",
      email: user?.email,
      name: user?.name,
      phone: user?.phone,
      isInstallment: true,
      existingPlanId: plan.id,
      installmentAmount: Number(plan.installmentAmount),
      totalInstallments: Number(plan.totalInstallments),
      onSuccess: () => {
        setPayingPlanId(null);
        fetchInstallments();
        fetchStats();
      },
      onFailure: (err) => {
        setPayingPlanId(null);
        console.error("Installment payment failed:", err);
      },
    });
  };

  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeTierCode, setUpgradeTierCode] = useState<string>("L0");
  const [liveTiers, setLiveTiers] = useState<any[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const cached = sessionStorage.getItem("cached_level_tiers");
        if (cached) return JSON.parse(cached);
      } catch (_) { }
    }
    return [];
  });
  const [campaignOffers, setCampaignOffers] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/dashboard/levels`, { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setLiveTiers(data);
          try {
            sessionStorage.setItem("cached_level_tiers", JSON.stringify(data));
          } catch (_) { }
        }
      })
      .catch(() => { });

    fetch(`${API_BASE_URL}/dashboard/offers`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setCampaignOffers(data);
      })
      .catch(() => { });
  }, []);

  const effectiveLevel =
    user?.membershipLevel || stats.membershipLevel || user?.rank || stats.rank || "";
  const studentLevelCode = getLevelCode(effectiveLevel, stats.points || 0);
  const isGeneral = studentLevelCode === "GENERAL";

  const l0Pricing = getComputedTierPricing("L0", liveTiers, campaignOffers);

  const getLevelName = () => {
    if (isGeneral) return "General Member";
    if (user?.membershipLevel) return user.membershipLevel;
    if (stats.membershipLevel) return stats.membershipLevel;
    if (stats.rank) return stats.rank;
    if (stats.currentTier?.name) {
      return `${stats.currentTier.name} (${stats.currentTier.code})`;
    }
    return "Fast Track (L0)";
  };

  // Calculate dynamic progress based on enrolled course
  const enrolledCourse = stats.courses?.find(
    (c: any) => c.UserCourse?.status === "enrolled"
  );
  const dynamicProgress = enrolledCourse?.UserCourse?.progress || 0;

  return (
    <div
      className="min-h-screen bg-[#faf8f5] text-stone-900 transition-colors lg:pl-64"
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
        points={stats.points}
        logout={logout}
        notifications={stats.notifications}
      />

      <main className="w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-5 sm:space-y-6">
        {isLoading ? (
          <DashboardSkeleton />
        ) : isGeneral ? (
          <div className="py-12 px-4 max-w-3xl mx-auto text-center space-y-8 animate-in fade-in zoom-in-95 duration-300">
            <div className="w-20 h-20 rounded-3xl bg-[#fde5d6] border-2 border-[#f5ded0] flex items-center justify-center text-[#942008] mx-auto shadow-xl">
              <Lock size={40} />
            </div>

            <div className="space-y-1">
              {/*
              <div className="flex items-center justify-center gap-1.5 text-xs text-stone-500 mb-1 font-medium">
                <span>Student Hub</span>
                <span className="text-stone-300">/</span>
                <span className="text-stone-700 font-medium">Level 0 Fast Track Required</span>
              </div>
              */}
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-stone-900 tracking-tight">
                Dashboard Locked for General Members
              </h1>
              <p className="text-stone-500 text-xs sm:text-sm mt-0.5 leading-relaxed max-w-xl mx-auto">
                You are currently registered as a <strong className="text-stone-900">General Member</strong>. Your personal dashboard, 6-step daily habits routine, progress tracking, and gamified rewards unlock when you enroll in <strong className="text-[#c4431d]">Fast Track (Level 0)</strong> or higher!
              </p>
            </div>

            {/* Value Preview Box */}
            <div className="bg-white/95 border border-[#ecdccb] rounded-3xl p-6 md:p-8 text-left space-y-4 shadow-[0_10px_30px_-12px_rgba(90,55,20,0.08)]">
              <h3 className="text-sm font-black uppercase tracking-wider text-[#942008]">
                What Unlocks with Fast Track (Level 0):
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-stone-700">
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#faf8f5] border border-stone-200">
                  <span className="text-emerald-400 font-bold">✓</span> 4 Essential Video Masterclasses
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#faf8f5] border border-stone-200">
                  <span className="text-emerald-400 font-bold">✓</span> Daily Routine &amp; Habit Checklist
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#faf8f5] border border-stone-200">
                  <span className="text-emerald-400 font-bold">✓</span> XP Points &amp; Badge Milestones
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#faf8f5] border border-stone-200">
                  <span className="text-emerald-400 font-bold">✓</span> Full Student Overview Analytics
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => {
                  setUpgradeTierCode("L0");
                  setShowUpgradeModal(true);
                }}
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-[#942008] via-[#c4431d] to-[#ea580c] hover:opacity-95 text-white font-black rounded-2xl text-base shadow-md shadow-[#c4431d]/25 flex items-center justify-center gap-2 hover:scale-105 transition-all cursor-pointer"
              >
                <Zap size={18} />
                Unlock {l0Pricing.name} ({l0Pricing.hasOffer ? `Offer: ${l0Pricing.finalPrice}` : l0Pricing.finalPrice})
              </button>
              <Link
                href="/student/feed"
                className="w-full sm:w-auto px-6 py-4 bg-white hover:bg-stone-50 border border-stone-300 text-stone-700 hover:text-stone-900 font-bold rounded-2xl text-base transition-all flex items-center justify-center gap-2"
              >
                <Sparkles size={16} className="text-[#c4431d]" />
                Go to Community Feed
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Active Installment Reminders Banner */}
            {installmentPlans
              .filter((p) => p.status === "active" || p.status === "overdue")
              .map((plan) => {
                const isOverdue =
                  plan.status === "overdue" ||
                  (plan.nextDueDate && new Date(plan.nextDueDate).getTime() < Date.now());
                const nextNum = (plan.paidInstallments || 0) + 1;
                const dueDateStr = plan.nextDueDate
                  ? new Date(plan.nextDueDate).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })
                  : "Scheduled Soon";

                return (
                  <div
                    key={plan.id}
                    className={`p-4 md:p-5 rounded-3xl border transition-all shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 ${isOverdue
                        ? "bg-red-500/10 border-red-500/40 text-red-200"
                        : "bg-white/95 border border-[#ecdccb] text-stone-900 shadow-[0_10px_30px_-12px_rgba(90,55,20,0.08)]"
                      }`}
                  >
                    <div className="flex items-start md:items-center gap-3.5">
                      <div
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shrink-0 ${isOverdue
                            ? "bg-red-500/20 text-red-400 border border-red-500/40"
                            : "bg-[#fde5d6] text-[#942008] border border-[#f5ded0]"
                          }`}
                      >
                        {isOverdue ? <AlertCircle size={24} /> : <CreditCard size={24} />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={`text-[0.65rem] font-black uppercase px-2 py-0.5 rounded-full ${isOverdue
                                ? "bg-red-500/20 text-red-300 border border-red-500/40"
                                : "bg-[#fde5d6] text-[#942008] border border-[#f5ded0]"
                              }`}
                          >
                            {isOverdue ? "⚠️ Overdue Installment" : "🔔 Next Installment Scheduled"}
                          </span>
                          <span className="text-xs text-stone-500 font-bold">
                            {plan.tierName || "Level 3"} ({plan.planName || "Installment Plan"})
                          </span>
                        </div>
                        <h3 className="text-base md:text-lg font-black text-stone-900 mt-0.5">
                          Installment #{nextNum} of {plan.totalInstallments} : ₹
                          {Number(plan.installmentAmount).toLocaleString("en-IN")}
                        </h3>
                        <p className="text-xs text-stone-500 flex items-center gap-1.5 mt-1">
                          <Calendar
                            size={13}
                            className={isOverdue ? "text-red-400" : "text-amber-400"}
                          />
                          Due Date:{" "}
                          <strong className={isOverdue ? "text-red-300" : "text-amber-300"}>
                            {dueDateStr}
                          </strong>
                          <span className="text-slate-500 mx-1">•</span>
                          <span>
                            Progress: {plan.paidInstallments}/{plan.totalInstallments} Paid
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <button
                        type="button"
                        onClick={() => handlePayNextInstallment(plan)}
                        disabled={payingPlanId === plan.id}
                        className="w-full md:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-[#942008] via-[#c4431d] to-[#ea580c] hover:opacity-95 text-white font-black text-xs md:text-sm shadow-md shadow-[#c4431d]/25 flex items-center justify-center gap-2 transition-all hover:scale-105 cursor-pointer"
                      >
                        <CreditCard size={15} />
                        {payingPlanId === plan.id
                          ? "Processing..."
                          : `Pay Installment #${nextNum} (₹${Number(
                            plan.installmentAmount
                          ).toLocaleString("en-IN")})`}
                      </button>
                    </div>
                  </div>
                );
              })}

            {/* Top Area: Welcome Greeting, Search, Bell, Avatar & 4 Stat Cards */}
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
              notifications={stats.notifications}
              onOpenProfile={() => setIsProfileModalOpen(true)}
            />

            {/* Row 2: 2 Cards (6-Point Skill Mastery, Daily Habit Streak) - Learning Progress removed per user request */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-5 items-stretch">
              {/* <LearningProgress
                courses={stats.courses}
                nextGoal={stats.nextGoal}
                progress={dynamicProgress}
              /> */}
              <SkillMastery skills={stats.skills} />
              <DailyRoutineChecklist
                streak={stats.streak}
                onCompleteRoutine={fetchStats}
              />
            </div>

            {/* Row 3: 2 Columns (My Courses on Left [span 8], Today's Focus on Right [span 4]) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-5 items-stretch">
              <div className="lg:col-span-8 flex flex-col">
                <MyCourses
                  courses={stats.courses}
                  allCourses={stats.allCourses}
                  currentTier={stats.currentTier}
                  userLevel={effectiveLevel}
                  levelTiers={liveTiers}
                  onUnlockTier={(tierCode) => {
                    setUpgradeTierCode(tierCode);
                    setShowUpgradeModal(true);
                  }}
                />
              </div>
              <div className="lg:col-span-4 flex flex-col">
                <TodayFocus
                  enrolledCourse={enrolledCourse}
                  nextGoal={stats.nextGoal}
                  progress={dynamicProgress}
                />
              </div>
            </div>

            {/* Row 4: 4 Cards (Portfolio Projects, Sales & Income, Badges Earned, Rewards Store) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 md:gap-5 items-stretch">
              <PortfolioGallery portfolios={stats.portfolios} />
              <SalesAndCommunity
                sales={stats.salesRecords}
                communityWins={stats.communityWins}
                onInteract={fetchStats}
              />
              <BadgesEarned badges={stats.badges} />
              <RewardsStore
                currentPoints={stats.points}
                onRedeem={fetchStats}
              />
            </div>

            {/* Row 5: AI Recommended Mission */}
            <AiMentor skills={stats.skills} />
          </>
        )}
      </main>

      {/* Unlock / Upgrade Tier Purchase Modal */}
      <TierPurchaseModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        preselectedTier={upgradeTierCode}
        onSuccess={() => {
          setShowUpgradeModal(false);
          fetchStats();
        }}
      />

      {/* Edit Profile & Photo Modal */}
      <ProfileUpdateModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
    </div>
  );
}
