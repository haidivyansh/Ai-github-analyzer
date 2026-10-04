import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import AnalyzePage from './pages/AnalyzePage';
import RepoDetailsPage from './pages/RepoDetailsPage';
import AIAnalysisPage from './pages/AIAnalysisPage';
import AnalyticsPage from './pages/AnalyticsPage';
import AIChatPage from './pages/AIChatPage';
import ReportPage from './pages/ReportPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/analyze"
            element={
              <ProtectedRoute>
                <AnalyzePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/repository/details"
            element={
              <ProtectedRoute>
                <RepoDetailsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/repository/analysis"
            element={
              <ProtectedRoute>
                <AIAnalysisPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/repository/:id"
            element={
              <ProtectedRoute>
                <RepoDetailsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/repository/:id/analysis"
            element={
              <ProtectedRoute>
                <AIAnalysisPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/repository/:id/analytics"
            element={
              <ProtectedRoute>
                <AnalyticsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/repository/:id/chat"
            element={
              <ProtectedRoute>
                <AIChatPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/repository/:id/report"
            element={
              <ProtectedRoute>
                <ReportPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
