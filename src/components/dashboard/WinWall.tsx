"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Sparkles, Plus, CheckCircle2, ChevronRight, X, DollarSign, Award, Flame } from 'lucide-react';
import { API_BASE_URL } from '@/config/api';

interface WinItem {
  id: string;
  studentName: string;
  studentLevel: string;
  title: string;
  amount?: string;
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
  const [wins, setWins] = useState<any[]>(communityWins);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [winForm, setWinForm] = useState({
    title: '',
    salesAmount: '',
    technique: '',
    notes: '',
  });
  const [posting, setPosting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Keep synced with parent props
  React.useEffect(() => {
    if (communityWins && communityWins.length > 0) {
      setWins(communityWins);
    }
  }, [communityWins]);

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
        }),
      });

      const data = await res.json();
      if (data.success && data.win) {
        setWins([data.win, ...wins]);
        setSuccessMsg('🎉 Win published! +50 XP awarded to your profile!');
        setWinForm({ title: '', salesAmount: '', technique: '', notes: '' });
        setTimeout(() => {
          setIsModalOpen(false);
          setSuccessMsg('');
          if (onWinAdded) onWinAdded();
        }, 1500);
      }
    } catch (_) {}
    setPosting(false);
  };

  const displayWins: WinItem[] = wins.map((w, idx) => ({
    id: w.id || String(idx),
    studentName: w.studentName || w.userName || 'Fellow Artist',
    studentLevel: w.level || 'L1 Member',
    title: w.achievement || w.title || 'Achieved a new breakthrough!',
    amount: w.salesAmount ? `₹${Number(w.salesAmount).toLocaleString('en-IN')}` : undefined,
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
                  Community Win Wall
                </h2>
                <p className="text-[11px] text-slate-400">Live student sales &amp; milestones</p>
              </div>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-1.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-black text-xs px-3 py-1.5 rounded-xl shadow-md transition-all hover:scale-105 cursor-pointer"
            >
              <Plus size={13} /> Post a Win (+50 XP)
            </button>
          </div>

          {/* Wins Feed */}
          <div className="space-y-2.5 max-h-[340px] overflow-y-auto pr-1">
            {displayWins.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-500">
                Be the first to share a win today!
              </div>
            ) : (
              displayWins.map((win) => (
                <div
                  key={win.id}
                  className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800/80 hover:border-slate-700 transition-colors flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex-1 min-w-0 space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white truncate">{win.studentName}</span>
                      <span className="text-[10px] text-slate-400">· {win.timeAgo}</span>
                    </div>
                    <p className="text-slate-300 text-[11px] leading-relaxed line-clamp-2">{win.title}</p>
                  </div>
                  {win.amount && (
                    <span className="font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md text-[11px] shrink-0">
                      {win.amount}
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <span>Celebrating all L0 to L3 achievements</span>
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
                <p className="text-xs text-slate-400">Share your milestone &amp; earn +50 XP!</p>
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
                    {posting ? 'Publishing...' : 'Publish Win (+50 XP)'}
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
