import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Timer } from '../../components/Timer';
import { Confetti } from '../../components/Confetti';
import { usePageAnimation } from '../../hooks/useAnimations';

interface TrendQuestion {
  id: string;
  category: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  year: string;
}

const trendQuestions: TrendQuestion[] = [
  {
    id: 'trend_001',
    category: 'AI & Automation',
    question: 'What percentage of marketers reported using AI for content creation in 2024?',
    options: ['25%', '45%', '67%', '82%'],
    correctAnswer: 2,
    explanation: '67% of marketers now use AI tools for content creation, with ChatGPT and similar tools becoming mainstream.',
    difficulty: 'intermediate',
    year: '2024'
  },
  {
    id: 'trend_002',
    category: 'Privacy & Tracking',
    question: 'Which browser announced the deprecation of third-party cookies by 2025?',
    options: ['Safari', 'Firefox', 'Chrome', 'Edge'],
    correctAnswer: 2,
    explanation: 'Google Chrome announced the phase-out of third-party cookies, significantly impacting digital advertising.',
    difficulty: 'beginner',
    year: '2024'
  },
  {
    id: 'trend_003',
    category: 'Social Commerce',
    question: 'What is the projected value of social commerce sales by 2025?',
    options: ['$500B', '$1.2T', '$2.9T', '$4.1T'],
    correctAnswer: 2,
    explanation: 'Social commerce is expected to reach $2.9 trillion globally by 2025, driven by platform shopping features.',
    difficulty: 'advanced',
    year: '2024'
  },
  {
    id: 'trend_004',
    category: 'Video Marketing',
    question: 'What percentage of internet traffic is expected to be video by 2025?',
    options: ['65%', '75%', '82%', '91%'],
    correctAnswer: 3,
    explanation: '91% of internet traffic will be video by 2025, making video marketing essential for all brands.',
    difficulty: 'intermediate',
    year: '2024'
  },
  {
    id: 'trend_005',
    category: 'Voice Search',
    question: 'What percentage of US households own a smart speaker in 2024?',
    options: ['28%', '35%', '42%', '55%'],
    correctAnswer: 3,
    explanation: '55% of US households now own smart speakers, making voice search optimization crucial.',
    difficulty: 'intermediate',
    year: '2024'
  },
  {
    id: 'trend_006',
    category: 'Sustainability',
    question: 'What percentage of Gen Z consumers prefer brands with sustainable practices?',
    options: ['45%', '62%', '73%', '89%'],
    correctAnswer: 2,
    explanation: '73% of Gen Z consumers are willing to pay more for sustainable products and services.',
    difficulty: 'beginner',
    year: '2024'
  },
  {
    id: 'trend_007',
    category: 'Personalization',
    question: 'What is the average ROI increase from personalized marketing campaigns?',
    options: ['15%', '25%', '40%', '60%'],
    correctAnswer: 2,
    explanation: 'Personalized marketing campaigns deliver an average 40% increase in ROI compared to generic campaigns.',
    difficulty: 'intermediate',
    year: '2024'
  },
  {
    id: 'trend_008',
    category: 'Mobile Commerce',
    question: 'What percentage of e-commerce sales are mobile in 2024?',
    options: ['45%', '58%', '67%', '73%'],
    correctAnswer: 3,
    explanation: '73% of e-commerce sales now happen on mobile devices, emphasizing mobile-first strategies.',
    difficulty: 'beginner',
    year: '2024'
  },
  {
    id: 'trend_009',
    category: 'Influencer Marketing',
    question: 'What is the average ROI for influencer marketing in 2024?',
    options: ['$3.50', '$5.20', '$6.50', '$8.90'],
    correctAnswer: 2,
    explanation: 'Businesses earn $6.50 for every $1 spent on influencer marketing, making it highly effective.',
    difficulty: 'advanced',
    year: '2024'
  },
  {
    id: 'trend_010',
    category: 'AR/VR Marketing',
    question: 'What percentage of consumers have tried AR shopping experiences?',
    options: ['12%', '23%', '34%', '45%'],
    correctAnswer: 2,
    explanation: '34% of consumers have used AR for shopping, with adoption growing rapidly in retail.',
    difficulty: 'advanced',
    year: '2024'
  },
  {
    id: 'trend_011',
    category: 'Data Privacy',
    question: 'Which regulation expanded globally in 2024, following GDPR?',
    options: ['CCPA 2.0', 'Digital Services Act', 'Privacy Shield 3.0', 'Global Privacy Framework'],
    correctAnswer: 1,
    explanation: 'The EU Digital Services Act expanded globally, requiring stricter content moderation and transparency.',
    difficulty: 'advanced',
    year: '2024'
  },
  {
    id: 'trend_012',
    category: 'Customer Experience',
    question: 'What percentage of companies use chatbots for customer service in 2024?',
    options: ['35%', '48%', '67%', '78%'],
    correctAnswer: 2,
    explanation: '67% of companies now use AI chatbots for customer service, improving response times and efficiency.',
    difficulty: 'intermediate',
    year: '2024'
  },
  {
    id: 'trend_013',
    category: 'Marketing Attribution',
    question: 'What is the most adopted attribution model in 2024?',
    options: ['First-touch', 'Last-touch', 'Data-driven', 'Linear'],
    correctAnswer: 2,
    explanation: 'Data-driven attribution has become the standard, using ML to assign credit across touchpoints.',
    difficulty: 'advanced',
    year: '2024'
  },
  {
    id: 'trend_014',
    category: 'Content Marketing',
    question: 'What type of content generates the highest engagement in 2024?',
    options: ['Blog posts', 'Videos', 'Interactive content', 'Podcasts'],
    correctAnswer: 2,
    explanation: 'Interactive content (polls, quizzes, calculators) generates 2x more engagement than static content.',
    difficulty: 'intermediate',
    year: '2024'
  },
  {
    id: 'trend_015',
    category: 'Email Marketing',
    question: 'What is the average email open rate across industries in 2024?',
    options: ['18.5%', '21.3%', '24.8%', '28.2%'],
    correctAnswer: 1,
    explanation: 'Average email open rates are 21.3% in 2024, with mobile optimization being crucial for performance.',
    difficulty: 'beginner',
    year: '2024'
  }
];

export function IndustryTrends() {
  const navigate = useNavigate();
  const isVisible = usePageAnimation();
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(45); // 45 seconds per question
  const [gameComplete, setGameComplete] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [questions] = useState(() => 
    [...trendQuestions].sort(() => Math.random() - 0.5).slice(0, 10)
  );

  useEffect(() => {
    if (timeLeft > 0 && !showExplanation && !gameComplete) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showExplanation) {
      handleAnswer(null);
    }
  }, [timeLeft, showExplanation, gameComplete]);

  const handleAnswer = (answerIndex: number | null) => {
    setSelectedAnswer(answerIndex);
    setShowExplanation(true);
    
    if (answerIndex === questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setShowExplanation(false);
        setTimeLeft(45);
      } else {
        setGameComplete(true);
        const finalScore = answerIndex === questions[currentQuestion].correctAnswer ? score + 1 : score;
        const currentScores = JSON.parse(localStorage.getItem('glassprep-scores') || '{}');
        currentScores.industryTrends = Math.max(currentScores.industryTrends || 0, finalScore);
        localStorage.setItem('glassprep-scores', JSON.stringify(currentScores));
      }
    }, 3000);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-400';
      case 'intermediate': return 'text-yellow-400';
      case 'advanced': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getScoreMessage = () => {
    const percentage = (score / questions.length) * 100;
    if (percentage >= 80) return "🚀 Industry Expert! You're ahead of the trends!";
    if (percentage >= 60) return "📈 Trend Aware! Good knowledge of current marketing landscape!";
    if (percentage >= 40) return "📊 Getting There! Keep up with industry developments!";
    return "📚 Study Up! Focus on current marketing trends and developments!";
  };

  if (gameComplete) {
    return (
      <div className={`min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <Confetti isActive={true} />
        <div className="max-w-2xl mx-auto">
          <div className="glass-card p-8 text-center animate-slideInUp">
            <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <TrendingUp className="w-10 h-10 text-white" />
            </div>
            
            <h1 className="text-3xl font-bold text-white mb-4">Industry Trends Complete!</h1>
            <p className="text-xl text-purple-200 mb-6">{getScoreMessage()}</p>
            
            <div className="bg-black/20 rounded-lg p-6 mb-8">
              <div className="text-4xl font-bold text-white mb-2">{score}/{questions.length}</div>
              <div className="text-purple-200">Questions Correct</div>
              <div className="text-sm text-purple-300 mt-2">
                {Math.round((score / questions.length) * 100)}% Accuracy
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105"
              >
                Try Again
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="px-6 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all duration-300"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6 animate-slideInDown">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </button>
          
          <div className="flex items-center gap-4">
            <div className="text-white/80">
              Question {currentQuestion + 1} of {questions.length}
            </div>
            <Timer duration={45} isRunning={!showExplanation && !gameComplete} onExpire={() => handleAnswer(null)} />
          </div>
        </div>

        <div className="glass-card p-8 animate-slideInUp">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm">
                {question.category}
              </span>
              <span className={`px-3 py-1 bg-black/20 rounded-full text-sm ${getDifficultyColor(question.difficulty)}`}>
                {question.difficulty}
              </span>
              <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm">
                {question.year}
              </span>
            </div>
            <div className="text-white/60">
              Score: {score}/{currentQuestion + (showExplanation ? 1 : 0)}
            </div>
          </div>

          <h2 className="text-2xl font-bold text-white mb-8 leading-relaxed">
            {question.question}
          </h2>

          <div className="grid gap-4 mb-8">
            {question.options.map((option, index) => {
              let buttonClass = "w-full p-4 text-left rounded-lg transition-all duration-300 transform hover:scale-[1.02] ";
              
              if (showExplanation) {
                if (index === question.correctAnswer) {
                  buttonClass += "bg-green-500/20 border-2 border-green-500 text-green-300";
                } else if (index === selectedAnswer && index !== question.correctAnswer) {
                  buttonClass += "bg-red-500/20 border-2 border-red-500 text-red-300";
                } else {
                  buttonClass += "bg-white/5 border border-white/20 text-white/60";
                }
              } else {
                buttonClass += selectedAnswer === index 
                  ? "bg-purple-500/30 border-2 border-purple-400 text-white" 
                  : "bg-white/5 border border-white/20 text-white hover:bg-white/10 hover:border-white/30";
              }

              return (
                <button
                  key={index}
                  onClick={() => !showExplanation && handleAnswer(index)}
                  disabled={showExplanation}
                  className={buttonClass}
                >
                  <div className="flex items-center justify-between">
                    <span>{option}</span>
                    {showExplanation && index === question.correctAnswer && (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    )}
                    {showExplanation && index === selectedAnswer && index !== question.correctAnswer && (
                      <XCircle className="w-5 h-5 text-red-400" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {showExplanation && (
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-6 animate-fadeIn">
              <h3 className="text-lg font-semibold text-blue-300 mb-2">Explanation</h3>
              <p className="text-blue-200">{question.explanation}</p>
            </div>
          )}

          {!showExplanation && (
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-white/60">
                <Clock className="w-4 h-4" />
                <span>Choose your answer before time runs out!</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 