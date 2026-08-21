'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, CheckCircle2 } from 'lucide-react';

const REGISTRATIONS = [
  { name: 'Priya S.', city: 'Mumbai', time: '3 minutes ago' },
  { name: 'Sneha K.', city: 'Bengaluru', time: '7 minutes ago' },
  { name: 'Ananya D.', city: 'Delhi NCR', time: '11 minutes ago' },
  { name: 'Ritu M.', city: 'Pune', time: '14 minutes ago' },
  { name: 'Kavita G.', city: 'Ahmedabad', time: '19 minutes ago' },
  { name: 'Deepika T.', city: 'Hyderabad', time: '22 minutes ago' },
  { name: 'Neha J.', city: 'Jaipur', time: '28 minutes ago' },
  { name: 'Pooja V.', city: 'Surat', time: '34 minutes ago' },
];

export const SocialProofToaster = () => {
  const [current, setCurrent] = useState<typeof REGISTRATIONS[0] | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let index = 0;

    const showNext = () => {
      setCurrent(REGISTRATIONS[index % REGISTRATIONS.length]);
      setVisible(true);
      index++;

      // Hide after 5 seconds
      setTimeout(() => {
        setVisible(false);
      }, 5000);
    };

    // Initial popup after 3 seconds
    const initialTimer = setTimeout(showNext, 3000);

    // Repeat every 14 seconds
    const interval = setInterval(showNext, 14000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, []);

  if (!current || !visible) return null;

  return (
    <div className="fixed bottom-6 left-6 z-[999] max-w-sm animate-bounce-short transition-all duration-500">
      <div className="flex items-center gap-3 bg-slate-900/95 dark:bg-slate-900/95 text-white border border-orange-500/30 rounded-2xl p-3.5 shadow-2xl shadow-black/60 backdrop-blur-xl">
        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-orange-500 to-amber-400 flex items-center justify-center font-black text-slate-950 text-sm shrink-0 shadow-md">
          {current.name[0]}
        </div>
        <div className="flex-1 min-w-0 pr-2">
          <p className="text-xs font-bold text-white flex items-center gap-1">
            <span>{current.name}</span>
            <span className="text-slate-400 font-normal">from {current.city}</span>
          </p>
          <p className="text-[11px] text-orange-400 font-medium flex items-center gap-1 mt-0.5">
            <CheckCircle2 size={12} className="text-emerald-400" />
            <span>Reserved free seat · {current.time}</span>
          </p>
        </div>
      </div>
    </div>
  );
};
