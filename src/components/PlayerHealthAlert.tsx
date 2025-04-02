
import React from 'react';
import { AlertTriangle, Heart } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { PlayerWithVitals, VITAL_RANGES } from '../types';
import { formatVitalValue } from '../utils/dataUtils';

interface PlayerHealthAlertProps {
  player: PlayerWithVitals;
}

const PlayerHealthAlert: React.FC<PlayerHealthAlertProps> = ({ player }) => {
  if (player.status !== 'alert' && player.status !== 'infection') {
    return null;
  }

  // Determine which vitals are abnormal
  const abnormalVitals = [];
  
  if (player.vitals.temperature < VITAL_RANGES.temperature.min || 
      player.vitals.temperature > VITAL_RANGES.temperature.max) {
    abnormalVitals.push({
      name: 'Temperature',
      value: formatVitalValue(player.vitals.temperature, 'temperature'),
      unit: '°C',
      isHigh: player.vitals.temperature > VITAL_RANGES.temperature.max,
      isLow: player.vitals.temperature < VITAL_RANGES.temperature.min,
      normal: `${VITAL_RANGES.temperature.min}-${VITAL_RANGES.temperature.max}°C`
    });
  }
  
  if (player.vitals.heartRate < VITAL_RANGES.heartRate.min || 
      player.vitals.heartRate > VITAL_RANGES.heartRate.max) {
    abnormalVitals.push({
      name: 'Heart Rate',
      value: formatVitalValue(player.vitals.heartRate, 'heartRate'),
      unit: 'BPM',
      isHigh: player.vitals.heartRate > VITAL_RANGES.heartRate.max,
      isLow: player.vitals.heartRate < VITAL_RANGES.heartRate.min,
      normal: `${VITAL_RANGES.heartRate.min}-${VITAL_RANGES.heartRate.max} BPM`
    });
  }
  
  if (player.vitals.bloodOxygen < VITAL_RANGES.bloodOxygen.min || 
      player.vitals.bloodOxygen > VITAL_RANGES.bloodOxygen.max) {
    abnormalVitals.push({
      name: 'Blood Oxygen',
      value: formatVitalValue(player.vitals.bloodOxygen, 'bloodOxygen'),
      unit: '%',
      isHigh: player.vitals.bloodOxygen > VITAL_RANGES.bloodOxygen.max,
      isLow: player.vitals.bloodOxygen < VITAL_RANGES.bloodOxygen.min,
      normal: `${VITAL_RANGES.bloodOxygen.min}-${VITAL_RANGES.bloodOxygen.max}%`
    });
  }

  const alertTitle = player.status === 'infection' 
    ? `Potential Infection Detected for ${player.name}` 
    : `Health Alert for ${player.name}`;

  const alertIcon = player.status === 'infection' 
    ? <Heart className="h-5 w-5 text-purple-600" />
    : <AlertTriangle className="h-5 w-5 text-red-500" />;
  
  const alertVariant = player.status === 'infection' ? 'default' : 'destructive';
  const alertBgColor = player.status === 'infection' ? 'bg-purple-50 border-purple-200' : 'bg-red-50 border-red-200';

  return (
    <Alert variant={alertVariant} className={`mb-6 ${alertBgColor}`}>
      <div className="flex items-start">
        {alertIcon}
        <div className="ml-4 w-full">
          <AlertTitle className={player.status === 'infection' ? 'text-purple-700' : 'text-red-700'}>
            {alertTitle}
          </AlertTitle>
          <AlertDescription>
            <div className="mt-2">
              {player.status === 'infection' && (
                <p className="text-purple-700 mb-2">
                  AI-assisted analysis indicates a potential infection. Medical evaluation recommended.
                </p>
              )}
              <p className={player.status === 'infection' ? 'text-purple-700' : 'text-red-700'}>
                Abnormal vital signs detected:
              </p>
              <ul className="mt-1 space-y-1">
                {abnormalVitals.map((vital, index) => (
                  <li key={index} className="flex items-center justify-between text-sm">
                    <span>{vital.name}:</span>
                    <span className={vital.isHigh ? 'text-red-600 font-semibold' : vital.isLow ? 'text-blue-600 font-semibold' : ''}>
                      {vital.value}{vital.unit} 
                      <span className="text-gray-500 ml-2">
                        (Normal: {vital.normal})
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
              
              {player.vitals.alertDuration && (
                <p className="mt-2 text-sm text-gray-600">
                  Alert duration: {Math.floor(player.vitals.alertDuration)} seconds
                </p>
              )}
            </div>
          </AlertDescription>
        </div>
      </div>
    </Alert>
  );
};

export default PlayerHealthAlert;
