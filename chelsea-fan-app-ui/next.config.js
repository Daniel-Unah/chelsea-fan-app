/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // Football API domains
      { protocol: 'https', hostname: 'photobooth-api.onefootball.com', port: '', pathname: '/**' },
      { protocol: 'https', hostname: 'media.api-sports.io', port: '', pathname: '/**' },
      { protocol: 'https', hostname: 'crests.football-data.org', port: '', pathname: '/**' },
      
      // News domains
      { protocol: 'https', hostname: 'imageio.forbes.com', port: '', pathname: '/**' },
      { protocol: 'https', hostname: 'phantom-marca.uecdn.es', port: '', pathname: '/**' },
      { protocol: 'https', hostname: 'images.unsplash.com', port: '', pathname: '/**' },
      { protocol: 'https', hostname: 'upload.wikimedia.org', port: '', pathname: '/**' },
      
      // Chelsea domains
      { protocol: 'https', hostname: 'icdn.chelsea.news', port: '', pathname: '/**' },
      { protocol: 'https', hostname: 'img.chelseafc.com', port: '', pathname: '/**' },
      
      // Common news domains
      { protocol: 'https', hostname: '*.forbes.com', port: '', pathname: '/**' },
      { protocol: 'https', hostname: '*.bbc.com', port: '', pathname: '/**' },
      { protocol: 'https', hostname: '*.sky.com', port: '', pathname: '/**' },
      { protocol: 'https', hostname: '*.espn.com', port: '', pathname: '/**' },
      { protocol: 'https', hostname: '*.goal.com', port: '', pathname: '/**' },
      { protocol: 'https', hostname: '*.theguardian.com', port: '', pathname: '/**' },
      { protocol: 'https', hostname: '*.telegraph.co.uk', port: '', pathname: '/**' },
      { protocol: 'https', hostname: '*.independent.co.uk', port: '', pathname: '/**' },
      { protocol: 'https', hostname: '*.dailymail.co.uk', port: '', pathname: '/**' },
      { protocol: 'https', hostname: '*.mirror.co.uk', port: '', pathname: '/**' },
      { protocol: 'https', hostname: '*.metro.co.uk', port: '', pathname: '/**' },
      { protocol: 'https', hostname: '*.standard.co.uk', port: '', pathname: '/**' },
      { protocol: 'https', hostname: '*.eveningstandard.co.uk', port: '', pathname: '/**' },
      { protocol: 'https', hostname: '*.football.london', port: '', pathname: '/**' },
      { protocol: 'https', hostname: '*.chelseafc.com', port: '', pathname: '/**' },
      { protocol: 'https', hostname: '*.premierleague.com', port: '', pathname: '/**' },
      { protocol: 'https', hostname: '*.uefa.com', port: '', pathname: '/**' },
      { protocol: 'https', hostname: '*.fifa.com', port: '', pathname: '/**' },
    ],
  },
};

module.exports = nextConfig; 