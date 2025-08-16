import { NextResponse } from 'next/server';

const API_URL = 'https://api.football-data.org/v4';
const API_KEY = process.env.NEXT_PUBLIC_FOOTBALL_DATA_API_KEY;
const CHELSEA_TEAM_ID = 61;

export async function GET() {
  try {
    if (!API_KEY) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    // Try to fetch fixtures from multiple competitions
    // First, let's try to get all matches without any competition filter
    const response = await fetch(`${API_URL}/teams/${CHELSEA_TEAM_ID}/matches?season=2025&limit=200`, {
      headers: {
        'X-Auth-Token': API_KEY,
      },
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    
    // Debug: Log what we're getting
    console.log('Total fixtures returned:', data.matches?.length || 0);
    if (data.matches && data.matches.length > 0) {
      // Check what competitions we're getting
      const competitions = [...new Set(data.matches.map((match: any) => match.competition?.name))];
      console.log('Available competitions:', competitions);
      
      // Log first few fixtures to see their structure
      console.log('First 3 fixtures:', data.matches.slice(0, 3).map((match: any) => ({
        date: match.utcDate,
        competition: match.competition?.name,
        homeTeam: match.homeTeam?.name,
        awayTeam: match.awayTeam?.name
      })));
      
      // If we only have Premier League, this might be a free tier limitation
      if (competitions.length === 1 && competitions[0] === 'Premier League') {
        console.log('Only Premier League fixtures found - this might be a free tier limitation');
        console.log('The football-data.org free tier typically only provides Premier League data');
      }
    }
    
    // Sort matches by date (chronological order - earliest first for upcoming fixtures)
    if (data.matches) {
      data.matches.sort((a: { utcDate: string }, b: { utcDate: string }) => {
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