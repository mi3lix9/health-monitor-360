
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchAllPlayers } from '../services/apiService';
import { PlayerWithVitals } from '../types';
import PlayerCard from '../components/PlayerCard';

const Dashboard: React.FC = () => {
  const [players, setPlayers] = useState<PlayerWithVitals[]>([]);
  
  // Fetch initial player data
  const { data, isLoading, error } = useQuery({
    queryKey: ['players'],
    queryFn: fetchAllPlayers,
    refetchInterval: 1000 // Update every second
  });
  
  useEffect(() => {
    if (data) {
      setPlayers(data);
    }
  }, [data]);
  
  const getAlertCount = () => {
    return players.filter(p => p.status === 'alert').length;
  };
  
  const getWarningCount = () => {
    return players.filter(p => p.status === 'warning').length;
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="text-lg text-gray-500">Loading player data...</div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="text-lg text-red-500">Error loading data. Please try again.</div>
      </div>
    );
  }
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Team Health Dashboard</h1>
        <p className="text-gray-500">Real-time health monitoring for all players</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-4 rounded-xl shadow-sm flex items-center border border-gray-100">
          <div className="bg-info/10 p-3 rounded-full mr-4">
            <div className="text-info h-6 w-6 flex items-center justify-center font-bold">
              {players.length}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-600">Total Players</h3>
            <p className="text-xl font-bold text-gray-800">{players.length}</p>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-xl shadow-sm flex items-center border border-gray-100">
          <div className="bg-warning/10 p-3 rounded-full mr-4">
            <div className="text-warning h-6 w-6 flex items-center justify-center font-bold">
              {getWarningCount()}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-600">Warnings</h3>
            <p className="text-xl font-bold text-gray-800">{getWarningCount()}</p>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-xl shadow-sm flex items-center border border-gray-100">
          <div className="bg-danger/10 p-3 rounded-full mr-4">
            <div className="text-danger h-6 w-6 flex items-center justify-center font-bold">
              {getAlertCount()}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-600">Alerts</h3>
            <p className="text-xl font-bold text-gray-800">{getAlertCount()}</p>
          </div>
        </div>
      </div>
      
      <h2 className="text-xl font-bold text-gray-800 mb-4">Player Status</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {players.map(player => (
          <PlayerCard key={player.id} player={player} />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
