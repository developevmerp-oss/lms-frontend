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
    ctx.strokeStyle = "#f97316";
    ctx.lineWidth = 4;
    ctx.strokeRect(30, 30, 840, 1190);

    // Header Badge: Brand Name
    ctx.fillStyle = "#f97316";
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
      ctx.fillStyle = "#f97316";
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
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl relative overflow-hidden animate-scale-up text-white">
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
              <QrIcon size={20} />
            </div>
            <div>
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                Course QR Code
              </h3>
              <p className="text-xs text-slate-400">
                Direct individual purchase &amp; enrollment QR code
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Course Overview Pill */}
        <div className="my-5 p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {(course.flyerImage || course.image) ? (
              <img
                src={getImageUrl((course.flyerImage || course.image) || undefined)}
                alt={course.title}
                className="w-12 h-12 rounded-xl object-cover border border-slate-800 shrink-0"
              />
            ) : (
              <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400 shrink-0">
                <BookOpen size={20} />
              </div>
            )}
            <div className="min-w-0">
              <div className="text-[10px] font-black uppercase text-orange-400 tracking-wider">
                {isStandalone ? "✨ Individual Course" : `${course.levelCode} Module`}
              </div>
              <div className="text-xs font-black text-white truncate max-w-[210px]">
                {course.title}
              </div>
              <div className="text-[10px] text-cyan-400 font-semibold flex items-center gap-1 mt-0.5">
                <Clock size={10} /> {getValidityText()}
              </div>
            </div>
          </div>
          <div className="text-right shrink-0">
            <div className="text-[10px] font-bold text-slate-400">Price</div>
            <div className="text-sm font-black text-amber-400 font-mono">
              {displayPrice}
            </div>
          </div>
        </div>

        {/* QR Code Display Container */}
        <div className="flex flex-col items-center justify-center my-4">
          <div className="p-4 bg-white rounded-3xl shadow-2xl border-4 border-orange-500/20 relative group">
            {isGenerating || !qrDataUrl ? (
              <div className="w-52 h-52 flex flex-col items-center justify-center text-slate-500 text-xs">
                <Smartphone className="animate-bounce mb-2 text-orange-500" size={32} />
                Generating high-res QR...
              </div>
            ) : (
              <img
                src={qrDataUrl}
                alt={`${course.title} QR Code`}
                className="w-52 h-52 object-contain block rounded-xl"
              />
            )}
          </div>
          <div className="text-center mt-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-[11px] font-bold">
              <Smartphone size={12} /> Scan with Camera or Google Lens to Purchase
            </span>
          </div>
        </div>

        {/* Seamless Student Flow Info */}
        <div className="my-4 p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800/80 text-[11px] space-y-1.5 text-slate-300">
          <div className="font-bold text-white flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-emerald-400" />
            Seamless Student Flow:
          </div>
          <div className="flex items-start gap-1.5 text-slate-400">
            <span className="text-emerald-400">✓</span>
            <span>
              <strong className="text-slate-200">Already Logged In:</strong> Opens the instant checkout modal for this specific course. If already purchased, opens lessons directly!
            </span>
          </div>
          <div className="flex items-start gap-1.5 text-slate-400">
            <span className="text-amber-400">✓</span>
            <span>
              <strong className="text-slate-200">Not Logged In:</strong> Student is guided through login/register first, then seamlessly landed right into this course checkout.
            </span>
          </div>
        </div>

        {/* Direct Link & Copy */}
        <div className="space-y-1.5 mb-5">
          <label className="text-[11px] font-bold text-slate-400">Direct Link:</label>
          <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs">
            <input
              type="text"
              readOnly
              value={targetUrl}
              className="bg-transparent border-none text-slate-300 flex-1 font-mono text-[11px] focus:outline-none select-all"
            />
            <button
              onClick={handleCopyLink}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-[11px] font-bold transition-colors flex items-center gap-1 cursor-pointer shrink-0"
              title="Copy to clipboard"
            >
              {copied ? (
                <>
                  <Check size={12} className="text-emerald-400" /> Copied
                </>
              ) : (
                <>
                  <Copy size={12} /> Copy
                </>
              )}
            </button>
            <a
              href={targetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
              title="Test link in new tab"
            >
              <ExternalLink size={14} />
            </a>
          </div>
        </div>

        {/* Download Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-800">
          <button
            onClick={handleDownloadBrandedFlyer}
            disabled={!qrDataUrl || isGenerating}
            className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-slate-950 font-black text-xs h-11 px-4 rounded-xl shadow-lg transition-all cursor-pointer disabled:opacity-50"
          >
            <Download size={15} />
            <span>Download Poster / Flyer</span>
          </button>

          <button
            onClick={handleDownloadRawQr}
            disabled={!qrDataUrl || isGenerating}
            className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs h-11 px-4 rounded-xl border border-slate-700 transition-colors cursor-pointer disabled:opacity-50"
          >
            <QrIcon size={15} />
            <span>Download Raw QR (PNG)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
