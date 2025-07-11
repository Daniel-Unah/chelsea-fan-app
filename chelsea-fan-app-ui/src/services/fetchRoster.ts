import { supabase } from '@/lib/supabaseClient';
import { fetchChelseaSquad, transformPlayer } from './footballApi';

export interface Player {
  id: number;
  name: string;
  position: string;
  nationality: string;
  photo_url?: string;
  number?: number;
  age?: number;
  height?: string;
  weight?: string;
  goals?: number;
  assists?: number;
  appearances?: number;
  rating?: string;
  created_at: string;
}

// Fallback Chelsea squad data (2024/25 season)
const FALLBACK_SQUAD: Player[] = [
  {
    id: 1,
    name: "Robert Sánchez",
    position: "Goalkeeper",
    nationality: "Spain",
    photo_url: "https://media.api-sports.io/football/players/1.png",
    number: 1,
    age: 26,
    height: "197cm",
    weight: "88kg",
    created_at: new Date().toISOString(),
  },
  {
    id: 2,
    name: "Axel Disasi",
    position: "Defender",
    nationality: "France",
    photo_url: "https://media.api-sports.io/football/players/2.png",
    number: 2,
    age: 25,
    height: "190cm",
    weight: "85kg",
    created_at: new Date().toISOString(),
  },
  {
    id: 3,
    name: "Marc Cucurella",
    position: "Defender",
    nationality: "Spain",
    photo_url: "https://media.api-sports.io/football/players/3.png",
    number: 3,
    age: 25,
    height: "175cm",
    weight: "72kg",
    created_at: new Date().toISOString(),
  },
  {
    id: 4,
    name: "Benoît Badiashile",
    position: "Defender",
    nationality: "France",
    photo_url: "https://media.api-sports.io/football/players/4.png",
    number: 4,
    age: 22,
    height: "194cm",
    weight: "85kg",
    created_at: new Date().toISOString(),
  },
  {
    id: 5,
    name: "Enzo Fernández",
    position: "Midfielder",
    nationality: "Argentina",
    photo_url: "https://media.api-sports.io/football/players/5.png",
    number: 5,
    age: 23,
    height: "178cm",
    weight: "77kg",
    goals: 3,
    assists: 7,
    appearances: 25,
    rating: "7.2",
    created_at: new Date().toISOString(),
  },
  {
    id: 6,
    name: "Thiago Silva",
    position: "Defender",
    nationality: "Brazil",
    photo_url: "https://media.api-sports.io/football/players/6.png",
    number: 6,
    age: 39,
    height: "183cm",
    weight: "79kg",
    created_at: new Date().toISOString(),
  },
  {
    id: 7,
    name: "N'Golo Kanté",
    position: "Midfielder",
    nationality: "France",
    photo_url: "https://media.api-sports.io/football/players/7.png",
    number: 7,
    age: 32,
    height: "168cm",
    weight: "70kg",
    goals: 1,
    assists: 2,
    appearances: 18,
    rating: "7.5",
    created_at: new Date().toISOString(),
  },
  {
    id: 8,
    name: "Cole Palmer",
    position: "Midfielder",
    nationality: "England",
    photo_url: "https://media.api-sports.io/football/players/8.png",
    number: 8,
    age: 21,
    height: "189cm",
    weight: "78kg",
    goals: 12,
    assists: 9,
    appearances: 28,
    rating: "7.8",
    created_at: new Date().toISOString(),
  },
  {
    id: 9,
    name: "Nicolas Jackson",
    position: "Forward",
    nationality: "Senegal",
    photo_url: "https://media.api-sports.io/football/players/9.png",
    number: 9,
    age: 22,
    height: "186cm",
    weight: "78kg",
    goals: 8,
    assists: 4,
    appearances: 26,
    rating: "7.1",
    created_at: new Date().toISOString(),
  },
  {
    id: 10,
    name: "Mykhailo Mudryk",
    position: "Forward",
    nationality: "Ukraine",
    photo_url: "https://media.api-sports.io/football/players/10.png",
    number: 10,
    age: 23,
    height: "175cm",
    weight: "70kg",
    goals: 4,
    assists: 6,
    appearances: 24,
    rating: "6.9",
    created_at: new Date().toISOString(),
  },
  {
    id: 11,
    name: "Raheem Sterling",
    position: "Forward",
    nationality: "England",
    photo_url: "https://media.api-sports.io/football/players/11.png",
    number: 11,
    age: 29,
    height: "170cm",
    weight: "69kg",
    goals: 6,
    assists: 8,
    appearances: 27,
    rating: "7.3",
    created_at: new Date().toISOString(),
  },
  {
    id: 12,
    name: "Moisés Caicedo",
    position: "Midfielder",
    nationality: "Ecuador",
    photo_url: "https://media.api-sports.io/football/players/12.png",
    number: 12,
    age: 22,
    height: "178cm",
    weight: "73kg",
    goals: 1,
    assists: 3,
    appearances: 22,
    rating: "7.0",
    created_at: new Date().toISOString(),
  },
  {
    id: 13,
    name: "Djordje Petrovic",
    position: "Goalkeeper",
    nationality: "Serbia",
    photo_url: "https://media.api-sports.io/football/players/13.png",
    number: 13,
    age: 24,
    height: "194cm",
    weight: "88kg",
    created_at: new Date().toISOString(),
  },
  {
    id: 14,
    name: "Trevoh Chalobah",
    position: "Defender",
    nationality: "England",
    photo_url: "https://media.api-sports.io/football/players/14.png",
    number: 14,
    age: 24,
    height: "190cm",
    weight: "85kg",
    created_at: new Date().toISOString(),
  },
  {
    id: 15,
    name: "Conor Gallagher",
    position: "Midfielder",
    nationality: "England",
    photo_url: "https://media.api-sports.io/football/players/15.png",
    number: 15,
    age: 24,
    height: "182cm",
    weight: "76kg",
    goals: 5,
    assists: 6,
    appearances: 29,
    rating: "7.4",
    created_at: new Date().toISOString(),
  },
  {
    id: 16,
    name: "Reece James",
    position: "Defender",
    nationality: "England",
    photo_url: "https://media.api-sports.io/football/players/16.png",
    number: 16,
    age: 24,
    height: "179cm",
    weight: "91kg",
    goals: 2,
    assists: 4,
    appearances: 12,
    rating: "7.6",
    created_at: new Date().toISOString(),
  },
  {
    id: 17,
    name: "Carney Chukwuemeka",
    position: "Midfielder",
    nationality: "England",
    photo_url: "https://media.api-sports.io/football/players/17.png",
    number: 17,
    age: 20,
    height: "185cm",
    weight: "80kg",
    goals: 1,
    assists: 2,
    appearances: 15,
    rating: "6.8",
    created_at: new Date().toISOString(),
  },
  {
    id: 18,
    name: "Armando Broja",
    position: "Forward",
    nationality: "Albania",
    photo_url: "https://media.api-sports.io/football/players/18.png",
    number: 18,
    age: 22,
    height: "185cm",
    weight: "78kg",
    goals: 2,
    assists: 1,
    appearances: 8,
    rating: "6.7",
    created_at: new Date().toISOString(),
  },
  {
    id: 19,
    name: "Mason Burstow",
    position: "Forward",
    nationality: "England",
    photo_url: "https://media.api-sports.io/football/players/19.png",
    number: 19,
    age: 20,
    height: "183cm",
    weight: "75kg",
    goals: 0,
    assists: 1,
    appearances: 5,
    rating: "6.5",
    created_at: new Date().toISOString(),
  },
  {
    id: 20,
    name: "Alfie Gilchrist",
    position: "Defender",
    nationality: "England",
    photo_url: "https://media.api-sports.io/football/players/20.png",
    number: 20,
    age: 20,
    height: "185cm",
    weight: "80kg",
    created_at: new Date().toISOString(),
  },
];

export async function fetchRoster(): Promise<Player[]> {
  try {
    // First try to get real data from Football API
    console.log('Football API key available:', !!process.env.NEXT_PUBLIC_FOOTBALL_API_KEY);
    if (process.env.NEXT_PUBLIC_FOOTBALL_API_KEY) {
      try {
        console.log('Fetching real Chelsea squad data from API...');
        const apiPlayers = await fetchChelseaSquad();
        console.log('API response:', apiPlayers.length, 'players');
        if (apiPlayers.length > 0) {
          const transformedPlayers = await Promise.all(apiPlayers.map(transformPlayer));
          console.log(`Successfully fetched ${transformedPlayers.length} players from API`);
          return transformedPlayers;
        } else {
          console.log('No players returned from API, using fallback');
        }
      } catch (apiError) {
        console.error('Football API error, falling back to database:', apiError);
      }
    } else {
      console.log('No Football API key found, using fallback data');
    }

    // Try to get data from Supabase
    const { data, error } = await supabase
      .from('players')
      .select('*')
      .order('number', { ascending: true });
    
    if (!error && data && data.length > 0) {
      console.log('Using database Chelsea squad data');
      return data as Player[];
    }
    
    // If no data in Supabase, return fallback data
    console.log('Using fallback Chelsea squad data');
    return FALLBACK_SQUAD;
    
  } catch (error) {
    console.error('Error fetching roster:', error);
    // Return fallback data on error
    return FALLBACK_SQUAD;
  }
} 