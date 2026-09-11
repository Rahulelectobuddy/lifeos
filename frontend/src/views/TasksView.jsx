import React, { useState } from 'react';
import {
  CheckCircle2, List, Kanban, Plus, Calendar, AlertCircle, Trash2,
  FolderPlus, ArrowLeft, ArrowRight, Filter, Search, SlidersHorizontal, Clock, Target
} from 'lucide-react';

export default function TasksView({
  tasks = [],
  projects = [],
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  onAddProject,
  onUpdateProject,
  onDeleteProject
}) {
  const [viewMode, setViewMode] = useState('kanban'); // 'kanban', 'list', 'projects'
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // New task form state
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState('medium');
  const [newTaskCategory, setNewTaskCategory] = useState('Project');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  const [showTaskForm, setShowTaskForm] = useState(false);

  // New project form state
  const [newProjTitle, setNewProjTitle] = useState('');
  const [newProjDesc, setNewProjDesc] = useState('');
  const [newProjTargetDate, setNewProjTargetDate] = useState('');
  const [showProjForm, setShowProjForm] = useState(false);

  // Drag and drop state
  const [draggedTaskId, setDraggedTaskId] = useState(null);

  // Filter tasks
  const filteredTasks = tasks.filter(t => {
    const matchesCategory = filterCategory === 'ALL' || (t.para_category && t.para_category.toUpperCase() === filterCategory.toUpperCase());
    const matchesSearch = !searchQuery.trim() || t.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const todoTasks = filteredTasks.filter(t => t.status === 'todo');
  const inProgressTasks = filteredTasks.filter(t => t.status === 'in_progress');
  const completedTasks = filteredTasks.filter(t => t.status === 'completed');

  // Handle Task Creation
  const handleCreateTask = (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    if (onAddTask) {
      onAddTask({
        title: newTaskTitle.trim(),
        status: 'todo',
        priority: newTaskPriority,
        para_category: newTaskCategory,
        due_date: newTaskDueDate || null
      });
    }

    setNewTaskTitle('');
    setNewTaskDueDate('');
    setShowTaskForm(false);
  };

  // Handle Project Creation
  const handleCreateProject = (e) => {
    e.preventDefault();
    if (!newProjTitle.trim()) return;

    if (onAddProject) {
      onAddProject({
        title: newProjTitle.trim(),
        description: newProjDesc.trim(),
        target_date: newProjTargetDate || null,
        progress: 0,
        status: 'active'
      });
    }

    setNewProjTitle('');
    setNewProjDesc('');
    setNewProjTargetDate('');
    setShowProjForm(false);
  };

  // Drag & Drop handlers
  const handleDragStart = (e, taskId) => {
    e.dataTransfer.setData('text/plain', taskId);
    setDraggedTaskId(taskId);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, newStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain') || draggedTaskId;
    if (taskId && onUpdateTask) {
      onUpdateTask(taskId, { status: newStatus });
    }
    setDraggedTaskId(null);
  };

  // Priority Color helper
  const getPriorityStyle = (priority) => {
    switch (priority ? priority.toLowerCase() : 'medium') {
      case 'urgent':
        return { color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)', bg: 'rgba(239,68,68,0.1)' };
      case 'high':
        return { color: '#f97316', border: '1px solid rgba(249,115,22,0.3)', bg: 'rgba(249,115,22,0.1)' };
      case 'medium':
        return { color: '#3b82f6', border: '1px solid rgba(59,130,246,0.3)', bg: 'rgba(59,130,246,0.1)' };
      case 'low':
      default:
        return { color: '#10b981', border: '1px solid rgba(16,185,129,0.3)', bg: 'rgba(16,185,129,0.1)' };
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-header)', fontSize: '20px', fontWeight: '700' }}>Tasks & Project Management</h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>PARA Execution Layer & Daily Workflows</p>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <div className="nav-tabs">
            <button
              className={`nav-tab-btn ${viewMode === 'kanban' ? 'active' : ''}`}
              onClick={() => setViewMode('kanban')}
            >
              <Kanban size={14} /> Kanban Board
            </button>
            <button
              className={`nav-tab-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
            >
              <List size={14} /> List View
            </button>
            <button
              className={`nav-tab-btn ${viewMode === 'projects' ? 'active' : ''}`}
              onClick={() => setViewMode('projects')}
            >
              <Target size={14} /> Projects ({projects.length})
            </button>
          </div>

          {viewMode !== 'projects' ? (
            <button
              onClick={() => setShowTaskForm(!showTaskForm)}
              style={{
                background: 'var(--accent-primary)',
                color: 'white',
                padding: '8px 14px',
                borderRadius: 'var(--radius-md)',
                fontWeight: '600',
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
                border: 'none'
              }}
            >
              <Plus size={16} /> New Task
            </button>
          ) : (
            <button
              onClick={() => setShowProjForm(!showProjForm)}
              style={{
                background: 'var(--accent-primary)',
                color: 'white',
                padding: '8px 14px',
                borderRadius: 'var(--radius-md)',
                fontWeight: '600',
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
                border: 'none'
              }}
            >
              <FolderPlus size={16} /> New Project
            </button>
          )}
        </div>
      </div>

      {/* Task Creation Modal / Expandable Card */}
      {showTaskForm && viewMode !== 'projects' && (
        <div className="card" style={{ background: 'var(--bg-surface)', border: '1px solid var(--accent-primary)', padding: '16px' }}>
          <form onSubmit={handleCreateTask} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ fontWeight: '600', fontSize: '14px' }}>Create New Priority Task</div>
            <input
              type="text"
              placeholder="Task title..."
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              required
              autoFocus
              style={{
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
                background: 'var(--bg-card)',
                color: 'var(--text-primary)',
                outline: 'none',
                width: '100%'
              }}
            />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Priority</label>
                <select
                  value={newTaskPriority}
                  onChange={(e) => setNewTaskPriority(e.target.value)}
                  style={{ width: '100%', padding: '8px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', background: 'var(--bg-card)', color: 'var(--text-primary)' }}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>PARA Category</label>
                <select
                  value={newTaskCategory}
                  onChange={(e) => setNewTaskCategory(e.target.value)}
                  style={{ width: '100%', padding: '8px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', background: 'var(--bg-card)', color: 'var(--text-primary)' }}
                >
                  <option value="Project">Project</option>
                  <option value="Area">Area</option>
                  <option value="Resource">Resource</option>
                  <option value="Archive">Archive</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Due Date</label>
                <input
                  type="date"
                  value={newTaskDueDate}
                  onChange={(e) => setNewTaskDueDate(e.target.value)}
                  style={{ width: '100%', padding: '8px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', background: 'var(--bg-card)', color: 'var(--text-primary)' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '4px' }}>
              <button
                type="button"
                onClick={() => setShowTaskForm(false)}
                style={{ padding: '8px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', background: 'transparent', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                style={{ padding: '8px 18px', borderRadius: 'var(--radius-md)', background: 'var(--accent-primary)', color: 'white', border: 'none', fontWeight: '600', cursor: 'pointer' }}
              >
                Add Task
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Project Creation Form */}
      {showProjForm && viewMode === 'projects' && (
        <div className="card" style={{ background: 'var(--bg-surface)', border: '1px solid var(--accent-primary)', padding: '16px' }}>
          <form onSubmit={handleCreateProject} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ fontWeight: '600', fontSize: '14px' }}>Create New PARA Project</div>
            <input
              type="text"
              placeholder="Project title..."
              value={newProjTitle}
              onChange={(e) => setNewProjTitle(e.target.value)}
              required
              autoFocus
              style={{
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
                background: 'var(--bg-card)',
                color: 'var(--text-primary)',
                outline: 'none',
                width: '100%'
              }}
            />
            <textarea
              placeholder="Project description or deliverables..."
              value={newProjDesc}
              onChange={(e) => setNewProjDesc(e.target.value)}
              rows={2}
              style={{
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
                background: 'var(--bg-card)',
                color: 'var(--text-primary)',
                outline: 'none',
                width: '100%',
                resize: 'vertical'
              }}
            />
            <div>
              <label style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Target Completion Date</label>
              <input
                type="date"
                value={newProjTargetDate}
                onChange={(e) => setNewProjTargetDate(e.target.value)}
                style={{ width: '100%', padding: '8px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', background: 'var(--bg-card)', color: 'var(--text-primary)' }}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '4px' }}>
              <button
                type="button"
                onClick={() => setShowProjForm(false)}
                style={{ padding: '8px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', background: 'transparent', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                style={{ padding: '8px 18px', borderRadius: 'var(--radius-md)', background: 'var(--accent-primary)', color: 'white', border: 'none', fontWeight: '600', cursor: 'pointer' }}
              >
                Create Project
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filter and Search Bar (For tasks) */}
      {viewMode !== 'projects' && (
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px 8px 34px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
                background: 'var(--bg-surface)',
                color: 'var(--text-primary)',
                fontSize: '13px',
                outline: 'none'
              }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Filter size={14} color="var(--text-muted)" />
            {['ALL', 'PROJECT', 'AREA', 'RESOURCE', 'ARCHIVE'].map(cat => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                style={{
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '11px',
                  fontWeight: '600',
                  border: '1px solid var(--border-subtle)',
                  background: filterCategory === cat ? 'var(--accent-primary)' : 'var(--bg-surface)',
                  color: filterCategory === cat ? 'white' : 'var(--text-secondary)',
                  cursor: 'pointer'
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* VIEW: KANBAN BOARD */}
      {viewMode === 'kanban' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          {/* TO DO Column */}
          <div
            className="card"
            style={{ background: 'var(--bg-card)', minHeight: '380px', display: 'flex', flexDirection: 'column' }}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, 'todo')}
          >
            <div className="card-header" style={{ marginBottom: '12px' }}>
              <span style={{ fontWeight: '700', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-warning)' }}></span>
                To Do ({todoTasks.length})
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
              {todoTasks.length === 0 ? (
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', textAlign: 'center', padding: '24px 0', border: '1px dashed var(--border-subtle)', borderRadius: 'var(--radius-md)' }}>
                  Drop tasks here or add a new task
                </div>
              ) : (
                todoTasks.map(t => {
                  const pStyle = getPriorityStyle(t.priority);
                  return (
                    <div
                      key={t.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, t.id)}
                      style={{
                        background: 'var(--bg-surface)',
                        padding: '12px',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-subtle)',
                        cursor: 'grab',
                        transition: 'transform 0.15s ease, box-shadow 0.15s ease'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px', gap: '8px' }}>
                        <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)' }}>{t.title}</span>
                        {onDeleteTask && (
                          <button
                            onClick={() => onDeleteTask(t.id)}
                            title="Delete task"
                            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '2px' }}
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', flexWrap: 'wrap', gap: '6px' }}>
                        <span className={`badge-para badge-${t.para_category ? t.para_category.toLowerCase() : 'project'}`}>
                          {t.para_category || 'Project'}
                        </span>
                        <span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '4px', fontWeight: '600', background: pStyle.bg, color: pStyle.color, border: pStyle.border }}>
                          {t.priority || 'medium'}
                        </span>
                      </div>

                      {/* Quick Move Button Row */}
                      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px', gap: '6px' }}>
                        <button
                          onClick={() => onUpdateTask && onUpdateTask(t.id, { status: 'in_progress' })}
                          style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '4px', border: '1px solid var(--border-subtle)', background: 'var(--bg-card)', color: 'var(--accent-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                        >
                          Start <ArrowRight size={10} />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* IN PROGRESS Column */}
          <div
            className="card"
            style={{ background: 'var(--bg-card)', minHeight: '380px', display: 'flex', flexDirection: 'column' }}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, 'in_progress')}
          >
            <div className="card-header" style={{ marginBottom: '12px' }}>
              <span style={{ fontWeight: '700', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-primary)' }}></span>
                In Progress ({inProgressTasks.length})
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
              {inProgressTasks.length === 0 ? (
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', textAlign: 'center', padding: '24px 0', border: '1px dashed var(--border-subtle)', borderRadius: 'var(--radius-md)' }}>
                  Drop active tasks here
                </div>
              ) : (
                inProgressTasks.map(t => {
                  const pStyle = getPriorityStyle(t.priority);
                  return (
                    <div
                      key={t.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, t.id)}
                      style={{
                        background: 'var(--bg-surface)',
                        padding: '12px',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--accent-primary)',
                        cursor: 'grab'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px', gap: '8px' }}>
                        <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)' }}>{t.title}</span>
                        {onDeleteTask && (
                          <button
                            onClick={() => onDeleteTask(t.id)}
                            title="Delete task"
                            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '2px' }}
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', flexWrap: 'wrap', gap: '6px' }}>
                        <span className={`badge-para badge-${t.para_category ? t.para_category.toLowerCase() : 'project'}`}>
                          {t.para_category || 'Project'}
                        </span>
                        <span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '4px', fontWeight: '600', background: pStyle.bg, color: pStyle.color, border: pStyle.border }}>
                          {t.priority || 'medium'}
                        </span>
                      </div>

                      {/* Quick Move Action Buttons */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', gap: '6px' }}>
                        <button
                          onClick={() => onUpdateTask && onUpdateTask(t.id, { status: 'todo' })}
                          style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '4px', border: '1px solid var(--border-subtle)', background: 'var(--bg-card)', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                        >
                          <ArrowLeft size={10} /> To Do
                        </button>
                        <button
                          onClick={() => onUpdateTask && onUpdateTask(t.id, { status: 'completed' })}
                          style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '4px', border: 'none', background: 'var(--accent-success)', color: 'white', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                        >
                          Complete <CheckCircle2 size={10} />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* COMPLETED Column */}
          <div
            className="card"
            style={{ background: 'var(--bg-card)', minHeight: '380px', display: 'flex', flexDirection: 'column' }}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, 'completed')}
          >
            <div className="card-header" style={{ marginBottom: '12px' }}>
              <span style={{ fontWeight: '700', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-success)' }}></span>
                Completed ({completedTasks.length})
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
              {completedTasks.length === 0 ? (
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', textAlign: 'center', padding: '24px 0', border: '1px dashed var(--border-subtle)', borderRadius: 'var(--radius-md)' }}>
                  Drop finished tasks here
                </div>
              ) : (
                completedTasks.map(t => (
                  <div
                    key={t.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, t.id)}
                    style={{
                      background: 'var(--bg-surface)',
                      padding: '12px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-subtle)',
                      opacity: 0.8,
                      cursor: 'grab'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px', gap: '8px' }}>
                      <span style={{ fontSize: '13px', fontWeight: '600', textDecoration: 'line-through', color: 'var(--text-muted)' }}>
                        {t.title}
                      </span>
                      {onDeleteTask && (
                        <button
                          onClick={() => onDeleteTask(t.id)}
                          title="Delete task"
                          style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '2px' }}
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                      <span className={`badge-para badge-${t.para_category ? t.para_category.toLowerCase() : 'project'}`}>
                        {t.para_category || 'Project'}
                      </span>
                      <button
                        onClick={() => onUpdateTask && onUpdateTask(t.id, { status: 'in_progress' })}
                        style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '4px', border: '1px solid var(--border-subtle)', background: 'var(--bg-card)', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                      >
                        <ArrowLeft size={10} /> Reopen
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* VIEW: LIST VIEW */}
      {viewMode === 'list' && (
        <div className="card">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {filteredTasks.length === 0 ? (
              <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
                No tasks match your current filter.
              </div>
            ) : (
              filteredTasks.map(t => {
                const pStyle = getPriorityStyle(t.priority);
                return (
                  <div
                    key={t.id}
                    className={`task-item ${t.status === 'completed' ? 'completed' : ''}`}
                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', borderRadius: 'var(--radius-md)', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <input
                        type="checkbox"
                        checked={t.status === 'completed'}
                        onChange={(e) => onUpdateTask && onUpdateTask(t.id, { status: e.target.checked ? 'completed' : 'todo' })}
                        style={{ accentColor: 'var(--accent-primary)', width: '16px', height: '16px', cursor: 'pointer' }}
                      />
                      <span style={{ fontSize: '14px', fontWeight: '500', textDecoration: t.status === 'completed' ? 'line-through' : 'none' }}>
                        {t.title}
                      </span>
                    </div>

                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <span className={`badge-para badge-${t.para_category ? t.para_category.toLowerCase() : 'project'}`}>
                        {t.para_category || 'Project'}
                      </span>
                      <span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '4px', fontWeight: '600', background: pStyle.bg, color: pStyle.color, border: pStyle.border }}>
                        {t.priority || 'medium'}
                      </span>
                      {t.due_date && (
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Clock size={11} /> {t.due_date}
                        </span>
                      )}
                      {onDeleteTask && (
                        <button
                          onClick={() => onDeleteTask(t.id)}
                          style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* VIEW: PROJECTS MANAGER */}
      {viewMode === 'projects' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
          {projects.length === 0 ? (
            <div className="card" style={{ gridColumn: '1 / -1', padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
              No active projects found. Click "New Project" to start tracking a milestone!
            </div>
          ) : (
            projects.map(p => (
              <div key={p.id} className="card" style={{ background: 'var(--bg-card)', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h3 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '4px' }}>{p.title}</h3>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{p.description || 'No description provided.'}</p>
                  </div>
                  {onDeleteProject && (
                    <button
                      onClick={() => onDeleteProject(p.id)}
                      style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '2px' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>

                {/* Progress Control */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: '600', marginBottom: '6px' }}>
                    <span>Completion Progress</span>
                    <span style={{ color: 'var(--accent-primary)' }}>{p.progress || 0}%</span>
                  </div>
                  <div style={{ height: '8px', width: '100%', background: 'var(--bg-hover)', borderRadius: '4px', overflow: 'hidden', marginBottom: '10px' }}>
                    <div style={{ height: '100%', width: `${p.progress || 0}%`, background: 'var(--para-project)', borderRadius: '4px', transition: 'width 0.2s ease' }}></div>
                  </div>

                  {/* Interactive Progress Slider */}
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={p.progress || 0}
                    onChange={(e) => onUpdateProject && onUpdateProject(p.id, { progress: parseInt(e.target.value) })}
                    style={{ width: '100%', accentColor: 'var(--accent-primary)', cursor: 'pointer' }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: 'var(--text-muted)', borderTop: '1px solid var(--border-subtle)', paddingTop: '10px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={12} /> Target: {p.target_date || 'Ongoing'}
                  </span>
                  <span className="badge-para badge-project" style={{ textTransform: 'capitalize' }}>
                    {p.status || 'active'}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
