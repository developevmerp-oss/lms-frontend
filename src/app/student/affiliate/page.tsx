"use client";

import React, { useState, useEffect } from 'react';
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
  const [mounted, setMounted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [coursePrice, setCoursePrice] = useState(4999);

  useEffect(() => {
    setMounted(true);
  }, []);

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
    <div
      className="min-h-screen bg-[#faf8f5] text-stone-900 selection:bg-[#c4431d] selection:text-stone-900 transition-colors lg:pl-64"
      style={{
        backgroundColor: "#faf8f5",
        backgroundImage: "radial-gradient(circle, #e2ded4 1.5px, transparent 1.5px)",
        backgroundSize: "24px 24px",
        backgroundAttachment: "fixed",
      }}
    >
      <StudentNav user={user} level="Affiliate Partner" points={0} logout={logout} />

      <main className="w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
        {!mounted || !user ? (
          <div className="space-y-8">
            {/* Header Skeleton */}
            <div className="bg-white/95 border border-[#ecdccb] rounded-3xl p-6 md:p-8 space-y-3">
              <div className="w-36 h-4 rounded shimmer-box" />
              <div className="w-3/4 h-8 rounded-lg shimmer-box" />
              <div className="w-1/2 h-4 rounded shimmer-box" />
            </div>

            {/* Referral Link Skeleton */}
            <div className="bg-white/95 border border-[#ecdccb] rounded-3xl p-6 md:p-8 space-y-4">
              <div className="w-48 h-6 rounded-lg shimmer-box" />
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 h-12 rounded-2xl shimmer-box" />
                <div className="w-36 h-12 rounded-2xl shimmer-box" />
                <div className="w-44 h-12 rounded-2xl shimmer-box" />
              </div>
            </div>

            {/* Commission Stats Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-white/95 border border-[#ecdccb] rounded-2xl p-6 space-y-3">
                  <div className="w-10 h-10 rounded-xl shimmer-box" />
                  <div className="w-28 h-3 rounded shimmer-box" />
                  <div className="w-24 h-7 rounded-lg shimmer-box" />
                  <div className="w-48 h-3 rounded shimmer-box" />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
        {/* Header */}
        {/*
        <div className="bg-white/95 border border-[#ecdccb] rounded-3xl p-6 md:p-8 shadow-[0_10px_30px_-12px_rgba(90,55,20,0.08)]">
          <div className="flex items-center gap-1.5 text-xs text-stone-500 mb-1 font-medium">
            <span>Student Hub</span>
            <span className="text-stone-300">/</span>
            <span className="text-stone-700 font-medium">Partner &amp; Affiliate Program</span>
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-stone-900 tracking-tight">
            Earn 20% Net Commission for Every Enrolled Creator
          </h1>
          <p className="text-stone-500 text-xs sm:text-sm mt-0.5 max-w-2xl leading-relaxed">
            Share your authentic resin art transformation with your followers and friends. When someone enrolls through your link, you earn a 20% net commission on the course fee.
          </p>
        </div>
        */}

        {/* Unique Link Box */}
        <div className="bg-white/95 border border-[#ecdccb] shadow-[0_10px_30px_-12px_rgba(90,55,20,0.08)] rounded-3xl p-6 md:p-8 shadow-xl space-y-4">
          <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
            <Share2 className="text-[#c4431d]" size={18} /> Your Unique Referral Link
          </h2>

          <div className="flex flex-col sm:flex-row gap-3 items-stretch">
            <div className="flex-1 bg-[#faf8f5] border border-stone-200 rounded-2xl px-4 py-3 text-sm text-stone-600 font-mono flex items-center justify-between overflow-hidden">
              <span className="truncate">{referralUrl}</span>
            </div>
            <button
              onClick={copyToClipboard}
              className="px-6 py-3 bg-gradient-to-r from-[#942008] via-[#c4431d] to-[#ea580c] hover:opacity-95 text-white font-bold text-xs rounded-2xl transition-all shadow-md shadow-[#c4431d]/20 flex items-center justify-center gap-2 cursor-pointer shrink-0"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? 'Link Copied!' : 'Copy Link'}
            </button>
            <a
              href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`Hey! I'm learning professional Resin Art with Ravishing Art Hub. Register for the free live masterclass here: ${referralUrl}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-stone-900 font-bold text-xs rounded-2xl transition-all flex items-center justify-center gap-2 shrink-0"
            >
              <MessageCircle size={16} /> Share on WhatsApp
            </a>
          </div>

          <p className="text-xs text-slate-500">
            Referral Code: <strong className="text-[#942008]">{referralCode}</strong> · Cookies valid for 60 days.
          </p>
        </div>

        {/* Commission Calculator */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/95 border border-[#ecdccb] shadow-[0_10px_30px_-12px_rgba(90,55,20,0.08)] rounded-2xl p-6 shadow-xl space-y-2">
            <div className="w-10 h-10 rounded-xl bg-[#fde5d6] text-[#942008] flex items-center justify-center">
              <Percent size={20} />
            </div>
            <p className="text-xs text-stone-500 font-bold uppercase">Commission Rate</p>
            <p className="text-3xl font-black text-stone-900">20% Net</p>
            <p className="text-xs text-slate-500">After GST (18%) and gateway charges deduction.</p>
          </div>

          <div className="bg-white/95 border border-[#ecdccb] shadow-[0_10px_30px_-12px_rgba(90,55,20,0.08)] rounded-2xl p-6 shadow-xl space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <DollarSign size={20} />
            </div>
            <p className="text-xs text-stone-500 font-bold uppercase">Per Sale Earnings</p>
            <p className="text-3xl font-black text-emerald-400">₹{estimatedCommission.toLocaleString('en-IN')}</p>
            <p className="text-xs text-slate-500">Estimated payout per student enrollment.</p>
          </div>

          <div className="bg-white/95 border border-[#ecdccb] shadow-[0_10px_30px_-12px_rgba(90,55,20,0.08)] rounded-2xl p-6 shadow-xl space-y-2">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <ShieldCheck size={20} />
            </div>
            <p className="text-xs text-stone-500 font-bold uppercase">Payout Schedule</p>
            <p className="text-3xl font-black text-stone-900">Monthly</p>
            <p className="text-xs text-slate-500">Transferred directly via UPI / Bank account.</p>
          </div>
        </div>

        {/* Partner Guidelines */}
        <div className="bg-white/95 border border-stone-200 rounded-3xl p-6 md:p-8 space-y-4">
          <h3 className="text-base font-bold text-stone-900">How It Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-stone-600">
            <div className="bg-[#faf8f5] p-4 rounded-2xl border border-stone-200 space-y-2">
              <span className="w-6 h-6 rounded-lg bg-[#fde5d6] text-[#942008] font-bold flex items-center justify-center">1</span>
              <p className="font-bold text-stone-900">Share Your Link</p>
              <p className="text-stone-500">Post your referral link on Instagram stories, YouTube descriptions, or WhatsApp groups.</p>
            </div>
            <div className="bg-[#faf8f5] p-4 rounded-2xl border border-stone-200 space-y-2">
              <span className="w-6 h-6 rounded-lg bg-[#fde5d6] text-[#942008] font-bold flex items-center justify-center">2</span>
              <p className="font-bold text-stone-900">Creator Registers</p>
              <p className="text-stone-500">When your referral signs up and completes their course enrollment, the commission is tagged to your account.</p>
            </div>
            <div className="bg-[#faf8f5] p-4 rounded-2xl border border-stone-200 space-y-2">
              <span className="w-6 h-6 rounded-lg bg-[#fde5d6] text-[#942008] font-bold flex items-center justify-center">3</span>
              <p className="font-bold text-stone-900">Get Paid</p>
              <p className="text-stone-500">Receive monthly commission payouts automatically into your verified bank account.</p>
            </div>
          </div>
        </div>
          </>
        )}
      </main>
    </div>
  );
}
