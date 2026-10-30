import { BrandLogo } from "@/components/ui/BrandLogo";
import Link from "next/link";

const InstagramIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    width="18"
    height="18"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const YoutubeIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    width="18"
    height="18"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

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
          
          <div className="flex flex-wrap items-center gap-6">
            {/* Social Links */}
            <div className="flex items-center gap-2.5">
              <a
                href="https://www.instagram.com/vrajangna.resinbusinesscoach?obrf=MWx1eG8xNmxvaG94eA=="
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-full bg-neutral-100 hover:bg-orange-50 border border-neutral-200/80 hover:border-orange-300 flex items-center justify-center text-neutral-600 hover:text-orange-600 transition-all duration-200 shadow-sm"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com/@ravishing_art?si=D1K_NuB7YGOkA7FL"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="w-9 h-9 rounded-full bg-neutral-100 hover:bg-orange-50 border border-neutral-200/80 hover:border-orange-300 flex items-center justify-center text-neutral-600 hover:text-orange-600 transition-all duration-200 shadow-sm"
              >
                <YoutubeIcon className="w-4 h-4" />
              </a>
            </div>

            <div className="flex flex-wrap gap-x-6 gap-y-2">
              <Link href="/privacy" className="site-footer-link">Privacy Policy</Link>
              <Link href="/terms" className="site-footer-link">Terms of Service</Link>
              <Link href="/contact" className="site-footer-link">Contact Support</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
