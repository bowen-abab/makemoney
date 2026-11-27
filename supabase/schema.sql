-- 在 Supabase 控制台 -> SQL Editor 中执行本文件
-- 作用：为每个登录用户保存一份赚钱设置，并用 RLS 保证只能读自己的数据

create table if not exists public.user_settings (
  user_id uuid primary key references auth.users(id) on delete cascade,
  salary numeric not null default 10000,
  workdays integer[] not null default array[1, 2, 3, 4, 5],
  start_time text not null default '09:00',
  end_time text not null default '18:00',
  break_minutes integer not null default 60,
  updated_at timestamptz not null default now()
);

-- 关键：给登录用户授予表权限，否则 RLS 策略再对也会被数据库拒绝（403）
grant select, insert, update on public.user_settings to authenticated;

alter table public.user_settings enable row level security;

drop policy if exists "Users can read own settings" on public.user_settings;
create policy "Users can read own settings"
  on public.user_settings for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "Users can insert own settings" on public.user_settings;
create policy "Users can insert own settings"
  on public.user_settings for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "Users can update own settings" on public.user_settings;
create policy "Users can update own settings"
  on public.user_settings for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
