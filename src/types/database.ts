export interface Database {
  public: {
    Tables: {
      materials: {
        Row: {
          id: string
          title: string
          contents: string | null
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          contents?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          contents?: string | null
          created_at?: string
        }
      }
      lectures: {
        Row: {
          id: string
          title: string
          description: string | null
          youtube_url: string
          grade: string[]
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          youtube_url: string
          grade: string[]
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          youtube_url?: string
          grade?: string[]
          created_at?: string
        }
      }
      student_records: {
        Row: {
          id: string
          title: string
          grade: string[]
          images: string[]
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          grade?: string[]
          images?: string[]
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          grade?: string[]
          images?: string[]
          created_at?: string
        }
      }
    }
  }
}


export type Material = Database['public']['Tables']['materials']['Row']
export type MaterialInsert = Database['public']['Tables']['materials']['Insert']
export type MaterialUpdate = Database['public']['Tables']['materials']['Update']

export type Lecture = Database['public']['Tables']['lectures']['Row']
export type LectureInsert = Database['public']['Tables']['lectures']['Insert']
export type LectureUpdate = Database['public']['Tables']['lectures']['Update']

export type StudentRecord = Database['public']['Tables']['student_records']['Row']
export type StudentRecordInsert = Database['public']['Tables']['student_records']['Insert']
export type StudentRecordUpdate = Database['public']['Tables']['student_records']['Update']
