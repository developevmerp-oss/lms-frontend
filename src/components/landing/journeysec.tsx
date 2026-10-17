import Link from "next/link";
import { ArrowRight } from "lucide-react";

type LevelTier = {
  code?: string;
  name?: string;
  description?: string;
  price?: string;
};

type LevelCourse = {
  levelCode?: string;
  level?: string;
  title: string;
};

const CARDS = [
  {
    code: "L0",
    badgeTag: "LEVEL 0",
    defaultName: "Fast Track",
    defaultDesc: "Begin your Resin Art journey, understand the fundamentals and create your first beautiful pieces with confidence.",
    defaultHighlights: ["FastTrack Starter Toolkit", "Basic Epoxy Chemistry", "First 3 Practical Pours"],
    buttonText: "Explore Fast Track",
    buttonHref: "/webinar",
    isPopular: false,
  },
  {
    code: "L1",
    badgeTag: "LEVEL 1",
    defaultName: "Silver Membership",
    defaultDesc: "Go deeper into techniques, creativity, portfolio building and the skills required to take your art seriously.",
    defaultHighlights: ["Coasters, Fridge Magnets, Keychains", "Marbling & Evil Eye Techniques", "Ocean Lacing & Lotus Pond"],
    buttonText: "Explore Level 1",
    buttonHref: "/register",
    isPopular: false,
  },
  {
    code: "L2",
    badgeTag: "LEVEL 2",
    defaultName: "Gold Membership",
    defaultDesc: "Develop advanced skills, strengthen your personal brand, understand business and build a sustainable path around your creativity.",
    defaultHighlights: ["Geode Art & Vein Effects", "Tree of Life Clocks", "3D Waves & Client Acquisition"],
    buttonText: "Explore Level 2",
    buttonHref: "/webinar",
    isPopular: false,
  },
  {
    code: "L3",
    badgeTag: "LEVEL 3",
    defaultName: "Renaissance Certification",
    defaultDesc: "Take your skills, portfolio, business knowledge and personal growth to the highest level through structured milestones and certification.",
    defaultHighlights: ["3D Photo Resin Art", "Wood & Resin River Tables", "Floral Preservation & Mantras"],
    buttonText: "Apply for Certification",
    buttonHref: "/webinar",
    isPopular: true,
  },
];

export default function JourneySec({
  levelTiers,
  levelCourses,
}: {
  levelTiers: LevelTier[];
  levelCourses: LevelCourse[];
}) {
  return (
    <section id="membership" className="journey-sec relative z-10 flex items-center bg-white py-16 sm:py-20 lg:overflow-hidden lg:pt-20">
      <div className="container mx-auto w-full px-5 sm:px-10 lg:px-10 2xl:px-0">
        <div className="mb-8 max-w-2xl sm:mb-10 lg:mb-3">
          <p className="journey-kicker text-xs font-semibold uppercase tracking-widest text-orange-500">
            Level Progression
          </p>
          <h2 className="journey-heading mt-3 text-3xl font-black tracking-tight sm:text-4xl lg:mt-2 lg:text-4xl lg:leading-tight">
            Choose Your Ravishing Journey
          </h2>
          <p className="journey-muted mt-4 text-sm leading-relaxed sm:text-base lg:mt-2">
            Wherever you are today, there is a next step for you.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
          {CARDS.map((card, idx) => {
            const dbLevel = levelTiers.find((l) => (l.code || "").toUpperCase() === card.code);
            const dynamicCourses = levelCourses.filter(
              (c) => (c.levelCode || c.level || "").toUpperCase() === card.code
            );

            const levelName = dbLevel?.name || card.defaultName;
            const levelDesc = dbLevel?.description || card.defaultDesc;

            const allHighlights = dynamicCourses.length > 0
              ? dynamicCourses.map((c) => c.title.replace(/^\d+\.\s*/, ""))
              : card.defaultHighlights;

            const visibleHighlights = allHighlights.slice(0, 3);
            const remainingCount = allHighlights.length > 3 ? allHighlights.length - 3 : 0;

            const isMainL3 = card.isPopular || card.code === "L3";
            const isDark = idx === 0 || idx === 3;
            const price = dbLevel?.price || (card.code === "L0" ? "₹499" : card.code === "L1" ? "₹4,999" : card.code === "L2" ? "₹19,999" : card.code === "L3" ? "₹59,999" : "Custom");

            return (
              <article
                key={idx}
                className={`journey-card journey-wash-${idx} relative flex flex-col justify-between overflow-hidden rounded-[1.75rem] p-5 sm:p-6 lg:p-5 ${isDark ? "journey-card-dark" : "journey-card-light"}`}
              >
                <span className="journey-glow" aria-hidden="true" />
                {isMainL3 && (
                  <span className="journey-cert relative z-10 mb-4 inline-flex w-fit rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider lg:mb-2 lg:py-0.5">
                    ★ MAIN CERTIFICATION
                  </span>
                )}

                <div className="relative z-10">
                  <p className="journey-level text-[10px] font-bold uppercase tracking-wider">
                    {card.badgeTag}
                  </p>
                  <div className="mt-2 flex items-start justify-between gap-2 lg:mt-1">
                    <h3 className="journey-title min-w-0 text-2xl font-bold leading-tight sm:text-3xl lg:text-lg">
                      {levelName}
                    </h3>
                    <p className="journey-price shrink-0 whitespace-nowrap text-xl font-bold sm:text-2xl lg:text-lg">
                      {price}
                    </p>
                  </div>
                  <p className="journey-desc mt-3 text-sm leading-relaxed lg:mt-2 lg:leading-snug">
                    {levelDesc}
                  </p>

                  <ul className="mt-4 space-y-1.5 lg:mt-2 lg:space-y-1">
                    {visibleHighlights.map((h, hIdx) => (
                      <li key={hIdx} className="journey-feature flex items-start gap-2 text-sm">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full" />
                        <span>{h}</span>
                      </li>
                    ))}
                    {remainingCount > 0 && (
                      <li className="journey-more pt-1 text-xs font-semibold">
                        + {remainingCount} More Modules Included
                      </li>
                    )}
                  </ul>
                </div>

                <Link
                  href={card.buttonHref}
                  className="journey-btn relative z-10 mt-5 inline-flex w-fit max-w-full items-center gap-2 rounded-full py-1.5 pr-4 pl-1.5 text-sm font-semibold lg:mt-4 lg:pr-3 lg:text-[13px]"
                >
                  <span className="journey-btn-icon flex h-7 w-7 items-center justify-center rounded-full">
                    <ArrowRight size={14} />
                  </span>
                  {card.buttonText}
                </Link>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
