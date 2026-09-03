"use client";

import React, { useState, useRef } from "react";
import { JordiTiltArtworkCard } from "./JordiTiltArtworkCard";
import { Sparkles, Eye, ArrowRight, CheckCircle2, ChevronRight, ChevronLeft } from "lucide-react";
import Link from "next/link";

interface Artwork {
  title: string;
  artist: string;
  type: string;
  level: string;
  price: string;
  image: string;
  badge: string;
}

interface GSAPStudentGalleryProps {
  artworks: Artwork[];
}

export function GSAPStudentGallery({ artworks }: GSAPStudentGalleryProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);

  const scrollLeft = () => {
    if (trackRef.current) {
      trackRef.current.scrollBy({ left: -450, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (trackRef.current) {
      trackRef.current.scrollBy({ left: 450, behavior: "smooth" });
    }
  };

  return (
    <div className="w-full relative overflow-hidden bg-slate-950/90 py-16 flex flex-col justify-center border-y border-slate-800/80">
      {/* Section Header */}
      <div className="max-w-7xl mx-auto px-6 mb-8 w-full flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-orange-400 text-xs font-black uppercase tracking-widest block mb-2">
            Real Transformations &amp; Student Masterpieces
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-white">
            From “I Can't” To “I Created This.”
          </h2>
          <p className="text-slate-300 text-sm md:text-base mt-2 max-w-2xl">
            Explore real student resin art commissions, created by learners across Level 0 to Level 3. Hover over any artwork to inspect details.
          </p>
        </div>

        {/* Manual Scroll Controls & Counter */}
        <div className="flex items-center gap-3">
          <button
            onClick={scrollLeft}
            className="w-10 h-10 rounded-2xl bg-slate-900 border border-slate-800 hover:border-orange-500 text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-lg"
            title="Scroll Left"
          >
            <ChevronLeft size={20} />
          </button>
          <span className="text-xs font-mono font-bold text-orange-400 px-3.5 py-1.5 bg-slate-900 border border-slate-800 rounded-xl">
            {artworks.length} Masterpieces
          </span>
          <button
            onClick={scrollRight}
            className="w-10 h-10 rounded-2xl bg-slate-900 border border-slate-800 hover:border-orange-500 text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-lg"
            title="Scroll Right"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* ─── SMOOTH 3D TILT HORIZONTAL SCROLL GALLERY TRACK ─── */}
      <div className="w-full overflow-hidden py-4">
        <div
          ref={trackRef}
          className="flex gap-6 px-6 md:px-12 items-center overflow-x-auto scrollbar-none py-4 scroll-smooth"
        >
          {artworks.map((art, idx) => (
            <JordiTiltArtworkCard
              key={idx}
              art={art}
              borderColor={idx % 2 === 0 ? "hover:border-orange-500/80" : "hover:border-cyan-500/80"}
              onInspect={(selected) => setSelectedArtwork(selected)}
            />
          ))}
        </div>
      </div>

      {/* ─── LIGHTBOX PREVIEW MODAL ─── */}
      {selectedArtwork && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 md:p-8 animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full p-6 md:p-8 shadow-2xl relative overflow-hidden text-white">
            <button
              onClick={() => setSelectedArtwork(null)}
              className="absolute top-5 right-5 w-9 h-9 rounded-full bg-slate-950 border border-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer z-10 font-bold"
            >
              ✕
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
              <div className="h-80 sm:h-96 rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 relative">
                <img
                  src={selectedArtwork.image}
                  alt={selectedArtwork.title}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-3 left-3 bg-orange-500 text-slate-950 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-lg">
                  {selectedArtwork.badge}
                </span>
              </div>

              <div className="space-y-4">
                <div className="inline-flex items-center gap-1.5 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold px-3 py-1 rounded-full">
                  <CheckCircle2 size={14} /> Verified Student Commission ({selectedArtwork.price})
                </div>

                <h3 className="text-2xl font-black text-white leading-tight">
                  {selectedArtwork.title}
                </h3>

                <div className="space-y-2 text-xs text-slate-300 bg-slate-950 border border-slate-800 rounded-2xl p-4">
                  <div className="flex justify-between border-b border-slate-800/80 pb-2">
                    <span className="text-slate-400">Created By Student:</span>
                    <span className="font-bold text-white">{selectedArtwork.artist}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800/80 pb-2">
                    <span className="text-slate-400">Membership Tier:</span>
                    <span className="font-bold text-orange-400">{selectedArtwork.level}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Technique:</span>
                    <span className="font-semibold text-slate-200">{selectedArtwork.type}</span>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    href="/webinar"
                    onClick={() => setSelectedArtwork(null)}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-black text-xs transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Learn How To Create This Artwork →</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
