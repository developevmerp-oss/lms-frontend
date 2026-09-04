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
    <div className="min-h-screen bg-slate-950 text-white">
      <AdminNav user={user} logout={logout} />

      <main className="max-w-[1400px] mx-auto p-4 md:p-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <IndianRupee className="text-green-500" /> Student Revenue &amp; Sales Monitor
            </h1>
            <p className="text-slate-400 mt-2">
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
        <div className="mb-6 p-4 rounded-2xl bg-orange-500/10 border border-orange-500/30 text-orange-300 text-xs md:text-sm font-semibold flex items-center gap-3">
          <Info size={18} className="text-orange-400 shrink-0" />
          <span>
            <strong>Student Self-Reported Sales:</strong> Revenue records are entered directly by students through the <strong>Northstar Tracking System (/student/northstar)</strong> and the <strong>Win Wall</strong>. Admin has read-only oversight with moderation controls.
          </span>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Platform Revenue", value: `₹${totalAll.toLocaleString('en-IN')}`, color: "text-green-400", icon: <TrendingUp size={20} /> },
            { label: "Filtered Revenue", value: `₹${totalRevenue.toLocaleString('en-IN')}`, color: "text-white", icon: <IndianRupee size={20} /> },
            { label: "Total Transactions", value: displayedSales.length, color: "text-orange-400", icon: <BarChart2 size={20} /> },
            { label: "Avg Sale Value", value: `₹${Math.round(avgSale).toLocaleString('en-IN')}`, color: "text-blue-400", icon: <IndianRupee size={20} /> },
          ].map(stat => (
            <div key={stat.label} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
              <div className="flex items-center gap-2 text-slate-500 text-sm mb-2">
                {stat.icon} {stat.label}
              </div>
              <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Filter */}
        <div className="flex items-center gap-3 mb-4">
          <span className="text-slate-500 text-sm">Filter by student:</span>
          <select value={selectedStudentId} onChange={e => setSelectedStudentId(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-white text-sm outline-none focus:border-orange-500">
            <option value="all">All Students ({allSales.length} total entries)</option>
            {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>

        {/* Sales Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
          <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-slate-800/50 border-b border-slate-800 text-xs font-bold text-slate-400 uppercase tracking-wider">
            <div className="col-span-4">Product / Commission</div>
            <div className="col-span-3">Student</div>
            <div className="col-span-2 text-right">Amount</div>
            <div className="col-span-2">Date</div>
            <div className="col-span-1 text-right">Action</div>
          </div>

          {isLoading ? (
            <div className="p-12 text-center text-slate-500">Loading student records...</div>
          ) : displayedSales.length === 0 ? (
            <div className="p-12 text-center text-slate-500">No sales records found.</div>
          ) : (
            <div className="divide-y divide-slate-800">
              {displayedSales.map(s => (
                <div key={s.id} className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-slate-800/30 transition-colors">
                  <div className="col-span-4 font-semibold text-white">{s.productName}</div>
                  <div className="col-span-3 flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-orange-400">
                      {s.studentName?.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-slate-400 text-sm">{s.studentName}</span>
                  </div>
                  <div className="col-span-2 text-right font-black text-green-400">₹{(s.amount || 0).toLocaleString('en-IN')}</div>
                  <div className="col-span-2 text-slate-500 text-sm">
                    {s.date ? new Date(s.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                  </div>
                  <div className="col-span-1 flex justify-end">
                    <button
                      onClick={() => deleteSale(s.id)}
                      className="text-slate-600 hover:text-red-400 transition-colors p-1.5 cursor-pointer"
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
            <div className="px-6 py-4 bg-slate-800/30 border-t border-slate-800 flex justify-between items-center">
              <span className="text-slate-400 font-medium">{displayedSales.length} transactions</span>
              <span className="font-black text-white text-lg">Total: ₹{totalRevenue.toLocaleString('en-IN')}</span>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
