import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { apiFetch, useAuth } from '../auth/AuthContext';
import { AuthLayout } from '../components/AuthLayout';

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
    <AuthLayout
      title="Create your account"
      subtitle="Sign up to manage workspace bookings and keep everything in one place."
      footer={
        <>
          Already have an account? <Link to="/login">Log in</Link>
        </>
      }
    >
      <form onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="fullName">Full name</label>
          <input
            id="fullName"
            type="text"
            placeholder="Jane Doe"
            value={fullName}
            onChange={e => setFullName(e.target.value)}
          />
        </div>

        <div className="field" style={{ marginTop: 10 }}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>

        <div className="field" style={{ marginTop: 10 }}>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Choose a secure password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>

        {error && (
          <div
            style={{
              marginTop: 8,
              fontSize: '13px',
              color: 'var(--danger)',
            }}
          >
            {error}
          </div>
        )}

        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
          style={{ marginTop: 16, width: '100%', justifyContent: 'center' }}
        >
          {loading ? 'Registering…' : 'Register'}
        </button>
      </form>
    </AuthLayout>
  );
}
