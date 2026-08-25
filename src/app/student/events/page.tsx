"use client";

import React, { useState, useEffect } from "react";
import { StudentNav, getLevelCode } from "@/components/layout/StudentNav";
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
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");
  const [classesList, setClassesList] = useState<any[]>([]);
  const [joiningClassId, setJoiningClassId] = useState<string | null>(null);
  const [joinSuccessMsg, setJoinSuccessMsg] = useState<string>("");
  const [purchaseModal, setPurchaseModal] = useState({ isOpen: false, tierCode: "L1" });

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
    } catch (_) {}
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
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
        setJoinSuccessMsg(`✅ Attendance Recorded! +50 XP Awarded to your profile.`);
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

  const studentLevelCode = getLevelCode(stats?.membershipLevel, stats?.points || 0);
  const isAccessible = ["L1", "L2", "L3", "L3+"].includes(studentLevelCode);

  const nowTime = Date.now();
  const upcomingEvents = classesList.filter((e) => new Date(e.scheduledAt).getTime() >= nowTime || e.status === "live");
  const pastEvents = classesList.filter((e) => new Date(e.scheduledAt).getTime() < nowTime && e.status !== "live");

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      <StudentNav
        user={stats}
        level={stats?.membershipLevel || "Fast Track (L0)"}
        points={stats?.points || 0}
        logout={handleLogout}
        notifications={stats?.notifications}
      />

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-orange-500/30 bg-orange-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-orange-400 mb-2">
              <Calendar size={13} className="text-orange-400" /> Live Interactive Masterclasses
            </span>
            <h1 className="text-2xl md:text-4xl font-black text-white">
              Live Coaching &amp; Attendance Portal
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Join live interactive coaching sessions with Vrajangna Patel. Clicking "Join Live Class" marks your attendance and awards bonus XP.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-1.5 rounded-2xl self-start md:self-auto">
            <button
              onClick={() => setActiveTab("upcoming")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "upcoming"
                  ? "bg-orange-500 text-slate-950 font-black shadow-md shadow-orange-500/20"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Upcoming ({upcomingEvents.length})
            </button>
            <button
              onClick={() => setActiveTab("past")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "past"
                  ? "bg-orange-500 text-slate-950 font-black shadow-md shadow-orange-500/20"
                  : "text-slate-400 hover:text-white"
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
        {!isAccessible ? (
          <div className="rounded-3xl border border-orange-500/40 bg-slate-900/90 p-8 md:p-12 text-center max-w-2xl mx-auto shadow-2xl">
            <div className="w-16 h-16 rounded-3xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400 mx-auto mb-4">
              <Lock size={32} />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-orange-400 block mb-1">
              Level 1 (Silver Member) or Higher Required
            </span>
            <h2 className="text-2xl font-black text-white mb-3">
              Live Masterclasses are Locked for Fast Track
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed mb-6">
              Live interactive masterclasses, weekly Q&amp;A calls, and live portfolio reviews unlock when your account is upgraded to <strong>Silver (₹4,999)</strong>, <strong>Gold (₹19,999)</strong>, or <strong>Diamond (₹59,999)</strong>.
            </p>
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 mb-6 text-left">
              <div className="flex justify-between text-xs font-bold text-slate-300">
                <span>Your Current Membership:</span>
                <span className="text-orange-400 font-bold">{stats?.membershipLevel || "Fast Track (L0)"}</span>
              </div>
            </div>
            <button
              onClick={() => setPurchaseModal({ isOpen: true, tierCode: "L1" })}
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 text-slate-950 font-black text-sm h-11 px-8 rounded-xl shadow-lg shadow-orange-500/20 hover:scale-105 transition-all cursor-pointer"
            >
              <Zap size={16} /> Upgrade to Silver &amp; Unlock Live Classes
            </button>
          </div>
        ) : activeTab === "upcoming" ? (
          upcomingEvents.length === 0 ? (
            <div className="text-center py-16 rounded-3xl border border-dashed border-slate-800 bg-slate-900/40 p-8">
              <Calendar size={36} className="text-slate-600 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-white mb-1">No Upcoming Classes Scheduled Yet</h3>
              <p className="text-sm text-slate-400">The mentor will post the next live Masterclass schedule shortly.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.map((ev) => (
                <div
                  key={ev.id}
                  className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 flex flex-col justify-between hover:border-orange-500/40 transition-all shadow-xl"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className={`rounded-md px-2.5 py-0.5 text-[11px] font-black uppercase tracking-wider ${
                        ev.status === "live"
                          ? "bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse"
                          : "bg-orange-500/10 text-orange-400 border border-orange-500/30"
                      }`}>
                        {ev.status === "live" ? "🔴 Live Now" : "Upcoming Live"}
                      </span>

                      {ev.isAttended && (
                        <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-md flex items-center gap-1">
                          <CheckCircle2 size={12} /> Attended
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg font-black text-white mb-2 leading-snug">{ev.title}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed mb-4">
                      {ev.description || "Live resin coaching and interactive techniques with Vrajangna Patel."}
                    </p>

                    <div className="rounded-2xl bg-slate-950/80 border border-slate-800/80 p-3.5 mb-4 space-y-1.5 text-xs">
                      <p className="font-semibold text-white flex items-center gap-2">
                        <Calendar size={13} className="text-orange-400" />{" "}
                        {new Date(ev.scheduledAt).toLocaleDateString("en-IN", {
                          weekday: "short",
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                      <p className="text-slate-400 flex items-center gap-2">
                        <Clock size={13} className="text-amber-400" /> Duration: {ev.durationMinutes || 60} Minutes
                      </p>
                      <p className="text-slate-400 flex items-center gap-2">
                        <Users size={13} className="text-slate-400" /> Mentor: {ev.instructor || "Vrajangna Patel"}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleJoinClass(ev.id, ev.meetingUrl)}
                    disabled={joiningClassId === ev.id}
                    className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 text-slate-950 font-black text-xs py-3 px-4 rounded-xl shadow-lg shadow-orange-500/20 hover:scale-[1.02] transition-all cursor-pointer"
                  >
                    <Video size={15} />
                    {joiningClassId === ev.id
                      ? "Recording Attendance..."
                      : ev.isAttended
                      ? "Re-Join Live Class Room"
                      : "Join Live Class & Mark Attendance (+50 XP)"}
                  </button>
                </div>
              ))}
            </div>
          )
        ) : (
          /* Past / Replay Tab */
          pastEvents.length === 0 ? (
            <div className="text-center py-16 rounded-3xl border border-dashed border-slate-800 bg-slate-900/40 p-8">
              <Video size={36} className="text-slate-600 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-white mb-1">No Past Class Recordings Yet</h3>
              <p className="text-sm text-slate-400">Class recordings will appear here after live sessions conclude.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pastEvents.map((ev) => (
                <div
                  key={ev.id}
                  className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 flex flex-col justify-between hover:border-slate-700 transition-all shadow-xl"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="rounded-md bg-slate-800 border border-slate-700 px-2.5 py-0.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        Concluded
                      </span>
                      {ev.isAttended && (
                        <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 size={12} /> You Attended
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg font-black text-white mb-2 leading-snug">{ev.title}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed mb-4">
                      {ev.description || "Class replay and discussion notes."}
                    </p>
                  </div>

                  {ev.recordingUrl ? (
                    <a
                      href={ev.recordingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs py-3 px-4 rounded-xl border border-slate-700 transition-colors"
                    >
                      <PlayCircle size={15} className="text-orange-400" /> Watch Class Replay
                    </a>
                  ) : (
                    <div className="text-center py-2 text-xs text-slate-500 border border-dashed border-slate-800 rounded-xl">
                      Replay processing by mentor
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
