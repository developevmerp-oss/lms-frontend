"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { AdminNav } from "@/components/layout/AdminNav";
import {
  Video,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  Users,
  Calendar,
  Clock,
  ExternalLink,
  Sparkles,
  Search,
  X,
  PlayCircle,
  ShieldCheck,
  Check,
  UserCheck,
  UserX,
  Layers,
  FileSpreadsheet,
  History,
  Download,
} from "lucide-react";
import { API_BASE_URL } from "@/config/api";

interface LiveClass {
  id: string;
  title: string;
  description?: string;
  scheduledAt: string;
  durationMinutes: number;
  meetingUrl?: string;
  recordingUrl?: string;
  targetLevel: string;
  status: "upcoming" | "live" | "completed" | "cancelled";
  instructor: string;
  totalAttendees: number;
  attendees?: any[];
}

export default function AdminClassesPage() {
  const { token, user, logout } = useAuth();
  const [classes, setClasses] = useState<LiveClass[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Create / Edit Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<LiveClass | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    scheduledAt: "",
    durationMinutes: 60,
    meetingUrl: "",
    recordingUrl: "",
    targetLevel: "All",
    status: "upcoming" as "upcoming" | "live" | "completed" | "cancelled",
    instructor: "Vrajangna Patel",
  });

  const [selectedLevels, setSelectedLevels] = useState<string[]>(["All"]);
  const [sendNotification, setSendNotification] = useState<boolean>(true);

  // Attendance Roster Modal
  const [rosterModal, setRosterModal] = useState<{ isOpen: boolean; liveClass: LiveClass | null }>({
    isOpen: false,
    liveClass: null,
  });
  const [rosterSearch, setRosterSearch] = useState("");

  // Attendance History Modal
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [historyRecords, setHistoryRecords] = useState<any[]>([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);
  const [historySearch, setHistorySearch] = useState("");
  const [isExporting, setIsExporting] = useState(false);

  const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
  const API = API_BASE_URL;

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 3500);
  };

  const showError = (msg: string) => {
    setErrorMsg(msg);
    setTimeout(() => setErrorMsg(""), 3500);
  };

  // Download full attendance sheet (.xlsx / .csv)
  const handleExportAllAttendance = async () => {
    try {
      setIsExporting(true);
      const res = await fetch(`${API}/classes/attendance/export`, { headers });
      if (!res.ok) throw new Error("Failed to download attendance sheet");
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `live_classes_full_attendance_history_${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      showSuccess("Full attendance history sheet downloaded successfully!");
    } catch (err: any) {
      showError(err.message || "Failed to download attendance sheet");
    } finally {
      setIsExporting(false);
    }
  };

  // Download class-wise attendance sheet (.xlsx / .csv)
  const handleExportClassAttendance = async (classId?: string, classTitle?: string) => {
    if (!classId) return;
    try {
      const res = await fetch(`${API}/classes/attendance/export?classId=${classId}`, { headers });
      if (!res.ok) throw new Error("Failed to download class attendance sheet");
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const safeTitle = (classTitle || "class").replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 30);
      a.download = `class_attendance_${safeTitle}_${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      showSuccess("Class attendance sheet downloaded successfully!");
    } catch (err: any) {
      showError(err.message || "Failed to download class attendance sheet");
    }
  };

  // Fetch complete attendance history
  const fetchAttendanceHistory = async () => {
    setIsHistoryLoading(true);
    try {
      const res = await fetch(`${API}/classes/attendance/history`, { headers });
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setHistoryRecords(data.data);
      }
    } catch (err) {
      console.error("Error fetching attendance history:", err);
      showError("Failed to fetch attendance history");
    } finally {
      setIsHistoryLoading(false);
    }
  };

  const fetchClasses = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API}/classes`, { headers });
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setClasses(data.data);
      }
    } catch (err) {
      console.error("Error fetching live classes:", err);
      showError("Failed to fetch classes");
    } finally {
      setIsLoading(false);
    }
  };

  const [liveLevels, setLiveLevels] = useState<any[]>([]);

  const fetchLiveLevels = async () => {
    try {
      const res = await fetch(`${API}/admin/levels`, { headers });
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        setLiveLevels(data);
      } else {
        const pubRes = await fetch(`${API}/dashboard/levels`);
        const pubData = await pubRes.json();
        if (Array.isArray(pubData) && pubData.length > 0) setLiveLevels(pubData);
      }
    } catch (err) {
      try {
        const pubRes = await fetch(`${API}/dashboard/levels`);
        const pubData = await pubRes.json();
        if (Array.isArray(pubData) && pubData.length > 0) setLiveLevels(pubData);
      } catch (e) {
        console.error(e);
      }
    }
  };

  useEffect(() => {
    if (token) {
      fetchClasses();
      fetchLiveLevels();
    }
  }, [token]);

  const formatIsoForLocalInput = (dateInput: string | Date) => {
    if (!dateInput) return "";
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return "";
    const offset = d.getTimezoneOffset() * 60000;
    return new Date(d.getTime() - offset).toISOString().slice(0, 16);
  };

  const availableTiers = liveLevels.length > 0 
    ? liveLevels 
    : [
        { code: "L0", name: "Fast Track" },
        { code: "L1", name: "Silver" },
        { code: "L2", name: "Gold" },
        { code: "L3", name: "Diamond" },
        { code: "L3+", name: "Masters Club" },
      ];

  const toggleLevelSelection = (code: string) => {
    if (code === "All") {
      setSelectedLevels(["All"]);
      return;
    }

    let updated = selectedLevels.filter(lvl => lvl !== "All");
    if (updated.includes(code)) {
      updated = updated.filter(lvl => lvl !== code);
    } else {
      updated.push(code);
    }

    if (updated.length === 0 || updated.length === availableTiers.length) {
      updated = ["All"];
    }

    setSelectedLevels(updated);
  };

  const openCreateModal = () => {
    setEditingClass(null);
    const inTwoDays = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);
    inTwoDays.setMinutes(0);

    setFormData({
      title: "",
      description: "",
      scheduledAt: formatIsoForLocalInput(inTwoDays),
      durationMinutes: 60,
      meetingUrl: "https://zoom.us/j/your-meeting-id",
      recordingUrl: "",
      targetLevel: "All",
      status: "upcoming",
      instructor: "Vrajangna Patel",
    });
    setSelectedLevels(["All"]);
    setSendNotification(true);
    setIsModalOpen(true);
  };

  const openEditModal = (cls: LiveClass) => {
    setEditingClass(cls);
    const rawTarget = cls.targetLevel || "All";
    if (rawTarget === "All" || rawTarget.toLowerCase() === "all") {
      setSelectedLevels(["All"]);
    } else {
      const parsed = rawTarget.split(",").map((s: string) => s.trim()).filter(Boolean);
      setSelectedLevels(parsed.length > 0 ? parsed : ["All"]);
    }
    setSendNotification(false);

    setFormData({
      title: cls.title,
      description: cls.description || "",
      scheduledAt: formatIsoForLocalInput(cls.scheduledAt),
      durationMinutes: cls.durationMinutes || 60,
      meetingUrl: cls.meetingUrl || "",
      recordingUrl: cls.recordingUrl || "",
      targetLevel: cls.targetLevel || "All",
      status: cls.status || "upcoming",
      instructor: cls.instructor || "Vrajangna Patel",
    });
    setIsModalOpen(true);
  };

  const handleSaveClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.scheduledAt) {
      showError("Class title and date/time are required");
      return;
    }

    try {
      const targetLevelString = selectedLevels.includes("All") 
        ? "All" 
        : selectedLevels.join(", ");

      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        scheduledAt: new Date(formData.scheduledAt).toISOString(),
        durationMinutes: Number(formData.durationMinutes) || 60,
        meetingUrl: formData.meetingUrl.trim(),
        recordingUrl: formData.recordingUrl.trim(),
        targetLevel: targetLevelString,
        status: formData.status,
        instructor: formData.instructor.trim(),
        sendNotification,
      };

      let res;
      if (editingClass) {
        res = await fetch(`${API}/classes/${editingClass.id}`, {
          method: "PUT",
          headers,
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch(`${API}/classes`, {
          method: "POST",
          headers,
          body: JSON.stringify(payload),
        });
      }

      const data = await res.json();
      if (res.ok && data.success) {
        showSuccess(editingClass ? "Live class updated successfully!" : "New live class scheduled and notifications sent!");
        setIsModalOpen(false);
        fetchClasses();
      } else {
        showError(data.message || "Failed to save class");
      }
    } catch (err: any) {
      showError(err.message || "An error occurred");
    }
  };

  const handleDeleteClass = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      const res = await fetch(`${API}/classes/${id}`, {
        method: "DELETE",
        headers,
      });
      if (res.ok) {
        showSuccess(`Class "${title}" deleted successfully`);
        fetchClasses();
      } else {
        showError("Failed to delete class");
      }
    } catch (err: any) {
      showError(err.message || "An error occurred");
    }
  };

  const handleToggleAttendance = async (classId: string, studentId: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`${API}/classes/${classId}/attendance/${studentId}`, {
        method: "POST",
        headers,
        body: JSON.stringify({ attended: !currentStatus }),
      });
      if (res.ok) {
        showSuccess("Attendance status updated!");
        fetchClasses();
        // Update current open roster modal data
        setRosterModal((prev) => {
          if (!prev.liveClass) return prev;
          const updatedAttendees = (prev.liveClass.attendees || []).map((att: any) => {
            if (att.userId === studentId) {
              return { ...att, attended: !currentStatus };
            }
            return att;
          });
          return {
            ...prev,
            liveClass: { ...prev.liveClass, attendees: updatedAttendees },
          };
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredClasses = classes.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.description || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.targetLevel.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans">
      <AdminNav user={user} logout={logout} />

      <main className="max-w-[1400px] mx-auto p-4 md:p-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-orange-500/30 bg-orange-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-orange-400 mb-2">
              <Video size={13} className="text-orange-400" /> Live Interactive Masterclasses
            </span>
            <h1 className="text-3xl font-black text-white flex items-center gap-3">
              Online Class &amp; Attendance Management
            </h1>
            <p className="text-slate-400 mt-1 text-sm">
              Schedule live Zoom coaching calls, manage meeting links, track student attendance, and upload video replays.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap self-start md:self-auto">
            <button
              onClick={handleExportAllAttendance}
              disabled={isExporting}
              className="inline-flex items-center gap-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold text-xs h-11 px-4 rounded-2xl shadow-md transition-all cursor-pointer hover:scale-105"
              title="Download complete attendance history across all classes in Excel / CSV format"
            >
              <FileSpreadsheet size={16} />
              {isExporting ? "Exporting..." : "Download Full Sheet (.xlsx / .csv)"}
            </button>

            <button
              onClick={() => {
                setIsHistoryModalOpen(true);
                fetchAttendanceHistory();
              }}
              className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold text-xs h-11 px-4 rounded-2xl shadow-md transition-all cursor-pointer hover:border-orange-500/50"
            >
              <History size={16} className="text-orange-400" /> Attendance History
            </button>

            <button
              onClick={openCreateModal}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-black text-sm h-11 px-5 rounded-2xl shadow-lg shadow-orange-500/20 transition-all hover:scale-105 cursor-pointer"
            >
              <Plus size={18} /> Schedule Live Class
            </button>
          </div>
        </div>

        {/* Success Alert */}
        {successMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-bold flex items-center gap-2">
            <CheckCircle2 size={18} /> {successMsg}
          </div>
        )}

        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input
              type="text"
              placeholder="Search classes by title or level..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
            />
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span>
              Total Live Classes: <strong className="text-white font-mono">{classes.length}</strong>
            </span>
          </div>
        </div>

        {/* Classes List */}
        {isLoading ? (
          <div className="p-16 text-center text-slate-500">Loading scheduled classes...</div>
        ) : filteredClasses.length === 0 ? (
          <div className="text-center py-16 rounded-3xl border border-dashed border-slate-800 bg-slate-900/40 p-8">
            <Video size={40} className="text-slate-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white mb-1">No Live Classes Scheduled</h3>
            <p className="text-sm text-slate-400 mb-4">Schedule online coaching masterclasses for your students.</p>
            <button
              onClick={openCreateModal}
              className="bg-orange-500 text-slate-950 font-bold text-xs h-10 px-5 rounded-xl cursor-pointer"
            >
              + Schedule First Class
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClasses.map((cls) => {
              const eventDate = new Date(cls.scheduledAt);
              const isPast = eventDate.getTime() < Date.now();

              return (
                <div
                  key={cls.id}
                  className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 flex flex-col justify-between hover:border-orange-500/40 transition-all shadow-xl"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <span className={`px-2.5 py-0.5 rounded-lg text-[11px] font-black uppercase ${
                        cls.status === "live"
                          ? "bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse"
                          : cls.status === "completed"
                          ? "bg-slate-800 text-slate-400 border border-slate-700"
                          : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                      }`}>
                        {cls.status === "live" ? "🔴 Live Now" : cls.status}
                      </span>

                      <span className="text-xs font-black text-orange-400 bg-orange-500/10 border border-orange-500/20 px-2.5 py-0.5 rounded-lg">
                        Level: {cls.targetLevel}
                      </span>
                    </div>

                    <h3 className="text-lg font-black text-white leading-snug mb-2">
                      {cls.title}
                    </h3>

                    <p className="text-xs text-slate-400 leading-relaxed mb-4 line-clamp-2">
                      {cls.description || "Interactive live session with feedback and practical resin techniques."}
                    </p>

                    <div className="space-y-2 rounded-2xl bg-slate-950/80 border border-slate-800/80 p-3 mb-4 text-xs text-slate-300">
                      <div className="flex items-center gap-2">
                        <Calendar size={13} className="text-orange-400 shrink-0" />
                        <span>
                          {eventDate.toLocaleDateString("en-IN", {
                            weekday: "short",
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}{" "}
                          at{" "}
                          {eventDate.toLocaleTimeString("en-IN", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Clock size={13} className="text-amber-400 shrink-0" />
                        <span>{cls.durationMinutes} Minutes Duration</span>
                      </div>

                      <div className="flex items-center justify-between pt-1 border-t border-slate-800/80">
                        <span className="text-slate-400">Total Attendees:</span>
                        <span className="font-black text-emerald-400 flex items-center gap-1">
                          <Users size={12} /> {cls.totalAttendees || 0} Students Attended
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 pt-3 border-t border-slate-800/80">
                    <button
                      onClick={() => {
                        setRosterModal({ isOpen: true, liveClass: cls });
                        setRosterSearch("");
                      }}
                      className="w-full py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-black text-xs rounded-xl shadow-md flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <UserCheck size={14} /> View Attendance Roster ({cls.totalAttendees || 0})
                    </button>

                    <div className="flex items-center gap-2">
                      {cls.meetingUrl && (
                        <a
                          href={cls.meetingUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-slate-700 flex items-center justify-center gap-1 transition-colors"
                        >
                          <ExternalLink size={12} /> Join Call
                        </a>
                      )}

                      <button
                        onClick={() => handleExportClassAttendance(cls.id, cls.title)}
                        className="p-2 bg-slate-800 hover:bg-emerald-500/20 hover:text-emerald-400 text-slate-400 rounded-xl border border-slate-700 transition-colors cursor-pointer"
                        title="Download Class Attendance Sheet (.xlsx / .csv)"
                      >
                        <Download size={13} />
                      </button>

                      <button
                        onClick={() => openEditModal(cls)}
                        className="p-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl border border-slate-700 transition-colors cursor-pointer"
                        title="Edit Class"
                      >
                        <Edit2 size={13} />
                      </button>

                      <button
                        onClick={() => handleDeleteClass(cls.id, cls.title)}
                        className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors cursor-pointer"
                        title="Delete Class"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Create / Edit Class Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative animate-scale-up max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-5 pb-3 border-b border-slate-800">
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <Video className="text-orange-400" size={18} />
                  {editingClass ? "Edit Live Class" : "Schedule Live Class"}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleSaveClass} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1.5">Class Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Weekly Resin Masterclass & Live Q&A"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white font-bold focus:outline-none focus:border-orange-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1.5">Date &amp; Start Time</label>
                    <input
                      type="datetime-local"
                      value={formData.scheduledAt}
                      onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1.5">Duration (Minutes)</label>
                    <input
                      type="number"
                      value={formData.durationMinutes}
                      onChange={(e) => setFormData({ ...formData, durationMinutes: parseInt(e.target.value) || 60 })}
                      placeholder="60"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-slate-300">
                      Target Level Access <span className="text-orange-400 font-semibold">(Multi-Select Supported)</span>
                    </label>
                    <span className="text-[11px] font-bold text-slate-400">
                      Target: <span className="text-orange-400 font-bold">{selectedLevels.includes("All") ? "All Membership Levels" : selectedLevels.join(", ")}</span>
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-3 bg-slate-950 border border-slate-800 rounded-2xl">
                    <button
                      type="button"
                      onClick={() => toggleLevelSelection("All")}
                      className={`col-span-2 sm:col-span-3 px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                        selectedLevels.includes("All")
                          ? "bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-black shadow-lg shadow-orange-500/20"
                          : "bg-slate-900 border border-slate-800 text-slate-300 hover:border-slate-700"
                      }`}
                    >
                      <span>🌐 All Membership Levels (Open to All Tiers)</span>
                      {selectedLevels.includes("All") && <Check size={14} className="stroke-[3]" />}
                    </button>

                    {availableTiers.map((lvl: any) => {
                      const isSelected = selectedLevels.includes("All") || selectedLevels.includes(lvl.code);
                      const isExplicit = selectedLevels.includes(lvl.code);

                      return (
                        <button
                          key={lvl.code}
                          type="button"
                          onClick={() => toggleLevelSelection(lvl.code)}
                          className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                            selectedLevels.includes("All")
                              ? "bg-slate-900/60 border border-slate-800 text-slate-400 opacity-70"
                              : isExplicit
                              ? "bg-orange-500 text-slate-950 font-black shadow-md shadow-orange-500/20"
                              : "bg-slate-900 border border-slate-800 text-slate-300 hover:border-slate-700"
                          }`}
                        >
                          <span className="truncate">{lvl.code} · {lvl.name}</span>
                          {isExplicit && <Check size={13} className="stroke-[3] shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-slate-950/80 border border-slate-800/80 rounded-2xl">
                  <input
                    type="checkbox"
                    id="sendNotification"
                    checked={sendNotification}
                    onChange={(e) => setSendNotification(e.target.checked)}
                    className="w-4 h-4 mt-0.5 rounded text-orange-500 accent-orange-500 cursor-pointer shrink-0"
                  />
                  <label htmlFor="sendNotification" className="text-xs text-slate-300 cursor-pointer select-none">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      🔔 Send In-App Bell Notification to Eligible Students
                    </span>
                    <span className="text-[11px] text-slate-400 block mt-0.5">
                      Eligible students enrolled in {selectedLevels.includes("All") ? "all levels" : selectedLevels.join(", ")} will immediately receive a notification alert with the direct join link.
                    </span>
                  </label>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1.5">Class Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white font-bold focus:outline-none focus:border-orange-500"
                  >
                    <option value="upcoming">Upcoming</option>
                    <option value="live">🔴 Live Now</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1.5">Live Meeting URL (Zoom / Google Meet)</label>
                  <input
                    type="url"
                    value={formData.meetingUrl}
                    onChange={(e) => setFormData({ ...formData, meetingUrl: e.target.value })}
                    placeholder="https://zoom.us/j/123456789"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1.5">Recording / Replay Video URL (Optional)</label>
                  <input
                    type="url"
                    value={formData.recordingUrl}
                    onChange={(e) => setFormData({ ...formData, recordingUrl: e.target.value })}
                    placeholder="https://youtube.com/watch?v=xxx or Vimeo URL"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1.5">Description &amp; Agenda</label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="What will students learn in this live coaching session?"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-orange-500 resize-none"
                  />
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-slate-800">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 text-slate-950 font-black text-sm h-11 rounded-xl shadow-lg transition-all cursor-pointer"
                  >
                    {editingClass ? "Update Live Class" : "Schedule Live Class"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="border border-slate-700 bg-slate-800 text-slate-300 font-semibold text-sm h-11 px-5 rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Attendance Roster Modal */}
        {rosterModal.isOpen && rosterModal.liveClass && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 md:p-8 shadow-2xl relative animate-scale-up max-h-[85vh] flex flex-col">
              
              <div className="flex justify-between items-start mb-4 pb-3 border-b border-slate-800 shrink-0">
                <div>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-0.5 text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1">
                    <UserCheck size={13} /> Live Attendance Roster
                  </span>
                  <h3 className="text-xl font-black text-white">{rosterModal.liveClass.title}</h3>
                  <p className="text-xs text-slate-400">
                    Total recorded attendees: <strong className="text-emerald-400">{rosterModal.liveClass.totalAttendees} Students</strong>
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleExportClassAttendance(rosterModal.liveClass?.id, rosterModal.liveClass?.title)}
                    className="px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                    title="Download this class's attendance sheet (.csv)"
                  >
                    <Download size={13} /> Export Sheet
                  </button>
                  <button
                    onClick={() => setRosterModal({ isOpen: false, liveClass: null })}
                    className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              {/* Roster Search */}
              <div className="mb-4 shrink-0">
                <input
                  type="text"
                  placeholder="Filter attendees by student name or email..."
                  value={rosterSearch}
                  onChange={(e) => setRosterSearch(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                />
              </div>

              {/* Attendees List */}
              <div className="overflow-y-auto flex-1 space-y-2 pr-1">
                {(rosterModal.liveClass.attendees || []).length === 0 ? (
                  <div className="p-8 text-center bg-slate-950/50 border border-slate-800 rounded-2xl">
                    <Users size={32} className="text-slate-700 mx-auto mb-2" />
                    <p className="text-slate-400 text-sm font-bold">No Students Joined Yet</p>
                    <p className="text-slate-600 text-xs mt-1">
                      When students click "Join Live Class" on their portal, attendance is automatically recorded here.
                    </p>
                  </div>
                ) : (
                  (rosterModal.liveClass.attendees || [])
                    .filter((a: any) =>
                      a.studentName.toLowerCase().includes(rosterSearch.toLowerCase()) ||
                      a.studentEmail.toLowerCase().includes(rosterSearch.toLowerCase())
                    )
                    .map((att: any) => {
                      const joinDate = att.joinedAt ? new Date(att.joinedAt) : null;
                      return (
                        <div
                          key={att.userId}
                          className="p-3.5 bg-slate-950/80 border border-slate-800/80 rounded-2xl flex items-center justify-between gap-3 hover:border-slate-700 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center font-bold text-orange-400 text-sm">
                              {att.studentName.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <h4 className="font-bold text-white text-xs sm:text-sm">{att.studentName}</h4>
                              <p className="text-[11px] text-slate-400">{att.studentEmail}</p>
                              <span className="text-[10px] text-amber-400 font-semibold block mt-0.5">
                                {att.membershipLevel}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            {joinDate && (
                              <div className="text-right hidden sm:block">
                                <span className="text-[10px] text-slate-500 block">Joined At</span>
                                <span className="text-xs text-slate-300 font-mono">
                                  {joinDate.toLocaleTimeString("en-IN", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </span>
                              </div>
                            )}

                            <button
                              onClick={() =>
                                handleToggleAttendance(rosterModal.liveClass!.id, att.userId, att.attended)
                              }
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                                att.attended
                                  ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20"
                                  : "bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500/20"
                              }`}
                            >
                              {att.attended ? (
                                <>
                                  <UserCheck size={13} /> Present
                                </>
                              ) : (
                                <>
                                  <UserX size={13} /> Absent
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      );
                    })
                )}
              </div>
            </div>
          </div>
        )}

        {/* Full Attendance History Modal */}
        {isHistoryModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-4xl w-full p-6 md:p-8 shadow-2xl relative animate-scale-up max-h-[85vh] flex flex-col">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800 shrink-0">
                <div>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-0.5 text-xs font-bold uppercase tracking-wider text-orange-400 mb-1">
                    <History size={13} /> Complete Attendance History &amp; Records
                  </span>
                  <h3 className="text-xl font-black text-white">All Sessions Attendance Ledger</h3>
                  <p className="text-xs text-slate-400">
                    Showing all historical attendance logs (including sessions concluded or removed from schedule).
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleExportAllAttendance}
                    disabled={isExporting}
                    className="px-3.5 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <FileSpreadsheet size={14} /> Download Excel (.csv)
                  </button>
                  <button
                    onClick={() => setIsHistoryModalOpen(false)}
                    className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              {/* Search Bar */}
              <div className="mb-4 shrink-0 flex items-center justify-between gap-3">
                <input
                  type="text"
                  placeholder="Search by student name, email, level, or class title..."
                  value={historySearch}
                  onChange={(e) => setHistorySearch(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                />
                <span className="text-xs text-slate-400 shrink-0 hidden sm:inline">
                  Total Records: <strong className="text-white font-mono">{historyRecords.length}</strong>
                </span>
              </div>

              {/* History Table / Records */}
              <div className="overflow-y-auto flex-1 space-y-2 pr-1">
                {isHistoryLoading ? (
                  <div className="p-12 text-center text-slate-500 text-sm">Loading attendance history ledger...</div>
                ) : historyRecords.length === 0 ? (
                  <div className="p-12 text-center bg-slate-950/50 border border-slate-800 rounded-2xl">
                    <Users size={32} className="text-slate-700 mx-auto mb-2" />
                    <p className="text-slate-400 text-sm font-bold">No Attendance History Recorded Yet</p>
                    <p className="text-slate-600 text-xs mt-1">
                      As students join your live classes, their attendance and +100 XP credit logs will accumulate here forever.
                    </p>
                  </div>
                ) : (
                  historyRecords
                    .filter((rec: any) =>
                      (rec.studentName || "").toLowerCase().includes(historySearch.toLowerCase()) ||
                      (rec.studentEmail || "").toLowerCase().includes(historySearch.toLowerCase()) ||
                      (rec.classTitle || "").toLowerCase().includes(historySearch.toLowerCase()) ||
                      (rec.studentLevel || "").toLowerCase().includes(historySearch.toLowerCase())
                    )
                    .map((rec: any) => {
                      const joinDate = rec.joinedAt ? new Date(rec.joinedAt) : null;
                      return (
                        <div
                          key={rec.id}
                          className="p-3.5 bg-slate-950/80 border border-slate-800/80 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-slate-700 transition-colors"
                        >
                          <div className="flex items-start sm:items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center font-bold text-orange-400 text-sm shrink-0 mt-0.5 sm:mt-0">
                              {rec.studentName?.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <h4 className="font-bold text-white text-xs sm:text-sm">{rec.studentName}</h4>
                                <span className="text-[10px] text-amber-400 font-semibold px-2 py-0.5 bg-amber-500/10 border border-amber-500/20 rounded-md">
                                  {rec.studentLevel}
                                </span>
                                {rec.classStatus && rec.classStatus.includes("Removed") && (
                                  <span className="text-[10px] text-slate-400 font-medium px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded">
                                    Concluded Session
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-slate-400 mt-0.5">
                                Class: <strong className="text-slate-200">{rec.classTitle}</strong>
                              </p>
                              <p className="text-[10px] text-slate-500">
                                {rec.studentEmail} {rec.studentPhone && rec.studentPhone !== "N/A" ? `· ${rec.studentPhone}` : ""}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-0 border-slate-800/60">
                            {joinDate && (
                              <div className="text-left sm:text-right">
                                <span className="text-[10px] text-slate-500 block">Attended On</span>
                                <span className="text-xs text-slate-300 font-mono">
                                  {joinDate.toLocaleDateString("en-IN", {
                                    day: "numeric",
                                    month: "short",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </span>
                              </div>
                            )}

                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-black bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                              <CheckCircle2 size={13} /> +100 XP Earned
                            </span>
                          </div>
                        </div>
                      );
                    })
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
