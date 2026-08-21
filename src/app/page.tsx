"use client";

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
  Eye,
  ShieldCheck,
  Package,
  HelpCircle,
  Compass
} from "lucide-react";

// Curated Art Showcase Items for the Dual-Row Marquee
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
    badge: "Clockwork"
  },
  {
    title: "Teakwood Coffee River Table (24in)",
    artist: "Arjun N.",
    type: "Kiln-Dried Hardwood Inlay",
    level: "Diamond Club",
    price: "₹45,000 Sold",
    gradient: "from-teal-600 via-emerald-800 to-slate-950",
    accent: "text-teal-300",
    badge: "Wood Working"
  }
];

// Interactive Technique Exploration System
const ART_DISCIPLINES = [
  {
    id: "ocean",
    title: "Ocean & Coastal Resin",
    tag: "Signature Technique",
    desc: "Master realistic white cellular lacing, blowtorch beach waves, crushed real seashell inlays, and multi-depth Pacific blue gradient pours on live-edge timber.",
    materials: ["Low-Viscosity Art Resin", "White Wave Paste", "Mica Luster Powders", "Heat Gun / Micro Torch"],
    gradient: "from-cyan-500/20 via-teal-500/10 to-transparent",
    border: "border-cyan-500/40",
    icon: Compass,
    accent: "text-cyan-400"
  },
  {
    id: "geode",
    title: "3D Crystal Geodes & Clocks",
    tag: "High-Margin Decor",
    desc: "Learn real quartz crystal embedding, raw glitter vein mapping, mirror gold leafing, and silent quartz Roman clock movements that retail for ₹6,000 to ₹25,000.",
    materials: ["High-Viscosity Thick Resin", "Crushed Fire Glass", "Natural Quartz Points", "Metallic Acrylic Inks"],
    gradient: "from-purple-500/20 via-pink-500/10 to-transparent",
    border: "border-purple-500/40",
    icon: Gem,
    accent: "text-purple-400"
  },
  {
    id: "preservation",
    title: "Bridal Flower Preservation",
    tag: "Emotional Keepsakes",
    desc: "The fastest growing wedding industry art: chemical silica gel 3D drying of fresh bridal jaimalas, anti-bubble deep pour castings, and UV-resistant keepsake blocks.",
    materials: ["Deep-Pour 3:1 Epoxy", "Silica Flower Drying Gel", "Silicone Block Molds", "Bubble Release Chamber"],
    gradient: "from-rose-500/20 via-amber-500/10 to-transparent",
    border: "border-rose-500/40",
    icon: Heart,
    accent: "text-rose-400"
  },
  {
    id: "furniture",
    title: "Live Edge River Furniture",
    tag: "Diamond Mastery",
    desc: "Step into ultra-luxury bespoke furniture. Master moisture-meter wood stabilization, leak-proof melamine formwork, 50mm single-pour crystal rivers, and satin buffer polishes.",
    materials: ["Seasoned Teak / Acacia Slab", "Cast Pour Epoxy (50mm)", "Melamine Mold Box", "Orbital Buffer & Wax"],
    gradient: "from-emerald-500/20 via-teal-500/10 to-transparent",
    border: "border-emerald-500/40",
    icon: Layers,
    accent: "text-emerald-400"
  }
];

// Transformation Roadmap Steps
const ROADMAP_STEPS = [
  {
    step: "01",
    tier: "Fast Start (L0)",
    title: "Resin Chemistry & Safety",
    desc: "Understand 2:1 vs 3:1 mix ratios, ambient temperature control, bubble prevention without vacuums, and studio safety gear.",
    badge: "Free Access",
    badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
  },
  {
    step: "02",
    tier: "Silver Member (L1)",
    title: "Signature Decor Pieces",
    desc: "Create flawless ocean coaster suites, bookmark sets, and initial keychains. Master bubble-free topcoats and mirror edge gilding.",
    badge: "Core Mastery",
    badgeColor: "bg-slate-700/50 text-slate-300 border-slate-600"
  },
  {
    step: "03",
    tier: "Gold Member (L2)",
    title: "Statement Wall Art & Clocks",
    desc: "Build 24-inch Roman numeral geode wall clocks and 3D floral blocks. Learn packaging, courier proofing, and pricing formulas.",
    badge: "Business Tier",
    badgeColor: "bg-amber-500/10 text-amber-400 border-amber-500/20"
  },
  {
    step: "04",
    tier: "Diamond Club (L3+)",
    title: "Luxury Furniture & Brand",
    desc: "Deep pour river tables, wedding preservation bulk orders, client consultation frameworks, and corporate gift contracts.",
    badge: "Mastery Tier",
    badgeColor: "bg-purple-500/10 text-purple-400 border-purple-500/20"
  }
];

const FAQS = [
  {
    q: "I have zero art experience. Can I really make gallery-grade resin pieces?",
    a: "Absolutely. Resin is 70% science and technique, and 30% creativity. Our Level 0 and Level 1 curriculum takes you through exact gram-scale measurement formulas, color wheel theory, and guided video walkthroughs so you never waste expensive raw materials."
  },
  {
    q: "How does the Gamified LMS & Mentor Critique work?",
    a: "Every lesson comes with a practical Action Mission. When you pour a piece, you upload 3 photos to your Student Dashboard. Vrajangna Patel and senior mentors critique your wave lacing, edges, and finish, award you XP, and unlock the next level!"
  },
  {
    q: "Where do I source raw materials, epoxy resin, and molds across India?",
    a: "Inside the academy, you get our curated Raw Material Sourcing Directory with direct verified supplier contacts for crystal-clear epoxies, silicone molds, mica powders, crystals, and clock movements with exclusive student discounts."
  },
  {
    q: "How does the Business & Monetization roadmap help me sell art?",
    a: "We don't just teach art; we teach creative entrepreneurship. You'll learn how to price pieces with a 4x profit margin formula, shoot viral Instagram Reels, package for zero breakage during shipping, and close ₹10,000+ custom client commissions."
  },
  {
    q: "Is resin safe to work with from home or a small room?",
    a: "Yes. In Level 0, we dedicate an entire module to home-studio safety: proper ventilation, organic vapor masks, nitrile gloves, and eco-friendly low-VOC epoxy brands."
  }
];

export default function Home() {
  const [activeTab, setActiveTab] = useState<string>("ocean");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const selectedDiscipline = ART_DISCIPLINES.find((d) => d.id === activeTab) || ART_DISCIPLINES[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-orange-500 selection:text-white relative">

      {/* ─── FLUID RESIN AMBIENT BLOBS ─── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-[15%] -left-[10%] w-[650px] h-[650px] bg-gradient-to-tr from-orange-600/15 via-rose-600/10 to-amber-500/10 rounded-full blur-[140px] animate-blob-morph" />
        <div className="absolute top-[40%] -right-[15%] w-[600px] h-[600px] bg-gradient-to-bl from-cyan-600/15 via-teal-700/10 to-blue-800/10 rounded-full blur-[150px] animate-blob-morph-delayed" />
        <div className="absolute -bottom-[10%] left-[25%] w-[550px] h-[550px] bg-gradient-to-r from-purple-600/10 via-pink-600/10 to-transparent rounded-full blur-[160px] animate-blob-morph" />

        {/* Subtle Canvas Grain Grid */}
        <div className="absolute inset-0 bg-[radial-gradient(rgba(249,115,22,0.06)_1px,transparent_1px)] bg-[size:32px_32px] opacity-70" />
      </div>

      {/* ─── LUXURY ARTISAN NAVBAR ─── */}
      <nav className="sticky top-0 z-50 border-b border-slate-800/60 bg-slate-950/80 backdrop-blur-2xl transition-all">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center group">
            <img
              src="/logo.png"
              alt="Ravishing Art Hub"
              className="h-10 md:h-12 w-auto object-contain group-hover:scale-105 transition-transform"
            />
          </Link>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#masterpieces" className="hover:text-orange-400 transition-colors">Art Gallery</a>
            <a href="#techniques" className="hover:text-orange-400 transition-colors">Techniques</a>
            <a href="#roadmap" className="hover:text-orange-400 transition-colors">Artist Journey</a>
            <a href="#stories" className="hover:text-orange-400 transition-colors">Success Stories</a>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-slate-300 hover:text-white font-semibold text-sm px-4 py-2 rounded-xl hover:bg-slate-800/80 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-black text-sm px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-orange-500/25 flex items-center gap-1.5 hover:shadow-orange-500/40 hover:-translate-y-0.5"
            >
              Enter Studio <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </nav>

      {/* ─── HERO SECTION: ART STUDIO ATMOSPHERE ─── */}
      <section className="relative pt-20 pb-16 px-6 z-10">
        <div className="max-w-6xl mx-auto text-center">

          {/* Badge */}
          <div className="inline-flex items-center gap-2.5 bg-orange-500/10 border border-orange-500/30 text-orange-300 text-xs font-bold uppercase tracking-widest px-5 py-2.5 rounded-full mb-8 backdrop-blur-md shadow-inner">
            <Sparkles size={14} className="text-orange-400 animate-pulse" />
            <span>India's Premier Resin & Luxury Art Academy</span>
            <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
            <span className="text-slate-400 lowercase font-normal">500+ Active Artists</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[1.1] mb-8">
            Master The Fine Craft of{" "}
            <span className="shimmer-text">
              Fluid Resin Art.
            </span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-100 via-slate-200 to-slate-400">
              Build A ₹1L+ Creative Business.
            </span>
          </h1>

          {/* Description */}
          <p className="text-slate-300 text-lg md:text-xl max-w-3xl mx-auto mb-12 leading-relaxed font-normal">
            Step-by-step masterclasses in <strong className="text-orange-400">Ocean Lacing, 3D Geodes, Roman Clocks, and Bridal Preservations</strong>. Transform liquid epoxy into gallery-worthy luxury decor with daily guidance and business mentorship.
          </p>

          {/* Call to Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link
              href="/register"
              className="px-8 py-4 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 hover:opacity-95 text-slate-950 font-black rounded-2xl text-lg transition-all shadow-2xl shadow-orange-500/30 flex items-center gap-2.5 w-full sm:w-auto justify-center hover:scale-[1.02]"
            >
              <Brush size={20} />
              Start Your Art Journey Free
            </Link>
            <a
              href="#masterpieces"
              className="px-8 py-4 bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-slate-200 font-bold rounded-2xl text-lg transition-all w-full sm:w-auto justify-center flex items-center gap-2 hover:border-orange-500/40"
            >
              <Eye size={20} className="text-orange-400" />
              Explore Student Art Gallery
            </a>
          </div>

          {/* Quick Studio Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-6 border-t border-slate-800/80">
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-md">
              <p className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300 mb-1">500+</p>
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Independent Artists</p>
            </div>
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-md">
              <p className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-300 mb-1">12+</p>
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Resin Art Modules</p>
            </div>
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-md">
              <p className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-300 mb-1">₹1Cr+</p>
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Student Sales Generated</p>
            </div>
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-md">
              <p className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-300 mb-1">4.9 ★</p>
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Artist Satisfaction</p>
            </div>
          </div>

        </div>
      </section>

      {/* ─── SECTION 2: DUAL-ROW INFINITE MASTERPIECE MARQUEE ─── */}
      <section id="masterpieces" className="py-20 overflow-hidden relative border-y border-slate-800/60 bg-slate-950/60">
        <div className="max-w-7xl mx-auto px-6 mb-10 text-center">
          <span className="text-orange-400 text-xs font-black uppercase tracking-widest block mb-2">Live Student Exhibition</span>
          <h2 className="text-3xl md:text-5xl font-black text-white">
            Real Artworks Created & Sold by Our Alumni
          </h2>
          <p className="text-slate-400 text-sm md:text-base mt-2">
            Every piece below was handcrafted by a student starting from zero experience.
          </p>
        </div>

        {/* Row 1: Leftward Marquee */}
        <div className="relative mb-6">
          <div className="animate-marquee-left gap-6">
            {[...ARTWORKS_ROW_1, ...ARTWORKS_ROW_1].map((art, idx) => (
              <div
                key={`r1-${idx}`}
                className="w-[320px] md:w-[360px] bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shrink-0 hover:border-orange-500/50 transition-all duration-300 hover:-translate-y-1 shadow-xl group"
              >
                {/* Artwork Visual Card */}
                <div className={`h-48 rounded-2xl bg-gradient-to-br ${art.gradient} p-4 flex flex-col justify-between relative overflow-hidden shadow-inner`}>
                  {/* Subtle Resin Fluid Overlay */}
                  <div className="absolute inset-0 bg-white/5 backdrop-blur-[2px] opacity-40 group-hover:opacity-10 transition-opacity" />
                  <div className="relative z-10 flex justify-between items-center">
                    <span className="text-[11px] font-black uppercase tracking-wider bg-slate-950/60 text-white px-3 py-1 rounded-full border border-white/10 backdrop-blur-md">
                      {art.badge}
                    </span>
                    <span className="text-xs font-black bg-emerald-500/90 text-slate-950 px-2.5 py-0.5 rounded-full shadow-md">
                      {art.price}
                    </span>
                  </div>
                  <div className="relative z-10">
                    <p className="text-lg font-black text-white drop-shadow-md">
                      {art.title}
                    </p>
                    <p className="text-xs text-slate-200/90 font-medium">{art.type}</p>
                  </div>
                </div>

                {/* Artist Meta */}
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

        {/* Row 2: Rightward Marquee */}
        <div className="relative">
          <div className="animate-marquee-right gap-6">
            {[...ARTWORKS_ROW_2, ...ARTWORKS_ROW_2].map((art, idx) => (
              <div
                key={`r2-${idx}`}
                className="w-[320px] md:w-[360px] bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shrink-0 hover:border-cyan-500/50 transition-all duration-300 hover:-translate-y-1 shadow-xl group"
              >
                {/* Artwork Visual Card */}
                <div className={`h-48 rounded-2xl bg-gradient-to-br ${art.gradient} p-4 flex flex-col justify-between relative overflow-hidden shadow-inner`}>
                  <div className="absolute inset-0 bg-white/5 backdrop-blur-[2px] opacity-40 group-hover:opacity-10 transition-opacity" />
                  <div className="relative z-10 flex justify-between items-center">
                    <span className="text-[11px] font-black uppercase tracking-wider bg-slate-950/60 text-white px-3 py-1 rounded-full border border-white/10 backdrop-blur-md">
                      {art.badge}
                    </span>
                    <span className="text-xs font-black bg-emerald-500/90 text-slate-950 px-2.5 py-0.5 rounded-full shadow-md">
                      {art.price}
                    </span>
                  </div>
                  <div className="relative z-10">
                    <p className="text-lg font-black text-white drop-shadow-md">
                      {art.title}
                    </p>
                    <p className="text-xs text-slate-200/90 font-medium">{art.type}</p>
                  </div>
                </div>

                {/* Artist Meta */}
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

      {/* ─── SECTION 3: INTERACTIVE ART MEDIUM & TECHNIQUE EXPLORER ─── */}
      <section id="techniques" className="py-24 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">

          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-orange-400 text-xs font-black uppercase tracking-widest block mb-2">Techniques You Will Master</span>
            <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
              Explore The Four Signature Art Disciplines
            </h2>
            <p className="text-slate-400 text-base md:text-lg">
              Each module comes with high-definition video walkthroughs, raw material formula sheets, and live mentor critiques.
            </p>
          </div>

          {/* Medium Selector Tabs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto mb-12">
            {ART_DISCIPLINES.map((d) => {
              const Icon = d.icon;
              const isSelected = activeTab === d.id;
              return (
                <button
                  key={d.id}
                  onClick={() => setActiveTab(d.id)}
                  className={`p-4 rounded-2xl border text-left transition-all flex flex-col gap-2 relative overflow-hidden ${isSelected
                    ? "bg-slate-900 border-orange-500 shadow-xl shadow-orange-500/10 ring-1 ring-orange-500"
                    : "bg-slate-900/50 border-slate-800 hover:border-slate-700 hover:bg-slate-900"
                    }`}
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${isSelected ? "bg-orange-500 text-slate-950" : "bg-slate-800 text-slate-400"}`}>
                    <Icon size={18} />
                  </div>
                  <div>
                    <p className={`font-bold text-sm leading-tight ${isSelected ? "text-white" : "text-slate-300"}`}>{d.title}</p>
                    <span className="text-[11px] text-orange-400 font-semibold">{d.tag}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Medium Spotlight Display */}
          <div className={`bg-slate-900/90 border ${selectedDiscipline.border} rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden backdrop-blur-xl transition-all duration-300`}>
            <div className={`absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl ${selectedDiscipline.gradient} rounded-full blur-3xl pointer-events-none`} />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-xs font-bold text-orange-400">
                  <Sparkles size={13} /> {selectedDiscipline.tag} Module
                </div>

                <h3 className="text-3xl md:text-4xl font-black text-white">
                  {selectedDiscipline.title}
                </h3>

                <p className="text-slate-300 text-base md:text-lg leading-relaxed">
                  {selectedDiscipline.desc}
                </p>

                <div className="space-y-3 pt-2">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Core Studio Materials & Chemicals:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedDiscipline.materials.map((mat, i) => (
                      <span key={i} className="text-xs font-semibold bg-slate-800/90 border border-slate-700 text-slate-200 px-3 py-1.5 rounded-xl">
                        ✓ {mat}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 flex flex-wrap gap-4">
                  <Link
                    href="/register"
                    className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-slate-950 font-bold rounded-xl text-sm transition-all shadow-lg shadow-orange-500/25 flex items-center gap-2"
                  >
                    Unlock Curriculum Free <ArrowRight size={15} />
                  </Link>
                  <a
                    href="#roadmap"
                    className="px-6 py-3 bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold rounded-xl text-sm transition-all flex items-center gap-2"
                  >
                    View All 4 Tiers
                  </a>
                </div>
              </div>

              {/* Right Side: Artwork Preview Visual */}
              <div className="lg:col-span-5 relative">
                <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl aspect-square flex flex-col justify-between p-6 bg-gradient-to-br from-slate-900 to-slate-950 text-white">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold uppercase tracking-widest text-orange-400">
                      Module Preview
                    </span>
                    <span className="flex items-center gap-1 text-xs text-slate-400 bg-white/5 px-2.5 py-1 rounded-full backdrop-blur-md">
                      <Clock size={12} /> 4.5 Hours HD
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="w-12 h-12 rounded-2xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400 mb-4">
                      <PlayCircle size={28} />
                    </div>
                    <h4 className="text-xl font-bold text-white leading-snug">
                      Complete Step-by-Step {selectedDiscipline.title} Masterclass
                    </h4>
                    <p className="text-xs text-slate-400">
                      Includes PDF formula calculator, mold prep checklist & live critique pass.
                    </p>
                  </div>

                  <div className="space-y-1.5 pt-4 border-t border-white/10">
                    <div className="flex justify-between text-xs text-slate-400">
                      <span>Course Difficulty</span>
                      <span className="text-orange-400 font-semibold">Beginner to Pro</span>
                    </div>
                    <div className="flex justify-between text-xs text-slate-400">
                      <span>Certification</span>
                      <span className="text-emerald-400 font-semibold">Included</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ─── SECTION 4: THE 4-STAGE ARTIST TRANSFORMATION ROADMAP ─── */}
      <section id="roadmap" className="py-24 px-6 bg-slate-900/40 border-y border-slate-800/60 relative">
        <div className="max-w-6xl mx-auto">

          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-orange-400 text-xs font-black uppercase tracking-widest block mb-2">Clear Progression Pathway</span>
            <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
              From Zero Knowledge to a Thriving Brand
            </h2>
            <p className="text-slate-400 text-base md:text-lg">
              Our 4 structured levels ensure you never feel lost. Complete missions, earn XP, and scale your creative business.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {ROADMAP_STEPS.map((s, idx) => (
              <div
                key={s.step}
                className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 relative flex flex-col justify-between hover:border-slate-700 transition-all duration-300 hover:-translate-y-1 shadow-xl"
              >
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-4xl font-black text-slate-700">
                      {s.step}
                    </span>
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${s.badgeColor}`}>
                      {s.badge}
                    </span>
                  </div>

                  <span className="text-xs font-bold text-orange-400 uppercase tracking-wider block mb-1">
                    {s.tier}
                  </span>
                  <h3 className="text-lg font-bold text-white mb-3 leading-snug">
                    {s.title}
                  </h3>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    {s.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-medium">Stage Mission:</span>
                  <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 size={12} /> Verified XP
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Roadmap Detail Box */}
          <div className="mt-12 bg-slate-900/60 border border-slate-800 rounded-3xl p-8 max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
              <div className="space-y-1 text-center md:text-left">
                <h4 className="text-xl font-bold text-white flex items-center gap-2 justify-center md:justify-start">
                  <Flame className="text-orange-500" /> Start at Level 0 for Free Today
                </h4>
                <p className="text-slate-400 text-sm">
                  Access 4 foundational video lessons, the home safety blueprint, and submit your first coaster mission.
                </p>
              </div>
              <Link
                href="/register"
                className="px-8 py-3.5 bg-orange-500 hover:bg-orange-600 text-slate-950 font-black rounded-xl text-sm transition-all shadow-lg shadow-orange-500/25 shrink-0"
              >
                Join Free
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* ─── SECTION 5: REAL ARTIST SUCCESS STORIES ─── */}
      <section id="stories" className="py-24 px-6 relative z-10">
        <div className="max-w-6xl mx-auto">

          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-orange-400 text-xs font-black uppercase tracking-widest block mb-2">Student Testimonials</span>
            <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
              Real Creators Building Real Businesses
            </h2>
            <p className="text-slate-400 text-base md:text-lg">
              Hear directly from homemakers, corporate professionals, and design students who turned resin into an income stream.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-7 flex flex-col justify-between hover:border-slate-700 transition-all shadow-xl">
              <div>
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={15} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-slate-200 text-sm leading-relaxed mb-6 italic">
                  "I was completely intimidated by epoxy chemistry and micro-bubbles. The Level 0 formula sheets simplified everything. Within 60 days, I sold 14 geode clocks through Instagram DMs!"
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-slate-800">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-pink-500 to-rose-500 flex items-center justify-center font-black text-slate-950 text-sm">
                  P
                </div>
                <div>
                  <p className="font-bold text-white text-sm">Priya Sharma</p>
                  <p className="text-xs text-orange-400 font-semibold">Mumbai · Gold Member (₹55k Sales)</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-7 flex flex-col justify-between hover:border-slate-700 transition-all shadow-xl">
              <div>
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={15} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-slate-200 text-sm leading-relaxed mb-6 italic">
                  "The wedding preservation module alone paid for everything 10x over. I now preserve bridal jaimalas and bouquets in crystal epoxy blocks charging ₹12,000 per piece."
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-slate-800">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-500 flex items-center justify-center font-black text-slate-950 text-sm">
                  N
                </div>
                <div>
                  <p className="font-bold text-white text-sm">Neha Gupta</p>
                  <p className="text-xs text-cyan-400 font-semibold">Pune · Diamond Club (₹1.8L Sales)</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-7 flex flex-col justify-between hover:border-slate-700 transition-all shadow-xl">
              <div>
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={15} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-slate-200 text-sm leading-relaxed mb-6 italic">
                  "The Daily Missions gamification is addictive. Uploading tasks, earning XP, and getting instant mentor grading gave me the confidence to host my first offline workshop with 18 attendees!"
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-slate-800">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center font-black text-slate-950 text-sm">
                  A
                </div>
                <div>
                  <p className="font-bold text-white text-sm">Amit Patel</p>
                  <p className="text-xs text-amber-400 font-semibold">Ahmedabad · Silver Member</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─── SECTION 6: FAQS ─── */}
      <section className="py-20 px-6 bg-slate-900/30 border-t border-slate-800/60">
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
      </section>

      {/* ─── SECTION 7: FINAL CALL TO ACTION ─── */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-orange-600/10 via-amber-600/5 to-transparent" />
        <div className="max-w-4xl mx-auto text-center relative z-10">

          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-orange-500/40">
            <Palette size={32} className="text-slate-950 stroke-[2.5]" />
          </div>

          <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight leading-tight">
            Ready to Pour Your First{" "}
            <span className="shimmer-text">Masterpiece?</span>
          </h2>

          <p className="text-slate-300 text-base md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
            Join hundreds of passionate creators across India. Learn the techniques, unlock achievement badges, and launch your signature resin brand today.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/register"
              className="px-10 py-5 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 hover:opacity-95 text-slate-950 font-black rounded-2xl text-xl transition-all shadow-2xl shadow-orange-500/30 flex items-center gap-3 w-full sm:w-auto justify-center hover:scale-105"
            >
              Join Ravishing Art Hub Free <ArrowRight size={22} />
            </Link>
          </div>

          <p className="text-xs text-slate-500 mt-6 flex items-center justify-center gap-2">
            <CheckCircle2 size={14} className="text-emerald-400" /> No credit card required · Free beginner access
          </p>
        </div>
      </section>

      {/* ─── LUXURY FOOTER ─── */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="flex items-center shrink-0">
              <img
                src="/logo.png"
                alt="Ravishing Art Hub"
                className="h-12 md:h-14 w-auto object-contain"
              />
            </div>
          </div>

          <p className="text-slate-500 text-xs text-center md:text-left">
            © 2026 Ravishing Art Hub. Empowering resin artists and creative studios across India.
          </p>

          <div className="flex gap-6 text-sm text-slate-400 font-semibold">
            <Link href="/login" className="hover:text-orange-400 transition-colors">Sign In</Link>
            <Link href="/register" className="hover:text-orange-400 transition-colors">Join Academy</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
