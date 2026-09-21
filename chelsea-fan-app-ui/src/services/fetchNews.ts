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

export async function fetchNews(): Promise<NewsItem[]> {
  try {
    try {
      const apiArticles = await fetchChelseaNews();
      if (apiArticles.length > 0) {
        return apiArticles.map((article) => transformNewsArticle(article));
      }
    } catch (apiError) {
      console.error('News API error, falling back to database:', apiError);
    }

    const { data, error } = await supabase
      .from('news')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data && data.length > 0) {
      return data as NewsItem[];
    }

    return [];
  } catch (error) {
    console.error('Error fetching news:', error);
    return [];
  }
}
