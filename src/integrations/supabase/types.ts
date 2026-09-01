export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5";
  };
  public: {
    Tables: {
      diary_entries: {
        Row: {
          content: string;
          created_at: string;
          entry_date: string;
          entry_time: string | null;
          id: string;
          is_favorite: boolean;
          is_locked: boolean;
          mood: string | null;
          mood_score: number | null;
          reflection_bad: string | null;
          reflection_change: string | null;
          reflection_proud: string | null;
          reflection_well: string | null;
          title: string | null;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          content?: string;
          created_at?: string;
          entry_date: string;
          entry_time?: string | null;
          id?: string;
          is_favorite?: boolean;
          is_locked?: boolean;
          mood?: string | null;
          mood_score?: number | null;
          reflection_bad?: string | null;
          reflection_change?: string | null;
          reflection_proud?: string | null;
          reflection_well?: string | null;
          title?: string | null;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          content?: string;
          created_at?: string;
          entry_date?: string;
          entry_time?: string | null;
          id?: string;
          is_favorite?: boolean;
          is_locked?: boolean;
          mood?: string | null;
          mood_score?: number | null;
          reflection_bad?: string | null;
          reflection_change?: string | null;
          reflection_proud?: string | null;
          reflection_well?: string | null;
          title?: string | null;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      entry_attachments: {
        Row: {
          created_at: string;
          entry_id: string;
          file_name: string;
          file_path: string;
          file_size: number;
          file_type: string;
          id: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          entry_id: string;
          file_name: string;
          file_path: string;
          file_size?: number;
          file_type: string;
          id?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          entry_id?: string;
          file_name?: string;
          file_path?: string;
          file_size?: number;
          file_type?: string;
          id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "entry_attachments_entry_id_fkey";
            columns: ["entry_id"];
            isOneToOne: false;
            referencedRelation: "diary_entries";
            referencedColumns: ["id"];
          },
        ];
      };
      entry_tags: {
        Row: {
          created_at: string;
          entry_id: string;
          id: string;
          tag: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          entry_id: string;
          id?: string;
          tag: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          entry_id?: string;
          id?: string;
          tag?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "entry_tags_entry_id_fkey";
            columns: ["entry_id"];
            isOneToOne: false;
            referencedRelation: "diary_entries";
            referencedColumns: ["id"];
          },
        ];
      };
      gratitude_items: {
        Row: {
          content: string;
          created_at: string;
          entry_id: string;
          id: string;
          position: number;
          user_id: string;
        };
        Insert: {
          content: string;
          created_at?: string;
          entry_id: string;
          id?: string;
          position?: number;
          user_id: string;
        };
        Update: {
          content?: string;
          created_at?: string;
          entry_id?: string;
          id?: string;
          position?: number;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "gratitude_items_entry_id_fkey";
            columns: ["entry_id"];
            isOneToOne: false;
            referencedRelation: "diary_entries";
            referencedColumns: ["id"];
          },
        ];
      };
      journal_prompts: {
        Row: {
          active: boolean;
          category: string;
          created_at: string;
          id: string;
          prompt: string;
        };
        Insert: {
          active?: boolean;
          category?: string;
          created_at?: string;
          id?: string;
          prompt: string;
        };
        Update: {
          active?: boolean;
          category?: string;
          created_at?: string;
          id?: string;
          prompt?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          created_at: string;
          display_name: string | null;
          id: string;
          line_spacing: string;
          onboarded: boolean;
          preferred_font: string;
          preferred_theme: string;
          purposes: string[];
          reminder_enabled: boolean;
          reminder_time: string | null;
          show_prompts: boolean;
          timezone: string;
          updated_at: string;
          writing_size: string;
        };
        Insert: {
          avatar_url?: string | null;
          created_at?: string;
          display_name?: string | null;
          id: string;
          line_spacing?: string;
          onboarded?: boolean;
          preferred_font?: string;
          preferred_theme?: string;
          purposes?: string[];
          reminder_enabled?: boolean;
          reminder_time?: string | null;
          show_prompts?: boolean;
          timezone?: string;
          updated_at?: string;
          writing_size?: string;
        };
        Update: {
          avatar_url?: string | null;
          created_at?: string;
          display_name?: string | null;
          id?: string;
          line_spacing?: string;
          onboarded?: boolean;
          preferred_font?: string;
          preferred_theme?: string;
          purposes?: string[];
          reminder_enabled?: boolean;
          reminder_time?: string | null;
          show_prompts?: boolean;
          timezone?: string;
          updated_at?: string;
          writing_size?: string;
        };
        Relationships: [];
      };
      tasks: {
        Row: {
          completed: boolean;
          completed_at: string | null;
          created_at: string;
          description: string | null;
          due_time: string | null;
          id: string;
          position: number;
          priority: string;
          task_date: string;
          title: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          completed?: boolean;
          completed_at?: string | null;
          created_at?: string;
          description?: string | null;
          due_time?: string | null;
          id?: string;
          position?: number;
          priority?: string;
          task_date?: string;
          title: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          completed?: boolean;
          completed_at?: string | null;
          created_at?: string;
          description?: string | null;
          due_time?: string | null;
          id?: string;
          position?: number;
          priority?: string;
          task_date?: string;
          title?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    keyof DefaultSchema["Enums"] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    keyof DefaultSchema["CompositeTypes"] | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
