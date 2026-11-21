"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import {
  Image as ImageIcon,
  Send,
  X,
  Upload,
  Link as LinkIcon,
  CheckCircle2,
  Plus,
  Clock,
  Sparkles,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { API_BASE_URL } from "@/config/api";
import { StudentNav } from "@/components/layout/StudentNav";
import { uploadMediaFile } from "@/utils/uploadFile";

interface PortfolioItem {
  id?: string;
  title: string;
  technique: string;
  imageUrl: string;
  feedback?: string;
  createdAt?: string;
}

export default function StudentPortfolio() {
  const { user, token, logout } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mediaSource, setMediaSource] = useState<"url" | "upload">("upload");
  const [formData, setFormData] = useState({ title: "", technique: "", imageUrl: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [portfolios, setPortfolios] = useState<PortfolioItem[]>([]);
  const [loadingPortfolios, setLoadingPortfolios] = useState(false);

  const fetchPortfolios = async () => {
    if (!token) return;
    setLoadingPortfolios(true);
    try {
      const res = await fetch(`${API_BASE_URL}/dashboard/student`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data?.portfolios)) {
          setPortfolios(data.portfolios);
        }
      }
    } catch (err) {
      console.error("Error fetching student portfolios:", err);
    } finally {
      setLoadingPortfolios(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    if (token) {
      fetchPortfolios();
    }
  }, [token]);

  const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingMedia(true);
    setUploadError("");
    try {
      const { url } = await uploadMediaFile(file, token);
      setFormData((prev) => ({ ...prev, imageUrl: url }));
    } catch (err: any) {
      console.error("Portfolio upload error:", err);
      setUploadError(err?.message || "File upload failed. Please try again or paste a media link.");
    } finally {
      setUploadingMedia(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_BASE_URL}/portfolio`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setIsModalOpen(false);
        setFormData({ title: "", technique: "", imageUrl: "" });
        alert("Artwork submitted successfully! A mentor will review it shortly.");
        fetchPortfolios();
      } else {
        const err = await res.json();
        alert(err.message || "Submission failed");
      }
    } catch (error) {
      console.error(error);
      alert("Error submitting artwork");
    } finally {
      setIsSubmitting(false);
    }
  };

  const pillBtnClass = (isActive: boolean) =>
    `inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
      isActive
        ? "bg-[#fdeee2] text-[#942008] shadow-xs"
        : "text-stone-600 hover:bg-stone-100 hover:text-stone-900"
    }`;

  const isVideoMedia = (url: string) => {
    if (!url) return false;
    const lower = url.toLowerCase();
    return (
      lower.includes(".mp4") ||
      lower.includes(".webm") ||
      lower.includes("/video/upload/") ||
      lower.includes("/videos/")
    );
  };

  return (
    <div
      className="min-h-screen bg-[#faf8f5] text-stone-900 transition-colors lg:pl-64"
      style={{
        backgroundColor: "#faf8f5",
        backgroundImage: "radial-gradient(circle, #e2ded4 1.5px, transparent 1.5px)",
        backgroundSize: "24px 24px",
        backgroundAttachment: "fixed",
      }}
    >
      <StudentNav user={user} level={user?.membershipLevel || "General"} points={user?.points || 0} logout={logout} />

      <main className="w-full px-4 sm:px-6 md:px-8 lg:px-10 py-6 sm:py-8 max-w-7xl mx-auto">
        {/* Responsive Header */}
        <header className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-stone-500 mb-1 font-medium">
              <span>Student Hub</span>
              <span className="text-stone-300">/</span>
              <span className="text-stone-700 font-medium">My Portfolio</span>
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-stone-900 tracking-tight">
              My Portfolio
            </h1>
            <p className="text-stone-500 text-xs sm:text-sm mt-0.5">
              Upload and showcase your finished resin artwork for mentor feedback and skill ratings.
            </p>
          </div>

          <button
            onClick={() => {
              setFormData({ title: "", technique: "", imageUrl: "" });
              setUploadError("");
              setIsModalOpen(true);
            }}
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#942008] via-[#c4431d] to-[#ea580c] hover:opacity-95 text-white font-bold py-2.5 sm:py-3 px-5 sm:px-6 rounded-2xl shadow-md shadow-[#c4431d]/20 transition-all transform hover:scale-[1.02] cursor-pointer text-xs sm:text-sm shrink-0 self-start sm:self-auto"
          >
            <Plus size={16} />
            <span>Upload Artwork</span>
          </button>
        </header>

        {!mounted || !user ? (
          <div className="bg-white/95 border border-[#ecdccb] p-8 rounded-3xl min-h-[50vh] flex flex-col items-center justify-center text-center shadow-[0_10px_30px_-12px_rgba(90,55,20,0.08)] space-y-4">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full shimmer-box" />
            <div className="w-48 sm:w-64 h-8 rounded-lg shimmer-box" />
            <div className="w-72 sm:w-96 max-w-full h-12 rounded-xl shimmer-box" />
            <div className="w-40 sm:w-48 h-10 rounded-full shimmer-box" />
          </div>
        ) : portfolios.length === 0 ? (
          <div className="bg-white/95 backdrop-blur-xl border border-[#ecdccb] p-6 sm:p-10 md:p-14 rounded-3xl min-h-[55vh] flex flex-col items-center justify-center text-center shadow-[0_10px_30px_-12px_rgba(90,55,20,0.08)]">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-[#fde5d6] rounded-full flex items-center justify-center mb-5 sm:mb-6 shadow-md shadow-[#c4431d]/20 border border-[#f5ded0] text-[#942008]">
              <ImageIcon size={36} className="text-[#c4431d]" />
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-stone-900 mb-2">
              Showcase Your Journey
            </h2>
            <p className="text-stone-600 text-xs sm:text-sm md:text-base max-w-lg mb-6 sm:mb-8">
              Upload your finished resin pieces here. Our Diamond Mentors will review your work, provide actionable feedback, and score your Skill Mastery!
            </p>

            <button
              onClick={() => {
                setFormData({ title: "", technique: "", imageUrl: "" });
                setUploadError("");
                setIsModalOpen(true);
              }}
              className="bg-gradient-to-r from-[#942008] via-[#c4431d] to-[#ea580c] hover:opacity-95 text-white font-bold py-3 sm:py-3.5 px-6 sm:px-8 rounded-full shadow-md shadow-[#c4431d]/25 transition-all transform hover:scale-105 flex items-center gap-2 cursor-pointer text-xs sm:text-sm md:text-base"
            >
              <Send size={16} />
              <span>Submit New Artwork</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {portfolios.map((item, idx) => {
              const isVideo = isVideoMedia(item.imageUrl);
              return (
                <div
                  key={item.id || idx}
                  className="bg-white/95 border border-[#ecdccb] rounded-3xl overflow-hidden shadow-[0_10px_30px_-12px_rgba(90,55,20,0.08)] flex flex-col transition-all hover:shadow-[0_15px_35px_-10px_rgba(90,55,20,0.12)] group"
                >
                  <div className="relative aspect-video w-full bg-stone-100 overflow-hidden flex items-center justify-center">
                    {isVideo ? (
                      <video
                        src={item.imageUrl}
                        className="w-full h-full object-cover"
                        controls
                        playsInline
                      />
                    ) : item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-stone-400 p-4">
                        <ImageIcon size={32} />
                        <span className="text-xs mt-1">No preview available</span>
                      </div>
                    )}
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-bold text-[#942008] border border-stone-200/60 shadow-2xs">
                      {item.technique}
                    </div>
                  </div>

                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-stone-900 line-clamp-1 mb-1">
                        {item.title}
                      </h3>
                      {item.feedback ? (
                        <div className="mt-2 p-3 bg-emerald-50/80 border border-emerald-200/80 rounded-2xl">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 mb-1">
                            <Sparkles size={13} className="text-emerald-600" />
                            <span>Mentor Feedback</span>
                          </div>
                          <p className="text-xs text-emerald-900 line-clamp-3">
                            {item.feedback}
                          </p>
                        </div>
                      ) : (
                        <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold">
                          <Clock size={12} className="text-amber-600" />
                          <span>Under Mentor Review</span>
                        </div>
                      )}
                    </div>

                    <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-400">
                      <span>
                        {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "Submitted"}
                      </span>
                      {item.imageUrl && (
                        <a
                          href={item.imageUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#c4431d] hover:text-[#942008] font-semibold inline-flex items-center gap-1 hover:underline"
                        >
                          View <ExternalLink size={11} />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Upload Artwork Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-stone-900/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white border border-[#ecdccb] rounded-3xl p-5 sm:p-6 md:p-8 max-w-lg w-full relative shadow-[0_20px_50px_-15px_rgba(90,55,20,0.2)] my-auto max-h-[92vh] overflow-y-auto">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              aria-label="Close modal"
              className="absolute top-4 sm:top-5 right-4 sm:right-5 w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 hover:text-stone-900 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-3 mb-5 sm:mb-6 pr-8">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-[#fff2ea] border border-[#f5ded0] flex items-center justify-center text-[#e86034] shrink-0">
                <ImageIcon size={20} />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-stone-900 tracking-tight">
                  Upload Artwork
                </h2>
                <p className="text-xs text-stone-500">
                  Submit your masterpiece for mentor review
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-4.5">
              {/* Project Title */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Project Title
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-[#faf8f5] border border-[#ecdccb] rounded-xl px-3.5 sm:px-4 py-2.5 text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-[#c4431d] focus:bg-white focus:ring-2 focus:ring-[#c4431d]/10 transition-all"
                  placeholder="e.g. Ocean Wave Coaster"
                />
              </div>

              {/* Technique Used */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Technique Used
                </label>
                <select
                  required
                  value={formData.technique}
                  onChange={(e) => setFormData({ ...formData, technique: e.target.value })}
                  className="w-full bg-[#faf8f5] border border-[#ecdccb] rounded-xl px-3.5 sm:px-4 py-2.5 text-xs sm:text-sm text-stone-900 focus:outline-none focus:border-[#c4431d] focus:bg-white focus:ring-2 focus:ring-[#c4431d]/10 transition-all cursor-pointer"
                >
                  <option value="">Select a technique...</option>
                  <option value="Resin Basics">Resin Basics</option>
                  <option value="Marbling">Marbling</option>
                  <option value="Beach Theme">Beach Theme</option>
                  <option value="Geode Art">Geode Art</option>
                  <option value="3D Encapsulation">3D Encapsulation</option>
                </select>
              </div>

              {/* Artwork Media Card with Segmented URL / Upload Toggle */}
              <div className="rounded-2xl border border-stone-200/90 bg-[#faf9f7] p-3.5 sm:p-4 transition-all">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#fdeee2] text-[#c4431d] flex items-center justify-center shrink-0">
                      <span className="w-5 h-5 rounded-full border-[1.5px] border-[#c4431d] flex items-center justify-center">
                        <ImageIcon size={11} className="text-[#c4431d]" />
                      </span>
                    </span>
                    <span className="text-xs sm:text-sm md:text-base font-semibold text-stone-900">
                      Artwork Media
                    </span>
                  </div>

                  {/* Segmented Options: URL vs Upload */}
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <button
                      type="button"
                      onClick={() => setMediaSource("url")}
                      className={pillBtnClass(mediaSource === "url")}
                    >
                      <LinkIcon size={14} className="shrink-0" />
                      <span>URL</span>
                    </button>

                    <span className="h-4 sm:h-5 w-px bg-stone-200 shrink-0" aria-hidden="true" />

                    <button
                      type="button"
                      onClick={() => setMediaSource("upload")}
                      className={pillBtnClass(mediaSource === "upload")}
                    >
                      <Upload size={14} className="shrink-0" />
                      <span>Upload</span>
                    </button>
                  </div>
                </div>

                {/* Mutually Exclusive Input Body */}
                <div className="mt-3 pt-3 border-t border-stone-200/80 space-y-2.5">
                  {mediaSource === "url" ? (
                    <div>
                      <input
                        type="text"
                        autoFocus
                        value={formData.imageUrl}
                        onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                        className="w-full bg-white border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-[#c4431d] focus:ring-1 focus:ring-[#c4431d]/30 transition-colors font-mono"
                        placeholder="https://... or Google Drive / MP4 / Image URL"
                      />
                      <p className="text-xs text-stone-500 mt-1.5">
                        Paste image, video, Google Drive, or CDN media link.
                      </p>
                    </div>
                  ) : (
                    <div>
                      <input
                        type="file"
                        accept="image/*,video/*,.pdf,.doc,.docx"
                        onChange={handleMediaUpload}
                        disabled={uploadingMedia}
                        className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs sm:text-sm text-stone-700 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-[#fde5d6] file:text-[#942008] hover:file:bg-[#f8d4bf] cursor-pointer"
                      />
                      {uploadingMedia ? (
                        <p className="text-xs text-[#c4431d] mt-1.5 font-bold animate-pulse flex items-center gap-1.5">
                          <span className="inline-block animate-spin">⏳</span> Uploading media file... Please wait
                        </p>
                      ) : formData.imageUrl ? (
                        <p className="text-xs text-emerald-700 mt-1.5 font-semibold flex items-center gap-1.5">
                          <CheckCircle2 size={13} className="shrink-0 text-emerald-600" /> Media file uploaded &amp; attached!
                        </p>
                      ) : (
                        <p className="text-xs text-stone-500 mt-1.5">
                          Choose photo, video or document (JPEG, PNG, WEBP, MP4, PDF).
                        </p>
                      )}
                    </div>
                  )}

                  {/* Attached Media Confirmation Badge */}
                  {formData.imageUrl && (
                    <div className="p-2.5 sm:p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-2 text-xs text-emerald-800 font-bold">
                      <span className="flex items-center gap-1.5 truncate">
                        <CheckCircle2 size={14} className="shrink-0 text-emerald-600" />
                        <span className="truncate">
                          Attached: {formData.imageUrl.length > 36 ? formData.imageUrl.slice(0, 36) + "..." : formData.imageUrl}
                        </span>
                      </span>
                      <button
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, imageUrl: "" }))}
                        className="px-2.5 py-1 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-700 text-xs font-bold cursor-pointer shrink-0 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  )}

                  {uploadError && (
                    <p className="text-xs text-rose-600 mt-1 font-medium">{uploadError}</p>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || uploadingMedia || !formData.title || !formData.technique || !formData.imageUrl}
                className="w-full mt-4 sm:mt-5 bg-gradient-to-r from-[#942008] via-[#c4431d] to-[#ea580c] hover:opacity-95 text-white font-bold py-3 sm:py-3.5 px-4 rounded-xl transition-all shadow-md shadow-[#c4431d]/20 disabled:opacity-50 cursor-pointer text-xs sm:text-sm md:text-base flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : uploadingMedia ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Uploading Media...</span>
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    <span>Submit to Mentor</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
