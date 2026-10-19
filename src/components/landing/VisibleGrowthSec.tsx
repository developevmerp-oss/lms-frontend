"use client";

import { BookOpen, Brush, CheckCircle2, Flag, Sparkles, Star, Trophy } from "lucide-react";
import { useLayoutEffect, useRef, useState } from "react";

const STEPS = [
  {
    number: "01",
    title: "Learn",
    description: "Explore techniques at your own pace.",
    image: "/images/landing/growth-learn.jpg",
    position: "object-[62%_center]",
    icon: BookOpen
  },
  {
    number: "02",
    title: "Create",
    description: "Practice and bring your ideas to life.",
    image: "/images/landing/growth-create.jpg",
    position: "object-[68%_center]",
    icon: Brush
  },
  {
    number: "03",
    title: "Complete",
    description: "Finish projects and challenges.",
    image: "/images/landing/growth-complete.jpg",
    position: "object-[68%_center]",
    icon: CheckCircle2
  },
  {
    number: "04",
    title: "Earn Points",
    description: "Get rewarded for your progress.",
    image: "/images/landing/growth-points.jpg",
    position: "object-[42%_center]",
    icon: Star
  },
  {
    number: "05",
    title: "Unlock Milestones",
    description: "Reach new levels and opportunities.",
    image: "/images/landing/growth-milestones.jpg",
    position: "object-[48%_42%]",
    icon: Flag
  },
  {
    number: "06",
    title: "Earn Recognition",
    description: "Showcase your journey and be proud of how far you've come.",
    image: "/images/landing/growth-recognition.jpg",
    position: "object-[72%_28%]",
    icon: Trophy
  }
];

type Dot = { x: number; y: number };

export default function VisibleGrowthSec() {
  const rowRef = useRef<HTMLDivElement>(null);
  const [wave, setWave] = useState<{ d: string; dots: Dot[]; width: number; height: number } | null>(null);

  useLayoutEffect(() => {
    const row = rowRef.current;
    if (!row) return;

    document.documentElement.dataset.growthWave = "ran";
    const draw = () => {
      const cards = [...row.querySelectorAll<HTMLElement>("[data-arch]")];
      const box = row.getBoundingClientRect();
      const tops = cards.map((card) => card.getBoundingClientRect().top);
      const oneRow = cards.length > 1 && Math.max(...tops) - Math.min(...tops) < 8;

      if (!oneRow) {
        setWave(null);
        return;
      }

      const dots: Dot[] = [];
      let d = "";

      cards.forEach((card, index) => {
        if (index === cards.length - 1) return;
        const current = card.getBoundingClientRect();
        const next = cards[index + 1].getBoundingClientRect();
        const y = current.top - box.top + current.height * 0.58;
        const x1 = current.right - box.left;
        const x2 = next.left - box.left;
        const dx = x2 - x1;
        const mid = x1 + dx / 2;
        const lift = (index % 2 === 0 ? 1 : -1) * Math.min(20, dx * 0.24);
        const peak = y + lift;

        d += `M ${x1} ${y} C ${x1 + dx * 0.42} ${y}, ${mid - dx * 0.12} ${peak}, ${mid} ${peak} C ${mid + dx * 0.12} ${peak}, ${x2 - dx * 0.42} ${y}, ${x2} ${y} `;
        dots.push({ x: x1, y }, { x: x2, y });
      });

      setWave({ d, dots, width: box.width, height: box.height });
    };

    draw();
    const observer = new ResizeObserver(draw);
    observer.observe(row);
    window.addEventListener("resize", draw);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", draw);
    };
  }, []);

  return (
    <section className="growth-band relative z-10 bg-[#f7f2ec] py-24">
      <div className="nav-width text-center">
        <div className="flex items-center justify-center gap-4 text-[11px] font-semibold uppercase tracking-[0.28em] text-orange-700">
          <span className="h-px w-10 bg-orange-300" />
          Gamified Progress Tracking
          <span className="h-px w-10 bg-orange-300" />
        </div>

        <h2 className="mx-auto mt-5 max-w-3xl font-serif text-4xl tracking-tight text-stone-950 md:text-5xl">
          Your Growth <span className="italic text-orange-700">Should Be</span> Visible.
        </h2>

        <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-stone-500 md:text-base">
          Every creation, challenge, milestone and achievement should tell a story of how far you've come. Instead of wondering whether you're progressing, you'll have tangible milestones that help you see, measure and celebrate your growth.
        </p>

        <div ref={rowRef} className="relative mt-16">
          {wave && (
            <svg
              className="pointer-events-none absolute left-0 top-0 z-20 overflow-visible"
              width={wave.width}
              height={wave.height}
              viewBox={`0 0 ${wave.width} ${wave.height}`}
              aria-hidden
            >
              <path d={wave.d} fill="none" stroke="#e39a62" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="6 5" />
              {wave.dots.map((dot, index) => (
                <circle key={index} cx={dot.x} cy={dot.y} r="4.25" fill="#e08a4a" />
              ))}
            </svg>
          )}
          <div className="grid grid-cols-2 gap-x-4 gap-y-12 sm:grid-cols-3 lg:grid-cols-6 lg:gap-x-0">
            {STEPS.map((step) => (
              <div key={step.number} className="relative flex flex-col items-center">
                <span className="mb-3 text-xs font-semibold tracking-wide text-orange-700">{step.number}</span>
                <div className="relative z-10 w-32">
                  <div data-arch className="h-40 overflow-hidden rounded-t-full rounded-b-[2rem] bg-orange-50 shadow-[0_16px_30px_-22px_rgba(180,83,9,0.45)]">
                    <img src={step.image} alt={step.title} className={`h-full w-full object-cover ${step.position}`} />
                  </div>
                  <div className="absolute -bottom-3.5 left-1/2 z-20 flex h-9 w-9 -translate-x-1/2 items-center justify-center rounded-full border border-orange-200 bg-white text-orange-700 shadow-sm">
                    <step.icon size={16} />
                  </div>
                </div>
                <h3 className="mt-7 text-sm font-semibold text-stone-900">{step.title}</h3>
                <p className="mt-1 max-w-[9.5rem] text-xs leading-relaxed text-stone-500">{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 inline-flex items-center gap-2 rounded-full bg-orange-50 px-5 py-2.5 text-sm text-stone-600">
          <Sparkles size={15} className="text-orange-500" />
          <span>
            Your journey becomes something you can <span className="font-semibold text-orange-700">see, track and be proud of.</span>
          </span>
        </div>
      </div>
    </section>
  );
}
