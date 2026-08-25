"use client";

import React, { useState } from "react";
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
  Crown
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { API_BASE_URL } from "@/config/api";

export interface TierInfo {
  code: "L0" | "L1" | "L2" | "L3" | "L3+";
  name: string;
  price: string;
  originalPrice: string;
  badgeColor: string;
  icon: string;
  description: string;
  benefits: string[];
}

export const TIERS_CATALOG: TierInfo[] = [
  {
    code: "L0",
    name: "Fast Track",
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
  const { token, user } = useAuth();
  const [selectedCode, setSelectedCode] = useState<string>(targetTierCode);
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const targetTier = TIERS_CATALOG.find((t) => t.code === selectedCode) || TIERS_CATALOG[1];

  const handleWhatsAppCheckout = () => {
    const text = encodeURIComponent(
      `Hello Vrajangna Ma'am / Team Ravishing Art Hub!\n\nI want to upgrade my LMS account to *${targetTier.name} (${targetTier.code})* at the offer price of *${targetTier.price}*.\n\nMy Student Details:\n• Name: ${user?.name || "Student"}\n• Email: ${user?.email || ""}\n• Current Level: ${currentLevel}\n\nPlease share the payment details/UPI link to unlock my courses.`
    );
    window.open(`https://wa.me/919429424263?text=${text}`, "_blank");
  };

  const handleInstantUpgradeDemo = async () => {
    setIsProcessing(true);
    try {
      // Direct API update for student's level
      const res = await fetch(`${API_BASE_URL}/users/profile`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          membershipLevel: `${targetTier.name} (${targetTier.code})`,
          rank: `${targetTier.name} (${targetTier.code})`,
        }),
      });

      if (res.ok) {
        setSuccess(true);
        if (onUpgradeSuccess) onUpgradeSuccess();
        setTimeout(() => {
          setSuccess(false);
          onClose();
          window.location.reload();
        }, 1500);
      } else {
        handleWhatsAppCheckout();
      }
    } catch (_) {
      handleWhatsAppCheckout();
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200 font-sans">
      <div className="relative w-full max-w-2xl rounded-3xl border border-orange-500/40 bg-slate-900 p-6 sm:p-8 shadow-2xl text-white max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex justify-between items-start pb-4 border-b border-slate-800 shrink-0">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-0.5 text-xs font-bold uppercase tracking-wider text-orange-400 mb-1.5">
              <Trophy size={13} /> Instant Membership Upgrade
            </span>
            <h2 className="text-2xl font-black text-white">
              Unlock Next-Level Curriculum &amp; Masterclasses
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Purchase and unlock any level directly — no sequential completion required!
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
                  {targetTier.icon}
                </div>
                <div>
                  <span className="text-xs font-black text-orange-400 uppercase tracking-wider block">
                    {targetTier.code} Tier Enrollment
                  </span>
                  <h3 className="text-xl font-black text-white">{targetTier.name}</h3>
                </div>
              </div>

              <div className="flex flex-col sm:items-end">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-amber-400 font-mono">
                    {targetTier.price}
                  </span>
                  <span className="text-xs text-slate-500 line-through font-mono">
                    {targetTier.originalPrice}
                  </span>
                </div>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full mt-0.5">
                  Lifetime Course &amp; Vault Access
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-300 mt-3 leading-relaxed">
              {targetTier.description}
            </p>

            {/* Benefits Checklist */}
            <div className="mt-4 pt-4 border-t border-slate-800/80 space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                What's Unlocked in this Tier:
              </span>
              {targetTier.benefits.map((b, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-slate-200">
                  <CheckCircle2 size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                  <span>{b}</span>
                </div>
              ))}
            </div>
          </div>

          {success && (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-bold flex items-center gap-2">
              <CheckCircle2 size={18} /> Upgrade successful! Unlocking your courses now...
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={handleWhatsAppCheckout}
            className="w-full sm:flex-1 py-3 px-5 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-black text-xs rounded-xl shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] cursor-pointer"
          >
            <MessageCircle size={16} /> Pay via WhatsApp / Mentor Desk ({targetTier.price})
          </button>

          <button
            type="button"
            onClick={handleInstantUpgradeDemo}
            disabled={isProcessing}
            className="w-full sm:flex-1 py-3 px-5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] cursor-pointer"
          >
            <Zap size={16} /> {isProcessing ? "Upgrading..." : `Instant Unlock (${targetTier.code})`}
          </button>
        </div>
      </div>
    </div>
  );
};
