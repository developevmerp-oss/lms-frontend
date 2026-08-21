"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { API_BASE_URL } from "@/config/api";
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
  Flame,
  Zap,
  BookOpen,
  Trophy,
  ArrowDown,
  CreditCard
} from "lucide-react";

export default function ThankYouPage() {
  const router = useRouter();
  const [lead, setLead] = useState<any>(null);
  const [videoStarted, setVideoStarted] = useState(false);
  const [showOfferButtons, setShowOfferButtons] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(10);
  const [webinarStatusMsg, setWebinarStatusMsg] = useState("");
  const whatsappSectionRef = useRef<HTMLDivElement>(null);
  const offerSectionRef = useRef<HTMLDivElement>(null);

  const [prepVideoUrl, setPrepVideoUrl] = useState<string | null>(null);
  const [whatsappGroupUrl, setWhatsappGroupUrl] = useState<string>("https://chat.whatsapp.com/sample-art-webinar-vip");

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

  // Fetch the active webinar's prep video URL and WhatsApp group from backend
  useEffect(() => {
    const fetchWebinarConfig = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/webinar/next`);
        const data = await res.json();
        if (data.success && data.data) {
          if (data.data.prepVideoUrl) {
            setPrepVideoUrl(data.data.prepVideoUrl);
          }
          if (data.data.whatsappGroupUrl) {
            setWhatsappGroupUrl(data.data.whatsappGroupUrl);
          }
        }
      } catch (_) {}
    };
    fetchWebinarConfig();
  }, []);

  // When video starts playing, trigger 10-second delay before revealing the 2 buttons
  useEffect(() => {
    let timer: NodeJS.Timeout;
    let countdownInterval: NodeJS.Timeout;

    if (videoStarted && !showOfferButtons) {
      countdownInterval = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      timer = setTimeout(() => {
        setShowOfferButtons(true);
        // Smooth scroll slightly down to make sure buttons are visible
        setTimeout(() => {
          offerSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 200);
      }, 10000); // 10 seconds delay
    }

    return () => {
      clearTimeout(timer);
      clearInterval(countdownInterval);
    };
  }, [videoStarted, showOfferButtons]);

  /** Converts any YouTube watch/share URL to a youtube-nocookie embed URL */
  const toYouTubeEmbed = (url: string): string => {
    try {
      // Handle youtu.be/ID
      const shortMatch = url.match(/youtu\.be\/([\w-]+)/);
      if (shortMatch) return `https://www.youtube-nocookie.com/embed/${shortMatch[1]}?autoplay=1`;
      // Handle youtube.com/watch?v=ID
      const watchMatch = url.match(/[?&]v=([\w-]+)/);
      if (watchMatch) return `https://www.youtube-nocookie.com/embed/${watchMatch[1]}?autoplay=1`;
      // Handle youtube.com/embed/ID (already embed)
      if (url.includes('/embed/')) {
        return url.includes('autoplay') ? url : `${url}?autoplay=1`;
      }
      // Fallback: return as-is
      return url;
    } catch (_) {
      return url;
    }
  };

  const handleStartVideo = () => {
    setVideoStarted(true);
    setSecondsRemaining(10);
  };

  const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    "Resin Mastery Masterclass with Vrajangna Patel"
  )}&dates=20260823T143000Z/20260823T160000Z&details=${encodeURIComponent(
    "Live Resin Mastery Masterclass: 3 Secrets to Building a ₹3L/Mo Resin Art Business. Check your email for Zoom link!"
  )}&location=${encodeURIComponent("Zoom Live")}`;

  /**
   * Fast Start (Level 0) Checkout / Enrollment Handler
   * Designed with Razorpay payment gateway placeholder for future seamless activation.
   */
  const handleFastStartCheckout = () => {
    // --- FUTURE RAZORPAY PAYMENT GATEWAY INTEGRATION HOOK ---
    // When Razorpay credentials are ready in the future:
    // const options = {
    //   key: process.env.NEXT_PUBLIC_RAZORPAY_KEY || "rzp_test_xxxx",
    //   amount: 99900, // in paise (₹999)
    //   currency: "INR",
    //   name: "Ravishing Art Hub",
    //   description: "Resin Art Fast Start (Level 0) Bundle",
    //   image: "/logo-dark.png",
    //   prefill: { name: lead?.name || "", email: lead?.email || "", contact: lead?.phone || "" },
    //   handler: function (response: any) { ... }
    // };
    // const rzp = new (window as any).Razorpay(options);
    // rzp.open();
    // --------------------------------------------------------

    // For now: Direct instant registration & auto-enrollment in Level 0 Fast Start
    const queryParams = new URLSearchParams({
      bundle: "fast-start",
      course: "l0",
      ...(lead?.name && { name: lead.name }),
      ...(lead?.email && { email: lead.email }),
      ...(lead?.phone && { phone: lead.phone }),
    });

    router.push(`/register?${queryParams.toString()}`);
  };

  const handleContinueWithWebinar = () => {
    setWebinarStatusMsg("Awesome choice! Join the VIP WhatsApp group below to receive your live Zoom link & prep worksheets.");
    if (whatsappSectionRef.current) {
      whatsappSectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

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

        {/* ─── SECTION: WATCH THIS BEFORE YOU JOIN ─── */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-8 md:p-10 shadow-2xl space-y-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-orange-400 bg-orange-500/10 px-3.5 py-1 rounded-full border border-orange-500/30">
              <Video size={14} /> Masterclass Prep Video
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white flex items-center justify-center md:justify-start gap-2">
              Watch this before you join
            </h2>
            <p className="text-slate-300 text-sm md:text-base">
              This short video will help you arrive prepared, focused, and ready to get the maximum value from the Masterclass.
            </p>
          </div>

          {/* Video Container */}
          <div className="relative rounded-2xl overflow-hidden border border-slate-800 aspect-video bg-slate-950 flex items-center justify-center shadow-inner group">
            {videoStarted && prepVideoUrl ? (
              <iframe
                className="w-full h-full"
                src={toYouTubeEmbed(prepVideoUrl)}
                title="Webinar Preparation Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : prepVideoUrl ? (
              <div
                onClick={handleStartVideo}
                className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer bg-gradient-to-tr from-slate-950 via-slate-900 to-slate-950 group-hover:bg-slate-900/80 transition-all p-6 text-center"
              >
                <div className="w-20 h-20 rounded-full bg-orange-500/20 border-2 border-orange-500/50 flex items-center justify-center text-orange-400 mb-4 group-hover:scale-110 transition-transform shadow-2xl shadow-orange-500/30">
                  <PlayCircle size={44} />
                </div>
                <p className="text-lg font-bold text-white">Masterclass Preparation &amp; Roadmap Walkthrough</p>
                <p className="text-xs text-orange-400 font-semibold mt-1">Duration: 3 mins · Click to Play</p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-3 text-slate-500 p-8 text-center">
                <Video size={36} className="text-slate-700" />
                <p className="text-sm font-semibold text-slate-400">Preparation video will appear here</p>
                <p className="text-xs text-slate-600">Admin can add the video URL in the Webinar Management panel.</p>
              </div>
            )}
          </div>

          {/* Subtle indicator while watching before 10s */}
          {videoStarted && !showOfferButtons && (
            <div className="flex items-center justify-center gap-2 text-xs text-slate-400 pt-2 animate-pulse">
              <Clock size={13} className="text-orange-400" />
              <span>Special fast-track options revealing in {secondsRemaining}s...</span>
            </div>
          )}

          {/* ─── DUAL ACTION DECISION BOX (APPEARS AFTER 10 SECONDS OF STARTING VIDEO) ─── */}
          {showOfferButtons && (
            <div
              ref={offerSectionRef}
              className="bg-slate-950/90 border-2 border-orange-500 rounded-3xl p-6 md:p-8 space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-700 shadow-2xl shadow-orange-500/20"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-800 pb-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-orange-500 to-amber-400 text-slate-950 text-[11px] font-black uppercase tracking-wider px-3 py-0.5 rounded-full mb-1">
                    <Flame size={12} className="fill-slate-950" /> Fast-Track Unlocked
                  </div>
                  <h3 className="text-xl md:text-2xl font-black text-white">
                    Ready to Start Your Art Journey Today?
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Choose whether to start learning immediately or wait for the live webinar:
                  </p>
                </div>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full shrink-0">
                  ⚡ 2 Available Options
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* 1. Resin Art Fast Start Bundle */}
                <button
                  type="button"
                  onClick={handleFastStartCheckout}
                  className="p-6 rounded-2xl bg-gradient-to-br from-orange-500/25 via-amber-500/15 to-slate-900 border-2 border-orange-500 hover:border-orange-400 transition-all flex flex-col justify-between group text-left shadow-2xl shadow-orange-500/20 hover:scale-[1.02] cursor-pointer relative overflow-hidden"
                >
                  <div className="absolute top-3 right-3">
                    <span className="bg-orange-500 text-slate-950 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full shadow-md">
                      Instant Access
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 text-xs font-bold text-orange-400 uppercase tracking-wider mb-2">
                      <Sparkles size={14} /> Option 1 (Skip The Wait)
                    </div>
                    <h4 className="text-lg md:text-xl font-black text-white mb-2 group-hover:text-orange-300 transition-colors">
                      1. Resin Art Fast Start Bundle
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed mb-4">
                      Don't want to wait 2 days for the webinar? Start Level 0 now! Unlock 4 foundational video lessons, formula calculator &amp; student dashboard access immediately.
                    </p>
                  </div>

                  <div className="pt-3 border-t border-orange-500/30 flex items-center justify-between text-xs font-black text-orange-400">
                    <span className="flex items-center gap-1.5">
                      <Zap size={14} className="text-orange-400" /> Unlock Level 0 &amp; Join Course
                    </span>
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>

                {/* 2. Continue with Webinar */}
                <button
                  type="button"
                  onClick={handleContinueWithWebinar}
                  className="p-6 rounded-2xl bg-slate-900/90 border-2 border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between group text-left shadow-lg hover:scale-[1.02] cursor-pointer relative overflow-hidden"
                >
                  <div className="absolute top-3 right-3">
                    <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border border-emerald-500/30">
                      100% Free
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                      <Clock size={14} className="text-emerald-400" /> Option 2 (Live Session)
                    </div>
                    <h4 className="text-lg md:text-xl font-black text-white mb-2 group-hover:text-emerald-300 transition-colors">
                      2. Continue with Webinar
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed mb-4">
                      Attend the live 90-minute Masterclass this Sunday at 8:00 PM IST with Vrajangna Patel, live Q&amp;A, and free Clarity Kit.
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-bold text-slate-300">
                    <span className="flex items-center gap-1.5">
                      <MessageCircle size={14} className="text-emerald-400" /> Keep My Free Seat &amp; Join Group
                    </span>
                    <ArrowDown size={14} className="group-hover:translate-y-0.5 transition-transform" />
                  </div>
                </button>
              </div>

              {webinarStatusMsg && (
                <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2 animate-in fade-in duration-300">
                  <CheckCircle2 size={16} className="shrink-0" />
                  <span>{webinarStatusMsg}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ─── SECTION: JOIN THE OFFICIAL WHATSAPP GROUP ─── */}
        <div
          ref={whatsappSectionRef}
          className="bg-slate-900/90 border-2 border-emerald-500/50 rounded-3xl p-8 md:p-10 shadow-2xl relative overflow-hidden"
        >
          <div className="max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-3.5 py-1 rounded-full border border-emerald-500/30">
              <MessageCircle size={14} /> Official Masterclass Community
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
                <span>Live webinar reminders &amp; direct Zoom access link</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                <span>Your free Resin Artist Clarity Kit and formula updates</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                <span>Pre-webinar material Q&amp;A and support</span>
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
