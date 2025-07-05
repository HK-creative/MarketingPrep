import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/Login';
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
import { ProtectedRoute } from './components/ProtectedRoute';
import { SkipLinks } from './components/SkipLinks';

function App() {
  return (
    <>
      <SkipLinks />
      <Router>
        <div className="App" role="application" aria-label="GlassPrep Interview Preparation App">
          <main id="main-content" role="main">
            <Routes>
              <Route path="/login" element={<Login />} />
              
              <Route path="/" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              
              <Route path="/game/quiz" element={
                <ProtectedRoute>
                  <Quiz />
                </ProtectedRoute>
              } />
              
              <Route path="/game/flashcards" element={
                <ProtectedRoute>
                  <Flashcards />
                </ProtectedRoute>
              } />
              
              <Route path="/game/case" element={
                <ProtectedRoute>
                  <CaseBuilder />
                </ProtectedRoute>
              } />
              
              <Route path="/game/matching" element={
                <ProtectedRoute>
                  <MatchingMatrix />
                </ProtectedRoute>
              } />
              
              <Route path="/game/acronym" element={
                <ProtectedRoute>
                  <AcronymSprint />
                </ProtectedRoute>
              } />
              
              <Route path="/game/trends" element={
                <ProtectedRoute>
                  <IndustryTrends />
                </ProtectedRoute>
              } />
              
              <Route path="/game/agilite-quiz" element={
                <ProtectedRoute>
                  <AgiliteQuiz />
                </ProtectedRoute>
              } />
              
              <Route path="/game/agilite-scenarios" element={
                <ProtectedRoute>
                  <AgiliteScenarios />
                </ProtectedRoute>
              } />
              
              <Route path="/settings" element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              } />
              
              <Route path="/study-guide" element={
                <ProtectedRoute>
                  <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
                    <StudyGuide />
                  </div>
                </ProtectedRoute>
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
