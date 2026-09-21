import { supabase } from '@/lib/supabaseClient';
import { fetchChelseaFixtures, transformFixture } from './footballApi';

export interface Fixture {
  id: number;
  date: string;
  competition: string;
  opponent: string;
  opponent_logo?: string;
  home_or_away: 'home' | 'away';
  score?: string;
  venue?: string;
  status?: string;
  created_at: string;
}

export async function fetchFixtures(): Promise<Fixture[]> {
  try {
    try {
      const apiFixtures = await fetchChelseaFixtures();
      if (apiFixtures.length > 0) {
        return Promise.all(apiFixtures.map((fixture) => transformFixture(fixture)));
      }
    } catch (apiError) {
      console.error('Football API error, falling back to database:', apiError);
    }

    const { data, error } = await supabase
      .from('fixtures')
      .select('*')
      .order('date', { ascending: true });

    if (!error && data && data.length > 0) {
      return data as Fixture[];
    }

    return [];
  } catch (error) {
    console.error('Error fetching fixtures:', error);
    return [];
  }
}
