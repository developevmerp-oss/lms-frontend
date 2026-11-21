'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sparkles,
  X,
  Send,
  RotateCcw,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  ExternalLink,
  ChevronDown,
  Square,
  Radio,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { API_BASE_URL } from '@/config/api';
import { matchAndAnswerAcademyQuery } from '@/lib/ai/knowledgeBase';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp?: number;
}

const QUICK_SUGGESTIONS = [
  { label: '🎨 Complete Beginner Guide', prompt: 'I am a complete beginner with zero experience. How do I start resin art?' },
  { label: '💎 Memberships & Live Pricing', prompt: 'What are the current membership levels, prices, and special offers in the academy?' },
  { label: '🌸 Wedding Varmala & Flower Preservation', prompt: 'Which course teaches wedding varmala and flower preservation?' },
  { label: '🪵 Live-Edge River Tables', prompt: 'How do you make deep wood and resin river tables?' },
  { label: '⏰ Next Live Masterclass Schedule', prompt: 'When is Vrajangna Patel\'s next live masterclass and how can I register?' },
  { label: '💰 How Students Earn ₹50,000/mo', prompt: 'How do students sell resin art and build a ₹50,000/month business?' },
];

export const ArtAdvisorChatbot: React.FC = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isCentered, setIsCentered] = useState(false); // Center popup modal mode
  const [hasInteracted, setHasInteracted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Dynamic Academy Data (Fetched from database & API)
  const [dynamicLevels, setDynamicLevels] = useState<any[]>([]);
  const [dynamicCourses, setDynamicCourses] = useState<any[]>([]);
  const [dynamicWebinar, setDynamicWebinar] = useState<any>(null);

  // Audio Voice States
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [currentlySpeakingId, setCurrentlySpeakingId] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Hide on admin portal so it doesn't obstruct dashboard tables
  const isAdminPage = pathname?.startsWith('/admin');

  // Fetch dynamic levels, courses, and webinar from the database via API
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
        console.warn('Notice: Chatbot background dynamic sync:', err);
      }
    };

    fetchDynamicData();
  }, []);

  // Listen for global custom event to open chat (e.g. from any landing page CTA)
  useEffect(() => {
    const handleOpenChat = (e: any) => {
      setIsOpen(true);
      if (e.detail?.mode === 'center') {
        setIsCentered(true);
      }
    };
    window.addEventListener('open-vraj-chat', handleOpenChat);
    window.addEventListener('open-aura-chat', handleOpenChat);
    return () => {
      window.removeEventListener('open-vraj-chat', handleOpenChat);
      window.removeEventListener('open-aura-chat', handleOpenChat);
    };
  }, []);

  // Close or dock with Escape key
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
      const stored = sessionStorage.getItem('rah_vraj_chat_v2') || sessionStorage.getItem('rah_aura_chat_v2');
      if (stored) {
        setMessages(JSON.parse(stored));
        setHasInteracted(true);
      } else {
        setMessages([
          {
            id: 'init-1',
            role: 'assistant',
            content: `✨ **Hello! I'm Vraj, your AI Art Advisor at Ravishing Art Hub.**\n\nI can match your creative interests with our **30 step-by-step courses**, provide **real-time membership pricing and active offers**, or help you register for master coach **Vrajangna Patel's** next live masterclass!\n\n🔊 **Tip:** Click **Voice Mode** or the speaker button on any reply to hear answers aloud! You can also click the **Maximize icon (⛶)** in the header to expand this chat into a center popup! 🎨`
          }
        ]);
      }
    } catch (_) { }
  }, []);

  // Save chat history
  useEffect(() => {
    if (messages.length > 1) {
      try {
        sessionStorage.setItem('rah_vraj_chat_v2', JSON.stringify(messages));
      } catch (_) { }
    }
  }, [messages]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isLoading]);

  // Clean up speech synthesis when unmounted
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Clean plain text for speech synthesis
  const cleanTextForSpeech = (text: string): string => {
    return text
      .replace(/\[(.*?)\]\(.*?\)/g, '$1')
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/•|\*|#|👉|✨|🎨|🌸|🪵|💎|⏰|☕|💍|🖼️|🧿|🔬|🏆|💰|🔊|🔥|💳/g, '')
      .replace(/₹/g, 'Rupees ')
      .replace(/https?:\/\/\S+/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  };

  // Play audio for a specific message
  const speakMessage = (messageId: string, text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (currentlySpeakingId === messageId) {
      window.speechSynthesis.cancel();
      setCurrentlySpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const clean = cleanTextForSpeech(text);
    if (!clean) return;

    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.rate = 1.0;
    utterance.pitch = 1.05;

    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(
      v => (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Samantha') || v.name.includes('Zira') || v.name.includes('India') || v.lang.includes('en-IN')) && v.lang.startsWith('en')
    );
    if (preferredVoice) utterance.voice = preferredVoice;

    utterance.onstart = () => setCurrentlySpeakingId(messageId);
    utterance.onend = () => setCurrentlySpeakingId(null);
    utterance.onerror = () => setCurrentlySpeakingId(null);

    speechRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setCurrentlySpeakingId(null);
    }
  };

  // Microphone speech-to-text
  const toggleVoiceInput = () => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please type your message.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-IN';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);

      recognition.onresult = (event: any) => {
        const transcript = event.results[0]?.[0]?.transcript;
        if (transcript) {
          setInput(transcript);
          handleSendMessage(transcript);
        }
      };

      recognition.start();
    } catch (e) {
      setIsListening(false);
    }
  };

  // Send message with dynamic data payload and resilient fallback routing
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
    setHasInteracted(true);

    try {
      const payload = JSON.stringify({
        messages: newMessages.map(m => ({ role: m.role, content: m.content })),
        dynamicData: {
          levels: dynamicLevels,
          courses: dynamicCourses,
          webinar: dynamicWebinar
        }
      });

      // Direct call to /api/chat with dynamic data payload
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload
      });

      if (!response || !response.ok || !response.body) {
        throw new Error('Network response was not ok');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantText = '';

      const assistantMsgId = (Date.now() + 1).toString();
      setMessages(prev => [...prev, { id: assistantMsgId, role: 'assistant', content: '' }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        assistantText += chunk;

        setMessages(prev =>
          prev.map(msg =>
            msg.id === assistantMsgId ? { ...msg, content: assistantText } : msg
          )
        );
      }

      if (isVoiceEnabled && assistantText) {
        speakMessage(assistantMsgId, assistantText);
      }
    } catch (err) {
      console.error('Chat error:', err);
      // Instant fail-safe: Answer accurately from local academy knowledge base and dynamic pricing
      const fallbackText = matchAndAnswerAcademyQuery(
        query,
        dynamicLevels,
        dynamicCourses,
        dynamicWebinar
      );

      const fallbackMsgId = (Date.now() + 1).toString();
      setMessages(prev => [
        ...prev,
        {
          id: fallbackMsgId,
          role: 'assistant',
          content: fallbackText
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
    sessionStorage.removeItem('rah_vraj_chat_v2');
    sessionStorage.removeItem('rah_aura_chat_v2');
    setMessages([
      {
        id: 'init-reset',
        role: 'assistant',
        content: `✨ **Hello! I'm Vraj, your AI Art Advisor at Ravishing Art Hub.**\n\nI can match your creative interests with our **30 step-by-step courses**, explain how students earn with resin art, or help you join master coach **Vrajangna Patel's** next live masterclass!\n\n🔊 **Tip:** Click **Voice Mode** or the speaker button on any reply to hear answers aloud! 🎨`
      }
    ]);
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
          <div key={idx} className="flex items-start gap-2 my-1.5 pl-1 text-[13px] text-stone-800 leading-relaxed">
            <span className="text-[#c45a28] font-black text-sm leading-none select-none mt-0.5">•</span>
            <div className="flex-1">{renderedParts}</div>
          </div>
        );
      }

      if (!line.trim()) {
        return <div key={idx} className="h-1.5" />;
      }

      return (
        <p key={idx} className="my-1 text-[13px] text-stone-800 leading-relaxed">
          {renderedParts}
        </p>
      );
    });
  };

  if (isAdminPage) return null;

  // The complete internal chat window content
  const renderChatBody = (inCenterModal: boolean) => (
    <>
      {/* Luxury Terracotta Header */}
      <div className="shrink-0 flex items-center justify-between px-4 sm:px-5 py-3.5 sm:py-4 bg-gradient-to-r from-[#8f3611] via-[#b84c1b] to-[#c45a28] text-white border-b border-[#a33f15] shadow-sm select-none">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/20 border border-white/40 text-white shadow-inner backdrop-blur-xs">
            <Sparkles size={18} className="text-amber-200" />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#8f3611]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm sm:text-base font-bold tracking-tight text-white font-display">Vraj AI</h3>
            </div>
            <p className="text-[10px] sm:text-[11px] text-amber-100/90">Ravishing Art Hub • Online</p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {/* Voice Mode Toggle */}
          <button
            onClick={() => {
              const nextState = !isVoiceEnabled;
              setIsVoiceEnabled(nextState);
              if (!nextState) stopSpeaking();
            }}
            title={isVoiceEnabled ? 'Auto-Voice Mode: ON (Click to mute)' : 'Auto-Voice Mode: OFF (Click to hear answers)'}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all border cursor-pointer ${isVoiceEnabled
              ? 'bg-amber-400 text-stone-950 border-amber-300 shadow-xs'
              : 'bg-white/15 text-white border-white/25 hover:bg-white/25'
              }`}
          >
            {isVoiceEnabled ? <Volume2 size={13} className="text-stone-950 animate-pulse" /> : <VolumeX size={13} />}
            <span className="hidden xs:inline">{isVoiceEnabled ? 'Voice ON' : 'Voice'}</span>
          </button>

          {/* Center Popup / Dock Toggle Button */}
          <button
            onClick={() => setIsCentered(!isCentered)}
            title={inCenterModal ? 'Dock to bottom-right' : 'Open in center popup modal'}
            className="p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/20 transition-colors cursor-pointer"
          >
            {inCenterModal ? <Minimize2 size={17} /> : <Maximize2 size={17} />}
          </button>

          {/* Reset conversation */}
          <button
            onClick={handleResetChat}
            title="Restart conversation"
            className="p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/20 transition-colors cursor-pointer"
          >
            <RotateCcw size={16} />
          </button>

          {/* Close */}
          <button
            onClick={() => {
              stopSpeaking();
              setIsOpen(false);
              setIsCentered(false);
            }}
            title="Close chat"
            className="p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/20 transition-colors cursor-pointer"
          >
            {inCenterModal ? <X size={20} /> : <ChevronDown size={20} />}
          </button>
        </div>
      </div>

      {/* Audio Wave Playing Banner */}
      {currentlySpeakingId && (
        <div className="shrink-0 flex items-center justify-between px-4 py-2 bg-gradient-to-r from-amber-50 to-orange-50 border-b border-[#f3d3c0] text-[#9e3f16] text-xs font-semibold animate-pulse">
          <div className="flex items-center gap-2">
            <Radio size={14} className="animate-spin text-[#c45a28]" />
            <span>Vraj is speaking...</span>
          </div>
          <button
            onClick={stopSpeaking}
            className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#c45a28] text-white text-[10px] font-bold hover:bg-[#9e3f16] transition-colors cursor-pointer"
          >
            <Square size={10} className="fill-white" />
            Stop Audio
          </button>
        </div>
      )}

      {/* Messages Container (Warm Canvas Paper Tone) */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5 bg-[#faf7f2]/90 overscroll-contain">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'assistant' && (
              <div className="shrink-0 w-8 h-8 rounded-full bg-[#f3d3c0] border border-[#e0783f]/40 text-[#c45a28] flex items-center justify-center mt-0.5 shadow-xs">
                <Sparkles size={14} />
              </div>
            )}

            <div
              className={`relative ${inCenterModal ? 'max-w-[82%]' : 'max-w-[86%]'} rounded-2xl px-4 py-3 ${msg.role === 'user'
                ? 'bg-[#231b15] text-[#fff6f0] border border-[#3e3128] rounded-tr-xs shadow-sm text-[13px] sm:text-[14px] leading-relaxed'
                : 'bg-white border border-[#eadfd4] text-stone-900 rounded-tl-xs shadow-[0_6px_20px_-10px_rgba(100,50,20,0.12)]'
                }`}
            >
              {msg.role === 'user' ? (
                <p className="text-[13px] sm:text-[14px] leading-relaxed whitespace-pre-wrap">{msg.content}</p>
              ) : (
                <div>
                  {renderFormattedContent(msg.content)}

                  {/* Message Footer: Listen to Voice Button */}
                  <div className="mt-2.5 pt-2 border-t border-stone-100 flex items-center justify-between">
                    <button
                      onClick={() => speakMessage(msg.id, msg.content)}
                      title={currentlySpeakingId === msg.id ? 'Stop audio' : 'Listen to this response'}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${currentlySpeakingId === msg.id
                        ? 'bg-[#c45a28] text-white shadow-xs'
                        : 'bg-[#f8ede4] hover:bg-[#c45a28] text-[#9e3f16] hover:text-white border border-[#f3d3c0]'
                        }`}
                    >
                      {currentlySpeakingId === msg.id ? (
                        <>
                          <Square size={11} className="fill-white" />
                          <span>Stop Audio</span>
                        </>
                      ) : (
                        <>
                          <Volume2 size={12} />
                          <span>Listen to Answer</span>
                        </>
                      )}
                    </button>

                    <span className="text-[10px] text-stone-400 font-medium">Ravishing Art Hub</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Typing Animation */}
        {isLoading && (
          <div className="flex items-center gap-2 text-stone-400 text-xs pl-10">
            <span className="flex gap-1.5 items-center bg-white border border-[#eadfd4] px-3.5 py-1.5 rounded-full shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#c45a28] animate-bounce" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#c45a28] animate-bounce [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#c45a28] animate-bounce [animation-delay:0.4s]" />
              <span className="ml-1 text-[11px] font-bold text-stone-600">Vraj is consulting...</span>
            </span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Suggestion Pills (Hidden Native Scrollbar) */}
      <div
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        className="shrink-0 px-3 py-2 bg-[#fffdfa] border-t border-[#f0e6dc] overflow-x-auto flex items-center gap-1.5 flex-nowrap [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        {QUICK_SUGGESTIONS.map((s, idx) => (
          <button
            key={idx}
            disabled={isLoading}
            onClick={() => handleSendMessage(s.prompt)}
            className="shrink-0 text-[11px] font-bold bg-[#fbf3ec] hover:bg-[#c45a28] text-[#9e3f16] hover:text-white border border-[#f3d3c0] hover:border-[#c45a28] px-3 py-1.5 rounded-full transition-all cursor-pointer whitespace-nowrap active:scale-95 disabled:opacity-50"
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Input & Voice Controls */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="shrink-0 p-3 sm:p-3.5 bg-white border-t border-[#eadfd4] flex items-center gap-2"
      >
        {/* Microphone button for voice input */}
        <button
          type="button"
          onClick={toggleVoiceInput}
          title={isListening ? 'Listening... click to stop' : 'Click to speak your question'}
          className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all cursor-pointer shrink-0 ${isListening
            ? 'bg-rose-500 text-white border-rose-600 animate-pulse shadow-md'
            : 'bg-[#fbf3ec] text-[#9e3f16] hover:bg-[#c45a28] hover:text-white border-[#f3d3c0]'
            }`}
        >
          {isListening ? <MicOff size={16} /> : <Mic size={16} />}
        </button>

        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={isListening ? 'Listening to your voice...' : 'Ask about courses, resin projects, pricing...'}
          disabled={isLoading}
          className="flex-1 text-[13px] sm:text-[14px] bg-stone-50 border border-[#eadfd4] rounded-full px-4 py-2.5 text-stone-900 placeholder:text-stone-400 focus:outline-hidden focus:ring-2 focus:ring-[#c45a28]/40 focus:border-[#c45a28] focus:bg-white transition-all min-w-0"
        />

        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#9e3f16] via-[#c45a28] to-[#e0783f] text-white flex items-center justify-center shadow-md hover:scale-105 active:scale-95 disabled:opacity-40 disabled:hover:scale-100 transition-all cursor-pointer shrink-0"
        >
          <Send size={15} className="-mr-0.5" />
        </button>
      </form>
    </>
  );

  return (
    <>
      {/* ─── FLOATING LAUNCHER BUTTON (Bottom-Right) ─── */}
      <div className="fixed bottom-6 right-6 z-[90] flex items-center gap-3">
        {!isOpen && !hasInteracted && (
          <div
            onClick={() => setIsOpen(true)}
            className="hidden sm:flex items-center gap-2.5 rounded-full border border-[#f3d3c0] bg-white/95 px-4 py-2.5 shadow-[0_12px_28px_-6px_rgba(196,90,40,0.28)] backdrop-blur-md cursor-pointer animate-bounce duration-1000"
          >
            <Sparkles size={16} className="text-[#c45a28]" />
            <span className="text-xs font-bold text-stone-800 tracking-tight">Ask Vraj AI</span>
            <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-[#f8ede4] text-[#c45a28] border border-[#f3d3c0]">Voice Mode</span>
          </div>
        )}

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
          aria-label="Toggle AI Art Advisor Chat"
          className="relative group flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-tr from-[#9e3f16] via-[#c45a28] to-[#e0783f] text-white shadow-[0_14px_30px_-6px_rgba(196,90,40,0.55)] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer border-2 border-white/60"
        >
          {isOpen ? (
            <X size={26} className="transition-transform group-hover:rotate-90 duration-300" />
          ) : (
            <>
              <Sparkles size={24} className="animate-pulse text-amber-200" />
              <span className="absolute -top-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-4 w-4 bg-amber-500 border-2 border-white" />
              </span>
            </>
          )}
        </button>
      </div>

      {/* ─── OPTION A: CENTER POPUP MODAL (Screen Safe Flexbox Centering) ─── */}
      {isOpen && isCentered && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 overflow-hidden">
          {/* Backdrop */}
          <div
            onClick={() => setIsCentered(false)}
            className="absolute inset-0 bg-stone-950/60 backdrop-blur-sm animate-in fade-in duration-200"
          />

          {/* Modal Container — Always within screen view */}
          <div className="relative z-10 flex flex-col w-full max-w-[620px] h-[min(650px,calc(100dvh-2.5rem))] max-h-[92dvh] rounded-[24px] sm:rounded-[28px] border border-[#eadfd4] bg-[#fffdfa] shadow-[0_32px_80px_-15px_rgba(30,15,5,0.6)] overflow-hidden animate-in zoom-in-95">
            {renderChatBody(true)}
          </div>
        </div>
      )}

      {/* ─── OPTION B: DOCKED BOTTOM-RIGHT POPUP (Screen-Safe, Header Always Clickable) ─── */}
      {isOpen && !isCentered && (
        <div className="fixed z-[100] inset-x-3 bottom-20 sm:inset-x-auto sm:right-6 sm:bottom-22 sm:w-[410px] md:w-[420px] top-4 sm:top-auto max-h-[calc(100dvh-6rem)] h-[min(520px,calc(100dvh-6.5rem))] flex flex-col rounded-[24px] sm:rounded-[28px] border border-[#eadfd4] bg-[#fffdfa] shadow-[0_24px_60px_-15px_rgba(60,30,10,0.35)] overflow-hidden animate-in fade-in slide-in-from-bottom-6">
          {renderChatBody(false)}
        </div>
      )}
    </>
  );
};
