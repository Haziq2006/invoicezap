// Production-ready data service using Supabase
import { supabase } from './supabase'
import type { Profile, Client, Invoice, InvoiceItem } from './supabase'

export interface InvoiceWithItems extends Omit<Invoice, 'invoice_items'> {
  invoice_items: InvoiceItem[]
  client?: Client | null
}

export interface ClientWithStats extends Client {
  total_invoices: number
  total_revenue: number
  last_invoice_date: string | null
}

class SupabaseDataService {
  // =============================================
  // CLIENT METHODS
  // =============================================

  async getClients(userId: string): Promise<ClientWithStats[]> {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select(`
          *,
          invoices(total, status, issue_date)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error

      // Calculate stats for each client
      return data.map(client => {
        const invoices = client.invoices || []
        const paidInvoices = invoices.filter((inv: any) => inv.status === 'paid')
        
        return {
          ...client,
          total_invoices: invoices.length,
          total_revenue: paidInvoices.reduce((sum: number, inv: any) => sum + inv.total, 0),
          last_invoice_date: invoices.length > 0 
            ? Math.max(...invoices.map((inv: any) => new Date(inv.issue_date).getTime()))
            : null
        }
      })
    } catch (error) {
      console.error('Error getting clients:', error)
      return []
    }
  }

  async getClientById(id: string, userId: string): Promise<Client | null> {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('id', id)
        .eq('user_id', userId)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error getting client by ID:', error)
      return null
    }
  }

  async saveClient(client: Omit<Client, 'id' | 'created_at'>, userId: string): Promise<Client> {
    try {
      const { data, error } = await supabase
        .from('clients')
        .insert([{ ...client, user_id: userId }])
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error saving client:', error)
      throw error
    }
  }

  async updateClient(id: string, updates: Partial<Client>, userId: string): Promise<Client> {
    try {
      const { data, error } = await supabase
        .from('clients')
        .update(updates)
        .eq('id', id)
        .eq('user_id', userId)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error updating client:', error)
      throw error
    }
  }

  async deleteClient(id: string, userId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', id)
        .eq('user_id', userId)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error deleting client:', error)
      return false
    }
  }

  // =============================================
  // INVOICE METHODS
  // =============================================

  async getInvoices(userId: string): Promise<InvoiceWithItems[]> {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .select(`
          *,
          invoice_items(*),
          clients(name, email, company)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error

      return data.map(invoice => ({
        ...invoice,
        client: invoice.clients
      }))
    } catch (error) {
      console.error('Error getting invoices:', error)
      return []
    }
  }

  async getInvoice(id: string, userId: string): Promise<InvoiceWithItems | null> {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .select(`
          *,
          invoice_items(*),
          clients(*)
        `)
        .eq('id', id)
        .eq('user_id', userId)
        .single()

      if (error) throw error

      return {
        ...data,
        client: data.clients
      }
    } catch (error) {
      console.error('Error getting invoice by ID:', error)
      return null
    }
  }

  async saveInvoice(
    invoice: Omit<Invoice, 'id' | 'created_at' | 'updated_at'>, 
    items: Omit<InvoiceItem, 'id' | 'invoice_id' | 'created_at'>[],
    userId: string
  ): Promise<InvoiceWithItems> {
    try {
      // Start a transaction
      const { data: invoiceData, error: invoiceError } = await supabase
        .from('invoices')
        .insert([{ ...invoice, user_id: userId }])
        .select()
        .single()

      if (invoiceError) throw invoiceError

      // Insert invoice items
      const itemsWithInvoiceId = items.map(item => ({
        ...item,
        invoice_id: invoiceData.id
      }))

      const { data: itemsData, error: itemsError } = await supabase
        .from('invoice_items')
        .insert(itemsWithInvoiceId)
        .select()

      if (itemsError) throw itemsError

      // Get client data if available
      let clientData = null
      if (invoiceData.client_id) {
        const { data: client } = await supabase
          .from('clients')
          .select('*')
          .eq('id', invoiceData.client_id)
          .single()
        clientData = client
      }

      return {
        ...invoiceData,
        invoice_items: itemsData,
        client: clientData
      }
    } catch (error) {
      console.error('Error saving invoice:', error)
      throw error
    }
  }

  async updateInvoice(
    id: string, 
    updates: Partial<Invoice>, 
    userId: string,
    items?: Omit<InvoiceItem, 'id' | 'invoice_id' | 'created_at'>[]
  ): Promise<InvoiceWithItems> {
    try {
      // Update invoice
      const { data: invoiceData, error: invoiceError } = await supabase
        .from('invoices')
        .update(updates)
        .eq('id', id)
        .eq('user_id', userId)
        .select()
        .single()

      if (invoiceError) throw invoiceError

      // Update items if provided
      if (items) {
        // Delete existing items
        await supabase
          .from('invoice_items')
          .delete()
          .eq('invoice_id', id)

        // Insert new items
        const itemsWithInvoiceId = items.map(item => ({
          ...item,
          invoice_id: id
        }))

        await supabase
          .from('invoice_items')
          .insert(itemsWithInvoiceId)
      }

      // Get updated invoice with items
      const updatedInvoice = await this.getInvoice(id, userId)
      if (!updatedInvoice) throw new Error('Failed to fetch updated invoice')

      return updatedInvoice
    } catch (error) {
      console.error('Error updating invoice:', error)
      throw error
    }
  }

  async deleteInvoice(id: string, userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('invoices')
        .delete()
        .eq('id', id)
        .eq('user_id', userId)

      if (error) throw error
    } catch (error) {
      console.error('Error deleting invoice:', error)
      throw error
    }
  }

  // =============================================
  // PROFILE METHODS
  // =============================================

  async getUserProfile(userId: string): Promise<Profile | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error getting user profile:', error)
      return null
    }
  }

  async updateUserProfile(userId: string, updates: Partial<Profile>): Promise<Profile> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error updating user profile:', error)
      throw error
    }
  }

  // =============================================
  // ANALYTICS METHODS
  // =============================================

  async getInvoiceStats(userId: string) {
    try {
      const { data: invoices, error } = await supabase
        .from('invoices')
        .select('status, total, issue_date')
        .eq('user_id', userId)

      if (error) throw error

      const { data: clientCount, error: clientError } = await supabase
        .from('clients')
        .select('id', { count: 'exact' })
        .eq('user_id', userId)

      if (clientError) throw clientError

      const totalInvoices = invoices.length
      const paidInvoices = invoices.filter(i => i.status === 'paid').length
      const pendingInvoices = invoices.filter(i => i.status === 'pending').length
      const overdueInvoices = invoices.filter(i => i.status === 'overdue').length
      const draftInvoices = invoices.filter(i => i.status === 'draft').length

      const totalRevenue = invoices
        .filter(i => i.status === 'paid')
        .reduce((sum, i) => sum + i.total, 0)

      const pendingRevenue = invoices
        .filter(i => i.status === 'pending')
        .reduce((sum, i) => sum + i.total, 0)

      const thisMonth = invoices
        .filter(i => {
          const issueDate = new Date(i.issue_date)
          const now = new Date()
          return issueDate.getMonth() === now.getMonth() && 
                 issueDate.getFullYear() === now.getFullYear()
        })
        .reduce((sum, i) => sum + i.total, 0)

      return {
        totalInvoices,
        paidInvoices,
        pendingInvoices,
        overdueInvoices,
        draftInvoices,
        totalRevenue,
        pendingRevenue,
        thisMonth,
        totalClients: clientCount?.length || 0
      }
    } catch (error) {
      console.error('Error getting invoice stats:', error)
      return {
        totalInvoices: 0,
        paidInvoices: 0,
        pendingInvoices: 0,
        overdueInvoices: 0,
        draftInvoices: 0,
        totalRevenue: 0,
        pendingRevenue: 0,
        thisMonth: 0,
        totalClients: 0
      }
    }
  }

  async getDashboardAnalytics(userId: string, periodDays: number = 30) {
    try {
      const cutoffDate = new Date()
      cutoffDate.setDate(cutoffDate.getDate() - periodDays)

      const { data: invoices, error } = await supabase
        .from('invoices')
        .select('status, total, issue_date')
        .eq('user_id', userId)
        .gte('issue_date', cutoffDate.toISOString().split('T')[0])

      if (error) throw error

      const { data: clientCount, error: clientError } = await supabase
        .from('clients')
        .select('id', { count: 'exact' })
        .eq('user_id', userId)

      if (clientError) throw clientError

      const totalInvoices = invoices.length
      const paidInvoices = invoices.filter(i => i.status === 'paid').length
      const pendingInvoices = invoices.filter(i => i.status === 'pending').length
      const overdueInvoices = invoices.filter(i => i.status === 'overdue').length

      const totalRevenue = invoices
        .filter(i => i.status === 'paid')
        .reduce((sum, i) => sum + i.total, 0)

      const pendingRevenue = invoices
        .filter(i => i.status === 'pending')
        .reduce((sum, i) => sum + i.total, 0)

      const thisMonth = invoices
        .filter(i => {
          const issueDate = new Date(i.issue_date)
          const now = new Date()
          return issueDate.getMonth() === now.getMonth() && 
                 issueDate.getFullYear() === now.getFullYear()
        })
        .reduce((sum, i) => sum + i.total, 0)

      return {
        totalInvoices,
        paidInvoices,
        pendingInvoices,
        overdueInvoices,
        totalRevenue,
        pendingRevenue,
        thisMonth,
        totalClients: clientCount?.length || 0,
        periodDays
      }
    } catch (error) {
      console.error('Error getting dashboard analytics:', error)
      return {
        totalInvoices: 0,
        paidInvoices: 0,
        pendingInvoices: 0,
        overdueInvoices: 0,
        totalRevenue: 0,
        pendingRevenue: 0,
        thisMonth: 0,
        totalClients: 0,
        periodDays
      }
    }
  }

  // =============================================
  // REPORT GENERATION METHODS
  // =============================================

  async generateRevenueReport(userId: string, filters: any) {
    try {
      let query = supabase
        .from('invoices')
        .select('*')
        .eq('user_id', userId)

      if (filters.status) {
        query = query.eq('status', filters.status)
      }
      if (filters.startDate) {
        query = query.gte('issue_date', filters.startDate)
      }
      if (filters.endDate) {
        query = query.lte('issue_date', filters.endDate)
      }

      const { data: invoices, error } = await query

      if (error) throw error

      const totalRevenue = invoices
        .filter(i => i.status === 'paid')
        .reduce((sum, i) => sum + i.total, 0)

      const pendingRevenue = invoices
        .filter(i => i.status === 'pending')
        .reduce((sum, i) => sum + i.total, 0)

      return {
        totalRevenue,
        pendingRevenue,
        invoiceCount: invoices.length,
        paidCount: invoices.filter(i => i.status === 'paid').length,
        invoices
      }
    } catch (error) {
      console.error('Error generating revenue report:', error)
      throw error
    }
  }

  async generateClientReport(userId: string, filters: any) {
    try {
      const clients = await this.getClients(userId)
      return clients
    } catch (error) {
      console.error('Error generating client report:', error)
      throw error
    }
  }

  async generateInvoiceReport(userId: string, filters: any) {
    try {
      let query = supabase
        .from('invoices')
        .select('*')
        .eq('user_id', userId)

      if (filters.status) {
        query = query.eq('status', filters.status)
      }
      if (filters.startDate) {
        query = query.gte('issue_date', filters.startDate)
      }
      if (filters.endDate) {
        query = query.lte('issue_date', filters.endDate)
      }

      const { data: invoices, error } = await query

      if (error) throw error

      return {
        invoices,
        summary: {
          total: invoices.length,
          draft: invoices.filter(i => i.status === 'draft').length,
          sent: invoices.filter(i => i.status === 'sent').length,
          pending: invoices.filter(i => i.status === 'pending').length,
          paid: invoices.filter(i => i.status === 'paid').length,
          overdue: invoices.filter(i => i.status === 'overdue').length
        }
      }
    } catch (error) {
      console.error('Error generating invoice report:', error)
      throw error
    }
  }

  async generateTemplateUsageReport(userId: string, filters: any) {
    try {
      let query = supabase
        .from('invoices')
        .select('template, total, status')
        .eq('user_id', userId)

      if (filters.startDate) {
        query = query.gte('issue_date', filters.startDate)
      }
      if (filters.endDate) {
        query = query.lte('issue_date', filters.endDate)
      }

      const { data: invoices, error } = await query

      if (error) throw error

      const templateUsage = invoices.reduce((acc, invoice) => {
        const template = invoice.template || 'basic'
        if (!acc[template]) {
          acc[template] = { count: 0, revenue: 0 }
        }
        acc[template].count++
        if (invoice.status === 'paid') {
          acc[template].revenue += invoice.total
        }
        return acc
      }, {} as Record<string, { count: number, revenue: number }>)

      return {
        templateUsage,
        totalInvoices: invoices.length,
        totalRevenue: invoices
          .filter(i => i.status === 'paid')
          .reduce((sum, i) => sum + i.total, 0)
      }
    } catch (error) {
      console.error('Error generating template usage report:', error)
      throw error
    }
  }
}

// Export singleton instance
export const dataService = new SupabaseDataService()

// Clear demo data for new users
export const clearDemoData = () => {
  if (typeof window !== 'undefined') {
    // Clear any existing demo data
    localStorage.removeItem('invoicezap_invoices')
    localStorage.removeItem('invoicezap_clients')
    localStorage.removeItem('invoicezap_demoData')
    
    // Keep user profile and auth data
    // localStorage.removeItem('invoicezap_userProfile') // Keep this for personalization
    // localStorage.removeItem('invoicezap_user') // Keep this for auth
  }
}

// Check if user has real data (not demo data)
export const hasRealData = () => {
  if (typeof window !== 'undefined') {
    const invoices = localStorage.getItem('invoicezap_invoices')
    const clients = localStorage.getItem('invoicezap_clients')
    
    if (invoices) {
      const invoiceData = JSON.parse(invoices)
      return invoiceData.length > 0
    }
    
    if (clients) {
      const clientData = JSON.parse(clients)
      return clientData.length > 0
    }
  }
  
  return false
}

// Initialize fresh dashboard for new users
export const initializeFreshDashboard = () => {
  if (typeof window !== 'undefined') {
    // Clear any demo data
    clearDemoData()
    
    // Set flag to indicate this is a fresh start
    localStorage.setItem('invoicezap_freshStart', 'true')
    
    // Initialize empty arrays for invoices and clients
    localStorage.setItem('invoicezap_invoices', JSON.stringify([]))
    localStorage.setItem('invoicezap_clients', JSON.stringify([]))
  }
}

// Re-export types from supabase for convenience
export type { Client, Invoice, InvoiceItem, Profile } from './supabase'
