"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { StudentNav } from "@/components/layout/StudentNav";
import {
  Sparkles,
  Calendar,
  Clock,
  Video,
  MessageCircle,
  ExternalLink,
  CheckCircle2,
  PlayCircle,
  Flame,
  Users,
  ShieldCheck,
  Zap,
  ArrowRight,
  Gift,
  Award
} from "lucide-react";
import Link from "next/link";
import { API_BASE_URL } from "@/config/api";
import { TierPurchaseModal } from "@/components/membership/TierPurchaseModal";

export default function StudentWebinarPage() {
  const { user, token, logout } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [webinarEvent, setWebinarEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [purchaseModal, setPurchaseModal] = useState(false);

  useEffect(() => {
    if (!token) return;

    // Fetch student profile
    fetch(`${API_BASE_URL}/dashboard/student`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => setStats(data))
      .catch((e) => console.error(e));

    // Fetch active webinar details
    fetch(`${API_BASE_URL}/webinar/next`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.data) {
          setWebinarEvent(data.data);
        }
      })
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, [token]);

  const scheduledDate = webinarEvent?.scheduledAt ? new Date(webinarEvent.scheduledAt) : new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);
  const whatsappUrl = webinarEvent?.whatsappGroupUrl || "https://chat.whatsapp.com/sample-art-webinar-vip";
  const zoomUrl = webinarEvent?.zoomJoinUrl || "https://zoom.us/j/sample-webinar-room";
  const prepVideoUrl = webinarEvent?.prepVideoUrl || "https://www.youtube.com/watch?v=dQw4w9WgXcQ";

  function toYouTubeEmbed(url: string) {
    if (!url) return "";
    if (url.includes("youtube.com/watch")) {
      const id = new URL(url).searchParams.get("v");
      return id ? `https://www.youtube.com/embed/${id}?autoplay=1` : url;
    }
    if (url.includes("youtu.be/")) {
      const id = url.split("youtu.be/")[1]?.split("?")[0];
      return id ? `https://www.youtube.com/embed/${id}?autoplay=1` : url;
    }
    return url;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      <StudentNav
        user={stats}
        level={stats?.membershipLevel || "Fast Track (L0)"}
        points={stats?.points || 0}
        logout={logout}
        notifications={stats?.notifications}
      />

      <main className="max-w-6xl mx-auto px-4 md:px-8 py-8 md:py-12 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-orange-500/30 bg-orange-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-orange-400 mb-2">
              <Sparkles size={13} className="text-orange-400" /> Free Masterclass Registration
            </span>
            <h1 className="text-3xl md:text-5xl font-black text-white">
              Live Resin Art Webinar Hub
            </h1>
            <p className="text-slate-400 text-sm md:text-base mt-1">
              Your registered seat, live Zoom link, VIP WhatsApp community, and preparation workshop materials.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 px-4 py-2 rounded-2xl text-emerald-400 font-black text-xs self-start md:self-auto">
            <CheckCircle2 size={16} /> VIP Seat Confirmed
          </div>
        </div>

        {/* Hero Webinar Details Card */}
        <div className="rounded-3xl border-2 border-orange-500/40 bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 p-6 md:p-8 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 bg-orange-500/20 text-orange-300 text-xs font-bold px-3 py-1 rounded-full">
                <Flame size={14} className="text-orange-400 fill-orange-400" /> 90-Minute Live Interactive Workshop
              </div>
              <h2 className="text-2xl md:text-4xl font-black text-white leading-tight">
                {webinarEvent?.title || "Resin Mastery Masterclass — Live with Vrajangna Patel"}
              </h2>
              <p className="text-slate-300 text-xs md:text-sm leading-relaxed">
                Learn the 3 secret steps to build a profitable Resin Art career, eliminate micro-bubbles, create viral reels, and get direct live mentoring.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-slate-300">
                <div className="flex items-center gap-1.5 bg-slate-950/80 px-3 py-1.5 rounded-xl border border-slate-800">
                  <Calendar size={14} className="text-orange-400" />
                  <span>
                    {scheduledDate.toLocaleDateString("en-IN", {
                      weekday: "short",
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 bg-slate-950/80 px-3 py-1.5 rounded-xl border border-slate-800">
                  <Clock size={14} className="text-amber-400" />
                  <span>
                    {scheduledDate.toLocaleTimeString("en-IN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })} IST
                  </span>
                </div>

                <div className="flex items-center gap-1.5 bg-slate-950/80 px-3 py-1.5 rounded-xl border border-slate-800">
                  <Users size={14} className="text-emerald-400" />
                  <span>500 Max Seats</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
              <a
                href={zoomUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-black text-sm py-3.5 px-6 rounded-2xl shadow-xl shadow-orange-500/25 transition-all hover:scale-105"
              >
                <Video size={18} /> Join Live Zoom Webinar
                <ExternalLink size={14} />
              </a>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm py-3 px-6 rounded-2xl shadow-lg shadow-emerald-500/20 transition-all hover:scale-105"
              >
                <MessageCircle size={18} /> Join VIP WhatsApp Group
                <ExternalLink size={14} />
              </a>
            </div>
          </div>
        </div>

        {/* 2-Column: Preparation Video + Fast Track Skip Option */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Prep Video */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-orange-400 uppercase tracking-wider mb-2">
                <PlayCircle size={15} /> Required Preparation
              </div>
              <h3 className="text-xl font-black text-white mb-2">
                Watch Before You Join Live
              </h3>
              <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                This short 3-minute video explains the materials, workflow, and foundations to ensure you get the maximum value from the masterclass.
              </p>

              <div className="aspect-video w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 relative group flex items-center justify-center">
                {videoPlaying ? (
                  <iframe
                    className="w-full h-full"
                    src={toYouTubeEmbed(prepVideoUrl)}
                    title="Prep Video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <div
                    onClick={() => setVideoPlaying(true)}
                    className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer bg-gradient-to-tr from-slate-950 via-slate-900 to-slate-950 group-hover:bg-slate-900/80 transition-all p-4 text-center"
                  >
                    <div className="w-16 h-16 rounded-full bg-orange-500/20 border border-orange-500/50 flex items-center justify-center text-orange-400 mb-2 group-hover:scale-110 transition-transform shadow-xl">
                      <PlayCircle size={36} />
                    </div>
                    <p className="font-bold text-white text-sm">Play Masterclass Prep Video</p>
                    <p className="text-[11px] text-orange-400 mt-0.5">Click to Start</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Skip The Wait & Upgrade Option */}
          <div className="rounded-3xl border-2 border-amber-500/40 bg-gradient-to-br from-amber-500/10 via-slate-900 to-slate-900 p-6 md:p-8 shadow-xl flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 bg-amber-500/20 text-amber-300 text-[10px] font-black uppercase tracking-wider px-3 py-0.5 rounded-full mb-3">
                <Zap size={12} className="text-amber-400" /> Fast-Track Option
              </div>
              <h3 className="text-xl md:text-2xl font-black text-white mb-2">
                Don't Want to Wait for the Live Webinar?
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                Unlock the entire **Level 0 Fast Track (₹499)** or **Silver Membership (₹4,999)** right now! Get immediate access to video modules, formula calculators, and starter kits.
              </p>

              <div className="space-y-2 mb-6">
                {[
                  "Immediate access to all Level 0 foundational lessons",
                  "Resin ratio calculator & anti-bubble guide",
                  "Certificate of Completion eligibility",
                  "Community Win Wall posting privileges"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-slate-200">
                    <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setPurchaseModal(true)}
              className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-black text-xs rounded-2xl shadow-xl shadow-orange-500/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] cursor-pointer"
            >
              <Zap size={16} /> Instant Fast Track Upgrade (from ₹499)
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </main>

      {/* Upgrade Modal */}
      <TierPurchaseModal
        isOpen={purchaseModal}
        onClose={() => setPurchaseModal(false)}
        targetTierCode="L0"
        currentLevel={stats?.membershipLevel || "Fast Track (L0)"}
      />
    </div>
  );
}
