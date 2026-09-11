import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import RightContextPanel from './components/RightContextPanel';

import HomeView from './views/HomeView';
import NotesView from './views/NotesView';
import TasksView from './views/TasksView';
import JournalView from './views/JournalView';
import GraphView from './views/GraphView';
import CommandPaletteModal from './components/CommandPaletteModal';

export default function App() {
  const [currentView, setCurrentView] = useState('home'); // home, notes, tasks, journal, graph
  const [isDark, setIsDark] = useState(false);
  const [isCmdOpen, setIsCmdOpen] = useState(false);

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

  const [habits, setHabits] = useState([
    { id: 'hbt-1', name: 'Morning Deep Work Session (2 Hours)', streak_count: 14, is_completed_today: true },
    { id: 'hbt-2', name: 'Daily Habit & Reflection Journaling', streak_count: 9, is_completed_today: true },
    { id: 'hbt-3', name: 'Physical Workout / Cardio (45 Min)', streak_count: 5, is_completed_today: false },
    { id: 'hbt-4', name: 'Read 20 Pages of Technical Literature', streak_count: 12, is_completed_today: true },
  ]);

  // Fetch initial seed data from backend API if available
  useEffect(() => {
    fetch('/api/v1/notes')
      .then(res => res.ok ? res.json() : [])
      .then(data => { if (Array.isArray(data) && data.length > 0) setNotes(data); })
      .catch(() => {});

    fetch('/api/v1/tasks')
      .then(res => res.ok ? res.json() : [])
      .then(data => { if (Array.isArray(data) && data.length > 0) setTasks(data); })
      .catch(() => {});

    fetch('/api/v1/projects')
      .then(res => res.ok ? res.json() : [])
      .then(data => { if (Array.isArray(data) && data.length > 0) setProjects(data); })
      .catch(() => {});

    fetch('/api/v1/habits')
      .then(res => res.ok ? res.json() : [])
      .then(data => { if (Array.isArray(data) && data.length > 0) setHabits(data); })
      .catch(() => {});
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    document.documentElement.setAttribute('data-theme', nextDark ? 'dark' : 'light');
  };

  const handleAddTask = (newTask) => {
    const taskObj = {
      id: `tsk-${Date.now()}`,
      ...newTask
    };
    setTasks([taskObj, ...tasks]);
  };

  const handleToggleHabit = (id) => {
    setHabits(habits.map(h => h.id === id ? { ...h, is_completed_today: !h.is_completed_today } : h));
  };

  const handleSelectAction = (actionId) => {
    if (actionId === 'open_command') {
      setIsCmdOpen(true);
    } else {
      setCurrentView(actionId);
    }
  };

  return (
    <div className="app-container">
      <Header
        currentView={currentView}
        onChangeView={setCurrentView}
        onOpenCmd={() => setIsCmdOpen(true)}
        isDark={isDark}
        onToggleTheme={toggleTheme}
      />

      <div className="app-body">
        <Sidebar currentView={currentView} onChangeView={setCurrentView} />

        <main className="main-viewport">
          {currentView === 'home' && (
            <HomeView
              notes={notes}
              tasks={tasks}
              projects={projects}
              onNavigate={setCurrentView}
            />
          )}

          {currentView === 'notes' && (
            <NotesView notes={notes} />
          )}

          {currentView === 'tasks' && (
            <TasksView tasks={tasks} projects={projects} onAddTask={handleAddTask} />
          )}

          {currentView === 'journal' && (
            <JournalView journal={[]} habits={habits} onToggleHabit={handleToggleHabit} />
          )}

          {currentView === 'graph' && (
            <GraphView graphLinks={[]} notes={notes} />
          )}
        </main>

        <RightContextPanel currentView={currentView} />
      </div>

      <CommandPaletteModal
        isOpen={isCmdOpen}
        onClose={() => setIsCmdOpen(false)}
        onSelectAction={handleSelectAction}
      />
    </div>
  );
}
