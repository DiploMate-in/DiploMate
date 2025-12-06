import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { SupabaseClient } from '@supabase/supabase-js';

export function useSystemSetting(key: string, defaultValue: string = '') {
  const [value, setValue] = useState<string>(defaultValue);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchSetting = async () => {
      try {
        // Explicitly cast client to ensure latest types are used
        const client = supabase as SupabaseClient<Database>;
        
        const { data, error } = await client
          .from('system_settings')
          .select('value')
          .eq('key', key)
          .maybeSingle();

        if (error) {
          console.error(`Error fetching setting ${key}:`, error);
          return;
        }

        if (mounted && data) {
          setValue(data.value || defaultValue);
        }
      } catch (err) {
        console.error(`Unexpected error fetching setting ${key}:`, err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchSetting();

    // Real-time subscription
    const channel = supabase
      .channel(`public:system_settings:${key}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'system_settings',
          filter: `key=eq.${key}`,
        },
        (payload) => {
          if (mounted && payload.new && 'value' in payload.new) {
            setValue((payload.new as any).value || defaultValue);
          }
        }
      )
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(channel);
    };
  }, [key, defaultValue]);

  return { value, loading };
}
