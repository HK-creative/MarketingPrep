import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, RotateCcw, Lightbulb, CheckCircle, Target, Users, TrendingUp, Shield } from 'lucide-react';
import { usePageAnimation } from '../../hooks/useAnimations';
import content from '../../data/enhanced-content.json';

interface CaseStudy {
  id: number;
  title: string;
  scenario: string;
  context: string;
  questions: string[];
  keyPoints: string[];
}

const AgiliteScenarios: React.FC = () => {
  const navigate = useNavigate();
  const pageClass = usePageAnimation() ? 'animate-fadeInUp' : 'opacity-0';
  
  const [caseStudies] = useState<CaseStudy[]>(content.agiliteCaseStudies);
  const [currentCaseIndex, setCurrentCaseIndex] = useState(0);
  const [responses, setResponses] = useState<string[]>(['', '', '']);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [completedCases, setCompletedCases] = useState<boolean[]>(new Array(caseStudies.length).fill(false));
  const [gameComplete, setGameComplete] = useState(false);
  const [startTime, setStartTime] = useState<number>(Date.now());

  const currentCase = caseStudies[currentCaseIndex];
  const progress = ((currentCaseIndex + 1) / caseStudies.length) * 100;
  const completedCount = completedCases.filter(Boolean).length;

  useEffect(() => {
    setStartTime(Date.now());
  }, [currentCaseIndex]);

  const handleResponseChange = (questionIndex: number, value: string) => {
    const newResponses = [...responses];
    newResponses[questionIndex] = value;
    setResponses(newResponses);
  };

  const handleAnalyze = () => {
    if (responses.every(response => response.trim().length > 20)) {
      setShowAnalysis(true);
      const newCompleted = [...completedCases];
      newCompleted[currentCaseIndex] = true;
      setCompletedCases(newCompleted);

      // Save progress
      const caseProgress = {
        caseId: currentCase.id,
        responses,
        completedAt: new Date().toISOString(),
        timeSpent: Math.round((Date.now() - startTime) / 1000)
      };
      
      const existingProgress = JSON.parse(localStorage.getItem('agiliteScenarios') || '[]');
      existingProgress.push(caseProgress);
      localStorage.setItem('agiliteScenarios', JSON.stringify(existingProgress));
    }
  };

  const handleNext = () => {
    if (currentCaseIndex < caseStudies.length - 1) {
      setCurrentCaseIndex(currentCaseIndex + 1);
      setResponses(['', '', '']);
      setShowAnalysis(false);
    } else {
      setGameComplete(true);
      
      // Update overall progress
      const allScores = JSON.parse(localStorage.getItem('gameScores') || '{}');
      const completionRate = Math.round((completedCount / caseStudies.length) * 100);
      allScores.agiliteScenarios = {
        bestScore: Math.max(allScores.agiliteScenarios?.bestScore || 0, completionRate),
        lastPlayed: new Date().toISOString(),
        timesPlayed: (allScores.agiliteScenarios?.timesPlayed || 0) + 1
      };
      localStorage.setItem('gameScores', JSON.stringify(allScores));
    }
  };

  const handleRestart = () => {
    setCurrentCaseIndex(0);
    setResponses(['', '', '']);
    setShowAnalysis(false);
    setCompletedCases(new Array(caseStudies.length).fill(false));
    setGameComplete(false);
    setStartTime(Date.now());
  };

  const getCaseIcon = (caseId: number) => {
    const icons = [Target, Users, Shield, TrendingUp, CheckCircle];
    const IconComponent = icons[(caseId - 1) % icons.length];
    return IconComponent;
  };

  const isResponseValid = (response: string) => response.trim().length > 20;

  if (gameComplete) {
    const completionRate = Math.round((completedCount / caseStudies.length) * 100);

    return (
      <div className={`min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 ${pageClass}`}>
        <div className="max-w-2xl mx-auto">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-8 text-center">
            <div className="mb-6">
              <Target className="w-16 h-16 mx-auto mb-4 text-green-400" />
              <h1 className="text-3xl font-bold text-white mb-2">Scenarios Complete!</h1>
              <p className="text-xl font-semibold text-green-400">Business Analysis Skills Developed</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-white/5 rounded-xl p-4">
                <div className="text-2xl font-bold text-white">{completedCount}/{caseStudies.length}</div>
                <div className="text-white/70">Cases Completed</div>
              </div>
              <div className="bg-white/5 rounded-xl p-4">
                <div className="text-2xl font-bold text-white">{completionRate}%</div>
                <div className="text-white/70">Completion Rate</div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="text-white/80 text-sm">
                {completionRate === 100 && "Excellent! You've analyzed all Agilite business scenarios. Your strategic thinking skills are well-developed for interviews."}
                {completionRate >= 80 && completionRate < 100 && "Great work! You've completed most scenarios. Your business analysis skills are strong."}
                {completionRate >= 60 && completionRate < 80 && "Good progress! Continue practicing to strengthen your strategic thinking abilities."}
                {completionRate < 60 && "Keep practicing! Business scenario analysis is crucial for leadership roles at Agilite."}
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

  const CaseIcon = getCaseIcon(currentCase.id);

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 ${pageClass}`}>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-white">Agilite Business Scenarios</h1>
            <div className="flex items-center gap-2 text-white/70">
              <CaseIcon className="w-5 h-5" />
              <span>Case Study {currentCaseIndex + 1}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between text-white/70 text-sm mb-4">
            <span>Scenario {currentCaseIndex + 1} of {caseStudies.length}</span>
            <span>Completed: {completedCount}/{caseStudies.length}</span>
          </div>
          
          <div className="w-full bg-white/20 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Scenario */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6">
            <div className="flex items-center gap-3 mb-4">
              <CaseIcon className="w-6 h-6 text-blue-400" />
              <h2 className="text-xl font-bold text-white">{currentCase.title}</h2>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-blue-300 mb-2">Scenario:</h3>
                <p className="text-white/90 text-sm leading-relaxed">{currentCase.scenario}</p>
              </div>

              <div>
                <h3 className="font-semibold text-purple-300 mb-2">Context:</h3>
                <p className="text-white/90 text-sm leading-relaxed">{currentCase.context}</p>
              </div>

              {showAnalysis && (
                <div className="bg-green-500/20 border border-green-400/30 rounded-xl p-4">
                  <h3 className="font-semibold text-green-300 mb-2 flex items-center gap-2">
                    <Lightbulb className="w-4 h-4" />
                    Key Considerations:
                  </h3>
                  <ul className="text-white/90 text-sm space-y-1">
                    {currentCase.keyPoints.map((point, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-green-400 mt-1">•</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Questions & Responses */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6">
            <h3 className="text-lg font-bold text-white mb-4">Your Analysis</h3>
            
            <div className="space-y-6">
              {currentCase.questions.map((question, index) => (
                <div key={index}>
                  <label className="block text-white/90 font-medium mb-2 text-sm">
                    {index + 1}. {question}
                  </label>
                  <textarea
                    value={responses[index]}
                    onChange={(e) => handleResponseChange(index, e.target.value)}
                    disabled={showAnalysis}
                    placeholder="Provide a detailed response (minimum 20 characters)..."
                    className={`w-full p-3 rounded-xl bg-white/5 border text-white placeholder-white/50 resize-none transition-all duration-300 ${
                      showAnalysis
                        ? 'border-white/20 cursor-not-allowed'
                        : isResponseValid(responses[index])
                        ? 'border-green-400/50 focus:border-green-400'
                        : 'border-white/20 focus:border-blue-400'
                    } focus:outline-none focus:ring-2 focus:ring-blue-400/20`}
                    rows={4}
                  />
                  <div className="flex justify-between items-center mt-1">
                    <span className={`text-xs ${
                      isResponseValid(responses[index]) ? 'text-green-400' : 'text-white/50'
                    }`}>
                      {responses[index].length}/20 minimum
                    </span>
                    {isResponseValid(responses[index]) && (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-center">
              {!showAnalysis ? (
                <button
                  onClick={handleAnalyze}
                  disabled={!responses.every(response => isResponseValid(response))}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                    responses.every(response => isResponseValid(response))
                      ? 'bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white'
                      : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <Lightbulb className="w-5 h-5" />
                  Analyze Responses
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
                >
                  {currentCaseIndex < caseStudies.length - 1 ? 'Next Scenario' : 'Complete Analysis'}
                  <ArrowRight className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgiliteScenarios; 