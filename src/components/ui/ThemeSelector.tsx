'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Sun, Moon, Check, Settings } from 'lucide-react';

export const ThemeSelector = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLight, setIsLight] = useState(false);
  const [accent, setAccent] = useState('orange');
  const panelRef = useRef<HTMLDivElement>(null);

  // Load theme settings from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedMode = localStorage.getItem('theme-mode') || 'dark';
      const savedAccent = localStorage.getItem('theme-accent') || 'orange';
      
      const lightMode = savedMode === 'light';
      setIsLight(lightMode);
      setAccent(savedAccent);
      
      applyTheme(lightMode, savedAccent);
    }
  }, []);

  // Close panel on clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const applyTheme = (light: boolean, color: string) => {
    const root = document.documentElement;
    
    // Apply Light/Dark Mode
    if (light) {
      root.classList.add('light');
    } else {
      root.classList.remove('light');
    }

    // Apply Accent Color Classes
    root.classList.remove('theme-orange', 'theme-blue', 'theme-green', 'theme-yellow');
    root.classList.add(`theme-${color}`);
  };

  const toggleMode = () => {
    const nextLight = !isLight;
    setIsLight(nextLight);
    localStorage.setItem('theme-mode', nextLight ? 'light' : 'dark');
    applyTheme(nextLight, accent);
  };

  const selectAccent = (color: string) => {
    setAccent(color);
    localStorage.setItem('theme-accent', color);
    applyTheme(isLight, color);
  };

  const accents = [
    { id: 'orange', name: 'Orange', color: '#f97316' },
    { id: 'blue', name: 'Blue', color: '#3b82f6' },
    { id: 'green', name: 'Green', color: '#10b981' },
    { id: 'yellow', name: 'Yellow', color: '#eab308' }
  ];

  return (
    <div className="fixed bottom-6 right-6 z-[9999]" ref={panelRef}>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 rounded-full flex items-center justify-center shadow-2xl hover:scale-105 transition-all focus:outline-none cursor-pointer"
        style={{
          border: '1px solid var(--border-color)',
          background: 'var(--card-bg-solid)',
          color: 'var(--text-primary)'
        }}
      >
        <Settings size={20} className={`transition-transform duration-500 ${isOpen ? 'rotate-90' : ''}`} />
      </button>

      {/* Settings Panel */}
      {isOpen && (
        <div 
          className="absolute bottom-16 right-0 w-64 p-5 rounded-2xl border shadow-3xl flex flex-col gap-4 animate-fade-in"
          style={{
            borderColor: 'var(--border-color)',
            background: 'var(--card-bg)',
            color: 'var(--text-primary)'
          }}
        >
          <div>
            <h3 className="font-bold text-sm mb-1" style={{ color: 'var(--text-primary)' }}>Theme Customizer</h3>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Personalize your LMS workspace.</p>
          </div>

          <hr style={{ borderColor: 'var(--border-color)' }} />

          {/* Mode Selector */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>App Mode</span>
            <button
              onClick={toggleMode}
              className="flex items-center justify-between w-full px-4 py-2.5 rounded-xl border text-sm font-medium transition-all cursor-pointer"
              style={{
                borderColor: 'var(--border-color)',
                background: 'var(--card-bg-solid)'
              }}
            >
              {isLight ? (
                <>
                  <span className="flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                    <Sun size={16} className="text-amber-500" /> Light Mode
                  </span>
                  <div className="w-8 h-4 rounded-full bg-amber-500/20 flex items-center justify-end p-0.5">
                    <div className="w-3 h-3 rounded-full bg-amber-500" />
                  </div>
                </>
              ) : (
                <>
                  <span className="flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                    <Moon size={16} className="text-indigo-400" /> Dark Mode
                  </span>
                  <div className="w-8 h-4 rounded-full bg-slate-800 flex items-center justify-start p-0.5 border border-slate-700">
                    <div className="w-3 h-3 rounded-full bg-slate-400" />
                  </div>
                </>
              )}
            </button>
          </div>

          {/* Color Accent Selector */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>Accent Color</span>
            <div className="grid grid-cols-4 gap-2">
              {accents.map((acc) => {
                const isSelected = accent === acc.id;
                return (
                  <button
                    key={acc.id}
                    onClick={() => selectAccent(acc.id)}
                    className="w-11 h-11 rounded-xl flex items-center justify-center relative hover:scale-105 transition-all cursor-pointer"
                    style={{
                      backgroundColor: acc.color,
                      boxShadow: isSelected ? `0 0 12px ${acc.color}80` : 'none'
                    }}
                    title={acc.name}
                  >
                    {isSelected && <Check size={18} className="text-white font-bold" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
