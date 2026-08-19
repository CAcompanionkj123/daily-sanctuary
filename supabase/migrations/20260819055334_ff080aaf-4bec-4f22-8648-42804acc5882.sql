CREATE OR REPLACE FUNCTION public.set_updated_at() RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$ LANGUAGE plpgsql SET search_path = public;

CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  timezone TEXT NOT NULL DEFAULT 'UTC',
  preferred_theme TEXT NOT NULL DEFAULT 'system',
  preferred_font TEXT NOT NULL DEFAULT 'serif',
  writing_size TEXT NOT NULL DEFAULT 'medium',
  line_spacing TEXT NOT NULL DEFAULT 'relaxed',
  show_prompts BOOLEAN NOT NULL DEFAULT true,
  reminder_enabled BOOLEAN NOT NULL DEFAULT false,
  reminder_time TIME,
  purposes TEXT[] NOT NULL DEFAULT '{}',
  onboarded BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_delete_own" ON public.profiles FOR DELETE TO authenticated USING (auth.uid() = id);
CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)))
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END; $$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE TABLE public.diary_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  entry_date DATE NOT NULL,
  entry_time TIME,
  title TEXT,
  content TEXT NOT NULL DEFAULT '',
  mood TEXT,
  mood_score INTEGER,
  is_favorite BOOLEAN NOT NULL DEFAULT false,
  is_locked BOOLEAN NOT NULL DEFAULT false,
  reflection_well TEXT,
  reflection_bad TEXT,
  reflection_change TEXT,
  reflection_proud TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT diary_entries_user_date_unique UNIQUE (user_id, entry_date)
);
CREATE INDEX diary_entries_user_idx ON public.diary_entries(user_id);
CREATE INDEX diary_entries_date_idx ON public.diary_entries(user_id, entry_date DESC);
CREATE INDEX diary_entries_created_idx ON public.diary_entries(created_at DESC);
CREATE INDEX diary_entries_updated_idx ON public.diary_entries(updated_at DESC);
CREATE INDEX diary_entries_fts_idx ON public.diary_entries USING gin (to_tsvector('english', coalesce(title,'') || ' ' || coalesce(content,'')));
GRANT SELECT, INSERT, UPDATE, DELETE ON public.diary_entries TO authenticated;
GRANT ALL ON public.diary_entries TO service_role;
ALTER TABLE public.diary_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "entries_select_own" ON public.diary_entries FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "entries_insert_own" ON public.diary_entries FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "entries_update_own" ON public.diary_entries FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "entries_delete_own" ON public.diary_entries FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE TRIGGER diary_entries_updated_at BEFORE UPDATE ON public.diary_entries FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  task_date DATE NOT NULL DEFAULT (now()::date),
  due_time TIME,
  completed BOOLEAN NOT NULL DEFAULT false,
  completed_at TIMESTAMPTZ,
  priority TEXT NOT NULL DEFAULT 'medium',
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX tasks_user_date_idx ON public.tasks(user_id, task_date);
CREATE INDEX tasks_user_completed_idx ON public.tasks(user_id, completed);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.tasks TO authenticated;
GRANT ALL ON public.tasks TO service_role;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tasks_select_own" ON public.tasks FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "tasks_insert_own" ON public.tasks FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "tasks_update_own" ON public.tasks FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "tasks_delete_own" ON public.tasks FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE TRIGGER tasks_updated_at BEFORE UPDATE ON public.tasks FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.gratitude_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  entry_id UUID NOT NULL REFERENCES public.diary_entries(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX gratitude_entry_idx ON public.gratitude_items(entry_id);
CREATE INDEX gratitude_user_idx ON public.gratitude_items(user_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.gratitude_items TO authenticated;
GRANT ALL ON public.gratitude_items TO service_role;
ALTER TABLE public.gratitude_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "gratitude_select_own" ON public.gratitude_items FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "gratitude_insert_own" ON public.gratitude_items FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id AND EXISTS (SELECT 1 FROM public.diary_entries e WHERE e.id = entry_id AND e.user_id = auth.uid()));
CREATE POLICY "gratitude_update_own" ON public.gratitude_items FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "gratitude_delete_own" ON public.gratitude_items FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE TABLE public.entry_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  entry_id UUID NOT NULL REFERENCES public.diary_entries(id) ON DELETE CASCADE,
  tag TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT entry_tags_unique UNIQUE (entry_id, tag)
);
CREATE INDEX entry_tags_user_idx ON public.entry_tags(user_id, tag);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.entry_tags TO authenticated;
GRANT ALL ON public.entry_tags TO service_role;
ALTER TABLE public.entry_tags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tags_select_own" ON public.entry_tags FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "tags_insert_own" ON public.entry_tags FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id AND EXISTS (SELECT 1 FROM public.diary_entries e WHERE e.id = entry_id AND e.user_id = auth.uid()));
CREATE POLICY "tags_update_own" ON public.entry_tags FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "tags_delete_own" ON public.entry_tags FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE TABLE public.entry_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  entry_id UUID NOT NULL REFERENCES public.diary_entries(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size BIGINT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX attachments_entry_idx ON public.entry_attachments(entry_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.entry_attachments TO authenticated;
GRANT ALL ON public.entry_attachments TO service_role;
ALTER TABLE public.entry_attachments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "attach_select_own" ON public.entry_attachments FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "attach_insert_own" ON public.entry_attachments FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id AND EXISTS (SELECT 1 FROM public.diary_entries e WHERE e.id = entry_id AND e.user_id = auth.uid()));
CREATE POLICY "attach_update_own" ON public.entry_attachments FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "attach_delete_own" ON public.entry_attachments FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE TABLE public.journal_prompts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prompt TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'general',
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.journal_prompts TO authenticated;
GRANT ALL ON public.journal_prompts TO service_role;
ALTER TABLE public.journal_prompts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "prompts_read" ON public.journal_prompts FOR SELECT TO authenticated USING (active);
INSERT INTO public.journal_prompts (prompt, category) VALUES
('What happened today?', 'general'),
('What am I thinking about?', 'thoughts'),
('What made me happy?', 'gratitude'),
('What challenged me?', 'growth'),
('What did I learn?', 'growth'),
('What am I grateful for?', 'gratitude'),
('What do I want tomorrow to look like?', 'planning'),
('Who did I appreciate today, and why?', 'gratitude'),
('What small thing went better than expected?', 'general'),
('What is taking up space in my mind right now?', 'thoughts'),
('What would make this week feel complete?', 'planning'),
('What am I quietly proud of?', 'growth'),
('What do I need to let go of?', 'thoughts'),
('Describe a moment from today in detail.', 'memories'),
('What is one goal I moved forward today?', 'goals');

CREATE POLICY "diary_media_select_own" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'diary-media' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "diary_media_insert_own" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'diary-media' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "diary_media_update_own" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'diary-media' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "diary_media_delete_own" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'diary-media' AND auth.uid()::text = (storage.foldername(name))[1]);