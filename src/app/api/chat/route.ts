import { NextRequest, NextResponse } from 'next/server';
import {
  buildSystemPrompt,
  formatDynamicLevelsText,
  matchAndAnswerAcademyQuery,
  LEVEL_TIERS_INFO,
  COURSES_CATALOG,
  MENTOR_PROFILE,
  COMMON_FAQS
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
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

    // Fetch or resolve dynamic context (levels, courses, webinar)
    let dynamicContext: DynamicContext = {};

    // 1. If client sent dynamic data (already loaded on page), use it
    if (clientDynamicData?.levels && clientDynamicData.levels.length > 0) {
      dynamicContext = clientDynamicData;
    } else {
      // 2. Otherwise fetch or use server cached data
      dynamicContext = await getDynamicServerData();
    }

    // IF GEMINI API KEY IS CONFIGURED: Call Google Gemini with strict 3.5s timeout
    if (apiKey) {
      const systemPrompt = buildSystemPrompt(
        dynamicContext.levels,
        dynamicContext.courses,
        dynamicContext.webinar
      );

      const contents = messages.map((m) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      }));

      // Standard Gemini production models
      const modelsToTry = ['gemini-1.5-flash', 'gemini-2.0-flash'];

      for (const model of modelsToTry) {
        try {
          const geminiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?alt=sse&key=${apiKey}`;

          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 3500);

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
                temperature: 0.6,
                maxOutputTokens: 1024,
              }
            })
          });

          clearTimeout(timeoutId);

          if (geminiRes.ok && geminiRes.body) {
            const encoder = new TextEncoder();
            const decoder = new TextDecoder();

            const stream = new ReadableStream({
              async start(controller) {
                const reader = geminiRes.body!.getReader();
                let buffer = '';

                try {
                  while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    buffer += decoder.decode(value, { stream: true });
                    const lines = buffer.split('\n');
                    buffer = lines.pop() || '';

                    for (const line of lines) {
                      if (line.startsWith('data: ')) {
                        const jsonStr = line.slice(6).trim();
                        if (jsonStr === '[DONE]') continue;
                        try {
                          const parsed = JSON.parse(jsonStr);
                          const textChunk = parsed.candidates?.[0]?.content?.parts?.[0]?.text;
                          if (textChunk) {
                            controller.enqueue(encoder.encode(textChunk));
                          }
                        } catch (_) {}
                      }
                    }
                  }
                } catch (err) {
                  controller.error(err);
                } finally {
                  controller.close();
                }
              }
            });

            return new Response(stream, {
              headers: {
                'Content-Type': 'text/plain; charset=utf-8',
                'Cache-Control': 'no-cache, no-transform',
              }
            });
          }
        } catch (err) {
          console.warn(`Model ${model} stream attempt failed, trying next fallback:`, err);
        }
      }
    }

    // FALLBACK: Fast built-in academy matching engine using dynamic levels and courses
    const matchedResponse = matchAndAnswerAcademyQuery(
      latestUserMessage,
      dynamicContext.levels,
      dynamicContext.courses,
      dynamicContext.webinar
    );

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const words = matchedResponse.split(' ');
        for (let i = 0; i < words.length; i++) {
          const chunk = words[i] + (i < words.length - 1 ? ' ' : '');
          controller.enqueue(encoder.encode(chunk));
          await new Promise((r) => setTimeout(r, 6));
        }
        controller.close();
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
      }
    });
  } catch (error: any) {
    console.error('Chatbot API error:', error);
    const fallbackText = matchAndAnswerAcademyQuery(latestUserMessage);
    return new Response(fallbackText, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
      }
    });
  }
}
