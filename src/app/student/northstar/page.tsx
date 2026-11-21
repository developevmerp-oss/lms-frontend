"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { StudentNav, getLevelCode } from "@/components/layout/StudentNav";
import { StatCardSkeleton, AdminTableSkeleton } from "@/components/ui/SkeletonLoader";
import { API_BASE_URL } from "@/config/api";
import {
  Target,
  TrendingUp,
  DollarSign,
  Plus,
  Trash2,
  Lock,
  Sparkles,
  Award,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  Zap,
  Loader2,
} from "lucide-react";
import Link from "next/link";

export default function NorthstarTrackingPage() {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [salesRecords, setSalesRecords] = useState<any[]>([]);
  const [showAddSaleModal, setShowAddSaleModal] = useState(false);
  const [saleForm, setSaleForm] = useState({
    amount: "",
    productName: "",
    date: new Date().toISOString().split("T")[0],
  });
  const [savingSale, setSavingSale] = useState(false);
  const [deletingSaleId, setDeletingSaleId] = useState<string | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState("");

  const targetMonthlyGoal = 300000; // ₹3 Lakh target roadmap

  const fetchStudentData = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/dashboard/student`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setStats(data);
      if (Array.isArray(data.salesRecords)) {
        setSalesRecords(data.salesRecords);
      }
    } catch (_) {}
    setLoading(false);
  };

  useEffect(() => {
    fetchStudentData();
  }, []);

  const handleLogout = () => {
    logout();
  };

  const handleAddSale = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!saleForm.amount || !saleForm.productName) return;

    setSavingSale(true);
    setFeedbackMsg("");

    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_BASE_URL}/dashboard/student/sales`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(saleForm),
      });

      const result = await res.json();
      if (result.success) {
        setFeedbackMsg("🎉 Sale logged successfully! +100 XP awarded to your profile!");
        setSaleForm({
          amount: "",
          productName: "",
          date: new Date().toISOString().split("T")[0],
        });
        setShowAddSaleModal(false);
        fetchStudentData();
      }
    } catch (_) {}
    setSavingSale(false);
  };

  const handleDeleteSale = async (id: string) => {
    if (!confirm("Are you sure you want to delete this sales entry?")) return;

    setDeletingSaleId(id);
    const token = localStorage.getItem("token");
    try {
      await fetch(`${API_BASE_URL}/dashboard/student/sales/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchStudentData();
    } catch (_) {
    } finally {
      setDeletingSaleId(null);
    }
  };

  const effectiveLevel = user?.membershipLevel || stats?.membershipLevel || user?.rank;
  const studentLevelCode = getLevelCode(effectiveLevel, stats?.points || 0);
  const isAccessible = ["L3", "L3+"].includes(studentLevelCode);

  const totalRevenue = salesRecords.reduce((acc, r) => acc + (parseFloat(r.amount) || 0), 0);
  const goalPercent = Math.min(100, Math.round((totalRevenue / targetMonthlyGoal) * 100));

  return (
    <div
      className="min-h-screen bg-[#faf8f5] text-stone-900 font-sans transition-colors lg:pl-64"
      style={{
        backgroundColor: "#faf8f5",
        backgroundImage: "radial-gradient(circle, #e2ded4 1.5px, transparent 1.5px)",
        backgroundSize: "24px 24px",
        backgroundAttachment: "fixed",
      }}
    >
      <StudentNav
        user={user || stats}
        level={effectiveLevel || "Fast Track (L0)"}
        points={stats?.points || 0}
        logout={handleLogout}
        notifications={stats?.notifications}
      />

      <main className="w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-end gap-4 mb-6">
          {/*
          <div>
            <div className="flex items-center gap-1.5 text-xs text-stone-500 mb-1 font-medium">
              <span>Business &amp; Growth</span>
              <span className="text-stone-300">/</span>
              <span className="text-stone-700 font-medium">Northstar Revenue &amp; Goal Tracker</span>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-stone-900 tracking-tight">
              Northstar Revenue &amp; Goal Tracker
            </h1>
            <p className="text-stone-500 text-xs sm:text-sm mt-0.5">
              Track your journey from art creation to consistent ₹3,00,000/month commercial business growth.
            </p>
          </div>
          */}

          {isAccessible && (
            <button
              onClick={() => setShowAddSaleModal(true)}
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#942008] via-[#c4431d] to-[#ea580c] hover:opacity-95 text-white font-bold text-xs md:text-sm h-11 px-6 rounded-2xl shadow-md shadow-[#c4431d]/20 transition-all hover:scale-105 cursor-pointer self-start md:self-auto"
            >
              <Plus size={16} /> Log New Client Sale (+100 XP)
            </button>
          )}
        </div>

        {feedbackMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-bold flex items-center gap-2">
            <CheckCircle2 size={18} /> {feedbackMsg}
          </div>
        )}

        {/* Level Lock Check */}
        {!isAccessible ? (
          <div className="rounded-3xl border border-[#ecdccb] bg-white/95 p-8 md:p-12 text-center max-w-2xl mx-auto shadow-2xl">
            <div className="size-16 rounded-3xl bg-[#fde5d6] border border-[#f5ded0] flex items-center justify-center text-[#942008] mx-auto mb-4">
              <Lock size={32} />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#942008] block mb-1">
              Level 3 (Diamond Membership) Required
            </span>
            <h2 className="text-2xl font-black text-stone-900 mb-3">
              Northstar Tracking Engine is Locked
            </h2>
            <p className="text-sm text-stone-600 leading-relaxed mb-6">
              The full commercial revenue tracker, client conversion analytics, and 90-day milestone scorecards are exclusive to <strong>Level 3 (Diamond Membership)</strong> and <strong>Level 3+ (Masters Club)</strong> members.
            </p>
            <div className="rounded-2xl border border-stone-200 bg-[#faf8f5] p-4 mb-6 text-left">
              <div className="flex justify-between text-xs font-bold text-stone-600">
                <span>Your Current Membership:</span>
                <span className="text-[#942008] font-bold">{stats?.membershipLevel || "L0 Fast Track"}</span>
              </div>
            </div>
            <Link
              href="/student/courses"
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#942008] via-[#c4431d] to-[#ea580c] text-white font-bold text-sm h-11 px-8 rounded-xl shadow-md shadow-[#c4431d]/20 hover:scale-105 transition-all"
            >
              Explore Available Courses
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {loading ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCardSkeleton />
                <StatCardSkeleton />
                <StatCardSkeleton />
                <StatCardSkeleton />
              </div>
              <AdminTableSkeleton rows={5} cols={4} />
            </div>
          ) : (
            <>
            {/* Northstar KPI Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="rounded-3xl border border-stone-200 bg-white/95 p-6 shadow-xl">
                <div className="flex items-center justify-between text-stone-500 text-xs font-bold uppercase mb-2">
                  <span>Total Revenue Logged</span>
                  <DollarSign size={16} className="text-emerald-400" />
                </div>
                <p className="text-3xl font-black text-stone-900">₹{totalRevenue.toLocaleString()}</p>
                <p className="text-xs text-emerald-400 mt-1 font-semibold">Real client transactions</p>
              </div>

              <div className="rounded-3xl border border-stone-200 bg-white/95 p-6 shadow-xl">
                <div className="flex items-center justify-between text-stone-500 text-xs font-bold uppercase mb-2">
                  <span>Northstar Target</span>
                  <Target size={16} className="text-[#942008]" />
                </div>
                <p className="text-3xl font-black text-stone-900">₹3,00,000</p>
                <p className="text-xs text-stone-500 mt-1">Monthly business ambition</p>
              </div>

              <div className="rounded-3xl border border-stone-200 bg-white/95 p-6 shadow-xl">
                <div className="flex items-center justify-between text-stone-500 text-xs font-bold uppercase mb-2">
                  <span>Total Custom Orders</span>
                  <Layers size={16} className="text-cyan-400" />
                </div>
                <p className="text-3xl font-black text-stone-900">{salesRecords.length}</p>
                <p className="text-xs text-cyan-400 mt-1 font-semibold">Completed customer sales</p>
              </div>

              <div className="rounded-3xl border border-stone-200 bg-white/95 p-6 shadow-xl">
                <div className="flex items-center justify-between text-stone-500 text-xs font-bold uppercase mb-2">
                  <span>Average Order Value</span>
                  <TrendingUp size={16} className="text-amber-400" />
                </div>
                <p className="text-3xl font-black text-stone-900">
                  ₹{salesRecords.length > 0 ? Math.round(totalRevenue / salesRecords.length).toLocaleString() : "0"}
                </p>
                <p className="text-xs text-amber-400 mt-1 font-semibold">Per order average</p>
              </div>
            </div>

            {/* Target Progress Bar */}
            <div className="rounded-3xl border border-stone-200 bg-white/95 p-6 sm:p-8 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                <div>
                  <h3 className="text-lg font-black text-stone-900">Roadmap Milestone Progress</h3>
                  <p className="text-xs text-stone-500">Current progress toward ₹3 Lakh/Month target</p>
                </div>
                <span className="text-xl font-black text-[#942008]">{goalPercent}% Reached</span>
              </div>
              <div className="h-4 overflow-hidden rounded-full bg-[#faf8f5] p-0.5 border border-stone-200">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#942008] via-[#c4431d] to-emerald-500 transition-all duration-1000"
                  style={{ width: `${Math.max(2, goalPercent)}%` }}
                ></div>
              </div>
            </div>

            {/* Sales Table */}
            <div className="rounded-3xl border border-stone-200 bg-white/95 p-6 sm:p-8 shadow-xl">
              <h3 className="text-lg font-black text-stone-900 mb-4">Logged Client Orders</h3>

              {salesRecords.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-stone-200 rounded-2xl">
                  <p className="text-stone-500 text-sm mb-3">No sales logged yet. Start recording your custom resin orders!</p>
                  <button
                    onClick={() => setShowAddSaleModal(true)}
                    className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#942008] via-[#c4431d] to-[#ea580c] text-white font-bold text-xs h-9 px-4 rounded-xl"
                  >
                    <Plus size={14} /> Log First Sale
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-stone-200 text-xs font-bold text-stone-500 uppercase">
                        <th className="pb-3">Product Name / Commission</th>
                        <th className="pb-3">Date</th>
                        <th className="pb-3">Amount</th>
                        <th className="pb-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {salesRecords.map((sale) => (
                        <tr key={sale.id} className="hover:bg-stone-100/30 transition-colors">
                          <td className="py-4 font-semibold text-stone-900">{sale.productName}</td>
                          <td className="py-4 text-xs text-stone-500">
                            {sale.date ? new Date(sale.date).toLocaleDateString("en-IN") : "Recent"}
                          </td>
                          <td className="py-4 font-black text-emerald-400">
                            ₹{parseFloat(sale.amount).toLocaleString()}
                          </td>
                          <td className="py-4 text-right">
                            <button
                              onClick={() => handleDeleteSale(sale.id)}
                              disabled={deletingSaleId === sale.id}
                              className="text-stone-400 hover:text-red-400 p-1.5 transition-colors cursor-pointer disabled:opacity-50"
                              title="Delete entry"
                            >
                              {deletingSaleId === sale.id ? (
                                <Loader2 size={15} className="animate-spin text-red-500" />
                              ) : (
                                <Trash2 size={15} />
                              )}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            </>
          )}
          </div>
        )}

        {/* Add Sale Modal */}
        {showAddSaleModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#faf8f5]/80 backdrop-blur-md">
            <div className="relative w-full max-w-md rounded-3xl border border-[#ecdccb] bg-white/95 p-6 sm:p-8 shadow-2xl text-stone-900">
              <h3 className="text-xl font-black text-stone-900 mb-2">Log New Client Sale</h3>
              <p className="text-xs text-stone-500 mb-6">
                Record your real custom resin commissions. Each sale earns you +100 XP!
              </p>

              <form onSubmit={handleAddSale} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-600">Product / Commission Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 18-inch Geode Wall Clock"
                    value={saleForm.productName}
                    onChange={(e) => setSaleForm({ ...saleForm, productName: e.target.value })}
                    className="flex h-11 w-full rounded-xl border border-stone-200 bg-[#faf8f5] px-4 text-sm text-stone-900 placeholder-slate-500 focus:border-[#c4431d] focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-600">Sale Amount (₹)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="e.g. 5500"
                    value={saleForm.amount}
                    onChange={(e) => setSaleForm({ ...saleForm, amount: e.target.value })}
                    className="flex h-11 w-full rounded-xl border border-stone-200 bg-[#faf8f5] px-4 text-sm text-stone-900 placeholder-slate-500 focus:border-[#c4431d] focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-600">Date</label>
                  <input
                    type="date"
                    required
                    value={saleForm.date}
                    onChange={(e) => setSaleForm({ ...saleForm, date: e.target.value })}
                    className="flex h-11 w-full rounded-xl border border-stone-200 bg-[#faf8f5] px-4 text-sm text-stone-900 placeholder-slate-500 focus:border-[#c4431d] focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={savingSale}
                    className="flex-1 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#942008] via-[#c4431d] to-[#ea580c] text-white font-black text-sm h-11 rounded-xl shadow-lg hover:scale-105 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {savingSale && <Loader2 size={16} className="animate-spin" />}
                    {savingSale ? "Saving..." : "Save Sale (+100 XP)"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddSaleModal(false)}
                    className="border border-stone-300 bg-stone-100 text-stone-600 font-semibold text-sm h-11 px-5 rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
