"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { CheckCircle2, Sparkles } from "lucide-react";

const POINTS = [
  "Understand what it really takes to develop professional-level resin skills from home.",
  "Create your signature style that sets you apart from amateur creators.",
  "Explore the practical business potential of Resin Art with zero guesswork.",
];

export default function MasterclassSec() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.35 });

  return (
    <section
      ref={sectionRef}
      className="masterclass-sec container relative z-10 mx-auto flex h-auto min-h-screen items-center bg-white px-5 pb-16 text-neutral-950 sm:px-10 lg:h-screen lg:px-10 lg:pb-8 2xl:px-0"
    >
      <div className="mx-auto w-full max-w-3xl text-center">
        <motion.p
          className="masterclass-kicker text-xs font-semibold uppercase tracking-[0.18em]"
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.45 }}
        >
          Free Training Invitation
        </motion.p>
        <motion.h2
          className="masterclass-heading mt-3 text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Not Sure Where To Start? <span className="masterclass-accent">Start Here.</span>
        </motion.h2>
        <motion.p
          className="masterclass-copy mx-auto mt-4 max-w-2xl text-sm leading-relaxed sm:text-base"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.18 }}
        >
          Join my FREE Resin Mastery Masterclass and discover the three essential shifts that can help you move from simply learning Resin Art to confidently building something of your own.
        </motion.p>

        <motion.div
          className="masterclass-card mx-auto mt-8 max-w-2xl rounded-[28px] p-6 text-left sm:p-8"
          initial={{ opacity: 0, y: 36 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 36 }}
          transition={{ duration: 0.55, delay: 0.28 }}
        >
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.45, delay: 0.45 }}
        >
          <Link
            href="/webinar"
            className="masterclass-btn mt-8 inline-flex items-center justify-center gap-2 rounded-full px-8 py-3.5 text-sm font-bold uppercase tracking-wider"
          >
            <Sparkles size={18} aria-hidden="true" />
            Join The Free Masterclass
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
