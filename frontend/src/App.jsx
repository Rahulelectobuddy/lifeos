import React, { useState, useEffect } from 'react';
import Header from './components/Header';

import HomeView from './views/HomeView';
import NotesView from './views/NotesView';
import TasksView from './views/TasksView';
import JournalView from './views/JournalView';
import GraphView from './views/GraphView';
import LoginView from './views/LoginView';
import CommandPaletteModal from './components/CommandPaletteModal';

export default function App() {
  const [authToken, setAuthToken] = useState(() => localStorage.getItem('lifeos_jwt_token') || null);
  const [authUser, setAuthUser] = useState(() => {
    const saved = localStorage.getItem('lifeos_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [currentView, setCurrentView] = useState('home'); // home, notes, tasks, journal, graph
  const [isDark, setIsDark] = useState(false);
  const [isCmdOpen, setIsCmdOpen] = useState(false);

  const handleLoginSuccess = (token, user) => {
    setAuthToken(token);
    setAuthUser(user);
    localStorage.setItem('lifeos_jwt_token', token);
    localStorage.setItem('lifeos_user', JSON.stringify(user));
  };

  const handleLogout = () => {
    setAuthToken(null);
    setAuthUser(null);
    localStorage.removeItem('lifeos_jwt_token');
    localStorage.removeItem('lifeos_user');
  };

  // State data
  const [notes, setNotes] = useState([
    {
      id: 'nt-1',
      title: 'Proxmox VE Homelab Cluster Architecture & RTX 4090 Passthrough',
      content: '## Infrastructure Specification\n\n- Primary Node: AMD EPYC 7002 series (64 Core)\n- Passthrough GPU: RTX 4090 24GB VRAM\n- Storage Pool: ZFS RaidZ2 4x 4TB NVMe SSDs\n\n### Backlink Connections\n- See [[Project - Migrate Homelab to Proxmox VE]]\n- Linked to [[Daily Log 2026-09-10]]',
      para_category: 'Resource',
      tags: 'proxmox, homelab, hardware, zfs',
      is_pinned: true,
    },
    {
      id: 'nt-2',
      title: 'Cypher LifeOS Design Tokens & HSL Color Palette Specifications',
      content: '### Light Theme Default Token System\n\n- Soft Off-white canvas: `hsl(220, 20%, 97%)`\n- Pure white card surface: `hsl(0, 0%, 100%)`\n- Deep charcoal typography: `hsl(222, 25%, 12%)`\n- Glassmorphism backdrop blur: `12px`',
      para_category: 'Resource',
      tags: 'design, css, tokens, design-system',
      is_pinned: true,
    },
    {
      id: 'nt-3',
      title: 'Weekly Architecture Review & Production Refactoring Log',
      content: 'Completed 6-screen Web wireframe suite in Penpot with 89 interactive prototyping triggers.',
      para_category: 'Archive',
      tags: 'review, architecture, web',
      is_pinned: false,
    }
  ]);

  const [tasks, setTasks] = useState([
    { id: 'tsk-1', title: 'Review Proxmox VE Backup Server ZFS Snapshot', status: 'completed', priority: 'high', para_category: 'Project', due_date: '2026-09-11' },
    { id: 'tsk-2', title: 'Implement FastAPI Modular Monolith API Routers', status: 'in_progress', priority: 'urgent', para_category: 'Project', due_date: '2026-09-11' },
    { id: 'tsk-3', title: 'Audit Penpot 6-screen Web Prototyping Transitions', status: 'completed', priority: 'medium', para_category: 'Resource', due_date: '2026-09-10' },
    { id: 'tsk-4', title: 'Log Daily Habits & Reflection Entry', status: 'todo', priority: 'medium', para_category: 'Area', due_date: '2026-09-11' },
    { id: 'tsk-5', title: 'Test Command Palette (⌘K) Keyboard Shortcuts', status: 'todo', priority: 'low', para_category: 'Project', due_date: '2026-09-12' },
  ]);

  const [projects, setProjects] = useState([
    { id: 'prj-1', title: 'Migrate Homelab to Proxmox VE', description: 'Cluster migration with ZFS storage.', progress: 85, target_date: '2026-09-30' },
    { id: 'prj-2', title: 'Life OS Web MVP Release v1.0', description: 'Vite + React web application.', progress: 90, target_date: '2026-09-15' },
    { id: 'prj-3', title: 'Universal Knowledge Graph Engine', description: 'Polymorphic relationship graph.', progress: 60, target_date: '2026-10-01' },
  ]);

  const [areas, setAreas] = useState([
    { id: 'ara-1', name: 'Health & Fitness', description: 'Physical wellness, exercise, nutrition.' },
    { id: 'ara-2', name: 'Finance & Wealth', description: 'Budgeting, investment portfolio, expense tracking.' },
    { id: 'ara-3', name: 'Career & Deep Work', description: 'Professional skills, work projects, publications.' },
    { id: 'ara-4', name: 'Homelab & Infrastructure', description: 'Server maintenance, ZFS pools, network security.' },
    { id: 'ara-5', name: 'Personal Growth', description: 'Reading, learning, habit consistency, and reflection.' },
    { id: 'ara-6', name: 'Daily Routines', description: 'Morning routine, evening shutdown, weekly planning.' }
  ]);

  const [habits, setHabits] = useState([
    { id: 'hbt-1', name: 'Morning Deep Work Session (2 Hours)', streak_count: 14, is_completed_today: true },
    { id: 'hbt-2', name: 'Daily Habit & Reflection Journaling', streak_count: 9, is_completed_today: true },
    { id: 'hbt-3', name: 'Physical Workout / Cardio (45 Min)', streak_count: 5, is_completed_today: false },
    { id: 'hbt-4', name: 'Read 20 Pages of Technical Literature', streak_count: 12, is_completed_today: true },
  ]);

  const [journals, setJournals] = useState([]);

  // Centralized API fetch helper with JWT Authorization headers & error handling
  const apiFetch = async (url, options = {}) => {
    const headers = {
      'Content-Type': 'application/json',
      ...(authToken ? { 'Authorization': `Bearer ${authToken}` } : {}),
      ...(options.headers || {})
    };
    return fetch(url, { ...options, headers });
  };

  // Fetch initial data from backend API
  useEffect(() => {
    apiFetch('/api/v1/notes')
      .then(res => res.ok ? res.json() : [])
      .then(data => { if (Array.isArray(data) && data.length > 0) setNotes(data); })
      .catch(e => console.error('API Error fetching notes:', e));

    apiFetch('/api/v1/tasks')
      .then(res => res.ok ? res.json() : [])
      .then(data => { if (Array.isArray(data) && data.length > 0) setTasks(data); })
      .catch(e => console.error('API Error fetching tasks:', e));

    apiFetch('/api/v1/projects')
      .then(res => res.ok ? res.json() : [])
      .then(data => { if (Array.isArray(data) && data.length > 0) setProjects(data); })
      .catch(e => console.error('API Error fetching projects:', e));

    apiFetch('/api/v1/areas')
      .then(res => res.ok ? res.json() : [])
      .then(data => { if (Array.isArray(data) && data.length > 0) setAreas(data); })
      .catch(e => console.error('API Error fetching areas:', e));

    apiFetch('/api/v1/habits')
      .then(res => res.ok ? res.json() : [])
      .then(data => { if (Array.isArray(data) && data.length > 0) setHabits(data); })
      .catch(e => console.error('API Error fetching habits:', e));

    apiFetch('/api/v1/journal')
      .then(res => res.ok ? res.json() : [])
      .then(data => { if (Array.isArray(data) && data.length > 0) setJournals(data); })
      .catch(e => console.error('API Error fetching journal:', e));
  }, [authToken]);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    document.documentElement.setAttribute('data-theme', nextDark ? 'dark' : 'light');
  };

  // Notes CRUD
  const handleAddNote = async (newNote) => {
    const tempId = `nt-${Date.now()}`;
    const tempObj = { id: tempId, ...newNote };
    setNotes(prev => [tempObj, ...prev]);

    try {
      const res = await apiFetch('/api/v1/notes', {
        method: 'POST',
        body: JSON.stringify(newNote)
      });
      if (res.ok) {
        const savedNote = await res.json();
        setNotes(prev => prev.map(n => n.id === tempId ? savedNote : n));
        return savedNote;
      } else {
        setNotes(prev => prev.filter(n => n.id !== tempId));
        console.error('Failed to create note on backend:', await res.text());
      }
    } catch (e) {
      setNotes(prev => prev.filter(n => n.id !== tempId));
      console.error('Failed to save note:', e);
    }
  };

  const handleUpdateNote = async (noteId, updates) => {
    const originalNotes = [...notes];
    setNotes(prev => prev.map(n => n.id === noteId ? { ...n, ...updates } : n));

    try {
      const res = await apiFetch(`/api/v1/notes/${noteId}`, {
        method: 'PATCH',
        body: JSON.stringify(updates)
      });
      if (!res.ok) {
        setNotes(originalNotes);
        console.error('Failed to update note on backend:', await res.text());
      }
    } catch (e) {
      setNotes(originalNotes);
      console.error('Failed to update note:', e);
    }
  };

  const handleDeleteNote = async (noteId) => {
    const originalNotes = [...notes];
    setNotes(prev => prev.filter(n => n.id !== noteId));

    try {
      const res = await apiFetch(`/api/v1/notes/${noteId}`, { method: 'DELETE' });
      if (!res.ok) {
        setNotes(originalNotes);
        console.error('Failed to delete note on backend:', await res.text());
      }
    } catch (e) {
      setNotes(originalNotes);
      console.error('Failed to delete note:', e);
    }
  };

  // Tasks CRUD
  const handleAddTask = async (newTask) => {
    const tempId = `tsk-${Date.now()}`;
    const tempTask = { id: tempId, ...newTask };
    setTasks(prev => [tempTask, ...prev]);

    try {
      const res = await apiFetch('/api/v1/tasks', {
        method: 'POST',
        body: JSON.stringify(newTask)
      });
      if (res.ok) {
        const savedTask = await res.json();
        setTasks(prev => prev.map(t => t.id === tempId ? savedTask : t));
        return savedTask;
      } else {
        setTasks(prev => prev.filter(t => t.id !== tempId));
        console.error('Failed to save task to backend:', await res.text());
      }
    } catch (e) {
      setTasks(prev => prev.filter(t => t.id !== tempId));
      console.error('Failed to save task to backend:', e);
    }
  };

  const handleUpdateTask = async (taskId, updates) => {
    const originalTasks = [...tasks];
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, ...updates } : t));

    try {
      const res = await apiFetch(`/api/v1/tasks/${taskId}`, {
        method: 'PATCH',
        body: JSON.stringify(updates)
      });
      if (!res.ok) {
        setTasks(originalTasks);
        console.error('Failed to update task on backend:', await res.text());
      }
    } catch (e) {
      setTasks(originalTasks);
      console.error('Failed to update task on backend:', e);
    }
  };

  const handleDeleteTask = async (taskId) => {
    const originalTasks = [...tasks];
    setTasks(prev => prev.filter(t => t.id !== taskId));

    try {
      const res = await apiFetch(`/api/v1/tasks/${taskId}`, { method: 'DELETE' });
      if (!res.ok) {
        setTasks(originalTasks);
        console.error('Failed to delete task on backend:', await res.text());
      }
    } catch (e) {
      setTasks(originalTasks);
      console.error('Failed to delete task on backend:', e);
    }
  };

  // Projects CRUD
  const handleAddProject = async (newProj) => {
    const tempId = `prj-${Date.now()}`;
    const tempProj = { id: tempId, ...newProj };
    setProjects(prev => [tempProj, ...prev]);

    try {
      const res = await apiFetch('/api/v1/projects', {
        method: 'POST',
        body: JSON.stringify(newProj)
      });
      if (res.ok) {
        const savedProj = await res.json();
        setProjects(prev => prev.map(p => p.id === tempId ? savedProj : p));
        return savedProj;
      } else {
        setProjects(prev => prev.filter(p => p.id !== tempId));
        console.error('Failed to save project to backend:', await res.text());
      }
    } catch (e) {
      setProjects(prev => prev.filter(p => p.id !== tempId));
      console.error('Failed to save project to backend:', e);
    }
  };

  const handleUpdateProject = async (projectId, updates) => {
    const originalProjects = [...projects];
    setProjects(prev => prev.map(p => p.id === projectId ? { ...p, ...updates } : p));

    try {
      const res = await apiFetch(`/api/v1/projects/${projectId}`, {
        method: 'PATCH',
        body: JSON.stringify(updates)
      });
      if (!res.ok) {
        setProjects(originalProjects);
        console.error('Failed to update project on backend:', await res.text());
      }
    } catch (e) {
      setProjects(originalProjects);
      console.error('Failed to update project on backend:', e);
    }
  };

  const handleDeleteProject = async (projectId) => {
    const originalProjects = [...projects];
    setProjects(prev => prev.filter(p => p.id !== projectId));

    try {
      const res = await apiFetch(`/api/v1/projects/${projectId}`, { method: 'DELETE' });
      if (!res.ok) {
        setProjects(originalProjects);
        console.error('Failed to delete project on backend:', await res.text());
      }
    } catch (e) {
      setProjects(originalProjects);
      console.error('Failed to delete project on backend:', e);
    }
  };

  // Areas CRUD
  const handleAddArea = async (newArea) => {
    const tempId = `ara-${Date.now()}`;
    const tempArea = { id: tempId, ...newArea };
    setAreas(prev => [...prev, tempArea]);

    try {
      const res = await apiFetch('/api/v1/areas', {
        method: 'POST',
        body: JSON.stringify(newArea)
      });
      if (res.ok) {
        const savedArea = await res.json();
        setAreas(prev => prev.map(a => a.id === tempId ? savedArea : a));
        return savedArea;
      } else {
        setAreas(prev => prev.filter(a => a.id !== tempId));
        console.error('Failed to save area to backend:', await res.text());
      }
    } catch (e) {
      setAreas(prev => prev.filter(a => a.id !== tempId));
      console.error('Failed to save area to backend:', e);
    }
    return tempArea;
  };

  const handleUpdateArea = async (areaId, updates) => {
    const originalAreas = [...areas];
    setAreas(prev => prev.map(a => a.id === areaId ? { ...a, ...updates } : a));

    try {
      const res = await apiFetch(`/api/v1/areas/${areaId}`, {
        method: 'PATCH',
        body: JSON.stringify(updates)
      });
      if (!res.ok) {
        setAreas(originalAreas);
        console.error('Failed to update area on backend:', await res.text());
      }
    } catch (e) {
      setAreas(originalAreas);
      console.error('Failed to update area on backend:', e);
    }
  };

  const handleDeleteArea = async (areaId) => {
    const originalAreas = [...areas];
    setAreas(prev => prev.filter(a => a.id !== areaId));

    try {
      const res = await apiFetch(`/api/v1/areas/${areaId}`, { method: 'DELETE' });
      if (!res.ok) {
        setAreas(originalAreas);
        console.error('Failed to delete area on backend:', await res.text());
      }
    } catch (e) {
      setAreas(originalAreas);
      console.error('Failed to delete area on backend:', e);
    }
  };

  // Journal CRUD
  const handleSaveJournal = async (journalEntry) => {
    const tempId = `jnl-${Date.now()}`;
    const tempObj = { id: tempId, ...journalEntry };
    setJournals(prev => [tempObj, ...prev.filter(j => j.entry_date !== journalEntry.entry_date)]);

    try {
      const res = await apiFetch('/api/v1/journal', {
        method: 'POST',
        body: JSON.stringify(journalEntry)
      });
      if (res.ok) {
        const savedJnl = await res.json();
        setJournals(prev => [savedJnl, ...prev.filter(j => j.id !== tempId && j.entry_date !== savedJnl.entry_date)]);
      }
    } catch (e) {
      console.error('Failed to save journal log:', e);
    }
  };

  // Habits CRUD
  const handleToggleHabit = async (id) => {
    const originalHabits = [...habits];
    setHabits(prev => prev.map(h => {
      if (h.id === id) {
        const nextState = !h.is_completed_today;
        return {
          ...h,
          is_completed_today: nextState,
          streak_count: nextState ? h.streak_count + 1 : Math.max(0, h.streak_count - 1)
        };
      }
      return h;
    }));

    try {
      const res = await apiFetch(`/api/v1/habits/${id}/toggle`, { method: 'POST' });
      if (res.ok) {
        const updatedHabit = await res.json();
        setHabits(prev => prev.map(h => h.id === id ? updatedHabit : h));
      } else {
        setHabits(originalHabits);
      }
    } catch (e) {
      setHabits(originalHabits);
      console.error('Failed to toggle habit:', e);
    }
  };

  const handleAddHabit = async (newHabit) => {
    const tempId = `hbt-${Date.now()}`;
    const tempObj = { id: tempId, name: newHabit.name, streak_count: 0, is_completed_today: false };
    setHabits(prev => [...prev, tempObj]);

    try {
      const res = await apiFetch('/api/v1/habits', {
        method: 'POST',
        body: JSON.stringify(newHabit)
      });
      if (res.ok) {
        const saved = await res.json();
        setHabits(prev => prev.map(h => h.id === tempId ? saved : h));
      } else {
        setHabits(prev => prev.filter(h => h.id !== tempId));
      }
    } catch (e) {
      setHabits(prev => prev.filter(h => h.id !== tempId));
      console.error('Failed to add habit:', e);
    }
  };

  const handleDeleteHabit = async (habitId) => {
    const originalHabits = [...habits];
    setHabits(prev => prev.filter(h => h.id !== habitId));

    try {
      const res = await apiFetch(`/api/v1/habits/${habitId}`, { method: 'DELETE' });
      if (!res.ok) {
        setHabits(originalHabits);
      }
    } catch (e) {
      setHabits(originalHabits);
      console.error('Failed to delete habit:', e);
    }
  };

  const handleSelectAction = (actionId) => {
    if (actionId === 'open_command') {
      setIsCmdOpen(true);
    } else {
      setCurrentView(actionId);
    }
  };

  if (!authToken) {
    return <LoginView onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="app-container">
      <Header
        currentView={currentView}
        onChangeView={setCurrentView}
        onOpenCmd={() => setIsCmdOpen(true)}
        isDark={isDark}
        onToggleTheme={toggleTheme}
        user={authUser}
        onLogout={handleLogout}
      />

      <div className="app-body">
        <main className="main-viewport">
          {currentView === 'home' && (
            <HomeView
              notes={notes}
              tasks={tasks}
              projects={projects}
              onNavigate={setCurrentView}
              onUpdateTask={handleUpdateTask}
            />
          )}

          {currentView === 'notes' && (
            <NotesView
              notes={notes}
              onAddNote={handleAddNote}
              onUpdateNote={handleUpdateNote}
              onDeleteNote={handleDeleteNote}
              projects={projects}
              areas={areas}
              tasks={tasks}
              onAddTask={handleAddTask}
              onAddProject={handleAddProject}
              onAddArea={handleAddArea}
            />
          )}

          {currentView === 'tasks' && (
            <TasksView
              tasks={tasks}
              projects={projects}
              areas={areas}
              onAddTask={handleAddTask}
              onUpdateTask={handleUpdateTask}
              onDeleteTask={handleDeleteTask}
              onAddProject={handleAddProject}
              onUpdateProject={handleUpdateProject}
              onDeleteProject={handleDeleteProject}
              onAddArea={handleAddArea}
              onUpdateArea={handleUpdateArea}
              onDeleteArea={handleDeleteArea}
            />
          )}

          {currentView === 'journal' && (
            <JournalView
              journals={journals}
              habits={habits}
              onSaveJournal={handleSaveJournal}
              onToggleHabit={handleToggleHabit}
              onAddHabit={handleAddHabit}
              onDeleteHabit={handleDeleteHabit}
            />
          )}

          {currentView === 'graph' && (
            <GraphView
              notes={notes}
              tasks={tasks}
              projects={projects}
              journals={journals}
              onNavigate={setCurrentView}
            />
          )}
        </main>
      </div>

      <CommandPaletteModal
        isOpen={isCmdOpen}
        onClose={() => setIsCmdOpen(false)}
        onSelectAction={handleSelectAction}
      />
    </div>
  );
}
