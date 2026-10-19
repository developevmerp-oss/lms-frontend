"use client";

import { useRef } from "react";
import Link from "next/link";
import { Caveat, Great_Vibes } from "next/font/google";
import { motion, useInView } from "framer-motion";
import { ArrowRight, Home, PenLine, Star } from "lucide-react";

const scriptFont = Great_Vibes({ weight: "400", subsets: ["latin"] });
const noteFont = Caveat({ weight: "500", subsets: ["latin"] });

const POINTS = [
  {
    icon: Home,
    lead: "Understand what it really takes",
    text: "Understand what it really takes to develop professional-level resin skills from home.",
  },
  {
    icon: PenLine,
    lead: "Create your signature style",
    text: "Create your signature style that sets you apart from amateur creators.",
  },
  {
    icon: Star,
    lead: "Explore the practical business potential",
    text: "Explore the practical business potential of Resin Art with zero guesswork.",
  },
];

const BLOB_PATH =
  "M196 34C286 8 372 62 414 142C454 218 428 268 404 328C376 400 334 468 236 498C138 528 52 470 30 372C8 274 48 214 66 148C86 74 118 56 196 34Z";

export default function MasterclassSec() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.35 });

  return (
    <section
      ref={sectionRef}
      className="masterclass-sec relative z-10 overflow-hidden bg-white py-16 text-neutral-950 sm:py-20 lg:py-24"
    >
      {/*
        Previous centered layout — kept, not deleted.
        <div className="mx-auto w-full max-w-3xl text-center">
          <motion.p className="masterclass-kicker text-xs font-semibold uppercase tracking-[0.18em]">
            Free Training Invitation
          </motion.p>
          <motion.h2 className="masterclass-heading mt-3 text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
            Not Sure Where To Start? <span className="masterclass-accent">Start Here.</span>
          </motion.h2>
          <motion.p className="masterclass-copy mx-auto mt-4 max-w-2xl text-sm leading-relaxed sm:text-base">
            Join my FREE Resin Mastery Masterclass and discover the three essential shifts that can help you move from simply learning Resin Art to confidently building something of your own.
          </motion.p>
          <motion.div className="masterclass-card mx-auto mt-8 max-w-2xl rounded-[28px] p-6 text-left sm:p-8">
            <div className="space-y-4">
              {POINTS.map((point) => (
                <div key={point} className="flex items-start gap-3">
                  <CheckCircle2 size={20} className="masterclass-check mt-0.5 shrink-0" />
                  <p className="masterclass-copy text-sm leading-relaxed">{point}</p>
                </div>
              ))}
            </div>
            <p className="masterclass-note mt-5 border-t border-neutral-200 pt-4 text-xs font-medium">
              ✓ No pressure. No complicated jargon. Just clarity on your next step.
            </p>
          </motion.div>
          <Link href="/webinar" className="masterclass-btn mt-8 inline-flex items-center justify-center gap-2 rounded-full px-8 py-3.5 text-sm font-bold uppercase tracking-wider">
            <Sparkles size={18} aria-hidden="true" />
            Join The Free Masterclass
          </Link>
        </div>
      */}

      <div className="nav-width relative">
        <svg className="masterclass-lines" viewBox="0 0 160 90" aria-hidden="true">
          <path d="M8 70C40 20 90 10 150 28" />
          <path d="M20 82C58 40 108 34 156 58" />
        </svg>

        <div className="masterclass-grid relative grid items-center gap-10">
          <motion.div
            className="masterclass-copy-col"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
          >
            <p className="masterclass-kicker flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em]">
              <span className="masterclass-kicker-line" aria-hidden="true" />
              Free Training Invitation
            </p>
            <h2 className="masterclass-heading mt-4 text-[2.15rem] font-black leading-[0.95] tracking-tight sm:text-5xl lg:text-[3.15rem]">
              Not Sure Where
              <span className="mt-1 block">To Start?</span>
            </h2>
            <p className={`${scriptFont.className} masterclass-script -mt-1 text-[2.8rem] leading-none sm:text-5xl lg:text-6xl`}>
              Start Here.
              <svg className="masterclass-script-arrow" viewBox="0 0 78 28" aria-hidden="true">
                <path d="M4 16C24 16 46 8 66 11" />
                <path d="M56 4L70 11L56 19" />
              </svg>
            </p>
            <p className="masterclass-copy mt-5 max-w-md text-sm leading-relaxed sm:text-base">
              Join my FREE Resin Mastery Masterclass and discover the three essential shifts that can help you move from simply learning Resin Art to confidently building something of your own.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-5">
              <Link
                href="/webinar"
                className="masterclass-btn inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-xs font-bold uppercase tracking-wider"
              >
                Join The Free Masterclass
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
              <p className={`${noteFont.className} masterclass-hand text-2xl leading-tight`}>
                Your next step
                <span className="block">starts here</span>
                <svg className="masterclass-hand-arrow" viewBox="0 0 74 36" aria-hidden="true">
                  <path d="M68 8C40 6 22 16 10 30" />
                  <path d="M18 22L8 32L20 32" />
                </svg>
              </p>
            </div>
          </motion.div>

          <motion.div
            className="relative mx-auto w-full max-w-[440px]"
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            transition={{ duration: 0.55, delay: 0.12 }}
          >
            <svg viewBox="0 0 500 520" className="masterclass-blob h-auto w-full overflow-visible" aria-hidden="true">
              <defs>
                <clipPath id="masterclass-blob-clip">
                  <path d={BLOB_PATH} />
                </clipPath>
              </defs>
              <image
                href="/images/masterclass/board.jpg"
                x="8"
                y="8"
                width="484"
                height="484"
                preserveAspectRatio="xMidYMid slice"
                clipPath="url(#masterclass-blob-clip)"
              />
              <path className="masterclass-ring" d={BLOB_PATH} />
            </svg>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <ol className="space-y-6">
              {POINTS.map((point, index) => {
                const Icon = point.icon;
                const rest = point.text.slice(point.lead.length).trim();
                return (
                  <li key={point.text} className="flex items-start gap-4">
                    <span className="masterclass-icon" aria-hidden="true">
                      <Icon size={18} strokeWidth={1.75} />
                    </span>
                    <div>
                      <p className="masterclass-index">
                        {String(index + 1).padStart(2, "0")}
                        <span aria-hidden="true" />
                      </p>
                      <p className="masterclass-point mt-1 text-sm leading-relaxed sm:text-[15px]">
                        <strong>{point.lead}</strong> {rest}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>
            <p className="masterclass-note mt-8 flex items-start gap-2 text-xs font-medium">
              <span aria-hidden="true">✓</span>
              No pressure. No complicated jargon. Just clarity on your next step.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
