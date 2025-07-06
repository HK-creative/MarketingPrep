import React from 'react';
import { Link } from 'react-router-dom';
import type { GameModule, ModuleProgress } from '../types';

interface GameCardProps {
  module: GameModule;
  progress?: ModuleProgress;
  isRecommended?: boolean;
}

export const GameCard: React.FC<GameCardProps> = ({ module, progress, isRecommended = false }) => {
  const isCompleted = progress && progress.highScore >= 80;
  const hasPlayed = progress && progress.totalAttempts > 0;
  
  return (
    <Link to={module.route} className="block group">
      <div className={`glass glass-hover p-6 h-full flex flex-col relative overflow-hidden transition-all duration-300 ${
        isRecommended ? 'ring-2 ring-accent/50 shadow-lg shadow-accent/20' : ''
      }`}>
        {/* Animated background on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Enhanced Header with Recommendation Badge */}
        <div className="flex items-start justify-between mb-4 relative z-10">
          <div className="flex items-center gap-3">
            <div className="text-3xl sm:text-4xl transform group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300">
              {module.icon}
            </div>
            {isRecommended && (
              <div className="bg-accent text-white px-2 py-1 rounded-full text-xs font-medium animate-pulse-glow">
                ⭐ Next
              </div>
            )}
          </div>
          {isCompleted && (
            <div className="bg-accent/20 text-accent px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
              ✅ Complete
            </div>
          )}
        </div>
        
        {/* Enhanced Title & Description */}
        <h3 className="text-lg sm:text-xl font-semibold mb-2 relative z-10 group-hover:text-accent transition-colors duration-300">
          {module.name}
        </h3>
        <p className="text-gray-300 text-xs sm:text-sm mb-4 flex-grow relative z-10 leading-relaxed">
          {module.description}
        </p>
        
        {/* Enhanced Progress Info */}
        {hasPlayed && progress && (
          <div className="space-y-2 mb-4 relative z-10">
            <div className="flex justify-between text-xs sm:text-sm">
              <span className="text-gray-400">High Score</span>
              <span className={`font-semibold ${progress.highScore >= 80 ? 'text-green-400' : 'text-accent'}`}>
                {progress.highScore}%
              </span>
            </div>
            <div className="flex justify-between text-xs sm:text-sm">
              <span className="text-gray-400">Attempts</span>
              <span className="text-gray-300">{progress.totalAttempts}</span>
            </div>
            {progress.bestTime && (
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="text-gray-400">Best Time</span>
                <span className="text-gray-300">{Math.round(progress.bestTime / 1000)}s</span>
              </div>
            )}
            
            {/* Progress Bar */}
            <div className="w-full bg-gray-700 rounded-full h-2 mt-3">
              <div 
                className={`h-2 rounded-full transition-all duration-500 ${
                  progress.highScore >= 80 ? 'bg-green-400' : 'bg-accent'
                }`}
                style={{ width: `${Math.min(progress.highScore, 100)}%` }}
              ></div>
            </div>
          </div>
        )}
        
        {/* Enhanced Win Condition */}
        <div className="text-xs text-gray-400 mb-4 relative z-10 p-2 bg-gray-800/30 rounded border-l-2 border-accent/30">
          <span className="font-semibold text-accent">Goal:</span> {module.winCondition}
        </div>
        
        {/* Enhanced Play Button */}
        <button className={`w-full text-center relative z-10 transition-all duration-300 px-4 py-3 rounded-lg font-medium text-sm ${
          isRecommended 
            ? 'bg-accent text-white hover:bg-accent/90 shadow-lg shadow-accent/30' 
            : 'btn-primary'
        } group-hover:shadow-xl group-hover:shadow-accent/20`}>
          {hasPlayed ? 
            (isCompleted ? '🎉 Play Again' : '📈 Continue') : 
            (isRecommended ? '🚀 Start Recommended' : 'Start Playing')
          }
        </button>
      </div>
    </Link>
  );
}; 