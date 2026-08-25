"use client";

import React, { useState } from "react";
import { Lock, Sparkles, Trophy, ArrowRight, X, ShieldAlert, CheckCircle2, Zap } from "lucide-react";
import Link from "next/link";
import { TierPurchaseModal } from "@/components/membership/TierPurchaseModal";

interface AccessLockModalProps {
  isOpen: boolean;
  onClose: () => void;
  featureName: string;
  requiredLevel: string;
  requiredPoints?: number;
  currentLevel: string;
  currentPoints?: number;
  description: string;
}

export const AccessLockModal = ({
  isOpen,
  onClose,
  featureName,
  requiredLevel,
  currentLevel,
  description,
}: AccessLockModalProps) => {
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200 font-sans">
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
              <span className="inline-flex items-center gap-1 rounded-md bg-orange-500/10 px-2.5 py-0.5 text-[11px] font-bold text-orange-400 uppercase tracking-wider">
                {requiredLevel} Tier Required
              </span>
              <h3 className="text-xl font-black text-white leading-tight mt-0.5">
                {featureName} is Locked
              </h3>
            </div>
          </div>

          <p className="text-sm text-slate-300 leading-relaxed mb-6">
            {description}
          </p>

          {/* Current Level Card */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 mb-6">
            <div className="flex items-center justify-between text-xs font-bold mb-1">
              <span className="text-slate-400">Your Current Membership:</span>
              <span className="text-orange-400 font-extrabold">{currentLevel}</span>
            </div>
            <p className="text-xs text-slate-400 mt-2 flex items-center gap-1.5">
              <Sparkles size={13} className="text-amber-400 shrink-0" />
              You can unlock this instantly by purchasing or upgrading to <strong>{requiredLevel}</strong> at any time.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button
              type="button"
              onClick={() => setShowPurchaseModal(true)}
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-black text-sm h-11 px-6 rounded-xl w-full sm:w-auto flex-1 shadow-lg shadow-orange-500/20 transition-all hover:scale-[1.02] cursor-pointer"
            >
              <Zap size={16} />
              Upgrade to {requiredLevel} Now
            </button>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center justify-center border border-slate-700 bg-slate-800/80 hover:bg-slate-800 text-slate-300 font-semibold text-sm h-11 px-5 rounded-xl transition-colors cursor-pointer w-full sm:w-auto"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      {showPurchaseModal && (
        <TierPurchaseModal
          isOpen={showPurchaseModal}
          onClose={() => {
            setShowPurchaseModal(false);
            onClose();
          }}
          targetTierCode={requiredLevel.includes("3") ? "L3" : requiredLevel.includes("2") ? "L2" : "L1"}
          currentLevel={currentLevel}
        />
      )}
    </>
  );
};
