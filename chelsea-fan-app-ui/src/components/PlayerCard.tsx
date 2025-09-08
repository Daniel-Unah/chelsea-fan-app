import { Player } from '@/services/fetchRoster';

interface PlayerCardProps {
  player: Player;
}

export default function PlayerCard({ player }: PlayerCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow h-full">
      <div className="p-6 h-full flex flex-col">
        {/* Header with name - Fixed height for consistency */}
        <div className="mb-4 min-h-[3rem]">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white leading-tight">
            {player.name}
          </h3>
        </div>
        
        {/* Position and nationality - Fixed height for consistency */}
        <div className="mb-4 min-h-[3.5rem]">
          <p className="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-1 leading-tight">
            {player.position}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300 leading-tight">
            {player.nationality}
          </p>
        </div>
        
        {/* Player info - Basic details only */}
        <div className="grid grid-cols-1 gap-3 text-sm flex-1">
          {player.age && (
            <div className="flex justify-between items-center py-2 px-3 bg-gray-50 dark:bg-gray-700 rounded min-h-[2.5rem]">
              <span className="text-gray-600 dark:text-gray-400 font-medium">Age</span>
              <span className="font-bold text-gray-900 dark:text-white">{player.age}</span>
            </div>
          )}
          {player.height && player.height !== 'Unknown' && (
            <div className="flex justify-between items-center py-2 px-3 bg-gray-50 dark:bg-gray-700 rounded min-h-[2.5rem]">
              <span className="text-gray-600 dark:text-gray-400 font-medium">Height</span>
              <span className="font-bold text-gray-900 dark:text-white">{player.height}</span>
            </div>
          )}
        </div>
        
        {/* Rating if available - Fixed position at bottom */}
        {player.rating && player.rating !== '0' && (
          <div className="mt-4 flex justify-center flex-shrink-0">
            <div className="bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 px-4 py-2 rounded-full font-bold">
              Rating: {player.rating}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 