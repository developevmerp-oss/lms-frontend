export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const getApiUrl = (path: string): string => {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  // If API_BASE_URL already ends with /api, make sure we append properly
  const baseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
  return `${baseUrl}${cleanPath}`;
};

export const getImageUrl = (url?: string): string => {
  if (!url || typeof url !== 'string') return '/images/placeholder-art.jpg';
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
    return url;
  }
  const cleanUrl = url.startsWith('/') ? url : `/${url}`;
  const origin = API_BASE_URL.replace(/\/api\/?$/, '');
  return `${origin}${cleanUrl}`;
};

