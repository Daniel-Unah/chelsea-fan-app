import { supabase } from '@/lib/supabaseClient';

export interface Player {
  id: number;
  name: string;
  position: string;
  nationality: string;
  photo_url?: string;
  number?: number;
  created_at: string;
}

export async function fetchRoster() {
  const { data, error } = await supabase
    .from('players')
    .select('*')
    .order('number', { ascending: true });
  
  if (error) throw error;
  return data as Player[];
} 