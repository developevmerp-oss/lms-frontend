import React from "react";

interface IndiaFlagProps {
  className?: string;
}

export function IndiaFlag({ className = "w-5 h-3.5" }: IndiaFlagProps) {
  return (
    <span
      className={`inline-flex items-center justify-center shrink-0 overflow-hidden rounded-xs border border-stone-300/80 shadow-xs select-none ${className}`}
      aria-label="India flag"
      title="India (+91)"
    >
      <svg
        viewBox="0 0 640 480"
        className="w-full h-full object-cover block"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Saffron stripe */}
        <path fill="#FF9933" d="M0 0h640v160H0z" />
        {/* White stripe */}
        <path fill="#FFFFFF" d="M0 160h640v160H0z" />
        {/* Green stripe */}
        <path fill="#138808" d="M0 320h640v160H0z" />
        {/* Ashok Chakra (Navy Blue) */}
        <g transform="matrix(3.2 0 0 3.2 320 240)">
          <circle r="20" fill="none" stroke="#000080" strokeWidth="2" />
          <circle r="3.5" fill="#000080" />
          <circle
            r="18"
            fill="none"
            stroke="#000080"
            strokeWidth="0.9"
            strokeDasharray="1.2,3.5"
          />
        </g>
      </svg>
    </span>
  );
}

export default IndiaFlag;

