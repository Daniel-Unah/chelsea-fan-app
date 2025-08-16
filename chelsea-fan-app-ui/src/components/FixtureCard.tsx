import { Fixture } from '@/services/fetchFixtures';
import Image from 'next/image';

interface FixtureCardProps {
  fixture: Fixture;
  isNextFixture?: boolean;
}

export default function FixtureCard({ fixture, isNextFixture = false }: FixtureCardProps) {
  const matchDate = new Date(fixture.date);
  const formattedDate = matchDate.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'FT':
        return 'text-green-600';
      case 'NS':
        return 'text-blue-600';
      case '1H':
      case '2H':
        return 'text-orange-600';
      default:
        return 'text-gray-600 dark:text-gray-300';
    }
  };

  const getStatusText = (status?: string) => {
    switch (status) {
      case 'FT':
        return 'Full Time';
      case 'NS':
        return 'Not Started';
      case '1H':
        return 'First Half';
      case '2H':
        return 'Second Half';
      default:
        return 'Scheduled';
    }
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-3 sm:p-4 hover:shadow-lg transition-shadow ${
      isNextFixture ? 'border-2 border-blue-500' : ''
    }`}>
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0">
        <div className="flex-1 w-full sm:w-auto text-center sm:text-left">
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">{fixture.competition}</p>
          <p className="font-semibold text-sm sm:text-base">{formattedDate}</p>
          {fixture.venue && (
            <p className="text-xs text-gray-500 dark:text-gray-400">{fixture.venue}</p>
          )}
        </div>
        <div className="flex-1 text-center">
          <div className="grid grid-cols-3 items-center gap-1 sm:gap-2">
            {/* Chelsea - Fixed width column */}
            <div className="flex flex-col items-center">
              <div className="w-6 h-6 sm:w-8 sm:h-8 relative">
                <Image
                  src="/chelsea-logo.png"
                  alt="Chelsea FC"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-xs text-gray-600 dark:text-gray-300 mt-1 text-center">Chelsea</span>
            </div>
            
            {/* VS and Score - Fixed width column */}
            <div className="flex flex-col items-center">
              <span className="text-gray-500 font-semibold text-xs sm:text-sm">vs</span>
              {fixture.score && (
                <span className="text-base sm:text-lg font-bold">{fixture.score}</span>
              )}
            </div>
            
            {/* Opponent - Fixed width column */}
            <div className="flex flex-col items-center">
              {fixture.opponent_logo ? (
                <div className="w-6 h-6 sm:w-8 sm:h-8 relative">
                  <Image
                    src={fixture.opponent_logo}
                    alt={fixture.opponent}
                    fill
                    className="object-contain"
                  />
                </div>
              ) : (
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-gray-600 text-xs font-bold">
                    {fixture.opponent.split(' ').map(word => word[0]).join('')}
                  </span>
                </div>
              )}
              <span className="text-xs text-gray-600 dark:text-gray-300 mt-1 text-center break-words">
                {fixture.opponent}
              </span>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-2">
            {fixture.home_or_away === 'home' ? 'at Stamford Bridge' : 'Away'}
          </p>
        </div>
        <div className="flex-1 w-full sm:w-auto text-center sm:text-right">
          {fixture.score ? (
            <div className="text-center sm:text-right">
              <p className="text-lg sm:text-xl font-bold">{fixture.score}</p>
              <p className={`text-xs sm:text-sm ${getStatusColor(fixture.status)}`}>
                {getStatusText(fixture.status)}
              </p>
            </div>
          ) : (
            <div className="text-center sm:text-right">
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                {matchDate.toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true
                })}
              </p>
              <p className={`text-xs sm:text-sm ${getStatusColor(fixture.status)}`}>
                {getStatusText(fixture.status)}
              </p>
            </div>
          )}
        </div>
      </div>
      {isNextFixture && (
        <div className="mt-3 text-center">
          <span className="bg-blue-500 text-white text-xs px-3 py-1 rounded-full font-semibold">
            Next Match
          </span>
        </div>
      )}
    </div>
  );
} 