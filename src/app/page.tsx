"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { ArrowRight, Palette, Flame, Trophy, Star, Users, BookOpen, Award, ChevronRight, CheckCircle2, Sparkles, TrendingUp, Heart } from "lucide-react";

const STATS = [
  { value: "500+", label: "Active Students" },
  { value: "12+", label: "Premium Courses" },
  { value: "₹1Cr+", label: "Student Revenue" },
  { value: "4.9★", label: "Avg. Rating" },
];

const FEATURES = [
  {
    icon: BookOpen,
    color: "from-blue-500 to-cyan-500",
    glow: "shadow-blue-500/20",
    title: "Structured Curriculum",
    desc: "From zero to mastery — 4 membership levels (L0→L3) with step-by-step video & PDF lessons on resin art, business, and marketing.",
  },
  {
    icon: Flame,
    color: "from-orange-500 to-red-500",
    glow: "shadow-orange-500/20",
    title: "Daily Missions & Streaks",
    desc: "Submit daily tasks, earn XP points, maintain your streak, and see yourself climb the global leaderboard among 500+ artists.",
  },
  {
    icon: Trophy,
    color: "from-yellow-500 to-amber-500",
    glow: "shadow-yellow-500/20",
    title: "Earn Badges & Certificates",
    desc: "Unlock achievement badges as you hit milestones. Receive official certificates upon completing each membership level.",
  },
  {
    icon: TrendingUp,
    color: "from-green-500 to-teal-500",
    glow: "shadow-green-500/20",
    title: "Business & Sales Coaching",
    desc: "Track your real sales, set revenue milestones, and get mentored on building a profitable resin art brand from home.",
  },
  {
    icon: Users,
    color: "from-purple-500 to-pink-500",
    glow: "shadow-purple-500/20",
    title: "Win Wall & Community",
    desc: "Share your wins publicly, celebrate other artists, and be inspired by a community of 500+ passionate resin creators.",
  },
  {
    icon: Star,
    color: "from-pink-500 to-rose-500",
    glow: "shadow-pink-500/20",
    title: "Rewards Store",
    desc: "Redeem your earned XP points for exclusive perks: mentor sessions, discount coupons, resource guides, and more.",
  },
];

const JOURNEY = [
  { level: "L0", name: "Fast Start", color: "from-slate-600 to-slate-500", points: "0 – 500 XP", desc: "Learn resin basics, create your first 5 products, and discover your artistic voice." },
  { level: "L1", name: "Silver Member", color: "from-slate-400 to-slate-300", points: "500 – 5,000 XP", desc: "Master core techniques, launch your Instagram, and make your first sale." },
  { level: "L2", name: "Gold Member", color: "from-yellow-500 to-amber-400", points: "5,000 – 10,000 XP", desc: "Reach ₹25K/month consistently, run your first workshop, and grow your brand." },
  { level: "L3", name: "Diamond / Masters Club", color: "from-cyan-400 to-blue-400", points: "10,000+ XP", desc: "Launch your own course, mentor other artists, and build a scalable resin art empire." },
];

const TESTIMONIALS = [
  { name: "Priya Sharma", city: "Mumbai", level: "Gold Member", quote: "Within 3 months of joining, I made my first ₹50,000! The structured curriculum and community support made all the difference.", avatar: "P" },
  { name: "Neha Gupta", city: "Pune", level: "Diamond Club", quote: "I never thought I could run my own workshop. Ravishing Art Hub gave me the confidence and the step-by-step framework to do it.", avatar: "N" },
  { name: "Amit Patel", city: "Ahmedabad", level: "Silver Member", quote: "The daily missions keep me consistent. My XP streak is at 45 days and I've already completed 3 courses. Amazing platform!", avatar: "A" },
];

export default function Home() {
  const [counter, setCounter] = useState({ students: 0, revenue: 0, rating: 0 });

  useEffect(() => {
    const timer = setTimeout(() => {
      setCounter({ students: 500, revenue: 1, rating: 49 });
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden">
      
      {/* Grid background */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />

      {/* ─── NAVBAR ─── */}
      <nav className="sticky top-0 z-50 border-b border-slate-800/50 bg-slate-950/80 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/30">
              <Palette size={18} className="text-white" />
            </div>
            <span className="font-black text-lg text-white tracking-tight">Ravishing Art Hub</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-slate-400 hover:text-white font-semibold text-sm transition-colors px-4 py-2 rounded-xl hover:bg-slate-800">
              Log In
            </Link>
            <Link href="/register" className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-orange-500/25 flex items-center gap-1.5">
              Join Free <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </nav>

      {/* ─── HERO ─── */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Blobs */}
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-orange-500/12 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[400px] h-[400px] bg-blue-600/12 rounded-full blur-[120px]" />

        <div className="relative z-10 text-center max-w-4xl mx-auto px-6 py-24">
          <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-8">
            <Sparkles size={12} />
            India's #1 Resin Art Learning Platform
          </div>

          <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-none mb-6">
            Turn Your Passion
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-500 to-yellow-400">
              Into A Business.
            </span>
          </h1>

          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed">
            The complete resin art curriculum designed to take you from <strong className="text-slate-300">beginner</strong> to <strong className="text-slate-300">₹1 Lakh/month entrepreneur</strong> — with daily missions, community wins, and expert mentoring.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-20">
            <Link
              href="/register"
              className="px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-black rounded-2xl text-lg transition-all shadow-2xl shadow-orange-500/30 flex items-center gap-2 w-full sm:w-auto justify-center"
            >
              Start For Free <ArrowRight size={20} />
            </Link>
            <Link
              href="/login"
              className="px-8 py-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold rounded-2xl text-lg transition-all w-full sm:w-auto justify-center text-center"
            >
              I Have An Account
            </Link>
          </div>

          {/* Stats bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {STATS.map((s, i) => (
              <div key={i} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 text-center backdrop-blur-sm">
                <p className="text-2xl md:text-3xl font-black text-white mb-1">{s.value}</p>
                <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURES ─── */}
      <section className="py-24 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              Everything You Need To{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-400">Thrive</span>
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Not just courses. A complete ecosystem built for your transformation into a confident artist and entrepreneur.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => (
              <div key={i} className="group bg-slate-900 border border-slate-800 rounded-3xl p-7 hover:border-slate-700 transition-all hover:-translate-y-1 duration-300">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-5 shadow-lg ${f.glow}`}>
                  <f.icon size={22} className="text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── JOURNEY / MEMBERSHIP LEVELS ─── */}
      <section className="py-24 px-6 bg-slate-900/50 relative">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              Your 4-Level{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-400">Transformation Path</span>
            </h2>
            <p className="text-slate-400 text-lg">Each level unlocks new skills, tools, and income potential.</p>
          </div>

          <div className="space-y-4">
            {JOURNEY.map((j, i) => (
              <div key={i} className="flex gap-6 items-start bg-slate-900 border border-slate-800 rounded-3xl p-6 hover:border-slate-700 transition-colors group">
                <div className={`shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br ${j.color} flex flex-col items-center justify-center shadow-xl`}>
                  <span className="text-xs font-bold text-white/70 uppercase">{j.level}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <h3 className="text-xl font-black text-white">{j.name}</h3>
                    <span className="text-xs font-bold bg-slate-800 text-slate-400 px-3 py-1 rounded-full border border-slate-700">{j.points}</span>
                  </div>
                  <p className="text-slate-400 text-sm leading-relaxed">{j.desc}</p>
                </div>
                <ChevronRight size={20} className="text-slate-700 shrink-0 mt-1 group-hover:text-orange-500 transition-colors" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section className="py-24 px-6 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              Real Artists.{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-400">Real Results.</span>
            </h2>
            <p className="text-slate-400 text-lg">Join 500+ students who have transformed their passion into income.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="bg-slate-900 border border-slate-800 rounded-3xl p-7 flex flex-col">
                <div className="flex items-center gap-1 mb-5">
                  {[...Array(5)].map((_, si) => (
                    <Star key={si} size={14} className="text-orange-400 fill-orange-400" />
                  ))}
                </div>
                <p className="text-slate-300 text-sm leading-relaxed flex-1 mb-6 italic">"{t.quote}"</p>
                <div className="flex items-center gap-3 pt-5 border-t border-slate-800">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center font-black text-white">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-bold text-white text-sm">{t.name}</p>
                    <p className="text-xs text-slate-500">{t.city} · {t.level}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-600/20 to-yellow-600/10" />
        <div className="absolute inset-0 border-y border-orange-500/10" />
        
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-orange-500 to-orange-600 shadow-2xl shadow-orange-500/40 mb-8">
            <Heart size={36} className="text-white" />
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
            Ready to Start Your
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-400">Art Journey?</span>
          </h2>
          <p className="text-slate-400 text-lg mb-10 max-w-xl mx-auto">
            Join 500+ passionate resin artists and start building your dream business today. Free to join, powerful to grow with.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="px-10 py-5 bg-orange-500 hover:bg-orange-600 text-white font-black rounded-2xl text-xl transition-all shadow-2xl shadow-orange-500/30 flex items-center gap-2 justify-center"
            >
              Join Ravishing Art Hub <ArrowRight size={22} />
            </Link>
          </div>
          <p className="mt-6 text-slate-500 text-sm">No credit card required. Start free.</p>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="border-t border-slate-800 bg-slate-950 py-10 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-orange-500 flex items-center justify-center">
              <Palette size={18} className="text-white" />
            </div>
            <span className="font-black text-white tracking-tight">Ravishing Art Hub</span>
          </div>
          <p className="text-slate-500 text-sm">© 2024 Ravishing Art Hub. Empowering resin artists across India.</p>
          <div className="flex gap-6 text-sm text-slate-500">
            <Link href="/login" className="hover:text-white transition-colors">Login</Link>
            <Link href="/register" className="hover:text-white transition-colors">Register</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
