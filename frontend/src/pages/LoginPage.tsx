import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth, apiFetch } from '../auth/AuthContext';
import { AuthLayout } from '../components/AuthLayout';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
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

      const state = location.state as any;
      const redirectTo = state?.from || '/rooms';
      navigate(redirectTo);
    } catch (err: any) {
      setError(err.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Use the demo account or your own credentials to access your workspace bookings."
      footer={
        <>
          Don&apos;t have an account? <Link to="/register">Create one</Link>
        </>
      }
    >
      <form onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="demo@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>

        <div className="field" style={{ marginTop: 10 }}>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="••••••••"
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
          {loading ? 'Logging in…' : 'Login'}
        </button>

        <p
          style={{
            marginTop: 10,
            fontSize: '12px',
            color: 'var(--text-muted)',
          }}
        >
          Demo user: demo@example.com / demo1234
        </p>
      </form>
    </AuthLayout>
  );
}
