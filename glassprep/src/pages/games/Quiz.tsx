import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Timer } from '../../components/Timer';
import { Confetti } from '../../components/Confetti';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import type { QuizQuestion, UserProgress, GameScore } from '../../types';
import gameContent from '../../data/content.json';

export const Quiz: React.FC = () => {
  const [userProgress, setUserProgress] = useLocalStorage<UserProgress>('glassprep_progress', {
    modules: {},
    lastLogin: new Date().toISOString(),
    totalPlayTime: 0,
  });

  // Game states
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  
  // Scoring
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [responseTimes, setResponseTimes] = useState<number[]>([]);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());

  // Initialize questions
  useEffect(() => {
    const shuffled = [...gameContent.quizzes].sort(() => Math.random() - 0.5).slice(0, 10);
    setQuestions(shuffled);
  }, []);

  const currentQuestion = questions[currentQuestionIndex];

  const handleStartGame = () => {
    setGameStarted(true);
    setIsTimerRunning(true);
    setQuestionStartTime(Date.now());
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (selectedAnswer !== null || !gameStarted) return;
    
    const responseTime = Date.now() - questionStartTime;
    setResponseTimes([...responseTimes, responseTime]);
    setSelectedAnswer(answerIndex);
    setShowExplanation(true);
    setIsTimerRunning(false);
    
    if (answerIndex === currentQuestion.answerIndex) {
      setCorrect(correct + 1);
    } else {
      setWrong(wrong + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
      setIsTimerRunning(true);
      setQuestionStartTime(Date.now());
    } else {
      endGame();
    }
  };

  const handleTimeExpire = useCallback(() => {
    if (selectedAnswer === null && gameStarted && !gameEnded) {
      setWrong(wrong + 1);
      setResponseTimes([...responseTimes, 8000]); // Max time
      setShowExplanation(true);
      setIsTimerRunning(false);
    }
  }, [selectedAnswer, gameStarted, gameEnded, wrong, responseTimes]);

  const endGame = () => {
    setGameEnded(true);
    setIsTimerRunning(false);
    
    const totalTime = responseTimes.reduce((a, b) => a + b, 0);
    const avgResponseTime = responseTimes.length > 0 ? totalTime / responseTimes.length : 0;
    const score = Math.round((correct / questions.length) * 100);
    
    // Check if won
    if (score >= 80) {
      setShowConfetti(true);
    }
    
    // Update progress
    const gameScore: GameScore = {
      correct,
      wrong,
      totalTime,
      avgResponseTime,
    };
    
    const moduleProgress = userProgress.modules.quiz || {
      moduleId: 'quiz',
      highScore: 0,
      lastPlayed: new Date().toISOString(),
      totalAttempts: 0,
      scores: [],
    };
    
    moduleProgress.highScore = Math.max(moduleProgress.highScore, score);
    moduleProgress.lastPlayed = new Date().toISOString();
    moduleProgress.totalAttempts += 1;
    moduleProgress.scores.push(gameScore);
    
    setUserProgress({
      ...userProgress,
      modules: {
        ...userProgress.modules,
        quiz: moduleProgress,
      },
    });
  };

  const getAnswerClassName = (index: number): string => {
    if (selectedAnswer === null) {
      return 'glass glass-hover cursor-pointer';
    }
    
    if (index === currentQuestion.answerIndex) {
      return 'glass border-green-500 bg-green-500/20';
    }
    
    if (index === selectedAnswer && index !== currentQuestion.answerIndex) {
      return 'glass border-red-500 bg-red-500/20';
    }
    
    return 'glass opacity-50';
  };

  if (!gameStarted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="glass p-8 max-w-2xl w-full text-center">
          <h1 className="text-4xl font-bold mb-4">🎯 Quick-Fire Quiz</h1>
          <p className="text-gray-300 mb-6">
            Test your Digital Marketing knowledge with 10 rapid-fire questions!
          </p>
          <div className="glass p-4 mb-6">
            <h3 className="font-semibold mb-2">How to Play:</h3>
            <ul className="text-left text-gray-300 space-y-1">
              <li>• Answer 10 multiple-choice questions</li>
              <li>• You have 8 seconds per question</li>
              <li>• Click an answer before time runs out</li>
              <li>• Score ≥80% to win</li>
            </ul>
          </div>
          <button onClick={handleStartGame} className="btn-primary">
            Start Quiz
          </button>
          <Link to="/" className="block mt-4 text-gray-400 hover:text-white">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (gameEnded) {
    const score = Math.round((correct / questions.length) * 100);
    const avgTime = responseTimes.length > 0 
      ? (responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length / 1000).toFixed(1)
      : '0';
    
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Confetti isActive={showConfetti} />
        <div className="glass p-8 max-w-2xl w-full text-center">
          <h1 className="text-4xl font-bold mb-4">
            {score >= 80 ? '🎉 Excellent!' : score >= 60 ? '👍 Good Job!' : '💪 Keep Practicing!'}
          </h1>
          
          <div className="text-6xl font-bold text-accent mb-6">{score}%</div>
          
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="glass p-4">
              <p className="text-2xl font-bold text-green-400">{correct}</p>
              <p className="text-gray-400">Correct</p>
            </div>
            <div className="glass p-4">
              <p className="text-2xl font-bold text-red-400">{wrong}</p>
              <p className="text-gray-400">Wrong</p>
            </div>
            <div className="glass p-4">
              <p className="text-2xl font-bold">{avgTime}s</p>
              <p className="text-gray-400">Avg Time</p>
            </div>
          </div>
          
          <div className="flex gap-4 justify-center">
            <button onClick={() => window.location.reload()} className="btn-primary">
              Play Again
            </button>
            <Link to="/" className="btn-secondary">
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 max-w-4xl mx-auto">
      {/* Header */}
      <div className="glass p-4 mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Quick-Fire Quiz</h1>
          <p className="text-gray-400">Question {currentQuestionIndex + 1} of {questions.length}</p>
        </div>
        <div className="flex items-center gap-4">
          <Timer
            duration={8}
            onExpire={handleTimeExpire}
            isRunning={isTimerRunning}
          />
          <div className="text-right">
            <p className="text-sm text-gray-400">Score</p>
            <p className="text-xl font-bold">{correct}/{currentQuestionIndex + (showExplanation ? 1 : 0)}</p>
          </div>
        </div>
      </div>

      {/* Question */}
      {currentQuestion && (
        <div className="glass p-6 mb-6">
          <h2 className="text-xl font-semibold mb-6">{currentQuestion.prompt}</h2>
          
          {/* Answer Options */}
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                disabled={selectedAnswer !== null}
                className={`w-full text-left p-4 transition-all ${getAnswerClassName(index)}`}
              >
                <span className="font-medium">{String.fromCharCode(65 + index)}.</span> {option}
              </button>
            ))}
          </div>
          
          {/* Explanation */}
          {showExplanation && (
            <div className="mt-6 p-4 glass bg-white/5">
              <p className="font-semibold mb-2">
                {selectedAnswer === currentQuestion.answerIndex ? '✅ Correct!' : '❌ Incorrect'}
              </p>
              <p className="text-gray-300">{currentQuestion.explanation}</p>
              
              <button
                onClick={handleNextQuestion}
                className="btn-primary mt-4"
              >
                {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'See Results'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}; 