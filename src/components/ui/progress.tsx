'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  showLabel?: boolean;
  variant?: 'default' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value, max = 100, showLabel = false, variant = 'default', size = 'md', ...props }, ref) => {
    const percentage = Math.min(100, Math.max(0, (value / max) * 100));
    
    const variantColors = {
      default: 'bg-primary-600',
      success: 'bg-success-600',
      warning: 'bg-warning-500',
      danger: 'bg-red-600',
    };
    
    const sizeClasses = {
      sm: 'h-1.5',
      md: 'h-2.5',
      lg: 'h-4',
    };

    return (
      <div ref={ref} className={cn('w-full', className)} {...props}>
        <div className={cn('relative overflow-hidden rounded-full bg-muted', sizeClasses[size])}>
          <div
            className={cn(
              'h-full rounded-full transition-all duration-500 ease-out',
              variantColors[variant]
            )}
            style={{ width: `${percentage}%` }}
            role="progressbar"
            aria-valuenow={value}
            aria-valuemin={0}
            aria-valuemax={max}
          />
        </div>
        {showLabel && (
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>Progreso</span>
            <span>{Math.round(percentage)}%</span>
          </div>
        )}
      </div>
    );
  }
);
Progress.displayName = 'Progress';

export { Progress };