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
  AlertCircle,
  Plus,
  Edit,
  Video,
  Link as LinkIcon,
  Check,
  X
} from "lucide-react";

export default function AdminWebinarCRM() {
  const { user, token, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<"events" | "registrations">("events");

  // Webinar Events State
  const [events, setEvents] = useState<any[]>([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any>(null);
  const [eventForm, setEventForm] = useState({
    title: "Resin Mastery Masterclass — Live with Vrajangna Patel",
    scheduledAt: "",
    durationMinutes: 90,
    zoomJoinUrl: "",
    whatsappGroupUrl: "",
    prepVideoUrl: "",
    totalSeats: 500,
    status: "upcoming",
    isActive: true,
  });

  // Registrations State
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [selectedEventFilter, setSelectedEventFilter] = useState<string>("");
  const [stats, setStats] = useState<any>({
    totalRegistrations: 0,
    dynamicRegistered: 0,
    seatsRemaining: 500,
    percentFull: 0,
  });
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchEvents = async () => {
    setEventsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/webinar/events`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setEvents(data.data || []);
      }
    } catch (err) {
      console.error("Failed to fetch webinar events:", err);
    } finally {
      setEventsLoading(false);
    }
  };

  const fetchRegistrations = async () => {
    setLoading(true);
    try {
      let url = `${API_BASE_URL}/webinar/registrations?search=${encodeURIComponent(search)}`;
      if (selectedEventFilter) {
        url += `&webinarEventId=${encodeURIComponent(selectedEventFilter)}`;
      }
      const res = await fetch(url, {
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
      fetchEvents();
      fetchRegistrations();
      fetchStats();
    }
  }, [token, selectedEventFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchRegistrations();
  };

  const handleOpenCreateModal = () => {
    setEditingEvent(null);
    // Default to next upcoming Sunday 8:00 PM
    const nextSunday = new Date();
    const day = nextSunday.getDay();
    const diff = (7 - day) % 7;
    nextSunday.setDate(nextSunday.getDate() + (diff === 0 ? 7 : diff));
    nextSunday.setHours(20, 0, 0, 0);

    // Format for datetime-local: YYYY-MM-DDTHH:mm
    const tzOffset = nextSunday.getTimezoneOffset() * 60000;
    const localISOTime = new Date(nextSunday.getTime() - tzOffset).toISOString().slice(0, 16);

    setEventForm({
      title: "Resin Mastery Masterclass — Live with Vrajangna Patel",
      scheduledAt: localISOTime,
      durationMinutes: 90,
      zoomJoinUrl: "",
      whatsappGroupUrl: "https://chat.whatsapp.com/sample-art-webinar-vip",
      prepVideoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      totalSeats: 500,
      status: "upcoming",
      isActive: true,
    });
    setIsEventModalOpen(true);
  };

  const handleOpenEditModal = (event: any) => {
    setEditingEvent(event);
    const dateObj = new Date(event.scheduledAt);
    const tzOffset = dateObj.getTimezoneOffset() * 60000;
    const localISOTime = new Date(dateObj.getTime() - tzOffset).toISOString().slice(0, 16);

    setEventForm({
      title: event.title,
      scheduledAt: localISOTime,
      durationMinutes: event.durationMinutes || 90,
      zoomJoinUrl: event.zoomJoinUrl || "",
      whatsappGroupUrl: event.whatsappGroupUrl || "",
      prepVideoUrl: event.prepVideoUrl || "",
      totalSeats: event.totalSeats || 500,
      status: event.status || "upcoming",
      isActive: event.isActive !== undefined ? event.isActive : true,
    });
    setIsEventModalOpen(true);
  };

  const handleSaveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = editingEvent ? "PUT" : "POST";
      const url = editingEvent
        ? `${API_BASE_URL}/webinar/events/${editingEvent.id}`
        : `${API_BASE_URL}/webinar/events`;

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(eventForm),
      });

      if (res.ok) {
        setIsEventModalOpen(false);
        fetchEvents();
      }
    } catch (err) {
      console.error("Save event error:", err);
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this scheduled webinar?")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/webinar/events/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setEvents(prev => prev.filter(e => e.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteRegistration = async (id: string) => {
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

    const headers = ["Name", "Email", "Phone", "City", "Webinar Session", "Challenge", "Date Registered", "Source"];
    const rows = registrations.map(r => [
      `"${(r.name || "").replace(/"/g, '""')}"`,
      `"${(r.email || "").replace(/"/g, '""')}"`,
      `"${(r.phone || "").replace(/"/g, '""')}"`,
      `"${(r.city || "").replace(/"/g, '""')}"`,
      `"${(r.webinarEvent?.title || "Upcoming Masterclass").replace(/"/g, '""')}"`,
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
              <Sparkles size={12} /> Masterclass Marketing Engine
            </div>
            <h1 className="text-3xl font-black text-white">Webinar Management &amp; Leads CRM</h1>
            <p className="text-slate-400 text-sm mt-1">
              Schedule future webinar sessions, update Zoom &amp; WhatsApp links, and manage leads.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleOpenCreateModal}
              className="px-4 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:opacity-95 text-slate-950 font-black text-sm rounded-xl transition-all shadow-lg shadow-orange-500/20 flex items-center gap-2 cursor-pointer"
            >
              <Plus size={16} /> Schedule New Webinar
            </button>
            <a
              href="/webinar"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm rounded-xl border border-slate-700 transition-all flex items-center gap-2"
            >
              Live Funnel <ExternalLink size={14} />
            </a>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Scheduled Webinars</p>
            <p className="text-3xl font-black text-white">{events.length}</p>
            <p className="text-[11px] text-orange-400 font-medium mt-1">Active upcoming sessions</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Database Leads</p>
            <p className="text-3xl font-black text-emerald-400">{stats.totalRegistrations}</p>
            <p className="text-[11px] text-slate-400 font-medium mt-1">Synced with PostgreSQL</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Next Session</p>
            <p className="text-xl font-black text-amber-300 mt-1">
              {events[0]
                ? new Date(events[0].scheduledAt).toLocaleDateString("en-IN", {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "Sunday · 8:00 PM"}
            </p>
            <p className="text-[11px] text-slate-400 font-medium mt-1">Countdown active</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Capacity Filled</p>
            <p className="text-3xl font-black text-orange-400">{stats.percentFull}%</p>
            <p className="text-[11px] text-slate-400 font-medium mt-1">{stats.seatsRemaining} seats left</p>
          </div>
        </div>

        {/* View Tabs */}
        <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
          <button
            onClick={() => setActiveTab("events")}
            className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "events"
                ? "bg-orange-500 text-slate-950 shadow-md shadow-orange-500/20"
                : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
            }`}
          >
            <Calendar size={16} /> Scheduled Webinars ({events.length})
          </button>
          <button
            onClick={() => setActiveTab("registrations")}
            className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "registrations"
                ? "bg-orange-500 text-slate-950 shadow-md shadow-orange-500/20"
                : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
            }`}
          >
            <Users size={16} /> Registrations &amp; Leads ({registrations.length})
          </button>
        </div>

        {/* ─── TAB 1: SCHEDULED WEBINARS LIST ─── */}
        {activeTab === "events" && (
          <div className="space-y-4">
            {eventsLoading ? (
              <div className="p-12 text-center text-slate-400 bg-slate-900 border border-slate-800 rounded-3xl">
                Loading scheduled webinars...
              </div>
            ) : events.length === 0 ? (
              <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-3xl space-y-3">
                <Calendar size={36} className="mx-auto text-slate-600" />
                <h3 className="text-lg font-bold text-white">No custom webinars scheduled yet</h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  The frontend is currently using the default recurring Sunday 8:00 PM schedule. Click below to schedule a custom webinar date with Zoom &amp; WhatsApp links!
                </p>
                <button
                  onClick={handleOpenCreateModal}
                  className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-slate-950 font-bold text-xs rounded-xl shadow-md cursor-pointer inline-flex items-center gap-1.5"
                >
                  <Plus size={14} /> Schedule First Webinar
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {events.map((e) => {
                  const date = new Date(e.scheduledAt);
                  const isUpcoming = date.getTime() > Date.now();

                  return (
                    <div
                      key={e.id}
                      className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4 relative overflow-hidden flex flex-col justify-between hover:border-slate-700 transition-colors"
                    >
                      <div className="space-y-3">
                        <div className="flex justify-between items-start gap-3">
                          <span
                            className={`text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full border ${
                              e.status === "live"
                                ? "bg-red-500/20 text-red-400 border-red-500/30 animate-pulse"
                                : isUpcoming
                                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                                : "bg-slate-800 text-slate-400 border-slate-700"
                            }`}
                          >
                            {e.status === "live" ? "🔴 Live Broadcast" : isUpcoming ? "🟢 Upcoming Session" : "Completed"}
                          </span>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleOpenEditModal(e)}
                              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors cursor-pointer"
                              title="Edit Webinar"
                            >
                              <Edit size={14} />
                            </button>
                            <button
                              onClick={() => handleDeleteEvent(e.id)}
                              className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-colors cursor-pointer"
                              title="Delete Webinar"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>

                        <h3 className="text-lg font-black text-white">{e.title}</h3>

                        <div className="space-y-1.5 text-xs text-slate-300">
                          <p className="flex items-center gap-2">
                            <Clock size={14} className="text-orange-400 shrink-0" />
                            <strong>Date &amp; Time:</strong>{" "}
                            {date.toLocaleDateString("en-IN", {
                              weekday: "long",
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}{" "}
                            ({e.durationMinutes || 90} Mins)
                          </p>

                          <p className="flex items-center gap-2">
                            <Users size={14} className="text-emerald-400 shrink-0" />
                            <strong>Registered Attendees:</strong> {e.attendeesCount || 0} / {e.totalSeats || 500} seats
                          </p>

                          {e.zoomJoinUrl && (
                            <p className="flex items-center gap-2 truncate">
                              <Video size={14} className="text-blue-400 shrink-0" />
                              <strong>Zoom Link:</strong>{" "}
                              <a href={e.zoomJoinUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline truncate">
                                {e.zoomJoinUrl}
                              </a>
                            </p>
                          )}

                          {e.whatsappGroupUrl && (
                            <p className="flex items-center gap-2 truncate">
                              <MessageCircle size={14} className="text-green-400 shrink-0" />
                              <strong>WhatsApp Group:</strong>{" "}
                              <a href={e.whatsappGroupUrl} target="_blank" rel="noopener noreferrer" className="text-green-400 underline truncate">
                                {e.whatsappGroupUrl}
                              </a>
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-800 flex justify-between items-center text-xs">
                        <span className="text-slate-500">Created: {new Date(e.createdAt).toLocaleDateString()}</span>
                        <button
                          onClick={() => {
                            setSelectedEventFilter(e.id);
                            setActiveTab("registrations");
                          }}
                          className="text-orange-400 hover:text-orange-300 font-bold flex items-center gap-1 cursor-pointer"
                        >
                          View Leads ({e.attendeesCount || 0}) →
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ─── TAB 2: REGISTRATIONS CRM TABLE ─── */}
        {activeTab === "registrations" && (
          <div className="space-y-4">
            {/* Search, Filter & Export Toolbar */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-72">
                  <input
                    type="text"
                    placeholder="Search by name, email, phone, city..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 pl-10 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                  />
                  <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                </form>

                <select
                  value={selectedEventFilter}
                  onChange={e => setSelectedEventFilter(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-orange-500 w-full sm:w-auto"
                >
                  <option value="">All Webinar Sessions</option>
                  {events.map(ev => (
                    <option key={ev.id} value={ev.id}>
                      {ev.title} ({new Date(ev.scheduledAt).toLocaleDateString()})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  onClick={exportCSV}
                  disabled={registrations.length === 0}
                  className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-md flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                >
                  <Download size={14} /> Export CSV
                </button>
                <button
                  onClick={() => { fetchRegistrations(); fetchStats(); }}
                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw size={13} className={loading ? "animate-spin" : ""} /> Refresh
                </button>
              </div>
            </div>

            {/* Registrations Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-950/80 border-b border-slate-800 text-xs font-bold uppercase tracking-wider text-slate-400">
                    <tr>
                      <th className="p-4 pl-6">Registrant</th>
                      <th className="p-4">WhatsApp Phone</th>
                      <th className="p-4">City / Location</th>
                      <th className="p-4">Session</th>
                      <th className="p-4">Challenge</th>
                      <th className="p-4">Date</th>
                      <th className="p-4 text-right pr-6">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {loading ? (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-slate-400">
                          Loading registrations...
                        </td>
                      </tr>
                    ) : registrations.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-12 text-center text-slate-400">
                          <Users size={32} className="mx-auto text-slate-600 mb-2" />
                          <p className="font-bold text-white">No registrations found</p>
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

                            <td className="p-4 text-xs text-slate-300">
                              {r.city ? (
                                <span className="bg-slate-800 text-orange-400 font-semibold px-2 py-0.5 rounded-md">
                                  {r.city}
                                </span>
                              ) : (
                                <span className="text-slate-500">—</span>
                              )}
                            </td>

                            <td className="p-4 text-xs text-slate-300">
                              {r.webinarEvent?.title ? (
                                <span className="truncate max-w-[150px] block">{r.webinarEvent.title}</span>
                              ) : (
                                <span className="text-slate-500">Upcoming Live</span>
                              )}
                            </td>

                            <td className="p-4 text-xs text-slate-300 max-w-xs">
                              {r.challenge ? (
                                <span className="line-clamp-1">{r.challenge}</span>
                              ) : (
                                <span className="text-slate-500 italic">—</span>
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
                                  onClick={() => handleDeleteRegistration(r.id)}
                                  disabled={deletingId === r.id}
                                  className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-colors cursor-pointer"
                                  title="Delete lead"
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
          </div>
        )}
      </main>

      {/* ─── CREATE / EDIT WEBINAR MODAL ─── */}
      {isEventModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl relative text-white max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsEventModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white"
            >
              <X size={20} />
            </button>

            <h2 className="text-xl font-bold mb-1">
              {editingEvent ? "Edit Scheduled Webinar" : "Schedule New Webinar"}
            </h2>
            <p className="text-xs text-slate-400 mb-6">
              Configure session date, Zoom link, and WhatsApp group for students.
            </p>

            <form onSubmit={handleSaveEvent} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Webinar Title *
                </label>
                <input
                  type="text"
                  value={eventForm.title}
                  onChange={e => setEventForm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-orange-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Date &amp; Time *
                  </label>
                  <input
                    type="datetime-local"
                    value={eventForm.scheduledAt}
                    onChange={e => setEventForm(prev => ({ ...prev, scheduledAt: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-orange-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Duration (Minutes)
                  </label>
                  <input
                    type="number"
                    value={eventForm.durationMinutes}
                    onChange={e => setEventForm(prev => ({ ...prev, durationMinutes: parseInt(e.target.value, 10) }))}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Zoom Meeting / Broadcast URL
                </label>
                <input
                  type="url"
                  placeholder="https://zoom.us/j/..."
                  value={eventForm.zoomJoinUrl}
                  onChange={e => setEventForm(prev => ({ ...prev, zoomJoinUrl: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                  WhatsApp VIP Community Invite URL
                </label>
                <input
                  type="url"
                  placeholder="https://chat.whatsapp.com/..."
                  value={eventForm.whatsappGroupUrl}
                  onChange={e => setEventForm(prev => ({ ...prev, whatsappGroupUrl: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Total Seats
                  </label>
                  <input
                    type="number"
                    value={eventForm.totalSeats}
                    onChange={e => setEventForm(prev => ({ ...prev, totalSeats: parseInt(e.target.value, 10) }))}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Status
                  </label>
                  <select
                    value={eventForm.status}
                    onChange={e => setEventForm(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-orange-500"
                  >
                    <option value="upcoming">Upcoming</option>
                    <option value="live">Live Now</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEventModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-slate-950 font-black text-xs shadow-lg shadow-orange-500/20 cursor-pointer"
                >
                  {editingEvent ? "Save Changes" : "Schedule Webinar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
