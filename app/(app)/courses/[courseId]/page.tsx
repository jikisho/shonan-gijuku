"use client";

import { notFound } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { use, useState, useEffect } from "react";
import { getCourse } from "@/data/courses";
import { ArrowLeft, Play, CheckCircle2, BookOpen, PenLine, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { FadeIn, FadeInList } from "@/components/PageMotion";
import { getCompletedLessons } from "@/app/actions/progress";

const phaseColorMap: Record<string, string> = {
  phase1: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  phase2: "text-green-400 bg-green-500/10 border-green-500/20",
  phase3: "text-orange-400 bg-orange-500/10 border-orange-500/20",
};

export default function CoursePage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = use(params);
  const course = getCourse(courseId);
  if (!course) notFound();

  const [completed, setCompleted] = useState<string[]>([]);
  useEffect(() => {
    getCompletedLessons().then((ids) => setCompleted(ids));
  }, []);

  const phases = Array.from(new Set(course.lessons.map((l) => l.phase)));

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto">
      {/* Back */}
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 text-xs text-white/40 hover:text-white/70 transition-colors mb-8"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        ダッシュボードに戻る
      </Link>

      {/* Header */}
      <FadeIn className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-3xl">{course.icon}</span>
          <div>
            <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "var(--font-serif)" }}>
              {course.title}
            </h1>
            <p className="text-sm text-white/40">{course.totalLessons} レッスン</p>
          </div>
        </div>
        <p className="text-sm text-white/50 leading-relaxed">{course.description}</p>
      </FadeIn>

      {/* Lessons by phase */}
      <div className="space-y-8">
        {phases.map((phase, pi) => {
          const phaseLessons = course.lessons.filter((l) => l.phase === phase);
          const phaseLabel = phaseLessons[0]?.phaseLabel ?? phase;

          return (
            <FadeIn key={phase} delay={0.05 + pi * 0.05}>
              <div className="flex items-center gap-3 mb-3">
                <span
                  className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border ${
                    phaseColorMap[phase] ?? "text-white/50 bg-white/5 border-white/10"
                  }`}
                >
                  {phaseLabel}
                </span>
              </div>

              <div className="space-y-2">
                {phaseLessons.map((lesson, li) => (
                  <FadeInList key={lesson.id} index={li}>
                    <Link href={`/courses/${courseId}/${lesson.id}`}>
                      <motion.div
                        whileHover={{ x: 3 }}
                        className="flex items-center gap-4 p-4 rounded-xl glass-card hover:border-white/10 transition-all cursor-pointer group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-white/10 transition-colors">
                          <Play className="w-3.5 h-3.5 text-white/30 group-hover:text-white/60 transition-colors" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-[10px] font-mono text-white/20">
                              No.{lesson.number}
                            </span>
                            {lesson.loomUrl && (
                              <Badge
                                variant="outline"
                                className="text-[9px] px-1.5 py-0 h-4 border-amber-500/20 text-amber-500/60"
                              >
                                動画あり
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm font-medium text-white/80 truncate group-hover:text-white transition-colors">
                            {lesson.title}
                          </p>
                          <p className="text-[11px] text-white/30 mt-0.5 truncate">
                            {lesson.description}
                          </p>
                        </div>
                        <CheckCircle2 className={`w-4 h-4 shrink-0 ${completed.includes(`${courseId}-${lesson.id}`) ? "text-green-400" : "text-white/10"}`} />
                      </motion.div>
                    </Link>
                  </FadeInList>
                ))}
              </div>
            </FadeIn>
          );
        })}
      </div>

      {/* Worksheet link card */}
      {(courseId === "statement" || courseId === "activity") && (
        <div className="mt-10 border-t border-white/5 pt-10">
          <Link href={`/worksheets/${courseId}`}>
            <motion.div
              whileHover={{ x: 3 }}
              className="flex items-center gap-4 p-5 rounded-2xl glass-card hover:border-white/12 transition-all cursor-pointer group"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${courseId === "activity" ? "bg-green-500/15" : "bg-blue-500/15"}`}>
                {courseId === "activity"
                  ? <BookOpen className="w-5 h-5 text-green-400" />
                  : <PenLine className="w-5 h-5 text-blue-400" />}
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-white group-hover:text-white/90">フォーマット</p>
                <p className="text-xs text-white/40 mt-0.5">
                  {courseId === "activity" ? "活動報告書 Webエントリーページ踏襲版" : "アイデア書き出し — 8段落構成"}
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-white/50 transition-colors shrink-0" />
            </motion.div>
          </Link>
        </div>
      )}
    </div>
  );
}
