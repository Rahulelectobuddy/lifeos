import React, { useState } from 'react';
import { BookOpen, Pin, Tag, Share2, Plus, FileText, Link2 } from 'lucide-react';

export default function NotesView({ notes, onSelectNote, selectedNote }) {
  const [activeNote, setActiveNote] = useState(selectedNote || notes[0] || null);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '20px', height: '100%' }}>
      {/* Left Note List */}
      <div className="card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 className="card-title">Second Brain Notes</h3>
          <button style={{ background: 'var(--accent-primary)', color: 'white', padding: '6px 10px', borderRadius: 'var(--radius-sm)', fontSize: '12px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Plus size={14} /> New
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', overflowY: 'auto' }}>
          {notes.map((n) => (
            <div
              key={n.id}
              onClick={() => {
                setActiveNote(n);
                if (onSelectNote) onSelectNote(n);
              }}
              style={{
                padding: '12px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
                background: activeNote?.id === n.id ? 'var(--bg-hover)' : 'var(--bg-card)',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <span style={{ fontWeight: '600', fontSize: '13px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '200px' }}>
                  {n.title}
                </span>
                {n.is_pinned && <Pin size={12} color="var(--accent-primary)" fill="var(--accent-primary)" />}
              </div>
              <span className={`badge-para badge-${n.para_category.toLowerCase()}`}>{n.para_category}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Center Note Workspace / Markdown Canvas */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '24px' }}>
        {activeNote ? (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '16px' }}>
              <div>
                <span className={`badge-para badge-${activeNote.para_category.toLowerCase()}`} style={{ marginBottom: '8px', display: 'inline-block' }}>
                  {activeNote.para_category} Note
                </span>
                <h1 style={{ fontFamily: 'var(--font-header)', fontSize: '22px', fontWeight: '700' }}>
                  {activeNote.title}
                </h1>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="cmd-k-btn" style={{ padding: '6px 10px' }}><Pin size={14} /></button>
                <button className="cmd-k-btn" style={{ padding: '6px 10px' }}><Share2 size={14} /></button>
              </div>
            </div>

            {/* Tags bar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-muted)' }}>
              <Tag size={14} />
              <span>Tags: {activeNote.tags || 'none'}</span>
            </div>

            {/* Content area */}
            <div style={{ flex: 1, fontFamily: 'var(--font-sans)', fontSize: '14px', lineHeight: '1.7', whiteSpace: 'pre-wrap', color: 'var(--text-primary)', background: 'var(--bg-card)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              {activeNote.content}
            </div>

            {/* Backlink Inspector Footer */}
            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '12px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: 'var(--text-secondary)' }}>
              <Link2 size={16} color="var(--accent-primary)" />
              <span>Bi-directional Backlinks: <strong>[[Project - Migrate Homelab to Proxmox VE]]</strong></span>
            </div>
          </>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)' }}>
            Select a note to view
          </div>
        )}
      </div>
    </div>
  );
}
