import Link from "next/link";
import { ArrowRight } from "lucide-react";

const SPRINT_STEPS = ["Create", "Challenge", "Milestone", "Celebrate"];

export default function ArtOThonSec() {
  return (
    <section id="artothon" className="artothon-sec relative z-10 bg-white py-16 text-neutral-950 sm:py-20 lg:py-24">
      <div className="container mx-auto px-5 sm:px-10 lg:px-10 2xl:px-0">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-10">
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
              <div className="flex items-center gap-3">
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
              </div>
            </div>
          </div>

          <div className="artothon-visual relative mx-auto w-full max-w-[640px]">
            <span className="artothon-blob artothon-blob-back" aria-hidden="true" />
            <span className="artothon-blob artothon-blob-soft" aria-hidden="true" />
            <span className="artothon-blob artothon-blob-ring" aria-hidden="true" />
            <div className="artothon-photo">
              <img
                src="/images/artothon/plate.jpg"
                alt=""
                className="h-full w-full object-cover"
              />
            </div>
            <svg className="artothon-veil pointer-events-none absolute -left-1 top-20 z-[2] h-[340px] w-[88px]" viewBox="0 0 88 340" fill="none" aria-hidden="true">
              <path d="M46 8c12 28 8 58 2 88" stroke="#e7b39f" strokeWidth="1.6" />
              <circle cx="46" cy="104" r="8" fill="#fff" />
              <circle cx="60" cy="94" r="5" fill="#f6d3c6" />
              <circle cx="34" cy="94" r="4" fill="#efb5a2" />
              <circle cx="54" cy="116" r="3.5" fill="#fff8f6" />
              <path d="M30 150c10 26 6 54 1 82" stroke="#e7b39f" strokeWidth="1.5" />
              <circle cx="28" cy="240" r="7" fill="#f6d3c6" />
              <circle cx="42" cy="230" r="4.5" fill="#fff" />
              <circle cx="18" cy="230" r="3.5" fill="#efb5a2" />
              <path d="M58 210c8 18 5 36 1 52" stroke="#f0c6b6" strokeWidth="1.2" />
              <circle cx="60" cy="268" r="5" fill="#fff" />
              <circle cx="72" cy="258" r="3.5" fill="#f6d3c6" />
            </svg>

            <div className="artothon-float rounded-[1.75rem] p-5 sm:p-6">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 pr-1">
                  <p className="artothon-kicker text-[10px] font-semibold uppercase tracking-[0.16em]">90-Day</p>
                  <p className="artothon-sprint-title mt-1 text-[1.65rem] font-black leading-[1.05]">Creation Sprint</p>
                  <p className="artothon-copy mt-3 text-xs leading-relaxed">
                    daily challenges, missions and milestone submissions.
                  </p>
                </div>
                <div className="artothon-thumbs" aria-hidden="true">
                  <img src="/images/student-art/real-art-1.jpg" alt="" className="artothon-thumb artothon-thumb-back" />
                  <img src="/images/student-art/real-art-10.jpg" alt="" className="artothon-thumb artothon-thumb-front" />
                </div>
              </div>
              <div className="artothon-track mt-5 grid grid-cols-4 gap-1">
                {SPRINT_STEPS.map((step, index) => (
                  <div key={step} className="text-center">
                    <span className={`artothon-dot mx-auto ${index === 0 ? "artothon-dot-active" : ""}`} />
                    <p className="artothon-sprint-label mt-2 text-[10px] font-semibold leading-tight">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
