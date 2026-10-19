import Link from "next/link";
import { ArrowRight } from "lucide-react";

function SprintCard() {
  return (
    <div className="relative">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-4 -bottom-3 h-8 rounded-full bg-neutral-200/90 blur-md"
      />
      <div className="artothon-sprint relative rounded-[28px] px-5 py-7 text-center sm:px-6 sm:py-8">
        <img
          src="/images/artothon/flame.png"
          alt=""
          className="mx-auto h-20 w-20 object-contain sm:h-24 sm:w-24"
        />
        <p className="artothon-sprint-title mt-3 text-2xl font-black tracking-tight text-neutral-950 sm:text-[1.75rem]">
          90-Day
        </p>
        <p className="artothon-sprint-label mt-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-400">
          Creation Sprint
        </p>
      </div>
    </div>
  );
}

export default function ArtOThonSec() {
  return (
    <section
      id="artothon"
      className="artothon-sec relative z-10 bg-white py-16 text-neutral-950 sm:py-20 lg:py-24 container mx-auto px-5 sm:px-10 lg:px-10 2xl:px-0"
    >
      <div className=" max-w-7xl mx-auto">
        <div className="relative lg:mr-8">
          <div className="artothon-card rounded-[28px] px-5 py-8 sm:rounded-[32px] sm:px-10 sm:py-10 lg:px-12 lg:py-12 lg:pr-48 xl:pr-52">
            <div className="mx-auto mb-8 w-[200px] sm:w-[220px] lg:hidden">
              <SprintCard />
            </div>

            <div>
              <p className="artothon-kicker text-xs font-semibold uppercase tracking-[0.18em] text-orange-500">
                Action-First Learning
              </p>
              <h2 className="artothon-title mt-3 text-[1.7rem] font-black leading-[1.15] tracking-tight text-neutral-950 sm:text-4xl">
                ART-O-THON: Don't Just Learn.
                <span className="artothon-accent mt-1 block text-orange-500">Create.</span>
              </h2>
              <p className="artothon-copy mt-4 text-sm leading-relaxed text-neutral-500 sm:text-[15px]">
                Learning becomes powerful when you put it into action. ART-O-THON is designed to turn learning into consistent creation through daily challenges, missions and milestone submissions.
              </p>
              <p className="artothon-copy mt-3 text-sm leading-relaxed text-neutral-500 sm:text-[15px]">
                Every creation becomes a step forward. Every completed challenge becomes proof of your progress. And every milestone gives you another reason to celebrate how far you've come.
              </p>
              <Link
                href="/webinar"
                className="artothon-btn mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-orange-500 px-6 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-orange-500/25 transition hover:bg-orange-600 sm:w-auto"
              >
                Join Challenge
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>
          </div>

          <div className="absolute right-0 top-1/2 z-10 hidden w-[200px] -translate-y-1/2 translate-x-8 lg:block xl:w-[220px] xl:translate-x-10">
            <SprintCard />
          </div>
        </div>
      </div>
    </section>
  );
}
