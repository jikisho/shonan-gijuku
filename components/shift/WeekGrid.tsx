'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { COACHES } from './CoachChips';

export const SLOTS = [
  { key: 's08', label: '8:00' },
  { key: 's09', label: '9:00' },
  { key: 's10', label: '10:00' },
  { key: 's11', label: '11:00' },
  { key: 's12', label: '12:00' },
  { key: 's13', label: '13:00' },
  { key: 's14', label: '14:00' },
  { key: 's15', label: '15:00' },
  { key: 's16', label: '16:00' },
  { key: 's17', label: '17:00' },
  { key: 's18', label: '18:00' },
  { key: 's19', label: '19:00' },
  { key: 's20', label: '20:00' },
  { key: 's21', label: '21:00' },
  { key: 's22', label: '22:00' },
];

export type AvailabilityMap = {
  // key: `${day_index}-${slot_key}` -> Set of coach_ids
  [cellKey: string]: Set<string>;
};

interface Props {
  weekStart: Date;
  availability: AvailabilityMap;
  selectedCoach: string | null;
  onToggle: (dayIndex: number, slotKey: string) => void;
}

function getDayLabels(weekStart: Date): string[] {
  const days = ['月', '火', '水', '木', '金', '土', '日'];
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + i);
    return `${d.getMonth() + 1}/${d.getDate()}(${days[i]})`;
  });
}

export default function WeekGrid({ weekStart, availability, selectedCoach, onToggle }: Props) {
  const dayLabels = getDayLabels(weekStart);
  const coachMap = Object.fromEntries(COACHES.map((c) => [c.id, c]));

  return (
    <div className="overflow-x-auto px-2 pb-4">
      <table className="w-full border-collapse min-w-[600px]" style={{ tableLayout: 'fixed' }}>
        <thead>
          <tr>
            <th className="w-14 text-xs text-gray-500 font-normal pb-2"></th>
            {dayLabels.map((label, i) => (
              <th key={i} className="text-xs text-gray-400 font-medium pb-2 text-center">
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {SLOTS.map((slot) => (
            <tr key={slot.key}>
              <td className="text-xs text-gray-500 pr-2 text-right py-1 align-middle">
                {slot.label}
              </td>
              {Array.from({ length: 7 }, (_, dayIndex) => {
                const cellKey = `${dayIndex}-${slot.key}`;
                const coaches = availability[cellKey] ?? new Set<string>();
                const count = coaches.size;
                const isSelected = selectedCoach ? coaches.has(selectedCoach) : false;
                const heat = Math.min(count / 4, 1);

                return (
                  <td key={dayIndex} className="p-0.5">
                    <button
                      onClick={() => selectedCoach && onToggle(dayIndex, slot.key)}
                      disabled={!selectedCoach}
                      style={{
                        backgroundColor: `rgba(77,148,255,${heat * 0.3})`,
                        border: isSelected
                          ? `2px solid ${coachMap[selectedCoach!]?.color ?? '#4d94ff'}`
                          : '1px solid rgba(255,255,255,0.08)',
                      }}
                      className="w-full h-8 rounded-md relative flex flex-wrap items-center justify-center gap-0.5 transition-all hover:brightness-110 disabled:cursor-default"
                    >
                      {/* Avatar dots */}
                      <AnimatePresence>
                        {Array.from(coaches).map((cid) => {
                          const coach = coachMap[cid];
                          if (!coach) return null;
                          return (
                            <motion.span
                              key={cid}
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 0, opacity: 0 }}
                              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                              style={{ backgroundColor: coach.color }}
                              className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold text-black"
                              title={coach.name}
                            >
                              {coach.name[0]}
                            </motion.span>
                          );
                        })}
                      </AnimatePresence>
                      {/* Count badge */}
                      {count >= 2 && (
                        <span
                          className="absolute top-0.5 right-0.5 text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center"
                          style={{ backgroundColor: '#4d94ff', color: '#080e1c' }}
                        >
                          {count}
                        </span>
                      )}
                    </button>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
