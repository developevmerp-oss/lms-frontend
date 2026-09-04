"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { AdminNav } from "@/components/layout/AdminNav";
import {
  ShoppingBag,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  Sparkles,
  Upload,
  Image as ImageIcon,
  Tag,
  Gift,
  Star,
  Search,
  X,
  AlertTriangle,
  ExternalLink,
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

const CATEGORY_PRESETS = [
  "Physical Merch Kit",
  "Stationery & Journals",
  "Mentoring Call",
  "Discount Vouchers",
  "Live Event & Certificates",
  "Art Supplies",
];

export default function AdminRewardsManager() {
  const { token, user, logout } = useAuth();
  const [rewards, setRewards] = useState<RewardItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
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

  const filteredRewards = rewards.filter(
    (r) =>
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans">
      <AdminNav user={user} logout={logout} />

      <main className="max-w-[1400px] mx-auto p-4 md:p-8">
        {/* Header */}
        <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-6 md:p-8 rounded-3xl shadow-2xl">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
                Official Merch & XP Store
              </span>
              <span className="text-slate-400 text-xs font-bold">
                {rewards.length} Items Listed
              </span>
            </div>
            <h1 className="text-2xl md:text-4xl font-black text-white tracking-tight flex items-center gap-3">
              <ShoppingBag className="text-orange-500 shrink-0" size={32} /> Merch Store Manager
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Add physical merchandise bundles, journals, mentoring vouchers, and tickets that students redeem with their XP points. Any uploaded image or price update instantly reflects in the student panel!
            </p>
          </div>

          <button
            onClick={openCreateModal}
            className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-black px-6 py-3.5 rounded-2xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 shrink-0 cursor-pointer"
          >
            <Plus size={20} /> Add New Merch Item
          </button>
        </header>

        {/* Alerts */}
        {successMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-bold flex items-center gap-2">
            <CheckCircle2 size={18} /> {successMsg}
          </div>
        )}
        {errorMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-bold flex items-center gap-2">
            <AlertTriangle size={18} /> {errorMsg}
          </div>
        )}

        {/* Search & Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="md:col-span-2 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search merch title, description, or kit details..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-11 pr-4 py-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition-colors"
            />
          </div>

          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center font-black">
              <Gift size={20} />
            </div>
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Merch</div>
              <div className="text-lg font-black text-white">{rewards.length} Store Items</div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-black">
              <Star size={20} />
            </div>
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">XP Range</div>
              <div className="text-lg font-black text-white">
                {rewards.length > 0
                  ? `${Math.min(...rewards.map((r) => r.pointCost))} - ${Math.max(...rewards.map((r) => r.pointCost))} XP`
                  : "0 XP"}
              </div>
            </div>
          </div>
        </div>

        {/* Merch Items Grid */}
        {isLoading ? (
          <div className="text-center py-16 bg-slate-900/50 rounded-3xl border border-slate-800">
            <div className="inline-block animate-spin w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full mb-3"></div>
            <p className="text-slate-400 text-sm font-bold">Loading merchandise catalog...</p>
          </div>
        ) : filteredRewards.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/50 rounded-3xl border border-slate-800">
            <ShoppingBag size={48} className="mx-auto text-slate-600 mb-3" />
            <p className="text-slate-300 font-bold text-lg mb-1">No merchandise items found</p>
            <p className="text-slate-500 text-sm mb-4">Click "Add New Merch Item" to create your first merchandise offering.</p>
            <button
              onClick={openCreateModal}
              className="bg-orange-500 hover:bg-orange-600 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs"
            >
              Add First Item
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRewards.map((item) => (
              <div
                key={item.id}
                className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden hover:border-orange-500/40 transition-all duration-300 flex flex-col justify-between group shadow-xl"
              >
                <div>
                  {/* Image Container */}
                  <div className="relative h-48 w-full bg-slate-950 overflow-hidden">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-700 bg-slate-900">
                        <ImageIcon size={48} />
                      </div>
                    )}
                    <span className="absolute top-3 right-3 bg-amber-500/90 text-slate-950 font-black text-xs px-3 py-1 rounded-full shadow-lg backdrop-blur-md flex items-center gap-1">
                      <Star size={12} fill="currentColor" /> {item.pointCost} XP
                    </span>
                  </div>

                  {/* Body Content */}
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-white mb-2 leading-snug group-hover:text-orange-400 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed line-clamp-3 mb-4">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="px-6 pb-6 pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  <div className="text-[11px] font-bold text-slate-500">
                    ID: {item.id.slice(0, 8)}...
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditModal(item)}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-orange-500/20 text-slate-300 hover:text-orange-400 border border-slate-700 transition-all"
                      title="Edit Item"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteItem(item.id, item.title)}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-red-500/20 text-slate-300 hover:text-red-400 border border-slate-700 transition-all"
                      title="Delete Item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modal: Create / Edit Merch Item */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition-colors"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400 font-black">
                <ShoppingBag size={24} />
              </div>
              <div>
                <h2 className="text-xl font-black text-white">
                  {editingItem ? "Edit Merch Item" : "Add New Merch Item"}
                </h2>
                <p className="text-xs text-slate-400">
                  {editingItem
                    ? "Update item details, XP cost, and featured image"
                    : "Create a new physical merchandise product or reward"}
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveItem} className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Item Title / Merch Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Custom Hardcover Artistry Journal with Pen"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              {/* Point Cost */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
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
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-4 pr-12 py-3 text-sm text-white font-bold focus:outline-none focus:border-orange-500"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-black text-amber-400">
                    XP
                  </span>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Full Inclusions & Description *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="List all contents, specifications, and inclusions (e.g. 9-Piece Merch Bundle: Badge, Magnet, Goal Card, Lanyard, Notebook, Pen, Voucher...)"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500 leading-relaxed"
                />
              </div>

              {/* Featured Image & File Upload */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Featured Merch Image (Upload File or Enter Image URL)
                </label>

                {/* Live Preview Box */}
                {formData.imageUrl && (
                  <div className="mb-3 relative rounded-2xl overflow-hidden border border-slate-800 h-40 bg-slate-950 flex items-center justify-center">
                    <img
                      src={formData.imageUrl}
                      alt="Merch Preview"
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-2 right-2 bg-slate-950/80 text-xs font-bold px-2.5 py-1 rounded-lg text-emerald-400 border border-emerald-500/30">
                      Live Preview
                    </span>
                  </div>
                )}

                {/* Upload File Input */}
                <div className="flex flex-col sm:flex-row gap-2 mb-2">
                  <label className="flex-1 cursor-pointer bg-slate-950 hover:bg-slate-800 border border-dashed border-orange-500/40 hover:border-orange-500 rounded-xl p-3 text-center transition-all flex items-center justify-center gap-2 text-xs font-bold text-orange-400">
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
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-300 focus:outline-none focus:border-orange-500"
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-black text-xs transition-all shadow-lg shadow-orange-500/20 disabled:opacity-50"
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
