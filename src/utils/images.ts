'use client';

import { tryCreateClient } from '@/utils/supabase/client';

const BUCKET = 'facility-images';

export type ImageCategory = 'facility' | 'entrance' | 'surroundings';

export type FacilityImageMeta = {
  url: string;
  category?: ImageCategory;
};

export function isProdSupabaseReady() {
  if (typeof window === 'undefined') {
    return false;
  }
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return process.env.NODE_ENV === 'production' && !!url && !!key;
}

export async function compressImage(file: File, opts?: { maxWidth?: number; quality?: number }) {
  const maxWidth = opts?.maxWidth ?? 1280;
  const quality = opts?.quality ?? 0.8;

  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxWidth / bitmap.width);
  const w = Math.round(bitmap.width * scale);
  const h = Math.round(bitmap.height * scale);

  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Canvas not supported');
  }
  ctx.drawImage(bitmap, 0, 0, w, h);

  const blob: Blob = await new Promise(resolve => canvas.toBlob(b => resolve(b!), 'image/jpeg', quality));
  const dataUrl = canvas.toDataURL('image/jpeg', quality);

  const compressed = new File([blob], `${file.name.replace(/\.[^.]+$/, '')}-compressed.jpg`, { type: 'image/jpeg' });
  return { file: compressed, dataUrl };
}

export async function uploadFacilityImages(facilityId: number, files: Array<{ file: File; category?: ImageCategory }>) {
  if (!files?.length) {
    return [] as FacilityImageMeta[];
  }

  // Client-only behavior
  if (typeof window === 'undefined') {
    return [] as FacilityImageMeta[];
  }

  const uploads: FacilityImageMeta[] = [];

  if (isProdSupabaseReady()) {
    const supabase = tryCreateClient();
    if (!supabase) {
      return uploads;
    }

    for (const { file, category } of files) {
      const { file: compressed } = await compressImage(file);
      const path = `${facilityId}/${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`;
      const { error } = await supabase.storage.from(BUCKET).upload(path, compressed, {
        contentType: 'image/jpeg',
        upsert: false,
      });
      if (error) {
        console.error('Supabase upload error', error.message);
        continue;
      }
      const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
      uploads.push({ url: data.publicUrl, category });
    }
  } else {
    // Dev: store data URLs in localStorage
    const key = `facility-images-${facilityId}`;
    const existingRaw = localStorage.getItem(key);
    const existing: FacilityImageMeta[] = existingRaw ? JSON.parse(existingRaw) : [];

    for (const { file, category } of files) {
      const { dataUrl } = await compressImage(file, { maxWidth: 1280, quality: 0.8 });
      existing.push({ url: dataUrl, category });
    }

    localStorage.setItem(key, JSON.stringify(existing));
    uploads.push(...existing);
  }

  return uploads;
}

export async function getFacilityImages(facilityId: number): Promise<FacilityImageMeta[]> {
  if (typeof window === 'undefined') {
    return [];
  }

  if (isProdSupabaseReady()) {
    const supabase = tryCreateClient();
    if (!supabase) {
      return [];
    }
    const prefix = `${facilityId}/`;
    const { data, error } = await supabase.storage.from(BUCKET).list(prefix, { limit: 50 });
    if (error) {
      console.error('Supabase list error', error.message);
      return [];
    }
    return (data || []).map((item) => {
      const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(prefix + item.name);
      return { url: pub.publicUrl } as FacilityImageMeta;
    });
  }

  const key = `facility-images-${facilityId}`;
  const raw = localStorage.getItem(key);
  return raw ? (JSON.parse(raw) as FacilityImageMeta[]) : [];
}
