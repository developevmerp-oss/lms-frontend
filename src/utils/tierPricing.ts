/**
 * Shared utility for dynamic tier pricing, numeric conversion, and level-wide special offer calculations.
 */

export interface ApplicableTierOffer {
  id: string;
  title: string;
  discountType: "percentage" | "flat" | string;
  discountValue: number;
  discountLabel: string;
  startDate?: string | null;
  endDate?: string | null;
  formattedEndDate?: string | null;
  finalNumericPrice: number;
  finalPrice: string;
}

export interface ComputedTierPricing {
  levelCode: string;
  name: string;
  basePrice: string; // e.g. "₹499" or updated "₹299"
  baseNumericPrice: number; // e.g. 499 or 299
  hasOffer: boolean;
  finalNumericPrice: number; // e.g. 239 (after discount)
  finalPrice: string; // e.g. "₹239"
  originalPrice: string; // e.g. "₹499"
  discountLabel: string | null; // e.g. "20% OFF" or "₹1,000 OFF"
  offerTitle: string | null; // e.g. "Diwali Special Offer"
  offerStartDate?: string | null;
  offerEndDate?: string | null;
  formattedEndDate?: string | null;
  discountType?: "percentage" | "flat" | string;
  discountValue?: number;
  applicableOffers: ApplicableTierOffer[];
}

export const FALLBACK_TIER_PRICES: Record<string, { name: string; price: string; numericPrice: number; originalPrice: string }> = {
  L0: { name: "Fast Track", price: "₹499", numericPrice: 499, originalPrice: "₹2,499" },
  L1: { name: "Silver Member", price: "₹4,999", numericPrice: 4999, originalPrice: "₹9,999" },
  L2: { name: "Gold Member", price: "₹19,999", numericPrice: 19999, originalPrice: "₹34,999" },
  L3: { name: "Diamond Club", price: "₹59,999", numericPrice: 59999, originalPrice: "₹99,999" },
  "L3+": { name: "Masters Club", price: "Exclusive", numericPrice: 0, originalPrice: "Exclusive" },
};

/**
 * Formats an offer expiry date to clean human-readable date and time.
 */
export function formatOfferExpiryDate(dateStr?: string | Date | null): string | null {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return null;

  const hasTime = d.getHours() !== 0 || d.getMinutes() !== 0;
  if (hasTime) {
    return d.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/**
 * Extracts a clean integer numeric price from strings like "₹499", "₹4,999", "299", or numbers.
 */
export function parseNumericPrice(priceStr?: string | number | null): number {
  if (typeof priceStr === "number") return Math.round(priceStr);
  if (!priceStr) return 0;
  const cleaned = String(priceStr).replace(/[^0-9.]/g, "");
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : Math.round(num);
}

/**
 * Calculates the dynamic base price, applied special campaign offers, and final checkout price for any Level Tier.
 * Returns all active applicable offers with formatted expiry dates.
 */
export function getComputedTierPricing(
  tierCodeInput: string,
  liveTiers: any[] = [],
  campaignOffers: any[] = []
): ComputedTierPricing {
  const code = (tierCodeInput || "L0").toUpperCase();
  const fallback = FALLBACK_TIER_PRICES[code] || FALLBACK_TIER_PRICES.L0;

  // 1. Find live tier from database
  const liveTier = liveTiers.find(
    (t: any) => (t.code || t.levelCode || "").toUpperCase() === code
  );

  const name = liveTier?.name || fallback.name;
  const rawBasePrice = liveTier?.price || fallback.price;
  const baseNumericPrice = parseNumericPrice(rawBasePrice) || fallback.numericPrice;
  const basePrice = `₹${baseNumericPrice.toLocaleString("en-IN")}`;

  const now = new Date();

  // 2. Check for matching active campaign offers from LevelOffers module
  const matchingCampaignOffers = (campaignOffers || []).filter((co: any) => {
    if (!co || co.isActive === false) return false;
    const coLevel = (co.levelCode || "").toUpperCase();
    if (coLevel !== "ALL" && coLevel !== code) return false;
    if (co.startDate && new Date(co.startDate) > now) return false;
    if (co.endDate && new Date(co.endDate) < now) return false;
    if (!co.discountValue || parseFloat(co.discountValue) <= 0) return false;
    return true;
  });

  // 3. Or check built-in offer on the LevelTier model itself
  const hasBuiltIn =
    liveTier?.offerActive &&
    liveTier?.discountValue &&
    (!liveTier.offerStartDate || new Date(liveTier.offerStartDate) <= now) &&
    (!liveTier.offerEndDate || new Date(liveTier.offerEndDate) >= now);

  const builtInOffer = hasBuiltIn
    ? {
        id: `builtin-${code}`,
        title: liveTier.offerTitle || "Special Level Offer 🔥",
        discountType: liveTier.discountType || "percentage",
        discountValue: liveTier.discountValue,
        startDate: liveTier.offerStartDate,
        endDate: liveTier.offerEndDate,
      }
    : null;

  const rawOffers: any[] = [...matchingCampaignOffers];
  if (builtInOffer && !rawOffers.some((o) => o.title === builtInOffer.title)) {
    rawOffers.push(builtInOffer);
  }

  // Map each active offer into an ApplicableTierOffer with expiry details
  const applicableOffers: ApplicableTierOffer[] = rawOffers.map((off: any, idx: number) => {
    const discVal = parseFloat(off.discountValue) || 0;
    const isPercent = (off.discountType || "percentage") === "percentage";
    let finalNum = baseNumericPrice;
    let label = "";

    if (isPercent) {
      const discountAmount = (baseNumericPrice * discVal) / 100;
      finalNum = Math.max(0, Math.round(baseNumericPrice - discountAmount));
      label = `${discVal}% OFF`;
    } else {
      finalNum = Math.max(0, Math.round(baseNumericPrice - discVal));
      label = `₹${discVal.toLocaleString("en-IN")} OFF`;
    }

    return {
      id: off.id || `offer-${idx}`,
      title: off.title || "Special Offer",
      discountType: isPercent ? "percentage" : "flat",
      discountValue: discVal,
      discountLabel: label,
      startDate: off.startDate || null,
      endDate: off.endDate || null,
      formattedEndDate: formatOfferExpiryDate(off.endDate),
      finalNumericPrice: finalNum,
      finalPrice: `₹${finalNum.toLocaleString("en-IN")}`,
    };
  });

  if (applicableOffers.length > 0 && baseNumericPrice > 0) {
    // Select the best discount for the primary display
    const bestOffer = applicableOffers.reduce((best, curr) =>
      curr.finalNumericPrice < best.finalNumericPrice ? curr : best,
      applicableOffers[0]
    );

    return {
      levelCode: code,
      name,
      basePrice,
      baseNumericPrice,
      hasOffer: true,
      finalNumericPrice: bestOffer.finalNumericPrice,
      finalPrice: bestOffer.finalPrice,
      originalPrice: basePrice,
      discountLabel: bestOffer.discountLabel,
      offerTitle: bestOffer.title,
      offerStartDate: bestOffer.startDate || null,
      offerEndDate: bestOffer.endDate || null,
      formattedEndDate: bestOffer.formattedEndDate || null,
      discountType: bestOffer.discountType,
      discountValue: bestOffer.discountValue,
      applicableOffers,
    };
  }

  // No active offer
  return {
    levelCode: code,
    name,
    basePrice,
    baseNumericPrice,
    hasOffer: false,
    finalNumericPrice: baseNumericPrice,
    finalPrice: basePrice,
    originalPrice: fallback.originalPrice || basePrice,
    discountLabel: null,
    offerTitle: null,
    offerStartDate: null,
    offerEndDate: null,
    formattedEndDate: null,
    applicableOffers: [],
  };
}

/**
 * Resolves whether a course has an offer either from its own individual course settings OR from its parent level offer.
 */
export function getCourseResolvedOffer(
  course: any,
  tierPricing: ComputedTierPricing
) {
  // If the course has its own individual offer configured and active
  if (course?.offerActive && course?.discountValue) {
    const now = new Date();
    if (!course.offerStartDate || new Date(course.offerStartDate) <= now) {
      if (!course.offerEndDate || new Date(course.offerEndDate) >= now) {
        const discVal = parseFloat(course.discountValue) || 0;
        const baseNum = tierPricing.baseNumericPrice;
        let finalNum = baseNum;

        if (course.discountType === "percentage") {
          finalNum = Math.max(0, Math.round(baseNum - (baseNum * discVal) / 100));
        } else {
          finalNum = Math.max(0, Math.round(baseNum - discVal));
        }

        return {
          hasOffer: true,
          originalPrice: tierPricing.basePrice,
          discountedPrice: `₹${finalNum.toLocaleString("en-IN")}`,
          discountLabel: course.discountType === "percentage" ? `${discVal}% OFF` : `₹${discVal} OFF`,
          offerTitle: course.title || "Course Special Offer",
        };
      }
    }
  }

  // If the parent level has an active special offer
  if (tierPricing.hasOffer) {
    return {
      hasOffer: true,
      originalPrice: tierPricing.originalPrice,
      discountedPrice: tierPricing.finalPrice,
      discountLabel: tierPricing.discountLabel,
      offerTitle: tierPricing.offerTitle,
    };
  }

  return null;
}
