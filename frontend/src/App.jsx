import React, { lazy, Suspense, useEffect } from 'react';
// --- CHANGE 1: Import hooks for navigation and context ---
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext.jsx'; 
import { Loader2 } from 'lucide-react';

// Lazy loaded pages (no changes here)
import HomePage from './pages/HomePage.jsx';
const SignupPage = lazy(() => import('./pages/SignupPage.jsx'));
const LoginPage = lazy(() => import('./pages/LoginPage.jsx'));
const DashboardPage = lazy(() => import('./pages/DashboardPage.jsx'));
const MyJournalPage = lazy(() => import('./pages/MyJournalPage.jsx'));
const MoodTimelinePage = lazy(() => import('./pages/MoodTimelinePage.jsx'));
const ChatPage = lazy(() => import('./pages/ChatPage.jsx'));
const HabitPacksPage = lazy(() => import('./pages/HabitPacksPage.jsx'));
const AchievementsPage = lazy(() => import('./pages/AchievementsPage.jsx'));
const DailyTaskPage = lazy(() => import('./pages/DailyTaskPage.jsx'));

import ProtectedRoute from './components/auth/ProtectedRoute.jsx';
import FloatingCoachButton from './components/common/FloatingCoachButton.jsx';

const PageLoader = () => (
  <div className="flex h-screen w-full items-center justify-center">
    <Loader2 className="h-12 w-12 animate-spin text-primary-blue" />
  </div>
);

function App() {
  // --- CHANGE 2: Get necessary functions from hooks ---
  const { setUserInfo } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // --- CHANGE 3: Add a useEffect to handle the Google Auth redirect ---
useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');

    if (token) {
      // Now we also get the name, email, and id from the URL
      const name = params.get('name');
      const email = params.get('email');
      const id = params.get('id');

      // Construct the complete user object
      const userData = {
        _id: id,
        name: name,
        email: email,
        token: token,
      };

      // Save the complete user object to global state
      setUserInfo(userData);
      navigate('/dashboard', { replace: true });
    }
  }, [location, setUserInfo, navigate]);


  return (
    <>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/journal" element={<MyJournalPage />} />
            <Route path="/timeline" element={<MoodTimelinePage />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/habit-packs" element={<HabitPacksPage />} />
            <Route path="/achievements" element={<AchievementsPage />} />
            <Route path="/daily-task" element={<DailyTaskPage />} />
          </Route>
        </Routes>
      </Suspense>
      
      <FloatingCoachButton />
    </>
  );
}

export default App;