
import React from 'react';
import { VitalStatus, calculateStatus, VITAL_RANGES } from '../types';
import StatusBadge from './StatusBadge';

interface VitalCardProps {
  title: string;
  value: number;
  unit: string;
  vitalType: keyof typeof VITAL_RANGES;
  icon?: React.ReactNode;
}

const VitalCard: React.FC<VitalCardProps> = ({ title, value, unit, vitalType, icon }) => {
  const status = calculateStatus(value, VITAL_RANGES[vitalType]);
  
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          {icon && <div className="mr-2 text-gray-500">{icon}</div>}
          <h3 className="text-sm font-medium text-gray-700">{title}</h3>
        </div>
        <StatusBadge status={status} pulseAnimation={true} />
      </div>
      <div className="mt-1">
        <span className="text-2xl font-bold mr-1">{value}</span>
        <span className="text-gray-500 text-sm">{unit}</span>
      </div>
    </div>
  );
};

export default VitalCard;
