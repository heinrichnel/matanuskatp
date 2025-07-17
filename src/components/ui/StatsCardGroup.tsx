import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';

export interface StatItem {
  id: string;
  title: string;
  value: string | number;
  previousValue?: string | number;
  change?: number;
  changeDirection?: 'up' | 'down' | 'neutral';
  format?: (value: any) => string;
}

interface StatsCardGroupProps {
  title?: string;
  stats: StatItem[];
  className?: string;
}

const StatsCardGroup: React.FC<StatsCardGroupProps> = ({
  title,
  stats,
  className = '',
}) => {
  return (
    <div className={`bg-gray-100 p-6 rounded-lg ${className}`}>
      {title && <h3 className="text-lg font-medium mb-4">{title}</h3>}
      
      <div className="flex flex-wrap">
        {stats.map((stat, index) => {
          const isPositiveChange = stat.changeDirection === 'up';
          const isNegativeChange = stat.changeDirection === 'down';
          
          return (
            <div 
              key={stat.id} 
              className={`
                flex-1 p-4 bg-white 
                ${index !== stats.length - 1 ? 'border-r border-gray-200' : ''}
              `}
            >
              <h4 className="text-sm text-gray-500 font-medium">{stat.title}</h4>
              <div className="flex items-end mt-1">
                <div className="text-2xl font-bold text-blue-700">
                  {stat.format ? stat.format(stat.value) : stat.value}
                </div>
                {stat.previousValue && (
                  <div className="text-xs text-gray-500 ml-2 mb-1">
                    from {stat.format ? stat.format(stat.previousValue) : stat.previousValue}
                  </div>
                )}
              </div>
              
              {(isPositiveChange || isNegativeChange) && (
                <div 
                  className={`
                    flex items-center mt-2 text-sm 
                    ${isPositiveChange ? 'text-green-600' : 'text-red-600'}
                  `}
                >
                  {isPositiveChange ? (
                    <ArrowUp className="h-4 w-4 mr-1" />
                  ) : (
                    <ArrowDown className="h-4 w-4 mr-1" />
                  )}
                  <span>{Math.abs(stat.change || 0)}%</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StatsCardGroup;
