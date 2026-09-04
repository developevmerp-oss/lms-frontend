"use client";

import { BrandLogo } from "@/components/ui/BrandLogo";
import HeroVideoPlayer from "@/components/landing/HeroVideoPlayer";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { API_BASE_URL } from "@/config/api";
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

// Real Student Artworks for Live Exhibition Showcase (73 Total Works: 24 Original + 49 New Real Works)
const ARTWORKS_ROW_1 = [
  // Original Showcase Works (1-12)
  { title: "Botanical Floral Resin Coaster Set", artist: "Priya S.", type: "Real Flower Preservation", level: "Gold Member", price: "₹4,500 Sold", image: "/images/student-art/art-1.jpg", badge: "Floral Art" },
  { title: "Midnight Agate Ring Coaster Duo", artist: "Pooja V.", type: "Gold Trim Geode Pour", level: "Silver Member", price: "₹5,200 Sold", image: "/images/student-art/art-2.jpg", badge: "Luxury Coasters" },
  { title: "Black Obsidian & Gold Leaf Geode Coasters", artist: "Aarav K.", type: "3D Geode & Metallic Edge", level: "Silver Member", price: "₹6,900 Sold", image: "/images/student-art/art-3.jpg", badge: "Geode Inlay" },
  { title: "Vintage Botanical Bloom Clock", artist: "Ritu M.", type: "Floral Preservation Wall Art", level: "Renaissance Certification", price: "₹18,500 Sold", image: "/images/student-art/art-4.jpg", badge: "Preservation" },
  { title: "Pressed Petals Serving Platter", artist: "Sonia G.", type: "Crystal Clear Epoxy Layering", level: "Gold Member", price: "₹8,500 Sold", image: "/images/student-art/art-5.jpg", badge: "Tableware" },
  { title: "Emerald Crystal Butterfly Sculpt", artist: "Neha & Team", type: "Cellular Texture Pour", level: "Renaissance Certification", price: "₹12,000 Sold", image: "/images/student-art/art-6.jpg", badge: "3D Sculpt" },
  { title: "Rose Quartz Gold Foil Tray Set", artist: "Ananya D.", type: "Hand-Gilded Metallic Trim", level: "Silver Member", price: "₹7,500 Sold", image: "/images/student-art/art-7.jpg", badge: "Tableware" },
  { title: "Deep Sea Coastal Resin Platter", artist: "Divya N.", type: "Wave Foam Pour", level: "Silver Member", price: "₹6,800 Sold", image: "/images/student-art/art-8.jpg", badge: "Ocean Wave" },
  { title: "Golden Sands Shoreline Art", artist: "Kavya P.", type: "Real Shell & Resin Sand", level: "Silver Member", price: "₹5,900 Sold", image: "/images/student-art/art-9.jpg", badge: "Ocean Art" },
  { title: "Sunburst Agate Geode Serving Board", artist: "Kiran J.", type: "Gold Vein & Crystal Inlay", level: "Gold Member", price: "₹11,500 Sold", image: "/images/student-art/art-10.jpg", badge: "Geode Inlay" },
  { title: "Amethyst Shimmer Coaster Quad", artist: "Nisha R.", type: "Raw Quartz Cluster", level: "Gold Member", price: "₹6,200 Sold", image: "/images/student-art/art-11.jpg", badge: "Coasters" },
  { title: "Sapphire Ocean Resin Desk Organizer", artist: "Vikram P.", type: "3-Tier Resin Wave Pour", level: "Gold Member", price: "₹9,800 Sold", image: "/images/student-art/art-12.jpg", badge: "Ocean Art" },

  // New Real Student Works (1-25)
  { title: "Preserved Botanical Coaster Set", artist: "Priya S.", type: "Floral Preservation", level: "Gold Member", price: "₹4,500 Sold", image: "/images/student-art/real-art-1.jpg", badge: "Floral Art" },
  { title: "Black Obsidian Geode Tray", artist: "Aarav K.", type: "3D Geode & Gilding", level: "Silver Member", price: "₹6,900 Sold", image: "/images/student-art/real-art-2.jpg", badge: "Geode Inlay" },
  { title: "Ocean Lacing Beach Platter", artist: "Neha M.", type: "Cellular Wave Spray", level: "Renaissance Certification", price: "₹12,000 Sold", image: "/images/student-art/real-art-3.jpg", badge: "Ocean Wave" },
  { title: "Floral Garland Wall Clock", artist: "Tanvi R.", type: "Preservation Wall Art", level: "Renaissance Certification", price: "₹18,500 Sold", image: "/images/student-art/real-art-4.jpg", badge: "Statement Decor" },
  { title: "Gold Leaf Epoxy Coaster Duo", artist: "Sonia G.", type: "Metallic Edge Casting", level: "Gold Member", price: "₹5,500 Sold", image: "/images/student-art/real-art-5.jpg", badge: "Tableware" },
  { title: "3D Wave Ripples Table", artist: "Pooja V.", type: "Deep Ocean Casting", level: "Gold Member", price: "₹28,000 Sold", image: "/images/student-art/real-art-6.jpg", badge: "River Slab" },
  { title: "Lotus Pond Floating Art", artist: "Ritu M.", type: "3D Depth Simulation", level: "Silver Member", price: "₹8,500 Sold", image: "/images/student-art/real-art-7.jpg", badge: "Lotus Art" },
  { title: "Agate Crystal Gilding Coasters", artist: "Vikram P.", type: "Fine Vein Pattern", level: "Silver Member", price: "₹4,800 Sold", image: "/images/student-art/real-art-8.jpg", badge: "Luxury Coasters" },
  { title: "Bridal Flower Keepsake Block", artist: "Ananya D.", type: "High-Gloss Encapsulation", level: "Renaissance Certification", price: "₹15,000 Sold", image: "/images/student-art/real-art-9.jpg", badge: "Preservation" },
  { title: "Turquoise Wave Platter", artist: "Meera K.", type: "Sea Spray Lacing", level: "Gold Member", price: "₹9,200 Sold", image: "/images/student-art/real-art-10.jpg", badge: "Ocean Art" },
  { title: "Emerald Metallic Geode Clock", artist: "Kiran J.", type: "Crystal Cluster Inlay", level: "Gold Member", price: "₹16,500 Sold", image: "/images/student-art/real-art-11.jpg", badge: "Geode Inlay" },
  { title: "Alcohol Ink Abstract Canvas", artist: "Divya N.", type: "Swirl Color Manipulation", level: "Silver Member", price: "₹7,200 Sold", image: "/images/student-art/real-art-12.jpg", badge: "Fine Art" },
  { title: "Tree of Life Metallic Clock", artist: "Krupali S.", type: "Gold Leaf & Wire Art", level: "Gold Member", price: "₹14,500 Sold", image: "/images/student-art/real-art-13.jpg", badge: "Luxury Clocks" },
  { title: "Pressed Petals Tea Tray", artist: "Drashti G.", type: "Real Flower Embedding", level: "Silver Member", price: "₹6,800 Sold", image: "/images/student-art/real-art-14.jpg", badge: "Tableware" },
  { title: "3D Photo Keepsake Dome", artist: "Kavita R.", type: "Memoir Encapsulation", level: "Renaissance Certification", price: "₹11,000 Sold", image: "/images/student-art/real-art-15.jpg", badge: "3D Photo" },
  { title: "Ocean Beach Key Holder", artist: "Shruti P.", type: "Realistic Sand Wave", level: "Silver Member", price: "₹3,900 Sold", image: "/images/student-art/real-art-16.jpg", badge: "Home Decor" },
  { title: "Rose Quartz Coaster Set", artist: "Bhavna T.", type: "Pink Metallic Gilding", level: "Silver Member", price: "₹5,200 Sold", image: "/images/student-art/real-art-17.jpg", badge: "Coasters" },
  { title: "Live Edge River Table Model", artist: "Rajesh K.", type: "Epoxy Wood Casting", level: "Renaissance Certification", price: "₹45,000 Sold", image: "/images/student-art/real-art-18.jpg", badge: "River Table" },
  { title: "Resin Mantra Wall Hanging", artist: "Sunita M.", type: "Typography & Foil Work", level: "Gold Member", price: "₹12,800 Sold", image: "/images/student-art/real-art-19.jpg", badge: "Mantra Art" },
  { title: "Marbled Vanity Mirror Frame", artist: "Alpa P.", type: "Contrasting Vein Flow", level: "Silver Member", price: "₹8,900 Sold", image: "/images/student-art/real-art-20.jpg", badge: "Vanity Decor" },
  { title: "Evil Eye Protective Coasters", artist: "Heena B.", type: "Concentric Ring Pours", level: "Silver Member", price: "₹4,200 Sold", image: "/images/student-art/real-art-21.jpg", badge: "Evil Eye" },
  { title: "Botanical Bookmark Set", artist: "Jalpa S.", type: "Foil & Petal Suspension", level: "Fast Track", price: "₹2,500 Sold", image: "/images/student-art/real-art-22.jpg", badge: "Starter Pours" },
  { title: "Deep Sea Coastal Tray", artist: "Preeti V.", type: "Multi-Layer Blue Depth", level: "Gold Member", price: "₹10,500 Sold", image: "/images/student-art/real-art-23.jpg", badge: "Ocean Wave" },
  { title: "Geode Crystal Ring Dish", artist: "Nisha D.", type: "Gilded Metallic Rim", level: "Silver Member", price: "₹3,800 Sold", image: "/images/student-art/real-art-24.jpg", badge: "Geode Inlay" },
  { title: "Floral Varmala Preservation Block", artist: "Urmi C.", type: "Deep Casting Cube", level: "Renaissance Certification", price: "₹22,000 Sold", image: "/images/student-art/real-art-25.jpg", badge: "Preservation" }
];

const ARTWORKS_ROW_2 = [
  // Original Showcase Works (13-24)
  { title: "Tree of Life Wire & Resin Clock", artist: "Meenal B.", type: "Handcrafted Copper Wire", level: "Gold Member", price: "₹16,000 Sold", image: "/images/student-art/art-13.jpg", badge: "Luxury Clocks" },
  { title: "Caribbean Coral Lacing Wall Canvas", artist: "Meera K.", type: "Cell Lacing Masterpiece", level: "Gold Member", price: "₹24,000 Sold", image: "/images/student-art/art-14.jpg", badge: "Fine Art" },
  { title: "Global Ocean Wave World Map Wall Art", artist: "Tanvi R.", type: "Multi-Layer Ocean Lacing", level: "Renaissance Certification", price: "₹48,000 Sold", image: "/images/student-art/art-15.jpg", badge: "Statement Decor" },
  { title: "Lotus Pond 3D Water Simulation", artist: "Dipti V.", type: "Floating Petal Casting", level: "Silver Member", price: "₹9,500 Sold", image: "/images/student-art/art-16.jpg", badge: "Lotus Art" },
  { title: "Bridal Varmala Keepsake Pyramid", artist: "Bhavika T.", type: "Resin Flower Pyramid", level: "Renaissance Certification", price: "₹14,000 Sold", image: "/images/student-art/art-17.jpg", badge: "Preservation" },
  { title: "Turquoise Geode Resin Mirror", artist: "Shradha M.", type: "Large Format Geode", level: "Gold Member", price: "₹29,000 Sold", image: "/images/student-art/art-18.jpg", badge: "Geode Inlay" },
  { title: "Epoxy Teak River Slab Coffee Table", artist: "Aakash & Team", type: "Live Edge Wood Pour", level: "Renaissance Certification", price: "₹58,000 Sold", image: "/images/student-art/art-19.jpg", badge: "River Table" },
  { title: "Gold Foil Mantra Wall Plaque", artist: "Sunita G.", type: "Sanskrit Devotional Foil", level: "Gold Member", price: "₹13,500 Sold", image: "/images/student-art/art-20.jpg", badge: "Mantra Art" },
  { title: "Evil Eye Concentric Ring Tray", artist: "Priti N.", type: "High Gloss Color Layering", level: "Silver Member", price: "₹6,100 Sold", image: "/images/student-art/art-21.jpg", badge: "Evil Eye" },
  { title: "Alcohol Ink Celestial Swirl Art", artist: "Juhi C.", type: "Fluid Ink Dispersal", level: "Silver Member", price: "₹8,000 Sold", image: "/images/student-art/art-22.jpg", badge: "Fine Art" },
  { title: "Pressed Wildflower Bookmark Trio", artist: "Kinjal A.", type: "Starter Foil & Flower", level: "Fast Track", price: "₹2,800 Sold", image: "/images/student-art/art-23.jpg", badge: "Starter Art" },
  { title: "Deep Sea Coastal Resin Platter Duo", artist: "Reena S.", type: "Multi-Depth Ocean Foam", level: "Gold Member", price: "₹11,000 Sold", image: "/images/student-art/art-24.jpg", badge: "Ocean Wave" },

  // New Real Student Works (26-49)
  { title: "Sunset Ocean Foam Canvas", artist: "Payal K.", type: "Coral Gradient Waves", level: "Gold Member", price: "₹13,500 Sold", image: "/images/student-art/real-art-26.jpg", badge: "Ocean Art" },
  { title: "Gold Trim Marble Cheese Board", artist: "Trupti G.", type: "Epoxy Wood Finishing", level: "Silver Member", price: "₹7,500 Sold", image: "/images/student-art/real-art-27.jpg", badge: "Tableware" },
  { title: "Crystal Agate Wall Decor", artist: "Kinjal B.", type: "3D Geode Inlay", level: "Gold Member", price: "₹19,000 Sold", image: "/images/student-art/real-art-28.jpg", badge: "Wall Canvas" },
  { title: "Preserved Varmala Memory Frame", artist: "Sonali M.", type: "Wedding Garland Casting", level: "Renaissance Certification", price: "₹25,000 Sold", image: "/images/student-art/real-art-29.jpg", badge: "Preservation" },
  { title: "Sapphire Wave Desk Clock", artist: "Riddhi N.", type: "High Gloss Sea Wave", level: "Gold Member", price: "₹11,200 Sold", image: "/images/student-art/real-art-30.jpg", badge: "Luxury Clocks" },
  { title: "Cellular Texture Coaster Duo", artist: "Sheetal R.", type: "Heat Gun Cell Spray", level: "Silver Member", price: "₹4,900 Sold", image: "/images/student-art/real-art-31.jpg", badge: "Coasters" },
  { title: "Black & Gold Vein Platter", artist: "Nidhi S.", type: "Marble Veining Pour", level: "Silver Member", price: "₹8,200 Sold", image: "/images/student-art/real-art-32.jpg", badge: "Tableware" },
  { title: "Pressed Daisy Acrylic Block", artist: "Radhika K.", type: "Clear Flower Casting", level: "Fast Track", price: "₹3,200 Sold", image: "/images/student-art/real-art-33.jpg", badge: "Starter Art" },
  { title: "Live Edge Resin Side Table", artist: "Darshan P.", type: "Teak Wood Deep Pour", level: "Renaissance Certification", price: "₹38,000 Sold", image: "/images/student-art/real-art-34.jpg", badge: "River Slab" },
  { title: "3D Portrait Keepsake Slab", artist: "Aarti M.", type: "High Definition Photo Seal", level: "Renaissance Certification", price: "₹14,000 Sold", image: "/images/student-art/real-art-35.jpg", badge: "3D Photo" },
  { title: "Coral Reef Wall Decor", artist: "Charmi H.", type: "Multi-Depth Ocean Layers", level: "Gold Member", price: "₹17,500 Sold", image: "/images/student-art/real-art-36.jpg", badge: "Ocean Wave" },
  { title: "Metallic Leaf Incense Holder", artist: "Jignasa T.", type: "Silicone Mold Casting", level: "Fast Track", price: "₹2,800 Sold", image: "/images/student-art/real-art-37.jpg", badge: "Home Decor" },
  { title: "Amethyst Crystal Geode Clock", artist: "Dipti N.", type: "Raw Quartz Embedment", level: "Gold Member", price: "₹15,800 Sold", image: "/images/student-art/real-art-38.jpg", badge: "Geode Inlay" },
  { title: "Real Rose Resin Paperweight", artist: "Chintan V.", type: "Bubble-Free Sphere", level: "Silver Member", price: "₹4,500 Sold", image: "/images/student-art/real-art-39.jpg", badge: "Preservation" },
  { title: "Ocean Beach Coaster Quad", artist: "Manshi L.", type: "Realistic Shoreline", level: "Silver Member", price: "₹6,400 Sold", image: "/images/student-art/real-art-40.jpg", badge: "Coasters" },
  { title: "Lotus Pond Wall Medallion", artist: "Varsha B.", type: "Floating Lily Leaves", level: "Gold Member", price: "₹12,500 Sold", image: "/images/student-art/real-art-41.jpg", badge: "Lotus Art" },
  { title: "Gilded Agate Serving Tray", artist: "Komal D.", type: "Gold Foil Rim Finish", level: "Silver Member", price: "₹8,900 Sold", image: "/images/student-art/real-art-42.jpg", badge: "Tableware" },
  { title: "Bridal Bouquet Table Clock", artist: "Krupa P.", type: "Wedding Flower Clock", level: "Renaissance Certification", price: "₹21,000 Sold", image: "/images/student-art/real-art-43.jpg", badge: "Preservation" },
  { title: "Deep Sea Wave Serving Platter", artist: "Hemangi K.", type: "Triple Lacing Spray", level: "Gold Member", price: "₹10,800 Sold", image: "/images/student-art/real-art-44.jpg", badge: "Ocean Wave" },
  { title: "Emerald Marble Ring Dish", artist: "Dhwani S.", type: "Gold Veined Rim", level: "Silver Member", price: "₹3,500 Sold", image: "/images/student-art/real-art-45.jpg", badge: "Coasters" },
  { title: "Resin Typography Quote Plaque", artist: "Falguni V.", type: "Gold Leaf Lettering", level: "Silver Member", price: "₹7,200 Sold", image: "/images/student-art/real-art-46.jpg", badge: "Mantra Art" },
  { title: "Preserved Baby Keepsake Block", artist: "Riddhi J.", type: "First Booties & Ribbon", level: "Renaissance Certification", price: "₹16,500 Sold", image: "/images/student-art/real-art-47.jpg", badge: "Preservation" },
  { title: "Turquoise Geode Wall Mirror", artist: "Sejal M.", type: "Large Format Geode", level: "Gold Member", price: "₹32,000 Sold", image: "/images/student-art/real-art-48.jpg", badge: "Geode Inlay" },
  { title: "Ocean Shoreline Coffee Table", artist: "Vrajangna & Team", type: "Deep Ocean River Slab", level: "Renaissance Certification", price: "₹52,000 Sold", image: "/images/student-art/real-art-49.jpg", badge: "River Table" }
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
  const [levelTiers, setLevelTiers] = useState<any[]>([]);
  const [levelCourses, setLevelCourses] = useState<any[]>([]);

  useEffect(() => {
    const fetchLevelData = async () => {
      try {
        const storedToken = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        const headers: Record<string, string> = storedToken ? { Authorization: `Bearer ${storedToken}` } : {};

        const [levelsRes, coursesRes] = await Promise.all([
          fetch(`${API_BASE_URL}/dashboard/levels`, { headers }).then((r) => r.ok ? r.json() : []).catch(() => []),
          fetch(`${API_BASE_URL}/dashboard/courses`, { headers }).then((r) => r.ok ? r.json() : []).catch(() => []),
        ]);

        let validCourses = Array.isArray(coursesRes) && coursesRes.length > 0 ? coursesRes : [];
        if (validCourses.length === 0) {
          const fallbackCourses = await fetch(`${API_BASE_URL}/courses`, { headers }).then((r) => r.ok ? r.json() : []).catch(() => []);
          if (Array.isArray(fallbackCourses)) validCourses = fallbackCourses;
        }

        if (Array.isArray(levelsRes) && levelsRes.length > 0) setLevelTiers(levelsRes);
        if (validCourses.length > 0) setLevelCourses(validCourses);
      } catch (err) {
        console.error("Error loading level progression data:", err);
      }
    };
    fetchLevelData();
  }, []);

  const sixDimensions = [
    {
      title: "Skill",
      icon: Brush,
      color: "from-orange-500 to-amber-500",
      border: "border-orange-500/40",
      hoverBorder: "hover:border-orange-500",
      desc: "How confidently and consistently you can create quality Resin Art."
    },
    {
      title: "Creativity",
      icon: Palette,
      color: "from-purple-500 to-pink-500",
      border: "border-purple-500/40",
      hoverBorder: "hover:border-purple-500",
      desc: "How effectively you experiment, innovate and develop your own artistic expression."
    },
    {
      title: "Identity",
      icon: Crown,
      color: "from-cyan-500 to-blue-500",
      border: "border-cyan-500/40",
      hoverBorder: "hover:border-cyan-500",
      desc: "How clearly you develop your personal style, portfolio and recognition as an artist."
    },
    {
      title: "Business",
      icon: Briefcase,
      color: "from-emerald-500 to-teal-500",
      border: "border-emerald-500/40",
      hoverBorder: "hover:border-emerald-500",
      desc: "How effectively you turn your skill and creations into products, customers and opportunities."
    },
    {
      title: "Impact",
      icon: Globe,
      color: "from-rose-500 to-red-500",
      border: "border-rose-500/40",
      hoverBorder: "hover:border-rose-500",
      desc: "How your knowledge, creations and journey create value for customers and inspire others."
    },
    {
      title: "Personal Growth",
      icon: Sparkles,
      color: "from-amber-400 to-yellow-500",
      border: "border-amber-400/40",
      hoverBorder: "hover:border-amber-400",
      desc: "How much you grow in confidence, discipline, leadership and belief in yourself."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-orange-500 selection:text-slate-950 relative font-sans">
      {/* Dynamic Ambient Background Glowing Art Orbs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-orange-600/15 via-amber-600/10 to-transparent blur-[120px] rounded-full animate-pulse-glow" />
        <div className="absolute top-[25%] -left-40 w-[600px] h-[600px] bg-purple-600/10 blur-[140px] rounded-full animate-pulse-glow" />
        <div className="absolute top-[60%] -right-40 w-[600px] h-[600px] bg-orange-600/10 blur-[140px] rounded-full animate-pulse-glow" />
      </div>

      {/* ─── NAVIGATION BAR (STICKY) ─── */}
      <nav className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-2xl border-b border-slate-800/80 shadow-lg shadow-black/10 transition-all">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <BrandLogo size="md" />

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
              className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-black rounded-xl text-sm transition-all shadow-lg shadow-orange-500/20 flex items-center gap-2 hover:scale-105"
            >
              Free Masterclass <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </nav>

      {/* ─── SECTION 1: HERO SECTION ─── */}
      <section className="relative pt-16 pb-16 px-6 z-10">
        <div className="max-w-5xl mx-auto text-center">

          {/* Luminous Top Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-bold uppercase tracking-wider mb-6 shadow-sm">
            <Award size={14} className="text-orange-500" />
            {/* <span>ISO 9001:2015 CERTIFIED ACADEMY • 54,000+ WOMEN TRANSFORMED</span> */}
          </div>

          {/* Hero Headline */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[1.15] mb-6 text-white">
            Turn Your Resin Art Passion Into{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-yellow-400">
              Skill, Identity &amp; Financial Freedom
            </span>
          </h1>

          {/* Hero Subtitle */}
          <p className="text-slate-300 text-lg md:text-xl max-w-3xl mx-auto mb-6 leading-relaxed">
            You already have the creativity. You already have the passion. What you need is the right path to turn that passion into something that gives you confidence, recognition, income and freedom.
          </p>

          <p className="text-orange-400 font-bold text-base md:text-lg mb-4">
            Learn Resin Art. Build Your Signature Style. Create Your Identity. Build Your Income.
          </p>

          {/* 4 Benefit Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 max-w-3xl mx-auto mb-6">
            <span className="px-3.5 py-1.5 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-bold flex items-center gap-1.5 shadow-sm">
              🎨 Learn Resin Art
            </span>
            <span className="px-3.5 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold flex items-center gap-1.5 shadow-sm">
              ✨ Signature Style
            </span>
            <span className="px-3.5 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold flex items-center gap-1.5 shadow-sm">
              👑 Create Identity
            </span>
            <span className="px-3.5 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center gap-1.5 shadow-sm">
              💰 Build Income
            </span>
          </div>

          <p className="text-slate-400 text-sm md:text-base max-w-2xl mx-auto mb-8 leading-relaxed">
            Join a community of women who are transforming their creativity into something much bigger than a hobby.
          </p>

          {/* Hero CTA & Trust Micro-bar */}
          <div className="flex flex-col items-center justify-center mb-14">
            <Link
              href="/webinar"
              className="px-10 py-4 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 hover:opacity-95 text-white font-black rounded-2xl text-lg transition-all shadow-2xl shadow-orange-500/30 flex items-center gap-2.5 hover:scale-105"
            >
              Start My Resin Journey <ArrowRight size={18} />
            </Link>

            <div className="flex items-center gap-3 mt-4 text-xs text-slate-400 font-semibold flex-wrap justify-center">
              <div className="flex items-center gap-1 text-amber-400">
                <Star size={13} className="fill-amber-400" />
                <Star size={13} className="fill-amber-400" />
                <Star size={13} className="fill-amber-400" />
                <Star size={13} className="fill-amber-400" />
                <Star size={13} className="fill-amber-400" />
                <span className="text-white font-bold ml-1">4.9/5</span>
              </div>
              <span>•</span>
              <span>2,400+ Verified Student Reviews</span>
              <span>•</span>
              <span className="text-emerald-400 font-bold">100% Free Masterclass</span>
            </div>
          </div>

          {/* ─── HERO VIDEO SHOWCASE (Real Masterclass Video) ─── */}
          <HeroVideoPlayer />

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
              <AlertCircle className="text-amber-400 animate-pulse" size={22} />
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
                <div
                  key={idx}
                  className="flex items-start gap-3 bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4 hover:border-red-500/40 hover:-translate-y-1 transition-all duration-300 shadow-md"
                >
                  <div className="w-6 h-6 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 text-xs font-bold shrink-0 mt-0.5">
                    ?
                  </div>
                  <p className="text-sm text-slate-300 leading-snug">{item}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-transparent border-l-4 border-orange-500 rounded-r-2xl p-6 shadow-inner">
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
                { title: "Passion", desc: "Creative spark", icon: Flame, color: "text-orange-400", hoverColor: "hover:border-orange-500/60" },
                { title: "Skill", desc: "Technique mastery", icon: Brush, color: "text-amber-400", hoverColor: "hover:border-amber-500/60" },
                { title: "Signature", desc: "Unique style", icon: Sparkles, color: "text-yellow-400", hoverColor: "hover:border-yellow-500/60" },
                { title: "Portfolio", desc: "Showcase proof", icon: Layers, color: "text-emerald-400", hoverColor: "hover:border-emerald-500/60" },
                { title: "Income", desc: "Monetization", icon: DollarSign, color: "text-cyan-400", hoverColor: "hover:border-cyan-500/60" },
                { title: "Freedom", desc: "Self-identity", icon: Trophy, color: "text-purple-400", hoverColor: "hover:border-purple-500/60" }
              ].map((step, idx) => (
                <div
                  key={idx}
                  className={`bg-slate-950 border border-slate-800 rounded-2xl p-4 text-center group ${step.hoverColor} hover:-translate-y-1.5 transition-all duration-300 shadow-md`}
                >
                  <div className={`w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center mx-auto mb-2 ${step.color} group-hover:scale-110 transition-transform duration-300`}>
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
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:-translate-y-1 hover:border-slate-700 transition-all duration-300 shadow-lg">
              <div className="text-orange-400 font-black text-lg mb-1">✕ Not Needed</div>
              <p className="text-sm text-slate-300">You don't need to be an expert to begin.</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:-translate-y-1 hover:border-slate-700 transition-all duration-300 shadow-lg">
              <div className="text-orange-400 font-black text-lg mb-1">✕ Not Needed</div>
              <p className="text-sm text-slate-300">You don't need an expensive or perfect setup.</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:-translate-y-1 hover:border-slate-700 transition-all duration-300 shadow-lg">
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
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-8 hover:border-orange-500/50 hover:-translate-y-2 hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-300 shadow-xl flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400 font-black text-xl mb-6 group-hover:scale-110 group-hover:bg-orange-500 group-hover:text-slate-950 transition-all duration-300">
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
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-8 hover:border-amber-500/50 hover:-translate-y-2 hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-300 shadow-xl flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-black text-xl mb-6 group-hover:scale-110 group-hover:bg-amber-500 group-hover:text-slate-950 transition-all duration-300">
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
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-8 hover:border-yellow-500/50 hover:-translate-y-2 hover:shadow-2xl hover:shadow-yellow-500/10 transition-all duration-300 shadow-xl flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center text-yellow-400 font-black text-xl mb-6 group-hover:scale-110 group-hover:bg-yellow-500 group-hover:text-slate-950 transition-all duration-300">
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

          <div className="text-center bg-slate-900/60 border border-slate-800 rounded-2xl p-6 max-w-2xl mx-auto shadow-lg">
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
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-7 flex flex-col justify-between hover:border-orange-500/60 hover:-translate-y-2 hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-300 shadow-xl group">
              <div>
                <span className="text-xs font-black text-orange-400 uppercase tracking-widest block mb-2">Stage 01</span>
                <h3 className="text-lg font-black text-white mb-3 group-hover:text-orange-300 transition-colors">Skill → Creation</h3>
                <p className="text-slate-300 text-xs leading-relaxed">
                  Learn the right techniques and develop the confidence to create professional-grade resin art from zero.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-7 flex flex-col justify-between hover:border-amber-500/60 hover:-translate-y-2 hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-300 shadow-xl group">
              <div>
                <span className="text-xs font-black text-amber-400 uppercase tracking-widest block mb-2">Stage 02</span>
                <h3 className="text-lg font-black text-white mb-3 group-hover:text-amber-300 transition-colors">Creation → Signature</h3>
                <p className="text-slate-300 text-xs leading-relaxed">
                  Discover your creative strengths and develop a distinct style that feels uniquely and unmistakably yours.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-7 flex flex-col justify-between hover:border-yellow-500/60 hover:-translate-y-2 hover:shadow-2xl hover:shadow-yellow-500/10 transition-all duration-300 shadow-xl group">
              <div>
                <span className="text-xs font-black text-yellow-400 uppercase tracking-widest block mb-2">Stage 03</span>
                <h3 className="text-lg font-black text-white mb-3 group-hover:text-yellow-300 transition-colors">Signature → Portfolio</h3>
                <p className="text-slate-300 text-xs leading-relaxed">
                  Build a collection of creations that represents your skills and helps you showcase your work with total confidence.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-7 flex flex-col justify-between hover:border-emerald-500/60 hover:-translate-y-2 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-300 shadow-xl group">
              <div>
                <span className="text-xs font-black text-emerald-400 uppercase tracking-widest block mb-2">Stage 04</span>
                <h3 className="text-lg font-black text-white mb-3 group-hover:text-emerald-300 transition-colors">Portfolio → Income</h3>
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
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-8 hover:border-orange-500/50 hover:-translate-y-2 hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-300 shadow-xl group">
              <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400 mb-6 group-hover:scale-110 group-hover:bg-orange-500 group-hover:text-slate-950 transition-all duration-300">
                <Brush size={24} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-orange-300 transition-colors">Master Resin Art Techniques</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Understand the fundamentals and advanced techniques required to create beautiful, professional-quality resin artwork—from chemistry and bubble-free mixing to ocean lacing and geode crystal inlays.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-8 hover:border-purple-500/50 hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300 shadow-xl group">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-6 group-hover:scale-110 group-hover:bg-purple-500 group-hover:text-slate-950 transition-all duration-300">
                <Palette size={24} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-purple-300 transition-colors">Develop Your Signature Style</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Move beyond copying others and discover the colours, techniques, compositions and products that make your work instantly recognizable in the market.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-8 hover:border-cyan-500/50 hover:-translate-y-2 hover:shadow-2xl hover:shadow-cyan-500/10 transition-all duration-300 shadow-xl group">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-6 group-hover:scale-110 group-hover:bg-cyan-500 group-hover:text-slate-950 transition-all duration-300">
                <Layers size={24} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-cyan-300 transition-colors">Build a Portfolio You Are Proud Of</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Create meaningful, commercial-grade projects that demonstrate your ability and give you something tangible to showcase to clients, interior designers, and collectors.
              </p>
            </div>

            {/* Pillar 4 */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-8 hover:border-emerald-500/50 hover:-translate-y-2 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-300 shadow-xl group">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-6 group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-all duration-300">
                <TrendingUp size={24} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-emerald-300 transition-colors">Learn How To Monetize Your Skill</h3>
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
                className={`bg-slate-900/90 border ${dim.border} ${dim.hoverBorder} rounded-3xl p-7 flex flex-col justify-between hover:scale-[1.03] hover:-translate-y-1.5 transition-all duration-300 shadow-xl group`}
              >
                <div>
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${dim.color} flex items-center justify-center text-slate-950 font-black mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
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
                  <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 hover:border-orange-500/50 hover:-translate-y-1 transition-all duration-300 px-4 py-3 rounded-2xl text-xs md:text-sm font-bold text-white shadow-md">
                    <step.icon size={16} className="text-orange-400" />
                    {step.title}
                  </div>
                  {idx < 5 && (
                    <ChevronRight size={18} className="text-slate-600 hidden sm:block animate-pulse" />
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
      <section id="artothon" className="py-24 px-6 bg-slate-900/40 border-y border-slate-800/80 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-br from-orange-950/40 via-slate-900 to-slate-950 border-2 border-orange-500/40 rounded-3xl p-8 md:p-14 shadow-2xl hover:border-orange-500/60 transition-colors">
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

              <div className="bg-slate-950 border border-slate-800 hover:border-orange-500/50 rounded-2xl p-6 text-center shrink-0 w-full md:w-64 space-y-3 shadow-xl hover:-translate-y-1.5 transition-all duration-300">
                <Flame size={40} className="text-orange-500 fill-orange-500/20 mx-auto animate-bounce" />
                <p className="text-2xl font-black text-white">90-Day</p>
                <p className="text-xs text-orange-400 font-bold uppercase tracking-wider">Creation Sprint</p>
                <Link
                  href="/webinar"
                  className="block w-full py-3 bg-orange-500 hover:bg-orange-600 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider transition-all shadow-lg shadow-orange-500/20 hover:scale-105"
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
              <div
                key={idx}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-center hover:border-orange-500/50 hover:-translate-y-1.5 transition-all duration-300 shadow-lg group"
              >
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 group-hover:bg-orange-500 group-hover:text-slate-950 transition-all duration-300">
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
                className="w-[280px] md:w-[320px] bg-slate-900 border border-slate-800/80 rounded-3xl p-3 shrink-0 hover:border-orange-500/60 transition-all duration-300 shadow-2xl group overflow-hidden"
              >
                {/* Real Artwork Photo Only */}
                <div className="h-64 rounded-2xl relative overflow-hidden bg-slate-950">
                  <img
                    src={art.image}
                    alt="Student Resin Art"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
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
                className="w-[280px] md:w-[320px] bg-slate-900 border border-slate-800/80 rounded-3xl p-3 shrink-0 hover:border-cyan-500/60 transition-all duration-300 shadow-2xl group overflow-hidden"
              >
                {/* Real Artwork Photo Only */}
                <div className="h-64 rounded-2xl relative overflow-hidden bg-slate-950">
                  <img
                    src={art.image}
                    alt="Student Resin Art"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
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
              54K+ Students Taught. 8K+ Orders Completed. 5★ Google Rating.
            </h2>
            <p className="text-slate-300 text-base md:text-lg leading-relaxed">
              Thousands of learners have already trusted Ravishing Art to help them explore, learn and grow through Resin Art. From beginners taking their first step to creators building their own identity and income, every journey is different. But every journey begins with one decision: to start.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {VERIFIED_REVIEWS.map((rev, idx) => (
              <div
                key={idx}
                className="bg-slate-900 border border-slate-800 rounded-3xl p-7 flex flex-col justify-between hover:border-orange-500/50 hover:-translate-y-2 hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-300 shadow-xl group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex gap-1">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} size={14} className="text-amber-400 fill-amber-400 group-hover:scale-110 transition-transform" />
                      ))}
                    </div>
                    <span className="text-[10px] text-slate-500 font-medium">Google Play · {rev.date}</span>
                  </div>
                  <p className="text-slate-200 text-sm leading-relaxed mb-6 italic">
                    "{rev.comment}"
                  </p>
                </div>
                <div className="flex items-center gap-3 pt-4 border-t border-slate-800">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-tr ${rev.avatarBg} flex items-center justify-center font-black text-slate-950 text-sm shrink-0 shadow-md group-hover:scale-110 transition-transform`}>
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
            <div className="inline-flex items-center gap-4 bg-slate-900/80 border border-slate-800 hover:border-orange-500/40 rounded-2xl px-6 py-4 shadow-xl hover:scale-105 transition-transform duration-300">
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
                  <Sparkles size={13} className="animate-pulse" /> Meet Your Mentor &amp; Coach
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
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-xl group hover:border-orange-500/50 hover:-translate-y-1.5 transition-all duration-300">
              <div className="h-64 overflow-hidden relative">
                <img
                  src="/images/mentor/hall-of-fame-award.jpg"
                  alt="Vrajangna Patel Hall of Fame Award"
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-out"
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

            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-xl group hover:border-cyan-500/50 hover:-translate-y-1.5 transition-all duration-300">
              <div className="h-64 overflow-hidden relative">
                <img
                  src="/images/mentor/diamond-award.jpg"
                  alt="Vrajangna Patel Diamond Awards"
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-out"
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

            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-xl group hover:border-purple-500/50 hover:-translate-y-1.5 transition-all duration-300">
              <div className="h-64 overflow-hidden relative">
                <img
                  src="/images/mentor/author-feature.jpg"
                  alt="Vrajangna Patel Published Author"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            {[
              {
                code: "L0",
                badgeTag: "LEVEL 0",
                defaultName: "Fast Track",
                defaultDesc: "Begin your Resin Art journey, understand the fundamentals and create your first beautiful pieces with confidence.",
                defaultHighlights: ["FastTrack Starter Toolkit", "Basic Epoxy Chemistry", "First 3 Practical Pours"],
                accentColor: "emerald",
                buttonText: "Explore Fast Track",
                buttonHref: "/webinar",
                isPopular: false,
              },
              {
                code: "L1",
                badgeTag: "LEVEL 1",
                defaultName: "Silver Membership",
                defaultDesc: "Go deeper into techniques, creativity, portfolio building and the skills required to take your art seriously.",
                defaultHighlights: ["Coasters, Fridge Magnets, Keychains", "Marbling & Evil Eye Techniques", "Ocean Lacing & Lotus Pond"],
                accentColor: "amber",
                buttonText: "Explore Level 1",
                buttonHref: "/register",
                isPopular: false,
              },
              {
                code: "L2",
                badgeTag: "LEVEL 2",
                defaultName: "Gold Membership",
                defaultDesc: "Develop advanced skills, strengthen your personal brand, understand business and build a sustainable path around your creativity.",
                defaultHighlights: ["Geode Art & Vein Effects", "Tree of Life Clocks", "3D Waves & Client Acquisition"],
                accentColor: "orange",
                buttonText: "Explore Level 2",
                buttonHref: "/webinar",
                isPopular: false,
              },
              {
                code: "L3",
                badgeTag: "LEVEL 3",
                defaultName: "Renaissance Certification",
                defaultDesc: "Take your skills, portfolio, business knowledge and personal growth to the highest level through structured milestones and certification.",
                defaultHighlights: ["3D Photo Resin Art", "Wood & Resin River Tables", "Floral Preservation & Mantras"],
                accentColor: "cyan",
                buttonText: "Apply for Certification",
                buttonHref: "/webinar",
                isPopular: true,
              },
            ].map((card, idx) => {
              const dbLevel = levelTiers.find((l) => (l.code || "").toUpperCase() === card.code);
              const dynamicCourses = levelCourses.filter(
                (c) => (c.levelCode || c.level || "").toUpperCase() === card.code
              );

              // Use exact db name or fallback
              const levelName = dbLevel?.name || card.defaultName;
              const levelDesc = dbLevel?.description || card.defaultDesc;

              // Extract course titles
              const allHighlights = dynamicCourses.length > 0
                ? dynamicCourses.map((c) => c.title.replace(/^\d+\.\s*/, ""))
                : card.defaultHighlights;

              const visibleHighlights = allHighlights.slice(0, 3);
              const remainingCount = allHighlights.length > 3 ? allHighlights.length - 3 : 0;

              const isMainL3 = card.isPopular || card.code === "L3";

              const cardBorderClass = isMainL3
                ? "border-2 border-cyan-500/80 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 shadow-2xl shadow-cyan-500/20 relative"
                : "bg-slate-900/90 border border-slate-800 shadow-xl hover:border-slate-700";

              const badgeClass = card.code === "L3"
                ? "bg-cyan-500/20 text-cyan-400 border-cyan-500/40"
                : card.code === "L2"
                  ? "bg-orange-500/20 text-orange-400 border-orange-500/40"
                  : card.code === "L1"
                    ? "bg-amber-500/20 text-amber-400 border-amber-500/40"
                    : "bg-emerald-500/20 text-emerald-400 border-emerald-500/40";

              const iconColor = card.code === "L3"
                ? "text-cyan-400"
                : card.code === "L2"
                  ? "text-orange-400"
                  : card.code === "L1"
                    ? "text-amber-400"
                    : "text-emerald-400";

              return (
                <div
                  key={idx}
                  className={`rounded-3xl p-6 md:p-7 flex flex-col justify-between hover:-translate-y-2 transition-all duration-300 ${cardBorderClass}`}
                >
                  {isMainL3 && (
                    <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 text-[10px] font-black uppercase tracking-wider px-3.5 py-1 rounded-full shadow-lg whitespace-nowrap">
                      ★ MAIN CERTIFICATION
                    </span>
                  )}

                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className={`text-[10px] font-black border px-2.5 py-1 rounded-full uppercase tracking-wider block ${badgeClass}`}>
                        {card.badgeTag}
                      </span>
                      <span className="text-xs font-black text-amber-400 font-mono">
                        {dbLevel?.price || (card.code === "L0" ? "₹499" : card.code === "L1" ? "₹4,999" : card.code === "L2" ? "₹19,999" : card.code === "L3" ? "₹59,999" : "Custom")}
                      </span>
                    </div>

                    <h3 className="text-lg md:text-xl font-bold text-white mb-2 leading-snug">
                      {levelName}
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed mb-5 min-h-[48px] line-clamp-3">
                      {levelDesc}
                    </p>

                    <div className="space-y-2 border-t border-slate-800/80 pt-4">
                      {visibleHighlights.map((h, hIdx) => (
                        <div key={hIdx} className="flex items-start gap-2 text-xs text-slate-300">
                          <Check size={14} className={`${iconColor} shrink-0 mt-0.5`} />
                          <span className="truncate">{h}</span>
                        </div>
                      ))}
                      {remainingCount > 0 && (
                        <div className="pt-1">
                          <span className="text-[10px] font-bold text-slate-400 bg-slate-800/60 border border-slate-700/60 px-2.5 py-1 rounded-lg inline-block">
                            + {remainingCount} More Modules Included
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <Link
                    href={card.buttonHref}
                    className={`mt-6 w-full py-3 font-bold rounded-xl text-xs text-center block transition-all shadow-md ${isMainL3
                      ? "bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-black shadow-cyan-500/20 hover:scale-105"
                      : "bg-slate-800 hover:bg-slate-700 text-white"
                      }`}
                  >
                    {card.buttonText}
                  </Link>
                </div>
              );
            })}
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

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-2xl mx-auto text-left mb-10 space-y-4 shadow-2xl">
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
            <Sparkles size={22} className="animate-pulse" />
            Join The Free Masterclass
          </Link>
        </div>
      </section>

      {/* ─── SECTION 17: FINAL EMOTIONAL CTA ─── */}
      <section className="py-24 px-6 relative overflow-hidden z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-orange-600/10 via-amber-600/5 to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-orange-500/40 animate-float">
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
              <div className="mb-2">
                <BrandLogo size="md" />
              </div>
              <h3 className="text-xl font-bold text-white">Create. Connect. Grow. Become Ravishing.</h3>
              <p className="text-sm text-slate-400 max-w-lg leading-relaxed">
                Ravishing Art Hub is a community for ambitious women who want to transform their creativity into skill, identity, impact and financial freedom. Your creativity deserves a place in your life. And your journey starts here.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/webinar"
                className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-slate-950 font-bold rounded-xl text-sm transition-all hover:scale-105"
              >
                Join Free Masterclass
              </Link>
              <Link
                href="/login"
                className="px-6 py-3 bg-slate-900 border border-slate-800 hover:border-slate-700 text-white font-bold rounded-xl text-sm transition-all hover:scale-105"
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
