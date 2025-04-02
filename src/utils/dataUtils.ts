
import { 
  PlayerWithVitals, 
  VitalSigns, 
  VITAL_RANGES, 
  calculateStatus, 
  generateRandomVitals, 
  determinePlayerStatus 
} from "../types";

// Track previous statuses and timestamps for tracking alert durations
const playerStatusHistory: Record<number, {
  status: 'normal' | 'warning' | 'alert' | 'infection', 
  timestamp: number, 
  alertStartTime?: number
}> = {};

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
    
    // Track how long player has been in alert state
    let alertStartTime = previousState?.alertStartTime;
    if (newStatus === 'alert') {
      if (previousState?.status !== 'alert') {
        // Just entered alert state, record the start time
        alertStartTime = newVitals.timestamp;
      }
    } else {
      // Reset alert timer when not in alert state
      alertStartTime = undefined;
    }
    
    // Update status history
    playerStatusHistory[player.id] = {
      status: newStatus,
      timestamp: newVitals.timestamp,
      alertStartTime
    };
    
    // Calculate alert duration if relevant
    let vitalWithDuration = {...newVitals};
    if (alertStartTime) {
      vitalWithDuration.alertDuration = (newVitals.timestamp - alertStartTime) / 1000; // in seconds
    }
    
    return {
      ...player,
      vitals: vitalWithDuration,
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
