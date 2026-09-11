import React, { useState, useEffect } from 'react';
import {
  BookOpen, Pin, Tag, Share2, Plus, FileText, Link2, Trash2, Search,
  Filter, Edit3, Check, X, Folder, FolderOpen, ChevronRight, ChevronDown, FileCode, Eye
} from 'lucide-react';

// Markdown Preview Renderer Helper
function MarkdownPreview({ content }) {
  if (!content) {
    return <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>Empty note content. Click Edit Markdown to add details.</span>;
  }

  const lines = content.split('\n');
  const elements = [];
  let inCodeBlock = false;
  let codeBlockLines = [];

  const parseInlineMarkdown = (text) => {
    // Process bold **text**, inline `code`, and [[backlinks]]
    const parts = text.split(/(\*\*.*?\*\*|`.*?`|\[\[.*?\]\])/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i}>{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code key={i} style={{ background: 'var(--bg-hover)', padding: '2px 6px', borderRadius: '4px', fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--accent-primary)' }}>
            {part.slice(1, -1)}
          </code>
        );
      }
      if (part.startsWith('[[') && part.endsWith(']]')) {
        return (
          <span key={i} style={{ background: 'rgba(99, 102, 241, 0.12)', color: 'var(--accent-primary)', padding: '2px 6px', borderRadius: '4px', fontWeight: '600', fontSize: '12px', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
            {part}
          </span>
        );
      }
      return part;
    });
  };

  lines.forEach((line, idx) => {
    // Code block check
    if (line.trim().startsWith('```')) {
      if (inCodeBlock) {
        elements.push(
          <pre key={`code-${idx}`} style={{ background: 'var(--bg-surface)', padding: '12px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', fontFamily: 'var(--font-mono)', fontSize: '12.5px', color: 'var(--text-primary)', overflowX: 'auto', margin: '8px 0' }}>
            <code>{codeBlockLines.join('\n')}</code>
          </pre>
        );
        codeBlockLines = [];
        inCodeBlock = false;
      } else {
        inCodeBlock = true;
      }
      return;
    }

    if (inCodeBlock) {
      codeBlockLines.push(line);
      return;
    }

    // Headings
    if (line.startsWith('# ')) {
      elements.push(<h1 key={idx} style={{ fontFamily: 'var(--font-header)', fontSize: '20px', fontWeight: '700', margin: '14px 0 8px', color: 'var(--text-primary)', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '4px' }}>{parseInlineMarkdown(line.slice(2))}</h1>);
    } else if (line.startsWith('## ')) {
      elements.push(<h2 key={idx} style={{ fontFamily: 'var(--font-header)', fontSize: '17px', fontWeight: '700', margin: '12px 0 6px', color: 'var(--text-primary)' }}>{parseInlineMarkdown(line.slice(3))}</h2>);
    } else if (line.startsWith('### ')) {
      elements.push(<h3 key={idx} style={{ fontFamily: 'var(--font-header)', fontSize: '15px', fontWeight: '600', margin: '10px 0 4px', color: 'var(--text-primary)' }}>{parseInlineMarkdown(line.slice(4))}</h3>);
    } else if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
      elements.push(<li key={idx} style={{ marginLeft: '20px', marginBottom: '4px', listStyleType: 'disc' }}>{parseInlineMarkdown(line.trim().slice(2))}</li>);
    } else if (line.trim().startsWith('> ')) {
      elements.push(<blockquote key={idx} style={{ borderLeft: '3px solid var(--accent-primary)', paddingLeft: '12px', margin: '8px 0', fontStyle: 'italic', color: 'var(--text-secondary)' }}>{parseInlineMarkdown(line.trim().slice(2))}</blockquote>);
    } else if (line.trim() === '') {
      elements.push(<div key={idx} style={{ height: '8px' }}></div>);
    } else {
      elements.push(<p key={idx} style={{ marginBottom: '6px', lineHeight: '1.6' }}>{parseInlineMarkdown(line)}</p>);
    }
  });

  return <div style={{ display: 'flex', flexDirection: 'column' }}>{elements}</div>;
}

export default function NotesView({
  notes = [],
  onAddNote,
  onUpdateNote,
  onDeleteNote,
  projects = [],
  tasks = []
}) {
  const [activeNote, setActiveNote] = useState(notes[0] || null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('ALL');

  // Expanded folders state
  const [expandedFolders, setExpandedFolders] = useState({ 'General': true, 'Infrastructure': true, 'Design': true });

  // Edit Mode state
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editCategory, setEditCategory] = useState('Resource');
  const [editFolder, setEditFolder] = useState('General');
  const [editTags, setEditTags] = useState('');

  // New Note Modal state
  const [showNewModal, setShowNewModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState('Resource');
  const [newFolder, setNewFolder] = useState('General');
  const [newTags, setNewTags] = useState('');
  const [newPinned, setNewPinned] = useState(false);

  // Sync activeNote when notes list changes
  useEffect(() => {
    if (activeNote) {
      const updated = notes.find(n => n.id === activeNote.id);
      if (updated) {
        setActiveNote(updated);
      } else if (notes.length > 0) {
        setActiveNote(notes[0]);
      } else {
        setActiveNote(null);
      }
    } else if (notes.length > 0) {
      setActiveNote(notes[0]);
    }
  }, [notes]);

  const toggleFolder = (folderName) => {
    setExpandedFolders(prev => ({ ...prev, [folderName]: !prev[folderName] }));
  };

  const startEditing = () => {
    if (!activeNote) return;
    setEditTitle(activeNote.title || '');
    setEditContent(activeNote.content || '');
    setEditCategory(activeNote.para_category || 'Resource');
    setEditFolder(activeNote.folder_path || 'General');
    setEditTags(activeNote.tags || '');
    setIsEditing(true);
  };

  const saveEditing = () => {
    if (!activeNote || !onUpdateNote) return;
    onUpdateNote(activeNote.id, {
      title: editTitle.trim(),
      content: editContent,
      para_category: editCategory,
      folder_path: editFolder.trim() || 'General',
      tags: editTags
    });
    setIsEditing(false);
  };

  const handleCreateNote = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    if (onAddNote) {
      onAddNote({
        title: newTitle.trim(),
        content: newContent,
        para_category: newCategory,
        folder_path: newFolder.trim() || 'General',
        tags: newTags,
        is_pinned: newPinned
      });
    }

    setNewTitle('');
    setNewContent('');
    setNewTags('');
    setNewPinned(false);
    setShowNewModal(false);
  };

  // Filter notes
  const filteredNotes = notes.filter(n => {
    const matchesCategory = filterCategory === 'ALL' || (n.para_category && n.para_category.toUpperCase() === filterCategory.toUpperCase());
    const matchesSearch = !searchQuery.trim() ||
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (n.content && n.content.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Group notes into folder tree structure
  const folderTree = filteredNotes.reduce((acc, note) => {
    const folder = note.folder_path || 'General';
    if (!acc[folder]) acc[folder] = [];
    acc[folder].push(note);
    return acc;
  }, {});

  // Extract bi-directional backlinks from content matching [[...]]
  const extractBacklinks = (content) => {
    if (!content) return [];
    const matches = content.match(/\[\[(.*?)\]\]/g) || [];
    return matches.map(m => m.replace(/\[\[|\]\]/g, ''));
  };

  const backlinks = activeNote ? extractBacklinks(activeNote.content) : [];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '20px', height: '100%' }}>
      {/* Left Note List Panel with Folder Tree */}
      <div className="card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <BookOpen size={16} color="var(--accent-primary)" /> Second Brain Tree
          </h3>
          <button
            onClick={() => setShowNewModal(true)}
            style={{
              background: 'var(--accent-primary)',
              color: 'white',
              padding: '6px 12px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '12px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            <Plus size={14} /> New
          </button>
        </div>

        {/* Search bar */}
        <div style={{ position: 'relative' }}>
          <Search size={13} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search notes & content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '6px 10px 6px 30px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              background: 'var(--bg-surface)',
              color: 'var(--text-primary)',
              fontSize: '12px',
              outline: 'none'
            }}
          />
        </div>

        {/* Category Filters */}
        <div style={{ display: 'flex', gap: '4px', overflowX: 'auto', paddingBottom: '4px' }}>
          {['ALL', 'PROJECT', 'AREA', 'RESOURCE', 'ARCHIVE'].map(cat => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              style={{
                padding: '3px 8px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '10px',
                fontWeight: '600',
                border: 'none',
                background: filterCategory === cat ? 'var(--accent-primary)' : 'var(--bg-surface)',
                color: filterCategory === cat ? 'white' : 'var(--text-secondary)',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Nested Folder Tree Hierarchy */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', overflowY: 'auto', flex: 1 }}>
          {Object.keys(folderTree).length === 0 ? (
            <div style={{ padding: '20px 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: '12px' }}>
              No Markdown notes match filter.
            </div>
          ) : (
            Object.keys(folderTree).map((folderName) => {
              const isFolderOpen = expandedFolders[folderName] !== false;
              const folderNotes = folderTree[folderName];

              return (
                <div key={folderName} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {/* Folder Item Header */}
                  <div
                    onClick={() => toggleFolder(folderName)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '12px',
                      fontWeight: '700',
                      color: 'var(--text-secondary)',
                      padding: '4px 6px',
                      borderRadius: 'var(--radius-sm)',
                      cursor: 'pointer',
                      background: 'var(--bg-surface)'
                    }}
                  >
                    {isFolderOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    {isFolderOpen ? <FolderOpen size={14} color="var(--accent-primary)" /> : <Folder size={14} color="var(--accent-primary)" />}
                    <span>{folderName}</span>
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)', marginLeft: 'auto' }}>({folderNotes.length})</span>
                  </div>

                  {/* Folder Children (Nested MD Notes) */}
                  {isFolderOpen && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', paddingLeft: '16px' }}>
                      {folderNotes.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => {
                            setActiveNote(n);
                            setIsEditing(false);
                          }}
                          style={{
                            padding: '8px 10px',
                            borderRadius: 'var(--radius-md)',
                            border: activeNote?.id === n.id ? '1px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                            background: activeNote?.id === n.id ? 'var(--bg-hover)' : 'var(--bg-card)',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '4px'
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontWeight: '600', fontSize: '12.5px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '180px' }}>
                              📄 {n.title}
                            </span>
                            {n.is_pinned && <Pin size={11} color="var(--accent-primary)" fill="var(--accent-primary)" />}
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span className={`badge-para badge-${n.para_category ? n.para_category.toLowerCase() : 'resource'}`} style={{ fontSize: '9px', padding: '1px 5px' }}>
                              {n.para_category || 'Resource'}
                            </span>
                            <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>.md</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Center Note Workspace / Markdown Editor */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '24px' }}>
        {activeNote ? (
          <>
            {/* Header controls */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '16px' }}>
              <div style={{ flex: 1, marginRight: '16px' }}>
                {!isEditing ? (
                  <>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
                      <span className={`badge-para badge-${activeNote.para_category ? activeNote.para_category.toLowerCase() : 'resource'}`}>
                        {activeNote.para_category || 'Resource'} Note
                      </span>
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Folder size={12} /> {activeNote.folder_path || 'General'}
                      </span>
                      <span style={{ fontSize: '11px', background: 'rgba(16,185,129,0.12)', color: 'var(--accent-success)', padding: '2px 6px', borderRadius: '4px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '3px' }}>
                        <Eye size={10} /> Markdown Preview Mode
                      </span>
                    </div>
                    <h1 style={{ fontFamily: 'var(--font-header)', fontSize: '22px', fontWeight: '700' }}>
                      {activeNote.title}
                    </h1>
                  </>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      style={{ fontSize: '18px', fontWeight: '700', padding: '8px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--accent-primary)', background: 'var(--bg-card)', color: 'var(--text-primary)', outline: 'none' }}
                    />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                      <select
                        value={editCategory}
                        onChange={(e) => setEditCategory(e.target.value)}
                        style={{ padding: '6px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', background: 'var(--bg-card)', color: 'var(--text-primary)' }}
                      >
                        <option value="Project">Project</option>
                        <option value="Area">Area</option>
                        <option value="Resource">Resource</option>
                        <option value="Archive">Archive</option>
                      </select>

                      <input
                        type="text"
                        placeholder="Folder Path (e.g. Infrastructure)..."
                        value={editFolder}
                        onChange={(e) => setEditFolder(e.target.value)}
                        style={{ padding: '6px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', background: 'var(--bg-card)', color: 'var(--text-primary)' }}
                      />

                      <input
                        type="text"
                        placeholder="Tags (comma separated)..."
                        value={editTags}
                        onChange={(e) => setEditTags(e.target.value)}
                        style={{ padding: '6px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', background: 'var(--bg-card)', color: 'var(--text-primary)' }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div style={{ display: 'flex', gap: '8px' }}>
                {!isEditing ? (
                  <>
                    <button
                      onClick={startEditing}
                      title="Edit note"
                      style={{ padding: '6px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: '600' }}
                    >
                      <Edit3 size={14} /> Edit Markdown
                    </button>
                    <button
                      onClick={() => onUpdateNote && onUpdateNote(activeNote.id, { is_pinned: !activeNote.is_pinned })}
                      title={activeNote.is_pinned ? 'Unpin' : 'Pin note'}
                      style={{ padding: '6px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', background: activeNote.is_pinned ? 'rgba(99,102,241,0.15)' : 'var(--bg-surface)', cursor: 'pointer' }}
                    >
                      <Pin size={14} color={activeNote.is_pinned ? 'var(--accent-primary)' : 'var(--text-secondary)'} />
                    </button>
                    {onDeleteNote && (
                      <button
                        onClick={() => onDeleteNote(activeNote.id)}
                        title="Delete note"
                        style={{ padding: '6px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.1)', color: '#ef4444', cursor: 'pointer' }}
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </>
                ) : (
                  <>
                    <button
                      onClick={saveEditing}
                      style={{ padding: '6px 12px', borderRadius: 'var(--radius-sm)', background: 'var(--accent-success)', color: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: '600' }}
                    >
                      <Check size={14} /> Save Changes
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      style={{ padding: '6px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', background: 'transparent', cursor: 'pointer', fontSize: '12px' }}
                    >
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Tags display */}
            {!isEditing && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-muted)' }}>
                <Tag size={14} />
                <span>Tags: {activeNote.tags || 'none'}</span>
              </div>
            )}

            {/* Content area: Formatted Markdown Preview By Default */}
            {!isEditing ? (
              <div style={{ flex: 1, fontFamily: 'var(--font-sans)', fontSize: '14px', lineHeight: '1.7', color: 'var(--text-primary)', background: 'var(--bg-card)', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', overflowY: 'auto' }}>
                <MarkdownPreview content={activeNote.content} />
              </div>
            ) : (
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                rows={14}
                placeholder="Write Markdown note content (supports headings, code snippets, lists & [[Backlinks]])..."
                style={{ flex: 1, fontFamily: 'monospace', fontSize: '13px', lineHeight: '1.6', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--accent-primary)', background: 'var(--bg-card)', color: 'var(--text-primary)', outline: 'none', resize: 'none' }}
              />
            )}

            {/* Backlink Inspector Footer */}
            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '12px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: 'var(--text-secondary)', flexWrap: 'wrap' }}>
              <Link2 size={16} color="var(--accent-primary)" />
              <span>Bi-directional Backlinks:</span>
              {backlinks.length === 0 ? (
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>No `[[Backlink]]` tags detected in this note.</span>
              ) : (
                backlinks.map((link, idx) => (
                  <span
                    key={idx}
                    style={{
                      background: 'rgba(99,102,241,0.1)',
                      color: 'var(--accent-primary)',
                      padding: '2px 8px',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '12px',
                      fontWeight: '600',
                      border: '1px solid rgba(99,102,241,0.2)'
                    }}
                  >
                    [[{link}]]
                  </span>
                ))
              )}
            </div>
          </>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)', gap: '12px' }}>
            <BookOpen size={48} color="var(--border-subtle)" />
            <div>Select or create a note to start building your Second Brain knowledge graph.</div>
          </div>
        )}
      </div>

      {/* New Note Modal */}
      {showNewModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="card" style={{ width: '500px', background: 'var(--bg-surface)', padding: '24px', borderRadius: 'var(--radius-md)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontWeight: '700', fontSize: '16px' }}>Create Second Brain Markdown Note</h3>
              <button onClick={() => setShowNewModal(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}><X size={18} /></button>
            </div>

            <form onSubmit={handleCreateNote} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <input
                type="text"
                placeholder="Note Title (e.g. Proxmox VE Cluster Architecture)..."
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                required
                autoFocus
                style={{ padding: '10px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', background: 'var(--bg-card)', color: 'var(--text-primary)', outline: 'none' }}
              />

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>PARA Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    style={{ width: '100%', padding: '8px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', background: 'var(--bg-card)', color: 'var(--text-primary)' }}
                  >
                    <option value="Project">Project</option>
                    <option value="Area">Area</option>
                    <option value="Resource">Resource</option>
                    <option value="Archive">Archive</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Folder Path</label>
                  <input
                    type="text"
                    placeholder="General / Infrastructure..."
                    value={newFolder}
                    onChange={(e) => setNewFolder(e.target.value)}
                    style={{ width: '100%', padding: '8px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', background: 'var(--bg-card)', color: 'var(--text-primary)' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Tags</label>
                  <input
                    type="text"
                    placeholder="proxmox, zfs..."
                    value={newTags}
                    onChange={(e) => setNewTags(e.target.value)}
                    style={{ width: '100%', padding: '8px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', background: 'var(--bg-card)', color: 'var(--text-primary)' }}
                  />
                </div>
              </div>

              <textarea
                placeholder="Write Markdown note content (supports headings, code blocks & [[Backlinks]])..."
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                rows={6}
                style={{ padding: '10px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', background: 'var(--bg-card)', color: 'var(--text-primary)', outline: 'none', resize: 'vertical' }}
              />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                  <input type="checkbox" checked={newPinned} onChange={(e) => setNewPinned(e.target.checked)} />
                  Pin to top
                </label>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button type="button" onClick={() => setShowNewModal(false)} style={{ padding: '8px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', background: 'transparent', cursor: 'pointer' }}>Cancel</button>
                  <button type="submit" style={{ padding: '8px 18px', borderRadius: 'var(--radius-md)', background: 'var(--accent-primary)', color: 'white', border: 'none', fontWeight: '600', cursor: 'pointer' }}>Create Note</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
