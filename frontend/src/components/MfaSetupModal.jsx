import React, { useState, useEffect } from 'react';
import { ShieldCheck, ShieldAlert, X, Copy, Check, QrCode, RefreshCw, Lock, Key } from 'lucide-react';

export default function MfaSetupModal({ isOpen, onClose, apiFetch }) {
  const [mfaStatus, setMfaStatus] = useState(false);
  const [setupData, setSetupData] = useState(null);
  const [verifyCode, setVerifyCode] = useState('');

  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchStatus();
    } else {
      setSetupData(null);
      setVerifyCode('');
      setErrorMsg('');
      setSuccessMsg('');
    }
  }, [isOpen]);

  const fetchStatus = async () => {
    try {
      const fetchFn = apiFetch || fetch;
      const res = await fetchFn('/api/v1/auth/mfa/status');
      if (res.ok) {
        const data = await res.json();
        setMfaStatus(data.mfa_enabled);
      }
    } catch (e) {
      console.error('Failed to fetch MFA status:', e);
    }
  };

  const handleStartSetup = async () => {
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const fetchFn = apiFetch || fetch;
      const res = await fetchFn('/api/v1/auth/mfa/setup', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setSetupData(data);
      } else {
        setErrorMsg('Failed to initialize 2FA setup.');
      }
    } catch (e) {
      setErrorMsg('Error generating 2FA secret.');
    } finally {
      setLoading(false);
    }
  };

  const handleEnableMfa = async (e) => {
    e.preventDefault();
    if (!verifyCode.trim() || !setupData) return;

    setLoading(true);
    setErrorMsg('');

    try {
      const fetchFn = apiFetch || fetch;
      const res = await fetchFn('/api/v1/auth/mfa/enable', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secret: setupData.secret, code: verifyCode.trim() })
      });

      if (res.ok) {
        setMfaStatus(true);
        setSuccessMsg('Google Authenticator / Authy 2FA has been successfully activated!');
        setSetupData(null);
        setVerifyCode('');
      } else {
        const err = await res.json().catch(() => ({}));
        setErrorMsg(err.detail || 'Invalid 6-digit TOTP passcode.');
      }
    } catch (e) {
      setErrorMsg('Failed to enable 2FA.');
    } finally {
      setLoading(false);
    }
  };

  const handleDisableMfa = async () => {
    setLoading(true);
    setErrorMsg('');

    try {
      const fetchFn = apiFetch || fetch;
      const res = await fetchFn('/api/v1/auth/mfa/disable', { method: 'POST' });
      if (res.ok) {
        setMfaStatus(false);
        setSuccessMsg('2FA security has been disabled.');
        setSetupData(null);
      }
    } catch (e) {
      setErrorMsg('Failed to disable 2FA.');
    } finally {
      setLoading(false);
    }
  };

  const copySecret = () => {
    if (setupData?.secret) {
      navigator.clipboard.writeText(setupData.secret);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.6)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1100,
      padding: '20px'
    }}>
      <div className="card" style={{
        width: '100%',
        maxWidth: '500px',
        background: 'var(--bg-surface)',
        borderRadius: 'var(--radius-lg)',
        padding: '24px',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)',
        display: 'flex',
        flexDirection: 'column',
        gap: '18px'
      }}>
        {/* Modal Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ padding: '8px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.12)', color: 'var(--accent-success)' }}>
              <ShieldCheck size={20} />
            </div>
            <div>
              <h3 style={{ fontWeight: '700', fontSize: '16px', color: 'var(--text-primary)' }}>Two-Factor Authentication (2FA)</h3>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Google Authenticator / Authy TOTP Setup</p>
            </div>
          </div>

          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* Status indicator */}
        <div style={{
          padding: '12px 16px',
          borderRadius: 'var(--radius-md)',
          background: mfaStatus ? 'rgba(16, 185, 129, 0.1)' : 'var(--bg-card)',
          border: mfaStatus ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {mfaStatus ? <ShieldCheck size={18} color="var(--accent-success)" /> : <ShieldAlert size={18} color="var(--text-muted)" />}
            <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)' }}>
              MFA Status: {mfaStatus ? 'Active & Enforced' : 'Inactive'}
            </span>
          </div>

          {mfaStatus && (
            <button
              onClick={handleDisableMfa}
              disabled={loading}
              style={{
                padding: '4px 10px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                background: 'rgba(239, 68, 68, 0.1)',
                color: '#ef4444',
                fontSize: '11px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Disable 2FA
            </button>
          )}
        </div>

        {/* Alert Messages */}
        {errorMsg && (
          <div style={{ padding: '10px 12px', borderRadius: 'var(--radius-md)', background: 'rgba(239, 68, 68, 0.12)', color: '#f87171', fontSize: '12px', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div style={{ padding: '10px 12px', borderRadius: 'var(--radius-md)', background: 'rgba(16, 185, 129, 0.12)', color: 'var(--accent-success)', fontSize: '12px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
            {successMsg}
          </div>
        )}

        {/* Setup Flow */}
        {!setupData && !mfaStatus && (
          <button
            onClick={handleStartSetup}
            disabled={loading}
            style={{
              padding: '12px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--accent-primary)',
              color: 'white',
              fontWeight: '600',
              fontSize: '13px',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <QrCode size={16} /> Setup Google Authenticator / Authy App
          </button>
        )}

        {setupData && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', background: 'var(--bg-card)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '600' }}>
              1. Scan URI or copy Secret Key into your Authenticator app:
            </div>

            {/* Secret key box */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-surface)', padding: '10px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Key size={16} color="var(--accent-primary)" />
                <span style={{ fontFamily: 'monospace', fontWeight: '700', fontSize: '14px', letterSpacing: '1.5px', color: 'var(--accent-primary)' }}>
                  {setupData.secret}
                </span>
              </div>
              <button
                onClick={copySecret}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px' }}
              >
                {copied ? <Check size={14} color="var(--accent-success)" /> : <Copy size={14} />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>

            {/* Live Demo Code badge for instant testing */}
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>Live Generated Test TOTP Code:</span>
              <span style={{ fontFamily: 'monospace', fontWeight: '700', color: 'var(--accent-success)', background: 'rgba(16, 185, 129, 0.1)', padding: '2px 6px', borderRadius: '4px' }}>
                {setupData.current_code}
              </span>
            </div>

            <form onSubmit={handleEnableMfa} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)' }}>
                2. Enter 6-digit TOTP code from app to activate:
              </label>

              <div style={{ display: 'flex', gap: '10px' }}>
                <input
                  type="text"
                  maxLength={6}
                  placeholder="123456"
                  value={verifyCode}
                  onChange={(e) => setVerifyCode(e.target.value)}
                  required
                  style={{
                    flex: 1,
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--accent-primary)',
                    background: 'var(--bg-surface)',
                    color: 'var(--text-primary)',
                    fontFamily: 'monospace',
                    fontSize: '16px',
                    fontWeight: '700',
                    letterSpacing: '2px',
                    outline: 'none'
                  }}
                />
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    padding: '10px 18px',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--accent-success)',
                    color: 'white',
                    fontWeight: '600',
                    fontSize: '13px',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  Verify & Activate 2FA
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
