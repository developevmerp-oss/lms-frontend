"use client";

import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { AdminNav } from "@/components/layout/AdminNav";
import { TableRowSkeleton, CardGridSkeleton } from "@/components/ui/SkeletonLoader";
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
  ChevronDown,
  X,
  Loader2
} from "lucide-react";

export default function AdminWebinarCRM() {
  const { user, token, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<"events" | "registrations">("events");
  const [nowMs] = useState(() => Date.now());

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
  const [isSavingEvent, setIsSavingEvent] = useState(false);
  const [saveError, setSaveError] = useState("");

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
  const [isSessionDropdownOpen, setIsSessionDropdownOpen] = useState(false);
  const sessionDropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isSessionDropdownOpen) return;
    const handleOutside = (event: MouseEvent) => {
      if (sessionDropdownRef.current && !sessionDropdownRef.current.contains(event.target as Node)) {
        setIsSessionDropdownOpen(false);
      }
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsSessionDropdownOpen(false);
    };
    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isSessionDropdownOpen]);

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

  // Helper to format ISO date string or Date into YYYY-MM-DDTHH:mm for datetime-local input in local timezone
  const formatForDateTimeLocal = (dateInput: string | Date | null | undefined): string => {
    if (!dateInput) return "";
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return "";
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const handleOpenCreateModal = () => {
    setEditingEvent(null);
    setSaveError("");
    setIsSavingEvent(false);
    // Default to next upcoming Sunday 8:00 PM local time
    const nextSunday = new Date();
    const day = nextSunday.getDay();
    const diff = (7 - day) % 7;
    nextSunday.setDate(nextSunday.getDate() + (diff === 0 && nextSunday.getHours() >= 20 ? 7 : diff));
    nextSunday.setHours(20, 0, 0, 0);

    setEventForm({
      title: "Resin Mastery Masterclass — Live with Vrajangna Patel",
      scheduledAt: formatForDateTimeLocal(nextSunday),
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
    setSaveError("");
    setIsSavingEvent(false);
    setEventForm({
      title: event.title,
      scheduledAt: formatForDateTimeLocal(event.scheduledAt),
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
    setIsSavingEvent(true);
    setSaveError("");
    try {
      const method = editingEvent ? "PUT" : "POST";
      const url = editingEvent
        ? `${API_BASE_URL}/webinar/events/${editingEvent.id}`
        : `${API_BASE_URL}/webinar/events`;

      // Convert local datetime-local selection to absolute UTC ISO string (with Z)
      const scheduledUtc = eventForm.scheduledAt
        ? new Date(eventForm.scheduledAt).toISOString()
        : new Date().toISOString();

      const payload = {
        ...eventForm,
        scheduledAt: scheduledUtc,
      };

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        setIsEventModalOpen(false);
        fetchEvents();
      } else {
        setSaveError(data.message || `Failed to save changes (${res.status}). Please try again.`);
      }
    } catch (err: any) {
      console.error("Save event error:", err);
      setSaveError(err.message || "Network error. Please try again.");
    } finally {
      setIsSavingEvent(false);
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

      <main className="w-full px-4 sm:px-5 lg:px-5 py-5 sm:py-6 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-stone-500 mb-1 font-medium">
              {/* <Sparkles size={12} /> */}
              <span>Marketing &amp; Growth</span>
              <span className="text-stone-300">/</span>
              <span className="text-stone-700 font-medium">Webinar Management &amp; Leads CRM</span>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-stone-900 tracking-tight">
              Webinar Management &amp; Leads CRM
            </h1>
            <p className="text-stone-500 text-xs sm:text-sm mt-0.5">
              Schedule future webinar sessions, update Zoom &amp; WhatsApp links, and manage leads.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleOpenCreateModal}
              className="px-4 py-2.5 bg-gradient-to-r from-[#942008] via-[#c4431d] to-[#ea580c] hover:opacity-95 text-white font-black text-xs sm:text-sm rounded-xl transition-all shadow-md shadow-[#c4431d]/25 flex items-center gap-2 cursor-pointer"
            >
              <Plus size={16} /> Schedule New Webinar
            </button>
            <a
              href="/webinar"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 bg-white hover:bg-stone-50 text-stone-700 font-bold text-xs sm:text-sm rounded-xl border border-stone-300 shadow-xs transition-all flex items-center gap-2 cursor-pointer"
            >
              Live Funnel <ExternalLink size={14} />
            </a>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <div className="bg-white/95 border border-[#ecdccb] rounded-2xl p-4 sm:p-5 shadow-[0_4px_16px_-4px_rgba(45,30,15,0.06)]">
            <p className="text-xs sm:text-sm lg:text-xs font-bold text-stone-500 uppercase tracking-wider mb-1">Scheduled Webinars</p>
            <p className="text-2xl sm:text-3xl font-black text-stone-900">{events.length}</p>
            <p className="text-xs text-[#c4431d] font-bold mt-1">Active upcoming sessions</p>
          </div>

          <div className="bg-white/95 border border-[#ecdccb] rounded-2xl p-4 sm:p-5 shadow-[0_4px_16px_-4px_rgba(45,30,15,0.06)]">
            <p className="text-xs sm:text-sm lg:text-xs font-bold text-stone-500 uppercase tracking-wider mb-1">Database Leads</p>
            <p className="text-2xl sm:text-3xl font-black text-emerald-400">{registrations.length || stats.totalRegistrations || 0}</p>
            <p className="text-xs text-stone-400 font-medium mt-1">Synced with PostgreSQL</p>
          </div>

          <div className="bg-white/95 border border-[#ecdccb] rounded-2xl p-4 sm:p-5 shadow-[0_4px_16px_-4px_rgba(45,30,15,0.06)]">
            <p className="text-xs sm:text-sm lg:text-xs font-bold text-stone-500 uppercase tracking-wider mb-1">Next Session</p>
            <p className="text-lg sm:text-xl font-black text-amber-500 mt-1">
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
            <p className="text-xs text-stone-400 font-medium mt-1">Countdown active</p>
          </div>

          {(() => {
            // Dynamically calculate capacity metrics based on selected event filter or active upcoming events
            let cap = 0;
            let filled = 0;

            if (selectedEventFilter) {
              const currentEv = events.find((ev) => String(ev.id) === String(selectedEventFilter));
              cap = Number(currentEv?.totalSeats) || 500;
              filled = currentEv
                ? Number(currentEv.attendeesCount ?? registrations.length)
                : registrations.length;
            } else {
              const activeEvents = events.filter((ev) => ev.isActive !== false && ev.status !== "completed");
              const targetEvents = activeEvents.length > 0 ? activeEvents : events;
              if (targetEvents.length > 0) {
                cap = targetEvents.reduce((acc, ev) => acc + (Number(ev.totalSeats) || 0), 0);
                filled = targetEvents.reduce((acc, ev) => acc + (Number(ev.attendeesCount) || 0), 0);
              } else {
                cap = Number(stats?.totalSeats) || 500;
                filled = registrations.length || Number(stats?.actualRegistrations) || 0;
              }
            }

            if (cap <= 0) cap = 500;

            const left = Math.max(0, cap - filled);
            const rawPct = cap > 0 ? (filled / cap) * 100 : 0;
            const pct = Math.max(0, Math.min(100, rawPct));
            const displayPct = rawPct > 0 && rawPct < 1 ? Number(rawPct.toFixed(1)) : Math.round(rawPct);

            const radius = 32;
            const circumference = 2 * Math.PI * radius;
            const strokeDashoffset = circumference * (1 - pct / 100);

            return (
              <div className="bg-white/95 border border-[#ecdccb] rounded-2xl p-4 sm:p-5 shadow-[0_4px_16px_-4px_rgba(45,30,15,0.06)] flex items-center gap-3.5 sm:gap-4">
                <div className="relative w-[4.5rem] h-[4.5rem] sm:w-[4.75rem] sm:h-[4.75rem] lg:w-[4.5rem] lg:h-[4.5rem] shrink-0 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80" aria-hidden="true">
                    <defs>
                      <linearGradient id="capacityRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#c4431d" />
                        <stop offset="100%" stopColor="#d9521e" />
                      </linearGradient>
                    </defs>
                    <circle
                      cx="40"
                      cy="40"
                      r={radius}
                      fill="none"
                      stroke="#fde5d6"
                      strokeWidth="7.5"
                    />
                    <circle
                      cx="40"
                      cy="40"
                      r={radius}
                      fill="none"
                      stroke="url(#capacityRingGrad)"
                      strokeWidth="7.5"
                      strokeLinecap="butt"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      className="transition-all duration-500 ease-out"
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-xs sm:text-sm lg:text-xs xl:text-sm font-black text-stone-900 leading-none">
                    {displayPct}%
                  </span>
                </div>

                <div className="min-w-0">
                  <p className="text-sm sm:text-base lg:text-sm xl:text-base font-black text-stone-900 leading-tight">
                    Capacity Filled
                  </p>
                  <p className="text-xs sm:text-sm lg:text-xs font-semibold text-stone-600 mt-1">
                    {left} seats left ({filled} / {cap})
                  </p>
                </div>
              </div>
            );
          })()}
        </div>

        {/* View Tabs */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 border-b border-stone-200/80 pb-3">
          <button
            onClick={() => setActiveTab("events")}
            className={`px-4 sm:px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm md:text-base lg:text-sm transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "events"
                ? "bg-gradient-to-r from-[#942008] via-[#c4431d] to-[#ea580c] text-white shadow-md shadow-[#c4431d]/25"
                : "bg-white text-stone-600 hover:text-stone-900 border border-stone-200"
            }`}
          >
            <Calendar size={16} /> Scheduled Webinars ({events.length})
          </button>
          <button
            onClick={() => setActiveTab("registrations")}
            className={`px-4 sm:px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm md:text-base lg:text-sm transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "registrations"
                ? "bg-gradient-to-r from-[#942008] via-[#c4431d] to-[#ea580c] text-white shadow-md shadow-[#c4431d]/25"
                : "bg-white text-stone-600 hover:text-stone-900 border border-stone-200"
            }`}
          >
            <Users size={16} /> Registrations &amp; Leads ({registrations.length})
          </button>
        </div>

        {/* ─── TAB 1: SCHEDULED WEBINARS LIST ─── */}
        {activeTab === "events" && (
          <div className="space-y-4">
            {eventsLoading ? (
              <CardGridSkeleton count={2} />
            ) : events.length === 0 ? (
              <div className="p-12 text-center bg-white/95 border border-[#ecdccb] rounded-3xl space-y-3">
                <Calendar size={36} className="mx-auto text-stone-300" />
                <h3 className="text-lg font-bold text-stone-900">No custom webinars scheduled yet</h3>
                <p className="text-xs text-stone-500 max-w-md mx-auto">
                  The frontend is currently using the default recurring Sunday 8:00 PM schedule. Click below to schedule a custom webinar date with Zoom &amp; WhatsApp links!
                </p>
                <button
                  onClick={handleOpenCreateModal}
                  className="px-5 py-2.5 bg-gradient-to-r from-[#942008] via-[#c4431d] to-[#ea580c] hover:opacity-95 text-white font-bold text-xs rounded-xl shadow-md shadow-[#c4431d]/25 cursor-pointer inline-flex items-center gap-1.5"
                >
                  <Plus size={14} /> Schedule First Webinar
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {events.map((e) => {
                  const date = new Date(e.scheduledAt);
                  const isUpcoming = date.getTime() > nowMs;

                  return (
                    <div
                      key={e.id}
                      className="bg-white/95 border border-[#ecdccb] rounded-3xl p-6 shadow-[0_10px_30px_-12px_rgba(90,55,20,0.08)] space-y-4 relative overflow-hidden flex flex-col justify-between hover:border-[#c4431d]/40 transition-all"
                    >
                      <div className="space-y-3">
                        <div className="flex justify-between items-start gap-3">
                          <span
                            className={`text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full border ${
                              e.status === "live"
                                ? "bg-red-500/20 text-red-400 border-red-500/30 animate-pulse"
                                : isUpcoming
                                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                                : "bg-stone-100 text-stone-600 border-stone-200"
                            }`}
                          >
                            {e.status === "live" ? "🔴 Live Broadcast" : isUpcoming ? "🟢 Upcoming Session" : "Completed"}
                          </span>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleOpenEditModal(e)}
                              className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-300 transition-colors cursor-pointer"
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

                        <h3 className="text-lg font-black text-stone-900">{e.title}</h3>

                        <div className="space-y-1.5 text-xs text-stone-600">
                          <p className="flex items-center gap-2">
                            <Clock size={14} className="text-[#c4431d] shrink-0" />
                            <strong>Date &amp; Time:</strong>{" "}
                            {date.toLocaleDateString("en-IN", {
                              weekday: "short",
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}{" "}
                            at{" "}
                            {date.toLocaleTimeString("en-IN", {
                              hour: "numeric",
                              minute: "2-digit",
                              hour12: true,
                            }).toUpperCase()}{" "}
                            IST ({e.durationMinutes || 90} Mins)
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

                      <div className="pt-3 border-t border-stone-200 flex justify-between items-center text-xs">
                        <span className="text-stone-400">Created: {new Date(e.createdAt).toLocaleDateString()}</span>
                        <button
                          onClick={() => {
                            setSelectedEventFilter(e.id);
                            setActiveTab("registrations");
                          }}
                          className="text-[#c4431d] hover:text-[#942008] font-bold flex items-center gap-1 cursor-pointer"
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
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full lg:w-auto flex-1">
                <form onSubmit={handleSearchSubmit} className="relative w-full sm:flex-1 lg:max-w-xs">
                  <input
                    type="text"
                    placeholder="Search by name, email, phone, city..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full bg-white/95 border border-stone-300 rounded-xl px-4 py-2.5 pl-10 text-xs sm:text-sm md:text-base lg:text-xs xl:text-sm text-stone-900 placeholder:text-stone-400 shadow-2xs focus:outline-none focus:border-[#c4431d] focus:ring-1 focus:ring-[#c4431d]/30 transition-colors"
                  />
                  <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                </form>

                <div className="relative w-full sm:w-auto" ref={sessionDropdownRef}>
                  {(() => {
                    const selectedEv = events.find(ev => ev.id === selectedEventFilter);
                    const selectedLabel = selectedEv
                      ? `${selectedEv.title} (${new Date(selectedEv.scheduledAt).toLocaleDateString()})`
                      : "All Webinar Sessions";
                    return (
                      <>
                        <button
                          type="button"
                          onClick={() => setIsSessionDropdownOpen(prev => !prev)}
                          aria-haspopup="listbox"
                          aria-expanded={isSessionDropdownOpen}
                          className={`w-full sm:w-auto bg-white/95 border rounded-xl pl-4 pr-3.5 py-2.5 text-xs sm:text-sm md:text-base lg:text-xs xl:text-sm font-medium text-stone-900 shadow-2xs transition-colors cursor-pointer flex items-center justify-between gap-4 ${
                            isSessionDropdownOpen
                              ? "border-[#c4431d] ring-1 ring-[#c4431d]/30"
                              : "border-stone-300 hover:border-[#c4431d]/50"
                          }`}
                        >
                          <span className="truncate">{selectedLabel}</span>
                          <ChevronDown
                            size={16}
                            className={`shrink-0 transition-transform duration-150 ${
                              isSessionDropdownOpen ? "rotate-180 text-[#c4431d]" : "text-stone-500"
                            }`}
                          />
                        </button>

                        {isSessionDropdownOpen && (
                          <div
                            role="listbox"
                            aria-label="Filter by webinar session"
                            className="absolute left-0 top-full mt-2 z-30 min-w-full w-max max-w-[calc(100vw-2rem)] sm:max-w-sm bg-white border border-[#ecdccb] rounded-2xl p-1.5 shadow-[0_14px_34px_-10px_rgba(90,55,20,0.2)] max-h-64 overflow-y-auto space-y-0.5"
                          >
                            <button
                              type="button"
                              role="option"
                              aria-selected={selectedEventFilter === ""}
                              onClick={() => {
                                setSelectedEventFilter("");
                                setIsSessionDropdownOpen(false);
                              }}
                              className={`w-full flex items-center justify-between gap-3 px-3 py-2 rounded-xl text-left text-xs sm:text-sm md:text-base lg:text-xs xl:text-sm transition-colors cursor-pointer ${
                                selectedEventFilter === ""
                                  ? "bg-[#fff5ee] text-[#942008] font-bold"
                                  : "text-stone-700 hover:bg-[#fff5ee] hover:text-[#942008] font-medium"
                              }`}
                            >
                              <span>All Webinar Sessions</span>
                              {selectedEventFilter === "" && <Check size={14} className="text-[#c4431d] shrink-0" />}
                            </button>

                            {events.map(ev => {
                              const isSelected = selectedEventFilter === ev.id;
                              return (
                                <button
                                  key={ev.id}
                                  type="button"
                                  role="option"
                                  aria-selected={isSelected}
                                  onClick={() => {
                                    setSelectedEventFilter(ev.id);
                                    setIsSessionDropdownOpen(false);
                                  }}
                                  className={`w-full flex items-center justify-between gap-3 px-3 py-2 rounded-xl text-left text-xs sm:text-sm md:text-base lg:text-xs xl:text-sm transition-colors cursor-pointer ${
                                    isSelected
                                      ? "bg-[#fff5ee] text-[#942008] font-bold"
                                      : "text-stone-700 hover:bg-[#fff5ee] hover:text-[#942008] font-medium"
                                  }`}
                                >
                                  <span className="truncate">
                                    {ev.title} ({new Date(ev.scheduledAt).toLocaleDateString()})
                                  </span>
                                  {isSelected && <Check size={14} className="text-[#c4431d] shrink-0" />}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto justify-end">
                <button
                  onClick={exportCSV}
                  disabled={registrations.length === 0}
                  className="px-4 py-2.5 bg-gradient-to-r from-[#942008] via-[#c4431d] to-[#ea580c] hover:opacity-95 text-white font-bold text-xs sm:text-sm md:text-base lg:text-xs xl:text-sm rounded-xl transition-all shadow-md shadow-[#c4431d]/25 flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                >
                  <Download size={14} className="shrink-0" /> Export CSV
                </button>
                <button
                  onClick={() => { fetchRegistrations(); fetchStats(); }}
                  className="px-4 py-2.5 bg-white hover:bg-[#fff5ee] text-[#c4431d] hover:text-[#942008] text-xs sm:text-sm md:text-base lg:text-xs xl:text-sm font-bold rounded-xl border border-[#f5ded0] hover:border-[#c4431d]/40 shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <RefreshCw size={14} className={loading ? "animate-spin text-[#c4431d]" : "text-[#c4431d]"} /> Refresh
                </button>
              </div>
            </div>

            {/* Registrations Table */}
            <div className="bg-white/95 border border-[#ecdccb] rounded-3xl overflow-hidden shadow-[0_10px_30px_-12px_rgba(90,55,20,0.08)]">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-[#fcfaf7] border-b border-stone-200 text-xs font-bold uppercase tracking-wider text-stone-600">
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
                  <tbody className="divide-y divide-stone-100">
                    {loading ? (
                      Array.from({ length: 6 }).map((_, i) => (
                        <TableRowSkeleton key={i} cols={7} />
                      ))
                    ) : registrations.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-12 text-center text-stone-400 font-medium">
                          <Users size={32} className="mx-auto text-stone-300 mb-2" />
                          <p className="font-bold text-stone-900">No registrations found</p>
                        </td>
                      </tr>
                    ) : (
                      registrations.map(r => {
                        const cleanPhoneDigits = (r.phone || "").replace(/\D/g, "");
                        const whatsappLink = `https://wa.me/${cleanPhoneDigits.length === 10 ? "91" + cleanPhoneDigits : cleanPhoneDigits}`;

                        return (
                          <tr key={r.id} className="hover:bg-[#fff5ee]/60 transition-colors">
                            <td className="p-4 pl-6">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#942008] via-[#c4431d] to-[#ea580c] flex items-center justify-center font-bold text-white text-xs shrink-0 shadow-xs">
                                  {(r.name || "A")[0]}
                                </div>
                                <div>
                                  <p className="font-bold text-stone-900">{r.name}</p>
                                  <p className="text-xs text-stone-500">{r.email}</p>
                                </div>
                              </div>
                            </td>

                            <td className="p-4 font-mono text-xs text-stone-600">
                              {r.phone}
                            </td>

                            <td className="p-4 text-xs text-stone-700">
                              {r.city ? (
                                <span className="bg-[#fde5d6] text-[#942008] border border-[#f5ded0] font-bold px-2 py-0.5 rounded-md">
                                  {r.city}
                                </span>
                              ) : (
                                <span className="text-stone-400">—</span>
                              )}
                            </td>

                            <td className="p-4 text-xs text-stone-700">
                              {r.webinarEvent?.title ? (
                                <span className="truncate max-w-[150px] block">{r.webinarEvent.title}</span>
                              ) : (
                                <span className="text-stone-400">Upcoming Live</span>
                              )}
                            </td>

                            <td className="p-4 text-xs text-stone-700 max-w-xs">
                              {r.challenge ? (
                                <span className="line-clamp-1">{r.challenge}</span>
                              ) : (
                                <span className="text-stone-400 italic">—</span>
                              )}
                            </td>

                            <td className="p-4 text-xs text-stone-500 font-medium">
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
          <div className="bg-white border border-[#ecdccb] rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl relative text-stone-900 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsEventModalOpen(false)}
              className="absolute top-5 right-5 text-stone-400 hover:text-stone-700"
            >
              <X size={20} />
            </button>

            <h2 className="text-xl font-bold mb-1">
              {editingEvent ? "Edit Scheduled Webinar" : "Schedule New Webinar"}
            </h2>
            <p className="text-xs text-stone-500 mb-6 font-medium">
              Configure session date, Zoom link, and WhatsApp group for students.
            </p>

            {saveError && (
              <div className="p-3 mb-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="size-4 shrink-0" />
                <span>{saveError}</span>
              </div>
            )}

            <form onSubmit={handleSaveEvent} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Webinar Title *
                </label>
                <input
                  type="text"
                  value={eventForm.title}
                  onChange={e => setEventForm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#fcfaf7] border border-stone-300 text-stone-900 text-sm focus:outline-none focus:border-[#c4431d] focus:ring-1 focus:ring-[#c4431d]/30 transition-colors"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Date &amp; Time *
                  </label>
                  <input
                    type="datetime-local"
                    value={eventForm.scheduledAt}
                    onChange={e => setEventForm(prev => ({ ...prev, scheduledAt: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#fcfaf7] border border-stone-300 text-stone-900 text-sm focus:outline-none focus:border-[#c4431d] focus:ring-1 focus:ring-[#c4431d]/30 transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Duration (Minutes)
                  </label>
                  <input
                    type="number"
                    value={eventForm.durationMinutes}
                    onChange={e => setEventForm(prev => ({ ...prev, durationMinutes: parseInt(e.target.value, 10) }))}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#fcfaf7] border border-stone-300 text-stone-900 text-sm focus:outline-none focus:border-[#c4431d] focus:ring-1 focus:ring-[#c4431d]/30 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Zoom Meeting / Broadcast URL
                </label>
                <input
                  type="url"
                  placeholder="https://zoom.us/j/..."
                  value={eventForm.zoomJoinUrl}
                  onChange={e => setEventForm(prev => ({ ...prev, zoomJoinUrl: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#fcfaf7] border border-stone-300 text-stone-900 text-sm focus:outline-none focus:border-[#c4431d] focus:ring-1 focus:ring-[#c4431d]/30 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  WhatsApp VIP Community Invite URL
                </label>
                <input
                  type="url"
                  placeholder="https://chat.whatsapp.com/..."
                  value={eventForm.whatsappGroupUrl}
                  onChange={e => setEventForm(prev => ({ ...prev, whatsappGroupUrl: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#fcfaf7] border border-stone-300 text-stone-900 text-sm focus:outline-none focus:border-[#c4431d] focus:ring-1 focus:ring-[#c4431d]/30 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  🎬 Prep Demo Video URL
                  <span className="ml-1 text-[#c4431d] normal-case font-semibold">(shown on Thank-You page)</span>
                </label>
                <input
                  type="url"
                  placeholder="https://www.youtube.com/watch?v=... or https://youtu.be/..."
                  value={eventForm.prepVideoUrl}
                  onChange={e => setEventForm(prev => ({ ...prev, prepVideoUrl: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#fcfaf7] border border-stone-300 text-stone-900 text-sm focus:outline-none focus:border-[#c4431d] focus:ring-1 focus:ring-[#c4431d]/30 transition-colors"
                />
                <p className="text-xs text-stone-400 font-medium mt-1">
                  Paste the YouTube video link here. Students will see this on the thank-you page after registering.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Total Seats
                  </label>
                  <input
                    type="number"
                    value={eventForm.totalSeats}
                    onChange={e => setEventForm(prev => ({ ...prev, totalSeats: parseInt(e.target.value, 10) }))}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#fcfaf7] border border-stone-300 text-stone-900 text-sm focus:outline-none focus:border-[#c4431d] focus:ring-1 focus:ring-[#c4431d]/30 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Status
                  </label>
                  <select
                    value={eventForm.status}
                    onChange={e => setEventForm(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#fcfaf7] border border-stone-300 text-stone-900 text-sm focus:outline-none focus:border-[#c4431d] focus:ring-1 focus:ring-[#c4431d]/30 transition-colors"
                  >
                    <option value="upcoming">Upcoming</option>
                    <option value="live">Live Now</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsEventModalOpen(false)}
                  disabled={isSavingEvent}
                  className="px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingEvent}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#942008] via-[#c4431d] to-[#ea580c] hover:opacity-95 disabled:opacity-50 text-white font-black text-xs shadow-md shadow-[#c4431d]/25 cursor-pointer flex items-center gap-2"
                >
                  {isSavingEvent ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving Changes...</span>
                    </>
                  ) : (
                    <span>{editingEvent ? "Save Changes" : "Schedule Webinar"}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
