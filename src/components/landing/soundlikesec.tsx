"use client";

import { useEffect, useRef, useState } from "react";
import { Lightbulb, Palette, Target, type LucideIcon } from "lucide-react";

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

type SoundCard = {
  stage: string;
  label: string;
  title: string;
  description: string;
  solution: string;
  stageClass: string;
  wash: string;
  icon: string;
  photo: string;
  photoPosition: string;
  stickerClass: string;
  TabIcon: LucideIcon;
};

const CARDS: SoundCard[] = [
  {
    stage: "01",
    label: "The Explorer",
    title: "You Love Creating, But You Don't Know What To Focus On.",
    description:
      "You keep learning different techniques from scattered videos but still feel confused about what you should master next to make real progress.",
    solution: "Structured Step-by-Step Curriculum",
    stageClass: "sound-stage-explorer",
    wash: "sound-wash-explorer",
    icon: "/images/sound-like/explorer.png",
    photo: "/images/sound-like/explorer-studio.jpg",
    photoPosition: "center center",
    stickerClass: "is-tr",
    TabIcon: Lightbulb,
  },
  {
    stage: "02",
    label: "The Creator",
    title: "You Create Beautiful Work, But You're Not Getting Consistent Orders.",
    description:
      "You know your creations have value, but you don't know how to consistently attract the right customers and convert your creativity into predictable income.",
    solution: "Client Acquisition & Order Pricing",
    stageClass: "sound-stage-creator",
    wash: "sound-wash-creator",
    icon: "/images/sound-like/creator.png",
    photo: "/images/sound-like/creator-studio.jpg",
    photoPosition: "center 22%",
    stickerClass: "is-bl",
    TabIcon: Palette,
  },
  {
    stage: "03",
    label: "The Visionary",
    title: "You Want Your Own Identity and Income—Not Another Hobby.",
    description:
      "You want people to recognise you for your talent, you want something that is truly yours and you want your creativity to contribute to your financial freedom.",
    solution: "Signature Brand & Lifetime Mentorship",
    stageClass: "sound-stage-visionary",
    wash: "sound-wash-visionary",
    icon: "/images/sound-like/visionary.png",
    photo: "/images/sound-like/visionary-studio.jpg",
    photoPosition: "center 28%",
    stickerClass: "is-bc",
    TabIcon: Target,
  },
];

function clamp01(value: number) {
  return Math.min(1, Math.max(0, value));
}

function easeOutCubic(value: number) {
  return 1 - (1 - value) ** 3;
}

function segment(progress: number, start: number, end: number) {
  return easeOutCubic(clamp01((progress - start) / (end - start)));
}

function SoundHeading({ headingRef }: { headingRef?: React.RefObject<HTMLDivElement | null> }) {
  return (
    <div ref={headingRef} className="mx-auto max-w-3xl text-center">
      <p className="text-xs sm:text-base lg:text-xs font-semibold uppercase tracking-[0.18em] text-[#942008]">Self Reflection</p>
      <h2 className="mt-3 text-3xl font-black tracking-tight text-neutral-950 sm:text-5xl lg:text-5xl">
        Does This Sound Like <span className="text-[#942008]">You?</span>
      </h2>
      <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-neutral-600 sm:text-xl lg:text-base">
        Recognize where you are right now so we can guide you to where you want to be.
      </p>
    </div>
  );
}

function StackFace({ item }: { item: SoundCard }) {
  return (
    <div className="sound-stack-swap">
      <div className="sound-stack-copy">
        <p className="sound-stack-kicker">Stage {item.stage}</p>
        <h3 className="sound-stack-title">{item.title}</h3>
        <p className="sound-stack-desc">{item.description}</p>
        <p className="sound-stack-solution">
          <span className="sound-stack-check" aria-hidden="true">
            ✓
          </span>
          <span>Solution: {item.solution}</span>
        </p>
      </div>
      <div className="sound-stack-photo">
        <img
          src={item.photo}
          alt={item.label}
          className="sound-stack-shot"
          style={{ objectPosition: item.photoPosition }}
        />
        {/* <img src={item.icon} alt="" className={`sound-stack-sticker ${item.stickerClass}`} /> */}
      </div>
    </div>
  );
}

export default function SoundLikeSec() {
  const pinRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [activeStage, setActiveStage] = useState(0);
  const [tabOffsets, setTabOffsets] = useState<number[]>([0, 180, 360]);

  // Dynamically measure tab widths so tabs align neatly side-by-side
  useEffect(() => {
    const updateOffsets = () => {
      const isMobile = window.innerWidth < 1024;
      const gap = isMobile ? 8 : 12;
      const w0 = tabRefs.current[0]?.offsetWidth || (isMobile ? 110 : 165);
      const w1 = tabRefs.current[1]?.offsetWidth || (isMobile ? 110 : 165);
      setTabOffsets([0, w0 + gap, w0 + gap + w1 + gap]);
    };
    updateOffsets();
    window.addEventListener("resize", updateOffsets);
    return () => window.removeEventListener("resize", updateOffsets);
  }, []);

  useEffect(() => {
    const pin = pinRef.current;
    if (!pin) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setActiveStage(CARDS.length - 1);
      return;
    }

    let frame = 0;
    const update = () => {
      const travel = pin.offsetHeight - window.innerHeight;
      if (travel <= 0) return;
      const scrolled = Math.min(Math.max(-pin.getBoundingClientRect().top, 0), travel);
      const progress = scrolled / travel;

      // Calculate bottom entry distance from below the viewport
      const vh = window.innerHeight;
      const stageRect = stageRef.current?.getBoundingClientRect();
      const restingTop = stageRect ? stageRect.top : 220;
      const enterDistance = Math.max(vh - restingTop + 80, 750);

      // Smooth, natural card entrance timing
      // Card 1 (The Creator) enters from bottom between 0.04 and 0.24
      const second = segment(progress, 0.04, 0.24);
      // Card 2 (The Visionary) enters from bottom between 0.26 and 0.48
      const third = segment(progress, 0.26, 0.48);

      const shift1 = (1 - second) * enterDistance;
      const shift2 = (1 - third) * enterDistance;

      const card1 = cardRefs.current[1];
      const card2 = cardRefs.current[2];
      if (card1) {
        card1.style.transform = `translate3d(0, ${shift1.toFixed(2)}px, 0)`;
      }
      if (card2) {
        card2.style.transform = `translate3d(0, ${shift2.toFixed(2)}px, 0)`;
      }

      // Card sticks and is covered: when card 1 sticks, stage 0 is behind.
      // When card 2 sticks, stage 0 and 1 are behind.
      const currentActive = third >= 0.85 ? 2 : second >= 0.85 ? 1 : 0;
      setActiveStage(currentActive);
    };

    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const handleTabClick = (index: number) => {
    const pin = pinRef.current;
    if (!pin) return;
    const travel = pin.offsetHeight - window.innerHeight;
    const targetProgress = index === 0 ? 0.01 : index === 1 ? 0.24 : 0.48;
    const pinTop = pin.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: pinTop + travel * targetProgress, behavior: "smooth" });
  };

  return (
    <section className="sound-like-sec relative z-10 text-neutral-950">
      <div className="sound-scallop-top" aria-hidden="true" />
      <div className="sound-like-fill" aria-hidden="true" />

      {/* Mobile and Tablet view (< lg): Clean simple cards with natural gap before mentor section */}
      <div className="nav-width relative z-[1] pt-16 sm:pt-20 pb-20 sm:pb-28 lg:hidden">
        <SoundHeading />
        <div className="mt-10 flex flex-col gap-6 sm:mt-12 sm:gap-7">
          {CARDS.map((item) => (
            <article
              key={item.stage}
              className="sound-simple-card"
            >
              <div className="sound-simple-photo">
                <img
                  src={item.photo}
                  alt=""
                  style={{ objectPosition: item.photoPosition }}
                />
              </div>
              <div className="sound-simple-body">
                <div className="flex items-center justify-between gap-3">
                  {/* <span className="sound-option-num flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold">
                    {Number(item.stage)}
                  </span> */}
                  <span
                    className={`sound-option-pill rounded-full px-3 py-1 text-xs sm:text-sm font-semibold uppercase tracking-[0.12em] ${item.stageClass}`}
                  >
                    Stage: {item.label}
                  </span>
                </div>
                <h3 className="sound-title mt-4 text-xl font-bold leading-snug sm:text-[1.65rem]">
                  {item.title}
                </h3>
                <p className="sound-muted mt-3 text-sm leading-relaxed sm:text-lg">
                  {item.description}
                </p>
                <p className="sound-option-solution mt-5 inline-flex items-start gap-2 text-sm sm:text-base font-semibold leading-snug">
                  <span className="sound-option-check mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[10px]">
                    ✓
                  </span>
                  Solution: {item.solution}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Desktop view (lg+) */}
      <div ref={pinRef} className="sound-pin hidden lg:block">
        <div className="sound-pin-sticky">
          <div className="nav-width w-full">
            <SoundHeading headingRef={headingRef} />
            <div ref={stageRef} className="sound-stack">
              <div className="sound-stack-cards-wrap relative">
                {CARDS.map((item, index) => {
                  const Icon = item.TabIcon;
                  const isActive = activeStage === index;
                  const isBehind = index < activeStage;
                  return (
                    <article
                      key={item.stage}
                      ref={(node) => {
                        cardRefs.current[index] = node;
                      }}
                      className={`sound-stack-card${index > 0 ? " is-stacked" : ""}${isBehind ? " is-behind" : ""}`}
                      style={{
                        zIndex: index + 1,
                      }}
                      aria-hidden={!isActive}
                    >
                      {/* Attached tab for this folder card */}
                      <div
                        className="sound-card-tab-wrap"
                        style={{
                          paddingLeft: `calc(2rem + ${tabOffsets[index]}px)`,
                          ["--tab-offset" as any]: `${tabOffsets[index]}px`,
                        }}
                      >
                        <button
                          type="button"
                          ref={(node) => {
                            tabRefs.current[index] = node;
                          }}
                          onClick={() => handleTabClick(index)}
                          className={`sound-stack-tab${isActive ? " is-active" : ""}`}
                          aria-label={`Jump to stage ${item.stage}: ${item.label}`}
                        >
                          <Icon size={15} strokeWidth={2.4} aria-hidden="true" />
                          <span>{item.label}</span>
                        </button>
                      </div>

                      {/* Card Body with exactly unchanged StackFace */}
                      <div className="sound-stack-card-body">
                        <StackFace item={item} />
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="sound-scallop-foot hidden lg:block" aria-hidden="true" />
    </section>
  );
}
