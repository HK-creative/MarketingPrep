import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, ArrowRight, RotateCcw, Trophy, Target, Clock, Award } from 'lucide-react';
import { Timer } from '../../components/Timer';
import { Confetti } from '../../components/Confetti';
import { usePageAnimation } from '../../hooks/useAnimations';
import content from '../../data/enhanced-content.json';

interface Question {
  id: number;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

const AgiliteQuiz: React.FC = () => {
  const navigate = useNavigate();
  const pageClass = usePageAnimation() ? 'animate-fadeInUp' : 'opacity-0';
  
  const [questions] = useState<Question[]>(content.agiliteQuiz);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answeredQuestions, setAnsweredQuestions] = useState<boolean[]>(new Array(questions.length).fill(false));
  const [correctAnswers, setCorrectAnswers] = useState<boolean[]>(new Array(questions.length).fill(false));
  const [showExplanation, setShowExplanation] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(45); // 45 seconds per question
  const [showConfetti, setShowConfetti] = useState(false);
  const [totalTime, setTotalTime] = useState(0);

  const currentQuestion = questions[currentQuestionIndex];
  const score = correctAnswers.filter(Boolean).length;
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  useEffect(() => {
    if (!gameComplete) {
      const timer = setInterval(() => {
        setTotalTime(prev => prev + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [gameComplete]);

  useEffect(() => {
    if (timeRemaining === 0 && !showExplanation) {
      handleTimeUp();
    }
  }, [timeRemaining, showExplanation]);

  const handleTimeUp = () => {
    if (selectedAnswer === null) {
      // Time's up, mark as incorrect
      const newAnswered = [...answeredQuestions];
      const newCorrect = [...correctAnswers];
      newAnswered[currentQuestionIndex] = true;
      newCorrect[currentQuestionIndex] = false;
      setAnsweredQuestions(newAnswered);
      setCorrectAnswers(newCorrect);
    }
    setShowExplanation(true);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (answeredQuestions[currentQuestionIndex]) return;
    
    setSelectedAnswer(answerIndex);
    const isCorrect = answerIndex === currentQuestion.correct;
    
    const newAnswered = [...answeredQuestions];
    const newCorrect = [...correctAnswers];
    newAnswered[currentQuestionIndex] = true;
    newCorrect[currentQuestionIndex] = isCorrect;
    
    setAnsweredQuestions(newAnswered);
    setCorrectAnswers(newCorrect);
    setShowExplanation(true);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
      setTimeRemaining(45);
    } else {
      setGameComplete(true);
      const finalScore = correctAnswers.filter(Boolean).length;
      const percentage = (finalScore / questions.length) * 100;
      
      // Save score
      const existingScores = JSON.parse(localStorage.getItem('agiliteQuizScores') || '[]');
      const newScore = {
        score: finalScore,
        total: questions.length,
        percentage: Math.round(percentage),
        date: new Date().toISOString(),
        timeSpent: totalTime
      };
      existingScores.push(newScore);
      localStorage.setItem('agiliteQuizScores', JSON.stringify(existingScores));

      // Update overall progress
      const allScores = JSON.parse(localStorage.getItem('gameScores') || '{}');
      allScores.agiliteQuiz = {
        bestScore: Math.max(allScores.agiliteQuiz?.bestScore || 0, percentage),
        lastPlayed: new Date().toISOString(),
        timesPlayed: (allScores.agiliteQuiz?.timesPlayed || 0) + 1
      };
      localStorage.setItem('gameScores', JSON.stringify(allScores));

      if (percentage >= 80) {
        setShowConfetti(true);
      }
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setAnsweredQuestions(new Array(questions.length).fill(false));
    setCorrectAnswers(new Array(questions.length).fill(false));
    setShowExplanation(false);
    setGameComplete(false);
    setTimeRemaining(45);
    setShowConfetti(false);
    setTotalTime(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getPerformanceLevel = (percentage: number) => {
    if (percentage >= 90) return { level: 'Expert', color: 'text-green-400', icon: Trophy };
    if (percentage >= 80) return { level: 'Advanced', color: 'text-blue-400', icon: Award };
    if (percentage >= 70) return { level: 'Intermediate', color: 'text-yellow-400', icon: Target };
    return { level: 'Beginner', color: 'text-red-400', icon: Clock };
  };

  if (gameComplete) {
    const percentage = Math.round((score / questions.length) * 100);
    const performance = getPerformanceLevel(percentage);
    const PerformanceIcon = performance.icon;

    return (
      <div className={`min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 ${pageClass}`}>
        {showConfetti && <Confetti isActive={showConfetti} />}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-8 text-center">
            <div className="mb-6">
              <PerformanceIcon className={`w-16 h-16 mx-auto mb-4 ${performance.color}`} />
              <h1 className="text-3xl font-bold text-white mb-2">Agilite Quiz Complete!</h1>
              <p className={`text-xl font-semibold ${performance.color}`}>{performance.level} Level</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-white/5 rounded-xl p-4">
                <div className="text-2xl font-bold text-white">{score}/{questions.length}</div>
                <div className="text-white/70">Correct Answers</div>
              </div>
              <div className="bg-white/5 rounded-xl p-4">
                <div className="text-2xl font-bold text-white">{percentage}%</div>
                <div className="text-white/70">Accuracy</div>
              </div>
              <div className="bg-white/5 rounded-xl p-4">
                <div className="text-2xl font-bold text-white">{formatTime(totalTime)}</div>
                <div className="text-white/70">Time Spent</div>
              </div>
              <div className="bg-white/5 rounded-xl p-4">
                <div className="text-2xl font-bold text-white">{Math.round((score / totalTime) * 60)}</div>
                <div className="text-white/70">Points/Min</div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="text-white/80 text-sm">
                {percentage >= 90 && "Outstanding! You have comprehensive knowledge of Agilite. You're ready for any interview question about the company."}
                {percentage >= 80 && percentage < 90 && "Excellent work! You have strong knowledge of Agilite. Review a few areas and you'll be fully prepared."}
                {percentage >= 70 && percentage < 80 && "Good foundation! You understand Agilite well. Focus on the areas you missed to improve further."}
                {percentage < 70 && "Keep studying! Review the explanations and try again. Understanding Agilite's culture and products is key for interviews."}
              </div>

              <div className="flex gap-4 justify-center">
                <button
                  onClick={handleRestart}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
                >
                  <RotateCcw className="w-5 h-5" />
                  Try Again
                </button>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
                >
                  <ArrowRight className="w-5 h-5" />
                  Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 ${pageClass}`}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-white">Agilite Company Knowledge Quiz</h1>
            <Timer 
              duration={timeRemaining} 
              onExpire={handleTimeUp}
              isRunning={!showExplanation && !answeredQuestions[currentQuestionIndex]}
            />
          </div>
          
          <div className="flex items-center justify-between text-white/70 text-sm mb-4">
            <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
            <span>Score: {score}/{currentQuestionIndex + (answeredQuestions[currentQuestionIndex] ? 1 : 0)}</span>
          </div>
          
          <div className="w-full bg-white/20 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-8">
          <h2 className="text-xl font-semibold text-white mb-6 leading-relaxed">
            {currentQuestion.question}
          </h2>

          {/* Answer Options */}
          <div className="space-y-3 mb-6">
            {currentQuestion.options.map((option, index) => {
              const isSelected = selectedAnswer === index;
              const isCorrect = index === currentQuestion.correct;
              const isIncorrect = showExplanation && isSelected && !isCorrect;
              const shouldHighlight = showExplanation && isCorrect;

              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={answeredQuestions[currentQuestionIndex]}
                  className={`w-full p-4 rounded-xl text-left transition-all duration-300 transform hover:scale-[1.02] ${
                    shouldHighlight
                      ? 'bg-green-500/30 border-2 border-green-400 text-white'
                      : isIncorrect
                      ? 'bg-red-500/30 border-2 border-red-400 text-white'
                      : isSelected
                      ? 'bg-blue-500/30 border-2 border-blue-400 text-white'
                      : 'bg-white/5 border border-white/20 text-white/90 hover:bg-white/10'
                  } ${answeredQuestions[currentQuestionIndex] ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="flex-1">{option}</span>
                    {showExplanation && isCorrect && <CheckCircle className="w-5 h-5 text-green-400 ml-2" />}
                    {showExplanation && isIncorrect && <XCircle className="w-5 h-5 text-red-400 ml-2" />}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          {showExplanation && (
            <div className="bg-blue-500/20 border border-blue-400/30 rounded-xl p-4 mb-6">
              <h3 className="font-semibold text-blue-300 mb-2">Explanation:</h3>
              <p className="text-white/90 text-sm leading-relaxed">{currentQuestion.explanation}</p>
            </div>
          )}

          {/* Next Button */}
          {showExplanation && (
            <div className="flex justify-center">
              <button
                onClick={handleNext}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
              >
                {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'View Results'}
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AgiliteQuiz; 