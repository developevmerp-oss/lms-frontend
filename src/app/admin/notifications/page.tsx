"use client";

import React, { useState, useEffect, useRef } from "react";
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
  ArrowRight,
  Eye,
  X,
  Loader2,
  ChevronDown,
  Check,
} from "lucide-react";
import { ListSkeleton } from "@/components/ui/SkeletonLoader";
import { API_BASE_URL } from "@/config/api";

const TARGET_AUDIENCE_OPTIONS = [
  { id: "all", label: "All Students (Global Broadcast)", icon: "👥", color: "text-[#942008]", bg: "bg-[#fde5d6]", border: "border-[#f5ded0]" },
  { id: "L0", label: "Level 0: Fast Track Students", icon: "🌱", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/30" },
  { id: "L1", label: "Level 1: Silver Members", icon: "🥈", color: "text-stone-700", bg: "bg-stone-100", border: "border-stone-200" },
  { id: "L2", label: "Level 2: Gold Members", icon: "🥇", color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/30" },
  { id: "L3", label: "Level 3: Diamond Club", icon: "💎", color: "text-cyan-400", bg: "bg-cyan-500/10", border: "border-cyan-500/30" },
  { id: "general", label: "General Members (No Level)", icon: "👤", color: "text-indigo-400", bg: "bg-indigo-500/10", border: "border-indigo-500/30" },
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
  const [viewingItem, setViewingItem] = useState<any | null>(null);

  const fetchHistory = async () => {
    if (!token) return;
    try {
      setIsLoadingHistory(true);
      const res = await fetch(`${API_BASE_URL}/admin/notifications`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      // Backend returns paginated {data:[...], total, page} — unwrap safely
      const list = data?.data ?? (Array.isArray(data) ? data : []);
      setHistory(list);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingHistory(false);
    }
  };


  const [liveLevels, setLiveLevels] = useState<any[]>([]);
  const [standaloneCourses, setStandaloneCourses] = useState<any[]>([]);
  const [isAudienceDropdownOpen, setIsAudienceDropdownOpen] = useState(false);
  const audienceDropdownRef = useRef<HTMLDivElement>(null);

  const fetchLiveLevels = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE_URL}/admin/levels`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) setLiveLevels(data);
    } catch (err) { console.error(err); }
  };

  const fetchStandaloneCourses = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/courses`);
      const data = await res.json();
      if (Array.isArray(data)) {
        const standalone = data.filter((c: any) => !c.levelCode || c.levelCode === 'NONE' || String(c.levelCode).trim() === '');
        setStandaloneCourses(standalone);
      }
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (audienceDropdownRef.current && !audienceDropdownRef.current.contains(e.target as Node)) {
        setIsAudienceDropdownOpen(false);
      }
    };
    if (isAudienceDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isAudienceDropdownOpen]);

  useEffect(() => {
    if (token) {
      fetchHistory();
      fetchLiveLevels();
      fetchStandaloneCourses();
    }
  }, [token]);

  const targetAudienceOptions = [
    {
      id: "all",
      code: "ALL",
      name: "All Students (Global Broadcast)",
      label: "All Students (Global Broadcast)",
      icon: "👥",
      group: "Global",
    },
    ...(liveLevels.length > 0
      ? liveLevels.map((l: any) => ({
          id: l.code,
          code: l.code,
          name: l.name || l.title || l.code,
          label: `${l.code}: ${l.name || l.title || l.code}`,
          icon: l.icon || "⚡",
          group: "Level Memberships",
        }))
      : TARGET_AUDIENCE_OPTIONS.slice(1, 5).map((t) => ({
          id: t.id,
          code: t.id.toUpperCase(),
          name: t.label.split(":")[1]?.trim() || t.label,
          label: t.label,
          icon: t.icon,
          group: "Level Memberships",
        }))
    ),
    {
      id: "standalone",
      code: "STANDALONE",
      name: "All Standalone Students",
      label: "Standalone Students (Individual Masterclasses)",
      icon: "✨",
      group: "Standalone Courses",
    },
    ...standaloneCourses.map((c: any) => ({
      id: `course_${c.id}`,
      code: "STANDALONE COURSE",
      name: c.title,
      label: `${c.title} (Standalone Masterclass)`,
      icon: "🎨",
      group: "Standalone Courses",
    })),
    {
      id: "webinar",
      code: "WEBINAR",
      name: "Webinar Leads & Attendees",
      label: "Webinar Leads & Attendees",
      icon: "🎟️",
      group: "Webinar & Leads",
    },
  ];

  const selectedAudience =
    targetAudienceOptions.find((o) => o.id === form.targetAudience) || targetAudienceOptions[0];

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
    <div
      className="min-h-screen bg-[#faf8f5] text-stone-900 flex flex-col font-sans transition-colors lg:pl-64"
      style={{
        backgroundColor: "#faf8f5",
        backgroundImage: "radial-gradient(circle, #e2ded4 1.5px, transparent 1.5px)",
        backgroundSize: "24px 24px",
        backgroundAttachment: "fixed",
      }}
    >
      <AdminNav user={user} logout={logout} />

      <main className="w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {successMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm md:text-base lg:text-sm font-bold flex items-center gap-2">
            <CheckCircle2 size={18} className="shrink-0" /> {successMsg}
          </div>
        )}

        {errorMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-sm md:text-base lg:text-sm font-bold flex items-center gap-2">
            <AlertTriangle size={18} className="shrink-0" /> {errorMsg}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-12 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,1.5fr)_minmax(0,1.15fr)] gap-5 xl:gap-6 items-start">

          {/* Left Column: Audience & Presets */}
          <div className="md:col-span-5 xl:col-span-1 bg-white/95 border border-[#ecdccb] rounded-3xl p-5 sm:p-6 shadow-[0_10px_30px_-12px_rgba(90,55,20,0.08)] space-y-6">
            <h2 className="text-base md:text-xl lg:text-lg font-black text-stone-900 flex items-center gap-2">
              <Users size={18} className="text-[#c4431d] shrink-0" /> Audience &amp; Presets
            </h2>

            {/* Quick Templates */}
            <div>
              <span className="text-xs md:text-sm lg:text-xs font-bold text-stone-700 flex items-center gap-1.5 mb-2.5">
                ⚡ Quick Presets / Templates:
              </span>
              <div className="grid grid-cols-1 gap-2">
                {QUICK_TEMPLATES.map((tpl, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => applyTemplate(tpl)}
                    className="w-full text-left px-3 py-2.5 rounded-xl bg-[#fcfaf7] border border-stone-200 hover:border-[#c4431d]/40 hover:bg-[#fff5ee]/60 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between gap-2 text-xs md:text-sm lg:text-xs font-bold text-stone-800 group-hover:text-[#942008]">
                      <span className="truncate">{tpl.title}</span>
                      <ArrowRight size={13} className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 1. Target Audience Segment - Dropdown List */}
            <div>
              <label className="block text-xs md:text-sm lg:text-xs font-bold text-stone-700 mb-2 flex items-center gap-1.5">
                <Users size={14} className="text-[#c4431d] shrink-0" /> Select Target Student Segment:
              </label>

              <div className="relative" ref={audienceDropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsAudienceDropdownOpen((prev) => !prev)}
                  className={`w-full p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isAudienceDropdownOpen
                      ? "bg-[#fff5ee] border-[#c4431d] ring-2 ring-[#c4431d]/15 shadow-sm"
                      : "bg-[#fcfaf7] border-stone-200 hover:border-[#c4431d]/60 shadow-xs"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-xl shrink-0 leading-none">{selectedAudience?.icon}</span>
                    <div className="min-w-0 flex flex-col">
                      <span className="text-xs font-black text-[#942008] uppercase tracking-wide leading-tight">
                        {selectedAudience?.code || selectedAudience?.id.toUpperCase()}
                      </span>
                      <span className="text-xs md:text-sm lg:text-xs font-bold text-stone-800 truncate leading-snug">
                        {selectedAudience?.name || selectedAudience?.label}
                      </span>
                    </div>
                  </div>
                  <ChevronDown
                    size={18}
                    className={`text-stone-400 shrink-0 transition-transform duration-200 ${
                      isAudienceDropdownOpen ? "rotate-180 text-[#c4431d]" : ""
                    }`}
                  />
                </button>

                {isAudienceDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1.5 z-50 bg-white border border-[#ecdccb] rounded-2xl shadow-[0_16px_36px_-8px_rgba(90,55,20,0.18)] max-h-80 overflow-y-auto p-1.5 divide-y divide-stone-100 animate-in fade-in zoom-in-95 duration-150">
                    {[
                      { groupName: "Global", items: targetAudienceOptions.filter((o) => o.group === "Global") },
                      { groupName: "Level Memberships", items: targetAudienceOptions.filter((o) => o.group === "Level Memberships") },
                      { groupName: "Standalone Courses", items: targetAudienceOptions.filter((o) => o.group === "Standalone Courses") },
                      { groupName: "Webinar & Leads", items: targetAudienceOptions.filter((o) => o.group === "Webinar & Leads") },
                    ]
                      .filter((g) => g.items.length > 0)
                      .map((grp) => (
                        <div key={grp.groupName} className="py-1 first:pt-0 last:pb-0">
                          <div className="px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-stone-400">
                            {grp.groupName}
                          </div>
                          <div className="space-y-0.5">
                            {grp.items.map((opt: any) => {
                              const isSelected = form.targetAudience === opt.id;
                              return (
                                <button
                                  key={opt.id}
                                  type="button"
                                  onClick={() => {
                                    setForm({ ...form, targetAudience: opt.id });
                                    setIsAudienceDropdownOpen(false);
                                  }}
                                  className={`w-full px-3 py-2 rounded-xl text-left transition-all cursor-pointer flex items-center justify-between gap-3 ${
                                    isSelected
                                      ? "bg-[#fff5ee] text-[#942008] border border-[#f5ded0] font-bold"
                                      : "hover:bg-[#faf8f5] text-stone-700"
                                  }`}
                                >
                                  <div className="flex items-center gap-2.5 min-w-0">
                                    <span className="text-base shrink-0 leading-none">{opt.icon}</span>
                                    <div className="min-w-0 flex flex-col">
                                      <span
                                        className={`text-[11px] font-black uppercase leading-tight ${
                                          isSelected ? "text-[#942008]" : "text-stone-900"
                                        }`}
                                      >
                                        {opt.code}
                                      </span>
                                      <span className="text-xs text-stone-500 truncate font-medium">
                                        {opt.name || opt.label}
                                      </span>
                                    </div>
                                  </div>
                                  {isSelected && <Check size={16} className="text-[#c4431d] shrink-0" />}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>

            {/* 2. Notification Type */}
            <div>
              <label className="block text-xs md:text-sm lg:text-xs font-bold text-stone-700 mb-2.5 flex items-center gap-1.5">
                <Tag size={14} className="text-[#c4431d] shrink-0" /> Notification Category:
              </label>
              <div className="flex flex-col gap-2">
                {NOTIFICATION_TYPES.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setForm({ ...form, type: t.id })}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-xs md:text-sm lg:text-xs font-bold transition-all cursor-pointer flex items-center gap-2.5 text-left ${
                      form.type === t.id
                        ? "bg-[#fff5ee] border-[#c4431d] text-[#942008] font-black shadow-xs"
                        : "bg-[#fcfaf7] border-stone-200 text-stone-700 hover:text-stone-900 hover:border-stone-300"
                    }`}
                  >
                    <span className="shrink-0">{t.icon}</span>
                    <span className="truncate">{t.label.split("/")[0]}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Center Column: Broadcast Composer */}
          <div className="md:col-span-7 xl:col-span-1 bg-white/95 border border-[#ecdccb] rounded-3xl p-5 sm:p-6 shadow-[0_10px_30px_-12px_rgba(90,55,20,0.08)] flex flex-col">
            <h2 className="text-base md:text-xl lg:text-lg font-black text-stone-900 mb-5 flex items-center gap-2">
              <Send size={18} className="text-[#c4431d] shrink-0" /> Compose Broadcast Notification
            </h2>

            <form onSubmit={handleSendBroadcast} className="space-y-5 flex-1 flex flex-col">
              {/* 3. Title */}
              <div>
                <label className="block text-xs md:text-sm lg:text-xs font-bold text-stone-700 mb-1.5">Notification Title</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full bg-[#fcfaf7] border border-stone-300 rounded-xl px-4 py-3 text-sm md:text-base lg:text-sm text-stone-900 placeholder:text-stone-400 focus:bg-white focus:outline-none focus:border-[#c4431d] focus:ring-2 focus:ring-[#c4431d]/15 transition-all"
                  placeholder="e.g. 🔥 Special 20% OFF Offer on Resin Art Clocks!"
                />
              </div>

              {/* 4. Message Content */}
              <div className="flex-1 flex flex-col">
                <label className="block text-xs md:text-sm lg:text-xs font-bold text-stone-700 mb-1.5">Message / Details</label>
                <textarea
                  rows={8}
                  required
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full min-h-[11rem] flex-1 bg-[#fcfaf7] border border-stone-300 rounded-xl p-3.5 text-sm md:text-base lg:text-sm text-stone-900 placeholder:text-stone-400 focus:bg-white focus:outline-none focus:border-[#c4431d] focus:ring-2 focus:ring-[#c4431d]/15 resize-y leading-relaxed transition-all"
                  placeholder="Write clear instructions, offer details, Zoom links, or deadlines..."
                />
              </div>

              {/* 5. Destination Link */}
              <div>
                <label className="block text-xs md:text-sm lg:text-xs font-bold text-stone-700 mb-1.5 flex items-center gap-1.5">
                  <LinkIcon size={13} className="text-[#c4431d] shrink-0" /> Redirect Action Link (Optional)
                </label>
                <div className="flex flex-wrap items-center gap-2">
                  <input
                    type="text"
                    value={form.link}
                    onChange={(e) => setForm({ ...form, link: e.target.value })}
                    className="flex-1 min-w-[11rem] bg-[#fcfaf7] border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs md:text-sm lg:text-xs text-stone-900 placeholder:text-stone-400 focus:bg-white focus:outline-none focus:border-[#c4431d] focus:ring-2 focus:ring-[#c4431d]/15 font-mono transition-all"
                    placeholder="/student/courses or https://..."
                  />
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, link: "/student/courses" })}
                      className="px-2.5 py-1.5 text-xs md:text-sm lg:text-xs font-bold rounded-lg bg-stone-100 text-stone-700 hover:bg-[#fff5ee] hover:text-[#942008] border border-stone-200 transition-colors cursor-pointer whitespace-nowrap"
                    >
                      Courses
                    </button>
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, link: "/student/classes" })}
                      className="px-2.5 py-1.5 text-xs md:text-sm lg:text-xs font-bold rounded-lg bg-stone-100 text-stone-700 hover:bg-[#fff5ee] hover:text-[#942008] border border-stone-200 transition-colors cursor-pointer whitespace-nowrap"
                    >
                      Live Classes
                    </button>
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, link: "/student/webinar" })}
                      className="px-2.5 py-1.5 text-xs md:text-sm lg:text-xs font-bold rounded-lg bg-stone-100 text-stone-700 hover:bg-[#fff5ee] hover:text-[#942008] border border-stone-200 transition-colors cursor-pointer whitespace-nowrap"
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
                className="w-full py-3.5 md:py-4 rounded-2xl bg-gradient-to-r from-[#942008] via-[#c4431d] to-[#ea580c] hover:opacity-95 disabled:opacity-60 text-white font-black text-sm md:text-base lg:text-sm transition-all shadow-md shadow-[#c4431d]/25 hover:scale-[1.01] cursor-pointer flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <Loader2 size={16} className="animate-spin shrink-0" />
                ) : (
                  <Send size={16} className="shrink-0" />
                )}
                <span>{isSubmitting ? "Broadcasting to Students..." : ` Broadcast to ${selectedAudience?.code || form.targetAudience.toUpperCase()} Students`}</span>
              </button>
            </form>
          </div>

          {/* Right Column: Live Student Notification Preview & History */}
          <div className="md:col-span-12 xl:col-span-1 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-5 xl:gap-6">
            
            {/* Live Student Preview Card */}
            <div className="bg-white/95 border border-[#ecdccb] rounded-3xl p-5 sm:p-6 shadow-[0_10px_30px_-12px_rgba(90,55,20,0.08)]">
              <h3 className="text-sm md:text-lg lg:text-base font-black text-stone-900 mb-3.5 flex items-center gap-2">
                <Bell size={16} className="text-[#c4431d] shrink-0" /> Live Student View Preview:
              </h3>

              <div className="bg-[#fcfaf7] border border-[#f5ded0] rounded-2xl p-4 shadow-xs">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#fff5ee] border border-[#f5ded0] flex items-center justify-center text-[#c4431d] shrink-0">
                    <Bell size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1.5 flex-wrap">
                      <span className="text-xs md:text-sm lg:text-xs font-bold text-[#942008] bg-[#fde5d6] px-2 py-0.5 rounded-md uppercase tracking-wider">
                        {form.type.toUpperCase()} • {selectedAudience?.code || form.targetAudience.toUpperCase()}
                      </span>
                      <span className="text-xs md:text-sm lg:text-xs text-stone-400 font-medium">Just Now</span>
                    </div>
                    <h4 className="text-sm md:text-base lg:text-sm font-black text-stone-900 leading-snug break-words">
                      {form.title || "Notification Title Here..."}
                    </h4>
                    <p className="text-xs md:text-sm lg:text-xs text-stone-600 mt-1 leading-relaxed break-words">
                      {form.message || "Your message preview will render here for students on mobile and desktop."}
                    </p>
                    {form.link && (
                      <div className="mt-2.5 text-xs md:text-sm lg:text-xs font-bold text-[#c4431d] flex items-center gap-1 break-all">
                        <span>Click to Open: {form.link}</span>
                        <ArrowRight size={12} className="shrink-0" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Broadcast History */}
            <div className="bg-white/95 border border-[#ecdccb] rounded-3xl p-5 sm:p-6 shadow-[0_10px_30px_-12px_rgba(90,55,20,0.08)]">
              <div className="flex items-center justify-between gap-2 mb-4">
                <h3 className="text-sm md:text-lg lg:text-base font-black text-stone-900 flex items-center gap-2">
                  <Clock size={16} className="text-stone-400 shrink-0" /> Recent Broadcasts
                </h3>
                <button
                  type="button"
                  onClick={fetchHistory}
                  className="text-xs md:text-sm lg:text-xs text-[#c4431d] hover:underline font-bold cursor-pointer shrink-0"
                >
                  Refresh
                </button>
              </div>

              {isLoadingHistory ? (
                <ListSkeleton count={4} />
              ) : history.length === 0 ? (
                <div className="py-8 text-center text-xs md:text-sm lg:text-xs text-stone-400 font-medium border border-dashed border-stone-200 rounded-2xl">
                  No notifications broadcasted yet.
                </div>
              ) : (
                <div className="space-y-2.5 max-h-[26rem] overflow-y-auto pr-1 [scrollbar-width:thin] [scrollbar-color:#a8a29e_transparent]">
                  {history.slice(0, 15).map((n) => (
                    <div
                      key={n.id}
                      className="p-3.5 bg-[#fcfaf7] border border-stone-200/90 rounded-2xl hover:border-[#c4431d]/30 transition-colors"
                    >
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="px-2 py-0.5 rounded-md text-[0.6875rem] font-black bg-[#fde5d6] text-[#942008] border border-[#f5ded0]">
                            {n.targetAudience?.toUpperCase() || "ALL"}
                          </span>
                          <span className={`px-2 py-0.5 rounded-md text-[0.6875rem] font-bold ${
                            n.isRead
                              ? 'bg-stone-100 text-stone-600 border border-stone-200'
                              : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                          }`}>
                            {n.isRead ? 'Seen' : 'Unseen'}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-[0.6875rem] text-stone-400 font-mono mr-1">
                            {new Date(n.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}
                          </span>
                          <button
                            type="button"
                            onClick={() => setViewingItem(n)}
                            className="p-1.5 rounded-lg bg-white hover:bg-stone-100 border border-stone-200 text-stone-600 hover:text-[#942008] transition-colors cursor-pointer"
                            title="View Broadcast Details"
                            aria-label="View"
                          >
                            <Eye size={13} />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setForm({
                                title: n.title || "",
                                message: n.message || "",
                                targetAudience: n.targetAudience || "all",
                                type: n.type || "offer",
                                link: n.link || "/student/courses",
                              });
                            }}
                            className="p-1.5 rounded-lg bg-white hover:bg-[#fff5ee] border border-[#f5ded0] text-[#c4431d] transition-colors cursor-pointer"
                            title="Resend / Load in Composer"
                            aria-label="Resend"
                          >
                            <Send size={13} />
                          </button>
                        </div>
                      </div>
                      <h5 className="text-sm font-bold text-stone-900 truncate">{n.title}</h5>
                      <p className="text-xs text-stone-500 line-clamp-1 mt-0.5">{n.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

        </div>

        {/* View Modal */}
        {viewingItem && (
          <div
            className="fixed inset-0 z-50 bg-stone-900/50 backdrop-blur-xs flex items-center justify-center p-4"
            onClick={() => setViewingItem(null)}
          >
            <div
              className="w-full max-w-lg bg-white border border-[#ecdccb] rounded-3xl p-6 shadow-2xl space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#fff5ee] border border-[#f5ded0] flex items-center justify-center text-[#c4431d] shrink-0">
                    <Bell size={18} />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-stone-900">{viewingItem.title}</h3>
                    <p className="text-xs text-stone-500 font-medium mt-0.5">
                      Target: {viewingItem.targetAudience?.toUpperCase() || 'ALL'}
                      {viewingItem.createdAt
                        ? ` · ${new Date(viewingItem.createdAt).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}`
                        : ''}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setViewingItem(null)}
                  className="w-8 h-8 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="bg-[#fcfaf7] border border-[#ecdccb]/80 rounded-2xl p-4 text-sm text-stone-700 leading-relaxed whitespace-pre-wrap">
                {viewingItem.message}
              </div>

              {viewingItem.link && (
                <div className="text-xs font-mono text-[#c4431d] bg-[#fff5ee] p-2.5 rounded-xl border border-[#f5ded0] break-all">
                  Link: {viewingItem.link}
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                <span
                  className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                    viewingItem.isRead
                      ? 'bg-stone-100 text-stone-500 border border-stone-200'
                      : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                  }`}
                >
                  {viewingItem.isRead ? 'Seen' : 'Unseen'}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setForm({
                      title: viewingItem.title || "",
                      message: viewingItem.message || "",
                      targetAudience: viewingItem.targetAudience || "all",
                      type: viewingItem.type || "offer",
                      link: viewingItem.link || "/student/courses",
                    });
                    setViewingItem(null);
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#942008] via-[#c4431d] to-[#ea580c] text-white text-xs font-bold shadow-sm cursor-pointer"
                >
                  <Send size={13} /> Resend in Composer
                </button>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
