"use client";

import React, { useState } from 'react';
import { TrendingUp, Users, Trophy, Heart, ArrowUpRight, MessageSquare, ThumbsUp, Send } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { API_BASE_URL } from "@/config/api";

interface SalesRecord {
  id?: string;
  amount: number;
  productName?: string;
  date?: string;
}

interface SalesAndCommunityProps {
  sales?: SalesRecord[];
  communityWins?: any[];
  onInteract?: () => void;
}

export const SalesAndCommunity = ({ sales, communityWins, onInteract }: SalesAndCommunityProps) => {
  const { token } = useAuth();
  const activeSales = sales || [];
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isSharingWin, setIsSharingWin] = useState(false);
  const [newWinText, setNewWinText] = useState("");
  const [isPostingWin, setIsPostingWin] = useState(false);

  const displayWins = communityWins && communityWins.length > 0 ? communityWins : [
    { id: '1', studentName: 'Priya S.', achievement: 'Sold 5 custom geode coasters!', likes: 24, comments: [], timeAgo: '2h ago' },
    { id: '2', studentName: 'Amit P.', achievement: 'Finished the Explore Bootcamp.', likes: 12, comments: [], timeAgo: '5h ago' },
    { id: '3', studentName: 'Neha G.', achievement: 'First corporate order for 50 clocks.', likes: 89, comments: [], timeAgo: '1d ago' },
  ];

  const handleLike = async (winId: string) => {
    if (!token || !winId || winId.length < 10) return; // ignore mock data
    try {
      await fetch(`${API_BASE_URL}/dashboard/community-wins/${winId}/like`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (onInteract) onInteract();
    } catch (err) {
      console.error('Error liking:', err);
    }
  };

  const submitReply = async (winId: string) => {
    if (!token || !winId || winId.length < 10 || !replyText.trim()) return;
    setIsSubmitting(true);
    try {
      await fetch(`${API_BASE_URL}/dashboard/community-wins/${winId}/comment`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: replyText })
      });
      setReplyText("");
      setActiveReplyId(null);
      if (onInteract) onInteract();
    } catch (err) {
      console.error('Error commenting:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitNewWin = async () => {
    if (!token || !newWinText.trim()) return;
    setIsPostingWin(true);
    try {
      await fetch(`${API_BASE_URL}/dashboard/community-wins`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ achievement: newWinText })
      });
      setNewWinText("");
      setIsSharingWin(false);
      if (onInteract) onInteract();
    } catch (err) {
      console.error('Error posting win:', err);
    } finally {
      setIsPostingWin(false);
    }
  };

  // Prepare chart data grouping by month
  const chartData = activeSales.reduce((acc: any[], s) => {
    const month = s.date ? new Date(s.date).toLocaleString('default', { month: 'short' }) : 'Now';
    const existing = acc.find(e => e.month === month);
    if (existing) {
      existing.sales += s.amount;
    } else {
      acc.push({ month, sales: s.amount });
    }
    return acc;
  }, []);

  const totalRevenue = activeSales.reduce((sum, s) => sum + s.amount, 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 h-full">
      {/* Sales Chart */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="lg:col-span-2 bg-slate-900 border border-slate-800 p-6 rounded-3xl flex flex-col shadow-xl"
      >
        <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
          <div className="flex items-center gap-2">
            <TrendingUp className="text-green-500" />
            <h2 className="text-lg md:text-xl font-bold text-white">Sales & Income</h2>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-400">Total Revenue</p>
            <p className="text-xl md:text-2xl font-black text-white">₹{totalRevenue.toLocaleString('en-IN')}</p>
          </div>
        </div>

        {chartData.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center min-h-[200px]">
            <TrendingUp size={40} className="text-slate-700 mb-3" />
            <p className="text-slate-400 font-medium">No sales recorded yet</p>
            <p className="text-slate-600 text-sm mt-1">Complete your first sale to see your revenue chart!</p>
          </div>
        ) : (
          <div className="flex-1 min-h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#475569" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value/1000}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px' }}
                  itemStyle={{ color: '#22c55e' }}
                  formatter={(value) => [`₹${Number(value).toLocaleString('en-IN')}`, 'Sales']}
                />
                <Area type="monotone" dataKey="sales" stroke="#22c55e" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Recent transactions */}
        {activeSales.length > 0 && (
          <div className="mt-4 pt-4 border-t border-slate-800">
            <h3 className="text-sm font-semibold text-slate-400 mb-3">Recent Transactions</h3>
            <div className="space-y-2">
              {activeSales.slice(-3).reverse().map((s, i) => (
                <div key={s.id || i} className="flex items-center justify-between">
                  <span className="text-sm text-slate-300">{s.productName || 'Product'}</span>
                  <span className="text-sm font-bold text-green-400">+₹{s.amount.toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>

      {/* Community Wins */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="lg:col-span-1 bg-slate-900 border border-slate-800 p-6 rounded-3xl flex flex-col shadow-xl"
      >
        <div className="flex items-center gap-2 mb-6">
          <Heart className="text-pink-400" />
          <h2 className="text-xl font-bold text-white">Win Wall</h2>
        </div>

        <div className="space-y-4 flex-1">
          {displayWins.map((win, i) => (
            <div key={i} className="bg-slate-800/50 border border-slate-700 p-4 rounded-2xl">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="text-sm font-bold text-blue-400">{win.studentName}</span>
                  <span className="text-xs text-slate-500 block">{win.timeAgo}</span>
                </div>
                {i === 0 && <Trophy size={16} className="text-yellow-400" />}
              </div>
              <p className="text-white text-sm font-medium mb-3">{win.achievement}</p>
              
              <div className="flex items-center gap-3 border-t border-slate-700 pt-3">
                <button 
                  onClick={() => handleLike(win.id)}
                  className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-pink-400 transition-colors"
                >
                  <ThumbsUp size={14} /> {win.likes || 0}
                </button>
                <button 
                  onClick={() => setActiveReplyId(activeReplyId === win.id ? null : win.id)}
                  className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-blue-400 transition-colors"
                >
                  <MessageSquare size={14} /> {win.comments?.length || 0} Reply
                </button>
              </div>

              {/* Comments Display */}
              {win.comments && win.comments.length > 0 && (
                <div className="mt-3 space-y-2">
                  {win.comments.map((comment: any, idx: number) => (
                    <div key={idx} className="bg-slate-800/80 rounded-xl p-2.5 text-xs">
                      <span className="font-bold text-blue-400 mr-2">{comment.author}:</span>
                      <span className="text-slate-300">{comment.text}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Reply Input Box */}
              {activeReplyId === win.id && (
                <div className="mt-3 flex items-center gap-2">
                  <input 
                    type="text" 
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type a supportive reply..." 
                    className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                    onKeyDown={(e) => { if(e.key === 'Enter') submitReply(win.id); }}
                  />
                  <button 
                    onClick={() => submitReply(win.id)}
                    disabled={isSubmitting || !replyText.trim()}
                    className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white p-2 rounded-lg transition-colors"
                  >
                    <Send size={14} />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
        
        {isSharingWin ? (
          <div className="mt-4 p-4 border border-slate-700 bg-slate-800/30 rounded-xl">
            <h3 className="text-sm font-bold text-white mb-2">What did you achieve?</h3>
            <textarea 
              value={newWinText}
              onChange={(e) => setNewWinText(e.target.value)}
              placeholder="e.g. Just sold my first resin coaster set!"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-pink-500 min-h-[80px] mb-3 resize-none"
            />
            <div className="flex gap-2 justify-end">
              <button 
                onClick={() => setIsSharingWin(false)}
                className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={submitNewWin}
                disabled={isPostingWin || !newWinText.trim()}
                className="bg-gradient-to-r from-orange-500 to-pink-500 hover:opacity-90 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2"
              >
                {isPostingWin ? 'Posting...' : 'Post Win'} <Send size={12} />
              </button>
            </div>
          </div>
        ) : (
          <button 
            onClick={() => setIsSharingWin(true)}
            className="mt-4 w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 rounded-xl transition-colors border border-slate-700 text-sm"
          >
            Share Your Win
          </button>
        )}
      </motion.div>
    </div>
  );
};
