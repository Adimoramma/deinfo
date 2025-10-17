import { supabase } from './supabaseClient';

export async function getAdmins() {
  const { data, error } = await supabase.from('admins').select('*');
  if (error) throw error;
  return data;
}

export async function addAdmin(name, email, password) {
  const { error: authError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authError) throw authError;

  const { error: dbError } = await supabase
    .from('admins')
    .insert([{ name, email }]);

  if (dbError) throw dbError;
}

export async function deleteAdmin(email) {
  const { error } = await supabase.from('admins').delete().eq('email', email);
  if (error) throw error;
}

export async function updateAdmin(email, patch) {
  const { error } = await supabase.from('admins').update(patch).eq('email', email);
  if (error) throw error;
}

export async function isAdmin(email) {
  if (!email) return false;
  const { data, error } = await supabase.from('admins').select('email').eq('email', email).limit(1);
  if (error) throw error;
  return Array.isArray(data) && data.length > 0;
}
