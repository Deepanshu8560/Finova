import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { ToastService } from './components/ui/ToastService';

// Pages
import LandingPage      from './pages/LandingPage';
import AuthPage         from './pages/AuthPage';
import DashboardPage    from './pages/DashboardPage';
import TransactionsPage from './pages/TransactionsPage';
import InsightsPage     from './pages/InsightsPage';
import { SettingsPage } from './pages/SettingsPage';

/**
 * Wraps a page in the page-fade animation class, keyed to location so each
 * route change triggers a fresh fade-in.
 */
function AnimatedPage({ children }) {
  const location = useLocation();
  return (
    <div key={location.pathname} className="page-fade">
      {children}
    </div>
  );
}

/**
 * Main App component configuring routing, context providers, and animated page transitions.
 */
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ToastService />
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<AnimatedPage><LandingPage /></AnimatedPage>} />
          <Route path="/auth" element={<AnimatedPage><AuthPage /></AnimatedPage>} />

          {/* Protected dashboard routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard"              element={<AnimatedPage><DashboardPage /></AnimatedPage>} />
              <Route path="/dashboard/transactions"  element={<AnimatedPage><TransactionsPage /></AnimatedPage>} />
              <Route path="/dashboard/insights"      element={<AnimatedPage><InsightsPage /></AnimatedPage>} />
              <Route path="/settings"               element={<AnimatedPage><SettingsPage /></AnimatedPage>} />
            </Route>
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
