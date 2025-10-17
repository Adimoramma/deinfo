import { supabase } from './supabaseClient';

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
  await supabase.from('news').insert([notice]);
}

export async function deleteNotice(id) {
  await supabase.from('news').delete().eq('id', id);
}
