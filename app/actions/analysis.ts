'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

/**
 * 1問の回答をDBにupsert
 */
export async function saveAnalysisAnswer(
  questionId: string,
  answer: string
): Promise<{ error?: string }> {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) return { error: 'Unauthorized' }

  const { error } = await supabase
    .from('analysis_answers')
    .upsert(
      { user_id: user.id, question_id: questionId, answer, updated_at: new Date().toISOString() },
      { onConflict: 'user_id,question_id' }
    )

  if (error) return { error: error.message }

  revalidatePath('/analysis')
  return {}
}

/**
 * 自分の全回答をDBから取得 → { questionId: answer } の形で返す
 */
export async function getAnalysisAnswers(): Promise<Record<string, string>> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return {}

  const { data, error } = await supabase
    .from('analysis_answers')
    .select('question_id, answer')
    .eq('user_id', user.id)

  if (error || !data) return {}

  return Object.fromEntries(data.map((row) => [row.question_id, row.answer]))
}

/**
 * localStorageの内容をDBに一括移行（初回マイグレーション用）
 */
export async function migrateAnalysisFromLocalStorage(
  answers: Record<string, string>
): Promise<{ error?: string }> {
  const entries = Object.entries(answers).filter(([, v]) => v.trim())
  if (entries.length === 0) return {}

  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) return { error: 'Unauthorized' }

  const rows = entries.map(([question_id, answer]) => ({
    user_id: user.id,
    question_id,
    answer,
    updated_at: new Date().toISOString(),
  }))

  const { error } = await supabase
    .from('analysis_answers')
    .upsert(rows, { onConflict: 'user_id,question_id' })

  if (error) return { error: error.message }

  revalidatePath('/analysis')
  return {}
}
