'use client';

import { COACHES } from './CoachChips';
import { AvailabilityMap } from './WeekGrid';

interface Props {
  availability: AvailabilityMap;
}

export default function StatsBar({ availability }: Props) {
  const countMap: Record<string, number> = {};
  for (const coaches of Object.values(availability)) {
    for (const cid of coaches) {
      countMap[cid] = (countMap[cid] ?? 0) + 1;
    }
  }

  return (
    <div className="px-4 pb-4">
      <p className="text-xs text-gray-400 mb-2">今週の空きコマ数</p>
      <div className="flex flex-wrap gap-2">
        {COACHES.map((c) => {
          const count = countMap[c.id] ?? 0;
          return (
            <div
              key={c.id}
              className="flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-bold"
              style={{ backgroundColor: `${c.color}22`, border: `1px solid ${c.color}55` }}
            >
              <span style={{ color: c.color }}>{c.name}</span>
              <span
                className="rounded-full w-5 h-5 flex items-center justify-center text-[10px]"
                style={{ backgroundColor: c.color, color: '#080e1c' }}
              >
                {count}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
