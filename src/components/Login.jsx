import { useState } from 'react';
import { supabase } from '../supabase';

export default function Login() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    setLoading(false);
  }

  return (
    <div style={{
      display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center',
      background: 'oklch(98% 0 0)',
    }}>
      <div style={{
        background: '#fff', borderRadius: 16, padding: '40px 48px',
        boxShadow: '0 4px 24px oklch(0% 0 0 / 8%)', width: 360,
      }}>
        <h1 style={{ margin: '0 0 8px', fontSize: 22, fontWeight: 700, color: 'oklch(20% 0 0)' }}>
          Finance Tracker
        </h1>
        <p style={{ margin: '0 0 28px', fontSize: 14, color: 'oklch(55% 0 0)' }}>
          Sign in to continue
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            style={{
              padding: '10px 14px', borderRadius: 8, border: '1.5px solid oklch(88% 0 0)',
              fontSize: 14, outline: 'none', color: 'oklch(20% 0 0)',
            }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            style={{
              padding: '10px 14px', borderRadius: 8, border: '1.5px solid oklch(88% 0 0)',
              fontSize: 14, outline: 'none', color: 'oklch(20% 0 0)',
            }}
          />

          {error && (
            <p style={{ margin: 0, fontSize: 13, color: 'oklch(50% 0.2 25)' }}>{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: 4, padding: '11px', borderRadius: 8, border: 'none',
              background: 'oklch(45% 0.15 250)', color: '#fff',
              fontSize: 14, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}
