import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { AchievementSystem } from '../components/AchievementSystem';
import type { UserProgress } from '../types';

export const Settings: React.FC = () => {
  const [userProgress, setUserProgress] = useLocalStorage<UserProgress>('glassprep_progress', {
    modules: {},
    lastPlayed: new Date().toISOString(),
    totalPlayTime: 0,
  });

  // Reset states
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  // View state
  const [activeTab, setActiveTab] = useState<'settings' | 'achievements'>('settings');

  const handleResetProgress = () => {
    setUserProgress({
      modules: {},
      lastPlayed: new Date().toISOString(),
      totalPlayTime: 0,
    });
    setResetSuccess(true);
    setShowResetConfirm(false);
    
    setTimeout(() => {
      setResetSuccess(false);
    }, 3000);
  };

  const getTotalStats = () => {
    const modules = Object.values(userProgress.modules);
    const totalAttempts = modules.reduce((sum, m) => sum + (m?.totalAttempts || 0), 0);
    const completedModules = modules.filter(m => m?.highScore >= 80).length;
    const avgScore = modules.length > 0
      ? Math.round(modules.reduce((sum, m) => sum + (m?.highScore || 0), 0) / modules.length)
      : 0;
    
    return { totalAttempts, completedModules, avgScore };
  };

  const stats = getTotalStats();

  return (
    <div className="min-h-screen p-4 max-w-6xl mx-auto">
      {/* Header */}
      <div className="glass p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Settings & Achievements</h1>
          <Link to="/" className="btn-secondary">
            ← Back to Dashboard
          </Link>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'settings'
                ? 'bg-accent text-white'
                : 'bg-white/10 text-gray-300 hover:bg-white/20'
            }`}
          >
            ⚙️ Settings
          </button>
          <button
            onClick={() => setActiveTab('achievements')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'achievements'
                ? 'bg-accent text-white'
                : 'bg-white/10 text-gray-300 hover:bg-white/20'
            }`}
          >
            🏆 Achievements
          </button>
        </div>
      </div>

      {activeTab === 'settings' && (
        <div className="space-y-8">
          {/* Progress Reset Section */}
          <div className="glass p-6 mb-8 bg-white/5">
            <h2 className="text-xl font-semibold mb-4">Reset Progress</h2>
            <p className="text-gray-300 mb-4">
              This will permanently delete all your game progress, scores, and achievements.
            </p>
            
            {!showResetConfirm ? (
              <button
                onClick={() => setShowResetConfirm(true)}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-all"
              >
                Reset All Progress
              </button>
            ) : (
              <div className="space-y-4">
                <p className="text-yellow-400 font-medium">
                  ⚠️ Are you sure? This action cannot be undone.
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={handleResetProgress}
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-all"
                  >
                    Yes, Reset Everything
                  </button>
                  <button
                    onClick={() => setShowResetConfirm(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
            
            {resetSuccess && (
              <p className="text-green-500 text-sm mt-4">Progress reset successfully!</p>
            )}
          </div>

          {/* Stats Overview */}
          <div className="glass p-6 mb-8 bg-white/5">
            <h2 className="text-xl font-semibold mb-4">Your Statistics</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-accent mb-2">{stats.totalAttempts}</div>
                <div className="text-sm text-gray-400">Total Attempts</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent mb-2">{stats.completedModules}</div>
                <div className="text-sm text-gray-400">Completed Modules</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent mb-2">{stats.avgScore}%</div>
                <div className="text-sm text-gray-400">Average Score</div>
              </div>
            </div>
          </div>

          {/* App Info */}
          <div className="glass p-6 bg-white/5">
            <h2 className="text-xl font-semibold mb-4">About GlassPrep</h2>
            <div className="space-y-2 text-gray-300">
              <p><strong>Version:</strong> 1.0.0</p>
              <p><strong>Last Updated:</strong> {new Date().toLocaleDateString()}</p>
              <p><strong>Developer:</strong> GlassPrep Team</p>
              <p className="mt-4 text-sm">
                Built to help you ace your digital marketing interviews with interactive games and comprehensive study materials.
              </p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'achievements' && (
        <AchievementSystem userProgress={userProgress} />
      )}
    </div>
  );
}; 