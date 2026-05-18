'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

/**
 * 特定レッスンの完了状態を切り替える
 */
export async function toggleLessonProgress(lessonId: string): Promise<{ completed: boolean; error?: string }> {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return { completed: false, error: 'Unauthorized' }
  }

  // 現在の状態を確認
  const { data: existing } = await supabase
    .from('lesson_progress')
    .select('id')
    .eq('user_id', user.id)
    .eq('lesson_id', lessonId)
    .single()

  if (existing) {
    // 完了済み → 削除（未完了に戻す）
    const { error } = await supabase
      .from('lesson_progress')
      .delete()
      .eq('user_id', user.id)
      .eq('lesson_id', lessonId)

    if (error) return { completed: true, error: error.message }
    revalidatePath('/dashboard')
    return { completed: false }
  } else {
    // 未完了 → 追加
    const { error } = await supabase
      .from('lesson_progress')
      .insert({ user_id: user.id, lesson_id: lessonId })

    if (error) return { completed: false, error: error.message }
    revalidatePath('/dashboard')
    return { completed: true }
  }
}

/**
 * ユーザーの完了済みレッスンID一覧を取得
 */
export async function getCompletedLessons(): Promise<string[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return []

  const { data } = await supabase
    .from('lesson_progress')
    .select('lesson_id')
    .eq('user_id', user.id)

  return (data ?? []).map((row) => row.lesson_id)
}

/**
 * localStorageの進捗をDBに一括マイグレーション（初回ログイン時用）
 */
export async function migrateLocalStorageProgress(lessonIds: string[]): Promise<{ error?: string }> {
  if (lessonIds.length === 0) return {}

  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) return { error: 'Unauthorized' }

  // DBに既にあるものを取得
  const { data: existing } = await supabase
    .from('lesson_progress')
    .select('lesson_id')
    .eq('user_id', user.id)

  const existingIds = new Set((existing ?? []).map((r) => r.lesson_id))
  const newIds = lessonIds.filter((id) => !existingIds.has(id))

  if (newIds.length === 0) return {}

  const rows = newIds.map((lesson_id) => ({ user_id: user.id, lesson_id }))
  const { error } = await supabase.from('lesson_progress').insert(rows)

  if (error) return { error: error.message }

  revalidatePath('/dashboard')
  return {}
}
