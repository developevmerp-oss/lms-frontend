"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { StudentNav, getLevelCode } from "@/components/layout/StudentNav";
import {
  BookOpen,
  PlayCircle,
  FileText,
  ChevronRight,
  CheckCircle2,
  Video,
  X,
  Layers,
  ExternalLink,
  Lock,
  Sparkles,
  Trophy,
  Zap,
  Tag,
  Percent,
  Flame,
  Clock,
  Calendar,
  ShieldCheck,
  Award,
  AlertCircle,
  Check,
  Maximize2,
  ClipboardList,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { TierPurchaseModal } from "@/components/membership/TierPurchaseModal";
import { getComputedTierPricing, getCourseResolvedOffer } from "@/utils/tierPricing";
import { processRazorpayPayment } from "@/utils/razorpay";

import { API_BASE_URL } from "@/config/api";

const getFileUrl = (url?: string) => {
  if (!url) return "";
  let clean = url.replace(/\\/g, "/").trim();
  if (clean.startsWith("http://") || clean.startsWith("https://") || clean.startsWith("data:")) return clean;
  if (!clean.startsWith("/")) clean = "/" + clean;
  const backendBase = API_BASE_URL.replace(/\/api$/, "");
  return `${backendBase}${clean}`;
};

export function getCourseOffer(course: any, basePriceStr: string) {
  if (!course.offerActive || !course.discountValue) return null;

  const now = new Date();
  if (course.offerStartDate && new Date(course.offerStartDate) > now) return null;
  if (course.offerEndDate && new Date(course.offerEndDate) < now) return null;

  const numPrice = parseInt(basePriceStr.replace(/[^0-9]/g, "")) || 0;
  if (numPrice <= 0) return null;

  let finalPrice = numPrice;
  if (course.discountType === "percentage") {
    const discount = (numPrice * course.discountValue) / 100;
    finalPrice = Math.max(0, Math.round(numPrice - discount));
  } else {
    finalPrice = Math.max(0, Math.round(numPrice - course.discountValue));
  }

  return {
    discountType: course.discountType,
    discountValue: course.discountValue,
    originalPrice: `₹${numPrice.toLocaleString("en-IN")}`,
    discountedPrice: `₹${finalPrice.toLocaleString("en-IN")}`,
    discountedNum: finalPrice,
    discountLabel: course.discountType === "percentage" ? `${course.discountValue}% OFF` : `₹${course.discountValue} OFF`,
    offerEndDate: course.offerEndDate,
  };
}

export const LEVEL_TIER_CONFIG: Record<string, { name: string; price: string; color: string; bg: string; border: string }> = {
  L0: { name: "Fast Track", price: "₹499", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/30" },
  L1: { name: "Silver Member", price: "₹4,999", color: "text-slate-300", bg: "bg-slate-500/10", border: "border-slate-500/30" },
  L2: { name: "Gold Member", price: "₹19,999", color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/30" },
  L3: { name: "Diamond Club", price: "₹59,999", color: "text-cyan-400", bg: "bg-cyan-500/10", border: "border-cyan-500/30" },
  "L3+": { name: "Masters Club", price: "Exclusive", color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/30" },
};

const LEVEL_HIERARCHY: Record<string, number> = {
  GENERAL: -1,
  L0: 0,
  L1: 1,
  L2: 2,
  L3: 3,
  "L3+": 4,
};

function formatEmbedUrl(url: string): string {
  if (!url) return "";
  if (url.includes("youtube.com/watch")) {
    const videoId = new URL(url).searchParams.get("v");
    if (videoId) return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
  }
  if (url.includes("youtu.be/")) {
    const videoId = url.split("youtu.be/")[1]?.split("?")[0];
    if (videoId) return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
  }
  if (url.includes("drive.google.com/file/d/")) {
    const fileId = url.split("/d/")[1]?.split("/")[0];
    if (fileId) return `https://drive.google.com/file/d/${fileId}/preview`;
  }
  if (url.includes("vimeo.com/")) {
    const vimeoId = url.split("vimeo.com/")[1]?.split("?")[0];
    if (vimeoId) return `https://player.vimeo.com/video/${vimeoId}?autoplay=1`;
  }
  return url;
}

export default function StudentCourses() {
  const { user, token, logout } = useAuth();
  const [courses, setCourses] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({ points: 0, notifications: [] });
  const [selectedCourse, setSelectedCourse] = useState<any | null>(null);
  const [courseModalTab, setCourseModalTab] = useState<"lessons" | "assignments" | "about">("lessons");
  const [activeVideoLesson, setActiveVideoLesson] = useState<{ title: string; videoUrl: string } | null>(null);
  const [activeLevelFilter, setActiveLevelFilter] = useState<string>("all");
  const [expandedLevel, setExpandedLevel] = useState<string | null>(null);

  const handleOpenCourse = (course: any) => {
    setSelectedCourse(course);
    setCourseModalTab("lessons");
    if (token && course?.id) {
      fetch(`${API_BASE_URL}/courses/${course.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(fresh => {
          if (fresh && fresh.id) {
            setSelectedCourse(fresh);
          }
        })
        .catch(() => {});
    }
  };
  
  // Membership Level Purchase Modal State
  const [purchaseModal, setPurchaseModal] = useState<{ isOpen: boolean; tierCode: string }>({
    isOpen: false,
    tierCode: "L1",
  });

  // Individual Course Purchase Modal State
  const [individualCourseModal, setIndividualCourseModal] = useState<any | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [purchaseSuccessMsg, setPurchaseSuccessMsg] = useState("");
  const [previewFlyerModal, setPreviewFlyerModal] = useState<string | null>(null);
  
  const [levelTiers, setLevelTiers] = useState<any[]>([]);
  const [campaignOffers, setCampaignOffers] = useState<any[]>([]);

  const fetchStudentData = () => {
    fetch(`${API_BASE_URL}/dashboard/levels`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) setLevelTiers(data);
      })
      .catch(err => console.error("Error fetching level tiers", err));

    fetch(`${API_BASE_URL}/dashboard/offers`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setCampaignOffers(data);
        else if (data && Array.isArray(data.offers)) setCampaignOffers(data.offers);
      })
      .catch(() => {
        fetch(`${API_BASE_URL}/admin/offers/active`)
          .then(res => res.json())
          .then(data => {
            if (Array.isArray(data)) setCampaignOffers(data);
          })
          .catch(() => {});
      });

    if (!token) return;
    
    fetch(`${API_BASE_URL}/dashboard/student`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data && !data.message) {
          setStats({
            points: data.points,
            notifications: data.notifications,
            membershipLevel: data.membershipLevel,
            rank: data.rank,
            membershipExpiresAt: data.membershipExpiresAt,
            isExpired: data.isExpired,
            daysRemaining: data.daysRemaining,
            courses: data.courses || [],
          });
        }
      })
      .catch(err => console.error("Error fetching stats", err));

    fetch(`${API_BASE_URL}/courses`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setCourses(data);
      })
      .catch(err => console.error("Error fetching courses", err));
  };

  useEffect(() => {
    fetchStudentData();
  }, [token]);

  // Auto-open tier purchase modal when redirected from QR code or direct link with ?unlock=L1/L2/L3
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const unlockParam = params.get("unlock") || params.get("tier") || params.get("level");
      if (unlockParam) {
        const code = unlockParam.trim().toUpperCase();
        setPurchaseModal({
          isOpen: true,
          tierCode: code,
        });
      }
    }
  }, []);

  const getTierPrice = (lvlCode: string): string => {
    const found = levelTiers.find((t: any) => (t.code || "").toUpperCase() === lvlCode.toUpperCase());
    if (found && found.price) return found.price;
    return LEVEL_TIER_CONFIG[lvlCode]?.price || "₹499";
  };

  const effectiveLevelName = user?.membershipLevel || user?.level || stats.membershipLevel || stats.rank || user?.rank || "";
  const studentLevelCode = getLevelCode(effectiveLevelName, stats.points || 0);
  const studentRankNum = LEVEL_HIERARCHY[studentLevelCode] ?? 0;

  // Unlocking checks
  const isLevelUnlocked = (lvlCode: string) => {
    if (stats.isExpired) return false;
    if (studentLevelCode === "GENERAL") return false;
    const requiredNum = LEVEL_HIERARCHY[lvlCode.toUpperCase()] ?? 0;
    return studentRankNum >= requiredNum;
  };

  const getCourseEnrollment = (course: any) => {
    if (!course || !course.id || !Array.isArray(stats.courses)) return null;
    return stats.courses.find(
      (sc: any) =>
        sc &&
        sc.id &&
        String(sc.id).toLowerCase() === String(course.id).toLowerCase()
    );
  };

  const isCourseUnlocked = (course: any) => {
    if (!course) return false;

    // 1. Check direct enrollment in user's enrolled courses list
    const enrolled = getCourseEnrollment(course);
    if (enrolled) {
      const uc = enrolled.UserCourse || enrolled.userCourse;
      // If course has an expiration date, check if it has passed
      if (uc && uc.expiresAt) {
        const expiry = new Date(uc.expiresAt);
        if (expiry.getTime() < Date.now()) {
          // EXPIRED! Access is locked until student re-purchases
          return false;
        }
      }
      return true;
    }

    // 2. Standalone course without level tier requires direct purchase
    const lvl = course.levelCode;
    if (!lvl || lvl.toUpperCase() === "NONE") {
      return false;
    }

    // 3. Level-based course (L0, L1, L2, L3) unlocked if student has active level membership
    return isLevelUnlocked(lvl);
  };

  const isCourseExpired = (course: any) => {
    const enrolled = getCourseEnrollment(course);
    if (!enrolled) return false;
    const uc = enrolled.UserCourse || enrolled.userCourse;
    if (uc && uc.expiresAt) {
      return new Date(uc.expiresAt).getTime() < Date.now();
    }
    return false;
  };

  const getCourseValidityInfo = (course: any) => {
    if (!course) return { isEnrolled: false, isExpired: false, text: "Course Info" };
    const enrolled = getCourseEnrollment(course);
    if (!enrolled) {
      if (course.validityMonths && Number(course.validityMonths) > 0) {
        const m = Number(course.validityMonths);
        let durationText = `${m} Months`;
        if (m === 1) durationText = "1 Month";
        else if (m === 3) durationText = "3 Months";
        else if (m === 6) durationText = "6 Months";
        else if (m === 12) durationText = "1 Year";
        else if (m === 36) durationText = "3 Years";
        return { isEnrolled: false, isExpired: false, text: `⏱️ ${durationText} Validity (starts on registration/purchase)` };
      }
      return { isEnrolled: false, isExpired: false, text: "♾️ Lifetime Access" };
    }
    const uc = enrolled.UserCourse || enrolled.userCourse;
    if (uc && uc.expiresAt) {
      const expiry = new Date(uc.expiresAt);
      const isPast = expiry.getTime() < Date.now();
      const diffMs = expiry.getTime() - Date.now();
      const daysLeft = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
      const dateStr = expiry.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
      if (isPast) {
        return { isEnrolled: true, isExpired: true, text: `⚠️ Validity Expired on ${dateStr}`, daysLeft: 0 };
      }
      return { isEnrolled: true, isExpired: false, text: `✓ Valid until ${dateStr} (${daysLeft} day${daysLeft === 1 ? '' : 's'} left)`, daysLeft };
    }
    return { isEnrolled: true, isExpired: false, text: "♾️ Lifetime Access Unlocked", daysLeft: null };
  };

  const handlePurchaseIndividualCourse = async (course: any) => {
    if (!course) return;

    // Check fixed validity window only if no rolling validityMonths is configured
    const now = new Date();
    if (!course.validityMonths) {
      if (course.validityStartDate && new Date(course.validityStartDate) > now) {
        alert(`Enrollment for "${course.title}" will open on ${new Date(course.validityStartDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}. Please check back then.`);
        return;
      }
      if (course.validityEndDate && new Date(course.validityEndDate) < now) {
        alert(`Course validity for "${course.title}" has expired (${new Date(course.validityEndDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}). Enrollment is currently closed.`);
        return;
      }
    }

    const basePriceStr = course.price ? (course.price.startsWith("₹") ? course.price : `₹${course.price}`) : "₹999";
    const offer = getCourseOffer(course, basePriceStr);
    const payableAmount = offer ? offer.discountedNum : (parseInt(basePriceStr.replace(/[^0-9]/g, "")) || 999);

    setIsProcessingPayment(true);
    try {
      await processRazorpayPayment({
        amount: payableAmount,
        tierCode: "COURSE",
        tierName: course.title,
        courseId: course.id,
        email: user?.email,
        name: user?.name,
        phone: user?.phone,
        onSuccess: () => {
          setIndividualCourseModal(null);
          const vMsg = course.validityMonths ? `${course.validityMonths} month${course.validityMonths > 1 ? 's' : ''} access` : 'lifetime access';
          setPurchaseSuccessMsg(`🎉 Success! You now have ${vMsg} to "${course.title}". Start learning now!`);
          setTimeout(() => setPurchaseSuccessMsg(""), 6000);
          fetchStudentData();
        },
        onFailure: (err: any) => {
          alert(`Payment could not be completed: ${err?.message || err}`);
        },
      });
    } catch (err: any) {
      console.error("Individual course payment error:", err);
      alert(err.message || "Payment process failed.");
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const getLevelName = () => {
    if (studentLevelCode === "GENERAL") return "General Member";
    return effectiveLevelName || "Fast Track (L0)";
  };

  const displayedCourses = courses.filter((c) => {
    if (activeLevelFilter === "all") return true;
    if (activeLevelFilter === "NONE") {
      return !c.levelCode || c.levelCode.toUpperCase() === "NONE";
    }
    return (c.levelCode || "").toUpperCase() === activeLevelFilter.toUpperCase();
  });

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col font-sans">
      <StudentNav 
        user={user} 
        level={getLevelName()} 
        points={stats.points} 
        logout={logout} 
        notifications={stats.notifications}
      />

      <main className="flex-1 max-w-[1400px] mx-auto w-full p-4 md:p-8">
        <header className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-orange-500/30 bg-orange-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-orange-400 mb-2">
              <BookOpen size={13} className="text-orange-400" /> Sequential Video Curriculum
            </span>
            <h1 className="text-3xl md:text-4xl font-black text-white flex items-center gap-3">
              Course Library &amp; Video Modules
            </h1>
            <p className="text-slate-400 mt-1 text-sm md:text-base">
              Your step-by-step masterclass library structured from foundational casting (L0) to commercial masterworks (L3).
            </p>
          </div>

          <button
            onClick={() => setPurchaseModal({ isOpen: true, tierCode: studentLevelCode === "L0" ? "L1" : studentLevelCode === "L1" ? "L2" : "L3" })}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-black text-xs transition-all hover:scale-105 shadow-lg shadow-orange-500/20 cursor-pointer self-start md:self-auto"
          >
            <Zap size={16} /> Upgrade Membership Level
          </button>
        </header>

        {purchaseSuccessMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-bold flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 size={18} /> {purchaseSuccessMsg}
          </div>
        )}

        {/* Student Expiry Alert Banner (Single Validity) */}
        {stats.isExpired ? (
          <div className="mb-6 p-5 rounded-3xl bg-gradient-to-r from-red-950/80 via-slate-900 to-red-950/80 border-2 border-red-500/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xl">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 shrink-0 animate-pulse">
                <Lock size={22} />
              </div>
              <div>
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  🔒 Level Access Expired (Single Validity Limit Reached)
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  Your purchase validity expired on {stats.membershipExpiresAt ? new Date(stats.membershipExpiresAt).toLocaleDateString("en-IN") : "recently"}. Re-enroll or upgrade to Lifetime Validity to resume video lessons.
                </p>
              </div>
            </div>
            <button
              onClick={() => setPurchaseModal({ isOpen: true, tierCode: studentLevelCode })}
              className="px-5 py-2.5 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-black rounded-xl text-xs shadow-lg transition-all hover:scale-105 cursor-pointer whitespace-nowrap"
            >
              Renew Access Now →
            </button>
          </div>
        ) : stats.daysRemaining !== null && stats.daysRemaining !== undefined && stats.daysRemaining <= 30 ? (
          <div className="mb-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-3 text-xs text-amber-300">
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-amber-400 animate-spin-slow" />
              <span>
                <strong>Single Validity Active:</strong> {stats.daysRemaining} Days Remaining (Valid until {stats.membershipExpiresAt ? new Date(stats.membershipExpiresAt).toLocaleDateString("en-IN") : ""})
              </span>
            </div>
            <button
              onClick={() => setPurchaseModal({ isOpen: true, tierCode: studentLevelCode })}
              className="font-bold underline hover:text-amber-200 cursor-pointer"
            >
              Upgrade to Lifetime Validity
            </button>
          </div>
        ) : null}

        {/* Primary 4 Membership Level Cards Section */}
        <div className="space-y-6 mb-12">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-3 text-xs text-slate-300">
            <Sparkles size={18} className="text-orange-400 shrink-0" />
            <span>
              <strong>Membership Level Purchase Flow:</strong> Students purchase complete <strong>Membership Levels</strong> (L0, L1, L2, L3) — purchasing a level unlocks all masterclasses, tools, and community perks included in that level! Click on any Level Card to inspect its included courses.
            </span>
          </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {(["L0", "L1", "L2", "L3"] as const).map((lvl) => {
                const cfg = LEVEL_TIER_CONFIG[lvl];
                const tierPricing = getComputedTierPricing(lvl, levelTiers, campaignOffers);
                const isUnlocked = isLevelUnlocked(lvl);
                const isCurrent = studentLevelCode === lvl;
                const courseCount = courses.filter((c) => (c.levelCode || "L0").toUpperCase() === lvl).length;
                const liveLevel = levelTiers.find((t: any) => (t.code || t.levelCode || "").toUpperCase() === lvl.toUpperCase());
                const levelDisplayName = tierPricing.name || liveLevel?.name || cfg.name;
                const levelDisplayDesc = liveLevel?.description || (
                  lvl === "L0" ? "Foundational resin chemistry, bubble-free mixing, and essential art setup." :
                  lvl === "L1" ? "Core casting techniques, marbling, lotus ponds, and first client sales." :
                  lvl === "L2" ? "High-ticket geode wall art, luxury clocks, and 3D wave ripples." :
                  "3D photo art, wood & resin tables, floral preservation, and trainer status."
                );

                return (
                  <div
                    key={lvl}
                    className={`rounded-3xl p-6 flex flex-col justify-between border transition-all ${
                      isCurrent
                        ? "bg-gradient-to-b from-orange-950/40 via-slate-900 to-slate-950 border-2 border-orange-500/80 shadow-2xl shadow-orange-500/20"
                        : isUnlocked
                        ? "bg-slate-900/90 border-slate-800"
                        : "bg-slate-900/60 border-slate-800/80 hover:border-slate-700"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${cfg.bg} ${cfg.color} ${cfg.border}`}>
                          {lvl}
                        </span>
                        <div className="flex flex-col items-end">
                          {tierPricing.hasOffer ? (
                            <div className="flex items-center gap-1.5">
                              <span className="text-[11px] text-slate-500 line-through font-mono">{tierPricing.originalPrice}</span>
                              <span className="text-sm font-black text-amber-400 font-mono">{tierPricing.finalPrice}</span>
                              <span className="bg-gradient-to-r from-red-500 to-rose-600 text-white font-black text-[9px] px-1.5 py-0.5 rounded shadow-sm">
                                {tierPricing.discountLabel}
                              </span>
                            </div>
                          ) : (
                            <span className="text-sm font-black text-white font-mono">{tierPricing.finalPrice}</span>
                          )}
                        </div>
                      </div>

                      <h3 className="text-xl font-black text-white mb-2">{levelDisplayName}</h3>
                      <p className="text-xs text-slate-400 mb-4 leading-relaxed line-clamp-3">
                        {levelDisplayDesc}
                      </p>

                      <div className="space-y-2 border-t border-slate-800/80 pt-4 text-xs text-slate-300">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 size={14} className={cfg.color} />
                          <span>Includes {courseCount || (lvl === "L0" ? 3 : lvl === "L1" ? 5 : lvl === "L2" ? 4 : 4)} Masterclass Modules</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 size={14} className={cfg.color} />
                          <span>Full Community Access</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 size={14} className={cfg.color} />
                          <span>{lvl === "L3" ? "Exclusive Merch Store & Rewards Redemption" : "Q&A & Support Vault"}</span>
                        </div>
                      </div>

                      {/* Click to view included courses for information */}
                      <button
                        onClick={() => setExpandedLevel(lvl)}
                        className="mt-4 w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <BookOpen size={13} className="text-orange-400" />
                        <span>View Included Courses ({courseCount}) →</span>
                      </button>
                    </div>

                    <div className="mt-5">
                      {isCurrent ? (
                        <div className="w-full py-3 bg-orange-500/20 text-orange-400 border border-orange-500/40 rounded-xl text-xs font-black text-center">
                          ✓ Active Level Tier
                        </div>
                      ) : isUnlocked ? (
                        <div className="w-full py-3 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-xl text-xs font-black text-center">
                          ✓ Unlocked Level
                        </div>
                      ) : (
                        <button
                          onClick={() => setPurchaseModal({ isOpen: true, tierCode: lvl })}
                          className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-black rounded-xl text-xs text-center transition-all shadow-md hover:scale-105 cursor-pointer"
                        >
                          Unlock {levelDisplayName} ({tierPricing.hasOffer ? `Offer: ${tierPricing.finalPrice}` : tierPricing.finalPrice})
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        {/* Modal to view courses included inside a clicked Level */}
        {expandedLevel && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 max-w-3xl w-full max-h-[85vh] overflow-y-auto shadow-2xl relative"
            >
              <button
                onClick={() => setExpandedLevel(null)}
                className="absolute top-5 right-5 w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-all cursor-pointer"
              >
                <X size={18} />
              </button>

              {(() => {
                const cfg = LEVEL_TIER_CONFIG[expandedLevel];
                const tierPricing = getComputedTierPricing(expandedLevel, levelTiers, campaignOffers);
                const levelCourses = courses.filter((c) => (c.levelCode || "L0").toUpperCase() === expandedLevel);
                const isUnlocked = isLevelUnlocked(expandedLevel);

                return (
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border ${cfg.bg} ${cfg.color} ${cfg.border}`}>
                        {expandedLevel}
                      </span>
                      <h2 className="text-2xl font-black text-white">{tierPricing.name} Courses ({levelCourses.length})</h2>
                      <div className="ml-auto mr-12 flex items-baseline gap-2">
                        {tierPricing.hasOffer ? (
                          <>
                            <span className="text-xs text-slate-500 line-through font-mono">{tierPricing.originalPrice}</span>
                            <span className="text-base font-black text-amber-400 font-mono">{tierPricing.finalPrice}</span>
                            <span className="bg-gradient-to-r from-red-500 to-rose-600 text-white font-black text-[10px] px-2 py-0.5 rounded shadow">
                              {tierPricing.discountLabel}
                            </span>
                          </>
                        ) : (
                          <span className="text-base font-black text-amber-400 font-mono">{tierPricing.finalPrice}</span>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-slate-400 mb-6">
                      Below are the masterclass video modules included when you purchase the <strong>{tierPricing.name} ({expandedLevel})</strong> membership tier:
                    </p>

                    <div className="space-y-4">
                      {levelCourses.map((c, i) => (
                        <div key={c.id || i} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-start gap-4">
                          <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-400 font-black text-sm flex items-center justify-center shrink-0">
                            #{i + 1}
                          </div>
                          <div className="flex-1">
                            <h4 className="text-sm font-bold text-white mb-1">{c.title}</h4>
                            <p className="text-xs text-slate-400 leading-relaxed">{c.description}</p>
                          </div>
                          {isCourseUnlocked(c) ? (
                            <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 text-[10px] font-bold shrink-0">
                              ✓ Unlocked
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-500 text-[10px] font-bold shrink-0 flex items-center gap-1">
                              <Lock size={10} /> Locked
                            </span>
                          )}
                        </div>
                      ))}
                    </div>

                    {!isUnlocked && (
                      <button
                        onClick={() => {
                          setExpandedLevel(null);
                          setPurchaseModal({ isOpen: true, tierCode: expandedLevel });
                        }}
                        className="mt-6 w-full py-3.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-black rounded-xl text-xs text-center transition-all shadow-lg hover:scale-105 cursor-pointer"
                      >
                        Unlock Entire {tierPricing.name} Tier ({tierPricing.hasOffer ? `Offer: ${tierPricing.finalPrice}` : tierPricing.finalPrice}) Now →
                      </button>
                    )}
                  </div>
                );
              })()}
            </motion.div>
          </div>
        )}

        {/* Level & Individual Course Filters */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-3 mb-8 no-scrollbar">
          <button
            onClick={() => setActiveLevelFilter("all")}
            className={`px-5 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeLevelFilter === "all"
                ? "bg-orange-500 text-slate-950 font-black shadow-lg shadow-orange-500/20"
                : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
            }`}
          >
            All Courses ({courses.length})
          </button>

          {/* Standalone / Individual Masterclasses Tab Filter */}
          <button
            onClick={() => setActiveLevelFilter("NONE")}
            className={`px-5 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
              activeLevelFilter === "NONE"
                ? "bg-purple-600 text-white font-black shadow-lg shadow-purple-500/20"
                : "bg-slate-900 border border-slate-800 text-purple-300 hover:text-white"
            }`}
          >
            <Sparkles size={13} className="text-purple-400" />
            <span>Individual Masterclasses</span>
            <span className="ml-1 px-1.5 py-0.2 rounded-full bg-slate-800/80 text-[10px] text-purple-300">
              {courses.filter((c) => !c.levelCode || c.levelCode.toUpperCase() === "NONE").length}
            </span>
          </button>

          {(["L0", "L1", "L2", "L3"] as const).map((lvl) => {
            const cfg = LEVEL_TIER_CONFIG[lvl];
            const count = courses.filter((c) => (c.levelCode || "L0").toUpperCase() === lvl).length;
            const isActive = activeLevelFilter === lvl;
            const isUnlocked = isLevelUnlocked(lvl);
            const liveLevel = levelTiers.find((t: any) => (t.code || t.levelCode || "").toUpperCase() === lvl.toUpperCase());
            const levelDisplayName = liveLevel?.name || cfg.name;

            return (
              <button
                key={lvl}
                onClick={() => setActiveLevelFilter(lvl)}
                className={`px-5 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                  isActive
                    ? "bg-orange-500 text-slate-950 font-black shadow-lg shadow-orange-500/20"
                    : "bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
                }`}
              >
                <span className={`px-2 py-0.5 rounded-md text-[11px] font-black ${isActive ? "bg-slate-950 text-orange-400" : `${cfg.bg} ${cfg.color}`}`}>
                  {lvl}
                </span>
                <span>{levelDisplayName}</span>
                {!isUnlocked && <Lock size={12} className="text-slate-500" />}
                <span className="ml-1 px-1.5 py-0.2 rounded-full bg-slate-800/80 text-[10px] text-slate-400">
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedCourses.map((course, idx) => {
            const isStandalone = !course.levelCode || course.levelCode.toUpperCase() === "NONE";
            const lvl = isStandalone ? "NONE" : (course.levelCode || "L0").toUpperCase();
            const cfg = LEVEL_TIER_CONFIG[lvl] || { name: "Individual Course", price: "Custom", color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/30" };
            const unlocked = isCourseUnlocked(course);

            // Standalone course price & offer calculation
            const basePriceStr = isStandalone 
              ? (course.price ? (course.price.startsWith("₹") ? course.price : `₹${course.price}`) : "₹999")
              : getTierPrice(lvl);
            
            const tierPricing = !isStandalone ? getComputedTierPricing(lvl, levelTiers, campaignOffers) : null;
            const offer = isStandalone 
              ? getCourseOffer(course, basePriceStr) 
              : getCourseResolvedOffer(course, tierPricing!);
            
            const displayOriginalPrice = offer ? offer.originalPrice : (tierPricing?.finalPrice || basePriceStr);
            const displayFinalPrice = offer ? offer.discountedPrice : (tierPricing?.finalPrice || basePriceStr);

            return (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                key={course.id} 
                className={`bg-slate-900/90 border rounded-3xl p-5 shadow-xl transition-all flex flex-col justify-between group ${
                  unlocked ? "border-slate-800 hover:border-orange-500/40" : "border-slate-800/60 bg-slate-900/60"
                }`}
              >
                <div>
                  {/* Course Banner Thumbnail */}
                  <div className="relative w-full h-44 rounded-2xl overflow-hidden mb-4 border border-slate-800/80 bg-slate-950 flex items-center justify-center">
                    {(course.image || course.flyerImage) ? (
                      <>
                        {/* Ambient glow backdrop */}
                        <img
                          src={course.image || course.flyerImage}
                          alt=""
                          aria-hidden="true"
                          className={`absolute inset-0 w-full h-full object-cover blur-xl opacity-35 scale-110 pointer-events-none ${
                            !unlocked ? "filter grayscale-[50%]" : ""
                          }`}
                        />
                        {/* Full crisp flyer / banner */}
                        <img
                          src={course.image || course.flyerImage}
                          alt={course.title}
                          className={`relative z-10 w-full h-full object-contain p-1.5 transition-transform duration-500 group-hover:scale-105 ${
                            !unlocked ? "filter grayscale-[30%] opacity-80" : ""
                          }`}
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setPreviewFlyerModal(course.flyerImage || course.image);
                          }}
                          className="absolute bottom-2 left-2.5 z-20 px-2 py-1 rounded-lg bg-slate-950/85 hover:bg-slate-900 text-slate-300 hover:text-white border border-slate-700/80 backdrop-blur-md transition-all shadow-md cursor-pointer opacity-0 group-hover:opacity-100 flex items-center gap-1 text-[10px] font-bold"
                          title="View Full Flyer / Poster"
                        >
                          <Maximize2 size={10} /> Full Poster
                        </button>
                      </>
                    ) : (
                      <div className={`w-full h-full bg-gradient-to-br from-slate-900 via-slate-950 to-orange-950/40 flex items-center justify-center ${
                        !unlocked ? "opacity-50" : ""
                      }`}>
                        <BookOpen size={36} className="text-slate-700" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent pointer-events-none" />

                    {/* Top Overlay Badges */}
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 flex-wrap">
                      <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-black border shadow-md backdrop-blur-md ${isStandalone ? "bg-purple-500/20 text-purple-300 border-purple-500/40" : `${cfg.bg} ${cfg.color} ${cfg.border}`}`}>
                        {isStandalone ? "✨ Standalone Masterclass" : `${lvl} • ${tierPricing?.name || cfg.name}`}
                      </span>

                      {offer && (
                        <span className="bg-gradient-to-r from-red-500 to-rose-600 text-white font-black text-[10px] px-2 py-0.5 rounded-lg shadow-md border border-red-400/40 flex items-center gap-1 animate-pulse">
                          <Flame size={10} />
                          {offer.discountLabel}
                        </span>
                      )}
                    </div>

                    <div className="absolute top-2.5 right-2.5">
                      {!unlocked ? (
                        offer ? (
                          <div className="flex items-center gap-1.5 bg-slate-950/90 border border-red-500/50 px-2.5 py-0.5 rounded-lg backdrop-blur-md shadow-md">
                            <span className="text-[10px] text-slate-400 line-through">{displayOriginalPrice}</span>
                            <span className="text-[11px] font-black text-amber-300">{displayFinalPrice}</span>
                          </div>
                        ) : (
                          <span className={`text-[10px] font-black bg-slate-950/85 border px-2 py-0.5 rounded-lg backdrop-blur-md flex items-center gap-1 shadow-md ${isStandalone ? "text-purple-300 border-purple-500/40" : "text-amber-300 border-amber-500/40"}`}>
                            <Lock size={10} /> {displayFinalPrice}
                          </span>
                        )
                      ) : (
                        <span className="text-[10px] font-black text-emerald-400 bg-slate-950/85 border border-emerald-500/30 px-2 py-0.5 rounded-lg backdrop-blur-md flex items-center gap-1 shadow-md">
                          <CheckCircle2 size={10} /> Unlocked
                        </span>
                      )}
                    </div>

                    {/* Course Order */}
                    <div className="absolute bottom-2 right-2.5">
                      <span className="text-[10px] text-slate-300 bg-slate-950/80 px-2 py-0.5 rounded-md border border-slate-700 font-semibold backdrop-blur-sm">
                        Course #{course.order || idx + 1}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 mb-2">
                    <div className="min-w-0 flex-1">
                      <h3 className="font-black text-white text-base leading-snug truncate">
                        {course.title}
                      </h3>
                      <p className="text-xs text-slate-400 flex items-center gap-1 mt-1 font-semibold">
                        <Layers size={12} className="text-orange-400" /> {course.chapters?.length || 0} Video Lessons
                      </p>
                    </div>
                  </div>
                  
                  <p className="text-slate-400 text-xs leading-relaxed mb-4 line-clamp-2">
                    {course.description || "Master step-by-step resin art techniques, tools, and business strategies."}
                  </p>

                  {isStandalone && (() => {
                    const vInfo = getCourseValidityInfo(course);
                    return (
                      <div className={`mb-4 px-2.5 py-1.5 rounded-xl text-[10px] font-semibold flex items-center gap-1.5 border backdrop-blur-sm ${
                        vInfo.isExpired 
                          ? 'bg-red-500/10 text-red-300 border-red-500/30' 
                          : vInfo.isEnrolled 
                          ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30' 
                          : 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30'
                      }`}>
                        <Clock size={12} className="shrink-0" />
                        <span>{vInfo.text}</span>
                      </div>
                    );
                  })()}
                </div>

                {unlocked ? (
                  <button 
                    onClick={() => handleOpenCourse(course)}
                    className="w-full py-3 px-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 text-slate-950 font-black rounded-xl text-xs flex items-center justify-center gap-2 shadow-md shadow-orange-500/10 transition-all hover:scale-[1.02] cursor-pointer"
                  >
                    <span>📂 Open Course Lessons</span>
                    <ChevronRight size={14} />
                  </button>
                ) : isStandalone ? (
                  isCourseExpired(course) ? (
                    <button
                      onClick={() => setIndividualCourseModal(course)}
                      className="w-full py-3 px-4 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-950/40 hover:scale-[1.02] cursor-pointer"
                    >
                      <Clock size={14} className="text-amber-200" />
                      <span>⚠️ Validity Expired · Re-purchase ({displayFinalPrice})</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => setIndividualCourseModal(course)}
                      className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 shadow-lg shadow-purple-900/30 hover:scale-[1.02] cursor-pointer group"
                    >
                      <Sparkles size={14} className="text-amber-300" />
                      <span>
                        Unlock Course Standalone ({displayFinalPrice})
                      </span>
                    </button>
                  )
                ) : (
                  <button
                    onClick={() => setPurchaseModal({ isOpen: true, tierCode: lvl })}
                    className="w-full py-3 px-4 bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-orange-500 hover:to-amber-500 hover:text-slate-950 text-amber-300 border border-amber-500/40 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer group"
                  >
                    <Lock size={13} className="text-amber-400 group-hover:text-slate-950" />
                    {offer ? (
                      <span>
                        Purchase &amp; Unlock {tierPricing?.name} (Offer: {displayFinalPrice})
                      </span>
                    ) : (
                      <span>Purchase &amp; Unlock {tierPricing?.name} ({displayFinalPrice})</span>
                    )}
                  </button>
                )}
              </motion.div>
            );
          })}
          
          {displayedCourses.length === 0 && (
            <div className="col-span-full py-20 flex flex-col items-center justify-center text-center bg-slate-900/50 border border-dashed border-slate-800 rounded-3xl p-8">
              <BookOpen size={56} className="text-slate-700 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">No Courses in this Category</h3>
              <p className="text-slate-400 text-sm">Check other level tabs to view your enrolled curriculum.</p>
            </div>
          )}
        </div>
      </main>

      {/* Comprehensive Course Content & Chapter Viewer Modal */}
      {selectedCourse && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
          >
            {/* Modal Course Banner */}
            {selectedCourse.image && (
              <div className="relative w-full h-40 border-b border-slate-800 bg-slate-950 overflow-hidden shrink-0 flex items-center justify-center">
                <img
                  src={selectedCourse.image}
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 w-full h-full object-cover blur-xl opacity-30 scale-105 pointer-events-none"
                />
                <img
                  src={selectedCourse.image}
                  alt={selectedCourse.title}
                  className="relative z-10 w-full h-full object-contain p-2"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/30 to-transparent pointer-events-none" />
                
                <div className="absolute bottom-2 left-4 z-20 flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1 backdrop-blur-md">
                    <CheckCircle2 size={11} /> {getCourseValidityInfo(selectedCourse).text}
                  </span>
                </div>
              </div>
            )}

            {/* Modal Header */}
            <div className="flex justify-between items-center p-5 border-b border-slate-800 bg-slate-900/90">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400 shrink-0">
                  <BookOpen size={20} />
                </div>
                <div className="min-w-0">
                  <span className="text-[11px] font-bold text-orange-400 uppercase tracking-wider block">
                    {!selectedCourse.levelCode || selectedCourse.levelCode.toUpperCase() === "NONE"
                      ? "✨ Standalone Masterclass"
                      : `Tier: ${selectedCourse.levelCode} • ${LEVEL_TIER_CONFIG[selectedCourse.levelCode]?.name || "Level Course"}`}
                  </span>
                  <h2 className="text-lg sm:text-xl font-black text-white truncate">{selectedCourse.title}</h2>
                </div>
              </div>

              <button 
                onClick={() => setSelectedCourse(null)} 
                className="w-9 h-9 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 flex items-center justify-center transition-colors cursor-pointer shrink-0"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Navigation Tabs */}
            <div className="flex items-center gap-2 px-5 pt-3 border-b border-slate-800/80 bg-slate-950/60 overflow-x-auto no-scrollbar shrink-0">
              <button
                onClick={() => setCourseModalTab("lessons")}
                className={`px-4 py-2 text-xs font-black rounded-t-xl transition-all cursor-pointer flex items-center gap-1.5 border-b-2 ${
                  courseModalTab === "lessons"
                    ? "text-orange-400 border-orange-500 bg-slate-900/80"
                    : "text-slate-400 border-transparent hover:text-slate-200"
                }`}
              >
                <PlayCircle size={14} />
                <span>Video Lessons ({selectedCourse.chapters?.length || 0})</span>
              </button>

              <button
                onClick={() => setCourseModalTab("assignments")}
                className={`px-4 py-2 text-xs font-black rounded-t-xl transition-all cursor-pointer flex items-center gap-1.5 border-b-2 ${
                  courseModalTab === "assignments"
                    ? "text-orange-400 border-orange-500 bg-slate-900/80"
                    : "text-slate-400 border-transparent hover:text-slate-200"
                }`}
              >
                <ClipboardList size={14} />
                <span>Assignments &amp; Tasks ({selectedCourse.assignments?.length || 0})</span>
              </button>

              <button
                onClick={() => setCourseModalTab("about")}
                className={`px-4 py-2 text-xs font-black rounded-t-xl transition-all cursor-pointer flex items-center gap-1.5 border-b-2 ${
                  courseModalTab === "about"
                    ? "text-orange-400 border-orange-500 bg-slate-900/80"
                    : "text-slate-400 border-transparent hover:text-slate-200"
                }`}
              >
                <Layers size={14} />
                <span>Course Overview</span>
              </button>
            </div>
            
            {/* Modal Content Body */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-3 flex-1">
              {/* TAB 1: VIDEO LESSONS */}
              {courseModalTab === "lessons" && (
                <>
                  {selectedCourse.chapters?.length > 0 ? (
                    selectedCourse.chapters.map((chapter: any, index: number) => (
                      <div key={chapter.id || index} className="bg-slate-950/80 border border-slate-800/80 hover:border-slate-700 rounded-2xl p-4 sm:p-5 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3.5 min-w-0">
                          <div className="w-9 h-9 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center font-black text-xs shrink-0">
                            {index + 1}
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-bold text-white text-sm truncate">{chapter.title}</h4>
                            <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500">
                              {chapter.videoUrl ? (
                                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                                  <Video size={12} /> HD Video Lesson
                                </span>
                              ) : (
                                <span>No Video Attached</span>
                              )}
                              {chapter.pdfUrl && (
                                <span className="text-blue-400 font-semibold flex items-center gap-1">
                                  <FileText size={12} /> Study Notes (PDF)
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap shrink-0">
                          {chapter.videoUrl && (
                            <button
                              onClick={() => setActiveVideoLesson({ title: chapter.title, videoUrl: chapter.videoUrl })}
                              className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 text-slate-950 rounded-xl text-xs font-black transition-all hover:scale-105 shadow-md shadow-orange-500/10 cursor-pointer"
                            >
                              <PlayCircle size={15} /> Watch Lesson
                            </button>
                          )}

                          {chapter.pdfUrl && (
                            <a
                              href={getFileUrl(chapter.pdfUrl)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition-colors border border-slate-700 cursor-pointer"
                            >
                              <FileText size={14} className="text-blue-400" /> Read PDF
                              <ExternalLink size={11} />
                            </a>
                          )}

                          {!chapter.videoUrl && !chapter.pdfUrl && (
                            <span className="text-slate-500 text-xs flex items-center gap-1.5 py-1">
                              <CheckCircle2 size={14} /> Lesson Notes
                            </span>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12 border border-dashed border-slate-800 rounded-2xl p-6">
                      <BookOpen size={40} className="text-slate-700 mx-auto mb-2" />
                      <p className="text-slate-400 text-sm font-semibold mb-1">No Video Lessons in this Course Yet</p>
                      <p className="text-slate-600 text-xs">The mentor will upload upcoming video modules shortly.</p>
                    </div>
                  )}
                </>
              )}

              {/* TAB 2: ASSIGNMENTS & MISSIONS */}
              {courseModalTab === "assignments" && (
                <>
                  {selectedCourse.assignments?.length > 0 ? (
                    <div className="space-y-3">
                      {selectedCourse.assignments.map((assn: any, idx: number) => (
                        <div key={assn.id || idx} className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="px-2 py-0.5 rounded-md bg-orange-500/10 text-orange-400 text-[10px] font-black border border-orange-500/30">
                                +{assn.points || 50} XP
                              </span>
                              <h4 className="text-sm font-bold text-white truncate">{assn.title}</h4>
                            </div>
                            <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">{assn.description}</p>
                            {assn.dueDate && (
                              <p className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
                                <Clock size={11} /> Due {new Date(assn.dueDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                              </p>
                            )}
                          </div>
                          <Link
                            href="/student/tasks"
                            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 shrink-0"
                          >
                            <span>Submit Artwork</span>
                            <ExternalLink size={12} />
                          </Link>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 border border-dashed border-slate-800 rounded-2xl p-6">
                      <ClipboardList size={40} className="text-slate-700 mx-auto mb-2" />
                      <p className="text-slate-400 text-sm font-semibold mb-1">No Mandatory Tasks for this Masterclass</p>
                      <p className="text-slate-600 text-xs">Practice freely, follow the video steps, and share your finished creation on the Sisterhood Feed!</p>
                      <Link
                        href="/student/feed"
                        className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-orange-500/10 text-orange-400 border border-orange-500/30 rounded-xl text-xs font-bold hover:bg-orange-500/20 transition-colors"
                      >
                        <Sparkles size={12} /> Post to Community Feed
                      </Link>
                    </div>
                  )}
                </>
              )}

              {/* TAB 3: COURSE OVERVIEW */}
              {courseModalTab === "about" && (
                <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
                  <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
                    <h4 className="text-sm font-black text-white mb-2 flex items-center gap-2">
                      <BookOpen size={15} className="text-orange-400" /> Masterclass Description
                    </h4>
                    <p className="text-slate-400">
                      {selectedCourse.description || "In this structured module, you will master step-by-step resin art chemistry, safe workspace techniques, bubble prevention, and client-ready finishes."}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider block mb-1">Course Format</span>
                      <span className="text-white font-bold flex items-center gap-1.5">
                        <Video size={13} className="text-orange-400" /> Sequential Video Curriculum
                      </span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider block mb-1">Access Status</span>
                      <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                        <CheckCircle2 size={13} /> Permanent Lifetime Unlocked
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}

      {/* Embedded Video Lesson Player Modal */}
      {activeVideoLesson && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-4xl w-full p-6 shadow-2xl text-white relative">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <Video className="text-orange-400" size={20} />
                <h3 className="text-lg font-black text-white truncate max-w-md">
                  {activeVideoLesson.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveVideoLesson(null)}
                className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded-full text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black border border-slate-800 shadow-inner">
              {activeVideoLesson.videoUrl.startsWith("data:video") || 
               activeVideoLesson.videoUrl.endsWith(".mp4") || 
               activeVideoLesson.videoUrl.endsWith(".webm") || 
               activeVideoLesson.videoUrl.includes("/uploads/videos/") ? (
                <video 
                  src={getFileUrl(activeVideoLesson.videoUrl)} 
                  controls 
                  autoPlay 
                  className="w-full h-full object-contain" 
                />
              ) : (
                <iframe
                  src={formatEmbedUrl(activeVideoLesson.videoUrl)}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Individual Standalone Course Purchase Modal */}
      {individualCourseModal && (() => {
        const c = individualCourseModal;
        const basePriceStr = c.price ? (c.price.startsWith("₹") ? c.price : `₹${c.price}`) : "₹999";
        const offer = getCourseOffer(c, basePriceStr);
        const originalPriceStr = offer ? offer.originalPrice : basePriceStr;
        const finalPriceStr = offer ? offer.discountedPrice : basePriceStr;

        // Validity logic
        const now = new Date();
        const start = c.validityStartDate ? new Date(c.validityStartDate) : null;
        const end = c.validityEndDate ? new Date(c.validityEndDate) : null;
        const isUpcoming = start ? now < start : false;
        const isExpired = end ? now > end : false;
        const hasValidity = Boolean(start || end);

        return (
          <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-xl flex items-center justify-center z-50 p-4 sm:p-6 overflow-y-auto">
            <motion.div
              initial={{ scale: 0.94, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ type: "spring", duration: 0.4, bounce: 0.2 }}
              className="relative w-full max-w-lg p-[1px] rounded-[32px] bg-gradient-to-b from-purple-500/50 via-indigo-500/25 to-slate-800 shadow-[0_25px_80px_-15px_rgba(147,51,234,0.4)] my-auto"
            >
              <div className="bg-slate-950/95 backdrop-blur-2xl rounded-[31px] overflow-hidden text-white flex flex-col">
                {/* Header Banner with uncropped flyer */}
                <div className="relative w-full h-72 sm:h-84 bg-slate-950 overflow-hidden border-b border-purple-500/20 flex items-center justify-center">
                  {(c.flyerImage || c.image) ? (
                    <>
                      {/* Ambient blur background */}
                      <img 
                        src={c.flyerImage || c.image} 
                        alt="" 
                        aria-hidden="true"
                        className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-40 scale-110 pointer-events-none" 
                      />
                      {/* Complete uncropped crisp flyer */}
                      <img 
                        src={c.flyerImage || c.image} 
                        alt={c.title} 
                        className="relative z-10 w-full h-full object-contain p-2 cursor-pointer transition-transform duration-500 hover:scale-[1.02]" 
                        onClick={() => setPreviewFlyerModal(c.flyerImage || c.image)}
                        title="Click to view full flyer"
                      />
                    </>
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-purple-950 via-slate-950 to-indigo-950 flex items-center justify-center">
                      <BookOpen size={52} className="text-purple-400/80" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-slate-950/60 pointer-events-none" />

                  {/* Top Bar Floating Badges */}
                  <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between z-20">
                    <span className="px-3 py-1 rounded-full text-[10px] font-black tracking-wider uppercase bg-purple-500/30 text-purple-200 border border-purple-400/40 backdrop-blur-md shadow-lg flex items-center gap-1.5">
                      <Sparkles size={11} className="text-amber-300" /> Standalone Masterclass
                    </span>
                    <div className="flex items-center gap-2">
                      {(c.flyerImage || c.image) && (
                        <button
                          type="button"
                          onClick={() => setPreviewFlyerModal(c.flyerImage || c.image)}
                          className="px-2.5 py-1 rounded-full bg-slate-950/80 hover:bg-slate-900 text-slate-300 hover:text-white border border-slate-700/60 text-[11px] font-semibold flex items-center gap-1 backdrop-blur-md transition-all shadow-md cursor-pointer"
                          title="View Full Resolution Poster"
                        >
                          <Maximize2 size={12} /> View Poster
                        </button>
                      )}
                      <button
                        onClick={() => setIndividualCourseModal(null)}
                        className="w-8 h-8 rounded-full bg-slate-950/80 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700/60 flex items-center justify-center transition-all cursor-pointer shadow-md hover:scale-105"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Bottom Badges on Image */}
                  <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between z-20">
                    <div className="flex items-center gap-2">
                      <span className="bg-slate-900/85 backdrop-blur-md text-slate-300 text-[10px] font-semibold px-2.5 py-0.5 rounded-lg border border-slate-700/60 flex items-center gap-1">
                        <Layers size={11} className="text-purple-400" /> {c.chapters?.length || 0} Lessons
                      </span>
                      <span className="bg-slate-900/85 backdrop-blur-md text-slate-300 text-[10px] font-semibold px-2.5 py-0.5 rounded-lg border border-slate-700/60 flex items-center gap-1">
                        <Video size={11} className="text-indigo-400" /> Full HD 1080p
                      </span>
                    </div>

                    {offer && (
                      <span className="bg-gradient-to-r from-red-500 to-rose-600 text-white font-black text-[10px] px-2.5 py-1 rounded-full shadow-lg border border-red-400/40 flex items-center gap-1 animate-pulse">
                        <Flame size={11} /> {offer.discountLabel}
                      </span>
                    )}
                  </div>
                </div>

                {/* Modal Body */}
                <div className="p-5 sm:p-6 space-y-4">
                  {/* Title & Description */}
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black text-white leading-tight mb-1.5 tracking-tight">
                      {c.title}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                      {c.description || "Master step-by-step resin art techniques, tools, and professional business strategies with high-definition lessons."}
                    </p>
                  </div>

                  {/* Validity Status Alert Card */}
                  {(() => {
                    const vInfo = getCourseValidityInfo(c);
                    if (vInfo.isExpired) {
                      return (
                        <div className="p-3.5 rounded-2xl bg-red-950/30 border border-red-500/40 flex items-start gap-3">
                          <div className="p-2 rounded-xl bg-red-500/20 text-red-400 shrink-0">
                            <AlertCircle size={18} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="text-xs font-black text-red-300">Previous Validity Expired</h4>
                            <p className="text-[11px] text-red-300/80 mt-0.5">
                              {vInfo.text}. Re-purchasing this masterclass activates another full validity period starting from today!
                            </p>
                          </div>
                        </div>
                      );
                    }
                    if (c.validityMonths && Number(c.validityMonths) > 0) {
                      const m = Number(c.validityMonths);
                      let label = `${m} Months`;
                      if (m === 1) label = "1 Month";
                      else if (m === 3) label = "3 Months";
                      else if (m === 6) label = "6 Months";
                      else if (m === 12) label = "1 Year";
                      else if (m === 36) label = "3 Years";

                      return (
                        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-indigo-950/40 to-purple-950/40 border border-indigo-500/30 flex items-start gap-3">
                          <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-300 shrink-0">
                            <Clock size={18} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="text-xs font-black text-indigo-200">{label} Course Validity</h4>
                              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                            </div>
                            <p className="text-[11px] text-slate-300 mt-0.5">
                              Validity begins on the day of student registration / purchase. Enjoy full unrestricted access to all lessons and study notes for {label}.
                            </p>
                          </div>
                        </div>
                      );
                    }
                    return (
                      <div className="p-3 rounded-2xl bg-emerald-950/25 border border-emerald-500/30 flex items-center gap-2.5">
                        <ShieldCheck size={16} className="text-emerald-400 shrink-0" />
                        <span className="text-[11px] font-bold text-emerald-300">
                          Permanent Lifetime Access Included
                        </span>
                      </div>
                    );
                  })()}

                  {/* Highlights Grid */}
                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
                        <PlayCircle size={15} />
                      </div>
                      <div className="min-w-0">
                        <div className="text-[11px] font-bold text-white leading-tight">Instant Unlock</div>
                        <div className="text-[10px] text-slate-400">Immediate access</div>
                      </div>
                    </div>
                    <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                        <Award size={15} />
                      </div>
                      <div className="min-w-0">
                        <div className="text-[11px] font-bold text-white leading-tight">Certification</div>
                        <div className="text-[10px] text-slate-400">Upon completion</div>
                      </div>
                    </div>
                    <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                        <FileText size={15} />
                      </div>
                      <div className="min-w-0">
                        <div className="text-[11px] font-bold text-white leading-tight">Study Guides</div>
                        <div className="text-[10px] text-slate-400">Formulas &amp; notes</div>
                      </div>
                    </div>
                    <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                        <Zap size={15} />
                      </div>
                      <div className="min-w-0">
                        <div className="text-[11px] font-bold text-white leading-tight">Multi-Device</div>
                        <div className="text-[10px] text-slate-400">Web &amp; Mobile app</div>
                      </div>
                    </div>
                  </div>

                  {/* Pricing Box */}
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/40 via-slate-900 to-indigo-950/40 border border-purple-500/30 flex items-center justify-between shadow-inner">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block mb-0.5">
                        Course Investment
                      </span>
                      <div className="flex items-baseline gap-2.5">
                        <span className="text-3xl font-black text-amber-400 font-mono tracking-tight">
                          {finalPriceStr}
                        </span>
                        {offer && (
                          <span className="text-xs text-slate-500 line-through font-mono">
                            {originalPriceStr}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <span className="text-[10px] text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-1 rounded-lg font-black uppercase tracking-wider inline-block">
                        One-Time Fee
                      </span>
                      {offer && (
                        <div className="text-[10px] text-red-400 font-bold">
                          Save {offer.discountLabel}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-2.5 pt-1">
                    <button
                      onClick={() => handlePurchaseIndividualCourse(c)}
                      disabled={isProcessingPayment}
                      className="w-full py-4 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-sm rounded-2xl shadow-xl shadow-purple-900/40 hover:shadow-purple-900/60 transition-all hover:scale-[1.02] active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      <Sparkles size={16} className="text-amber-300" />
                      <span>
                        {isProcessingPayment
                          ? "Connecting to Razorpay..."
                          : isCourseExpired(c)
                          ? `Re-purchase & Renew Access (${finalPriceStr})`
                          : `Unlock Masterclass Now (${finalPriceStr})`}
                      </span>
                    </button>

                    <button
                      onClick={() => setIndividualCourseModal(null)}
                      disabled={isProcessingPayment}
                      className="w-full py-2.5 text-slate-400 hover:text-white text-xs font-semibold hover:bg-slate-900 rounded-xl transition-colors cursor-pointer"
                    >
                      Close Window
                    </button>
                  </div>

                  {/* Trust Footer */}
                  <div className="pt-1 border-t border-slate-900 flex items-center justify-center gap-4 text-[10px] text-slate-500 font-medium">
                    <span className="flex items-center gap-1">
                      <ShieldCheck size={11} className="text-emerald-500" /> 256-Bit SSL Secured
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Zap size={11} className="text-amber-500" /> Instant Access
                    </span>
                    <span>•</span>
                    <span>Razorpay Verified</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        );
      })()}

      {/* Full Flyer Lightbox Modal */}
      {previewFlyerModal && (
        <div 
          className="fixed inset-0 z-[120] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6"
          onClick={() => setPreviewFlyerModal(null)}
        >
          <div 
            className="relative max-w-4xl max-h-[92vh] flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setPreviewFlyerModal(null)}
              className="absolute -top-12 right-0 sm:-right-10 w-9 h-9 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-lg border border-slate-700"
              title="Close Preview"
            >
              <X size={18} />
            </button>
            <div className="rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-950 max-h-[85vh] flex items-center justify-center p-2">
              <img 
                src={previewFlyerModal} 
                alt="Course Flyer" 
                className="max-h-[82vh] w-auto max-w-full object-contain rounded-xl select-none" 
              />
            </div>
          </div>
        </div>
      )}

      {/* Purchase / Upgrade Tier Modal */}
      <TierPurchaseModal
        isOpen={purchaseModal.isOpen}
        onClose={() => setPurchaseModal({ isOpen: false, tierCode: "L1" })}
        targetTierCode={purchaseModal.tierCode}
        currentLevel={getLevelName()}
        onUpgradeSuccess={fetchStudentData}
      />
    </div>
  );
}
