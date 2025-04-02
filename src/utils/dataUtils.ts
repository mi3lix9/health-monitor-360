import { 
  PlayerWithVitals, 
  VitalSigns, 
  VITAL_RANGES, 
  calculateStatus, 
  generateRandomVitals, 
  determinePlayerStatus, 
  detectInfection
} from "../types";
import { enhancedInfectionDetection, initializeModel } from "./aiVitalsDetection";

// Initialize the AI model when the module loads
initializeModel().catch(err => {
  console.error("Failed to initialize AI model:", err);
  console.log("Falling back to rule-based detection only");
});

// Track previous statuses and timestamps for tracking alert durations
const playerStatusHistory: Record<number, {
  status: 'normal' | 'warning' | 'alert' | 'infection', 
  timestamp: number, 
  alertStartTime?: number,
  aiDetectionActive?: boolean
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
      alertStartTime,
      aiDetectionActive: previousState?.aiDetectionActive || false
    };
    
    // Calculate alert duration if relevant
    let vitalWithDuration = {...newVitals};
    if (alertStartTime) {
      vitalWithDuration.alertDuration = (newVitals.timestamp - alertStartTime) / 1000; // in seconds
    }
    
    // If player is in warning or alert state, run AI detection in background
    // to potentially update the status in the next cycle
    if (newStatus === 'warning' || newStatus === 'alert') {
      enhancedInfectionDetection(newVitals).then(result => {
        if (result.isInfection) {
          // Update the status history with AI detection result
          const currentState = playerStatusHistory[player.id];
          if (currentState) {
            playerStatusHistory[player.id] = {
              ...currentState,
              status: 'infection',
              aiDetectionActive: true
            };
            console.log(`AI detected infection for player ${player.id} with ${result.confidence.toFixed(2)} confidence using ${result.method} approach`);
          }
        }
      }).catch(err => {
        console.error(`AI detection error for player ${player.id}:`, err);
      });
    }
    
    const playerWithStatus = {
      ...player,
      vitals: vitalWithDuration,
      status: newStatus
    };
    
    return playerWithStatus;
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
