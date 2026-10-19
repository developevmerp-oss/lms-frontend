import Link from "next/link";
import { ArrowRight, BookOpen, Briefcase, Gem, GraduationCap, Package, Play, ShieldCheck, Sparkles, Star, Trophy, Users } from "lucide-react";

const ACCENT = "#e36b32";

const FEATURES = [
  { icon: Briefcase, label: "6+ Years Professional Experience" },
  { icon: Trophy, label: "Nationally Recognized Art Coach" },
  { icon: Users, label: "Step-by-Step Business Frameworks" },
  { icon: Gem, label: "Hands-On Lifetime Community" },
];

const STATS = [
  { icon: GraduationCap, value: "54K+", label: "Students" },
  { icon: Package, value: "8K+", label: "Orders" },
  { icon: Star, value: "5.0 ★", label: "Google" },
];

const ACCOLADES = [
  {
    image: "/images/mentor/hall-of-fame-award.jpg",
    alt: "Vrajangna Patel Hall of Fame Award",
    badge: "Hall of Fame Award",
    icon: Trophy,
    title: "Hall of Fame Felicitation 2022–23",
    tag: "Freedom Retreat",
    text: "Awarded national stage recognition by India's leading coach Siddharth Rajsekar at Freedom Retreat for establishing one of the country's most vibrant and student-centric creative academies.",
    position: "object-top",
  },
  {
    image: "/images/mentor/diamond-award.jpg",
    alt: "Vrajangna Patel Diamond Awards",
    badge: "Diamond Club Felicitation",
    icon: Gem,
    title: "Diamond Club Top Mentor Award",
    tag: "Elite Recognition",
    text: "Felicitated with the Diamond status for impacting thousands of households by teaching high-margin resin craft, floral preservation, and order fulfillment systems.",
    position: "object-top",
  },
  {
    image: "/images/mentor/author-feature.jpg",
    alt: "Vrajangna Patel Published Author",
    badge: "Published Author",
    icon: BookOpen,
    title: 'Authored in "I Can Coach" Book',
    tag: "Published Work",
    text: "Featured alongside top educators nationwide, detailing her transformation from crafting at a small kitchen table to operating a premier art academy and mentoring 54,000+ creators.",
    position: "object-center",
  },
  {
    image: "/images/mentor/live-workshop.jpg",
    alt: "Vrajangna Patel Live Workshop Mentorship",
    badge: "Live Interactive Coaching",
    icon: Users,
    title: "Weekly Live Sessions & Personal Feedback",
    tag: "Hands-on Support",
    text: "Every student receives real-time guidance, artwork critique, formula troubleshooting, and client pricing blueprints directly in our interactive live workshops and community calls.",
    position: "object-top",
  },
];

export default function MentorAboutSec() {
  return (
    <section id="mentor" className="relative z-10 scroll-mt-28 py-16 sm:py-20 lg:py-24">
      <div className="nav-width relative">
        <div className="coach-rise mx-auto max-w-3xl text-center">
          <p className="inline-flex items-center justify-center gap-2 text-[11px] font-semibold tracking-[0.22em] uppercase" style={{ color: ACCENT }}>
            <Sparkles size={13} />
            Proven Track Record &amp; Coaching
          </p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-stone-950 sm:text-4xl lg:text-5xl">
            Meet Vrajangna — Your Resin Art &amp; <span className="whitespace-nowrap" style={{ color: ACCENT }}>Business Coach</span>
          </h2>
        </div>

        <div className="coach-rise mt-10 grid grid-cols-1 items-stretch gap-4 sm:mt-12 lg:grid-cols-[minmax(16.5rem,21rem)_1fr] lg:gap-5">
          <figure className="group relative m-0 h-[26rem] overflow-hidden rounded-[1.75rem] shadow-[0_24px_50px_-36px_rgba(140,60,20,0.55)] sm:h-[30rem] lg:h-auto lg:min-h-full">
            <img
              src="/images/mentor/vrajangna-portrait.jpg"
              alt="Vrajangna Patel - Resin Art & Business Coach"
              className="coach-photo absolute inset-0 h-full w-full object-cover object-[center_18%]"
            />
            <figcaption className="absolute inset-x-3 bottom-3 rounded-2xl bg-white px-3.5 py-3 text-stone-950 shadow-[0_12px_30px_-16px_rgba(20,10,5,0.45)] sm:inset-x-4 sm:bottom-4">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <div className="truncate text-base font-bold text-stone-950">Vrajangna Patel</div>
                    <ShieldCheck size={15} className="shrink-0" style={{ color: ACCENT }} />
                  </div>
                  <div className="mt-0.5 text-[12px] font-medium text-stone-500">Founder &amp; Resin Art Business Coach</div>
                </div>
                <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[#fff1e8] px-2.5 py-1 text-[10px] font-bold tracking-wide uppercase" style={{ color: ACCENT }}>
                  <Star size={11} className="fill-current" />
                  Mentor
                </span>
              </div>
            </figcaption>
          </figure>

          <div className="flex flex-col rounded-[1.75rem] border border-[#f3d3bf] bg-white px-5 py-6 shadow-[0_24px_50px_-36px_rgba(140,60,20,0.35)] sm:px-7 sm:py-7 lg:px-8 lg:py-8">
            <blockquote>
              <p
                className="text-[1.15rem] leading-snug text-stone-800 sm:text-[1.35rem]"
                style={{ fontFamily: '"Iowan Old Style", Palatino, "Palatino Linotype", Georgia, serif' }}
              >
                “ Every woman deserves the opportunity to create an identity beyond the roles she plays for everyone else.
              </p>
              <cite className="mt-3 block text-[12px] font-semibold not-italic" style={{ color: ACCENT }}>
                — Vrajangna Patel, Lead Mentor
              </cite>
            </blockquote>

            <div className="mt-5 space-y-3 text-sm leading-relaxed text-stone-600 sm:text-[15px]">
              <p>
                I&apos;m Vrajangna Patel, founder of Ravishing Art Hub and a dedicated Resin Art Business Coach. Over the past 6+ years, I&apos;ve transformed my passion for resin craft into an award-winning creative enterprise — and guided over <strong className="font-semibold text-stone-950">54,000+ creators</strong> across India and abroad.
              </p>
              <p>
                My goal isn&apos;t just to teach you how to make Resin Art. My goal is to help you believe that your creativity can become something meaningful, valuable and truly yours — whether you want to start a side-income or build a recognized premium brand.
              </p>
            </div>

            <ul className="mt-5 grid grid-cols-1 gap-x-6 gap-y-2.5 sm:grid-cols-2">
              {FEATURES.map((feature) => (
                <li key={feature.label} className="flex items-center gap-2.5">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#fff1e8]" style={{ color: ACCENT }}>
                    <feature.icon size={15} strokeWidth={1.8} />
                  </span>
                  <span className="text-[13px] leading-snug font-medium text-stone-700">{feature.label}</span>
                </li>
              ))}
            </ul>

            <div className="mt-6 flex flex-col gap-4 border-t border-[#f6e4d6] pt-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="grid flex-1 grid-cols-3 gap-2 sm:max-w-sm">
                {STATS.map((stat) => (
                  <div key={stat.label}>
                    <div className="text-lg font-bold tracking-tight text-stone-950 sm:text-xl">{stat.value}</div>
                    <div className="text-[10px] font-medium tracking-wide text-stone-500 uppercase">{stat.label}</div>
                  </div>
                ))}
              </div>
              <Link
                href="/webinar"
                className="group inline-flex shrink-0 items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-bold text-white shadow-[0_14px_28px_-16px_rgba(227,107,50,0.95)] transition-transform duration-300 hover:-translate-y-0.5 active:translate-y-0"
                style={{ backgroundColor: ACCENT }}
              >
                <Play size={14} className="fill-white" />
                <span>Join Live Masterclass</span>
                <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>

        <ol className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
          {ACCOLADES.map((item, index) => (
            <li key={item.title} className="h-full">
              <article
                className="coach-rise group grid h-full grid-cols-1 overflow-hidden rounded-[1.5rem] border border-[#f3d3bf] bg-white shadow-[0_16px_36px_-28px_rgba(120,60,20,0.4)] transition-shadow duration-300 hover:shadow-[0_20px_36px_-22px_rgba(160,70,20,0.35)] sm:grid-cols-[10.5rem_1fr]"
              >
                <div className="relative h-56 overflow-hidden sm:h-auto sm:min-h-[12.5rem]">
                  <img src={item.image} alt={item.alt} className={`coach-photo absolute inset-0 h-full w-full object-cover ${item.position}`} />
                  <span className="absolute top-3 left-3 inline-flex h-7 min-w-7 items-center justify-center rounded-full bg-white px-2 text-[11px] font-bold text-stone-800 shadow-sm">
                    0{index + 1}
                  </span>
                </div>
                <div className="flex flex-1 flex-col justify-center p-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-wide uppercase" style={{ color: ACCENT }}>
                      <item.icon size={13} />
                      {item.badge}
                    </span>
                    <span className="rounded-full bg-[#fff1e8] px-2.5 py-0.5 text-[11px] font-semibold text-stone-600">{item.tag}</span>
                  </div>
                  <h3 className="mt-2 text-lg font-bold leading-snug text-stone-950">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-stone-500">{item.text}</p>
                </div>
              </article>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
