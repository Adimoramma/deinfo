import { supabase } from './supabaseClient';

export async function getEvents() {
  const { data, error } = await supabase.from('events').select('*').order('date', { ascending: false });
  if (error) throw error;
  return data;
}

export async function createEvent(event) {
  const { error } = await supabase.from('events').insert([event]);
  if (error) throw error;
}

export async function updateEvent(id, patch) {
  const { error } = await supabase.from('events').update(patch).eq('id', id);
  if (error) throw error;
}

export async function deleteEvent(id) {
  const { error } = await supabase.from('events').delete().eq('id', id);
  if (error) throw error;
}
