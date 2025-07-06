import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, X, Play, Target, BookOpen, Trophy, Zap } from 'lucide-react';

interface OnboardingProps {
  isVisible: boolean;
  onComplete: () => void;
  onSkip: () => void;
}

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  animation: string;
  tips: string[];
}

const onboardingSteps: OnboardingStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to GlassPrep! 🚀',
    description: 'Your personal Digital Marketing interview preparation companion. Master essential skills through interactive games and build confidence for your next interview.',
    icon: Trophy,
    animation: 'animate-bounce-subtle',
    tips: [
      'Complete all 8 game modules to maximize readiness',
      'Aim for 80%+ scores to unlock "Interview Ready" status',
      'Practice regularly for best retention results'
    ]
  },
  {
    id: 'dashboard',
    title: 'Your Command Center 📊',
    description: 'Track your progress with the circular progress ring and monitor completion status across all modules. The dashboard shows your interview readiness at a glance.',
    icon: Target,
    animation: 'animate-pulse-glow',
    tips: [
      'Green status = Interview Ready (80%+ overall)',
      'Yellow status = Getting There (50-79%)',
      'Red status = Keep Practicing (below 50%)'
    ]
  },
  {
    id: 'games',
    title: 'Interactive Learning Games 🎮',
    description: 'Each game targets specific interview skills: Quick-Fire Quiz for knowledge recall, Case Builder for structured thinking, and more. Complete them in any order.',
    icon: Play,
    animation: 'animate-fadeInUp',
    tips: [
      'Start with Quiz to build foundational knowledge',
      'Use Flashcards for memorization',
      'Practice Case Builder for real interview scenarios'
    ]
  },
  {
    id: 'study-guide',
    title: 'Comprehensive Study Materials 📚',
    description: 'Access detailed study guides, practice questions, and interview tips. Use the STAR method framework and review industry trends.',
    icon: BookOpen,
    animation: 'animate-fadeInUp',
    tips: [
      'Review study guide before playing games',
      'Practice STAR method for behavioral questions',
      'Stay updated with latest marketing trends'
    ]
  },
  {
    id: 'ready',
    title: 'You\'re All Set! ⚡',
    description: 'Start with any game that interests you. Remember: consistent practice builds confidence. Good luck with your interview preparation!',
    icon: Zap,
    animation: 'animate-pulse',
    tips: [
      'Set a daily practice goal (15-30 minutes)',
      'Focus on weak areas identified in progress',
      'Review explanations carefully after each game'
    ]
  }
];

export const Onboarding: React.FC<OnboardingProps> = ({ isVisible, onComplete, onSkip }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const currentStepData = onboardingSteps[currentStep];
  const IconComponent = currentStepData.icon;

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep(currentStep + 1);
        setIsAnimating(false);
      }, 300);
    } else {
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep(currentStep - 1);
        setIsAnimating(false);
      }, 300);
    }
  };

  const handleStepClick = (stepIndex: number) => {
    if (stepIndex !== currentStep) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep(stepIndex);
        setIsAnimating(false);
      }, 300);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="glass max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/20">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold">Getting Started</h2>
            <div className="flex items-center gap-1">
              {onboardingSteps.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleStepClick(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentStep
                      ? 'bg-accent scale-125'
                      : index < currentStep
                      ? 'bg-accent/60'
                      : 'bg-white/30'
                  }`}
                />
              ))}
            </div>
          </div>
          <button
            onClick={onSkip}
            className="text-gray-400 hover:text-white transition-colors p-2"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8">
          <div className={`transition-all duration-300 ${isAnimating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
            {/* Icon */}
            <div className={`flex justify-center mb-6 ${currentStepData.animation}`}>
              <div className="w-20 h-20 glass flex items-center justify-center">
                <IconComponent className="w-10 h-10 text-accent" />
              </div>
            </div>

            {/* Title & Description */}
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold mb-4">{currentStepData.title}</h3>
              <p className="text-gray-300 text-lg leading-relaxed max-w-2xl mx-auto">
                {currentStepData.description}
              </p>
            </div>

            {/* Tips */}
            <div className="glass p-6 bg-white/5 mb-8">
              <h4 className="font-semibold mb-4 text-accent">💡 Pro Tips:</h4>
              <ul className="space-y-2">
                {currentStepData.tips.map((tip, index) => (
                  <li key={index} className="flex items-start gap-3 text-gray-300">
                    <span className="text-accent mt-1">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-white/20">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              currentStep === 0
                ? 'text-gray-500 cursor-not-allowed'
                : 'btn-secondary hover:scale-105'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>

          <div className="flex gap-4">
            <button
              onClick={onSkip}
              className="px-6 py-2 text-gray-400 hover:text-white transition-colors"
            >
              Skip Tutorial
            </button>
            <button
              onClick={handleNext}
              className="btn-primary flex items-center gap-2"
            >
              {currentStep === onboardingSteps.length - 1 ? 'Get Started' : 'Next'}
              {currentStep < onboardingSteps.length - 1 && <ChevronRight className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}; 