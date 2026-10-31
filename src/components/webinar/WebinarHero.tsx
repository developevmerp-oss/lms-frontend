"use client";

import type { FormEvent } from "react";
import {
  ArrowRight,
  Calendar,
  Clock,
  Gift,
  Globe,
  Mail,
  MessageSquare,
  Phone,
  Play,
  ShieldCheck,
  Sparkles,
  User,
  Users,
  Video,
  Wifi,
} from "lucide-react";
import { WebinarCountdown } from "@/components/webinar/WebinarCountdown";

type HeroForm = {
  name: string;
  email: string;
  phone: string;
  challenge: string;
  consent: boolean;
};

type WebinarHeroProps = {
  displayDateStr: string;
  displayTimeStr: string;
  displayDurationStr: string;
  stats: {
    seatsRemaining: number;
    percentFull: number;
  };
  error: string;
  loading: boolean;
  form: HeroForm;
  onUpdate: (field: string, val: string | boolean) => void;
  onSubmit: (event: FormEvent) => void;
  onScrollToRegister: () => void;
  onUnlockAndScroll: () => void;
  onWebinarLoaded: (webinar: any) => void;
};

const inputClass =
  "flex h-11 sm:h-12 lg:h-12 w-full rounded-xl border border-[#eadfd4] bg-white py-2.5 pl-11 pr-4 text-sm sm:text-base md:text-base lg:text-base text-stone-900 placeholder-stone-400 transition focus:border-orange-400 focus:outline-none focus:ring-1 focus:ring-orange-400/40 shadow-sm";

export default function WebinarHero({
  displayDateStr,
  displayTimeStr,
  displayDurationStr,
  stats,
  error,
  loading,
  form,
  onUpdate,
  onSubmit,
  onScrollToRegister,
  onUnlockAndScroll,
  onWebinarLoaded,
}: WebinarHeroProps) {
  const details = [
    { icon: Calendar, label: "Date", value: displayDateStr },
    { icon: Clock, label: "Time", value: displayTimeStr },
    { icon: Globe, label: "Language", value: "Hindi + English" },
    { icon: Video, label: "Duration", value: displayDurationStr },
  ];

  return (
    <section className="webinar-hero relative flex items-center justify-center overflow-hidden w-full">
      <div className="nav-width webinar-hero-grid relative grid items-center justify-center gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(420px,480px)] lg:gap-10 xl:gap-14">
        <div className="flex flex-col justify-center">
          <h1 className="mb-4 max-w-xl text-3xl sm:text-5xl md:text-5xl lg:text-[3.25rem] xl:text-[3.5rem] font-black leading-[1.08] tracking-tight text-neutral-950">
            From Resin Art Passion
            <span className="mt-1 block text-[#942008]">to a ₹3 Lakh/Month</span>
            <span className="block text-[#942008]">Business</span>
            <span className="mt-3 block max-w-md text-lg sm:text-2xl md:text-2xl lg:text-2xl font-bold leading-snug text-neutral-950">
              — Without Random Tutorials, Self-Doubt or Guesswork.
            </span>
          </h1>

          <p className="mb-4 max-w-xl text-lg sm:text-xl md:text-xl lg:text-lg leading-relaxed text-neutral-600">
            Join the Resin Mastery Masterclass and discover the 3 secrets to mastering premium resin skills, creating a signature portfolio and turning your art into a business with a clear roadmap.
          </p>

          <blockquote className="mb-5 max-w-xl border-l-2 border-[#942008] pl-4 text-base sm:text-lg md:text-lg lg:text-base italic leading-relaxed text-neutral-600">
            &quot;You don&apos;t need more random tutorials. You need the right skills, the confidence to own your creativity, and a roadmap that shows you how to turn what you love into something people will pay for.&quot;
          </blockquote>

          <div className="mb-5 inline-flex items-center gap-3">
            <div className="h-12 w-12 sm:h-12 sm:w-12 shrink-0 overflow-hidden rounded-full border-2 border-white shadow-sm">
              <img src="/images/mentor/vrajangna-portrait.jpg" alt="Vrajangna Patel" className="h-full w-full object-cover" />
            </div>
            <div>
              <p className="text-lg sm:text-xl md:text-xl lg:text-base font-semibold text-neutral-950">Vrajangna Patel</p>
              <p className="text-sm sm:text-base md:text-base lg:text-sm font-semibold text-neutral-500">54,000+ webinar attendees</p>
            </div>
          </div>

          <dl className="mb-5 grid grid-cols-2 gap-x-4 gap-y-2.5 sm:flex sm:flex-wrap sm:items-center sm:gap-x-6">
            {details.map((item) => (
              <div key={item.label} className="flex items-center gap-2">
                <item.icon size={16} className="shrink-0 text-[#942008]" />
                <div>
                  <dt className="text-sm sm:text-base md:text-base lg:text-xs font-semibold uppercase tracking-wider text-neutral-400">{item.label}</dt>
                  <dd className="text-sm sm:text-base md:text-base lg:text-base font-semibold text-neutral-800">{item.value}</dd>
                </div>
              </div>
            ))}
          </dl>

          <div className="mb-4">
            <p className="mb-2 text-xs sm:text-base md:text-base lg:text-sm font-semibold uppercase tracking-[0.14em] text-neutral-500">Live Masterclass Starts In:</p>
            <WebinarCountdown onWebinarLoaded={onWebinarLoaded} />
          </div>

          <p className="max-w-xl text-base sm:text-xl md:text-xl lg:text-lg font-semibold text-[#942008]">
            Don&apos;t just learn resin. Learn how to make your resin skills matter in the market.
          </p>
        </div>

        <div id="register" className="webinar-hero-card scroll-mt-24 w-full max-w-[480px] justify-self-center lg:justify-self-end">
          <div className="rounded-[1.75rem] border border-white/80 bg-white p-6 sm:p-7 md:p-8 shadow-[0_28px_60px_-28px_rgba(90,55,20,0.45)]">
            <h2 className="text-2xl sm:text-3xl md:text-3xl lg:text-2xl font-black tracking-tight text-neutral-950">Reserve your free seat</h2>
            <p className="mb-4 mt-1 text-sm sm:text-base md:text-base lg:text-base text-neutral-500">Where should we send your Masterclass details?</p>

            <div className="mb-5 rounded-2xl border border-[#f3d3c0] bg-[#fff6f0] p-3.5 sm:p-4">
              <div className="flex items-center justify-between text-sm sm:text-base md:text-base lg:text-base">
                <span className="inline-flex items-center gap-1.5 font-bold text-[#942008]">
                  <Users size={16} className="text-[#942008]" />
                  {stats.seatsRemaining} live seats left
                </span>
                <span className="font-bold text-emerald-600">{stats.percentFull}% full</span>
              </div>
              <div className="mt-2.5 h-2 overflow-hidden rounded-full bg-[#f3d3c0]" role="progressbar" aria-valuenow={stats.percentFull} aria-valuemin={0} aria-valuemax={100}>
                <div
                  className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-400 transition-all duration-1000"
                  style={{ width: `${stats.percentFull}%` }}
                />
              </div>
              <p className="mt-2 text-sm sm:text-sm md:text-sm lg:text-sm font-medium text-stone-500">Once the room is full, registration closes for this date.</p>
            </div>

            {error && (
              <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-center text-xs sm:text-sm text-red-400">{error}</div>
            )}

            <form onSubmit={onSubmit} className="webinar-hero-form space-y-3.5 sm:space-y-4">
              <div className="space-y-1.5">
                <label className="block text-sm sm:text-base md:text-base lg:text-sm font-semibold text-stone-700" htmlFor="lead-name">
                  Full name
                </label>
                <div className="relative">
                  <User size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    className={inputClass}
                    id="lead-name"
                    placeholder="Jane Doe"
                    autoComplete="name"
                    required
                    value={form.name}
                    onChange={(event) => onUpdate("name", event.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm sm:text-base md:text-base lg:text-sm font-semibold text-stone-700" htmlFor="lead-email">
                  Email address
                </label>
                <div className="relative">
                  <Mail size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="email"
                    className={inputClass}
                    id="lead-email"
                    placeholder="jane@example.com"
                    autoComplete="email"
                    required
                    value={form.email}
                    onChange={(event) => onUpdate("email", event.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm sm:text-base md:text-base lg:text-sm font-semibold text-stone-700" htmlFor="lead-phone">
                  WhatsApp number
                </label>
                <div className="relative">
                  <Phone size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="tel"
                    className={inputClass}
                    id="lead-phone"
                    placeholder="+91 98765 43210"
                    autoComplete="tel"
                    value={form.phone}
                    onChange={(event) => onUpdate("phone", event.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm sm:text-base md:text-base lg:text-sm font-semibold text-stone-700" htmlFor="lead-message">
                  Your biggest challenge right now <span className="font-normal lowercase text-stone-400">(optional)</span>
                </label>
                <div className="relative">
                  <MessageSquare size={16} className="pointer-events-none absolute left-4 top-3.5 text-stone-400" />
                  <textarea
                    className="flex min-h-[76px] sm:min-h-[82px] w-full resize-none rounded-xl border border-[#eadfd4] bg-white py-2.5 pl-11 pr-4 text-sm sm:text-base md:text-base lg:text-base text-stone-900 placeholder-stone-400 transition focus:border-orange-400 focus:outline-none focus:ring-1 focus:ring-orange-400/40 shadow-sm"
                    id="lead-message"
                    placeholder="e.g. I don't know which resin techniques to learn first, or how to price my work."
                    rows={3}
                    value={form.challenge}
                    onChange={(event) => onUpdate("challenge", event.target.value)}
                  />
                </div>
              </div>

              <button
                className="mt-2 inline-flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#e36b32] to-[#f08a45] px-8 text-base sm:text-lg md:text-lg lg:text-base font-semibold text-white shadow-lg shadow-orange-500/25 transition hover:from-orange-600 hover:to-amber-600 disabled:opacity-60"
                type="submit"
                disabled={loading}
              >
                {loading ? "Securing Your Seat..." : "Yes! I want my free seat"}
                {!loading && <ArrowRight className="size-4" />}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}