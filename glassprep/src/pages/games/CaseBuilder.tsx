import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Timer } from '../../components/Timer';
import { Confetti } from '../../components/Confetti';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import type { CaseStudy, UserProgress, GameScore } from '../../types';
import gameContent from '../../data/content.json';

export const CaseBuilder: React.FC = () => {
  const [userProgress, setUserProgress] = useLocalStorage<UserProgress>('glassprep_progress', {
    modules: {},
    lastPlayed: new Date().toISOString(),
    totalPlayTime: 0,
  });

  // Game states
  const [cases, setCases] = useState<CaseStudy[]>([]);
  const [currentCaseIndex, setCurrentCaseIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [selfScore, setSelfScore] = useState<number | null>(null);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showGuidance, setShowGuidance] = useState(false);
  
  // Tracking
  const [selfScores, setSelfScores] = useState<number[]>([]);
  const [startTime] = useState(Date.now());
  const [timeExpired, setTimeExpired] = useState(false);

  // Initialize cases
  useEffect(() => {
    const selectedCases = [...gameContent.cases].sort(() => Math.random() - 0.5).slice(0, 5);
    setCases(selectedCases);
  }, []);

  const currentCase = cases[currentCaseIndex];

  const handleStartGame = () => {
    setGameStarted(true);
    setIsTimerRunning(true);
  };

  const handleAnswerChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUserAnswer(e.target.value);
  };

  const handleSubmitAnswer = () => {
    setIsTimerRunning(false);
    setShowGuidance(true);
  };

  const handleSelfGrade = (score: number) => {
    setSelfScore(score);
    setSelfScores([...selfScores, score]);
    
    // Check win condition
    const highScores = [...selfScores, score].filter(s => s >= 4).length;
    if (highScores >= 3) {
      endGame(true);
    } else if (currentCaseIndex < cases.length - 1) {
      // Move to next case
      setTimeout(() => {
        setCurrentCaseIndex(currentCaseIndex + 1);
        setUserAnswer('');
        setSelfScore(null);
        setShowGuidance(false);
        setTimeExpired(false);
        setIsTimerRunning(true);
      }, 1500);
    } else {
      endGame(false);
    }
  };

  const handleTimeExpire = () => {
    if (!showGuidance && gameStarted && !gameEnded) {
      setTimeExpired(true);
      setIsTimerRunning(false);
      setShowGuidance(true);
    }
  };

  const endGame = (won: boolean) => {
    setGameEnded(true);
    setIsTimerRunning(false);
    
    if (won) {
      setShowConfetti(true);
    }
    
    // Calculate average score
    const avgScore = selfScores.length > 0 
      ? selfScores.reduce((a, b) => a + b, 0) / selfScores.length 
      : 0;
    const score = Math.round(avgScore * 20); // Convert 1-5 scale to percentage
    
    // Update progress
    const gameScore: GameScore = {
      correct: selfScores.filter(s => s >= 4).length,
      wrong: selfScores.filter(s => s < 4).length,
      totalTime: Date.now() - startTime,
      avgResponseTime: 0,
      selfScores: selfScores,
    };
    
    const moduleProgress = userProgress.modules.case || {
      moduleId: 'case',
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
        case: moduleProgress,
      },
    });
  };

  if (!gameStarted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="glass p-8 max-w-2xl w-full text-center">
          <h1 className="text-4xl font-bold mb-4">📝 Case Builder</h1>
          <p className="text-gray-300 mb-6">
            Practice structured thinking with real-world marketing scenarios!
          </p>
          <div className="glass p-4 mb-6">
            <h3 className="font-semibold mb-2">How to Play:</h3>
            <ul className="text-left text-gray-300 space-y-1">
              <li>• Read marketing scenarios carefully</li>
              <li>• Write structured responses (5 min soft timer)</li>
              <li>• Self-grade your answer 1-5</li>
              <li>• Score ≥4 on 3 cases to win</li>
              <li>• Focus on structured, actionable solutions</li>
            </ul>
          </div>
          <button onClick={handleStartGame} className="btn-primary">
            Start Cases
          </button>
          <Link to="/" className="block mt-4 text-gray-400 hover:text-white">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (gameEnded) {
    const avgScore = selfScores.length > 0 
      ? selfScores.reduce((a, b) => a + b, 0) / selfScores.length 
      : 0;
    const highScores = selfScores.filter(s => s >= 4).length;
    
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Confetti isActive={showConfetti} />
        <div className="glass p-8 max-w-2xl w-full text-center">
          <h1 className="text-4xl font-bold mb-4">
            {highScores >= 3 ? '🎉 Case Master!' : '💪 Keep Practicing!'}
          </h1>
          
          <div className="text-6xl font-bold text-accent mb-6">
            {avgScore.toFixed(1)}/5.0
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="glass p-4">
              <p className="text-2xl font-bold text-green-400">{highScores}</p>
              <p className="text-gray-400">High Scores (≥4)</p>
            </div>
            <div className="glass p-4">
              <p className="text-2xl font-bold">{cases.length}</p>
              <p className="text-gray-400">Cases Attempted</p>
            </div>
          </div>
          
          <div className="glass p-4 mb-6">
            <h3 className="font-semibold mb-2">Your Scores:</h3>
            <div className="flex justify-center gap-2">
              {selfScores.map((score, index) => (
                <div key={index} className={`w-12 h-12 glass flex items-center justify-center font-bold
                  ${score >= 4 ? 'text-green-400 border-green-400' : 'text-yellow-400'}`}>
                  {score}
                </div>
              ))}
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
      <div className="glass p-4 mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Case Builder</h1>
          <p className="text-gray-400">Case {currentCaseIndex + 1} of {cases.length}</p>
        </div>
        <div className="flex items-center gap-4">
          <Timer
            duration={300} // 5 minutes
            onExpire={handleTimeExpire}
            isRunning={isTimerRunning}
          />
          <div className="text-right">
            <p className="text-sm text-gray-400">High Scores</p>
            <p className="text-xl font-bold">{selfScores.filter(s => s >= 4).length}/3</p>
          </div>
        </div>
      </div>

      {/* Case Study */}
      {currentCase && (
        <div className="glass p-6">
          <h2 className="text-lg font-semibold mb-4">Scenario:</h2>
          <p className="text-gray-300 mb-6 whitespace-pre-wrap">{currentCase.scenario}</p>
          
          {/* Answer Input */}
          {!showGuidance && (
            <>
              <label className="block text-sm font-medium mb-2">Your Response:</label>
              <textarea
                value={userAnswer}
                onChange={handleAnswerChange}
                placeholder="Structure your answer with clear steps and actionable recommendations..."
                className="w-full h-48 p-4 glass bg-white/5 text-white resize-none focus:outline-none focus:border-accent"
                disabled={timeExpired}
              />
              
              <div className="mt-4 flex justify-between items-center">
                <p className="text-sm text-gray-400">
                  {timeExpired ? '⏰ Time expired! Submit your answer.' : 'Take your time to structure a comprehensive response.'}
                </p>
                <button
                  onClick={handleSubmitAnswer}
                  className="btn-primary"
                  disabled={userAnswer.trim().length < 50}
                >
                  Submit Answer
                </button>
              </div>
            </>
          )}
          
          {/* Self-Grading */}
          {showGuidance && (
            <div className="mt-6 glass p-6 bg-white/5">
              <h3 className="font-semibold mb-4">Self-Assessment</h3>
              
              {currentCase.guidance && (
                <div className="mb-4 p-4 glass bg-blue-500/10 border-blue-500/30">
                  <p className="text-sm font-medium mb-2">💡 Guidance:</p>
                  <p className="text-sm text-gray-300">{currentCase.guidance}</p>
                </div>
              )}
              
              <div className="mb-4">
                <p className="font-medium mb-2">Your Answer:</p>
                <p className="text-gray-300 whitespace-pre-wrap p-3 glass bg-white/5 max-h-48 overflow-y-auto">
                  {userAnswer || "(No answer provided)"}
                </p>
              </div>
              
              <p className="mb-4">Rate your response based on structure, completeness, and actionability:</p>
              
              <div className="flex gap-2 justify-center">
                {[1, 2, 3, 4, 5].map((score) => (
                  <button
                    key={score}
                    onClick={() => handleSelfGrade(score)}
                    className={`w-16 h-16 glass glass-hover font-bold text-xl
                      ${selfScore === score ? 'border-accent bg-accent/20' : ''}`}
                    disabled={selfScore !== null}
                  >
                    {score}
                  </button>
                ))}
              </div>
              
              <div className="mt-4 text-center text-sm text-gray-400">
                <p>1 = Poor | 2 = Below Average | 3 = Average | 4 = Good | 5 = Excellent</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}; 