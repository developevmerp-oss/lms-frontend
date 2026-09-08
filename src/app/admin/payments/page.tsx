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
} from "lucide-react";
import { API_BASE_URL } from "@/config/api";

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

  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  const fetchTransactions = async () => {
    setIsLoading(true);
    try {
      const url = new URL(`${API_BASE_URL}/payments/history`);
      if (statusFilter !== "all") url.searchParams.append("status", statusFilter);
      if (searchQuery.trim()) url.searchParams.append("search", searchQuery.trim());

      const res = await fetch(url.toString(), { headers });
      const data = await res.json();
      if (data.success) {
        setTransactions(data.transactions || []);
        if (data.stats) setStats(data.stats);
      }
    } catch (err) {
      console.error("Error fetching payment history:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchTransactions();
    }
  }, [token, statusFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTransactions();
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
              onClick={fetchTransactions}
              className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 px-4 py-2.5 rounded-xl text-sm font-bold transition-colors cursor-pointer"
            >
              <RefreshCw size={15} className={isLoading ? "animate-spin" : ""} /> Refresh
            </button>
          </div>
        </header>

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
            <div className="px-6 py-4 bg-slate-800/40 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>Showing {transactions.length} records</span>
              <span className="font-bold text-white">
                Filtered Total: ₹
                {transactions
                  .filter((t) => t.status === "completed")
                  .reduce((sum, t) => sum + (Number(t.amount) || 0), 0)
                  .toLocaleString("en-IN")}
              </span>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
