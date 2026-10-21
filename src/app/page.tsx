"use client";

import LandingHero from "@/components/landing/LandingHero";
// import SiteFooter from "@/components/layout/SiteFooter";
import SiteNavbar from "@/components/layout/SiteNavbar";
import AlreadyHaveSec from "@/components/landing/alreadyhavesec";
import ArtOThonSec from "@/components/landing/artothonsec";
import CurriculumSec from "@/components/landing/curriculumsec";
import DimensionsSec from "@/components/landing/dimensionssec";
import FinalCtaSec from "@/components/landing/finalctasec";
import JourneySec from "@/components/landing/journeysec";
import MasterclassSec from "@/components/landing/masterclasssec";
import PathSec from "@/components/landing/pathsec";
import RealChallangeSec from "@/components/landing/realchallangesc";
import SisterhoodSec from "@/components/landing/sisterhoodsec";
import SoundLikeSec from "@/components/landing/soundlikesec";
import StategicMindsetSec from "@/components/landing/stategicmindsetsec";
import TestimoniaSec from "@/components/landing/testimoniasec";
import VisibleGrowthSec from "@/components/landing/VisibleGrowthSec";
import RealTransformationsSec from "@/components/landing/RealTransformationsSec";
import MentorAboutSec from "@/components/landing/MentorAboutSec";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { API_BASE_URL } from "@/config/api";
import { trackingService } from "@/services/trackingService";
import {
  ArrowRight,
  Flame,
  Trophy,
  Star,
  Users,
  Sparkles,
  Heart,
  Brush,
  Clock,
  Gem,
  CheckCircle2,
  PlayCircle,
  HelpCircle,
  Award,
  BookOpen,
  ShieldCheck,
  Smile,
  Zap,
  ChevronRight,
  MessageCircle,
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

    try {
      trackingService.trackViewContent({
        name: "Art Hub Academy Homepage",
        category: "Academy Portal",
      });
    } catch (_) { }
  }, []);

  return (
    <div className="landing-page relative min-h-screen bg-white text-stone-950 selection:bg-orange-500 selection:text-white">
      <SiteNavbar />

      {/* ─── SECTION 1: HERO SECTION ─── */}
      <LandingHero artworks={ARTWORKS_ROW_1} />

      {/*
        Old hero section, kept commented.
        <section className="relative pt-16 pb-16 px-6 z-10">
          <div className="max-w-5xl mx-auto text-center">
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[1.15] mb-6 text-white">
              Turn Your Resin Art Passion Into{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-yellow-400">
                Skill, Identity &amp; Financial Freedom
              </span>
            </h1>
            <p className="text-slate-300 text-lg md:text-xl max-w-3xl mx-auto mb-6 leading-relaxed">
              You already have the creativity. You already have the passion. What you need is the right path to turn that passion into something that gives you confidence, recognition, income and freedom.
            </p>
            <p className="text-orange-400 font-bold text-base md:text-lg mb-4">
              Learn Resin Art. Build Your Signature Style. Create Your Identity. Build Your Income.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2.5 max-w-3xl mx-auto mb-6">
              <span className="px-3.5 py-1.5 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-bold flex items-center gap-1.5 shadow-sm">🎨 Learn Resin Art</span>
              <span className="px-3.5 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold flex items-center gap-1.5 shadow-sm">✨ Signature Style</span>
              <span className="px-3.5 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold flex items-center gap-1.5 shadow-sm">👑 Create Identity</span>
              <span className="px-3.5 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center gap-1.5 shadow-sm">💰 Build Income</span>
            </div>
            <p className="text-slate-400 text-sm md:text-base max-w-2xl mx-auto mb-8 leading-relaxed">
              Join a community of women who are transforming their creativity into something much bigger than a hobby.
            </p>
            <div className="flex flex-col items-center justify-center mb-14">
              <Link href="/webinar" className="px-10 py-4 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 hover:opacity-95 text-white font-black rounded-2xl text-lg transition-all shadow-2xl shadow-orange-500/30 flex items-center gap-2.5 hover:scale-105">
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
            <HeroVideoPlayer />
          </div>
        </section>
      */}

      {/* ─── SECTION 2: THE REAL PROBLEM ─── */}
      <RealChallangeSec />

      {/* ─── SECTION 3: THE REFRAME ─── */}
      <StategicMindsetSec />

      {/* ─── SECTION 4: DOES THIS SOUND LIKE YOU? ─── */}
      <SoundLikeSec />

      <MentorAboutSec />

      {/*
      {/* ─── SECTION 5: ABOUT VRAJANGNA & PORTFOLIO ─── * /}
      <section id="mentor" className="py-24 px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Main 2-Column Split: Sticky Left Mentor Card + Scrolling Right Portfolio & Bio * /}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

            {/* ── LEFT COLUMN: STICKY MENTOR PROFILE CARD ── * /}
            <div className="lg:col-span-5 lg:sticky lg:top-28 space-y-5 self-start">
              <div className="mentor-sticky-card bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl backdrop-blur-xl relative overflow-hidden group">
                <div className="absolute -top-20 -left-20 w-48 h-48 bg-orange-500/15 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

                {/* Mentor Photo Container * /}
                <div className="relative aspect-[4/4.5] w-full rounded-2xl overflow-hidden border-2 border-orange-500/40 shadow-2xl shadow-orange-500/20 mb-5 group">
                  <img
                    src="/images/mentor/vrajangna-portrait.jpg"
                    alt="Vrajangna Patel - Resin Art & Business Coach"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />

                  {/* Floating Identity Chip on Portrait (Dark glass overlay with guaranteed light text) * /}
                  <div className="photo-overlay-chip absolute bottom-3 left-3 right-3 bg-slate-950/90 backdrop-blur-md border border-white/20 rounded-xl px-3.5 py-2.5 flex items-center justify-between shadow-lg">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-base font-black text-white">Vrajangna Patel</h3>
                        <ShieldCheck size={14} className="text-orange-400" />
                      </div>
                      <p className="mentor-subtitle text-[11px] text-orange-400 font-semibold tracking-wide">
                        Founder &amp; Resin Art Business Coach
                      </p>
                    </div>
                    <span className="mentor-chip-tag text-[10px] font-black uppercase tracking-wider bg-orange-500/20 text-orange-300 border border-orange-500/40 px-2 py-0.5 rounded-full">
                      ⭐ Mentor
                    </span>
                  </div>
                </div>

                {/* Quick Authority Badges / Stats * /}
                <div className="grid grid-cols-3 gap-2 text-center mb-5">
                  <div className="mentor-stat-pill bg-slate-800/70 border border-slate-700/60 rounded-xl p-2.5">
                    <p className="text-base font-black text-orange-400">54K+</p>
                    <p className="stat-label text-[10px] font-bold text-slate-400 uppercase tracking-tight">Students</p>
                  </div>
                  <div className="mentor-stat-pill bg-slate-800/70 border border-slate-700/60 rounded-xl p-2.5">
                    <p className="text-base font-black text-cyan-400">8K+</p>
                    <p className="stat-label text-[10px] font-bold text-slate-400 uppercase tracking-tight">Orders</p>
                  </div>
                  <div className="mentor-stat-pill bg-slate-800/70 border border-slate-700/60 rounded-xl p-2.5">
                    <p className="text-base font-black text-amber-400">5.0 ★</p>
                    <p className="stat-label text-[10px] font-bold text-slate-400 uppercase tracking-tight">Google</p>
                  </div>
                </div>

                {/* Mentor Quote * /}
                <blockquote className="mentor-quote-box border-l-4 border-orange-500 rounded-r-xl p-4 mb-5 bg-slate-950/50">
                  <p className="quote-text text-xs sm:text-[13px] text-slate-300 italic leading-relaxed">
                    "Every woman deserves the opportunity to create an identity beyond the roles she plays for everyone else."
                  </p>
                  <cite className="quote-cite block text-[11px] text-orange-400 font-bold mt-1.5 not-italic">
                    — Vrajangna Patel, Lead Mentor
                  </cite>
                </blockquote>

                {/* Sticky CTA Button * /}
                <Link
                  href="/webinar"
                  className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider py-3.5 px-4 rounded-xl shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 group transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Sparkles size={14} className="text-slate-950" />
                  <span>Join Live Masterclass</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* ── RIGHT COLUMN: SCROLLING PORTFOLIO & RECOGNITION ── * /}
            <div className="lg:col-span-7 space-y-8">

              {/* Bio & Vision Story * /}
              <div className="mentor-bio-card bg-slate-900/90 border border-slate-800 rounded-3xl p-7 md:p-9 shadow-xl space-y-4">
                <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-full">
                  <Sparkles size={13} className="animate-pulse" /> Proven Track Record &amp; Coaching
                </div>

                <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-white leading-tight">
                  Meet Vrajangna — Your Resin Art &amp; Business Coach
                </h2>

                <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                  I'm Vrajangna Patel, founder of Ravishing Art Hub and a dedicated Resin Art Business Coach. Over the past 6+ years, I've transformed my passion for resin craft into an award-winning creative enterprise — and guided over <strong className="text-white font-bold">54,000+ creators</strong> across India and abroad.
                </p>

                <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                  My goal isn't just to teach you how to make Resin Art. My goal is to help you believe that your creativity can become something meaningful, valuable and truly yours — whether you want to start a side-income or build a recognized premium brand.
                </p>

                {/* 4 Feature Checkmarks * /}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="mentor-check-item flex items-center gap-2.5 text-xs sm:text-sm text-slate-200">
                    <CheckCircle2 size={16} className="text-orange-400 flex-shrink-0" />
                    <span>6+ Years Professional Experience</span>
                  </div>
                  <div className="mentor-check-item flex items-center gap-2.5 text-xs sm:text-sm text-slate-200">
                    <CheckCircle2 size={16} className="text-orange-400 flex-shrink-0" />
                    <span>Nationally Recognized Art Coach</span>
                  </div>
                  <div className="mentor-check-item flex items-center gap-2.5 text-xs sm:text-sm text-slate-200">
                    <CheckCircle2 size={16} className="text-orange-400 flex-shrink-0" />
                    <span>Step-by-Step Business Frameworks</span>
                  </div>
                  <div className="mentor-check-item flex items-center gap-2.5 text-xs sm:text-sm text-slate-200">
                    <CheckCircle2 size={16} className="text-orange-400 flex-shrink-0" />
                    <span>Hands-On Lifetime Community</span>
                  </div>
                </div>
              </div>

              {/* Portfolio Accolade Cards Stack * /}
              <div className="space-y-6">

                {/* 1. Hall of Fame Award * /}
                <div className="mentor-accolade-card bg-slate-900/90 border border-slate-800 hover:border-orange-500/50 rounded-3xl overflow-hidden shadow-xl group transition-all duration-300">
                  <div className="h-72 sm:h-80 overflow-hidden relative">
                    <img
                      src="/images/mentor/hall-of-fame-award.jpg"
                      alt="Vrajangna Patel Hall of Fame Award"
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                    <span className="absolute top-4 left-4 bg-orange-500 text-slate-950 text-xs font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full shadow-xl flex items-center gap-1.5">
                      <Trophy size={13} /> Hall of Fame Award
                    </span>
                  </div>
                  <div className="p-6 sm:p-7 space-y-2">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <h3 className="font-black text-white text-lg sm:text-xl">Hall of Fame Felicitation 2022–23</h3>
                      <span className="text-xs font-bold text-orange-400 bg-orange-500/10 border border-orange-500/30 px-2.5 py-1 rounded-lg">Freedom Retreat</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      Awarded national stage recognition by India's leading coach Siddharth Rajsekar at Freedom Retreat for establishing one of the country's most vibrant and student-centric creative academies.
                    </p>
                  </div>
                </div>

                {/* 2. Diamond Club Award * /}
                <div className="mentor-accolade-card bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 rounded-3xl overflow-hidden shadow-xl group transition-all duration-300">
                  <div className="h-72 sm:h-80 overflow-hidden relative">
                    <img
                      src="/images/mentor/diamond-award.jpg"
                      alt="Vrajangna Patel Diamond Awards"
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                    <span className="absolute top-4 left-4 bg-cyan-400 text-slate-950 text-xs font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full shadow-xl flex items-center gap-1.5">
                      <Gem size={13} /> Diamond Club Felicitation
                    </span>
                  </div>
                  <div className="p-6 sm:p-7 space-y-2">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <h3 className="font-black text-white text-lg sm:text-xl">Diamond Club Top Mentor Award</h3>
                      <span className="text-xs font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 px-2.5 py-1 rounded-lg">Elite Recognition</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      Felicitated with the Diamond status for impacting thousands of households by teaching high-margin resin craft, floral preservation, and order fulfillment systems.
                    </p>
                  </div>
                </div>

                {/* 3. Published Author Feature * /}
                <div className="mentor-accolade-card bg-slate-900/90 border border-slate-800 hover:border-purple-500/50 rounded-3xl overflow-hidden shadow-xl group transition-all duration-300">
                  <div className="h-72 sm:h-80 overflow-hidden relative">
                    <img
                      src="/images/mentor/author-feature.jpg"
                      alt="Vrajangna Patel Published Author"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                    <span className="absolute top-4 left-4 bg-purple-400 text-slate-950 text-xs font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full shadow-xl flex items-center gap-1.5">
                      <BookOpen size={13} /> Published Author
                    </span>
                  </div>
                  <div className="p-6 sm:p-7 space-y-2">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <h3 className="font-black text-white text-lg sm:text-xl">Authored in "I Can Coach" Book</h3>
                      <span className="text-xs font-bold text-purple-400 bg-purple-500/10 border border-purple-500/30 px-2.5 py-1 rounded-lg">Published Work</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      Featured alongside top educators nationwide, detailing her transformation from crafting at a small kitchen table to operating a premier art academy and mentoring 54,000+ creators.
                    </p>
                  </div>
                </div>

                {/* 4. Hands-on Mentorship & Live Workshops * /}
                <div className="mentor-accolade-card bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 rounded-3xl overflow-hidden shadow-xl group transition-all duration-300">
                  <div className="h-72 sm:h-80 overflow-hidden relative">
                    <img
                      src="/images/mentor/live-workshop.jpg"
                      alt="Vrajangna Patel Live Workshop Mentorship"
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                    <span className="absolute top-4 left-4 bg-emerald-400 text-slate-950 text-xs font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full shadow-xl flex items-center gap-1.5">
                      <Users size={13} /> Live Interactive Coaching
                    </span>
                  </div>
                  <div className="p-6 sm:p-7 space-y-2">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <h3 className="font-black text-white text-lg sm:text-xl">Weekly Live Sessions &amp; Personal Feedback</h3>
                      <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-lg">Hands-on Support</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      Every student receives real-time guidance, artwork critique, formula troubleshooting, and client pricing blueprints directly in our interactive live workshops and community calls.
                    </p>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      */}

      {/* ─── SECTION 6: SOCIAL PROOF ─── */}
      <TestimoniaSec />

      {/* ─── SECTION 7: VISIBLE GROWTH ─── */}
      <VisibleGrowthSec />

      {/*
        Old visible growth section, kept commented.
        <section className="py-24 px-6 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <span className="text-orange-400 text-xs font-black uppercase tracking-widest block mb-2">Gamified Progress Tracking</span>
            <h2 className="text-3xl md:text-5xl font-black text-white mb-6">
              Your Growth Should Be Visible.
            </h2>
            <p className="text-slate-300 text-base md:text-lg max-w-3xl mx-auto mb-12 leading-relaxed">
              Every creation, challenge, milestone and achievement should tell a story of how far you've come. Instead of wondering whether you're progressing, you'll have tangible milestones that help you see, measure and celebrate your growth.
            </p>
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 md:p-10 shadow-2xl">
              <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4">
                <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 px-4 py-3 rounded-2xl text-xs md:text-sm font-bold text-white shadow-md">Learn</div>
                <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 px-4 py-3 rounded-2xl text-xs md:text-sm font-bold text-white shadow-md">Create</div>
                <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 px-4 py-3 rounded-2xl text-xs md:text-sm font-bold text-white shadow-md">Complete</div>
                <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 px-4 py-3 rounded-2xl text-xs md:text-sm font-bold text-white shadow-md">Earn Points</div>
                <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 px-4 py-3 rounded-2xl text-xs md:text-sm font-bold text-white shadow-md">Unlock Milestones</div>
                <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 px-4 py-3 rounded-2xl text-xs md:text-sm font-bold text-white shadow-md">Earn Recognition</div>
              </div>
              <p className="text-orange-400 font-bold text-sm md:text-base mt-8">
                Your journey becomes something you can see, track and be proud of.
              </p>
            </div>
          </div>
        </section>
      */}

      {/* ─── SECTION 8: YOUR JOURNEY ─── */}
      <AlreadyHaveSec />

      {/* ─── SECTION 9: THE PATH ─── */}
      <PathSec />

      {/* ─── SECTION 10: WHAT YOU WILL LEARN ─── */}
      <CurriculumSec />

      {/* ─── SECTION 11: SIX DIMENSIONS OF SUCCESS ─── */}
      <DimensionsSec />

      {/* ─── SECTION 12: ART-O-THON ─── */}
      <ArtOThonSec sprintImages={ARTWORKS_ROW_1.map((art) => art.image)} />

      {/* ─── SECTION 13: COMMUNITY ─── */}
      <SisterhoodSec />

      {/* ─── SECTION 14: STUDENT TRANSFORMATION ─── */}
      <RealTransformationsSec rowOne={ARTWORKS_ROW_1} rowTwo={ARTWORKS_ROW_2} />

      {/*
        Previous Real Transformations UI, kept commented.
        < section className="py-20 overflow-hidden relative border-y border-slate-800/80 bg-slate-950/60 z-10" >
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

          Marquee Row 1
          <div className="relative mb-6">
            <div className="animate-marquee-left gap-6">
              {[...ARTWORKS_ROW_1, ...ARTWORKS_ROW_1].map((art, idx) => (
                <div
                  key={`r1-${idx}`}
                  className="w-[280px] md:w-[320px] bg-slate-900 border border-slate-800/80 rounded-3xl p-3 shrink-0 hover:border-orange-500/60 transition-all duration-300 shadow-2xl group overflow-hidden"
                >
                  Real Artwork Photo Only
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

          Marquee Row 2
          <div className="relative">
            <div className="animate-marquee-right gap-6">
              {[...ARTWORKS_ROW_2, ...ARTWORKS_ROW_2].map((art, idx) => (
                <div
                  key={`r2-${idx}`}
                  className="w-[280px] md:w-[320px] bg-slate-900 border border-slate-800/80 rounded-3xl p-3 shrink-0 hover:border-cyan-500/60 transition-all duration-300 shadow-2xl group overflow-hidden"
                >
                  Real Artwork Photo Only
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
        </section >
      */}

      {/* ─── SECTION 15: YOUR RAVISHING JOURNEY (Membership Tiers) ─── */}
      <JourneySec levelTiers={levelTiers} levelCourses={levelCourses} />

      {/* ─── SECTION 16: FREE MASTERCLASS ─── */}
      <MasterclassSec />

      {/* ─── SECTION 17: FINAL EMOTIONAL CTA ─── */}
      <FinalCtaSec />

      {/* <SiteFooter /> */}
    </div>
  );
}
