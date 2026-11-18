"use client";

import React, { useState, useEffect, Suspense } from "react";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { useAuth } from "@/context/AuthContext";
import { Eye, EyeOff, Sparkles, ArrowRight, Zap, RefreshCw, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { API_BASE_URL } from "@/config/api";
import { ForgotPasswordModal } from "@/components/auth/ForgotPasswordModal";
import { useForm, type FieldErrors } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

export type LoginFormData = {
  email: string;
  password: string;
};

const loginSchema: Yup.ObjectSchema<LoginFormData> = Yup.object().shape({
  email: Yup.string()
    .trim()
    .required("Email address is required")
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Please enter a valid email address (e.g. name@example.com)"
    ),
  password: Yup.string()
    .required("Password is required"),
});

function LoginContent() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [serverStatus, setServerStatus] = useState<"checking" | "ready" | "slow">("checking");
  const [wakeSeconds, setWakeSeconds] = useState(0);
  const { login, user, token } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
    mode: "onTouched",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const watchEmail = watch("email");

  // If user is already logged in, redirect immediately
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

  useEffect(() => {
    if (searchParams.get("registered") === "true") {
      setSuccessMsg("Account created! Please log in with your credentials.");
    }
  }, [searchParams]);

  // Pre-warm backend on page load
  useEffect(() => {
    const slowTimer = setTimeout(() => setServerStatus("slow"), 2500);
    const controller = new AbortController();

    fetch(`${API_BASE_URL}/health`, { signal: controller.signal })
      .then((r) => {
        if (r.ok) {
          clearTimeout(slowTimer);
          setServerStatus("ready");
        }
      })
      .catch(() => {
        clearTimeout(slowTimer);
        setServerStatus("slow");
      });

    return () => {
      controller.abort();
      clearTimeout(slowTimer);
    };
  }, []);

  // Timer counter when server is waking up
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    if (loading || serverStatus === "slow") {
      interval = setInterval(() => {
        setWakeSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      setWakeSeconds(0);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [loading, serverStatus]);

  const onFormValid = async (data: LoginFormData) => {
    setError("");
    setSuccessMsg("");
    setLoading(true);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 45000); // 45s max timeout for cold starts

    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.email.trim().toLowerCase(),
          password: data.password,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      const resData = await res.json();

      if (!res.ok) {
        throw new Error(resData.message || "Invalid email or password");
      }

      setServerStatus("ready");
      login(resData.token, resData.user, redirectUrl || undefined);
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") {
        setError("The server is still waking up from sleep. Please click 'Try Again' in a few seconds.");
      } else {
        const message = err instanceof Error ? err.message : "Failed to login. Please check your credentials.";
        setError(message);
      }
    } finally {
      clearTimeout(timeoutId);
      setLoading(false);
    }
  };

  // Smooth scroll and focus on the first missing / invalid field
  const onFormError = (formErrors: FieldErrors<LoginFormData>) => {
    const fieldOrder: (keyof LoginFormData)[] = ["email", "password"];
    const firstInvalidField = fieldOrder.find((f) => formErrors[f]);
    if (firstInvalidField) {
      const el = document.getElementById(`login-${firstInvalidField}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        el.focus();
      }
    }
  };

  return (
    <div
      className="min-h-screen bg-[#faf8f5] flex items-center justify-center p-4 relative overflow-hidden font-sans text-stone-800"
      style={{
        backgroundImage: "radial-gradient(circle, #e2ded4 1.5px, transparent 1.5px)",
        backgroundSize: "24px 24px",
      }}
    >
      {/* Animated background glow */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-[#c4431d]/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-2">
            <BrandLogo href="/" size="lg" />
          </div>
          <p className="text-stone-600 mt-2 text-sm font-medium">Your creative transformation starts here.</p>
        </div>

        {/* Card */}
        <div className="bg-white/95 backdrop-blur-2xl border border-[#ecdccb] rounded-3xl p-6 sm:p-8 shadow-[0_10px_30px_-12px_rgba(90,55,20,0.08)]">
          <h2 className="text-2xl font-black text-stone-900 tracking-tight mb-1">Welcome back 👋</h2>
          <p className="text-stone-500 text-sm mb-6">Log in to continue your art journey.</p>

          {successMsg && (
            <div className="mb-5 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2.5">
              <Sparkles size={16} className="shrink-0" />
              {successMsg}
            </div>
          )}

          {error && (
            <div className="mb-5 p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs font-bold flex items-start gap-2.5">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Server cold-start warning when idle on Render */}
          {serverStatus === "slow" && (
            <div className="mb-5 p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2.5">
              <Zap size={16} className="shrink-0 animate-bounce text-[#c4431d]" />
              <span>
                <strong className="text-stone-900">Server is waking up...</strong> Free-tier servers spin down when idle ({wakeSeconds}s). It will connect in a moment!
              </span>
            </div>
          )}

          <form onSubmit={handleSubmit(onFormValid, onFormError)} className="space-y-4" noValidate>
            {/* Email Address */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-700" htmlFor="login-email">
                Email Address
              </label>
              <input
                type="email"
                id="login-email"
                placeholder="name@example.com"
                autoComplete="email"
                {...register("email")}
                className={`w-full bg-[#fcfaf7] border rounded-xl px-4 py-3 text-stone-900 placeholder:text-stone-400 text-sm focus:outline-none transition-colors ${
                  errors.email
                    ? "!border-rose-500 !ring-1 !ring-rose-400/40 bg-rose-50/15"
                    : "border-stone-300 focus:border-[#c4431d] focus:ring-1 focus:ring-[#c4431d]/30"
                }`}
              />
              {errors.email && (
                <p className="mt-1 text-xs font-semibold text-rose-600 flex items-center gap-1 animate-in fade-in duration-150" role="alert">
                  <AlertCircle size={13} className="shrink-0 text-rose-500" />
                  <span>{errors.email.message}</span>
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-700" htmlFor="login-password">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setIsForgotModalOpen(true)}
                  className="text-xs text-[#c4431d] hover:text-[#942008] font-bold cursor-pointer transition-colors"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="login-password"
                  placeholder="••••••••••••"
                  autoComplete="current-password"
                  {...register("password")}
                  className={`w-full bg-[#fcfaf7] border rounded-xl px-4 py-3 text-stone-900 placeholder:text-stone-400 text-sm focus:outline-none transition-colors pr-10 ${
                    errors.password
                      ? "!border-rose-500 !ring-1 !ring-rose-400/40 bg-rose-50/15"
                      : "border-stone-300 focus:border-[#c4431d] focus:ring-1 focus:ring-[#c4431d]/30"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-1 cursor-pointer"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs font-semibold text-rose-600 flex items-center gap-1 animate-in fade-in duration-150" role="alert">
                  <AlertCircle size={13} className="shrink-0 text-rose-500" />
                  <span>{errors.password.message}</span>
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-gradient-to-r from-[#942008] via-[#c4431d] to-[#ea580c] hover:opacity-95 text-white font-black py-3 px-4 rounded-xl text-sm transition-all hover:scale-[1.01] shadow-md shadow-[#c4431d]/25 disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <RefreshCw size={16} className="animate-spin" />
                  Logging in... ({wakeSeconds}s)
                </>
              ) : (
                <>
                  Log in to Portal <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Quick Helper */}
          <div className="mt-6 pt-6 border-t border-stone-200 text-center text-xs text-stone-600">
            Don&apos;t have an account?{" "}
            <Link
              href={redirectUrl ? `/register?redirect=${encodeURIComponent(redirectUrl)}` : "/register"}
              className="text-[#c4431d] hover:text-[#942008] font-bold"
            >
              Register now
            </Link>
          </div>
        </div>
      </div>

      {/* Forgot Password Interactive Modal */}
      <ForgotPasswordModal
        isOpen={isForgotModalOpen}
        onClose={() => setIsForgotModalOpen(false)}
        initialEmail={watchEmail || ""}
        onSuccess={(resetEmail) => {
          setValue("email", resetEmail, { shouldValidate: true });
          setValue("password", "");
          setSuccessMsg("Password reset successfully! Please sign in with your new password.");
        }}
      />
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#faf8f5]" />}>
      <LoginContent />
    </Suspense>
  );
}
