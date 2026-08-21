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
  PlayCircle,
  Check,
  ShieldCheck,
  Video,
  Gift,
  Bell
} from "lucide-react";

export default function ThankYouPage() {
  const [lead, setLead] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);

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
      {/* Background Glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[10%] left-[20%] w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-[20%] right-[15%] w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[140px]" />
      </div>

      {/* Header */}
      <header className="border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-xl py-4 px-6 relative z-10">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <BrandLogo href="/" size="md" />
          <div className="inline-flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold px-3.5 py-1.5 rounded-full">
            <CheckCircle2 size={13} /> You're in
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12 relative z-10 space-y-12">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 border-2 border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400 shadow-2xl shadow-emerald-500/30 mb-2 animate-bounce-short">
            <CheckCircle2 size={36} />
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-tight">
            Your Resin Mastery Masterclass seat is reserved 🎉
          </h1>

          <p className="text-slate-300 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            We've received your registration successfully{lead?.name ? `, ${lead.name.split(" ")[0]}` : ""}. Check your email now — your webinar confirmation and reminders will be sent there, including the Zoom joining link.
          </p>
        </div>

        {/* 3 Overview Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-2 hover:border-slate-700 transition-colors">
            <div className="w-8 h-8 rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/20 flex items-center justify-center font-bold text-xs">
              01
            </div>
            <h3 className="font-bold text-white text-base">Check your email</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Look for your confirmation email and save the webinar date and time to your calendar.
            </p>
          </div>

          <div className="bg-slate-900/90 border border-emerald-500/40 rounded-2xl p-6 shadow-xl space-y-2 relative overflow-hidden">
            <div className="absolute top-3 right-3">
              <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">Priority</span>
            </div>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center font-bold text-xs">
              02
            </div>
            <h3 className="font-bold text-white text-base">Join the WhatsApp group</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Reminders, the Clarity Kit, and pre-webinar support all happen inside the group.
            </p>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-2 hover:border-slate-700 transition-colors">
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center font-bold text-xs">
              03
            </div>
            <h3 className="font-bold text-white text-base">Watch the prep video</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              A short video so you arrive prepared, focused, and ready to get the maximum value.
            </p>
          </div>
        </div>

        {/* SECTION 1: JOIN THE OFFICIAL WHATSAPP GROUP */}
        <div className="bg-slate-900/90 border-2 border-emerald-500/50 rounded-3xl p-8 md:p-10 shadow-2xl relative overflow-hidden">
          <div className="max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-3.5 py-1 rounded-full border border-emerald-500/30">
              <MessageCircle size={14} /> Immediate Action Step
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl md:text-3xl font-black text-white">
                Join the official WhatsApp group
              </h2>
              <p className="text-slate-300 text-sm md:text-base">
                Don't rely on memory. Join the group so you don't miss your live session.
              </p>
            </div>

            <ul className="space-y-3 text-sm text-slate-300">
              <li className="flex items-center gap-2.5">
                <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                <span>Live webinar reminders & direct Zoom access link</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                <span>Your free Resin Artist Clarity Kit and formula updates</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                <span>Pre-webinar material Q&A and support</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                <span>Guidance to help you prepare for the live class</span>
              </li>
            </ul>

            <div className="pt-2 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <a
                href="https://chat.whatsapp.com/sample-art-webinar-vip"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-slate-950 font-black rounded-2xl text-base transition-all shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-2.5 hover:scale-105"
              >
                <MessageCircle size={20} />
                Join the WhatsApp Group →
              </a>

              <a
                href={googleCalendarUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold rounded-2xl text-sm transition-all flex items-center justify-center gap-2"
              >
                <Calendar size={16} className="text-orange-400" />
                Add to Google Calendar
              </a>
            </div>
          </div>
        </div>

        {/* SECTION 2: WATCH THIS BEFORE YOU JOIN */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-8 md:p-10 shadow-2xl space-y-6">
          <div className="space-y-2 text-center md:text-left">
            <h2 className="text-2xl md:text-3xl font-black text-white flex items-center justify-center md:justify-start gap-2">
              <Video className="text-orange-400" /> Watch this before you join
            </h2>
            <p className="text-slate-300 text-sm md:text-base">
              This short video will help you arrive prepared, focused, and ready to get the maximum value from the Masterclass.
            </p>
          </div>

          {/* Interactive Video Container */}
          <div className="relative rounded-2xl overflow-hidden border border-slate-800 aspect-video bg-slate-950 flex items-center justify-center shadow-inner group">
            {isPlaying ? (
              <iframe
                className="w-full h-full"
                src="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1"
                title="Webinar Preparation Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div
                onClick={() => setIsPlaying(true)}
                className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer bg-gradient-to-tr from-slate-950 via-slate-900 to-slate-950 group-hover:bg-slate-900/80 transition-all p-6 text-center"
              >
                <div className="w-20 h-20 rounded-full bg-orange-500/20 border-2 border-orange-500/50 flex items-center justify-center text-orange-400 mb-4 group-hover:scale-110 transition-transform shadow-2xl shadow-orange-500/30">
                  <PlayCircle size={44} />
                </div>
                <p className="text-lg font-bold text-white">Masterclass Preparation & Roadmap Walkthrough</p>
                <p className="text-xs text-orange-400 font-semibold mt-1">Duration: 3 mins · Click to Play</p>
              </div>
            )}
          </div>
        </div>

        {/* Back Link */}
        <div className="text-center pt-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-orange-400 transition-colors"
          >
            ← Back to the homepage
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-8 px-6 text-center text-xs text-slate-500 space-y-1">
        <BrandLogo href="/" size="sm" className="justify-center mb-2" />
        <p>© 2026 Ravishing Art Hub. All Rights Reserved.</p>
        <p>Resin Art · Identity · Financial Freedom</p>
      </footer>
    </div>
  );
}
