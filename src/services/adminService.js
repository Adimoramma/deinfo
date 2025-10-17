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

// Minimal site info store (localStorage) for About + Quick Links.
const SITE_INFO_KEY = 'desinfo_site_info_v1';

export function getSiteInfo() {
  // Prefer DB-backed site_info if available
  try {
    if (supabase) {
      // attempt to read from site_info table
      return (async () => {
        try {
          const { data, error } = await supabase.from('site_info').select('about, quick_links').eq('id', 'site').limit(1).single();
          if (!error && data) return { about: data.about || '', quickLinks: data.quick_links || [] };
        } catch (e) { /* ignore */ }
        // fallback to localStorage
        const raw = localStorage.getItem(SITE_INFO_KEY);
        if (!raw) return null;
        return JSON.parse(raw);
      })();
    }

    const raw = localStorage.getItem(SITE_INFO_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (err) {
    console.error('getSiteInfo parse failed', err);
    return null;
  }
}

export function setSiteInfo(info) {
  try {
    // write to DB if available, otherwise localStorage
    if (supabase) {
      (async () => {
        try {
          const payload = { id: 'site', about: info.about || '', quick_links: info.quickLinks || [] };
          const { error } = await supabase.from('site_info').upsert(payload, { onConflict: 'id' });
          if (!error) {
            // also mirror to localStorage
            localStorage.setItem(SITE_INFO_KEY, JSON.stringify({ about: payload.about, quickLinks: payload.quick_links }));
            return true;
          }
        } catch (e) { /* ignore */ }
      })();
    }

    localStorage.setItem(SITE_INFO_KEY, JSON.stringify(info || {}));
    return true;
  } catch (err) {
    console.error('setSiteInfo failed', err);
    return false;
  }
}
