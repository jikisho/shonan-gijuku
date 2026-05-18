"use client";

import { notFound } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { use, useState, useEffect, useTransition } from "react";
import {
  getCourse,
  getLoomEmbedUrl,
  getSlidesEmbedUrl,
} from "@/data/courses";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  Play,
  Presentation,
  ChevronRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { FadeIn } from "@/components/PageMotion";
import { toggleLessonProgress, getCompletedLessons, migrateLocalStorageProgress } from "@/app/actions/progress";

const PROGRESS_KEY = "shonan_juku_progress";
const MIGRATED_KEY = "shonan_juku_migrated";

export default function LessonPage({
  params,
}: {
  params: Promise<{ courseId: string; lessonId: string }>;
}) {
  const { courseId, lessonId } = use(params);
  const [isDone, setIsDone] = useState(false);
  const [isPending, startTransition] = useTransition();

  // 初回マウント時: localStorageマイグレーション → DB取得
  useEffect(() => {
    const migrate = async () => {
      const migrated = localStorage.getItem(MIGRATED_KEY);
      if (!migrated) {
        try {
          const local: string[] = JSON.parse(localStorage.getItem(PROGRESS_KEY) ?? "[]");
          if (local.length > 0) {
            await migrateLocalStorageProgress(local);
          }
          localStorage.setItem(MIGRATED_KEY, "1");
        } catch {}
      }
    };

    const fetchCompleted = async () => {
      await migrate();
      const ids = await getCompletedLessons();
      setIsDone(ids.includes(lessonId));
    };

    fetchCompleted();
  }, [lessonId]);

  const toggleComplete = () => {
    startTransition(async () => {
      const result = await toggleLessonProgress(lessonId);
      if (!result.error) {
        setIsDone(result.completed);
      }
    });
  };

  const course = getCourse(courseId);
  if (!course) notFound();

  const lessonIndex = course.lessons.findIndex((l) => l.id === lessonId);
  if (lessonIndex === -1) notFound();
  const lesson = course.lessons[lessonIndex];

  const prevLesson = lessonIndex > 0 ? course.lessons[lessonIndex - 1] : null;
  const nextLesson =
    lessonIndex < course.lessons.length - 1
      ? course.lessons[lessonIndex + 1]
      : null;

  const loomEmbedUrl = lesson.loomUrl ? getLoomEmbedUrl(lesson.loomUrl) : "";
  const slidesEmbedUrl = lesson.slidesUrl
    ? getSlidesEmbedUrl(lesson.slidesUrl)
    : "";
  return (
    <div>
      {/* Hero Cover */}
      <div className="relative w-full h-56 md:h-64 overflow-hidden">
        {/* base dark layer */}
        <div className="absolute inset-0 bg-[oklch(0.07_0.01_265)]" />

        {/* radial glow from accent color */}
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse 80% 120% at 20% 60%, ${course.accentColor}28 0%, transparent 70%)`,
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, ${course.accentColor}18 0%, transparent 55%)`,
          }}
        />

        {/* decorative large number */}
        <div
          className="absolute right-6 top-1/2 -translate-y-1/2 font-mono font-black leading-none select-none pointer-events-none"
          style={{
            fontSize: "clamp(6rem, 18vw, 14rem)",
            color: `${course.accentColor}12`,
            letterSpacing: "-0.05em",
          }}
        >
          {String(lesson.number).padStart(2, "0")}
        </div>

        {/* subtle grid lines */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(${course.accentColor} 1px, transparent 1px), linear-gradient(90deg, ${course.accentColor} 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />

        {/* bottom fade */}
        <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.07_0.01_265)] via-transparent to-transparent" />

        {/* breadcrumb */}
        <nav className="absolute top-5 left-6 flex items-center gap-1.5 text-xs text-white/30">
          <Link href="/dashboard" className="hover:text-white/60 transition-colors">
            ダッシュボード
          </Link>
          <ChevronRight className="w-3 h-3" />
          <Link
            href={`/courses/${courseId}`}
            className="hover:text-white/60 transition-colors"
          >
            {course.shortTitle}
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-white/50">No.{lesson.number}</span>
        </nav>

        {/* accent line */}
        <div
          className="absolute bottom-0 left-0 h-[2px] w-24"
          style={{ background: `linear-gradient(90deg, ${course.accentColor}, transparent)` }}
        />

        {/* Title overlay */}
        <div className="absolute bottom-0 left-0 right-0 px-8 pb-7">
          <Badge
            variant="outline"
            className="text-[10px] border-white/10 text-white/35 mb-2"
          >
            {lesson.phaseLabel}
          </Badge>
          <h1
            className="text-2xl md:text-3xl font-bold text-white leading-tight"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {lesson.title}
          </h1>
        </div>
      </div>

      <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <FadeIn>
        {/* description */}
        <div className="mb-6">
          <p className="text-sm text-white/50 leading-relaxed">
            {lesson.description}
          </p>
        </div>

        {/* Loom Video */}
        {loomEmbedUrl && (
          <FadeIn delay={0.1} className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Play className="w-4 h-4 text-amber-400" />
              <h2 className="text-sm font-semibold text-white/70">解説動画</h2>
            </div>
            <div className="video-container shadow-2xl shadow-black/50">
              <iframe
                src={loomEmbedUrl}
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                title={`No.${lesson.number} ${lesson.title}`}
              />
            </div>
            {lesson.loomUrl && (
              <a
                href={lesson.loomUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 mt-2 text-[11px] text-white/25 hover:text-white/50 transition-colors"
              >
                <ExternalLink className="w-3 h-3" />
                Loomで開く
              </a>
            )}
          </FadeIn>
        )}

        {/* No video placeholder */}
        {!loomEmbedUrl && (
          <FadeIn delay={0.1} className="mb-6 rounded-xl border border-dashed border-white/10 bg-white/2 flex flex-col items-center justify-center py-14 text-center">
            <Play className="w-8 h-8 text-white/10 mb-3" />
            <p className="text-sm text-white/20">動画は準備中です</p>
          </FadeIn>
        )}

        {/* Google Slides */}
        {slidesEmbedUrl && (
          <FadeIn delay={0.2} className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Presentation className="w-4 h-4 text-blue-400" />
              <h2 className="text-sm font-semibold text-white/70">スライド資料</h2>
            </div>
            <div className="video-container shadow-2xl shadow-black/50">
              <iframe
                src={slidesEmbedUrl}
                allow="autoplay"
                allowFullScreen
                title={`Slides ${lesson.title}`}
              />
            </div>
            <a
              href={lesson.slidesUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 mt-2 text-[11px] text-white/25 hover:text-white/50 transition-colors"
            >
              <ExternalLink className="w-3 h-3" />
              Google Slidesで開く
            </a>
          </FadeIn>
        )}

        {/* Details — detailed explanation per point */}
        {lesson.details && lesson.details.length > 0 && (
          <FadeIn delay={0.25} className="mb-6">
            <h2 className="text-sm font-semibold text-white/70 mb-3">
              📖 詳細解説
            </h2>
            <div className="space-y-3">
              {lesson.details.map((d, i) => (
                <div
                  key={i}
                  className="glass-card rounded-xl p-4 border-l-2"
                  style={{ borderColor: `${course.accentColor}60` }}
                >
                  <p className="text-sm font-semibold text-white/90 mb-1.5">{d.point}</p>
                  <p className="text-sm text-white/55 leading-relaxed">{d.explanation}</p>
                </div>
              ))}
            </div>
          </FadeIn>
        )}

        {/* Key Points */}
        {lesson.keyPoints.length > 0 && (
          <FadeIn delay={0.3} className="mb-8">
            <h2 className="text-sm font-semibold text-white/70 mb-3">
              📌 まとめ
            </h2>
            <div className="glass-card rounded-xl p-5 space-y-3">
              {lesson.keyPoints.map((point, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center mt-0.5 shrink-0"
                    style={{ background: `${course.accentColor}25` }}
                  >
                    <span className="text-[10px] font-bold" style={{ color: course.accentColor }}>{i + 1}</span>
                  </div>
                  <p className="text-sm text-white/70 leading-relaxed">{point}</p>
                </div>
              ))}
            </div>
          </FadeIn>
        )}

        {/* Mark complete + navigation */}
        <FadeIn delay={0.35} className="flex items-center justify-between pt-6 border-t border-white/5">
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={toggleComplete}
            disabled={isPending}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${
              isDone
                ? "bg-green-500/20 border border-green-500/30 text-green-400"
                : "bg-white/5 border border-white/10 text-white/50 hover:bg-green-500/10 hover:border-green-500/20 hover:text-green-400"
            }`}
          >
            <CheckCircle2 className={`w-4 h-4 ${isDone ? "text-green-400" : "text-white/30"}`} />
            {isPending ? "保存中..." : isDone ? "完了済み ✓" : "完了にする"}
          </motion.button>

          <div className="flex gap-3">
            {prevLesson && (
              <Link href={`/courses/${courseId}/${prevLesson.id}`}>
                <button className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-white/10 text-white/50 text-sm hover:text-white/80 hover:border-white/20 transition-colors">
                  <ArrowLeft className="w-3.5 h-3.5" />
                  前へ
                </button>
              </Link>
            )}
            {nextLesson && (
              <Link href={`/courses/${courseId}/${nextLesson.id}`}>
                <button className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-amber-600/20 border border-amber-500/20 text-amber-400 text-sm font-medium hover:from-amber-500/30 hover:to-amber-600/30 transition-colors">
                  次へ
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </Link>
            )}
          </div>
        </FadeIn>
      </FadeIn>
      </div>
    </div>
  );
}
