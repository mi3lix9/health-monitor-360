
import React from 'react';
import { AlertTriangle, Heart } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
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
        'Temperature outside normal range. Continue monitoring.',
      severity: player.vitals.temperature >= 38.5 ? 'high' : 'medium'
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
        'Heart rate outside normal resting range.',
      severity: player.vitals.heartRate >= 130 ? 'high' : 'medium'
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
        'Blood oxygen levels below optimal range.',
      severity: player.vitals.bloodOxygen < 92 ? 'high' : 'medium'
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
        'Hydration below optimal levels. Fluid intake recommended.',
      severity: player.vitals.hydration < 70 ? 'high' : 'medium'
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
        'Respiration rate outside normal range.',
      severity: player.vitals.respiration > 25 ? 'high' : 'medium'
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
        'Fatigue level outside normal range.',
      severity: player.vitals.fatigue > 70 ? 'high' : 'medium'
    });
  }

  const alertTitle = player.status === 'infection' 
    ? `Potential Infection Detected for ${player.name}` 
    : `Health Alert for ${player.name}`;

  const alertIcon = player.status === 'infection' 
    ? <Heart className="h-5 w-5 text-purple-600" />
    : <AlertTriangle className="h-5 w-5 text-red-500" />;
  
  const alertVariant = player.status === 'infection' ? 'default' : 'destructive';
  const cardBorderColor = player.status === 'infection' ? 'border-purple-300' : 'border-red-300';
  const cardBgColor = player.status === 'infection' ? 'bg-purple-50' : 'bg-red-50';
  const titleColor = player.status === 'infection' ? 'text-purple-700' : 'text-red-700';

  const getSeverityColor = (severity: string, isHigh: boolean, isLow: boolean) => {
    if (severity === 'high') {
      return 'bg-red-500';
    } else if (isHigh) {
      return 'bg-orange-500';
    } else if (isLow) {
      return 'bg-blue-500';
    } 
    return 'bg-yellow-500';
  };

  const getProgressValue = (value: number, min: number, max: number) => {
    // Calculate percentage within the range
    return Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));
  };

  return (
    <Card className={`mb-6 ${cardBorderColor} ${cardBgColor} shadow-md`}>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          {alertIcon}
          <CardTitle className={titleColor}>
            {alertTitle}
          </CardTitle>
        </div>
        {player.status === 'infection' && (
          <p className="text-purple-700 text-sm">
            AI-assisted analysis indicates a potential infection. Medical evaluation recommended.
          </p>
        )}
      </CardHeader>
      <CardContent>
        <Separator className={player.status === 'infection' ? 'bg-purple-200' : 'bg-red-200'} />
        
        <div className="mt-3">
          <h4 className={`font-medium mb-2 ${titleColor}`}>
            Abnormal vital signs detected:
          </h4>
          
          <div className="space-y-4">
            {abnormalVitals.map((vital, index) => (
              <div key={index} className="bg-white bg-opacity-60 rounded-md p-3 shadow-sm">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant="outline" 
                      className={`font-semibold ${vital.isHigh ? 'text-red-600 border-red-300' : vital.isLow ? 'text-blue-600 border-blue-300' : ''}`}
                    >
                      {vital.name}
                    </Badge>
                  </div>
                  <span className={`font-semibold ${vital.isHigh ? 'text-red-600' : vital.isLow ? 'text-blue-600' : ''}`}>
                    {vital.value}{vital.unit}
                  </span>
                </div>
                
                <div className="relative h-2 mb-2">
                  <Progress 
                    value={getProgressValue(
                      parseFloat(vital.value), 
                      parseFloat(vital.normal.split('-')[0]), 
                      parseFloat(vital.normal.split('-')[1].split(' ')[0])
                    )} 
                    className="h-2"
                  />
                  <div 
                    className={`absolute top-0 h-full w-1.5 ${getSeverityColor(vital.severity, vital.isHigh, vital.isLow)}`}
                    style={{ 
                      left: `${getProgressValue(
                        parseFloat(vital.value), 
                        parseFloat(vital.normal.split('-')[0]), 
                        parseFloat(vital.normal.split('-')[1].split(' ')[0])
                      )}%`,
                      transform: 'translateX(-50%)'
                    }}
                  />
                </div>
                
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Normal: {vital.normal}</span>
                  <Badge variant="outline" className={`${vital.severity === 'high' ? 'text-red-600 border-red-300' : 'text-yellow-600 border-yellow-300'}`}>
                    {vital.severity === 'high' ? 'High Risk' : 'Caution'}
                  </Badge>
                </div>
                
                <p className="text-gray-600 text-sm mt-2">{vital.note}</p>
              </div>
            ))}
          </div>
          
          {player.vitals.alertDuration && (
            <Alert variant="outline" className="mt-4 border-amber-300 bg-amber-50">
              <AlertTitle className="text-amber-700 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Alert Duration: {Math.floor(player.vitals.alertDuration)} seconds
              </AlertTitle>
              {player.vitals.alertDuration > 20 && (
                <AlertDescription className="text-red-600">
                  Warning: Sustained alert for {Math.floor(player.vitals.alertDuration)} seconds. 
                  Immediate attention required.
                </AlertDescription>
              )}
            </Alert>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PlayerHealthAlert;
