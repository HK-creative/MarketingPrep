import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { setPINHash, verifyPIN, DEFAULT_PIN } from '../utils/auth';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { AchievementSystem } from '../components/AchievementSystem';
import type { UserProgress } from '../types';

export const Settings: React.FC = () => {
  const [userProgress, setUserProgress] = useLocalStorage<UserProgress>('glassprep_progress', {
    modules: {},
    lastLogin: new Date().toISOString(),
    totalPlayTime: 0,
  });

  // PIN Change states
  const [currentPIN, setCurrentPIN] = useState('');
  const [newPIN, setNewPIN] = useState('');
  const [confirmPIN, setConfirmPIN] = useState('');
  const [pinError, setPinError] = useState('');
  const [pinSuccess, setPinSuccess] = useState(false);
  
  // Reset states
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  // View state
  const [activeTab, setActiveTab] = useState<'settings' | 'achievements'>('settings');

  const handlePINChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPinError('');
    setPinSuccess(false);

    // Validate current PIN
    const isValid = await verifyPIN(currentPIN);
    if (!isValid) {
      setPinError('Current PIN is incorrect');
      return;
    }

    // Validate new PIN
    if (newPIN.length !== 4 || !/^\d+$/.test(newPIN)) {
      setPinError('New PIN must be 4 digits');
      return;
    }

    if (newPIN !== confirmPIN) {
      setPinError('PINs do not match');
      return;
    }

    // Update PIN
    await setPINHash(newPIN);
    setPinSuccess(true);
    setCurrentPIN('');
    setNewPIN('');
    setConfirmPIN('');
    
    setTimeout(() => {
      setPinSuccess(false);
    }, 3000);
  };

  const handleResetProgress = () => {
    setUserProgress({
      modules: {},
      lastLogin: new Date().toISOString(),
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
          {/* PIN Change Section */}
          <div className="glass p-6 mb-8 bg-white/5">
            <h2 className="text-xl font-semibold mb-4">Change PIN</h2>
            
            <form onSubmit={handlePINChange} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Current PIN</label>
                <input
                  type="password"
                  value={currentPIN}
                  onChange={(e) => setCurrentPIN(e.target.value)}
                  maxLength={4}
                  placeholder="Enter current PIN"
                  className="w-full p-3 glass bg-white/5 text-white focus:outline-none focus:border-accent"
                />
                <p className="text-xs text-gray-400 mt-1">Default: {DEFAULT_PIN}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">New PIN</label>
                <input
                  type="password"
                  value={newPIN}
                  onChange={(e) => setNewPIN(e.target.value)}
                  maxLength={4}
                  placeholder="Enter new 4-digit PIN"
                  className="w-full p-3 glass bg-white/5 text-white focus:outline-none focus:border-accent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Confirm New PIN</label>
                <input
                  type="password"
                  value={confirmPIN}
                  onChange={(e) => setConfirmPIN(e.target.value)}
                  maxLength={4}
                  placeholder="Confirm new PIN"
                  className="w-full p-3 glass bg-white/5 text-white focus:outline-none focus:border-accent"
                />
              </div>
              
              {pinError && (
                <p className="text-red-500 text-sm">{pinError}</p>
              )}
              
              {pinSuccess && (
                <p className="text-green-500 text-sm">PIN updated successfully!</p>
              )}
              
              <button type="submit" className="btn-primary">
                Update PIN
              </button>
            </form>
          </div>

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
                <p className="text-red-400 font-semibold">Are you sure? This cannot be undone.</p>
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

          {/* Statistics Section */}
          <div className="glass p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Your Statistics</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-accent">{stats.completedModules}</p>
                <p className="text-gray-400">Modules Completed</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-accent">{stats.totalAttempts}</p>
                <p className="text-gray-400">Total Attempts</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-accent">{stats.avgScore}%</p>
                <p className="text-gray-400">Average Score</p>
              </div>
            </div>
          </div>

          {/* About Section */}
          <div className="glass p-6">
            <h2 className="text-xl font-semibold mb-4">About GlassPrep</h2>
            <p className="text-gray-300 mb-2">
              GlassPrep is your personal Digital Marketing interview preparation tool.
            </p>
            <p className="text-gray-400 text-sm">
              Built with React, TypeScript, and TailwindCSS.
            </p>
            <p className="text-gray-400 text-sm mt-2">
              Good luck with your interview, Yuval! 🚀
            </p>
          </div>
        </div>
      )}

      {activeTab === 'achievements' && (
        <AchievementSystem userProgress={userProgress} />
      )}
    </div>
  );
}; 