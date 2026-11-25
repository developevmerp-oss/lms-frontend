"use client";

import React, { useState } from "react";
import {
  Image as ImageIcon,
  Upload,
  Link as LinkIcon,
  CheckCircle2,
  X,
  Loader2,
  Send,
} from "lucide-react";
import { API_BASE_URL } from "@/config/api";
import { uploadMediaFile, discardUploadedFile } from "@/utils/uploadFile";

interface UploadPortfolioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  token?: string | null;
}

export const UploadPortfolioModal: React.FC<UploadPortfolioModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  token,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    technique: "",
    imageUrl: "",
  });
  const [mediaSource, setMediaSource] = useState<"url" | "upload">("upload");
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleClose = () => {
    setFormData({ title: "", technique: "", imageUrl: "" });
    setUploadError("");
    setUploadingMedia(false);
    onClose();
  };

  const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingMedia(true);
    setUploadError("");

    try {
      const { url } = await uploadMediaFile(file, token);
      setFormData((prev) => ({ ...prev, imageUrl: url }));
    } catch (err: any) {
      console.error("Upload error:", err);
      setUploadError(err.message || "Failed to upload file");
    } finally {
      setUploadingMedia(false);
    }
  };

  const pillBtnClass = (active: boolean) =>
    `inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-bold transition-all cursor-pointer ${
      active
        ? "bg-[#942008] text-white shadow-2xs"
        : "text-stone-600 hover:text-stone-900 hover:bg-stone-200/60"
    }`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.technique || !formData.imageUrl) {
      setUploadError("Please provide a title, technique, and media file/URL.");
      return;
    }

    setIsSubmitting(true);
    setUploadError("");

    try {
      const res = await fetch(`${API_BASE_URL}/portfolios`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        handleClose();
        if (onSuccess) onSuccess();
      } else {
        const err = await res.json().catch(() => ({}));
        setUploadError(err.message || "Submission failed. Please try again.");
      }
    } catch (err: any) {
      console.error(err);
      setUploadError(err.message || "An error occurred during submission");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-stone-900/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white border border-[#ecdccb] rounded-3xl p-5 sm:p-6 md:p-8 max-w-lg w-full relative shadow-[0_20px_50px_-15px_rgba(90,55,20,0.2)] my-auto max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          type="button"
          onClick={handleClose}
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
                    onClick={() => {
                      discardUploadedFile(formData.imageUrl, token);
                      setFormData((prev) => ({ ...prev, imageUrl: "" }));
                    }}
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
  );
};

