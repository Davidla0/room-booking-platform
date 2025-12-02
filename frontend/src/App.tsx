// src/App.tsx
import React from 'react';
import { Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './auth/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import RoomsPage from './pages/RoomsPage';
import MyBookingsPage from './pages/MyBookingsPage';

function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '1rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <nav style={{ display: 'flex', gap: '1rem' }}>
          <Link to="/rooms">Rooms</Link>
          {user && <Link to="/bookings">My Bookings</Link>}
        </nav>
        <div>
          {user ? (
            <>
              <span style={{ marginRight: '1rem' }}>{user.fullName}</span>
              <button onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ marginRight: '1rem' }}>Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </div>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Navigate to="/rooms" />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/rooms" element={<RoomsPage />} />
          <Route path="/bookings" element={
            <RequireAuth>
              <MyBookingsPage />
            </RequireAuth>
          } />
          <Route path="*" element={<div>Not found</div>} />
        </Routes>
      </main>
    </div>
  );
}

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

export default function RootApp() {
  return (
    <AuthProvider>
      <Layout />
    </AuthProvider>
  );
}
