export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      community_posts: {
        Row: {
          activity_type: string
          created_at: string
          description: string | null
          id: string
          interest_tags: string[] | null
          title: string
          user_id: string
        }
        Insert: {
          activity_type: string
          created_at?: string
          description?: string | null
          id?: string
          interest_tags?: string[] | null
          title: string
          user_id: string
        }
        Update: {
          activity_type?: string
          created_at?: string
          description?: string | null
          id?: string
          interest_tags?: string[] | null
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_posts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      grades: {
        Row: {
          academic_year: string | null
          course_code: string | null
          course_name: string
          created_at: string | null
          credits: number | null
          grade: string | null
          id: string
          percentage: number | null
          semester: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          academic_year?: string | null
          course_code?: string | null
          course_name: string
          created_at?: string | null
          credits?: number | null
          grade?: string | null
          id?: string
          percentage?: number | null
          semester?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          academic_year?: string | null
          course_code?: string | null
          course_name?: string
          created_at?: string | null
          credits?: number | null
          grade?: string | null
          id?: string
          percentage?: number | null
          semester?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "grades_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      marketplace_items: {
        Row: {
          created_at: string
          description: string | null
          id: string
          image_urls: string[] | null
          price: number
          seller_id: string
          title: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          image_urls?: string[] | null
          price: number
          seller_id: string
          title: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          image_urls?: string[] | null
          price?: number
          seller_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_items_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          academic_year: Database["public"]["Enums"]["academic_year"] | null
          avatar_url: string | null
          college_name: string | null
          created_at: string | null
          email: string
          first_name: string
          id: string
          interests: string[] | null
          is_verified: boolean | null
          last_name: string
          major: string | null
          updated_at: string | null
          verification_document_url: string | null
        }
        Insert: {
          academic_year?: Database["public"]["Enums"]["academic_year"] | null
          avatar_url?: string | null
          college_name?: string | null
          created_at?: string | null
          email: string
          first_name: string
          id: string
          interests?: string[] | null
          is_verified?: boolean | null
          last_name: string
          major?: string | null
          updated_at?: string | null
          verification_document_url?: string | null
        }
        Update: {
          academic_year?: Database["public"]["Enums"]["academic_year"] | null
          avatar_url?: string | null
          college_name?: string | null
          created_at?: string | null
          email?: string
          first_name?: string
          id?: string
          interests?: string[] | null
          is_verified?: boolean | null
          last_name?: string
          major?: string | null
          updated_at?: string | null
          verification_document_url?: string | null
        }
        Relationships: []
      }
      timetable_entries: {
        Row: {
          academic_year: string | null
          course_code: string | null
          course_name: string
          created_at: string | null
          day_of_week: number | null
          end_time: string
          id: string
          instructor: string | null
          location: string | null
          semester: string | null
          start_time: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          academic_year?: string | null
          course_code?: string | null
          course_name: string
          created_at?: string | null
          day_of_week?: number | null
          end_time: string
          id?: string
          instructor?: string | null
          location?: string | null
          semester?: string | null
          start_time: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          academic_year?: string | null
          course_code?: string | null
          course_name?: string
          created_at?: string | null
          day_of_week?: number | null
          end_time?: string
          id?: string
          instructor?: string | null
          location?: string | null
          semester?: string | null
          start_time?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "timetable_entries_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      academic_year: "freshman" | "sophomore" | "junior" | "senior" | "graduate"
      activity_type: "study" | "social" | "sports" | "events" | "other"
      item_category:
        | "books"
        | "electronics"
        | "clothes"
        | "furniture"
        | "sports"
        | "other"
      item_condition: "new" | "like_new" | "good" | "fair" | "poor"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      academic_year: ["freshman", "sophomore", "junior", "senior", "graduate"],
      activity_type: ["study", "social", "sports", "events", "other"],
      item_category: [
        "books",
        "electronics",
        "clothes",
        "furniture",
        "sports",
        "other",
      ],
      item_condition: ["new", "like_new", "good", "fair", "poor"],
    },
  },
} as const
