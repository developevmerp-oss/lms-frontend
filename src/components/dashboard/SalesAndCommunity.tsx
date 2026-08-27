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
    <div className="w-full">
      {/* Sales Chart */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="w-full bg-slate-900 border border-slate-800 p-6 rounded-3xl flex flex-col shadow-xl"
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
    </div>
  );
};
