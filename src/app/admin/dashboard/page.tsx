"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { AdminNav } from "@/components/layout/AdminNav";
import { Users, BookOpen, Bell, Trophy, TrendingUp, Heart, Send, Trash2, Plus, IndianRupee, Sparkles, Tag, ArrowUpRight } from "lucide-react";
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
  const [activeTab, setActiveTab] = useState<'overview' | 'notifications' | 'wins'>('overview');

  const [isLoading, setIsLoading] = useState(true);
  const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };

  const handleAdminFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setWinImage(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (!token) return;
    setIsLoading(true);

    // Fire all fetches in parallel
    Promise.all([
      fetch(`${API}/dashboard/admin`, { headers }).then(r => r.json()),
      fetch(`${API}/admin/students`, { headers }).then(r => r.json()),
      fetch(`${API}/admin/community-wins`, { headers }).then(r => r.json()),
      fetch(`${API}/admin/notifications`, { headers }).then(r => r.json()),
      fetch(`${API}/admin/revenue-by-tier`, { headers }).then(r => r.json()),
    ])
      .then(([statsData, studentsData, winsData, notifsData, revData]) => {
        if (statsData && !statsData.message) setStats(statsData);
        if (Array.isArray(studentsData)) setStudents(studentsData);
        if (Array.isArray(winsData)) setWins(winsData);
        if (Array.isArray(notifsData)) setNotifications(notifsData);
        if (revData && revData.tiers) setRevenueData(revData);
      })
      .catch(err => console.error('Admin dashboard fetch error:', err))
      .finally(() => setIsLoading(false));
  }, [token]);

  const handleSendNotification = async () => {
    if (!selectedStudent || !notifTitle || !notifMessage) return;
    setSending(true);
    try {
      const res = await fetch(`${API}/admin/students/${selectedStudent}/notifications`, {
        method: 'POST', headers,
        body: JSON.stringify({ title: notifTitle, message: notifMessage })
      });
      if (res.ok) {
        setNotifTitle('');
        setNotifMessage('');
        const updated = await fetch(`${API}/admin/notifications`, { headers }).then(r => r.json());
        if (Array.isArray(updated)) setNotifications(updated);
        alert('Notification sent!');
      }
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
        if (Array.isArray(updatedWins)) setWins(updatedWins);
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
    { label: 'Total Students', value: stats.totalStudents, icon: <Users className="text-blue-400" size={22} />, color: 'text-blue-400' },
    { label: 'Active Courses', value: stats.activeCourses, icon: <BookOpen className="text-teal-400" size={22} />, color: 'text-teal-400' },
    { label: 'Pending Assignments', value: stats.pendingAssignments, icon: <Trophy className="text-yellow-400" size={22} />, color: 'text-yellow-400' },
    { label: 'Notifications Sent', value: notifications.length, icon: <Bell className="text-orange-400" size={22} />, color: 'text-orange-400' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <AdminNav user={user} logout={logout} />

      <main className="max-w-[1400px] mx-auto p-4 md:p-8">
        <header className="flex flex-wrap justify-between items-start gap-4 mb-6 md:mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">Admin Command Center</h1>
            <p className="text-slate-400 mt-1 text-sm">Welcome back, {user?.name || 'Admin'} – manage students, notifications and wins.</p>
          </div>
        </header>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
          {isLoading ? (
            <>
              <StatCardSkeleton />
              <StatCardSkeleton />
              <StatCardSkeleton />
              <StatCardSkeleton />
            </>
          ) : (
            statCards.map((c, i) => (
              <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 md:p-5">
                <div className="flex items-center gap-2 mb-2">{c.icon}<span className="text-slate-400 text-xs md:text-sm">{c.label}</span></div>
                <p className={`text-2xl md:text-3xl font-black ${c.color}`}>{c.value}</p>
              </div>
            ))
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 md:gap-2 mb-6 bg-slate-900 border border-slate-800 p-1.5 rounded-2xl w-full md:w-fit overflow-x-auto scrollbar-none">
          {(['overview', 'notifications', 'wins'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 md:px-5 py-2 rounded-xl text-xs md:text-sm font-bold capitalize transition-all whitespace-nowrap ${activeTab === tab ? 'bg-orange-500 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              {tab === 'overview' ? '📊 Overview' : tab === 'notifications' ? '🔔 Notifications' : '🏆 Win Wall'}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          isLoading ? (
            <AdminTableSkeleton rows={6} cols={6} />
          ) : (
            <div className="space-y-6">
              {/* Level-Wise Revenue Analytics Card */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                      <IndianRupee size={20} />
                    </div>
                    <div>
                      <h2 className="text-lg font-black text-white flex items-center gap-2">
                        Course &amp; Level-Wise Revenue Breakdown
                        <span className="text-[10px] font-bold text-orange-400 bg-orange-500/10 border border-orange-500/30 px-2 py-0.5 rounded-full">
                          Real-time
                        </span>
                      </h2>
                      <p className="text-xs text-slate-400">Track earnings, active subscribers, and tier market share.</p>
                    </div>
                  </div>

                  <div className="text-right sm:text-right">
                    <span className="text-xs font-semibold text-slate-400">Total Platform Value:</span>
                    <p className="text-2xl font-black text-emerald-400 font-mono">
                      ₹{revenueData.totalRevenue.toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>

                {/* Level Tier Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  {revenueData.tiers.map((t) => {
                    const sharePct = revenueData.totalRevenue > 0 ? Math.round((t.estimatedRevenue / revenueData.totalRevenue) * 100) : 0;

                    return (
                      <div key={t.id} className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-4 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between gap-1 mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-xl">{t.icon}</span>
                              <span className="text-xs font-black text-white">{t.name}</span>
                            </div>
                            <span className="text-[10px] font-black text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded-md border border-orange-500/30">
                              {t.code}
                            </span>
                          </div>

                          <div className="flex items-baseline justify-between gap-2 mt-3">
                            <span className="text-xs text-slate-400">{t.enrolledCount} Students</span>
                            <span className="text-xs font-mono font-bold text-amber-400">{t.price}</span>
                          </div>

                          <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2">
                            <div
                              className="bg-gradient-to-r from-orange-500 to-amber-400 h-1.5 rounded-full transition-all"
                              style={{ width: `${Math.max(5, sharePct)}%` }}
                            />
                          </div>
                        </div>

                        <div className="mt-3 pt-2.5 border-t border-slate-900 flex items-center justify-between text-xs">
                          <span className="text-slate-500 text-[10px]">{sharePct}% Share</span>
                          <span className="font-black text-emerald-400 font-mono">₹{t.estimatedRevenue.toLocaleString("en-IN")}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* All Students Table */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><Users size={20} className="text-blue-400" /> All Students</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-800">
                      <th className="text-left text-slate-400 pb-3 font-semibold">Student</th>
                      <th className="text-left text-slate-400 pb-3 font-semibold">Level</th>
                      <th className="text-left text-slate-400 pb-3 font-semibold">XP</th>
                      <th className="text-left text-slate-400 pb-3 font-semibold">Streak</th>
                      <th className="text-left text-slate-400 pb-3 font-semibold">Courses</th>
                      <th className="text-left text-slate-400 pb-3 font-semibold">Milestones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((s, i) => (
                      <tr key={i} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                        <td className="py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center text-xs font-bold text-white">
                              {s.name?.charAt(0)}
                            </div>
                            <div>
                              <p className="text-white font-medium">{s.name}</p>
                              <p className="text-slate-500 text-xs">{s.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3"><span className="text-orange-400 font-bold text-xs bg-orange-500/10 px-2 py-1 rounded-lg">{s.membershipLevel || 'L0'}</span></td>
                        <td className="py-3 text-yellow-400 font-bold">{(s.points || 0).toLocaleString()}</td>
                        <td className="py-3 text-orange-400 font-bold">🔥 {s.streak || 0}d</td>
                        <td className="py-3 text-slate-300">{s.courses?.length || 0}</td>
                        <td className="py-3">
                          <div className="flex items-center gap-1">
                            <span className="text-green-400 text-xs">{s.milestones?.filter((m: any) => m.completed).length || 0} done</span>
                            <span className="text-slate-600 text-xs">/ {s.milestones?.length || 0}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {students.length === 0 && (
                      <tr><td colSpan={6} className="py-8 text-center text-slate-500">No students found</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          )
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Send notification form */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><Send size={20} className="text-orange-400" /> Send Notification</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-slate-400 block mb-2">Select Student</label>
                  <select
                    value={selectedStudent}
                    onChange={e => setSelectedStudent(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl p-3 focus:outline-none focus:border-orange-500"
                  >
                    <option value="">-- Choose a student --</option>
                    {students.map(s => (
                      <option key={s.id} value={s.id}>{s.name} ({s.email})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-400 block mb-2">Title</label>
                  <input
                    type="text"
                    value={notifTitle}
                    onChange={e => setNotifTitle(e.target.value)}
                    placeholder="e.g. Congratulations!"
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl p-3 focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-400 block mb-2">Message</label>
                  <textarea
                    value={notifMessage}
                    onChange={e => setNotifMessage(e.target.value)}
                    placeholder="e.g. You earned the Diamond Badge!"
                    rows={3}
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl p-3 focus:outline-none focus:border-orange-500 resize-none"
                  />
                </div>
                <button
                  onClick={handleSendNotification}
                  disabled={sending || !selectedStudent || !notifTitle || !notifMessage}
                  className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <Send size={16} /> {sending ? 'Sending...' : 'Send Notification'}
                </button>
              </div>
            </div>

            {/* Notification history */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><Bell size={20} className="text-orange-400" /> Sent Notifications</h2>
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                {notifications.length === 0 && <p className="text-slate-500 text-center py-8">No notifications sent yet</p>}
                {notifications.map((n, i) => (
                  <div key={n.id || i} className="bg-slate-800/50 border border-slate-700 rounded-2xl p-4">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-bold text-white text-sm">{n.title}</h4>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${n.isRead ? 'bg-slate-700 text-slate-400' : 'bg-green-500/20 text-green-400'}`}>
                        {n.isRead ? 'Read' : 'Unread'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mb-2">{n.message}</p>
                    <p className="text-xs text-slate-500">To: {n.user?.name || 'Student'}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Win Wall Tab */}
        {activeTab === 'wins' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Post a Win form */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><Plus size={20} className="text-pink-400" /> Post a Community Win</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-slate-400 block mb-2">Author (Admin or Select Student)</label>
                  <select
                    value={winName}
                    onChange={e => setWinName(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl p-3 focus:outline-none focus:border-pink-500 font-bold"
                  >
                    <option value="Patel Vrajangna (Admin)">👑 Patel Vrajangna (Admin Announcement)</option>
                    {students.map(s => (
                      <option key={s.id} value={s.name}>🎓 Student: {s.name} ({s.email})</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-400 block mb-1">Sales Amount (₹ optional)</label>
                    <input
                      type="number"
                      placeholder="e.g. 4500"
                      value={winSalesAmount}
                      onChange={e => setWinSalesAmount(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl p-2.5 text-xs focus:outline-none focus:border-pink-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-400 block mb-1">Technique Used</label>
                    <input
                      type="text"
                      placeholder="e.g. Ocean Wave Lacing"
                      value={winTechnique}
                      onChange={e => setWinTechnique(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl p-2.5 text-xs focus:outline-none focus:border-pink-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-400 block mb-2">Achievement / Story</label>
                  <textarea
                    value={winAchievement}
                    onChange={e => setWinAchievement(e.target.value)}
                    placeholder="e.g. Got her first corporate order for 50 custom clocks!"
                    rows={3}
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl p-3 focus:outline-none focus:border-pink-500 resize-none text-xs"
                  />
                </div>

                {/* Browser File Upload (Image, Video, Document) */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400 block">Upload File (Image, Video, Document)</label>
                  <input
                    type="file"
                    accept="image/*,video/*,.pdf,.doc,.docx"
                    onChange={handleAdminFileSelect}
                    className="w-full text-xs text-slate-300 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-pink-500/20 file:text-pink-400 hover:file:bg-pink-500/30 cursor-pointer bg-slate-950 border border-slate-800 rounded-xl p-1"
                  />

                  <input
                    type="text"
                    placeholder="Or paste external file / image URL..."
                    value={winImage}
                    onChange={e => setWinImage(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl p-2 text-xs focus:outline-none focus:border-pink-500 mt-1"
                  />

                  {winImage && (
                    <div className="mt-2 p-2 rounded-xl bg-slate-950 border border-slate-800 relative">
                      <button
                        type="button"
                        onClick={() => setWinImage('')}
                        className="absolute right-2 top-2 bg-slate-900 text-slate-400 hover:text-white p-1 rounded-lg z-10 text-xs"
                      >
                        ✕
                      </button>

                      {winImage.startsWith('data:video') || winImage.match(/\.(mp4|webm|mov)$/i) ? (
                        <video src={winImage} controls className="max-h-36 rounded-lg w-full object-cover" />
                      ) : winImage.startsWith('data:image') || winImage.match(/\.(jpeg|jpg|gif|png|webp)$/i) || winImage.startsWith('data:') ? (
                        <img src={winImage} alt="Upload preview" className="max-h-36 rounded-lg w-full object-cover" />
                      ) : (
                        <div className="p-3 text-xs font-bold text-pink-400 flex items-center gap-2">
                          📄 Document / File attached!
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <button
                  onClick={handlePostWin}
                  disabled={postingWin || !winAchievement}
                  className="w-full bg-pink-500 hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Heart size={16} /> {postingWin ? 'Posting...' : 'Post Win to Wall'}
                </button>
              </div>
            </div>

            {/* Win history */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><Trophy size={20} className="text-yellow-400" /> Community Win Wall</h2>
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                {wins.length === 0 && <p className="text-slate-500 text-center py-8">No wins posted yet</p>}
                {wins.map((w, i) => (
                  <div key={w.id || i} className="bg-slate-800/50 border border-slate-700 rounded-2xl p-4 flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-orange-400 flex items-center justify-center text-white font-bold shrink-0">
                      {w.studentName?.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-white text-sm flex items-center gap-2">
                            {w.studentName}
                            {w.studentName?.includes('Admin') && (
                              <span className="text-[10px] font-bold text-pink-400 bg-pink-500/10 border border-pink-500/30 px-2 py-0.5 rounded-md">Admin</span>
                            )}
                          </h4>
                          <p className="text-xs text-slate-300 mt-1 leading-relaxed">{w.achievement}</p>
                        </div>
                        <button
                          onClick={() => handleDeleteWin(w.id)}
                          className="text-slate-600 hover:text-red-400 transition-colors p-1 ml-2 shrink-0 cursor-pointer"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>

                      {/* Attached Photo / Video / Document */}
                      {w.image && (
                        <div className="mt-2 rounded-xl overflow-hidden border border-slate-700 bg-slate-950">
                          {w.image.startsWith('data:video') || /\.(mp4|webm|mov)$/i.test(w.image) ? (
                            <video src={w.image} controls className="w-full max-h-48 object-contain bg-black" />
                          ) : w.image.startsWith('data:application') || /\.(pdf|doc|docx)$/i.test(w.image) ? (
                            <div className="p-3 text-xs font-bold text-pink-400 flex items-center justify-between">
                              <span>📄 Attached Document / File</span>
                              <a href={w.image} download target="_blank" rel="noreferrer" className="px-2.5 py-1 rounded-lg bg-pink-500/20 text-white font-bold text-[10px]">Download</a>
                            </div>
                          ) : (
                            <img src={w.image} alt="Attachment" className="w-full max-h-48 object-cover" />
                          )}
                        </div>
                      )}

                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs text-pink-400">❤️ {w.likes}</span>
                        <span className="text-xs text-slate-500">· {w.timeAgo}</span>
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
