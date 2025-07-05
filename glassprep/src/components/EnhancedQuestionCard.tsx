import React, { useState, useEffect } from 'react';
import { Lightbulb, BookOpen, Clock, CheckCircle, XCircle, EyeOff } from 'lucide-react';

interface EnhancedQuestionCardProps {
  question: {
    id: string;
    prompt: string;
    options: string[];
    answerIndex: number;
    explanation: string;
    difficulty?: 'easy' | 'medium' | 'hard';
    category?: string;
    tags?: string[];
    hints?: string[];
    relatedConcepts?: string[];
  };
  onAnswer: (answerIndex: number, timeSpent: number) => void;
  timeLimit?: number;
  showHints?: boolean;
  showDifficulty?: boolean;
}

export const EnhancedQuestionCard: React.FC<EnhancedQuestionCardProps> = ({
  question,
  onAnswer,
  timeLimit,
  showHints = true,
  showDifficulty = true
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [hintsUsed, setHintsUsed] = useState<number[]>([]);
  const [timeSpent, setTimeSpent] = useState(0);
  const [startTime] = useState(Date.now());
  const [showRelatedConcepts, setShowRelatedConcepts] = useState(false);

  // Timer
  useEffect(() => {
    if (showExplanation) return;
    
    const interval = setInterval(() => {
      setTimeSpent(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime, showExplanation]);

  const handleAnswerSelect = (answerIndex: number) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(answerIndex);
    setShowExplanation(true);
    onAnswer(answerIndex, timeSpent);
  };

  const useHint = (hintIndex: number) => {
    if (!hintsUsed.includes(hintIndex)) {
      setHintsUsed([...hintsUsed, hintIndex]);
    }
  };

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-400 bg-green-400/20';
      case 'medium': return 'text-yellow-400 bg-yellow-400/20';
      case 'hard': return 'text-red-400 bg-red-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const getAnswerClassName = (optionIndex: number) => {
    if (selectedAnswer === null) {
      return 'glass glass-hover cursor-pointer border border-white/30 hover:border-accent/50';
    }
    
    if (optionIndex === question.answerIndex) {
      return 'bg-green-500/20 border-green-500/50 text-green-300';
    }
    
    if (optionIndex === selectedAnswer && selectedAnswer !== question.answerIndex) {
      return 'bg-red-500/20 border-red-500/50 text-red-300';
    }
    
    return 'glass border border-white/20 opacity-60';
  };

  return (
    <div className="glass p-6 space-y-6">
      {/* Question Header */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {/* Question Meta */}
          <div className="flex items-center gap-3 mb-4">
            {showDifficulty && question.difficulty && (
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(question.difficulty)}`}>
                {question.difficulty.toUpperCase()}
              </span>
            )}
            {question.category && (
              <span className="px-2 py-1 rounded-full text-xs bg-accent/20 text-accent">
                {question.category}
              </span>
            )}
            {timeLimit && !showExplanation && (
              <div className="flex items-center gap-1 text-sm text-gray-400">
                <Clock className="w-4 h-4" />
                <span>{Math.max(0, timeLimit - timeSpent)}s</span>
              </div>
            )}
          </div>
          
          {/* Question Text */}
          <h3 className="text-xl font-semibold mb-4 leading-relaxed">
            {question.prompt}
          </h3>
        </div>
        
        {/* Question Actions */}
        <div className="flex gap-2 ml-4">
          {showHints && question.hints && question.hints.length > 0 && !showExplanation && (
            <button
              onClick={() => useHint(0)}
              className="p-2 glass glass-hover rounded-lg"
              title="Get a hint"
            >
              <Lightbulb className="w-5 h-5 text-yellow-400" />
            </button>
          )}
          {question.relatedConcepts && question.relatedConcepts.length > 0 && (
            <button
              onClick={() => setShowRelatedConcepts(!showRelatedConcepts)}
              className="p-2 glass glass-hover rounded-lg"
              title="Related concepts"
            >
              <BookOpen className="w-5 h-5 text-blue-400" />
            </button>
          )}
        </div>
      </div>

      {/* Hints Section */}
      {showHints && question.hints && hintsUsed.length > 0 && !showExplanation && (
        <div className="glass p-4 bg-yellow-500/10 border border-yellow-500/30">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="w-4 h-4 text-yellow-400" />
            <span className="font-semibold text-yellow-400">Hint</span>
          </div>
          {hintsUsed.map(hintIndex => (
            <p key={hintIndex} className="text-gray-300 text-sm">
              {question.hints![hintIndex]}
            </p>
          ))}
          {hintsUsed.length < question.hints.length && (
            <button
              onClick={() => useHint(hintsUsed.length)}
              className="mt-2 text-yellow-400 hover:text-yellow-300 text-sm underline"
            >
              Need another hint?
            </button>
          )}
        </div>
      )}

      {/* Related Concepts */}
      {showRelatedConcepts && question.relatedConcepts && (
        <div className="glass p-4 bg-blue-500/10 border border-blue-500/30">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-400" />
              <span className="font-semibold text-blue-400">Related Concepts</span>
            </div>
            <button
              onClick={() => setShowRelatedConcepts(false)}
              className="text-gray-400 hover:text-white"
            >
              <EyeOff className="w-4 h-4" />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {question.relatedConcepts.map((concept, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-white/10 text-gray-300 text-xs rounded-full"
              >
                {concept}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Answer Options */}
      <div className="space-y-3">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswerSelect(index)}
            disabled={selectedAnswer !== null}
            className={`w-full text-left p-4 rounded-xl transition-all ${getAnswerClassName(index)}`}
          >
            <div className="flex items-center gap-3">
              <span className="font-bold text-lg">
                {String.fromCharCode(65 + index)}.
              </span>
              <span className="flex-1">{option}</span>
              {selectedAnswer !== null && (
                <div className="flex-shrink-0">
                  {index === question.answerIndex ? (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  ) : index === selectedAnswer ? (
                    <XCircle className="w-5 h-5 text-red-400" />
                  ) : null}
                </div>
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Explanation */}
      {showExplanation && (
        <div className="glass p-6 bg-white/5">
          <div className="flex items-center gap-2 mb-4">
            {selectedAnswer === question.answerIndex ? (
              <>
                <CheckCircle className="w-6 h-6 text-green-400" />
                <span className="font-semibold text-green-400">Correct!</span>
              </>
            ) : (
              <>
                <XCircle className="w-6 h-6 text-red-400" />
                <span className="font-semibold text-red-400">Incorrect</span>
              </>
            )}
            <div className="ml-auto text-sm text-gray-400">
              Answered in {timeSpent}s
              {hintsUsed.length > 0 && ` • ${hintsUsed.length} hint(s) used`}
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Explanation:</h4>
              <p className="text-gray-300 leading-relaxed">{question.explanation}</p>
            </div>
            
            {/* Performance Feedback */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="text-center p-3 glass bg-white/5 rounded-lg">
                <div className={`text-lg font-bold ${selectedAnswer === question.answerIndex ? 'text-green-400' : 'text-red-400'}`}>
                  {selectedAnswer === question.answerIndex ? '100%' : '0%'}
                </div>
                <div className="text-xs text-gray-400">Accuracy</div>
              </div>
              <div className="text-center p-3 glass bg-white/5 rounded-lg">
                <div className={`text-lg font-bold ${timeSpent <= 10 ? 'text-green-400' : timeSpent <= 20 ? 'text-yellow-400' : 'text-red-400'}`}>
                  {timeSpent}s
                </div>
                <div className="text-xs text-gray-400">Time</div>
              </div>
              <div className="text-center p-3 glass bg-white/5 rounded-lg">
                <div className={`text-lg font-bold ${hintsUsed.length === 0 ? 'text-green-400' : 'text-yellow-400'}`}>
                  {hintsUsed.length}
                </div>
                <div className="text-xs text-gray-400">Hints</div>
              </div>
              <div className="text-center p-3 glass bg-white/5 rounded-lg">
                <div className="text-lg font-bold text-accent">
                  {question.difficulty === 'easy' ? '1x' : question.difficulty === 'medium' ? '2x' : '3x'}
                </div>
                <div className="text-xs text-gray-400">Difficulty</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Question Tags */}
      {question.tags && question.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-4 border-t border-white/10">
          <span className="text-sm text-gray-400">Tags:</span>
          {question.tags.map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-white/5 text-gray-400 text-xs rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}; 