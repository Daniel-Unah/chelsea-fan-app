import { Fixture } from '@/services/fetchFixtures';
import Image from 'next/image';

interface FixtureCardProps {
  fixture: Fixture;
  isNextFixture?: boolean;
}

const FINISHED_STATUSES = new Set(['FINISHED', 'AWARDED', 'FT']);
const LIVE_STATUSES = new Set(['IN_PLAY', 'PAUSED', 'EXTRA_TIME', 'PENALTY_SHOOTOUT', '1H', '2H', 'HT', 'PEN', 'AET']);

function isFinished(status?: string) {
  return FINISHED_STATUSES.has(status || '');
}

function isLive(status?: string) {
  return LIVE_STATUSES.has(status || '');
}

export default function FixtureCard({ fixture, isNextFixture = false }: FixtureCardProps) {
  const matchDate = new Date(fixture.date);
  const formattedDate = matchDate.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const finished = isFinished(fixture.status);
  const live = isLive(fixture.status);

  const getStatusColor = (status?: string) => {
    if (isFinished(status)) return 'text-green-600';
    if (isLive(status)) return 'text-orange-600';

    switch (status) {
      case 'TIMED':
      case 'SCHEDULED':
      case 'NS':
        return 'text-blue-600';
      case 'POSTPONED':
      case 'CANCELLED':
      case 'SUSPENDED':
      case 'PST':
      case 'CANC':
      case 'SUSP':
        return 'text-red-600';
      default:
        return 'text-gray-600 dark:text-gray-300';
    }
  };

  const getStatusText = (status?: string) => {
    switch (status) {
      case 'FINISHED':
      case 'FT':
      case 'AWARDED':
        return 'Final';
      case 'IN_PLAY':
      case '1H':
      case '2H':
        return 'Live';
      case 'PAUSED':
      case 'HT':
        return 'Paused';
      case 'EXTRA_TIME':
      case 'AET':
        return 'Extra Time';
      case 'PENALTY_SHOOTOUT':
      case 'PEN':
        return 'Penalties';
      case 'TIMED':
      case 'SCHEDULED':
      case 'NS':
        return 'Scheduled';
      case 'POSTPONED':
      case 'PST':
        return 'Postponed';
      case 'CANCELLED':
      case 'CANC':
        return 'Cancelled';
      case 'SUSPENDED':
      case 'SUSP':
        return 'Suspended';
      default:
        return 'Scheduled';
    }
  };

  const getMatchResult = (score?: string) => {
    if (!score) return null;

    const [chelseaScore, opponentScore] = score.split('-').map(Number);

    if (chelseaScore > opponentScore) return 'W';
    if (chelseaScore < opponentScore) return 'L';
    return 'D';
  };

  const getResultColor = (result: string) => {
    switch (result) {
      case 'W':
        return 'bg-green-500 text-white';
      case 'L':
        return 'bg-red-500 text-white';
      case 'D':
        return 'bg-gray-500 text-white';
      default:
        return 'bg-gray-300 text-gray-700';
    }
  };

  const result = finished ? getMatchResult(fixture.score) : null;

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-3 sm:p-4 hover:shadow-lg transition-shadow ${
      isNextFixture ? 'border-2 border-blue-500' : ''
    }`}>
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0">
        <div className="flex-1 w-full sm:w-auto text-center sm:text-left">
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">{fixture.competition}</p>
          <p className="font-semibold text-sm sm:text-base">{formattedDate}</p>
        </div>
        <div className="flex-1 text-center">
          <div className="grid grid-cols-3 items-center gap-1 sm:gap-2">
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

            <div className="flex flex-col items-center">
              <span className="text-gray-500 font-semibold text-xs sm:text-sm">vs</span>
              {fixture.score && (
                <span className="text-base sm:text-lg font-bold">{fixture.score}</span>
              )}
            </div>

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
          {finished && result ? (
            <div className="flex items-center justify-center sm:justify-end gap-2 mb-1">
              <span className={`px-2 py-1 rounded-full text-xs font-bold ${getResultColor(result)}`}>
                {result}
              </span>
            </div>
          ) : !finished && !live ? (
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
              {matchDate.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
                timeZone: 'UTC'
              })}
            </p>
          ) : null}
          <p className={`text-xs sm:text-sm ${getStatusColor(fixture.status)}`}>
            {getStatusText(fixture.status)}
          </p>
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
