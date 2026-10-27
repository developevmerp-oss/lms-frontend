import { CheckCircle2, MessageCircle, Palette, Trophy, Users } from "lucide-react";

const SUPPORTS = [
  { title: "Ask Questions", desc: "Get instant doubt resolution", icon: MessageCircle, color: "text-orange-400", bgColor: "bg-orange-500/10", image: "/images/community/ask-questions.jpg" },
  { title: "Share Creations", desc: "Showcase your newest pours", icon: Palette, color: "text-pink-400", bgColor: "bg-pink-500/10", image: "/images/community/share-creations.jpg" },
  { title: "Get Feedback", desc: "Constructive mentor critiques", icon: CheckCircle2, color: "text-cyan-400", bgColor: "bg-cyan-500/10", image: "/images/community/get-feedback.jpg" },
  { title: "Celebrate Milestones", desc: "Cheer each other's wins", icon: Trophy, color: "text-emerald-400", bgColor: "bg-emerald-500/10", image: "/images/community/celebrate-milestones.jpg" },
  { title: "Learn Together", desc: "Collaborate with peers", icon: Users, color: "text-purple-400", bgColor: "bg-purple-500/10", image: "/images/community/learn-together.jpg" },
];

export default function SisterhoodSec() {
  return (
    <section
      id="community"
      className="sisterhood-sec relative z-20 py-16 sm:py-20 lg:py-24"
      style={{
        backgroundColor: "#ffffff",
        backgroundImage: "radial-gradient(circle, #e2ded4 1.5px, transparent 1.5px)",
        backgroundSize: "24px 24px",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="nav-width page-rise">
        <div className="mx-auto mb-12 max-w-3xl text-center sm:mb-16">
          <span className="mb-2 block text-xs font-black uppercase tracking-widest text-orange-400">Sisterhood &amp; Support</span>
          <h2 className="mb-4 text-3xl font-black text-black sm:text-4xl lg:text-5xl">
            You Don't Have To Build Alone.
          </h2>
          <p className="text-base leading-relaxed text-slate-400 sm:text-lg">
            The journey becomes easier when you're surrounded by women who understand your dreams, your struggles and your ambition. Inside Ravishing Art Hub, you don't just learn from a coach. You learn, create, share, celebrate and grow together.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-x-8 gap-y-10 sm:gap-x-10 lg:gap-x-14">
          {SUPPORTS.map((item) => (
            <article key={item.title} className="sister-item w-[140px] text-center sm:w-[150px]">
              <div className="sister-tile rounded-[28px] overflow-hidden shadow-md">
                <img src={item.image} alt="" className="rounded-[28px]" />
              </div>
              <div className="pt-5">
                <p className="text-xl font-bold text-black">{item.title}</p>
                <p className="mt-1 text-base text-slate-400">{item.desc}</p>
              </div>
            </article>
          ))}
        </div>

        {/*
        <div className="grid grid-cols-1 gap-x-4 gap-y-10 pt-6 sm:grid-cols-2 lg:grid-cols-5">
          {SUPPORTS.map((item) => {
            const Icon = item.icon;
            return (
              <article
                key={item.title}
                className="group relative rounded-2xl border border-gray-200 bg-white px-4 pb-6 pt-8 text-center shadow-lg transition-all duration-300 hover:-translate-y-1.5 hover:border-orange-500/50"
              >
                <div className={`absolute top-0 left-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-110 ${item.color} ${item.bgColor}`}>
                  <Icon size={20} aria-hidden="true" />
                </div>
                <p className="text-sm font-bold text-black">{item.title}</p>
                <p className="mt-1 text-[11px] text-slate-400">{item.desc}</p>
              </article>
            );
          })}
        </div>
        */}

        {/* <div className="mt-12 text-center">
          <p className="bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text text-xl font-bold text-transparent">
            "Because when women grow together, everyone grows stronger."
          </p>
        </div> */}
      </div>
    </section>
  );
}
