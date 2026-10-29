"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";

type ChallengeCardItem = {
  step: string;
  title: string;
  text: string;
  image: string;
};

const CARDS: ChallengeCardItem[] = [
  {
    step: "01",
    title: "Curriculum Void",
    text: "What to learn next & which techniques to master",
    image: "/images/real-challenge/curriculum-void.jpg",
  },
  {
    step: "02",
    title: "Product Demand",
    text: "What exact products to create for maximum demand",
    image: "/images/real-challenge/product-demand.jpg",
  },
  {
    step: "03",
    title: "Signature Style",
    text: "How to develop your own recognizable style",
    image: "/images/real-challenge/signature-style.jpg",
  },
  {
    step: "04",
    title: "Portfolio Proof",
    text: "How to showcase your artwork with confidence",
    image: "/images/real-challenge/portfolio-proof.jpg",
  },
  {
    step: "05",
    title: "Order Consistency",
    text: "How to get consistent, high-paying orders",
    image: "/images/real-challenge/order-consistency.jpg",
  },
  {
    step: "06",
    title: "Income Blueprint",
    text: "How to turn your creative skill into predictable income",
    image: "/images/real-challenge/income-blueprint.jpg",
  },
];

// Each card rotates in a different direction and angle on hover
const HOVER_ROTATIONS = [-4.5, 4.5, -5, 3.5, -4, 5.5];

const HEADLINE_LINE_1 = ["Beautiful", "Art", "Alone"];
const HEADLINE_LINE_2 = ["Doesn't", "Build", "a"];

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

function clamp01(v: number) {
  return Math.min(1, Math.max(0, v));
}

function easeInOutCubic(x: number): number {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

// Krackerz-style "stamp" entrance: scaled up, skewed, then snaps into place.
const stamp: Variants = {
  hidden: { opacity: 0, y: -10, scale: 1.4, rotate: 0.5, skewX: -5, skewY: 2 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    rotate: 0,
    skewX: 0,
    skewY: 0,
    transition: { type: "spring", stiffness: 260, damping: 18 },
  },
};

const headline: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.15 } },
};

const word: Variants = {
  hidden: { opacity: 0, y: "45%", rotate: 4 },
  show: { opacity: 1, y: "0%", rotate: 0, transition: { duration: 0.7, ease: EASE_OUT } },
};

function Sparks({ className = "", flip = false }: { className?: string; flip?: boolean }) {
  return (
    <motion.svg
      viewBox="0 0 40 40"
      fill="none"
      aria-hidden="true"
      className={`rc-sparks ${className}`}
      style={flip ? { scaleX: -1 } : undefined}
      variants={{
        hidden: { opacity: 0, scale: 0.4 },
        show: { opacity: 1, scale: 1, transition: { delay: 0.9, type: "spring", stiffness: 300, damping: 14 } },
      }}
    >
      <path d="M4 22 L16 18" />
      <path d="M8 34 L18 25" />
      <path d="M20 37 L23 28" />
    </motion.svg>
  );
}

function ChallengeCard({
  item,
  index,
  onHoverStart,
  onHoverEnd,
}: {
  item: ChallengeCardItem;
  index: number;
  onHoverStart?: () => void;
  onHoverEnd?: () => void;
}) {
  const accent = index % 2 === 1;

  return (
    <motion.article
      onHoverStart={onHoverStart}
      onHoverEnd={onHoverEnd}
      whileHover={{
        y: -12,
        rotate: HOVER_ROTATIONS[index],
        scale: 1.035,
        transition: { type: "spring", stiffness: 350, damping: 20 },
      }}
      className={`rc-card group ${accent ? "rc-card--accent" : ""}`}
    >
      <div className="rc-card__media">
        <img src={item.image} alt={item.title} loading="lazy" className="rc-card__img" />
        <span className="rc-card__step">{item.step}</span>
      </div>

      <div className="rc-card__body">
        <span className="rc-card__scallop" aria-hidden="true" />
        <h3 className="rc-card__title">{item.title}</h3>
        <p className="rc-card__text">{item.text}</p>
      </div>
    </motion.article>
  );
}

// Continuous Auto-sliding carousel for Mobile and Tablet (< 1024px)
function ChallengeAutoSlider({ cards }: { cards: ChallengeCardItem[] }) {
  const [isPaused, setIsPaused] = useState(false);
  const resumeTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Repeat cards 3 times for a seamless, continuous infinite loop
  const infiniteCards = [...cards, ...cards, ...cards];

  const handleInteractionStart = () => {
    setIsPaused(true);
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
  };

  const handleInteractionEnd = () => {
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = setTimeout(() => {
      setIsPaused(false);
    }, 1800);
  };

  useEffect(() => {
    return () => {
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    };
  }, []);

  return (
    <div
      className="rc-slider-wrap relative w-full overflow-hidden mt-6 sm:mt-8 pt-6 sm:pt-8 pb-20 sm:pb-24"
      onMouseEnter={handleInteractionStart}
      onMouseLeave={handleInteractionEnd}
      onTouchStart={handleInteractionStart}
      onTouchEnd={handleInteractionEnd}
    >
      <div className={`rc-marquee-track flex gap-4 sm:gap-6 ${isPaused ? "is-paused" : ""}`}>
        {infiniteCards.map((item, index) => {
          const accent = index % 2 === 1;
          const isTop = index % 2 === 0;

          return (
            <div
              key={`${item.step}-${index}`}
              className={`shrink-0 w-[265px] sm:w-[310px] transition-transform duration-300 ${isTop
                  ? "-translate-y-3 sm:-translate-y-4"
                  : "translate-y-3.5 sm:translate-y-5"
                }`}
            >
              <article className={`rc-card group ${accent ? "rc-card--accent" : ""}`}>
                <div className="rc-card__media">
                  <img src={item.image} alt={item.title} loading="lazy" className="rc-card__img" />
                  <span className="rc-card__step">{item.step}</span>
                </div>
                <div className="rc-card__body">
                  <span className="rc-card__scallop" aria-hidden="true" />
                  <h3 className="rc-card__title">{item.title}</h3>
                  <p className="rc-card__text">{item.text}</p>
                </div>
              </article>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function RealChallangeSec() {
  const reduceMotion = useReducedMotion();
  const initial = reduceMotion ? "show" : "hidden";

  const pinRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const cellRefs = useRef<(HTMLDivElement | null)[]>([]);
  const slotRefs = useRef<(HTMLDivElement | null)[]>([]);
  const fanDeltasRef = useRef<{ x: number; y: number; rotate: number }[]>([]);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // Calculate delta from natural grid cell to the overlapping staggered row on arrival
  const updateFanOffsets = () => {
    if (!gridRef.current) return;
    const gridRect = gridRef.current.getBoundingClientRect();
    if (gridRect.width <= 0) return;

    const isDesktop = window.innerWidth >= 1024;
    if (!isDesktop) return;

    // In the overlapping row (reference image):
    // Cards sit on the same line, overlapping by ~26px each.
    // Staggered up-and-down heights: Card 0 (down), Card 1 (UP), Card 2 (down), Card 3 (UP), Card 4 (down), Card 5 (UP)
    const staggerYs = [12, -26, 10, -24, 12, -20];
    const staggerRots = [-3.5, -1.2, 0, 1.8, 3.2, 4.8];
    const overlap = 26;

    const cell0 = cellRefs.current[0];
    const cellW = cell0 && cell0.offsetWidth > 0 ? cell0.offsetWidth : gridRect.width / 6;
    const step = cellW - overlap;
    const totalRowW = cellW + 5 * step;
    const startX = (gridRect.width - totalRowW) / 2;

    fanDeltasRef.current = cellRefs.current.map((cellEl, i) => {
      if (!cellEl) return { x: 0, y: staggerYs[i] || 0, rotate: staggerRots[i] || 0 };
      const naturalCellLeft = cellEl.offsetLeft;
      const targetLeft = startX + i * step;
      return {
        x: targetLeft - naturalCellLeft,
        y: staggerYs[i] || 0,
        rotate: staggerRots[i] || 0,
      };
    });
  };

  useEffect(() => {
    const pin = pinRef.current;
    if (!pin) return;

    if (reduceMotion) {
      return;
    }

    updateFanOffsets();

    let frame = 0;
    const update = () => {
      const travel = pin.offsetHeight - window.innerHeight;
      if (travel <= 0) {
        slotRefs.current.forEach((slot) => {
          if (slot) slot.style.transform = "none";
        });
        return;
      }

      const scrolled = Math.min(Math.max(-pin.getBoundingClientRect().top, 0), travel);
      const rawProgress = scrolled / travel;

      // Start in overlapping staggered row; between 0.08 and 0.74 spread out to regular grid
      const spreadRaw = clamp01((rawProgress - 0.08) / 0.66);
      const eased = easeInOutCubic(spreadRaw);

      slotRefs.current.forEach((slot, i) => {
        if (!slot) return;
        const delta = fanDeltasRef.current[i];
        if (!delta) return;

        const curX = (1 - eased) * delta.x;
        const curY = (1 - eased) * delta.y;
        const curRot = (1 - eased) * delta.rotate;

        if (eased >= 0.999) {
          slot.style.transform = "none";
        } else {
          slot.style.transform = `translate3d(${curX.toFixed(2)}px, ${curY.toFixed(2)}px, 0) rotate(${curRot.toFixed(2)}deg)`;
        }
      });
    };

    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };

    const onResize = () => {
      updateFanOffsets();
      onScroll();
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [reduceMotion]);

  return (
    <section id="problem" ref={pinRef} className="rc-sec rc-pin-sec relative z-10 text-neutral-950">
      <div className="rc-sec__bg" aria-hidden="true" />

      <div className="rc-sticky-wrap">
        <div className="nav-width container relative pt-6 sm:pt-10">
          {/* Giant cloud-edged circle behind the heading (Krackerz hero) */}
          <motion.div
            className="rc-cloud"
            aria-hidden="true"
            initial={reduceMotion ? false : { opacity: 0, rotate: -56, scale: 0.92 }}
            whileInView={{ opacity: 1, rotate: 0, scale: 1 }}
            viewport={{ once: true, amount: 0, margin: "0px 0px -35% 0px" }}
            transition={{ duration: 1.4, ease: EASE_OUT }}
          >
            <motion.div
              className="rc-cloud__shape"
              animate={reduceMotion ? undefined : { rotate: 360 }}
              transition={{ duration: 220, repeat: Infinity, ease: "linear" }}
            />
          </motion.div>

          <motion.div
            className="mx-auto max-w-4xl text-center"
            initial={initial}
            whileInView="show"
            viewport={{ once: true, amount: 0.4 }}
          >
            <motion.p variants={stamp} className="rc-eyebrow">
              <motion.span
                className="rc-eyebrow__line"
                variants={{ hidden: { scaleX: 0 }, show: { scaleX: 1, transition: { duration: 0.6, ease: EASE_OUT } } }}
                style={{ originX: 1 }}
              />
              The Real Challenge
              <motion.span
                className="rc-eyebrow__line"
                variants={{ hidden: { scaleX: 0 }, show: { scaleX: 1, transition: { duration: 0.6, ease: EASE_OUT } } }}
                style={{ originX: 0 }}
              />
            </motion.p>

            <motion.h2 variants={headline} className="rc-title relative mx-auto mt-5 inline-block">
              <motion.span className="rc-star" variants={stamp} aria-hidden="true">
                <motion.svg
                  viewBox="0 0 24 24"
                  className="h-full w-full"
                  animate={reduceMotion ? undefined : { rotate: [0, 90], scale: [1, 1.12, 1] }}
                  transition={{ duration: 5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
                >
                  <path d="M12 1.5 C13.6 7.4 16.6 10.4 22.5 12 C16.6 13.6 13.6 16.6 12 22.5 C10.4 16.6 7.4 13.6 1.5 12 C7.4 10.4 10.4 7.4 12 1.5 Z" />
                </motion.svg>
              </motion.span>
              <Sparks className="rc-sparks--left" />
              <Sparks className="rc-sparks--right" flip />

              <span className="block">
                {HEADLINE_LINE_1.map((w) => (
                  <span key={w} className="rc-word-mask">
                    <motion.span variants={word} className="inline-block">
                      {w}
                    </motion.span>
                  </span>
                ))}
              </span>
              <span className="block">
                {HEADLINE_LINE_2.map((w) => (
                  <span key={w} className="rc-word-mask">
                    <motion.span variants={word} className="inline-block">
                      {w}
                    </motion.span>
                  </span>
                ))}
                <span className="rc-accent-word">
                  <motion.span variants={stamp} className="inline-block">
                    Business.
                  </motion.span>
                  <svg viewBox="0 0 260 16" fill="none" aria-hidden="true" className="rc-underline">
                    <motion.path
                      d="M4 11 C 70 4, 170 3, 256 9"
                      variants={{
                        hidden: { pathLength: 0, opacity: 0 },
                        show: { pathLength: 1, opacity: 1, transition: { delay: 0.75, duration: 0.7, ease: "easeInOut" } },
                      }}
                    />
                  </svg>
                </span>
              </span>
            </motion.h2>

            <motion.p
              className="rc-lead mx-auto mt-5 max-w-xl"
              variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { delay: 0.6, duration: 0.6, ease: EASE_OUT } } }}
            >
              You may know how to create beautiful resin pieces, but knowing the craft is only one part of the journey.
            </motion.p>
          </motion.div>
        </div>

        {/* Desktop View (>= 1024px): Overlapping Staggered Cards (Exact to Reference Image) that spread into Grid on scroll */}
        <div className="rc-grid-wrap hidden lg:block">
          <div ref={gridRef} className="rc-grid">
            {CARDS.map((item, index) => (
              <div
                key={item.step}
                ref={(node) => {
                  cellRefs.current[index] = node;
                }}
                className="rc-grid-cell"
              >
                <div
                  ref={(node) => {
                    slotRefs.current[index] = node;
                  }}
                  className="rc-card-slot"
                  style={{
                    zIndex: hoveredIdx === index ? 30 : index + 1,
                  }}
                >
                  <ChallengeCard
                    item={item}
                    index={index}
                    onHoverStart={() => setHoveredIdx(index)}
                    onHoverEnd={() => setHoveredIdx(null)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile & Tablet View (< 1024px): Continuous Auto Slider */}
        <div className="block lg:hidden w-full pb-14 sm:pb-20">
          <ChallengeAutoSlider cards={CARDS} />
        </div>
      </div>
    </section>
  );
}
