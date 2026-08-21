"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { WebinarCountdown } from "@/components/webinar/WebinarCountdown";
import { SocialProofToaster } from "@/components/webinar/SocialProofToaster";
import { ExitIntentModal } from "@/components/webinar/ExitIntentModal";
import { API_BASE_URL } from "@/config/api";
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
  Check
} from "lucide-react";

export default function WebinarPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    challenge: "",
    consent: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

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
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to register");
      }

      // Store lead info in sessionStorage for thank you page personalization
      if (typeof window !== "undefined") {
        sessionStorage.setItem("webinar_lead", JSON.stringify(data.data || form));
      }

      router.push("/thank-you");
    } catch (err: any) {
      // Fallback redirection even if network is slow
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

  const FAQS = [
    {
      q: "Is the Masterclass really 100% free?",
      a: "Yes! There are no hidden fees or credit card requirements. This is a complimentary 90-minute live training designed to show you the science, art, and business of resin craftsmanship.",
    },
    {
      q: "Do I need any prior art experience or equipment to attend?",
      a: "No prior experience or tools are required. You just need a phone or laptop with Zoom and a notebook. We will teach you foundational chemistry, color mixing, and step-by-step techniques from square one.",
    },
    {
      q: "Will there be a recording/replay sent?",
      a: "Because this is an interactive live training with live Q&A and a free Clarity Kit distribution, recordings are only guaranteed for live attendees. Make sure to attend live to claim your ₹4,999 bonuses.",
    },
    {
      q: "How will I receive the Zoom link and Masterclass details?",
      a: "The Zoom access link and calendar invitation will be sent instantly to your registered Email and WhatsApp number immediately after signing up.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-orange-500 selection:text-white relative">
      <SocialProofToaster />
      <ExitIntentModal onClaimSeat={scrollToRegister} />

      {/* ─── TOP ANNOUNCEMENT URGENCY BANNER ─── */}
      <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-600 text-white py-2.5 px-4 text-center text-xs md:text-sm font-bold shadow-md sticky top-0 z-50 flex items-center justify-center gap-3">
        <span className="flex items-center gap-1.5 animate-pulse">
          <Flame size={16} className="text-amber-200" /> LIVE MASTERCLASS THIS SUNDAY · 8:00 PM IST
        </span>
        <span className="hidden sm:inline bg-black/20 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border border-white/20">
          Only 12 Free Seats Left
        </span>
        <button
          onClick={scrollToRegister}
          className="bg-white text-orange-600 text-xs px-3 py-1 rounded-lg font-black hover:bg-orange-50 transition-colors shadow-sm ml-1 cursor-pointer"
        >
          Claim Seat →
        </button>
      </div>

      {/* ─── NAVBAR ─── */}
      <header className="border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-xl py-4 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <BrandLogo href="/" size="md" />
          <button
            onClick={scrollToRegister}
            className="px-5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs md:text-sm transition-all shadow-lg shadow-orange-500/20 flex items-center gap-1.5 cursor-pointer"
          >
            Reserve My Free Seat <ArrowRight size={14} />
          </button>
        </div>
      </header>

      {/* ─── HERO SECTION WITH REGISTRATION FORM ─── */}
      <section className="relative pt-12 pb-20 px-6 overflow-hidden">
        {/* Glow Blobs */}
        <div className="absolute -top-[10%] left-[15%] w-[600px] h-[600px] bg-orange-500/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-[40%] -right-[10%] w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[130px] pointer-events-none" />

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headlines & Social Proof */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full">
              <Sparkles size={14} className="text-orange-400 animate-pulse" />
              <span>100% Free · 90-Minute Live Masterclass</span>
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white leading-[1.15] tracking-tight">
              From Resin Art Passion to a{" "}
              <span className="shimmer-text">₹3 Lakh/Month</span> Business
            </h1>

            <p className="text-slate-300 text-base md:text-xl leading-relaxed max-w-2xl mx-auto lg:mx-0 font-normal">
              Without random YouTube tutorials, sticky resin ruins, self-doubt, or market guesswork. Discover the proven 3-pillar blueprint to craft gallery-worthy art and scale your brand.
            </p>

            {/* Scarcity Progress Bar */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 max-w-lg mx-auto lg:mx-0 shadow-lg">
              <div className="flex justify-between text-xs font-bold mb-2">
                <span className="text-orange-400 flex items-center gap-1.5">
                  <Flame size={14} /> 88 Live Seats Claimed
                </span>
                <span className="text-emerald-400">82% Room Full</span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-3 overflow-hidden border border-slate-800">
                <div
                  className="bg-gradient-to-r from-orange-500 to-amber-400 h-full rounded-full transition-all duration-1000"
                  style={{ width: "82%" }}
                />
              </div>
            </div>

            {/* Countdown Box */}
            <div className="pt-2">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                Live Class Starts In:
              </p>
              <WebinarCountdown />
            </div>

            {/* Mentor Badge */}
            <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-4 border-t border-slate-800/80">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-orange-500 to-amber-400 flex items-center justify-center font-black text-slate-950 text-lg shadow-md">
                  V
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-white leading-tight">Vrajangna Patel</p>
                  <p className="text-xs text-orange-400 font-semibold">54,000+ Artists Mentored · Hall of Fame Awardee</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: High-Converting Registration Form */}
          <div className="lg:col-span-5" id="register">
            <div className="bg-slate-900/90 backdrop-blur-2xl border-2 border-orange-500/40 rounded-3xl p-7 md:p-9 shadow-2xl shadow-black/80 relative">
              <div className="absolute -top-3.5 right-6 bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-black text-[11px] uppercase tracking-wider px-3.5 py-1 rounded-full shadow-md">
                100% Free Registration
              </div>

              <h2 className="text-2xl font-black text-white mb-1">Reserve Your Free Seat</h2>
              <p className="text-slate-400 text-xs mb-6">
                Where should we send your Zoom joining link &amp; Clarity Kit?
              </p>

              {error && (
                <div className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={e => update("name", e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/30 transition-all text-sm"
                    placeholder="e.g. Jane Doe"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => update("email", e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/30 transition-all text-sm"
                    placeholder="jane@example.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    WhatsApp Number * <span className="text-orange-400 lowercase font-normal">(for VIP link &amp; updates)</span>
                  </label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={e => update("phone", e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/30 transition-all text-sm"
                    placeholder="+91 98765 43210"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    Your Biggest Challenge With Resin Art <span className="text-slate-600 font-normal lowercase">(optional)</span>
                  </label>
                  <textarea
                    value={form.challenge}
                    onChange={e => update("challenge", e.target.value)}
                    rows={2}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/30 transition-all text-sm resize-none"
                    placeholder="e.g. Micro-bubbles, pricing my work, finding clients..."
                  />
                </div>

                <div className="flex items-start gap-2.5 pt-1">
                  <input
                    type="checkbox"
                    id="consent"
                    checked={form.consent}
                    onChange={e => update("consent", e.target.checked)}
                    className="mt-1 w-4 h-4 rounded border-slate-800 bg-slate-950 text-orange-500 focus:ring-0 cursor-pointer"
                  />
                  <label htmlFor="consent" className="text-[11px] text-slate-400 leading-tight cursor-pointer">
                    I agree to receive Masterclass reminders &amp; Zoom details on WhatsApp and Email. Never spam.
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 px-4 rounded-2xl font-black text-slate-950 bg-gradient-to-r from-orange-500 via-amber-400 to-orange-500 hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all shadow-xl shadow-orange-500/30 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-base mt-3 cursor-pointer"
                >
                  {loading ? "Securing Your Seat..." : "Yes! I Want My Free Seat →"}
                </button>
              </form>

              <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1"><ShieldCheck size={13} className="text-emerald-400" /> 100% Free</span>
                <span className="flex items-center gap-1"><Lock size={13} className="text-slate-400" /> No Card Needed</span>
                <span className="flex items-center gap-1"><Gift size={13} className="text-amber-400" /> ₹4,999 Kit Free</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECTION 2: THE 3 CORE PILLARS YOU WILL DISCOVER ─── */}
      <section className="py-20 px-6 bg-slate-900/50 border-y border-slate-800/80">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-orange-400 text-xs font-black uppercase tracking-widest block mb-2">Masterclass Curriculum</span>
            <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
              The 3 Secrets to Building a ₹3L/Month Resin Brand
            </h2>
            <p className="text-slate-400 text-base md:text-lg">
              I've designed this session around the three elements most aspiring resin artists lack: Mastery, Mindset, and Monetization.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Secret 1 */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-8 flex flex-col justify-between hover:border-orange-500/40 transition-all shadow-xl">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-6 font-black text-lg">
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
                <li className="flex items-center gap-2">✓ Flawless cell creation techniques</li>
              </ul>
            </div>

            {/* Secret 2 */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-8 flex flex-col justify-between hover:border-purple-500/40 transition-all shadow-xl">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-6 font-black text-lg">
                  02
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-purple-400 block mb-1">Secret #2 · Mindset &amp; Artistry</span>
                <h3 className="text-xl font-bold text-white mb-3">The High-Margin Signature Portfolio</h3>
                <p className="text-slate-300 text-sm leading-relaxed mb-4">
                  Stop competing on ₹500 keychains. Learn to craft high-ticket 3D crystal geode clocks (₹8k–₹15k) and bridal flower preservation keepsakes (₹12k–₹25k).
                </p>
              </div>
              <ul className="space-y-2 pt-4 border-t border-slate-800 text-xs text-slate-400">
                <li className="flex items-center gap-2">✓ Real quartz &amp; gold veining mastery</li>
                <li className="flex items-center gap-2">✓ Anti-yellowing preservation science</li>
              </ul>
            </div>

            {/* Secret 3 */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-8 flex flex-col justify-between hover:border-amber-500/40 transition-all shadow-xl">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-6 font-black text-lg">
                  03
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block mb-1">Secret #3 · Monetization</span>
                <h3 className="text-xl font-bold text-white mb-3">The ₹3 Lakh/Month Client Funnel</h3>
                <p className="text-slate-300 text-sm leading-relaxed mb-4">
                  The exact pricing formula with 4x profit margins, Instagram Reels aesthetic blueprint, and zero-breakage courier packaging for pan-India delivery.
                </p>
              </div>
              <ul className="space-y-2 pt-4 border-t border-slate-800 text-xs text-slate-400">
                <li className="flex items-center gap-2">✓ Pricing calculator with material costs</li>
                <li className="flex items-center gap-2">✓ Converting Instagram DMs into paying clients</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECTION 3: THE SHIFT (OLD WAY VS PROVEN WAY) ─── */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-orange-400 text-xs font-black uppercase tracking-widest block mb-2">The Transformation</span>
            <h2 className="text-3xl md:text-4xl font-black text-white">
              Why Most Aspiring Artists Stay Stuck vs. How You Will Succeed
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* The Old Way */}
            <div className="bg-red-500/5 border border-red-500/20 rounded-3xl p-8 space-y-4">
              <h3 className="text-lg font-black text-red-400 flex items-center gap-2">
                ❌ The Old Way (Guesswork &amp; Frustration)
              </h3>
              <ul className="space-y-3 text-sm text-slate-300">
                <li className="flex items-start gap-2.5">
                  <span className="text-red-400 shrink-0 font-bold">•</span>
                  <span>Wasting ₹10,000+ on sticky, bendy, or ruined epoxy pours.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-red-400 shrink-0 font-bold">•</span>
                  <span>Following disjointed 30-second reels with no formula context.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-red-400 shrink-0 font-bold">•</span>
                  <span>Undercharging out of fear and selling items for barely cost price.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-red-400 shrink-0 font-bold">•</span>
                  <span>Feeling isolated with zero mentors to critique your wave lacing.</span>
                </li>
              </ul>
            </div>

            {/* The Proven Academy Way */}
            <div className="bg-emerald-500/5 border border-emerald-500/25 rounded-3xl p-8 space-y-4">
              <h3 className="text-lg font-black text-emerald-400 flex items-center gap-2">
                ✅ The Ravishing Art Hub Way
              </h3>
              <ul className="space-y-3 text-sm text-slate-200">
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-400 shrink-0 font-bold">✓</span>
                  <span>Gram-scale exact chemical measurements with 100% cure success.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-400 shrink-0 font-bold">✓</span>
                  <span>Direct pan-India verified supplier directory with wholesale rates.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-400 shrink-0 font-bold">✓</span>
                  <span>High-margin custom commissions (₹8,000–₹25,000 per order).</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-400 shrink-0 font-bold">✓</span>
                  <span>Daily Action Missions, XP rewards, and mentor critiques from Vrajangna Patel.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECTION 4: CLARITY KIT VALUE STACK (FREE BONUSES) ─── */}
      <section className="py-20 px-6 bg-slate-900/60 border-y border-slate-800/80 relative">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-6">
            <Gift size={15} /> Free For Live Attendees (Worth ₹4,999)
          </div>

          <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
            The Resin Artist's Clarity Kit
          </h2>
          <p className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto mb-12">
            Attend live and download these 3 actionable resources to accelerate your art journey immediately.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left mb-12">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
              <span className="text-2xl mb-3 block">📊</span>
              <h4 className="font-bold text-white text-base mb-1">Resin Chemistry &amp; Gram Formula Calculator</h4>
              <p className="text-slate-400 text-xs leading-relaxed">Exact mix ratios for coasters, deep pours, clocks, and topcoats with zero bubbles.</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
              <span className="text-2xl mb-3 block">📦</span>
              <h4 className="font-bold text-white text-base mb-1">Verified Pan-India Supplier Directory</h4>
              <p className="text-slate-400 text-xs leading-relaxed">Direct contacts for crystal-clear epoxies, silicone molds, mica luster &amp; pigments at student rates.</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
              <span className="text-2xl mb-3 block">💰</span>
              <h4 className="font-bold text-white text-base mb-1">Instagram Art Pricing &amp; Profit Formula</h4>
              <p className="text-slate-400 text-xs leading-relaxed">How to price your pieces with 4x markup and close high-ticket custom client orders.</p>
            </div>
          </div>

          <button
            onClick={scrollToRegister}
            className="px-8 py-4 bg-orange-500 hover:bg-orange-600 text-slate-950 font-black rounded-2xl text-base transition-all shadow-xl shadow-orange-500/25 inline-flex items-center gap-2 cursor-pointer"
          >
            Claim Clarity Kit &amp; Free Seat <ArrowRight size={18} />
          </button>
        </div>
      </section>

      {/* ─── SECTION 5: MENTOR AUTHORITY SHOWCASE ─── */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto bg-slate-900/80 border border-slate-800 rounded-3xl p-8 md:p-12 shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-4 text-center">
              <div className="w-36 h-36 rounded-3xl bg-gradient-to-tr from-orange-500 to-amber-400 flex items-center justify-center font-black text-slate-950 text-6xl mx-auto mb-4 shadow-2xl shadow-orange-500/30">
                V
              </div>
              <h3 className="text-xl font-black text-white">Vrajangna Patel</h3>
              <p className="text-xs text-orange-400 font-bold mt-0.5">Master Resin Artist &amp; Mentor</p>
            </div>

            <div className="md:col-span-8 space-y-4">
              <h4 className="text-2xl font-black text-white leading-tight">
                "Don't just learn resin. Learn how to make your art skills matter in the market."
              </h4>
              <p className="text-slate-300 text-sm leading-relaxed">
                Over the past 10 years, I've guided more than 54,000 students from complete beginners to independent studio owners selling clocks, dining tables, and wedding keepsakes. My mission is to empower women and creators with real creative independence.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-3">
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-center">
                  <p className="text-lg font-black text-orange-400">🏆 2022</p>
                  <p className="text-[11px] text-slate-400 font-semibold">Hall of Fame Award</p>
                </div>
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-center">
                  <p className="text-lg font-black text-amber-400">📖 Best Seller</p>
                  <p className="text-[11px] text-slate-400 font-semibold">I Can Coach Author</p>
                </div>
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-center col-span-2 sm:col-span-1">
                  <p className="text-lg font-black text-emerald-400">54,000+</p>
                  <p className="text-[11px] text-slate-400 font-semibold">Students Mentored</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECTION 6: FAQS ─── */}
      <section className="py-20 px-6 bg-slate-900/30 border-t border-slate-800/80">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-orange-400 text-xs font-black uppercase tracking-widest block mb-2">Got Questions?</span>
            <h2 className="text-3xl md:text-4xl font-black text-white">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, idx) => (
              <div
                key={idx}
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 cursor-pointer hover:border-slate-700 transition-colors"
              >
                <div className="flex justify-between items-center gap-4">
                  <h3 className="font-bold text-white text-base md:text-lg flex items-center gap-2">
                    <HelpCircle size={18} className="text-orange-400 shrink-0" />
                    {faq.q}
                  </h3>
                  <span className="text-slate-400 font-black text-xl">
                    {openFaq === idx ? "−" : "+"}
                  </span>
                </div>
                {openFaq === idx && (
                  <p className="mt-4 text-slate-300 text-sm leading-relaxed border-t border-slate-800 pt-4">
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA BANNER ─── */}
      <section className="py-24 px-6 relative overflow-hidden bg-gradient-to-b from-orange-600/10 via-amber-600/5 to-slate-950 text-center">
        <div className="max-w-4xl mx-auto relative z-10 space-y-6">
          <h2 className="text-4xl md:text-6xl font-black text-white leading-tight">
            Your Art Deserves More Than A Place on Your Phone.
          </h2>
          <p className="text-slate-300 text-base md:text-xl max-w-2xl mx-auto leading-relaxed">
            You already have the creative spark. Now give that spark the exact skills, confidence, and business roadmap it needs.
          </p>
          <button
            onClick={scrollToRegister}
            className="px-10 py-5 bg-gradient-to-r from-orange-500 via-amber-400 to-orange-500 hover:opacity-95 text-slate-950 font-black rounded-2xl text-xl transition-all shadow-2xl shadow-orange-500/30 inline-flex items-center gap-3 cursor-pointer hover:scale-105"
          >
            Reserve My Free Seat Now <ArrowRight size={22} />
          </button>
          <p className="text-xs text-slate-500">
            🔥 Live seats are strictly limited. Register now before registration closes.
          </p>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-10 px-6 text-center text-xs text-slate-500 space-y-2">
        <BrandLogo href="/" size="sm" className="justify-center mb-3" />
        <p>© 2026 Ravishing Art Hub. All Rights Reserved. Income figures mentioned are business goals, not guaranteed outcomes.</p>
        <p>Resin Art · Identity · Financial Freedom</p>
      </footer>
    </div>
  );
}
