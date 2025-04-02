
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { VitalSigns, VITAL_RANGES, CHART_COLORS } from '../types';

interface VitalChartProps {
  data: VitalSigns[];
  vitalType: keyof typeof VITAL_RANGES;
  dataKey: keyof VitalSigns;
  title: string;
  unit: string;
  height?: number;
  showReferenceLines?: boolean;
}

const VitalChart: React.FC<VitalChartProps> = ({ 
  data, 
  vitalType, 
  dataKey, 
  title, 
  unit, 
  height = 200,
  showReferenceLines = true
}) => {
  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };
  
  // Format value with tooltip
  const formatValue = (value: number) => {
    return `${value} ${unit}`;
  };
  
  const vitalRanges = VITAL_RANGES[vitalType];
  const chartColor = CHART_COLORS[vitalType as keyof typeof CHART_COLORS] || '#000';
  
  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-gray-200 rounded shadow-sm text-xs">
          <p className="font-medium">{formatTimestamp(label)}</p>
          <p className="text-[#0EA5E9]">
            {title}: {payload[0].value} {unit}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
      <h3 className="text-sm font-medium text-gray-700 mb-4">{title}</h3>
      <div style={{ height: `${height}px` }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis 
              dataKey="timestamp" 
              tickFormatter={formatTimestamp} 
              tick={{ fontSize: 10 }}
              minTickGap={30}
            />
            <YAxis 
              domain={[
                // Set min/max with a buffer
                Math.min(vitalRanges.min * 0.9, Math.min(...data.map(d => d[dataKey] as number)) * 0.9),
                Math.max(vitalRanges.max * 1.1, Math.max(...data.map(d => d[dataKey] as number)) * 1.1)
              ]}
              tick={{ fontSize: 10 }}
            />
            <Tooltip content={<CustomTooltip />} />
            
            {showReferenceLines && (
              <>
                <ReferenceLine y={vitalRanges.min} stroke="#F59E0B" strokeDasharray="3 3" />
                <ReferenceLine y={vitalRanges.max} stroke="#F59E0B" strokeDasharray="3 3" />
              </>
            )}
            
            <Line
              type="monotone"
              dataKey={dataKey as string}
              stroke={chartColor}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default VitalChart;
