
export interface Player {
  id: number;
  name: string;
  number: number;
  position: string;
  imageUrl: string;
  status: 'normal' | 'warning' | 'alert';
}

export interface VitalSigns {
  temperature: number;
  heartRate: number;
  bloodOxygen: number;
  hydration?: number;
  respiration?: number;
  fatigue?: number;
  timestamp: number;
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

export const getStatusColor = (status: 'normal' | 'warning' | 'alert') => {
  switch (status) {
    case 'normal':
      return 'bg-success text-white';
    case 'warning':
      return 'bg-warning text-white';
    case 'alert':
      return 'bg-danger text-white';
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

// Added the missing functions by moving them from dataUtils.ts to types/index.ts
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
    timestamp: Date.now()
  };
};

export const determinePlayerStatus = (vitals: VitalSigns): 'normal' | 'warning' | 'alert' => {
  const temperatureStatus = calculateStatus(vitals.temperature, VITAL_RANGES.temperature);
  const heartRateStatus = calculateStatus(vitals.heartRate, VITAL_RANGES.heartRate);
  const bloodOxygenStatus = calculateStatus(vitals.bloodOxygen, VITAL_RANGES.bloodOxygen);
  
  if (temperatureStatus === 'alert' || heartRateStatus === 'alert' || bloodOxygenStatus === 'alert') {
    return 'alert';
  }
  
  if (temperatureStatus === 'warning' || heartRateStatus === 'warning' || bloodOxygenStatus === 'warning') {
    return 'warning';
  }
  
  return 'normal';
};
