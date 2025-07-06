import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { GameCard } from '../components/GameCard';
import { ProgressRing } from '../components/ProgressRing';
import { Onboarding } from '../components/Onboarding';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useStaggeredAnimation, useCountAnimation, usePageAnimation } from '../hooks/useAnimations';
import { gameModules } from '../config/gameModules';
import type { UserProgress } from '../types';

export const Dashboard: React.FC = () => {
  const [userProgress] = useLocalStorage<UserProgress>('glassprep_progress', {
    modules: {},
    lastPlayed: new Date().toISOString(),
    totalPlayTime: 0,
  });
  
  const [hasSeenOnboarding, setHasSeenOnboarding] = useLocalStorage<boolean>('glassprep_onboarding_seen', false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Show onboarding for first-time users
  useEffect(() => {
    if (!hasSeenOnboarding) {
      setShowOnboarding(true);
    }
  }, [hasSeenOnboarding]);

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    setHasSeenOnboarding(true);
  };

  const handleOnboardingSkip = () => {
    setShowOnboarding(false);
    setHasSeenOnboarding(true);
  };

  // Calculate overall progress
  const calculateOverallProgress = (): number => {
    const moduleScores = gameModules.map(module => {
      const progress = userProgress.modules[module.id];
      if (!progress) return 0;
      
      // Different win thresholds per module
      const winThresholds: Record<string, number> = {
        quiz: 80,
        flashcards: 90,
        case: 80,
        matching: 100,
        acronym: 80,
        trends: 80,
      };
      
      const threshold = winThresholds[module.id] || 80;
      return Math.min((progress.highScore / threshold) * 100, 100);
    });
    
    return Math.round(moduleScores.reduce((a, b) => a + b, 0) / gameModules.length);
  };

  // Get personalized greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning! 🌅";
    if (hour < 18) return "Good afternoon! ☀️";
    return "Good evening! 🌙";
  };

  // Get next recommended module
  const getRecommendedModule = () => {
    const incompleteModules = gameModules.filter(module => {
      const progress = userProgress.modules[module.id];
      return !progress || progress.highScore < 80;
    });
    return incompleteModules[0] || gameModules[0];
  };

  const overallProgress = calculateOverallProgress();
  const isVisible = usePageAnimation();
  const visibleCards = useStaggeredAnimation(gameModules.length, 150);
  const animatedProgress = useCountAnimation(overallProgress, 1500);
  const recommendedModule = getRecommendedModule();

  return (
    <div className={`min-h-screen p-3 sm:p-4 lg:p-6 max-w-7xl mx-auto transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
      {/* Enhanced Header with Better Mobile Layout */}
      <header className="glass p-4 sm:p-6 mb-6 sm:mb-8 animate-slideInDown">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="animate-slideInLeft">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-content-center text-white font-bold text-lg">
                G
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold">GlassPrep Dashboard</h1>
                <p className="text-gray-300 text-sm sm:text-base">{getGreeting()}</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm">Master your Digital Marketing interview skills</p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 lg:gap-6 animate-slideInRight">
            <div className="flex items-center gap-4">
              <div className="transform hover:scale-110 transition-transform duration-300">
                <ProgressRing progress={animatedProgress} />
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-400">Interview Ready</p>
                <p className="text-xl font-bold text-accent">{animatedProgress}%</p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 sm:gap-3">
              <button 
                onClick={() => setShowOnboarding(true)} 
                className="btn-secondary text-sm px-3 py-2"
                title="Show tutorial"
                aria-label="Show tutorial"
              >
                🎯 Tutorial
              </button>
              <Link to="/study-guide" className="btn-secondary text-sm px-3 py-2" aria-label="Open study guide">
                📚 Study Guide
              </Link>
              <Link to="/settings" className="btn-secondary text-sm px-3 py-2" aria-label="Open settings">
                ⚙️ Settings
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Enhanced Ready Status with Action CTA */}
      <div className="glass p-4 sm:p-6 mb-6 sm:mb-8 animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
        <div className="text-center mb-4">
          <h2 className="text-xl sm:text-2xl font-semibold mb-2">
            Interview Readiness: {overallProgress >= 80 ? '🟢 Ready!' : overallProgress >= 50 ? '🟡 Getting There' : '🔴 Keep Practicing'}
          </h2>
          <p className="text-gray-300 text-sm sm:text-base max-w-2xl mx-auto">
            {overallProgress >= 80
              ? "You're well prepared! Keep your skills sharp with daily practice."
              : overallProgress >= 50
              ? "Good progress! Focus on modules below 80% to boost your readiness."
              : "You're just getting started. Complete each module to build confidence!"}
          </p>
        </div>
        
        {/* Recommended Next Action */}
        {overallProgress < 80 && (
          <div className="bg-accent/10 border border-accent/30 rounded-lg p-4 mt-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-semibold text-accent mb-1">Recommended Next Step</h3>
                <p className="text-sm text-gray-300">Continue with <span className="font-medium">{recommendedModule.name}</span></p>
              </div>
              <Link to={recommendedModule.route} className="btn-primary text-sm px-4 py-2 whitespace-nowrap">
                Start Now →
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Section Header */}
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-bold mb-2">Learning Modules</h2>
        <p className="text-gray-400 text-sm">Choose a module to practice and improve your skills</p>
      </div>

      {/* Enhanced Game Modules Grid with Better Mobile Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
        {gameModules.map((module, index) => (
          <div
            key={module.id}
            className={`transform transition-all duration-500 ${
              visibleCards.includes(index)
                ? 'opacity-100 translate-y-0 scale-100'
                : 'opacity-0 translate-y-8 scale-95'
            }`}
            style={{ transitionDelay: `${index * 150}ms` }}
          >
            <GameCard
              module={module}
              progress={userProgress.modules[module.id]}
              isRecommended={module.id === recommendedModule.id && overallProgress < 80}
            />
          </div>
        ))}
      </div>

      {/* Enhanced Quick Stats with Better Visual Hierarchy */}
      <div className="glass p-4 sm:p-6 animate-fadeInUp" style={{ animationDelay: '0.8s' }}>
        <h3 className="text-lg sm:text-xl font-semibold mb-4 text-center">Your Progress Summary</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <div className="text-center p-4 glass rounded-lg transform hover:scale-105 transition-transform duration-300">
            <div className="text-2xl sm:text-3xl font-bold text-accent animate-bounce-subtle mb-2">{animatedProgress}%</div>
            <div className="text-sm text-gray-400">Overall Progress</div>
            <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
              <div 
                className="bg-accent h-2 rounded-full transition-all duration-1000" 
                style={{ width: `${animatedProgress}%` }}
              ></div>
            </div>
          </div>
          <div className="text-center p-4 glass rounded-lg transform hover:scale-105 transition-transform duration-300">
            <div className="text-2xl sm:text-3xl font-bold text-accent animate-bounce-subtle mb-2" style={{ animationDelay: '0.2s' }}>
              {Object.keys(userProgress.modules).filter(id => 
                userProgress.modules[id]?.highScore >= 80
              ).length}/{gameModules.length}
            </div>
            <div className="text-sm text-gray-400">Modules Completed</div>
            <div className="text-xs text-gray-500 mt-1">
              {gameModules.length - Object.keys(userProgress.modules).filter(id => 
                userProgress.modules[id]?.highScore >= 80
              ).length} remaining
            </div>
          </div>
          <div className="text-center p-4 glass rounded-lg transform hover:scale-105 transition-transform duration-300">
            <div className="text-2xl sm:text-3xl font-bold text-accent animate-bounce-subtle mb-2" style={{ animationDelay: '0.4s' }}>
              {Object.values(userProgress.modules).reduce((sum, m) => sum + (m?.totalAttempts || 0), 0)}
            </div>
            <div className="text-sm text-gray-400">Total Attempts</div>
            <div className="text-xs text-gray-500 mt-1">
              Keep practicing!
            </div>
          </div>
        </div>
      </div>

      {/* Onboarding Modal */}
      <Onboarding
        isVisible={showOnboarding}
        onComplete={handleOnboardingComplete}
        onSkip={handleOnboardingSkip}
      />
    </div>
  );
}; 