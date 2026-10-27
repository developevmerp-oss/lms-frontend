"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { API_BASE_URL, getImageUrl } from "@/config/api";

export interface InstallmentPlan {
  label?: string;
  enabled?: boolean;
  interval?: string;
  frequency?: string;
  totalInstallments?: number;
}

export interface LevelTier {
  id?: string;
  code?: string;
  name?: string;
  description?: string;
  price?: string;
  minPoints?: number;
  maxPoints?: number | null;
  icon?: string;
  badgeColor?: string;
  order?: number;
  category?: string;
  validityDays?: number | null;
  isPublished?: boolean;
  thumbnail?: string | null;
  image?: string | null;
  thumbnailUrl?: string | null;
  banner?: string | null;
  isPopular?: boolean;
  discountType?: "percentage" | "flat" | string | null;
  discountValue?: number | null;
  offerStartDate?: string | null;
  offerEndDate?: string | null;
  offerActive?: boolean;
  offerTitle?: string | null;
  installmentsEnabled?: boolean;
  totalInstallments?: number;
  installmentPlans?: InstallmentPlan[];
}

export interface LevelCourse {
  id?: string;
  levelCode?: string;
  level?: string;
  title: string;
  image?: string;
  flyerImage?: string | null;
  thumbnail?: string | null;
  thumbnailUrl?: string | null;
}

/**
 * Dynamically extract feature points strictly from backend data:
 * 1. Linked course titles from backend courses API
 * 2. Or parsed technique phrases from backend tier.description
 */
function getTierHighlights(tier: LevelTier, dynamicCourses: LevelCourse[]): string[] {
  if (dynamicCourses && dynamicCourses.length > 0) {
    return dynamicCourses.map((c) => c.title.replace(/^\d+\.\s*/, "").trim());
  }

  if (tier.description && tier.description.trim()) {
    return tier.description
      .replace(/\band\b/gi, ",")
      .split(/[,;\n•]+/)
      .map((p) => p.replace(/^\s*[-•*]\s*/, "").replace(/\.\s*$/, "").trim())
      .filter((p) => p.length > 2);
  }

  return [];
}

export default function JourneySec({
  levelTiers: propTiers,
  levelCourses: propCourses,
}: {
  levelTiers?: LevelTier[];
  levelCourses?: LevelCourse[];
}) {
  const [tiers, setTiers] = useState<LevelTier[]>(propTiers && propTiers.length > 0 ? propTiers : []);
  const [courses, setCourses] = useState<LevelCourse[]>(propCourses && propCourses.length > 0 ? propCourses : []);
  const [loading, setLoading] = useState<boolean>(!propTiers || propTiers.length === 0);

  // Sync state if parent supplies or updates props
  useEffect(() => {
    if (propTiers && propTiers.length > 0) {
      setTiers(propTiers);
      setLoading(false);
    }
  }, [propTiers]);

  useEffect(() => {
    if (propCourses && propCourses.length > 0) {
      setCourses(propCourses);
    }
  }, [propCourses]);

  // Fetch 100% dynamic data directly from backend API: http://localhost:5000/api/dashboard/levels
  useEffect(() => {
    let isMounted = true;

    const fetchDynamicData = async () => {
      try {
        const storedToken = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        const headers: Record<string, string> = storedToken ? { Authorization: `Bearer ${storedToken}` } : {};

        const [levelsRes, coursesRes] = await Promise.all([
          fetch(`${API_BASE_URL}/dashboard/levels`, { headers })
            .then((res) => (res.ok ? res.json() : []))
            .catch(() => []),
          fetch(`${API_BASE_URL}/dashboard/courses`, { headers })
            .then((res) => (res.ok ? res.json() : []))
            .catch(() => []),
        ]);

        if (!isMounted) return;

        if (Array.isArray(levelsRes) && levelsRes.length > 0) {
          setTiers(levelsRes);
        }

        let validCourses = Array.isArray(coursesRes) && coursesRes.length > 0 ? coursesRes : [];
        if (validCourses.length === 0) {
          const fallbackCourses = await fetch(`${API_BASE_URL}/courses`, { headers })
            .then((res) => (res.ok ? res.json() : []))
            .catch(() => []);
          if (Array.isArray(fallbackCourses) && fallbackCourses.length > 0) {
            validCourses = fallbackCourses;
          }
        }

        if (validCourses.length > 0) {
          setCourses(validCourses);
        }
      } catch (err) {
        console.error("Error fetching dynamic level data from backend:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchDynamicData();

    return () => {
      isMounted = false;
    };
  }, []);

  // Use strictly dynamic tiers from the API
  const activeTiers = (tiers.length > 0 ? tiers : (propTiers || []))
    .filter((t) => t.isPublished !== false)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  return (
    <section id="membership" className="journey-sec relative z-10 flex items-center bg-[#fcfbf9] py-16 sm:py-20 lg:py-24">
      <div className="nav-width page-rise">
        <div className="mb-8 max-w-2xl sm:mb-10 lg:mb-8">
          <p className="journey-kicker text-xs font-semibold uppercase tracking-widest text-orange-500">
            Level Progression
          </p>
          <h2 className="journey-heading mt-3 text-3xl font-black tracking-tight sm:text-4xl lg:text-4xl lg:leading-tight text-neutral-900">
            Choose Your Ravishing Journey
          </h2>
          <p className="journey-muted mt-3 text-sm leading-relaxed sm:text-base text-neutral-600">
            Wherever you are today, there is a next step for you.
          </p>
        </div>

        {/* Dynamic Cards Grid from API */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {loading && activeTiers.length === 0 ? (
            // Skeleton Loader while API is fetching
            [0, 1, 2, 3].map((n) => (
              <div
                key={n}
                className="journey-card flex h-[580px] flex-col justify-between rounded-[2rem] p-3.5 animate-pulse bg-white border border-stone-200/80 shadow-sm"
              >
                <div className="journey-panel flex flex-col rounded-[1.5rem] overflow-hidden bg-stone-100/70">
                  <div className="w-full aspect-[16/11] bg-stone-200/80" />
                  <div className="p-5 space-y-3">
                    <div className="h-4 w-24 bg-stone-200 rounded" />
                    <div className="h-3 w-36 bg-stone-200 rounded" />
                    <div className="h-7 w-3/4 bg-stone-200 rounded" />
                    <div className="h-8 w-1/2 bg-stone-200 rounded" />
                    <div className="h-10 w-full bg-stone-200 rounded" />
                  </div>
                </div>
                <div className="pt-5 px-3 space-y-2.5">
                  <div className="h-4 w-28 bg-stone-200 rounded" />
                  <div className="h-4 w-44 bg-stone-200 rounded" />
                  <div className="h-4 w-40 bg-stone-200 rounded" />
                  <div className="h-12 w-full bg-stone-200/80 rounded-xl mt-6" />
                </div>
              </div>
            ))
          ) : (
            activeTiers.map((tier, idx) => {
              const codeUpper = (tier.code || "").toUpperCase();

              // Match dynamic courses from backend for this level
              const dynamicCourses = courses.filter(
                (c) => (c.levelCode || c.level || "").toUpperCase() === codeUpper
              );

              // Purely dynamic information from backend LevelTier object
              const levelName = tier.name || tier.code || "Level";
              const levelDesc = tier.description || "";
              const price = tier.price || "";

              // Matching icons from reference image
              const icon =
                tier.icon ||
                (codeUpper === "L0" || idx === 0
                  ? "⚡"
                  : codeUpper === "L1" || idx === 1
                    ? "🎖️"
                    : codeUpper === "L2" || idx === 2
                      ? "🏆"
                      : "💎");

              // Dynamic badge tag from tier.code
              const badgeTag =
                codeUpper.startsWith("L") && !isNaN(Number(codeUpper.slice(1)))
                  ? `LEVEL ${codeUpper.slice(1)}`
                  : tier.code || `LEVEL ${idx}`;

              // Title strictly from backend LevelTier
              const displayTitle = levelName;

              // Category strictly from backend LevelTier
              const displayCategory = tier.category || "";

              // Color classes for level tag based on backend badgeColor or order
              const levelColorClass =
                tier.badgeColor === "emerald"
                  ? "text-[#059669]"
                  : tier.badgeColor === "indigo"
                    ? "text-[#4f46e5]"
                    : tier.badgeColor === "amber"
                      ? "text-[#b45309]"
                      : tier.badgeColor === "cyan"
                        ? "text-[#0891b2]"
                        : idx === 0
                          ? "text-[#c2410c]"
                          : idx === 1
                            ? "text-[#4f46e5]"
                            : idx === 2
                              ? "text-[#b45309]"
                              : "text-[#7c3aed]";

              // Highlights purely dynamic from API
              const allHighlights = getTierHighlights(tier, dynamicCourses);
              const visibleHighlights = allHighlights.slice(0, 3);
              const remainingCount = allHighlights.length > 3 ? allHighlights.length - 3 : 0;

              const isMainCertification =
                Boolean(tier.isPopular) ||
                codeUpper === "L3" ||
                levelName.toLowerCase().includes("certification");

              // Dynamic thumbnail strictly from backend
              const courseWithImage = dynamicCourses.find(
                (c) => Boolean(c.image || c.flyerImage || c.thumbnail || c.thumbnailUrl)
              );

              const dynamicThumbnail =
                tier.thumbnail ||
                tier.image ||
                tier.thumbnailUrl ||
                tier.banner ||
                courseWithImage?.image ||
                courseWithImage?.flyerImage ||
                courseWithImage?.thumbnail ||
                courseWithImage?.thumbnailUrl ||
                null;

              const thumbnailSrc = dynamicThumbnail ? getImageUrl(dynamicThumbnail) : null;

              // Dynamic CTA button
              const buttonText =
                codeUpper === "L3" || levelName.toLowerCase().includes("certification")
                  ? "Apply for Certification"
                  : codeUpper === "L0"
                    ? "Explore Fast Track"
                    : `Explore ${displayTitle.split(":")[0].trim()}`;

              const buttonHref = codeUpper === "L1" ? "/register" : "/webinar";

              // Validity text strictly dynamic from backend validityDays
              const validityText =
                tier.validityDays !== undefined && tier.validityDays !== null
                  ? tier.validityDays === 0
                    ? "Lifetime Access"
                    : tier.validityDays >= 365
                      ? `${Math.round(tier.validityDays / 365)} Years Access`
                      : `${tier.validityDays} Days Access`
                  : null;

              // EMI handling strictly dynamic from backend tier
              const hasEmi = Boolean(tier.installmentsEnabled);
              const emiParts = tier.totalInstallments || 3;

              return (
                <article
                  key={tier.id || tier.code || idx}
                  className={`journey-card journey-wash-${idx % 4} flex h-full flex-col justify-between rounded-[2rem] p-3 sm:p-3.5 bg-white border border-stone-200/80 shadow-[0_10px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] transition-all duration-300`}
                >
                  {/* Top Colored Hero Block */}
                  <div className="journey-panel flex flex-col rounded-[1.5rem] overflow-hidden">
                    {/* Image Banner strictly if provided by backend */}
                    {thumbnailSrc ? (
                      <div className="relative w-full aspect-[16/11] bg-stone-100 overflow-hidden">
                        <img
                          src={thumbnailSrc}
                          alt={displayTitle}
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                          onError={(e) => {
                            const parent = (e.target as HTMLElement).parentElement;
                            if (parent) parent.style.display = "none";
                          }}
                        />
                        {isMainCertification && (
                          <div className="absolute top-3.5 right-3.5 z-10">
                            <span className="journey-cert inline-flex items-center gap-1 bg-white/95 backdrop-blur-sm text-[#ea580c] text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm border border-orange-200/40">
                              ★ MAIN CERTIFICATION
                            </span>
                          </div>
                        )}
                      </div>
                    ) : null}

                    {/* Content inside top hero panel */}
                    <div className="p-5 sm:p-5.5 flex flex-col flex-1">
                      {/* Level Tag & Icon */}
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm select-none" aria-hidden="true">
                          {icon}
                        </span>
                        <p className={`text-[11px] font-black uppercase tracking-wider ${levelColorClass}`}>
                          {badgeTag}
                        </p>
                      </div>

                      {/* Category • Validity */}
                      {(displayCategory || validityText) && (
                        <div className="mt-1 flex items-center gap-1.5 text-[10px] sm:text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">
                          {displayCategory && <span>{displayCategory}</span>}
                          {displayCategory && validityText && <span>•</span>}
                          {validityText && <span>{validityText}</span>}
                        </div>
                      )}

                      {/* Title */}
                      <h3 className="journey-title mt-3 text-2xl sm:text-[1.65rem] font-bold text-neutral-900 tracking-tight leading-snug">
                        {displayTitle}
                      </h3>

                      {/* Price */}
                      {price && (
                        <p className="journey-price mt-2 text-3xl sm:text-[2.1rem] font-black text-neutral-950 tracking-tight">
                          {price}
                        </p>
                      )}

                      {/* Dynamic Campaign Offer if active */}
                      {tier.offerActive && (
                        <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-600 text-[10px] font-bold">
                          <span>🎁</span>
                          <span>{tier.offerTitle || "Special Offer"}</span>
                          {Boolean(tier.discountValue && tier.discountValue > 0) && (
                            <span>
                              ({tier.discountType === "percentage" ? `${tier.discountValue}%` : `₹${tier.discountValue}`} OFF)
                            </span>
                          )}
                        </div>
                      )}

                      {/* Description */}
                      {levelDesc && (
                        <p className="journey-desc mt-2.5 text-[13px] leading-relaxed text-neutral-600">
                          {levelDesc}
                        </p>
                      )}

                      {/* EMI / Installment Badge */}
                      {hasEmi && (
                        <div className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#eafaf1] px-3 py-2 text-[11px] sm:text-xs font-bold text-[#047857]">
                          <span className="text-sm select-none">💳</span>
                          <span>EMI / Installment Plans Available ({emiParts} parts)</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Bottom White Section: What's included + Features + CTA */}
                  <div className="flex-1 flex flex-col justify-between pt-5 px-3 sm:px-4 pb-1">
                    <div>
                      <p className="text-sm font-bold text-neutral-900 mb-3">
                        What&apos;s included
                      </p>

                      <ul className="space-y-2.5">
                        {visibleHighlights.map((feature, fIdx) => (
                          <li key={fIdx} className="flex items-center gap-2.5 text-sm text-neutral-700 font-medium">
                            <div className="w-4 h-4 rounded-full bg-[#16a34a] text-white flex items-center justify-center shrink-0 shadow-sm">
                              <svg className="w-2.5 h-2.5 stroke-white stroke-[3.5] fill-none" viewBox="0 0 24 24">
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                            </div>
                            <span className="leading-tight">{feature}</span>
                          </li>
                        ))}
                      </ul>

                      {remainingCount > 0 && (
                        <p className="mt-2.5 text-xs text-neutral-400 font-medium pl-6.5">
                          + {remainingCount} More Modules Included
                        </p>
                      )}
                    </div>

                    {/* CTA Button */}
                    <Link
                      href={buttonHref}
                      className="journey-btn mt-6 w-full inline-flex items-center justify-center gap-2 bg-[#18181b] hover:bg-neutral-900 active:scale-[0.99] text-white font-bold text-sm py-3.5 px-4 rounded-xl transition-all shadow-sm"
                    >
                      <span>{buttonText}</span>
                      <ArrowRight size={16} aria-hidden="true" />
                    </Link>
                  </div>
                </article>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
