# Chelsea Fan App

A Next.js web application for Chelsea FC fans to stay updated with the latest news, fixtures, squad information, and engage with the community through forums and polls.

## About

I built this app because I wanted a dedicated platform for Chelsea fans to get all their club information in one place. The app pulls real data from football APIs and news sources to provide up-to-date information about the team.

## Features

- **News Section**: Real-time Chelsea news from various sources with automatic content filtering
- **Fixtures**: Current season fixtures with match details and results
- **Squad**: Complete player roster with stats and information
- **Community**: Forums and polls for fan discussions
- **User Authentication**: Sign up and login functionality with Supabase
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Frontend**: Next.js 15 with TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: Supabase Auth
- **Database**: Supabase PostgreSQL
- **APIs**: 
  - Football-data.org for fixtures and squad data
  - NewsAPI.org for Chelsea news
- **Deployment**: Ready for Vercel deployment

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   cd chelsea-fan-app-ui
   npm install
   ```

3. Set up environment variables in `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_NEWS_API_KEY=your_news_api_key
   NEXT_PUBLIC_FOOTBALL_DATA_API_KEY=your_football_api_key
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
chelsea-fan-app-ui/
├── src/
│   ├── app/                 # Next.js app router pages
│   ├── components/          # React components
│   ├── services/           # API services and data fetching
│   ├── context/            # React context providers
│   └── lib/                # Utility libraries
├── public/                 # Static assets
└── package.json
```

## API Integration

The app integrates with several external APIs:

- **Football Data API**: Provides current season fixtures and squad information
- **News API**: Fetches Chelsea-related news articles
- **Supabase**: Handles user authentication and community features

## Development Notes

I've implemented several features to improve the user experience:

- Automatic image domain trust system that learns reliable sources
- Chelsea logo fallbacks for missing images
- Mobile-responsive design with hamburger navigation
- Real-time data updates from APIs
- Content filtering to ensure Chelsea-relevant news

## Future Plans

I'm planning to add:
- Live match updates
- Player statistics and performance tracking
- Push notifications for important news
- More community features like user profiles
- Integration with Chelsea's official social media

## Contributing

Feel free to submit issues or pull requests if you have ideas for improvements. This is a personal project but I'm open to suggestions from other Chelsea fans.

## License

This is a personal project built for learning and as a fan application. Not affiliated with Chelsea FC. 