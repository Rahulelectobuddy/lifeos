import React, { useState } from 'react';
import { Calendar, Smile, Flame, CheckCircle2, Award, Sparkles } from 'lucide-react';

export default function JournalView({ journal, habits, onToggleHabit }) {
  const [mood, setMood] = useState(5);
  const [reflectionText, setReflectionText] = useState(
    journal[0]?.reflections || "Completed Penpot 6-screen web wireframe suite, updated all project documentation, defined backend architecture, and launched local execution build."
  );

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px' }}>
      {/* Left Column: Daily Journal Reflections */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div className="card">
          <div className="card-header">
            <div>
              <h2 style={{ fontFamily: 'var(--font-header)', fontSize: '20px', fontWeight: '700' }}>
                Daily Reflection Journal
              </h2>
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                September 11, 2026 • Today's Log
              </span>
            </div>
            <div style={{ display: 'flex', gap: '6px' }}>
              {[1, 2, 3, 4, 5].map((m) => (
                <button
                  key={m}
                  onClick={() => setMood(m)}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    border: '1px solid var(--border-subtle)',
                    background: mood === m ? 'var(--accent-primary)' : 'var(--bg-card)',
                    color: mood === m ? 'white' : 'var(--text-primary)',
                    fontWeight: '700',
                    fontSize: '13px'
                  }}
                >
                  {m}★
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>
              What went exceptionally well today? (Wins & Progress)
            </label>
            <textarea
              rows={6}
              value={reflectionText}
              onChange={(e) => setReflectionText(e.target.value)}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
                background: 'var(--bg-card)',
                outline: 'none',
                resize: 'vertical',
                lineHeight: '1.6',
                fontSize: '14px'
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button style={{ background: 'var(--accent-primary)', color: 'white', padding: '8px 16px', borderRadius: 'var(--radius-md)', fontWeight: '600', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sparkles size={14} /> Save Reflection Log
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Habit Tracker Matrix */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div className="card">
          <div className="card-header">
            <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Flame size={18} color="var(--accent-warning)" /> Habit Streak Tracker
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {habits.map((h) => (
              <div
                key={h.id}
                style={{
                  padding: '12px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                  background: h.is_completed_today ? 'rgba(16,185,129,0.08)' : 'var(--bg-card)',
                  display: 'flex',
                  justify: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <div style={{ fontSize: '13px', fontWeight: '600' }}>{h.name}</div>
                  <div style={{ fontSize: '12px', color: 'var(--accent-warning)', fontWeight: '600', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Flame size={12} /> {h.streak_count} Day Streak
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={h.is_completed_today}
                  onChange={() => onToggleHabit && onToggleHabit(h.id)}
                  style={{ accentColor: 'var(--accent-success)', width: '18px', height: '18px', cursor: 'pointer' }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
