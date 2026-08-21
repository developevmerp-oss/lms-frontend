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
    title: "Botanical Rose Petal Block",
    artist: "Sanya D.",
    type: "Floral Epoxy Preservation",
    level: "Gold Member",
    price: "₹11,000 Sold",
    gradient: "from-rose-600 via-pink-800 to-slate-900",
    accent: "text-pink-300",
    badge: "Preservation"
  }
];

const ARTWORKS_ROW_2 = [
  {
    title: "Obsidian & Gold Vein Tray",
    artist: "Vikram R.",
    type: "Marble Resin & Gold Leaf",
    level: "Gold Member",
    price: "₹9,500 Sold",
    gradient: "from-amber-700 via-neutral-900 to-stone-950",
    accent: "text-amber-300",
    badge: "Luxury Decor"
  },
  {
    title: "Deep Sea Mantarray Wall Panel",
    artist: "Ananya B.",
    type: "Multi-Layer Resin Illusion",
    level: "Diamond Club",
    price: "₹34,000 Sold",
    gradient: "from-sky-600 via-blue-900 to-indigo-950",
    accent: "text-sky-300",
    badge: "3D Illusion"
  },
  {
    title: "Turquoise Geode Coaster Set (6 pcs)",
    artist: "Rahul T.",
    type: "High-Gloss Silicone Casting",
    level: "Fast Start (L0)",
    price: "₹4,200 Sold",
    gradient: "from-teal-600 via-cyan-800 to-slate-900",
    accent: "text-teal-300",
    badge: "Beginner First Sale"
  },
  {
    title: "Aurora Borealis Resin Dome Lamp",
    artist: "Kavita J.",
    type: "Wood + Resin Turning",
    level: "Gold Member",
    price: "₹18,000 Sold",
    gradient: "from-fuchsia-600 via-purple-900 to-slate-950",
    accent: "text-fuchsia-300",
    badge: "Illumination Art"
  },
  {
    title: "Royal Ruby Inlay Mantra Frame",
    artist: "Meera P.",
    type: "Spiritual Sacred Resin",
    level: "Silver Member",
    price: "₹12,400 Sold",
    gradient: "from-red-700 via-rose-900 to-slate-950",
    accent: "text-rose-300",
    badge: "Custom Order"
  }
];

const ART_DISCIPLINES = [
  {
    id: "ocean",
    title: "Ocean Waves & Lacing",
    tag: "High Demand",
    desc: "Master cell formation, white heat-gun blowing techniques, gradient sea blues, and authentic sandy beach shorelines.",
    materials: ["Mica Powders", "White Cell Creator", "Heat Gun", "Raw Sand", "UV Stabilized Resin"],
    earnings: "₹3,500 – ₹25,000 per artwork",
    gradient: "from-cyan-500/20 via-blue-600/10 to-transparent",
    border: "border-cyan-500/30",
    accentBg: "bg-cyan-500",
    icon: Compass
  },
  {
    id: "geode",
    title: "3D Geode & Agate Art",
    tag: "Luxury Decor",
    desc: "Learn crystal inlays, crushed quartz layout, metallic lining pens, glitter veining, and organic freeform agate shaping.",
    materials: ["Natural Quartz Crystals", "Glass Shards", "Gold Leafing", "Acrylic Jewels", "Liquid Gilding"],
    earnings: "₹6,000 – ₹45,000 per artwork",
    gradient: "from-purple-500/20 via-pink-600/10 to-transparent",
    border: "border-purple-500/30",
    accentBg: "bg-purple-500",
    icon: Gem
  },
  {
    id: "clocks",
    title: "Resin Clocks & Wall Statement",
    tag: "Best Selling",
    desc: "Craft silent-sweep mechanical clocks, roman numeral resin casting, depth marble effects, and luxury mirror finishes.",
    materials: ["High-Torque Machines", "Laser-cut Roman Acrylics", "12mm MDF Bases", "Resin Dyes", "Edge Foils"],
    earnings: "₹5,000 – ₹22,000 per clock",
    gradient: "from-amber-500/20 via-orange-600/10 to-transparent",
    border: "border-amber-500/30",
    accentBg: "bg-amber-500",
    icon: Clock
  },
  {
    id: "preservation",
    title: "Floral & Memory Preservation",
    tag: "Emotional Value",
    desc: "Dry bridal bouquets without browning, bubble-free deep casting blocks, keepsake jewelry, and crystal-clear wedding frames.",
    materials: ["Silica Gel Drying Kits", "Deep Pour 3:1 Epoxy", "Pressure/Torch Technique", "Silicone Cubes"],
    earnings: "₹8,000 – ₹50,000 per wedding order",
    gradient: "from-rose-500/20 via-pink-600/10 to-transparent",
    border: "border-rose-500/30",
    accentBg: "bg-rose-500",
    icon: Heart
  }
];

const ART_JOURNEY = [
  {
    step: "01",
    level: "Fast Start (L0)",
    title: "The Workshop Apprentice",
    tagline: "Resin Chemistry, Safety & Basics",
    desc: "Understand 2:1 and 3:1 epoxy ratios, curing temperatures, safety masks, pigment blending, and make your first 5 flawless items.",
    outcomes: ["5 Completed Coaster Sets", "Zero Micro-Bubbles Mastery", "Color Harmony Certification"],
    color: "from-slate-700 to-slate-800",
    borderColor: "border-slate-700"
  },
  {
    step: "02",
    level: "Silver Member (L1)",
    title: "The Signature Artisan",
    tagline: "Complex Techniques & First Sales",
    desc: "Move into 3D Geode inlays, ocean wave lacing, clock mounting, establishing your Instagram art gallery, and packing luxury parcels.",
    outcomes: ["First Client Sale (₹5k–₹15k)", "Instagram Portfolio Launch", "Wholesale Raw Material Sourcing"],
    color: "from-blue-900/60 to-slate-900",
    borderColor: "border-blue-700/50"
  },
  {
    step: "03",
    level: "Gold Member (L2)",
    title: "The Creative Studio Owner",
    tagline: "Scaling to ₹50,000+/Month",
    desc: "Deep-pour wood river tables, bridal bouquet preservation orders, client custom commissions, and high-margin pricing formulas.",
    outcomes: ["Consistent ₹50K Monthly Orders", "Custom Wedding Preservation Orders", "Corporate Gifting Contracts"],
    color: "from-amber-900/50 to-slate-900",
    borderColor: "border-amber-500/50"
  },
  {
    step: "04",
    level: "Diamond / Masters Club (L3)",
    title: "The Master Artpreneur",
    tagline: "Exhibitions & Studio Brand",
    desc: "Build an art studio team, host offline resin workshops in your city, launch your own bespoke art collection, and scale beyond ₹1L/month.",
    outcomes: ["Offline Workshop Hosting", "Featured Art Exhibitions", "₹1,00,000+ Monthly Revenue"],
    color: "from-cyan-900/60 via-purple-950/60 to-slate-900",
    borderColor: "border-cyan-400/50"
  }
];

const FAQS = [
  {
    q: "Do I need any previous drawing, painting or art background?",
    a: "Absolutely not! Resin art is a flow-medium based on technique, ratios, color chemistry, and pouring methods rather than traditional sketch drawing. Over 85% of our successful alumni started with zero creative background."
  },
  {
    q: "How much investment do raw resin materials require to start?",
    a: "You can start creating your first practice coasters and wall items with a beginner kit of ₹2,500 – ₹3,500. We teach you exactly where to buy certified wholesale raw materials without paying retail middleman markups."
  },
  {
    q: "How quickly do students start selling their resin artworks?",
    a: "Students following our Daily Missions roadmap typically finish their first set in week 2 and land their first Instagram/Etsy client orders within 30 to 45 days."
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
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border border-white/10 group-hover:scale-105 transition-transform shadow-lg shadow-orange-500/20">
              <img
                src="/logo.jpeg"
                alt="Ravishing Art Hub"
                className="w-full"
                style={{ marginTop: '-2%', height: '110%', objectFit: 'cover', objectPosition: 'top' }}
              />
            </div>
            <div>
              <span className="font-black text-xl tracking-tight text-white flex items-center gap-2">
                Ravishing Art
              </span>
              <span className="text-[10px] tracking-widest text-orange-400 font-semibold uppercase block -mt-1">
                by Vrajangna Patel
              </span>
            </div>
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
              <p className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-300 mb-1">4.9★</p>
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
                    <p className={`text-lg font-black text-white drop-shadow-md`}>
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

                {/* Materials & Tools Provided */}
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                    <Package size={14} className="text-orange-400" /> Key Raw Materials & Formulas:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedDiscipline.materials.map((mat, i) => (
                      <span key={i} className="text-xs font-semibold bg-slate-800/90 border border-slate-700 text-slate-200 px-3 py-1.5 rounded-xl">
                        ✓ {mat}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Income Potential Tag */}
                <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <span className="text-xs text-slate-400 block">Art Market Sale Value</span>
                    <span className="text-xl font-black text-emerald-400">{selectedDiscipline.earnings}</span>
                  </div>
                  <Link
                    href="/register"
                    className="bg-orange-500 hover:bg-orange-600 text-slate-950 font-black text-sm px-6 py-3 rounded-xl transition-all shadow-lg shadow-orange-500/20 flex items-center gap-2"
                  >
                    Learn This Medium <ArrowRight size={15} />
                  </Link>
                </div>
              </div>

              {/* Visual Preview Box */}
              <div className="lg:col-span-5 bg-slate-950 border border-slate-800 rounded-2xl p-6 relative overflow-hidden shadow-2xl">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Masterclass Breakdown</span>
                  <span className="text-[11px] font-bold text-orange-400 bg-orange-500/10 px-2.5 py-1 rounded-md border border-orange-500/20">
                    Step-by-Step 4K
                  </span>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <PlayCircle size={18} className="text-orange-400 shrink-0" />
                    <div>
                      <p className="font-bold text-white text-xs">Phase 1: Chemistry, Mix Ratios & Tinting</p>
                      <p className="text-[11px] text-slate-400">Viscosity control & bubble-free degassing</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <PlayCircle size={18} className="text-cyan-400 shrink-0" />
                    <div>
                      <p className="font-bold text-white text-xs">Phase 2: The Pour, Heat & Texture Inlay</p>
                      <p className="text-[11px] text-slate-400">Blowtorch angle & cell formation techniques</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <PlayCircle size={18} className="text-emerald-400 shrink-0" />
                    <div>
                      <p className="font-bold text-white text-xs">Phase 3: Mirror Polishing & Edge Gilding</p>
                      <p className="text-[11px] text-slate-400">Sanding grits, topcoat finish & gold foil</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <PlayCircle size={18} className="text-amber-400 shrink-0" />
                    <div>
                      <p className="font-bold text-white text-xs">Phase 4: Product Photography & Selling</p>
                      <p className="text-[11px] text-slate-400">Instagram staging, client reels & packaging</p>
                    </div>
                  </div>
                </div>

                <p className="text-center text-xs text-slate-500 mt-4 italic">
                  Complete kit supply lists included in every lesson.
                </p>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ─── SECTION 4: THE 4-STAGE ARTIST TRANSFORMATION ROADMAP ─── */}
      <section id="roadmap" className="py-24 px-6 bg-slate-900/40 border-y border-slate-800/60 relative">
        <div className="max-w-6xl mx-auto">

          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-orange-400 text-xs font-black uppercase tracking-widest block mb-2">Structured Growth</span>
            <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
              Your Clear Path From Hobbyist to Studio Brand
            </h2>
            <p className="text-slate-400 text-base md:text-lg">
              Gamified with Daily Missions, XP rewards, and milestone reviews by master mentors.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {ART_JOURNEY.map((j, i) => (
              <div
                key={i}
                className={`bg-slate-900/90 border ${j.borderColor} rounded-3xl p-8 flex flex-col justify-between hover:scale-[1.01] transition-all shadow-xl group`}
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-3xl font-black text-slate-700 group-hover:text-orange-500 transition-colors font-mono">
                      {j.step}
                    </span>
                    <span className="text-xs font-bold bg-slate-800 text-orange-400 px-3.5 py-1 rounded-full border border-slate-700">
                      {j.level}
                    </span>
                  </div>

                  <h3 className="text-2xl font-black text-white mb-1">{j.title}</h3>
                  <p className="text-xs font-bold text-orange-400/90 uppercase tracking-wider mb-4">{j.tagline}</p>
                  <p className="text-slate-300 text-sm leading-relaxed mb-6">{j.desc}</p>
                </div>

                <div className="pt-4 border-t border-slate-800/80">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Key Milestones Unlocked:</p>
                  <ul className="space-y-1.5">
                    {j.outcomes.map((out, oi) => (
                      <li key={oi} className="text-xs font-semibold text-slate-200 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-400 shrink-0" />
                        {out}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* Mentorship Guarantee */}
          <div className="mt-12 bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-orange-500/10 border border-orange-500/30 rounded-3xl p-6 md:p-8 text-center max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="text-left">
              <h4 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
                <ShieldCheck className="text-orange-400" /> 1-on-1 Mentor Feedback on Every Uploaded Project
              </h4>
              <p className="text-slate-400 text-xs md:text-sm">
                Submit photos of your poured artworks on the platform and get detailed radar evaluations on resin thickness, color grading, and edge polish.
              </p>
            </div>
            <Link
              href="/register"
              className="bg-orange-500 hover:bg-orange-600 text-slate-950 font-black text-sm px-6 py-3 rounded-xl transition-all shrink-0 whitespace-nowrap"
            >
              Get Mentored
            </Link>
          </div>

        </div>
      </section>

      {/* ─── SECTION 5: REAL ARTIST SUCCESS STORIES ─── */}
      <section id="stories" className="py-24 px-6 relative z-10">
        <div className="max-w-6xl mx-auto">

          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-orange-400 text-xs font-black uppercase tracking-widest block mb-2">Real Transformations</span>
            <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
              From Kitchen Counter to Thriving Art Business
            </h2>
            <p className="text-slate-400 text-base md:text-lg">
              Hear directly from homemakers, designers, and students who turned resin art into their full-time passion.
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
                  <p className="text-xs text-orange-400">Mumbai · Gold Member (₹55k Sales)</p>
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
                  <p className="text-xs text-cyan-400">Pune · Diamond Club (₹1.8L Sales)</p>
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
                  <p className="text-xs text-amber-400">Ahmedabad · Silver Member</p>
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
            <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border border-white/10">
              <img
                src="/logo.jpeg"
                alt="Ravishing Art Hub"
                className="w-full"
                style={{ marginTop: '-2%', height: '110%', objectFit: 'cover', objectPosition: 'top' }}
              />
            </div>
            <div>
              <span className="font-black text-lg text-white tracking-tight block">
                Ravishing Art
              </span>
              <span className="text-[10px] tracking-widest text-orange-400 font-semibold uppercase">
                by Vrajangna Patel
              </span>
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
