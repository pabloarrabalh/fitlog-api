import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import Toast from './components/ui/Toast';

// Pages
import LoginPage from './features/auth/LoginPage';
import RegisterPage from './features/auth/RegisterPage';
import Dashboard from './features/dashboard/Dashboard';
import ExercisesPage from './features/exercises/ExercisesPage';
import RoutinesPage from './features/routines/RoutinesPage';
import SessionsPage from './features/sessions/SessionsPage';
import SocialPage from './features/social/SocialPage';
import ProfilePage from './features/profile/ProfilePage';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F0F0F] flex items-center justify-center">
        <div className="text-[#CCFF00]">Loading...</div>
      </div>
    );
  }

  if (!user) return <Navigate to="/auth/login" />;
  return children;
};

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/auth/login" element={user ? <Navigate to="/" /> : <LoginPage />} />
      <Route path="/auth/register" element={user ? <Navigate to="/" /> : <RegisterPage />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/exercises"
        element={
          <ProtectedRoute>
            <ExercisesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/routines"
        element={
          <ProtectedRoute>
            <RoutinesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/sessions"
        element={
          <ProtectedRoute>
            <SessionsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/social"
        element={
          <ProtectedRoute>
            <SocialPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <AppRoutes />
          <Toast />
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
