import { PlayerWithVitals, VitalsHistory, generateRandomVitals, determinePlayerStatus } from "../types/index";
import { updatePlayersWithVitals } from "../utils/dataUtils";

// Mock players data
const MOCK_PLAYERS: PlayerWithVitals[] = [
  {
    id: 1,
    name: "John Smith",
    number: 10,
    position: "Forward",
    imageUrl: "https://randomuser.me/api/portraits/men/32.jpg",
    status: "normal",
    vitals: {
      temperature: 37.0,
      heartRate: 72,
      bloodOxygen: 98,
      hydration: 75,
      respiration: 16,
      fatigue: 25,
      timestamp: Date.now()
    }
  },
  {
    id: 2,
    name: "Carlos Rodriguez",
    number: 7,
    position: "Midfielder",
    imageUrl: "https://randomuser.me/api/portraits/men/67.jpg",
    status: "normal",
    vitals: {
      temperature: 36.8,
      heartRate: 68,
      bloodOxygen: 99,
      hydration: 82,
      respiration: 14,
      fatigue: 20,
      timestamp: Date.now()
    }
  },
  {
    id: 3,
    name: "Michael Johnson",
    number: 4,
    position: "Defender",
    imageUrl: "https://randomuser.me/api/portraits/men/41.jpg",
    status: "normal",
    vitals: {
      temperature: 36.9,
      heartRate: 65,
      bloodOxygen: 97,
      hydration: 78,
      respiration: 15,
      fatigue: 30,
      timestamp: Date.now()
    }
  },
  {
    id: 4,
    name: "Marcus Williams",
    number: 23,
    position: "Forward",
    imageUrl: "https://randomuser.me/api/portraits/men/11.jpg",
    status: "normal",
    vitals: {
      temperature: 37.1,
      heartRate: 75,
      bloodOxygen: 98,
      hydration: 70,
      respiration: 17,
      fatigue: 35,
      timestamp: Date.now()
    }
  },
  {
    id: 5,
    name: "David Chen",
    number: 19,
    position: "Midfielder",
    imageUrl: "https://randomuser.me/api/portraits/men/28.jpg",
    status: "normal",
    vitals: {
      temperature: 36.7,
      heartRate: 62,
      bloodOxygen: 99,
      hydration: 85,
      respiration: 13,
      fatigue: 15,
      timestamp: Date.now()
    }
  },
  {
    id: 6,
    name: "Thomas Müller",
    number: 13,
    position: "Defender",
    imageUrl: "https://randomuser.me/api/portraits/men/52.jpg",
    status: "normal",
    vitals: {
      temperature: 37.0,
      heartRate: 70,
      bloodOxygen: 97,
      hydration: 80,
      respiration: 16,
      fatigue: 22,
      timestamp: Date.now()
    }
  },
  {
    id: 7,
    name: "James Wilson",
    number: 1,
    position: "Goalkeeper",
    imageUrl: "https://randomuser.me/api/portraits/men/59.jpg",
    status: "normal",
    vitals: {
      temperature: 36.8,
      heartRate: 58,
      bloodOxygen: 98,
      hydration: 88,
      respiration: 12,
      fatigue: 18,
      timestamp: Date.now()
    }
  },
  {
    id: 8,
    name: "Lucas Silva",
    number: 21,
    position: "Midfielder",
    imageUrl: "https://randomuser.me/api/portraits/men/32.jpg",
    status: "normal",
    vitals: {
      temperature: 37.2,
      heartRate: 72,
      bloodOxygen: 96,
      hydration: 75,
      respiration: 16,
      fatigue: 28,
      timestamp: Date.now()
    }
  }
];

// Historical data storage (in-memory for this example)
const playerHistoricalData: Map<number, VitalsHistory> = new Map();

// Initialize historical data for each player
MOCK_PLAYERS.forEach(player => {
  const history: VitalsHistory = {
    player_id: player.id,
    data: [player.vitals] // Start with current vitals
  };
  playerHistoricalData.set(player.id, history);
});

// Maximum number of historical data points to store per player
const MAX_HISTORY_POINTS = 60; // 1 minute of data at 1 reading per second

// API functions that simulate real API calls
export const fetchAllPlayers = async (): Promise<PlayerWithVitals[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));
  
  // Update player data with fresh vitals
  const updatedPlayers = updatePlayersWithVitals([...MOCK_PLAYERS]);
  
  // Update historical data
  updatedPlayers.forEach(player => {
    const history = playerHistoricalData.get(player.id);
    if (history) {
      history.data.push(player.vitals);
      
      // Keep only the latest MAX_HISTORY_POINTS readings
      if (history.data.length > MAX_HISTORY_POINTS) {
        history.data = history.data.slice(history.data.length - MAX_HISTORY_POINTS);
      }
    }
  });
  
  return updatedPlayers;
};

export const fetchPlayerById = async (id: number): Promise<PlayerWithVitals | undefined> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));
  
  const player = MOCK_PLAYERS.find(p => p.id === id);
  if (!player) return undefined;
  
  // Generate fresh vitals for this player
  const newVitals = generateRandomVitals(id);
  const newStatus = determinePlayerStatus(newVitals);
  
  // Update historical data
  const history = playerHistoricalData.get(id);
  if (history) {
    history.data.push(newVitals);
    
    // Keep only the latest MAX_HISTORY_POINTS readings
    if (history.data.length > MAX_HISTORY_POINTS) {
      history.data = history.data.slice(history.data.length - MAX_HISTORY_POINTS);
    }
  }
  
  return {
    ...player,
    vitals: newVitals,
    status: newStatus
  };
};

export const fetchPlayerHistory = async (id: number): Promise<VitalsHistory | undefined> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 150));
  
  return playerHistoricalData.get(id);
};
