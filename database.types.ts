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
      bookings: {
        Row: {
          canceled_at: string | null
          canceled_by_profile_id: string | null
          cancellation_reason: string | null
          created_at: string | null
          created_by_profile_id: string
          end_time: string
          id: number
          metadata: Json | null
          price: number | null
          start_time: string
          status: Database["public"]["Enums"]["booking_status"]
          tutor_id: string
          type: Database["public"]["Enums"]["booking_type"]
          updated_at: string | null
        }
        Insert: {
          canceled_at?: string | null
          canceled_by_profile_id?: string | null
          cancellation_reason?: string | null
          created_at?: string | null
          created_by_profile_id: string
          end_time: string
          id?: number
          metadata?: Json | null
          price?: number | null
          start_time: string
          status?: Database["public"]["Enums"]["booking_status"]
          tutor_id: string
          type: Database["public"]["Enums"]["booking_type"]
          updated_at?: string | null
        }
        Update: {
          canceled_at?: string | null
          canceled_by_profile_id?: string | null
          cancellation_reason?: string | null
          created_at?: string | null
          created_by_profile_id?: string
          end_time?: string
          id?: number
          metadata?: Json | null
          price?: number | null
          start_time?: string
          status?: Database["public"]["Enums"]["booking_status"]
          tutor_id?: string
          type?: Database["public"]["Enums"]["booking_type"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_canceled_by_profile_id_fkey"
            columns: ["canceled_by_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_created_by_profile_id_fkey"
            columns: ["created_by_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_tutor_id_fkey"
            columns: ["tutor_id"]
            isOneToOne: false
            referencedRelation: "tutors"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          created_at: string | null
          from_profile_id: string | null
          id: number
          last_message: string | null
          last_message_at: string
          to_profile_id: string | null
        }
        Insert: {
          created_at?: string | null
          from_profile_id?: string | null
          id?: number
          last_message?: string | null
          last_message_at?: string
          to_profile_id?: string | null
        }
        Update: {
          created_at?: string | null
          from_profile_id?: string | null
          id?: number
          last_message?: string | null
          last_message_at?: string
          to_profile_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "conversations_from_profile_id_fkey"
            columns: ["from_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_to_profile_id_fkey"
            columns: ["to_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      levels: {
        Row: {
          id: number
          name: string
          subject_id: number
        }
        Insert: {
          id?: number
          name: string
          subject_id: number
        }
        Update: {
          id?: number
          name?: string
          subject_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "levels_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: Json
          conversation_id: number | null
          created_at: string | null
          from_profile_id: string | null
          id: number
          is_read: boolean
          visible_to: string | null
        }
        Insert: {
          content?: Json
          conversation_id?: number | null
          created_at?: string | null
          from_profile_id?: string | null
          id?: number
          is_read?: boolean
          visible_to?: string | null
        }
        Update: {
          content?: Json
          conversation_id?: number | null
          created_at?: string | null
          from_profile_id?: string | null
          id?: number
          is_read?: boolean
          visible_to?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_from_profile_id_fkey"
            columns: ["from_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar: string | null
          created_at: string | null
          id: string
          last_active: string | null
          name: string | null
          updated_at: string | null
        }
        Insert: {
          avatar?: string | null
          created_at?: string | null
          id: string
          last_active?: string | null
          name?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar?: string | null
          created_at?: string | null
          id?: string
          last_active?: string | null
          name?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      subjects: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: number
          name: string
        }
        Update: {
          id?: number
          name?: string
        }
        Relationships: []
      }
      tutors: {
        Row: {
          created_at: string | null
          id: string
          metadata: Json
          profile_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          metadata: Json
          profile_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          metadata?: Json
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tutors_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      tutors_availabilities: {
        Row: {
          afternoon: boolean
          evening: boolean
          id: number
          morning: boolean
          tutor_id: string
          weekday: string
        }
        Insert: {
          afternoon?: boolean
          evening?: boolean
          id?: number
          morning?: boolean
          tutor_id: string
          weekday: string
        }
        Update: {
          afternoon?: boolean
          evening?: boolean
          id?: number
          morning?: boolean
          tutor_id?: string
          weekday?: string
        }
        Relationships: [
          {
            foreignKeyName: "tutors_availabilities_tutor_id_fkey"
            columns: ["tutor_id"]
            isOneToOne: false
            referencedRelation: "tutors"
            referencedColumns: ["id"]
          },
        ]
      }
      tutors_services: {
        Row: {
          created_at: string | null
          id: number
          level_id: number
          price: number
          tutor_id: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          level_id: number
          price: number
          tutor_id: string
        }
        Update: {
          created_at?: string | null
          id?: number
          level_id?: number
          price?: number
          tutor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tutors_services_level_id_fkey"
            columns: ["level_id"]
            isOneToOne: false
            referencedRelation: "levels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tutors_services_tutor_id_fkey"
            columns: ["tutor_id"]
            isOneToOne: false
            referencedRelation: "tutors"
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
      booking_status: "Pending" | "Confirmed" | "Canceled" | "Completed"
      booking_type: "Free Meeting" | "Lesson" | "Group Lesson"
      participant_role: "Student" | "Tutor"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
