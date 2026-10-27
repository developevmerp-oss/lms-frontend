export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

export const getApiUrl = (path: string): string => {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  // If API_BASE_URL already ends with /api, make sure we append properly
  const baseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
  return `${baseUrl}${cleanPath}`;
};

export const getImageUrl = (url?: string): string => {
  if (!url || typeof url !== 'string') return '/images/placeholder-art.jpg';
  // Normalize Windows backslashes \ to standard web forward slashes /
  let clean = url.replace(/\\/g, '/');
  if (clean.startsWith('http://') || clean.startsWith('https://') || clean.startsWith('data:')) {
    return clean;
  }
  if (!clean.startsWith('/')) clean = '/' + clean;

  // If already pointing to frontend public /images, /icons, /fonts, or /svg
  if (clean.startsWith('/images/') || clean.startsWith('/icons/') || clean.startsWith('/fonts/') || clean.startsWith('/svg/')) {
    return clean;
  }

  // Local development vs Live production environment
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    return `http://localhost:5001${clean}`;
  }
  return `https://api.ravishingarthub.com${clean}`;
};

export const getFileUrl = (url?: string): string => {
  if (!url || typeof url !== 'string') return '';
  let clean = url.replace(/\\/g, '/').trim();
  if (clean.startsWith('http://') || clean.startsWith('https://') || clean.startsWith('data:')) {
    return clean;
  }
  if (!clean.startsWith('/')) clean = '/' + clean;

  if (clean.startsWith('/images/') || clean.startsWith('/icons/') || clean.startsWith('/fonts/') || clean.startsWith('/svg/')) {
    return clean;
  }

  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    return `http://localhost:5001${clean}`;
  }
  return `https://api.ravishingarthub.com${clean}`;
};

