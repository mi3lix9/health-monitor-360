
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchAllPlayers } from '../services/apiService';
import { PlayerWithVitals, VITAL_RANGES } from '../types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import StatusBadge from '../components/StatusBadge';

const MonitoringPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("all");
  
  // Fetch player data
  const { data: players, isLoading, error } = useQuery({
    queryKey: ['players'],
    queryFn: fetchAllPlayers,
    refetchInterval: 1000, // Update every second
  });
  
  // Filter players based on active tab
  const filteredPlayers = players?.filter(player => {
    if (activeTab === "all") return true;
    return player.status === activeTab;
  });
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="text-lg text-gray-500">Loading monitoring data...</div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="text-lg text-red-500">Error loading data. Please try again.</div>
      </div>
    );
  }
  
  const getStatusCounts = () => {
    if (!players) return { normal: 0, warning: 0, alert: 0 };
    
    return players.reduce(
      (acc, player) => {
        acc[player.status] += 1;
        return acc;
      },
      { normal: 0, warning: 0, alert: 0 }
    );
  };
  
  const statusCounts = getStatusCounts();
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Health Monitoring</h1>
        <p className="text-gray-500">Real-time monitoring of all player vital signs</p>
      </div>
      
      <Tabs defaultValue="all" className="mb-6" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">
            All Players ({players?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="normal">
            Normal ({statusCounts.normal})
          </TabsTrigger>
          <TabsTrigger value="warning">
            Warning ({statusCounts.warning})
          </TabsTrigger>
          <TabsTrigger value="alert">
            Alert ({statusCounts.alert})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Player</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Temperature</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Heart Rate</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Blood Oxygen</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hydration</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Respiration</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fatigue</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPlayers?.map(player => (
                  <tr key={player.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full flex-shrink-0 mr-3">
                          <img src={player.imageUrl} alt={player.name} className="h-full w-full rounded-full object-cover" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{player.name}</div>
                          <div className="text-sm text-gray-500">#{player.number} · {player.position}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={player.status} pulseAnimation={true} />
                    </td>
                    <VitalCell 
                      value={player.vitals.temperature} 
                      unit="°C" 
                      ranges={VITAL_RANGES.temperature} 
                    />
                    <VitalCell 
                      value={player.vitals.heartRate} 
                      unit="BPM" 
                      ranges={VITAL_RANGES.heartRate} 
                    />
                    <VitalCell 
                      value={player.vitals.bloodOxygen} 
                      unit="%" 
                      ranges={VITAL_RANGES.bloodOxygen} 
                    />
                    <VitalCell 
                      value={player.vitals.hydration!} 
                      unit="%" 
                      ranges={VITAL_RANGES.hydration} 
                    />
                    <VitalCell 
                      value={player.vitals.respiration!} 
                      unit="br/min" 
                      ranges={VITAL_RANGES.respiration} 
                    />
                    <VitalCell 
                      value={player.vitals.fatigue!} 
                      unit="%" 
                      ranges={VITAL_RANGES.fatigue} 
                    />
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
        
        <TabsContent value="normal" className="mt-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Player</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Temperature</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Heart Rate</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Blood Oxygen</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hydration</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Respiration</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fatigue</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPlayers?.map(player => (
                  <tr key={player.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full flex-shrink-0 mr-3">
                          <img src={player.imageUrl} alt={player.name} className="h-full w-full rounded-full object-cover" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{player.name}</div>
                          <div className="text-sm text-gray-500">#{player.number} · {player.position}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={player.status} pulseAnimation={true} />
                    </td>
                    <VitalCell 
                      value={player.vitals.temperature} 
                      unit="°C" 
                      ranges={VITAL_RANGES.temperature} 
                    />
                    <VitalCell 
                      value={player.vitals.heartRate} 
                      unit="BPM" 
                      ranges={VITAL_RANGES.heartRate} 
                    />
                    <VitalCell 
                      value={player.vitals.bloodOxygen} 
                      unit="%" 
                      ranges={VITAL_RANGES.bloodOxygen} 
                    />
                    <VitalCell 
                      value={player.vitals.hydration!} 
                      unit="%" 
                      ranges={VITAL_RANGES.hydration} 
                    />
                    <VitalCell 
                      value={player.vitals.respiration!} 
                      unit="br/min" 
                      ranges={VITAL_RANGES.respiration} 
                    />
                    <VitalCell 
                      value={player.vitals.fatigue!} 
                      unit="%" 
                      ranges={VITAL_RANGES.fatigue} 
                    />
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
        
        <TabsContent value="warning" className="mt-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Player</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Temperature</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Heart Rate</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Blood Oxygen</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hydration</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Respiration</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fatigue</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPlayers?.map(player => (
                  <tr key={player.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full flex-shrink-0 mr-3">
                          <img src={player.imageUrl} alt={player.name} className="h-full w-full rounded-full object-cover" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{player.name}</div>
                          <div className="text-sm text-gray-500">#{player.number} · {player.position}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={player.status} pulseAnimation={true} />
                    </td>
                    <VitalCell 
                      value={player.vitals.temperature} 
                      unit="°C" 
                      ranges={VITAL_RANGES.temperature} 
                    />
                    <VitalCell 
                      value={player.vitals.heartRate} 
                      unit="BPM" 
                      ranges={VITAL_RANGES.heartRate} 
                    />
                    <VitalCell 
                      value={player.vitals.bloodOxygen} 
                      unit="%" 
                      ranges={VITAL_RANGES.bloodOxygen} 
                    />
                    <VitalCell 
                      value={player.vitals.hydration!} 
                      unit="%" 
                      ranges={VITAL_RANGES.hydration} 
                    />
                    <VitalCell 
                      value={player.vitals.respiration!} 
                      unit="br/min" 
                      ranges={VITAL_RANGES.respiration} 
                    />
                    <VitalCell 
                      value={player.vitals.fatigue!} 
                      unit="%" 
                      ranges={VITAL_RANGES.fatigue} 
                    />
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
        
        <TabsContent value="alert" className="mt-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Player</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Temperature</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Heart Rate</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Blood Oxygen</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hydration</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Respiration</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fatigue</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPlayers?.map(player => (
                  <tr key={player.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full flex-shrink-0 mr-3">
                          <img src={player.imageUrl} alt={player.name} className="h-full w-full rounded-full object-cover" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{player.name}</div>
                          <div className="text-sm text-gray-500">#{player.number} · {player.position}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={player.status} pulseAnimation={true} />
                    </td>
                    <VitalCell 
                      value={player.vitals.temperature} 
                      unit="°C" 
                      ranges={VITAL_RANGES.temperature} 
                    />
                    <VitalCell 
                      value={player.vitals.heartRate} 
                      unit="BPM" 
                      ranges={VITAL_RANGES.heartRate} 
                    />
                    <VitalCell 
                      value={player.vitals.bloodOxygen} 
                      unit="%" 
                      ranges={VITAL_RANGES.bloodOxygen} 
                    />
                    <VitalCell 
                      value={player.vitals.hydration!} 
                      unit="%" 
                      ranges={VITAL_RANGES.hydration} 
                    />
                    <VitalCell 
                      value={player.vitals.respiration!} 
                      unit="br/min" 
                      ranges={VITAL_RANGES.respiration} 
                    />
                    <VitalCell 
                      value={player.vitals.fatigue!} 
                      unit="%" 
                      ranges={VITAL_RANGES.fatigue} 
                    />
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface VitalCellProps {
  value: number;
  unit: string;
  ranges: { min: number; max: number };
}

const VitalCell: React.FC<VitalCellProps> = ({ value, unit, ranges }) => {
  const status = value >= ranges.min && value <= ranges.max
    ? 'normal'
    : (value < ranges.min * 0.9 || value > ranges.max * 1.1)
      ? 'alert'
      : 'warning';
      
  const statusColors = {
    normal: 'text-success',
    warning: 'text-warning',
    alert: 'text-danger'
  };
  
  return (
    <td className="px-6 py-4 whitespace-nowrap">
      <div className={`font-semibold ${statusColors[status]}`}>
        {value.toFixed(1)} <span className="text-xs text-gray-500">{unit}</span>
      </div>
      <div className="text-xs text-gray-500">
        Range: {ranges.min} - {ranges.max} {unit}
      </div>
    </td>
  );
};

export default MonitoringPage;
