'use client';

import { useState } from 'react';
import { COACHES } from './CoachChips';
import { SLOTS } from './WeekGrid';

export interface ConfirmedSession {
  id: string;
  coach_id: string;
  student_name: string;
  session_date: string;
  slot_key: string;
}

interface Props {
  onAdd: (session: ConfirmedSession) => void;
  sessions: ConfirmedSession[];
  onDelete: (id: string) => void;
}

export default function ConfirmedForm({ onAdd, sessions, onDelete }: Props) {
  const [open, setOpen] = useState(false);
  const [coachId, setCoachId] = useState(COACHES[0].id);
  const [studentName, setStudentName] = useState('');
  const [date, setDate] = useState('');
  const [slotKey, setSlotKey] = useState(SLOTS[0].key);
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!studentName.trim() || !date) return;
    setLoading(true);
    try {
      const res = await fetch('/api/shift/confirmed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ coach_id: coachId, student_name: studentName.trim(), session_date: date, slot_key: slotKey }),
      });
      const data = await res.json();
      if (data.ok && data.record) {
        onAdd(data.record);
        setStudentName('');
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    await fetch('/api/shift/confirmed', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    onDelete(id);
  }

  const coachMap = Object.fromEntries(COACHES.map((c) => [c.id, c]));
  const slotMap = Object.fromEntries(SLOTS.map((s) => [s.key, s.label]));

  return (
    <div className="px-4 pb-4">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 text-sm font-bold mb-2"
        style={{ color: '#fbbf24' }}
      >
        <span style={{
          display: 'inline-block',
          width: 10, height: 10,
          borderRadius: '50%',
          backgroundColor: '#fbbf24',
          boxShadow: '0 0 6px 2px #fbbf24',
          animation: 'pulse 1.5s infinite',
        }} />
        面談確定登録 {open ? '▲' : '▼'}
      </button>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; box-shadow: 0 0 6px 2px #fbbf24; }
          50% { opacity: 0.4; box-shadow: 0 0 2px 1px #fbbf24; }
        }
      `}</style>

      {open && (
        <div className="rounded-xl p-3 mb-3 space-y-2" style={{ backgroundColor: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.3)' }}>
          <div className="flex flex-wrap gap-2">
            {/* Coach */}
            <select
              value={coachId}
              onChange={(e) => setCoachId(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-sm text-white"
            >
              {COACHES.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>

            {/* Date */}
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-sm text-white"
            />

            {/* Slot */}
            <select
              value={slotKey}
              onChange={(e) => setSlotKey(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-sm text-white"
            >
              {SLOTS.map((s) => (
                <option key={s.key} value={s.key}>{s.label}</option>
              ))}
            </select>

            {/* Student */}
            <input
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder="生徒名"
              className="bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-sm text-white placeholder-gray-500 w-28"
            />

            <button
              onClick={handleSubmit}
              disabled={loading || !studentName.trim() || !date}
              className="px-3 py-1 rounded-lg text-sm font-bold disabled:opacity-40"
              style={{ backgroundColor: '#fbbf24', color: '#080e1c' }}
            >
              {loading ? '登録中...' : '確定登録'}
            </button>
          </div>

          {/* List */}
          {sessions.length > 0 && (
            <div className="space-y-1 mt-2">
              {sessions.map((s) => {
                const coach = coachMap[s.coach_id];
                return (
                  <div key={s.id} className="flex items-center justify-between text-xs text-gray-300">
                    <span>
                      <span style={{ color: coach?.color ?? '#fff' }}>{coach?.name ?? s.coach_id}</span>
                      {' × '}{s.student_name}
                      {'　'}{s.session_date}{'　'}{slotMap[s.slot_key] ?? s.slot_key}
                    </span>
                    <button onClick={() => handleDelete(s.id)} className="text-gray-500 hover:text-red-400 ml-3">✕</button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
