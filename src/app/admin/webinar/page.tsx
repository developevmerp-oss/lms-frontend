"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { AdminNav } from "@/components/layout/AdminNav";
import { API_BASE_URL } from "@/config/api";
import {
  Users,
  Search,
  Download,
  Flame,
  CheckCircle2,
  Trash2,
  MessageCircle,
  ExternalLink,
  RefreshCw,
  Clock,
  Sparkles,
  Calendar,
  AlertCircle
} from "lucide-react";

export default function AdminWebinarCRM() {
  const { user, token, logout } = useAuth();
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({
    totalRegistrations: 0,
    dynamicRegistered: 0,
    seatsRemaining: 500,
    percentFull: 0,
  });
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchRegistrations = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/webinar/registrations?search=${encodeURIComponent(search)}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setRegistrations(data.data || []);
      }
    } catch (err) {
      console.error("Failed to fetch registrations:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/webinar/stats`);
      const data = await res.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (_) {}
  };

  useEffect(() => {
    if (token) {
      fetchRegistrations();
      fetchStats();
    }
  }, [token]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchRegistrations();
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this webinar registration?")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`${API_BASE_URL}/webinar/registrations/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setRegistrations(prev => prev.filter(r => r.id !== id));
        fetchStats();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

  const exportCSV = () => {
    if (registrations.length === 0) return;

    const headers = ["Name", "Email", "Phone", "Challenge", "Registered Date", "Source"];
    const rows = registrations.map(r => [
      `"${(r.name || "").replace(/"/g, '""')}"`,
      `"${(r.email || "").replace(/"/g, '""')}"`,
      `"${(r.phone || "").replace(/"/g, '""')}"`,
      `"${(r.challenge || "").replace(/"/g, '""')}"`,
      `"${new Date(r.createdAt).toLocaleString()}"`,
      `"${r.source || "organic"}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `webinar_leads_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-orange-500 selection:text-white">
      <AdminNav user={user} logout={logout} />

      <main className="max-w-7xl mx-auto px-6 py-10 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-bold uppercase tracking-widest px-3.5 py-1 rounded-full mb-2">
              <Sparkles size={12} /> Masterclass Marketing Funnel
            </div>
            <h1 className="text-3xl font-black text-white">Webinar Registrations & Leads</h1>
            <p className="text-slate-400 text-sm mt-1">
              Live registrations from <strong className="text-white">ravishingartwebinar.lovable.app</strong> &amp; <strong className="text-white">/webinar</strong>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={exportCSV}
              disabled={registrations.length === 0}
              className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-sm rounded-xl transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              <Download size={16} /> Export to CSV
            </button>
            <a
              href="/webinar"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm rounded-xl border border-slate-700 transition-all flex items-center gap-2"
            >
              Preview Webinar Funnel <ExternalLink size={14} />
            </a>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Database Leads</p>
            <p className="text-3xl font-black text-white">{stats.totalRegistrations}</p>
            <p className="text-[11px] text-emerald-400 font-medium mt-1">Synced with PostgreSQL</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Room Capacity</p>
            <p className="text-3xl font-black text-orange-400">{stats.dynamicRegistered} / 500</p>
            <p className="text-[11px] text-orange-400 font-medium mt-1">{stats.percentFull}% Capacity Filled</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Seats Remaining</p>
            <p className="text-3xl font-black text-emerald-400">{stats.seatsRemaining}</p>
            <p className="text-[11px] text-slate-400 font-medium mt-1">Live scarcity trigger</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Session Date</p>
            <p className="text-xl font-black text-amber-300 mt-1">Sunday · 8:00 PM</p>
            <p className="text-[11px] text-slate-400 font-medium mt-1">Zoom Live Broadcast</p>
          </div>
        </div>

        {/* Search & Refresh Toolbar */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-80">
            <input
              type="text"
              placeholder="Search by name, email, phone..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 pl-10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
            />
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          </form>

          <button
            onClick={() => { fetchRegistrations(); fetchStats(); }}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 flex items-center gap-2 cursor-pointer transition-colors"
          >
            <RefreshCw size={13} className={loading ? "animate-spin" : ""} /> Refresh Leads
          </button>
        </div>

        {/* Registrations Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-950/80 border-b border-slate-800 text-xs font-bold uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="p-4 pl-6">Registrant</th>
                  <th className="p-4">WhatsApp Phone</th>
                  <th className="p-4">Biggest Challenge / Goals</th>
                  <th className="p-4">Date Registered</th>
                  <th className="p-4 text-right pr-6">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-400">
                      Loading webinar registrations...
                    </td>
                  </tr>
                ) : registrations.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-12 text-center text-slate-400">
                      <Users size={32} className="mx-auto text-slate-600 mb-2" />
                      <p className="font-bold text-white">No registrations found</p>
                      <p className="text-xs mt-1">Leads from the webinar landing page will automatically appear here.</p>
                    </td>
                  </tr>
                ) : (
                  registrations.map(r => {
                    const cleanPhoneDigits = (r.phone || "").replace(/\D/g, "");
                    const whatsappLink = `https://wa.me/${cleanPhoneDigits.length === 10 ? "91" + cleanPhoneDigits : cleanPhoneDigits}`;

                    return (
                      <tr key={r.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="p-4 pl-6">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-orange-500 to-amber-400 flex items-center justify-center font-bold text-slate-950 text-xs shrink-0">
                              {(r.name || "A")[0]}
                            </div>
                            <div>
                              <p className="font-bold text-white">{r.name}</p>
                              <p className="text-xs text-slate-400">{r.email}</p>
                            </div>
                          </div>
                        </td>

                        <td className="p-4 font-mono text-xs text-slate-300">
                          {r.phone}
                        </td>

                        <td className="p-4 text-xs text-slate-300 max-w-xs">
                          {r.challenge ? (
                            <span className="line-clamp-2">{r.challenge}</span>
                          ) : (
                            <span className="text-slate-500 italic">Not specified</span>
                          )}
                        </td>

                        <td className="p-4 text-xs text-slate-400">
                          {new Date(r.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </td>

                        <td className="p-4 pr-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <a
                              href={whatsappLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 transition-colors"
                              title="Chat on WhatsApp"
                            >
                              <MessageCircle size={15} />
                            </a>
                            <button
                              onClick={() => handleDelete(r.id)}
                              disabled={deletingId === r.id}
                              className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-colors cursor-pointer"
                              title="Delete registration"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
