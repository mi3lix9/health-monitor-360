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
  alert?: {
    min: number;
    max: number;
  };
  warning?: {
    min: number;
    max: number;
  };
}

export const VITAL_RANGES = {
  temperature: { 
    min: 36.5, 
    max: 37.5,
    alert: { min: 38.5, max: 40.0 } 
  },
  heartRate: { 
    min: 60, 
    max: 100,
    warning: { min: 100, max: 130 },
    alert: { min: 130, max: 180 } 
  },
  bloodOxygen: { 
    min: 95, 
    max: 100,
    warning: { min: 92, max: 95 },
    alert: { min: 0, max: 92 } 
  },
  hydration: { 
    min: 85, 
    max: 100,
    warning: { min: 70, max: 85 },
    alert: { min: 0, max: 70 } 
  },
  respiration: { 
    min: 12, 
    max: 20,
    warning: { min: 20, max: 25 },
    alert: { min: 25, max: 40 } 
  },
  fatigue: { 
    min: 0, 
    max: 40,
    warning: { min: 40, max: 70 },
    alert: { min: 70, max: 100 } 
  }
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
  if (ranges.alert) {
    if (value <= ranges.alert.min || value >= ranges.alert.max) {
      return 'alert';
    }
  } else {
    const lowerThreshold = ranges.min - (ranges.max - ranges.min) * 0.1;
    const upperThreshold = ranges.max + (ranges.max - ranges.min) * 0.1;
    if (value < lowerThreshold || value > upperThreshold) {
      return 'alert';
    }
  }
  
  if (ranges.warning) {
    if (value <= ranges.warning.min || value >= ranges.warning.max) {
      return 'warning';
    }
  }
  
  if (value >= ranges.min && value <= ranges.max) {
    return 'normal';
  }
  
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
const activityPhases: Record<number, { 
  phase: 'rest' | 'light_activity' | 'intense_activity' | 'recovery',
  duration: number,
  elapsed: number 
}> = {};

export const generateRandomVitals = (playerId: number): VitalSigns => {
  const now = Date.now();
  const prevVitals = previousVitals[playerId];
  
  if (!activityPhases[playerId]) {
    activityPhases[playerId] = {
      phase: 'light_activity',
      duration: 60 + Math.floor(Math.random() * 120),
      elapsed: 0
    };
  }
  
  let playerPhase = activityPhases[playerId];
  playerPhase.elapsed += prevVitals ? (now - prevVitals.timestamp) / 1000 : 0;
  
  if (playerPhase.elapsed >= playerPhase.duration) {
    let nextPhase: 'rest' | 'light_activity' | 'intense_activity' | 'recovery';
    
    switch (playerPhase.phase) {
      case 'rest':
        nextPhase = Math.random() < 0.7 ? 'light_activity' : 'intense_activity';
        break;
      case 'light_activity':
        nextPhase = Math.random() < 0.6 ? 'intense_activity' : 'rest';
        break;
      case 'intense_activity':
        nextPhase = Math.random() < 0.8 ? 'recovery' : 'light_activity';
        break;
      case 'recovery':
        nextPhase = Math.random() < 0.7 ? 'light_activity' : 'rest';
        break;
    }
    
    activityPhases[playerId] = {
      phase: nextPhase,
      duration: 30 + Math.floor(Math.random() * (nextPhase === 'intense_activity' ? 60 : 180)),
      elapsed: 0
    };
    playerPhase = activityPhases[playerId];
  }
  
  if (!prevVitals) {
    const initialVitals = {
      temperature: 36.8 + (Math.random() * 0.4 - 0.2),
      heartRate: 70 + Math.floor(Math.random() * 15),
      bloodOxygen: 97 + (Math.random() * 2),
      hydration: 90 + Math.random() * 10,
      respiration: 14 + Math.random() * 3,
      fatigue: 10 + Math.random() * 15,
      timestamp: now
    };
    
    previousVitals[playerId] = initialVitals;
    return initialVitals;
  }
  
  let tempChange = 0;
  let hrChange = 0;
  let oxygenChange = 0;
  let hydrationChange = 0;
  let respirationChange = 0;
  let fatigueChange = 0;
  
  const smallRandomChange = () => (Math.random() * 0.2) - 0.1;
  
  switch(playerPhase.phase) {
    case 'rest':
      tempChange = prevVitals.temperature > 37.0 ? -0.05 - (Math.random() * 0.1) : smallRandomChange() * 0.5;
      hrChange = prevVitals.heartRate > 70 ? -1 - Math.floor(Math.random() * 3) : smallRandomChange();
      oxygenChange = prevVitals.bloodOxygen < 98 ? 0.1 + (Math.random() * 0.2) : smallRandomChange() * 0.2;
      hydrationChange = prevVitals.hydration < 95 ? 0.2 + (Math.random() * 0.3) : 0;
      respirationChange = prevVitals.respiration > 14 ? -0.2 - (Math.random() * 0.3) : smallRandomChange() * 0.2;
      fatigueChange = prevVitals.fatigue > 10 ? -0.3 - (Math.random() * 0.5) : 0;
      break;
      
    case 'light_activity':
      tempChange = 0.02 + (Math.random() * 0.05);
      hrChange = 0.5 + Math.floor(Math.random() * 2);
      oxygenChange = smallRandomChange() * 0.3;
      hydrationChange = -0.1 - (Math.random() * 0.2);
      respirationChange = 0.1 + (Math.random() * 0.2);
      fatigueChange = 0.2 + (Math.random() * 0.4);
      break;
      
    case 'intense_activity':
      tempChange = 0.05 + (Math.random() * 0.15);
      hrChange = 2 + Math.floor(Math.random() * 5);
      oxygenChange = -0.1 - (Math.random() * 0.3);
      hydrationChange = -0.3 - (Math.random() * 0.5);
      respirationChange = 0.3 + (Math.random() * 0.5);
      fatigueChange = 0.5 + (Math.random() * 1.0);
      break;
      
    case 'recovery':
      tempChange = prevVitals.temperature > 37.2 ? -0.03 - (Math.random() * 0.07) : smallRandomChange() * 0.5;
      hrChange = prevVitals.heartRate > 90 ? -0.5 - Math.floor(Math.random() * 2) : smallRandomChange();
      oxygenChange = prevVitals.bloodOxygen < 97 ? 0.05 + (Math.random() * 0.15) : smallRandomChange() * 0.2;
      hydrationChange = -0.05 - (Math.random() * 0.1);
      respirationChange = prevVitals.respiration > 16 ? -0.1 - (Math.random() * 0.2) : smallRandomChange() * 0.2;
      fatigueChange = 0.1 + (Math.random() * 0.2);
      break;
  }
  
  const shouldStartIncident = Math.random() < 0.002;
  const isInIncident = prevVitals.temperature > 38.0 || 
                        prevVitals.heartRate > 130 || 
                        prevVitals.bloodOxygen < 92 ||
                        prevVitals.hydration < 70;
  
  const shouldStartRecovery = isInIncident && Math.random() < 0.05;
  
  if (shouldStartIncident && !isInIncident) {
    console.log(`Health incident starting for player ${playerId}`);
    const incidentType = Math.floor(Math.random() * 5);
    
    switch (incidentType) {
      case 0:
        tempChange = 0.3 + (Math.random() * 0.5);
        hrChange = 3 + Math.floor(Math.random() * 5);
        break;
      case 1:
        hrChange = 5 + Math.floor(Math.random() * 15);
        respirationChange = 0.5 + (Math.random() * 1.5);
        break;
      case 2:
        oxygenChange = -0.5 - (Math.random() * 2.0);
        respirationChange = 0.8 + (Math.random() * 1.5);
        break;
      case 3:
        hydrationChange = -1.0 - (Math.random() * 3.0);
        tempChange = 0.2 + (Math.random() * 0.3);
        break;
      case 4:
        fatigueChange = 2.0 + (Math.random() * 5.0);
        hrChange = -2 - Math.floor(Math.random() * 4);
        break;
    }
  } else if (shouldStartRecovery) {
    console.log(`Recovery started for player ${playerId}`);
    if (prevVitals.temperature > 38.0) tempChange = -0.2 - (Math.random() * 0.2);
    if (prevVitals.heartRate > 130) hrChange = -3 - Math.floor(Math.random() * 5);
    if (prevVitals.bloodOxygen < 92) oxygenChange = 0.5 + (Math.random() * 0.5);
    if (prevVitals.hydration < 70) hydrationChange = 0.5 + (Math.random() * 1.0);
  } else if (isInIncident) {
    if (prevVitals.temperature > 38.0) tempChange += 0.05 + (Math.random() * 0.1);
    if (prevVitals.heartRate > 130) hrChange += 0.5 + Math.floor(Math.random() * 2);
    if (prevVitals.bloodOxygen < 92) oxygenChange -= 0.1 + (Math.random() * 0.2);
    if (prevVitals.hydration < 70) hydrationChange -= 0.2 + (Math.random() * 0.3);
  }
  
  let newTemp = Math.max(35.5, Math.min(40.0, prevVitals.temperature + tempChange));
  let newHR = Math.max(40, Math.min(180, prevVitals.heartRate + hrChange));
  let newOxygen = Math.max(85, Math.min(100, prevVitals.bloodOxygen + oxygenChange));
  let newHydration = Math.max(40, Math.min(100, prevVitals.hydration + hydrationChange));
  let newRespiration = Math.max(8, Math.min(35, prevVitals.respiration + respirationChange));
  let newFatigue = Math.max(5, Math.min(95, prevVitals.fatigue + fatigueChange));
  
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
