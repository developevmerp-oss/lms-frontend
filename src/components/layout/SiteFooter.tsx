import { BrandLogo } from "@/components/ui/BrandLogo";
import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="site-footer relative z-10 bg-white">
      <div className="container mx-auto px-5 py-12 sm:px-10 lg:px-10 lg:py-16 2xl:px-0">
        <div className="flex flex-col items-start justify-between gap-8 border-b border-neutral-200 pb-10 md:flex-row md:items-center">
          <div className="max-w-xl space-y-3">
            <BrandLogo size="md" />
            <h3 className="site-footer-title text-xl font-bold">Create. Connect. Grow. Become Ravishing.</h3>
            <p className="site-footer-copy text-sm leading-relaxed">
              Ravishing Art Hub is a community for ambitious women who want to transform their creativity into skill, identity, impact and financial freedom. Your creativity deserves a place in your life. And your journey starts here.
            </p>
          </div>

          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Link href="/webinar" className="site-footer-btn inline-flex items-center justify-center whitespace-nowrap rounded-full px-6 py-3 text-sm font-bold">
              Join Free Masterclass
            </Link>
            <Link href="/login" className="site-footer-btn-ghost inline-flex items-center justify-center whitespace-nowrap rounded-full px-6 py-3 text-sm font-bold">
              Student Portal
            </Link>
          </div>
        </div>

        <div className="flex flex-col items-start justify-between gap-4 pt-6 text-sm sm:flex-row sm:items-center">
          <p className="site-footer-copy">© {new Date().getFullYear()} Ravishing Art Hub. All Rights Reserved. Mastered with Passion.</p>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <Link href="/privacy" className="site-footer-link">Privacy Policy</Link>
            <Link href="/terms" className="site-footer-link">Terms of Service</Link>
            <Link href="/contact" className="site-footer-link">Contact Support</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
