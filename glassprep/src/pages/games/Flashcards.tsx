import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Confetti } from '../../components/Confetti';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import type { Flashcard, UserProgress, GameScore } from '../../types';
import gameContent from '../../data/content.json';

export const Flashcards: React.FC = () => {
  const [userProgress, setUserProgress] = useLocalStorage<UserProgress>('glassprep_progress', {
    modules: {},
    lastPlayed: new Date().toISOString(),
    totalPlayTime: 0,
  });

  // Game states
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  
  // Tracking
  const [cycleNumber, setCycleNumber] = useState(1);
  const [cardAttempts, setCardAttempts] = useState<Record<string, { gotIt: number; missed: number }>>({});
  const [currentCycleResults, setCurrentCycleResults] = useState<Record<string, boolean>>({});
  const [startTime] = useState(Date.now());

  // Initialize cards
  useEffect(() => {
    const shuffled = [...gameContent.flashcards].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    
    // Initialize tracking for each card
    const initialAttempts: Record<string, { gotIt: number; missed: number }> = {};
    shuffled.forEach(card => {
      initialAttempts[card.id] = { gotIt: 0, missed: 0 };
    });
    setCardAttempts(initialAttempts);
  }, []);

  const currentCard = cards[currentCardIndex];

  const handleStartGame = () => {
    setGameStarted(true);
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleResponse = (gotIt: boolean) => {
    if (!currentCard) return;
    
    // Update attempts
    const newAttempts = { ...cardAttempts };
    if (gotIt) {
      newAttempts[currentCard.id].gotIt += 1;
    } else {
      newAttempts[currentCard.id].missed += 1;
    }
    setCardAttempts(newAttempts);
    
    // Update current cycle results
    setCurrentCycleResults({
      ...currentCycleResults,
      [currentCard.id]: gotIt,
    });
    
    // Move to next card
    if (currentCardIndex < cards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setIsFlipped(false);
    } else {
      // End of cycle
      checkCycleComplete();
    }
  };

  const checkCycleComplete = () => {
    const gotItCount = Object.values(currentCycleResults).filter(v => v).length;
    const successRate = (gotItCount / cards.length) * 100;
    
    if (cycleNumber >= 2 && successRate >= 90) {
      // Win condition met!
      endGame(true);
    } else if (cycleNumber < 2) {
      // Start next cycle
      setCycleNumber(cycleNumber + 1);
      setCurrentCardIndex(0);
      setIsFlipped(false);
      setCurrentCycleResults({});
      
      // Shuffle cards for next cycle
      const shuffled = [...cards].sort(() => Math.random() - 0.5);
      setCards(shuffled);
    } else {
      // Failed after 2 cycles
      endGame(false);
    }
  };

  const endGame = (won: boolean) => {
    setGameEnded(true);
    
    if (won) {
      setShowConfetti(true);
    }
    
    // Calculate score
    const totalGotIt = Object.values(cardAttempts).reduce((sum, attempts) => sum + attempts.gotIt, 0);
    const totalAttempts = Object.values(cardAttempts).reduce((sum, attempts) => sum + attempts.gotIt + attempts.missed, 0);
    const score = totalAttempts > 0 ? Math.round((totalGotIt / totalAttempts) * 100) : 0;
    
    // Update progress
    const gameScore: GameScore = {
      correct: totalGotIt,
      wrong: totalAttempts - totalGotIt,
      totalTime: Date.now() - startTime,
      avgResponseTime: 0,
      attempts: totalAttempts,
    };
    
    const moduleProgress = userProgress.modules.flashcards || {
      moduleId: 'flashcards',
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
        flashcards: moduleProgress,
      },
    });
  };

  const getProgress = (): number => {
    const total = cards.length * 2; // 2 cycles
    const completed = (cycleNumber - 1) * cards.length + currentCardIndex;
    return Math.round((completed / total) * 100);
  };

  if (!gameStarted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="glass p-8 max-w-2xl w-full text-center">
          <h1 className="text-4xl font-bold mb-4">📇 Flashcards</h1>
          <p className="text-gray-300 mb-6">
            Master Digital Marketing terms through spaced repetition!
          </p>
          <div className="glass p-4 mb-6">
            <h3 className="font-semibold mb-2">How to Play:</h3>
            <ul className="text-left text-gray-300 space-y-1">
              <li>• Click cards to flip between term and definition</li>
              <li>• Self-report: "Got it" or "Missed it"</li>
              <li>• Complete 2 full cycles</li>
              <li>• Achieve 90% "Got it" rate to win</li>
              <li>• Cards are shuffled each cycle</li>
            </ul>
          </div>
          <button onClick={handleStartGame} className="btn-primary">
            Start Flashcards
          </button>
          <Link to="/" className="block mt-4 text-gray-400 hover:text-white">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (gameEnded) {
    const totalGotIt = Object.values(cardAttempts).reduce((sum, attempts) => sum + attempts.gotIt, 0);
    const totalAttempts = Object.values(cardAttempts).reduce((sum, attempts) => sum + attempts.gotIt + attempts.missed, 0);
    const score = totalAttempts > 0 ? Math.round((totalGotIt / totalAttempts) * 100) : 0;
    const timeSpent = Math.round((Date.now() - startTime) / 1000);
    
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Confetti isActive={showConfetti} />
        <div className="glass p-8 max-w-2xl w-full text-center">
          <h1 className="text-4xl font-bold mb-4">
            {score >= 90 ? '🎉 Mastered!' : score >= 70 ? '👍 Good Progress!' : '💪 Keep Studying!'}
          </h1>
          
          <div className="text-6xl font-bold text-accent mb-6">{score}%</div>
          
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="glass p-4">
              <p className="text-2xl font-bold text-green-400">{totalGotIt}</p>
              <p className="text-gray-400">Got It</p>
            </div>
            <div className="glass p-4">
              <p className="text-2xl font-bold text-red-400">{totalAttempts - totalGotIt}</p>
              <p className="text-gray-400">Missed</p>
            </div>
            <div className="glass p-4">
              <p className="text-2xl font-bold">{timeSpent}s</p>
              <p className="text-gray-400">Time</p>
            </div>
          </div>
          
          <div className="flex gap-4 justify-center">
            <button onClick={() => window.location.reload()} className="btn-primary">
              Practice Again
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
      <div className="glass p-4 mb-6">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold">Flashcards</h1>
          <div className="text-right">
            <p className="text-sm text-gray-400">Cycle {cycleNumber} of 2</p>
            <p className="text-xl font-bold">{currentCardIndex + 1}/{cards.length}</p>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div 
            className="bg-accent h-2 rounded-full transition-all duration-500"
            style={{ width: `${getProgress()}%` }}
          />
        </div>
      </div>

      {/* Flashcard */}
      {currentCard && (
        <div className="flex flex-col items-center">
          <div
            onClick={handleFlip}
            className="relative w-full max-w-2xl h-80 cursor-pointer preserve-3d"
            style={{
              transformStyle: 'preserve-3d',
              transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0)',
              transition: 'transform 0.6s',
            }}
          >
            {/* Front of card (Term) */}
            <div 
              className="absolute inset-0 glass glass-hover p-8 flex items-center justify-center backface-hidden"
              style={{ backfaceVisibility: 'hidden' }}
            >
              <div className="text-center">
                <p className="text-sm text-gray-400 mb-2">Term</p>
                <h2 className="text-3xl font-bold">{currentCard.term}</h2>
                <p className="text-gray-400 mt-4">Click to flip</p>
              </div>
            </div>
            
            {/* Back of card (Definition) */}
            <div 
              className="absolute inset-0 glass glass-hover p-8 flex items-center justify-center backface-hidden"
              style={{ 
                backfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)'
              }}
            >
              <div className="text-center">
                <p className="text-sm text-gray-400 mb-2">Definition</p>
                <p className="text-xl">{currentCard.definition}</p>
              </div>
            </div>
          </div>
          
          {/* Response Buttons */}
          <div className="flex gap-4 mt-8">
            <button
              onClick={() => handleResponse(false)}
              className="btn-secondary flex items-center gap-2"
              disabled={!isFlipped}
            >
              ❌ Missed It
            </button>
            <button
              onClick={() => handleResponse(true)}
              className="btn-primary flex items-center gap-2"
              disabled={!isFlipped}
            >
              ✅ Got It!
            </button>
          </div>
          
          {!isFlipped && (
            <p className="text-gray-400 text-sm mt-4">
              Click the card to see the definition
            </p>
          )}
        </div>
      )}
    </div>
  );
}; 