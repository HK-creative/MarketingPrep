import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import { Quiz } from './pages/games/Quiz';
import { Flashcards } from './pages/games/Flashcards';
import { CaseBuilder } from './pages/games/CaseBuilder';
import { MatchingMatrix } from './pages/games/MatchingMatrix';
import { AcronymSprint } from './pages/games/AcronymSprint';
import { IndustryTrends } from './pages/games/IndustryTrends';
import AgiliteQuiz from './pages/games/AgiliteQuiz';
import AgiliteScenarios from './pages/games/AgiliteScenarios';
import { Settings } from './pages/Settings';
import { StudyGuide } from './components/StudyGuide';
import { SkipLinks } from './components/SkipLinks';

function App() {
  return (
    <>
      <SkipLinks />
      <Router>
        <div className="App" role="application" aria-label="GlassPrep Interview Preparation App">
          <main id="main-content" role="main">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              
              <Route path="/game/quiz" element={<Quiz />} />
              
              <Route path="/game/flashcards" element={<Flashcards />} />
              
              <Route path="/game/case" element={<CaseBuilder />} />
              
              <Route path="/game/matching" element={<MatchingMatrix />} />
              
              <Route path="/game/acronym" element={<AcronymSprint />} />
              
              <Route path="/game/trends" element={<IndustryTrends />} />
              
              <Route path="/game/agilite-quiz" element={<AgiliteQuiz />} />
              
              <Route path="/game/agilite-scenarios" element={<AgiliteScenarios />} />
              
              <Route path="/settings" element={<Settings />} />
              
              <Route path="/study-guide" element={
                <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
                  <StudyGuide />
                </div>
              } />
              
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </Router>
    </>
  );
}

export default App;
