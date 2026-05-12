"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { categories } from "@/data/analysis-questions";
import { Brain, CheckCircle2 } from "lucide-react";

function ViewContent() {
  const searchParams = useSearchParams();
  const raw = searchParams.get("d");

  let answers: Record<string, string> = {};
  let error = false;
  try {
    if (raw) answers = JSON.parse(decodeURIComponent(atob(raw)));
  } catch {
    error = true;
  }

  const totalAnswered = Object.values(answers).filter((v) => v.trim()).length;
  const totalQuestions = categories.reduce((s, c) => s + c.questions.length, 0);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[oklch(0.08_0.012_265)]">
        <p className="text-white/40 text-sm">リンクが無効です</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[oklch(0.08_0.012_265)] p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 flex items-center justify-center">
            <Brain className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "var(--font-serif)" }}>
              自己分析シート
            </h1>
            <p className="text-xs text-white/40">{totalAnswered}/{totalQuestions} 回答済み（読み取り専用）</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4 mb-8 h-1.5 bg-white/5 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full transition-all"
            style={{ width: `${(totalAnswered / totalQuestions) * 100}%` }}
          />
        </div>

        {/* Categories */}
        <div className="space-y-6">
          {categories.map((category) => {
            const categoryAnswers = category.questions.filter((q) => answers[q.id]?.trim());
            if (categoryAnswers.length === 0) return null;
            return (
              <div key={category.id} className="rounded-2xl border border-white/8 overflow-hidden bg-white/2">
                <div className="flex items-center gap-3 px-6 py-4 border-b border-white/5 bg-white/3">
                  <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-white/40">{category.number}</span>
                  </div>
                  <p className="font-semibold text-white text-sm">{category.title}</p>
                  <span className="ml-auto text-[10px] text-white/30">{categoryAnswers.length}/{category.questions.length}</span>
                </div>
                <div className="px-6 py-4 space-y-4">
                  {category.questions.map((question) => {
                    const answer = answers[question.id]?.trim();
                    if (!answer) return null;
                    return (
                      <div key={question.id} className="rounded-xl border border-white/8 overflow-hidden">
                        <div className="flex items-center gap-3 px-4 py-2.5 bg-white/4 border-b border-white/8">
                          <span className="text-[10px] font-mono font-bold text-amber-500/70 bg-amber-500/10 px-2 py-0.5 rounded shrink-0">
                            Q{question.number}
                          </span>
                          <p className="text-sm font-semibold text-white/80">{question.text}</p>
                          <CheckCircle2 className="w-3.5 h-3.5 text-green-400/70 ml-auto shrink-0" />
                        </div>
                        <div className="px-4 py-3">
                          <p className="text-sm text-white/70 leading-relaxed whitespace-pre-wrap">{answer}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <p className="text-center text-[10px] text-white/20 mt-10 pb-8">
          湘南義塾 SFC AO対策 — 自己分析シート（読み取り専用）
        </p>
      </div>
    </div>
  );
}

export default function ViewPage() {
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
