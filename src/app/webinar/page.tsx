"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import SiteFooter from "@/components/layout/SiteFooter";
import SiteNavbar from "@/components/layout/SiteNavbar";
import { WebinarCountdown } from "@/components/webinar/WebinarCountdown";
import WebinarHero from "@/components/webinar/WebinarHero";
import CommunityStories from "@/components/webinar/CommunityStories";
import WebinarFaqs from "@/components/webinar/WebinarFaqs";
import WebinarMentor from "@/components/webinar/WebinarMentor";
import { SocialProofToaster } from "@/components/webinar/SocialProofToaster";
import { ExitIntentModal } from "@/components/webinar/ExitIntentModal";
import SoundFamiliarSection from "@/components/webinar/SoundFamiliarSection";
import WhatChangesSection from "@/components/webinar/WhatChangesSection";
import WebinarPhilosophy from "@/components/webinar/WebinarPhilosophy";
import ThreeSecretsSection from "@/components/webinar/ThreeSecretsSection";
import RightFitStackSection from "@/components/webinar/RightFitStackSection";
import HonestFitCheckSection from "@/components/webinar/HonestFitCheckSection";
import { API_BASE_URL } from "@/config/api";
import { trackingService } from "@/services/trackingService";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Lock,
  Unlock,
  Award,
  BookOpen,
  Flame,
  Star,
  Layers,
  HeartHandshake,
  TrendingUp,
  HelpCircle,
  Check,
  ChevronDown,
  ChevronUp,
  X,
  AlertCircle,
  Palette,
  DollarSign,
  Crown,
  Briefcase,
  Brush,
  Sun,
  Moon
} from "lucide-react";

// ─── EXACT REFERENCE DATA IN 100% CANONICAL SEQUENCE FROM SOURCE BUNDLE ───

const STAT_COUNTERS = [
  { value: "10+ Years", label: "Experience in coaching" },
  { value: "54,000+", label: "Webinar attendees" },
  { value: "2022", label: "Hall of Fame Award" },
  { value: "90 min", label: "Live masterclass" },
  { value: "International Best Seller", label: "Featured as part of I Can Coach" },
  { value: "Featured", label: "Sylph Magazine and other art publications" },
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
      badge: "MASTERY",
      tabName: "Mastery",
      title: "Learn the right techniques in the right sequence",
      myth: "Most people believe more tutorials will eventually add up.",
      body: "You'll see why random tutorials create confusion, and how structured learning accelerates progress — technique sequencing, premium skill development, a portfolio-building mindset and moving beyond random projects.",
      image: "/images/secrets/secret-1-mastery.jpg",
    },
    {
      label: "STEP 2",
      badge: "MINDSET",
      tabName: "Mindset",
      title: "Become confident enough to own your creativity",
      myth: "Most people believe their work isn't good enough to be seen yet.",
      body: "You'll learn how to move past fear of creating, comparison, the \"my work isn't good enough\" loop, fear of showing your work, and confusion about your artistic identity.",
      image: "/images/secrets/secret-2-mindset.jpg",
    },
    {
      label: "STEP 3",
      badge: "MONETIZATION",
      tabName: "Monetization",
      title: "Turn your art into a real opportunity",
      myth: "Most people believe business skills come much later.",
      body: "You'll understand the foundations of product selection, pricing, branding, marketing, customer attraction, community support and a practical business roadmap.",
      image: "/images/secrets/secret-3-monetization.jpg",
    },
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
      title: "60-Day Goal Planner",
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
      value: "Free bonus",
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

  // Fetch dynamic scarcity stats and next webinar from database
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
      } catch (_) { }
    };

    const fetchNextWebinar = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/webinar/next`);
        const data = await res.json();
        if (data.success && data.data) {
          setActiveWebinar(data.data);
        }
      } catch (_) { }
    };

    fetchStats();
    // fetchNextWebinar();
    try {
      trackingService.trackViewContent({
        name: "Resin Art Masterclass Webinar",
        category: "Webinar",
      });
    } catch (_) { }
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

      // Safely fire marketing events
      try {
        trackingService.trackLead({ source: "webinar_registration" });
        trackingService.trackBooking({
          service: "Resin Art Masterclass",
          date: activeWebinar?.scheduledAt,
        });
      } catch (_) { }

      if (typeof window !== "undefined") {
        sessionStorage.setItem("webinar_lead", JSON.stringify(data.data || form));
      }

      router.push("/thank-you");
    } catch (err: any) {
      // Still fire lead even if local network edge case saved to fallback
      try {
        trackingService.trackLead({ source: "webinar_registration_fallback" });
      } catch (_) { }

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
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const resolvedDate = useMemo(() => {
    if (activeWebinar?.scheduledAt) {
      const d = new Date(activeWebinar.scheduledAt);
      if (!isNaN(d.getTime())) return d;
    }
    const target = new Date();
    const day = target.getDay();
    const diff = (7 - day) % 7;
    target.setDate(target.getDate() + (diff === 0 && target.getHours() >= 20 ? 7 : diff));
    target.setHours(20, 0, 0, 0);
    return target;
  }, [activeWebinar?.scheduledAt]);

  const displayDateStr = useMemo(() => {
    return resolvedDate.toLocaleDateString("en-IN", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
  }, [resolvedDate]);

  const displayTimeStr = useMemo(() => {
    return (
      resolvedDate
        .toLocaleTimeString("en-IN", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        })
        .toUpperCase() + " IST"
    );
  }, [resolvedDate]);

  const displayDurationStr = useMemo(() => {
    if (activeWebinar?.durationMinutes) {
      return `${activeWebinar.durationMinutes} minutes`;
    }
    return "90 minutes";
  }, [activeWebinar?.durationMinutes]);

  return (
    <div className="landing-page relative min-h-screen bg-[#ffffff] pb-20 text-stone-900 selection:bg-orange-500 selection:text-white">
      <SocialProofToaster />
      <ExitIntentModal onClaimSeat={scrollToRegister} />

      {/* ─── 1. TOP ANNOUNCEMENT BANNER ─── */}
      {showBanner && (
        <div className="relative z-50 border-b border-[#f3d7c4]"
          style={{
            backgroundColor: "#ffffff",
            backgroundImage: "radial-gradient(circle, #e2ded4 1.5px, transparent 1.5px)",
            backgroundAttachment: "fixed",
          }}>
          <div className="nav-width flex items-center justify-center gap-2 py-2.5 text-center text-xs font-medium text-stone-800 sm:text-sm">
            <span className="flex items-center gap-1.5">
              <Flame size={16} className="text-orange-500" />
              <strong>🔥 LIVE MASTERCLASS — LIMITED SEATS.</strong> Registration closes when live-seat capacity is reached.
            </span>
          </div>
          <button
            type="button"
            onClick={() => setShowBanner(false)}
            aria-label="Dismiss announcement"
            className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-stone-400 transition hover:text-stone-800"
          >
            <X size={18} />
          </button>
        </div>
      )}

      <SiteNavbar />

      <main>
        <WebinarHero
          displayDateStr={displayDateStr}
          displayTimeStr={displayTimeStr}
          displayDurationStr={displayDurationStr}
          stats={stats}
          error={error}
          loading={loading}
          form={form}
          onUpdate={update}
          onSubmit={handleSubmit}
          onScrollToRegister={scrollToRegister}
          onUnlockAndScroll={handleUnlockAndScroll}
          onWebinarLoaded={(wb) => setActiveWebinar(wb)}
        />

        {/* ─── 4. RECOGNISED FOR MARQUEE ─── */}
        {/* <section
          className="border-y border-[#eadfd4] py-10 sm:py-12"
          style={{
            backgroundColor: "#ffffff",
            backgroundImage: "radial-gradient(circle, #e2ded4 1.5px, transparent 1.5px)",
            backgroundSize: "24px 24px",
            backgroundAttachment: "fixed",
          }}
        >
          <div className="nav-width">
            <div className="text-center">
              <p className="mb-5 text-xs sm:text-base lg:text-xs font-semibold uppercase tracking-[0.18em] text-[#942008]">Recognised for</p>
              <ul className="flex flex-wrap items-center justify-center gap-3 text-xs sm:text-base lg:text-sm font-semibold text-stone-700">
                {["Hall of Fame Award 2022", "I Can Coach — International Best Seller", "Sylph Magazine", "54,000+ webinar attendees", "10+ years coaching"].map((item) => (
                  <li key={item} className="rounded-full border border-[#eadfd4] bg-[#fffaf6] px-4 py-2">{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </section> */}

        {/* ─── TOP GAP ABOVE MARQUEE WITH WHITE DOT STYLE ─── */}
        <div
          className="w-full py-8 sm:py-12 border-b border-[#eadfd4]/60"
          style={{
            backgroundColor: "#ffffff",
            backgroundImage: "radial-gradient(circle, #e2ded4 1.5px, transparent 1.5px)",
            backgroundSize: "24px 24px",
            backgroundAttachment: "fixed",
          }}
          aria-hidden="true"
        />

        {/* ─── 5. BIG STAT COUNTERS MARQUEE (CONTINUOUS SCROLLING RIGHT TO LEFT) ─── */}
        <section className="relative w-full overflow-hidden bg-[#f7f6f0] py-12 sm:py-16 select-none border-b border-[#eadfd4]/70">
          {/* Subtle gradient fades on left and right for seamless edge transitions */}
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-[#f7f6f0] to-transparent z-10" />
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-[#f7f6f0] to-transparent z-10" />

          {/* Marquee Track: duplicated list seamlessly moving right-to-left */}
          <div
            className="flex gap-4 sm:gap-6 w-max hover:[animation-play-state:paused]"
            style={{
              animation: "marquee-left 28s linear infinite",
            }}
          >
            {[...STAT_COUNTERS, ...STAT_COUNTERS].map((stat, idx) => (
              <div
                key={idx}
                className="w-[260px] sm:w-[300px] shrink-0 rounded-3xl border border-[#eadfd4] bg-white px-6 py-6 sm:py-7 text-center shadow-[0_16px_36px_-28px_rgba(90,55,20,0.45)] hover:shadow-[0_20px_40px_-20px_rgba(148,32,8,0.25)] transition-all duration-300 flex flex-col justify-center min-h-[140px]"
              >
                <dt className="text-2xl sm:text-3xl lg:text-3xl font-black tracking-tight text-[#942008] leading-tight flex items-center justify-center min-h-[3.25rem]">
                  {stat.value}
                </dt>
                <dd className="mt-1.5 text-xs sm:text-base lg:text-sm text-stone-500 leading-snug">
                  {stat.label}
                </dd>
              </div>
            ))}
          </div>

          {/*
          Previous Static Grid UI kept commented as requested:
          <div className="nav-width hidden">
            <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
              {STAT_COUNTERS.map((stat, idx) => (
                <div key={idx} className="rounded-3xl border border-[#eadfd4] bg-white px-4 py-6 text-center shadow-[0_16px_36px_-28px_rgba(90,55,20,0.45)]">
                  <dt className="text-3xl sm:text-5xl lg:text-4xl font-black tracking-tight text-[#942008]">{stat.value}</dt>
                  <dd className="mt-1 text-xs sm:text-base lg:text-sm text-stone-500">{stat.label}</dd>
                </div>
              ))}
            </dl>
          </div>
          */}
        </section>

        {/* ─── 6. THE INTERACTIVE GATE SECTION ─── */}
        <section
          id="gate"
          className="relative z-10 py-16 sm:py-20"
          style={{
            backgroundColor: "#ffffff",
            backgroundImage: "radial-gradient(circle, #e2ded4 1.5px, transparent 1.5px)",
            backgroundSize: "24px 24px",
            backgroundAttachment: "fixed",
          }}
        >
          <div className="nav-width">
            <div className="mx-auto max-w-3xl rounded-[2rem] border border-[#f3d3c0] bg-[linear-gradient(180deg,#fffaf6_0%,#fff_100%)] px-6 py-12 text-center shadow-[0_24px_50px_-32px_rgba(90,55,20,0.4)] sm:px-12">
              <h2 className="text-3xl sm:text-5xl lg:text-5xl font-black tracking-tight text-neutral-950">
                Want to know what makes this <span className="text-[#942008]">Masterclass different?</span>
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-sm sm:text-xl lg:text-base leading-relaxed text-neutral-600">
                I&apos;ve designed this session around the three things most aspiring resin artists need — mastery, mindset and monetization.
              </p>
              <button
                onClick={() => setIsUnlocked(!isUnlocked)}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-8 py-3 text-xs sm:text-base lg:text-sm font-semibold text-white shadow-lg shadow-orange-500/20 transition hover:from-orange-600 hover:to-amber-600 cursor-pointer mt-8"
              >
                {isUnlocked ? "Hide what you'll learn" : "Show me what I'll learn"}
                {isUnlocked ? <ChevronUp className="ml-1 size-4" /> : <ChevronDown className="ml-1 size-4" />}
              </button>
            </div>
          </div>
        </section>

        {/* ─── 7. UNLOCKED EXACT CURRICULUM SECTIONS (100% MATCHING REFERENCE SEQUENCE) ─── */}
        {isUnlocked && (
          <div id="gate-content">

            {/* 1. SOUND FAMILIAR? (W -> e2) */}
            <SoundFamiliarSection
              data={SOUND_FAMILIAR}
              onScrollToRegister={scrollToRegister}
            />

            {/* 2. MY PHILOSOPHY (H -> n2) */}
            <WebinarPhilosophy data={PHILOSOPHY} />

            {/* 3 & 4. ON THE MASTERCLASS: THE THREE SECRETS & LIVE SEATS BANNER */}
            {/*
            <ThreeSecretsSection
              data={THREE_SECRETS}
              bannerData={LIVE_SEATS_BANNER}
              onScrollToRegister={scrollToRegister}
            />
            */}

            {/* 5. THE SHIFT (L -> i2) */}
            <section
              className="py-16 sm:py-20"
              style={{
                backgroundColor: "#ffffff",
                backgroundImage: "radial-gradient(circle, #e2ded4 1.5px, transparent 1.5px)",
                backgroundSize: "24px 24px",
                backgroundAttachment: "fixed",
              }}
            >
              <div className="nav-width">
                <div className="text-center max-w-3xl mx-auto mb-14">
                  <span className="mb-4 inline-flex items-center text-xs sm:text-base lg:text-xs font-semibold uppercase tracking-[0.18em] text-[#942008]">
                    {THE_SHIFT.eyebrow}
                  </span>
                  <h2 className="mb-4 text-3xl sm:text-5xl lg:text-5xl font-black tracking-tight text-neutral-950">
                    Stop learning resin the <span className="text-[#942008]">hard way</span>
                  </h2>
                  <p className="mx-auto max-w-2xl text-sm sm:text-xl lg:text-base text-neutral-600 leading-relaxed">
                    {THE_SHIFT.subheading}
                  </p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full overflow-hidden rounded-3xl border border-[#eadfd4] text-left text-xs sm:text-base lg:text-sm shadow-[0_18px_40px_-30px_rgba(90,55,20,0.45)]">
                    <thead>
                      <tr className="border-b border-[#eadfd4] bg-[#fff6f0]">
                        <th className="p-4 font-bold text-stone-500 uppercase text-xs sm:text-sm lg:text-xs tracking-wider">{THE_SHIFT.beforeHeading}</th>
                        <th className="p-4 font-bold text-stone-800 uppercase text-xs sm:text-sm lg:text-xs tracking-wider">{THE_SHIFT.afterHeading}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#eadfd4] bg-white">
                      {THE_SHIFT.pairs.map((pair, idx) => (
                        <tr key={idx}>
                          <td className="p-4 text-stone-500 text-xs sm:text-base lg:text-sm">
                            {pair.before}
                          </td>
                          <td className="p-4 text-stone-800 font-medium text-xs sm:text-base lg:text-sm">
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
            <WhatChangesSection data={WHAT_CHANGES} />

            {/* 7. RIGHT FIT? (ee -> s2) */}
            <RightFitStackSection data={RIGHT_FIT} />

            {/* 8. PROOF (te -> r2) */}
            {/* <section className="bg-transparent py-16 sm:py-20">
              <div className="nav-width">
                <div className="text-center max-w-3xl mx-auto mb-12">
                  <span className="mb-4 inline-flex items-center text-xs sm:text-base lg:text-xs font-semibold uppercase tracking-[0.18em] text-[#942008]">
                    {PROOF.eyebrow}
                  </span>
                  <h2 className="mb-4 text-3xl sm:text-5xl lg:text-5xl font-black tracking-tight text-neutral-950">
                    You&apos;re learning from someone who has been in the <span className="text-[#942008]">arena</span>
                  </h2>
                  <p className="text-sm sm:text-xl lg:text-base text-neutral-600 leading-relaxed max-w-2xl mx-auto">
                    {PROOF.body}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {PROOF.items.map((item, idx) => (
                    <div key={idx} className="border border-[#eadfd4] bg-white shadow-[0_16px_40px_-30px_rgba(90,55,20,0.45)] rounded-2xl p-5 text-center">
                      <p className="text-2xl sm:text-4xl lg:text-3xl font-black text-neutral-950 mb-1">{item.value}</p>
                      <p className="text-xs sm:text-base lg:text-sm text-stone-500 font-medium">{item.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section> */}

            {/* 9. FREE BONUS: CLARITY KIT (B -> u2) */}
            <section
              className="py-16 sm:py-20"
              style={{
                backgroundColor: "#ffffff",
                backgroundImage: "radial-gradient(circle, #e2ded4 1.5px, transparent 1.5px)",
                backgroundSize: "24px 24px",
                backgroundAttachment: "fixed",
              }}
            >
              <div className="nav-width">
                <div className="text-center max-w-3xl mx-auto mb-14">
                  <span className="mb-4 inline-flex items-center text-xs sm:text-base lg:text-xs font-semibold uppercase tracking-[0.18em] text-[#942008]">
                    {CLARITY_KIT.eyebrow}
                  </span>
                  <h2 className="mb-4 text-3xl sm:text-5xl lg:text-5xl font-black tracking-tight text-neutral-950">
                    Register free & get the <span className="text-[#942008]">Resin Artist Clarity Kit</span>
                  </h2>
                  <p className="mx-auto max-w-2xl text-sm sm:text-xl lg:text-base text-neutral-600 leading-relaxed">
                    {CLARITY_KIT.subheading}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                  {CLARITY_KIT.items.map((item, idx) => (
                    <div key={idx} className="rounded-3xl border border-[#eadfd4] bg-white p-6 shadow-[0_18px_40px_-30px_rgba(90,55,20,0.5)]">
                      <span className="mb-3 block h-1 w-8 rounded-full bg-gradient-to-r from-orange-500 to-amber-400" />
                      <h3 className="mb-2 text-base sm:text-xl lg:text-lg font-bold text-neutral-950">{item.title}</h3>
                      <p className="text-xs sm:text-base lg:text-sm text-neutral-600 leading-relaxed">{item.body}</p>
                    </div>
                  ))}
                </div>

                <div className="text-center">
                  <button
                    onClick={scrollToRegister}
                    className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-6 text-xs sm:text-base lg:text-sm font-semibold text-white shadow-lg shadow-orange-500/20 transition hover:from-orange-600 hover:to-amber-600"
                  >
                    {CLARITY_KIT.cta}
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </section>

            {/* 10. VALUE STACK (Ks -> E) */}
            <section className="bg-transparent py-16 sm:py-20">
              <div className="nav-width">
                <div className="text-center max-w-2xl mx-auto mb-12">
                  <span className="mb-4 inline-flex items-center text-xs sm:text-base lg:text-xs font-semibold uppercase tracking-[0.18em] text-[#942008]">
                    {VALUE_STACK.eyebrow}
                  </span>
                  <h2 className="mb-4 text-3xl sm:text-5xl lg:text-5xl font-black tracking-tight text-neutral-950">
                    Everything you need to start seeing your <span className="text-[#942008]">resin journey differently</span>
                  </h2>
                </div>

                <div className="space-y-4 mb-8">
                  {VALUE_STACK.items.map((item, idx) => (
                    <div key={idx} className="border border-[#eadfd4] bg-white shadow-[0_16px_40px_-30px_rgba(90,55,20,0.45)] rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h3 className="text-base sm:text-xl lg:text-lg font-bold text-neutral-950">{item.title}</h3>
                        <p className="text-xs sm:text-base lg:text-sm text-neutral-600 mt-1">{item.body}</p>
                      </div>
                      <span className="text-xs sm:text-base lg:text-sm font-bold text-[#942008] shrink-0 bg-[#fff6f0] border border-[#eadfd4] px-3 py-1.5 rounded-lg text-center">
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border border-[#eadfd4] bg-white shadow-[0_16px_40px_-30px_rgba(90,55,20,0.45)] rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
                  <div>
                    <p className="text-xs sm:text-sm lg:text-xs text-stone-500 uppercase tracking-widest">{VALUE_STACK.totalLabel}</p>
                    <p className="text-lg sm:text-2xl lg:text-xl font-bold text-stone-500 line-through">{VALUE_STACK.totalValue}</p>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm lg:text-xs text-[#942008] uppercase tracking-widest font-bold">{VALUE_STACK.priceLabel}</p>
                    <p className="text-2xl sm:text-4xl lg:text-3xl font-black text-emerald-600">{VALUE_STACK.priceValue}</p>
                  </div>
                  <button
                    onClick={scrollToRegister}
                    className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-6 text-xs sm:text-base lg:text-sm font-semibold text-white shadow-lg shadow-orange-500/20 transition hover:from-orange-600 hover:to-amber-600"
                  >
                    Reserve my free seat
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </section>

            {/* 11. HONEST FIT CHECK (D -> a2) */}
            <HonestFitCheckSection data={HONEST_FIT_CHECK} />

            {/* 12. AGENDA (se -> c2) */}
            <section className="bg-transparent py-16 sm:py-20">
              <div className="nav-width">
                <div className="text-center max-w-3xl mx-auto mb-14">
                  <span className="mb-4 inline-flex items-center text-xs sm:text-base lg:text-xs font-semibold uppercase tracking-[0.18em] text-[#942008]">
                    {AGENDA.eyebrow}
                  </span>
                  <h2 className="mb-4 text-3xl sm:text-5xl lg:text-5xl font-black tracking-tight text-neutral-950">
                    How the <span className="text-[#942008]">90 minutes run</span>
                  </h2>
                  <p className="mx-auto max-w-2xl text-sm sm:text-xl lg:text-base text-neutral-600 leading-relaxed">
                    {AGENDA.subheading}
                  </p>
                </div>

                <div className="space-y-4 max-w-3xl mx-auto">
                  {AGENDA.items.map((item, idx) => (
                    <div key={idx} className="border border-[#eadfd4] bg-white shadow-[0_16px_40px_-30px_rgba(90,55,20,0.45)] rounded-xl p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                      <span className="text-stone-500 font-mono text-xs sm:text-base lg:text-sm font-bold shrink-0">
                        {item.time}
                      </span>
                      <div>
                        <h3 className="font-bold text-neutral-950 text-sm sm:text-lg lg:text-base">{item.title}</h3>
                        <p className="text-xs sm:text-base lg:text-sm text-neutral-600 mt-0.5">{item.body}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* 13. YOUR MENTOR (A -> h2) */}
            {/*
            <WebinarMentor section={MENTOR_SECTION} onKnowMore={scrollToRegister} />
            */}

            {/* 14. COMMUNITY / TESTIMONIALS (ae -> d2) */}
            <CommunityStories section={COMMUNITY_SECTION} />

            <WebinarFaqs faqs={EXACT_FAQS} />

          </div>
        )}

        {/* ─── 8. FINAL EMOTIONAL CTA ─── */}
        <section
          className="relative z-10 py-16 text-center sm:py-24"
          style={{
            backgroundColor: "#ffffff",
            backgroundImage: "radial-gradient(circle, #e2ded4 1.5px, transparent 1.5px)",
            backgroundSize: "24px 24px",
            backgroundAttachment: "fixed",
          }}
        >
          <div className="nav-width">
            <div className="mx-auto max-w-3xl rounded-[2rem] bg-[#2a211c] px-6 py-12 sm:px-12 sm:py-16">
              <h2 className="mb-4 text-3xl sm:text-5xl lg:text-5xl font-black tracking-tight text-white">
                Your art deserves more than a <span className="text-[#ea580c]">place on your phone</span>
              </h2>
              <p className="mx-auto mb-8 max-w-2xl text-sm sm:text-xl lg:text-base leading-relaxed text-stone-300">
                You already have the spark. Now you need the skills, confidence and roadmap to give that spark a direction. Join the Resin Mastery Masterclass and discover how Mastery + Mindset + Monetization can change the way you see your resin journey.
              </p>

              <div className="mb-6 flex justify-center">
                <WebinarCountdown onWebinarLoaded={(wb) => setActiveWebinar(wb)} />
              </div>

              <button
                onClick={scrollToRegister}
                className="mt-4 inline-flex h-12 cursor-pointer items-center justify-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-8 text-xs sm:text-base lg:text-sm font-semibold text-white shadow-lg shadow-orange-500/25 transition hover:from-orange-600 hover:to-amber-600"
              >
                Reserve my free seat
                <ArrowRight className="ml-1.5 size-4" />
              </button>

              <p className="mt-4 text-xs sm:text-base lg:text-sm font-semibold text-[#ea580c]">
                🔥 Live seats are limited. Register now before registration closes.
              </p>
              <p className="mt-2 text-[11px] sm:text-xs uppercase tracking-[0.14em] text-stone-400">
                Free registration • 90-minute Masterclass • Practical clarity • Action-focused
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* ─── 9. STICKY BOTTOM REGISTRATION BAR ─── */}
      <div
        className={`fixed inset-x-0 bottom-0 z-50 border-t border-[#f3d3c0] bg-[#fffaf6]/95 backdrop-blur-xl transition-transform duration-300 ${showStickyBottom ? "translate-y-0" : "translate-y-full"
          }`}
      >
        <div className="nav-width flex flex-wrap items-center justify-between gap-3 py-3">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span className="text-xs sm:text-base lg:text-sm font-semibold text-stone-950">Resin Mastery Masterclass</span>
            <WebinarCountdown compact={true} targetDateStr={activeWebinar?.scheduledAt} />
          </div>
          <button
            onClick={scrollToRegister}
            className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-5 text-xs sm:text-base lg:text-sm font-semibold text-white shadow-lg shadow-orange-500/20 transition hover:from-orange-600 hover:to-amber-600"
          >
            Get my free seat
            <ArrowRight size={13} />
          </button>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}
