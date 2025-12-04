-- Allow admins to view all purchases
CREATE POLICY "Admins can view all purchases" ON public.purchases
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );

-- Allow admins to view all wishlists
CREATE POLICY "Admins can view all wishlists" ON public.wishlist
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );
