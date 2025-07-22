import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: string | number;
  unit?: string;
  change?: number; // Percentage change
  period?: string; // e.g., "last month", "last quarter"
  description?: string;
  icon?: React.ReactNode;
  className?: string;
}

const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  unit,
  change,
  period,
  description,
  icon,
  className,
}) => {
  const isPositiveChange = change !== undefined && change >= 0;
  const changeColorClass = change === undefined 
    ? 'text-gray-500' 
    : isPositiveChange ? 'text-green-600' : 'text-red-600';
  const changeIcon = change === undefined ? null : isPositiveChange ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />;

  return (
    <div className={`bg-white p-5 rounded-lg shadow-md flex flex-col justify-between ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-medium text-gray-500">{title}</h4>
        {icon && <div className="text-gray-400">{icon}</div>}
      </div>
      <div className="flex items-baseline mb-2">
        <p className="text-3xl font-bold text-gray-900">
          {value}
          {unit && <span className="text-base font-medium text-gray-500 ml-1">{unit}</span>}
        </p>
      </div>
      {change !== undefined && (
        <div className={`flex items-center text-sm ${changeColorClass}`}>
          {changeIcon}
          <span className="ml-1 font-medium">{Math.abs(change).toFixed(1)}%</span>
          {period && <span className="ml-1 text-gray-400">({period})</span>}
        </div>
      )}
      {description && <p className="text-sm text-gray-500">{description}</p>}
    </div>
  );
};

export default KpiCard;