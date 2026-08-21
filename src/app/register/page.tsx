"use client";

import React, { useState, useEffect, Suspense } from "react";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { useAuth } from "@/context/AuthContext";
import {
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Trophy,
  Users,
  BookOpen,
  Zap,
  Flame,
  ShieldCheck
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { API_BASE_URL } from "@/config/api";

const PERKS = [
  { icon: <BookOpen size={18} className="text-orange-400" />, title: "Structured Curriculum", desc: "4 progressive tiers from beginner to mastery" },
  { icon: <Trophy size={18} className="text-amber-400" />, title: "Real Business Goals", desc: "Monetize your resin art — aim for ₹50k/mo" },
  { icon: <Users size={18} className="text-purple-400" />, title: "1-on-1 Mentor Critiques", desc: "Direct feedback from Vrajangna Patel" },
];

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  const isFastStartBundle = searchParams.get("bundle") === "fast-start" || searchParams.get("course") === "l0";

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    city: "",
    phone: "",
    bio: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const qName = searchParams.get("name") || "";
    const qEmail = searchParams.get("email") || "";
    const qPhone = searchParams.get("phone") || "";

    if (qName || qEmail || qPhone) {
      setForm(prev => ({
        ...prev,
        name: qName || prev.name,
        email: qEmail || prev.email,
        phone: qPhone || prev.phone,
      }));
    }
  }, [searchParams]);

  const update = (field: string, val: string) => setForm(f => ({ ...f, [field]: val }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Registration failed");
      }

      if (data.token) {
        login(data.token, data.user);
        router.push("/student/dashboard");
      } else {
        router.push("/login?registered=true");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 selection:bg-orange-500 selection:text-white">
      <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-center py-10">
        {/* Left: Branding & Value Props */}
        <div className="hidden lg:block space-y-6">
          <BrandLogo href="/" size="lg" />

          {isFastStartBundle ? (
            <div className="space-y-4 pt-2">
              <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full">
                <Flame size={14} className="text-orange-400" /> Fast-Track Special Access
              </div>
              <h1 className="text-4xl font-black text-white leading-tight">
                Resin Art Fast Start <span className="shimmer-text">Bundle (Level 0)</span>
              </h1>
              <p className="text-slate-300 text-sm leading-relaxed">
                Skip the webinar wait! Instant access to 4 foundational video lessons, chemical mixing cheat sheets, and student dashboard access.
              </p>
            </div>
          ) : (
            <div className="space-y-4 pt-2">
              <h1 className="text-4xl font-black text-white leading-tight">
                Transform Your Passion Into A <span className="shimmer-text">Thriving Art Brand</span>
              </h1>
              <p className="text-slate-400 text-sm leading-relaxed">
                Join 500+ artists mastering resin chemistry, crafting signature collections, and earning consistent revenue.
              </p>
            </div>
          )}

          <div className="space-y-3 pt-2">
            {PERKS.map((perk, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 shrink-0 mt-0.5">
                  {perk.icon}
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm">{perk.title}</h3>
                  <p className="text-slate-400 text-xs mt-0.5">{perk.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 p-5 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="flex gap-3 items-start">
              <div className="text-3xl shrink-0">🎨</div>
              <div>
                <p className="text-white font-bold text-sm">"My first ₹15,000 sale happened within 3 weeks of starting Level 0!"</p>
                <p className="text-slate-500 text-xs mt-1">— Priya S., Fast Start Graduate</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Form */}
        <div className="bg-slate-900/80 backdrop-blur-2xl border border-slate-800 rounded-3xl p-8 shadow-2xl shadow-black/50">
          <div className="lg:hidden text-center mb-6">
            <BrandLogo href="/" size="md" />
          </div>

          {isFastStartBundle ? (
            <div className="mb-6 pb-4 border-b border-slate-800">
              <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase text-orange-400 bg-orange-500/10 border border-orange-500/30 px-3 py-1 rounded-full mb-2">
                <Zap size={13} /> Fast Start Level 0
              </div>
              <h2 className="text-xl font-bold text-white">Create Your Academy Login</h2>
              <p className="text-slate-400 text-xs mt-1">Set your password to instantly unlock Level 0 courses &amp; dashboard.</p>
            </div>
          ) : (
            <div className="mb-6">
              <h2 className="text-xl font-bold text-white mb-1">Create your account</h2>
              <p className="text-slate-400 text-sm">Start your resin art journey today — it's free.</p>
            </div>
          )}

          {error && (
            <div className="mb-5 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Row 1: Name + City */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Full Name *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => update("name", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20 transition-all text-sm"
                  placeholder="Your full name"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">City</label>
                <input
                  type="text"
                  value={form.city}
                  onChange={e => update("city", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20 transition-all text-sm"
                  placeholder="e.g. Mumbai"
                />
              </div>
            </div>

            {/* Row 2: Email + Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Email Address *</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => update("email", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20 transition-all text-sm"
                  placeholder="artist@example.com"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={e => update("phone", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20 transition-all text-sm"
                  placeholder="+91 9876543210"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Password *</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={e => update("password", e.target.value)}
                  className="w-full px-4 py-3 pr-12 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20 transition-all text-sm"
                  placeholder="Minimum 6 characters"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Bio */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Art Goals / Experience <span className="text-slate-600 normal-case tracking-normal font-normal">(optional)</span>
              </label>
              <textarea
                value={form.bio}
                onChange={e => update("bio", e.target.value)}
                rows={2}
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20 transition-all text-sm resize-none"
                placeholder="Tell us about your resin art goals..."
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-4 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-orange-500 via-amber-400 to-orange-500 hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all shadow-lg shadow-orange-500/25 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-base mt-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-slate-950" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Setting up your student portal...
                </>
              ) : (
                <>
                  {isFastStartBundle ? "Unlock Level 0 & Enter Dashboard" : "Start My Journey"} <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-400">
            Already have an account?{" "}
            <Link href="/login" className="font-bold text-orange-400 hover:text-orange-300 transition-colors">
              Log in here →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">Loading...</div>}>
      <RegisterForm />
    </Suspense>
  );
}
