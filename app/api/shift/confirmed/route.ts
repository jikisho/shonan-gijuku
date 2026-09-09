import { NextRequest, NextResponse } from 'next/server';
import { createClient as createServerClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const from = request.nextUrl.searchParams.get('from');
  const to = request.nextUrl.searchParams.get('to');
  if (!from || !to) return NextResponse.json({ error: 'from and to required' }, { status: 400 });

  try {
    const supabase = await createServerClient();
    const { data, error } = await supabase
      .from('confirmed_sessions')
      .select('id, coach_id, student_name, session_date, slot_key')
      .gte('session_date', from)
      .lte('session_date', to)
      .order('session_date', { ascending: true });

    if (error) throw error;
    return NextResponse.json({ records: data ?? [] });
  } catch {
    return NextResponse.json({ records: [] });
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { coach_id, student_name, session_date, slot_key } = body;

  if (!coach_id || !student_name || !session_date || !slot_key) {
    return NextResponse.json({ error: 'missing fields' }, { status: 400 });
  }

  try {
    const supabase = await createServerClient();
    const { data, error } = await supabase
      .from('confirmed_sessions')
      .insert({ coach_id, student_name, session_date, slot_key })
      .select()
      .single();
    if (error) throw error;
    return NextResponse.json({ ok: true, record: data });
  } catch {
    return NextResponse.json({ ok: false, error: 'db_error' });
  }
}

export async function DELETE(request: NextRequest) {
  const body = await request.json();
  const { id } = body;

  try {
    const supabase = await createServerClient();
    const { error } = await supabase.from('confirmed_sessions').delete().eq('id', id);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: 'db_error' });
  }
}
