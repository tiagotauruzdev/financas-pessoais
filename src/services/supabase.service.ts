import { createClient } from '@supabase/supabase-js'
import { Database } from '../types/database.types'

const supabaseUrl = 'https://utvwvkbaqpgsqsyekspy.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV0dnd2a2JhcXBnc3FzeWVrc3B5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI4MjY0NzYsImV4cCI6MjA0ODQwMjQ3Nn0.az4jMLpWFbmWsa_8zrSTl8iWYICzAOtStMDVU2DkrgE'

export const supabase = createClient<Database>(supabaseUrl, supabaseKey)

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type InsertTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type UpdateTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']
