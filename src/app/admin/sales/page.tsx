"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { AdminNav } from "@/components/layout/AdminNav";
import { IndianRupee, Trash2, TrendingUp, BarChart2, Info, ShieldCheck } from "lucide-react";

import { API_BASE_URL } from "@/config/api";

export default function AdminSalesRecords() {
  const { token, user, logout } = useAuth();
  const [students, setStudents] = useState<any[]>([]);
  const [allSales, setAllSales] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStudentId, setSelectedStudentId] = useState("all");
  const [successMsg, setSuccessMsg] = useState("");

  const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
  const API = API_BASE_URL;

  const fetchData = async () => {
    try {
      const res = await fetch(`${API}/admin/students`, { headers });
      const data = await res.json();
      if (Array.isArray(data)) {
        setStudents(data);
        const sales = data.flatMap((s: any) =>
          (s.salesRecords || []).map((r: any) => ({ ...r, studentName: s.name, studentId: s.id }))
        ).sort((a: any, b: any) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime());
        setAllSales(sales);
      }
    } catch (err) { console.error(err); }
    setIsLoading(false);
  };

  useEffect(() => { if (token) fetchData(); }, [token]);

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  const deleteSale = async (recordId: string) => {
    if (!confirm("Delete this sales record from the platform?")) return;
    await fetch(`${API}/admin/sales/${recordId}`, { method: 'DELETE', headers });
    await fetchData();
    showSuccess("Sales record deleted!");
  };

  const displayedSales = allSales.filter(s => selectedStudentId === "all" || s.studentId === selectedStudentId);
  const totalRevenue = displayedSales.reduce((sum, s) => sum + (s.amount || 0), 0);
  const totalAll = allSales.reduce((sum, s) => sum + (s.amount || 0), 0);
  const avgSale = displayedSales.length > 0 ? totalRevenue / displayedSales.length : 0;

  return (
    <div
      className="min-h-screen bg-[#faf8f5] text-stone-900 transition-colors lg:pl-64"
      style={{
        backgroundColor: "#faf8f5",
        backgroundImage: "radial-gradient(circle, #e2ded4 1.5px, transparent 1.5px)",
        backgroundSize: "24px 24px",
        backgroundAttachment: "fixed",
      }}
    >
      <AdminNav user={user} logout={logout} />

      <main className="w-full px-4 sm:px-5 lg:px-5 py-5 sm:py-6">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-stone-500 mb-1 font-medium">
              <span>Students &amp; CRM</span>
              <span className="text-stone-300">/</span>
              <span className="text-stone-700 font-medium">Student Revenue &amp; Sales</span>
            </div>
            <h1 className="text-2xl sm:text-[28px] font-bold text-stone-900 tracking-tight">
              {/* <IndianRupee className="text-green-500" /> */} Student Revenue &amp; Sales Monitor
            </h1>
            <p className="text-stone-500 text-xs sm:text-sm mt-0.5">
              Review live client orders and commercial revenue logged directly by students.
            </p>
          </div>
          {successMsg && (
            <span className="bg-green-500/10 border border-green-500/30 text-green-400 text-sm font-bold px-4 py-2 rounded-full self-start md:self-auto">
              ✓ {successMsg}
            </span>
          )}
        </header>

        {/* Info Note: Student Self-Reporting */}
        <div className="mb-6 p-4 rounded-2xl bg-[#fff5ee] border border-[#f5ded0] text-[#942008] text-xs md:text-sm font-semibold flex items-center gap-3">
          <Info size={18} className="text-[#c4431d] shrink-0" />
          <span>
            <strong>Student Self-Reported Sales:</strong> Revenue records are entered directly by students through the <strong>Northstar Tracking System (/student/northstar)</strong> and the <strong>Win Wall</strong>. Admin has read-only oversight with moderation controls.
          </span>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Platform Revenue", value: `₹${totalAll.toLocaleString('en-IN')}`, color: "text-green-400", icon: <TrendingUp size={20} /> },
            { label: "Filtered Revenue", value: `₹${totalRevenue.toLocaleString('en-IN')}`, color: "text-stone-900", icon: <IndianRupee size={20} /> },
            { label: "Total Transactions", value: displayedSales.length, color: "text-[#c4431d]", icon: <BarChart2 size={20} /> },
            { label: "Avg Sale Value", value: `₹${Math.round(avgSale).toLocaleString('en-IN')}`, color: "text-blue-400", icon: <IndianRupee size={20} /> },
          ].map(stat => (
            <div key={stat.label} className="bg-white/95 border border-[#ecdccb] rounded-2xl p-5 shadow-[0_4px_16px_-4px_rgba(45,30,15,0.06)]">
              <div className="flex items-center gap-2 text-stone-500 text-sm mb-2 font-semibold">
                {stat.icon} {stat.label}
              </div>
              <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Filter */}
        <div className="flex items-center gap-3 mb-4">
          <span className="text-stone-600 text-sm font-bold">Filter by student:</span>
          <select value={selectedStudentId} onChange={e => setSelectedStudentId(e.target.value)}
            className="bg-[#fcfaf7] border border-stone-300 rounded-xl px-4 py-2 text-stone-900 text-sm outline-none focus:border-[#c4431d] focus:ring-1 focus:ring-[#c4431d]/30 transition-colors">
            <option value="all">All Students ({allSales.length} total entries)</option>
            {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>

        {/* Sales Table */}
        <div className="bg-white/95 border border-[#ecdccb] rounded-3xl overflow-hidden shadow-[0_10px_30px_-12px_rgba(90,55,20,0.08)]">
          <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-[#fcfaf7] border-b border-stone-200 text-xs font-bold text-stone-600 uppercase tracking-wider">
            <div className="col-span-4">Product / Commission</div>
            <div className="col-span-3">Student</div>
            <div className="col-span-2 text-right">Amount</div>
            <div className="col-span-2">Date</div>
            <div className="col-span-1 text-right">Action</div>
          </div>

          {isLoading ? (
            <div className="p-12 text-center text-stone-400 font-medium">Loading student records...</div>
          ) : displayedSales.length === 0 ? (
            <div className="p-12 text-center text-stone-400 font-medium">No sales records found.</div>
          ) : (
            <div className="divide-y divide-stone-100">
              {displayedSales.map(s => (
                <div key={s.id} className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-[#fff5ee]/60 transition-colors">
                  <div className="col-span-4 font-semibold text-stone-900">{s.productName}</div>
                  <div className="col-span-3 flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#942008] via-[#c4431d] to-[#ea580c] flex items-center justify-center text-xs font-bold text-white shadow-xs">
                      {s.studentName?.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-stone-700 text-sm font-semibold">{s.studentName}</span>
                  </div>
                  <div className="col-span-2 text-right font-black text-green-400">₹{(s.amount || 0).toLocaleString('en-IN')}</div>
                  <div className="col-span-2 text-stone-500 text-sm">
                    {s.date ? new Date(s.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                  </div>
                  <div className="col-span-1 flex justify-end">
                    <button
                      onClick={() => deleteSale(s.id)}
                      className="text-stone-400 hover:text-rose-600 transition-colors p-1.5 cursor-pointer"
                      title="Delete entry"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {displayedSales.length > 0 && (
            <div className="px-6 py-4 bg-[#fcfaf7] border-t border-stone-200 flex justify-between items-center">
              <span className="text-stone-500 font-bold">{displayedSales.length} transactions</span>
              <span className="font-black text-stone-900 text-lg">Total: ₹{totalRevenue.toLocaleString('en-IN')}</span>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
