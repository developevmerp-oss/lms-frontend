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
  Quote,
  Sun,
  Moon
} from "lucide-react";

// ─── EXACT REFERENCE DATA IN 100% CANONICAL SEQUENCE FROM SOURCE BUNDLE ───

const STAT_COUNTERS = [
  { value: "10+ Years", label: "Experience in coaching" },
  { value: "54,000+", label: "Webinar attendees" },
  { value: "2022", label: "Hall of Fame Award" },
  { value: "90 min", label: "Live masterclass" }
];

// SECTION 1: SOUND FAMILIAR? (W -> e2)
const SOUND_FAMILIAR = {
  eyebrow: "SOUND FAMILIAR?",
  heading: "If any of this is true right now, this Masterclass is for you",
  subheading: "Most talented artists aren't stuck because they lack ability. They're stuck because nothing is joined up.",
  items: [
    "You jump between random tutorials and still don't know what to learn next.",
    "You know some resin art, but you lack confidence and a signature style.",
    "You struggle to get consistent orders or customers.",
    "You don't know how to price, brand or market your work.",
    "You want to start but feel overwhelmed and don't know where to begin.",
    "You're doing it all alone, with no community or feedback."
  ],
  turn: "None of that means you're behind. It usually means you're missing one structure — Mastery, Mindset and Monetization together. That's exactly what we cover."
};

// SECTION 2: MY PHILOSOPHY (H -> n2)
const PHILOSOPHY = {
  eyebrow: "MY PHILOSOPHY",
  heading: "Mastery → Mindset → Monetization",
  subheading: "Three steps, in this order. Skip one and the whole journey stalls.",
  steps: [
    {
      label: "STEP 1",
      title: "Master",
      body: "Build premium skills in the right sequence so you know what to learn, practice and create next."
    },
    {
      label: "STEP 2",
      title: "Mindset",
      body: "Build the confidence to create, share, receive feedback and believe your work deserves to be seen."
    },
    {
      label: "STEP 3",
      title: "Monetization",
      body: "Learn how to connect your skills with pricing, branding, marketing and a business model."
    }
  ],
  closing: "Because skill without confidence stays hidden. Confidence without a business roadmap stays stuck. And business without mastery becomes difficult to sustain."
};

// SECTION 3: ON THE MASTERCLASS: THREE SECRETS (q -> t2)
const THREE_SECRETS = {
  eyebrow: "ON THE MASTERCLASS",
  heading: "The three secrets we'll unpack together",
  subheading: "Each one breaks a belief that keeps talented resin artists stuck — and replaces it with something that actually works.",
  items: [
    {
      label: "SECRET #1 — MASTERY",
      title: "Learn the right techniques in the right sequence",
      myth: "Most people believe more tutorials will eventually add up.",
      truth: "You'll see why random tutorials create confusion, and how structured learning accelerates progress — technique sequencing, premium skill development, a portfolio-building mindset and moving beyond random projects."
    },
    {
      label: "SECRET #2 — MINDSET",
      title: "Become confident enough to own your creativity",
      myth: "Most people believe their work isn't good enough to be seen yet.",
      truth: "You'll learn how to move past fear of creating, comparison, the \"my work isn't good enough\" loop, fear of showing your work, and confusion about your artistic identity."
    },
    {
      label: "SECRET #3 — MONETIZATION",
      title: "Turn your art into a real opportunity",
      myth: "Most people believe business skills come much later.",
      truth: "You'll understand the foundations of product selection, pricing, branding, marketing, customer attraction, community support and a practical business roadmap."
    }
  ]
};

// SECTION 4: LIVE SEATS ARE LIMITED (ve -> o2)
const LIVE_SEATS_BANNER = {
  heading: "Live seats are limited",
  body: "Registration closes when the live-seat capacity is reached.",
  cta: "Yes — show me the 3 secrets"
};

// SECTION 5: THE SHIFT (L -> i2)
const THE_SHIFT = {
  eyebrow: "THE SHIFT",
  heading: "Stop learning resin the hard way",
  subheading: "Same passion, completely different result.",
  beforeHeading: "OLD WAY",
  afterHeading: "NEW WAY",
  pairs: [
    { before: "Jumping between random tutorials", after: "Follow a structured learning sequence" },
    { before: "Copying what others create", after: "Develop your own signature style" },
    { before: "Doubting whether your work is good enough", after: "Build confidence through guided mastery" },
    { before: "Making products without knowing demand", after: "Understand what can actually sell" },
    { before: "Guessing your prices", after: "Learn the foundations of profitable pricing" },
    { before: "Posting randomly", after: "Build a recognizable artist identity" },
    { before: "Waiting for orders", after: "Learn how marketing and positioning create opportunities" },
    { before: "Trying to do everything alone", after: "Grow with community and support" }
  ]
};

// SECTION 6: WHAT CHANGES (X -> l2)
const WHAT_CHANGES = {
  eyebrow: "WHAT CHANGES",
  heading: "Imagine what changes when you put these three secrets together",
  subheading: "This is what women tell me shifts first once mastery, mindset and monetization finally line up.",
  items: [
    {
      title: "Clarity",
      body: "Know what to learn and what to do next, instead of collecting tutorials you never finish."
    },
    {
      title: "Confidence",
      body: "Create and share your work without constantly questioning whether it's good enough."
    },
    {
      title: "Signature identity",
      body: "Begin developing a recognizable portfolio and a clear artistic direction of your own."
    },
    {
      title: "Business direction",
      body: "Know how your creativity can connect to real customers and real revenue."
    },
    {
      title: "Premium positioning",
      body: 'Move from "I make resin products" toward "I have a distinctive creative brand".'
    },
    {
      title: "Financial possibility",
      body: "Build toward a ₹3 lakh/month business goal and, over time, aim beyond it. A roadmap ambition — not a guaranteed income claim."
    }
  ]
};

// SECTION 7: RIGHT FIT? (ee -> s2)
const RIGHT_FIT = {
  eyebrow: "RIGHT FIT?",
  heading: "This Masterclass is for you if…",
  subheading: "Six women walk into this session. You'll recognise yourself in one of them.",
  items: [
    {
      title: "The Passionate Beginner",
      body: "You have always wanted to create beautiful resin art but need a structured path."
    },
    {
      title: "The Aspiring Artist",
      body: "You want to move beyond hobby-level work and develop premium skills."
    },
    {
      title: "The Homemaker Ready for Her Own Identity",
      body: "You want something that belongs to you — creatively and financially."
    },
    {
      title: "The Working Professional",
      body: "You want to build a creative income stream alongside your existing work."
    },
    {
      title: "The Existing Resin Artist",
      body: "You know the basics but want better skills, stronger positioning and more consistent opportunities."
    },
    {
      title: "The Creative Entrepreneur",
      body: "You want to turn your creative expertise into a structured business."
    }
  ]
};

// SECTION 8: PROOF (te -> r2)
const PROOF = {
  eyebrow: "PROOF",
  heading: "You're learning from someone who has been in the arena",
  body: "My journey has been about more than learning resin techniques. It's been about understanding how creativity can become confidence, identity, community and income — and helping other women make that journey with greater clarity.",
  items: [
    { value: "10+ Years", label: "Experience in coaching" },
    { value: "54,000+", label: "People have attended my webinars" },
    { value: "2022", label: "Hall of Fame Award from mentor Siddharth Rajsekar" },
    { value: "International Best Seller", label: "Featured as part of I Can Coach" },
    { value: "Featured", label: "Sylph Magazine and other art publications" }
  ]
};

// SECTION 9: FREE BONUS: CLARITY KIT (B -> u2)
const CLARITY_KIT = {
  eyebrow: "FREE BONUS",
  heading: "Register free & get the Resin Artist Clarity Kit",
  subheading: "Come to the Masterclass ready to turn inspiration into action.",
  items: [
    {
      title: "Your Resin Success Roadmap",
      body: "A one-page visual roadmap showing the major stages of your resin journey."
    },
    {
      title: "90-Day Goal Planner",
      body: "Turn your creative intention into a focused 90-day action plan."
    },
    {
      title: "Top 25 Resin Products That Sell",
      body: "A practical idea bank to help you think beyond random creations."
    },
    {
      title: "Resin Business Readiness Checklist",
      body: "Identify what you already have — and what still needs to be built."
    },
    {
      title: "Artist Identity Discovery Worksheet",
      body: "Discover what makes your creative identity different."
    },
    {
      title: "Resin Artist Archetypes",
      body: "Understand the type of resin artist you are becoming and how that shapes your direction."
    }
  ],
  cta: "Yes, I want the free Clarity Kit"
};

// SECTION 10: VALUE STACK (Ks -> E)
const VALUE_STACK = {
  eyebrow: "VALUE STACK",
  heading: "Everything you need to start seeing your resin journey differently",
  items: [
    {
      title: "Resin Mastery Masterclass (live, 90 minutes)",
      value: "₹9,900",
      body: "Mastery, mindset and monetization — plus live Q&A with Vrajangna."
    },
    {
      title: "Resin Artist Clarity Kit",
      value: "Free bonus",
      body: "Six practical resources to help you act on what you learn."
    },
    {
      title: "Roadmap, planner, product list & worksheets",
      value: "Included",
      body: "Success Roadmap, 90-Day Planner, Top 25 Products That Sell, Readiness Checklist, Identity Worksheet and Artist Archetypes."
    }
  ],
  totalLabel: "Total value",
  totalValue: "₹9,900 + bonuses",
  priceLabel: "Your investment today",
  priceValue: "₹0 — Free"
};

// SECTION 11: HONEST FIT CHECK (D -> a2)
const HONEST_FIT_CHECK = {
  eyebrow: "HONEST FIT CHECK",
  heading: "Who should attend — and who should skip it",
  subheading: "Being explicit about fit raises show-up rate. I'd rather you spend 90 minutes well than spend them at all.",
  forHeading: "You SHOULD attend if…",
  notForHeading: "This is NOT for you if…",
  forItems: [
    "You want to seriously explore monetizing your creative skill.",
    "You are willing to learn rather than only collect tutorials.",
    "You want to build confidence and a unique identity.",
    "You want a structured resin learning roadmap.",
    "You want to understand how art can become a business.",
    "You are willing to take action after the Masterclass."
  ],
  notForItems: [
    "You only want free tutorials with no intention of applying them.",
    "You are looking for instant or guaranteed income.",
    "You do not want to practice or improve your skills.",
    "You expect someone else to build the business for you.",
    "You are not interested in turning creativity into a serious opportunity."
  ]
};

// SECTION 12: AGENDA (se -> c2)
const AGENDA = {
  eyebrow: "AGENDA",
  heading: "How the 90 minutes run",
  subheading: "A simple timeline so you know exactly what you're committing to.",
  items: [
    {
      time: "00:00",
      title: "Welcome and framing",
      body: "Why talented resin artists stay stuck, and what this session will change."
    },
    {
      time: "00:15",
      title: "Secret 1 — Mastery",
      body: "Technique sequencing and premium skill development, in the right order."
    },
    {
      time: "00:40",
      title: "Secret 2 — Mindset",
      body: "Confidence, comparison and building an artistic identity you own."
    },
    {
      time: "01:00",
      title: "Secret 3 — Monetization",
      body: "Products, pricing, branding and the business roadmap."
    },
    {
      time: "01:15",
      title: "Live Q&A",
      body: "Open floor — bring your questions about skills, pricing or getting started."
    }
  ]
};

// SECTION 13: YOUR MENTOR (A -> h2)
const MENTOR_SECTION = {
  eyebrow: "YOUR MENTOR",
  name: "Vrajangna Patel",
  role: "Resin Art Business Coach • Founder, Ravishing Art Hub",
  bio: [
    "Vrajangna Patel is a Resin Art Business Coach, mentor, entrepreneur and the founder of Ravishing Art Hub.",
    "With 10+ years of coaching experience, she has helped build a community around resin art, creativity, confidence and entrepreneurship. Her work goes beyond teaching techniques — she helps women connect their creative abilities with identity, purpose and financial opportunity.",
    "She has served a community of 54,000+ webinar attendees, received the Hall of Fame Award from her mentor Siddharth Rajsekar in 2022, contributed to the international bestseller I Can Coach, and has been featured in Sylph Magazine and other art publications."
  ],
  quote: "I believe a creative skill can become more than a hobby. It can become an identity, a purpose and a path toward financial freedom.",
  credentials: [
    "10+ years coaching",
    "54,000+ webinar attendees",
    "Hall of Fame Award, 2022",
    "Co-author, I Can Coach",
    "Featured in Sylph Magazine"
  ]
};

// SECTION 14: COMMUNITY (ae -> d2)
const COMMUNITY_SECTION = {
  eyebrow: "COMMUNITY",
  heading: "Women like you are turning creativity into confidence",
  subheading: "Stories and transformations from the Ravishing Art Hub sisterhood.",
  items: [
    {
      quote: "The masterclass completely changed how I look at resin art. I stopped ruining expensive pours and gained the confidence to start taking custom client orders!",
      name: "Pooja Sharma",
      role: "Mumbai"
    },
    {
      quote: "Vrajangna ma'am's chemistry breakdown was an eye-opener. The wave lacing and ratio formulas worked on my very first try.",
      name: "Ananya Roy",
      role: "Kolkata"
    },
    {
      quote: "I was struggling with pricing for months. Using the monetization roadmap, I closed two corporate gift orders within 3 weeks of attending.",
      name: "Shweta Verma",
      role: "Delhi"
    },
    {
      quote: "As a homemaker, this gave me my own creative identity and financial independence. The step-by-step guidance is priceless.",
      name: "Neha Patel",
      role: "Ahmedabad"
    }
  ]
};

// SECTION 15: FREQUENTLY ASKED QUESTIONS (Ne -> f2)
const EXACT_FAQS = [
  {
    q: "Is the Masterclass really free?",
    a: "Yes. Registration for the Resin Mastery Masterclass is free. No credit card, no catch."
  },
  {
    q: "Do I need prior resin art experience?",
    a: "No. The session is designed to give aspiring and developing resin artists a structured perspective. Different experience levels can take different actions from the session."
  },
  {
    q: "What if I am a complete beginner?",
    a: "You can attend. The Masterclass is designed to help you understand what to learn and how to approach resin art systematically."
  },
  {
    q: "What if I already know resin art?",
    a: "You can still benefit if your challenge is confidence, portfolio, positioning, pricing, marketing or monetization."
  },
  {
    q: "Do I need expensive equipment?",
    a: "No. You do not need to make a large investment simply to attend the Masterclass."
  },
  {
    q: "Do I need to quit my job?",
    a: "Absolutely not. Your creative journey can begin alongside your current responsibilities."
  },
  {
    q: "Can homemakers attend?",
    a: "Yes. The programme is specifically designed to help ambitious women explore creative identity and financial opportunity."
  },
  {
    q: "Will you teach resin techniques?",
    a: "The Masterclass teaches the framework and selected insights around resin mastery. It is designed to help you understand the right learning path rather than replace every detailed practical training."
  },
  {
    q: "Will you teach how to make money from resin?",
    a: "Yes. Monetization is one of the three core secrets, including foundations such as pricing, branding and marketing."
  },
  {
    q: "Can you guarantee ₹3 lakh/month?",
    a: "No. ₹3 lakh/month is a target and business roadmap goal, not a guaranteed outcome. Results depend on skill, implementation, market, positioning, consistency and many other factors."
  },
  {
    q: "Can I really scale to ₹1 crore+?",
    a: "The ₹1 crore+ figure represents a long-term business ambition, not a guaranteed income promise. The Masterclass focuses on building the foundations that can support larger business goals."
  },
  {
    q: "What will I receive after registering?",
    a: "You will receive confirmation details by email, webinar reminders, the Zoom joining link and instructions to access the WhatsApp group and resources."
  },
  {
    q: "Why should I join the WhatsApp group?",
    a: "The group helps you receive reminders, resources, important announcements and pre-webinar support."
  },
  {
    q: "How long is the webinar?",
    a: "The live Masterclass is 90 minutes, including live Q&A."
  },
  {
    q: "What language is the webinar in?",
    a: "Hindi + English mixed."
  },
  {
    q: "What if I miss the live webinar?",
    a: "Because this is an interactive live training with live Q&A, you should attend live. A limited-time replay access may be provided to registered attendees."
  },
  {
    q: "Is there a sales pitch?",
    a: "The session is a complete training in its own right. If a paid programme is introduced at the end, it will be presented clearly and there is no obligation to take it."
  },
  {
    q: "Is my information safe?",
    a: "Your contact information is used for registration, webinar communications and relevant updates, in accordance with our Privacy Policy."
  }
];

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

  // Fetch dynamic scarcity stats from database
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

  // Sticky bottom trigger
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
      setError("Please enter your name, email address, and WhatsApp number.");
      return;
    }

    if (!form.consent) {
      setError("Please accept the consent checkbox to continue.");
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
      const el = document.getElementById("sound-familiar");
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
              <strong>🔥 LIVE MASTERCLASS — LIMITED SEATS.</strong> Registration closes when live-seat capacity is reached.
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
            
            {/* Left Column: Exact Headline, Details & CTAs */}
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
                  <p className="text-xs text-orange-400 font-semibold">54,000+ webinar attendees</p>
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

            {/* Right Column: Exact Registration Card */}
            <div id="register" className="scroll-mt-24">
              <div className="rounded-3xl border-2 border-orange-500/40 bg-slate-900/90 backdrop-blur-xl p-6 sm:p-8 shadow-2xl shadow-black/80">
                <h2 className="text-2xl font-black text-white">Reserve your free seat</h2>
                <p className="mt-1 mb-6 text-xs sm:text-sm text-slate-400">
                  Where should we send your Masterclass details?
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
                      Full name
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
                      Email address
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
                      WhatsApp number
                    </label>
                    <input
                      type="tel"
                      className="flex h-11 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/40 transition-all"
                      id="lead-phone"
                      placeholder="+91 98765 43210"
                      autoComplete="tel"
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
                      rows={3}
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
                    className="inline-flex items-center justify-center gap-2 text-sm font-black transition-all bg-gradient-to-r from-orange-500 via-amber-400 to-orange-500 hover:opacity-95 text-slate-950 shadow-xl shadow-orange-500/30 h-11 rounded-xl px-8 w-full cursor-pointer hover:scale-[1.02] disabled:opacity-60"
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
              <p className="text-xs uppercase tracking-widest text-slate-400 font-black mb-4">Recognised for</p>
              <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-sm md:text-base font-bold text-slate-300">
                <li className="flex items-center gap-2">Hall of Fame Award 2022</li>
                <li className="flex items-center gap-2">I Can Coach — International Best Seller</li>
                <li className="flex items-center gap-2">Sylph Magazine</li>
                <li className="flex items-center gap-2">54,000+ webinar attendees</li>
                <li className="flex items-center gap-2">10+ years coaching</li>
              </ul>
            </div>
          </div>
        </section>

        {/* ─── 5. FOUR BIG STAT COUNTERS ─── */}
        <section className="py-16 px-5 border-b border-slate-800/80 bg-slate-950">
          <div className="mx-auto max-w-6xl">
            <dl className="grid grid-cols-2 gap-8 sm:grid-cols-4 text-center">
              {STAT_COUNTERS.map((stat, idx) => (
                <div key={idx} className="p-4">
                  <dt className="text-3xl sm:text-4xl font-bold text-white">{stat.value}</dt>
                  <dd className="mt-1 text-sm text-slate-400">{stat.label}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* ─── 6. THE INTERACTIVE GATE SECTION ─── */}
        <section id="gate" className="bg-slate-900/40 border-b border-slate-800/80 py-20 px-5 relative z-10">
          <div className="mx-auto max-w-6xl">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold sm:text-4xl text-white">
                Want to know what makes this Masterclass different?
              </h2>
              <p className="mt-3 text-slate-400 text-base leading-relaxed">
                I've designed this session around the three things most aspiring resin artists need — mastery, mindset and monetization.
              </p>
              <button
                onClick={() => setIsUnlocked(!isUnlocked)}
                className="inline-flex items-center justify-center gap-2 text-sm font-medium transition-all bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 shadow-xl shadow-orange-500/20 h-10 rounded-md px-8 mt-8 cursor-pointer hover:scale-105"
              >
                {isUnlocked ? "Hide what you'll learn" : "Show me what I'll learn"}
                {isUnlocked ? <ChevronUp className="ml-1.5 size-4" /> : <ChevronDown className="ml-1.5 size-4" />}
              </button>
            </div>
          </div>
        </section>

        {/* ─── 7. UNLOCKED EXACT CURRICULUM SECTIONS (100% MATCHING REFERENCE SEQUENCE) ─── */}
        {isUnlocked && (
          <div id="gate-content" className="animate-in fade-in slide-in-from-top-4 duration-500 space-y-0">
            
            {/* 1. SOUND FAMILIAR? (W -> e2) */}
            <section id="sound-familiar" className="py-20 px-5 border-b border-slate-800/80 bg-slate-950">
              <div className="mx-auto max-w-5xl">
                <div className="text-center max-w-3xl mx-auto mb-12">
                  <span className="inline-flex items-center rounded-full border border-slate-800 bg-slate-900 px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-slate-300 mb-4">
                    {SOUND_FAMILIAR.eyebrow}
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight">
                    {SOUND_FAMILIAR.heading}
                  </h2>
                  <p className="text-slate-400 text-base leading-relaxed">
                    {SOUND_FAMILIAR.subheading}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  {SOUND_FAMILIAR.items.map((item, idx) => (
                    <div key={idx} className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex items-center gap-3">
                      <span className="text-slate-400 text-sm font-bold">✕</span>
                      <p className="text-sm text-slate-300">{item}</p>
                    </div>
                  ))}
                </div>

                <div className="text-center max-w-3xl mx-auto pt-4">
                  <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
                    {SOUND_FAMILIAR.turn}
                  </p>
                </div>
              </div>
            </section>

            {/* 2. MY PHILOSOPHY (H -> n2) */}
            <section className="py-20 px-5 bg-slate-900/40 border-b border-slate-800/80">
              <div className="mx-auto max-w-5xl">
                <div className="text-center max-w-3xl mx-auto mb-14">
                  <span className="inline-flex items-center rounded-full border border-slate-800 bg-slate-900 px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-slate-300 mb-4">
                    {PHILOSOPHY.eyebrow}
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                    {PHILOSOPHY.heading}
                  </h2>
                  <p className="text-slate-400 text-base">
                    {PHILOSOPHY.subheading}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                  {PHILOSOPHY.steps.map((step, idx) => (
                    <div key={idx} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-3">
                        {step.label}
                      </span>
                      <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                      <p className="text-sm text-slate-400 leading-relaxed">{step.body}</p>
                    </div>
                  ))}
                </div>

                <p className="text-center text-slate-400 text-sm max-w-2xl mx-auto leading-relaxed">
                  {PHILOSOPHY.closing}
                </p>
              </div>
            </section>

            {/* 3. ON THE MASTERCLASS: THE THREE SECRETS (q -> t2) */}
            <section className="py-20 px-5 border-b border-slate-800/80 bg-slate-950">
              <div className="mx-auto max-w-6xl">
                <div className="text-center max-w-3xl mx-auto mb-16">
                  <span className="inline-flex items-center rounded-full border border-slate-800 bg-slate-900 px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-slate-300 mb-4">
                    {THREE_SECRETS.eyebrow}
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                    {THREE_SECRETS.heading}
                  </h2>
                  <p className="text-slate-400 text-base">
                    {THREE_SECRETS.subheading}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                  {THREE_SECRETS.items.map((secret, idx) => (
                    <div key={idx} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between shadow-sm">
                      <div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-3">
                          {secret.label}
                        </span>
                        <h3 className="text-lg font-bold text-white mb-4 leading-snug">
                          {secret.title}
                        </h3>
                        
                        <p className="text-xs text-slate-400 italic mb-4 leading-relaxed">
                          {secret.myth}
                        </p>

                        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                          {secret.truth}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* 4. LIVE SEATS ARE LIMITED BANNER (ve -> o2) */}
                <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                  <div>
                    <h3 className="text-lg font-bold text-white">{LIVE_SEATS_BANNER.heading}</h3>
                    <p className="text-sm text-slate-400 mt-1">{LIVE_SEATS_BANNER.body}</p>
                  </div>
                  <button
                    onClick={scrollToRegister}
                    className="inline-flex items-center justify-center gap-2 bg-slate-950 border border-slate-700 hover:border-orange-500 text-white font-medium text-xs sm:text-sm h-10 rounded-lg px-6 transition-all hover:scale-105 cursor-pointer shrink-0"
                  >
                    {LIVE_SEATS_BANNER.cta}
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </section>

            {/* 5. THE SHIFT (L -> i2) */}
            <section className="py-20 px-5 bg-slate-900/40 border-b border-slate-800/80">
              <div className="mx-auto max-w-5xl">
                <div className="text-center max-w-3xl mx-auto mb-14">
                  <span className="inline-flex items-center rounded-full border border-slate-800 bg-slate-900 px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-slate-300 mb-4">
                    {THE_SHIFT.eyebrow}
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                    {THE_SHIFT.heading}
                  </h2>
                  <p className="text-slate-400 text-base">
                    {THE_SHIFT.subheading}
                  </p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm border-collapse rounded-2xl overflow-hidden border border-slate-800">
                    <thead>
                      <tr className="border-b border-slate-800 bg-slate-900">
                        <th className="p-4 font-bold text-slate-400 uppercase text-xs tracking-wider">{THE_SHIFT.beforeHeading}</th>
                        <th className="p-4 font-bold text-slate-200 uppercase text-xs tracking-wider">{THE_SHIFT.afterHeading}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80 bg-slate-900/60">
                      {THE_SHIFT.pairs.map((pair, idx) => (
                        <tr key={idx}>
                          <td className="p-4 text-slate-400">
                            {pair.before}
                          </td>
                          <td className="p-4 text-slate-200 font-medium">
                            {pair.after}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* 6. WHAT CHANGES (X -> l2) */}
            <section className="py-20 px-5 border-b border-slate-800/80 bg-slate-950">
              <div className="mx-auto max-w-6xl">
                <div className="text-center max-w-3xl mx-auto mb-14">
                  <span className="inline-flex items-center rounded-full border border-slate-800 bg-slate-900 px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-slate-300 mb-4">
                    {WHAT_CHANGES.eyebrow}
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                    {WHAT_CHANGES.heading}
                  </h2>
                  <p className="text-slate-400 text-sm sm:text-base">
                    {WHAT_CHANGES.subheading}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {WHAT_CHANGES.items.map((item, idx) => (
                    <div key={idx} className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                      <h3 className="text-base font-bold text-white mb-2">{item.title}</h3>
                      <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{item.body}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* 7. RIGHT FIT? (ee -> s2) */}
            <section className="py-20 px-5 bg-slate-900/40 border-b border-slate-800/80">
              <div className="mx-auto max-w-6xl">
                <div className="text-center max-w-3xl mx-auto mb-14">
                  <span className="inline-flex items-center rounded-full border border-slate-800 bg-slate-900 px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-slate-300 mb-4">
                    {RIGHT_FIT.eyebrow}
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                    {RIGHT_FIT.heading}
                  </h2>
                  <p className="text-slate-400 text-base">
                    {RIGHT_FIT.subheading}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {RIGHT_FIT.items.map((item, idx) => (
                    <div key={idx} className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                      <h3 className="text-base font-bold text-white mb-2">{item.title}</h3>
                      <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{item.body}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* 8. PROOF (te -> r2) */}
            <section className="py-20 px-5 border-b border-slate-800/80 bg-slate-950">
              <div className="mx-auto max-w-5xl">
                <div className="text-center max-w-3xl mx-auto mb-12">
                  <span className="inline-flex items-center rounded-full border border-slate-800 bg-slate-900 px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-slate-300 mb-4">
                    {PROOF.eyebrow}
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                    {PROOF.heading}
                  </h2>
                  <p className="text-slate-300 text-base leading-relaxed max-w-2xl mx-auto">
                    {PROOF.body}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {PROOF.items.map((item, idx) => (
                    <div key={idx} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-center">
                      <p className="text-2xl font-bold text-white mb-1">{item.value}</p>
                      <p className="text-xs text-slate-400 font-medium">{item.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* 9. FREE BONUS: CLARITY KIT (B -> u2) */}
            <section className="py-20 px-5 bg-slate-900/40 border-b border-slate-800/80">
              <div className="mx-auto max-w-6xl">
                <div className="text-center max-w-3xl mx-auto mb-14">
                  <span className="inline-flex items-center rounded-full border border-slate-800 bg-slate-900 px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-slate-300 mb-4">
                    {CLARITY_KIT.eyebrow}
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                    {CLARITY_KIT.heading}
                  </h2>
                  <p className="text-slate-400 text-base">
                    {CLARITY_KIT.subheading}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                  {CLARITY_KIT.items.map((item, idx) => (
                    <div key={idx} className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                      <h3 className="text-base font-bold text-white mb-2">{item.title}</h3>
                      <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{item.body}</p>
                    </div>
                  ))}
                </div>

                <div className="text-center">
                  <button
                    onClick={scrollToRegister}
                    className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-bold h-10 rounded-md px-6 text-sm hover:scale-105 transition-transform cursor-pointer"
                  >
                    {CLARITY_KIT.cta}
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </section>

            {/* 10. VALUE STACK (Ks -> E) */}
            <section className="py-20 px-5 border-b border-slate-800/80 bg-slate-950">
              <div className="mx-auto max-w-4xl">
                <div className="text-center max-w-2xl mx-auto mb-12">
                  <span className="inline-flex items-center rounded-full border border-slate-800 bg-slate-900 px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-slate-300 mb-4">
                    {VALUE_STACK.eyebrow}
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                    {VALUE_STACK.heading}
                  </h2>
                </div>

                <div className="space-y-4 mb-8">
                  {VALUE_STACK.items.map((item, idx) => (
                    <div key={idx} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h3 className="text-base font-bold text-white">{item.title}</h3>
                        <p className="text-xs sm:text-sm text-slate-400 mt-1">{item.body}</p>
                      </div>
                      <span className="text-sm font-bold text-orange-400 shrink-0 bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-lg text-center">
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
                  <div>
                    <p className="text-xs text-slate-400 uppercase tracking-widest">{VALUE_STACK.totalLabel}</p>
                    <p className="text-lg font-bold text-slate-400 line-through">{VALUE_STACK.totalValue}</p>
                  </div>
                  <div>
                    <p className="text-xs text-orange-400 uppercase tracking-widest font-bold">{VALUE_STACK.priceLabel}</p>
                    <p className="text-2xl font-black text-emerald-400">{VALUE_STACK.priceValue}</p>
                  </div>
                  <button
                    onClick={scrollToRegister}
                    className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-bold h-10 rounded-md px-6 text-sm hover:scale-105 transition-transform cursor-pointer"
                  >
                    Reserve my free seat
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </section>

            {/* 11. HONEST FIT CHECK (D -> a2) */}
            <section className="py-20 px-5 bg-slate-900/40 border-b border-slate-800/80">
              <div className="mx-auto max-w-5xl">
                <div className="text-center max-w-3xl mx-auto mb-14">
                  <span className="inline-flex items-center rounded-full border border-slate-800 bg-slate-900 px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-slate-300 mb-4">
                    {HONEST_FIT_CHECK.eyebrow}
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                    {HONEST_FIT_CHECK.heading}
                  </h2>
                  <p className="text-slate-400 text-sm sm:text-base">
                    {HONEST_FIT_CHECK.subheading}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-7">
                    <h3 className="text-base font-bold text-white mb-4">
                      {HONEST_FIT_CHECK.forHeading}
                    </h3>
                    <ul className="space-y-3 text-xs sm:text-sm text-slate-300">
                      {HONEST_FIT_CHECK.forItems.map((it, idx) => (
                        <li key={idx} className="flex items-start gap-2.5">
                          <Check size={16} className="text-emerald-400 mt-0.5 shrink-0" />
                          <span>{it}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-7">
                    <h3 className="text-base font-bold text-white mb-4">
                      {HONEST_FIT_CHECK.notForHeading}
                    </h3>
                    <ul className="space-y-3 text-xs sm:text-sm text-slate-300">
                      {HONEST_FIT_CHECK.notForItems.map((it, idx) => (
                        <li key={idx} className="flex items-start gap-2.5">
                          <X size={16} className="text-red-400 mt-0.5 shrink-0" />
                          <span>{it}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* 12. AGENDA (se -> c2) */}
            <section className="py-20 px-5 border-b border-slate-800/80 bg-slate-950">
              <div className="mx-auto max-w-5xl">
                <div className="text-center max-w-3xl mx-auto mb-14">
                  <span className="inline-flex items-center rounded-full border border-slate-800 bg-slate-900 px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-slate-300 mb-4">
                    {AGENDA.eyebrow}
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                    {AGENDA.heading}
                  </h2>
                  <p className="text-slate-400 text-base">
                    {AGENDA.subheading}
                  </p>
                </div>

                <div className="space-y-4 max-w-3xl mx-auto">
                  {AGENDA.items.map((item, idx) => (
                    <div key={idx} className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                      <span className="text-slate-400 font-mono text-xs font-bold shrink-0">
                        {item.time}
                      </span>
                      <div>
                        <h3 className="font-bold text-white text-sm">{item.title}</h3>
                        <p className="text-xs text-slate-400 mt-0.5">{item.body}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* 13. YOUR MENTOR (A -> h2) */}
            <section className="py-20 px-5 bg-slate-900/40 border-b border-slate-800/80">
              <div className="mx-auto max-w-5xl">
                <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-8 md:p-12 shadow-sm">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                    <div className="lg:col-span-4 text-center">
                      <div className="w-48 h-48 mx-auto rounded-2xl overflow-hidden border border-slate-800 mb-4">
                        <img
                          src="/images/mentor/vrajangna-portrait.jpg"
                          alt="Vrajangna Patel"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h3 className="text-lg font-bold text-white">{MENTOR_SECTION.name}</h3>
                      <p className="text-xs text-slate-400 mt-1">{MENTOR_SECTION.role}</p>
                    </div>

                    <div className="lg:col-span-8 space-y-4">
                      <span className="inline-flex items-center rounded-full border border-slate-800 bg-slate-950 px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-slate-300">
                        {MENTOR_SECTION.eyebrow}
                      </span>
                      <h2 className="text-2xl sm:text-3xl font-bold text-white">Meet {MENTOR_SECTION.name}</h2>
                      <p className="text-xs text-slate-400">{MENTOR_SECTION.role}</p>
                      {MENTOR_SECTION.bio.map((p, idx) => (
                        <p key={idx} className="text-sm text-slate-300 leading-relaxed">{p}</p>
                      ))}
                      <blockquote className="border-l-2 border-slate-700 pl-3 text-sm italic text-slate-300">
                        "{MENTOR_SECTION.quote}"
                      </blockquote>
                      <div className="flex flex-wrap gap-2 pt-2">
                        {MENTOR_SECTION.credentials.map((c, idx) => (
                          <span key={idx} className="bg-slate-950 border border-slate-800 text-slate-300 text-xs px-3 py-1 rounded-full">
                            ✓ {c}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* 14. COMMUNITY / TESTIMONIALS (ae -> d2) */}
            <section className="py-20 px-5 border-b border-slate-800/80 bg-slate-950">
              <div className="mx-auto max-w-6xl">
                <div className="text-center max-w-3xl mx-auto mb-14">
                  <span className="inline-flex items-center rounded-full border border-slate-800 bg-slate-900 px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-slate-300 mb-4">
                    {COMMUNITY_SECTION.eyebrow}
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                    {COMMUNITY_SECTION.heading}
                  </h2>
                  <p className="text-slate-400 text-base">
                    {COMMUNITY_SECTION.subheading}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {COMMUNITY_SECTION.items.map((item, idx) => (
                    <div key={idx} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
                      <div>
                        <Quote size={20} className="text-orange-400 mb-3" />
                        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic mb-4">
                          "{item.quote}"
                        </p>
                      </div>
                      <div className="border-t border-slate-800 pt-3">
                        <p className="text-sm font-bold text-white">{item.name}</p>
                        <p className="text-xs text-slate-400">{item.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* 15. FREQUENTLY ASKED QUESTIONS (Ne -> f2) */}
            <section className="py-20 px-5 bg-slate-900/40 border-b border-slate-800/80">
              <div className="mx-auto max-w-4xl">
                <div className="text-center max-w-2xl mx-auto mb-12">
                  <span className="inline-flex items-center rounded-full border border-slate-800 bg-slate-900 px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-slate-300 mb-4">
                    QUESTIONS
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-bold text-white">Frequently asked</h2>
                </div>

                <div className="space-y-3">
                  {EXACT_FAQS.map((faq, idx) => (
                    <div
                      key={idx}
                      className="border border-slate-800 rounded-xl bg-slate-900 overflow-hidden transition-all"
                    >
                      <button
                        onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                        className="w-full p-4 text-left font-medium text-white text-sm sm:text-base flex items-center justify-between gap-4 cursor-pointer hover:text-orange-400 transition-colors"
                      >
                        <span>{faq.q}</span>
                        {openFaq === idx ? <ChevronUp size={18} className="text-orange-400 shrink-0" /> : <ChevronDown size={18} className="text-slate-400 shrink-0" />}
                      </button>
                      {openFaq === idx && (
                        <div className="px-4 pb-4 text-xs sm:text-sm text-slate-400 leading-relaxed border-t border-slate-800/60 pt-3">
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
        <section className="py-20 sm:py-24 px-5 bg-slate-950 border-b border-slate-800/80 text-center relative z-10">
          <div className="mx-auto max-w-2xl">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
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
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-black shadow-xl shadow-orange-500/30 h-11 rounded-xl px-10 text-sm transition-all hover:scale-105 cursor-pointer mt-4"
            >
              Reserve my free seat
              <ArrowRight className="ml-1.5 size-4" />
            </button>

            <p className="mt-4 text-sm font-medium text-orange-400">
              🔥 Live seats are limited. Register now before registration closes.
            </p>
            <p className="mt-2 text-xs uppercase tracking-widest text-slate-500">
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
            <span className="text-sm font-semibold text-white">Resin Mastery Masterclass</span>
          </div>
          <button
            onClick={scrollToRegister}
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-bold shadow-md h-8 rounded-md px-3 text-xs transition-all cursor-pointer hover:scale-105"
          >
            Get my free seat
            <ArrowRight size={13} />
          </button>
        </div>
      </div>

      {/* ─── 10. FOOTER ─── */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-10 px-5 text-slate-400">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 sm:flex-row sm:items-center sm:justify-between pb-8">
          <div>
            <BrandLogo href="/" size="sm" />
            <p className="mt-2 max-w-sm text-xs text-slate-400">
              Resin Art • Identity • Financial Freedom
            </p>
          </div>
          <ul className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-400">
            <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
            <li><Link href="/terms" className="hover:text-white transition-colors">Terms &amp; Conditions</Link></li>
            <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
          </ul>
        </div>
        <div className="border-t border-slate-800/80 pt-4">
          <p className="mx-auto max-w-6xl text-xs text-slate-400">
            © 2026 Ravishing Art Hub. All Rights Reserved. Income figures mentioned are business goals, not guaranteed outcomes.
          </p>
        </div>
      </footer>
    </div>
  );
}
