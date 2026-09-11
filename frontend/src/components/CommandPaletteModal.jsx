import React, { useState, useEffect } from 'react';
import { Search, Zap, BookOpen, CheckCircle2, Network, Calendar, X } from 'lucide-react';

export default function CommandPaletteModal({ isOpen, onClose, onSelectAction }) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onSelectAction('open_command');
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, onSelectAction]);

  if (!isOpen) return null;

  const actions = [
    { id: 'notes', label: 'Go to Second Brain Notes', icon: BookOpen, category: 'Navigation' },
    { id: 'tasks', label: 'Go to Tasks & Project Management', icon: CheckCircle2, category: 'Navigation' },
    { id: 'journal', label: 'Open Daily Journal & Habit Log', icon: Calendar, category: 'Navigation' },
    { id: 'graph', label: 'Explore Knowledge Graph View', icon: Network, category: 'Navigation' },
    { id: 'new_note', label: 'Create New Quick Note', icon: Zap, category: 'Action' },
  ];

  const filtered = actions.filter(a => a.label.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', padding: '0 16px', borderBottom: '1px solid var(--border-subtle)' }}>
          <Search size={18} color="var(--text-muted)" />
          <input
            type="text"
            className="cmd-input"
            placeholder="Type a command or search entities... (Press Esc to close)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
          <button onClick={onClose} style={{ color: 'var(--text-muted)' }}><X size={18} /></button>
        </div>

        <div style={{ padding: '8px', maxHeight: '300px', overflowY: 'auto' }}>
          {filtered.map((act) => {
            const Icon = act.icon;
            return (
              <div
                key={act.id}
                onClick={() => {
                  onSelectAction(act.id);
                  onClose();
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justify: 'space-between',
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
                className="sidebar-item"
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Icon size={16} color="var(--accent-primary)" />
                  <span>{act.label}</span>
                </div>
                <span className="kbd-badge">{act.category}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
