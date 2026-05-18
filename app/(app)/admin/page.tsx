import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { courses } from "@/data/courses";
import { getAllQuestions } from "@/data/analysis-questions";
import { redirect } from "next/navigation";
import { Users, BookOpen, CheckCircle2, GraduationCap, Brain } from "lucide-react";

// 全コースの全レッスン数
const totalLessonsPerCourse = Object.fromEntries(
  courses.map((c) => [c.id, c.totalLessons])
);

// 全問数（analysis-questions.tsから正確に取得）
const totalAnalysisQuestions = getAllQuestions().length;

// lesson_id は "{courseId}-{lessonId}" 形式で保存されていると仮定
// courses.ts の lessons[].id は "no1" 等なので、コースIDと合わせて識別
function getLessonCourseId(lessonId: string): string | null {
  for (const course of courses) {
    for (const lesson of course.lessons) {
      if (`${course.id}-${lesson.id}` === lessonId || lesson.id === lessonId) {
        return course.id;
      }
    }
  }
  return null;
}

type StudentProgress = {
  userId: string;
  email: string;
  progressByCourse: Record<string, number>;
  analysisAnswerCount: number;
};

export default async function AdminPage() {
  // 認証ユーザーの is_teacher を再確認（多重防衛）
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_teacher")
    .eq("id", user.id)
    .single();

  if (!profile?.is_teacher) {
    redirect("/dashboard");
  }

  // service role key で全データ取得
  const admin = createAdminClient();

  // 全ユーザー取得（auth.users）
  const { data: usersData, error: usersError } =
    await admin.auth.admin.listUsers({ perPage: 1000 });

  if (usersError) {
    return (
      <div className="p-8 text-red-400">
        ユーザー取得エラー: {usersError.message}
      </div>
    );
  }

  // 全 lesson_progress 取得
  const { data: progressData, error: progressError } = await admin
    .from("lesson_progress")
    .select("user_id, lesson_id");

  if (progressError) {
    return (
      <div className="p-8 text-red-400">
        進捗取得エラー: {progressError.message}
      </div>
    );
  }

  // 全 analysis_answers 取得（回答数のカウントのみ）
  const { data: analysisData } = await admin
    .from("analysis_answers")
    .select("user_id, question_id");

  // ユーザーごとの自己分析回答数を集計
  const analysisCountMap: Record<string, number> = {};
  for (const row of analysisData ?? []) {
    analysisCountMap[row.user_id] = (analysisCountMap[row.user_id] ?? 0) + 1;
  }

  // ユーザーごとのコース進捗を集計
  const progressMap: Record<string, Record<string, number>> = {};
  for (const row of progressData ?? []) {
    if (!progressMap[row.user_id]) {
      progressMap[row.user_id] = {};
    }
    // lesson_id からコースを特定
    const courseId = getLessonCourseId(row.lesson_id);
    if (courseId) {
      progressMap[row.user_id][courseId] =
        (progressMap[row.user_id][courseId] ?? 0) + 1;
    }
  }

  // 生徒一覧（講師自身を除く）
  const students: StudentProgress[] = (usersData?.users ?? [])
    .filter((u) => u.id !== user.id)
    .map((u) => ({
      userId: u.id,
      email: u.email ?? "(メールなし)",
      progressByCourse: progressMap[u.id] ?? {},
      analysisAnswerCount: analysisCountMap[u.id] ?? 0,
    }));

  const totalStudents = students.length;
  const totalLessons = courses.reduce((s, c) => s + c.totalLessons, 0);

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <p className="text-xs tracking-[0.25em] text-amber-400/60 uppercase mb-2">
          講師専用ページ
        </p>
        <h1
          className="text-2xl md:text-3xl font-bold text-white"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          管理画面
        </h1>
        <p className="text-sm text-white/40 mt-1">
          全生徒の学習進捗を確認できます
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
        {[
          {
            label: "登録生徒数",
            value: totalStudents,
            icon: Users,
            color: "text-blue-400",
          },
          {
            label: "総レッスン数",
            value: totalLessons,
            icon: BookOpen,
            color: "text-purple-400",
          },
          {
            label: "コース数",
            value: courses.length,
            icon: GraduationCap,
            color: "text-amber-400",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="glass-card rounded-xl p-4 md:p-5 flex items-center gap-4"
          >
            <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-xs text-white/40">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Students Table */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-white/5 flex items-center gap-3">
          <Users className="w-4 h-4 text-white/40" />
          <h2 className="text-sm font-semibold text-white/80">生徒一覧</h2>
        </div>

        {students.length === 0 ? (
          <div className="p-8 text-center text-white/30 text-sm">
            登録されている生徒がいません
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="px-5 py-3 text-left text-xs font-medium text-white/40 uppercase tracking-wider">
                    メールアドレス
                  </th>
                  {courses.map((course) => (
                    <th
                      key={course.id}
                      className="px-4 py-3 text-center text-xs font-medium text-white/40 uppercase tracking-wider whitespace-nowrap"
                    >
                      {course.shortTitle}
                    </th>
                  ))}
                  <th className="px-4 py-3 text-center text-xs font-medium text-white/40 uppercase tracking-wider whitespace-nowrap">
                    <div className="flex items-center justify-center gap-1">
                      <Brain className="w-3 h-3" />
                      <span>自己分析</span>
                    </div>
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-white/40 uppercase tracking-wider">
                    合計
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {students.map((student) => {
                  const totalCompleted = Object.values(
                    student.progressByCourse
                  ).reduce((s, v) => s + v, 0);

                  const analysisCount = student.analysisAnswerCount;
                  const isAnalysisComplete = analysisCount >= totalAnalysisQuestions;
                  const analysisColor = isAnalysisComplete
                    ? "text-green-400"
                    : analysisCount > 0
                    ? "text-amber-400"
                    : "text-white/25";

                  return (
                    <tr
                      key={student.userId}
                      className="hover:bg-white/5 transition-colors"
                    >
                      <td className="px-5 py-3 text-white/70 font-mono text-xs">
                        {student.email}
                      </td>
                      {courses.map((course) => {
                        const completed =
                          student.progressByCourse[course.id] ?? 0;
                        const total = totalLessonsPerCourse[course.id];
                        const pct = Math.round((completed / total) * 100);
                        const isComplete = completed >= total;

                        return (
                          <td
                            key={course.id}
                            className="px-4 py-3 text-center"
                          >
                            <div className="flex flex-col items-center gap-1">
                              <span
                                className={`text-xs font-medium ${
                                  isComplete
                                    ? "text-green-400"
                                    : completed > 0
                                    ? "text-amber-400"
                                    : "text-white/25"
                                }`}
                              >
                                {completed}/{total}
                              </span>
                              <div className="w-16 h-1 rounded-full bg-white/10 overflow-hidden">
                                <div
                                  className={`h-full rounded-full transition-all ${
                                    isComplete
                                      ? "bg-green-400"
                                      : completed > 0
                                      ? "bg-amber-400"
                                      : "bg-transparent"
                                  }`}
                                  style={{ width: `${pct}%` }}
                                />
                              </div>
                            </div>
                          </td>
                        );
                      })}
                      {/* 自己分析カラム */}
                      <td className="px-4 py-3 text-center">
                        <div className="flex flex-col items-center gap-1">
                          <span className={`text-xs font-medium ${analysisColor}`}>
                            {analysisCount}/{totalAnalysisQuestions}
                          </span>
                          <div className="w-16 h-1 rounded-full bg-white/10 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${
                                isAnalysisComplete
                                  ? "bg-green-400"
                                  : analysisCount > 0
                                  ? "bg-amber-400"
                                  : "bg-transparent"
                              }`}
                              style={{
                                width: `${Math.round((analysisCount / totalAnalysisQuestions) * 100)}%`,
                              }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <CheckCircle2
                            className={`w-3.5 h-3.5 ${
                              totalCompleted > 0
                                ? "text-green-400"
                                : "text-white/20"
                            }`}
                          />
                          <span className="text-xs font-semibold text-white/60">
                            {totalCompleted}/{totalLessons}
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
