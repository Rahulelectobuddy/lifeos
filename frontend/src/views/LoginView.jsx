import React, { useState } from 'react';
import { Lock, User, KeyRound, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

export default function LoginView({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const fillDemo = () => {
    setUsername('admin');
    setPassword('admin123');
    setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setErrorMsg('Please enter both username and password.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), password: password.trim() })
      });

      if (res.ok) {
        const data = await res.json();
        if (onLoginSuccess) {
          onLoginSuccess(data.access_token, data.user);
        }
      } else {
        const errData = await res.json().catch(() => ({}));
        setErrorMsg(errData.detail || 'Invalid username or password credentials.');
      }
    } catch (err) {
      console.error('Login request failed:', err);
      // Fallback for offline client demo
      if (username.trim() === 'admin' && password.trim() === 'admin123') {
        const dummyToken = 'jwt_demo_token_cypher_lifeos';
        const dummyUser = { username: 'admin', name: 'Cypher Administrator', email: 'admin@lifeos.dev', role: 'admin' };
        if (onLoginSuccess) {
          onLoginSuccess(dummyToken, dummyUser);
        }
      } else {
        setErrorMsg('Network error. Use demo credentials (admin / admin123).');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      width: '100vw',
      background: 'radial-gradient(circle at 50% 30%, rgba(99, 102, 241, 0.15) 0%, rgba(15, 23, 42, 1) 80%)',
      color: 'var(--text-primary)',
      fontFamily: 'var(--font-sans)',
      padding: '20px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '440px',
        background: 'rgba(30, 41, 59, 0.7)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        borderRadius: '16px',
        padding: '36px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 30px rgba(99, 102, 241, 0.2)',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px'
      }}>
        {/* Brand Header */}
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #6366f1, #0ea5e9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            boxShadow: '0 8px 20px rgba(99, 102, 241, 0.4)',
            color: 'white',
            fontWeight: '900',
            fontSize: '24px',
            fontFamily: 'var(--font-header)'
          }}>
            C
          </div>
          <h1 style={{ fontFamily: 'var(--font-header)', fontSize: '24px', fontWeight: '700', letterSpacing: '-0.02em', marginBottom: '6px' }}>
            Cypher LifeOS
          </h1>
          <p style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.6)' }}>
            JWT Protected System Authentication
          </p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div style={{
            padding: '12px 14px',
            borderRadius: '8px',
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#f87171',
            fontSize: '13px',
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <ShieldCheck size={16} />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '12px', fontWeight: '600', color: 'rgba(255, 255, 255, 0.7)', display: 'block', marginBottom: '6px' }}>
              Username
            </label>
            <div style={{ position: 'relative' }}>
              <User size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255, 255, 255, 0.4)' }} />
              <input
                type="text"
                placeholder="Enter username (e.g. admin)"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '12px 12px 12px 38px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  background: 'rgba(15, 23, 42, 0.6)',
                  color: 'white',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'border 0.2s ease'
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: '600', color: 'rgba(255, 255, 255, 0.7)', display: 'block', marginBottom: '6px' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <KeyRound size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255, 255, 255, 0.4)' }} />
              <input
                type="password"
                placeholder="Enter password (e.g. admin123)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '12px 12px 12px 38px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  background: 'rgba(15, 23, 42, 0.6)',
                  color: 'white',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'border 0.2s ease'
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              marginTop: '8px',
              padding: '12px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
              color: 'white',
              fontWeight: '600',
              fontSize: '14px',
              border: 'none',
              cursor: isLoading ? 'wait' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)',
              transition: 'transform 0.15s ease'
            }}
          >
            {isLoading ? 'Authenticating...' : (
              <>
                Sign In to LifeOS <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* Demo Helper box */}
        <div style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          paddingTop: '16px',
          display: 'flex',
          justifySpace: 'between',
          alignItems: 'center'
        }}>
          <div>
            <div style={{ fontSize: '11px', fontWeight: '600', color: 'rgba(255, 255, 255, 0.5)' }}>Demo Access Account</div>
            <div style={{ fontSize: '12px', color: '#818cf8', fontWeight: '600', marginTop: '2px' }}>
              admin / admin123
            </div>
          </div>

          <button
            onClick={fillDemo}
            type="button"
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              border: '1px solid rgba(99, 102, 241, 0.4)',
              background: 'rgba(99, 102, 241, 0.15)',
              color: '#a5b4fc',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <Zap size={12} /> Auto-Fill
          </button>
        </div>
      </div>
    </div>
  );
}
