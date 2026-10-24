"use client";

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

const HEADLINE_LINE_1 = ["Beautiful", "Art", "Alone"];
const HEADLINE_LINE_2 = ["Doesn't", "Build", "a"];

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

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

const grid: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
};

// Cards fly in tilted (like the Krackerz photo cards) and settle straight.
const card: Variants = {
  hidden: (i: number) => ({ opacity: 0, y: 120, scale: 0.85, rotate: i % 2 === 0 ? -10 : 10 }),
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    rotate: 0,
    transition: { type: "spring", stiffness: 120, damping: 16, mass: 0.9 },
  },
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

function ChallengeCard({ item, index }: { item: ChallengeCardItem; index: number }) {
  const accent = index % 2 === 1;

  return (
    <motion.article
      custom={index}
      variants={card}
      whileHover={{ y: -10, rotate: accent ? 2 : -2, transition: { type: "spring", stiffness: 300, damping: 18 } }}
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

export default function RealChallangeSec() {
  const reduceMotion = useReducedMotion();
  const initial = reduceMotion ? "show" : "hidden";

  return (
    <section id="problem" className="rc-sec relative z-10 overflow-hidden text-neutral-950">
      <div className="rc-sec__bg" aria-hidden="true" />

      <div className="nav-width container relative pt-16 sm:pt-20 lg:pt-24">
        {/* Giant cloud-edged circle behind the heading (Krackerz hero): spins in, then keeps slowly turning */}
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
            className="rc-lead mx-auto mt-6 max-w-xl"
            variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { delay: 0.6, duration: 0.6, ease: EASE_OUT } } }}
          >
            You may know how to create beautiful resin pieces, but knowing the craft is only one part of the journey.
          </motion.p>
        </motion.div>

      </div>

      <div className="rc-grid-wrap">
        <motion.div
          className="rc-grid"
          variants={grid}
          initial={initial}
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          {CARDS.map((item, index) => (
            <ChallengeCard key={item.step} item={item} index={index} />
          ))}
        </motion.div>
      </div>

      <div className="nav-width container relative pb-16 sm:pb-20 lg:pb-24">
        <motion.div
          className="rc-quote mx-auto mt-12 max-w-3xl text-center sm:mt-14"
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6, ease: EASE_OUT }}
        >
          <p className="rc-quote__muted">The problem isn&apos;t your talent.</p>
          <p className="rc-quote__strong">
            The problem is that <span className="rc-quote__accent">nobody gave you a clear path.</span>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
