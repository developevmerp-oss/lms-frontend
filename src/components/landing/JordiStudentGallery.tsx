"use client";

import React, { useState } from "react";
import {
  Grid,
  List,
  Sparkles,
  Search,
  CheckCircle2,
  ExternalLink,
  X,
  Eye,
  Award,
  ArrowRight,
  TrendingUp,
  Tag,
  DollarSign
} from "lucide-react";

interface Artwork {
  title: string;
  artist: string;
  type: string;
  level: string;
  price: string;
  image: string;
  badge: string;
}

interface JordiStudentGalleryProps {
  artworks: Artwork[];
}

export function JordiStudentGallery({ artworks }: JordiStudentGalleryProps) {
  const [viewMode, setViewMode] = useState<"gallery" | "list">("gallery");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);

  // Extract unique categories for filter tabs
  const categories = [
    { id: "all", label: "All Masterpieces" },
    { id: "Geode", label: "💎 Geode & Crystals" },
    { id: "Ocean", label: "🌊 Ocean Waves" },
    { id: "Floral", label: "💐 Preservation" },
    { id: "Clock", label: "⏱️ Clocks & Decor" },
  ];

  const filteredArtworks = artworks.filter((art) => {
    const matchesCategory =
      activeCategory === "all" ||
      art.badge.toLowerCase().includes(activeCategory.toLowerCase()) ||
      art.type.toLowerCase().includes(activeCategory.toLowerCase()) ||
      art.title.toLowerCase().includes(activeCategory.toLowerCase());

    const matchesSearch =
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.type.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="w-full">
      {/* ─── CONTROLS BAR (Jordi Garreta View Switcher & Filters) ─── */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 mb-8 bg-slate-900/90 border border-slate-800 p-4 md:p-6 rounded-3xl shadow-xl">
        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap border ${
                activeCategory === cat.id
                  ? "bg-orange-500/15 border-orange-500 text-orange-400 shadow-md"
                  : "bg-slate-950/80 border-slate-800/80 text-slate-400 hover:text-white hover:border-slate-700"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search & View Mode Switcher (Gallery vs List) */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Search Input */}
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={15} />
            <input
              type="text"
              placeholder="Filter student works..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition-colors"
            />
          </div>

          {/* View Mode Toggle Switch (Gallery Grid vs List Table) */}
          <div className="flex items-center bg-slate-950 border border-slate-800 p-1 rounded-xl shrink-0">
            <button
              onClick={() => setViewMode("gallery")}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === "gallery"
                  ? "bg-orange-500 text-slate-950 shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
              title="Gallery Grid View"
            >
              <Grid size={14} />
              <span className="hidden sm:inline">[ · ] Gallery</span>
            </button>

            <button
              onClick={() => setViewMode("list")}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === "list"
                  ? "bg-orange-500 text-slate-950 shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
              title="List Table View"
            >
              <List size={14} />
              <span className="hidden sm:inline">[   ] List</span>
            </button>
          </div>
        </div>
      </div>

      {/* ─── DISPLAY MODE 1: GALLERY GRID VIEW ─── */}
      {viewMode === "gallery" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredArtworks.map((art, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedArtwork(art)}
              className="u-white-box p-4 bg-slate-900 border border-slate-800 hover:border-orange-500/50 rounded-3xl transition-all duration-300 shadow-xl group cursor-pointer flex flex-col justify-between"
            >
              {/* Artwork Photo Container */}
              <div className="h-64 rounded-2xl relative overflow-hidden bg-slate-950 mb-4">
                <img
                  src={art.image}
                  alt={art.title}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                />
                
                {/* Gradient Vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                {/* Top Badges */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                  <span className="bg-slate-950/80 backdrop-blur-md border border-slate-800 text-orange-400 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md">
                    {art.badge}
                  </span>
                  <span className="bg-emerald-500/90 text-slate-950 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md">
                    {art.price}
                  </span>
                </div>

                {/* Hover Inspect Overlay */}
                <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="px-4 py-2 bg-orange-500 text-slate-950 font-black text-xs rounded-full uppercase tracking-wider shadow-xl flex items-center gap-1.5 group-hover:scale-105 transition-transform">
                    <Eye size={14} /> [ View Artwork ]
                  </span>
                </div>
              </div>

              {/* Artwork Metadata */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-xs font-bold text-white group-hover:text-orange-400 transition-colors">
                    {art.artist}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400">
                    {art.level}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-200 line-clamp-1 mb-1">
                  {art.title}
                </h4>
                <p className="text-[11px] text-slate-400 truncate">
                  {art.type}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* ─── DISPLAY MODE 2: LIST TABLE VIEW (Jordi Garreta List Style) ─── */
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/80 text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400">
                  <th className="py-4 px-6">Masterpiece Artwork</th>
                  <th className="py-4 px-6">Student Artist</th>
                  <th className="py-4 px-6">Art Technique</th>
                  <th className="py-4 px-6">Sales Status</th>
                  <th className="py-4 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-xs">
                {filteredArtworks.map((art, idx) => (
                  <tr
                    key={idx}
                    onClick={() => setSelectedArtwork(art)}
                    className="hover:bg-slate-800/50 transition-colors cursor-pointer group"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-950 shrink-0 border border-slate-800">
                          <img src={art.image} alt={art.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                        </div>
                        <div>
                          <p className="font-bold text-white group-hover:text-orange-400 transition-colors">{art.title}</p>
                          <span className="text-[10px] text-orange-400 font-mono uppercase tracking-wider">{art.badge}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <p className="font-bold text-slate-200">{art.artist}</p>
                      <span className="text-[10px] text-slate-400">{art.level}</span>
                    </td>

                    <td className="py-4 px-6 text-slate-300">
                      {art.type}
                    </td>

                    <td className="py-4 px-6">
                      <span className="inline-flex items-center gap-1 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold px-2.5 py-1 rounded-full">
                        <TrendingUp size={12} /> {art.price}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedArtwork(art);
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-slate-950 hover:bg-orange-500 text-slate-300 hover:text-slate-950 border border-slate-800 font-mono text-[11px] font-bold transition-all cursor-pointer"
                      >
                        [ Inspect ]
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─── FULL-SCREEN ARTWORK DETAIL LIGHTBOX MODAL ─── */}
      {selectedArtwork && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 md:p-8 animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full p-6 md:p-8 shadow-2xl relative overflow-hidden text-white">
            {/* Close Button */}
            <button
              onClick={() => setSelectedArtwork(null)}
              className="absolute top-5 right-5 w-9 h-9 rounded-full bg-slate-950 border border-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer z-10"
            >
              <X size={18} />
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
              {/* Artwork Image */}
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

              {/* Artwork Details */}
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
                    <span className="text-slate-400">Membership Achievement:</span>
                    <span className="font-bold text-orange-400">{selectedArtwork.level}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Casting Technique:</span>
                    <span className="font-semibold text-slate-200">{selectedArtwork.type}</span>
                  </div>
                </div>

                <div className="pt-2">
                  <a
                    href="/webinar"
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-black text-xs transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Learn How To Create This Artwork</span>
                    <ArrowRight size={16} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
