
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { VITAL_RANGES } from '../types';

const SettingsPage: React.FC = () => {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
        <p className="text-gray-500">Configure monitoring parameters and app settings</p>
      </div>
      
      <Tabs defaultValue="thresholds" className="mb-6">
        <TabsList>
          <TabsTrigger value="thresholds">Health Thresholds</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
        </TabsList>
        
        <TabsContent value="thresholds" className="mt-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold mb-4">Vital Sign Thresholds</h2>
            <p className="text-gray-500 mb-6">
              These thresholds determine when a player's vital signs will trigger warnings or alerts.
              Values are currently read-only in this demo version.
            </p>
            
            <div className="space-y-6">
              <ThresholdSetting 
                title="Body Temperature" 
                description="Core body temperature measurement" 
                unit="°C"
                min={VITAL_RANGES.temperature.min}
                max={VITAL_RANGES.temperature.max}
              />
              
              <ThresholdSetting 
                title="Heart Rate" 
                description="Beats per minute" 
                unit="BPM"
                min={VITAL_RANGES.heartRate.min}
                max={VITAL_RANGES.heartRate.max}
              />
              
              <ThresholdSetting 
                title="Blood Oxygen Saturation" 
                description="Oxygen level in blood" 
                unit="%"
                min={VITAL_RANGES.bloodOxygen.min}
                max={VITAL_RANGES.bloodOxygen.max}
              />
              
              <ThresholdSetting 
                title="Hydration Level" 
                description="Body fluid levels" 
                unit="%"
                min={VITAL_RANGES.hydration.min}
                max={VITAL_RANGES.hydration.max}
              />
              
              <ThresholdSetting 
                title="Respiration Rate" 
                description="Breaths per minute" 
                unit="breaths/min"
                min={VITAL_RANGES.respiration.min}
                max={VITAL_RANGES.respiration.max}
              />
              
              <ThresholdSetting 
                title="Fatigue Level" 
                description="Estimated player fatigue" 
                unit="%"
                min={VITAL_RANGES.fatigue.min}
                max={VITAL_RANGES.fatigue.max}
              />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="notifications" className="mt-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold mb-4">Notification Settings</h2>
            <p className="text-gray-500 mb-6">
              Configure how and when you receive alerts about player health status.
              These settings are read-only in this demo version.
            </p>
            
            <div className="space-y-4">
              <NotificationSetting 
                title="Warning Alerts" 
                description="Receive notifications when a player enters warning state"
                enabled={true}
              />
              
              <NotificationSetting 
                title="Critical Alerts" 
                description="Receive urgent notifications for critical health readings"
                enabled={true}
              />
              
              <NotificationSetting 
                title="Recovery Notifications" 
                description="Be notified when a player returns to normal readings"
                enabled={false}
              />
              
              <NotificationSetting 
                title="Daily Reports" 
                description="Receive daily summary of team health status"
                enabled={true}
              />
              
              <NotificationSetting 
                title="Email Notifications" 
                description="Send alerts to registered email addresses"
                enabled={false}
              />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="about" className="mt-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold mb-4">About Health Monitor 360</h2>
            <p className="text-gray-500 mb-4">
              Health Monitor 360 is a comprehensive football player health monitoring system designed to track vital signs in real-time.
            </p>
            
            <h3 className="font-medium mt-6 mb-2">Features</h3>
            <ul className="list-disc pl-5 space-y-2 text-gray-600">
              <li>Real-time monitoring of player vital signs</li>
              <li>Historical data tracking and visualization</li>
              <li>Customizable alert thresholds</li>
              <li>Detailed player health profiles</li>
              <li>Instant alerts for concerning health readings</li>
            </ul>
            
            <h3 className="font-medium mt-6 mb-2">Sensors Used</h3>
            <ul className="list-disc pl-5 space-y-2 text-gray-600">
              <li>MAX30205: Body temperature sensing with high accuracy</li>
              <li>MAX30100/30102: Combined pulse oximetry and heart rate monitor</li>
              <li>Additional sensors for hydration, respiration, and fatigue monitoring</li>
            </ul>
            
            <div className="mt-6 pt-6 border-t border-gray-100">
              <div className="text-sm text-gray-500">
                <p>Version 1.0.0</p>
                <p>© 2023 Health Monitor 360. All rights reserved.</p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface ThresholdSettingProps {
  title: string;
  description: string;
  unit: string;
  min: number;
  max: number;
}

const ThresholdSetting: React.FC<ThresholdSettingProps> = ({ title, description, unit, min, max }) => {
  return (
    <div className="p-4 border border-gray-200 rounded-lg">
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div className="mb-4 md:mb-0">
          <h3 className="font-medium">{title}</h3>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
        <div className="flex items-center space-x-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Min</label>
            <input 
              type="text" 
              value={min} 
              readOnly 
              className="w-20 px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
            />
            <span className="ml-1 text-xs text-gray-500">{unit}</span>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Max</label>
            <input 
              type="text" 
              value={max} 
              readOnly 
              className="w-20 px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
            />
            <span className="ml-1 text-xs text-gray-500">{unit}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

interface NotificationSettingProps {
  title: string;
  description: string;
  enabled: boolean;
}

const NotificationSetting: React.FC<NotificationSettingProps> = ({ title, description, enabled }) => {
  return (
    <div className="p-4 border border-gray-200 rounded-lg">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium">{title}</h3>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
        <div className="relative inline-block w-12 h-6 bg-gray-200 rounded-full">
          <div className={`absolute left-1 top-1 w-4 h-4 rounded-full transition-transform ${enabled ? 'transform translate-x-6 bg-info' : 'bg-gray-400'}`}></div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
