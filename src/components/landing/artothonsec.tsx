"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

const SPRINT_STEPS = ["Create", "Challenge", "Milestone", "Celebrate"];

export default function ArtOThonSec({ sprintImages }: { sprintImages: string[] }) {
  const images = sprintImages.filter(Boolean);
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    if (images.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => {
      setFrame((current) => (current + 1) % images.length);
    }, 2800);
    return () => window.clearInterval(timer);
  }, [images.length]);

  const front = images[frame % Math.max(images.length, 1)];
  const back = images[(frame + 1) % Math.max(images.length, 1)];

  return (
    <section
      id="artothon"
      className="artothon-sec relative z-20 py-16 text-neutral-950 sm:py-20 lg:py-24 overflow-visible"
      style={{
        backgroundColor: "#ffffff",
        backgroundImage: "radial-gradient(circle, #e2ded4 1.5px, transparent 1.5px)",
        backgroundSize: "24px 24px",
        backgroundAttachment: "fixed",
      }}
    >
      {/* ─── TOP CLOUDY WAVE ─── */}
      <div
        className="artothon-cloud-wave-top absolute -top-[27px] sm:-top-[31px] left-0 right-0 w-full h-[28px] sm:h-[32px] pointer-events-none z-40"
        style={{
          backgroundColor: "#ffffff",
          backgroundImage: "radial-gradient(circle, #e2ded4 1.5px, transparent 1.5px)",
          backgroundSize: "24px 24px",
          backgroundAttachment: "fixed",
          WebkitMaskImage: "radial-gradient(circle at 50% 100%, #000 32px, transparent 32.5px)",
          maskImage: "radial-gradient(circle at 50% 100%, #000 32px, transparent 32.5px)",
          WebkitMaskSize: "64px 32px",
          maskSize: "64px 32px",
          WebkitMaskRepeat: "repeat-x",
          maskRepeat: "repeat-x",
          WebkitMaskPosition: "center bottom",
          maskPosition: "center bottom",
          filter: "drop-shadow(0 -3px 4px rgba(0, 0, 0, 0.04))",
        }}
        aria-hidden="true"
      />
      <div className="nav-width page-rise">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-50">
          <div>
            <p className="artothon-kicker flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em]">
              <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
              — Action-First Learning
            </p>
            <h2 className="artothon-title mt-4 text-3xl font-black leading-[1.12] tracking-tight sm:text-4xl lg:text-5xl">
              ART-O-THON: Don't Just Learn.
              <span className="artothon-accent mt-1 block">Create.</span>
            </h2>
            <p className="artothon-copy mt-5 text-sm leading-relaxed sm:text-base">
              Learning becomes powerful when you put it into action. ART-O-THON is designed to turn learning into consistent creation through daily challenges, missions and milestone submissions.
            </p>
            <p className="artothon-copy mt-3 text-sm leading-relaxed sm:text-base">
              Every creation becomes a step forward. Every completed challenge becomes proof of your progress. And every milestone gives you another reason to celebrate how far you've come.
            </p>
            <div className="mt-7 flex flex-col gap-5 sm:flex-row sm:items-center">
              <Link
                href="/webinar"
                className="artothon-btn inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3 text-xs font-bold uppercase tracking-wider transition sm:w-auto"
              >
                Join Challenge
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
              {/* <div className="flex items-center gap-3">
                <div className="flex -space-x-2" aria-hidden="true">
                  {["real-art-1.jpg", "real-art-3.jpg", "real-art-5.jpg"].map((file) => (
                    <img
                      key={file}
                      src={`/images/student-art/${file}`}
                      alt=""
                      className="h-9 w-9  border-2 border-white object-cover"
                    />
                  ))}
                </div>
                <p className="artothon-sprint-label text-xs font-semibold leading-tight">
                  90-Day
                  <span className="mt-0.5 block font-medium">Creation Sprint</span>
                </p>
              </div> */}
            </div>
          </div>

          <div className="artothon-visual relative mx-auto w-full max-w-[740px] ">
            <span className="artothon-blob artothon-blob-back" aria-hidden="true" />
            {/* <span className="artothon-blob artothon-blob-soft" aria-hidden="true" /> */}
            {/* <span className="artothon-blob artothon-blob-ring" aria-hidden="true" /> */}
            <div className="artothon-photo">
              <img
                src="/images/artothon/plate.jpg"
                alt=""
                className="h-full w-full object-cover"
              />
            </div>
            {/* <img src="/images/decor/flower-veil.png" alt="" className="artothon-flower" /> */}

            <div className="artothon-float rounded-[1.75rem] p-5 sm:p-6 ">
              <div className="flex items-start justify-between gap-3 ">
                <div className="min-w-0 pr-1">
                  <p className="artothon-kicker text-[10px] font-semibold uppercase tracking-[0.16em]">90-Day</p>
                  <p className="artothon-sprint-title mt-1 text-[1.65rem] font-black leading-[1.05]">Creation Sprint</p>
                  <p className="artothon-copy mt-3 text-xs leading-relaxed">
                    daily challenges, missions and milestone submissions.
                  </p>
                </div>
                <div className="artothon-thumbs" aria-hidden="true">
                  {back && <img src={back} alt="" className="artothon-thumb artothon-thumb-back" />}
                  {front && <img key={front} src={front} alt="" className="artothon-thumb artothon-thumb-front" />}
                </div>
              </div>
              {/* <div className="artothon-track mt-5 grid grid-cols-4 gap-1">
                {SPRINT_STEPS.map((step, index) => (
                  <div key={step} className="text-center">
                    <span className={`artothon-dot mx-auto ${index === 0 ? "artothon-dot-active" : ""}`} />
                    <p className="artothon-sprint-label mt-2 text-[10px] font-semibold leading-tight">{step}</p>
                  </div>
                ))}
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
