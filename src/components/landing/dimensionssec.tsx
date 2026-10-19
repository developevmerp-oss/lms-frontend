const DIMENSIONS = [
  {
    title: "Skill",
    outcomeTag: "Professional Quality",
    image: "/images/dimensions/skill.png?v=2",
    desc: "How confidently and consistently you can create quality Resin Art.",
  },
  {
    title: "Creativity",
    outcomeTag: "Artistic Expression",
    image: "/images/dimensions/creativity.png",
    desc: "How effectively you experiment, innovate and develop your own artistic expression.",
  },
  {
    title: "Identity",
    outcomeTag: "Recognized Brand",
    image: "/images/dimensions/identity.png",
    desc: "How clearly you develop your personal style, portfolio and recognition as an artist.",
  },
  {
    title: "Business",
    outcomeTag: "Commercial Income",
    image: "/images/dimensions/business.png",
    desc: "How effectively you turn your skill and creations into products, customers and opportunities.",
  },
  {
    title: "Impact",
    outcomeTag: "Customer Value",
    image: "/images/dimensions/impact.png",
    desc: "How your knowledge, creations and journey create value for customers and inspire others.",
  },
  {
    title: "Personal Growth",
    outcomeTag: "Confidence & Pride",
    image: "/images/dimensions/growth.png",
    desc: "How much you grow in confidence, discipline, leadership and belief in yourself.",
  },
];

export default function DimensionsSec() {
  return (
    <section id="dimensions" className="dimensions-sec relative z-10 bg-white py-16 text-neutral-950 sm:py-20 lg:py-24">
      <div className="container mx-auto px-5 sm:px-10 lg:px-10 2xl:px-0">
        <div className="mx-auto max-w-3xl text-center">
          <p className="dimensions-kicker text-xs font-semibold uppercase tracking-widest text-orange-500">
            Holistic Development
          </p>
          <h2 className="dimensions-heading mt-3 text-3xl font-black tracking-tight text-neutral-950 sm:text-4xl lg:text-5xl">
            Success Is More Than The Money You Make.
          </h2>
          <p className="dimensions-muted mt-4 text-sm leading-relaxed text-neutral-500 sm:text-base">
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
      </div>
    </section>
  );
}
