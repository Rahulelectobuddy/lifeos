import React, { useState } from 'react';
import { CheckCircle2, List, Kanban, Plus, Calendar, AlertCircle } from 'lucide-react';

export default function TasksView({ tasks, projects, onAddTask }) {
  const [viewMode, setViewMode] = useState('kanban'); // 'kanban' or 'list'
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const todoTasks = tasks.filter(t => t.status === 'todo');
  const inProgressTasks = tasks.filter(t => t.status === 'in_progress');
  const completedTasks = tasks.filter(t => t.status === 'completed');

  const handleCreate = (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    if (onAddTask) {
      onAddTask({ title: newTaskTitle, status: 'todo', priority: 'high', para_category: 'Project' });
    }
    setNewTaskTitle('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-header)', fontSize: '20px', fontWeight: '700' }}>Tasks & Project Management</h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>PARA Execution Layer & Daily Workflows</p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <div className="nav-tabs">
            <button className={`nav-tab-btn ${viewMode === 'kanban' ? 'active' : ''}`} onClick={() => setViewMode('kanban')}>
              <Kanban size={14} /> Kanban Board
            </button>
            <button className={`nav-tab-btn ${viewMode === 'list' ? 'active' : ''}`} onClick={() => setViewMode('list')}>
              <List size={14} /> List View
            </button>
          </div>
        </div>
      </div>

      {/* Quick Add Task Bar */}
      <form onSubmit={handleCreate} style={{ display: 'flex', gap: '10px' }}>
        <input
          type="text"
          placeholder="Add a new priority task to project..."
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          style={{ flex: 1, padding: '10px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', outline: 'none' }}
        />
        <button type="submit" style={{ background: 'var(--accent-primary)', color: 'white', padding: '10px 18px', borderRadius: 'var(--radius-md)', fontWeight: '600', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Plus size={16} /> Add Task
        </button>
      </form>

      {/* Kanban Board Columns */}
      {viewMode === 'kanban' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          {/* TODO Column */}
          <div className="card" style={{ background: 'var(--bg-card)' }}>
            <div className="card-header" style={{ marginBottom: '12px' }}>
              <span style={{ fontWeight: '700', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-warning)' }}></span> To Do ({todoTasks.length})
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {todoTasks.map(t => (
                <div key={t.id} style={{ background: 'var(--bg-surface)', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>{t.title}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className={`badge-para badge-${t.para_category.toLowerCase()}`}>{t.para_category}</span>
                    <span style={{ fontSize: '11px', color: 'var(--priority-urgent)', fontWeight: '600' }}>{t.priority}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* IN PROGRESS Column */}
          <div className="card" style={{ background: 'var(--bg-card)' }}>
            <div className="card-header" style={{ marginBottom: '12px' }}>
              <span style={{ fontWeight: '700', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-primary)' }}></span> In Progress ({inProgressTasks.length})
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {inProgressTasks.map(t => (
                <div key={t.id} style={{ background: 'var(--bg-surface)', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>{t.title}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className={`badge-para badge-${t.para_category.toLowerCase()}`}>{t.para_category}</span>
                    <span style={{ fontSize: '11px', color: 'var(--accent-primary)', fontWeight: '600' }}>{t.priority}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* COMPLETED Column */}
          <div className="card" style={{ background: 'var(--bg-card)' }}>
            <div className="card-header" style={{ marginBottom: '12px' }}>
              <span style={{ fontWeight: '700', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-success)' }}></span> Completed ({completedTasks.length})
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {completedTasks.map(t => (
                <div key={t.id} style={{ background: 'var(--bg-surface)', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', opacity: 0.75 }}>
                  <div style={{ fontSize: '13px', fontWeight: '600', marginBottom: '8px', textDecoration: 'line-through' }}>{t.title}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className={`badge-para badge-${t.para_category.toLowerCase()}`}>{t.para_category}</span>
                    <CheckCircle2 size={14} color="var(--accent-success)" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* List View */
        <div className="card">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {tasks.map(t => (
              <div key={t.id} className={`task-item ${t.status === 'completed' ? 'completed' : ''}`}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <input type="checkbox" checked={t.status === 'completed'} readOnly style={{ accentColor: 'var(--accent-primary)', width: '16px', height: '16px' }} />
                  <span style={{ fontSize: '14px', fontWeight: '500' }}>{t.title}</span>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <span className={`badge-para badge-${t.para_category.toLowerCase()}`}>{t.para_category}</span>
                  <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)' }}>{t.due_date || 'Today'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
