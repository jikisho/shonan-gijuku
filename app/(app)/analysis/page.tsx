"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import { categories } from "@/data/analysis-questions";
import { Brain, ChevronDown, ChevronUp, Save, CheckCircle2, Share2, Link2 } from "lucide-react";
import { FadeIn, FadeInList } from "@/components/PageMotion";
import {
  getAnalysisAnswers,
  saveAnalysisAnswer,
  migrateAnalysisFromLocalStorage,
} from "@/app/actions/analysis";

const STORAGE_KEY = "shonan_juku_analysis";
const MIGRATION_FLAG = "shonan_juku_analysis_migrated";

export default function AnalysisPage() {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({
    cat1: true,
  });
  const [saved, setSaved] = useState(false);
  const [shareState, setShareState] = useState<"idle" | "copied">("idle");
  const [isLoading, setIsLoading] = useState(true);

  // 初回マウント: マイグレーション → DB読み込み
  useEffect(() => {
    const init = async () => {
      // localStorageのマイグレーション（1回だけ）
      if (!localStorage.getItem(MIGRATION_FLAG)) {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          try {
            const localAnswers = JSON.parse(stored) as Record<string, string>;
            await migrateAnalysisFromLocalStorage(localAnswers);
          } catch {}
        }
        localStorage.setItem(MIGRATION_FLAG, "1");
      }

      // DBから回答を取得
      const dbAnswers = await getAnalysisAnswers();
      setAnswers(dbAnswers);
      setIsLoading(false);
    };

    init();
  }, []);

  const handleAnswer = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
    setSaved(false);
  };

  const handleSave = useCallback(async () => {
    // 全回答をまとめてupsert（migrateAnalysisFromLocalStorageを流用）
    await migrateAnalysisFromLocalStorage(answers);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }, [answers]);

  const handleShare = async () => {
    const encoded = btoa(encodeURIComponent(JSON.stringify(answers)));
    const url = `${window.location.origin}/analysis/view?d=${encoded}`;
    if (navigator.share) {
      await navigator.share({ title: "自己分析シート", url });
    } else {
      await navigator.clipboard.writeText(url);
      setShareState("copied");
      setTimeout(() => setShareState("idle"), 2500);
    }
  };

  const toggleCategory = (catId: string) => {
    setOpenCategories((prev) => ({ ...prev, [catId]: !prev[catId] }));
  };

  const totalAnswered = Object.values(answers).filter((v) => v.trim()).length;
  const totalQuestions = categories.reduce((s, c) => s + c.questions.length, 0);

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto">
      {/* Header */}
      <FadeIn className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 flex items-center justify-center">
              <Brain className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h1
                className="text-2xl font-bold text-white"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                自己分析シート
              </h1>
              <p className="text-xs text-white/40">
                {isLoading ? "読み込み中..." : `全40問｜${totalAnswered}/${totalQuestions} 回答済み`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/60 text-sm font-medium hover:bg-white/10 transition-colors"
            >
              {shareState === "copied" ? (
                <>
                  <Link2 className="w-4 h-4 text-green-400" />
                  <span className="text-green-400 hidden sm:inline">コピー済み</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4" />
                  <span className="hidden sm:inline">共有</span>
                </>
              )}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleSave}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500/15 border border-amber-500/20 text-amber-400 text-sm font-medium hover:bg-amber-500/20 transition-colors disabled:opacity-50"
            >
              {saved ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                  <span className="text-green-400 hidden sm:inline">保存済み</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span className="hidden sm:inline">保存</span>
                </>
              )}
            </motion.button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-5 h-1.5 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(totalAnswered / totalQuestions) * 100}%` }}
            transition={{ duration: 0.6 }}
          />
        </div>
        <p className="text-[10px] text-white/20 mt-1">
          {Math.round((totalAnswered / totalQuestions) * 100)}% 完了
        </p>
      </FadeIn>

      {/* Intro callout */}
      <FadeIn delay={0.1} className="rounded-xl border border-amber-500/15 bg-amber-500/5 p-4 mb-8">
        <p className="text-sm text-amber-400/80 font-medium mb-1">🎯 このシートの目的</p>
        <p className="text-xs text-white/40 leading-relaxed">
          このシートは、SFC AO入試を突破するための戦略的な思考ツールです。
          8カテゴリ・40問の問いに答えることで、志望理由書の「学問的必然性」という骨格が完成します。
          一つひとつの問いに時間をかけて真剣に向き合い、思考の汗を流してください。
        </p>
      </FadeIn>

      {/* Categories */}
      <div className="space-y-4">
        {categories.map((category, ci) => {
          const categoryAnswered = category.questions.filter(
            (q) => answers[q.id]?.trim()
          ).length;
          const isOpen = openCategories[category.id] ?? false;

          return (
            <FadeInList key={category.id} index={ci} className="glass-card rounded-2xl overflow-hidden">
              <button
                onClick={() => toggleCategory(category.id)}
                className="w-full flex items-center justify-between px-6 py-5 hover:bg-white/3 transition-colors"
              >
                <div className="flex items-center gap-3 text-left">
                  <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-white/40">{category.number}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-white text-sm">{category.title}</p>
                    <p className="text-[10px] text-white/30 mt-0.5">
                      {categoryAnswered}/{category.questions.length} 回答済み
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-16 h-1 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-500/60 rounded-full transition-all duration-500"
                      style={{ width: `${(categoryAnswered / category.questions.length) * 100}%` }}
                    />
                  </div>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-white/30" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-white/30" />
                  )}
                </div>
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 border-t border-white/5">
                      <p className="text-xs text-white/30 leading-relaxed pt-4 pb-5 italic">
                        {category.description}
                      </p>
                      <div className="space-y-4">
                        {category.questions.map((question) => (
                          <div key={question.id} className="rounded-xl border border-white/8 overflow-hidden">
                            <div className="flex items-center gap-3 px-4 py-2.5 bg-white/4 border-b border-white/8">
                              <span className="text-[10px] font-mono font-bold text-amber-500/70 bg-amber-500/10 px-2 py-0.5 rounded shrink-0">
                                Q{question.number}
                              </span>
                              <p className="text-sm font-semibold text-white/80">
                                {question.text}
                              </p>
                            </div>
                            <div className="px-4 py-3 border-b border-white/5 bg-white/2">
                              <p className="text-xs text-white/45 leading-relaxed">
                                {question.placeholder}
                              </p>
                            </div>
                            <textarea
                              value={answers[question.id] ?? ""}
                              onChange={(e) => handleAnswer(question.id, e.target.value)}
                              onBlur={(e) => {
                                // フォーカスが外れたタイミングで個別保存
                                const val = e.target.value;
                                saveAnalysisAnswer(question.id, val).catch(() => {});
                              }}
                              placeholder="ここに回答を入力してください..."
                              rows={4}
                              className="w-full px-4 py-3 bg-transparent text-white/80 placeholder-white/15 text-sm resize-none focus:outline-none transition-colors leading-relaxed"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </FadeInList>
          );
        })}
      </div>

      {/* Bottom buttons */}
      <FadeIn delay={0.3} className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
        <button
          onClick={handleShare}
          className="flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-white/5 border border-white/10 text-white/70 font-semibold text-sm hover:bg-white/10 transition-colors"
        >
          <Share2 className="w-4 h-4" />
          回答を共有する
        </button>
        <button
          onClick={handleSave}
          disabled={isLoading}
          className="flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold text-sm shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 transition-shadow disabled:opacity-50"
        >
          {saved ? (
            <><CheckCircle2 className="w-4 h-4" />保存しました</>
          ) : (
            <><Save className="w-4 h-4" />回答を保存する</>
          )}
        </button>
      </FadeIn>
    </div>
  );
}
