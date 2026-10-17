import { BrandLogo } from "@/components/ui/BrandLogo";
import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="relative z-10 border-t border-slate-800/80 bg-slate-950 px-6 py-16 text-slate-400">
      <div className="mx-auto max-w-7xl space-y-12">
        <div className="flex flex-col items-start justify-between gap-8 border-b border-slate-800/80 pb-12 md:flex-row md:items-center">
          <div className="space-y-3">
            <div className="mb-2">
              <BrandLogo size="md" />
            </div>
            <h3 className="text-xl font-bold text-white">Create. Connect. Grow. Become Ravishing.</h3>
            <p className="max-w-lg text-sm leading-relaxed text-slate-400">
              Ravishing Art Hub is a community for ambitious women who want to transform their creativity into skill, identity, impact and financial freedom. Your creativity deserves a place in your life. And your journey starts here.
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row">
            <Link
              href="/webinar"
              className="rounded-xl bg-orange-500 px-6 py-3 text-sm font-bold text-slate-950 transition-all hover:scale-105 hover:bg-orange-600"
            >
              Join Free Masterclass
            </Link>
            <Link
              href="/login"
              className="rounded-xl border border-slate-800 bg-slate-900 px-6 py-3 text-sm font-bold text-white transition-all hover:scale-105 hover:border-slate-700"
            >
              Student Portal
            </Link>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 text-xs text-slate-400 sm:flex-row">
          <p>© {new Date().getFullYear()} Ravishing Art Hub. All Rights Reserved. Mastered with Passion.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="transition-colors hover:text-slate-300">Privacy Policy</Link>
            <Link href="/terms" className="transition-colors hover:text-slate-300">Terms of Service</Link>
            <Link href="/contact" className="transition-colors hover:text-slate-300">Contact Support</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
