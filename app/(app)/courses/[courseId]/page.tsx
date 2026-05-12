"use client";

import { notFound } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { use } from "react";
import { getCourse } from "@/data/courses";
import { ArrowLeft, Play, CheckCircle2, Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { FadeIn, FadeInList } from "@/components/PageMotion";

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

  const phases = Array.from(new Set(course.lessons.map((l) => l.phase)));

  return (
    <div className="p-8 max-w-3xl mx-auto">
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
                        <CheckCircle2 className="w-4 h-4 text-white/10 shrink-0" />
                      </motion.div>
                    </Link>
                  </FadeInList>
                ))}
              </div>
            </FadeIn>
          );
        })}
      </div>
    </div>
  );
}
