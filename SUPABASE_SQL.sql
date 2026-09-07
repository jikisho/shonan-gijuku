-- 講師空き時間テーブル（Supabase SQL Editorで実行してください）

create table if not exists coach_availability (
  id uuid primary key default gen_random_uuid(),
  coach_id text not null,        -- 'yamada', 'nakamura', 'tosho', 'matsumoto', 'shinobe', 'fujiwara', 'tasaka', 'domon'
  week_start date not null,      -- '2026-09-08' (その週の月曜日)
  day_index int not null,        -- 0=月, 1=火, 2=水, 3=木, 4=金, 5=土, 6=日
  slot_key text not null,        -- 's10', 's12', 's14', 's16', 's18', 's20'
  created_at timestamptz default now(),
  unique(coach_id, week_start, day_index, slot_key)
);

-- RLS（Row Level Security）は認証不要なので公開アクセスを許可
alter table coach_availability enable row level security;

-- 全員が読み書き可能（認証不要の内部ツールとして）
create policy "allow_read" on coach_availability for select using (true);
create policy "allow_insert" on coach_availability for insert with check (true);
create policy "allow_delete" on coach_availability for delete using (true);
