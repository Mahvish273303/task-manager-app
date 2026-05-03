import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import Landing from './pages/Landing.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';

// ── Route guards ────────────────────────────────────────────────────────────

/** Requires authentication. Unauthenticated → /login */
function ProtectedRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

/** Requires Admin role. Members are redirected to their dashboard. */
function AdminRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'Admin') return <Navigate to="/dashboard/member" replace />;
  return children;
}

/** Requires Member role. Admins are redirected to their dashboard. */
function MemberRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'Admin') return <Navigate to="/dashboard/admin" replace />;
  return children;
}

/**
 * /dashboard — smart redirect based on role.
 * Unauthenticated → /login, Admin → /dashboard/admin, Member → /dashboard/member
 */
function DashboardRedirect() {
  const { user, isAdmin } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={isAdmin ? '/dashboard/admin' : '/dashboard/member'} replace />;
}

// ── Routes ──────────────────────────────────────────────────────────────────

function AppRoutes() {
  return (
    <Routes>
      {/* Public — always accessible */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Smart redirect: /dashboard → role-specific URL */}
      <Route path="/dashboard" element={<DashboardRedirect />} />

      {/* Role-protected dashboards */}
      <Route
        path="/dashboard/admin"
        element={<AdminRoute><Dashboard /></AdminRoute>}
      />
      <Route
        path="/dashboard/member"
        element={<MemberRoute><Dashboard /></MemberRoute>}
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
