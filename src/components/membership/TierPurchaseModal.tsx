"use client";

import React, { useState, useEffect } from "react";
import {
  Trophy,
  X,
  CheckCircle2,
  Lock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  CreditCard,
  MessageCircle,
  Award,
  Gem,
  Crown,
  Flame,
  Tag,
  Clock,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { processRazorpayPayment } from "@/utils/razorpay";
import { API_BASE_URL } from "@/config/api";

export interface TierInfo {
  code: "L0" | "L1" | "L2" | "L3" | "L3+";
  name: string;
  numericPrice: number;
  price: string;
  originalPrice: string;
  badgeColor: string;
  icon: string;
  description: string;
  benefits: string[];
  discountType?: "percentage" | "flat" | string | null;
  discountValue?: number | null;
  offerStartDate?: string | null;
  offerEndDate?: string | null;
  offerActive?: boolean;
}

export const TIERS_CATALOG: TierInfo[] = [
  {
    code: "L0",
    name: "Fast Track",
    numericPrice: 499,
    price: "₹499",
    originalPrice: "₹2,499",
    badgeColor: "emerald",
    icon: "⚡",
    description: "Foundational resin chemistry, bubble-free mixing, and essential art setup.",
    benefits: [
      "Access to 3 foundational starter courses",
      "Resin safety & PPE guidelines",
      "Essential toolkit & ratio calculator",
      "Community Win Wall access"
    ]
  },
  {
    code: "L1",
    name: "Silver Member",
    numericPrice: 4999,
    price: "₹4,999",
    originalPrice: "₹9,999",
    badgeColor: "slate",
    icon: "🥈",
    description: "Core casting techniques, marbling, lotus ponds, and first client sales.",
    benefits: [
      "All 5 Level 1 video masterclasses",
      "Coasters, keychains, marbling & beach theme",
      "Weekly live Q&A masterclasses with Vrajangna",
      "Client pricing calculators & order templates"
    ]
  },
  {
    code: "L2",
    name: "Gold Member",
    numericPrice: 19999,
    price: "₹19,999",
    originalPrice: "₹34,999",
    badgeColor: "amber",
    icon: "🏆",
    description: "High-ticket geode wall art, luxury clocks, and advanced 3D ripple ocean pours.",
    benefits: [
      "All Level 0, Level 1 & Level 2 masterclasses (12+ Courses)",
      "Crystal cluster geode art & gilding line work",
      "3D wave ripples & Tree of Life luxury clocks",
      "Priority portfolio reviews & critique vault"
    ]
  },
  {
    code: "L3",
    name: "Diamond Club",
    numericPrice: 59999,
    price: "₹59,999",
    originalPrice: "₹99,999",
    badgeColor: "cyan",
    icon: "💎",
    description: "Commercial business scaling to ₹3 Lakhs/month, river tables, and varmala preservation.",
    benefits: [
      "All 30 masterclasses unlocked across all tiers",
      "Wood river tables, varmala bridal flower preservation & 3D photo art",
      "Northstar Business Revenue & Goal Tracking engine",
      "Reels, Photography, YouTube & commercial brand blueprint"
    ]
  }
];

interface TierPurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetTierCode?: string;
  currentLevel?: string;
  onUpgradeSuccess?: () => void;
}

export const TierPurchaseModal = ({
  isOpen,
  onClose,
  targetTierCode = "L1",
  currentLevel = "L0 Fast Track",
  onUpgradeSuccess,
}: TierPurchaseModalProps) => {
  const { user, token } = useAuth();
  const [selectedCode, setSelectedCode] = useState<string>(targetTierCode);
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [liveTiers, setLiveTiers] = useState<any[]>([]);

  useEffect(() => {
    if (isOpen && token) {
      fetch(`${API_BASE_URL}/admin/levels`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((r) => r.json())
        .then((data) => {
          if (Array.isArray(data)) setLiveTiers(data);
        })
        .catch(() => {});
    }
  }, [isOpen, token]);

  if (!isOpen) return null;

  const baseTier = TIERS_CATALOG.find((t) => t.code === selectedCode) || TIERS_CATALOG[1];
  const liveTierMatch = liveTiers.find((lt) => lt.code === selectedCode);

  const mergedTier: TierInfo = {
    ...baseTier,
    price: liveTierMatch?.price || baseTier.price,
    discountType: liveTierMatch?.discountType || baseTier.discountType,
    discountValue: liveTierMatch?.discountValue || baseTier.discountValue,
    offerStartDate: liveTierMatch?.offerStartDate || baseTier.offerStartDate,
    offerEndDate: liveTierMatch?.offerEndDate || baseTier.offerEndDate,
    offerActive: liveTierMatch ? liveTierMatch.offerActive : baseTier.offerActive,
  };

  // Compute discount offer
  const now = new Date();
  const hasActiveOffer = Boolean(
    mergedTier.offerActive &&
    mergedTier.discountValue &&
    (!mergedTier.offerStartDate || new Date(mergedTier.offerStartDate) <= now) &&
    (!mergedTier.offerEndDate || new Date(mergedTier.offerEndDate) >= now)
  );

  let finalNumericPrice = mergedTier.numericPrice;
  let offerBadge: string | null = null;

  if (hasActiveOffer && mergedTier.discountValue) {
    if (mergedTier.discountType === "percentage") {
      const disc = (mergedTier.numericPrice * mergedTier.discountValue) / 100;
      finalNumericPrice = Math.max(0, Math.round(mergedTier.numericPrice - disc));
      offerBadge = `${mergedTier.discountValue}% OFF`;
    } else {
      finalNumericPrice = Math.max(0, Math.round(mergedTier.numericPrice - mergedTier.discountValue));
      offerBadge = `₹${mergedTier.discountValue} OFF`;
    }
  }

  const handleRazorpayPayment = () => {
    setIsProcessing(true);
    processRazorpayPayment({
      amount: finalNumericPrice,
      tierCode: mergedTier.code,
      tierName: mergedTier.name,
      email: user?.email,
      name: user?.name,
      phone: user?.phone,
      onSuccess: (data) => {
        setIsProcessing(false);
        setSuccessMsg(`🎉 Payment successful! ${mergedTier.name} (${mergedTier.code}) is now unlocked.`);
        if (onUpgradeSuccess) onUpgradeSuccess();
        setTimeout(() => {
          onClose();
          window.location.reload();
        }, 1800);
      },
      onFailure: (err) => {
        setIsProcessing(false);
        console.error("Payment failed or dismissed:", err);
      },
    });
  };

  const handleWhatsAppHelp = () => {
    const text = encodeURIComponent(
      `Hello Vrajangna Ma'am / Team Ravishing Art Hub!\n\nI want to upgrade my LMS account to *${mergedTier.name} (${mergedTier.code})* at *₹${finalNumericPrice.toLocaleString("en-IN")}*.\n\nMy Details:\n• Name: ${user?.name || "Student"}\n• Email: ${user?.email || ""}\n• Current Level: ${currentLevel}\n\nPlease share alternative payment options.`
    );
    window.open(`https://wa.me/919429424263?text=${text}`, "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200 font-sans">
      <div className="relative w-full max-w-2xl rounded-3xl border border-orange-500/40 bg-slate-900 p-6 sm:p-8 shadow-2xl text-white max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex justify-between items-start pb-4 border-b border-slate-800 shrink-0">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-0.5 text-xs font-bold uppercase tracking-wider text-orange-400 mb-1.5">
              <Trophy size={13} /> Razorpay Secure Checkout
            </span>
            <h2 className="text-2xl font-black text-white">
              Unlock Next-Level Curriculum &amp; Masterclasses
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Directly purchase any level with UPI, Cards, Netbanking via Razorpay — no prerequisite completion needed!
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        <div className="overflow-y-auto py-6 space-y-6 flex-1 pr-1">
          {/* Level Selector Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {TIERS_CATALOG.map((tier) => {
              const isSelected = selectedCode === tier.code;
              return (
                <button
                  key={tier.code}
                  type="button"
                  onClick={() => setSelectedCode(tier.code)}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? "bg-orange-500/10 border-orange-500 ring-2 ring-orange-500/30"
                      : "bg-slate-950/80 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-lg">{tier.icon}</span>
                    <span className="text-[11px] font-black text-orange-400 uppercase">
                      {tier.code}
                    </span>
                  </div>
                  <h4 className="text-xs font-black text-white truncate">{tier.name}</h4>
                  <div className="text-xs font-black text-amber-400 font-mono mt-1">
                    {tier.price}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Selected Tier Detail Card */}
          <div className="rounded-3xl border border-slate-800 bg-slate-950/90 p-5 sm:p-6 shadow-inner">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-2xl shrink-0">
                  {mergedTier.icon}
                </div>
                <div>
                  <span className="text-xs font-black text-orange-400 uppercase tracking-wider block">
                    {mergedTier.code} Tier Enrollment
                  </span>
                  <h3 className="text-xl font-black text-white">{mergedTier.name}</h3>
                </div>
              </div>

              <div className="flex flex-col sm:items-end">
                <div className="flex items-baseline gap-2">
                  {offerBadge ? (
                    <>
                      <span className="text-xs text-slate-500 line-through font-mono">
                        {mergedTier.price}
                      </span>
                      <span className="text-2xl font-black text-amber-400 font-mono">
                        ₹{finalNumericPrice.toLocaleString("en-IN")}
                      </span>
                      <span className="bg-gradient-to-r from-red-500 to-rose-600 text-white font-black text-[10px] px-2 py-0.5 rounded-lg shadow-md flex items-center gap-1 animate-pulse">
                        <Flame size={10} /> {offerBadge}
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="text-2xl font-black text-amber-400 font-mono">
                        {mergedTier.price}
                      </span>
                      <span className="text-xs text-slate-500 line-through font-mono">
                        {mergedTier.originalPrice}
                      </span>
                    </>
                  )}
                </div>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full mt-0.5">
                  Instant Auto-Activation
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-300 mt-3 leading-relaxed">
              {mergedTier.description}
            </p>

            {/* Benefits Checklist */}
            <div className="mt-4 pt-4 border-t border-slate-800/80 space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Included in this Membership:
              </span>
              {mergedTier.benefits.map((b, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-slate-200">
                  <CheckCircle2 size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                  <span>{b}</span>
                </div>
              ))}
            </div>
          </div>

          {successMsg && (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-bold flex items-center gap-2">
              <CheckCircle2 size={18} /> {successMsg}
            </div>
          )}
        </div>

        {/* Footer Actions with Razorpay Checkout */}
        <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={handleRazorpayPayment}
            disabled={isProcessing}
            className="w-full sm:flex-1 py-3 px-5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-black text-sm rounded-xl shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] cursor-pointer"
          >
            <CreditCard size={17} />
            {isProcessing
              ? "Opening Razorpay..."
              : `Pay ₹${finalNumericPrice.toLocaleString("en-IN")} with Razorpay`}
          </button>

          <button
            type="button"
            onClick={handleWhatsAppHelp}
            className="w-full sm:w-auto py-3 px-4 border border-slate-700 bg-slate-800/80 hover:bg-slate-800 text-slate-300 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <MessageCircle size={15} className="text-emerald-400" /> WhatsApp Support
          </button>
        </div>
      </div>
    </div>
  );
};
