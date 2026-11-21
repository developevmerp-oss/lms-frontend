'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  MessageSquare,
  X,
  Send,
  RotateCcw,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  ExternalLink,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { API_BASE_URL } from '@/config/api';
import { matchAndAnswerAcademyQuery } from '@/lib/ai/knowledgeBase';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  action?: { label: string; path: string } | null;
  timestamp?: number;
}

const QUICK_SUGGESTIONS = [
  { label: '🎨 How beginners start resin', prompt: 'I am a complete beginner with zero experience. How do I start resin art?' },
  { label: '💎 Memberships & Pricing', prompt: 'What are the current membership levels, prices, and special offers in the academy?' },
  { label: '🌸 Wedding Varmala Preservation', prompt: 'Which course teaches wedding varmala and flower preservation?' },
  { label: '🪵 Live-Edge River Tables', prompt: 'How do you make deep wood and resin river tables?' },
  { label: '⏰ Next Live Masterclass', prompt: "When is Vrajangna Patel's next live masterclass and how can I register?" },
  { label: '💰 Earning ₹50,000/month', prompt: 'How do students sell resin art and build a ₹50,000/month business?' },
];

const INITIAL_WELCOME_MESSAGE: Message = {
  id: 'welcome',
  role: 'assistant',
  content: `Hi there! I'm Vraj, your Art Advisor at Ravishing Art Hub 👋\n\nI can help you explore our 30 step-by-step resin courses, check dynamic membership pricing, or reserve your seat for Vrajangna Patel's next live masterclass.\n\nWhat would you love to learn or create today?`
};

export const ArtAdvisorChatbot: React.FC = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isCentered, setIsCentered] = useState(false);
  const [messages, setMessages] = useState<Message[]>([INITIAL_WELCOME_MESSAGE]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Dynamic Academy Data
  const [dynamicLevels, setDynamicLevels] = useState<any[]>([]);
  const [dynamicCourses, setDynamicCourses] = useState<any[]>([]);
  const [dynamicWebinar, setDynamicWebinar] = useState<any>(null);

  // Voice States
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [currentlySpeakingId, setCurrentlySpeakingId] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);

  const isAdminPage = pathname?.startsWith('/admin');

  // Fetch dynamic levels, courses, and webinar from backend
  useEffect(() => {
    const fetchDynamicData = async () => {
      try {
        const storedToken = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        const headers: Record<string, string> = storedToken ? { Authorization: `Bearer ${storedToken}` } : {};

        const [levelsRes, coursesRes, webinarRes] = await Promise.allSettled([
          fetch(`${API_BASE_URL}/dashboard/levels`, { headers }).then((r) => r.ok ? r.json() : []),
          fetch(`${API_BASE_URL}/courses`, { headers }).then((r) => r.ok ? r.json() : []),
          fetch(`${API_BASE_URL}/webinar/next`, { headers }).then((r) => r.ok ? r.json() : null),
        ]);

        if (levelsRes.status === 'fulfilled' && Array.isArray(levelsRes.value) && levelsRes.value.length > 0) {
          setDynamicLevels(levelsRes.value);
        }
        if (coursesRes.status === 'fulfilled' && Array.isArray(coursesRes.value) && coursesRes.value.length > 0) {
          setDynamicCourses(coursesRes.value);
        }
        if (webinarRes.status === 'fulfilled' && webinarRes.value?.data) {
          setDynamicWebinar(webinarRes.value.data);
        }
      } catch (err) {
        console.warn('Chatbot background dynamic sync:', err);
      }
    };

    fetchDynamicData();
  }, []);

  // Listen for global custom event to open chat
  useEffect(() => {
    const handleOpenChat = (e: any) => {
      setIsOpen(true);
      if (e.detail?.mode === 'center') {
        setIsCentered(true);
      }
      if (e.detail?.message) {
        setTimeout(() => handleSendMessage(e.detail.message), 300);
      }
    };
    window.addEventListener('open-art-advisor', handleOpenChat);
    return () => window.removeEventListener('open-art-advisor', handleOpenChat);
  }, []);

  // Escape key listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        if (isCentered) {
          setIsCentered(false);
        } else {
          setIsOpen(false);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isCentered]);

  // Load chat history from sessionStorage
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem('rah_vraj_chat_v3');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
        }
      }
    } catch (_) {}
  }, []);

  // Save chat history to sessionStorage
  useEffect(() => {
    try {
      if (messages.length > 0) {
        sessionStorage.setItem('rah_vraj_chat_v3', JSON.stringify(messages));
      }
    } catch (_) {}
  }, [messages]);

  // Scroll to bottom
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading, isOpen]);

  // Text-to-Speech
  const speakMessage = (id: string, text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (currentlySpeakingId === id) {
      window.speechSynthesis.cancel();
      setCurrentlySpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();

    const cleanText = text
      .replace(/\[(.*?)\]\(.*?\)/g, '$1')
      .replace(/[*_#`•]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const pleasantVoice = voices.find(
      v => (v.lang.includes('en') || v.lang.includes('IN')) && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha'))
    );
    if (pleasantVoice) utterance.voice = pleasantVoice;

    utterance.onend = () => setCurrentlySpeakingId(null);
    utterance.onerror = () => setCurrentlySpeakingId(null);

    speechRef.current = utterance;
    setCurrentlySpeakingId(id);
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setCurrentlySpeakingId(null);
  };

  // Speech Recognition (Voice Input)
  const toggleVoiceInput = () => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Voice dictation is supported in Google Chrome, Microsoft Edge, and Safari.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-IN';

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);

      recognition.onresult = (event: any) => {
        const transcript = event.results[0]?.[0]?.transcript;
        if (transcript) {
          setInput(transcript);
          setTimeout(() => handleSendMessage(transcript), 200);
        }
      };

      recognition.start();
    } catch (err) {
      console.warn('Speech recognition error:', err);
      setIsListening(false);
    }
  };

  // Send message
  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || isLoading) return;

    stopSpeaking();

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: query
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      // Lightweight payload serialization to avoid 413 Payload Too Large
      const compactLevels = Array.isArray(dynamicLevels) ? dynamicLevels.map((l: any) => ({
        code: l.code || l.levelCode,
        name: l.name || l.title,
        price: l.price,
        offerActive: l.offerActive,
        offerTitle: l.offerTitle,
        discountValue: l.discountValue,
        discountType: l.discountType,
        installmentsEnabled: l.installmentsEnabled,
        totalInstallments: l.totalInstallments
      })) : [];

      const compactCourses = Array.isArray(dynamicCourses) ? dynamicCourses.map((c: any) => ({
        id: c.id,
        title: c.title,
        level: c.level,
        category: c.category
      })) : [];

      const compactWebinar = dynamicWebinar ? {
        scheduledAt: dynamicWebinar.scheduledAt,
        title: dynamicWebinar.title
      } : null;

      const payload = JSON.stringify({
        messages: newMessages.slice(-8).map(m => ({ role: m.role, content: m.content })),
        dynamicData: {
          levels: compactLevels,
          courses: compactCourses,
          webinar: compactWebinar
        }
      });

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload
      });

      if (!response.ok) {
        throw new Error(`Server error ${response.status}`);
      }

      const data = await response.json();
      const assistantText = data?.message || '';
      const action = data?.action || null;

      const assistantMsgId = `${Date.now()}-a`;
      setMessages(prev => [
        ...prev,
        {
          id: assistantMsgId,
          role: 'assistant',
          content: assistantText,
          action: action
        }
      ]);

      if (isVoiceEnabled && assistantText) {
        speakMessage(assistantMsgId, assistantText);
      }
    } catch (err) {
      console.error('Chat error:', err);
      // Instant graceful client-side fallback
      const fallbackText = matchAndAnswerAcademyQuery(
        query,
        dynamicLevels,
        dynamicCourses,
        dynamicWebinar
      );

      const fallbackMsgId = `${Date.now()}-err`;
      setMessages(prev => [
        ...prev,
        {
          id: fallbackMsgId,
          role: 'assistant',
          content: fallbackText,
          action: null
        }
      ]);

      if (isVoiceEnabled && fallbackText) {
        speakMessage(fallbackMsgId, fallbackText);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetChat = () => {
    stopSpeaking();
    sessionStorage.removeItem('rah_vraj_chat_v3');
    setMessages([INITIAL_WELCOME_MESSAGE]);
  };

  // Safe markdown link and formatting parser
  const renderFormattedContent = (content: string) => {
    const lines = content.split('\n');

    return lines.map((line, idx) => {
      const linkRegex = /\[(.*?)\]\((.*?)\)/g;
      const parts = [];
      let lastIndex = 0;
      let match;

      while ((match = linkRegex.exec(line)) !== null) {
        if (match.index > lastIndex) {
          parts.push(line.substring(lastIndex, match.index));
        }
        const linkText = match[1];
        const linkUrl = match[2];
        parts.push(
          <Link
            key={match.index}
            href={linkUrl}
            onClick={() => {
              setIsOpen(false);
              setIsCentered(false);
            }}
            className="inline-flex items-center gap-1 font-semibold text-[#c45a28] hover:text-[#9e3f16] underline underline-offset-3 decoration-[#c45a28]/60 transition-colors"
          >
            {linkText}
            <ExternalLink size={11} className="inline opacity-80" />
          </Link>
        );
        lastIndex = match.index + match[0].length;
      }
      if (lastIndex < line.length) {
        parts.push(line.substring(lastIndex));
      }

      const renderedParts = parts.map((part, pIdx) => {
        if (typeof part === 'string') {
          const boldSplit = part.split(/\*\*(.*?)\*\*/g);
          return boldSplit.map((seg, sIdx) =>
            sIdx % 2 === 1 ? <strong key={`${pIdx}-${sIdx}`} className="font-bold text-[#1c1917]">{seg}</strong> : seg
          );
        }
        return part;
      });

      if (line.trim().startsWith('•') || line.trim().startsWith('*')) {
        return (
          <div key={idx} className="flex items-start gap-2 my-1 pl-0.5 text-sm text-stone-800 leading-relaxed">
            <span className="text-[#c45a28] font-black text-sm leading-none select-none mt-1">•</span>
            <div className="flex-1">{renderedParts}</div>
          </div>
        );
      }

      if (!line.trim()) {
        return <div key={idx} className="h-2" />;
      }

      return (
        <p key={idx} className="my-1 text-sm text-stone-800 leading-relaxed">
          {renderedParts}
        </p>
      );
    });
  };

  if (isAdminPage) return null;

  const hasUserMessages = messages.some(m => m.role === 'user');

  // Chat window body
  const renderChatBody = (inCenterModal: boolean) => (
    <>
      {/* ─── EVM ERP STYLE HEADER ─── */}
      <div className="relative flex items-center justify-between px-4 py-3.5 bg-gradient-to-r from-[#8f3611] via-[#b84c1b] to-[#c45a28] text-white flex-shrink-0 overflow-hidden shadow-sm select-none">
        {/* Subtle diagonal reflection overlay */}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.12),transparent_50%)]" />

        {/* Advisor Identity */}
        <div className="relative flex items-center gap-3 min-w-0">
          <span className="w-9 h-9 text-sm rounded-full bg-white/20 border border-white/30 text-white font-bold flex items-center justify-center flex-shrink-0 select-none shadow-md ring-2 ring-white/25">
            V
          </span>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm leading-none tracking-wide text-white">Vraj</h3>
              <span className="rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white/90 backdrop-blur-xs">
                Art Advisor
              </span>
            </div>
            <p className="mt-1 flex items-center gap-1.5 text-white/90 text-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 shadow-[0_0_6px_rgba(110,231,183,0.8)]" />
              Ravishing Art Hub · Online
            </p>
          </div>
        </div>

        {/* Top Controls */}
        <div className="relative flex items-center gap-1">
          {/* Voice Output Toggle */}
          <button
            onClick={() => {
              const nextState = !isVoiceEnabled;
              setIsVoiceEnabled(nextState);
              if (!nextState) stopSpeaking();
            }}
            title={isVoiceEnabled ? 'Voice: ON (Click to mute)' : 'Voice: OFF (Click to listen)'}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              isVoiceEnabled ? 'bg-amber-400 text-stone-950 shadow-xs' : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}
          >
            {isVoiceEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
          </button>

          {/* Expand / Minimize */}
          <button
            onClick={() => setIsCentered(!isCentered)}
            title={inCenterModal ? 'Dock to bottom-right' : 'Expand full view'}
            className="text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors p-1.5 cursor-pointer"
          >
            {inCenterModal ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
          </button>

          {/* Close */}
          <button
            onClick={() => {
              stopSpeaking();
              setIsOpen(false);
              setIsCentered(false);
            }}
            title="Close chat"
            className="text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors p-1.5 cursor-pointer"
          >
            <X size={15} />
          </button>
        </div>
      </div>

      {/* ─── MESSAGES CONTAINER ─── */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3.5 scroll-smooth bg-[#fbfbfc]">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';

          return (
            <div
              key={msg.id}
              className={`flex gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row items-start'}`}
            >
              {!isUser && (
                <span className="w-7 h-7 text-xs rounded-full bg-gradient-to-tr from-[#8f3611] to-[#c45a28] text-white font-bold flex items-center justify-center flex-shrink-0 select-none shadow-xs ring-2 ring-white/30 mt-0.5">
                  V
                </span>
              )}

              <div className={`max-w-[84%] flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
                <div
                  className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-xs ${
                    isUser
                      ? 'bg-gradient-to-tr from-[#9e3f16] via-[#c45a28] to-[#e0783f] text-white rounded-tr-sm shadow-[0_4px_14px_rgba(196,90,40,0.25)] whitespace-pre-wrap'
                      : 'bg-white border border-stone-200/80 text-stone-700 rounded-tl-sm'
                  }`}
                >
                  {isUser ? msg.content : renderFormattedContent(msg.content)}
                </div>

                {!isUser && msg.action && (
                  <Link
                    href={msg.action.path}
                    onClick={() => {
                      setIsOpen(false);
                      setIsCentered(false);
                    }}
                    className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-[#c45a28] bg-[#c45a28]/8 hover:bg-[#c45a28]/15 border border-[#c45a28]/20 px-3 py-1.5 rounded-full transition-colors cursor-pointer shadow-xs active:scale-95"
                  >
                    {msg.action.label} <ExternalLink size={12} />
                  </Link>
                )}

                {!isUser && (
                  <div className="flex items-center gap-2 mt-1 ml-1">
                    <button
                      onClick={() => speakMessage(msg.id, msg.content)}
                      className="text-[11px] text-stone-400 hover:text-[#c45a28] flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      {currentlySpeakingId === msg.id ? (
                        <>
                          <VolumeX size={12} className="text-[#c45a28]" />
                          <span className="text-[#c45a28] font-medium">Mute</span>
                        </>
                      ) : (
                        <>
                          <Volume2 size={12} />
                          <span>Listen</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* TYPING INDICATOR */}
        {isLoading && (
          <div className="flex gap-2.5 items-end">
            <span className="w-7 h-7 text-xs rounded-full bg-gradient-to-tr from-[#8f3611] to-[#c45a28] text-white font-bold flex items-center justify-center flex-shrink-0 select-none shadow-xs ring-2 ring-white/30">
              V
            </span>
            <div className="bg-white border border-stone-200/80 shadow-xs rounded-2xl rounded-tl-sm px-3.5 py-2.5 flex gap-1.5 items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-[#c45a28]/60 animate-bounce" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#c45a28]/60 animate-bounce [animation-delay:0.15s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#c45a28]/60 animate-bounce [animation-delay:0.3s]" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* ─── QUICK STARTER CHIPS (Visible before first question) ─── */}
      {!hasUserMessages && (
        <div className="px-4 pb-3 flex flex-wrap gap-1.5 bg-[#fbfbfc]">
          {QUICK_SUGGESTIONS.map((s, idx) => (
            <button
              key={idx}
              disabled={isLoading}
              onClick={() => handleSendMessage(s.prompt)}
              className="text-xs font-medium bg-white border border-[#c45a28]/25 text-[#9e3f16] hover:border-[#c45a28]/60 hover:bg-[#c45a28]/8 px-3 py-1.5 rounded-full transition-all cursor-pointer shadow-xs active:scale-95 disabled:opacity-50"
            >
              {s.label}
            </button>
          ))}
        </div>
      )}

      {/* ─── EVM ERP STYLE INPUT BAR ─── */}
      <div className="border-t border-stone-200/80 px-3 py-3 bg-white flex items-end gap-2 flex-shrink-0">
        <div className="flex flex-1 items-end gap-2 rounded-xl border border-stone-200 bg-[#fbfbfc] px-3 py-2 focus-within:border-[#c45a28]/40 focus-within:ring-2 focus-within:ring-[#c45a28]/15 transition-all">
          {/* Voice Mic Button */}
          <button
            type="button"
            onClick={toggleVoiceInput}
            title={isListening ? 'Listening... click to stop' : 'Click to speak your question'}
            className={`p-1 rounded-full transition-colors cursor-pointer flex-shrink-0 ${
              isListening ? 'text-rose-600 animate-pulse' : 'text-stone-400 hover:text-[#c45a28]'
            }`}
          >
            {isListening ? <MicOff size={16} /> : <Mic size={16} />}
          </button>

          {/* Text Input */}
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder={isListening ? 'Listening to your voice...' : 'Ask about resin art, courses, pricing...'}
            rows={1}
            disabled={isLoading}
            className="flex-1 resize-none text-sm text-stone-800 placeholder-stone-400 outline-none bg-transparent leading-relaxed max-h-24 overflow-y-auto"
          />

          {/* New conversation reset */}
          <button
            type="button"
            onClick={handleResetChat}
            title="Start new conversation"
            className="text-stone-400 hover:text-[#c45a28] transition-colors p-1 cursor-pointer flex-shrink-0"
          >
            <RotateCcw size={14} />
          </button>
        </div>

        {/* Send Button */}
        <button
          type="button"
          onClick={() => handleSendMessage()}
          disabled={!input.trim() || isLoading}
          className="bg-gradient-to-tr from-[#9e3f16] via-[#c45a28] to-[#e0783f] hover:brightness-105 disabled:opacity-40 text-white rounded-full w-9 h-9 flex items-center justify-center flex-shrink-0 transition-all cursor-pointer disabled:cursor-not-allowed shadow-md shadow-[#9e3f16]/25"
        >
          <Send size={14} className="-mr-0.5" />
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* ─── EVM ERP STYLE FLOATING LAUNCHER BUTTON ─── */}
      <div className="fixed bottom-6 right-4 sm:right-6 z-[90] flex items-center gap-3">
        <button
          onClick={() => {
            if (isOpen) {
              stopSpeaking();
              setIsOpen(false);
              setIsCentered(false);
            } else {
              setIsOpen(true);
            }
          }}
          aria-label="Toggle Art Advisor Chat"
          className="flex items-center gap-2 text-white transition-all cursor-pointer rounded-2xl px-4 py-2.5 bg-gradient-to-r from-[#8f3611] via-[#b84c1b] to-[#c45a28] hover:brightness-105 shadow-lg shadow-[#8f3611]/30 active:scale-95 border border-white/20"
        >
          {isOpen ? (
            <>
              <X size={18} />
              <span className="text-sm font-semibold">Close</span>
            </>
          ) : (
            <>
              <MessageSquare size={18} />
              <span className="text-sm font-semibold">Chat with Vraj</span>
            </>
          )}
        </button>
      </div>

      {/* ─── CENTER EXPANDED MODAL MODE ─── */}
      {isOpen && isCentered && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 overflow-hidden">
          <div
            onClick={() => setIsCentered(false)}
            className="absolute inset-0 bg-stone-950/60 backdrop-blur-xs animate-in fade-in duration-200"
          />

          <div className="relative z-10 flex flex-col w-full max-w-[620px] h-[min(680px,calc(100dvh-2.5rem))] max-h-[92dvh] rounded-2xl border border-stone-200/80 bg-white shadow-[0_24px_60px_rgba(60,30,10,0.22)] overflow-hidden animate-in zoom-in-95">
            {renderChatBody(true)}
          </div>
        </div>
      )}

      {/* ─── DOCKED BOTTOM-RIGHT POPUP (EVM ERP Style) ─── */}
      {isOpen && !isCentered && (
        <div className="fixed z-[100] inset-x-3 bottom-20 sm:inset-x-auto sm:right-6 sm:bottom-22 sm:w-[410px] md:w-[420px] top-4 sm:top-auto max-h-[calc(100dvh-6.5rem)] h-[min(540px,calc(100dvh-7rem))] flex flex-col rounded-2xl border border-stone-200/80 bg-[#fbfbfc] shadow-[0_24px_60px_rgba(60,30,10,0.22)] overflow-hidden animate-in fade-in slide-in-from-bottom-6">
          {renderChatBody(false)}
        </div>
      )}
    </>
  );
};
