import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';

import AppLayout from './layouts/AppLayout';
import AuthLayout from './layouts/AuthLayout';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';
import ComingSoonPage from './pages/ComingSoonPage';

import ProtectedRoute from './components/auth/ProtectedRoute';
import GuestRoute from './components/auth/GuestRoute';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            {/* Auth routes — redirect to dashboard if already logged in */}
            <Route element={<GuestRoute />}>
              <Route element={<AuthLayout />}>
                <Route path="/login"    element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
              </Route>
            </Route>

            {/* Protected app routes — redirect to login if not authenticated */}
            <Route element={<ProtectedRoute />}>
              <Route element={<AppLayout />}>
                <Route path="/dashboard"      element={<DashboardPage />} />
                <Route path="/profile"        element={<ProfilePage />} />
                <Route path="/skills"         element={<ComingSoonPage title="My Skills" phase={2} />} />
                <Route path="/learning-path"  element={<ComingSoonPage title="Learning Path" phase={5} />} />
                <Route path="/recommendations" element={<ComingSoonPage title="Recommendations" phase={4} />} />
                <Route path="/practice"       element={<ComingSoonPage title="Practice" phase={2} />} />
                <Route path="/revision"       element={<ComingSoonPage title="Revision" phase={6} />} />
                <Route path="/history"        element={<ComingSoonPage title="Learning History" phase={3} />} />
                <Route path="/settings"       element={<ComingSoonPage title="Settings" phase={2} />} />
              </Route>
            </Route>

            {/* Root redirect */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            {/* 404 */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
