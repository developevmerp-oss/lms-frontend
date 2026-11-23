"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Sparkles, Plus, CheckCircle2, ChevronRight, X, DollarSign, Award, Flame, MessageCircle, Image, Send, Heart, Gem, MoreHorizontal, Loader2, Trash2, Edit3 } from 'lucide-react';
import { API_BASE_URL } from '@/config/api';
import { useAuth } from '@/context/AuthContext';
import { uploadMediaFile, discardUploadedFile } from '@/utils/uploadFile';

interface CommentItem {
  author: string;
  text: string;
}

interface WinItem {
  id: string;
  userId?: string;
  studentName: string;
  studentLevel: string;
  title: string;
  amount?: string;
  image?: string;
  likes?: number;
  likedByMe?: boolean;
  comments?: CommentItem[];
  badge?: string;
  timeAgo: string;
}

export const WinWall = ({
  communityWins = [],
  onWinAdded,
  membershipLevel,
  isLoading = false,
}: {
  communityWins?: any[];
  onWinAdded?: () => void;
  membershipLevel?: string;
  isLoading?: boolean;
}) => {
  const { user } = useAuth();
  const [wins, setWins] = useState<any[]>(communityWins);
  const [myPostMap, setMyPostMap] = useState<Record<string, string>>({});
  const [openMenuPostId, setOpenMenuPostId] = useState<string | null>(null);
  const [postToDelete, setPostToDelete] = useState<WinItem | null>(null);
  const [deletingPost, setDeletingPost] = useState(false);
  const [editingPost, setEditingPost] = useState<WinItem | null>(null);
  const [editForm, setEditForm] = useState({
    title: '',
    salesAmount: '',
    technique: '',
    notes: '',
    imageUrl: '',
  });
  const [uploadingEditFile, setUploadingEditFile] = useState(false);
  const [savingEdit, setSavingEdit] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedCommentsId, setExpandedCommentsId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState<{ [winId: string]: string }>({});
  const [commenting, setCommenting] = useState(false);
  const [likingId, setLikingId] = useState<string | null>(null);
  // posts whose image file can no longer be loaded (old files that were stored on a server disk)
  const [brokenMedia, setBrokenMedia] = useState<Record<string, boolean>>({});

  const startEditPost = (win: any) => {
    const rawAchievement = win.achievement || win.title || '';

    // Extract sales amount if present (e.g. "(₹890 sale!)" or "(₹1,200 sale!)")
    const amountMatch = rawAchievement.match(/\([₹rRsS\.]*([\d,]+)\s+sale!\)/i);
    const parsedAmount = amountMatch
      ? amountMatch[1].replace(/,/g, '')
      : (win.amount ? String(win.amount).replace(/[^\d]/g, '') : (win.salesAmount ? String(win.salesAmount).replace(/[^\d]/g, '') : ''));

    // Extract technique if present (e.g. "• Technique: chnarges")
    const techMatch = rawAchievement.match(/•\s*Technique:\s*([^•\n]+)/i);
    const parsedTech = techMatch ? techMatch[1].trim() : (win.technique || '');

    // Cleaned main text without the (₹... sale!) and • Technique: ...
    const baseText = rawAchievement
      .replace(/\s*\([₹rRsS\.]*[\d,]+\s+sale!\)/gi, '')
      .replace(/\s*•\s*Technique:\s*[^•\n]+/gi, '')
      .trim();

    setEditingPost(win);
    setEditForm({
      title: baseText || win.title || '',
      salesAmount: parsedAmount,
      technique: parsedTech,
      notes: win.notes || '',
      imageUrl: win.image || win.imageUrl || '',
    });
  };

  const handleEditFileBrowserSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingEditFile(true);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const { url } = await uploadMediaFile(file, token || undefined);
      setEditForm((prev) => ({ ...prev, imageUrl: url }));
    } catch (err) {
      console.error(err);
      alert('File upload failed. Please try again or paste a link.');
    } finally {
      setUploadingEditFile(false);
    }
  };

  const saveEditedPost = async () => {
    if (!editingPost) return;
    const finalTitle = editForm.title.trim();
    if (!finalTitle && !editForm.notes.trim()) {
      alert('Please provide a title or story for your post.');
      return;
    }
    setSavingEdit(true);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const res = await fetch(`${API_BASE_URL}/dashboard/community-wins/${editingPost.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          title: finalTitle,
          achievement: editForm.notes.trim() || finalTitle,
          salesAmount: editForm.salesAmount.trim(),
          technique: editForm.technique.trim(),
          imageUrl: editForm.imageUrl.trim() || null,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        let updatedAchievement = data.win?.achievement;
        if (!updatedAchievement) {
          updatedAchievement = editForm.notes.trim() || finalTitle;
          if (editForm.salesAmount.trim()) {
            updatedAchievement += ` (₹${Number(editForm.salesAmount.trim()).toLocaleString()} sale!)`;
          }
          if (editForm.technique.trim()) {
            updatedAchievement += ` • Technique: ${editForm.technique.trim()}`;
          }
        }
        const updatedImage = data.win?.image !== undefined ? data.win.image : (editForm.imageUrl.trim() || null);

        setWins((prev) =>
          prev.map((w) =>
            w.id === editingPost.id
              ? {
                  ...w,
                  ...(data.win || {}),
                  achievement: updatedAchievement,
                  title: updatedAchievement,
                  image: updatedImage,
                  imageUrl: updatedImage,
                  amount: editForm.salesAmount.trim() ? `₹${Number(editForm.salesAmount.trim()).toLocaleString('en-IN')}` : undefined,
                  salesAmount: editForm.salesAmount.trim() || undefined,
                  technique: editForm.technique.trim() || undefined,
                }
              : w
          )
        );
        setEditingPost(null);
        if (onWinAdded) onWinAdded();
      } else {
        alert(data.message || 'Failed to update post.');
      }
    } catch (err) {
      console.error('Error saving post:', err);
      alert('Failed to update post. Please try again.');
    } finally {
      setSavingEdit(false);
    }
  };

  const confirmDeletePost = async () => {
    if (!postToDelete) return;
    setDeletingPost(true);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const res = await fetch(`${API_BASE_URL}/dashboard/community-wins/${postToDelete.id}`, {
        method: 'DELETE',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) {
        setWins((prev) => prev.filter((w) => w.id !== postToDelete.id));
        if (myPostMap[postToDelete.id]) {
          const nextMap = { ...myPostMap };
          delete nextMap[postToDelete.id];
          setMyPostMap(nextMap);
          try {
            localStorage.setItem('my_community_wins', JSON.stringify(nextMap));
          } catch (_) {}
        }
        if (onWinAdded) onWinAdded();
        setPostToDelete(null);
      } else {
        const data = await res.json();
        alert(data.message || 'Failed to delete post.');
      }
    } catch (err) {
      console.error('Error deleting post:', err);
      alert('Failed to delete post. Please try again.');
    } finally {
      setDeletingPost(false);
    }
  };

  const handleShare = async (win: WinItem) => {
    try {
      if (typeof navigator !== 'undefined' && navigator.share) {
        await navigator.share({
          title: win.title || 'Resin Art Community Win',
          text: `${win.studentName}: ${win.title}`,
          url: window.location.href,
        });
      } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(window.location.href);
        alert('Post link copied to clipboard!');
      }
    } catch (_) { }
  };
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

  // Load locally saved post author mapping
  React.useEffect(() => {
    try {
      const stored = localStorage.getItem('my_community_wins');
      if (stored) {
        setMyPostMap(JSON.parse(stored));
      }
    } catch (_) { }
  }, []);

  const effectiveLevel = (membershipLevel || user?.membershipLevel || user?.rank || user?.level || 'GENERAL').toUpperCase();
  const isGeneral = effectiveLevel === 'GENERAL' || effectiveLevel.includes('GENERAL');
  const isL0 = effectiveLevel === 'L0' || effectiveLevel.includes('FAST START') || effectiveLevel.includes('FAST TRACK') || effectiveLevel.includes('BRONZE');
  const isL3Diamond = effectiveLevel === 'L3' || effectiveLevel.includes('DIAMOND') || effectiveLevel.includes('RENAISSANCE') || (user?.rank || '').toUpperCase().includes('DIAMOND');
  // General & L0 Fast Track members have VIEW-ONLY access to the feed. Only L1, L2, L3+ can post and comment.
  const canPost = !isGeneral && !isL0;
  // L1, L2, and L3 members all earn +100 XP when sharing wins
  const canEarnWinXp = canPost;

  const getMediaUrl = (url: string) => {
    if (!url || typeof url !== 'string') return '';
    const cleanUrl = url.replace(/\\/g, '/').trim();
    if (cleanUrl.startsWith('http://') || cleanUrl.startsWith('https://') || cleanUrl.startsWith('data:')) return cleanUrl;
    if (
      cleanUrl.startsWith('/images/') ||
      cleanUrl.startsWith('/icons/') ||
      cleanUrl.startsWith('/fonts/') ||
      cleanUrl.startsWith('/svg/') ||
      cleanUrl.startsWith('images/')
    ) {
      return cleanUrl.startsWith('/') ? cleanUrl : `/${cleanUrl}`;
    }
    const backendBase = API_BASE_URL.replace(/\/api\/?$/, '');
    return `${backendBase}${cleanUrl.startsWith('/') ? '' : '/'}${cleanUrl}`;
  };

  // Keep synced with parent props
  React.useEffect(() => {
    if (communityWins) {
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
      const token = localStorage.getItem('token');
      // Images go to /upload/image, videos to /upload/video, documents to /upload/document
      // (the backend saves them in Cloudinary and returns the link)
      const { url } = await uploadMediaFile(file, token);
      discardUploadedFile(winForm.imageUrl, token); // a previous, still unsaved upload is replaced: delete it from Cloudinary
      setWinForm((prev) => ({ ...prev, imageUrl: url }));
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
          studentName: user?.name || 'Fellow Artist',
        }),
      });

      const data = await res.json();
      if (data.success && data.win) {
        const authorName = user?.name || 'Fellow Artist';
        const updatedMap = { ...myPostMap, [data.win.id]: authorName };
        setMyPostMap(updatedMap);
        try {
          localStorage.setItem('my_community_wins', JSON.stringify(updatedMap));
        } catch (_) { }

        const winWithAuthor = {
          ...data.win,
          studentName: authorName,
        };

        setWins([winWithAuthor, ...wins]);
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
        let safeComments = updatedWin.comments;
        if (typeof safeComments === 'string') {
          try { safeComments = JSON.parse(safeComments); } catch (_) { safeComments = []; }
        }
        setWins((prev) => prev.map((w) => (w.id === winId ? { ...w, ...updatedWin, comments: safeComments || [] } : w)));
        setCommentText((prev) => ({ ...prev, [winId]: '' }));
        setExpandedCommentsId(winId);
        onWinAdded?.();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setCommenting(false);
    }
  };

  const handleLike = async (winId: string) => {
    if (likingId) return; // ignore clicks while a like request is still running
    setLikingId(winId);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_BASE_URL}/dashboard/community-wins/${winId}/like`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const updatedWin = await res.json();
        setWins((prev) => prev.map((w) => (w.id === winId ? updatedWin : w)));
      }
    } catch (_) {
    } finally {
      setLikingId(null);
    }
  };

  const resolveAuthorName = (w: any): string => {
    // 1. Direct author name from database/post
    const rawName = w.studentName || w.userName || w.author || w.user?.name || w.User?.name;
    if (rawName && rawName.trim().toLowerCase() !== 'student') {
      return rawName;
    }

    // 2. If tracked locally in session
    if (w.id && myPostMap[w.id]) {
      return myPostMap[w.id];
    }

    return 'Fellow Artist';
  };

  const featuredCommunityWins: WinItem[] = [
    {
      id: 'demo-vrajangna',
      studentName: 'Patel Vrajanga (Admin)',
      studentLevel: 'Admin',
      title: 'Completed my first resin tray with floral design! ✨',
      amount: undefined,
      image: '/images/student-art/real-art-14.jpg',
      likes: 12,
      comments: [
        { author: 'Priya', text: 'Stunning colors and gold foil accents! 😍' }
      ],
      badge: '🏆 Win',
      timeAgo: 'Just now',
    },
  ];

  const parsedWins: WinItem[] = wins.map((w, idx) => {
    let safeComments: CommentItem[] = [];
    if (Array.isArray(w.comments)) {
      safeComments = w.comments;
    } else if (typeof w.comments === 'string') {
      try { safeComments = JSON.parse(w.comments); } catch (_) { safeComments = []; }
    }
    return {
      id: w.id || String(idx),
      userId: w.userId,
      studentName: resolveAuthorName(w),
      studentLevel: w.level || 'L1 Member',
      title: w.achievement || w.title || 'Achieved a new breakthrough!',
      amount: w.salesAmount ? `₹${Number(w.salesAmount).toLocaleString('en-IN')}` : undefined,
      image: w.image || w.imageUrl,
      likes: w.likes || 0,
      likedByMe: Boolean(w.likedByMe),
      comments: safeComments,
      badge: '🏆 Win',
      timeAgo: w.timeAgo || 'Recently',
    };
  });

  // Combine database posts with featured community wins so Patel Vrajangna's post stays permanently visible
  const displayWins: WinItem[] = [
    ...parsedWins,
    ...featuredCommunityWins.filter(
      (fw) => !parsedWins.some((pw) => pw.id === fw.id)
    ),
  ];

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

      {/* 2. Feed Post Cards List (1 Card Per Row - Single Column) */}
      {isLoading ? (
        <div className="flex flex-col gap-6 w-full">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="bg-white rounded-3xl border border-[#ecdccb]/80 p-5 sm:p-6 shadow-[0_4px_20px_-4px_rgba(90,55,20,0.05)] space-y-4 animate-pulse w-full"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full shimmer-box" />
                <div className="space-y-1.5 flex-1">
                  <div className="h-4 shimmer-box rounded w-1/4" />
                  <div className="h-3 shimmer-box rounded w-1/6" />
                </div>
              </div>
              <div className="h-72 shimmer-box rounded-2xl w-full" />
              <div className="flex gap-4">
                <div className="w-6 h-6 rounded-full shimmer-box" />
                <div className="w-6 h-6 rounded-full shimmer-box" />
                <div className="w-6 h-6 rounded-full shimmer-box" />
              </div>
              <div className="h-3.5 shimmer-box rounded w-1/6" />
              <div className="h-4 shimmer-box rounded w-3/4" />
            </div>
          ))}
        </div>
      ) : displayWins.length === 0 ? (
        <div className="bg-white rounded-3xl border border-[#ecdccb]/80 p-8 sm:p-10 shadow-[0_4px_20px_-4px_rgba(90,55,20,0.05)] text-center space-y-3">
          <div className="w-14 h-14 rounded-full bg-[#fde5d6] text-[#c4431d] flex items-center justify-center mx-auto text-2xl">
            ✨
          </div>
          <h3 className="text-base font-bold text-stone-900">No Community Wins Yet</h3>
          <p className="text-stone-500 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
            Be the first to share your recent resin art masterpiece, first client sale, or workshop achievement with the sisterhood!
          </p>
          {canPost && (
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#942008] via-[#c4431d] to-[#ea580c] text-white font-bold text-xs shadow-md shadow-[#c4431d]/20 hover:scale-[1.02] transition-transform cursor-pointer"
              >
                <span>+ Share Your First Win</span>
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-6 w-full">
          {displayWins.map((win) => {
            const isExpanded = expandedCommentsId === win.id;
            const authorInitial = (win.studentName || 'P').charAt(0).toUpperCase();
            const isMyPost = Boolean(
              (win.userId && user?.id && String(win.userId) === String(user.id)) ||
              (win.studentName && user?.name && win.studentName.trim().toLowerCase() === user.name.trim().toLowerCase()) ||
              (win.id && myPostMap[win.id])
            );

            return (
              <div
                key={win.id}
                className="bg-white rounded-3xl border border-[#ecdccb]/80 p-5 sm:p-6 shadow-[0_4px_20px_-4px_rgba(90,55,20,0.05)] flex flex-col justify-between transition-all hover:shadow-[0_8px_30px_-6px_rgba(90,55,20,0.08)] w-full"
              >
                <div>
                  {/* 1. Header: Avatar + Stacked Name & Time + Three Dots (Only visible to post author) */}
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-full bg-[#fde5d6] text-[#c4431d] font-bold text-sm flex items-center justify-center shrink-0">
                        {authorInitial}
                      </div>
                      <div className="min-w-0 flex flex-col">
                        <span className="font-bold text-stone-900 text-sm sm:text-base leading-tight truncate">
                          {win.studentName}
                        </span>
                        <span className="text-xs text-stone-400 font-normal leading-tight mt-0.5">
                          {win.timeAgo || 'Just now'}
                        </span>
                      </div>
                    </div>

                    {isMyPost && (
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setOpenMenuPostId(openMenuPostId === win.id ? null : win.id)}
                          className="p-1 text-stone-700 hover:text-stone-900 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
                          title="Post options"
                          aria-label="Post options"
                        >
                          <MoreHorizontal size={20} />
                        </button>

                        {openMenuPostId === win.id && (
                          <>
                            <div
                              className="fixed inset-0 z-30"
                              onClick={() => setOpenMenuPostId(null)}
                            />
                            <div className="absolute right-0 top-full mt-1 w-36 bg-white rounded-2xl shadow-xl border border-stone-200/90 py-1.5 z-40 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                              <button
                                type="button"
                                onClick={() => {
                                  setOpenMenuPostId(null);
                                  startEditPost(win);
                                }}
                                className="w-full px-3.5 py-2 text-left text-xs font-bold text-stone-700 hover:text-stone-900 hover:bg-stone-50 flex items-center gap-2 transition-colors cursor-pointer"
                              >
                                <Edit3 size={14} className="text-stone-500" />
                                <span>Edit Post</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setOpenMenuPostId(null);
                                  setPostToDelete(win);
                                }}
                                className="w-full px-3.5 py-2 text-left text-xs font-bold text-red-600 hover:text-red-700 hover:bg-red-50 flex items-center gap-2 transition-colors cursor-pointer"
                              >
                                <Trash2 size={14} className="text-red-500" />
                                <span>Delete Post</span>
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>

                  {/* 2. Media Image / Video Placed FIRST with Floating ⭐ +100 XP Badge (Matches Reference Image 2) */}
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
                        <div className="relative rounded-2xl overflow-hidden border border-stone-200 bg-black aspect-video w-full max-h-[580px] shadow-xs">
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

                    const isVideo =
                      mediaUrl.startsWith('data:video') ||
                      /\.(mp4|webm|mov|m4v|avi|mkv|3gp|flv|ogv)(\?.*)?$/i.test(mediaUrl) ||
                      mediaUrl.includes('/video/upload/') ||
                      mediaUrl.includes('/uploads/videos/') ||
                      mediaUrl.includes('/videos/');

                    const isDoc =
                      !isVideo &&
                      (mediaUrl.startsWith('data:application') || /\.(pdf|doc|docx|zip|rar)(\?.*)?$/i.test(mediaUrl));

                    const isDirectImage =
                      !isVideo &&
                      !isDoc &&
                      (mediaUrl.startsWith('data:image') ||
                        /\.(jpeg|jpg|gif|png|webp|svg|bmp|avif)(\?.*)?$/i.test(mediaUrl) ||
                        mediaUrl.includes('unsplash.com') ||
                        (mediaUrl.includes('cloudinary') && !mediaUrl.includes('/video/')) ||
                        mediaUrl.includes('/images/') ||
                        mediaUrl.includes('/student-art/'));

                    const isWebUrl = !isVideo && !isDoc && !isDirectImage && (mediaUrl.startsWith('http://') || mediaUrl.startsWith('https://'));

                    if (isVideo) {
                      return (
                        <div className="relative rounded-2xl overflow-hidden border border-stone-200 bg-black w-full max-h-[580px] shadow-xs flex items-center justify-center">
                          <video
                            src={getMediaUrl(mediaUrl)}
                            controls
                            playsInline
                            className="w-full h-auto max-h-[580px] object-contain bg-black rounded-2xl"
                          />
                        </div>
                      );
                    }

                    if (isDoc) {
                      return (
                        <div className="p-4 rounded-2xl bg-[#faf8f5] border border-stone-200 flex items-center justify-between gap-3 shadow-xs">
                          <div className="flex items-center gap-2.5 overflow-hidden">
                            <div className="w-10 h-10 rounded-xl bg-[#fde5d6] border border-[#f5ded0] flex items-center justify-center text-[#942008] font-bold shrink-0 text-base">
                              📄
                            </div>
                            <div className="truncate">
                              <p className="text-xs font-bold text-stone-900 truncate">Attached Document</p>
                              <p className="text-xs text-stone-500">Click to download</p>
                            </div>
                          </div>
                          <a
                            href={getMediaUrl(mediaUrl)}
                            download="community-file"
                            target="_blank"
                            rel="noreferrer"
                            className="px-3.5 py-1.5 rounded-xl bg-[#fde5d6] hover:bg-[#fde5d6]/80 text-[#942008] text-xs font-bold transition-all shrink-0"
                          >
                            Download
                          </a>
                        </div>
                      );
                    }

                    if (isWebUrl && !isDirectImage) {
                      return (
                        <div className="p-4 rounded-2xl bg-white border border-stone-200 flex items-center justify-between gap-3 shadow-xs">
                          <div className="flex items-center gap-2.5 overflow-hidden min-w-0">
                            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-500 font-bold shrink-0 text-base">
                              🔗
                            </div>
                            <div className="truncate min-w-0">
                              <p className="text-xs font-bold text-stone-900 truncate">External Link</p>
                              <p className="text-xs text-stone-500 truncate">{mediaUrl}</p>
                            </div>
                          </div>
                          <a
                            href={mediaUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-700 text-xs font-bold transition-all shrink-0"
                          >
                            Open ↗
                          </a>
                        </div>
                      );
                    }

                    if (brokenMedia[win.id]) {
                      return (
                        <div className="rounded-2xl border border-dashed border-stone-300 bg-[#faf8f5] w-full py-10 flex flex-col items-center justify-center gap-2 text-stone-400">
                          <Image size={28} />
                          <span className="text-xs">Image is no longer available</span>
                        </div>
                      );
                    }

                    return (
                      <div className="relative rounded-2xl overflow-hidden border border-stone-200/80 bg-[#faf8f5] w-full max-h-[580px] shadow-xs flex items-center justify-center">
                        <img
                          src={getMediaUrl(mediaUrl)}
                          alt={win.title || "Post artwork"}
                          onError={() => setBrokenMedia((prev) => ({ ...prev, [win.id]: true }))}
                          className="w-full h-auto max-h-[580px] object-contain rounded-2xl hover:scale-[1.005] transition-transform duration-300 block"
                        />
                      </div>
                    );
                  })()}

                  {/* 3. Action Bar: Heart, Comment, Send on Left */}
                  <div className="flex items-center gap-4 mt-3.5 pt-1 text-stone-700">
                    <button
                      type="button"
                      onClick={() => handleLike(win.id)}
                      className="hover:text-rose-500 transition-colors cursor-pointer"
                      title="Like"
                    >
                      <Heart
                        size={22}
                        className={win.likedByMe ? 'text-rose-500 fill-rose-500' : 'text-stone-800 hover:text-rose-500'}
                      />
                    </button>

                    <button
                      type="button"
                      onClick={() => setExpandedCommentsId(isExpanded ? null : win.id)}
                      className="hover:text-[#c4431d] transition-colors cursor-pointer text-stone-800"
                      title="Comments"
                    >
                      <MessageCircle size={22} />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleShare(win)}
                      className="hover:text-stone-900 transition-colors cursor-pointer text-stone-800"
                      title="Share"
                    >
                      <Send size={20} className="rotate-[-10deg]" />
                    </button>
                  </div>

                  {/* 4. Likes Count Line (Matches Reference Image 2) */}
                  <div className="mt-2.5">
                    <span className="font-bold text-xs sm:text-sm text-stone-900">
                      {`${win.likes || 0} ${win.likes === 1 ? 'Like' : 'Likes'}`}
                    </span>
                  </div>

                  {/* 5. Post Caption / Text BELOW Likes (Matches Reference Image 2) */}
                  <p className="mt-1.5 text-xs sm:text-sm text-stone-900 leading-relaxed font-normal">
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

                  {/* View Comments / Comments Count Toggle */}
                  {win.comments && win.comments.length > 0 ? (
                    <div className="mt-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setExpandedCommentsId(isExpanded ? null : win.id)}
                        className="text-xs font-semibold text-stone-500 hover:text-stone-800 transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        <MessageCircle size={14} className="text-[#c4431d]" />
                        <span>
                          {isExpanded
                            ? 'Hide comments'
                            : `View all ${win.comments.length} ${win.comments.length === 1 ? 'comment' : 'comments'}`}
                        </span>
                      </button>
                      {!isExpanded && (
                        <div className="mt-1 text-xs text-stone-600 line-clamp-1 bg-[#faf8f5]/80 px-2.5 py-1.5 rounded-lg border border-stone-200/50">
                          <span className="font-bold text-stone-900 mr-1.5">
                            {win.comments[win.comments.length - 1].author}:
                          </span>
                          <span className="text-stone-700">
                            {win.comments[win.comments.length - 1].text}
                          </span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setExpandedCommentsId(isExpanded ? null : win.id)}
                      className="mt-1.5 text-xs text-stone-400 hover:text-[#c4431d] transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <MessageCircle size={13} />
                      <span>Add a comment...</span>
                    </button>
                  )}
                </div>

                {/* 6. Expandable Comments Drawer (Preserved Functionality) */}
                {isExpanded && (
                  <div className="pt-3 mt-3 space-y-2.5 border-t border-stone-100">
                    {win.comments && win.comments.length > 0 ? (
                      <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                        {win.comments.map((c, i) => {
                          const commentAuthor =
                            c.author && c.author.trim().toLowerCase() !== 'student'
                              ? c.author
                              : 'Artist Member';
                          return (
                            <div key={i} className="bg-[#faf8f5] p-2.5 rounded-xl text-xs">
                              <span className="font-bold text-[#942008] mr-2">{commentAuthor}:</span>
                              <span className="text-stone-700">{c.text}</span>
                            </div>
                          );
                        })}
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
                          className="px-3.5 py-2 bg-gradient-to-r from-[#942008] via-[#c4431d] to-[#ea580c] text-white rounded-xl font-bold text-xs hover:opacity-95 transition-all cursor-pointer shrink-0 disabled:opacity-50 flex items-center justify-center"
                        >
                          {commenting ? <Loader2 size={13} className="animate-spin" /> : <Send size={13} />}
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
      )}

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
              <div className="w-9 h-9 sm:w-11 sm:h-11 lg:w-9 lg:h-9 rounded-xl bg-[#fde5d6] border border-[#f5ded0] flex items-center justify-center text-[#942008] shrink-0">
                <Trophy size={18} />
              </div>
              <div>
                <h3 className="text-base sm:text-2xl lg:text-lg font-black text-stone-900">Post Your Win on the Feed</h3>
                <p className="text-xs sm:text-base lg:text-xs text-stone-500">
                  {canEarnWinXp
                    ? '🌟 Share your milestone and earn +100 XP!'
                    : 'Share your milestone with the sisterhood!'}
                </p>
              </div>
            </div>

            {successMsg ? (
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 text-xs sm:text-base lg:text-sm font-bold text-center">
                {successMsg}
              </div>
            ) : (
              <form onSubmit={handlePostWin} className="space-y-3.5">
                <div className="space-y-1">
                  <label className="text-xs sm:text-lg lg:text-sm font-bold text-stone-600 block">Win / Milestone Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sold my first 3D Geode Wall Clock!"
                    value={winForm.title}
                    onChange={(e) => setWinForm({ ...winForm, title: e.target.value })}
                    className="flex h-10 sm:h-12 lg:h-10 w-full rounded-xl border border-stone-200 bg-[#faf8f5] px-3.5 text-xs sm:text-lg lg:text-sm text-stone-900 placeholder-slate-500 focus:border-[#c4431d] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs sm:text-lg lg:text-sm font-bold text-stone-600 block">Sales Amount (₹ optional)</label>
                    <input
                      type="number"
                      placeholder="e.g. 4500"
                      value={winForm.salesAmount}
                      onChange={(e) => setWinForm({ ...winForm, salesAmount: e.target.value })}
                      className="flex h-10 sm:h-12 lg:h-10 w-full rounded-xl border border-stone-200 bg-[#faf8f5] px-3.5 text-xs sm:text-lg lg:text-sm text-stone-900 placeholder-slate-500 focus:border-[#c4431d] focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs sm:text-lg lg:text-sm font-bold text-stone-600 block">Technique Used</label>
                    <input
                      type="text"
                      placeholder="e.g. Ocean Wave Lacing"
                      value={winForm.technique}
                      onChange={(e) => setWinForm({ ...winForm, technique: e.target.value })}
                      className="flex h-10 sm:h-12 lg:h-10 w-full rounded-xl border border-stone-200 bg-[#faf8f5] px-3.5 text-xs sm:text-lg lg:text-sm text-stone-900 placeholder-slate-500 focus:border-[#c4431d] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Browser File Upload & URL input */}
                <div className="space-y-1.5">
                  <label className="text-xs sm:text-lg lg:text-sm font-bold text-stone-600 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Image size={14} className="text-[#942008]" /> Upload File (Image, Video, Document)
                    </span>
                    <span className="text-xs sm:text-base lg:text-xs text-slate-500 font-normal">Browser File Picker</span>
                  </label>

                  <div className="flex flex-col gap-2">
                    <label className="relative w-full">
                      <input
                        type="file"
                        accept="image/*,video/*,.pdf,.doc,.docx"
                        onChange={handleFileBrowserSelect}
                        disabled={uploadingFile}
                        className="w-full text-xs sm:text-base lg:text-xs text-stone-600 file:mr-3 file:py-1.5 sm:file:py-2.5 file:px-3 sm:file:px-4 file:rounded-lg file:border-0 file:text-xs sm:file:text-base lg:file:text-xs file:font-bold file:bg-[#fde5d6] file:text-[#942008] hover:file:bg-[#fde5d6]/80 cursor-pointer bg-[#faf8f5] border border-stone-200 rounded-xl p-1 disabled:opacity-50"
                      />
                      {uploadingFile && (
                        <span className="absolute inset-0 flex items-center justify-center bg-[#faf8f5]/80 rounded-xl text-xs sm:text-base lg:text-xs font-bold text-[#942008]">
                          ⏳ Uploading file...
                        </span>
                      )}
                    </label>

                    <input
                      type="text"
                      placeholder="Or paste external file / image URL..."
                      value={winForm.imageUrl}
                      onChange={(e) => setWinForm({ ...winForm, imageUrl: e.target.value })}
                      className="flex h-9 sm:h-11 lg:h-9 w-full rounded-xl border border-stone-200 bg-[#faf8f5] px-3 text-xs sm:text-lg lg:text-sm text-stone-900 placeholder-slate-500 focus:border-[#c4431d] focus:outline-none"
                    />
                  </div>

                  {/* Preview — shows after file is uploaded to server or URL is typed */}
                  {winForm.imageUrl && (
                    <div className="mt-2 p-2 rounded-xl bg-[#faf8f5] border border-stone-200 relative">
                      <button
                        type="button"
                        onClick={() => { discardUploadedFile(winForm.imageUrl, localStorage.getItem('token')); setWinForm({ ...winForm, imageUrl: '' }); }}
                        className="absolute right-2 top-2 bg-white text-stone-500 hover:text-stone-900 p-1 rounded-lg z-10 shadow-xs cursor-pointer"
                      >
                        <X size={12} />
                      </button>

                      {winForm.imageUrl.match(/\.(jpeg|jpg|gif|png|webp|svg)$/i) || (winForm.imageUrl.includes('cloudinary') && !winForm.imageUrl.includes('/video/')) ? (
                        <img src={getMediaUrl(winForm.imageUrl)} alt="Preview" className="max-h-36 sm:max-h-48 lg:max-h-36 rounded-lg w-full object-cover" />
                      ) : winForm.imageUrl.match(/\.(mp4|webm|mov|m4v|avi|mkv)$/i) || winForm.imageUrl.includes('/uploads/videos/') || winForm.imageUrl.includes('/video/upload/') || winForm.imageUrl.startsWith('data:video') ? (
                        <video src={getMediaUrl(winForm.imageUrl)} controls className="max-h-36 sm:max-h-48 lg:max-h-36 rounded-lg w-full object-contain bg-black" />
                      ) : winForm.imageUrl.startsWith('http') ? (
                        <div className="p-3 text-xs sm:text-base lg:text-sm font-bold text-cyan-700 flex items-center gap-2">
                          🔗 External link attached
                        </div>
                      ) : (
                        <div className="p-3 text-xs sm:text-base lg:text-sm font-bold text-emerald-700 flex items-center gap-2">
                          ✅ File uploaded successfully!
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-xs sm:text-lg lg:text-sm font-bold text-stone-600 block">Story / Reflection</label>
                  <textarea
                    rows={2}
                    placeholder="How did you achieve this? What did you learn?"
                    value={winForm.notes}
                    onChange={(e) => setWinForm({ ...winForm, notes: e.target.value })}
                    className="flex w-full rounded-xl border border-stone-200 bg-[#faf8f5] p-3 text-xs sm:text-lg lg:text-sm text-stone-900 placeholder-slate-500 focus:border-[#c4431d] focus:outline-none resize-none"
                  />
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={posting || uploadingFile}
                    className="flex-1 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#942008] via-[#c4431d] to-[#ea580c] hover:opacity-95 text-white font-bold text-xs sm:text-base lg:text-xs h-10 sm:h-12 lg:h-10 rounded-xl shadow-md hover:scale-105 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {(posting || uploadingFile) && <Loader2 size={14} className="animate-spin" />}
                    {posting ? 'Publishing...' : `Publish Win ${canEarnWinXp ? '(+100 XP)' : ''}`}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="border border-stone-300 shimmer-box text-stone-600 font-semibold text-xs sm:text-base lg:text-xs h-10 sm:h-12 lg:h-10 px-4 rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ─── Delete Confirmation Modal ─── */}
      {postToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-sm sm:max-w-md w-full p-6 sm:p-7 shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mb-4 mx-auto">
              <Trash2 size={24} className="sm:w-7 sm:h-7" />
            </div>
            <h3 className="text-lg sm:text-2xl lg:text-lg font-black text-stone-900 text-center">Delete Post?</h3>
            <p className="text-xs sm:text-base lg:text-xs text-stone-500 text-center mt-1.5 leading-relaxed">
              Are you sure you want to delete this post? This action cannot be undone.
            </p>

            <div className="flex items-center gap-3 mt-6">
              <button
                type="button"
                onClick={() => setPostToDelete(null)}
                disabled={deletingPost}
                className="flex-1 py-2.5 sm:py-3.5 px-4 rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-50 text-xs sm:text-base lg:text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeletePost}
                disabled={deletingPost}
                className="flex-1 py-2.5 sm:py-3.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs sm:text-base lg:text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {deletingPost ? <Loader2 size={14} className="animate-spin" /> : 'Delete Post'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Edit Post Modal (Matches Reference Design) ─── */}
      {editingPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#faf8f5]/80 backdrop-blur-md">
          <div className="relative w-full max-w-md rounded-3xl border border-[#ecdccb] bg-white p-6 sm:p-7 shadow-2xl text-stone-900 max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setEditingPost(null)}
              className="absolute right-4 top-4 text-stone-500 hover:text-stone-900 cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 sm:w-11 sm:h-11 lg:w-9 lg:h-9 rounded-xl bg-[#fde5d6] border border-[#f5ded0] flex items-center justify-center text-[#942008] shrink-0">
                <Trophy size={18} />
              </div>
              <div>
                <h3 className="text-base sm:text-2xl lg:text-lg font-black text-stone-900">Edit Your Post</h3>
                <p className="text-xs sm:text-base lg:text-xs text-stone-500">
                  Update your milestone details and media
                </p>
              </div>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                saveEditedPost();
              }}
              className="space-y-3.5"
            >
              <div className="space-y-1">
                <label className="text-xs sm:text-lg lg:text-sm font-bold text-stone-600 block">Win / Milestone Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sold my first 3D Geode Wall Clock!"
                  value={editForm.title}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, title: e.target.value }))}
                  className="flex h-10 sm:h-12 lg:h-10 w-full rounded-xl border border-stone-200 bg-[#faf8f5] px-3.5 text-xs sm:text-lg lg:text-sm text-stone-900 placeholder-slate-500 focus:border-[#c4431d] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs sm:text-lg lg:text-sm font-bold text-stone-600 block">Sales Amount (₹ optional)</label>
                  <input
                    type="number"
                    placeholder="e.g. 4500"
                    value={editForm.salesAmount}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, salesAmount: e.target.value }))}
                    className="flex h-10 sm:h-12 lg:h-10 w-full rounded-xl border border-stone-200 bg-[#faf8f5] px-3.5 text-xs sm:text-lg lg:text-sm text-stone-900 placeholder-slate-500 focus:border-[#c4431d] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs sm:text-lg lg:text-sm font-bold text-stone-600 block">Technique Used</label>
                  <input
                    type="text"
                    placeholder="e.g. Ocean Wave Lacing"
                    value={editForm.technique}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, technique: e.target.value }))}
                    className="flex h-10 sm:h-12 lg:h-10 w-full rounded-xl border border-stone-200 bg-[#faf8f5] px-3.5 text-xs sm:text-lg lg:text-sm text-stone-900 placeholder-slate-500 focus:border-[#c4431d] focus:outline-none"
                  />
                </div>
              </div>

              {/* Browser File Upload & URL input */}
              <div className="space-y-1.5">
                <label className="text-xs sm:text-lg lg:text-sm font-bold text-stone-600 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Image size={14} className="text-[#942008]" /> Upload File (Image, Video, Document)
                  </span>
                  <span className="text-xs sm:text-base lg:text-xs text-slate-500 font-normal">Browser File Picker</span>
                </label>

                <div className="flex flex-col gap-2">
                  <label className="relative w-full">
                    <input
                      type="file"
                      accept="image/*,video/*,.pdf,.doc,.docx"
                      onChange={handleEditFileBrowserSelect}
                      disabled={uploadingEditFile}
                      className="w-full text-xs sm:text-base lg:text-xs text-stone-600 file:mr-3 file:py-1.5 sm:file:py-2.5 file:px-3 sm:file:px-4 file:rounded-lg file:border-0 file:text-xs sm:file:text-base lg:file:text-xs file:font-bold file:bg-[#fde5d6] file:text-[#942008] hover:file:bg-[#fde5d6]/80 cursor-pointer bg-[#faf8f5] border border-stone-200 rounded-xl p-1 disabled:opacity-50"
                    />
                    {uploadingEditFile && (
                      <span className="absolute inset-0 flex items-center justify-center bg-[#faf8f5]/80 rounded-xl text-xs sm:text-base lg:text-xs font-bold text-[#942008]">
                        ⏳ Uploading file...
                      </span>
                    )}
                  </label>

                  <input
                    type="text"
                    placeholder="Or paste external file / image URL..."
                    value={editForm.imageUrl}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, imageUrl: e.target.value }))}
                    className="flex h-9 sm:h-11 lg:h-9 w-full rounded-xl border border-stone-200 bg-[#faf8f5] px-3 text-xs sm:text-lg lg:text-sm text-stone-900 placeholder-slate-500 focus:border-[#c4431d] focus:outline-none"
                  />
                </div>

                {/* Preview — shows current media or newly uploaded media */}
                {editForm.imageUrl && (
                  <div className="mt-2 p-2 rounded-xl bg-[#faf8f5] border border-stone-200 relative">
                    <button
                      type="button"
                      onClick={() => setEditForm((prev) => ({ ...prev, imageUrl: '' }))}
                      className="absolute right-2 top-2 bg-white text-stone-500 hover:text-stone-900 p-1 rounded-lg z-10 shadow-xs cursor-pointer"
                      title="Remove media"
                    >
                      <X size={12} />
                    </button>

                    {editForm.imageUrl.match(/\.(jpeg|jpg|gif|png|webp|svg)$/i) || (editForm.imageUrl.includes('cloudinary') && !editForm.imageUrl.includes('/video/')) ? (
                      <img src={getMediaUrl(editForm.imageUrl)} alt="Preview" className="max-h-36 sm:max-h-48 lg:max-h-36 rounded-lg w-full object-cover" />
                    ) : editForm.imageUrl.match(/\.(mp4|webm|mov|m4v|avi|mkv)$/i) || editForm.imageUrl.includes('/uploads/videos/') || editForm.imageUrl.includes('/video/upload/') || editForm.imageUrl.startsWith('data:video') ? (
                      <video src={getMediaUrl(editForm.imageUrl)} controls className="max-h-36 sm:max-h-48 lg:max-h-36 rounded-lg w-full object-contain bg-black" />
                    ) : editForm.imageUrl.startsWith('http') ? (
                      <div className="p-3 text-xs sm:text-base lg:text-sm font-bold text-cyan-600 flex items-center gap-2">
                        🔗 External link attached
                      </div>
                    ) : (
                      <div className="p-3 text-xs sm:text-base lg:text-sm font-bold text-emerald-600 flex items-center gap-2">
                        ✅ File uploaded successfully!
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-xs sm:text-lg lg:text-sm font-bold text-stone-600 block">Story / Reflection</label>
                <textarea
                  rows={2}
                  placeholder="How did you achieve this? What did you learn?"
                  value={editForm.notes}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, notes: e.target.value }))}
                  className="flex w-full rounded-xl border border-stone-200 bg-[#faf8f5] p-3 text-xs sm:text-lg lg:text-sm text-stone-900 placeholder-slate-500 focus:border-[#c4431d] focus:outline-none resize-none"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  disabled={savingEdit || uploadingEditFile}
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#942008] via-[#c4431d] to-[#ea580c] hover:opacity-95 text-white font-bold text-xs sm:text-base lg:text-xs h-10 sm:h-12 lg:h-10 rounded-xl shadow-md hover:scale-[1.02] transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {(savingEdit || uploadingEditFile) && <Loader2 size={14} className="animate-spin" />}
                  {savingEdit ? 'Saving Changes...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={() => setEditingPost(null)}
                  disabled={savingEdit || uploadingEditFile}
                  className="border border-stone-300 shimmer-box text-stone-600 font-semibold text-xs sm:text-base lg:text-xs h-10 sm:h-12 lg:h-10 px-4 rounded-xl cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
