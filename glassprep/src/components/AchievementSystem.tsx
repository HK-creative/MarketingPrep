import React, { useState, useEffect } from 'react';
import { Trophy, Flame, Target, Zap, Star, Award, Calendar, TrendingUp } from 'lucide-react';
import { Confetti } from './Confetti';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  category: 'streak' | 'score' | 'completion' | 'speed' | 'special';
  requirement: number;
  unlocked: boolean;
  unlockedDate?: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface AchievementSystemProps {
  userProgress: any;
  onAchievementUnlocked?: (achievement: Achievement) => void;
}

const achievementDefinitions: Omit<Achievement, 'unlocked' | 'unlockedDate'>[] = [
  // Streak Achievements
  {
    id: 'first_steps',
    title: 'First Steps',
    description: 'Complete your first game module',
    icon: Target,
    category: 'completion',
    requirement: 1,
    rarity: 'common'
  },
  {
    id: 'daily_streak_3',
    title: 'Getting Started',
    description: 'Practice for 3 consecutive days',
    icon: Flame,
    category: 'streak',
    requirement: 3,
    rarity: 'common'
  },
  {
    id: 'daily_streak_7',
    title: 'Week Warrior',
    description: 'Practice for 7 consecutive days',
    icon: Calendar,
    category: 'streak',
    requirement: 7,
    rarity: 'rare'
  },
  {
    id: 'daily_streak_30',
    title: 'Monthly Master',
    description: 'Practice for 30 consecutive days',
    icon: Trophy,
    category: 'streak',
    requirement: 30,
    rarity: 'legendary'
  },
  
  // Score Achievements
  {
    id: 'perfectionist',
    title: 'Perfectionist',
    description: 'Score 100% on any quiz module',
    icon: Star,
    category: 'score',
    requirement: 100,
    rarity: 'rare'
  },
  {
    id: 'high_achiever',
    title: 'High Achiever',
    description: 'Score 90%+ on 5 different modules',
    icon: TrendingUp,
    category: 'score',
    requirement: 5,
    rarity: 'epic'
  },
  {
    id: 'interview_ready',
    title: 'Interview Ready',
    description: 'Achieve 80%+ overall readiness',
    icon: Award,
    category: 'completion',
    requirement: 80,
    rarity: 'epic'
  },
  
  // Completion Achievements
  {
    id: 'module_master',
    title: 'Module Master',
    description: 'Complete all 8 game modules',
    icon: Trophy,
    category: 'completion',
    requirement: 8,
    rarity: 'epic'
  },
  {
    id: 'speed_demon',
    title: 'Speed Demon',
    description: 'Complete Quiz in under 60 seconds',
    icon: Zap,
    category: 'speed',
    requirement: 60,
    rarity: 'rare'
  },
  
  // Special Achievements
  {
    id: 'knowledge_seeker',
    title: 'Knowledge Seeker',
    description: 'Read the entire Study Guide',
    icon: Target,
    category: 'special',
    requirement: 1,
    rarity: 'common'
  }
];

export const AchievementSystem: React.FC<AchievementSystemProps> = ({ 
  userProgress, 
  onAchievementUnlocked 
}) => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [newlyUnlocked, setNewlyUnlocked] = useState<Achievement[]>([]);
  const [showCelebration, setShowCelebration] = useState(false);

  // Initialize achievements from localStorage
  useEffect(() => {
    const savedAchievements = localStorage.getItem('glassprep_achievements');
    if (savedAchievements) {
      setAchievements(JSON.parse(savedAchievements));
    } else {
      // Initialize with all achievements locked
      const initialAchievements = achievementDefinitions.map(def => ({
        ...def,
        unlocked: false
      }));
      setAchievements(initialAchievements);
      localStorage.setItem('glassprep_achievements', JSON.stringify(initialAchievements));
    }
  }, []);

  // Check for new achievements
  useEffect(() => {
    if (achievements.length === 0) return;

    const updatedAchievements = [...achievements];
    const newUnlocks: Achievement[] = [];

    updatedAchievements.forEach(achievement => {
      if (!achievement.unlocked && checkAchievementRequirement(achievement, userProgress)) {
        achievement.unlocked = true;
        achievement.unlockedDate = new Date().toISOString();
        newUnlocks.push(achievement);
      }
    });

    if (newUnlocks.length > 0) {
      setAchievements(updatedAchievements);
      setNewlyUnlocked(newUnlocks);
      setShowCelebration(true);
      localStorage.setItem('glassprep_achievements', JSON.stringify(updatedAchievements));
      
      // Trigger celebration
      setTimeout(() => setShowCelebration(false), 5000);
      
      newUnlocks.forEach(achievement => {
        onAchievementUnlocked?.(achievement);
      });
    }
  }, [userProgress, achievements, onAchievementUnlocked]);

  const checkAchievementRequirement = (achievement: Achievement, progress: any): boolean => {
    const modules = progress.modules || {};
    const completedModules = Object.values(modules).filter((m: any) => m?.highScore >= 80).length;
    const highScoreModules = Object.values(modules).filter((m: any) => m?.highScore >= 90).length;
    const perfectScores = Object.values(modules).filter((m: any) => m?.highScore === 100).length;
    
    // Calculate overall progress
    const moduleScores = Object.values(modules).map((m: any) => m?.highScore || 0);
    const overallProgress = moduleScores.length > 0 
      ? Math.round(moduleScores.reduce((a: number, b: number) => a + b, 0) / moduleScores.length)
      : 0;

    switch (achievement.id) {
      case 'first_steps':
        return completedModules >= 1;
      case 'perfectionist':
        return perfectScores >= 1;
      case 'high_achiever':
        return highScoreModules >= 5;
      case 'interview_ready':
        return overallProgress >= 80;
      case 'module_master':
        return completedModules >= 8;
      case 'daily_streak_3':
      case 'daily_streak_7':
      case 'daily_streak_30':
        // TODO: Implement streak tracking
        return false;
      case 'speed_demon':
        // Check if any quiz was completed in under 60 seconds
        return Object.values(modules).some((m: any) => m?.bestTime && m.bestTime < 60000);
      case 'knowledge_seeker':
        return localStorage.getItem('glassprep_study_guide_read') === 'true';
      default:
        return false;
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-400 border-gray-400/30';
      case 'rare': return 'text-blue-400 border-blue-400/30';
      case 'epic': return 'text-purple-400 border-purple-400/30';
      case 'legendary': return 'text-yellow-400 border-yellow-400/30';
      default: return 'text-gray-400 border-gray-400/30';
    }
  };

  const getRarityGlow = (rarity: string) => {
    switch (rarity) {
      case 'rare': return 'shadow-blue-400/20';
      case 'epic': return 'shadow-purple-400/20';
      case 'legendary': return 'shadow-yellow-400/20';
      default: return '';
    }
  };

  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const totalAchievements = achievements.length;
  const completionPercentage = Math.round((unlockedAchievements.length / totalAchievements) * 100);

  return (
    <div className="space-y-6">
      {/* Celebration */}
      {showCelebration && newlyUnlocked.length > 0 && (
        <>
          <Confetti isActive={true} />
          <div className="fixed top-4 right-4 z-50 glass p-6 max-w-sm animate-slideInRight">
            <div className="flex items-center gap-3 mb-3">
              <Trophy className="w-8 h-8 text-yellow-400" />
              <div>
                <h3 className="font-bold text-yellow-400">Achievement Unlocked!</h3>
                <p className="text-sm text-gray-300">
                  {newlyUnlocked.length === 1 ? newlyUnlocked[0].title : `${newlyUnlocked.length} new achievements`}
                </p>
              </div>
            </div>
            {newlyUnlocked.slice(0, 3).map(achievement => {
              const IconComponent = achievement.icon;
              return (
                <div key={achievement.id} className="flex items-center gap-2 text-sm">
                  <IconComponent className="w-4 h-4" />
                  <span>{achievement.title}</span>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Achievement Progress Header */}
      <div className="glass p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <Trophy className="w-8 h-8 text-yellow-400" />
            Achievements
          </h2>
          <div className="text-right">
            <div className="text-2xl font-bold text-accent">{unlockedAchievements.length}/{totalAchievements}</div>
            <div className="text-sm text-gray-400">{completionPercentage}% Complete</div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-accent to-blue-400 transition-all duration-1000 ease-out"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
      </div>

      {/* Achievement Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {achievements.map(achievement => {
          const IconComponent = achievement.icon;
          const isUnlocked = achievement.unlocked;
          const rarityColor = getRarityColor(achievement.rarity);
          const rarityGlow = getRarityGlow(achievement.rarity);
          
          return (
            <div
              key={achievement.id}
              className={`glass p-4 transition-all duration-300 border ${rarityColor} ${
                isUnlocked 
                  ? `${rarityGlow} shadow-lg hover:scale-105` 
                  : 'opacity-60 grayscale hover:opacity-80'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${isUnlocked ? 'bg-accent/20' : 'bg-white/10'}`}>
                  <IconComponent className={`w-6 h-6 ${isUnlocked ? 'text-accent' : 'text-gray-400'}`} />
                </div>
                <div className="flex-1">
                  <h3 className={`font-semibold ${isUnlocked ? 'text-white' : 'text-gray-400'}`}>
                    {achievement.title}
                  </h3>
                  <p className="text-sm text-gray-400 mb-2">{achievement.description}</p>
                  <div className="flex items-center justify-between">
                    <span className={`text-xs px-2 py-1 rounded-full border ${rarityColor} bg-white/5`}>
                      {achievement.rarity.toUpperCase()}
                    </span>
                    {isUnlocked && achievement.unlockedDate && (
                      <span className="text-xs text-gray-500">
                        {new Date(achievement.unlockedDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}; 