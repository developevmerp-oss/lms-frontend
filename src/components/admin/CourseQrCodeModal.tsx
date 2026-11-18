"use client";

import React, { useEffect, useState } from "react";
import QRCode from "qrcode";
import {
  X,
  Download,
  Copy,
  Check,
  ExternalLink,
  QrCode as QrIcon,
  Sparkles,
  Smartphone,
  ShieldCheck,
  BookOpen,
  Clock,
  Tag,
} from "lucide-react";
import { getImageUrl } from "@/config/api";

export interface CourseQrCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: {
    id: string;
    title: string;
    description?: string;
    price?: string;
    levelCode?: string | null;
    image?: string | null;
    flyerImage?: string | null;
    validityMonths?: number | null;
    offerActive?: boolean;
    discountType?: string;
    discountValue?: number;
  } | null;
}

export const CourseQrCodeModal: React.FC<CourseQrCodeModalProps> = ({
  isOpen,
  onClose,
  course,
}) => {
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>("");

  const baseUrl =
    typeof window !== "undefined" && window.location.origin
      ? window.location.origin
      : "https://www.ravishingarthub.com";

  const targetUrl = course ? `${baseUrl}/subscribe?courseId=${course.id}` : "";

  // Generate QR code data URL whenever course changes or modal opens
  useEffect(() => {
    if (!isOpen || !course) return;

    setIsGenerating(true);
    QRCode.toDataURL(targetUrl, {
      width: 512,
      margin: 2,
      color: {
        dark: "#0b0f19",
        light: "#ffffff",
      },
      errorCorrectionLevel: "H",
    })
      .then((url) => {
        setQrDataUrl(url);
        setIsGenerating(false);
      })
      .catch((err) => {
        console.error("Course QR Code generation error:", err);
        setIsGenerating(false);
      });
  }, [isOpen, course, targetUrl]);

  if (!isOpen || !course) return null;

  const isStandalone = !course.levelCode || course.levelCode.toUpperCase() === "NONE";
  const displayPrice = course.price
    ? (course.price.startsWith("₹") ? course.price : `₹${course.price}`)
    : (isStandalone ? "₹999" : "Level Membership");

  const getValidityText = () => {
    if (!course.validityMonths || course.validityMonths <= 0) {
      return "♾️ Lifetime Access";
    }
    const m = course.validityMonths;
    if (m === 1) return "⏱️ 1 Month Validity";
    if (m === 3) return "⏱️ 3 Months Validity";
    if (m === 6) return "⏱️ 6 Months Validity";
    if (m === 12) return "⏱️ 1 Year Validity";
    if (m === 36) return "⏱️ 3 Years Validity";
    return `⏱️ ${m} Months Validity`;
  };

  const handleCopyLink = () => {
    if (!targetUrl) return;
    navigator.clipboard.writeText(targetUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Download raw QR code PNG
  const handleDownloadRawQr = () => {
    if (!qrDataUrl) return;
    const a = document.createElement("a");
    a.href = qrDataUrl;
    const cleanTitle = course.title.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 30);
    a.download = `Course_${cleanTitle}_QR.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Download high-resolution branded poster/flyer PNG
  const handleDownloadBrandedFlyer = () => {
    if (!qrDataUrl) return;

    const canvas = document.createElement("canvas");
    canvas.width = 900;
    canvas.height = 1250;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Draw Background Gradient
    const bgGradient = ctx.createLinearGradient(0, 0, 900, 1250);
    bgGradient.addColorStop(0, "#0b0f19");
    bgGradient.addColorStop(0.5, "#0f172a");
    bgGradient.addColorStop(1, "#090d16");
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, 900, 1250);

    // Decorative Accent Border
    ctx.strokeStyle = "#c4431d";
    ctx.lineWidth = 4;
    ctx.strokeRect(30, 30, 840, 1190);

    // Header Badge: Brand Name
    ctx.fillStyle = "#c4431d";
    ctx.font = "bold 26px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("RAVISHING ART HUB", 450, 95);

    ctx.fillStyle = "#94a3b8";
    ctx.font = "bold 15px sans-serif";
    ctx.fillText("EXCLUSIVE RESIN ART MASTERCLASS ENROLLMENT", 450, 125);

    // Divider line
    ctx.strokeStyle = "#1e293b";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(120, 155);
    ctx.lineTo(780, 155);
    ctx.stroke();

    // Course Title
    ctx.fillStyle = "#ffffff";
    ctx.font = "900 32px sans-serif";
    const truncatedTitle = course.title.length > 38 ? course.title.slice(0, 38) + "..." : course.title;
    ctx.fillText(truncatedTitle, 450, 215);

    // Price & Validity Badges
    ctx.fillStyle = "#f59e0b";
    ctx.font = "bold 26px sans-serif";
    ctx.fillText(`Price: ${displayPrice}`, 450, 260);

    ctx.fillStyle = "#38bdf8";
    ctx.font = "bold 18px sans-serif";
    ctx.fillText(getValidityText() + " (Starts from Purchase Date)", 450, 295);

    // Subtitle instruction
    ctx.fillStyle = "#cbd5e1";
    ctx.font = "normal 16px sans-serif";
    ctx.fillText("Scan this QR code with your phone camera or Google Lens to purchase", 450, 335);

    // Load QR Image onto canvas
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      // Draw white rounded background container for QR code
      const qrBoxX = 210;
      const qrBoxY = 370;
      const qrBoxSize = 480;

      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.roundRect(qrBoxX, qrBoxY, qrBoxSize, qrBoxSize, 24);
      ctx.fill();

      // Draw QR image
      const pad = 24;
      ctx.drawImage(img, qrBoxX + pad, qrBoxY + pad, qrBoxSize - pad * 2, qrBoxSize - pad * 2);

      // Bottom Instructions
      ctx.fillStyle = "#10b981";
      ctx.font = "bold 20px sans-serif";
      ctx.fillText("⚡ Instant Auto-Checkout & Enrollment", 450, 910);

      ctx.fillStyle = "#94a3b8";
      ctx.font = "normal 16px sans-serif";
      ctx.fillText("If already logged in, opens course checkout instantly.", 450, 945);
      ctx.fillText("New or logged out students will be guided through quick login first.", 450, 975);

      // Footer divider
      ctx.strokeStyle = "#1e293b";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(120, 1020);
      ctx.lineTo(780, 1020);
      ctx.stroke();

      // Website URL
      ctx.fillStyle = "#c4431d";
      ctx.font = "bold 22px sans-serif";
      ctx.fillText("www.ravishingarthub.com", 450, 1080);

      ctx.fillStyle = "#64748b";
      ctx.font = "normal 14px sans-serif";
      ctx.fillText("Vrajangna Patel Resin Art Mentorship Academy", 450, 1115);

      // Trigger download
      const posterDataUrl = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = posterDataUrl;
      const cleanTitle = course.title.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 30);
      a.download = `Course_${cleanTitle}_Flyer.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    };
    img.src = qrDataUrl;
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white border border-[#ecdccb] rounded-2xl sm:rounded-3xl max-w-lg w-full p-4 sm:p-6 md:p-8 shadow-2xl relative max-h-[calc(100dvh-1.5rem)] sm:max-h-[90vh] lg:max-h-none overflow-y-auto lg:overflow-hidden my-auto animate-scale-up text-stone-900">
        {/* Glow Effects */}
        <div className="absolute inset-0 overflow-hidden rounded-2xl sm:rounded-3xl pointer-events-none">
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#c4431d]/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#ea580c]/5 rounded-full blur-3xl" />
        </div>

        {/* Modal Header */}
        <div className="flex items-start sm:items-center justify-between gap-2.5 sm:gap-3 pb-3.5 sm:pb-4 border-b border-stone-200 relative z-10">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-[#fde5d6] border border-[#f5ded0] flex items-center justify-center text-[#942008] shrink-0">
              <QrIcon size={20} />
            </div>
            <div className="min-w-0">
              <h3 className="text-base sm:text-xl lg:text-lg font-black text-[#942008] flex items-center gap-2">
                Course QR Code
              </h3>
              <p className="text-xs sm:text-sm lg:text-xs text-stone-500 leading-snug">
                Direct individual purchase &amp; enrollment QR code
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 hover:text-stone-800 flex items-center justify-center transition-colors cursor-pointer shrink-0"
          >
            <X size={16} />
          </button>
        </div>

        {/* Course Overview Pill */}
        <div className="my-4 sm:my-5 p-3 sm:p-3.5 rounded-2xl bg-[#faf8f5] border border-[#ecdccb] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 relative z-10">
          <div className="flex items-center gap-3 min-w-0">
            {(course.flyerImage || course.image) ? (
              <img
                src={getImageUrl((course.flyerImage || course.image) || undefined)}
                alt={course.title}
                className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl object-cover border border-stone-200 shrink-0"
              />
            ) : (
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-[#fde5d6] border border-[#f5ded0] flex items-center justify-center text-[#942008] shrink-0">
                <BookOpen size={20} />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <div className="text-xs sm:text-base lg:text-sm font-black uppercase text-[#942008] tracking-wider">
                {isStandalone ? "✨ Individual Course" : `${course.levelCode} Module`}
              </div>
              <div className="text-sm sm:text-base lg:text-sm font-black text-stone-900 truncate sm:max-w-[210px]">
                {course.title}
              </div>
              <div className="text-xs sm:text-sm lg:text-xs text-cyan-700 font-semibold flex items-center gap-1 mt-0.5">
                <Clock size={12} className="shrink-0" />
                <span className="truncate">{getValidityText()}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between sm:block sm:text-right pt-2 sm:pt-0 border-t border-[#ecdccb]/70 sm:border-t-0 shrink-0">
            <div className="text-xs sm:text-sm lg:text-xs font-bold text-stone-500">Price</div>
            <div className="text-sm sm:text-base lg:text-sm font-black text-[#942008] font-mono">
              {displayPrice}
            </div>
          </div>
        </div>

        {/* QR Code Display Container */}
        <div className="flex flex-col items-center justify-center my-4 relative z-10">
          <div className="p-3 sm:p-4 bg-white rounded-2xl sm:rounded-3xl shadow-xl border-4 border-[#ecdccb] relative group">
            {isGenerating || !qrDataUrl ? (
              <div className="w-44 h-44 sm:w-52 sm:h-52 flex flex-col items-center justify-center text-stone-400 text-xs sm:text-sm lg:text-xs">
                <Smartphone className="animate-bounce mb-2 text-[#c4431d]" size={32} />
                Generating high-res QR...
              </div>
            ) : (
              <img
                src={qrDataUrl}
                alt={`${course.title} QR Code`}
                className="w-44 h-44 sm:w-52 sm:h-52 object-contain block rounded-xl"
              />
            )}
          </div>
          <div className="text-center mt-3 px-1">
            <span className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 sm:py-1 rounded-full bg-[#fde5d6] border border-[#f5ded0] text-[#942008] text-xs sm:text-sm lg:text-xs font-bold">
              <Smartphone size={13} className="shrink-0" />
              <span>Scan with Camera or Google Lens to Purchase</span>
            </span>
          </div>
        </div>

        {/* Seamless Student Flow Info */}
        <div className="my-4 p-3 sm:p-3.5 rounded-2xl bg-stone-50 border border-stone-200 text-sm sm:text-base lg:text-sm space-y-1.5 text-stone-600 relative z-10">
          <div className="font-bold text-stone-900 flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-emerald-400 shrink-0" />
            <span>Seamless Student Flow:</span>
          </div>
          <div className="flex items-start gap-1.5 text-stone-600">
            <span className="text-emerald-400 shrink-0">✓</span>
            <span>
              <strong className="text-stone-900">Already Logged In:</strong> Opens the instant checkout modal for this specific course. If already purchased, opens lessons directly!
            </span>
          </div>
          <div className="flex items-start gap-1.5 text-stone-600">
            <span className="text-amber-400 shrink-0">✓</span>
            <span>
              <strong className="text-stone-900">Not Logged In:</strong> Student is guided through login/register first, then seamlessly landed right into this course checkout.
            </span>
          </div>
        </div>

        {/* Direct Link & Copy */}
        <div className="space-y-1.5 mb-4 sm:mb-5 relative z-10">
          <label className="text-sm sm:text-base lg:text-sm font-bold text-stone-600">Direct Link:</label>
          <div className="flex items-center gap-1.5 sm:gap-2 bg-[#faf8f5] border border-stone-200 rounded-xl p-2 text-xs">
            <input
              type="text"
              readOnly
              value={targetUrl}
              className="bg-transparent border-none text-stone-800 flex-1 min-w-0 font-mono text-xs sm:text-lg lg:text-sm focus:outline-none select-all"
            />
            <button
              onClick={handleCopyLink}
              className="px-2.5 py-1 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded-lg text-xs sm:text-base lg:text-sm font-bold transition-colors flex items-center gap-1 cursor-pointer shrink-0 whitespace-nowrap"
              title="Copy to clipboard"
            >
              {copied ? (
                <>
                  <Check size={12} className="text-emerald-400 shrink-0" /> Copied
                </>
              ) : (
                <>
                  <Copy size={12} className="shrink-0" /> Copy
                </>
              )}
            </button>
            <a
              href={targetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 sm:p-1 bg-stone-200 hover:bg-stone-300 text-stone-600 hover:text-stone-900 rounded-lg transition-colors cursor-pointer shrink-0"
              title="Test link in new tab"
            >
              <ExternalLink size={14} />
            </a>
          </div>
        </div>

        {/* Download Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 pt-3 sm:pt-2 border-t border-stone-200 relative z-10">
          <button
            onClick={handleDownloadBrandedFlyer}
            disabled={!qrDataUrl || isGenerating}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#942008] via-[#c4431d] to-[#ea580c] hover:opacity-95 text-white font-black text-sm sm:text-sm lg:text-xs h-11 px-4 rounded-xl shadow-lg transition-all cursor-pointer disabled:opacity-50"
          >
            <Download size={15} className="shrink-0" />
            <span>Download Poster / Flyer</span>
          </button>

          <button
            onClick={handleDownloadRawQr}
            disabled={!qrDataUrl || isGenerating}
            className="flex items-center justify-center gap-2 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-sm sm:text-sm lg:text-xs h-11 px-4 rounded-xl border border-stone-300 transition-colors cursor-pointer disabled:opacity-50"
          >
            <QrIcon size={15} className="shrink-0" />
            <span>Download Raw QR (PNG)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
