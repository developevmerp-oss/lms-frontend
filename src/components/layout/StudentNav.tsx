'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
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
  Award,
  Palette,
  LogOut,
  User,
} from 'lucide-react';
import { ProfileUpdateModal } from '@/components/profile/ProfileUpdateModal';
import { AccessLockModal } from '@/components/layout/AccessLockModal';
import { useAuth } from '@/context/AuthContext';

interface StudentNavProps {
  user: any;
  level: string;
  points: number;
  logout: () => void;
  notifications?: any[];
  title?: string;
}

const getStudentPageTitle = (path: string, customTitle?: string): string => {
  if (customTitle) return customTitle;
  if (!path) return 'Dashboard';
  if (path === '/student/dashboard' || path === '/student') return 'Dashboard';
  if (path.startsWith('/student/profile')) return 'My Profile';
  if (path.startsWith('/student/feed')) return 'Sisterhood Community Feed';
  if (path.startsWith('/student/courses')) return 'Course Library & Video Modules';
  if (path.startsWith('/student/events')) return 'Live Coaching & Attendance Portal';
  if (path.startsWith('/student/webinar')) return 'Webinar Schedule Hub';
  if (path.startsWith('/student/northstar')) return 'Northstar Revenue & Goal Tracker';
  if (path.startsWith('/student/rewards')) return 'Rewards Store';
  if (path.startsWith('/student/leaderboard')) return 'Global Leaderboard';
  if (path.startsWith('/student/tasks')) return 'Daily Tasks & Missions';
  if (path.startsWith('/student/certificates')) return 'My Certificates';
  if (path.startsWith('/student/portfolio')) return 'My Portfolio';
  if (path.startsWith('/student/affiliate')) return 'Partner & Affiliate Program';
  if (path.startsWith('/student/notifications')) return 'Notifications & Broadcasts';
  return 'Student Hub';
};

export function getLevelCode(levelName?: string, _points: number = 0): 'GENERAL' | 'L0' | 'L1' | 'L2' | 'L3' | 'L3+' {
  const raw = (levelName || '').toUpperCase().trim();
  if (!raw || raw.includes('GENERAL')) return 'GENERAL';

  // Normalize "LEVEL 3", "LEVEL-3", "LEVEL3" -> "L3"
  const normalized = raw.replace(/LEVEL[\s\-_]*/g, 'L');

  if (normalized === 'L3+' || normalized.includes('L3+') || normalized.includes('MASTERS') || normalized.includes('PILES')) return 'L3+';
  if (normalized === 'L3' || normalized.includes('L3') || normalized.includes('DIAMOND') || normalized.includes('RENAISSANCE')) return 'L3';
  if (normalized === 'L2' || normalized.includes('L2') || normalized.includes('GOLD') || normalized.includes('MASTER MEMBERSHIP')) return 'L2';
  if (normalized === 'L1' || normalized.includes('L1') || normalized.includes('SILVER') || normalized.includes('EXPLORE')) return 'L1';
  if (normalized === 'L0' || normalized.includes('L0') || normalized.includes('FAST TRACK') || normalized.includes('FAST START')) return 'L0';

  if (raw === '3' || raw.includes('3')) return 'L3';
  if (raw === '2' || raw.includes('2')) return 'L2';
  if (raw === '1' || raw.includes('1')) return 'L1';
  if (raw === '0' || raw.includes('0')) return 'L0';

  return 'GENERAL';
}

export const StudentNav = ({ user, level, points, logout, notifications = [], title }: StudentNavProps) => {
  const pathname = usePathname();
  const { user: authUser, logout: authLogout } = useAuth();
  const effectiveUser = authUser || user;
  const effectiveLogout = logout || authLogout;

  const pageTitle = getStudentPageTitle(pathname, title);

  // Determine student display name & initial
  const studentName =
    effectiveUser?.name && effectiveUser.name.trim().toLowerCase() !== 'admin'
      ? effectiveUser.name
      : 'Yug';
  const studentInitial = (studentName.trim().charAt(0) || 'Y').toUpperCase();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMobileNotifications, setShowMobileNotifications] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const [lockModal, setLockModal] = useState<{
    isOpen: boolean;
    featureName: string;
    requiredLevel: string;
    requiredPoints: number;
    description: string;
  }>({
    isOpen: false,
    featureName: '',
    requiredLevel: '',
    requiredPoints: 0,
    description: '',
  });

  const notifRef = useRef<HTMLDivElement>(null);
  const mobileNotifRef = useRef<HTMLDivElement>(null);

  const candidateLevels = [level, effectiveUser?.membershipLevel, effectiveUser?.level, effectiveUser?.rank].filter(Boolean);
  let effectiveLevel = candidateLevels[0] || 'General';
  for (const cand of candidateLevels) {
    if (getLevelCode(cand, points) !== 'GENERAL') {
      effectiveLevel = cand;
      break;
    }
  }
  const studentLevelCode = getLevelCode(effectiveLevel, points);

  const isGeneral = studentLevelCode === 'GENERAL';
  const isL0Accessible = !isGeneral;
  const isEventsAccessible = ['L1', 'L2', 'L3', 'L3+'].includes(studentLevelCode);
  const isNorthstarAccessible = ['L3', 'L3+'].includes(studentLevelCode);

  const navLinks = [
    {
      name: 'Dashboard',
      path: '/student/dashboard',
      icon: LayoutDashboard,
      isAccessible: isL0Accessible,
      requiredLevel: 'Level 0 (Fast Track)',
      requiredPoints: 0,
      description: 'Student dashboard, stats, daily routine checklist, sales chart, and rewards unlock with Level 0 (Fast Track).',
    },
    {
      name: 'Profile & Milestones',
      path: '/student/profile',
      icon: Award,
      isAccessible: true,
      requiredLevel: 'General',
      requiredPoints: 0,
      description: 'Artpreneur career levels, badges collection, milestone checklist, and technical skill mastery scores.',
    },
    {
      name: 'Feed',
      path: '/student/feed',
      icon: Sparkles,
      isAccessible: true,
      requiredLevel: 'General',
      requiredPoints: 0,
      description: 'Dedicated sisterhood community feed with live posts, photos, videos, and comments.',
    },
    {
      name: 'Courses',
      path: '/student/courses',
      icon: BookOpen,
      isAccessible: true,
      requiredLevel: 'General',
      requiredPoints: 0,
      description: 'Structured video masterclasses, assignments, and practical resin modules.',
    },
    {
      name: 'My Portfolio',
      path: '/student/portfolio',
      icon: Palette,
      isAccessible: true,
      requiredLevel: 'General',
      requiredPoints: 0,
      description: 'Upload and showcase your finished resin artwork for mentor review and feedback.',
    },
    {
      name: 'Live Classes',
      path: '/student/classes',
      icon: Video,
      isAccessible: isEventsAccessible,
      requiredLevel: 'L1 (Silver)',
      requiredPoints: 500,
      description: 'Live interactive coaching calls, weekly mentor Q&A, and attendance XP unlock at Level 1 (Silver Membership).',
    },
    {
      name: 'Webinar',
      path: '/student/webinar',
      icon: Sparkles,
      isAccessible: isL0Accessible,
      requiredLevel: 'Level 0 (Fast Track)',
      requiredPoints: 0,
      description: 'Live Webinar registration details, Zoom link, VIP WhatsApp group, and preparation workshop video unlock with Level 0 (Fast Track).',
    },
    {
      name: 'Northstar',
      path: '/student/northstar',
      icon: Target,
      isAccessible: isNorthstarAccessible,
      requiredLevel: 'L3 (Diamond)',
      requiredPoints: 10000,
      description: 'Northstar revenue tracking, sales goal projections, and 90-day business KPI scorecards unlock at Level 3 (Diamond Membership).',
    },
    {
      name: 'Merch Store',
      path: '/student/rewards',
      icon: ShoppingBag,
      isAccessible: isL0Accessible,
      requiredLevel: 'Level 0 (Fast Track)',
      requiredPoints: 0,
      description: 'Exclusive resin art kits, pigments, molds, silicone tools, and official merchandise unlock with Level 0 (Fast Track).',
    },
    {
      name: 'Leaderboard',
      path: '/student/leaderboard',
      icon: Trophy,
      isAccessible: true,
      requiredLevel: 'General',
      requiredPoints: 0,
      description: 'Global student leaderboard, top artist podiums, and ranking streaks.',
    },
    {
      name: 'Daily Tasks',
      path: '/student/tasks',
      icon: ClipboardList,
      isAccessible: isL0Accessible,
      requiredLevel: 'Level 0 (Fast Track)',
      requiredPoints: 0,
      description: 'Daily resin habits, practice checklists, and assignments to earn bonus XP.',
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
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
      if (mobileNotifRef.current && !mobileNotifRef.current.contains(e.target as Node)) {
        setShowMobileNotifications(false);
      }
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    if (showNotifications || showMobileNotifications || showProfileMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [showNotifications, showMobileNotifications, showProfileMenu]);

  useEffect(() => {
    setMobileOpen(false);
    setShowNotifications(false);
    setShowMobileNotifications(false);
  }, [pathname]);

  const unreadCount = notifications.filter((n) => !n.isRead && !n.read).length;

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
                    ? 'bg-[#faf8f5] border-stone-200 hover:border-[#c4431d]/50 hover:bg-white cursor-pointer group'
                    : 'bg-[#faf8f5]/60 border-stone-200'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-[0.625rem] font-black text-[#942008] uppercase tracking-wider">
                    {n.type === 'offer' ? '🔥 Special Offer' : n.type === 'event' ? '🎥 Live Class' : '📢 Update'}
                  </span>
                  <span className="text-[0.625rem] text-stone-400 font-mono">
                    {n.createdAt ? new Date(n.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }) : 'Today'}
                  </span>
                </div>
                <p className="font-bold text-stone-900 mb-0.5 group-hover:text-[#c4431d] transition-colors">{n.title}</p>
                <p className="text-stone-600 leading-relaxed text-[0.6875rem]">{n.message}</p>
                {n.link && (
                  <div className="mt-2 text-[0.625rem] font-bold text-[#c4431d] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
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
      <ProfileUpdateModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onLogout={effectiveLogout}
      />

      <AccessLockModal
        isOpen={lockModal.isOpen}
        onClose={() => setLockModal((prev) => ({ ...prev, isOpen: false }))}
        featureName={lockModal.featureName}
        requiredLevel={lockModal.requiredLevel}
        requiredPoints={lockModal.requiredPoints}
        currentLevel={level || 'Fast Track (L0)'}
        currentPoints={points || 0}
        description={lockModal.description}
      />

      {/* Top Bar matching Reference Image 4 (Left: Page Title, Right: Profile Pill) */}
      <header className="sticky top-0 z-30 w-full bg-white/95 backdrop-blur-md border-b border-stone-200/80 px-4 sm:px-6 lg:px-8 h-16 sm:h-[68px] flex items-center justify-between shadow-[0_1px_3px_0_rgba(0,0,0,0.02)]">
        {/* Left: Mobile Menu Toggle (< 1024px) + Page Title */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            className="lg:hidden p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors cursor-pointer shrink-0"
            aria-label="Toggle navigation"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <h1 className="text-base sm:text-xl lg:text-2xl font-bold text-stone-900 tracking-tight truncate">
            {pageTitle}
          </h1>
        </div>

        {/* Right: Notifications & User Profile Pill matching Reference Image 4 */}
        <div className="flex items-center gap-2.5 sm:gap-3.5 shrink-0">
          {/* Notifications Bell */}
          <div className="relative" ref={mobileNotifRef}>
            <button
              type="button"
              onClick={() => setShowMobileNotifications((prev) => !prev)}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-stone-50 hover:bg-stone-100 border border-stone-200 text-stone-600 flex items-center justify-center transition-colors relative cursor-pointer"
              aria-label="Notifications"
            >
              <Bell size={17} />
              {unreadCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[1.125rem] h-[1.125rem] px-1 bg-gradient-to-r from-[#942008] to-[#ea580c] text-white rounded-full text-[0.625rem] font-black flex items-center justify-center ring-2 ring-white shadow-xs animate-pulse">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </button>

            {showMobileNotifications && (
              <div className="fixed left-3 right-3 top-18 sm:absolute sm:left-auto sm:right-0 sm:top-full sm:mt-2 sm:w-80 rounded-2xl bg-white border border-[#ecdccb] shadow-2xl p-4 z-50 animate-in fade-in duration-200">
                {renderNotificationList(true)}
              </div>
            )}
          </div>

          {/* User Profile Pill with Hover & Click Dropdown */}
          <div
            ref={profileMenuRef}
            className="relative shrink-0"
            onMouseEnter={() => {
              if (typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
                setShowProfileMenu(true);
              }
            }}
            onMouseLeave={() => {
              if (typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
                setShowProfileMenu(false);
              }
            }}
          >
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowProfileMenu((prev) => !prev);
              }}
              className="flex items-center gap-2.5 sm:gap-3 p-1.5 sm:p-2 rounded-2xl hover:bg-stone-50 transition-all cursor-pointer text-left shrink-0 group"
              title="Profile & Settings"
              aria-expanded={showProfileMenu}
            >
              {/* Avatar Circle */}
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#c4431d] text-white font-bold text-sm sm:text-base flex items-center justify-center shrink-0 overflow-hidden shadow-xs ring-2 ring-[#c4431d]/20 group-hover:ring-[#c4431d]/40 transition-all">
                {effectiveUser?.avatarUrl ? (
                  <img
                    src={effectiveUser.avatarUrl}
                    alt={studentName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span>{studentInitial}</span>
                )}
              </div>

              {/* User Info (Name + Level Subtitle) */}
              <div className="hidden sm:flex flex-col min-w-0 max-w-[160px] md:max-w-[200px]">
                <span className="text-xs sm:text-sm font-bold text-stone-900 truncate leading-snug group-hover:text-[#c4431d] transition-colors">
                  {studentName}
                </span>
                <span className="text-[0.6875rem] sm:text-xs text-stone-500 font-medium truncate leading-tight mt-0.5">
                  {studentLevelCode !== 'GENERAL' ? `${studentLevelCode} Student` : 'Student'}
                </span>
              </div>
            </button>

            {/* Floating Dropdown Menu matching Reference Image */}
            {showProfileMenu && (
              <div className="absolute right-0 top-full pt-1.5 z-50 min-w-[200px] animate-in fade-in slide-in-from-top-1 duration-150">
                <div className="bg-white rounded-2xl border border-stone-200/90 shadow-2xl p-1.5 space-y-0.5">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowProfileMenu(false);
                      setIsProfileModalOpen(true);
                    }}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-stone-700 hover:text-stone-950 hover:bg-stone-50 transition-colors text-left cursor-pointer group"
                  >
                    <User size={16} className="text-stone-400 group-hover:text-stone-700 transition-colors shrink-0" />
                    <span>Edit Profile</span>
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowProfileMenu(false);
                      effectiveLogout();
                    }}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 transition-colors text-left cursor-pointer group"
                  >
                    <LogOut size={16} className="text-rose-500 group-hover:text-rose-700 group-hover:-translate-x-0.5 transition-transform shrink-0" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Backdrop Overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-stone-900/50 backdrop-blur-xs z-40 lg:hidden animate-in fade-in duration-200"
        />
      )}

      {/* Left Sidebar (Fixed on Desktop, Slide-over on Mobile) Matching AdminNav UI */}
      <aside
        className={`fixed top-0 left-0 bottom-0 w-64 bg-white border-r border-stone-200/80 flex flex-col z-50 transition-all duration-300 ease-in-out ${
          isProfileModalOpen ? 'blur-[3px] pointer-events-none select-none' : ''
        } ${
          mobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top Brand Header (Favicon icon without background, larger + text 'Ravishing Art') */}
        <div className="p-3.5 sm:p-4 border-b border-stone-100/90 flex items-center shrink-0">
          <Link href="/student/dashboard" className="flex items-center gap-2.5 min-w-0 group cursor-pointer w-full">
            <img
              src="/favicon.png"
              alt="Ravishing Art"
              className="w-9 h-9 sm:w-15 sm:h-15 object-contain shrink-0 group-hover:scale-105 transition-transform"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/brand-emblem.png';
              }}
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-stone-900 text-xs sm:text-lg leading-tight tracking-tight">
                  Ravishing Art
                </span>
              </div>
            </div>
          </Link>
        </div>

        {/* Status Bar: XP & Level + Notifications Bell - Commented out on sidenavbar per user request */}
        {/*
        <div className="px-4 py-3 border-b border-stone-100 flex items-center justify-between gap-2 shrink-0">
          <Link
            href="/student/profile"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-2 text-stone-800 hover:text-[#942008] transition-colors group cursor-pointer"
            title="My XP & Level"
          >
            <Trophy size={14} className="text-[#c4431d] shrink-0 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold text-stone-800 tracking-tight">
              XP {points.toLocaleString()} <span className="text-stone-400 font-normal mx-0.5">·</span> <span className="font-bold text-stone-800">{studentLevelCode === "GENERAL" ? "General" : studentLevelCode}</span>
            </span>
          </Link>

          <div className="relative" ref={notifRef}>
            <button
              type="button"
              onClick={() => setShowNotifications(prev => !prev)}
              className="w-8 h-8 rounded-xl hover:bg-stone-100 text-stone-500 hover:text-stone-800 flex items-center justify-center transition-colors relative cursor-pointer"
              title="Notifications"
            >
              <Bell size={16} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-[#942008] to-[#ea580c] text-white rounded-full text-[0.625rem] font-black flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="fixed lg:absolute left-4 right-4 lg:left-full lg:right-auto top-24 lg:top-0 lg:ml-3 w-auto lg:w-88 rounded-2xl bg-white border border-[#ecdccb] shadow-2xl p-4 z-50 animate-in fade-in duration-200">
                {renderNotificationList(false)}
              </div>
            )}
          </div>
        </div>
        */}

        {/* Scrollable Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1 custom-scrollbar">
          {navLinks.map((link) => {
            const isActive = pathname === link.path;
            const IconComponent = link.icon;
            return (
              <Link
                key={link.name}
                href={link.isAccessible ? link.path : '#'}
                onClick={(e) => {
                  handleNavClick(link, e);
                  if (link.isAccessible) setMobileOpen(false);
                }}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#fff4ed] text-[#9b2c16] border border-[#f8dfd0]'
                    : link.isAccessible
                    ? 'text-stone-800 hover:text-stone-950 hover:bg-stone-50'
                    : 'text-stone-400 hover:text-stone-600 hover:bg-stone-50/60 font-semibold opacity-75'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    className={
                      isActive
                        ? 'text-[#9b2c16]'
                        : link.isAccessible
                        ? 'text-stone-600'
                        : 'text-stone-300'
                    }
                  >
                    <IconComponent size={18} />
                  </span>
                  <span className="truncate">{link.name}</span>
                </div>

                {!link.isAccessible && (
                  <span className="flex items-center justify-center w-5 h-5 rounded-md bg-stone-100 border border-stone-200 text-[#c4431d] text-[0.625rem] shrink-0 ml-1.5">
                    <Lock size={11} />
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Bottom Section: Profile card removed per user request (already available in top bar) */}
      </aside>
    </>
  );
};
