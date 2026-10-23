import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/ui/PrivateRoute';
import Layout from './components/layout/Layout';

// Public pages
import Landing    from './pages/Landing';
import Login      from './pages/Login';
import Register   from './pages/Register';

// Protected pages
import Dashboard   from './pages/Dashboard';
import Planly      from './pages/Planly';
import PrepHub     from './pages/PrepHub';
import Companies   from './pages/Companies';
import TUFY        from './pages/TUFY';
import POTD        from './pages/POTD';
import Notes       from './pages/Notes';
import Progress    from './pages/Progress';
import Experiences from './pages/Experiences';
import Aptitude    from './pages/Aptitude';

function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/"         element={<Landing />} />
      <Route path="/login"    element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected — wrapped in Layout (sidebar + navbar) */}
      <Route path="/dashboard"   element={<PrivateRoute><Layout><Dashboard /></Layout></PrivateRoute>} />
      <Route path="/planly"      element={<PrivateRoute><Layout><Planly /></Layout></PrivateRoute>} />
      <Route path="/prep-hub"    element={<PrivateRoute><Layout><PrepHub /></Layout></PrivateRoute>} />
      <Route path="/companies"   element={<PrivateRoute><Layout><Companies /></Layout></PrivateRoute>} />
      <Route path="/tufy"        element={<PrivateRoute><Layout><TUFY /></Layout></PrivateRoute>} />
      <Route path="/potd"        element={<PrivateRoute><Layout><POTD /></Layout></PrivateRoute>} />
      <Route path="/notes"       element={<PrivateRoute><Layout><Notes /></Layout></PrivateRoute>} />
      <Route path="/progress"    element={<PrivateRoute><Layout><Progress /></Layout></PrivateRoute>} />
      <Route path="/experiences" element={<PrivateRoute><Layout><Experiences /></Layout></PrivateRoute>} />
      <Route path="/aptitude"    element={<PrivateRoute><Layout><Aptitude /></Layout></PrivateRoute>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
