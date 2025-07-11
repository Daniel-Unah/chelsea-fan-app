import { NextResponse } from 'next/server';

const API_URL = 'https://api.football-data.org/v4';
const API_KEY = process.env.NEXT_PUBLIC_FOOTBALL_DATA_API_KEY;
const CHELSEA_TEAM_ID = 61;

export async function GET() {
  try {
    if (!API_KEY) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    const response = await fetch(`${API_URL}/teams/${CHELSEA_TEAM_ID}`, {
      headers: {
        'X-Auth-Token': API_KEY,
      },
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching squad:', error);
    return NextResponse.json({ error: 'Failed to fetch squad' }, { status: 500 });
  }
} 