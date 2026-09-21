import { NextResponse } from 'next/server';

const API_URL = 'https://api.football-data.org/v4';
const API_KEY = process.env.FOOTBALL_DATA_API_KEY || process.env.NEXT_PUBLIC_FOOTBALL_DATA_API_KEY;
const CHELSEA_TEAM_ID = 61;

interface Match {
  utcDate: string;
  competition?: {
    name: string;
  };
  homeTeam?: {
    name: string;
  };
  awayTeam?: {
    name: string;
  };
}

interface ApiResponse {
  matches?: Match[];
}

export const revalidate = 300;

function currentFootballSeason(now = new Date()) {
  // European club seasons start in August (month 7).
  return now.getUTCMonth() >= 7 ? now.getUTCFullYear() : now.getUTCFullYear() - 1;
}

export async function GET() {
  try {
    if (!API_KEY) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    const season = currentFootballSeason();
    const response = await fetch(`${API_URL}/teams/${CHELSEA_TEAM_ID}/matches?season=${season}&limit=200`, {
      headers: {
        'X-Auth-Token': API_KEY,
      },
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data: ApiResponse = await response.json();
    
    // Sort matches by date (chronological order - earliest first for upcoming fixtures)
    if (data.matches) {
      data.matches.sort((a: Match, b: Match) => {
        const dateA = new Date(a.utcDate);
        const dateB = new Date(b.utcDate);
        return dateA.getTime() - dateB.getTime(); // Earliest first (chronological order)
      });
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching fixtures:', error);
    return NextResponse.json({ error: 'Failed to fetch fixtures' }, { status: 500 });
  }
} 