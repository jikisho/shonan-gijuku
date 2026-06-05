"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { statementParagraphs, STATEMENT_WORKSHEET_KEY } from "@/data/worksheets";
import { Save, CheckCircle2, Share2, Link2, ChevronDown, ChevronUp } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface StatementAnswers {
  [key: string]: { title: string; notes: string };
}

export default function StatementWorksheet() {
  const [answers, setAnswers] = useState<StatementAnswers>({});
  const [openSections, setOpenSections] = useState<Record<number, boolean>>({});
  const [saved, setSaved] = useState(false);
  const [shareState, setShareState] = useState<"idle" | "copied">("idle");
  const autoSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFirstLoad = useRef(true);

  // 初回ロード：Supabase優先、fallback localStorage
  useEffect(() => {
    (async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data } = await supabase
            .from("statement_worksheets")
            .select("data")
            .eq("user_id", user.id)
            .single();
          if (data?.data && Object.keys(data.data).length > 0) {
            setAnswers(data.data as StatementAnswers);
            return;
          }
        }
      } catch {}
      // fallback: localStorage
      try {
        const stored = localStorage.getItem(STATEMENT_WORKSHEET_KEY);
        if (stored) setAnswers(JSON.parse(stored));
      } catch {}
    })();
  }, []);

  // 入力変更時：localStorageに即保存 + Supabaseへdebounce自動保存
  const update = (num: number, field: "title" | "notes", value: string) => {
    setAnswers((prev) => {
      const next = {
        ...prev,
        [num]: { ...prev[num], title: prev[num]?.title ?? "", notes: prev[num]?.notes ?? "", [field]: value },
      };
      // localStorageに即時保存
      try { localStorage.setItem(STATEMENT_WORKSHEET_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
    setSaved(false);

    // Supabaseへ3秒後に自動保存
    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    autoSaveTimer.current = setTimeout(() => {
      setAnswers((current) => {
        autoSaveToSupabase(current);
        return current;
      });
    }, 3000);
  };

  const autoSaveToSupabase = async (data: StatementAnswers) => {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from("statement_worksheets").upsert(
          { user_id: user.id, data, updated_at: new Date().toISOString() },
          { onConflict: "user_id" }
        );
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    } catch {}
  };

  const handleSave = async () => {
    // localStorage に保存
    localStorage.setItem(STATEMENT_WORKSHEET_KEY, JSON.stringify(answers));

    // Supabase にも保存（ログイン済みの場合）
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from("statement_worksheets")
          .upsert(
            { user_id: user.id, data: answers, updated_at: new Date().toISOString() },
            { onConflict: "user_id" }
          );
      }
    } catch {}

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

  const toggle = (num: number) => setOpenSections((p) => ({ ...p, [num]: !p[num] }));
  const answered = Object.values(answers).filter((a) => a.title?.trim() || a.notes?.trim()).length;

  return (
    <div className="space-y-3">
      {/* 進捗バー */}
      <div className="h-1 bg-white/5 rounded-full overflow-hidden mb-4">
        <motion.div
          className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full"
          animate={{ width: `${(answered / statementParagraphs.length) * 100}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* 保存・共有 */}
      <div className="flex gap-2 justify-end mb-2">
        <button onClick={handleShare} className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white/50 text-xs hover:bg-white/10 transition-colors">
          {shareState === "copied" ? <Link2 className="w-3.5 h-3.5 text-green-400" /> : <Share2 className="w-3.5 h-3.5" />}
          {shareState === "copied" ? "コピー済み" : "共有"}
        </button>
        <button onClick={handleSave} className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-blue-500/15 border border-blue-500/20 text-blue-400 text-xs hover:bg-blue-500/20 transition-colors">
          {saved ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
          {saved ? "保存済み" : "保存"}
        </button>
      </div>

      {/* 段落アコーディオン */}
      {statementParagraphs.map((para) => {
        const isOpen = openSections[para.number] ?? false;
        const ans = answers[para.number];
        const hasContent = ans?.title?.trim() || ans?.notes?.trim();
        const isOptional = para.number >= 9;

        return (
          <div key={para.number} className={`glass-card rounded-2xl overflow-hidden ${isOptional ? "opacity-60" : ""}`}>
            <button onClick={() => toggle(para.number)}
              className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/3 transition-colors">
              <div className="flex items-center gap-3 text-left">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${hasContent ? "bg-blue-500/20 text-blue-400" : "bg-white/5 text-white/30"}`}>
                  {para.number}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white/80">{para.label}</p>
                  <p className="text-[10px] text-white/35 mt-0.5">{para.role}</p>
                </div>
              </div>
              {isOpen ? <ChevronUp className="w-4 h-4 text-white/20 shrink-0" /> : <ChevronDown className="w-4 h-4 text-white/20 shrink-0" />}
            </button>

            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden border-t border-white/5 bg-white/1"
                >
                  <div className="px-5 pb-5 space-y-3">
                    <p className="text-[11px] text-white/30 leading-relaxed pt-4 italic">{para.description}</p>
                    <div className="rounded-xl border border-white/8 overflow-hidden">
                      <div className="px-4 py-2 bg-white/4 border-b border-white/8">
                        <p className="text-[10px] font-semibold text-white/40 uppercase tracking-wider">段落タイトル</p>
                      </div>
                      <input type="text" value={ans?.title ?? ""} onChange={(e) => update(para.number, "title", e.target.value)}
                        placeholder="この段落のテーマ・タイトルを一言で..."
                        className="w-full px-4 py-3 bg-transparent text-white/80 placeholder-white/15 text-sm focus:outline-none" />
                    </div>
                    <div className="rounded-xl border border-white/8 overflow-hidden">
                      <div className="px-4 py-2 bg-white/4 border-b border-white/8">
                        <p className="text-[10px] font-semibold text-white/40 uppercase tracking-wider">書きたいポイント（箇条書きOK）</p>
                      </div>
                      <textarea value={ans?.notes ?? ""} onChange={(e) => update(para.number, "notes", e.target.value)}
                        placeholder="・&#10;・&#10;・"
                        rows={5}
                        className="w-full px-4 py-3 bg-transparent text-white/80 placeholder-white/15 text-sm resize-none focus:outline-none leading-relaxed" />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}

      {/* 下部保存ボタン */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <button onClick={handleShare} className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white/60 text-sm font-medium hover:bg-white/10 transition-colors">
          <Share2 className="w-4 h-4" />
          アイデアを共有する
        </button>
        <button onClick={handleSave} className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-semibold shadow-lg shadow-blue-500/20 transition-shadow">
          {saved ? <><CheckCircle2 className="w-4 h-4" />保存しました</> : <><Save className="w-4 h-4" />保存する</>}
        </button>
      </div>
    </div>
  );
}
