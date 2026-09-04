'use client';

import React from 'react';
import Link from 'next/link';

interface BrandLogoProps {
  href?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const BrandLogo = ({
  href = '/',
  className = '',
  size = 'md',
}: BrandLogoProps) => {
  const heightMap = {
    sm: 'h-10 md:h-12',
    md: 'h-12 md:h-14',
    lg: 'h-16 md:h-20',
    xl: 'h-20 md:h-24',
  };

  const heightClass = heightMap[size] || heightMap.md;

  const content = (
    <div className={`inline-flex items-center select-none group cursor-pointer ${className}`}>
      {/* Dark Theme Logo */}
      <img
        src="/logo-dark.png"
        alt="Ravishing Art"
        className={`brand-logo-dark ${heightClass} w-auto object-contain drop-shadow-md group-hover:scale-105 transition-transform duration-300`}
      />

      {/* Light Theme Logo */}
      <img
        src="/logo-light.png"
        alt="Ravishing Art"
        className={`brand-logo-light ${heightClass} w-auto object-contain drop-shadow-sm group-hover:scale-105 transition-transform duration-300`}
      />
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
