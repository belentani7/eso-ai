'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  shape?: 'circle' | 'square';
}

const sizeClasses = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
  xl: 'h-16 w-16 text-lg',
};

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, src, alt, fallback, size = 'md', shape = 'circle', ...props }, ref) => {
    const [imageError, setImageError] = React.useState(false);
    
    const showFallback = !src || imageError;
    
    return (
      <div
        ref={ref}
        className={cn(
          'relative inline-flex shrink-0 overflow-hidden font-medium',
          sizeClasses[size],
          shape === 'circle' ? 'rounded-full' : 'rounded-xl',
          className
        )}
        {...props}
      >
        {!showFallback && src && (
          <img
            src={src}
            alt={alt || ''}
            className="aspect-square h-full w-full object-cover"
            onError={() => setImageError(true)}
          />
        )}
        {showFallback && (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary-500 to-secondary-500 text-white">
            {fallback || (alt ? alt.charAt(0).toUpperCase() : '?')}
          </div>
        )}
      </div>
    );
  }
);
Avatar.displayName = 'Avatar';

export { Avatar };