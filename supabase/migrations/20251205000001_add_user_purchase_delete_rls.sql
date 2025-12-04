-- Allow users to delete their own purchases (if needed for cleanup/refunds)
CREATE POLICY "Users can delete own purchases" ON public.purchases
  FOR DELETE
  USING (auth.uid() = user_id);
