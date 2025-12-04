export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '13.0.5';
  };
  public: {
    Tables: {
      content_items: {
        Row: {
          created_at: string;
          department_id: string;
          description: string | null;
          downloads_allowed: number;
          file_format: string | null;
          file_size: string | null;
          file_url: string | null;
          id: string;
          is_published: boolean | null;
          original_price: number | null;
          preview_images: string[] | null;
          price: number;
          rating: number | null;
          review_count: number | null;
          scheme: Database['public']['Enums']['scheme_type'] | null;
          semester_id: string;
          subject_code: string | null;
          subject_id: string | null;
          subject_name: string | null;
          tags: string[] | null;
          title: string;
          type: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          department_id: string;
          description?: string | null;
          downloads_allowed?: number;
          file_format?: string | null;
          file_size?: string | null;
          file_url?: string | null;
          id?: string;
          is_published?: boolean | null;
          original_price?: number | null;
          preview_images?: string[] | null;
          price?: number;
          rating?: number | null;
          review_count?: number | null;
          scheme?: Database['public']['Enums']['scheme_type'] | null;
          semester_id: string;
          subject_code?: string | null;
          subject_id?: string | null;
          subject_name?: string | null;
          tags?: string[] | null;
          title: string;
          type: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          department_id?: string;
          description?: string | null;
          downloads_allowed?: number;
          file_format?: string | null;
          file_size?: string | null;
          file_url?: string | null;
          id?: string;
          is_published?: boolean | null;
          original_price?: number | null;
          preview_images?: string[] | null;
          price?: number;
          rating?: number | null;
          review_count?: number | null;
          scheme?: Database['public']['Enums']['scheme_type'] | null;
          semester_id?: string;
          subject_code?: string | null;
          subject_id?: string | null;
          subject_name?: string | null;
          tags?: string[] | null;
          title?: string;
          type?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'content_items_department_id_fkey';
            columns: ['department_id'];
            isOneToOne: false;
            referencedRelation: 'departments';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'content_items_semester_id_fkey';
            columns: ['semester_id'];
            isOneToOne: false;
            referencedRelation: 'semesters';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'content_items_subject_id_fkey';
            columns: ['subject_id'];
            isOneToOne: false;
            referencedRelation: 'subjects';
            referencedColumns: ['id'];
          },
        ];
      };
      coupons: {
        Row: {
          code: string;
          created_at: string;
          discount_type: string;
          discount_value: number;
          id: string;
          is_active: boolean | null;
          max_uses: number | null;
          updated_at: string;
          used_count: number | null;
          valid_from: string;
          valid_to: string;
        };
        Insert: {
          code: string;
          created_at?: string;
          discount_type: string;
          discount_value: number;
          id?: string;
          is_active?: boolean | null;
          max_uses?: number | null;
          updated_at?: string;
          used_count?: number | null;
          valid_from?: string;
          valid_to: string;
        };
        Update: {
          code?: string;
          created_at?: string;
          discount_type?: string;
          discount_value?: number;
          id?: string;
          is_active?: boolean | null;
          max_uses?: number | null;
          updated_at?: string;
          used_count?: number | null;
          valid_from?: string;
          valid_to?: string;
        };
        Relationships: [];
      };
      departments: {
        Row: {
          code: string;
          color: string | null;
          created_at: string;
          icon: string | null;
          id: string;
          is_active: boolean | null;
          name: string;
        };
        Insert: {
          code: string;
          color?: string | null;
          created_at?: string;
          icon?: string | null;
          id?: string;
          is_active?: boolean | null;
          name: string;
        };
        Update: {
          code?: string;
          color?: string | null;
          created_at?: string;
          icon?: string | null;
          id?: string;
          is_active?: boolean | null;
          name?: string;
        };
        Relationships: [];
      };
      download_logs: {
        Row: {
          content_item_id: string;
          downloaded_at: string;
          id: string;
          ip_hash: string | null;
          user_id: string;
        };
        Insert: {
          content_item_id: string;
          downloaded_at?: string;
          id?: string;
          ip_hash?: string | null;
          user_id: string;
        };
        Update: {
          content_item_id?: string;
          downloaded_at?: string;
          id?: string;
          ip_hash?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'download_logs_content_item_id_fkey';
            columns: ['content_item_id'];
            isOneToOne: false;
            referencedRelation: 'content_items';
            referencedColumns: ['id'];
          },
        ];
      };
      kv_store_def08d54: {
        Row: {
          key: string;
          value: Json;
        };
        Insert: {
          key: string;
          value: Json;
        };
        Update: {
          key?: string;
          value?: Json;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          created_at: string;
          email: string | null;
          id: string;
          is_blocked: boolean | null;
          name: string | null;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          email?: string | null;
          id: string;
          is_blocked?: boolean | null;
          name?: string | null;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          email?: string | null;
          id?: string;
          is_blocked?: boolean | null;
          name?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      purchases: {
        Row: {
          content_item_id: string;
          downloads_remaining: number;
          id: string;
          payment_provider: string | null;
          price: number;
          purchased_at: string;
          status: string;
          user_id: string;
        };
        Insert: {
          content_item_id: string;
          downloads_remaining?: number;
          id?: string;
          payment_provider?: string | null;
          price: number;
          purchased_at?: string;
          status?: string;
          user_id: string;
        };
        Update: {
          content_item_id?: string;
          downloads_remaining?: number;
          id?: string;
          payment_provider?: string | null;
          price?: number;
          purchased_at?: string;
          status?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'purchases_content_item_id_fkey';
            columns: ['content_item_id'];
            isOneToOne: false;
            referencedRelation: 'content_items';
            referencedColumns: ['id'];
          },
        ];
      };
      semesters: {
        Row: {
          created_at: string;
          department_id: string;
          id: string;
          name: string;
          number: number;
          order_index: number | null;
        };
        Insert: {
          created_at?: string;
          department_id: string;
          id?: string;
          name: string;
          number: number;
          order_index?: number | null;
        };
        Update: {
          created_at?: string;
          department_id?: string;
          id?: string;
          name?: string;
          number?: number;
          order_index?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: 'semesters_department_id_fkey';
            columns: ['department_id'];
            isOneToOne: false;
            referencedRelation: 'departments';
            referencedColumns: ['id'];
          },
        ];
      };
      settings: {
        Row: {
          created_at: string;
          global_download_limit: number | null;
          id: string;
          privacy_url: string | null;
          refund_policy_url: string | null;
          terms_url: string | null;
          updated_at: string;
          watermark_enabled: boolean | null;
          whatsapp_group_url: string | null;
          whatsapp_popup_delay_seconds: number | null;
          whatsapp_popup_enabled: boolean | null;
        };
        Insert: {
          created_at?: string;
          global_download_limit?: number | null;
          id?: string;
          privacy_url?: string | null;
          refund_policy_url?: string | null;
          terms_url?: string | null;
          updated_at?: string;
          watermark_enabled?: boolean | null;
          whatsapp_group_url?: string | null;
          whatsapp_popup_delay_seconds?: number | null;
          whatsapp_popup_enabled?: boolean | null;
        };
        Update: {
          created_at?: string;
          global_download_limit?: number | null;
          id?: string;
          privacy_url?: string | null;
          refund_policy_url?: string | null;
          terms_url?: string | null;
          updated_at?: string;
          watermark_enabled?: boolean | null;
          whatsapp_group_url?: string | null;
          whatsapp_popup_delay_seconds?: number | null;
          whatsapp_popup_enabled?: boolean | null;
        };
        Relationships: [];
      };
      subjects: {
        Row: {
          code: string;
          created_at: string;
          department_id: string;
          id: string;
          is_active: boolean | null;
          name: string;
          scheme: Database['public']['Enums']['scheme_type'];
          semester_id: string;
        };
        Insert: {
          code: string;
          created_at?: string;
          department_id: string;
          id?: string;
          is_active?: boolean | null;
          name: string;
          scheme?: Database['public']['Enums']['scheme_type'];
          semester_id: string;
        };
        Update: {
          code?: string;
          created_at?: string;
          department_id?: string;
          id?: string;
          is_active?: boolean | null;
          name?: string;
          scheme?: Database['public']['Enums']['scheme_type'];
          semester_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'subjects_department_id_fkey';
            columns: ['department_id'];
            isOneToOne: false;
            referencedRelation: 'departments';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'subjects_semester_id_fkey';
            columns: ['semester_id'];
            isOneToOne: false;
            referencedRelation: 'semesters';
            referencedColumns: ['id'];
          },
        ];
      };
      support_tickets: {
        Row: {
          created_at: string;
          email: string;
          id: string;
          message: string;
          status: string;
          subject: string;
          updated_at: string;
          user_id: string | null;
        };
        Insert: {
          created_at?: string;
          email: string;
          id?: string;
          message: string;
          status?: string;
          subject: string;
          updated_at?: string;
          user_id?: string | null;
        };
        Update: {
          created_at?: string;
          email?: string;
          id?: string;
          message?: string;
          status?: string;
          subject?: string;
          updated_at?: string;
          user_id?: string | null;
        };
        Relationships: [];
      };
      user_roles: {
        Row: {
          created_at: string;
          id: string;
          role: Database['public']['Enums']['app_role'];
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          role: Database['public']['Enums']['app_role'];
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          role?: Database['public']['Enums']['app_role'];
          user_id?: string;
        };
        Relationships: [];
      };
      wishlist: {
        Row: {
          content_item_id: string;
          created_at: string;
          id: string;
          user_id: string;
        };
        Insert: {
          content_item_id: string;
          created_at?: string;
          id?: string;
          user_id: string;
        };
        Update: {
          content_item_id?: string;
          created_at?: string;
          id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'wishlist_content_item_id_fkey';
            columns: ['content_item_id'];
            isOneToOne: false;
            referencedRelation: 'content_items';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      has_role: {
        Args: {
          _role: Database['public']['Enums']['app_role'];
          _user_id: string;
        };
        Returns: boolean;
      };
    };
    Enums: {
      app_role: 'admin' | 'moderator' | 'user';
      scheme_type: 'K' | 'I';
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] & DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      app_role: ['admin', 'moderator', 'user'],
      scheme_type: ['K', 'I'],
    },
  },
} as const;
