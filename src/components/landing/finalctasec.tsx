import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function FinalCtaSec() {
  return (
    <section className="final-cta-sec relative z-10 bg-white pb-10 container mx-auto px-5 sm:px-10 lg:px-10 2xl:px-0">
        <div className="final-cta-banner relative overflow-hidden rounded-[2rem] px-6 pt-10 pb-0 sm:px-10 sm:pt-12 lg:px-10 lg-py-10">
          <svg
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 h-full w-full"
            viewBox="0 0 800 480"
            preserveAspectRatio="none"
          >
            <path d="M0 80 C160 20 280 140 460 90 C620 46 700 20 800 70 L800 0 L0 0 Z" fill="rgba(255,255,255,0.08)" />
            <path d="M0 420 C180 360 320 470 520 400 C660 350 720 390 800 360 L800 480 L0 480 Z" fill="rgba(255,255,255,0.08)" />
          </svg>

          <div className="relative z-10 grid items-end gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.92fr)] lg:gap-2 ">
            <div className="pb-10 sm:pb-12 lg:pb-14">
              <h2 className="final-cta-heading text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
                Your Art Has More Potential{" "}
                <span className="final-cta-accent">Than You Think.</span>
              </h2>

              <div className="final-cta-copy mt-5 max-w-xl space-y-2 text-sm leading-relaxed sm:text-base">
                <p>Maybe Resin Art started as something you simply wanted to learn.</p>
                <p>Maybe it was a way to express yourself.</p>
                <p>Maybe you were looking for something that was yours.</p>
                {/*
                <div className="space-y-1 pt-2">
                  <p className="final-cta-strong text-base font-bold sm:text-lg">But what if it could become much more?</p>
                  <p className="final-cta-strong font-bold">What if your art could become your identity?</p>
                  <p className="final-cta-strong font-bold">What if your skill could become your income?</p>
                  <p className="final-cta-strong font-bold">What if your creativity could create freedom?</p>
                </div>
                <p className="pt-1 text-sm">
                  You don't have to know the entire journey today. You just need to take the first step.
                </p>
                */}
              </div>

              <Link
                href="/webinar"
                className="final-cta-btn mt-8 inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-bold sm:text-base"
              >
                Start My Resin Journey
                <ArrowRight size={18} aria-hidden="true" />
              </Link>
            </div>

            <div className="flex justify-center lg:justify-start">
              <img
                src="/images/final-cta/banner-art-2.png"
                alt="Resin art class preview on a phone beside an artist pouring resin"
                className="h-auto w-full max-w-[320px] translate-y-8 object-contain sm:max-w-[400px] lg:max-w-none lg:translate-y-12"
              />
            </div>
          </div>
        </div>
    </section>
  );
}
