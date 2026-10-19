"use client";

import HeroVideoPlayer from "@/components/landing/HeroVideoPlayer";
import Link from "next/link";
import { Play, X } from "lucide-react";
import { useEffect, useState } from "react";

type Artwork = {
  title: string;
  image: string;
};

const COLUMNS = [
  { indexes: [8, 2, 9, 1], duration: "90s", delay: "0s", heights: ["h-32", "h-44", "h-28", "h-36"], show: "" },
  { indexes: [0, 3, 6, 4], duration: "108s", delay: "-27s", heights: ["h-40", "h-28", "h-44", "h-32"], show: "" },
  { indexes: [7, 5, 10, 11], duration: "78s", delay: "-12s", heights: ["h-44", "h-32", "h-28", "h-40"], show: "hidden sm:block" },
  { indexes: [1, 8, 0, 4], duration: "102s", delay: "-42s", heights: ["h-28", "h-40", "h-44", "h-32"], show: "hidden md:block" },
  { indexes: [6, 9, 2, 3], duration: "84s", delay: "-18s", heights: ["h-36", "h-44", "h-32", "h-28"], show: "hidden lg:block" },
  { indexes: [11, 4, 7, 5], duration: "96s", delay: "-33s", heights: ["h-44", "h-28", "h-36", "h-40"], show: "hidden xl:block" }
];

export default function LandingHero({ artworks }: { artworks: Artwork[] }) {
  const [videoOpen, setVideoOpen] = useState(false);

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
    <section className="hero-studio relative z-10 -mt-[5.625rem] flex h-dvh flex-col overflow-hidden pt-[calc(5.625rem+1.5rem)] sm:pt-[calc(5.625rem+2rem)]">
      <div className="flex min-h-0 flex-1 flex-col">
        <div className="nav-width">
          <div className="hero-enter mx-auto w-full max-w-4xl text-center">
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
        </div>

        <div className="relative mt-12 min-h-0 w-full flex-1">
          <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-12 bg-gradient-to-b from-[#f3eee6] to-transparent" />
          <div className="grid h-full w-full grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {COLUMNS.map((column) => {
              const tiles = [...column.indexes, ...column.indexes, ...column.indexes]
                .map((index, order) => ({ art: artworks[index % artworks.length], height: column.heights[order % column.heights.length] }))
                .filter((tile) => tile.art);
              return (
                <div key={column.duration + column.delay} className={`h-full overflow-hidden ${column.show}`}>
                  <div
                    className="hero-marquee-up flex flex-col"
                    style={{ ["--marquee-duration" as string]: column.duration, ["--marquee-delay" as string]: column.delay }}
                  >
                    {[0, 1].map((copy) => (
                      <div key={copy} className="flex shrink-0 flex-col gap-4 pb-4">
                        {tiles.map((tile, order) => (
                          <div
                            key={`${copy}-${tile.art.image}-${order}`}
                            className={`${tile.height} shrink-0 shadow-[0_16px_28px_-18px_rgba(90,55,20,0.55)]`}
                            style={{ borderRadius: "1.7rem" }}
                          >
                            <img
                              src={tile.art.image}
                              alt={tile.art.title}
                              className="h-full w-full object-cover"
                              style={{ clipPath: "inset(0 round 1.7rem)" }}
                            />
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {videoOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-stone-950/75 p-4" onClick={() => setVideoOpen(false)}>
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
