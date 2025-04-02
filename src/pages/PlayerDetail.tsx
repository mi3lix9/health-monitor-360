import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchPlayerById, fetchPlayerHistory } from '../services/apiService';
import { Heart, Thermometer, Activity, Droplet, Wind, Clock } from 'lucide-react';
import { PlayerWithVitals, VitalsHistory, VITAL_RANGES } from '../types';
import StatusBadge from '../components/StatusBadge';
import VitalCard from '../components/VitalCard';
import VitalChart from '../components/VitalChart';
import PlayerHealthAlert from '../components/PlayerHealthAlert';

const PlayerDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const playerId = parseInt(id || '0');
  
  const [player, setPlayer] = useState<PlayerWithVitals | undefined>(undefined);
  const [history, setHistory] = useState<VitalsHistory | undefined>(undefined);
  
  // Fetch player data
  const { data: playerData, isLoading: isLoadingPlayer } = useQuery({
    queryKey: ['player', playerId],
    queryFn: () => fetchPlayerById(playerId),
    refetchInterval: 1000, // Update every second
    enabled: !!playerId
  });
  
  // Fetch player history
  const { data: historyData, isLoading: isLoadingHistory } = useQuery({
    queryKey: ['playerHistory', playerId],
    queryFn: () => fetchPlayerHistory(playerId),
    refetchInterval: 1000, // Update every second
    enabled: !!playerId
  });
  
  useEffect(() => {
    if (playerData) {
      setPlayer(playerData);
    }
    
    if (historyData) {
      setHistory(historyData);
    }
  }, [playerData, historyData]);
  
  if (isLoadingPlayer || isLoadingHistory) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="text-lg text-gray-500">Loading player data...</div>
      </div>
    );
  }
  
  if (!player) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="text-lg text-red-500">Player not found</div>
      </div>
    );
  }
  
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{player.name}</h1>
          <p className="text-gray-500">#{player.number} · {player.position}</p>
        </div>
        <StatusBadge status={player.status} pulseAnimation={true} />
      </div>
      
      <PlayerHealthAlert player={player} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-1">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
            <div className="flex items-center mb-4">
              <div className="h-20 w-20 rounded-full overflow-hidden mr-4">
                <img src={player.imageUrl} alt={player.name} className="h-full w-full object-cover" />
              </div>
              <div>
                <h2 className="text-xl font-bold">{player.name}</h2>
                <p className="text-gray-500">#{player.number} · {player.position}</p>
                <div className="mt-2">
                  <StatusBadge status={player.status} pulseAnimation={true} />
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <VitalCard 
              title="Temperature" 
              value={player.vitals.temperature} 
              unit="°C" 
              vitalType="temperature"
              icon={<Thermometer className="h-4 w-4" />}
            />
            <VitalCard 
              title="Heart Rate" 
              value={player.vitals.heartRate} 
              unit="BPM" 
              vitalType="heartRate"
              icon={<Heart className="h-4 w-4" />}
            />
            <VitalCard 
              title="Blood Oxygen" 
              value={player.vitals.bloodOxygen} 
              unit="%" 
              vitalType="bloodOxygen"
              icon={<Activity className="h-4 w-4" />}
            />
            <VitalCard 
              title="Hydration" 
              value={player.vitals.hydration!} 
              unit="%" 
              vitalType="hydration"
              icon={<Droplet className="h-4 w-4" />}
            />
            <VitalCard 
              title="Respiration" 
              value={player.vitals.respiration!} 
              unit="breaths/min" 
              vitalType="respiration"
              icon={<Wind className="h-4 w-4" />}
            />
            <VitalCard 
              title="Fatigue" 
              value={player.vitals.fatigue!} 
              unit="%" 
              vitalType="fatigue"
              icon={<Clock className="h-4 w-4" />}
            />
          </div>
        </div>
        
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 gap-6">
            {history && (
              <>
                <VitalChart 
                  data={history.data} 
                  vitalType="temperature"
                  dataKey="temperature" 
                  title="Temperature" 
                  unit="°C"
                />
                <VitalChart 
                  data={history.data} 
                  vitalType="heartRate"
                  dataKey="heartRate" 
                  title="Heart Rate" 
                  unit="BPM"
                />
                <VitalChart 
                  data={history.data} 
                  vitalType="bloodOxygen"
                  dataKey="bloodOxygen" 
                  title="Blood Oxygen" 
                  unit="%"
                />
              </>
            )}
          </div>
        </div>
      </div>
      
      <h2 className="text-xl font-bold text-gray-800 mb-4">Additional Health Metrics</h2>
      <div className="grid grid-cols-1 gap-6">
        {history && (
          <>
            <VitalChart 
              data={history.data} 
              vitalType="hydration"
              dataKey="hydration" 
              title="Hydration Level" 
              unit="%"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <VitalChart 
                data={history.data} 
                vitalType="respiration"
                dataKey="respiration" 
                title="Respiration Rate" 
                unit="breaths/min"
              />
              <VitalChart 
                data={history.data} 
                vitalType="fatigue"
                dataKey="fatigue" 
                title="Fatigue Level" 
                unit="%"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PlayerDetail;
