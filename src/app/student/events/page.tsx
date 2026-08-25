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
  const [eventsList, setEventsList] = useState<any[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }

    const fetchData = async () => {
      try {
        const [statsRes, eventsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/dashboard/student`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API_BASE_URL}/dashboard/events`),
        ]);

        const statsData = await statsRes.json();
        const eventsData = await eventsRes.json();

        setStats(statsData);
        if (eventsData.success && Array.isArray(eventsData.data)) {
          setEventsList(eventsData.data);
        }
      } catch (_) {}
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  const studentLevelCode = getLevelCode(stats?.membershipLevel, stats?.points || 0);
  const isAccessible = ["L1", "L2", "L3", "L3+"].includes(studentLevelCode);

  const nowTime = Date.now();
  const upcomingEvents = eventsList.filter((e) => new Date(e.scheduledAt).getTime() >= nowTime);
  const pastEvents = eventsList.filter((e) => new Date(e.scheduledAt).getTime() < nowTime);

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
              Past / Recordings ({pastEvents.length})
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
              Live interactive Masterclasses, weekly Q&amp;A calls, and live critiques unlock as soon as your account is upgraded to <strong>Level 1 (Silver Membership)</strong> or above.
            </p>
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 mb-6 text-left">
              <div className="flex justify-between text-xs font-bold text-slate-300">
                <span>Your Current Membership:</span>
                <span className="text-orange-400 font-bold">{stats?.membershipLevel || "L0 Fast Track"}</span>
              </div>
            </div>
            <Link
              href="/student/courses"
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-black text-sm h-11 px-8 rounded-xl shadow-lg shadow-orange-500/20 hover:scale-105 transition-all"
            >
              Explore Available Courses
            </Link>
          </div>
        ) : activeTab === "upcoming" ? (
          upcomingEvents.length === 0 ? (
            <div className="text-center py-16 rounded-3xl border border-dashed border-slate-800 bg-slate-900/40 p-8">
              <Calendar size={36} className="text-slate-600 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-white mb-1">No Upcoming Events Scheduled Yet</h3>
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
                      <span className="rounded-md bg-orange-500/10 border border-orange-500/30 px-2.5 py-0.5 text-[11px] font-bold text-orange-400 uppercase tracking-wider">
                        {ev.status || "Upcoming Live"}
                      </span>
                      <span className="text-xs text-slate-400 font-semibold flex items-center gap-1">
                        <Clock size={13} className="text-slate-400" /> {ev.durationMinutes || 90} Mins
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white mb-2 leading-snug">{ev.title}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed mb-4">{ev.description || "Live resin coaching and interactive techniques with Vrajangna Patel."}</p>

                    <div className="rounded-xl bg-slate-950/80 border border-slate-800/80 p-3 mb-4 space-y-1 text-xs">
                      <p className="font-semibold text-white flex items-center gap-1.5">
                        <Calendar size={13} className="text-orange-400" />{" "}
                        {new Date(ev.scheduledAt).toLocaleDateString("en-IN", {
                          weekday: "short",
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                      <p className="text-slate-400 flex items-center gap-1.5">
                        <Users size={13} className="text-slate-400" /> Mentor: Vrajangna Patel
                      </p>
                    </div>
                  </div>

                  <a
                    href={ev.zoomJoinUrl || "https://zoom.us"}
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
          )
        ) : (
          pastEvents.length === 0 ? (
            <div className="text-center py-16 rounded-3xl border border-dashed border-slate-800 bg-slate-900/40 p-8">
              <Play size={36} className="text-slate-600 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-white mb-1">No Past Recordings Yet</h3>
              <p className="text-sm text-slate-400">Recordings of completed live masterclasses will appear here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pastEvents.map((rec) => (
                <div
                  key={rec.id}
                  className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 flex flex-col justify-between hover:border-orange-500/40 transition-all shadow-xl"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                      <span>{new Date(rec.scheduledAt).toLocaleDateString("en-IN")}</span>
                      <span>{rec.durationMinutes || 90} Mins</span>
                    </div>
                    <h3 className="text-base font-bold text-white mb-2">{rec.title}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">{rec.description}</p>
                  </div>
                  {rec.prepVideoUrl ? (
                    <a
                      href={rec.prepVideoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs h-10 px-4 rounded-xl border border-slate-700 transition-all cursor-pointer w-full mt-4"
                    >
                      <Play size={14} className="text-orange-400 fill-orange-400" /> Watch Recording
                    </a>
                  ) : (
                    <button
                      disabled
                      className="inline-flex items-center justify-center gap-2 bg-slate-800/40 text-slate-500 font-bold text-xs h-10 px-4 rounded-xl border border-slate-800 w-full mt-4 cursor-not-allowed"
                    >
                      Recording Processing
                    </button>
                  )}
                </div>
              ))}
            </div>
          )
        )}
      </main>
    </div>
  );
}
