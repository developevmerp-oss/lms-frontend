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
    desktopX: -300,
    desktopY: 0,
    desktopRotate: -4.5,
    tabletX: -200,
    tabletY: 0,
    tabletRotate: -3.8,
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
    desktopY: -8,
    desktopRotate: -1,
    tabletX: 0,
    tabletY: -6,
    tabletRotate: -0.8,
    mobileY: 52,
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
    desktopX: 300,
    desktopY: 0,
    desktopRotate: 4.5,
    tabletX: 200,
    tabletY: 0,
    tabletRotate: 3.8,
    mobileY: 104,
    mobileRotate: -0.5,
    zIndex: 30,
  },
];

export default function AlreadyHaveSec() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [windowWidth, setWindowWidth] = useState(1200);
  const [activeMobileCard, setActiveMobileCard] = useState<number | null>(null);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          if (!containerRef.current) {
            ticking = false;
            return;
          }
          const rect = containerRef.current.getBoundingClientRect();
          const winH = window.innerHeight;
          const totalScrollable = rect.height - winH;
          if (totalScrollable > 0) {
            const currentScroll = -rect.top;
            const p = Math.max(0, Math.min(1, currentScroll / totalScrollable));
            setProgress(p);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isDesktop = windowWidth >= 1024;
  const isTablet = windowWidth >= 768 && windowWidth < 1024;
  const isMobile = windowWidth < 768;

  const easeOutCubic = (x: number) => 1 - Math.pow(1 - x, 3);

  // Desktop:
  // Card 1: 0.02 -> 0.30, Card 2: 0.32 -> 0.60, Card 3: 0.62 -> 0.90
  // Mobile & Tablet:
  // Card 1 arrives 0.02 -> 0.12, stays resting until 0.38 (ample time to read)
  // Card 2 arrives 0.38 -> 0.48, stays resting until 0.74 (ample time to read)
  // Card 3 arrives 0.74 -> 0.84, stays resting through 1.00 (ample time to read)
  const getCardTransform = (index: number) => {
    const card = CARDS[index];

    let startP = 0.02;
    let endP = 0.30;

    if (isDesktop) {
      if (index === 1) {
        startP = 0.32;
        endP = 0.60;
      } else if (index === 2) {
        startP = 0.62;
        endP = 0.90;
      }
    } else {
      if (index === 0) {
        startP = 0.02;
        endP = 0.12;
      } else if (index === 1) {
        startP = 0.38;
        endP = 0.48;
      } else {
        startP = 0.74;
        endP = 0.84;
      }
    }

    const rawT = Math.max(0, Math.min(1, (progress - startP) / (endP - startP)));
    const easedT = easeOutCubic(rawT);
    const enterY = (1 - easedT) * (isMobile ? 180 : 240);
    const opacity = Math.min(1, rawT * 2.5);

    if (isDesktop) {
      return {
        transform: `translate3d(${card.desktopX}px, ${card.desktopY + enterY}px, 0) rotate(${card.desktopRotate}deg)`,
        opacity,
        transition: "transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s ease-out, box-shadow 0.25s ease",
      };
    } else if (isTablet) {
      return {
        transform: `translate3d(${card.tabletX}px, ${card.tabletY + enterY}px, 0) rotate(${card.tabletRotate}deg)`,
        opacity,
        transition: "transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s ease-out, box-shadow 0.25s ease",
      };
    } else {
      const isSelected = activeMobileCard === index;
      const baseScale = index === 0 ? 0.96 : index === 1 ? 0.98 : 1.0;
      return {
        transform: `translate3d(0, ${card.mobileY + enterY}px, 0) rotate(${card.mobileRotate}deg) scale(${isSelected ? 1.02 : baseScale})`,
        opacity,
        zIndex: isSelected ? 40 : card.zIndex,
        transition: "transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s ease-out, box-shadow 0.25s ease",
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
        style={{ height: isDesktop ? "260vh" : isTablet ? "340vh" : "380vh" }}
      >
        {/* Sticky viewport frame pinned while scrolling through this section */}
        <div className="sticky top-0 h-screen w-full flex flex-col justify-between items-center py-6 sm:py-8 lg:py-10 px-4 overflow-hidden select-none">
          {/* Section Heading */}
          <div className="relative z-20 mx-auto max-w-3xl text-center pt-2 sm:pt-4">
            <p className="text-xs sm:text-base lg:text-xs font-semibold uppercase tracking-[0.18em] text-[#942008]">
              Zero Barrier To Start
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-neutral-950 sm:text-5xl">
              Your Journey Starts With <span className="text-[#942008]">What You Already Have.</span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm sm:text-xl lg:text-base leading-relaxed text-neutral-600 hidden sm:block">
              {(isDesktop ? progress < 0.28 : progress < 0.12)
                ? "Scroll down to reveal what lies ahead..."
                : (isDesktop ? progress < 0.58 : progress < 0.38)
                  ? "No art degree? No problem. Every expert began right here."
                  : (isDesktop ? progress < 0.88 : progress < 0.74)
                    ? "No fancy studio needed. A simple table is all you need."
                    : "You already have everything needed to begin."}
            </p>
          </div>

          {/* Cards Stage Container */}
          <div className="relative z-10 flex-1 w-full flex items-center justify-center min-h-[480px] sm:min-h-[520px] lg:min-h-[560px]">
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
                      width: isDesktop ? "330px" : isTablet ? "280px" : "min(86vw, 320px)",
                      height: isDesktop ? "490px" : isTablet ? "440px" : "430px",
                      transition: style.transition,
                      willChange: "transform, opacity",
                    }}
                  >
                    {/* Top Content: Title & Subtitle matching Reference Image 2 */}
                    <div className="pt-6 sm:pt-7 lg:pt-8 px-5 sm:px-6 text-center shrink-0">
                      <h3 className="font-sans font-black tracking-tight uppercase leading-[0.96] text-[#2d2015] text-[24px] sm:text-[28px] lg:text-[32px]">
                        <span className="block">{card.titleLine1}</span>
                        <span className="block">{card.titleLine2}</span>
                      </h3>
                      <p className="text-[#554a3e] text-base sm:text-xl lg:text-base font-medium mt-2 sm:mt-2.5 leading-snug px-1">
                        {card.description}
                      </p>
                    </div>

                    {/* Bottom Illustration with Arched Color Wave Backdrop */}
                    <div className="relative mt-2 w-full flex-1 min-h-0 flex items-end justify-center overflow-hidden rounded-b-[24px] sm:rounded-b-[28px]">
                      {/* Arched Wave Shape behind character */}
                      <div
                        className="absolute inset-x-0 bottom-0 h-[64%] rounded-t-[50%_35%] transition-colors duration-300"
                        style={{ backgroundColor: card.waveColor }}
                      />

                      {/* Character Illustration */}
                      <img
                        src={card.image}
                        alt={`${card.titleLine1} ${card.titleLine2}`}
                        className="relative z-10 w-full max-h-[220px] sm:max-h-[250px] lg:max-h-[270px] object-contain object-bottom pointer-events-none drop-shadow-sm select-none"
                        loading="eager"
                      />
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

          {/* Subtle scroll indicator / card progress dots */}
          {/* <div className="relative z-20 flex items-center justify-center gap-2 pb-1 sm:pb-2">
            {[0, 1, 2].map((i) => {
              const isFilled =
                (i === 0 && progress >= 0.28) ||
                (i === 1 && progress >= 0.58) ||
                (i === 2 && progress >= 0.88);
              return (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    isFilled ? "w-6 bg-[#b87333]" : "w-1.5 bg-stone-300"
                  }`}
                />
              );
            })}
          </div> */}
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
