export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      diary_entries: {
        Row: {
          content: string | null
          created_at: string | null
          entry_date: string | null
          entry_time: string | null
          id: string | null
          is_favorite: boolean | null
          is_locked: boolean | null
          mood: string | null
          mood_score: number | null
          reflection_bad: string | null
          reflection_change: string | null
          reflection_proud: string | null
          reflection_well: string | null
          title: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          entry_date?: string | null
          entry_time?: string | null
          id?: string | null
          is_favorite?: boolean | null
          is_locked?: boolean | null
          mood?: string | null
          mood_score?: number | null
          reflection_bad?: string | null
          reflection_change?: string | null
          reflection_proud?: string | null
          reflection_well?: string | null
          title?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          entry_date?: string | null
          entry_time?: string | null
          id?: string | null
          is_favorite?: boolean | null
          is_locked?: boolean | null
          mood?: string | null
          mood_score?: number | null
          reflection_bad?: string | null
          reflection_change?: string | null
          reflection_proud?: string | null
          reflection_well?: string | null
          title?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      entry_attachments: {
        Row: {
          created_at: string | null
          entry_id: string | null
          file_name: string | null
          file_path: string | null
          file_size: number | null
          file_type: string | null
          id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          entry_id?: string | null
          file_name?: string | null
          file_path?: string | null
          file_size?: number | null
          file_type?: string | null
          id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          entry_id?: string | null
          file_name?: string | null
          file_path?: string | null
          file_size?: number | null
          file_type?: string | null
          id?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      entry_tags: {
        Row: {
          created_at: string | null
          entry_id: string | null
          id: string | null
          tag: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          entry_id?: string | null
          id?: string | null
          tag?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          entry_id?: string | null
          id?: string | null
          tag?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      gratitude_items: {
        Row: {
          content: string | null
          created_at: string | null
          entry_id: string | null
          id: string | null
          position: number | null
          user_id: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          entry_id?: string | null
          id?: string | null
          position?: number | null
          user_id?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          entry_id?: string | null
          id?: string | null
          position?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      journal_prompt: {
        Row: {
          active: boolean | null
          category: string | null
          created_at: string | null
          id: string | null
          prompt: string | null
        }
        Insert: {
          active?: boolean | null
          category?: string | null
          created_at?: string | null
          id?: string | null
          prompt?: string | null
        }
        Update: {
          active?: boolean | null
          category?: string | null
          created_at?: string | null
          id?: string | null
          prompt?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          display_name: string | null
          id: string | null
          line_spacing: string | null
          onboarded: boolean | null
          preferred_font: string | null
          preferred_theme: string | null
          purposes: Json | null
          reminder_enabled: boolean | null
          reminder_time: string | null
          show_prompts: boolean | null
          timezone: string | null
          updated_at: string | null
          writing_size: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          display_name?: string | null
          id?: string | null
          line_spacing?: string | null
          onboarded?: boolean | null
          preferred_font?: string | null
          preferred_theme?: string | null
          purposes?: Json | null
          reminder_enabled?: boolean | null
          reminder_time?: string | null
          show_prompts?: boolean | null
          timezone?: string | null
          updated_at?: string | null
          writing_size?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          display_name?: string | null
          id?: string | null
          line_spacing?: string | null
          onboarded?: boolean | null
          preferred_font?: string | null
          preferred_theme?: string | null
          purposes?: Json | null
          reminder_enabled?: boolean | null
          reminder_time?: string | null
          show_prompts?: boolean | null
          timezone?: string | null
          updated_at?: string | null
          writing_size?: string | null
        }
        Relationships: []
      }
      "task export": {
        Row: {
          completed: boolean | null
          completed_at: string | null
          created_at: string | null
          description: string | null
          due_time: string | null
          id: string | null
          position: number | null
          priority: string | null
          task_date: string | null
          title: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          description?: string | null
          due_time?: string | null
          id?: string | null
          position?: number | null
          priority?: string | null
          task_date?: string | null
          title?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          description?: string | null
          due_time?: string | null
          id?: string | null
          position?: number | null
          priority?: string | null
          task_date?: string | null
          title?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
