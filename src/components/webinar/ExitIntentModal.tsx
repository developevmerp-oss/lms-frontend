"use client";

import React, { useState, useEffect } from "react";
import { BrandLogo } from "@/components/ui/BrandLogo";
import {
  X,
  Gift,
  Sparkles,
  ArrowRight,
  Flame,
  CheckCircle2,
  Lock,
  ShieldCheck
} from "lucide-react";
import { API_BASE_URL } from "@/config/api";
import { useRouter } from "next/navigation";

interface ExitIntentModalProps {
  onClaimSeat: (formData?: any) => void;
}

export const ExitIntentModal = ({ onClaimSeat }: ExitIntentModalProps) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [hasDismissed, setHasDismissed] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Check if dismissed in this session
    if (typeof window !== "undefined") {
      const dismissed = sessionStorage.getItem("webinar_exit_dismissed");
      if (dismissed === "true") {
        setHasDismissed(true);
        return;
      }
    }

    let hasTriggered = false;

    // Detect mouse moving near browser back button / address bar (exit intent)
    const handleMouseLeave = (e: MouseEvent) => {
      if (hasTriggered || hasDismissed) return;

      // When cursor leaves from the top of viewport (towards back button or tab close)
      if (e.clientY <= 25) {
        hasTriggered = true;
        setIsOpen(true);
      }
    };

    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [hasDismissed]);

  const handleClose = () => {
    setIsOpen(false);
    setHasDismissed(true);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("webinar_exit_dismissed", "true");
    }
  };

  const handleQuickRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE_URL}/webinar/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, source: "exit-intent-popup" }),
      });

      const data = await res.json();

      if (typeof window !== "undefined") {
        sessionStorage.setItem("webinar_lead", JSON.stringify(data.data || form));
      }

      handleClose();
      router.push("/thank-you");
    } catch (_) {
      if (typeof window !== "undefined") {
        sessionStorage.setItem("webinar_lead", JSON.stringify(form));
      }
      handleClose();
      router.push("/thank-you");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-lg bg-slate-900 border-2 border-orange-500 rounded-3xl p-6 md:p-8 shadow-2xl shadow-orange-500/20 text-white animate-in zoom-in-95 duration-200">
        
        {/* Close X Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          title="Close"
        >
          <X size={18} />
        </button>

        {/* Top Urgency Badge */}
        <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-orange-500 to-amber-400 text-slate-950 text-[11px] font-black uppercase tracking-wider px-3.5 py-1 rounded-full mb-4 shadow-md">
          <Gift size={13} className="fill-slate-950" /> Wait! Don't Leave Empty Handed
        </div>

        {/* Headline */}
        <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight mb-2">
          Claim Your Free <span className="shimmer-text">₹4,999 Clarity Kit</span> Before You Go!
        </h2>

        <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-5">
          Reserve your free live Masterclass seat now and instantly unlock the <strong>Gram Formula Mix Calculator</strong>, <strong>Verified Supplier Directory</strong>, and <strong>Pricing Guide</strong>.
        </p>

        {/* Perks Checklist */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3.5 mb-5 space-y-2 text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
            <span>100% Free 90-Minute Live Training with Vrajangna Patel</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
            <span>Direct WhatsApp VIP Community &amp; Zoom Link</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
            <span>Zero obligation · No credit card required</span>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center">
            {error}
          </div>
        )}

        {/* Quick Lead Form */}
        <form onSubmit={handleQuickRegister} className="space-y-3">
          <div>
            <input
              type="text"
              placeholder="Your Full Name"
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-orange-500"
              required
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <input
              type="email"
              placeholder="Email Address"
              value={form.email}
              onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-orange-500"
              required
            />
            <input
              type="tel"
              placeholder="WhatsApp Number"
              value={form.phone}
              onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-orange-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-orange-500 via-amber-400 to-orange-500 hover:opacity-95 text-slate-950 font-black rounded-xl text-sm sm:text-base transition-all shadow-xl shadow-orange-500/25 flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            {loading ? "Securing Your Seat..." : "Yes! Claim My Free Seat & Kit →"}
          </button>
        </form>

        {/* No Thanks Dismiss Button */}
        <div className="text-center mt-4">
          <button
            type="button"
            onClick={handleClose}
            className="text-xs text-slate-400 hover:text-slate-200 transition-colors underline cursor-pointer"
          >
            No thanks, I don't want the free ₹4,999 Clarity Kit
          </button>
        </div>
      </div>
    </div>
  );
};
