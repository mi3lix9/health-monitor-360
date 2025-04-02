
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchAllPlayers } from '../services/apiService';
import { PlayerWithVitals } from '../types';
import { Search } from 'lucide-react';
import PlayerCard from '../components/PlayerCard';

const PlayersPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Fetch player data
  const { data: players, isLoading, error } = useQuery({
    queryKey: ['players'],
    queryFn: fetchAllPlayers,
    refetchInterval: 1000, // Update every second
  });
  
  // Filter players based on search term
  const filteredPlayers = players?.filter(player => 
    player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    player.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
    player.number.toString().includes(searchTerm)
  );
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="text-lg text-gray-500">Loading players...</div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="text-lg text-red-500">Error loading players. Please try again.</div>
      </div>
    );
  }
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Players</h1>
        <p className="text-gray-500">View and monitor all players in the team</p>
      </div>
      
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search by name, position, or number..."
          className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-info focus:border-transparent"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredPlayers?.map(player => (
          <PlayerCard key={player.id} player={player} />
        ))}
        
        {filteredPlayers?.length === 0 && (
          <div className="col-span-full py-10 text-center">
            <p className="text-gray-500">No players found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayersPage;
