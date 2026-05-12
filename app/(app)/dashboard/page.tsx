"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { courses } from "@/data/courses";
import { ArrowRight, CheckCircle2, BookOpen, Brain } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { FadeIn, FadeInList } from "@/components/PageMotion";

const phaseColors: Record<string, string> = {
  statement: "from-blue-900/40 to-blue-800/20 border-blue-500/20",
  activity: "from-green-900/40 to-green-800/20 border-green-500/20",
  "free-writing": "from-orange-900/40 to-orange-800/20 border-orange-500/20",
  optional: "from-purple-900/40 to-purple-800/20 border-purple-500/20",
};

const accentBg: Record<string, string> = {
  statement: "bg-blue-500/10",
  activity: "bg-green-500/10",
  "free-writing": "bg-orange-500/10",
  optional: "bg-purple-500/10",
};

export default function DashboardPage() {
  const totalLessons = courses.reduce((s, c) => s + c.totalLessons, 0);

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto">
      {/* Header */}
      <FadeIn className="mb-8 md:mb-10">
        <p className="text-xs tracking-[0.25em] text-amber-400/60 uppercase mb-2">
          SFC AO入試 完全攻略
        </p>
        <h1
          className="text-2xl md:text-3xl font-bold text-white"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          ダッシュボード
        </h1>
        <p className="text-sm text-white/40 mt-1">
          全{totalLessons}レッスン＋自己分析シート（40問）
        </p>
      </FadeIn>

      {/* Stats */}
      <FadeIn delay={0.1} className="grid grid-cols-3 gap-2 md:gap-4 mb-8 md:mb-10">

        {[
          { label: "総レッスン数", value: totalLessons, icon: BookOpen, color: "text-blue-400" },
          { label: "コース数", value: courses.length, icon: CheckCircle2, color: "text-green-400" },
          { label: "自己分析 問数", value: 40, icon: Brain, color: "text-amber-400" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="glass-card rounded-xl p-3 md:p-5 flex flex-col md:flex-row items-center md:items-center gap-2 md:gap-4"
          >
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
              <stat.icon className={`w-4 h-4 md:w-5 md:h-5 ${stat.color}`} />
            </div>
            <div className="text-center md:text-left">
              <p className="text-xl md:text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-[10px] md:text-xs text-white/40">{stat.label}</p>
            </div>
          </div>
        ))}
      </FadeIn>

      {/* Courses */}
      <FadeIn delay={0.15} className="mb-3">
        <h2 className="text-sm font-semibold text-white/60 uppercase tracking-widest">
          コース一覧
        </h2>
      </FadeIn>

      <div className="grid md:grid-cols-2 gap-3 md:gap-4 mb-8 md:mb-10">
        {courses.map((course, i) => (
          <FadeInList key={course.id} index={i}>
            <Link href={`/courses/${course.id}`}>
              <motion.div
                whileHover={{ y: -2, scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className={`rounded-2xl border p-6 bg-gradient-to-br ${phaseColors[course.id]} cursor-pointer transition-all`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <span className="text-2xl">{course.icon}</span>
                    <h3 className="text-base font-bold text-white mt-2">{course.title}</h3>
                    <p className="text-xs text-white/40 mt-1">{course.totalLessons} レッスン</p>
                  </div>
                  <div className={`w-8 h-8 rounded-lg ${accentBg[course.id]} flex items-center justify-center`}>
                    <ArrowRight className="w-4 h-4 text-white/60" />
                  </div>
                </div>
                <p className="text-xs text-white/40 leading-relaxed line-clamp-2 mb-4">
                  {course.description}
                </p>
                <Progress value={0} className="h-1 bg-white/10" />
                <p className="text-[10px] text-white/20 mt-1">0 / {course.totalLessons} 完了</p>
              </motion.div>
            </Link>
          </FadeInList>
        ))}
      </div>

      {/* Analysis CTA */}
      <FadeIn delay={0.25}>
        <Link href="/analysis">
          <motion.div
            whileHover={{ y: -2, scale: 1.005 }}
            className="rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-900/30 to-amber-800/10 p-6 cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-500/15 flex items-center justify-center">
                  <Brain className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <h3 className="font-bold text-white">自己分析シート（全40問）</h3>
                  <p className="text-xs text-white/40 mt-0.5">
                    8カテゴリ・40問｜すべての書類の土台となる最重要ステップ
                  </p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-amber-400/60" />
            </div>
          </motion.div>
        </Link>
      </FadeIn>
    </div>
  );
}
