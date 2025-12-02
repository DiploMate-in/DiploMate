-- Add schemes enum
CREATE TYPE public.scheme_type AS ENUM ('K', 'I');

-- Create subjects table for organizing study materials
CREATE TABLE public.subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  code TEXT NOT NULL,
  department_id UUID REFERENCES public.departments(id) ON DELETE CASCADE NOT NULL,
  semester_id UUID REFERENCES public.semesters(id) ON DELETE CASCADE NOT NULL,
  scheme scheme_type NOT NULL DEFAULT 'K',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(code, department_id, semester_id, scheme)
);

-- Enable RLS on subjects
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;

-- RLS policies for subjects
CREATE POLICY "Anyone can view subjects" ON public.subjects FOR SELECT USING (true);
CREATE POLICY "Admins can manage subjects" ON public.subjects FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Add new columns to content_items
ALTER TABLE public.content_items 
  ADD COLUMN IF NOT EXISTS subject_id UUID REFERENCES public.subjects(id),
  ADD COLUMN IF NOT EXISTS scheme scheme_type,
  ADD COLUMN IF NOT EXISTS subject_name TEXT,
  ADD COLUMN IF NOT EXISTS subject_code TEXT;

-- Update content_items type to allow new types
-- Types: vvimp, notes, imp_questions, pyq, lab_manuals, model_answers, microproject, capstone, custom_build

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_content_items_type ON public.content_items(type);
CREATE INDEX IF NOT EXISTS idx_content_items_subject ON public.content_items(subject_id);
CREATE INDEX IF NOT EXISTS idx_content_items_scheme ON public.content_items(scheme);
CREATE INDEX IF NOT EXISTS idx_subjects_department ON public.subjects(department_id);
CREATE INDEX IF NOT EXISTS idx_subjects_semester ON public.subjects(semester_id);