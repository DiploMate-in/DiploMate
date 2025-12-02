-- Create departments table
CREATE TABLE public.departments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  icon TEXT,
  color TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create semesters table
CREATE TABLE public.semesters (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  department_id UUID NOT NULL REFERENCES public.departments(id) ON DELETE CASCADE,
  number INTEGER NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create content_items table
CREATE TABLE public.content_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('notes', 'microproject', 'capstone')),
  department_id UUID NOT NULL REFERENCES public.departments(id) ON DELETE CASCADE,
  semester_id UUID NOT NULL REFERENCES public.semesters(id) ON DELETE CASCADE,
  price INTEGER NOT NULL DEFAULT 0,
  original_price INTEGER,
  preview_images TEXT[] DEFAULT '{}',
  file_url TEXT,
  file_size TEXT,
  file_format TEXT,
  tags TEXT[] DEFAULT '{}',
  downloads_allowed INTEGER NOT NULL DEFAULT 3,
  rating NUMERIC(2,1) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create purchases table
CREATE TABLE public.purchases (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content_item_id UUID NOT NULL REFERENCES public.content_items(id) ON DELETE CASCADE,
  price INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'refunded')),
  downloads_remaining INTEGER NOT NULL DEFAULT 3,
  purchased_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create wishlist table
CREATE TABLE public.wishlist (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content_item_id UUID NOT NULL REFERENCES public.content_items(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, content_item_id)
);

-- Create download_logs table
CREATE TABLE public.download_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content_item_id UUID NOT NULL REFERENCES public.content_items(id) ON DELETE CASCADE,
  ip_hash TEXT,
  downloaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.semesters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.download_logs ENABLE ROW LEVEL SECURITY;

-- Public read access for departments, semesters, content_items
CREATE POLICY "Anyone can view departments" ON public.departments FOR SELECT USING (true);
CREATE POLICY "Anyone can view semesters" ON public.semesters FOR SELECT USING (true);
CREATE POLICY "Anyone can view content items" ON public.content_items FOR SELECT USING (true);

-- User-specific policies for purchases
CREATE POLICY "Users can view own purchases" ON public.purchases FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own purchases" ON public.purchases FOR INSERT WITH CHECK (auth.uid() = user_id);

-- User-specific policies for wishlist
CREATE POLICY "Users can view own wishlist" ON public.wishlist FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can add to own wishlist" ON public.wishlist FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can remove from own wishlist" ON public.wishlist FOR DELETE USING (auth.uid() = user_id);

-- User-specific policies for download_logs
CREATE POLICY "Users can view own downloads" ON public.download_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can log own downloads" ON public.download_logs FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX idx_content_items_department ON public.content_items(department_id);
CREATE INDEX idx_content_items_semester ON public.content_items(semester_id);
CREATE INDEX idx_content_items_type ON public.content_items(type);
CREATE INDEX idx_purchases_user ON public.purchases(user_id);
CREATE INDEX idx_wishlist_user ON public.wishlist(user_id);
CREATE INDEX idx_download_logs_user ON public.download_logs(user_id);