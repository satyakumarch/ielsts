CREATE TABLE public.practice_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  skill text NOT NULL,
  prompt text NOT NULL,
  response text NOT NULL,
  band numeric,
  feedback jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.practice_submissions TO authenticated;
GRANT ALL ON public.practice_submissions TO service_role;
ALTER TABLE public.practice_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own submissions" ON public.practice_submissions FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.vocab_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  word text NOT NULL,
  box int NOT NULL DEFAULT 0,
  due_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, word)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.vocab_progress TO authenticated;
GRANT ALL ON public.vocab_progress TO service_role;
ALTER TABLE public.vocab_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own vocab" ON public.vocab_progress FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);