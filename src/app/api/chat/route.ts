import { NextRequest, NextResponse } from 'next/server';
import {
  buildSystemPrompt,
  matchAndAnswerAcademyQuery
} from '@/lib/ai/knowledgeBase';

export const dynamic = 'force-dynamic';
export const maxDuration = 30;

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface DynamicContext {
  levels?: any[];
  courses?: any[];
  webinar?: any;
}

// In-memory cache for dynamic data fetched on the server
let serverCache: {
  levels: any[];
  courses: any[];
  webinar: any;
  cachedAt: number;
} = {
  levels: [],
  courses: [],
  webinar: null,
  cachedAt: 0,
};

const CACHE_TTL_MS = 60 * 1000; // 60 seconds TTL

/**
 * Fetch dynamic levels, courses, and next webinar with fast timeout protection
 */
async function getDynamicServerData(): Promise<DynamicContext> {
  const now = Date.now();
  if (serverCache.cachedAt && (now - serverCache.cachedAt) < CACHE_TTL_MS && serverCache.levels.length > 0) {
    return {
      levels: serverCache.levels,
      courses: serverCache.courses,
      webinar: serverCache.webinar,
    };
  }

  const backendUrlsToTry = [
    process.env.INTERNAL_API_URL,
    process.env.BACKEND_API_URL,
    process.env.NEXT_PUBLIC_API_URL,
    'https://api.ravishingarthub.com/api',
  ].filter(Boolean) as string[];

  for (const baseUrl of backendUrlsToTry) {
    try {
      const cleanBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 800);

      const [levelsRes, coursesRes, webinarRes] = await Promise.allSettled([
        fetch(`${cleanBase}/dashboard/levels`, { signal: controller.signal }).then((r) => r.ok ? r.json() : []),
        fetch(`${cleanBase}/courses`, { signal: controller.signal }).then((r) => r.ok ? r.json() : []),
        fetch(`${cleanBase}/webinar/next`, { signal: controller.signal }).then((r) => r.ok ? r.json() : null),
      ]);

      clearTimeout(timeoutId);

      const levels = (levelsRes.status === 'fulfilled' && Array.isArray(levelsRes.value) && levelsRes.value.length > 0)
        ? levelsRes.value
        : [];
      const courses = (coursesRes.status === 'fulfilled' && Array.isArray(coursesRes.value) && coursesRes.value.length > 0)
        ? coursesRes.value
        : [];
      const webinar = (webinarRes.status === 'fulfilled' && webinarRes.value?.data)
        ? webinarRes.value.data
        : null;

      if (levels.length > 0 || courses.length > 0) {
        serverCache = {
          levels: levels.length > 0 ? levels : serverCache.levels,
          courses: courses.length > 0 ? courses : serverCache.courses,
          webinar: webinar || serverCache.webinar,
          cachedAt: now,
        };
        return {
          levels: serverCache.levels,
          courses: serverCache.courses,
          webinar: serverCache.webinar,
        };
      }
    } catch (_) {
      // Continue to next or fallback
    }
  }

  return {
    levels: serverCache.levels.length > 0 ? serverCache.levels : undefined,
    courses: serverCache.courses.length > 0 ? serverCache.courses : undefined,
    webinar: serverCache.webinar,
  };
}

/**
 * Detect smart contextual CTA button (EVM ERP style)
 */
function extractContextualAction(text: string, query: string): { label: string; path: string } | null {
  const combined = (text + ' ' + query).toLowerCase();

  if (combined.includes('webinar') || combined.includes('masterclass') || combined.includes('vrajangna patel') || combined.includes('/webinar')) {
    return { label: 'Register for Live Masterclass', path: '/webinar' };
  }
  if (
    combined.includes('membership') || combined.includes('pricing') || combined.includes('cost') ||
    combined.includes('fee') || combined.includes('tier') || combined.includes('/subscribe') ||
    combined.includes('l0') || combined.includes('l1') || combined.includes('l2') || combined.includes('l3')
  ) {
    return { label: 'Explore Memberships & Pricing', path: '/subscribe' };
  }
  if (combined.includes('course') || combined.includes('curriculum') || combined.includes('preservation') || combined.includes('river table')) {
    return { label: 'View 30 Academy Courses', path: '/subscribe' };
  }
  return null;
}

export async function POST(req: NextRequest) {
  let latestUserMessage = '';
  try {
    const body = await req.json().catch(() => ({}));
    const { messages, dynamicData: clientDynamicData } = body as {
      messages?: ChatMessage[];
      dynamicData?: DynamicContext;
    };

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Messages array is required' }, { status: 400 });
    }

    latestUserMessage = messages[messages.length - 1]?.content || '';
    const isOngoing = messages.length > 1;
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

    // Resolve dynamic context (levels, courses, webinar)
    let dynamicContext: DynamicContext = {};
    if (clientDynamicData?.levels && clientDynamicData.levels.length > 0) {
      dynamicContext = clientDynamicData;
    } else {
      dynamicContext = await getDynamicServerData();
    }

    // ─── 1. REAL AI ENGINE (Google Gemini 3.5 Flash Lite) ───
    if (apiKey) {
      const systemPrompt = buildSystemPrompt(
        dynamicContext.levels,
        dynamicContext.courses,
        dynamicContext.webinar,
        isOngoing
      );

      const contents = messages.map((m) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      }));

      // Models verified for current Gemini API key
      const modelsToTry = [
        'gemini-3.5-flash-lite',
        'gemini-3.8-flash',
        'gemini-flash-latest'
      ];

      for (const model of modelsToTry) {
        try {
          const geminiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 6000);

          const geminiRes = await fetch(geminiEndpoint, {
            method: 'POST',
            signal: controller.signal,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents,
              systemInstruction: {
                parts: [{ text: systemPrompt }]
              },
              generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 1024,
              }
            })
          });

          clearTimeout(timeoutId);

          if (geminiRes.ok) {
            const result = await geminiRes.json();
            const replyText = result.candidates?.[0]?.content?.parts?.[0]?.text;

            if (replyText) {
              const action = extractContextualAction(replyText, latestUserMessage);
              return NextResponse.json({
                message: replyText,
                action
              });
            }
          }
        } catch (err) {
          console.warn(`Model ${model} attempt failed:`, err);
        }
      }
    }

    // ─── 2. INSTANT FALLBACK ENGINE (Contextual & Dynamic) ───
    const fallbackText = matchAndAnswerAcademyQuery(
      latestUserMessage,
      dynamicContext.levels,
      dynamicContext.courses,
      dynamicContext.webinar,
      isOngoing
    );

    const action = extractContextualAction(fallbackText, latestUserMessage);
    return NextResponse.json({
      message: fallbackText,
      action
    });
  } catch (error: any) {
    console.error('Chatbot API error:', error);
    const fallbackText = matchAndAnswerAcademyQuery(latestUserMessage, undefined, undefined, undefined, true);
    const action = extractContextualAction(fallbackText, latestUserMessage);
    return NextResponse.json({
      message: fallbackText,
      action
    });
  }
}
