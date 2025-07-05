import React from 'react';

interface LoadingSkeletonProps {
  className?: string;
  variant?: 'card' | 'text' | 'circle' | 'button';
  lines?: number;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  className = '',
  variant = 'text',
  lines = 1,
}) => {
  const baseClasses = 'animate-pulse bg-white/10 rounded';

  const getVariantClasses = () => {
    switch (variant) {
      case 'card':
        return 'h-48 w-full';
      case 'circle':
        return 'h-12 w-12 rounded-full';
      case 'button':
        return 'h-12 w-32';
      case 'text':
      default:
        return 'h-4 w-full';
    }
  };

  if (variant === 'text' && lines > 1) {
    return (
      <div className={`space-y-2 ${className}`}>
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={`${baseClasses} ${getVariantClasses()}`}
            style={{
              width: index === lines - 1 ? '75%' : '100%',
              animationDelay: `${index * 0.1}s`,
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div className={`${baseClasses} ${getVariantClasses()} ${className}`} />
  );
};

export const GameCardSkeleton: React.FC = () => (
  <div className="glass p-6 h-full">
    <div className="flex items-start justify-between mb-4">
      <LoadingSkeleton variant="circle" />
      <LoadingSkeleton className="h-6 w-20" />
    </div>
    <LoadingSkeleton className="h-6 w-3/4 mb-2" />
    <LoadingSkeleton variant="text" lines={3} className="mb-4" />
    <div className="space-y-2 mb-4">
      <div className="flex justify-between">
        <LoadingSkeleton className="h-4 w-16" />
        <LoadingSkeleton className="h-4 w-12" />
      </div>
      <div className="flex justify-between">
        <LoadingSkeleton className="h-4 w-20" />
        <LoadingSkeleton className="h-4 w-8" />
      </div>
    </div>
    <LoadingSkeleton variant="button" className="w-full" />
  </div>
);

export const DashboardSkeleton: React.FC = () => (
  <div className="min-h-screen p-4 max-w-7xl mx-auto">
    {/* Header Skeleton */}
    <div className="glass p-6 mb-8 animate-fadeIn">
      <div className="flex items-center justify-between">
        <div>
          <LoadingSkeleton className="h-8 w-64 mb-2" />
          <LoadingSkeleton className="h-4 w-48" />
        </div>
        <div className="flex items-center gap-6">
          <LoadingSkeleton variant="circle" className="h-32 w-32" />
          <div className="flex gap-3">
            <LoadingSkeleton variant="button" />
            <LoadingSkeleton variant="button" />
          </div>
        </div>
      </div>
    </div>

    {/* Status Skeleton */}
    <div className="glass p-6 mb-8 animate-fadeIn" style={{ animationDelay: '0.1s' }}>
      <LoadingSkeleton className="h-6 w-48 mb-2 mx-auto" />
      <LoadingSkeleton className="h-4 w-96 mx-auto" />
    </div>

    {/* Game Cards Skeleton */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className="animate-fadeInUp"
          style={{ animationDelay: `${0.2 + index * 0.1}s` }}
        >
          <GameCardSkeleton />
        </div>
      ))}
    </div>
  </div>
); 