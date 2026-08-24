"use client";

import React, { useState, useEffect } from "react";
import { StudentNav, getLevelCode } from "@/components/layout/StudentNav";
import { API_BASE_URL } from "@/config/api";
import { Calendar, Video, Clock, Users, ExternalLink, Lock, Sparkles, CheckCircle2, Play, Flame, ShieldAlert } from "lucide-react";
import Link from "next/link";

export default function StudentEventsPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }

    const fetchStats = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/dashboard/student`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setStats(data);
      } catch (_) {}
      setLoading(false);
    };

    fetchStats();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  const studentLevelCode = getLevelCode(stats?.membershipLevel, stats?.points || 0);
  const isAccessible = ["L1", "L2", "L3", "L3+"].includes(studentLevelCode);

  const upcomingEvents = [
    {
      id: "ev-1",
      title: "Resin Chemistry & Zero-Bubble Glass Finish Masterclass",
      date: "Sunday, 8:00 PM IST",
      duration: "90 Mins",
      host: "Vrajangna Patel",
      type: "Live Workshop",
      badge: "Members Only",
      zoomUrl: "https://zoom.us/j/sample-masterclass-link",
      description: "Deep-dive into 3:1 vs 2:1 viscosity ratios, heat gun wave manipulation, and fixing tacky resin surfaces.",
    },
    {
      id: "ev-2",
      title: "Weekly VIP Artist Q&A & Pricing Clinic",
      date: "Wednesday, 7:30 PM IST",
      duration: "60 Mins",
      host: "Vrajangna Patel",
      type: "Q&A Session",
      badge: "Weekly Live",
      zoomUrl: "https://zoom.us/j/sample-qa-clinic",
      description: "Live review of student artwork, quote pricing guidance for bridal garlands, and custom commission critiques.",
    },
    {
      id: "ev-3",
      title: "Bridal Flower Preservation 3D Mold Demo",
      date: "Next Saturday, 6:00 PM IST",
      duration: "120 Mins",
      host: "Vrajangna Patel",
      type: "Special Masterclass",
      badge: "High-Ticket Focus",
      zoomUrl: "https://zoom.us/j/sample-bridal-demo",
      description: "Step-by-step silica gel preservation and multi-layer deep casting without yellowing.",
    },
  ];

  const pastRecordings = [
    {
      id: "rec-1",
      title: "Mastering Ocean Waves with White Pigment Paste",
      date: "Last Week",
      duration: "85 Mins",
      views: "1,240 Views",
      thumbnail: "/images/events/wave-masterclass.jpg",
    },
    {
      id: "rec-2",
      title: "How to Price Resin Geode Clocks for ₹5,000+ Margins",
      date: "2 Weeks Ago",
      duration: "70 Mins",
      views: "980 Views",
      thumbnail: "/images/events/pricing-clinic.jpg",
    },
  ];

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
              <Calendar size={13} className="text-orange-400" /> Live Events &amp; Masterclasses
            </span>
            <h1 className="text-2xl md:text-4xl font-black text-white">
              Live Mentorship &amp; Masterclasses
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Join live interactive training sessions, pricing clinics, and get direct feedback from Vrajangna Patel.
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
              Replay Vault ({pastRecordings.length})
            </button>
          </div>
        </div>

        {/* Access Check */}
        {!isAccessible ? (
          <div className="rounded-3xl border border-orange-500/40 bg-slate-900/90 p-8 md:p-12 text-center max-w-2xl mx-auto shadow-2xl">
            <div className="size-16 rounded-3xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400 mx-auto mb-4">
              <Lock size={32} />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-orange-400 block mb-1">
              Level 1 (Silver Membership) Required
            </span>
            <h2 className="text-2xl font-black text-white mb-3">
              Live Events &amp; Q&amp;A Calls are Locked
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed mb-6">
              Live interactive Masterclasses, weekly Q&amp;A calls, and live critiques unlock as soon as you reach <strong>Level 1 (Silver)</strong> with <strong>500 XP</strong>.
            </p>
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 mb-6 text-left">
              <div className="flex justify-between text-xs font-bold text-slate-300 mb-2">
                <span>Current: {stats?.membershipLevel || "L0 Fast Track"}</span>
                <span className="text-orange-400">{stats?.points || 0} / 500 XP</span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-400"
                  style={{ width: `${Math.min(100, Math.round(((stats?.points || 0) / 500) * 100))}%` }}
                ></div>
              </div>
            </div>
            <Link
              href="/student/courses"
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-black text-sm h-11 px-8 rounded-xl shadow-lg shadow-orange-500/20 hover:scale-105 transition-all"
            >
              Complete Course Lessons to Earn XP
            </Link>
          </div>
        ) : activeTab === "upcoming" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingEvents.map((ev) => (
              <div
                key={ev.id}
                className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 flex flex-col justify-between hover:border-orange-500/40 transition-all shadow-xl"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="rounded-md bg-orange-500/10 border border-orange-500/30 px-2.5 py-0.5 text-[11px] font-bold text-orange-400 uppercase tracking-wider">
                      {ev.badge}
                    </span>
                    <span className="text-xs text-slate-400 font-semibold flex items-center gap-1">
                      <Clock size={13} className="text-slate-400" /> {ev.duration}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2 leading-snug">{ev.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed mb-4">{ev.description}</p>

                  <div className="rounded-xl bg-slate-950/80 border border-slate-800/80 p-3 mb-4 space-y-1 text-xs">
                    <p className="font-semibold text-white flex items-center gap-1.5">
                      <Calendar size={13} className="text-orange-400" /> {ev.date}
                    </p>
                    <p className="text-slate-400 flex items-center gap-1.5">
                      <Users size={13} className="text-slate-400" /> Mentor: {ev.host}
                    </p>
                  </div>
                </div>

                <a
                  href={ev.zoomUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-black text-xs h-10 px-4 rounded-xl shadow-md transition-all hover:scale-[1.02] cursor-pointer w-full"
                >
                  <Video size={15} /> Join Live Zoom Room
                  <ExternalLink size={13} />
                </a>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pastRecordings.map((rec) => (
              <div
                key={rec.id}
                className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 flex flex-col justify-between hover:border-orange-500/40 transition-all shadow-xl"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                    <span>{rec.date}</span>
                    <span>{rec.views}</span>
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">{rec.title}</h3>
                </div>
                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs h-10 px-4 rounded-xl border border-slate-700 transition-all cursor-pointer w-full mt-4"
                >
                  <Play size={14} className="text-orange-400 fill-orange-400" /> Watch Full Replay ({rec.duration})
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
