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
  
  // For temperature, heart rate, and respiration, being slightly outside range is a warning, far outside is alert
  const lowerThreshold = ranges.min - (ranges.max - ranges.min) * 0.1;
  const upperThreshold = ranges.max + (ranges.max - ranges.min) * 0.1;
  
  if (value < lowerThreshold || value > upperThreshold) return 'alert';
  return 'warning';
};

export const detectInfection = (vitals: VitalSigns): boolean => {
  // Infection typically manifests as:
  // 1. Elevated temperature (fever) above 38°C
  // 2. Elevated heart rate 
  // 3. Possibly lowered blood oxygen, though this depends on infection type
  
  const hasFever = vitals.temperature >= 38.0;
  const hasElevatedHeartRate = vitals.heartRate >= 100;
  const hasLowBloodOxygen = vitals.bloodOxygen < 94;
  
  // If temperature is very high (39+) and at least one other vital is abnormal, likely infection
  if (vitals.temperature >= 39.0 && (hasElevatedHeartRate || hasLowBloodOxygen)) {
    return true;
  }
  
  // If all three conditions are present, likely infection
  if (hasFever && hasElevatedHeartRate && hasLowBloodOxygen) {
    return true;
  }
  
  // If fever + either elevated heart rate or low blood oxygen, may be early infection
  if (hasFever && (hasElevatedHeartRate || hasLowBloodOxygen)) {
    return true;
  }
  
  return false;
};

export const generateRandomVitals = (playerId: number): VitalSigns => {
  // Base values - mostly normal with occasional warning/alert
  const randomFactor = Math.random();
  const isNormal = randomFactor > 0.2;
  const isWarning = randomFactor <= 0.2 && randomFactor > 0.05;
  // isAlert = randomFactor <= 0.05
  
  // Temperature: normal range 36.5-37.5°C
  const tempRange = VITAL_RANGES.temperature;
  let temperature: number;
  
  if (isNormal) {
    temperature = tempRange.min + Math.random() * (tempRange.max - tempRange.min);
  } else if (isWarning) {
    // Slightly elevated
    temperature = tempRange.max + Math.random() * 0.5;
  } else {
    // Fever or hypothermia
    temperature = Math.random() < 0.5
      ? tempRange.min - Math.random() * 1
      : tempRange.max + Math.random() * 1;
  }
  
  // Heart rate: normal range 60-100 BPM
  const hrRange = VITAL_RANGES.heartRate;
  let heartRate: number;
  
  if (isNormal) {
    heartRate = hrRange.min + Math.random() * (hrRange.max - hrRange.min);
  } else if (isWarning) {
    // Slightly elevated/low
    heartRate = Math.random() < 0.5
      ? hrRange.min - Math.random() * 10
      : hrRange.max + Math.random() * 20;
  } else {
    // Very high/low
    heartRate = Math.random() < 0.5
      ? hrRange.min - Math.random() * 20
      : hrRange.max + Math.random() * 40;
  }
  
  // Blood oxygen: normal range 95-100%
  const oxRange = VITAL_RANGES.bloodOxygen;
  let bloodOxygen: number;
  
  if (isNormal) {
    bloodOxygen = oxRange.min + Math.random() * (oxRange.max - oxRange.min);
  } else if (isWarning) {
    // Slightly low
    bloodOxygen = oxRange.min - Math.random() * 3;
  } else {
    // Very low
    bloodOxygen = oxRange.min - Math.random() * 10;
  }
  
  // Additional metrics for detailed view
  const hydration = VITAL_RANGES.hydration.min + Math.random() * (VITAL_RANGES.hydration.max - VITAL_RANGES.hydration.min);
  const respiration = VITAL_RANGES.respiration.min + Math.random() * (VITAL_RANGES.respiration.max - VITAL_RANGES.respiration.min);
  const fatigue = VITAL_RANGES.fatigue.min + Math.random() * (VITAL_RANGES.fatigue.max - VITAL_RANGES.fatigue.min);

  return {
    temperature: parseFloat(temperature.toFixed(1)),
    heartRate: Math.round(heartRate),
    bloodOxygen: parseFloat(bloodOxygen.toFixed(1)),
    hydration: parseFloat(hydration.toFixed(1)),
    respiration: parseFloat(respiration.toFixed(1)),
    fatigue: parseFloat(fatigue.toFixed(1)),
    timestamp: Date.now(),
    alertDuration: 0
  };
};

export const determinePlayerStatus = (vitals: VitalSigns, previousStatus?: 'normal' | 'warning' | 'alert' | 'infection', previousTimestamp?: number): 'normal' | 'warning' | 'alert' | 'infection' => {
  // First check if player shows signs of infection
  if (detectInfection(vitals)) {
    return 'infection';
  }
  
  const temperatureStatus = calculateStatus(vitals.temperature, VITAL_RANGES.temperature);
  const heartRateStatus = calculateStatus(vitals.heartRate, VITAL_RANGES.heartRate);
  const bloodOxygenStatus = calculateStatus(vitals.bloodOxygen, VITAL_RANGES.bloodOxygen);
  
  // Determine current status based on vitals
  let currentStatus: 'normal' | 'warning' | 'alert';
  
  if (temperatureStatus === 'alert' || heartRateStatus === 'alert' || bloodOxygenStatus === 'alert') {
    currentStatus = 'alert';
  } else if (temperatureStatus === 'warning' || heartRateStatus === 'warning' || bloodOxygenStatus === 'warning') {
    currentStatus = 'warning';
  } else {
    currentStatus = 'normal';
  }
  
  // If no previous status or not in alert state, just return current status
  if (!previousStatus || currentStatus !== 'alert' || !previousTimestamp) {
    return currentStatus;
  }
  
  // Calculate how long the alert has been active (in seconds)
  const alertDuration = previousStatus === 'alert' ? 
    ((vitals.timestamp - previousTimestamp) / 1000) : 0;
  
  // If alert has been active for more than 30 seconds (persistent danger), upgrade to infection
  if (alertDuration > 30 && previousStatus === 'alert' && currentStatus === 'alert') {
    return 'infection';
  }
  
  return currentStatus;
};
