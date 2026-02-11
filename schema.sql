-- Run this in your Supabase SQL Editor

-- 1. Create Enum Types
create type difficulty_level as enum ('Easy', 'Medium', 'Hard');
create type revisit_status_type as enum ('no', 'soon', 'later');

-- 2. Create Problems Table
create table public.problems (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  leetcode_link text not null,
  difficulty difficulty_level not null,
  topics text[] not null check (array_length(topics, 1) > 0), -- Must have at least one topic
  solved_date timestamptz not null default now(),
  
  -- Remarks Section (Strictly Required)
  final_approach text not null,
  mistake_or_confusion text not null,
  key_insight text not null,
  
  -- Review Section
  confidence_score int not null check (confidence_score >= 1 and confidence_score <= 5),
  revisit_status revisit_status_type not null,
  last_reviewed_at timestamptz, -- Nullable only on creation
  review_count int not null default 0,
  
  created_at timestamptz not null default now(),
  
  -- Constraints
  constraint unique_link_per_user unique (user_id, leetcode_link),
  
  -- Enforce Revisit Logic Invariant
  constraint valid_revisit_logic check (
    (confidence_score <= 2 and revisit_status = 'soon') or
    (confidence_score = 3 and revisit_status = 'later') or
    (confidence_score >= 4 and revisit_status = 'no')
  ),
  
  -- Enforce Review Timestamp Consistency
  constraint review_timestamp_check check (
    (review_count = 0) or (last_reviewed_at is not null)
  )
);

-- 3. Enable Security (RLS)
alter table public.problems enable row level security;

-- 4. Create Access Policies (Users can only see their own data)
create policy "Users can select their own problems" on public.problems for select using (auth.uid() = user_id);
create policy "Users can insert their own problems" on public.problems for insert with check (auth.uid() = user_id);
create policy "Users can update their own problems" on public.problems for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users can delete their own problems" on public.problems for delete using (auth.uid() = user_id);
