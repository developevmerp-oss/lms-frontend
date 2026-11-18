"use client";

import { BrandLogo } from "@/components/ui/BrandLogo";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LogOut,
  Trophy,
  Bell,
  Menu,
  X,
  ChevronRight,
  Lock,
  Sparkles,
  ShoppingBag,
  Target,
  BookOpen,
  LayoutDashboard,
  Video,
  ClipboardList,
} from "lucide-react";
import { ProfileUpdateModal } from "@/components/profile/ProfileUpdateModal";
import { AccessLockModal } from "@/components/layout/AccessLockModal";
import { useAuth } from "@/context/AuthContext";

interface StudentNavProps {
  user: any;
  level: string;
  points: number;
  logout: () => void;
  notifications?: any[];
}

export function getLevelCode(levelName?: string, _points: number = 0): "GENERAL" | "L0" | "L1" | "L2" | "L3" | "L3+" {
  const raw = (levelName || "").toUpperCase().trim();
  if (!raw || raw.includes("GENERAL")) return "GENERAL";

  // Normalize "LEVEL 3", "LEVEL-3", "LEVEL3" -> "L3"
  const normalized = raw.replace(/LEVEL[\s\-_]*/g, "L");

  if (normalized === "L3+" || normalized.includes("L3+") || normalized.includes("MASTERS") || normalized.includes("PILES")) return "L3+";
  if (normalized === "L3" || normalized.includes("L3") || normalized.includes("DIAMOND") || normalized.includes("RENAISSANCE")) return "L3";
  if (normalized === "L2" || normalized.includes("L2") || normalized.includes("GOLD") || normalized.includes("MASTER MEMBERSHIP")) return "L2";
  if (normalized === "L1" || normalized.includes("L1") || normalized.includes("SILVER") || normalized.includes("EXPLORE")) return "L1";
  if (normalized === "L0" || normalized.includes("L0") || normalized.includes("FAST TRACK") || normalized.includes("FAST START")) return "L0";

  if (raw === "3" || raw.includes("3")) return "L3";
  if (raw === "2" || raw.includes("2")) return "L2";
  if (raw === "1" || raw.includes("1")) return "L1";
  if (raw === "0" || raw.includes("0")) return "L0";

  return "GENERAL";
}

export const StudentNav = ({ user, level, points, logout, notifications = [] }: StudentNavProps) => {
  const pathname = usePathname();
  const { user: authUser, logout: authLogout } = useAuth();
  const effectiveUser = authUser || user;
  const effectiveLogout = logout || authLogout;

  // Determine student display name & initial:
  // If the user has a name and it's not "Admin", use it.
  // Otherwise default to the login student profile ("Yug" with initial "Y").
  const studentName =
    effectiveUser?.name && effectiveUser.name.trim().toLowerCase() !== "admin"
      ? effectiveUser.name
      : "Yug";
  const studentInitial = (studentName.trim().charAt(0) || "Y").toUpperCase();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMobileNotifications, setShowMobileNotifications] = useState(false);
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
  const mobileNotifRef = useRef<HTMLDivElement>(null);

  const candidateLevels = [level, effectiveUser?.membershipLevel, effectiveUser?.level, effectiveUser?.rank].filter(Boolean);
  let effectiveLevel = candidateLevels[0] || "General";
  for (const cand of candidateLevels) {
    if (getLevelCode(cand, points) !== "GENERAL") {
      effectiveLevel = cand;
      break;
    }
  }
  const studentLevelCode = getLevelCode(effectiveLevel, points);

  const isGeneral = studentLevelCode === "GENERAL";
  const isL0Accessible = !isGeneral;
  const isEventsAccessible = ["L1", "L2", "L3", "L3+"].includes(studentLevelCode);
  const isNorthstarAccessible = ["L3", "L3+"].includes(studentLevelCode);

  const navLinks = [
    {
      name: "Dashboard",
      path: "/student/dashboard",
      icon: LayoutDashboard,
      isAccessible: isL0Accessible,
      requiredLevel: "Level 0 (Fast Track)",
      requiredPoints: 0,
      description: "Student dashboard, stats, daily routine checklist, sales chart, and rewards unlock with Level 0 (Fast Track).",
    },
    {
      name: "Feed",
      path: "/student/feed",
      icon: Sparkles,
      isAccessible: true,
      requiredLevel: "General",
      requiredPoints: 0,
      description: "Dedicated sisterhood community feed with live posts, photos, videos, and comments.",
    },
    {
      name: "Courses",
      path: "/student/courses",
      icon: BookOpen,
      isAccessible: true,
      requiredLevel: "General",
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
      isAccessible: isL0Accessible,
      requiredLevel: "Level 0 (Fast Track)",
      requiredPoints: 0,
      description: "Live Webinar registration details, Zoom link, VIP WhatsApp group, and preparation workshop video unlock with Level 0 (Fast Track).",
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
      name: "Merch Store",
      path: "/student/rewards",
      icon: ShoppingBag,
      isAccessible: isL0Accessible,
      requiredLevel: "Level 0 (Fast Track)",
      requiredPoints: 0,
      description: "Exclusive resin art kits, pigments, molds, silicone tools, and official merchandise unlock with Level 0 (Fast Track).",
    },
    {
      name: "Leaderboard",
      path: "/student/leaderboard",
      icon: Trophy,
      isAccessible: true,
      requiredLevel: "General",
      requiredPoints: 0,
      description: "Global student leaderboard, top artist podiums, and ranking streaks.",
    },
    {
      name: "Daily Tasks",
      path: "/student/tasks",
      icon: ClipboardList,
      isAccessible: isL0Accessible,
      requiredLevel: "Level 0 (Fast Track)",
      requiredPoints: 0,
      description: "Daily resin habits, practice checklists, and assignments to earn bonus XP.",
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
      if (mobileNotifRef.current && !mobileNotifRef.current.contains(e.target as Node)) {
        setShowMobileNotifications(false);
      }
    };
    if (showNotifications || showMobileNotifications) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showNotifications, showMobileNotifications]);

  useEffect(() => {
    setMobileOpen(false);
    setShowNotifications(false);
    setShowMobileNotifications(false);
  }, [pathname]);

  const unreadCount = notifications.filter(n => !n.isRead && !n.read).length;

  // Render notification item helper
  const renderNotificationList = (isMobile: boolean = false) => (
    <div className="flex flex-col text-stone-900">
      <div className="flex items-center justify-between border-b border-stone-200 pb-3 mb-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">Notifications</h4>
        <span className="text-xs text-[#c4431d] font-semibold">{unreadCount} new</span>
      </div>
      <div className="max-h-72 overflow-y-auto space-y-2.5 custom-scrollbar">
        {notifications.length === 0 ? (
          <p className="text-xs text-stone-400 text-center py-6">No notifications yet</p>
        ) : (
          notifications.map((n, i) => {
            const content = (
              <div
                key={i}
                className={`p-3 rounded-xl border text-xs transition-all ${
                  n.link
                    ? "bg-[#faf8f5] border-stone-200 hover:border-[#c4431d]/50 hover:bg-white cursor-pointer group"
                    : "bg-[#faf8f5]/60 border-stone-200"
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-[10px] font-black text-[#942008] uppercase tracking-wider">
                    {n.type === "offer" ? "🔥 Special Offer" : n.type === "event" ? "🎥 Live Class" : "📢 Update"}
                  </span>
                  <span className="text-[10px] text-stone-400 font-mono">
                    {n.createdAt ? new Date(n.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric" }) : "Today"}
                  </span>
                </div>
                <p className="font-bold text-stone-900 mb-0.5 group-hover:text-[#c4431d] transition-colors">{n.title}</p>
                <p className="text-stone-600 leading-relaxed text-[11px]">{n.message}</p>
                {n.link && (
                  <div className="mt-2 text-[10px] font-bold text-[#c4431d] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    <span>Open Page</span>
                    <span>→</span>
                  </div>
                )}
              </div>
            );

            return n.link ? (
              <Link
                key={i}
                href={n.link}
                onClick={() => {
                  setShowNotifications(false);
                  setShowMobileNotifications(false);
                  if (isMobile) setMobileOpen(false);
                }}
              >
                {content}
              </Link>
            ) : (
              <div key={i}>{content}</div>
            );
          })
        )}
      </div>
      <div className="pt-3 mt-2 border-t border-stone-200 text-center">
        <Link
          href="/student/notifications"
          onClick={() => {
            setShowNotifications(false);
            setShowMobileNotifications(false);
            if (isMobile) setMobileOpen(false);
          }}
          className="text-xs font-bold text-[#c4431d] hover:text-[#942008] flex items-center justify-center gap-1.5 transition-colors py-1 cursor-pointer"
        >
          <span>View All Notifications</span>
          <ChevronRight size={14} />
        </Link>
      </div>
    </div>
  );

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

      {/* Mobile Top Header Bar (< 1024px) */}
      <div className="lg:hidden sticky top-0 z-30 bg-white/95 border-b border-[#ecdccb] px-3 sm:px-4 py-2.5 sm:py-3 flex items-center justify-between backdrop-blur-md shadow-xs">
        <BrandLogo href="/student/dashboard" size="sm" />

        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* XP & Level Pill on Mobile */}
          <Link
            href="/student/profile"
            className="flex items-center gap-1.5 bg-[#fde5d6] border border-[#f5ded0] rounded-xl px-2 sm:px-2.5 py-1 text-[11px] sm:text-xs font-black text-stone-900 shadow-2xs"
            title="My XP & Level"
          >
            <Trophy size={13} className="text-[#c4431d] shrink-0" />
            <span className="font-mono">{points.toLocaleString()} XP</span>
            <span className="text-stone-400">·</span>
            <span className="text-[#942008] font-bold">{studentLevelCode === "GENERAL" ? "Gen" : studentLevelCode}</span>
          </Link>

          {/* Mobile Notifications Bell */}
          <div className="relative" ref={mobileNotifRef}>
            <button
              type="button"
              onClick={() => setShowMobileNotifications(prev => !prev)}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-stone-100 hover:bg-stone-200 border border-stone-200 text-stone-600 flex items-center justify-center transition-colors relative cursor-pointer"
              aria-label="Notifications"
            >
              <Bell size={16} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-gradient-to-r from-[#942008] to-[#ea580c] text-white rounded-full text-[9px] font-bold flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {showMobileNotifications && (
              <div className="fixed left-3 right-3 top-16 sm:absolute sm:left-auto sm:right-0 sm:top-full sm:mt-2 sm:w-80 rounded-2xl bg-white border border-[#ecdccb] shadow-2xl p-4 z-50 animate-in fade-in duration-200">
                {renderNotificationList(true)}
              </div>
            )}
          </div>

          {/* 2nd Image Marked Item: User Initial/Avatar Round Badge on Mobile Header */}
          <button
            type="button"
            onClick={() => setIsProfileModalOpen(true)}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden border-2 border-[#f5ded0] shadow-2xs shrink-0 bg-[#fde5d6] flex items-center justify-center text-xs font-black text-[#942008] cursor-pointer"
            title="Edit Profile & Photo"
          >
            {effectiveUser?.avatarUrl ? (
              <img src={effectiveUser.avatarUrl} alt={studentName} className="w-full h-full object-cover" />
            ) : (
              <span>{studentInitial}</span>
            )}
          </button>

          {/* Mobile Hamburger Toggle */}
          <button
            type="button"
            onClick={() => setMobileOpen(prev => !prev)}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-stone-100 hover:bg-stone-200 border border-stone-200 text-stone-700 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Toggle navigation"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Backdrop Overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-stone-900/50 backdrop-blur-xs z-40 lg:hidden animate-in fade-in duration-200"
        />
      )}

      {/* Floating Left Sidebar (Fixed on Desktop, Slide-over on Mobile) Exact like Admin */}
      <aside
        className={`fixed top-3 left-3 bottom-3 w-[272px] bg-white/95 border border-[#ecdccb] rounded-3xl shadow-[0_10px_30px_-12px_rgba(90,55,20,0.08)] flex flex-col z-50 backdrop-blur-xl transition-transform duration-300 ease-in-out overflow-hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-[calc(100%+24px)] lg:translate-x-0"
        }`}
      >
        {/* Top: Brand Logo */}
        <div className="pt-5 pb-4 px-6 flex flex-col items-center justify-center border-b border-stone-100/90 shrink-0">
          <BrandLogo href="/student/dashboard" size="md" />
        </div>

        {/* Status Bar: XP & Level Pill + Notifications Bell */}
        <div className="px-3.5 py-3 border-b border-stone-100/90 flex items-center justify-between gap-2 bg-[#fcfaf7]/70 shrink-0">
          {/* XP & Level Pill */}
          <Link
            href="/student/profile"
            onClick={() => setMobileOpen(false)}
            className="flex-1 flex items-center gap-2 bg-[#fde5d6]/80 hover:bg-[#fde5d6] border border-[#f5ded0] rounded-xl px-2.5 py-1.5 transition-all shadow-2xs group cursor-pointer"
            title="My XP & Level"
          >
            <Trophy size={15} className="text-[#c4431d] shrink-0 group-hover:scale-110 transition-transform" />
            <div className="text-[11px] sm:text-xs truncate">
              <span className="font-black text-stone-900 font-mono">{points.toLocaleString()} XP</span>
              <span className="text-stone-400 mx-1">·</span>
              <span className="font-black text-[#942008]">{studentLevelCode === "GENERAL" ? "General" : studentLevelCode}</span>
            </div>
          </Link>

          {/* Desktop Notifications Bell Button & Popover */}
          <div className="relative" ref={notifRef}>
            <button
              type="button"
              onClick={() => setShowNotifications(prev => !prev)}
              className="w-8 h-8 rounded-xl bg-white hover:bg-stone-50 border border-[#ecdccb] hover:border-[#c4431d]/40 text-stone-600 hover:text-stone-900 flex items-center justify-center transition-colors relative cursor-pointer shadow-2xs"
              title="Notifications"
            >
              <Bell size={16} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-[#942008] to-[#ea580c] text-white rounded-full text-[9px] font-black flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Desktop Notifications Dropdown flyout */}
            {showNotifications && (
              <div className="fixed lg:absolute left-4 right-4 lg:left-full lg:right-auto top-24 lg:top-0 lg:ml-3 w-auto lg:w-88 rounded-2xl bg-white border border-[#ecdccb] shadow-2xl p-4 z-50 animate-in fade-in duration-200">
                {renderNotificationList(false)}
              </div>
            )}
          </div>
        </div>

        {/* Scrollable Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-1.5 custom-scrollbar">
          {navLinks.map((link) => {
            const isActive = pathname === link.path;
            const IconComponent = link.icon;
            return (
              <Link
                key={link.name}
                href={link.isAccessible ? link.path : "#"}
                onClick={(e) => {
                  handleNavClick(link, e);
                  if (link.isAccessible) setMobileOpen(false);
                }}
                className={`relative flex items-center justify-between px-4 py-3 rounded-2xl text-xs sm:text-sm transition-all duration-200 group cursor-pointer ${
                  isActive
                    ? "bg-gradient-to-r from-[#fde5d6]/80 via-[#fff5ee] to-[#fff5ee] text-[#942008] font-black border border-[#f5ded0] shadow-2xs"
                    : link.isAccessible
                    ? "text-stone-700 hover:text-[#942008] hover:bg-stone-50 font-bold border border-transparent"
                    : "text-stone-400 hover:text-stone-600 hover:bg-stone-50/60 font-semibold border border-transparent opacity-75"
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <span
                    className={
                      isActive
                        ? "text-[#c4431d]"
                        : link.isAccessible
                        ? "text-stone-400 group-hover:text-[#c4431d]"
                        : "text-stone-300"
                    }
                  >
                    <IconComponent size={18} />
                  </span>
                  <span className="truncate">{link.name}</span>
                </div>

                {!link.isAccessible && (
                  <span className="flex items-center justify-center size-5 rounded-md bg-stone-100 border border-stone-200 text-[#c4431d] text-[10px] shrink-0 ml-1.5">
                    <Lock size={11} />
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Bottom Section: Student Profile Card (2nd Image Marked Thing) + Logout */}
        <div className="p-3.5 border-t border-[#ecdccb]/60 space-y-2 shrink-0 bg-[#fcfaf7]/80">
          {/* Student Profile Card */}
          <button
            type="button"
            onClick={() => {
              setIsProfileModalOpen(true);
              setMobileOpen(false);
            }}
            className="w-full flex items-center gap-3 p-2.5 rounded-2xl bg-white/80 hover:bg-white border border-transparent hover:border-[#ecdccb] transition-all cursor-pointer group text-left shadow-2xs"
            title="Click to edit profile & photo"
          >
            {/* The 2nd Image Marked Thing: peach circular avatar badge with initial or photo */}
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#f5ded0] shadow-2xs shrink-0 bg-[#fde5d6] flex items-center justify-center text-sm font-black text-[#942008] group-hover:scale-105 transition-transform">
              {effectiveUser?.avatarUrl ? (
                <img src={effectiveUser.avatarUrl} alt={studentName} className="w-full h-full object-cover" />
              ) : (
                <span>{studentInitial}</span>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-black text-stone-900 truncate leading-tight group-hover:text-[#c4431d] transition-colors">
                {studentName}
              </p>
              <p className="text-[10px] text-stone-500 font-medium mt-0.5">Edit Profile →</p>
            </div>
          </button>

          {/* Logout Button */}
          <button
            type="button"
            onClick={() => {
              setMobileOpen(false);
              effectiveLogout();
            }}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-white hover:bg-rose-50 border border-[#ecdccb]/80 hover:border-rose-200 text-stone-700 hover:text-rose-600 font-bold text-xs sm:text-sm transition-all cursor-pointer shadow-2xs"
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};
