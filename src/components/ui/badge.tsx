import React from 'react';
import { cn } from '@/utils/cn';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'success' | 'warning';
  children: React.ReactNode;
}

export function Badge({
  className,
  variant = 'default',
  ...props
}: BadgeProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        {
          'bg-gray-100 text-gray-800': variant === 'default',
          'bg-red-100 text-red-800': variant === 'destructive',
          'bg-green-100 text-green-800': variant === 'success',
          'bg-yellow-100 text-yellow-800': variant === 'warning',
          'border border-gray-200 bg-white text-gray-900': variant === 'outline',
        },
        className
      )}
      {...props}
    />
  );
}
