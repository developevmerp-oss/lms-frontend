"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { AdminNav } from "@/components/layout/AdminNav";
import {
  Tag,
  Percent,
  Plus,
  Edit2,
  Trash2,
  Flame,
  Calendar,
  Clock,
  CheckCircle2,
  X,
  Search,
  Sparkles,
  Layers,
  Zap,
} from "lucide-react";
import { motion } from "framer-motion";
import { API_BASE_URL } from "@/config/api";

export interface LevelOffer {
  id: string;
  title: string;
  levelCode: string;
  discountType: "percentage" | "flat" | string;
  discountValue: number;
  startDate?: string | null;
  endDate?: string | null;
  isActive: boolean;
  bannerText?: string;
  createdAt?: string;
}

const LEVEL_OPTIONS = [
  { code: "L0", name: "L0 · Fast Track Starter" },
  { code: "L1", name: "L1 · Silver Member" },
  { code: "L2", name: "L2 · Gold Member" },
  { code: "L3", name: "L3 · Diamond Club" },
  { code: "ALL", name: "ALL · All Membership Tiers" },
];

export default function AdminOffersPage() {
  const { token, user, logout } = useAuth();
  const [offers, setOffers] = useState<LevelOffer[]>([]);
  const [selectedLevelFilter, setSelectedLevelFilter] = useState<string>("All");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<LevelOffer | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    levelCode: "L1",
    discountType: "percentage" as "percentage" | "flat",
    discountValue: 15,
    startDate: "",
    endDate: "",
    isActive: true,
    bannerText: "",
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

  const fetchOffers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API}/admin/offers`, { headers });
      const data = await res.json();
      if (Array.isArray(data)) setOffers(data);
    } catch (err: any) {
      console.error(err);
      showError("Failed to fetch special campaign offers.");
    } finally {
      setIsLoading(false);
    }
  };

  const [liveLevels, setLiveLevels] = useState<any[]>([]);

  const fetchLiveLevels = async () => {
    try {
      const res = await fetch(`${API}/admin/levels`, { headers });
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) setLiveLevels(data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    if (token) {
      fetchOffers();
      fetchLiveLevels();
    }
  }, [token]);

  const openCreateModal = () => {
    setEditingOffer(null);
    setFormData({
      title: "",
      levelCode: "L1",
      discountType: "percentage",
      discountValue: 20,
      startDate: new Date().toISOString().slice(0, 16),
      endDate: "",
      isActive: true,
      bannerText: "",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (offer: LevelOffer) => {
    setEditingOffer(offer);
    setFormData({
      title: offer.title,
      levelCode: offer.levelCode,
      discountType: (offer.discountType as any) || "percentage",
      discountValue: offer.discountValue || 0,
      startDate: offer.startDate ? new Date(offer.startDate).toISOString().slice(0, 16) : "",
      endDate: offer.endDate ? new Date(offer.endDate).toISOString().slice(0, 16) : "",
      isActive: offer.isActive,
      bannerText: offer.bannerText || "",
    });
    setIsModalOpen(true);
  };

  const handleSaveOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      showError("Offer Campaign Title is required.");
      return;
    }

    try {
      const url = editingOffer ? `${API}/admin/offers/${editingOffer.id}` : `${API}/admin/offers`;
      const method = editingOffer ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to save offer");

      showSuccess(editingOffer ? "🎉 Offer updated successfully!" : "🚀 Special Offer Campaign created!");
      setIsModalOpen(false);
      fetchOffers();
    } catch (err: any) {
      showError(err?.message || "Failed to save campaign offer.");
    }
  };

  const handleToggleActive = async (id: string) => {
    try {
      const res = await fetch(`${API}/admin/offers/${id}/toggle`, {
        method: "PATCH",
        headers,
      });
      if (res.ok) {
        setOffers(offers.map((o) => (o.id === id ? { ...o, isActive: !o.isActive } : o)));
        showSuccess("Offer status updated!");
      }
    } catch (_) {}
  };

  const handleDeleteOffer = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this offer campaign?")) return;
    try {
      const res = await fetch(`${API}/admin/offers/${id}`, {
        method: "DELETE",
        headers,
      });
      if (res.ok) {
        setOffers(offers.filter((o) => o.id !== id));
        showSuccess("Offer deleted successfully!");
      }
    } catch (_) {}
  };

  const filteredOffers = offers.filter((o) => {
    const matchesLevel = selectedLevelFilter === "All" || o.levelCode === selectedLevelFilter;
    const matchesStatus =
      selectedStatusFilter === "All" ||
      (selectedStatusFilter === "Active" && o.isActive) ||
      (selectedStatusFilter === "Inactive" && !o.isActive);
    const matchesSearch =
      o.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.levelCode.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesLevel && matchesStatus && matchesSearch;
  });

  const activeCount = offers.filter((o) => o.isActive).length;

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col font-sans">
      <AdminNav user={user} logout={logout} />

      <main className="flex-1 max-w-[1400px] mx-auto w-full p-4 md:p-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-red-500/30 bg-red-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-red-400 mb-2">
              <Percent size={13} /> Dedicated Level Offers Module
            </span>
            <h1 className="text-3xl md:text-4xl font-black text-white flex items-center gap-3">
              Special Offers &amp; Campaign Manager
            </h1>
            <p className="text-slate-400 mt-1 text-sm md:text-base">
              Create, schedule, and manage multiple promotional discount campaigns for each level tier.
            </p>
          </div>

          <button
            onClick={openCreateModal}
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 via-orange-500 to-amber-500 hover:from-red-600 hover:to-amber-600 text-white font-black text-sm px-6 py-3.5 rounded-2xl shadow-xl shadow-red-500/20 transition-all hover:scale-105 cursor-pointer self-start md:self-auto"
          >
            <Plus size={18} /> + Create New Offer Campaign
          </button>
        </div>

        {/* Notifications */}
        {successMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-bold text-center animate-in fade-in">
            {successMsg}
          </div>
        )}
        {errorMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-bold text-center animate-in fade-in">
            {errorMsg}
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl flex items-center justify-between">
            <div>
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Total Campaigns</p>
              <h3 className="text-3xl font-black text-white">{offers.length}</h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-orange-400">
              <Tag size={24} />
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl flex items-center justify-between">
            <div>
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Active Offers</p>
              <h3 className="text-3xl font-black text-emerald-400">{activeCount}</h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Flame size={24} />
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl flex items-center justify-between">
            <div>
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Target Levels</p>
              <h3 className="text-3xl font-black text-amber-400">L0 – L3</h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Layers size={24} />
            </div>
          </div>
        </div>

        {/* Controls & Filter Bar */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 md:p-6 mb-8 shadow-xl flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-2.5 w-full md:w-auto">
            <span className="text-xs font-bold text-slate-400 self-center mr-1">Level:</span>
            {["All", "L0", "L1", "L2", "L3", "ALL"].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setSelectedLevelFilter(lvl)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedLevelFilter === lvl
                    ? "bg-red-500 text-white font-black shadow-md"
                    : "bg-slate-950 border border-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                {lvl === "All" ? "🌟 All Tiers" : lvl === "ALL" ? "🌐 Global" : lvl}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search offer titles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
              />
            </div>
          </div>
        </div>

        {/* Offers Cards Grid */}
        {isLoading ? (
          <div className="p-16 text-center text-slate-500">Loading campaign offers...</div>
        ) : filteredOffers.length === 0 ? (
          <div className="text-center py-16 rounded-3xl border border-dashed border-slate-800 bg-slate-900/40 p-8">
            <Tag size={40} className="text-slate-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white mb-1">No Offers Found</h3>
            <p className="text-sm text-slate-400 mb-4">Create your first level offer campaign to start promotions.</p>
            <button
              onClick={openCreateModal}
              className="bg-red-500 text-white font-bold text-xs h-10 px-5 rounded-xl"
            >
              + Create Offer Campaign
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOffers.map((offer) => {
              const now = new Date();
              const isStarted = !offer.startDate || new Date(offer.startDate) <= now;
              const isEnded = offer.endDate && new Date(offer.endDate) < now;
              const isLive = offer.isActive && isStarted && !isEnded;

              return (
                <div
                  key={offer.id}
                  className={`rounded-3xl border ${
                    isLive
                      ? "border-red-500/40 bg-gradient-to-b from-slate-900 to-slate-950 shadow-2xl shadow-red-500/5"
                      : "border-slate-800 bg-slate-950/60 opacity-80"
                  } p-6 flex flex-col justify-between transition-all hover:border-red-500/60`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <span className="text-xs font-black px-3 py-1 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/30 uppercase tracking-widest">
                        Target: {offer.levelCode}
                      </span>

                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${
                            isLive
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                              : "bg-slate-800 text-slate-400"
                          }`}
                        >
                          {isLive ? "🔥 LIVE" : isEnded ? "Expired" : "Inactive"}
                        </span>

                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={offer.isActive}
                            onChange={() => handleToggleActive(offer.id)}
                            className="sr-only peer"
                          />
                          <div className="w-8 h-4 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-emerald-500"></div>
                        </label>
                      </div>
                    </div>

                    <h3 className="text-lg font-black text-white mb-2 leading-snug">{offer.title}</h3>

                    {/* Discount Value Badge */}
                    <div className="my-3 p-3 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-300">Campaign Discount</span>
                      <span className="text-lg font-black text-red-400 font-mono">
                        {offer.discountType === "percentage" ? `${offer.discountValue}% OFF` : `₹${offer.discountValue} OFF`}
                      </span>
                    </div>

                    {/* Timing Schedule */}
                    <div className="space-y-1.5 text-xs text-slate-400 mb-4 bg-slate-950 p-3 rounded-2xl border border-slate-900 font-mono">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={12} className="text-emerald-400" />
                        <span>Start: {offer.startDate ? new Date(offer.startDate).toLocaleString("en-IN") : "Immediate"}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock size={12} className="text-red-400" />
                        <span>End: {offer.endDate ? new Date(offer.endDate).toLocaleString("en-IN") : "No expiry"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-2">
                    <button
                      onClick={() => openEditModal(offer)}
                      className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Edit2 size={13} /> Edit Campaign
                    </button>
                    <button
                      onClick={() => handleDeleteOffer(offer.id)}
                      className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl transition-colors cursor-pointer"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg rounded-3xl border border-red-500/30 bg-slate-900 p-6 sm:p-8 shadow-2xl text-white">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-5 top-5 text-slate-400 hover:text-white"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-2.5 mb-6">
              <div className="w-10 h-10 rounded-2xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400">
                <Percent size={20} />
              </div>
              <div>
                <h3 className="text-xl font-black text-white">
                  {editingOffer ? "Edit Special Offer Campaign" : "Create Special Offer Campaign"}
                </h3>
                <p className="text-xs text-slate-400">Configure level target, discount type, and timers</p>
              </div>
            </div>

            <form onSubmit={handleSaveOffer} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1.5">Offer Campaign Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Diwali Festival Flash Sale 🔥"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white font-bold focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1.5">Target Membership Level</label>
                  <select
                    value={formData.levelCode}
                    onChange={(e) => setFormData({ ...formData, levelCode: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white font-bold focus:outline-none focus:border-red-500"
                  >
                    {(liveLevels.length > 0
                      ? [
                          ...liveLevels.map((l) => ({ code: l.code, name: `${l.code} · ${l.name} (${l.price || '₹499'})` })),
                          { code: "ALL", name: "ALL · All Membership Tiers" },
                        ]
                      : LEVEL_OPTIONS
                    ).map((l) => (
                      <option key={l.code} value={l.code}>
                        {l.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1.5">Discount Type</label>
                  <select
                    value={formData.discountType}
                    onChange={(e) => setFormData({ ...formData, discountType: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white font-bold focus:outline-none focus:border-red-500"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="flat">Flat Discount (₹)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1.5">
                  {formData.discountType === "percentage" ? "Discount Percentage (%)" : "Flat Discount Amount (₹)"}
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={formData.discountValue}
                  onChange={(e) => setFormData({ ...formData, discountValue: parseFloat(e.target.value) || 0 })}
                  placeholder={formData.discountType === "percentage" ? "e.g. 20" : "e.g. 1000"}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-red-400 font-mono font-bold focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">Start Date &amp; Time</label>
                  <input
                    type="datetime-local"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">End Date &amp; Time</label>
                  <input
                    type="datetime-local"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-xs font-bold text-white">Enable Campaign Immediately</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                </label>
              </div>

              <div className="flex items-center gap-3 pt-3">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-red-500 to-orange-500 text-white font-black text-xs h-11 rounded-xl shadow-lg hover:scale-105 transition-all cursor-pointer"
                >
                  {editingOffer ? "Update Campaign Offer" : "Save & Activate Campaign"}
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 bg-slate-800 text-slate-300 font-bold text-xs h-11 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
