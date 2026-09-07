'use client';

import { useEffect, useState, useCallback } from 'react';
import CoachChips from '@/components/shift/CoachChips';
import WeekGrid, { AvailabilityMap } from '@/components/shift/WeekGrid';
import AIInput from '@/components/shift/AIInput';
import StatsBar from '@/components/shift/StatsBar';

const LS_KEY = 'shift_availability_v1';

function getMondayOfCurrentWeek(): Date {
  const now = new Date();
  const day = now.getDay(); // 0=Sun
  const diff = day === 0 ? -6 : 1 - day;
  const monday = new Date(now);
  monday.setDate(now.getDate() + diff);
  monday.setHours(0, 0, 0, 0);
  return monday;
}

function toISO(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function buildAvailabilityMap(records: { coach_id: string; day_index: number; slot_key: string }[]): AvailabilityMap {
  const map: AvailabilityMap = {};
  for (const r of records) {
    const key = `${r.day_index}-${r.slot_key}`;
    if (!map[key]) map[key] = new Set();
    map[key].add(r.coach_id);
  }
  return map;
}

export default function ShiftPage() {
  const [weekStart] = useState<Date>(getMondayOfCurrentWeek);
  const weekStartStr = toISO(weekStart);
  const [selectedCoach, setSelectedCoach] = useState<string | null>(null);
  const [availability, setAvailability] = useState<AvailabilityMap>({});
  const [aiEnabled, setAiEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [aiSummary, setAiSummary] = useState('');

  // Check if AI is enabled (server tells us via /api/shift/parse test)
  useEffect(() => {
    fetch('/api/shift/parse', { method: 'GET' })
      .then((r) => r.json())
      .then((d) => setAiEnabled(!!d.enabled))
      .catch(() => setAiEnabled(false));
  }, []);

  // Load availability from API, fallback to localStorage
  const loadAvailability = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/shift/availability?week=${weekStartStr}`);
      const data = await res.json();
      if (data.records) {
        const map = buildAvailabilityMap(data.records);
        setAvailability(map);
        // sync to localStorage
        localStorage.setItem(LS_KEY + '_' + weekStartStr, JSON.stringify(data.records));
      } else {
        throw new Error('no records');
      }
    } catch {
      // fallback: localStorage
      try {
        const raw = localStorage.getItem(LS_KEY + '_' + weekStartStr);
        if (raw) {
          const records = JSON.parse(raw);
          setAvailability(buildAvailabilityMap(records));
        }
      } catch {}
    } finally {
      setLoading(false);
    }
  }, [weekStartStr]);

  useEffect(() => { loadAvailability(); }, [loadAvailability]);

  async function handleToggle(dayIndex: number, slotKey: string) {
    if (!selectedCoach) return;
    const cellKey = `${dayIndex}-${slotKey}`;
    const current = availability[cellKey] ?? new Set<string>();
    const hasIt = current.has(selectedCoach);

    // Optimistic update
    setAvailability((prev) => {
      const next = { ...prev };
      const s = new Set(next[cellKey] ?? []);
      if (hasIt) s.delete(selectedCoach);
      else s.add(selectedCoach);
      next[cellKey] = s;
      return next;
    });

    // Sync to API
    try {
      const body = { coach_id: selectedCoach, week_start: weekStartStr, day_index: dayIndex, slot_key: slotKey };
      if (hasIt) {
        await fetch('/api/shift/availability', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      } else {
        await fetch('/api/shift/availability', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      }
    } catch {
      // revert on error
      setAvailability((prev) => {
        const next = { ...prev };
        const s = new Set(next[cellKey] ?? []);
        if (hasIt) s.add(selectedCoach);
        else s.delete(selectedCoach);
        next[cellKey] = s;
        return next;
      });
    }
  }

  function handleAISlots(slots: { day_index: number; slot_key: string }[], summary: string) {
    if (!selectedCoach) return;
    setAiSummary(summary);
    slots.forEach(({ day_index, slot_key }) => {
      handleToggle(day_index, slot_key);
    });
  }

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + i);
    return d;
  });

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#080e1c', color: '#e2e8f0' }}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="px-4 pt-6 pb-2">
          <h1 className="text-lg font-bold" style={{ color: '#4d94ff' }}>面談スケジュール</h1>
          <p className="text-xs text-gray-400 mt-0.5">
            {`${days[0].getMonth() + 1}/${days[0].getDate()} 〜 ${days[6].getMonth() + 1}/${days[6].getDate()}`} 週
          </p>
        </div>

        {/* Coach chips */}
        <CoachChips selected={selectedCoach} onSelect={(id) => setSelectedCoach((prev) => prev === id ? null : id)} />

        {selectedCoach && (
          <p className="text-xs text-gray-400 px-4 mb-2">
            セルをタップして空き時間を登録 / 解除できます
          </p>
        )}

        {/* Grid */}
        {loading ? (
          <div className="text-center text-gray-500 py-10 text-sm">読み込み中...</div>
        ) : (
          <WeekGrid
            weekStart={weekStart}
            availability={availability}
            selectedCoach={selectedCoach}
            onToggle={handleToggle}
          />
        )}

        {/* Stats */}
        <StatsBar availability={availability} />

        {/* AI Input */}
        {selectedCoach && (
          <AIInput
            weekStart={weekStartStr}
            onSlots={handleAISlots}
            disabled={!aiEnabled}
          />
        )}
        {aiSummary && (
          <p className="px-4 pb-4 text-xs text-blue-400">AI解析: {aiSummary}</p>
        )}
      </div>
    </div>
  );
}
