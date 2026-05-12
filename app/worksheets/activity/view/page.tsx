"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { BookOpen, Star } from "lucide-react";

function ViewContent() {
  const searchParams = useSearchParams();
  const raw = searchParams.get("d");

  let data: any = null;
  let error = false;
  try {
    if (raw) data = JSON.parse(decodeURIComponent(atob(raw)));
  } catch { error = true; }

  if (error || !data) return (
    <div className="min-h-screen flex items-center justify-center bg-[oklch(0.08_0.012_265)]">
      <p className="text-white/40 text-sm">リンクが無効です</p>
    </div>
  );

  const activities = (data.activities ?? []).filter((r: any) => r.content?.trim());
  const orgs = (data.orgs ?? []).filter((r: any) => r.name?.trim());
  const competitions = (data.competitions ?? []).filter((r: any) => r.name?.trim());

  const SectionHeader = ({ title }: { title: string }) => (
    <div className="px-5 py-3 border-b border-white/5 bg-white/3">
      <p className="text-xs font-semibold text-white/60">{title}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[oklch(0.08_0.012_265)] p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-green-500/15 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-green-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "var(--font-serif)" }}>活動報告書</h1>
            <p className="text-xs text-white/40">読み取り専用</p>
          </div>
        </div>

        <div className="space-y-5">
          {data.selfEval?.trim() && (
            <div className="rounded-2xl border border-white/8 overflow-hidden bg-white/2">
              <SectionHeader title="📝 活動報告 自己評価" />
              <p className="px-5 py-4 text-sm text-white/70 leading-relaxed whitespace-pre-wrap">{data.selfEval}</p>
            </div>
          )}

          {activities.length > 0 && (
            <div className="rounded-2xl border border-white/8 overflow-hidden bg-white/2">
              <SectionHeader title="📋 活動記録" />
              <div className="divide-y divide-white/5">
                {activities.map((row: any, i: number) => (
                  <div key={i} className="flex items-center gap-3 px-5 py-3">
                    <span className="text-[10px] text-white/30 font-mono shrink-0">{row.year}/{row.month}</span>
                    <p className="text-sm text-white/80 flex-1">{row.content}</p>
                    {row.featured && <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0" />}
                    {row.docNumber && <span className="text-[10px] text-white/30 shrink-0">資料{row.docNumber}</span>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {orgs.length > 0 && (
            <div className="rounded-2xl border border-white/8 overflow-hidden bg-white/2">
              <SectionHeader title="🏫 学校・団体等における活動歴" />
              <div className="divide-y divide-white/5">
                {orgs.map((row: any, i: number) => (
                  <div key={i} className="flex items-center gap-3 px-5 py-3">
                    <span className="text-[10px] text-white/30 shrink-0">{row.period}</span>
                    <p className="text-sm text-white/80 flex-1">{row.name}</p>
                    {row.role && <span className="text-[10px] text-white/40 shrink-0">{row.role}</span>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {competitions.length > 0 && (
            <div className="rounded-2xl border border-white/8 overflow-hidden bg-white/2">
              <SectionHeader title="🏆 競技・コンクール等" />
              <div className="divide-y divide-white/5">
                {competitions.map((row: any, i: number) => (
                  <div key={i} className="flex items-start gap-3 px-5 py-3">
                    <span className="text-[10px] text-white/30 font-mono shrink-0 mt-0.5">{row.year}</span>
                    <div className="flex-1">
                      <p className="text-sm text-white/80">{row.name}</p>
                      <p className="text-[11px] text-white/40 mt-0.5">{row.organizer}</p>
                    </div>
                    {row.result && <span className="text-[10px] text-green-400 shrink-0">{row.result}</span>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {data.groupRole?.trim() && (
            <div className="rounded-2xl border border-white/8 overflow-hidden bg-white/2">
              <SectionHeader title="👥 団体活動・役割と実績" />
              <p className="px-5 py-4 text-sm text-white/70 leading-relaxed">{data.groupRole}</p>
            </div>
          )}

          {data.other?.trim() && (
            <div className="rounded-2xl border border-white/8 overflow-hidden bg-white/2">
              <SectionHeader title="📎 その他" />
              <p className="px-5 py-4 text-sm text-white/70 leading-relaxed whitespace-pre-wrap">{data.other}</p>
            </div>
          )}
        </div>

        <p className="text-center text-[10px] text-white/20 mt-10 pb-8">
          湘南義塾 SFC AO対策 — 活動報告書（読み取り専用）
        </p>
      </div>
    </div>
  );
}

export default function ActivityWorksheetView() {
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
