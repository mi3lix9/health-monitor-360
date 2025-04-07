
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
      normal: `${VITAL_RANGES.temperature.min}-${VITAL_RANGES.temperature.max}°C`,
      note: player.vitals.temperature >= 38.5 ? 
        'Elevated body temperature indicates potential overheating. Medical evaluation recommended.' : 
        'Temperature outside normal range. Continue monitoring.'
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
      normal: `${VITAL_RANGES.heartRate.min}-${VITAL_RANGES.heartRate.max} BPM`,
      note: player.vitals.heartRate >= 130 ? 
        'Sustained elevated heart rate requires immediate attention.' : 
        'Heart rate outside normal resting range.'
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
      normal: `${VITAL_RANGES.bloodOxygen.min}-${VITAL_RANGES.bloodOxygen.max}%`,
      note: player.vitals.bloodOxygen < 92 ? 
        'Low oxygen saturation is concerning. Medical attention needed.' : 
        'Blood oxygen levels below optimal range.'
    });
  }
  
  // Add hydration if it's in an alert state
  if (player.vitals.hydration !== undefined &&
      (player.vitals.hydration < VITAL_RANGES.hydration.min || 
       player.vitals.hydration > VITAL_RANGES.hydration.max)) {
    abnormalVitals.push({
      name: 'Hydration',
      value: formatVitalValue(player.vitals.hydration, 'hydration'),
      unit: '%',
      isHigh: player.vitals.hydration > VITAL_RANGES.hydration.max,
      isLow: player.vitals.hydration < VITAL_RANGES.hydration.min,
      normal: `${VITAL_RANGES.hydration.min}-${VITAL_RANGES.hydration.max}%`,
      note: player.vitals.hydration < 70 ? 
        'Significant dehydration detected. Immediate rehydration required.' : 
        'Hydration below optimal levels. Fluid intake recommended.'
    });
  }
  
  // Add respiration if it's in an alert state
  if (player.vitals.respiration !== undefined &&
      (player.vitals.respiration < VITAL_RANGES.respiration.min || 
       player.vitals.respiration > VITAL_RANGES.respiration.max)) {
    abnormalVitals.push({
      name: 'Respiration',
      value: formatVitalValue(player.vitals.respiration, 'respiration'),
      unit: 'breaths/min',
      isHigh: player.vitals.respiration > VITAL_RANGES.respiration.max,
      isLow: player.vitals.respiration < VITAL_RANGES.respiration.min,
      normal: `${VITAL_RANGES.respiration.min}-${VITAL_RANGES.respiration.max} breaths/min`,
      note: player.vitals.respiration > 25 ? 
        'Elevated respiratory rate may indicate respiratory distress.' : 
        'Respiration rate outside normal range.'
    });
  }
  
  // Add fatigue if it's in an alert state
  if (player.vitals.fatigue !== undefined &&
      (player.vitals.fatigue < VITAL_RANGES.fatigue.min || 
       player.vitals.fatigue > VITAL_RANGES.fatigue.max)) {
    abnormalVitals.push({
      name: 'Fatigue',
      value: formatVitalValue(player.vitals.fatigue, 'fatigue'),
      unit: '%',
      isHigh: player.vitals.fatigue > VITAL_RANGES.fatigue.max,
      isLow: player.vitals.fatigue < VITAL_RANGES.fatigue.min,
      normal: `${VITAL_RANGES.fatigue.min}-${VITAL_RANGES.fatigue.max}%`,
      note: player.vitals.fatigue > 70 ? 
        'High fatigue level detected. Consider player rotation or rest.' : 
        'Fatigue level outside normal range.'
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
                  <li key={index} className="text-sm">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{vital.name}:</span>
                      <span className={vital.isHigh ? 'text-red-600 font-semibold' : vital.isLow ? 'text-blue-600 font-semibold' : ''}>
                        {vital.value}{vital.unit} 
                        <span className="text-gray-500 ml-2">
                          (Normal: {vital.normal})
                        </span>
                      </span>
                    </div>
                    <p className="text-gray-600 text-xs mt-1">{vital.note}</p>
                  </li>
                ))}
              </ul>
              
              {player.vitals.alertDuration && (
                <p className="mt-2 text-sm text-gray-600">
                  Alert duration: {Math.floor(player.vitals.alertDuration)} seconds
                  {player.vitals.alertDuration > 20 && (
                    <span className="block text-red-600 text-xs mt-1">
                      Warning: Sustained alert for {Math.floor(player.vitals.alertDuration)} seconds. 
                      Immediate attention required.
                    </span>
                  )}
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
