import React from 'react';
import { Routes, Route, Link, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './auth/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import RoomsPage from './pages/RoomsPage';
import MyBookingsPage from './pages/MyBookingsPage';
import './App.css';

function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const pathname = location.pathname;
  const isRooms = pathname.startsWith('/rooms') || pathname === '/';
  const isBookings = pathname.startsWith('/bookings');

  return (
    <div className="app-shell">
      {/* Header */}
      <header className="app-header">
        <div className="app-header-inner">
          {/* Logo */}
          <div className="app-logo">
            <div className="app-logo-badge">RB</div>
            <div className="app-logo-text">
              <span>Room Booking</span>
              <span>technical home assignment</span>
            </div>
          </div>

          {/* Nav + user */}
          <nav className="app-nav">
            <div className="app-nav-links">
              <Link
                to="/rooms"
                className={`app-nav-link ${isRooms ? 'active' : ''}`}
              >
                Rooms
              </Link>

              {user && (
                <Link
                  to="/bookings"
                  className={`app-nav-link ${isBookings ? 'active' : ''}`}
                >
                  My bookings
                </Link>
              )}
            </div>

            <div className="app-user">
              {user ? (
                <>
                  <span className="app-user-name">{user.fullName}</span>
                  <button className="btn btn-outline" onClick={handleLogout}>
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="app-nav-link">
                    Login
                  </Link>
                  <Link to="/register" className="app-nav-link">
                    Register
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="app-main">
        <div className="app-main-inner">
          <Routes>
            <Route path="/" element={<Navigate to="/rooms" />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/rooms" element={<RoomsPage />} />
            <Route
              path="/bookings"
              element={
                <RequireAuth>
                  <MyBookingsPage />
                </RequireAuth>
              }
            />
            <Route path="*" element={<div>Not found</div>} />
          </Routes>
        </div>
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
