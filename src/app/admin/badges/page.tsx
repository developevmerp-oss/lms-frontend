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
  { label: 'Orange / Artistry', value: 'orange', bg: 'bg-orange-500', text: 'text-orange-400', border: 'border-orange-500/40' },
  { label: 'Emerald / Green', value: 'emerald', bg: 'bg-emerald-500', text: 'text-emerald-400', border: 'border-emerald-500/40' },
  { label: 'Purple / Crystal', value: 'purple', bg: 'bg-purple-500', text: 'text-purple-400', border: 'border-purple-500/40' },
  { label: 'Amber / Gold', value: 'amber', bg: 'bg-amber-500', text: 'text-amber-400', border: 'border-amber-500/40' },
  { label: 'Rose / Passion', value: 'rose', bg: 'bg-rose-500', text: 'text-rose-400', border: 'border-rose-500/40' },
  { label: 'Cyan / Ocean', value: 'cyan', bg: 'bg-cyan-500', text: 'text-cyan-400', border: 'border-cyan-500/40' },
  { label: 'Pink / Bridal', value: 'pink', bg: 'bg-pink-500', text: 'text-pink-400', border: 'border-pink-500/40' },
  { label: 'Yellow / Royalty', value: 'yellow', bg: 'bg-yellow-500', text: 'text-yellow-400', border: 'border-yellow-500/40' },
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

      const resStudents = await fetch(`${API}/admin/students`, { headers });
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
    <div className="min-h-screen bg-slate-950 text-white font-sans">
      <AdminNav user={user} logout={logout} />

      <main className="max-w-[1400px] mx-auto p-4 md:p-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-orange-500/30 bg-orange-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-orange-400 mb-2">
              <Award size={13} className="text-orange-400" /> Gamification &amp; Recognition
            </span>
            <h1 className="text-3xl font-black text-white flex items-center gap-3">
              Badge &amp; Reward Management
            </h1>
            <p className="text-slate-400 mt-1 text-sm">
              Create, edit, and award custom mastery badges and milestone honors to students.
            </p>
          </div>

          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-black text-sm h-11 px-6 rounded-2xl shadow-lg shadow-orange-500/20 transition-all hover:scale-105 cursor-pointer self-start md:self-auto"
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
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input
              type="text"
              placeholder="Search badges by title or criteria..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
            />
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span>
              Total Configured Badges: <strong className="text-white font-mono">{badges.length}</strong>
            </span>
          </div>
        </div>

        {/* Badges Grid */}
        {isLoading ? (
          <div className="p-16 text-center text-slate-500">Loading badges...</div>
        ) : filteredBadges.length === 0 ? (
          <div className="text-center py-16 rounded-3xl border border-dashed border-slate-800 bg-slate-900/40 p-8">
            <Award size={40} className="text-slate-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white mb-1">No Badges Found</h3>
            <p className="text-sm text-slate-400 mb-4">Create badges to reward students for milestones and achievements.</p>
            <button
              onClick={openCreateModal}
              className="bg-orange-500 text-slate-950 font-bold text-xs h-10 px-5 rounded-xl"
            >
              + Create First Badge
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredBadges.map((badge) => {
              const colorConfig = COLOR_OPTIONS.find((c) => c.value === badge.color) || COLOR_OPTIONS[0];

              return (
                <div
                  key={badge.id}
                  className="rounded-3xl border border-slate-800 bg-slate-900/90 p-5 flex flex-col justify-between hover:border-orange-500/40 transition-all shadow-xl group"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="w-12 h-12 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-2xl shadow-inner group-hover:scale-110 transition-transform">
                        {badge.icon || "🎨"}
                      </div>

                      <span className={`px-2.5 py-0.5 rounded-lg text-[11px] font-black border ${colorConfig.bg}/10 ${colorConfig.text} ${colorConfig.border}`}>
                        {badge.pointsRequired ? `${badge.pointsRequired} XP` : "Milestone"}
                      </span>
                    </div>

                    <h3 className="text-base font-black text-white leading-snug mb-1">
                      {badge.name}
                    </h3>

                    <p className="text-xs text-slate-400 leading-relaxed mb-4 line-clamp-3">
                      {badge.description || "Earned by achieving course milestones and creative excellence."}
                    </p>
                  </div>

                  <div className="space-y-2 pt-3 border-t border-slate-800/80">
                    <button
                      onClick={() => {
                        setAwardModal({ isOpen: true, badge });
                        setSelectedStudentId("all");
                      }}
                      className="w-full py-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-black text-xs rounded-xl shadow-md flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Send size={13} /> Award to Student
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditModal(badge)}
                        className="flex-1 py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-slate-700 flex items-center justify-center gap-1 transition-colors cursor-pointer"
                      >
                        <Edit2 size={12} /> Edit
                      </button>
                      <button
                        onClick={() => handleDeleteBadge(badge.id, badge.name)}
                        className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors cursor-pointer"
                        title="Delete Badge"
                      >
                        <Trash2 size={15} />
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
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl relative animate-scale-up">
              <div className="flex justify-between items-center mb-5 pb-3 border-b border-slate-800">
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <Award className="text-orange-400" size={18} />
                  {editingBadge ? `Edit Badge: ${editingBadge.name}` : "Create New Badge"}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleSaveBadge} className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1.5">Badge Title / Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Geode Master"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white font-bold focus:outline-none focus:border-orange-500"
                    required
                  />
                </div>

                {/* Points Required */}
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1.5">Points / XP Requirement</label>
                  <input
                    type="number"
                    value={formData.pointsRequired}
                    onChange={(e) => setFormData({ ...formData, pointsRequired: parseInt(e.target.value) || 0 })}
                    placeholder="e.g. 500"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-amber-400 font-mono font-bold focus:outline-none focus:border-orange-500"
                  />
                </div>

                {/* Icon Selection */}
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1.5">Choose Icon / Emoji</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {EMOJI_PRESETS.map((em, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setFormData({ ...formData, icon: em })}
                        className={`w-9 h-9 rounded-xl border flex items-center justify-center text-lg transition-all cursor-pointer ${
                          formData.icon === em
                            ? "bg-orange-500/20 border-orange-500 scale-110"
                            : "bg-slate-950 border-slate-800 hover:border-slate-700"
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
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                  />
                </div>

                {/* Theme Color */}
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1.5">Theme Color</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {COLOR_OPTIONS.map((c) => (
                      <button
                        key={c.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, color: c.value })}
                        className={`p-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                          formData.color === c.value
                            ? "bg-slate-800 border-white text-white shadow-md"
                            : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
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
                  <label className="block text-xs font-bold text-slate-400 mb-1.5">Description &amp; Criteria</label>
                  <textarea
                    rows={2}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="e.g. Mastered 3D geode crystal inlays & agate shapes."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-orange-500 resize-none"
                  />
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-slate-800">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 text-slate-950 font-black text-sm h-11 rounded-xl shadow-lg transition-all cursor-pointer"
                  >
                    {editingBadge ? "Update Badge" : "Create Badge"}
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

        {/* Award Badge Modal */}
        {awardModal.isOpen && awardModal.badge && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl relative animate-scale-up">
              <div className="flex justify-between items-center mb-5 pb-3 border-b border-slate-800">
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <Send className="text-orange-400" size={18} /> Award Badge
                </h3>
                <button
                  onClick={() => setAwardModal({ isOpen: false, badge: null })}
                  className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="rounded-2xl bg-slate-950 border border-slate-800 p-4 mb-4 flex items-center gap-3">
                <span className="text-3xl">{awardModal.badge.icon}</span>
                <div>
                  <h4 className="font-black text-white text-sm">{awardModal.badge.name}</h4>
                  <p className="text-xs text-slate-400">{awardModal.badge.description}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1.5">Select Recipient Student</label>
                  <select
                    value={selectedStudentId}
                    onChange={(e) => setSelectedStudentId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white font-bold focus:outline-none focus:border-orange-500 cursor-pointer"
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
                    className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 text-slate-950 font-black text-sm h-11 rounded-xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Send size={15} /> {isAwarding ? "Awarding..." : "Confirm & Award"}
                  </button>
                  <button
                    onClick={() => setAwardModal({ isOpen: false, badge: null })}
                    className="border border-slate-700 bg-slate-800 text-slate-300 font-semibold text-sm h-11 px-5 rounded-xl cursor-pointer"
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
