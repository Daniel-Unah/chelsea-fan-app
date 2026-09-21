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
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
  const finished = isFinished(fixture.status);
  const live = isLive(fixture.status);

  const getStatusStyle = (status?: string) => {
    if (isFinished(status)) return 'bg-green-50 text-green-700 dark:bg-green-950/40 dark:text-green-300';
    if (isLive(status)) return 'bg-orange-50 text-orange-700 dark:bg-orange-950/40 dark:text-orange-300';

    switch (status) {
      case 'TIMED':
      case 'SCHEDULED':
      case 'NS':
        return 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300';
      case 'POSTPONED':
      case 'CANCELLED':
      case 'SUSPENDED':
      case 'PST':
      case 'CANC':
      case 'SUSP':
        return 'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300';
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
        return 'bg-green-600 text-white';
      case 'L':
        return 'bg-red-600 text-white';
      case 'D':
        return 'bg-gray-500 text-white';
      default:
        return 'bg-gray-300 text-gray-700';
    }
  };

  const result = finished ? getMatchResult(fixture.score) : null;

  return (
    <div className={`rounded-2xl border bg-white p-4 shadow-sm transition dark:bg-gray-900 sm:p-5 ${
      isNextFixture
        ? 'border-blue-500 ring-2 ring-blue-500/20'
        : 'border-gray-200/80 dark:border-gray-800'
    }`}>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
            {fixture.competition}
          </p>
          <p className="text-sm font-semibold text-gray-900 dark:text-white">{formattedDate}</p>
        </div>
        <div className="flex items-center gap-2">
          {isNextFixture && (
            <span className="rounded-full bg-blue-600 px-2.5 py-1 text-xs font-semibold text-white">
              Next match
            </span>
          )}
          <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusStyle(fixture.status)}`}>
            {getStatusText(fixture.status)}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        <div className="flex items-center justify-end gap-2">
          <span className="hidden text-right text-sm font-semibold text-gray-900 dark:text-white sm:block">Chelsea</span>
          <div className="relative h-9 w-9 sm:h-10 sm:w-10">
            <Image src="/chelsea-logo.png" alt="Chelsea FC" fill className="object-contain" />
          </div>
        </div>

        <div className="min-w-16 text-center">
          {fixture.score ? (
            <span className="text-2xl font-bold tabular-nums text-gray-900 dark:text-white">{fixture.score}</span>
          ) : (
            <span className="text-sm font-semibold text-gray-400">vs</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {fixture.opponent_logo ? (
            <div className="relative h-9 w-9 sm:h-10 sm:w-10">
              <Image src={fixture.opponent_logo} alt={fixture.opponent} fill className="object-contain" />
            </div>
          ) : (
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-xs font-bold text-gray-600 dark:bg-gray-800 sm:h-10 sm:w-10">
              {fixture.opponent.split(' ').map(word => word[0]).join('')}
            </div>
          )}
          <span className="hidden text-sm font-semibold text-gray-900 dark:text-white sm:block">{fixture.opponent}</span>
        </div>
      </div>

      <p className="mt-2 text-center text-xs font-medium text-gray-500 sm:hidden">{fixture.opponent}</p>

      <div className="mt-4 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 sm:text-sm">
        <span>{fixture.home_or_away === 'home' ? 'Stamford Bridge' : 'Away'}</span>
        <div className="flex items-center gap-2">
          {finished && result && (
            <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${getResultColor(result)}`}>
              {result}
            </span>
          )}
          {!finished && !live && (
            <span>
              {matchDate.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
                timeZone: 'UTC',
              })}{' '}
              UTC
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
