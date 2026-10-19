import { GraduationCap, Paintbrush, Users } from "lucide-react";

const CARDS = [
  {
    title: "No Prior Art Degree",
    description: "You don't need to be an expert to begin.",
    icon: GraduationCap,
    image: "/images/already-have/no-degree.jpg",
  },
  {
    title: "No Fancy Art Studio",
    description: "You don't need an expensive or perfect setup.",
    icon: Paintbrush,
    image: "/images/already-have/no-studio.jpg",
  },
  {
    title: "No Social Follower Base",
    description: "You don't need thousands of social media followers.",
    icon: Users,
    image: "/images/already-have/no-followers.jpg",
  },
];

export default function AlreadyHaveSec() {
  return (
    <section className="already-have-sec relative z-10 bg-white py-16 sm:py-20 lg:py-24">
      <div className="container mx-auto px-5 sm:px-10 lg:px-10 2xl:px-0">
        <div className="mx-auto max-w-3xl text-center">
          <span className="already-kicker mb-2 block text-xs font-black uppercase tracking-widest">
            Zero Barrier To Start
          </span>
          <h2 className="already-heading text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
            Your Journey Starts With What You Already Have.
          </h2>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:mt-12 sm:grid-cols-2 sm:gap-6 lg:mt-16 lg:grid-cols-3">
          {CARDS.map((card) => (
            <article key={card.title} className="already-card flex h-full flex-col overflow-hidden rounded-[1.35rem]">
              <img
                src={card.image}
                alt=""
                className="h-[450px] w-full rounded-b-[2.75rem] object-cover"
              />
              <div className="flex flex-1 flex-col p-6 sm:p-7">
                <p className="already-badge mb-3 inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-semibold tracking-wide">
                  ✕ Not Needed
                </p>
                <h3 className="already-title text-lg font-bold leading-snug sm:text-xl">{card.title}</h3>
                <p className="already-copy mt-2 text-sm leading-relaxed sm:text-[15px]">{card.description}</p>
              </div>
            </article>
          ))}
        </div>

        {/*
        <div className="mt-10 grid grid-cols-1 gap-5 sm:mt-12 sm:grid-cols-2 sm:gap-6 lg:mt-16 lg:grid-cols-3">
          {CARDS.map((card) => {
            const Icon = card.icon;
            return (
              <article key={card.title} className="already-card flex h-full flex-col rounded-[1.35rem] p-6 sm:p-7">
                <span className="already-icon mb-5 flex h-12 w-12 items-center justify-center rounded-2xl">
                  <Icon size={22} aria-hidden="true" />
                </span>
                <p className="already-badge mb-3 inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-semibold tracking-wide">
                  ✕ Not Needed
                </p>
                <h3 className="already-title text-lg font-bold leading-snug sm:text-xl">{card.title}</h3>
                <p className="already-copy mt-2 text-sm leading-relaxed sm:text-[15px]">{card.description}</p>
              </article>
            );
          })}
        </div>
        */}

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
