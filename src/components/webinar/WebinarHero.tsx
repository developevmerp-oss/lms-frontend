"use client";

import React, { useEffect } from "react";
import type { FormEvent } from "react";
import {
  ArrowRight,
  Calendar,
  Clock,
  Globe,
  Mail,
  MessageSquare,
  User,
  Users,
  Video,
  AlertCircle,
} from "lucide-react";
import { WebinarCountdown } from "@/components/webinar/WebinarCountdown";
import { useForm, type FieldErrors } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { IndiaFlag } from "@/components/ui/IndiaFlag";

export type HeroForm = {
  name: string;
  email: string;
  phone: string;
  challenge: string;
  consent: boolean;
};

export type WebinarFormData = {
  name: string;
  email: string;
  phone: string;
  challenge?: string;
};

export type WebinarHeroProps = {
  displayDateStr: string;
  displayTimeStr: string;
  displayDurationStr: string;
  stats: {
    seatsRemaining: number;
    percentFull: number;
  };
  error?: string;
  loading?: boolean;
  form?: HeroForm;
  onUpdate?: (field: string, val: string | boolean) => void;
  onSubmit?: (event: FormEvent) => void;
  onFormSubmit?: (data: WebinarFormData) => void | Promise<void>;
  onScrollToRegister?: () => void;
  onUnlockAndScroll?: () => void;
  onWebinarLoaded?: (webinar: Record<string, unknown> | null) => void;
};

const inputClass =
  "flex h-11 sm:h-12 lg:h-12 w-full rounded-xl border border-[#eadfd4] bg-white py-2.5 pl-11 pr-4 text-sm sm:text-base md:text-base lg:text-base text-stone-900 placeholder-stone-400 transition focus:border-orange-400 focus:outline-none focus:ring-1 focus:ring-orange-400/40 shadow-sm";

const webinarSchema: Yup.ObjectSchema<WebinarFormData> = Yup.object().shape({
  name: Yup.string()
    .trim()
    .required("Full name is required")
    .matches(/^[a-zA-Z\s]+$/, "Only alphabets are allowed in name")
    .min(2, "Name must be at least 2 characters"),
  email: Yup.string()
    .trim()
    .required("Email address is required")
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Please enter a valid email address (e.g. name@example.com)"
    ),
  phone: Yup.string()
    .required("WhatsApp number is required")
    .test(
      "digits-only",
      "Phone number must contain only numbers",
      (val) => !val || /^\d+$/.test(val.replace(/\s+/g, ""))
    )
    .test(
      "ten-digits",
      "Phone number must be exactly 10 digits",
      (val) => !val || val.replace(/\s+/g, "").length === 10
    ),
  challenge: Yup.string().optional(),
});

export default function WebinarHero({
  displayDateStr,
  displayTimeStr,
  displayDurationStr,
  stats,
  error,
  loading = false,
  form,
  onUpdate,
  onSubmit,
  onFormSubmit,
  onScrollToRegister: _onScrollToRegister,
  onUnlockAndScroll: _onUnlockAndScroll,
  onWebinarLoaded,
}: WebinarHeroProps) {
  const details = [
    { icon: Calendar, label: "Date", value: displayDateStr },
    { icon: Clock, label: "Time", value: displayTimeStr },
    { icon: Globe, label: "Language", value: "Hindi + English" },
    { icon: Video, label: "Duration", value: displayDurationStr },
  ];

  // Helper to extract raw 10 digits from incoming phone if needed
  const sanitizeInitialPhone = (ph?: string) => {
    if (!ph) return "";
    return ph.replace(/\D/g, "").slice(-10);
  };

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<WebinarFormData>({
    resolver: yupResolver(webinarSchema),
    mode: "onTouched",
    defaultValues: {
      name: form?.name || "",
      email: form?.email || "",
      phone: sanitizeInitialPhone(form?.phone),
      challenge: form?.challenge || "",
    },
  });

  const watchName = watch("name");
  const watchPhone = watch("phone");

  // Keep parent form updated if parent passes form and onUpdate
  useEffect(() => {
    if (form) {
      if (form.name && form.name !== watchName) {
        setValue("name", form.name);
      }
      if (form.email) {
        setValue("email", form.email);
      }
      const rawPh = sanitizeInitialPhone(form.phone);
      if (rawPh && rawPh !== watchPhone) {
        setValue("phone", rawPh);
      }
      if (form.challenge) {
        setValue("challenge", form.challenge);
      }
    }
  }, [form?.name, form?.email, form?.phone, form?.challenge]);

  // Name handlers: strictly allow only alphabets and spaces, block numbers and special characters
  const handleNameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (
      [
        "Backspace",
        "Tab",
        "Delete",
        "ArrowLeft",
        "ArrowRight",
        "ArrowUp",
        "ArrowDown",
        "Enter",
        "Home",
        "End",
      ].includes(e.key) ||
      e.ctrlKey ||
      e.metaKey
    ) {
      return;
    }
    // Only allow alphabets (a-z, A-Z) and spaces
    if (!/^[a-zA-Z\s]$/.test(e.key)) {
      e.preventDefault();
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleaned = e.target.value.replace(/[^a-zA-Z\s]/g, "");
    setValue("name", cleaned, { shouldValidate: true });
    if (onUpdate) onUpdate("name", cleaned);
  };

  // Phone handlers: block alphabets and symbols, strictly allow at most 10 digits
  const handlePhoneKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (
      [
        "Backspace",
        "Tab",
        "Delete",
        "ArrowLeft",
        "ArrowRight",
        "ArrowUp",
        "ArrowDown",
        "Enter",
        "Home",
        "End",
      ].includes(e.key) ||
      e.ctrlKey ||
      e.metaKey
    ) {
      return;
    }
    // Disallow if not a digit 0-9
    if (!/^[0-9]$/.test(e.key)) {
      e.preventDefault();
      return;
    }
    // Disallow if already 10 digits and no selected text replacement
    const target = e.target as HTMLInputElement;
    const selectedLength = (target.selectionEnd ?? 0) - (target.selectionStart ?? 0);
    if (target.value.length >= 10 && selectedLength === 0) {
      e.preventDefault();
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digitsOnly = e.target.value.replace(/\D/g, "").slice(0, 10);
    setValue("phone", digitsOnly, { shouldValidate: true });
    if (onUpdate) onUpdate("phone", digitsOnly);
  };

  // Submission handler
  const onFormValid = async (data: WebinarFormData) => {
    if (onFormSubmit) {
      await onFormSubmit(data);
    } else if (onSubmit) {
      if (onUpdate) {
        onUpdate("name", data.name);
        onUpdate("email", data.email);
        onUpdate("phone", data.phone);
        if (data.challenge) onUpdate("challenge", data.challenge);
      }
      onSubmit({ preventDefault: () => {} } as FormEvent);
    }
  };

  // Focus and scroll smoothly to the first field that has an error or is empty
  const onFormError = (formErrors: FieldErrors<WebinarFormData>) => {
    const fieldOrder: (keyof WebinarFormData)[] = ["name", "email", "phone"];
    const firstInvalidField = fieldOrder.find((f) => formErrors[f]);
    if (firstInvalidField) {
      const el = document.getElementById(`lead-${firstInvalidField}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        el.focus();
      }
    }
  };

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
              <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-center text-xs sm:text-sm text-red-600 font-medium">{error}</div>
            )}

            <form onSubmit={handleSubmit(onFormValid, onFormError)} className="webinar-hero-form space-y-3.5 sm:space-y-4" noValidate>
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="block text-sm sm:text-base md:text-base lg:text-sm font-semibold text-stone-700" htmlFor="lead-name">
                  Full name
                </label>
                <div className="relative">
                  <User size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    className={`${inputClass} ${errors.name ? "!border-rose-500 !ring-1 !ring-rose-400/40 bg-rose-50/15" : ""}`}
                    id="lead-name"
                    placeholder="Jane Doe"
                    autoComplete="name"
                    value={watchName || ""}
                    onKeyDown={handleNameKeyDown}
                    onChange={handleNameChange}
                  />
                </div>
                {errors.name && (
                  <p className="mt-1 text-xs font-semibold text-rose-600 flex items-center gap-1.5 animate-in fade-in duration-150" role="alert">
                    <AlertCircle size={13} className="shrink-0 text-rose-500" />
                    <span>{errors.name.message}</span>
                  </p>
                )}
              </div>

              {/* Email Address */}
              <div className="space-y-1.5">
                <label className="block text-sm sm:text-base md:text-base lg:text-sm font-semibold text-stone-700" htmlFor="lead-email">
                  Email address
                </label>
                <div className="relative">
                  <Mail size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="email"
                    className={`${inputClass} ${errors.email ? "!border-rose-500 !ring-1 !ring-rose-400/40 bg-rose-50/15" : ""}`}
                    id="lead-email"
                    placeholder="jane@example.com"
                    autoComplete="email"
                    {...register("email")}
                    onChange={(e) => {
                      register("email").onChange(e);
                      if (onUpdate) onUpdate("email", e.target.value);
                    }}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-xs font-semibold text-rose-600 flex items-center gap-1.5 animate-in fade-in duration-150" role="alert">
                    <AlertCircle size={13} className="shrink-0 text-rose-500" />
                    <span>{errors.email.message}</span>
                  </p>
                )}
              </div>

              {/* WhatsApp Number with India Flag and +91 prefix */}
              <div className="space-y-1.5">
                <label className="block text-sm sm:text-base md:text-base lg:text-sm font-semibold text-stone-700" htmlFor="lead-phone">
                  WhatsApp number
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 z-10 select-none">
                    <IndiaFlag className="w-5 h-3.5" />
                    <span className="text-xs sm:text-sm font-bold text-stone-700 tracking-tight">+91</span>
                    <span className="h-4 w-px bg-stone-300 ml-0.5" />
                  </div>
                  <input
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    className={`${inputClass} !pl-[76px] ${errors.phone ? "!border-rose-500 !ring-1 !ring-rose-400/40 bg-rose-50/15" : ""}`}
                    id="lead-phone"
                    placeholder="98765 43210"
                    autoComplete="tel-national"
                    value={watchPhone || ""}
                    onKeyDown={handlePhoneKeyDown}
                    onChange={handlePhoneChange}
                  />
                </div>
                {errors.phone && (
                  <p className="mt-1 text-xs font-semibold text-rose-600 flex items-center gap-1.5 animate-in fade-in duration-150" role="alert">
                    <AlertCircle size={13} className="shrink-0 text-rose-500" />
                    <span>{errors.phone.message}</span>
                  </p>
                )}
              </div>

              {/* Challenge Textarea */}
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
                    {...register("challenge")}
                    onChange={(e) => {
                      register("challenge").onChange(e);
                      if (onUpdate) onUpdate("challenge", e.target.value);
                    }}
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
