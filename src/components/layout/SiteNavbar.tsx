"use client";

import { BrandLogo } from "@/components/ui/BrandLogo";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

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
  return (
    <div className="site-navbar sticky top-0 z-50 bg-white">
      <div className="mx-auto max-w-6xl px-3 py-3 sm:px-5">
        <nav className="flex items-center justify-between gap-3 rounded-full border border-orange-200/80 bg-white px-2.5 py-2 shadow-[0_8px_24px_-16px_rgba(194,65,12,0.28)]">
          <BrandLogo size="sm" />

          <div className="hidden items-center gap-5 text-[13px] font-medium text-stone-600 xl:flex">
            {LINKS.map((link) => (
              <a key={link.href} href={link.href} className="transition-colors hover:text-orange-600">
                {link.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="hidden rounded-full px-3 py-2 text-sm font-medium text-stone-600 hover:bg-orange-50 hover:text-orange-700 sm:inline-flex"
            >
              Sign In
            </Link>
            <Link
              href="/webinar"
              className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-4 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-orange-500/20 transition hover:from-orange-600 hover:to-amber-600"
            >
              Free Masterclass <ArrowRight size={15} />
            </Link>
          </div>
        </nav>
      </div>
    </div>
  );
}
