"use client";

import HeroVideoPlayer from "@/components/landing/HeroVideoPlayer";
import Link from "next/link";
import { Play, X } from "lucide-react";
import { useEffect, useState } from "react";

type Artwork = {
  title: string;
  image: string;
};

const TILES = [
  { index: 7, span: "lg:col-span-1", aspect: "aspect-[4/3]", lift: "lg:mb-6" },
  { index: 8, span: "lg:col-span-1", aspect: "aspect-[4/3]", lift: "lg:mb-2" },
  { index: 2, span: "lg:col-span-1", aspect: "aspect-square", lift: "lg:mb-8" },
  { index: 0, span: "lg:col-span-1", aspect: "aspect-square", lift: "lg:mb-1", circle: true },
  { index: 6, span: "lg:col-span-1", aspect: "aspect-[4/3]", lift: "lg:mb-5" },
  { index: 5, span: "lg:col-span-1", aspect: "aspect-[4/3]", lift: "lg:mb-10" },
  { index: 1, span: "col-span-2 lg:col-span-2", aspect: "aspect-[16/10]", lift: "" },
  { index: 3, span: "lg:col-span-1", aspect: "aspect-square", lift: "lg:mt-3" },
  { index: 4, span: "lg:col-span-1", aspect: "aspect-square", lift: "lg:mt-6", circle: true },
  { index: 11, span: "col-span-2 lg:col-span-2", aspect: "aspect-[16/10]", lift: "lg:mt-2" },
  { index: 8, span: "lg:col-span-1", aspect: "aspect-[4/3]", lift: "lg:mt-4" },
  { index: 2, span: "lg:col-span-1", aspect: "aspect-square", lift: "lg:mt-1" },
  { index: 0, span: "lg:col-span-1", aspect: "aspect-square", lift: "lg:mt-5" },
  { index: 6, span: "lg:col-span-1", aspect: "aspect-[4/3]", lift: "lg:mt-2" },
  { index: 1, span: "col-span-2 lg:col-span-2", aspect: "aspect-[16/10]", lift: "" }
];

export default function LandingHero({ artworks }: { artworks: Artwork[] }) {
  const [videoOpen, setVideoOpen] = useState(false);
  const pieces = TILES.map((tile, order) => ({
    ...tile,
    order,
    art: artworks[tile.index]
  })).filter((piece) => piece.art);

  useEffect(() => {
    if (!videoOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setVideoOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [videoOpen]);

  return (
    <section className="hero-studio relative z-10 bg-white px-6 pb-16 pt-16">
      <div className="mx-auto max-w-5xl">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-5xl font-black tracking-[-0.045em] text-stone-950 sm:text-6xl md:text-7xl">
            Learn Resin Art
          </h1>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/webinar"
              className="hero-cta inline-flex items-center rounded-full bg-stone-950 px-7 py-3 text-[15px] font-semibold text-white shadow-[0_14px_30px_-16px_rgba(28,25,23,0.75)] transition hover:bg-stone-800"
            >
              Explore Courses
            </Link>
            <button
              type="button"
              onClick={() => setVideoOpen(true)}
              className="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white px-5 py-2.5 text-sm font-semibold text-stone-950 shadow-sm transition hover:bg-stone-50"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-stone-950 text-white">
                <Play size={14} className="ml-0.5 fill-white" />
              </span>
              Watch
            </button>
          </div>
        </div>

        <div className="mx-auto mt-12 grid max-w-5xl grid-cols-2 items-end gap-3 sm:gap-4 lg:grid-cols-6">
          {pieces.map(({ art, span, aspect, lift, circle, order }) => (
            <div
              key={`${art.image}-${order}`}
              className={`hero-piece ${span} ${lift || ""}`}
              style={{ ["--hero-delay" as string]: `${(order % 6) * 0.35}s`, ["--hero-duration" as string]: `${6.4 + (order % 4) * 0.4}s` }}
            >
              <div className="rounded-[22px] bg-white p-1.5 shadow-[0_18px_40px_-24px_rgba(70,48,24,0.45)]">
                <div className={`${aspect} overflow-hidden ${circle ? "rounded-full" : "rounded-[16px]"}`}>
                  <img src={art.image} alt={art.title} className="h-full w-full object-cover" />
                </div>
              </div>
            </div>
          ))}
        </div>



        {/* <div className="mx-auto mt-8 max-w-3xl px-2 text-center">
          <p className="text-base font-semibold text-stone-800 md:text-lg">
            Turn Your Resin Art Passion Into Skill, Identity &amp; Financial Freedom
          </p>
          <p className="mx-auto mb-4 mt-3 max-w-2xl text-sm leading-relaxed text-stone-500 md:text-base">
            You already have the creativity. You already have the passion. What you need is the right path to turn that passion into something that gives you confidence, recognition, income and freedom.
          </p>
          <p className="mb-4 text-sm font-semibold text-stone-800 md:text-base">
            Learn Resin Art. Build Your Signature Style. Create Your Identity. Build Your Income.
          </p>
          <div className="mb-4 flex flex-wrap items-center justify-center gap-2">
            <span className="rounded-full bg-white px-3.5 py-1.5 text-xs font-medium text-stone-700 shadow-sm">🎨 Learn Resin Art</span>
            <span className="rounded-full bg-white px-3.5 py-1.5 text-xs font-medium text-stone-700 shadow-sm">✨ Signature Style</span>
            <span className="rounded-full bg-white px-3.5 py-1.5 text-xs font-medium text-stone-700 shadow-sm">👑 Create Identity</span>
            <span className="rounded-full bg-white px-3.5 py-1.5 text-xs font-medium text-stone-700 shadow-sm">💰 Build Income</span>
          </div>
          <p className="mx-auto mb-4 max-w-2xl text-sm leading-relaxed text-stone-500">
            Join a community of women who are transforming their creativity into something much bigger than a hobby.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-semibold text-stone-500">
            <div className="flex items-center gap-1 text-amber-500">
              <Star size={13} className="fill-amber-400" />
              <Star size={13} className="fill-amber-400" />
              <Star size={13} className="fill-amber-400" />
              <Star size={13} className="fill-amber-400" />
              <Star size={13} className="fill-amber-400" />
              <span className="ml-1 font-bold text-stone-950">4.9/5</span>
            </div>
            <span>•</span>
            <span>2,400+ Verified Student Reviews</span>
            <span>•</span>
            <span className="font-bold text-emerald-700">100% Free Masterclass</span>
          </div>
        </div> */}
      </div>

      {videoOpen && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-stone-950/75 p-4"
          onClick={() => setVideoOpen(false)}
        >
          <div className="relative w-full max-w-4xl" onClick={(event) => event.stopPropagation()}>
            <button
              type="button"
              onClick={() => setVideoOpen(false)}
              className="absolute -top-11 right-0 flex h-9 w-9 items-center justify-center rounded-full bg-white text-stone-950 shadow"
              aria-label="Close video"
            >
              <X size={18} />
            </button>
            <HeroVideoPlayer />
          </div>
        </div>
      )}
    </section>
  );
}
