"use client";

import { BrandLogo } from "@/components/ui/BrandLogo";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, Trophy, Bell, Menu, X, ChevronRight, Lock, Sparkles, User, ShoppingBag, Calendar, Target, BookOpen, LayoutDashboard, Video } from "lucide-react";
import { ProfileUpdateModal } from "@/components/profile/ProfileUpdateModal";
import { AccessLockModal } from "@/components/layout/AccessLockModal";

interface StudentNavProps {
  user: any;
  level: string;
  points: number;
  logout: () => void;
  notifications?: any[];
}

export function getLevelCode(levelName?: string, _points: number = 0): "L0" | "L1" | "L2" | "L3" | "L3+" {
  const normalized = (levelName || "").toUpperCase();
  if (normalized.includes("L3+") || normalized.includes("MASTERS")) return "L3+";
  if (normalized.includes("L3") || normalized.includes("DIAMOND")) return "L3";
  if (normalized.includes("L2") || normalized.includes("GOLD")) return "L2";
  if (normalized.includes("L1") || normalized.includes("SILVER")) return "L1";
  return "L0";
}

export const StudentNav = ({ user, level, points, logout, notifications = [] }: StudentNavProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const [showNotifications, setShowNotifications] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [lockModal, setLockModal] = useState<{
    isOpen: boolean;
    featureName: string;
    requiredLevel: string;
    requiredPoints: number;
    description: string;
  }>({
    isOpen: false,
    featureName: "",
    requiredLevel: "",
    requiredPoints: 0,
    description: "",
  });

  const notifRef = useRef<HTMLDivElement>(null);

  const studentLevelCode = getLevelCode(level, points);

  const isEventsAccessible = ["L1", "L2", "L3", "L3+"].includes(studentLevelCode);
  const isNorthstarAccessible = ["L3", "L3+"].includes(studentLevelCode);

  const navLinks = [
    {
      name: "Dashboard",
      path: "/student/dashboard",
      icon: LayoutDashboard,
      isAccessible: true,
      requiredLevel: "L0",
      requiredPoints: 0,
      description: "Student overview dashboard, stats, daily habits checklist, sales chart, and rewards.",
    },
    {
      name: "Feed",
      path: "/student/feed",
      icon: Sparkles,
      isAccessible: true,
      requiredLevel: "L0",
      requiredPoints: 0,
      description: "Dedicated sisterhood community feed with live posts, photos, videos, and comments.",
    },
    {
      name: "Courses",
      path: "/student/courses",
      icon: BookOpen,
      isAccessible: true,
      requiredLevel: "L0",
      requiredPoints: 0,
      description: "Structured video masterclasses, assignments, and practical resin modules.",
    },
    {
      name: "Live Classes",
      path: "/student/classes",
      icon: Video,
      isAccessible: isEventsAccessible,
      requiredLevel: "L1 (Silver)",
      requiredPoints: 500,
      description: "Live interactive coaching calls, weekly mentor Q&A, and attendance XP unlock at Level 1 (Silver Membership).",
    },
    {
      name: "Webinar",
      path: "/student/webinar",
      icon: Sparkles,
      isAccessible: true,
      requiredLevel: "L0",
      requiredPoints: 0,
      description: "Live Webinar registration details, Zoom link, VIP WhatsApp group, and preparation workshop video.",
    },
    {
      name: "Northstar",
      path: "/student/northstar",
      icon: Target,
      isAccessible: isNorthstarAccessible,
      requiredLevel: "L3 (Diamond)",
      requiredPoints: 10000,
      description: "Northstar revenue tracking, sales goal projections, and 90-day business KPI scorecards unlock at Level 3 (Diamond Membership).",
    },
    {
      name: "Merch store",
      path: "/student/rewards",
      icon: ShoppingBag,
      isAccessible: true,
      requiredLevel: "L0",
      requiredPoints: 0,
      description: "Exclusive resin art kits, pigments, molds, silicone tools, and official merchandise.",
    },
  ];

  const handleNavClick = (link: any, e: React.MouseEvent) => {
    if (!link.isAccessible) {
      e.preventDefault();
      setLockModal({
        isOpen: true,
        featureName: link.name,
        requiredLevel: link.requiredLevel,
        requiredPoints: link.requiredPoints,
        description: link.description,
      });
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    };
    if (showNotifications) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showNotifications]);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const unreadCount = notifications.filter(n => !n.isRead && !n.read).length;

  return (
    <>
      <ProfileUpdateModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} />

      <AccessLockModal
        isOpen={lockModal.isOpen}
        onClose={() => setLockModal(prev => ({ ...prev, isOpen: false }))}
        featureName={lockModal.featureName}
        requiredLevel={lockModal.requiredLevel}
        requiredPoints={lockModal.requiredPoints}
        currentLevel={level || "Fast Track (L0)"}
        currentPoints={points || 0}
        description={lockModal.description}
      />

      <nav className="w-full bg-slate-950/95 border-b border-slate-800 shadow-2xl sticky top-0 z-40 backdrop-blur-xl">
        <div className="max-w-[1600px] mx-auto px-4 md:px-6 h-16 md:h-20 flex items-center justify-between">

          {/* Left: Logo + Top 5 Navigation Buttons */}
          <div className="flex items-center gap-4 lg:gap-8">
            <BrandLogo href="/student/dashboard" size="sm" />

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1.5">
              {navLinks.map((link) => {
                const isActive = pathname === link.path;
                return (
                  <Link
                    key={link.name}
                    href={link.isAccessible ? link.path : "#"}
                    onClick={(e) => handleNavClick(link, e)}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
                      isActive
                        ? "bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-black shadow-lg shadow-orange-500/20"
                        : link.isAccessible
                        ? "text-slate-300 hover:text-white hover:bg-slate-800/80"
                        : "text-slate-400 hover:text-slate-300 hover:bg-slate-900/60 opacity-80"
                    }`}
                  >
                    <span>{link.name}</span>
                    {!link.isAccessible && (
                      <span className="flex items-center justify-center size-5 rounded-md bg-slate-800 border border-slate-700 text-amber-400 text-[10px] ml-1">
                        <Lock size={11} />
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right Section: Level & XP Badge + Notifications + Profile */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* XP & Level Pill */}
            <Link
              href="/student/profile"
              className="flex items-center gap-2 bg-slate-900 border border-slate-800 hover:border-orange-500/50 rounded-xl px-3 py-1.5 transition-colors shadow-sm"
            >
              <Trophy size={15} className="text-amber-400 shrink-0" />
              <div className="text-xs">
                <span className="font-black text-white font-mono">{points.toLocaleString()} XP</span>
                <span className="text-slate-500 mx-1">·</span>
                <span className="font-bold text-orange-400">{studentLevelCode}</span>
              </div>
            </Link>

            {/* Notifications */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-orange-500/40 text-slate-300 hover:text-white flex items-center justify-center transition-colors relative cursor-pointer"
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-4 z-50 text-white">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Notifications</h4>
                    <span className="text-xs text-orange-400 font-semibold">{unreadCount} new</span>
                  </div>
                  <div className="max-h-72 overflow-y-auto space-y-2.5">
                    {notifications.length === 0 ? (
                      <p className="text-xs text-slate-500 text-center py-6">No notifications yet</p>
                    ) : (
                      notifications.map((n, i) => {
                        const content = (
                          <div
                            key={i}
                            className={`p-3 rounded-xl border text-xs transition-all ${
                              n.link
                                ? "bg-slate-950/80 border-slate-800 hover:border-orange-500/50 hover:bg-slate-950 cursor-pointer group"
                                : "bg-slate-950/60 border-slate-800/80"
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <span className="text-[10px] font-black text-orange-400 uppercase tracking-wider">
                                {n.type === "offer" ? "🔥 Special Offer" : n.type === "event" ? "🎥 Live Class" : "📢 Update"}
                              </span>
                              <span className="text-[10px] text-slate-500 font-mono">
                                {n.createdAt ? new Date(n.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric" }) : "Today"}
                              </span>
                            </div>
                            <p className="font-bold text-white mb-0.5 group-hover:text-orange-300 transition-colors">{n.title}</p>
                            <p className="text-slate-400 leading-relaxed text-[11px]">{n.message}</p>
                            {n.link && (
                              <div className="mt-2 text-[10px] font-bold text-amber-400 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                                <span>Open Page</span>
                                <span>→</span>
                              </div>
                            )}
                          </div>
                        );

                        return n.link ? (
                          <Link key={i} href={n.link} onClick={() => setShowNotifications(false)}>
                            {content}
                          </Link>
                        ) : (
                          <div key={i}>{content}</div>
                        );
                      })
                    )}
                  </div>
                  <div className="pt-3 mt-2 border-t border-slate-800 text-center">
                    <Link
                      href="/student/notifications"
                      onClick={() => setShowNotifications(false)}
                      className="text-xs font-bold text-orange-400 hover:text-orange-300 flex items-center justify-center gap-1.5 transition-colors py-1 cursor-pointer"
                    >
                      <span>View All Notifications</span>
                      <ChevronRight size={14} />
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown / Modal Trigger */}
            <button
              onClick={() => setIsProfileModalOpen(true)}
              className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-orange-500/40 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              title="Edit Profile"
            >
              <User size={18} />
            </button>

            {/* Logout */}
            <button
              onClick={logout}
              className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 flex items-center justify-center transition-colors cursor-pointer"
              title="Sign Out"
            >
              <LogOut size={17} />
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 flex items-center justify-center cursor-pointer"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-800 bg-slate-950 px-4 py-4 space-y-2 animate-in slide-in-from-top duration-200">
            {navLinks.map((link) => {
              const isActive = pathname === link.path;
              return (
                <Link
                  key={link.name}
                  href={link.isAccessible ? link.path : "#"}
                  onClick={(e) => handleNavClick(link, e)}
                  className={`flex items-center justify-between p-3 rounded-xl text-sm font-bold transition-all ${
                    isActive
                      ? "bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950"
                      : link.isAccessible
                      ? "text-slate-200 hover:bg-slate-900"
                      : "text-slate-500 bg-slate-900/40"
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <link.icon size={18} />
                    {link.name}
                  </span>
                  {!link.isAccessible ? (
                    <span className="flex items-center gap-1 text-xs text-amber-400">
                      <Lock size={13} /> {link.requiredLevel}
                    </span>
                  ) : (
                    <ChevronRight size={16} className="opacity-60" />
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </nav>
    </>
  );
};
