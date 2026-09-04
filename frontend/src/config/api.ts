export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const getApiUrl = (path: string): string => {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  // If API_BASE_URL already ends with /api, make sure we append properly
  const baseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
  return `${baseUrl}${cleanPath}`;
};

export const getImageUrl = (url?: string): string => {
  if (!url || typeof url !== 'string') return '/images/placeholder-art.jpg';
  // Normalize Windows backslashes \ to standard web forward slashes /
  const normalized = url.replace(/\\/g, '/');
  if (normalized.startsWith('http://') || normalized.startsWith('https://') || normalized.startsWith('data:')) {
    return normalized;
  }
  const cleanUrl = normalized.startsWith('/') ? normalized : `/${normalized}`;
  
  // Detect live site vs local development
  const isLiveSite = typeof window !== 'undefined' && window.location.hostname.includes('ravishingarthub.com');
  
  let origin = 'https://api.ravishingarthub.com';
  if (!isLiveSite && API_BASE_URL.startsWith('http://localhost')) {
    origin = 'http://localhost:5000';
  } else if (API_BASE_URL && API_BASE_URL.startsWith('http')) {
    origin = API_BASE_URL.replace(/\/api\/?$/, '');
  }

  return `${origin}${cleanUrl}`;
};

