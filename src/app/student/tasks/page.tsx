"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { StudentNav } from "@/components/layout/StudentNav";
import { ClipboardList, CheckCircle2, Clock, Upload, X, Loader2, Link as LinkIcon, Image as ImageIcon, Send } from "lucide-react";
import { motion } from "framer-motion";
import { ListSkeleton } from "@/components/ui/SkeletonLoader";
import { API_BASE_URL } from "@/config/api";
import { getLevelCode } from "@/components/layout/StudentNav";
import { uploadMediaFile, discardUploadedFile } from "@/utils/uploadFile";

export default function StudentAssignments() {
  const { user, token, logout } = useAuth();
  const [assignments, setAssignments] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({ points: 0, notifications: [] });
  const [showSubmitModal, setShowSubmitModal] = useState<string | null>(null);
  const [fileUrl, setFileUrl] = useState("");
  const [mediaSource, setMediaSource] = useState<'url' | 'upload'>('url');
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      // Nav Stats
      const statsRes = await fetch(`${API_BASE_URL}/dashboard/student`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const statsData = await statsRes.json();
      if (statsData && !statsData.message) {
        setStats({
          points: statsData.points ?? 0,
          notifications: statsData.notifications ?? [],
          membershipLevel: statsData.membershipLevel,
          rank: statsData.rank,
          currentTier: statsData.currentTier,
          ...statsData,
        });
      }

      // Assignments
      const assnRes = await fetch(`${API_BASE_URL}/assignments/student`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const assnData = await assnRes.json();
      if (Array.isArray(assnData)) {
        setAssignments(assnData);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  const handleCloseModal = () => {
    setShowSubmitModal(null);
    setFileUrl("");
    setUploadError("");
    setUploadingMedia(false);
  };

  const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingMedia(true);
    setUploadError("");

    try {
      const { url } = await uploadMediaFile(file, token);
      setFileUrl(url);
    } catch (err: any) {
      console.error("Upload error:", err);
      setUploadError(err.message || "Failed to upload file");
    } finally {
      setUploadingMedia(false);
    }
  };

  const pillBtnClass = (active: boolean) =>
    `inline-flex items-center gap-1 sm:gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
      active
        ? "bg-[#942008] text-white shadow-2xs"
        : "text-stone-600 hover:text-stone-900 hover:bg-stone-200/60"
    }`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!showSubmitModal || !fileUrl) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_BASE_URL}/assignments/${showSubmitModal}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ fileUrl })
      });
      
      if (res.ok) {
        handleCloseModal();
        await fetchData(); // Refresh to show the submission
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const candidateLevels = [
    stats?.membershipLevel,
    user?.membershipLevel,
    stats?.currentTier?.code,
    stats?.currentTier?.name,
    user?.level,
    user?.rank,
    stats?.rank,
  ].filter(Boolean);

  let effectiveLevel = candidateLevels[0] || "";
  for (const cand of candidateLevels) {
    if (getLevelCode(cand, stats.points || 0) !== "GENERAL") {
      effectiveLevel = cand;
      break;
    }
  }

  const studentLevelCode = getLevelCode(effectiveLevel, stats.points || 0);
  const isGeneral = studentLevelCode === "GENERAL";

  const getLevelName = () => {
    if (isGeneral) return "General Member";
    if (effectiveLevel) return effectiveLevel;
    if (stats?.membershipLevel) return stats.membershipLevel;
    if (user?.membershipLevel) return user.membershipLevel;
    if (stats?.rank) return stats.rank;
    if (stats?.currentTier?.name) {
      return `${stats.currentTier.name} (${stats.currentTier.code})`;
    }
    return "Fast Track (L0)";
  };

  return (
    <div
      className="min-h-screen bg-[#faf8f5] text-stone-900 flex flex-col transition-colors lg:pl-64"
      style={{
        backgroundColor: "#faf8f5",
        backgroundImage: "radial-gradient(circle, #e2ded4 1.5px, transparent 1.5px)",
        backgroundSize: "24px 24px",
        backgroundAttachment: "fixed",
      }}
    >
      <StudentNav 
        user={user || stats} 
        level={getLevelName()} 
        points={stats.points} 
        logout={logout} 
        notifications={stats.notifications}
      />

      <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/*
        <header className="mb-6">
          <div className="flex items-center gap-1.5 text-xs text-stone-500 mb-1 font-medium">
            <span>Learning &amp; Growth</span>
            <span className="text-stone-300">/</span>
            <span className="text-stone-700 font-medium">Daily Tasks &amp; Missions</span>
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-stone-900 tracking-tight">
            Daily Tasks &amp; Missions
          </h1>
          <p className="text-stone-500 text-xs sm:text-sm mt-0.5">
            Complete assignments to earn XP points and maintain your streak!
          </p>
        </header>
        */}

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="bg-white/95 border border-[#ecdccb] rounded-3xl p-6 shadow-sm flex flex-col space-y-4"
              >
                <div className="flex justify-between items-start">
                  <div className="w-48 h-6 rounded-lg shimmer-box" />
                  <div className="w-16 h-6 rounded-full shimmer-box" />
                </div>
                <div className="space-y-2">
                  <div className="w-full h-3.5 rounded shimmer-box" />
                  <div className="w-4/5 h-3.5 rounded shimmer-box" />
                </div>
                <div className="flex justify-between items-center pt-4">
                  <div className="w-28 h-4 rounded shimmer-box" />
                  <div className="w-32 h-10 rounded-xl shimmer-box" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {assignments.length === 0 && (
               <div className="col-span-full py-20 flex flex-col items-center justify-center text-center bg-white/95 border border-[#ecdccb] shadow-[0_10px_30px_-12px_rgba(90,55,20,0.08)] rounded-3xl">
                 <CheckCircle2 size={64} className="text-green-500/50 mb-4" />
                 <h3 className="text-xl font-bold text-stone-900 mb-2">You're All Caught Up!</h3>
                 <p className="text-stone-500">No active assignments available right now. Take a break or explore new courses.</p>
               </div>
            )}

          {assignments.map((assn, idx) => {
            const mySubmission = assn.submissions?.find((sub: any) => sub.studentId === user?.id);

            return (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                key={assn.id} 
                className="bg-white/95 border border-[#ecdccb] shadow-[0_10px_30px_-12px_rgba(90,55,20,0.08)] rounded-3xl p-6 shadow-xl hover:border-stone-300 transition-colors flex flex-col"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-stone-900 pr-4">{assn.title}</h3>
                  <div className="shrink-0 bg-[#fde5d6] border border-[#f5ded0] text-[#942008] px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap">
                    +{assn.points} XP
                  </div>
                </div>
                
                <p className="text-stone-500 text-sm mb-6 flex-1">{assn.description}</p>
                
                <div className="flex justify-between items-center text-xs font-semibold text-stone-400 mb-6">
                  <span className="flex items-center gap-1.5"><Clock size={14} /> Due {new Date(assn.dueDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</span>
                </div>

                <div className="pt-6 border-t border-stone-200 mt-auto">
                  {mySubmission ? (
                    <div className={`w-full py-3 rounded-xl font-bold text-center flex items-center justify-center gap-2 ${
                      mySubmission.status === 'approved' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                      mySubmission.status === 'rejected' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                      'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                    }`}>
                      {mySubmission.status === 'approved' ? (
                        <><CheckCircle2 size={18} /> Approved (+{mySubmission.pointsAwarded} XP)</>
                      ) : mySubmission.status === 'rejected' ? (
                        <><X size={18} /> Needs Revision</>
                      ) : (
                        <><Clock size={18} /> Pending Review</>
                      )}
                    </div>
                  ) : (
                    <button 
                      onClick={() => setShowSubmitModal(assn.id)}
                      className="w-full py-3 bg-gradient-to-r from-[#942008] via-[#c4431d] to-[#ea580c] hover:opacity-95 text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2 shadow-md shadow-[#c4431d]/20 cursor-pointer"
                    >
                      <Upload size={18} /> Submit Work
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
        )}
      </main>

      {/* Submit Assignment Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 bg-[#faf8f5]/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white/95 border border-[#ecdccb] shadow-[0_10px_30px_-12px_rgba(90,55,20,0.08)] rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl"
          >
            <div className="flex justify-between items-center mb-5 pb-3 border-b border-stone-100">
              <h2 className="text-xl sm:text-2xl font-bold text-stone-900 flex items-center gap-2.5">
                <Upload className="text-[#c4431d]" size={22} /> Submit Assignment
              </h2>
              <button 
                type="button"
                onClick={handleCloseModal} 
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 hover:text-stone-900 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-5">
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
                        type="url" 
                        value={fileUrl} 
                        onChange={e => setFileUrl(e.target.value)} 
                        placeholder="e.g. Google Drive link, Instagram post, etc."
                        className="w-full bg-white border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-[#c4431d] focus:ring-1 focus:ring-[#c4431d]/30 transition-colors font-mono" 
                      />
                      <p className="text-xs text-stone-500 mt-1.5">
                        Make sure your link is publicly accessible so mentors can review it.
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
                      ) : fileUrl ? (
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
                  {fileUrl && (
                    <div className="p-2.5 sm:p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-2 text-xs text-emerald-800 font-bold">
                      <span className="flex items-center gap-1.5 truncate">
                        <CheckCircle2 size={14} className="shrink-0 text-emerald-600" />
                        <span className="truncate">
                          Attached: {fileUrl.length > 36 ? fileUrl.slice(0, 36) + "..." : fileUrl}
                        </span>
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          discardUploadedFile(fileUrl, token);
                          setFileUrl("");
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
              
              <div className="flex gap-4 pt-1">
                <button 
                  type="button" 
                  onClick={handleCloseModal} 
                  className="flex-1 py-3 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl font-bold transition-colors cursor-pointer text-xs sm:text-sm"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting || uploadingMedia || !fileUrl}
                  className="flex-1 py-3 bg-gradient-to-r from-[#942008] via-[#c4431d] to-[#ea580c] hover:opacity-95 text-white disabled:opacity-50 rounded-xl font-bold transition-all shadow-md shadow-[#c4431d]/20 flex items-center justify-center gap-2 cursor-pointer text-xs sm:text-sm"
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
                      <Send size={15} />
                      <span>Submit to Mentor</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
