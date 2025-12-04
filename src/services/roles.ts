import { supabase } from '@/integrations/supabase/client';

export type AppRole = 'admin' | 'moderator' | 'user';

export async function hasRole(userId: string, role: AppRole): Promise<boolean> {
  try {
    // Try using the RPC function first (more secure/performant if set up)
    const { data, error } = await supabase.rpc('has_role', {
      _user_id: userId,
      _role: role,
    });

    if (!error && typeof data === 'boolean') {
      return data;
    }

    // Fallback to direct query if RPC fails or isn't available
    const { data: roleData, error: roleError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .eq('role', role)
      .maybeSingle();

    if (roleError) {
      console.error('Error checking role:', roleError);
      return false;
    }

    return !!roleData;
  } catch (error) {
    console.error('Unexpected error checking role:', error);
    return false;
  }
}
