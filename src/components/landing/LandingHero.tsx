"use client";

import HeroVideoPlayer from "@/components/landing/HeroVideoPlayer";
import Link from "next/link";
import { Play, X } from "lucide-react";
import { useEffect, useState } from "react";

/*
  IMAGE MAP â€” all positions per reference design:
  1  = top-left,       SQUARE, half-cut at left edge   â†’ blue geode
  2  = bottom-left,    SQUARE, half-cut at left edge   â†’ cream/gold geode
  3  = top-center,     CIRCLE, half-cut at top edge    â†’ floral pendant necklace
  4  = top-right,      SQUARE, full visible            â†’ teal geode pair
  5  = mid-right,      WIDE RECT, half-cut at right    â†’ marble tray
  6  = bottom-center,  CIRCLE, half-cut at bottom edge â†’ blue swirl circle
  7  = inline title,   CIRCLE (rotates in)             â†’ floral resin circle
  8  = bottom-right,   CIRCLE, half-cut at right       â†’ second blue swirl
*/
const IMG = {
  1: "/images/hero/hero-img-1.jpg",  // blue geode
  2: "/images/hero/hero-img-2.jpg",  // cream/gold geode
  3: "/images/hero/hero-img-3.jpg",  // floral pendant necklace
  4: "/images/hero/hero-img-4.jpg",  // teal geode pair
  5: "/images/hero/hero-img-5.png",  // marble tray
  6: "/images/hero/hero-img-6.jpg",  // blue swirl circle
  7: "/images/hero/hero-img-7.jpg",  // floral resin circle (inline)
  8: "/images/hero/hero-img-8.jpg",  // second blue swirl
} as const;

export default function LandingHero() {
  const [videoOpen, setVideoOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!videoOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setVideoOpen(false); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [videoOpen]);

  return (
    <>
      <style>{`
        /* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
           HERO WRAPPER
        â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
        .lh-wrap {
          position: relative;
          min-height: 100dvh;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #ffffff;
          overflow: hidden; /* clips half-visible edge cards */
          padding: 5.625rem 0 3rem;
        }

        /* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
           BASE FLOATING CARD â€” starts invisible & off-screen
        â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
        .lh-img {
          position: absolute;
          overflow: hidden;
          opacity: 0;
          transition:
            opacity  0.85s cubic-bezier(0.22, 1, 0.36, 1),
            transform 0.85s cubic-bezier(0.22, 1, 0.36, 1);
          will-change: transform, opacity;
        }
        .lh-img img {
          width: 100%; height: 100%;
          object-fit: cover;
          display: block;
        }

        /* Mount trigger */
        .lh-on .lh-img { opacity: 1; }

        /* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
           CARD 1 â€” top-left, SQUARE, half off left edge
           Real image: blue geode (square-ish)
        â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
        .lh-i1 {
          width: clamp(130px, 14vw, 185px);
          aspect-ratio: 1 / 1;
          border-radius: 1.3rem;
          top: 13%;
          left: 0;
          transform: translateX(-55%) rotate(-7deg) translateY(-20px);
          box-shadow: 8px 8px 32px -4px rgba(40,25,5,0.20);
        }
        .lh-on .lh-i1 {
          transform: translateX(-30%) rotate(-7deg) translateY(0);
          transition-delay: 0.04s;
        }

        /* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
           CARD 2 â€” bottom-left, SQUARE, half off left edge
           Real image: cream/gold geode
        â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
        .lh-i2 {
          width: clamp(120px, 13vw, 170px);
          aspect-ratio: 1 / 1;
          border-radius: 1.3rem;
          bottom: 16%;
          left: 0;
          transform: translateX(-55%) rotate(5deg) translateY(20px);
          box-shadow: 8px 8px 32px -4px rgba(40,25,5,0.20);
        }
        .lh-on .lh-i2 {
          transform: translateX(-30%) rotate(5deg) translateY(0);
          transition-delay: 0.12s;
        }

        /* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
           CARD 3 â€” top-center, CIRCLE, half off top edge
           Real image: floral pendant necklace
        â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
        .lh-i3 {
          width: clamp(100px, 10.5vw, 138px);
          aspect-ratio: 1 / 1;
          border-radius: 50%;
          top: 0;
          left: 42%;
          transform: translateY(-55%) rotate(3deg) translateX(10px);
          box-shadow: 0 12px 32px -6px rgba(40,25,5,0.18);
        }
        .lh-on .lh-i3 {
          transform: translateY(-28%) rotate(3deg) translateX(0);
          transition-delay: 0.20s;
        }

        /* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
           CARD 4 â€” top-right area, SQUARE, full visible
           Real image: teal geode pair (landscape)
        â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
        .lh-i4 {
          width: clamp(115px, 12.5vw, 165px);
          aspect-ratio: 3 / 2;
          border-radius: 1.3rem;
          top: 7%;
          right: 4%;
          transform: rotate(5deg) translate(60px, -50px);
          box-shadow: 0 10px 30px -6px rgba(40,25,5,0.20);
        }
        .lh-on .lh-i4 {
          transform: rotate(5deg) translate(0, 0);
          transition-delay: 0.26s;
        }

        /* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
           CARD 5 â€” mid-right, WIDE RECT, half off right edge
           Real image: marble tray (landscape wide)
        â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
        .lh-i5 {
          width: clamp(140px, 16vw, 210px);
          aspect-ratio: 2.5 / 1;
          border-radius: 999px;      /* pill shape like the tray */
          top: 38%;
          right: 0;
          transform: translateX(45%) rotate(-8deg) translateY(10px);
          box-shadow: -8px 8px 30px -6px rgba(40,25,5,0.18);
        }
        .lh-on .lh-i5 {
          transform: translateX(20%) rotate(-8deg) translateY(0);
          transition-delay: 0.33s;
        }

        /* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
           CARD 6 â€” bottom-center, CIRCLE, half off bottom
           Real image: blue swirl circle
        â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
        .lh-i6 {
          width: clamp(105px, 11vw, 145px);
          aspect-ratio: 1 / 1;
          border-radius: 50%;
          bottom: 0;
          left: 48%;
          transform: translateX(-50%) translateY(55%) rotate(-3deg);
          box-shadow: 0 -6px 30px -6px rgba(40,25,5,0.16);
        }
        .lh-on .lh-i6 {
          transform: translateX(-50%) translateY(28%) rotate(-3deg);
          transition-delay: 0.40s;
        }

        /* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
           CARD 8 â€” bottom-right, CIRCLE, half off right
           Real image: second blue swirl
        â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
        .lh-i8 {
          width: clamp(95px, 10vw, 132px);
          aspect-ratio: 1 / 1;
          border-radius: 50%;
          bottom: 8%;
          right: 0;
          transform: translateX(55%) rotate(4deg) translateY(10px);
          box-shadow: -8px 6px 28px -6px rgba(40,25,5,0.16);
        }
        .lh-on .lh-i8 {
          transform: translateX(28%) rotate(4deg) translateY(0);
          transition-delay: 0.46s;
        }

        /* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
           INLINE TITLE IMAGE â€” rotates in (ONE image)
        â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
        .lh-inline {
          display: inline-block;
          width: 0.92em;
          height: 0.92em;
          border-radius: 50%;
          overflow: hidden;
          vertical-align: middle;
          position: relative;
          top: -0.06em;
          margin: 0 0.06em;
          opacity: 0;
          transform: rotate(-150deg) scale(0.15);
          transition:
            opacity  0.95s cubic-bezier(0.22, 1, 0.36, 1),
            transform 0.95s cubic-bezier(0.22, 1, 0.36, 1);
          transition-delay: 0.55s;
          box-shadow: 0 2px 12px rgba(0,0,0,0.15);
        }
        .lh-inline img {
          width: 100%; height: 100%;
          object-fit: cover;
          border-radius: 50%;
        }
        .lh-on .lh-inline {
          opacity: 1;
          transform: rotate(0deg) scale(1);
        }

        /* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
           CENTER TEXT BLOCK
        â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
        .lh-center {
          position: relative;
          z-index: 10;
          text-align: center;
          max-width: 820px;
          margin: 0 auto;
          padding: 0 2rem;
        }

        .lh-h1 {
          font-family: var(--font-display), Georgia, "Times New Roman", serif;
          font-size: clamp(2rem, 5.8vw, 4.6rem);
          font-weight: 500;
          letter-spacing: -0.04em;
          line-height: 1.08;
          color: #0d0d0d;
          margin: 0 0 1.1rem;
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.75s ease, transform 0.75s ease;
          transition-delay: 0.05s;
        }
        .lh-on .lh-h1 { opacity: 1; transform: translateY(0); }

        .lh-sub {
          font-size: clamp(0.9rem, 1.4vw, 1rem);
          color: #6b7280;
          max-width: 400px;
          margin: 0 auto 1.8rem;
          line-height: 1.65;
          font-family: var(--font-landing), "Nunito Sans", sans-serif;
          opacity: 0;
          transform: translateY(16px);
          transition: opacity 0.6s ease, transform 0.6s ease;
          transition-delay: 0.22s;
        }
        .lh-on .lh-sub { opacity: 1; transform: translateY(0); }

        .lh-btns {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          flex-wrap: wrap;
          opacity: 0;
          transform: translateY(12px);
          transition: opacity 0.6s ease, transform 0.6s ease;
          transition-delay: 0.33s;
        }
        .lh-on .lh-btns { opacity: 1; transform: translateY(0); }

        /* Buttons */
        .lh-btn-a {
          display: inline-flex;
          align-items: center;
          background: #111;
          color: #fff;
          padding: 0.85rem 2.1rem;
          border-radius: 9999px;
          font-size: 0.9rem;
          font-weight: 600;
          letter-spacing: 0.01em;
          text-decoration: none;
          box-shadow: 0 10px 28px -10px rgba(0,0,0,0.5);
          transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
          font-family: var(--font-landing), sans-serif;
        }
        .lh-btn-a:hover { background: #2e2e2e; transform: translateY(-1px); box-shadow: 0 14px 32px -10px rgba(0,0,0,0.5); }

        .lh-btn-b {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: #fff;
          color: #111;
          padding: 0.75rem 1.35rem;
          border-radius: 9999px;
          font-size: 0.9rem;
          font-weight: 600;
          border: 1.5px solid #e5e7eb;
          cursor: pointer;
          box-shadow: 0 2px 8px -2px rgba(0,0,0,0.07);
          transition: background 0.2s, border-color 0.2s, transform 0.2s;
          font-family: var(--font-landing), sans-serif;
        }
        .lh-btn-b:hover { background: #f9fafb; border-color: #d1d5db; transform: translateY(-1px); }

        .lh-play-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 28px; height: 28px;
          border-radius: 50%;
          background: #111;
          color: #fff;
          flex-shrink: 0;
        }

        /* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
           RESPONSIVE
        â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
        @media (max-width: 1024px) {
          .lh-i4 { right: 2%; }
          .lh-i8 { display: none; }
        }
        @media (max-width: 860px) {
          .lh-i5 { display: none; }
          .lh-i4 { display: none; }
        }
        @media (max-width: 640px) {
          .lh-i3, .lh-i6 { display: none; }
          .lh-i1 { width: 110px; }
          .lh-i2 { width: 100px; }
        }
        @media (max-width: 480px) {
          .lh-i1, .lh-i2 { display: none; }
        }
      `}</style>

      <section className={`lh-wrap${mounted ? " lh-on" : ""}`}>

        {/* â”€â”€ 1: top-left, SQUARE half-cut at left â€” Blue geode â”€â”€ */}
        <div className="lh-img lh-i1">
          <img src={IMG[1]} alt="Blue geode resin coaster" />
        </div>

        {/* â”€â”€ 2: bottom-left, SQUARE half-cut at left â€” Cream/gold geode â”€â”€ */}
        <div className="lh-img lh-i2">
          <img src={IMG[2]} alt="Cream gold geode resin art" />
        </div>

        {/* â”€â”€ 3: top-center, CIRCLE half-cut at top â€” Floral pendant â”€â”€ */}
        <div className="lh-img lh-i3">
          <img src={IMG[3]} alt="Floral pendant necklace" />
        </div>

        {/* â”€â”€ 4: top-right, RECT full â€” Teal geode pair â”€â”€ */}
        <div className="lh-img lh-i4">
          <img src={IMG[4]} alt="Teal geode coaster pair" />
        </div>

        {/* â”€â”€ 5: mid-right, PILL half-cut at right â€” Marble tray â”€â”€ */}
        <div className="lh-img lh-i5">
          <img src={IMG[5]} alt="Marble resin tray" />
        </div>

        {/* â”€â”€ 6: bottom-center, CIRCLE half-cut at bottom â€” Blue swirl â”€â”€ */}
        <div className="lh-img lh-i6">
          <img src={IMG[6]} alt="Blue swirl resin coaster" />
        </div>

        {/* â”€â”€ 8: bottom-right, CIRCLE half-cut at right â€” Second blue swirl â”€â”€ */}
        <div className="lh-img lh-i8">
          <img src={IMG[8]} alt="Blue ocean swirl resin" />
        </div>

        {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
            CENTER TITLE + BUTTONS
        â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
        <div className="lh-center">
          <h1 className="lh-h1">
            Turn Your Resin Art
            <br />
            Passion Into{" "}
            <span className="lh-inline">
              <img src={IMG[7]} alt="floral resin circle" />
            </span>
            {" "}Skill,
            <br />
            Identity &amp; Financial
            <br />
            Freedom
          </h1>

          <p className="lh-sub">
            Discover expert techniques and unleash your creativity with
            professional guidance.
          </p>

          <div className="lh-btns">
            <Link href="/webinar" className="lh-btn-a">
              Explore Courses
            </Link>
            <button type="button" onClick={() => setVideoOpen(true)} className="lh-btn-b">
              <span className="lh-play-icon">
                <Play size={12} className="ml-0.5" fill="white" />
              </span>
              Watch
            </button>
          </div>
        </div>
      </section>

      {/* â”€â”€ Video Modal â”€â”€ */}
      {videoOpen && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-stone-950/75 p-4"
          onClick={() => setVideoOpen(false)}
        >
          <div className="relative w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
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
    </>
  );
}

