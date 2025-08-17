'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Plus, 
  Search, 
  Filter,
  Download,
  Send,
  Eye,
  Edit,
  Trash2,
  Calendar,
  DollarSign,
  User,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react'
import ProtectedRoute from '@/components/ProtectedRoute'
import Navigation from '@/components/Navigation'
import toast from 'react-hot-toast'
import { InvoiceData } from '@/lib/pdfGenerator'

interface Invoice {
  id: string
  invoiceNumber: string
  clientName: string
  clientEmail: string
  amount: number
  status: 'draft' | 'sent' | 'pending' | 'paid' | 'overdue' | 'cancelled'
  issueDate: string
  dueDate: string
  paidDate?: string
  template: string
  notes?: string
  paymentLink?: string
  hasPaymentLink: boolean
}

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterDate, setFilterDate] = useState('all')
  const [isLoading, setIsLoading] = useState(false)
  const [bulkActions, setBulkActions] = useState<string[]>([])

  // Mock data - replace with Supabase
  useEffect(() => {
    const mockInvoices: Invoice[] = [
      {
        id: '1',
        invoiceNumber: 'INV-202401-001',
        clientName: 'Acme Corporation',
        clientEmail: 'john@acmecorp.com',
        amount: 1200,
        status: 'paid',
        issueDate: '2024-01-01',
        dueDate: '2024-01-15',
        paidDate: '2024-01-12',
        template: 'pro',
        notes: 'Website redesign project',
        paymentLink: 'https://checkout.stripe.com/pay/cs_test_123',
        hasPaymentLink: true
      },
      {
        id: '2',
        invoiceNumber: 'INV-202401-002',
        clientName: 'TechStart Inc',
        clientEmail: 'sarah@techstart.com',
        amount: 850,
        status: 'pending',
        issueDate: '2024-01-05',
        dueDate: '2024-01-20',
        template: 'basic',
        notes: 'Logo design and branding',
        hasPaymentLink: false
      },
      {
        id: '3',
        invoiceNumber: 'INV-202401-003',
        clientName: 'Design Studio',
        clientEmail: 'mike@designstudio.com',
        amount: 2100,
        status: 'overdue',
        issueDate: '2023-12-20',
        dueDate: '2024-01-10',
        template: 'etsy',
        notes: 'Full website development',
        hasPaymentLink: false
      },
      {
        id: '4',
        invoiceNumber: 'INV-202401-004',
        clientName: 'Marketing Agency',
        clientEmail: 'lisa@marketing.com',
        amount: 650,
        status: 'draft',
        issueDate: '2024-01-15',
        dueDate: '2024-02-15',
        template: 'basic',
        notes: 'Social media management',
        hasPaymentLink: false
      },
      {
        id: '5',
        invoiceNumber: 'INV-202401-005',
        clientName: 'Creative Solutions',
        clientEmail: 'tom@creative.com',
        amount: 1800,
        status: 'sent',
        issueDate: '2024-01-10',
        dueDate: '2024-02-10',
        template: 'pro',
        notes: 'Mobile app design',
        paymentLink: 'https://checkout.stripe.com/pay/cs_test_456',
        hasPaymentLink: true
      }
    ]
    setInvoices(mockInvoices)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'overdue':
        return 'bg-red-100 text-red-800'
      case 'sent':
        return 'bg-blue-100 text-blue-800'
      case 'draft':
        return 'bg-gray-100 text-gray-800'
      case 'cancelled':
        return 'bg-gray-100 text-gray-600'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="h-4 w-4" />
      case 'pending':
        return <Clock className="h-4 w-4" />
      case 'overdue':
        return <AlertCircle className="h-4 w-4" />
      case 'sent':
        return <Send className="h-4 w-4" />
      case 'draft':
        return <FileText className="h-4 w-4" />
      case 'cancelled':
        return <FileText className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP'
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB')
  }

  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date()
    const due = new Date(dueDate)
    const diffTime = due.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const handleStatusChange = async (invoiceId: string, newStatus: Invoice['status']) => {
    try {
      // Update local state immediately for better UX
      setInvoices(prev => prev.map(invoice => 
        invoice.id === invoiceId 
          ? { 
              ...invoice, 
              status: newStatus,
              paidDate: newStatus === 'paid' ? new Date().toISOString() : invoice.paidDate
            }
          : invoice
      ))

      // Call API to update status
      const response = await fetch(`/api/invoices/${invoiceId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          status: newStatus,
          paidDate: newStatus === 'paid' ? new Date().toISOString() : undefined
        })
      })

      if (!response.ok) {
        throw new Error('Failed to update status')
      }

      toast.success(`Invoice marked as ${newStatus}`)
      
      // Clear bulk selection if this was a bulk action
      if (bulkActions.includes(invoiceId)) {
        setBulkActions(prev => prev.filter(id => id !== invoiceId))
      }
    } catch (error) {
      // Revert local state on error
      setInvoices(prev => prev.map(invoice => 
        invoice.id === invoiceId 
          ? { ...invoice, status: invoices.find(i => i.id === invoiceId)?.status || 'draft' }
          : invoice
      ))
      toast.error('Failed to update invoice status. Please try again.')
    }
  }

  const handleBulkStatusChange = async (newStatus: Invoice['status']) => {
    if (bulkActions.length === 0) {
      toast.error('Please select invoices first')
      return
    }

    try {
      // Update all selected invoices
      const promises = bulkActions.map(invoiceId => 
        handleStatusChange(invoiceId, newStatus)
      )
      
      await Promise.all(promises)
      
      toast.success(`${bulkActions.length} invoices updated to ${newStatus}`)
      setBulkActions([])
    } catch (error) {
      toast.error('Failed to update some invoices. Please try again.')
    }
  }

  const toggleBulkSelection = (invoiceId: string) => {
    setBulkActions(prev => 
      prev.includes(invoiceId) 
        ? prev.filter(id => id !== invoiceId)
        : [...prev, invoiceId]
    )
  }

  const handleDelete = async (invoiceId: string) => {
    if (confirm('Are you sure you want to delete this invoice? This action cannot be undone.')) {
      try {
        const updatedInvoices = invoices.filter(invoice => invoice.id !== invoiceId)
        setInvoices(updatedInvoices)
        toast.success('Invoice deleted successfully!')
      } catch (error) {
        toast.error('Failed to delete invoice. Please try again.')
      }
    }
  }

  const handleSend = async (invoice: Invoice) => {
    try {
      // Send invoice via email API
      const response = await fetch('/api/email/send-invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          invoiceId: invoice.id,
          clientEmail: invoice.clientEmail,
          clientName: invoice.clientName,
          amount: invoice.amount,
          dueDate: invoice.dueDate
        })
      })
      
      if (response.ok) {
        // Update status to 'sent' after successful email
        await handleStatusChange(invoice.id, 'sent')
        toast.success('Invoice sent successfully!')
      } else {
        throw new Error('Failed to send invoice')
      }
    } catch (error) {
      toast.error('Failed to send invoice. Please try again.')
    }
  }

  const handleDownload = async (invoice: Invoice) => {
    try {
      // Import PDF generator dynamically
      const { downloadInvoicePDF } = await import('@/lib/pdfGenerator')
      
      // Get user profile data for company details
      const userProfile = JSON.parse(localStorage.getItem('invoicezap_userProfile') || '{}')
      
      const pdfData: InvoiceData = {
        invoiceNumber: invoice.invoiceNumber,
        issueDate: invoice.issueDate,
        dueDate: invoice.dueDate,
        clientName: invoice.clientName,
        clientEmail: invoice.clientEmail,
        clientAddress: 'Client Address', // Default value since not in Invoice interface
        lineItems: [
          {
            description: 'Service',
            quantity: 1,
            rate: invoice.amount,
            amount: invoice.amount
          }
        ], // Default line item
        subtotal: invoice.amount,
        taxRate: 0,
        taxAmount: 0,
        total: invoice.amount,
        notes: invoice.notes,
        template: invoice.template || 'modern-professional',
        companyName: userProfile.company || 'Your Company Name',
        companyAddress: userProfile.address || 'Your Address',
        companyEmail: userProfile.email || 'your@email.com',
        companyPhone: userProfile.phone || '+44 20 1234 5678'
      }
      
      downloadInvoicePDF(pdfData)
      toast.success('PDF download started!')
    } catch (error) {
      toast.error('Failed to generate PDF. Please try again.')
    }
  }

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.clientEmail.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || invoice.status === filterStatus
    const matchesDate = filterDate === 'all' || 
                       (filterDate === 'overdue' && invoice.status === 'overdue') ||
                       (filterDate === 'due-soon' && getDaysUntilDue(invoice.dueDate) <= 7 && invoice.status !== 'paid')
    return matchesSearch && matchesStatus && matchesDate
  })

  const stats = {
    total: invoices.length,
    paid: invoices.filter(i => i.status === 'paid').length,
    pending: invoices.filter(i => i.status === 'pending').length,
    overdue: invoices.filter(i => i.status === 'overdue').length,
    draft: invoices.filter(i => i.status === 'draft').length,
    sent: invoices.filter(i => i.status === 'sent').length,
    withPaymentLinks: invoices.filter(i => i.hasPaymentLink).length,
    totalRevenue: invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.amount, 0),
    pendingRevenue: invoices.filter(i => i.status === 'pending').reduce((sum, i) => sum + i.amount, 0),
    overdueRevenue: invoices.filter(i => i.status === 'overdue').reduce((sum, i) => sum + i.amount, 0)
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Invoices</h1>
            <Link 
              href="/invoice/new" 
              className="btn-primary inline-flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>New Invoice</span>
            </Link>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="card">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Invoices</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Paid Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalRevenue)}</p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.pendingRevenue)}</p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center">
                <div className="p-2 bg-red-100 rounded-lg">
                  <AlertCircle className="h-6 w-6 text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Overdue Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.overdueRevenue)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bulk Actions */}
          {bulkActions.length > 0 && (
            <div className="card mb-6 bg-blue-50 border-blue-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-medium text-blue-900">
                    {bulkActions.length} invoice(s) selected
                  </span>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleBulkStatusChange('paid')}
                      className="btn-secondary text-sm px-3 py-1"
                    >
                      Mark as Paid
                    </button>
                    <button
                      onClick={() => handleBulkStatusChange('pending')}
                      className="btn-secondary text-sm px-3 py-1"
                    >
                      Mark as Pending
                    </button>
                    <button
                      onClick={() => handleBulkStatusChange('overdue')}
                      className="btn-secondary text-sm px-3 py-1"
                    >
                      Mark as Overdue
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => setBulkActions([])}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Clear Selection
                </button>
              </div>
            </div>
          )}

          {/* Search and Filter */}
          <div className="card mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search invoices by number, client, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-field pl-10"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="input-field max-w-xs"
              >
                <option value="all">All Status</option>
                <option value="draft">Draft</option>
                <option value="sent">Sent</option>
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="overdue">Overdue</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <select
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="input-field max-w-xs"
              >
                <option value="all">All Dates</option>
                <option value="overdue">Overdue</option>
                <option value="due-soon">Due Soon (≤7 days)</option>
              </select>
            </div>
          </div>

          {/* Invoices Table */}
          <div className="card">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <input
                        type="checkbox"
                        checked={bulkActions.length === filteredInvoices.length && filteredInvoices.length > 0}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setBulkActions(filteredInvoices.map(i => i.id))
                          } else {
                            setBulkActions([])
                          }
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Invoice
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Client
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Issue Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Due Date
                    </th>
                    <th className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredInvoices.map((invoice) => (
                    <tr key={invoice.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={bulkActions.includes(invoice.id)}
                          onChange={() => toggleBulkSelection(invoice.id)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link 
                          href={`/invoice/${invoice.id}`}
                          className="text-blue-600 hover:text-blue-700 font-medium"
                        >
                          {invoice.invoiceNumber}
                        </Link>
                        {invoice.notes && (
                          <p className="text-sm text-gray-500 mt-1">{invoice.notes}</p>
                        )}
                        {invoice.hasPaymentLink && (
                          <div className="flex items-center mt-1">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <DollarSign className="h-3 w-3 mr-1" />
                              Payment Link
                            </span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{invoice.clientName}</div>
                          <div className="text-sm text-gray-500">{invoice.clientEmail}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatCurrency(invoice.amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="space-y-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                            {getStatusIcon(invoice.status)}
                            <span className="ml-1 capitalize">{invoice.status}</span>
                          </span>
                          
                          {/* Status Management Checkboxes */}
                          <div className="flex flex-wrap gap-2">
                            <label className="flex items-center space-x-1 text-xs">
                              <input
                                type="checkbox"
                                checked={invoice.status === 'paid'}
                                onChange={() => handleStatusChange(invoice.id, 'paid')}
                                className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                              />
                              <span className="text-gray-600">Paid</span>
                            </label>
                            
                            <label className="flex items-center space-x-1 text-xs">
                              <input
                                type="checkbox"
                                checked={invoice.status === 'pending'}
                                onChange={() => handleStatusChange(invoice.id, 'pending')}
                                className="rounded border-gray-300 text-yellow-600 focus:ring-yellow-500"
                              />
                              <span className="text-gray-600">Pending</span>
                            </label>
                            
                            <label className="flex items-center space-x-1 text-xs">
                              <input
                                type="checkbox"
                                checked={invoice.status === 'overdue'}
                                onChange={() => handleStatusChange(invoice.id, 'overdue')}
                                className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                              />
                              <span className="text-gray-600">Overdue</span>
                            </label>
                          </div>
                          
                          {invoice.status === 'overdue' && (
                            <div className="text-xs text-red-600">
                              {Math.abs(getDaysUntilDue(invoice.dueDate))} days overdue
                            </div>
                          )}
                          {invoice.status === 'pending' && getDaysUntilDue(invoice.dueDate) <= 7 && (
                            <div className="text-xs text-yellow-600">
                              Due in {getDaysUntilDue(invoice.dueDate)} days
                            </div>
                          )}
                          {invoice.status === 'paid' && invoice.paidDate && (
                            <div className="text-xs text-green-600">
                              Paid on {formatDate(invoice.paidDate)}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(invoice.issueDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(invoice.dueDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <Link
                            href={`/invoice/${invoice.id}`}
                            className="text-gray-400 hover:text-blue-600 p-1"
                            title="View"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                          <Link
                            href={`/invoice/${invoice.id}/edit`}
                            className="text-gray-400 hover:text-green-600 p-1"
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
                          </Link>
                          <button
                            onClick={() => handleDownload(invoice)}
                            className="text-gray-400 hover:text-purple-600 p-1"
                            title="Download PDF"
                          >
                            <Download className="h-4 w-4" />
                          </button>
                          {invoice.status === 'draft' && (
                            <button
                              onClick={() => handleSend(invoice)}
                              className="text-gray-400 hover:text-blue-600 p-1"
                              title="Send"
                            >
                              <Send className="h-4 w-4" />
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(invoice.id)}
                            className="text-gray-400 hover:text-red-600 p-1"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredInvoices.length === 0 && (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No invoices found</h3>
                <p className="text-gray-500 mb-4">
                  {searchTerm || filterStatus !== 'all' || filterDate !== 'all'
                    ? 'Try adjusting your search or filter criteria.'
                    : 'Get started by creating your first invoice.'
                  }
                </p>
                {!searchTerm && filterStatus === 'all' && filterDate === 'all' && (
                  <Link href="/invoice/new" className="btn-primary">
                    Create Your First Invoice
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
