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
  "flex h-12 w-full rounded-xl border border-[#eadfd4] bg-white py-2 pl-11 pr-4 text-sm text-stone-900 placeholder-stone-400 transition focus:border-orange-400 focus:outline-none focus:ring-1 focus:ring-orange-400/40";

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
    <section className="webinar-hero relative overflow-hidden">
      <div className="nav-width webinar-hero-grid relative grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(440px,520px)] lg:gap-8 pt-8">
        <div>
          <span className="mb-5 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#c45a28]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#e36b32]" />
            <Sparkles size={13} className="sr-only" />
            Free live masterclass
          </span>

          <h1 className="mb-5 max-w-xl text-[2rem] font-semibold leading-[1.02] tracking-tight text-stone-950 sm:text-5xl lg:text-[3.2rem]">
            From Resin Art Passion
            <span className="mt-1 block text-[#c56a45]">to a ₹3 Lakh/Month</span>
            <span className="block text-[#c56a45]">Business</span>
            <span className="mt-4 block max-w-md text-[1.35rem] font-semibold leading-snug text-stone-950 sm:text-[1.65rem]">
              — Without Random Tutorials, Self-Doubt or Guesswork.
            </span>
          </h1>

          <p className="mb-7 max-w-xl text-sm leading-relaxed text-stone-600 sm:text-base">
            Join the Resin Mastery Masterclass and discover the 3 secrets to mastering premium resin skills, creating a signature portfolio and turning your art into a business with a clear roadmap.
          </p>

          <blockquote className="mb-7 max-w-xl border-l-2 border-[#e7c3ae] pl-4 text-sm italic leading-relaxed text-stone-600 sm:text-[15px]">
            &quot;You don&apos;t need more random tutorials. You need the right skills, the confidence to own your creativity, and a roadmap that shows you how to turn what you love into something people will pay for.&quot;
          </blockquote>

          <div className="mb-7 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onScrollToRegister}
              className="inline-flex h-12 cursor-pointer items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#e36b32] to-[#f08a45] px-6 text-sm font-semibold text-white shadow-[0_12px_24px_-12px_rgba(227,107,50,0.8)] transition hover:from-orange-600 hover:to-amber-600"
            >
              Yes! I want my free seat
              <ArrowRight className="size-4" />
            </button>
            <button
              type="button"
              onClick={onUnlockAndScroll}
              className="inline-flex h-12 cursor-pointer items-center justify-center gap-2 rounded-full border border-[#eadfd4] bg-white px-6 text-sm font-semibold text-stone-800 shadow-sm transition hover:border-orange-300"
            >
              <Play className="size-3.5 fill-current" />
              Show me what I&apos;ll learn
            </button>
          </div>

          <p className="mb-7 text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">
            100% Free • Live Masterclass • Limited Seats
          </p>

          <div className="mb-6.5 inline-flex items-center gap-3">
            <div className="h-11 w-11 shrink-0 overflow-hidden rounded-full border-2 border-white shadow-sm">
              <img src="/images/mentor/vrajangna-portrait.jpg" alt="Vrajangna Patel" className="h-full w-full object-cover" />
            </div>
            <div>
              <p className="text-sm font-semibold text-stone-950">Vrajangna Patel</p>
              <p className="text-xs font-semibold text-stone-500">54,000+ webinar attendees</p>
            </div>
          </div>

          <dl className="mb-6.5 grid grid-cols-2 gap-x-4 gap-y-3 sm:flex sm:flex-wrap sm:items-center sm:gap-x-6">
            {details.map((item) => (
              <div key={item.label} className="flex items-center gap-2">
                <item.icon size={16} className="shrink-0 text-[#c56a45]" />
                <div>
                  <dt className="text-[10px] font-semibold uppercase tracking-wider text-stone-400">{item.label}</dt>
                  <dd className="text-sm font-semibold text-stone-800">{item.value}</dd>
                </div>
              </div>
            ))}
          </dl>

          <div className="mb-5.5">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">Live Masterclass Starts In:</p>
            <WebinarCountdown onWebinarLoaded={onWebinarLoaded} />
          </div>

          <p className="max-w-xl text-base font-semibold text-[#c45a28]">
            Don&apos;t just learn resin. Learn how to make your resin skills matter in the market.
          </p>
        </div>

        <div id="register" className="webinar-hero-card scroll-mt-24">
          <div className="rounded-[1.75rem] border border-white/80 bg-white p-5 shadow-[0_28px_60px_-28px_rgba(90,55,20,0.45)] sm:p-7">
            <h2 className="text-2xl font-semibold tracking-tight text-stone-950">Reserve your free seat</h2>
            <p className="mb-4 mt-1 text-sm text-stone-500">Where should we send your Masterclass details?</p>

            <div className="mb-5 rounded-2xl border border-[#f3d3c0] bg-[#fff6f0] p-3.5">
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="inline-flex items-center gap-1.5 font-bold text-[#c45a28]">
                  <Users size={16} className="text-[#c45a28]" />
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
              <p className="mt-2 text-[11px] font-medium text-stone-500">Once the room is full, registration closes for this date.</p>
            </div>

            {error && (
              <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-center text-xs text-red-400">{error}</div>
            )}

            <form onSubmit={onSubmit} className="webinar-hero-form space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-700" htmlFor="lead-name">
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
                <label className="text-xs font-semibold text-stone-700" htmlFor="lead-email">
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
                <label className="text-xs font-semibold text-stone-700" htmlFor="lead-phone">
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
                <label className="text-xs font-semibold text-stone-700" htmlFor="lead-message">
                  Your biggest challenge right now <span className="font-normal lowercase text-stone-400">(optional)</span>
                </label>
                <div className="relative">
                  <MessageSquare size={16} className="pointer-events-none absolute left-4 top-3.5 text-stone-400" />
                  <textarea
                    className="flex min-h-[76px] w-full resize-none rounded-xl border border-[#eadfd4] bg-white py-2.5 pl-11 pr-4 text-sm text-stone-900 placeholder-stone-400 transition focus:border-orange-400 focus:outline-none focus:ring-1 focus:ring-orange-400/40"
                    id="lead-message"
                    placeholder="e.g. I don't know which resin techniques to learn first, or how to price my work."
                    rows={3}
                    value={form.challenge}
                    onChange={(event) => onUpdate("challenge", event.target.value)}
                  />
                </div>
              </div>

              <label className="flex cursor-pointer items-start gap-2.5 pt-1 text-xs leading-relaxed text-stone-500">
                <input
                  type="checkbox"
                  checked={form.consent}
                  onChange={(event) => onUpdate("consent", event.target.checked)}
                  className="mt-0.5 size-4 shrink-0 cursor-pointer rounded border-[#eadfd4] text-orange-500 focus:ring-0"
                />
                <span>
                  I agree to receive webinar reminders, resources and relevant updates from Ravishing Art Hub Learning Academy LLP via email and WhatsApp.
                </span>
              </label>

              <button
                className="inline-flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#e36b32] to-[#f08a45] px-8 text-sm font-semibold text-white shadow-lg shadow-orange-500/25 transition hover:from-orange-600 hover:to-amber-600 disabled:opacity-60"
                type="submit"
                disabled={loading}
              >
                {loading ? "Securing Your Seat..." : "Yes! I want my free seat"}
                {!loading && <ArrowRight className="size-4" />}
              </button>

              <p className="pt-1 text-center text-xs text-stone-500">
                Your confirmation and Zoom joining link are emailed the moment you register — check your inbox.
              </p>

              <ul className="grid grid-cols-3 gap-2 pt-1 text-center text-[11px] font-semibold text-stone-500">
                <li className="flex flex-col items-center gap-1">
                  <Wifi size={15} className="text-[#c56a45]" />
                  100% free to attend
                </li>
                <li className="flex flex-col items-center gap-1">
                  <Clock size={15} className="text-[#c56a45]" />
                  Live 90-minute session
                </li>
                <li className="flex flex-col items-center gap-1">
                  <Gift size={15} className="text-[#c56a45]" />
                  Clarity Kit included
                </li>
              </ul>
            </form>

            <div className="mt-5.5 flex gap-3 rounded-2xl border border-[#eadfd4] bg-[#fbf7f3] p-4">
              <ShieldCheck className="mt-0.5 size-5 shrink-0 text-[#c45a28]" />
              <div>
                <p className="text-xs font-semibold text-stone-950">No credit card required</p>
                <p className="mt-0.5 text-[11px] leading-relaxed text-stone-500">
                  Registration is completely free. Your details are used only for webinar communications and relevant updates — never sold.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
