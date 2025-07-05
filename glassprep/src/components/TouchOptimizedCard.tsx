import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import type { GameModule, ModuleProgress } from '../types';

interface TouchOptimizedCardProps {
  module: GameModule;
  progress?: ModuleProgress;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
}

export const TouchOptimizedCard: React.FC<TouchOptimizedCardProps> = ({ 
  module, 
  progress, 
  onSwipeLeft, 
  onSwipeRight 
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const [swipeDistance, setSwipeDistance] = useState(0);
  const [startX, setStartX] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);

  const isCompleted = progress && progress.highScore >= 80;
  const hasPlayed = progress && progress.totalAttempts > 0;

  // Touch event handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsPressed(true);
    setStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isPressed) return;
    
    const currentX = e.touches[0].clientX;
    const distance = currentX - startX;
    setSwipeDistance(distance);
    
    // Apply transform for visual feedback
    if (cardRef.current) {
      cardRef.current.style.transform = `translateX(${distance * 0.3}px) scale(${1 - Math.abs(distance) * 0.0005})`;
    }
  };

  const handleTouchEnd = () => {
    setIsPressed(false);
    
    // Reset transform
    if (cardRef.current) {
      cardRef.current.style.transform = '';
    }

    // Handle swipe actions
    if (Math.abs(swipeDistance) > 100) {
      if (swipeDistance > 0 && onSwipeRight) {
        onSwipeRight();
      } else if (swipeDistance < 0 && onSwipeLeft) {
        onSwipeLeft();
      }
    }
    
    setSwipeDistance(0);
  };

  // Haptic feedback for supported devices
  const triggerHapticFeedback = (type: 'light' | 'medium' | 'heavy' = 'light') => {
    if ('vibrate' in navigator) {
      const patterns = {
        light: [10],
        medium: [20],
        heavy: [30]
      };
      navigator.vibrate(patterns[type]);
    }
  };

  const handleCardPress = () => {
    triggerHapticFeedback('light');
  };

  return (
    <div
      ref={cardRef}
      className={`glass glass-hover transition-all duration-300 touch-manipulation select-none ${
        isPressed ? 'scale-95' : ''
      }`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
    >
      <Link 
        to={module.route} 
        className="block p-4 md:p-6 h-full"
        onTouchStart={handleCardPress}
      >
        <div className="flex flex-col h-full relative overflow-hidden">
          {/* Mobile-optimized header */}
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <div className="text-2xl md:text-4xl transform transition-transform duration-300 hover:scale-110">
              {module.icon}
            </div>
            {isCompleted && (
              <div className="bg-accent/20 text-accent px-2 py-1 md:px-3 md:py-1 rounded-full text-xs md:text-sm animate-pulse-glow">
                ✅ Complete
              </div>
            )}
          </div>
          
          {/* Title & Description - Mobile optimized */}
          <h3 className="text-lg md:text-xl font-semibold mb-2 leading-tight">{module.name}</h3>
          <p className="text-gray-300 text-sm md:text-base mb-3 md:mb-4 flex-grow line-clamp-2 md:line-clamp-none">
            {module.description}
          </p>
          
          {/* Progress Info - Condensed for mobile */}
          {hasPlayed && progress && (
            <div className="space-y-1 md:space-y-2 mb-3 md:mb-4">
              <div className="flex justify-between text-xs md:text-sm">
                <span className="text-gray-400">Best Score</span>
                <span className="font-semibold text-accent">{progress.highScore}%</span>
              </div>
              <div className="flex justify-between text-xs md:text-sm">
                <span className="text-gray-400">Attempts</span>
                <span>{progress.totalAttempts}</span>
              </div>
              {progress.bestTime && (
                <div className="flex justify-between text-xs md:text-sm">
                  <span className="text-gray-400">Best Time</span>
                  <span>{Math.round(progress.bestTime / 1000)}s</span>
                </div>
              )}
            </div>
          )}
          
          {/* Win Condition - Smaller on mobile */}
          <div className="text-xs text-gray-400 mb-3 md:mb-4">
            <span className="font-semibold">Goal:</span> {module.winCondition}
          </div>
          
          {/* Touch-optimized button */}
          <button className="w-full py-3 md:py-4 bg-accent hover:bg-accent/90 text-white font-semibold rounded-xl transition-all duration-300 touch-manipulation min-h-[44px] md:min-h-[48px]">
            {hasPlayed ? 'Play Again' : 'Start Playing'}
          </button>
        </div>
      </Link>
    </div>
  );
};

// Mobile-specific utility classes
export const mobileOptimizedClasses = {
  button: 'min-h-[44px] px-4 py-3 touch-manipulation',
  input: 'min-h-[44px] px-4 py-3 text-base', // Prevents zoom on iOS
  card: 'p-4 md:p-6 touch-manipulation select-none',
  text: 'text-base md:text-lg leading-relaxed',
  spacing: 'space-y-3 md:space-y-4',
  grid: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6'
}; 