"use client";

import React, { useEffect, useState, useRef } from "react";
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
  Crown,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { TierPurchaseModal } from "@/components/membership/TierPurchaseModal";
import { getComputedTierPricing, getCourseResolvedOffer } from "@/utils/tierPricing";
import { processRazorpayPayment } from "@/utils/razorpay";

import { API_BASE_URL, getImageUrl } from "@/config/api";

const getFileUrl = (url?: string) => {
  if (!url) return "";
  let clean = url.replace(/\\/g, "/").trim();
  if (clean.startsWith("http://") || clean.startsWith("https://") || clean.startsWith("data:")) return clean;
  if (!clean.startsWith("/")) clean = "/" + clean;
  if (
    clean.startsWith("/images/") ||
    clean.startsWith("/icons/") ||
    clean.startsWith("/fonts/") ||
    clean.startsWith("/svg/")
  ) {
    return clean;
  }
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
  L0: { name: "Fast Track", price: "₹499", color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-300" },
  L1: { name: "Explore Membership", price: "₹4,999", color: "text-blue-700", bg: "bg-blue-50", border: "border-blue-300" },
  L2: { name: "Master Membership", price: "₹19,999", color: "text-amber-700", bg: "bg-amber-50", border: "border-amber-300" },
  L3: { name: "Renaissance Certification", price: "₹59,999", color: "text-cyan-700", bg: "bg-cyan-50", border: "border-cyan-300" },
  "L3+": { name: "Masters Club", price: "Exclusive", color: "text-purple-700", bg: "bg-purple-50", border: "border-purple-300" },
};

const LEVEL_HIERARCHY: Record<string, number> = {
  GENERAL: -1,
  L0: 0,
  L1: 1,
  L2: 2,
  L3: 3,
  "L3+": 4,
};

const TIER_CARD_UI: Record<string, {
  levelTag: string;
  levelIcon: React.ElementType;
  tagColor: string;
  validityText: string;
  defaultModules: string[];
  fallbackImage: string;
  hasOffer?: boolean;
  hasEmi?: boolean;
}> = {
  L0: {
    levelTag: "LEVEL 0",
    levelIcon: Zap,
    tagColor: "text-emerald-600",
    validityText: "SINGLE VALIDITY • 3 YEARS ACCESS",
    defaultModules: [
      "Resin Fundamentals",
      "The Right Approach to Resin Art",
      "Student Success Stories & Their Roadmap Ahead",
    ],
    fallbackImage: "/images/student-art/real-art-1.jpg",
  },
  L1: {
    levelTag: "LEVEL 1",
    levelIcon: Award,
    tagColor: "text-blue-600",
    validityText: "LIFETIME VALIDITY • LIFETIME ACCESS",
    defaultModules: [
      "Coasters, Fridge Magnets, Keychains",
      "Marbling Technique",
      "Evil Eye / Iris",
    ],
    fallbackImage: "/images/student-art/real-art-23.jpg",
    hasOffer: true,
  },
  L2: {
    levelTag: "LEVEL 2",
    levelIcon: Trophy,
    tagColor: "text-amber-600",
    validityText: "GENERAL • LIFETIME ACCESS",
    defaultModules: [
      "Geode Art",
      "Vein Effect",
      "Tree of Life Clock",
    ],
    fallbackImage: "/images/student-art/real-art-2.jpg",
  },
  L3: {
    levelTag: "LEVEL 3",
    levelIcon: Sparkles,
    tagColor: "text-teal-600",
    validityText: "GENERAL • LIFETIME ACCESS",
    defaultModules: [
      "3D Photo Resin Art",
      "Wood and Resin Tables",
      "Resin Jewellery",
    ],
    fallbackImage: "/images/student-art/real-art-14.jpg",
    hasEmi: true,
  },
};

export const DEFAULT_STANDALONE_COURSES: any[] = [];

function formatEmbedUrl(url: string): string {
  if (!url) return "";
  try {
    if (url.includes("youtube.com/watch")) {
      const fullUrl = url.startsWith("http") ? url : `https://${url}`;
      const videoId = new URL(fullUrl).searchParams.get("v");
      if (videoId) return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    }
  } catch { }
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
  const [mobileCourseView, setMobileCourseView] = useState<"list" | "detail">("detail");

  const handleOpenCourse = (course: any) => {
    setSelectedCourse(course);
    setCourseModalTab("lessons");
    setMobileCourseView("detail");
    if (course.levelCode && course.levelCode !== "NONE") {
      setExpandedLevel(course.levelCode.toUpperCase());
    } else if (!expandedLevel) {
      setExpandedLevel("STANDALONE");
    }
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
        .catch(() => { });
    }
  };

  const handleOpenLevelModal = (lvl: string) => {
    setExpandedLevel(lvl);
    setMobileCourseView("detail");
    const lvlCourses = courses.filter(
      (c) =>
        c.levelCode &&
        c.levelCode.toUpperCase() !== "NONE" &&
        c.levelCode.toUpperCase() !== "STANDALONE" &&
        c.levelCode.toUpperCase() === lvl.toUpperCase()
    );
    if (lvlCourses.length > 0) {
      const firstUnlocked = lvlCourses.find(c => isCourseUnlocked(c)) || lvlCourses[0];
      handleOpenCourse(firstUnlocked);
    } else {
      setSelectedCourse(null);
    }
  };

  const handleCloseUnifiedModal = () => {
    setExpandedLevel(null);
    setSelectedCourse(null);
    setMobileCourseView("detail");
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

  const [levelTiers, setLevelTiers] = useState<any[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const cached = sessionStorage.getItem("cached_level_tiers");
        if (cached) return JSON.parse(cached);
      } catch (_) { }
    }
    return [];
  });
  const [campaignOffers, setCampaignOffers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStudentData = () => {
    setIsLoading(true);

    // Fetch dynamic level tiers from admin
    fetch(`${API_BASE_URL}/dashboard/levels`, { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setLevelTiers(data);
          try {
            sessionStorage.setItem("cached_level_tiers", JSON.stringify(data));
          } catch (_) { }
        }
      })
      .catch(err => console.error("Error fetching level tiers", err));

    // Fetch active offers
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
          .catch(() => { });
      });

    // Unconditionally fetch public & enrolled courses from backend
    fetch(`${API_BASE_URL}/courses`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setCourses(data);
      })
      .catch(err => console.error("Error fetching courses", err))
      .finally(() => {
        setTimeout(() => setIsLoading(false), 300);
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
          if (Array.isArray(data.levelTiers) && data.levelTiers.length > 0) {
            setLevelTiers(data.levelTiers);
            try {
              sessionStorage.setItem("cached_level_tiers", JSON.stringify(data.levelTiers));
            } catch (_) { }
          }
        }
      })
      .catch(err => console.error("Error fetching stats", err));
  };

  useEffect(() => {
    fetchStudentData();
  }, [token]);

  // Auto-open tier purchase modal when redirected from QR code with ?unlock=L1/L2/L3
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const unlockParam = params.get("unlock");
      if (unlockParam) {
        const code = unlockParam.trim().toUpperCase();
        setPurchaseModal({
          isOpen: true,
          tierCode: code,
        });
      }
    }
  }, []);

  const hasAutoOpenedCourseRef = useRef(false);

  // Auto-open course purchase modal or open lesson viewer when redirected from Course QR code (?courseId=... / ?course=... / ?unlockCourse=...)
  useEffect(() => {
    if (typeof window !== "undefined" && courses.length > 0 && !hasAutoOpenedCourseRef.current) {
      const params = new URLSearchParams(window.location.search);
      const courseParam = params.get("courseId") || params.get("course") || params.get("unlockCourse");
      if (courseParam) {
        const cleanCourseId = courseParam.trim().toLowerCase();
        const matched = courses.find(
          (c: any) =>
            String(c.id).toLowerCase() === cleanCourseId ||
            (c.title && c.title.toLowerCase() === cleanCourseId)
        );
        if (matched) {
          hasAutoOpenedCourseRef.current = true;
          if (isCourseUnlocked(matched)) {
            handleOpenCourse(matched);
          } else {
            setIndividualCourseModal(matched);
          }
        }
      }
    }
  }, [courses, stats]);

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
    const code = (lvlCode || "").toUpperCase();
    if (code === "L0") return true;
    const matchedTier = levelTiers.find((t: any) => (t.code || "").toUpperCase() === code);
    const requiredNum = matchedTier?.order !== undefined ? matchedTier.order : (LEVEL_HIERARCHY[code] ?? 0);
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

  const hasHandledLevelActionRef = useRef(false);

  // Smoothly scroll to level card & open modal if redirected with ?level=... or ?search=...
  useEffect(() => {
    if (typeof window !== "undefined" && !hasHandledLevelActionRef.current) {
      const params = new URLSearchParams(window.location.search);
      const lvlParam =
        params.get("level") ||
        params.get("tier") ||
        params.get("search") ||
        params.get("q");
      const action = params.get("action");

      if (lvlParam) {
        const clean = lvlParam.trim().toUpperCase();
        let matchedLvl = "";
        if (clean.includes("L0") || clean.includes("FAST") || clean.includes("FUNDAMENTAL")) matchedLvl = "L0";
        else if (clean.includes("L1") || clean.includes("EXPLORE") || clean.includes("SILVER")) matchedLvl = "L1";
        else if (clean.includes("L2") || clean.includes("MASTER") || clean.includes("GOLD")) matchedLvl = "L2";
        else if (clean.includes("L3") || clean.includes("DIAMOND") || clean.includes("RENAISSANCE") || clean.includes("MASTERS")) matchedLvl = "L3";

        if (matchedLvl) {
          hasHandledLevelActionRef.current = true;
          // Step 1: Staged smooth scroll after page render
          setTimeout(() => {
            const cardEl = document.getElementById(`level-card-${matchedLvl}`);
            if (cardEl) {
              cardEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
              // Step 2: Smooth highlight and gentle scale transition
              cardEl.classList.add(
                'ring-4',
                'ring-[#c4431d]',
                'ring-offset-4',
                'shadow-2xl',
                'scale-[1.02]',
                'transition-all',
                'duration-700'
              );
              setTimeout(() => {
                cardEl.classList.remove(
                  'ring-4',
                  'ring-[#c4431d]',
                  'ring-offset-4',
                  'shadow-2xl',
                  'scale-[1.02]'
                );
              }, 4000);
            }

            // Step 3: Smoothly open the next step modal after scrolling finishes comfortably
            if (action === 'open') {
              setTimeout(() => {
                if (isLevelUnlocked(matchedLvl)) {
                  handleOpenLevelModal(matchedLvl);
                } else {
                  setPurchaseModal({ isOpen: true, tierCode: matchedLvl });
                }
              }, 900);
            }
          }, 500);
        }
      }
    }
  }, [courses, stats]);

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

  const serverStandaloneCourses = courses
    .filter((c) => {
      // If course is disabled by admin, hide from student catalog unless student already unlocked it
      if (c.isPublished === false && !isCourseUnlocked(c)) {
        return false;
      }
      // Standalone individual courses only (not part of bundle levels L0, L1, L2, L3)
      return !c.levelCode || c.levelCode.toUpperCase() === "NONE" || c.levelCode.toUpperCase() === "STANDALONE";
    })
    .sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0));

  // Dynamic courses directly from admin backend
  const displayedCourses = serverStandaloneCourses;

  return (
    <div
      className="min-h-screen bg-[#faf8f5] text-stone-900 flex flex-col font-sans transition-colors lg:pl-64"
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

      <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <header className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            {/*
            <div className="flex items-center gap-1.5 text-xs text-stone-500 mb-1 font-medium">
              <span>Curriculum</span>
              <span className="text-stone-300">/</span>
              <span className="text-stone-700 font-medium">Course Library &amp; Video Modules</span>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-stone-900 tracking-tight">
              Course Library &amp; Video Modules
            </h1>
            <p className="text-stone-500 text-xs sm:text-sm mt-0.5">
              Your step-by-step masterclass library structured from foundational casting (L0) to commercial masterworks (L3).
            </p>
            */}
          </div>

          <button
            onClick={() => setPurchaseModal({ isOpen: true, tierCode: studentLevelCode === "L0" ? "L1" : studentLevelCode === "L1" ? "L2" : "L3" })}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-[#942008] via-[#c4431d] to-[#ea580c] hover:opacity-95 text-white font-bold text-xs transition-all hover:scale-105 shadow-md shadow-[#c4431d]/25 cursor-pointer self-start md:self-auto"
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
          <div className="mb-6 p-5 rounded-3xl bg-rose-50 border-2 border-rose-300 text-rose-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xl">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 shrink-0 animate-pulse">
                <Lock size={22} />
              </div>
              <div>
                <h3 className="text-sm font-black text-stone-900 flex items-center gap-2">
                  🔒 Level Access Expired (Single Validity Limit Reached)
                </h3>
                <p className="text-xs text-stone-600 mt-0.5">
                  Your purchase validity expired on {stats.membershipExpiresAt ? new Date(stats.membershipExpiresAt).toLocaleDateString("en-IN") : "recently"}. Re-enroll or upgrade to Lifetime Validity to resume video lessons.
                </p>
              </div>
            </div>
            <button
              onClick={() => setPurchaseModal({ isOpen: true, tierCode: studentLevelCode })}
              className="px-5 py-2.5 bg-gradient-to-r from-[#942008] via-[#c4431d] to-[#ea580c] hover:opacity-95 text-white font-bold rounded-xl text-xs shadow-md shadow-[#c4431d]/20 transition-all hover:scale-105 cursor-pointer whitespace-nowrap"
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

        {isLoading ? (
          <div className="space-y-12">
            <div className="space-y-6">
              <div className="h-12 w-full rounded-2xl shimmer-box" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-col-4 gap-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="rounded-3xl border border-[#ecdccb] bg-white/95 p-6 space-y-4 shadow-sm">
                    <div className="w-12 h-12 rounded-2xl shimmer-box" />
                    <div className="w-3/4 h-6 rounded-lg shimmer-box" />
                    <div className="w-full h-16 rounded-xl shimmer-box" />
                    <div className="w-full h-10 rounded-xl shimmer-box" />
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <div className="w-64 h-7 rounded-xl shimmer-box" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-col-4 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="rounded-3xl border border-[#ecdccb] bg-white/95 p-5 space-y-4 shadow-sm">
                    <div className="w-full aspect-video rounded-2xl shimmer-box" />
                    <div className="w-3/4 h-5 rounded-lg shimmer-box" />
                    <div className="w-1/2 h-4 rounded-lg shimmer-box" />
                    <div className="w-full h-10 rounded-xl shimmer-box" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Primary 4 Membership Level Cards Section */}
            <div className="space-y-6 mb-12">
              {/* <div className="p-4 rounded-2xl bg-white/95 border border-[#ecdccb] shadow-[0_10px_30px_-12px_rgba(90,55,20,0.08)] flex items-center gap-3 text-xs text-stone-600">
            <Sparkles size={18} className="text-[#942008] shrink-0" />
            <span>
              <strong>Membership Level Purchase Flow:</strong> Students purchase complete <strong>Membership Levels</strong> (L0, L1, L2, L3) — purchasing a level unlocks all masterclasses, tools, and community perks included in that level! Click on any Level Card to inspect its included courses.
            </span>
          </div> */}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
                {(() => {
                  const displayTiers = levelTiers
                    .filter((t: any) => {
                      const code = (t.code || t.levelCode || "").toUpperCase();
                      const isUnlocked = isLevelUnlocked(code);
                      if (t.isPublished === false && !isUnlocked) return false;
                      return true;
                    })
                    .sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0));

                  return displayTiers.map((tier: any) => {
                    const lvl = (tier.code || tier.levelCode || "L0").toUpperCase();
                    const cfg = LEVEL_TIER_CONFIG[lvl] || {
                      name: tier.name || lvl,
                      price: tier.price || "₹499",
                      color: "text-amber-700",
                      bg: "bg-amber-50",
                      border: "border-amber-300",
                    };
                    const tierPricing = getComputedTierPricing(lvl, levelTiers, campaignOffers);
                    const isUnlocked = isLevelUnlocked(lvl);
                    const isCurrent = studentLevelCode === lvl;
                    const courseCount = courses.filter(
                      (c) =>
                        c.levelCode &&
                        c.levelCode.toUpperCase() !== "NONE" &&
                        c.levelCode.toUpperCase() !== "STANDALONE" &&
                        c.levelCode.toUpperCase() === lvl
                    ).length;
                    const liveLevel = tier;

                    const defaultName = lvl === "L0" ? "Fast Track" : lvl === "L1" ? "Explore Membership" : lvl === "L2" ? "Master Membership" : "Renaissance Certification";
                    const levelDisplayName = tierPricing.name || liveLevel?.name || cfg.name || defaultName;
                    const levelDisplayDesc = liveLevel?.description || (
                      lvl === "L0" ? "Resin fundamentals, safety protocols, and foundational finishing techniques." :
                        lvl === "L1" ? "Coasters, fridge magnets, marbling, lotus pond, and beach theme creations." :
                          lvl === "L2" ? "Geode art, vein effect, Tree of Life clocks, and 3D wave masterclasses." :
                            "River wood tables, bridal varmala preservation, 3D photo art, concrete candles, and business scaling."
                    );

                    const liveThumb = liveLevel?.thumbnail || liveLevel?.image || liveLevel?.bannerImage;
                    const cardImage = liveThumb ? getImageUrl(liveThumb) : null;

                    const moduleCount = courseCount;

                    const topBadgeStyle: Record<string, string> = {
                      L0: "bg-[#c4431d] text-white",
                      L1: "bg-[#0284c7] text-white",
                      L2: "bg-[#d97706] text-white",
                      L3: "bg-[#0284c7] text-white",
                    };

                    const bodyBadgeStyle: Record<string, string> = {
                      L0: "bg-[#fde5d6] text-[#942008] border-[#f5ded0]",
                      L1: "bg-[#e0f2fe] text-[#0284c7] border-[#bae6fd]",
                      L2: "bg-[#fef3c7] text-[#d97706] border-[#fde68a]",
                      L3: "bg-[#e0f2fe] text-[#0284c7] border-[#bae6fd]",
                    };

                    return (
                      <div
                        key={lvl}
                        id={`level-card-${lvl}`}
                        className={`rounded-3xl bg-white flex flex-col justify-between border transition-all overflow-hidden shadow-sm hover:shadow-md scroll-mt-24 ${isCurrent
                          ? "border-2 border-[#c4431d]"
                          : "border-stone-200/90 hover:border-stone-300"
                          }`}
                      >
                        {/* Level Banner Image Thumbnail */}
                        <div className="relative w-full h-44 bg-[#faf8f5] overflow-hidden border-b border-stone-200/80 group/thumb">
                          {cardImage ? (
                            <img
                              src={cardImage}
                              alt={levelDisplayName}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover/thumb:scale-105"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-stone-100 via-stone-200 to-amber-50 flex flex-col items-center justify-center gap-1.5 p-4 text-center">
                              <BookOpen size={36} className="text-[#942008]/40" />
                              <span className="text-xs font-bold text-stone-600">{levelDisplayName}</span>
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-stone-900/30 via-transparent to-transparent pointer-events-none" />
                          <div className="absolute top-3 left-3">
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider shadow-sm ${topBadgeStyle[lvl] || "bg-[#c4431d] text-white"}`}>
                              {lvl} Tier
                            </span>
                          </div>
                          {isCurrent && (
                            <div className="absolute top-3 right-3">
                              <span className="px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-[#942008] text-white shadow-sm flex items-center gap-1">
                                <Check size={11} className="stroke-[3]" /> Active Tier
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="p-5 flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center justify-between gap-2 mb-2">
                              <span className={`px-3 py-0.5 rounded-full text-xs font-black uppercase tracking-wider border ${bodyBadgeStyle[lvl] || cfg.bg + " " + cfg.color + " " + cfg.border}`}>
                                {lvl}
                              </span>
                              <div className="flex flex-col items-end">
                                {tierPricing.hasOffer ? (
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-xs text-stone-400 line-through font-mono">{tierPricing.originalPrice}</span>
                                    <span className="text-base font-black text-stone-900 font-mono">{tierPricing.finalPrice}</span>
                                    <span className="bg-gradient-to-r from-red-500 to-rose-600 text-white font-black text-xs px-1.5 py-0.5 rounded shadow-sm">
                                      {tierPricing.discountLabel}
                                    </span>
                                  </div>
                                ) : (
                                  <span className="text-base font-black text-stone-900 font-mono">{tierPricing.finalPrice}</span>
                                )}
                              </div>
                            </div>

                            {/* Dynamic Category & Validity Tag */}
                            {(liveLevel?.category || (liveLevel?.validityDays !== undefined && liveLevel?.validityDays !== null)) && (
                              <div className="flex items-center gap-1.5 text-[0.6875rem] font-bold text-stone-400 uppercase tracking-wider mb-1">
                                {liveLevel?.category && <span>{liveLevel.category}</span>}
                                {liveLevel?.category && (liveLevel?.validityDays !== undefined && liveLevel?.validityDays !== null) && <span>•</span>}
                                {liveLevel?.validityDays !== undefined && liveLevel?.validityDays !== null && (
                                  <span>
                                    {liveLevel.validityDays === 0
                                      ? "Lifetime Access"
                                      : liveLevel.validityDays >= 365
                                        ? `${Math.round(liveLevel.validityDays / 365)} Years Access`
                                        : `${liveLevel.validityDays} Days Access`}
                                  </span>
                                )}
                              </div>
                            )}

                            <h3 className="text-lg font-black text-stone-900 mt-1 mb-1">{levelDisplayName}</h3>
                            <p className="text-xs text-stone-500 mb-3 leading-relaxed line-clamp-2 min-h-[34px]">
                              {levelDisplayDesc}
                            </p>

                            {/* Dynamic EMI Tag */}
                            {liveLevel?.installmentsEnabled && (
                              <div className="mb-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
                                <span>💳</span>
                                <span>EMI Available ({liveLevel.totalInstallments || 3} parts)</span>
                              </div>
                            )}

                            {/* Dynamic Feature Highlights */}
                            <div className="space-y-2 mb-5 text-xs text-stone-700">
                              <div
                                onClick={() => handleOpenLevelModal(lvl)}
                                className="flex items-center gap-2 cursor-pointer group/mod"
                                title="Click to view course modules"
                              >
                                <CheckCircle2 size={14} className="text-[#c4431d] shrink-0" />
                                <span className="group-hover/mod:text-[#c4431d] transition-colors font-semibold">
                                  Includes {moduleCount} Masterclass Modules
                                </span>
                              </div>
                              {(() => {
                                const rawDesc = (liveLevel?.description || "").trim();
                                const points = rawDesc
                                  .split(/\r?\n|•|;/)
                                  .map((p: string) => p.replace(/^[-*]\s*/, "").trim())
                                  .filter((p: string) => p.length > 2);
                                const parsedPoints = points.length > 1
                                  ? points
                                  : points.length === 1 && (rawDesc.includes(",") || rawDesc.includes(" and "))
                                    ? rawDesc.replace(/\band\b/gi, ",").split(",").map((p: string) => p.trim()).filter((p: string) => p.length > 2)
                                    : points;

                                return parsedPoints.slice(0, 3).map((pt: string, pIdx: number) => (
                                  <div key={pIdx} className="flex items-center gap-2">
                                    <CheckCircle2 size={14} className="text-[#c4431d] shrink-0" />
                                    <span className="line-clamp-1">{pt}</span>
                                  </div>
                                ));
                              })()}
                            </div>
                          </div>

                          <div>
                            {isCurrent ? (
                              <button
                                type="button"
                                onClick={() => handleOpenLevelModal(lvl)}
                                className="w-full py-3 bg-gradient-to-r from-[#b53310] via-[#c4431d] to-[#ea580c] hover:opacity-95 text-white font-black rounded-2xl text-xs text-center flex items-center justify-center gap-1.5 shadow-md shadow-orange-950/15 transition-all cursor-pointer hover:scale-[1.01]"
                              >
                                <span>View Included Courses ({moduleCount}) →</span>
                              </button>
                            ) : isUnlocked ? (
                              <button
                                type="button"
                                onClick={() => handleOpenLevelModal(lvl)}
                                className="w-full py-3 bg-[#fde5d6] hover:bg-[#fbdcd0] text-[#942008] border border-[#f0c2a4] rounded-2xl text-xs font-black text-center flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer hover:scale-[1.01]"
                              >
                                <span>View Included Courses ({moduleCount}) →</span>
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setPurchaseModal({ isOpen: true, tierCode: lvl })}
                                className="w-full py-3 bg-gradient-to-r from-[#b53310] via-[#c4431d] to-[#ea580c] hover:opacity-95 text-white font-bold rounded-2xl text-xs text-center flex items-center justify-center gap-1.5 transition-all shadow-md shadow-orange-950/10 hover:scale-[1.01] cursor-pointer"
                              >
                                <span>Unlock {levelDisplayName} ({tierPricing.hasOffer ? `Offer: ${tierPricing.finalPrice}` : tierPricing.finalPrice}) →</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
            </div>

            {/* Unified Single Course & Tier Modal (Image 3 UI) */}
            {(expandedLevel || selectedCourse) && (() => {
              const currentLvl = (expandedLevel || selectedCourse?.levelCode || "L0").toUpperCase();
              const isStandaloneCourse =
                currentLvl === "STANDALONE" ||
                !selectedCourse?.levelCode ||
                selectedCourse?.levelCode?.toUpperCase() === "NONE" ||
                selectedCourse?.levelCode?.toUpperCase() === "STANDALONE";

              const matchedTier = levelTiers.find((t: any) => (t.code || "").toUpperCase() === currentLvl);
              const cfg = LEVEL_TIER_CONFIG[currentLvl] || LEVEL_TIER_CONFIG["L0"];
              const tierPricing = getComputedTierPricing(currentLvl, levelTiers, campaignOffers);
              const tierName = isStandaloneCourse
                ? "Standalone Masterclass"
                : (matchedTier?.name || tierPricing.name || cfg?.name || `${currentLvl} Membership`);

              let levelCourses = isStandaloneCourse
                ? (selectedCourse ? [selectedCourse] : courses.filter(c => !c.levelCode || c.levelCode.toUpperCase() === "NONE" || c.levelCode.toUpperCase() === "STANDALONE"))
                : courses.filter(
                  c =>
                    c.levelCode &&
                    c.levelCode.toUpperCase() !== "NONE" &&
                    c.levelCode.toUpperCase() !== "STANDALONE" &&
                    c.levelCode.toUpperCase() === currentLvl
                );

              levelCourses.sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0));

              const activeCourse = selectedCourse || levelCourses[0] || null;
              const isUnlocked = activeCourse ? isCourseUnlocked(activeCourse) : isLevelUnlocked(currentLvl);

              const getProgress = (c: any) => {
                const enrolled = getCourseEnrollment(c);
                const uc = enrolled?.UserCourse || enrolled?.userCourse || c?.UserCourse;
                if (uc && typeof uc.progress === "number") return uc.progress;
                if (typeof c.progress === "number") return c.progress;
                return 0;
              };

              const cleanCourseTitle = activeCourse?.title ? activeCourse.title.replace(/^\d+[\.\:\s\-]+/, "").trim() : "";

              return (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-[#faf8f5]/85 backdrop-blur-md">
                  <motion.div
                    initial={{ scale: 0.96, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.96, opacity: 0 }}
                    className="bg-white border border-[#ecdccb] shadow-[0_20px_50px_-12px_rgba(90,55,20,0.12)] rounded-3xl w-full max-w-6xl max-h-[92vh] sm:max-h-[88vh] flex flex-col shadow-2xl relative overflow-hidden"
                  >
                    {/* Top Close Button */}
                    <button
                      onClick={handleCloseUnifiedModal}
                      className="absolute top-4 right-4 z-30 w-9 h-9 rounded-full bg-stone-100/90 hover:bg-stone-200 text-stone-500 hover:text-stone-900 flex items-center justify-center transition-all cursor-pointer shadow-sm"
                      aria-label="Close modal"
                    >
                      <X size={18} />
                    </button>

                    {/* Modal Content Grid */}
                    <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-0 lg:gap-6 p-4 sm:p-6">

                      {/* ── LEFT COLUMN: Course Navigation List (Tier Mode) or Chapter/Lesson List (Standalone Mode) ── */}
                      <div className={`lg:col-span-4 lg:border-r lg:border-stone-200/80 lg:pr-6 space-y-3 ${mobileCourseView === "detail" ? "hidden lg:block" : "block"
                        }`}>
                        {isStandaloneCourse ? (
                          <>
                            <div className="flex items-center justify-between gap-2 mb-3">
                              <div>
                                <h3 className="font-serif text-base sm:text-lg font-black text-stone-900">
                                  Course Lessons ({activeCourse?.chapters?.length || 0})
                                </h3>
                                <p className="text-[0.6875rem] text-stone-500 line-clamp-1">
                                  {cleanCourseTitle || activeCourse?.title}
                                </p>
                              </div>
                            </div>

                            <div className="space-y-2.5 overflow-y-auto max-h-[70vh] pr-1">
                              {(!activeCourse?.chapters || activeCourse.chapters.length === 0) ? (
                                <div className="p-8 text-center bg-stone-50/70 rounded-2xl border border-dashed border-stone-200">
                                  <PlayCircle className="w-8 h-8 mx-auto text-stone-300 mb-2" />
                                  <p className="text-xs font-bold text-stone-700">No Video Lessons Yet</p>
                                  <p className="text-[0.6875rem] text-stone-400 mt-1">Lessons for this standalone course will appear once published by admin.</p>
                                </div>
                              ) : (
                                activeCourse.chapters.map((chapter: any, idx: number) => {
                                  const isSelected = activeVideoLesson?.title === chapter.title;
                                  return (
                                    <div
                                      key={chapter.id || idx}
                                      onClick={() => {
                                        if (isUnlocked && chapter.videoUrl) {
                                          setActiveVideoLesson({ title: chapter.title, videoUrl: chapter.videoUrl });
                                        }
                                        setCourseModalTab("lessons");
                                        setMobileCourseView("detail");
                                      }}
                                      className={`p-3 rounded-2xl flex items-center justify-between gap-3 transition-all ${isUnlocked && chapter.videoUrl ? "cursor-pointer" : "cursor-default"
                                        } ${isSelected
                                          ? "border-2 border-[#f0c2a4] bg-[#fff8f4] shadow-xs"
                                          : "border border-stone-200/80 bg-white hover:bg-stone-50/80 hover:border-stone-300"
                                        }`}
                                    >
                                      {/* Number badge */}
                                      <div className="w-8 h-8 rounded-full bg-[#fde5d6] text-[#942008] font-bold text-xs flex items-center justify-center shrink-0">
                                        {idx + 1}
                                      </div>

                                      {/* Title & Info */}
                                      <div className="min-w-0 flex-1">
                                        <h4 className={`text-xs sm:text-sm font-bold leading-snug line-clamp-2 ${isSelected ? "text-stone-950 font-black" : "text-stone-800"
                                          }`}>
                                          {chapter.title?.match(/^Lesson/i) ? chapter.title : `Lesson ${idx + 1}: ${chapter.title || "Lesson"}`}
                                        </h4>
                                        <div className="flex items-center gap-2 mt-1">
                                          <span className="text-teal-600 font-bold text-[0.6875rem] flex items-center gap-1">
                                            <Video size={11} className="text-teal-600" /> HD Video
                                          </span>
                                          {chapter.duration && (
                                            <span className="text-stone-400 text-[0.6875rem] font-mono">
                                              • {chapter.duration}
                                            </span>
                                          )}
                                          {chapter.pdfUrl && (
                                            <span className="text-blue-600 font-semibold text-[0.6875rem] flex items-center gap-1">
                                              • <FileText size={10} /> Notes
                                            </span>
                                          )}
                                        </div>
                                      </div>

                                      {/* Play / Lock icon */}
                                      <div className="shrink-0 pl-1">
                                        {isUnlocked ? (
                                          chapter.videoUrl ? (
                                            <PlayCircle size={18} className="text-[#c4431d]" />
                                          ) : (
                                            <span className="text-[0.6875rem] text-stone-400 font-medium">Coming Soon</span>
                                          )
                                        ) : (
                                          <Lock size={15} className="text-stone-400" />
                                        )}
                                      </div>
                                    </div>
                                  );
                                })
                              )}
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="flex items-center justify-between gap-2 mb-3">
                              <h3 className="font-serif text-base sm:text-lg font-black text-stone-900">
                                Courses in {tierName} ({levelCourses.length})
                              </h3>
                            </div>

                            <div className="space-y-2.5 overflow-y-auto max-h-[70vh] pr-1">
                              {levelCourses.length === 0 ? (
                                <div className="p-8 text-center bg-stone-50/70 rounded-2xl border border-dashed border-stone-200">
                                  <BookOpen className="w-8 h-8 mx-auto text-stone-300 mb-2" />
                                  <p className="text-xs font-bold text-stone-700">No Courses Added Yet</p>
                                  <p className="text-[0.6875rem] text-stone-400 mt-1">Courses for this level will appear once published by admin.</p>
                                </div>
                              ) : (
                                levelCourses.map((c: any, idx: number) => {
                                  const cUnlocked = isCourseUnlocked(c);
                                  const isSelected = activeCourse && (
                                    (activeCourse.id && c.id && String(activeCourse.id) === String(c.id)) ||
                                    activeCourse.title === c.title
                                  );
                                  const progress = getProgress(c);
                                  const cImg = c.image || c.flyerImage || matchedTier?.thumbnail || TIER_CARD_UI[c.levelCode || currentLvl]?.fallbackImage || "/images/journey/level-0.jpg";

                                  return (
                                    <div
                                      key={c.id || idx}
                                      onClick={() => {
                                        handleOpenCourse(c);
                                        setMobileCourseView("detail");
                                      }}
                                      className={`p-3 rounded-2xl flex items-center justify-between gap-3 cursor-pointer transition-all ${isSelected
                                        ? "border-2 border-[#f0c2a4] bg-[#fff8f4] shadow-xs"
                                        : "border border-stone-200/80 bg-white hover:bg-stone-50/80 hover:border-stone-300"
                                        }`}
                                    >
                                      {/* Course Thumbnail */}
                                      <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden bg-stone-100 shrink-0 border border-stone-200/70 shadow-xs">
                                        <img
                                          src={getImageUrl(cImg)}
                                          alt={c.title}
                                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                        />
                                      </div>

                                      {/* Course Title & Action */}
                                      <div className="min-w-0 flex-1">
                                        <h4 className={`text-xs sm:text-sm font-bold leading-snug line-clamp-2 ${isSelected ? "text-stone-950 font-black" : "text-stone-800"
                                          }`}>
                                          {c.title.match(/^\d+/) ? c.title : `${idx + 1}. ${c.title}`}
                                        </h4>

                                        {cUnlocked ? (
                                          <div className="mt-2 flex items-center">
                                            <span
                                              className={`inline-flex items-center gap-1.5 text-xs sm:text-xs font-bold px-2.5 py-1 rounded-xl transition-all ${isSelected
                                                ? "bg-emerald-600 text-white shadow-xs"
                                                : "bg-emerald-50 text-emerald-700 border border-emerald-200 group-hover:bg-emerald-100"
                                                }`}
                                            >
                                              <PlayCircle size={13} className={isSelected ? "text-white" : "text-emerald-600"} />
                                              <span>Open Course →</span>
                                            </span>
                                          </div>
                                        ) : (
                                          <div className="mt-2">
                                            <span className="bg-[#fde5d6] text-[#942008] text-xs sm:text-xs font-bold px-2.5 py-1 rounded-xl inline-flex items-center gap-1 border border-[#f5ded0]">
                                              <Lock size={11} /> Unlock at {c.levelCode && c.levelCode !== "NONE" ? c.levelCode : (currentLvl === "L0" ? "L1" : currentLvl)}
                                            </span>
                                          </div>
                                        )}
                                      </div>

                                      {/* Status Icon */}
                                      <div className="shrink-0 pl-1">
                                        {cUnlocked ? (
                                          <ChevronRight
                                            size={16}
                                            className={isSelected ? "text-[#c4431d]" : "text-stone-400"}
                                          />
                                        ) : (
                                          <Lock size={15} className="text-stone-400" />
                                        )}
                                      </div>
                                    </div>
                                  );
                                })
                              )}
                            </div>
                          </>
                        )}
                      </div>

                      {/* ── RIGHT COLUMN: Selected Course Details & Lessons ── */}
                      <div className={`lg:col-span-8 space-y-4 ${mobileCourseView === "list" ? "hidden lg:block" : "block"
                        }`}>
                        {/* Mobile Back Button */}
                        <button
                          onClick={() => setMobileCourseView("list")}
                          className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition-all mb-2 cursor-pointer"
                        >
                          <ArrowLeft size={14} /> Back to {isStandaloneCourse ? `Lessons (${activeCourse?.chapters?.length || 0})` : `Courses (${levelCourses.length})`}
                        </button>

                        {activeCourse ? (
                          <>
                            {/* Course Banner */}
                            <div className="relative w-full h-44 sm:h-52 rounded-2xl overflow-hidden border border-stone-200/80 bg-stone-900 shadow-sm shrink-0">
                              <img
                                src={getImageUrl(activeCourse.image || activeCourse.flyerImage || (!isStandaloneCourse ? (matchedTier?.thumbnail || TIER_CARD_UI[activeCourse.levelCode || currentLvl]?.fallbackImage) : null) || "/images/courses/powder-secrets-flyer.jpeg")}
                                alt={activeCourse.title}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/60 via-transparent to-transparent pointer-events-none" />

                              {/* Top-Left Badge on Banner */}
                              <div className="absolute top-3 left-3 z-10">
                                {isUnlocked ? (
                                  <span className="bg-emerald-600/90 text-white font-bold text-xs px-3 py-1 rounded-full shadow-sm backdrop-blur-sm flex items-center gap-1.5">
                                    <Crown size={12} className="text-white fill-white" /> Lifetime Access
                                  </span>
                                ) : (
                                  <span className="bg-[#942008]/90 text-white font-bold text-xs px-3 py-1 rounded-full shadow-sm backdrop-blur-sm flex items-center gap-1.5">
                                    <Lock size={12} /> Locked Course
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Course Title & Meta */}
                            <div>
                              <span className="px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-[#fde5d6] text-[#942008] border border-[#f5ded0] inline-block mb-1.5">
                                {isStandaloneCourse ? "STANDALONE MASTERCLASS" : `${activeCourse.levelCode || currentLvl} • ${tierName}`}
                              </span>
                              <h2 className="text-xl sm:text-2xl font-black text-stone-900 leading-tight mb-1">
                                {cleanCourseTitle || activeCourse.title}
                              </h2>
                              <p className="text-xs text-stone-500 leading-relaxed mb-4 line-clamp-2">
                                {activeCourse.description || "Introduction to epoxy resin, safety protocols, PPE, curing times, and essential toolkit setup."}
                              </p>
                            </div>

                            {/* Single Tab Bar - Exactly matching Images 1, 2, 3 */}
                            <div className="flex items-center gap-6 sm:gap-8 border-b border-stone-200/80 mb-4 overflow-x-auto no-scrollbar">
                              <button
                                type="button"
                                onClick={() => setCourseModalTab("lessons")}
                                className={`pb-2.5 text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer border-b-2 -mb-px shrink-0 ${courseModalTab === "lessons"
                                  ? "text-[#942008] border-[#942008]"
                                  : "text-stone-500 border-transparent hover:text-stone-800"
                                  }`}
                              >
                                <PlayCircle size={15} />
                                <span>Video Lessons ({activeCourse.chapters?.length || 0})</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => setCourseModalTab("assignments")}
                                className={`pb-2.5 text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer border-b-2 -mb-px shrink-0 ${courseModalTab === "assignments"
                                  ? "text-[#942008] border-[#942008]"
                                  : "text-stone-500 border-transparent hover:text-stone-800"
                                  }`}
                              >
                                <ClipboardList size={15} />
                                <span>Assignments & Tasks ({activeCourse.assignments?.length || 0})</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => setCourseModalTab("about")}
                                className={`pb-2.5 text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer border-b-2 -mb-px shrink-0 ${courseModalTab === "about"
                                  ? "text-[#942008] border-[#942008]"
                                  : "text-stone-500 border-transparent hover:text-stone-800"
                                  }`}
                              >
                                <Layers size={15} />
                                <span>Course Overview</span>
                              </button>
                            </div>

                            {/* Tab Content Body */}
                            <div>
                              {/* TAB 1: VIDEO LESSONS (Matching Image 1) */}
                              {courseModalTab === "lessons" && (
                                <div className="space-y-3">
                                  {activeCourse.chapters && activeCourse.chapters.length > 0 ? (
                                    activeCourse.chapters.map((chapter: any, idx: number) => (
                                      <div
                                        key={chapter.id || idx}
                                        className="rounded-2xl border border-stone-200/80 bg-stone-50/40 hover:bg-white p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 transition-all shadow-2xs"
                                      >
                                        <div className="flex items-center gap-3.5 min-w-0">
                                          {/* Circle Number Badge */}
                                          <div className="w-8 h-8 rounded-full bg-[#fde5d6] text-[#942008] font-bold text-xs flex items-center justify-center shrink-0">
                                            {idx + 1}
                                          </div>

                                          {/* Title & HD Tag */}
                                          <div className="min-w-0">
                                            <h4 className="font-bold text-xs sm:text-sm text-stone-900 leading-snug truncate">
                                              {chapter.title?.match(/^Lesson/i) ? chapter.title : `Lesson ${idx + 1}: ${chapter.title || "Lesson"}`}
                                            </h4>
                                            <div className="flex items-center gap-2 mt-1">
                                              <span className="text-teal-600 font-bold text-xs flex items-center gap-1">
                                                <Video size={12} className="text-teal-600" /> HD Video Lesson
                                              </span>
                                              {chapter.duration && (
                                                <span className="text-stone-400 text-xs font-mono">
                                                  • {chapter.duration}
                                                </span>
                                              )}
                                              {chapter.pdfUrl && (
                                                <span className="text-blue-600 font-semibold text-xs flex items-center gap-1">
                                                  • <FileText size={11} /> Notes
                                                </span>
                                              )}
                                            </div>
                                          </div>
                                        </div>

                                        {/* Action Button */}
                                        <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                                          {isUnlocked ? (
                                            <>
                                              {chapter.videoUrl && (
                                                <button
                                                  type="button"
                                                  onClick={() => setActiveVideoLesson({ title: chapter.title, videoUrl: chapter.videoUrl })}
                                                  className="bg-gradient-to-r from-[#b53310] via-[#c4431d] to-[#ea580c] hover:opacity-95 text-white font-bold text-xs py-2.5 px-4 rounded-xl flex items-center gap-1.5 shadow-sm cursor-pointer transition-all hover:scale-[1.02]"
                                                >
                                                  <PlayCircle size={14} />
                                                  <span>Watch Lesson</span>
                                                </button>
                                              )}
                                              {chapter.pdfUrl && (
                                                <a
                                                  href={getFileUrl(chapter.pdfUrl)}
                                                  target="_blank"
                                                  rel="noopener noreferrer"
                                                  className="px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-semibold transition-colors border border-stone-200 flex items-center gap-1.5"
                                                >
                                                  <FileText size={12} /> PDF
                                                </a>
                                              )}
                                            </>
                                          ) : (
                                            <button
                                              type="button"
                                              onClick={() => setPurchaseModal({ isOpen: true, tierCode: activeCourse.levelCode || currentLvl })}
                                              className="bg-stone-100 hover:bg-[#fde5d6] text-stone-700 hover:text-[#942008] border border-stone-200 hover:border-[#f5ded0] text-xs font-bold py-2.5 px-4 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                                            >
                                              <Lock size={12} /> Unlock
                                            </button>
                                          )}
                                        </div>
                                      </div>
                                    ))
                                  ) : (
                                    <div className="text-center py-10 border border-dashed border-stone-200/90 rounded-2xl p-6 bg-stone-50/30">
                                      <PlayCircle size={36} className="text-stone-300 mx-auto mb-2" />
                                      <p className="text-stone-700 text-sm font-bold">No Video Lessons in this Masterclass Yet</p>
                                      <p className="text-stone-400 text-xs mt-1">The mentor will upload upcoming video modules shortly.</p>
                                    </div>
                                  )}
                                </div>
                              )}

                              {/* TAB 2: TASKS & ASSIGNMENTS (Matching Image 2) */}
                              {courseModalTab === "assignments" && (
                                <div>
                                  {activeCourse.assignments && activeCourse.assignments.length > 0 ? (
                                    <div className="space-y-3">
                                      {activeCourse.assignments.map((assn: any, idx: number) => (
                                        <div
                                          key={assn.id || idx}
                                          className="p-3.5 sm:p-4 rounded-2xl bg-stone-50/50 border border-stone-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-white transition-all shadow-2xs"
                                        >
                                          <div className="min-w-0 flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                              <span className="px-2 py-0.5 rounded-md bg-[#fde5d6] text-[#942008] text-xs font-black border border-[#f5ded0]">
                                                +{assn.points || 50} XP
                                              </span>
                                              <h4 className="text-sm font-bold text-stone-900 truncate">{assn.title}</h4>
                                            </div>
                                            <p className="text-xs text-stone-500 leading-relaxed line-clamp-2">{assn.description}</p>
                                          </div>
                                          <Link
                                            href="/student/tasks"
                                            className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-300 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 shrink-0"
                                          >
                                            <span>Submit Artwork</span>
                                            <ExternalLink size={12} />
                                          </Link>
                                        </div>
                                      ))}
                                    </div>
                                  ) : (
                                    <div className="border border-dashed border-stone-300/80 rounded-2xl p-8 sm:p-10 flex flex-col items-center justify-center text-center bg-stone-50/20">
                                      <div className="w-12 h-12 rounded-2xl bg-stone-100 flex items-center justify-center text-stone-400 mb-3">
                                        <ClipboardList size={26} className="text-stone-400" />
                                      </div>
                                      <h4 className="text-sm font-bold text-stone-800 mb-1">
                                        No Mandatory Tasks for this Masterclass
                                      </h4>
                                      <p className="text-xs text-stone-500 max-w-sm mb-4 leading-relaxed">
                                        Practice freely, follow the video steps, and share your finished creation on the Sisterhood Feed!
                                      </p>
                                      <Link
                                        href="/student/feed"
                                        className="bg-[#fde5d6] text-[#942008] hover:bg-[#fad3be] border border-[#f5ded0] px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-2xs"
                                      >
                                        <Sparkles size={13} />
                                        <span>Post to Community Feed</span>
                                      </Link>
                                    </div>
                                  )}
                                </div>
                              )}

                              {/* TAB 3: COURSE OVERVIEW (Matching Image 3) */}
                              {courseModalTab === "about" && (
                                <div className="space-y-3.5 text-xs">
                                  {/* Description Card */}
                                  <div className="p-4 rounded-2xl border border-stone-200/80 bg-stone-50/30">
                                    <h4 className="text-xs sm:text-sm font-bold text-stone-900 mb-2 flex items-center gap-2">
                                      <BookOpen size={15} className="text-[#942008]" />
                                      <span>Masterclass Description</span>
                                    </h4>
                                    <p className="text-stone-600 text-xs leading-relaxed">
                                      {activeCourse.description || "Introduction to epoxy resin, safety protocols, PPE, curing times, and essential toolkit setup."}
                                    </p>
                                  </div>

                                  {/* 2-col info cards */}
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div className="p-3.5 rounded-2xl border border-stone-200/80 bg-stone-50/30">
                                      <span className="text-xs uppercase font-bold tracking-wider text-stone-400 block mb-1.5">
                                        COURSE FORMAT
                                      </span>
                                      <span className="text-stone-800 font-bold text-xs flex items-center gap-2">
                                        <Video size={14} className="text-[#942008]" />
                                        <span>Sequential Video Curriculum</span>
                                      </span>
                                    </div>

                                    <div className="p-3.5 rounded-2xl border border-stone-200/80 bg-stone-50/30">
                                      <span className="text-xs uppercase font-bold tracking-wider text-stone-400 block mb-1.5">
                                        ACCESS STATUS
                                      </span>
                                      <span className="text-emerald-500 font-bold text-xs flex items-center gap-1.5">
                                        <CheckCircle2 size={14} className="text-emerald-500" />
                                        <span>{isUnlocked ? "Permanent Lifetime Unlocked" : "Locked Tier"}</span>
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* If entire tier is locked, show bottom Unlock CTA */}
                            {!isUnlocked && (
                              <button
                                type="button"
                                onClick={() => setPurchaseModal({ isOpen: true, tierCode: activeCourse.levelCode || currentLvl })}
                                className="mt-4 w-full py-3.5 bg-gradient-to-r from-[#b53310] via-[#c4431d] to-[#ea580c] hover:opacity-95 text-white font-bold rounded-2xl text-xs sm:text-sm text-center flex items-center justify-center gap-2 transition-all shadow-lg shadow-orange-950/15 cursor-pointer"
                              >
                                <Lock size={14} />
                                <span>Unlock Entire {tierName} ({tierPricing.hasOffer ? `Offer: ${tierPricing.finalPrice}` : tierPricing.finalPrice}) →</span>
                              </button>
                            )}
                          </>
                        ) : (
                          <div className="flex flex-col items-center justify-center p-12 text-center h-full min-h-[320px] rounded-2xl bg-stone-50/50 border border-dashed border-stone-200">
                            <div className="w-12 h-12 rounded-2xl bg-[#fff2ea] flex items-center justify-center text-[#e86034] mb-3">
                              <BookOpen size={24} />
                            </div>
                            <h3 className="text-base font-bold text-stone-800">No Courses Available</h3>
                            <p className="text-xs text-stone-500 max-w-sm mt-1 leading-relaxed">
                              There are currently no courses published for this level tier.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </div>
              );
            })()}

            {/* Individual Masterclasses Section Header */}
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200/80 pb-4">
              <div>
                <div className="flex items-center gap-2.5">
                  <span className="p-2 rounded-xl bg-[#fde5d6] text-[#942008] border border-[#f5ded0]">
                    <Sparkles size={18} />
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-stone-900">
                    Individual Masterclasses
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-[#fde5d6] text-[#942008] border border-[#f5ded0]">
                    {displayedCourses.length}
                  </span>
                </div>
                <p className="text-xs text-stone-500 mt-1.5">
                  Specialty standalone masterclasses available for individual direct purchase without membership tiers.
                </p>
              </div>
            </div>

            {/* Courses Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
              {displayedCourses.map((course, idx) => {
                const isStandalone = !course.levelCode || course.levelCode.toUpperCase() === "NONE";
                const lvl = isStandalone ? "NONE" : (course.levelCode || "L0").toUpperCase();
                const cfg = LEVEL_TIER_CONFIG[lvl] || { name: "Individual Course", price: "Custom", color: "text-[#942008]", bg: "bg-[#fde5d6]", border: "border-[#f5ded0]" };
                const unlocked = isCourseUnlocked(course);

                // Standalone course price & offer calculation
                const basePriceStr = isStandalone
                  ? (course.price ? (course.price.startsWith("₹") ? course.price : `₹${course.price}`) : "₹499")
                  : getTierPrice(lvl);

                const tierPricing = !isStandalone ? getComputedTierPricing(lvl, levelTiers, campaignOffers) : null;
                const offer = isStandalone
                  ? getCourseOffer(course, basePriceStr)
                  : getCourseResolvedOffer(course, tierPricing!);

                const displayOriginalPrice = offer ? offer.originalPrice : (tierPricing?.finalPrice || basePriceStr);
                const displayFinalPrice = offer ? offer.discountedPrice : (tierPricing?.finalPrice || basePriceStr);

                const cardImage = course.flyerImage || course.image
                  ? getImageUrl(course.flyerImage || course.image)
                  : "/images/courses/powder-secrets-flyer.jpeg";

                return (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    key={course.id || `standalone-${idx}`}
                    className={`bg-white border rounded-3xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group ${unlocked ? "border-emerald-300 ring-2 ring-emerald-500/10" : "border-stone-200/80 hover:border-stone-300"
                      }`}
                  >
                    <div>
                      {/* Course Banner Thumbnail */}
                      <div className="relative w-full aspect-video rounded-2xl overflow-hidden mb-4 border border-stone-200/80 bg-[#faf8f5] flex items-center justify-center">
                        {cardImage ? (
                          <>
                            <img
                              src={cardImage}
                              alt={course.title}
                              className={`w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105 ${!unlocked ? "filter grayscale-[10%] opacity-90" : ""
                                }`}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 via-transparent to-stone-900/20 pointer-events-none" />
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setPreviewFlyerModal(cardImage);
                              }}
                              className="absolute bottom-2 left-2.5 z-20 px-2.5 py-1 rounded-lg bg-white/90 hover:bg-white text-stone-700 hover:text-stone-900 border border-stone-300/80 backdrop-blur-md transition-all shadow-md cursor-pointer opacity-0 group-hover:opacity-100 flex items-center gap-1.5 text-xs font-bold"
                              title="View Full Flyer / Poster"
                            >
                              <Maximize2 size={11} /> Full Poster
                            </button>
                          </>
                        ) : (
                          <div className="w-full h-full bg-[#faf8f5] flex items-center justify-center">
                            <BookOpen size={36} className="text-[#942008]/40" />
                          </div>
                        )}

                        {/* Top Overlay Badges */}
                        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 flex-wrap z-10">
                          <span className="px-2.5 py-0.5 rounded-lg text-xs font-black border shadow-md backdrop-blur-md bg-purple-500/20 text-purple-700 border-purple-300 bg-white/95">
                            ✨ Standalone Masterclass
                          </span>

                          {offer && (
                            <span className="bg-gradient-to-r from-red-500 to-rose-600 text-white font-black text-xs px-2 py-0.5 rounded-lg shadow-md border border-red-400/40 flex items-center gap-1 animate-pulse">
                              <Flame size={10} />
                              {offer.discountLabel}
                            </span>
                          )}
                        </div>

                        <div className="absolute top-2.5 right-2.5 z-10">
                          {!unlocked ? (
                            offer ? (
                              <div className="flex items-center gap-1.5 bg-white/95 border border-red-500/40 px-2.5 py-0.5 rounded-lg backdrop-blur-md shadow-md">
                                <span className="text-xs text-stone-400 line-through">{displayOriginalPrice}</span>
                                <span className="text-xs font-black text-rose-600">{displayFinalPrice}</span>
                              </div>
                            ) : (
                              <span className="text-xs font-black bg-white/95 border border-purple-300 text-purple-700 px-2 py-0.5 rounded-lg backdrop-blur-md flex items-center gap-1 shadow-md">
                                <Lock size={10} /> {displayFinalPrice}
                              </span>
                            )
                          ) : (
                            <span className="text-xs font-black text-emerald-700 bg-emerald-50 border border-emerald-300 px-2 py-0.5 rounded-lg backdrop-blur-md flex items-center gap-1 shadow-md">
                              <CheckCircle2 size={10} /> Unlocked
                            </span>
                          )}
                        </div>

                        {/* Course Order */}
                        <div className="absolute bottom-2 right-2.5 z-10">
                          <span className="text-xs text-stone-700 bg-white/90 px-2 py-0.5 rounded-md border border-stone-200 font-semibold backdrop-blur-sm shadow-sm">
                            Course #{course.order || idx + 1}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-start gap-2.5 mb-2">
                        <div className="min-w-0 flex-1">
                          <h3 className="font-black text-stone-900 text-base leading-snug truncate">
                            {course.title}
                          </h3>
                          <p className="text-xs text-stone-500 flex items-center gap-1 mt-1 font-semibold">
                            <Layers size={12} className="text-[#942008]" /> {course.chapters?.length || 0} Video Lessons
                          </p>
                        </div>
                      </div>

                      <p className="text-stone-500 text-xs leading-relaxed mb-4 line-clamp-2">
                        {course.description || "Confused about which powders to use to achieve those beautiful colours, stunning effects, and flawless finishes in your resin art? Learn master powder blending and effects."}
                      </p>

                      {isStandalone && (() => {
                        const vInfo = getCourseValidityInfo(course);
                        return (
                          <div className={`mb-4 px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border backdrop-blur-sm ${vInfo.isExpired
                            ? 'bg-red-50 text-red-700 border-red-200'
                            : vInfo.isEnrolled
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-purple-50 text-purple-700 border-purple-200'
                            }`}>
                            <Clock size={12} className="shrink-0" />
                            <span>{course.validityMonths ? `${course.validityMonths} Months Validity (starts on registration/purchase)` : vInfo.text}</span>
                          </div>
                        );
                      })()}
                    </div>

                    {unlocked ? (
                      <button
                        type="button"
                        onClick={() => handleOpenCourse(course)}
                        className="w-full py-3 px-4 bg-gradient-to-r from-[#942008] via-[#c4431d] to-[#ea580c] hover:opacity-95 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-md shadow-[#c4431d]/20 transition-all hover:scale-[1.01] cursor-pointer"
                      >
                        <span>📂 Open Course Lessons</span>
                        <ChevronRight size={14} />
                      </button>
                    ) : isStandalone ? (
                      isCourseExpired(course) ? (
                        <button
                          type="button"
                          onClick={() => setIndividualCourseModal(course)}
                          className="w-full py-3 px-4 bg-gradient-to-r from-[#942008] via-[#c4431d] to-[#ea580c] hover:opacity-95 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-md hover:scale-[1.01] cursor-pointer"
                        >
                          <Clock size={14} className="text-amber-200" />
                          <span>⚠️ Validity Expired · Re-purchase ({displayFinalPrice})</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setIndividualCourseModal(course)}
                          className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 shadow-md hover:scale-[1.01] cursor-pointer group"
                        >
                          <Sparkles size={14} className="text-amber-300" />
                          <span>
                            Unlock Course Standalone ({displayFinalPrice})
                          </span>
                        </button>
                      )
                    ) : (
                      <button
                        type="button"
                        onClick={() => setPurchaseModal({ isOpen: true, tierCode: lvl })}
                        className="w-full py-3 px-4 bg-[#fde5d6] hover:bg-[#c4431d] hover:text-white text-[#942008] border border-[#f5ded0] rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer group"
                      >
                        <Lock size={13} className="text-[#c4431d] group-hover:text-white" />
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
                <div className="col-span-full py-16 flex flex-col items-center justify-center text-center bg-white border border-dashed border-stone-200 rounded-3xl p-8">
                  <Sparkles size={48} className="text-[#942008]/40 mb-3" />
                  <h3 className="text-lg font-bold text-stone-900 mb-1">No Standalone Masterclasses Currently</h3>
                  <p className="text-stone-500 text-xs max-w-md">
                    All curriculum courses are organized neatly inside the Membership Levels (L0, L1, L2, L3) above. Click &quot;View Included Courses&quot; on any level card to explore and watch lessons.
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </main>



      {/* Embedded Video Lesson Player Modal */}
      {activeVideoLesson && (
        <div className="fixed inset-0 bg-[#faf8f5]/90 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white/95 border border-[#ecdccb] shadow-[0_10px_30px_-12px_rgba(90,55,20,0.08)] rounded-3xl max-w-4xl w-full p-6 shadow-2xl text-stone-900 relative">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <Video className="text-[#942008]" size={20} />
                <h3 className="text-lg font-black text-stone-900 truncate max-w-md">
                  {activeVideoLesson.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveVideoLesson(null)}
                className="p-1.5 bg-stone-100 hover:bg-slate-700 rounded-full text-stone-500 hover:text-stone-900 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black border border-stone-200 shadow-inner">
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
          <div className="fixed inset-0 bg-[#faf8f5]/85 backdrop-blur-xl flex items-center justify-center z-50 p-4 sm:p-6 overflow-y-auto">
            <motion.div
              initial={{ scale: 0.94, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ type: "spring", duration: 0.4, bounce: 0.2 }}
              className="relative w-full max-w-lg rounded-[32px] bg-white border border-[#ecdccb] shadow-2xl my-auto text-stone-900"
            >
              <div className="bg-[#faf8f5]/95 backdrop-blur-2xl rounded-[31px] overflow-hidden text-stone-900 flex flex-col">
                {/* Header Banner with full cover */}
                <div className="relative w-full h-60 sm:h-72 bg-[#faf8f5] overflow-hidden border-b border-purple-500/20 flex items-center justify-center">
                  {(c.image || c.flyerImage) ? (
                    <>
                      {/* Full Cover Banner Display */}
                      <img
                        src={c.image || c.flyerImage}
                        alt={c.title}
                        className="w-full h-full object-cover object-center cursor-pointer transition-transform duration-500 hover:scale-105"
                        onClick={() => setPreviewFlyerModal(c.flyerImage || c.image)}
                        title="Click to view full flyer / poster"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-stone-900/70 via-transparent to-stone-900/30 pointer-events-none" />
                    </>
                  ) : (
                    <div className="w-full h-full bg-[#faf8f5] flex items-center justify-center">
                      <BookOpen size={52} className="text-purple-400/80" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-900/70 via-transparent to-stone-900/30 pointer-events-none" />

                  {/* Top Bar Floating Badges */}
                  <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between z-20">
                    <span className="px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase bg-purple-500/30 text-purple-200 border border-purple-400/40 backdrop-blur-md shadow-lg flex items-center gap-1.5">
                      <Sparkles size={11} className="text-amber-300" /> Standalone Masterclass
                    </span>
                    <div className="flex items-center gap-2">
                      {(c.flyerImage || c.image) && (
                        <button
                          type="button"
                          onClick={() => setPreviewFlyerModal(c.flyerImage || c.image)}
                          className="px-2.5 py-1 rounded-full bg-[#faf8f5]/80 hover:bg-white/95 text-stone-600 hover:text-stone-900 border border-stone-300/60 text-xs font-semibold flex items-center gap-1 backdrop-blur-md transition-all shadow-md cursor-pointer"
                          title="View Full Resolution Poster"
                        >
                          <Maximize2 size={12} /> View Poster
                        </button>
                      )}
                      <button
                        onClick={() => setIndividualCourseModal(null)}
                        className="w-8 h-8 rounded-full bg-[#faf8f5]/80 hover:bg-stone-100 text-stone-500 hover:text-stone-900 border border-stone-300/60 flex items-center justify-center transition-all cursor-pointer shadow-md hover:scale-105"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Bottom Badges on Image */}
                  <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between z-20">
                    <div className="flex items-center gap-2">
                      <span className="bg-white/95 backdrop-blur-md text-stone-600 text-xs font-semibold px-2.5 py-0.5 rounded-lg border border-stone-300/60 flex items-center gap-1">
                        <Layers size={11} className="text-purple-400" /> {c.chapters?.length || 0} Lessons
                      </span>
                      <span className="bg-white/95 backdrop-blur-md text-stone-600 text-xs font-semibold px-2.5 py-0.5 rounded-lg border border-stone-300/60 flex items-center gap-1">
                        <Video size={11} className="text-indigo-400" /> Full HD 1080p
                      </span>
                    </div>

                    {offer && (
                      <span className="bg-gradient-to-r from-red-500 to-rose-600 text-stone-900 font-black text-xs px-2.5 py-1 rounded-full shadow-lg border border-red-400/40 flex items-center gap-1 animate-pulse">
                        <Flame size={11} /> {offer.discountLabel}
                      </span>
                    )}
                  </div>
                </div>

                {/* Modal Body */}
                <div className="p-5 sm:p-6 space-y-4">
                  {/* Title & Description */}
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black text-stone-900 leading-tight mb-1.5 tracking-tight">
                      {c.title}
                    </h3>
                    <p className="text-xs text-stone-500 leading-relaxed line-clamp-2">
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
                            <p className="text-xs text-red-300/80 mt-0.5">
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
                            <p className="text-xs text-stone-600 mt-0.5">
                              Validity begins on the day of student registration / purchase. Enjoy full unrestricted access to all lessons and study notes for {label}.
                            </p>
                          </div>
                        </div>
                      );
                    }
                    return (
                      <div className="p-3 rounded-2xl bg-emerald-950/25 border border-emerald-500/30 flex items-center gap-2.5">
                        <ShieldCheck size={16} className="text-emerald-400 shrink-0" />
                        <span className="text-xs font-bold text-emerald-300">
                          Permanent Lifetime Access Included
                        </span>
                      </div>
                    );
                  })()}

                  {/* Highlights Grid */}
                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="p-3 rounded-2xl bg-white/95 border border-stone-200 flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
                        <PlayCircle size={15} />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-stone-900 leading-tight">Instant Unlock</div>
                        <div className="text-xs text-stone-500">Immediate access</div>
                      </div>
                    </div>
                    <div className="p-3 rounded-2xl bg-white/95 border border-stone-200 flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                        <Award size={15} />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-stone-900 leading-tight">Certification</div>
                        <div className="text-xs text-stone-500">Upon completion</div>
                      </div>
                    </div>
                    <div className="p-3 rounded-2xl bg-white/95 border border-stone-200 flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                        <FileText size={15} />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-stone-900 leading-tight">Study Guides</div>
                        <div className="text-xs text-stone-500">Formulas &amp; notes</div>
                      </div>
                    </div>
                    <div className="p-3 rounded-2xl bg-white/95 border border-stone-200 flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                        <Zap size={15} />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-stone-900 leading-tight">Multi-Device</div>
                        <div className="text-xs text-stone-500">Web &amp; Mobile app</div>
                      </div>
                    </div>
                  </div>

                  {/* Pricing Box */}
                  <div className="p-4 rounded-2xl bg-[#faf8f5] border border-stone-200 flex items-center justify-between shadow-inner">
                    <div>
                      <span className="text-xs uppercase tracking-wider text-stone-500 font-bold block mb-0.5">
                        Course Investment
                      </span>
                      <div className="flex items-baseline gap-2.5">
                        <span className="text-3xl font-black text-amber-400 font-mono tracking-tight">
                          {finalPriceStr}
                        </span>
                        {offer && (
                          <span className="text-xs text-stone-400 line-through font-mono">
                            {originalPriceStr}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <span className="text-xs text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-1 rounded-lg font-black uppercase tracking-wider inline-block">
                        One-Time Fee
                      </span>
                      {offer && (
                        <div className="text-xs text-red-400 font-bold">
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
                      className="w-full py-4 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 text-stone-900 font-black text-sm rounded-2xl shadow-xl shadow-purple-900/40 hover:shadow-purple-900/60 transition-all hover:scale-[1.02] active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {isProcessingPayment ? (
                        <Loader2 size={16} className="animate-spin text-amber-300" />
                      ) : (
                        <Sparkles size={16} className="text-amber-300" />
                      )}
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
                      className="w-full py-2.5 text-stone-500 hover:text-stone-900 text-xs font-semibold hover:bg-white/95 rounded-xl transition-colors cursor-pointer"
                    >
                      Close Window
                    </button>
                  </div>

                  {/* Trust Footer */}
                  <div className="pt-1 border-t border-slate-900 flex items-center justify-center gap-4 text-xs text-stone-400 font-medium">
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
              className="absolute -top-12 right-0 sm:-right-10 w-9 h-9 rounded-full bg-stone-100 hover:bg-slate-700 text-stone-600 hover:text-stone-900 flex items-center justify-center transition-all cursor-pointer shadow-lg border border-stone-300"
              title="Close Preview"
            >
              <X size={18} />
            </button>
            <div className="rounded-2xl overflow-hidden border border-stone-200 shadow-2xl bg-[#faf8f5] max-h-[85vh] flex items-center justify-center p-2">
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
