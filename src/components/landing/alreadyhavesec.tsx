"use client";

import React, { useState, useEffect, useRef } from "react";

interface CardData {
  id: string;
  titleLine1: string;
  titleLine2: string;
  description: string;
  image: string;
  waveColor: string;
  desktopX: number;
  desktopY: number;
  desktopRotate: number;
  tabletX: number;
  tabletY: number;
  tabletRotate: number;
  mobileY: number;
  mobileRotate: number;
  zIndex: number;
}

const CARDS: CardData[] = [
  {
    id: "card-1",
    titleLine1: "NO PRIOR",
    titleLine2: "ART DEGREE",
    description: "You don't need to be an expert to begin.",
    image: "/images/alreadyhave/already-have-1.png",
    waveColor: "#f9e1cb",
    desktopX: -290,
    desktopY: 0,
    desktopRotate: -4.5,
    tabletX: -190,
    tabletY: 0,
    tabletRotate: -3.5,
    mobileY: 0,
    mobileRotate: -2,
    zIndex: 10,
  },
  {
    id: "card-2",
    titleLine1: "NO FANCY",
    titleLine2: "ART STUDIO",
    description: "You don't need an expensive or perfect setup.",
    image: "/images/alreadyhave/already-have-2.png",
    waveColor: "#fde0d3",
    desktopX: 0,
    desktopY: -6,
    desktopRotate: -0.5,
    tabletX: 0,
    tabletY: -4,
    tabletRotate: -0.5,
    mobileY: 28,
    mobileRotate: 1.5,
    zIndex: 20,
  },
  {
    id: "card-3",
    titleLine1: "NO SOCIAL",
    titleLine2: "FOLLOWER BASE",
    description: "You don't need thousands of social media followers.",
    image: "/images/alreadyhave/already-have-3.png",
    waveColor: "#ede2f5",
    desktopX: 290,
    desktopY: 0,
    desktopRotate: 4.5,
    tabletX: 190,
    tabletY: 0,
    tabletRotate: 3.5,
    mobileY: 56,
    mobileRotate: -0.5,
    zIndex: 30,
  },
];

export default function AlreadyHaveSec() {
  const containerRef = useRef<HTMLDivElement>(null);
  const targetProgressRef = useRef(0);
  const currentProgressRef = useRef(0);
  const [smoothProgress, setSmoothProgress] = useState(0);
  const [windowWidth, setWindowWidth] = useState(1200);
  const [activeMobileCard, setActiveMobileCard] = useState<number | null>(null);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    let animationFrameId: number;
    let isRunning = true;

    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const winH = window.innerHeight;
      const totalScrollable = rect.height - winH;
      if (totalScrollable > 0) {
        const currentScroll = -rect.top;
        const p = Math.max(0, Math.min(1, currentScroll / totalScrollable));
        targetProgressRef.current = p;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    // High-performance physics-based smooth damping loop (60fps/120fps)
    const lerp = (start: number, end: number, factor: number) =>
      start + (end - start) * factor;

    const tick = () => {
      if (!isRunning) return;

      const current = currentProgressRef.current;
      const target = targetProgressRef.current;
      const diff = target - current;

      if (Math.abs(diff) > 0.0002) {
        const next = lerp(current, target, 0.12);
        currentProgressRef.current = next;
        setSmoothProgress(next);
      } else if (current !== target) {
        currentProgressRef.current = target;
        setSmoothProgress(target);
      }

      animationFrameId = requestAnimationFrame(tick);
    };

    animationFrameId = requestAnimationFrame(tick);

    return () => {
      isRunning = false;
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const isDesktop = windowWidth >= 1024;
  const isTablet = windowWidth >= 768 && windowWidth < 1024;
  const isMobile = windowWidth < 768;

  const easeOutCubic = (x: number) => 1 - Math.pow(1 - x, 3);

  // Staggered, overlapping arrival choreography
  const getCardTransform = (index: number) => {
    const card = CARDS[index];

    let startP = 0.04;
    let endP = 0.44;

    if (isDesktop || isTablet) {
      if (index === 1) {
        startP = 0.16;
        endP = 0.56;
      } else if (index === 2) {
        startP = 0.28;
        endP = 0.68;
      }
    } else {
      if (index === 0) {
        startP = 0.04;
        endP = 0.35;
      } else if (index === 1) {
        startP = 0.22;
        endP = 0.54;
      } else {
        startP = 0.42;
        endP = 0.74;
      }
    }

    const rawT = Math.max(0, Math.min(1, (smoothProgress - startP) / (endP - startP)));
    const easedT = easeOutCubic(rawT);
    const enterY = (1 - easedT) * (isMobile ? 50 : 80);
    const scale = 0.94 + easedT * 0.06;
    const opacity = Math.min(1, rawT * 2.5);

    if (isDesktop) {
      const currentX = card.desktopX * easedT;
      const currentRot = card.desktopRotate * easedT;
      return {
        transform: `translate3d(${currentX}px, ${card.desktopY + enterY}px, 0) rotate(${currentRot}deg) scale(${scale})`,
        opacity,
        zIndex: card.zIndex,
      };
    } else if (isTablet) {
      const currentX = card.tabletX * easedT;
      const currentRot = card.tabletRotate * easedT;
      return {
        transform: `translate3d(${currentX}px, ${card.tabletY + enterY}px, 0) rotate(${currentRot}deg) scale(${scale})`,
        opacity,
        zIndex: card.zIndex,
      };
    } else {
      const isSelected = activeMobileCard === index;
      const currentRot = card.mobileRotate * easedT;
      const baseScale = (index === 0 ? 0.96 : index === 1 ? 0.98 : 1.0) * scale;
      return {
        transform: `translate3d(0, ${card.mobileY + enterY}px, 0) rotate(${currentRot}deg) scale(${isSelected ? 1.03 : baseScale})`,
        opacity,
        zIndex: isSelected ? 40 : card.zIndex,
      };
    }
  };

  return (
    <section
      className="already-have-sec relative z-20 overflow-visible"
      style={{
        backgroundColor: "#ffffff",
        backgroundImage: "radial-gradient(circle, #e2ded4 1.5px, transparent 1.5px)",
        backgroundSize: "24px 24px",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Scroll track container providing the scroll timeline */}
      <div
        ref={containerRef}
        className="relative w-full"
        style={{ height: isDesktop ? "250vh" : isTablet ? "300vh" : "320vh" }}
      >
        {/* Sticky viewport frame pinned while scrolling through this section */}
        <div className="sticky top-0 h-screen w-full flex flex-col justify-between items-center py-3 sm:py-5 lg:py-5 px-4 overflow-hidden select-none">
          {/* Section Heading - Compact & Responsive so cards never get pushed off screen */}
          <div className="relative z-20 mx-auto max-w-3xl text-center shrink-0 pt-1 sm:pt-2">
            <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.18em] text-[#942008]">
              Zero Barrier To Start
            </p>
            <h2 className="mt-1.5 sm:mt-2 text-2xl font-black tracking-tight text-neutral-950 sm:text-4xl lg:text-[2.5rem] leading-tight">
              Your Journey Starts With <span className="text-[#942008]">What You Already Have.</span>
            </h2>
            <p className="mx-auto mt-1.5 max-w-2xl text-xs sm:text-sm lg:text-base leading-relaxed text-neutral-600 hidden sm:block">
              {smoothProgress < 0.2
                ? "Scroll down to reveal what lies ahead..."
                : smoothProgress < 0.45
                ? "No art degree? No problem. Every expert began right here."
                : smoothProgress < 0.65
                ? "No fancy studio needed. A simple table is all you need."
                : "You already have everything needed to begin."}
            </p>
          </div>

          {/* Cards Stage Container - Takes available vertical space cleanly */}
          <div className="relative z-10 flex-1 w-full flex items-center justify-center min-h-0 py-2 sm:py-3">
            <div className="relative flex items-center justify-center w-full max-w-5xl h-full">
              {CARDS.map((card, idx) => {
                const style = getCardTransform(idx);
                return (
                  <article
                    key={card.id}
                    onClick={() => isMobile && setActiveMobileCard(idx)}
                    className="already-poster-card absolute flex flex-col rounded-[24px] sm:rounded-[28px] overflow-hidden cursor-pointer"
                    style={{
                      backgroundColor: "#fcf8f2",
                      border: "1.5px solid #ecdccb",
                      boxShadow:
                        "0 18px 40px -12px rgba(45, 30, 15, 0.16), 0 4px 12px -2px rgba(45, 30, 15, 0.08), inset 0 0 0 1px rgba(255, 255, 255, 0.85)",
                      zIndex: style.zIndex || card.zIndex,
                      transform: style.transform,
                      opacity: style.opacity,
                      width: isDesktop
                        ? "clamp(270px, 21vw, 315px)"
                        : isTablet
                        ? "clamp(240px, 26vw, 280px)"
                        : "min(86vw, 310px)",
                      height: isDesktop
                        ? "clamp(370px, 54vh, 440px)"
                        : isTablet
                        ? "clamp(340px, 50vh, 400px)"
                        : "clamp(350px, 52vh, 410px)",
                      transition: "box-shadow 0.3s ease",
                      willChange: "transform, opacity",
                    }}
                  >
                    {/* Top Content: Title & Subtitle */}
                    <div className="pt-5 sm:pt-6 px-4 sm:px-5 text-center shrink-0">
                      <h3 className="font-sans font-black tracking-tight uppercase leading-[0.98] text-[#2d2015] text-lg sm:text-xl lg:text-2xl">
                        <span className="block">{card.titleLine1}</span>
                        <span className="block">{card.titleLine2}</span>
                      </h3>
                      <p className="text-[#554a3e] text-xs sm:text-sm font-medium mt-1 sm:mt-1.5 leading-snug px-1">
                        {card.description}
                      </p>
                    </div>

                    {/* Bottom Illustration with Arched Color Wave Backdrop */}
                    <div className="relative mt-1 w-full flex-1 min-h-0 flex items-end justify-center overflow-hidden rounded-b-[24px] sm:rounded-b-[28px]">
                      {/* Arched Wave Shape behind character */}
                      <div
                        className="absolute inset-x-0 bottom-0 h-[62%] rounded-t-[50%_35%] transition-colors duration-300"
                        style={{ backgroundColor: card.waveColor }}
                      />

                      {/* Character Illustration */}
                      <img
                        src={card.image}
                        alt={`${card.titleLine1} ${card.titleLine2}`}
                        className="relative z-10 w-full h-full max-h-[175px] sm:max-h-[200px] lg:max-h-[225px] object-contain object-bottom pointer-events-none drop-shadow-sm select-none"
                        loading="eager"
                      />
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Message Banner seamlessly revealed after scroll unpins */}
      {/* <div className="relative z-20 nav-width pb-16 sm:pb-20 lg:pb-24 pt-4 sm:pt-6">
        <div className="mx-auto max-w-4xl rounded-3xl bg-[#faf7f2] border border-[#ecdccb] px-6 py-8 text-center sm:px-10 sm:py-10 shadow-sm">
          <p className="already-note text-sm sm:text-base text-stone-600 font-medium">
            You simply need the willingness to learn, create and take the next step.
          </p>
          <p className="already-quote mt-2 text-lg font-bold leading-snug sm:text-2xl text-stone-900">
            We help you move from{" "}
            <span className="already-muted italic font-serif text-stone-500">
              "I want to learn Resin Art"
            </span>{" "}
            to:
          </p>
          <p className="already-quote mt-2 text-lg font-extrabold leading-snug sm:text-2xl text-stone-900">
            "I know what I'm doing, I know what I'm creating and I know{" "}
            <span className="already-accent text-[#b87333]">where I'm going."</span>
          </p>
        </div>
      </div> */}
      {/* ─── BOTTOM CLOUDY WAVE (MATCHING MENTOR SECTION BOTTOM) ─── */}
      <div
        className="already-cloud-wave-bottom absolute -bottom-[27px] sm:-bottom-[31px] left-0 right-0 w-full h-[28px] sm:h-[32px] pointer-events-none z-40"
        style={{
          backgroundColor: "#ffffff",
          backgroundImage: "radial-gradient(circle, #e2ded4 1.5px, transparent 1.5px)",
          backgroundSize: "24px 24px",
          backgroundAttachment: "fixed",
          WebkitMaskImage: "radial-gradient(circle at 50% 0%, #000 32px, transparent 32.5px)",
          maskImage: "radial-gradient(circle at 50% 0%, #000 32px, transparent 32.5px)",
          WebkitMaskSize: "64px 32px",
          maskSize: "64px 32px",
          WebkitMaskRepeat: "repeat-x",
          maskRepeat: "repeat-x",
          WebkitMaskPosition: "center top",
          maskPosition: "center top",
          filter: "drop-shadow(0 4px 6px rgba(0, 0, 0, 0.08))",
        }}
        aria-hidden="true"
      />
    </section>
  );
}
