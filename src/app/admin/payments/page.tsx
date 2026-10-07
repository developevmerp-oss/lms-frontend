"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { AdminNav } from "@/components/layout/AdminNav";
import {
  CreditCard,
  CheckCircle2,
  Clock,
  XCircle,
  AlertTriangle,
  Search,
  RefreshCw,
  Trash2,
  Copy,
  Check,
  TrendingUp,
  Filter,
  Bell,
  Calendar,
  Send,
  Zap,
  Users,
} from "lucide-react";
import { API_BASE_URL } from "@/config/api";
import { Pagination } from "@/components/ui/Pagination";

interface PaymentTx {
  id: string;
  orderId: string;
  paymentId?: string | null;
  userId?: string | null;
  customerName?: string | null;
  customerEmail?: string | null;
  customerPhone?: string | null;
  tierCode: string;
  tierName: string;
  amount: number;
  currency: string;
  status: "pending" | "completed" | "failed" | "cancelled";
  failureReason?: string | null;
  paymentMethod?: string | null;
  paidAt?: string | null;
  createdAt: string;
}

interface PaymentStats {
  totalRevenue: number;
  completedCount: number;
  pendingCount: number;
  failedCount: number;
  totalAttempts: number;
}

export default function AdminPaymentTransactions() {
  const { token, user, logout } = useAuth();
  const [transactions, setTransactions] = useState<PaymentTx[]>([]);
  const [stats, setStats] = useState<PaymentStats>({
    totalRevenue: 0,
    completedCount: 0,
    pendingCount: 0,
    failedCount: 0,
    totalAttempts: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit] = useState(25);

  // Installment Management State
  const [activeMainTab, setActiveMainTab] = useState<"transactions" | "installments">("transactions");
  const [installmentPlans, setInstallmentPlans] = useState<any[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [remindingId, setRemindingId] = useState<string | null>(null);

  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  const fetchTransactions = async (targetPage = page) => {
    setIsLoading(true);
    try {
      const url = new URL(`${API_BASE_URL}/payments/history`);
      if (statusFilter !== "all") url.searchParams.append("status", statusFilter);
      if (searchQuery.trim()) url.searchParams.append("search", searchQuery.trim());
      url.searchParams.append("page", String(targetPage));
      url.searchParams.append("limit", String(limit));

      const res = await fetch(url.toString(), { headers });
      const data = await res.json();
      if (data.success) {
        setTransactions(data.transactions || []);
        if (data.stats) setStats(data.stats);
        if (data.total !== undefined) setTotal(data.total);
        if (data.totalPages !== undefined) setTotalPages(data.totalPages);
      }
    } catch (err) {
      console.error("Error fetching payment history:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchInstallments = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/payments/installments`, { headers });
      const data = await res.json();
      if (data.success && Array.isArray(data.plans)) {
        setInstallmentPlans(data.plans);
      }
    } catch (err) {
      console.error("Error fetching admin installments:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleScanReminders = async () => {
    setIsScanning(true);
    try {
      const res = await fetch(`${API_BASE_URL}/payments/installments/check-reminders`, {
        method: "POST",
        headers,
      });
      const data = await res.json();
      if (data.success) {
        setToastMsg(data.message || "Installment scan completed!");
        setTimeout(() => setToastMsg(""), 4000);
        fetchInstallments();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsScanning(false);
    }
  };

  const handleSendManualReminder = async (planId: string) => {
    setRemindingId(planId);
    try {
      const res = await fetch(`${API_BASE_URL}/payments/installments/${planId}/remind`, {
        method: "POST",
        headers,
      });
      const data = await res.json();
      if (data.success) {
        setToastMsg(data.message || "Reminder sent to student!");
        setTimeout(() => setToastMsg(""), 4000);
        fetchInstallments();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setRemindingId(null);
    }
  };

  useEffect(() => {
    if (token) {
      if (activeMainTab === "transactions") {
        setPage(1);
        fetchTransactions(1);
      } else {
        fetchInstallments();
      }
    }
  }, [token, statusFilter, activeMainTab]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchTransactions(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    fetchTransactions(newPage);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const deleteTransaction = async (id: string) => {
    if (!confirm("Are you sure you want to remove this transaction record?")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/payments/transaction/${id}`, {
        method: "DELETE",
        headers,
      });
      if (res.ok) {
        setToastMsg("Record deleted successfully.");
        setTimeout(() => setToastMsg(""), 3000);
        fetchTransactions();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <CheckCircle2 size={13} className="text-emerald-400" /> Success
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <Clock size={13} className="text-amber-400" /> Pending
          </span>
        );
      case "failed":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-500/10 border border-red-500/30 text-red-400">
            <XCircle size={13} className="text-red-400" /> Failed
          </span>
        );
      case "cancelled":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-800 border border-slate-700 text-slate-400">
            <AlertTriangle size={13} className="text-slate-400" /> Cancelled
          </span>
        );
      default:
        return <span className="text-xs text-slate-400 uppercase">{status}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <AdminNav user={user} logout={logout} />

      <main className="max-w-[1400px] mx-auto p-4 md:p-8">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400 shadow-lg shadow-orange-500/10">
                <CreditCard size={24} />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                  Razorpay Payment &amp; Transactions History
                </h1>
                <p className="text-slate-400 text-sm mt-0.5">
                  Complete audit log of all membership checkout attempts with live gateway verification.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {toastMsg && (
              <span className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold px-3 py-1.5 rounded-xl">
                ✓ {toastMsg}
              </span>
            )}
            <button
              onClick={() => {
                if (activeMainTab === "transactions") fetchTransactions();
                else fetchInstallments();
              }}
              className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 px-4 py-2.5 rounded-xl text-sm font-bold transition-colors cursor-pointer"
            >
              <RefreshCw size={15} className={isLoading ? "animate-spin" : ""} /> Refresh
            </button>
          </div>
        </header>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-3 border-b border-slate-800/80 pb-4 mb-8">
          <button
            onClick={() => setActiveMainTab("transactions")}
            className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer ${
              activeMainTab === "transactions"
                ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20"
                : "bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            <CreditCard size={16} /> All Gateway Transactions
          </button>
          <button
            onClick={() => {
              setActiveMainTab("installments");
              fetchInstallments();
            }}
            className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer ${
              activeMainTab === "installments"
                ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/20"
                : "bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            <Calendar size={16} /> Student Installment Plans
            {installmentPlans.length > 0 && (
              <span className="bg-emerald-950 text-emerald-300 text-xs px-2 py-0.5 rounded-full font-bold ml-1 border border-emerald-500/30">
                {installmentPlans.length}
              </span>
            )}
          </button>
        </div>

        {activeMainTab === "installments" ? (
          <div>
            {/* Installment KPIs */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-5">
                <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
                  <span>Total Installment Plans</span>
                  <Users size={16} className="text-blue-400" />
                </div>
                <p className="text-2xl md:text-3xl font-black text-white">{installmentPlans.length}</p>
                <p className="text-xs text-slate-500 mt-1">Students enrolled on plans</p>
              </div>

              <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-5">
                <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
                  <span>Active &amp; On Track</span>
                  <Clock size={16} className="text-emerald-400" />
                </div>
                <p className="text-2xl md:text-3xl font-black text-emerald-400">
                  {installmentPlans.filter((p) => p.status === "active").length}
                </p>
                <p className="text-xs text-slate-500 mt-1">Currently paying installments</p>
              </div>

              <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-5">
                <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
                  <span>Fully Completed</span>
                  <CheckCircle2 size={16} className="text-teal-400" />
                </div>
                <p className="text-2xl md:text-3xl font-black text-teal-400">
                  {installmentPlans.filter((p) => p.status === "completed").length}
                </p>
                <p className="text-xs text-slate-500 mt-1">All installments cleared</p>
              </div>

              <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-5">
                <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
                  <span>Overdue / Attention</span>
                  <AlertTriangle size={16} className="text-rose-400" />
                </div>
                <p className="text-2xl md:text-3xl font-black text-rose-400">
                  {
                    installmentPlans.filter(
                      (p) =>
                        p.status === "overdue" ||
                        (p.nextDueDate &&
                          new Date(p.nextDueDate).getTime() < Date.now() &&
                          p.status !== "completed")
                    ).length
                  }
                </p>
                <p className="text-xs text-slate-500 mt-1">Due date passed</p>
              </div>
            </div>

            {/* Quick Actions Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-lg font-bold text-white">Active Student Installment Agreements</h2>
                <p className="text-xs text-slate-400">
                  Automated recurring reminders run daily. You can also trigger manual alerts per student below.
                </p>
              </div>
              <button
                onClick={handleScanReminders}
                disabled={isScanning}
                className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-emerald-600/20 transition-all cursor-pointer disabled:opacity-50"
              >
                {isScanning ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" /> Scanning Due Dates...
                  </>
                ) : (
                  <>
                    <Bell size={14} /> Run Due Reminders Scan
                  </>
                )}
              </button>
            </div>

            {/* Installments Table */}
            <div className="bg-slate-900/70 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-800/60 border-b border-slate-800 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <tr>
                      <th className="py-4 px-6">Student</th>
                      <th className="py-4 px-4">Level / Plan</th>
                      <th className="py-4 px-4">Installment Progress</th>
                      <th className="py-4 px-4">Next Due Date</th>
                      <th className="py-4 px-4">Status</th>
                      <th className="py-4 px-4">Last Reminder</th>
                      <th className="py-4 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {isLoading ? (
                      <tr>
                        <td colSpan={7} className="py-16 text-center text-slate-500 font-medium">
                          <RefreshCw size={24} className="animate-spin mx-auto mb-2 text-emerald-400" />
                          Loading installment records...
                        </td>
                      </tr>
                    ) : installmentPlans.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-16 text-center text-slate-500 font-medium">
                          No student installment plans created yet. Once a student chooses installment checkout for Level 3, they will appear here.
                        </td>
                      </tr>
                    ) : (
                      installmentPlans.map((plan) => {
                        const isOverdue =
                          plan.status === "overdue" ||
                          (plan.nextDueDate &&
                            new Date(plan.nextDueDate).getTime() < Date.now() &&
                            plan.status !== "completed");
                        const percentPaid = Math.round(
                          (plan.paidInstallments / plan.totalInstallments) * 100
                        );

                        return (
                          <tr key={plan.id} className="hover:bg-slate-800/30 transition-colors">
                            {/* Student */}
                            <td className="py-4 px-6">
                              <div className="font-bold text-white leading-snug">
                                {plan.user?.name || "Student"}
                              </div>
                              <div className="text-xs text-slate-400">
                                {plan.user?.email || "No email"}
                              </div>
                              {plan.user?.phone && (
                                <div className="text-[11px] text-slate-500 mt-0.5">
                                  {plan.user?.phone}
                                </div>
                              )}
                            </td>

                            {/* Level / Plan */}
                            <td className="py-4 px-4">
                              <span className="font-bold text-white">
                                {plan.tierName || plan.tierCode}
                              </span>
                              <div className="text-xs text-emerald-400 capitalize">
                                {plan.frequency ? plan.frequency.replace("_", " ") : "Flexible"} Plan
                              </div>
                            </td>

                            {/* Progress */}
                            <td className="py-4 px-4">
                              <div className="flex items-center justify-between text-xs font-bold mb-1">
                                <span className="text-white">
                                  {plan.paidInstallments} of {plan.totalInstallments} Paid
                                </span>
                                <span className="text-slate-400">{percentPaid}%</span>
                              </div>
                              <div className="w-36 h-2 bg-slate-800 rounded-full overflow-hidden mb-1">
                                <div
                                  className={`h-full rounded-full transition-all ${
                                    plan.status === "completed"
                                      ? "bg-teal-400"
                                      : isOverdue
                                      ? "bg-rose-500"
                                      : "bg-emerald-500"
                                  }`}
                                  style={{ width: `${percentPaid}%` }}
                                />
                              </div>
                              <div className="text-[11px] text-slate-400">
                                ₹{Number(plan.installmentAmount).toLocaleString("en-IN")} / inst • Total: ₹
                                {Number(plan.totalAmount).toLocaleString("en-IN")}
                              </div>
                            </td>

                            {/* Next Due Date */}
                            <td className="py-4 px-4">
                              {plan.status === "completed" ? (
                                <span className="text-xs text-teal-400 font-bold flex items-center gap-1">
                                  <CheckCircle2 size={13} /> Completed
                                </span>
                              ) : plan.nextDueDate ? (
                                <div>
                                  <div
                                    className={`text-xs font-bold ${
                                      isOverdue ? "text-rose-400" : "text-white"
                                    }`}
                                  >
                                    {new Date(plan.nextDueDate).toLocaleDateString("en-IN", {
                                      day: "numeric",
                                      month: "short",
                                      year: "numeric",
                                    })}
                                  </div>
                                  {isOverdue && (
                                    <span className="inline-block text-[10px] font-bold text-rose-400 bg-rose-500/10 border border-rose-500/30 px-1.5 py-0.5 rounded mt-0.5">
                                      Overdue
                                    </span>
                                  )}
                                </div>
                              ) : (
                                <span className="text-xs text-slate-500">—</span>
                              )}
                            </td>

                            {/* Status */}
                            <td className="py-4 px-4">
                              {plan.status === "completed" ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-teal-500/10 border border-teal-500/30 text-teal-400">
                                  <CheckCircle2 size={12} /> Complete
                                </span>
                              ) : isOverdue ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500/10 border border-rose-500/30 text-rose-400">
                                  <AlertTriangle size={12} /> Overdue
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                                  <Clock size={12} /> Active
                                </span>
                              )}
                            </td>

                            {/* Last Reminder */}
                            <td className="py-4 px-4 text-xs text-slate-400">
                              {plan.lastReminderSentAt ? (
                                <span>
                                  {new Date(plan.lastReminderSentAt).toLocaleDateString("en-IN", {
                                    day: "numeric",
                                    month: "short",
                                  })}
                                </span>
                              ) : (
                                <span className="text-slate-500">None yet</span>
                              )}
                            </td>

                            {/* Actions */}
                            <td className="py-4 px-6 text-right">
                              {plan.status === "completed" ? (
                                <span className="text-xs font-bold text-slate-500">Fully Cleared</span>
                              ) : (
                                <button
                                  onClick={() => handleSendManualReminder(plan.id)}
                                  disabled={remindingId === plan.id}
                                  className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/30 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
                                  title="Send notification reminder to student"
                                >
                                  {remindingId === plan.id ? (
                                    <RefreshCw size={12} className="animate-spin" />
                                  ) : (
                                    <Send size={12} />
                                  )}
                                  Remind
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          <div>
            {/* KPI Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-5 relative overflow-hidden">
                <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
                  <span>Total Verified Revenue</span>
                  <TrendingUp size={16} className="text-emerald-400" />
                </div>
                <p className="text-2xl md:text-3xl font-black text-emerald-400">
                  ₹{stats.totalRevenue.toLocaleString("en-IN")}
                </p>
                <p className="text-xs text-slate-500 mt-1">From completed orders</p>
              </div>

              <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-5">
                <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
                  <span>Successful Orders</span>
                  <CheckCircle2 size={16} className="text-emerald-400" />
                </div>
            <p className="text-2xl md:text-3xl font-black text-white">{stats.completedCount}</p>
            <p className="text-xs text-emerald-400/80 mt-1">Membership unlocked</p>
          </div>

          <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-5">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
              <span>Pending Sessions</span>
              <Clock size={16} className="text-amber-400" />
            </div>
            <p className="text-2xl md:text-3xl font-black text-amber-400">{stats.pendingCount}</p>
            <p className="text-xs text-slate-500 mt-1">Checkout opened / awaiting auth</p>
          </div>

          <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-5">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
              <span>Failed / Cancelled</span>
              <XCircle size={16} className="text-red-400" />
            </div>
            <p className="text-2xl md:text-3xl font-black text-red-400">{stats.failedCount}</p>
            <p className="text-xs text-slate-500 mt-1">Declined or closed by student</p>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-900/90 border border-slate-800 rounded-2xl w-full md:w-auto overflow-x-auto">
            {[
              { label: "All Attempts", value: "all" },
              { label: "✓ Success", value: "completed" },
              { label: "⏳ Pending", value: "pending" },
              { label: "✕ Failed", value: "failed" },
              { label: "⊘ Cancelled", value: "cancelled" },
            ].map((tab) => (
              <button
                key={tab.value}
                onClick={() => setStatusFilter(tab.value)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  statusFilter === tab.value
                    ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <form onSubmit={handleSearch} className="flex items-center gap-2 w-full md:w-80">
            <div className="relative flex-1">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Search name, email, order ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder-slate-500 outline-none focus:border-orange-500 transition-colors"
              />
            </div>
            <button
              type="submit"
              className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-white px-3 py-2 rounded-xl text-sm font-bold cursor-pointer"
            >
              Search
            </button>
          </form>
        </div>

        {/* Transactions Table */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-800/60 border-b border-slate-800 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="py-4 px-6">Student Details</th>
                  <th className="py-4 px-4">Tier / Product</th>
                  <th className="py-4 px-4">Amount</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-4">Gateway IDs</th>
                  <th className="py-4 px-4">Date &amp; Time</th>
                  <th className="py-4 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="py-16 text-center text-slate-500 font-medium">
                      <RefreshCw size={24} className="animate-spin mx-auto mb-2 text-orange-400" />
                      Loading transactions...
                    </td>
                  </tr>
                ) : transactions.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-16 text-center text-slate-500 font-medium">
                      No transactions found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-800/30 transition-colors">
                      {/* Student Info */}
                      <td className="py-4 px-6">
                        <div className="font-bold text-white leading-snug">
                          {tx.customerName || "Art Student"}
                        </div>
                        <div className="text-xs text-slate-400">{tx.customerEmail || "No email"}</div>
                        {tx.customerPhone && (
                          <div className="text-[11px] text-slate-500 mt-0.5">{tx.customerPhone}</div>
                        )}
                      </td>

                      {/* Tier */}
                      <td className="py-4 px-4">
                        <span className="font-semibold text-white">{tx.tierName}</span>
                        <div className="text-xs text-orange-400 font-bold">{tx.tierCode}</div>
                      </td>

                      {/* Amount */}
                      <td className="py-4 px-4">
                        <span className="font-black text-white text-base">
                          ₹{tx.amount.toLocaleString("en-IN")}
                        </span>
                        <span className="text-[11px] text-slate-500 block uppercase">{tx.currency}</span>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4">
                        {getStatusBadge(tx.status)}
                        {tx.failureReason && (
                          <p className="text-[11px] text-red-400/90 mt-1 max-w-xs line-clamp-2">
                            {tx.failureReason}
                          </p>
                        )}
                      </td>

                      {/* Order & Payment IDs */}
                      <td className="py-4 px-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-xs text-slate-300 font-mono">
                            <span className="text-slate-500 text-[10px]">ORD:</span>
                            <span className="truncate max-w-[130px]">{tx.orderId}</span>
                            <button
                              onClick={() => copyToClipboard(tx.orderId, `${tx.id}-ord`)}
                              className="text-slate-500 hover:text-white p-0.5 cursor-pointer"
                              title="Copy Order ID"
                            >
                              {copiedId === `${tx.id}-ord` ? (
                                <Check size={12} className="text-emerald-400" />
                              ) : (
                                <Copy size={12} />
                              )}
                            </button>
                          </div>
                          {tx.paymentId && (
                            <div className="flex items-center gap-1 text-xs text-emerald-400 font-mono">
                              <span className="text-slate-500 text-[10px]">PAY:</span>
                              <span className="truncate max-w-[130px]">{tx.paymentId}</span>
                              <button
                                onClick={() => copyToClipboard(tx.paymentId!, `${tx.id}-pay`)}
                                className="text-slate-500 hover:text-white p-0.5 cursor-pointer"
                                title="Copy Payment ID"
                              >
                                {copiedId === `${tx.id}-pay` ? (
                                  <Check size={12} className="text-emerald-400" />
                                ) : (
                                  <Copy size={12} />
                                )}
                              </button>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Date & Time */}
                      <td className="py-4 px-4 text-xs text-slate-400">
                        {new Date(tx.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                        <span className="block text-[11px] text-slate-500">
                          {new Date(tx.createdAt).toLocaleTimeString("en-IN", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="py-4 px-4 text-right">
                        <button
                          onClick={() => deleteTransaction(tx.id)}
                          className="text-slate-600 hover:text-red-400 p-2 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                          title="Delete transaction record"
                        >
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          {transactions.length > 0 && (
            <div className="px-6 py-4 bg-slate-800/40 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
              <Pagination
                page={page}
                totalPages={totalPages}
                total={total}
                limit={limit}
                onPageChange={handlePageChange}
                itemLabel="transactions"
                className="w-full sm:w-auto"
              />
              <span className="font-bold text-white whitespace-nowrap">
                Showing {transactions.length} of {total} records
              </span>
            </div>
          )}
        </div>
      </div>
    )}
      </main>
    </div>
  );
}
