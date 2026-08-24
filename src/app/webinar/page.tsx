"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { WebinarCountdown } from "@/components/webinar/WebinarCountdown";
import { SocialProofToaster } from "@/components/webinar/SocialProofToaster";
import { ExitIntentModal } from "@/components/webinar/ExitIntentModal";
import { API_BASE_URL } from "@/config/api";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Lock,
  Unlock,
  Award,
  BookOpen,
  Users,
  Flame,
  Star,
  Layers,
  HeartHandshake,
  TrendingUp,
  ShieldCheck,
  HelpCircle,
  Clock,
  Video,
  Gift,
  Check,
  ChevronDown,
  ChevronUp,
  X,
  AlertCircle,
  Palette,
  DollarSign,
  Crown,
  Briefcase,
  Globe,
  Brush,
  Sun,
  Moon
} from "lucide-react";

export default function WebinarPage() {
  const router = useRouter();
  const [activeWebinar, setActiveWebinar] = useState<any>(null);
  const [stats, setStats] = useState({
    claimedSeats: 412,
    percentFull: 82,
    seatsRemaining: 88,
    totalSeats: 500,
  });

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    challenge: "",
    consent: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showBanner, setShowBanner] = useState(true);
  const [showStickyBottom, setShowStickyBottom] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Fetch dynamic scarcity stats directly from database
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/webinar/stats`);
        const data = await res.json();
        if (data.success && data.data) {
          setStats({
            claimedSeats: data.data.claimedSeats ?? 412,
            percentFull: data.data.percentFull ?? 82,
            seatsRemaining: data.data.seatsRemaining ?? 88,
            totalSeats: data.data.totalSeats ?? 500,
          });
        }
      } catch (_) {}
    };

    fetchStats();
  }, []);

  // Sticky bottom bar on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 600) {
        setShowStickyBottom(true);
      } else {
        setShowStickyBottom(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const update = (field: string, val: any) => setForm(f => ({ ...f, [field]: val }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.name || !form.email || !form.phone) {
      setError("Please provide your Name, Email, and WhatsApp number.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/webinar/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          webinarEventId: activeWebinar?.id || null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to register");
      }

      if (typeof window !== "undefined") {
        sessionStorage.setItem("webinar_lead", JSON.stringify(data.data || form));
      }

      router.push("/thank-you");
    } catch (err: any) {
      if (typeof window !== "undefined") {
        sessionStorage.setItem("webinar_lead", JSON.stringify(form));
      }
      router.push("/thank-you");
    } finally {
      setLoading(false);
    }
  };

  const scrollToRegister = () => {
    const el = document.getElementById("register");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleUnlockAndScroll = () => {
    setIsUnlocked(true);
    setTimeout(() => {
      const el = document.getElementById("unlocked-content");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  const sessionDisplayDate = activeWebinar?.scheduledAt
    ? new Date(activeWebinar.scheduledAt).toLocaleDateString("en-IN", {
        weekday: "short",
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "THIS SUNDAY · 8:00 PM IST";

  const FAQS = [
    {
      q: "Is the Masterclass really 100% free to attend?",
      a: "Yes! There are no hidden fees or credit card requirements. This is a complimentary 90-minute live masterclass designed to show you the science, art, and business of resin craftsmanship.",
    },
    {
      q: "Do I need any prior art experience or expensive equipment to attend?",
      a: "No prior experience or tools are required. You just need a phone or laptop with Zoom and a notebook. We will teach you foundational chemistry, color mixing, and step-by-step techniques from square one.",
    },
    {
      q: "Will there be a recording or replay sent?",
      a: "Because this is an interactive live training with live Q&A and a free Clarity Kit distribution, recordings are only guaranteed for live attendees. Make sure to attend live to claim your ₹4,999 bonuses.",
    },
    {
      q: "How will I receive the Zoom link and Masterclass details?",
      a: "The Zoom access link and calendar invitation will be sent instantly to your registered Email and WhatsApp number immediately after signing up.",
    },
    {
      q: "What is the Resin Artist Clarity Kit?",
      a: "The Clarity Kit is a special ₹4,999 bonus pack given exclusively to live attendees. It includes the Resin Chemistry Ratio Sheet, Pricing Calculator, Commission Pitch Template, and Top 10 Bestselling Products Blueprint.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-orange-500 selection:text-white relative font-sans">
      <SocialProofToaster />
      <ExitIntentModal onClaimSeat={scrollToRegister} />

      {/* ─── 1. TOP ANNOUNCEMENT BANNER ─── */}
      {showBanner && (
        <div className="relative bg-gradient-to-r from-orange-600 via-amber-600 to-orange-600 text-slate-950 font-bold z-50 transition-all">
          <div className="mx-auto flex max-w-6xl items-center justify-center gap-2 px-10 py-2.5 text-center text-xs sm:text-sm text-white">
            <span className="flex items-center gap-1.5">
              <Flame size={16} className="text-amber-200 animate-pulse" />
              <strong>LIVE MASTERCLASS — LIMITED SEATS.</strong> Registration closes when live-seat capacity is reached.
            </span>
          </div>
          <button
            type="button"
            onClick={() => setShowBanner(false)}
            aria-label="Dismiss announcement"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white transition-opacity cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>
      )}

      {/* ─── 2. HEADER NAVBAR ─── */}
      <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-xl transition-all">
        <div className="mx-auto flex h-18 max-w-6xl items-center justify-between px-5">
          <div className="flex items-center gap-3">
            <BrandLogo href="/" size="sm" />
            <div className="hidden sm:block">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block">
                Resin Art • Identity • Financial Freedom
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={scrollToRegister}
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-black shadow-lg shadow-orange-500/20 h-9 rounded-xl px-5 text-xs sm:text-sm transition-all hover:scale-105 cursor-pointer"
            >
              Reserve my free seat
            </button>
          </div>
        </div>
      </header>

      <main>
        {/* ─── 3. HERO SECTION WITH REGISTRATION FORM ─── */}
        <section className="relative overflow-hidden pt-12 pb-20 sm:py-24">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-96 bg-gradient-to-b from-orange-600/10 via-amber-600/5 to-transparent blur-3xl"></div>

          <div className="relative mx-auto grid max-w-6xl gap-12 px-5 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 items-start">
            
            {/* Left Column: Headline, Details & CTAs */}
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-orange-500/30 bg-orange-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-orange-400 mb-6">
                <Sparkles size={13} className="animate-pulse" /> Free live masterclass
              </span>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black leading-[1.1] tracking-tight text-white mb-6">
                From Resin Art Passion to a{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-yellow-400">
                  ₹3 Lakh/Month Business
                </span>{" "}
                — Without Random Tutorials, Self-Doubt or Guesswork.
              </h1>

              <p className="max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg mb-6">
                Join the Resin Mastery Masterclass and discover the 3 secrets to mastering premium resin skills, creating a signature portfolio and turning your art into a business with a clear roadmap.
              </p>

              <blockquote className="max-w-xl border-l-3 border-orange-500 pl-4 py-1 text-sm italic leading-relaxed text-slate-400 sm:text-base mb-8">
                "You don't need more random tutorials. You need the right skills, the confidence to own your creativity, and a roadmap that shows you how to turn what you love into something people will pay for."
              </blockquote>

              <div className="flex flex-wrap items-center gap-3 mb-4">
                <button
                  onClick={scrollToRegister}
                  className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-black shadow-xl shadow-orange-500/30 h-12 rounded-xl px-8 text-sm transition-all hover:scale-105 cursor-pointer"
                >
                  Yes! I want my free seat
                  <ArrowRight className="ml-1 size-4" />
                </button>
                <button
                  onClick={handleUnlockAndScroll}
                  className="inline-flex items-center justify-center gap-2 border border-slate-700 bg-slate-900/90 text-white shadow-sm hover:bg-slate-800 hover:border-orange-500/50 h-12 rounded-xl px-8 text-sm transition-all cursor-pointer font-bold"
                >
                  Show me what I'll learn
                  <ChevronDown className="ml-1 size-4" />
                </button>
              </div>

              <p className="text-xs uppercase tracking-widest text-slate-400 font-semibold mb-8">
                100% Free • Live Masterclass • Limited Seats
              </p>

              {/* Host Preview */}
              <div className="flex items-center gap-4 mb-8 pt-6 border-t border-slate-800/80">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-orange-500/60 shadow-lg shadow-orange-500/20 shrink-0">
                  <img
                    src="/images/mentor/vrajangna-portrait.jpg"
                    alt="Vrajangna Patel"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Vrajangna Patel</p>
                  <p className="text-xs text-orange-400 font-semibold">54,000+ webinar attendees · Founder, Ravishing Art Hub</p>
                </div>
              </div>

              {/* 4-Item Event Grid */}
              <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-slate-800 bg-slate-800 sm:grid-cols-4 mb-8 shadow-xl">
                <div className="bg-slate-900/90 p-4">
                  <dt className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">Date</dt>
                  <dd className="mt-1 text-sm font-bold text-white">{sessionDisplayDate.split("·")[0] || "THIS SUNDAY"}</dd>
                </div>
                <div className="bg-slate-900/90 p-4">
                  <dt className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">Time</dt>
                  <dd className="mt-1 text-sm font-bold text-white">8:00 PM IST</dd>
                </div>
                <div className="bg-slate-900/90 p-4">
                  <dt className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">Language</dt>
                  <dd className="mt-1 text-sm font-bold text-white">Hindi + English</dd>
                </div>
                <div className="bg-slate-900/90 p-4">
                  <dt className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">Duration</dt>
                  <dd className="mt-1 text-sm font-bold text-white">90 minutes</dd>
                </div>
              </dl>

              {/* Countdown */}
              <div className="mb-6">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                  Live Masterclass Starts In:
                </p>
                <WebinarCountdown onWebinarLoaded={(wb) => setActiveWebinar(wb)} />
              </div>

              <p className="max-w-xl text-base font-bold text-orange-400">
                Don't just learn resin. Learn how to make your resin skills matter in the market.
              </p>
            </div>

            {/* Right Column: Registration Card */}
            <div id="register" className="scroll-mt-24">
              <div className="rounded-3xl border-2 border-orange-500/40 bg-slate-900/90 backdrop-blur-xl p-6 sm:p-8 shadow-2xl shadow-black/80">
                <h2 className="text-2xl font-black text-white">Reserve your free seat</h2>
                <p className="mt-1 mb-6 text-xs sm:text-sm text-slate-400">
                  Where should we send your Masterclass details &amp; Clarity Kit?
                </p>

                {/* Seats Left Bar */}
                <div className="mb-6">
                  <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 shadow-inner">
                    <div className="flex items-center justify-between text-xs sm:text-sm">
                      <span className="inline-flex items-center gap-1.5 font-bold text-orange-400">
                        <Users size={16} className="text-orange-400" />
                        {stats.seatsRemaining} live seats left
                      </span>
                      <span className="text-emerald-400 font-bold">{stats.percentFull}% full</span>
                    </div>
                    <div className="mt-2.5 h-2.5 overflow-hidden rounded-full bg-slate-900" role="progressbar">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-400 transition-all duration-1000"
                        style={{ width: `${stats.percentFull}%` }}
                      ></div>
                    </div>
                    <p className="mt-2 text-[11px] text-slate-400 font-medium">
                      Once the room is full, registration closes for this date.
                    </p>
                  </div>
                </div>

                {error && (
                  <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs text-center">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-300" htmlFor="lead-name">
                      Full name *
                    </label>
                    <input
                      className="flex h-11 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/40 transition-all"
                      id="lead-name"
                      placeholder="Jane Doe"
                      autoComplete="name"
                      required
                      value={form.name}
                      onChange={e => update("name", e.target.value)}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-300" htmlFor="lead-email">
                      Email address *
                    </label>
                    <input
                      type="email"
                      className="flex h-11 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/40 transition-all"
                      id="lead-email"
                      placeholder="jane@example.com"
                      autoComplete="email"
                      required
                      value={form.email}
                      onChange={e => update("email", e.target.value)}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-300" htmlFor="lead-phone">
                      WhatsApp number * <span className="text-orange-400 lowercase font-normal">(for VIP link)</span>
                    </label>
                    <input
                      type="tel"
                      className="flex h-11 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/40 transition-all"
                      id="lead-phone"
                      placeholder="+91 98765 43210"
                      autoComplete="tel"
                      required
                      value={form.phone}
                      onChange={e => update("phone", e.target.value)}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-300" htmlFor="lead-message">
                      Your biggest challenge right now <span className="text-slate-500 lowercase font-normal">(optional)</span>
                    </label>
                    <textarea
                      className="flex min-h-[70px] w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/40 transition-all resize-none"
                      id="lead-message"
                      placeholder="e.g. I don't know which resin techniques to learn first, or how to price my work."
                      rows={2}
                      value={form.challenge}
                      onChange={e => update("challenge", e.target.value)}
                    ></textarea>
                  </div>

                  <label className="flex items-start gap-2.5 text-xs leading-relaxed text-slate-400 cursor-pointer pt-1">
                    <input
                      type="checkbox"
                      checked={form.consent}
                      onChange={e => update("consent", e.target.checked)}
                      className="mt-0.5 size-4 shrink-0 rounded border-slate-800 bg-slate-950 text-orange-500 focus:ring-0 cursor-pointer"
                    />
                    <span>
                      I agree to receive webinar reminders, resources and relevant updates from Ravishing Art Hub Learning Academy LLP via email and WhatsApp.
                    </span>
                  </label>

                  <button
                    className="inline-flex items-center justify-center gap-2 text-base font-black transition-all bg-gradient-to-r from-orange-500 via-amber-400 to-orange-500 hover:opacity-95 text-slate-950 shadow-xl shadow-orange-500/30 h-13 rounded-2xl px-8 w-full cursor-pointer hover:scale-[1.02] disabled:opacity-60"
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? "Securing Your Seat..." : "Yes! I want my free seat"}
                  </button>

                  <p className="text-center text-xs text-slate-400 pt-1">
                    Your confirmation and Zoom joining link are emailed the moment you register — check your inbox.
                  </p>

                  <ul className="flex flex-wrap justify-center gap-x-4 gap-y-1 pt-1 text-xs text-slate-400 font-semibold">
                    <li className="flex items-center gap-1">✓ 100% free to attend</li>
                    <li className="flex items-center gap-1">✓ Live 90-minute session</li>
                    <li className="flex items-center gap-1">✓ Clarity Kit included</li>
                  </ul>
                </form>

                <div className="mt-6 flex gap-3 rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
                  <ShieldCheck className="mt-0.5 size-5 shrink-0 text-emerald-400" />
                  <div>
                    <p className="text-xs font-bold text-white">No credit card required</p>
                    <p className="mt-0.5 text-[11px] leading-relaxed text-slate-400">
                      Registration is completely free. Your details are used only for webinar communications and relevant updates — never sold.
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ─── 4. RECOGNISED FOR MARQUEE ─── */}
        <section className="bg-slate-900/40 border-y border-slate-800/80 py-12 px-5">
          <div className="mx-auto max-w-6xl">
            <div className="text-center">
              <p className="text-xs uppercase tracking-widest text-orange-400 font-black mb-4">Recognised for</p>
              <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-sm md:text-base font-bold text-slate-300">
                <li className="flex items-center gap-2">🏆 Hall of Fame Award 2022</li>
                <li className="flex items-center gap-2">📖 I Can Coach — International Best Seller</li>
                <li className="flex items-center gap-2">✨ Sylph Magazine Feature</li>
                <li className="flex items-center gap-2">👥 54,000+ webinar attendees</li>
                <li className="flex items-center gap-2">🎓 10+ years coaching</li>
              </ul>
            </div>
          </div>
        </section>

        {/* ─── 5. FOUR BIG STAT COUNTERS ─── */}
        <section className="py-16 px-5 border-b border-slate-800/80 bg-slate-950">
          <div className="mx-auto max-w-6xl">
            <dl className="grid grid-cols-2 gap-6 sm:grid-cols-4 text-center">
              <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 shadow-md">
                <dt className="text-3xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300">10+ Years</dt>
                <dd className="mt-2 text-xs sm:text-sm text-slate-400 font-semibold uppercase tracking-wider">Experience in coaching</dd>
              </div>
              <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 shadow-md">
                <dt className="text-3xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-300">54,000+</dt>
                <dd className="mt-2 text-xs sm:text-sm text-slate-400 font-semibold uppercase tracking-wider">Webinar attendees</dd>
              </div>
              <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 shadow-md">
                <dt className="text-3xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-300">2022</dt>
                <dd className="mt-2 text-xs sm:text-sm text-slate-400 font-semibold uppercase tracking-wider">Hall of Fame Award</dd>
              </div>
              <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 shadow-md">
                <dt className="text-3xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-300">90 min</dt>
                <dd className="mt-2 text-xs sm:text-sm text-slate-400 font-semibold uppercase tracking-wider">Live masterclass</dd>
              </div>
            </dl>
          </div>
        </section>

        {/* ─── 6. THE INTERACTIVE GATE SECTION ─── */}
        <section id="gate" className="bg-slate-900/40 border-b border-slate-800/80 py-20 px-5 relative z-10">
          <div className="mx-auto max-w-6xl">
            <div className="mx-auto max-w-2xl text-center">
              <span className="text-orange-400 text-xs font-black uppercase tracking-widest block mb-2">Masterclass Curriculum</span>
              <h2 className="text-3xl font-black text-white sm:text-4xl">
                Want to know what makes this Masterclass different?
              </h2>
              <p className="mt-3 text-slate-300 text-base leading-relaxed">
                I've designed this session around the three things most aspiring resin artists need — mastery, mindset and monetization.
              </p>
              <button
                onClick={() => setIsUnlocked(!isUnlocked)}
                className="inline-flex items-center justify-center gap-2 text-sm font-black transition-all bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 shadow-xl shadow-orange-500/20 h-12 rounded-xl px-8 mt-8 cursor-pointer hover:scale-105"
              >
                {isUnlocked ? "Hide Curriculum Details" : "Show me what I'll learn"}
                {isUnlocked ? <ChevronUp className="ml-1.5 size-4" /> : <ChevronDown className="ml-1.5 size-4" />}
              </button>
            </div>
          </div>
        </section>

        {/* ─── 7. UNLOCKED FULL REFERENCE CURRICULUM SECTIONS ─── */}
        {isUnlocked && (
          <div id="unlocked-content" className="animate-in fade-in slide-in-from-top-4 duration-500 space-y-0">
            
            {/* If Any of This is True For You */}
            <section className="py-20 px-5 border-b border-slate-800/80 bg-slate-950">
              <div className="mx-auto max-w-5xl">
                <div className="text-center max-w-2xl mx-auto mb-12">
                  <span className="text-orange-400 text-xs font-black uppercase tracking-widest block mb-2">Reality Check</span>
                  <h2 className="text-3xl sm:text-4xl font-black text-white">If Any of This Sounds Like Where You Are:</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex items-start gap-4">
                    <div className="w-8 h-8 rounded-xl bg-red-500/10 text-red-400 font-bold flex items-center justify-center shrink-0">✕</div>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      You are tired of wasting expensive resin on sticky, bendy, or micro-bubble-ruined creations with no clear reason why.
                    </p>
                  </div>
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex items-start gap-4">
                    <div className="w-8 h-8 rounded-xl bg-red-500/10 text-red-400 font-bold flex items-center justify-center shrink-0">✕</div>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      You create beautiful pieces, but you feel awkward pricing your work and struggle to get consistent, high-paying clients.
                    </p>
                  </div>
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex items-start gap-4">
                    <div className="w-8 h-8 rounded-xl bg-red-500/10 text-red-400 font-bold flex items-center justify-center shrink-0">✕</div>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      You feel overwhelmed by contradictory advice across scattered YouTube videos and reels that don't teach the underlying science.
                    </p>
                  </div>
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex items-start gap-4">
                    <div className="w-8 h-8 rounded-xl bg-red-500/10 text-red-400 font-bold flex items-center justify-center shrink-0">✕</div>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      You want your own recognized identity and sustainable monthly income—not just another expensive, messy hobby.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* The 3 Secrets */}
            <section className="py-20 px-5 bg-slate-900/40 border-b border-slate-800/80">
              <div className="mx-auto max-w-6xl">
                <div className="text-center max-w-3xl mx-auto mb-16">
                  <span className="text-orange-400 text-xs font-black uppercase tracking-widest block mb-2">The 3 Secrets</span>
                  <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
                    The 3 Secrets You Will Learn Inside
                  </h2>
                  <p className="text-slate-300 text-base">
                    Mastery + Mindset + Monetization: The complete step-by-step roadmap.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Secret 1 */}
                  <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-8 shadow-xl flex flex-col justify-between hover:border-cyan-500/50 transition-all">
                    <div>
                      <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-black text-lg flex items-center justify-center mb-6">
                        01
                      </div>
                      <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 block mb-1">Secret #1 · Mastery</span>
                      <h3 className="text-xl font-bold text-white mb-3">The Formula-First Chemistry Blueprint</h3>
                      <p className="text-slate-300 text-sm leading-relaxed mb-4">
                        Eliminate 99% of sticky ruins, uneven curing, and micro-bubbles. Master gram-scale ratios, temperature control, and white wave lacing without costly trial and error.
                      </p>
                    </div>
                    <ul className="space-y-2 pt-4 border-t border-slate-800 text-xs text-slate-400">
                      <li className="flex items-center gap-2">✓ 2:1 vs 3:1 resin viscosity formulas</li>
                      <li className="flex items-center gap-2">✓ Flawless cell &amp; lacing techniques</li>
                    </ul>
                  </div>

                  {/* Secret 2 */}
                  <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-8 shadow-xl flex flex-col justify-between hover:border-purple-500/50 transition-all">
                    <div>
                      <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-purple-400 font-black text-lg flex items-center justify-center mb-6">
                        02
                      </div>
                      <span className="text-xs font-bold uppercase tracking-wider text-purple-400 block mb-1">Secret #2 · Mindset</span>
                      <h3 className="text-xl font-bold text-white mb-3">The Signature Style Framework</h3>
                      <p className="text-slate-300 text-sm leading-relaxed mb-4">
                        Stop copying generic online templates. Develop a distinctive, identifiable signature aesthetic that makes customers willingly pay 3x–5x market rates.
                      </p>
                    </div>
                    <ul className="space-y-2 pt-4 border-t border-slate-800 text-xs text-slate-400">
                      <li className="flex items-center gap-2">✓ Geode inlay &amp; floral preservation</li>
                      <li className="flex items-center gap-2">✓ Premium packaging &amp; brand positioning</li>
                    </ul>
                  </div>

                  {/* Secret 3 */}
                  <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-8 shadow-xl flex flex-col justify-between hover:border-emerald-500/50 transition-all">
                    <div>
                      <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-black text-lg flex items-center justify-center mb-6">
                        03
                      </div>
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block mb-1">Secret #3 · Monetization</span>
                      <h3 className="text-xl font-bold text-white mb-3">The ₹3L/Month Revenue Engine</h3>
                      <p className="text-slate-300 text-sm leading-relaxed mb-4">
                        The exact client acquisition system to attract interior designers, corporate gifting orders, and bridal preservation clients without cold DMing.
                      </p>
                    </div>
                    <ul className="space-y-2 pt-4 border-t border-slate-800 text-xs text-slate-400">
                      <li className="flex items-center gap-2">✓ High-ticket custom quote formula</li>
                      <li className="flex items-center gap-2">✓ Zero-ad-spend client acquisition</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Comparison Table */}
            <section className="py-20 px-5 border-b border-slate-800/80 bg-slate-950">
              <div className="mx-auto max-w-5xl">
                <div className="text-center max-w-2xl mx-auto mb-12">
                  <span className="text-orange-400 text-xs font-black uppercase tracking-widest block mb-2">Clear Contrast</span>
                  <h2 className="text-3xl sm:text-4xl font-black text-white">Random Tutorials vs. The Ravishing Roadmap</h2>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm border-collapse rounded-2xl overflow-hidden border border-slate-800">
                    <thead>
                      <tr className="border-b border-slate-800 bg-slate-900">
                        <th className="p-4 font-bold text-slate-400 uppercase text-xs">Pillar</th>
                        <th className="p-4 font-bold text-red-400 uppercase text-xs">The Random Tutorial Route</th>
                        <th className="p-4 font-bold text-orange-400 uppercase text-xs">The Ravishing Art Masterclass</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80 bg-slate-900/40">
                      <tr>
                        <td className="p-4 font-bold text-white">Resin Chemistry</td>
                        <td className="p-4 text-slate-400">Trial and error; lots of sticky ruins and wasted resin.</td>
                        <td className="p-4 font-semibold text-emerald-400">Scientific gram-ratio precision; 0% sticky failures.</td>
                      </tr>
                      <tr>
                        <td className="p-4 font-bold text-white">Artistic Style</td>
                        <td className="p-4 text-slate-400">Copying whatever is trending; commoditized pricing.</td>
                        <td className="p-4 font-semibold text-emerald-400">Signature aesthetic; premium brand identity.</td>
                      </tr>
                      <tr>
                        <td className="p-4 font-bold text-white">Pricing Strategy</td>
                        <td className="p-4 text-slate-400">Guessing costs; undercharging out of fear.</td>
                        <td className="p-4 font-semibold text-emerald-400">Value-based pricing formula with 70%+ margins.</td>
                      </tr>
                      <tr>
                        <td className="p-4 font-bold text-white">Client Acquisition</td>
                        <td className="p-4 text-slate-400">Begging friends or praying for viral reels.</td>
                        <td className="p-4 font-semibold text-emerald-400">Inbound inquiries from interior designers &amp; gift buyers.</td>
                      </tr>
                      <tr>
                        <td className="p-4 font-bold text-white">Mentorship &amp; Support</td>
                        <td className="p-4 text-slate-400">Stuck with no one to answer technical doubts.</td>
                        <td className="p-4 font-semibold text-emerald-400">Direct coach support &amp; active sisterhood community.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* The 4 Essential Shifts */}
            <section className="py-20 px-5 bg-slate-900/40 border-b border-slate-800/80">
              <div className="mx-auto max-w-5xl">
                <div className="text-center max-w-2xl mx-auto mb-12">
                  <span className="text-orange-400 text-xs font-black uppercase tracking-widest block mb-2">Transformation</span>
                  <h2 className="text-3xl sm:text-4xl font-black text-white">The 4 Breakthrough Shifts You Experience</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                    <span className="text-xs font-black text-orange-400 uppercase tracking-wider block mb-1">Shift 1</span>
                    <h3 className="text-lg font-bold text-white mb-2">Clarity Over Confusion</h3>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      Know exactly what supplies to buy, which techniques to master, and what projects to build next without second-guessing.
                    </p>
                  </div>
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                    <span className="text-xs font-black text-amber-400 uppercase tracking-wider block mb-1">Shift 2</span>
                    <h3 className="text-lg font-bold text-white mb-2">Confidence Over Hesitation</h3>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      Say goodbye to the fear of ruined resin pours. Create crystal-clear, professional-grade pieces every single time.
                    </p>
                  </div>
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                    <span className="text-xs font-black text-cyan-400 uppercase tracking-wider block mb-1">Shift 3</span>
                    <h3 className="text-lg font-bold text-white mb-2">Identity Over Anonymity</h3>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      Establish yourself as a recognizable resin artist whose work people admire, tag, and proudly display in their homes.
                    </p>
                  </div>
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                    <span className="text-xs font-black text-emerald-400 uppercase tracking-wider block mb-1">Shift 4</span>
                    <h3 className="text-lg font-bold text-white mb-2">Income Over Expenses</h3>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      Transform resin crafting from a money-draining hobby into a rewarding business generating predictable monthly revenue.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Who This Is For */}
            <section className="py-20 px-5 border-b border-slate-800/80 bg-slate-950">
              <div className="mx-auto max-w-5xl">
                <div className="text-center max-w-2xl mx-auto mb-12">
                  <span className="text-orange-400 text-xs font-black uppercase tracking-widest block mb-2">Audience</span>
                  <h2 className="text-3xl sm:text-4xl font-black text-white">Who This Masterclass Is Specially For</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center">
                    <Brush size={28} className="text-orange-400 mx-auto mb-3" />
                    <h3 className="text-base font-bold text-white mb-2">Aspiring Resin Artists</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">Complete beginners who want to learn the craft correctly from day one without wasting money.</p>
                  </div>
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center">
                    <Palette size={28} className="text-amber-400 mx-auto mb-3" />
                    <h3 className="text-base font-bold text-white mb-2">Existing Crafters</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">Hobbyists who know basic pours but want to upgrade to high-ticket ocean art, geodes &amp; clocks.</p>
                  </div>
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center">
                    <Crown size={28} className="text-cyan-400 mx-auto mb-3" />
                    <h3 className="text-base font-bold text-white mb-2">Ambitious Women</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">Homemakers and working professionals seeking financial independence and personal recognition.</p>
                  </div>
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center">
                    <TrendingUp size={28} className="text-emerald-400 mx-auto mb-3" />
                    <h3 className="text-base font-bold text-white mb-2">Creative Sellers</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">Artists struggling with low sales who want a predictable client acquisition blueprint.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Exclusive Live Attendee Bonus: Clarity Kit */}
            <section className="py-20 px-5 bg-gradient-to-br from-orange-950/30 via-slate-900 to-slate-950 border-b border-slate-800/80">
              <div className="mx-auto max-w-5xl">
                <div className="bg-slate-900/90 border-2 border-orange-500/50 rounded-3xl p-8 md:p-12 shadow-2xl">
                  <div className="flex flex-col md:flex-row gap-8 items-center justify-between">
                    <div className="space-y-4 max-w-xl">
                      <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/30 px-3.5 py-1 rounded-full text-xs font-black text-orange-400 uppercase tracking-widest">
                        <Gift size={14} className="animate-bounce" /> Free Live Attendee Bonus (₹4,999 Value)
                      </div>
                      <h2 className="text-2xl sm:text-4xl font-black text-white">
                        The Resin Artist Clarity Kit
                      </h2>
                      <p className="text-slate-300 text-sm leading-relaxed">
                        Stay until the end of the 90-minute live session to receive our proprietary Clarity Kit directly via email and WhatsApp.
                      </p>
                      <div className="space-y-2 pt-2">
                        <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-200">
                          <CheckCircle2 size={16} className="text-orange-400 shrink-0" />
                          <span><strong>Bonus #1:</strong> Resin Safety, Ratio &amp; Bubble Elimination Sheet (₹1,499 Value)</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-200">
                          <CheckCircle2 size={16} className="text-orange-400 shrink-0" />
                          <span><strong>Bonus #2:</strong> Artwork Pricing Calculator &amp; Commission Pitch Sheet (₹1,999 Value)</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-200">
                          <CheckCircle2 size={16} className="text-orange-400 shrink-0" />
                          <span><strong>Bonus #3:</strong> Top 10 Bestselling Signature Products Blueprint (₹1,500 Value)</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 text-center shrink-0 w-full md:w-64 space-y-3">
                      <p className="text-xs uppercase font-bold text-slate-400 tracking-wider">Total Value</p>
                      <p className="text-3xl font-black text-white line-through decoration-red-500">₹4,999</p>
                      <p className="text-2xl font-black text-emerald-400">100% FREE</p>
                      <button
                        onClick={scrollToRegister}
                        className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider transition-all hover:scale-105 cursor-pointer shadow-lg"
                      >
                        Claim My Seat &amp; Bonuses
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* 90-Minute Agenda Breakdown */}
            <section className="py-20 px-5 border-b border-slate-800/80 bg-slate-950">
              <div className="mx-auto max-w-5xl">
                <div className="text-center max-w-2xl mx-auto mb-12">
                  <span className="text-orange-400 text-xs font-black uppercase tracking-widest block mb-2">Live Timeline</span>
                  <h2 className="text-3xl sm:text-4xl font-black text-white">90-Minute Masterclass Agenda</h2>
                </div>

                <div className="space-y-4 max-w-3xl mx-auto">
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                    <span className="bg-orange-500/10 text-orange-400 border border-orange-500/30 text-xs font-black px-3 py-1.5 rounded-lg shrink-0">
                      00 – 15 MIN
                    </span>
                    <div>
                      <h3 className="font-bold text-white text-base">The Science of Resin &amp; Bubble Elimination</h3>
                      <p className="text-xs text-slate-400 mt-0.5">Viscosity formulas, temperature control, and setting up an odor-free home workspace.</p>
                    </div>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                    <span className="bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-black px-3 py-1.5 rounded-lg shrink-0">
                      15 – 45 MIN
                    </span>
                    <div>
                      <h3 className="font-bold text-white text-base">Signature Technique Demonstration</h3>
                      <p className="text-xs text-slate-400 mt-0.5">Step-by-step ocean foam lacing, crystal geode placement, and floral preservation.</p>
                    </div>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                    <span className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs font-black px-3 py-1.5 rounded-lg shrink-0">
                      45 – 70 MIN
                    </span>
                    <div>
                      <h3 className="font-bold text-white text-base">The ₹3L/Month Monetization Blueprint</h3>
                      <p className="text-xs text-slate-400 mt-0.5">Pricing formula with 70%+ margins, attracting corporate clients, and high-ticket orders.</p>
                    </div>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                    <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-black px-3 py-1.5 rounded-lg shrink-0">
                      70 – 90 MIN
                    </span>
                    <div>
                      <h3 className="font-bold text-white text-base">Live Q&amp;A &amp; Clarity Kit Distribution</h3>
                      <p className="text-xs text-slate-400 mt-0.5">Live troubleshooting of your art questions plus instant delivery of the Clarity Kit.</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Fit Check: Who Should Attend vs Who Should Skip */}
            <section className="py-20 px-5 bg-slate-900/40 border-b border-slate-800/80">
              <div className="mx-auto max-w-5xl">
                <div className="text-center max-w-2xl mx-auto mb-12">
                  <span className="text-orange-400 text-xs font-black uppercase tracking-widest block mb-2">Alignment</span>
                  <h2 className="text-3xl sm:text-4xl font-black text-white">Is This Masterclass Right For You?</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-slate-900 border-2 border-emerald-500/40 rounded-3xl p-7 shadow-xl">
                    <h3 className="text-lg font-black text-emerald-400 mb-4 flex items-center gap-2">
                      <CheckCircle2 size={20} /> You Should Attend If:
                    </h3>
                    <ul className="space-y-3 text-xs sm:text-sm text-slate-300">
                      <li className="flex items-start gap-2.5">
                        <Check size={16} className="text-emerald-400 mt-0.5 shrink-0" />
                        You have passion for art and want structured, step-by-step guidance.
                      </li>
                      <li className="flex items-start gap-2.5">
                        <Check size={16} className="text-emerald-400 mt-0.5 shrink-0" />
                        You are willing to spend 90 focused minutes with a notebook.
                      </li>
                      <li className="flex items-start gap-2.5">
                        <Check size={16} className="text-emerald-400 mt-0.5 shrink-0" />
                        You want to build financial freedom and an identity of your own.
                      </li>
                    </ul>
                  </div>

                  <div className="bg-slate-900 border-2 border-red-500/40 rounded-3xl p-7 shadow-xl">
                    <h3 className="text-lg font-black text-red-400 mb-4 flex items-center gap-2">
                      <X size={20} /> You Should Skip If:
                    </h3>
                    <ul className="space-y-3 text-xs sm:text-sm text-slate-300">
                      <li className="flex items-start gap-2.5">
                        <X size={16} className="text-red-400 mt-0.5 shrink-0" />
                        You are looking for overnight get-rich schemes without practicing.
                      </li>
                      <li className="flex items-start gap-2.5">
                        <X size={16} className="text-red-400 mt-0.5 shrink-0" />
                        You are unwilling to learn the foundational chemistry of resin.
                      </li>
                      <li className="flex items-start gap-2.5">
                        <X size={16} className="text-red-400 mt-0.5 shrink-0" />
                        You cannot attend the live 90-minute session with full attention.
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Interactive FAQs Accordion */}
            <section className="py-20 px-5 border-b border-slate-800/80 bg-slate-950">
              <div className="mx-auto max-w-4xl">
                <div className="text-center max-w-2xl mx-auto mb-12">
                  <span className="text-orange-400 text-xs font-black uppercase tracking-widest block mb-2">Got Questions?</span>
                  <h2 className="text-3xl sm:text-4xl font-black text-white">Frequently Asked Questions</h2>
                </div>

                <div className="space-y-4">
                  {FAQS.map((faq, idx) => (
                    <div
                      key={idx}
                      className="border border-slate-800 rounded-2xl bg-slate-900/80 overflow-hidden transition-all"
                    >
                      <button
                        onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                        className="w-full p-5 text-left font-bold text-white text-sm sm:text-base flex items-center justify-between gap-4 cursor-pointer hover:text-orange-400 transition-colors"
                      >
                        <span>{faq.q}</span>
                        {openFaq === idx ? <ChevronUp size={18} className="text-orange-400 shrink-0" /> : <ChevronDown size={18} className="text-slate-400 shrink-0" />}
                      </button>
                      {openFaq === idx && (
                        <div className="px-5 pb-5 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/60 pt-3">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </section>

          </div>
        )}

        {/* ─── 8. FINAL EMOTIONAL CTA ─── */}
        <section className="py-20 sm:py-24 px-5 bg-gradient-to-b from-slate-950 to-slate-900 border-b border-slate-800/80 text-center relative z-10">
          <div className="mx-auto max-w-2xl">
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
              Your art deserves more than a place on your phone
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-8">
              You already have the spark. Now you need the skills, confidence and roadmap to give that spark a direction. Join the Resin Mastery Masterclass and discover how Mastery + Mindset + Monetization can change the way you see your resin journey.
            </p>

            <div className="mb-6">
              <WebinarCountdown onWebinarLoaded={(wb) => setActiveWebinar(wb)} />
            </div>

            <button
              onClick={scrollToRegister}
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-black shadow-xl shadow-orange-500/30 h-12 rounded-xl px-10 text-base transition-all hover:scale-105 cursor-pointer"
            >
              Reserve my free seat
              <ArrowRight className="ml-1.5 size-4" />
            </button>

            <p className="mt-4 text-sm font-bold text-orange-400">
              🔥 Live seats are limited. Register now before registration closes.
            </p>
            <p className="mt-2 text-xs uppercase tracking-widest text-slate-500 font-semibold">
              Free registration • 90-minute Masterclass • Practical clarity • Action-focused
            </p>
          </div>
        </section>
      </main>

      {/* ─── 9. STICKY BOTTOM REGISTRATION BAR ─── */}
      <div
        className={`fixed inset-x-0 bottom-0 z-50 border-t border-slate-800 bg-slate-950/95 backdrop-blur-xl transition-transform duration-300 ${
          showStickyBottom ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-3">
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-white">Resin Mastery Masterclass</span>
            <span className="hidden sm:inline text-xs text-orange-400 font-semibold">• 100% Free Live Session</span>
          </div>
          <button
            onClick={scrollToRegister}
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-black shadow-md h-9 rounded-xl px-5 text-xs transition-all cursor-pointer hover:scale-105"
          >
            Get my free seat
            <ArrowRight size={13} />
          </button>
        </div>
      </div>

      {/* ─── 10. FOOTER ─── */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-12 px-5 text-slate-400">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 sm:flex-row sm:items-center sm:justify-between pb-8">
          <div>
            <BrandLogo href="/" size="sm" />
            <p className="mt-2 max-w-sm text-xs text-slate-400">
              Resin Art • Identity • Financial Freedom
            </p>
          </div>
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-xs font-semibold text-slate-400">
            <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
            <li><Link href="/terms" className="hover:text-white transition-colors">Terms &amp; Conditions</Link></li>
            <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
          </ul>
        </div>
        <div className="border-t border-slate-800/80 pt-6 text-center sm:text-left">
          <p className="mx-auto max-w-6xl text-xs text-slate-400">
            © {new Date().getFullYear()} Ravishing Art Hub. All Rights Reserved. Income figures mentioned are business goals, not guaranteed outcomes.
          </p>
        </div>
      </footer>
    </div>
  );
}
