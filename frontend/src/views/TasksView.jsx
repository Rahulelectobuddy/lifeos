import React, { useState } from 'react';
import {
  CheckCircle2, List, Kanban, Plus, Calendar, AlertCircle, Trash2,
  FolderPlus, ArrowLeft, ArrowRight, Filter, Search, Edit3, Clock, Target,
  FileText, Layers, X, Check
} from 'lucide-react';

export default function TasksView({
  tasks = [],
  projects = [],
  areas = [],
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  onAddProject,
  onUpdateProject,
  onDeleteProject,
  onAddArea,
  onUpdateArea,
  onDeleteArea
}) {
  const [viewMode, setViewMode] = useState('kanban'); // 'kanban', 'list', 'projects', 'areas'
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Default standard Areas list
  const defaultAreaList = [
    { id: 'ara-1', name: 'Health & Fitness', description: 'Physical wellness, exercise, nutrition.' },
    { id: 'ara-2', name: 'Finance & Wealth', description: 'Budgeting, investment portfolio, expense tracking.' },
    { id: 'ara-3', name: 'Career & Deep Work', description: 'Professional skills, work projects, publications.' },
    { id: 'ara-4', name: 'Homelab & Infrastructure', description: 'Server maintenance, ZFS pools, network security.' },
    { id: 'ara-5', name: 'Personal Growth', description: 'Reading, learning, habit consistency, and reflection.' },
    { id: 'ara-6', name: 'Daily Routines', description: 'Morning routine, evening shutdown, weekly planning.' }
  ];

  const availableAreas = areas && areas.length > 0 ? areas : defaultAreaList;

  // New task form state
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState('medium');
  const [newTaskCategory, setNewTaskCategory] = useState('Project');
  const [newTaskTargetName, setNewTaskTargetName] = useState('');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  const [showTaskForm, setShowTaskForm] = useState(false);

  // Inline quick create states inside task modal
  const [inlineCreateType, setInlineCreateType] = useState(null); // 'project' | 'area' | null
  const [inlineTitle, setInlineTitle] = useState('');

  // Pop-up Edit Task Modal State
  const [editingTask, setEditingTask] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editStatus, setEditStatus] = useState('todo');
  const [editPriority, setEditPriority] = useState('medium');
  const [editCategory, setEditCategory] = useState('Project');
  const [editTargetName, setEditTargetName] = useState('');
  const [editDueDate, setEditDueDate] = useState('');

  // New project form state
  const [newProjTitle, setNewProjTitle] = useState('');
  const [newProjDesc, setNewProjDesc] = useState('');
  const [newProjTargetDate, setNewProjTargetDate] = useState('');
  const [showProjForm, setShowProjForm] = useState(false);

  // New area form state
  const [newAreaName, setNewAreaName] = useState('');
  const [newAreaDesc, setNewAreaDesc] = useState('');
  const [showAreaForm, setShowAreaForm] = useState(false);

  // Drag and drop state
  const [draggedTaskId, setDraggedTaskId] = useState(null);

  // Open Edit Task Pop-up Modal
  const openEditModal = (task) => {
    setEditingTask(task);
    setEditTitle(task.title || '');
    setEditDesc(task.description || '');
    setEditStatus(task.status || 'todo');
    setEditPriority(task.priority || 'medium');
    setEditCategory(task.para_category || 'Project');
    setEditTargetName(task.target_name || '');
    setEditDueDate(task.due_date || '');
  };

  const handleSaveTaskEdit = (e) => {
    e.preventDefault();
    if (!editingTask || !onUpdateTask) return;

    onUpdateTask(editingTask.id, {
      title: editTitle.trim(),
      description: editDesc,
      status: editStatus,
      priority: editPriority,
      para_category: editCategory,
      target_name: editTargetName.trim(),
      due_date: editDueDate || null
    });

    setEditingTask(null);
  };

  // Filter tasks
  const filteredTasks = tasks.filter(t => {
    const matchesCategory = filterCategory === 'ALL' || (t.para_category && t.para_category.toUpperCase() === filterCategory.toUpperCase());
    const matchesSearch = !searchQuery.trim() ||
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.description && t.description.toLowerCase().includes(searchQuery.toLowerCase()));
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
        description: newTaskDesc.trim(),
        status: 'todo',
        priority: newTaskPriority,
        para_category: newTaskCategory,
        target_name: newTaskTargetName.trim(),
        due_date: newTaskDueDate || null
      });
    }

    setNewTaskTitle('');
    setNewTaskDesc('');
    setNewTaskTargetName('');
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

  // Handle Area Creation
  const handleCreateArea = (e) => {
    e.preventDefault();
    if (!newAreaName.trim()) return;

    if (onAddArea) {
      onAddArea({
        name: newAreaName.trim(),
        description: newAreaDesc.trim()
      });
    }

    setNewAreaName('');
    setNewAreaDesc('');
    setShowAreaForm(false);
  };

  // Handle Inline Quick Project / Area Creation in Task Pop-up Modal
  const handleInlineCreate = async (e) => {
    e.preventDefault();
    if (!inlineTitle.trim()) return;

    const val = inlineTitle.trim();
    if (inlineCreateType === 'project') {
      if (onAddProject) {
        await onAddProject({
          title: val,
          description: '',
          progress: 0,
          status: 'active'
        });
      }
      setNewTaskTargetName(val);
      if (editingTask) setEditTargetName(val);
    } else if (inlineCreateType === 'area') {
      if (onAddArea) {
        await onAddArea({
          name: val,
          description: ''
        });
      }
      setNewTaskTargetName(val);
      if (editingTask) setEditTargetName(val);
    }

    setInlineTitle('');
    setInlineCreateType(null);
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
            <button
              className={`nav-tab-btn ${viewMode === 'areas' ? 'active' : ''}`}
              onClick={() => setViewMode('areas')}
            >
              <Layers size={14} /> Areas ({availableAreas.length})
            </button>
          </div>

          {viewMode === 'projects' ? (
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
          ) : viewMode === 'areas' ? (
            <button
              onClick={() => setShowAreaForm(!showAreaForm)}
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
              <Plus size={16} /> New Area
            </button>
          ) : (
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
          )}
        </div>
      </div>

      {/* New Task Pop-up Modal */}
      {showTaskForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="card" style={{ width: '540px', background: 'var(--bg-surface)', padding: '24px', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontWeight: '700', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Plus size={18} color="var(--accent-primary)" /> Create New Priority Task
              </h3>
              <button onClick={() => setShowTaskForm(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateTask} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Task Title</label>
                <input
                  type="text"
                  placeholder="Task title (e.g. Set up ZFS Backup Schedule)..."
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  required
                  autoFocus
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                    background: 'var(--bg-card)',
                    color: 'var(--text-primary)',
                    outline: 'none',
                    fontWeight: '600'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Task Description & Notes</label>
                <textarea
                  placeholder="Task description, sub-goals, or implementation details..."
                  value={newTaskDesc}
                  onChange={(e) => setNewTaskDesc(e.target.value)}
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                    background: 'var(--bg-card)',
                    color: 'var(--text-primary)',
                    outline: 'none',
                    resize: 'vertical',
                    fontSize: '13px'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Priority Level</label>
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
                    onChange={(e) => {
                      setNewTaskCategory(e.target.value);
                      setNewTaskTargetName('');
                    }}
                    style={{ width: '100%', padding: '8px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', background: 'var(--bg-card)', color: 'var(--text-primary)' }}
                  >
                    <option value="Project">Project</option>
                    <option value="Area">Area</option>
                    <option value="Resource">Resource</option>
                    <option value="Archive">Archive</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                    {newTaskCategory === 'Project' ? 'Linked Project' : newTaskCategory === 'Area' ? 'Linked Area' : 'Target Label'}
                  </label>
                  {newTaskCategory === 'Project' ? (
                    inlineCreateType === 'project' ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <input
                          type="text"
                          placeholder="New Project Title..."
                          value={inlineTitle}
                          onChange={(e) => setInlineTitle(e.target.value)}
                          autoFocus
                          style={{ width: '100%', padding: '6px 8px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--accent-primary)', background: 'var(--bg-card)', color: 'var(--text-primary)', fontSize: '12px' }}
                        />
                        <div style={{ display: 'flex', gap: '4px' }}>
                          <button
                            type="button"
                            onClick={handleInlineCreate}
                            style={{ padding: '4px 8px', borderRadius: 'var(--radius-sm)', background: 'var(--accent-primary)', color: 'white', border: 'none', fontSize: '11px', fontWeight: '600', cursor: 'pointer' }}
                          >
                            Save & Select
                          </button>
                          <button
                            type="button"
                            onClick={() => { setInlineCreateType(null); setInlineTitle(''); }}
                            style={{ padding: '4px 8px', borderRadius: 'var(--radius-sm)', background: 'transparent', border: '1px solid var(--border-subtle)', color: 'var(--text-muted)', fontSize: '11px', cursor: 'pointer' }}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <select
                        value={newTaskTargetName}
                        onChange={(e) => {
                          if (e.target.value === '__NEW__') {
                            setInlineCreateType('project');
                          } else {
                            setNewTaskTargetName(e.target.value);
                          }
                        }}
                        style={{ width: '100%', padding: '8px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', background: 'var(--bg-card)', color: 'var(--text-primary)' }}
                      >
                        <option value="">Select Project...</option>
                        {projects.map(p => (
                          <option key={p.id} value={p.title}>{p.title}</option>
                        ))}
                        <option value="__NEW__">+ Create New Project...</option>
                      </select>
                    )
                  ) : newTaskCategory === 'Area' ? (
                    inlineCreateType === 'area' ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <input
                          type="text"
                          placeholder="New Area Name..."
                          value={inlineTitle}
                          onChange={(e) => setInlineTitle(e.target.value)}
                          autoFocus
                          style={{ width: '100%', padding: '6px 8px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--accent-primary)', background: 'var(--bg-card)', color: 'var(--text-primary)', fontSize: '12px' }}
                        />
                        <div style={{ display: 'flex', gap: '4px' }}>
                          <button
                            type="button"
                            onClick={handleInlineCreate}
                            style={{ padding: '4px 8px', borderRadius: 'var(--radius-sm)', background: 'var(--accent-primary)', color: 'white', border: 'none', fontSize: '11px', fontWeight: '600', cursor: 'pointer' }}
                          >
                            Save & Select
                          </button>
                          <button
                            type="button"
                            onClick={() => { setInlineCreateType(null); setInlineTitle(''); }}
                            style={{ padding: '4px 8px', borderRadius: 'var(--radius-sm)', background: 'transparent', border: '1px solid var(--border-subtle)', color: 'var(--text-muted)', fontSize: '11px', cursor: 'pointer' }}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <select
                        value={newTaskTargetName}
                        onChange={(e) => {
                          if (e.target.value === '__NEW__') {
                            setInlineCreateType('area');
                          } else {
                            setNewTaskTargetName(e.target.value);
                          }
                        }}
                        style={{ width: '100%', padding: '8px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', background: 'var(--bg-card)', color: 'var(--text-primary)' }}
                      >
                        <option value="">Select Area...</option>
                        {availableAreas.map(a => (
                          <option key={a.id || a.name} value={a.name}>{a.name}</option>
                        ))}
                        <option value="__NEW__">+ Create New Area...</option>
                      </select>
                    )
                  ) : (
                    <input
                      type="text"
                      placeholder="Custom label..."
                      value={newTaskTargetName}
                      onChange={(e) => setNewTaskTargetName(e.target.value)}
                      style={{ width: '100%', padding: '8px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', background: 'var(--bg-card)', color: 'var(--text-primary)' }}
                    />
                  )}
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

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '10px', borderTop: '1px solid var(--border-subtle)', paddingTop: '14px' }}>
                <button
                  type="button"
                  onClick={() => setShowTaskForm(false)}
                  style={{ padding: '8px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', background: 'transparent', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '8px 18px', borderRadius: 'var(--radius-md)', background: 'var(--accent-primary)', color: 'white', border: 'none', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <Check size={14} /> Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Project Pop-up Modal */}
      {showProjForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="card" style={{ width: '500px', background: 'var(--bg-surface)', padding: '24px', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontWeight: '700', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FolderPlus size={18} color="var(--accent-primary)" /> Create New PARA Project
              </h3>
              <button onClick={() => setShowProjForm(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateProject} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Project Title</label>
                <input
                  type="text"
                  placeholder="Project title (e.g. Life OS MVP Release v1.0)..."
                  value={newProjTitle}
                  onChange={(e) => setNewProjTitle(e.target.value)}
                  required
                  autoFocus
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                    background: 'var(--bg-card)',
                    color: 'var(--text-primary)',
                    outline: 'none',
                    fontWeight: '600'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Project Description</label>
                <textarea
                  placeholder="Project scope, deliverables, or objectives..."
                  value={newProjDesc}
                  onChange={(e) => setNewProjDesc(e.target.value)}
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                    background: 'var(--bg-card)',
                    color: 'var(--text-primary)',
                    outline: 'none',
                    resize: 'vertical',
                    fontSize: '13px'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Target Completion Date</label>
                <input
                  type="date"
                  value={newProjTargetDate}
                  onChange={(e) => setNewProjTargetDate(e.target.value)}
                  style={{ width: '100%', padding: '8px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', background: 'var(--bg-card)', color: 'var(--text-primary)' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '10px', borderTop: '1px solid var(--border-subtle)', paddingTop: '14px' }}>
                <button
                  type="button"
                  onClick={() => setShowProjForm(false)}
                  style={{ padding: '8px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', background: 'transparent', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '8px 18px', borderRadius: 'var(--radius-md)', background: 'var(--accent-primary)', color: 'white', border: 'none', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <Check size={14} /> Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Filter and Search Bar (For tasks) */}
      {viewMode !== 'projects' && (
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search tasks by title or description..."
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
                      onClick={() => openEditModal(t)}
                      style={{
                        background: 'var(--bg-surface)',
                        padding: '12px',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-subtle)',
                        cursor: 'pointer',
                        transition: 'transform 0.15s ease, box-shadow 0.15s ease'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px', gap: '8px' }}>
                        <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)' }}>{t.title}</span>
                        <div style={{ display: 'flex', gap: '4px' }}>
                          <button
                            onClick={(e) => { e.stopPropagation(); openEditModal(t); }}
                            title="Edit task"
                            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '2px' }}
                          >
                            <Edit3 size={13} />
                          </button>
                          {onDeleteTask && (
                            <button
                              onClick={(e) => { e.stopPropagation(); onDeleteTask(t.id); }}
                              title="Delete task"
                              style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '2px' }}
                            >
                              <Trash2 size={13} />
                            </button>
                          )}
                        </div>
                      </div>

                      {t.description && (
                        <p style={{ fontSize: '11.5px', color: 'var(--text-secondary)', marginBottom: '8px', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                          {t.description}
                        </p>
                      )}

                      {/* Target Project/Area badge */}
                      {t.target_name && (
                        <div style={{ fontSize: '10.5px', fontWeight: '600', color: 'var(--accent-primary)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Target size={11} /> {t.para_category === 'Project' ? `Project: ${t.target_name}` : `Area: ${t.target_name}`}
                        </div>
                      )}

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px', flexWrap: 'wrap', gap: '6px' }}>
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
                          onClick={(e) => { e.stopPropagation(); onUpdateTask && onUpdateTask(t.id, { status: 'in_progress' }); }}
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
                      onClick={() => openEditModal(t)}
                      style={{
                        background: 'var(--bg-surface)',
                        padding: '12px',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--accent-primary)',
                        cursor: 'pointer'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px', gap: '8px' }}>
                        <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)' }}>{t.title}</span>
                        <div style={{ display: 'flex', gap: '4px' }}>
                          <button
                            onClick={(e) => { e.stopPropagation(); openEditModal(t); }}
                            title="Edit task"
                            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '2px' }}
                          >
                            <Edit3 size={13} />
                          </button>
                          {onDeleteTask && (
                            <button
                              onClick={(e) => { e.stopPropagation(); onDeleteTask(t.id); }}
                              title="Delete task"
                              style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '2px' }}
                            >
                              <Trash2 size={13} />
                            </button>
                          )}
                        </div>
                      </div>

                      {t.description && (
                        <p style={{ fontSize: '11.5px', color: 'var(--text-secondary)', marginBottom: '8px', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                          {t.description}
                        </p>
                      )}

                      {/* Target Project/Area badge */}
                      {t.target_name && (
                        <div style={{ fontSize: '10.5px', fontWeight: '600', color: 'var(--accent-primary)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Target size={11} /> {t.para_category === 'Project' ? `Project: ${t.target_name}` : `Area: ${t.target_name}`}
                        </div>
                      )}

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px', flexWrap: 'wrap', gap: '6px' }}>
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
                          onClick={(e) => { e.stopPropagation(); onUpdateTask && onUpdateTask(t.id, { status: 'todo' }); }}
                          style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '4px', border: '1px solid var(--border-subtle)', background: 'var(--bg-card)', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                        >
                          <ArrowLeft size={10} /> To Do
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); onUpdateTask && onUpdateTask(t.id, { status: 'completed' }); }}
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
                    onClick={() => openEditModal(t)}
                    style={{
                      background: 'var(--bg-surface)',
                      padding: '12px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-subtle)',
                      opacity: 0.8,
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px', gap: '8px' }}>
                      <span style={{ fontSize: '13px', fontWeight: '600', textDecoration: 'line-through', color: 'var(--text-muted)' }}>
                        {t.title}
                      </span>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <button
                          onClick={(e) => { e.stopPropagation(); openEditModal(t); }}
                          title="Edit task"
                          style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '2px' }}
                        >
                          <Edit3 size={13} />
                        </button>
                        {onDeleteTask && (
                          <button
                            onClick={(e) => { e.stopPropagation(); onDeleteTask(t.id); }}
                            title="Delete task"
                            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '2px' }}
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                      <span className={`badge-para badge-${t.para_category ? t.para_category.toLowerCase() : 'project'}`}>
                        {t.para_category || 'Project'}
                      </span>
                      <button
                        onClick={(e) => { e.stopPropagation(); onUpdateTask && onUpdateTask(t.id, { status: 'in_progress' }); }}
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
                    onClick={() => openEditModal(t)}
                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', borderRadius: 'var(--radius-md)', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', cursor: 'pointer' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <input
                        type="checkbox"
                        checked={t.status === 'completed'}
                        onChange={(e) => { e.stopPropagation(); onUpdateTask && onUpdateTask(t.id, { status: e.target.checked ? 'completed' : 'todo' }); }}
                        style={{ accentColor: 'var(--accent-primary)', width: '16px', height: '16px', cursor: 'pointer' }}
                      />
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: '500', textDecoration: t.status === 'completed' ? 'line-through' : 'none' }}>
                          {t.title}
                        </div>
                        {t.target_name && (
                          <div style={{ fontSize: '11px', color: 'var(--accent-primary)', fontWeight: '600', marginTop: '2px' }}>
                            {t.para_category === 'Project' ? `Project: ${t.target_name}` : `Area: ${t.target_name}`}
                          </div>
                        )}
                      </div>
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
                      <button
                        onClick={(e) => { e.stopPropagation(); openEditModal(t); }}
                        style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
                      >
                        <Edit3 size={14} />
                      </button>
                      {onDeleteTask && (
                        <button
                          onClick={(e) => { e.stopPropagation(); onDeleteTask(t.id); }}
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

      {/* VIEW: AREAS MANAGER */}
      {viewMode === 'areas' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
          {availableAreas.length === 0 ? (
            <div className="card" style={{ gridColumn: '1 / -1', padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
              No active areas of life found. Click "New Area" to define a sphere of responsibility!
            </div>
          ) : (
            availableAreas.map(a => (
              <div key={a.id || a.name} className="card" style={{ background: 'var(--bg-card)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: 'var(--radius-md)', background: 'rgba(16, 185, 129, 0.15)', color: 'var(--para-area)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Layers size={16} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '15px', fontWeight: '700' }}>{a.name}</h3>
                      <span className="badge-para badge-area" style={{ fontSize: '10px' }}>Area of Life</span>
                    </div>
                  </div>
                  {onDeleteArea && a.id && !a.id.startsWith('ara-1') && (
                    <button
                      onClick={() => onDeleteArea(a.id)}
                      style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '2px' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>

                <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                  {a.description || 'Continuous sphere of responsibility to maintain standards over time.'}
                </p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: 'var(--text-muted)', borderTop: '1px solid var(--border-subtle)', paddingTop: '10px' }}>
                  <span>Active Tasks: {tasks.filter(t => t.target_name === a.name || (t.para_category === 'Area' && t.target_name === a.name)).length}</span>
                  <span style={{ color: 'var(--para-area)', fontWeight: '600' }}>PARA Standard</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* New Area Pop-up Modal */}
      {showAreaForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="card" style={{ width: '500px', background: 'var(--bg-surface)', padding: '24px', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontWeight: '700', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Layers size={18} color="var(--para-area)" /> Create New Area of Life
              </h3>
              <button onClick={() => setShowAreaForm(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateArea} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Area Name</label>
                <input
                  type="text"
                  placeholder="Area name (e.g. Health & Longevity, Financial Freedom)..."
                  value={newAreaName}
                  onChange={(e) => setNewAreaName(e.target.value)}
                  required
                  autoFocus
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                    background: 'var(--bg-card)',
                    color: 'var(--text-primary)',
                    outline: 'none',
                    fontWeight: '600'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Area Description & Standards</label>
                <textarea
                  placeholder="Key standards of responsibility to maintain over time..."
                  value={newAreaDesc}
                  onChange={(e) => setNewAreaDesc(e.target.value)}
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                    background: 'var(--bg-card)',
                    color: 'var(--text-primary)',
                    outline: 'none',
                    resize: 'vertical',
                    fontSize: '13px'
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '10px', borderTop: '1px solid var(--border-subtle)', paddingTop: '14px' }}>
                <button
                  type="button"
                  onClick={() => setShowAreaForm(false)}
                  style={{ padding: '8px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', background: 'transparent', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '8px 18px', borderRadius: 'var(--radius-md)', background: 'var(--para-area)', color: 'white', border: 'none', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <Check size={14} /> Save Area
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* POP-UP EDIT TASK MODAL */}
      {editingTask && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="card" style={{ width: '540px', background: 'var(--bg-surface)', padding: '24px', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontWeight: '700', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Edit3 size={16} color="var(--accent-primary)" /> Edit Task Details
              </h3>
              <button onClick={() => setEditingTask(null)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveTaskEdit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Task Title</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  required
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', background: 'var(--bg-card)', color: 'var(--text-primary)', outline: 'none', fontWeight: '600' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Task Description & Notes</label>
                <textarea
                  rows={4}
                  placeholder="Detailed task description, acceptance criteria, or notes..."
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', background: 'var(--bg-card)', color: 'var(--text-primary)', outline: 'none', resize: 'vertical', fontSize: '13px', lineHeight: '1.5' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Status</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                    style={{ width: '100%', padding: '8px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', background: 'var(--bg-card)', color: 'var(--text-primary)' }}
                  >
                    <option value="todo">To Do</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Priority</label>
                  <select
                    value={editPriority}
                    onChange={(e) => setEditPriority(e.target.value)}
                    style={{ width: '100%', padding: '8px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', background: 'var(--bg-card)', color: 'var(--text-primary)' }}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>PARA Category</label>
                  <select
                    value={editCategory}
                    onChange={(e) => {
                      setEditCategory(e.target.value);
                      setEditTargetName('');
                    }}
                    style={{ width: '100%', padding: '8px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', background: 'var(--bg-card)', color: 'var(--text-primary)' }}
                  >
                    <option value="Project">Project</option>
                    <option value="Area">Area</option>
                    <option value="Resource">Resource</option>
                    <option value="Archive">Archive</option>
                  </select>
                </div>

                {/* Dynamic Project or Area Selector in Pop-up */}
                <div>
                  <label style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                    {editCategory === 'Project' ? 'Linked Project' : editCategory === 'Area' ? 'Linked Area' : 'Target Label'}
                  </label>
                  {editCategory === 'Project' ? (
                    inlineCreateType === 'project' ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <input
                          type="text"
                          placeholder="New Project Title..."
                          value={inlineTitle}
                          onChange={(e) => setInlineTitle(e.target.value)}
                          autoFocus
                          style={{ width: '100%', padding: '6px 8px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--accent-primary)', background: 'var(--bg-card)', color: 'var(--text-primary)', fontSize: '12px' }}
                        />
                        <div style={{ display: 'flex', gap: '4px' }}>
                          <button
                            type="button"
                            onClick={handleInlineCreate}
                            style={{ padding: '4px 8px', borderRadius: 'var(--radius-sm)', background: 'var(--accent-primary)', color: 'white', border: 'none', fontSize: '11px', fontWeight: '600', cursor: 'pointer' }}
                          >
                            Save & Select
                          </button>
                          <button
                            type="button"
                            onClick={() => { setInlineCreateType(null); setInlineTitle(''); }}
                            style={{ padding: '4px 8px', borderRadius: 'var(--radius-sm)', background: 'transparent', border: '1px solid var(--border-subtle)', color: 'var(--text-muted)', fontSize: '11px', cursor: 'pointer' }}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <select
                        value={editTargetName}
                        onChange={(e) => {
                          if (e.target.value === '__NEW__') {
                            setInlineCreateType('project');
                          } else {
                            setEditTargetName(e.target.value);
                          }
                        }}
                        style={{ width: '100%', padding: '8px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', background: 'var(--bg-card)', color: 'var(--text-primary)' }}
                      >
                        <option value="">Select Project...</option>
                        {projects.map(p => (
                          <option key={p.id} value={p.title}>{p.title}</option>
                        ))}
                        <option value="__NEW__">+ Create New Project...</option>
                      </select>
                    )
                  ) : editCategory === 'Area' ? (
                    inlineCreateType === 'area' ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <input
                          type="text"
                          placeholder="New Area Name..."
                          value={inlineTitle}
                          onChange={(e) => setInlineTitle(e.target.value)}
                          autoFocus
                          style={{ width: '100%', padding: '6px 8px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--accent-primary)', background: 'var(--bg-card)', color: 'var(--text-primary)', fontSize: '12px' }}
                        />
                        <div style={{ display: 'flex', gap: '4px' }}>
                          <button
                            type="button"
                            onClick={handleInlineCreate}
                            style={{ padding: '4px 8px', borderRadius: 'var(--radius-sm)', background: 'var(--accent-primary)', color: 'white', border: 'none', fontSize: '11px', fontWeight: '600', cursor: 'pointer' }}
                          >
                            Save & Select
                          </button>
                          <button
                            type="button"
                            onClick={() => { setInlineCreateType(null); setInlineTitle(''); }}
                            style={{ padding: '4px 8px', borderRadius: 'var(--radius-sm)', background: 'transparent', border: '1px solid var(--border-subtle)', color: 'var(--text-muted)', fontSize: '11px', cursor: 'pointer' }}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <select
                        value={editTargetName}
                        onChange={(e) => {
                          if (e.target.value === '__NEW__') {
                            setInlineCreateType('area');
                          } else {
                            setEditTargetName(e.target.value);
                          }
                        }}
                        style={{ width: '100%', padding: '8px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', background: 'var(--bg-card)', color: 'var(--text-primary)' }}
                      >
                        <option value="">Select Area...</option>
                        {availableAreas.map(a => (
                          <option key={a.id || a.name} value={a.name}>{a.name}</option>
                        ))}
                        <option value="__NEW__">+ Create New Area...</option>
                      </select>
                    )
                  ) : (
                    <input
                      type="text"
                      placeholder="Custom label..."
                      value={editTargetName}
                      onChange={(e) => setEditTargetName(e.target.value)}
                      style={{ width: '100%', padding: '8px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', background: 'var(--bg-card)', color: 'var(--text-primary)' }}
                    />
                  )}
                </div>
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Due Date</label>
                <input
                  type="date"
                  value={editDueDate}
                  onChange={(e) => setEditDueDate(e.target.value)}
                  style={{ width: '100%', padding: '8px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', background: 'var(--bg-card)', color: 'var(--text-primary)' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', borderTop: '1px solid var(--border-subtle)', paddingTop: '14px' }}>
                {onDeleteTask ? (
                  <button
                    type="button"
                    onClick={() => {
                      onDeleteTask(editingTask.id);
                      setEditingTask(null);
                    }}
                    style={{ padding: '8px 12px', borderRadius: 'var(--radius-md)', background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)', cursor: 'pointer', fontWeight: '600', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <Trash2 size={13} /> Delete Task
                  </button>
                ) : <div />}

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => setEditingTask(null)}
                    style={{ padding: '8px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', background: 'transparent', cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{ padding: '8px 18px', borderRadius: 'var(--radius-md)', background: 'var(--accent-primary)', color: 'white', border: 'none', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <Check size={14} /> Save Changes
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
