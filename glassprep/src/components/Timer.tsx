import React, { useEffect, useState } from 'react';

interface TimerProps {
  duration: number; // in seconds
  onExpire: () => void;
  isRunning: boolean;
  className?: string;
}

export const Timer: React.FC<TimerProps> = ({
  duration,
  onExpire,
  isRunning,
  className = '',
}) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const progress = (timeLeft / duration) * 100;
  
  const radius = 40;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  useEffect(() => {
    setTimeLeft(duration);
  }, [duration]);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          onExpire();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, onExpire]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimerColor = (): string => {
    if (progress > 50) return '#00BFA6';
    if (progress > 25) return '#FFA500';
    return '#FF4444';
  };

  return (
    <div className={`relative inline-flex ${className}`}>
      <svg
        className="timer-ring"
        width="100"
        height="100"
      >
        {/* Background circle */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth="6"
        />
        
        {/* Progress circle */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke={getTimerColor()}
          strokeWidth="6"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000"
        />
      </svg>
      
      {/* Center text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={`text-xl font-bold transition-all duration-300 ${
          progress <= 25 
            ? 'text-red-400 animate-pulse scale-110' 
            : progress <= 50 
            ? 'text-yellow-400' 
            : 'text-white'
        }`}>
          {formatTime(timeLeft)}
        </span>
      </div>
    </div>
  );
}; 