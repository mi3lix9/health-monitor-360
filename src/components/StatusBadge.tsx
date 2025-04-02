
import React from 'react';
import { getStatusColor } from '../types';

interface StatusBadgeProps {
  status: 'normal' | 'warning' | 'alert';
  pulseAnimation?: boolean;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, pulseAnimation = false }) => {
  const baseClasses = `px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(status)}`;
  const animationClass = pulseAnimation && status !== 'normal' ? 'animate-pulse-slow' : '';
  
  return (
    <span className={`${baseClasses} ${animationClass}`}>
      {status === 'normal' ? 'Normal' : status === 'warning' ? 'Warning' : 'Alert'}
    </span>
  );
};

export default StatusBadge;
