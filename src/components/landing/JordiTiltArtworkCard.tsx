"use client";

import React, { useState, useRef, MouseEvent } from "react";
import { Eye, TrendingUp, Sparkles, Award } from "lucide-react";

interface ArtworkCardProps {
  art: {
    title: string;
    artist: string;
    type: string;
    level: string;
    price: string;
    image: string;
    badge: string;
  };
  borderColor?: string;
  onInspect?: (art: any) => void;
}

export function JordiTiltArtworkCard({ art, borderColor = "hover:border-orange-500/60", onInspect }: ArtworkCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transformStyle, setTransformStyle] = useState("perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)");
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = -((y - centerY) / centerY) * 12; // max 12 deg tilt
    const rotateY = ((x - centerX) / centerX) * 12;

    setTransformStyle(`perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale(1.04)`);
    setCursorPos({ x, y });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTransformStyle("perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)");
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => onInspect && onInspect(art)}
      style={{
        transform: transformStyle,
        transition: isHovered ? "transform 0.1s ease-out" : "transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)",
        willChange: "transform",
      }}
      className={`w-[290px] md:w-[330px] bg-slate-900 border border-slate-800/80 ${borderColor} rounded-3xl p-3.5 shrink-0 shadow-2xl group overflow-hidden relative cursor-pointer select-none transition-all duration-300`}
    >
      {/* Real Artwork Photo */}
      <div className="h-64 rounded-2xl relative overflow-hidden bg-slate-950">
        <img
          src={art.image}
          alt={art.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
        />

        {/* Dark Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-300" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 z-10">
          <span className="bg-slate-950/80 backdrop-blur-md border border-slate-800/80 text-orange-400 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md">
            {art.badge}
          </span>
          <span className="bg-emerald-500/90 text-slate-950 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md">
            {art.price}
          </span>
        </div>

        {/* Bottom Details Banner on Card */}
        <div className="absolute bottom-3 left-3 right-3 z-10">
          <p className="text-xs font-bold text-white line-clamp-1 group-hover:text-orange-300 transition-colors">
            {art.title}
          </p>
          <div className="flex items-center justify-between text-[10px] text-slate-300 font-medium mt-0.5">
            <span>{art.artist}</span>
            <span className="text-orange-400 font-semibold">{art.level}</span>
          </div>
        </div>

        {/* ─── FLOATING CURSOR FOLLOWER BADGE (Inspired by jordigarreta.com) ─── */}
        {isHovered && (
          <div
            style={{
              left: `${cursorPos.x}px`,
              top: `${cursorPos.y}px`,
              transform: "translate(-50%, -50%)",
            }}
            className="pointer-events-none absolute z-20 px-3.5 py-1.5 rounded-full bg-orange-500/90 text-slate-950 backdrop-blur-md shadow-2xl text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 whitespace-nowrap animate-scale-in"
          >
            <Eye size={12} />
            <span>[ VIEW ARTWORK ]</span>
          </div>
        )}
      </div>
    </div>
  );
}
