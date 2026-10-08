"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { Sparkles, ArrowRight, ShieldCheck, QrCode } from "lucide-react";
import { trackingService } from "@/services/trackingService";

function SubscribeRedirectContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, token } = useAuth();
  const [targetLevel, setTargetLevel] = useState("L1");
  const [statusMessage, setStatusMessage] = useState("Verifying student authentication...");

  useEffect(() => {
    const rawLevel = searchParams.get("level") || searchParams.get("tier") || searchParams.get("unlock") || "L1";
    const levelCode = rawLevel.trim().toUpperCase();
    setTargetLevel(levelCode);

    try {
      trackingService.trackViewContent({
        name: `${levelCode} Membership Plan`,
        category: "Membership Level QR",
      });
    } catch (_) {}

    const destination = `/student/courses?unlock=${encodeURIComponent(levelCode)}`;

    // Check localStorage token directly in addition to hook to avoid hydration lag
    const storedToken = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const isAuthed = Boolean(token || storedToken);

    if (isAuthed) {
      setStatusMessage(`Authenticated! Redirecting to ${levelCode} Membership checkout...`);
      const timer = setTimeout(() => {
        router.replace(destination);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setStatusMessage(`Not logged in. Redirecting to login to unlock ${levelCode} Membership...`);
      const loginUrl = `/login?redirect=${encodeURIComponent(destination)}`;
      const timer = setTimeout(() => {
        router.replace(loginUrl);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [searchParams, token, router]);

  const destinationUrl = `/student/courses?unlock=${encodeURIComponent(targetLevel)}`;
  const loginUrl = `/login?redirect=${encodeURIComponent(destinationUrl)}`;
  const storedToken = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const isAuthed = Boolean(token || storedToken);

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background Ambient Glow */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-orange-500/10 rounded-full blur-[100px] animate-pulse" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-amber-600/10 rounded-full blur-[100px] animate-pulse" />

      <div className="relative z-10 w-full max-w-md text-center">
        {/* Brand Header */}
        <div className="mb-6">
          <BrandLogo href="/" size="lg" />
          <p className="text-slate-400 mt-2 text-xs">Official Student Academy &amp; Masterclasses</p>
        </div>

        {/* Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl backdrop-blur-xl">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400">
            <QrCode size={32} className="animate-pulse" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-black mb-3">
            <Sparkles size={13} /> {targetLevel} Membership Plan
          </div>

          <h2 className="text-xl font-black text-white mb-2">Connecting Your Plan</h2>
          <p className="text-slate-400 text-xs mb-6 leading-relaxed">
            {statusMessage}
          </p>

          {/* Loading Indicator */}
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mb-6">
            <div className="bg-gradient-to-r from-orange-500 to-amber-400 h-full w-2/3 rounded-full animate-[pulse_1.5s_ease-in-out_infinite]" />
          </div>

          {/* Manual Fallback Links */}
          <div className="pt-4 border-t border-slate-800/80">
            <a
              href={isAuthed ? destinationUrl : loginUrl}
              className="inline-flex items-center justify-center gap-2 w-full bg-orange-500 hover:bg-orange-600 text-slate-950 font-black text-xs h-10 px-4 rounded-xl transition-all shadow-md cursor-pointer"
            >
              <span>Continue to {targetLevel} Plan</span>
              <ArrowRight size={14} />
            </a>
            <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
              <ShieldCheck size={12} className="text-emerald-400" />
              <span>Razorpay Secure Encrypted Checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SubscribePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 text-xs">
          Loading subscription redirect...
        </div>
      }
    >
      <SubscribeRedirectContent />
    </Suspense>
  );
}
