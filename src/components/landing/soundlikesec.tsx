/*
function CardArt({ stage }: { stage: string }) {
  if (stage === "01") {
    return (
      <svg viewBox="0 0 140 110" className="h-24 w-28" aria-hidden="true">
        <ellipse cx="70" cy="92" rx="36" ry="12" fill="#FDE7D4" />
        <path d="M70 18c-14 0-24 12-24 26 0 10 6 18 14 22v8h20v-8c8-4 14-12 14-22 0-14-10-26-24-26z" fill="#F6C445" />
        <rect x="58" y="76" width="24" height="8" rx="2" fill="#E8B23A" />
        <path d="M46 28l-8-6M94 28l8-6M70 8v-6" stroke="#F6C445" strokeWidth="3" strokeLinecap="round" />
      </svg>
    );
  }
  if (stage === "02") {
    return (
      <svg viewBox="0 0 140 110" className="h-24 w-28" aria-hidden="true">
        <ellipse cx="70" cy="92" rx="36" ry="12" fill="#FDE7D4" />
        <ellipse cx="68" cy="58" rx="28" ry="22" fill="#F4A261" />
        <circle cx="56" cy="50" r="6" fill="#F43F5E" />
        <circle cx="74" cy="46" r="6" fill="#FACC15" />
        <circle cx="80" cy="62" r="6" fill="#22C55E" />
        <circle cx="62" cy="66" r="5" fill="#3B82F6" />
        <path d="M92 40l16-18" stroke="#C2410C" strokeWidth="4" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 140 110" className="h-24 w-28" aria-hidden="true">
      <ellipse cx="70" cy="92" rx="36" ry="12" fill="#FDE7D4" />
      <circle cx="66" cy="54" r="24" fill="#F8D7B0" />
      <circle cx="66" cy="54" r="16" fill="#fff" />
      <circle cx="66" cy="54" r="8" fill="#F97316" />
      <path d="M78 42l22-16-4 20z" fill="#EA580C" />
      <path d="M96 30l8-8" stroke="#9A3412" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
*/

const CARDS = [
  {
    stage: "01",
    label: "The Explorer",
    title: "You Love Creating, But You Don't Know What To Focus On.",
    description: "You keep learning different techniques from scattered videos but still feel confused about what you should master next to make real progress.",
    solution: "Structured Step-by-Step Curriculum",
    stageClass: "sound-stage-explorer",
    wash: "sound-wash-explorer",
    icon: "/images/sound-like/explorer.png",
  },
  {
    stage: "02",
    label: "The Creator",
    title: "You Create Beautiful Work, But You're Not Getting Consistent Orders.",
    description: "You know your creations have value, but you don't know how to consistently attract the right customers and convert your creativity into predictable income.",
    solution: "Client Acquisition & Order Pricing",
    stageClass: "sound-stage-creator",
    wash: "sound-wash-creator",
    icon: "/images/sound-like/creator.png",
  },
  {
    stage: "03",
    label: "The Visionary",
    title: "You Want Your Own Identity and Income—Not Another Hobby.",
    description: "You want people to recognise you for your talent, you want something that is truly yours and you want your creativity to contribute to your financial freedom.",
    solution: "Signature Brand & Lifetime Mentorship",
    stageClass: "sound-stage-visionary",
    wash: "sound-wash-visionary",
    icon: "/images/sound-like/visionary.png",
  },
];

export default function SoundLikeSec() {
  return (
    <section className="sound-like-sec nav-width relative z-10 bg-white py-16 text-neutral-950 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <p className="sound-kicker text-xs font-semibold uppercase tracking-[0.18em]">
            Self Reflection
          </p>
          <h2 className="sound-heading mt-3 text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
            Does This Sound Like <span className="sound-accent">You?</span>
          </h2>
          <p className="sound-muted mx-auto mt-4 max-w-2xl text-sm leading-relaxed sm:text-base">
            Recognize where you are right now so we can guide you to where you want to be.
          </p>
        </div>

        {/*
          Current card ui
          <div className="mx-auto mt-10 flex w-full flex-col items-center gap-4 sm:mt-14 sm:gap-5 lg:flex-row lg:items-stretch lg:justify-center lg:gap-5">
            {CARDS.map((card) => (
              <article className="sound-card relative flex w-full max-w-[480px] flex-col overflow-hidden rounded-[26px] px-7 pb-7 pt-7 lg:w-[calc((100%-2.5rem)/3)] lg:max-w-[450px] lg:shrink">
                <div className={`pointer-events-none absolute inset-x-0 bottom-0 h-48 ${card.wash}`} />
                <div className="relative z-10 flex flex-1 flex-col">
                  <p className={`text-xs font-semibold uppercase tracking-[0.16em] ${card.stageClass}`}>Stage {card.stage}</p>
                  <p className="sound-stage-name mt-1 text-sm font-semibold uppercase tracking-[0.16em]">{card.label}</p>
                  <h3 className="sound-title mt-8 text-[1.7rem] font-semibold leading-[1.3] tracking-wide">{card.title}</h3>
                  <p className="sound-muted mt-4 text-base leading-relaxed">{card.description}</p>
                  <div className="mt-20 h-px w-10 bg-neutral-200" />
                  <div className="mt-5">
                    <p className="sound-muted text-xs font-semibold uppercase tracking-[0.16em]">Solution</p>
                    <p className="sound-solution mt-2 text-sm font-semibold leading-snug">{card.solution}</p>
                    <ArrowRight className="sound-arrow mt-5" size={18} />
                  </div>
                </div>
              </article>
            ))}
          </div>
        */}

        {/* 2nd option ui */}
        <div className="mx-auto mt-10 grid w-full grid-cols-1 gap-5 sm:mt-14 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {CARDS.map((card) => (
            <article
              key={card.stage}
              className="page-rise-item sound-card flex h-full flex-col rounded-[1.75rem] px-5 py-6 transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_36px_-24px_rgba(90,55,20,0.35)] sm:px-6"
              style={{ animationDelay: `${Number(card.stage) * 0.08}s` }}
            >
              <div className="flex items-center justify-between gap-3">
                <span className="sound-option-num flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold">
                  {Number(card.stage)}
                </span>
                <span className={`sound-option-pill rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] ${card.stageClass}`}>
                  Stage: {card.label}
                </span>
              </div>
              <div className="mx-auto mt-3 flex h-32 w-full items-center justify-center">
                <img src={card.icon} alt="" className="h-28 w-auto object-contain" />
              </div>
              <h3 className="sound-title mt-2 text-lg font-bold leading-snug sm:text-xl">{card.title}</h3>
              <p className="sound-muted mt-3 flex-1 text-sm leading-relaxed">{card.description}</p>
              <p className="sound-option-solution mt-5 inline-flex items-start gap-2 text-sm font-semibold leading-snug">
                <span className="sound-option-check mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[10px]">✓</span>
                Solution: {card.solution}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-8 rounded-3xl bg-slate-50 px-5 py-8 text-center sm:mt-10 sm:px-8">
          <p className="sound-quote text-lg font-bold leading-snug sm:text-2xl">
            ✨ If you see yourself in any of these, you're in the <span className="sound-accent">right place.</span>
          </p>
        </div>
    </section>
  );
}
