"use client";

import { useEffect, useRef, useState, useCallback } from "react";

const SLIDES = [
  { id: "welcome", label: "WELCOME", title: "Welcome to", titleAccent: "Ravishing Art", subtitle: "India's #1 Resin Art Masterclass Studio", emoji: "🎨", accent: "#f97316", bg: "#0d0a08" },
  { id: "explore", label: "EXPLORE MEMBERSHIP", title: "Explore Our", titleAccent: "Memberships", subtitle: "Choose the plan that fits your art journey", emoji: "🌟", accent: "#a855f7", bg: "#0c0810" },
  { id: "masters", label: "MASTERS MEMBERSHIP", title: "Masters", titleAccent: "Membership", subtitle: "L1 · Pro-level techniques for serious artists", emoji: "💎", accent: "#06b6d4", bg: "#03090d" },
  { id: "renaissance", label: "RENAISSANCE CERTIFICATION", title: "Renaissance", titleAccent: "Certification", subtitle: "L2 · Advanced artistry & business mastery", emoji: "🏆", accent: "#eab308", bg: "#0d0b03" },
  { id: "courses", label: "COURSES", title: "Our Course", titleAccent: "Curriculum", subtitle: "Step-by-step guided video lessons at your pace", emoji: "📚", accent: "#22c55e", bg: "#030d06" },
  { id: "coaching", label: "COACHING", title: "Live 1-on-1", titleAccent: "Coaching", subtitle: "Direct mentorship from Vrajangna Patel herself", emoji: "🎓", accent: "#f97316", bg: "#0d0a08" },
  { id: "challenge", label: "CHALLENGE", title: "90-Day Resin", titleAccent: "Challenge", subtitle: "Daily missions to build your resin skills fast", emoji: "⚡", accent: "#ef4444", bg: "#0d0404" },
  { id: "community", label: "COMMUNITY", title: "Our Creative", titleAccent: "Community", subtitle: "Connect with 1000+ artists across India", emoji: "🤝", accent: "#8b5cf6", bg: "#09060d" },
  { id: "certification", label: "CERTIFICATION", title: "Get Certified", titleAccent: "Today", subtitle: "Earn a recognised Resin Art certification", emoji: "📜", accent: "#0ea5e9", bg: "#030a0d" },
  { id: "hall", label: "HALL OF FAME", title: "Hall of", titleAccent: "Fame", subtitle: "Celebrating our top-performing artists", emoji: "🌟", accent: "#f59e0b", bg: "#0d0a03" },
  { id: "members", label: "1141+ MEMBERS", title: "1141+", titleAccent: "Members Strong", subtitle: "And growing every single day nationwide", emoji: "👥", accent: "#10b981", bg: "#030d08" },
  { id: "sheros", label: "SHEROS", title: "Our Art", titleAccent: "SHEROs", subtitle: "Women transforming passion into real income", emoji: "💪", accent: "#ec4899", bg: "#0d030a" },
  { id: "magic", label: "CREATING MAGIC TOGETHER", title: "Creating Magic", titleAccent: "Together", subtitle: "Join us — your resin journey starts right now", emoji: "✨", accent: "#f97316", bg: "#0d0a08" },
];

const SLIDE_DURATION = 4000;

export default function CanvaPresentation() {
  const [current, setCurrent] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimers = useCallback(() => {
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
    if (progressRef.current) { clearInterval(progressRef.current); progressRef.current = null; }
  }, []);

  const nextSlide = useCallback(() => {
    setProgress(0);
    setAnimKey(k => k + 1);
    setCurrent(c => (c + 1) % SLIDES.length);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsPlaying(true); },
      { threshold: 0.4 }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    clearTimers();
    if (!isPlaying) return;
    const step = 100 / (SLIDE_DURATION / 50);
    progressRef.current = setInterval(() => setProgress(p => Math.min(p + step, 100)), 50);
    intervalRef.current = setInterval(nextSlide, SLIDE_DURATION);
    return clearTimers;
  }, [isPlaying, current, clearTimers, nextSlide]);

  const slide = SLIDES[current];

  return (
    <div
      ref={containerRef}
      style={{ aspectRatio: "16/9", background: slide.bg, position: "relative", borderRadius: "24px", overflow: "hidden", border: "2px solid rgba(249,115,22,0.25)", boxShadow: "0 25px 80px rgba(0,0,0,0.6)" }}
    >
      {/* Glow orb */}
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "60%", height: "60%", borderRadius: "50%", background: slide.accent, opacity: 0.1, filter: "blur(80px)", transition: "background 1s ease" }} />

      {/* Slide label top-left */}
      <div style={{ position: "absolute", top: 20, left: 20, zIndex: 10 }}>
        <span style={{ fontSize: 10, fontWeight: 900, letterSpacing: "0.25em", textTransform: "uppercase", color: slide.accent, background: slide.accent + "20", border: `1px solid ${slide.accent}40`, borderRadius: 99, padding: "4px 12px" }}>
          {slide.label}
        </span>
      </div>

      {/* Slide counter top-right */}
      <div style={{ position: "absolute", top: 20, right: 20, zIndex: 10, color: "#475569", fontSize: 12, fontFamily: "monospace" }}>
        {String(current + 1).padStart(2, "0")} / {String(SLIDES.length).padStart(2, "0")}
      </div>

      {/* Main content */}
      <div key={animKey} style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 32px", animation: "slideReveal 0.55s cubic-bezier(.22,1,.36,1) both" }}>
        <div style={{ fontSize: "clamp(40px,8vw,72px)", marginBottom: 16, animation: "popIn 0.5s cubic-bezier(.22,1,.36,1) both" }}>
          {slide.emoji}
        </div>
        <h2 style={{ textAlign: "center", fontWeight: 900, lineHeight: 1.15, marginBottom: 12, color: "#fff", textShadow: `0 0 60px ${slide.accent}50` }}>
          <span style={{ display: "block", fontSize: "clamp(22px,4.5vw,52px)" }}>{slide.title}</span>
          <span style={{ display: "block", fontSize: "clamp(24px,5vw,58px)", color: slide.accent }}>{slide.titleAccent}</span>
        </h2>
        <p style={{ color: "#94a3b8", fontSize: "clamp(13px,1.8vw,18px)", textAlign: "center", maxWidth: 480, animation: "slideReveal 0.55s 0.12s cubic-bezier(.22,1,.36,1) both" }}>
          {slide.subtitle}
        </p>
        <div style={{ marginTop: 20, width: 64, height: 3, borderRadius: 99, background: slide.accent, opacity: 0.6, animation: "slideReveal 0.55s 0.2s cubic-bezier(.22,1,.36,1) both" }} />
      </div>

      {/* Progress bar */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 3, background: "#1e293b", zIndex: 20 }}>
        <div style={{ height: "100%", width: `${progress}%`, background: slide.accent, borderRadius: "0 2px 2px 0", transition: "width 50ms linear" }} />
      </div>

      {/* Dot nav */}
      <div style={{ position: "absolute", bottom: 18, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 6, zIndex: 20 }}>
        {SLIDES.map((s, i) => (
          <button
            key={s.id}
            onClick={() => { setCurrent(i); setProgress(0); setAnimKey(k => k + 1); }}
            style={{ height: 6, width: i === current ? 22 : 6, borderRadius: 99, border: "none", cursor: "pointer", background: i === current ? slide.accent : "#334155", transition: "all 0.3s ease", padding: 0 }}
          />
        ))}
      </div>

      {/* Play/Pause button */}
      <button
        onClick={() => setIsPlaying(p => !p)}
        style={{ position: "absolute", bottom: 10, right: 16, zIndex: 20, width: 36, height: 36, borderRadius: "50%", border: "1px solid #334155", background: "rgba(2,6,23,0.85)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        {isPlaying ? (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="white"><rect x="1" y="1" width="4" height="10" rx="1"/><rect x="7" y="1" width="4" height="10" rx="1"/></svg>
        ) : (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="white"><path d="M2 1l9 5-9 5V1z"/></svg>
        )}
      </button>

      <style>{`
        @keyframes slideReveal {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes popIn {
          0%   { opacity: 0; transform: scale(0.4) rotate(-10deg); }
          70%  { transform: scale(1.18) rotate(4deg); }
          100% { opacity: 1; transform: scale(1) rotate(0deg); }
        }
      `}</style>
    </div>
  );
}
