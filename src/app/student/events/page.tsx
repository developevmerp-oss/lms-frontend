"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { StudentNav, getLevelCode } from "@/components/layout/StudentNav";
import { CardGridSkeleton } from "@/components/ui/SkeletonLoader";
import { API_BASE_URL } from "@/config/api";
import {
  Calendar,
  Video,
  Clock,
  Users,
  ExternalLink,
  Lock,
  Sparkles,
  CheckCircle2,
  Play,
  Flame,
  ShieldAlert,
  Zap,
  PlayCircle
} from "lucide-react";
import Link from "next/link";
import { TierPurchaseModal } from "@/components/membership/TierPurchaseModal";

export default function StudentEventsPage() {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");
  const [classesList, setClassesList] = useState<any[]>([]);
  const [joiningClassId, setJoiningClassId] = useState<string | null>(null);
  const [joinSuccessMsg, setJoinSuccessMsg] = useState<string>("");
  const [purchaseModal, setPurchaseModal] = useState({ isOpen: false, tierCode: "L1" });
  const [levelTiers, setLevelTiers] = useState<any[]>([]);

  const fetchData = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }

    try {
      const [statsRes, classesRes] = await Promise.all([
        fetch(`${API_BASE_URL}/dashboard/student`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_BASE_URL}/classes`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const statsData = await statsRes.json();
      const classesData = await classesRes.json();

      setStats(statsData);
      if (classesData.success && Array.isArray(classesData.data)) {
        setClassesList(classesData.data);
      }

      fetch(`${API_BASE_URL}/dashboard/levels`)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data) && data.length > 0) setLevelTiers(data);
        })
        .catch(() => {});
    } catch (_) {}
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleLogout = () => {
    logout();
  };

  const handleJoinClass = async (classId: string, meetingUrl?: string) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    setJoiningClassId(classId);
    try {
      const res = await fetch(`${API_BASE_URL}/classes/${classId}/join`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setJoinSuccessMsg(`✅ Attendance Recorded! +100 XP Awarded to your profile.`);
        setTimeout(() => setJoinSuccessMsg(""), 4000);
        fetchData();

        // Open live meeting
        const urlToOpen = data.meetingUrl || meetingUrl || "https://zoom.us";
        window.open(urlToOpen, "_blank");
      } else {
        const urlToOpen = meetingUrl || "https://zoom.us";
        window.open(urlToOpen, "_blank");
      }
    } catch (err) {
      const urlToOpen = meetingUrl || "https://zoom.us";
      window.open(urlToOpen, "_blank");
    } finally {
      setJoiningClassId(null);
    }
  };

  const effectiveLevel = user?.membershipLevel || stats?.membershipLevel || user?.rank;
  const studentLevelCode = getLevelCode(effectiveLevel, stats?.points || 0);

  const isClassEligibleForStudent = (cls: any) => {
    const rawTarget = cls.targetLevel || "All";
    if (rawTarget === "All" || rawTarget.toLowerCase() === "all") return true;
    const targetCodes = rawTarget.split(",").map((s: string) => s.trim().toUpperCase());
    return targetCodes.includes(studentLevelCode.toUpperCase()) || 
           (studentLevelCode === "L3+" && targetCodes.includes("L3"));
  };

  const isAccessible = studentLevelCode !== "GENERAL";

  const nowTime = Date.now();
  const isClassActiveOrUpcoming = (e: any) => {
    // 1. Explicitly completed or cancelled classes go to past
    if (e.status === "completed" || e.status === "cancelled") return false;
    // 2. Explicitly live or upcoming classes set by admin are always upcoming/active
    if (e.status === "live" || e.status === "upcoming") return true;

    // 3. Check if current time is before the class end time (start + duration)
    const startTime = new Date(e.scheduledAt).getTime();
    const durationMs = (Number(e.durationMinutes) || 60) * 60 * 1000;
    if (nowTime <= startTime + durationMs) return true;

    // 4. If scheduled today (within 18 hours) and has a meeting URL, keep active
    const eighteenHoursAgo = nowTime - 18 * 60 * 60 * 1000;
    if (startTime >= eighteenHoursAgo && e.meetingUrl) return true;

    return false;
  };

  const upcomingEvents = classesList.filter(isClassActiveOrUpcoming);
  const pastEvents = classesList.filter((e) => !isClassActiveOrUpcoming(e));

  return (
    <div
      className="min-h-screen bg-[#faf8f5] text-stone-900 font-sans transition-colors lg:pl-64"
      style={{
        backgroundColor: "#faf8f5",
        backgroundImage: "radial-gradient(circle, #e2ded4 1.5px, transparent 1.5px)",
        backgroundSize: "24px 24px",
        backgroundAttachment: "fixed",
      }}
    >
      <StudentNav
        user={user || stats}
        level={effectiveLevel || "Fast Track (L0)"}
        points={stats?.points || 0}
        logout={handleLogout}
        notifications={stats?.notifications}
      />

      <main className="w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-end gap-4 mb-6">
          {/*
          <div>
            <div className="flex items-center gap-1.5 text-xs text-stone-500 mb-1 font-medium">
              <span>Live Coaching</span>
              <span className="text-stone-300">/</span>
              <span className="text-stone-700 font-medium">Live Coaching &amp; Attendance Portal</span>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-stone-900 tracking-tight">
              Live Coaching &amp; Attendance Portal
            </h1>
            <p className="text-stone-500 text-xs sm:text-sm mt-0.5">
              Join live interactive coaching sessions with Vrajangna Patel. Clicking &quot;Join Live Class&quot; marks your attendance and awards bonus XP.
            </p>
          </div>
          */}

          <div className="flex items-center gap-2 bg-white/95 border border-[#ecdccb] shadow-[0_10px_30px_-12px_rgba(90,55,20,0.08)] p-1.5 rounded-2xl self-start md:self-auto">
            <button
              onClick={() => setActiveTab("upcoming")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "upcoming"
                  ? "bg-gradient-to-r from-[#942008] via-[#c4431d] to-[#ea580c] text-white font-black shadow-md shadow-[#c4431d]/20"
                  : "text-stone-500 hover:text-stone-900"
              }`}
            >
              Upcoming ({upcomingEvents.length})
            </button>
            <button
              onClick={() => setActiveTab("past")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "past"
                  ? "bg-gradient-to-r from-[#942008] via-[#c4431d] to-[#ea580c] text-white font-black shadow-md shadow-[#c4431d]/20"
                  : "text-stone-500 hover:text-stone-900"
              }`}
            >
              Past &amp; Replays ({pastEvents.length})
            </button>
          </div>
        </div>

        {/* Success Alert */}
        {joinSuccessMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-bold flex items-center gap-2 animate-bounce-short">
            <CheckCircle2 size={18} /> {joinSuccessMsg}
          </div>
        )}

        {/* Access Check */}
        {loading ? (
          <CardGridSkeleton count={6} />
        ) : !isAccessible ? (
          <div className="rounded-3xl border border-[#ecdccb] bg-white/95 p-8 md:p-12 text-center max-w-2xl mx-auto shadow-2xl">
            <div className="w-16 h-16 rounded-3xl bg-[#fde5d6] border border-[#f5ded0] flex items-center justify-center text-[#942008] mx-auto mb-4">
              <Lock size={32} />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#942008] block mb-1">
              Level 1 (Silver Member) or Higher Required
            </span>
            <h2 className="text-2xl font-black text-stone-900 mb-3">
              Live Masterclasses are Locked for Fast Track
            </h2>
            <p className="text-sm text-stone-600 leading-relaxed mb-6">
              Live interactive masterclasses, weekly Q&amp;A calls, and live portfolio reviews unlock when your account is upgraded to <strong>Level 1 ({levelTiers.find((t: any) => (t.code || "").toUpperCase() === "L1")?.price || "₹4,999"})</strong>, <strong>Level 2 ({levelTiers.find((t: any) => (t.code || "").toUpperCase() === "L2")?.price || "₹19,999"})</strong>, or <strong>Level 3 ({levelTiers.find((t: any) => (t.code || "").toUpperCase() === "L3")?.price || "₹59,999"})</strong>.
            </p>
            <div className="rounded-2xl border border-stone-200 bg-[#faf8f5] p-4 mb-6 text-left">
              <div className="flex justify-between text-xs font-bold text-stone-600">
                <span>Your Current Membership:</span>
                <span className="text-[#942008] font-bold">{stats?.membershipLevel || "Fast Track (L0)"}</span>
              </div>
            </div>
            <button
              onClick={() => setPurchaseModal({ isOpen: true, tierCode: "L1" })}
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#942008] via-[#c4431d] to-[#ea580c] hover:opacity-95 text-white font-bold text-sm h-11 px-8 rounded-xl shadow-md shadow-[#c4431d]/20 hover:scale-105 transition-all cursor-pointer"
            >
              <Zap size={16} /> Upgrade to Silver &amp; Unlock Live Classes
            </button>
          </div>
        ) : activeTab === "upcoming" ? (
          upcomingEvents.length === 0 ? (
            <div className="text-center py-16 rounded-3xl border border-dashed border-stone-200 bg-white/95 p-8">
              <Calendar size={36} className="text-slate-600 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-stone-900 mb-1">No Upcoming Classes Scheduled Yet</h3>
              <p className="text-sm text-stone-500">The mentor will post the next live Masterclass schedule shortly.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.map((ev) => (
                <div
                  key={ev.id}
                  className="rounded-3xl border border-stone-200 bg-white/95 p-6 flex flex-col justify-between hover:border-[#ecdccb] transition-all shadow-xl"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className={`rounded-md px-2.5 py-0.5 text-xs font-black uppercase tracking-wider ${
                        ev.status === "live"
                          ? "bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse"
                          : "bg-[#fde5d6] text-[#942008] border border-[#f5ded0]"
                      }`}>
                        {ev.status === "live" ? "🔴 Live Now" : "Upcoming Live"}
                      </span>

                      <span className="rounded-md bg-stone-100 border border-stone-300 px-2 py-0.5 text-xs font-bold text-stone-600">
                        🎯 {ev.targetLevel === "All" ? "All Levels" : ev.targetLevel}
                      </span>

                      {ev.isAttended && (
                        <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-md flex items-center gap-1">
                          <CheckCircle2 size={12} /> Attended
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg font-black text-stone-900 mb-2 leading-snug">{ev.title}</h3>
                    <p className="text-xs text-stone-500 leading-relaxed mb-4">
                      {ev.description || "Live resin coaching and interactive techniques with Vrajangna Patel."}
                    </p>

                    <div className="rounded-2xl bg-[#faf8f5] border border-stone-200/80 p-3.5 mb-4 space-y-1.5 text-xs">
                      <p className="font-semibold text-stone-900 flex items-center gap-2">
                        <Calendar size={13} className="text-[#942008]" />{" "}
                        {new Date(ev.scheduledAt).toLocaleDateString("en-IN", {
                          weekday: "short",
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                      <p className="text-stone-500 flex items-center gap-2">
                        <Clock size={13} className="text-amber-500" /> Duration: {ev.durationMinutes || 60} Minutes
                      </p>
                      <p className="text-stone-500 flex items-center gap-2">
                        <Users size={13} className="text-stone-500" /> Mentor: {ev.instructor || "Vrajangna Patel"}
                      </p>
                    </div>
                  </div>

                  {isClassEligibleForStudent(ev) ? (
                    <button
                      onClick={() => handleJoinClass(ev.id, ev.meetingUrl)}
                      disabled={joiningClassId === ev.id}
                      className="self-start inline-flex items-center gap-1.5 bg-gradient-to-r from-[#b53310] via-[#c4431d] to-[#ea580c] hover:opacity-95 text-white font-bold text-xs py-2 px-3.5 sm:px-4 rounded-xl shadow-sm hover:scale-[1.02] transition-all cursor-pointer"
                    >
                      <Video size={14} />
                      <span>
                        {joiningClassId === ev.id
                          ? "Recording Attendance..."
                          : ev.isAttended
                          ? "Re-Join Live Class"
                          : "Join Live Class (+100 XP)"}
                      </span>
                    </button>
                  ) : (
                    <div className="w-full flex items-center justify-between gap-2 p-3 rounded-xl bg-[#faf8f5] border border-stone-200">
                      <div className="text-left">
                        <span className="text-xs font-bold text-stone-600 flex items-center gap-1.5">
                          <Lock size={13} className="text-[#942008]" />
                          Locked for Your Tier
                        </span>
                        <span className="text-xs text-stone-500 block">
                          Access reserved for {ev.targetLevel}
                        </span>
                      </div>
                      <button
                        onClick={() => setPurchaseModal({ isOpen: true, tierCode: ev.targetLevel.split(",")[0].trim() })}
                        className="px-3.5 py-2 bg-gradient-to-r from-[#b53310] via-[#c4431d] to-[#ea580c] hover:opacity-95 text-white font-bold text-xs rounded-xl shadow-sm hover:scale-105 transition-all cursor-pointer whitespace-nowrap"
                      >
                        Upgrade Tier
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )
        ) : (
          /* Past / Replay Tab */
          pastEvents.length === 0 ? (
            <div className="text-center py-16 rounded-3xl border border-dashed border-stone-200 bg-white/95 p-8">
              <Video size={36} className="text-slate-600 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-stone-900 mb-1">No Past Class Recordings Yet</h3>
              <p className="text-sm text-stone-500">Class recordings will appear here after live sessions conclude.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pastEvents.map((ev) => (
                <div
                  key={ev.id}
                  className="rounded-3xl border border-stone-200 bg-white/95 p-6 flex flex-col justify-between hover:border-stone-300 transition-all shadow-xl"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="rounded-md bg-stone-100 border border-stone-200 px-2.5 py-0.5 text-xs font-bold text-stone-600 uppercase tracking-wider">
                        Concluded
                      </span>
                      {ev.isAttended && (
                        <span className="text-xs font-bold text-emerald-500 flex items-center gap-1">
                          <CheckCircle2 size={12} /> You Attended
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg font-black text-stone-900 mb-2 leading-snug">{ev.title}</h3>
                    <p className="text-xs text-stone-500 leading-relaxed mb-4">
                      {ev.description || "Class replay and discussion notes."}
                    </p>
                  </div>

                  {ev.recordingUrl ? (
                    <a
                      href={ev.recordingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="self-start inline-flex items-center gap-1.5 bg-white hover:bg-[#fff9f5] text-stone-900 font-bold text-xs py-2 px-3.5 rounded-xl border border-[#c4431d] shadow-2xs hover:scale-[1.02] transition-all"
                    >
                      <PlayCircle size={14} className="text-[#c4431d]" />
                      <span>Watch Class Replay</span>
                    </a>
                  ) : (
                    <div className="space-y-2">
                      {ev.meetingUrl && (
                        <button
                          onClick={() => handleJoinClass(ev.id, ev.meetingUrl)}
                          className="self-start inline-flex items-center gap-1.5 bg-gradient-to-r from-[#b53310] via-[#c4431d] to-[#ea580c] hover:opacity-95 text-white font-bold text-xs py-2 px-3.5 rounded-xl shadow-sm transition-all cursor-pointer"
                        >
                          <Video size={14} /> Join Live Meeting Room
                        </button>
                      )}
                      <div className="text-center py-2 text-xs text-slate-500 border border-dashed border-stone-200 rounded-xl">
                        Replay processing by mentor
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )
        )}
      </main>

      {/* Upgrade Modal for Locked Students */}
      <TierPurchaseModal
        isOpen={purchaseModal.isOpen}
        onClose={() => setPurchaseModal({ isOpen: false, tierCode: "L1" })}
        targetTierCode={purchaseModal.tierCode}
        currentLevel={stats?.membershipLevel || "Fast Track (L0)"}
        onUpgradeSuccess={fetchData}
      />
    </div>
  );
}
