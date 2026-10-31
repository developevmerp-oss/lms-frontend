import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import WindingRoadSec from "@/components/landing/WindingRoadSec";

export const metadata: Metadata = {
  title: "3D Interactive Winding Road Experience | The Strategic Path",
  description:
    "First-person scroll-driven 3D travel experience along the 8-milestone path to resin art mastery.",
};

export default function RoadPage() {
  return (
    <main className="min-h-screen bg-[#040711] text-white">
      {/* Floating Back to Home button */}
      <div className="fixed top-4 left-4 z-50">
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-slate-950/80 hover:bg-slate-900 border border-slate-800 hover:border-orange-500/50 px-3.5 py-2 rounded-2xl text-xs font-bold text-slate-300 hover:text-white backdrop-blur-md transition-all shadow-xl"
        >
          <ArrowLeft size={14} className="text-orange-400" />
          <span>Back to Home</span>
        </Link>
      </div>

      <WindingRoadSec />
    </main>
  );
}

