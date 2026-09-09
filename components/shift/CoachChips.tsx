'use client';

export const COACHES = [
  { id: 'yamada',   name: '山田', color: '#f43f5e' },
  { id: 'nakamura', name: '中村', color: '#fb923c' },
  { id: 'tosho',    name: '外所', color: '#facc15' },
  { id: 'matsumoto',name: '松本', color: '#4ade80' },
  { id: 'shinobe',  name: '篠部', color: '#22d3ee' },
  { id: 'fujiwara', name: '藤原', color: '#818cf8' },
  { id: 'tasaka',   name: '田坂', color: '#c084fc' },
  { id: 'domon',    name: '土門', color: '#f472b6' },
  { id: 'enami',    name: '榎並', color: '#34d399' },
  { id: 'takeda',   name: '竹田', color: '#fbbf24' },
];

interface Props {
  selected: string | null;
  onSelect: (id: string) => void;
}

export default function CoachChips({ selected, onSelect }: Props) {
  return (
    <div className="flex flex-wrap gap-2 p-4">
      <span className="text-sm text-gray-400 self-center mr-1">講師：</span>
      {COACHES.map((c) => {
        const active = selected === c.id;
        return (
          <button
            key={c.id}
            onClick={() => onSelect(c.id)}
            style={{
              borderColor: c.color,
              backgroundColor: active ? c.color : 'transparent',
              color: active ? '#080e1c' : c.color,
            }}
            className="px-3 py-1 rounded-full border text-sm font-bold transition-all"
          >
            {c.name}
          </button>
        );
      })}
    </div>
  );
}
