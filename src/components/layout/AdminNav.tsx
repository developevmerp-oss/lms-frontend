'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Users,
  IndianRupee,
  ShoppingBag,
  Bell,
  Sparkles,
  Megaphone,
  Trophy,
  Target,
  Award,
  BookOpen,
  Video,
  ClipboardList,
  ChevronDown,
  ChevronUp,
  Menu,
  X,
  User,
  LogOut,
} from 'lucide-react';
import { ProfileUpdateModal } from '@/components/profile/ProfileUpdateModal';

interface AdminNavProps {
  user: any;
  logout: () => void;
  title?: string;
}

const getAdminPageTitle = (path: string, customTitle?: string): string => {
  if (customTitle) return customTitle;
  if (!path) return 'Admin Command Center';
  if (path === '/admin/dashboard' || path === '/admin') return 'Admin Command Center';
  if (path.startsWith('/admin/courses')) return 'Course Management';
  if (path.startsWith('/admin/students')) return 'Student Management & Engagement';
  if (path.startsWith('/admin/payments')) return 'Razorpay Payment & Transactions';
  if (path.startsWith('/admin/sales')) return 'Student Revenue & Sales Monitor';
  if (path.startsWith('/admin/notifications')) return 'Targeted Broadcast Center';
  if (path.startsWith('/admin/webinar')) return 'Webinar Management & Leads CRM';
  if (path.startsWith('/admin/marketing')) return 'Marketing & Tracking Manager';
  if (path.startsWith('/admin/levels')) return 'Membership Level & Price Settings';
  if (path.startsWith('/admin/milestones')) return 'Milestone Management';
  if (path.startsWith('/admin/badges')) return 'Badge & Reward Management';
  if (path.startsWith('/admin/rewards')) return 'Merch Store Manager';
  if (path.startsWith('/admin/offers')) return 'Special Offers & Campaign Manager';
  if (path.startsWith('/admin/classes')) return 'Online Class & Attendance Management';
  if (path.startsWith('/admin/assignments')) return 'Assignment Management';
  if (path.startsWith('/admin/mentoring')) return 'Mentoring Center';
  if (path.startsWith('/admin/certificates')) return 'Certificate Management';
  if (path.startsWith('/admin/leaderboard')) return 'Platform Leaderboard';
  return 'Admin Command Center';
};

interface NavItem {
  name: string;
  path: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

export const AdminNav = ({ user, logout, title }: AdminNavProps) => {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    if (showProfileMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [showProfileMenu]);

  const pageTitle = getAdminPageTitle(pathname, title);

  // Path matching helper
  const isItemActive = (path: string) => {
    if (path === '/admin/dashboard') {
      return pathname === '/admin/dashboard';
    }
    return pathname === path || pathname.startsWith(path + '/');
  };

  // Group 1: Students & CRM items (matching reference image exact order)
  const crmItems: NavItem[] = [
    { name: 'All Students', path: '/admin/students', icon: Users },
    { name: 'Payment Transactions', path: '/admin/payments', icon: IndianRupee },
    { name: 'Student Sales (Art)', path: '/admin/sales', icon: ShoppingBag },
    { name: 'Broadcast Center', path: '/admin/notifications', icon: Bell },
    { name: 'Webinar Leads', path: '/admin/webinar', icon: Sparkles },
    { name: 'Marketing & Tracking', path: '/admin/marketing', icon: Megaphone },
    { name: 'Level Settings', path: '/admin/levels', icon: Trophy },
    { name: 'Milestones', path: '/admin/milestones', icon: Target },
    { name: 'Badges & Rewards', path: '/admin/badges', icon: Award },
    { name: 'Merch Store Manager', path: '/admin/rewards', icon: ShoppingBag },
    { name: 'Special Offers', path: '/admin/offers', icon: Sparkles },
  ];

  // Group 2: Courses & Coaching items (matching reference image exact order)
  const courseItems: NavItem[] = [
    { name: 'Manage Courses', path: '/admin/courses', icon: BookOpen },
    { name: 'Live Classes & Attenda...', path: '/admin/classes', icon: Video },
    { name: 'Assignments', path: '/admin/assignments', icon: ClipboardList },
    { name: 'Mentoring Center', path: '/admin/mentoring', icon: Video },
    { name: 'Certificates', path: '/admin/certificates', icon: Award },
  ];

  const isCrmActive = crmItems.some((item) => isItemActive(item.path));
  const isCourseActive = courseItems.some((item) => isItemActive(item.path));

  // Accordion state: automatically open if the current page belongs to that dropdown
  const [openDropdown, setOpenDropdown] = useState<'crm' | 'courses' | null>(() => {
    if (crmItems.some((item) => pathname === item.path || pathname.startsWith(item.path + '/'))) {
      return 'crm';
    }
    if (courseItems.some((item) => pathname === item.path || pathname.startsWith(item.path + '/'))) {
      return 'courses';
    }
    return null;
  });

  const toggleDropdown = (key: 'crm' | 'courses') => {
    setOpenDropdown((prev) => (prev === key ? null : key));
  };

  // Auto-expand the dropdown menu if the currently selected page belongs to it
  useEffect(() => {
    if (isCrmActive) {
      setOpenDropdown('crm');
    } else if (isCourseActive) {
      setOpenDropdown('courses');
    }
  }, [pathname, isCrmActive, isCourseActive]);

  // Close mobile drawer on path change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const isDashboardActive = isItemActive('/admin/dashboard');
  const isLeaderboardActive = isItemActive('/admin/leaderboard');

  return (
    <>
      <ProfileUpdateModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onLogout={logout}
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

        {/* Right: User Profile Pill with Hover & Click Dropdown */}
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
              {user?.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user?.name || 'Admin'}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span>{user?.name?.charAt(0).toUpperCase() || 'A'}</span>
              )}
            </div>

            {/* User Info (Name + Role Subtitle) */}
            <div className="hidden sm:flex flex-col min-w-0 max-w-[160px] md:max-w-[200px]">
              <span className="text-xs sm:text-sm font-bold text-stone-900 truncate leading-snug group-hover:text-[#c4431d] transition-colors">
                {user?.name || 'Admin'}
              </span>
              <span className="text-[0.6875rem] sm:text-xs text-stone-500 font-medium truncate leading-tight mt-0.5">
                {user?.role && user.role.toLowerCase() !== 'admin' ? user.role : 'Studio Admin'}
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
                    logout();
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
      </header>

      {/* Mobile Backdrop Overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-stone-900/40 backdrop-blur-xs z-40 lg:hidden animate-in fade-in duration-200"
        />
      )}

      {/* Left Sidebar (Fixed on Desktop, Slide-over on Mobile) */}
      <aside
        className={`fixed top-0 left-0 bottom-0 w-64 bg-white border-r border-stone-200/80 flex flex-col z-50 transition-all duration-300 ease-in-out ${isProfileModalOpen ? 'blur-[3px] pointer-events-none select-none' : ''
          } ${mobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'
          }`}
      >
        {/* Top Brand Header (Favicon icon without background, larger + text 'Ravishing Art') */}
        <div className="p-3.5 sm:p-4 border-b border-stone-100/90 flex items-center shrink-0">
          <Link href="/admin/dashboard" className="flex items-center gap-2.5 min-w-0 group cursor-pointer w-full">
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

        {/* Scrollable Navigation Area */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1 custom-scrollbar">
          {/* 1. Dashboard (Standalone Top Item) */}
          <Link
            href="/admin/dashboard"
            onClick={() => setMobileOpen(false)}
            className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${isDashboardActive
              ? 'bg-[#fff4ed] text-[#9b2c16] border border-[#f8dfd0]'
              : 'text-stone-800 hover:text-stone-950 hover:bg-stone-50'
              }`}
          >
            <Home
              size={18}
              className={`shrink-0 ${isDashboardActive ? 'text-[#9b2c16]' : 'text-stone-600'}`}
            />
            <span>Dashboard</span>
          </Link>

          {/* 2. Students & CRM (Collapsible Accordion) */}
          <div className="pt-1">
            <button
              type="button"
              onClick={() => toggleDropdown('crm')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${isCrmActive
                ? 'bg-[#fff4ed] text-[#9b2c16] border border-[#f8dfd0]'
                : 'text-stone-800 hover:text-stone-950 hover:bg-stone-50'
                }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Users
                  size={18}
                  className={`shrink-0 ${isCrmActive ? 'text-[#9b2c16]' : 'text-stone-600'}`}
                />
                <span className="truncate">Students &amp; CRM</span>
              </div>
              {openDropdown === 'crm' ? (
                <ChevronUp
                  size={16}
                  className={`shrink-0 ${isCrmActive ? 'text-[#9b2c16]' : 'text-stone-500'}`}
                />
              ) : (
                <ChevronDown
                  size={16}
                  className={`shrink-0 ${isCrmActive ? 'text-[#9b2c16]' : 'text-stone-500'}`}
                />
              )}
            </button>

            {/* Accordion Children with Left Connecting Line */}
            {openDropdown === 'crm' && (
              <div className="relative pl-3.5 ml-5 border-l border-stone-200/90 my-1 space-y-0.5">
                {crmItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = isItemActive(item.path);

                  return (
                    <Link
                      key={item.path}
                      href={item.path}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-xs sm:text-[0.8125rem] transition-all cursor-pointer ${isActive
                        ? 'bg-[#fef3eb] text-[#9b2c16] font-bold border border-[#fcdcc5] shadow-2xs'
                        : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50 font-medium'
                        }`}
                    >
                      <Icon
                        size={15}
                        className={`shrink-0 ${isActive ? 'text-[#9b2c16]' : 'text-stone-400 group-hover:text-stone-600'
                          }`}
                      />
                      <span className="truncate">{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* 3. Courses & Coaching (Collapsible Accordion) */}
          <div className="pt-1">
            <button
              type="button"
              onClick={() => toggleDropdown('courses')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${isCourseActive
                ? 'bg-[#fff4ed] text-[#9b2c16] border border-[#f8dfd0]'
                : 'text-stone-800 hover:text-stone-950 hover:bg-stone-50'
                }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <BookOpen
                  size={18}
                  className={`shrink-0 ${isCourseActive ? 'text-[#9b2c16]' : 'text-stone-600'}`}
                />
                <span className="truncate">Courses &amp; Coaching</span>
              </div>
              {openDropdown === 'courses' ? (
                <ChevronUp
                  size={16}
                  className={`shrink-0 ${isCourseActive ? 'text-[#9b2c16]' : 'text-stone-500'}`}
                />
              ) : (
                <ChevronDown
                  size={16}
                  className={`shrink-0 ${isCourseActive ? 'text-[#9b2c16]' : 'text-stone-500'}`}
                />
              )}
            </button>

            {/* Accordion Children with Left Connecting Line */}
            {openDropdown === 'courses' && (
              <div className="relative pl-3.5 ml-5 border-l border-stone-200/90 my-1 space-y-0.5">
                {courseItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = isItemActive(item.path);

                  return (
                    <Link
                      key={item.path}
                      href={item.path}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-xs sm:text-[0.8125rem] transition-all cursor-pointer ${isActive
                        ? 'bg-[#fef3eb] text-[#9b2c16] font-bold border border-[#fcdcc5] shadow-2xs'
                        : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50 font-medium'
                        }`}
                    >
                      <Icon
                        size={15}
                        className={`shrink-0 ${isActive ? 'text-[#9b2c16]' : 'text-stone-400 group-hover:text-stone-600'
                          }`}
                      />
                      <span className="truncate">{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* 4. Leaderboard (Standalone Bottom Item) */}
          <div className="pt-1">
            <Link
              href="/admin/leaderboard"
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${isLeaderboardActive
                ? 'bg-[#fff4ed] text-[#9b2c16] border border-[#f8dfd0]'
                : 'text-stone-800 hover:text-stone-950 hover:bg-stone-50'
                }`}
            >
              <Trophy
                size={18}
                className={`shrink-0 ${isLeaderboardActive ? 'text-[#9b2c16]' : 'text-stone-600'}`}
              />
              <span>Leaderboard</span>
            </Link>
          </div>
        </div>

        {/* Bottom Section: Profile card removed per user request (already available in top bar) */}
      </aside>
    </>
  );
};
