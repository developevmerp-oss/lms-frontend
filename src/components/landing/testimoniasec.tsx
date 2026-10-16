"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

const VERIFIED_REVIEWS = [
  {
    name: "Krupali Shah",
    date: "18 Feb 2023",
    rating: 5,
    tag: "Verified Student",
    comment:
      "Easy to access, easy to connect and best part always support is there so you never feel stuck anywhere. The best part is all course introductions are open for all to know the course details and see our mentor too 👍",
    avatarBg: "from-teal-500 to-cyan-500",
  },
  {
    name: "Sonal",
    date: "21 May 2024",
    rating: 5,
    tag: "Verified Student",
    comment:
      "Ravishing Art is a wonderful app to learn resin art. It has different courses and easy steps in video form. Vrajangna miss encourages us to try new thoughts and designs. Very much helpful for art lovers. Very happy to join Ravishing Art!",
    avatarBg: "from-orange-500 to-amber-500",
  },
  {
    name: "Drashti Gosai",
    date: "19 Oct 2023",
    rating: 5,
    tag: "Verified Student",
    comment:
      "Absolutely love this app. The user-friendly interface makes it easy to experiment with different techniques. I also appreciate Vrajangna mam for being a motivational figure in my art journey.",
    avatarBg: "from-purple-500 to-pink-500",
  },
  {
    name: "Hina Bhardwaj",
    date: "19 Oct 2023",
    rating: 5,
    tag: "Verified Student",
    comment:
      "I first saw Vrajangna Ma'am on an Instagram Live. The way she explained resin art — whether the learner is from a well-to-do family or a simple housewife, anyone can learn with minimum investment. One day she shared a reel about the courses and I immediately enrolled myself. My learning started a new journey.",
    avatarBg: "from-slate-600 to-slate-400",
  },
  {
    name: "Manisha Dedhia",
    date: "3 Jun 2025",
    rating: 5,
    tag: "Verified Student",
    comment:
      "Amazing experience with Vrajangana ma'am for teaching resin art. Her videos are very easy to understand for a newcomer like me. Within a month I got confidence to make different resin items. Thanks a lot ma'am for your guidance. Thank you!",
    avatarBg: "from-emerald-500 to-teal-500",
  },
  {
    name: "Tamanna Bhanushali",
    date: "15 Apr 2024",
    rating: 5,
    tag: "Verified Student",
    comment:
      "Learning is very easy with this app. Someone is always available for solving queries. Boosted my confidence by giving tasks and helping to complete them. Best resin art learning platform!",
    avatarBg: "from-rose-500 to-pink-500",
  },
];

function Stars({ count, size = 16 }: { count: number; size?: number }) {
  return (
    <div className="flex gap-0.5" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} size={size} className="testimonia-star fill-amber-400 text-amber-400" />
      ))}
    </div>
  );
}

export default function TestimoniaSec() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const updateControls = () => {
    const el = scrollerRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  useEffect(() => {
    updateControls();
    window.addEventListener("resize", updateControls);
    return () => window.removeEventListener("resize", updateControls);
  }, []);

  const scrollByCard = (direction: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-slide]");
    const distance = card ? card.getBoundingClientRect().width : el.clientWidth;
    el.scrollBy({ left: direction * distance, behavior: "smooth" });
  };

  return (
    <section className="testimonia-sec relative z-10 bg-white py-16 text-neutral-950 sm:py-20 lg:py-24">
      <div className="container mx-auto px-5 sm:px-10 lg:px-10 2xl:px-0">
        <p className="testimonia-kicker text-xs font-semibold uppercase tracking-widest text-neutral-400">
          Verified Track Record
        </p>
        <h2 className="testimonia-heading mt-3 max-w-4xl font-serif text-3xl font-medium leading-tight tracking-tight text-neutral-900 sm:text-4xl lg:text-5xl">
          54K+ Students Taught. 8K+ Orders Completed. 5★ Google Rating.
        </h2>
        <p className="testimonia-muted mt-4 max-w-3xl text-sm leading-relaxed text-neutral-500 sm:text-base">
          Thousands of learners have already trusted Ravishing Art to help them explore, learn and grow through Resin Art. From beginners taking their first step to creators building their own identity and income, every journey is different. But every journey begins with one decision: to start.
        </p>

        <div className="mt-10 flex items-stretch overflow-hidden rounded-2xl border border-neutral-200 bg-white sm:mt-12">
          <article className="flex w-1/2 shrink-0 flex-col justify-center border-r border-neutral-200 bg-white px-6 py-10 sm:w-1/4 sm:px-8">
            <p className="testimonia-score font-serif text-6xl font-medium leading-none tracking-tight text-neutral-800 sm:text-7xl">
              5.0
            </p>
            <div className="mt-5">
              <Stars count={5} size={18} />
            </div>
            <p className="testimonia-strong mt-4 text-sm font-semibold text-neutral-900">Ravishing Art App</p>
            <p className="testimonia-muted mt-1 text-sm text-neutral-400">
              Google Play Store · 100% Real Student Feedback
            </p>
          </article>

          <div
            ref={scrollerRef}
            onScroll={updateControls}
            className="flex min-w-0 flex-1 snap-x snap-mandatory items-stretch overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {VERIFIED_REVIEWS.map((rev) => (
              <article
                key={rev.name}
                data-slide
                className="flex w-2/3 shrink-0 snap-start flex-col border-r border-neutral-200 px-6 py-8 last:border-r-0 sm:w-2/5 sm:px-8"
              >
                <div className="mb-5 flex items-center justify-between gap-3">
                  <Stars count={rev.rating} size={14} />
                  <span className="testimonia-muted shrink-0 text-xs text-neutral-400">
                    Google Play · {rev.date}
                  </span>
                </div>
                <p className="testimonia-quote font-serif text-lg leading-snug text-neutral-900 sm:text-xl">
                  “{rev.comment}”
                </p>
                <div className="mt-auto flex items-center gap-3 pt-8">
                  <div
                    className={`testimonia-initial flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr text-sm font-bold text-white ${rev.avatarBg}`}
                  >
                    {rev.name[0]}
                  </div>
                  <div>
                    <p className="testimonia-strong text-sm font-semibold text-neutral-900">{rev.name}</p>
                    <p className="testimonia-muted text-sm text-neutral-500">{rev.tag}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-6 flex gap-2">
          <button
            type="button"
            aria-label="Previous reviews"
            onClick={() => scrollByCard(-1)}
            disabled={!canPrev}
            className="testimonia-nav flex h-10 w-10 items-center justify-center rounded-lg border border-neutral-200 bg-neutral-50 text-neutral-700 disabled:cursor-default disabled:opacity-40"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            aria-label="Next reviews"
            onClick={() => scrollByCard(1)}
            disabled={!canNext}
            className="testimonia-nav flex h-10 w-10 items-center justify-center rounded-lg border border-neutral-200 bg-neutral-50 text-neutral-700 disabled:cursor-default disabled:opacity-40"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}
