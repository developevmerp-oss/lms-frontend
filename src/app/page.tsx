"use client";

import { BrandLogo } from "@/components/ui/BrandLogo";
import Link from "next/link";
import React, { useState } from "react";
import {
  ArrowRight,
  Palette,
  Flame,
  Trophy,
  Star,
  Users,
  Sparkles,
  TrendingUp,
  Heart,
  Brush,
  Layers,
  Clock,
  Gem,
  CheckCircle2,
  PlayCircle,
  HelpCircle,
  Compass,
  Check,
  Crown,
  Award,
  BookOpen,
  Target,
  ShieldCheck,
  Smile,
  Zap,
  MessageCircle,
  Briefcase,
  Globe
} from "lucide-react";

// Student Artworks for the Exhibition Marquee
const ARTWORKS_ROW_1 = [
  {
    title: "Caribbean Ocean Wave Board",
    artist: "Priya S.",
    type: "Ocean Lacing & Resin Wave",
    level: "Gold Member",
    price: "₹14,500 Sold",
    gradient: "from-cyan-600 via-teal-700 to-blue-900",
    accent: "text-cyan-300",
    badge: "Ocean Art"
  },
  {
    title: "Amethyst Crystal Agate Clock",
    artist: "Aarav K.",
    type: "3D Geode & Crushed Glass",
    level: "Silver Member",
    price: "₹8,900 Sold",
    gradient: "from-purple-700 via-indigo-800 to-slate-900",
    accent: "text-purple-300",
    badge: "Geode Inlay"
  },
  {
    title: "Emerald Gold Leaf Dining River",
    artist: "Neha & Team",
    type: "Deep Pour Furniture",
    level: "Diamond Club",
    price: "₹68,000 Sold",
    gradient: "from-emerald-700 via-teal-900 to-slate-950",
    accent: "text-emerald-300",
    badge: "Master Furniture"
  },
  {
    title: "Celestial Moon Phase Mirror",
    artist: "Ritu M.",
    type: "Holographic Mica Effects",
    level: "Silver Member",
    price: "₹6,200 Sold",
    gradient: "from-blue-700 via-violet-900 to-slate-950",
    accent: "text-blue-300",
    badge: "Wall Art"
  },
  {
    title: "Rose Quartz Jaimala Preservation",
    artist: "Kavita D.",
    type: "Floral Memory Block",
    level: "Gold Member",
    price: "₹18,000 Sold",
    gradient: "from-rose-600 via-pink-800 to-purple-950",
    accent: "text-pink-300",
    badge: "Preservation"
  }
];

const ARTWORKS_ROW_2 = [
  {
    title: "Obsidian & Gold Flake Geode Set",
    artist: "Vikram R.",
    type: "Crushed Fire Glass & Pigment",
    level: "Silver Member",
    price: "₹9,500 Sold",
    gradient: "from-amber-600 via-orange-800 to-stone-950",
    accent: "text-amber-300",
    badge: "Coaster Suite"
  },
  {
    title: "Santorini Coast Wall Canvas (3ft)",
    artist: "Ananya B.",
    type: "Multi-Layer Deep Cell Ocean",
    level: "Diamond Club",
    price: "₹34,000 Sold",
    gradient: "from-sky-500 via-blue-700 to-indigo-950",
    accent: "text-sky-300",
    badge: "Statement Piece"
  },
  {
    title: "Kintsugi Gold Cracked Marble Platter",
    artist: "Suresh P.",
    type: "Japanese Epoxy Repair Style",
    level: "Gold Member",
    price: "₹11,200 Sold",
    gradient: "from-slate-700 via-amber-800 to-stone-900",
    accent: "text-amber-200",
    badge: "Luxe Decor"
  },
  {
    title: "Nebula Galaxy Roman Numeral Clock",
    artist: "Deepika T.",
    type: "Color Shift & Mirror Gold Rim",
    level: "Silver Member",
    price: "₹12,800 Sold",
    gradient: "from-fuchsia-700 via-purple-900 to-slate-950",
    accent: "text-fuchsia-300",
    badge: "Timepiece"
  },
  {
    title: "Botanical Gold Leaf Coaster Guild",
    artist: "Meera J.",
    type: "Encapsulated Flora & Foil",
    level: "Bronze Artist",
    price: "₹4,800 Sold",
    gradient: "from-yellow-600 via-amber-700 to-stone-900",
    accent: "text-yellow-200",
    badge: "Guild Set"
  }
];

// 6 Dimensions of Success Data
const SIX_DIMENSIONS = [
  {
    icon: Palette,
    title: "Skill",
    description: "How confidently and consistently you can create quality Resin Art.",
    color: "from-orange-500/20 to-amber-500/10",
    border: "hover:border-orange-500/50",
    badge: "Mastery"
  },
  {
    icon: Sparkles,
    title: "Creativity",
    description: "How effectively you experiment, innovate and develop your own artistic expression.",
    color: "from-purple-500/20 to-pink-500/10",
    border: "hover:border-purple-500/50",
    badge: "Innovation"
  },
  {
    icon: Crown,
    title: "Identity",
    description: "How clearly you develop your personal style, portfolio and recognition as an artist.",
    color: "from-cyan-500/20 to-blue-500/10",
    border: "hover:border-cyan-500/50",
    badge: "Signature"
  },
  {
    icon: Briefcase,
    title: "Business",
    description: "How effectively you turn your skill and creations into products, customers and opportunities.",
    color: "from-emerald-500/20 to-teal-500/10",
    border: "hover:border-emerald-500/50",
    badge: "Monetization"
  },
  {
    icon: Globe,
    title: "Impact",
    description: "How your knowledge, creations and journey create value for customers and inspire others.",
    color: "from-amber-500/20 to-yellow-500/10",
    border: "hover:border-amber-500/50",
    badge: "Inspiration"
  },
  {
    icon: Heart,
    title: "Personal Growth",
    description: "How much you grow in confidence, discipline, leadership and belief in yourself.",
    color: "from-rose-500/20 to-pink-500/10",
    border: "hover:border-rose-500/50",
    badge: "Confidence"
  }
];

// FAQs Data
const FAQS = [
  {
    q: "Do I need prior painting or art experience to start?",
    a: "Not at all! Over 80% of our successful students started with zero background in art. Our structured curriculum breaks down resin chemistry, safety, viscosity, and color pouring step-by-step."
  },
  {
    q: "What materials do I need to get started?",
    a: "In the Level 0 Fast Track, we guide you on exact beginner kits, mixing ratios (2:1 & 3:1), silicone molds, pigments, and safety masks so you avoid costly material wastage."
  },
  {
    q: "How does the gamified LMS with XP and badges work?",
    a: "Every time you complete video modules, finish daily missions, or submit your poured artwork for mentor critique, you earn XP points, build daily streaks, and unlock official level certifications."
  },
  {
    q: "Can I truly turn this into a profitable business from home?",
    a: "Yes! Resin decor like luxury clocks (₹5,000–₹15,000), wedding flower preservations (₹8,000–₹25,000), and ocean tables (₹20,000–₹80,000) command strong luxury margins across India."
  }
];

export default function HomePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-orange-500 selection:text-slate-950 font-sans overflow-x-hidden">

      {/* ─── LUXURY BACKGROUND GLOW ACCENTS ─── */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[550px] bg-gradient-to-b from-orange-600/15 via-amber-600/5 to-transparent blur-[140px]" />
        <div className="absolute top-[30%] right-[-10%] w-[600px] h-[600px] bg-purple-600/10 blur-[150px]" />
        <div className="absolute top-[65%] left-[-10%] w-[600px] h-[600px] bg-cyan-600/10 blur-[150px]" />
      </div>

      {/* ─── NAVIGATION BAR ─── */}
      <nav className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80 px-6 py-4 transition-all">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <BrandLogo size="md" />
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-300">
            <Link href="#problem" className="hover:text-orange-400 transition-colors">The Problem</Link>
            <Link href="#reframe" className="hover:text-orange-400 transition-colors">The Reframe</Link>
            <Link href="#learn" className="hover:text-orange-400 transition-colors">Curriculum</Link>
            <Link href="#dimensions" className="hover:text-orange-400 transition-colors">6 Dimensions</Link>
            <Link href="#mentor" className="hover:text-orange-400 transition-colors">About Vrajangna</Link>
            <Link href="#reviews" className="hover:text-orange-400 transition-colors">Reviews</Link>
            <Link href="#journey" className="hover:text-orange-400 transition-colors">Membership</Link>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-xs md:text-sm font-bold text-slate-300 hover:text-white px-4 py-2 rounded-xl transition-all"
            >
              Sign In
            </Link>
            <Link
              href="/webinar"
              className="text-xs md:text-sm font-black bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 px-5 py-2.5 rounded-xl shadow-lg shadow-orange-500/20 hover:scale-105 transition-all flex items-center gap-1.5"
            >
              Free Masterclass <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </nav>

      {/* ─── SECTION 1: HERO SECTION ─── */}
      <section className="relative pt-20 pb-16 px-6 z-10">
        <div className="max-w-6xl mx-auto text-center">

          {/* Social Proof Badge */}
          <div className="inline-flex items-center gap-2.5 bg-orange-500/10 border border-orange-500/30 text-orange-300 text-xs font-bold uppercase tracking-widest px-5 py-2 rounded-full mb-8 backdrop-blur-md shadow-inner">
            <Sparkles size={14} className="text-orange-400 animate-pulse" />
            <span>India's #1 Resin Art &amp; Creative Business Hub</span>
            <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
            <span className="text-slate-300 font-semibold">52K+ Students</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[1.12] mb-8">
            Turn Your Resin Art Passion Into{" "}
            <span className="shimmer-text">Skill, Identity &amp; Financial Freedom</span>
          </h1>

          {/* Subtitle */}
          <p className="text-slate-300 text-lg md:text-xl max-w-3xl mx-auto mb-6 leading-relaxed font-normal">
            You already have the creativity. You already have the passion. What you need is the right path to turn that passion into something that gives you confidence, recognition, income and freedom.
          </p>

          {/* Core Pillars Banner */}
          <div className="inline-flex flex-wrap justify-center items-center gap-2 md:gap-4 text-xs md:text-sm font-bold text-orange-300 bg-slate-900/90 border border-orange-500/30 rounded-2xl px-6 py-3 mb-8 shadow-xl">
            <span>Learn Resin Art</span>
            <span className="text-slate-600">•</span>
            <span>Build Your Signature Style</span>
            <span className="text-slate-600">•</span>
            <span>Create Your Identity</span>
            <span className="text-slate-600">•</span>
            <span className="text-emerald-400">Build Your Income</span>
          </div>

          <p className="text-slate-400 text-sm md:text-base max-w-2xl mx-auto mb-10">
            Join a community of women who are transforming their creativity into something much bigger than a hobby.
          </p>

          {/* Call to Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link
              href="/webinar"
              className="px-9 py-4 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 hover:opacity-95 text-slate-950 font-black rounded-2xl text-lg transition-all shadow-2xl shadow-orange-500/30 flex items-center gap-2.5 w-full sm:w-auto justify-center hover:scale-[1.02]"
            >
              <Sparkles size={20} />
              Start My Resin Journey
            </Link>
            <Link
              href="/register"
              className="px-8 py-4 bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-slate-200 font-bold rounded-2xl text-lg transition-all w-full sm:w-auto justify-center flex items-center gap-2 hover:border-orange-500/40"
            >
              <Brush size={20} className="text-orange-400" />
              Explore Academy Portal
            </Link>
          </div>

          {/* ─── HERO VIDEO SHOWCASE (Canva Presentation Video) ─── */}
          <div className="max-w-5xl mx-auto mb-16 relative rounded-3xl overflow-hidden border-2 border-orange-500/40 shadow-2xl shadow-orange-500/20 bg-slate-950 aspect-video">
            <iframe
              loading="lazy"
              src="https://www.canva.com/design/DAGLLOTrJNg/gPNZz92PZtdWyAsBesuM0g/view?embed"
              allow="fullscreen; autoplay; clipboard-write"
              allowFullScreen
              className="w-full h-full border-0 absolute inset-0 rounded-3xl"
              title="Ravishing Art Resin Masterclass Studio Preview"
            />
          </div>

          {/* Quick Studio Authority Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-6 border-t border-slate-800/80">
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-md">
              <p className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300 mb-1">52,000+</p>
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Students Taught</p>
            </div>
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-md">
              <p className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-300 mb-1">8,000+</p>
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Orders Completed</p>
            </div>
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-md">
              <p className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-300 mb-1">5.0 ★</p>
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Google Play Rating</p>
            </div>
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-md">
              <p className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-300 mb-1">₹1Cr+</p>
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Student Revenue</p>
            </div>
          </div>

        </div>
      </section>

      {/* ─── SECTION 2: THE REAL PROBLEM ─── */}
      <section id="problem" className="py-24 px-6 bg-slate-900/50 border-y border-slate-800/80 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-orange-400 text-xs font-black uppercase tracking-widest block mb-2">The Real Challenge</span>
            <h2 className="text-3xl md:text-5xl font-black text-white mb-6">
              Beautiful Art Alone Doesn't Build a Business.
            </h2>
            <p className="text-slate-300 text-base md:text-lg leading-relaxed">
              You may know how to create beautiful resin pieces, but knowing the craft is only one part of the journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-7 space-y-3 hover:border-red-500/40 transition-all shadow-xl">
              <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 font-bold text-lg mb-2">
                1
              </div>
              <h3 className="text-xl font-bold text-white">Technique &amp; Product Confusion</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                You may still be wondering what to learn next, which techniques to master, and what exact products to create to stand out in the market.
              </p>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-7 space-y-3 hover:border-orange-500/40 transition-all shadow-xl">
              <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 font-bold text-lg mb-2">
                2
              </div>
              <h3 className="text-xl font-bold text-white">Developing Your Own Style</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Stuck copying Pinterest and Instagram reels instead of building a signature aesthetic and brand identity that clients recognize instantly.
              </p>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-7 space-y-3 hover:border-amber-500/40 transition-all shadow-xl">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 font-bold text-lg mb-2">
                3
              </div>
              <h3 className="text-xl font-bold text-white">Showcasing &amp; Inconsistent Orders</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                You know your creations have real value, but you lack a predictable system to showcase your work and attract consistent, paying clients.
              </p>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-7 space-y-3 hover:border-emerald-500/40 transition-all shadow-xl">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-lg mb-2">
                4
              </div>
              <h3 className="text-xl font-bold text-white">Turning Skill into Steady Income</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Treating resin as an expensive personal hobby rather than monetizing high-ticket creations like clocks, tables, and floral preservations.
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-orange-500/10 border-2 border-orange-500/30 rounded-3xl p-8 text-center max-w-3xl mx-auto shadow-2xl">
            <p className="text-xl md:text-2xl font-black text-white">
              "The problem isn't your talent. The problem is that nobody gave you a clear path."
            </p>
          </div>
        </div>
      </section>

      {/* ─── SECTION 3: THE REFRAME ─── */}
      <section id="reframe" className="py-24 px-6 relative z-10">
        <div className="max-w-5xl mx-auto text-center space-y-12">
          <div>
            <span className="text-orange-400 text-xs font-black uppercase tracking-widest block mb-2">A New Perspective</span>
            <h2 className="text-3xl md:text-5xl font-black text-white mb-6">
              Resin Art Is Not the Destination. It's the Vehicle.
            </h2>
            <p className="text-slate-300 text-base md:text-xl max-w-3xl mx-auto leading-relaxed">
              Resin Art can become the vehicle through which you discover your creativity, build your confidence, create a unique identity and create financial opportunities for yourself.
            </p>
          </div>

          {/* Sequential Pathway */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-8 shadow-2xl">
            <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4 text-sm md:text-lg font-black">
              <span className="px-4 py-2 rounded-xl bg-orange-500/20 text-orange-300 border border-orange-500/30">Passion</span>
              <ArrowRight className="text-slate-600 hidden sm:block" size={18} />
              <span className="px-4 py-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30">Skill</span>
              <ArrowRight className="text-slate-600 hidden sm:block" size={18} />
              <span className="px-4 py-2 rounded-xl bg-yellow-500/20 text-yellow-300 border border-yellow-500/30">Signature</span>
              <ArrowRight className="text-slate-600 hidden sm:block" size={18} />
              <span className="px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">Portfolio</span>
              <ArrowRight className="text-slate-600 hidden sm:block" size={18} />
              <span className="px-4 py-2 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">Income</span>
              <ArrowRight className="text-slate-600 hidden sm:block" size={18} />
              <span className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 shadow-lg shadow-orange-500/20">Freedom</span>
            </div>
          </div>

          <div className="max-w-2xl mx-auto space-y-2">
            <p className="text-lg md:text-xl text-slate-200 font-bold">
              You don't have to choose between being an artist and building a successful life.
            </p>
            <p className="text-orange-400 text-xl md:text-2xl font-black">
              You can create beautiful art and create a beautiful future with it.
            </p>
          </div>
        </div>
      </section>

      {/* ─── SECTION 4: YOUR JOURNEY STARTS WITH WHAT YOU HAVE ─── */}
      <section className="py-20 px-6 bg-slate-900/40 border-y border-slate-800/80 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-orange-400 text-xs font-black uppercase tracking-widest block mb-2">Zero Barriers to Begin</span>
            <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
              Your Journey Starts With What You Already Have.
            </h2>
            <p className="text-slate-400 text-base md:text-lg">
              You don't need a fancy studio or decades of fine art school.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-center space-y-2 hover:border-slate-700 transition-all">
              <span className="text-3xl block mb-2">❌</span>
              <h3 className="font-bold text-white text-base">No Prior Expertise</h3>
              <p className="text-xs text-slate-400">You don't need to be an expert to begin.</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-center space-y-2 hover:border-slate-700 transition-all">
              <span className="text-3xl block mb-2">❌</span>
              <h3 className="font-bold text-white text-base">No Perfect Setup</h3>
              <p className="text-xs text-slate-400">You don't need a dedicated luxury studio.</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-center space-y-2 hover:border-slate-700 transition-all">
              <span className="text-3xl block mb-2">❌</span>
              <h3 className="font-bold text-white text-base">No Social Followers</h3>
              <p className="text-xs text-slate-400">You don't need thousands of followers to start selling.</p>
            </div>
            <div className="bg-slate-900 border-2 border-orange-500/40 rounded-3xl p-6 text-center space-y-2 bg-orange-500/5 shadow-xl">
              <span className="text-3xl block mb-2">✨</span>
              <h3 className="font-bold text-orange-400 text-base">Willingness to Learn</h3>
              <p className="text-xs text-slate-300">Simply the desire to create and take the next step.</p>
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-8 text-center max-w-3xl mx-auto shadow-2xl">
            <p className="text-base md:text-xl font-bold text-slate-300">
              We help you move from{" "}
              <span className="text-slate-400 italic">“I want to learn Resin Art”</span> to{" "}
              <span className="text-orange-400 font-black">
                “I know what I'm doing, I know what I'm creating and I know where I'm going.”
              </span>
            </p>
          </div>
        </div>
      </section>

      {/* ─── SECTION 5: DOES THIS SOUND LIKE YOU? ─── */}
      <section className="py-24 px-6 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-orange-400 text-xs font-black uppercase tracking-widest block mb-2">Self-Reflection Check</span>
            <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
              Does This Sound Like You?
            </h2>
            <p className="text-slate-400 text-base md:text-lg">
              Recognizing where you are today is the first step toward lasting creative mastery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-8 flex flex-col justify-between hover:border-orange-500/40 transition-all shadow-xl">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400 font-black text-xl">
                  1
                </div>
                <h3 className="text-xl font-bold text-white">
                  You Love Creating, But You Don't Know What To Focus On.
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  You keep learning different techniques but still feel confused about what you should master next.
                </p>
              </div>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-8 flex flex-col justify-between hover:border-amber-500/40 transition-all shadow-xl">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-black text-xl">
                  2
                </div>
                <h3 className="text-xl font-bold text-white">
                  You Create Beautiful Work, But You're Not Getting Consistent Orders.
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  You know your creations have value, but you don't know how to consistently attract the right customers and convert your creativity into income.
                </p>
              </div>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-8 flex flex-col justify-between hover:border-pink-500/40 transition-all shadow-xl">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-pink-400 font-black text-xl">
                  3
                </div>
                <h3 className="text-xl font-bold text-white">
                  You Want Your Own Identity and Income—Not Another Hobby.
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  You want people to recognise you for your talent, you want something that is truly yours and you want your creativity to contribute to your financial freedom.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <span className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-black text-sm md:text-base px-6 py-3 rounded-full shadow-lg">
              <CheckCircle2 size={18} /> If you see yourself in any of these, you're in the right place.
            </span>
          </div>
        </div>
      </section>

      {/* ─── SECTION 6: THE PATH ─── */}
      <section className="py-24 px-6 bg-slate-900/50 border-y border-slate-800/80 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-orange-400 text-xs font-black uppercase tracking-widest block mb-2">Structured Roadmap</span>
            <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
              You Don't Need Another Hobby. You Need a Path.
            </h2>
            <p className="text-slate-400 text-base md:text-lg">
              A structured journey can help you turn scattered learning into meaningful progress.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3 hover:border-orange-500/50 transition-all shadow-xl">
              <span className="text-xs font-black text-orange-400 uppercase tracking-wider block">Phase 1</span>
              <h3 className="text-lg font-black text-white">Skill → Creation</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Learn the right techniques and develop the confidence to create beautiful resin art.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3 hover:border-amber-500/50 transition-all shadow-xl">
              <span className="text-xs font-black text-amber-400 uppercase tracking-wider block">Phase 2</span>
              <h3 className="text-lg font-black text-white">Creation → Signature</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Discover your creative strengths and develop a style that feels uniquely yours.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3 hover:border-cyan-500/50 transition-all shadow-xl">
              <span className="text-xs font-black text-cyan-400 uppercase tracking-wider block">Phase 3</span>
              <h3 className="text-lg font-black text-white">Signature → Portfolio</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Build a collection of creations that represents your skills and showcases your work with pride.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3 hover:border-emerald-500/50 transition-all shadow-xl">
              <span className="text-xs font-black text-emerald-400 uppercase tracking-wider block">Phase 4</span>
              <h3 className="text-lg font-black text-white">Portfolio → Income</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Learn how to position, present and monetize your creations into income-generating opportunities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECTION 7: WHAT YOU WILL LEARN + CREATE ─── */}
      <section id="learn" className="py-24 px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-orange-400 text-xs font-black uppercase tracking-widest block mb-2">Hands-On Mastery</span>
            <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
              What You'll Learn + What You'll Create
            </h2>
            <p className="text-slate-300 text-base md:text-lg">
              This isn't just about watching lessons. You'll learn the techniques, practice them through real creations and gradually build a portfolio that demonstrates your growth.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-8 space-y-4 hover:border-orange-500/40 transition-all shadow-xl">
              <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400">
                <Palette size={24} />
              </div>
              <h3 className="text-2xl font-black text-white">Master Resin Art Techniques</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Understand the fundamentals and advanced chemistry required to create professional-quality resin artwork—including cell lacing, 3D geodes, floral preservations, and ocean wave dynamics.
              </p>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-8 space-y-4 hover:border-amber-500/40 transition-all shadow-xl">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Sparkles size={24} />
              </div>
              <h3 className="text-2xl font-black text-white">Develop Your Signature Style</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Move beyond copying others and discover the colours, techniques, compositions and products that make your work unmistakably recognizable in the market.
              </p>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-8 space-y-4 hover:border-cyan-500/40 transition-all shadow-xl">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Layers size={24} />
              </div>
              <h3 className="text-2xl font-black text-white">Build a Portfolio You Are Proud Of</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Create meaningful, gallery-grade projects (Roman clocks, geode platters, bridal jaimala blocks) that demonstrate your mastery and give you something tangible to showcase.
              </p>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-8 space-y-4 hover:border-emerald-500/40 transition-all shadow-xl">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <TrendingUp size={24} />
              </div>
              <h3 className="text-2xl font-black text-white">Learn How To Monetize Your Skill</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Understand how to turn your creations into high-margin products, attract custom client commissions, price with confidence, and establish consistent monthly cash flow.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECTION 8: SIX DIMENSIONS OF SUCCESS ─── */}
      <section id="dimensions" className="py-24 px-6 bg-slate-900/50 border-y border-slate-800/80 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-orange-400 text-xs font-black uppercase tracking-widest block mb-2">Holistic Growth Model</span>
            <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
              Success Is More Than The Money You Make.
            </h2>
            <p className="text-slate-300 text-base md:text-lg">
              Your growth should be measured by the person you become along the way. We believe your Resin Art journey should help you grow across six important dimensions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SIX_DIMENSIONS.map((dim, idx) => {
              const IconComp = dim.icon;
              return (
                <div
                  key={idx}
                  className={`bg-slate-900/90 border border-slate-800 rounded-3xl p-7 flex flex-col justify-between transition-all duration-300 ${dim.border} shadow-xl group`}
                >
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="w-12 h-12 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-orange-400 group-hover:scale-110 transition-transform">
                        <IconComp size={22} />
                      </div>
                      <span className="text-[11px] font-black uppercase tracking-wider bg-slate-950 px-3 py-1 rounded-full text-slate-400 border border-slate-800">
                        {dim.badge}
                      </span>
                    </div>
                    <h3 className="text-xl font-black text-white">{dim.title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      {dim.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── SECTION 9: VISIBLE GROWTH (GAMIFIED PROGRESSION) ─── */}
      <section className="py-24 px-6 relative z-10">
        <div className="max-w-5xl mx-auto text-center space-y-12">
          <div>
            <span className="text-orange-400 text-xs font-black uppercase tracking-widest block mb-2">Transparent Milestones</span>
            <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
              Your Growth Should Be Visible.
            </h2>
            <p className="text-slate-300 text-base md:text-lg max-w-3xl mx-auto leading-relaxed">
              Every creation, challenge, milestone and achievement should tell a story of how far you've come. Instead of wondering whether you're progressing, you'll have tangible milestones that help you see, measure and celebrate your growth.
            </p>
          </div>

          {/* Gamified Flow Loop */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-8 shadow-2xl">
            <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4 text-xs md:text-base font-black">
              <span className="px-4 py-2 rounded-xl bg-slate-800 text-white">Learn</span>
              <ArrowRight className="text-orange-400" size={16} />
              <span className="px-4 py-2 rounded-xl bg-orange-500/20 text-orange-300 border border-orange-500/30">Create</span>
              <ArrowRight className="text-orange-400" size={16} />
              <span className="px-4 py-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30">Complete</span>
              <ArrowRight className="text-orange-400" size={16} />
              <span className="px-4 py-2 rounded-xl bg-yellow-500/20 text-yellow-300 border border-yellow-500/30">Earn Points</span>
              <ArrowRight className="text-orange-400" size={16} />
              <span className="px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">Unlock Milestones</span>
              <ArrowRight className="text-orange-400" size={16} />
              <span className="px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950">Earn Recognition</span>
            </div>
          </div>

          <p className="text-slate-400 text-base md:text-lg font-semibold">
            Your journey becomes something you can see, track and be proud of every single day.
          </p>
        </div>
      </section>

      {/* ─── SECTION 10: ART-O-THON ─── */}
      <section className="py-20 px-6 bg-gradient-to-r from-orange-600/10 via-amber-600/10 to-orange-600/10 border-y border-orange-500/30 relative z-10">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 bg-orange-500/20 text-orange-300 border border-orange-500/40 text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full">
            <Zap size={14} className="text-orange-400" /> Action-Powered Challenge
          </div>

          <h2 className="text-3xl md:text-5xl font-black text-white">
            ART-O-THON: Don't Just Learn. Create.
          </h2>

          <p className="text-slate-200 text-base md:text-xl max-w-3xl mx-auto leading-relaxed">
            Learning becomes powerful when you put it into action. ART-O-THON is designed to turn learning into consistent creation through challenges, missions and milestones.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto pt-4">
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-6">
              <h3 className="font-bold text-white text-base mb-1">Step Forward</h3>
              <p className="text-xs text-slate-400">Every creation becomes a verified step forward in your artistic mastery.</p>
            </div>
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-6">
              <h3 className="font-bold text-white text-base mb-1">Proof of Progress</h3>
              <p className="text-xs text-slate-400">Every completed challenge becomes solid proof of your confidence.</p>
            </div>
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-6">
              <h3 className="font-bold text-white text-base mb-1">Celebrate Wins</h3>
              <p className="text-xs text-slate-400">Every milestone gives you another reason to celebrate how far you've come.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECTION 11: SISTERHOOD COMMUNITY ─── */}
      <section className="py-24 px-6 relative z-10">
        <div className="max-w-5xl mx-auto text-center space-y-12">
          <div>
            <span className="text-orange-400 text-xs font-black uppercase tracking-widest block mb-2">Thriving Sisterhood</span>
            <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
              You Don't Have To Build Alone.
            </h2>
            <p className="text-slate-300 text-base md:text-lg max-w-3xl mx-auto leading-relaxed">
              The journey becomes easier when you're surrounded by women who understand your dreams, your struggles and your ambition. Inside Ravishing Art Hub, you don't just learn from a coach. You learn, create, share, celebrate and grow together.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-center hover:border-orange-500/40 transition-all">
              <MessageCircle className="text-orange-400 mx-auto mb-2" size={24} />
              <p className="font-bold text-white text-sm">Ask Questions</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-center hover:border-amber-500/40 transition-all">
              <Palette className="text-amber-400 mx-auto mb-2" size={24} />
              <p className="font-bold text-white text-sm">Share Creations</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-center hover:border-cyan-500/40 transition-all">
              <Sparkles className="text-cyan-400 mx-auto mb-2" size={24} />
              <p className="font-bold text-white text-sm">Get Feedback</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-center hover:border-emerald-500/40 transition-all">
              <Trophy className="text-emerald-400 mx-auto mb-2" size={24} />
              <p className="font-bold text-white text-sm">Celebrate Wins</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-center hover:border-purple-500/40 transition-all col-span-2 sm:col-span-1">
              <Users className="text-purple-400 mx-auto mb-2" size={24} />
              <p className="font-bold text-white text-sm">Grow Together</p>
            </div>
          </div>

          <p className="text-orange-400 font-black text-lg md:text-xl">
            "Because when women grow together, everyone grows stronger."
          </p>
        </div>
      </section>

      {/* ─── SECTION 12: STUDENT TRANSFORMATION ─── */}
      <section className="py-24 px-6 bg-slate-900/40 border-y border-slate-800/80 relative z-10">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-orange-400 text-xs font-black uppercase tracking-widest block mb-2">Real Journeys</span>
            <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
              From “I Can't” To “I Created This.”
            </h2>
            <p className="text-slate-300 text-base md:text-lg leading-relaxed">
              Every student begins somewhere. Some begin with zero experience. Some begin with self-doubt. Some begin after years of putting their creativity aside. But with the right guidance, practice and community, they start creating things they once thought were impossible.
            </p>
            <p className="text-orange-400 font-bold text-base mt-3">
              The transformation isn't just in what their hands can create. It's in what they start believing about themselves.
            </p>
          </div>

          {/* Marquee Row 1 */}
          <div className="overflow-hidden relative">
            <div className="animate-marquee-left gap-6">
              {[...ARTWORKS_ROW_1, ...ARTWORKS_ROW_1].map((art, idx) => (
                <div
                  key={`r1-${idx}`}
                  className="w-[300px] md:w-[340px] bg-slate-900 border border-slate-800 rounded-3xl p-5 shrink-0 hover:border-orange-500/50 transition-all shadow-xl"
                >
                  <div className={`h-40 rounded-2xl bg-gradient-to-br ${art.gradient} p-4 flex flex-col justify-between relative overflow-hidden shadow-inner`}>
                    <div className="flex justify-between items-center z-10">
                      <span className="text-[10px] font-black uppercase tracking-wider bg-slate-950/70 text-white px-2.5 py-1 rounded-full">
                        {art.badge}
                      </span>
                      <span className="text-xs font-black bg-emerald-500 text-slate-950 px-2 py-0.5 rounded-full">
                        {art.price}
                      </span>
                    </div>
                    <div className="z-10">
                      <p className="text-base font-black text-white">{art.title}</p>
                      <p className="text-xs text-slate-200/80">{art.type}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-800">
                    <p className="text-xs font-bold text-white">{art.artist} · <span className="text-orange-400">{art.level}</span></p>
                    <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                      <CheckCircle2 size={12} /> Verified Piece
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Marquee Row 2 */}
          <div className="overflow-hidden relative">
            <div className="animate-marquee-right gap-6">
              {[...ARTWORKS_ROW_2, ...ARTWORKS_ROW_2].map((art, idx) => (
                <div
                  key={`r2-${idx}`}
                  className="w-[300px] md:w-[340px] bg-slate-900 border border-slate-800 rounded-3xl p-5 shrink-0 hover:border-orange-500/50 transition-all shadow-xl"
                >
                  <div className={`h-40 rounded-2xl bg-gradient-to-br ${art.gradient} p-4 flex flex-col justify-between relative overflow-hidden shadow-inner`}>
                    <div className="flex justify-between items-center z-10">
                      <span className="text-[10px] font-black uppercase tracking-wider bg-slate-950/70 text-white px-2.5 py-1 rounded-full">
                        {art.badge}
                      </span>
                      <span className="text-xs font-black bg-emerald-500 text-slate-950 px-2 py-0.5 rounded-full">
                        {art.price}
                      </span>
                    </div>
                    <div className="z-10">
                      <p className="text-base font-black text-white">{art.title}</p>
                      <p className="text-xs text-slate-200/80">{art.type}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-800">
                    <p className="text-xs font-bold text-white">{art.artist} · <span className="text-orange-400">{art.level}</span></p>
                    <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                      <CheckCircle2 size={12} /> Verified Piece
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECTION 13: SOCIAL PROOF & GOOGLE PLAY REVIEWS ─── */}
      <section id="reviews" className="py-24 px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-orange-400 text-xs font-black uppercase tracking-widest block mb-2">Verified Social Proof</span>
            <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
              52K+ Students Taught · 8K+ Orders Completed · 5.0★ Google Rating
            </h2>
            <p className="text-slate-300 text-base md:text-lg">
              Thousands of learners have already trusted Ravishing Art to help them explore, learn and grow through Resin Art. From beginners taking their first step to creators building their own identity and income, every journey is different. But every journey begins with one decision: to start.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {/* Review 1 */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-7 flex flex-col justify-between hover:border-orange-500/40 transition-all shadow-xl">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} className="text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-[10px] text-slate-500 font-medium">Google Play · 18 Feb 2023</span>
                </div>
                <p className="text-slate-200 text-sm leading-relaxed mb-6 italic">
                  "Easy to access, easy to connect and best part always support is there so you never feel stuck anywhere. The best part is all course introductions are open for all to know the course details and see our mentor too 👍"
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-slate-800">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-teal-500 to-cyan-500 flex items-center justify-center font-black text-slate-950 text-sm shrink-0">K</div>
                <div>
                  <p className="font-bold text-white text-sm">Krupali Shah</p>
                  <p className="text-xs text-orange-400 font-semibold">Verified Ravishing Art Student</p>
                </div>
              </div>
            </div>

            {/* Review 2 */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-7 flex flex-col justify-between hover:border-orange-500/40 transition-all shadow-xl">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} className="text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-[10px] text-slate-500 font-medium">Google Play · 21 May 2024</span>
                </div>
                <p className="text-slate-200 text-sm leading-relaxed mb-6 italic">
                  "Ravishing Art is a wonderful app to learn resin art. It has different courses and easy steps in video form. Vrajangna miss encourages us to try new thoughts and designs. Very much helpful for art lovers. Very happy to join Ravishing Art!"
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-slate-800">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center font-black text-slate-950 text-sm shrink-0">S</div>
                <div>
                  <p className="font-bold text-white text-sm">Sonal</p>
                  <p className="text-xs text-orange-400 font-semibold">Verified Ravishing Art Student</p>
                </div>
              </div>
            </div>

            {/* Review 3 */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-7 flex flex-col justify-between hover:border-orange-500/40 transition-all shadow-xl">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} className="text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-[10px] text-slate-500 font-medium">Google Play · 19 Oct 2023</span>
                </div>
                <p className="text-slate-200 text-sm leading-relaxed mb-6 italic">
                  "Absolutely love this app. The user-friendly interface makes it easy to experiment with different techniques. I also appreciate Vrajangna mam for being a motivational figure in my art journey."
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-slate-800">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center font-black text-slate-950 text-sm shrink-0">D</div>
                <div>
                  <p className="font-bold text-white text-sm">Drashti Gosai</p>
                  <p className="text-xs text-orange-400 font-semibold">Verified Ravishing Art Student</p>
                </div>
              </div>
            </div>

            {/* Review 4 */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-7 flex flex-col justify-between hover:border-orange-500/40 transition-all shadow-xl">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} className="text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-[10px] text-slate-500 font-medium">Google Play · 19 Oct 2023</span>
                </div>
                <p className="text-slate-200 text-sm leading-relaxed mb-6 italic">
                  "I first saw Vrajangna Ma'am on an Instagram Live. The way she explained resin art—whether the learner is from a well-to-do family or a simple housewife, anyone can learn with minimum investment. One day she shared a reel about the courses and I immediately enrolled. My learning started a new journey."
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-slate-800">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-slate-500 to-slate-400 flex items-center justify-center font-black text-white text-sm shrink-0">H</div>
                <div>
                  <p className="font-bold text-white text-sm">Hina Bhardwaj</p>
                  <p className="text-xs text-orange-400 font-semibold">Verified Ravishing Art Student</p>
                </div>
              </div>
            </div>

            {/* Review 5 */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-7 flex flex-col justify-between hover:border-orange-500/40 transition-all shadow-xl">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} className="text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-[10px] text-slate-500 font-medium">Google Play · 3 Jun 2025</span>
                </div>
                <p className="text-slate-200 text-sm leading-relaxed mb-6 italic">
                  "Amazing experience with Vrajangana ma'am for teaching resin art. Her videos are very easy to understand for a newcomer like me. Within a month I got confidence to make different resin items. Thanks a lot ma'am for your guidance. Thank you!"
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-slate-800">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center font-black text-slate-950 text-sm shrink-0">M</div>
                <div>
                  <p className="font-bold text-white text-sm">Manisha Dedhia</p>
                  <p className="text-xs text-orange-400 font-semibold">Verified Ravishing Art Student</p>
                </div>
              </div>
            </div>

            {/* Review 6 */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-7 flex flex-col justify-between hover:border-orange-500/40 transition-all shadow-xl">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} className="text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-[10px] text-slate-500 font-medium">Google Play · 15 Apr 2024</span>
                </div>
                <p className="text-slate-200 text-sm leading-relaxed mb-6 italic">
                  "Learning is very easy with this app. Someone is always available for solving queries. Boosted my confidence by giving tasks and helping to complete them. Best resin art learning platform!"
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-slate-800">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-rose-500 to-pink-500 flex items-center justify-center font-black text-slate-950 text-sm shrink-0">T</div>
                <div>
                  <p className="font-bold text-white text-sm">Tamanna Bhanushali</p>
                  <p className="text-xs text-orange-400 font-semibold">Verified Ravishing Art Student</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─── SECTION 14: ABOUT VRAJANGNA PATEL (WITH REAL PHOTOS) ─── */}
      <section id="mentor" className="py-24 px-6 bg-slate-900/50 border-y border-slate-800/80 relative z-10">
        <div className="max-w-6xl mx-auto space-y-12">

          {/* Main Mentor Card */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-8 md:p-14 shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-4 text-center">
                <div className="relative w-48 h-48 sm:w-56 sm:h-56 mx-auto mb-4 rounded-3xl overflow-hidden border-2 border-orange-500/50 shadow-2xl shadow-orange-500/30 group">
                  <img
                    src="/images/mentor/vrajangna-portrait.jpg"
                    alt="Vrajangna Patel - Resin Art & Business Coach"
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />
                </div>
                <h3 className="text-2xl font-black text-white">Vrajangna Patel</h3>
                <p className="text-xs text-orange-400 font-bold mt-1 uppercase tracking-wider">
                  Founder &amp; Resin Art Business Coach · Ravishing Art Hub
                </p>
              </div>

              <div className="lg:col-span-8 space-y-5">
                <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full">
                  <Sparkles size={13} /> Founder &amp; Business Coach
                </div>

                <h3 className="text-2xl md:text-4xl font-black text-white leading-tight">
                  Meet Vrajangna — Your Resin Art &amp; Business Coach
                </h3>

                <p className="text-slate-300 text-sm md:text-base leading-relaxed">
                  I'm Vrajangna Patel, founder of Ravishing Art Hub and a Resin Art Business Coach. Over the years, I've helped thousands of women discover their creativity, master Resin Art and explore how their skills can become a source of identity and financial freedom.
                </p>

                <p className="text-slate-300 text-sm md:text-base leading-relaxed">
                  My goal isn't just to teach you how to make Resin Art. My goal is to help you believe that your creativity can become something meaningful, valuable and truly yours.
                </p>

                <div className="bg-orange-500/10 border-l-4 border-orange-500 p-4 rounded-r-2xl">
                  <p className="text-sm md:text-base font-bold text-orange-300 italic">
                    "Because I believe every woman deserves the opportunity to create an identity beyond the roles she plays for everyone else."
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Real Awards & Author Accreditations Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Photo 1: Hall of Fame Award */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl overflow-hidden shadow-xl group hover:border-orange-500/40 transition-all">
              <div className="h-64 overflow-hidden relative">
                <img
                  src="/images/mentor/hall-of-fame-award.jpg"
                  alt="Vrajangna Patel receiving Hall of Fame Award from Siddharth Rajsekar"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                <span className="absolute top-4 left-4 bg-orange-500 text-slate-950 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-lg">
                  🏆 Hall of Fame Award
                </span>
              </div>
              <div className="p-5 space-y-1.5">
                <h4 className="text-base font-bold text-white">Felicitation on Stage</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Honored with the prestigious Hall of Fame Award 2022–23 at the Freedom Business Retreat.
                </p>
              </div>
            </div>

            {/* Photo 2: Diamond Club Award */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl overflow-hidden shadow-xl group hover:border-cyan-500/40 transition-all">
              <div className="h-64 overflow-hidden relative">
                <img
                  src="/images/mentor/diamond-award.jpg"
                  alt="Diamond Awards Certificate Presentation"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                <span className="absolute top-4 left-4 bg-cyan-500 text-slate-950 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-lg">
                  💎 Diamond Creator Award
                </span>
              </div>
              <div className="p-5 space-y-1.5">
                <h4 className="text-base font-bold text-white">Diamond Club Certification</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Recognized as an elite educational creator transforming creative lives nationwide.
                </p>
              </div>
            </div>

            {/* Photo 3: Published Author Feature */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl overflow-hidden shadow-xl group hover:border-amber-500/40 transition-all">
              <div className="h-64 overflow-hidden relative">
                <img
                  src="/images/mentor/author-feature.jpg"
                  alt="I Can Coach - Stories of Transformation Co-Authored by Vrajangna Patel"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                <span className="absolute top-4 left-4 bg-amber-500 text-slate-950 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-lg">
                  📖 Published Author
                </span>
              </div>
              <div className="p-5 space-y-1.5">
                <h4 className="text-base font-bold text-white">"I Can Coach" Contributor</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Featured transformation author sharing the philosophy of resin artistry and financial freedom.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─── SECTION 15: YOUR RAVISHING JOURNEY (MEMBERSHIPS) ─── */}
      <section id="journey" className="py-24 px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-orange-400 text-xs font-black uppercase tracking-widest block mb-2">Tiered Pathways</span>
            <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
              Choose Your Ravishing Journey
            </h2>
            <p className="text-slate-400 text-base md:text-lg">
              Wherever you are today, there is a next step for you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

            {/* Level 0: START */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-7 flex flex-col justify-between hover:border-orange-500/40 transition-all shadow-xl">
              <div className="space-y-4">
                <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/30 inline-block">
                  Level 0 · START
                </span>
                <h3 className="text-xl font-black text-white">Explore Your Creativity</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Begin your Resin Art journey, understand the fundamentals and create your first beautiful pieces with confidence.
                </p>
                <div className="pt-2 border-t border-slate-800 space-y-2 text-xs text-slate-300">
                  <div className="flex items-center gap-2"><Check size={14} className="text-orange-400" /> Epoxy safety &amp; ratios</div>
                  <div className="flex items-center gap-2"><Check size={14} className="text-orange-400" /> Beginner coaster sets</div>
                  <div className="flex items-center gap-2"><Check size={14} className="text-orange-400" /> Resin FastStart Bundle</div>
                </div>
              </div>
              <Link
                href="/webinar"
                className="mt-6 w-full py-3 bg-orange-500/10 hover:bg-orange-500 text-orange-400 hover:text-slate-950 font-bold rounded-xl text-xs transition-all text-center border border-orange-500/30"
              >
                Join Free Masterclass
              </Link>
            </div>

            {/* Level 1: GROW */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-7 flex flex-col justify-between hover:border-amber-500/40 transition-all shadow-xl">
              <div className="space-y-4">
                <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 inline-block">
                  Level 1 · GROW
                </span>
                <h3 className="text-xl font-black text-white">Build Skills &amp; Signature</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Go deeper into techniques, creativity, portfolio building and the skills required to take your art seriously.
                </p>
                <div className="pt-2 border-t border-slate-800 space-y-2 text-xs text-slate-300">
                  <div className="flex items-center gap-2"><Check size={14} className="text-amber-400" /> Ocean lacing &amp; cell formulas</div>
                  <div className="flex items-center gap-2"><Check size={14} className="text-amber-400" /> 3D Geode inlays &amp; clocks</div>
                  <div className="flex items-center gap-2"><Check size={14} className="text-amber-400" /> Masters Artistry Bundle</div>
                </div>
              </div>
              <Link
                href="/register"
                className="mt-6 w-full py-3 bg-amber-500/10 hover:bg-amber-500 text-amber-400 hover:text-slate-950 font-bold rounded-xl text-xs transition-all text-center border border-amber-500/30"
              >
                Explore Masters
              </Link>
            </div>

            {/* Level 2: MASTER */}
            <div className="bg-slate-900 border-2 border-orange-500/50 rounded-3xl p-7 flex flex-col justify-between shadow-2xl relative">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">
                Most Popular
              </span>
              <div className="space-y-4">
                <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/40 inline-block">
                  Level 2 · MASTER
                </span>
                <h3 className="text-xl font-black text-white">Build Identity &amp; Income</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Develop advanced skills, strengthen your personal brand, understand business and build a sustainable path around your creativity.
                </p>
                <div className="pt-2 border-t border-slate-800 space-y-2 text-xs text-slate-200">
                  <div className="flex items-center gap-2"><Check size={14} className="text-orange-400" /> Jaimala bridal preservations</div>
                  <div className="flex items-center gap-2"><Check size={14} className="text-orange-400" /> Client pricing &amp; branding</div>
                  <div className="flex items-center gap-2"><Check size={14} className="text-orange-400" /> Renaissance Elite Mastery</div>
                </div>
              </div>
              <Link
                href="/register"
                className="mt-6 w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-black rounded-xl text-xs transition-all text-center shadow-lg shadow-orange-500/20"
              >
                Join Renaissance
              </Link>
            </div>

            {/* Level 3: CERTIFY */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-7 flex flex-col justify-between hover:border-cyan-500/40 transition-all shadow-xl">
              <div className="space-y-4">
                <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 inline-block">
                  Level 3 · CERTIFY
                </span>
                <h3 className="text-xl font-black text-white">Recognised Creator</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Take your skills, portfolio, business knowledge and personal growth to the next level through structured milestones and certification.
                </p>
                <div className="pt-2 border-t border-slate-800 space-y-2 text-xs text-slate-300">
                  <div className="flex items-center gap-2"><Check size={14} className="text-cyan-400" /> Furniture river tables</div>
                  <div className="flex items-center gap-2"><Check size={14} className="text-cyan-400" /> Certified Master Artist Badge</div>
                  <div className="flex items-center gap-2"><Check size={14} className="text-cyan-400" /> Artistry Pinnacle License</div>
                </div>
              </div>
              <Link
                href="/register"
                className="mt-6 w-full py-3 bg-cyan-500/10 hover:bg-cyan-500 text-cyan-400 hover:text-slate-950 font-bold rounded-xl text-xs transition-all text-center border border-cyan-500/30"
              >
                Explore Certification
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* ─── SECTION 16: FREE MASTERCLASS ─── */}
      <section className="py-24 px-6 bg-slate-900/50 border-y border-slate-800/80 relative z-10">
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border-2 border-orange-500/30 rounded-3xl p-8 md:p-14 shadow-2xl text-center space-y-8">
          <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full">
            <Sparkles size={13} /> Complimentary 90-Min Training
          </div>

          <h2 className="text-3xl md:text-5xl font-black text-white">
            Not Sure Where To Start? Start Here.
          </h2>

          <p className="text-slate-300 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Join my FREE Resin Mastery Masterclass and discover the three essential shifts that can help you move from simply learning Resin Art to confidently building something of your own.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left max-w-2xl mx-auto pt-2">
            <div className="flex items-start gap-3 bg-slate-950 p-4 rounded-2xl border border-slate-800">
              <CheckCircle2 size={18} className="text-orange-400 shrink-0 mt-0.5" />
              <p className="text-xs text-slate-300">Understand the foundational skills &amp; safety formulas</p>
            </div>
            <div className="flex items-start gap-3 bg-slate-950 p-4 rounded-2xl border border-slate-800">
              <CheckCircle2 size={18} className="text-orange-400 shrink-0 mt-0.5" />
              <p className="text-xs text-slate-300">Create your signature style without copy-pasting</p>
            </div>
            <div className="flex items-start gap-3 bg-slate-950 p-4 rounded-2xl border border-slate-800">
              <CheckCircle2 size={18} className="text-orange-400 shrink-0 mt-0.5" />
              <p className="text-xs text-slate-300">Explore high-margin product monetization paths</p>
            </div>
          </div>

          <p className="text-slate-400 text-xs md:text-sm font-semibold">
            No pressure. No complicated jargon. Just clarity on your next step.
          </p>

          <Link
            href="/webinar"
            className="inline-flex items-center gap-2.5 px-10 py-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-black rounded-2xl text-lg shadow-xl shadow-orange-500/25 hover:scale-105 transition-all"
          >
            <Sparkles size={20} /> Join The Free Masterclass
          </Link>
        </div>
      </section>

      {/* ─── SECTION 17: FINAL EMOTIONAL CTA ─── */}
      <section className="py-24 px-6 relative overflow-hidden text-center z-10">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center mx-auto shadow-2xl shadow-orange-500/40">
            <Palette size={32} className="text-slate-950 stroke-[2.5]" />
          </div>

          <h2 className="text-4xl md:text-6xl font-black text-white leading-tight">
            Your Art Has More Potential{" "}
            <span className="shimmer-text">Than You Think.</span>
          </h2>

          <div className="space-y-4 text-slate-300 text-base md:text-xl max-w-2xl mx-auto leading-relaxed">
            <p>
              Maybe Resin Art started as something you simply wanted to learn. Maybe it was a way to express yourself. Maybe you were looking for something that was yours.
            </p>
            <p className="text-white font-bold">
              But what if it could become much more?
            </p>
            <div className="flex flex-col gap-1 text-orange-300 font-semibold text-lg">
              <span>What if your art could become your identity?</span>
              <span>What if your skill could become your income?</span>
              <span className="text-orange-400 font-black text-xl">What if your creativity could create freedom?</span>
            </div>
            <p className="text-slate-400 text-base">
              You don't have to know the entire journey today. You just need to take the first step.
            </p>
          </div>

          <div className="pt-4">
            <Link
              href="/webinar"
              className="inline-flex items-center gap-3 px-12 py-5 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 hover:opacity-95 text-slate-950 font-black rounded-2xl text-xl transition-all shadow-2xl shadow-orange-500/30 hover:scale-105"
            >
              Start My Resin Journey <ArrowRight size={22} />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── SECTION 18: FAQS & CLOSING FOOTER ─── */}
      <section className="py-20 px-6 bg-slate-900/30 border-t border-slate-800/60 relative z-10">
        <div className="max-w-4xl mx-auto mb-16">
          <div className="text-center mb-12">
            <span className="text-orange-400 text-xs font-black uppercase tracking-widest block mb-2">Got Questions?</span>
            <h2 className="text-3xl md:text-4xl font-black text-white">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, idx) => (
              <div
                key={idx}
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 cursor-pointer hover:border-slate-700 transition-colors"
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

        {/* Closing Statement */}
        <div className="max-w-5xl mx-auto pt-12 border-t border-slate-800/80 text-center space-y-4">
          <BrandLogo size="lg" className="justify-center mx-auto" />

          <h3 className="text-xl md:text-2xl font-black text-white">
            Create. Connect. Grow. Become Ravishing.
          </h3>

          <p className="text-slate-400 text-xs md:text-sm max-w-2xl mx-auto leading-relaxed">
            Ravishing Art Hub is a community for ambitious women who want to transform their creativity into skill, identity, impact and financial freedom. Your creativity deserves a place in your life. And your journey starts here.
          </p>

          <div className="flex flex-wrap justify-center gap-6 text-xs text-slate-500 font-semibold pt-4">
            <Link href="/webinar" className="hover:text-slate-300 transition-colors">Free Masterclass</Link>
            <Link href="/login" className="hover:text-slate-300 transition-colors">Student Login</Link>
            <Link href="/register" className="hover:text-slate-300 transition-colors">Join Academy</Link>
            <Link href="/privacy" className="hover:text-slate-300 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-slate-300 transition-colors">Terms of Service</Link>
          </div>

          <p className="text-[11px] text-slate-600 pt-4">
            © {new Date().getFullYear()} Ravishing Art Hub. All Rights Reserved. Mastered with pride in India.
          </p>
        </div>
      </section>

    </div>
  );
}
