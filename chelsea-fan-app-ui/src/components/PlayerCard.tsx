import { Player } from '@/services/fetchRoster';

interface PlayerCardProps {
  player: Player;
}

export default function PlayerCard({ player }: PlayerCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-6">
        {/* Header with name and number */}
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">{player.name}</h3>
          {player.number && (
            <div className="bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg">
              {player.number}
            </div>
          )}
        </div>
        
        {/* Position and nationality */}
        <div className="mb-4">
          <p className="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-1">{player.position}</p>
          <p className="text-sm text-gray-600 dark:text-gray-300">{player.nationality}</p>
        </div>
        
        {/* Player stats */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          {player.age && (
            <div className="flex justify-between items-center py-2 px-3 bg-gray-50 dark:bg-gray-700 rounded">
              <span className="text-gray-600 dark:text-gray-400 font-medium">Age</span>
              <span className="font-bold text-gray-900 dark:text-white">{player.age}</span>
            </div>
          )}
          {player.height && player.height !== 'Unknown' && (
            <div className="flex justify-between items-center py-2 px-3 bg-gray-50 dark:bg-gray-700 rounded">
              <span className="text-gray-600 dark:text-gray-400 font-medium">Height</span>
              <span className="font-bold text-gray-900 dark:text-white">{player.height}</span>
            </div>
          )}
          {player.goals !== undefined && player.goals > 0 && (
            <div className="flex justify-between items-center py-2 px-3 bg-green-50 dark:bg-green-900/20 rounded">
              <span className="text-green-700 dark:text-green-400 font-medium">Goals</span>
              <span className="font-bold text-green-700 dark:text-green-400">{player.goals}</span>
            </div>
          )}
          {player.assists !== undefined && player.assists > 0 && (
            <div className="flex justify-between items-center py-2 px-3 bg-blue-50 dark:bg-blue-900/20 rounded">
              <span className="text-blue-700 dark:text-blue-400 font-medium">Assists</span>
              <span className="font-bold text-blue-700 dark:text-blue-400">{player.assists}</span>
            </div>
          )}
          {player.appearances !== undefined && player.appearances > 0 && (
            <div className="flex justify-between items-center py-2 px-3 bg-purple-50 dark:bg-purple-900/20 rounded">
              <span className="text-purple-700 dark:text-purple-400 font-medium">Apps</span>
              <span className="font-bold text-purple-700 dark:text-purple-400">{player.appearances}</span>
            </div>
          )}
        </div>
        
        {/* Rating if available */}
        {player.rating && player.rating !== '0' && (
          <div className="mt-4 flex justify-center">
            <div className="bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 px-4 py-2 rounded-full font-bold">
              Rating: {player.rating}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 