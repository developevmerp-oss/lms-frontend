"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BrandLogo } from "@/components/ui/BrandLogo";
import SiteNavbar from "@/components/layout/SiteNavbar";
import SiteFooter from "@/components/layout/SiteFooter";
import { API_BASE_URL } from "@/config/api";
import { processRazorpayPayment } from "@/utils/razorpay";
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
   * Fast Start (Level 0) Razorpay Checkout Handler
   * Allows direct ₹499 purchase so students can skip waiting and access L0 immediately.
   */
  const handleFastStartCheckout = () => {
    processRazorpayPayment({
      amount: 499,
      tierCode: "L0",
      tierName: "Fast Track",
      name: lead?.name || "",
      email: lead?.email || "",
      phone: lead?.phone || "",
      onSuccess: (data) => {
        alert("🎉 Payment Successful! Welcome to Fast Track (Level 0). Redirecting to your dashboard...");
        router.push("/student/dashboard");
      },
      onFailure: (err) => {
        console.warn("Payment dismissed or failed:", err);
      },
    });
  };

  const handleContinueWithWebinar = () => {
    setWebinarStatusMsg("Awesome choice! Join the VIP WhatsApp group below to receive your live Zoom link & prep worksheets.");
    if (whatsappSectionRef.current) {
      whatsappSectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div
      className="landing-page relative min-h-screen bg-white text-stone-900 selection:bg-orange-500 selection:text-white flex flex-col justify-between"
      style={{
        backgroundColor: "#ffffff",
        backgroundImage: "radial-gradient(circle, #e2ded4 1.5px, transparent 1.5px)",
        backgroundSize: "24px 24px",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Ambient background lighting gradient */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[8%] left-[10%] w-[500px] h-[500px] bg-orange-400/10 rounded-full blur-[140px]" />
        <div className="absolute top-[40%] right-[10%] w-[450px] h-[450px] bg-amber-400/10 rounded-full blur-[130px]" />
        <div className="absolute bottom-[15%] left-[20%] w-[500px] h-[500px] bg-emerald-400/10 rounded-full blur-[140px]" />
      </div>

      {/* Header: SiteNavbar as requested */}
      <SiteNavbar />

      {/* Main Content */}
      <main className="nav-width container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14 relative z-10 flex-1">
        <div className="w-full max-w-7xl mx-auto space-y-10 sm:space-y-12">
          {/* Hero Section */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-bold px-4 py-1.5 rounded-full shadow-sm">
              <CheckCircle2 size={14} className="text-emerald-600" />
              <span>Registration Confirmed • You&apos;re in</span>
            </div>

            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-emerald-100/80 border-2 border-emerald-400/80 flex items-center justify-center mx-auto text-emerald-600 shadow-xl shadow-emerald-500/20 mb-2">
              <CheckCircle2 size={40} className="stroke-[2.2]" />
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-stone-900 tracking-tight leading-tight">
              <span className="block">Your Resin Mastery</span>
              <span className="block mt-1 sm:mt-2">Masterclass seat is reserved</span>
              <span className="block text-4xl sm:text-5xl md:text-6xl mt-3 sm:mt-4 text-center" aria-hidden="true">🎉</span>
            </h1>

            <p className="text-stone-600 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
              We&apos;ve received your registration successfully{lead?.name ? `, ${lead.name.split(" ")[0]}` : ""}. Check your email now — your webinar confirmation and reminders will be sent there, including the Zoom joining link.
            </p>
          </div>

        {/* 3 Overview Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
          {/* Card 01 */}
          <div className="bg-white/95 backdrop-blur-sm border border-[#eadfd4] hover:border-orange-300 rounded-2xl p-6 shadow-[0_10px_25px_-5px_rgba(45,30,15,0.06),0_4px_10px_-2px_rgba(45,30,15,0.03)] space-y-2.5 transition-all duration-300 hover:shadow-lg">
            <div className="w-8 h-8 rounded-xl bg-orange-100/80 text-orange-700 border border-orange-200 flex items-center justify-center font-black text-xs">
              01
            </div>
            <h3 className="font-bold text-stone-900 text-base">Check your email</h3>
            <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
              Look for your confirmation email and save the webinar date and time to your calendar.
            </p>
          </div>

          {/* Card 02 (WhatsApp Priority) */}
          <div className="bg-emerald-50/70 backdrop-blur-sm border-2 border-emerald-400/80 rounded-2xl p-6 shadow-[0_10px_25px_-5px_rgba(16,185,129,0.12)] space-y-2.5 relative overflow-hidden transition-all duration-300 hover:shadow-lg">
            <div className="absolute top-3 right-3">
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-emerald-300">
                Priority
              </span>
            </div>
            <div className="w-8 h-8 rounded-xl bg-emerald-200/70 text-emerald-800 border border-emerald-300 flex items-center justify-center font-black text-xs">
              02
            </div>
            <h3 className="font-bold text-stone-900 text-base">Join the WhatsApp group</h3>
            <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
              Reminders, the Clarity Kit, and pre-webinar support all happen inside the group.
            </p>
          </div>

          {/* Card 03 */}
          <div className="bg-white/95 backdrop-blur-sm border border-[#eadfd4] hover:border-purple-300 rounded-2xl p-6 shadow-[0_10px_25px_-5px_rgba(45,30,15,0.06),0_4px_10px_-2px_rgba(45,30,15,0.03)] space-y-2.5 transition-all duration-300 hover:shadow-lg">
            <div className="w-8 h-8 rounded-xl bg-purple-100/80 text-purple-700 border border-purple-200 flex items-center justify-center font-black text-xs">
              03
            </div>
            <h3 className="font-bold text-stone-900 text-base">Watch the prep video</h3>
            <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
              A short video so you arrive prepared, focused, and ready to get the maximum value.
            </p>
          </div>
        </div>

        {/* ─── SECTION: WATCH THIS BEFORE YOU JOIN ─── */}
        <div className="bg-white/95 backdrop-blur-sm border border-[#eadfd4] rounded-3xl p-6 sm:p-8 md:p-10 shadow-[0_18px_40px_-12px_rgba(45,30,15,0.08),0_4px_12px_-2px_rgba(45,30,15,0.04)] space-y-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#942008] bg-orange-50 px-3.5 py-1.5 rounded-full border border-orange-200/80">
              <Video size={14} className="text-[#942008]" /> Masterclass Prep Video
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-stone-900 flex items-center justify-center md:justify-start gap-2">
              Watch this before you join
            </h2>
            <p className="text-stone-600 text-sm md:text-base">
              This short video will help you arrive prepared, focused, and ready to get the maximum value from the Masterclass.
            </p>
          </div>

          {/* Video Container */}
          <div className="relative rounded-2xl overflow-hidden border border-[#eadfd4] aspect-video bg-stone-950 flex items-center justify-center shadow-inner group">
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
                className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer bg-gradient-to-tr from-stone-950 via-stone-900 to-stone-950 group-hover:bg-stone-900/90 transition-all p-6 text-center"
              >
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 border-2 border-white/60 flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform shadow-2xl shadow-orange-500/40">
                  <PlayCircle size={44} />
                </div>
                <p className="text-lg font-bold text-white">Masterclass Preparation &amp; Roadmap Walkthrough</p>
                <p className="text-xs text-orange-300 font-semibold mt-1">Duration: 3 mins · Click to Play</p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-3 text-stone-400 p-8 text-center bg-stone-50 h-full w-full">
                <Video size={36} className="text-stone-300" />
                <p className="text-sm font-semibold text-stone-600">Preparation video will appear here</p>
                <p className="text-xs text-stone-400">Admin can add the video URL in the Webinar Management panel.</p>
              </div>
            )}
          </div>

          {/* Subtle indicator while watching before 10s */}
          {videoStarted && !showOfferButtons && (
            <div className="flex items-center justify-center gap-2 text-xs text-stone-500 pt-2 animate-pulse font-medium">
              <Clock size={13} className="text-orange-500" />
              <span>Special fast-track options revealing in {secondsRemaining}s...</span>
            </div>
          )}

          {/* ─── DUAL ACTION DECISION BOX (APPEARS AFTER 10 SECONDS OF STARTING VIDEO) ─── */}
          {showOfferButtons && (
            <div
              ref={offerSectionRef}
              className="bg-[#fffcf7] border-2 border-orange-400 rounded-3xl p-6 md:p-8 space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-700 shadow-2xl shadow-orange-500/15"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-[#f3d7c4] pb-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-[11px] font-black uppercase tracking-wider px-3 py-0.5 rounded-full mb-1 shadow-sm">
                    <Flame size={12} className="fill-white" /> Fast-Track Unlocked
                  </div>
                  <h3 className="text-xl md:text-2xl font-black text-stone-900">
                    Ready to Start Your Art Journey Today?
                  </h3>
                  <p className="text-xs text-stone-600 mt-0.5">
                    Choose whether to start learning immediately or wait for the live webinar:
                  </p>
                </div>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-3 py-1 rounded-full shrink-0">
                  ⚡ 2 Available Options
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* 1. Resin Art Fast Start Bundle */}
                <button
                  type="button"
                  onClick={handleFastStartCheckout}
                  className="p-6 rounded-2xl bg-gradient-to-br from-orange-50 via-amber-50/50 to-white border-2 border-orange-400 hover:border-orange-500 transition-all flex flex-col justify-between group text-left shadow-lg shadow-orange-500/10 hover:shadow-xl hover:scale-[1.01] cursor-pointer relative overflow-hidden"
                >
                  <div className="absolute top-3 right-3">
                    <span className="bg-gradient-to-r from-orange-500 to-amber-500 text-white text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full shadow-sm">
                      Instant Access
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 text-xs font-bold text-orange-600 uppercase tracking-wider mb-2">
                      <Sparkles size={14} /> Option 1 (Skip The Wait)
                    </div>
                    <h4 className="text-lg md:text-xl font-black text-stone-900 mb-2 group-hover:text-orange-600 transition-colors">
                      1. Resin Art Fast Start Bundle
                    </h4>
                    <p className="text-xs text-stone-600 leading-relaxed mb-4">
                      Don&apos;t want to wait 2 days for the webinar? Start Level 0 now! Unlock 4 foundational video lessons, formula calculator &amp; student dashboard access immediately.
                    </p>
                  </div>

                  <div className="pt-3 border-t border-orange-200 flex items-center justify-between text-xs font-black text-orange-600">
                    <span className="flex items-center gap-1.5">
                      <Zap size={14} className="text-orange-500" /> Unlock Level 0 &amp; Join Course
                    </span>
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>

                {/* 2. Continue with Webinar */}
                <button
                  type="button"
                  onClick={handleContinueWithWebinar}
                  className="p-6 rounded-2xl bg-white border-2 border-stone-200 hover:border-stone-300 transition-all flex flex-col justify-between group text-left shadow-md hover:shadow-lg hover:scale-[1.01] cursor-pointer relative overflow-hidden"
                >
                  <div className="absolute top-3 right-3">
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border border-emerald-300">
                      100% Free
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">
                      <Clock size={14} className="text-emerald-600" /> Option 2 (Live Session)
                    </div>
                    <h4 className="text-lg md:text-xl font-black text-stone-900 mb-2 group-hover:text-emerald-700 transition-colors">
                      2. Continue with Webinar
                    </h4>
                    <p className="text-xs text-stone-600 leading-relaxed mb-4">
                      Attend the live 90-minute Masterclass this Sunday at 8:00 PM IST with Vrajangna Patel, live Q&amp;A, and free Clarity Kit.
                    </p>
                  </div>

                  <div className="pt-3 border-t border-stone-200 flex items-center justify-between text-xs font-bold text-stone-700">
                    <span className="flex items-center gap-1.5">
                      <MessageCircle size={14} className="text-emerald-600" /> Keep My Free Seat &amp; Join Group
                    </span>
                    <ArrowDown size={14} className="group-hover:translate-y-0.5 transition-transform" />
                  </div>
                </button>
              </div>

              {webinarStatusMsg && (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-in fade-in duration-300 font-medium">
                  <CheckCircle2 size={16} className="shrink-0 text-emerald-600" />
                  <span>{webinarStatusMsg}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ─── SECTION: JOIN THE OFFICIAL WHATSAPP GROUP ─── */}
        <div
          ref={whatsappSectionRef}
          className="bg-white/95 backdrop-blur-sm border-2 border-emerald-400/80 rounded-3xl p-8 md:p-10 shadow-[0_20px_50px_-15px_rgba(16,185,129,0.18)] relative overflow-hidden"
        >
          <div className="w-full max-w-4xl space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3.5 py-1 rounded-full border border-emerald-200">
              <MessageCircle size={14} className="text-emerald-600" /> Official Masterclass Community
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl md:text-3xl font-black text-stone-900">
                Join the official WhatsApp group
              </h2>
              <p className="text-stone-600 text-sm md:text-base">
                Don&apos;t rely on memory. Join the group so you don&apos;t miss your live session.
              </p>
            </div>

            <ul className="space-y-3 text-sm text-stone-700">
              <li className="flex items-center gap-2.5">
                <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                <span>Live webinar reminders &amp; direct Zoom access link</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                <span>Your free Resin Artist Clarity Kit and formula updates</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                <span>Pre-webinar material Q&amp;A and support</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                <span>Guidance to help you prepare for the live class</span>
              </li>
            </ul>

            <div className="pt-2 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <a
                href={whatsappGroupUrl || "https://chat.whatsapp.com/sample-art-webinar-vip"}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-black rounded-2xl text-base transition-all shadow-xl shadow-emerald-600/25 flex items-center justify-center gap-2.5 hover:scale-[1.02] cursor-pointer"
              >
                <MessageCircle size={20} />
                Join the WhatsApp Group →
              </a>

              <a
                href={googleCalendarUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-4 bg-stone-100 hover:bg-stone-200 border border-stone-300/80 text-stone-800 font-bold rounded-2xl text-sm transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <Calendar size={16} className="text-orange-500" />
                Add to Google Calendar
              </a>
            </div>
          </div>
        </div>

        {/* Back Link */}
        <div className="text-center pt-2 pb-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-bold text-stone-500 hover:text-orange-600 transition-colors"
          >
            ← Back to the homepage
          </Link>
        </div>
      </div>
    </main>

      {/* Footer: SiteFooter matching the site */}
      <SiteFooter />
    </div>
  );
}
