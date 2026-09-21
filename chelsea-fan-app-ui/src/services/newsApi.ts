// News API service for Chelsea news
// Using newsapi.org

export interface NewsApiArticle {
  source: {
    id: string;
    name: string;
  };
  author: string;
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  content: string;
}

export interface NewsApiResponse {
  status: string;
  totalResults: number;
  articles: NewsApiArticle[];
}

// Fetch Chelsea news
export async function fetchChelseaNews(): Promise<NewsApiArticle[]> {
  try {
    // Call the Next.js API route instead of NewsAPI directly
    const response = await fetch('/api/news');

    if (!response.ok) {
      throw new Error(`News API request failed: ${response.status}`);
    }

    const data: NewsApiResponse = await response.json();
    
    if (data.status === 'ok' && data.articles) {
      // Filter articles to ensure they're actually about Chelsea
      const chelseaArticles = data.articles.filter(article => {
        const headline = `${article.title} ${article.description}`.toLowerCase();
        return headline.includes('chelsea') || headline.includes('stamford bridge');
      });
      
      return chelseaArticles.slice(0, 20); // Return top 20 Chelsea-related articles
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching Chelsea news:', error);
    throw error;
  }
}

function newsImageUrl(url?: string): string {
  if (!url) return '/chelsea-logo.png';

  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:' ? parsed.href : '/chelsea-logo.png';
  } catch {
    return '/chelsea-logo.png';
  }
}

// Transform news API data to our app's format
export function transformNewsArticle(article: NewsApiArticle) {
  const safeImageUrl = newsImageUrl(article.urlToImage);

  // Generate stable ID based on article URL (hash) to ensure consistency
  // This way, the same article will always have the same ID
  const urlHash = article.url.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  
  // Use absolute value and ensure it's positive
  const stableId = Math.abs(urlHash);

  return {
    id: stableId,
    title: article.title,
    body: article.description || article.content || '',
    image_url: safeImageUrl,
    source_url: article.url,
    source_name: article.source.name,
    author: article.author,
    created_at: article.publishedAt,
  };
}
