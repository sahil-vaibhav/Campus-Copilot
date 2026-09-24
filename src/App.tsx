import React from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import AppShell from "./components/layout/AppShell"
import DashboardPage from "./pages/DashboardPage"
import CopilotPage from "./pages/CopilotPage"
import TimetablePage from "./pages/TimetablePage"
import NoticesPage from "./pages/NoticesPage"
import LibraryPage from "./pages/LibraryPage"
import FacultyPage from "./pages/FacultyPage"
import ServicesPage from "./pages/ServicesPage"
import FeedbackPage from "./pages/FeedbackPage"
import ProfilePage from "./pages/ProfilePage"
import SettingsPage from "./pages/SettingsPage"
import LandingPage from "./pages/LandingPage"
import LoginPage from "./pages/LoginPage"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        
        <Route element={<AppShell />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/copilot" element={<CopilotPage />} />
          <Route path="/timetable" element={<TimetablePage />} />
          <Route path="/notices" element={<NoticesPage />} />
          <Route path="/library" element={<LibraryPage />} />
          <Route path="/faculty" element={<FacultyPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/feedback" element={<FeedbackPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
