import { ChevronRight } from "lucide-react";

const STAGES = [
  { step: "01", title: "Passion", desc: "Creative spark", image: "/images/mindset/passion.png" },
  { step: "02", title: "Skill", desc: "Technique mastery", image: "/images/mindset/skill.png" },
  { step: "03", title: "Signature", desc: "Unique style", image: "/images/mindset/signature.png" },
  { step: "04", title: "Portfolio", desc: "Showcase proof", image: "/images/mindset/portfolio.png" },
  { step: "05", title: "Income", desc: "Monetization", image: "/images/mindset/income.png" },
  { step: "06", title: "Freedom", desc: "Self-identity", image: "/images/mindset/freedom.png" },
];

export default function StategicMindsetSec() {
  return (
    <section className="strategic-mindset relative z-10 bg-[#f7f6f0] py-16 text-neutral-950 sm:py-20 lg:pb-24">
      <div className="nav-width">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400">
            The Strategic Mindset
          </p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-neutral-950 sm:text-4xl lg:text-5xl">
            Resin Art Is Not the Destination.
            <span className="vehicle-accent mt-1 block">It's the Vehicle.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-neutral-500 sm:text-base">
            Resin Art can become the vehicle through which you discover your creativity, build your confidence, create a unique identity and create financial opportunities for yourself.
          </p>
        </div>

        <div className="mb-6 mt-10 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-center sm:mt-12">
          <p className="text-base font-bold text-neutral-950 sm:text-lg">6-Stage Progression Flow</p>
          <p className="inline-flex items-center gap-1 text-base text-neutral-500 sm:text-lg">
            From Passion to Freedom
            <ChevronRight size={18} aria-hidden="true" />
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6 lg:gap-5">
          {STAGES.map((step, idx) => (
            <article
              key={step.step}
              className="page-rise-item relative flex flex-col items-center rounded-3xl border border-neutral-200 bg-white px-3 py-5 text-center shadow-sm transition duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-md"
              style={{ animationDelay: `${idx * 0.08}s` }}
            >
              <img src={step.image} alt="" className="mb-4 h-16 w-16 object-contain sm:h-20 sm:w-20" />
              <p className="text-xs text-neutral-400">Stage {step.step}</p>
              <h3 className="mt-1 text-base font-bold text-neutral-950 sm:text-lg">{step.title}</h3>
              <p className="mt-1 text-xs leading-snug text-neutral-500 sm:text-sm">{step.desc}</p>
              {idx < STAGES.length - 1 && (
                <span aria-hidden="true" className="absolute top-1/2 -right-4 z-10 hidden -translate-y-1/2 text-orange-300 lg:block">
                  <ChevronRight size={16} />
                </span>
              )}
            </article>
          ))}
        </div>

        {/* <div className="mt-8 rounded-3xl bg-slate-50 px-5 py-8 text-center sm:mt-10 sm:px-8">
          <p className="text-sm text-neutral-500 sm:text-base">
            You don't have to choose between being an artist and building a successful life.
          </p>
          <p className="vehicle-quote mt-2 text-lg font-bold leading-snug text-neutral-950 sm:text-2xl">
            You can create beautiful art and <span className="vehicle-accent">create a beautiful future with it.</span>
          </p>
        </div> */}
      </div>
    </section>
  );
}
