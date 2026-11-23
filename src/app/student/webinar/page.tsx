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
import { CardGridSkeleton } from "@/components/ui/SkeletonLoader";
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
    try {
      if (url.includes("youtube.com/watch")) {
        const fullUrl = url.startsWith("http") ? url : `https://${url}`;
        const id = new URL(fullUrl).searchParams.get("v");
        return id ? `https://www.youtube.com/embed/${id}?autoplay=1` : url;
      }
    } catch {}
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
        level={isGeneral ? "General Member" : (user?.membershipLevel || stats?.membershipLevel || "Fast Track (L0)")}
        points={stats?.points || 0}
        logout={logout}
        notifications={stats?.notifications}
      />

      <main className="w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-8">
        {isGeneral ? (
          <div className="py-16 px-4 max-w-2xl mx-auto text-center space-y-6">
            <div className="w-16 h-16 rounded-3xl bg-[#fde5d6] border-2 border-[#f5ded0] flex items-center justify-center text-[#942008] mx-auto shadow-2xl">
              <Lock size={32} />
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-center gap-1.5 text-xs text-stone-500 mb-1 font-medium">
                <span>Live Events</span>
                <span className="text-stone-300">/</span>
                <span className="text-stone-700 font-medium">Live Webinar Hub</span>
              </div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-stone-900 tracking-tight">
                Live Webinar Hub is Locked
              </h1>
              <p className="text-stone-500 text-xs sm:text-sm mt-0.5 leading-relaxed">
                Live masterclass schedules, Zoom calls, VIP WhatsApp groups, and workshop preparation videos are exclusively available for enrolled Fast Track (Level 0) and higher members. Upgrade to Fast Track now to unlock live masterclasses and community perks.
              </p>
            </div>
            <button
              onClick={() => setPurchaseModal(true)}
              className="px-8 py-3.5 bg-gradient-to-r from-[#942008] via-[#c4431d] to-[#ea580c] text-white font-black rounded-xl text-sm shadow-xl flex items-center gap-2 mx-auto hover:scale-105 transition-all cursor-pointer"
            >
              <Zap size={16} />
              Unlock Fast Track (₹499)
            </button>
          </div>
        ) : (
          <>
        {/* Header: Webinar Schedule Hub + Tabs */}
        <div className="flex flex-col md:flex-row md:items-end justify-end gap-4 pt-1 mb-6">
          {/*
          <div>
            <div className="flex items-center gap-1.5 text-xs text-stone-500 mb-1 font-medium">
              <span>Live Events</span>
              <span className="text-stone-300">/</span>
              <span className="text-stone-700 font-medium">Webinar Schedule Hub</span>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-stone-900 tracking-tight">
              Webinar Schedule Hub
            </h1>
            <p className="text-stone-500 text-xs sm:text-sm mt-0.5">
              Browse, register, and join upcoming masterclasses and live webinars.
            </p>
          </div>
          */}

          {/* Top Right Tab Buttons */}
          <div className="flex items-center gap-3 self-start md:self-auto shrink-0 flex-wrap">
            <button
              type="button"
              onClick={() => setActiveTab("upcoming")}
              className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer shadow-xs ${
                activeTab === "upcoming"
                  ? "bg-[#c4431d] hover:bg-[#a83210] text-white shadow-md shadow-[#c4431d]/20"
                  : "bg-white hover:bg-stone-50 text-stone-700 border border-stone-200/90"
              }`}
            >
              <Calendar size={15} />
              <span>Upcoming Webinars ({upcomingWebinars.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("past")}
              className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer shadow-xs ${
                activeTab === "past"
                  ? "bg-[#c4431d] hover:bg-[#a83210] text-white shadow-md shadow-[#c4431d]/20"
                  : "bg-white hover:bg-stone-50 text-stone-700 border border-stone-200/90"
              }`}
            >
              <PlayCircle size={15} />
              <span>Past &amp; Recordings ({pastWebinars.length})</span>
            </button>
          </div>
        </div>

        {/* Search Bar & VIP Access Card (Exact Image Style) */}
        <div className="bg-white rounded-3xl border border-stone-200/80 p-3 sm:px-5 sm:py-3.5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xs">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" size={15} />
            <input
              type="text"
              placeholder="Search webinars..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#faf8f5] border border-stone-200/80 rounded-full pl-10 pr-4 py-2 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-[#c4431d] transition-colors"
            />
          </div>

          <div className="inline-flex items-center gap-2 bg-[#eaf8ee] border border-emerald-200/80 px-4 py-1.5 rounded-full text-emerald-700 font-bold text-xs shadow-2xs shrink-0 self-start sm:self-auto">
            <CheckCircle2 size={15} className="text-emerald-600 fill-emerald-100" />
            <span>VIP Student Access Confirmed</span>
          </div>
        </div>

        {/* Webinars Grid */}
        {loading ? (
          <CardGridSkeleton count={4} />
        ) : activeTab === "upcoming" ? (
          upcomingWebinars.length === 0 ? (
            <div className="text-center py-16 rounded-3xl border border-dashed border-stone-200 bg-white/95 p-8">
              <Calendar size={36} className="text-stone-300 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-stone-900 mb-1">No Upcoming Webinars Found</h3>
              <p className="text-sm text-stone-500">Please check back soon for newly scheduled live masterclasses.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {upcomingWebinars.map((webinar) => {
                const scheduledDate = new Date(webinar.scheduledAt);
                const isValidDate = !isNaN(scheduledDate.getTime());
                const dayName = isValidDate
                  ? scheduledDate.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase()
                  : "SUN";
                const dayNumber = isValidDate ? scheduledDate.getDate() : 22;
                const monthYear = isValidDate
                  ? scheduledDate.toLocaleDateString("en-US", { month: "short", year: "numeric" }).toUpperCase()
                  : "NOV, 2026";
                const timeStr = isValidDate
                  ? scheduledDate.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) + " IST"
                  : "08:00 pm IST";
                const fullDateStr = isValidDate
                  ? scheduledDate.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" })
                  : "Sun, 22 Nov, 2026";

                const zoomUrl = webinar.zoomJoinUrl || "https://zoom.us";
                const whatsappUrl = webinar.whatsappGroupUrl || "https://chat.whatsapp.com/sample-art-webinar-vip";

                return (
                  <div
                    key={webinar.id}
                    className="rounded-3xl border border-stone-200/80 bg-white shadow-xs p-6 sm:p-7 relative overflow-hidden transition-all hover:border-stone-300 hover:shadow-sm space-y-4"
                  >
                    {/* Top Row: Masterclass Title & Pills (Exact Image Style) */}
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="text-lg sm:text-xl font-bold text-stone-900">
                        {webinar.status === "live" ? "🔴 Live Masterclass" : "Upcoming Masterclass"}
                      </h3>
                      <span className="text-xs text-[#c4431d] font-bold flex items-center gap-1.5 bg-[#fff5ee] border border-[#fde5d6] px-3 py-1 rounded-full">
                        <Clock size={13} className="text-[#c4431d]" /> {webinar.durationMinutes || 90} Mins
                      </span>
                      <span className="text-xs text-[#c4431d] font-bold flex items-center gap-1.5 bg-[#fff5ee] border border-[#fde5d6] px-3 py-1 rounded-full">
                        <Users size={13} className="text-[#c4431d]" /> {webinar.totalSeats || 500} Max Seats
                      </span>
                    </div>

                    {/* Middle Section: Date Block + Content + Buttons */}
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 lg:gap-8 xl:gap-10 relative z-10">
                      {/* Left: Date Block & Description */}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-6 flex-1 min-w-0">
                        {/* Prominent Date Block */}
                        <div className="w-20 sm:w-22 py-3 px-2 rounded-2xl bg-[#fff7f2] border border-[#fde5d6] flex flex-col items-center justify-center text-center shrink-0">
                          <span className="text-xs font-black uppercase tracking-wider text-[#942008]">
                            {dayName}
                          </span>
                          <span className="text-2xl sm:text-3xl font-black text-stone-900 leading-none my-1">
                            {dayNumber}
                          </span>
                          <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                            {monthYear}
                          </span>
                        </div>

                        {/* Text Details */}
                        <div className="min-w-0 flex-1">
                          <h2 className="text-xl sm:text-2xl font-bold text-stone-900 leading-snug">
                            {webinar.title}
                          </h2>
                          <p className="text-stone-500 text-xs sm:text-sm leading-relaxed mt-1 mb-3">
                            {webinar.description ||
                              "Learn the exact 3-phase roadmap to master bubble-free resin casting, flower preservation, pricing psychology, and launch your creative studio."}
                          </p>

                          {/* Meta: Sun, 22 Nov, 2026       08:00 pm IST */}
                          <div className="flex items-center gap-6 text-xs text-stone-700 font-semibold flex-wrap">
                            <div className="flex items-center gap-1.5">
                              <Calendar size={14} className="text-[#c4431d]" />
                              <span>{fullDateStr}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Clock size={14} className="text-[#c4431d]" />
                              <span>{timeStr}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right: Action Buttons Stack (Exact Image 2 Style) */}
                      <div className="flex flex-col gap-2.5 shrink-0 w-full sm:w-[285px] lg:w-[295px]">
                        <a
                          href={zoomUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full inline-flex items-center justify-between bg-[#c4431d] hover:bg-[#a83210] text-white font-bold text-xs sm:text-sm py-3 px-4 sm:px-5 rounded-2xl shadow-sm transition-all cursor-pointer hover:scale-[1.01]"
                        >
                          <Video size={18} className="stroke-[2.2] shrink-0" />
                          <span className="whitespace-nowrap px-2 text-center flex-1">Join Live Zoom Webinar</span>
                          <ExternalLink size={16} className="stroke-[2.2] shrink-0 opacity-90" />
                        </a>

                        {webinar.whatsappGroupUrl && (
                          <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full inline-flex items-center justify-between bg-white hover:bg-stone-50 text-stone-900 border border-stone-200/90 font-bold text-xs sm:text-sm py-2.5 sm:py-3 px-4 sm:px-5 rounded-2xl transition-all cursor-pointer hover:border-stone-300 shadow-2xs"
                          >
                            <MessageCircle size={18} className="text-[#c4431d] stroke-[2.2] shrink-0" />
                            <span className="whitespace-nowrap px-2 text-center flex-1">Join VIP WhatsApp</span>
                            <ExternalLink size={16} className="text-[#c4431d] stroke-[2.2] shrink-0" />
                          </a>
                        )}

                        {webinar.prepVideoUrl && (
                          <button
                            type="button"
                            onClick={() =>
                              setActivePrepVideo({
                                isOpen: true,
                                title: webinar.title,
                                url: webinar.prepVideoUrl!,
                              })
                            }
                            className="w-full inline-flex items-center justify-between bg-white hover:bg-stone-50 text-stone-900 border border-stone-200/90 font-bold text-xs sm:text-sm py-2.5 sm:py-3 px-4 sm:px-5 rounded-2xl transition-all cursor-pointer hover:border-stone-300 shadow-2xs"
                          >
                            <PlayCircle size={18} className="text-[#c4431d] stroke-[2.2] shrink-0" />
                            <span className="whitespace-nowrap px-2 text-center flex-1">Watch Prep Video</span>
                            <span className="w-4 shrink-0" aria-hidden="true" />
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
            <div className="text-center py-16 rounded-3xl border border-dashed border-stone-200 bg-white/95 p-8">
              <Video size={36} className="text-stone-300 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-stone-900 mb-1">No Past Webinars</h3>
              <p className="text-sm text-stone-500">Past webinar replays will appear here after events conclude.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pastWebinars.map((webinar) => {
                const scheduledDate = new Date(webinar.scheduledAt);
                const isValidDate = !isNaN(scheduledDate.getTime());
                const fullDateStr = isValidDate
                  ? scheduledDate.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" })
                  : "Completed";

                return (
                  <div
                    key={webinar.id}
                    className="rounded-3xl border border-stone-200/80 bg-white p-6 sm:p-7 flex flex-col justify-between hover:border-stone-300 transition-all shadow-xs min-h-[250px]"
                  >
                    <div>
                      {/* Top Badges Row: Concluded | Date (Exact Image 2 Style) */}
                      <div className="flex items-center gap-2.5 mb-3 flex-wrap">
                        <span className="rounded-xl bg-[#f5f3f0] text-stone-700 px-3 py-1 text-xs font-semibold">
                          Concluded
                        </span>
                        <div className="flex items-center gap-1.5 text-stone-700 text-xs font-semibold">
                          <span className="text-stone-300 mr-1 font-normal">|</span>
                          <Calendar size={15} className="text-[#c4431d]" />
                          <span>{fullDateStr}</span>
                        </div>
                      </div>

                      {/* Webinar Title */}
                      <h3 className="text-lg sm:text-xl font-bold text-stone-900 mb-2 leading-snug">
                        {webinar.title}
                      </h3>

                      {/* Webinar Description */}
                      {webinar.description && (
                        <p className="text-xs sm:text-sm text-stone-500 leading-relaxed mb-6 line-clamp-2">
                          {webinar.description}
                        </p>
                      )}
                    </div>

                    {/* Bottom Action / Status (Exact Image 2 Style) */}
                    <div className="pt-2">
                      {webinar.prepVideoUrl ? (
                        <button
                          type="button"
                          onClick={() =>
                            setActivePrepVideo({
                              isOpen: true,
                              title: webinar.title,
                              url: webinar.prepVideoUrl!,
                            })
                          }
                          className="w-full inline-flex items-center justify-center gap-2 bg-white hover:bg-[#fff9f5] text-stone-900 font-bold text-xs sm:text-sm py-3 px-4 rounded-2xl border border-[#c4431d] transition-all cursor-pointer shadow-2xs hover:scale-[1.01]"
                        >
                          <PlayCircle size={16} className="text-[#c4431d]" />
                          <span>Watch Workshop Video</span>
                        </button>
                      ) : (
                        <div className="w-full py-3 px-4 rounded-2xl bg-stone-50/70 border border-stone-200/80 text-center text-xs sm:text-sm font-semibold text-stone-400 select-none">
                          Masterclass Concluded
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )
        )}

        {/* Fast-Track Option Banner (Exact Image Style) */}
        <div className="rounded-3xl border border-[#fde5d6] bg-[#fff4ed]/80 p-5 sm:p-6 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="flex flex-col sm:flex-row sm:items-center gap-6">
            <div className="flex items-center gap-2 text-[#c4431d] font-bold text-sm sm:text-base shrink-0">
              <Zap size={16} className="text-[#c4431d]" />
              <span>Fast-Track Option</span>
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-stone-900 leading-snug">
                Don&apos;t Want to Wait for the Live Webinar?
              </h3>
              <p className="text-xs text-stone-500 mt-0.5 leading-relaxed">
                Unlock the entire Level 0 Fast Track (₹499) or Silver Membership (₹4,999) right now!
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setPurchaseModal(true)}
            className="shrink-0 py-2.5 px-6 bg-white hover:bg-[#fff9f5] border border-[#c4431d] text-[#c4431d] font-bold text-xs sm:text-sm rounded-full shadow-2xs flex items-center justify-center gap-2 transition-all hover:scale-[1.01] cursor-pointer self-start md:self-auto whitespace-nowrap"
          >
            <span>Instant Fast Track Upgrade (from ₹499) →</span>
          </button>
        </div>

        {/* Video Modal */}
        {activePrepVideo.isOpen && (
          <div className="fixed inset-0 z-50 bg-[#faf8f5]/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-white/95 border border-[#ecdccb] shadow-[0_10px_30px_-12px_rgba(90,55,20,0.08)] rounded-3xl max-w-2xl w-full p-6 shadow-2xl relative animate-scale-up">
              <div className="flex justify-between items-center mb-4 pb-2 border-b border-stone-200">
                <h3 className="text-base font-black text-stone-900 flex items-center gap-2">
                  <PlayCircle className="text-[#942008]" size={18} /> {activePrepVideo.title}
                </h3>
                <button
                  onClick={() => setActivePrepVideo({ isOpen: false, title: "", url: "" })}
                  className="w-8 h-8 rounded-full bg-stone-100 text-stone-500 hover:text-stone-900 flex items-center justify-center cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="aspect-video w-full rounded-2xl overflow-hidden bg-[#faf8f5] border border-stone-200">
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
