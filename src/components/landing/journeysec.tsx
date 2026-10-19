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
                className={`journey-card journey-wash-${idx} relative flex h-full flex-col overflow-hidden rounded-[1.75rem] p-6 sm:p-7 ${isDark ? "journey-card-dark" : "journey-card-light"}`}
              >
                <span className="journey-glow" aria-hidden="true" />
                <div className="relative z-10 flex h-full flex-col">
                  {isMainL3 && (
                    <span className="journey-cert mb-3 inline-flex w-fit rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider">
                      ★ MAIN CERTIFICATION
                    </span>
                  )}
                  <p className="journey-level text-[10px] font-bold uppercase tracking-wider">
                    {card.badgeTag}
                  </p>
                  <h3 className="journey-title mt-2 text-2xl font-bold leading-tight">
                    {levelName}
                  </h3>
                  <p className="journey-price mt-4 text-3xl font-black tracking-tight whitespace-nowrap sm:text-4xl lg:text-3xl">
                    {price}
                  </p>
                  <p className="journey-desc mt-3 text-sm leading-relaxed">
                    {levelDesc}
                  </p>
                  <Link
                    href={card.buttonHref}
                    className="journey-btn mt-6 inline-flex w-full items-center justify-center gap-2 px-4 py-3.5 text-sm font-semibold"
                  >
                    {card.buttonText}
                    <ArrowRight size={15} aria-hidden="true" />
                  </Link>
                  <ul className="mt-6 space-y-2.5">
                    {visibleHighlights.map((h, hIdx) => (
                      <li key={hIdx} className="journey-feature flex items-start gap-2 text-sm">
                        <span className="journey-check mt-0.5" aria-hidden="true">✓</span>
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
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
