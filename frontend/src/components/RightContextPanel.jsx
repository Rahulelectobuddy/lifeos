import React from 'react';
import { Info, Link2, Sparkles, Tag, ShieldCheck } from 'lucide-react';

export default function RightContextPanel({ currentView }) {
  return (
    <aside className="app-context-panel">
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px' }}>
        <Info size={16} color="var(--accent-primary)" />
        <span style={{ fontFamily: 'var(--font-header)', fontSize: '14px', fontWeight: '700' }}>Context Inspector</span>
      </div>

      {/* Context Badge */}
      <div style={{ background: 'var(--bg-card)', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
        <div style={{ fontSize: '11px', fontWeight: '700', uppercase: 'true', color: 'var(--accent-primary)', marginBottom: '4px' }}>
          Active View Context
        </div>
        <div style={{ fontSize: '14px', fontWeight: '600' }}>
          {currentView.toUpperCase()} WORKSPACE
        </div>
        <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
          Life OS Web Phase 1 Baseline
        </div>
      </div>

      {/* AI Summary Widget */}
      <div style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.06), rgba(14,165,233,0.06))', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid rgba(99,102,241,0.15)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: '700', color: 'var(--accent-primary)', marginBottom: '6px' }}>
          <Sparkles size={14} /> AI Context Assistant
        </div>
        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
          All active items are cross-linked across the PARA Framework topology using the <code>entity_links</code> graph table.
        </p>
      </div>

      {/* Backlinks Engine Panel */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)' }}>Connected Entity Graph</span>
        <div style={{ padding: '8px 10px', background: 'var(--bg-card)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Link2 size={14} color="var(--para-project)" />
          <span>Project: Migrate Homelab</span>
        </div>
        <div style={{ padding: '8px 10px', background: 'var(--bg-card)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Link2 size={14} color="var(--para-resource)" />
          <span>Note: Design Tokens</span>
        </div>
      </div>

      {/* Health Indicator */}
      <div style={{ marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--accent-success)' }}>
        <ShieldCheck size={14} /> REST API Connection Active
      </div>
    </aside>
  );
}
