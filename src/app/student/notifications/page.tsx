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
    <div className="min-h-screen bg-slate-950 text-white flex flex-col font-sans">
      <StudentNav
        user={user}
        level={getLevelName()}
        points={userStats.points}
        logout={logout}
        notifications={notifications}
      />

      <main className="flex-1 max-w-[1400px] mx-auto w-full p-4 md:p-8">
        {/* Header Banner */}
        <header className="mb-8 bg-slate-900/90 border border-slate-800 p-6 md:p-8 rounded-3xl shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
                Broadcast & Announcement Hub
              </span>
              <span className="text-slate-400 text-xs font-bold">
                {notifications.length} Total Messages
              </span>
            </div>
            <h1 className="text-2xl md:text-4xl font-black text-white tracking-tight flex items-center gap-3">
              <Bell className="text-orange-500 shrink-0" size={32} /> Notifications & Broadcasts
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Stay updated with exclusive level upgrades, discount offers, live class reminders, and official announcements from Team Ravishing Art Hub.
            </p>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex items-center gap-4 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center font-black">
              <Sparkles size={20} />
            </div>
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Your Level Access</div>
              <div className="text-sm font-black text-white">{getLevelName()}</div>
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
                    ? "bg-orange-500/15 border-orange-500 text-orange-400 shadow-md"
                    : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700"
                }`}
              >
                {cat.icon}
                <span>{cat.label}</span>
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input
              type="text"
              placeholder="Search notifications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition-colors"
            />
          </div>
        </div>

        {/* Notifications List */}
        {isLoading ? (
          <div className="text-center py-20 bg-slate-900/40 rounded-3xl border border-slate-800">
            <div className="inline-block animate-spin w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full mb-3"></div>
            <p className="text-slate-400 text-sm font-bold">Loading your notification broadcasts...</p>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/40 rounded-3xl border border-slate-800 p-8">
            <Bell size={48} className="mx-auto text-slate-700 mb-3" />
            <h3 className="text-lg font-bold text-white mb-1">No notifications found</h3>
            <p className="text-slate-400 text-xs max-w-md mx-auto">
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
                className="bg-slate-900 border border-slate-800 hover:border-orange-500/40 rounded-3xl p-6 md:p-7 transition-all duration-300 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 group"
              >
                <div className="flex items-start gap-4 flex-1">
                  {/* Category Icon Badge */}
                  <div className="w-12 h-12 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
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
                      <span className="text-xs text-slate-500 font-mono">
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

                    <h3 className="text-lg font-bold text-white mb-1.5 group-hover:text-orange-400 transition-colors leading-snug">
                      {notif.title}
                    </h3>
                    <p className="text-slate-300 text-xs leading-relaxed max-w-4xl">
                      {notif.message}
                    </p>
                  </div>
                </div>

                {/* Action Link Button */}
                {notif.link && (
                  <div className="shrink-0 pt-2 md:pt-0">
                    <Link
                      href={notif.link}
                      className="inline-flex items-center justify-center gap-2 bg-slate-950 hover:bg-orange-500 text-slate-200 hover:text-slate-950 border border-slate-800 hover:border-orange-500 px-5 py-3 rounded-2xl font-bold text-xs transition-all shadow-md group/btn"
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
