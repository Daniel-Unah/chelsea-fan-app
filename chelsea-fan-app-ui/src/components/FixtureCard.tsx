import { Fixture } from '@/services/fetchFixtures';

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

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 ${
      isNextFixture ? 'border-2 border-blue-500' : ''
    }`}>
      <div className="flex justify-between items-center">
        <div className="flex-1">
          <p className="text-sm text-gray-600 dark:text-gray-300">{fixture.competition}</p>
          <p className="font-semibold">{formattedDate}</p>
        </div>
        <div className="flex-1 text-center">
          <div className="flex items-center justify-center gap-2">
            <span className="font-bold">Chelsea</span>
            <span className="text-gray-500">vs</span>
            <span className="font-bold">{fixture.opponent}</span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {fixture.home_or_away === 'home' ? 'at Stamford Bridge' : 'Away'}
          </p>
        </div>
        <div className="flex-1 text-right">
          {fixture.score ? (
            <p className="text-xl font-bold">{fixture.score}</p>
          ) : (
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {matchDate.toLocaleTimeString('en-GB', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          )}
        </div>
      </div>
      {isNextFixture && (
        <div className="mt-2 text-center">
          <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
            Next Match
          </span>
        </div>
      )}
    </div>
  );
} 