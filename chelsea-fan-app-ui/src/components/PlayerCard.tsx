import { Player } from '@/services/fetchRoster';
import Image from 'next/image';

interface PlayerCardProps {
  player: Player;
}

export default function PlayerCard({ player }: PlayerCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div className="relative h-48 w-full">
        {player.photo_url ? (
          <Image
            src={player.photo_url}
            alt={player.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            <span className="text-gray-400 dark:text-gray-500">No photo</span>
          </div>
        )}
        {player.number && (
          <div className="absolute top-2 right-2 bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">
            {player.number}
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-xl font-bold mb-1">{player.name}</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-1">{player.position}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">{player.nationality}</p>
      </div>
    </div>
  );
} 