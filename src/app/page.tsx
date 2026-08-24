"use client";

import { BrandLogo } from "@/components/ui/BrandLogo";
import HeroVideoPlayer from "@/components/landing/HeroVideoPlayer";
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
  Globe,
  ChevronRight,
  Lightbulb,
  DollarSign,
  AlertCircle
} from "lucide-react";

// Student Artworks for Exhibition Showcase
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
    artist: "Tanvi R.",
    type: "Pigment Layering",
    level: "Gold Member",
    price: "₹11,200 Sold",
    gradient: "from-slate-700 via-indigo-950 to-black",
    accent: "text-indigo-300",
    badge: "Home Decor"
  }
];

const ARTWORKS_ROW_2 = [
  {
    title: "Preserved Bridal Jaimala Block",
    artist: "Ritu M.",
    type: "Crystal Floral Preservation",
    level: "Diamond Club",
    price: "₹22,000 Sold",
    gradient: "from-rose-600 via-pink-800 to-slate-900",
    accent: "text-rose-300",
    badge: "Preservation"
  },
  {
    title: "Maldives Shore Coffee Table",
    artist: "Vikram P.",
    type: "3-Tier Resin Wave Pour",
    level: "Diamond Club",
    price: "₹42,000 Sold",
    gradient: "from-sky-500 via-blue-700 to-indigo-950",
    accent: "text-sky-300",
    badge: "Furniture"
  },
  {
    title: "Rose Quartz Resin Tray Set",
    artist: "Ananya D.",
    type: "Metallic Edge Accents",
    level: "Silver Member",
    price: "₹6,500 Sold",
    gradient: "from-pink-600 via-amber-800 to-slate-950",
    accent: "text-pink-300",
    badge: "Tableware"
  },
  {
    title: "Midnight Nebula Wall Canvas",
    artist: "Sonia G.",
    type: "Multi-Pigment Fluid Pour",
    level: "Gold Member",
    price: "₹18,000 Sold",
    gradient: "from-violet-600 via-fuchsia-900 to-slate-950",
    accent: "text-violet-300",
    badge: "Fine Art"
  }
];

// Verified Google Play Reviews
const VERIFIED_REVIEWS = [
  {
    name: "Krupali Shah",
    date: "18 Feb 2023",
    rating: 5,
    tag: "Verified Student",
    comment:
      "Easy to access, easy to connect and best part always support is there so you never feel stuck anywhere. The best part is all course introductions are open for all to know the course details and see our mentor too 👍",
    avatarBg: "from-teal-500 to-cyan-500"
  },
  {
    name: "Sonal",
    date: "21 May 2024",
    rating: 5,
    tag: "Verified Student",
    comment:
      "Ravishing Art is a wonderful app to learn resin art. It has different courses and easy steps in video form. Vrajangna miss encourages us to try new thoughts and designs. Very much helpful for art lovers. Very happy to join Ravishing Art!",
    avatarBg: "from-orange-500 to-amber-500"
  },
  {
    name: "Drashti Gosai",
    date: "19 Oct 2023",
    rating: 5,
    tag: "Verified Student",
    comment:
      "Absolutely love this app. The user-friendly interface makes it easy to experiment with different techniques. I also appreciate Vrajangna mam for being a motivational figure in my art journey.",
    avatarBg: "from-purple-500 to-pink-500"
  },
  {
    name: "Hina Bhardwaj",
    date: "19 Oct 2023",
    rating: 5,
    tag: "Verified Student",
    comment:
      "I first saw Vrajangna Ma'am on an Instagram Live. The way she explained resin art — whether the learner is from a well-to-do family or a simple housewife, anyone can learn with minimum investment. One day she shared a reel about the courses and I immediately enrolled myself. My learning started a new journey.",
    avatarBg: "from-slate-600 to-slate-400"
  },
  {
    name: "Manisha Dedhia",
    date: "3 Jun 2025",
    rating: 5,
    tag: "Verified Student",
    comment:
      "Amazing experience with Vrajangana ma'am for teaching resin art. Her videos are very easy to understand for a newcomer like me. Within a month I got confidence to make different resin items. Thanks a lot ma'am for your guidance. Thank you!",
    avatarBg: "from-emerald-500 to-teal-500"
  },
  {
    name: "Tamanna Bhanushali",
    date: "15 Apr 2024",
    rating: 5,
    tag: "Verified Student",
    comment:
      "Learning is very easy with this app. Someone is always available for solving queries. Boosted my confidence by giving tasks and helping to complete them. Best resin art learning platform!",
    avatarBg: "from-rose-500 to-pink-500"
  }
];

export default function HomePage() {
  const [activeDimension, setActiveDimension] = useState(0);

  const sixDimensions = [
    {
      title: "Skill",
      icon: Brush,
      color: "from-orange-500 to-amber-500",
      border: "border-orange-500/40",
      desc: "How confidently and consistently you can create quality Resin Art."
    },
    {
      title: "Creativity",
      icon: Palette,
      color: "from-purple-500 to-pink-500",
      border: "border-purple-500/40",
      desc: "How effectively you experiment, innovate and develop your own artistic expression."
    },
    {
      title: "Identity",
      icon: Crown,
      color: "from-cyan-500 to-blue-500",
      border: "border-cyan-500/40",
      desc: "How clearly you develop your personal style, portfolio and recognition as an artist."
    },
    {
      title: "Business",
      icon: Briefcase,
      color: "from-emerald-500 to-teal-500",
      border: "border-emerald-500/40",
      desc: "How effectively you turn your skill and creations into products, customers and opportunities."
    },
    {
      title: "Impact",
      icon: Globe,
      color: "from-rose-500 to-red-500",
      border: "border-rose-500/40",
      desc: "How your knowledge, creations and journey create value for customers and inspire others."
    },
    {
      title: "Personal Growth",
      icon: Sparkles,
      color: "from-amber-400 to-yellow-500",
      border: "border-amber-400/40",
      desc: "How much you grow in confidence, discipline, leadership and belief in yourself."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-orange-500 selection:text-slate-950 relative overflow-hidden font-sans">
      {/* Dynamic Ambient Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-orange-600/15 via-amber-600/10 to-transparent blur-[120px] rounded-full" />
        <div className="absolute top-[30%] -left-40 w-[600px] h-[600px] bg-purple-600/10 blur-[140px] rounded-full" />
        <div className="absolute top-[65%] -right-40 w-[600px] h-[600px] bg-orange-600/10 blur-[140px] rounded-full" />
      </div>

      {/* ─── NAVIGATION BAR ─── */}
      <nav className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80 transition-all">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <BrandLogo size="md" />
            <div>
              <span className="text-xl font-black tracking-tight text-white block leading-none">
                RAVISHING<span className="text-orange-400">.ART</span>
              </span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block mt-0.5">
                Academy &amp; Business Hub
              </span>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-8 text-sm font-semibold text-slate-300">
            <a href="#problem" className="hover:text-orange-400 transition-colors">The Journey</a>
            <a href="#path" className="hover:text-orange-400 transition-colors">The Path</a>
            <a href="#curriculum" className="hover:text-orange-400 transition-colors">What You'll Learn</a>
            <a href="#dimensions" className="hover:text-orange-400 transition-colors">6 Dimensions</a>
            <a href="#community" className="hover:text-orange-400 transition-colors">Community</a>
            <a href="#mentor" className="hover:text-orange-400 transition-colors">Meet Mentor</a>
            <a href="#membership" className="hover:text-orange-400 transition-colors">Memberships</a>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-bold text-slate-300 hover:text-white transition-colors px-4 py-2"
            >
              Sign In
            </Link>
            <Link
              href="/webinar"
              className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-black rounded-xl text-sm transition-all shadow-lg shadow-orange-500/20 flex items-center gap-2"
            >
              Free Masterclass <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </nav>

      {/* ─── SECTION 1: HERO SECTION ─── */}
      <section className="relative pt-16 pb-20 px-6 z-10">
        <div className="max-w-6xl mx-auto text-center">

          {/* Tagline Pill */}
          <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-bold uppercase tracking-widest px-5 py-2.5 rounded-full mb-8 backdrop-blur-md shadow-inner">
            <Sparkles size={14} className="text-orange-400 animate-pulse" />
            <span>Join a community of women transforming creativity into freedom</span>
          </div>

          {/* Hero Headline */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[1.1] mb-6">
            Turn Your Resin Art Passion Into{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-yellow-400">
              Skill, Identity &amp; Financial Freedom.
            </span>
          </h1>

          {/* Hero Subtitle */}
          <p className="text-slate-300 text-lg md:text-xl max-w-3xl mx-auto mb-8 leading-relaxed font-normal">
            You already have the creativity. You already have the passion. What you need is the right path to turn that passion into something that gives you confidence, recognition, income and freedom.
          </p>

          {/* Value Pills */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-10 max-w-3xl mx-auto">
            {["Learn Resin Art", "Build Your Signature Style", "Create Your Identity", "Build Your Income"].map((pill, idx) => (
              <div key={idx} className="flex items-center gap-1.5 bg-slate-900/90 border border-slate-800 px-4 py-1.5 rounded-full text-xs font-bold text-slate-200">
                <CheckCircle2 size={13} className="text-orange-400" />
                {pill}
              </div>
            ))}
          </div>

          {/* Hero CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link
              href="/webinar"
              className="px-9 py-4 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 hover:opacity-95 text-slate-950 font-black rounded-2xl text-lg transition-all shadow-2xl shadow-orange-500/30 flex items-center gap-2.5 w-full sm:w-auto justify-center hover:scale-105"
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

          {/* ─── HERO VIDEO SHOWCASE (Real Masterclass Video) ─── */}
          <HeroVideoPlayer />

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-8 border-t border-slate-800/80">
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-md">
              <p className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300 mb-1">52K+</p>
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Students Taught</p>
            </div>
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-md">
              <p className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-300 mb-1">8K+</p>
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Orders Completed</p>
            </div>
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-md">
              <p className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-300 mb-1">5.0 ★</p>
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Google Play Rating</p>
            </div>
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-md">
              <p className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-300 mb-1">1140+</p>
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Active Community</p>
            </div>
          </div>

        </div>
      </section>

      {/* ─── SECTION 2: THE REAL PROBLEM ─── */}
      <section id="problem" className="py-24 px-6 bg-slate-900/40 border-y border-slate-800/80 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-red-400 text-xs font-black uppercase tracking-widest block mb-2">The Real Challenge</span>
            <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
              Beautiful Art Alone Doesn't Build a Business.
            </h2>
            <p className="text-slate-300 text-base md:text-lg leading-relaxed">
              You may know how to create beautiful resin pieces, but knowing the craft is only one part of the journey.
            </p>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-8 md:p-10 shadow-2xl space-y-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <AlertCircle className="text-amber-400" size={22} />
              You may still be wondering:
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                "What to learn next & which techniques to master",
                "What exact products to create for maximum demand",
                "How to develop your own signature recognizable style",
                "How to showcase your artwork with confidence",
                "How to get consistent, high-paying orders",
                "How to turn your creative skill into predictable income"
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4">
                  <div className="w-6 h-6 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 text-xs font-bold shrink-0 mt-0.5">
                    ?
                  </div>
                  <p className="text-sm text-slate-300 leading-snug">{item}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-transparent border-l-4 border-orange-500 rounded-r-2xl p-6">
              <p className="text-base md:text-lg font-bold text-white leading-relaxed">
                The problem isn't your talent. <span className="text-orange-400">The problem is that nobody gave you a clear path.</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECTION 3: THE REFRAME ─── */}
      <section className="py-24 px-6 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          <span className="text-orange-400 text-xs font-black uppercase tracking-widest block mb-2">The Strategic Mindset</span>
          <h2 className="text-3xl md:text-5xl font-black text-white mb-6">
            Resin Art Is Not the Destination. <span className="shimmer-text">It's the Vehicle.</span>
          </h2>
          <p className="text-slate-300 text-base md:text-lg max-w-3xl mx-auto mb-12 leading-relaxed">
            Resin Art can become the vehicle through which you discover your creativity, build your confidence, create a unique identity and create financial opportunities for yourself.
          </p>

          {/* The Vehicle Progression Map */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-8 md:p-10 shadow-2xl mb-12">
            <div className="grid grid-cols-2 md:grid-cols-6 gap-3 items-center">
              {[
                { title: "Passion", desc: "Creative spark", icon: Flame, color: "text-orange-400" },
                { title: "Skill", desc: "Technique mastery", icon: Brush, color: "text-amber-400" },
                { title: "Signature", desc: "Unique style", icon: Sparkles, color: "text-yellow-400" },
                { title: "Portfolio", desc: "Showcase proof", icon: Layers, color: "text-emerald-400" },
                { title: "Income", desc: "Monetization", icon: DollarSign, color: "text-cyan-400" },
                { title: "Freedom", desc: "Self-identity", icon: Trophy, color: "text-purple-400" }
              ].map((step, idx) => (
                <div key={idx} className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-center group hover:border-orange-500/50 transition-all">
                  <div className={`w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center mx-auto mb-2 ${step.color}`}>
                    <step.icon size={20} />
                  </div>
                  <p className="font-bold text-white text-sm">{step.title}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="max-w-2xl mx-auto text-center space-y-2">
            <p className="text-slate-300 text-base md:text-lg font-medium">
              You don't have to choose between being an artist and building a successful life.
            </p>
            <p className="text-xl md:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300">
              You can create beautiful art and create a beautiful future with it.
            </p>
          </div>
        </div>
      </section>

      {/* ─── SECTION 4: YOUR JOURNEY ─── */}
      <section className="py-20 px-6 bg-slate-900/40 border-y border-slate-800/80 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-orange-400 text-xs font-black uppercase tracking-widest block mb-2">Zero Barrier To Start</span>
          <h2 className="text-3xl md:text-5xl font-black text-white mb-6">
            Your Journey Starts With What You Already Have.
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10 text-left">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <div className="text-orange-400 font-black text-lg mb-1">✕ Not Needed</div>
              <p className="text-sm text-slate-300">You don't need to be an expert to begin.</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <div className="text-orange-400 font-black text-lg mb-1">✕ Not Needed</div>
              <p className="text-sm text-slate-300">You don't need an expensive or perfect setup.</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <div className="text-orange-400 font-black text-lg mb-1">✕ Not Needed</div>
              <p className="text-sm text-slate-300">You don't need thousands of social media followers.</p>
            </div>
          </div>

          <div className="bg-slate-900/90 border border-orange-500/40 rounded-3xl p-8 shadow-2xl">
            <p className="text-slate-300 text-base md:text-lg mb-4">
              You simply need the willingness to learn, create and take the next step.
            </p>
            <div className="bg-slate-950 rounded-2xl p-6 border border-slate-800">
              <p className="text-lg md:text-xl font-bold text-white">
                We help you move from <span className="text-slate-400 italic">"I want to learn Resin Art"</span> to:
              </p>
              <p className="text-xl md:text-2xl font-black text-orange-400 mt-2">
                "I know what I'm doing, I know what I'm creating and I know where I'm going."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECTION 5: DOES THIS SOUND LIKE YOU? ─── */}
      <section className="py-24 px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-orange-400 text-xs font-black uppercase tracking-widest block mb-2">Self Reflection</span>
            <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
              Does This Sound Like You?
            </h2>
            <p className="text-slate-400 text-base md:text-lg">
              Recognize where you are right now so we can guide you to where you want to be.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {/* Card 1 */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-8 hover:border-orange-500/40 transition-all shadow-xl flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400 font-black text-xl mb-6">
                  1
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  You Love Creating, But You Don't Know What To Focus On.
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  You keep learning different techniques from scattered videos but still feel confused about what you should master next to make real progress.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-8 hover:border-amber-500/40 transition-all shadow-xl flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-black text-xl mb-6">
                  2
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  You Create Beautiful Work, But You're Not Getting Consistent Orders.
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  You know your creations have value, but you don't know how to consistently attract the right customers and convert your creativity into predictable income.
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-8 hover:border-yellow-500/40 transition-all shadow-xl flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center text-yellow-400 font-black text-xl mb-6">
                  3
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  You Want Your Own Identity and Income—Not Another Hobby.
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  You want people to recognise you for your talent, you want something that is truly yours and you want your creativity to contribute to your financial freedom.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center bg-slate-900/60 border border-slate-800 rounded-2xl p-6 max-w-2xl mx-auto">
            <p className="text-base font-bold text-orange-400">
              ✨ If you see yourself in any of these, you're in the right place.
            </p>
          </div>
        </div>
      </section>

      {/* ─── SECTION 6: THE PATH ─── */}
      <section id="path" className="py-24 px-6 bg-slate-900/40 border-y border-slate-800/80 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-orange-400 text-xs font-black uppercase tracking-widest block mb-2">The Strategic Framework</span>
            <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
              You Don't Need Another Hobby. <span className="shimmer-text">You Need a Path.</span>
            </h2>
            <p className="text-slate-400 text-base md:text-lg">
              A structured journey can help you turn scattered learning into meaningful progress.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Step 1 */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-7 flex flex-col justify-between hover:border-orange-500/50 transition-all shadow-xl">
              <div>
                <span className="text-xs font-black text-orange-400 uppercase tracking-widest block mb-2">Stage 01</span>
                <h3 className="text-lg font-black text-white mb-3">Skill → Creation</h3>
                <p className="text-slate-300 text-xs leading-relaxed">
                  Learn the right techniques and develop the confidence to create professional-grade resin art from zero.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-7 flex flex-col justify-between hover:border-amber-500/50 transition-all shadow-xl">
              <div>
                <span className="text-xs font-black text-amber-400 uppercase tracking-widest block mb-2">Stage 02</span>
                <h3 className="text-lg font-black text-white mb-3">Creation → Signature</h3>
                <p className="text-slate-300 text-xs leading-relaxed">
                  Discover your creative strengths and develop a distinct style that feels uniquely and unmistakably yours.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-7 flex flex-col justify-between hover:border-yellow-500/50 transition-all shadow-xl">
              <div>
                <span className="text-xs font-black text-yellow-400 uppercase tracking-widest block mb-2">Stage 03</span>
                <h3 className="text-lg font-black text-white mb-3">Signature → Portfolio</h3>
                <p className="text-slate-300 text-xs leading-relaxed">
                  Build a collection of creations that represents your skills and helps you showcase your work with total confidence.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-7 flex flex-col justify-between hover:border-emerald-500/50 transition-all shadow-xl">
              <div>
                <span className="text-xs font-black text-emerald-400 uppercase tracking-widest block mb-2">Stage 04</span>
                <h3 className="text-lg font-black text-white mb-3">Portfolio → Income</h3>
                <p className="text-slate-300 text-xs leading-relaxed">
                  Learn how to position, present and monetize your creations so your skill becomes an income-generating business.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECTION 7: WHAT YOU WILL LEARN ─── */}
      <section id="curriculum" className="py-24 px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-orange-400 text-xs font-black uppercase tracking-widest block mb-2">Curriculum + Outcomes</span>
            <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
              What You'll Learn + What You'll Create
            </h2>
            <p className="text-slate-300 text-base md:text-lg">
              This isn't just about watching lessons. You'll learn the techniques, practice them through real creations and gradually build a portfolio that demonstrates your growth.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Pillar 1 */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-8 hover:border-orange-500/40 transition-all shadow-xl">
              <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400 mb-6">
                <Brush size={24} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Master Resin Art Techniques</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Understand the fundamentals and advanced techniques required to create beautiful, professional-quality resin artwork—from chemistry and bubble-free mixing to ocean lacing and geode crystal inlays.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-8 hover:border-purple-500/40 transition-all shadow-xl">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-6">
                <Palette size={24} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Develop Your Signature Style</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Move beyond copying others and discover the colours, techniques, compositions and products that make your work instantly recognizable in the market.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-8 hover:border-cyan-500/40 transition-all shadow-xl">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-6">
                <Layers size={24} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Build a Portfolio You Are Proud Of</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Create meaningful, commercial-grade projects that demonstrate your ability and give you something tangible to showcase to clients, interior designers, and collectors.
              </p>
            </div>

            {/* Pillar 4 */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-8 hover:border-emerald-500/40 transition-all shadow-xl">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-6">
                <TrendingUp size={24} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Learn How To Monetize Your Skill</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Understand how to turn your creations into products, orders, high-ticket custom commissions, workshop opportunities and sustainable monthly income.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECTION 8: SIX DIMENSIONS OF SUCCESS ─── */}
      <section id="dimensions" className="py-24 px-6 bg-slate-900/40 border-y border-slate-800/80 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-orange-400 text-xs font-black uppercase tracking-widest block mb-2">Holistic Development</span>
            <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
              Success Is More Than The Money You Make.
            </h2>
            <p className="text-slate-300 text-base md:text-lg">
              Your growth should be measured by the person you become along the way. We believe your Resin Art journey should help you grow across six important dimensions:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sixDimensions.map((dim, idx) => (
              <div
                key={idx}
                className={`bg-slate-900/90 border ${dim.border} rounded-3xl p-7 flex flex-col justify-between hover:scale-[1.02] transition-all shadow-xl`}
              >
                <div>
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${dim.color} flex items-center justify-center text-slate-950 font-black mb-6`}>
                    <dim.icon size={22} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{dim.title}</h3>
                  <p className="text-slate-300 text-sm leading-relaxed">{dim.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SECTION 9: VISIBLE GROWTH ─── */}
      <section className="py-24 px-6 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          <span className="text-orange-400 text-xs font-black uppercase tracking-widest block mb-2">Gamified Progress Tracking</span>
          <h2 className="text-3xl md:text-5xl font-black text-white mb-6">
            Your Growth Should Be Visible.
          </h2>
          <p className="text-slate-300 text-base md:text-lg max-w-3xl mx-auto mb-12 leading-relaxed">
            Every creation, challenge, milestone and achievement should tell a story of how far you've come. Instead of wondering whether you're progressing, you'll have tangible milestones that help you see, measure and celebrate your growth.
          </p>

          {/* Gamified Flow Pipeline */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 md:p-10 shadow-2xl">
            <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4">
              {[
                { title: "Learn", icon: BookOpen },
                { title: "Create", icon: Brush },
                { title: "Complete", icon: CheckCircle2 },
                { title: "Earn Points", icon: Flame },
                { title: "Unlock Milestones", icon: Trophy },
                { title: "Earn Recognition", icon: Crown }
              ].map((step, idx) => (
                <React.Fragment key={idx}>
                  <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 px-4 py-3 rounded-2xl text-xs md:text-sm font-bold text-white shadow-md">
                    <step.icon size={16} className="text-orange-400" />
                    {step.title}
                  </div>
                  {idx < 5 && (
                    <ChevronRight size={18} className="text-slate-600 hidden sm:block" />
                  )}
                </React.Fragment>
              ))}
            </div>

            <p className="text-orange-400 font-bold text-sm md:text-base mt-8">
              ✨ Your journey becomes something you can see, track and be proud of.
            </p>
          </div>
        </div>
      </section>

      {/* ─── SECTION 10: ART-O-THON ─── */}
      <section className="py-24 px-6 bg-slate-900/40 border-y border-slate-800/80 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-br from-orange-950/40 via-slate-900 to-slate-950 border-2 border-orange-500/40 rounded-3xl p-8 md:p-14 shadow-2xl">
            <div className="flex flex-col md:flex-row gap-8 items-center justify-between">
              <div className="space-y-4 max-w-2xl">
                <span className="text-orange-400 text-xs font-black uppercase tracking-widest block">Action-First Learning</span>
                <h2 className="text-3xl md:text-4xl font-black text-white">
                  ART-O-THON: Don't Just Learn. Create.
                </h2>
                <p className="text-slate-300 text-base leading-relaxed">
                  Learning becomes powerful when you put it into action. ART-O-THON is designed to turn learning into consistent creation through daily challenges, missions and milestone submissions.
                </p>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Every creation becomes a step forward. Every completed challenge becomes proof of your progress. And every milestone gives you another reason to celebrate how far you've come.
                </p>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 text-center shrink-0 w-full md:w-64 space-y-3">
                <Flame size={40} className="text-orange-500 mx-auto animate-bounce" />
                <p className="text-2xl font-black text-white">30-Day</p>
                <p className="text-xs text-orange-400 font-bold uppercase tracking-wider">Creation Sprint</p>
                <Link
                  href="/webinar"
                  className="block w-full py-3 bg-orange-500 hover:bg-orange-600 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider transition-all"
                >
                  Join Challenge
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECTION 11: COMMUNITY ─── */}
      <section id="community" className="py-24 px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-orange-400 text-xs font-black uppercase tracking-widest block mb-2">Sisterhood &amp; Support</span>
            <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
              You Don't Have To Build Alone.
            </h2>
            <p className="text-slate-300 text-base md:text-lg leading-relaxed">
              The journey becomes easier when you're surrounded by women who understand your dreams, your struggles and your ambition. Inside Ravishing Art Hub, you don't just learn from a coach. You learn, create, share, celebrate and grow together.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-12">
            {[
              { title: "Ask Questions", desc: "Get instant doubt resolution", icon: MessageCircle },
              { title: "Share Creations", desc: "Showcase your newest pours", icon: Palette },
              { title: "Get Feedback", desc: "Constructive mentor critiques", icon: CheckCircle2 },
              { title: "Celebrate Milestones", desc: "Cheer each other's wins", icon: Trophy },
              { title: "Learn Together", desc: "Collaborate with peers", icon: Users }
            ].map((item, idx) => (
              <div key={idx} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-center hover:border-orange-500/40 transition-all">
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center mx-auto mb-3">
                  <item.icon size={20} />
                </div>
                <p className="font-bold text-white text-sm">{item.title}</p>
                <p className="text-[11px] text-slate-400 mt-1">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <p className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300">
              "Because when women grow together, everyone grows stronger."
            </p>
          </div>
        </div>
      </section>

      {/* ─── SECTION 12: STUDENT TRANSFORMATION ─── */}
      <section className="py-20 overflow-hidden relative border-y border-slate-800/80 bg-slate-950/60 z-10">
        <div className="max-w-7xl mx-auto px-6 mb-12 text-center">
          <span className="text-orange-400 text-xs font-black uppercase tracking-widest block mb-2">Real Transformations</span>
          <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
            From “I Can't” To “I Created This.”
          </h2>
          <p className="text-slate-300 text-base md:text-lg max-w-3xl mx-auto leading-relaxed">
            Every student begins somewhere. Some begin with zero experience. Some begin with self-doubt. Some begin after years of putting their creativity aside. But with the right guidance, practice and community, they start creating things they once thought were impossible.
          </p>
          <p className="text-orange-400 text-sm font-bold mt-2">
            The transformation isn't just in what their hands can create. It's in what they start believing about themselves.
          </p>
        </div>

        {/* Marquee Row 1 */}
        <div className="relative mb-6">
          <div className="animate-marquee-left gap-6">
            {[...ARTWORKS_ROW_1, ...ARTWORKS_ROW_1].map((art, idx) => (
              <div
                key={`r1-${idx}`}
                className="w-[320px] md:w-[360px] bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shrink-0 hover:border-orange-500/50 transition-all duration-300 shadow-xl group"
              >
                <div className={`h-48 rounded-2xl bg-gradient-to-br ${art.gradient} p-4 flex flex-col justify-between relative overflow-hidden shadow-inner`}>
                  <div className="relative z-10 flex justify-between items-center">
                    <span className="text-[11px] font-black uppercase tracking-wider bg-slate-950/60 text-white px-3 py-1 rounded-full border border-white/10 backdrop-blur-md">
                      {art.badge}
                    </span>
                    <span className="text-xs font-black bg-emerald-500/90 text-slate-950 px-2.5 py-0.5 rounded-full shadow-md">
                      {art.price}
                    </span>
                  </div>
                  <div className="relative z-10">
                    <p className="text-lg font-black text-white drop-shadow-md">{art.title}</p>
                    <p className="text-xs text-slate-200/90 font-medium">{art.type}</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between pt-2 border-t border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center text-xs font-black text-slate-950">
                      {art.artist[0]}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white leading-none">{art.artist}</p>
                      <p className="text-[11px] text-slate-400 font-medium">{art.level}</p>
                    </div>
                  </div>
                  <span className="text-[11px] text-orange-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 size={13} /> Verified Piece
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Marquee Row 2 */}
        <div className="relative">
          <div className="animate-marquee-right gap-6">
            {[...ARTWORKS_ROW_2, ...ARTWORKS_ROW_2].map((art, idx) => (
              <div
                key={`r2-${idx}`}
                className="w-[320px] md:w-[360px] bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shrink-0 hover:border-orange-500/50 transition-all duration-300 shadow-xl group"
              >
                <div className={`h-48 rounded-2xl bg-gradient-to-br ${art.gradient} p-4 flex flex-col justify-between relative overflow-hidden shadow-inner`}>
                  <div className="relative z-10 flex justify-between items-center">
                    <span className="text-[11px] font-black uppercase tracking-wider bg-slate-950/60 text-white px-3 py-1 rounded-full border border-white/10 backdrop-blur-md">
                      {art.badge}
                    </span>
                    <span className="text-xs font-black bg-emerald-500/90 text-slate-950 px-2.5 py-0.5 rounded-full shadow-md">
                      {art.price}
                    </span>
                  </div>
                  <div className="relative z-10">
                    <p className="text-lg font-black text-white drop-shadow-md">{art.title}</p>
                    <p className="text-xs text-slate-200/90 font-medium">{art.type}</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between pt-2 border-t border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-500 flex items-center justify-center text-xs font-black text-slate-950">
                      {art.artist[0]}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white leading-none">{art.artist}</p>
                      <p className="text-[11px] text-slate-400 font-medium">{art.level}</p>
                    </div>
                  </div>
                  <span className="text-[11px] text-cyan-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 size={13} /> Verified Piece
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SECTION 13: SOCIAL PROOF ─── */}
      <section className="py-24 px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-orange-400 text-xs font-black uppercase tracking-widest block mb-2">Verified Track Record</span>
            <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
              52K+ Students Taught. 8K+ Orders Completed. 5★ Google Rating.
            </h2>
            <p className="text-slate-300 text-base md:text-lg leading-relaxed">
              Thousands of learners have already trusted Ravishing Art to help them explore, learn and grow through Resin Art. From beginners taking their first step to creators building their own identity and income, every journey is different. But every journey begins with one decision: to start.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {VERIFIED_REVIEWS.map((rev, idx) => (
              <div
                key={idx}
                className="bg-slate-900 border border-slate-800 rounded-3xl p-7 flex flex-col justify-between hover:border-orange-500/40 transition-all shadow-xl"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex gap-1">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} size={14} className="text-amber-400 fill-amber-400" />
                      ))}
                    </div>
                    <span className="text-[10px] text-slate-500 font-medium">Google Play · {rev.date}</span>
                  </div>
                  <p className="text-slate-200 text-sm leading-relaxed mb-6 italic">
                    "{rev.comment}"
                  </p>
                </div>
                <div className="flex items-center gap-3 pt-4 border-t border-slate-800">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-tr ${rev.avatarBg} flex items-center justify-center font-black text-slate-950 text-sm shrink-0`}>
                    {rev.name[0]}
                  </div>
                  <div>
                    <p className="font-bold text-white text-sm">{rev.name}</p>
                    <p className="text-xs text-orange-400 font-semibold">{rev.tag}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Google Play Rating Badge */}
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-4 bg-slate-900/80 border border-slate-800 rounded-2xl px-6 py-4 shadow-xl">
              <div className="text-center">
                <p className="text-4xl font-black text-white">5.0</p>
                <div className="flex gap-0.5 mt-1 justify-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
              </div>
              <div className="w-px h-12 bg-slate-700" />
              <div>
                <p className="text-sm font-bold text-white">Ravishing Art App</p>
                <p className="text-xs text-slate-400">Google Play Store · 100% Real Student Feedback</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECTION 14: ABOUT VRAJANGNA ─── */}
      <section id="mentor" className="py-24 px-6 bg-slate-900/40 border-y border-slate-800/80 relative z-10">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-8 md:p-14 shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-4 text-center">
                <div className="relative w-48 h-48 sm:w-60 sm:h-60 mx-auto mb-4 rounded-3xl overflow-hidden border-2 border-orange-500/50 shadow-2xl shadow-orange-500/30 group">
                  <img
                    src="/images/mentor/vrajangna-portrait.jpg"
                    alt="Vrajangna Patel - Resin Art & Business Coach"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <h3 className="text-2xl font-black text-white">Vrajangna Patel</h3>
                <p className="text-xs text-orange-400 font-bold mt-1 uppercase tracking-wider">
                  Founder &amp; Resin Art Business Coach
                </p>
              </div>

              <div className="lg:col-span-8 space-y-5">
                <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full">
                  <Sparkles size={13} /> Meet Your Mentor &amp; Coach
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

                <p className="text-orange-400 font-bold text-sm md:text-base">
                  "Because I believe every woman deserves the opportunity to create an identity beyond the roles she plays for everyone else."
                </p>
              </div>
            </div>
          </div>

          {/* Real Mentor Recognition Photos Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-xl group hover:border-orange-500/40 transition-all">
              <div className="h-64 overflow-hidden relative">
                <img
                  src="/images/mentor/hall-of-fame-award.jpg"
                  alt="Vrajangna Patel Hall of Fame Award"
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                <span className="absolute top-4 left-4 bg-orange-500 text-slate-950 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-lg">
                  🏆 Hall of Fame Award
                </span>
              </div>
              <div className="p-5">
                <h4 className="font-bold text-white text-base">Hall of Fame 2022–23</h4>
                <p className="text-xs text-slate-400 mt-1">Recognized on stage by Siddharth Rajsekar at Freedom Retreat.</p>
              </div>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-xl group hover:border-cyan-500/40 transition-all">
              <div className="h-64 overflow-hidden relative">
                <img
                  src="/images/mentor/diamond-award.jpg"
                  alt="Vrajangna Patel Diamond Awards"
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                <span className="absolute top-4 left-4 bg-cyan-400 text-slate-950 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-lg">
                  💎 Diamond Club Felicitation
                </span>
              </div>
              <div className="p-5">
                <h4 className="font-bold text-white text-base">Diamond Awardee</h4>
                <p className="text-xs text-slate-400 mt-1">Awarded top mentor status for empowering thousands of artists.</p>
              </div>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-xl group hover:border-purple-500/40 transition-all">
              <div className="h-64 overflow-hidden relative">
                <img
                  src="/images/mentor/author-feature.jpg"
                  alt="Vrajangna Patel Published Author"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                <span className="absolute top-4 left-4 bg-purple-400 text-slate-950 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-lg">
                  📖 Published Author
                </span>
              </div>
              <div className="p-5">
                <h4 className="font-bold text-white text-base">"I Can Coach" Transformation</h4>
                <p className="text-xs text-slate-400 mt-1">Featured as a leading Resin Art Business Coach across India.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECTION 15: YOUR RAVISHING JOURNEY (Membership Tiers) ─── */}
      <section id="membership" className="py-24 px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-orange-400 text-xs font-black uppercase tracking-widest block mb-2">Level Progression</span>
            <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
              Choose Your Ravishing Journey
            </h2>
            <p className="text-slate-400 text-base md:text-lg">
              Wherever you are today, there is a next step for you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* L0: START */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-7 flex flex-col justify-between hover:border-orange-500/50 transition-all shadow-xl">
              <div>
                <span className="text-[10px] font-black bg-orange-500/10 text-orange-400 border border-orange-500/30 px-3 py-1 rounded-full uppercase tracking-wider block w-fit mb-4">
                  Level 0 · START
                </span>
                <h3 className="text-xl font-bold text-white mb-2">Explore Your Creativity</h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-6">
                  Begin your Resin Art journey, understand the fundamentals and create your first beautiful pieces with confidence.
                </p>
                <div className="space-y-2 border-t border-slate-800 pt-4">
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <Check size={14} className="text-orange-400" /> FastTrack Starter Toolkit
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <Check size={14} className="text-orange-400" /> Basic Epoxy Chemistry
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <Check size={14} className="text-orange-400" /> First 3 Practical Pours
                  </div>
                </div>
              </div>
              <Link
                href="/webinar"
                className="mt-8 w-full py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs text-center block transition-all"
              >
                Join Level 0
              </Link>
            </div>

            {/* L1: GROW */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-7 flex flex-col justify-between hover:border-amber-500/50 transition-all shadow-xl">
              <div>
                <span className="text-[10px] font-black bg-amber-500/10 text-amber-400 border border-amber-500/30 px-3 py-1 rounded-full uppercase tracking-wider block w-fit mb-4">
                  Level 1 · GROW
                </span>
                <h3 className="text-xl font-bold text-white mb-2">Build Skills &amp; Signature</h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-6">
                  Go deeper into techniques, creativity, portfolio building and the skills required to take your art seriously.
                </p>
                <div className="space-y-2 border-t border-slate-800 pt-4">
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <Check size={14} className="text-amber-400" /> Ocean Lacing &amp; Geodes
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <Check size={14} className="text-amber-400" /> Portfolio Foundations
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <Check size={14} className="text-amber-400" /> Daily Action Missions
                  </div>
                </div>
              </div>
              <Link
                href="/register"
                className="mt-8 w-full py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs text-center block transition-all"
              >
                Explore Level 1
              </Link>
            </div>

            {/* L2: MASTER */}
            <div className="bg-slate-900/90 border-2 border-orange-500/60 rounded-3xl p-7 flex flex-col justify-between shadow-2xl relative">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 text-[10px] font-black uppercase tracking-wider px-3 py-0.5 rounded-full shadow-md">
                Most Popular
              </span>
              <div>
                <span className="text-[10px] font-black bg-orange-500/20 text-orange-400 border border-orange-500/40 px-3 py-1 rounded-full uppercase tracking-wider block w-fit mb-4">
                  Level 2 · MASTER
                </span>
                <h3 className="text-xl font-bold text-white mb-2">Build Identity &amp; Income</h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-6">
                  Develop advanced skills, strengthen your personal brand, understand business and build a sustainable path around your creativity.
                </p>
                <div className="space-y-2 border-t border-slate-800 pt-4">
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <Check size={14} className="text-orange-400" /> Bridal Preservation &amp; Clocks
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <Check size={14} className="text-orange-400" /> Pricing &amp; Client Acquisition
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <Check size={14} className="text-orange-400" /> Live Mentorship Calls
                  </div>
                </div>
              </div>
              <Link
                href="/webinar"
                className="mt-8 w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-black rounded-xl text-xs text-center block transition-all shadow-lg"
              >
                Apply for Master
              </Link>
            </div>

            {/* L3: CERTIFY */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-7 flex flex-col justify-between hover:border-cyan-500/50 transition-all shadow-xl">
              <div>
                <span className="text-[10px] font-black bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 px-3 py-1 rounded-full uppercase tracking-wider block w-fit mb-4">
                  Level 3 · CERTIFY
                </span>
                <h3 className="text-xl font-bold text-white mb-2">Recognised Creator</h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-6">
                  Take your skills, portfolio, business knowledge and personal growth to the highest level through structured milestones and certification.
                </p>
                <div className="space-y-2 border-t border-slate-800 pt-4">
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <Check size={14} className="text-cyan-400" /> Certified Trainer Status
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <Check size={14} className="text-cyan-400" /> High-Ticket Furniture Pours
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <Check size={14} className="text-cyan-400" /> Hall of Fame Induction
                  </div>
                </div>
              </div>
              <Link
                href="/register"
                className="mt-8 w-full py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs text-center block transition-all"
              >
                Learn About Level 3
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECTION 16: FREE MASTERCLASS ─── */}
      <section className="py-24 px-6 bg-slate-900/40 border-y border-slate-800/80 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-orange-400 text-xs font-black uppercase tracking-widest block mb-2">Free Training Invitation</span>
          <h2 className="text-3xl md:text-5xl font-black text-white mb-6">
            Not Sure Where To Start? <span className="shimmer-text">Start Here.</span>
          </h2>
          <p className="text-slate-300 text-base md:text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
            Join my FREE Resin Mastery Masterclass and discover the three essential shifts that can help you move from simply learning Resin Art to confidently building something of your own.
          </p>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-2xl mx-auto text-left mb-10 space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 size={20} className="text-orange-400 shrink-0 mt-0.5" />
              <p className="text-sm text-slate-200">Understand what it really takes to develop professional-level resin skills from home.</p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 size={20} className="text-orange-400 shrink-0 mt-0.5" />
              <p className="text-sm text-slate-200">Create your signature style that sets you apart from amateur creators.</p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 size={20} className="text-orange-400 shrink-0 mt-0.5" />
              <p className="text-sm text-slate-200">Explore the practical business potential of Resin Art with zero guesswork.</p>
            </div>
            <div className="pt-2 border-t border-slate-800 text-xs text-slate-400 font-medium">
              ✓ No pressure. No complicated jargon. Just clarity on your next step.
            </div>
          </div>

          <Link
            href="/webinar"
            className="px-10 py-5 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 hover:opacity-95 text-slate-950 font-black rounded-2xl text-xl transition-all shadow-2xl shadow-orange-500/30 inline-flex items-center gap-3 hover:scale-105"
          >
            <Sparkles size={22} />
            Join The Free Masterclass
          </Link>
        </div>
      </section>

      {/* ─── SECTION 17: FINAL EMOTIONAL CTA ─── */}
      <section className="py-24 px-6 relative overflow-hidden z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-orange-600/10 via-amber-600/5 to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-orange-500/40">
            <Palette size={32} className="text-slate-950 stroke-[2.5]" />
          </div>

          <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight leading-tight">
            Your Art Has More Potential{" "}
            <span className="shimmer-text">Than You Think.</span>
          </h2>

          <div className="text-slate-300 text-base md:text-lg max-w-2xl mx-auto mb-8 leading-relaxed space-y-3 font-normal">
            <p>Maybe Resin Art started as something you simply wanted to learn.</p>
            <p>Maybe it was a way to express yourself.</p>
            <p>Maybe you were looking for something that was yours.</p>
            <div className="pt-4 pb-2 space-y-1">
              <p className="text-lg md:text-xl font-bold text-white">But what if it could become much more?</p>
              <p className="text-orange-400 font-bold">What if your art could become your identity?</p>
              <p className="text-amber-400 font-bold">What if your skill could become your income?</p>
              <p className="text-yellow-400 font-bold">What if your creativity could create freedom?</p>
            </div>
            <p className="text-slate-400 text-sm pt-2">
              You don't have to know the entire journey today. You just need to take the first step.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/webinar"
              className="px-10 py-5 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 hover:opacity-95 text-slate-950 font-black rounded-2xl text-xl transition-all shadow-2xl shadow-orange-500/30 flex items-center gap-3 w-full sm:w-auto justify-center hover:scale-105"
            >
              <Sparkles size={22} />
              Start My Resin Journey
            </Link>
          </div>
        </div>
      </section>

      {/* ─── SECTION 18: FOOTER / CLOSING STATEMENT ─── */}
      <footer className="bg-slate-950 border-t border-slate-800/80 py-16 px-6 relative z-10 text-slate-400">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 pb-12 border-b border-slate-800/80">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <BrandLogo size="md" />
                <span className="text-2xl font-black text-white tracking-tight">
                  RAVISHING<span className="text-orange-400">.ART</span>
                </span>
              </div>
              <h3 className="text-xl font-bold text-white">Create. Connect. Grow. Become Ravishing.</h3>
              <p className="text-sm text-slate-400 max-w-lg leading-relaxed">
                Ravishing Art Hub is a community for ambitious women who want to transform their creativity into skill, identity, impact and financial freedom. Your creativity deserves a place in your life. And your journey starts here.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/webinar"
                className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-slate-950 font-bold rounded-xl text-sm transition-all"
              >
                Join Free Masterclass
              </Link>
              <Link
                href="/login"
                className="px-6 py-3 bg-slate-900 border border-slate-800 hover:border-slate-700 text-white font-bold rounded-xl text-sm transition-all"
              >
                Student Portal
              </Link>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-400">
            <p>© {new Date().getFullYear()} Ravishing Art Hub. All Rights Reserved. Mastered with Passion.</p>
            <div className="flex gap-6">
              <Link href="/privacy" className="hover:text-slate-300 transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-slate-300 transition-colors">Terms of Service</Link>
              <Link href="/contact" className="hover:text-slate-300 transition-colors">Contact Support</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
