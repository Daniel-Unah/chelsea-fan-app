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
        const content = `${article.title} ${article.description} ${article.content}`.toLowerCase();
        const chelseaKeywords = ['chelsea', 'stamford bridge', 'maresca', 'cole palmer', 'enzo fernandez', 'caicedo', 'jackson', 'mudryk'];
        return chelseaKeywords.some(keyword => content.includes(keyword));
      });
      
      return chelseaArticles.slice(0, 20); // Return top 20 Chelsea-related articles
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching Chelsea news:', error);
    throw error;
  }
}

// These two lists must stay in sync with images.remotePatterns in next.config.js.
// next/image rejects any host that is not configured there, so trusting a host
// here that the config does not allow produces a broken image rather than a photo.
const TRUSTED_IMAGE_HOSTS = [
  'images.unsplash.com',
  'upload.wikimedia.org',
  'icdn.chelsea.news',
  'img.chelseafc.com',
  'media.api-sports.io',
  'photobooth-api.onefootball.com',
  'imageio.forbes.com',
  'phantom-marca.uecdn.es',
];

// Matched one subdomain level deep, mirroring the '*.example.com' patterns.
const TRUSTED_PARENT_DOMAINS = [
  'chelseafc.com',
  'premierleague.com',
  'football.london',
  'theguardian.com',
  'telegraph.co.uk',
  'independent.co.uk',
  'dailymail.co.uk',
  'eveningstandard.co.uk',
  'standard.co.uk',
  'mirror.co.uk',
  'metro.co.uk',
  'forbes.com',
  'bbc.com',
  'sky.com',
  'espn.com',
  'goal.com',
  'uefa.com',
  'fifa.com',
];

function isTrustedNewsImageUrl(url: string): boolean {
  if (!url) return false;

  try {
    const hostname = new URL(url).hostname;

    if (TRUSTED_IMAGE_HOSTS.includes(hostname)) {
      return true;
    }

    const parentDomain = hostname.split('.').slice(1).join('.');
    return TRUSTED_PARENT_DOMAINS.includes(parentDomain);
  } catch {
    return false;
  }
}

// Transform news API data to our app's format
export function transformNewsArticle(article: NewsApiArticle) {
  // Fall back to the Chelsea logo for images next/image is not configured to load
  const safeImageUrl = isTrustedNewsImageUrl(article.urlToImage || '')
    ? article.urlToImage
    : '/chelsea-logo.png';

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
