import Link from "next/link";
import { ArrowRight, BookOpen, Briefcase, Gem, GraduationCap, Heart, Package, Play, ShieldCheck, Sparkles, Star, Trophy, Users } from "lucide-react";

const ACCENT = "#e36b32";

const FEATURES = [
  { icon: Briefcase, label: "6+ Years Professional Experience" },
  { icon: Trophy, label: "Nationally Recognized Art Coach" },
  { icon: Users, label: "Step-by-Step Business Frameworks" },
  { icon: Gem, label: "Hands-On Lifetime Community" },
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

function AccoladeCard({ item }: { item: (typeof ACCOLADES)[number] }) {
  return (
    <article className="overflow-hidden rounded-[1.4rem] border border-[#f6e4d6] bg-white text-stone-950 shadow-[0_16px_40px_-28px_rgba(120,60,20,0.45)] transition-all duration-300 hover:border-[#e36b32]/50">
      <div className="group relative h-56 overflow-hidden sm:h-64">
        <img src={item.image} alt={item.alt} className={`h-full w-full object-cover ${item.position} transition-transform duration-700 ease-out group-hover:scale-105`} />
        <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-stone-950/90 px-3 py-1.5 text-[11px] font-bold tracking-wide text-white uppercase">
          <item.icon size={13} className="text-amber-300" />
          {item.badge}
        </span>
      </div>
      <div className="space-y-2 p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-lg font-bold text-stone-950 sm:text-xl">{item.title}</h3>
          <span className="inline-flex items-center gap-1 rounded-full border border-[#f3c7a8] px-3 py-1 text-xs font-semibold" style={{ color: ACCENT }}>
            {item.tag}
            <ArrowRight size={12} />
          </span>
        </div>
        <p className="text-sm leading-relaxed text-stone-500">{item.text}</p>
      </div>
    </article>
  );
}

export default function MentorAboutSec() {
  return (
    <section id="mentor" className="relative z-10 bg-[#fff8f4] py-16 sm:py-20 lg:py-24">
      <div className="pointer-events-none absolute -left-24 top-24 h-72 w-72 rounded-full bg-[#fde4d2] blur-3xl" />
      <div className="pointer-events-none absolute right-0 bottom-10 h-80 w-80 rounded-full bg-[#fff0e4] blur-3xl" />

      <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-start gap-8 px-4 sm:px-6 lg:grid-cols-12 lg:gap-10">
        <div className="lg:sticky lg:top-28 lg:col-span-5 lg:self-start">
          <div className="rounded-[1.75rem] border border-[#f3c7a8] bg-white p-4 text-stone-950 shadow-[0_18px_50px_-28px_rgba(180,80,20,0.45)] sm:p-5">
            <div className="group relative mb-4">
              <div className="relative aspect-[4/4.7] overflow-hidden rounded-[1.35rem]">
                <img
                  src="/images/mentor/vrajangna-portrait.jpg"
                  alt="Vrajangna Patel - Resin Art & Business Coach"
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-x-3 bottom-3 flex items-center justify-between gap-3 rounded-xl bg-stone-950/85 px-3 py-2.5 text-white shadow-lg backdrop-blur-md">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-sm font-bold text-white sm:text-base">Vrajangna Patel</h3>
                      <ShieldCheck size={15} className="text-orange-400" />
                    </div>
                    <p className="text-[11px] font-medium text-orange-200">Founder &amp; Resin Art Business Coach</p>
                  </div>
                  <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-amber-500/20 px-2.5 py-1 text-[10px] font-bold tracking-wide text-amber-100 uppercase ring-1 ring-amber-300/40">
                    <Star size={11} className="fill-amber-300 text-amber-300" />
                    Mentor
                  </span>
                </div>
              </div>
              <Sparkles size={18} className="pointer-events-none absolute -top-1 right-2" style={{ color: ACCENT }} />
              <Sparkles size={12} className="pointer-events-none absolute top-7 right-0" style={{ color: ACCENT }} />
              <Heart size={18} className="pointer-events-none absolute right-1 bottom-16" style={{ color: ACCENT }} />
            </div>

            <div className="mb-4 grid grid-cols-3 gap-2 text-center">
              {[
                { icon: GraduationCap, value: "54K+", label: "Students" },
                { icon: Package, value: "8K+", label: "Orders" },
                { icon: Star, value: "5.0 ★", label: "Google" },
              ].map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-[#f6e4d6] bg-[#fffaf7] px-2 py-3">
                  <stat.icon size={16} className="mx-auto mb-1" style={{ color: ACCENT }} />
                  <p className="text-base font-bold">
                    <span className="text-orange-400">{stat.value}</span>
                  </p>
                  <p className="text-[10px] font-medium tracking-wide text-stone-400 uppercase">{stat.label}</p>
                </div>
              ))}
            </div>

            <blockquote className="mb-4 px-1">
              <p className="text-[13px] leading-relaxed text-stone-600 italic">
                <span className="mr-1 font-serif text-lg not-italic" style={{ color: ACCENT }}>
                  “
                </span>
                Every woman deserves the opportunity to create an identity beyond the roles she plays for everyone else.
              </p>
              <cite className="mt-2 block text-[12px] font-semibold not-italic" style={{ color: ACCENT }}>
                — Vrajangna Patel, Lead Mentor
              </cite>
            </blockquote>

            <Link
              href="/webinar"
              className="group flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-bold text-white shadow-[0_12px_24px_-14px_rgba(227,107,50,0.9)] transition-all hover:scale-[1.02] active:scale-[0.98]"
              style={{ backgroundColor: ACCENT }}
            >
              <Play size={14} className="fill-white" />
              <span>Join Live Masterclass</span>
              <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        <div className="space-y-6 lg:col-span-7">
          <div className="rounded-[1.6rem] border border-[#f6e4d6] bg-white p-5 text-stone-950 shadow-[0_16px_40px_-28px_rgba(120,60,20,0.45)] sm:p-7">
            <div>
              <div className="flex items-center gap-3 text-[11px] font-semibold tracking-[0.22em] uppercase" style={{ color: ACCENT }}>
                <span className="h-px w-8 bg-[#f0b48a]" />
                <Sparkles size={13} className="animate-pulse" />
                Proven Track Record &amp; Coaching
              </div>
              <h2
                className="mt-3 text-[1.7rem] leading-[1.15] font-semibold tracking-tight text-stone-950 sm:text-[2.05rem]"
                style={{ fontFamily: '"Iowan Old Style", Palatino, "Palatino Linotype", Georgia, serif' }}
              >
                Meet Vrajangna — Your Resin Art &amp; <span className="italic" style={{ color: ACCENT }}>Business Coach</span>
              </h2>
            </div>

            <div className="mt-4 max-w-xl space-y-4 text-sm leading-relaxed text-stone-600 sm:text-[15px]">
              <p>
                I'm Vrajangna Patel, founder of Ravishing Art Hub and a dedicated Resin Art Business Coach. Over the past 6+ years, I've transformed my passion for resin craft into an award-winning creative enterprise — and guided over <strong className="font-bold text-orange-400">54,000+ creators</strong> across India and abroad.
              </p>
              <p>
                My goal isn't just to teach you how to make Resin Art. My goal is to help you believe that your creativity can become something meaningful, valuable and truly yours — whether you want to start a side-income or build a recognized premium brand.
              </p>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-x-3 gap-y-4 lg:grid-cols-4">
              {FEATURES.map((feature) => (
                <div key={feature.label} className="flex items-center gap-2.5">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#fff1e8]" style={{ color: ACCENT }}>
                    <feature.icon size={17} strokeWidth={1.7} />
                  </span>
                  <p className="text-left text-[12px] leading-snug font-medium text-stone-600">{feature.label}</p>
                </div>
              ))}
            </div>
          </div>

          {ACCOLADES.map((item) => (
            <AccoladeCard key={item.title} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
