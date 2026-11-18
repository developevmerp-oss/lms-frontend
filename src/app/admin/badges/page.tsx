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
  Search
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
      className="min-h-screen bg-[#faf8f5] text-stone-900 font-sans transition-colors lg:pl-[284px]"
      style={{
        backgroundColor: "#faf8f5",
        backgroundImage: "radial-gradient(circle, #e2ded4 1.5px, transparent 1.5px)",
        backgroundSize: "24px 24px",
        backgroundAttachment: "fixed",
      }}
    >
      <AdminNav user={user} logout={logout} />

      <main className="w-full px-4 sm:px-5 lg:px-5 py-5 sm:py-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#f5ded0] bg-[#fde5d6] px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-[#942008] mb-2">
              <Award size={13} className="text-[#c4431d]" /> Gamification &amp; Recognition
            </span>
            <h1 className="text-2xl md:text-3xl font-black text-stone-900 tracking-tight flex items-center gap-3">
              Badge &amp; Reward Management
            </h1>
            <p className="text-stone-500 mt-1 text-sm font-medium">
              Create, edit, and award custom mastery badges and milestone honors to students.
            </p>
          </div>

          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#942008] via-[#c4431d] to-[#ea580c] hover:opacity-95 text-white font-black text-sm h-11 px-6 rounded-2xl shadow-md shadow-[#c4431d]/25 transition-all hover:scale-105 cursor-pointer self-start md:self-auto"
          >
            <Plus size={18} /> Create New Badge
          </button>
        </div>

        {/* Success Alert */}
        {successMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-bold flex items-center gap-2">
            <CheckCircle2 size={18} /> {successMsg}
          </div>
        )}

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 bg-white/95 border border-[#ecdccb] p-4 rounded-2xl shadow-xs">
          <div className="relative w-full sm:w-80">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
              <Search size={16} />
            </div>
            <input
              type="text"
              placeholder="Search badges by title or criteria..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#fcfaf7] border border-stone-300 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-[#c4431d] focus:ring-1 focus:ring-[#c4431d]/30 transition-colors"
            />
          </div>

          <div className="flex items-center gap-3 text-xs text-stone-500 font-medium">
            <span>
              Total Configured Badges: <strong className="text-stone-900 font-mono">{badges.length}</strong>
            </span>
          </div>
        </div>

        {/* Badges Grid */}
        {isLoading ? (
          <div className="p-16 text-center text-stone-400 font-medium">Loading badges...</div>
        ) : filteredBadges.length === 0 ? (
          <div className="text-center py-16 rounded-3xl border border-dashed border-stone-200 bg-white/60 p-8">
            <Award size={40} className="text-stone-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-stone-900 mb-1">No Badges Found</h3>
            <p className="text-sm text-stone-500 mb-4 font-medium">Create badges to reward students for milestones and achievements.</p>
            <button
              onClick={openCreateModal}
              className="bg-gradient-to-r from-[#942008] via-[#c4431d] to-[#ea580c] hover:opacity-95 text-white font-bold text-xs h-10 px-5 rounded-xl shadow-xs cursor-pointer"
            >
              + Create First Badge
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1  lg:grid-cols-3 gap-5 sm:gap-6">
            {filteredBadges.map((badge) => {
              const pillClass = "bg-[#fff1eb] text-[#942008] border-[#f5ded0]/70";

              return (
                <div
                  key={badge.id}
                  className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-[#ecdccb]/90 bg-white shadow-[0_4px_20px_-4px_rgba(90,55,20,0.05)] hover:shadow-md hover:border-[#c4431d]/30 transition-all duration-300 flex flex-col justify-between h-full min-h-[12.25rem] sm:min-h-[13rem] group"
                >
                  {/* Decorative soft peach corner curve matching Image 2 */}
                  <svg
                    viewBox="0 0 100 100"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="absolute top-0 right-0 w-16 sm:w-20 h-10 sm:h-12 pointer-events-none z-0"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M0 0 C5 35 45 100 100 100 L100 0 Z"
                      fill="#faeee5"
                    />
                  </svg>

                  {/* Upper Content Area */}
                  <div className="relative z-10 p-5 sm:p-6 pb-4 sm:pb-5 flex items-start gap-4 sm:gap-4.5 flex-1">
                    {/* Badge Icon Container */}
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#fdf6f0] border border-[#f3e5d7] flex items-center justify-center text-2xl sm:text-3xl shrink-0 group-hover:scale-105 transition-transform duration-300 select-none shadow-[0_2px_8px_-2px_rgba(90,55,20,0.06)]">
                      {badge.icon || "🎨"}
                    </div>

                    {/* Details & XP */}
                    <div className="flex-1 min-w-0 flex flex-col justify-start">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-base sm:text-xl lg:text-lg font-bold text-stone-900 leading-snug tracking-tight">
                          {badge.name}
                        </h3>

                        <span className={`px-2.5 sm:px-3 py-0.5 rounded-full text-xs sm:text-base lg:text-sm font-bold tracking-wide shrink-0 border ${pillClass}`}>
                          {badge.pointsRequired ? `${badge.pointsRequired} XP` : "Milestone"}
                        </span>
                      </div>

                      <p className="text-sm sm:text-lg lg:text-base text-stone-500 font-normal leading-relaxed mt-2 line-clamp-2 sm:line-clamp-3">
                        {badge.description || "Earned by achieving course milestones and creative excellence."}
                      </p>
                    </div>
                  </div>

                  {/* Bottom Action Bar */}
                  <div className="relative z-10 border-t border-[#f0e6dc] flex items-center justify-between py-3.5 sm:py-4 px-4 sm:px-5 bg-white">
                    <button
                      type="button"
                      onClick={() => {
                        setAwardModal({ isOpen: true, badge });
                        setSelectedStudentId("all");
                      }}
                      className="flex-[1.4] flex items-center justify-center gap-1.5 text-sm sm:text-base lg:text-sm font-semibold text-[#b43e18] hover:text-[#942008] transition-colors cursor-pointer py-1 group/btn"
                    >
                      <Send size={13} className="shrink-0 transition-transform group-hover/btn:translate-x-0.5" />
                      <span className="truncate">Award to Student</span>
                    </button>

                    <span className="h-4 w-[1px] bg-[#ecdccb] shrink-0" aria-hidden="true" />

                    <button
                      type="button"
                      onClick={() => openEditModal(badge)}
                      className="flex-1 flex items-center justify-center gap-1.5 text-sm sm:text-base lg:text-sm font-medium sm:font-semibold text-stone-600 hover:text-stone-900 transition-colors cursor-pointer py-1 group/btn"
                    >
                      <Edit2 size={13} className="shrink-0 transition-transform group-hover/btn:scale-110" />
                      <span>Edit</span>
                    </button>

                    <span className="h-4 w-[1px] bg-[#ecdccb] shrink-0" aria-hidden="true" />

                    <button
                      type="button"
                      onClick={() => handleDeleteBadge(badge.id, badge.name)}
                      className="w-10 sm:w-12 flex items-center justify-center text-stone-400 hover:text-rose-600 transition-colors cursor-pointer py-1"
                      title="Delete Badge"
                    >
                      <Trash2 size={15} />
                    </button>
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
