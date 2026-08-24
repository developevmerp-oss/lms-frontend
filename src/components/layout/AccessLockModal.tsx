"use client";

import React from "react";
import { Lock, Sparkles, Trophy, ArrowRight, X, ShieldAlert } from "lucide-react";
import Link from "next/link";

interface AccessLockModalProps {
  isOpen: boolean;
  onClose: () => void;
  featureName: string;
  requiredLevel: string;
  requiredPoints: number;
  currentLevel: string;
  currentPoints: number;
  description: string;
}

export const AccessLockModal = ({
  isOpen,
  onClose,
  featureName,
  requiredLevel,
  requiredPoints,
  currentLevel,
  currentPoints,
  description,
}: AccessLockModalProps) => {
  if (!isOpen) return null;

  const pointsNeeded = Math.max(0, requiredPoints - currentPoints);
  const progressPercent = Math.min(100, Math.round((currentPoints / Math.max(1, requiredPoints)) * 100));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg rounded-3xl border border-orange-500/30 bg-slate-900 p-6 sm:p-8 shadow-2xl text-white animate-in zoom-in-95 duration-200"
        role="dialog"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 rounded-full p-1 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400 shrink-0">
            <Lock size={24} />
          </div>
          <div>
            <span className="inline-flex items-center gap-1 rounded-md bg-orange-500/10 px-2 py-0.5 text-[11px] font-bold text-orange-400 uppercase tracking-wider">
              {requiredLevel} Required
            </span>
            <h3 className="text-xl font-black text-white leading-tight mt-0.5">
              {featureName} is Locked
            </h3>
          </div>
        </div>

        <p className="text-sm text-slate-300 leading-relaxed mb-6">
          {description}
        </p>

        {/* Progress Card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 mb-6">
          <div className="flex items-center justify-between text-xs font-bold mb-2">
            <span className="text-slate-400">Current: {currentLevel} ({currentPoints.toLocaleString()} XP)</span>
            <span className="text-orange-400 font-extrabold">{progressPercent}% to {requiredLevel}</span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-slate-800" role="progressbar">
            <div
              className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-400 transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
          <p className="mt-2.5 text-xs text-slate-400 flex items-center gap-1.5">
            <Sparkles size={13} className="text-amber-400 shrink-0" />
            Earn <strong className="text-white">{pointsNeeded.toLocaleString()} more XP</strong> to unlock full access.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <Link
            href="/student/courses"
            onClick={onClose}
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-black text-sm h-11 px-6 rounded-xl w-full sm:w-auto flex-1 shadow-lg shadow-orange-500/20 transition-all hover:scale-[1.02]"
          >
            Complete Course Lessons (+XP)
            <ArrowRight size={16} />
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center border border-slate-700 bg-slate-800/80 hover:bg-slate-800 text-slate-300 font-semibold text-sm h-11 px-5 rounded-xl transition-colors cursor-pointer w-full sm:w-auto"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
