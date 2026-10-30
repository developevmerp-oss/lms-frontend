"use client";

import React, { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";

export interface SecretItem {
  label: string;
  title: string;
  myth?: string;
  truth: string;
  image?: string;
}

export interface ThreeSecretsData {
  eyebrow?: string;
  heading: string;
  subheading: string;
  items: SecretItem[];
}

export interface LiveSeatsBannerData {
  heading: string;
  body: string;
  cta: string;
}

interface ThreeSecretsSectionProps {
  data?: ThreeSecretsData;
  bannerData?: LiveSeatsBannerData;
  onScrollToRegister?: () => void;
}

const DEFAULT_SECRETS: ThreeSecretsData = {
  eyebrow: "ON THE MASTERCLASS",
  heading: "The three secrets we'll unpack together",
  subheading:
    "Each one breaks a belief that keeps talented resin artists stuck — and replaces it with something that actually works.",
  items: [
    {
      label: "SECRET #1 — MASTERY",
      title: "Learn the right techniques in the right sequence",
      myth: "Most people believe more tutorials will eventually add up.",
      truth:
        "You'll see why random tutorials create confusion, and how structured learning accelerates progress — technique sequencing, premium skill development, a portfolio-building mindset and moving beyond random projects.",
    },
    {
      label: "SECRET #2 — MINDSET",
      title: "Become confident enough to own your creativity",
      myth: "Most people believe their work isn't good enough to be seen yet.",
      truth:
        "You'll learn how to move past fear of creating, comparison, the \"my work isn't good enough\" loop, fear of showing your work, and confusion about your artistic identity.",
    },
    {
      label: "SECRET #3 — MONETIZATION",
      title: "Turn your art into a real opportunity",
      myth: "Most people believe business skills come much later.",
      truth:
        "You'll understand the foundations of product selection, pricing, branding, marketing, customer attraction, community support and a practical business roadmap.",
    },
  ],
};

const DEFAULT_BANNER: LiveSeatsBannerData = {
  heading: "Live seats are limited",
  body: "Registration closes when the live-seat capacity is reached.",
  cta: "Yes — show me the 3 secrets",
};

const DEFAULT_CARD_IMAGES = [
  "/images/secrets/secret-1-mastery.jpg",
  "/images/secrets/secret-2-mindset.jpg",
  "/images/secrets/secret-3-monetization.jpg",
];

export default function ThreeSecretsSection({
  data = DEFAULT_SECRETS,
  bannerData = DEFAULT_BANNER,
  onScrollToRegister,
}: ThreeSecretsSectionProps) {
  const { eyebrow, heading, subheading, items } = data;
  const sectionRef = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="three-secrets"
      className="relative w-full py-14 sm:py-20 lg:py-24"
      style={{
        backgroundColor: "#ffffff",
        backgroundImage: "radial-gradient(circle, #e2ded4 1.5px, transparent 1.5px)",
        backgroundSize: "24px 24px",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="nav-width mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div
          className={`mx-auto mb-12 max-w-3xl text-center transition-all duration-700 ease-out sm:mb-16 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
        >
          {eyebrow && (
            <span className="mb-4 inline-flex items-center text-xs sm:text-base lg:text-xs font-semibold uppercase tracking-[0.18em] text-[#942008]">
              {eyebrow}
            </span>
          )}
          <h2 className="mb-4 text-3xl sm:text-5xl lg:text-5xl font-black tracking-tight text-neutral-950">
            The three secrets we'll <span className="text-[#942008]">unpack together</span>
          </h2>
          <p className="mx-auto max-w-2xl text-sm sm:text-xl lg:text-base text-neutral-600 leading-relaxed">
            {subheading}
          </p>
        </div>

        {/* ─── 3 Cards Grid: Responsive (1 col mobile, 2 col tablet, 3 col desktop) ─── */}
        <div className="mb-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6 lg:gap-7">
          {items.map((secret, idx) => {
            const cardImg = secret.image || DEFAULT_CARD_IMAGES[idx % DEFAULT_CARD_IMAGES.length];

            return (
              <div
                key={idx}
                style={{
                  transitionDelay: isVisible ? `${idx * 160}ms` : "0ms",
                }}
                className={`group relative flex flex-col justify-between overflow-hidden rounded-[24px] border border-[#eadfd4] bg-[#f7f6f0] p-4 shadow-[0_10px_30px_-15px_rgba(36,33,31,0.08)] transition-all duration-700 ease-out hover:-translate-y-2 hover:border-[#E86A24]/40 hover:shadow-[0_22px_45px_-12px_rgba(232,106,36,0.18)] sm:rounded-[28px] sm:p-5 lg:p-6 ${
                  isVisible
                    ? "translate-y-0 scale-100 opacity-100"
                    : "translate-y-12 scale-95 opacity-0"
                }`}
              >
                <div>
                  {/* Card Top Image matching 2nd Reference Image */}
                  <div className="relative mb-5 aspect-[16/11] w-full overflow-hidden rounded-[18px] bg-stone-100 sm:rounded-[20px]">
                    <img
                      src={cardImg}
                      alt={secret.title}
                      className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  </div>

                  {/* Dark Pill Badge */}
                  <div className="mb-3.5">
                    <span className="inline-flex items-center rounded-full bg-[#24211F] px-3.5 py-1 text-xs sm:text-sm lg:text-xs font-bold uppercase tracking-wider text-[#FAF7F4] shadow-xs">
                      {secret.label}
                    </span>
                  </div>

                  {/* Card Title */}
                  <h3 className="mb-3 text-base sm:text-xl lg:text-lg font-bold leading-snug tracking-tight text-neutral-950 transition-colors duration-300 group-hover:text-[#942008]">
                    {secret.title}
                  </h3>

                  {/* Myth Text (Subtle belief callout) */}
                  {secret.myth && (
                    <p className="mb-3 text-xs sm:text-base lg:text-sm italic leading-relaxed text-[#77716C]/85">
                      {secret.myth}
                    </p>
                  )}

                  {/* Truth / Main Body Text */}
                  <p className="text-xs sm:text-base lg:text-sm leading-relaxed text-neutral-600">
                    {secret.truth}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* ─── LIVE SEATS ARE LIMITED BANNER ─── */}
        <div
          className={`flex flex-col items-start justify-between gap-6 rounded-[24px] bg-[#24211F] p-6 text-white shadow-xl shadow-stone-900/10 transition-all duration-700 delay-500 ease-out sm:flex-row sm:items-center sm:rounded-[32px] sm:p-8 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          <div>
            <h3 className="text-xl sm:text-3xl lg:text-2xl font-bold text-[#FFFFFF]">
              {bannerData.heading}
            </h3>
            <p className="mt-1 text-xs sm:text-base lg:text-sm text-[#F4E9DF]/80">
              {bannerData.body}
            </p>
          </div>

          <button
            onClick={onScrollToRegister}
            className="group inline-flex h-12 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#E86A24] to-[#B94F1B] px-7 text-xs sm:text-base lg:text-sm font-semibold text-white shadow-lg shadow-[#E86A24]/25 transition-all duration-300 hover:scale-[1.03] hover:shadow-xl hover:shadow-[#E86A24]/40 active:scale-[0.98]"
          >
            <span>{bannerData.cta}</span>
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </section>
  );
}
