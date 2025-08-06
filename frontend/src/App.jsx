// --- CHANGE 1: Import `lazy` and `Suspense` from React ---
import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Loader2 } from 'lucide-react'; // For our loading spinner

// --- CHANGE 2: Keep the HomePage as a normal import, but change all others to use `lazy` ---
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

// --- CHANGE 3: Create a simple loading component to show while new pages load ---
const PageLoader = () => (
  <div className="flex h-screen w-full items-center justify-center">
    <Loader2 className="h-12 w-12 animate-spin text-primary-blue" />
  </div>
);


function App() {
  return (
    <>
      {/* --- CHANGE 4: Wrap your entire <Routes> component in a <Suspense> boundary --- */}
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