'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { API_BASE_URL } from '@/config/api';
import { Clock } from 'lucide-react';

interface WebinarCountdownProps {
  targetDateStr?: string;
  onWebinarLoaded?: (webinar: any) => void;
  compact?: boolean;
}

export const WebinarCountdown = ({
  targetDateStr,
  onWebinarLoaded,
  compact = false,
}: WebinarCountdownProps) => {
  const [targetTimestamp, setTargetTimestamp] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const onWebinarLoadedRef = useRef(onWebinarLoaded);
  useEffect(() => {
    onWebinarLoadedRef.current = onWebinarLoaded;
  }, [onWebinarLoaded]);

  const isFetchingRef = useRef(false);

  const getFallbackDate = () => {
    const now = new Date();
    const istOffsetMs = 5.5 * 60 * 60 * 1000;
    const istNow = new Date(now.getTime() + istOffsetMs);
    const day = istNow.getUTCDay();
    const diff = (7 - day) % 7;
    const targetIst = new Date(istNow);
    targetIst.setUTCDate(istNow.getUTCDate() + (diff === 0 && istNow.getUTCHours() >= 20 ? 7 : diff));
    targetIst.setUTCHours(20, 0, 0, 0); // 8:00 PM IST
    return targetIst.getTime() - istOffsetMs;
  };

  const fetchNextWebinar = useCallback(async () => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    try {
      const res = await fetch(`${API_BASE_URL}/webinar/next`);
      const data = await res.json();
      if (data.success && data.data?.scheduledAt) {
        if (onWebinarLoadedRef.current) onWebinarLoadedRef.current(data.data);
        const time = new Date(data.data.scheduledAt).getTime();
        if (!isNaN(time) && time > Date.now()) {
          setTargetTimestamp(time);
          return;
        }
      }
      // Fallback
      const fallback = getFallbackDate();
      setTargetTimestamp(fallback);
      if (onWebinarLoadedRef.current) {
        onWebinarLoadedRef.current({
          scheduledAt: new Date(fallback).toISOString(),
          title: 'Resin Mastery Masterclass — Live with Vrajangna Patel',
        });
      }
    } catch (_) {
      const fallback = getFallbackDate();
      setTargetTimestamp(fallback);
    } finally {
      isFetchingRef.current = false;
    }
  }, []);

  useEffect(() => {
    if (targetDateStr) {
      const parsed = new Date(targetDateStr).getTime();
      if (!isNaN(parsed) && parsed > Date.now()) {
        setTargetTimestamp(parsed);
        return;
      }
    }
    fetchNextWebinar();
  }, [targetDateStr, fetchNextWebinar]);

  useEffect(() => {
    if (!targetTimestamp) return;

    const calculate = () => {
      const now = Date.now();
      const difference = targetTimestamp - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);
        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculate();
    const interval = setInterval(calculate, 1000);

    return () => clearInterval(interval);
  }, [targetTimestamp]);

  if (compact) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs sm:text-base md:text-base lg:text-base font-semibold tabular-nums text-stone-700">
        <Clock className="size-3.5 sm:size-4 text-[#c45a28]" />
        {timeLeft.days > 0 && `${timeLeft.days}d `}
        {String(timeLeft.hours).padStart(2, '0')}:
        {String(timeLeft.minutes).padStart(2, '0')}:
        {String(timeLeft.seconds).padStart(2, '0')}
      </span>
    );
  }

  return (
    <div className="flex items-center gap-2 sm:gap-3 md:gap-3">
      {[
        [String(timeLeft.days).padStart(2, '0'), 'Days'],
        [String(timeLeft.hours).padStart(2, '0'), 'Hours'],
        [String(timeLeft.minutes).padStart(2, '0'), 'Mins'],
        [String(timeLeft.seconds).padStart(2, '0'), 'Secs'],
      ].map(([value, label]) => (
        <div key={label} className="flex min-w-[58px] sm:min-w-[68px] md:min-w-[72px] lg:min-w-[76px] flex-col items-center rounded-2xl border border-[#f3d3c0] bg-white px-3 py-2 sm:px-4 sm:py-2.5 shadow-[0_10px_24px_-18px_rgba(90,55,20,0.45)]">
          <span className="text-lg sm:text-2xl md:text-2xl lg:text-2xl font-bold leading-none text-stone-950">{value}</span>
          <span className="mt-1 text-xs sm:text-xs md:text-xs lg:text-xs font-semibold uppercase tracking-wider text-stone-500">{label}</span>
        </div>
      ))}
    </div>
  );
};