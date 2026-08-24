"use client";

import React, { useState, useEffect, Suspense } from "react";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { useAuth } from "@/context/AuthContext";
import { Eye, EyeOff, Sparkles, ArrowRight, Zap, RefreshCw, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { API_BASE_URL } from "@/config/api";

function LoginContent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [serverStatus, setServerStatus] = useState<"checking" | "ready" | "slow">("checking");
  const [wakeSeconds, setWakeSeconds] = useState(0);
  const { login } = useAuth();
  const searchParams = useSearchParams();

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
    let interval: any;
    if (loading || serverStatus === "slow") {
      interval = setInterval(() => {
        setWakeSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      setWakeSeconds(0);
    }
    return () => clearInterval(interval);
  }, [loading, serverStatus]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    setLoading(true);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 45000); // 45s max timeout for cold starts

    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Invalid email or password");
      }

      setServerStatus("ready");
      login(data.token, data.user);
    } catch (err: any) {
      if (err.name === "AbortError") {
        setError("The server is still waking up from sleep. Please click 'Try Again' in a few seconds.");
      } else {
        setError(err.message || "Failed to login. Please check your credentials.");
      }
    } finally {
      clearTimeout(timeoutId);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Animated background glow */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-orange-500/10 rounded-full blur-[100px] animate-pulse" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-amber-600/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: "1s" }} />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-2">
            <BrandLogo href="/" size="lg" />
          </div>
          <p className="text-slate-400 mt-2 text-sm">Your creative transformation starts here.</p>
        </div>

        {/* Card */}
        <div className="bg-slate-900/90 backdrop-blur-2xl border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/80">
          <h2 className="text-xl font-bold text-white mb-1">Welcome back 👋</h2>
          <p className="text-slate-400 text-sm mb-6">Log in to continue your art journey.</p>

          {successMsg && (
            <div className="mb-5 p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-2.5">
              <Sparkles size={16} className="shrink-0" />
              {successMsg}
            </div>
          )}

          {error && (
            <div className="mb-5 p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold flex items-start gap-2.5">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Server cold-start warning when idle on Render */}
          {serverStatus === "slow" && (
            <div className="mb-5 p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2.5">
              <Zap size={16} className="shrink-0 animate-bounce text-amber-400" />
              <span>
                <strong>Server is waking up...</strong> Free-tier servers spin down when idle ({wakeSeconds}s). It will connect in a moment!
              </span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-orange-500 transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Password
                </label>
                <Link href="#" className="text-xs text-orange-400 hover:text-orange-300 font-semibold">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-orange-500 transition-colors pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-black py-3 px-4 rounded-xl text-sm transition-all hover:scale-[1.02] shadow-lg shadow-orange-500/20 disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
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
          <div className="mt-6 pt-6 border-t border-slate-800/80 text-center text-xs text-slate-400">
            Don't have an account?{" "}
            <Link href="/register" className="text-orange-400 hover:text-orange-300 font-bold">
              Register now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950" />}>
      <LoginContent />
    </Suspense>
  );
}
