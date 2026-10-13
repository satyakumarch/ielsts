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
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      mistakes: {
        Row: {
          category: string
          correct_answer: string
          created_at: string
          explanation: string | null
          id: string
          question: string
          question_type: string | null
          skill: string
          status: string
          user_answer: string | null
          user_id: string
        }
        Insert: {
          category: string
          correct_answer: string
          created_at?: string
          explanation?: string | null
          id?: string
          question: string
          question_type?: string | null
          skill: string
          status?: string
          user_answer?: string | null
          user_id: string
        }
        Update: {
          category?: string
          correct_answer?: string
          created_at?: string
          explanation?: string | null
          id?: string
          question?: string
          question_type?: string | null
          skill?: string
          status?: string
          user_answer?: string | null
          user_id?: string
        }
        Relationships: []
      }
      practice_submissions: {
        Row: {
          band: number | null
          created_at: string
          feedback: Json
          id: string
          prompt: string
          response: string
          skill: string
          user_id: string
        }
        Insert: {
          band?: number | null
          created_at?: string
          feedback?: Json
          id?: string
          prompt: string
          response: string
          skill: string
          user_id: string
        }
        Update: {
          band?: number | null
          created_at?: string
          feedback?: Json
          id?: string
          prompt?: string
          response?: string
          skill?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          current_band: number | null
          daily_minutes: number | null
          display_name: string | null
          exam_type: string | null
          goal: string | null
          id: string
          last_activity: Json | null
          onboarded: boolean
          preferred_language: string | null
          schedule: string | null
          target_band: number | null
          test_date: string | null
          updated_at: string
          weak_skills: string[] | null
        }
        Insert: {
          created_at?: string
          current_band?: number | null
          daily_minutes?: number | null
          display_name?: string | null
          exam_type?: string | null
          goal?: string | null
          id: string
          last_activity?: Json | null
          onboarded?: boolean
          preferred_language?: string | null
          schedule?: string | null
          target_band?: number | null
          test_date?: string | null
          updated_at?: string
          weak_skills?: string[] | null
        }
        Update: {
          created_at?: string
          current_band?: number | null
          daily_minutes?: number | null
          display_name?: string | null
          exam_type?: string | null
          goal?: string | null
          id?: string
          last_activity?: Json | null
          onboarded?: boolean
          preferred_language?: string | null
          schedule?: string | null
          target_band?: number | null
          test_date?: string | null
          updated_at?: string
          weak_skills?: string[] | null
        }
        Relationships: []
      }
      reading_attempts: {
        Row: {
          answers: Json
          band: number | null
          by_type: Json
          correct: number
          created_at: string
          id: string
          mode: string
          scope: string
          seconds_spent: number
          test_id: string
          total: number
          user_id: string
        }
        Insert: {
          answers?: Json
          band?: number | null
          by_type?: Json
          correct: number
          created_at?: string
          id?: string
          mode: string
          scope?: string
          seconds_spent?: number
          test_id: string
          total: number
          user_id: string
        }
        Update: {
          answers?: Json
          band?: number | null
          by_type?: Json
          correct?: number
          created_at?: string
          id?: string
          mode?: string
          scope?: string
          seconds_spent?: number
          test_id?: string
          total?: number
          user_id?: string
        }
        Relationships: []
      }
      skill_scores: {
        Row: {
          band: number
          created_at: string
          id: string
          skill: string
          source: string
          user_id: string
        }
        Insert: {
          band: number
          created_at?: string
          id?: string
          skill: string
          source: string
          user_id: string
        }
        Update: {
          band?: number
          created_at?: string
          id?: string
          skill?: string
          source?: string
          user_id?: string
        }
        Relationships: []
      }
      study_tasks: {
        Row: {
          created_at: string
          done: boolean
          id: string
          minutes: number
          skill: string
          task_date: string
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string
          done?: boolean
          id?: string
          minutes?: number
          skill: string
          task_date: string
          title: string
          user_id: string
        }
        Update: {
          created_at?: string
          done?: boolean
          id?: string
          minutes?: number
          skill?: string
          task_date?: string
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      vocab_progress: {
        Row: {
          box: number
          due_at: string
          id: string
          updated_at: string
          user_id: string
          word: string
        }
        Insert: {
          box?: number
          due_at?: string
          id?: string
          updated_at?: string
          user_id: string
          word: string
        }
        Update: {
          box?: number
          due_at?: string
          id?: string
          updated_at?: string
          user_id?: string
          word?: string
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
