import { supabase } from './supabaseClient';

const DEFAULT_BUCKET = 'media';

export async function uploadMedia(file) {
  if (!file) return null;
  const bucket = process.env.REACT_APP_STORAGE_BUCKET || DEFAULT_BUCKET;
  const fileExt = file.name ? file.name.split('.').pop() : 'bin';
  const fileName = `${Date.now()}.${fileExt}`;
  const filePath = `${fileName}`;

  try {
    // try upload; if the bucket doesn't exist return null (caller should handle missing media)
    const { error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file);

    if (error) {
      const msg = (error && (error.message || error.msg)) || String(error);
      console.error('uploadMedia error (returned):', msg);
      if (msg.toLowerCase().includes('bucket not found') || msg.toLowerCase().includes('not found')) {
        return null;
      }
      throw error;
    }

    // getPublicUrl is synchronous in many versions but wrap in try/catch just in case
    try {
      const resp = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);
      const data = resp && resp.data ? resp.data : resp;
      const publicUrl = data && (data.publicUrl || data.public_url);
      return publicUrl || null;
    } catch (e) {
      console.error('uploadMedia getPublicUrl error:', e);
      return null;
    }
  } catch (e) {
    // supabase client may throw on network/fetch errors (StorageApiError) — handle gracefully
    const msg = (e && (e.message || e.msg)) || String(e);
    console.error('uploadMedia caught exception:', msg);
    if (msg.toLowerCase().includes('bucket not found') || msg.toLowerCase().includes('not found')) {
      return null;
    }
    // rethrow other unexpected errors so caller can decide
    throw e;
  }
}
