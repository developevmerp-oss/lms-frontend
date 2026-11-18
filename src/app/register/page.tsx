"use client";

import React, { useState, useEffect, Suspense } from "react";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { useAuth } from "@/context/AuthContext";
import {
  Eye,
  EyeOff,
  ArrowRight,
  Trophy,
  Users,
  BookOpen,
  Zap,
  Flame,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { API_BASE_URL } from "@/config/api";
import { trackingService } from "@/services/trackingService";
import { useForm, type FieldErrors } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { IndiaFlag } from "@/components/ui/IndiaFlag";

const PERKS = [
  {
    icon: <BookOpen size={18} className="text-[#c4431d]" />,
    title: "Structured Curriculum",
    desc: "4 progressive tiers from beginner to mastery",
  },
  {
    icon: <Trophy size={18} className="text-amber-600" />,
    title: "Real Business Goals",
    desc: "Monetize your resin art — aim for ₹50k/mo",
  },
  {
    icon: <Users size={18} className="text-purple-500" />,
    title: "1-on-1 Mentor Critiques",
    desc: "Direct feedback from Vrajangna Patel",
  },
];

export type RegisterFormData = {
  name: string;
  city?: string;
  email: string;
  phone?: string;
  password: string;
  bio?: string;
};

const registerSchema: Yup.ObjectSchema<RegisterFormData> = Yup.object().shape({
  name: Yup.string()
    .trim()
    .required("Full name is required")
    .matches(/^[a-zA-Z\s]+$/, "Only alphabets are allowed in name")
    .min(2, "Name must be at least 2 characters"),
  city: Yup.string()
    .trim()
    .test(
      "alphabet-city",
      "Only alphabets are allowed in city",
      (val) => !val || /^[a-zA-Z\s]+$/.test(val)
    )
    .optional(),
  email: Yup.string()
    .trim()
    .required("Email address is required")
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Please enter a valid email address (e.g. artist@example.com)"
    ),
  phone: Yup.string()
    .test(
      "phone-format",
      "Phone number must be exactly 10 digits",
      (val) => {
        if (!val || val.trim() === "") return true; // optional
        const cleaned = val.replace(/\s+/g, "");
        return /^\d{10}$/.test(cleaned);
      }
    )
    .optional(),
  password: Yup.string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters")
    .matches(/[a-zA-Z]/, "Password must contain at least one alphabet letter")
    .matches(/\d/, "Password must contain at least one number")
    .matches(
      /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~`]/,
      "Password must contain at least one special character (e.g. @, #, $, %)"
    ),
  bio: Yup.string().optional(),
});

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, user, token } = useAuth();
  const redirectUrl = searchParams.get("redirect");

  // If already logged in, redirect immediately
  useEffect(() => {
    if (token && user) {
      if (redirectUrl) {
        router.replace(redirectUrl);
      } else if (user.role === "admin") {
        router.replace("/admin/dashboard");
      } else {
        router.replace("/student/feed");
      }
    }
  }, [token, user, redirectUrl, router]);

  const isFastStartBundle =
    searchParams.get("bundle") === "fast-start" || searchParams.get("course") === "l0";

  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: yupResolver(registerSchema),
    mode: "onTouched",
    defaultValues: {
      name: "",
      city: "",
      email: "",
      phone: "",
      password: "",
      bio: "",
    },
  });

  const watchName = watch("name");
  const watchCity = watch("city");
  const watchPhone = watch("phone");

  // Read query params if any pre-fill values are present
  useEffect(() => {
    const qName = searchParams.get("name") || "";
    const qEmail = searchParams.get("email") || "";
    const qPhone = searchParams.get("phone") || "";

    if (qName) {
      setValue("name", qName.replace(/[0-9]/g, ""));
    }
    if (qEmail) {
      setValue("email", qEmail);
    }
    if (qPhone) {
      setValue("phone", qPhone.replace(/\D/g, "").slice(-10));
    }
  }, [searchParams, setValue]);

  // Only allow alphabets (a-z, A-Z) and spaces for name and city; block numbers & special characters
  const handleAlphabetOnlyKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
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
    // Block any non-alphabet and non-space characters
    if (!/^[a-zA-Z\s]$/.test(e.key)) {
      e.preventDefault();
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleaned = e.target.value.replace(/[^a-zA-Z\s]/g, "");
    setValue("name", cleaned, { shouldValidate: true });
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleaned = e.target.value.replace(/[^a-zA-Z\s]/g, "");
    setValue("city", cleaned, { shouldValidate: true });
  };

  // Phone handlers: block alphabets/symbols, limit to 10 digits
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
    // Block non-digits
    if (!/^[0-9]$/.test(e.key)) {
      e.preventDefault();
      return;
    }
    // Block if already 10 digits and no text selection
    const target = e.target as HTMLInputElement;
    const selectedLength = (target.selectionEnd ?? 0) - (target.selectionStart ?? 0);
    if (target.value.length >= 10 && selectedLength === 0) {
      e.preventDefault();
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digitsOnly = e.target.value.replace(/\D/g, "").slice(0, 10);
    setValue("phone", digitsOnly, { shouldValidate: true });
  };

  // Form valid submission
  const onFormValid = async (data: RegisterFormData) => {
    setServerError("");
    setLoading(true);

    try {
      const formattedPhone = data.phone && data.phone.trim().length > 0
        ? (data.phone.startsWith("+91") ? data.phone.trim() : `+91 ${data.phone.trim()}`)
        : undefined;

      const payload = {
        name: data.name.trim(),
        email: data.email.trim().toLowerCase(),
        password: data.password,
        city: data.city?.trim() || undefined,
        phone: formattedPhone,
        bio: data.bio?.trim() || undefined,
        bundle: isFastStartBundle ? "fast-start" : undefined,
      };

      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const resData = await res.json();

      if (!res.ok) {
        throw new Error(resData.message || "Registration failed");
      }

      // Safely fire marketing registration event
      try {
        trackingService.trackRegistration({ method: "email" });
      } catch {
        // tracking error ignored
      }

      if (resData.token) {
        login(resData.token, resData.user, redirectUrl || undefined);
      } else {
        router.push(
          redirectUrl
            ? `/login?registered=true&redirect=${encodeURIComponent(redirectUrl)}`
            : "/login?registered=true"
        );
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Registration failed";
      setServerError(message);
    } finally {
      setLoading(false);
    }
  };

  // Auto-focus and scroll smoothly to the first missing / invalid field on submit
  const onFormError = (formErrors: FieldErrors<RegisterFormData>) => {
    const fieldOrder: (keyof RegisterFormData)[] = [
      "name",
      "city",
      "email",
      "phone",
      "password",
    ];
    const firstInvalidField = fieldOrder.find((f) => formErrors[f]);
    if (firstInvalidField) {
      const el = document.getElementById(`register-${firstInvalidField}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        el.focus();
      }
    }
  };

  return (
    <div
      className="min-h-screen bg-[#faf8f5] flex flex-col items-center justify-center p-3 sm:p-6 md:p-8 selection:bg-[#c4431d] selection:text-white text-stone-800"
      style={{
        backgroundImage: "radial-gradient(circle, #e2ded4 1.5px, transparent 1.5px)",
        backgroundSize: "24px 24px",
      }}
    >
      <div className="w-full max-w-5xl py-6 sm:py-10">
        {/* Mobile & Tablet Header: Brand Logo & Title */}
        <div className="lg:hidden text-center mb-6 sm:mb-8">
          <BrandLogo href="/" size="md" />
          <h1 className="mt-4 text-2xl sm:text-3xl font-black text-stone-900 leading-tight">
            Transform Your Passion Into A{" "}
            <span className="shimmer-text">Thriving Art Brand</span>
          </h1>
          <p className="mt-2 text-stone-600 text-xs sm:text-sm leading-relaxed max-w-md mx-auto">
            Join 500+ artists mastering resin chemistry, crafting signature collections, and earning consistent revenue.
          </p>
        </div>

        {/* Main Grid: Responsive 1 col on mobile/tablet, 2 cols on desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-14 items-center">
          {/* Left: Branding & Value Props (Desktop View) */}
          <div className="hidden lg:block space-y-6">
            <BrandLogo href="/" size="lg" />

            {isFastStartBundle ? (
              <div className="space-y-4 pt-2">
                <div className="inline-flex items-center gap-2 bg-[#fde5d6] border border-[#f5ded0] text-[#942008] text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full">
                  <Flame size={14} className="text-[#c4431d]" /> Fast-Track Special Access
                </div>
                <h1 className="text-4xl font-black text-stone-900 leading-tight">
                  Resin Art Fast Start <span className="shimmer-text">Bundle (Level 0)</span>
                </h1>
                <p className="text-stone-600 text-sm leading-relaxed">
                  Skip the webinar wait! Instant access to 4 foundational video lessons, chemical mixing cheat sheets, and student dashboard access.
                </p>
              </div>
            ) : (
              <div className="space-y-4 pt-2">
                <h1 className="text-4xl font-black text-stone-900 leading-tight">
                  Transform Your Passion Into A{" "}
                  <span className="shimmer-text">Thriving Art Brand</span>
                </h1>
                <p className="text-stone-600 text-sm leading-relaxed">
                  Join 500+ artists mastering resin chemistry, crafting signature collections, and earning consistent revenue.
                </p>
              </div>
            )}

            <div className="space-y-3 pt-2">
              {PERKS.map((perk, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-white border border-[#ecdccb] shadow-sm shrink-0 mt-0.5">
                    {perk.icon}
                  </div>
                  <div>
                    <h3 className="text-stone-900 font-bold text-sm">{perk.title}</h3>
                    <p className="text-stone-500 text-xs mt-0.5">{perk.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 p-5 rounded-2xl bg-white border border-[#ecdccb] shadow-[0_10px_30px_-12px_rgba(90,55,20,0.08)]">
              <div className="flex gap-3 items-start">
                <div className="text-3xl shrink-0">🎨</div>
                <div>
                  <p className="text-stone-900 font-bold text-sm">
                    &quot;My first ₹15,000 sale happened within 3 weeks of starting Level 0!&quot;
                  </p>
                  <p className="text-stone-500 text-xs mt-1">— Priya S., Fast Start Graduate</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Form Card */}
          <div className="w-full max-w-xl mx-auto lg:max-w-none bg-white/95 backdrop-blur-2xl border border-[#ecdccb] rounded-3xl p-5 sm:p-7 md:p-8 shadow-[0_10px_30px_-12px_rgba(90,55,20,0.08)]">
            {isFastStartBundle ? (
              <div className="mb-6 pb-4 border-b border-stone-200">
                <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase text-[#942008] bg-[#fde5d6] border border-[#f5ded0] px-3 py-1 rounded-full mb-2">
                  <Zap size={13} /> Fast Start Level 0
                </div>
                <h2 className="text-2xl font-black text-stone-900 tracking-tight">
                  Create Your Academy Login
                </h2>
                <p className="text-stone-500 text-xs mt-1">
                  Set your password to instantly unlock Level 0 courses &amp; dashboard.
                </p>
              </div>
            ) : (
              <div className="mb-6">
                <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight mb-1">
                  Create your account
                </h2>
                <p className="text-stone-500 text-sm">
                  Start your resin art journey today — it&apos;s free.
                </p>
              </div>
            )}

            {serverError && (
              <div className="mb-5 p-3.5 sm:p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm text-center font-medium">
                {serverError}
              </div>
            )}

            <form
              onSubmit={handleSubmit(onFormValid, onFormError)}
              className="space-y-4"
              noValidate
            >
              {/* Row 1: Full Name * + City */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                <div>
                  <label
                    className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5"
                    htmlFor="register-name"
                  >
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="register-name"
                    placeholder="Your full name"
                    autoComplete="name"
                    value={watchName || ""}
                    onKeyDown={handleAlphabetOnlyKeyDown}
                    onChange={handleNameChange}
                    className={`w-full px-4 py-3 rounded-xl bg-[#fcfaf7] border text-stone-900 placeholder:text-stone-400 focus:outline-none transition-all text-sm ${
                      errors.name
                        ? "!border-rose-500 !ring-1 !ring-rose-400/40 bg-rose-50/15"
                        : "border-stone-300 focus:border-[#c4431d] focus:ring-1 focus:ring-[#c4431d]/30"
                    }`}
                  />
                  {errors.name && (
                    <p
                      className="mt-1.5 text-xs font-semibold text-rose-600 flex items-center gap-1 animate-in fade-in duration-150"
                      role="alert"
                    >
                      <AlertCircle size={13} className="shrink-0 text-rose-500" />
                      <span>{errors.name.message}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label
                    className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5"
                    htmlFor="register-city"
                  >
                    City
                  </label>
                  <input
                    type="text"
                    id="register-city"
                    placeholder="e.g. Mumbai"
                    autoComplete="address-level2"
                    value={watchCity || ""}
                    onKeyDown={handleAlphabetOnlyKeyDown}
                    onChange={handleCityChange}
                    className={`w-full px-4 py-3 rounded-xl bg-[#fcfaf7] border text-stone-900 placeholder:text-stone-400 focus:outline-none transition-all text-sm ${
                      errors.city
                        ? "!border-rose-500 !ring-1 !ring-rose-400/40 bg-rose-50/15"
                        : "border-stone-300 focus:border-[#c4431d] focus:ring-1 focus:ring-[#c4431d]/30"
                    }`}
                  />
                  {errors.city && (
                    <p
                      className="mt-1.5 text-xs font-semibold text-rose-600 flex items-center gap-1 animate-in fade-in duration-150"
                      role="alert"
                    >
                      <AlertCircle size={13} className="shrink-0 text-rose-500" />
                      <span>{errors.city.message}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Row 2: Email Address * + Phone Number */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                <div>
                  <label
                    className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5"
                    htmlFor="register-email"
                  >
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="register-email"
                    placeholder="artist@example.com"
                    autoComplete="email"
                    {...register("email")}
                    className={`w-full px-4 py-3 rounded-xl bg-[#fcfaf7] border text-stone-900 placeholder:text-stone-400 focus:outline-none transition-all text-sm ${
                      errors.email
                        ? "!border-rose-500 !ring-1 !ring-rose-400/40 bg-rose-50/15"
                        : "border-stone-300 focus:border-[#c4431d] focus:ring-1 focus:ring-[#c4431d]/30"
                    }`}
                  />
                  {errors.email && (
                    <p
                      className="mt-1.5 text-xs font-semibold text-rose-600 flex items-center gap-1 animate-in fade-in duration-150"
                      role="alert"
                    >
                      <AlertCircle size={13} className="shrink-0 text-rose-500" />
                      <span>{errors.email.message}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label
                    className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5"
                    htmlFor="register-phone"
                  >
                    Phone Number
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 z-10 select-none">
                      <IndiaFlag className="w-5 h-3.5" />
                      <span className="text-xs sm:text-sm font-bold text-stone-700 tracking-tight">
                        +91
                      </span>
                      <span className="h-4 w-px bg-stone-300 ml-0.5" />
                    </div>
                    <input
                      type="tel"
                      id="register-phone"
                      inputMode="numeric"
                      maxLength={10}
                      placeholder="9876543210"
                      autoComplete="tel-national"
                      value={watchPhone || ""}
                      onKeyDown={handlePhoneKeyDown}
                      onChange={handlePhoneChange}
                      className={`w-full !pl-[76px] pr-4 py-3 rounded-xl bg-[#fcfaf7] border text-stone-900 placeholder:text-stone-400 focus:outline-none transition-all text-sm ${
                        errors.phone
                          ? "!border-rose-500 !ring-1 !ring-rose-400/40 bg-rose-50/15"
                          : "border-stone-300 focus:border-[#c4431d] focus:ring-1 focus:ring-[#c4431d]/30"
                      }`}
                    />
                  </div>
                  {errors.phone && (
                    <p
                      className="mt-1.5 text-xs font-semibold text-rose-600 flex items-center gap-1 animate-in fade-in duration-150"
                      role="alert"
                    >
                      <AlertCircle size={13} className="shrink-0 text-rose-500" />
                      <span>{errors.phone.message}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Password * */}
              <div>
                <label
                  className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5"
                  htmlFor="register-password"
                >
                  Password *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="register-password"
                    placeholder="Minimum 6 characters"
                    autoComplete="new-password"
                    {...register("password")}
                    className={`w-full px-4 py-3 pr-12 rounded-xl bg-[#fcfaf7] border text-stone-900 placeholder:text-stone-400 focus:outline-none transition-all text-sm ${
                      errors.password
                        ? "!border-rose-500 !ring-1 !ring-rose-400/40 bg-rose-50/15"
                        : "border-stone-300 focus:border-[#c4431d] focus:ring-1 focus:ring-[#c4431d]/30"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors p-1 cursor-pointer"
                    tabIndex={-1}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {!errors.password && (
                  <p className="mt-1 text-[11px] text-stone-500">
                    Must be at least 6 characters with a letter, number &amp; special character.
                  </p>
                )}
                {errors.password && (
                  <p
                    className="mt-1.5 text-xs font-semibold text-rose-600 flex items-center gap-1 animate-in fade-in duration-150"
                    role="alert"
                  >
                    <AlertCircle size={13} className="shrink-0 text-rose-500" />
                    <span>{errors.password.message}</span>
                  </p>
                )}
              </div>

              {/* Art Goals / Experience */}
              <div>
                <label
                  className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5"
                  htmlFor="register-bio"
                >
                  Art Goals / Experience{" "}
                  <span className="text-stone-400 normal-case tracking-normal font-normal">
                    (optional)
                  </span>
                </label>
                <textarea
                  id="register-bio"
                  rows={2}
                  {...register("bio")}
                  className="w-full px-4 py-3 rounded-xl bg-[#fcfaf7] border border-stone-300 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-[#c4431d] focus:ring-1 focus:ring-[#c4431d]/30 transition-all text-sm resize-none"
                  placeholder="Tell us about your resin art goals..."
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 px-4 rounded-xl font-black text-white bg-gradient-to-r from-[#942008] via-[#c4431d] to-[#ea580c] hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-[#c4431d] transition-all shadow-md shadow-[#c4431d]/25 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-base mt-2 cursor-pointer"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Setting up your student portal...
                  </>
                ) : (
                  <>
                    {isFastStartBundle ? "Unlock Level 0 & Enter Dashboard" : "Start My Journey"}{" "}
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-stone-600">
              Already have an account?{" "}
              <Link
                href={
                  redirectUrl
                    ? `/login?redirect=${encodeURIComponent(redirectUrl)}`
                    : "/login"
                }
                className="font-bold text-[#c4431d] hover:text-[#942008] transition-colors"
              >
                Log in here →
              </Link>
            </p>
          </div>
        </div>

        {/* Mobile & Tablet Perks and Testimonial Card */}
        <div className="lg:hidden mt-8 max-w-xl mx-auto space-y-4">
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#ecdccb] shadow-sm">
            <div className="flex gap-3 items-start">
              <div className="text-2xl sm:text-3xl shrink-0">🎨</div>
              <div>
                <p className="text-stone-900 font-bold text-xs sm:text-sm leading-snug">
                  &quot;My first ₹15,000 sale happened within 3 weeks of starting Level 0!&quot;
                </p>
                <p className="text-stone-500 text-[11px] sm:text-xs mt-1">
                  — Priya S., Fast Start Graduate
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
            {PERKS.map((perk, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 p-3 rounded-xl bg-white border border-[#ecdccb]/80 shadow-xs"
              >
                <div className="p-1.5 rounded-lg bg-stone-50 border border-[#ecdccb] shadow-xs shrink-0">
                  {perk.icon}
                </div>
                <div>
                  <h3 className="text-stone-900 font-bold text-xs sm:text-sm">{perk.title}</h3>
                  <p className="text-stone-500 text-[11px] sm:text-xs">{perk.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#faf8f5] text-stone-600 flex items-center justify-center">
          Loading...
        </div>
      }
    >
      <RegisterForm />
    </Suspense>
  );
}
