import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from 'react-query';
import useAuthStore from './store/authStore';
import { ThemeProvider } from './context/ThemeContext';

import AppLayout from './components/layout/AppLayout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import AnalyticsPage from './pages/AnalyticsPage';
import CRMPage from './pages/CRMPage';
import TeamPage from './pages/TeamPage';
import MarketplacePage from './pages/MarketplacePage';
import AIPage from './pages/AIPage';
import SettingsPage from './pages/SettingsPage';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, refetchOnWindowFocus: false } },
});

function PrivateRoute({ children }) {
  const user = useAuthStore(state => state.user);
  const loading = useAuthStore(state => state.loading);
  if (loading) return <div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600" /></div>;
  return user ? children : <Navigate to="/login" replace />;
}

function PublicRoute({ children }) {
  const user = useAuthStore(state => state.user);
  const loading = useAuthStore(state => state.loading);
  if (loading) return null;
  return user ? <Navigate to="/dashboard" replace /> : children;
}

// Wrap ThemeProvider inside auth so it can receive user from MongoDB
function AppWithTheme() {
  const user = useAuthStore(state => state.user);
  const updateProfile = useAuthStore(state => state.updateProfile);
  return (
    <ThemeProvider user={user} updateProfile={updateProfile}>
      <BrowserRouter>
        <Routes>
          <Route path="/login"    element={<PublicRoute><LoginPage /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
          <Route path="/" element={<PrivateRoute><AppLayout /></PrivateRoute>}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard"   element={<DashboardPage />} />
            <Route path="analytics"   element={<AnalyticsPage />} />
            <Route path="crm"         element={<CRMPage />} />
            <Route path="team"        element={<TeamPage />} />
            <Route path="marketplace" element={<MarketplacePage />} />
            <Route path="ai"          element={<AIPage />} />
            <Route path="settings"    element={<SettingsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: { borderRadius: '12px', fontSize: '14px', fontFamily: 'Inter' },
          success: { iconTheme: { primary: '#4f46e5', secondary: '#fff' } },
        }}
      />
    </ThemeProvider>
  );
}

export default function App() {
  const fetchMe = useAuthStore(state => state.fetchMe);
  
  React.useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  return (
    <QueryClientProvider client={queryClient}>
      <AppWithTheme />
    </QueryClientProvider>
  );
}
