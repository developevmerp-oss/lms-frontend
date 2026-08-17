"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogOut, Trophy, Bell, Menu, X, ChevronRight } from 'lucide-react';

interface StudentNavProps {
  user: any;
  level: string;
  points: number;
  logout: () => void;
  notifications?: any[];
}

export const StudentNav = ({ user, level, points, logout, notifications = [] }: StudentNavProps) => {
  const pathname = usePathname();
  const [showNotifications, setShowNotifications] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  const navLinks = [
    { name: 'Command Center', path: '/student/dashboard' },
    { name: 'My Journey', path: '/student/courses' },
    { name: 'Daily Tasks', path: '/student/tasks' },
    { name: 'Leaderboard', path: '/student/leaderboard' },
    { name: 'Rewards Store', path: '/student/rewards' },
  ];

  // Close notification dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    };
    if (showNotifications) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showNotifications]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const unreadCount = notifications.filter(n => !n.isRead && !n.read).length;

  return (
    <nav className="w-full bg-slate-900 border-b border-slate-800 shadow-xl sticky top-0 z-50">
      <div className="max-w-[1600px] mx-auto px-4 md:px-6 h-16 md:h-20 flex items-center justify-between">

        {/* Left: Logo */}
        <div className="flex items-center gap-4 md:gap-12">
          <Link href="/student/dashboard" className="flex items-center gap-2 shrink-0">
            <h2 className="text-lg md:text-xl font-black text-white tracking-tight">
              Ravishing <span className="text-orange-500">Art Hub</span>
            </h2>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.path;
              return (
                <Link
                  key={link.name}
                  href={link.path}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${
                    isActive
                      ? 'bg-orange-500/10 text-orange-500 border border-orange-500/20'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800 border border-transparent'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 md:gap-4">

          {/* Level Pill (hidden on small mobile) */}
          <div className="hidden sm:flex items-center gap-3 bg-slate-950 border border-slate-800 rounded-full px-4 py-1.5 shadow-inner">
            <Trophy size={16} className="text-orange-500 shrink-0" />
            <div className="flex flex-col">
              <span className="text-xs font-bold text-white leading-none">{level}</span>
              <span className="text-[10px] text-slate-400 font-bold leading-none mt-0.5">{points.toLocaleString()} XP</span>
            </div>
          </div>

          <div className="w-px h-8 bg-slate-800 hidden md:block"></div>

          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-orange-500/30 text-slate-400 hover:text-white flex items-center justify-center transition-colors relative"
            >
              <Bell size={17} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-slate-900 text-[9px] font-black text-white flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute top-full right-0 mt-3 w-72 md:w-80 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-50">
                <div className="px-4 py-3 border-b border-slate-800 flex justify-between items-center bg-slate-800/50">
                  <h3 className="font-bold text-white text-sm">Notifications</h3>
                  <button className="text-xs text-orange-500 hover:text-orange-400 font-semibold">Mark all read</button>
                </div>
                <div className="max-h-72 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map((n, idx) => (
                      <div key={n.id || idx} className={`px-4 py-3 border-b border-slate-800 last:border-0 hover:bg-slate-800/30 transition-colors cursor-pointer ${(!n.isRead && !n.read) ? 'bg-orange-500/5' : ''}`}>
                        <h4 className={`text-sm font-bold mb-0.5 ${(!n.isRead && !n.read) ? 'text-white' : 'text-slate-300'}`}>{n.title}</h4>
                        <p className="text-xs text-slate-400 leading-relaxed">{n.message}</p>
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-8 text-center text-slate-500 text-sm">No notifications</div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Avatar (desktop) */}
          <div className="hidden sm:flex items-center gap-3">
            <div className="text-right hidden md:block">
              <p className="text-sm font-bold text-white leading-tight">{user?.name || "Student"}</p>
              <p className="text-xs text-slate-400 font-medium">Artist</p>
            </div>
            <div className="w-9 h-9 md:w-10 md:h-10 rounded-full overflow-hidden border-2 border-orange-500 shadow-lg shadow-orange-500/20 cursor-pointer hover:scale-105 transition-transform shrink-0">
              <img
                src={user?.avatarUrl || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop"}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Logout (desktop) */}
          <button
            onClick={logout}
            className="hidden sm:flex w-9 h-9 rounded-xl bg-slate-800 hover:bg-red-500/20 border border-slate-700 hover:border-red-500/30 text-slate-400 hover:text-red-400 items-center justify-center transition-colors"
            title="Sign Out"
          >
            <LogOut size={17} />
          </button>

          {/* Hamburger (mobile only) */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-900 border-t border-slate-800 shadow-2xl">
          {/* User info row */}
          <div className="flex items-center gap-3 px-4 py-4 border-b border-slate-800 bg-slate-950/50">
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-orange-500 shrink-0">
              <img
                src={user?.avatarUrl || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop"}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-white text-sm truncate">{user?.name || "Student"}</p>
              <p className="text-xs text-orange-400 font-bold">{level} · {points.toLocaleString()} XP</p>
            </div>
            <button
              onClick={logout}
              className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-red-500/20 border border-slate-700 hover:border-red-500/30 text-slate-400 hover:text-red-400 flex items-center justify-center transition-colors shrink-0"
            >
              <LogOut size={17} />
            </button>
          </div>

          {/* Nav links */}
          <div className="py-2 px-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.path;
              return (
                <Link
                  key={link.name}
                  href={link.path}
                  className={`flex items-center justify-between px-4 py-3.5 rounded-xl mb-1 text-sm font-bold transition-all ${
                    isActive
                      ? 'bg-orange-500/10 text-orange-500 border border-orange-500/20'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {link.name}
                  <ChevronRight size={16} className="text-slate-500" />
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
};
