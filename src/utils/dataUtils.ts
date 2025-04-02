
import { 
  PlayerWithVitals, 
  VitalSigns, 
  VITAL_RANGES, 
  calculateStatus, 
  generateRandomVitals, 
  determinePlayerStatus 
} from "../types";

// Update players with new vitals
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
