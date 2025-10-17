import { supabase } from './supabaseClient';

export async function uploadMedia(file) {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}.${fileExt}`;
  const filePath = `${fileName}`;

  const { error } = await supabase.storage
    .from('media')
    .upload(filePath, file);

  if (error) throw error;

  const { data } = supabase.storage
    .from('media')
    .getPublicUrl(filePath);

  return data.publicUrl;
}
