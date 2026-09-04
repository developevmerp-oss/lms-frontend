"use client";

import React, { useState, useEffect } from "react";
import { StudentNav, getLevelCode } from "@/components/layout/StudentNav";
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
} from "lucide-react";
import Link from "next/link";

export default function NorthstarTrackingPage() {
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
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
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

    const token = localStorage.getItem("token");
    try {
      await fetch(`${API_BASE_URL}/dashboard/student/sales/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchStudentData();
    } catch (_) {}
  };

  const studentLevelCode = getLevelCode(stats?.membershipLevel, stats?.points || 0);
  const isAccessible = ["L3", "L3+"].includes(studentLevelCode);

  const totalRevenue = salesRecords.reduce((acc, r) => acc + (parseFloat(r.amount) || 0), 0);
  const goalPercent = Math.min(100, Math.round((totalRevenue / targetMonthlyGoal) * 100));

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      <StudentNav
        user={stats}
        level={stats?.membershipLevel || "Fast Track (L0)"}
        points={stats?.points || 0}
        logout={handleLogout}
        notifications={stats?.notifications}
      />

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-orange-500/30 bg-orange-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-orange-400 mb-2">
              <Target size={13} className="text-orange-400" /> Northstar Business Tracking System
            </span>
            <h1 className="text-2xl md:text-4xl font-black text-white">
              Northstar Revenue &amp; Goal Tracker
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Track your journey from art creation to consistent ₹3,00,000/month commercial business growth.
            </p>
          </div>

          {isAccessible && (
            <button
              onClick={() => setShowAddSaleModal(true)}
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-black text-xs md:text-sm h-11 px-6 rounded-2xl shadow-lg shadow-orange-500/20 transition-all hover:scale-105 cursor-pointer self-start md:self-auto"
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
          <div className="rounded-3xl border border-orange-500/40 bg-slate-900/90 p-8 md:p-12 text-center max-w-2xl mx-auto shadow-2xl">
            <div className="size-16 rounded-3xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400 mx-auto mb-4">
              <Lock size={32} />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-orange-400 block mb-1">
              Level 3 (Diamond Membership) Required
            </span>
            <h2 className="text-2xl font-black text-white mb-3">
              Northstar Tracking Engine is Locked
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed mb-6">
              The full commercial revenue tracker, client conversion analytics, and 90-day milestone scorecards are exclusive to <strong>Level 3 (Diamond Membership)</strong> and <strong>Level 3+ (Masters Club)</strong> members.
            </p>
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 mb-6 text-left">
              <div className="flex justify-between text-xs font-bold text-slate-300">
                <span>Your Current Membership:</span>
                <span className="text-orange-400 font-bold">{stats?.membershipLevel || "L0 Fast Track"}</span>
              </div>
            </div>
            <Link
              href="/student/courses"
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-black text-sm h-11 px-8 rounded-xl shadow-lg shadow-orange-500/20 hover:scale-105 transition-all"
            >
              Explore Available Courses
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Northstar KPI Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl">
                <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase mb-2">
                  <span>Total Revenue Logged</span>
                  <DollarSign size={16} className="text-emerald-400" />
                </div>
                <p className="text-3xl font-black text-white">₹{totalRevenue.toLocaleString()}</p>
                <p className="text-xs text-emerald-400 mt-1 font-semibold">Real client transactions</p>
              </div>

              <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl">
                <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase mb-2">
                  <span>Northstar Target</span>
                  <Target size={16} className="text-orange-400" />
                </div>
                <p className="text-3xl font-black text-white">₹3,00,000</p>
                <p className="text-xs text-slate-400 mt-1">Monthly business ambition</p>
              </div>

              <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl">
                <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase mb-2">
                  <span>Total Custom Orders</span>
                  <Layers size={16} className="text-cyan-400" />
                </div>
                <p className="text-3xl font-black text-white">{salesRecords.length}</p>
                <p className="text-xs text-cyan-400 mt-1 font-semibold">Completed customer sales</p>
              </div>

              <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl">
                <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase mb-2">
                  <span>Average Order Value</span>
                  <TrendingUp size={16} className="text-amber-400" />
                </div>
                <p className="text-3xl font-black text-white">
                  ₹{salesRecords.length > 0 ? Math.round(totalRevenue / salesRecords.length).toLocaleString() : "0"}
                </p>
                <p className="text-xs text-amber-400 mt-1 font-semibold">Per order average</p>
              </div>
            </div>

            {/* Target Progress Bar */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 sm:p-8 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                <div>
                  <h3 className="text-lg font-black text-white">Roadmap Milestone Progress</h3>
                  <p className="text-xs text-slate-400">Current progress toward ₹3 Lakh/Month target</p>
                </div>
                <span className="text-xl font-black text-orange-400">{goalPercent}% Reached</span>
              </div>
              <div className="h-4 overflow-hidden rounded-full bg-slate-950 p-0.5 border border-slate-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-orange-500 via-amber-400 to-emerald-400 transition-all duration-1000"
                  style={{ width: `${Math.max(2, goalPercent)}%` }}
                ></div>
              </div>
            </div>

            {/* Sales Table */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 sm:p-8 shadow-xl">
              <h3 className="text-lg font-black text-white mb-4">Logged Client Orders</h3>

              {salesRecords.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-slate-800 rounded-2xl">
                  <p className="text-slate-400 text-sm mb-3">No sales logged yet. Start recording your custom resin orders!</p>
                  <button
                    onClick={() => setShowAddSaleModal(true)}
                    className="inline-flex items-center justify-center gap-2 bg-orange-500 text-slate-950 font-bold text-xs h-9 px-4 rounded-xl"
                  >
                    <Plus size={14} /> Log First Sale
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-slate-800 text-xs font-bold text-slate-400 uppercase">
                        <th className="pb-3">Product Name / Commission</th>
                        <th className="pb-3">Date</th>
                        <th className="pb-3">Amount</th>
                        <th className="pb-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {salesRecords.map((sale) => (
                        <tr key={sale.id} className="hover:bg-slate-800/30 transition-colors">
                          <td className="py-4 font-semibold text-white">{sale.productName}</td>
                          <td className="py-4 text-xs text-slate-400">
                            {sale.date ? new Date(sale.date).toLocaleDateString("en-IN") : "Recent"}
                          </td>
                          <td className="py-4 font-black text-emerald-400">
                            ₹{parseFloat(sale.amount).toLocaleString()}
                          </td>
                          <td className="py-4 text-right">
                            <button
                              onClick={() => handleDeleteSale(sale.id)}
                              className="text-slate-500 hover:text-red-400 p-1.5 transition-colors cursor-pointer"
                              title="Delete entry"
                            >
                              <Trash2 size={15} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Add Sale Modal */}
        {showAddSaleModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <div className="relative w-full max-w-md rounded-3xl border border-orange-500/30 bg-slate-900 p-6 sm:p-8 shadow-2xl text-white">
              <h3 className="text-xl font-black text-white mb-2">Log New Client Sale</h3>
              <p className="text-xs text-slate-400 mb-6">
                Record your real custom resin commissions. Each sale earns you +100 XP!
              </p>

              <form onSubmit={handleAddSale} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Product / Commission Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 18-inch Geode Wall Clock"
                    value={saleForm.productName}
                    onChange={(e) => setSaleForm({ ...saleForm, productName: e.target.value })}
                    className="flex h-11 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 text-sm text-white placeholder-slate-500 focus:border-orange-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Sale Amount (₹)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="e.g. 5500"
                    value={saleForm.amount}
                    onChange={(e) => setSaleForm({ ...saleForm, amount: e.target.value })}
                    className="flex h-11 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 text-sm text-white placeholder-slate-500 focus:border-orange-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Date</label>
                  <input
                    type="date"
                    required
                    value={saleForm.date}
                    onChange={(e) => setSaleForm({ ...saleForm, date: e.target.value })}
                    className="flex h-11 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 text-sm text-white placeholder-slate-500 focus:border-orange-500 focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={savingSale}
                    className="flex-1 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-black text-sm h-11 rounded-xl shadow-lg hover:scale-105 transition-all cursor-pointer"
                  >
                    {savingSale ? "Saving..." : "Save Sale (+100 XP)"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddSaleModal(false)}
                    className="border border-slate-700 bg-slate-800 text-slate-300 font-semibold text-sm h-11 px-5 rounded-xl cursor-pointer"
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
