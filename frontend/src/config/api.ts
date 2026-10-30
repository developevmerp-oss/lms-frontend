const isBrowser = typeof window !== 'undefined';
const isLocalhost = isBrowser && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

// In production browser on Vercel, use same-origin /api so Next.js rewrites proxy it with ZERO CORS preflight delays.
export const API_BASE_URL = isBrowser
  ? (isLocalhost ? (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api') : `${window.location.origin}/api`)
  : (process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || 'https://api.ravishingarthub.com/api');

export const getApiUrl = (path: string): string => {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const baseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
  return `${baseUrl}${cleanPath}`;
};

export const getImageUrl = (url?: string): string => {
  if (!url || typeof url !== 'string') return '/images/placeholder-art.jpg';
  let clean = url.replace(/\\/g, '/').trim();
  if (clean.startsWith('http://') || clean.startsWith('https://') || clean.startsWith('data:')) {
    return clean;
  }
  if (!clean.startsWith('/')) clean = '/' + clean;

  if (isLocalhost) {
    return `http://localhost:5000${clean}`;
  }
  // Same-origin rewrite proxies /uploads directly without cross-origin latency
  return clean;
};

export const getFileUrl = (url?: string): string => {
  if (!url || typeof url !== 'string') return '';
  let clean = url.replace(/\\/g, '/').trim();
  if (clean.startsWith('http://') || clean.startsWith('https://') || clean.startsWith('data:')) {
    return clean;
  }
  if (!clean.startsWith('/')) clean = '/' + clean;

  if (isLocalhost) {
    return `http://localhost:5000${clean}`;
  }
  return clean;
};

