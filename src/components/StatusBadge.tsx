
import React from 'react';
import { getStatusColor } from '../types';
import { AlertTriangle, Heart } from 'lucide-react';

interface StatusBadgeProps {
  status: 'normal' | 'warning' | 'alert' | 'infection';
  pulseAnimation?: boolean;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, pulseAnimation = false }) => {
  const baseClasses = `px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(status)}`;
  const animationClass = (pulseAnimation && status !== 'normal') ? 'animate-pulse-slow' : '';
  
  return (
    <span className={`${baseClasses} ${animationClass} flex items-center`}>
      {status === 'infection' && <Heart className="h-3 w-3 mr-1" />}
      {status === 'normal' ? 'Normal' : 
       status === 'warning' ? 'Warning' : 
       status === 'alert' ? 'Alert' : 'Infection'}
    </span>
  );
};

export default StatusBadge;
