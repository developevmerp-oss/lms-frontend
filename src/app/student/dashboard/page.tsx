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
import { WinWall } from "@/components/dashboard/WinWall";
import { DailyRoutineChecklist } from "@/components/dashboard/DailyRoutineChecklist";
import { DashboardSkeleton } from "@/components/ui/SkeletonLoader";
import { Trophy, Sparkles, Lock, ArrowRight, Zap, BookOpen, CreditCard, Calendar, AlertCircle, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { getLevelCode } from "@/components/layout/StudentNav";
import { TierPurchaseModal } from "@/components/membership/TierPurchaseModal";
import { getComputedTierPricing } from "@/utils/tierPricing";
import { processRazorpayPayment } from "@/utils/razorpay";

import { API_BASE_URL } from "@/config/api";

const CACHE_KEY = 'student_dashboard_cache';
const CACHE_TTL = 30 * 1000; // 30 seconds

export default function StudentDashboard() {
  const { user, token, logout } = useAuth();
  const [installmentPlans, setInstallmentPlans] = useState<any[]>([]);
  const [payingPlanId, setPayingPlanId] = useState<string | null>(null);
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
  const [isLoading, setIsLoading] = useState(true);

  const fetchStats = (silent = false) => {
    if (!token) return;
    if (!silent) setIsLoading(true);
    fetch(`${API_BASE_URL}/dashboard/student`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data && !data.message) {
          setStats(data);
          // Cache in sessionStorage for instant re-loads
          try {
            sessionStorage.setItem(CACHE_KEY, JSON.stringify({ data, ts: Date.now() }));
          } catch (_) {}
        }
      })
      .catch(err => console.error("Error fetching student stats:", err))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    if (!token) return;
    // Try to load from cache first for instant display
    try {
      const cached = sessionStorage.getItem(CACHE_KEY);
      if (cached) {
        const { data, ts } = JSON.parse(cached);
        if (Date.now() - ts < CACHE_TTL) {
          setStats(data);
          setIsLoading(false);
          fetchStats(true); // silent background refresh
          return;
        }
      }
    } catch (_) {}
    fetchStats();
    fetchInstallments();
  }, [token]);

  const fetchInstallments = () => {
    if (!token) return;
    fetch(`${API_BASE_URL}/payments/my-installments`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.plans)) {
          setInstallmentPlans(data.plans);
        }
      })
      .catch(err => console.error("Error fetching student installments:", err));
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
  const [liveTiers, setLiveTiers] = useState<any[]>([]);
  const [campaignOffers, setCampaignOffers] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/dashboard/levels`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setLiveTiers(data);
      })
      .catch(() => {});

    fetch(`${API_BASE_URL}/dashboard/offers`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setCampaignOffers(data);
      })
      .catch(() => {});
  }, []);

  const effectiveLevel = user?.membershipLevel || stats.membershipLevel || user?.rank || stats.rank || "";
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
  const enrolledCourse = stats.courses?.find((c: any) => c.UserCourse?.status === 'enrolled');
  const dynamicProgress = enrolledCourse?.UserCourse?.progress || 0;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      
      <StudentNav 
        user={user} 
        level={getLevelName()} 
        points={stats.points} 
        logout={logout} 
        notifications={stats.notifications}
      />

      <main className="max-w-[1400px] mx-auto p-3 md:p-4 lg:p-8 space-y-4 md:space-y-6">
        {isLoading ? (
          <DashboardSkeleton />
        ) : isGeneral ? (
          <div className="py-12 px-4 max-w-3xl mx-auto text-center space-y-8 animate-in fade-in zoom-in-95 duration-300">
            <div className="w-20 h-20 rounded-3xl bg-orange-500/20 border-2 border-orange-500/40 flex items-center justify-center text-orange-400 mx-auto shadow-2xl shadow-orange-500/30">
              <Lock size={40} />
            </div>

            <div className="space-y-3">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-bold uppercase tracking-wider">
                <Sparkles size={13} /> Level 0 Fast Track Required
              </span>
              <h1 className="text-3xl md:text-5xl font-black text-white leading-tight">
                Dashboard Locked for General Members
              </h1>
              <p className="text-slate-300 text-sm md:text-base leading-relaxed max-w-xl mx-auto">
                You are currently registered as a <strong className="text-white">General Member</strong>. Your personal dashboard, 6-step daily habits routine, progress tracking, and gamified rewards unlock when you enroll in <strong className="text-orange-400">Fast Track (Level 0)</strong> or higher!
              </p>
            </div>

            {/* Value Preview Box */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 md:p-8 text-left space-y-4 shadow-xl">
              <h3 className="text-sm font-black uppercase tracking-wider text-orange-400">
                What Unlocks with Fast Track (Level 0):
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300">
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-emerald-400">✓</span> 4 Essential Video Masterclasses
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-emerald-400">✓</span> Daily Routine &amp; Habit Checklist
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-emerald-400">✓</span> XP Points &amp; Badge Milestones
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-emerald-400">✓</span> Full Student Overview Analytics
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => setShowUpgradeModal(true)}
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-black rounded-2xl text-base shadow-xl shadow-orange-500/25 flex items-center justify-center gap-2 hover:scale-105 transition-all cursor-pointer"
              >
                <Zap size={18} />
                Unlock {l0Pricing.name} ({l0Pricing.hasOffer ? `Offer: ${l0Pricing.finalPrice}` : l0Pricing.finalPrice})
              </button>
              <Link
                href="/student/feed"
                className="w-full sm:w-auto px-6 py-4 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white font-bold rounded-2xl text-base transition-all flex items-center justify-center gap-2"
              >
                <Sparkles size={16} className="text-orange-400" />
                Go to Community Feed
              </Link>
            </div>

            <TierPurchaseModal
              isOpen={showUpgradeModal}
              onClose={() => setShowUpgradeModal(false)}
              preselectedTier="L0"
              onSuccess={() => {
                setShowUpgradeModal(false);
                fetchStats();
              }}
            />
          </div>
        ) : (<>
          {/* Active Installment Reminders Banner */}
          {installmentPlans.filter(p => p.status === 'active' || p.status === 'overdue').map((plan) => {
            const isOverdue = plan.status === 'overdue' || (plan.nextDueDate && new Date(plan.nextDueDate).getTime() < Date.now());
            const nextNum = (plan.paidInstallments || 0) + 1;
            const dueDateStr = plan.nextDueDate
              ? new Date(plan.nextDueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
              : 'Scheduled Soon';

            return (
              <div
                key={plan.id}
                className={`p-4 md:p-5 rounded-3xl border transition-all shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  isOverdue
                    ? 'bg-red-500/10 border-red-500/40 text-red-200'
                    : 'bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-slate-900 border-amber-500/40 text-white'
                }`}
              >
                <div className="flex items-start md:items-center gap-3.5">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shrink-0 ${
                    isOverdue ? 'bg-red-500/20 text-red-400 border border-red-500/40' : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                  }`}>
                    {isOverdue ? <AlertCircle size={24} /> : <CreditCard size={24} />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                        isOverdue ? 'bg-red-500/20 text-red-300 border border-red-500/40' : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      }`}>
                        {isOverdue ? '⚠️ Overdue Installment' : '🔔 Next Installment Scheduled'}
                      </span>
                      <span className="text-xs text-slate-400 font-bold">
                        {plan.tierName || 'Level 3'} ({plan.planName || 'Installment Plan'})
                      </span>
                    </div>
                    <h3 className="text-base md:text-lg font-black text-white mt-0.5">
                      Installment #{nextNum} of {plan.totalInstallments} : ₹{Number(plan.installmentAmount).toLocaleString('en-IN')}
                    </h3>
                    <p className="text-xs text-slate-300 flex items-center gap-1.5 mt-1">
                      <Calendar size={13} className={isOverdue ? 'text-red-400' : 'text-amber-400'} />
                      Due Date: <strong className={isOverdue ? 'text-red-300' : 'text-amber-300'}>{dueDateStr}</strong>
                      <span className="text-slate-500 mx-1">•</span>
                      <span>Progress: {plan.paidInstallments}/{plan.totalInstallments} Paid</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <button
                    type="button"
                    onClick={() => handlePayNextInstallment(plan)}
                    disabled={payingPlanId === plan.id}
                    className="w-full md:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-black text-xs md:text-sm shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2 transition-all hover:scale-105 cursor-pointer"
                  >
                    <CreditCard size={15} />
                    {payingPlanId === plan.id ? 'Processing...' : `Pay Installment #${nextNum} (₹${Number(plan.installmentAmount).toLocaleString('en-IN')})`}
                  </button>
                </div>
              </div>
            );
          })}

          {/* Header & Badges Showcase Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 items-stretch">
            <div className="lg:col-span-8 flex flex-col">
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
              />
            </div>
            <div className="lg:col-span-4 flex flex-col">
              <SkillMastery skills={stats.skills} />
            </div>
          </div>

          {/* Today's Focus: 6-Step Daily Habits & Routine */}
          <DailyRoutineChecklist streak={stats.streak} onCompleteRoutine={fetchStats} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
            <div className="lg:col-span-2">
              <LearningProgress courses={stats.courses} nextGoal={stats.nextGoal} />
            </div>
            <div className="lg:col-span-1">
              <BusinessMilestones milestones={stats.milestones} />
            </div>
          </div>

          <CoursesAndBadges badges={stats.badges} courses={stats.courses} allCourses={stats.allCourses} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            <PortfolioGallery portfolios={stats.portfolios} />
            <SalesAndCommunity sales={stats.salesRecords} communityWins={stats.communityWins} onInteract={fetchStats} />
          </div>

          <RewardsStore currentPoints={stats.points} onRedeem={fetchStats} />

          <AiMentor skills={stats.skills} />
        </>)}
        </main>
    </div>
  );
}
