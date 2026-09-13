import React from 'react';
import { LayoutDashboard, BookOpen, CheckCircle2, Calendar, Network, Zap, Sun, Moon, LogOut, User, ShieldCheck } from 'lucide-react';

export default function Header({ currentView, onChangeView, onOpenCmd, isDark, onToggleTheme, user, onLogout, onOpenMfaModal }) {
  return (
    <header className="app-header">
      <div className="brand-section">
        <div className="brand-logo">C</div>
        <div className="brand-title">Cypher LifeOS</div>
      </div>

      <nav className="nav-tabs">
        <button
          className={`nav-tab-btn ${currentView === 'home' ? 'active' : ''}`}
          onClick={() => onChangeView('home')}
        >
          <LayoutDashboard size={14} /> Home
        </button>
        <button
          className={`nav-tab-btn ${currentView === 'notes' ? 'active' : ''}`}
          onClick={() => onChangeView('notes')}
        >
          <BookOpen size={14} /> Second Brain
        </button>
        <button
          className={`nav-tab-btn ${currentView === 'tasks' ? 'active' : ''}`}
          onClick={() => onChangeView('tasks')}
        >
          <CheckCircle2 size={14} /> Tasks & Projects
        </button>
        <button
          className={`nav-tab-btn ${currentView === 'journal' ? 'active' : ''}`}
          onClick={() => onChangeView('journal')}
        >
          <Calendar size={14} /> Daily Journal
        </button>
        <button
          className={`nav-tab-btn ${currentView === 'graph' ? 'active' : ''}`}
          onClick={() => onChangeView('graph')}
        >
          <Network size={14} /> Life Graph
        </button>
      </nav>

      <div className="header-actions">
        {user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', background: 'var(--bg-card)', padding: '4px 10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <User size={13} color="var(--accent-primary)" />
            <span>{user.username || 'admin'}</span>
          </div>
        )}
        {onOpenMfaModal && (
          <button
            className="cmd-k-btn"
            onClick={onOpenMfaModal}
            title="2FA Security Settings"
            style={{ padding: '6px 10px', color: 'var(--accent-success)', borderColor: 'rgba(16, 185, 129, 0.3)', background: 'rgba(16, 185, 129, 0.08)' }}
          >
            <ShieldCheck size={14} />
            <span style={{ fontSize: '12px', fontWeight: '600' }}>2FA Security</span>
          </button>
        )}
        <button className="cmd-k-btn" onClick={onOpenCmd}>
          <Zap size={14} color="var(--accent-primary)" />
          <span>Cmd Palette</span>
          <span className="kbd-badge">⌘K</span>
        </button>
        <button className="cmd-k-btn" onClick={onToggleTheme} style={{ padding: '6px 10px' }}>
          {isDark ? <Sun size={14} /> : <Moon size={14} />}
        </button>
        {onLogout && (
          <button
            className="cmd-k-btn"
            onClick={onLogout}
            title="Log out"
            style={{ padding: '6px 10px', color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.3)' }}
          >
            <LogOut size={14} />
          </button>
        )}
      </div>
    </header>
  );
}
