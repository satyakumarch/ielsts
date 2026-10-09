CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text,
  preferred_language text DEFAULT 'English',
  exam_type text DEFAULT 'academic' CHECK (exam_type IN ('academic','general')),
  current_band numeric(2,1),
  target_band numeric(2,1),
  test_date date,
  daily_minutes int DEFAULT 60,
  weak_skills text[] DEFAULT '{}',
  schedule text DEFAULT 'weekdays',
  goal text DEFAULT 'university',
  onboarded boolean NOT NULL DEFAULT false,
  last_activity jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own profile select" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "own profile insert" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "own profile update" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "own profile delete" ON public.profiles FOR DELETE TO authenticated USING (auth.uid() = id);

CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email,'@',1)))
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END $$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE TABLE public.skill_scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  skill text NOT NULL CHECK (skill IN ('listening','reading','writing','speaking','overall')),
  band numeric(2,1) NOT NULL CHECK (band >= 0 AND band <= 9),
  source text NOT NULL CHECK (source IN ('diagnostic','practice','mock','self')),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.skill_scores TO authenticated;
GRANT ALL ON public.skill_scores TO service_role;
ALTER TABLE public.skill_scores ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own scores" ON public.skill_scores FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX ON public.skill_scores (user_id, created_at);

CREATE TABLE public.reading_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  test_id text NOT NULL,
  mode text NOT NULL CHECK (mode IN ('exam','practice')),
  scope text NOT NULL DEFAULT 'full',
  answers jsonb NOT NULL DEFAULT '{}',
  correct int NOT NULL CHECK (correct >= 0),
  total int NOT NULL CHECK (total > 0),
  band numeric(2,1),
  seconds_spent int NOT NULL DEFAULT 0,
  by_type jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.reading_attempts TO authenticated;
GRANT ALL ON public.reading_attempts TO service_role;
ALTER TABLE public.reading_attempts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own attempts" ON public.reading_attempts FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.mistakes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  skill text NOT NULL,
  category text NOT NULL,
  question_type text,
  question text NOT NULL,
  user_answer text,
  correct_answer text NOT NULL,
  explanation text,
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new','reviewing','mastered')),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.mistakes TO authenticated;
GRANT ALL ON public.mistakes TO service_role;
ALTER TABLE public.mistakes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own mistakes" ON public.mistakes FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.study_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  task_date date NOT NULL,
  skill text NOT NULL,
  title text NOT NULL,
  minutes int NOT NULL DEFAULT 15,
  done boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.study_tasks TO authenticated;
GRANT ALL ON public.study_tasks TO service_role;
ALTER TABLE public.study_tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own tasks" ON public.study_tasks FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX ON public.study_tasks (user_id, task_date);