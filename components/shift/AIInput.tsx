'use client';

import { useState } from 'react';

interface Props {
  weekStart: string; // 'YYYY-MM-DD'
  onSlots: (slots: { day_index: number; slot_key: string }[], summary: string) => void;
  disabled?: boolean;
  noCoach?: boolean;
}

export default function AIInput({ weekStart, onSlots, disabled, noCoach }: Props) {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit() {
    if (!text.trim()) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/shift/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, week_start: weekStart }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      onSlots(data.slots ?? [], data.summary ?? '');
      setText('');
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'エラーが発生しました');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="px-4 pb-4">
      <p className="text-xs text-gray-400 mb-2">
        AI自然言語入力（例:「10日の18時から21時まで可能」）
      </p>
      <div className="flex gap-2">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="空き時間を日本語で入力..."
          rows={2}
          disabled={disabled || loading}
          className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 resize-none focus:outline-none focus:border-blue-500/50"
        />
        <button
          onClick={handleSubmit}
          disabled={disabled || loading || !text.trim()}
          style={{ backgroundColor: '#4d94ff' }}
          className="px-4 rounded-lg text-sm font-bold text-black disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
        >
          {loading ? '解析中...' : '送信'}
        </button>
      </div>
      {noCoach && (
        <p className="text-xs text-yellow-500/70 mt-1">
          講師を選択してから入力してください
        </p>
      )}
      {!noCoach && disabled && (
        <p className="text-xs text-yellow-500/70 mt-1">
          ANTHROPIC_API_KEY が未設定のため AI 解析は無効です
        </p>
      )}
      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
    </div>
  );
}
