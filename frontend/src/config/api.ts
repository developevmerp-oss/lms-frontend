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
  
  let baseUrl = API_BASE_URL;
  if (!baseUrl || !baseUrl.startsWith('http')) {
    baseUrl = 'https://api.ravishingarthub.com/api';
  }
  const origin = baseUrl.replace(/\/api\/?$/, '');
  return `${origin}${cleanUrl}`;
};

