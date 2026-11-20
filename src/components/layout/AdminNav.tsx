'use client';

import React, { useState, useEffect } from 'react';
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
} from 'lucide-react';
import { ProfileUpdateModal } from '@/components/profile/ProfileUpdateModal';

interface AdminNavProps {
  user: any;
  logout: () => void;
}

interface NavItem {
  name: string;
  path: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

export const AdminNav = ({ user, logout }: AdminNavProps) => {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

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

  // Accordion state
  const [crmOpen, setCrmOpen] = useState(true);
  const [courseOpen, setCourseOpen] = useState(true);

  // Auto-expand active group on path change, close mobile drawer
  useEffect(() => {
    if (isCrmActive) setCrmOpen(true);
    if (isCourseActive) setCourseOpen(true);
    setMobileOpen(false);
  }, [pathname, isCrmActive, isCourseActive]);

  const isDashboardActive = isItemActive('/admin/dashboard');
  const isLeaderboardActive = isItemActive('/admin/leaderboard');

  return (
    <>
      <ProfileUpdateModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onLogout={logout}
      />

      {/* Mobile Top Bar (< 1024px) */}
      <div className="lg:hidden sticky top-0 z-30 bg-white border-b border-stone-200/80 px-4 py-2.5 flex items-center justify-between shadow-xs">
        <Link href="/admin/dashboard" className="flex items-center gap-2">
          <img
            src="/favicon.png"
            alt="Favicon"
            className="w-8 h-8 object-contain shrink-0"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/brand-emblem.png';
            }}
          />
          <span className="font-bold text-stone-900 text-xs sm:text-sm">Ravishing Art</span>
        </Link>

        <button
          type="button"
          onClick={() => setMobileOpen((prev) => !prev)}
          className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors cursor-pointer"
          aria-label="Toggle navigation"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

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
              onClick={() => setCrmOpen((prev) => !prev)}
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
              {crmOpen ? (
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
            {crmOpen && (
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
              onClick={() => setCourseOpen((prev) => !prev)}
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
              {courseOpen ? (
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
            {courseOpen && (
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

        {/* Bottom Section: Profile Card only (Logout button moved to Edit Profile modal) */}
        <div className="p-3 border-t border-stone-200/70 shrink-0 bg-white">
          <button
            type="button"
            onClick={() => setIsProfileModalOpen(true)}
            className="w-full p-2.5 sm:p-3 flex items-center gap-5 transition-all cursor-pointer text-left shadow-2xs group"
            title="Edit Profile"
          >
            {/* Avatar */}
            <div className="w-10 h-10 rounded-full bg-[#fde5d6] text-[#c4431d] font-bold text-sm sm:text-base flex items-center justify-center shrink-0 border border-[#f5ded0] overflow-hidden">
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

            {/* User Info */}
            <div className="min-w-0 flex-1">
              <p className="text-sm sm:text-base font-bold text-stone-900 truncate leading-tight group-hover:text-[#9b2c16] transition-colors">
                {user?.name || 'Admin'}
              </p>
              <p className="text-[0.6875rem] sm:text-xs text-stone-400 font-medium leading-tight mt-0.5">
                Edit Profile {/* → */}
              </p>
            </div>
          </button>
        </div>
      </aside>
    </>
  );
};
