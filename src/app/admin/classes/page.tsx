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
  Layers
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

  // Attendance Roster Modal
  const [rosterModal, setRosterModal] = useState<{ isOpen: boolean; liveClass: LiveClass | null }>({
    isOpen: false,
    liveClass: null,
  });
  const [rosterSearch, setRosterSearch] = useState("");

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

  useEffect(() => {
    if (token) fetchClasses();
  }, [token]);

  const openCreateModal = () => {
    setEditingClass(null);
    const inTwoDays = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);
    inTwoDays.setMinutes(0);
    const isoString = inTwoDays.toISOString().slice(0, 16);

    setFormData({
      title: "",
      description: "",
      scheduledAt: isoString,
      durationMinutes: 60,
      meetingUrl: "https://zoom.us/j/your-meeting-id",
      recordingUrl: "",
      targetLevel: "All",
      status: "upcoming",
      instructor: "Vrajangna Patel",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (cls: LiveClass) => {
    setEditingClass(cls);
    const localDate = new Date(cls.scheduledAt).toISOString().slice(0, 16);
    setFormData({
      title: cls.title,
      description: cls.description || "",
      scheduledAt: localDate,
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
      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        scheduledAt: new Date(formData.scheduledAt).toISOString(),
        durationMinutes: Number(formData.durationMinutes) || 60,
        meetingUrl: formData.meetingUrl.trim(),
        recordingUrl: formData.recordingUrl.trim(),
        targetLevel: formData.targetLevel,
        status: formData.status,
        instructor: formData.instructor.trim(),
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
        showSuccess(editingClass ? "Live class updated successfully!" : "New live class scheduled!");
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

          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-black text-sm h-11 px-6 rounded-2xl shadow-lg shadow-orange-500/20 transition-all hover:scale-105 cursor-pointer self-start md:self-auto"
          >
            <Plus size={18} /> Schedule Live Class
          </button>
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

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1.5">Target Level Access</label>
                    <select
                      value={formData.targetLevel}
                      onChange={(e) => setFormData({ ...formData, targetLevel: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white font-bold focus:outline-none focus:border-orange-500"
                    >
                      <option value="All">All Membership Levels</option>
                      <option value="L0">L0 Fast Track Only</option>
                      <option value="L1">L1 Silver &amp; Above</option>
                      <option value="L2">L2 Gold &amp; Above</option>
                      <option value="L3">L3 Diamond Only</option>
                    </select>
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
                <button
                  onClick={() => setRosterModal({ isOpen: false, liveClass: null })}
                  className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
                >
                  <X size={16} />
                </button>
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
      </main>
    </div>
  );
}
