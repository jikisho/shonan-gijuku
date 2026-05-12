"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { statementParagraphs, STATEMENT_WORKSHEET_KEY } from "@/data/worksheets";
import { Save, CheckCircle2, Share2, Link2, PenLine, Download, ChevronDown, ChevronUp } from "lucide-react";

interface StatementAnswers {
  [key: string]: { title: string; notes: string };
}

export default function StatementWorksheet() {
  const [answers, setAnswers] = useState<StatementAnswers>({});
  const [tabOpen, setTabOpen] = useState(false);
  const [openSections, setOpenSections] = useState<Record<number, boolean>>({});
  const [saved, setSaved] = useState(false);
  const [shareState, setShareState] = useState<"idle" | "copied">("idle");

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STATEMENT_WORKSHEET_KEY);
      if (stored) setAnswers(JSON.parse(stored));
    } catch {}
  }, []);

  const update = (num: number, field: "title" | "notes", value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [num]: { ...prev[num], title: prev[num]?.title ?? "", notes: prev[num]?.notes ?? "", [field]: value },
    }));
    setSaved(false);
  };

  const handleSave = () => {
    localStorage.setItem(STATEMENT_WORKSHEET_KEY, JSON.stringify(answers));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleShare = async () => {
    const encoded = btoa(encodeURIComponent(JSON.stringify(answers)));
    const url = `${window.location.origin}/worksheets/statement/view?d=${encoded}`;
    if (navigator.share) {
      await navigator.share({ title: "志望理由書 アイデア書き出し", url });
    } else {
      await navigator.clipboard.writeText(url);
      setShareState("copied");
      setTimeout(() => setShareState("idle"), 2500);
    }
  };

  const toggleSection = (num: number) => setOpenSections((p) => ({ ...p, [num]: !p[num] }));

  const answered = Object.values(answers).filter((a) => a.title?.trim() || a.notes?.trim()).length;

  return (
    <div className="mt-10 border-t border-white/5 pt-10">
      {/* フォーマット タブ（single accordion） */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <button
          onClick={() => setTabOpen((p) => !p)}
          className="w-full flex items-center justify-between px-6 py-5 hover:bg-white/3 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-500/15 flex items-center justify-center shrink-0">
              <PenLine className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-left">
              <p className="text-sm font-bold text-white">フォーマット</p>
              <p className="text-[11px] text-white/30 mt-0.5">アイデア書き出し — {answered} / {statementParagraphs.length} 段落記入済み</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/志望理由書アイデア書き出し.docx"
              download="志望理由書アイデア書き出し.docx"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/40 text-[10px] hover:bg-white/10 transition-colors"
            >
              <Download className="w-3 h-3" />
              Word
            </a>
            {tabOpen ? <ChevronUp className="w-4 h-4 text-white/30" /> : <ChevronDown className="w-4 h-4 text-white/30" />}
          </div>
        </button>

        <AnimatePresence>
          {tabOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="border-t border-white/5">
                {/* Progress bar */}
                <div className="px-5 pt-4 pb-2">
                  <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full"
                      animate={{ width: `${(answered / statementParagraphs.length) * 100}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>

                {/* 保存・共有ボタン */}
                <div className="flex justify-end gap-2 px-5 py-3 border-b border-white/5 bg-white/2">
                  <button onClick={handleShare} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/50 text-xs hover:bg-white/10 transition-colors">
                    {shareState === "copied" ? <Link2 className="w-3.5 h-3.5 text-green-400" /> : <Share2 className="w-3.5 h-3.5" />}
                    {shareState === "copied" ? "コピー済み" : "共有"}
                  </button>
                  <button onClick={handleSave} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/15 border border-blue-500/20 text-blue-400 text-xs hover:bg-blue-500/20 transition-colors">
                    {saved ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
                    {saved ? "保存済み" : "保存"}
                  </button>
                </div>

                {/* 段落アコーディオン */}
                <div className="divide-y divide-white/5">
                  {statementParagraphs.map((para) => {
                    const isOpen = openSections[para.number] ?? false;
                    const ans = answers[para.number];
                    const hasContent = ans?.title?.trim() || ans?.notes?.trim();
                    const isOptional = para.number >= 9;

                    return (
                      <div key={para.number} className={isOptional ? "opacity-60" : ""}>
                        <button
                          onClick={() => toggleSection(para.number)}
                          className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-white/3 transition-colors"
                        >
                          <div className="flex items-center gap-3 text-left">
                            <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${hasContent ? "bg-blue-500/20 text-blue-400" : "bg-white/5 text-white/30"}`}>
                              {para.number}
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-white/70">{para.label}</p>
                              <p className="text-[10px] text-white/30 mt-0.5">{para.role}</p>
                            </div>
                          </div>
                          {isOpen
                            ? <ChevronUp className="w-3.5 h-3.5 text-white/20 shrink-0" />
                            : <ChevronDown className="w-3.5 h-3.5 text-white/20 shrink-0" />}
                        </button>

                        <AnimatePresence>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden border-t border-white/5 bg-white/1"
                            >
                              <div className="px-5 pb-5 space-y-3">
                                <p className="text-[11px] text-white/30 leading-relaxed pt-4 italic">{para.description}</p>

                                <div className="rounded-xl border border-white/8 overflow-hidden">
                                  <div className="px-4 py-2 bg-white/4 border-b border-white/8">
                                    <p className="text-[10px] font-semibold text-white/40 uppercase tracking-wider">段落タイトル</p>
                                  </div>
                                  <input
                                    type="text"
                                    value={ans?.title ?? ""}
                                    onChange={(e) => update(para.number, "title", e.target.value)}
                                    placeholder="この段落のテーマ・タイトルを一言で..."
                                    className="w-full px-4 py-3 bg-transparent text-white/80 placeholder-white/15 text-sm focus:outline-none"
                                  />
                                </div>

                                <div className="rounded-xl border border-white/8 overflow-hidden">
                                  <div className="px-4 py-2 bg-white/4 border-b border-white/8">
                                    <p className="text-[10px] font-semibold text-white/40 uppercase tracking-wider">書きたいポイント（箇条書きOK）</p>
                                  </div>
                                  <textarea
                                    value={ans?.notes ?? ""}
                                    onChange={(e) => update(para.number, "notes", e.target.value)}
                                    placeholder="・&#10;・&#10;・"
                                    rows={5}
                                    className="w-full px-4 py-3 bg-transparent text-white/80 placeholder-white/15 text-sm resize-none focus:outline-none leading-relaxed"
                                  />
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
