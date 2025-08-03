import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import SignupPage from './pages/SignupPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import MyJournalPage from './pages/MyJournalPage.jsx';
import MoodTimelinePage from './pages/MoodTimelinePage.jsx';
import ChatPage from './pages/ChatPage.jsx';
import HabitPacksPage from './pages/HabitPacksPage.jsx';
import AchievementsPage from './pages/AchievementsPage.jsx';
import DailyTaskPage from './pages/DailyTaskPage.jsx'; // 1. Import the new page
import ProtectedRoute from './components/auth/ProtectedRoute.jsx';
import FloatingCoachButton from './components/common/FloatingCoachButton.jsx';

function App() {
  return (
    <>
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
          <Route path="/daily-task" element={<DailyTaskPage />} /> {/* 2. Add the new route */}
        </Route>
      </Routes>
      <FloatingCoachButton />
    </>
  );
}

export default App;
