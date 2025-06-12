import { supabase } from '@/lib/supabaseClient';

export async function fetchNews() {
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .order('published_at', { ascending: false });
  if (error) throw error;
  return data;
} 