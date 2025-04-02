
import { 
  PlayerWithVitals, 
  VitalSigns, 
  VITAL_RANGES, 
  calculateStatus, 
  generateRandomVitals, 
  determinePlayerStatus 
} from "../types";

// Track previous statuses and timestamps for tracking alert durations
const playerStatusHistory: Record<number, {status: 'normal' | 'warning' | 'alert' | 'infection', timestamp: number}> = {};

// Update players with new vitals
export const updatePlayersWithVitals = (players: PlayerWithVitals[]): PlayerWithVitals[] => {
  return players.map(player => {
    const newVitals = generateRandomVitals(player.id);
    
    // Get previous status and timestamp if available
    const previousState = playerStatusHistory[player.id];
    
    // Determine new status, considering infection detection and alert duration
    const newStatus = determinePlayerStatus(
      newVitals, 
      previousState?.status, 
      previousState?.timestamp
    );
    
    // Update status history
    playerStatusHistory[player.id] = {
      status: newStatus,
      timestamp: newVitals.timestamp
    };
    
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
