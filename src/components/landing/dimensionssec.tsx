import { Award, Briefcase, Crown, Globe, Palette, Sparkles } from "lucide-react";

const DIMENSIONS = [
  {
    title: "Skill",
    outcomeTag: "Professional Quality",
    image: "/images/dimensions/skill.png?v=2",
    icon: Award,
    desc: "How confidently and consistently you can create quality Resin Art.",
  },
  {
    title: "Creativity",
    outcomeTag: "Artistic Expression",
    image: "/images/dimensions/creativity.png",
    icon: Palette,
    desc: "How effectively you experiment, innovate and develop your own artistic expression.",
  },
  {
    title: "Identity",
    outcomeTag: "Recognized Brand",
    image: "/images/dimensions/identity.png",
    icon: Crown,
    desc: "How clearly you develop your personal style, portfolio and recognition as an artist.",
  },
  {
    title: "Business",
    outcomeTag: "Commercial Income",
    image: "/images/dimensions/business.png",
    icon: Briefcase,
    desc: "How effectively you turn your skill and creations into products, customers and opportunities.",
  },
  {
    title: "Impact",
    outcomeTag: "Customer Value",
    image: "/images/dimensions/impact.png",
    icon: Globe,
    desc: "How your knowledge, creations and journey create value for customers and inspire others.",
  },
  {
    title: "Personal Growth",
    outcomeTag: "Confidence & Pride",
    image: "/images/dimensions/growth.png",
    icon: Sparkles,
    desc: "How much you grow in confidence, discipline, leadership and belief in yourself.",
  },
];

export default function DimensionsSec() {
  return (
    <section id="dimensions" className="dimensions-sec relative z-10 bg-white py-16 text-neutral-950 sm:py-20 lg:py-24">
      <div className="nav-width page-rise">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs sm:text-base lg:text-xs font-semibold uppercase tracking-[0.18em] text-[#942008]">
            Holistic Development
          </p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-neutral-950 sm:text-5xl lg:text-5xl">
            Success Is More Than <span className="text-[#942008]">The Money You Make.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-neutral-600 sm:text-xl lg:text-base">
            Your growth should be measured by the person you become along the way. We believe your Resin Art journey should help you grow across six important dimensions:
          </p>
        </div>

        {/*
        <div className="mt-10 grid grid-cols-1 gap-6 sm:mt-12 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {DIMENSIONS.map((dim) => (
            <article key={dim.title} className="dimensions-card rounded-3xl p-6 sm:p-7">
              <img src={dim.image} alt="" className="mb-5 h-16 w-16 object-contain" />
              <h3 className="dimensions-title text-lg font-bold text-neutral-950">{dim.title}</h3>
              <p className="dimensions-muted mt-2 text-sm leading-relaxed text-neutral-500">{dim.desc}</p>
              <p className="dimensions-tag mt-3 text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                {dim.outcomeTag}
              </p>
            </article>
          ))}
        </div>
        */}

        <div className="mt-10 grid grid-cols-1 gap-4 sm:mt-12 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {DIMENSIONS.map((dim) => {
            const Icon = dim.icon;
            return (
              <article key={dim.title} className="flex h-full flex-col rounded-[1.6rem] border border-[#f1efec] bg-[#fbfbfb] p-5 shadow-[0_14px_34px_-26px_rgba(15,23,42,0.45)] transition duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-[0_18px_36px_-22px_rgba(227,107,50,0.28)] sm:p-6">
                <Icon size={40} strokeWidth={1.6} className="dimensions-line-icon mb-4" aria-hidden="true" />
                <h3 className="dimensions-title text-base font-bold text-neutral-950 sm:text-lg">{dim.title}</h3>
                <p className="dimensions-muted mt-2 flex-1 text-sm leading-relaxed text-neutral-500">{dim.desc}</p>
                <p className="dimensions-tag mt-4 text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                  {dim.outcomeTag}
                </p>
              </article>
            );
          })}
        </div>

        {/*
        <div className="mt-10 grid grid-cols-1 gap-4 sm:mt-12 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {DIMENSIONS.map((dim) => (
            <article key={dim.title} className="flex h-full flex-col rounded-[1.35rem] border border-neutral-100 bg-white p-5 shadow-[0_18px_40px_-28px_rgba(15,23,42,0.35)] sm:p-6">
              <img src={dim.image} alt="" className="mb-4 h-10 w-10 object-contain" />
              <h3 className="dimensions-title text-base font-bold text-neutral-950 sm:text-lg">{dim.title}</h3>
              <p className="dimensions-muted mt-2 flex-1 text-sm leading-relaxed text-neutral-500">{dim.desc}</p>
              <p className="dimensions-tag mt-4 text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                {dim.outcomeTag}
              </p>
            </article>
          ))}
        </div>
        */}

        {/*
        <div className="mt-10 grid grid-cols-1 gap-5 sm:mt-12 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {DIMENSIONS.map((dim) => (
            <article key={dim.title} className="dimensions-sheet relative overflow-hidden rounded-2xl p-6 sm:p-7">
              <span className="dimensions-corner pointer-events-none absolute -top-8 -right-8 h-24 w-24 rounded-full" aria-hidden="true" />
              <h3 className="dimensions-title relative text-lg font-bold text-neutral-950 sm:text-xl">{dim.title}</h3>
              <p className="dimensions-muted relative mt-3 text-sm leading-relaxed text-neutral-500">{dim.desc}</p>
              <p className="dimensions-tag relative mt-4 text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                {dim.outcomeTag}
              </p>
            </article>
          ))}
        </div>
        */}
      </div>
    </section>
  );
}
