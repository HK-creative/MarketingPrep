import React, { useState, useMemo } from 'react';
import { BarChart3, TrendingUp, Clock, Target, Brain, Calendar, Award, Lightbulb } from 'lucide-react';
import type { UserProgress } from '../types';

interface AnalyticsDashboardProps {
  userProgress: UserProgress;
}

interface LearningInsight {
  id: string;
  title: string;
  description: string;
  type: 'strength' | 'improvement' | 'recommendation';
  icon: React.ComponentType<any>;
  priority: 'high' | 'medium' | 'low';
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ userProgress }) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'week' | 'month' | 'all'>('month');

  // Calculate comprehensive analytics
  const analytics = useMemo(() => {
    const modules = userProgress.modules || {};
    const moduleEntries = Object.entries(modules);
    
    // Performance metrics
    const totalAttempts = moduleEntries.reduce((sum, [_, progress]) => sum + (progress?.totalAttempts || 0), 0);
    const completedModules = moduleEntries.filter(([_, progress]) => progress?.highScore >= 80).length;
    const averageScore = moduleEntries.length > 0
      ? Math.round(moduleEntries.reduce((sum, [_, progress]) => sum + (progress?.highScore || 0), 0) / moduleEntries.length)
      : 0;
    
    // Time-based analytics (using bestTime as proxy for session time)
    const totalTimeSpent = moduleEntries.reduce((sum, [_, progress]) => sum + (progress?.bestTime || 0), 0);
    const averageSessionTime = totalAttempts > 0 ? Math.round(totalTimeSpent / totalAttempts / 60000) : 0; // minutes
    
    // Difficulty analysis
    const strongModules = moduleEntries.filter(([_, progress]) => progress?.highScore >= 90);
    const weakModules = moduleEntries.filter(([_, progress]) => progress && progress.highScore < 70);
    
    // Learning velocity
    const recentAttempts = moduleEntries.filter(([_, progress]) => {
      if (!progress?.lastPlayed) return false;
      const lastPlayed = new Date(progress.lastPlayed);
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      return lastPlayed > weekAgo;
    }).length;
    
    // Consistency score (based on regular practice)
    const practiceFrequency = recentAttempts / 7; // attempts per day
    const consistencyScore = Math.min(Math.round(practiceFrequency * 100), 100);
    
    return {
      totalAttempts,
      completedModules,
      averageScore,
      totalTimeSpent,
      averageSessionTime,
      strongModules,
      weakModules,
      recentAttempts,
      consistencyScore,
      practiceFrequency
    };
  }, [userProgress]);

  // Generate personalized insights
  const insights = useMemo((): LearningInsight[] => {
    const insights: LearningInsight[] = [];

    // Strength insights
    if (analytics.strongModules.length > 0) {
      insights.push({
        id: 'strong-areas',
        title: 'Strong Performance Areas',
        description: `You excel in ${analytics.strongModules.length} module(s) with 90%+ scores. Great job maintaining high standards!`,
        type: 'strength',
        icon: Award,
        priority: 'medium'
      });
    }

    // Improvement areas
    if (analytics.weakModules.length > 0) {
      insights.push({
        id: 'improvement-areas',
        title: 'Focus Areas for Improvement',
        description: `${analytics.weakModules.length} module(s) need attention. Consider reviewing fundamentals and practicing more frequently.`,
        type: 'improvement',
        icon: Target,
        priority: 'high'
      });
    }

    // Consistency recommendations
    if (analytics.consistencyScore < 50) {
      insights.push({
        id: 'consistency',
        title: 'Build Study Consistency',
        description: 'Regular practice improves retention. Aim for 15-20 minutes daily across different modules.',
        type: 'recommendation',
        icon: Calendar,
        priority: 'high'
      });
    }

    // Session length optimization
    if (analytics.averageSessionTime < 5) {
      insights.push({
        id: 'session-length',
        title: 'Extend Practice Sessions',
        description: 'Longer focused sessions (10-15 minutes) can improve learning outcomes and knowledge retention.',
        type: 'recommendation',
        icon: Clock,
        priority: 'medium'
      });
    } else if (analytics.averageSessionTime > 30) {
      insights.push({
        id: 'session-breaks',
        title: 'Consider Shorter Sessions',
        description: 'Break long sessions into smaller chunks to maintain focus and prevent mental fatigue.',
        type: 'recommendation',
        icon: Brain,
        priority: 'medium'
      });
    }

    // Progress recognition
    if (analytics.averageScore >= 80) {
      insights.push({
        id: 'interview-ready',
        title: 'Interview Ready!',
        description: 'Your performance indicates strong interview readiness. Keep practicing to maintain your edge.',
        type: 'strength',
        icon: TrendingUp,
        priority: 'low'
      });
    }

    return insights.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }, [analytics]);

  const getInsightColor = (type: LearningInsight['type']) => {
    switch (type) {
      case 'strength': return 'border-green-400/30 bg-green-400/10';
      case 'improvement': return 'border-red-400/30 bg-red-400/10';
      case 'recommendation': return 'border-blue-400/30 bg-blue-400/10';
    }
  };

  const getInsightIcon = (type: LearningInsight['type']) => {
    switch (type) {
      case 'strength': return '🎉';
      case 'improvement': return '🎯';
      case 'recommendation': return '💡';
    }
  };

  return (
    <div className="space-y-6">
      {/* Analytics Header */}
      <div className="glass p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-accent" />
            Learning Analytics
          </h2>
          <div className="flex gap-2">
            {(['week', 'month', 'all'] as const).map((timeframe) => (
              <button
                key={timeframe}
                onClick={() => setSelectedTimeframe(timeframe)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                  selectedTimeframe === timeframe
                    ? 'bg-accent text-white'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                {timeframe.charAt(0).toUpperCase() + timeframe.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="glass p-4 bg-white/5 text-center">
            <div className="text-2xl font-bold text-accent">{analytics.averageScore}%</div>
            <div className="text-sm text-gray-400">Average Score</div>
          </div>
          <div className="glass p-4 bg-white/5 text-center">
            <div className="text-2xl font-bold text-accent">{analytics.completedModules}/8</div>
            <div className="text-sm text-gray-400">Modules Complete</div>
          </div>
          <div className="glass p-4 bg-white/5 text-center">
            <div className="text-2xl font-bold text-accent">{analytics.totalAttempts}</div>
            <div className="text-sm text-gray-400">Total Attempts</div>
          </div>
          <div className="glass p-4 bg-white/5 text-center">
            <div className="text-2xl font-bold text-accent">{analytics.averageSessionTime}m</div>
            <div className="text-sm text-gray-400">Avg Session</div>
          </div>
        </div>
      </div>

      {/* Performance Trends */}
      <div className="glass p-6">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-accent" />
          Performance Trends
        </h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Consistency Score */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-medium">Practice Consistency</span>
              <span className="text-accent font-bold">{analytics.consistencyScore}%</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-3">
              <div 
                className="h-full bg-gradient-to-r from-accent to-blue-400 rounded-full transition-all duration-1000"
                style={{ width: `${analytics.consistencyScore}%` }}
              />
            </div>
            <p className="text-sm text-gray-400">
              {analytics.practiceFrequency.toFixed(1)} sessions per day this week
            </p>
          </div>

          {/* Learning Velocity */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-medium">Learning Velocity</span>
              <span className="text-accent font-bold">{analytics.recentAttempts}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-400">
                {analytics.recentAttempts} attempts in the last 7 days
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Personalized Insights */}
      <div className="glass p-6">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Lightbulb className="w-6 h-6 text-accent" />
          Personalized Insights
        </h3>
        
        {insights.length > 0 ? (
          <div className="space-y-4">
            {insights.map((insight) => {
              const IconComponent = insight.icon;
              return (
                <div
                  key={insight.id}
                  className={`glass p-4 border ${getInsightColor(insight.type)}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                        <IconComponent className="w-5 h-5" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">{getInsightIcon(insight.type)}</span>
                        <h4 className="font-semibold">{insight.title}</h4>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          insight.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                          insight.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-gray-500/20 text-gray-400'
                        }`}>
                          {insight.priority.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-gray-300 text-sm">{insight.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400">
            <Brain className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Complete more modules to unlock personalized insights!</p>
          </div>
        )}
      </div>

      {/* Study Recommendations */}
      <div className="glass p-6">
        <h3 className="text-xl font-semibold mb-4">Recommended Study Plan</h3>
        
        <div className="space-y-3">
          {analytics.weakModules.length > 0 && (
            <div className="flex items-center gap-3 p-3 glass bg-red-500/10 border border-red-500/30 rounded-lg">
              <Target className="w-5 h-5 text-red-400" />
              <div>
                <p className="font-medium">Priority Focus</p>
                <p className="text-sm text-gray-300">
                  Spend 70% of study time on modules scoring below 70%
                </p>
              </div>
            </div>
          )}
          
          <div className="flex items-center gap-3 p-3 glass bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <Clock className="w-5 h-5 text-blue-400" />
            <div>
              <p className="font-medium">Optimal Schedule</p>
              <p className="text-sm text-gray-300">
                15-20 minutes daily, rotating between different modules
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 glass bg-green-500/10 border border-green-500/30 rounded-lg">
            <Award className="w-5 h-5 text-green-400" />
            <div>
              <p className="font-medium">Maintenance Review</p>
              <p className="text-sm text-gray-300">
                Review strong areas weekly to maintain high performance
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 