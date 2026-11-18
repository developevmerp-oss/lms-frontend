"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { AdminNav } from "@/components/layout/AdminNav";
import { Users, BookOpen, Bell, Trophy, TrendingUp, Heart, Send, Trash2, Plus, IndianRupee, Layers, ArrowRight, Search, ArrowUpDown, User, Eye, MoreHorizontal, X } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { StatCardSkeleton, AdminTableSkeleton } from "@/components/ui/SkeletonLoader";

import { API_BASE_URL } from "@/config/api";

const API = API_BASE_URL;

export default function AdminDashboard() {
  const { user, logout, token } = useAuth();
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeCourses: 0,
    pendingAssignments: 0,
    rewardsDistributed: 0,
  });
  const [revenueData, setRevenueData] = useState<{ totalRevenue: number; totalStudents: number; tiers: any[] }>({
    totalRevenue: 0,
    totalStudents: 0,
    tiers: [],
  });
  const [students, setStudents] = useState<any[]>([]);
  const [wins, setWins] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<string>("");
  const [notifTitle, setNotifTitle] = useState("");
  const [notifMessage, setNotifMessage] = useState("");
  const [winName, setWinName] = useState("Patel Vrajangna (Admin)");
  const [winAchievement, setWinAchievement] = useState("");
  const [winSalesAmount, setWinSalesAmount] = useState("");
  const [winTechnique, setWinTechnique] = useState("");
  const [winImage, setWinImage] = useState("");
  const [sending, setSending] = useState(false);
  const [postingWin, setPostingWin] = useState(false);
  const [uploadingWinFile, setUploadingWinFile] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'notifications' | 'wins'>('overview');
  const [notifSearch, setNotifSearch] = useState("");
  const [notifSort, setNotifSort] = useState<{ field: 'title' | 'recipient' | 'status' | 'createdAt' | null; asc: boolean }>({ field: null, asc: true });
  const [viewingNotification, setViewingNotification] = useState<{
    id?: string;
    title?: string;
    message?: string;
    isRead?: boolean;
    createdAt?: string;
    user?: { name?: string };
  } | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };

  const getMediaUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) return url;
    const backendBase = API.replace(/\/api\/?$/, '');
    return `${backendBase}${url.startsWith('/') ? '' : '/'}${url}`;
  };

  const handleAdminFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingWinFile(true);
    try {
      const formData = new FormData();
      formData.append('video', file);

      const res = await fetch(`${API}/upload/video`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.url) {
        setWinImage(data.url);
      } else {
        alert('File upload failed. Please try an external URL instead.');
      }
    } catch (err) {
      console.error('File upload error:', err);
      alert('File upload failed. Please check your connection or use an external URL.');
    } finally {
      setUploadingWinFile(false);
    }
  };

  useEffect(() => {
    if (!token) return;
    setIsLoading(true);

    // Fire all fetches in parallel
    Promise.all([
      fetch(`${API}/dashboard/admin`, { headers }).then(r => r.json()),
      fetch(`${API}/admin/students/summary`, { headers }).then(r => r.json()),
      fetch(`${API}/admin/community-wins`, { headers }).then(r => r.json()),
      fetch(`${API}/admin/notifications`, { headers }).then(r => r.json()),
      fetch(`${API}/admin/revenue-by-tier`, { headers }).then(r => r.json()),
    ])
      .then(([statsData, studentsData, winsData, notifsData, revData]) => {
        if (statsData && !statsData.message) setStats(statsData);
        // summary returns plain array
        if (Array.isArray(studentsData)) setStudents(studentsData);
        // community-wins and notifications are now paginated — unwrap .data
        if (winsData?.data && Array.isArray(winsData.data)) setWins(winsData.data);
        else if (Array.isArray(winsData)) setWins(winsData);
        if (notifsData?.data && Array.isArray(notifsData.data)) setNotifications(notifsData.data);
        else if (Array.isArray(notifsData)) setNotifications(notifsData);
        if (revData && revData.tiers) setRevenueData(revData);
      })
      .catch(err => console.error('Admin dashboard fetch error:', err))
      .finally(() => setIsLoading(false));
  }, [token]);

  const handleSendNotification = async () => {
    if (!selectedStudent || !notifTitle || !notifMessage) return;
    setSending(true);
    try {
      const isGroup = selectedStudent.startsWith('group:') || selectedStudent === 'all' || ['L0', 'L1', 'L2', 'L3', 'webinar'].includes(selectedStudent);

      let res;
      if (isGroup) {
        const targetAudience = selectedStudent.startsWith('group:')
          ? selectedStudent.replace('group:', '')
          : selectedStudent;
        res = await fetch(`${API}/admin/notifications/broadcast`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            title: notifTitle,
            message: notifMessage,
            targetAudience,
            type: 'info',
          }),
        });
      } else {
        const studentId = selectedStudent.startsWith('student:')
          ? selectedStudent.replace('student:', '')
          : selectedStudent;
        res = await fetch(`${API}/admin/students/${studentId}/notifications`, {
          method: 'POST',
          headers,
          body: JSON.stringify({ title: notifTitle, message: notifMessage }),
        });
      }

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        setNotifTitle('');
        setNotifMessage('');
        const updated = await fetch(`${API}/admin/notifications`, { headers }).then(r => r.json());
        const notifList = updated?.data ?? (Array.isArray(updated) ? updated : []);
        setNotifications(notifList);
        alert(data.message || 'Notification sent successfully!');
      } else {
        alert(data.message || 'Failed to send notification');
      }
    } catch (err: any) {
      console.error('Error sending notification:', err);
      alert(err?.message || 'Error sending notification');
    } finally {
      setSending(false);
    }
  };

  const handlePostWin = async () => {
    if (!winAchievement) return;
    setPostingWin(true);
    try {
      const res = await fetch(`${API}/admin/community-wins`, {
        method: 'POST', headers,
        body: JSON.stringify({
          studentName: winName || 'Patel Vrajangna (Admin)',
          achievement: winAchievement,
          salesAmount: winSalesAmount,
          technique: winTechnique,
          image: winImage,
          timeAgo: 'Just now'
        })
      });
      if (res.ok) {
        const updatedWins = await fetch(`${API}/admin/community-wins`, { headers }).then(r => r.json());
        const winList = updatedWins?.data ?? (Array.isArray(updatedWins) ? updatedWins : []);
        setWins(winList);
        setWinName('Patel Vrajangna (Admin)');
        setWinAchievement('');
        setWinSalesAmount('');
        setWinTechnique('');
        setWinImage('');
      }
    } finally {
      setPostingWin(false);
    }
  };

  const handleDeleteWin = async (winId: string) => {
    await fetch(`${API}/admin/community-wins/${winId}`, { method: 'DELETE', headers });
    setWins(prev => prev.filter(w => w.id !== winId));
  };

  const statCards = [
    { label: 'Total Students', value: stats.totalStudents, icon: <Users className="text-sky-600" size={22} />, color: 'text-sky-600', bg: 'bg-sky-50', border: 'border-sky-100' },
    { label: 'Active Courses', value: stats.activeCourses, icon: <BookOpen className="text-emerald-600" size={22} />, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
    { label: 'Pending Assignments', value: stats.pendingAssignments, icon: <Trophy className="text-amber-600" size={22} />, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
    { label: 'Notifications Sent', value: notifications.length, icon: <Bell className="text-[#c4431d]" size={22} />, color: 'text-[#c4431d]', bg: 'bg-[#fff5ee]', border: 'border-[#f5ded0]' },
  ];

  const tierChartData = revenueData.tiers.map((t) => ({
    code: t.code,
    name: t.name,
    revenue: Number(t.estimatedRevenue) || 0,
    students: Number(t.enrolledCount) || 0,
    price: t.price,
  }));

  const formatRupeeAxis = (value: number) => {
    if (value >= 100000) {
      const lakhs = value / 100000;
      return `₹${Number.isInteger(lakhs) ? lakhs : lakhs.toFixed(1)}L`;
    }
    if (value >= 1000) {
      return `₹${Math.round(value / 1000)}k`;
    }
    return `₹${value}`;
  };

  const toggleNotifSort = (field: 'title' | 'recipient' | 'status' | 'createdAt') => {
    setNotifSort(prev =>
      prev.field === field
        ? { field, asc: !prev.asc }
        : { field, asc: true }
    );
  };

  const filteredNotifications = notifications
    .filter((n) => {
      const q = notifSearch.trim().toLowerCase();
      if (!q) return true;
      return (
        (n.title || '').toLowerCase().includes(q) ||
        (n.message || '').toLowerCase().includes(q) ||
        (n.user?.name || '').toLowerCase().includes(q)
      );
    })
    .slice()
    .sort((a, b) => {
      if (!notifSort.field) return 0;
      const dir = notifSort.asc ? 1 : -1;
      if (notifSort.field === 'title') {
        return (a.title || '').localeCompare(b.title || '') * dir;
      }
      if (notifSort.field === 'recipient') {
        return (a.user?.name || 'Student').localeCompare(b.user?.name || 'Student') * dir;
      }
      if (notifSort.field === 'status') {
        return (Number(Boolean(a.isRead)) - Number(Boolean(b.isRead))) * dir;
      }
      if (notifSort.field === 'createdAt') {
        const ta = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const tb = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return (ta - tb) * dir;
      }
      return 0;
    });

  return (
    <div
      className="min-h-screen bg-[#faf8f5] text-stone-900 transition-colors lg:pl-[284px]"
      style={{
        backgroundColor: "#faf8f5",
        backgroundImage: "radial-gradient(circle, #e2ded4 1.5px, transparent 1.5px)",
        backgroundSize: "24px 24px",
        backgroundAttachment: "fixed",
      }}
    >
      <AdminNav user={user} logout={logout} />

      <main className="w-full px-4 sm:px-5 lg:px-5 py-5 sm:py-6">
        <header className="flex flex-wrap justify-between items-start gap-4 mb-5">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">Admin Command Center</h1>
            <p className="text-stone-500 mt-1 text-sm font-medium">Welcome back, {user?.name || 'Admin'} – manage students, notifications and wins.</p>
          </div>
        </header>

        {/* Tabs */}
        <div className="inline-flex items-center gap-1.5 mb-6 bg-white/95 border border-[#ecdccb] p-1.5 rounded-full max-w-full overflow-x-auto scrollbar-none shadow-[0_4px_16px_-4px_rgba(90,55,20,0.06)] backdrop-blur-md">
          {(['overview', 'notifications', 'wins'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`inline-flex items-center gap-2 px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-bold capitalize transition-all whitespace-nowrap cursor-pointer ${activeTab === tab
                ? 'bg-gradient-to-r from-[#942008] via-[#c4431d] to-[#ea580c] text-white shadow-md shadow-[#c4431d]/25'
                : 'text-stone-600 hover:text-[#c4431d] hover:bg-[#fff5ee]/70'
                }`}
            >
              {tab === 'overview' ? <TrendingUp size={15} /> : tab === 'notifications' ? <Bell size={15} /> : <Trophy size={15} />}
              <span>{tab === 'overview' ? 'Overview' : tab === 'notifications' ? 'Notifications' : 'Win Wall'}</span>
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          isLoading ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCardSkeleton />
                <StatCardSkeleton />
                <StatCardSkeleton />
                <StatCardSkeleton />
              </div>
              <AdminTableSkeleton rows={6} cols={6} />
            </div>
          ) : (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map((c, i) => (
                  <div
                    key={i}
                    className="bg-white/95 border border-[#ecdccb] rounded-2xl p-4 sm:p-5 shadow-[0_6px_20px_-6px_rgba(90,55,20,0.06)] hover:shadow-[0_10px_28px_-8px_rgba(196,67,29,0.12)] hover:border-[#e4c7ae] transition-all flex items-center gap-4"
                  >
                    <div className={`w-12 h-12 rounded-2xl ${c.bg} ${c.border} border flex items-center justify-center shrink-0`}>
                      {c.icon}
                    </div>
                    <div className="min-w-0">
                      <span className="text-stone-500 text-xs sm:text-sm font-semibold block truncate">{c.label}</span>
                      <p className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight mt-0.5">{c.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Middle Bento Row: Revenue Chart + Level-Wise Breakdown */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Card: Revenue Overview + Area Chart */}
                <div className="lg:col-span-6 bg-white/95 border border-[#ecdccb] rounded-3xl p-6 shadow-[0_10px_30px_-12px_rgba(90,55,20,0.08)] flex flex-col justify-between">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-5">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-emerald-600 shrink-0">
                        <IndianRupee size={19} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h2 className="text-lg font-black text-stone-900">
                            Course &amp; Level-Wise Revenue Breakdown
                          </h2>
                          <span className="text-[10px] font-bold text-[#942008] bg-[#fde5d6] border border-[#f5ded0] px-2.5 py-0.5 rounded-full">
                            Real-time
                          </span>
                        </div>
                        <p className="text-xs text-stone-500 font-medium mt-0.5">
                          Track earnings, active subscribers, and tier market share.
                        </p>
                      </div>
                    </div>

                    <div className="sm:text-right shrink-0">
                      <span className="text-[11px] font-semibold text-stone-500 block">Total Platform Value:</span>
                      <p className="text-2xl font-black text-emerald-600 font-mono leading-tight">
                        ₹{revenueData.totalRevenue.toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>

                  {tierChartData.length === 0 ? (
                    <div className="h-[235px] flex items-center justify-center text-stone-400 text-sm font-medium bg-[#fcfaf7] rounded-2xl border border-stone-100">
                      No revenue data available yet
                    </div>
                  ) : (
                    <div className="h-[235px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={tierChartData} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
                          <defs>
                            <linearGradient id="adminTierRevenueGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#c4431d" stopOpacity={0.28} />
                              <stop offset="95%" stopColor="#ea580c" stopOpacity={0.01} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0e6db" />
                          <XAxis
                            dataKey="code"
                            stroke="#78716c"
                            fontSize={12}
                            fontWeight={700}
                            tickLine={false}
                            axisLine={false}
                            dy={8}
                          />
                          <YAxis
                            stroke="#a8a29e"
                            fontSize={11}
                            tickLine={false}
                            axisLine={false}
                            width={54}
                            tickFormatter={formatRupeeAxis}
                          />
                          <Tooltip
                            content={({ active, payload }) => {
                              if (!active || !payload || !payload.length) return null;
                              const item = payload[0].payload;
                              return (
                                <div className="bg-white/95 border border-[#ecdccb] rounded-2xl px-3.5 py-2.5 shadow-lg text-xs">
                                  <p className="font-black text-stone-900">{item.code} · {item.name}</p>
                                  <p className="font-mono font-bold text-[#c4431d] mt-1">
                                    ₹{Number(item.revenue).toLocaleString("en-IN")}
                                  </p>
                                  <p className="text-stone-500 font-medium mt-0.5">{item.students} Students</p>
                                </div>
                              );
                            }}
                          />
                          <Area
                            type="monotone"
                            dataKey="revenue"
                            stroke="#c4431d"
                            strokeWidth={2.5}
                            fillOpacity={1}
                            fill="url(#adminTierRevenueGrad)"
                            dot={{ r: 4, fill: "#ea580c", stroke: "#ffffff", strokeWidth: 2 }}
                            activeDot={{ r: 6, fill: "#942008", stroke: "#ffffff", strokeWidth: 2 }}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </div>

                {/* Right Card: Tier-Wise Breakdown Rows */}
                <div className="lg:col-span-6 bg-white/95 border border-[#ecdccb] rounded-3xl p-6 shadow-[0_10px_30px_-12px_rgba(90,55,20,0.08)]">
                  <div className="flex items-start justify-between gap-3 mb-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-[#fff5ee] border border-[#f5ded0] flex items-center justify-center text-[#c4431d] shrink-0">
                        <Layers size={19} />
                      </div>
                      <div>
                        <h2 className="text-lg font-black text-stone-900">
                          Tier Market Share
                        </h2>
                        <p className="text-xs text-stone-500 font-medium">
                          Track earnings, active subscribers, and tier market share.
                        </p>
                      </div>
                    </div>
                    <span className="text-[11px] font-bold text-[#942008] bg-[#fde5d6] border border-[#f5ded0] px-2.5 py-1 rounded-full shrink-0">
                      {revenueData.totalStudents} Students
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {revenueData.tiers.map((t) => {
                      const sharePct = revenueData.totalRevenue > 0 ? Math.round((t.estimatedRevenue / revenueData.totalRevenue) * 100) : 0;
                      const isLeading = sharePct >= 50 && t.estimatedRevenue > 0;

                      return (
                        <div
                          key={t.id}
                          className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 bg-[#fcfaf7] border border-[#ecdccb]/80 hover:border-[#c4431d]/40 hover:bg-[#fff5ee]/40 rounded-2xl px-4 py-3 transition-all"
                        >
                          {/* Tier Badge + Name */}
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <span
                              className={`w-10 h-9 rounded-xl font-black text-xs flex items-center justify-center shrink-0 ${
                                isLeading
                                  ? 'bg-gradient-to-br from-[#942008] to-[#c4431d] text-white shadow-xs'
                                  : 'bg-[#fde5d6] text-[#942008] border border-[#f5ded0]'
                              }`}
                            >
                              {t.code}
                            </span>
                            <div className="min-w-0">
                              <p className="text-xs sm:text-sm font-black text-stone-900 truncate flex items-center gap-1.5">
                                <span>{t.icon}</span>
                                <span className="truncate">{t.name}</span>
                              </p>
                              <p className="text-[11px] font-mono font-semibold text-amber-700">{t.price}</p>
                            </div>
                          </div>

                          {/* Revenue & Students */}
                          <div className="flex items-center gap-5 shrink-0">
                            <div className="min-w-[78px]">
                              <p className="text-xs sm:text-sm font-black text-emerald-700 font-mono">
                                ₹{t.estimatedRevenue.toLocaleString("en-IN")}
                              </p>
                              <p className="text-[10px] text-stone-400 font-semibold">Revenue</p>
                            </div>
                            <div className="min-w-[50px]">
                              <p className="text-xs sm:text-sm font-black text-stone-800">{t.enrolledCount}</p>
                              <p className="text-[10px] text-stone-400 font-semibold">Students</p>
                            </div>
                          </div>

                          {/* Share Progress Bar */}
                          <div className="flex items-center gap-2.5 w-full sm:w-32 shrink-0">
                            <div className="flex-1 bg-stone-200/80 rounded-full h-2 overflow-hidden">
                              <div
                                className="bg-gradient-to-r from-[#942008] via-[#c4431d] to-[#ea580c] h-2 rounded-full transition-all"
                                style={{ width: `${sharePct > 0 ? Math.max(5, sharePct) : 0}%` }}
                              />
                            </div>
                            <span className="text-xs font-black text-stone-700 w-9 text-right">{sharePct}%</span>
                          </div>
                        </div>
                      );
                    })}
                    {revenueData.tiers.length === 0 && (
                      <p className="text-stone-400 text-center py-8 text-sm font-medium">No tiers configured yet</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Bottom Bento Row: All Students Table + Sent Notifications Feed */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* All Students Table */}
                <div className="lg:col-span-8 bg-white/95 border border-[#ecdccb] rounded-3xl p-6 shadow-[0_10px_30px_-12px_rgba(90,55,20,0.08)]">
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <h2 className="text-lg sm:text-xl font-black text-stone-900 flex items-center gap-2">
                      <Users size={20} className="text-[#c4431d]" /> All Students
                    </h2>
                    <Link
                      href="/admin/students"
                      className="text-xs font-bold text-[#c4431d] hover:text-[#942008] inline-flex items-center gap-1 transition-colors"
                    >
                      View All <ArrowRight size={13} />
                    </Link>
                  </div>

                  <div className="overflow-x-auto max-h-[420px] overflow-y-auto custom-scrollbar">
                    <table className="w-full text-sm">
                      <thead className="sticky top-0 bg-white/95 z-10">
                        <tr className="border-b border-[#ecdccb]/80 text-stone-500">
                          <th className="text-left pb-3 font-bold text-[11px] uppercase tracking-wider text-stone-500">Student</th>
                          <th className="text-left pb-3 font-bold text-[11px] uppercase tracking-wider text-stone-500">Level</th>
                          <th className="text-left pb-3 font-bold text-[11px] uppercase tracking-wider text-stone-500">XP</th>
                          <th className="text-left pb-3 font-bold text-[11px] uppercase tracking-wider text-stone-500">Streak</th>
                          <th className="text-left pb-3 font-bold text-[11px] uppercase tracking-wider text-stone-500">Courses</th>
                          <th className="text-left pb-3 font-bold text-[11px] uppercase tracking-wider text-stone-500">Milestones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {students.map((s, i) => (
                          <tr key={s.id || i} className="border-b border-stone-100 last:border-b-0 hover:bg-[#fff5ee]/60 transition-colors">
                            <td className="py-3 pr-3">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-[#fde5d6] border border-[#f5ded0] flex items-center justify-center text-xs font-black text-[#942008] shrink-0">
                                  {s.name?.charAt(0)?.toUpperCase() || 'S'}
                                </div>
                                <div className="min-w-0">
                                  <p className="text-stone-900 font-bold text-sm truncate">{s.name}</p>
                                  <p className="text-stone-500 text-xs truncate">{s.email}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 pr-3">
                              <span className="text-[#942008] font-bold text-xs bg-[#fde5d6] border border-[#f5ded0] px-2.5 py-1 rounded-lg whitespace-nowrap">
                                {s.membershipLevel || 'L0'}
                              </span>
                            </td>
                            <td className="py-3 pr-3 text-amber-700 font-bold font-mono whitespace-nowrap">{(s.points || 0).toLocaleString()}</td>
                            <td className="py-3 pr-3 text-[#ea580c] font-bold whitespace-nowrap">🔥 {s.streak || 0}d</td>
                            <td className="py-3 pr-3 text-stone-700 font-semibold">{s.courses?.length || 0}</td>
                            <td className="py-3 whitespace-nowrap">
                              <div className="flex items-center gap-1 font-medium">
                                <span className="text-emerald-700 font-bold text-xs">{s.milestones?.filter((m: any) => m.completed).length || 0} done</span>
                                <span className="text-stone-400 text-xs">/ {s.milestones?.length || 0}</span>
                              </div>
                            </td>
                          </tr>
                        ))}
                        {students.length === 0 && (
                          <tr><td colSpan={6} className="py-8 text-center text-stone-400 font-medium">No students found</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Sent Notifications Card */}
                <div className="lg:col-span-4 bg-white/95 border border-[#ecdccb] rounded-3xl p-6 shadow-[0_10px_30px_-12px_rgba(90,55,20,0.08)] flex flex-col">
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <h2 className="text-lg sm:text-xl font-black text-stone-900 flex items-center gap-2">
                      <Bell size={20} className="text-[#c4431d]" /> Sent Notifications
                    </h2>
                    <button
                      type="button"
                      onClick={() => setActiveTab('notifications')}
                      className="text-xs font-bold text-[#c4431d] hover:text-[#942008] inline-flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      View All <ArrowRight size={13} />
                    </button>
                  </div>

                  <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1 custom-scrollbar flex-1">
                    {notifications.length === 0 && (
                      <p className="text-stone-400 text-center py-12 font-medium text-sm">No notifications sent yet</p>
                    )}
                    {notifications.map((n, i) => (
                      <div
                        key={n.id || i}
                        className="flex items-start gap-3 bg-[#fcfaf7] border border-stone-200/80 hover:border-[#ecdccb] rounded-2xl p-3.5 transition-colors"
                      >
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 border ${
                          n.isRead
                            ? 'bg-stone-100 border-stone-200 text-stone-500'
                            : 'bg-[#fff5ee] border-[#f5ded0] text-[#c4431d]'
                        }`}>
                          <Bell size={15} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start gap-2">
                            <h4 className="font-bold text-stone-900 text-xs sm:text-sm truncate">{n.title}</h4>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold shrink-0 ${
                              n.isRead
                                ? 'bg-stone-100 text-stone-500'
                                : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                            }`}>
                              {n.isRead ? 'Read' : 'Unread'}
                            </span>
                          </div>
                          <p className="text-xs text-stone-600 mt-0.5 line-clamp-2 leading-relaxed">{n.message}</p>
                          <p className="text-[11px] text-stone-400 font-medium mt-1">To: {n.user?.name || 'Student'}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Send notification form */}
            <div className="lg:col-span-4 bg-white/95 border border-[#ecdccb] rounded-3xl p-6 shadow-[0_10px_30px_-12px_rgba(90,55,20,0.08)]">
              <h2 className="text-xl font-black text-stone-900 mb-6 flex items-center gap-2">
                <Send size={20} className="text-[#c4431d]" /> Send Notification
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-bold text-stone-700 block mb-2">Select Target Audience</label>
                  <select
                    value={selectedStudent}
                    onChange={e => setSelectedStudent(e.target.value)}
                    className="w-full bg-[#fcfaf7] border border-stone-300 text-stone-900 rounded-xl p-3 focus:outline-none focus:border-[#c4431d] focus:ring-1 focus:ring-[#c4431d]/30 font-medium transition-colors"
                  >
                    <option value="">-- Choose target audience --</option>
                    <option value="group:L0">🌱 Level 0 (L0) Students</option>
                    <option value="group:L1">🥈 Level 1 (L1) Students</option>
                    <option value="group:L2">🥇 Level 2 (L2) Students</option>
                    <option value="group:L3">💎 Level 3 (L3) Students</option>
                    <option value="group:general">👤 General Students (No Level)</option>
                    <option value="group:webinar">🎟️ Webinar Registered Students</option>
                    <option value="all">🌐 All Students (Global Broadcast)</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-bold text-stone-700 block mb-2">Title</label>
                  <input
                    type="text"
                    value={notifTitle}
                    onChange={e => setNotifTitle(e.target.value)}
                    placeholder="e.g. Congratulations!"
                    className="w-full bg-[#fcfaf7] border border-stone-300 text-stone-900 placeholder:text-stone-400 rounded-xl p-3 focus:outline-none focus:border-[#c4431d] focus:ring-1 focus:ring-[#c4431d]/30 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-sm font-bold text-stone-700 block mb-2">Message</label>
                  <textarea
                    value={notifMessage}
                    onChange={e => setNotifMessage(e.target.value)}
                    placeholder="e.g. You earned the Diamond Badge!"
                    rows={3}
                    className="w-full bg-[#fcfaf7] border border-stone-300 text-stone-900 placeholder:text-stone-400 rounded-xl p-3 focus:outline-none focus:border-[#c4431d] focus:ring-1 focus:ring-[#c4431d]/30 resize-none transition-colors"
                  />
                </div>
                <button
                  onClick={handleSendNotification}
                  disabled={sending || !selectedStudent || !notifTitle || !notifMessage}
                  className="w-full bg-gradient-to-r from-[#942008] via-[#c4431d] to-[#ea580c] hover:opacity-95 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-all shadow-md shadow-[#c4431d]/25 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send size={16} />{' '}
                  {sending
                    ? 'Sending...'
                    : selectedStudent === 'all'
                      ? 'Broadcast to All Students'
                      : selectedStudent === 'group:general' || selectedStudent === 'general'
                        ? 'Send to All General Students'
                        : selectedStudent === 'group:webinar' || selectedStudent === 'webinar'
                          ? 'Send to All Webinar Students'
                          : selectedStudent.startsWith('group:')
                            ? `Send to All ${selectedStudent.replace('group:', '').toUpperCase()} Students`
                            : 'Send Notification'}
                </button>
              </div>
            </div>

            {/* Notification history table (matching reference design) */}
            <div className="lg:col-span-8 bg-white/95 border border-[#ecdccb] rounded-3xl p-6 shadow-[0_10px_30px_-12px_rgba(90,55,20,0.08)]">
              {/* Top Header + Search */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#fff5ee] border border-[#f5ded0] flex items-center justify-center text-[#c4431d] shrink-0">
                    <Bell size={20} />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-stone-900 leading-tight">Sent Notifications</h2>
                    <p className="text-xs text-stone-500 font-medium mt-0.5">
                      A history of all notifications sent to your students and members.
                    </p>
                  </div>
                </div>

                <div className="relative w-full sm:w-64 shrink-0">
                  <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                  <input
                    type="text"
                    value={notifSearch}
                    onChange={(e) => setNotifSearch(e.target.value)}
                    placeholder="Search by title or message..."
                    className="w-full bg-[#fcfaf7] border border-[#ecdccb] text-stone-900 placeholder:text-stone-400 rounded-xl pl-9 pr-3.5 py-2 text-xs font-medium focus:outline-none focus:border-[#c4431d] focus:ring-1 focus:ring-[#c4431d]/30 transition-colors"
                  />
                </div>
              </div>

              {/* Notifications Table */}
              <div className="overflow-x-auto max-h-[520px] overflow-y-auto custom-scrollbar">
                <table className="w-full text-left border-collapse min-w-[680px]">
                  <thead className="sticky top-0 z-10">
                    <tr className="bg-[#fff5ee] border-y border-[#f5ded0]/80 text-stone-700 text-xs font-bold">
                      <th className="py-3 pl-4 pr-3 rounded-l-xl">
                        <button
                          type="button"
                          onClick={() => toggleNotifSort('title')}
                          className="inline-flex items-center gap-1.5 hover:text-[#c4431d] transition-colors cursor-pointer"
                        >
                          <span>Title</span>
                          <ArrowUpDown size={12} className="text-stone-400" />
                        </button>
                      </th>
                      <th className="py-3 px-3">Message Preview</th>
                      <th className="py-3 px-3">
                        <button
                          type="button"
                          onClick={() => toggleNotifSort('recipient')}
                          className="inline-flex items-center gap-1.5 hover:text-[#c4431d] transition-colors cursor-pointer"
                        >
                          <span>Recipients</span>
                          <ArrowUpDown size={12} className="text-stone-400" />
                        </button>
                      </th>
                      <th className="py-3 px-3">
                        <button
                          type="button"
                          onClick={() => toggleNotifSort('status')}
                          className="inline-flex items-center gap-1.5 hover:text-[#c4431d] transition-colors cursor-pointer"
                        >
                          <span>Status</span>
                          <ArrowUpDown size={12} className="text-stone-400" />
                        </button>
                      </th>
                      <th className="py-3 px-3">
                        <button
                          type="button"
                          onClick={() => toggleNotifSort('createdAt')}
                          className="inline-flex items-center gap-1.5 hover:text-[#c4431d] transition-colors cursor-pointer"
                        >
                          <span>Sent On</span>
                          <ArrowUpDown size={12} className="text-stone-400" />
                        </button>
                      </th>
                      <th className="py-3 pl-3 pr-4 rounded-r-xl text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {filteredNotifications.map((n, i) => (
                      <tr key={n.id || i} className="hover:bg-[#fff5ee]/40 transition-colors">
                        <td className="py-3.5 pl-4 pr-3 align-middle max-w-[200px]">
                          <p className="font-bold text-stone-900 text-xs sm:text-sm leading-snug line-clamp-2">
                            {n.title}
                          </p>
                        </td>
                        <td className="py-3.5 px-3 align-middle max-w-[240px]">
                          <p className="text-xs text-stone-600 leading-relaxed line-clamp-2">
                            {n.message}
                          </p>
                        </td>
                        <td className="py-3.5 px-3 align-middle whitespace-nowrap">
                          <div className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-700">
                            <User size={13} className="text-stone-400 shrink-0" />
                            <span>{n.user?.name || 'Student'}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-3 align-middle whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                              n.isRead
                                ? 'bg-stone-100 text-stone-500 border border-stone-200'
                                : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                            }`}
                          >
                            {n.isRead ? 'Read' : 'Unread'}
                          </span>
                        </td>
                        <td className="py-3.5 px-3 align-middle whitespace-nowrap">
                          {n.createdAt ? (
                            <div className="text-[11px] leading-tight">
                              <p className="font-semibold text-stone-700">
                                {new Date(n.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                              </p>
                              <p className="text-stone-400 mt-0.5">
                                {new Date(n.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                              </p>
                            </div>
                          ) : (
                            <span className="text-xs text-stone-400">—</span>
                          )}
                        </td>
                        <td className="py-3.5 pl-3 pr-4 align-middle whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => setViewingNotification(n)}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white hover:bg-stone-50 border border-stone-200 text-stone-700 text-xs font-bold transition-colors cursor-pointer shadow-2xs"
                            >
                              <Eye size={13} />
                              <span>View</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setNotifTitle(n.title || '');
                                setNotifMessage(n.message || '');
                              }}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white hover:bg-[#fff5ee] border border-[#f5ded0] text-[#c4431d] text-xs font-bold transition-colors cursor-pointer shadow-2xs"
                              title="Copy title & message to Send Notification form"
                            >
                              <Send size={12} />
                              <span>Resend</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setViewingNotification(n)}
                              className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-white hover:bg-stone-50 border border-stone-200 text-stone-500 transition-colors cursor-pointer shadow-2xs"
                              aria-label="More notification options"
                            >
                              <MoreHorizontal size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredNotifications.length === 0 && (
                      <tr>
                        <td colSpan={6} className="py-10 text-center text-stone-400 text-sm font-medium">
                          {notifications.length === 0 ? 'No notifications sent yet' : 'No matching notifications found'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Notification Detail Modal */}
        {viewingNotification && (
          <div
            className="fixed inset-0 z-50 bg-stone-900/50 backdrop-blur-xs flex items-center justify-center p-4"
            onClick={() => setViewingNotification(null)}
          >
            <div
              className="w-full max-w-lg bg-white border border-[#ecdccb] rounded-3xl p-6 shadow-2xl space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#fff5ee] border border-[#f5ded0] flex items-center justify-center text-[#c4431d] shrink-0">
                    <Bell size={18} />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-stone-900">{viewingNotification.title}</h3>
                    <p className="text-xs text-stone-500 font-medium mt-0.5">
                      To: {viewingNotification.user?.name || 'Student'}
                      {viewingNotification.createdAt
                        ? ` · ${new Date(viewingNotification.createdAt).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}`
                        : ''}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setViewingNotification(null)}
                  className="w-8 h-8 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="bg-[#fcfaf7] border border-[#ecdccb]/80 rounded-2xl p-4 text-sm text-stone-700 leading-relaxed whitespace-pre-wrap">
                {viewingNotification.message}
              </div>

              <div className="flex items-center justify-between pt-2">
                <span
                  className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                    viewingNotification.isRead
                      ? 'bg-stone-100 text-stone-500 border border-stone-200'
                      : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                  }`}
                >
                  {viewingNotification.isRead ? 'Read' : 'Unread'}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setNotifTitle(viewingNotification.title || '');
                      setNotifMessage(viewingNotification.message || '');
                      setViewingNotification(null);
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#942008] via-[#c4431d] to-[#ea580c] text-white text-xs font-bold shadow-sm cursor-pointer"
                  >
                    <Send size={13} /> Resend in Composer
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Win Wall Tab */}
        {activeTab === 'wins' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Post a Win form */}
            <div className="bg-white/95 border border-[#ecdccb] rounded-3xl p-6 shadow-[0_10px_30px_-12px_rgba(90,55,20,0.08)]">
              <h2 className="text-xl font-black text-stone-900 mb-6 flex items-center gap-2">
                <Plus size={20} className="text-[#c4431d]" /> Post a Community Win
              </h2>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-stone-600 block mb-1">Sales Amount (₹ optional)</label>
                    <input
                      type="number"
                      placeholder="e.g. 4500"
                      value={winSalesAmount}
                      onChange={e => setWinSalesAmount(e.target.value)}
                      className="w-full bg-[#fcfaf7] border border-stone-300 text-stone-900 placeholder:text-stone-400 rounded-xl p-2.5 text-xs focus:outline-none focus:border-[#c4431d] focus:ring-1 focus:ring-[#c4431d]/30 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-stone-600 block mb-1">Technique Used</label>
                    <input
                      type="text"
                      placeholder="e.g. Ocean Wave Lacing"
                      value={winTechnique}
                      onChange={e => setWinTechnique(e.target.value)}
                      className="w-full bg-[#fcfaf7] border border-stone-300 text-stone-900 placeholder:text-stone-400 rounded-xl p-2.5 text-xs focus:outline-none focus:border-[#c4431d] focus:ring-1 focus:ring-[#c4431d]/30 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-bold text-stone-700 block mb-2">Achievement / Story</label>
                  <textarea
                    value={winAchievement}
                    onChange={e => setWinAchievement(e.target.value)}
                    placeholder="e.g. Got her first corporate order for 50 custom clocks!"
                    rows={3}
                    className="w-full bg-[#fcfaf7] border border-stone-300 text-stone-900 placeholder:text-stone-400 rounded-xl p-3 focus:outline-none focus:border-[#c4431d] focus:ring-1 focus:ring-[#c4431d]/30 resize-none text-xs transition-colors"
                  />
                </div>

                {/* Browser File Upload (Image, Video, Document) */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-600 block">Upload File (Image, Video, Document)</label>
                  <label className="relative block w-full">
                    <input
                      type="file"
                      accept="image/*,video/*,.pdf,.doc,.docx"
                      onChange={handleAdminFileSelect}
                      disabled={uploadingWinFile}
                      className="w-full text-xs text-stone-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-[#fde5d6] file:text-[#942008] hover:file:bg-[#f8d4bf] cursor-pointer bg-[#fcfaf7] border border-stone-300 rounded-xl p-1 disabled:opacity-50"
                    />
                    {uploadingWinFile && (
                      <span className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-xl text-xs font-bold text-[#c4431d]">
                        ⏳ Uploading file... please wait
                      </span>
                    )}
                  </label>

                  <input
                    type="text"
                    placeholder="Or paste external file / image URL..."
                    value={winImage}
                    onChange={e => setWinImage(e.target.value)}
                    className="w-full bg-[#fcfaf7] border border-stone-300 text-stone-900 placeholder:text-stone-400 rounded-xl p-2 text-xs focus:outline-none focus:border-[#c4431d] focus:ring-1 focus:ring-[#c4431d]/30 mt-1 transition-colors"
                  />

                  {winImage && (
                    <div className="mt-2 p-2 rounded-xl bg-stone-50 border border-stone-200 relative">
                      <button
                        type="button"
                        onClick={() => setWinImage('')}
                        className="absolute right-2 top-2 bg-stone-200 hover:bg-stone-300 text-stone-700 p-1 rounded-lg z-10 text-xs cursor-pointer"
                      >
                        ✕
                      </button>

                      {/* Preview Box */}
                      {(() => {
                        const mediaUrl = winImage;
                        if (!mediaUrl) return null;

                        const ytEmbed = mediaUrl.includes('youtube.com') || mediaUrl.includes('youtu.be') ? (
                          (() => {
                            const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
                            const match = mediaUrl.match(regExp);
                            return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : null;
                          })()
                        ) : null;

                        if (ytEmbed) {
                          return (
                            <div className="mt-2 rounded-xl overflow-hidden border border-stone-200 aspect-video bg-black shadow-md">
                              <iframe src={ytEmbed} title="YouTube Preview" allowFullScreen className="w-full h-full border-0" />
                            </div>
                          );
                        }

                        const isVideo = mediaUrl.startsWith('data:video') || /\.(mp4|webm|mov|m4v|avi)$/i.test(mediaUrl) || mediaUrl.includes('/uploads/videos/');
                        if (isVideo) {
                          return <video src={getMediaUrl(mediaUrl)} controls className="max-h-36 rounded-lg w-full object-contain mt-2 bg-black" />;
                        }

                        const isDoc = mediaUrl.startsWith('data:application') || /\.(pdf|doc|docx)$/i.test(mediaUrl);
                        if (isDoc) {
                          return (
                            <div className="p-3 text-xs font-bold text-[#942008] flex items-center gap-2 mt-2 bg-[#fde5d6]/50 border border-[#f5ded0] rounded-xl">
                              📄 Attached Document / File Ready!
                            </div>
                          );
                        }

                        const isWebUrl = mediaUrl.startsWith('http://') || mediaUrl.startsWith('https://');
                        const isDirectImage = mediaUrl.startsWith('data:image') || /\.(jpeg|jpg|gif|png|webp|svg)$/i.test(mediaUrl) || mediaUrl.includes('unsplash.com') || mediaUrl.includes('cloudinary');

                        if (isWebUrl && !isDirectImage) {
                          return (
                            <div className="p-3 text-xs font-bold text-sky-700 flex items-center gap-2 mt-2 bg-sky-50 border border-sky-200 rounded-xl truncate">
                              🔗 External Web Link: <span className="text-stone-900 underline truncate">{mediaUrl}</span>
                            </div>
                          );
                        }

                        return <img src={getMediaUrl(mediaUrl)} alt="Upload preview" className="max-h-36 rounded-lg w-full object-cover mt-2 border border-stone-200" />;
                      })()}
                    </div>
                  )}
                </div>

                <button
                  onClick={handlePostWin}
                  disabled={postingWin || uploadingWinFile || !winAchievement}
                  className="w-full bg-gradient-to-r from-[#942008] via-[#c4431d] to-[#ea580c] hover:opacity-95 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-all shadow-md shadow-[#c4431d]/25 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Heart size={16} /> {uploadingWinFile ? 'Uploading file...' : postingWin ? 'Posting...' : 'Post Win to Wall'}
                </button>
              </div>
            </div>

            {/* Win history */}
            <div className="bg-white/95 border border-[#ecdccb] rounded-3xl p-6 shadow-[0_10px_30px_-12px_rgba(90,55,20,0.08)]">
              <h2 className="text-xl font-black text-stone-900 mb-6 flex items-center gap-2">
                <Trophy size={20} className="text-[#c4431d]" /> Community Win Wall
              </h2>
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                {wins.length === 0 && <p className="text-stone-400 text-center py-8 font-medium">No wins posted yet</p>}
                {wins.map((w, i) => (
                  <div key={w.id || i} className="bg-[#fcfaf7] border border-stone-200 rounded-2xl p-4 flex gap-4 shadow-xs">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#942008] via-[#c4431d] to-[#ea580c] flex items-center justify-center text-white font-bold shrink-0 shadow-xs">
                      {w.studentName?.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                            {w.studentName}
                            {w.studentName?.includes('Admin') && (
                              <span className="text-[10px] font-bold text-[#942008] bg-[#fde5d6] border border-[#f5ded0] px-2 py-0.5 rounded-md">Admin</span>
                            )}
                          </h4>
                          <p className="text-xs text-stone-600 mt-1 leading-relaxed">{w.achievement}</p>
                        </div>
                        <button
                          onClick={() => handleDeleteWin(w.id)}
                          className="text-stone-400 hover:text-red-500 transition-colors p-1 ml-2 shrink-0 cursor-pointer"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>

                      {/* Attached Photo / Video / Document / YouTube / External Link */}
                      {(() => {
                        const mediaUrl = w.image;
                        if (!mediaUrl) return null;

                        const ytEmbed = mediaUrl.includes('youtube.com') || mediaUrl.includes('youtu.be') ? (
                          (() => {
                            const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
                            const match = mediaUrl.match(regExp);
                            return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : null;
                          })()
                        ) : null;

                        if (ytEmbed) {
                          return (
                            <div className="mt-2 rounded-2xl overflow-hidden border border-stone-200 bg-black aspect-video shadow-md">
                              <iframe
                                src={ytEmbed}
                                title="YouTube Video"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="w-full h-full border-0"
                              />
                            </div>
                          );
                        }

                        const isVideo = mediaUrl.startsWith('data:video') || /\.(mp4|webm|mov|m4v|avi)$/i.test(mediaUrl) || mediaUrl.includes('/uploads/videos/');
                        if (isVideo) {
                          return (
                            <div className="mt-2 rounded-2xl overflow-hidden border border-stone-200 bg-black shadow-md">
                              <video src={getMediaUrl(mediaUrl)} controls className="w-full max-h-56 object-contain bg-black" />
                            </div>
                          );
                        }

                        const isDoc = mediaUrl.startsWith('data:application') || /\.(pdf|doc|docx|zip|rar)$/i.test(mediaUrl);
                        if (isDoc) {
                          return (
                            <div className="mt-2 p-3 rounded-2xl bg-white border border-stone-200 flex items-center justify-between gap-3 shadow-xs">
                              <div className="flex items-center gap-2.5 overflow-hidden min-w-0">
                                <div className="w-8 h-8 rounded-xl bg-[#fde5d6] border border-[#f5ded0] flex items-center justify-center text-[#942008] font-bold shrink-0 text-sm">
                                  📄
                                </div>
                                <div className="truncate min-w-0">
                                  <p className="text-xs font-bold text-stone-900 truncate">Attached Document / File</p>
                                  <p className="text-[10px] text-stone-500">Click to download or view</p>
                                </div>
                              </div>
                              <a
                                href={getMediaUrl(mediaUrl)}
                                download="community-file"
                                target="_blank"
                                rel="noreferrer"
                                className="px-3 py-1 rounded-xl bg-[#fde5d6] hover:bg-[#f8d4bf] border border-[#f5ded0] text-[#942008] text-[11px] font-bold transition-all shrink-0"
                              >
                                Download File
                              </a>
                            </div>
                          );
                        }

                        const isWebUrl = mediaUrl.startsWith('http://') || mediaUrl.startsWith('https://');
                        const isDirectImage = mediaUrl.startsWith('data:image') || /\.(jpeg|jpg|gif|png|webp|svg)$/i.test(mediaUrl) || mediaUrl.includes('unsplash.com') || mediaUrl.includes('cloudinary');

                        if (isWebUrl && !isDirectImage) {
                          return (
                            <div className="mt-2 p-3 rounded-2xl bg-white border border-stone-200 flex items-center justify-between gap-3 shadow-xs">
                              <div className="flex items-center gap-2.5 overflow-hidden min-w-0">
                                <div className="w-8 h-8 rounded-xl bg-sky-100 border border-sky-200 flex items-center justify-center text-sky-700 font-bold shrink-0 text-sm">
                                  🔗
                                </div>
                                <div className="truncate min-w-0">
                                  <p className="text-xs font-bold text-stone-900 truncate">External Web Link</p>
                                  <p className="text-[10px] text-stone-500 truncate">{mediaUrl}</p>
                                </div>
                              </div>
                              <a
                                href={mediaUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="px-3 py-1 rounded-xl bg-sky-100 hover:bg-sky-200 border border-sky-300 text-sky-800 text-[11px] font-bold transition-all shrink-0 flex items-center gap-1"
                              >
                                Open Link ↗
                              </a>
                            </div>
                          );
                        }

                        return (
                          <div className="mt-2 rounded-2xl overflow-hidden border border-stone-200 bg-stone-100 max-h-64 shadow-md">
                            <img src={getMediaUrl(mediaUrl)} alt="Attachment" className="w-full h-full max-h-64 object-cover" />
                          </div>
                        );
                      })()}

                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs font-bold text-[#c4431d]">❤️ {w.likes}</span>
                        <span className="text-xs text-stone-400 font-medium">· {w.timeAgo}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
