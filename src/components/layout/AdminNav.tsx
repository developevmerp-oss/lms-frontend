'use client';

import { BrandLogo } from "@/components/ui/BrandLogo";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Users,
  BookOpen,
  Trophy,
  Award,
  IndianRupee,
  Sparkles,
  Bell,
  ShoppingBag,
  Megaphone,
  Video,
  ClipboardList,
  Target,
  LogOut,
  ChevronDown,
  Menu,
  X,
  ShieldAlert,
} from 'lucide-react';
import { ProfileUpdateModal } from '@/components/profile/ProfileUpdateModal';

interface AdminNavProps {
  user: any;
  logout: () => void;
}

const NAV_ITEMS = [
  {
    label: 'Dashboard',
    path: '/admin/dashboard',
    icon: <Home size={18} />,
    single: true,
  },
  {
    label: 'Students & CRM',
    icon: <Users size={18} />,
    children: [
      { name: 'All Students', path: '/admin/students', icon: <Users size={14} /> },
      { name: 'Payment Transactions', path: '/admin/payments', icon: <IndianRupee size={14} /> },
      { name: 'Student Sales (Art)', path: '/admin/sales', icon: <ShoppingBag size={14} /> },
      { name: 'Broadcast Center', path: '/admin/notifications', icon: <Bell size={14} /> },
      { name: 'Webinar Leads', path: '/admin/webinar', icon: <Sparkles size={14} /> },
      { name: 'Marketing & Tracking', path: '/admin/marketing', icon: <Megaphone size={14} /> },
      { name: 'Level Settings', path: '/admin/levels', icon: <Trophy size={14} /> },
      { name: 'Milestones', path: '/admin/milestones', icon: <Target size={14} /> },
      { name: 'Badges & Rewards', path: '/admin/badges', icon: <Award size={14} /> },
      { name: 'Merch Store Manager', path: '/admin/rewards', icon: <ShoppingBag size={14} /> },
      { name: 'Special Offers', path: '/admin/offers', icon: <Sparkles size={14} /> },
    ],
  },
  {
    label: 'Courses & Coaching',
    icon: <BookOpen size={18} />,
    children: [
      { name: 'Manage Courses', path: '/admin/courses', icon: <BookOpen size={14} /> },
      { name: 'Live Classes & Attendance', path: '/admin/classes', icon: <Video size={14} /> },
      { name: 'Assignments', path: '/admin/assignments', icon: <ClipboardList size={14} /> },
      { name: 'Mentoring Center', path: '/admin/mentoring', icon: <Video size={14} /> },
      { name: 'Certificates', path: '/admin/certificates', icon: <Award size={14} /> },
    ],
  },
  {
    label: 'Leaderboard',
    path: '/admin/leaderboard',
    icon: <Trophy size={18} />,
    single: true,
  },
];

export const AdminNav = ({ user, logout }: AdminNavProps) => {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Accordion state: by default expand groups that contain the active path
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    'Students & CRM': true,
    'Courses & Coaching': true,
  });

  useEffect(() => {
    NAV_ITEMS.forEach(item => {
      if (item.children?.some(c => c.path === pathname)) {
        setExpanded(prev => ({ ...prev, [item.label]: true }));
      }
    });
    setMobileOpen(false);
  }, [pathname]);

  const toggleGroup = (label: string) => {
    setExpanded(prev => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <>
      <ProfileUpdateModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />

      {/* Mobile Top Header Bar (< 1024px) */}
      <div className="lg:hidden sticky top-0 z-30 bg-white/95 border-b border-[#ecdccb] px-4 py-3 flex items-center justify-between backdrop-blur-md shadow-xs">
        <BrandLogo href="/admin/dashboard" size="sm" />
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsProfileModalOpen(true)}
            className="w-9 h-9 rounded-full overflow-hidden border-2 border-[#c4431d] bg-[#fde5d6] flex items-center justify-center text-xs font-black text-[#c4431d]"
          >
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt="Admin" className="w-full h-full object-cover" />
            ) : (
              <span>{user?.name?.charAt(0).toUpperCase() || "A"}</span>
            )}
          </button>
          <button
            onClick={() => setMobileOpen(prev => !prev)}
            className="w-9 h-9 rounded-xl bg-stone-100 hover:bg-stone-200 border border-stone-200 text-stone-700 flex items-center justify-center transition-colors cursor-pointer"
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

      {/* Floating Left Sidebar (Fixed on Desktop, Slide-over on Mobile) */}
      <aside
        className={`fixed top-3 left-3 bottom-3 w-[272px] bg-white/95 border border-[#ecdccb] rounded-3xl shadow-[0_10px_30px_-12px_rgba(90,55,20,0.08)] flex flex-col z-50 backdrop-blur-xl transition-transform duration-300 ease-in-out overflow-hidden ${mobileOpen ? 'translate-x-0' : '-translate-x-[calc(100%+24px)] lg:translate-x-0'
          }`}
      >
        {/* Top: Brand Logo */}
        <div className="pt-5 pb-4 px-6 flex flex-col items-center justify-center border-b border-stone-100/90 shrink-0">
          <BrandLogo href="/admin/dashboard" size="md" />
        </div>

        {/* Scrollable Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-1.5 custom-scrollbar">
          {NAV_ITEMS.map((item) => {
            if (item.single) {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.label}
                  href={item.path!}
                  onClick={() => setMobileOpen(false)}
                  className={`relative flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm transition-all duration-200 group ${isActive
                    ? 'bg-gradient-to-r from-[#fde5d6]/80 via-[#fff5ee] to-[#fff5ee] text-[#942008] font-black border border-[#f5ded0] shadow-2xs'
                    : 'text-stone-700 hover:text-[#942008] hover:bg-stone-50 font-bold border border-transparent'
                    }`}
                >
                  <span className={isActive ? 'text-[#c4431d]' : 'text-stone-400 group-hover:text-[#c4431d]'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </Link>
              );
            }

            const isChildActive = item.children?.some(c => c.path === pathname);
            const isExpanded = !!expanded[item.label];

            return (
              <div key={item.label} className="space-y-1">
                <button
                  type="button"
                  onClick={() => toggleGroup(item.label)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm transition-all duration-200 cursor-pointer group ${isChildActive
                    ? 'text-[#942008] font-black bg-[#fff5ee]/70 border border-[#f5ded0]/70'
                    : 'text-stone-700 hover:text-[#942008] hover:bg-stone-50 font-bold border border-transparent'
                    }`}
                >
                  <div className="flex items-center gap-3.5">
                    <span className={isChildActive ? 'text-[#c4431d]' : 'text-stone-400 group-hover:text-[#c4431d]'}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>
                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-200 ${isExpanded ? 'rotate-180 text-[#c4431d]' : 'text-stone-400'
                      }`}
                  />
                </button>

                {/* Sub-links dropdown / accordion */}
                {isExpanded && (
                  <div className="ml-5 pl-3 border-l border-[#ecdccb] my-1 space-y-0.5 animate-in fade-in slide-in-from-top-1 duration-150">
                    {item.children?.map((child) => {
                      const isSubActive = pathname === child.path;
                      return (
                        <Link
                          key={child.path}
                          href={child.path}
                          onClick={() => setMobileOpen(false)}
                          className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs transition-all ${isSubActive
                            ? 'bg-[#fff5ee] text-[#942008] font-black border border-[#f5ded0] shadow-2xs'
                            : 'text-stone-600 hover:text-[#942008] hover:bg-stone-50 font-semibold'
                            }`}
                        >
                          <span className={isSubActive ? 'text-[#c4431d]' : 'text-stone-400'}>
                            {child.icon}
                          </span>
                          <span className="truncate">{child.name}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Section: Admin Profile + Logout */}
        <div className="p-3.5 border-t border-[#ecdccb]/60 space-y-2 shrink-0 bg-[#fcfaf7]/80">
          {/* Admin Profile Card */}
          <button
            type="button"
            onClick={() => {
              setIsProfileModalOpen(true);
              setMobileOpen(false);
            }}
            className="w-full flex items-center gap-3 p-2.5 rounded-2xl bg-white/80 hover:bg-white border border-transparent hover:border-[#ecdccb] transition-all cursor-pointer group text-left shadow-2xs"
            title="Click to edit profile & photo"
          >
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#f5ded0] shadow-2xs shrink-0 bg-[#fde5d6] flex items-center justify-center text-xs font-black text-[#c4431d] group-hover:scale-105 transition-transform">
              {user?.avatarUrl ? (
                <img src={user.avatarUrl} alt={user?.name || "Admin"} className="w-full h-full object-cover" />
              ) : (
                <span>{user?.name?.charAt(0).toUpperCase() || "A"}</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-black text-stone-900 truncate leading-tight group-hover:text-[#c4431d] transition-colors">
                {user?.name || "Admin"}
              </p>
              <p className="text-[10px] text-stone-500 font-medium mt-0.5">Edit Profile →</p>
            </div>
          </button>

          {/* Logout Button */}
          <button
            type="button"
            onClick={() => {
              setMobileOpen(false);
              logout();
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
