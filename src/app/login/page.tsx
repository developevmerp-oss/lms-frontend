"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useSearchParams } from "next/navigation";
import { Eye, EyeOff, Sparkles, ArrowRight, Zap } from "lucide-react";
import { API_BASE_URL } from "@/config/api";

function LoginContent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [serverStatus, setServerStatus] = useState<'checking' | 'ready' | 'slow'>('checking');
  const { login } = useAuth();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("registered") === "true") {
      setSuccessMsg("Account created successfully! Please log in.");
    }
  }, [searchParams]);

  // Pre-warm the backend on page load to prevent cold start during login
  useEffect(() => {
    const slowTimer = setTimeout(() => setServerStatus('slow'), 3000);
    const controller = new AbortController();
    
    fetch(`${API_BASE_URL}/health`, { signal: controller.signal })
      .then((r) => { if (r.ok) { clearTimeout(slowTimer); setServerStatus('ready'); } })
      .catch(() => { clearTimeout(slowTimer); setServerStatus('ready'); });

    return () => { controller.abort(); clearTimeout(slowTimer); };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to login");
      }

      login(data.token, data.user);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-orange-500/10 rounded-full blur-[100px] animate-pulse" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-slate-800/30 rounded-full blur-[80px]" />

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo area */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3 mb-2">
            <div className="w-16 h-16 rounded-full overflow-hidden shrink-0 shadow-2xl shadow-orange-500/20 border border-white/10">
              <img
                src="/logo.jpeg"
                alt="Ravishing Art Hub"
                className="w-full"
                style={{ marginTop: '-2%', height: '110%', objectFit: 'cover', objectPosition: 'top' }}
              />
            </div>
            <div className="text-left">
              <h1 className="text-2xl font-black text-white tracking-tight">Ravishing Art</h1>
              <p className="text-sm text-orange-400 font-medium">by Vrajangna Patel</p>
            </div>
          </div>
          <p className="text-slate-400 mt-3 text-sm">Your creative transformation starts here.</p>
        </div>

        {/* Card */}
        <div className="bg-slate-900/80 backdrop-blur-2xl border border-slate-800 rounded-3xl p-8 shadow-2xl shadow-black/50">
          <h2 className="text-xl font-bold text-white mb-1">Welcome back ðŸ‘‹</h2>
          <p className="text-slate-400 text-sm mb-8">Log in to continue your art journey.</p>

          {successMsg && (
            <div className="mb-6 p-4 rounded-2xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm flex items-center gap-3">
              <Sparkles size={16} className="shrink-0" />
              {successMsg}
            </div>
          )}

          {/* Server cold-start warning â€” only shows if server takes >3s to respond */}
          {serverStatus === 'slow' && (
            <div className="mb-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-sm flex items-center gap-3">
              <Zap size={16} className="shrink-0 animate-pulse" />
              <span>
                <strong>Server is waking upâ€¦</strong> Free-tier servers sleep when idle.
                This takes up to 60 seconds â€” you can fill the form in the meantime! â˜•
              </span>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/30 transition-all"
                placeholder="artist@example.com"
                required
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Password
                </label>
                <a href="#" className="text-xs text-orange-400 hover:text-orange-300 transition-colors font-semibold">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3.5 pr-12 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/30 transition-all"
                  placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-4 rounded-xl font-bold text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all shadow-lg shadow-orange-500/25 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-base mt-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Logging in...
                </>
              ) : (
                <>
                  Log In <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-slate-400">
          Don't have an account?{" "}
          <Link href="/register" className="font-bold text-orange-400 hover:text-orange-300 transition-colors">
            Start your journey â†’
          </Link>
        </p>
      </div>
    </div>
  );
}


export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="text-white text-lg">Loading...</div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}

