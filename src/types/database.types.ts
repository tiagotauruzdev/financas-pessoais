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
      profiles: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          name: string
          email: string
          avatar_url: string | null
          level: number
          xp: number
          achievements: string[]
        }
        Insert: {
          id: string
          created_at?: string
          updated_at?: string
          name: string
          email: string
          avatar_url?: string | null
          level?: number
          xp?: number
          achievements?: string[]
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          name?: string
          email?: string
          avatar_url?: string | null
          level?: number
          xp?: number
          achievements?: string[]
        }
      }
      transactions: {
        Row: {
          id: string
          created_at: string
          user_id: string
          type: 'income' | 'expense'
          amount: number
          category: string
          description: string
          date: string
          payment_method: string
          status: 'pending' | 'completed' | 'cancelled'
          recurring: boolean
          recurring_frequency?: 'weekly' | 'monthly' | 'yearly'
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          type: 'income' | 'expense'
          amount: number
          category: string
          description: string
          date: string
          payment_method: string
          status?: 'pending' | 'completed' | 'cancelled'
          recurring?: boolean
          recurring_frequency?: 'weekly' | 'monthly' | 'yearly'
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          type?: 'income' | 'expense'
          amount?: number
          category?: string
          description?: string
          date?: string
          payment_method?: string
          status?: 'pending' | 'completed' | 'cancelled'
          recurring?: boolean
          recurring_frequency?: 'weekly' | 'monthly' | 'yearly'
        }
      }
      budgets: {
        Row: {
          id: string
          created_at: string
          user_id: string
          category: string
          amount: number
          spent: number
          period: 'monthly' | 'yearly'
          year: number
          month?: number
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          category: string
          amount: number
          spent?: number
          period: 'monthly' | 'yearly'
          year: number
          month?: number
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          category?: string
          amount?: number
          spent?: number
          period?: 'monthly' | 'yearly'
          year?: number
          month?: number
        }
      }
      investments: {
        Row: {
          id: string
          created_at: string
          user_id: string
          type: string
          amount: number
          current_value: number
          name: string
          description: string
          start_date: string
          end_date?: string
          status: 'active' | 'completed' | 'cancelled'
          return_rate?: number
          risk_level: 'low' | 'medium' | 'high'
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          type: string
          amount: number
          current_value: number
          name: string
          description: string
          start_date: string
          end_date?: string
          status?: 'active' | 'completed' | 'cancelled'
          return_rate?: number
          risk_level: 'low' | 'medium' | 'high'
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          type?: string
          amount?: number
          current_value?: number
          name?: string
          description?: string
          start_date?: string
          end_date?: string
          status?: 'active' | 'completed' | 'cancelled'
          return_rate?: number
          risk_level?: 'low' | 'medium' | 'high'
        }
      }
      debts: {
        Row: {
          id: string
          created_at: string
          user_id: string
          name: string
          amount: number
          remaining_amount: number
          interest_rate: number
          due_date: string
          payment_day: number
          category: string
          status: 'active' | 'paid' | 'defaulted'
          priority: 'low' | 'medium' | 'high'
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          name: string
          amount: number
          remaining_amount: number
          interest_rate: number
          due_date: string
          payment_day: number
          category: string
          status?: 'active' | 'paid' | 'defaulted'
          priority?: 'low' | 'medium' | 'high'
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          name?: string
          amount?: number
          remaining_amount?: number
          interest_rate?: number
          due_date?: string
          payment_day?: number
          category?: string
          status?: 'active' | 'paid' | 'defaulted'
          priority?: 'low' | 'medium' | 'high'
        }
      }
      goals: {
        Row: {
          id: string
          created_at: string
          user_id: string
          name: string
          target_amount: number
          current_amount: number
          deadline: string
          category: string
          priority: 'low' | 'medium' | 'high'
          status: 'active' | 'completed' | 'cancelled'
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          name: string
          target_amount: number
          current_amount?: number
          deadline: string
          category: string
          priority?: 'low' | 'medium' | 'high'
          status?: 'active' | 'completed' | 'cancelled'
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          name?: string
          target_amount?: number
          current_amount?: number
          deadline?: string
          category?: string
          priority?: 'low' | 'medium' | 'high'
          status?: 'active' | 'completed' | 'cancelled'
        }
      }
      notifications: {
        Row: {
          id: string
          created_at: string
          user_id: string
          title: string
          message: string
          type: 'info' | 'warning' | 'success' | 'error'
          read: boolean
          action_url?: string
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          title: string
          message: string
          type?: 'info' | 'warning' | 'success' | 'error'
          read?: boolean
          action_url?: string
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          title?: string
          message?: string
          type?: 'info' | 'warning' | 'success' | 'error'
          read?: boolean
          action_url?: string
        }
      }
    }
  }
}
