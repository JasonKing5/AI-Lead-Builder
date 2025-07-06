export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      leads: {
        Row: {
          id: string
          name: string
          role: string
          company: string
          linkedin_url: string | null
          message: string | null
          status: 'Draft' | 'Approved' | 'Sent'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          role: string
          company: string
          linkedin_url?: string | null
          message?: string | null
          status?: 'Draft' | 'Approved' | 'Sent'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          role?: string
          company?: string
          linkedin_url?: string | null
          message?: string | null
          status?: 'Draft' | 'Approved' | 'Sent'
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}