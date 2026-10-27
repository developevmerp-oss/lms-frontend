"use client";

import { Star } from "lucide-react";

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

function ReviewCard({ rev }: { rev: (typeof VERIFIED_REVIEWS)[number] }) {
  return (
    <article className="testimonia-card rounded-[1.35rem] border border-neutral-200/90 bg-white p-5">
      <div className="flex items-center justify-between gap-3">
        <Stars count={rev.rating} size={13} />
        <span className="testimonia-muted shrink-0 text-[11px]">Google Play · {rev.date}</span>
      </div>
      <p className="testimonia-quote mt-3 text-sm leading-relaxed">“{rev.comment}”</p>
      <div className="mt-4 flex items-center gap-3">
        <div
          className={`testimonia-initial flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr text-sm font-bold ${rev.avatarBg}`}
        >
          {rev.name[0]}
        </div>
        <div>
          <p className="testimonia-strong text-sm font-semibold">{rev.name}</p>
          <p className="testimonia-muted text-xs">{rev.tag}</p>
        </div>
      </div>
    </article>
  );
}

function repeatColumn(items: typeof VERIFIED_REVIEWS) {
  const filled: typeof VERIFIED_REVIEWS = [];
  const minimum = Math.max(6, items.length * 3);
  while (filled.length < minimum) filled.push(...items);
  return filled;
}

function ReviewColumn({
  items,
  reverse = false,
  duration = "36s",
}: {
  items: typeof VERIFIED_REVIEWS;
  reverse?: boolean;
  duration?: string;
}) {
  const sequence = repeatColumn(items);
  const loop = [...sequence, ...sequence];
  return (
    <div className="testimonia-col">
      <div
        className={`testimonia-track ${reverse ? "is-reverse" : ""}`}
        style={{ animationDuration: duration }}
      >
        {loop.map((rev, index) => (
          <ReviewCard key={`${rev.name}-${index}`} rev={rev} />
        ))}
      </div>
    </div>
  );
}

function ReviewBoard({
  columns,
  className,
}: {
  columns: { items: typeof VERIFIED_REVIEWS; reverse?: boolean; duration: string }[];
  className: string;
}) {
  return (
    <div className={`testimonia-board ${className}`}>
      <span className="testimonia-fade testimonia-fade-top" aria-hidden="true" />
      <span className="testimonia-fade testimonia-fade-bottom" aria-hidden="true" />
      <div className="testimonia-cols">
        {columns.map((column) => (
          <ReviewColumn key={column.duration + String(column.reverse)} {...column} />
        ))}
      </div>
    </div>
  );
}

export default function TestimoniaSec() {
  const thirds = [0, 1, 2].map((offset) =>
    VERIFIED_REVIEWS.filter((_, index) => index % 3 === offset)
  );
  const halves = [0, 1].map((offset) =>
    VERIFIED_REVIEWS.filter((_, index) => index % 2 === offset)
  );

  return (
    <section className="testimonia-sec relative z-10 bg-[#f7f6f0] py-16 text-neutral-950 sm:py-20 lg:py-24">
      <div className="nav-width">
        <div className="mx-auto max-w-3xl text-center">
          <p className="testimonia-kicker text-xs font-semibold uppercase tracking-widest">
            Verified Track Record
          </p>
          <h2 className="testimonia-heading mt-3 font-serif text-3xl font-medium leading-tight tracking-tight sm:text-4xl lg:text-5xl">
            54K+ Students Taught. 8K+ Orders Completed. 5★ Google Rating.
          </h2>
          <p className="testimonia-muted mt-4 text-sm leading-relaxed sm:text-base">
            Thousands of learners have already trusted Ravishing Art to help them explore, learn and grow through Resin Art. From beginners taking their first step to creators building their own identity and income, every journey is different. But every journey begins with one decision: to start.
          </p>
          <p className="testimonia-score mt-5 font-serif text-4xl font-medium leading-none">5.0</p>
          <div className="mt-3 flex justify-center">
            <Stars count={5} size={16} />
          </div>
          <p className="testimonia-strong mt-2 text-sm font-semibold">Ravishing Art App</p>
          <p className="testimonia-muted mt-1 text-sm">Google Play Store · 100% Real Student Feedback</p>
        </div>

        <ReviewBoard
          className="testimonia-board-1 mt-10"
          columns={[{ items: VERIFIED_REVIEWS, duration: "42s" }]}
        />
        <ReviewBoard
          className="testimonia-board-2 mt-10"
          columns={[
            { items: halves[0], duration: "38s" },
            { items: halves[1], reverse: true, duration: "44s" },
          ]}
        />
        <ReviewBoard
          className="testimonia-board-3 mt-12"
          columns={[
            { items: thirds[0], duration: "34s" },
            { items: thirds[1], reverse: true, duration: "42s" },
            { items: thirds[2], duration: "38s" },
          ]}
        />
      </div>
    </section>
  );
}
