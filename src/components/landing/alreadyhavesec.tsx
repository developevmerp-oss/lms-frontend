const CARDS = [
  {
    title: "No Prior Art Degree",
    description: "You don't need to be an expert to begin.",
    art: "degree" as const,
  },
  {
    title: "No Fancy Art Studio",
    description: "You don't need an expensive or perfect setup.",
    art: "studio" as const,
  },
  {
    title: "No Social Follower Base",
    description: "You don't need thousands of social media followers.",
    art: "social" as const,
  },
];

function CardArt({ kind }: { kind: (typeof CARDS)[number]["art"] }) {
  if (kind === "degree") {
    return (
      <svg viewBox="0 0 220 150" className="h-full w-full" aria-hidden="true">
        <ellipse cx="112" cy="108" rx="58" ry="26" fill="#FDE6D4" />
        <path d="M46 46 l3 7 3-7-3-7z" fill="#F4B183" />
        <path d="M38 62 l2 5 2-5-2-5z" fill="#F8C9A8" />
        <polygon points="110,46 162,70 110,94 58,70" fill="#1F2937" />
        <path d="M92 86 h36 v16 a4 4 0 0 1-4 4 h-28 a4 4 0 0 1-4-4z" fill="#111827" />
        <circle cx="110" cy="108" r="7" fill="#111827" />
        <path d="M160 70 q10 16 4 30" fill="none" stroke="#EAB308" strokeWidth="2.4" strokeLinecap="round" />
        <circle cx="164" cy="102" r="3.2" fill="#EAB308" />
        <circle cx="158" cy="112" r="15" fill="#FB7185" />
        <path d="M152 106 l12 12 M164 106 l-12 12" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" />
      </svg>
    );
  }

  if (kind === "studio") {
    return (
      <svg viewBox="0 0 220 150" className="h-full w-full" aria-hidden="true">
        <ellipse cx="108" cy="112" rx="62" ry="26" fill="#DDF5E4" />
        <path d="M168 38 l2.5 6 2.5-6-2.5-6z" fill="#86EFAC" />
        <path d="M78 118 l22-62 h8 l22 62" fill="none" stroke="#C4A484" strokeWidth="5" strokeLinejoin="round" />
        <path d="M86 96 h36" stroke="#C4A484" strokeWidth="4" strokeLinecap="round" />
        <rect x="90" y="48" width="32" height="40" rx="2" fill="#fff" stroke="#E7E5E4" />
        <path d="M94 74 q8-10 16 0 t12-2" fill="none" stroke="#86EFAC" strokeWidth="2" />
        <rect x="132" y="102" width="22" height="6" rx="2" fill="#D6B08A" />
        <path d="M136 108 v10 M150 108 v10 M134 118 h18" stroke="#C4A484" strokeWidth="2.4" strokeLinecap="round" />
        <circle cx="156" cy="108" r="15" fill="#FB7185" />
        <path d="M150 102 l12 12 M162 102 l-12 12" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 220 150" className="h-full w-full" aria-hidden="true">
      <ellipse cx="112" cy="112" rx="60" ry="26" fill="#EDE4FB" />
      <path d="M48 52 l3 7 3-7-3-7z" fill="#C4B5FD" />
      <path d="M170 48 l2.4 5.5 2.4-5.5-2.4-5.5z" fill="#DDD6FE" />
      <rect x="86" y="34" width="52" height="88" rx="10" fill="#fff" stroke="#E7E5E4" strokeWidth="2" />
      <rect x="92" y="44" width="40" height="64" rx="4" fill="#FAF5FF" />
      <circle cx="104" cy="62" r="7" fill="none" stroke="#E879F9" strokeWidth="2" />
      <circle cx="104" cy="62" r="2.4" fill="#E879F9" />
      <path d="M124 70 l8 5-8 5z" fill="#FB7185" />
      <circle cx="112" cy="92" r="6" fill="#1F2937" />
      <path d="M104 100 q8 6 16 0" fill="none" stroke="#1F2937" strokeWidth="2" />
      <circle cx="150" cy="108" r="15" fill="#FB7185" />
      <path d="M144 102 l12 12 M156 102 l-12 12" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

export default function AlreadyHaveSec() {
  return (
    <section className="already-have-sec relative z-10 bg-white pb-16 sm:pb-20">
      <div className="container mx-auto px-5 sm:px-10 lg:px-10 2xl:px-0">
        <div className="mx-auto max-w-3xl text-center">
          <span className="already-kicker mb-2 block text-xs font-black uppercase tracking-widest">
            Zero Barrier To Start
          </span>
          <h2 className="already-heading text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
            Your Journey Starts With What You Already Have.
          </h2>
        </div>

        <div className="relative mx-auto mt-10 max-w-5xl sm:mt-12">
          <div aria-hidden="true" className="already-line pointer-events-none absolute top-24 right-[10%] left-[10%] hidden lg:block">
            <span className="already-dot already-dot-peach" />
            <span className="already-dot already-dot-green" />
            <span className="already-dot already-dot-lilac" />
          </div>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3 lg:gap-8">
            {CARDS.map((card) => (
              <article key={card.title} className="already-card relative z-10 mx-auto flex w-full max-w-sm flex-col items-center rounded-[1.75rem] px-6 pb-7 pt-5 text-center sm:max-w-none">
                <div className="h-36 w-full">
                  <CardArt kind={card.art} />
                </div>
                <span className="already-badge mt-1 inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold">
                  ✕ Not Needed
                </span>
                <h3 className="already-title mt-4 text-lg font-bold">{card.title}</h3>
                <p className="already-copy mt-2 text-sm leading-relaxed">{card.description}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="mx-auto mt-8 max-w-4xl rounded-3xl bg-slate-50 px-5 py-8 text-center sm:mt-10 sm:px-8">
          <p className="already-note text-sm sm:text-base">
            You simply need the willingness to learn, create and take the next step.
          </p>
          <p className="already-quote mt-2 text-lg font-bold leading-snug sm:text-2xl">
            We help you move from <span className="already-muted italic">"I want to learn Resin Art"</span> to:
          </p>
          <p className="already-quote mt-2 text-lg font-bold leading-snug sm:text-2xl">
            "I know what I'm doing, I know what I'm creating and I know <span className="already-accent">where I'm going."</span>
          </p>
        </div>
      </div>
    </section>
  );
}
