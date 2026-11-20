"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { StudentNav } from "@/components/layout/StudentNav";
import {
  Bell,
  Flame,
  Video,
  Info,
  AlertTriangle,
  ExternalLink,
  Search,
  Filter,
  CheckCircle2,
  Calendar,
  Sparkles,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";
import Link from "next/link";
import { API_BASE_URL } from "@/config/api";

interface NotificationItem {
  id?: string;
  title: string;
  message: string;
  type?: "offer" | "event" | "info" | "alert" | string;
  link?: string;
  isRead?: boolean;
  createdAt?: string;
}

export default function StudentNotificationsPage() {
  const { user, token, logout } = useAuth();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [userStats, setUserStats] = useState({ points: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchData = async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const res = await fetch(`${API_BASE_URL}/dashboard/student`, { headers });
      const data = await res.json();

      if (data && !data.message) {
        setUserStats({ points: data.points || 0 });
        if (Array.isArray(data.notifications)) {
          setNotifications(data.notifications);
        }
      }
    } catch (err) {
      console.error("Error fetching notifications:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchData();
  }, [token]);

  const getLevelName = () => user?.membershipLevel || user?.rank || "L0 Fast Track";

  const getCategoryIcon = (type?: string) => {
    switch (type) {
      case "offer":
        return <Flame size={16} className="text-red-400" />;
      case "event":
        return <Video size={16} className="text-blue-400" />;
      case "alert":
        return <AlertTriangle size={16} className="text-amber-400" />;
      default:
        return <Info size={16} className="text-emerald-400" />;
    }
  };

  const getBadgeStyle = (type?: string) => {
    switch (type) {
      case "offer":
        return "bg-red-500/15 text-red-400 border-red-500/30";
      case "event":
        return "bg-blue-500/15 text-blue-400 border-blue-500/30";
      case "alert":
        return "bg-amber-500/15 text-amber-400 border-amber-500/30";
      default:
        return "bg-emerald-500/15 text-emerald-400 border-emerald-500/30";
    }
  };

  const filteredNotifications = notifications.filter((n) => {
    const matchesCategory =
      activeCategory === "all" || (n.type || "info") === activeCategory;
    const matchesSearch =
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.message.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div
      className="min-h-screen bg-[#faf8f5] text-stone-900 flex flex-col font-sans transition-colors lg:pl-[284px]"
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
        points={userStats.points}
        logout={logout}
        notifications={notifications}
      />

      <main className="flex-1 w-full px-4 sm:px-5 lg:px-5 py-5 sm:py-6">
        {/* Header Banner */}
        <header className="mb-6 bg-white/95 border border-[#ecdccb] shadow-[0_10px_30px_-12px_rgba(90,55,20,0.08)] p-6 md:p-8 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-stone-500 mb-1 font-medium">
              <span>Communications</span>
              <span className="text-stone-300">/</span>
              <span className="text-stone-700 font-medium">Notifications &amp; Broadcasts</span>
            </div>
            <h1 className="text-2xl sm:text-[28px] font-bold text-stone-900 tracking-tight">
              {/* <Bell className="text-[#c4431d] shrink-0" size={32} /> */} Notifications &amp; Broadcasts
            </h1>
            <p className="text-stone-500 text-xs sm:text-sm mt-0.5 max-w-2xl">
              Stay updated with exclusive level upgrades, discount offers, live class reminders, and official announcements from Team Ravishing Art Hub.
            </p>
          </div>

          <div className="bg-[#faf8f5] border border-stone-200 rounded-2xl p-4 flex items-center gap-4 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-[#fde5d6] text-[#942008] flex items-center justify-center font-black">
              <Sparkles size={20} />
            </div>
            <div>
              <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">Your Level Access</div>
              <div className="text-sm font-black text-stone-900">{getLevelName()}</div>
            </div>
          </div>
        </header>

        {/* Filter Controls & Search */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-8">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {[
              { id: "all", label: "All Messages", icon: <Bell size={14} /> },
              { id: "offer", label: "Special Offers", icon: <Flame size={14} /> },
              { id: "event", label: "Live Classes", icon: <Video size={14} /> },
              { id: "info", label: "Announcements", icon: <Info size={14} /> },
              { id: "alert", label: "Alerts", icon: <AlertTriangle size={14} /> },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 border ${
                  activeCategory === cat.id
                    ? "bg-[#fde5d6] border-[#f5ded0] text-[#942008] shadow-md"
                    : "bg-white/95 border-stone-200 text-stone-500 hover:text-stone-900 hover:border-stone-300"
                }`}
              >
                {cat.icon}
                <span>{cat.label}</span>
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" size={16} />
            <input
              type="text"
              placeholder="Search notifications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/95 border border-[#ecdccb] shadow-[0_10px_30px_-12px_rgba(90,55,20,0.08)] rounded-xl pl-10 pr-4 py-2.5 text-xs text-stone-900 placeholder-slate-500 focus:outline-none focus:border-[#c4431d] transition-colors"
            />
          </div>
        </div>

        {/* Notifications List */}
        {isLoading ? (
          <div className="text-center py-20 bg-white/95 rounded-3xl border border-stone-200">
            <div className="inline-block animate-spin w-8 h-8 border-4 border-[#c4431d] border-t-transparent rounded-full mb-3"></div>
            <p className="text-stone-500 text-sm font-bold">Loading your notification broadcasts...</p>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="text-center py-20 bg-white/95 rounded-3xl border border-stone-200 p-8">
            <Bell size={48} className="mx-auto text-slate-700 mb-3" />
            <h3 className="text-lg font-bold text-stone-900 mb-1">No notifications found</h3>
            <p className="text-stone-500 text-xs max-w-md mx-auto">
              {searchQuery
                ? `No announcements matching "${searchQuery}". Try searching with a different term.`
                : "You're all caught up! New broadcasts and class updates will appear here."}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredNotifications.map((notif, idx) => (
              <div
                key={notif.id || idx}
                className="bg-white/95 border border-[#ecdccb] shadow-[0_10px_30px_-12px_rgba(90,55,20,0.08)] hover:border-[#ecdccb] rounded-3xl p-6 md:p-7 transition-all duration-300 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 group"
              >
                <div className="flex items-start gap-4 flex-1">
                  {/* Category Icon Badge */}
                  <div className="w-12 h-12 rounded-2xl bg-[#faf8f5] border border-stone-200 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    {getCategoryIcon(notif.type)}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span
                        className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${getBadgeStyle(
                          notif.type
                        )}`}
                      >
                        {notif.type === "offer"
                          ? "🔥 Special Offer"
                          : notif.type === "event"
                          ? "🎥 Live Event"
                          : notif.type === "alert"
                          ? "⚠️ Alert"
                          : "📢 Announcement"}
                      </span>
                      <span className="text-xs text-stone-400 font-mono">
                        {notif.createdAt
                          ? new Date(notif.createdAt).toLocaleDateString("en-IN", {
                              weekday: "short",
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "Recently Broadcasted"}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-stone-900 mb-1.5 group-hover:text-[#942008] transition-colors leading-snug">
                      {notif.title}
                    </h3>
                    <p className="text-stone-600 text-xs leading-relaxed max-w-4xl">
                      {notif.message}
                    </p>
                  </div>
                </div>

                {/* Action Link Button */}
                {notif.link && (
                  <div className="shrink-0 pt-2 md:pt-0">
                    <Link
                      href={notif.link}
                      className="inline-flex items-center justify-center gap-2 bg-[#faf8f5] hover:bg-[#c4431d] text-stone-700 hover:text-white border border-stone-200 hover:border-[#c4431d] px-5 py-3 rounded-2xl font-bold text-xs transition-all shadow-md group/btn"
                    >
                      <span>
                        {notif.type === "offer"
                          ? "Explore Offer"
                          : notif.type === "event"
                          ? "Join Class"
                          : "View Details"}
                      </span>
                      <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
