import { NextRequest, NextResponse } from 'next/server';
import { createClient as createServerClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const week = request.nextUrl.searchParams.get('week');
  if (!week) return NextResponse.json({ error: 'week required' }, { status: 400 });

  try {
    const supabase = await createServerClient();
    const { data, error } = await supabase
      .from('coach_availability')
      .select('coach_id, day_index, slot_key')
      .eq('week_start', week);

    if (error) throw error;
    return NextResponse.json({ records: data ?? [] });
  } catch {
    // fallback: return empty
    return NextResponse.json({ records: [] });
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { coach_id, week_start, day_index, slot_key } = body;

  try {
    const supabase = await createServerClient();
    const { error } = await supabase.from('coach_availability').upsert(
      { coach_id, week_start, day_index, slot_key },
      { onConflict: 'coach_id,week_start,day_index,slot_key' }
    );
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: 'db_error' });
  }
}

export async function DELETE(request: NextRequest) {
  const body = await request.json();
  const { coach_id, week_start, day_index, slot_key } = body;

  try {
    const supabase = await createServerClient();
    const { error } = await supabase
      .from('coach_availability')
      .delete()
      .match({ coach_id, week_start, day_index, slot_key });
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: 'db_error' });
  }
}
