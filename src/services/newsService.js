import { supabase } from './supabaseClient';
import { uploadMedia } from './uploadService';

export async function getActiveNews() {
  const { data } = await supabase.from('news').select('*').eq('is_archived', false).order('date_posted', { ascending: false });
  return data;
}

export async function getArchivedNews() {
  const { data } = await supabase.from('news').select('*').eq('is_archived', true);
  return data;
}

export async function getNoticeById(id) {
  const { data } = await supabase.from('news').select('*').eq('id', id).single();
  return data;
}

export async function createNotice(notice) {
  // if notice.file is a File object, upload it first and set media_url
  const payload = { ...notice };
  if (payload.file && typeof payload.file === 'object' && payload.file.name) {
    try {
      const url = await uploadMedia(payload.file);
      payload.media_url = url;
    } catch (err) {
      console.error('upload failed', err);
      // continue without media_url
    }
    delete payload.file; // remove File object before sending to Supabase
  }

  // insert only allowed scalar fields to avoid sending File objects
  await supabase.from('news').insert([{
    title: payload.title,
    summary: payload.summary,
    details: payload.details,
    media_url: payload.media_url || null,
    media_type: payload.media_type || null,
    date_posted: payload.date_posted || new Date().toISOString(),
    is_archived: payload.is_archived ?? false,
  }]);
}

export async function deleteNotice(id) {
  await supabase.from('news').delete().eq('id', id);
}

export async function updateNotice(id, patch) {
  const { error } = await supabase.from('news').update(patch).eq('id', id);
  if (error) throw error;
}
