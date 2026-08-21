'use client';

import React from 'react';
import Link from 'next/link';

interface BrandLogoProps {
  href?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
}

export const BrandLogo = ({
  href = '/',
  className = '',
  size = 'md',
  showSubtitle = true,
}: BrandLogoProps) => {
  const iconSize = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10 md:w-11 md:h-11',
    lg: 'w-12 h-12 md:w-14 md:h-14',
    xl: 'w-16 h-16 md:w-20 md:h-20',
  }[size] || 'w-10 h-10';

  const titleSize = {
    sm: 'text-sm font-black tracking-wider',
    md: 'text-base md:text-lg font-black tracking-wider',
    lg: 'text-xl md:text-2xl font-black tracking-wider',
    xl: 'text-2xl md:text-3xl font-black tracking-wider',
  }[size] || 'text-base font-black tracking-wider';

  const subtitleSize = {
    sm: 'text-[9px]',
    md: 'text-[11px]',
    lg: 'text-xs',
    xl: 'text-sm',
  }[size] || 'text-[11px]';

  const content = (
    <div className={`inline-flex items-center gap-3 select-none group cursor-pointer ${className}`}>
      {/* Monarch Butterfly Golden Dust Emblem */}
      <div className={`relative shrink-0 ${iconSize} flex items-center justify-center`}>
        <img
          src="/brand-emblem.png"
          alt="Ravishing Art"
          className="w-full h-full object-contain drop-shadow-md group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col justify-center leading-none text-left">
        <span className={`uppercase font-sans ${titleSize} text-slate-900 dark:text-white transition-colors duration-200`}>
          RAVISHING ART
        </span>
        {showSubtitle && (
          <span className={`${subtitleSize} font-medium text-orange-600 dark:text-orange-400 tracking-wide mt-0.5`}>
            by Vrajangna Patel
          </span>
        )}
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex items-center shrink-0">
        {content}
      </Link>
    );
  }

  return content;
};
