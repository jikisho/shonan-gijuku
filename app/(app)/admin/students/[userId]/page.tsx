import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { categories } from "@/data/analysis-questions";
import { statementParagraphs } from "@/data/worksheets";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Brain, MessageSquare, MinusCircle, PenLine } from "lucide-react";

type Props = {
  params: Promise<{ userId: string }>;
};

export default async function StudentDetailPage({ params }: Props) {
  const { userId } = await params;

  // 認証チェック
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

  // service role で対象ユーザーの情報を取得
  const admin = createAdminClient();

  // 対象ユーザーの情報取得
  const { data: targetUserData, error: userError } =
    await admin.auth.admin.getUserById(userId);

  if (userError || !targetUserData?.user) {
    return (
      <div className="p-8 text-red-400">
        ユーザーが見つかりません: {userError?.message}
      </div>
    );
  }

  const targetUser = targetUserData.user;

  // 対象ユーザーの全自己分析回答を取得
  const { data: answersData, error: answersError } = await admin
    .from("analysis_answers")
    .select("question_id, answer, updated_at")
    .eq("user_id", userId);

  // 志望理由書アイデア書き出しを取得
  const { data: statementData } = await admin
    .from("statement_worksheets")
    .select("data, updated_at")
    .eq("user_id", userId)
    .single();

  type StatementAnswers = Record<string, { title: string; notes: string }>;
  const statementAnswers: StatementAnswers = (statementData?.data as StatementAnswers) ?? {};
  const statementUpdatedAt = statementData?.updated_at ?? null;
  const statementFilledCount = Object.values(statementAnswers).filter(
    (a) => a?.title?.trim() || a?.notes?.trim()
  ).length;

  if (answersError) {
    return (
      <div className="p-8 text-red-400">
        回答取得エラー: {answersError.message}
      </div>
    );
  }

  // question_id → { answer, updated_at } のマップに変換
  const answersMap: Record<string, { answer: string; updated_at: string }> = {};
  for (const row of answersData ?? []) {
    answersMap[row.question_id] = {
      answer: row.answer,
      updated_at: row.updated_at,
    };
  }

  const answeredCount = Object.keys(answersMap).length;
  const totalCount = categories.flatMap((c) => c.questions).length;

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      {/* 戻るリンク */}
      <Link
        href="/admin"
        className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white/70 transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        管理画面に戻る
      </Link>

      {/* ヘッダー */}
      <div className="mb-8">
        <p className="text-xs tracking-[0.25em] text-amber-400/60 uppercase mb-2">
          生徒の学習状況
        </p>
        <h1
          className="text-2xl md:text-3xl font-bold text-white break-all"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          {targetUser.email}
        </h1>
        <div className="flex flex-wrap items-center gap-4 mt-3">
          <div className="flex items-center gap-1.5 text-sm">
            <Brain className="w-4 h-4 text-amber-400" />
            <span
              className={`font-semibold ${
                answeredCount >= totalCount
                  ? "text-green-400"
                  : answeredCount > 0
                  ? "text-amber-400"
                  : "text-white/40"
              }`}
            >
              自己分析 {answeredCount} / {totalCount}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-sm">
            <PenLine className="w-4 h-4 text-blue-400" />
            <span
              className={`font-semibold ${
                statementFilledCount >= statementParagraphs.length
                  ? "text-green-400"
                  : statementFilledCount > 0
                  ? "text-blue-400"
                  : "text-white/40"
              }`}
            >
              志望理由書アイデア {statementFilledCount} / {statementParagraphs.length}
            </span>
          </div>
        </div>
      </div>

      {/* ─── 志望理由書アイデア書き出し ─── */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <PenLine className="w-4 h-4 text-blue-400" />
          <h2 className="text-sm font-semibold text-white/80">志望理由書 アイデア書き出し</h2>
          {statementUpdatedAt && (
            <span className="text-xs text-white/25 ml-auto">
              最終更新: {new Date(statementUpdatedAt).toLocaleDateString("ja-JP", { year: "numeric", month: "short", day: "numeric" })}
            </span>
          )}
        </div>

        {statementFilledCount === 0 ? (
          <div className="glass-card rounded-xl p-6 text-center text-white/30 text-sm">
            まだ入力されていません
          </div>
        ) : (
          <div className="space-y-3">
            {statementParagraphs.map((para) => {
              const ans = statementAnswers[para.number];
              const hasContent = ans?.title?.trim() || ans?.notes?.trim();
              return (
                <div key={para.number} className="glass-card rounded-xl overflow-hidden">
                  <div className="flex items-center gap-3 px-4 py-3 border-b border-white/5">
                    <div className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 text-xs font-bold ${hasContent ? "bg-blue-500/20 text-blue-400" : "bg-white/5 text-white/20"}`}>
                      {para.number}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-white/70">{para.label}</p>
                      <p className="text-[10px] text-white/30">{para.role}</p>
                    </div>
                  </div>
                  {hasContent ? (
                    <div className="px-4 py-3 space-y-2">
                      {ans?.title?.trim() && (
                        <div>
                          <p className="text-[10px] text-white/30 uppercase tracking-wider mb-1">タイトル</p>
                          <p className="text-sm text-white/80 font-medium">{ans.title}</p>
                        </div>
                      )}
                      {ans?.notes?.trim() && (
                        <div>
                          <p className="text-[10px] text-white/30 uppercase tracking-wider mb-1">メモ</p>
                          <p className="text-sm text-white/65 leading-relaxed whitespace-pre-wrap">{ans.notes}</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="px-4 py-3 flex items-center gap-2 text-white/20">
                      <MinusCircle className="w-3.5 h-3.5" />
                      <span className="text-xs">未入力</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* カテゴリごとの回答一覧 */}
      <div className="space-y-8">
        {categories.map((category) => {
          const categoryAnsweredCount = category.questions.filter(
            (q) => answersMap[q.id]?.answer?.trim()
          ).length;

          return (
            <div key={category.id} className="glass-card rounded-2xl overflow-hidden">
              {/* カテゴリヘッダー */}
              <div className="px-5 py-4 border-b border-white/5 flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs text-amber-400/60 uppercase tracking-widest mb-1">
                    カテゴリ {category.number}
                  </p>
                  <h2 className="text-base font-bold text-white">
                    {category.title}
                  </h2>
                  <p className="text-xs text-white/30 mt-1 leading-relaxed">
                    {category.description}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <span
                    className={`text-sm font-semibold ${
                      categoryAnsweredCount >= category.questions.length
                        ? "text-green-400"
                        : categoryAnsweredCount > 0
                        ? "text-amber-400"
                        : "text-white/25"
                    }`}
                  >
                    {categoryAnsweredCount}/{category.questions.length}
                  </span>
                </div>
              </div>

              {/* 質問と回答 */}
              <div className="divide-y divide-white/5">
                {category.questions.map((question) => {
                  const answerData = answersMap[question.id];
                  const hasAnswer = answerData?.answer?.trim();

                  return (
                    <div key={question.id} className="px-5 py-5">
                      {/* 質問 */}
                      <div className="flex items-start gap-3 mb-3">
                        <span className="shrink-0 w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-xs text-white/40 font-mono">
                          {question.number}
                        </span>
                        <p className="text-sm font-semibold text-white/80 leading-relaxed">
                          {question.text}
                        </p>
                      </div>

                      {/* 回答 */}
                      {hasAnswer ? (
                        <div className="ml-9">
                          <div className="flex items-center gap-1.5 mb-2">
                            <MessageSquare className="w-3 h-3 text-amber-400/60" />
                            <span className="text-xs text-white/30">回答</span>
                            {answerData.updated_at && (
                              <span className="text-xs text-white/20 ml-auto">
                                {new Date(answerData.updated_at).toLocaleDateString(
                                  "ja-JP",
                                  {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  }
                                )}
                              </span>
                            )}
                          </div>
                          <div className="bg-white/3 rounded-lg px-4 py-3 border border-white/5">
                            <p className="text-sm text-white/70 leading-relaxed whitespace-pre-wrap">
                              {answerData.answer}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="ml-9">
                          <div className="flex items-center gap-2 text-white/20">
                            <MinusCircle className="w-3.5 h-3.5" />
                            <span className="text-xs">未回答</span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
