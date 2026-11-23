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
  Hourglass,
  Ellipsis,
  Loader2,
} from "lucide-react";
import { CardGridSkeleton } from "@/components/ui/SkeletonLoader";
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
  const [isSavingClass, setIsSavingClass] = useState(false);
  const [deletingClassId, setDeletingClassId] = useState<string | null>(null);
  const [updatingRosterId, setUpdatingRosterId] = useState<string | null>(null);
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
  const [openActionMenuId, setOpenActionMenuId] = useState<string | null>(null);

  useEffect(() => {
    if (!openActionMenuId) return;
    const handleOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target?.closest("[data-class-menu-root]")) {
        setOpenActionMenuId(null);
      }
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenActionMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [openActionMenuId]);

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
    if (!formData.title.trim() || !formData.scheduledAt || isSavingClass) {
      if (!formData.title.trim() || !formData.scheduledAt) showError("Class title and date/time are required");
      return;
    }

    setIsSavingClass(true);
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
    } finally {
      setIsSavingClass(false);
    }
  };

  const handleDeleteClass = async (id: string, title: string) => {
    if (deletingClassId === id) return;
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;
    setDeletingClassId(id);
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
    } finally {
      setDeletingClassId(null);
    }
  };

  const handleToggleAttendance = async (classId: string, studentId: string, currentStatus: boolean) => {
    if (updatingRosterId === studentId) return;
    setUpdatingRosterId(studentId);
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
    } finally {
      setUpdatingRosterId(null);
    }
  };

  const filteredClasses = classes.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.description || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.targetLevel.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div
      className="min-h-screen bg-[#faf8f5] text-stone-900 font-sans transition-colors lg:pl-64"
      style={{
        backgroundColor: "#faf8f5",
        backgroundImage: "radial-gradient(circle, #e2ded4 1.5px, transparent 1.5px)",
        backgroundSize: "24px 24px",
        backgroundAttachment: "fixed",
      }}
    >
      <AdminNav user={user} logout={logout} />

      <main className="w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* Actions Bar - Left Aligned */}
        <div className="flex flex-wrap items-center justify-start gap-2 lg:gap-2.5 mb-6">
          <button
            onClick={handleExportAllAttendance}
            disabled={isExporting}
            className="inline-flex items-center gap-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold text-xs h-11 px-3.5 lg:px-4 rounded-2xl shadow-md transition-all cursor-pointer hover:scale-105 whitespace-nowrap shrink-0"
            title="Download complete attendance history across all classes in Excel / CSV format"
            >
              <FileSpreadsheet size={16} className="shrink-0" />
              {isExporting ? "Exporting..." : "Download Full Sheet (.xlsx / .csv)"}
            </button>

            <button
              onClick={() => {
                setIsHistoryModalOpen(true);
                fetchAttendanceHistory();
              }}
              className="inline-flex items-center gap-2 bg-white hover:bg-stone-50 text-stone-700 border border-stone-300 font-bold text-xs h-11 px-3.5 lg:px-4 rounded-2xl shadow-xs transition-all cursor-pointer whitespace-nowrap shrink-0"
            >
              <History size={16} className="text-[#c4431d] shrink-0" /> Attendance History
            </button>

            <button
              onClick={openCreateModal}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#942008] via-[#c4431d] to-[#ea580c] hover:opacity-95 text-white font-black text-sm h-11 px-4 lg:px-5 rounded-2xl shadow-md shadow-[#c4431d]/25 transition-all hover:scale-105 cursor-pointer whitespace-nowrap shrink-0"
            >
              <Plus size={18} className="shrink-0" /> Schedule Live Class
            </button>
          </div>

        {/* Success Alert */}
        {successMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-bold flex items-center gap-2">
            <CheckCircle2 size={18} /> {successMsg}
          </div>
        )}

        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 bg-white/95 border border-[#ecdccb] p-4 rounded-2xl shadow-xs">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" size={16} />
            <input
              type="text"
              placeholder="Search classes by title or level..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#fcfaf7] border border-stone-300 rounded-xl pl-10 pr-4 py-2 text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-[#c4431d] focus:ring-1 focus:ring-[#c4431d]/30 transition-colors"
            />
          </div>

          <div className="flex items-center gap-3 text-xs text-stone-500 font-medium">
            <span>
              Total Live Classes: <strong className="text-stone-900 font-mono">{classes.length}</strong>
            </span>
          </div>
        </div>

        {/* Classes List */}
        {isLoading ? (
          <CardGridSkeleton count={4} />
        ) : filteredClasses.length === 0 ? (
          <div className="text-center py-16 rounded-3xl border border-dashed border-stone-200 bg-white/60 p-8">
            <Video size={40} className="text-stone-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-stone-900 mb-1">No Live Classes Scheduled</h3>
            <p className="text-sm text-stone-500 mb-4 font-medium">Schedule online coaching masterclasses for your students.</p>
            <button
              onClick={openCreateModal}
              className="bg-gradient-to-r from-[#942008] via-[#c4431d] to-[#ea580c] hover:opacity-95 text-white font-bold text-xs h-10 px-5 rounded-xl shadow-xs cursor-pointer"
            >
              + Schedule First Class
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClasses.map((cls) => {
              const eventDate = new Date(cls.scheduledAt);
              const isPast = eventDate.getTime() < Date.now();
              const isMenuOpen = openActionMenuId === cls.id;

              const statusStyles =
                cls.status === "live"
                  ? { pill: "bg-red-50 text-red-700", dot: "bg-red-500 animate-pulse", label: "Live Now" }
                  : cls.status === "completed"
                    ? { pill: "bg-stone-100 text-stone-700", dot: "bg-stone-500", label: "Completed" }
                    : cls.status === "cancelled"
                      ? { pill: "bg-rose-50 text-rose-700", dot: "bg-rose-500", label: "Cancelled" }
                      : { pill: "bg-[#e9f8eb] text-[#15803d]", dot: "bg-[#22c55e]", label: "Upcoming" };

              return (
                <div
                  key={cls.id}
                  className={`relative rounded-3xl border border-[#ecdccb] bg-white p-5 sm:p-6 flex flex-col justify-between hover:border-[#c4431d]/40 transition-all shadow-[0_10px_30px_-12px_rgba(90,55,20,0.08)] ${isMenuOpen ? "z-30" : ""}`}
                >
                  <div>
                    {/* Top Row: Status & Level Pills */}
                    <div className="flex items-center justify-between gap-2 mb-3.5">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${statusStyles.pill}`}>
                        <span className={`w-2 h-2 rounded-full shrink-0 ${statusStyles.dot}`} />
                        <span>{statusStyles.label}</span>
                      </span>

                      <span className="inline-flex items-center rounded-full bg-[#fdeee2] text-[#7c2d12] px-3.5 py-1 text-xs font-bold">
                        Level: {cls.targetLevel}
                      </span>
                    </div>

                    {/* Title & Subtitle */}
                    <h3 className="text-lg sm:text-[1.3rem] font-semibold text-stone-900 tracking-wide leading-8 mb-1.5">
                      {cls.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-stone-500 leading-6 mb-4 line-clamp-2">
                      {cls.description || "Interactive live session with feedback and practical resin techniques."}
                    </p>

                    {/* Horizontal Metadata Strip */}
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-4 mb-5 text-xs text-stone-700 font-medium">
                      <span className="inline-flex items-center gap-1 whitespace-nowrap">
                        <Calendar size={14} className="text-[#c4431d] shrink-0" />
                        <span>
                          {eventDate.toLocaleDateString("en-IN", {
                            weekday: "short",
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </span>

                      <span className="h-3.5 w-px bg-stone-200 shrink-0" aria-hidden="true" />

                      <span className="inline-flex items-center gap-1 whitespace-nowrap">
                        <Clock size={14} className="text-[#c4431d] shrink-0" />
                        <span className="uppercase">
                          {eventDate.toLocaleTimeString("en-IN", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </span>

                      <span className="h-3.5 w-px bg-stone-200 shrink-0" aria-hidden="true" />

                      <span
                        className="inline-flex items-center gap-1 whitespace-nowrap"
                        title={`${cls.durationMinutes} Minutes Duration`}
                      >
                        <Hourglass size={14} className="text-[#c4431d] shrink-0" />
                        <span>{cls.durationMinutes} Min</span>
                      </span>

                      <span
                        title={`${cls.totalAttendees || 0} Students Attended`}
                        className="inline-flex items-center gap-1 rounded-full bg-[#e9f8eb] text-[#15803d] px-2.5 py-0.5 font-bold whitespace-nowrap"
                      >
                        <Users size={13} className="shrink-0" />
                        <span>{cls.totalAttendees || 0} Attending</span>
                      </span>
                    </div>
                  </div>

                  {/* Bottom Action Row */}
                  <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 pt-1">
                    {cls.meetingUrl && (
                      <a
                        href={cls.meetingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 min-w-[6.25rem] h-10 px-3.5 rounded-full bg-gradient-to-r from-[#942008] via-[#c4431d] to-[#ea580c] hover:opacity-95 text-white font-black text-xs shadow-md shadow-[#c4431d]/25 inline-flex items-center justify-center gap-1.5 transition-all hover:scale-[1.02] cursor-pointer whitespace-nowrap"
                      >
                        <ExternalLink size={14} className="shrink-0" />
                        <span>Join Call</span>
                      </a>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        setRosterModal({ isOpen: true, liveClass: cls });
                        setRosterSearch("");
                      }}
                      title="View Attendance Roster"
                      className="group flex-1 min-w-[7.25rem] h-10 px-3.5 rounded-full bg-white hover:bg-[#fff5ee] text-stone-800 hover:text-[#942008] font-bold text-xs border border-stone-200 hover:border-[#f5ded0] shadow-xs inline-flex items-center justify-center gap-1.5 transition-all cursor-pointer whitespace-nowrap"
                    >
                      <Users size={14} className="text-stone-600 group-hover:text-[#942008] transition-colors shrink-0" />
                      <span>View Roster ({cls.totalAttendees || 0})</span>
                    </button>

                    <div className="relative shrink-0" data-class-menu-root>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenActionMenuId(isMenuOpen ? null : cls.id);
                        }}
                        aria-haspopup="menu"
                        aria-expanded={isMenuOpen}
                        title="More class actions"
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all cursor-pointer border ${isMenuOpen
                          ? "bg-[#fff5ee] text-[#942008] border-[#f5ded0] shadow-xs"
                          : "bg-white text-stone-700 border-stone-200 hover:bg-[#fff5ee] hover:text-[#942008] hover:border-[#f5ded0]"
                          }`}
                      >
                        <Ellipsis size={17} />
                      </button>

                      {isMenuOpen && (
                        <div
                          role="menu"
                          onClick={(e) => e.stopPropagation()}
                          className="absolute right-0 bottom-full mb-2 w-60 bg-white border border-[#ecdccb] rounded-2xl shadow-[0_14px_34px_-10px_rgba(90,55,20,0.22)] p-1.5 z-40 animate-in fade-in duration-150"
                        >
                          <button
                            type="button"
                            role="menuitem"
                            onClick={() => {
                              setOpenActionMenuId(null);
                              handleExportClassAttendance(cls.id, cls.title);
                            }}
                            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left text-xs sm:text-sm font-semibold text-stone-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors cursor-pointer"
                          >
                            <Download size={15} className="shrink-0" />
                            <span>Download Attendance Sheet</span>
                          </button>

                          <button
                            type="button"
                            role="menuitem"
                            onClick={() => {
                              setOpenActionMenuId(null);
                              openEditModal(cls);
                            }}
                            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left text-xs sm:text-sm font-semibold text-stone-700 hover:bg-[#fff5ee] hover:text-[#942008] transition-colors cursor-pointer"
                          >
                            <Edit2 size={15} className="shrink-0 text-stone-600" />
                            <span>Edit Class</span>
                          </button>

                          <div className="my-1 border-t border-[#f5ded0]/70" />

                          <button
                            type="button"
                            role="menuitem"
                            onClick={() => {
                              setOpenActionMenuId(null);
                              handleDeleteClass(cls.id, cls.title);
                            }}
                            disabled={deletingClassId === cls.id}
                            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left text-xs sm:text-sm font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer disabled:opacity-50"
                          >
                            {deletingClassId === cls.id ? <Loader2 size={15} className="animate-spin text-rose-600 shrink-0" /> : <Trash2 size={15} className="shrink-0" />}
                            <span>Delete Class</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Create / Edit Class Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-stone-900/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white border border-[#ecdccb] rounded-3xl max-w-lg w-full p-6 shadow-2xl relative text-stone-900 animate-scale-up max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-5 pb-3 border-b border-stone-200">
                <h3 className="text-lg font-black text-stone-900 flex items-center gap-2">
                  <Video className="text-[#c4431d]" size={18} />
                  {editingClass ? "Edit Live Class" : "Schedule Live Class"}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-stone-100 text-stone-500 hover:bg-stone-200 hover:text-stone-900 flex items-center justify-center cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleSaveClass} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5">Class Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Weekly Resin Masterclass & Live Q&A"
                    className="w-full bg-[#fcfaf7] border border-stone-300 rounded-xl px-3.5 py-2.5 text-sm text-stone-900 font-bold focus:outline-none focus:border-[#c4431d] focus:ring-1 focus:ring-[#c4431d]/30 transition-colors"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1.5">Date &amp; Start Time</label>
                    <input
                      type="datetime-local"
                      value={formData.scheduledAt}
                      onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })}
                      className="w-full bg-[#fcfaf7] border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-[#c4431d] focus:ring-1 focus:ring-[#c4431d]/30 transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1.5">Duration (Minutes)</label>
                    <input
                      type="number"
                      value={formData.durationMinutes}
                      onChange={(e) => setFormData({ ...formData, durationMinutes: parseInt(e.target.value) || 60 })}
                      placeholder="60"
                      className="w-full bg-[#fcfaf7] border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-[#c4431d] focus:ring-1 focus:ring-[#c4431d]/30 transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-stone-700">
                      Target Level Access <span className="text-[#c4431d] font-semibold">(Multi-Select Supported)</span>
                    </label>
                    <span className="text-xs font-bold text-stone-500">
                      Target: <span className="text-[#c4431d] font-bold">{selectedLevels.includes("All") ? "All Membership Levels" : selectedLevels.join(", ")}</span>
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-3 bg-[#fcfaf7] border border-stone-300 rounded-2xl">
                    <button
                      type="button"
                      onClick={() => toggleLevelSelection("All")}
                      className={`col-span-2 sm:col-span-3 px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${selectedLevels.includes("All")
                        ? "bg-gradient-to-r from-[#942008] via-[#c4431d] to-[#ea580c] text-white font-black shadow-xs"
                        : "bg-white border border-stone-200 text-stone-700 hover:border-stone-300"
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
                          className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${selectedLevels.includes("All")
                            ? "bg-stone-50 border border-stone-200 text-stone-400 opacity-70"
                            : isExplicit
                              ? "bg-gradient-to-r from-[#942008] via-[#c4431d] to-[#ea580c] text-white font-black shadow-xs"
                              : "bg-white border border-stone-200 text-stone-700 hover:border-stone-300"
                            }`}
                        >
                          <span className="truncate">{lvl.code} · {lvl.name}</span>
                          {isExplicit && <Check size={13} className="stroke-[3] shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-[#fcfaf7] border border-stone-200 rounded-2xl">
                  <input
                    type="checkbox"
                    id="sendNotification"
                    checked={sendNotification}
                    onChange={(e) => setSendNotification(e.target.checked)}
                    className="w-4 h-4 mt-0.5 rounded text-[#c4431d] accent-[#c4431d] cursor-pointer shrink-0"
                  />
                  <label htmlFor="sendNotification" className="text-xs text-stone-700 cursor-pointer select-none">
                    <span className="font-bold text-stone-900 flex items-center gap-1.5">
                      🔔 Send In-App Bell Notification to Eligible Students
                    </span>
                    <span className="text-xs text-stone-500 block mt-0.5">
                      Eligible students enrolled in {selectedLevels.includes("All") ? "all levels" : selectedLevels.join(", ")} will immediately receive a notification alert with the direct join link.
                    </span>
                  </label>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5">Class Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full bg-[#fcfaf7] border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs text-stone-900 font-bold focus:outline-none focus:border-[#c4431d] focus:ring-1 focus:ring-[#c4431d]/30"
                  >
                    <option value="upcoming">Upcoming</option>
                    <option value="live">🔴 Live Now</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5">Live Meeting URL (Zoom / Google Meet)</label>
                  <input
                    type="url"
                    value={formData.meetingUrl}
                    onChange={(e) => setFormData({ ...formData, meetingUrl: e.target.value })}
                    placeholder="https://zoom.us/j/123456789"
                    className="w-full bg-[#fcfaf7] border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-[#c4431d] focus:ring-1 focus:ring-[#c4431d]/30 font-mono transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5">Recording / Replay Video URL (Optional)</label>
                  <input
                    type="url"
                    value={formData.recordingUrl}
                    onChange={(e) => setFormData({ ...formData, recordingUrl: e.target.value })}
                    placeholder="https://youtube.com/watch?v=xxx or Vimeo URL"
                    className="w-full bg-[#fcfaf7] border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-[#c4431d] focus:ring-1 focus:ring-[#c4431d]/30 font-mono transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5">Description &amp; Agenda</label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="What will students learn in this live coaching session?"
                    className="w-full bg-[#fcfaf7] border border-stone-300 rounded-xl p-3 text-xs text-stone-900 focus:outline-none focus:border-[#c4431d] focus:ring-1 focus:ring-[#c4431d]/30 resize-none transition-colors"
                  />
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-stone-200">
                  <button
                    type="submit"
                    disabled={isSavingClass}
                    className="flex-1 bg-gradient-to-r from-[#942008] via-[#c4431d] to-[#ea580c] hover:opacity-95 text-white font-black text-sm h-11 rounded-xl shadow-md shadow-[#c4431d]/25 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isSavingClass && <Loader2 size={16} className="animate-spin" />}
                    <span>{isSavingClass ? "Saving..." : editingClass ? "Update Live Class" : "Schedule Live Class"}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="border border-stone-300 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-sm h-11 px-5 rounded-xl cursor-pointer"
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
          <div className="fixed inset-0 z-50 bg-stone-900/50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
            <div className="bg-white border border-[#ecdccb] rounded-3xl max-w-2xl w-full p-5 sm:p-8 shadow-2xl relative overflow-hidden text-stone-900 animate-scale-up max-h-[90vh] my-auto flex flex-col">
              {/* Subtle top-right peach accent glow */}
              <div className="pointer-events-none absolute -top-12 -right-8 w-44 h-36 rounded-full bg-[#fde5d6]/85 blur-xl" />

              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-5 relative z-10 shrink-0">
                <div className="min-w-0">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#e9f8eb] px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#15803d] mb-3">
                    <Users size={13} className="shrink-0" /> Live Attendance Roster
                  </span>
                  <div className="flex items-center gap-2.5 sm:gap-3">
                    <span className="w-1 sm:w-1.5 h-6 sm:h-7 rounded-full bg-gradient-to-b from-[#942008] via-[#c4431d] to-[#ea580c] shrink-0" />
                    <h3 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight leading-snug break-words">
                      {rosterModal.liveClass.title}
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-stone-500 mt-1 pl-3.5 sm:pl-4">
                    Total recorded attendees:{" "}
                    <strong className="font-bold text-[#15803d]">
                      {rosterModal.liveClass.totalAttendees} Students
                    </strong>
                  </p>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-start shrink-0">
                  <button
                    onClick={() => handleExportClassAttendance(rosterModal.liveClass?.id, rosterModal.liveClass?.title)}
                    className="px-4 sm:px-5 py-2.5 bg-gradient-to-r from-[#942008] via-[#c4431d] to-[#ea580c] hover:opacity-95 text-white rounded-full text-xs sm:text-sm font-bold shadow-md shadow-[#c4431d]/25 flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap"
                    title="Download this class's attendance sheet (.csv)"
                  >
                    <Download size={14} className="shrink-0" /> Export Sheet
                  </button>
                  <button
                    onClick={() => setRosterModal({ isOpen: false, liveClass: null })}
                    aria-label="Close roster modal"
                    className="w-10 h-10 rounded-full bg-[#faf5f0] text-stone-700 hover:bg-[#fde5d6]/80 hover:text-[#942008] flex items-center justify-center transition-colors cursor-pointer shrink-0"
                  >
                    <X size={17} />
                  </button>
                </div>
              </div>

              {/* Roster Search */}
              <div className="mb-4 relative z-10 shrink-0">
                <div className="flex items-center gap-2.5 w-full bg-white border border-stone-200 focus-within:border-[#c4431d] focus-within:ring-2 focus-within:ring-[#c4431d]/15 rounded-full px-4 py-2.5 transition-all">
                  <Search size={16} className="text-stone-400 shrink-0" />
                  <input
                    type="text"
                    placeholder="Filter attendees by student name or email..."
                    value={rosterSearch}
                    onChange={(e) => setRosterSearch(e.target.value)}
                    className="w-full bg-transparent text-sm sm:text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Attendees List */}
              <div className="overflow-y-auto flex-1 space-y-2.5 pr-1 relative z-10">
                {(rosterModal.liveClass.attendees || []).length === 0 ? (
                  <div className="p-8 sm:p-10 text-center bg-[#fcfaf7] border border-[#ecdccb]/70 rounded-2xl">
                    <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-[#fdeee2] text-[#c4431d] flex items-center justify-center">
                      <Users size={26} />
                    </div>
                    <p className="text-stone-900 text-base sm:text-lg font-black">No Students Joined Yet</p>
                    <p className="text-stone-500 text-xs sm:text-sm mt-1.5 max-w-md mx-auto leading-relaxed">
                      When students click &quot;Join Live Class&quot; on their portal, attendance is automatically recorded here.
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
                          className="p-3.5 bg-[#fcfaf7] border border-stone-200 rounded-2xl flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 hover:border-[#c4431d]/30 transition-colors"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-10 h-10 rounded-xl bg-[#fff5ee] border border-[#f5ded0] flex items-center justify-center font-bold text-[#942008] text-sm shrink-0">
                              {att.studentName.charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <h4 className="font-bold text-stone-900 text-sm truncate">{att.studentName}</h4>
                              <p className="text-xs text-stone-500 truncate">{att.studentEmail}</p>
                              <span className="text-xs text-amber-600 font-semibold block mt-0.5">
                                {att.membershipLevel}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 shrink-0">
                            {joinDate && (
                              <div className="text-right hidden sm:block">
                                <span className="text-xs text-stone-400 block">Joined At</span>
                                <span className="text-xs text-stone-700 font-mono">
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
                              disabled={updatingRosterId === att.userId}
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 ${att.attended
                                ? "bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100"
                                : "bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100"
                                }`}
                            >
                              {updatingRosterId === att.userId ? (
                                <Loader2 size={13} className="animate-spin" />
                              ) : att.attended ? (
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
          <div className="fixed inset-0 z-50 bg-stone-900/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white border border-[#ecdccb] rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl relative text-stone-900 animate-scale-up max-h-[85vh] flex flex-col">

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-stone-200 shrink-0">
                <div>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-[#f5ded0] bg-[#fde5d6] px-3 py-0.5 text-xs font-bold uppercase tracking-wider text-[#942008] mb-1">
                    <History size={13} /> Complete Attendance History &amp; Records
                  </span>
                  <h3 className="text-xl font-black text-stone-900">All Sessions Attendance Ledger</h3>
                  <p className="text-xs text-stone-500">
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
                    className="w-8 h-8 rounded-full bg-stone-100 text-stone-500 hover:bg-stone-200 hover:text-stone-900 flex items-center justify-center cursor-pointer"
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
                  className="w-full bg-[#fcfaf7] border border-stone-300 rounded-xl px-3.5 py-2 text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-[#c4431d] focus:ring-1 focus:ring-[#c4431d]/30 transition-colors"
                />
                <span className="text-xs text-stone-500 shrink-0 hidden sm:inline">
                  Total Records: <strong className="text-stone-900 font-mono">{historyRecords.length}</strong>
                </span>
              </div>

              {/* History Table / Records */}
              <div className="overflow-y-auto flex-1 space-y-2 pr-1">
                {isHistoryLoading ? (
                  <div className="space-y-3 p-2">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="p-3.5 bg-[#fcfaf7] border border-stone-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full shimmer-box shrink-0" />
                          <div className="space-y-2">
                            <div className="w-36 h-3.5 rounded shimmer-box" />
                            <div className="w-48 h-2.5 rounded shimmer-box" />
                          </div>
                        </div>
                        <div className="w-24 h-6 rounded-full shimmer-box" />
                      </div>
                    ))}
                  </div>
                ) : historyRecords.length === 0 ? (
                  <div className="p-12 text-center bg-[#fcfaf7] border border-stone-200 rounded-2xl">
                    <Users size={32} className="text-stone-300 mx-auto mb-2" />
                    <p className="text-stone-700 text-sm font-bold">No Attendance History Recorded Yet</p>
                    <p className="text-stone-400 text-xs mt-1">
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
                          className="p-3.5 bg-[#fcfaf7] border border-stone-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-[#c4431d]/30 transition-colors"
                        >
                          <div className="flex items-start sm:items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-[#fff5ee] border border-[#f5ded0] flex items-center justify-center font-bold text-[#942008] text-sm shrink-0 mt-0.5 sm:mt-0">
                              {rec.studentName?.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <h4 className="font-bold text-stone-900 text-xs sm:text-sm">{rec.studentName}</h4>
                                <span className="text-xs text-amber-400 font-semibold px-2 py-0.5 bg-amber-500/10 border border-amber-500/20 rounded-md">
                                  {rec.studentLevel}
                                </span>
                                {rec.classStatus && rec.classStatus.includes("Removed") && (
                                  <span className="text-xs text-stone-500 font-medium px-1.5 py-0.5 bg-stone-100 border border-stone-200 rounded">
                                    Concluded Session
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-stone-500 mt-0.5">
                                Class: <strong className="text-stone-900">{rec.classTitle}</strong>
                              </p>
                              <p className="text-xs text-stone-400">
                                {rec.studentEmail} {rec.studentPhone && rec.studentPhone !== "N/A" ? `· ${rec.studentPhone}` : ""}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-0 border-stone-200">
                            {joinDate && (
                              <div className="text-left sm:text-right">
                                <span className="text-xs text-stone-400 block">Attended On</span>
                                <span className="text-xs text-stone-700 font-mono">
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
