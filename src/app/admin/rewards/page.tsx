"use client";

import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { AdminNav } from "@/components/layout/AdminNav";
import {
  ShoppingBag,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  Upload,
  Image as ImageIcon,
  Gift,
  Star,
  Search,
  X,
  AlertTriangle,
  ChevronDown,
} from "lucide-react";
import { API_BASE_URL } from "@/config/api";

interface RewardItem {
  id: string;
  title: string;
  description: string;
  pointCost: number;
  imageUrl?: string;
  createdAt?: string;
}

const CATEGORY_OPTIONS = [
  "All Rewards",
  "Physical Merch Kit",
  "Stationery & Journals",
  "Mentoring Call",
  "Discount Vouchers",
  "Live Event & Certificates",
];

export default function AdminRewardsManager() {
  const { token, user, logout } = useAuth();
  const [rewards, setRewards] = useState<RewardItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Rewards");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<RewardItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    pointCost: 1500,
    imageUrl: "",
  });

  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 3500);
  };

  const showError = (msg: string) => {
    setErrorMsg(msg);
    setTimeout(() => setErrorMsg(""), 3500);
  };

  const fetchRewards = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/rewards`, { headers });
      const data = await res.json();
      if (Array.isArray(data)) {
        setRewards(data);
      }
    } catch (err) {
      console.error("Error fetching rewards:", err);
      showError("Failed to fetch merchandise catalog");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchRewards();
  }, [token]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle File Upload (Convert & Compress Image to Base64 Data URL)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      showError("Image file size must be less than 10MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);

        const compressedBase64 = canvas.toDataURL("image/jpeg", 0.8);
        setFormData((prev) => ({ ...prev, imageUrl: compressedBase64 }));
        showSuccess("Featured merch image uploaded & optimized!");
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const openCreateModal = () => {
    setEditingItem(null);
    setFormData({
      title: "",
      description: "",
      pointCost: 1500,
      imageUrl: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item: RewardItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description,
      pointCost: item.pointCost,
      imageUrl: item.imageUrl || "",
    });
    setIsModalOpen(true);
  };

  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) {
      showError("Title and Description are required");
      return;
    }

    setIsSubmitting(true);
    try {
      const url = editingItem
        ? `${API_BASE_URL}/rewards/${editingItem.id}`
        : `${API_BASE_URL}/rewards`;
      const method = editingItem ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        showSuccess(
          editingItem
            ? `Merch item "${formData.title}" updated successfully!`
            : `New merch item "${formData.title}" added to store!`
        );
        setIsModalOpen(false);
        fetchRewards();
      } else {
        showError(data.message || "Failed to save item");
      }
    } catch (err: any) {
      showError(err.message || "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteItem = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}" from the Merch Store?`)) return;
    try {
      const res = await fetch(`${API_BASE_URL}/rewards/${id}`, {
        method: "DELETE",
        headers,
      });

      if (res.ok) {
        showSuccess(`Merch item "${title}" removed from store`);
        fetchRewards();
      } else {
        showError("Failed to delete item");
      }
    } catch (err: any) {
      showError(err.message || "An error occurred");
    }
  };

  const filteredRewards = rewards.filter((r) => {
    const matchesSearch =
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.id.toLowerCase().includes(searchQuery.toLowerCase());

    if (selectedCategory === "All Rewards") return matchesSearch;
    return (
      matchesSearch &&
      (r.title.toLowerCase().includes(selectedCategory.toLowerCase()) ||
        r.description.toLowerCase().includes(selectedCategory.toLowerCase()))
    );
  });

  const xpCosts = rewards.map((r) => r.pointCost);
  const minXP = xpCosts.length > 0 ? Math.min(...xpCosts).toLocaleString() : "0";
  const maxXP = xpCosts.length > 0 ? Math.max(...xpCosts).toLocaleString() : "0";

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
        {/* Header Section matching reference image */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-5 sm:mb-6">
          <div>
            {/* Top pill badge + breadcrumb */}
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="bg-[#feeae2] border border-[#fcd7c7] text-[#c2410c] text-xs font-bold px-2.5 py-1 rounded-md inline-flex items-center gap-1.5 uppercase tracking-wide">
                <Gift className="w-3.5 h-3.5" /> OFFICIAL MERCH &amp; XP STORE
              </span>
              <span className="text-stone-300 font-light">|</span>
              <span className="text-stone-500 font-medium text-xs sm:text-sm">
                Merch Store Manager
              </span>
            </div>

            {/* Title (No vertical red bar, clean serif title) */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-stone-900 tracking-tight mt-1 mb-1">
              Merch Store Manager
            </h1>

            {/* Subtitle */}
            <p className="text-stone-500 text-xs sm:text-sm font-normal max-w-3xl leading-relaxed">
              Manage physical merchandise bundles, journals, mentoring vouchers, and tickets that students can redeem with their XP points.
            </p>
          </div>

          {/* Top CTA Button */}
          <button
            onClick={openCreateModal}
            className="bg-[#c2410c] hover:bg-[#a83408] text-white font-semibold text-xs sm:text-sm px-4 sm:px-5 py-2.5 rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 shrink-0 self-start md:self-auto cursor-pointer"
          >
            <Plus size={16} /> Add New Merch Item
          </button>
        </div>

        {/* Alerts */}
        {successMsg && (
          <div className="mb-5 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 text-xs sm:text-sm font-bold flex items-center gap-2">
            <CheckCircle2 size={18} /> {successMsg}
          </div>
        )}
        {errorMsg && (
          <div className="mb-5 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-600 text-xs sm:text-sm font-bold flex items-center gap-2">
            <AlertTriangle size={18} /> {errorMsg}
          </div>
        )}

        {/* Search, Filter & Overview Stat Pills Bar (Balanced across full width) */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3.5 mb-5 sm:mb-6">
          {/* Left Group: Search Box + Category Dropdown */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 flex-1 max-w-2xl">
            <div className="relative flex-1 min-w-[220px]">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                <Search size={16} />
              </div>
              <input
                type="text"
                placeholder="Search merch item, ID, or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-stone-200/90 rounded-2xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-[#c2410c] focus:ring-1 focus:ring-[#c2410c]/20 transition-all shadow-2xs"
              />
            </div>

            {/* <div className="relative shrink-0" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="bg-white border border-stone-200/90 rounded-2xl px-4 py-2.5 text-xs sm:text-sm font-medium text-stone-800 flex items-center justify-between gap-3 shadow-2xs hover:border-stone-300 transition-colors cursor-pointer min-w-[145px]"
              >
                <span>{selectedCategory}</span>
                <ChevronDown
                  size={15}
                  className={`text-stone-500 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
                />
              </button>
              {isDropdownOpen && (
                <div className="absolute left-0 mt-2 w-56 bg-white border border-stone-200 rounded-2xl shadow-lg py-1.5 z-30">
                  {CATEGORY_OPTIONS.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => {
                        setSelectedCategory(cat);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-xs sm:text-sm transition-colors cursor-pointer ${
                        selectedCategory === cat
                          ? "bg-[#fff5ee] text-[#c2410c] font-bold"
                          : "text-stone-700 hover:bg-stone-50 font-normal"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}
            </div> */}
          </div>

          {/* Right Group: Stat Pills */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0 self-start md:self-auto">
            {/* Stat Pill 1: Total Store Items */}
            <div className="bg-white border border-stone-200/90 rounded-2xl px-4 py-2.5 text-xs sm:text-sm font-bold text-stone-800 flex items-center gap-2 shadow-2xs shrink-0 whitespace-nowrap">
              <Gift size={16} className="text-[#c2410c]" />
              <span>{rewards.length} Store Items</span>
            </div>

            {/* Stat Pill 2: XP Range */}
            <div className="bg-white border border-stone-200/90 rounded-2xl px-4 py-2.5 text-xs sm:text-sm font-bold text-stone-800 flex items-center gap-2 shadow-2xs shrink-0 whitespace-nowrap">
              <Star size={16} className="text-amber-500" />
              <span>{rewards.length > 0 ? `${minXP} – ${maxXP} XP` : "0 XP"}</span>
            </div>
          </div>
        </div>

        {/* Main Rewards Table Container matching Reference Image */}
        {isLoading ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-stone-200/80 shadow-xs">
            <div className="inline-block animate-spin w-8 h-8 border-4 border-[#c2410c] border-t-transparent rounded-full mb-3"></div>
            <p className="text-stone-500 text-xs sm:text-sm font-bold">Loading merchandise catalog...</p>
          </div>
        ) : filteredRewards.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-stone-200/80 shadow-xs">
            <ShoppingBag size={48} className="mx-auto text-stone-300 mb-3" />
            <p className="text-stone-900 font-bold text-base sm:text-lg mb-1">No merchandise items found</p>
            <p className="text-stone-500 text-xs sm:text-sm mb-4">Click "Add New Merch Item" to create your first merchandise offering.</p>
            <button
              onClick={openCreateModal}
              className="bg-[#c2410c] hover:bg-[#a83408] text-white font-semibold px-5 py-2.5 rounded-xl text-xs sm:text-sm shadow-xs cursor-pointer inline-flex items-center gap-1.5"
            >
              <Plus size={16} /> Add First Item
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs overflow-hidden">
            {/* Table Header (Desktop & Tablet) */}
            <div className="hidden md:flex items-center px-5 sm:px-6 py-3.5 bg-[#faf6f3] border-b border-stone-100 text-xs sm:text-sm font-bold text-stone-700">
              <div className="flex-1 min-w-0 pr-4">Reward Item</div>
              <div className="w-44 text-center shrink-0">XP Cost</div>
              <div className="w-40 text-center shrink-0">Item ID</div>
              <div className="w-28 text-right shrink-0">Actions</div>
            </div>

            {/* Table Rows */}
            <div className="divide-y divide-stone-100">
              {filteredRewards.map((item) => (
                <div
                  key={item.id}
                  className="hover:bg-[#faf8f5]/60 transition-colors"
                >
                  {/* Desktop & Tablet Row (md+) */}
                  <div className="hidden md:flex items-center px-5 sm:px-6 py-4">
                    {/* Column 1: Reward Item (Thumbnail + Title + Description) */}
                    <div className="flex-1 min-w-0 flex items-center gap-4 pr-4">
                      <div className="w-24 h-16 sm:w-28 sm:h-18 rounded-2xl overflow-hidden shrink-0 border border-stone-100 bg-stone-100 relative">
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-stone-300">
                            <ImageIcon size={28} />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3
                          onClick={() => openEditModal(item)}
                          className="font-bold text-sm sm:text-base text-stone-900 leading-snug line-clamp-1 hover:text-[#c2410c] transition-colors cursor-pointer"
                        >
                          {item.title}
                        </h3>
                        <p className="text-xs text-stone-500 font-normal line-clamp-2 mt-1 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    {/* Column 2: XP Cost */}
                    <div className="w-44 shrink-0 flex justify-center">
                      <span className="bg-[#fff5ee] border border-[#fde5d6] text-[#c2410c] text-xs sm:text-sm font-bold px-3.5 py-1.5 rounded-full inline-flex items-center gap-1.5 whitespace-nowrap">
                        <Star size={13} className="text-[#c2410c] fill-[#c2410c]/20" />
                        {item.pointCost.toLocaleString()} XP
                      </span>
                    </div>

                    {/* Column 3: Item ID */}
                    <div className="w-40 shrink-0 text-center">
                      <span className="text-xs font-mono text-stone-400 whitespace-nowrap">
                        ID: {item.id.slice(0, 8)}...
                      </span>
                    </div>

                    {/* Column 4: Actions (Edit & Delete) */}
                    <div className="w-28 shrink-0 flex items-center justify-end gap-2.5">
                      <button
                        type="button"
                        onClick={() => openEditModal(item)}
                        className="w-8 h-8 rounded-full border border-stone-200 bg-white hover:bg-stone-50 hover:border-stone-300 flex items-center justify-center text-stone-400 hover:text-stone-700 transition-colors cursor-pointer shadow-2xs shrink-0"
                        title="Edit Item"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteItem(item.id, item.title)}
                        className="w-8 h-8 rounded-full border border-stone-200 bg-white hover:bg-rose-50 hover:border-rose-200 flex items-center justify-center text-rose-500 hover:text-rose-600 transition-colors cursor-pointer shadow-2xs shrink-0"
                        title="Delete Item"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  {/* Mobile Stacked View (< md) */}
                  <div className="p-4 md:hidden flex flex-col gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-20 h-16 rounded-xl overflow-hidden shrink-0 border border-stone-100 bg-stone-100 relative">
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-stone-300">
                            <ImageIcon size={22} />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3
                          onClick={() => openEditModal(item)}
                          className="font-bold text-sm text-stone-900 leading-snug line-clamp-1 hover:text-[#c2410c] transition-colors cursor-pointer"
                        >
                          {item.title}
                        </h3>
                        <p className="text-xs text-stone-500 font-normal line-clamp-2 mt-0.5 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-2 border-t border-stone-50">
                      <span className="bg-[#fff5ee] border border-[#fde5d6] text-[#c2410c] text-xs font-bold px-3 py-1 rounded-full inline-flex items-center gap-1.5 whitespace-nowrap">
                        <Star size={12} className="text-[#c2410c] fill-[#c2410c]/20" />
                        {item.pointCost.toLocaleString()} XP
                      </span>

                      <span className="text-xs font-mono text-stone-400">
                        ID: {item.id.slice(0, 8)}...
                      </span>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => openEditModal(item)}
                          className="w-8 h-8 rounded-full border border-stone-200 bg-white hover:bg-stone-50 flex items-center justify-center text-stone-400 hover:text-stone-700 transition-colors shadow-2xs"
                          title="Edit Item"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteItem(item.id, item.title)}
                          className="w-8 h-8 rounded-full border border-stone-200 bg-white hover:bg-rose-50 flex items-center justify-center text-rose-500 transition-colors shadow-2xs"
                          title="Delete Item"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Modal: Create / Edit Merch Item */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-[#ecdccb] rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative text-stone-900 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 text-stone-400 hover:text-stone-700 p-2 rounded-xl hover:bg-stone-100 transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-[#fff5ee] border border-[#f5ded0] flex items-center justify-center text-[#c4431d] font-black">
                <ShoppingBag size={24} />
              </div>
              <div>
                <h2 className="text-xl font-black text-stone-900">
                  {editingItem ? "Edit Merch Item" : "Add New Merch Item"}
                </h2>
                <p className="text-xs text-stone-500">
                  {editingItem
                    ? "Update item details, XP cost, and featured image"
                    : "Create a new physical merchandise product or reward"}
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveItem} className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Item Title / Merch Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Custom Hardcover Artistry Journal with Pen"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-[#fcfaf7] border border-stone-300 rounded-xl px-4 py-3 text-sm text-stone-900 focus:outline-none focus:border-[#c4431d] focus:ring-1 focus:ring-[#c4431d]/30 transition-colors"
                />
              </div>

              {/* Point Cost */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Redemption XP Cost (Points) *
                </label>
                <div className="relative">
                  <input
                    type="number"
                    required
                    min={100}
                    step={50}
                    placeholder="1500"
                    value={formData.pointCost}
                    onChange={(e) => setFormData({ ...formData, pointCost: Number(e.target.value) })}
                    className="w-full bg-[#fcfaf7] border border-stone-300 rounded-xl pl-4 pr-12 py-3 text-sm text-stone-900 font-bold focus:outline-none focus:border-[#c4431d] focus:ring-1 focus:ring-[#c4431d]/30 transition-colors"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-black text-amber-400">
                    XP
                  </span>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Full Inclusions & Description *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="List all contents, specifications, and inclusions (e.g. 9-Piece Merch Bundle: Badge, Magnet, Goal Card, Lanyard, Notebook, Pen, Voucher...)"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-[#fcfaf7] border border-stone-300 rounded-xl px-4 py-3 text-sm text-stone-900 focus:outline-none focus:border-[#c4431d] focus:ring-1 focus:ring-[#c4431d]/30 leading-relaxed transition-colors"
                />
              </div>

              {/* Featured Image & File Upload */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Featured Merch Image (Upload File or Enter Image URL)
                </label>

                {/* Live Preview Box */}
                {formData.imageUrl && (
                  <div className="mb-3 relative rounded-2xl overflow-hidden border border-stone-200 h-40 bg-stone-100 flex items-center justify-center">
                    <img
                      src={formData.imageUrl}
                      alt="Merch Preview"
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-2 right-2 bg-white/95 text-xs font-bold px-2.5 py-1 rounded-lg text-emerald-700 border border-emerald-200 shadow-xs">
                      Live Preview
                    </span>
                  </div>
                )}

                {/* Upload File Input */}
                <div className="flex flex-col sm:flex-row gap-2 mb-2">
                  <label className="flex-1 cursor-pointer bg-[#fff5ee] hover:bg-[#fde5d6] border border-dashed border-[#f5ded0] rounded-xl p-3 text-center transition-all flex items-center justify-center gap-2 text-xs font-bold text-[#c2410c]">
                    <Upload size={16} /> Upload Image File From Device
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Image URL Fallback */}
                <input
                  type="text"
                  placeholder="Or paste external Unsplash/CDN image URL (e.g. https://...)"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full bg-[#fcfaf7] border border-stone-300 rounded-xl px-4 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-[#c2410c] focus:ring-1 focus:ring-[#c2410c]/30 transition-colors"
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition-colors cursor-pointer border border-stone-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-[#c2410c] hover:bg-[#a83408] text-white font-semibold text-xs sm:text-sm transition-all shadow-xs disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting
                    ? "Saving..."
                    : editingItem
                      ? "Update Item"
                      : "Publish Merch Item"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
