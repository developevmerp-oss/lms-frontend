"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { AdminNav } from "@/components/layout/AdminNav";
import {
  Trophy,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  Sparkles,
  Zap,
  Award,
  Crown,
  Gem,
  Users,
  Layers,
  ArrowRight,
  HelpCircle,
  Eye
} from "lucide-react";
import { API_BASE_URL } from "@/config/api";

interface LevelTier {
  id: string;
  code: string;
  name: string;
  minPoints: number;
  maxPoints: number | null;
  icon: string;
  badgeColor: string;
  order: number;
  description?: string;
}

const COLOR_OPTIONS = [
  { label: 'Emerald / Green', value: 'emerald', bg: 'bg-emerald-500', text: 'text-emerald-400', border: 'border-emerald-500/40' },
  { label: 'Silver / Slate', value: 'slate', bg: 'bg-slate-400', text: 'text-slate-300', border: 'border-slate-400/40' },
  { label: 'Amber / Gold', value: 'amber', bg: 'bg-amber-500', text: 'text-amber-400', border: 'border-amber-500/40' },
  { label: 'Cyan / Diamond', value: 'cyan', bg: 'bg-cyan-500', text: 'text-cyan-400', border: 'border-cyan-500/40' },
  { label: 'Purple / Royal', value: 'purple', bg: 'bg-purple-500', text: 'text-purple-400', border: 'border-purple-500/40' },
  { label: 'Rose / Pink', value: 'rose', bg: 'bg-rose-500', text: 'text-rose-400', border: 'border-rose-500/40' },
  { label: 'Blue / Ocean', value: 'blue', bg: 'bg-blue-500', text: 'text-blue-400', border: 'border-blue-500/40' },
];

const EMOJI_PRESETS = ['⚡', '🌱', '🥈', '🥇', '🏆', '💎', '👑', '🎨', '🔥', '⭐', '🚀', '🔮'];

export default function AdminLevels() {
  const { token, user, logout } = useAuth();
  const [levels, setLevels] = useState<LevelTier[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTier, setEditingTier] = useState<LevelTier | null>(null);
  const [formData, setFormData] = useState({
    code: 'L1',
    name: '',
    minPoints: 500,
    maxPoints: 4999,
    icon: '🥈',
    badgeColor: 'slate',
    order: 1,
    description: ''
  });

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
      // Fetch level tiers
      const resLevels = await fetch(`${API}/admin/levels`, { headers });
      const dataLevels = await resLevels.json();
      if (Array.isArray(dataLevels)) {
        setLevels(dataLevels);
      }

      // Fetch students to calculate distribution
      const resStudents = await fetch(`${API}/admin/students`, { headers });
      const dataStudents = await resStudents.json();
      if (Array.isArray(dataStudents)) {
        setStudents(dataStudents);
      }
    } catch (err) {
      console.error("Error fetching levels:", err);
      showError("Failed to fetch level configurations");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchData();
  }, [token]);

  const openCreateModal = () => {
    setEditingTier(null);
    const nextOrder = levels.length;
    setFormData({
      code: `L${nextOrder}`,
      name: '',
      minPoints: levels.length > 0 ? (levels[levels.length - 1].maxPoints || 10000) + 1 : 0,
      maxPoints: 9999,
      icon: '🏆',
      badgeColor: 'amber',
      order: nextOrder,
      description: ''
    });
    setIsModalOpen(true);
  };

  const openEditModal = (tier: LevelTier) => {
    setEditingTier(tier);
    setFormData({
      code: tier.code,
      name: tier.name,
      minPoints: tier.minPoints,
      maxPoints: tier.maxPoints || 0,
      icon: tier.icon || '⚡',
      badgeColor: tier.badgeColor || 'emerald',
      order: tier.order,
      description: tier.description || ''
    });
    setIsModalOpen(true);
  };

  const handleSaveTier = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.code.trim()) {
      showError("Please fill in level code and name");
      return;
    }

    try {
      if (editingTier) {
        // Update existing tier
        const res = await fetch(`${API}/admin/levels/${editingTier.id}`, {
          method: 'PUT',
          headers,
          body: JSON.stringify(formData)
        });
        if (!res.ok) throw new Error("Failed to update tier");
        showSuccess(`Level "${formData.name}" updated successfully!`);
      } else {
        // Create new tier
        const res = await fetch(`${API}/admin/levels`, {
          method: 'POST',
          headers,
          body: JSON.stringify(formData)
        });
        if (!res.ok) throw new Error("Failed to create tier");
        showSuccess(`Level "${formData.name}" created successfully!`);
      }

      setIsModalOpen(false);
      await fetchData();
    } catch (err: any) {
      console.error(err);
      showError(err.message || "Error saving level tier");
    }
  };

  const handleDeleteTier = async (tierId: string, name: string) => {
    if (!confirm(`Are you sure you want to delete level "${name}"?`)) return;
    try {
      const res = await fetch(`${API}/admin/levels/${tierId}`, {
        method: 'DELETE',
        headers
      });
      if (!res.ok) throw new Error("Failed to delete tier");
      showSuccess(`Level "${name}" deleted`);
      await fetchData();
    } catch (err: any) {
      console.error(err);
      showError("Error deleting level");
    }
  };

  // Helper to count students in this tier
  const getStudentCountInTier = (tier: LevelTier) => {
    return students.filter(s => {
      const pts = s.points || 0;
      if (tier.maxPoints !== null && tier.maxPoints !== undefined && tier.maxPoints > 0) {
        return pts >= tier.minPoints && pts <= tier.maxPoints;
      }
      return pts >= tier.minPoints;
    }).length;
  };

  const getColorTheme = (colorName: string) => {
    return COLOR_OPTIONS.find(c => c.value === colorName) || COLOR_OPTIONS[0];
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <AdminNav user={user} logout={logout} />

      <main className="max-w-[1500px] mx-auto p-4 md:p-8 space-y-6">
        
        {/* Header Title Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-3xl relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-2xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400 shadow-inner">
                <Trophy size={22} />
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                Level & Tier Configuration
              </h1>
            </div>
            <p className="text-slate-400 text-sm max-w-2xl">
              Configure student membership tiers, customize minimum XP requirements, and assign badge icons & colors. Changes immediately reflect across all student headers and leaderboards.
            </p>
          </div>

          <button
            onClick={openCreateModal}
            className="relative z-10 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-black text-sm px-6 py-3.5 rounded-2xl transition-all shadow-lg shadow-orange-500/25 flex items-center gap-2 shrink-0 hover:scale-105"
          >
            <Plus size={18} className="stroke-[3]" /> Add Level Tier
          </button>
        </div>

        {/* Notifications */}
        {successMsg && (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-bold rounded-2xl flex items-center gap-2 animate-fade-in shadow-lg">
            <CheckCircle2 size={18} /> {successMsg}
          </div>
        )}
        {errorMsg && (
          <div className="p-4 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm font-bold rounded-2xl flex items-center gap-2 animate-fade-in shadow-lg">
            <CheckCircle2 size={18} /> {errorMsg}
          </div>
        )}

        {/* Level Tiers Grid */}
        {isLoading ? (
          <div className="p-12 text-center text-slate-500">Loading configured level tiers...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {levels.map((tier, idx) => {
              const theme = getColorTheme(tier.badgeColor);
              const studentCount = getStudentCountInTier(tier);

              return (
                <div
                  key={tier.id || idx}
                  className={`bg-slate-900 border ${theme.border} rounded-3xl p-6 relative overflow-hidden shadow-xl flex flex-col justify-between hover:border-orange-500/40 transition-all duration-300 group`}
                >
                  <div>
                    {/* Top Tier Meta */}
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-2xl ${theme.bg}/20 border ${theme.border} flex items-center justify-center text-2xl shadow-inner`}>
                          {tier.icon}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-black px-2.5 py-0.5 rounded-md bg-slate-800 text-white border border-slate-700">
                              {tier.code}
                            </span>
                            <span className={`text-xs font-bold ${theme.text}`}>
                              Tier #{idx + 1}
                            </span>
                          </div>
                          <h3 className="text-xl font-black text-white mt-0.5">{tier.name}</h3>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => openEditModal(tier)}
                          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                          title="Edit level"
                        >
                          <Edit2 size={15} />
                        </button>
                        {levels.length > 1 && (
                          <button
                            onClick={() => handleDeleteTier(tier.id, tier.name)}
                            className="p-2 rounded-xl bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors"
                            title="Delete level"
                          >
                            <Trash2 size={15} />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Threshold Points Box */}
                    <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-4 mb-4">
                      <div className="flex justify-between items-center text-xs text-slate-400 mb-1">
                        <span>Required XP Range:</span>
                        <span className="font-mono text-white font-bold">
                          {tier.minPoints.toLocaleString()} XP
                          {tier.maxPoints ? ` → ${tier.maxPoints.toLocaleString()} XP` : ' and above'}
                        </span>
                      </div>
                      
                      {/* Mini Bar */}
                      <div className="w-full h-1.5 bg-slate-800 rounded-full mt-2 overflow-hidden">
                        <div
                          className={`h-full ${theme.bg} rounded-full`}
                          style={{ width: `${Math.min(100, Math.max(15, (tier.minPoints / (levels[levels.length - 1].minPoints || 1)) * 100))}%` }}
                        />
                      </div>
                    </div>

                    {/* Description */}
                    {tier.description && (
                      <p className="text-xs text-slate-400 mb-4 leading-relaxed line-clamp-2">
                        {tier.description}
                      </p>
                    )}
                  </div>

                  {/* Footer Badge Preview & Students Count */}
                  <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                      <Users size={14} className="text-slate-500" />
                      <span><strong>{studentCount}</strong> student{studentCount === 1 ? '' : 's'} in tier</span>
                    </div>

                    {/* Live Badge Preview */}
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl border ${theme.border} ${theme.bg}/10 text-xs font-black ${theme.text}`}>
                      <span>{tier.icon}</span>
                      <span>{tier.code}</span>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}

        {/* Modal for Editing / Creating Tier */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl relative overflow-hidden animate-scale-up">
              
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-800">
                <h3 className="text-xl font-black text-white flex items-center gap-2">
                  <Trophy className="text-orange-400" size={20} />
                  {editingTier ? `Edit Level (${editingTier.code})` : 'Create New Level Tier'}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveTier} className="space-y-4">
                
                {/* Code & Name */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-1">
                    <label className="block text-xs font-bold text-slate-400 mb-1.5">Tier Code</label>
                    <input
                      type="text"
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                      placeholder="e.g. L1"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white font-bold focus:outline-none focus:border-orange-500"
                      required
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-xs font-bold text-slate-400 mb-1.5">Level Title / Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Silver Member"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white font-bold focus:outline-none focus:border-orange-500"
                      required
                    />
                  </div>
                </div>

                {/* Min & Max Points */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1.5">Minimum XP Required</label>
                    <input
                      type="number"
                      value={formData.minPoints}
                      onChange={(e) => setFormData({ ...formData, minPoints: parseInt(e.target.value) || 0 })}
                      placeholder="0"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white font-mono font-bold focus:outline-none focus:border-orange-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1.5">Maximum XP (Optional)</label>
                    <input
                      type="number"
                      value={formData.maxPoints || ''}
                      onChange={(e) => setFormData({ ...formData, maxPoints: e.target.value ? parseInt(e.target.value) : 0 })}
                      placeholder="Leave blank for highest tier"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white font-mono font-bold focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                {/* Icon Selection & Color */}
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1.5">Choose Icon / Emoji</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {EMOJI_PRESETS.map((em, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setFormData({ ...formData, icon: em })}
                        className={`w-9 h-9 rounded-xl border flex items-center justify-center text-lg transition-all ${
                          formData.icon === em
                            ? 'bg-orange-500/20 border-orange-500 scale-110'
                            : 'bg-slate-950 border-slate-800 hover:border-slate-700'
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
                    placeholder="Or type custom emoji/icon"
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
                        onClick={() => setFormData({ ...formData, badgeColor: c.value })}
                        className={`p-2 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all ${
                          formData.badgeColor === c.value
                            ? 'bg-slate-800 border-white text-white shadow-md'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <span className={`w-3 h-3 rounded-full ${c.bg}`} />
                        <span className="truncate">{c.label.split('/')[0]}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1.5">Level Description (Optional)</label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="e.g. Master core techniques and launch your first sale"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500"
                  />
                </div>

                {/* Live Preview Box */}
                <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-slate-500 block">Live Student Badge Preview</span>
                    <span className="text-sm font-bold text-white">{formData.name || 'Level Name'}</span>
                  </div>
                  <div className={`px-3 py-1 rounded-xl border ${getColorTheme(formData.badgeColor).border} ${getColorTheme(formData.badgeColor).bg}/10 font-black text-xs ${getColorTheme(formData.badgeColor).text} flex items-center gap-1.5`}>
                    <span>{formData.icon}</span>
                    <span>{formData.code || 'L0'}</span>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="pt-3 border-t border-slate-800 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2.5 text-xs font-bold text-slate-400 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-slate-950 font-black text-xs rounded-xl transition-all shadow-lg shadow-orange-500/20"
                  >
                    {editingTier ? 'Save Changes' : 'Create Level Tier'}
                  </button>
                </div>

              </form>

            </div>
          </div>
        )}

      </main>
    </div>
  );
}
