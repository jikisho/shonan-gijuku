"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { statementParagraphs } from "@/data/worksheets";
import { PenLine } from "lucide-react";

function ViewContent() {
  const searchParams = useSearchParams();
  const raw = searchParams.get("d");

  let answers: Record<string, { title: string; notes: string }> = {};
  let error = false;
  try {
    if (raw) answers = JSON.parse(decodeURIComponent(atob(raw)));
  } catch { error = true; }

  const answered = Object.values(answers).filter((a) => a.title?.trim() || a.notes?.trim()).length;

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-[oklch(0.08_0.012_265)]">
      <p className="text-white/40 text-sm">リンクが無効です</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[oklch(0.08_0.012_265)] p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-blue-500/15 flex items-center justify-center">
            <PenLine className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "var(--font-serif)" }}>
              志望理由書 アイデア書き出し
            </h1>
            <p className="text-xs text-white/40">{answered} / {statementParagraphs.length} 段落記入済み（読み取り専用）</p>
          </div>
        </div>

        <div className="mt-4 mb-8 h-1.5 bg-white/5 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full" style={{ width: `${(answered / statementParagraphs.length) * 100}%` }} />
        </div>

        <div className="space-y-4">
          {statementParagraphs.map((para) => {
            const ans = answers[para.number];
            if (!ans?.title?.trim() && !ans?.notes?.trim()) return null;
            return (
              <div key={para.number} className="rounded-2xl border border-white/8 overflow-hidden bg-white/2">
                <div className="flex items-center gap-3 px-5 py-3 border-b border-white/5 bg-white/3">
                  <div className="w-7 h-7 rounded-lg bg-blue-500/20 flex items-center justify-center shrink-0 text-xs font-bold text-blue-400">
                    {para.number}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white/60">{para.label}</p>
                    <p className="text-[10px] text-white/30">{para.role}</p>
                  </div>
                </div>
                <div className="px-5 py-4 space-y-3">
                  {ans?.title?.trim() && (
                    <div>
                      <p className="text-[10px] text-white/30 uppercase tracking-wider mb-1">タイトル</p>
                      <p className="text-sm font-semibold text-white/90">{ans.title}</p>
                    </div>
                  )}
                  {ans?.notes?.trim() && (
                    <div>
                      <p className="text-[10px] text-white/30 uppercase tracking-wider mb-1">書きたいポイント</p>
                      <p className="text-sm text-white/70 leading-relaxed whitespace-pre-wrap">{ans.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <p className="text-center text-[10px] text-white/20 mt-10 pb-8">
          湘南義塾 SFC AO対策 — 志望理由書アイデア書き出し（読み取り専用）
        </p>
      </div>
    </div>
  );
}

export default function StatementWorksheetView() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[oklch(0.08_0.012_265)]">
        <p className="text-white/40 text-sm">読み込み中...</p>
      </div>
    }>
      <ViewContent />
    </Suspense>
  );
}
