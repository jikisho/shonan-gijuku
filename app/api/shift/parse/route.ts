import { NextRequest, NextResponse } from 'next/server';

const API_KEY = process.env.ANTHROPIC_API_KEY;

// GET: check if AI is enabled
export async function GET() {
  return NextResponse.json({ enabled: !!API_KEY });
}

export async function POST(request: NextRequest) {
  if (!API_KEY) {
    return NextResponse.json({ error: 'ANTHROPIC_API_KEY not set' }, { status: 503 });
  }

  const body = await request.json();
  const { text, week_start } = body as { text: string; week_start: string };

  if (!text || !week_start) {
    return NextResponse.json({ error: 'text and week_start required' }, { status: 400 });
  }

  const prompt = `あなたはスケジュール解析AIです。以下のテキストから空き時間を抽出してJSON形式で返してください。

対象週: ${week_start}(月)〜7日後(日)
day_index: 0=月, 1=火, 2=水, 3=木, 4=金, 5=土, 6=日
スロット: s10=10〜12時, s12=12〜14時, s14=14〜16時, s16=16〜18時, s18=18〜20時, s20=20〜22時

入力: "${text}"

JSON形式のみで返す:
{"slots":[{"day_index":数字,"slot_key":"sXX"}],"summary":"日本語要約"}`;

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 512,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    const data = await res.json();
    const rawText = data.content?.[0]?.text ?? '{}';

    // Extract JSON from response
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON in response');
    const parsed = JSON.parse(jsonMatch[0]);

    return NextResponse.json(parsed);
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'parse_error' }, { status: 500 });
  }
}
