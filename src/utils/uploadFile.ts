import { API_BASE_URL } from '@/config/api';

export type UploadKind = 'image' | 'video' | 'document';

/** Decides which upload route a file belongs to: image -> /upload/image, video -> /upload/video, anything else -> /upload/document */
export const detectUploadKind = (file: File): UploadKind => {
  const type = (file.type || '').toLowerCase();
  const name = file.name.toLowerCase();
  if (type.startsWith('image/') || /\.(png|jpe?g|gif|webp|bmp|avif)$/.test(name)) return 'image';
  if (type.startsWith('video/') || /\.(mp4|webm|mov|m4v|avi|mkv)$/.test(name)) return 'video';
  return 'document';
};

/**
 * Call this when someone uploaded a file in a form and then removes/replaces it BEFORE saving, so the unsaved
 * file is deleted from Cloudinary too. The backend only deletes its own Cloudinary files that no saved record
 * uses; anything else (pasted external links, files already in use) is left alone. Never throws.
 */
export const discardUploadedFile = async (url?: string | null, token?: string | null): Promise<void> => {
  if (!url || !url.includes('res.cloudinary.com')) return;
  try {
    await fetch(`${API_BASE_URL}/upload`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: JSON.stringify({ url }),
    });
  } catch {
    // cleanup is best-effort: never block the form because of it
  }
};

/**
 * Uploads a file with multipart/form-data to the correct typed route and returns its URL
 * (a Cloudinary https link when the backend has Cloudinary configured).
 * If the backend is an older version without the typed routes, it falls back to the old /upload/video route.
 */
export const uploadMediaFile = async (file: File, token?: string | null): Promise<{ url: string; kind: UploadKind }> => {
  const kind = detectUploadKind(file);
  const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};

  const send = (route: string, field: string) => {
    const formData = new FormData();
    formData.append(field, file);
    return fetch(`${API_BASE_URL}/upload/${route}`, { method: 'POST', headers, body: formData });
  };

  let res = await send(kind, 'file');
  if (res.status === 404) res = await send('video', 'video'); // older backend

  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.url) throw new Error(data.message || 'File upload failed');
  return { url: data.url as string, kind };
};
