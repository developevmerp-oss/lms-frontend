import { ArrowRight } from "lucide-react";

type ChallengeCardItem = {
  step: string;
  title: string;
  text: string;
  image: string;
  tone: string;
  variant: string;
};

const CARDS: ChallengeCardItem[] = [
  {
    step: "01",
    title: "Curriculum Void",
    text: "What to learn next & which techniques to master",
    image: "/images/real-challenge/curriculum-void.png",
    tone: "bg-[#F4EBE3]",
    variant: "feature",
  },
  {
    step: "02",
    title: "Product Demand",
    text: "What exact products to create for maximum demand",
    image: "/images/real-challenge/product-demand.png",
    tone: "bg-[#FDE8EC]",
    variant: "wide",
  },
  {
    step: "03",
    title: "Signature Style",
    text: "How to develop your own signature recognizable style",
    image: "/images/real-challenge/signature-style.png",
    tone: "bg-[#E5F5E4]",
    variant: "compact",
  },
  {
    step: "04",
    title: "Portfolio Proof",
    text: "How to showcase your artwork with confidence",
    image: "/images/real-challenge/portfolio-proof.png",
    tone: "bg-[#EEE8F8]",
    variant: "compact",
  },
  {
    step: "05",
    title: "Order Consistency",
    text: "How to get consistent, high-paying orders",
    image: "/images/real-challenge/order-consistency.png",
    tone: "bg-[#F7EDE4]",
    variant: "wide",
  },
  {
    step: "06",
    title: "Income Blueprint",
    text: "How to turn your creative skill into predictable income",
    image: "/images/real-challenge/income-blueprint.png",
    tone: "bg-[#E6F1FB]",
    variant: "wide",
  },
];

function ChallengeCard({ item, className = "" }: { item: ChallengeCardItem; className?: string }) {
  const compact = item.variant === "compact";
  const feature = item.variant === "feature";

  return (
    <article
      className={`relative flex h-full flex-col justify-between overflow-hidden rounded-3xl p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md sm:p-6 lg:p-4 ${item.tone} ${
        compact ? "min-h-56 lg:min-h-0" : "min-h-64 lg:min-h-0"
      } ${className}`}
    >
      <div className={`relative z-10 ${feature ? "w-2/5" : "w-1/2"}`}>
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white text-xs font-semibold text-neutral-800 shadow-sm">
          {item.step}
        </span>
        <h3
          className={`mt-4 font-black leading-tight tracking-tight text-neutral-950 ${
            compact ? "text-xl lg:text-lg" : "text-2xl sm:text-3xl lg:text-xl"
          }`}
        >
          {item.title}
        </h3>
        <p className={`mt-2 leading-snug text-neutral-600 ${compact ? "text-sm" : "text-sm sm:text-base"}`}>
          {item.text}
        </p>
      </div>

      <img
        src={item.image}
        alt=""
        className={`pointer-events-none absolute bottom-0 right-0 z-0 object-contain object-right-bottom ${
          feature ? "h-4/5 w-auto max-w-none" : "h-4/5 w-1/2"
        }`}
      />
    </article>
  );
}

export default function RealChallangeSec() {
  return (
    <section id="problem" className="relative z-10 bg-white py-16 text-neutral-950 sm:py-20 lg:py-24">
      <div className="nav-width container">
        <div className="page-rise mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
            The Real Challenge
          </p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-neutral-950 sm:text-4xl lg:mt-2 lg:text-4xl">
            Beautiful Art Alone Doesn't Build a Business.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-neutral-600 sm:text-base lg:mt-2">
            You may know how to create beautiful resin pieces, but knowing the craft is only one part of the journey.
          </p>
        </div>

        <div className="page-rise mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:mt-4 lg:gap-3">
          <ChallengeCard item={CARDS[0]} className="min-h-72 lg:min-h-0 xl:row-span-2 xl:min-h-0" />
          <ChallengeCard item={CARDS[1]} />
          <div className="grid grid-cols-1 gap-4 sm:col-span-2 sm:grid-cols-2 xl:col-span-1 lg:gap-3">
            <ChallengeCard item={CARDS[2]} />
            <ChallengeCard item={CARDS[3]} />
          </div>
          <ChallengeCard item={CARDS[4]} />
          <ChallengeCard item={CARDS[5]} />
        </div>

        <div className="real-challenge-quote mt-10 rounded-3xl bg-slate-50 px-5 py-8 text-center sm:mt-14 sm:px-8 lg:mt-4 lg:py-4">
          <p className="text-sm text-neutral-500 sm:text-base">
            The problem isn't your talent.
          </p>
          <p className="real-challenge-emphasis mt-2 text-lg font-bold leading-snug text-neutral-950 sm:text-2xl">
            The problem is that <span className="real-challenge-accent">nobody gave you a clear path.</span>
          </p>
        </div>
      </div>
    </section>
  );
}
