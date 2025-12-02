// src/pages/LoginPage.tsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth, apiFetch } from '../auth/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('demo@example.com');
  const [password, setPassword] = useState('demo1234');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const data = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      login(data.accessToken, data.user);
      navigate('/rooms');
    } catch (err: any) {
      setError(err.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <p>You can use the seeded demo user: demo@example.com / demo1234</p>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxWidth: 300 }}>
        <input
          type="email"
          placeholder="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        {error && <div style={{ color: 'red' }}>{error}</div>}

        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <p style={{ marginTop: '1rem' }}>
        Don&apos;t have an account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
}
