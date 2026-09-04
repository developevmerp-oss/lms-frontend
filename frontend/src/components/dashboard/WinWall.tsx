"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Sparkles, Plus, CheckCircle2, ChevronRight, X, DollarSign, Award, Flame, MessageCircle, Image, Send, Heart, Gem } from 'lucide-react';
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
}: {
  communityWins?: any[];
  onWinAdded?: () => void;
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
  const [posting, setPosting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const currentLevel = (user?.membershipLevel || 'L0').toUpperCase();
  const isL3Diamond = currentLevel === 'L3' || currentLevel.includes('DIAMOND') || currentLevel.includes('RENAISSANCE') || (user?.rank || '').toUpperCase().includes('DIAMOND');
  const canPost = currentLevel !== 'L0'; // L0 Fast Track students can ONLY VIEW feed; L1, L2, L3 can post!

  // Keep synced with parent props
  React.useEffect(() => {
    if (communityWins && communityWins.length > 0) {
      setWins(communityWins);
    }
  }, [communityWins]);

  const handleFileBrowserSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setWinForm((prev) => ({
          ...prev,
          imageUrl: event.target?.result as string,
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handlePostWin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!winForm.title) return;

    setPosting(true);
    setSuccessMsg('');

    const token = localStorage.getItem('token');
    try {
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
        setSuccessMsg(data.message || (isL3Diamond ? '🎉 Win published! +100 XP awarded to your Diamond profile!' : '🎉 Win published to Community Feed!'));
        setWinForm({ title: '', salesAmount: '', technique: '', notes: '', imageUrl: '' });
        setTimeout(() => {
          setIsModalOpen(false);
          setSuccessMsg('');
          if (onWinAdded) onWinAdded();
        }, 1800);
      }
    } catch (_) {}
    setPosting(false);
  };

  const handleAddComment = async (winId: string) => {
    const text = commentText[winId];
    if (!text || !text.trim()) return;

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

  const displayWins: WinItem[] = wins.map((w, idx) => ({
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

  return (
    <>
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between h-full space-y-4"
      >
        <div>
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Trophy size={16} />
              </div>
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-1.5">
                  Community Win Feed
                </h2>
                <p className="text-[11px] text-slate-400">Live sisterhood sales, photos &amp; comments</p>
              </div>
            </div>

            {canPost ? (
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-1.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-black text-xs px-3 py-1.5 rounded-xl shadow-md transition-all hover:scale-105 cursor-pointer"
              >
                <Plus size={13} /> Post a Win {isL3Diamond && '(+100 XP)'}
              </button>
            ) : (
              <span className="text-[10px] font-bold text-slate-400 bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-xl flex items-center gap-1 cursor-default" title="L0 Fast Track Members can view all posts from students & admin. Upgrade to L1 to post!">
                🔒 View Only Mode
              </span>
            )}
          </div>

          {/* Wins Feed */}
          <div className="space-y-4 pr-1">
            {displayWins.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-500">
                Be the first to share a win today!
              </div>
            ) : (
              displayWins.map((win) => {
                const isExpanded = expandedCommentsId === win.id;

                return (
                  <div
                    key={win.id}
                    className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800/80 hover:border-slate-700 transition-colors space-y-2 text-xs"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0 space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white truncate">{win.studentName}</span>
                          <span className="text-[10px] text-slate-400">· {win.timeAgo}</span>
                        </div>
                        <p className="text-slate-300 text-[11px] leading-relaxed">
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
                                    className="text-orange-400 font-bold underline hover:text-orange-300 break-all inline-flex items-center gap-0.5 ml-1"
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
                      </div>
                      {win.amount && (
                        <span className="font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md text-[11px] shrink-0 font-mono">
                          {win.amount}
                        </span>
                      )}
                    </div>

                    {/* Attached Photo / Video / Document / YouTube / External Link */}
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
                          <div className="mt-2 rounded-2xl overflow-hidden border border-slate-800 bg-black aspect-video shadow-lg">
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

                      const isVideo = mediaUrl.startsWith('data:video') || /\.(mp4|webm|mov|m4v|avi)$/i.test(mediaUrl);
                      const isDoc = mediaUrl.startsWith('data:application') || /\.(pdf|doc|docx|zip|rar)$/i.test(mediaUrl);
                      const isWebUrl = mediaUrl.startsWith('http://') || mediaUrl.startsWith('https://');
                      const isDirectImage = mediaUrl.startsWith('data:image') || /\.(jpeg|jpg|gif|png|webp|svg)$/i.test(mediaUrl) || mediaUrl.includes('unsplash.com') || mediaUrl.includes('cloudinary');

                      if (isVideo) {
                        return (
                          <div className="rounded-2xl overflow-hidden border border-slate-800 bg-black mt-2 shadow-lg">
                            <video src={mediaUrl} controls className="w-full max-h-64 object-contain bg-black" />
                          </div>
                        );
                      }

                      if (isDoc) {
                        return (
                          <div className="mt-2 p-3 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-950 border border-slate-800 flex items-center justify-between gap-3 shadow-md">
                            <div className="flex items-center gap-2.5 overflow-hidden">
                              <div className="w-8 h-8 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400 font-bold shrink-0 text-sm">
                                📄
                              </div>
                              <div className="truncate">
                                <p className="text-xs font-bold text-white truncate">Attached Document / File</p>
                                <p className="text-[10px] text-slate-400">Click to download or view</p>
                              </div>
                            </div>
                            <a
                              href={mediaUrl}
                              download="community-file"
                              target="_blank"
                              rel="noreferrer"
                              className="px-3 py-1 rounded-xl bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/40 text-orange-300 text-[11px] font-bold transition-all shrink-0"
                            >
                              Download File
                            </a>
                          </div>
                        );
                      }

                      if (isWebUrl && !isDirectImage) {
                        return (
                          <div className="mt-2 p-3 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between gap-3 shadow-md">
                            <div className="flex items-center gap-2.5 overflow-hidden min-w-0">
                              <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold shrink-0 text-sm">
                                🔗
                              </div>
                              <div className="truncate min-w-0">
                                <p className="text-xs font-bold text-white truncate">External Link Attachment</p>
                                <p className="text-[10px] text-slate-400 truncate">{mediaUrl}</p>
                              </div>
                            </div>
                            <a
                              href={mediaUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="px-3 py-1 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 text-[11px] font-bold transition-all shrink-0 flex items-center gap-1"
                            >
                              Open Link ↗
                            </a>
                          </div>
                        );
                      }

                      return (
                        <div className="rounded-2xl overflow-hidden border border-slate-800/80 bg-slate-950 mt-2 max-h-80 shadow-lg">
                          <img src={mediaUrl} alt="Post attachment" className="w-full h-full max-h-80 object-cover hover:scale-102 transition-transform duration-300" />
                        </div>
                      );
                    })()}

                    {/* Like & Comment Bar */}
                    <div className="flex items-center justify-between pt-1 border-t border-slate-900 text-[11px] text-slate-400">
                      <button
                        type="button"
                        onClick={() => handleLike(win.id)}
                        className="flex items-center gap-1 hover:text-rose-400 transition-colors cursor-pointer"
                      >
                        <Heart size={12} className={win.likes ? 'text-rose-500 fill-rose-500' : ''} />
                        <span>{win.likes || 0} Likes</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setExpandedCommentsId(isExpanded ? null : win.id)}
                        className="flex items-center gap-1 hover:text-orange-400 transition-colors cursor-pointer"
                      >
                        <MessageCircle size={12} />
                        <span>{win.comments?.length || 0} Comments</span>
                      </button>
                    </div>

                    {/* Comments Section */}
                    {isExpanded && (
                      <div className="pt-2 space-y-2 border-t border-slate-900/80">
                        {win.comments && win.comments.length > 0 ? (
                          <div className="space-y-1.5 max-h-32 overflow-y-auto">
                            {win.comments.map((c, i) => (
                              <div key={i} className="bg-slate-900/60 p-2 rounded-xl text-[11px]">
                                <span className="font-bold text-orange-400 mr-1.5">{c.author}:</span>
                                <span className="text-slate-300">{c.text}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-[10px] text-slate-500">No comments yet. Say congratulations!</p>
                        )}

                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Write a supportive comment..."
                            value={commentText[win.id] || ''}
                            onChange={(e) => setCommentText({ ...commentText, [win.id]: e.target.value })}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddComment(win.id)}
                            className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-[11px] text-white focus:outline-none focus:border-orange-500"
                          />
                          <button
                            type="button"
                            onClick={() => handleAddComment(win.id)}
                            disabled={commenting}
                            className="px-2.5 py-1 bg-orange-500 text-slate-950 rounded-lg font-bold text-[11px] hover:bg-orange-600 transition-colors cursor-pointer shrink-0"
                          >
                            <Send size={11} />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1">
            <Gem size={12} className="text-cyan-400" /> Only L3 Diamond earns XP
          </span>
          <span className="flex items-center gap-1 text-orange-400 font-semibold">
            <Flame size={13} /> Active Sisterhood
          </span>
        </div>
      </motion.div>

      {/* Post Win Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-md rounded-3xl border border-orange-500/30 bg-slate-900 p-6 sm:p-7 shadow-2xl text-white">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-white"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400">
                <Trophy size={18} />
              </div>
              <div>
                <h3 className="text-lg font-black text-white">Post Your Win on the Feed</h3>
                <p className="text-xs text-slate-400">
                  {isL3Diamond
                    ? '💎 Diamond Club (L3): Earn +100 XP on win posts!'
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
                  <label className="text-xs font-bold text-slate-300">Win / Milestone Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sold my first 3D Geode Wall Clock!"
                    value={winForm.title}
                    onChange={(e) => setWinForm({ ...winForm, title: e.target.value })}
                    className="flex h-10 w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 text-xs text-white placeholder-slate-500 focus:border-orange-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300">Sales Amount (₹ optional)</label>
                    <input
                      type="number"
                      placeholder="e.g. 4500"
                      value={winForm.salesAmount}
                      onChange={(e) => setWinForm({ ...winForm, salesAmount: e.target.value })}
                      className="flex h-10 w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 text-xs text-white placeholder-slate-500 focus:border-orange-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300">Technique Used</label>
                    <input
                      type="text"
                      placeholder="e.g. Ocean Wave Lacing"
                      value={winForm.technique}
                      onChange={(e) => setWinForm({ ...winForm, technique: e.target.value })}
                      className="flex h-10 w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 text-xs text-white placeholder-slate-500 focus:border-orange-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Browser File Upload & URL input */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Image size={13} className="text-orange-400" /> Upload File (Image, Video, Document)
                    </span>
                    <span className="text-[10px] text-slate-500 font-normal">Browser File Picker</span>
                  </label>

                  <div className="flex flex-col gap-2">
                    <input
                      type="file"
                      accept="image/*,video/*,.pdf,.doc,.docx"
                      onChange={handleFileBrowserSelect}
                      className="w-full text-xs text-slate-300 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-orange-500/20 file:text-orange-400 hover:file:bg-orange-500/30 cursor-pointer bg-slate-950 border border-slate-800 rounded-xl p-1"
                    />

                    <input
                      type="text"
                      placeholder="Or paste external file / image URL..."
                      value={winForm.imageUrl}
                      onChange={(e) => setWinForm({ ...winForm, imageUrl: e.target.value })}
                      className="flex h-9 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 text-xs text-white placeholder-slate-500 focus:border-orange-500 focus:outline-none"
                    />
                  </div>

                  {/* File Preview */}
                  {winForm.imageUrl && (
                    <div className="mt-2 p-2 rounded-xl bg-slate-950 border border-slate-800 relative">
                      <button
                        type="button"
                        onClick={() => setWinForm({ ...winForm, imageUrl: '' })}
                        className="absolute right-2 top-2 bg-slate-900 text-slate-400 hover:text-white p-1 rounded-lg z-10"
                      >
                        <X size={12} />
                      </button>

                      {winForm.imageUrl.startsWith('data:video') || winForm.imageUrl.match(/\.(mp4|webm|mov)$/i) ? (
                        <video src={winForm.imageUrl} controls className="max-h-36 rounded-lg w-full object-cover" />
                      ) : winForm.imageUrl.startsWith('data:image') || winForm.imageUrl.match(/\.(jpeg|jpg|gif|png|webp)$/i) || winForm.imageUrl.startsWith('data:') ? (
                        <img src={winForm.imageUrl} alt="Upload preview" className="max-h-36 rounded-lg w-full object-cover" />
                      ) : (
                        <div className="p-3 text-xs font-bold text-orange-400 flex items-center gap-2">
                          📄 Document / File attached successfully!
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Story / Reflection</label>
                  <textarea
                    rows={2}
                    placeholder="How did you achieve this? What did you learn?"
                    value={winForm.notes}
                    onChange={(e) => setWinForm({ ...winForm, notes: e.target.value })}
                    className="flex w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs text-white placeholder-slate-500 focus:border-orange-500 focus:outline-none resize-none"
                  />
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={posting}
                    className="flex-1 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-black text-xs h-10 rounded-xl shadow-md hover:scale-105 transition-all cursor-pointer"
                  >
                    {posting ? 'Publishing...' : `Publish Win ${isL3Diamond ? '(+100 XP)' : ''}`}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="border border-slate-700 bg-slate-800 text-slate-300 font-semibold text-xs h-10 px-4 rounded-xl cursor-pointer"
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
