"use client";

import { useEffect, useState, type TouchEvent } from "react";

export type CommunityStory = {
  quote: string;
  name: string;
  role: string;
};

export type CommunitySectionData = {
  eyebrow: string;
  heading: string;
  subheading: string;
  items: CommunityStory[];
};

const LOOKS = [
  { bg: "#FFF8ED", mark: "#C4A574", plus: "#C4A26A", tape: "rgba(214, 190, 150, 0.72)" },
  { bg: "#FFF0F1", mark: "#E7A3AB", plus: "#E08B96", tape: "rgba(236, 186, 194, 0.78)" },
  { bg: "#EDF8EE", mark: "#7EAE86", plus: "#6A9B72", tape: "rgba(186, 214, 176, 0.78)" },
  { bg: "#F2EEFF", mark: "#A894E0", plus: "#7E68C4", tape: "rgba(198, 186, 230, 0.8)" },
];

const TILTS = [-3, 2, -3, 2];

function visibleCount(width: number) {
  if (width < 768) return 1;
  if (width < 1024) return 2;
  if (width < 1280) return 3;
  return 4;
}

function headingParts(heading: string) {
  const at = heading.toLowerCase().indexOf("creativity");
  if (at <= 0) return { lead: heading, accent: "" };
  return { lead: heading.slice(0, at).trim(), accent: heading.slice(at) };
}

function Burst({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 36 32" fill="none" aria-hidden="true">
      <path d="M7 26c1.2-6 2.4-10 1-16" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M17 28c.6-7 1.4-12 3.2-18" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M27 24c-.4-6-1.6-10 1.4-16" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function Heart({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 28" fill="none" aria-hidden="true">
      <path
        d="M16 24.5C8.2 18.4 3.5 14.2 5.2 8.6 6.6 4.2 11.2 4.4 16 9.2 20.8 4.4 25.4 4.2 26.8 8.6 28.5 14.2 23.8 18.4 16 24.5Z"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Spark({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path d="M16 3.5c.3 5.2.2 7.4 0 11" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" />
      <path d="M16 17.5c.2 4.2-.2 7.2.4 11" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" />
      <path d="M3.5 16c5 .2 7.6-.3 11.2 0" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" />
      <path d="M17.5 16c4.4.3 7.4-.4 11 .3" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" />
    </svg>
  );
}

export default function CommunityStories({ section }: { section: CommunitySectionData }) {
  const items = section.items;
  const { lead, accent } = headingParts(section.heading);
  const [perView, setPerView] = useState(4);
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState<number | null>(null);

  const maxIndex = Math.max(0, items.length - perView);

  useEffect(() => {
    const apply = () => {
      const next = visibleCount(window.innerWidth);
      setPerView(next);
      setIndex((current) => Math.min(current, Math.max(0, items.length - next)));
    };
    apply();
    window.addEventListener("resize", apply);
    return () => window.removeEventListener("resize", apply);
  }, [items.length]);

  const go = (direction: number) => {
    setIndex((current) => Math.min(maxIndex, Math.max(0, current + direction)));
  };

  const onTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    const start = Number(event.currentTarget.dataset.x || 0);
    const startY = Number(event.currentTarget.dataset.y || 0);
    const dx = event.changedTouches[0].clientX - start;
    const dy = event.changedTouches[0].clientY - startY;
    if (Math.abs(dx) < 48 || Math.abs(dx) < Math.abs(dy)) return;
    go(dx < 0 ? 1 : -1);
  };

  return (
    <section className="story-sec" aria-label={section.heading}>
      <div className="nav-width story-wrap">
        <Burst className="story-doodle story-doodle-head" />
        <Heart className="story-doodle story-doodle-head-heart" />

        <div className="story-top">
          <div className="story-copy">
            <p className="story-eyebrow">{section.eyebrow}</p>
            <h2>
              {lead}
              {accent ? <span className="story-accent">{accent}</span> : null}
            </h2>
            <p className="story-sub">{section.subheading}</p>
          </div>
          {/* <div className="story-nav">
            <button type="button" aria-label="Previous stories" onClick={() => go(-1)} disabled={index === 0}>
              <svg viewBox="0 0 20 20" aria-hidden="true">
                <path d="M12.5 4.5 7 10l5.5 5.5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button type="button" className="is-next" aria-label="Next stories" onClick={() => go(1)} disabled={index >= maxIndex}>
              <svg viewBox="0 0 20 20" aria-hidden="true">
                <path d="M7.5 4.5 13 10l-5.5 5.5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div> */}
        </div>

        <div className="story-stage">
          <Burst className="story-doodle story-doodle-burst-left" />
          <Heart className="story-doodle story-doodle-heart" />
          <Burst className="story-doodle story-doodle-burst-right" />
          <Spark className="story-doodle story-doodle-spark" />

          <div
            className="story-viewport"
            data-x="0"
            data-y="0"
            onTouchStart={(event) => {
              event.currentTarget.dataset.x = String(event.touches[0].clientX);
              event.currentTarget.dataset.y = String(event.touches[0].clientY);
            }}
            onTouchEnd={onTouchEnd}
          >
            <div
              className="story-track"
              style={{
                width: `${(items.length / perView) * 100}%`,
                transform: `translate3d(-${index * (100 / items.length)}%, 0, 0)`,
              }}
            >
              {items.map((item, idx) => {
                const look = LOOKS[idx % LOOKS.length];
                const expanded = open === idx;
                return (
                  <div className="story-slide" key={`${item.name}-${idx}`} style={{ width: `${100 / items.length}%` }}>
                    <article
                      className={expanded ? "story-card is-open" : "story-card"}
                      style={{
                        background: look.bg,
                        ["--tilt" as string]: `${TILTS[idx % TILTS.length]}deg`,
                        ["--mark" as string]: look.mark,
                        ["--plus" as string]: look.plus,
                        ["--tape" as string]: look.tape,
                      }}
                    >
                      <span className="story-tape" aria-hidden="true" />
                      <span className="story-mark" aria-hidden="true">
                        &ldquo;
                      </span>
                      <p className="story-quote">&quot;{item.quote}&quot;</p>
                      <div className="story-foot">
                        <p className="story-name">{item.name}</p>
                        <p className="story-city">{item.role}</p>
                      </div>
                      <button
                        type="button"
                        className="story-plus"
                        aria-expanded={expanded}
                        aria-label={expanded ? `Collapse review from ${item.name}` : `Expand review from ${item.name}`}
                        onClick={() => setOpen(expanded ? null : idx)}
                      >
                        <svg viewBox="0 0 16 16" aria-hidden="true">
                          <path d="M8 3.2v9.6M3.2 8h9.6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                        </svg>
                      </button>
                    </article>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
