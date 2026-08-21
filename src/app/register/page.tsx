"use client";

import React, { useState } from "react";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { useAuth } from "@/context/AuthContext";
import { Eye, EyeOff, Sparkles, ArrowRight, CheckCircle2, Trophy, Users, BookOpen } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "@/config/api";

const PERKS = [
  { icon: <BookOpen size={18} className="text-orange-400" />, title: "Structured Curriculum", desc: "4 progressive tiers from beginner to mastery" },
  { icon: <Trophy size={18} className="text-amber-400" />, title: "Real Business Goals", desc: "Monetize your resin art — aim for ₹50k/mo" },
  { icon: <Users size={18} className="text-purple-400" />, title: "1-on-1 Mentor Critiques", desc: "Direct feedback from Vrajangna Patel" },
];

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();
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
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background glow blobs */}
      <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-orange-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left: Branding & Perks */}
        <div className="hidden lg:block space-y-6 pr-4">
          <div className="mb-4">
            <BrandLogo href="/" size="lg" />
          </div>

          <h1 className="text-3xl font-black text-white leading-tight">
            Transform from Beginner to a Profitable Resin Artist
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed">
            Join thousands of creators learning the science, art, and business of resin craftsmanship.
          </p>

          <div className="space-y-4 pt-2">
            {PERKS.map((perk, i) => (
              <div key={i} className="flex gap-3 items-start">
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
              <div className="text-3xl shrink-0">💬</div>
              <div>
                <p className="text-white font-bold text-sm">"My first ₹50,000 sale happened within 3 months of joining!"</p>
                <p className="text-slate-500 text-xs mt-1">— Priya S., Diamond Club Member</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Form */}
        <div className="bg-slate-900/80 backdrop-blur-2xl border border-slate-800 rounded-3xl p-8 shadow-2xl shadow-black/50">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-6">
            <BrandLogo href="/" size="md" />
          </div>

          <h2 className="text-xl font-bold text-white mb-1">Create your account</h2>
          <p className="text-slate-400 text-sm mb-7">Start your resin art journey today — it's free.</p>

          {error && (
            <div className="mb-5 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Row 1: Name + Email */}
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
                About You <span className="text-slate-600 normal-case tracking-normal font-normal">(optional)</span>
              </label>
              <textarea
                value={form.bio}
                onChange={e => update("bio", e.target.value)}
                rows={2}
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20 transition-all text-sm resize-none"
                placeholder="Tell us a little about yourself and your art goals..."
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-4 rounded-xl font-bold text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all shadow-lg shadow-orange-500/25 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-base mt-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating account...
                </>
              ) : (
                <>
                  Start My Journey <ArrowRight size={18} />
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
