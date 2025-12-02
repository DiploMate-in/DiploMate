-- Seed departments
INSERT INTO public.departments (name, code, color, icon, is_active) VALUES
  ('Artificial Intelligence & Machine Learning', 'aiml', '#3B82F6', 'Brain', true),
  ('Computer Engineering', 'co', '#10B981', 'Monitor', true),
  ('Mechanical Engineering', 'me', '#F59E0B', 'Cog', true),
  ('Civil Engineering', 'ce', '#8B5CF6', 'Building', true);

-- Seed semesters for each department
INSERT INTO public.semesters (name, number, department_id, order_index)
SELECT 
  'Semester ' || s.num,
  s.num,
  d.id,
  s.num
FROM public.departments d
CROSS JOIN (SELECT generate_series(1, 6) AS num) s;