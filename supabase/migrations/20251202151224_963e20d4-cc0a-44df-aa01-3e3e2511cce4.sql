-- Create app_role enum for admin roles
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- Create user_roles table for role management
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Create profiles table for user information
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  email TEXT,
  is_blocked BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add isPublished to content_items if not exists
ALTER TABLE public.content_items ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT true;

-- Add isActive to departments
ALTER TABLE public.departments ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- Add order_index to semesters
ALTER TABLE public.semesters ADD COLUMN IF NOT EXISTS order_index INTEGER DEFAULT 1;

-- Create coupons table
CREATE TABLE public.coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'flat')),
  discount_value NUMERIC NOT NULL,
  max_uses INTEGER DEFAULT 100,
  used_count INTEGER DEFAULT 0,
  valid_from TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  valid_to TIMESTAMP WITH TIME ZONE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create support_tickets table
CREATE TABLE public.support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in-progress', 'resolved')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create settings table (singleton)
CREATE TABLE public.settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  whatsapp_group_url TEXT,
  whatsapp_popup_enabled BOOLEAN DEFAULT true,
  whatsapp_popup_delay_seconds INTEGER DEFAULT 5,
  global_download_limit INTEGER DEFAULT 3,
  watermark_enabled BOOLEAN DEFAULT false,
  terms_url TEXT,
  privacy_url TEXT,
  refund_policy_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert default settings row
INSERT INTO public.settings (id) VALUES (gen_random_uuid());

-- Add payment_provider to purchases
ALTER TABLE public.purchases ADD COLUMN IF NOT EXISTS payment_provider TEXT DEFAULT 'test';

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS policies for user_roles
CREATE POLICY "Admins can view all roles" ON public.user_roles
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage roles" ON public.user_roles
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS policies for profiles
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage profiles" ON public.profiles
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS policies for coupons (admin only)
CREATE POLICY "Admins can manage coupons" ON public.coupons
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can view active coupons" ON public.coupons
  FOR SELECT USING (is_active = true);

-- RLS policies for support_tickets
CREATE POLICY "Users can create tickets" ON public.support_tickets
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view own tickets" ON public.support_tickets
  FOR SELECT USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage tickets" ON public.support_tickets
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS policies for settings (admin only)
CREATE POLICY "Anyone can view settings" ON public.settings
  FOR SELECT USING (true);

CREATE POLICY "Admins can update settings" ON public.settings
  FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

-- Add admin policies for content_items
CREATE POLICY "Admins can manage content" ON public.content_items
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Add admin policies for departments
CREATE POLICY "Admins can manage departments" ON public.departments
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Add admin policies for semesters
CREATE POLICY "Admins can manage semesters" ON public.semesters
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Add admin policies for purchases (read-only for admins)
CREATE POLICY "Admins can view all purchases" ON public.purchases
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update purchases" ON public.purchases
  FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

-- Add admin policies for download_logs
CREATE POLICY "Admins can view all downloads" ON public.download_logs
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- Trigger to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email)
  VALUES (NEW.id, NEW.raw_user_meta_data ->> 'name', NEW.email);
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_coupons_updated_at BEFORE UPDATE ON public.coupons
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_support_tickets_updated_at BEFORE UPDATE ON public.support_tickets
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON public.settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();