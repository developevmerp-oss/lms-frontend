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
  Globe,
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
    <div
      className="min-h-screen bg-[#faf8f5] text-stone-900 flex flex-col font-sans transition-colors lg:pl-[284px]"
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
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 md:mb-8">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#f5ded0] bg-[#fde5d6] px-3.5 py-1 text-xs md:text-sm lg:text-xs font-bold tracking-wide text-[#942008] mb-2">
              <Percent size={13} className="text-[#c4431d]" /> Dedicated Level Offers Module
            </span>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-3xl font-black text-stone-900 tracking-tight flex items-center gap-3">
              Special Offers &amp; Campaign Manager
            </h1>
            <p className="text-stone-500 mt-1 text-sm md:text-base lg:text-sm font-medium">
              Create, schedule, and manage multiple promotional discount campaigns for each level tier.
            </p>
          </div>

          <button
            onClick={openCreateModal}
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#942008] via-[#c4431d] to-[#ea580c] hover:opacity-95 text-white font-bold text-xs sm:text-sm md:text-base lg:text-sm px-6 py-3 rounded-full shadow-md shadow-[#c4431d]/25 transition-all hover:scale-[1.02] cursor-pointer self-start md:self-auto w-full sm:w-auto"
          >
            <Plus size={18} /> Create New Offer Campaign
          </button>
        </div>

        {/* Notifications */}
        {successMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm md:text-base lg:text-sm font-bold text-center animate-in fade-in">
            {successMsg}
          </div>
        )}
        {errorMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm md:text-base lg:text-sm font-bold text-center animate-in fade-in">
            {errorMsg}
          </div>
        )}

        {/* Unified Stats Bar */}
        <div className="bg-white/95 border border-[#ecdccb] rounded-3xl shadow-[0_6px_20px_-8px_rgba(90,55,20,0.08)] grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[#ecdccb]/70 mb-6">
          <div className="p-5 sm:p-6 flex items-center gap-4">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-[#fff5ee] border border-[#f5ded0] flex items-center justify-center text-[#c4431d] shrink-0">
              <Tag size={22} />
            </div>
            <div>
              <p className="text-xs sm:text-sm md:text-base lg:text-sm font-medium text-stone-500">Total Campaigns</p>
              <h3 className="text-2xl sm:text-3xl md:text-3xl lg:text-2xl font-black text-stone-900 leading-tight">{offers.length}</h3>
            </div>
          </div>

          <div className="p-5 sm:p-6 flex items-center gap-4">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-emerald-700 shrink-0">
              <Flame size={22} />
            </div>
            <div>
              <p className="text-xs sm:text-sm md:text-base lg:text-sm font-medium text-stone-500">Active Offers</p>
              <h3 className="text-2xl sm:text-3xl md:text-3xl lg:text-2xl font-black text-emerald-700 leading-tight">{activeCount}</h3>
            </div>
          </div>

          <div className="p-5 sm:p-6 flex items-center gap-4">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-[#fff5ee] border border-[#f5ded0] flex items-center justify-center text-[#c4431d] shrink-0">
              <Layers size={22} />
            </div>
            <div>
              <p className="text-xs sm:text-sm md:text-base lg:text-sm font-medium text-stone-500">Target Levels</p>
              <h3 className="text-2xl sm:text-3xl md:text-3xl lg:text-2xl font-black text-[#c4431d] leading-tight">L0 – L3</h3>
            </div>
          </div>
        </div>

        {/* Controls & Filter Bar */}
        <div className="bg-white/95 border border-[#ecdccb] rounded-2xl px-4 py-3.5 sm:px-5 sm:py-4 mb-6 md:mb-8 shadow-xs flex flex-col lg:flex-row gap-3.5 items-stretch lg:items-center justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs sm:text-sm md:text-base lg:text-sm font-bold text-stone-600 mr-1">Level:</span>
            {["All", "L0", "L1", "L2", "L3", "ALL"].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setSelectedLevelFilter(lvl)}
                className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm md:text-base lg:text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-1.5 ${
                  selectedLevelFilter === lvl
                    ? "bg-gradient-to-r from-[#942008] via-[#c4431d] to-[#ea580c] text-white shadow-sm"
                    : "bg-white border border-[#e7ddd2] text-stone-700 hover:border-[#c4431d]/40 hover:text-[#942008]"
                }`}
              >
                {lvl === "All" ? (
                  "All Tiers"
                ) : lvl === "ALL" ? (
                  <>
                    <Globe size={13} /> Global
                  </>
                ) : (
                  lvl
                )}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 w-full lg:w-72">
            <div className="relative flex-1">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                placeholder="Search offer titles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#fcfaf7] border border-[#e7ddd2] rounded-full pl-9 pr-4 py-2 text-xs sm:text-sm md:text-base lg:text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-[#c4431d] focus:ring-1 focus:ring-[#c4431d]/30 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Offers Cards Grid */}
        {isLoading ? (
          <div className="p-16 text-center text-stone-400 font-medium text-sm md:text-base lg:text-sm">Loading campaign offers...</div>
        ) : filteredOffers.length === 0 ? (
          <div className="text-center py-16 rounded-3xl border border-dashed border-stone-200 bg-white/60 p-8">
            <Tag size={40} className="text-stone-300 mx-auto mb-3" />
            <h3 className="text-lg md:text-xl lg:text-lg font-bold text-stone-900 mb-1">No Offers Found</h3>
            <p className="text-sm md:text-base lg:text-sm text-stone-500 mb-4">Create your first level offer campaign to start promotions.</p>
            <button
              onClick={openCreateModal}
              className="bg-gradient-to-r from-[#942008] via-[#c4431d] to-[#ea580c] text-white font-bold text-xs md:text-sm lg:text-xs h-10 px-5 rounded-full cursor-pointer shadow-sm"
            >
              + Create Offer Campaign
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 md:gap-6">
            {filteredOffers.map((offer) => {
              const now = new Date();
              const isStarted = !offer.startDate || new Date(offer.startDate) <= now;
              const isEnded = offer.endDate && new Date(offer.endDate) < now;
              const isLive = offer.isActive && isStarted && !isEnded;

              return (
                <div
                  key={offer.id}
                  className={`relative overflow-hidden rounded-3xl border ${
                    isLive
                      ? "border-[#ecdccb] bg-white shadow-[0_8px_24px_-10px_rgba(90,55,20,0.08)]"
                      : "border-[#ecdccb]/80 bg-white/95 shadow-[0_6px_18px_-10px_rgba(90,55,20,0.06)]"
                  } p-5 sm:p-6 flex flex-col justify-between transition-all hover:border-[#c4431d]/40`}
                >
                  {/* Top-Right Triangular Corner Accent */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute top-0 right-0 w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-bl from-[#f9dfd0]/90 via-[#fde9dc]/45 to-transparent"
                    style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%)" }}
                  />
                  <div className="relative z-10">
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-xs sm:text-sm md:text-base lg:text-xs font-bold px-3 py-1 rounded-full bg-[#fde5d6]/80 text-[#942008] border border-[#f5ded0]">
                        Target: {offer.levelCode}
                      </span>

                      <div className="flex items-center gap-2.5 shrink-0">
                        <span
                          className={`text-xs sm:text-sm md:text-base lg:text-xs font-bold ${
                            isLive ? "text-emerald-700" : "text-stone-600"
                          }`}
                        >
                          {isLive ? "🔥 LIVE" : isEnded ? "Expired" : "Inactive"}
                        </span>

                        <label className="relative inline-flex items-center cursor-pointer shrink-0">
                          <input
                            type="checkbox"
                            checked={offer.isActive}
                            onChange={() => handleToggleActive(offer.id)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:bg-[#4f9a3d] transition-colors after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:rounded-full after:h-4 after:w-4 after:shadow-xs after:transition-transform peer-checked:after:translate-x-5"></div>
                        </label>
                      </div>
                    </div>

                    <h3 className="text-lg sm:text-xl md:text-2xl lg:text-lg font-black text-stone-900 mb-3 leading-snug break-words">
                      {offer.title}
                    </h3>

                    {/* Discount Value Row */}
                    <div className="py-2.5 border-y border-stone-100 flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-2 text-xs sm:text-sm md:text-base lg:text-sm font-medium text-stone-600">
                        <Tag size={15} className="text-[#c4431d] shrink-0" /> Campaign Discount
                      </span>
                      <span className="text-sm sm:text-base md:text-lg lg:text-base font-black text-[#c4431d] font-mono bg-[#fff2e6] border border-[#f8dcc4] px-3 py-1 rounded-xl whitespace-nowrap">
                        {offer.discountType === "percentage" ? `${offer.discountValue}% OFF` : `₹${offer.discountValue} OFF`}
                      </span>
                    </div>

                    {/* Timing Schedule */}
                    <div className="py-3.5 space-y-1.5 text-xs sm:text-sm md:text-base lg:text-xs text-stone-600">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-[#c4431d] shrink-0" />
                        <span>Start: {offer.startDate ? new Date(offer.startDate).toLocaleString("en-IN") : "Immediate"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={14} className="text-[#942008] shrink-0" />
                        <span>End: {offer.endDate ? new Date(offer.endDate).toLocaleString("en-IN") : "No expiry"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-stone-200/80 flex items-center justify-between gap-2.5">
                    <button
                      onClick={() => openEditModal(offer)}
                      className="flex-1 py-2 px-3 bg-white hover:bg-stone-50 text-stone-700 hover:text-stone-900 font-bold text-xs sm:text-sm md:text-base lg:text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Edit2 size={14} /> Edit Campaign
                    </button>
                    <button
                      onClick={() => handleDeleteOffer(offer.id)}
                      className="w-9 h-9 bg-white hover:bg-rose-50 text-rose-600 border border-[#f5ded0] hover:border-rose-300 rounded-xl flex items-center justify-center transition-colors cursor-pointer shrink-0"
                      title="Delete Offer"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-sm">
          <div className="relative w-full max-w-lg rounded-3xl border border-[#ecdccb] bg-white p-6 sm:p-8 shadow-2xl text-stone-900">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-5 top-5 w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 hover:text-stone-800 flex items-center justify-center cursor-pointer transition-colors"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-3 mb-6 pr-8">
              <div className="w-10 h-10 rounded-2xl bg-[#fff5ee] border border-[#f5ded0] flex items-center justify-center text-[#c4431d] shrink-0">
                <Percent size={20} />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl md:text-2xl lg:text-xl font-black text-stone-900">
                  {editingOffer ? "Edit Special Offer Campaign" : "Create Special Offer Campaign"}
                </h3>
                <p className="text-xs sm:text-sm lg:text-xs text-stone-500 font-medium">Configure level target, discount type, and timers</p>
              </div>
            </div>

            <form onSubmit={handleSaveOffer} className="space-y-4">
              <div>
                <label className="block text-xs sm:text-sm lg:text-xs font-bold text-stone-700 mb-1.5">Offer Campaign Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Diwali Festival Flash Sale 🔥"
                  className="w-full bg-[#fcfaf7] border border-stone-300 rounded-xl px-3.5 py-2.5 text-sm md:text-base lg:text-sm text-stone-900 font-bold focus:outline-none focus:border-[#c4431d] focus:ring-1 focus:ring-[#c4431d]/30 transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs sm:text-sm lg:text-xs font-bold text-stone-700 mb-1.5">Target Membership Level</label>
                  <select
                    value={formData.levelCode}
                    onChange={(e) => setFormData({ ...formData, levelCode: e.target.value })}
                    className="w-full bg-[#fcfaf7] border border-stone-300 rounded-xl px-3 py-2.5 text-xs sm:text-sm lg:text-xs text-stone-900 font-bold focus:outline-none focus:border-[#c4431d] focus:ring-1 focus:ring-[#c4431d]/30 transition-colors"
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
                  <label className="block text-xs sm:text-sm lg:text-xs font-bold text-stone-700 mb-1.5">Discount Type</label>
                  <select
                    value={formData.discountType}
                    onChange={(e) => setFormData({ ...formData, discountType: e.target.value as any })}
                    className="w-full bg-[#fcfaf7] border border-stone-300 rounded-xl px-3 py-2.5 text-xs sm:text-sm lg:text-xs text-stone-900 font-bold focus:outline-none focus:border-[#c4431d] focus:ring-1 focus:ring-[#c4431d]/30 transition-colors"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="flat">Flat Discount (₹)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs sm:text-sm lg:text-xs font-bold text-stone-700 mb-1.5">
                  {formData.discountType === "percentage" ? "Discount Percentage (%)" : "Flat Discount Amount (₹)"}
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={formData.discountValue}
                  onChange={(e) => setFormData({ ...formData, discountValue: parseFloat(e.target.value) || 0 })}
                  placeholder={formData.discountType === "percentage" ? "e.g. 20" : "e.g. 1000"}
                  className="w-full bg-[#fcfaf7] border border-stone-300 rounded-xl px-3.5 py-2.5 text-sm md:text-base lg:text-sm text-[#942008] font-mono font-bold focus:outline-none focus:border-[#c4431d] focus:ring-1 focus:ring-[#c4431d]/30 transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs sm:text-sm lg:text-xs font-bold text-stone-700 mb-1">Start Date &amp; Time</label>
                  <input
                    type="datetime-local"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full bg-[#fcfaf7] border border-stone-300 rounded-xl px-3 py-2 text-xs sm:text-sm lg:text-xs text-stone-900 focus:outline-none focus:border-[#c4431d] focus:ring-1 focus:ring-[#c4431d]/30 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm lg:text-xs font-bold text-stone-700 mb-1">End Date &amp; Time</label>
                  <input
                    type="datetime-local"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full bg-[#fcfaf7] border border-stone-300 rounded-xl px-3 py-2 text-xs sm:text-sm lg:text-xs text-stone-900 focus:outline-none focus:border-[#c4431d] focus:ring-1 focus:ring-[#c4431d]/30 transition-colors"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-[#fcfaf7] border border-stone-200">
                <span className="text-xs sm:text-sm lg:text-xs font-bold text-stone-900">Enable Campaign Immediately</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#4f9a3d]"></div>
                </label>
              </div>

              <div className="flex items-center gap-3 pt-3">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-[#942008] via-[#c4431d] to-[#ea580c] hover:opacity-95 text-white font-black text-xs sm:text-sm lg:text-xs h-11 rounded-xl shadow-md shadow-[#c4431d]/25 hover:scale-[1.02] transition-all cursor-pointer"
                >
                  {editingOffer ? "Update Campaign Offer" : "Save & Activate Campaign"}
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs sm:text-sm lg:text-xs h-11 rounded-xl cursor-pointer border border-stone-300"
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
