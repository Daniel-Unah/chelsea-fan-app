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

// Fallback Chelsea fixtures data (2024/25 season)
const FALLBACK_FIXTURES: Fixture[] = [
  {
    id: 1,
    date: "2024-08-18T14:00:00Z",
    competition: "Premier League",
    opponent: "Manchester City",
    opponent_logo: "https://media.api-sports.io/football/teams/50.png",
    home_or_away: "away",
    score: "1-3",
    venue: "Etihad Stadium",
    status: "FT",
    created_at: new Date().toISOString(),
  },
  {
    id: 2,
    date: "2024-08-25T16:30:00Z",
    competition: "Premier League",
    opponent: "West Ham United",
    opponent_logo: "https://media.api-sports.io/football/teams/48.png",
    home_or_away: "home",
    score: "2-1",
    venue: "Stamford Bridge",
    status: "FT",
    created_at: new Date().toISOString(),
  },
  {
    id: 3,
    date: "2024-09-01T14:00:00Z",
    competition: "Premier League",
    opponent: "Crystal Palace",
    opponent_logo: "https://media.api-sports.io/football/teams/52.png",
    home_or_away: "away",
    score: "0-2",
    venue: "Selhurst Park",
    status: "FT",
    created_at: new Date().toISOString(),
  },
  {
    id: 4,
    date: "2024-09-15T16:30:00Z",
    competition: "Premier League",
    opponent: "Bournemouth",
    opponent_logo: "https://media.api-sports.io/football/teams/35.png",
    home_or_away: "home",
    score: "3-0",
    venue: "Stamford Bridge",
    status: "FT",
    created_at: new Date().toISOString(),
  },
  {
    id: 5,
    date: "2024-09-22T14:00:00Z",
    competition: "Premier League",
    opponent: "Aston Villa",
    opponent_logo: "https://media.api-sports.io/football/teams/66.png",
    home_or_away: "away",
    score: "1-2",
    venue: "Villa Park",
    status: "FT",
    created_at: new Date().toISOString(),
  },
  {
    id: 6,
    date: "2024-09-29T16:30:00Z",
    competition: "Premier League",
    opponent: "Brighton & Hove Albion",
    opponent_logo: "https://media.api-sports.io/football/teams/51.png",
    home_or_away: "home",
    score: "2-2",
    venue: "Stamford Bridge",
    status: "FT",
    created_at: new Date().toISOString(),
  },
  {
    id: 7,
    date: "2024-10-06T14:00:00Z",
    competition: "Premier League",
    opponent: "Fulham",
    opponent_logo: "https://media.api-sports.io/football/teams/36.png",
    home_or_away: "away",
    score: "0-2",
    venue: "Craven Cottage",
    status: "FT",
    created_at: new Date().toISOString(),
  },
  {
    id: 8,
    date: "2024-10-20T16:30:00Z",
    competition: "Premier League",
    opponent: "Arsenal",
    opponent_logo: "https://media.api-sports.io/football/teams/42.png",
    home_or_away: "home",
    score: "2-2",
    venue: "Stamford Bridge",
    status: "FT",
    created_at: new Date().toISOString(),
  },
  {
    id: 9,
    date: "2024-10-27T14:00:00Z",
    competition: "Premier League",
    opponent: "Brentford",
    opponent_logo: "https://media.api-sports.io/football/teams/55.png",
    home_or_away: "away",
    score: "2-0",
    venue: "Gtech Community Stadium",
    status: "FT",
    created_at: new Date().toISOString(),
  },
  {
    id: 10,
    date: "2024-11-03T16:30:00Z",
    competition: "Premier League",
    opponent: "Newcastle United",
    opponent_logo: "https://media.api-sports.io/football/teams/34.png",
    home_or_away: "home",
    score: "4-1",
    venue: "Stamford Bridge",
    status: "FT",
    created_at: new Date().toISOString(),
  },
  {
    id: 11,
    date: "2024-11-10T14:00:00Z",
    competition: "Premier League",
    opponent: "Tottenham Hotspur",
    opponent_logo: "https://media.api-sports.io/football/teams/47.png",
    home_or_away: "away",
    venue: "Tottenham Hotspur Stadium",
    status: "NS",
    created_at: new Date().toISOString(),
  },
  {
    id: 12,
    date: "2024-11-24T16:30:00Z",
    competition: "Premier League",
    opponent: "Manchester United",
    opponent_logo: "https://media.api-sports.io/football/teams/33.png",
    home_or_away: "home",
    venue: "Stamford Bridge",
    status: "NS",
    created_at: new Date().toISOString(),
  },
  {
    id: 13,
    date: "2024-12-01T14:00:00Z",
    competition: "Premier League",
    opponent: "Liverpool",
    opponent_logo: "https://media.api-sports.io/football/teams/40.png",
    home_or_away: "away",
    venue: "Anfield",
    status: "NS",
    created_at: new Date().toISOString(),
  },
  {
    id: 14,
    date: "2024-12-08T16:30:00Z",
    competition: "Premier League",
    opponent: "Everton",
    opponent_logo: "https://media.api-sports.io/football/teams/45.png",
    home_or_away: "home",
    venue: "Stamford Bridge",
    status: "NS",
    created_at: new Date().toISOString(),
  },
  {
    id: 15,
    date: "2024-12-15T14:00:00Z",
    competition: "Premier League",
    opponent: "Wolverhampton Wanderers",
    opponent_logo: "https://media.api-sports.io/football/teams/39.png",
    home_or_away: "away",
    venue: "Molineux Stadium",
    status: "NS",
    created_at: new Date().toISOString(),
  },
];

export async function fetchFixtures(): Promise<Fixture[]> {
  try {
    // First try to get real data from Football API
    if (process.env.NEXT_PUBLIC_FOOTBALL_API_KEY) {
      try {
        console.log('Fetching real Chelsea fixtures data from API...');
        const apiFixtures = await fetchChelseaFixtures();
        if (apiFixtures.length > 0) {
          const transformedFixtures = await Promise.all(apiFixtures.map(fixture => transformFixture(fixture)));
          console.log(`Successfully fetched ${transformedFixtures.length} fixtures from API`);
          return transformedFixtures;
        }
        console.log('No fixtures returned from API, using fallback data');
      } catch (apiError) {
        console.error('Football API error, falling back to database:', apiError);
      }
    }

    // Try to get data from Supabase
    const { data, error } = await supabase
      .from('fixtures')
      .select('*')
      .order('date', { ascending: true });
    
    if (!error && data && data.length > 0) {
      console.log('Using database Chelsea fixtures data');
      return data as Fixture[];
    }
    
    // If no data in Supabase, return fallback data
    console.log('Using fallback Chelsea fixtures data');
    return FALLBACK_FIXTURES;
    
  } catch (error) {
    console.error('Error fetching fixtures:', error);
    // Return fallback data on error
    return FALLBACK_FIXTURES;
  }
} 