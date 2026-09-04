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
  Eye,
  Info,
  IndianRupee,
  Tag,
  CreditCard,
  Percent,
  Flame,
  Clock,
  Calendar,
} from "lucide-react";
import { API_BASE_URL } from "@/config/api";

interface LevelTier {
  id: string;
  code: string;
  name: string;
  price?: string;
  minPoints?: number;
  maxPoints?: number | null;
  icon: string;
  badgeColor: string;
  order: number;
  description?: string;
  category?: string;
  validityDays?: number | null;
  isPublished?: boolean;
  discountType?: "percentage" | "flat" | string | null;
  discountValue?: number | null;
  offerStartDate?: string | null;
  offerEndDate?: string | null;
  offerActive?: boolean;
  offerTitle?: string | null;
}

const CATEGORY_OPTIONS = [
  'Single Validity',
  'Lifetime Validity',
];

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
  const [levelOffers, setLevelOffers] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isLoading, setIsLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Modal State for Level Tier
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTier, setEditingTier] = useState<LevelTier | null>(null);
  const [formData, setFormData] = useState({
    code: 'L1',
    name: '',
    price: '₹4,999',
    icon: '🥈',
    badgeColor: 'slate',
    order: 1,
    description: '',
    category: 'Single Validity',
    validityDays: 15,
    isPublished: true,
  });

  // Modal State for Quick Add Offer on Level Card
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [offerTargetCode, setOfferTargetCode] = useState("L1");
  const [offerFormData, setOfferFormData] = useState({
    title: "",
    discountType: "percentage" as "percentage" | "flat",
    discountValue: 20,
    startDate: "",
    endDate: "",
    isActive: true,
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
      const resLevels = await fetch(`${API}/admin/levels`, { headers });
      const dataLevels = await resLevels.json();
      if (Array.isArray(dataLevels)) {
        setLevels(dataLevels);
      }

      const resStudents = await fetch(`${API}/admin/students`, { headers });
      const dataStudents = await resStudents.json();
      if (Array.isArray(dataStudents)) {
        setStudents(dataStudents);
      }

      const resOffers = await fetch(`${API}/admin/offers`, { headers });
      const dataOffers = await resOffers.json();
      if (Array.isArray(dataOffers)) {
        setLevelOffers(dataOffers);
      }
    } catch (err: any) {
      console.error(err);
      showError("Failed to fetch level config data.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  const openCreateModal = () => {
    setEditingTier(null);
    const nextOrder = levels.length;
    setFormData({
      code: `L${nextOrder}`,
      name: '',
      price: '₹499',
      icon: '🏆',
      badgeColor: 'amber',
      order: nextOrder,
      description: '',
      category: 'Single Validity',
      validityDays: 15,
      isPublished: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (tier: LevelTier) => {
    setEditingTier(tier);
    setFormData({
      code: tier.code,
      name: tier.name,
      price: tier.price || (tier.code === 'L0' ? '₹499' : tier.code === 'L1' ? '₹4,999' : tier.code === 'L2' ? '₹19,999' : '₹59,999'),
      icon: tier.icon || '⭐',
      badgeColor: tier.badgeColor || 'amber',
      order: tier.order || 0,
      description: tier.description || '',
      category: tier.category || 'Single Validity',
      validityDays: tier.validityDays !== undefined && tier.validityDays !== null ? tier.validityDays : 15,
      isPublished: tier.isPublished !== false,
    });
    setIsModalOpen(true);
  };

  const handleSaveTier = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.code.trim()) {
      showError("Tier Code and Name are required");
      return;
    }

    try {
      const payload = {
        code: formData.code.trim().toUpperCase(),
        name: formData.name.trim(),
        price: formData.price.trim(),
        minPoints: 0,
        maxPoints: null,
        icon: formData.icon,
        badgeColor: formData.badgeColor,
        order: formData.order,
        description: formData.description.trim(),
        category: formData.category,
        validityDays: Number(formData.validityDays) || 0,
        isPublished: Boolean(formData.isPublished),
      };

      let res;
      if (editingTier) {
        res = await fetch(`${API}/admin/levels/${editingTier.id}`, {
          method: 'PUT',
          headers,
          body: JSON.stringify(payload)
        });
      } else {
        res = await fetch(`${API}/admin/levels`, {
          method: 'POST',
          headers,
          body: JSON.stringify(payload)
        });
      }

      const data = await res.json();
      if (res.ok) {
        showSuccess(editingTier ? "Level tier & price updated successfully!" : "New level tier created!");
        setIsModalOpen(false);
        fetchData();
      } else {
        showError(data.message || "Failed to save level tier");
      }
    } catch (err: any) {
      showError(err.message || "An error occurred");
    }
  };

  const openAddOfferForLevelModal = (code: string) => {
    setOfferTargetCode(code);
    setOfferFormData({
      title: "",
      discountType: "percentage",
      discountValue: 20,
      startDate: new Date().toISOString().slice(0, 16),
      endDate: "",
      isActive: true,
    });
    setIsOfferModalOpen(true);
  };

  const handleSaveOfferForLevel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!offerFormData.title.trim()) {
      showError("Offer Campaign Title is required.");
      return;
    }

    try {
      const res = await fetch(`${API}/admin/offers`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          ...offerFormData,
          levelCode: offerTargetCode,
        }),
      });

      if (!res.ok) throw new Error("Failed to create offer");

      showSuccess(`🎉 Offer added to ${offerTargetCode} successfully!`);
      setIsOfferModalOpen(false);
      fetchData();
    } catch (err: any) {
      showError(err?.message || "Failed to add campaign offer.");
    }
  };

  const handleDeleteTier = async (id: string, code: string) => {
    if (!confirm(`Are you sure you want to delete tier "${code}"?`)) return;
    try {
      const res = await fetch(`${API}/admin/levels/${id}`, {
        method: 'DELETE',
        headers
      });
      if (res.ok) {
        showSuccess(`Tier ${code} deleted successfully`);
        fetchData();
      } else {
        showError("Failed to delete tier");
      }
    } catch (err: any) {
      showError(err.message || "An error occurred");
    }
  };

  const getStudentCountForTier = (tierCode: string) => {
    return students.filter(s => {
      const code = (s.rank || s.membershipLevel || '').toUpperCase();
      return code.includes(tierCode.toUpperCase());
    }).length;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans">
      <AdminNav user={user} logout={logout} />

      <main className="max-w-[1400px] mx-auto p-4 md:p-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-orange-500/30 bg-orange-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-orange-400 mb-2">
              <Trophy size={13} className="text-orange-400" /> Membership Tier Hierarchy &amp; Pricing
            </span>
            <h1 className="text-3xl font-black text-white flex items-center gap-3">
              Membership Level &amp; Price Settings
            </h1>
            <p className="text-slate-400 mt-1 text-sm">
              Manage level titles, customize offer prices (₹499, ₹4,999, ₹19,999, ₹59,999), and edit access privileges.
            </p>
          </div>

          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-black text-sm h-11 px-6 rounded-2xl shadow-lg shadow-orange-500/20 transition-all hover:scale-105 cursor-pointer self-start md:self-auto"
          >
            <Plus size={18} /> Create New Level Tier
          </button>
        </div>

        {/* Alert Messages */}
        {successMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-bold flex items-center gap-2">
            <CheckCircle2 size={18} /> {successMsg}
          </div>
        )}

        {/* Razorpay Gateway Live Settings */}
        <div className="mb-6 p-5 rounded-3xl bg-slate-900 border border-orange-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400 shrink-0">
              <CreditCard size={20} />
            </div>
            <div>
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                Razorpay Payment Gateway Integration
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  Live &amp; Test Supported
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Configure your Razorpay Key ID and Secret to collect direct UPI, Card, and Netbanking payments.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              const keyId = prompt("Enter your Razorpay Key ID (e.g. rzp_live_xxx or rzp_test_xxx):");
              if (!keyId) return;
              const keySecret = prompt("Enter your Razorpay Key Secret:");
              if (!keySecret) return;

              fetch(`${API}/payments/config`, {
                method: "POST",
                headers,
                body: JSON.stringify({ keyId, keySecret }),
              })
                .then((r) => r.json())
                .then((d) => {
                  if (d.success) {
                    showSuccess("Razorpay API keys updated successfully!");
                  } else {
                    showError(d.message || "Failed to update keys");
                  }
                })
                .catch((e) => showError("Connection error"));
            }}
            className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 text-slate-950 font-black text-xs rounded-xl shadow-md cursor-pointer whitespace-nowrap"
          >
            ⚙️ Configure Razorpay Keys
          </button>
        </div>

        {/* Info Note */}
        <div className="mb-6 p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-slate-300 text-xs md:text-sm flex items-center gap-3">
          <Info size={18} className="text-orange-400 shrink-0" />
          <span>
            <strong>Dynamic Level Pricing:</strong> Click <strong>"Edit Tier &amp; Price"</strong> on any level card below to update its <strong>Offer Price</strong>, title, badge color, or description. Changes immediately reflect across the entire portal.
          </span>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1 scrollbar-none">
          {['All', ...CATEGORY_OPTIONS].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-orange-500 text-slate-950 font-black shadow-lg shadow-orange-500/20'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {cat === 'All' ? '🌟 All Categories' : `📂 ${cat}`}
            </button>
          ))}
        </div>

        {/* Level Tiers Grid */}
        {isLoading ? (
          <div className="p-16 text-center text-slate-500">Loading level configurations...</div>
        ) : levels.length === 0 ? (
          <div className="text-center py-16 rounded-3xl border border-dashed border-slate-800 bg-slate-900/40 p-8">
            <Trophy size={40} className="text-slate-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white mb-1">No Level Tiers Configured</h3>
            <p className="text-sm text-slate-400 mb-4">Create your first level tier to configure membership access.</p>
            <button
              onClick={openCreateModal}
              className="bg-orange-500 text-slate-950 font-bold text-xs h-10 px-5 rounded-xl"
            >
              + Create Level Tier
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {levels
              .filter((tier) => selectedCategory === 'All' || (tier.category || 'General') === selectedCategory)
              .map((tier) => {
              const studentCount = getStudentCountForTier(tier.code);
              const colorConfig = COLOR_OPTIONS.find(c => c.value === tier.badgeColor) || COLOR_OPTIONS[2];
              const displayPrice = tier.price || (tier.code === 'L0' ? '₹499' : tier.code === 'L1' ? '₹4,999' : tier.code === 'L2' ? '₹19,999' : tier.code === 'L3' ? '₹59,999' : 'Custom');
              const validityText = !tier.validityDays || tier.validityDays === 0 ? '♾️ Lifetime Access' : `⏳ ${tier.validityDays} Days Access`;
              const isPub = tier.isPublished !== false;

              return (
                <div
                  key={tier.id}
                  className={`rounded-3xl border ${isPub ? 'border-slate-800 bg-slate-900/90' : 'border-slate-800/60 bg-slate-950/60 opacity-80'} p-6 flex flex-col justify-between hover:border-orange-500/40 transition-all shadow-xl`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <div className="flex items-center gap-2.5">
                        <span className="text-2xl">{tier.icon || '⭐'}</span>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-black text-orange-400 uppercase tracking-widest block">
                              {tier.code} Tier
                            </span>
                            <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${isPub ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'}`}>
                              {isPub ? 'Live' : 'Unpublished'}
                            </span>
                          </div>
                          <h3 className="text-lg font-black text-white">{tier.name}</h3>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-1">
                        <span className="text-sm font-black text-amber-400 font-mono bg-amber-500/10 border border-amber-500/30 px-2.5 py-0.5 rounded-lg flex items-center gap-1">
                          <Tag size={12} /> {displayPrice}
                        </span>

                        {tier.offerActive && (
                          <div className="flex flex-col items-end gap-0.5">
                            {tier.offerTitle && (
                              <span className="text-[9px] font-extrabold text-red-400 uppercase tracking-tight">
                                🎁 {tier.offerTitle}
                              </span>
                            )}
                            <span className="bg-gradient-to-r from-red-500 to-rose-600 text-white font-black text-[10px] px-2 py-0.5 rounded-lg shadow-md border border-red-400/40 flex items-center gap-1">
                              <Flame size={10} />
                              {tier.discountType === "percentage" ? `${tier.discountValue}% OFF` : `₹${tier.discountValue} OFF`}
                            </span>
                          </div>
                        )}

                        <span className="text-[10px] text-slate-500 font-bold">
                          Order #{tier.order}
                        </span>
                      </div>
                    </div>

                    {/* Category & Validity Strip */}
                    <div className="flex items-center gap-2 mb-3 text-[11px] font-bold">
                      <span className="bg-slate-800/80 border border-slate-700 text-slate-300 px-2.5 py-1 rounded-lg">
                        📂 {tier.category || 'General'}
                      </span>
                      <span className="bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 px-2.5 py-1 rounded-lg">
                        {validityText}
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 leading-relaxed mb-4">
                      {tier.description || "Full membership tier benefits and unlocked portal privileges."}
                    </p>

                    <div className="rounded-2xl bg-slate-950/80 border border-slate-800/80 p-3 mb-3 flex items-center justify-between text-xs">
                      <span className="text-slate-400">Assigned Members:</span>
                      <span className="font-black text-white flex items-center gap-1">
                        <Users size={13} className="text-orange-400" /> {studentCount} Students
                      </span>
                    </div>

                    {/* Level Offers Box (Multiple Offers per Level) */}
                    {(() => {
                      const offersForLevel = levelOffers.filter(o => o.levelCode === tier.code || o.levelCode === 'ALL');
                      return (
                        <div className="my-3 p-3 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-black text-slate-300 flex items-center gap-1.5">
                              <Tag size={12} className="text-red-400" /> Level Offers ({offersForLevel.length})
                            </span>
                            <button
                              type="button"
                              onClick={() => openAddOfferForLevelModal(tier.code)}
                              className="px-2.5 py-1 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-[10px] font-black transition-all cursor-pointer flex items-center gap-1"
                            >
                              + Add Offer
                            </button>
                          </div>

                          {offersForLevel.length > 0 ? (
                            <div className="space-y-1.5 max-h-32 overflow-y-auto pr-0.5">
                              {offersForLevel.map((off) => (
                                <div key={off.id} className="flex items-center justify-between text-[11px] bg-slate-900/90 p-2 rounded-xl border border-slate-800/80">
                                  <div className="flex items-center gap-1.5 min-w-0">
                                    <span className="text-red-400">🎁</span>
                                    <span className="font-bold text-white truncate">{off.title}</span>
                                  </div>
                                  <span className="font-black text-red-400 font-mono text-[10px] shrink-0 bg-red-500/10 border border-red-500/20 px-1.5 py-0.5 rounded-md">
                                    {off.discountType === 'percentage' ? `${off.discountValue}% OFF` : `₹${off.discountValue} OFF`}
                                  </span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-[10px] text-slate-500 font-medium">No campaign offers added for {tier.code} yet.</p>
                          )}
                        </div>
                      );
                    })()}
                  </div>

                  <div className="flex items-center gap-2 pt-3 border-t border-slate-800/80">
                    <button
                      onClick={() => openEditModal(tier)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs h-9 rounded-xl border border-slate-700 transition-colors cursor-pointer"
                    >
                      <Edit2 size={13} /> Edit Tier &amp; Price
                    </button>
                    <button
                      onClick={() => handleDeleteTier(tier.id, tier.code)}
                      className="text-slate-500 hover:text-red-400 p-2 hover:bg-red-500/10 rounded-xl transition-colors cursor-pointer"
                      title="Delete Tier"
                    >
                      <Trash2 size={15} />
                    </button>
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
                  {editingTier ? `Edit Level & Price (${editingTier.code})` : 'Create New Level Tier'}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
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

                {/* Base Price & Hierarchy Order */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1.5">Base Price / Fee (₹)</label>
                    <input
                      type="text"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="e.g. ₹4,999"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-amber-400 font-mono font-bold focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1.5">Hierarchy Order #</label>
                    <input
                      type="number"
                      value={formData.order}
                      onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                      placeholder="0, 1, 2, 3..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                {/* Category & Validity Configuration */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1.5">Validity Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => {
                        const cat = e.target.value;
                        setFormData({
                          ...formData,
                          category: cat,
                          validityDays: cat === 'Lifetime Validity' ? 0 : (formData.validityDays > 0 ? formData.validityDays : 15),
                        });
                      }}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white font-bold focus:outline-none focus:border-orange-500"
                    >
                      {CATEGORY_OPTIONS.map((c) => (
                        <option key={c} value={c}>
                          {c === 'Single Validity' ? '⏱️ Single Validity (Day-wise)' : '♾️ Lifetime Validity (Permanent)'}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    {formData.category === 'Single Validity' ? (
                      <>
                        <label className="block text-xs font-bold text-slate-400 mb-1.5">
                          Validity Period (Days)
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={formData.validityDays || 15}
                          onChange={(e) => setFormData({ ...formData, validityDays: Math.max(1, parseInt(e.target.value) || 1) })}
                          placeholder="e.g. 15"
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-amber-400 focus:outline-none focus:border-orange-500 font-mono font-bold"
                        />
                        <p className="text-[10px] text-amber-400 mt-1">
                          ⏳ Automatically unpublishes/expires {formData.validityDays || 15} days after student purchase.
                        </p>
                      </>
                    ) : (
                      <div className="h-full flex flex-col justify-end">
                        <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center gap-2 text-emerald-400 text-xs font-bold">
                          ♾️ Permanent Lifetime Access
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Published / Active Toggle */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div>
                    <span className="text-xs font-bold text-white block">Publish / Live on Portal</span>
                    <span className="text-[10px] text-slate-400">Uncheck to unpublish this level from public storefront</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isPublished}
                      onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                  </label>
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
                        onClick={() => setFormData({ ...formData, badgeColor: c.value })}
                        className={`p-2 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
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
                  <label className="block text-xs font-bold text-slate-400 mb-1.5">Description &amp; Access Privileges</label>
                  <textarea
                    rows={2}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="e.g. Access to live interactive masterclasses, weekly Q&A calls, and replay vault."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-orange-500 resize-none"
                  />
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-slate-800">
                  <button
                    type="submit"
                    className="flex-1 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-black text-sm h-11 rounded-xl shadow-lg transition-all hover:scale-[1.02] cursor-pointer"
                  >
                    {editingTier ? 'Update Level Tier & Price' : 'Create Level Tier'}
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

        {/* Quick Add Offer Modal directly for Level Card */}
        {isOfferModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <div className="relative w-full max-w-md rounded-3xl border border-red-500/30 bg-slate-900 p-6 sm:p-7 shadow-2xl text-white">
              <button
                onClick={() => setIsOfferModalOpen(false)}
                className="absolute right-4 top-4 text-slate-400 hover:text-white"
              >
                ✕
              </button>

              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-9 h-9 rounded-xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400">
                  <Tag size={18} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">
                    Add Campaign Offer for {offerTargetCode}
                  </h3>
                  <p className="text-xs text-slate-400">Create another offer deal for {offerTargetCode} tier</p>
                </div>
              </div>

              <form onSubmit={handleSaveOfferForLevel} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Offer Campaign Title</label>
                  <input
                    type="text"
                    required
                    value={offerFormData.title}
                    onChange={(e) => setOfferFormData({ ...offerFormData, title: e.target.value })}
                    placeholder="e.g. Diwali Flash Sale 20% OFF"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500 font-bold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Discount Type</label>
                    <select
                      value={offerFormData.discountType}
                      onChange={(e) => setOfferFormData({ ...offerFormData, discountType: e.target.value as any })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                    >
                      <option value="percentage">Percentage (%)</option>
                      <option value="flat">Flat (₹)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Discount Value</label>
                    <input
                      type="number"
                      min="0"
                      required
                      value={offerFormData.discountValue}
                      onChange={(e) => setOfferFormData({ ...offerFormData, discountValue: parseFloat(e.target.value) || 0 })}
                      placeholder={offerFormData.discountType === "percentage" ? "20 for 20%" : "1000 for ₹1,000"}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-red-400 font-mono font-bold focus:outline-none focus:border-red-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 mb-1">Start Date &amp; Time</label>
                    <input
                      type="datetime-local"
                      value={offerFormData.startDate}
                      onChange={(e) => setOfferFormData({ ...offerFormData, startDate: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 mb-1">End Date &amp; Time</label>
                    <input
                      type="datetime-local"
                      value={offerFormData.endDate}
                      onChange={(e) => setOfferFormData({ ...offerFormData, endDate: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-red-500"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-red-500 to-orange-500 text-white font-black text-xs h-10 rounded-xl shadow-md hover:scale-105 transition-all cursor-pointer"
                  >
                    + Add Offer to {offerTargetCode}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsOfferModalOpen(false)}
                    className="px-4 bg-slate-800 text-slate-300 font-semibold text-xs h-10 rounded-xl cursor-pointer"
                  >
                    Cancel
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
