"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

interface ExitIntentModalProps {
  onClaimSeat: () => void;
}

export const ExitIntentModal = ({ onClaimSeat }: ExitIntentModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasDismissed, setHasDismissed] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const dismissed = sessionStorage.getItem("webinar_exit_dismissed");
      if (dismissed === "true") {
        setHasDismissed(true);
        return;
      }
    }

    let hasTriggered = false;

    const handleMouseLeave = (e: MouseEvent) => {
      if (hasTriggered || hasDismissed) return;

      if (e.clientY <= 25) {
        hasTriggered = true;
        setIsOpen(true);
      }
    };

    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [hasDismissed]);

  const handleClose = () => {
    setIsOpen(false);
    setHasDismissed(true);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("webinar_exit_dismissed", "true");
    }
  };

  const handleReserve = () => {
    handleClose();
    onClaimSeat();
    setTimeout(() => {
      const input = document.getElementById("lead-name");
      if (input) {
        input.focus();
      }
    }, 200);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 shadow-2xl text-slate-900 animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        <button
          type="button"
          onClick={handleClose}
          aria-label="Close"
          className="absolute right-4 top-4 rounded-md text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
        >
          <X size={18} />
        </button>

        <h3 className="text-xl font-bold text-slate-950 pr-6">
          Leaving without your free seat?
        </h3>

        <p className="mt-3 text-sm leading-relaxed text-slate-600">
          The Masterclass is free, seats are limited, and every registrant gets the Resin Artist Clarity Kit. It takes about twenty seconds.
        </p>

        <div className="mt-6 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-start gap-3">
          <button
            type="button"
            onClick={handleReserve}
            className="inline-flex items-center justify-center bg-slate-900 hover:bg-slate-950 text-white font-semibold text-sm h-10 px-5 rounded-lg transition-all cursor-pointer shadow-sm hover:scale-[1.02]"
          >
            Reserve my free seat
          </button>
          <button
            type="button"
            onClick={handleClose}
            className="inline-flex items-center justify-center border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium text-sm h-10 px-5 rounded-lg transition-all cursor-pointer"
          >
            No thanks
          </button>
        </div>
      </div>
    </div>
  );
};
