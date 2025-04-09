export interface Player {
  id: number;
  name: string;
  number: number;
  position: string;
  imageUrl: string;
  status: 'normal' | 'warning' | 'alert' | 'infection';
}

export interface VitalSigns {
  temperature: number;
  heartRate: number;
  bloodOxygen: number;
  hydration?: number;
  respiration?: number;
  fatigue?: number;
  timestamp: number;
  alertDuration?: number;
}

export interface PlayerWithVitals extends Player {
  vitals: VitalSigns;
}

export interface VitalsHistory {
  player_id: number;
  data: VitalSigns[];
}

export interface VitalStatus {
  value: number;
  status: 'normal' | 'warning' | 'alert';
  label: string;
  unit: string;
}

export interface VitalRanges {
  min: number;
  max: number;
}

export const VITAL_RANGES = {
  temperature: { min: 36.5, max: 37.5 },
  heartRate: { min: 60, max: 100 },
  bloodOxygen: { min: 95, max: 100 },
  hydration: { min: 50, max: 100 },
  respiration: { min: 12, max: 20 },
  fatigue: { min: 0, max: 50 }
};

export const CHART_COLORS = {
  temperature: '#EF4444', // red
  heartRate: '#0EA5E9', // blue
  bloodOxygen: '#10B981', // green
  hydration: '#8B5CF6', // purple
  respiration: '#F59E0B', // amber
  fatigue: '#6B7280' // gray
};

export const getStatusColor = (status: 'normal' | 'warning' | 'alert' | 'infection') => {
  switch (status) {
    case 'normal':
      return 'bg-success text-white';
    case 'warning':
      return 'bg-warning text-white';
    case 'alert':
      return 'bg-danger text-white';
    case 'infection':
      return 'bg-purple-600 text-white';
    default:
      return 'bg-gray-200 text-gray-800';
  }
};

export const calculateStatus = (value: number, ranges: VitalRanges): 'normal' | 'warning' | 'alert' => {
  if (value >= ranges.min && value <= ranges.max) return 'normal';
  
  const lowerThreshold = ranges.min - (ranges.max - ranges.min) * 0.1;
  const upperThreshold = ranges.max + (ranges.max - ranges.min) * 0.1;
  
  if (value < lowerThreshold || value > upperThreshold) return 'alert';
  return 'warning';
};

export const detectInfection = (vitals: VitalSigns): boolean => {
  const hasFever = vitals.temperature >= 38.0;
  const hasElevatedHeartRate = vitals.heartRate >= 100;
  const hasLowBloodOxygen = vitals.bloodOxygen < 94;
  
  if (vitals.temperature >= 39.0 && (hasElevatedHeartRate || hasLowBloodOxygen)) {
    return true;
  }
  
  if (hasFever && hasElevatedHeartRate && hasLowBloodOxygen) {
    return true;
  }
  
  if (hasFever && (hasElevatedHeartRate || hasLowBloodOxygen)) {
    return true;
  }
  
  return false;
};

const previousVitals: Record<number, VitalSigns> = {};

export const generateRandomVitals = (playerId: number): VitalSigns => {
  const now = Date.now();
  const prevVitals = previousVitals[playerId];
  
  if (!prevVitals) {
    const initialVitals = {
      temperature: 36.8 + (Math.random() * 0.6 - 0.3),
      heartRate: 70 + Math.floor(Math.random() * 20 - 10),
      bloodOxygen: 97 + (Math.random() * 2),
      hydration: 70 + Math.random() * 20,
      respiration: 14 + Math.random() * 4,
      fatigue: 20 + Math.random() * 20,
      timestamp: now
    };
    
    previousVitals[playerId] = initialVitals;
    return initialVitals;
  }
  
  const shouldStartIncident = Math.random() < 0.005;
  const isInIncident = prevVitals.temperature > 37.7 || 
                        prevVitals.temperature < 36.3 || 
                        prevVitals.heartRate > 110 || 
                        prevVitals.heartRate < 50 || 
                        prevVitals.bloodOxygen < 93;
  
  const shouldStartRecovery = isInIncident && Math.random() < 0.02;
  
  let tempChange = 0;
  let hrChange = 0;
  let oxygenChange = 0;
  
  const smallRandomChange = () => (Math.random() * 0.2) - 0.1;
  
  if (shouldStartIncident) {
    const incidentType = Math.floor(Math.random() * 4);
    
    switch (incidentType) {
      case 0:
        tempChange = 0.2;
        hrChange = 2;
        break;
      case 1:
        tempChange = -0.2;
        break;
      case 2:
        hrChange = 5;
        tempChange = 0.1;
        break;
      case 3:
        oxygenChange = -0.5;
        hrChange = 2;
        break;
    }
  } else if (shouldStartRecovery) {
    if (prevVitals.temperature > 37.5) tempChange = -0.2;
    if (prevVitals.temperature < 36.5) tempChange = 0.2;
    if (prevVitals.heartRate > 100) hrChange = -3;
    if (prevVitals.heartRate < 60) hrChange = 3;
    if (prevVitals.bloodOxygen < 95) oxygenChange = 0.5;
  } else {
    tempChange = smallRandomChange();
    hrChange = smallRandomChange() * 3;
    oxygenChange = smallRandomChange() * 0.5;
    
    if (isInIncident) {
      if (prevVitals.temperature > 38.0) tempChange = 0.1;
      if (prevVitals.heartRate > 120) hrChange = 2;
      if (prevVitals.bloodOxygen < 92) oxygenChange = -0.3;
    }
  }
  
  let newTemp = Math.max(35.5, Math.min(40.0, prevVitals.temperature + tempChange));
  let newHR = Math.max(40, Math.min(180, prevVitals.heartRate + hrChange));
  let newOxygen = Math.max(85, Math.min(100, prevVitals.bloodOxygen + oxygenChange));
  
  let newHydration = prevVitals.hydration;
  let newRespiration = prevVitals.respiration;
  let newFatigue = prevVitals.fatigue;
  
  if (newHR > 100) {
    newRespiration += 0.3;
    newHydration -= 0.2;
    newFatigue += 0.3;
  } else {
    newRespiration += smallRandomChange();
    newHydration += smallRandomChange() * 0.5;
    newFatigue += smallRandomChange() * 0.5;
  }
  
  newHydration = Math.max(40, Math.min(100, newHydration));
  newRespiration = Math.max(8, Math.min(30, newRespiration));
  newFatigue = Math.max(5, Math.min(95, newFatigue));
  
  const newVitals = {
    temperature: parseFloat(newTemp.toFixed(1)),
    heartRate: Math.round(newHR),
    bloodOxygen: parseFloat(newOxygen.toFixed(1)),
    hydration: parseFloat(newHydration.toFixed(1)),
    respiration: parseFloat(newRespiration.toFixed(1)),
    fatigue: parseFloat(newFatigue.toFixed(1)),
    timestamp: now
  };
  
  previousVitals[playerId] = newVitals;
  
  return newVitals;
};

export const determinePlayerStatus = (vitals: VitalSigns, previousStatus?: 'normal' | 'warning' | 'alert' | 'infection', previousTimestamp?: number): 'normal' | 'warning' | 'alert' | 'infection' => {
  const temperatureStatus = calculateStatus(vitals.temperature, VITAL_RANGES.temperature);
  const heartRateStatus = calculateStatus(vitals.heartRate, VITAL_RANGES.heartRate);
  const bloodOxygenStatus = calculateStatus(vitals.bloodOxygen, VITAL_RANGES.bloodOxygen);
  
  let currentStatus: 'normal' | 'warning' | 'alert';
  
  if (temperatureStatus === 'alert' || heartRateStatus === 'alert' || bloodOxygenStatus === 'alert') {
    currentStatus = 'alert';
  } else if (temperatureStatus === 'warning' || heartRateStatus === 'warning' || bloodOxygenStatus === 'warning') {
    currentStatus = 'warning';
  } else {
    currentStatus = 'normal';
  }
  
  if (!previousStatus || currentStatus !== 'alert' || !previousTimestamp) {
    return currentStatus;
  }
  
  const alertDuration = previousStatus === 'alert' ? 
    ((vitals.timestamp - previousTimestamp) / 1000) : 0;
  
  if (alertDuration > 30 && previousStatus === 'alert' && currentStatus === 'alert') {
    return 'infection';
  }
  
  return currentStatus;
};
