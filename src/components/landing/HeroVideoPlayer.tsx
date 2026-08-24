"use client";

import React, { useRef, useState, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize2 } from "lucide-react";

export default function HeroVideoPlayer() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [showControls, setShowControls] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      if (video.duration) {
        setProgress((video.currentTime / video.duration) * 100);
      }
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);

    // Attempt auto-play
    video.play().catch(() => {
      setIsPlaying(false);
    });

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
    };
  }, []);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const toggleFullscreen = () => {
    if (!videoRef.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      videoRef.current.requestFullscreen();
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    videoRef.current.currentTime = pos * videoRef.current.duration;
  };

  return (
    <div
      className="relative max-w-5xl mx-auto mb-16 rounded-3xl overflow-hidden border-2 border-orange-500/40 shadow-2xl shadow-orange-500/20 bg-slate-950 aspect-video group"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        src="/videos/hero-video.mp4"
        playsInline
        autoPlay
        muted
        loop
        className="w-full h-full object-cover rounded-3xl cursor-pointer"
        onClick={togglePlay}
      />

      {/* Floating Center Play Button when paused */}
      {!isPlaying && (
        <div
          onClick={togglePlay}
          className="absolute inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center cursor-pointer transition-all z-20"
        >
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center text-slate-950 shadow-2xl shadow-orange-500/50 hover:scale-110 transition-transform">
            <Play size={36} className="fill-slate-950 ml-1" />
          </div>
        </div>
      )}

      {/* Bottom Controls Bar (Visible on hover or when paused) */}
      <div
        className={`absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950/95 via-slate-950/60 to-transparent p-4 md:p-6 transition-opacity duration-300 z-20 flex flex-col justify-end gap-3 ${
          showControls || !isPlaying ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Progress Bar */}
        <div
          onClick={handleSeek}
          className="w-full h-1.5 bg-slate-700/60 hover:h-2.5 rounded-full cursor-pointer transition-all relative overflow-hidden"
        >
          <div
            className="h-full bg-gradient-to-r from-orange-500 to-amber-400 rounded-full relative"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={togglePlay}
              className="w-9 h-9 rounded-full bg-slate-800/90 hover:bg-orange-500 hover:text-slate-950 text-white flex items-center justify-center transition-colors shadow cursor-pointer"
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
            </button>

            <button
              onClick={toggleMute}
              className="w-9 h-9 rounded-full bg-slate-800/90 hover:bg-orange-500 hover:text-slate-950 text-white flex items-center justify-center transition-colors shadow cursor-pointer"
              title={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>
          </div>

          <button
            onClick={toggleFullscreen}
            className="w-9 h-9 rounded-full bg-slate-800/90 hover:bg-orange-500 hover:text-slate-950 text-white flex items-center justify-center transition-colors shadow cursor-pointer"
            title="Fullscreen"
          >
            <Maximize2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
