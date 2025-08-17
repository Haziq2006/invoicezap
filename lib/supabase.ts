import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Profile {
  id: string
  first_name: string | null
  last_name: string | null
  company: string | null
  phone: string | null
  address: string | null
  plan: 'free' | 'pro' | 'business'
  currency: string
  timezone: string
  language: string
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  subscription_status: string | null
  created_at: string
  updated_at: string
}

export interface Client {
  id: string
  user_id: string
  name: string
  email: string | null
  company: string | null
  phone: string | null
  address: string | null
  total_invoices: number
  total_revenue: number
  last_invoice_date: string | null
  created_at: string
  updated_at: string
}

export interface InvoiceItem {
  id: string
  invoice_id: string
  description: string
  quantity: number
  unit_price: number
  total: number
  created_at: string
}

export interface Invoice {
  id: string
  user_id: string
  client_id: string | null
  invoice_number: string
  status: 'draft' | 'sent' | 'pending' | 'paid' | 'overdue'
  issue_date: string
  due_date: string
  subtotal: number
  tax_rate: number
  tax_amount: number
  total: number
  notes: string | null
  template: string
  stripe_payment_intent_id: string | null
  created_at: string
  updated_at: string
}
