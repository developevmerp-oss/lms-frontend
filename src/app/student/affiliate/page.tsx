"use client";

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { StudentNav } from '@/components/layout/StudentNav';
import { 
  Share2, 
  Copy, 
  Check, 
  DollarSign, 
  Users, 
  TrendingUp, 
  Percent, 
  ShieldCheck, 
  ExternalLink,
  MessageCircle,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export default function StudentAffiliatePage() {
  const { user, logout } = useAuth();
  const [copied, setCopied] = useState(false);
  const [coursePrice, setCoursePrice] = useState(4999);

  // Student referral code/link
  const referralCode = user?.id ? `RAH-${user.id.slice(0, 6).toUpperCase()}` : 'RAH-VIP';
  const referralUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/webinar?ref=${referralCode}`
    : `https://ravishingarthub.com/webinar?ref=${referralCode}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Commission math (Point 13: 20% after GST and platform charges)
  const gstRate = 0.18;
  const platformFeeRate = 0.03; // ~3% gateway/platform fee
  const netCourseAmount = Math.round(coursePrice / (1 + gstRate) * (1 - platformFeeRate));
  const estimatedCommission = Math.round(netCourseAmount * 0.20);

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-orange-500 selection:text-white">
      <StudentNav user={user} level="Affiliate Partner" points={0} logout={logout} />

      <main className="max-w-5xl mx-auto p-4 md:p-8 space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500/20 via-amber-500/10 to-slate-900 border border-orange-500/30 rounded-3xl p-6 md:p-10 shadow-2xl space-y-4">
          <div className="inline-flex items-center gap-2 bg-orange-500/20 text-orange-400 text-xs font-black uppercase tracking-wider px-3.5 py-1 rounded-full border border-orange-500/30">
            <Sparkles size={14} /> Partner &amp; Affiliate Program
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white">
            Earn 20% Net Commission for Every Enrolled Creator
          </h1>
          <p className="text-slate-300 text-sm md:text-base max-w-2xl leading-relaxed">
            Share your authentic resin art transformation with your followers and friends. When someone enrolls through your link, you earn a 20% net commission on the course fee.
          </p>
        </div>

        {/* Unique Link Box */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Share2 className="text-orange-500" size={18} /> Your Unique Referral Link
          </h2>

          <div className="flex flex-col sm:flex-row gap-3 items-stretch">
            <div className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-sm text-slate-300 font-mono flex items-center justify-between overflow-hidden">
              <span className="truncate">{referralUrl}</span>
            </div>
            <button
              onClick={copyToClipboard}
              className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-slate-950 font-black text-xs rounded-2xl transition-all shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2 cursor-pointer shrink-0"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? 'Link Copied!' : 'Copy Link'}
            </button>
            <a
              href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`Hey! I'm learning professional Resin Art with Ravishing Art Hub. Register for the free live masterclass here: ${referralUrl}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-2xl transition-all flex items-center justify-center gap-2 shrink-0"
            >
              <MessageCircle size={16} /> Share on WhatsApp
            </a>
          </div>

          <p className="text-xs text-slate-500">
            Referral Code: <strong className="text-orange-400">{referralCode}</strong> · Cookies valid for 60 days.
          </p>
        </div>

        {/* Commission Calculator */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-2">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center">
              <Percent size={20} />
            </div>
            <p className="text-xs text-slate-400 font-bold uppercase">Commission Rate</p>
            <p className="text-3xl font-black text-white">20% Net</p>
            <p className="text-[11px] text-slate-500">After GST (18%) and gateway charges deduction.</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <DollarSign size={20} />
            </div>
            <p className="text-xs text-slate-400 font-bold uppercase">Per Sale Earnings</p>
            <p className="text-3xl font-black text-emerald-400">₹{estimatedCommission.toLocaleString('en-IN')}</p>
            <p className="text-[11px] text-slate-500">Estimated payout per student enrollment.</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-2">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <ShieldCheck size={20} />
            </div>
            <p className="text-xs text-slate-400 font-bold uppercase">Payout Schedule</p>
            <p className="text-3xl font-black text-white">Monthly</p>
            <p className="text-[11px] text-slate-500">Transferred directly via UPI / Bank account.</p>
          </div>
        </div>

        {/* Partner Guidelines */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-4">
          <h3 className="text-base font-bold text-white">How It Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300">
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
              <span className="w-6 h-6 rounded-lg bg-orange-500/10 text-orange-400 font-bold flex items-center justify-center">1</span>
              <p className="font-bold text-white">Share Your Link</p>
              <p className="text-slate-400">Post your referral link on Instagram stories, YouTube descriptions, or WhatsApp groups.</p>
            </div>
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
              <span className="w-6 h-6 rounded-lg bg-orange-500/10 text-orange-400 font-bold flex items-center justify-center">2</span>
              <p className="font-bold text-white">Creator Registers</p>
              <p className="text-slate-400">When your referral signs up and completes their course enrollment, the commission is tagged to your account.</p>
            </div>
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
              <span className="w-6 h-6 rounded-lg bg-orange-500/10 text-orange-400 font-bold flex items-center justify-center">3</span>
              <p className="font-bold text-white">Get Paid</p>
              <p className="text-slate-400">Receive monthly commission payouts automatically into your verified bank account.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
