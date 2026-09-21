import { Player } from '@/services/fetchRoster';

interface PlayerCardProps {
  player: Player;
}

export default function PlayerCard({ player }: PlayerCardProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="h-1.5 bg-blue-700" />
      {!!player.number && (
        <span className="pointer-events-none absolute right-3 top-4 text-6xl font-black leading-none text-blue-700/10 dark:text-blue-300/10">
          {player.number}
        </span>
      )}
      <div className="relative p-5">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold leading-tight text-gray-900 dark:text-white">
              {player.name}
            </h3>
            <p className="mt-1 text-sm font-semibold text-blue-700 dark:text-blue-400">
              {player.position}
            </p>
          </div>
          {!!player.number && (
            <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700 dark:bg-blue-950/50 dark:text-blue-200">
              #{player.number}
            </span>
          )}
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between rounded-xl bg-gray-50 px-3 py-2 dark:bg-gray-800/80">
            <span className="text-gray-500 dark:text-gray-400">Nationality</span>
            <span className="font-semibold text-gray-900 dark:text-white">{player.nationality}</span>
          </div>
          {player.age && (
            <div className="flex items-center justify-between rounded-xl bg-gray-50 px-3 py-2 dark:bg-gray-800/80">
              <span className="text-gray-500 dark:text-gray-400">Age</span>
              <span className="font-semibold text-gray-900 dark:text-white">{player.age}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
