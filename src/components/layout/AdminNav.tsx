"use client";

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogOut, ShieldAlert, ChevronDown, ChevronRight, Users, BookOpen, Target, IndianRupee, Trophy, Award, Star, Video, ClipboardList, Menu, X } from 'lucide-react';
import { ProfileUpdateModal } from '@/components/profile/ProfileUpdateModal';

interface AdminNavProps {
  user: any;
  logout: () => void;
}

const NAV_GROUPS = [
  {
    label: 'Dashboard',
    path: '/admin/dashboard',
    icon: <Star size={15} />,
    single: true,
  },
  {
    label: 'Students',
    icon: <Users size={15} />,
    children: [
      { name: 'All Students', path: '/admin/students', icon: <Users size={14} /> },
      { name: 'Level Settings', path: '/admin/levels', icon: <Trophy size={14} /> },
      { name: 'Milestones', path: '/admin/milestones', icon: <Target size={14} /> },
      { name: 'Sales Records', path: '/admin/sales', icon: <IndianRupee size={14} /> },
    ]
  },
  {
    label: 'Courses',
    icon: <BookOpen size={15} />,
    children: [
      { name: 'Manage Courses', path: '/admin/courses', icon: <BookOpen size={14} /> },
      { name: 'Assignments', path: '/admin/assignments', icon: <ClipboardList size={14} /> },
      { name: 'Mentoring Center', path: '/admin/mentoring', icon: <Video size={14} /> },
      { name: 'Certificates', path: '/admin/certificates', icon: <Award size={14} /> },
    ]
  },
  {
    label: 'Leaderboard',
    path: '/admin/leaderboard',
    icon: <Trophy size={15} />,
    single: true,
  },
];

// Dropdown component with click-outside detection
function NavDropdown({ group, active, pathname }: { group: any; active: boolean; pathname: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(prev => !prev)}
        className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 ${active
            ? 'bg-orange-500/10 text-orange-500 border border-orange-500/20'
            : 'text-slate-400 hover:text-white hover:bg-slate-800 border border-transparent'
          }`}
      >
        {group.icon}
        {group.label}
        <ChevronDown size={14} className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-2 w-56 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden z-[9999]">
          {group.children?.map((item: any) => (
            <Link
              key={item.path}
              href={item.path}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${pathname === item.path
                  ? 'bg-orange-500/10 text-orange-500 border-l-2 border-orange-500'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
            >
              {item.icon} {item.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export const AdminNav = ({ user, logout }: AdminNavProps) => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const isGroupActive = (group: typeof NAV_GROUPS[0]) => {
    if (group.single && group.path) return pathname.startsWith(group.path);
    if (group.children) return group.children.some(c => pathname.startsWith(c.path));
    return false;
  };


  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <ProfileUpdateModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} />
      <nav className="w-full bg-slate-900 border-b border-slate-800 shadow-xl sticky top-0 z-40">
        <div className="max-w-[1600px] mx-auto px-4 md:px-6 h-16 md:h-20 flex items-center justify-between">

          {/* Left: Brand + Nav */}
          <div className="flex items-center gap-4 md:gap-8">
            <Link href="/admin/dashboard" className="flex items-center gap-2 shrink-0">
              {/* Logo icon: show only top portion of the circular logo (hides name text at bottom) */}
              <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border border-white/10">
                <img
                  src="/logo.jpeg"
                  alt="Ravishing Art Hub"
                  className="w-full"
                  style={{ marginTop: '-2%', height: '110%', objectFit: 'cover', objectPosition: 'top' }}
                />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-sm font-black text-white tracking-tight">Ravishing Art</span>
                <span className="text-[10px] font-medium text-orange-400 tracking-wider">by Vrajangna Patel</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {NAV_GROUPS.map((group) => {
                const active = isGroupActive(group);
                if (group.single) {
                  return (
                    <Link
                      key={group.label}
                      href={group.path!}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 ${active
                          ? 'bg-orange-500/10 text-orange-500 border border-orange-500/20'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800 border border-transparent'
                        }`}
                    >
                      {group.icon} {group.label}
                    </Link>
                  );
                }
                return (
                  <NavDropdown key={group.label} group={group} active={active} pathname={pathname} />
                );
              })}
            </div>
          </div>

          {/* Right */}
          <div className="flex items-center gap-2 md:gap-4">
            <div className="hidden md:flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 rounded-full px-3 py-1.5">
              <ShieldAlert size={14} />
              <span className="text-xs font-bold uppercase tracking-wider">Admin</span>
            </div>

            {/* Admin Avatar & Edit Profile Trigger */}
            <button
              onClick={() => setIsProfileModalOpen(true)}
              className="hidden sm:flex items-center gap-3 group text-left p-1 rounded-2xl hover:bg-slate-800/60 transition-colors"
              title="Click to edit profile & photo"
            >
              <div className="text-right hidden md:block">
                <p className="text-sm font-bold text-white leading-tight group-hover:text-orange-400 transition-colors">{user?.name || "Admin"}</p>
                <p className="text-[11px] text-slate-400">Edit Profile ⚙️</p>
              </div>
              <div className="w-9 h-9 md:w-10 md:h-10 rounded-full overflow-hidden border-2 border-orange-500 shadow-lg shadow-orange-500/20 shrink-0 bg-slate-800 flex items-center justify-center text-sm font-bold text-white group-hover:scale-105 transition-transform">
                {user?.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user?.name || "Admin"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span>{user?.name?.charAt(0).toUpperCase() || "A"}</span>
                )}
              </div>
            </button>

            <button
              onClick={logout}
              className="hidden sm:flex w-9 h-9 rounded-xl bg-slate-800 hover:bg-red-500/20 border border-slate-700 hover:border-red-500/30 text-slate-400 hover:text-red-400 items-center justify-center transition-colors"
              title="Sign Out"
            >
              <LogOut size={16} />
            </button>

            {/* Hamburger */}
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
            {/* Admin user row */}
            <div
              onClick={() => { setIsProfileModalOpen(true); setMobileMenuOpen(false); }}
              className="flex items-center gap-3 px-4 py-4 border-b border-slate-800 bg-slate-950/50 cursor-pointer hover:bg-slate-800/40 transition-colors"
            >
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-orange-500 shrink-0 bg-slate-800 flex items-center justify-center font-bold text-white">
                {user?.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user?.name || "Admin"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span>{user?.name?.charAt(0).toUpperCase() || "A"}</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-white text-sm truncate">{user?.name || "Admin"}</p>
                <p className="text-xs text-orange-400 font-bold flex items-center gap-1">Edit Profile & Photo ⚙️</p>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); logout?.(); }}
                className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-red-500/20 border border-slate-700 hover:border-red-500/30 text-slate-400 hover:text-red-400 flex items-center justify-center transition-colors shrink-0"
              >
                <LogOut size={16} />
              </button>
            </div>

            {/* Nav links */}
            <div className="py-2 px-2">
              {NAV_GROUPS.map((group) => {
                const active = isGroupActive(group);
                if (group.single) {
                  return (
                    <Link
                      key={group.label}
                      href={group.path!}
                      className={`flex items-center justify-between px-4 py-3.5 rounded-xl mb-1 text-sm font-bold transition-all ${active ? 'bg-orange-500/10 text-orange-500 border border-orange-500/20' : 'text-slate-300 hover:text-white hover:bg-slate-800'
                        }`}
                    >
                      <span className="flex items-center gap-2">{group.icon} {group.label}</span>
                      <ChevronRight size={16} className="text-slate-500" />
                    </Link>
                  );
                }
                return (
                  <div key={group.label}>
                    <button
                      onClick={() => setMobileExpanded(mobileExpanded === group.label ? null : group.label)}
                      className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl mb-1 text-sm font-bold transition-all ${active ? 'bg-orange-500/10 text-orange-500 border border-orange-500/20' : 'text-slate-300 hover:text-white hover:bg-slate-800'
                        }`}
                    >
                      <span className="flex items-center gap-2">{group.icon} {group.label}</span>
                      <ChevronDown size={16} className={`text-slate-500 transition-transform ${mobileExpanded === group.label ? 'rotate-180' : ''}`} />
                    </button>
                    {mobileExpanded === group.label && (
                      <div className="ml-4 mb-2 border-l border-slate-800 pl-3 space-y-1">
                        {group.children?.map((item: any) => (
                          <Link
                            key={item.path}
                            href={item.path}
                            className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${pathname === item.path ? 'bg-orange-500/10 text-orange-400' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                              }`}
                          >
                            {item.icon} {item.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </nav>
    </>
  );
};


