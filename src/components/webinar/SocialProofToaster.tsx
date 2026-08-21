'use client';

import React, { useState, useEffect } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { API_BASE_URL } from '@/config/api';

const DEFAULT_FALLBACKS = [
  { name: 'Anil P.', city: 'Ahmedabad', time: '3 minutes ago' },
  { name: 'Priya S.', city: 'Mumbai', time: '7 minutes ago' },
  { name: 'Sneha K.', city: 'Bengaluru', time: '11 minutes ago' },
  { name: 'Ritu M.', city: 'Pune', time: '14 minutes ago' },
  { name: 'Kavita G.', city: 'Ahmedabad', time: '19 minutes ago' },
  { name: 'Deepika T.', city: 'Hyderabad', time: '22 minutes ago' },
  { name: 'Neha J.', city: 'Jaipur', time: '28 minutes ago' },
  { name: 'Pooja V.', city: 'Surat', time: '34 minutes ago' },
];

export const SocialProofToaster = () => {
  const [registrations, setRegistrations] = useState<any[]>(DEFAULT_FALLBACKS);
  const [current, setCurrent] = useState<any>(null);
  const [visible, setVisible] = useState(false);

  // Fetch real registrations dynamically from database
  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/webinar/recent-registrations`);
        const data = await res.json();
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          setRegistrations(data.data);
        }
      } catch (_) {
        // Use default fallbacks
      }
    };

    fetchRegistrations();
  }, []);

  useEffect(() => {
    if (!registrations || registrations.length === 0) return;

    let index = 0;

    const showNext = () => {
      setCurrent(registrations[index % registrations.length]);
      setVisible(true);
      index++;

      // Hide after 5.5 seconds
      setTimeout(() => {
        setVisible(false);
      }, 5500);
    };

    // Initial popup after 2.5 seconds
    const initialTimer = setTimeout(showNext, 2500);

    // Repeat every 12 seconds
    const interval = setInterval(showNext, 12000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, [registrations]);

  if (!current || !visible) return null;

  const initial = (current.name || 'A').charAt(0).toUpperCase();

  return (
    <div className="fixed bottom-6 left-6 z-[999] max-w-sm animate-in fade-in slide-in-from-bottom-5 duration-500">
      <div className="flex items-center gap-3 bg-slate-950/95 border border-orange-500/40 rounded-2xl p-3 px-4 shadow-2xl shadow-black/80 backdrop-blur-xl">
        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-orange-500 to-amber-400 flex items-center justify-center font-black text-slate-950 text-sm shrink-0 shadow-md">
          {initial}
        </div>
        <div className="flex-1 min-w-0 pr-1">
          <p className="text-xs font-bold text-white flex items-center gap-1.5 flex-wrap leading-tight">
            <span>{current.name}</span>
            <span className="bg-orange-600/90 text-white text-[11px] font-semibold px-2 py-0.5 rounded-md">
              from {current.city}
            </span>
          </p>
          <p className="text-[11px] text-orange-400 font-medium flex items-center gap-1 mt-1">
            <CheckCircle2 size={12} className="text-emerald-400 shrink-0" />
            <span>Reserved free seat · {current.time}</span>
          </p>
        </div>
      </div>
    </div>
  );
};
