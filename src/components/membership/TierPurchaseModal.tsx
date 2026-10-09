"use client";

import React, { useState, useEffect, useMemo } from "react";
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
  Info,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { processRazorpayPayment } from "@/utils/razorpay";
import { API_BASE_URL } from "@/config/api";
import { getComputedTierPricing, parseNumericPrice } from "@/utils/tierPricing";
import { trackingService } from "@/services/trackingService";

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
  offerTitle?: string | null;
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
    name: "Explore Membership",
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
    name: "Master Membership",
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
    name: "Renaissance Certification",
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

const PERIOD_LABELS: Record<string, string> = {
  weekly: "Weekly",
  biweekly: "Bi-Weekly",
  monthly: "Monthly",
  "2months": "Every 2 Months",
  "3months": "Every 3 Months",
  "6months": "Every 6 Months",
};

interface TierPurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetTierCode?: string;
  preselectedTier?: string;
  currentLevel?: string;
  onUpgradeSuccess?: () => void;
  onSuccess?: () => void;
}

export const TierPurchaseModal = ({
  isOpen,
  onClose,
  targetTierCode = "L1",
  preselectedTier,
  currentLevel = "L0 Fast Track",
  onUpgradeSuccess,
  onSuccess,
}: TierPurchaseModalProps) => {
  const { user, token } = useAuth();
  const [selectedCode, setSelectedCode] = useState<string>(preselectedTier || targetTierCode);
  const [selectedOfferId, setSelectedOfferId] = useState<string | null>(null);
  const [paymentMode, setPaymentMode] = useState<"full" | "installment">("full");
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [customPeriod, setCustomPeriod] = useState<string>("monthly");
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [liveTiers, setLiveTiers] = useState<any[]>([]);
  const [campaignOffers, setCampaignOffers] = useState<any[]>([]);

  useEffect(() => {
    if (isOpen) {
      setSelectedCode(preselectedTier || targetTierCode);
      setPaymentMode("full");
      setSelectedPlanId(null);
      setCustomPeriod("monthly");
      fetch(`${API_BASE_URL}/dashboard/levels`)
        .then((r) => r.json())
        .then((data) => {
          if (Array.isArray(data) && data.length > 0) setLiveTiers(data);
        })
        .catch(() => {});

      // Fetch active offers using public dashboard endpoint or active admin offers
      fetch(`${API_BASE_URL}/dashboard/offers`)
        .then((r) => r.json())
        .then((data) => {
          if (Array.isArray(data)) setCampaignOffers(data);
          else if (data && Array.isArray(data.offers)) setCampaignOffers(data.offers);
        })
        .catch(() => {
          fetch(`${API_BASE_URL}/admin/offers/active`)
            .then((r) => r.json())
            .then((data) => {
              if (Array.isArray(data)) setCampaignOffers(data);
            })
            .catch(() => {});
        });
    }
  }, [isOpen, preselectedTier, targetTierCode]);

  const baseTier = TIERS_CATALOG.find((t) => t.code === selectedCode) || TIERS_CATALOG[1];
  const liveTierMatch = liveTiers.find(
    (lt) => (lt.code || lt.levelCode || "").toUpperCase() === selectedCode.toUpperCase()
  );

  // Dynamic base price extracted from live database
  const dynamicBasePriceStr = liveTierMatch?.price || baseTier.price;
  const dynamicBaseNumericPrice = parseNumericPrice(dynamicBasePriceStr) || baseTier.numericPrice;
  const formattedBasePrice = `₹${dynamicBaseNumericPrice.toLocaleString("en-IN")}`;

  // Check separate offers module for ALL matching active campaign offers
  const now = new Date();
  const matchingOffers = campaignOffers.filter((co) => {
    if (!co || co.isActive === false) return false;
    const coLevel = (co.levelCode || "").toUpperCase();
    if (coLevel !== "ALL" && coLevel !== selectedCode.toUpperCase()) return false;
    if (co.startDate && new Date(co.startDate) > now) return false;
    if (co.endDate && new Date(co.endDate) < now) return false;
    if (!co.discountValue || parseFloat(co.discountValue) <= 0) return false;
    return true;
  });

  const activeCampaignOffer = selectedOfferId
    ? matchingOffers.find((o) => o.id === selectedOfferId) || matchingOffers[0]
    : matchingOffers[0];

  const mergedTier: TierInfo = {
    ...baseTier,
    name: liveTierMatch?.name || baseTier.name,
    description: liveTierMatch?.description || baseTier.description,
    icon: liveTierMatch?.icon || baseTier.icon,
    price: formattedBasePrice,
    numericPrice: dynamicBaseNumericPrice,
    originalPrice: liveTierMatch?.originalPrice || baseTier.originalPrice || formattedBasePrice,
    discountType: activeCampaignOffer?.discountType || liveTierMatch?.discountType || baseTier.discountType,
    discountValue: activeCampaignOffer?.discountValue ? parseFloat(activeCampaignOffer.discountValue) : liveTierMatch?.discountValue || baseTier.discountValue,
    offerStartDate: activeCampaignOffer?.startDate || liveTierMatch?.offerStartDate || baseTier.offerStartDate,
    offerEndDate: activeCampaignOffer?.endDate || liveTierMatch?.offerEndDate || baseTier.offerEndDate,
    offerActive: activeCampaignOffer ? activeCampaignOffer.isActive : liveTierMatch ? liveTierMatch.offerActive : baseTier.offerActive,
    offerTitle: activeCampaignOffer?.title || liveTierMatch?.offerTitle || baseTier.offerTitle || "Special Level Offer 🔥",
  };

  // Compute discount offer
  const hasActiveOffer = Boolean(
    mergedTier.offerActive &&
    mergedTier.discountValue &&
    (!mergedTier.offerStartDate || new Date(mergedTier.offerStartDate) <= now) &&
    (!mergedTier.offerEndDate || new Date(mergedTier.offerEndDate) >= now)
  );

  let finalNumericPrice = mergedTier.numericPrice;
  let offerBadge: string | null = null;

  if (hasActiveOffer && mergedTier.discountValue && mergedTier.numericPrice > 0) {
    if (mergedTier.discountType === "percentage") {
      const disc = (mergedTier.numericPrice * mergedTier.discountValue) / 100;
      finalNumericPrice = Math.max(0, Math.round(mergedTier.numericPrice - disc));
      offerBadge = `${mergedTier.discountValue}% OFF`;
    } else {
      finalNumericPrice = Math.max(0, Math.round(mergedTier.numericPrice - mergedTier.discountValue));
      offerBadge = `₹${mergedTier.discountValue.toLocaleString("en-IN")} OFF`;
    }
  }

  // Installment plans resolution
  const hasInstallmentOption = Boolean(
    liveTierMatch
      ? liveTierMatch.installmentsEnabled === true
      : (selectedCode === "L3")
  );

  const enabledFrequencies = useMemo(() => {
    const plans = liveTierMatch?.installmentPlans;
    const defaultTotal = Math.max(2, Math.min(24, parseInt(String(liveTierMatch?.totalInstallments), 10) || 3));
    const defaultList = [
      { frequency: "biweekly", label: "Bi-Weekly", totalInstallments: defaultTotal },
      { frequency: "monthly", label: "Monthly", totalInstallments: defaultTotal },
      { frequency: "2months", label: "Every 2 Months", totalInstallments: defaultTotal },
      { frequency: "3months", label: "Every 3 Months", totalInstallments: defaultTotal },
    ];

    if (!Array.isArray(plans) || plans.length === 0) {
      return defaultList;
    }

    if (typeof plans[0] === "string") {
      const list = (plans as string[]).map((f) => ({
        frequency: f,
        label: PERIOD_LABELS[f] || f,
        totalInstallments: defaultTotal,
      }));
      return list.length > 0 ? list : defaultList;
    }

    const filtered = plans
      .filter((p: any) => p && (p.enabled === true || p.isActive !== false))
      .map((p: any) => ({
        frequency: p.frequency,
        label: p.label || p.frequencyLabel || PERIOD_LABELS[p.frequency] || p.frequency,
        totalInstallments: Math.max(
          2,
          Math.min(24, parseInt(String(p.totalInstallments || p.installments), 10) || defaultTotal)
        ),
      }));

    return filtered.length > 0 ? filtered : defaultList;
  }, [liveTierMatch]);

  useEffect(() => {
    if (enabledFrequencies.length > 0) {
      setCustomPeriod((prev) => {
        if (enabledFrequencies.some((f) => f.frequency === prev)) return prev;
        return enabledFrequencies[0].frequency;
      });
    }
  }, [enabledFrequencies]);

  const activePlan = useMemo(() => {
    return (
      enabledFrequencies.find((f) => f.frequency === customPeriod) ||
      enabledFrequencies[0] || {
        frequency: "monthly",
        label: "Monthly",
        totalInstallments: Math.max(2, Math.min(24, parseInt(String(liveTierMatch?.totalInstallments), 10) || 3)),
      }
    );
  }, [enabledFrequencies, customPeriod]);

  const adminTotalInstallments = Math.max(
    2,
    Math.min(24, parseInt(String(activePlan?.totalInstallments || liveTierMatch?.totalInstallments), 10) || 3)
  );
  const autoInstallmentExact = finalNumericPrice / adminTotalInstallments;
  const autoInstallmentRounded = Math.round(autoInstallmentExact);

  const getOrdinal = (n: number) => {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  };

  const getPeriodOffsetLabel = (idx: number, period: string) => {
    if (idx === 0) return "DOP (Date of Purchase - Today)";
    const p = (period || "monthly").toLowerCase();
    switch (p) {
      case "weekly":
        return `DOP + ${idx} week${idx > 1 ? "s" : ""}`;
      case "biweekly":
        return `DOP + ${idx * 2} weeks`;
      case "monthly":
        return `DOP + ${idx} month${idx > 1 ? "s" : ""}`;
      case "2months":
        return `DOP + ${idx * 2} months`;
      case "3months":
        return `DOP + ${idx * 3} months`;
      case "6months":
        return `DOP + ${idx * 6} months`;
      default: {
        const daysMatch = p.match(/(\d+)\s*days?/);
        if (daysMatch) {
          const numDays = parseInt(daysMatch[1], 10);
          return `DOP + ${idx * numDays} days`;
        }
        const monthsMatch = p.match(/(\d+)\s*months?/);
        if (monthsMatch) {
          const numMonths = parseInt(monthsMatch[1], 10);
          return `DOP + ${idx * numMonths} months`;
        }
        return `DOP + ${idx} cycle${idx > 1 ? "s" : ""}`;
      }
    }
  };

  const isPayingInstallment = paymentMode === "installment" && hasInstallmentOption;
  const effectivePayAmount = isPayingInstallment ? autoInstallmentRounded : finalNumericPrice;

  const handleRazorpayPayment = () => {
    setIsProcessing(true);

    // Safely track InitiateCheckout
    try {
      trackingService.trackInitiateCheckout({
        id: mergedTier.code,
        name: `${mergedTier.name} (${mergedTier.code})`,
        value: effectivePayAmount,
        currency: "INR",
      });
    } catch (_) {}

    processRazorpayPayment({
      amount: effectivePayAmount,
      tierCode: mergedTier.code,
      tierName: mergedTier.name,
      email: user?.email,
      name: user?.name,
      phone: user?.phone,
      isInstallment: Boolean(isPayingInstallment),
      planId: `plan_${customPeriod}_${adminTotalInstallments}_${Date.now()}`,
      planName: `${adminTotalInstallments} Instalments (${PERIOD_LABELS[customPeriod] || "Monthly"})`,
      planFrequency: customPeriod,
      installmentAmount: autoInstallmentRounded,
      totalInstallments: adminTotalInstallments,
      onSuccess: (data) => {
        setIsProcessing(false);

        // Safely track verified Purchase conversion
        try {
          trackingService.trackPurchase({
            transactionId: (data as any)?.razorpay_payment_id || `txn_${Date.now()}`,
            value: effectivePayAmount,
            currency: "INR",
            items: [
              {
                id: mergedTier.code,
                name: mergedTier.name,
                price: effectivePayAmount,
              },
            ],
          });
        } catch (_) {}

        const msg = isPayingInstallment
          ? `🎉 1st installment paid! ${mergedTier.name} (${mergedTier.code}) is now unlocked.`
          : `🎉 Payment successful! ${mergedTier.name} (${mergedTier.code}) is now unlocked.`;
        setSuccessMsg(msg);
        if (onUpgradeSuccess) onUpgradeSuccess();
        if (onSuccess) onSuccess();
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
    const planText = isPayingInstallment
      ? ` (Installment Plan: ${adminTotalInstallments} Instalments of ₹${autoInstallmentRounded.toLocaleString("en-IN")}, ${PERIOD_LABELS[customPeriod] || "Monthly"})`
      : ` at *₹${effectivePayAmount.toLocaleString("en-IN")}*`;
    const text = encodeURIComponent(
      `Hello Vrajangna Ma'am / Team Ravishing Art Hub!\n\nI want to upgrade my LMS account to *${mergedTier.name} (${mergedTier.code})*${planText}.\n\nMy Details:\n• Name: ${user?.name || "Student"}\n• Email: ${user?.email || ""}\n• Current Level: ${currentLevel}\n\nPlease share alternative payment options.`
    );
    window.open(`https://wa.me/919429424263?text=${text}`, "_blank");
  };

  if (!isOpen) return null;

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
              const pricing = getComputedTierPricing(tier.code, liveTiers, campaignOffers);
              const liveMatch = liveTiers.find((lt) => (lt.code || lt.levelCode || "").toUpperCase() === tier.code.toUpperCase());

              return (
                <button
                  key={tier.code}
                  type="button"
                  onClick={() => {
                    setSelectedCode(tier.code);
                    setSelectedOfferId(null);
                  }}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? "bg-orange-500/10 border-orange-500 ring-2 ring-orange-500/30"
                      : "bg-slate-950/80 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-lg">{liveMatch?.icon || tier.icon}</span>
                    <span className="text-[11px] font-black text-orange-400 uppercase">
                      {tier.code}
                    </span>
                  </div>
                  <h4 className="text-xs font-black text-white truncate">{pricing.name}</h4>
                  <div className="text-xs font-black text-amber-400 font-mono mt-1 flex flex-col">
                    {pricing.hasOffer ? (
                      <div className="flex items-baseline gap-1">
                        <span className="text-xs text-amber-300 font-bold">{pricing.finalPrice}</span>
                        <span className="text-[9px] text-red-400 font-bold">{pricing.discountLabel}</span>
                      </div>
                    ) : (
                      <span>{pricing.finalPrice}</span>
                    )}
                  </div>
                  {liveMatch?.installmentsEnabled && Array.isArray(liveMatch?.installmentPlans) && liveMatch.installmentPlans.length > 0 && (
                    <span className="mt-1 text-[9px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded inline-block text-center truncate">
                      💳 Installments Available
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Multi-Offer Campaign Selector (When admin creates multiple offers for the same level) */}
          {matchingOffers.length > 1 && (
            <div className="mb-3 p-3 bg-slate-900 border border-slate-800 rounded-2xl">
              <span className="text-[11px] font-bold text-slate-400 block mb-2">
                🎉 {matchingOffers.length} Active Offers Available for {selectedCode} (Click to Switch):
              </span>
              <div className="flex flex-wrap gap-2">
                {matchingOffers.map((off) => {
                  const isSel = (activeCampaignOffer?.id || matchingOffers[0]?.id) === off.id;
                  const bdg = off.discountType === "percentage" ? `${off.discountValue}% OFF` : `₹${off.discountValue} OFF`;
                  return (
                    <button
                      key={off.id}
                      type="button"
                      onClick={() => setSelectedOfferId(off.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                        isSel
                          ? "bg-gradient-to-r from-red-500 to-rose-600 text-white font-black shadow-md border border-red-400"
                          : "bg-slate-950 border border-slate-800 text-slate-300 hover:text-white"
                      }`}
                    >
                      <Tag size={12} /> {off.title} ({bdg})
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Installment Payment Mode Toggle (When Admin enables installments on this level) */}
          {hasInstallmentOption && (
            <div className="p-1.5 bg-slate-950 border border-slate-800 rounded-2xl flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setPaymentMode("full")}
                className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  paymentMode === "full"
                    ? "bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-black shadow-md"
                    : "text-slate-400 hover:text-white hover:bg-slate-900"
                }`}
              >
                <Tag size={13} /> Pay in Full ({offerBadge ? `₹${finalNumericPrice.toLocaleString("en-IN")}` : mergedTier.price})
              </button>
              <button
                type="button"
                onClick={() => setPaymentMode("installment")}
                className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  paymentMode === "installment"
                    ? "bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black shadow-md"
                    : "text-slate-400 hover:text-white hover:bg-slate-900"
                }`}
              >
                <CreditCard size={13} /> Pay in Installments
                <span className="text-[9px] px-1.5 py-0.5 bg-emerald-500/20 text-emerald-300 rounded font-black border border-emerald-500/30">
                  Easy EMIs
                </span>
              </button>
            </div>
          )}

          {/* Fixed Admin-Configured Installment Plan Display */}
          {isPayingInstallment && (
            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-black text-cyan-400 uppercase tracking-wide flex items-center gap-1.5">
                  <CreditCard size={15} /> Official Installment Structure
                </span>
                <span className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 rounded-full font-bold">
                  ⚡ 1st Installment Unlocks Curriculum
                </span>
              </div>

              {/* Fixed Total Instalments (Admin-Defined) */}
              <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 flex items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-200">
                      Total Instalments
                    </span>
                    <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Configured by Academy
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Divided into <strong className="text-white">{adminTotalInstallments} equal instalments</strong> of{" "}
                    <strong className="text-emerald-400 font-mono">₹{autoInstallmentRounded.toLocaleString("en-IN")}</strong> each
                  </p>
                </div>
                <div className="text-right shrink-0 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-xl font-black font-mono text-cyan-400">
                    {adminTotalInstallments}
                  </span>
                  <span className="text-[9px] text-slate-400 block font-bold uppercase tracking-wider">
                    Instalments
                  </span>
                </div>
              </div>

              {/* Instalment Period Dropdown */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center justify-between">
                  <span>Select Payment Frequency</span>
                  <span className="text-[10px] text-slate-400 font-normal">Available Cycles</span>
                </label>
                <select
                  value={customPeriod}
                  onChange={(e) => setCustomPeriod(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white font-bold focus:outline-none focus:border-cyan-500 transition-all cursor-pointer"
                >
                  {enabledFrequencies.map((f) => (
                    <option key={f.frequency} value={f.frequency}>
                      {f.label}
                    </option>
                  ))}
                </select>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Select payment cycle interval allowed by instructor.
                </span>
              </div>

              {/* Dynamic Breakdown List */}
              <div className="space-y-2 pt-2">
                {Array.from({ length: adminTotalInstallments }).map((_, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-2xl bg-slate-950/90 border border-slate-800/80 transition-all hover:border-slate-700"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-black text-xs shrink-0 shadow-md">
                        {idx + 1}
                      </div>
                      <div>
                        <span className="font-black text-white text-xs block">
                          {getOrdinal(idx + 1)} Instalment
                        </span>
                        <span className="text-[11px] text-slate-400 font-medium">
                          {getPeriodOffsetLabel(idx, customPeriod)}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-black font-mono text-white text-sm">
                        ₹{autoInstallmentRounded.toLocaleString("en-IN")}
                      </span>
                      {idx === 0 && (
                        <span className="block text-[9px] font-bold text-emerald-400">
                          Due Today (DOP)
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Important Information */}
              <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-1.5 text-xs">
                <h5 className="font-black text-slate-300 text-xs flex items-center gap-1.5">
                  <Info size={13} className="text-orange-400" /> Important Information
                </h5>
                <ul className="space-y-1 text-[11px] text-slate-400 list-disc list-inside">
                  <li>
                    Please note that if the student fails to pay his instalments on time, access to upcoming curriculum may be temporarily placed on hold until renewed.
                  </li>
                  <li>The 1st instalment unlocks full curriculum access immediately today.</li>
                  <li>
                    Automated installment reminders will be notified on your student dashboard.
                  </li>
                </ul>
              </div>

              {/* Bottom Price Summary & Create Action */}
              <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-t border-slate-800">
                <div>
                  <span className="text-[11px] text-slate-400 block font-medium">
                    {adminTotalInstallments} instalments · ₹{autoInstallmentRounded.toLocaleString("en-IN")} each
                  </span>
                  <span className="text-sm md:text-base font-black text-white font-mono">
                    Total price: ₹{finalNumericPrice.toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleRazorpayPayment}
                  disabled={isProcessing}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-slate-950 font-black text-xs md:text-sm shadow-lg shadow-cyan-500/20 transition-all hover:scale-105 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Zap size={14} />
                  {isProcessing ? "Processing..." : "Create Instalment"}
                </button>
              </div>
            </div>
          )}

          {/* Selected Tier Detail Card */}
          <div className="rounded-3xl border border-slate-800 bg-slate-950/90 p-5 sm:p-6 shadow-inner">
            {offerBadge && mergedTier.offerTitle && !isPayingInstallment && (
              <div className="mb-4 p-2.5 rounded-2xl bg-gradient-to-r from-red-500/10 via-rose-500/10 to-orange-500/10 border border-red-500/30 flex items-center justify-between gap-2">
                <span className="text-xs font-black text-red-400 flex items-center gap-1.5">
                  🎁 {mergedTier.offerTitle}
                </span>
                <span className="text-[10px] font-black text-white bg-gradient-to-r from-red-500 to-rose-600 px-2.5 py-0.5 rounded-lg shadow-md animate-pulse flex items-center gap-1">
                  <Flame size={10} /> {offerBadge} ACTIVE
                </span>
              </div>
            )}

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
                  {isPayingInstallment ? (
                    <>
                      <span className="text-2xl font-black text-amber-400 font-mono">
                        ₹{autoInstallmentRounded.toLocaleString("en-IN")}
                      </span>
                      <span className="text-xs text-slate-400 font-sans font-bold">
                        (Installment 1 of {adminTotalInstallments})
                      </span>
                    </>
                  ) : offerBadge ? (
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
                      {mergedTier.originalPrice && mergedTier.originalPrice !== mergedTier.price && (
                        <span className="text-xs text-slate-500 line-through font-mono">
                          {mergedTier.originalPrice}
                        </span>
                      )}
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
              : isPayingInstallment
              ? `Pay 1st Installment (₹${effectivePayAmount.toLocaleString("en-IN")}) with Razorpay`
              : `Pay ₹${effectivePayAmount.toLocaleString("en-IN")} with Razorpay`}
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
