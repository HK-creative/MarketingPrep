import React from 'react';
import { Link } from 'react-router-dom';
import type { GameModule, ModuleProgress } from '../types';

interface GameCardProps {
  module: GameModule;
  progress?: ModuleProgress;
}

export const GameCard: React.FC<GameCardProps> = ({ module, progress }) => {
  const isCompleted = progress && progress.highScore >= 80;
  const hasPlayed = progress && progress.totalAttempts > 0;
  
  return (
    <Link to={module.route} className="block group">
      <div className="glass glass-hover p-6 h-full flex flex-col relative overflow-hidden">
        {/* Animated background on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Header */}
        <div className="flex items-start justify-between mb-4 relative z-10">
          <div className="text-4xl transform group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300">
            {module.icon}
          </div>
          {isCompleted && (
            <div className="bg-accent/20 text-accent px-3 py-1 rounded-full text-sm animate-pulse-glow">
              ✅ Complete
            </div>
          )}
        </div>
        
        {/* Title & Description */}
        <h3 className="text-xl font-semibold mb-2 relative z-10 group-hover:text-accent transition-colors duration-300">{module.name}</h3>
        <p className="text-gray-300 text-sm mb-4 flex-grow relative z-10">{module.description}</p>
        
        {/* Progress Info */}
        {hasPlayed && progress && (
          <div className="space-y-2 mb-4 relative z-10">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">High Score</span>
              <span className="font-semibold text-accent">{progress.highScore}%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Attempts</span>
              <span>{progress.totalAttempts}</span>
            </div>
            {progress.bestTime && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Best Time</span>
                <span>{Math.round(progress.bestTime / 1000)}s</span>
              </div>
            )}
          </div>
        )}
        
        {/* Win Condition */}
        <div className="text-xs text-gray-400 mb-4 relative z-10">
          <span className="font-semibold">Goal:</span> {module.winCondition}
        </div>
        
        {/* Play Button */}
        <button className="btn-primary w-full text-center relative z-10 group-hover:shadow-xl group-hover:shadow-accent/20">
          {hasPlayed ? 'Play Again' : 'Start Playing'}
        </button>
      </div>
    </Link>
  );
}; 