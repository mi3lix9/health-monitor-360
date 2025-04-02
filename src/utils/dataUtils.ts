
import { PlayerWithVitals, VitalSigns, VITAL_RANGES, calculateStatus } from "../types";

// Function to generate random vitals data within realistic ranges
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

// Function to determine overall player status based on vital readings
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

// Function to update player data with new vitals
export const updatePlayersWithVitals = (players: PlayerWithVitals[]): PlayerWithVitals[] => {
  return players.map(player => {
    const newVitals = generateRandomVitals(player.id);
    const newStatus = determinePlayerStatus(newVitals);
    
    return {
      ...player,
      vitals: newVitals,
      status: newStatus
    };
  });
};

// Format numbers with appropriate precision
export const formatVitalValue = (value: number, vitalType: string): string => {
  switch (vitalType) {
    case 'temperature':
      return value.toFixed(1);
    case 'bloodOxygen':
    case 'hydration':
      return value.toFixed(1);
    default:
      return Math.round(value).toString();
  }
};
