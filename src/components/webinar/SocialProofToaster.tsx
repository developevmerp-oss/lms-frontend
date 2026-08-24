'use client';

import React, { useState, useEffect } from 'react';
import { Check, X } from 'lucide-react';
import { API_BASE_URL } from '@/config/api';

const DEFAULT_ENTRIES = [
  { name: 'Priya', location: 'Ahmedabad', when: '2 minutes ago' },
  { name: 'Meera', location: 'Pune', when: '6 minutes ago' },
  { name: 'Sneha', location: 'Bengaluru', when: '11 minutes ago' },
  { name: 'Ritu', location: 'Delhi', when: '17 minutes ago' },
  { name: 'Kavya', location: 'Hyderabad', when: '24 minutes ago' },
];

export const SocialProofToaster = () => {
  const [entries, setEntries] = useState<any[]>(DEFAULT_ENTRIES);
  const [current, setCurrent] = useState<any>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/webinar/recent-registrations`);
        const data = await res.json();
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          setEntries(data.data.map((r: any) => ({
            name: r.name,
            location: r.city,
            when: r.time,
          })));
        }
      } catch (_) {}
    };

    fetchRegistrations();
  }, []);

  useEffect(() => {
    let index = 0;

    const showNext = () => {
      if (!entries || entries.length === 0) return;
      setCurrent(entries[index % entries.length]);
      setVisible(true);
      index++;

      setTimeout(() => {
        setVisible(false);
      }, 5000);
    };

    const initialTimer = setTimeout(showNext, 8000);
    const interval = setInterval(showNext, 18000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, [entries]);

  if (!current || !visible) return null;

  return (
    <div className="fixed bottom-20 left-4 z-40 hidden max-w-xs animate-in fade-in slide-in-from-bottom-2 duration-300 items-start gap-3 rounded-xl border border-slate-200 bg-white p-3 pr-8 shadow-lg text-slate-900 sm:flex">
      <div className="mt-0.5 size-4 rounded-full bg-slate-900 text-white flex items-center justify-center shrink-0">
        <Check size={10} />
      </div>
      <div className="text-xs leading-relaxed">
        <p className="font-semibold text-slate-900">
          {current.name} from {current.location || 'India'}
        </p>
        <p className="text-slate-500 text-[11px]">
          Registered {current.when}
        </p>
      </div>
      <button
        type="button"
        onClick={() => setVisible(false)}
        aria-label="Dismiss notification"
        className="absolute right-2 top-2 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
      >
        <X size={14} />
      </button>
    </div>
  );
};
