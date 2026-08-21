"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { BrandLogo } from "@/components/ui/BrandLogo";
import {
  CheckCircle2,
  Calendar,
  Sparkles,
  ArrowRight,
  ExternalLink,
  MessageCircle,
  Mail,
  Clock,
  ShieldCheck,
  Download
} from "lucide-react";

export default function WebinarThankYouPage() {
  const [lead, setLead] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = sessionStorage.getItem("webinar_lead");
      if (saved) {
        try {
          setLead(JSON.parse(saved));
        } catch (_) {}
      }
    }
  }, []);

  const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    "Resin Mastery Masterclass with Vrajangna Patel"
  )}&dates=20260823T143000Z/20260823T160000Z&details=${encodeURIComponent(
    "Live Resin Mastery Masterclass: 3 Secrets to Building a ₹3L/Mo Resin Art Business. Check your email for Zoom link!"
  )}&location=${encodeURIComponent("Zoom Live")}`;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-orange-500 selection:text-white relative">
      {/* Glow Blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[10%] left-[20%] w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-[20%] right-[15%] w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[140px]" />
      </div>

      {/* Header */}
      <header className="border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-xl py-4 px-6 relative z-10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <BrandLogo href="/" size="md" />
          <Link
            href="/"
            className="text-xs text-slate-400 hover:text-white transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12 relative z-10">
        {/* Success Banner */}
        <div className="text-center space-y-4 mb-10">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400 shadow-xl shadow-emerald-500/20">
            <CheckCircle2 size={36} />
          </div>

          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full">
            <Sparkles size={13} /> Registration Confirmed
          </div>

          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">
            You're In{lead?.name ? `, ${lead.name.split(" ")[0]}!` : "!"} Your Free Seat Is Reserved.
          </h1>

          <p className="text-slate-300 text-base md:text-lg max-w-xl mx-auto leading-relaxed">
            Please complete the <strong className="text-orange-400">3 simple action steps below</strong> to make sure you receive the Zoom link, pre-class worksheets, and calendar alerts.
          </p>
        </div>

        {/* 3 ACTION STEPS */}
        <div className="space-y-6 mb-12">

          {/* STEP 1: Join WhatsApp VIP Group */}
          <div className="bg-slate-900/90 border-2 border-emerald-500/50 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
            <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
              <div className="space-y-2 text-center md:text-left">
                <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
                  Step 1 · High Priority
                </div>
                <h3 className="text-xl md:text-2xl font-black text-white flex items-center gap-2 justify-center md:justify-start">
                  <MessageCircle className="text-emerald-400" /> Join The VIP WhatsApp Group
                </h3>
                <p className="text-slate-300 text-sm max-w-lg leading-relaxed">
                  We post the direct Zoom meeting link 15 minutes before we go live, plus exclusive material formula sheets.
                </p>
              </div>

              <a
                href="https://chat.whatsapp.com/sample-art-webinar-vip"
                target="_blank"
                rel="noopener noreferrer"
                className="px-7 py-4 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-slate-950 font-black rounded-2xl text-base transition-all shadow-xl shadow-emerald-500/25 flex items-center gap-2.5 shrink-0 hover:scale-105"
              >
                <MessageCircle size={20} />
                Join VIP WhatsApp Group →
              </a>
            </div>
          </div>

          {/* STEP 2: Add To Calendar */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl">
            <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
              <div className="space-y-2 text-center md:text-left">
                <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-orange-400 bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/30">
                  Step 2 · Never Miss The Start
                </div>
                <h3 className="text-xl md:text-2xl font-black text-white flex items-center gap-2 justify-center md:justify-start">
                  <Calendar className="text-orange-400" /> Add Masterclass to Your Calendar
                </h3>
                <p className="text-slate-300 text-sm max-w-lg leading-relaxed">
                  Live session is this Sunday at 8:00 PM IST. Add a 10-minute reminder alert so you get a seat before the room reaches capacity.
                </p>
              </div>

              <a
                href={googleCalendarUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold rounded-2xl text-sm transition-all flex items-center gap-2 shrink-0"
              >
                <Calendar size={18} className="text-orange-400" />
                Add to Google Calendar <ExternalLink size={14} />
              </a>
            </div>
          </div>

          {/* STEP 3: Check Inbox */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl">
            <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
              <div className="space-y-2 text-center md:text-left">
                <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/30">
                  Step 3 · Confirmation Email
                </div>
                <h3 className="text-xl md:text-2xl font-black text-white flex items-center gap-2 justify-center md:justify-start">
                  <Mail className="text-amber-400" /> Check Your Inbox For Details
                </h3>
                <p className="text-slate-300 text-sm max-w-lg leading-relaxed">
                  We sent a confirmation email to{" "}
                  <strong className="text-white">{lead?.email || "your email address"}</strong>. (If you don't see it in 2 minutes, check your Promotions or Spam folder).
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Preparation Checklist Box */}
        <div className="bg-slate-900/50 border border-slate-800/80 rounded-3xl p-6 md:p-8 text-center space-y-4 mb-12">
          <h4 className="text-lg font-bold text-white flex items-center justify-center gap-2">
            <Sparkles size={18} className="text-orange-400" /> How to Get Maximum Value from This 90-Minute Training:
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left pt-2">
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4">
              <p className="text-xs font-bold text-orange-400 mb-1">1. Join from a Laptop/Desktop</p>
              <p className="text-xs text-slate-400">For clear visibility of microscopic ocean wave cell structures and geode layering techniques.</p>
            </div>
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4">
              <p className="text-xs font-bold text-amber-400 mb-1">2. Keep a Notebook Ready</p>
              <p className="text-xs text-slate-400">You will receive exact gram mixing formulas, curing timelines, and 4x pricing markups.</p>
            </div>
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4">
              <p className="text-xs font-bold text-emerald-400 mb-1">3. Join 5 Mins Early</p>
              <p className="text-xs text-slate-400">The Zoom meeting room has a strict 500-attendee limit and operates on a first-come, first-served basis.</p>
            </div>
          </div>
        </div>

        {/* Return Button */}
        <div className="text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-orange-400 transition-colors"
          >
            ← Return to Ravishing Art Hub Home
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-8 px-6 text-center text-xs text-slate-500">
        <p>© 2026 Ravishing Art Hub · Empowering independent resin artists across India.</p>
      </footer>
    </div>
  );
}
