
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
