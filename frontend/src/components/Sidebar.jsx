import React from 'react';
import { Layers, Folder, Bookmark, Archive, Plus, ChevronDown } from 'lucide-react';

export default function Sidebar({ currentView, onChangeView }) {
  return (
    <aside className="app-sidebar">
      {/* Workspace Switcher */}
      <div className="workspace-switcher">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-success)' }}></div>
          <span style={{ fontSize: '13px', fontWeight: '600' }}>Cypher Workspace</span>
        </div>
        <ChevronDown size={14} color="var(--text-muted)" />
      </div>

      {/* PARA Framework Sitemap */}
      <div className="sidebar-menu">
        <div className="sidebar-menu-title">PARA Framework Tree</div>

        <div className="sidebar-item" onClick={() => onChangeView('tasks')}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Layers size={14} color="var(--para-project)" />
            <span>Projects (P)</span>
          </div>
          <span className="badge-para badge-project">3</span>
        </div>

        <div className="sidebar-item" onClick={() => onChangeView('journal')}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Folder size={14} color="var(--para-area)" />
            <span>Areas (A)</span>
          </div>
          <span className="badge-para badge-area">4</span>
        </div>

        <div className="sidebar-item" onClick={() => onChangeView('notes')}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Bookmark size={14} color="var(--para-resource)" />
            <span>Resources (R)</span>
          </div>
          <span className="badge-para badge-resource">5</span>
        </div>

        <div className="sidebar-item" onClick={() => onChangeView('notes')}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Archive size={14} color="var(--para-archive)" />
            <span>Archives (A)</span>
          </div>
          <span className="badge-para badge-archive">2</span>
        </div>
      </div>
    </aside>
  );
}
