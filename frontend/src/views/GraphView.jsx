import React, { useState } from 'react';
import { Network, Share2, ZoomIn, ZoomOut, Filter, Info, ArrowRight, ExternalLink } from 'lucide-react';

export default function GraphView({
  notes = [],
  tasks = [],
  projects = [],
  journals = [],
  onNavigate
}) {
  // Build dynamic nodes from real system objects
  const nodeItems = [
    ...notes.map(n => ({ id: `nt-${n.id}`, type: 'Note', category: n.para_category || 'Resource', title: n.title, raw: n })),
    ...projects.map(p => ({ id: `prj-${p.id}`, type: 'Project', category: 'Project', title: p.title, raw: p })),
    ...tasks.map(t => ({ id: `tsk-${t.id}`, type: 'Task', category: t.para_category || 'Area', title: t.title, raw: t })),
    ...journals.map(j => ({ id: `jnl-${j.id}`, type: 'Journal', category: 'Area', title: `Journal Log ${j.entry_date}`, raw: j }))
  ];

  const [selectedNode, setSelectedNode] = useState(nodeItems[0] || null);

  // Compute SVG Layout Positions for Nodes
  const totalNodes = nodeItems.length;
  const cx = 300;
  const cy = 200;
  const radius = Math.min(180, Math.max(100, totalNodes * 20));

  const positionedNodes = nodeItems.map((item, index) => {
    const angle = (index / (totalNodes || 1)) * 2 * Math.PI - Math.PI / 2;
    const x = Math.round(cx + radius * Math.cos(angle));
    const y = Math.round(cy + radius * Math.sin(angle));
    return { ...item, x, y };
  });

  const activeNodeObj = selectedNode ? positionedNodes.find(n => n.id === selectedNode.id) || positionedNodes[0] : positionedNodes[0];

  // Derive links connecting active node to adjacent nodes
  const connectedLinks = positionedNodes.filter(n => n.id !== activeNodeObj?.id).slice(0, 3);

  const getNodeColor = (type, category) => {
    switch (type) {
      case 'Note': return 'var(--accent-primary)';
      case 'Project': return 'var(--para-project)';
      case 'Task': return 'var(--accent-success)';
      case 'Journal': return 'var(--accent-warning)';
      default: return 'var(--accent-primary)';
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '20px', height: '100%' }}>
      {/* SVG Interactive Canvas */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', padding: '16px', position: 'relative', overflow: 'hidden' }}>
        <div className="card-header" style={{ zIndex: 10 }}>
          <div>
            <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Network size={18} color="var(--accent-primary)" /> Universal Life Graph Explorer
            </h3>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              Dynamic relationship network ({positionedNodes.length} nodes)
            </span>
          </div>
        </div>

        {/* SVG Canvas */}
        <div style={{ flex: 1, minHeight: '440px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', position: 'relative' }}>
          {positionedNodes.length === 0 ? (
            <div style={{ color: 'var(--text-muted)', fontSize: '13px' }}>No graph nodes available.</div>
          ) : (
            <svg width="100%" height="100%" viewBox="0 0 600 400" style={{ position: 'absolute', inset: 0 }}>
              {/* Dynamic Connection Lines */}
              {activeNodeObj && connectedLinks.map((target) => (
                <line
                  key={`link-${target.id}`}
                  x1={activeNodeObj.x}
                  y1={activeNodeObj.y}
                  x2={target.x}
                  y2={target.y}
                  stroke={getNodeColor(target.type)}
                  strokeWidth="2"
                  strokeDasharray="4"
                  opacity="0.6"
                />
              ))}

              {/* Render All Graph Nodes */}
              {positionedNodes.map((node) => {
                const isSelected = activeNodeObj?.id === node.id;
                const color = getNodeColor(node.type, node.category);

                return (
                  <g
                    key={node.id}
                    transform={`translate(${node.x}, ${node.y})`}
                    onClick={() => setSelectedNode(node)}
                    style={{ cursor: 'pointer' }}
                  >
                    {isSelected && <circle r="22" fill={color} opacity="0.25" />}
                    <circle r={isSelected ? "14" : "10"} fill={color} stroke="var(--bg-card)" strokeWidth="2" />
                    <text
                      x="0"
                      y="24"
                      textAnchor="middle"
                      fill="var(--text-primary)"
                      fontSize="10"
                      fontWeight={isSelected ? "700" : "500"}
                      style={{ pointerEvents: 'none' }}
                    >
                      {node.title.length > 16 ? node.title.slice(0, 14) + '...' : node.title}
                    </text>
                  </g>
                );
              })}
            </svg>
          )}
        </div>
      </div>

      {/* Node Context Inspector Panel */}
      <div className="card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div className="card-header">
          <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Info size={16} color="var(--accent-primary)" /> Node Inspector
          </h3>
        </div>

        {activeNodeObj ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <span className={`badge-para badge-${activeNodeObj.category ? activeNodeObj.category.toLowerCase() : 'project'}`}>
                {activeNodeObj.type} ({activeNodeObj.category})
              </span>
              <h4 style={{ fontFamily: 'var(--font-header)', fontSize: '16px', fontWeight: '700', marginTop: '6px' }}>
                {activeNodeObj.title}
              </h4>
            </div>

            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '12px' }}>
              <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)' }}>
                Active Relationships ({connectedLinks.length})
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '8px' }}>
                {connectedLinks.map((target) => (
                  <div
                    key={target.id}
                    onClick={() => setSelectedNode(target)}
                    style={{
                      fontSize: '12px',
                      padding: '8px',
                      background: 'var(--bg-surface)',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-subtle)',
                      cursor: 'pointer',
                      display: 'flex',
                      justifySpace: 'between',
                      alignItems: 'center'
                    }}
                  >
                    <span style={{ fontWeight: '600' }}>🔗 {target.title}</span>
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>({target.type})</span>
                  </div>
                ))}
              </div>
            </div>

            {onNavigate && (
              <button
                onClick={() => {
                  if (activeNodeObj.type === 'Note') onNavigate('notes');
                  else if (activeNodeObj.type === 'Task' || activeNodeObj.type === 'Project') onNavigate('tasks');
                  else if (activeNodeObj.type === 'Journal') onNavigate('journal');
                }}
                style={{
                  marginTop: '10px',
                  background: 'var(--accent-primary)',
                  color: 'white',
                  padding: '8px 14px',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: '600',
                  fontSize: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Open {activeNodeObj.type} View <ExternalLink size={12} />
              </button>
            )}
          </div>
        ) : (
          <div style={{ color: 'var(--text-muted)', fontSize: '13px', textAlign: 'center', padding: '20px 0' }}>
            Click a node in the graph to inspect its parameters.
          </div>
        )}
      </div>
    </div>
  );
}
