import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Timer } from '../../components/Timer';
import { Confetti } from '../../components/Confetti';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import type { Acronym, UserProgress, GameScore } from '../../types';
import gameContent from '../../data/content.json';

export const AcronymSprint: React.FC = () => {
  const [userProgress, setUserProgress] = useLocalStorage<UserProgress>('glassprep_progress', {
    modules: {},
    lastPlayed: new Date().toISOString(),
    totalPlayTime: 0,
  });

  // Game states
  const [acronyms, setAcronyms] = useState<Acronym[]>([]);
  const [currentAcronym, setCurrentAcronym] = useState<Acronym | null>(null);
  const [userInput, setUserInput] = useState('');
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showFeedback, setShowFeedback] = useState<'correct' | 'wrong' | null>(null);
  
  // Scoring
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [startTime] = useState(Date.now());

  // Initialize acronyms
  useEffect(() => {
    const shuffled = [...gameContent.acronyms].sort(() => Math.random() - 0.5);
    setAcronyms(shuffled);
  }, []);

  const handleStartGame = () => {
    setGameStarted(true);
    setIsTimerRunning(true);
    nextAcronym([...gameContent.acronyms].sort(() => Math.random() - 0.5));
  };

  const nextAcronym = (remainingAcronyms: Acronym[]) => {
    if (remainingAcronyms.length > 0) {
      setCurrentAcronym(remainingAcronyms[0]);
      setAcronyms(remainingAcronyms.slice(1));
      setUserInput('');
      setShowFeedback(null);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentAcronym || userInput.trim() === '') return;
    
    const normalizedInput = userInput.trim().toLowerCase().replace(/[^a-z0-9\s]/g, '');
    const normalizedAnswer = currentAcronym.expansion.toLowerCase().replace(/[^a-z0-9\s]/g, '');
    
    if (normalizedInput === normalizedAnswer) {
      // Correct!
      setCorrectCount(correctCount + 1);
      setStreak(streak + 1);
      setMaxStreak(Math.max(maxStreak, streak + 1));
      setShowFeedback('correct');
      
      // Check win condition
      if (correctCount + 1 >= 15) {
        endGame(true);
        return;
      }
    } else {
      // Wrong
      setWrongCount(wrongCount + 1);
      setStreak(0);
      setShowFeedback('wrong');
    }
    
    // Move to next after delay
    setTimeout(() => {
      nextAcronym(acronyms);
    }, 1000);
  };

  const handleSkip = () => {
    setWrongCount(wrongCount + 1);
    setStreak(0);
    setShowFeedback('wrong');
    
    setTimeout(() => {
      nextAcronym(acronyms);
    }, 1000);
  };

  const endGame = useCallback((won: boolean) => {
    setGameEnded(true);
    setIsTimerRunning(false);
    
    if (won) {
      setShowConfetti(true);
    }
    
    const totalAttempts = correctCount + wrongCount;
    const accuracy = totalAttempts > 0 ? Math.round((correctCount / totalAttempts) * 100) : 0;
    
    // Update progress
    const gameScore: GameScore = {
      correct: correctCount,
      wrong: wrongCount,
      totalTime: Date.now() - startTime,
      avgResponseTime: 0,
      streak: maxStreak,
    };
    
    const moduleProgress = userProgress.modules.acronym || {
      moduleId: 'acronym',
      highScore: 0,
      lastPlayed: new Date().toISOString(),
      totalAttempts: 0,
      scores: [],
    };
    
    moduleProgress.highScore = Math.max(moduleProgress.highScore, accuracy);
    moduleProgress.lastPlayed = new Date().toISOString();
    moduleProgress.totalAttempts += 1;
    moduleProgress.scores.push(gameScore);
    
    setUserProgress({
      ...userProgress,
      modules: {
        ...userProgress.modules,
        acronym: moduleProgress,
      },
    });
  }, [correctCount, wrongCount, startTime, maxStreak, userProgress, setUserProgress]);

  const handleTimeExpire = useCallback(() => {
    if (gameStarted && !gameEnded) {
      endGame(false);
    }
  }, [gameStarted, gameEnded, endGame]);

  if (!gameStarted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="glass p-8 max-w-2xl w-full text-center">
          <h1 className="text-4xl font-bold mb-4">⚡ Acronym Sprint</h1>
          <p className="text-gray-300 mb-6">
            Expand marketing acronyms at lightning speed!
          </p>
          <div className="glass p-4 mb-6">
            <h3 className="font-semibold mb-2">How to Play:</h3>
            <ul className="text-left text-gray-300 space-y-1">
              <li>• Type the full expansion of each acronym</li>
              <li>• Get 15 correct within 90 seconds</li>
              <li>• Build streaks for momentum</li>
              <li>• Skip if stuck (counts as wrong)</li>
              <li>• Case and punctuation don't matter</li>
            </ul>
          </div>
          <button onClick={handleStartGame} className="btn-primary">
            Start Sprint
          </button>
          <Link to="/" className="block mt-4 text-gray-400 hover:text-white">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (gameEnded) {
    const totalAttempts = correctCount + wrongCount;
    const accuracy = totalAttempts > 0 ? Math.round((correctCount / totalAttempts) * 100) : 0;
    const won = correctCount >= 15;
    
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Confetti isActive={showConfetti} />
        <div className="glass p-8 max-w-2xl w-full text-center">
          <h1 className="text-4xl font-bold mb-4">
            {won ? '🎉 Sprint Master!' : '⏰ Time\'s Up!'}
          </h1>
          
          <div className="text-6xl font-bold text-accent mb-6">{correctCount}/15</div>
          
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="glass p-4">
              <p className="text-2xl font-bold text-green-400">{correctCount}</p>
              <p className="text-gray-400">Correct</p>
            </div>
            <div className="glass p-4">
              <p className="text-2xl font-bold">{accuracy}%</p>
              <p className="text-gray-400">Accuracy</p>
            </div>
            <div className="glass p-4">
              <p className="text-2xl font-bold text-yellow-400">{maxStreak}</p>
              <p className="text-gray-400">Best Streak</p>
            </div>
          </div>
          
          <div className="flex gap-4 justify-center">
            <button onClick={() => window.location.reload()} className="btn-primary">
              Sprint Again
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
          <h1 className="text-2xl font-bold">Acronym Sprint</h1>
          <p className="text-gray-400">Expand acronyms quickly!</p>
        </div>
        <div className="flex items-center gap-4">
          <Timer
            duration={90}
            onExpire={handleTimeExpire}
            isRunning={isTimerRunning}
          />
          <div className="text-center">
            <p className="text-sm text-gray-400">Progress</p>
            <p className="text-xl font-bold">{correctCount}/15</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-400">Streak</p>
            <p className="text-xl font-bold text-yellow-400">{streak}</p>
          </div>
        </div>
      </div>

      {/* Game Area */}
      {currentAcronym && (
        <div className="glass p-8">
          <div className="text-center mb-8">
            <h2 className="text-6xl font-bold mb-4">{currentAcronym.acronym}</h2>
            
            {/* Feedback */}
            {showFeedback && (
              <div className={`mb-4 ${showFeedback === 'correct' ? 'text-green-400' : 'text-red-400'}`}>
                {showFeedback === 'correct' ? (
                  <p className="text-xl font-semibold">✅ Correct!</p>
                ) : (
                  <div>
                    <p className="text-xl font-semibold">❌ Wrong!</p>
                    <p className="text-sm mt-1">Answer: {currentAcronym.expansion}</p>
                  </div>
                )}
              </div>
            )}
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">What does it stand for?</label>
              <input
                type="text"
                value={userInput}
                onChange={handleInputChange}
                placeholder="Type the full expansion..."
                className="w-full p-4 glass bg-white/5 text-white text-xl text-center focus:outline-none focus:border-accent"
                autoFocus
                disabled={showFeedback !== null}
              />
            </div>
            
            <div className="flex gap-4 justify-center">
              <button
                type="button"
                onClick={handleSkip}
                className="btn-secondary"
                disabled={showFeedback !== null}
              >
                Skip
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={userInput.trim() === '' || showFeedback !== null}
              >
                Submit
              </button>
            </div>
          </form>
          
          <div className="mt-8 flex justify-center gap-2">
            {[...Array(15)].map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all ${
                  index < correctCount
                    ? 'bg-green-400'
                    : 'bg-gray-600'
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}; 