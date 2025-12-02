// src/pages/RegisterPage.tsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { apiFetch, useAuth } from '../auth/AuthContext';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await apiFetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email, fullName, password }),
      });

      // אחרי רישום – עושים login
      const data = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      login(data.accessToken, data.user);
      navigate('/rooms');
    } catch (err: any) {
      setError(err.message || 'Failed to register');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form
        onSubmit={handleSubmit}
        style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxWidth: 300 }}
      >
        <input
          type="text"
          placeholder="full name"
          value={fullName}
          onChange={e => setFullName(e.target.value)}
        />
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
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
      <p style={{ marginTop: '1rem' }}>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}
