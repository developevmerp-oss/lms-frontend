"use client";

import React, { useEffect, useState, useCallback } from "react";
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
  Calendar,
  Send,
  Users,
  Bell,
  BarChart2,
  Hourglass,
  MoreHorizontal,
} from "lucide-react";
import { TableRowSkeleton, StatCardSkeleton } from "@/components/ui/SkeletonLoader";
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

interface InstallmentPlan {
  id: string;
  status: string;
  tierCode?: string;
  tierName?: string;
  frequency?: string;
  paidInstallments: number;
  totalInstallments: number;
  installmentAmount: number;
  totalAmount: number;
  nextDueDate?: string | null;
  lastReminderSentAt?: string | null;
  user?: {
    name?: string | null;
    email?: string | null;
    phone?: string | null;
  } | null;
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
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // Installment Management State
  const [activeMainTab, setActiveMainTab] = useState<"transactions" | "installments">("transactions");
  const [installmentPlans, setInstallmentPlans] = useState<InstallmentPlan[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [remindingId, setRemindingId] = useState<string | null>(null);
  const [nowTimestamp, setNowTimestamp] = useState<number>(0);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNowTimestamp(Date.now());
  }, []);

  const headers = React.useMemo(
    () => ({
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    }),
    [token]
  );

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest(".action-menu-container")) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchTransactions = useCallback(
    async (targetPage = page) => {
      setIsLoading(true);
      try {
        const baseOrigin = typeof window !== "undefined" ? window.location.origin : "https://ravishingarthub.com";
        const url = new URL(`${API_BASE_URL}/payments/history`, baseOrigin);
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
    },
    [page, limit, statusFilter, searchQuery, headers]
  );

  const fetchInstallments = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/payments/installments`, { headers });
      const data = await res.json();
      if (data.success && Array.isArray(data.plans)) {
        setInstallmentPlans(data.plans);
        setNowTimestamp(Date.now());
      }
    } catch (err) {
      console.error("Error fetching admin installments:", err);
    } finally {
      setIsLoading(false);
    }
  }, [headers]);

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
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchTransactions(page);
      } else {
        fetchInstallments();
      }
    }
  }, [token, activeMainTab, statusFilter, page, fetchTransactions, fetchInstallments]);

  const handleStatusFilterChange = (filter: string) => {
    setStatusFilter(filter);
    setPage(1);
  };

  const handleMainTabChange = (tab: "transactions" | "installments") => {
    setActiveMainTab(tab);
    if (tab === "transactions") {
      setPage(1);
    }
  };

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

  const getStatusBadge = (status: string, failureReason?: string | null) => {
    switch (status) {
      case "completed":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#ECFDF5] text-emerald-700 border border-emerald-200">
            <CheckCircle2 size={13} className="text-emerald-600" /> Success
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#FFFBEB] text-amber-700 border border-amber-200">
            <Clock size={13} className="text-amber-600" /> Pending
          </span>
        );
      case "failed":
        return (
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#FEF2F2] text-rose-700 border border-rose-200"
            title={failureReason || undefined}
          >
            <XCircle size={13} className="text-rose-600" /> Failed
          </span>
        );
      case "cancelled":
        return (
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#F5F5F4] text-stone-700 border border-stone-200/80"
            title={failureReason || undefined}
          >
            <AlertTriangle size={13} className="text-stone-500" /> Cancelled
          </span>
        );
      default:
        return <span className="text-xs text-stone-500 uppercase font-semibold">{status}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-stone-900 transition-colors lg:pl-64">
      <AdminNav user={user} logout={logout} />

      <main className="w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Breadcrumb & Page Header - moved to top bar */}
        {/*
        <div className="flex items-center gap-1.5 text-xs text-stone-500 mb-1 font-medium">
          <span>Students &amp; CRM</span>
          <span className="text-stone-300">/</span>
          <span className="text-stone-700 font-medium">Payment Transactions</span>
        </div>
        */}

        {/* Page Header */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-end gap-4 mb-6">
          {/*
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-stone-900 tracking-tight">
              Razorpay Payment &amp; Transactions
            </h1>
            <p className="text-stone-500 text-xs sm:text-sm mt-0.5">
              Complete audit log of all membership checkout attempts with live gateway verification.
            </p>
          </div>
          */}

          <div className="flex items-center gap-3">
            {toastMsg && (
              <span className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold px-3 py-1.5 rounded-xl">
                ✓ {toastMsg}
              </span>
            )}
            <button
              onClick={() => {
                if (activeMainTab === "transactions") fetchTransactions();
                else fetchInstallments();
              }}
              className="flex items-center gap-1.5 bg-white hover:bg-stone-50 border border-stone-200/90 text-stone-700 px-3.5 py-2 rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <RefreshCw size={13} className={isLoading ? "animate-spin" : ""} /> Refresh
            </button>
          </div>
        </header>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-2 sm:gap-3 mb-6 flex-wrap">
          <button
            onClick={() => handleMainTabChange("transactions")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-xs sm:text-sm transition-all cursor-pointer shadow-xs ${
              activeMainTab === "transactions"
                ? "bg-[#B84A1A] text-white"
                : "bg-white border border-stone-200/90 text-stone-700 hover:bg-stone-50"
            }`}
          >
            <CreditCard size={15} /> All Gateway Transactions
          </button>
          <button
            onClick={() => handleMainTabChange("installments")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-xs sm:text-sm transition-all cursor-pointer shadow-xs ${
              activeMainTab === "installments"
                ? "bg-[#B84A1A] text-white"
                : "bg-white border border-stone-200/90 text-stone-700 hover:bg-stone-50"
            }`}
          >
            <Calendar size={15} /> Student Installment Plans
            {installmentPlans.length > 0 && (
              <span className="bg-[#FDF0E9] text-[#C45E32] text-xs px-2 py-0.5 rounded-full font-bold ml-1 border border-[#F6D8C8]">
                {installmentPlans.length}
              </span>
            )}
          </button>
        </div>

        {activeMainTab === "installments" ? (
          <div>
            {/* Installment KPIs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-white border border-stone-200/70 rounded-2xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex items-start justify-between">
                <div>
                  <p className="text-stone-600 text-xs sm:text-sm font-medium">Total Installment Plans</p>
                  <p className="text-2xl sm:text-3xl font-bold text-stone-900 mt-2 tracking-tight">
                    {installmentPlans.length}
                  </p>
                  <p className="text-xs text-stone-400 mt-1 font-normal">Students enrolled on plans</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                  <Users size={18} />
                </div>
              </div>

              <div className="bg-white border border-stone-200/70 rounded-2xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex items-start justify-between">
                <div>
                  <p className="text-stone-600 text-xs sm:text-sm font-medium">Active &amp; On Track</p>
                  <p className="text-2xl sm:text-3xl font-bold text-emerald-600 mt-2 tracking-tight">
                    {installmentPlans.filter((p) => p.status === "active").length}
                  </p>
                  <p className="text-xs text-stone-400 mt-1 font-normal">Currently paying installments</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
                  <Clock size={18} />
                </div>
              </div>

              <div className="bg-white border border-stone-200/70 rounded-2xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex items-start justify-between">
                <div>
                  <p className="text-stone-600 text-xs sm:text-sm font-medium">Fully Completed</p>
                  <p className="text-2xl sm:text-3xl font-bold text-teal-600 mt-2 tracking-tight">
                    {installmentPlans.filter((p) => p.status === "completed").length}
                  </p>
                  <p className="text-xs text-stone-400 mt-1 font-normal">All installments cleared</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-teal-50 text-teal-500 flex items-center justify-center shrink-0">
                  <CheckCircle2 size={18} />
                </div>
              </div>

              <div className="bg-white border border-stone-200/70 rounded-2xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex items-start justify-between">
                <div>
                  <p className="text-stone-600 text-xs sm:text-sm font-medium">Overdue / Attention</p>
                  <p className="text-2xl sm:text-3xl font-bold text-rose-500 mt-2 tracking-tight">
                    {
                      installmentPlans.filter(
                        (p) =>
                          p.status === "overdue" ||
                          (p.nextDueDate &&
                            nowTimestamp > 0 &&
                            new Date(p.nextDueDate).getTime() < nowTimestamp &&
                            p.status !== "completed")
                      ).length
                    }
                  </p>
                  <p className="text-xs text-stone-400 mt-1 font-normal">Due date passed</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center shrink-0">
                  <AlertTriangle size={18} />
                </div>
              </div>
            </div>

            {/* Quick Actions Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-base font-bold text-stone-900">Active Student Installment Agreements</h2>
                <p className="text-xs text-stone-500 font-medium">
                  Automated recurring reminders run daily. You can also trigger manual alerts per student below.
                </p>
              </div>
              <button
                onClick={handleScanReminders}
                disabled={isScanning}
                className="flex items-center gap-2 bg-[#B84A1A] hover:bg-[#A03E14] text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-50"
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
            <div className="bg-white border border-stone-200/70 rounded-2xl shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm min-w-[850px]">
                  <thead className="bg-[#FFFFFF] border-b border-stone-100 text-xs font-semibold text-stone-700">
                    <tr>
                      <th className="py-4 pl-6 pr-4">Student</th>
                      <th className="py-4 px-4">Level / Plan</th>
                      <th className="py-4 px-4">Installment Progress</th>
                      <th className="py-4 px-4">Next Due Date</th>
                      <th className="py-4 px-4">Status</th>
                      <th className="py-4 px-4">Last Reminder</th>
                      <th className="py-4 pr-6 pl-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {isLoading ? (
                    Array.from({ length: 6 }).map((_, i) => (
                      <TableRowSkeleton key={i} cols={7} />
                    ))
                  ) : installmentPlans.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-16 text-center text-stone-400 font-medium">
                          No student installment plans created yet. Once a student chooses installment checkout for Level 3, they will appear here.
                        </td>
                      </tr>
                    ) : (
                      installmentPlans.map((plan) => {
                        const isOverdue =
                          plan.status === "overdue" ||
                          (plan.nextDueDate &&
                            nowTimestamp > 0 &&
                            new Date(plan.nextDueDate).getTime() < nowTimestamp &&
                            plan.status !== "completed");
                        const percentPaid = Math.round(
                          (plan.paidInstallments / plan.totalInstallments) * 100
                        );
                        const studentName = plan.user?.name || "Student";
                        const initial = studentName.trim().charAt(0).toUpperCase() || "S";

                        return (
                          <tr key={plan.id} className="hover:bg-stone-50/50 transition-colors">
                            {/* Student */}
                            <td className="py-4 pl-6 pr-4">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-[#FDF0E9] text-[#C45E32] flex items-center justify-center font-bold text-xs sm:text-sm shrink-0 uppercase">
                                  {initial}
                                </div>
                                <div>
                                  <div className="font-semibold text-stone-900 text-sm leading-tight">
                                    {studentName}
                                  </div>
                                  <div className="text-xs text-stone-500 font-normal mt-0.5">
                                    {plan.user?.email || "No email"}
                                  </div>
                                  {plan.user?.phone && (
                                    <div className="text-xs text-stone-400 mt-0.5">
                                      {plan.user?.phone}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </td>

                            {/* Level / Plan */}
                            <td className="py-4 px-4">
                              <div className="font-semibold text-stone-900 text-sm">
                                {plan.tierName || plan.tierCode}
                              </div>
                              <div className="text-xs text-emerald-600 font-medium capitalize mt-0.5">
                                {plan.frequency ? plan.frequency.replace("_", " ") : "Flexible"} Plan
                              </div>
                            </td>

                            {/* Progress */}
                            <td className="py-4 px-4">
                              <div className="flex items-center justify-between text-xs font-medium mb-1">
                                <span className="text-stone-800">
                                  {plan.paidInstallments} of {plan.totalInstallments} Paid
                                </span>
                                <span className="text-stone-500 font-bold">{percentPaid}%</span>
                              </div>
                              <div className="w-36 h-2 bg-stone-100 rounded-full overflow-hidden mb-1">
                                <div
                                  className={`h-full rounded-full transition-all ${
                                    plan.status === "completed"
                                      ? "bg-teal-500"
                                      : isOverdue
                                      ? "bg-rose-500"
                                      : "bg-emerald-500"
                                  }`}
                                  style={{ width: `${percentPaid}%` }}
                                />
                              </div>
                              <div className="text-xs text-stone-400">
                                ₹{Number(plan.installmentAmount).toLocaleString("en-IN")} / inst • Total: ₹
                                {Number(plan.totalAmount).toLocaleString("en-IN")}
                              </div>
                            </td>

                            {/* Next Due Date */}
                            <td className="py-4 px-4">
                              {plan.status === "completed" ? (
                                <span className="text-xs text-teal-600 font-medium flex items-center gap-1">
                                  <CheckCircle2 size={13} /> Completed
                                </span>
                              ) : plan.nextDueDate ? (
                                <div>
                                  <div
                                    className={`text-xs font-semibold ${
                                      isOverdue ? "text-rose-600 font-bold" : "text-stone-800"
                                    }`}
                                  >
                                    {new Date(plan.nextDueDate).toLocaleDateString("en-IN", {
                                      day: "numeric",
                                      month: "short",
                                      year: "numeric",
                                    })}
                                  </div>
                                  {isOverdue && (
                                    <span className="inline-block text-xs font-bold text-rose-600 bg-rose-50 border border-rose-200 px-1.5 py-0.5 rounded mt-0.5">
                                      Overdue
                                    </span>
                                  )}
                                </div>
                              ) : (
                                <span className="text-xs text-stone-400">—</span>
                              )}
                            </td>

                            {/* Status */}
                            <td className="py-4 px-4">
                              {plan.status === "completed" ? (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-teal-50 text-teal-700 border border-teal-200">
                                  <CheckCircle2 size={12} /> Complete
                                </span>
                              ) : isOverdue ? (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200">
                                  <AlertTriangle size={12} /> Overdue
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                                  <Clock size={12} /> Active
                                </span>
                              )}
                            </td>

                            {/* Last Reminder */}
                            <td className="py-4 px-4 text-xs text-stone-600">
                              {plan.lastReminderSentAt ? (
                                <span>
                                  {new Date(plan.lastReminderSentAt).toLocaleDateString("en-IN", {
                                    day: "numeric",
                                    month: "short",
                                  })}
                                </span>
                              ) : (
                                <span className="text-stone-400 font-normal">None yet</span>
                              )}
                            </td>

                            {/* Actions */}
                            <td className="py-4 pr-6 pl-4 text-right">
                              {plan.status === "completed" ? (
                                <span className="text-xs font-medium text-stone-400">Fully Cleared</span>
                              ) : (
                                <button
                                  onClick={() => handleSendManualReminder(plan.id)}
                                  disabled={remindingId === plan.id}
                                  className="inline-flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer disabled:opacity-50"
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-white border border-stone-200/70 rounded-2xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex items-start justify-between">
                <div>
                  <p className="text-stone-600 text-xs sm:text-sm font-medium">Total Verified Revenue</p>
                  <p className="text-2xl sm:text-3xl font-bold text-emerald-600 mt-2 tracking-tight">
                    ₹{stats.totalRevenue.toLocaleString("en-IN")}
                  </p>
                  <p className="text-xs text-stone-400 mt-1 font-normal">From completed orders</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
                  <BarChart2 size={18} />
                </div>
              </div>

              <div className="bg-white border border-stone-200/70 rounded-2xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex items-start justify-between">
                <div>
                  <p className="text-stone-600 text-xs sm:text-sm font-medium">Successful Orders</p>
                  <p className="text-2xl sm:text-3xl font-bold text-stone-900 mt-2 tracking-tight">
                    {stats.completedCount}
                  </p>
                  <p className="text-xs text-stone-400 mt-1 font-normal">Membership unlocked</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
                  <CheckCircle2 size={18} />
                </div>
              </div>

              <div className="bg-white border border-stone-200/70 rounded-2xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex items-start justify-between">
                <div>
                  <p className="text-stone-600 text-xs sm:text-sm font-medium">Pending Sessions</p>
                  <p className="text-2xl sm:text-3xl font-bold text-amber-500 mt-2 tracking-tight">
                    {stats.pendingCount}
                  </p>
                  <p className="text-xs text-stone-400 mt-1 font-normal">Checkout opened / awaiting auth</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
                  <Hourglass size={18} />
                </div>
              </div>

              <div className="bg-white border border-stone-200/70 rounded-2xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex items-start justify-between">
                <div>
                  <p className="text-stone-600 text-xs sm:text-sm font-medium">Failed / Cancelled</p>
                  <p className="text-2xl sm:text-3xl font-bold text-rose-500 mt-2 tracking-tight">
                    {stats.failedCount}
                  </p>
                  <p className="text-xs text-stone-400 mt-1 font-normal">Declined or closed by student</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center shrink-0">
                  <XCircle size={18} />
                </div>
              </div>
            </div>

            {/* Filter & Search Controls */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-6">
              {/* Filter Tabs */}
              <div className="flex items-center gap-1 overflow-x-auto py-1 scrollbar-none">
                {[
                  { label: "All Attempts", value: "all" },
                  { label: "Success", value: "completed" },
                  { label: "Pending", value: "pending" },
                  { label: "Failed", value: "failed" },
                  { label: "Cancelled", value: "cancelled" },
                ].map((tab) => (
                  <button
                    key={tab.value}
                    onClick={() => handleStatusFilterChange(tab.value)}
                    className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${
                      statusFilter === tab.value
                        ? "bg-[#B84A1A] text-white shadow-xs"
                        : "text-stone-600 hover:text-stone-900 hover:bg-stone-100/60"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Search Box */}
              <form onSubmit={handleSearch} className="w-full md:w-[360px] lg:w-[400px]">
                <div className="bg-white border border-stone-200/90 rounded-2xl flex items-center p-1 pl-3.5 shadow-xs transition-all focus-within:border-[#B84A1A] focus-within:ring-1 focus-within:ring-[#B84A1A]/20">
                  <Search size={16} className="text-stone-400 shrink-0 mr-2" />
                  <input
                    type="text"
                    placeholder="Search by name, email, order ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-transparent text-xs sm:text-sm text-stone-800 placeholder:text-stone-400 outline-none pr-2"
                  />
                  <button
                    type="submit"
                    className="bg-[#B84A1A] hover:bg-[#A03E14] text-white px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer shrink-0"
                  >
                    Search
                  </button>
                </div>
              </form>
            </div>

            {/* Transactions Table */}
            <div className="bg-white border border-stone-200/70 rounded-2xl shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm min-w-[850px]">
                  <thead className="bg-[#FFFFFF] border-b border-stone-100 text-xs font-semibold text-stone-700">
                    <tr>
                      <th className="py-4 pl-6 pr-4">Student Details</th>
                      <th className="py-4 px-4">Tier / Product</th>
                      <th className="py-4 px-4">Amount</th>
                      <th className="py-4 px-4">Status</th>
                      <th className="py-4 px-4">Gateway ID</th>
                      <th className="py-4 px-4">Date &amp; Time</th>
                      <th className="py-4 pr-6 pl-4 text-right"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {isLoading ? (
                    Array.from({ length: 6 }).map((_, i) => (
                      <TableRowSkeleton key={i} cols={7} />
                    ))
                  ) : transactions.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-16 text-center text-stone-400 font-medium">
                          No transactions found matching your criteria.
                        </td>
                      </tr>
                    ) : (
                      transactions.map((tx) => {
                        const studentName = tx.customerName || "Art Student";
                        const initial = studentName.trim().charAt(0).toUpperCase() || "A";

                        return (
                          <tr key={tx.id} className="hover:bg-stone-50/50 transition-colors">
                            {/* Student Info */}
                            <td className="py-4 pl-6 pr-4">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-[#FDF0E9] text-[#C45E32] flex items-center justify-center font-bold text-xs sm:text-sm shrink-0 uppercase">
                                  {initial}
                                </div>
                                <div>
                                  <div className="font-semibold text-stone-900 text-sm leading-tight">
                                    {studentName}
                                  </div>
                                  <div className="text-xs text-stone-500 font-normal mt-0.5">
                                    {tx.customerEmail || "No email"}
                                  </div>
                                  {tx.customerPhone && (
                                    <div className="text-xs text-stone-400 mt-0.5">
                                      {tx.customerPhone}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </td>

                            {/* Tier / Product */}
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-semibold text-stone-900 text-sm">{tx.tierName}</span>
                                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-semibold bg-[#FDF0E9] text-[#C45E32] border border-[#F6D8C8] uppercase tracking-wide">
                                  {tx.tierCode}
                                </span>
                              </div>
                            </td>

                            {/* Amount */}
                            <td className="py-4 px-4">
                              <div className="font-bold text-stone-900 text-sm">
                                ₹{tx.amount.toLocaleString("en-IN")}
                              </div>
                              <div className="text-xs text-stone-400 uppercase font-medium mt-0.5">
                                {tx.currency}
                              </div>
                            </td>

                            {/* Status */}
                            <td className="py-4 px-4">
                              {getStatusBadge(tx.status, tx.failureReason)}
                            </td>

                            {/* Order & Payment IDs */}
                            <td className="py-4 px-4">
                              <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-1.5 text-xs text-stone-700 font-mono">
                                  <span className="truncate max-w-[140px]" title={tx.orderId}>
                                    {tx.orderId}
                                  </span>
                                  <button
                                    onClick={() => copyToClipboard(tx.orderId, `${tx.id}-ord`)}
                                    className="text-stone-400 hover:text-stone-700 transition-colors p-0.5 cursor-pointer"
                                    title="Copy Order ID"
                                  >
                                    {copiedId === `${tx.id}-ord` ? (
                                      <Check size={12} className="text-emerald-500" />
                                    ) : (
                                      <Copy size={12} />
                                    )}
                                  </button>
                                </div>
                                {tx.paymentId && (
                                  <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-mono">
                                    <span className="truncate max-w-[140px]" title={tx.paymentId}>
                                      {tx.paymentId}
                                    </span>
                                    <button
                                      onClick={() => copyToClipboard(tx.paymentId!, `${tx.id}-pay`)}
                                      className="text-stone-400 hover:text-emerald-700 transition-colors p-0.5 cursor-pointer"
                                      title="Copy Payment ID"
                                    >
                                      {copiedId === `${tx.id}-pay` ? (
                                        <Check size={12} className="text-emerald-500" />
                                      ) : (
                                        <Copy size={12} />
                                      )}
                                    </button>
                                  </div>
                                )}
                              </div>
                            </td>

                            {/* Date & Time */}
                            <td className="py-4 px-4">
                              <div className="text-xs font-medium text-stone-700">
                                {new Date(tx.createdAt).toLocaleDateString("en-IN", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                })}
                              </div>
                              <div className="text-xs text-stone-400 font-normal mt-0.5">
                                {new Date(tx.createdAt).toLocaleTimeString("en-IN", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  hour12: true,
                                })}
                              </div>
                            </td>

                            {/* Actions */}
                            <td className="py-4 pr-6 pl-4 text-right">
                              <div className="relative inline-block text-right action-menu-container">
                                <button
                                  onClick={() => setOpenMenuId(openMenuId === tx.id ? null : tx.id)}
                                  className="text-stone-400 hover:text-stone-700 p-1.5 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
                                  title="Actions"
                                >
                                  <MoreHorizontal size={16} />
                                </button>
                                {openMenuId === tx.id && (
                                  <div className="absolute right-0 top-full mt-1 w-44 bg-white border border-stone-200/90 rounded-xl shadow-lg py-1.5 z-20 text-left">
                                    <button
                                      onClick={() => {
                                        copyToClipboard(tx.orderId, `${tx.id}-ord`);
                                        setOpenMenuId(null);
                                      }}
                                      className="w-full flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-stone-700 hover:bg-stone-50 cursor-pointer"
                                    >
                                      <Copy size={13} className="text-stone-400" /> Copy Order ID
                                    </button>
                                    {tx.paymentId && (
                                      <button
                                        onClick={() => {
                                          copyToClipboard(tx.paymentId!, `${tx.id}-pay`);
                                          setOpenMenuId(null);
                                        }}
                                        className="w-full flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-stone-700 hover:bg-stone-50 cursor-pointer"
                                      >
                                        <Copy size={13} className="text-emerald-500" /> Copy Payment ID
                                      </button>
                                    )}
                                    <div className="my-1 border-t border-stone-100" />
                                    <button
                                      onClick={() => {
                                        setOpenMenuId(null);
                                        deleteTransaction(tx.id);
                                      }}
                                      className="w-full flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 cursor-pointer"
                                    >
                                      <Trash2 size={13} /> Delete Record
                                    </button>
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Table Footer */}
              {transactions.length > 0 && (
                <div className="px-6 py-4 bg-white border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500 font-medium">
                  <Pagination
                    page={page}
                    totalPages={totalPages}
                    total={total}
                    limit={limit}
                    onPageChange={handlePageChange}
                    itemLabel="transactions"
                    className="w-full sm:w-auto"
                  />
                  <span className="font-semibold text-stone-700 whitespace-nowrap">
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
