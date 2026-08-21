'use client';

import React, { useState, useEffect } from 'react';

export const WebinarCountdown = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 4,
    minutes: 32,
    seconds: 18,
  });

  useEffect(() => {
    // Target: Next upcoming Sunday 8:00 PM IST
    const getNextSession = () => {
      const now = new Date();
      const target = new Date(now);
      const day = target.getDay(); // 0 is Sunday
      const diff = (7 - day) % 7;
      target.setDate(now.getDate() + (diff === 0 && now.getHours() >= 20 ? 7 : diff));
      target.setHours(20, 0, 0, 0);
      return target;
    };

    const targetDate = getNextSession();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate.getTime() - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);
        setTimeLeft({ days, hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center justify-center gap-2 md:gap-3">
      <div className="flex flex-col items-center bg-slate-900/90 dark:bg-slate-900/90 border border-orange-500/30 rounded-xl px-3 py-2 min-w-[58px] shadow-md">
        <span className="text-xl md:text-2xl font-black text-orange-400 leading-none">
          {String(timeLeft.days).padStart(2, '0')}
        </span>
        <span className="text-[10px] uppercase font-bold text-slate-400 mt-1">Days</span>
      </div>
      <span className="text-orange-400 font-bold text-lg -mt-3">:</span>
      <div className="flex flex-col items-center bg-slate-900/90 dark:bg-slate-900/90 border border-orange-500/30 rounded-xl px-3 py-2 min-w-[58px] shadow-md">
        <span className="text-xl md:text-2xl font-black text-orange-400 leading-none">
          {String(timeLeft.hours).padStart(2, '0')}
        </span>
        <span className="text-[10px] uppercase font-bold text-slate-400 mt-1">Hours</span>
      </div>
      <span className="text-orange-400 font-bold text-lg -mt-3">:</span>
      <div className="flex flex-col items-center bg-slate-900/90 dark:bg-slate-900/90 border border-orange-500/30 rounded-xl px-3 py-2 min-w-[58px] shadow-md">
        <span className="text-xl md:text-2xl font-black text-orange-400 leading-none">
          {String(timeLeft.minutes).padStart(2, '0')}
        </span>
        <span className="text-[10px] uppercase font-bold text-slate-400 mt-1">Mins</span>
      </div>
      <span className="text-orange-400 font-bold text-lg -mt-3">:</span>
      <div className="flex flex-col items-center bg-slate-900/90 dark:bg-slate-900/90 border border-orange-500/30 rounded-xl px-3 py-2 min-w-[58px] shadow-md">
        <span className="text-xl md:text-2xl font-black text-orange-400 leading-none animate-pulse">
          {String(timeLeft.seconds).padStart(2, '0')}
        </span>
        <span className="text-[10px] uppercase font-bold text-slate-400 mt-1">Secs</span>
      </div>
    </div>
  );
};
