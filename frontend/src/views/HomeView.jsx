import React from 'react';
import { Layers, CheckCircle2, BookOpen, Clock, ArrowRight, Zap, Target } from 'lucide-react';

export default function HomeView({ notes, tasks, projects, onNavigate, onUpdateTask }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Hero Command Header */}
      <div className="card" style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(14,165,233,0.08))', borderColor: 'rgba(99,102,241,0.2)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-header)', fontSize: '24px', fontWeight: '700', marginBottom: '4px' }}>
              Welcome back to Cypher LifeOS 👋
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
              Universal Knowledge Hub & PARA Execution System — <strong>Web Phase 1 Active</strong>
            </p>
          </div>
          <button className="cmd-k-btn" onClick={() => onNavigate('command_palette')}>
            <Zap size={14} color="var(--accent-primary)" />
            <span>Command Center</span>
            <span className="kbd-badge">⌘K</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        <div className="card" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--para-project)' }}>
            <span style={{ fontSize: '13px', fontWeight: '600' }}>Active Projects</span>
            <Target size={18} />
          </div>
          <div style={{ fontSize: '28px', fontWeight: '700', fontFamily: 'var(--font-header)', marginTop: '8px' }}>
            {projects.length || 3}
          </div>
        </div>

        <div className="card" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--para-resource)' }}>
            <span style={{ fontSize: '13px', fontWeight: '600' }}>Second Brain Notes</span>
            <BookOpen size={18} />
          </div>
          <div style={{ fontSize: '28px', fontWeight: '700', fontFamily: 'var(--font-header)', marginTop: '8px' }}>
            {notes.length || 3}
          </div>
        </div>

        <div className="card" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--accent-success)' }}>
            <span style={{ fontSize: '13px', fontWeight: '600' }}>Execution Tasks</span>
            <CheckCircle2 size={18} />
          </div>
          <div style={{ fontSize: '28px', fontWeight: '700', fontFamily: 'var(--font-header)', marginTop: '8px' }}>
            {tasks.length || 5}
          </div>
        </div>

        <div className="card" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--accent-warning)' }}>
            <span style={{ fontSize: '13px', fontWeight: '600' }}>Daily Streak</span>
            <Zap size={18} />
          </div>
          <div style={{ fontSize: '28px', fontWeight: '700', fontFamily: 'var(--font-header)', marginTop: '8px' }}>
            14 Days 🔥
          </div>
        </div>
      </div>

      {/* Main Grid: Projects & Active Tasks */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* PARA Active Projects */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">PARA Active Projects</h3>
            <button style={{ color: 'var(--accent-primary)', fontSize: '13px', fontWeight: '600' }} onClick={() => onNavigate('tasks')}>
              View All <ArrowRight size={12} inline="true" />
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {projects.map((p) => (
              <div key={p.id} style={{ padding: '12px', background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontWeight: '600', fontSize: '14px' }}>{p.title}</span>
                  <span className="badge-para badge-project">{p.progress}%</span>
                </div>
                <div style={{ height: '6px', width: '100%', background: 'var(--bg-hover)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${p.progress}%`, background: 'var(--para-project)', borderRadius: '3px' }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Today's Priority Execution */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Today's Priority Checklist</h3>
            <button style={{ color: 'var(--accent-primary)', fontSize: '13px', fontWeight: '600' }} onClick={() => onNavigate('tasks')}>
              Manage Tasks <ArrowRight size={12} />
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {tasks.slice(0, 4).map((t) => (
              <div key={t.id} className={`task-item ${t.status === 'completed' ? 'completed' : ''}`}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <input
                    type="checkbox"
                    checked={t.status === 'completed'}
                    onChange={(e) => {
                      if (onUpdateTask) {
                        onUpdateTask(t.id, { status: e.target.checked ? 'completed' : 'todo' });
                      }
                    }}
                    style={{ accentColor: 'var(--accent-primary)', width: '16px', height: '16px', cursor: 'pointer' }}
                  />
                  <span style={{ fontSize: '13px', fontWeight: '500' }}>{t.title}</span>
                </div>
                <span className={`badge-para badge-${t.para_category ? t.para_category.toLowerCase() : 'project'}`}>{t.priority}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
