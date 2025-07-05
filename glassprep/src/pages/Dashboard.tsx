import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { GameCard } from '../components/GameCard';
import { ProgressRing } from '../components/ProgressRing';
import { Onboarding } from '../components/Onboarding';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useStaggeredAnimation, useCountAnimation, usePageAnimation } from '../hooks/useAnimations';
import { gameModules } from '../config/gameModules';
import type { UserProgress } from '../types';
import { setAuthenticated } from '../utils/auth';
import { useNavigate } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const [userProgress] = useLocalStorage<UserProgress>('glassprep_progress', {
    modules: {},
    lastLogin: new Date().toISOString(),
    totalPlayTime: 0,
  });
  
  const [hasSeenOnboarding, setHasSeenOnboarding] = useLocalStorage<boolean>('glassprep_onboarding_seen', false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  
  const navigate = useNavigate();

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

  const handleLogout = () => {
    setAuthenticated(false);
    navigate('/login');
  };

  const overallProgress = calculateOverallProgress();
  const isVisible = usePageAnimation();
  const visibleCards = useStaggeredAnimation(gameModules.length, 150);
  const animatedProgress = useCountAnimation(overallProgress, 1500);

  return (
    <div className={`min-h-screen p-4 max-w-7xl mx-auto transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
      {/* Header */}
      <header className="glass p-6 mb-8 flex items-center justify-between animate-slideInDown">
        <div className="animate-slideInLeft">
          <h1 className="text-3xl font-bold mb-1">GlassPrep Dashboard</h1>
          <p className="text-gray-300">Master your Digital Marketing interview skills</p>
        </div>
        
        <div className="flex items-center gap-6 animate-slideInRight">
          <div className="transform hover:scale-110 transition-transform duration-300">
            <ProgressRing progress={animatedProgress} />
          </div>
          
          <div className="flex gap-3">
            <button 
              onClick={() => setShowOnboarding(true)} 
              className="btn-secondary"
              title="Show tutorial"
            >
              🎯 Tutorial
            </button>
            <Link to="/study-guide" className="btn-secondary">
              📚 Study Guide
            </Link>
            <Link to="/settings" className="btn-secondary">
              ⚙️ Settings
            </Link>
            <button onClick={handleLogout} className="btn-secondary">
              🚪 Logout
            </button>
          </div>
        </div>
      </header>

      {/* Ready Status */}
      <div className="glass p-6 mb-8 text-center animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
        <h2 className="text-2xl font-semibold mb-2">
          Interview Readiness: {overallProgress >= 80 ? '🟢 Ready!' : overallProgress >= 50 ? '🟡 Getting There' : '🔴 Keep Practicing'}
        </h2>
        <p className="text-gray-300">
          {overallProgress >= 80
            ? "You're well prepared! Keep your skills sharp with daily practice."
            : overallProgress >= 50
            ? "Good progress! Focus on modules below 80% to boost your readiness."
            : "You're just getting started. Complete each module to build confidence!"}
        </p>
      </div>

      {/* Game Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
            />
          </div>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="glass p-6 mt-8 animate-fadeInUp" style={{ animationDelay: '0.8s' }}>
        <h3 className="text-xl font-semibold mb-4">Your Progress Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center transform hover:scale-105 transition-transform duration-300">
            <p className="text-3xl font-bold text-accent animate-bounce-subtle">{animatedProgress}%</p>
            <p className="text-gray-400">Overall Progress</p>
          </div>
          <div className="text-center transform hover:scale-105 transition-transform duration-300">
            <p className="text-3xl font-bold animate-bounce-subtle" style={{ animationDelay: '0.2s' }}>
              {Object.keys(userProgress.modules).filter(id => 
                userProgress.modules[id]?.highScore >= 80
              ).length}
            </p>
            <p className="text-gray-400">Modules Completed</p>
          </div>
          <div className="text-center transform hover:scale-105 transition-transform duration-300">
            <p className="text-3xl font-bold animate-bounce-subtle" style={{ animationDelay: '0.4s' }}>
              {Object.values(userProgress.modules).reduce((sum, m) => sum + (m?.totalAttempts || 0), 0)}
            </p>
            <p className="text-gray-400">Total Attempts</p>
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