import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Timer } from '../../components/Timer';
import { Confetti } from '../../components/Confetti';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import type { UserProgress, GameScore } from '../../types';
import gameContent from '../../data/content.json';

interface GamePair {
  id: string;
  metric: string;
  definition: string;
  matched: boolean;
}

export const MatchingMatrix: React.FC = () => {
  const [userProgress, setUserProgress] = useLocalStorage<UserProgress>('glassprep_progress', {
    modules: {},
    lastPlayed: new Date().toISOString(),
    totalPlayTime: 0,
  });

  // Game states
  const [pairs, setPairs] = useState<GamePair[]>([]);
  const [shuffledDefinitions, setShuffledDefinitions] = useState<string[]>([]);
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);
  const [selectedDefinition, setSelectedDefinition] = useState<string | null>(null);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [wrongMatch, setWrongMatch] = useState(false);
  
  // Tracking
  const [startTime, setStartTime] = useState(Date.now());
  const [mistakes, setMistakes] = useState(0);

  // Initialize pairs
  useEffect(() => {
    const selectedPairs = [...gameContent.matchingPairs]
      .sort(() => Math.random() - 0.5)
      .slice(0, 10)
      .map((pair, index) => ({
        id: `pair_${index}`,
        metric: pair.metric,
        definition: pair.definition,
        matched: false,
      }));
    
    setPairs(selectedPairs);
    
    // Shuffle definitions separately
    const definitions = selectedPairs.map(p => p.definition).sort(() => Math.random() - 0.5);
    setShuffledDefinitions(definitions);
  }, []);

  const handleStartGame = () => {
    setGameStarted(true);
    setIsTimerRunning(true);
    setStartTime(Date.now());
  };

  const handleMetricClick = (metric: string) => {
    if (pairs.find(p => p.metric === metric && p.matched)) return;
    
    setSelectedMetric(metric);
    setWrongMatch(false);
    
    // If definition already selected, check match
    if (selectedDefinition) {
      checkMatch(metric, selectedDefinition);
    }
  };

  const handleDefinitionClick = (definition: string) => {
    if (pairs.find(p => p.definition === definition && p.matched)) return;
    
    setSelectedDefinition(definition);
    setWrongMatch(false);
    
    // If metric already selected, check match
    if (selectedMetric) {
      checkMatch(selectedMetric, definition);
    }
  };

  const checkMatch = (metric: string, definition: string) => {
    const pair = pairs.find(p => p.metric === metric);
    
    if (pair && pair.definition === definition) {
      // Correct match!
      const updatedPairs = pairs.map(p => 
        p.metric === metric ? { ...p, matched: true } : p
      );
      setPairs(updatedPairs);
      setSelectedMetric(null);
      setSelectedDefinition(null);
      
      // Check if all matched
      if (updatedPairs.every(p => p.matched)) {
        endGame(true);
      }
    } else {
      // Wrong match
      setWrongMatch(true);
      setMistakes(mistakes + 1);
      
      // Clear selections after delay
      setTimeout(() => {
        setSelectedMetric(null);
        setSelectedDefinition(null);
        setWrongMatch(false);
      }, 1000);
    }
  };

  const handleTimeExpire = () => {
    if (gameStarted && !gameEnded) {
      endGame(false);
    }
  };

  const endGame = (won: boolean) => {
    setGameEnded(true);
    setIsTimerRunning(false);
    
    const completionTime = Date.now() - startTime;
    const matchedCount = pairs.filter(p => p.matched).length;
    const score = Math.round((matchedCount / pairs.length) * 100);
    
    if (won) {
      setShowConfetti(true);
    }
    
    // Update progress
    const gameScore: GameScore = {
      correct: matchedCount,
      wrong: mistakes,
      totalTime: completionTime,
      avgResponseTime: 0,
      completionTime: completionTime,
    };
    
    const moduleProgress = userProgress.modules.matching || {
      moduleId: 'matching',
      highScore: 0,
      lastPlayed: new Date().toISOString(),
      totalAttempts: 0,
      bestTime: undefined,
      scores: [],
    };
    
    moduleProgress.highScore = Math.max(moduleProgress.highScore, score);
    moduleProgress.lastPlayed = new Date().toISOString();
    moduleProgress.totalAttempts += 1;
    
    if (won && (!moduleProgress.bestTime || completionTime < moduleProgress.bestTime)) {
      moduleProgress.bestTime = completionTime;
    }
    
    moduleProgress.scores.push(gameScore);
    
    setUserProgress({
      ...userProgress,
      modules: {
        ...userProgress.modules,
        matching: moduleProgress,
      },
    });
  };

  if (!gameStarted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="glass p-8 max-w-2xl w-full text-center">
          <h1 className="text-4xl font-bold mb-4">🔗 Matching Matrix</h1>
          <p className="text-gray-300 mb-6">
            Match marketing metrics with their correct definitions!
          </p>
          <div className="glass p-4 mb-6">
            <h3 className="font-semibold mb-2">How to Play:</h3>
            <ul className="text-left text-gray-300 space-y-1">
              <li>• Click a metric on the left</li>
              <li>• Click its matching definition on the right</li>
              <li>• Match all pairs within 3 minutes</li>
              <li>• Wrong matches will flash red</li>
              <li>• 100% accuracy required to win</li>
            </ul>
          </div>
          <button onClick={handleStartGame} className="btn-primary">
            Start Matching
          </button>
          <Link to="/" className="block mt-4 text-gray-400 hover:text-white">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (gameEnded) {
    const matchedCount = pairs.filter(p => p.matched).length;
    const completionTime = Math.round((Date.now() - startTime) / 1000);
    const won = matchedCount === pairs.length;
    
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Confetti isActive={showConfetti} />
        <div className="glass p-8 max-w-2xl w-full text-center">
          <h1 className="text-4xl font-bold mb-4">
            {won ? '🎉 Perfect Match!' : '⏰ Time\'s Up!'}
          </h1>
          
          <div className="text-6xl font-bold text-accent mb-6">
            {matchedCount}/{pairs.length}
          </div>
          
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="glass p-4">
              <p className="text-2xl font-bold text-green-400">{matchedCount}</p>
              <p className="text-gray-400">Matched</p>
            </div>
            <div className="glass p-4">
              <p className="text-2xl font-bold text-red-400">{mistakes}</p>
              <p className="text-gray-400">Mistakes</p>
            </div>
            <div className="glass p-4">
              <p className="text-2xl font-bold">{completionTime}s</p>
              <p className="text-gray-400">Time</p>
            </div>
          </div>
          
          <div className="flex gap-4 justify-center">
            <button onClick={() => window.location.reload()} className="btn-primary">
              Try Again
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
    <div className="min-h-screen p-4 max-w-6xl mx-auto">
      {/* Header */}
      <div className="glass p-4 mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Matching Matrix</h1>
          <p className="text-gray-400">{pairs.filter(p => p.matched).length} of {pairs.length} matched</p>
        </div>
        <div className="flex items-center gap-4">
          <Timer
            duration={180} // 3 minutes
            onExpire={handleTimeExpire}
            isRunning={isTimerRunning}
          />
          <div className="text-right">
            <p className="text-sm text-gray-400">Mistakes</p>
            <p className="text-xl font-bold text-red-400">{mistakes}</p>
          </div>
        </div>
      </div>

      {/* Matching Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Metrics Column */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-center">Metrics</h3>
          <div className="space-y-3">
            {pairs.map((pair) => (
              <button
                key={pair.id}
                onClick={() => handleMetricClick(pair.metric)}
                disabled={pair.matched}
                className={`w-full p-4 text-left transition-all ${
                  pair.matched 
                    ? 'glass opacity-50 border-green-500 bg-green-500/10' 
                    : selectedMetric === pair.metric
                    ? 'glass border-accent bg-accent/20'
                    : wrongMatch && selectedMetric === pair.metric
                    ? 'glass border-red-500 bg-red-500/20 animate-shake'
                    : 'glass glass-hover'
                }`}
              >
                <span className="font-semibold">{pair.metric}</span>
                {pair.matched && <span className="ml-2 text-green-400">✓</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Definitions Column */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-center">Definitions</h3>
          <div className="space-y-3">
            {shuffledDefinitions.map((definition, index) => {
              const isMatched = pairs.find(p => p.definition === definition && p.matched);
              
              return (
                <button
                  key={`def_${index}`}
                  onClick={() => handleDefinitionClick(definition)}
                  disabled={!!isMatched}
                  className={`w-full p-4 text-left transition-all ${
                    isMatched
                      ? 'glass opacity-50 border-green-500 bg-green-500/10' 
                      : selectedDefinition === definition
                      ? 'glass border-accent bg-accent/20'
                      : wrongMatch && selectedDefinition === definition
                      ? 'glass border-red-500 bg-red-500/20 animate-shake'
                      : 'glass glass-hover'
                  }`}
                >
                  <span className="text-sm">{definition}</span>
                  {isMatched && <span className="ml-2 text-green-400">✓</span>}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Instructions */}
      {!selectedMetric && !selectedDefinition && (
        <p className="text-center text-gray-400 mt-6">
          Click a metric, then click its matching definition
        </p>
      )}
      {selectedMetric && !selectedDefinition && (
        <p className="text-center text-accent mt-6">
          Now select the matching definition for: <strong>{selectedMetric}</strong>
        </p>
      )}
      {!selectedMetric && selectedDefinition && (
        <p className="text-center text-accent mt-6">
          Now select the matching metric for this definition
        </p>
      )}
    </div>
  );
}; 