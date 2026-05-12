"use client";

import Link from "next/link";
import { ArrowLeft, PenLine, Download } from "lucide-react";
import dynamic from "next/dynamic";

const StatementWorksheet = dynamic(() => import("@/components/StatementWorksheet"), { ssr: false });

export default function StatementWorksheetPage() {
  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto">
      <Link
        href="/courses/statement"
        className="inline-flex items-center gap-1.5 text-xs text-white/40 hover:text-white/70 transition-colors mb-8"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        志望理由書コースに戻る
      </Link>

      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/15 flex items-center justify-center shrink-0">
            <PenLine className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "var(--font-serif)" }}>
              志望理由書 アイデア書き出し
            </h1>
            <p className="text-sm text-white/40">8段落構成テンプレート</p>
          </div>
        </div>
        <a
          href="/志望理由書アイデア書き出し.docx"
          download="志望理由書アイデア書き出し.docx"
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white/50 text-xs hover:bg-white/10 transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          Word DL
        </a>
      </div>

      <StatementWorksheet />
    </div>
  );
}
