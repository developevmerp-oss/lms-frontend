"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { AdminNav } from "@/components/layout/AdminNav";
import {
  Award,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  Sparkles,
  Users,
  Trophy,
  Star,
  Flame,
  Zap,
  Info,
  Send,
  X,
  Search,
  ArrowDownRight
} from "lucide-react";
import { API_BASE_URL } from "@/config/api";

interface Badge {
  id: string;
  name: string;
  icon: string;
  color: string;
  description?: string;
  pointsRequired?: number;
  users?: any[];
}

const COLOR_OPTIONS = [
  { label: 'Terracotta / Artistry', value: 'orange', bg: 'bg-[#c4431d]', pillBg: 'bg-[#fff1eb]', text: 'text-[#942008]', border: 'border-[#f5ded0]/70' },
  { label: 'Emerald / Green', value: 'emerald', bg: 'bg-emerald-500', pillBg: 'bg-[#fff1eb]', text: 'text-[#942008]', border: 'border-[#f5ded0]/70' },
  { label: 'Purple / Crystal', value: 'purple', bg: 'bg-purple-500', pillBg: 'bg-[#fff1eb]', text: 'text-[#942008]', border: 'border-[#f5ded0]/70' },
  { label: 'Amber / Gold', value: 'amber', bg: 'bg-amber-500', pillBg: 'bg-[#fff1eb]', text: 'text-[#942008]', border: 'border-[#f5ded0]/70' },
  { label: 'Rose / Passion', value: 'rose', bg: 'bg-rose-500', pillBg: 'bg-[#fff1eb]', text: 'text-[#942008]', border: 'border-[#f5ded0]/70' },
  { label: 'Cyan / Ocean', value: 'cyan', bg: 'bg-cyan-500', pillBg: 'bg-[#fff1eb]', text: 'text-[#942008]', border: 'border-[#f5ded0]/70' },
  { label: 'Pink / Bridal', value: 'pink', bg: 'bg-pink-500', pillBg: 'bg-[#fff1eb]', text: 'text-[#942008]', border: 'border-[#f5ded0]/70' },
  { label: 'Yellow / Royalty', value: 'yellow', bg: 'bg-yellow-500', pillBg: 'bg-[#fff1eb]', text: 'text-[#942008]', border: 'border-[#f5ded0]/70' },
];

const EMOJI_PRESETS = ['🎨', '💰', '💎', '⏰', '🔥', '🌊', '💐', '👑', '⭐', '⚡', '🏆', '🚀', '🔮', '🛡️', '🌟'];

const PASTEL_BG_COLORS = [
  "bg-[#fff2e8]",
  "bg-[#fef9e7]",
  "bg-[#fdf0f4]",
  "bg-[#edf5fd]",
  "bg-[#fff4eb]",
  "bg-[#eaf6fc]",
  "bg-[#f8edfb]",
  "bg-[#fef7e9]",
];

export default function AdminBadges() {
  const { token, user, logout } = useAuth();
  const [badges, setBadges] = useState<Badge[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Create / Edit Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBadge, setEditingBadge] = useState<Badge | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    icon: "🎨",
    color: "orange",
    description: "",
    pointsRequired: 100,
  });

  // Award Badge Modal State
  const [awardModal, setAwardModal] = useState<{ isOpen: boolean; badge: Badge | null }>({
    isOpen: false,
    badge: null,
  });
  const [selectedStudentId, setSelectedStudentId] = useState("all");
  const [isAwarding, setIsAwarding] = useState(false);

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

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const resBadges = await fetch(`${API}/admin/badges`, { headers });
      const dataBadges = await resBadges.json();
      if (Array.isArray(dataBadges)) {
        setBadges(dataBadges);
      }

      const resStudents = await fetch(`${API}/admin/students/summary`, { headers });
      const dataStudents = await resStudents.json();
      if (Array.isArray(dataStudents)) {
        setStudents(dataStudents);
      }

    } catch (err) {
      console.error("Error fetching badges:", err);
      showError("Failed to fetch badge configurations");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchData();
  }, [token]);

  const openCreateModal = () => {
    setEditingBadge(null);
    setFormData({
      name: "",
      icon: "🎨",
      color: "orange",
      description: "",
      pointsRequired: 100,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (badge: Badge) => {
    setEditingBadge(badge);
    setFormData({
      name: badge.name,
      icon: badge.icon || "🎨",
      color: badge.color || "orange",
      description: badge.description || "",
      pointsRequired: badge.pointsRequired || 0,
    });
    setIsModalOpen(true);
  };

  const handleSaveBadge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showError("Badge name is required");
      return;
    }

    try {
      const payload = {
        name: formData.name.trim(),
        icon: formData.icon,
        color: formData.color,
        description: formData.description.trim(),
        pointsRequired: Number(formData.pointsRequired) || 0,
      };

      let res;
      if (editingBadge) {
        res = await fetch(`${API}/admin/badges/${editingBadge.id}`, {
          method: "PUT",
          headers,
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch(`${API}/admin/badges`, {
          method: "POST",
          headers,
          body: JSON.stringify(payload),
        });
      }

      const data = await res.json();
      if (res.ok) {
        showSuccess(editingBadge ? "Badge updated successfully!" : "New badge created successfully!");
        setIsModalOpen(false);
        fetchData();
      } else {
        showError(data.message || "Failed to save badge");
      }
    } catch (err: any) {
      showError(err.message || "An error occurred");
    }
  };

  const handleDeleteBadge = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete badge "${name}"?`)) return;
    try {
      const res = await fetch(`${API}/admin/badges/${id}`, {
        method: "DELETE",
        headers,
      });
      if (res.ok) {
        showSuccess(`Badge "${name}" deleted successfully`);
        fetchData();
      } else {
        showError("Failed to delete badge");
      }
    } catch (err: any) {
      showError(err.message || "An error occurred");
    }
  };

  const handleAwardBadge = async () => {
    if (!awardModal.badge) return;
    setIsAwarding(true);
    try {
      const res = await fetch(`${API}/admin/students/${selectedStudentId}/badges`, {
        method: "POST",
        headers,
        body: JSON.stringify({ badgeId: awardModal.badge.id }),
      });

      const data = await res.json();
      if (res.ok) {
        showSuccess(
          selectedStudentId === "all"
            ? `Awarded "${awardModal.badge.name}" to All Students!`
            : `Badge awarded successfully!`
        );
        setAwardModal({ isOpen: false, badge: null });
        fetchData();
      } else {
        showError(data.message || "Failed to award badge");
      }
    } catch (err: any) {
      showError(err.message || "An error occurred");
    } finally {
      setIsAwarding(false);
    }
  };

  const filteredBadges = badges.filter((b) =>
    b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (b.description || "").toLowerCase().includes(searchQuery.toLowerCase())
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

      <main className="w-full px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            {/* Upper Pill Badge matching reference image */}
            <div className="inline-flex items-center gap-1.5 rounded-full bg-[#fde5d6]/80 border border-[#f5ded0] text-[#942008] text-[0.6875rem] sm:text-xs font-bold uppercase tracking-wider px-3 py-1 mb-2">
              {/* <Search size={11} className="text-[#c4431d]" /> */}
              <span>GAMIFICATION &amp; RECOGNITION</span>
            </div>
            <h1 className="text-2xl sm:text-[1.75rem] font-bold text-stone-900 tracking-tight">
              Badge &amp; Reward Management
            </h1>
            <p className="text-stone-500 text-xs sm:text-sm mt-0.5">
              Create, edit, and award custom mastery badges and milestone honors to students.
            </p>
          </div>

          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-1.5 bg-[#c4431d] hover:bg-[#a93313] text-white font-bold text-xs sm:text-sm h-10 px-4 sm:px-5 rounded-xl shadow-xs transition-all cursor-pointer self-start sm:self-auto shrink-0"
          >
            <Plus size={16} /> Create New Badge
          </button>
        </div>

        {/* Success Alert */}
        {successMsg && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-semibold flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Search & Total Configured Badges Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          {/* Search Input */}
          <div className="relative w-full sm:w-80 md:w-96">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search badges by title or criteria..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-stone-200/90 rounded-xl pl-9 pr-4 py-2 text-xs sm:text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:border-[#c4431d] shadow-2xs transition-colors"
            />
          </div>

          {/* Total Configured Badges Badge */}
          <div className="flex items-center gap-2 text-xs sm:text-sm text-stone-500 font-medium self-end sm:self-auto">
            <span>Total Configured Badges:</span>
            <span className="inline-flex items-center justify-center min-w-[1.75rem] h-6 px-2 text-xs sm:text-sm font-bold text-stone-900 bg-white border border-stone-200/90 rounded-lg shadow-2xs font-mono">
              {filteredBadges.length}
            </span>
          </div>
        </div>

        {/* Badges Grid matching reference image */}
        {isLoading ? (
          <div className="p-16 text-center text-stone-400 font-medium text-xs sm:text-sm">Loading badges...</div>
        ) : filteredBadges.length === 0 ? (
          <div className="text-center py-16 rounded-2xl border border-dashed border-stone-300 bg-white/70 p-8">
            <Award size={36} className="text-stone-300 mx-auto mb-3" />
            <h3 className="text-sm sm:text-base font-bold text-stone-900 mb-1">No Badges Found</h3>
            <p className="text-xs sm:text-sm text-stone-500 mb-4 font-medium">Create badges to reward students for milestones and achievements.</p>
            <button
              onClick={openCreateModal}
              className="bg-[#c4431d] hover:bg-[#a93313] text-white font-bold text-xs h-9 px-4 rounded-xl shadow-xs cursor-pointer"
            >
              + Create First Badge
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {filteredBadges.map((badge, index) => {
              const bgClass = PASTEL_BG_COLORS[index % PASTEL_BG_COLORS.length];

              return (
                <div
                  key={badge.id}
                  className="bg-white rounded-2xl border border-stone-200/80 shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden group"
                >
                  {/* Upper Content Area */}
                  <div className="p-4 sm:p-5 flex items-start gap-3.5">
                    {/* Badge Icon Box with soft pastel background */}
                    <div
                      className={`w-12 h-12 sm:w-13 sm:h-13 rounded-2xl flex items-center justify-center text-xl sm:text-2xl shrink-0 group-hover:scale-105 transition-transform duration-200 select-none ${bgClass}`}
                    >
                      {badge.icon || "🎨"}
                    </div>

                    {/* Details & XP */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="text-xs sm:text-sm font-bold text-stone-900 truncate" title={badge.name}>
                          {badge.name}
                        </h3>

                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[0.6875rem] font-bold bg-[#fef5ee] text-[#c4431d] border border-[#fbdcd0] shrink-0 font-mono whitespace-nowrap">
                          {badge.pointsRequired ? `${badge.pointsRequired} XP` : "Milestone"}
                        </span>
                      </div>

                      <p className="text-stone-400 text-[0.6875rem] sm:text-xs mt-1.5 line-clamp-2 leading-relaxed">
                        {badge.description || "Earned by achieving course milestones and creative excellence."}
                      </p>
                    </div>
                  </div>

                  {/* Bottom Action Bar */}
                  <div className="border-t border-stone-100 px-4 py-2.5 sm:px-5 sm:py-3 flex items-center justify-between bg-white text-xs">
                    <button
                      type="button"
                      onClick={() => {
                        setAwardModal({ isOpen: true, badge });
                        setSelectedStudentId("all");
                      }}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#c4431d] hover:text-[#942008] transition-colors cursor-pointer group/btn"
                    >
                      <ArrowDownRight size={13} className="stroke-[2.5] transition-transform group-hover/btn:translate-x-0.5" />
                      <span>Award to Student</span>
                    </button>

                    <div className="flex items-center gap-2.5 text-stone-400 text-xs">
                      <button
                        type="button"
                        onClick={() => openEditModal(badge)}
                        className="inline-flex items-center gap-1 hover:text-stone-700 transition-colors cursor-pointer"
                      >
                        <Edit2 size={12} />
                        <span>Edit</span>
                      </button>
                      <span className="text-stone-200">|</span>
                      <button
                        type="button"
                        onClick={() => handleDeleteBadge(badge.id, badge.name)}
                        className="hover:text-red-500 transition-colors cursor-pointer p-0.5"
                        title="Delete Badge"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Create / Edit Badge Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-stone-900/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white border border-[#ecdccb] rounded-3xl max-w-md w-full p-6 shadow-2xl relative text-stone-900 animate-scale-up">
              <div className="flex justify-between items-center mb-5 pb-3 border-b border-stone-200">
                <h3 className="text-lg font-black text-stone-900 flex items-center gap-2">
                  <Award className="text-[#c4431d]" size={18} />
                  {editingBadge ? `Edit Badge: ${editingBadge.name}` : "Create New Badge"}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-stone-100 text-stone-500 hover:bg-stone-200 hover:text-stone-900 flex items-center justify-center cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleSaveBadge} className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5">Badge Title / Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Geode Master"
                    className="w-full bg-[#fcfaf7] border border-stone-300 rounded-xl px-3.5 py-2.5 text-sm text-stone-900 font-bold focus:outline-none focus:border-[#c4431d] focus:ring-1 focus:ring-[#c4431d]/30 transition-colors"
                    required
                  />
                </div>

                {/* Points Required */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5">Points / XP Requirement</label>
                  <input
                    type="number"
                    value={formData.pointsRequired}
                    onChange={(e) => setFormData({ ...formData, pointsRequired: parseInt(e.target.value) || 0 })}
                    placeholder="e.g. 500"
                    className="w-full bg-[#fcfaf7] border border-stone-300 rounded-xl px-3.5 py-2.5 text-sm text-amber-700 font-mono font-bold focus:outline-none focus:border-[#c4431d] focus:ring-1 focus:ring-[#c4431d]/30 transition-colors"
                  />
                </div>

                {/* Icon Selection */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5">Choose Icon / Emoji</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {EMOJI_PRESETS.map((em, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setFormData({ ...formData, icon: em })}
                        className={`w-9 h-9 rounded-xl border flex items-center justify-center text-lg transition-all cursor-pointer ${formData.icon === em
                            ? "bg-[#fff5ee] border-[#c4431d] scale-110 shadow-xs"
                            : "bg-[#fcfaf7] border-stone-200 hover:border-stone-300"
                          }`}
                      >
                        {em}
                      </button>
                    ))}
                  </div>
                  <input
                    type="text"
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    placeholder="Or type custom emoji"
                    className="w-full bg-[#fcfaf7] border border-stone-300 rounded-xl px-3.5 py-2 text-xs text-stone-900 focus:outline-none focus:border-[#c4431d] focus:ring-1 focus:ring-[#c4431d]/30 transition-colors"
                  />
                </div>

                {/* Theme Color */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5">Theme Color</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {COLOR_OPTIONS.map((c) => (
                      <button
                        key={c.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, color: c.value })}
                        className={`p-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${formData.color === c.value
                            ? "bg-stone-200 border-[#c4431d] text-stone-900 shadow-xs"
                            : "bg-[#fcfaf7] border-stone-200 text-stone-600 hover:border-stone-300"
                          }`}
                      >
                        <span className={`w-2.5 h-2.5 rounded-full ${c.bg}`} />
                        <span className="truncate">{c.label.split("/")[0]}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5">Description &amp; Criteria</label>
                  <textarea
                    rows={2}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="e.g. Mastered 3D geode crystal inlays & agate shapes."
                    className="w-full bg-[#fcfaf7] border border-stone-300 rounded-xl p-3 text-xs text-stone-900 focus:outline-none focus:border-[#c4431d] focus:ring-1 focus:ring-[#c4431d]/30 resize-none transition-colors"
                  />
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-stone-200">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-[#942008] via-[#c4431d] to-[#ea580c] hover:opacity-95 text-white font-black text-sm h-11 rounded-xl shadow-md shadow-[#c4431d]/25 transition-all cursor-pointer"
                  >
                    {editingBadge ? "Update Badge" : "Create Badge"}
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

        {/* Award Badge Modal */}
        {awardModal.isOpen && awardModal.badge && (
          <div className="fixed inset-0 z-50 bg-stone-900/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white border border-[#ecdccb] rounded-3xl max-w-md w-full p-6 shadow-2xl relative text-stone-900 animate-scale-up">
              <div className="flex justify-between items-center mb-5 pb-3 border-b border-stone-200">
                <h3 className="text-lg font-black text-stone-900 flex items-center gap-2">
                  <Send className="text-[#c4431d]" size={18} /> Award Badge
                </h3>
                <button
                  onClick={() => setAwardModal({ isOpen: false, badge: null })}
                  className="w-8 h-8 rounded-full bg-stone-100 text-stone-500 hover:bg-stone-200 hover:text-stone-900 flex items-center justify-center cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="rounded-2xl bg-[#fcfaf7] border border-stone-200 p-4 mb-4 flex items-center gap-3">
                <span className="text-3xl">{awardModal.badge.icon}</span>
                <div>
                  <h4 className="font-black text-stone-900 text-sm">{awardModal.badge.name}</h4>
                  <p className="text-xs text-stone-500">{awardModal.badge.description}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5">Select Recipient Student</label>
                  <select
                    value={selectedStudentId}
                    onChange={(e) => setSelectedStudentId(e.target.value)}
                    className="w-full bg-[#fcfaf7] border border-stone-300 rounded-xl px-3.5 py-2.5 text-sm text-stone-900 font-bold focus:outline-none focus:border-[#c4431d] focus:ring-1 focus:ring-[#c4431d]/30 transition-colors cursor-pointer"
                  >
                    <option value="all">⭐ All Enrolled Students ({students.length} Students)</option>
                    {students.map((st) => (
                      <option key={st.id} value={st.id}>
                        {st.name} ({st.email})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-3 pt-3">
                  <button
                    onClick={handleAwardBadge}
                    disabled={isAwarding}
                    className="flex-1 bg-gradient-to-r from-[#942008] via-[#c4431d] to-[#ea580c] hover:opacity-95 text-white font-black text-sm h-11 rounded-xl shadow-md shadow-[#c4431d]/25 transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Send size={15} /> {isAwarding ? "Awarding..." : "Confirm & Award"}
                  </button>
                  <button
                    onClick={() => setAwardModal({ isOpen: false, badge: null })}
                    className="border border-stone-300 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-sm h-11 px-5 rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
