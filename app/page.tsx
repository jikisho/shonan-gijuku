"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, GraduationCap, BookOpen, Brain, Award } from "lucide-react";

const features = [
  {
    icon: BookOpen,
    title: "32本の解説動画",
    description: "志望理由書16本・活動報告書10本・自由記述3本・任意提出資料3本の完全解説",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
  },
  {
    icon: Brain,
    title: "自己分析シート 全40問",
    description: "8カテゴリ・40問の深掘り問いで、すべての書類の土台となる自己分析を完成させる",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
  },
  {
    icon: Award,
    title: "合格者の本質構造",
    description: "合格者の志望理由書を分解して見えてくる「研究者の卵」としての論理構造を完全公開",
    color: "text-green-400",
    bg: "bg-green-500/10",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[oklch(0.07_0.01_265)] flex flex-col">
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 30%, oklch(0.15 0.04 265 / 0.4) 0%, transparent 60%)",
        }}
      />

      <header className="relative z-10 flex items-center justify-between px-8 py-6 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-white tracking-wide">湘南義塾</span>
        </div>
        <Link
          href="/login"
          className="px-5 py-2 text-sm font-medium rounded-lg border border-amber-500/40 text-amber-400 hover:bg-amber-500/10 transition-colors"
        >
          ログイン
        </Link>
      </header>

      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <p className="text-xs font-semibold tracking-[0.3em] text-amber-400/80 uppercase mb-6">
            慶應義塾大学 SFC AO入試
          </p>
          <h1
            className="text-5xl md:text-6xl font-bold text-white leading-tight mb-6"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            合格への
            <br />
            <span className="gold-text">最短ルート</span>
          </h1>
          <p className="text-lg text-white/50 max-w-xl mx-auto mb-10 leading-relaxed">
            志望理由書・活動報告書・自由記述・任意提出資料を、
            <br />
            このプラットフォーム一つで完全攻略する。
          </p>
          <Link href="/login">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold text-sm shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 transition-shadow"
            >
              学習を始める
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="grid md:grid-cols-3 gap-6 mt-24 max-w-4xl w-full"
        >
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
              className="glass-card rounded-2xl p-6 text-left"
            >
              <div className={`w-10 h-10 rounded-xl ${f.bg} flex items-center justify-center mb-4`}>
                <f.icon className={`w-5 h-5 ${f.color}`} />
              </div>
              <h3 className="font-semibold text-white mb-2">{f.title}</h3>
              <p className="text-sm text-white/40 leading-relaxed">{f.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </main>
    </div>
  );
}
