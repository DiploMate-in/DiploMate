-- Drop the old restrictive constraint
ALTER TABLE public.content_items DROP CONSTRAINT IF EXISTS content_items_type_check;

-- Add the new constraint with all supported types
ALTER TABLE public.content_items ADD CONSTRAINT content_items_type_check 
CHECK (type IN (
  'notes', 
  'microproject', 
  'capstone', 
  'vvimp', 
  'imp_questions', 
  'pyq', 
  'lab_manuals', 
  'model_answers', 
  'custom_build'
));
