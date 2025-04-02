
import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Thermometer, Activity } from 'lucide-react';
import { PlayerWithVitals } from '../types';
import StatusBadge from './StatusBadge';

interface PlayerCardProps {
  player: PlayerWithVitals;
}

const PlayerCard: React.FC<PlayerCardProps> = ({ player }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full overflow-hidden mr-3">
              <img src={player.imageUrl} alt={player.name} className="h-full w-full object-cover" />
            </div>
            <div>
              <h3 className="font-medium">{player.name}</h3>
              <div className="text-xs text-gray-500">
                #{player.number} · {player.position}
              </div>
            </div>
          </div>
          <StatusBadge status={player.status} pulseAnimation={true} />
        </div>
        
        <div className="grid grid-cols-3 gap-3 mb-4">
          <VitalDisplay 
            icon={<Thermometer className="h-4 w-4" />} 
            value={player.vitals.temperature.toFixed(1)} 
            unit="°C" 
            label="Temperature" 
          />
          <VitalDisplay 
            icon={<Heart className="h-4 w-4" />} 
            value={player.vitals.heartRate.toString()} 
            unit="BPM" 
            label="Heart Rate" 
          />
          <VitalDisplay 
            icon={<Activity className="h-4 w-4" />} 
            value={player.vitals.bloodOxygen.toFixed(1)} 
            unit="%" 
            label="O₂ Sat" 
          />
        </div>
        
        <Link 
          to={`/player/${player.id}`} 
          className="block w-full px-4 py-2 text-sm text-center text-white bg-info rounded-lg hover:bg-info/90 transition-colors"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

interface VitalDisplayProps {
  icon: React.ReactNode;
  value: string;
  unit: string;
  label: string;
}

const VitalDisplay: React.FC<VitalDisplayProps> = ({ icon, value, unit, label }) => (
  <div className="flex flex-col items-center p-2 rounded-lg bg-gray-50">
    <div className="flex items-center mb-1 text-gray-600">
      {icon}
      <span className="text-xs ml-1">{label}</span>
    </div>
    <div>
      <span className="text-lg font-semibold">{value}</span>
      <span className="text-xs text-gray-500">{unit}</span>
    </div>
  </div>
);

export default PlayerCard;
