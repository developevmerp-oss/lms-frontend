"use client";

import React, { useState, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { API_BASE_URL } from "@/config/api";
import {
  X,
  Camera,
  User,
  Mail,
  MapPin,
  Phone,
  FileText,
  Lock,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Upload,
  Image as ImageIcon
} from "lucide-react";

interface ProfileUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const AVATAR_PRESETS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=250&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=250&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=250&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=250&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=250&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=250&auto=format&fit=crop",
];

export const ProfileUpdateModal = ({ isOpen, onClose, onSuccess }: ProfileUpdateModalProps) => {
  const { user, token, updateUser } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    avatarUrl: user?.avatarUrl || "",
    city: user?.city || "",
    phone: user?.phone || "",
    bio: user?.bio || "",
    password: "",
  });

  const [previewAvatar, setPreviewAvatar] = useState<string>(user?.avatarUrl || "");
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Sync if user data changes
  React.useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        avatarUrl: user.avatarUrl || "",
        city: user.city || "",
        phone: user.phone || "",
        bio: user.bio || "",
        password: "",
      });
      setPreviewAvatar(user.avatarUrl || "");
    }
  }, [user, isOpen]);

  if (!isOpen) return null;

  // Handle local file selection -> convert to Base64 image
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit (max 4MB)
    if (file.size > 4 * 1024 * 1024) {
      setErrorMsg("Image must be smaller than 4MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setPreviewAvatar(base64);
      setFormData((prev) => ({ ...prev, avatarUrl: base64 }));
    };
    reader.readAsDataURL(file);
  };

  const handlePresetSelect = (url: string) => {
    setPreviewAvatar(url);
    setFormData((prev) => ({ ...prev, avatarUrl: url }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setErrorMsg("Name is required");
      return;
    }

    setIsSaving(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const bodyPayload: any = {
        name: formData.name.trim(),
        avatarUrl: formData.avatarUrl,
        city: formData.city.trim(),
        phone: formData.phone.trim(),
        bio: formData.bio.trim(),
      };

      if (formData.password && formData.password.trim().length >= 6) {
        bodyPayload.password = formData.password.trim();
      }

      const res = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bodyPayload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update profile");

      // Update AuthContext & localStorage reactively
      updateUser(data.user);

      setSuccessMsg("Profile updated successfully!");
      if (onSuccess) onSuccess();

      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err: any) {
      console.error("Profile update error:", err);
      setErrorMsg(err.message || "Error updating profile");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 md:p-8 shadow-2xl relative my-8 animate-scale-up">
        
        {/* Header */}
        <div className="flex justify-between items-center pb-4 mb-6 border-b border-slate-800">
          <div>
            <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
              <User className="text-orange-500" size={22} />
              Edit Profile & Photo
            </h2>
            <p className="text-slate-400 text-xs mt-0.5">
              Update your personal details, profile picture, and account settings
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Alerts */}
        {successMsg && (
          <div className="p-3.5 mb-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold rounded-2xl flex items-center gap-2">
            <CheckCircle2 size={16} /> {successMsg}
          </div>
        )}
        {errorMsg && (
          <div className="p-3.5 mb-4 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold rounded-2xl flex items-center gap-2">
            <AlertCircle size={16} /> {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Avatar Upload Section */}
          <div className="flex flex-col sm:flex-row items-center gap-6 p-4 bg-slate-950/70 border border-slate-800 rounded-2xl">
            
            {/* Avatar Preview + Upload Trigger */}
            <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-orange-500 shadow-xl shadow-orange-500/20 bg-slate-800 flex items-center justify-center text-3xl font-black text-white">
                {previewAvatar ? (
                  <img src={previewAvatar} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span>{user?.name?.charAt(0).toUpperCase() || "A"}</span>
                )}
              </div>
              
              {/* Camera Overlay */}
              <div className="absolute inset-0 rounded-full bg-slate-950/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity backdrop-blur-xs">
                <Camera size={20} className="text-white mb-0.5" />
                <span className="text-[10px] text-white font-bold">Change</span>
              </div>
            </div>

            {/* Hidden File Input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />

            {/* Buttons & Presets */}
            <div className="flex-1 space-y-2 text-center sm:text-left">
              <div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-slate-950 font-black text-xs rounded-xl transition-all shadow-md shadow-orange-500/20 inline-flex items-center gap-1.5"
                >
                  <Upload size={14} className="stroke-[2.5]" /> Upload Photo from Computer
                </button>
                <p className="text-[11px] text-slate-500 mt-1">PNG, JPG, WEBP up to 4MB</p>
              </div>

              {/* Quick Preset Avatars */}
              <div>
                <span className="text-[11px] text-slate-400 font-bold block mb-1.5">Or choose an artistic avatar:</span>
                <div className="flex gap-2 justify-center sm:justify-start flex-wrap">
                  {AVATAR_PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handlePresetSelect(preset)}
                      className={`w-8 h-8 rounded-full overflow-hidden border-2 transition-all hover:scale-110 ${
                        previewAvatar === preset ? "border-orange-500 scale-110 shadow-md" : "border-slate-700 opacity-70 hover:opacity-100"
                      }`}
                    >
                      <img src={preset} alt={`preset-${idx}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1.5">Full Name *</label>
              <div className="relative">
                <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Your Name"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3.5 py-2.5 text-sm text-white font-medium focus:outline-none focus:border-orange-500 transition-colors"
                  required
                />
              </div>
            </div>

            {/* Email (Read only) */}
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  value={user?.email || ""}
                  disabled
                  className="w-full bg-slate-950/50 border border-slate-800/80 rounded-xl pl-9 pr-3.5 py-2.5 text-sm text-slate-500 font-medium cursor-not-allowed"
                />
              </div>
            </div>

            {/* City */}
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1.5">City / Location</label>
              <div className="relative">
                <MapPin size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="e.g. Mumbai, Delhi"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3.5 py-2.5 text-sm text-white font-medium focus:outline-none focus:border-orange-500 transition-colors"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1.5">Phone Number</label>
              <div className="relative">
                <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="e.g. +91 9876543210"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3.5 py-2.5 text-sm text-white font-medium focus:outline-none focus:border-orange-500 transition-colors"
                />
              </div>
            </div>

          </div>

          {/* Bio */}
          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1.5">Bio / Artist Statement</label>
            <div className="relative">
              <FileText size={15} className="absolute left-3.5 top-3 text-slate-500" />
              <textarea
                rows={2}
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Share your resin art journey, business goals, or artistic specialty..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3.5 py-2.5 text-sm text-white font-medium focus:outline-none focus:border-orange-500 transition-colors resize-none"
              />
            </div>
          </div>

          {/* Change Password (Optional) */}
          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1.5">
              Change Password <span className="text-slate-500 font-normal">(Leave blank to keep current)</span>
            </label>
            <div className="relative">
              <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="New password (min 6 chars)"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3.5 py-2.5 text-sm text-white font-medium focus:outline-none focus:border-orange-500 transition-colors"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-xs font-bold text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-black text-xs rounded-xl transition-all shadow-lg shadow-orange-500/20 disabled:opacity-50 flex items-center gap-1.5"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
