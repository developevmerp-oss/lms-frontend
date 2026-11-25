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
import { UploadPortfolioModal } from "@/components/portfolio/UploadPortfolioModal";

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
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("upload") === "true" || params.get("action") === "upload") {
        setIsModalOpen(true);
      }
    }
  }, [token]);

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

      <main className="w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* Actions Bar - Left Aligned */}
        <div className="mb-6 flex flex-wrap items-center justify-start gap-4">
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#942008] via-[#c4431d] to-[#ea580c] hover:opacity-95 text-white font-bold py-2.5 sm:py-3 px-5 sm:px-6 rounded-2xl shadow-md shadow-[#c4431d]/20 transition-all transform hover:scale-[1.02] cursor-pointer text-xs sm:text-sm shrink-0 self-start sm:self-auto"
          >
            <Plus size={16} />
            <span>Upload Artwork</span>
          </button>
        </div>

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
              onClick={() => setIsModalOpen(true)}
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

      {/* Upload Artwork / Portfolio Modal */}
      <UploadPortfolioModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          fetchPortfolios();
          alert("Artwork submitted successfully! A mentor will review it shortly.");
        }}
        token={token}
      />
    </div>
  );
}
