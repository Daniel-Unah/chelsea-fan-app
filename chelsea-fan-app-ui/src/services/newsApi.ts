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

// Trusted image domains for news
const TRUSTED_NEWS_DOMAINS = [
  'images.unsplash.com',
  'upload.wikimedia.org',
  'icdn.chelsea.news',
  'img.chelseafc.com',
  'media.api-sports.io',
  'photobooth-api.onefootball.com',
  'imageio.forbes.com',
  'phantom-marca.uecdn.es',
  'cdn.chelseafc.com',
  'www.chelseafc.com',
  'static.chelseafc.com',
];

// Check if image URL is from trusted domain and auto-add if it looks reliable
async function isTrustedNewsImageUrl(url: string): Promise<boolean> {
  if (!url) return false;
  try {
    const hostname = new URL(url).hostname;
    
    // Check if already trusted
    if (TRUSTED_NEWS_DOMAINS.some(domain => hostname === domain)) {
      return true;
    }
    
    // Auto-add reliable news domains
    const reliableNewsDomains = [
      'images.unsplash.com',
      'upload.wikimedia.org',
      'icdn.chelsea.news',
      'img.chelseafc.com',
      'cdn.chelseafc.com',
      'www.chelseafc.com',
      'static.chelseafc.com',
      'resources.chelsea.news',
      'images.chelseafc.com',
      'media.chelseafc.com',
      'assets.chelseafc.com',
      'images.premierleague.com',
      'media.premierleague.com',
      'static.premierleague.com',
      'cdn.premierleague.com',
      'assets.premierleague.com',
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
      'images.theguardian.com',
      'media.theguardian.com',
      'static.theguardian.com',
      'cdn.theguardian.com',
      'assets.theguardian.com',
      'images.independent.co.uk',
      'media.independent.co.uk',
      'static.independent.co.uk',
      'cdn.independent.co.uk',
      'assets.independent.co.uk',
      'images.telegraph.co.uk',
      'media.telegraph.co.uk',
      'static.telegraph.co.uk',
      'cdn.telegraph.co.uk',
      'assets.telegraph.co.uk',
      'images.mirror.co.uk',
      'media.mirror.co.uk',
      'static.mirror.co.uk',
      'cdn.mirror.co.uk',
      'assets.mirror.co.uk',
      'images.dailymail.co.uk',
      'media.dailymail.co.uk',
      'static.dailymail.co.uk',
      'cdn.dailymail.co.uk',
      'assets.dailymail.co.uk',
      'images.thesun.co.uk',
      'media.thesun.co.uk',
      'static.thesun.co.uk',
      'cdn.thesun.co.uk',
      'assets.thesun.co.uk',
      'images.standard.co.uk',
      'media.standard.co.uk',
      'static.standard.co.uk',
      'cdn.standard.co.uk',
      'assets.standard.co.uk',
      'images.eveningstandard.co.uk',
      'media.eveningstandard.co.uk',
      'static.eveningstandard.co.uk',
      'cdn.eveningstandard.co.uk',
      'assets.eveningstandard.co.uk',
    ];
    
    if (reliableNewsDomains.some(domain => hostname === domain)) {
      // Auto-add to trusted domains
      try {
        await fetch('/api/football/trust-domain', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ domain: hostname })
        });
      } catch {
        // Silently fail if auto-adding domain fails
      }
      return true;
    }
    
    return false;
  } catch {
    return false;
  }
}



// Transform news API data to our app's format
export async function transformNewsArticle(article: NewsApiArticle) {
  // Check if image URL is from a trusted domain, otherwise use Chelsea logo
  const isTrusted = await isTrustedNewsImageUrl(article.urlToImage || '');
  const safeImageUrl = isTrusted ? article.urlToImage : '/chelsea-logo.png';

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