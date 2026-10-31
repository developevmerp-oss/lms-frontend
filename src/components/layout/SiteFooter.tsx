import { BrandLogo } from "@/components/ui/BrandLogo";
import Link from "next/link";

const SECTION_LINKS = [
  { href: "/#problem", label: "The Journey" },
  { href: "/#mentor", label: "Meet Mentor" },
  { href: "/#path", label: "The Path" },
  { href: "/#curriculum", label: "What You'll Learn" },
  { href: "/#dimensions", label: "6 Dimensions" },
  { href: "/#community", label: "Community" },
  { href: "/#membership", label: "Memberships" },
];

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
    <footer className="finale-sec site-footer relative z-10">
      <div className="finale-shell">
        <div className="finale-scrim" aria-hidden="true" />
        <div className="nav-width page-rise relative z-10 py-16 sm:py-20 lg:py-24">
          <div className="mx-auto max-w-3xl text-center">
            {/* Centered Brand Logo (Without background, with luminous visibility) */}
            <div className="mb-6 flex justify-center">
              <Link
                href="/"
                className="inline-flex items-center select-none transition-transform duration-300 hover:scale-105"
              >
                <img
                  src="/logo-transparent.png"
                  alt="Ravishing Art"
                  className="h-12 sm:h-14 md:h-16 w-auto object-contain drop-shadow-[0_0_24px_rgba(255,255,255,0.45)] drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)] filter brightness-110 contrast-105"
                />
              </Link>
            </div>

            <h2 className="finale-title text-3xl font-black tracking-tight sm:text-5xl lg:text-5xl">
              Your Art Has More Potential Than You Think.
            </h2>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/webinar" className="finale-btn inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold">
                Join Free Masterclass
              </Link>
              <Link href="/login" className="finale-btn-ghost inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold">
                Student Portal
              </Link>
            </div>
          </div>

          <div className="finale-rule mt-14 sm:mt-16" />

          <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
              {/* Social Media Links */}
              <div className="flex items-center gap-2.5">
                <a
                  href="https://www.instagram.com/vrajangna.resinbusinesscoach?obrf=MWx1eG8xNmxvaG94eA=="
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-gradient-to-tr hover:from-amber-500 hover:via-pink-500 hover:to-purple-500 border border-white/20 hover:border-transparent flex items-center justify-center text-white/90 hover:text-white transition-all duration-300 shadow-sm hover:scale-110"
                >
                  <InstagramIcon className="w-4 h-4" />
                </a>
                <a
                  href="https://youtube.com/@ravishing_art?si=D1K_NuB7YGOkA7FL"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-[#FF0000] border border-white/20 hover:border-[#FF0000] flex items-center justify-center text-white/90 hover:text-white transition-all duration-300 shadow-sm hover:scale-110"
                >
                  <YoutubeIcon className="w-4 h-4" />
                </a>
              </div>

              <Link href="/privacy" className="finale-link text-sm">
                Privacy Policy
              </Link>
              <Link href="/terms" className="finale-link text-sm">
                Terms of Service
              </Link>
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-2 sm:justify-end lg:flex-nowrap">
              {SECTION_LINKS.map((link) => (
                <a key={link.href} href={link.href} className="finale-link text-sm">
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          <div className="finale-rule mt-6" />
          <p className="finale-copy mt-6 text-center text-sm">
            © 2026 Ravishing Art Hub. All Rights Reserved. Mastered with Passion.
          </p>
        </div>
      </div>
    </footer>
  );
}
