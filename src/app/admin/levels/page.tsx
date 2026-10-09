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
  QrCode,
} from "lucide-react";
import { API_BASE_URL } from "@/config/api";
import { LevelQrCodeModal } from "@/components/admin/LevelQrCodeModal";

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
  installmentsEnabled?: boolean;
  totalInstallments?: number;
  installmentPlans?: any;
}

export interface InstallmentFrequencyItem {
  frequency: string;
  label: string;
  interval?: string;
  enabled: boolean;
  totalInstallments?: number;
  isCustom?: boolean;
}

const DEFAULT_FREQUENCIES: InstallmentFrequencyItem[] = [
  { frequency: 'weekly', label: 'Weekly', interval: 'Every 7 Days', enabled: false, totalInstallments: 12 },
  { frequency: 'biweekly', label: 'Bi-Weekly', interval: 'Every 14 Days (2 Weeks)', enabled: true, totalInstallments: 6 },
  { frequency: 'monthly', label: 'Monthly', interval: 'Every Month (30 Days)', enabled: true, totalInstallments: 3 },
  { frequency: '2months', label: 'Every 2 Months', interval: 'Every 60 Days (Bi-Monthly)', enabled: true, totalInstallments: 3 },
  { frequency: '3months', label: 'Every 3 Months', interval: 'Every 90 Days (Quarterly)', enabled: true, totalInstallments: 2 },
  { frequency: '6months', label: 'Every 6 Months', interval: 'Every 180 Days (Half-Yearly)', enabled: false, totalInstallments: 2 },
];

const normalizeFrequencies = (raw: any, fallbackTotal = 3): InstallmentFrequencyItem[] => {
  if (!Array.isArray(raw) || raw.length === 0) {
    return DEFAULT_FREQUENCIES.map((f) => ({ ...f, totalInstallments: f.totalInstallments || fallbackTotal }));
  }

  if (typeof raw[0] === 'string') {
    const set = new Set(raw);
    return DEFAULT_FREQUENCIES.map((f) => ({
      ...f,
      enabled: set.has(f.frequency),
      totalInstallments: f.totalInstallments || fallbackTotal,
    }));
  }

  const map = new Map<string, any>();
  raw.forEach((item) => {
    if (item && item.frequency) map.set(item.frequency, item);
  });

  const base = DEFAULT_FREQUENCIES.map((def) => {
    const found = map.get(def.frequency);
    if (found) {
      return {
        ...def,
        label: found.label || found.name || def.label,
        enabled: found.enabled !== undefined ? Boolean(found.enabled) : found.isActive !== false,
        totalInstallments: parseInt(String(found.totalInstallments || found.installments), 10) || def.totalInstallments || fallbackTotal,
      };
    }
    return { ...def, enabled: false, totalInstallments: def.totalInstallments || fallbackTotal };
  });

  raw.forEach((item) => {
    if (item && item.frequency && !DEFAULT_FREQUENCIES.some((d) => d.frequency === item.frequency)) {
      base.push({
        frequency: item.frequency,
        label: item.label || item.name || item.frequency,
        interval: item.interval || item.label,
        enabled: item.enabled !== undefined ? Boolean(item.enabled) : item.isActive !== false,
        totalInstallments: parseInt(String(item.totalInstallments || item.installments), 10) || fallbackTotal,
        isCustom: true,
      });
    }
  });

  return base;
};

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
  const [showAddCustomFreq, setShowAddCustomFreq] = useState(false);
  const [customFreqLabel, setCustomFreqLabel] = useState("");
  const [customFreqDays, setCustomFreqDays] = useState(45);

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
    installmentsEnabled: false,
    totalInstallments: 3,
    installmentFrequencies: DEFAULT_FREQUENCIES.map((f) => ({ ...f })),
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

  // Razorpay Gateway Config State
  const [isRazorpayModalOpen, setIsRazorpayModalOpen] = useState(false);
  const [activeRazorpayKey, setActiveRazorpayKey] = useState("");
  const [isKeyConfigured, setIsKeyConfigured] = useState(false);
  const [rzpForm, setRzpForm] = useState({ keyId: "", keySecret: "" });

  // QR Code Modal State
  const [qrModalTier, setQrModalTier] = useState<LevelTier | null>(null);

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

      const resStudents = await fetch(`${API}/admin/students/summary`, { headers });
      const dataStudents = await resStudents.json();
      if (Array.isArray(dataStudents)) {
        setStudents(dataStudents);
      }


      const resOffers = await fetch(`${API}/admin/offers`, { headers });
      const dataOffers = await resOffers.json();
      if (Array.isArray(dataOffers)) {
        setLevelOffers(dataOffers);
      }

      // Fetch Razorpay configuration status
      try {
        const resKey = await fetch(`${API}/payments/key`, { headers });
        const dataKey = await resKey.json();
        if (dataKey) {
          setActiveRazorpayKey(dataKey.keyId || "");
          setIsKeyConfigured(!!dataKey.isConfigured);
        }
      } catch (_) {}
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
      installmentsEnabled: false,
      totalInstallments: 3,
      installmentFrequencies: DEFAULT_FREQUENCIES.map((f) => ({ ...f })),
    });
    setShowAddCustomFreq(false);
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
      installmentsEnabled: !!tier.installmentsEnabled,
      totalInstallments: tier.totalInstallments ? Math.max(2, Math.min(24, tier.totalInstallments)) : 3,
      installmentFrequencies: normalizeFrequencies(tier.installmentPlans, tier.totalInstallments || 3),
    });
    setShowAddCustomFreq(false);
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
        installmentsEnabled: Boolean(formData.installmentsEnabled),
        totalInstallments: Math.max(2, Math.min(24, parseInt(String(formData.totalInstallments), 10) || 3)),
        installmentPlans: formData.installmentFrequencies.map((f) => ({
          frequency: f.frequency,
          label: f.label,
          interval: f.interval,
          enabled: f.enabled,
          totalInstallments: Math.max(2, Math.min(24, parseInt(String(f.totalInstallments), 10) || parseInt(String(formData.totalInstallments), 10) || 3)),
          isCustom: f.isCustom,
        })),
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
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm font-black text-white">
                  Razorpay Payment Gateway Integration
                </h3>
                {isKeyConfigured ? (
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    Live Key Active: {activeRazorpayKey}
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    ⚠️ Using Dummy Fallback Key ({activeRazorpayKey || 'None'})
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Saved keys persist permanently in the database across all server restarts.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setRzpForm({ keyId: activeRazorpayKey.includes('1DP5mmOlF5G5ag') ? '' : activeRazorpayKey, keySecret: '' });
              setIsRazorpayModalOpen(true);
            }}
            className="px-4 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 text-slate-950 font-black text-xs rounded-xl shadow-md cursor-pointer whitespace-nowrap flex items-center gap-2 transition-transform hover:scale-105"
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

                    {/* Installment Plans Status Box */}
                    {tier.installmentsEnabled ? (
                      <div className="my-3 p-3 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 text-xs space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-black text-emerald-400 flex items-center gap-1.5">
                            <CreditCard size={12} /> Installments Enabled
                          </span>
                          <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                            Active
                          </span>
                        </div>
                        {(() => {
                          const activeFreqs = normalizeFrequencies(tier.installmentPlans).filter((f) => f.enabled);
                          return activeFreqs.length > 0 ? (
                            <div>
                              <div className="flex flex-wrap gap-1 mb-1.5">
                                {activeFreqs.map((f) => (
                                  <span
                                    key={f.frequency}
                                    className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300"
                                  >
                                    🗓️ {f.label}
                                  </span>
                                ))}
                              </div>
                              <p className="text-[10px] text-slate-400">
                                Students enter count (2-12) &amp; choose frequency; price auto-divides from {displayPrice}.
                              </p>
                            </div>
                          ) : (
                            <p className="text-[10px] text-amber-400 font-medium">
                              Installments active. Edit tier to check allowed frequencies.
                            </p>
                          );
                        })()}
                      </div>
                    ) : (
                      <div className="my-2 px-3 py-1.5 rounded-xl bg-slate-950/60 border border-slate-800 text-[10px] text-slate-500 flex items-center justify-between">
                        <span>Installments: Disabled</span>
                        <span className="text-[9px] text-slate-600">Full payment only</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 pt-3 border-t border-slate-800/80">
                    <button
                      onClick={() => openEditModal(tier)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs h-9 rounded-xl border border-slate-700 transition-colors cursor-pointer"
                    >
                      <Edit2 size={13} /> Edit Tier &amp; Price
                    </button>
                    <button
                      onClick={() => setQrModalTier(tier)}
                      className="px-3 bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 font-bold text-xs h-9 rounded-xl border border-orange-500/30 transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
                      title="Generate &amp; Download QR Code"
                    >
                      <QrCode size={13} /> QR Code
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
          <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 md:p-6">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl relative overflow-hidden animate-scale-up">
              {/* Decorative Background Glows */}
              <div className="absolute top-0 right-0 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

              {/* Fixed Header */}
              <div className="flex justify-between items-center px-6 py-4 md:px-8 md:py-5 border-b border-slate-800 shrink-0 bg-slate-900/95 backdrop-blur-md relative z-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
                    <Trophy size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg md:text-xl font-black text-white flex items-center gap-2">
                      {editingTier ? `Edit Level & Price (${editingTier.code})` : 'Create New Level Tier'}
                    </h3>
                    <p className="text-xs text-slate-400">Configure tier pricing, validity, installment options & privileges</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Form with Scrollable Content Body and Sticky Footer */}
              <form onSubmit={handleSaveTier} className="flex flex-col flex-1 min-h-0">
                
                {/* Scrollable Body */}
                <div className="overflow-y-auto px-6 py-5 md:px-8 md:py-6 space-y-5 flex-1 relative z-10">
                  
                  {/* Card 1: Core Tier Identity & Pricing */}
                  <div className="p-4 md:p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-4">
                    <div className="text-xs font-black uppercase text-orange-400 tracking-wider flex items-center gap-2">
                      <Tag size={13} /> Tier Identity &amp; Pricing
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-400 mb-1.5">Tier Code</label>
                        <input
                          type="text"
                          value={formData.code}
                          onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                          placeholder="e.g. L1"
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white font-bold focus:outline-none focus:border-orange-500"
                          required
                        />
                      </div>

                      <div className="sm:col-span-1 md:col-span-2">
                        <label className="block text-xs font-bold text-slate-400 mb-1.5">Level Title / Name</label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="e.g. Silver Member"
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white font-bold focus:outline-none focus:border-orange-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-400 mb-1.5">Hierarchy Order #</label>
                        <input
                          type="number"
                          value={formData.order}
                          onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                          placeholder="0, 1, 2, 3..."
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-slate-800/60">
                      <div>
                        <label className="block text-xs font-bold text-slate-400 mb-1.5">Base Price / Fee (₹)</label>
                        <input
                          type="text"
                          value={formData.price}
                          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                          placeholder="e.g. ₹4,999"
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-amber-400 font-mono font-bold focus:outline-none focus:border-orange-500"
                        />
                      </div>

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
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white font-bold focus:outline-none focus:border-orange-500"
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
                              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-amber-400 focus:outline-none focus:border-orange-500 font-mono font-bold"
                            />
                            <p className="text-[10px] text-amber-400 mt-1">
                              ⏳ Auto-expires {formData.validityDays || 15} days after purchase.
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
                  </div>

                  {/* Card 2: Publication Status & Installment Payments */}
                  <div className="space-y-4">
                    {/* Published / Active Toggle */}
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
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

                    {/* Installment Payment Plans Configuration */}
                    <div className="p-4 md:p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <CreditCard className="w-4 h-4 text-orange-400" />
                            <span className="text-xs font-bold text-white">Enable Installment Payment Plans</span>
                          </div>
                          <p className="text-[10px] text-slate-400 mt-0.5">
                            Allow students to purchase this level via custom recurring installments (Bi-weekly, Monthly, Every 2 Months, etc.)
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.installmentsEnabled}
                            onChange={(e) => setFormData({ ...formData, installmentsEnabled: e.target.checked })}
                            className="sr-only peer"
                          />
                          <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-orange-500"></div>
                        </label>
                      </div>

                      {formData.installmentsEnabled && (
                        <div className="space-y-4 pt-3 border-t border-slate-800/80">
                          {/* Total Number of Installments set by Admin */}
                          <div className="p-4 rounded-2xl bg-slate-900 border border-amber-500/30 space-y-2.5">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                              <div>
                                <label className="text-xs font-black text-amber-400 uppercase tracking-wide flex items-center gap-1.5">
                                  <CreditCard size={14} /> Total Number of Installments (Fixed for Students)
                                </label>
                                <p className="text-[11px] text-slate-300 mt-0.5">
                                  Students cannot edit this count. When a student chooses installments, the fee is automatically divided into this exact number of installments.
                                </p>
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                <input
                                  type="number"
                                  min={2}
                                  max={12}
                                  value={formData.totalInstallments}
                                  onChange={(e) => {
                                    const val = parseInt(e.target.value, 10);
                                    const num = isNaN(val) ? 2 : Math.max(2, Math.min(12, val));
                                    setFormData((prev) => ({
                                      ...prev,
                                      totalInstallments: num,
                                      installmentFrequencies: prev.installmentFrequencies.map((f) => ({
                                        ...f,
                                        totalInstallments: num,
                                      })),
                                    }));
                                  }}
                                  className="w-24 bg-slate-950 border border-amber-500/50 rounded-xl px-3 py-2 text-sm text-amber-300 font-mono font-black text-center focus:outline-none focus:border-amber-400 shadow-inner"
                                />
                                <span className="text-xs font-bold text-slate-300">Installments</span>
                              </div>
                            </div>

                            {/* Live calculation preview for Admin */}
                            {(() => {
                              const cleanNumeric = parseFloat((formData.price || '0').replace(/[^0-9.]/g, '')) || 0;
                              const numInst = Math.max(2, formData.totalInstallments || 3);
                              const perInst = Math.round(cleanNumeric / numInst);
                              return (
                                <div className="text-[11px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 rounded-xl flex flex-wrap items-center justify-between gap-1">
                                  <span>💡 Student Breakdown Preview:</span>
                                  <span className="font-mono font-bold">
                                    ₹{cleanNumeric.toLocaleString('en-IN')} ÷ {numInst} = ₹{perInst.toLocaleString('en-IN')} / installment
                                  </span>
                                </div>
                              );
                            })()}
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-xs font-bold text-amber-400 block">
                                Allowed Installment Frequencies ({formData.installmentFrequencies.filter((f) => f.enabled).length} Enabled)
                              </span>
                              <span className="text-[10px] text-slate-400">
                                Check the payment intervals that students will see in their dropdown during checkout.
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => setShowAddCustomFreq(!showAddCustomFreq)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold bg-orange-500/20 text-orange-400 hover:bg-orange-500/30 border border-orange-500/30 rounded-xl transition-all cursor-pointer"
                            >
                              <Plus className="w-3.5 h-3.5" /> Add Custom Frequency
                            </button>
                          </div>

                          {/* Add Custom Frequency Inline Form */}
                          {showAddCustomFreq && (
                            <div className="p-3.5 rounded-2xl bg-slate-900 border border-orange-500/30 space-y-3">
                              <span className="text-xs font-bold text-white block">Add Custom Frequency Option</span>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                  <label className="text-[10px] text-slate-400 block mb-1 font-bold">Display Label</label>
                                  <input
                                    type="text"
                                    value={customFreqLabel}
                                    onChange={(e) => setCustomFreqLabel(e.target.value)}
                                    placeholder="e.g. Every 45 Days, Every 4 Months"
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                                  />
                                </div>
                                <div>
                                  <label className="text-[10px] text-slate-400 block mb-1 font-bold">Interval Period (Days)</label>
                                  <input
                                    type="number"
                                    min="1"
                                    value={customFreqDays}
                                    onChange={(e) => setCustomFreqDays(parseInt(e.target.value) || 30)}
                                    placeholder="Days e.g. 45"
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-amber-400 font-mono font-bold focus:outline-none focus:border-orange-500"
                                  />
                                </div>
                              </div>
                              <div className="flex justify-end gap-2 pt-1">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setShowAddCustomFreq(false);
                                    setCustomFreqLabel("");
                                  }}
                                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white cursor-pointer"
                                >
                                  Cancel
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (!customFreqLabel.trim()) return;
                                    const freqKey = `${customFreqDays}days`;
                                    const newItem: InstallmentFrequencyItem = {
                                      frequency: freqKey,
                                      label: customFreqLabel.trim(),
                                      interval: `Every ${customFreqDays} Days`,
                                      enabled: true,
                                      isCustom: true,
                                    };
                                    setFormData((prev) => ({
                                      ...prev,
                                      installmentFrequencies: [...prev.installmentFrequencies, newItem],
                                    }));
                                    setShowAddCustomFreq(false);
                                    setCustomFreqLabel("");
                                  }}
                                  className="px-4 py-1.5 rounded-xl text-xs font-bold bg-orange-500 text-slate-950 hover:bg-orange-400 cursor-pointer shadow-md"
                                >
                                  Add Frequency
                                </button>
                              </div>
                            </div>
                          )}

                          {/* Grid of Frequency Switches - 3 Columns on wide modal */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                            {formData.installmentFrequencies.map((item, idx) => (
                              <div
                                key={item.frequency}
                                className={`p-3 rounded-2xl border flex flex-col justify-between gap-2.5 transition-all ${
                                  item.enabled
                                    ? "bg-slate-900/90 border-orange-500/40 text-white"
                                    : "bg-slate-950/60 border-slate-800/80 text-slate-500"
                                }`}
                              >
                                <div className="flex items-center justify-between gap-2">
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-1.5">
                                      <span className="text-xs font-bold truncate">{item.label}</span>
                                      {item.isCustom && (
                                        <span className="text-[9px] font-bold text-cyan-400 bg-cyan-500/10 px-1 rounded">
                                          Custom
                                        </span>
                                      )}
                                    </div>
                                    <span className="text-[10px] text-slate-400 block truncate mt-0.5">
                                      {item.interval || item.frequency}
                                    </span>
                                  </div>

                                  <div className="flex items-center gap-1.5 shrink-0">
                                    {item.isCustom && (
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setFormData((prev) => ({
                                            ...prev,
                                            installmentFrequencies: prev.installmentFrequencies.filter((_, i) => i !== idx),
                                          }));
                                        }}
                                        className="text-slate-500 hover:text-red-400 p-1 transition-colors cursor-pointer"
                                        title="Delete custom frequency"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    )}
                                    <label className="relative inline-flex items-center cursor-pointer">
                                      <input
                                        type="checkbox"
                                        checked={item.enabled}
                                        onChange={(e) => {
                                          const checked = e.target.checked;
                                          setFormData((prev) => ({
                                            ...prev,
                                            installmentFrequencies: prev.installmentFrequencies.map((f, i) =>
                                              i === idx ? { ...f, enabled: checked } : f
                                            ),
                                          }));
                                        }}
                                        className="sr-only peer"
                                      />
                                      <div className="w-8 h-4 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-emerald-500"></div>
                                    </label>
                                  </div>
                                </div>

                                {item.enabled && (
                                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-1 text-[11px]">
                                    <span className="text-amber-400 font-bold">EMIs:</span>
                                    <div className="flex items-center gap-1">
                                      <input
                                        type="number"
                                        min={2}
                                        max={24}
                                        value={item.totalInstallments || formData.totalInstallments || 3}
                                        onChange={(e) => {
                                          const val = parseInt(e.target.value, 10);
                                          const num = isNaN(val) ? 2 : Math.max(2, Math.min(24, val));
                                          setFormData((prev) => ({
                                            ...prev,
                                            installmentFrequencies: prev.installmentFrequencies.map((f, i) =>
                                              i === idx ? { ...f, totalInstallments: num } : f
                                            ),
                                          }));
                                        }}
                                        className="w-14 bg-slate-950 border border-amber-500/40 rounded-lg px-2 py-0.5 text-xs text-amber-300 font-bold font-mono text-center focus:outline-none focus:border-amber-400"
                                      />
                                      <span className="text-[10px] text-slate-400">EMIs</span>
                                    </div>
                                    {(() => {
                                      const cleanNumeric = parseFloat((formData.price || '0').replace(/[^0-9.]/g, '')) || 0;
                                      const count = item.totalInstallments || formData.totalInstallments || 3;
                                      const each = Math.round(cleanNumeric / count);
                                      return (
                                        <span className="text-[10px] text-emerald-400 font-mono font-bold shrink-0">
                                          ₹{each.toLocaleString('en-IN')}/ea
                                        </span>
                                      );
                                    })()}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>

                          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 text-[11px] text-slate-400 flex items-start gap-2">
                            <Sparkles className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                            <span>
                              <strong>Smart Multi-Frequency EMIs:</strong> When enabled, students select from your checked frequencies during checkout. The total installments and pricing auto-calculate dynamically based on your settings above.
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card 3: Visual Styling & Description */}
                  <div className="p-4 md:p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-4">
                    <div className="text-xs font-black uppercase text-orange-400 tracking-wider flex items-center gap-2">
                      <Sparkles size={13} /> Visual Appearance &amp; Details
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {/* Icon Selection */}
                      <div>
                        <label className="block text-xs font-bold text-slate-400 mb-1.5">Choose Icon / Emoji</label>
                        <div className="flex flex-wrap gap-2 mb-2.5">
                          {EMOJI_PRESETS.map((em, i) => (
                            <button
                              key={i}
                              type="button"
                              onClick={() => setFormData({ ...formData, icon: em })}
                              className={`w-9 h-9 rounded-xl border flex items-center justify-center text-lg transition-all cursor-pointer ${
                                formData.icon === em
                                  ? 'bg-orange-500/20 border-orange-500 scale-110 shadow-sm'
                                  : 'bg-slate-900 border-slate-800 hover:border-slate-700'
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
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
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
                                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                              }`}
                            >
                              <span className={`w-3 h-3 rounded-full ${c.bg}`} />
                              <span className="truncate">{c.label.split('/')[0]}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-1.5">Description &amp; Access Privileges</label>
                      <textarea
                        rows={3}
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="e.g. Access to live interactive masterclasses, weekly Q&A calls, and replay vault."
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3.5 text-xs text-white focus:outline-none focus:border-orange-500 resize-none leading-relaxed"
                      />
                    </div>
                  </div>

                </div>

                {/* Fixed Sticky Footer */}
                <div className="flex items-center justify-end gap-3 px-6 py-4 md:px-8 md:py-4.5 border-t border-slate-800 shrink-0 bg-slate-900/95 backdrop-blur-md relative z-10">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-sm h-11 px-6 rounded-xl transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-black text-sm h-11 px-8 rounded-xl shadow-lg transition-all hover:scale-[1.02] cursor-pointer"
                  >
                    {editingTier ? 'Update Level Tier & Price' : 'Create Level Tier'}
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

        {/* Razorpay Credentials Modal */}
        {isRazorpayModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400">
                    <CreditCard size={20} />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-white">Configure Razorpay Gateway</h3>
                    <p className="text-xs text-slate-400">Keys persist permanently in Postgres database</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsRazorpayModalOpen(false)}
                  className="w-8 h-8 rounded-xl bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!rzpForm.keyId.trim()) {
                    showError("Key ID is required");
                    return;
                  }
                  if (!rzpForm.keySecret.trim()) {
                    showError("Key Secret is required");
                    return;
                  }

                  fetch(`${API}/payments/config`, {
                    method: "POST",
                    headers,
                    body: JSON.stringify({
                      keyId: rzpForm.keyId.trim(),
                      keySecret: rzpForm.keySecret.trim(),
                    }),
                  })
                    .then((r) => r.json())
                    .then((d) => {
                      if (d.success) {
                        showSuccess("Razorpay credentials saved to database permanently!");
                        setActiveRazorpayKey(d.keyId || rzpForm.keyId);
                        setIsKeyConfigured(true);
                        setIsRazorpayModalOpen(false);
                      } else {
                        showError(d.message || "Failed to update keys");
                      }
                    })
                    .catch(() => showError("Connection error to backend"));
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Razorpay Key ID <span className="text-orange-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="rzp_test_... or rzp_live_..."
                    value={rzpForm.keyId}
                    onChange={(e) => setRzpForm({ ...rzpForm, keyId: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white font-mono placeholder-slate-600 outline-none focus:border-orange-500"
                  />
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    Starts with <code className="text-orange-400">rzp_test_</code> (Test mode) or <code className="text-emerald-400">rzp_live_</code> (Live mode).
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Razorpay Key Secret <span className="text-orange-400">*</span>
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Enter Key Secret provided by Razorpay"
                    value={rzpForm.keySecret}
                    onChange={(e) => setRzpForm({ ...rzpForm, keySecret: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white font-mono placeholder-slate-600 outline-none focus:border-orange-500"
                  />
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    Used to cryptographically sign orders and verify genuine student transactions.
                  </span>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-400 space-y-1">
                  <p className="font-semibold text-slate-300">💡 Tip for Production (Render):</p>
                  <p className="text-[11px]">
                    You can also add <code className="text-orange-400">RAZORPAY_KEY_ID</code> and <code className="text-orange-400">RAZORPAY_KEY_SECRET</code> in Render Dashboard &gt; lms-backend &gt; Environment for permanent cloud deployment.
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 text-slate-950 font-black text-sm h-11 rounded-xl shadow-lg cursor-pointer"
                  >
                    💾 Save &amp; Persist Configuration
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsRazorpayModalOpen(false)}
                    className="px-5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-sm h-11 rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* QR Code Generator & Download Modal */}
        <LevelQrCodeModal
          isOpen={!!qrModalTier}
          onClose={() => setQrModalTier(null)}
          tier={qrModalTier}
        />
      </main>
    </div>
  );
}
