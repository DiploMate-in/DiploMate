-- Add bundle_price column to subjects table
ALTER TABLE public.subjects ADD COLUMN IF NOT EXISTS bundle_price NUMERIC;

-- Create a function to calculate total content value for a subject
CREATE OR REPLACE FUNCTION public.get_subject_total_value(subject_uuid UUID)
RETURNS NUMERIC
LANGUAGE sql
STABLE
AS $$
  SELECT COALESCE(SUM(price), 0)
  FROM public.content_items
  WHERE subject_id = subject_uuid
  AND is_published = true;
$$;
