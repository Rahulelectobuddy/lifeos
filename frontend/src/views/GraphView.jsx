import React, { useState } from 'react';
import { Network, Share2, ZoomIn, ZoomOut, Filter, Info } from 'lucide-react';

export default function GraphView({ graphLinks, notes }) {
  const [selectedNode, setSelectedNode] = useState({
    title: "Proxmox VE Homelab Cluster Architecture",
    type: "Note (Resource)",
    links: [
      "Project - Migrate Homelab to Proxmox VE",
      "Daily Log 2026-09-10"
    ]
  });

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '20px', height: '100%' }}>
      {/* Graph Visual Canvas */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', padding: '16px', position: 'relative', overflow: 'hidden' }}>
        <div className="card-header" style={{ zIndex: 10 }}>
          <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Network size={18} color="var(--accent-primary)" /> Universal Life Graph Explorer
          </h3>
          <div style={{ display: 'flex', gap: '6px' }}>
            <button className="cmd-k-btn" style={{ padding: '6px 10px' }}><ZoomIn size={14} /></button>
            <button className="cmd-k-btn" style={{ padding: '6px 10px' }}><ZoomOut size={14} /></button>
          </div>
        </div>

        {/* SVG Interactive Graph Canvas */}
        <div style={{ flex: 1, minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', position: 'relative' }}>
          <svg width="100%" height="100%" viewBox="0 0 600 400" style={{ position: 'absolute', inset: 0 }}>
            {/* Graph Node Links */}
            <line x1="300" y1="200" x2="180" y2="100" stroke="var(--accent-primary)" strokeWidth="2" strokeDasharray="4" />
            <line x1="300" y1="200" x2="420" y2="120" stroke="var(--para-project)" strokeWidth="2" />
            <line x1="300" y1="200" x2="350" y2="300" stroke="var(--para-resource)" strokeWidth="2" />
            <line x1="180" y1="100" x2="120" y2="220" stroke="var(--para-area)" strokeWidth="1.5" />

            {/* Node 1: Selected Central Node */}
            <g transform="translate(300, 200)" style={{ cursor: 'pointer' }}>
              <circle r="24" fill="var(--accent-primary)" opacity="0.2" />
              <circle r="14" fill="var(--accent-primary)" />
              <text x="0" y="28" textAnchor="middle" fill="var(--text-primary)" fontSize="11" fontWeight="600">Proxmox Arch</text>
            </g>

            {/* Node 2: Homelab Project */}
            <g transform="translate(420, 120)" style={{ cursor: 'pointer' }}>
              <circle r="12" fill="var(--para-project)" />
              <text x="0" y="24" textAnchor="middle" fill="var(--text-primary)" fontSize="11">Migrate Homelab</text>
            </g>

            {/* Node 3: Design Tokens Note */}
            <g transform="translate(180, 100)" style={{ cursor: 'pointer' }}>
              <circle r="12" fill="var(--para-resource)" />
              <text x="0" y="24" textAnchor="middle" fill="var(--text-primary)" fontSize="11">Design Tokens</text>
            </g>

            {/* Node 4: Daily Log */}
            <g transform="translate(350, 300)" style={{ cursor: 'pointer' }}>
              <circle r="10" fill="var(--para-area)" />
              <text x="0" y="22" textAnchor="middle" fill="var(--text-primary)" fontSize="11">Daily Log</text>
            </g>
          </svg>
        </div>
      </div>

      {/* Node Context Inspector Panel */}
      <div className="card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div className="card-header">
          <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Info size={16} color="var(--accent-primary)" /> Node Inspector
          </h3>
        </div>

        {selectedNode && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <span style={{ fontSize: '11px', fontWeight: '700', uppercase: 'true', color: 'var(--accent-primary)' }}>
                {selectedNode.type}
              </span>
              <h4 style={{ fontFamily: 'var(--font-header)', fontSize: '15px', fontWeight: '700', marginTop: '2px' }}>
                {selectedNode.title}
              </h4>
            </div>

            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '12px' }}>
              <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)' }}>
                Connected Relationships ({selectedNode.links.length})
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '8px' }}>
                {selectedNode.links.map((link, idx) => (
                  <div key={idx} style={{ fontSize: '12px', padding: '6px 8px', background: 'var(--bg-card)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                    🔗 {link}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
