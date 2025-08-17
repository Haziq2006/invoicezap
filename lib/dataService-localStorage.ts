// Temporary data service using localStorage
// This will be replaced with Supabase integration

export interface Client {
  id: string
  name: string
  email: string
  company: string
  phone: string
  address: string
  totalInvoices: number
  totalRevenue: number
  lastInvoiceDate: string | null
  createdAt: string
}

export interface Invoice {
  id: string
  invoiceNumber: string
  clientName: string
  clientEmail: string
  amount: number
  status: 'draft' | 'sent' | 'pending' | 'paid' | 'overdue'
  issueDate: string
  dueDate: string
  paidDate?: string
  template: string
  notes?: string
  lineItems: Array<{
    description: string
    quantity: number
    rate: number
    amount: number
  }>
  subtotal: number
  taxRate: number
  taxAmount: number
  total: number
  createdAt: string
  updatedAt: string
}

export interface UserProfile {
  id: string
  firstName: string
  lastName: string
  email: string
  company: string
  phone: string
  address: string
  plan: 'free' | 'pro' | 'business'
  currency: string
  timezone: string
  language: string
  createdAt: string
  updatedAt: string
}

class DataService {
  private getStorageKey(key: string): string {
    return `invoicezap_${key}`
  }

  // Client methods
  async getClients(): Promise<Client[]> {
    try {
      const clients = localStorage.getItem(this.getStorageKey('clients'))
      return clients ? JSON.parse(clients) : []
    } catch (error) {
      console.error('Error getting clients:', error)
      return []
    }
  }

  async getClientById(id: string): Promise<Client | null> {
    try {
      const clients = await this.getClients()
      return clients.find(client => client.id === id) || null
    } catch (error) {
      console.error('Error getting client by ID:', error)
      return null
    }
  }

  async saveClient(client: Omit<Client, 'id' | 'createdAt'>): Promise<Client> {
    try {
      const clients = await this.getClients()
      const newClient: Client = {
        ...client,
        id: Date.now().toString(),
        createdAt: new Date().toISOString().split('T')[0]
      }
      
      clients.push(newClient)
      localStorage.setItem(this.getStorageKey('clients'), JSON.stringify(clients))
      return newClient
    } catch (error) {
      console.error('Error saving client:', error)
      throw error
    }
  }

  async updateClient(id: string, updates: Partial<Client>): Promise<Client> {
    try {
      const clients = await this.getClients()
      const index = clients.findIndex(c => c.id === id)
      
      if (index === -1) {
        throw new Error('Client not found')
      }
      
      clients[index] = { ...clients[index], ...updates }
      localStorage.setItem(this.getStorageKey('clients'), JSON.stringify(clients))
      return clients[index]
    } catch (error) {
      console.error('Error updating client:', error)
      throw error
    }
  }

  async deleteClient(id: string): Promise<boolean> {
    try {
      const clients = await this.getClients()
      const index = clients.findIndex(c => c.id === id)
      
      if (index === -1) {
        return false
      }
      
      clients.splice(index, 1)
      localStorage.setItem(this.getStorageKey('clients'), JSON.stringify(clients))
      return true
    } catch (error) {
      console.error('Error deleting client:', error)
      return false
    }
  }

  // Invoice methods
  async getInvoices(): Promise<Invoice[]> {
    try {
      const invoices = localStorage.getItem(this.getStorageKey('invoices'))
      return invoices ? JSON.parse(invoices) : []
    } catch (error) {
      console.error('Error getting invoices:', error)
      return []
    }
  }

  async saveInvoice(invoice: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>): Promise<Invoice> {
    try {
      const invoices = await this.getInvoices()
      const newInvoice: Invoice = {
        ...invoice,
        id: Date.now().toString(),
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0]
      }
      
      invoices.push(newInvoice)
      localStorage.setItem(this.getStorageKey('invoices'), JSON.stringify(invoices))
      return newInvoice
    } catch (error) {
      console.error('Error saving invoice:', error)
      throw error
    }
  }

  async updateInvoice(id: string, updates: Partial<Invoice>): Promise<Invoice> {
    try {
      const invoices = await this.getInvoices()
      const index = invoices.findIndex(i => i.id === id)
      
      if (index === -1) {
        throw new Error('Invoice not found')
      }
      
      invoices[index] = { 
        ...invoices[index], 
        ...updates, 
        updatedAt: new Date().toISOString().split('T')[0] 
      }
      localStorage.setItem(this.getStorageKey('invoices'), JSON.stringify(invoices))
      return invoices[index]
    } catch (error) {
      console.error('Error updating invoice:', error)
      throw error
    }
  }

  async getInvoice(id: string): Promise<Invoice | null> {
    try {
      const invoices = await this.getInvoices()
      return invoices.find(invoice => invoice.id === id) || null
    } catch (error) {
      console.error('Error getting invoice by ID:', error)
      return null
    }
  }

  async deleteInvoice(id: string): Promise<void> {
    try {
      const invoices = await this.getInvoices()
      const filteredInvoices = invoices.filter(i => i.id !== id)
      localStorage.setItem(this.getStorageKey('invoices'), JSON.stringify(filteredInvoices))
    } catch (error) {
      console.error('Error deleting invoice:', error)
      throw error
    }
  }

  // Profile methods
  async getUserProfile(): Promise<UserProfile | null> {
    try {
      const profile = localStorage.getItem(this.getStorageKey('userProfile'))
      return profile ? JSON.parse(profile) : null
    } catch (error) {
      console.error('Error getting user profile:', error)
      return null
    }
  }

  async updateUserProfile(updates: Partial<UserProfile>): Promise<UserProfile> {
    try {
      const profile = await this.getUserProfile()
      const updatedProfile: UserProfile = {
        ...profile!,
        ...updates,
        updatedAt: new Date().toISOString().split('T')[0]
      }
      
      localStorage.setItem(this.getStorageKey('userProfile'), JSON.stringify(updatedProfile))
      return updatedProfile
    } catch (error) {
      console.error('Error updating user profile:', error)
      throw error
    }
  }

  // Analytics methods
  async getInvoiceStats() {
    try {
      const invoices = await this.getInvoices()
      const clients = await this.getClients()
      
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
          const issueDate = new Date(i.issueDate)
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
        totalClients: clients.length
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

  // Analytics methods
  async getDashboardAnalytics(userId: string, periodDays: number = 30) {
    try {
      const invoices = await this.getInvoices()
      const clients = await this.getClients()
      
      const cutoffDate = new Date()
      cutoffDate.setDate(cutoffDate.getDate() - periodDays)
      
      const periodInvoices = invoices.filter(i => {
        const issueDate = new Date(i.issueDate)
        return issueDate >= cutoffDate
      })
      
      const totalInvoices = periodInvoices.length
      const paidInvoices = periodInvoices.filter(i => i.status === 'paid').length
      const pendingInvoices = periodInvoices.filter(i => i.status === 'pending').length
      const overdueInvoices = periodInvoices.filter(i => i.status === 'overdue').length
      
      const totalRevenue = periodInvoices
        .filter(i => i.status === 'paid')
        .reduce((sum, i) => sum + i.total, 0)
      
      const pendingRevenue = periodInvoices
        .filter(i => i.status === 'pending')
        .reduce((sum, i) => sum + i.total, 0)
      
      const thisMonth = periodInvoices
        .filter(i => {
          const issueDate = new Date(i.issueDate)
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
        totalClients: clients.length,
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

  // Report generation methods
  async generateRevenueReport(userId: string, filters: any) {
    try {
      const invoices = await this.getInvoices()
      const filteredInvoices = invoices.filter(i => {
        if (filters.status && i.status !== filters.status) return false
        if (filters.startDate && new Date(i.issueDate) < new Date(filters.startDate)) return false
        if (filters.endDate && new Date(i.issueDate) > new Date(filters.endDate)) return false
        return true
      })
      
      const totalRevenue = filteredInvoices
        .filter(i => i.status === 'paid')
        .reduce((sum, i) => sum + i.total, 0)
      
      const pendingRevenue = filteredInvoices
        .filter(i => i.status === 'pending')
        .reduce((sum, i) => sum + i.total, 0)
      
      return {
        totalRevenue,
        pendingRevenue,
        invoiceCount: filteredInvoices.length,
        paidCount: filteredInvoices.filter(i => i.status === 'paid').length,
        invoices: filteredInvoices
      }
    } catch (error) {
      console.error('Error generating revenue report:', error)
      throw error
    }
  }

  async generateClientReport(userId: string, filters: any) {
    try {
      const clients = await this.getClients()
      const invoices = await this.getInvoices()
      
      const clientStats = clients.map(client => {
        const clientInvoices = invoices.filter(i => i.clientName === client.name)
        const totalRevenue = clientInvoices
          .filter(i => i.status === 'paid')
          .reduce((sum, i) => sum + i.total, 0)
        
        return {
          ...client,
          totalInvoices: clientInvoices.length,
          totalRevenue,
          lastInvoiceDate: clientInvoices.length > 0 
            ? Math.max(...clientInvoices.map(i => new Date(i.issueDate).getTime()))
            : null
        }
      })
      
      return clientStats
    } catch (error) {
      console.error('Error generating client report:', error)
      throw error
    }
  }

  async generateInvoiceReport(userId: string, filters: any) {
    try {
      const invoices = await this.getInvoices()
      const filteredInvoices = invoices.filter(i => {
        if (filters.status && i.status !== filters.status) return false
        if (filters.startDate && new Date(i.issueDate) < new Date(filters.startDate)) return false
        if (filters.endDate && new Date(i.issueDate) > new Date(filters.endDate)) return false
        return true
      })
      
      return {
        invoices: filteredInvoices,
        summary: {
          total: filteredInvoices.length,
          draft: filteredInvoices.filter(i => i.status === 'draft').length,
          sent: filteredInvoices.filter(i => i.status === 'sent').length,
          pending: filteredInvoices.filter(i => i.status === 'pending').length,
          paid: filteredInvoices.filter(i => i.status === 'paid').length,
          overdue: filteredInvoices.filter(i => i.status === 'overdue').length
        }
      }
    } catch (error) {
      console.error('Error generating invoice report:', error)
      throw error
    }
  }

  async generateTemplateUsageReport(userId: string, filters: any) {
    try {
      const invoices = await this.getInvoices()
      const filteredInvoices = invoices.filter(i => {
        if (filters.startDate && new Date(i.issueDate) < new Date(filters.startDate)) return false
        if (filters.endDate && new Date(i.issueDate) > new Date(filters.endDate)) return false
        return true
      })
      
      const templateUsage = filteredInvoices.reduce((acc, invoice) => {
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
        totalInvoices: filteredInvoices.length,
        totalRevenue: filteredInvoices
          .filter(i => i.status === 'paid')
          .reduce((sum, i) => sum + i.total, 0)
      }
    } catch (error) {
      console.error('Error generating template usage report:', error)
      throw error
    }
  }

  // Authentication methods
  async authenticateUser(email: string, password: string) {
    try {
      // Mock authentication - replace with Supabase auth later
      const users = localStorage.getItem(this.getStorageKey('users'))
      if (!users) return null
      
      const userList = JSON.parse(users)
      const user = userList.find((u: any) => u.email === email && u.password === password)
      
      if (user) {
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          plan: user.plan || 'free',
          company: user.company || 'Your Company'
        }
      }
      
      return null
    } catch (error) {
      console.error('Error authenticating user:', error)
      return null
    }
  }

  async getUserByEmail(email: string) {
    try {
      const users = localStorage.getItem(this.getStorageKey('users')) || '[]'
      const userList = JSON.parse(users)
      return userList.find((u: any) => u.email === email) || null
    } catch (error) {
      console.error('Error getting user by email:', error)
      return null
    }
  }

  async createUser(userData: { email: string, password: string, name: string, plan: string, company?: string }) {
    try {
      const users = localStorage.getItem(this.getStorageKey('users')) || '[]'
      const userList = JSON.parse(users)
      
      const newUser = {
        id: Date.now().toString(),
        ...userData,
        createdAt: new Date().toISOString()
      }
      
      userList.push(newUser)
      localStorage.setItem(this.getStorageKey('users'), JSON.stringify(userList))
      
      return {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        plan: newUser.plan,
        company: newUser.company || 'Your Company'
      }
    } catch (error) {
      console.error('Error creating user:', error)
      throw error
    }
  }

  // Utility methods
  async clearAllData(): Promise<void> {
    try {
      const keys = Object.keys(localStorage).filter(key => key.startsWith('invoicezap_'))
      keys.forEach(key => localStorage.removeItem(key))
    } catch (error) {
      console.error('Error clearing data:', error)
      throw error
    }
  }

  async exportData(): Promise<{ clients: Client[], invoices: Invoice[], profile: UserProfile | null }> {
    try {
      const [clients, invoices, profile] = await Promise.all([
        this.getClients(),
        this.getInvoices(),
        this.getUserProfile()
      ])
      
      return { clients, invoices, profile }
    } catch (error) {
      console.error('Error exporting data:', error)
      throw error
    }
  }

  async importData(data: { clients: Client[], invoices: Invoice[], profile: UserProfile | null }): Promise<void> {
    try {
      if (data.clients) {
        localStorage.setItem(this.getStorageKey('clients'), JSON.stringify(data.clients))
      }
      if (data.invoices) {
        localStorage.setItem(this.getStorageKey('invoices'), JSON.stringify(data.invoices))
      }
      if (data.profile) {
        localStorage.setItem(this.getStorageKey('userProfile'), JSON.stringify(data.profile))
      }
    } catch (error) {
      console.error('Error importing data:', error)
      throw error
    }
  }
}

// Export singleton instance
export const dataService = new DataService()

