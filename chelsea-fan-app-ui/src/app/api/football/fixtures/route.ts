import { NextResponse } from 'next/server';

const API_URL = 'https://api.football-data.org/v4';
const API_KEY = process.env.NEXT_PUBLIC_FOOTBALL_DATA_API_KEY;
const CHELSEA_TEAM_ID = 61;

export async function GET() {
  try {
    if (!API_KEY) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    // Fetch all competitions for Chelsea (no competition filter)
    const response = await fetch(`${API_URL}/teams/${CHELSEA_TEAM_ID}/matches?season=2024&limit=100`, {
      headers: {
        'X-Auth-Token': API_KEY,
      },
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    
    // Sort matches by date (most recent first)
    if (data.matches) {
      data.matches.sort((a: { utcDate: string }, b: { utcDate: string }) => {
        const dateA = new Date(a.utcDate);
        const dateB = new Date(b.utcDate);
        return dateB.getTime() - dateA.getTime(); // Most recent first
      });
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching fixtures:', error);
    return NextResponse.json({ error: 'Failed to fetch fixtures' }, { status: 500 });
  }
} 