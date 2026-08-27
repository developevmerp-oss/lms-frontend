"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { AdminNav } from "@/components/layout/AdminNav";
import {
  Bell,
  Send,
  Users,
  Sparkles,
  Tag,
  Video,
  AlertTriangle,
  Info,
  CheckCircle2,
  Clock,
  Link as LinkIcon,
  Flame,
  Filter,
  Layers,
  ArrowRight
} from "lucide-react";
import { API_BASE_URL } from "@/config/api";

const TARGET_AUDIENCE_OPTIONS = [
  { id: "all", label: "All Students (Global Broadcast)", icon: "👥", color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/30" },
  { id: "L0", label: "Level 0: Fast Track Students", icon: "🌱", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/30" },
  { id: "L1", label: "Level 1: Silver Members", icon: "🥈", color: "text-slate-300", bg: "bg-slate-500/10", border: "border-slate-500/30" },
  { id: "L2", label: "Level 2: Gold Members", icon: "🥇", color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/30" },
  { id: "L3", label: "Level 3: Diamond Club", icon: "💎", color: "text-cyan-400", bg: "bg-cyan-500/10", border: "border-cyan-500/30" },
  { id: "webinar", label: "Webinar Leads & Attendees", icon: "🎟️", color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/30" },
];

const NOTIFICATION_TYPES = [
  { id: "offer", label: "Special Offer / Discount", icon: <Flame size={14} className="text-red-400" />, badgeBg: "bg-red-500/20 text-red-400 border-red-500/40" },
  { id: "event", label: "Live Class / Workshop", icon: <Video size={14} className="text-blue-400" />, badgeBg: "bg-blue-500/20 text-blue-400 border-blue-500/40" },
  { id: "info", label: "General Announcement", icon: <Info size={14} className="text-emerald-400" />, badgeBg: "bg-emerald-500/20 text-emerald-400 border-emerald-500/40" },
  { id: "alert", label: "Important Alert / Reminder", icon: <AlertTriangle size={14} className="text-amber-400" />, badgeBg: "bg-amber-500/20 text-amber-400 border-amber-500/40" },
];

const QUICK_TEMPLATES = [
  {
    type: "offer",
    target: "L0",
    title: "🔥 Special 20% OFF: Upgrade to Silver Membership!",
    message: "Unlock 5 core resin art project modules including Ocean Waves and Coaster casting with a limited-time discount.",
    link: "/student/courses",
  },
  {
    type: "event",
    target: "all",
    title: "🎥 Live Coaching Masterclass this Sunday at 8:00 PM!",
    message: "Join Vrajangna Patel live for deep-dive Q&A and bubble-free resin casting techniques. Mark your attendance for +50 XP!",
    link: "/student/classes",
  },
  {
    type: "webinar",
    target: "webinar",
    title: "🎟️ Exclusive Webinar Prep Video is Now Live!",
    message: "Watch the 3-minute workshop preparation video and download your material checklist before the session starts.",
    link: "/student/webinar",
  },
  {
    type: "offer",
    target: "L1",
    title: "💎 Direct Upgrade to Gold (L2) — Flat ₹2,000 Discount",
    message: "Master luxury Geode art, vein effect, and 3D wave clocks. Limited seats available for this cohort.",
    link: "/student/courses",
  },
];

export default function AdminNotifications() {
  const { token, user, logout } = useAuth();

  const [form, setForm] = useState({
    title: "",
    message: "",
    targetAudience: "all",
    type: "offer",
    link: "/student/courses",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [history, setHistory] = useState<any[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);

  const fetchHistory = async () => {
    if (!token) return;
    try {
      setIsLoadingHistory(true);
      const res = await fetch(`${API_BASE_URL}/admin/notifications`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setHistory(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [token]);

  const handleSendBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.message.trim()) {
      setErrorMsg("Please fill in both title and message.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await fetch(`${API_BASE_URL}/admin/notifications/broadcast`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccessMsg(data.message || "Notification broadcasted successfully!");
        setForm({
          title: "",
          message: "",
          targetAudience: "all",
          type: "offer",
          link: "/student/courses",
        });
        fetchHistory();
      } else {
        setErrorMsg(data.message || "Failed to broadcast notification");
      }
    } catch (err: any) {
      setErrorMsg(err?.message || "Server error broadcasting notification");
    } finally {
      setIsSubmitting(false);
    }
  };

  const applyTemplate = (tpl: any) => {
    setForm({
      title: tpl.title,
      message: tpl.message,
      targetAudience: tpl.target,
      type: tpl.type,
      link: tpl.link,
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col font-sans">
      <AdminNav user={user} logout={logout} />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        
        {/* Header */}
        <header className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-black uppercase tracking-wider mb-2">
                <Bell size={13} /> Targeted Broadcast Center
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Send Notifications to L0, L1, L2, L3 &amp; Webinar Leads
              </h1>
              <p className="text-slate-400 text-sm mt-1">
                Push instant announcements, limited-time discount offers, and class reminders directly to student notification bells.
              </p>
            </div>
          </div>
        </header>

        {successMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-bold flex items-center gap-2">
            <CheckCircle2 size={18} /> {successMsg}
          </div>
        )}

        {errorMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-bold flex items-center gap-2">
            <AlertTriangle size={18} /> {errorMsg}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Form: Broadcast Composer */}
          <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
            <h2 className="text-lg font-black text-white mb-6 flex items-center gap-2">
              <Send size={18} className="text-orange-500" /> Compose Broadcast Notification
            </h2>

            {/* Quick Templates */}
            <div className="mb-6">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                ⚡ Quick Presets / Templates:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {QUICK_TEMPLATES.map((tpl, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => applyTemplate(tpl)}
                    className="text-left p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-orange-500/40 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-300 group-hover:text-orange-400 truncate">
                      <span className="truncate">{tpl.title}</span>
                      <ArrowRight size={12} className="shrink-0 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSendBroadcast} className="space-y-5">
              
              {/* 1. Target Audience Segment */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2 flex items-center gap-1.5">
                  <Users size={14} className="text-orange-500" /> Select Target Student Segment:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {TARGET_AUDIENCE_OPTIONS.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setForm({ ...form, targetAudience: opt.id })}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        form.targetAudience === opt.id
                          ? "bg-orange-500/15 border-orange-500 shadow-md"
                          : "bg-slate-950 border-slate-800 hover:border-slate-700"
                      }`}
                    >
                      <span className="text-lg mb-1">{opt.icon}</span>
                      <span className={`text-xs font-black leading-tight ${form.targetAudience === opt.id ? "text-orange-400" : "text-slate-300"}`}>
                        {opt.id.toUpperCase()}
                      </span>
                      <span className="text-[10px] text-slate-400 truncate mt-0.5">{opt.label.split(":")[0]}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Notification Type */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2 flex items-center gap-1.5">
                  <Tag size={14} className="text-orange-500" /> Notification Category:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {NOTIFICATION_TYPES.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setForm({ ...form, type: t.id })}
                      className={`p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 justify-center ${
                        form.type === t.id
                          ? "bg-slate-950 border-orange-500 text-orange-400 font-black shadow-sm"
                          : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
                      }`}
                    >
                      {t.icon}
                      <span className="truncate">{t.label.split("/")[0]}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Title */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Notification Title</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500"
                  placeholder="e.g. 🔥 Special 20% OFF Offer on Resin Art Clocks!"
                />
              </div>

              {/* 4. Message Content */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Message / Details</label>
                <textarea
                  rows={4}
                  required
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs text-white focus:outline-none focus:border-orange-500 resize-none leading-relaxed"
                  placeholder="Write clear instructions, offer details, Zoom links, or deadlines..."
                />
              </div>

              {/* 5. Destination Link */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1">
                  <LinkIcon size={12} className="text-orange-400" /> Redirect Action Link (Optional)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={form.link}
                    onChange={(e) => setForm({ ...form, link: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500 font-mono"
                    placeholder="/student/courses or https://..."
                  />
                  <div className="flex gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, link: "/student/courses" })}
                      className="px-2.5 py-1 text-[10px] font-bold rounded-lg bg-slate-800 text-slate-300 hover:text-white"
                    >
                      Courses
                    </button>
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, link: "/student/classes" })}
                      className="px-2.5 py-1 text-[10px] font-bold rounded-lg bg-slate-800 text-slate-300 hover:text-white"
                    >
                      Live Classes
                    </button>
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, link: "/student/webinar" })}
                      className="px-2.5 py-1 text-[10px] font-bold rounded-lg bg-slate-800 text-slate-300 hover:text-white"
                    >
                      Webinar
                    </button>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-black text-sm transition-all shadow-xl shadow-orange-500/20 hover:scale-[1.01] cursor-pointer flex items-center justify-center gap-2"
              >
                <Send size={16} />
                <span>{isSubmitting ? "Broadcasting to Students..." : `🚀 Broadcast to ${form.targetAudience.toUpperCase()} Students`}</span>
              </button>
            </form>
          </div>

          {/* Right Column: Live Student Notification Preview & History */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Live Student Preview Card */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-3 flex items-center gap-1.5">
                <Bell size={13} className="text-orange-400" /> Live Student View Preview:
              </span>

              <div className="bg-slate-950 border border-orange-500/30 rounded-2xl p-4 shadow-lg">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400 shrink-0">
                    <Bell size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-[10px] font-bold text-orange-400 uppercase tracking-wider">
                        {form.type.toUpperCase()} • {form.targetAudience.toUpperCase()}
                      </span>
                      <span className="text-[10px] text-slate-500">Just Now</span>
                    </div>
                    <h4 className="text-sm font-black text-white leading-tight">
                      {form.title || "Notification Title Here..."}
                    </h4>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      {form.message || "Your message preview will render here for students on mobile and desktop."}
                    </p>
                    {form.link && (
                      <div className="mt-2 text-[11px] font-bold text-amber-400 flex items-center gap-1">
                        <span>Click to Open: {form.link}</span>
                        <ArrowRight size={11} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Broadcast History */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <Clock size={15} className="text-slate-400" /> Recent Broadcasts
                </h3>
                <button
                  onClick={fetchHistory}
                  className="text-xs text-orange-400 hover:underline font-bold cursor-pointer"
                >
                  Refresh
                </button>
              </div>

              {isLoadingHistory ? (
                <div className="py-8 text-center text-xs text-slate-500">Loading history...</div>
              ) : history.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-500 border border-dashed border-slate-800 rounded-2xl">
                  No notifications broadcasted yet.
                </div>
              ) : (
                <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
                  {history.slice(0, 15).map((n) => (
                    <div
                      key={n.id}
                      className="p-3 bg-slate-950 border border-slate-800 rounded-xl hover:border-slate-700 transition-colors"
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="px-2 py-0.5 rounded-md text-[9px] font-black bg-slate-800 text-orange-400 border border-slate-700">
                          {n.targetAudience?.toUpperCase() || "ALL"}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {new Date(n.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}
                        </span>
                      </div>
                      <h5 className="text-xs font-bold text-white truncate">{n.title}</h5>
                      <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{n.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

        </div>

      </main>
    </div>
  );
}
