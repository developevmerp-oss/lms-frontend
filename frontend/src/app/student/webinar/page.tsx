"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { StudentNav, getLevelCode } from "@/components/layout/StudentNav";
import {
  Sparkles,
  Calendar,
  Clock,
  Video,
  MessageCircle,
  ExternalLink,
  CheckCircle2,
  PlayCircle,
  Flame,
  Users,
  ShieldCheck,
  Zap,
  ArrowRight,
  Search,
  Check,
  X,
  Lock,
} from "lucide-react";
import Link from "next/link";
import { API_BASE_URL } from "@/config/api";
import { TierPurchaseModal } from "@/components/membership/TierPurchaseModal";

interface WebinarEvent {
  id: string;
  title: string;
  description?: string;
  scheduledAt: string;
  durationMinutes: number;
  zoomJoinUrl?: string;
  whatsappGroupUrl?: string;
  prepVideoUrl?: string;
  totalSeats: number;
  status: "upcoming" | "live" | "completed" | "cancelled";
  isActive: boolean;
  attendeesCount?: number;
}

export default function StudentWebinarPage() {
  const { user, token, logout } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [webinars, setWebinars] = useState<WebinarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");
  const [purchaseModal, setPurchaseModal] = useState(false);
  const [activePrepVideo, setActivePrepVideo] = useState<{ isOpen: boolean; title: string; url: string }>({
    isOpen: false,
    title: "",
    url: "",
  });

  const fetchData = async () => {
    if (!token) return;
    setLoading(true);

    try {
      const [statsRes, webinarRes] = await Promise.all([
        fetch(`${API_BASE_URL}/dashboard/student`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_BASE_URL}/webinar/events`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const statsData = await statsRes.json();
      const webinarData = await webinarRes.json();

      setStats(statsData);
      if (webinarData.success && Array.isArray(webinarData.data)) {
        setWebinars(webinarData.data);
      }
    } catch (e) {
      console.error("Error loading webinar data:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  function toYouTubeEmbed(url: string) {
    if (!url) return "";
    if (url.includes("youtube.com/watch")) {
      const id = new URL(url).searchParams.get("v");
      return id ? `https://www.youtube.com/embed/${id}?autoplay=1` : url;
    }
    if (url.includes("youtu.be/")) {
      const id = url.split("youtu.be/")[1]?.split("?")[0];
      return id ? `https://www.youtube.com/embed/${id}?autoplay=1` : url;
    }
    return url;
  }

  const nowTime = Date.now();
  const filteredWebinars = webinars.filter(
    (w) =>
      w.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (w.description || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const upcomingWebinars = filteredWebinars.filter(
    (w) => new Date(w.scheduledAt).getTime() >= nowTime || w.status === "live"
  );
  const pastWebinars = filteredWebinars.filter(
    (w) => new Date(w.scheduledAt).getTime() < nowTime && w.status !== "live"
  );

  const effectiveLevel = user?.membershipLevel || stats?.membershipLevel || "GENERAL";
  const studentLevelCode = getLevelCode(effectiveLevel);
  const isGeneral = studentLevelCode === "GENERAL";

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      <StudentNav
        user={user || stats}
        level={isGeneral ? "General Member" : (user?.membershipLevel || stats?.membershipLevel || "Fast Track (L0)")}
        points={stats?.points || 0}
        logout={logout}
        notifications={stats?.notifications}
      />

      <main className="max-w-6xl mx-auto px-4 md:px-8 py-8 md:py-12 space-y-8">
        {isGeneral ? (
          <div className="py-16 px-4 max-w-2xl mx-auto text-center space-y-6">
            <div className="w-16 h-16 rounded-3xl bg-orange-500/20 border-2 border-orange-500/40 flex items-center justify-center text-orange-400 mx-auto shadow-2xl">
              <Lock size={32} />
            </div>
            <h1 className="text-3xl font-black text-white">Live Webinar Hub is Locked</h1>
            <p className="text-slate-300 text-sm leading-relaxed">
              Live masterclass schedules, Zoom calls, VIP WhatsApp groups, and workshop preparation videos are exclusively available for enrolled Fast Track (Level 0) and higher members. Upgrade to Fast Track now to unlock live masterclasses and community perks.
            </p>
            <button
              onClick={() => setPurchaseModal(true)}
              className="px-8 py-3.5 bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-black rounded-xl text-sm shadow-xl flex items-center gap-2 mx-auto hover:scale-105 transition-all cursor-pointer"
            >
              <Zap size={16} />
              Unlock Fast Track (₹499)
            </button>
          </div>
        ) : (
          <>
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-orange-500/30 bg-orange-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-orange-400 mb-2">
              <Sparkles size={13} className="text-orange-400" /> Free Masterclass Registration
            </span>
            <h1 className="text-3xl md:text-5xl font-black text-white">
              Live Resin Art Webinar Hub
            </h1>
            <p className="text-slate-400 text-sm md:text-base mt-1">
              Select your scheduled masterclass, join the live Zoom call, connect on WhatsApp, and access preparation workshop videos.
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
              Upcoming Webinars ({upcomingWebinars.length})
            </button>
            <button
              onClick={() => setActiveTab("past")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "past"
                  ? "bg-orange-500 text-slate-950 font-black shadow-md shadow-orange-500/20"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Past &amp; Recordings ({pastWebinars.length})
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input
              type="text"
              placeholder="Search webinars..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
            />
          </div>

          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 px-3.5 py-1.5 rounded-xl text-emerald-400 font-bold text-xs">
            <CheckCircle2 size={15} /> VIP Student Access Confirmed
          </div>
        </div>

        {/* Webinars Grid */}
        {loading ? (
          <div className="p-16 text-center text-slate-500">Loading masterclass schedules...</div>
        ) : activeTab === "upcoming" ? (
          upcomingWebinars.length === 0 ? (
            <div className="text-center py-16 rounded-3xl border border-dashed border-slate-800 bg-slate-900/40 p-8">
              <Calendar size={36} className="text-slate-600 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-white mb-1">No Upcoming Webinars Found</h3>
              <p className="text-sm text-slate-400">Please check back soon for newly scheduled live masterclasses.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {upcomingWebinars.map((webinar) => {
                const scheduledDate = new Date(webinar.scheduledAt);
                const zoomUrl = webinar.zoomJoinUrl || "https://zoom.us";
                const whatsappUrl = webinar.whatsappGroupUrl || "https://chat.whatsapp.com/sample-art-webinar-vip";

                return (
                  <div
                    key={webinar.id}
                    className="rounded-3xl border-2 border-orange-500/30 bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 p-6 md:p-8 shadow-2xl relative overflow-hidden group hover:border-orange-500/60 transition-all"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
                      
                      <div className="space-y-3 max-w-2xl">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-black uppercase ${
                            webinar.status === "live"
                              ? "bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse"
                              : "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                          }`}>
                            {webinar.status === "live" ? "🔴 Live Now" : "Upcoming Masterclass"}
                          </span>

                          <span className="text-xs text-slate-400 flex items-center gap-1 bg-slate-950/80 px-2.5 py-0.5 rounded-lg border border-slate-800">
                            <Clock size={12} className="text-amber-400" /> {webinar.durationMinutes || 90} Mins
                          </span>

                          <span className="text-xs text-emerald-400 flex items-center gap-1 bg-emerald-500/10 px-2.5 py-0.5 rounded-lg border border-emerald-500/20">
                            <Users size={12} /> {webinar.totalSeats || 500} Max Seats
                          </span>
                        </div>

                        <h2 className="text-2xl md:text-3xl font-black text-white leading-tight">
                          {webinar.title}
                        </h2>

                        <p className="text-slate-300 text-xs md:text-sm leading-relaxed">
                          {webinar.description ||
                            "Learn the exact 3-phase roadmap to master bubble-free resin casting, flower preservation, pricing psychology, and launch your creative studio."}
                        </p>

                        <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-slate-300">
                          <div className="flex items-center gap-1.5 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 font-medium">
                            <Calendar size={14} className="text-orange-400" />
                            <span>
                              {scheduledDate.toLocaleDateString("en-IN", {
                                weekday: "short",
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 font-medium">
                            <Clock size={14} className="text-amber-400" />
                            <span>
                              {scheduledDate.toLocaleTimeString("en-IN", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}{" "}
                              IST
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0 lg:w-64">
                        <a
                          href={zoomUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-black text-xs md:text-sm py-3.5 px-6 rounded-2xl shadow-xl shadow-orange-500/25 transition-all hover:scale-[1.02] cursor-pointer"
                        >
                          <Video size={18} /> Join Live Zoom Webinar
                          <ExternalLink size={14} />
                        </a>

                        {webinar.whatsappGroupUrl && (
                          <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs md:text-sm py-3 px-5 rounded-2xl shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02] cursor-pointer"
                          >
                            <MessageCircle size={17} /> Join VIP WhatsApp
                            <ExternalLink size={14} />
                          </a>
                        )}

                        {webinar.prepVideoUrl && (
                          <button
                            onClick={() =>
                              setActivePrepVideo({
                                isOpen: true,
                                title: webinar.title,
                                url: webinar.prepVideoUrl!,
                              })
                            }
                            className="w-full inline-flex items-center justify-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl border border-slate-700 transition-colors cursor-pointer"
                          >
                            <PlayCircle size={15} className="text-orange-400" /> Watch Prep Video
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )
        ) : (
          /* Past Webinars Tab */
          pastWebinars.length === 0 ? (
            <div className="text-center py-16 rounded-3xl border border-dashed border-slate-800 bg-slate-900/40 p-8">
              <Video size={36} className="text-slate-600 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-white mb-1">No Past Webinars</h3>
              <p className="text-sm text-slate-400">Past webinar replays will appear here after events conclude.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pastWebinars.map((webinar) => (
                <div
                  key={webinar.id}
                  className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 flex flex-col justify-between hover:border-slate-700 transition-all shadow-xl"
                >
                  <div>
                    <span className="rounded-md bg-slate-800 border border-slate-700 px-2.5 py-0.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 inline-block">
                      Concluded
                    </span>
                    <h3 className="text-lg font-black text-white mb-2 leading-snug">{webinar.title}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed mb-4">{webinar.description}</p>
                  </div>

                  {webinar.prepVideoUrl ? (
                    <button
                      onClick={() =>
                        setActivePrepVideo({
                          isOpen: true,
                          title: webinar.title,
                          url: webinar.prepVideoUrl!,
                        })
                      }
                      className="w-full inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs py-3 px-4 rounded-xl border border-slate-700 transition-colors cursor-pointer"
                    >
                      <PlayCircle size={15} className="text-orange-400" /> Watch Workshop Video
                    </button>
                  ) : (
                    <div className="text-center py-2 text-xs text-slate-500 border border-dashed border-slate-800 rounded-xl">
                      Masterclass Concluded
                    </div>
                  )}
                </div>
              ))}
            </div>
          )
        )}

        {/* Fast-Track Upgrade Card */}
        <div className="rounded-3xl border-2 border-amber-500/40 bg-gradient-to-br from-amber-500/10 via-slate-900 to-slate-900 p-6 md:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 bg-amber-500/20 text-amber-300 text-[10px] font-black uppercase tracking-wider px-3 py-0.5 rounded-full">
              <Zap size={12} className="text-amber-400" /> Fast-Track Option
            </div>
            <h3 className="text-xl md:text-2xl font-black text-white">
              Don't Want to Wait for the Live Webinar?
            </h3>
            <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
              Unlock the entire **Level 0 Fast Track (₹499)** or **Silver Membership (₹4,999)** right now! Get immediate access to video modules, formula calculators, and starter kits.
            </p>
          </div>

          <button
            onClick={() => setPurchaseModal(true)}
            className="shrink-0 py-3.5 px-6 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 text-slate-950 font-black text-xs rounded-2xl shadow-xl shadow-orange-500/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] cursor-pointer self-start md:self-auto"
          >
            <Zap size={16} /> Instant Fast Track Upgrade (from ₹499)
            <ArrowRight size={16} />
          </button>
        </div>

        {/* Video Modal */}
        {activePrepVideo.isOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 shadow-2xl relative animate-scale-up">
              <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-800">
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <PlayCircle className="text-orange-400" size={18} /> {activePrepVideo.title}
                </h3>
                <button
                  onClick={() => setActivePrepVideo({ isOpen: false, title: "", url: "" })}
                  className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="aspect-video w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800">
                <iframe
                  className="w-full h-full"
                  src={toYouTubeEmbed(activePrepVideo.url)}
                  title="Prep Video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        )}
        </>
        )}
      </main>

      {/* Upgrade Modal */}
      <TierPurchaseModal
        isOpen={purchaseModal}
        onClose={() => setPurchaseModal(false)}
        targetTierCode="L0"
        currentLevel={isGeneral ? "General Member" : (stats?.membershipLevel || user?.membershipLevel || "Fast Track (L0)")}
        onUpgradeSuccess={() => {
          setPurchaseModal(false);
          fetchData();
        }}
      />
    </div>
  );
}
