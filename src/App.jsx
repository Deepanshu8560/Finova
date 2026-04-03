import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { DashboardLayout } from './components/layout/DashboardLayout';

// Pages
import { LandingPage }     from './pages/LandingPage';
import { AuthPage }        from './pages/AuthPage';
import { DashboardPage }   from './pages/DashboardPage';
import { RevenuePage }     from './pages/RevenuePage';
import { UsersPage }       from './pages/UsersPage';
import { AcquisitionPage } from './pages/AcquisitionPage';
import { SettingsPage }    from './pages/SettingsPage';
import { SuggestionPage }  from './pages/SuggestionPage';

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
 * @returns {JSX.Element}
 */
function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<AnimatedPage><LandingPage /></AnimatedPage>} />
            <Route path="/auth" element={<AnimatedPage><AuthPage /></AnimatedPage>} />

            {/* Protected dashboard routes */}
            <Route element={<ProtectedRoute />}>
              <Route element={<DashboardLayout />}>
                <Route path="/dashboard"             element={<AnimatedPage><DashboardPage /></AnimatedPage>} />
                <Route path="/dashboard/revenue"     element={<AnimatedPage><RevenuePage /></AnimatedPage>} />
                <Route path="/dashboard/users"       element={<AnimatedPage><UsersPage /></AnimatedPage>} />
                <Route path="/dashboard/acquisition" element={<AnimatedPage><AcquisitionPage /></AnimatedPage>} />
                <Route path="/dashboard/suggestions" element={<AnimatedPage><SuggestionPage /></AnimatedPage>} />
                <Route path="/settings"              element={<AnimatedPage><SettingsPage /></AnimatedPage>} />
              </Route>
            </Route>

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;
