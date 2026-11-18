"use client";

import React, { useState, useEffect } from "react";
import { X, KeyRound, Mail, Lock, Eye, EyeOff, CheckCircle2, AlertCircle, RefreshCw, ArrowRight, Sparkles } from "lucide-react";
import { API_BASE_URL } from "@/config/api";

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialEmail?: string;
  onSuccess: (email: string) => void;
}

export const ForgotPasswordModal = ({
  isOpen,
  onClose,
  initialEmail = "",
  onSuccess,
}: ForgotPasswordModalProps) => {
  const [step, setStep] = useState<"request" | "verify" | "success">("request");
  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [demoCode, setDemoCode] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Sync initial email when opened
  useEffect(() => {
    if (isOpen) {
      setEmail(initialEmail || "");
      setStep("request");
      setOtp("");
      setNewPassword("");
      setConfirmPassword("");
      setError("");
      setDemoCode(null);
      setResendCooldown(0);
    }
  }, [isOpen, initialEmail]);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  if (!isOpen) return null;

  // Step 1: Request OTP
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to send reset code. Please try again.");
      }

      if (data.previewOtp) {
        setDemoCode(data.previewOtp);
      }

      setStep("verify");
      setResendCooldown(60);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP and reset password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match. Please re-enter.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          otp: otp.trim(),
          newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to reset password. Please check your code.");
      }

      setStep("success");
      setTimeout(() => {
        onSuccess(email.trim());
        onClose();
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md p-6 sm:p-8 bg-white border border-[#ecdccb] rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] text-stone-900">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        {/* STEP 1: Request Email */}
        {step === "request" && (
          <div>
            <div className="w-12 h-12 rounded-2xl bg-[#fde5d6] border border-[#f5ded0] flex items-center justify-center text-[#942008] mb-4">
              <KeyRound size={22} />
            </div>

            <h3 className="text-xl font-black text-stone-900">Forgot Password?</h3>
            <p className="text-xs text-stone-500 mt-1.5 leading-relaxed">
              Enter your registered account email and we&apos;ll send you a 6-digit verification code to reset your password.
            </p>

            {error && (
              <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-2">
                <AlertCircle size={15} className="shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleRequestOtp} className="mt-5 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
                  Account Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-[#fcfaf7] border border-stone-300 rounded-xl pl-10 pr-4 py-3 text-stone-900 placeholder:text-stone-400 text-sm focus:outline-none focus:border-[#c4431d] focus:ring-1 focus:ring-[#c4431d]/30 transition-colors"
                  />
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !email.trim()}
                className="w-full bg-gradient-to-r from-[#942008] via-[#c4431d] to-[#ea580c] hover:opacity-95 text-white font-black py-3 px-4 rounded-xl text-sm transition-all hover:scale-[1.01] shadow-md shadow-[#c4431d]/25 disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <>
                    <RefreshCw size={16} className="animate-spin" /> Sending Code...
                  </>
                ) : (
                  <>
                    Send Verification Code <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* STEP 2: Verify Code & Set New Password */}
        {step === "verify" && (
          <div>
            <div className="w-12 h-12 rounded-2xl bg-[#fde5d6] border border-[#f5ded0] flex items-center justify-center text-[#942008] mb-4">
              <Mail size={22} />
            </div>

            <h3 className="text-xl font-black text-stone-900">Enter Verification Code</h3>
            <p className="text-xs text-stone-500 mt-1.5 leading-relaxed">
              We sent a 6-digit code to <strong className="text-[#942008]">{email}</strong>. Enter it below with your new password.
            </p>

            {/* Demo Mode Badge if SMTP isn't configured yet */}
            {demoCode && (
              <div className="mt-3 p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center justify-between gap-2">
                <span className="flex items-center gap-1.5 truncate">
                  <Sparkles size={14} className="text-amber-600 shrink-0" />
                  Code: <strong className="font-mono text-sm tracking-widest text-stone-900">{demoCode}</strong>
                </span>
                <button
                  type="button"
                  onClick={() => setOtp(demoCode)}
                  className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 hover:bg-amber-200 text-[10px] font-bold cursor-pointer shrink-0"
                >
                  Auto-fill
                </button>
              </div>
            )}

            {error && (
              <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-2">
                <AlertCircle size={15} className="shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleResetPassword} className="mt-5 space-y-3.5">
              {/* 6-digit OTP */}
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
                  6-Digit Code
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  placeholder="123456"
                  className="w-full bg-[#fcfaf7] border border-stone-300 rounded-xl px-4 py-3 text-center text-stone-900 placeholder:text-stone-400 text-lg font-mono tracking-[8px] font-bold focus:outline-none focus:border-[#c4431d] focus:ring-1 focus:ring-[#c4431d]/30 transition-colors"
                />
              </div>

              {/* New Password */}
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
                  New Password (Min 8 Chars)
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={8}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-[#fcfaf7] border border-stone-300 rounded-xl pl-10 pr-10 py-2.5 text-stone-900 placeholder:text-stone-400 text-sm focus:outline-none focus:border-[#c4431d] focus:ring-1 focus:ring-[#c4431d]/30 transition-colors"
                  />
                  <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={8}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-[#fcfaf7] border border-stone-300 rounded-xl pl-10 pr-4 py-2.5 text-stone-900 placeholder:text-stone-400 text-sm focus:outline-none focus:border-[#c4431d] focus:ring-1 focus:ring-[#c4431d]/30 transition-colors"
                  />
                  <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || otp.length < 6 || !newPassword || !confirmPassword}
                className="w-full mt-2 bg-gradient-to-r from-[#942008] via-[#c4431d] to-[#ea580c] hover:opacity-95 text-white font-black py-3 px-4 rounded-xl text-sm transition-all hover:scale-[1.01] shadow-md shadow-[#c4431d]/25 disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <>
                    <RefreshCw size={16} className="animate-spin" /> Updating Password...
                  </>
                ) : (
                  <>
                    Update Password & Continue <ArrowRight size={16} />
                  </>
                )}
              </button>

              {/* Sub-actions */}
              <div className="flex items-center justify-between pt-2 text-xs text-stone-500">
                <button
                  type="button"
                  onClick={() => setStep("request")}
                  className="hover:text-stone-800 underline cursor-pointer"
                >
                  Change email
                </button>

                <button
                  type="button"
                  disabled={resendCooldown > 0 || loading}
                  onClick={handleRequestOtp}
                  className="text-[#c4431d] hover:text-[#942008] font-semibold disabled:opacity-50 cursor-pointer"
                >
                  {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend code"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* STEP 3: Success */}
        {step === "success" && (
          <div className="text-center py-4">
            <div className="w-16 h-16 rounded-3xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mx-auto mb-4 animate-in zoom-in duration-200">
              <CheckCircle2 size={32} />
            </div>

            <h3 className="text-xl font-black text-stone-900">Password Reset!</h3>
            <p className="text-xs text-stone-500 mt-2">
              Your password has been successfully updated. Redirecting you to login...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
