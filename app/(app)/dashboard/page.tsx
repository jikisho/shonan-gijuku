import Link from "next/link";
import { courses } from "@/data/courses";
import { ArrowRight, CheckCircle2, BookOpen, Brain, Trophy } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { FadeIn, FadeInList } from "@/components/PageMotion";
import { getCompletedLessons } from "@/app/actions/progress";
import DashboardCourseList from "./DashboardCourseList";

export default async function DashboardPage() {
  const completed = await getCompletedLessons();
  const totalLessons = courses.reduce((s, c) => s + c.totalLessons, 0);
  const totalCompleted = completed.length;

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
          { label: "完了済み", value: totalCompleted, icon: CheckCircle2, color: "text-green-400" },
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

      <DashboardCourseList courses={courses} completed={completed} />

      {/* Analysis CTA */}
      <FadeIn delay={0.25} className="mb-3">
        <Link href="/analysis">
          <div className="rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-900/30 to-amber-800/10 p-6 cursor-pointer hover:-translate-y-0.5 transition-transform">
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
          </div>
        </Link>
      </FadeIn>

      {/* Samples CTA */}
      <FadeIn delay={0.3}>
        <Link href="/samples">
          <div className="rounded-2xl border border-yellow-500/20 bg-gradient-to-br from-yellow-900/30 to-yellow-800/10 p-6 cursor-pointer hover:-translate-y-0.5 transition-transform">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-yellow-500/15 flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-yellow-400" />
                </div>
                <div>
                  <h3 className="font-bold text-white">合格者資料</h3>
                  <p className="text-xs text-white/40 mt-0.5">
                    志望理由書・任意提出資料・自由記述｜合格者の実例を閲覧
                  </p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-yellow-400/60" />
            </div>
          </div>
        </Link>
      </FadeIn>
    </div>
  );
}
