'use client';

import React from 'react';
import Link from 'next/link';

interface BrandLogoProps {
  href?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const BrandLogo = ({ href = '/', className = '', size = 'md' }: BrandLogoProps) => {
  const sizeMap = {
    sm: 'h-8 md:h-9',
    md: 'h-10 md:h-12',
    lg: 'h-14 md:h-16',
    xl: 'h-16 md:h-20'
  };

  const heightClass = sizeMap[size] || sizeMap.md;

  const content = (
    <div className={`inline-flex items-center select-none ${className}`}>
      <img
        src="/logo.png"
        alt="Ravishing Art Hub"
        className={`${heightClass} w-auto object-contain transition-transform duration-300 hover:scale-[1.02]`}
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
