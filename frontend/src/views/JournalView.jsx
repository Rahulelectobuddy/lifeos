import React, { useState, useEffect } from 'react';
import {
  Calendar, Flame, CheckCircle2, Sparkles, Plus, Trash2, BookOpen, Smile, Trophy, X, Eye, Edit3
} from 'lucide-react';

export default function JournalView({
  journals = [],
  habits = [],
  onSaveJournal,
  onToggleHabit,
  onAddHabit,
  onDeleteHabit
}) {
  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(todayStr);

  const currentJournal = journals.find(j => j.entry_date === selectedDate) || null;

  const [mood, setMood] = useState(currentJournal?.mood_rating || 5);
  const [reflectionsText, setReflectionsText] = useState(currentJournal?.reflections || '');
  const [winsText, setWinsText] = useState(currentJournal?.wins || '');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  // History entry pop-up modal state
  const [viewingJournal, setViewingJournal] = useState(null);

  // Habit modal form state
  const [showHabitForm, setShowHabitForm] = useState(false);
  const [newHabitName, setNewHabitName] = useState('');

  // Sync state when selectedDate or journals change
  useEffect(() => {
    const found = journals.find(j => j.entry_date === selectedDate);
    if (found) {
      setMood(found.mood_rating || 5);
      setReflectionsText(found.reflections || '');
      setWinsText(found.wins || '');
    } else {
      setMood(5);
      setReflectionsText('');
      setWinsText('');
    }
  }, [selectedDate, journals]);

  const handleSave = (e) => {
    e.preventDefault();
    if (onSaveJournal) {
      onSaveJournal({
        entry_date: selectedDate,
        mood_rating: mood,
        reflections: reflectionsText,
        wins: winsText
      });
    }

    setSaveSuccessMsg('Reflection log saved successfully!');
    setTimeout(() => setSaveSuccessMsg(''), 3000);
  };

  const handleCreateHabit = (e) => {
    e.preventDefault();
    if (!newHabitName.trim()) return;

    if (onAddHabit) {
      onAddHabit({ name: newHabitName.trim() });
    }

    setNewHabitName('');
    setShowHabitForm(false);
  };

  const completedHabitsCount = habits.filter(h => h.is_completed_today).length;
  const habitCompletionRate = habits.length > 0 ? Math.round((completedHabitsCount / habits.length) * 100) : 0;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px' }}>
      {/* Left Column: Daily Journal Reflections */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div className="card">
          <div className="card-header" style={{ flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h2 style={{ fontFamily: 'var(--font-header)', fontSize: '20px', fontWeight: '700' }}>
                Daily Reflection Journal
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                <Calendar size={14} color="var(--text-secondary)" />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  style={{
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-primary)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '4px 8px',
                    fontSize: '12px',
                    fontWeight: '600'
                  }}
                />
                {selectedDate === todayStr && (
                  <span style={{ fontSize: '11px', background: 'rgba(99,102,241,0.15)', color: 'var(--accent-primary)', padding: '2px 6px', borderRadius: '4px', fontWeight: '600' }}>
                    Today
                  </span>
                )}
              </div>
            </div>

            {/* Mood selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginRight: '4px' }}>Mood Rating:</span>
              {[1, 2, 3, 4, 5].map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMood(m)}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    border: '1px solid var(--border-subtle)',
                    background: mood === m ? 'var(--accent-primary)' : 'var(--bg-card)',
                    color: mood === m ? 'white' : 'var(--text-primary)',
                    fontWeight: '700',
                    fontSize: '13px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {m}★
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {saveSuccessMsg && (
              <div style={{ padding: '10px 14px', borderRadius: 'var(--radius-md)', background: 'rgba(16,185,129,0.15)', color: 'var(--accent-success)', fontSize: '13px', fontWeight: '600', border: '1px solid rgba(16,185,129,0.3)' }}>
                ✓ {saveSuccessMsg}
              </div>
            )}

            <div>
              <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                Key Wins & Accomplishments
              </label>
              <textarea
                rows={3}
                placeholder="List major breakthroughs, completed tasks, or highlights..."
                value={winsText}
                onChange={(e) => setWinsText(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                  background: 'var(--bg-card)',
                  color: 'var(--text-primary)',
                  outline: 'none',
                  resize: 'vertical',
                  lineHeight: '1.6',
                  fontSize: '13.5px'
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                Daily Reflections & Evening Summary
              </label>
              <textarea
                rows={5}
                placeholder="What went well today? What challenges did you encounter?"
                value={reflectionsText}
                onChange={(e) => setReflectionsText(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                  background: 'var(--bg-card)',
                  color: 'var(--text-primary)',
                  outline: 'none',
                  resize: 'vertical',
                  lineHeight: '1.6',
                  fontSize: '13.5px'
                }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="submit"
                style={{
                  background: 'var(--accent-primary)',
                  color: 'white',
                  padding: '10px 20px',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: '600',
                  fontSize: '13px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                <Sparkles size={14} /> Save Journal Entry
              </button>
            </div>
          </form>
        </div>

        {/* Journal History log list */}
        {journals.length > 0 && (
          <div className="card">
            <h3 className="card-title" style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <BookOpen size={16} color="var(--accent-primary)" /> Journal Entry Logs ({journals.length})
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {journals.map(j => (
                <div
                  key={j.id}
                  onClick={() => setViewingJournal(j)}
                  style={{
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    border: selectedDate === j.entry_date ? '1px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                    background: selectedDate === j.entry_date ? 'var(--bg-hover)' : 'var(--bg-card)',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '13px', fontWeight: '600' }}>{j.entry_date}</span>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginLeft: '6px' }}>
                      {j.wins ? j.wins.slice(0, 35) + '...' : j.reflections ? j.reflections.slice(0, 35) + '...' : 'No notes'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--accent-warning)' }}>
                      {j.mood_rating || 5}★
                    </span>
                    <button
                      onClick={(e) => { e.stopPropagation(); setViewingJournal(j); }}
                      style={{ padding: '3px 8px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', fontSize: '11px', color: 'var(--accent-primary)', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px' }}
                    >
                      <Eye size={12} /> View Log
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right Column: Habit Tracker Matrix */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div className="card">
          <div className="card-header">
            <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Flame size={18} color="var(--accent-warning)" /> Habit Streak Tracker
            </h3>
            <button
              onClick={() => setShowHabitForm(!showHabitForm)}
              style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', padding: '4px 8px', borderRadius: 'var(--radius-sm)', fontSize: '11px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}
            >
              <Plus size={12} /> Add Habit
            </button>
          </div>

          {/* Progress Overview Bar */}
          <div style={{ marginBottom: '16px', padding: '12px', borderRadius: 'var(--radius-md)', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: '600', marginBottom: '6px' }}>
              <span>Today's Habits Completed</span>
              <span style={{ color: 'var(--accent-success)' }}>{completedHabitsCount} / {habits.length} ({habitCompletionRate}%)</span>
            </div>
            <div style={{ height: '6px', width: '100%', background: 'var(--bg-hover)', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${habitCompletionRate}%`, background: 'var(--accent-success)', borderRadius: '3px', transition: 'width 0.3s ease' }}></div>
            </div>
          </div>

          {/* Add Habit Inline Form */}
          {showHabitForm && (
            <form onSubmit={handleCreateHabit} style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
              <input
                type="text"
                placeholder="Habit name..."
                value={newHabitName}
                onChange={(e) => setNewHabitName(e.target.value)}
                required
                autoFocus
                style={{ flex: 1, padding: '8px 10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--accent-primary)', background: 'var(--bg-card)', color: 'var(--text-primary)', fontSize: '12px', outline: 'none' }}
              />
              <button type="submit" style={{ padding: '8px 12px', borderRadius: 'var(--radius-md)', background: 'var(--accent-primary)', color: 'white', border: 'none', fontWeight: '600', fontSize: '12px', cursor: 'pointer' }}>Save</button>
            </form>
          )}

          {/* Habit Items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {habits.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)', fontSize: '12px' }}>
                No habits configured yet.
              </div>
            ) : (
              habits.map((h) => (
                <div
                  key={h.id}
                  style={{
                    padding: '12px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                    background: h.is_completed_today ? 'rgba(16,185,129,0.08)' : 'var(--bg-card)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div style={{ flex: 1, marginRight: '10px' }}>
                    <div style={{ fontSize: '13px', fontWeight: '600', color: h.is_completed_today ? 'var(--accent-success)' : 'var(--text-primary)' }}>
                      {h.name}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--accent-warning)', fontWeight: '600', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Flame size={12} /> {h.streak_count || 0} Day Streak
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input
                      type="checkbox"
                      checked={!!h.is_completed_today}
                      onChange={() => onToggleHabit && onToggleHabit(h.id)}
                      style={{ accentColor: 'var(--accent-success)', width: '18px', height: '18px', cursor: 'pointer' }}
                    />
                    {onDeleteHabit && (
                      <button
                        onClick={() => onDeleteHabit(h.id)}
                        title="Delete habit"
                        style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '2px' }}
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Journal Entry History Pop-up Modal */}
      {viewingJournal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="card" style={{ width: '560px', background: 'var(--bg-surface)', padding: '24px', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px' }}>
              <div>
                <h3 style={{ fontWeight: '700', fontSize: '17px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Calendar size={18} color="var(--accent-primary)" /> Journal Log: {viewingJournal.entry_date}
                </h3>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  Mood Rating: <strong style={{ color: 'var(--accent-warning)' }}>{viewingJournal.mood_rating || 5}★ / 5★</strong>
                </div>
              </div>
              <button onClick={() => setViewingJournal(null)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '60vh', overflowY: 'auto' }}>
              <div>
                <h4 style={{ fontSize: '13px', fontWeight: '700', color: 'var(--accent-primary)', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Trophy size={14} /> Key Wins & Accomplishments
                </h4>
                <div style={{ background: 'var(--bg-card)', padding: '12px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', fontSize: '13.5px', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                  {viewingJournal.wins || <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>No wins recorded for this entry.</span>}
                </div>
              </div>

              <div>
                <h4 style={{ fontSize: '13px', fontWeight: '700', color: 'var(--accent-primary)', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <BookOpen size={14} /> Daily Reflections & Summary
                </h4>
                <div style={{ background: 'var(--bg-card)', padding: '12px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', fontSize: '13.5px', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                  {viewingJournal.reflections || <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>No reflection summary recorded.</span>}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', borderTop: '1px solid var(--border-subtle)', paddingTop: '14px' }}>
              <button
                type="button"
                onClick={() => {
                  setSelectedDate(viewingJournal.entry_date);
                  setViewingJournal(null);
                }}
                style={{ padding: '8px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--accent-primary)', background: 'rgba(99,102,241,0.1)', color: 'var(--accent-primary)', fontWeight: '600', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Edit3 size={13} /> Edit Entry in Form
              </button>

              <button
                type="button"
                onClick={() => setViewingJournal(null)}
                style={{ padding: '8px 16px', borderRadius: 'var(--radius-md)', background: 'var(--accent-primary)', color: 'white', border: 'none', fontWeight: '600', fontSize: '12px', cursor: 'pointer' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
