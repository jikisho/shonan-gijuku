'use client';

import { useEffect, useState, useCallback } from 'react';
import CoachChips from '@/components/shift/CoachChips';
import WeekGrid, { AvailabilityMap } from '@/components/shift/WeekGrid';
import AIInput from '@/components/shift/AIInput';
import StatsBar from '@/components/shift/StatsBar';
import ConfirmedForm, { ConfirmedSession } from '@/components/shift/ConfirmedForm';

function getMondayOfCurrentWeek(): Date {
  const now = new Date();
  const day = now.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  const monday = new Date(now);
  monday.setDate(now.getDate() + diff);
  monday.setHours(0, 0, 0, 0);
  return monday;
}

function addDays(d: Date, n: number): Date {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
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

function mergeAvailability(a: AvailabilityMap, b: AvailabilityMap): AvailabilityMap {
  const result: AvailabilityMap = {};
  for (const [k, v] of Object.entries(a)) result[k] = new Set(v);
  for (const [k, v] of Object.entries(b)) {
    if (!result[k]) result[k] = new Set();
    v.forEach((id) => result[k].add(id));
  }
  return result;
}

export default function ShiftPage() {
  const [week1Start] = useState<Date>(getMondayOfCurrentWeek);
  const week2Start = addDays(week1Start, 7);
  const week1Str = toISO(week1Start);
  const week2Str = toISO(week2Start);
  const week2EndStr = toISO(addDays(week2Start, 6));

  const [selectedCoach, setSelectedCoach] = useState<string | null>(null);
  const [availability1, setAvailability1] = useState<AvailabilityMap>({});
  const [availability2, setAvailability2] = useState<AvailabilityMap>({});
  const [confirmedSessions, setConfirmedSessions] = useState<ConfirmedSession[]>([]);
  const [aiEnabled, setAiEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [aiSummary, setAiSummary] = useState('');

  useEffect(() => {
    fetch('/api/shift/parse', { method: 'GET' })
      .then((r) => r.json())
      .then((d) => setAiEnabled(!!d.enabled))
      .catch(() => setAiEnabled(false));
  }, []);

  const loadAvailability = useCallback(async () => {
    setLoading(true);
    try {
      const [r1, r2, rc] = await Promise.all([
        fetch(`/api/shift/availability?week=${week1Str}`).then((r) => r.json()),
        fetch(`/api/shift/availability?week=${week2Str}`).then((r) => r.json()),
        fetch(`/api/shift/confirmed?from=${week1Str}&to=${week2EndStr}`).then((r) => r.json()),
      ]);
      setAvailability1(r1.records ? buildAvailabilityMap(r1.records) : {});
      setAvailability2(r2.records ? buildAvailabilityMap(r2.records) : {});
      setConfirmedSessions(rc.records ?? []);
    } catch {
      setAvailability1({});
      setAvailability2({});
    } finally {
      setLoading(false);
    }
  }, [week1Str, week2Str, week2EndStr]);

  useEffect(() => { loadAvailability(); }, [loadAvailability]);

  async function handleToggle(weekStr: string, setAvail: React.Dispatch<React.SetStateAction<AvailabilityMap>>, dayIndex: number, slotKey: string) {
    if (!selectedCoach) return;
    const cellKey = `${dayIndex}-${slotKey}`;
    let hasIt = false;
    setAvail((prev) => {
      const current = prev[cellKey] ?? new Set<string>();
      hasIt = current.has(selectedCoach);
      const next = { ...prev };
      const s = new Set(next[cellKey] ?? []);
      if (hasIt) s.delete(selectedCoach);
      else s.add(selectedCoach);
      next[cellKey] = s;
      return next;
    });

    try {
      const body = { coach_id: selectedCoach, week_start: weekStr, day_index: dayIndex, slot_key: slotKey };
      if (hasIt) {
        await fetch('/api/shift/availability', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      } else {
        await fetch('/api/shift/availability', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      }
    } catch {
      setAvail((prev) => {
        const next = { ...prev };
        const s = new Set(next[cellKey] ?? []);
        if (hasIt) s.add(selectedCoach!);
        else s.delete(selectedCoach!);
        next[cellKey] = s;
        return next;
      });
    }
  }

  function handleAISlots(slots: { day_index: number; slot_key: string }[], summary: string) {
    if (!selectedCoach) return;
    setAiSummary(summary);
    slots.forEach(({ day_index, slot_key }) => {
      handleToggle(week1Str, setAvailability1, day_index, slot_key);
    });
  }

  const combinedAvailability = mergeAvailability(availability1, availability2);

  const days1 = Array.from({ length: 7 }, (_, i) => addDays(week1Start, i));
  const days2 = Array.from({ length: 7 }, (_, i) => addDays(week2Start, i));
  const fmt = (d: Date) => `${d.getMonth() + 1}/${d.getDate()}`;

  // Split confirmed sessions by week
  const confirmed1 = confirmedSessions.filter((s) => s.session_date >= week1Str && s.session_date <= toISO(addDays(week1Start, 6)));
  const confirmed2 = confirmedSessions.filter((s) => s.session_date >= week2Str && s.session_date <= week2EndStr);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#080e1c', color: '#e2e8f0' }}>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="px-4 pt-6 pb-2">
          <h1 className="text-lg font-bold" style={{ color: '#4d94ff' }}>面談スケジュール</h1>
          <p className="text-xs text-gray-400 mt-0.5">
            {fmt(days1[0])} 〜 {fmt(days2[6])}（2週間）
          </p>
        </div>

        {/* Coach chips */}
        <CoachChips selected={selectedCoach} onSelect={(id) => setSelectedCoach((prev) => prev === id ? null : id)} />

        {selectedCoach && (
          <p className="text-xs text-gray-400 px-4 mb-2">
            セルをタップして空き時間を登録 / 解除できます
          </p>
        )}

        {/* Confirmed session form */}
        <ConfirmedForm
          sessions={confirmedSessions}
          onAdd={(s) => setConfirmedSessions((prev) => [...prev, s])}
          onDelete={(id) => setConfirmedSessions((prev) => prev.filter((s) => s.id !== id))}
        />

        {loading ? (
          <div className="text-center text-gray-500 py-10 text-sm">読み込み中...</div>
        ) : (
          <>
            {/* Week 1 */}
            <div className="px-4 pt-2 pb-1">
              <p className="text-xs font-semibold text-gray-300">第1週：{fmt(days1[0])}（月）〜 {fmt(days1[6])}（日）</p>
            </div>
            <WeekGrid
              weekStart={week1Start}
              availability={availability1}
              selectedCoach={selectedCoach}
              onToggle={(d, s) => handleToggle(week1Str, setAvailability1, d, s)}
              confirmedSessions={confirmed1}
            />

            {/* Week 2 */}
            <div className="px-4 pt-3 pb-1">
              <p className="text-xs font-semibold text-gray-300">第2週：{fmt(days2[0])}（月）〜 {fmt(days2[6])}（日）</p>
            </div>
            <WeekGrid
              weekStart={week2Start}
              availability={availability2}
              selectedCoach={selectedCoach}
              onToggle={(d, s) => handleToggle(week2Str, setAvailability2, d, s)}
              confirmedSessions={confirmed2}
            />
          </>
        )}

        {/* Stats */}
        <StatsBar availability={combinedAvailability} />

        {/* AI Input */}
        <AIInput
          weekStart={week1Str}
          onSlots={handleAISlots}
          disabled={!aiEnabled || !selectedCoach}
          noCoach={!selectedCoach}
        />
        {aiSummary && (
          <p className="px-4 pb-4 text-xs text-blue-400">AI解析: {aiSummary}</p>
        )}
      </div>
    </div>
  );
}
