"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Sparkles, Plus, CheckCircle2, ChevronRight, X, DollarSign, Award, Flame, MessageCircle, Image, Send, Heart, Gem, MoreHorizontal } from 'lucide-react';
import { API_BASE_URL } from '@/config/api';
import { useAuth } from '@/context/AuthContext';

interface CommentItem {
  author: string;
  text: string;
}

interface WinItem {
  id: string;
  studentName: string;
  studentLevel: string;
  title: string;
  amount?: string;
  image?: string;
  likes?: number;
  comments?: CommentItem[];
  badge?: string;
  timeAgo: string;
}

export const WinWall = ({
  communityWins = [],
  onWinAdded,
  membershipLevel,
}: {
  communityWins?: any[];
  onWinAdded?: () => void;
  membershipLevel?: string;
}) => {
  const { user } = useAuth();
  const [wins, setWins] = useState<any[]>(communityWins);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedCommentsId, setExpandedCommentsId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState<{ [winId: string]: string }>({});
  const [commenting, setCommenting] = useState(false);
  const [winForm, setWinForm] = useState({
    title: '',
    salesAmount: '',
    technique: '',
    notes: '',
    imageUrl: '',
  });
  const [uploadingFile, setUploadingFile] = useState(false);
  const [posting, setPosting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const effectiveLevel = (membershipLevel || user?.membershipLevel || user?.rank || user?.level || 'GENERAL').toUpperCase();
  const isGeneral = effectiveLevel === 'GENERAL' || effectiveLevel.includes('GENERAL');
  const isL0 = effectiveLevel === 'L0' || effectiveLevel.includes('FAST START') || effectiveLevel.includes('FAST TRACK') || effectiveLevel.includes('BRONZE');
  const isL3Diamond = effectiveLevel === 'L3' || effectiveLevel.includes('DIAMOND') || effectiveLevel.includes('RENAISSANCE') || (user?.rank || '').toUpperCase().includes('DIAMOND');
  // General & L0 Fast Track members have VIEW-ONLY access to the feed. Only L1, L2, L3+ can post and comment.
  const canPost = !isGeneral && !isL0;
  // L1, L2, and L3 members all earn +100 XP when sharing wins
  const canEarnWinXp = canPost;

  const getMediaUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) return url;
    const backendBase = API_BASE_URL.replace(/\/api\/?$/, '');
    return `${backendBase}${url.startsWith('/') ? '' : '/'}${url}`;
  };

  // Keep synced with parent props
  React.useEffect(() => {
    if (communityWins && communityWins.length > 0) {
      setWins(communityWins);
    }
  }, [communityWins]);

  // Reuses the same upload pattern as admin/courses — uploads to /upload/video,
  // gets back a server URL, stores it in imageUrl. NO readAsDataURL = no browser freeze.
  const handleFileBrowserSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingFile(true);
    try {
      const formData = new FormData();
      formData.append('video', file); // field name 'video' matches the upload route

      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/upload/video`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.url) {
        // Store the server-side URL — works for images, videos, and docs
        setWinForm((prev) => ({ ...prev, imageUrl: data.url }));
      } else {
        alert('File upload failed. Please use an external URL instead.');
      }
    } catch (err) {
      console.error('Upload error:', err);
      alert('Upload failed. Please check your connection or paste an external URL.');
    } finally {
      setUploadingFile(false);
    }
  };

  const handlePostWin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canPost) {
      alert("General and Level 0 members have view-only access to the feed. Upgrade to Level 1 or above to share wins.");
      return;
    }
    if (!winForm.title) return;

    setPosting(true);
    setSuccessMsg('');

    const token = localStorage.getItem('token');
    try {
      // Always JSON — file was already uploaded in handleFileBrowserSelect,
      // so imageUrl is either a server path (/uploads/videos/...) or an external URL
      const res = await fetch(`${API_BASE_URL}/dashboard/community-wins`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: winForm.title,
          achievement: winForm.notes || winForm.title,
          salesAmount: winForm.salesAmount,
          technique: winForm.technique,
          imageUrl: winForm.imageUrl,
        }),
      });

      const data = await res.json();
      if (data.success && data.win) {
        setWins([data.win, ...wins]);
        setSuccessMsg(data.message || (canEarnWinXp ? '🎉 Win published! +100 XP awarded!' : '🎉 Win published to Community Feed!'));
        setWinForm({ title: '', salesAmount: '', technique: '', notes: '', imageUrl: '' });
        setTimeout(() => {
          setIsModalOpen(false);
          setSuccessMsg('');
          if (onWinAdded) onWinAdded();
        }, 1800);
      } else {
        setSuccessMsg(data.message || '❌ Failed to post win. Please try again.');
      }
    } catch (err) {
      console.error('Post win error:', err);
      setSuccessMsg('❌ Network error. Please check your connection and try again.');
    }
    setPosting(false);
  };

  const handleAddComment = async (winId: string) => {
    const text = commentText[winId];
    if (!text || !text.trim() || commenting) return;
    if (!canPost) {
      alert("General and Level 0 members have view-only access to the feed. Upgrade to Level 1 or above to comment.");
      return;
    }

    setCommenting(true);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_BASE_URL}/dashboard/community-wins/${winId}/comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text: text.trim() }),
      });

      if (res.ok) {
        const updatedWin = await res.json();
        setWins(wins.map((w) => (w.id === winId ? updatedWin : w)));
        setCommentText({ ...commentText, [winId]: '' });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setCommenting(false);
    }
  };

  const handleLike = async (winId: string) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_BASE_URL}/dashboard/community-wins/${winId}/like`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const updatedWin = await res.json();
        setWins(wins.map((w) => (w.id === winId ? updatedWin : w)));
      }
    } catch (_) {}
  };

  const fallbackWins: WinItem[] = [
    {
      id: 'demo-vrajangna',
      studentName: 'Patel Vrajanga (Admin)',
      studentLevel: 'Admin',
      title: 'Completed my first resin tray with floral design! ✨',
      amount: undefined,
      image: '/images/student-art/real-art-14.jpg',
      likes: 0,
      comments: [],
      badge: '🏆 Win',
      timeAgo: 'Just now',
    },
  ];

  const parsedWins: WinItem[] = wins.map((w, idx) => ({
    id: w.id || String(idx),
    studentName: w.studentName || w.userName || 'Fellow Artist',
    studentLevel: w.level || 'L1 Member',
    title: w.achievement || w.title || 'Achieved a new breakthrough!',
    amount: w.salesAmount ? `₹${Number(w.salesAmount).toLocaleString('en-IN')}` : undefined,
    image: w.image || w.imageUrl,
    likes: w.likes || 0,
    comments: w.comments || [],
    badge: '🏆 Win',
    timeAgo: w.timeAgo || 'Recently',
  }));

  const displayWins: WinItem[] = parsedWins.length > 0 ? parsedWins : fallbackWins;

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : 'P';

  return (
    <>
      {/* 1. Dedicated Composer Card (Matches Reference Image 2) */}
      <div className="bg-white rounded-3xl border border-[#ecdccb]/80 p-5 sm:p-6 shadow-[0_4px_20px_-4px_rgba(90,55,20,0.05)] mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#fde5d6] text-[#c4431d] font-bold text-sm flex items-center justify-center shrink-0">
            {userInitial}
          </div>

          <div
            onClick={() => {
              if (!canPost) {
                alert("Only Level 3 (Diamond Club) members can post.");
                return;
              }
              setIsModalOpen(true);
            }}
            className="flex-1 bg-[#faf8f5] hover:bg-[#f6f2ed] border border-stone-200/80 rounded-full px-5 py-2.5 sm:py-3 text-stone-400 text-xs sm:text-sm cursor-pointer transition-colors truncate"
          >
            <span>Share your win, artwork, or learning...</span>
          </div>

          <button
            type="button"
            onClick={() => {
              if (!canPost) {
                alert("Only Level 3 (Diamond Club) members can post.");
                return;
              }
              setIsModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-gradient-to-r from-[#942008] via-[#c4431d] to-[#ea580c] hover:opacity-95 text-white font-bold text-xs sm:text-sm shadow-md shadow-[#c4431d]/20 transition-all hover:scale-[1.02] cursor-pointer whitespace-nowrap shrink-0"
          >
            <span>+ Post a Win (+100 XP)</span>
          </button>
        </div>

        <div className="mt-4 pt-3 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-stone-500">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-amber-500">💎</span>
            <span>Only L3 Diamond earns XP</span>
            <span className="text-stone-300 hidden sm:inline">·</span>
            <span>Only Level 3 (Diamond Club) members can post.</span>
          </div>
          <span className="flex items-center gap-1 text-[#942008] font-semibold shrink-0">
            <Flame size={13} /> Active Sisterhood
          </span>
        </div>
      </div>

      {/* 2. Feed Post Cards List (Matches Reference Image 2) */}
      <div className="space-y-6">
        {displayWins.map((win) => {
          const isExpanded = expandedCommentsId === win.id;
          const authorInitial = (win.studentName || 'P').charAt(0).toUpperCase();

          return (
            <div
              key={win.id}
              className="bg-white rounded-3xl border border-[#ecdccb]/80 p-5 sm:p-6 shadow-[0_4px_20px_-4px_rgba(90,55,20,0.05)] space-y-4"
            >
              {/* Post Header: Avatar + Author Name + Time + Three Dots */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-[#fde5d6] text-[#c4431d] font-bold text-sm flex items-center justify-center shrink-0">
                    {authorInitial}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-bold text-stone-900 text-sm sm:text-base">
                        {win.studentName}
                      </span>
                      <span className="text-xs text-stone-400 font-normal">
                        · {win.timeAgo}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  className="p-1 text-stone-400 hover:text-stone-600 rounded-lg hover:bg-stone-50 transition-colors cursor-pointer"
                >
                  <MoreHorizontal size={18} />
                </button>
              </div>

              {/* Post Text */}
              <p className="text-stone-900 text-sm sm:text-base leading-relaxed">
                {(() => {
                  const text = win.title || '';
                  const urlRegex = /(https?:\/\/[^\s]+)/g;
                  const parts = text.split(urlRegex);

                  return parts.map((part, index) => {
                    if (part.match(urlRegex)) {
                      return (
                        <a
                          key={index}
                          href={part}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[#942008] font-bold underline hover:text-[#c4431d] break-all inline-flex items-center gap-0.5 ml-1"
                          onClick={(e) => e.stopPropagation()}
                        >
                          🔗 {part} ↗
                        </a>
                      );
                    }
                    return part;
                  });
                })()}
              </p>

              {/* Sales Amount Badge (if present) */}
              {win.amount && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold font-mono">
                  <span>💰 Sale Logged:</span>
                  <span>{win.amount}</span>
                </div>
              )}

              {/* Media Attachment (Video, Doc, Image, YouTube) */}
              {(() => {
                const mediaUrl = win.image;
                if (!mediaUrl) return null;

                const ytEmbed = mediaUrl.includes('youtube.com') || mediaUrl.includes('youtu.be') ? (
                  (() => {
                    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
                    const match = mediaUrl.match(regExp);
                    return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : null;
                  })()
                ) : null;

                if (ytEmbed) {
                  return (
                    <div className="rounded-2xl overflow-hidden border border-stone-200 bg-black aspect-video shadow-xs mt-3">
                      <iframe
                        src={ytEmbed}
                        title="YouTube Video"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full border-0"
                      />
                    </div>
                  );
                }

                const isVideo = mediaUrl.startsWith('data:video') || /\.(mp4|webm|mov|m4v|avi)$/i.test(mediaUrl) || mediaUrl.includes('/uploads/videos/');
                const isDoc = mediaUrl.startsWith('data:application') || /\.(pdf|doc|docx|zip|rar)$/i.test(mediaUrl);
                const isWebUrl = mediaUrl.startsWith('http://') || mediaUrl.startsWith('https://');
                const isDirectImage = mediaUrl.startsWith('data:image') || /\.(jpeg|jpg|gif|png|webp|svg)$/i.test(mediaUrl) || mediaUrl.includes('unsplash.com') || mediaUrl.includes('cloudinary');

                if (isVideo) {
                  return (
                    <div className="rounded-2xl overflow-hidden border border-stone-200 bg-black mt-3 shadow-xs">
                      <video src={getMediaUrl(mediaUrl)} controls className="w-full max-h-96 object-contain bg-black" />
                    </div>
                  );
                }

                if (isDoc) {
                  return (
                    <div className="mt-3 p-3.5 rounded-2xl bg-[#faf8f5] border border-stone-200 flex items-center justify-between gap-3 shadow-xs">
                      <div className="flex items-center gap-2.5 overflow-hidden">
                        <div className="w-9 h-9 rounded-xl bg-[#fde5d6] border border-[#f5ded0] flex items-center justify-center text-[#942008] font-bold shrink-0 text-sm">
                          📄
                        </div>
                        <div className="truncate">
                          <p className="text-xs font-bold text-stone-900 truncate">Attached Document / File</p>
                          <p className="text-[10px] text-stone-500">Click to download or view</p>
                        </div>
                      </div>
                      <a
                        href={getMediaUrl(mediaUrl)}
                        download="community-file"
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-xl bg-[#fde5d6] hover:bg-[#fde5d6]/80 border border-[#f5ded0] text-[#942008] text-xs font-bold transition-all shrink-0"
                      >
                        Download File
                      </a>
                    </div>
                  );
                }

                if (isWebUrl && !isDirectImage) {
                  return (
                    <div className="mt-3 p-3.5 rounded-2xl bg-white border border-stone-200 flex items-center justify-between gap-3 shadow-xs">
                      <div className="flex items-center gap-2.5 overflow-hidden min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold shrink-0 text-sm">
                          🔗
                        </div>
                        <div className="truncate min-w-0">
                          <p className="text-xs font-bold text-stone-900 truncate">External Link Attachment</p>
                          <p className="text-[10px] text-stone-500 truncate">{mediaUrl}</p>
                        </div>
                      </div>
                      <a
                        href={mediaUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-700 text-xs font-bold transition-all shrink-0 flex items-center gap-1"
                      >
                        Open Link ↗
                      </a>
                    </div>
                  );
                }

                return (
                  <div className="rounded-2xl overflow-hidden border border-stone-100 bg-[#faf8f5] mt-3 shadow-xs">
                    <img
                      src={getMediaUrl(mediaUrl)}
                      alt={win.title || "Post artwork"}
                      className="w-full max-h-[500px] object-cover hover:scale-[1.01] transition-transform duration-300"
                    />
                  </div>
                );
              })()}

              {/* Post Footer Action Bar */}
              <div className="flex items-center justify-between pt-3 border-t border-stone-100 text-xs text-stone-500">
                <div className="flex items-center gap-6">
                  {/* Likes Button */}
                  <button
                    type="button"
                    onClick={() => handleLike(win.id)}
                    className="flex items-center gap-1.5 hover:text-rose-500 transition-colors cursor-pointer"
                  >
                    <Heart
                      size={16}
                      className={win.likes ? 'text-rose-500 fill-rose-500' : 'text-stone-400'}
                    />
                    <span className="font-medium">{win.likes || 0} Likes</span>
                  </button>

                  {/* Comments Toggle */}
                  <button
                    type="button"
                    onClick={() => setExpandedCommentsId(isExpanded ? null : win.id)}
                    className="flex items-center gap-1.5 hover:text-[#c4431d] transition-colors cursor-pointer"
                  >
                    <MessageCircle size={16} className="text-stone-400" />
                    <span className="font-medium">{win.comments?.length || 0} Comments</span>
                  </button>
                </div>

                <button
                  type="button"
                  className="text-stone-400 hover:text-stone-600 cursor-pointer"
                >
                  <MoreHorizontal size={18} />
                </button>
              </div>

              {/* Expandable Comments Drawer */}
              {isExpanded && (
                <div className="pt-3 space-y-2.5 border-t border-stone-100">
                  {win.comments && win.comments.length > 0 ? (
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                      {win.comments.map((c, i) => (
                        <div key={i} className="bg-[#faf8f5] p-2.5 rounded-xl text-xs">
                          <span className="font-bold text-[#942008] mr-2">{c.author}:</span>
                          <span className="text-stone-700">{c.text}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-stone-400 py-1">No comments yet. Say congratulations!</p>
                  )}

                  {canPost ? (
                    <div className="flex gap-2 pt-1">
                      <input
                        type="text"
                        placeholder="Write a supportive comment..."
                        value={commentText[win.id] || ''}
                        onChange={(e) => setCommentText({ ...commentText, [win.id]: e.target.value })}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddComment(win.id)}
                        className="flex-1 bg-[#faf8f5] border border-stone-200 rounded-xl px-3.5 py-2 text-xs text-stone-900 focus:outline-none focus:border-[#c4431d]"
                      />
                      <button
                        type="button"
                        onClick={() => handleAddComment(win.id)}
                        disabled={commenting}
                        className="px-3.5 py-2 bg-gradient-to-r from-[#942008] via-[#c4431d] to-[#ea580c] text-white rounded-xl font-bold text-xs hover:opacity-95 transition-all cursor-pointer shrink-0 disabled:opacity-50"
                      >
                        <Send size={13} />
                      </button>
                    </div>
                  ) : (
                    <p className="text-xs text-stone-400 italic py-1">
                      🔒 Upgrade to Level 1 or above to participate in comments &amp; discussions.
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Post Win Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#faf8f5]/80 backdrop-blur-md">
          <div className="relative w-full max-w-md rounded-3xl border border-[#ecdccb] bg-white p-6 sm:p-7 shadow-2xl text-stone-900">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-4 top-4 text-stone-500 hover:text-stone-900"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-[#fde5d6] border border-[#f5ded0] flex items-center justify-center text-[#942008]">
                <Trophy size={18} />
              </div>
              <div>
                <h3 className="text-lg font-black text-stone-900">Post Your Win on the Feed</h3>
                <p className="text-xs text-stone-500">
                  {canEarnWinXp
                    ? '🌟 Share your milestone and earn +100 XP!'
                    : 'Share your milestone with the sisterhood!'}
                </p>
              </div>
            </div>

            {successMsg ? (
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-bold text-center">
                {successMsg}
              </div>
            ) : (
              <form onSubmit={handlePostWin} className="space-y-3.5">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-600">Win / Milestone Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sold my first 3D Geode Wall Clock!"
                    value={winForm.title}
                    onChange={(e) => setWinForm({ ...winForm, title: e.target.value })}
                    className="flex h-10 w-full rounded-xl border border-stone-200 bg-[#faf8f5] px-3.5 text-xs text-stone-900 placeholder-slate-500 focus:border-[#c4431d] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-600">Sales Amount (₹ optional)</label>
                    <input
                      type="number"
                      placeholder="e.g. 4500"
                      value={winForm.salesAmount}
                      onChange={(e) => setWinForm({ ...winForm, salesAmount: e.target.value })}
                      className="flex h-10 w-full rounded-xl border border-stone-200 bg-[#faf8f5] px-3.5 text-xs text-stone-900 placeholder-slate-500 focus:border-[#c4431d] focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-600">Technique Used</label>
                    <input
                      type="text"
                      placeholder="e.g. Ocean Wave Lacing"
                      value={winForm.technique}
                      onChange={(e) => setWinForm({ ...winForm, technique: e.target.value })}
                      className="flex h-10 w-full rounded-xl border border-stone-200 bg-[#faf8f5] px-3.5 text-xs text-stone-900 placeholder-slate-500 focus:border-[#c4431d] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Browser File Upload & URL input */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-600 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Image size={13} className="text-[#942008]" /> Upload File (Image, Video, Document)
                    </span>
                    <span className="text-[10px] text-slate-500 font-normal">Browser File Picker</span>
                  </label>

                  <div className="flex flex-col gap-2">
                    <label className="relative w-full">
                      <input
                        type="file"
                        accept="image/*,video/*,.pdf,.doc,.docx"
                        onChange={handleFileBrowserSelect}
                        disabled={uploadingFile}
                        className="w-full text-xs text-stone-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-[#fde5d6] file:text-[#942008] hover:file:bg-[#fde5d6]/80 cursor-pointer bg-[#faf8f5] border border-stone-200 rounded-xl p-1 disabled:opacity-50"
                      />
                      {uploadingFile && (
                        <span className="absolute inset-0 flex items-center justify-center bg-[#faf8f5]/80 rounded-xl text-xs font-bold text-[#942008]">
                          ⏳ Uploading file...
                        </span>
                      )}
                    </label>

                    <input
                      type="text"
                      placeholder="Or paste external file / image URL..."
                      value={winForm.imageUrl}
                      onChange={(e) => setWinForm({ ...winForm, imageUrl: e.target.value })}
                      className="flex h-9 w-full rounded-xl border border-stone-200 bg-[#faf8f5] px-3 text-xs text-stone-900 placeholder-slate-500 focus:border-[#c4431d] focus:outline-none"
                    />
                  </div>

                  {/* Preview — shows after file is uploaded to server or URL is typed */}
                  {winForm.imageUrl && (
                    <div className="mt-2 p-2 rounded-xl bg-[#faf8f5] border border-stone-200 relative">
                      <button
                        type="button"
                        onClick={() => setWinForm({ ...winForm, imageUrl: '' })}
                        className="absolute right-2 top-2 bg-white text-stone-500 hover:text-stone-900 p-1 rounded-lg z-10"
                      >
                        <X size={12} />
                      </button>

                      {winForm.imageUrl.match(/\.(mp4|webm|mov|m4v)$/i) || winForm.imageUrl.includes('/uploads/videos/') ? (
                        <video src={getMediaUrl(winForm.imageUrl)} controls className="max-h-36 rounded-lg w-full object-contain bg-black" />
                      ) : winForm.imageUrl.match(/\.(jpeg|jpg|gif|png|webp|svg)$/i) ? (
                        <img src={getMediaUrl(winForm.imageUrl)} alt="Preview" className="max-h-36 rounded-lg w-full object-cover" />
                      ) : winForm.imageUrl.startsWith('http') ? (
                        <div className="p-3 text-xs font-bold text-cyan-400 flex items-center gap-2">
                          🔗 External link attached
                        </div>
                      ) : (
                        <div className="p-3 text-xs font-bold text-emerald-400 flex items-center gap-2">
                          ✅ File uploaded successfully!
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-600">Story / Reflection</label>
                  <textarea
                    rows={2}
                    placeholder="How did you achieve this? What did you learn?"
                    value={winForm.notes}
                    onChange={(e) => setWinForm({ ...winForm, notes: e.target.value })}
                    className="flex w-full rounded-xl border border-stone-200 bg-[#faf8f5] p-3 text-xs text-stone-900 placeholder-slate-500 focus:border-[#c4431d] focus:outline-none resize-none"
                  />
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={posting || uploadingFile}
                    className="flex-1 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#942008] via-[#c4431d] to-[#ea580c] hover:opacity-95 text-white font-bold text-xs h-10 rounded-xl shadow-md hover:scale-105 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {posting ? 'Publishing...' : `Publish Win ${canEarnWinXp ? '(+100 XP)' : ''}`}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="border border-stone-300 bg-stone-100 text-stone-600 font-semibold text-xs h-10 px-4 rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
};
