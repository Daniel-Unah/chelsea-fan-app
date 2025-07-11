// Football API service for real Chelsea data
// Using football-data.org for current season data

const API_URL = 'https://api.football-data.org/v4';
const API_KEY = process.env.NEXT_PUBLIC_FOOTBALL_DATA_API_KEY;

// Chelsea FC team ID in football-data.org API
const CHELSEA_TEAM_ID = 61;

export interface ApiPlayer {
  id: number;
  name: string;
  position: string;
  nationality: string;
  dateOfBirth: string;
  shirtNumber?: number;
}

export interface ApiFixture {
  id: number;
  utcDate: string;
  status: string;
  venue?: string;
  competition: {
    name: string;
    area: {
      name: string;
    };
  };
  homeTeam: {
    id: number;
    name: string;
    crest?: string;
  };
  awayTeam: {
    id: number;
    name: string;
    crest?: string;
  };
  score: {
    fullTime: {
      home: number | null;
      away: number | null;
    };
  };
}

// Helper function to make API requests to our Next.js API routes
async function makeApiRequest(endpoint: string) {
  const url = `/api/football${endpoint}`;
  console.log(`Making API request to: ${url}`);

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  const data = await response.json();
  console.log(`API response for ${endpoint}:`, data);
  
  return data;
}

// Fetch Chelsea squad
export async function fetchChelseaSquad(): Promise<ApiPlayer[]> {
  try {
    console.log('Fetching Chelsea squad from football-data.org...');
    const data = await makeApiRequest('/squad');
    
    if (data.squad && data.squad.length > 0) {
      console.log(`Found ${data.squad.length} players in Chelsea squad`);
      // Log the first player structure for debugging
      if (data.squad[0]) {
        console.log('First player structure:', JSON.stringify(data.squad[0], null, 2));
      }
      return data.squad;
    }
    
    console.log('No players found in Chelsea squad');
    return [];
  } catch (error) {
    console.error('Error fetching Chelsea squad:', error);
    throw error;
  }
}

// Fetch Chelsea fixtures
export async function fetchChelseaFixtures(): Promise<ApiFixture[]> {
  try {
    console.log('Fetching Chelsea fixtures from football-data.org...');
    const data = await makeApiRequest('/fixtures');
    
    if (data.matches && data.matches.length > 0) {
      console.log(`Found ${data.matches.length} fixtures for Chelsea`);
      // Log the first fixture structure for debugging
      if (data.matches[0]) {
        console.log('First fixture structure:', JSON.stringify(data.matches[0], null, 2));
      }
      return data.matches;
    }
    
    console.log('No fixtures found for Chelsea');
    return [];
  } catch (error) {
    console.error('Error fetching Chelsea fixtures:', error);
    throw error;
  }
}

// Trusted image domains for football data
const TRUSTED_FOOTBALL_DOMAINS = [
  'media.api-sports.io',
  'photobooth-api.onefootball.com',
  'images.unsplash.com',
  'upload.wikimedia.org',
  'crests.football-data.org',
];

// Check if image URL is from trusted domain and auto-add if it looks reliable
async function isTrustedFootballImageUrl(url: string): Promise<boolean> {
  if (!url) return false;
  try {
    const hostname = new URL(url).hostname;
    
    // Check if already trusted
    if (TRUSTED_FOOTBALL_DOMAINS.some(domain => hostname === domain)) {
      return true;
    }
    
    // Auto-add reliable football domains
    const reliableFootballDomains = [
      'crests.football-data.org',
      'upload.wikimedia.org',
      'media.api-sports.io',
      'photobooth-api.onefootball.com',
      'img.chelseafc.com',
      'icdn.chelsea.news',
      'www.chelseafc.com',
      'static.chelseafc.com',
      'resources.chelseafc.com',
      'images.chelseafc.com',
      'cdn.chelseafc.com',
      'media.chelseafc.com',
      'assets.chelseafc.com',
      'images.premierleague.com',
      'media.premierleague.com',
      'static.premierleague.com',
      'cdn.premierleague.com',
      'assets.premierleague.com',
      'images.uefa.com',
      'media.uefa.com',
      'static.uefa.com',
      'cdn.uefa.com',
      'assets.uefa.com',
      'images.fifa.com',
      'media.fifa.com',
      'static.fifa.com',
      'cdn.fifa.com',
      'assets.fifa.com',
      'images.goal.com',
      'media.goal.com',
      'static.goal.com',
      'cdn.goal.com',
      'assets.goal.com',
      'images.espn.com',
      'media.espn.com',
      'static.espn.com',
      'cdn.espn.com',
      'assets.espn.com',
      'images.bbc.com',
      'media.bbc.com',
      'static.bbc.com',
      'cdn.bbc.com',
      'assets.bbc.com',
      'images.sky.com',
      'media.sky.com',
      'static.sky.com',
      'cdn.sky.com',
      'assets.sky.com',
    ];
    
    if (reliableFootballDomains.some(domain => hostname === domain)) {
      // Auto-add to trusted domains
      try {
        await fetch('/api/football/trust-domain', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ domain: hostname })
        });
        console.log(`Auto-added ${hostname} to trusted domains`);
      } catch (error) {
        console.log(`Failed to auto-add ${hostname} to trusted domains:`, error);
      }
      return true;
    }
    
    return false;
  } catch {
    return false;
  }
}

// Transform API data to our app's format
export async function transformPlayer(apiPlayer: ApiPlayer) {
  // Football-data.org API doesn't provide player images in the squad endpoint
  // Use Chelsea logo as fallback for all players
  const safePhotoUrl = '/chelsea-logo.png';

  const age = new Date().getFullYear() - new Date(apiPlayer.dateOfBirth).getFullYear();

  return {
    id: apiPlayer.id,
    name: apiPlayer.name,
    position: apiPlayer.position || 'Unknown',
    nationality: apiPlayer.nationality,
    photo_url: safePhotoUrl,
    number: apiPlayer.shirtNumber || 0,
    age: age,
    height: 'Unknown',
    weight: 'Unknown',
    goals: 0,
    assists: 0,
    appearances: 0,
    rating: '0',
    created_at: new Date().toISOString(),
  };
}

export async function transformFixture(apiFixture: ApiFixture) {
  const isHome = apiFixture.homeTeam.id === CHELSEA_TEAM_ID;
  const opponent = isHome ? apiFixture.awayTeam.name : apiFixture.homeTeam.name;
  
  // For now, let's use the original logo URL to see if it works
  const opponentLogo = isHome ? apiFixture.awayTeam.crest : apiFixture.homeTeam.crest;
  const safeOpponentLogo = opponentLogo || undefined;
  
  let score = undefined;
  if (apiFixture.score.fullTime.home !== null && apiFixture.score.fullTime.away !== null) {
    const chelseaGoals = isHome ? apiFixture.score.fullTime.home : apiFixture.score.fullTime.away;
    const opponentGoals = isHome ? apiFixture.score.fullTime.away : apiFixture.score.fullTime.home;
    score = `${chelseaGoals}-${opponentGoals}`;
  }

  // Create a more descriptive competition name with safety checks
  let competitionName = 'Unknown Competition';
  if (apiFixture.competition && apiFixture.competition.name) {
    if (apiFixture.competition.area && apiFixture.competition.area.name) {
      competitionName = `${apiFixture.competition.name} (${apiFixture.competition.area.name})`;
    } else {
      competitionName = apiFixture.competition.name;
    }
  }

  return {
    id: apiFixture.id,
    date: apiFixture.utcDate,
    competition: competitionName,
    opponent,
    opponent_logo: safeOpponentLogo,
    home_or_away: (isHome ? 'home' : 'away') as 'home' | 'away',
    score,
    venue: apiFixture.venue || 'Unknown',
    status: apiFixture.status,
    created_at: new Date().toISOString(),
  };
}