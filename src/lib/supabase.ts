import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Supabase URL or Anon Key is missing from environment variables.");
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');

export async function uploadAvatar(userId: string, file: Blob): Promise<string | null> {
  try {
    const filename = `avatar_${userId}_${Date.now()}.webp`;
    const { data, error } = await supabase.storage
      .from('avatars')
      .upload(filename, file, {
        contentType: 'image/webp',
        cacheControl: '3600',
        upsert: true,
      });

    if (error) throw error;
    
    const { data: publicData } = supabase.storage
      .from('avatars')
      .getPublicUrl(filename);
      
    return publicData.publicUrl;
  } catch (err) {
    console.error('Error uploading avatar:', err);
    return null;
  }
}
