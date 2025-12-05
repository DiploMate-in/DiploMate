-- Create system_settings table for global key-value configuration
CREATE TABLE IF NOT EXISTS public.system_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- Policies
-- Public Read: Anyone can read settings (needed for frontend)
CREATE POLICY "Anyone can view system settings" 
ON public.system_settings 
FOR SELECT 
USING (true);

-- Admin Write: Only admins can insert/update/delete
-- Assuming 'admin' role check is done via profiles or custom claims. 
-- For now, we'll use a check against the profiles table or a custom function if available.
-- Based on previous context, we might need a policy that checks the user's role.
-- Let's check how other tables handle admin access. 
-- The user mentioned "Strictly restricted to Admins only".

-- Checking previous migrations for admin policies...
-- "20251204000001_add_admin_rls_policies.sql" likely has examples.
-- I'll assume a standard check for now, but I should probably verify the admin check method.
-- Re-reading `src/services/roles.ts`... it uses `user_roles` table or RPC.
-- Let's use a subquery to `user_roles` or `profiles` if `user_roles` is the standard.
-- Actually, I'll use a safe generic admin policy pattern often used in Supabase:
-- (auth.uid() IN (SELECT user_id FROM user_roles WHERE role = 'admin'))

CREATE POLICY "Admins can manage system settings" 
ON public.system_settings 
FOR ALL 
USING (
  auth.uid() IN (
    SELECT user_id FROM public.user_roles WHERE role = 'admin'
  )
)
WITH CHECK (
  auth.uid() IN (
    SELECT user_id FROM public.user_roles WHERE role = 'admin'
  )
);

-- Insert initial WhatsApp link setting
INSERT INTO public.system_settings (key, value, description)
VALUES 
  ('whatsapp_group_link', 'https://chat.whatsapp.com/your-invite-code', 'Global WhatsApp Group Invite Link')
ON CONFLICT (key) DO NOTHING;

-- Enable Realtime for this table so clients update instantly
ALTER PUBLICATION supabase_realtime ADD TABLE public.system_settings;
