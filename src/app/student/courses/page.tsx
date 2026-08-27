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
} from "lucide-react";
import { motion } from "framer-motion";
import { TierPurchaseModal } from "@/components/membership/TierPurchaseModal";

import { API_BASE_URL } from "@/config/api";

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
  const [activeVideoLesson, setActiveVideoLesson] = useState<{ title: string; videoUrl: string } | null>(null);
  const [activeLevelFilter, setActiveLevelFilter] = useState<string>("all");
  
  // Purchase / Upgrade Modal State
  const [purchaseModal, setPurchaseModal] = useState<{ isOpen: boolean; tierCode: string }>({
    isOpen: false,
    tierCode: "L1",
  });

  const fetchStudentData = () => {
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

  const studentLevelCode = getLevelCode(stats.membershipLevel || stats.rank, stats.points || 0);
  const studentRankNum = LEVEL_HIERARCHY[studentLevelCode] ?? 0;

  const isCourseUnlocked = (courseLevel: string) => {
    if (stats.isExpired) return false;
    const requiredNum = LEVEL_HIERARCHY[courseLevel.toUpperCase()] ?? 0;
    return studentRankNum >= requiredNum;
  };

  const getLevelName = () => {
    return stats.membershipLevel || stats.rank || "Fast Track (L0)";
  };

  const displayedCourses = courses.filter((c) => {
    if (activeLevelFilter === "all") return true;
    return (c.levelCode || "L0").toUpperCase() === activeLevelFilter.toUpperCase();
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

        {/* Upgrade Banner for students who want to purchase next levels directly */}
        <div className="mb-8 p-4 md:p-5 rounded-3xl bg-gradient-to-r from-slate-900 via-orange-950/30 to-slate-900 border border-orange-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400 shrink-0">
              <Sparkles size={20} />
            </div>
            <div>
              <h3 className="text-sm font-black text-white">
                Want to skip ahead? Purchase &amp; Unlock Any Level Directly
              </h3>
              <p className="text-xs text-slate-400">
                You don't need to finish earlier modules — you can directly purchase Silver (₹4,999), Gold (₹19,999), or Diamond (₹59,999).
              </p>
            </div>
          </div>

          <button
            onClick={() => setPurchaseModal({ isOpen: true, tierCode: "L2" })}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-amber-400 border border-amber-500/30 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap"
          >
            View All Upgrade Tiers →
          </button>
        </div>

        {/* Level Filters */}
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

          {(["L0", "L1", "L2", "L3"] as const).map((lvl) => {
            const cfg = LEVEL_TIER_CONFIG[lvl];
            const count = courses.filter((c) => (c.levelCode || "L0").toUpperCase() === lvl).length;
            const isActive = activeLevelFilter === lvl;
            const isUnlocked = isCourseUnlocked(lvl);

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
                <span>{cfg.name}</span>
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
            const lvl = (course.levelCode || "L0").toUpperCase();
            const cfg = LEVEL_TIER_CONFIG[lvl] || LEVEL_TIER_CONFIG.L0;
            const unlocked = isCourseUnlocked(lvl);

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
                  <div className="relative w-full h-38 rounded-2xl overflow-hidden mb-4 border border-slate-800/80 bg-slate-950">
                    {course.image ? (
                      <img
                        src={course.image}
                        alt={course.title}
                        className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
                          !unlocked ? "filter grayscale-[50%] opacity-50" : ""
                        }`}
                      />
                    ) : (
                      <div className={`w-full h-full bg-gradient-to-br from-slate-900 via-slate-950 to-orange-950/40 flex items-center justify-center ${
                        !unlocked ? "opacity-50" : ""
                      }`}>
                        <BookOpen size={36} className="text-slate-700" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

                    {/* Top Overlay Badges */}
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                      <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-black border shadow-md backdrop-blur-md ${cfg.bg} ${cfg.color} ${cfg.border}`}>
                        {lvl} • {cfg.name}
                      </span>

                      {(() => {
                        const offer = getCourseOffer(course, cfg.price);
                        if (!offer) return null;
                        return (
                          <span className="bg-gradient-to-r from-red-500 to-rose-600 text-white font-black text-[10px] px-2 py-0.5 rounded-lg shadow-md border border-red-400/40 flex items-center gap-1 animate-pulse">
                            <Flame size={10} />
                            {offer.discountLabel}
                          </span>
                        );
                      })()}
                    </div>

                    <div className="absolute top-2.5 right-2.5">
                      {!unlocked ? (
                        (() => {
                          const offer = getCourseOffer(course, cfg.price);
                          if (offer) {
                            return (
                              <div className="flex items-center gap-1.5 bg-slate-950/90 border border-red-500/50 px-2.5 py-0.5 rounded-lg backdrop-blur-md shadow-md">
                                <span className="text-[10px] text-slate-400 line-through">{offer.originalPrice}</span>
                                <span className="text-[11px] font-black text-amber-300">{offer.discountedPrice}</span>
                              </div>
                            );
                          }
                          return (
                            <span className="text-[10px] font-black text-amber-300 bg-slate-950/85 border border-amber-500/40 px-2 py-0.5 rounded-lg backdrop-blur-md flex items-center gap-1 shadow-md">
                              <Lock size={10} /> {cfg.price}
                            </span>
                          );
                        })()
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
                  
                  <p className="text-slate-400 text-xs leading-relaxed mb-5 line-clamp-2">
                    {course.description || "Master step-by-step resin art techniques, tools, and business strategies."}
                  </p>
                </div>

                {unlocked ? (
                  <button 
                    onClick={() => setSelectedCourse(course)}
                    className="w-full py-3 px-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 text-slate-950 font-black rounded-xl text-xs flex items-center justify-center gap-2 shadow-md shadow-orange-500/10 transition-all hover:scale-[1.02] cursor-pointer"
                  >
                    <span>📂 Open Course Lessons</span>
                    <ChevronRight size={14} />
                  </button>
                ) : (
                  <button
                    onClick={() => setPurchaseModal({ isOpen: true, tierCode: lvl })}
                    className="w-full py-3 px-4 bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-orange-500 hover:to-amber-500 hover:text-slate-950 text-amber-300 border border-amber-500/40 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer group"
                  >
                    <Lock size={13} className="text-amber-400 group-hover:text-slate-950" />
                    {(() => {
                      const offer = getCourseOffer(course, cfg.price);
                      if (offer) {
                        return (
                          <span>
                            Purchase &amp; Unlock {cfg.name} (Offer: {offer.discountedPrice})
                          </span>
                        );
                      }
                      return <span>Purchase &amp; Unlock {cfg.name} ({cfg.price})</span>;
                    })()}
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

      {/* Chapter Viewer Modal */}
      {selectedCourse && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden"
          >
            {/* Modal Course Banner */}
            {selectedCourse.image && (
              <div className="relative w-full h-36 border-b border-slate-800 bg-slate-950 overflow-hidden shrink-0">
                <img
                  src={selectedCourse.image}
                  alt={selectedCourse.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
              </div>
            )}

            <div className="flex justify-between items-center p-5 sm:p-6 border-b border-slate-800 bg-slate-900/80">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400 shrink-0">
                  <BookOpen size={20} />
                </div>
                <div className="min-w-0">
                  <span className="text-[11px] font-bold text-orange-400 uppercase tracking-wider block">
                    Tier: {selectedCourse.levelCode || "L0"} ({LEVEL_TIER_CONFIG[selectedCourse.levelCode || "L0"]?.name})
                  </span>
                  <h2 className="text-lg sm:text-xl font-black text-white truncate">{selectedCourse.title}</h2>
                </div>
              </div>

              <button 
                onClick={() => setSelectedCourse(null)} 
                className="w-9 h-9 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 flex items-center justify-center transition-colors cursor-pointer shrink-0"
              >
                &times;
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-3">
              {selectedCourse.chapters?.length > 0 ? (
                selectedCourse.chapters.map((chapter: any, index: number) => (
                  <div key={chapter.id} className="bg-slate-950/80 border border-slate-800/80 hover:border-slate-700 rounded-2xl p-4 sm:p-5 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-orange-500/10 text-orange-400 flex items-center justify-center font-bold text-xs shrink-0">
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-sm">{chapter.title}</h4>
                        <span className="text-[11px] text-slate-500">
                          {chapter.videoUrl ? "HD Video Lesson Available" : "Study Notes"}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
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
                          href={chapter.pdfUrl}
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
                <div className="text-center py-12 border border-dashed border-slate-800 rounded-2xl">
                  <p className="text-slate-500 text-sm">No chapters have been added to this course yet.</p>
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
              {activeVideoLesson.videoUrl.startsWith("data:video") || activeVideoLesson.videoUrl.endsWith(".mp4") || activeVideoLesson.videoUrl.endsWith(".webm") ? (
                <video src={activeVideoLesson.videoUrl} controls autoPlay className="w-full h-full object-contain" />
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
