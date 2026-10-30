"use client";

import { BrandLogo } from "@/components/ui/BrandLogo";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

const LINKS = [
  { href: "/#problem", label: "The Journey" },
  { href: "/#mentor", label: "Meet Mentor" },
  { href: "/#path", label: "The Path" },
  { href: "/#curriculum", label: "What You'll Learn" },
  { href: "/#dimensions", label: "6 Dimensions" },
  { href: "/#community", label: "Community" },
  { href: "/#membership", label: "Memberships" }
];

export default function SiteNavbar() {
  const pathname = usePathname();
  const onHome = pathname === "/";
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      if (y < 16) setHidden(false);
      else if (y > last + 8) {
        setHidden(true);
        setMenuOpen(false);
      } else if (y < last - 8) setHidden(false);
      last = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const surface = onHome
    ? "border-orange-200/80 bg-white/95 shadow-[0_10px_30px_-12px_rgba(90,55,20,0.22)] backdrop-blur-xl"
    : "border-orange-200/80 bg-white/95 shadow-[0_8px_24px_-12px_rgba(15,23,42,0.18)] backdrop-blur-xl";

  return (
    <div className="site-navbar sticky top-0 z-50 bg-transparent">
      <div className="relative mx-auto max-w-7xl px-3 py-3 sm:px-5">
        <nav className={`flex items-center justify-between gap-2 rounded-full border-2 px-2.5 py-2 transition-transform duration-300 ease-out sm:gap-3 sm:px-3 ${hidden ? "pointer-events-none -translate-y-[calc(100%+0.75rem)]" : "translate-y-0"} ${surface}`}>
          <BrandLogo size="sm" />

          <div className="hidden min-w-0 items-center gap-2.5 xl:gap-4 text-[12px] xl:text-[13px] font-medium text-stone-700 lg:flex">
            {LINKS.map((link) => (
              <a key={link.href} href={link.href} className="whitespace-nowrap transition-colors hover:text-orange-600">
                {link.label}
              </a>
            ))}
          </div>

          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            <Link
              href="/login"
              className="hidden rounded-full px-2.5 py-1.5 xl:px-3 xl:py-2 text-xs xl:text-sm font-medium text-stone-700 hover:bg-orange-50 hover:text-orange-700 lg:inline-flex"
            >
              Sign In
            </Link>
            <Link
              href="/webinar"
              className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-3 py-2 text-xs sm:text-sm font-semibold text-slate-950 shadow-lg shadow-orange-500/20 transition hover:from-orange-600 hover:to-amber-600 sm:px-4 sm:py-2.5 whitespace-nowrap"
            >
              <span className="sm:hidden">Join</span>
              <span className="hidden sm:inline">Free Masterclass</span>
              <ArrowRight size={15} />
            </Link>
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full text-stone-800 transition hover:bg-black/5 lg:hidden"
              aria-expanded={menuOpen}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              onClick={() => setMenuOpen((open) => !open)}
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </nav>

        {menuOpen && (
          <div className={`absolute inset-x-3 top-[calc(100%-0.35rem)] z-50 rounded-3xl border-2 p-3 sm:inset-x-5 lg:hidden ${surface}`}>
            <div className="flex flex-col">
              {LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="rounded-2xl px-3 py-2.5 text-sm font-medium text-stone-700 transition hover:bg-black/5 hover:text-orange-600"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <Link
                href="/login"
                className="rounded-2xl px-3 py-2.5 text-sm font-medium text-stone-700 transition hover:bg-black/5 hover:text-orange-600"
                onClick={() => setMenuOpen(false)}
              >
                Sign In
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
