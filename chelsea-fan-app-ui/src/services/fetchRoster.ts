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

export async function fetchRoster(): Promise<Player[]> {
  try {
    const apiPlayers = await fetchChelseaSquad();
    if (apiPlayers.length > 0) {
      return Promise.all(apiPlayers.map(transformPlayer));
    }
    return [];
  } catch (error) {
    console.error('Error fetching roster:', error);
    return [];
  }
}
