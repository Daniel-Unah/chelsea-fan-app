import { supabase } from '@/lib/supabaseClient';
import { fetchChelseaNews, transformNewsArticle } from './newsApi';

export interface NewsItem {
  id: number;
  title: string;
  body: string;
  image_url?: string;
  source_url?: string;
  source_name?: string;
  author?: string;
  created_at: string;
}

// Fallback Chelsea news data
const FALLBACK_NEWS: NewsItem[] = [
  {
    id: 1,
    title: "Chelsea Secure Dramatic Victory Over Newcastle",
    body: "Chelsea FC secured a thrilling 4-1 victory over Newcastle United at Stamford Bridge, with Cole Palmer scoring a brace and Nicolas Jackson adding two more goals to maintain their strong form in the Premier League.",
    image_url: "/chelsea-logo.png",
    source_url: "https://www.chelseafc.com/news",
    source_name: "Chelsea FC Official",
    author: "Chelsea FC",
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
  },
  {
    id: 2,
    title: "Mauricio Pochettino Praises Team's Character",
    body: "Chelsea manager Mauricio Pochettino has praised his team's character and resilience following their recent string of positive results, highlighting the importance of maintaining momentum throughout the season.",
    image_url: "/chelsea-logo.png",
    source_url: "https://www.chelseafc.com/news",
    source_name: "Chelsea FC Official",
    author: "Chelsea FC",
    created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
  },
  {
    id: 3,
    title: "Injury Update: Key Players Return to Training",
    body: "Chelsea have received a boost with several key players returning to full training this week, including Reece James and Ben Chilwell, as the squad prepares for upcoming fixtures.",
    image_url: "/chelsea-logo.png",
    source_url: "https://www.chelseafc.com/news",
    source_name: "Chelsea FC Official",
    author: "Chelsea FC",
    created_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
  },
  {
    id: 4,
    title: "Youth Academy Star Signs Professional Contract",
    body: "Chelsea's youth academy continues to produce top talent as another promising youngster signs their first professional contract, following in the footsteps of recent graduates who have made the step up to the first team.",
    image_url: "/chelsea-logo.png",
    source_url: "https://www.chelseafc.com/news",
    source_name: "Chelsea FC Official",
    author: "Chelsea FC",
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
  },
  {
    id: 5,
    title: "Chelsea Women Continue Dominant Form",
    body: "Chelsea Women maintained their impressive form with another convincing victory, extending their lead at the top of the Women's Super League table and demonstrating the club's strength across all levels.",
    image_url: "/chelsea-logo.png",
    source_url: "https://www.chelseafc.com/news",
    source_name: "Chelsea FC Official",
    author: "Chelsea FC",
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
  },
  {
    id: 6,
    title: "Stamford Bridge Expansion Plans Announced",
    body: "Chelsea FC have announced ambitious plans for the expansion of Stamford Bridge, with new facilities and increased capacity set to enhance the matchday experience for fans and maintain the club's position as a world-class venue.",
    image_url: "/chelsea-logo.png",
    source_url: "https://www.chelseafc.com/news",
    source_name: "Chelsea FC Official",
    author: "Chelsea FC",
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
  },
  {
    id: 7,
    title: "Community Foundation Launches New Initiative",
    body: "Chelsea Foundation has launched a new community initiative aimed at supporting local youth programs and promoting football development in the surrounding areas, continuing the club's commitment to social responsibility.",
    image_url: "/chelsea-logo.png",
    source_url: "https://www.chelseafc.com/news",
    source_name: "Chelsea FC Official",
    author: "Chelsea FC",
    created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days ago
  },
  {
    id: 8,
    title: "Transfer Window Review: Strategic Signings",
    body: "Chelsea's summer transfer window has been hailed as a success, with strategic signings that have strengthened the squad across all positions and provided manager Mauricio Pochettino with the tools needed for success.",
    image_url: "/chelsea-logo.png",
    source_url: "https://www.chelseafc.com/news",
    source_name: "Chelsea FC Official",
    author: "Chelsea FC",
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
  },
];

export async function fetchNews(): Promise<NewsItem[]> {
  try {
    // First try to get real data from News API
    if (process.env.NEXT_PUBLIC_NEWS_API_KEY) {
      try {
        console.log('Fetching real Chelsea news data from API...');
        const apiArticles = await fetchChelseaNews();
        if (apiArticles.length > 0) {
          const transformedArticles = await Promise.all(apiArticles.map(transformNewsArticle));
          console.log(`Successfully fetched ${transformedArticles.length} news articles from API`);
          return transformedArticles;
        }
      } catch (apiError) {
        console.error('News API error, falling back to database:', apiError);
      }
    }

    // Try to get data from Supabase
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (!error && data && data.length > 0) {
      console.log('Using database Chelsea news data');
      return data as NewsItem[];
    }
    
    // If no data in Supabase, return fallback data
    console.log('Using fallback Chelsea news data');
    return FALLBACK_NEWS;
    
  } catch (error) {
    console.error('Error fetching news:', error);
    // Return fallback data on error
    return FALLBACK_NEWS;
  }
} 