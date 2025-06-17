import { supabase } from '@/lib/supabaseClient';

export interface Fixture {
  id: number;
  date: string;
  competition: string;
  opponent: string;
  home_or_away: 'home' | 'away';
  score?: string;
  created_at: string;
}

export async function fetchFixtures() {
  const { data, error } = await supabase
    .from('fixtures')
    .select('*')
    .order('date', { ascending: true });
  
  if (error) throw error;
  return data as Fixture[];
} 